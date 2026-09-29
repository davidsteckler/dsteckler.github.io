import fs from 'node:fs';
import {spawn} from 'node:child_process';
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const output=path.join(root,'turtleprojects');
const server=spawn('python3',['-m','http.server','8778','--bind','127.0.0.1'],{cwd:root,stdio:'ignore'});
let browser;
try{
for(let i=0;i<50;i++){try{await fetch('http://127.0.0.1:8778/');break;}catch{await new Promise(r=>setTimeout(r,100));}}
browser=await chromium.launch({executablePath:process.env.BROWSER_EXECUTABLE||undefined,headless:true,args:['--no-sandbox']});
const context=await browser.newContext({viewport:{width:1440,height:1000}});
const deps=process.env.TURTLE_TEST_DEPS;
if(deps)for(const [pattern,file] of [['**/codemirror.min.css','codemirror.css'],['**/codemirror.min.js','codemirror.js'],['**/mode/python/python.min.js','python.js'],['**/skulpt.min.js','skulpt.js'],['**/skulpt-stdlib.js','skulpt-stdlib.js']])await context.route(pattern,route=>route.fulfill({path:path.join(deps,file),contentType:file.endsWith('.css')?'text/css':'application/javascript'}));
const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://127.0.0.1:8778/turtleprojects/');
await page.waitForSelector('.demo-project-card');
assert.equal(await page.locator('.demo-project-card').count(),12);
assert.equal(await page.locator('.demo-tile-name').first().innerText(),'First Square');
await page.waitForTimeout(2000);
await page.screenshot({path:path.join(output,'tutorial-preview-levels-desktop.png')});
for(const level of ['Medium','Hard','All']){
 await page.locator('.level-filter[data-level="'+level+'"]').click();
 const visible=await page.locator('.demo-project-card').count();assert(visible>10);
 const badges=await page.locator('.level-badge').allTextContents();assert(badges.every(x=>level==='All'||x===level));
 console.log(level+': '+visible);
}
await page.locator('#demoSearch').fill('umbrella');
assert.equal(await page.locator('.demo-project-card').count(),1);
await page.locator('.demo-tutorial-link').click();
await page.waitForFunction(()=>document.body?.dataset.lessonReady==='true');
assert.equal(await page.locator('#projectTitle').innerText(),'Rain Umbrella');
await page.locator('#finishedImage').waitFor({state:'visible',timeout:60000});
await page.screenshot({path:path.join(output,'tutorial-preview-umbrella-tutorial.png')});
await page.goto('http://127.0.0.1:8778/turtleprojects/first-square/');
await page.waitForFunction(()=>document.body?.dataset.lessonReady==='true');
assert.equal(await page.locator('#projectLevel').innerText(),'Beginner');
assert((await page.locator('#codeEdits').innerText()).includes('forward(100)'));
await page.locator('#finishedImage').waitFor({state:'visible',timeout:60000});
await page.screenshot({path:path.join(output,'tutorial-preview-first-square-tutorial.png')});
await page.setViewportSize({width:390,height:844});
await page.goto('http://127.0.0.1:8778/turtleprojects/');
await page.waitForSelector('.demo-project-card');
await page.waitForFunction(()=>{const c=document.querySelector('#demoGallery canvas');const pixel=c?.getContext('2d').getImageData(250,150,1,1).data;return pixel&&pixel[0]===0&&pixel[1]===128&&pixel[2]===128;});
assert.equal(await page.locator('.demo-project-card').count(),12);
assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
assert.equal(await page.evaluate(()=>window.scrollY),0,'Hidden thumbnail rendering must not scroll the gallery');
assert((await page.locator('#difficultyFilters').boundingBox()).y>=0,'Difficulty controls must be visible on mobile load');
await page.screenshot({path:path.join(output,'tutorial-preview-levels-mobile.png')});
assert.deepEqual(errors,[]);console.log('PASS level filters, search, tutorial metadata, beginner routes, and mobile');
}finally{await browser?.close();server.kill();}
