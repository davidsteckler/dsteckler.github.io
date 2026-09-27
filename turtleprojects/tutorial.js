(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const robotBlocks = [
    'speed(5)\npensize(5)',
    '# The head\ncolor("royalblue")\npenup()\ngoto(-80, -80)\npendown()\nforward(160)\nleft(90)\nforward(160)\nleft(90)\nforward(160)\nleft(90)\nforward(160)\nleft(90)',
    '# Two eyes\ncolor("black")\npenup()\ngoto(-40, 20)\npendown()\ncircle(12)\npenup()\ngoto(40, 20)\npendown()\ncircle(12)',
    '# The mouth\npenup()\ngoto(-30, -35)\npendown()\nforward(60)',
    '# The antenna\ncolor("royalblue")\npenup()\ngoto(0, 80)\npendown()\nleft(90)\nforward(45)\nright(90)\ncircle(8)'
  ];
  const robotSteps = [
    {nav:'Get ready',title:'Meet your drawing pen.',instruction:'Type these two lines in the editor, then press Run.',explain:'Python follows your instructions from top to bottom. speed(5) sets the drawing speed. pensize(5) sets the line thickness.',expected:'A blank grid. The turtle starts in the center, facing right. These lines set up your pen.',question:'What will change if you use pensize(10)?',answer:'Your next lines will be thicker. The turtle will move the same distance.',help:'Use lowercase letters and a pair of parentheses on each line. Start both commands at the left edge.'},
    {nav:'Draw the head',title:'Draw the robot’s head.',instruction:'Keep your setup lines. Add the new lines below them. Trace the four sides with your finger before you run.',explain:'penup() lifts the pen for the move to (−80, −80). pendown() starts drawing again. Each left(90) turns one square corner.',expected:'A blue square around the center of the grid. Each side is 160 units long.',question:'What if you change only the first forward(160) to forward(100)?',answer:'The bottom side becomes shorter, so the four sides will no longer close into a square.',help:'For a diagonal through the square, check penup() before goto(). For a crooked head, check all four distances and turns.'},
    {nav:'Add the eyes',title:'Give it two eyes.',instruction:'Add this block below the head. Run the whole program again.',explain:'goto(x, y) moves to a coordinate. circle(12) draws an eye with a radius of 12. The turtle starts at the bottom of each circle.',expected:'Two black circular eyes inside the head.',question:'Why lift the pen before moving to the second eye?',answer:'With the pen down, the turtle draws a line as it moves between the eyes.',help:'Check penup() before each goto(), and pendown() before each circle(). Keep the comma between the two coordinates.'},
    {nav:'Give it a mouth',title:'Add a straight mouth.',instruction:'Add the mouth below the eyes. The turtle is still facing right.',explain:'The mouth begins at x = −30 and ends at x = 30. The negative y-coordinate puts it below the middle of the head.',expected:'A short black mouth below the two eyes.',question:'Which moves the mouth lower: goto(-30, -55) or goto(-30, 55)?',answer:'goto(-30, -55). Negative y-coordinates are below the center.',help:'If the mouth touches an eye, check penup() before goto(). If it points up, check the turns in your head block.'},
    {nav:'Build an antenna',title:'Finish with an antenna.',instruction:'Add these lines at the bottom of your program, then run it.',explain:'The top of the head is at y = 80. left(90) points up for the antenna. right(90) points right again so the circular tip sits on top.',expected:'A blue antenna with a small round tip above the head.',question:'What happens if forward(45) becomes forward(65)?',answer:'The antenna becomes 20 units taller. The head stays the same size.',help:'If the antenna goes sideways, check left(90). If the tip sits to one side, check right(90) before circle(8).'},
    {nav:'Make it yours',title:'Make your robot your own.',instruction:'Change two details in your code: its color, eye positions, or antenna length. Run after each change.',explain:'Change a number or a color in a command you already typed. Leave the other commands in place so you can see what your edit changes.',expected:'Your own version of the robot. Give it a name and show a partner what you changed.',question:'What does penup() do? Which command changed your robot?',answer:'penup() lets the turtle move without leaving a line. Point to one edit and explain what changed in your drawing.',help:'Try changing both royalblue values to forestgreen, the eye x-coordinates from −40 and 40 to −50 and 50, or the antenna length from 45 to 65.',remix:true}
  ];
  const catalog = [...(window.TURTLE_BASE_CATALOG || []), ...(window.CURATED_EXAMPLES || [])];
  const requested = window.TURTLE_TUTORIAL_ID || new URLSearchParams(location.search).get('id') || 'robot-roll-call';
  let project, steps;
  if (requested === 'robot-roll-call') {
    project = {id:requested,title:'Robot roll call',code:robotBlocks.join('\n\n')};
    steps = robotSteps.map((step,i) => ({...step,code:robotBlocks.slice(0,Math.min(i+1,5)).join('\n\n')}));
  } else {
    project = catalog.find(item => item.id === requested);
    if (!project || !window.TURTLE_STEP_PLANS[requested]) {
      $('projectTitle').textContent='Project not found';
      $('editorLoading').textContent='Choose a project from the gallery to open its tutorial.';
      $('stepTitle').textContent='Choose a Turtle project.';
      $('instruction').innerHTML='<a href="./?projects=1">Back to all projects →</a>';
      $('nextStep').disabled=true;$('previousStep').disabled=true;
      return;
    }
    const lines = project.code.split('\n');
    steps = window.TURTLE_STEP_PLANS[requested].map((part,i) => {
      const code = lines.slice(0,part.end).join('\n');
      const block = lines.slice(i ? window.TURTLE_STEP_PLANS[requested][i-1].end : 0,part.end).join('\n');
      const functionStep=part.kind==='function', setup=part.kind==='setup';
      let explain=functionStep?'A function stores a set of instructions under a name. Keep the spaces at the start of its lines. Later code calls this function to draw.':setup?'These commands prepare the pen, colors, and values used in the drawing. Python will use these settings in the steps that follow.':explainBlock(block);
      return {nav:part.title,title:part.title,instruction:i?'Keep your earlier code. Add these lines at the bottom, then run your program.':'Type these lines in the editor, then press Run.',explain,code,
        expected:functionStep?'Function definitions do not draw until they are called. The picture may stay the same in this step.':setup?'The pen and background settings are ready. Open the step’s drawing below to compare.':'Compare your drawing with this step’s example below. Look for the shapes added by your new lines.',
        question:functionStep?'Which name will you use to call this function?':'Choose one number or color in this block. What do you predict would change if you edited it?',
        answer:functionStep?'Use the name after def, followed by parentheses containing the inputs listed in its definition.':'Try your edit and run again. Use the command name to explain the change: movement changes position, turns change direction, and colors change the pen or background.',
        help:'Check spelling, parentheses, commas, and quotation marks. Keep indentation exactly as shown. If shapes connect unexpectedly, check penup(). Read the error message under the drawing for the line to check.'};
    });
    steps.push({nav:'Make it yours',title:'Make it yours.',instruction:'Change two details in your program. Try a color first, then a size or position.',explain:'Run after each edit and compare the result. You can return to earlier steps to check a command.',expected:'Your own version of '+project.title+'.',question:'Which command made the biggest change to your drawing?',answer:'Point to the command and describe what you saw change when you ran it.',help:'Look for a quoted color or a number passed to a drawing command. Change one value at a time.',code:project.code,remix:true});
  }
  function explainBlock(block) {
    if(/begin_fill\(/.test(block))return 'begin_fill() starts a filled shape. The turtle follows your movement commands, then end_fill() fills the shape. Keep the whole block together.';
    if(/^\s*for .+ in /m.test(block))return 'The for loop repeats its indented commands. Lines outside the indentation run after the loop. Keep each line’s spaces as shown.';
    if(/\bcircle\(/.test(block))return 'circle() draws a curve from the turtle’s current position and direction. The first number is its radius; a second number limits how far around it draws.';
    if(/\b(?:goto|penup|pendown)\(/.test(block))return 'penup() moves without drawing. goto(x, y) chooses the position, and pendown() starts drawing again. Negative coordinates are left of or below the center.';
    return 'Python runs these lines in order. Check each command’s inputs to see which positions, sizes, and colors it uses.';
  }
  const stateKey='dsteckler-turtle-tutorial-step-'+project.id;
  let current=0, currentCode='', editorReady=false, saveFailed=false;
  try { current=Math.max(0,Math.min(steps.length-1,Number(localStorage.getItem(stateKey))||0)); } catch {}
  const hashStep=Number(location.hash.replace('#step-',''));
  if(/^#step-\d+$/.test(location.hash)&&hashStep>=1&&hashStep<=steps.length)current=hashStep-1;
  document.title=project.title+' · Turtle Tutorial | David Steckler';
  $('projectTitle').textContent=project.title;
  $('finishedTitle').textContent=project.title;
  $('finishedImage').alt='Finished Python Turtle drawing: '+project.title;
  $('finishedDialogTitle').textContent=project.title;
  $('finishedDialogImage').alt='Finished Python Turtle drawing: '+project.title;
  $('finishedExpand').onclick=()=>{
    if($('finishedImage').hidden)return;
    $('finishedDialogImage').src=$('finishedImage').src;
    if(!$('finishedDialog').open)$('finishedDialog').showModal();
  };
  $('finishedClose').onclick=()=>$('finishedDialog').close();
  $('finishedDialog').addEventListener('click',event=>{
    if(event.target===$('finishedDialog'))$('finishedDialog').close();
  });
  // Show the same shareable address even when an old ?id= link is opened.
  const shortSlug=window.TURTLE_TUTORIAL_SLUGS?.[project.id];
  const tutorialUrl=shortSlug ? new URL(shortSlug+'/',new URL('./',document.baseURI)).href : location.href.split('#')[0];
  // Keep legacy ?id= addresses usable while showing their friendly URLs
  // in the address bar. The fixed <base> keeps editor/assets and Gallery links stable.
  if (shortSlug && /\/project\.html$/.test(location.pathname)) {
    history.replaceState(history.state, '', tutorialUrl + location.hash);
  }
  $('tutorialUrl').href=tutorialUrl;
  $('tutorialUrl').textContent=tutorialUrl.replace(/^https?:\/\//,'').replace(/\/$/,'');
  $('copyTutorialLink').onclick=async()=>{
    const button=$('copyTutorialLink');
    let copied=false;
    try {
      if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(tutorialUrl);copied=true;}
    } catch {}
    if(!copied){
      const field=document.createElement('textarea');
      field.value=tutorialUrl;field.setAttribute('readonly','');field.style.position='fixed';field.style.opacity='0';
      document.body.append(field);field.select();
      try {copied=document.execCommand('copy');} catch {}
      field.remove();
    }
    button.textContent=copied?'Copied!':'Copy failed';
    setTimeout(()=>{button.textContent='Copy link';},1800);
  };
  const frame=$('editorFrame');
  const send=(kind,extra={})=>frame.contentWindow?.postMessage({kind,...extra},location.origin);
  const escape=text=>text.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
  function paintCode(target,source,start=1) {
    target.innerHTML=source.split('\n').map((line,i)=>{
      const re=/(#[^\n]*|"[^"\n]*"|'[^'\n]*'|\b(?:from|import|for|in|def|if|else|return|while)\b|\b[a-zA-Z_]\w*(?=\()|-?\b\d+(?:\.\d+)?\b)/g;
      let html='',last=0;
      for(const match of line.matchAll(re)) {
        html+=escape(line.slice(last,match.index));const token=match[0];
        const type=token[0]==='#'?'comment':/^['"]/.test(token)?'string':/^-?\d/.test(token)?'number':/^(from|import|for|in|def|if|else|return|while)$/.test(token)?'keyword':'command';
        html+='<span class="token-'+type+'">'+escape(token)+'</span>';last=match.index+token.length;
      }
      return '<span class="code-line"><span class="line-number" aria-hidden="true">'+(start+i)+'</span><span>'+html+escape(line.slice(last))+'</span></span>';
    }).join('');
  }
  function render(focus=false) {
    const step=steps[current];
    $('steps').replaceChildren(...steps.map((s,i)=>{
      const b=document.createElement('button');b.type='button';b.className='step-button';b.title=s.nav;
      b.setAttribute('aria-label','Step '+(i+1)+': '+s.nav);
      if(i===current)b.setAttribute('aria-current','step');
      b.innerHTML='<span class="step-number">'+(i+1)+'</span><span class="step-name">'+escape(s.nav)+'</span>';
      b.addEventListener('click',()=>go(i));return b;
    }));
    $('stepCount').textContent='STEP '+(current+1)+' OF '+steps.length;
    $('stepSummary').textContent='Step '+(current+1)+' of '+steps.length;
    $('footerCount').textContent=(current+1)+' / '+steps.length;
    $('progress').max=steps.length;$('progress').value=current+1;
    for(const [id,key] of [['stepTitle','title'],['instruction','instruction'],['explanation','explain'],['expected','expected'],['question','question'],['answer','answer'],['help','help']])$(id).textContent=step[key];
    const previous=current?steps[current-1].code:'';
    const oldLines=previous?previous.split('\n').length:0;
    const allLines=step.code.split('\n');let first=step.remix?0:oldLines;
    while(!step.remix&&first<allLines.length&&!allLines[first].trim())first++;
    paintCode($('newCode'),allLines.slice(first).join('\n'),first+1);
    paintCode($('previousCode'),previous);
    $('earlierCode').hidden=!previous||!!step.remix;$('earlierCode').open=false;
    $('earlierRange').textContent=previous?'1–'+oldLines:'';
    $('codeCaption').textContent=step.remix?'REFERENCE · Your complete program':'NEW · Type '+(allLines.length-first===1?'line '+(first+1):'lines '+(first+1)+'–'+allLines.length);
    $('placement').textContent=step.remix?'Make changes in your editor. This example stays here for reference.':current?'Keep your earlier lines. Add this block underneath them.':'Start at line 1. Leave out the line numbers shown here.';
    $('previousStep').disabled=current===0;$('nextStep').disabled=current===steps.length-1;
    $('nextStep').textContent=current===steps.length-1?'Final step':'Next step →';
    $('remixNote').hidden=!step.remix;
    $('questionTitle').textContent=step.remix?'Explain your changes':'Think about it';
    for(const id of ['previewDetails','questionDetails','helpDetails'])$(id).open=false;
    $('questionDetails').querySelector('.answer').open=false;
    $('expectedImage').hidden=true;
    $('lessonScroll').scrollTop=0;
    if(focus)$('stepTitle').focus({preventScroll:true});
    try{localStorage.setItem(stateKey,String(current));}catch{}
    history.replaceState(null,'',tutorialUrl+'#step-'+(current+1));
  }
  function go(index){current=index;render(true);}
  $('previousStep').onclick=()=>{if(current>0)go(current-1)};
  $('nextStep').onclick=()=>{if(current<steps.length-1)go(current+1)};
  document.querySelectorAll('[data-view]').forEach(button=>button.onclick=()=>{
    const isEditor=button.dataset.view==='editor';document.body.classList.toggle('editor-view',isEditor);
    document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  });
  let loadingTimer=setTimeout(()=>{
    if(editorReady)return;
    $('editorLoading').innerHTML='<span>The editor is taking longer to load.</span><button type="button" class="quiet-button" id="reloadEditor">Reload editor</button>';
    $('reloadEditor').onclick=()=>{frame.src=frame.src;};
  },15000);
  window.addEventListener('message',event=>{
    if(event.origin!==location.origin||event.source!==frame.contentWindow||!event.data||event.data.project!==project.id)return;
    const data=event.data;
    if(data.kind==='turtle-tutorial-ready'){
      editorReady=true;clearTimeout(loadingTimer);$('editorLoading').hidden=true;$('downloadCode').disabled=false;
      currentCode=data.code||'';$('saveNote').textContent=currentCode?'Code restored on this device':'Your code saves on this device';
    }else if(data.kind==='turtle-tutorial-code'){
      currentCode=data.code;$('saveNote').textContent=saveFailed?'Code could not be saved':'Saving…';
    }else if(data.kind==='turtle-tutorial-saved'){
      saveFailed=false;$('saveNote').textContent='Saved on this device';
    }else if(data.kind==='turtle-tutorial-save-failed'){
      saveFailed=true;$('saveNote').textContent='Not saved · download your code';
    }
  });
  frame.addEventListener('load',()=>send('turtle-tutorial-hello'));
  frame.src='./?tutorialEmbed=1&project='+encodeURIComponent(project.id)+'&v=tutorial-1';
  $('downloadCode').onclick=()=>{
    // Same-origin access gets the latest keystroke, including before autosave.
    const cm=frame.contentDocument?.querySelector('.CodeMirror')?.CodeMirror;
    const code=cm?cm.getValue():currentCode;
    const blob=new Blob([code+'\n'],{type:'text/x-python'}),url=URL.createObjectURL(blob);
    const a=document.createElement('a');a.href=url;a.download=project.title.toLowerCase().replace(/[^a-z0-9]+/g,'-')+'.py';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  };
  // One reference renderer produces both the finished project and individual step drawings.
  // It runs in a hidden iframe so the student's editor and saved code are untouched.
  let previewFrame=null,previewReady=false,previewBusy=false,previewRequest=0;
  let previewTimer=null,previewLoadTimer=null,previewPending=null,finishedFailed=false;
  const previewCache=new Map(),failedSteps=new Set();
  function showFinished(image) {
    $('finishedImage').src=image;
    $('finishedImage').hidden=false;
    $('finishedStatus').hidden=true;
    $('finishedExpand').disabled=false;
    $('finishedRetry').hidden=true;
  }
  function finishedError(message) {
    finishedFailed=true;
    $('finishedImage').hidden=true;
    $('finishedStatus').hidden=false;
    $('finishedStatus').textContent=message;
    $('finishedRetry').hidden=false;
  }
  function ensurePreviewFrame() {
    if(previewFrame)return;
    const iframe=document.createElement('iframe');
    iframe.hidden=true;iframe.title='Turtle drawing renderer';
    previewFrame=iframe;previewReady=false;
    iframe.onload=()=>{
      if(previewFrame!==iframe)return;
      clearTimeout(previewLoadTimer);previewLoadTimer=null;
      previewReady=true;pumpPreview();
    };
    iframe.src='./?renderPreview=1&v=tutorial-2';
    document.body.append(iframe);
    previewLoadTimer=setTimeout(()=>{
      if(previewFrame!==iframe||previewReady)return;
      iframe.remove();previewFrame=null;
      finishedError('Preview did not load.');
      if($('previewDetails').open)$('previewStatus').textContent='The example could not load. Close and reopen this section to retry.';
    },20000);
  }
  function pumpPreview() {
    if(!previewFrame||!previewReady||previewBusy)return;
    let key,code;
    if(!previewCache.has('finished')&&!finishedFailed){
      key='finished';code=project.code;
    }else if($('previewDetails').open&&!previewCache.has(current)&&!failedSteps.has(current)){
      key=current;code=steps[current].code;
    }else return;
    previewBusy=true;
    const id='tutorial-'+(++previewRequest);
    previewPending={id,key};
    // The reference draws instantly; student playback retains its selected speed.
    code=code.replace(/^speed\([^\n]*\)$/gm,'speed(0)');
    previewFrame.contentWindow.postMessage({kind:'turtle-render',id,code},location.origin);
    previewTimer=setTimeout(()=>{
      const pending=previewPending;
      if(!pending||pending.id!==id)return;
      previewPending=null;previewBusy=false;previewReady=false;
      previewFrame?.remove();previewFrame=null;
      if(pending.key==='finished')finishedError('Preview is taking longer than expected.');
      else{
        failedSteps.add(pending.key);
        if($('previewDetails').open)$('previewStatus').textContent='The example could not load. Close and reopen this section to retry.';
      }
      if($('previewDetails').open&&pending.key==='finished')ensurePreviewFrame();
    },40000);
  }
  function requestPreview() {
    if(!$('previewDetails').open)return;
    const cached=previewCache.get(current);
    if(cached){
      $('expectedImage').src=cached;$('expectedImage').hidden=false;$('previewStatus').hidden=true;
      return;
    }
    $('expectedImage').hidden=true;$('previewStatus').hidden=false;
    $('previewStatus').textContent='Creating this step’s drawing…';
    ensurePreviewFrame();pumpPreview();
  }
  window.addEventListener('message',event=>{
    if(event.origin!==location.origin||event.source!==previewFrame?.contentWindow||
       event.data?.kind!=='turtle-rendered'||event.data.id!==previewPending?.id)return;
    clearTimeout(previewTimer);previewTimer=null;
    const key=previewPending.key, image=event.data.image;
    previewPending=null;previewBusy=false;
    if(image){
      previewCache.set(key,image);
      if(key==='finished'){
        showFinished(image);
        // The last step is the completed program: reuse the exact same image.
        if(steps[steps.length-1].code===project.code)previewCache.set(steps.length-1,image);
      }else if(key===current&&$('previewDetails').open){
        $('expectedImage').src=image;$('expectedImage').hidden=false;$('previewStatus').hidden=true;
      }
    }else if(key==='finished'){
      finishedError('Drawing preview unavailable.');
    }else{
      failedSteps.add(key);
      if(key===current&&$('previewDetails').open)$('previewStatus').textContent='The example could not load. Close and reopen this section to retry.';
    }
    if($('previewDetails').open)requestPreview();
    pumpPreview();
  });
  $('previewDetails').addEventListener('toggle',()=>{
    if($('previewDetails').open){failedSteps.delete(current);requestPreview();}
  });
  $('finishedRetry').onclick=()=>{
    finishedFailed=false;$('finishedRetry').hidden=true;
    $('finishedStatus').textContent='Creating the finished drawing…';
    ensurePreviewFrame();pumpPreview();
  };
  render();
  // Always display the completed artwork, including when the tutorial opens at step 1.
  ensurePreviewFrame();
})();
