import {createClient} from 'npm:@supabase/supabase-js@2.116.0';
const cors={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'authorization, apikey, content-type','Access-Control-Allow-Methods':'POST, OPTIONS'};
const reply=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{...cors,'Content-Type':'application/json','Cache-Control':'no-store'}});
Deno.serve(async(req:Request)=>{
 if(req.method==='OPTIONS')return new Response('ok',{headers:cors});
 if(req.method!=='POST')return reply({error:'Method not allowed'},405);
 try {
 const b=await req.json();
 if(typeof b.token!=='string'||!/^[a-f0-9]{64}$/.test(b.token))return reply({error:'Invalid setup link.'},403);
 if(typeof b.email!=='string'||b.email.length>254||!/^\S+@\S+\.\S+$/.test(b.email)||typeof b.password!=='string'||b.password.length<12||b.password.length>128)return reply({error:'Enter your email and a password of 12–128 characters.'},400);
 const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(b.token)))).map(x=>x.toString(16).padStart(2,'0')).join('');
 const service=JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS')||'{}').default||Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
 const admin=createClient(Deno.env.get('SUPABASE_URL')!,service,{auth:{persistSession:false,autoRefreshToken:false}});
 const claimedAt=new Date().toISOString();
 const {data:invite,error:claimError}=await admin.from('kq_setup_invites').update({consumed_at:claimedAt}).eq('token_hash',hash).is('consumed_at',null).gt('expires_at',claimedAt).select('class_code').maybeSingle();
 if(claimError||!invite)return reply({error:'This setup link has expired or was already used. If you already created your account, use teacher sign-in.'},403);
 const release=()=>admin.from('kq_setup_invites').update({consumed_at:null}).eq('token_hash',hash).eq('consumed_at',claimedAt);
 const {data:created,error:createError}=await admin.auth.admin.createUser({email:b.email.trim().toLowerCase(),password:b.password,email_confirm:true});
 if(createError||!created.user){await release();return reply({error:'Could not create this login. Check the email and password, or use teacher sign-in if you already have an account.'},400)}
 const {error:profileError}=await admin.from('kq_teachers').insert({user_id:created.user.id,name:'Mr. Steckler',class_code:invite.class_code});
 if(profileError){const {error:cleanupError}=await admin.auth.admin.deleteUser(created.user.id);if(!cleanupError)await release();return reply({error:'Classroom setup could not finish. Please contact your project administrator.'},500)}
 return reply({created:true});
 }catch{return reply({error:'Setup could not finish. Please try again.'},500)}
});
