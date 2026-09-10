import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const source=fs.readFileSync('supabase/functions/keyquest-admin/index.ts','utf8').replace(/^import .*\n/,'');
async function test(role,target,expected,fail=false){
 const calls=[];let handle;
 const admin={auth:{getUser:async()=>role==='anon'?{data:{},error:true}:{data:{user:{id:role}},error:null},admin:{deleteUser:async id=>{calls.push(id);return {error:fail?Error('test failure'):null}}}},from(table){const filters={};return {select(){return this},eq(k,v){filters[k]=v;return this},async maybeSingle(){if(table==='kq_teachers')return {data:role==='teacher'?{user_id:'teacher',class_code:'abc123'}:null};assert.equal(filters.owner,'teacher');return {data:filters.id==='own-student'?{id:'own-student',user_id:'student-auth',owner:'teacher'}:null}}}}};
 vm.runInNewContext(ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText,{createClient:()=>admin,Deno:{env:{get:k=>k==='SUPABASE_SECRET_KEYS'?'{}':'test'},serve:h=>handle=h},Response,console:{error(){}},Error});
 const response=await handle(new Request('https://test.invalid',{method:'POST',headers:{Authorization:'Bearer test','Content-Type':'application/json'},body:JSON.stringify({action:'delete',learnerId:target})}));
 assert.equal(response.status,expected);
 assert.deepEqual(calls,role==='teacher'&&target==='own-student'?['student-auth']:[]);
}
await test('anon','own-student',401);await test('student','own-student',403);await test('teacher','other-class',404);await test('teacher','own-student',200);await test('teacher','own-student',400,true);
console.log('Delete handler passed: auth, role, ownership, exact target, and API failure checks.');
