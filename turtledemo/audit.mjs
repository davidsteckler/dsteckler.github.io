/**
 * Render real Turtle programs inside Chromium, inspect pixel metrics,
 * Visual review pass 3: verify final dragon, ball and Koch geometry alongside all 333.
 * and create labeled contact sheets for human review.
 */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { chromium } from "playwright";
import sharp from "sharp";

const SHARDS=Number(process.env.TURTLE_SHARDS||4);
const SHARD=Number(process.env.TURTLE_SHARD||0);
const dir=process.cwd();
const outDir=path.join(dir,"turtledemo","audit-output",String(SHARD));
fs.mkdirSync(outDir,{recursive:true});
const html=fs.readFileSync(path.join(dir,"turtledemo","index.html"),"utf8");
const prefix="var DEMO_PROGRAMS=";
const first=html.indexOf(prefix)+prefix.length;
const last=html.indexOf(".concat(window.CURATED_EXAMPLES",first);
if(first<prefix.length||last<0)throw Error("Gallery dataset not found");
const originals=JSON.parse(html.slice(first,last));
const sandbox={window:{CURATED_EXAMPLES:[]}};
vm.createContext(sandbox);
for(const letter of "abcdef"){
  const file=path.join(dir,"turtledemo","curated-"+letter+".js");
  vm.runInContext(fs.readFileSync(file,"utf8"),sandbox,{filename:file});
}
const all=[...originals,...sandbox.window.CURATED_EXAMPLES];
const selected=all.filter((_,i)=>i%SHARDS===SHARD);
console.log("Shard "+SHARD+": "+selected.length+" of "+all.length);
const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
const context=await browser.newContext({viewport:{width:1320,height:850},reducedMotion:"reduce"});
let page;
const consoleErrors=[];
const server="http://127.0.0.1:8765/turtledemo/?renderPreview=1&audit=1";
async function load(){
  page=await context.newPage();
  page.on("pageerror",e=>consoleErrors.push(String(e)));
  await page.goto(server,{waitUntil:"domcontentloaded",timeout:50000});
  await page.waitForFunction(()=>typeof window.Sk!=="undefined"&&typeof window.CodeMirror!=="undefined",{timeout:50000});
  await page.waitForTimeout(250);
}
await load();
const records=[],images=[];
async function render(d){
  const begun=Date.now();
  let reply;
  try{
    reply=await page.evaluate(async item=>{
      const wait=new Promise((resolve,reject)=>{
        const listener=event=>{
          if(event.origin!==location.origin||!event.data||event.data.kind!=="turtle-rendered"||event.data.id!==item.id)return;
          clearTimeout(timer);window.removeEventListener("message",listener);resolve(event.data);
        };
        const timer=setTimeout(()=>{window.removeEventListener("message",listener);reject(Error("30-second timeout"));},30000);
        window.addEventListener("message",listener);
      });
      window.postMessage({kind:"turtle-render",id:item.id,code:item.code},location.origin);
      return await wait;
    },{id:d.id,code:d.code});
  }catch(e){
    return {id:d.id,title:d.title,category:d.category,error:String(e),ms:Date.now()-begun};
  }
  const rec={id:d.id,title:d.title,category:d.category,ms:Date.now()-begun,error:reply.error||null};
  if(!reply.image){rec.error=rec.error||"Renderer returned no drawing";return rec;}
  try{
    const png=Buffer.from(reply.image.split(",")[1],"base64");
    fs.writeFileSync(path.join(outDir,d.id+".png"),png);
    const {data,info}=await sharp(png).removeAlpha().raw().toBuffer({resolveWithObject:true});
    const bg=[data[0],data[1],data[2]];
    let ink=0,minX=400,minY=400,maxX=-1,maxY=-1,edgeInk=0;
    const colors=new Set();
    for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++){
      const k=(y*info.width+x)*3,r=data[k],g=data[k+1],b=data[k+2];
      if(x%13===0&&y%13===0)colors.add(((r>>4)<<8)|((g>>4)<<4)|(b>>4));
      if(Math.max(Math.abs(r-bg[0]),Math.abs(g-bg[1]),Math.abs(b-bg[2]))<32)continue;
      ink++;minX=Math.min(minX,x);minY=Math.min(minY,y);maxX=Math.max(maxX,x);maxY=Math.max(maxY,y);
      if(x<3||y<3||x>=info.width-3||y>=info.height-3)edgeInk++;
    }
    rec.coverage=ink/(info.width*info.height);
    rec.bounds=[minX,minY,maxX,maxY];
    rec.edgeInk=edgeInk;
    rec.colorBins=colors.size;
    rec.warnings=[];
    if(rec.coverage<.002)rec.warnings.push("blank");
    if(rec.coverage>.99)rec.warnings.push("high coverage");
    if(edgeInk>25)rec.warnings.push("possible clipping");
    images.push({id:d.id,title:d.title,buffer:png,rec});
  }catch(error){rec.error=String(error);}
  return rec;
}
for(let i=0;i<selected.length;i++){
  const d=selected[i];
  const rec=await render(d);
  records.push(rec);
  console.log("["+ (i+1)+"/"+selected.length+"] "+d.title+": "+(rec.error?"ERROR "+rec.error:"ok "+(100*rec.coverage).toFixed(1)+"% ink")+" "+rec.ms+"ms");
  fs.writeFileSync(path.join(outDir,"audit.json"),JSON.stringify({shard:SHARD,total:all.length,records,consoleErrors},null,2));
  if(i%25===24){
    await page.close().catch(()=>{});
    await load();
  }
}
for(let start=0;start<images.length;start+=30){
  const batch=images.slice(start,start+30),composite=[];
  for(let i=0;i<batch.length;i++){
    const row=Math.floor(i/6),col=i%6,x=col*240,y=row*265;
    const {id,title,buffer,rec}=batch[i];
    const thumb=await sharp(buffer).resize(211,211,{fit:"contain",background:"#ffffff"}).png().toBuffer();
    composite.push({input:thumb,left:x+14,top:y+5});
    const safe=title.replaceAll("&","&amp;").replaceAll("<","&lt;");
    const color=rec.error?"#f4cdcd":rec.warnings?.length?"#f4e9c3":"#eeeae1";
    const line=rec.error?"ERROR":(rec.warnings?.join(", ")||rec.id).slice(0,35);
    const label='<svg xmlns="http://www.w3.org/2000/svg" width="240" height="49">'
      +'<rect width="240" height="49" fill="'+color+'"/>'
      +'<text x="120" y="17" text-anchor="middle" font-family="Arial" font-size="13" font-weight="bold" fill="#263c45">'+safe+'</text>'
      +'<text x="120" y="36" text-anchor="middle" font-family="Arial" font-size="11" fill="#62777c">'+line+'</text></svg>';
    composite.push({input:Buffer.from(label),left:x,top:y+216});
  }
  const sheet=await sharp({create:{width:1440,height:1325,channels:3,background:"#eeeae1"}}).composite(composite).png().toBuffer();
  fs.writeFileSync(path.join(outDir,"contact-"+(Math.floor(start/30)+1)+".png"),sheet);
}
await browser.close();
console.log("AUDIT_SUMMARY "+JSON.stringify({
  shard:SHARD,total:records.length,
  errors:records.filter(x=>x.error).map(x=>[x.title,x.error]),
  clipped:records.filter(x=>x.edgeInk>25).map(x=>x.title),
  blank:records.filter(x=>x.warnings?.includes("blank")).map(x=>x.title),
  consoleErrors:consoleErrors.slice(0,12)
}));
