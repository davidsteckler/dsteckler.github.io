/* Course view preferences, independent from lesson completion and saved code. */
(function(){
  "use strict";
  var toggle=document.getElementById("viewSettingsToggle");
  var panel=document.getElementById("viewSettingsPanel");
  var frame=document.getElementById("editorFrame");
  if(!toggle||!panel)return;
  var storageKey="dsteckler-turtlecourse-view-v1";
  var controls=[
    {key:"sidebar",label:"Sidebar width",min:210,max:340,step:10,initial:240,unit:"px"},
    {key:"menu",label:"Menu text",min:90,max:125,step:5,initial:100,unit:"%"},
    {key:"interface",label:"Headings & UI",min:90,max:120,step:5,initial:100,unit:"%"},
    {key:"lesson",label:"Lesson text",min:90,max:130,step:5,initial:100,unit:"%"},
    {key:"instructions",label:"Instructions width",min:270,max:500,step:5,initial:305,unit:"px"},
    {key:"height",label:"Editor height",min:680,max:1180,step:20,initial:820,unit:"px"},
    {key:"code",label:"Code size",min:12,max:32,step:1,initial:17,unit:"px"},
    {key:"drawing",label:"Drawing zoom",min:75,max:175,step:5,initial:100,unit:"%"},
    {key:"output",label:"Output text",min:12,max:24,step:1,initial:14,unit:"px"}
  ];
  var settings={};
  controls.forEach(function(c){settings[c.key]=c.initial});
  try{
    var saved=JSON.parse(localStorage.getItem(storageKey)||"null");
    if(saved&&typeof saved==="object")controls.forEach(function(c){
      if(Number.isFinite(saved[c.key]))settings[c.key]=saved[c.key];
    });
  }catch(e){}
  panel.innerHTML=
    '<div class="view-settings-heading"><strong>Adjust view</strong><p>Fine-tune the course to your screen.</p></div>'+
    '<div class="view-settings-sliders">'+controls.map(function(c){
      return '<div class="view-slider"><label for="tc-'+c.key+'">'+c.label+'</label>'+
        '<input id="tc-'+c.key+'" type="range" min="'+c.min+'" max="'+c.max+'" step="'+c.step+'">'+
        '<output for="tc-'+c.key+'" id="tc-'+c.key+'-value"></output></div>';
    }).join("")+'</div>'+
    '<div class="view-settings-bottom"><button id="resetCourseView" type="button">Reset view</button>'+
    '<span>Saves on this browser</span><button id="closeCourseView" type="button">Done</button></div>';
  var root=document.documentElement;
  function setSize(name,n){root.style.setProperty(name,n+"px")}
  function applyEmbedded(){
    try{
      var app=frame&&frame.contentWindow&&frame.contentWindow.TurtleWorkbench;
      if(app&&typeof app.setDisplay==="function"){
        var embedded=frame.contentWindow;
        if(typeof embedded.syncTurtleDisplaySettings==="function"){
          embedded.syncTurtleDisplaySettings({code:settings.code,drawing:settings.drawing,output:settings.output});
        }else{
          app.setDisplay({code:settings.code,drawing:settings.drawing,output:settings.output});
        }
      }
    }catch(e){}
  }
  function apply(save){
    controls.forEach(function(c){
      var n=Number(settings[c.key]);
      if(!Number.isFinite(n))n=c.initial;
      settings[c.key]=Math.min(c.max,Math.max(c.min,n));
      document.getElementById("tc-"+c.key).value=String(settings[c.key]);
      document.getElementById("tc-"+c.key+"-value").textContent=settings[c.key]+(c.unit==="px"?" px":"%");
    });
    setSize("--tc-side-width",settings.sidebar);
    setSize("--tc-instructions-width",settings.instructions);
    setSize("--tc-editor-height",settings.height);
    setSize("--tc-nav-title",12.5*settings.menu/100);
    setSize("--tc-nav-type",11*settings.menu/100);
    setSize("--tc-unit-title",14*settings.menu/100);
    setSize("--tc-unit-sub",12*settings.menu/100);
    setSize("--tc-side-title",21*settings.menu/100);
    setSize("--tc-copy",14*settings.lesson/100);
    setSize("--tc-copy-title",20*settings.lesson/100);
    setSize("--tc-copy-sub",14*settings.lesson/100);
    setSize("--tc-ui-heading",28*settings.interface/100);
    setSize("--tc-ui-small",13*settings.interface/100);
    setSize("--tc-ui-button",12*settings.interface/100);
    applyEmbedded();
    if(save)try{localStorage.setItem(storageKey,JSON.stringify(settings));}catch(e){}
  }
  controls.forEach(function(c){
    document.getElementById("tc-"+c.key).addEventListener("input",function(e){
      settings[c.key]=Number(e.target.value);apply(true);
    });
  });
  function close(){panel.hidden=true;toggle.setAttribute("aria-expanded","false")}
  toggle.addEventListener("click",function(){
    panel.hidden=!panel.hidden;toggle.setAttribute("aria-expanded",String(!panel.hidden));
  });
  document.getElementById("closeCourseView").addEventListener("click",function(){close();toggle.focus()});
  document.getElementById("resetCourseView").addEventListener("click",function(){
    controls.forEach(function(c){settings[c.key]=c.initial});apply(true);
  });
  document.addEventListener("pointerdown",function(e){
    if(!panel.hidden&&!panel.contains(e.target)&&!toggle.contains(e.target))close();
  });
  document.addEventListener("keydown",function(e){
    if(e.key==="Escape"&&!panel.hidden){close();toggle.focus()}
  });
  if(frame)frame.addEventListener("load",function(){requestAnimationFrame(applyEmbedded)});
  window.addEventListener("message",function(event){
    if(!frame||event.origin!==window.location.origin||event.source!==frame.contentWindow)return;
    var data=event.data||{};
    if(data.type!=="turtlecourse-display-changed"||["code","drawing","output"].indexOf(data.key)<0)return;
    if(!Number.isFinite(Number(data.value)))return;
    settings[data.key]=Number(data.value);
    apply(true);
  });
  apply(false);
})();
