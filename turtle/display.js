(() => {
  'use strict';
  const workbench=window.TurtleWorkbench;
  const unit1=document.body.classList.contains('unit1-embed');
  if(!workbench||workbench.isTrace||(workbench.isCourse&&!unit1))return;
  const key=unit1?'dsteckler-turtlecourse-view-v1':'dsteckler-turtle-display-v1';
  const defaults={code:16,drawing:100,output:14};
  const controls=[['codeFontSize','code',' px'],['drawingZoom','drawing','%'],['outputFontSize','output',' px']];
  let settings={...defaults};
  try{
    const saved=JSON.parse(localStorage.getItem(key)||'null');
    if(saved)for(const [,field] of controls)if(Number.isFinite(saved[field]))settings[field]=saved[field];
  }catch{}
  // Put the controls exactly where students need them: inside the code panel,
  // just above the editable code. Other Turtle pages keep their existing layout.
  if(unit1){
    const panel=document.querySelector('.code-panel');
    const heading=panel&&panel.querySelector('.panel-head');
    const bar=document.querySelector('.layoutbar');
    if(heading&&bar){
      heading.insertAdjacentElement('afterend',bar);
      const codeLabel=bar.querySelector('label[for="codeFontSize"]');
      const outputLabel=bar.querySelector('label[for="outputFontSize"]');
      if(codeLabel)codeLabel.textContent='Code';
      if(outputLabel)outputLabel.textContent='Output';
    }
  }
  function apply(save=false){
    for(const [id,field,unit] of controls){
      const slider=document.getElementById(id);
      settings[field]=Math.max(Number(slider.min),Math.min(Number(slider.max),Number(settings[field])||defaults[field]));
      slider.value=String(settings[field]);
      document.getElementById(id+'Value').textContent=settings[field]+unit;
    }
    for(const button of document.querySelectorAll('[data-display-step]')){
      const slider=document.getElementById(button.dataset.displayStep);
      button.disabled=Number(button.dataset.direction)<0?Number(slider.value)<=Number(slider.min):Number(slider.value)>=Number(slider.max);
    }
    workbench.setDisplay(settings);
    if(save){
      try{
        if(unit1){
          const prior=JSON.parse(localStorage.getItem(key)||'{}')||{};
          localStorage.setItem(key,JSON.stringify({...prior,...settings}));
        }else localStorage.setItem(key,JSON.stringify(settings));
      }catch{}
    }
  }
  function notifyParent(field){
    if(unit1&&window.parent!==window){
      window.parent.postMessage({type:'turtlecourse-display-changed',key:field,value:settings[field]},window.location.origin);
    }
  }
  for(const [id,field] of controls)document.getElementById(id).addEventListener('input',event=>{
    settings[field]=Number(event.target.value);
    apply(true);
    notifyParent(field);
  });
  for(const button of document.querySelectorAll('[data-display-step]'))button.addEventListener('click',()=>{
    const slider=document.getElementById(button.dataset.displayStep);
    if(Number(button.dataset.direction)<0)slider.stepDown();else slider.stepUp();
    slider.dispatchEvent(new Event('input',{bubbles:true}));
  });
  window.resetTurtleDisplay=()=>{
    settings={...defaults};
    apply(true);
    if(unit1)for(const [,field] of controls)notifyParent(field);
  };
  if(unit1)window.syncTurtleDisplaySettings=(incoming)=>{
    for(const [,field] of controls)if(Number.isFinite(incoming[field]))settings[field]=incoming[field];
    apply(false);
  };
  apply();
})();
