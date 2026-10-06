(() => {
  'use strict';
  const workbench=window.TurtleWorkbench;
  if(!workbench||workbench.isTrace)return;
  const $=id=>document.getElementById(id);
  const topics=(window.TURTLE_REFERENCE||[]).filter(topic=>!topic.trail);
  const byId=new Map(topics.map(topic=>[topic.id,topic]));
  const groups=[...new Set(topics.map(topic=>topic.group))];
  let activeTab='reference',currentTopic=null,currentExample=null,browseScroll=0;
  const make=(tag,className,text)=>{const element=document.createElement(tag);if(className)element.className=className;if(text!==undefined)element.textContent=text;return element;};
  const action=(label,fn,className='btn')=>{const button=make('button',className,label);button.type='button';button.addEventListener('click',fn);return button;};

  function searchText(topic){
    return [topic.title,topic.group,topic.syntax,topic.summary,...(topic.aliases||[]),...(topic.params||[]).flat(),...(topic.examples||[]).flatMap(example=>[example.label,example.summary,example.code])].join(' ').toLowerCase();
  }
  function browse(){
    const query=$('commandSearch').value.trim().toLowerCase(),found=topics.filter(topic=>searchText(topic).includes(query));
    const container=$('referenceBrowse');container.replaceChildren();
    $('referenceDetail').hidden=true;container.hidden=false;currentTopic=null;
    for(const group of groups){
      const matches=found.filter(topic=>topic.group===group);if(!matches.length)continue;
      const section=make('details','reference-group');section.open=!!query||['Start here','Move & turn'].includes(group);
      const heading=make('summary','',group);heading.append(make('span','',String(matches.length)));section.append(heading);
      for(const topic of matches){
        const button=action('',()=>openTopic(topic.id),'reference-topic');
        button.append(make('strong','',topic.title),make('small','',topic.summary));
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
    detail.append(make('pre','reference-syntax',topic.syntax));
    if(topic.aliases?.length)detail.append(make('p','', 'Also: '+topic.aliases.join(', ')));
    if(topic.params?.length){
      const params=make('dl','reference-params');
      for(const [name,explanation] of topic.params)params.append(make('dt','',name),make('dd','',explanation));
      detail.append(params);
    }
    detail.append(make('h3','','Examples'));
    const strip=make('div','reference-example-strip');strip.setAttribute('aria-label','Example variations');
    for(const example of topic.examples||[topic]){
      const button=action('',()=>{currentExample=example;showExample();},'reference-example');
      button.dataset.exampleId=example.id;button.setAttribute('aria-pressed',String(example===currentExample));
      const image=thumbnail(topic,example);if(image)button.append(image);else button.classList.add('no-thumbnail');
      button.append(make('span','',example.label||'Example'));strip.append(button);
    }
    detail.append(strip,make('div','reference-example-content'));
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
  function showExample(){
    const example=currentExample,content=$('referenceDetail').querySelector('.reference-example-content');if(!example||!content)return;
    $('referenceDetail').querySelectorAll('[data-example-id]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.exampleId===example.id)));
    content.replaceChildren(make('h3','',example.label||'Example'),make('p','',example.summary));
    const code=make('pre','reference-code',example.code);code.setAttribute('aria-label','Example code');content.append(code);
    const buttons=make('div','reference-actions');
    const load=action('Load example',()=>{
      workbench.replace(example.code,'Loaded '+(example.label||currentTopic.title)+' reference example');
      if(innerWidth<=1350)workbench.closeSidebar();
    },'btn primary');load.title='Load in the editor. Your current code is saved in History.';
    buttons.append(load);content.append(buttons);
    for(const [title,text] of [['What you should see',example.expected],['Try changing',example.tryThis]])if(text)content.append(make('h3','',title),make('p','',text));
    if(example.watchFor){const note=make('div','reference-note');note.append(make('p','',example.watchFor));content.append(note);}
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
