(() => {
  'use strict';
  const workbench=window.TurtleWorkbench;
  if(!workbench||workbench.isTrace)return;
  const $=id=>document.getElementById(id);
  const topics=(window.TURTLE_REFERENCE||[]).filter(topic=>!topic.trail);
  const byId=new Map(topics.map(topic=>[topic.id,topic]));
  const groups=[...new Set(topics.map(topic=>topic.group))];
  let activeTab='reference',currentTopic=null,currentExample=null,browseScroll=0;
  let exampleRun=0,exampleDialog=null;
  const make=(tag,className,text)=>{const element=document.createElement(tag);if(className)element.className=className;if(text!==undefined)element.textContent=text;return element;};
  const action=(label,fn,className='btn')=>{const button=make('button',className,label);button.type='button';button.addEventListener('click',fn);return button;};

  function searchText(topic){
    return [topic.title,topic.group,topic.syntax,topic.summary,...(topic.aliases||[]),...(topic.params||[]).flat(),...(topic.examples||[]).flatMap(example=>[example.label,example.summary,example.code])].join(' ').toLowerCase();
  }
  function browse(){
    exampleRun++;
    const query=$('commandSearch').value.trim().toLowerCase(),found=topics.filter(topic=>searchText(topic).includes(query));
    const container=$('referenceBrowse');container.replaceChildren();
    $('referenceDetail').hidden=true;container.hidden=false;currentTopic=null;
    for(const group of groups){
      const matches=found.filter(topic=>topic.group===group);if(!matches.length)continue;
      const section=make('details','reference-group');section.open=!!query||['Start here','Move & turn'].includes(group);
      const heading=make('summary','',group);heading.append(make('span','',String(matches.length)));section.append(heading);
      for(const topic of matches){
        const button=action('',()=>openTopic(topic.id),'reference-topic');
        const image=thumbnail(topic,topic.examples?.[0]||topic);
        if(image)button.append(image);
        const copy=make('span','reference-topic-copy');
        copy.append(make('strong','',topic.title),make('small','',topic.summary));
        button.append(copy);
        section.append(button);
      }
      container.append(section);
    }
    $('commandsCount').textContent=found.length+' topics';$('commandEmpty').hidden=found.length>0;
  }
  function thumbnail(topic,example){
    const atlas=window.REFERENCE_PREVIEWS,record=atlas?.examples?.[topic.id+'/'+example.id];
    if(!record)return null;
    const size=88,tile=make('span','reference-thumbnail');
    tile.setAttribute('aria-hidden','true');
    tile.style.backgroundImage='url("/turtlereference/example-previews.webp?v=2")';
    tile.style.backgroundSize=(atlas.columns*size)+'px auto';
    tile.style.backgroundPosition=-(record.tile%atlas.columns)*size+'px '+-Math.floor(record.tile/atlas.columns)*size+'px';
    return tile;
  }
  function openTopic(id){
    const topic=byId.get(id);if(!topic)return;
    if(!currentTopic)browseScroll=$('referenceScroll').scrollTop;
    currentTopic=topic;currentExample=topic.examples?.[0]||topic;
    $('referenceBrowse').hidden=true;$('referenceDetail').hidden=false;$('commandEmpty').hidden=true;
    const detail=$('referenceDetail');detail.replaceChildren();
    detail.append(action('← All topics',()=>{browse();$('referenceScroll').scrollTop=browseScroll;},'reference-back'));
    detail.append(make('div','reference-group-label',topic.group),make('h2','',topic.title),make('p','',topic.summary));
    detail.append(make('h3','','Examples'));
    const strip=make('div','reference-example-strip');strip.setAttribute('aria-label','Example variations');
    for(const example of topic.examples||[topic]){
      const button=action('',()=>{currentExample=example;showExample();},'reference-example');
      button.dataset.exampleId=example.id;button.setAttribute('aria-pressed',String(example===currentExample));
      button.append(make('span','',example.label||'Example'));strip.append(button);
    }
    detail.append(strip,make('div','reference-example-content'));
    const runner=make('iframe','reference-engine');runner.title='Example execution engine';runner.hidden=true;runner.tabIndex=-1;runner.setAttribute('aria-hidden','true');runner.src='/turtle/?embed=reference';
    runner.addEventListener('load',()=>updateRunner());detail.append(runner);
    const runnerButtons=make('div','reference-runner-actions');
    runnerButtons.append(action('Use this code',()=>loadExample(currentExample.code),'btn primary'),action('Expand example ↗',()=>expandExample()));detail.append(runnerButtons);
    const notes=make('details','reference-topic-notes');notes.append(make('summary','','Syntax & parameters'));
    notes.append(make('pre','reference-syntax',topic.syntax));
    if(topic.aliases?.length)notes.append(make('p','','Also: '+topic.aliases.join(', ')));
    const params=make('dl','reference-params');
    for(const [name,explanation] of topic.params||[])params.append(make('dt','',name),make('dd','',explanation));
    notes.append(params);detail.append(notes,make('div','reference-example-notes'));

    if(topic.related?.some(id=>byId.has(id))){
      detail.append(make('h3','','Related'));
      const related=make('div','reference-related');
      for(const id of topic.related||[]){const other=byId.get(id);if(other)related.append(action(other.title,()=>openTopic(id),''));}
      detail.append(related);
    }
    const full=make('a','','Open this topic in the full reference ↗');full.href='/reference/#'+topic.id;full.target='_blank';full.rel='noopener';
    const fullRow=make('p');fullRow.append(full);detail.append(fullRow);
    showExample();$('referenceScroll').scrollTop=0;
  }
  function loadExample(code){
    workbench.replace(code,'Loaded '+(currentExample.label||currentTopic.title)+' reference example');
    if(innerWidth<=1350)workbench.closeSidebar();
  }
  function formattedCode(code){
    const pre=make('pre','reference-example-code'),body=make('code');pre.append(body);
    const mode=CodeMirror.getMode({indentUnit:4,tabSize:4},'python'),state=CodeMirror.startState(mode);
    for(const [i,line] of code.split('\n').entries()){
      if(i)body.append(document.createTextNode('\n'));
      const stream=new CodeMirror.StringStream(line,4);
      if(!line&&mode.blankLine)mode.blankLine(state);
      while(!stream.eol()){
        stream.start=stream.pos;const style=mode.token(stream,state);
        if(stream.pos===stream.start)stream.next();
        const span=make('span','',stream.current());if(style)span.className=style.split(' ').map(s=>'cm-'+s).join(' ');body.append(span);
      }
    }return pre;
  }
  async function updateRunner(){
    const runner=$('referenceDetail').querySelector('.reference-engine'),win=runner?.contentWindow;
    if(!win?.TraceTurtleEmbed?.preview||!currentExample)return;
    const serial=++exampleRun,example=currentExample,result=$('referenceDetail').querySelector('.reference-result');
    if(!result)return;result.setAttribute('aria-busy','true');
    try{
      const outcome=await win.TraceTurtleEmbed.preview(example.code);
      if(serial!==exampleRun||example!==currentExample||!result.isConnected)return;
      const content=result.querySelector('.reference-result-content');content.replaceChildren();
      if(!outcome.ok){content.append(make('p','reference-result-error',outcome.error||'This example could not run. Expand it to inspect the code.'));return;}
      if(outcome.printed.trim())content.append(make('pre','reference-result-console',outcome.printed.trimEnd()));
      const drawing=win.document.getElementById('turtle-drawing'),sprite=win.document.getElementById('turtle-sprite');
      const pixels=drawing.getContext('2d').getImageData(0,0,400,400).data;
      let hasDrawing=false;for(let i=3;i<pixels.length;i+=4)if(pixels[i]){hasDrawing=true;break;}
      const background=win.getComputedStyle(win.document.getElementById('worldWrap')).backgroundColor;
      if(hasDrawing||!outcome.printed.trim()||background!=='rgb(255, 255, 255)'){
        // Fit the visible marks rather than spending the card on empty canvas.
        const composite=document.createElement('canvas');composite.width=400;composite.height=400;
        const paint=composite.getContext('2d');paint.drawImage(drawing,0,0);paint.drawImage(sprite,0,0);
        let left=0,top=0,right=400,bottom=400;
        if(background==='rgb(255, 255, 255)'){
          const marks=paint.getImageData(0,0,400,400).data;let minX=400,minY=400,maxX=0,maxY=0;
          for(let y=0;y<400;y++)for(let x=0;x<400;x++)if(marks[(y*400+x)*4+3]){minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);}
          if(minX<=maxX){left=Math.max(0,minX-25);top=Math.max(0,minY-25);right=Math.min(400,maxX+26);bottom=Math.min(400,maxY+26);}
        }
        const canvas=make('canvas','reference-result-canvas');canvas.width=right-left;canvas.height=bottom-top;canvas.setAttribute('role','img');canvas.setAttribute('aria-label',example.expected||'Result of the example');
        const ctx=canvas.getContext('2d');ctx.fillStyle=background;ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(composite,left,top,canvas.width,canvas.height,0,0,canvas.width,canvas.height);content.append(canvas);
      }
    }catch(error){if(serial===exampleRun)result.querySelector('.reference-result-content').replaceChildren(make('p','reference-result-error','Preview unavailable. Expand the example to try it.'));}
    finally{if(serial===exampleRun)result.setAttribute('aria-busy','false');}
  }
  function expandExample(){
    if(exampleDialog){exampleDialog.close();exampleDialog.remove();}
    const example=currentExample,dialog=make('dialog','reference-dialog');exampleDialog=dialog;
    const heading=make('div','reference-dialog-heading'),title=make('h2','',currentTopic.title+' · '+example.label);title.id='expandedExampleTitle';dialog.setAttribute('aria-labelledby',title.id);
    heading.append(title,action('Close',()=>dialog.close()));
    const runner=make('iframe','reference-runner');runner.title='Interactive reference example';runner.src='/turtle/?embed=reference';
    runner.addEventListener('load',()=>{const win=runner.contentWindow;win.TurtleWorkbench.editor.setValue(example.code);win.TurtleWorkbench.editor.refresh();win.TraceTurtleEmbed.run();});
    const actions=make('div','reference-dialog-actions');
    actions.append(make('p','','Change the code and run it to experiment.'),action('▶ Run',()=>runner.contentWindow.TraceTurtleEmbed?.run(),'btn primary'),action('Stop',()=>runner.contentWindow.TraceTurtleEmbed?.stop()),action('Use this code',()=>{loadExample(runner.contentWindow.TurtleWorkbench?.editor.getValue()||example.code);dialog.close();}));
    dialog.append(heading,runner,actions);document.body.append(dialog);
    dialog.addEventListener('close',()=>{runner.contentWindow.TraceTurtleEmbed?.stop();dialog.remove();if(exampleDialog===dialog)exampleDialog=null;});
    dialog.showModal();
  }
  function showExample(){
    const example=currentExample,content=$('referenceDetail').querySelector('.reference-example-content');if(!example||!content)return;
    $('referenceDetail').querySelectorAll('[data-example-id]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.exampleId===example.id)));
    exampleRun++;
    content.replaceChildren();
    const codeCard=make('section','reference-code-card'),codeHead=make('div','reference-card-heading');codeHead.append(make('strong','','Python'),action('Copy',async()=>{
      try{await navigator.clipboard.writeText(example.code);codeHead.querySelector('button').textContent='Copied';}catch{codeHead.querySelector('button').textContent='Use this code to copy';}
    },'reference-copy'));
    codeCard.append(codeHead,formattedCode(example.code));
    const result=make('section','reference-result');result.setAttribute('aria-busy','true');
    const resultHead=make('div','reference-card-heading');resultHead.append(make('strong','','Result'),action('Run again',()=>updateRunner(),'reference-copy'));
    result.append(resultHead,make('div','reference-result-content'));result.querySelector('.reference-result-content').append(make('p','reference-preview-loading','Running example…'));
    content.append(codeCard,result);
    if(/\b(onclick|onscreenclick|onkey|onkeypress)\s*\(/.test(example.code))content.append(make('p','reference-interaction-hint','Expand this example to try its interactions.'));
    const notes=$('referenceDetail').querySelector('.reference-example-notes');notes.replaceChildren();
    for(const [title,text] of [['What you should see',example.expected],['Try changing',example.tryThis]])if(text)notes.append(make('h3','',title),make('p','',text));
    if(example.watchFor){const note=make('details','reference-topic-notes');note.append(make('summary','','Watch for'),make('p','',example.watchFor));notes.append(note);}
    updateRunner();
    $('referenceScroll').scrollTop=0;
  }
  $('commandSearch').addEventListener('input',()=>{browse();$('referenceScroll').scrollTop=0;});
  browse();

  let entries=[],selectedId=null,previewId=null,historyEditor=null,diffRows=[],historyOpen=false;
  const diffCache=new Map();
  const entryId=entry=>entry.id||entry.time+':'+entry.code;
  const timeFormat=new Intl.DateTimeFormat(undefined,{hour:'numeric',minute:'2-digit',second:'2-digit'});
  const dayFormat=new Intl.DateTimeFormat(undefined,{month:'short',day:'numeric',year:'numeric'});
  function changes(index){
    const entry=entries[index],id=entryId(entry),older=entries[index+1],olderId=older?entryId(older):null;
    const cached=diffCache.get(id);if(cached?.olderId===olderId)return cached.diff;
    const diff=window.TurtleHistoryDiff(older?.code||'',entry.code);diffCache.set(id,{olderId,diff});return diff;
  }
  function getHistoryEditor(){
    if(!historyEditor)historyEditor=CodeMirror.fromTextArea($('historyCode'),{
      mode:'python',readOnly:true,lineNumbers:true,lineWrapping:false,autofocus:false,
      gutters:['history-change-gutter','CodeMirror-linenumbers'],
      extraKeys:{Tab:false,'Shift-Tab':false}
    });
    return historyEditor;
  }
  function showVersion(id,preview=false){
    const index=entries.findIndex(entry=>entryId(entry)===id),entry=entries[index];if(!entry)return;
    previewId=preview?id:null;
    const diff=changes(index),view=$('historyView').value;
    $('historyVersionTime').textContent=dayFormat.format(new Date(entry.time))+' · '+timeFormat.format(new Date(entry.time));
    $('historyVersionReason').textContent=(entry.label||'Autosave')+' · '+(entry.code===''?0:entry.code.split('\n').length)+' lines'+(view==='diff'?' · +'+diff.added+' / −'+diff.removed:'');
    const cm=getHistoryEditor();
    cm.operation(()=>{
      for(let i=0;i<cm.lineCount();i++){cm.removeLineClass(i,'background','history-diff-added');cm.removeLineClass(i,'background','history-diff-removed');}
      cm.clearGutter('history-change-gutter');diffRows=view==='diff'?diff.rows:[];
      cm.setValue(view==='diff'?diff.rows.map(row=>row.text).join('\n'):entry.code);
      cm.setOption('lineNumberFormatter',number=>view==='diff'?(diffRows[number-1]?.newLine??diffRows[number-1]?.oldLine??''):number);
      if(view==='diff')diff.rows.forEach((row,i)=>{
        if(row.kind==='same')return;
        cm.addLineClass(i,'background','history-diff-'+row.kind);
        const marker=make('span','diff-marker diff-marker-'+row.kind,row.kind==='added'?'+':'−');marker.title=row.kind==='added'?'Added line':'Removed line';
        cm.setGutterMarker(i,'history-change-gutter',marker);
      });
    });
    cm.scrollTo(0,0);cm.refresh();
    if(view==='diff'){
      const first=diff.rows.findIndex(row=>row.kind!=='same');if(first>=0)cm.scrollIntoView({line:first,ch:0},30);
    }
    $('restoreHistoryVersion').disabled=entry.code===workbench.editor.getValue();
    $('restoreHistoryVersion').textContent=entry.code===workbench.editor.getValue()?'Already in your editor':'Restore this version';
    $('historyList').querySelectorAll('[data-version-id]').forEach(button=>{
      button.setAttribute('aria-pressed',String(button.dataset.versionId===selectedId));
      button.classList.toggle('previewing',preview&&button.dataset.versionId===id);
    });
  }
  function refreshHistory(){
    const followLatest=!selectedId||selectedId===entryId(entries[0]||{time:0,code:''});
    entries=workbench.readHistory();
    const retained=new Set(entries.map(entryId));for(const id of diffCache.keys())if(!retained.has(id))diffCache.delete(id);
    if(followLatest||!entries.some(entry=>entryId(entry)===selectedId))selectedId=entries[0]?entryId(entries[0]):null;
    previewId=null;
    const list=$('historyList');list.replaceChildren();let previousDay='';
    for(let index=0;index<entries.length;index++){
      const entry=entries[index],id=entryId(entry),date=new Date(entry.time),day=dayFormat.format(date);
      if(day!==previousDay){list.append(make('div','history-day',day));previousDay=day;}
      const button=action('',()=>{selectedId=id;previewId=null;showVersion(id);},'history-version');
      button.dataset.versionId=id;button.setAttribute('aria-pressed',String(id===selectedId));
      const time=make('time','',timeFormat.format(date));time.dateTime=date.toISOString();
      const delta=changes(index),counts=make('span','version-delta');counts.append(make('span','added','+'+delta.added),make('span','removed','−'+delta.removed));
      button.append(time,make('span','version-label',entry.label||'Autosave'),counts);
      button.title=day+' · '+timeFormat.format(date)+' · '+(entry.label||'Autosave');
      button.addEventListener('mouseenter',()=>showVersion(id,true));
      button.addEventListener('focus',()=>showVersion(id,true));
      button.addEventListener('mouseleave',()=>{if(previewId===id&&selectedId)showVersion(selectedId);});
      button.addEventListener('blur',()=>{if(previewId===id&&selectedId)showVersion(selectedId);});
      button.addEventListener('keydown',event=>{
        if(!['ArrowUp','ArrowDown','Home','End'].includes(event.key))return;
        event.preventDefault();const buttons=[...list.querySelectorAll('button')],at=buttons.indexOf(button);
        const next=event.key==='Home'?0:event.key==='End'?buttons.length-1:Math.max(0,Math.min(buttons.length-1,at+(event.key==='ArrowDown'?1:-1)));
        buttons[next]?.focus();
      });
      list.append(button);
    }
    if(selectedId)showVersion(selectedId);
    else{list.append(make('p','history-empty','No saved versions yet.'));$('restoreHistoryVersion').disabled=true;}
  }
  $('historyView').addEventListener('change',()=>{if(selectedId)showVersion(selectedId);});
  $('saveHistoryVersion').addEventListener('click',()=>{
    workbench.save('Saved version');refreshHistory();selectedId=entries[0]?entryId(entries[0]):null;
    if(selectedId)showVersion(selectedId);
    $('historyStatus').textContent=$('saveStatus').textContent==='Saved on this device'?'Current code saved.':$('saveStatus').textContent;
  });
  $('restoreHistoryVersion').addEventListener('click',()=>{
    const entry=entries.find(entry=>entryId(entry)===(previewId||selectedId));if(!entry)return;
    workbench.replace(entry.code,'Restored version from '+timeFormat.format(new Date(entry.time)));
    refreshHistory();$('historyStatus').textContent='Version restored. Your previous code stays in History.';
  });
  workbench.editor.on('change',()=>{
    if(!historyOpen)return;
    const entry=entries.find(entry=>entryId(entry)===(previewId||selectedId));
    if(entry){const same=entry.code===workbench.editor.getValue();$('restoreHistoryVersion').disabled=same;$('restoreHistoryVersion').textContent=same?'Already in your editor':'Restore this version';}
  });
  window.addEventListener('turtle-history-updated',()=>{if(historyOpen)refreshHistory();});
  window.addEventListener('storage',event=>{if(event.key===workbench.historyKey&&historyOpen)refreshHistory();});
  function selectTab(name){
    activeTab=name;historyOpen=name==='history';document.body.classList.toggle('history-active',historyOpen);
    for(const key of ['reference','history']){
      $(key+'Tab').setAttribute('aria-selected',String(key===name));$(key+'Tab').tabIndex=key===name?0:-1;$(key+'Pane').hidden=key!==name;
    }
    if(historyOpen){workbench.save();refreshHistory();requestAnimationFrame(()=>historyEditor?.refresh());}
    workbench.editor.refresh();
  }
  for(const name of ['reference','history']){
    $(name+'Tab').addEventListener('click',()=>selectTab(name));
    $(name+'Tab').addEventListener('keydown',event=>{
      if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
      event.preventDefault();const next=event.key==='Home'?'reference':event.key==='End'?'history':name==='reference'?'history':'reference';
      selectTab(next);$(next+'Tab').focus();
    });
  }
  window.TurtleSidebar={open(name){selectTab(name==='history'?'history':'reference');workbench.openSidebar();requestAnimationFrame(()=>{historyEditor?.refresh();if(historyOpen)$('historyTab').focus();});}};
})();
