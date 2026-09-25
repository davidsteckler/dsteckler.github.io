/* THE OTHER SLEEP — ORIGINAL CINEMATIC SCORES, composed & synthesized in-browser.
   Cael: 72 BPM noir/analog strings, distant felt-piano, muted heartbeat, rain.
   Ilyra: 91 BPM organic marimba, hand drums, soft choir, living forest.
   8-bar evolving harmony per world, original leitmotif, reactive enemy tension.
   The same four descending notes migrate between both planets. No samples or downloads. */
(function(win){'use strict';
let A=null,master=null,compressor=null,lowpass=null,rev=null,wet=null,music=null,fx=null,city=null,wild=null,noiseBuffer=null,ambienceNodes=[],
 enabled=false,world='city',danger=1,step=0,next=0,timer=null,mutedTimer=null,suspendToken=0,musicVolume=.62,fxVolume=.82,mode='score',lastBar=-1;
const TAU=Math.PI*2;
const score={
 city:{bpm:72,voicings:[
 {root:38,notes:[50,57,60,64,69]}, // Dm9
 {root:34,notes:[46,53,57,60,65]}, // Bbmaj7
 {root:41,notes:[53,57,60,64,69]}, // Fmaj7
 {root:36,notes:[48,55,60,62,67]}, // Cadd9
 {root:38,notes:[50,57,60,64,69]},
 {root:31,notes:[43,50,57,58,65]}, // Gm9
 {root:34,notes:[46,53,57,62,65]},
 {root:33,notes:[45,52,57,62,64]}  // Asus4add9
 ],motif:[null,69,null,72,74,null,72,69,null,67,65,null,69,72,null,65],melody:[74,null,72,69,null,null,65,null,69,72,null,74,77,null,74,72]},
 wild:{bpm:91,voicings:[
 {root:38,notes:[50,57,62,65,69]}, // Dm(add9)
 {root:31,notes:[43,50,55,59,62]}, // Gmaj9
 {root:41,notes:[53,57,60,64,69]}, // Fmaj7
 {root:36,notes:[48,55,60,64,67]}, // Cmaj9
 {root:38,notes:[50,57,62,65,69]},
 {root:34,notes:[46,53,57,60,65]},
 {root:43,notes:[55,62,65,69,72]},
 {root:33,notes:[45,52,57,60,64]}
 ],motif:[null,74,77,null,76,69,null,72,74,null,81,79,77,null,74,null],melody:[74,77,null,81,null,79,77,null,76,null,74,72,69,null,72,null]}}
function midi(n){return 440*Math.pow(2,(n-69)/12)}
function param(v=0){return v}
function env(g,t,a,decay,peak,sustain,release){g.cancelScheduledValues(t);g.setValueAtTime(.00001,t);g.exponentialRampToValueAtTime(Math.max(.000011,peak),t+Math.max(.003,a));g.setTargetAtTime(Math.max(.000011,sustain),t+Math.max(.005,a+decay),.09);g.setTargetAtTime(.00001,t+Math.max(.02,a+decay+release),Math.max(.04,release*.32));return t+a+decay+release*3.5}
function connect(dest,pan){let g=A.createGain();if(typeof pan==='number'&&A.createStereoPanner){let p=A.createStereoPanner();p.pan.value=pan;g.connect(p);p.connect(dest)}else g.connect(dest);return g}
function osc(n,t,d,dest,o={}){if(!A)return;t=Math.max(t,A.currentTime+.001);let generator=A.createOscillator(),v=connect(dest,o.pan),source=generator;
 if(o.cutoff){let lp=A.createBiquadFilter();lp.type='lowpass';lp.frequency.setValueAtTime(o.cutoff,t);if(o.sweep)lp.frequency.exponentialRampToValueAtTime(Math.max(150,o.sweep),t+d);lp.Q.value=o.q||.55;generator.connect(lp);source=lp;lp.connect(v)}else generator.connect(v);
 let a=o.attack===undefined?.025:o.attack,r=o.release===undefined?.32:o.release;let end=env(v.gain,t,a,Math.max(.005,d*.4),o.vol||.03,o.sustain||.00001,r);generator.type=o.wave||'sine';generator.frequency.setValueAtTime(n>140?n:midi(n),t);if(o.bend)generator.frequency.exponentialRampToValueAtTime(Math.max(25,o.bend),t+Math.max(.03,d));if(o.detune)generator.detune.setValueAtTime(o.detune,t);generator.start(t);generator.stop(end+.1)}
function sweepNoise(t,d,dest,o={}){if(!noiseBuffer)return;t=Math.max(A.currentTime+.002,t);let b=A.createBufferSource(),f=A.createBiquadFilter(),v=connect(dest,o.pan);
 b.buffer=noiseBuffer;b.loop=true;f.type=o.type||'bandpass';f.frequency.setValueAtTime(o.freq||920,t);if(o.to)f.frequency.exponentialRampToValueAtTime(o.to,t+Math.max(.035,d));f.Q.value=o.q||.55;b.connect(f);f.connect(v);
 let end=env(v.gain,t,o.attack===undefined?.01:o.attack,d*.15,o.vol||.02,.00001,o.release===undefined?Math.max(.06,d*.7):o.release);b.start(t,Math.random());b.stop(Math.min(t+3.3,end+.04))}
function mallet(n,t,dest,vol=.044,pan=0,w='wild'){
 osc(n,t,.42,dest,{wave:'sine',vol,attack:.003,release:.6,pan});
 osc(n+12,t+.002,.14,dest,{wave:'triangle',vol:vol*(w==='wild'?.19:.11),attack:.004,release:.24,pan,cutoff:w==='wild'?2600:1350});
 osc(n+19,t+.004,.09,dest,{wave:'sine',vol:vol*.07,attack:.002,release:.11,pan});
}
function stringPad(chord,t,dest,w,soft=.024){let notes=chord.notes,voicing=w==='city'?[0,1,2,3]:[0,1,2,4];
 for(let k of voicing){let n=notes[k],pan=[-.5,.38,-.22,.54][k]||0;
   osc(n,t+(k*.13),2.6,dest,{wave:w==='city'?'sawtooth':'triangle',cutoff:w==='city'?400:820,attack:w==='city'?1.3:1.0,release:1.8,vol:soft*(k===0?.95:.62),sustain:soft*.48,detune:k%2?-5:3,pan});
   if(k===2)osc(n+12,t+.12,2.1,dest,{wave:'sine',attack:1.5,release:1.2,vol:soft*.32,sustain:soft*.16,pan:-.25});
 }
}
function bass(n,t,dest,w,intense){osc(n,t,.55,dest,{wave:'sine',vol:(w==='city'?.11:.085)*(intense?1.16:1),attack:.026,release:.4,pan:-.05});osc(n+12,t,.38,dest,{wave:'triangle',vol:.018,attack:.02,release:.25,cutoff:350})}
function drum(t,dest,w,hard=false){let n=A.createOscillator(),v=connect(dest,-.12),peak=w==='city'?.095:.083;
 n.type='sine';n.frequency.setValueAtTime(w==='city'?106:138,t);n.frequency.exponentialRampToValueAtTime(w==='city'?48:53,t+.19);
 n.connect(v);let stop=env(v.gain,t,.006,.065,peak*(hard?1.1:1),.00001,.18);n.start(t);n.stop(stop+.025);
 if(w==='wild')sweepNoise(t+.009,.045,dest,{type:'lowpass',freq:450,vol:.009,release:.12});
}
function softPerc(t,dest,w,heavy=false){sweepNoise(t,.036,dest,{freq:w==='city'?1800:810,type:w==='city'?'bandpass':'lowpass',q:1.1,vol:w==='city'?(heavy?.021:.011):(heavy?.032:.015),attack:.003,release:w==='city'?.07:.14,pan:w==='city'?.44:-.45})}
function scene(w,i,t){let track=score[w],beat=i%8,bar=Math.floor(i/8),chord=track.voicings[bar%8],tension=danger>=6,crisis=danger>=9,dest=w==='city'?city:wild;
 if(beat===0){stringPad(chord,t,dest,w,mode==='ambient'?.019:tension?.022:.018);bass(chord.root,t,dest,w,tension);if(mode!=='ambient')drum(t,dest,w)}
 if(mode==='ambient'){if(beat===4&&bar%2===0)mallet(chord.notes[2]+12,t,dest,.018,.42,w);return}
 if(w==='city'){
  if(beat===4&&bar%2===0)drum(t,dest,w);
  if(beat===2||beat===6)softPerc(t,dest,w,tension);
  if((beat===1||beat===5)&&bar%2===1)softPerc(t,dest,w,false);
  if([1,3,6].includes(beat)){let arp=[2,3,4,3,1,2,4,2][(beat+bar)%8];mallet(chord.notes[arp]+(arp===4?0:12),t,dest,.024,beat===6?.45:-.33,w)}
  let note=track.motif[(bar*2+beat)%track.motif.length];if(note!==null&&(beat===0||beat===3||beat===5)&&bar%2===0)mallet(note,t+.04,dest,.026,-.35,w);
  if(bar%4===3&&beat===6){let high=track.melody[(bar*2+beat)%track.melody.length];if(high)mallet(high,t+.06,dest,.026,.25,w)}
 } else {
  if(beat===5)drum(t,dest,w,bar%2===1);
  if([2,4,7].includes(beat))softPerc(t,dest,w,beat===4);
  if(beat===0||beat===3||beat===5||beat===7){let arp=[0,2,4,2,3,1,4,3][(beat+bar)%8];mallet(chord.notes[arp]+(beat===7?12:0),t,dest,beat===0?.043:.035,[-.35,.33,-.17,.5][beat%4],w)}
  let n=track.motif[(bar*2+beat)%track.motif.length];if(n!==null&&bar%2===0&&(beat===1||beat===5))mallet(n,t+.035,dest,.027,-.42,w);
  if((i%29)===11){osc(90,t,.13,dest,{wave:'sine',vol:.01,attack:.025,release:.25,bend:800,pan:.67});osc(93,t+.13,.1,dest,{wave:'sine',vol:.008,attack:.02,release:.18,pan:.63});}
 }
 if(tension){if(beat===2||beat===6)drum(t,dest,w,true);if(beat===3||beat===7)softPerc(t,dest,w,true)}
 if(crisis){if(beat===1||beat===5)osc(chord.root+12,t,.25,dest,{wave:'triangle',vol:.022,cutoff:500,attack:.02,release:.18,pan:.26})}
}
function schedule(){if(!A||!enabled||A.state!=='running'||document.hidden)return;let t=A.currentTime,seconds=60/(score[world].bpm*2),i=0;if(next<t-.1)next=t+.025;while(next<t+.2&&i++<7){scene(world,step,next);step++;next+=seconds}}
function ambience(w){let b=A.createBufferSource(),f=A.createBiquadFilter(),v=A.createGain();b.buffer=noiseBuffer;b.loop=true;f.type=w==='city'?'lowpass':'bandpass';f.frequency.value=w==='city'?240:740;f.Q.value=.42;v.gain.value=w==='city'?.015:.008;b.connect(f);f.connect(v);v.connect(w==='city'?city:wild);b.start();ambienceNodes.push(b)}
function build(){if(A)return true;let Audio=win.AudioContext||win.webkitAudioContext;if(!Audio)return false;
 try{A=new Audio({latencyHint:'interactive'});master=A.createGain();lowpass=A.createBiquadFilter();lowpass.type='lowpass';lowpass.frequency.value=8000;compressor=A.createDynamicsCompressor();compressor.threshold.value=-13;compressor.knee.value=19;compressor.ratio.value=2.7;compressor.attack.value=.005;compressor.release.value=.26;master.connect(lowpass);lowpass.connect(compressor);compressor.connect(A.destination);
 music=A.createGain();fx=A.createGain();city=A.createGain();wild=A.createGain();music.connect(master);fx.connect(master);city.connect(music);wild.connect(music);city.gain.value=world==='city'?1:.00001;wild.gain.value=world==='wild'?1:.00001;
 rev=A.createConvolver();wet=A.createGain();wet.gain.value=.14;let len=Math.floor(A.sampleRate*1.4),ir=A.createBuffer(2,len,A.sampleRate);for(let c=0;c<2;c++){let arr=ir.getChannelData(c);for(let i=0;i<len;i++){let d=Math.pow(1-i/len,2.9);arr[i]=(Math.random()*2-1)*d*.34}}rev.buffer=ir;city.connect(rev);wild.connect(rev);rev.connect(wet);wet.connect(music);
 let lenNoise=Math.ceil(A.sampleRate*1.6);noiseBuffer=A.createBuffer(1,lenNoise,A.sampleRate);let arr=noiseBuffer.getChannelData(0);for(let i=0;i<lenNoise;i++)arr[i]=Math.random()*2-1;ambience('city');ambience('wild');music.gain.value=musicVolume*.82;fx.gain.value=fxVolume*.78;master.gain.value=.00001;return true}catch(e){console.warn('Audio disabled:',e);return false}}
function enable(w){if(w==='city'||w==='wild')world=w;if(!build())return false;enabled=true;suspendToken++;if(mutedTimer){clearTimeout(mutedTimer);mutedTimer=null;}try{let p=A.resume();if(p&&p.catch)p.catch(()=>{})}catch(e){}let t=A.currentTime;master.gain.cancelScheduledValues(t);master.gain.setTargetAtTime(.75,t,.23);music.gain.setTargetAtTime(musicVolume*.82,t,.12);(world==='city'?city:wild).gain.setTargetAtTime(1,t,.3);(world==='city'?wild:city).gain.setTargetAtTime(.00001,t,.3);next=t+.06;if(!timer)timer=setInterval(schedule,80);schedule();return true}
function disable(){enabled=false;if(timer){clearInterval(timer);timer=null}let token=++suspendToken;if(A){master.gain.setTargetAtTime(.00001,A.currentTime,.07);mutedTimer=setTimeout(()=>{if(token!==suspendToken||enabled)return;let p=A.suspend();if(p&&p.catch)p.catch(()=>{})},280)}}
function endScore(){if(!A||!enabled)return;if(timer){clearInterval(timer);timer=null}music.gain.setTargetAtTime(.00001,A.currentTime,.4)}
function setWorld(w,pressure){if(pressure!==undefined)setDanger(pressure);if(w!=='city'&&w!=='wild'||world===w)return;world=w;step=0;if(!A||!enabled)return;let t=A.currentTime;(w==='city'?city:wild).gain.setTargetAtTime(1,t,.78);(w==='city'?wild:city).gain.setTargetAtTime(.00001,t,.72);next=t+.12}
function setDanger(n){danger=Math.max(0,Math.min(12,+n||0))}
function setLevels(m,f){if(m!==undefined)musicVolume=Math.max(0,Math.min(1,+m));if(f!==undefined)fxVolume=Math.max(0,Math.min(1,+f));if(A){music.gain.setTargetAtTime(musicVolume*.82,A.currentTime,.09);fx.gain.setTargetAtTime(fxVolume*.78,A.currentTime,.06)}}
function setMode(nextMode){mode=nextMode==='ambient'?'ambient':'score';if(A&&enabled){step=0;next=A.currentTime+.08}}
function sfx(name,opts={}){if(!A||!enabled)return;let t=A.currentTime+.012,w=opts.world||world,heavy=opts.heavy;
 if(name==='card'||name==='draw'){sweepNoise(t,.08,fx,{freq:1750,type:'bandpass',vol:.038,attack:.002,release:.07});sweepNoise(t+.052,.045,fx,{freq:2500,type:'highpass',vol:.021,release:.045})}
 else if(name==='attack'){sweepNoise(t,.15,fx,{freq:w==='city'?2200:900,to:240,vol:.073,attack:.008,release:.14});osc(heavy?42:48,t+.03,.15,fx,{wave:'triangle',vol:heavy?.1:.075,attack:.005,release:.18,bend:65});if(heavy)sweepNoise(t+.06,.24,fx,{freq:360,type:'lowpass',vol:.056,release:.16})}
 else if(name==='block'){sweepNoise(t,.095,fx,{freq:730,type:'lowpass',vol:.056,release:.16});osc(45,t,.16,fx,{wave:'triangle',vol:.075,attack:.004,release:.23,bend:110})}
 else if(name==='stealth'){sweepNoise(t,.44,fx,{freq:650,to:160,vol:.045,attack:.025,release:.31});osc(50,t,.35,fx,{wave:'sine',vol:.028,attack:.08,release:.4,bend:84})}
 else if(name==='heal'){[74,77,81,86].forEach((n,i)=>mallet(n,t+i*.11,fx,.053,-.4+i*.26))}
 else if(name==='echo'){[62,69,74,77].forEach((n,i)=>osc(n,t+i*.12,.4,fx,{wave:'sine',vol:.032,attack:.055,release:.63,pan:i%2?.45:-.45}))}
 else if(name==='sleep'){sweepNoise(t,1.2,fx,{freq:270,to:1800,vol:.038,attack:.32,release:.9});[50,57,62,65,69].forEach((n,i)=>osc(n,t+i*.12,.85,fx,{wave:'triangle',cutoff:1400,vol:.033,attack:.12,release:1.1,pan:i%2?.4:-.4}))}
 else if(name==='damage'||name==='hazard'){sweepNoise(t,.22,fx,{freq:380,type:'lowpass',vol:.08,release:.24});osc(44,t,.22,fx,{wave:'sawtooth',cutoff:410,vol:.063,attack:.01,release:.27,bend:42})}
 else if(name==='defeat'||name==='reward'){[62,65,69,74].forEach((n,i)=>mallet(n,t+i*.13,fx,.047,-.35+i*.22))}
 else if(name==='victory'||name==='win'){[62,65,69,74,77,81,86].forEach((n,i)=>osc(n,t+i*.16,1.4,fx,{wave:'triangle',cutoff:1200,vol:.038,attack:.08,release:1.6,pan:i%2?.38:-.38}))}
 else if(name==='failure'){[69,65,62,57,50].forEach((n,i)=>osc(n,t+i*.2,.75,fx,{wave:'triangle',cutoff:550,vol:.05,attack:.04,release:.9}))}
}
if(win.document)document.addEventListener('visibilitychange',()=>{if(!A||!enabled)return;if(document.hidden){if(timer){clearInterval(timer);timer=null}master.gain.setTargetAtTime(.00001,A.currentTime,.08);let p=A.suspend();if(p&&p.catch)p.catch(()=>{})}else{let p=A.resume();if(p&&p.catch)p.catch(()=>{});next=A.currentTime+.08;master.gain.setTargetAtTime(.75,A.currentTime,.22);if(!timer)timer=setInterval(schedule,80)}});
win.OtherSleepAudio={enable,disable,endScore,setWorld,setDanger,setLevels,setMode,sfx,isEnabled:()=>enabled,status:()=>({enabled,world,danger,music:musicVolume,sfx:fxVolume,mode,context:A&&A.state})};
})(window);
