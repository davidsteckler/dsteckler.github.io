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
  let drafts = {}, current, ready = false, pending = false, requestId = 0, appliedId = null;
  try { drafts = JSON.parse(localStorage.getItem(storageKey) || '{}') || {}; } catch {}
  function persist() { try { localStorage.setItem(storageKey, JSON.stringify(drafts)); } catch { $('referenceStatus').textContent = 'Edits stay in this open page.'; } }
  function captureDraft() {
    if (!current || !ready || pending) return;
    const cm = frame.contentDocument?.querySelector('.CodeMirror')?.CodeMirror;
    if (cm) { drafts[current.id] = cm.getValue(); persist(); }
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
    doc.body.classList.toggle('reference-ascii', current.output === 'ascii');
    $('editorViewLabel').textContent = current.output === 'ascii' ? 'Code & ASCII art' : 'Code & drawing';
    frame.title = current.output === 'ascii' ? 'Python editor and live ASCII art' : 'Python editor and live Turtle drawing';
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
    const code = typeof drafts[current.id] === 'string' ? drafts[current.id] : current.code;
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
    const matches = entries.filter(entry => [entry.title, entry.id, entry.group, entry.syntax, entry.summary, ...entry.params.flat(), ...(entry.aliases || [])].join(' ').toLowerCase().includes(query));
    $('commandList').replaceChildren();
    for (const group of groups) {
      const items = matches.filter(entry => entry.group === group);
      if (!items.length) continue;
      const section = document.createElement('section'); section.className = 'command-group';
      const heading = document.createElement('h2'); heading.textContent = group; section.append(heading);
      for (const entry of items) {
        const link = document.createElement('a'); link.className = 'command-link'; link.href = '#' + entry.id;
        link.dataset.id = entry.id; link.textContent = entry.title;
        if (current?.id === entry.id) link.setAttribute('aria-current','page');
        link.addEventListener('click', event => { event.preventDefault(); selectEntry(entry.id, true); closeNav(); });
        section.append(link);
      }
      $('commandList').append(section);
    }
    $('emptySearch').hidden = matches.length > 0;
    $('searchCount').textContent = query ? `${matches.length} matching topics` : `${entries.length} topics · runnable examples`;
  }
  function selectEntry(id, updateHistory = false) {
    const entry = byId.get(id) || entries[0];
    captureDraft(); current = entry;
    if (updateHistory) history.pushState(null, '', '#' + entry.id);
    document.title = entry.title + ' · Python Turtle Reference | David Steckler';
    $('topicGroup').textContent = entry.group;
    $('topicTitle').textContent = entry.title;
    $('topicSummary').textContent = entry.summary;
    renderTrail();
    $('topicSyntax').textContent = entry.syntax;
    $('topicAliases').hidden = !entry.aliases?.length;
    $('topicAliases').textContent = entry.aliases?.length ? 'Also find this with: ' + entry.aliases.join(', ') : '';
    $('parameterSection').hidden = !entry.params.length;
    $('topicParams').replaceChildren();
    for (const [name, explanation] of entry.params) {
      const dt = document.createElement('dt'), dd = document.createElement('dd');
      dt.textContent = name; dd.textContent = explanation; $('topicParams').append(dt, dd);
    }
    $('topicExpected').textContent = entry.expected;
    $('topicExperiment').textContent = entry.tryThis;
    $('topicWatch').textContent = entry.watchFor;
    $('topicVisual').hidden = !entry.visual;
    $('topicVisual').innerHTML = diagrams[entry.visual] || '';
    $('topicRelated').replaceChildren();
    for (const relatedId of entry.related || []) {
      const related = byId.get(relatedId); if (!related) continue;
      const link = document.createElement('a'); link.href = '#' + related.id; link.textContent = related.title;
      link.addEventListener('click', event => { event.preventDefault(); selectEntry(related.id, true); });
      $('topicRelated').append(link);
    }
    $('detailScroll').scrollTop = 0;
    $('referenceStatus').textContent = ready ? (entry.auto === false ? 'Press Run to try the input dialog.' : 'Edit the code and run again.') : 'Loading editor…';
    renderList();
    applyExample(entry.auto !== false);
    document.body.dataset.topic = entry.id;
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
  $('markComplete').addEventListener('click', () => {
    if (!current.trail) return;
    const done = !window.TurtleTrailProgress.has(current.id);
    const saved = window.TurtleTrailProgress.set(current.id, done);
    renderTrail();
    $('referenceStatus').textContent = saved ? (done ? 'Added to your trail checklist.' : 'Removed from your trail checklist.') : 'Checklist updated for this open page.';
  });
  $('runExample').addEventListener('click', () => { send({kind:'turtle-tutorial-run'}); if (innerWidth < 1000) setMobileView('editor'); });
  $('resetExample').addEventListener('click', () => { drafts[current.id] = current.code; persist(); applyExample(current.auto !== false); $('referenceStatus').textContent = 'Original example restored.'; });
  window.addEventListener('message', event => {
    if (event.origin !== location.origin || event.source !== frame.contentWindow || event.data?.project !== 'turtle-reference') return;
    const message = event.data;
    if (message.kind === 'turtle-tutorial-ready') {
      if (ready) return;
      ready = true; $('editorLoading').hidden = true;
      $('runExample').disabled = false; $('resetExample').disabled = false;
      $('referenceStatus').textContent = current.auto === false ? 'Press Run to try the input dialog.' : 'Edit the code and run again.';
      document.body.dataset.editorReady = 'true'; applyExample(current.auto !== false);
    } else if (message.kind === 'turtle-tutorial-applied' && message.requestId === requestId) {
      pending = false; appliedId = current.id;
      document.body.dataset.exampleId = current.id;
      $('runExample').disabled = false; $('resetExample').disabled = false;
    } else if (message.kind === 'turtle-tutorial-code' && !pending && appliedId === current.id) {
      drafts[current.id] = message.code; persist();
    } else if (message.kind === 'turtle-tutorial-save-failed') {
      $('referenceStatus').textContent = 'Edits stay in this open page.';
    }
  });
  frame.addEventListener('load', () => send({kind:'turtle-tutorial-hello'}));
  setTimeout(() => { if (!ready) { $('editorLoading').textContent = 'The editor is taking longer to load. Reload the page to try again.'; $('referenceStatus').textContent = 'Reference topics are available while the editor loads.'; } }, 20000);
  window.addEventListener('hashchange', () => selectEntry(decodeURIComponent(location.hash.slice(1))));
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
  selectEntry(decodeURIComponent(location.hash.slice(1)) || 'start');
})();
