(() => {
  'use strict';
  const places=[128,64,32,16,8,4,2,1];
  const binary=n=>n.toString(2).padStart(8,'0');
  const original=document.querySelector('#bulbs .bulb-svg');
  function bulbRow(container,label,onToggle){
    return places.map((place,index)=>{
      const item=document.createElement('div');item.className='bit';
      const caption=document.createElement('div');caption.className='bit-label';caption.textContent=place;
      const button=document.createElement('button');button.type='button';button.className='bit-button';
      button.setAttribute('aria-label',label+' bit worth '+place);
      button.append(original.cloneNode(true));
      button.addEventListener('click',()=>onToggle(place));
      item.append(caption,button);container.append(item);return button;
    });
  }
  function updateBulbs(buttons,value){
    buttons.forEach((button,i)=>{const bit=(value & places[i])?1:0;button.classList.toggle('on',!!bit);button.setAttribute('aria-pressed',String(!!bit));button.querySelector('.inside-bit').textContent=bit;});
  }
  const channels=[['r','Red','#ee8a78',255],['g','Green','#8bc898',128],['b','Blue','#8ab8ec',64]].map(([id,name,color,value])=>{
    const row=document.createElement('div');row.className='channel-row';row.style.setProperty('--bulb-color',color);
    row.innerHTML='<div class="channel-control"><label for="rgb-'+id+'">'+name+' <output id="rgb-'+id+'-value" for="rgb-'+id+'"></output></label><input type="range" id="rgb-'+id+'" min="0" max="255" step="1" value="'+value+'"><code class="channel-byte" id="rgb-'+id+'-byte"></code></div><div class="media-bulbs" aria-label="'+name+' byte"></div>';
    document.getElementById('rgbChannels').append(row);
    const state={id,value,input:row.querySelector('input'),output:row.querySelector('output'),code:row.querySelector('code')};
    state.buttons=bulbRow(row.querySelector('.media-bulbs'),name,place=>{state.value^=place;renderColor();});
    state.input.addEventListener('input',()=>{state.value=Number(state.input.value);renderColor();});return state;
  });
  function renderColor(){
    channels.forEach(c=>{c.input.value=c.value;c.output.value=c.value;c.code.textContent=binary(c.value);updateBulbs(c.buttons,c.value);});
    const values=channels.map(c=>c.value),hex='#'+values.map(n=>n.toString(16).padStart(2,'0')).join('').toUpperCase();
    document.getElementById('rgbSwatch').style.backgroundColor='rgb('+values.join(',')+')';
    document.getElementById('rgbSwatch').setAttribute('aria-label','Color '+hex);
    document.getElementById('rgbCode').textContent='rgb('+values.join(', ')+')';
    document.getElementById('rgbHex').textContent=hex;
  }
  document.querySelectorAll('[data-rgb-preset]').forEach(b=>b.addEventListener('click',()=>{b.dataset.rgbPreset.split(',').forEach((n,i)=>channels[i].value=Number(n));renderColor();}));
  document.getElementById('rgbRandom').addEventListener('click',()=>{channels.forEach(c=>c.value=Math.floor(Math.random()*256));renderColor();});
  renderColor();

  let samples=Array.from({length:16},(_,i)=>Math.round(128+110*Math.sin(i*Math.PI/8))),selected=0;
  let context=null,source=null,audioGain=null,playing=false;
  const sampleSlider=document.getElementById('audioSample');
  const audioButtons=bulbRow(document.getElementById('audioBulbs'),'Audio sample',place=>{samples[selected]^=place;renderAudio();});
  const picker=document.getElementById('samplePicker');
  const sampleButtons=samples.map((_,i)=>{const b=document.createElement('button');b.type='button';b.textContent=i+1;b.setAttribute('aria-label','Select sample '+(i+1));b.onclick=()=>{selected=i;renderAudio();};picker.append(b);return b;});
  function renderAudio(){
    const value=samples[selected];sampleSlider.value=value;
    document.getElementById('audioSampleLabel').textContent='Sample '+(selected+1);
    document.getElementById('audioSampleValue').value=value;
    document.getElementById('audioSampleByte').textContent=binary(value);updateBulbs(audioButtons,value);
    sampleButtons.forEach((b,i)=>{b.setAttribute('aria-pressed',String(i===selected));b.title='Sample '+(i+1)+': '+samples[i];});
    const x=i=>20+i*40,y=n=>150-n/255*130;
    const points=samples.map((n,i)=>x(i)+','+y(n)).join(' ');
    document.getElementById('sampleWave').innerHTML='<line x1="10" x2="630" y1="'+y(128)+'" y2="'+y(128)+'" stroke="#bcb4a8" stroke-dasharray="4 4"/><polyline points="'+points+'" fill="none" stroke="#2d6972" stroke-width="2"/>'+samples.map((n,i)=>'<circle cx="'+x(i)+'" cy="'+y(n)+'" r="'+(i===selected?6:3)+'" fill="'+(i===selected?'#b86238':'#2d6972')+'"/>').join('');
    if(playing)startSound();
  }
  function stopSource(){if(source){source.stop();source.disconnect();source=null;}if(audioGain){audioGain.disconnect();audioGain=null;}}
  function startSound(){
    stopSource();
    // Repeat exactly these sixteen unsigned 8-bit PCM samples at the chosen pitch.
    const buffer=context.createBuffer(1,16,context.sampleRate),data=buffer.getChannelData(0);
    samples.forEach((n,i)=>data[i]=(n-128)/128);
    source=context.createBufferSource();source.buffer=buffer;source.loop=true;
    source.playbackRate.value=Number(document.getElementById('audioPitch').value)*16/context.sampleRate;
    audioGain=context.createGain();audioGain.gain.value=.12;
    source.connect(audioGain);audioGain.connect(context.destination);source.start();
  }
  function stop(){if(playing)document.getElementById('audioMediaStatus').textContent='Sound stopped.';playing=false;stopSource();const b=document.getElementById('audioPlay');b.textContent='Play sound';b.setAttribute('aria-pressed','false');}
  document.getElementById('audioPlay').addEventListener('click',async()=>{
    if(playing){stop();return;}
    try{
      const AudioContext=window.AudioContext||window.webkitAudioContext;
      if(!AudioContext)throw new Error('unavailable');
      context=context||new AudioContext();await context.resume();
      if(document.getElementById('audioPanel').hidden||document.hidden)return;
      playing=true;startSound();document.getElementById('audioPlay').textContent='Stop sound';document.getElementById('audioPlay').setAttribute('aria-pressed','true');
      document.getElementById('audioMediaStatus').textContent='Playing your 16 samples as a repeating wave.';
    }catch{stop();document.getElementById('audioMediaStatus').textContent='Audio could not start in this browser. You can still edit the samples.';}
  });
  sampleSlider.addEventListener('input',()=>{samples[selected]=Number(sampleSlider.value);renderAudio();});
  document.querySelectorAll('[data-wave]').forEach(b=>b.addEventListener('click',()=>{samples=Array.from({length:16},(_,i)=>b.dataset.wave==='sine'?Math.round(128+110*Math.sin(i*Math.PI/8)):b.dataset.wave==='square'?(i<8?238:18):128);renderAudio();}));
  document.getElementById('audioPitch').addEventListener('input',e=>{document.getElementById('audioPitchValue').value=e.target.value+' Hz';if(playing)startSound();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});window.addEventListener('pagehide',stop);
  renderAudio();
  function changeMode(){
    const mode=['color','audio'].includes(location.hash.slice(1))?location.hash.slice(1):'numbers';
    for(const name of ['numbers','color','audio'])document.getElementById(name+'Panel').hidden=name!==mode;
    document.querySelectorAll('.bulb-modes a').forEach(a=>{if(a.hash==='#'+mode)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current');});
    if(mode!=='audio')stop();
    const title={numbers:'Binary Bulbs',color:'Binary Bulbs (24) · Color',audio:'Binary Bulbs · Audio'}[mode];
    window.LEARNING_ACTIVITY={id:'binary-bulbs-'+mode,title,url:'/binary1.html#'+mode};
    window.dispatchEvent(new CustomEvent('learning-activity',{detail:window.LEARNING_ACTIVITY}));
  }
  window.addEventListener('hashchange',changeMode);changeMode();
})();
