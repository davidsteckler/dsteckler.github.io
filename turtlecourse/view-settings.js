/* Course view preferences (independent of lesson progress and saved code).
   Every slider changes exactly one thing; the two panel dividers and the
   lesson-list collapse button write to the same saved settings. */
(function(){
  "use strict";
  var toggle=document.getElementById("viewSettingsToggle");
  var panel=document.getElementById("viewSettingsPanel");
  var frame=document.getElementById("editorFrame");
  var root=document.documentElement;
  if(!toggle||!panel)return;
  var storageKey="dsteckler-turtlecourse-view-v3";
  var controls=[
    {group:"Layout",key:"split",label:"Instructions",min:25,max:60,step:1,initial:40,unit:"%"},
    {key:"sidebar",label:"Lesson list",min:200,max:340,step:10,initial:236,unit:"px"},
    {group:"Text",key:"lesson",label:"Lesson text",min:85,max:140,step:5,initial:100,unit:"%"},
    {key:"menu",label:"Lesson list text",min:85,max:125,step:5,initial:100,unit:"%"},
    {key:"interface",label:"Title & buttons",min:85,max:125,step:5,initial:100,unit:"%"},
    {group:"Editor",key:"code",label:"Code size",min:12,max:40,step:1,initial:17,unit:"px"},
    {key:"drawing",label:"Drawing zoom",min:50,max:300,step:10,initial:100,unit:"%"},
    {key:"output",label:"Output text",min:11,max:30,step:1,initial:14,unit:"px"}
  ];
  var byKey={};controls.forEach(function(c){byKey[c.key]=c});
  var settings={collapsed:null};
  controls.forEach(function(c){settings[c.key]=c.initial});
  try{
    var saved=JSON.parse(localStorage.getItem(storageKey)||"null");
    var legacy=saved?null:JSON.parse(localStorage.getItem("dsteckler-turtlecourse-view-v2")||"null");
    var src=saved||legacy||{};
    controls.forEach(function(c){
      if(c.key==="split"&&!saved)return;           // old px widths don't translate
      if(Number.isFinite(src[c.key]))settings[c.key]=src[c.key];
    });
    if(saved&&typeof saved.collapsed==="boolean")settings.collapsed=saved.collapsed;
  }catch(e){}
  if(settings.collapsed===null)settings.collapsed=window.innerWidth<1500;

  panel.innerHTML=
    '<div class="view-settings-heading"><strong>Adjust view</strong><span>Saved on this browser</span></div>'+
    controls.map(function(c){
      return (c.group?'<div class="view-group">'+c.group+'</div>':'')+
        '<div class="view-slider"><label for="tc-'+c.key+'">'+c.label+'</label>'+
        '<input id="tc-'+c.key+'" type="range" min="'+c.min+'" max="'+c.max+'" step="'+c.step+'">'+
        '<output for="tc-'+c.key+'" id="tc-'+c.key+'-value"></output></div>';
    }).join("")+
    '<div class="view-settings-bottom"><button id="resetCourseView" type="button">Reset all</button><button id="closeCourseView" type="button">Done</button></div>'+
    '<p class="view-credits notranslate" translate="no">Translation idea: Sky Eid El Boustany · Neon glow idea: Shawn Gardner</p>';

  function save(){try{localStorage.setItem(storageKey,JSON.stringify(settings))}catch(e){}}
  function px(name,n){root.style.setProperty(name,n+"px")}
  function clamp(c,n){n=Number(n);if(!Number.isFinite(n))n=c.initial;return Math.min(c.max,Math.max(c.min,n))}
  function applyEmbedded(){
    try{
      var w=frame&&frame.contentWindow;
      var values={code:settings.code,drawing:settings.drawing,output:settings.output};
      if(w&&typeof w.syncTurtleDisplaySettings==="function")w.syncTurtleDisplaySettings(values);
      else if(w&&w.TurtleWorkbench&&typeof w.TurtleWorkbench.setDisplay==="function")w.TurtleWorkbench.setDisplay(values);
    }catch(e){}
  }
  function apply(persist){
    controls.forEach(function(c){
      settings[c.key]=clamp(c,settings[c.key]);
      document.getElementById("tc-"+c.key).value=String(settings[c.key]);
      document.getElementById("tc-"+c.key+"-value").textContent=settings[c.key]+(c.unit==="px"?" px":"%");
    });
    root.style.setProperty("--tc-split",settings.split+"%");
    px("--tc-side-width",settings.sidebar);
    var m=settings.menu/100,l=settings.lesson/100,u=settings.interface/100;
    px("--tc-nav-title",12.5*m);px("--tc-nav-type",11*m);px("--tc-side-title",17*m);
    px("--tc-copy",14.5*l);px("--tc-copy-title",19*l);px("--tc-copy-sub",14.5*l);
    px("--tc-ui-heading",17*u);px("--tc-ui-small",12*u);px("--tc-ui-button",12.5*u);
    applyCollapsed();
    applyEmbedded();
    if(persist)save();
  }
  controls.forEach(function(c){
    document.getElementById("tc-"+c.key).addEventListener("input",function(e){settings[c.key]=Number(e.target.value);apply(true)});
  });

  /* Popover open/close */
  function close(){panel.hidden=true;toggle.setAttribute("aria-expanded","false")}
  toggle.addEventListener("click",function(){panel.hidden=!panel.hidden;toggle.setAttribute("aria-expanded",String(!panel.hidden))});
  document.getElementById("closeCourseView").addEventListener("click",function(){close();toggle.focus()});
  document.getElementById("resetCourseView").addEventListener("click",function(){controls.forEach(function(c){settings[c.key]=c.initial});apply(true)});
  document.addEventListener("pointerdown",function(e){if(!panel.hidden&&!panel.contains(e.target)&&!toggle.contains(e.target))close()});
  document.addEventListener("keydown",function(e){if(e.key==="Escape"&&!panel.hidden){close();toggle.focus()}});

  /* Lesson list: full list or numbered rail */
  var railBtn=document.getElementById("sidebarToggle");
  function applyCollapsed(){
    document.body.classList.toggle("rail-collapsed",!!settings.collapsed);
    if(railBtn){
      railBtn.setAttribute("aria-expanded",String(!settings.collapsed));
      railBtn.title=settings.collapsed?"Show lesson names":"Collapse lesson list";
      railBtn.firstElementChild.textContent=settings.collapsed?"»":"«";
    }
  }
  if(railBtn)railBtn.addEventListener("click",function(){settings.collapsed=!settings.collapsed;applyCollapsed();save()});

  /* Drag dividers (also keyboard: ←/→, Shift for bigger steps; double-click resets) */
  function installDivider(id,key,measure){
    var divider=document.getElementById(id);if(!divider)return;
    var c=byKey[key],drag=null;
    function sync(){
      divider.setAttribute("aria-valuemin",c.min);divider.setAttribute("aria-valuemax",c.max);
      divider.setAttribute("aria-valuenow",settings[key]);divider.setAttribute("aria-valuetext",settings[key]+(c.unit==="px"?" pixels":" percent"));
    }
    function set(v,persist){settings[key]=Math.round(clamp(c,v));apply(persist);sync()}
    divider.addEventListener("pointerdown",function(e){
      if(e.button!==0)return;
      drag={id:e.pointerId,x:e.clientX,start:settings[key]};
      divider.setPointerCapture(e.pointerId);divider.classList.add("dragging");
      document.body.classList.add("course-panels-resizing");e.preventDefault();
    });
    divider.addEventListener("pointermove",function(e){
      if(!drag||e.pointerId!==drag.id)return;
      set(drag.start+measure(e.clientX-drag.x),false);
    });
    function stop(){if(!drag)return;drag=null;divider.classList.remove("dragging");document.body.classList.remove("course-panels-resizing");save()}
    divider.addEventListener("pointerup",stop);divider.addEventListener("pointercancel",stop);divider.addEventListener("lostpointercapture",stop);
    divider.addEventListener("keydown",function(e){
      var step=(e.shiftKey?5:1)*(c.unit==="px"?10:1),next;
      if(e.key==="ArrowLeft")next=settings[key]-step;else if(e.key==="ArrowRight")next=settings[key]+step;else return;
      e.preventDefault();set(next,true);
    });
    divider.addEventListener("dblclick",function(){set(c.initial,true)});
    sync();
  }
  installDivider("sidebarDivider","sidebar",function(dx){return dx});
  installDivider("lessonDivider","split",function(dx){
    var w=document.getElementById("workspace").clientWidth||1;return dx/w*100;
  });

  if(frame)frame.addEventListener("load",function(){requestAnimationFrame(applyEmbedded)});
  window.addEventListener("message",function(event){
    if(!frame||event.origin!==window.location.origin||event.source!==frame.contentWindow)return;
    var data=event.data||{};
    if(data.type!=="turtlecourse-display-changed"||["code","drawing","output"].indexOf(data.key)<0)return;
    if(!Number.isFinite(Number(data.value)))return;
    settings[data.key]=Number(data.value);apply(true);
  });
  apply(false);
})();
