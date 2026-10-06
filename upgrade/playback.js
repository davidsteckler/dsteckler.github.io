(() => {
  'use strict';
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const films = Array.from(document.querySelectorAll('video[data-film]'));
  const states = new Map();
  const button = (label, action, name) => {
    const el = document.createElement('button');
    el.type = 'button'; el.textContent = label;
    el.setAttribute('aria-label', `${label} ${name}`);
    el.addEventListener('click', action);
    return el;
  };
  function load(video) {
    if (video.error) video.removeAttribute('src');
    if (!video.hasAttribute('src')) {
      video.src = video.dataset.src;
      video.load();
    }
  }
  function update(video) {
    const state = states.get(video);
    const action = video.ended ? 'Replay' : video.paused ? 'Play' : 'Pause';
    state.play.textContent = action;
    state.play.setAttribute('aria-label', `${action} ${video.dataset.title}`);
    state.play.setAttribute('aria-pressed', String(!video.paused));
    state.sound.textContent = video.muted ? 'Sound' : 'Mute';
    state.sound.setAttribute('aria-label', `${video.muted ? 'Enable sound for' : 'Mute'} ${video.dataset.title}`);
    state.sound.setAttribute('aria-pressed', String(!video.muted));
  }
  async function start(video) {
    load(video);
    try { await video.play(); } catch (_) { update(video); }
  }
  function toggle(video) {
    const state = states.get(video);
    if (video.paused) {
      state.manualPause = false;
      state.manualPlay = true;
      if (video.ended) video.currentTime = 0;
      start(video);
    } else { state.manualPause = true; state.manualPlay = false; video.pause(); }
  }
  for (const video of films) {
    video.muted = true;
    const name = video.dataset.title;
    const controls = document.createElement('div');
    controls.className = 'film-controls';
    const play = button('Play', () => toggle(video), name);
    const replay = button('Replay', () => {
      const state = states.get(video);
      state.manualPause = false; state.manualPlay = true; load(video); video.currentTime = 0; start(video);
    }, name);
    const sound = button('Sound', () => {
      const unmute = video.muted;
      if (unmute) {
        for (const other of films) {
          if (other !== video) { other.muted = true; update(other); }
        }
      }
      video.muted = !unmute;
      if (unmute && video.paused) { states.get(video).manualPause = false; states.get(video).manualPlay = true; start(video); }
      update(video);
    }, name);
    const full = button('Expand', async () => {
      load(video);
      try {
        if (video.requestFullscreen) await video.requestFullscreen();
        else if (video.webkitEnterFullscreen) video.webkitEnterFullscreen();
      } catch (_) {}
    }, name);
    controls.append(play, replay, sound);
    if (video.requestFullscreen || video.webkitEnterFullscreen) controls.append(full);
    video.parentElement.append(controls);
    states.set(video, { play, sound, visible: false, manualPause: false, manualPlay: false });
    for (const event of ['play', 'pause', 'ended', 'volumechange']) video.addEventListener(event, () => update(video));
    video.addEventListener('error', () => {
      play.textContent = 'Retry';
      play.setAttribute('aria-label', `Retry ${name}`);
    });
    video.addEventListener('click', () => toggle(video));
    video.addEventListener('keydown', event => {
      if (event.key === ' ' || event.key === 'Enter') { event.preventDefault(); toggle(video); }
    });
    video.addEventListener('fullscreenchange', () => {
      video.controls = document.fullscreenElement === video;
    });
    update(video);
  }
  function resumeVisible() {
    for (const video of films) {
      const state = states.get(video);
      if (document.hidden || !state.visible) video.pause();
      else if (!state.manualPause && !video.ended && (!motion.matches || state.manualPlay)) start(video);
    }
  }
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        const state = states.get(entry.target);
        state.visible = entry.isIntersecting && entry.intersectionRatio >= .25;
      }
      resumeVisible();
    }, { threshold: [0, .25] });
    films.forEach(video => observer.observe(video));
  } else {
    films.forEach(video => { states.get(video).visible = true; });
    resumeVisible();
  }
  document.addEventListener('visibilitychange', resumeVisible);
  motion.addEventListener('change', () => {
    if (motion.matches) for (const video of films) { states.get(video).manualPlay = false; video.pause(); }
    resumeVisible();
  });
  const menu = document.querySelector('.menu-toggle');
  const nav = document.getElementById('site-nav');
  if (menu && nav) menu.addEventListener('click', () => {
    menu.setAttribute('aria-expanded', String(nav.classList.toggle('open')));
  });
})();
