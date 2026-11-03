(() => {
  'use strict';
  const base=Number(document.body.dataset.numberBase),digits='0123456789ABCDEF',max=base**4-1;
  let value=45;
  const byId=id=>document.getElementById(id),format=n=>n.toLocaleString('en-US');
  const places=[3,2,1,0].map(exponent=>{
    const place=base**exponent,card=document.createElement('div');card.className='place-card';
    card.innerHTML='<div class="place-number">'+format(place)+'</div><span class="place-power">'+base+'<sup>'+exponent+'</sup></span><select class="place-digit" aria-label="Digit in the '+format(place)+' place">'+Array.from({length:base},(_,d)=>'<option value="'+d+'">'+digits[d]+'</option>').join('')+'</select><span class="place-contribution"></span>';
    byId('places').append(card);
    const input=card.querySelector('select');
    input.addEventListener('change',()=>{const previous=Math.floor(value/place)%base;value+=(Number(input.value)-previous)*place;render();});
    return {place,input,output:card.querySelector('.place-contribution')};
  });
  function render(){
    const written=value.toString(base).toUpperCase().padStart(4,'0');
    byId('baseReadout').innerHTML=written+'<sub>'+base+'</sub>';
    byId('decimalInput').value=value;byId('valueSlider').value=value;
    byId('decreaseValue').disabled=value===0;byId('increaseValue').disabled=value===max;
    const terms=[];
    places.forEach(c=>{const d=Math.floor(value/c.place)%base;c.input.value=d;c.output.textContent=digits[d]+' × '+format(c.place)+' = '+format(d*c.place);if(d)terms.push(d+' × '+format(c.place));});
    byId('baseExpansion').textContent=(terms.length?terms.join(' + '):'0')+' = '+format(value)+' in decimal';
    for(const radix of [2,8,10,16])byId('convert'+radix).textContent=value.toString(radix).toUpperCase();
    const last=digits[base-1];
    byId('carryExample').textContent='In base '+base+', '+last+' + 1 is written 10. That means 1 group of '+base+' and 0 ones.';
  }
  function setValue(n){if(!Number.isFinite(n))return;value=Math.max(0,Math.min(max,Math.round(n)));render();}
  byId('decimalInput').max=max;byId('valueSlider').max=max;
  byId('workbenchRange').textContent='Four digits · decimal values 0–'+format(max);
  byId('decimalInput').addEventListener('input',e=>{if(e.target.value!=='')setValue(e.target.valueAsNumber);});
  byId('decimalInput').addEventListener('change',e=>setValue(e.target.value===''?0:e.target.valueAsNumber));
  byId('valueSlider').addEventListener('input',e=>setValue(Number(e.target.value)));
  byId('decreaseValue').onclick=()=>setValue(value-1);byId('increaseValue').onclick=()=>setValue(value+1);
  const presetValues=[0,base-1,base,base**2-1,base**2,max];
  presetValues.forEach(n=>{const b=document.createElement('button');b.type='button';b.textContent=n.toString(base).toUpperCase();b.setAttribute('aria-label','Show '+b.textContent+' in base '+base);b.onclick=()=>setValue(n);byId('basePresets').append(b);});
  byId('randomValue').onclick=()=>setValue(Math.floor(Math.random()*(max+1)));
  render();
})();
