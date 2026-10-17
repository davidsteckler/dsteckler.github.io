// Incrementally render selected trails without changing existing atlas tiles.
// Usage: node turtlereference/build-trail-previews.mjs tin-robot paper-fleet
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {chromium} from 'playwright';

const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const selected=new Set(process.argv.slice(2));
assert(selected.size,'Pass one or more trail IDs to render.');
const scope={window:{}};
for(const file of ['reference-data.js','reference-more.js','reference-trails.js','reference-examples.js','reference-trail-examples.js','example-previews.js'])vm.runInNewContext(fs.readFileSync(path.join(root,'turtlereference',file),'utf8'),scope,{filename:file});
for(const id of selected)assert(scope.window.TURTLE_TRAILS.some(t=>t.id===id),'Unknown trail: '+id);
const examples=scope.window.TURTLE_REFERENCE.filter(topic=>selected.has(topic.trail)).flatMap(topic=>topic.examples.map(example=>({...example,key:topic.id+'/'+example.id})));
const manifest=scope.window.REFERENCE_PREVIEWS;
const pending=new Map(),assets=new Map();
const browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_EXECUTABLE||undefined,args:['--no-sandbox']});
try{
  const context=await browser.newContext();
  if(process.env.TURTLE_TEST_DEPS)for(const [pattern,file] of [['**/codemirror.min.css','codemirror.css'],['**/codemirror.min.js','codemirror.js'],['**/mode/python/python.min.js','python.js'],['**/skulpt.min.js','skulpt.js'],['**/skulpt-stdlib.js','skulpt-stdlib.js']])await context.route(pattern,route=>route.fulfill({path:path.join(process.env.TURTLE_TEST_DEPS,file)}));
  await context.route('**/googletagmanager.com/**',route=>route.abort());
  const page=await context.newPage();
  await page.goto((process.env.TURTLE_TEST_ORIGIN||'http://127.0.0.1:8794')+'/turtleprojects/?renderPreview=1');
  await page.waitForFunction(()=>window.Sk&&document.querySelector('.CodeMirror')?.CodeMirror);
  for(const example of examples){
    const code='speed(0)\n'+example.code.replace(/^speed\([^\n]*\)$/gm,'speed(0)')+(example.previewCall?'\n'+example.previewCall:'');
    const result=await page.evaluate(({id,code})=>new Promise(resolve=>{
      const timer=setTimeout(()=>{removeEventListener('message',listener);resolve({ok:false,output:'Timed out'});},15000);
      function listener(event){if(event.origin!==location.origin||event.data?.kind!=='turtle-rendered'||event.data.id!==id)return;clearTimeout(timer);removeEventListener('message',listener);resolve({ok:!!event.data.image,image:event.data.image,output:document.getElementById('output').textContent});}
      addEventListener('message',listener);postMessage({kind:'turtle-render',id,code},location.origin);
    }),{id:example.key,code});
    assert(result.ok,example.key+': '+result.output);
    for(const text of example.assertOutput||[])assert(result.output.includes(text),example.key+' missing '+JSON.stringify(text)+': '+result.output);
    const record={hash:createHash('sha256').update(example.code+'\n'+(example.previewCall||'')).digest('hex')};
    if(example.output==='ascii')record.text=result.output.replace(/\n?Program finished\.\n?$/,'').trimEnd();
    else{
      const filename=example.key.replace('/','--')+'.svg';
      record.image='trail-previews/'+filename;
      const image=await page.evaluate(async data=>{
        const image=new Image();image.src=data;await image.decode();
        const canvas=document.createElement('canvas');canvas.width=400;canvas.height=400;canvas.getContext('2d').drawImage(image,0,0);
        return canvas.toDataURL('image/webp',0.94);
      },result.image);
      // Embed the runtime's actual canvas output in a text-based SVG asset.
      assets.set(filename,'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><image width="400" height="400" href="'+image+'"/></svg>\n');
    }
    if(example.previewNote)record.note=example.previewNote;
    pending.set(example.key,record);
    console.log('Rendered '+example.key);
  }
  // Only publish assets and the manifest after every example succeeds.
  const directory=path.join(root,'turtlereference/trail-previews');fs.mkdirSync(directory,{recursive:true});
  for(const [name,content] of assets)fs.writeFileSync(path.join(directory,name),content);
  for(const [key,record] of pending)manifest.examples[key]=record;
  fs.writeFileSync(path.join(root,'turtlereference/example-previews.js'),'/* Generated from the actual Python runtime. */\nwindow.REFERENCE_PREVIEWS = '+JSON.stringify(manifest)+';\n');
  console.log('PASS '+examples.length+' trail programs; actual output and previews saved.');
}finally{await browser.close();}
