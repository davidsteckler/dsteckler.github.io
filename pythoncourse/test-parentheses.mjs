import {chromium} from 'playwright';import {spawn} from 'node:child_process';import assert from 'node:assert/strict';import path from 'node:path';import {fileURLToPath} from 'node:url';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url))),origin='http://127.0.0.1:8791';let browser;const server=spawn('python3',['-m','http.server','8791','--bind','127.0.0.1'],{cwd:root,stdio:'ignore'});
try{
 for(let i=0;i<60;i++){try{await fetch(origin);break;}catch{await new Promise(r=>setTimeout(r,100));}}
 browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_EXECUTABLE||undefined,args:['--no-sandbox']});const context=await browser.newContext(),page=await context.newPage();
 if(process.env.TURTLE_TEST_DEPS)for(const [pattern,file] of [['**/codemirror.min.css','codemirror.css'],['**/codemirror.min.js','codemirror.js'],['**/mode/python/python.min.js','python.js'],['**/skulpt.min.js','skulpt.js'],['**/skulpt-stdlib.js','skulpt-stdlib.js']])await context.route(pattern,r=>r.fulfill({path:path.join(process.env.TURTLE_TEST_DEPS,file)}));
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const url of ['/turtle/','/turtleprojects/?tutorialEmbed=1&project=test-parentheses','/turtlecourse/lesson1/']){
  await page.goto(origin+url);await page.waitForFunction(()=>document.querySelector('.CodeMirror')?.CodeMirror);
  const cm=page.locator('.CodeMirror');await cm.evaluate(el=>{el.CodeMirror.setValue('');el.CodeMirror.focus();});
  await page.keyboard.type('forward(');assert.equal(await cm.evaluate(el=>el.CodeMirror.getValue()),'forward()');assert.equal(await cm.evaluate(el=>el.CodeMirror.getCursor().ch),8);
  await page.keyboard.type('50)');assert.equal(await cm.evaluate(el=>el.CodeMirror.getValue()),'forward(50)');
  await cm.evaluate(el=>{el.CodeMirror.setValue('');el.CodeMirror.focus();});await page.keyboard.type('(');await page.keyboard.press('Backspace');assert.equal(await cm.evaluate(el=>el.CodeMirror.getValue()),'');
  await page.keyboard.type('((');assert.equal(await cm.evaluate(el=>el.CodeMirror.getValue()),'(())');await page.keyboard.type('20))');assert.equal(await cm.evaluate(el=>el.CodeMirror.getValue()),'((20))');
  await cm.evaluate(el=>{el.CodeMirror.setValue('forward(50)');el.CodeMirror.setSelection({line:0,ch:8},{line:0,ch:10});});await page.keyboard.type('(');assert.equal(await cm.evaluate(el=>el.CodeMirror.getValue()),'forward((50))');
  await cm.evaluate(el=>{el.CodeMirror.setValue('');el.CodeMirror.focus();});await page.keyboard.insertText('forward(60)');assert.equal(await cm.evaluate(el=>el.CodeMirror.getValue()),'forward(60)');console.log('PASS parentheses:',url);
 }
 await context.route('**/pyodide.js',r=>r.fulfill({contentType:'application/javascript',body:'window.loadPyodide=async()=>({setStdout(){},setStderr(){},setStdin(){}});'}));
 if(process.env.ACE_TEST_DEPS)await context.route('**/ace/1.36.2/**',r=>r.fulfill({path:path.join(process.env.ACE_TEST_DEPS,path.basename(new URL(r.request().url()).pathname).replace('.min.js','.js'))}));
 await page.goto(origin+'/python/');await page.waitForFunction(()=>window.ace&&ace.edit('editor').session.getMode().$id==='ace/mode/python');
 await page.evaluate(()=>{const e=ace.edit('editor');e.setValue('',-1);e.focus();});await page.keyboard.type('print(');assert.equal(await page.evaluate(()=>ace.edit('editor').getValue()),'print()');assert.equal(await page.evaluate(()=>ace.edit('editor').getCursorPosition().column),6);await page.keyboard.type('50)');assert.equal(await page.evaluate(()=>ace.edit('editor').getValue()),'print(50)');console.log('PASS Python editor parentheses');assert.deepEqual(errors,[]);
}finally{await browser?.close();server.kill();}
