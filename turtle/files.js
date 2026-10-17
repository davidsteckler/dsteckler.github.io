(() => {
  'use strict';
  const wb=window.TurtleWorkbench;
  if(!wb||wb.isTrace||wb.isCourse)return;
  const key='dsteckler-turtle-code-v1',projectKey=key+'-files-v1';
  const make=(tag,cls,text)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(text!==undefined)el.textContent=text;return el;};
  const button=(label,fn,cls='file-tool')=>{const el=make('button',cls,label);el.type='button';el.addEventListener('click',fn);return el;};
  const fileKey=id=>id==='main'?key:key+'-file-'+id;
  let files=[{id:'main',name:'main.py'}],active='main',busy=false;
  const docs=new Map([['main',wb.editor.getDoc()]]);
  const notice=make('span','file-notice');notice.setAttribute('role','status');
  function message(text){notice.textContent=text;more.open=true;}
  try{
    const saved=JSON.parse(localStorage.getItem(projectKey)||'null');
    if(saved&&Array.isArray(saved.files)&&saved.files.length&&saved.files.length<=50){
      const valid=saved.files.filter(f=>f&&/^(main|[a-z0-9-]+)$/i.test(f.id)&&/^[A-Za-z_][A-Za-z0-9_]*\.py$/.test(f.name));
      if(valid.length===saved.files.length&&new Set(valid.map(f=>f.id)).size===valid.length&&new Set(valid.map(f=>f.name)).size===valid.length){
        files=valid;active=files.some(f=>f.id===saved.active)?saved.active:files[0].id;
        for(const file of files)if(file.id!=='main')docs.set(file.id,new CodeMirror.Doc(localStorage.getItem(fileKey(file.id))||'','python'));
      }
    }
  }catch{}
  const panel=document.querySelector('.code-panel');panel.classList.add('has-files');
  const bar=make('div','file-bar'),tabs=make('div','file-tabs');tabs.setAttribute('role','tablist');tabs.setAttribute('aria-label','Python files');
  const more=make('details','file-more'),summary=make('summary','file-tool','Files ▾'),menu=make('div','file-menu');
  more.append(summary,menu);bar.append(tabs,button('+',()=>newFile()),more);bar.children[1].setAttribute('aria-label','New Python file');
  panel.querySelector('.panel-head').after(bar);
  const sourceLabel=document.getElementById('codeStatus').parentElement;
  const editorElement=wb.editor.getWrapperElement();editorElement.id='pythonEditor';editorElement.setAttribute('role','tabpanel');
  function saveProject(){
    try{localStorage.setItem(projectKey,JSON.stringify({files,active}));return true;}
    catch{message('Device storage is full. Download your code to keep a copy.');return false;}
  }
  function render(){
    tabs.replaceChildren();
    for(const file of files){
      const tab=button(file.name,()=>select(file.id),'file-tab');tab.id='file-tab-'+file.id;tab.setAttribute('role','tab');
      tab.setAttribute('aria-selected',String(file.id===active));tab.setAttribute('aria-controls','pythonEditor');tab.tabIndex=file.id===active?0:-1;
      tab.addEventListener('keydown',e=>{
        if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();
        const i=files.findIndex(f=>f.id===active),next=e.key==='Home'?0:e.key==='End'?files.length-1:(i+(e.key==='ArrowRight'?1:files.length-1))%files.length;
        select(files[next].id);tabs.querySelector('[aria-selected="true"]').focus();
      });tabs.append(tab);
    }
    sourceLabel.lastChild.textContent=' '+files.find(f=>f.id===active).name;
    editorElement.setAttribute('aria-labelledby','file-tab-'+active);
    tabs.querySelector('[aria-selected="true"]').scrollIntoView({block:'nearest',inline:'nearest'});
  }
  function select(id){
    if(!docs.has(id))return;
    wb.selectFile(id,docs.get(id));active=id;saveProject();render();
  }
  function nameFor(proposed,except){
    const value=String(proposed||'').trim();if(!value)return null;
    const name=/\.py$/i.test(value)?value.slice(0,-3)+'.py':value+'.py';
    if(!/^[A-Za-z_][A-Za-z0-9_]*\.py$/.test(name)){message('Use a Python filename such as drawing.py (letters, numbers, and underscores).');return null;}
    if(files.some(f=>f.name===name&&f.id!==except)){message(name+' is already open. Choose another name.');return null;}
    return name;
  }
  function addFile(name,code){
    if(files.length>=50){message('Up to 50 Python files can be open at once.');return;}
    const id=crypto.randomUUID();files.push({id,name});docs.set(id,new CodeMirror.Doc(code,'python'));select(id);wb.editor.focus();
  }
  function newFile(){const name=nameFor(prompt('Name your Python file:','drawing.py'));if(name)addFile(name,'');}
  function download(){
    const url=URL.createObjectURL(new Blob([wb.editor.getValue()],{type:'text/x-python'})),a=make('a');
    a.href=url;a.download=files.find(f=>f.id===active).name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  const codeInput=make('input');codeInput.type='file';codeInput.accept='.py';codeInput.multiple=true;codeInput.hidden=true;bar.append(codeInput);
  codeInput.addEventListener('change',async()=>{
    for(const file of codeInput.files){
      if(file.size>1024*1024){message(file.name+' is too large. Choose a Python file under 1 MB.');continue;}
      const name=nameFor(file.name);if(!name)continue;
      try{addFile(name,await file.text());}catch{message('Could not open '+file.name+'.');}
    }codeInput.value='';
  });
  menu.append(button('Open .py files…',()=>codeInput.click()),button('Download current .py',download),button('Rename current file…',()=>{
    const file=files.find(f=>f.id===active),name=nameFor(prompt('Rename Python file:',file.name),active);
    if(name){file.name=name;saveProject();render();}
  }),button('Delete current file…',()=>{
    if(files.length===1){message('Keep at least one Python file open.');return;}
    const file=files.find(f=>f.id===active);
    if(!confirm('Delete '+file.name+' and its saved history from this device? Download a copy first if you need it.'))return;
    const removed=active;select(files.find(f=>f.id!==removed).id);files=files.filter(f=>f.id!==removed);docs.delete(removed);
    try{localStorage.removeItem(fileKey(removed));localStorage.removeItem(fileKey(removed)+'-history-v1');}catch{}
    saveProject();render();
  }),notice);
  window.TurtleFiles={read(path){
    const match=/^(?:\.\/)?([A-Za-z_][A-Za-z0-9_]*\.py)$/.exec(path);
    const file=match&&files.find(f=>f.name===match[1]);return file?docs.get(file.id).getValue():undefined;
  }};
  wb.selectFile(active,docs.get(active));render();saveProject();

  // Image bytes live in IndexedDB, separate from code and history storage.
  const controls=make('div','background-tools'),details=make('details'),settings=make('div','background-settings');
  details.append(make('summary','','Background image'),settings);controls.append(details);document.querySelector('.world-info').append(controls);
  const input=make('input');input.type='file';input.accept='image/png,image/jpeg,image/gif,image/webp';input.hidden=true;
  const image=make('img');image.id='worldBackground';image.alt='';image.hidden=true;document.getElementById('worldWrap').prepend(image);
  const status=make('p');status.setAttribute('role','status');status.textContent='Choose PNG, JPG, GIF, or WebP, up to 10 MB. Saved on this device.';
  const fit=make('select');fit.setAttribute('aria-label','Background image fit');
  for(const [value,label] of [['contain','Fit entire image'],['cover','Fill drawing area'],['fill','Stretch to fit']]){const option=make('option','',label);option.value=value;fit.append(option);}
  const fitLabel=make('label','','Image fit');fitLabel.append(fit);
  const upload=button('Upload image…',()=>input.click(),'btn'),remove=button('Remove image',()=>changeBackground(null),'btn');remove.disabled=true;
  settings.append(upload,input,fitLabel,remove,status);
  let current=null,objectURL=null,revision=0;
  const database=new Promise((resolve,reject)=>{
    const request=indexedDB.open('dsteckler-turtle-files-v1',1);
    request.onupgradeneeded=()=>request.result.createObjectStore('assets');request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);
  });
  async function store(record){
    const db=await database;
    await new Promise((resolve,reject)=>{const tx=db.transaction('assets','readwrite'),os=tx.objectStore('assets');if(record)os.put(record,'background');else os.delete('background');tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);});
  }
  function apply(record){
    current=record;if(objectURL)URL.revokeObjectURL(objectURL);objectURL=record?URL.createObjectURL(record.blob):null;
    if(record){image.src=objectURL;image.style.objectFit=record.fit;fit.value=record.fit;}else image.removeAttribute('src');
    image.hidden=!record;remove.disabled=!record;
  }
  async function changeBackground(record){
    ++revision;apply(record);
    remove.disabled=true;status.textContent='Saving background…';
    try{await store(record);status.textContent=record?record.name+' · saved on this device.':'Background image removed.';}
    catch{status.textContent=record?record.name+' is ready for this session; device storage is unavailable.':'Image removed for this session; device storage could not be updated.';}
    finally{remove.disabled=!current;}
  }
  input.addEventListener('change',async()=>{
    const file=input.files[0];input.value='';if(!file||busy)return;
    if(!['image/png','image/jpeg','image/gif','image/webp'].includes(file.type)){status.textContent='Choose a PNG, JPG, GIF, or WebP image.';return;}
    if(file.size>10*1024*1024){status.textContent='Image is too large. Choose an image under 10 MB.';return;}
    busy=true;upload.disabled=true;
    try{
      const check=new Image(),url=URL.createObjectURL(file);
      try{check.src=url;await check.decode();if(check.naturalWidth*check.naturalHeight>40000000)throw new Error('large');}
      finally{URL.revokeObjectURL(url);}
      await changeBackground({blob:file,name:file.name,fit:fit.value});
    }catch{status.textContent='Could not read this image. Choose a valid image smaller than 40 megapixels.';}
    finally{busy=false;upload.disabled=false;}
  });
  fit.addEventListener('change',()=>{if(current)changeBackground({...current,fit:fit.value});});
  database.then(db=>new Promise((resolve,reject)=>{const req=db.transaction('assets').objectStore('assets').get('background');req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);})).then(record=>{
    if(record&&revision===0){apply(record);status.textContent=record.name+' · saved on this device.';}
  }).catch(()=>{status.textContent='Device storage is unavailable. Uploaded backgrounds will work for this session.';});
})();
