import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const modules=process.env.UNIT_TEST_MODULES||path.join(root,'node_modules');
const context=vm.createContext({console,setTimeout,clearTimeout});
vm.runInContext(fs.readFileSync(path.join(modules,'skulpt/dist/skulpt.min.js'),'utf8'),context);
vm.runInContext(fs.readFileSync(path.join(modules,'skulpt/dist/skulpt-stdlib.js'),'utf8'),context);
context.window={};context.document={createElement(){return {getContext(){return {fillStyle:'black'};}};}};
vm.runInContext(fs.readFileSync(path.join(root,'pythoncourse/course-data.js'),'utf8'),context);
vm.runInContext(fs.readFileSync(path.join(root,'pythoncourse/unit-two-data.js'),'utf8'),context);
const html=fs.readFileSync(path.join(root,'pythoncourse/index.html'),'utf8');
vm.runInContext(html.slice(html.indexOf('  var TURTLE_CALLS='),html.indexOf('  function showCheckFeedback')),context);
const {Sk}=context;
async function run(code){
 let calls=[],printed='',x=0,y=0,h=0,pen=true;
 Sk.configure({output:t=>printed+=t,read:f=>{if(!Sk.builtinFiles.files[f])throw Error(f);return Sk.builtinFiles.files[f];},__future__:Sk.python3,execLimit:1000});
 for(const name of ['forward','backward','left','right','circle','color','pensize','bgcolor','penup','pendown']){
  Sk.builtins[name]=new Sk.builtin.func(function(a){const v=a===undefined?undefined:Sk.ffi.remapToJs(a);calls.push({name,num:typeof v==='number'?v:null,str:typeof v==='string'?v:null,raw:String(v??'')});
   if(name==='left')h+=v;if(name==='right')h-=v;
   if(name==='forward'||name==='backward'){const d=v*(name==='backward'?-1:1);x+=d*Math.cos(h*Math.PI/180);y+=d*Math.sin(h*Math.PI/180);}
   if(name==='penup')pen=false;if(name==='pendown')pen=true;return Sk.builtin.none.none$;
  });
 }
 let result={ok:true};try{await Sk.misceval.asyncToPromise(()=>Sk.importMainWithBody('<stdin>',false,code,true));}catch(e){result={ok:false,error:String(e)};}
 return {code,run:result,runtime:{calls,printed,x,y,heading:((h%360)+360)%360,penDown:pen}};
}
// Color normalization is independent of canvas in this command-line test.
context.colorValue=v=>String(v).toLowerCase();
const lessons=context.window.PYTHON_COURSE.units[1].lessons;
const solutions=JSON.parse(fs.readFileSync(path.join(root,'pythoncourse/unit-two-solutions.json'),'utf8'));
let checks=0;
for(const l of lessons){
 assert(l.available&&l.starter===''&&l.steps.length>=8&&l.purpose&&l.notes);
 assert.equal(l.steps.filter(s=>s.question).length,2);
 for(const step of l.steps.filter(s=>s.check)){
  const result=context.evaluateStudentCode({check:step.check},await run(solutions[step.id]));
  assert(result.ok,l.id+' required: '+JSON.stringify(result.items.filter(i=>!i.passed)));checks++;
  assert.equal(context.evaluateStudentCode({check:step.check},await run('')).ok,false);
 }
 for(const v of l.visuals){const result=context.evaluateStudentCode(l,await run(v.previewCode));assert(result.ok,l.id+' preview: '+JSON.stringify(result.items.filter(i=>!i.passed)));checks++;}
 for(const s of l.steps.filter(s=>s.question)){assert((await run(s.lab)).run.ok,s.id+' prediction executes');checks++;}
 console.log('PASS '+l.number+' '+l.title);
}
const bad=[
 [0,'for step in range(4):\n    forward(20)\n    left(90)\n    forward(20)\n    right(90)'],
 [1,'for side in range(4):\n    forward(60)\n    left(90)\n    circle(12)'],
 [2,'for row in range(5):\n    print("BRICK")\n    print("[__][__]")'],
 [3,'for side in range(3):\n    forward(70)\n    left(60)'],
 [4,'for petal in range(8):\n    for side in range(4):\n        forward(35)\n        left(90)\nleft(45)'],
 [5,'color("coral")\npensize(3)\nfor petal in range(6):\n    circle(20)\n    left(60)']
];
for(const [i,code] of bad){const check=lessons[i].steps.find(s=>s.check).check;assert.equal(context.evaluateStudentCode({check},await run(code)).ok,false,'Reject incorrect result '+i);}
const l=lessons[0],required=l.steps.find(s=>s.check).check;
const unrolled=Array(5).fill('forward(20)\nleft(90)\nforward(20)\nright(90)').join('\n');assert.equal(context.evaluateStudentCode({check:required},await run(unrolled)).ok,false,'Correct image without loop fails');
assert.equal(context.evaluateStudentCode({check:required},await run('for step in range(5):\nforward(20)')).ok,false,'Python indentation error fails');
for(const rel of ['pythoncourse/index.html','turtle/index.html']){const src=fs.readFileSync(path.join(root,rel),'utf8');for(const m of src.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g))new vm.Script(m[1]);}
console.log(`PASS ${checks} assignment, preview, and prediction programs; wrong output, unrolled code, indentation, and JS syntax checks.`);
