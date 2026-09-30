(() => {
  'use strict';
  const entries = window.TURTLE_REFERENCE;
  const byId = new Map(entries.map(entry => [entry.id, entry]));
  const groups = [...new Set(entries.map(entry => entry.group))];
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
  function applyExample(run) {
    if (!ready || !current) return;
    pending = true; appliedId = null;
    document.body.dataset.exampleId = '';
    $('runExample').disabled = true; $('resetExample').disabled = true;
    const code = typeof drafts[current.id] === 'string' ? drafts[current.id] : current.code;
    send({kind:'turtle-tutorial-set-code', code, run, requestId:++requestId});
  }
  const diagrams = {
    heading: '<svg viewBox="0 0 290 168" role="img" aria-label="Direction compass: 0 degrees right, 90 degrees up, 180 degrees left, 270 degrees down"><path d="M145 30V138M55 84H235" fill="none" stroke="#acbfb3" stroke-width="1.5"/><path d="M145 34l-4 8h8zM231 84l-8-4v8zM59 84l8 4v-8zM145 134l-4-8h8z" fill="#809c8e"/><circle cx="145" cy="84" r="25" fill="#e0eee4"/><path d="M155 84l-18-9v18z" fill="#176b73"/><text x="145" y="21" text-anchor="middle">90° · up</text><text x="239" y="88">0°</text><text x="16" y="88">180°</text><text x="145" y="155" text-anchor="middle">270° · down</text></svg>',
    coordinates: '<svg viewBox="0 0 290 185" role="img" aria-label="Coordinate plane with the origin at the center and point 100 comma 50 above and to the right"><defs><pattern id="refGrid" width="17" height="17" patternUnits="userSpaceOnUse"><path d="M17 0H0V17" fill="none" stroke="#dfe7dd" stroke-width=".7"/></pattern></defs><rect x="60" y="8" width="170" height="170" fill="url(#refGrid)"/><path d="M60 93H230M145 8V178" stroke="#91aa9c"/><path d="M145 93H187.5V71.75" stroke="#cf8063" stroke-dasharray="4 3" fill="none"/><circle cx="145" cy="93" r="4" fill="#176b73"/><circle cx="187.5" cy="71.75" r="5" fill="coral"/><text x="153" y="109">(0, 0)</text><text x="170" y="56">(100, 50)</text><text x="18" y="97">−200</text><text x="234" y="97">200 x</text><text x="149" y="19" class="diagram-note">200 y</text><text x="149" y="176" class="diagram-note">−200</text></svg>',
    radius: '<svg viewBox="0 0 290 164" role="img" aria-label="Circle showing a radius of 40 from center to edge and a diameter of 80 across the full circle"><circle cx="145" cy="74" r="49" fill="#e6f0e6" stroke="#176b73" stroke-width="3"/><path d="M145 74H194" stroke="#c67b4f" stroke-width="3"/><circle cx="145" cy="74" r="3" fill="#c67b4f"/><text x="160" y="65" text-anchor="middle" class="diagram-note">radius 40</text><path d="M96 137H194M96 131V143M194 131V143" stroke="#748f81"/><text x="145" y="156" text-anchor="middle">diameter 80</text><path d="M153 123l-15-6v12z" fill="#176b73"/></svg>'
  };
  function renderList() {
    const query = $('referenceSearch').value.trim().toLowerCase();
    const matches = entries.filter(entry => [entry.title, entry.id, entry.group, entry.syntax, entry.summary, ...(entry.aliases || [])].join(' ').toLowerCase().includes(query));
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
