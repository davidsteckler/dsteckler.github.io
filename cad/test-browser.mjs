import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir, readFile} from 'node:fs/promises';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const origin = process.env.CAD_TEST_ORIGIN || 'http://127.0.0.1:8794';
const proof = process.env.CAD_TEST_OUTPUT || '/tmp/form3d-test';
const server = process.env.CAD_TEST_ORIGIN ? null : spawn('python3', ['-m', 'http.server', '8794', '--bind', '127.0.0.1'], {cwd: root, stdio: 'ignore'});
await mkdir(proof, {recursive: true});
let browser;
try {
  for (let attempt = 0; attempt < 60; attempt++) {
    try { if ((await fetch(origin + '/cad/')).ok) break; } catch {}
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  browser = await chromium.launch({executablePath: process.env.BROWSER_EXECUTABLE || undefined, headless: true, args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader']});
  const context = await browser.newContext({viewport: {width: 1440, height: 950}, acceptDownloads: true});
  const page = await context.newPage(), errors = [], remote = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => { if (!request.url().startsWith(origin) && !request.url().startsWith('blob:') && !request.url().startsWith('data:')) remote.push(request.url()); });
  await page.goto(origin + '/cad/');
  await page.waitForFunction(() => document.documentElement.dataset.ready === 'true');
  assert.equal(await page.locator('#body-count').innerText(), '1', 'The initial bracket is actual editable geometry');
  await page.locator('#dismiss-welcome').click();
  await page.screenshot({path: proof + '/workspace-desktop.png'});
  await page.locator('#new-project').click(); await page.locator('#confirm-accept').click();
  assert.equal(await page.locator('#body-count').innerText(), '0');

  async function set(selector, value) { await page.locator(selector).fill(String(value)); await page.locator(selector).press('Tab'); }
  async function waitSaved() { await page.waitForFunction(() => document.querySelector('#save-status').textContent === 'Saved in this browser'); }
  async function saved() { await waitSaved(); return page.evaluate(() => JSON.parse(localStorage.getItem('dsteckler-form3d-v1'))); }
  await page.locator('[data-add="box"]').click();
  await set('#body-name', 'Plate');
  await set('[data-dimension="0"]', 40); await set('[data-dimension="1"]', 30); await set('[data-dimension="2"]', 10);
  await page.locator('#drop-body').click(); await page.locator('#center-body').click();
  let project = await saved();
  assert.deepEqual(project.bodies[0].dimensions, [40, 30, 10]);
  assert.deepEqual(project.bodies[0].position, [0, 0, 5]);
  await page.locator('[data-add="cylinder"]').click();
  await set('[data-dimension="0"]', 12); await set('[data-dimension="1"]', 12); await set('[data-dimension="2"]', 14);
  await set('[data-position="0"]', 0); await set('[data-position="1"]', 0); await set('[data-position="2"]', 5);
  await page.locator('.body-select').nth(0).click();
  await page.locator('.body-select').nth(1).click({modifiers: ['Shift']});
  await page.locator('[data-boolean="subtract"]').click();
  await page.waitForFunction(() => document.querySelector('#body-count').textContent === '1');
  project = await saved(); assert.equal(project.bodies[0].type, 'custom');
  const volume = await page.evaluate(async () => { const {estimateVolume} = await import('./model.js'); return estimateVolume(JSON.parse(localStorage.getItem('dsteckler-form3d-v1')).bodies); });
  assert(Math.abs(volume - (12000 - Math.PI * 36 * 10)) < 10, 'Subtraction removes a real through-hole');
  await page.locator('#undo').click(); assert.equal(await page.locator('#body-count').innerText(), '2');
  await page.locator('#redo').click(); assert.equal(await page.locator('#body-count').innerText(), '1');
  console.log('PASS primitives, exact dimensions, centering, grid drop, multi-selection, solid subtraction, undo and redo');

  const stlEvent = page.waitForEvent('download'); await page.locator('#export-stl').click();
  const stlDownload = await stlEvent; assert(stlDownload.suggestedFilename().endsWith('.stl')); await stlDownload.saveAs(proof + '/plate.stl');
  const binary = await readFile(proof + '/plate.stl');
  assert.equal(binary.length, 84 + binary.readUInt32LE(80) * 50); assert(binary.readUInt32LE(80) > 12);
  const projectEvent = page.waitForEvent('download'); await page.locator('#save-project').click();
  const projectDownload = await projectEvent; await projectDownload.saveAs(proof + '/plate.form3d');
  assert.equal(JSON.parse(await readFile(proof + '/plate.form3d', 'utf8')).bodies[0].type, 'custom');
  await page.locator('#new-project').click(); await page.locator('#confirm-accept').click();
  await page.locator('#file-input').setInputFiles(proof + '/plate.form3d');
  await page.waitForFunction(() => document.querySelector('#body-count').textContent === '1'); await waitSaved();
  await page.reload(); await page.waitForFunction(() => document.documentElement.dataset.ready === 'true');
  assert.equal(await page.locator('#body-count').innerText(), '1');
  await page.locator('#file-input').setInputFiles({name: 'invalid.form3d', mimeType: 'application/json', buffer: Buffer.from('{"version":99}')});
  assert.match(await page.locator('#status-message').innerText(), /Could not open project/);
  assert.equal(await page.locator('#body-count').innerText(), '1', 'Invalid import preserves the current design');
  console.log('PASS binary STL, editable project download/import, autosave restore and invalid import preservation');

  for (const shape of ['rectangle', 'circle', 'polygon']) {
    await page.locator('#sketch-start').click(); await page.locator(`[data-sketch="${shape}"]`).click();
    const box = await page.locator('#viewport canvas').boundingBox();
    const x = box.x + box.width * 0.47, y = box.y + box.height * 0.3;
    if (shape === 'polygon') {
      await page.mouse.click(x, y); await page.mouse.click(x + 110, y); await page.mouse.click(x + 70, y + 100); await page.mouse.click(x - 10, y + 65);
    } else {
      await page.mouse.move(x, y); await page.mouse.down(); await page.mouse.move(x + 100, y + 90, {steps: 12}); await page.mouse.up();
    }
    await page.locator('#sketch-height').fill('16');
    const previous = Number(await page.locator('#body-count').innerText());
    await page.locator('#sketch-finish').click();
    assert.equal(await page.locator('#sketch-bar').isHidden(), true, `${shape} sketch extrudes successfully`);
    assert.equal(Number(await page.locator('#body-count').innerText()), previous + 1);
    project = await saved(); assert.equal(project.bodies.at(-1).dimensions[2], 16);
  }
  console.log('PASS rectangle, circle and polygon sketches extrude into editable solids');

  await page.locator('#duplicate').click(); const count = Number(await page.locator('#body-count').innerText());
  await page.locator('#delete-body').click(); assert.equal(Number(await page.locator('#body-count').innerText()), count - 1);
  await page.locator('#undo').click(); assert.equal(Number(await page.locator('#body-count').innerText()), count);
  const name = await page.locator('#body-name').inputValue();
  await page.getByRole('button', {name: `Hide ${name}`, exact: true}).click();
  await page.getByRole('button', {name: `Show ${name}`, exact: true}).click();
  await page.locator('.body-select').last().click();
  await page.getByRole('button', {name: `Lock ${name}`, exact: true}).click();
  assert.equal(await page.locator('[data-dimension="0"]').isDisabled(), true);
  await page.getByRole('button', {name: `Unlock ${name}`, exact: true}).click();
  assert.equal(await page.locator('[data-dimension="0"]').isDisabled(), false);
  console.log('PASS duplicate/delete/undo and per-body visibility/locking');

  await page.setViewportSize({width: 390, height: 844});
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await page.locator('#panel-toggle').click();
  assert.equal(await page.locator('#body-name').isVisible(), true);
  await page.waitForFunction(() => { const r = document.querySelector('#properties-panel').getBoundingClientRect(); return r.x >= 0 && r.right <= innerWidth + 0.5; });
  const field = await page.locator('#body-name').boundingBox(); assert(field.x >= 0 && field.x + field.width <= 391);
  await page.screenshot({path: proof + '/properties-mobile.png'});
  await page.locator('#panel-toggle').click();
  await page.waitForFunction(() => document.querySelector('#properties-panel').getBoundingClientRect().x >= innerWidth - 0.5);
  await page.screenshot({path: proof + '/workspace-mobile.png'});
  assert.deepEqual(remote, [], 'The application has no remote runtime dependencies or login requests');
  assert.deepEqual(errors, [], 'No uncaught browser errors');
  console.log('PASS mobile viewport/inspector, no login or external requests, no browser errors');
  await context.close();
} finally {
  await browser?.close(); server?.kill();
}
