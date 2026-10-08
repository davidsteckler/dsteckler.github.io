(() => {
  'use strict';
  const topics = window.HTML_REFERENCE || [];
  const workbench = window.HtmlWorkbench;
  if (!topics.length || !workbench) return;

  const $ = id => document.getElementById(id);
  const panel = $('htmlReferencePanel');
  const browse = $('referenceBrowse');
  const detail = $('referenceDetail');
  const search = $('referenceSearch');
  const count = $('referenceCount');
  const filters = $('referenceFilters');
  const overlay = $('referenceOverlay');
  const refButton = $('referenceButton');
  const refClose = $('referenceClose');
  const groups = [...new Set(topics.map(t => t.group))];

  let activeGroup = 'All';
  let current = null;
  let miniEditor = null;
  let previewTimer = null;
  let browseScroll = 0;

  const make = (tag, className, text) => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  };

  function previewDocument(code, compact=false){
    return '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
      '<style>html,body{margin:0;min-height:100%;background:white;color:#202525;font-family:Arial,sans-serif}body{padding:'+(compact?'10px':'18px')+';box-sizing:border-box;font-size:'+(compact?'11px':'14px')+'}h1,h2,h3{margin-top:0}img,video{max-width:100%}button,input,select,textarea{font:inherit}a{color:#176b73}table{max-width:100%}</style>' +
      '</head><body>' + code + '</body></html>';
  }

  function searchText(topic){
    return [topic.title, topic.group, topic.summary, topic.code].join(' ').toLowerCase();
  }

  function buildFilters(){
    filters.replaceChildren();
    ['All', ...groups].forEach(group => {
      const button = make('button','reference-filter',group);
      button.type = 'button';
      button.setAttribute('aria-pressed', String(group === activeGroup));
      button.addEventListener('click', () => {
        activeGroup = group;
        buildFilters();
        renderBrowse();
      });
      filters.append(button);
    });
  }

  function renderBrowse(){
    current = null;
    if (miniEditor) {
      miniEditor.toTextArea();
      miniEditor = null;
    }
    detail.hidden = true;
    browse.hidden = false;
    const q = search.value.trim().toLowerCase();
    const found = topics.filter(topic => {
      const matchesGroup = activeGroup === 'All' || topic.group === activeGroup;
      const matchesSearch = !q || searchText(topic).includes(q);
      return matchesGroup && matchesSearch;
    });
    count.textContent = found.length + (found.length === 1 ? ' topic' : ' topics');
    browse.replaceChildren();

    if (!found.length) {
      browse.append(make('div','reference-empty','No reference topics match that search.'));
      return;
    }

    const visibleGroups = activeGroup === 'All' ? groups : [activeGroup];
    visibleGroups.forEach(group => {
      const matches = found.filter(topic => topic.group === group);
      if (!matches.length) return;
      const section = make('section','reference-group-section');
      const head = make('div','reference-group-head');
      head.append(make('h3','',group), make('span','',String(matches.length)));
      section.append(head);

      matches.forEach(topic => {
        const button = make('button','reference-card');
        button.type = 'button';
        button.addEventListener('click', () => openTopic(topic.id));

        const frameWrap = make('span','reference-card-visual');
        const frame = document.createElement('iframe');
        frame.title = '';
        frame.tabIndex = -1;
        frame.setAttribute('aria-hidden','true');
        frame.setAttribute('sandbox','');
        frame.srcdoc = previewDocument(topic.code,true);
        frameWrap.append(frame);

        const copy = make('span','reference-card-copy');
        copy.append(make('strong','',topic.title), make('small','',topic.summary));
        button.append(frameWrap, copy);
        section.append(button);
      });
      browse.append(section);
    });
  }

  function updateMiniPreview(){
    const frame = $('referenceRunner');
    if (!frame || !miniEditor) return;
    clearTimeout(previewTimer);
    previewTimer = setTimeout(() => {
      frame.srcdoc = previewDocument(miniEditor.getValue());
    }, 180);
  }

  function openTopic(id){
    const topic = topics.find(t => t.id === id);
    if (!topic) return;
    browseScroll = $('referenceScroll').scrollTop;
    current = topic;
    browse.hidden = true;
    detail.hidden = false;
    detail.replaceChildren();

    const back = make('button','reference-back','← All topics');
    back.type = 'button';
    back.addEventListener('click',() => {
      renderBrowse();
      requestAnimationFrame(() => {$('referenceScroll').scrollTop = browseScroll;});
    });
    detail.append(back);

    detail.append(
      make('div','reference-group-label',topic.group),
      make('h2','',topic.title),
      make('p','reference-summary',topic.summary)
    );

    const demo = make('div','reference-demo');
    const demoHead = make('div','reference-demo-head');
    demoHead.append(make('strong','','Try it here'),make('span','','Edit the code and watch the preview'));
    demo.append(demoHead);

    const miniGrid = make('div','reference-mini-grid');
    const codeWrap = make('div','reference-mini-code');
    const ta = document.createElement('textarea');
    ta.id = 'referenceMiniCode';
    ta.value = topic.code;
    codeWrap.append(ta);

    const frameWrap = make('div','reference-mini-preview');
    const frame = document.createElement('iframe');
    frame.id = 'referenceRunner';
    frame.title = topic.title + ' preview';
    frame.setAttribute('sandbox','allow-scripts allow-forms allow-modals allow-popups');
    frame.srcdoc = previewDocument(topic.code);
    frameWrap.append(frame);
    miniGrid.append(codeWrap,frameWrap);
    demo.append(miniGrid);

    const actions = make('div','reference-actions');
    const insert = make('button','btn primary','Insert into code');
    insert.type = 'button';
    insert.addEventListener('click',() => {
      const code = miniEditor ? miniEditor.getValue() : topic.code;
      workbench.insert(code);
      workbench.run();
      if (window.innerWidth <= 900) closeReference();
    });
    const copy = make('button','btn','Copy');
    copy.type = 'button';
    copy.addEventListener('click',async() => {
      const code = miniEditor ? miniEditor.getValue() : topic.code;
      try{
        await navigator.clipboard.writeText(code);
        copy.textContent='Copied';
        setTimeout(()=>copy.textContent='Copy',900);
      }catch(e){}
    });
    const reset = make('button','btn','Reset example');
    reset.type = 'button';
    reset.addEventListener('click',() => {
      miniEditor.setValue(topic.code);
      updateMiniPreview();
    });
    actions.append(insert,copy,reset);
    demo.append(actions);
    detail.append(demo);

    const tip = make('div','reference-tip');
    tip.append(make('strong','','Try changing it: '));
    tip.append(document.createTextNode(makeChallenge(topic)));
    detail.append(tip);

    miniEditor = CodeMirror.fromTextArea(ta,{
      mode:'htmlmixed',
      lineNumbers:true,
      lineWrapping:false,
      autoCloseTags:true,
      autoCloseBrackets:true,
      matchBrackets:true,
      indentUnit:2,
      tabSize:2,
      extraKeys:{
        'Ctrl-Enter':updateMiniPreview,
        'Cmd-Enter':updateMiniPreview,
        'Tab':cm=>cm.replaceSelection('  ','end')
      }
    });
    miniEditor.setSize('100%','150px');
    miniEditor.on('change',updateMiniPreview);
    requestAnimationFrame(()=>miniEditor.refresh());
    $('referenceScroll').scrollTop = 0;
  }

  function makeChallenge(topic){
    const byGroup = {
      'HTML essentials':'Change the words, then add one more HTML element.',
      'Text':'Change the content and see what the tag changes on the page.',
      'Links & media':'Change the destination, text, size, or media and rerun it.',
      'Structure':'Add one more piece of content inside the structure.',
      'Forms':'Add another choice or change what the visitor can enter.',
      'CSS basics':'Change one CSS value at a time and watch what moves or changes.',
      'Layout':'Add another item, then change the spacing or number of columns.'
    };
    return byGroup[topic.group] || 'Change one value and see what happens.';
  }

  function openReference(){
    document.body.classList.remove('ref-hidden');
    document.body.classList.add('ref-open');
    try{localStorage.setItem('dsteckler-html-reference-visible','1');}catch(e){}
    refButton.setAttribute('aria-expanded','true');
    requestAnimationFrame(()=>{
      workbench.refresh();
      if (window.innerWidth <= 900) search.focus();
    });
  }

  function closeReference(){
    document.body.classList.remove('ref-open');
    if (window.innerWidth > 900) document.body.classList.add('ref-hidden');
    try{localStorage.setItem('dsteckler-html-reference-visible','0');}catch(e){}
    refButton.setAttribute('aria-expanded','false');
    requestAnimationFrame(()=>workbench.refresh());
  }

  refButton.addEventListener('click',() => {
    const visible = window.innerWidth <= 900
      ? document.body.classList.contains('ref-open')
      : !document.body.classList.contains('ref-hidden');
    visible ? closeReference() : openReference();
  });
  refClose.addEventListener('click',closeReference);
  overlay.addEventListener('click',closeReference);
  search.addEventListener('input',renderBrowse);

  window.addEventListener('resize',() => {
    if (window.innerWidth > 900) document.body.classList.remove('ref-open');
    workbench.refresh();
  });

  buildFilters();
  renderBrowse();

  let stored = null;
  try{stored = localStorage.getItem('dsteckler-html-reference-visible');}catch(e){}
  if (window.innerWidth > 900) {
    if (stored === '0') document.body.classList.add('ref-hidden');
    else document.body.classList.remove('ref-hidden');
  } else {
    document.body.classList.remove('ref-open');
  }
  refButton.setAttribute('aria-expanded', String(window.innerWidth > 900 && !document.body.classList.contains('ref-hidden')));
})();