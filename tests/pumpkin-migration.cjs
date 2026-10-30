const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const source = fs.readFileSync('pumpkin/app.js', 'utf8');
const data = JSON.parse(fs.readFileSync('pumpkin/data.json', 'utf8'));
const prefix = 'dsteckler-pumpkin-v1-';
function element() {
  return {hidden:false, value:'', textContent:'', style:{}, dataset:{}, classList:{toggle(){},add(){},remove(){}},
    addEventListener(){}, append(){}, replaceChildren(){}, querySelectorAll(){return []},
    querySelector(){return element()}, setAttribute(){}, scrollIntoView(){}, focus(){}};
}
async function boot(code, revision = data.revision) {
  const storage = new Map([
    [prefix+'draft-smile',JSON.stringify({code,updated:1})],
    [prefix+'curriculum-revision',JSON.stringify(revision)],
    [prefix+'state',JSON.stringify({doc:'smile',step:0})]
  ]);
  const elements = new Map();
  const document = {getElementById(id){if(!elements.has(id))elements.set(id,element());return elements.get(id)},
    querySelector(){return element()},querySelectorAll(){return []},createElement:element,addEventListener(){}};
  const context = {document,location:{hash:''},localStorage:{getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v)},
    window:{addEventListener(){}},fetch:async()=>({ok:true,json:async()=>data}),requestAnimationFrame(){},
    setTimeout(){},clearTimeout(){},URL,Blob,console};
  vm.runInNewContext(source,context);
  await new Promise(resolve=>setImmediate(resolve));
  return {draft:JSON.parse(storage.get(prefix+'draft-smile')),history:JSON.parse(storage.get(prefix+'history-smile')??'[]'),elements};
}
(async()=>{
  const legacy='# Changed the color and speed in an old example.\ndef arc(x, y, heading, radius, extent, shade, thickness):\n    pensize(thickness)\nspeed(3)\nbgcolor("navy")\n';
  const simple=data.designs.find(d=>d.id==='smile').code;
  const migrated=await boot(legacy);
  assert.equal(migrated.draft.code,simple,'Retired helpers update even when this revision was already marked complete');
  assert.equal(migrated.history[0].code,legacy,'Previous code stays recoverable');
  assert.equal(migrated.elements.get('exampleUpdate').hidden,false);
  const edited=simple.replace('circle(18)','circle(23)');
  const retained=await boot(edited,'older-revision');
  assert.equal(retained.draft.code,edited,'Student edits to simple code survive updates');
  assert.equal(retained.history.length,0);
  assert.equal(retained.elements.get('designCount').textContent,'64');
  const unchanged=await boot(simple);
  assert.equal(unchanged.history.length,0,'Opening a current draft does not create migration checkpoints');
  console.log('Pumpkin migration: changed legacy drafts update, earlier work is retained, simple student edits survive, and gallery counts follow the data.');
})().catch(error=>{console.error(error);process.exitCode=1});
