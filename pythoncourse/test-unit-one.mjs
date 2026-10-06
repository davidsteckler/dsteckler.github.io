import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const modules=process.env.UNIT_TEST_MODULES||path.join(root,'node_modules');
const {chromium}=await import(path.join(modules,'playwright/index.mjs'));
const origin='http://127.0.0.1:8788';
const scope={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'pythoncourse/course-data.js'),'utf8'),scope);
const lessons=JSON.parse(JSON.stringify(scope.window.PYTHON_COURSE.units[0].lessons));
const solutions=JSON.parse(fs.readFileSync(path.join(root,'pythoncourse/unit-one-solutions.json'),'utf8'));
const server=spawn('python3',['-m','http.server','8788','--bind','127.0.0.1'],{cwd:root,stdio:'ignore'});
let browser;
try{
  for(let i=0;i<40;i++){try{await fetch(origin);break;}catch{await new Promise(r=>setTimeout(r,100));}}
  browser=await chromium.launch({executablePath:process.env.BROWSER_EXECUTABLE||undefined,headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader']});
  const context=await browser.newContext({viewport:{width:1440,height:1000}});
  await context.route('**/www.googletagmanager.com/**',r=>r.abort());
  const deps=[['**/codemirror.min.css','codemirror/lib/codemirror.css'],['**/codemirror.min.js','codemirror/lib/codemirror.js'],['**/mode/python/python.min.js','codemirror/mode/python/python.js'],['**/skulpt.min.js','skulpt/dist/skulpt.min.js'],['**/skulpt-stdlib.js','skulpt/dist/skulpt-stdlib.js']];
  for(const [pattern,file] of deps)await context.route(pattern,r=>r.fulfill({path:path.join(modules,file),contentType:file.endsWith('.css')?'text/css':'application/javascript'}));
  const parentHtml=fs.readFileSync(path.join(root,'pythoncourse/index.html'),'utf8').replace(/\}\)\(\);\s*<\/script>/, 'window.__unitTest={evaluateStudentCode,codeCalls,drawingTrace,readResponses,practiceComplete};})();</script>');
  const turtleHtml=fs.readFileSync(path.join(root,'turtle/index.html'),'utf8').replace(/\}\)\(\);\s*<\/script>/,'window.__unitRun=async function(code){editor.setValue(code);var run=await runCode(false,{check:true});return {code:code,run:run,runtime:TurtleRuntime.snapshot()};};})();</script>');
  await context.route(/\/pythoncourse\/(?:\?.*)?$/,r=>r.fulfill({body:parentHtml,contentType:'text/html'}));
  await context.route(/\/turtle\/(?:\?.*)?$/,r=>r.fulfill({body:turtleHtml,contentType:'text/html'}));
  const page=await context.newPage(),errors=[];let frame;page.on('pageerror',e=>errors.push(e.message));page.on('dialog',d=>d.accept());
  async function editor(){await page.waitForFunction(()=>{const f=document.getElementById('editorFrame');return f.contentWindow.__unitRun&&new URL(f.contentWindow.location.href).searchParams.get('lesson')===f.dataset.lessonKey&&document.getElementById('editorPane').classList.contains('ready')});return page.frames().find(f=>f.url().includes('embed=course'));}
  async function goStep(i){await page.locator('.step-dot').nth(i).click();return editor();}
  async function run(code){const frame=await editor();return frame.evaluate(code=>window.__unitRun(code),code);}
  async function grade(check,payload){return page.evaluate(({check,payload})=>window.__unitTest.evaluateStudentCode({check},payload),{check,payload});}
  let requiredCount=0,ideaCount=0,predictionCount=0;
  if(process.env.UNIT_TEST_UI_ONLY!=='1'){
  for(const lesson of lessons){
    await page.goto(origin+'/pythoncourse/?lesson='+lesson.id);frame=await editor();
    assert.equal(await frame.locator('.CodeMirror').evaluate(el=>el.CodeMirror.getValue()),'','Example starts empty: '+lesson.id);
    assert(lesson.purpose&&lesson.objective&&lesson.notes);
    assert.equal(lesson.steps.filter(s=>s.question).length,2);
    assert(lesson.steps.every(s=>s.id&&s.title&&s.task&&s.phase));
    assert.equal(new Set(lesson.steps.map(s=>s.id)).size,lesson.steps.length);
    for(const step of lesson.steps.filter(s=>s.check)){
      const payload=await run(solutions[step.id]);assert(payload.run.ok,step.id+' solution runs: '+payload.run.error);
      const result=await grade(step.check,payload);assert(result.ok,step.id+' solution must pass: '+JSON.stringify(result.items.filter(i=>!i.passed)));
      const empty=await run('');assert.equal((await grade(step.check,empty)).ok,false,step.id+' empty fails');
      requiredCount++;
    }
    for(const visual of lesson.visuals){
      const code=visual.previewCode||visual.ascii.split('\n').map(row=>'print('+JSON.stringify(row)+')').join('\n');
      const payload=await run(code);assert(payload.run.ok,visual.label+' preview program runs');
      const result=await grade(lesson.check,payload);assert(result.ok,lesson.id+' creative preview '+visual.label+' satisfies its requirements: '+JSON.stringify(result.items.filter(i=>!i.passed)));
      ideaCount++;
    }
    for(const step of lesson.steps.filter(s=>s.question)){
      const payload=await run(step.lab);const shouldError=lesson.id==='1-8-solve-debug';assert.equal(payload.run.ok,!shouldError,step.id+' predicted run');predictionCount++;
    }
    console.log('PASS programs '+lesson.number+' '+lesson.title);
  }
  // The checker must reject executable programs that violate the actual task.
  const badPrograms=[
    [2,'forward(20)\nforward(25)\nforward(30)\nforward(25)\nforward(20)\nleft(90)\nright(90)',false],
    [3,'circle(8)\nforward(35)\ncircle(12)\nforward(40)\ncircle(18)\nforward(45)\ncircle(25)\nleft(90)',false],
    [6,'forward(30)\nleft(360)\nforward(20)\nright(360)\nforward(30)',false],
    [0,'forward(90)\nleft(90)\nforward(30)\nleft(0)',true],
    [1,'forward(110)\nbackward(110)',false],
    [3,'circle(20)\nforward(60)\ncircle(30)',true],
    [4,'circle(15)\nforward(60)\ncircle(25)\nforward(60)\ncircle(30)',true],
    [9,'bgcolor("black")\ncolor("cyan")\npensize(6)\nforward(40)\ncolor("yellow")\npensize(10)\nforward(40)\ncolor("magenta")',false],
    [10,'bgcolor("black")\ncolor("navy")\npensize(6)\nforward(40)\nleft(90)\ncolor("cyan")\nforward(30)',true],
    [11,'bgcolor("black")\ncolor("cyan")\npensize(6)\ncircle(20)\nforward(60)\ncolor("yellow")\ncircle(10)',true],
    [12,'print("abcde")\nprint("█   █")\nprint("abcde")',true],
    [13,'print("█    ")\nprint(" ███ ")\nprint("█████")\nprint("  █  ")\nprint("  █  ")',true],
    [14,'print("FOOD")\nprint("[██░░]")\nprint("4 / 4")\nprint("PLAY")\nprint("[███░]")\nprint("3 / 4")',false]
  ];
  for(const [index,code,assignment] of badPrograms){const check=assignment?lessons[index].steps.find(s=>s.phase==='Required assignment').check:lessons[index].check;assert.equal((await grade(check,await run(code))).ok,false,'Reject invalid task: '+index);}
  const parsed=await page.evaluate(()=>window.__unitTest.codeCalls('print("forward(999)") # forward(888)\nprint("It\\\'s (ready)")\nforward(10) # comment'));
  assert.equal(parsed.length,3);assert.equal(parsed[2].name,'forward');assert.equal(parsed[0].str,'forward(999)');
  console.log(`PASS ${requiredCount} assignment solutions, ${ideaCount} usable creative previews, ${predictionCount} prediction programs, and incorrect-result cases`);
  }
  // Check visible interactions using the actual embedded Python editor.
  const first=lessons[0];await page.goto(origin+'/pythoncourse/?lesson='+first.id);frame=await editor();
  const draft='forward(80)\nleft(90)\nforward(80)';await frame.locator('.CodeMirror').evaluate((el,code)=>el.CodeMirror.setValue(code),draft);
  await frame.locator('#clearCodeBtn').click();assert.equal(await frame.locator('.CodeMirror').evaluate(el=>el.CodeMirror.getValue()),'');
  await frame.locator('#codeHistoryBtn').click();const history=frame.locator('#historyPane');
  const saved=await frame.evaluate(()=>JSON.parse(localStorage.getItem('dsteckler-pythoncourse-'+new URL(location.href).searchParams.get('lesson')+'-history-v1')));
  const index=saved.findIndex(v=>v.code===draft);assert(index>=0,'Immediate clear preserves typed code in history');
  await history.locator('.history-version').nth(index).click();await history.getByRole('button',{name:'Restore this version'}).click();assert.equal(await frame.locator('.code-panel .CodeMirror').evaluate(el=>el.CodeMirror.getValue()),draft);
  await frame.locator('#commandsClose').click();
  const questionIndex=first.steps.findIndex(s=>s.question),q=first.steps[questionIndex].question;
  frame=await goStep(questionIndex);assert(await page.locator('#replayPrediction').isDisabled());
  await page.locator('#checkPrediction').click();assert((await page.locator('#predictionFeedback').innerText()).includes('Choose a prediction first'));
  const wrong=(q.answer+1)%q.choices.length;await page.locator('input[name="prediction"]').nth(wrong).check();await page.locator('#checkPrediction').click();
  assert((await page.locator('#predictionFeedback').innerText()).startsWith('Incorrect prediction'));
  await frame.waitForFunction(()=>document.getElementById('runBtn').disabled===false);
  await page.locator('input[name="prediction"]').nth(q.answer).check();await page.locator('#checkPrediction').click();assert((await page.locator('#predictionFeedback').innerText()).startsWith('✓ Corrected prediction'));
  assert((await page.evaluate(()=>Object.values(window.__unitTest.readResponses()).find(v=>v?.firstChoice!==undefined))).firstChoice===wrong);
  frame=await goStep(0);assert.equal(await frame.locator('.CodeMirror').evaluate(el=>el.CodeMirror.getValue()),draft,'Prediction keeps typed draft');
  const creative=first.steps.length-1;await goStep(creative);assert((await page.locator('#visibleCheckStatus').innerText()).includes('Pass this assignment'));
  assert.equal(await page.locator('#stepPhase').innerText(),'Required assignment');frame=await editor();assert.equal(await frame.locator('.CodeMirror').evaluate(el=>el.CodeMirror.getValue()),'','Assignment starts blank');
  await frame.locator('.CodeMirror').evaluate(el=>el.CodeMirror.setValue('forward(1)'));await page.locator('#checkCheckpoint').click();await page.waitForSelector('#checkFeedback.bad');
  await frame.locator('.CodeMirror').evaluate((el,code)=>el.CodeMirror.setValue(code),solutions[first.steps.find(s=>s.check).id]);await frame.locator('#runBtn').click();await frame.waitForFunction(()=>document.getElementById('runBtn').disabled);await page.locator('#checkCheckpoint').click();await page.waitForSelector('#checkFeedback.good');assert.equal(await page.locator('#checkCheckpoint').innerText(),'✓ Assignment passed');
  assert(await frame.locator('#courseTargetSuccess').isVisible());assert(await frame.locator('#courseTargetLabel').evaluate(el=>el.parentElement.classList.contains('world-info')));
  await goStep(creative);frame=await editor();assert.equal(await frame.locator('.CodeMirror').evaluate(el=>el.CodeMirror.getValue()),'','Project starts blank');
  const project=first.visuals[0].previewCode;await frame.locator('.CodeMirror').evaluate((el,code)=>el.CodeMirror.setValue(code),project);await goStep(0);await goStep(creative);frame=await editor();assert.equal(await frame.locator('.CodeMirror').evaluate(el=>el.CodeMirror.getValue()),project,'Project saves separately');
  frame=await goStep(first.steps.findIndex(s=>s.response));await page.locator('#evidenceResponse').fill('The first side got longer; the corner stayed 90 degrees.');await page.reload();await editor();assert((await page.locator('#evidenceResponse').inputValue()).includes('corner stayed'));
  // A guide must stay above the code when the referenced lines do not exist yet.
  const route=lessons[1];await page.goto(origin+'/pythoncourse/?lesson='+route.id);frame=await editor();await frame.locator('.CodeMirror').evaluate((el,code)=>el.CodeMirror.setValue(code),route.steps[0].example);frame=await goStep(route.steps.findIndex(s=>s.id.endsWith('close-example')));
  await frame.waitForSelector('#courseLineGuide');assert(await frame.locator('#courseLineGuide').evaluate(el=>el.parentElement.classList.contains('code-panel')));assert.equal(await frame.locator('.CodeMirror .course-line-guide').count(),0);
  await page.locator('.step-dot').nth(0).click();assert(await page.locator('#checkFeedback').isHidden());assert(await page.locator('#checkCheckpoint').isHidden());
  // Readable spacing and text mode, on desktop and on a phone.
  const ascii=lessons[12];await page.goto(origin+'/pythoncourse/?lesson='+ascii.id);frame=await editor();assert(await frame.locator('body').evaluate(el=>el.classList.contains('course-text-output')));
  assert(await frame.locator('#worldStage').isHidden());assert.equal((await frame.locator('#worldPanel .panel-label').innerText()).toLowerCase(),'text output');
  assert.equal(await page.locator('.primary-symbols .symbol-button').count(),4);
  await frame.locator('.CodeMirror').evaluate(el=>{el.CodeMirror.setValue('print("")');el.CodeMirror.setCursor({line:0,ch:7});});
  await page.getByRole('button',{name:'Insert and copy light shade ░'}).click();await frame.waitForFunction(()=>document.querySelector('.CodeMirror').CodeMirror.getValue()==='print("░")');
  await page.locator('#showSpaces').click();assert((await page.locator('#stepExample').innerText()).includes('print'));
  frame=await goStep(ascii.steps.findIndex(s=>s.phase==='Required assignment'));await page.locator('#showSpaces').click();assert((await page.locator('#stepExample').innerText()).includes('█·█'));
  await page.setViewportSize({width:390,height:844});await page.goto(origin+'/pythoncourse/?lesson='+first.id);await editor();await goStep(questionIndex);
  await page.locator('input[name="prediction"]').nth(q.answer).check();await page.locator('#checkPrediction').click();assert(await page.locator('#predictionFeedback').isVisible());
  const spacing=await page.locator('#predictionFeedback').evaluate(el=>({p:parseFloat(getComputedStyle(el).paddingLeft),w:el.getBoundingClientRect().width}));assert(spacing.p>=18&&spacing.w<390);
  assert.equal(await page.locator('#predictionFeedback').evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(231, 244, 233)','Corrected feedback has success styling');
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth&&document.documentElement.scrollHeight<=innerHeight));
  await page.locator('#replayPrediction').click();assert(await page.locator('#editorPane').isVisible());
  const proof=path.join(root,'../unit11-proof');fs.mkdirSync(proof,{recursive:true});await page.locator('#lessonTab').click();await page.screenshot({path:path.join(proof,'prediction-mobile.png')});
  await page.setViewportSize({width:1440,height:1000});await page.goto(origin+'/pythoncourse/?lesson='+ascii.id);await editor();await run(solutions[ascii.steps.find(s=>s.phase==='Required assignment').id]);await page.waitForFunction(()=>getComputedStyle(document.querySelector('.editor-loading')).opacity==='0');await page.screenshot({path:path.join(proof,'text-desktop.png')});
  await page.goto(origin+'/pythoncourse/?lesson='+route.id);await editor();await goStep(route.steps.findIndex(s=>s.id.endsWith('repair-width')));await run(solutions['1-2-solve-route-repair-width']);await page.screenshot({path:path.join(proof,'rectangle-desktop.png')});
  if(process.env.UNIT_TEST_FULL_FLOW==='1'){
    for(const lesson of lessons){
      await page.goto(origin+'/pythoncourse/?lesson='+lesson.id);await editor();
      for(const step of lesson.steps.filter(s=>s.question)){
        const frame=await goStep(lesson.steps.indexOf(step));
        await page.locator('input[name="prediction"]').nth(step.question.answer).check();await page.locator('#checkPrediction').click();
        assert((await page.locator('#predictionFeedback').innerText()).includes('prediction'));
        await frame.waitForFunction(()=>!document.getElementById('runBtn').disabled);
      }
      for(const step of lesson.steps.filter(s=>s.check)){
        const frame=await goStep(lesson.steps.indexOf(step));
        await frame.locator('.CodeMirror').evaluate((el,code)=>el.CodeMirror.setValue(code),solutions[step.id]);
        await page.locator('#checkCheckpoint').click();await page.waitForSelector('#checkFeedback.good');
        assert.equal(await page.locator('#checkCheckpoint').innerText(),'✓ Assignment passed');
      }
      const frame=await goStep(lesson.steps.length-1),v=lesson.visuals[0],code=v.previewCode||v.ascii.split('\n').map(row=>'print('+JSON.stringify(row)+')').join('\n');
      assert.equal(await page.locator('#stepPhase').innerText(),'Create your own');
      await frame.locator('.CodeMirror').evaluate((el,code)=>el.CodeMirror.setValue(code),code);
      await page.locator('#nextBtn').click();await page.waitForSelector('#checkFeedback.good');
      assert.equal(await page.evaluate(id=>JSON.parse(localStorage.getItem('dsteckler-pythoncourse-progress-v3-unit1'))[id],lesson.id),true);
      console.log('PASS complete lesson through controls '+lesson.number);
    }
    await page.goto(origin+'/learn/');await page.waitForSelector('#pythonProgress');
    assert.equal(await page.locator('#pythonProgress').innerText(),'15 / 21 complete');
    console.log('PASS student home reports the revised unit completion');
  }
  assert.deepEqual(errors,[],'No browser errors');
  console.log('PASS live prediction feedback, first-answer history, separate blank drafts, required-before-create navigation, note persistence, guide placement, target placement, output mode, and mobile layout');
}finally{await browser?.close();server.kill();}
