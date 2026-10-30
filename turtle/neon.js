/* A display effect: the Python program and the original canvas stay intact. */
(() => {
  'use strict';
  const canvas = document.getElementById('turtle-drawing');
  const control = document.getElementById('neonGlow');
  if (!canvas || !control) return;

  const levels = new Set(['off', 'soft', 'bright']);
  const params = new URLSearchParams(location.search);
  // Lesson/reference embeds keep their existing appearance. Pumpkin has its
  // own preference, so trying glow there does not change another lesson.
  const storageKey = params.get('pumpkin') === '1' ? 'dsteckler-pumpkin-neon-v1' :
    params.get('embed') ? null : 'dsteckler-turtle-neon-v1';
  const filters = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  filters.classList.add('neon-filters');
  filters.setAttribute('aria-hidden', 'true');
  filters.setAttribute('focusable', 'false');
  // Blurring the complete image once keeps circles and animated segments
  // evenly lit. SourceGraphic preserves the crisp original and every color.
  filters.innerHTML = `<defs>
    <filter id="turtle-neon-soft" x="-25%" y="-25%" width="150%" height="150%" color-interpolation-filters="sRGB">
      <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="halo"/>
      <feMerge><feMergeNode in="halo"/><feMergeNode in="halo"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="turtle-neon-bright" x="-25%" y="-25%" width="150%" height="150%" color-interpolation-filters="sRGB">
      <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="halo"/>
      <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="core"/>
      <feMerge><feMergeNode in="halo"/><feMergeNode in="halo"/><feMergeNode in="core"/><feMergeNode in="core"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>`;
  document.body.append(filters);

  let current = 'off';
  function setLevel(level) {
    if (!levels.has(level)) return false;
    current = level;
    control.value = level;
    canvas.style.filter = level === 'off' ? 'none' : 'url("#turtle-neon-' + level + '")';
    if (storageKey) try { localStorage.setItem(storageKey, level); } catch {}
    return true;
  }
  let saved = 'off';
  if (storageKey) try { saved = localStorage.getItem(storageKey) || 'off'; } catch {}
  setLevel(levels.has(saved) ? saved : 'off');
  control.addEventListener('change', () => setLevel(control.value));
  window.TurtleNeon = { setLevel, getLevel: () => current };
})();
