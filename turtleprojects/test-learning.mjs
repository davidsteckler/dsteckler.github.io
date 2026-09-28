// Exercise every distinct checkpoint in the site's real Skulpt/canvas runtime.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawn} from 'node:child_process';
import {chromium} from 'playwright';

const root=path.dirname(fileURLToPath(import.meta.url));
const port=Number(process.env.TURTLE_AUDIT_PORT||8774);
const origin='http://127.0.0.1:'+port;
const out=process.env.TURTLE_AUDIT_OUTPUT||'/tmp/turtle-learning-audit.json';
const server=spawn('python3',['-m','http.server',String(port),'--bind','127.0.0.1'],{cwd:path.dirname(root),stdio:'ignore'});
let browser;
const records=[],errors=[];
try{
  for(let i=0;i<60;i++){
    try{const r=await fetch(origin+'/turtleprojects/project.html');if(r.ok)break;}catch{}
    await new Promise(r=>setTimeout(r,100));
  }
  const data=fs.readdirSync(path.join(root,'lessons')).filter(f=>f.endsWith('.json')).map(f=>JSON.parse(fs.readFileSync(path.join(root,'lessons',f),'utf8')));
  const requested=new Set((process.env.TURTLE_AUDIT_IDS||'').split(',').filter(Boolean));
  const projects=data.filter(p=>!requested.size||requested.has(p.id));
  browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_EXECUTABLE||undefined,args:['--no-sandbox']});
  let next=0,done=0;
  const deps=process.env.TURTLE_TEST_DEPS;
  async function worker(){
    const context=await browser.newContext({viewport:{width:1440,height:900}});
    if(deps){
      for(const [pattern,file] of [['**/codemirror.min.css','codemirror.css'],['**/codemirror.min.js','codemirror.js'],['**/mode/python/python.min.js','python.js'],['**/skulpt.min.js','skulpt.js'],['**/skulpt-stdlib.js','skulpt-stdlib.js']])
        await context.route(pattern,route=>route.fulfill({path:path.join(deps,file),contentType:file.endsWith('.css')?'text/css':'application/javascript'}));
    }
    const page=await context.newPage();
    page.on('pageerror',e=>errors.push({type:'page',error:e.message}));
    await page.goto(origin+'/turtleprojects/?renderPreview=1',{waitUntil:'load',timeout:45000});
    await page.waitForFunction(()=>window.Sk&&document.querySelector('.CodeMirror')?.CodeMirror);
    while(next<projects.length){
      const project=projects[next++];let lines=[],previousCode='';
      for(let index=0;index<project.steps.length;index++){
        const step=project.steps[index];
        for(const edit of [...step.edits].reverse())lines.splice(edit.start,edit.remove,...edit.lines);
        const code=lines.join('\n').replace(/^speed\([^\n]*\)$/gm,'speed(0)');
        if(code===previousCode)continue;
        previousCode=code;
        const id=project.id+'-'+(index+1),begun=Date.now();
        let result;
        try{
          result=await page.evaluate(({id,code})=>new Promise(resolve=>{
            const timer=setTimeout(()=>{window.removeEventListener('message',listen);resolve({ok:false,error:'Render timeout'});},25000);
            function listen(event){
              if(event.data?.kind!=='turtle-rendered'||event.data.id!==id)return;
              clearTimeout(timer);window.removeEventListener('message',listen);
              const canvas=document.getElementById('turtle-drawing');
              const pixels=canvas.getContext('2d').getImageData(0,0,400,400).data;
              let ink=0,hash=2166136261;
              for(let i=0;i<pixels.length;i+=4){if(pixels[i+3])ink++;hash=Math.imul(hash^pixels[i],16777619);hash=Math.imul(hash^pixels[i+1],16777619);hash=Math.imul(hash^pixels[i+2],16777619);hash=Math.imul(hash^pixels[i+3],16777619);}
              resolve({ok:!!event.data.image,ink,hash:hash>>>0,error:event.data.image?null:document.querySelector('.console')?.innerText});
            }
            window.addEventListener('message',listen);
            window.postMessage({kind:'turtle-render',id,code},location.origin);
          }),{id,code});
        }catch(e){result={ok:false,error:String(e)};}
        const record={id,title:step.title,...result,ms:Date.now()-begun};
        records.push(record);
        if(!result.ok||!result.ink)errors.push(record);
      }
      done++;
      if(done%10===0||done===projects.length){
        console.log(done+'/'+projects.length+' projects; '+records.length+' checkpoints; '+errors.length+' errors');
        fs.writeFileSync(out,JSON.stringify({projects:done,records,errors},null,2));
      }
    }
    await context.close();
  }
  await Promise.all(Array.from({length:Number(process.env.TURTLE_AUDIT_WORKERS||4)},()=>worker()));
  fs.writeFileSync(out,JSON.stringify({projects:done,records,errors},null,2));
  if(errors.length)throw Error(JSON.stringify(errors.slice(0,20)));
  console.log('PASS: '+records.length+' rendered checkpoints across '+done+' projects.');
}finally{
  await browser?.close();server.kill();
}
