import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {chromium} from 'playwright';

const root=path.dirname(fileURLToPath(import.meta.url));
const mapping=fs.readFileSync(path.join(root,'tutorial-slugs.js'),'utf8');
const marker='Object.freeze(';
const slugs=JSON.parse(mapping.slice(mapping.indexOf(marker)+marker.length,mapping.lastIndexOf(');')));
const routes=Object.values(slugs);
assert.equal(routes.length,334,'All 333 gallery tutorials and the robot tutorial have short URLs');
assert.equal(new Set(routes).size,routes.length,'Short URLs must be unique');
for(const slug of routes){
  assert(fs.existsSync(path.join(root,slug,'index.html')),'Missing route: '+slug);
}
console.log('Verified '+routes.length+' unique tutorial pages.');

const origin=process.env.TURTLE_TEST_ORIGIN||'http://127.0.0.1:8765';
const pizzaLesson=JSON.parse(fs.readFileSync(path.join(root,'lessons/curatedA25.json'),'utf8'));
const count=pizzaLesson.steps.length;
const base=origin+'/turtleprojects';
const browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_EXECUTABLE||undefined,args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:1440,height:900}});
const errors=[];
if(process.env.TURTLE_TEST_DEPS){
  for(const [pattern,file] of [['**/codemirror.min.css','codemirror.css'],['**/codemirror.min.js','codemirror.js'],['**/mode/python/python.min.js','python.js'],['**/skulpt.min.js','skulpt.js'],['**/skulpt-stdlib.js','skulpt-stdlib.js']])
    await page.context().route(pattern,route=>route.fulfill({path:path.join(process.env.TURTLE_TEST_DEPS,file),contentType:file.endsWith('.css')?'text/css':'application/javascript'}));
}

page.on('pageerror',error=>errors.push(String(error)));
try {
  await page.goto(base+'/pizza/',{waitUntil:'domcontentloaded',timeout:45000});
  await page.waitForFunction(()=>document.body.dataset.lessonReady==='true');
  await page.locator('#finishedTitle').waitFor({state:'visible',timeout:20000});
  assert.equal(await page.locator('#finishedTitle').textContent(),'Pizza Slice');
  assert.equal(new URL(page.url()).pathname,'/turtleprojects/pizza/');
  assert.equal(new URL(page.url()).hash,'#step-1');
  assert.equal(await page.locator('.back-link').evaluate(link=>new URL(link.href).pathname),'/turtleprojects/');

  // Three matching drag grips: the old top slider must be gone.
  const editorFrame=page.frameLocator('#editorFrame');
  const middleDivider=editorFrame.locator('#editorDivider');
  await middleDivider.waitFor({state:'visible',timeout:30000});
  assert.equal(await editorFrame.locator('#tutorialCodeWidth').count(),0,'Remove toolbar slider entirely');
  const defaultMiddle=await middleDivider.getAttribute('aria-valuenow');
  assert.equal(defaultMiddle,'60','Default split should give code 60%');
  const codeBefore=await editorFrame.locator('.code-panel').evaluate(el=>el.getBoundingClientRect().width);
  const worldBefore=await editorFrame.locator('.world-panel').evaluate(el=>el.getBoundingClientRect().width);
  const middleRect=await middleDivider.boundingBox();
  assert(middleRect&&middleRect.width>=10,'A visible gray grip belongs between code and drawing');
  await page.mouse.move(middleRect.x+middleRect.width/2,middleRect.y+middleRect.height/2);
  await page.mouse.down();
  await page.mouse.move(middleRect.x+middleRect.width/2+75,middleRect.y+middleRect.height/2,{steps:8});
  await page.mouse.up();
  const codeAfter=await editorFrame.locator('.code-panel').evaluate(el=>el.getBoundingClientRect().width);
  const worldAfter=await editorFrame.locator('.world-panel').evaluate(el=>el.getBoundingClientRect().width);
  assert(codeAfter>codeBefore+40,'Middle handle should visibly widen the code editor');
  assert(worldAfter<worldBefore-40,'Middle handle should make the drawing narrower');
  const savedCodeWidth=await middleDivider.evaluate(el=>Number(localStorage.getItem('dsteckler-turtle-tutorial-code-width-v1')));
  assert(savedCodeWidth>=65,'Middle grip should save a wider code setting');
  await middleDivider.focus();
  await page.keyboard.press('ArrowLeft');
  assert((await middleDivider.getAttribute('aria-valuenow'))<savedCodeWidth,'Left arrow narrows code');
  await page.keyboard.press('ArrowRight');
  assert.equal(Number(await middleDivider.getAttribute('aria-valuenow')),savedCodeWidth,'Right arrow restores code width');
  assert.equal(await editorFrame.locator('.CodeMirror').evaluate(el=>el.CodeMirror.getOption('lineWrapping')),false);
  assert.equal(await page.locator('#newCode').evaluate(el=>getComputedStyle(el).whiteSpace),'pre');
  console.log('Gray middle divider drag, keyboard resizing, and removed top slider passed.');

  // A slim horizontal grip resizes print()/errors output without replacing the drawing.
  const outputHandle=editorFrame.locator('#outputDivider');
  await outputHandle.waitFor({state:'visible'});
  const outputBefore=await editorFrame.locator('.world-panel .console').evaluate(el=>el.getBoundingClientRect().height);
  const drawingBefore=await editorFrame.locator('#worldStage').evaluate(el=>el.getBoundingClientRect().height);
  const outputBox=await outputHandle.boundingBox();
  assert(outputBox,'Output resize grip must be visible inside the editor');
  await page.mouse.move(outputBox.x+outputBox.width/2,outputBox.y+outputBox.height/2);
  await page.mouse.down();
  await page.mouse.move(outputBox.x+outputBox.width/2,outputBox.y+outputBox.height/2-94,{steps:8});
  await page.mouse.up();
  const outputAfter=await editorFrame.locator('.world-panel .console').evaluate(el=>el.getBoundingClientRect().height);
  const drawingAfter=await editorFrame.locator('#worldStage').evaluate(el=>el.getBoundingClientRect().height);
  assert(outputAfter>outputBefore+65,'Drag up should enlarge the print output');
  assert(drawingAfter<drawingBefore-65,'Drawing should make room for taller output');
  await outputHandle.focus();
  await page.keyboard.press('ArrowDown');
  const keyboardOutputHeight=await editorFrame.locator('.world-panel .console').evaluate(el=>el.getBoundingClientRect().height);
  assert(keyboardOutputHeight<outputAfter,'Down arrow should reduce output height');
  await page.keyboard.press('ArrowUp');
  assert(Math.abs((await editorFrame.locator('.world-panel .console').evaluate(el=>el.getBoundingClientRect().height))-outputAfter)<5);
  const savedOutputHeight=await outputHandle.evaluate(el=>Number(localStorage.getItem('dsteckler-turtle-output-height-v1')));
  assert(savedOutputHeight>200,'Resized output height should persist');
  console.log('Subtle output drag grip, keyboard resizing and saved height passed.');

  // Drag the neutral divider: the instruction panel widens and the editor shrinks.
  const divider=page.locator('#lessonDivider'),lesson=page.locator('#lessonPanel'),workspace=page.locator('.tutorial-workspace');
  await divider.waitFor({state:'visible'});
  const originalLessonWidth=await lesson.evaluate(el=>el.getBoundingClientRect().width);
  const originalEditorWidth=await page.locator('#editorPanel').evaluate(el=>el.getBoundingClientRect().width);
  const handle=await divider.boundingBox();
  assert(handle,'The gray drag handle should be on-screen');
  await page.mouse.move(handle.x+handle.width/2,handle.y+handle.height/2);
  await page.mouse.down();
  await page.mouse.move(handle.x+handle.width/2+145,handle.y+handle.height/2,{steps:8});
  await page.mouse.up();
  const expandedLessonWidth=await lesson.evaluate(el=>el.getBoundingClientRect().width);
  const narrowedEditorWidth=await page.locator('#editorPanel').evaluate(el=>el.getBoundingClientRect().width);
  assert(expandedLessonWidth>originalLessonWidth+90,'Gray handle should widen the instructions');
  assert(narrowedEditorWidth<originalEditorWidth-90,'Editor should yield width to instructions');
  await divider.focus();
  await page.keyboard.press('ArrowLeft');
  const keyboardWidth=await lesson.evaluate(el=>el.getBoundingClientRect().width);
  assert(keyboardWidth<expandedLessonWidth,'Left arrow should shrink instructions');
  await page.keyboard.press('ArrowRight');
  assert(Math.abs((await lesson.evaluate(el=>el.getBoundingClientRect().width))-expandedLessonWidth)<5);
  // Long Python lines must retain their original structure, with horizontal scrolling.
  const longest=pizzaLesson.steps.map(step=>Math.max(0,...step.edits.flatMap(edit=>edit.lines.map(line=>line.length))));
  const longStep=longest.indexOf(Math.max(...longest));
  assert(longStep>=0,'A real lesson includes a long unwrapped Python line');
  await page.locator('#steps .step-button').nth(longStep).click();
  assert.equal(await page.locator('#stepCount').textContent(),'STEP '+(longStep+1)+' OF '+count);
  await page.waitForFunction(()=>document.querySelectorAll('#newCode .code-line').length>0);
  const longCode=await page.locator('.new-code').evaluateAll(elements=>elements.map(el=>({scrollWidth:el.scrollWidth,clientWidth:el.clientWidth,whiteSpace:getComputedStyle(el).whiteSpace})).sort((a,b)=>(b.scrollWidth-b.clientWidth)-(a.scrollWidth-a.clientWidth))[0]);
  assert.equal(longCode.whiteSpace,'pre');
  assert(longCode.scrollWidth>longCode.clientWidth,'Long instruction lines should scroll horizontally, not wrap');
  assert.equal(await page.locator('#lessonDivider').getAttribute('aria-valuenow'),String(Math.round(expandedLessonWidth)),'Resized lesson width should survive a new URL');
  console.log('Neutral instruction divider, keyboard resizing, persistent widths and no-wrapping code passed.');
  await page.locator('#steps .step-button').first().click();
  assert.equal(new URL(page.url()).hash,'#step-1','Return to step one for subsequent preview tests.');
  assert.equal(await middleDivider.evaluate(el=>Number(localStorage.getItem('dsteckler-turtle-tutorial-code-width-v1'))),savedCodeWidth);
  console.log('Middle drag handle, single-line code and saved layout passed.');

  // Editing instructions must support replacements without overwriting student work.
  const frame=page.frames().find(f=>f.url().includes('tutorialEmbed=1'));
  await frame.evaluate(()=>document.querySelector('.CodeMirror').CodeMirror.setValue('forward(73)\n# my work'));
  await page.locator('#steps .step-button').nth(7).click();
  assert((await page.locator('#codeEdits').innerText()).includes('REPLACE'));
  await page.locator('#completeProgram > summary').click();
  assert((await page.locator('#completeCode').innerText()).includes('def pepperoni'));
  assert.equal(await frame.evaluate(()=>document.querySelector('.CodeMirror').CodeMirror.getValue()),'forward(73)\n# my work');
  assert.equal(await page.locator('#sameDrawing').isVisible(),true);
  await page.locator('#steps .step-button').first().click();
  console.log('Replacement instructions, full reference, unchanged output note and student-code preservation passed.');

  // The final image is rendered from the actual project code, on the page.
  await page.waitForFunction(()=>{
    const image=document.getElementById('finishedImage');
    return image&&!image.hidden&&image.src.startsWith('data:image/png;base64,');
  },null,{timeout:75000});
  assert.equal(await page.locator('#finishedExpand').isEnabled(),true);
  await page.screenshot({path:path.join(root,'tutorial-preview-proof.png'),fullPage:false});

  await page.locator('#finishedExpand').click();
  assert.equal(await page.locator('#finishedDialog').evaluate(dialog=>dialog.open),true);
  await page.locator('#finishedClose').click();
  assert.equal(await page.locator('#finishedDialog').evaluate(dialog=>dialog.open),false);
  await page.locator('#nextStep').click();
  assert.equal(new URL(page.url()).pathname,'/turtleprojects/pizza/');
  assert.equal(new URL(page.url()).hash,'#step-2');
  assert.equal((await page.locator('#stepCount').textContent()).trim(),'STEP 2 OF '+count);

  await page.locator('#previewDetails > summary').click();
  await page.waitForFunction(()=>{
    const image=document.getElementById('expectedImage');
    return image&&!image.hidden&&image.src.startsWith('data:image/png;base64,');
  },null,{timeout:60000});
  console.log('Pizza short URL, step changes, full-project image and step preview passed.');

  await page.reload({waitUntil:'domcontentloaded',timeout:45000});
  const restoredWidth=page.frameLocator('#editorFrame').locator('#editorDivider');
  await restoredWidth.waitFor({state:'visible',timeout:30000});
  const restoredSavedWidth=await restoredWidth.evaluate(el=>Number(localStorage.getItem('dsteckler-turtle-tutorial-code-width-v1')));
  assert.equal(restoredSavedWidth,savedCodeWidth,'The preferred code width is retained after reloading.');
  const restoredCodeWidth=Number(await restoredWidth.getAttribute('aria-valuenow'));
  const restoredMaxWidth=Number(await restoredWidth.getAttribute('aria-valuemax'));
  assert.equal(restoredCodeWidth,Math.min(savedCodeWidth,restoredMaxWidth),
    'Code width should use the saved preference or the available space, whichever is smaller.');
  console.log('Code width persists after reloading.');
  const outputAfterReload=await page.frameLocator('#editorFrame').locator('.world-panel .console').evaluate(el=>el.getBoundingClientRect().height);
  assert(Math.abs(outputAfterReload-savedOutputHeight)<4,'Output height must persist after reload.');
  console.log('Output height persists after reloading.');
  const expectedLessonWidth=await page.locator('#lessonPanel').evaluate(el=>el.getBoundingClientRect().width);
  assert(expectedLessonWidth>originalLessonWidth+50,'Instruction width persists after refresh.');

  // Previously shared long URLs must resolve to the short route and preserve steps.
  await page.goto(origin+'/turtledemo/project.html?id=curatedA25#step-3',{waitUntil:'domcontentloaded',timeout:45000});
  await page.locator('#stepCount').waitFor({state:'visible',timeout:20000});
  await page.waitForFunction(count=>document.getElementById('stepCount')?.textContent==='STEP 3 OF '+count,count);
  assert.equal(new URL(page.url()).pathname,'/turtleprojects/pizza/');
  assert.equal(new URL(page.url()).hash,'#step-3');
  await page.locator('#nextStep').click();
  assert.equal(new URL(page.url()).pathname,'/turtleprojects/pizza/');
  assert.equal(new URL(page.url()).hash,'#step-4');
  const frameSrc=await page.locator('#editorFrame').getAttribute('src');
  assert(frameSrc.startsWith('./?tutorialEmbed=1&project=curatedA25'));
  console.log('Legacy links, saved step URL, and editor path passed.');

  await page.goto(origin+'/turtledemo/pizza/#step-6',{waitUntil:'domcontentloaded',timeout:45000});
  await page.waitForFunction(()=>location.pathname==='/turtleprojects/pizza/'&&location.hash==='#step-6',null,{timeout:25000});
  console.log('Legacy short URLs redirect and retain steps.');

  await page.goto(origin+'/turtledemo/?projects=1#gallery',{waitUntil:'domcontentloaded',timeout:45000});
  await page.waitForFunction(()=>location.pathname==='/turtleprojects/'&&location.search==='?projects=1'&&location.hash==='#gallery',null,{timeout:25000});
  console.log('Legacy gallery links redirect and retain query and hash.');

  await page.goto(base+'/robot/',{waitUntil:'domcontentloaded',timeout:45000});
  await page.waitForFunction(()=>{
    const image=document.getElementById('finishedImage');
    return image&&!image.hidden&&image.src.startsWith('data:image/png;base64,');
  },null,{timeout:60000});
  assert.equal(new URL(page.url()).pathname,'/turtleprojects/robot/');
  assert.equal(await page.locator('#finishedTitle').textContent(),'Robot roll call');
  await page.setViewportSize({width:390,height:844});
  await page.locator('[data-view="editor"]').click();
  assert.equal(await page.locator('#editorPanel').isVisible(),true);
  await page.locator('[data-view="lesson"]').click();
  assert.equal(await page.locator('#lessonPanel').isVisible(),true);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'No horizontal page overflow on mobile');
  assert.deepEqual(errors,[],'No uncaught browser errors');
  console.log('Robot preview passed. All browser checks passed.');
} catch(error) {
  try{await page.screenshot({path:path.join(root,'tutorial-preview-failure.png')});}catch{}
  console.error('Browser errors:',errors);
  throw error;
} finally {
  await browser.close();
}
