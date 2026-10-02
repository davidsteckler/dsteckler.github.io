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
function normalize(value){const digits=value.trim().replace(/^#/,'');if(/^[0-9a-f]{6}$/i.test(digits))return '#'+digits.toLowerCase();if(/^[0-9a-f]{3}$/i.test(digits))return '#'+[...digits].map(x=>x+x).join('').toLowerCase();return null;}
function select(value,updateInput=true){
 const hex=normalize(value),valid=!!hex;copyRequest++;
 $('hexInput').setAttribute('aria-invalid',String(!valid));$('hexError').hidden=valid;$('copyHex').disabled=!valid;$('copyCommand').disabled=!valid;
 $('copyStatus').textContent='The # is included when you copy.';
 if(!valid)return;
 selected=hex;if(updateInput)$('hexInput').value=hex;$('colorPicker').value=hex;$('colorPreview').style.backgroundColor=hex;$('previewCode').textContent=hex;
 const rgb=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16));$('previewCode').style.color=rgb[0]*.299+rgb[1]*.587+rgb[2]*.114>150?'#172b25':'#ffffff';
 $('copyHex').textContent='Copy '+hex;$('turtleCode').textContent='color("'+hex+'")';
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
let initial='#008080';try{initial=normalize(localStorage.getItem('dsteckler-hex-color-v1')||'')||initial;}catch{}select(initial);
})();
