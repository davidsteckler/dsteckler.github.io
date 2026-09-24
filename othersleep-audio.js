/* THE OTHER SLEEP: two original procedural scores, generated entirely with Web Audio.
   No samples, MP3 files, audio dependencies, or network calls. */
(function (global) {
  'use strict';
  var A = null, master = null, music = null, fx = null, limiter = null;
  var buses = {}, noiseBuffer = null, timer = null, enabled = false, unlocked = false;
  var world = 'city', danger = 1, step = 0, nextBeat = 0, musicLevel = .75, fxLevel = .85;
  var lastWorld = 'city', switching = false, suspendToken = 0;
  var TAU = Math.PI * 2;
  var cityHarmony = [
    [50, 62, 65, 69, 76],  // Dm(add9)
    [46, 58, 62, 65, 69],  // Bbmaj7
    [43, 55, 58, 62, 69],  // Gm(add9)
    [45, 57, 62, 64, 67]   // Asus4
  ];
  var wildHarmony = [
    [50, 62, 65, 69, 72],  // Dm7
    [43, 55, 59, 62, 69],  // Gadd9
    [41, 53, 57, 60, 64],  // Fmaj7
    [48, 60, 64, 67, 74]   // Cadd9
  ];
  // The four-note dream motif appears in both lives, in different instruments.
  var cityTheme = [74, 77, 76, 69, 74, 72, 69, 65];
  var wildTheme = [74, 77, 76, 69, 72, 76, 77, 81];

  function midi(n) { return 440 * Math.pow(2, (n - 69) / 12); }
  function when(t) { return Math.max(A.currentTime + .002, t || A.currentTime + .002); }
  function busFor(w) { return buses[w] || music; }
  function envelope(node, t, peak, attack, length, release) {
    var g = node.gain, end = Math.max(t + attack + .015, t + length);
    g.cancelScheduledValues(t);
    g.setValueAtTime(.00001, t);
    g.exponentialRampToValueAtTime(Math.max(.000011, peak), t + Math.max(.005, attack));
    g.setTargetAtTime(.00001, end, Math.max(.025, release / 3));
    return end + Math.max(.12, release * 3);
  }
  function tone(m, t, d, dest, opts) {
    if (!A) return;
    opts = opts || {};
    t = when(t);
    var o = A.createOscillator(), amp = A.createGain();
    var tail = envelope(amp, t, opts.vol || .045, opts.atk || .01, d, opts.rel || .24);
    var output = amp;
    if (opts.filter) {
      var filter = A.createBiquadFilter();
      filter.type = opts.filterType || 'lowpass';
      filter.frequency.value = opts.filter;
      filter.Q.value = opts.q || .7;
      o.connect(filter); filter.connect(amp);
    } else o.connect(amp);
    if (opts.pan && A.createStereoPanner) {
      var pan = A.createStereoPanner();
      pan.pan.setValueAtTime(opts.pan, t);
      output.connect(pan); pan.connect(dest);
    } else output.connect(dest);
    o.type = opts.wave || 'sine';
    o.frequency.setValueAtTime(typeof m === 'number' && m < 130 ? midi(m) : m, t);
    if (opts.to) o.frequency.exponentialRampToValueAtTime(Math.max(25, opts.to), t + Math.max(.025, d));
    if (opts.detune) o.detune.value = opts.detune;
    o.start(t); o.stop(tail + .03);
  }
  function noise(t, d, dest, opts) {
    if (!A) return;
    opts = opts || {};
    t = when(t);
    var source = A.createBufferSource(), f = A.createBiquadFilter(), g = A.createGain();
    source.buffer = noiseBuffer; source.loop = true; f.type = opts.type || 'bandpass';
    f.frequency.setValueAtTime(opts.freq || 1100, t);
    f.Q.value = opts.q || .65;
    source.connect(f); f.connect(g); g.connect(dest);
    var tail = envelope(g, t, opts.vol || .034, opts.atk || .005, d, opts.rel || .09);
    source.start(t, (Math.random() * 1.1)); source.stop(Math.min(tail + .02, t + 1.8));
  }
  function pad(chord, t, w, vol) {
    var dest = busFor(w);
    for (var i = 1; i < chord.length; i++) {
      var n = chord[i] - (i === 4 ? 12 : 0);
      tone(n, t, w === 'city' ? 2.35 : 2.05, dest,
           {wave:'triangle',vol:vol * (i === 4 ? .55 : 1),atk:.48,rel:1.1,filter:w === 'city' ? 720 : 1050,detune:i % 2 ? -4 : 5,pan:i % 2 ? -.32 : .35});
    }
    // The distant second oscillator gives the planet its long, uneasy sky.
    tone(chord[1] - 12, t + .03, 2.9, dest,
         {wave:'sine',vol:vol * .72,atk:.8,rel:1.4,detune:6});
  }
  function pluck(n, t, w, vol, long) {
    var dest = busFor(w), isWild = w === 'wild';
    tone(n, t, long ? .38 : .19, dest,
         {wave:isWild ? 'sine' : 'triangle',vol:vol,atk:.006,rel:isWild ? .24 : .47,
          filter:isWild ? 2300 : 1400,pan:isWild ? -.23 : .18});
    tone(n + 12, t + .004, .085, dest,
         {wave:isWild ? 'triangle':'sine',vol:vol * (isWild ? .19 : .26),atk:.006,rel:.1,
          filter:isWild ? 3000 : 1700,pan:isWild ? .2 : -.18});
  }
  function kick(t, dest, strength, wild) {
    t = when(t);
    var o = A.createOscillator(), g = A.createGain();
    o.type = wild ? 'sine' : 'triangle';
    o.frequency.setValueAtTime(wild ? 124 : 106,t);
    o.frequency.exponentialRampToValueAtTime(wild ? 49 : 43,t+.18);
    o.connect(g);g.connect(dest);
    envelope(g,t,strength || .065,.006,.10,.15);
    o.start(t);o.stop(t+.55);
    if (wild) noise(t+.009,.025,dest,{freq:250,type:'lowpass',vol:.013,rel:.09});
  }
  function tick(t, dest, wild, vol) {
    if (wild) noise(t,.018,dest,{freq:3400,q:1.2,vol:vol || .018,rel:.035});
    else {
      tone(89,t,.035,dest,{wave:'sine',vol:vol || .012,atk:.002,rel:.065,filter:3700,pan:-.55});
      noise(t,.01,dest,{freq:1700,q:2,vol:.008,rel:.02});
    }
  }
  function cityBeat(i, t, rising) {
    var beat = i % 8, bar = (i >> 3) % 4, chord = cityHarmony[bar];
    var tension = danger >= 6, extreme = danger >= 9;
    if (!beat) {
      pad(chord,t,'city',tension ? .027 : .023);
      tone(chord[0],t,.42,buses.city,{wave:'sine',vol:.095,atk:.02,rel:.28,filter:180});
      kick(t,buses.city,.055,false);
    }
    if (beat === 4) { kick(t,buses.city,tension ? .055 : .032,false);
      if (tension) noise(t,.038,buses.city,{freq:620,vol:.024,rel:.06});
    }
    if (beat % 2 === 1 || tension) tick(t,buses.city,false,tension ? .016 : .011);
    if (beat === 1 || beat === 3 || beat === 6) {
      var arp = [1,2,3,2,1,4,3,2][(beat + bar) % 8];
      pluck(chord[arp] + (arp === 4 ? 0 : 12),t,'city',.021,false);
    }
    if ((beat === 0 || beat === 3 || beat === 5) && bar % 2 === 0) {
      var note = cityTheme[(bar * 2 + (beat === 0 ? 0 : beat === 3 ? 1 : 2)) % cityTheme.length];
      pluck(note,t+.045,'city',.034,true);
    }
    if (extreme && (beat === 2 || beat === 6)) {
      tone(57,t,.14,buses.city,{wave:'sawtooth',vol:.012,atk:.025,rel:.12,filter:540,pan:-.3});
    }
  }
  function wildBeat(i, t) {
    var beat = i % 8, bar = (i >> 3) % 4, chord = wildHarmony[bar];
    var tension = danger >= 6;
    if (!beat) {
      pad(chord,t,'wild',tension ? .028 : .024);
      tone(chord[0],t,.48,buses.wild,{wave:'sine',vol:.065,atk:.015,rel:.35,filter:290});
      kick(t,buses.wild,.055,true);
    }
    if (beat === 5) kick(t,buses.wild,.035,true);
    if (beat === 2 || beat === 4 || (tension && beat % 2)) tick(t,buses.wild,true,tension ? .016 : .011);
    if ([0,2,3,5,7].indexOf(beat) !== -1) {
      var arp=[1,3,2,4,3,1,2,4][(beat+bar)%8];
      pluck(chord[arp] + 12,t+(beat===7?.016:0),'wild',beat===0?.043:.033,true);
    }
    if ((beat===1 || beat===5) && (bar===0 || bar===2)) {
      var melody = wildTheme[(bar * 2 + (beat===1?0:1)) % wildTheme.length];
      pluck(melody,t+.035,'wild',.045,true);
    }
    // Small organic calls emerge from the canopy; faster when a hunter draws near.
    if ((i % (tension ? 13 : 23)) === 11) {
      tone(88,t,.11,buses.wild,{wave:'sine',vol:.013,atk:.015,rel:.14,to:1340,pan:.65});
      tone(91,t+.1,.08,buses.wild,{wave:'sine',vol:.009,atk:.008,rel:.09,pan:.65});
    }
  }
  function sequencer() {
    if (!enabled || !A || A.state !== 'running' || document.hidden) return;
    var now = A.currentTime, sec = 60 / (world === 'city' ? 78 : 96) / 2;
    if (nextBeat < now - .12) nextBeat = now + .035;
    var iterations = 0;
    while (nextBeat < now + .2 && iterations++ < 5) {
      if (world === 'city') cityBeat(step,nextBeat);
      else wildBeat(step,nextBeat);
      step++; nextBeat += sec;
    }
  }
  function ambience(w) {
    var src=A.createBufferSource(), f=A.createBiquadFilter(), a=A.createGain();
    src.buffer=noiseBuffer;src.loop=true;
    f.type=w==='city'?'bandpass':'lowpass';
    f.frequency.value=w==='city'?370:530;
    f.Q.value=w==='city'?.5:.42;
    a.gain.value=w==='city'?.009:.018;
    src.connect(f);f.connect(a);a.connect(buses[w]);
    src.start();return src;
  }
  function build() {
    if (A) return true;
    var Audio = global.AudioContext || global.webkitAudioContext;
    if (!Audio) return false;
    try {
      A = new Audio({latencyHint:'interactive'});
      master=A.createGain();limiter=A.createDynamicsCompressor();
      limiter.threshold.value=-18;limiter.knee.value=20;limiter.ratio.value=3.1;limiter.attack.value=.005;limiter.release.value=.26;
      master.connect(limiter);limiter.connect(A.destination);
      music=A.createGain();fx=A.createGain();music.connect(master);fx.connect(master);
      music.gain.value=musicLevel*.7;fx.gain.value=fxLevel*.8;
      buses.city=A.createGain();buses.wild=A.createGain();
      buses.city.connect(music);buses.wild.connect(music);
      buses.city.gain.value=world==='city'?1:.00001;
      buses.wild.gain.value=world==='wild'?1:.00001;
      var length=Math.ceil(A.sampleRate*2);
      noiseBuffer=A.createBuffer(1,length,A.sampleRate);
      var data=noiseBuffer.getChannelData(0), last=0;
      for(var i=0;i<length;i++){var white=Math.random()*2-1;last=(last+.02*white)/1.012;data[i]=Math.max(-.7,Math.min(.7,last*.72+white*.22));}
      ambience('city');ambience('wild');
      master.gain.value=.00001;
      return true;
    } catch(err){global.console && console.warn('Audio unavailable:',err);return false;}
  }
  function enable(w) {
    if (w === 'city' || w === 'wild') world=w;
    if (!build()) return false;
    enabled=true;
    ++suspendToken;
    music.gain.setTargetAtTime(musicLevel*.7,A.currentTime,.15);
    try { var p=A.resume();if(p&&p.catch)p.catch(function(){}); } catch(err){}
    unlocked=true;
    master.gain.cancelScheduledValues(A.currentTime);
    master.gain.setTargetAtTime(.74,A.currentTime,.32);
    buses.city.gain.setTargetAtTime(world==='city'?1:.00001,A.currentTime,.28);
    buses.wild.gain.setTargetAtTime(world==='wild'?1:.00001,A.currentTime,.28);
    nextBeat=A.currentTime+.04;
    if (!timer)timer=global.setInterval(sequencer,80);
    sequencer();
    return true;
  }
  function disable() {
    enabled=false;
    if (timer){global.clearInterval(timer);timer=null;}
    var token=++suspendToken;
    if(A){
      master.gain.cancelScheduledValues(A.currentTime);
      master.gain.setTargetAtTime(.00001,A.currentTime,.075);
      // Suspending the graph keeps a muted phone from wasting battery on ambience.
      global.setTimeout(function(){
        if(token!==suspendToken||enabled)return;
        var promise=A.suspend();if(promise&&promise.catch)promise.catch(function(){});
      },260);
    }
  }
  function endScore(){
    if(!A||!enabled)return;
    if(timer){global.clearInterval(timer);timer=null;}
    music.gain.cancelScheduledValues(A.currentTime);
    music.gain.setTargetAtTime(.00001,A.currentTime,.38);
  }
  function setWorld(w,d) {
    if (d !== undefined)setDanger(d);
    if (w!=='city'&&w!=='wild')return;
    if (world===w) return;
    lastWorld=world;world=w;step=0;
    if (!A || !enabled)return;
    var t=A.currentTime;
    buses[w].gain.cancelScheduledValues(t);
    buses[w].gain.setTargetAtTime(1,t+.03,.55);
    buses[lastWorld].gain.cancelScheduledValues(t);
    buses[lastWorld].gain.setTargetAtTime(.00001,t,.48);
    nextBeat=t+.18;
  }
  function setDanger(d) { danger=Math.max(0,Math.min(12,+d||0)); }
  function setLevels(m,f) {
    if (m!==undefined)musicLevel=Math.max(0,Math.min(1,+m));
    if (f!==undefined)fxLevel=Math.max(0,Math.min(1,+f));
    if (A){music.gain.setTargetAtTime(musicLevel*.7,A.currentTime,.04);fx.gain.setTargetAtTime(fxLevel*.8,A.currentTime,.04);}
  }
  function sfx(name,details) {
    if (!enabled || !A || !unlocked)return;
    details=details||{};
    var t=A.currentTime+.012, w=details.world||world, heavy=!!details.heavy;
    var dest=fx;
    if (name==='card'||name==='draw') {
      noise(t,.032,dest,{freq:1900,type:'highpass',vol:.034,rel:.045});
      noise(t+.044,.027,dest,{freq:2800,type:'highpass',vol:.027,rel:.036});
    } else if (name==='attack') {
      noise(t,.09,dest,{freq:w==='city'?2300:1100,vol:.065,rel:.09});
      tone(heavy?68:74,t,.105,dest,{wave:'triangle',vol:.07,atk:.003,rel:.10,to:heavy?70:115});
      tone(45,t+.045,.13,dest,{wave:'sine',vol:heavy?.12:.077,atk:.004,rel:.13,to:48});
      if (heavy)noise(t+.065,.19,dest,{freq:260,vol:.064,rel:.18});
    } else if (name==='block') {
      noise(t,.075,dest,{freq:460,type:'lowpass',vol:.046,rel:.1});
      tone(50,t,.12,dest,{wave:'triangle',vol:.066,atk:.007,rel:.15,to:90});
    } else if (name==='stealth') {
      noise(t,.2,dest,{freq:460,type:'lowpass',vol:.044,atk:.035,rel:.18});
      tone(57,t,.24,dest,{wave:'sine',vol:.033,atk:.06,rel:.22,to:110});
    } else if (name==='heal') {
      [74,77,81].forEach(function(n,i){pluckFx(n,t+i*.1,.17,.066);});
    } else if (name==='echo') {
      [74,69,77,81].forEach(function(n,i){
        tone(n,t+i*.15,.25,dest,{wave:'sine',vol:.026,atk:.02,rel:.39,pan:i%2?.65:-.65});
      });
    } else if (name==='sleep') {
      noise(t,.7,dest,{freq:560,type:'lowpass',vol:.045,atk:.13,rel:.5});
      [69,74,77,81].forEach(function(n,i){
        tone(n,t+.045+i*.17,.28,dest,{wave:'sine',vol:.049,atk:.07,rel:.58,pan:i%2?.5:-.5});
      });
      tone(50,t,.85,dest,{wave:'triangle',vol:.085,atk:.09,rel:.6,to:48});
    } else if (name==='damage'||name==='hazard') {
      noise(t,.17,dest,{freq:details.world==='wild'?290:560,type:'lowpass',vol:.085,rel:.23});
      tone(50,t,.18,dest,{wave:'sawtooth',vol:.055,atk:.01,rel:.20,filter:440,to:64});
      tone(45,t+.12,.27,dest,{wave:'sine',vol:.05,atk:.025,rel:.25,filter:230});
    } else if (name==='defeat') {
      [74,77,81,86].forEach(function(n,i){pluckFx(n,t+i*.085,.22,.066);});
      tone(50,t,.50,dest,{wave:'sine',vol:.08,atk:.035,rel:.49});
    } else if (name==='reward') {
      [74,81,77,86].forEach(function(n,i){pluckFx(n,t+i*.12,.22,.065);});
    } else if (name==='victory'||name==='win') {
      var victory=[62,65,69,74,77,81];
      victory.forEach(function(n,i){
        tone(n,t+i*.18,1.28,dest,{wave:'triangle',vol:.047,atk:.04,rel:1.2,detune:i%2?3:-3,pan:i%2?.35:-.35});
      });
    } else if (name==='failure') {
      [62,60,57,50].forEach(function(n,i){
        tone(n,t+i*.24,.49,dest,{wave:'triangle',vol:.061,atk:.03,rel:.52,filter:650});
      });
    } else {
      pluckFx(74,t,.16,.04);
    }
  }
  function pluckFx(n,t,d,vol){
    tone(n,t,d,fx,{wave:'sine',vol:vol,atk:.006,rel:.35});
    tone(n+12,t+.004,.072,fx,{wave:'triangle',vol:vol*.22,atk:.004,rel:.11});
  }
  // App lifecycle: sound is opt-in, pauses in a hidden browser tab, and resumes gently.
  if (global.document) document.addEventListener('visibilitychange',function(){
    if (!A || !enabled)return;
    if (document.hidden){
      if(timer){global.clearInterval(timer);timer=null;}
      master.gain.setTargetAtTime(.00001,A.currentTime,.08);
      var p=A.suspend();if(p&&p.catch)p.catch(function(){});
    } else {
      var p=A.resume();if(p&&p.catch)p.catch(function(){});
      nextBeat=A.currentTime+.08;
      master.gain.setTargetAtTime(.74,A.currentTime,.25);
      if(!timer)timer=global.setInterval(sequencer,80);
    }
  });
  global.OtherSleepAudio={
    enable:enable,disable:disable,endScore:endScore,setWorld:setWorld,setDanger:setDanger,
    setLevels:setLevels,sfx:sfx,isEnabled:function(){return enabled;},
    status:function(){return {enabled:enabled,world:world,danger:danger,music:musicLevel,sfx:fxLevel,context:A&&A.state};}
  };
})(window);
