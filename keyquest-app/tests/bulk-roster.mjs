import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const code=ts.transpileModule(fs.readFileSync('app/bulk-roster.tsx','utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText;
async function scenario(fail=false){
 const calls=[],created=[],states=[],exports={};let index=0;
 const react={useState(v){const i=index++;states[i]=i===0?"existing, new kid\nnew kid\nja’lynn":i===1?true:v;return[states[i],x=>{states[i]=typeof x==='function'?x(states[i]):x}]},useEffect(){},useRef:v=>({current:v})};
 const request=async(path,options)=>{if(!options)return{ok:true,json:async()=>({learners:[{id:'old',name:'existing'}]})};const body=JSON.parse(options.body);calls.push(body);if(fail&&body.name==="ja'lynn")return{ok:false,json:async()=>({error:'Network failure'})};return{ok:true,json:async()=>({id:body.name,name:body.name,studentCode:'12345678'})}};
 vm.runInNewContext(code,{exports,require:name=>name==='react'?react:name==='react/jsx-runtime'?{jsx:(type,props)=>({type,props}),jsxs:(type,props)=>({type,props})}:name==='./cloud'?{progressRequest:request}:null});
 assert.deepEqual(Array.from(exports.rosterNames(" JANE, jane\nJa’Lynn ")),['jane',"ja'lynn"]);
 const tree=exports.default({classCode:'class1',onCreated:(l,code)=>created.push({l,code})});
 function find(node){if(!node)return;if(Array.isArray(node)){for(const x of node){const r=find(x);if(r)return r}}else if(node.props){if(node.type==='button'&&node.props.children==='Create missing student logins')return node.props.onClick;return find(node.props.children)}}
 const create=find(tree);assert.equal(typeof create,'function');await Promise.all([create(),create()]);
 assert.deepEqual(calls.map(c=>c.name),['new kid',"ja'lynn"]);assert.ok(calls.every(c=>c.action==='learner'));
 assert.equal(created.length,fail?1:2);assert.equal(states[4].length,fail?1:2);assert.equal(states[2],false);
 assert.match(states[3],fail?/Network failure/:/2 new logins created. 1 existing students skipped/);
}
await scenario();await scenario(true);console.log('Bulk roster: deduplication, apostrophes, existing accounts, double-click lock, and partial failure passed.');
