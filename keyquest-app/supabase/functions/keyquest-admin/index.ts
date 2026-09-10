import {createClient} from 'npm:@supabase/supabase-js@2.116.0';
const cors={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type','Access-Control-Allow-Methods':'POST, OPTIONS'};
const reply=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{...cors,'Content-Type':'application/json','Cache-Control':'no-store'}});
Deno.serve(async(req:Request)=>{
 if(req.method==='OPTIONS')return new Response('ok',{headers:cors});
 if(req.method!=='POST')return reply({error:'Method not allowed'},405);
 const url=Deno.env.get('SUPABASE_URL')!,service=JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS')||'{}').default||Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
 const admin=createClient(url,service,{auth:{persistSession:false,autoRefreshToken:false}});
 const token=(req.headers.get('Authorization')||'').replace(/^Bearer /,'');
 const {data:auth,error:authError}=await admin.auth.getUser(token);
 if(authError||!auth.user)return reply({error:'Please sign in again.'},401);
 const {data:teacher,error:teacherError}=await admin.from('kq_teachers').select('user_id,class_code').eq('user_id',auth.user.id).maybeSingle();
 if(teacherError||!teacher)return reply({error:'Teacher access required.'},403);
 try{
 const b=await req.json();if(!['create','reset','delete'].includes(b.action))return reply({error:'Unknown action'},400);
 let learner:any=null;
 if(b.action==='reset'||b.action==='delete'){const {data,error}=await admin.from('kq_learners').select('id,name,user_id').eq('id',b.learnerId).eq('owner',teacher.user_id).maybeSingle();if(error||!data)return reply({error:'Student not found'},404);learner=data;}
 if(b.action==='delete'){const {error}=await admin.auth.admin.deleteUser(learner.user_id);if(error)throw error;return reply({deleted:true,id:learner.id});}
 if(b.action==='create'&&(typeof b.name!=='string'||!b.name.trim()||b.name.trim().length>40))return reply({error:'Use a nickname of 1–40 characters.'},400);
 const bytes=crypto.getRandomValues(new Uint8Array(64));let studentCode='';for(const byte of bytes){if(byte<250)studentCode+=String(byte%10);if(studentCode.length===8)break;}if(studentCode.length!==8)throw Error('Code generation failed');
 const combined=teacher.class_code+':'+studentCode;
 const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(combined));
 const email=Array.from(new Uint8Array(digest)).map(b=>b.toString(16).padStart(2,'0')).join('')+'@students.keyquest.invalid';
 const password='Kq!'+combined;
 if(learner){const {error}=await admin.auth.admin.updateUserById(learner.user_id,{email,password,email_confirm:true});if(error)throw error;return reply({id:learner.id,name:learner.name,studentCode});}
 const {data:created,error:createError}=await admin.auth.admin.createUser({email,password,email_confirm:true});if(createError||!created.user)throw createError||Error('Could not create account');
 const {data:profile,error:insertError}=await admin.from('kq_learners').insert({owner:teacher.user_id,user_id:created.user.id,name:b.name.trim()}).select('id,name').single();
 if(insertError){await admin.auth.admin.deleteUser(created.user.id);throw insertError;}
 return reply({...profile,studentCode});
 }catch(error){console.error('KeyQuest admin failed',error instanceof Error?error.message:'Request error');return reply({error:'The account change could not finish. Try again.'},400)}
});
