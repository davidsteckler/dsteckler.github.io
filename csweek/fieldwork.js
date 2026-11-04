'use strict';

const Fieldwork = (() => {
  const palette = {
    invisible: ['#0b1820', '#527c77'],
    control: ['#0b1929', '#4f7d9e'],
    letter: ['#1b191b', '#a47c58']
  };
  const illustrations = {
    invisible: `
      <rect x="48" y="34" width="312" height="146" rx="10" fill="#1c2c33" stroke="#70938e" stroke-width="2"/>
      <rect x="59" y="45" width="290" height="123" rx="6" fill="#101c23" stroke="#3d5c60"/>
      <path d="M88 94H300M145 94V134H235V94" fill="none" stroke="#516d69" stroke-width="2"/>
      <path class="signal" d="M88 94H300" fill="none" stroke="currentColor" stroke-width="2"/>
      <g fill="#20383b" stroke="#75938c" stroke-width="2">
        <circle cx="108" cy="94" r="16"/><circle cx="165" cy="94" r="16"/><circle cx="222" cy="94" r="16"/>
      </g>
      <path d="M108 101V79M165 101l10-17M222 101V79" stroke="#e4eeea" stroke-width="5" stroke-linecap="round"/>
      <circle cx="300" cy="94" r="23" fill="#203335" stroke="#75938c"/>
      <circle class="lamp-core" cx="300" cy="94" r="13" fill="#efd09b"/>
      <g fill="#9cb2ac" font-size="10" text-anchor="middle"><text x="108" y="130">A</text><text x="165" y="130">B</text><text x="222" y="130">C</text></g>
      <rect x="264" y="138" width="62" height="18" rx="2" fill="#465457"/>
      <text x="295" y="151" fill="#eff7f5" font-size="10" text-anchor="middle">B–3</text>
      <path d="M48 171H29v19h33M360 171h21v-28" fill="none" stroke="#547975" stroke-width="2"/>`,
    control: `
      <g fill="none" stroke="#5885a4" opacity=".62">
        <circle cx="226" cy="101" r="31"/><circle cx="226" cy="101" r="60"/><circle cx="226" cy="101" r="87"/>
        <path d="M226 14v174M139 101h174M164 39l124 124M164 163L288 39"/>
      </g>
      <path class="scope" d="M226 101L193 20A87 87 0 0 1 248 17Z" fill="currentColor" opacity=".15"/>
      <path d="M50 157l55-11 52-38 55-42 49 5 72 46" fill="none" stroke="currentColor" stroke-width="2.5"/>
      <path class="signal" d="M157 108l55-27 49 8 72 46" fill="none" stroke="#f4cb91" stroke-width="2.5"/>
      <g fill="currentColor"><circle cx="105" cy="146" r="4"/><circle cx="157" cy="108" r="4"/><circle cx="212" cy="66" r="5"/><circle cx="261" cy="71" r="4"/></g>
      <path d="M25 56V30h43M372 146h25v31h-30" fill="none" stroke="#83abc0"/>
      <text x="26" y="48" fill="#9bd4ff" font-size="9">TRACK / 02</text>
      <text x="325" y="157" fill="#f4cb91" font-size="9">+ / −</text>`,
    letter: `
      <g transform="rotate(-7 208 100)">
        <rect x="69" y="47" width="265" height="127" rx="6" fill="#665346" stroke="#c0a281" stroke-width="2"/>
        <path d="M82 58l120 84 119-84" fill="#4b3d34" stroke="#ad8b6a" stroke-width="2"/>
        <rect x="105" y="25" width="206" height="96" rx="4" fill="#d8bf99" stroke="#f0d4ab"/>
        <path d="M120 57h149m-149 36h173m-173 13h103" stroke="#7c6350" opacity=".6"/>
        <text x="121" y="80" fill="#392c25" font-size="15">VWDUW ZLWK RQH</text>
        <path d="M70 169l97-80 35 30 35-30 97 80" fill="#8a7058" stroke="#d8b58c" stroke-width="2"/>
        <circle cx="202" cy="122" r="19" fill="#773d40" stroke="#d0887b" stroke-width="2"/>
        <text x="202" y="128" fill="#ffe0c4" font-size="15" text-anchor="middle">III</text>
      </g>
      <path class="signal" d="M320 43l29-14h41M60 171l-16 12H23" fill="none" stroke="currentColor" opacity=".75"/>
      <text x="346" y="48" fill="#e5bc90" font-size="9">SEAL</text>`
  };
  const cases = [
    { id: 'invisible', title: 'The Invisible Computer', intro: 'The building is empty. The cabinet is warm.', image: 'relay-cabinet.webp' },
    { id: 'control', title: 'Mission Control', intro: 'Same flight. Same stamp. Different tracks.', image: 'flight-console.webp' },
    { id: 'letter', title: 'The Unread Letter', intro: 'No signature. The wax is still intact.', image: 'wax-letter.webp' }
  ];
  const art = id => `<svg class="case-art" viewBox="0 0 420 200" aria-hidden="true" focusable="false">
    <rect width="420" height="200" fill="${palette[id][0]}"/>
    <path d="${Array.from({ length: 20 }, (_, i) => `M${i * 22} 0v200`).join(' ')} ${Array.from({ length: 10 }, (_, i) => `M0 ${i * 22}h420`).join(' ')}" fill="none" stroke="${palette[id][1]}" opacity=".18"/>
    ${illustrations[id]}
  </svg>`;
  const object = (id, caption, hotspot) => `<figure class="object-figure"><div class="object-view object-${id}">${art(id)}${hotspot ? `<button class="object-pin" id="${hotspot.id}" aria-label="${hotspot.label}"><span aria-hidden="true">+</span></button>` : ''}</div><figcaption>${caption}</figcaption></figure>`;
  const archive = (title, body) => `<details class="archive-reading"><summary>${title}</summary><div class="reading">${body}</div></details>`;
  const note = (title, body) => `<aside class="evidence-note"><p><strong>${title}</strong> ${body}</p></aside>`;

  const fragments = {
    invisible: { mark: 'CIRCUIT', line: 'A test only tells you what its inputs let you see.' },
    control: { mark: 'SIGNAL', line: 'The order of work can decide whether a deadline is met.' },
    letter: { mark: 'TRACE', line: 'A useful guess keeps working after the first word.' }
  };
  const key = 'csweek_field_fragments_v1';
  let found = {};
  try { found = JSON.parse(localStorage.getItem(key) || '{}') || {}; } catch {}
  function fragment(id) {
    const order = cases.findIndex(item => item.id === id) + 1;
    return `<div class="fragment"><span class="caption">ARCHIVE FRAGMENT 0${order}</span><p><strong>${fragments[id].mark}</strong></p><p>${fragments[id].line} <a href="/csweek/#case-index">Return to the case index</a>.</p></div>`;
  }
  function unlock(id, target) {
    found[id] = true;
    try { localStorage.setItem(key, JSON.stringify(found)); } catch {}
    target.innerHTML = fragment(id);
  }
  function clear(id) {
    delete found[id];
    delete found.vault;
    try { localStorage.setItem(key, JSON.stringify(found)); } catch {}
  }
  function markBox(id) {
    return `<div id="field-fragment" role="status">${found[id] ? fragment(id) : ''}</div>`;
  }
  function inspect(title, body, id) {
    return `<details class="inspect" ${found[id] ? 'open' : ''}><summary>${title}</summary>${body}<p id="field-status" class="status" role="status"></p>${markBox(id)}</details>`;
  }
  function indexCard() {
    return `<details class="vault-entry" id="case-index"><summary>Read the small print on the case index</summary>
      <p>Three scraps were filed under the same reference number. If you find them, write down each stamped word. The index wants them in case order.</p>
      <p class="clue-tally">Fragments recovered on this device · ${cases.filter(item => found[item.id]).length} / 3</p>
      <form class="inline-form" id="vault-form"><label>Three stamped words<input id="vault-words" type="text" spellcheck="false" autocomplete="off" required></label><button>Check the archive index</button></form>
      <p id="vault-status" class="status" role="status"></p>
      <section class="vault-panel" id="vault-panel" ${found.vault ? '' : 'hidden'}><div class="fragment"><span class="caption">ARCHIVE / LAST PAGE</span><h3>Keep the page you worked on.</h3><p>Look back at the first guess you wrote down. Find the point where you changed it.</p><p>A switch that stayed dark. A number a machine got wrong. A letter that made the rest of a word fit. There was a moment when you had enough evidence to try something different.</p><p>In CodeHS, it might be the line Tracy just ran. Give yourself a way to see it. Change one thing, run it again, and keep track of what happened.</p><p>If you’re working with someone, trade pages. Can you see the moment their thinking changed?</p></div></section>
    </details>`;
  }
  function bindIndex(sound) {
    const form = document.getElementById('vault-form');
    const index = document.getElementById('case-index');
    if (location.hash === '#case-index') {
      index.open = true;
      requestAnimationFrame(() => index.scrollIntoView({block: 'start'}));
    }
    form.onsubmit = event => {
      event.preventDefault();
      const words = document.getElementById('vault-words').value.toUpperCase().match(/[A-Z]+/g) || [];
      const good = words.join(' ') === cases.map(item => fragments[item.id].mark).join(' ');
      const status = document.getElementById('vault-status');
      status.textContent = good ? 'Index accepted. The last page is below.' : 'Use the stamped word from each case, in case order.';
      status.classList.toggle('good', good);
      sound(good ? 'discover' : 'retry');
      if (!good) return;
      found.vault = true;
      try { localStorage.setItem(key, JSON.stringify(found)); } catch {}
      document.getElementById('vault-panel').hidden = false;
    };
  }

  function check(id, evaluate, sound) {
    const form = document.getElementById('field-form');
    if (!form) return;
    form.onsubmit = event => {
      event.preventDefault();
      const result = evaluate(new FormData(form), form);
      const status = document.getElementById('field-status');
      status.textContent = result.message;
      status.classList.toggle('good', result.ok);
      sound(result.ok ? 'discover' : 'retry');
      if (result.ok) unlock(id, document.getElementById('field-fragment'));
    };
  }

  return { cases, art, object, archive, note, inspect, indexCard, bindIndex, check, clear };
})();
