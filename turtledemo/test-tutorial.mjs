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
const base=origin+'/turtledemo';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:1440,height:900}});
const errors=[];
page.on('pageerror',error=>errors.push(String(error)));
try {
  await page.goto(base+'/pizza/',{waitUntil:'domcontentloaded',timeout:45000});
  await page.locator('#finishedTitle').waitFor({state:'visible',timeout:20000});
  assert.equal(await page.locator('#finishedTitle').textContent(),'Pizza Slice');
  assert.equal(new URL(page.url()).pathname,'/turtledemo/pizza/');
  assert.equal(new URL(page.url()).hash,'#step-1');
  assert.equal(await page.locator('.back-link').evaluate(link=>new URL(link.href).pathname),'/turtledemo/');

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
  assert.equal(new URL(page.url()).pathname,'/turtledemo/pizza/');
  assert.equal(new URL(page.url()).hash,'#step-2');
  assert.equal((await page.locator('#stepCount').textContent()).trim(),'STEP 2 OF 12');

  await page.locator('#previewDetails > summary').click();
  await page.waitForFunction(()=>{
    const image=document.getElementById('expectedImage');
    return image&&!image.hidden&&image.src.startsWith('data:image/png;base64,');
  },null,{timeout:60000});
  console.log('Pizza short URL, step changes, full-project image and step preview passed.');

  // Previously shared long URLs must resolve to the short route and preserve steps.
  await page.goto(base+'/project.html?id=curatedA25#step-3',{waitUntil:'domcontentloaded',timeout:45000});
  await page.locator('#stepCount').waitFor({state:'visible',timeout:20000});
  await page.waitForFunction(()=>document.getElementById('stepCount')?.textContent==='STEP 3 OF 12');
  assert.equal(new URL(page.url()).pathname,'/turtledemo/pizza/');
  assert.equal(new URL(page.url()).hash,'#step-3');
  await page.locator('#nextStep').click();
  assert.equal(new URL(page.url()).pathname,'/turtledemo/pizza/');
  assert.equal(new URL(page.url()).hash,'#step-4');
  const frameSrc=await page.locator('#editorFrame').getAttribute('src');
  assert(frameSrc.startsWith('./?tutorialEmbed=1&project=curatedA25'));
  console.log('Legacy links, saved step URL, and editor path passed.');

  await page.goto(base+'/robot/',{waitUntil:'domcontentloaded',timeout:45000});
  await page.waitForFunction(()=>{
    const image=document.getElementById('finishedImage');
    return image&&!image.hidden&&image.src.startsWith('data:image/png;base64,');
  },null,{timeout:60000});
  assert.equal(new URL(page.url()).pathname,'/turtledemo/robot/');
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
