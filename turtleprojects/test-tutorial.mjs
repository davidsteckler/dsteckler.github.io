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

const origin='http://127.0.0.1:8765';
const base=origin+'/turtleprojects';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:1440,height:900}});
const errors=[];
page.on('pageerror',error=>errors.push(String(error)));
try {
  await page.goto(base+'/pizza/',{waitUntil:'domcontentloaded',timeout:45000});
  await page.locator('#finishedTitle').waitFor({state:'visible',timeout:20000});
  assert.equal(await page.locator('#finishedTitle').textContent(),'Pizza Slice');
  assert.equal(new URL(page.url()).pathname,'/turtleprojects/pizza/');
  assert.equal(new URL(page.url()).hash,'#step-1');
  assert.equal(await page.locator('.back-link').evaluate(link=>new URL(link.href).pathname),'/turtleprojects/');

  // The tutorial editor can be widened without hiding code or altering the drawing.
  const editorFrame=page.frameLocator('#editorFrame');
  const widthSlider=editorFrame.locator('#tutorialCodeWidth');
  await widthSlider.waitFor({state:'visible',timeout:30000});
  assert.equal(await widthSlider.inputValue(),'60');
  const codeBefore=await editorFrame.locator('.code-panel').evaluate(el=>el.getBoundingClientRect().width);
  const worldBefore=await editorFrame.locator('.world-panel').evaluate(el=>el.getBoundingClientRect().width);
  await widthSlider.evaluate(el=>{el.value='72';el.dispatchEvent(new Event('input',{bubbles:true}));});
  await page.waitForFunction(()=>{
    const doc=document.getElementById('editorFrame')?.contentDocument;
    return doc?.getElementById('tutorialWidthValue')?.value==='72%';
  });
  const codeAfter=await editorFrame.locator('.code-panel').evaluate(el=>el.getBoundingClientRect().width);
  const worldAfter=await editorFrame.locator('.world-panel').evaluate(el=>el.getBoundingClientRect().width);
  assert(codeAfter>codeBefore+40,'Code editor should visibly widen');
  assert(worldAfter<worldBefore-40,'World should yield space to the editor');
  assert.equal(await editorFrame.locator('.CodeMirror').evaluate(el=>el.CodeMirror.getOption('lineWrapping')),false);
  assert.equal(await page.locator('#newCode').evaluate(el=>getComputedStyle(el).whiteSpace),'pre');
  // Drag the orange handle: the instruction panel widens and the editor shrinks.
  const divider=page.locator('#lessonDivider'),lesson=page.locator('#lessonPanel'),workspace=page.locator('.tutorial-workspace');
  await divider.waitFor({state:'visible'});
  const originalLessonWidth=await lesson.evaluate(el=>el.getBoundingClientRect().width);
  const originalEditorWidth=await page.locator('#editorPanel').evaluate(el=>el.getBoundingClientRect().width);
  const handle=await divider.boundingBox();
  assert(handle,'The orange drag handle should be on-screen');
  await page.mouse.move(handle.x+handle.width/2,handle.y+handle.height/2);
  await page.mouse.down();
  await page.mouse.move(handle.x+handle.width/2+145,handle.y+handle.height/2,{steps:8});
  await page.mouse.up();
  const expandedLessonWidth=await lesson.evaluate(el=>el.getBoundingClientRect().width);
  const narrowedEditorWidth=await page.locator('#editorPanel').evaluate(el=>el.getBoundingClientRect().width);
  assert(expandedLessonWidth>originalLessonWidth+90,'Orange handle should widen the instructions');
  assert(narrowedEditorWidth<originalEditorWidth-90,'Editor should yield width to instructions');
  await divider.focus();
  await page.keyboard.press('ArrowLeft');
  const keyboardWidth=await lesson.evaluate(el=>el.getBoundingClientRect().width);
  assert(keyboardWidth<expandedLessonWidth,'Left arrow should shrink instructions');
  await page.keyboard.press('ArrowRight');
  assert(Math.abs((await lesson.evaluate(el=>el.getBoundingClientRect().width))-expandedLessonWidth)<5);
  // Long Python lines must retain their original structure, with horizontal scrolling.
  await page.locator('#steps .step-button').nth(7).click();
  assert.equal(await page.locator('#stepCount').textContent(),'STEP 8 OF 12');
  await page.waitForFunction(()=>document.querySelectorAll('#newCode .code-line').length>=5);
  const longCode=await page.locator('#newCode').evaluate(el=>({scrollWidth:el.scrollWidth,clientWidth:el.clientWidth,whiteSpace:getComputedStyle(el).whiteSpace}));
  assert.equal(longCode.whiteSpace,'pre');
  assert(longCode.scrollWidth>longCode.clientWidth,'Long instruction lines should scroll horizontally, not wrap');
  assert.equal(await page.locator('#lessonDivider').getAttribute('aria-valuenow'),String(Math.round(expandedLessonWidth)),'Resized lesson width should survive a new URL');
  console.log('Orange drag handle, keyboard resizing, persistent widths and no-wrapping code passed.');
  await page.locator('#steps .step-button').first().click();
  assert.equal(new URL(page.url()).hash,'#step-1','Return to step one for subsequent preview tests.');
  assert.equal(await editorFrame.locator('#tutorialCodeWidth').evaluate(el=>localStorage.getItem('dsteckler-turtle-tutorial-code-width-v1')),'72');
  console.log('Editor/drawing slider, single-line code and saved layout passed.');

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
  assert.equal((await page.locator('#stepCount').textContent()).trim(),'STEP 2 OF 12');

  await page.locator('#previewDetails > summary').click();
  await page.waitForFunction(()=>{
    const image=document.getElementById('expectedImage');
    return image&&!image.hidden&&image.src.startsWith('data:image/png;base64,');
  },null,{timeout:60000});
  console.log('Pizza short URL, step changes, full-project image and step preview passed.');

  await page.reload({waitUntil:'domcontentloaded',timeout:45000});
  const restoredWidth=page.frameLocator('#editorFrame').locator('#tutorialCodeWidth');
  await restoredWidth.waitFor({state:'visible',timeout:30000});
  assert.equal(await restoredWidth.inputValue(),'72','Code width should persist after reloading.');
  console.log('Code width persists after reloading.');
  const expectedLessonWidth=await page.locator('#lessonPanel').evaluate(el=>el.getBoundingClientRect().width);
  assert(expectedLessonWidth>originalLessonWidth+50,'Instruction width persists after refresh.');

  // Previously shared long URLs must resolve to the short route and preserve steps.
  await page.goto(origin+'/turtledemo/project.html?id=curatedA25#step-3',{waitUntil:'domcontentloaded',timeout:45000});
  await page.locator('#stepCount').waitFor({state:'visible',timeout:20000});
  await page.waitForFunction(()=>document.getElementById('stepCount')?.textContent==='STEP 3 OF 12');
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
  assert.deepEqual(errors,[],'No uncaught browser errors');
  console.log('Robot preview passed. All browser checks passed.');
} catch(error) {
  try{await page.screenshot({path:path.join(root,'tutorial-preview-failure.png')});}catch{}
  console.error('Browser errors:',errors);
  throw error;
} finally {
  await browser.close();
}
