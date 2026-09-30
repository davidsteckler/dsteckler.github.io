(() => {
  const key = 'dsteckler-creative-trails-progress-v1';
  let progress = {};
  try {
    const saved = JSON.parse(localStorage.getItem(key) || '{}');
    if (saved && typeof saved === 'object' && !Array.isArray(saved)) progress = saved;
  } catch {}
  window.TurtleTrailProgress = {
    has: id => progress[id] === true,
    set(id, done) {
      progress[id] = done;
      try { localStorage.setItem(key, JSON.stringify(progress)); return true; } catch { return false; }
    }
  };
})();
