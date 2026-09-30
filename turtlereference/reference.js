(() => {
  'use strict';
  const entries = window.TURTLE_REFERENCE;
  const byId = new Map(entries.map(entry => [entry.id, entry]));
  const groups = [...new Set(entries.map(entry => entry.group))];
  const readingOrder = groups.flatMap(group => entries.filter(entry => entry.group === group));
  const referenceOrder = readingOrder.filter(entry => !entry.trail);
  const trails = new Map(window.TURTLE_TRAILS.map(trail => [trail.id, trail]));
  const $ = id => document.getElementById(id);
  const frame = $('referenceEditor');
  const storageKey = 'dsteckler-turtle-reference-drafts-v1';
  let drafts = {}, current, currentExample, ready = false, pending = false, requestId = 0, appliedId = null;
  const exampleTotal = entries.reduce((count, entry) => count + entry.examples.length, 0);
  const previewAtlas = window.REFERENCE_PREVIEWS;
  let focusMarks = [];
  function exampleKey(entry = current, example = currentExample) { return example.id === 'original' ? entry.id : entry.id + '/' + example.id; }
  try { drafts = JSON.parse(localStorage.getItem(storageKey) || '{}') || {}; } catch {}
  function persist() { try { localStorage.setItem(storageKey, JSON.stringify(drafts)); } catch { $('referenceStatus').textContent = 'Edits stay in this open page.'; } }
  function captureDraft() {
    if (!current || !ready || pending) return;
    const cm = frame.contentDocument?.querySelector('.CodeMirror')?.CodeMirror;
    if (cm) { drafts[exampleKey()] = cm.getValue(); persist(); }
  }
  function send(task) { frame.contentWindow.postMessage({...task, project:'turtle-reference'}, location.origin); }
  function setOutputView() {
    const doc = frame.contentDocument;
    if (!doc?.body || !current) return;
    if (!doc.getElementById('reference-output-style')) {
      const style = doc.createElement('style'); style.id = 'reference-output-style';
      style.textContent = `body.tutorial-embed.reference-ascii .world-panel{grid-template-rows:minmax(0,1fr)!important;background:#182423}
        body.reference-ascii .world-panel > :not(.console){display:none!important}
        body.reference-ascii .world-panel .console{border:0;background:#182423;grid-template-rows:43px minmax(0,1fr)}
        body.reference-ascii #output{white-space:pre;overflow-wrap:normal;font:500 14px/1.65 ui-monospace,SFMono-Regular,Consolas,monospace;padding:20px;color:#dbe6bd;tab-size:4}
        body.reference-ascii .console-head{border-bottom:1px solid #35473d;color:#bbcdb4}
        @media(max-width:560px){body.reference-ascii #output{font-size:13px;padding:14px}}
      `;
      doc.head.append(style);
    }
    doc.body.classList.toggle('reference-ascii', currentExample.output === 'ascii');
    $('editorViewLabel').textContent = currentExample.output === 'ascii' ? 'Code & ASCII art' : 'Code & drawing';
    frame.title = currentExample.output === 'ascii' ? 'Python editor and live ASCII art' : 'Python editor and live Turtle drawing';
    if (!doc.getElementById('reference-focus-style')) {
      const style = doc.createElement('style'); style.id = 'reference-focus-style';
      style.textContent = '.CodeMirror .reference-code-focus{background:#6c571b;color:#fff2bd!important;border-bottom:2px solid #e2c469;border-radius:2px}';
      doc.head.append(style);
    }
  }
  function clearFocusMarks() { focusMarks.forEach(mark => mark.clear()); focusMarks = []; }
  function highlightExample() {
    clearFocusMarks();
    const cm = frame.contentDocument?.querySelector('.CodeMirror')?.CodeMirror;
    if (!cm || cm.getValue() !== currentExample.code) return;
    if (!cm.referenceChangeBound) { cm.on('change', clearFocusMarks); cm.referenceChangeBound = true; }
    for (const text of currentExample.focus || []) {
      let at = 0;
      while ((at = currentExample.code.indexOf(text, at)) !== -1) {
        focusMarks.push(cm.markText(cm.posFromIndex(at), cm.posFromIndex(at + text.length), {className:'reference-code-focus'}));
        at += text.length;
      }
    }
  }
  function writeSyntax() {
    const source = currentExample.syntax, ranges = [];
    for (const text of currentExample.focus || []) {
      let at = 0;
      while ((at = source.indexOf(text, at)) !== -1) { ranges.push([at, at + text.length]); at += text.length; }
    }
    ranges.sort((a,b) => a[0] - b[0]);
    $('topicSyntax').replaceChildren(); let at = 0;
    for (const [start, end] of ranges) {
      if (start < at) continue;
      $('topicSyntax').append(document.createTextNode(source.slice(at, start)));
      const mark = document.createElement('mark'); mark.textContent = source.slice(start, end); $('topicSyntax').append(mark); at = end;
    }
    $('topicSyntax').append(document.createTextNode(source.slice(at)));
  }
  function revealSelectedExample() {
    const list = $('exampleChoices'), button = list.querySelector('[aria-pressed="true"]');
    if (!button) return;
    const bounds = list.getBoundingClientRect(), card = button.getBoundingClientRect();
    if (card.left < bounds.left + 2) list.scrollLeft += card.left - bounds.left - 2;
    else if (card.right > bounds.right - 2) list.scrollLeft += card.right - bounds.right + 2;
  }
  function chooseExample(id, focus = false) {
    selectEntry(current.id + (id === 'original' ? '' : '/' + id), true);
    if (focus) $('exampleChoices').querySelector('[aria-pressed="true"]')?.focus({preventScroll:true});
  }
  function renderExampleChoices() {
    const examples = current.examples, position = examples.indexOf(currentExample);
    const listScroll = $('exampleChoices').scrollLeft;
    $('exampleChoices').replaceChildren();
    $('exampleCount').textContent = (position + 1) + ' / ' + examples.length;
    $('activeExampleLabel').textContent = 'Example ' + (position + 1) + ' · ' + currentExample.label;
    $('previousExample').disabled = position === 0; $('nextExample').disabled = position === examples.length - 1;
    $('previousExample').title = examples[position - 1]?.label || 'First example';
    $('nextExample').title = examples[position + 1]?.label || 'Last example';
    for (const [index, example] of examples.entries()) {
      const button = document.createElement('button'); button.type = 'button'; button.className = 'example-card'; button.dataset.example = example.id;
      button.setAttribute('aria-pressed', String(example === currentExample));
      button.setAttribute('aria-label', 'Example ' + (index + 1) + ': ' + example.label);
      button.title = example.label + (example.previewNote ? ' · Preview ' + example.previewNote.toLowerCase() : '');
      const art = document.createElement('span'); art.className = 'example-art'; art.setAttribute('aria-hidden','true');
      const preview = previewAtlas.examples[current.id + '/' + example.id];
      if (typeof preview?.tile === 'number') {
        art.classList.add('drawing-preview');
        art.style.backgroundSize = (previewAtlas.columns * 54) + 'px ' + (previewAtlas.rows * 54) + 'px';
        art.style.backgroundPosition = -(preview.tile % previewAtlas.columns * 54) + 'px ' + (-Math.floor(preview.tile / previewAtlas.columns) * 54) + 'px';
      } else {
        art.classList.add('text-preview'); art.textContent = preview?.text || 'Run';
      }
      const label = document.createElement('span'); label.className = 'example-card-label'; label.textContent = example.label;
      button.append(art, label);
      button.addEventListener('click', () => chooseExample(example.id, true));
      button.addEventListener('keydown', event => {
        let next;
        if (event.key === 'ArrowRight') next = examples[index + 1];
        else if (event.key === 'ArrowLeft') next = examples[index - 1];
        else if (event.key === 'Home') next = examples[0];
        else if (event.key === 'End') next = examples.at(-1);
        else return;
        event.preventDefault(); if (next) chooseExample(next.id, true);
      });
      $('exampleChoices').append(button);
    }
    $('exampleChoices').scrollLeft = listScroll;
    revealSelectedExample();
  }
  function navigationOrder() { return current?.trail ? trails.get(current.trail).stops : referenceOrder; }
  function renderTrail() {
    const path = trails.get(current.trail);
    $('trailContext').hidden = !path; $('markComplete').hidden = !path;
    if (!path) return;
    const position = path.stops.findIndex(stop => stop.id === current.id);
    $('trailLevel').textContent = path.level + ' · ' + path.medium + ' · Stop ' + (position + 1) + ' of ' + path.stops.length;
    $('trailStops').replaceChildren();
    for (const [index, stop] of path.stops.entries()) {
      const link = document.createElement('a'), done = window.TurtleTrailProgress.has(stop.id);
      link.href = '#' + stop.id; link.textContent = done ? '✓' : index + 1;
      link.title = stop.title; link.setAttribute('aria-label', 'Stop ' + (index + 1) + ': ' + stop.title + (done ? ', marked done' : ''));
      if (stop.id === current.id) link.setAttribute('aria-current', 'step');
      if (done) link.classList.add('done');
      link.addEventListener('click', event => { event.preventDefault(); selectEntry(stop.id, true); });
      $('trailStops').append(link);
    }
    const done = window.TurtleTrailProgress.has(current.id);
    $('markComplete').textContent = done ? '✓ Marked done · undo' : 'Mark this stop done';
    $('markComplete').setAttribute('aria-pressed', String(done));
  }
  function applyExample(run) {
    if (!ready || !current) return;
    setOutputView();
    pending = true; appliedId = null;
    document.body.dataset.exampleId = '';
    $('runExample').disabled = true; $('resetExample').disabled = true;
    const code = typeof drafts[exampleKey()] === 'string' ? drafts[exampleKey()] : currentExample.code;
    send({kind:'turtle-tutorial-set-code', code, run, requestId:++requestId});
  }
  const diagrams = {
    heading: '<svg viewBox="0 0 290 168" role="img" aria-label="A turtle facing right at the center of a direction compass: 0 degrees right, 90 degrees up, 180 degrees left, 270 degrees down"><path d="M145 30V138M55 84H235" fill="none" stroke="#acbfb3" stroke-width="1.5"/><path d="M145 34l-4 8h8zM231 84l-8-4v8zM59 84l8 4v-8zM145 134l-4-8h8z" fill="#809c8e"/><circle cx="145" cy="84" r="25" fill="#e0eee4"/><g class="diagram-turtle" fill="#176b73" stroke="#176b73" stroke-width="3" stroke-linecap="round"><path d="M137 79l-5-6M151 79l5-6M137 89l-5 6M151 89l5 6M133 84h-5"/><ellipse cx="144" cy="84" rx="12" ry="9"/><circle cx="160" cy="84" r="5"/></g><path d="M139 79h9l4 5-4 5h-9l-4-5z" fill="none" stroke="#a5d4bd" stroke-width="1.5"/><circle cx="162" cy="82" r="1" fill="#fff"/><text x="145" y="21" text-anchor="middle">90° · up</text><text x="239" y="88">0°</text><text x="16" y="88">180°</text><text x="145" y="118" text-anchor="middle" class="diagram-note">turtle faces right</text><text x="145" y="155" text-anchor="middle">270° · down</text></svg>',
    coordinates: '<svg viewBox="0 0 290 185" role="img" aria-label="Coordinate plane with the origin at the center and point 100 comma 50 above and to the right"><defs><pattern id="refGrid" width="17" height="17" patternUnits="userSpaceOnUse"><path d="M17 0H0V17" fill="none" stroke="#dfe7dd" stroke-width=".7"/></pattern></defs><rect x="60" y="8" width="170" height="170" fill="url(#refGrid)"/><path d="M60 93H230M145 8V178" stroke="#91aa9c"/><path d="M145 93H187.5V71.75" stroke="#cf8063" stroke-dasharray="4 3" fill="none"/><circle cx="145" cy="93" r="4" fill="#176b73"/><circle cx="187.5" cy="71.75" r="5" fill="coral"/><text x="153" y="109">(0, 0)</text><text x="170" y="56">(100, 50)</text><text x="18" y="97">−200</text><text x="234" y="97">200 x</text><text x="149" y="19" class="diagram-note">200 y</text><text x="149" y="176" class="diagram-note">−200</text></svg>',
    radius: '<svg viewBox="0 0 290 164" role="img" aria-label="Circle showing a radius of 40 from center to edge and a diameter of 80 across the full circle, with the starting point marked on the bottom edge"><circle cx="145" cy="74" r="49" fill="#e6f0e6" stroke="#176b73" stroke-width="3"/><path d="M145 74H194" stroke="#c67b4f" stroke-width="3"/><circle cx="145" cy="74" r="3" fill="#c67b4f"/><text x="160" y="65" text-anchor="middle" class="diagram-note">radius 40</text><path d="M96 137H194M96 131V143M194 131V143" stroke="#748f81"/><text x="145" y="156" text-anchor="middle">diameter 80</text><circle cx="145" cy="123" r="4" fill="#176b73"/><path d="M151 123h47" stroke="#809c8e"/><text x="204" y="126" class="diagram-note">start</text></svg>',
    polygon: '<svg viewBox="0 0 290 166" role="img" aria-label="A triangle with the 120 degree outside turn marked at its bottom-right corner"><path d="M70 130H190L130 26Z" fill="#e6f0e6" stroke="#176b73" stroke-width="3"/><path d="M190 130h70" stroke="#acbfb3" stroke-dasharray="4 3"/><path d="M218 130A28 28 0 0 0 176 106" fill="none" stroke="#c67b4f" stroke-width="3"/><circle cx="190" cy="130" r="4" fill="#176b73"/><text x="195" y="85" class="diagram-note">120° turn</text><text x="130" y="155" text-anchor="middle">360 ÷ 3 = 120</text></svg>',
    arc: '<svg viewBox="0 0 290 176" role="img" aria-label="A half circle with a starting point at the bottom, ending at the top after a 180 degree arc"><circle cx="100" cy="87" r="60" fill="none" stroke="#d3dfd5" stroke-width="2"/><path d="M100 147A60 60 0 0 0 100 27" fill="none" stroke="#176b73" stroke-width="4"/><circle cx="100" cy="147" r="5" fill="#176b73"/><circle cx="100" cy="27" r="5" fill="#c67b4f"/><text x="87" y="165">start</text><text x="87" y="15">end</text><text x="177" y="83">180°</text><text x="177" y="101" class="diagram-note">half a circle</text></svg>',
    grid: '<svg viewBox="0 0 290 170" role="img" aria-label="A grid of three rows and four columns with evenly spaced dots"><path d="M58 25V140H225" fill="none" stroke="#acbfb3"/><g fill="#176b73">'+[0,1,2].flatMap(row=>[0,1,2,3].map(column=>'<circle cx="'+(80+column*40)+'" cy="'+(120-row*40)+'" r="8"/>')).join('')+'</g><text x="145" y="160" text-anchor="middle">columns →</text><text x="27" y="85" text-anchor="middle" transform="rotate(-90 27 85)">rows →</text></svg>'
  };
  function renderList() {
    const query = $('referenceSearch').value.trim().toLowerCase();
    const matches = entries.filter(entry => [entry.title, entry.id, entry.group, entry.syntax, entry.summary, ...entry.params.flat(), ...(entry.aliases || []), ...entry.examples.flatMap(example => [example.label, example.syntax, example.summary])].join(' ').toLowerCase().includes(query));
    $('commandList').replaceChildren();
    for (const group of groups) {
      const items = matches.filter(entry => entry.group === group);
      if (!items.length) continue;
      const section = document.createElement('section'); section.className = 'command-group';
      const heading = document.createElement('h2'); heading.textContent = group; section.append(heading);
      for (const entry of items) {
        const match = query && entry.examples.find(example => [example.label, example.syntax, example.summary].join(' ').toLowerCase().includes(query));
        const target = entry.id + (match && match.id !== 'original' ? '/' + match.id : '');
        const link = document.createElement('a'); link.className = 'command-link'; link.href = '#' + target;
        link.dataset.id = entry.id; link.textContent = entry.title;
        if (current?.id === entry.id) link.setAttribute('aria-current','page');
        link.title = entry.examples.length + ' runnable examples';
        link.addEventListener('click', event => { event.preventDefault(); selectEntry(target, true); closeNav(); });
        section.append(link);
      }
      $('commandList').append(section);
    }
    $('emptySearch').hidden = matches.length > 0;
    $('searchCount').textContent = query ? `${matches.length} matching topics` : `${entries.length} topics · ${exampleTotal} examples`;
  }
  function selectEntry(id, updateHistory = false) {
    const [topicId, exampleId = 'original'] = id.split('/');
    const entry = byId.get(topicId) || entries[0];
    captureDraft(); clearFocusMarks(); current = entry;
    currentExample = entry.examples.find(example => example.id === exampleId) || entry.examples[0];
    if (updateHistory) history.pushState(null, '', '#' + exampleKey());
    document.title = entry.title + (currentExample.id === 'original' ? '' : ' · ' + currentExample.label) + ' · Python Turtle Reference | David Steckler';
    $('topicGroup').textContent = entry.group;
    $('topicTitle').textContent = entry.title;
    $('topicSummary').textContent = currentExample.summary;
    renderTrail();
    renderExampleChoices(); writeSyntax();
    $('topicAliases').hidden = !entry.aliases?.length;
    $('topicAliases').textContent = entry.aliases?.length ? 'Also find this with: ' + entry.aliases.join(', ') : '';
    $('parameterSection').hidden = !entry.params.length;
    $('topicParams').replaceChildren();
    for (const [name, explanation] of entry.params) {
      const dt = document.createElement('dt'), dd = document.createElement('dd');
      dt.textContent = name; dd.textContent = explanation;
      if (currentExample.focusParam && name.startsWith(currentExample.focusParam)) { dt.className = 'active-parameter'; dd.className = 'active-parameter-description'; }
      $('topicParams').append(dt, dd);
    }
    $('topicExpected').textContent = currentExample.expected;
    $('topicExperiment').textContent = currentExample.tryThis;
    $('topicWatch').textContent = currentExample.watchFor;
    $('topicVisual').hidden = !currentExample.visual;
    $('topicVisual').innerHTML = diagrams[currentExample.visual] || '';
    $('topicRelated').replaceChildren();
    for (const relatedId of entry.related || []) {
      const related = byId.get(relatedId); if (!related) continue;
      const link = document.createElement('a'); link.href = '#' + related.id; link.textContent = related.title;
      link.addEventListener('click', event => { event.preventDefault(); selectEntry(related.id, true); });
      $('topicRelated').append(link);
    }
    $('detailScroll').scrollTop = 0;
    $('referenceStatus').textContent = ready ? (currentExample.auto === false ? 'Press Run to try the input dialog.' : 'Edits are saved for this example.') : 'Loading editor…';
    renderList();
    applyExample(currentExample.auto !== false);
    document.body.dataset.topic = entry.id;
    document.body.dataset.variant = currentExample.id;
    const order = navigationOrder(), position = order.indexOf(entry);
    $('topicPage').textContent = (entry.trail ? 'Stop ' : '') + (position + 1) + ' / ' + order.length;
    $('previousTopic').disabled = position === 0;
    $('nextTopic').disabled = position === order.length - 1;
    $('previousTopic').title = position > 0 ? order[position - 1].title : 'First topic';
    $('nextTopic').title = position < order.length - 1 ? order[position + 1].title : 'Last topic';
  }
  function setMobileView(view) {
    document.body.dataset.view = view;
    document.querySelectorAll('[data-view]').forEach(button => { if (button.tagName === 'BUTTON') button.setAttribute('aria-pressed', String(button.dataset.view === view)); });
  }
  function closeNav() { document.body.classList.remove('nav-open'); $('navOverlay').hidden = true; $('browseCommands').setAttribute('aria-expanded','false'); }
  $('browseCommands').addEventListener('click', () => {
    if (document.body.classList.contains('nav-open')) return closeNav();
    document.body.classList.add('nav-open'); $('navOverlay').hidden = false; $('browseCommands').setAttribute('aria-expanded','true'); $('referenceSearch').focus();
  });
  $('navOverlay').addEventListener('click', closeNav);
  document.addEventListener('keydown', event => { if (event.key === 'Escape') { closeNav(); $('browseCommands').focus(); } });
  document.querySelectorAll('.mobile-views button').forEach(button => button.addEventListener('click', () => setMobileView(button.dataset.view)));
  $('referenceSearch').addEventListener('input', renderList);
  function turnPage(direction) {
    const order = navigationOrder();
    const entry = order[order.indexOf(current) + direction];
    if (!entry) return;
    $('referenceSearch').value = '';
    selectEntry(entry.id, true);
    $('topicTitle').focus({preventScroll:true});
  }
  $('previousTopic').addEventListener('click', () => turnPage(-1));
  $('nextTopic').addEventListener('click', () => turnPage(1));
  $('previousExample').addEventListener('click', () => chooseExample(current.examples[current.examples.indexOf(currentExample) - 1].id));
  $('nextExample').addEventListener('click', () => chooseExample(current.examples[current.examples.indexOf(currentExample) + 1].id));
  $('markComplete').addEventListener('click', () => {
    if (!current.trail) return;
    const done = !window.TurtleTrailProgress.has(current.id);
    const saved = window.TurtleTrailProgress.set(current.id, done);
    renderTrail();
    $('referenceStatus').textContent = saved ? (done ? 'Added to your trail checklist.' : 'Removed from your trail checklist.') : 'Checklist updated for this open page.';
  });
  $('runExample').addEventListener('click', () => { send({kind:'turtle-tutorial-run'}); if (innerWidth < 1000) setMobileView('editor'); });
  $('resetExample').addEventListener('click', () => { drafts[exampleKey()] = currentExample.code; persist(); applyExample(currentExample.auto !== false); $('referenceStatus').textContent = 'This example has been reset.'; });
  window.addEventListener('message', event => {
    if (event.origin !== location.origin || event.source !== frame.contentWindow || event.data?.project !== 'turtle-reference') return;
    const message = event.data;
    if (message.kind === 'turtle-tutorial-ready') {
      if (ready) return;
      ready = true; $('editorLoading').hidden = true;
      $('runExample').disabled = false; $('resetExample').disabled = false;
      $('referenceStatus').textContent = currentExample.auto === false ? 'Press Run to try the input dialog.' : 'Edits are saved for this example.';
      document.body.dataset.editorReady = 'true'; applyExample(currentExample.auto !== false);
    } else if (message.kind === 'turtle-tutorial-applied' && message.requestId === requestId) {
      pending = false; appliedId = exampleKey();
      document.body.dataset.exampleId = exampleKey();
      highlightExample();
      $('runExample').disabled = false; $('resetExample').disabled = false;
    } else if (message.kind === 'turtle-tutorial-code' && !pending && appliedId === exampleKey()) {
      drafts[exampleKey()] = message.code; persist();
    } else if (message.kind === 'turtle-tutorial-save-failed') {
      $('referenceStatus').textContent = 'Edits stay in this open page.';
    }
  });
  frame.addEventListener('load', () => send({kind:'turtle-tutorial-hello'}));
  setTimeout(() => { if (!ready) { $('editorLoading').textContent = 'The editor is taking longer to load. Reload the page to try again.'; $('referenceStatus').textContent = 'Reference topics are available while the editor loads.'; } }, 20000);
  function currentRoute() { try { return decodeURIComponent(location.hash.slice(1)) || 'start'; } catch { return 'start'; } }
  window.addEventListener('hashchange', () => selectEntry(currentRoute()));
  window.addEventListener('pagehide', captureDraft);
  const divider = $('referenceDivider'); let dragging = false;
  function resizeDetail(width, save = false) {
    width = Math.round(Math.max(280, Math.min(520, width)));
    document.documentElement.style.setProperty('--detail-width', width + 'px'); divider.setAttribute('aria-valuenow', width);
    if (save) try { localStorage.setItem('turtle-reference-width', String(width)); } catch {}
  }
  try { const width = Number(localStorage.getItem('turtle-reference-width')); if (width) resizeDetail(width); } catch {}
  divider.addEventListener('pointerdown', event => { if (event.button !== 0) return; dragging = true; divider.setPointerCapture(event.pointerId); document.body.classList.add('resizing'); event.preventDefault(); });
  divider.addEventListener('pointermove', event => { if (dragging) resizeDetail(event.clientX - document.querySelector('.reference-detail').getBoundingClientRect().left, true); });
  function finishResize() { dragging = false; document.body.classList.remove('resizing'); }
  divider.addEventListener('pointerup', finishResize); divider.addEventListener('pointercancel', finishResize); divider.addEventListener('lostpointercapture', finishResize);
  divider.addEventListener('keydown', event => { if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return; event.preventDefault(); resizeDetail(event.key === 'Home' ? 280 : event.key === 'End' ? 520 : Number(divider.getAttribute('aria-valuenow')) + (event.key === 'ArrowRight' ? 10 : -10), true); });
  const picker = $('examplePicker'), narrow = matchMedia('(max-width:999px)');
  function placePicker() {
    if (narrow.matches) $('mobileExampleSlot').append(picker);
    else document.querySelector('.editor-shell').prepend(picker);
  }
  narrow.addEventListener('change', placePicker); placePicker();
  new ResizeObserver(() => {
    document.documentElement.style.setProperty('--picker-height', picker.offsetHeight + 'px');
    revealSelectedExample();
  }).observe(picker);
  selectEntry(currentRoute());
})();
