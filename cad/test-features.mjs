import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir, readFile} from 'node:fs/promises';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const origin = process.env.CAD_FEATURE_ORIGIN || 'http://127.0.0.1:8795';
const proof = process.env.CAD_FEATURE_OUTPUT || '/tmp/form3d-features-test';
const server = process.env.CAD_FEATURE_ORIGIN ? null : spawn('python3', ['-m', 'http.server', '8795', '--bind', '127.0.0.1'], {cwd: root, stdio: 'ignore'});
const storage = 'dsteckler-form3d-v1';
await mkdir(proof, {recursive: true});

function body(id, type = 'box', dimensions = [40, 30, 10], position = [0, 0, 5], rotation = [0, 0, 0]) {
  return {id: id.replace(/[^a-z0-9_-]/gi, '-'), name: id, type, dimensions, position, rotation, color: '#5687bd', visible: true, locked: false};
}
function fixture(name, bodies = []) { return {version: 1, units: 'mm', name, bodies}; }
function near(actual, expected, message, tolerance = 0.02) {
  assert(Math.abs(actual - expected) <= tolerance, `${message}: ${actual} should equal ${expected}`);
}

let browser, page;
try {
  for (let attempt = 0; attempt < 60; attempt++) {
    try { if ((await fetch(origin + '/cad/')).ok) break; } catch {}
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  browser = await chromium.launch({executablePath: process.env.BROWSER_EXECUTABLE || undefined, headless: true, args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader']});
  const context = await browser.newContext({viewport: {width: 1440, height: 1000}, acceptDownloads: true});
  await context.addInitScript(({storage, project}) => {
    if (!sessionStorage.getItem('form3d-feature-fixture')) {
      localStorage.setItem(storage, JSON.stringify(project));
      sessionStorage.setItem('form3d-feature-fixture', 'set');
    }
  }, {storage, project: fixture('Mode preservation', [body('Original plate')])});
  page = await context.newPage();
  const errors = [], remote = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => {
    if (!request.url().startsWith(origin) && !request.url().startsWith('blob:') && !request.url().startsWith('data:')) remote.push(request.url());
  });

  async function ready() { await page.waitForFunction(() => document.documentElement.dataset.ready === 'true'); }
  async function saved() {
    await page.waitForFunction(() => document.querySelector('#save-status').textContent === 'Saved in this browser');
    return page.evaluate(storage => JSON.parse(localStorage.getItem(storage)), storage);
  }
  async function set(selector, value) {
    await page.locator(selector).fill(String(value));
    await page.locator(selector).press('Tab');
  }
  async function tool(selector) {
    const locator = page.locator(selector);
    await locator.evaluate(element => {
      for (let parent = element.parentElement; parent; parent = parent.parentElement) {
        if (parent.tagName === 'DETAILS') parent.open = true;
      }
    });
    await locator.click();
    await locator.evaluate(element => {
      for (let parent = element.parentElement; parent; parent = parent.parentElement) {
        if (parent.tagName === 'DETAILS') parent.open = false;
      }
    });
  }
  async function load(project) {
    await page.locator('#file-input').setInputFiles({name: 'fixture.form3d', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(project))});
    await page.waitForFunction(name => document.querySelector('#confirm-dialog').open || document.querySelector('#project-name').value === name, project.name);
    if (await page.locator('#confirm-dialog').evaluate(dialog => dialog.open)) await page.locator('#confirm-accept').click();
    await page.waitForFunction(name => document.querySelector('#project-name').value === name, project.name);
    await saved();
  }
  async function select(indices) {
    for (const [step, index] of indices.entries()) await page.locator('.body-select').nth(index).click(step ? {modifiers: ['Shift']} : {});
  }
  async function volumes() {
    await saved();
    return page.evaluate(async storage => {
      const {estimateVolume} = await import('./model.js');
      return JSON.parse(localStorage.getItem(storage)).bodies.map(b => estimateVolume(b));
    }, storage);
  }
  async function bounds() {
    await saved();
    return page.evaluate(async storage => {
      const {calculateBounds} = await import('./model.js');
      return JSON.parse(localStorage.getItem(storage)).bodies.map(b => calculateBounds([b]));
    }, storage);
  }

  await page.goto(origin + '/cad/'); await ready();
  assert.equal(await page.locator('#experience-mode').inputValue(), 'beginner');
  const original = await page.evaluate(storage => JSON.parse(localStorage.getItem(storage)), storage);
  await page.locator('#experience-mode').selectOption('advanced');
  await page.locator('#experience-mode').selectOption('beginner');
  assert.deepEqual(await page.evaluate(storage => JSON.parse(localStorage.getItem(storage)).bodies, storage), original.bodies, 'Switching modes preserves the design');
  await page.locator('#experience-mode').selectOption('advanced');
  await page.reload(); await ready();
  assert.equal(await page.locator('#experience-mode').inputValue(), 'advanced', 'Experience preference survives reload');
  assert.equal(await page.locator('#body-count').innerText(), '1');
  console.log('PASS beginner/advanced mode switching preserves geometry and remembers the preference');

  await load(fixture('Shape controls'));
  await tool('[data-add="roundedbox"]');
  await set('#corner-radius', 3);
  let project = await saved(); assert.equal(project.bodies[0].type, 'roundedbox'); assert.equal(project.bodies[0].params.radius, 3);
  const before = project.bodies[0].dimensions;
  await page.locator('#aspect-lock').check();
  await set('[data-dimension="0"]', before[0] * 1.5);
  project = await saved();
  project.bodies[0].dimensions.forEach((dimension, axis) => near(dimension, before[axis] * 1.5, 'Aspect lock scales all dimensions'));
  await page.locator('#aspect-lock').uncheck();
  await tool('[data-add="tube"]'); await set('#tube-wall', 2.5);
  project = await saved(); assert.equal(project.bodies.at(-1).type, 'tube'); assert.equal(project.bodies.at(-1).params.wall, 2.5);
  const tubeVolume = (await volumes()).at(-1), tube = project.bodies.at(-1);
  assert(tubeVolume > 0 && tubeVolume < Math.PI * tube.dimensions[0] * tube.dimensions[1] / 4 * tube.dimensions[2], 'Tube wall creates an actual open bore');
  await tool('[data-add="wedge"]'); project = await saved(); assert.equal(project.bodies.at(-1).type, 'wedge');
  console.log('PASS rounded corners, tube walls, wedge geometry, and proportional sizing');

  await load(fixture('Letter geometry'));
  await page.locator('#text-start').click();
  await page.locator('#text-content').fill('O'); await page.locator('#text-height').fill('12'); await page.locator('#text-depth').fill('2');
  await page.locator('#text-action').selectOption('standalone'); await page.locator('#text-submit').click();
  project = await saved(); assert.equal(project.bodies.length, 1); assert.equal(project.bodies[0].type, 'text'); assert.equal(project.bodies[0].text, 'O');
  const letterVolume = (await volumes())[0], letter = project.bodies[0];
  assert(letterVolume > 0 && letterVolume < letter.dimensions.reduce((a, b) => a * b) * 0.9, 'The O is an extruded glyph with a real opening');
  await set('#body-text', 'BOX'); project = await saved(); assert.equal(project.bodies[0].text, 'BOX');
  for (const action of ['raised', 'engraved']) {
    await load(fixture('Text ' + action, [body('Text plate', 'box', [60, 40, 10], [0, 0, 5])]));
    await select([0]);
    await page.locator('#text-start').click();
    await page.locator('#text-content').fill('O'); await page.locator('#text-height').fill('12'); await page.locator('#text-depth').fill('2');
    await page.locator('#text-action').selectOption(action); await page.locator('#text-submit').click();
    await page.waitForFunction(storage => JSON.parse(localStorage.getItem(storage)).bodies.some(b => b.type === 'custom'), storage);
    project = await saved(); assert.equal(project.bodies.length, 1, 'Applied text becomes part of the selected solid');
    const volume = (await volumes())[0];
    assert(action === 'raised' ? volume > 24001 : volume < 23999, `${action} text changes the actual solid volume`);
  }
  await load(fixture('No-op engraving', [body('Open tube', 'tube', [60, 60, 12], [0, 0, 6])]));
  const beforeNoOp = JSON.stringify((await saved()).bodies);
  await select([0]); await page.locator('#text-start').click();
  await page.locator('#text-content').fill('O'); await page.locator('#text-height').fill('12'); await page.locator('#text-depth').fill('2');
  await page.locator('#text-action').selectOption('engraved'); await page.locator('#text-submit').click();
  assert.equal(await page.locator('#text-dialog').evaluate(dialog => dialog.open), true, 'Unsuccessful engraving keeps its dialog open');
  assert.match(await page.locator('#text-feedback').innerText(), /did not touch|no .*surface|overlap|intersect/i);
  assert.equal(JSON.stringify((await saved()).bodies), beforeNoOp, 'Engraving over an empty tube opening preserves the original solid');
  await page.locator('#text-cancel').click();
  console.log('PASS editable extruded text, raised/engraved lettering, and no-op engraving preservation with visible feedback');

  await load(fixture('Reference alignment', [body('Reference', 'box', [10, 20, 12], [-25, 0, 6], [0, 0, 30]), body('Mover', 'box', [8, 8, 8], [30, 10, 10])]));
  await select([0, 1]); await tool('[data-align-axis="0"][data-align-anchor="max"]');
  project = await saved(); assert.deepEqual(project.bodies[0].position, [-25, 0, 6], 'The first alignment reference stays fixed');
  let boxes = await bounds(); near(boxes[1].max[0], boxes[0].max[0], 'Alignment uses world bounds of rotated bodies');
  assert.match(await page.locator('#measurement-size').innerText(), /\d/); assert.match(await page.locator('#measurement-volume').innerText(), /\d/);
  await load(fixture('Even distribution', [body('Left', 'box', [8, 8, 10], [-20, 0, 5]), body('Middle', 'box', [8, 8, 10], [7, 0, 5]), body('Right', 'box', [8, 8, 10], [20, 0, 5])]));
  await select([0, 1, 2]); await tool('[data-distribute="0"]');
  project = await saved(); assert.deepEqual(project.bodies.map(b => b.position[0]), [-20, 0, 20], 'Distribution spaces centers while retaining the endpoints');
  await load(fixture('Mirror solid', [body('Wedge', 'wedge', [20, 10, 15], [10, 0, 7.5], [0, 0, 25])]));
  await select([0]); await tool('[data-mirror="0"]');
  project = await saved(); assert.equal(project.bodies.length, 2); assert.notEqual(project.bodies[0].id, project.bodies[1].id);
  const mirroredVolumes = await volumes(); assert(mirroredVolumes.every(value => value > 0)); near(mirroredVolumes[1], mirroredVolumes[0], 'Mirroring preserves solid volume', 0.1);
  await load(fixture('Linear repeat', [body('Pattern box', 'box', [10, 8, 10], [-5, 0, 5])]));
  await select([0]); await tool('#pattern-start');
  await page.locator('#pattern-type').selectOption('linear'); await page.locator('#pattern-axis').selectOption('0');
  await page.locator('#pattern-count').fill('4'); await page.locator('#pattern-spacing').fill('18'); await page.locator('#pattern-submit').click();
  project = await saved(); assert.equal(project.bodies.length, 4); assert.deepEqual(project.bodies.map(b => b.position[0]).sort((a, b) => a - b), [-5, 13, 31, 49]);
  await load(fixture('Radial repeat', [body('Bolt', 'box', [8, 8, 10], [20, 0, 5])]));
  await select([0]); await tool('#pattern-start');
  await page.locator('#pattern-type').selectOption('radial'); await page.locator('#pattern-axis').selectOption('2'); await page.locator('#pattern-center').selectOption('origin');
  await page.locator('#pattern-count').fill('4'); await page.locator('#pattern-angle').fill('360'); await page.locator('#pattern-submit').click();
  project = await saved(); assert.equal(project.bodies.length, 4);
  assert.deepEqual(project.bodies.map(b => b.position.slice(0, 2).map(n => Math.round(n)).join(',')).sort(), ['-20,0', '0,-20', '0,20', '20,0'].sort());
  console.log('PASS fixed-reference alignment, center distribution, measurement output, mirrored solids, and linear/radial patterns');

  await load(fixture('STL source', [body('Millimeter part', 'box', [18, 24, 8], [12, -5, 16])]));
  if (await page.locator('#export-selected').count()) await page.locator('#export-selected').uncheck();
  const downloadEvent = page.waitForEvent('download'); await page.locator('#export-stl').click();
  const download = await downloadEvent; await download.saveAs(proof + '/part.stl');
  const binary = await readFile(proof + '/part.stl'); assert.equal(binary.length, 84 + binary.readUInt32LE(80) * 50);
  if (await page.locator('#stl-units').count()) await page.locator('#stl-units').selectOption('mm');
  await page.locator('#stl-input').setInputFiles(proof + '/part.stl');
  await page.waitForFunction(() => document.querySelector('#body-count').textContent === '2'); project = await saved();
  boxes = await bounds(); boxes[1].size.forEach((value, axis) => near(value, [18, 24, 8][axis], 'Imported STL retains millimeter scale'));
  near(boxes[1].min[2], 0, 'Imported STL rests on the grid'); near(boxes[1].center[0], 0, 'Imported STL centers X'); near(boxes[1].center[1], 0, 'Imported STL centers Y');
  const beforeBadImport = JSON.stringify(project.bodies), previousStatus = await page.locator('#status-message').innerText();
  await page.locator('#stl-input').setInputFiles({name: 'invalid.stl', mimeType: 'model/stl', buffer: Buffer.from('solid broken\nendsolid broken')});
  await page.waitForFunction(previous => document.querySelector('#status-message').textContent !== previous, previousStatus);
  assert.match(await page.locator('#status-message').innerText(), /could not|invalid|no .*triangle|failed|must|cannot|empty|parse/i);
  assert.equal(JSON.stringify((await saved()).bodies), beforeBadImport, 'Malformed STL does not change the current design');
  console.log('PASS binary STL import preserves scale/placement and rejects malformed files without data loss');

  await load(fixture('Vertical workplane'));
  await page.locator('#projection-mode').selectOption('orthographic'); await page.locator('#wireframe-enabled').check();
  await page.locator('#sketch-start').click(); await page.locator('#sketch-plane').selectOption('xz'); await set('#sketch-offset', 3);
  await page.locator('[data-sketch="rectangle"]').click();
  let canvas = await page.locator('#viewport canvas').boundingBox();
  let x = canvas.x + canvas.width * 0.45, y = canvas.y + canvas.height * 0.3;
  await page.mouse.move(x, y); await page.mouse.down(); await page.mouse.move(x + 110, y + 90, {steps: 12}); await page.mouse.up();
  await page.locator('#sketch-height').fill('8'); await page.locator('#sketch-finish').click();
  project = await saved(); assert.equal(project.bodies.length, 1);
  boxes = await bounds(); near(boxes[0].size[1], 8, 'XZ sketch extrudes along the Y normal'); near(boxes[0].max[1], -3, 'XZ offset follows its negative Y normal'); assert(boxes[0].size[0] > 0.1 && boxes[0].size[2] > 0.1);
  await page.locator('#sketch-start').click(); await page.locator('#sketch-plane').selectOption('xy'); await set('#sketch-offset', 0); await page.locator('[data-sketch="polygon"]').click();
  canvas = await page.locator('#viewport canvas').boundingBox(); x = canvas.x + canvas.width * 0.45; y = canvas.y + canvas.height * 0.3;
  for (const [dx, dy] of [[0, 0], [110, 0], [100, 90], [0, 70]]) await page.mouse.click(x + dx, y + dy);
  await page.locator('#sketch-undo-point').click(); await page.locator('#sketch-finish').click();
  project = await saved(); assert.equal(project.bodies.at(-1).points.length, 3, 'Undo corner removes the last polygon vertex');
  await page.locator('#wireframe-enabled').uncheck();
  await page.screenshot({path: proof + '/advanced-workspace.png'});
  console.log('PASS orthographic workspace, vertical sketch extrusion, plane offset, and undoing a polygon corner');

  await page.locator('#stl-units').selectOption('in');
  await page.locator('#export-selected').check();
  const beforeBeginner = JSON.stringify((await saved()).bodies);
  await page.locator('#experience-mode').selectOption('beginner');
  assert.equal(await page.locator('#stl-units').inputValue(), 'mm', 'Beginner mode resets hidden STL units to millimeters');
  assert.equal(await page.locator('#export-selected').isChecked(), false, 'Beginner mode exports the visible design rather than a hidden selection setting');
  assert.equal(JSON.stringify((await saved()).bodies), beforeBeginner, 'Experience switches do not alter geometry while resetting file options');
  const bodyCount = Number(await page.locator('#body-count').innerText());
  assert(bodyCount > 0); assert.equal(await page.locator('#beginner-guide').isVisible(), true);
  await page.setViewportSize({width: 390, height: 844});
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await page.screenshot({path: proof + '/beginner-mobile.png'});
  await page.locator('#experience-mode').selectOption('advanced');
  assert.equal(Number(await page.locator('#body-count').innerText()), bodyCount, 'Mobile mode changes preserve geometry');
  assert.deepEqual(errors, [], 'Feature workflows have no uncaught browser errors');
  assert.deepEqual(remote, [], 'Expanded tools keep all data and runtime dependencies local');
  console.log('PASS mobile experience switching, beginner guidance, no login/remote requests, and no browser errors');
  await context.close();
} catch (error) {
  await page?.screenshot({path: proof + '/failure.png'}).catch(() => {});
  throw error;
} finally {
  await browser?.close(); server?.kill();
}
