(() => {
  const trails = window.TURTLE_TRAILS, progress = window.TurtleTrailProgress;
  const total = trails.reduce((n, trail) => n + trail.stops.length, 0);
  const completed = trails.reduce((n, trail) => n + trail.stops.filter(stop => progress.has(stop.id)).length, 0);
  document.getElementById('totalProgress').textContent = completed ? completed + ' of ' + total + ' stops marked done' : total + ' stops to explore';
  const filled = Math.floor(completed / total * 20);
  document.getElementById('totalBar').textContent = '[' + '#'.repeat(filled) + '.'.repeat(20 - filled) + ']';
  for (const trail of trails) {
    const card = document.createElement('article'); card.className = 'trail-card'; card.dataset.level = trail.level; card.dataset.trail = trail.id;
    const preview = document.createElement('div'); preview.className = 'trail-preview';
    if (['firefly-grove','pixel-potion','strange-garden','tiny-dragon'].includes(trail.id)) {
      const img = document.createElement('img'); img.src = '../trail-previews/' + ({'strange-garden':'garden-wild--original.svg','tiny-dragon':'dragon-trick--original.svg'}[trail.id] || trail.id + '.png') + '?v=2'; img.alt = trail.id === 'firefly-grove' ? 'A crescent moon over green hills and scattered warm firefly lights' : trail.id === 'pixel-potion' ? 'Two pixel bottles labeled Dream and Mana, with purple and blue liquid' : trail.id === 'strange-garden' ? 'Five leafy flowers in a garden bed' : 'A horned green dragon with a purple wing, curling tail, and warm sparks'; preview.append(img);
    } else {
      const art = document.createElement('pre'); art.textContent = trail.preview; art.setAttribute('aria-label', trail.title + ' sample text art'); preview.append(art);
    }
    const caption = document.createElement('span'); caption.className = 'preview-caption'; caption.textContent = trail.medium; preview.append(caption);
    const body = document.createElement('div'); body.className = 'trail-card-body';
    const meta = document.createElement('div'); meta.className = 'trail-meta';
    const level = document.createElement('span'); level.className = 'level ' + trail.level.toLowerCase(); level.textContent = trail.level;
    meta.append(level, document.createTextNode(trail.stops.length + ' working stops'));
    const title = document.createElement('h3'); title.textContent = trail.title;
    const description = document.createElement('p'); description.className = 'trail-description'; description.textContent = trail.description;
    const skills = document.createElement('p'); skills.className = 'trail-skills'; skills.textContent = trail.skills;
    const bottom = document.createElement('div'); bottom.className = 'trail-bottom';
    const done = trail.stops.filter(stop => progress.has(stop.id)).length;
    const bar = document.createElement('span'); bar.className = 'ascii-progress'; bar.textContent = '[' + '#'.repeat(done) + '.'.repeat(trail.stops.length - done) + '] ' + done + '/' + trail.stops.length; bar.setAttribute('aria-label', done + ' of ' + trail.stops.length + ' stops marked done');
    const link = document.createElement('a'); link.href = '../#' + (trail.stops.find(stop => !progress.has(stop.id)) || trail.stops[0]).id;
    link.textContent = done === trail.stops.length ? 'Revisit →' : done ? 'Continue →' : 'Start trail →'; link.setAttribute('aria-label', link.textContent.replace(' →','') + ': ' + trail.title);
    bottom.append(bar, link); body.append(meta, title, description, skills, bottom); card.append(preview, body); document.getElementById('trailGrid').append(card);
  }
  document.querySelectorAll('[data-level]').forEach(button => {
    if (button.tagName !== 'BUTTON') return;
    button.addEventListener('click', () => {
      const level = button.dataset.level;
      document.querySelectorAll('.level-filters button').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
      document.querySelectorAll('.trail-card').forEach(card => { card.hidden = level !== 'All' && card.dataset.level !== level; });
      const count = trails.filter(trail => level === 'All' || trail.level === level).length;
      document.getElementById('trailCount').textContent = level === 'All' ? 'Eight trails. Start wherever you’re curious.' : count + ' ' + level.toLowerCase() + (count === 1 ? ' trail' : ' trails');
    });
  });
  // Returning from a stop should immediately show the latest checklist.
  window.addEventListener('pageshow', event => { if (event.persisted) location.reload(); });
})();
