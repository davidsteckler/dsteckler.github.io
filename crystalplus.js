(() => {
  'use strict';

  if (window.__CRYSTAL_PLUS_V23__) return;
  window.__CRYSTAL_PLUS_V23__ = true;

  const VERSION = '23.0';
  const BEST_KEY = 'crystal-caverns-plus-best';
  const meta = {
    score: 0,
    best: 0,
    startBest: 0,
    flow: 0,
    flowClock: 3,
    skipDecay: false,
    floor: 0,
    spawnRoomKey: null,
    rooms: Object.create(null),
    started: false,
    gameOverShown: false
  };

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const num = (v, fallback = 0) => Number.isFinite(Number(v)) ? Number(v) : fallback;

  function getState() {
    try { return (typeof G !== 'undefined') ? G : null; }
    catch (_) { return null; }
  }

  function getPlayer() {
    const g = getState();
    return g && g.player ? g.player : null;
  }

  function readBest() {
    try { return Math.max(0, parseInt(localStorage.getItem(BEST_KEY) || '0', 10) || 0); }
    catch (_) { return 0; }
  }

  function saveBest() {
    if (meta.score <= meta.best) return false;
    meta.best = meta.score;
    try { localStorage.setItem(BEST_KEY, String(meta.best)); } catch (_) {}
    return true;
  }

  function exposeGlobals() {
    const g = getState();
    if (g) window.G = g;
    try { if (typeof ITEMS !== 'undefined') window.ITEMS = ITEMS; } catch (_) {}
    try { if (typeof T !== 'undefined') window.T = T; } catch (_) {}
    try { if (typeof RELICS !== 'undefined') window.RELICS = RELICS; } catch (_) {}
    try { if (typeof rng !== 'undefined') window.rng = rng; } catch (_) {}
  }

  function addScore(points) {
    const pts = Math.max(0, Math.round(num(points)));
    if (!pts) return;
    meta.score += pts;
    saveBest();
    updateHud();
  }

  function addFlow(amount = 1) {
    meta.flow = clamp(meta.flow + amount, 0, 5);
    meta.flowClock = 3;
    updateHud();
  }

  function drainFlow(amount = 1) {
    meta.flow = clamp(meta.flow - amount, 0, 5);
    meta.flowClock = 3;
    updateHud();
  }

  function ensureUi() {
    if (!document.getElementById('crystal-plus-style')) {
      const style = document.createElement('style');
      style.id = 'crystal-plus-style';
      style.textContent = `
        #crystal-plus-hud{
          position:fixed; top:72px; right:14px; z-index:2147483000;
          display:flex; flex-direction:column; align-items:flex-end; gap:7px;
          pointer-events:none; font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
          text-shadow:0 1px 2px #000;
        }
        .cp-card{
          min-width:132px; padding:8px 10px; border:1px solid rgba(185,210,255,.22);
          border-radius:10px; background:rgba(7,9,18,.78); backdrop-filter:blur(8px);
          box-shadow:0 8px 24px rgba(0,0,0,.22);
        }
        .cp-row{display:flex;align-items:center;justify-content:space-between;gap:12px;color:#d8deee;font-size:10px;letter-spacing:.08em;text-transform:uppercase}
        .cp-row strong{font-size:12px;letter-spacing:.02em;color:#fff;font-weight:800}
        .cp-flowline{display:flex;align-items:center;gap:5px;margin-top:6px}
        .cp-pip{width:17px;height:4px;border-radius:999px;background:rgba(255,255,255,.12);box-shadow:inset 0 0 0 1px rgba(255,255,255,.04)}
        .cp-pip.on{background:linear-gradient(90deg,#72f6d1,#a98cff);box-shadow:0 0 10px rgba(114,246,209,.32)}
        #crystal-plus-toast{
          position:fixed; left:50%; top:98px; transform:translate(-50%,-8px); z-index:2147483001;
          padding:9px 13px; border-radius:9px; border:1px solid rgba(185,210,255,.24);
          background:rgba(7,9,18,.88); color:#fff; opacity:0; pointer-events:none;
          font:700 11px/1.2 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
          letter-spacing:.05em; text-align:center; transition:opacity .16s ease,transform .16s ease;
          box-shadow:0 10px 35px rgba(0,0,0,.3); white-space:nowrap;
        }
        #crystal-plus-toast.show{opacity:1;transform:translate(-50%,0)}
        #crystal-plus-toast small{display:block;margin-top:3px;color:#9ea8c2;font-size:9px;font-weight:600;letter-spacing:.03em}
        #crystal-plus-danger{
          position:fixed;inset:0;z-index:2147482998;pointer-events:none;opacity:0;
          box-shadow:inset 0 0 0 2px rgba(255,70,95,.5), inset 0 0 45px rgba(255,35,65,.16);
          transition:opacity .2s ease;
        }
        #crystal-plus-danger.on{opacity:1;animation:cpPulse 1.5s ease-in-out infinite}
        #crystal-plus-gameover{
          position:fixed;left:50%;bottom:34px;transform:translateX(-50%);z-index:2147483640;
          min-width:250px;padding:12px 16px;border-radius:12px;background:rgba(7,9,18,.94);
          border:1px solid rgba(185,210,255,.3);box-shadow:0 14px 50px rgba(0,0,0,.4);
          color:#eaf0ff;text-align:center;pointer-events:none;
          font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
        }
        #crystal-plus-gameover .label{font-size:9px;letter-spacing:.16em;text-transform:uppercase;color:#929db7}
        #crystal-plus-gameover .score{font-size:28px;line-height:1.1;font-weight:900;margin:3px 0 7px;color:#fff}
        #crystal-plus-gameover .best{font-size:10px;color:#aab3c9}
        #crystal-plus-gameover .newbest{color:#72f6d1;font-weight:800}
        .cp-impact{animation:cpImpact .13s ease-out}
        @keyframes cpImpact{0%{transform:translate(0,0)}25%{transform:translate(-3px,1px)}50%{transform:translate(3px,-1px)}75%{transform:translate(-1px,1px)}100%{transform:translate(0,0)}}
        @keyframes cpPulse{0%,100%{opacity:.35}50%{opacity:.9}}
        @media (max-width:760px){
          #crystal-plus-hud{top:58px;right:8px;gap:5px}.cp-card{min-width:112px;padding:6px 8px}.cp-pip{width:13px}
          #crystal-plus-toast{top:76px;max-width:82vw;white-space:normal}
        }
      `;
      document.head.appendChild(style);
    }

    if (!document.getElementById('crystal-plus-hud')) {
      const hud = document.createElement('div');
      hud.id = 'crystal-plus-hud';
      hud.innerHTML = `
        <div class="cp-card">
          <div class="cp-row"><span>Flow</span><strong id="cp-flow-value">0 / 5</strong></div>
          <div class="cp-flowline" id="cp-pips">${'<i class="cp-pip"></i>'.repeat(5)}</div>
        </div>
        <div class="cp-card">
          <div class="cp-row"><span>Run score</span><strong id="cp-score">0</strong></div>
          <div class="cp-row" style="margin-top:4px"><span>Best</span><strong id="cp-best" style="font-size:10px;color:#aab3c9">0</strong></div>
        </div>`;
      document.body.appendChild(hud);
    }

    if (!document.getElementById('crystal-plus-toast')) {
      const toast = document.createElement('div');
      toast.id = 'crystal-plus-toast';
      document.body.appendChild(toast);
    }

    if (!document.getElementById('crystal-plus-danger')) {
      const danger = document.createElement('div');
      danger.id = 'crystal-plus-danger';
      document.body.appendChild(danger);
    }
  }

  let toastTimer = 0;
  function toast(title, detail = '') {
    ensureUi();
    const el = document.getElementById('crystal-plus-toast');
    if (!el) return;
    el.innerHTML = `${title}${detail ? `<small>${detail}</small>` : ''}`;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 1250);
  }

  function updateHud() {
    ensureUi();
    const score = document.getElementById('cp-score');
    const best = document.getElementById('cp-best');
    const flow = document.getElementById('cp-flow-value');
    if (score) score.textContent = meta.score.toLocaleString();
    if (best) best.textContent = meta.best.toLocaleString();
    if (flow) flow.textContent = `${meta.flow} / 5`;
    document.querySelectorAll('#cp-pips .cp-pip').forEach((pip, i) => pip.classList.toggle('on', i < meta.flow));

    const p = getPlayer();
    const danger = document.getElementById('crystal-plus-danger');
    if (danger && p) danger.classList.toggle('on', num(p.hp) > 0 && num(p.hp) / Math.max(1, num(p.maxHp, 1)) <= 0.25);
  }

  function impact() {
    const target = document.querySelector('canvas') || document.querySelector('.canvas-wrap') || document.body;
    target.classList.remove('cp-impact');
    void target.offsetWidth;
    target.classList.add('cp-impact');
    setTimeout(() => target.classList.remove('cp-impact'), 170);
  }

  function roomBounds(r) {
    if (!r) return null;
    const x1 = num(r.x ?? r.x1, NaN);
    const y1 = num(r.y ?? r.y1, NaN);
    if (!Number.isFinite(x1) || !Number.isFinite(y1)) return null;
    const x2 = r.w != null ? x1 + num(r.w) : num(r.x2, NaN) + 1;
    const y2 = r.h != null ? y1 + num(r.h) : num(r.y2, NaN) + 1;
    if (!Number.isFinite(x2) || !Number.isFinite(y2)) return null;
    return { x1, y1, x2, y2 };
  }

  function pointInRoom(x, y, r) {
    const b = roomBounds(r);
    return !!b && x >= b.x1 && x < b.x2 && y >= b.y1 && y < b.y2;
  }

  function currentRoomInfo() {
    const g = getState();
    const p = getPlayer();
    if (!g || !p || !Array.isArray(g.rooms)) return null;
    let idx = -1;
    for (let i = 0; i < g.rooms.length; i++) {
      if (pointInRoom(p.x, p.y, g.rooms[i])) { idx = i; break; }
    }
    if (idx < 0) return null;
    return { idx, room: g.rooms[idx], key: `${num(g.floor, 1)}:${idx}` };
  }

  function livingEnemiesInRoom(room) {
    const g = getState();
    if (!g || !Array.isArray(g.enemies)) return 0;
    return g.enemies.reduce((count, e) => count + ((e && num(e.hp) > 0 && pointInRoom(e.x, e.y, room)) ? 1 : 0), 0);
  }

  function markRoomDamage() {
    const info = currentRoomInfo();
    if (!info) return;
    const rec = meta.rooms[info.key] || (meta.rooms[info.key] = { armed: false, cleared: false, hurt: false });
    rec.hurt = true;
  }

  function processRoom() {
    const info = currentRoomInfo();
    const p = getPlayer();
    if (!info || !p) return;

    const rec = meta.rooms[info.key] || (meta.rooms[info.key] = { armed: false, cleared: false, hurt: false });
    const living = livingEnemiesInRoom(info.room);
    if (living > 0) rec.armed = true;

    if (!rec.armed || rec.cleared || info.key === meta.spawnRoomKey || living > 0) return;
    rec.cleared = true;

    const clean = !rec.hurt;
    const heal = clean ? 2 : 1;
    const mana = clean ? 2 : 1;
    const oldHp = num(p.hp), oldMp = num(p.mp);
    p.hp = Math.min(num(p.maxHp, oldHp), oldHp + heal);
    p.mp = Math.min(num(p.maxMp, oldMp), oldMp + mana);

    const reward = clean ? 65 : 40;
    addScore(reward);
    addFlow(1);
    toast('ROOM SECURED', `${clean ? 'Clean clear' : 'Clear'} · +${Math.max(0, p.hp - oldHp)} HP · +${Math.max(0, p.mp - oldMp)} MP · +${reward}`);
  }

  function resetRun() {
    meta.score = 0;
    meta.flow = 0;
    meta.flowClock = 3;
    meta.skipDecay = false;
    meta.rooms = Object.create(null);
    meta.floor = num(getState()?.floor, 1);
    meta.started = true;
    meta.gameOverShown = false;
    meta.best = readBest();
    meta.startBest = meta.best;

    const oldSummary = document.getElementById('crystal-plus-gameover');
    if (oldSummary) oldSummary.remove();
    setTimeout(() => {
      const info = currentRoomInfo();
      meta.spawnRoomKey = info ? info.key : null;
      updateHud();
    }, 0);
  }

  function showGameOverSummary() {
    if (meta.gameOverShown) return;
    meta.gameOverShown = true;
    const newBest = meta.score > meta.startBest;
    saveBest();

    const box = document.createElement('div');
    box.id = 'crystal-plus-gameover';
    box.innerHTML = `
      <div class="label">Run score</div>
      <div class="score">${meta.score.toLocaleString()}</div>
      <div class="best ${newBest ? 'newbest' : ''}">${newBest ? 'NEW BEST' : `Best ${meta.best.toLocaleString()}`}</div>`;
    document.body.appendChild(box);
  }

  function hookFunction(name, wrapperFactory) {
    try {
      const original = window[name];
      if (typeof original !== 'function' || original.__crystalPlusWrapped) return false;
      const wrapped = wrapperFactory(original);
      wrapped.__crystalPlusWrapped = true;
      window[name] = wrapped;
      return true;
    } catch (_) { return false; }
  }

  function installHooks() {
    exposeGlobals();

    hookFunction('initGame', original => function(...args) {
      const result = original.apply(this, args);
      exposeGlobals();
      resetRun();
      return result;
    });

    hookFunction('getStats', original => function(...args) {
      const s = original.apply(this, args) || {};
      const f = meta.flow;
      s.crit = Math.min(0.75, num(s.crit) + f * 0.03);
      if (f >= 3) s.atk = num(s.atk) + 1;
      if (f >= 5) s.dodge = Math.min(0.65, num(s.dodge) + 0.08);
      return s;
    });

    hookFunction('killEnemy', original => function(enemy, ...rest) {
      const p = getPlayer();
      const killsBefore = num(p?.kills);
      const alreadyCounted = !!(enemy && enemy.__crystalPlusCounted);
      const isBoss = !!(enemy && (enemy.boss || enemy.isBoss || enemy.bossType || enemy.type === 'boss'));
      const isElite = !!(enemy && (enemy.elite || enemy.isElite || enemy.eliteType || enemy.miniboss));
      const result = original.call(this, enemy, ...rest);
      const killsAfter = num(getPlayer()?.kills);
      const died = !alreadyCounted && (killsAfter > killsBefore || num(enemy?.hp) <= 0);

      if (died) {
        try { enemy.__crystalPlusCounted = true; } catch (_) {}
        meta.skipDecay = true;
        addFlow(1);
        const floor = num(getState()?.floor, 1);
        let points = 30 + floor * 5 + (isElite ? 65 : 0) + (isBoss ? 230 : 0);
        points = Math.round(points * (1 + meta.flow * 0.12));
        addScore(points);
        if (isBoss) toast('BOSS DOWN', `+${points.toLocaleString()} score`);
      }
      return result;
    });

    hookFunction('endTurn', original => function(...args) {
      const p = getPlayer();
      const hpBefore = num(p?.hp);
      const result = original.apply(this, args);
      exposeGlobals();

      const hpAfter = num(getPlayer()?.hp);
      if (hpAfter < hpBefore) {
        markRoomDamage();
        if (meta.flow > 0) drainFlow(2);
        impact();
      }

      if (meta.skipDecay) {
        meta.skipDecay = false;
      } else if (meta.flow > 0) {
        meta.flowClock -= 1;
        if (meta.flowClock <= 0) drainFlow(1);
      }

      processRoom();
      updateHud();
      return result;
    });

    hookFunction('generateFloor', original => function(depth, ...args) {
      const before = num(getState()?.floor, meta.floor || 1);
      const result = original.call(this, depth, ...args);
      exposeGlobals();
      const after = num(getState()?.floor, num(depth, before));

      if (meta.started && after > before) {
        const points = 110 + after * 30;
        addScore(points);
        toast(`DEPTH ${after}`, `+${points.toLocaleString()} score`);
      }

      meta.floor = after;
      meta.rooms = Object.create(null);
      setTimeout(() => {
        const info = currentRoomInfo();
        meta.spawnRoomKey = info ? info.key : null;
        updateHud();
      }, 0);
      return result;
    });

    hookFunction('doGameOver', original => function(...args) {
      const result = original.apply(this, args);
      setTimeout(showGameOverSummary, 0);
      return result;
    });
  }

  meta.best = readBest();
  ensureUi();
  exposeGlobals();
  installHooks();

  if (getPlayer()) {
    meta.started = true;
    meta.floor = num(getState()?.floor, 1);
    const info = currentRoomInfo();
    meta.spawnRoomKey = info ? info.key : null;
  }

  setInterval(() => {
    exposeGlobals();
    updateHud();
  }, 750);

  updateHud();
  console.info(`[Crystal Caverns Plus] v${VERSION} active`);
})();
