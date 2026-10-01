import fs from 'node:fs';import path from 'node:path';import vm from 'node:vm';import {spawn} from 'node:child_process';import {fileURLToPath} from 'node:url';import assert from 'node:assert/strict';import {chromium} from 'playwright';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url))),origin='http://127.0.0.1:8787';
const server=spawn('python3',['-m','http.server','8787','--bind','127.0.0.1'],{cwd:root,stdio:'ignore'});
const scope={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'pythoncourse/course-data.js'),'utf8'),scope);const lessons=scope.window.PYTHON_COURSE.units[0].lessons;
const solutions=[
'forward(90)\nleft(90)\nforward(30)',
'forward(70)\nleft(90)\nforward(30)\nleft(90)\nforward(70)\nleft(90)\nforward(30)\nleft(90)',
'forward(40)\nright(90)\nforward(40)\nleft(90)\nforward(60)',
'circle(20)\nforward(60)\ncircle(20)',
'circle(15)\nforward(55)\ncircle(30)\nforward(55)\ncircle(45)',
'circle(15)\nforward(75)\ncircle(30)',
'forward(40)\nleft(90)\nforward(30)',
'forward(60)\nleft(90)\nforward(30)\nright(90)\nforward(60)',
'forward(40)\nleft(90)\nforward(35)\nright(90)\nforward(50)',
'bgcolor("black")\ncolor("cyan")\npensize(6)\nforward(40)\ncolor("yellow")\npensize(10)\nforward(40)',
'bgcolor("black")\ncolor("yellow")\npensize(5)\nforward(40)\nleft(90)\ncolor("cyan")\npensize(8)\nforward(30)',
'bgcolor("black")\ncolor("cyan")\npensize(6)\nforward(40)\nleft(90)\ncolor("pink")\npensize(10)\nforward(20)',
'print("█████")\nprint("█   █")\nprint("█████")',
'print(" ██ ")\nprint(" █  █")\nprint(" ██ ")',
'print("READY")\nprint("[███░]")\nprint("3 / 4")'
];
let browser;
try{
 for(let i=0;i<60;i++){try{await fetch(origin);break;}catch{await new Promise(r=>setTimeout(r,100));}}
 browser=await chromium.launch({executablePath:process.env.BROWSER_EXECUTABLE||undefined,headless:true,args:['--no-sandbox']});
 const context=await browser.newContext({viewport:{width:1440,height:900}});await context.route('**/www.googletagmanager.com/**',r=>r.abort());
 const deps=process.env.TURTLE_TEST_DEPS;if(deps)for(const [pattern,file] of [['**/codemirror.min.css','codemirror.css'],['**/codemirror.min.js','codemirror.js'],['**/mode/python/python.min.js','python.js'],['**/skulpt.min.js','skulpt.js'],['**/skulpt-stdlib.js','skulpt-stdlib.js']])await context.route(pattern,r=>r.fulfill({path:path.join(deps,file),contentType:file.endsWith('.css')?'text/css':'application/javascript'}));
 const errors=[],page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 async function editor(){await page.waitForFunction(()=>document.getElementById('editorFrame').contentDocument?.querySelector('.CodeMirror')&&new URL(document.getElementById('editorFrame').contentWindow.location.href).searchParams.get('lesson')===document.getElementById('editorFrame').dataset.lessonKey);return page.frames().find(f=>f.url().includes('embed=course'));}
 async function goStep(i){await page.locator('.step-dot').nth(i).click();return await editor();}
 for(let index=0;index<lessons.length;index++){
  const lesson=lessons[index];await page.goto(origin+'/pythoncourse/?lesson='+lesson.id);let frame=await editor();
  const project='# my project\nforward(37)';await frame.locator('.CodeMirror').evaluate((el,code)=>el.CodeMirror.setValue(code),project);
  const questions=lesson.steps.map((s,i)=>({...s,index:i})).filter(s=>s.question);
  assert.equal(questions.length,2);
  for(const step of questions){
   frame=await goStep(step.index);assert(new URL(frame.url()).searchParams.get('lesson').includes('-lab-'));
   assert.equal(await frame.locator('.CodeMirror').evaluate(el=>el.CodeMirror.getValue()),step.lab);
   const wrong=(step.question.answer+1)%step.question.choices.length;
   await page.locator('input[name="prediction"]').nth(wrong).check();await page.locator('#checkPrediction').click();assert((await page.locator('#predictionFeedback').innerText()).startsWith('Try again.'));
   await page.locator('input[name="prediction"]').nth(step.question.answer).check();await page.locator('#checkPrediction').click();assert((await page.locator('#predictionFeedback').innerText()).startsWith('Yes.'));
  }
  const experimentIndex=lesson.steps.findIndex(s=>s.check),experiment=lesson.steps[experimentIndex];frame=await goStep(experimentIndex);
  await frame.locator('.CodeMirror').evaluate(el=>el.CodeMirror.setValue('forward(1)'));
  await page.locator('#checkCheckpoint').click();await page.waitForSelector('#checkFeedback.bad');assert.equal(await page.evaluate(id=>JSON.parse(localStorage.getItem('dsteckler-pythoncourse-progress-v2')||'{}')[id]||false,lesson.id),false,'An experiment cannot complete the lesson');
  await frame.locator('.CodeMirror').evaluate((el,code)=>el.CodeMirror.setValue(code),solutions[index]);
  await page.locator('#checkCheckpoint').click();await page.waitForSelector('#checkFeedback.good');assert.equal(await page.locator('.check-title').innerText(),'Experiment passed');
  if(index===14){
   const capstone=lesson.steps.findIndex(s=>s.id==='unit-1-beacon');frame=await goStep(capstone);
   await frame.locator('.CodeMirror').evaluate(el=>el.CodeMirror.setValue('bgcolor("black")\ncolor("cyan")\npensize(6)\nforward(60)\nleft(90)\ncolor("yellow")\nforward(40)\ncircle(15)\nprint("[███░]")\nprint("3 / 4")'));
   await page.locator('#checkCheckpoint').click();await page.waitForSelector('#checkFeedback.good');
  }
  await goStep(0);frame=await editor();assert.equal(await frame.locator('.CodeMirror').evaluate(el=>el.CodeMirror.getValue()),project,'Returning from a lab must restore the project');
  await goStep(lesson.steps.findIndex(s=>s.response));await page.locator('#evidenceResponse').fill('I changed one value. The next run showed the intended difference.');
  await page.reload();await page.waitForSelector('#evidenceResponse');assert((await page.locator('#evidenceResponse').inputValue()).startsWith('I changed one value.'));
  assert((await page.locator('#understandingStatus').innerText()).includes('2 / 2'));
 }
 console.log('PASS all 30 understanding checks, 16 independent experiments, including the cumulative signal-beacon challenge, failure/success grading, lesson completion isolation, project restoration and saved evidence');
 await page.goto(origin+'/pythoncourse/?lesson=1-1-make-path');await editor();
 await page.evaluate(()=>localStorage.removeItem('dsteckler-pythoncourse-responses-v1-1-1-make-path'));await goStep(lessons[0].steps.length-1);await page.locator('#nextBtn').click();await page.waitForSelector('#checkFeedback.bad');assert((await page.locator('#checkFeedback').innerText()).includes('Understanding check'));
 const answered=Object.fromEntries(lessons[0].steps.filter(s=>s.question).map(s=>[s.question.id,{choice:s.question.answer,checked:true}]));
 await page.evaluate(value=>localStorage.setItem('dsteckler-pythoncourse-responses-v1-1-1-make-path',JSON.stringify(value)),answered);
 let finalEditor=await editor();await finalEditor.locator('.CodeMirror').evaluate(el=>el.CodeMirror.setValue('forward(80)\nleft(90)\nforward(30)\nright(90)\nbackward(15)\nforward(50)'));
 await page.locator('#nextBtn').click();await page.waitForSelector('#checkFeedback.bad');assert((await page.locator('#checkFeedback').innerText()).includes('Experiment'));
 finalEditor=await goStep(lessons[0].steps.findIndex(s=>s.check));await finalEditor.locator('.CodeMirror').evaluate(el=>el.CodeMirror.setValue('forward(90)\nleft(90)\nforward(30)'));await page.locator('#checkCheckpoint').click();await page.waitForSelector('#checkFeedback.good');
 await goStep(lessons[0].steps.length-1);await page.locator('#nextBtn').click();await page.waitForSelector('#checkFeedback.good');assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('dsteckler-pythoncourse-progress-v2'))['1-1-make-path']),true);
 await page.setViewportSize({width:390,height:844});await goStep(lessons[0].steps.findIndex(s=>s.question));assert(await page.locator('#checkPrediction').isVisible());await page.locator('input[name="prediction"]').nth(1).check();await page.locator('#checkPrediction').click();assert(await page.locator('#predictionFeedback').isVisible());assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth&&document.documentElement.scrollHeight<=innerHeight));
 const proof=process.env.UNIT_DEPTH_PROOF||'/tmp/unit-depth-proof';fs.mkdirSync(proof,{recursive:true});await page.screenshot({path:path.join(proof,'prediction-mobile.png')});
 await goStep(lessons[0].steps.findIndex(s=>s.check));await page.screenshot({path:path.join(proof,'experiment-mobile.png')});
 await page.setViewportSize({width:1440,height:900});await page.screenshot({path:path.join(proof,'experiment-desktop.png')});
 assert.deepEqual(errors,[]);console.log('PASS required understanding before final completion and mobile interaction layout');
}finally{await browser?.close();server.kill();}
