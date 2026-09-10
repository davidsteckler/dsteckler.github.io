import {stories,storyAt} from '../app/stories.ts';
import {raceScore,wordRange} from '../app/race.ts';
import {questPrompt,copyChunks,facts} from '../app/quest.ts';
import assert from 'node:assert/strict';
import {lessons,phases} from '../app/curriculum.ts';
import {runClassroomPython} from '../app/code-lab.ts';
assert.equal(lessons.length,50);
assert.equal(phases.reduce((sum,p)=>sum+p.minutes,0),42);
for(const l of lessons)assert(l.choices.includes(l.answer));
assert.equal(runClassroomPython(lessons[37].example).output,'1\n2');
assert(runClassroomPython('import os').error);
const saved=new Map();globalThis.sessionStorage={getItem:k=>saved.get(k)||null,setItem:(k,v)=>saved.set(k,v),removeItem:k=>saved.delete(k)};
globalThis.window={KEYQUEST_CONFIG:{supabaseUrl:'https://test.invalid',supabasePublishableKey:'public-test-key'}};
const calls=[];
globalThis.fetch=async(url,opts={})=>{calls.push({url,opts});
 if(url.includes('/auth/v1/token'))return Response.json({access_token:'test-access',refresh_token:'test-refresh',expires_in:3600});
 if(url.endsWith('/auth/v1/user'))return Response.json({id:'student-1'});
 if(url.includes('/kq_teachers'))return Response.json([]);
 if(url.includes('/kq_learners'))return Response.json([{id:'learner-1',name:'Blue Fox'}]);
 if(url.includes('/kq_sessions')&&opts.method==='POST')return new Response(null,{status:201});
 if(url.includes('/kq_sessions')){const start=Number(opts.headers.Range.split('-')[0]);return Response.json(Array.from({length:Math.min(500,1001-start)},(_,i)=>({id:'s'+(start+i),learner:'learner-1',lesson:1,payload:{correct:20},created:'2026-09-09'})));}
 if(url.includes('/logout'))return new Response(null,{status:204});
 throw Error('Unexpected request: '+url);
};
const cloud=await import('../app/cloud.ts');
const a=await cloud.studentCredentials('ABC123','12345678');
const b=await cloud.studentCredentials('abc123','1234 5678');
assert.deepEqual(a,b);assert(a.email.endsWith('@students.keyquest.invalid'));assert(!a.email.includes('12345678'));assert.equal(a.password,'Kq!abc123:12345678');
await assert.rejects(cloud.studentCredentials('abc123','12'));
const identity=await cloud.signIn(a.email,a.password);assert.equal(identity.role,'student');assert.equal(identity.name,'Blue Fox');
const r=await cloud.progressRequest('/progress');const body=await r.json();assert.equal(body.sessions.length,1001);assert.equal(body.learners.length,1);
const write=await cloud.progressRequest('/progress',{body:JSON.stringify({action:'session',session:{id:'s1',learner:'learner-1',lesson:2,correct:20}})});assert.equal((await write.json()).saved,true);
const posted=calls.find(c=>c.opts.method==='POST'&&c.url.includes('/kq_sessions'));assert.equal(JSON.parse(posted.opts.body).learner,'learner-1');assert.equal(posted.opts.headers.Prefer,'resolution=ignore-duplicates,return=minimal');
await cloud.signOut();assert.equal(cloud.hasSession(),false);assert.equal(saved.has('keyquest-auth'),false);
console.log('Passed curriculum, interpreter, code normalization, student identity, 1,001-record pagination, idempotent save request, and sign-out checks. Supabase authorization still requires live verification.');

assert.equal(facts.length,50);
assert.equal(questPrompt(0,1).level,1);
assert.equal(questPrompt(5,1).level,2);
assert.equal(questPrompt(50000,1).level,10001);
assert.notEqual(questPrompt(0,1).sentence,questPrompt(1,1).sentence);
for(let i=0;i<2000;i++){
 const q=questPrompt(i,(i%50)+1);
 assert(/^[a-z ]+$/.test(q.sentence));
 assert(q.sentence.length<=48);
 for(const mode of ['letters','words','phrases'])assert.equal(copyChunks(q.sentence,mode).join(''),q.sentence);
}
assert.equal(phases.some(p=>['create','check','reflect','read'].includes(p.kind)),false);
console.log('Passed continuing levels, copy chunks including spaces, short controlled prompts, and copying-only activity checks.');

const score=raceScore('a cat',5,6,15);
assert.equal(score.wpm,4);
assert.equal(score.accuracy,83);
assert.equal(score.points,142);
assert.equal(raceScore('a',1,1,.2).wpm,0);
assert.deepEqual(wordRange('a cat',3),{from:2,to:5});
assert.deepEqual(wordRange('a cat',1),{from:0,to:1});
console.log('Passed race speed, accuracy, transparent scoring, and stable-passage word highlights.');

assert.equal(stories.length,12);
for(const story of stories){assert.equal(story.lines.length,5);assert.equal(story.reveals.length,5);for(const line of story.lines){assert(/^[a-z ]+$/.test(line));assert(line.length<=30)}}
assert.equal(storyAt(4).finished,true);assert.equal(storyAt(5).scene,0);assert.notEqual(storyAt(4).title,storyAt(5).title);assert.equal(storyAt(60).title,storyAt(0).title);
console.log('Passed 60 short copy scenes, connected mission endings, and repeat-cycle checks.');
