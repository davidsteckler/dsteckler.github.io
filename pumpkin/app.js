(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const PREFIX = 'dsteckler-pumpkin-v1-';
  const memory = new Map();
  const read = (key, fallback) => {
    if (memory.has(key)) return memory.get(key);
    try { const value = localStorage.getItem(PREFIX + key); return value === null ? fallback : JSON.parse(value); }
    catch { return memory.has(key) ? memory.get(key) : fallback; }
  };
  const write = (key, value) => {
    memory.set(key, value);
    try { localStorage.setItem(PREFIX + key, JSON.stringify(value)); return true; }
    catch { return false; }
  };
  const initial = read('state', {});
  const state = {
    step: Number.isInteger(initial?.step) ? Math.max(0, Math.min(9, initial.step)) : 0,
    complete: Array.isArray(initial?.complete) ? initial.complete.filter(x => typeof x === 'string') : [],
    doc: typeof initial?.doc === 'string' ? initial.doc : 'tutorial',
    view: 'tutorial', category: 'All', query: ''
  };
  let data, editor, api, frameDoc, ready = false, suppressSave = false;
  let saveTimer, toastTimer, editingTimer, lastEditingSnapshot = 0;
  let focusLines = [], runtimeObserver, booted = false, navigationToken = 0;
  const frame = $('turtleFrame');
  const persistState = () => write('state', { step: state.step, complete: state.complete, doc: state.doc });
  const currentDesign = () => data?.designs.find(item => item.id === state.doc);
  const sourceCode = () => state.doc === 'tutorial' ? data.stages[state.step].code : currentDesign().code;
  const docTitle = () => state.doc === 'tutorial' ? 'My pumpkin' : currentDesign().title;
  const draft = id => { const value = read('draft-' + id, null); return typeof value?.code === 'string' ? value : null; };

  function toast(message) {
    clearTimeout(toastTimer);
    $('toast').textContent = message;
    $('toast').hidden = false;
    toastTimer = setTimeout(() => { $('toast').hidden = true; }, 4000);
  }

  function saveDraft() {
    if (!ready || suppressSave) return;
    const saved = write('draft-' + state.doc, { code: editor.getValue(), updated: Date.now() });
    $('saveState').textContent = saved ? 'Saved on this device' : 'Saving unavailable · download your code';
  }

  function versions(id = state.doc) {
    const value = read('history-' + id, []);
    return Array.isArray(value) ? value.filter(v => typeof v?.code === 'string' && typeof v.label === 'string' && Number.isFinite(v.time)).slice(0, 30) : [];
  }

  function checkpoint(label, id = state.doc, code = editor?.getValue()) {
    if (typeof code !== 'string') return;
    const history = versions(id);
    if (history[0]?.code === code) return;
    history.unshift({ code, label, time: Date.now() });
    write('history-' + id, history.slice(0, 30));
  }

  function clearFocus() {
    if (!editor) return;
    focusLines.forEach(line => { try { editor.removeLineClass(line, 'background', 'pumpkin-focus-line'); } catch {} });
    focusLines = [];
  }

  function focusCode() {
    clearFocus();
    const focus = state.doc === 'tutorial' ? data.stages[state.step].focus : [currentDesign().focus].filter(Boolean);
    const lines = editor.getValue().split('\n');
    lines.forEach((line, i) => {
      if (focus.some(part => line.includes(part))) focusLines.push(editor.addLineClass(i, 'background', 'pumpkin-focus-line'));
    });
    if (focusLines.length) {
      const index = lines.findIndex(line => focus.some(part => line.includes(part)));
      editor.scrollIntoView({ line: index, ch: 0 }, 80);
    }
  }

  function updateSpeed() {
    const match = editor.getValue().match(/^\s*speed\((\d+)\)/m);
    $('speedSelect').value = match && Number(match[1]) <= 10 ? match[1] : '6';
  }

  function putCode(code, highlight = true) {
    api.stop();
    clearFocus();
    suppressSave = true;
    editor.setValue(code);
    editor.scrollTo(0, 0);
    editor.clearHistory();
    suppressSave = false;
    updateSpeed();
    if (highlight) focusCode();
    saveDraft();
    editor.refresh();
  }

  async function drawPreview() {
    const token = ++navigationToken;
    $('runStatus').textContent = 'Drawing the example…';
    try {
      const result = await api.preview(editor.getValue());
      if (token !== navigationToken) return;
      $('runStatus').textContent = result.ok ? 'Ready. Edit the code, or press Run to watch it draw.' : 'Check the Python message below the drawing.';
      if (result.ok) focusCode();
    } catch {
      if (token === navigationToken) $('runStatus').textContent = 'Press Run to draw this example.';
    }
    syncControls();
  }

  function switchDocument(id, autoDraw = true) {
    if (!ready) return;
    if (id !== 'tutorial' && !data.designs.some(d => d.id === id)) return;
    clearTimeout(saveTimer);clearTimeout(editingTimer);
    if (state.doc !== id) {
      saveDraft();checkpoint('Before changing drawings');
    }
    api.stop();
    navigationToken++;
    state.doc = id;
    const saved = draft(id);
    const code = saved?.code ?? (id === 'tutorial' ? data.stages[state.step].code : currentDesign().code);
    putCode(code, false);
    persistState();renderLesson();
    $('documentName').textContent = docTitle() + '.py';
    $('runStatus').textContent = 'Code restored. Press Run to draw it.';
    if (autoDraw) drawPreview();
    else api.reset();
  }

  function escapeText(value) {
    return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  }

  function coloredCode(code) {
    // Tokenize first, then escape every token before inserting markup.
    const tokens = String(code).match(/#[^\n]*|"[^"\n]*"|'[^'\n]*'|\b(?:def|for|in|range|if|else|from|import)\b|\b\d+(?:\.\d+)?\b|[^#"'\d\w]+|\w+|./g) || [];
    return tokens.map(token => {
      const kind = token.startsWith('#') ? 'comment' : /^["']/.test(token) ? 'str' : /^\d/.test(token) ? 'num' : /^(def|for|in|range|if|else|from|import)$/.test(token) ? 'key' : '';
      const text = escapeText(token);
      return kind ? '<span class="tok-' + kind + '">' + text + '</span>' : text;
    }).join('');
  }

  function renderLesson() {
    const tutorial = state.doc === 'tutorial';
    const item = tutorial ? data.stages[state.step] : currentDesign();
    $('lessonMode').textContent = tutorial ? 'THE TUTORIAL' : item.category.toUpperCase() + ' · VARIATION';
    $('backTutorial').hidden = tutorial;
    $('stepSelect').hidden = !tutorial;
    document.querySelector('.step-label').hidden = !tutorial;
    document.querySelector('.progress-track').hidden = !tutorial;
    $('stepNumber').textContent = tutorial ? 'STEP ' + String(state.step + 1).padStart(2, '0') + ' / 10' : 'MAKE IT YOUR OWN';
    $('lessonTitle').textContent = item.title;
    $('lessonSkill').textContent = tutorial ? item.skill : item.level + ' · Editable example';
    $('targetImage').src = '/pumpkin/' + item.preview;
    $('targetImage').alt = (tutorial ? 'Step target: ' : 'Example: ') + item.title;
    $('targetLink').href = '/pumpkin/' + item.preview;
    $('expected').textContent = tutorial ? item.expected : item.description;
    $('instruction').textContent = tutorial ? item.instruction : 'The full example is in your editor. Press Run, then change a detail to make your own version.';
    $('explanation').textContent = tutorial ? item.why : item.description + ' Each function groups the instructions for one shape. The calls below the functions put the drawing together.';
    $('snippet').innerHTML = coloredCode(tutorial ? item.snippet : item.code);
    $('snippetLabel').textContent = tutorial ? 'Code for this step' : 'Full example code';
    document.querySelector('.code-details').open = tutorial;
    $('loadStep').textContent = tutorial ? 'Load & run this step' : 'Restore & run this example';
    $('loadNote').textContent = tutorial ? 'Browsing steps keeps your code. Loading a step saves your previous version.' : 'Your edits save for this pumpkin. The original is always here to restore.';
    $('experiment').textContent = item.experiment;
    $('predictBox').hidden = !tutorial;
    $('predictBox').open = false;
    $('prediction').textContent = tutorial ? 'Predict: ' + item.predict : '';
    $('answer').textContent = tutorial ? item.answer : '';
    $('doneLabel').hidden = !tutorial;
    $('stepNavigation').hidden = !tutorial;
    $('completionNote').hidden = !tutorial;
    $('stepSelect').value = String(state.step);
    $('stepProgress').style.width = ((state.step + 1) * 10) + '%';
    $('previousStep').disabled = state.step === 0;
    $('nextStep').textContent = state.step === 9 ? 'Explore variations →' : 'Next step →';
    $('stepDone').checked = state.complete.includes(data.stages[state.step].id);
    $('completionNote').textContent = state.complete.length + ' of 10 steps tried';
    $('documentName').textContent = docTitle() + '.py';
  }

  function setStep(index, navigate = true) {
    state.step = Math.max(0, Math.min(data.stages.length - 1, index));
    if (ready && state.doc !== 'tutorial') switchDocument('tutorial', false);
    else { state.doc = 'tutorial';renderLesson(); }
    persistState();setView('tutorial', false);
    if (navigate) setHash('step=' + data.stages[state.step].id);
  }

  function jumpToWorkshop() {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    $('workshop').scrollIntoView({ behavior: reduce ? 'instant' : 'smooth', block: 'start' });
  }

  function setHash(hash) {
    if (location.hash !== '#' + hash) history.pushState(null, '', '#' + hash);
  }

  function setView(view, scroll = false, navigate = true) {
    state.view = view;
    const gallery = view === 'gallery';
    $('studio').hidden = gallery;$('gallery').hidden = !gallery;
    for (const [button, selected] of [[$('tutorialTab'), !gallery], [$('galleryTab'), gallery]]) {
      button.classList.toggle('active', selected);button.setAttribute('aria-selected', String(selected));
      button.tabIndex = selected ? 0 : -1;
    }
    if (gallery) renderGallery();
    else if (ready) requestAnimationFrame(() => editor.refresh());
    if (navigate) setHash(gallery ? 'gallery' : state.doc === 'tutorial' ? 'step=' + data.stages[state.step].id : 'design=' + state.doc);
    if (scroll) jumpToWorkshop();
  }

  function openDesign(id, scroll = true, navigate = true) {
    if (!data.designs.some(item => item.id === id)) return;
    if (!ready) { toast('The Turtle editor is still opening. Try again in a moment.');return; }
    switchDocument(id);
    setView('tutorial', false, false);
    if (navigate) setHash('design=' + id);
    if (scroll) jumpToWorkshop();
  }

  function renderGallery() {
    const query = state.query.trim().toLowerCase();
    const items = data.designs.filter(item => (state.category === 'All' || item.category === state.category) && (!query || (item.title + ' ' + item.category + ' ' + item.description).toLowerCase().includes(query)));
    $('galleryGrid').replaceChildren(...items.map(item => {
      const article = document.createElement('article');article.className = 'pumpkin-card';
      article.innerHTML = '<button class="card-picture" type="button" aria-label="Open ' + escapeText(item.title) + '"><img src="/pumpkin/' + escapeText(item.preview) + '" alt="' + escapeText(item.description) + '" loading="lazy" width="400" height="400"><span class="open-overlay">Open in the editor ↗</span></button><div class="card-copy"><span class="eyebrow">' + escapeText(item.category) + ' · ' + escapeText(item.level) + '</span><h3>' + escapeText(item.title) + '</h3><p>' + escapeText(item.description) + '</p></div><button class="card-open" type="button">Open code <span aria-hidden="true">↗</span></button>';
      article.querySelectorAll('button').forEach(button => button.addEventListener('click', () => openDesign(item.id)));
      return article;
    }));
    $('resultCount').textContent = items.length + (items.length === 1 ? ' pumpkin' : ' pumpkins');
    $('noResults').hidden = items.length > 0;
    $('galleryFilters').querySelectorAll('button').forEach(button => {
      const active = button.dataset.category === state.category;
      button.classList.toggle('active', active);button.setAttribute('aria-pressed', String(active));
    });
  }

  function initGallery() {
    for (const category of ['All', 'Faces', 'Colors', 'Patterns', 'Costumes', 'Scenes']) {
      const button = document.createElement('button');button.type = 'button';button.className = 'filter-button';
      button.dataset.category = category;
      const count = category === 'All' ? data.designs.length : data.designs.filter(item => item.category === category).length;
      button.innerHTML = escapeText(category) + ' <span>' + count + '</span>';
      button.addEventListener('click', () => { state.category = category;renderGallery(); });
      $('galleryFilters').append(button);
    }
    $('gallerySearch').addEventListener('input', event => { state.query = event.target.value;renderGallery(); });
    document.querySelectorAll('[data-design]').forEach(button => button.addEventListener('click', () => openDesign(button.dataset.design)));
  }

  function loadExample(label) {
    if (!ready) return;
    clearTimeout(editingTimer);checkpoint(label);
    putCode(sourceCode());drawPreview();
    toast(state.doc === 'tutorial' ? 'Step loaded. Your previous code is in Saved versions.' : 'Original example restored. Your previous code is in Saved versions.');
  }

  function showHistory() {
    const history = versions();
    $('historyList').replaceChildren();
    if (!history.length) {
      const p = document.createElement('p');p.textContent = 'Your saved versions will appear here as you edit and load examples.';$('historyList').append(p);
    }
    history.forEach(version => {
      const row = document.createElement('div');row.className = 'version';
      const copy = document.createElement('div');
      const title = document.createElement('strong');title.textContent = version.label;
      const detail = document.createElement('p');detail.textContent = new Date(version.time).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) + ' · ' + version.code.split('\n').length + ' lines';
      copy.append(title, detail);
      const restore = document.createElement('button');restore.type = 'button';restore.className = 'button';restore.textContent = 'Restore';
      restore.addEventListener('click', () => { checkpoint('Before restoring a saved version');putCode(version.code, false);api.reset();$('historyDialog').close();toast('Version restored. Press Run to draw it.'); });
      row.append(copy, restore);$('historyList').append(row);
    });
    $('historyDialog').showModal();
  }

  function syncControls() {
    if (!ready) return;
    const running = frameDoc.getElementById('runBtn').disabled;
    const pause = frameDoc.getElementById('pauseBtn');
    $('runCode').disabled = running;
    $('pauseCode').disabled = pause.disabled;
    $('pauseCode').textContent = pause.textContent.includes('Resume') ? 'Resume' : 'Pause';
    $('stopCode').disabled = frameDoc.getElementById('stopBtn').disabled;
    $('stepCode').disabled = frameDoc.getElementById('stepBtn').disabled;
    const mark = frameDoc.getElementById('codeStatus');
    if (running) $('runStatus').textContent = api.isPaused() ? 'Paused. Press Step for the next statement.' : 'Running your Python code…';
    else if (mark.classList.contains('bad')) $('runStatus').textContent = 'Check the Python message below the drawing.';
    else if (mark.classList.contains('good')) $('runStatus').textContent = 'Program finished. Edit the code and run again.';
  }

  function wireEditor() {
    if (booted || !data) return;
    try {
      editor = frame.contentWindow.TurtleWorkbench?.editor;
      api = frame.contentWindow.TraceTurtleEmbed;
      frameDoc = frame.contentDocument;
      if (!editor || !api || !frame.contentWindow.Sk) return;
    } catch { return; }
    booted = true;ready = true;
    // Keep the editable reference runtime, but give this workspace its own
    // layout. reference-embed hides panel headers and world-info, which would
    // move the editor and canvas into the fixed-height header grid tracks.
    frameDoc.body.classList.remove('reference-embed');
    frameDoc.body.classList.add('pumpkin-embed');
    // The shared editor places fills behind existing ink. Pumpkin parts are
    // opaque layers: an eye, patch, or hat must fill over the body beneath it.
    // Adapt this embedded canvas only; the main Turtle workspace is separate.
    const drawingContext = frameDoc.getElementById('turtle-drawing').getContext('2d');
    const fill = drawingContext.fill;
    drawingContext.fill = function (...args) {
      if (this.globalCompositeOperation === 'destination-over') this.globalCompositeOperation = 'source-over';
      return fill.apply(this, args);
    };
    const style = frameDoc.createElement('style');
    style.textContent = `
      html,body{height:100%!important;min-height:0!important;overflow:hidden!important}
      body.trace-embed .app{height:100%!important;min-height:0!important;display:grid!important;grid-template-rows:minmax(0,1fr)!important}
      body.trace-embed .workspace{display:grid!important;height:100%!important;min-height:0!important;grid-template-columns:minmax(0,1.1fr) 8px minmax(0,1fr)!important;grid-template-rows:minmax(0,1fr)!important;padding:0!important;gap:0!important;overflow:hidden!important}
      body.trace-embed .code-panel,body.trace-embed .world-panel{height:100%!important;min-width:0!important;min-height:0!important;border:0!important;border-radius:0!important;box-shadow:none!important}
      body.trace-embed .code-panel{grid-column:1!important;grid-row:1!important;grid-template-rows:39px minmax(0,1fr)!important}
      body.trace-embed .editor-divider{grid-column:2!important;grid-row:1!important}
      body.trace-embed .world-panel{grid-column:3!important;grid-row:1!important;grid-template-rows:39px minmax(190px,1fr) auto 9px 75px!important;background:#fafbf5}
      body.pumpkin-embed .code-panel>.panel-head,body.pumpkin-embed .world-panel>.panel-head{display:flex!important}
      body.pumpkin-embed .world-info{display:grid!important}
      body.pumpkin-embed .code-panel>.CodeMirror{grid-row:2!important;min-height:0!important}
      body.pumpkin-embed .world-stage{grid-row:2!important}
      body.pumpkin-embed .world-info{grid-row:3!important}
      body.pumpkin-embed .output-resize-handle{grid-row:4!important}
      body.pumpkin-embed .world-panel>.console{grid-row:5!important;min-height:0!important}
      .panel-head{min-height:39px!important;height:39px!important;padding:7px 10px!important}
      .panel-label{font-size:10px!important}.panel-mini,#saveStatus,#codeHistoryBtn{display:none!important}
      body.trace-embed .code-panel .CodeMirror{font-size:14px!important;height:100%!important}
      .world-stage{padding:8px!important}.world-info{font-size:10px!important;padding:8px!important}
      .world-info .world-copy{font-size:9px!important}.world-controls{font-size:9px!important}
      .editor-divider{background:#e6ebdc!important}.editor-divider:before{background:#b2c1a3!important}
      .pumpkin-focus-line{background:#36544055!important}.console-head{font-size:9px!important}
      @media(max-width:640px){
        body.trace-embed .workspace{grid-template-columns:minmax(0,1fr)!important;grid-template-rows:340px minmax(400px,1fr)!important;overflow:auto!important}
        body.trace-embed .code-panel{grid-column:1!important;grid-row:1!important;height:340px!important}
        body.trace-embed .world-panel{grid-column:1!important;grid-row:2!important;height:100%!important;grid-template-rows:39px minmax(220px,1fr) auto 9px 65px!important}
        body.trace-embed .editor-divider{display:none!important}.world-stage{height:auto!important}
      }`;
    frameDoc.head.append(style);
    const grid = frameDoc.getElementById('gridToggle');
    if (grid) { grid.checked = false;grid.dispatchEvent(new frame.contentWindow.Event('change')); }
    editor.on('change', () => {
      if (suppressSave) return;
      clearFocus();$('saveState').textContent = 'Saving…';
      clearTimeout(saveTimer);saveTimer = setTimeout(saveDraft, 150);
      clearTimeout(editingTimer);
      editingTimer = setTimeout(() => {
        if (Date.now() - lastEditingSnapshot > 15000) { checkpoint('Editing checkpoint');lastEditingSnapshot = Date.now(); }
      }, 1800);
      updateSpeed();
    });
    runtimeObserver = new MutationObserver(syncControls);
    ['runBtn', 'pauseBtn', 'stepBtn', 'stopBtn', 'codeStatus'].forEach(id => runtimeObserver.observe(frameDoc.getElementById(id), { attributes: true, childList: true, subtree: true }));
    $('editorLoading').hidden = true;
    ['loadStep','resetCode','historyButton','downloadCode','clearDrawing','stepCode'].forEach(id => { $(id).disabled = false; });
    if (state.doc !== 'tutorial' && !currentDesign()) state.doc = 'tutorial';
    const chosen = state.doc;
    const saved = draft(chosen);
    suppressSave = true;
    editor.setValue(saved?.code ?? sourceCode());
    editor.clearHistory();
    suppressSave = false;
    editor.scrollTo(0, 0);updateSpeed();saveDraft();
    checkpoint('Opened this drawing');
    renderLesson();syncControls();
    if (!saved) drawPreview();
    else { api.reset();$('runStatus').textContent = 'Your saved code is here. Press Run to draw it.'; }
    requestAnimationFrame(() => { editor.refresh();frame.contentWindow.TurtleWorkbench.setDisplay({ code: 14, output: 12, drawing: 100 }); });
  }

  function applyRoute() {
    let hash;
    try { hash = decodeURIComponent(location.hash.slice(1)); }
    catch { hash = ''; }
    if (hash === 'gallery') { setView('gallery', false, false);return; }
    if (hash.startsWith('design=')) {
      const id = hash.slice(7);
      if (data.designs.some(item => item.id === id)) {
        if (ready) openDesign(id, false, false);
        else state.doc = id;
        setView('tutorial', false, false);
        return;
      }
    }
    if (hash.startsWith('step=')) {
      const index = data.stages.findIndex(item => item.id === hash.slice(5));
      if (index !== -1) { setStep(index, false);return; }
    }
    setView('tutorial', false, false);
  }

  function events() {
    $('tutorialTab').addEventListener('click', () => setView('tutorial'));
    $('galleryTab').addEventListener('click', () => setView('gallery'));
    document.querySelector('.view-tabs').addEventListener('keydown', event => {
      if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
      event.preventDefault();
      const gallery = event.key === 'End' || (event.key !== 'Home' && state.view !== 'gallery');
      setView(gallery ? 'gallery' : 'tutorial');$(gallery ? 'galleryTab' : 'tutorialTab').focus();
    });
    $('startTutorial').addEventListener('click', event => { event.preventDefault();setStep(0);jumpToWorkshop(); });
    $('exploreGallery').addEventListener('click', event => { event.preventDefault();setView('gallery', true); });
    $('stepSelect').addEventListener('change', event => setStep(Number(event.target.value)));
    $('previousStep').addEventListener('click', () => setStep(state.step - 1));
    $('nextStep').addEventListener('click', () => state.step === 9 ? setView('gallery', true) : setStep(state.step + 1));
    $('backTutorial').addEventListener('click', () => { switchDocument('tutorial', false);setStep(state.step); });
    $('stepDone').addEventListener('change', event => {
      const id = data.stages[state.step].id;
      state.complete = state.complete.filter(value => value !== id);
      if (event.target.checked) state.complete.push(id);
      persistState();renderLesson();
    });
    $('loadStep').addEventListener('click', () => loadExample('Before loading ' + (state.doc === 'tutorial' ? 'step ' + (state.step + 1) : 'the original example')));
    $('resetCode').addEventListener('click', () => loadExample('Before resetting the example'));
    $('runCode').addEventListener('click', () => { saveDraft();api.run();syncControls(); });
    $('pauseCode').addEventListener('click', () => { frameDoc.getElementById('pauseBtn').click();syncControls(); });
    $('stepCode').addEventListener('click', () => { api.step();syncControls(); });
    $('stopCode').addEventListener('click', () => { navigationToken++;api.stop();$('runStatus').textContent = 'Stopped. Your code is still here.';syncControls(); });
    $('clearDrawing').addEventListener('click', () => { navigationToken++;api.reset();$('runStatus').textContent = 'Drawing cleared. Your code is still here.';syncControls(); });
    $('speedSelect').addEventListener('change', event => {
      if (!ready) return;
      api.stop();const code = editor.getValue();const selected = event.target.value;
      checkpoint('Before changing speed');
      const updated = /^\s*speed\(\d+\)/m.test(code) ? code.replace(/^(\s*)speed\(\d+\)/m, '$1speed(' + selected + ')') : 'speed(' + selected + ')\n' + code;
      editor.setValue(updated);saveDraft();
      $('runStatus').textContent = 'Speed updated. Press Run to try it.';
    });
    $('historyButton').addEventListener('click', showHistory);
    $('downloadCode').addEventListener('click', () => {
      saveDraft();const url = URL.createObjectURL(new Blob([editor.getValue()], { type: 'text/x-python;charset=utf-8' }));
      const a = document.createElement('a');a.href = url;a.download = docTitle().toLowerCase().replace(/[^a-z0-9]+/g, '-') + '.py';
      document.body.append(a);a.click();a.remove();setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
    $('guideButton').addEventListener('click', () => $('guideDialog').showModal());
    document.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => $(button.dataset.close).close()));
    document.querySelectorAll('dialog').forEach(dialog => dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect();if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } }));
    window.addEventListener('popstate', applyRoute);
    window.addEventListener('hashchange', applyRoute);
    document.addEventListener('visibilitychange', () => { if (document.hidden) saveDraft(); });
    window.addEventListener('pagehide', saveDraft);
  }

  frame.addEventListener('load', wireEditor);
  fetch('/pumpkin/data.json?v=1').then(response => {
    if (!response.ok) throw new Error('Could not load tutorial data.');
    return response.json();
  }).then(result => {
    if (!Array.isArray(result.stages) || !Array.isArray(result.designs) || result.stages.length !== 10 || result.designs.length !== 48) throw new Error('Incomplete tutorial data.');
    data = result;
    if (state.doc !== 'tutorial' && !currentDesign()) state.doc = 'tutorial';
    for (const [index, stage] of data.stages.entries()) {
      const option = document.createElement('option');option.value = String(index);option.textContent = (index + 1) + '. ' + stage.title;$('stepSelect').append(option);
    }
    initGallery();events();applyRoute();renderLesson();wireEditor();
    setTimeout(() => {
      if (ready) return;
      $('editorLoading').innerHTML = '<strong>The Turtle editor is taking a little longer.</strong><p>Check your connection, then refresh this page. Your saved pumpkin code will still be here.</p><a href="/turtle/" target="_blank" rel="noopener">Open the full Turtle editor ↗</a>';
      $('saveState').textContent = 'Editor has not finished loading';
    }, 16000);
  }).catch(error => {
    $('instruction').textContent = 'The tutorial could not load. Refresh the page to try again.';
    $('saveState').textContent = error.message;
    $('editorLoading').innerHTML = '<strong>The tutorial could not load.</strong><p>Refresh the page to try again.</p><a href="/turtle/">Open the full Turtle editor ↗</a>';
  });
})();
