(() => {
'use strict';
const $=id=>document.getElementById(id);
const palettes=[
 ['Bright',['#ff6b6b','#ff922b','#ffd43b','#69db7c','#38d9a9','#22b8cf','#748ffc','#da77f2']],
 ['Neon',['#ff0080','#ff4d00','#ffff00','#aaff00','#00ffcc','#00bfff','#8a2bff','#ff00ff']],
 ['Sunset',['#392061','#6c3b8e','#a54c8c','#ee6c7a','#f58b6b','#ffbd69','#ffe3a3','#fff0d2']],
 ['Ocean',['#102a43','#174a67','#176b73','#008080','#14b8a6','#5eead4','#a5f3fc','#e0f7fa']],
 ['Forest',['#18392b','#285943','#427a4f','#6a994e','#a7c957','#d4df9a','#c5a66b','#7f5539']],
 ['Soft shades',['#ffd6e0','#ffe5c2','#fff2b2','#d9edc2','#c7e9e5','#c8e2ff','#d9ccff','#e8dff5']]
];
let selected='#008080',copyRequest=0;
let refreshPixelLab=()=>{};
function normalize(value){const digits=value.trim().replace(/^#/,'');if(/^[0-9a-f]{6}$/i.test(digits))return '#'+digits.toLowerCase();if(/^[0-9a-f]{3}$/i.test(digits))return '#'+[...digits].map(x=>x+x).join('').toLowerCase();return null;}
function select(value,updateInput=true){
 const hex=normalize(value),valid=!!hex;copyRequest++;
 $('hexInput').setAttribute('aria-invalid',String(!valid));$('hexError').hidden=valid;$('copyHex').disabled=!valid;$('copyCommand').disabled=!valid;
 $('copyStatus').textContent='The # is included when you copy.';
 if(!valid)return;
 selected=hex;if(updateInput)$('hexInput').value=hex;$('colorPicker').value=hex;$('colorPreview').style.backgroundColor=hex;$('previewCode').textContent=hex;
 const rgb=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16));$('rgbReadout').textContent='Red '+rgb[0]+' · Green '+rgb[1]+' · Blue '+rgb[2];$('previewCode').style.color=rgb[0]*.299+rgb[1]*.587+rgb[2]*.114>150?'#172b25':'#ffffff';
 $('copyHex').textContent='Copy '+hex;$('turtleCode').textContent='color("'+hex+'")';
 refreshPixelLab();
 document.querySelectorAll('.swatch').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.hex===hex)));
 try{localStorage.setItem('dsteckler-hex-color-v1',hex);}catch{}
}
async function copy(text){
 const request=++copyRequest;
 try{
  try{await navigator.clipboard.writeText(text);}catch{
   const field=document.createElement('textarea');field.value=text;field.style.cssText='position:fixed;opacity:0;left:0;top:0';document.body.appendChild(field);field.select();const ok=document.execCommand('copy');field.remove();if(!ok)throw Error('copy unavailable');
  }
  if(request===copyRequest)$('copyStatus').textContent='Copied '+text;
 }catch{if(request===copyRequest){$('hexInput').focus();$('hexInput').select();$('copyStatus').textContent='Select the code and press Ctrl+C (⌘C on Mac).';}}
}
for(const [name,colors] of palettes){const section=document.createElement('section');section.className='palette';const heading=document.createElement('h3');heading.textContent=name;section.appendChild(heading);const swatches=document.createElement('div');swatches.className='swatches';
 for(const hex of colors){const button=document.createElement('button');button.type='button';button.className='swatch';button.dataset.hex=hex;button.setAttribute('aria-label','Select '+hex);button.setAttribute('aria-pressed','false');const color=document.createElement('span');color.className='swatch-color';color.style.backgroundColor=hex;const code=document.createElement('span');code.className='swatch-code';code.textContent=hex;button.append(color,code);button.addEventListener('click',()=>select(hex));swatches.appendChild(button);}section.appendChild(swatches);$('paletteList').appendChild(section);}
$('colorPicker').addEventListener('input',()=>select($('colorPicker').value));$('hexInput').addEventListener('input',()=>select($('hexInput').value,false));$('hexInput').addEventListener('blur',()=>{if(normalize($('hexInput').value))select($('hexInput').value);});
$('copyHex').addEventListener('click',()=>copy(selected));$('copyCommand').addEventListener('click',()=>copy('color("'+selected+'")'));

const eye=$('eyedropper');
if('EyeDropper' in window){
 $('eyedropperHint').textContent='Choose a pixel anywhere on your screen. Press Escape to cancel.';
 eye.addEventListener('click',async()=>{eye.disabled=true;try{const result=await new EyeDropper().open();select(result.sRGBHex);$('eyedropperHint').textContent='Picked '+selected+' from your screen.';}catch(error){$('eyedropperHint').textContent=error.name==='AbortError'?'Canceled. Your selected color is unchanged.':'Screen picking is unavailable right now. Use the color picker above.';}finally{eye.disabled=false;}});
}else{eye.hidden=true;$('eyedropperHint').textContent='Your browser’s color picker may include an eyedropper. Open “Choose any shade” to look for it.';}
const original=$('pixelOriginal'),magnified=$('pixelMagnified'),w=88,h=32;
const mask=document.createElement('canvas');mask.width=w*9;mask.height=h*9;const mc=mask.getContext('2d',{willReadFrequently:true});mc.fillStyle='#000';mc.font='bold 216px sans-serif';mc.textBaseline='middle';mc.fillText('Turtle',3*9,17*9);
const coverage=mc.getImageData(0,0,mask.width,mask.height).data;
let pixelMode='smooth',pixelData=null,sampleHex=null,samplePoint={x:20,y:16};
function amount(x,y,start=0,end=9){let sum=0;for(let yy=0;yy<9;yy++)for(let xx=start;xx<end;xx++)sum+=coverage[(((y*9+yy)*mask.width)+(x*9+xx))*4+3]/255;return sum/(9*(end-start));}
function inspect(x,y){x=Math.max(0,Math.min(w-1,x));y=Math.max(0,Math.min(h-1,y));samplePoint={x,y};const rgb=Array.from(pixelData.data.slice((y*w+x)*4,(y*w+x)*4+3));sampleHex='#'+rgb.map(v=>v.toString(16).padStart(2,'0')).join('');$('pixelSwatch').style.backgroundColor=sampleHex;$('pixelReadout').textContent='Pixel '+x+', '+y+' · '+sampleHex+' · RGB '+rgb.join(', ');$('usePixel').disabled=false;}
refreshPixelLab=()=>{
 const rgb=[1,3,5].map(i=>parseInt(selected.slice(i,i+2),16));const ctx=original.getContext('2d'),data=ctx.createImageData(w,h);
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){const a=amount(x,y);for(let c=0;c<3;c++){const blend=pixelMode==='hard'?(a>=.5?1:0):pixelMode==='subpixel'?amount(x,y,c*3,c*3+3):a;data.data[(y*w+x)*4+c]=Math.round(255+(rgb[c]-255)*blend);}data.data[(y*w+x)*4+3]=255;}
 pixelData=data;ctx.putImageData(data,0,0);magnified.getContext('2d').putImageData(data,0,0);const zoom=Number($('pixelZoom').value);magnified.style.width=w*zoom+'px';magnified.style.height=h*zoom+'px';$('pixelZoomValue').textContent=zoom+'×';if(sampleHex)inspect(samplePoint.x,samplePoint.y);
};
const modeNotes={hard:'Each pixel is either your color or white. Look at the stair-step edges.',smooth:'Smooth edges blend your selected color with white. Look for lighter shades around the letters.',subpixel:'This RGB model blends each color channel separately. Try a dark color and look for colored fringes along the edges.'};
document.querySelectorAll('[data-pixel-mode]').forEach(button=>button.addEventListener('click',()=>{pixelMode=button.dataset.pixelMode;document.querySelectorAll('[data-pixel-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));$('pixelModeNote').textContent=modeNotes[pixelMode];refreshPixelLab();}));
$('pixelZoom').addEventListener('input',refreshPixelLab);
magnified.addEventListener('click',event=>{const rect=magnified.getBoundingClientRect();inspect(Math.floor((event.clientX-rect.left)*w/rect.width),Math.floor((event.clientY-rect.top)*h/rect.height));});
magnified.addEventListener('keydown',event=>{const moves={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]};if(moves[event.key]){event.preventDefault();inspect(samplePoint.x+moves[event.key][0],samplePoint.y+moves[event.key][1]);}else if(event.key==='Enter'||event.key===' '){event.preventDefault();inspect(samplePoint.x,samplePoint.y);}});
$('usePixel').addEventListener('click',()=>{if(sampleHex)select(sampleHex);});
let initial='#008080';try{initial=normalize(localStorage.getItem('dsteckler-hex-color-v1')||'')||initial;}catch{}select(initial);
})();
