'use strict';
const $=id=>document.getElementById(id);
const heights=[12,19,30,20,42,52,34,24,47,63,43,30,52,39,60,48,32,22,37,51,33,20,14];
heights.forEach((h,i)=>{const bar=document.createElement('i');bar.style.setProperty('--h',h+'px');bar.style.setProperty('--delay',i*37+'ms');$('wave').append(bar)});
let base='',key='',connected=false,busy=false;
try{base=localStorage.getItem('mp3-server')||'';key=sessionStorage.getItem('mp3-key')||''}catch{}
function show(message,error=false){$('status').textContent=message;$('status').classList.toggle('error',error)}
function videoId(value){
  let u;try{u=new URL(value)}catch{return null}
  if(!['https:','http:'].includes(u.protocol)||u.username||u.password||u.port)return null;
  const host=u.hostname.toLowerCase();let id='';
  if(host==='youtu.be')id=u.pathname.slice(1).split('/')[0];
  else if(['youtube.com','www.youtube.com','m.youtube.com','music.youtube.com'].includes(host)){
    if(u.pathname==='/watch')id=u.searchParams.get('v');
    else if(/^\/(shorts|embed|live)\//.test(u.pathname))id=u.pathname.split('/')[2];
  }
  return /^[\w-]{11}$/.test(id||'')?id:null;
}
function headers(){return {'Content-Type':'application/json','X-Converter-Key':key}}
async function jsonRequest(path,options={}){
  const response=await fetch(base+path,{...options,headers:{...headers(),...(options.headers||{})},signal:AbortSignal.timeout(90000)});
  let data;try{data=await response.json()}catch{throw new Error('The audio server returned an unexpected response.')}
  if(!response.ok)throw new Error(data.error||'The audio server could not complete the request.');return data;
}
function controls(){ $('convert').disabled=!connected||busy;$('connect').disabled=busy;$('videoUrl').disabled=busy;$('quality').disabled=busy;$('card').classList.toggle('working',busy);$('convert').textContent=busy?'Converting…':'Convert to MP3'}
async function connect(){
  connected=false;controls();
  if(!base){show('Conversion is waiting for an audio server to be connected.');$('connectionNote').textContent='The page is ready. An audio server still needs to be deployed and connected.';return}
  if(!key){show('Enter your server access key under Converter connection.');return}
  show('Connecting to the audio server…');
  try{await jsonRequest('/api/connection');connected=true;show('Ready. Paste a YouTube link above.');$('connectionNote').textContent='Connected to '+base;$('settings').open=false}
  catch(e){show(e.message==='Failed to fetch'?'Could not reach the audio server. Check its address and whether it is running.':e.message,true)}controls();
}
$('connectionForm').addEventListener('submit',async e=>{
  e.preventDefault();let u;try{u=new URL($('serverUrl').value.trim())}catch{show('Enter a valid audio server URL.',true);return}
  if((u.protocol!=='https:'&&!(u.protocol==='http:'&&['localhost','127.0.0.1'].includes(u.hostname)))||u.username||u.password||u.search||u.hash){show('Use an HTTPS server address.',true);return}
  base=u.href.replace(/\/$/,'');key=$('accessKey').value.trim();
  try{localStorage.setItem('mp3-server',base);sessionStorage.setItem('mp3-key',key)}catch{}await connect();
});
$('convertForm').addEventListener('submit',async e=>{
  e.preventDefault();if(busy||!connected)return;const id=videoId($('videoUrl').value.trim());
  if(!id){show('Paste a YouTube video link, including Shorts or youtu.be links.',true);return}
  busy=true;controls();$('result').hidden=true;$('progress').hidden=false;$('progress').removeAttribute('value');show('Reading video information…');
  try{
    const job=await jsonRequest('/api/jobs',{method:'POST',body:JSON.stringify({url:'https://www.youtube.com/watch?v='+id,quality:Number($('quality').value)})});
    const deadline=Date.now()+20*60*1000;
    while(Date.now()<deadline){
      const data=await jsonRequest('/api/jobs/'+encodeURIComponent(job.id));
      if(data.title)$('videoTitle').textContent=data.title;
      if(data.state==='error')throw new Error(data.error);
      if(data.state==='ready'){
        const download=new URL(data.download,base+'/');
        if(download.origin!==new URL(base).origin)throw new Error('The server returned an invalid download address.');
        $('videoMeta').textContent=data.quality+' kbps · '+(data.size/1024/1024).toFixed(1)+' MB';
        $('download').href=download.href;$('download').setAttribute('download',data.filename);$('result').hidden=false;show('Your MP3 is ready.');break;
      }
      show(data.message||'Converting audio…');if(typeof data.progress==='number')$('progress').value=data.progress;else $('progress').removeAttribute('value');
      await new Promise(resolve=>setTimeout(resolve,1500));
    }
    if($('result').hidden)throw new Error('The conversion timed out. Try again with a shorter video.');
  }catch(e){show(e.message==='Failed to fetch'?'The connection to the audio server was lost. Please try again.':e.message,true)}
  finally{busy=false;$('progress').hidden=true;controls()}
});
(async()=>{
  if(!base)try{const response=await fetch('./config.json');const config=await response.json();if(config.apiBase){const u=new URL(config.apiBase);if(u.protocol==='https:')base=u.href.replace(/\/$/,'')}}catch{}
  $('serverUrl').value=base;$('accessKey').value=key;await connect();
})();
