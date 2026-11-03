(() => {
  'use strict';
  const places=[128,64,32,16,8,4,2,1];
  const binary=n=>n.toString(2).padStart(8,'0');
  const original=document.querySelector('#bulbs .bulb-svg');
  function bulbRow(container,label,onToggle){
    return places.map((place,index)=>{
      const item=document.createElement('div');item.className='bit';
      const caption=document.createElement('div');caption.className='bit-label';caption.innerHTML='<span class="place-value">'+place+'</span><span class="power-label">2<sup>'+Math.log2(place)+'</sup></span>';caption.setAttribute('aria-label',place+' equals 2 to the power '+Math.log2(place));
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
  const format=n=>n.toLocaleString('en-US');
  const channels=[['r','Red','#ee8a78',255],['g','Green','#8bc898',128],['b','Blue','#8ab8ec',64]].map(([id,name,color,value])=>{
    const row=document.createElement('div');row.className='channel-row';row.style.setProperty('--bulb-color',color);
    row.innerHTML='<div class="channel-control"><div class="channel-heading"><label for="rgb-'+id+'">'+name+' <output id="rgb-'+id+'-value" for="rgb-'+id+'"></output></label><button type="button" class="group-switch" aria-label="'+name+' group" aria-pressed="true">On</button></div><input type="range" id="rgb-'+id+'" min="0" max="255" step="1" value="'+value+'"><code class="channel-byte" id="rgb-'+id+'-byte"></code><button type="button" class="all-bits" aria-label="Turn all '+name.toLowerCase()+' bits on">All 8 on</button></div><div class="media-bulbs" aria-label="'+name+' byte"></div>';
    document.getElementById('rgbChannels').append(row);
    const state={id,name,row,value,enabled:true,input:row.querySelector('input'),output:row.querySelector('output'),code:row.querySelector('code'),toggle:row.querySelector('.group-switch')};
    state.buttons=bulbRow(row.querySelector('.media-bulbs'),name,place=>{state.value^=place;renderColor();});
    state.input.addEventListener('input',()=>{state.value=Number(state.input.value);renderColor();});
    state.toggle.addEventListener('click',()=>{state.enabled=!state.enabled;renderColor();});
    row.querySelector('.all-bits').addEventListener('click',()=>{state.enabled=true;state.value=255;renderColor();});
    return state;
  });
  function renderColor(){
    const values=channels.map(c=>c.enabled?c.value:0);
    channels.forEach((c,i)=>{
      const value=values[i];c.input.value=value;c.output.value=value;c.code.textContent=binary(value);updateBulbs(c.buttons,value);
      c.input.disabled=!c.enabled;c.buttons.forEach(b=>b.disabled=!c.enabled);
      c.toggle.setAttribute('aria-pressed',String(c.enabled));c.toggle.textContent=c.enabled?'On':'Off';c.row.classList.toggle('channel-off',!c.enabled);
    });
    const hex='#'+values.map(n=>n.toString(16).padStart(2,'0')).join('').toUpperCase();
    const number=values[0]*65536+values[1]*256+values[2];
    document.getElementById('rgbSwatch').style.backgroundColor='rgb('+values.join(',')+')';
    document.getElementById('rgbSwatch').setAttribute('aria-label','Color '+hex);
    document.getElementById('rgbCode').textContent='rgb('+values.join(', ')+')';
    document.getElementById('rgbHex').textContent=hex;
    document.getElementById('rgbColorNumber').value=number;
    document.getElementById('rgbFullBinary').textContent=values.map(binary).join(' ');
    document.getElementById('rgbNumberEquation').textContent=values[0]+' × 65,536 + '+values[1]+' × 256 + '+values[2]+' = '+format(number);
    const count=channels.filter(c=>c.enabled).length;
    document.querySelectorAll('[data-channel-count]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.channelCount)===count)));
    document.querySelectorAll('[data-count-row]').forEach(row=>row.classList.toggle('current',Number(row.dataset.countRow)===count));
    document.getElementById('channelPossibilities').textContent=format(2**(count*8))+' possible '+(count===0?'color':'colors');
    document.getElementById('channelExplanation').textContent=count===0?'All groups are off. The only result is black.':channels.filter(c=>c.enabled).map(c=>c.name.toLowerCase()).join(' + ')+' · '+(count*8)+' available bits · '+Array(count).fill('256').join(' × ')+' settings';
  }
  function applyRGB(values){channels.forEach((c,i)=>{c.value=values[i];c.enabled=true;});renderColor();}
  document.querySelectorAll('[data-rgb-preset]').forEach(b=>b.addEventListener('click',()=>applyRGB(b.dataset.rgbPreset.split(',').map(Number))));
  document.getElementById('rgbRandom').addEventListener('click',()=>{channels.filter(c=>c.enabled).forEach(c=>c.value=Math.floor(Math.random()*256));renderColor();});
  document.querySelectorAll('[data-channel-count]').forEach(b=>b.addEventListener('click',()=>{const count=Number(b.dataset.channelCount);channels.forEach((c,i)=>c.enabled=i<count);renderColor();}));
  function setColorNumber(value){
    if(!Number.isFinite(value))return;
    const n=Math.min(16777215,Math.max(0,Math.round(value)));
    applyRGB([Math.floor(n/65536),Math.floor(n/256)%256,n%256]);
  }
  document.getElementById('rgbColorNumber').addEventListener('input',e=>{if(e.target.value!=='')setColorNumber(e.target.valueAsNumber);});
  document.getElementById('rgbColorNumber').addEventListener('change',e=>setColorNumber(e.target.value===''?0:e.target.valueAsNumber));
  document.querySelectorAll('[data-color-number]').forEach(b=>b.addEventListener('click',()=>setColorNumber(Number(b.dataset.colorNumber))));
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
    document.body.dataset.bulbMode=mode;
    for(const name of ['numbers','color','audio'])document.getElementById(name+'Panel').hidden=name!==mode;
    document.querySelectorAll('.bulb-modes a').forEach(a=>{if(a.hash==='#'+mode)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current');});
    if(mode!=='audio')stop();
    const title={numbers:'Binary Bulbs',color:'Binary Bulbs (24) · Color',audio:'Binary Bulbs · Audio'}[mode];
    window.LEARNING_ACTIVITY={id:'binary-bulbs-'+mode,title,url:'/binary1.html#'+mode};
    window.dispatchEvent(new CustomEvent('learning-activity',{detail:window.LEARNING_ACTIVITY}));
  }
  window.addEventListener('hashchange',changeMode);changeMode();
})();
