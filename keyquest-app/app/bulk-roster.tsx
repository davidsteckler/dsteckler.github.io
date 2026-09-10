import {useEffect,useRef,useState} from 'react';
import {progressRequest} from './cloud';
type Learner={id:string;name:string};
type Card={id:string;name:string;code:string};
export function rosterNames(text:string){return [...new Set(text.split(/[\n,]/).map(s=>s.trim().replace(/[’‘]/g,"'").toLowerCase()).filter(Boolean))];}
export default function BulkRoster({classCode,onCreated}:{classCode:string;onCreated:(l:Learner,code:string)=>void}){
 const [text,setText]=useState(''),[open,setOpen]=useState(false),[busy,setBusy]=useState(false),[status,setStatus]=useState(''),[cards,setCards]=useState<Card[]>([]);const lock=useRef(false);
 useEffect(()=>{const params=new URLSearchParams(window.location.hash.slice(1)),roster=params.get('roster');if(roster){setText(rosterNames(roster).join('\n'));setOpen(true);window.history.replaceState(null,'',window.location.pathname+window.location.search)}},[]);
 const names=rosterNames(text),invalid=names.some(n=>n.length>40)||names.length>50;
 async function create(){if(lock.current||!names.length||invalid)return;lock.current=true;setBusy(true);let made=0,skipped=0;try{
  const response=await progressRequest('/progress');const snapshot=await response.json();if(!response.ok)throw Error(snapshot.error||'Could not load your roster.');
  const existing=new Set<string>(snapshot.learners.map((l:Learner)=>l.name.trim().toLowerCase()));
  for(const name of names){if(existing.has(name)){skipped++;continue}setStatus(`Creating ${name}…`);
   const r=await progressRequest('/progress',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'learner',name})});const b=await r.json();if(!r.ok)throw Error(b.error||`Could not create ${name}.`);
   if(!b.studentCode)throw Error(`Account created for ${name}, but its code was not returned. Use Login card to get a replacement.`);
   const card={id:b.id,name:b.name,code:b.studentCode};setCards(all=>[...all,card]);onCreated({id:b.id,name:b.name},b.studentCode);existing.add(name);made++;
  }
  setStatus(`${made} new logins created. ${skipped} existing students skipped. Download the new login cards below.`);
 }catch(e:any){setStatus(`${e.message} ${made} logins created so far. Download any cards below before refreshing. You can retry; existing students will be skipped.`)}finally{lock.current=false;setBusy(false)}}
 function download(){const content=cards.map(c=>`KEYQUEST STUDENT LOGIN\nName: ${c.name}\nWebsite: https://dsteckler.com/keyquest/?class=${classCode}\nClass code: ${classCode}\nStudent code: ${c.code}\nOpen the website. Enter your student code. Click Sign in.\n`).join('\n------------------------------\n\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([content],{type:'text/plain'}));a.download='keyquest-class-login-cards.txt';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
 return <section className="panel bulk-roster"><button className="soft" aria-expanded={open} onClick={()=>setOpen(v=>!v)}>Add a whole class</button>{open&&<><h2>Create student logins together</h2><p>Enter one first name per line. Existing names are skipped, and their current codes stay the same.</p><label htmlFor="roster-names">Student first names</label><textarea id="roster-names" rows={8} maxLength={2050} value={text} disabled={busy} onChange={e=>setText(e.target.value)} placeholder={'First name\nFirst name'}/><p>{names.length} names · Class code: <strong>{classCode}</strong></p>{invalid&&<p role="alert">Use up to 50 names, each no longer than 40 characters.</p>}<button disabled={busy||!names.length||invalid} onClick={create}>{busy?'Creating student logins…':'Create missing student logins'}</button></>}{status&&<p role="status">{status}</p>}{cards.length>0&&<><h3>New login cards</h3><p>Download these before refreshing or signing out. Each student gets their own code.</p><button className="soft" onClick={download}>Download all new login cards</button><table><thead><tr><th>Student</th><th>Student code</th></tr></thead><tbody>{cards.map(c=><tr key={c.id}><td>{c.name}</td><td><code>{c.code}</code></td></tr>)}</tbody></table></>}</section>
}
