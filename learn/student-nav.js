/* Shared student navigation and a thinking notebook, saved per activity on this device. */
(() => {
  'use strict';
  const query = new URLSearchParams(location.search);
  if (window.self !== window.top || ['embed', 'tutorialEmbed', 'preview'].some(key => query.has(key))) return;
  const body = document.body;
  body.classList.add('student-shell');
  const path = location.pathname;
  const area = body.dataset.studentArea || (path.startsWith('/pythoncourse') ? 'python' : path.startsWith('/turtlereference') ? 'reference' : path.startsWith('/turtleprojects') ? 'challenges' : path.startsWith('/turtle/') ? 'create' : 'home');
  const links = [['home','Student home','/learn/'],['habits','Four steps','/learn/#habits'],['python','Python','/learn/python/'],['binary','Binary','/learn/binary/'],['challenges','Challenges','/learn/#challenges'],['reference','Reference','/learn/reference/'],['create','Create','/learn/create/']];
  const bar = document.createElement('div');
  bar.id = 'studentNav'; bar.setAttribute('role','navigation'); bar.setAttribute('aria-label','Student learning');
  bar.innerHTML = '<a class="student-home" href="/learn/" aria-label="Student home"><span class="student-brand">DS / learn</span><span class="student-mobile-home">Home</span></a><div class="student-links">' + links.map(([id,label,href]) => '<a href="'+href+'" data-area="'+id+'"'+(id === area ? ' aria-current="page"' : '')+'>'+label+'</a>').join('') + '</div><button type="button" id="openThinking">My thinking</button>';
  body.prepend(bar);
  const dialog = document.createElement('dialog');
  dialog.id = 'thinkingDialog'; dialog.setAttribute('aria-labelledby','thinkingTitle');
  const prompts = [
    ['focus','Focus your energy','What are you trying to make or solve?','One goal for this attempt…'],
    ['time','Guard your time','What will you put aside while you work?','A distraction I can put aside…'],
    ['train','Train your mind','What did you try? What happened?','I changed… I noticed…'],
    ['think','Think for yourself','What evidence supports your next move?','I think… because I observed…']
  ];
  dialog.innerHTML = '<div class="thinking-heading"><div><p>YOUR FOUR STEPS</p><h2 id="thinkingTitle">My thinking</h2></div><button type="button" id="closeThinking" aria-label="Close my thinking">×</button></div><p id="thinkingActivity"></p><div class="thinking-fields">'+prompts.map(([id,title,prompt,placeholder],index) => '<section><h3><span>'+String(index+1).padStart(2,'0')+'</span>'+title+'</h3><label for="thinking-'+id+'">'+prompt+'</label><textarea id="thinking-'+id+'" data-habit="'+id+'" rows="2" maxlength="6000" placeholder="'+placeholder+'"></textarea></section>').join('')+'</div><footer><span id="thinkingStatus" role="status">Saved on this device as you type.</span><button type="button" id="downloadThinking">Download notes</button></footer>';
  body.append(dialog);
  dialog.addEventListener('keydown',event=>event.stopPropagation());
  let activity, notes = {};
  const keyFor = item => 'dsteckler-thinking-v1:' + item.id;
  const fields = [...dialog.querySelectorAll('textarea')];
  function setActivity(item) {
    if (!item || typeof item.id !== 'string' || typeof item.title !== 'string') return;
    const url = new URL(item.url || location.href, location.origin);
    if (url.origin !== location.origin) return;
    const studentAddresses = {'/pythoncourse/':'/learn/python/','/turtle/':'/learn/create/','/python/':'/learn/code/','/turtleprojects/':'/learn/projects/','/turtlereference/':'/learn/reference/','/turtlereference/trails/':'/learn/trails/','/tracetable/':'/learn/trace/','/binary1.html':'/learn/binary/','/class2.html':'/learn/think/','/blackboxintro.html':'/learn/blackbox/','/asciiart.html':'/learn/ascii/','/timeline/':'/learn/timeline/','/TIOBE.html':'/learn/languages/'};
    if (studentAddresses[url.pathname]) url.pathname = studentAddresses[url.pathname];
    activity = {id:item.id,title:item.title,url:url.pathname+url.search+url.hash};
    try { notes = JSON.parse(localStorage.getItem(keyFor(activity)) || '{}') || {}; } catch { notes = {}; }
    fields.forEach(field => { field.value = typeof notes[field.dataset.habit] === 'string' ? notes[field.dataset.habit] : ''; });
    document.getElementById('thinkingActivity').textContent = activity.title;
    document.getElementById('thinkingStatus').textContent = 'Saved on this device as you type.';
    if (area !== 'home' && area !== 'habits') {
      try { localStorage.setItem('dsteckler-learning-recent-v1',JSON.stringify({...activity,updated:Date.now()})); } catch {}
    }
  }
  function open(habit) {
    if (!dialog.open) dialog.showModal();
    const field = fields.find(field => field.dataset.habit === habit);
    if (field) { field.focus(); field.scrollIntoView({block:'nearest'}); }
  }
  fields.forEach(field => field.addEventListener('input',() => {
    notes[field.dataset.habit] = field.value;
    try { localStorage.setItem(keyFor(activity),JSON.stringify(notes)); document.getElementById('thinkingStatus').textContent='Saved on this device.'; }
    catch { document.getElementById('thinkingStatus').textContent='This browser could not save. Download your notes to keep them.'; }
  }));
  document.getElementById('openThinking').addEventListener('click',() => open());
  document.getElementById('closeThinking').addEventListener('click',() => dialog.close());
  dialog.addEventListener('click',event => { if(event.target === dialog) { const r=dialog.getBoundingClientRect(); if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close(); } });
  document.addEventListener('click',event => { const trigger=event.target.closest('[data-thinking]'); if(trigger)open(trigger.dataset.thinking); });
  document.getElementById('downloadThinking').addEventListener('click',() => {
    const content = activity.title+'\nhttps://dsteckler.com'+activity.url+'\n\n'+prompts.map(([id,title,prompt]) => title+'\n'+prompt+'\n'+(notes[id]||'')+'\n').join('\n');
    const url = URL.createObjectURL(new Blob([content],{type:'text/plain;charset=utf-8'}));
    const a = document.createElement('a'); a.href=url;a.download='my-thinking.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  });
  window.StudentLearning = {setActivity,openThinking:open};
  window.addEventListener('learning-activity',event => setActivity(event.detail));
  setActivity(window.LEARNING_ACTIVITY || {id:path+location.search+location.hash,title:document.title.split('|')[0].trim(),url:location.href});
  // Keep the selected section visible without scrolling the document or shifting focus.
  const current = bar.querySelector('[aria-current]');
  if(current)bar.querySelector('.student-links').scrollLeft=Math.max(0,current.offsetLeft-bar.querySelector('.student-links').offsetLeft-20);
})();
