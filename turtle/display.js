(() => {
  'use strict';
  const workbench=window.TurtleWorkbench;
  if(!workbench||workbench.isTrace||workbench.isCourse)return;
  const key='dsteckler-turtle-display-v1',defaults={code:16,drawing:100,output:14};
  const controls=[['codeFontSize','code',' px'],['drawingZoom','drawing','%'],['outputFontSize','output',' px']];
  let settings={...defaults};
  try{const saved=JSON.parse(localStorage.getItem(key)||'null');if(saved)for(const [,field] of controls)if(Number.isFinite(saved[field]))settings[field]=saved[field];}catch{}
  function apply(save=false){
    for(const [id,field,unit] of controls){
      const slider=document.getElementById(id);
      settings[field]=Math.max(Number(slider.min),Math.min(Number(slider.max),settings[field]));
      slider.value=String(settings[field]);document.getElementById(id+'Value').textContent=settings[field]+unit;
    }
    for(const button of document.querySelectorAll('[data-display-step]')){
      const slider=document.getElementById(button.dataset.displayStep);
      button.disabled=Number(button.dataset.direction)<0?Number(slider.value)<=Number(slider.min):Number(slider.value)>=Number(slider.max);
    }
    workbench.setDisplay(settings);
    if(save)try{localStorage.setItem(key,JSON.stringify(settings));}catch{}
  }
  for(const [id,field] of controls)document.getElementById(id).addEventListener('input',event=>{settings[field]=Number(event.target.value);apply(true);});
  for(const button of document.querySelectorAll('[data-display-step]'))button.addEventListener('click',()=>{
    const slider=document.getElementById(button.dataset.displayStep);
    if(Number(button.dataset.direction)<0)slider.stepDown();else slider.stepUp();
    slider.dispatchEvent(new Event('input',{bubbles:true}));
  });
  window.resetTurtleDisplay=()=>{settings={...defaults};apply(true);};
  apply();
})();
