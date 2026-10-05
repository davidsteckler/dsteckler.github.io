import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';

const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const origin='http://127.0.0.1:8786';
const proof=process.env.LEARNING_HOME_PROOF||'/tmp/learning-home-proof';fs.mkdirSync(proof,{recursive:true});
const server=spawn('python3',['-m','http.server','8786','--bind','127.0.0.1'],{cwd:root,stdio:'ignore'});
let browser;
try {
  for(let i=0;i<60;i++){try{await fetch(origin+'/learn/');break;}catch{await new Promise(r=>setTimeout(r,100));}}
  browser=await chromium.launch({executablePath:process.env.BROWSER_EXECUTABLE||undefined,headless:true,args:['--no-sandbox']});
  const context=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'});
  const deps=process.env.TURTLE_TEST_DEPS;
  if(deps)for(const [pattern,file] of [['**/codemirror.min.css','codemirror.css'],['**/codemirror.min.js','codemirror.js'],['**/mode/python/python.min.js','python.js'],['**/skulpt.min.js','skulpt.js'],['**/skulpt-stdlib.js','skulpt-stdlib.js']])await context.route(pattern,route=>route.fulfill({path:path.join(deps,file),contentType:file.endsWith('.css')?'text/css':'application/javascript'}));
  await context.route('**/www.googletagmanager.com/**',route=>route.abort());
  const errors=[];context.on('page',p=>p.on('pageerror',error=>errors.push(error.message)));
  const page=await context.newPage();
  await page.goto(origin+'/learn/');
  assert.equal(await page.locator('.habit-card').count(),4);
  assert.equal(await page.locator('.activity-card').count(),17);
  await page.locator('#learningSearch').fill('ASCII');assert.equal(await page.locator('.activity-card').count(),5);
  await page.locator('[data-filter="tool"]').click();assert.equal(await page.locator('.activity-card').count(),1);
  await page.locator('#learningSearch').fill('no-matches');assert(await page.locator('#noResults').isVisible());
  await page.locator('#learningSearch').fill('');await page.locator('[data-filter="all"]').click();
  await page.locator('[data-thinking="focus"]').click();
  await page.locator('#thinking-focus').fill('Build one thing I can explain.');
  await page.locator('#closeThinking').click();await page.reload();
  await page.locator('#openThinking').click();assert.equal(await page.locator('#thinking-focus').inputValue(),'Build one thing I can explain.');
  await page.keyboard.press('Escape');assert(!(await page.locator('#thinkingDialog').isVisible()));
  await page.evaluate(()=>{document.documentElement.style.scrollBehavior='auto';window.scrollTo({top:0,behavior:'instant'});});
  await page.screenshot({path:path.join(proof,'student-home-desktop.png'),fullPage:true});
  const targets=await page.locator('a[href^="/"]').evaluateAll(links=>[...new Set(links.map(a=>a.getAttribute('href')))]);
  for(const target of targets){const response=await context.request.get(origin+target);assert(response.ok(),target+' should exist');}
  await page.goto(origin+'/learn/python/?lesson=1-1-make-path&teacher=1');
  await page.waitForURL('**/pythoncourse/?lesson=1-1-make-path&teacher=1');
  assert.equal(await page.locator('.activity-tab').count(),21);
  let editor=page.frames().find(f=>f.url().includes('embed=course'));
  await editor.waitForSelector('.CodeMirror');
  assert.equal(await editor.locator('#studentNav').count(),0,'Embedded editors must not add navigation');
  await editor.locator('.CodeMirror').evaluate(el=>el.CodeMirror.setValue('forward(37)\nleft(90)\nforward(25)'));
  await page.locator('#openThinking').click();assert.equal(await page.locator('#thinking-focus').inputValue(),'','Activity notes must be separate from home notes');
  await page.locator('#thinking-focus').fill('Make the route shorter.');await page.locator('#closeThinking').click();
  await page.locator('#nextActivity').click();await page.waitForFunction(()=>document.querySelector('#lessonTitle').textContent==='Route Puzzle');
  await page.locator('#openThinking').click();assert.equal(await page.locator('#thinking-focus').inputValue(),'');await page.locator('#closeThinking').click();
  await page.goBack({waitUntil:'domcontentloaded'});await page.waitForFunction(()=>document.querySelector('#lessonTitle').textContent==='Make a Path');
  editor=page.frames().find(f=>f.url().includes('embed=course'));await editor.waitForSelector('.CodeMirror');
  assert.equal(await editor.locator('.CodeMirror').evaluate(el=>el.CodeMirror.getValue()),'forward(37)\nleft(90)\nforward(25)');
  await page.locator('#openThinking').click();assert.equal(await page.locator('#thinking-focus').inputValue(),'Make the route shorter.');
  const download=page.waitForEvent('download');await page.locator('#downloadThinking').click();assert.equal((await download).suggestedFilename(),'my-thinking.txt');
  await page.locator('#closeThinking').click();
  const bounds=await page.locator('#editorFrame').boundingBox();assert(bounds.y+ bounds.height<=901,'Course editor fits the viewport');
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth&&document.documentElement.scrollHeight<=innerHeight),'Course does not scroll the whole page');
  await page.locator('#courseMapButton').click();assert(await page.locator('.sidebar').isVisible());await page.keyboard.press('Escape');assert(!(await page.locator('.sidebar').isVisible()));
  const width=Number(await page.locator('#courseResizeDivider').getAttribute('aria-valuenow'));await page.locator('#courseResizeDivider').focus();await page.keyboard.press('ArrowRight');assert.equal(Number(await page.locator('#courseResizeDivider').getAttribute('aria-valuenow')),width+15);
  await page.screenshot({path:path.join(proof,'python-course-desktop.png')});
  await page.locator('.activity-tab[data-lesson="1-15-create-ascii"]').click();assert(await page.locator('#nextActivity').isEnabled());await page.locator('#nextActivity').click();assert.equal(await page.locator('#lessonTitle').innerText(),'Make a Loop');await page.locator('.activity-tab[data-lesson="2-6-create-pattern"]').click();assert(await page.locator('#nextActivity').isDisabled());await page.locator('.activity-tab[data-lesson="1-15-create-ascii"]').click();await page.reload();assert.equal(await page.locator('#lessonTitle').innerText(),'ASCII Dashboard');
  await page.goto(origin+'/learn/');assert((await page.locator('#continueLink').getAttribute('href')).includes('1-15-create-ascii'));
  await page.evaluate(()=>localStorage.setItem('dsteckler-pythoncourse-progress-v3-unit1',JSON.stringify({'1-1-make-path':true,'not-a-lesson':true})));
  await page.reload();assert.equal(await page.locator('#pythonProgress').innerText(),'1 / 21 complete');
  console.log('PASS home, search, aliases, four habits, notebook isolation/download, code drafts, course history/resume, progress and resizing');

  for(const [route,name] of [['/learn/reference/#color/hex','reference'],['/learn/trace/','trace'],['/turtleprojects/first-square/','tutorial'],['/learn/binary/','binary'],['/learn/think/','thinking'],['/learn/blackbox/','blackbox'],['/learn/create/','create'],['/learn/projects/','projects']]) {
    await page.goto(origin+route);await page.locator('#studentNav').waitFor();
    await page.waitForTimeout(350);
    if(name==='trace'){
      const frame=page.frames().find(f=>f.url().includes('embed=trace'));await frame.waitForSelector('.CodeMirror');
      await page.locator('#openThinking').click();await page.locator('#thinking-train').pressSequentially('I tried changing one number.');assert.equal(await page.locator('#thinking-train').inputValue(),'I tried changing one number.');await page.keyboard.press('Escape');
      const drawing=await frame.locator('.world-panel').boundingBox();assert(drawing.x+drawing.width<=1440&&drawing.y+drawing.height<=900,'Trace drawing remains in view beside code');
    }
    assert.equal(await page.locator('#studentNav').count(),1,route+' has one navigation bar');
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),route+' no horizontal page overflow');
    await page.screenshot({path:path.join(proof,name+'-desktop.png')});
  }
  await page.goto(origin+'/learn/trace/#functions');await page.waitForFunction(()=>window.LEARNING_ACTIVITY?.id==='trace:functions');
  await page.waitForFunction(()=>document.querySelector('#editorFrame').contentWindow.location.search.includes('trace=functions'));
  await page.setViewportSize({width:390,height:844});
  await page.goto(origin+'/learn/');await page.locator('.activity-card').first().waitFor();
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:path.join(proof,'student-home-mobile.png'),fullPage:true});
  await page.goto(origin+'/learn/python/?lesson=1-1-make-path');await page.locator('.activity-tab').first().waitFor();
  await page.locator('#nextActivity').click();assert.equal(await page.locator('#lessonTitle').innerText(),'Route Puzzle');
  await page.locator('#lessonsTab').click();assert(await page.locator('.sidebar').isVisible());
  await page.locator('.lesson-item').filter({hasText:'1.14 ASCII Repair'}).click();assert.equal(await page.locator('#lessonTitle').innerText(),'ASCII Repair');
  await page.locator('#editorTab').click();assert(await page.locator('#editorFrame').isVisible());
  assert(await page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight&&document.documentElement.scrollWidth<=innerWidth));
  await page.locator('#lessonTab').click();await page.screenshot({path:path.join(proof,'python-course-mobile.png')});
  await page.locator('#openThinking').click();await page.locator('#thinking-think').fill('The output shows which line needs to change.');await page.screenshot({path:path.join(proof,'thinking-notebook-mobile.png')});await page.keyboard.press('Escape');
  await page.goto(origin+'/learn/reference/#color/hex');await page.locator('#studentNav').waitFor();
  assert(await page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight&&document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:path.join(proof,'reference-mobile.png')});
  console.log('PASS shared navigation on all learning layouts and mobile course/notes/reference');
  assert.deepEqual(errors,[],'No browser errors');
} catch(error) {
  const failurePage=browser?.contexts()[0]?.pages()[0];
  if(failurePage)await failurePage.screenshot({path:path.join(proof,'learning-flow-failure.png')}).catch(()=>{});
  throw error;
} finally {await browser?.close();server.kill();}
