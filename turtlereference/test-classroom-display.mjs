import {chromium} from 'playwright';import {spawn} from 'node:child_process';import assert from 'node:assert/strict';import path from 'node:path';import {fileURLToPath} from 'node:url';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url))),origin='http://127.0.0.1:8790';
const server=spawn('python3',['-m','http.server','8790','--bind','127.0.0.1'],{cwd:root,stdio:'ignore'});let browser;
try{
 for(let i=0;i<60;i++){try{await fetch(origin);break;}catch{await new Promise(r=>setTimeout(r,100));}}
 browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_EXECUTABLE||undefined,args:['--no-sandbox']});
 const context=await browser.newContext({viewport:{width:1920,height:1080}}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 if(process.env.TURTLE_TEST_DEPS)for(const [pattern,file] of [['**/codemirror.min.css','codemirror.css'],['**/codemirror.min.js','codemirror.js'],['**/mode/python/python.min.js','python.js'],['**/skulpt.min.js','skulpt.js'],['**/skulpt-stdlib.js','skulpt-stdlib.js']])await context.route(pattern,r=>r.fulfill({path:path.join(process.env.TURTLE_TEST_DEPS,file)}));
 await page.goto(origin+'/turtlereference/#color');await page.waitForFunction(()=>document.body.dataset.editorReady==='true');
 let frame=page.frames().find(f=>f.url().includes('tutorialEmbed'));
 async function slide(id,value){await page.locator('#'+id).evaluate((el,v)=>{el.value=v;el.dispatchEvent(new Event('input',{bubbles:true}));},String(value));}
 assert(await page.getByRole('button',{name:'Decrease code size'}).isDisabled());
 await page.getByRole('button',{name:'Increase code size'}).click();assert.equal(await page.locator('#classCodeSize').inputValue(),'16');
 await page.getByRole('button',{name:'Decrease code size'}).click();assert.equal(await page.locator('#classCodeSize').inputValue(),'14');
 await page.getByRole('button',{name:'Increase drawing zoom'}).click();assert.equal(await page.locator('#classDrawingZoom').inputValue(),'110');
 await page.getByRole('button',{name:'Decrease drawing zoom'}).click();assert.equal(await page.locator('#classDrawingZoom').inputValue(),'100');
 const code=await frame.locator('.CodeMirror').evaluate(el=>el.CodeMirror.getValue());
 const initial=await frame.locator('#worldScaleBox').evaluate(el=>el.getBoundingClientRect().width);
 await slide('classCodeSize',32);assert.equal(await frame.locator('.CodeMirror').evaluate(el=>getComputedStyle(el).fontSize),'32px');
 await slide('classDrawingZoom',200);assert(Math.abs(await frame.locator('#worldScaleBox').evaluate(el=>el.getBoundingClientRect().width)-initial*2)<2);
 assert.equal(await frame.locator('.CodeMirror').evaluate(el=>el.CodeMirror.getValue()),code);
 await page.locator('#classView').click();assert.equal(await page.locator('#classView').getAttribute('aria-pressed'),'true');assert(!await page.locator('.reference-detail').isVisible());
 await slide('classDrawingZoom',300);assert.equal(await frame.locator('#worldStage').evaluate(el=>getComputedStyle(el).overflow),'auto');
 await page.screenshot({path:'/tmp/classroom-display-desktop.png'});
 assert(await page.getByRole('button',{name:'Increase drawing zoom'}).isDisabled());
 await page.reload();await page.waitForFunction(()=>document.body.dataset.editorReady==='true');frame=page.frames().find(f=>f.url().includes('tutorialEmbed'));assert.equal(await page.locator('#classCodeSize').inputValue(),'32');assert.equal(await page.locator('#classDrawingZoom').inputValue(),'300');
 await page.locator('#resetClassZoom').click();assert.equal(await frame.locator('.CodeMirror').evaluate(el=>getComputedStyle(el).fontSize),'14px');
 await page.setViewportSize({width:390,height:844});await page.locator('#editorViewLabel').click();assert(await page.locator('#classCodeSize').isVisible());assert(await page.locator('#classDrawingZoom').isVisible());assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 assert.deepEqual(errors,[]);console.log('PASS code and drawing zoom, class view, code preservation, persistence, reset and mobile controls');
}finally{await browser?.close();server.kill();}
