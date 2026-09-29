(async () => {
  'use strict';
  const $ = id => document.getElementById(id);
  const catalog = [...(window.TURTLE_BASE_CATALOG || []), ...(window.CURATED_EXAMPLES || []), ...(window.TURTLE_STARTER_CATALOG || [])];
  const requested = window.TURTLE_TUTORIAL_ID || new URLSearchParams(location.search).get('id') || 'robot-roll-call';
  let project, steps;
  try {
    if (!Object.prototype.hasOwnProperty.call(window.TURTLE_STEP_PLANS, requested)) throw Error('Unknown project');
    const response = await fetch('lessons/' + encodeURIComponent(requested) + '.json?v=' + window.TURTLE_LESSON_VERSION);
    if (!response.ok) throw Error('Lesson unavailable');
    const lesson = await response.json();
    if (lesson.id !== requested || !lesson.steps?.length) throw Error('Invalid lesson');
    let lines = [];
    steps = lesson.steps.map(step => {
      for (const edit of [...step.edits].reverse()) lines.splice(edit.start, edit.remove, ...edit.lines);
      return {...step, code:lines.join('\n')};
    });
    project = {...catalog.find(item => item.id === requested), id:requested, title:lesson.title, code:steps[steps.length-1].code};
  } catch (error) {
    $('projectTitle').textContent='Tutorial could not load';
    $('editorLoading').textContent='Reload the page to try again.';
    $('stepTitle').textContent='The lesson is not available yet.';
    $('instruction').textContent='Reload this page, or return to the gallery and choose a project.';
    $('nextStep').disabled=true; $('previousStep').disabled=true;
    return;
  }
  const stateKey='dsteckler-turtle-tutorial-learning-v2-'+project.id;
  let current=0, currentCode='', editorReady=false, saveFailed=false;
  try { current=Math.max(0,Math.min(steps.length-1,Number(localStorage.getItem(stateKey))||0)); } catch {}
  const hashStep=Number(location.hash.replace('#step-',''));
  if(/^#step-\d+$/.test(location.hash)&&hashStep>=1&&hashStep<=steps.length)current=hashStep-1;
  document.title=project.title+' · Turtle Tutorial | David Steckler';
  $('projectTitle').textContent=project.title;
  const projectLevel=window.TURTLE_PROJECT_LEVELS[project.id];
  $('projectLevel').textContent=projectLevel.level;
  $('projectLevel').className='level-badge level-'+projectLevel.level.toLowerCase();
  $('projectSkills').textContent=projectLevel.skills.join(' · ');
  $('drawingApproach').textContent=projectLevel.level==='Beginner'
    ? 'Use movement commands and choose your own distances and colors. No coordinate lists.'
    : projectLevel.style==='Coordinate drawing'
    ? 'This project places shapes with coordinates. Start with the example, then try nearby whole numbers to change a shape or position.'
    : projectLevel.style==='Math & patterns'
    ? 'This pattern uses formulas or recursion. Try a small number of repeats before increasing the detail.'
    : 'Build with shapes, loops, and functions. Sizes and colors are choices you can change.';
  document.querySelector('.back-link').href='./?level='+projectLevel.level;
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
  // Raspberry Pi-style draggable divider between instructions and editor.
  // Width is shared by all tutorials; the currently open project stays in place.
  const workspace=document.querySelector('.tutorial-workspace');
  const lessonPanel=$('lessonPanel'),lessonDivider=$('lessonDivider');
  const lessonWidthKey='dsteckler-turtle-lesson-width-v1';
  let desiredLessonWidth=null,draggingLesson=false,lessonPointerId=null;
  try{
    const saved=Number(localStorage.getItem(lessonWidthKey));
    if(Number.isFinite(saved)&&saved>=240&&saved<=950)desiredLessonWidth=saved;
  }catch{}
  function lessonLimits(){
    const style=getComputedStyle(workspace),rect=workspace.getBoundingClientRect();
    const nav=document.querySelector('.steps-panel').getBoundingClientRect().width;
    const free=rect.width-parseFloat(style.paddingLeft)-parseFloat(style.paddingRight)-nav-
      3*parseFloat(style.columnGap||style.gap||'8')-lessonDivider.getBoundingClientRect().width;
    return {min:Math.min(285,Math.max(240,free-325)),
      max:Math.max(240,Math.min(950,free-330)),free};
  }
  function setLessonWidth(width,save=false){
    if(matchMedia('(max-width:760px)').matches)return;
    const {min,max}=lessonLimits();
    const pixels=Math.round(Math.max(min,Math.min(max,width)));
    workspace.style.setProperty('--lesson-width',pixels+'px');
    lessonDivider.setAttribute('aria-valuemin',String(Math.round(min)));
    lessonDivider.setAttribute('aria-valuemax',String(Math.round(max)));
    lessonDivider.setAttribute('aria-valuenow',String(pixels));
    lessonDivider.setAttribute('aria-valuetext',pixels+' pixels wide');
    if(save){
      desiredLessonWidth=pixels;
      try{localStorage.setItem(lessonWidthKey,String(pixels));}catch{}
    }
    return pixels;
  }
  function initialLessonWidth(){
    if(matchMedia('(max-width:760px)').matches)return;
    const {max}=lessonLimits();
    setLessonWidth(desiredLessonWidth??Math.min(max,window.innerWidth>=1700?380:window.innerWidth>=1200?360:300));
  }
  lessonDivider.addEventListener('pointerdown',event=>{
    if(event.button!==0||matchMedia('(max-width:760px)').matches)return;
    draggingLesson=true;
    lessonPointerId=event.pointerId;
    lessonDivider.setPointerCapture(event.pointerId);
    lessonDivider.classList.add('dragging');
    workspace.classList.add('is-resizing');
    event.preventDefault();
  });
  // Track the whole document; a native iframe would otherwise swallow mouse moves
  // as soon as the handle is dragged into the code editor.
  document.addEventListener('pointermove',event=>{
    if(!draggingLesson||event.pointerId!==lessonPointerId)return;
    setLessonWidth(event.clientX-lessonPanel.getBoundingClientRect().left,true);
  },true);
  function stopLessonDrag(event){
    if(!draggingLesson||(event?.pointerId!==undefined&&event.pointerId!==lessonPointerId))return;
    draggingLesson=false;
    lessonPointerId=null;
    lessonDivider.classList.remove('dragging');
    workspace.classList.remove('is-resizing');
  }
  for(const type of ['pointerup','pointercancel'])document.addEventListener(type,stopLessonDrag,true);
  lessonDivider.addEventListener('lostpointercapture',stopLessonDrag);
  lessonDivider.addEventListener('keydown',event=>{
    if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
    event.preventDefault();
    const currentWidth=lessonPanel.getBoundingClientRect().width,limit=lessonLimits();
    const next=event.key==='Home'?limit.min:event.key==='End'?limit.max:
      currentWidth+(event.key==='ArrowRight'?1:-1)*(event.shiftKey?50:20);
    setLessonWidth(next,true);
  });
  window.addEventListener('resize',initialLessonWidth);
  initialLessonWidth();

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
    const oldLines=previous?previous.split('\n'):[];
    const editHost=$('codeEdits');
    editHost.replaceChildren();
    let offset=0;
    const edits=step.edits.map(edit=>{
      const item={...edit,newStart:edit.start+offset};
      offset+=edit.lines.length-edit.remove;
      return item;
    });
    // Bottom-to-top keeps the old line numbers stable while students apply edits.
    [...edits].reverse().forEach((edit,i)=>{
      const block=document.createElement('div');block.className='lesson-code';
      const caption=document.createElement('div');caption.className='code-caption';
      const range=edit.remove===1 ? 'line '+(edit.start+1) : 'lines '+(edit.start+1)+'–'+(edit.start+edit.remove);
      caption.textContent=edit.remove ? (edit.lines.length?'REPLACE ':'REMOVE ')+range : edit.start ? 'ADD after line '+edit.start : 'START at line 1';
      if(edit.remove){
        const old=document.createElement('details');old.className='old-code';
        const label=document.createElement('summary');label.textContent='Find this code in your editor';
        const snippet=document.createElement('pre');paintCode(snippet,oldLines.slice(edit.start,edit.start+edit.remove).join('\n'),edit.start+1);
        old.append(label,snippet);block.append(old);
      }
      block.append(caption);
      if(edit.lines.length){
        const snippet=document.createElement('pre');snippet.className='new-code';
        if(i===0)snippet.id='newCode';
        paintCode(snippet,edit.lines.join('\n'),edit.newStart+1);block.append(snippet);
      }
      editHost.append(block);
    });
    $('codeEdits').hidden=!edits.length;
    paintCode($('completeCode'),step.code);
    $('completeProgram').open=false;
    $('placement').textContent=step.remix ? 'Experiment in your editor. Your working example is below.' :
      edits.length>1 ? 'Apply these edits from top to bottom in the order shown. The replacement locations refer to the previous step’s example.' :
      current ? 'Keep the rest of your code. Use the old-code reference to locate this edit if your line numbers differ.' :
      'Type the code into your editor. Leave out the line numbers.';
    $('sameDrawing').hidden=!step.sameDrawing||step.remix;
    $('previousStep').disabled=current===0;$('nextStep').disabled=current===steps.length-1;
    $('nextStep').textContent=current===steps.length-1?'Final step':'Next step →';
    $('remixNote').hidden=!step.remix;
    $('questionTitle').textContent=step.remix?'Explain your changes':'Pause and predict';
    for(const id of ['previewDetails','helpDetails'])$(id).open=false;
    $('questionDetails').querySelector('.answer').open=false;
    $('expectedImage').hidden=true;
    $('lessonScroll').scrollTop=0;
    if(focus)$('stepTitle').focus({preventScroll:true});
    try{localStorage.setItem(stateKey,String(current));}catch{}
    history.replaceState(null,'',tutorialUrl+'#step-'+(current+1));
  }
  function go(index){current=index;render(true);$('steps').querySelector('[aria-current=step]')?.scrollIntoView({block:'nearest',inline:'nearest'});}
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
  frame.src='./?tutorialEmbed=1&project='+encodeURIComponent(project.id)+'&v=art-levels-1';
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
  document.body.dataset.lessonReady='true';
  // Always display the completed artwork, including when the tutorial opens at step 1.
  ensurePreviewFrame();
})();
