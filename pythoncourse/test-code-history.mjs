import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url))),origin='http://127.0.0.1:8789';
const server=spawn('python3',['-m','http.server','8789','--bind','127.0.0.1'],{cwd:root,stdio:'ignore'});
let browser;
try {
 for(let i=0;i<60;i++){try{await fetch(origin);break;}catch{await new Promise(r=>setTimeout(r,100));}}
 browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_EXECUTABLE||undefined,args:['--no-sandbox']});
 const context=await browser.newContext();
 if(process.env.TURTLE_TEST_DEPS)for(const [pattern,file] of [['**/codemirror.min.css','codemirror.css'],['**/codemirror.min.js','codemirror.js'],['**/mode/python/python.min.js','python.js'],['**/skulpt.min.js','skulpt.js'],['**/skulpt-stdlib.js','skulpt-stdlib.js']])await context.route(pattern,r=>r.fulfill({path:path.join(process.env.TURTLE_TEST_DEPS,file)}));
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('dialog',d=>d.accept());
 await page.goto(origin+'/pythoncourse/?lesson=1-1-make-path');
 async function editor(){await page.waitForFunction(()=>document.getElementById('editorFrame').contentDocument?.querySelector('.CodeMirror')&&new URL(document.getElementById('editorFrame').contentWindow.location.href).searchParams.get('lesson')===document.getElementById('editorFrame').dataset.lessonKey);return page.frames().find(f=>f.url().includes('embed=course'));}
 let frame=await editor();
 const original='forward(137)\nleft(42)';
 await frame.locator('.code-panel .CodeMirror').evaluate((el,code)=>el.CodeMirror.setValue(code),original);
 // Clear immediately, before the debounce fires: the previous code must survive.
 await frame.locator('#clearCodeBtn').click();
 await frame.locator('#codeHistoryBtn').click();
 const history=frame.locator('#historyPane');
 const entries=await frame.evaluate(()=>JSON.parse(localStorage.getItem('dsteckler-pythoncourse-'+new URL(location.href).searchParams.get('lesson')+'-history-v1')));
 const index=entries.findIndex(e=>e.code===original);assert(index>=0);
 await history.locator('.history-version').nth(index).click();assert.equal(await history.locator('.CodeMirror').evaluate(el=>el.CodeMirror.getValue()),original);
 await history.getByRole('button',{name:'Restore this version'}).click();
 assert.equal(await frame.locator('.code-panel .CodeMirror').evaluate(el=>el.CodeMirror.getValue()),original);
 await frame.locator('#commandsClose').click();
 await page.reload();frame=await editor();assert.equal(await frame.locator('.code-panel .CodeMirror').evaluate(el=>el.CodeMirror.getValue()),original);
 await page.locator('#resetBtn').click();
 assert.equal(await frame.locator('.code-panel .CodeMirror').evaluate(el=>el.CodeMirror.getValue()),'');
 assert(await frame.evaluate(code=>JSON.parse(localStorage.getItem('dsteckler-pythoncourse-'+new URL(location.href).searchParams.get('lesson')+'-history-v1')).some(e=>e.code===code),original));
 await page.locator('.step-dot').nth(7).click();frame=await editor();
 assert.match(await page.locator('#resetBtn').textContent(),/assignment/);
 assert(!await frame.evaluate(code=>JSON.parse(localStorage.getItem(new URL(location.href).searchParams.get('lesson')? 'dsteckler-pythoncourse-'+new URL(location.href).searchParams.get('lesson')+'-history-v1':'')||'[]').some(e=>e.code===code),original));
 await page.setViewportSize({width:390,height:844});
 await page.locator('#editorTab').click();
 await frame.locator('#codeHistoryBtn').click();assert(await frame.locator('#historyPane').isVisible());
 assert.deepEqual(errors,[]);console.log('Code recovery, immediate clear, reload, scoped history, starter loading and mobile history passed.');
} finally {await browser?.close();server.kill();}
