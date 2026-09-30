import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {spawn} from 'node:child_process';
import {chromium} from 'playwright';

const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const origin='http://127.0.0.1:8784';
const proof=process.env.TURTLE_REFERENCE_PROOF||'/tmp/reference-example-proof';
fs.mkdirSync(path.join(proof,'renders'),{recursive:true});
const scope={window:{}};
for(const file of ['reference-data.js','reference-more.js','reference-trails.js','reference-examples.js','reference-trail-examples.js'])vm.runInNewContext(fs.readFileSync(path.join(root,'turtlereference',file),'utf8'),scope,{filename:file});
const examples=scope.window.TURTLE_REFERENCE.flatMap(topic=>topic.examples.map(example=>({...example,key:topic.id+'/'+example.id,topic:topic.id})));
const server=spawn('python3',['-m','http.server','8784','--bind','127.0.0.1'],{cwd:root,stdio:'ignore'});
let browser;
try{
  for(let n=0;n<60;n++){try{await fetch(origin);break;}catch{await new Promise(r=>setTimeout(r,100));}}
  browser=await chromium.launch({executablePath:process.env.BROWSER_EXECUTABLE||undefined,headless:true,args:['--no-sandbox']});
  const context=await browser.newContext();
  if(process.env.TURTLE_TEST_DEPS)for(const [pattern,file] of [['**/codemirror.min.css','codemirror.css'],['**/codemirror.min.js','codemirror.js'],['**/mode/python/python.min.js','python.js'],['**/skulpt.min.js','skulpt.js'],['**/skulpt-stdlib.js','skulpt-stdlib.js']])await context.route(pattern,route=>route.fulfill({path:path.join(process.env.TURTLE_TEST_DEPS,file),contentType:file.endsWith('.css')?'text/css':'application/javascript'}));
  const page=await context.newPage();page.on('dialog',dialog=>dialog.accept('40'));
  await page.goto(origin+'/turtleprojects/?renderPreview=1');
  await page.waitForFunction(()=>window.Sk&&document.querySelector('.CodeMirror')?.CodeMirror);
  const pictures=[],manifest={tile:120,columns:12,examples:{}};
  for(const example of examples){
    const code='speed(0)\n'+example.code.replace(/^speed\([^\n]*\)$/gm,'speed(0)')+(example.previewCall?'\n'+example.previewCall:'');
    const result=await page.evaluate(({key,code})=>new Promise(resolve=>{
      const timeout=setTimeout(()=>{removeEventListener('message',listener);resolve({ok:false,output:'timeout'});},15000);
      function listener(event){if(event.data?.kind!=='turtle-rendered'||event.data.id!==key)return;clearTimeout(timeout);removeEventListener('message',listener);resolve({ok:!!event.data.image,image:event.data.image,output:document.getElementById('output').textContent});}
      addEventListener('message',listener);postMessage({kind:'turtle-render',id:key,code},location.origin);
    }),{key:example.key,code});
    assert(result.ok,example.key+': '+result.output);
    for(const expected of example.assertOutput||[])assert(result.output.includes(expected),example.key+' missing '+JSON.stringify(expected)+': '+result.output);
    const entry={hash:createHash('sha256').update(example.code+'\n'+(example.previewCall||'')).digest('hex')};
    if(example.output==='ascii')entry.text=result.output.replace(/\n?Program finished\.\n?$/,'').trimEnd();
    else {entry.tile=pictures.length;pictures.push(result.image);}
    if(example.previewNote)entry.note=example.previewNote;
    manifest.examples[example.key]=entry;
    fs.writeFileSync(path.join(proof,'renders',example.key.replace('/','--')+'.png'),Buffer.from(result.image.split(',')[1],'base64'));
    if(Object.keys(manifest.examples).length%50===0)console.log('Rendered '+Object.keys(manifest.examples).length+' / '+examples.length);
  }
  const dataUrl=await page.evaluate(async({pictures,tile,columns})=>{
    const canvas=document.createElement('canvas');canvas.width=tile*columns;canvas.height=tile*Math.ceil(pictures.length/columns);
    const ctx=canvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);
    for(let i=0;i<pictures.length;i++){const img=new Image();img.src=pictures[i];await img.decode();ctx.drawImage(img,(i%columns)*tile,Math.floor(i/columns)*tile,tile,tile);}
    return canvas.toDataURL('image/webp',0.94);
  },{pictures,tile:manifest.tile,columns:manifest.columns});
  manifest.rows=Math.ceil(pictures.length/manifest.columns);
  fs.writeFileSync(path.join(root,'turtlereference/example-previews.webp'),Buffer.from(dataUrl.split(',')[1],'base64'));
  fs.writeFileSync(path.join(root,'turtlereference/example-previews.js'),'/* Generated from the actual Python runtime. */\nwindow.REFERENCE_PREVIEWS = '+JSON.stringify(manifest)+';\n');
  fs.writeFileSync(path.join(proof,'examples.json'),JSON.stringify(examples));
  console.log('PASS '+examples.length+' complete examples; drawing and text previews generated');
}finally{await browser?.close();server.kill();}
