/* Course view preferences, independent from lesson completion and saved code. */
(function(){
  "use strict";
  var toggle=document.getElementById("viewSettingsToggle");
  var panel=document.getElementById("viewSettingsPanel");
  var frame=document.getElementById("editorFrame");
  if(!toggle||!panel)return;
  var storageKey="dsteckler-turtlecourse-view-v2";
  var controls=[
    {key:"sidebar",label:"Sidebar width",min:220,max:390,step:10,initial:260,unit:"px"},
    {key:"menu",label:"Menu text",min:90,max:125,step:5,initial:100,unit:"%"},
    {key:"interface",label:"Headings & UI",min:90,max:120,step:5,initial:100,unit:"%"},
    {key:"lesson",label:"Lesson text",min:90,max:130,step:5,initial:100,unit:"%"},
    {key:"instructions",label:"Instructions width",min:280,max:650,step:5,initial:350,unit:"px"},
    {key:"height",label:"Editor height",min:680,max:1180,step:20,initial:820,unit:"px"},
    {key:"code",label:"Code size",min:12,max:40,step:2,initial:16,unit:"px"},
    {key:"drawing",label:"Drawing zoom",min:50,max:300,step:10,initial:100,unit:"%"},
    {key:"output",label:"Output text",min:12,max:40,step:2,initial:14,unit:"px"}
  ];
  var settings={};
  controls.forEach(function(c){settings[c.key]=c.initial});
  try{
    var saved=JSON.parse(localStorage.getItem(storageKey)||"null");
    if(saved&&typeof saved==="object"){
      controls.forEach(function(c){
        if(Number.isFinite(saved[c.key]))settings[c.key]=saved[c.key];
      });
    }else{
      // Keep typography and drawing preferences, but discard the broken panel
      // widths saved by the old auto-placement layout.
      var legacy=JSON.parse(localStorage.getItem("dsteckler-turtlecourse-view-v1")||"null");
      if(legacy&&typeof legacy==="object"){
        controls.forEach(function(c){
          if(c.key!=="sidebar"&&c.key!=="instructions"&&Number.isFinite(legacy[c.key])){
            settings[c.key]=legacy[c.key];
          }
        });
      }
    }
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
    [["sidebarDivider","sidebar"],["lessonDivider","instructions"]].forEach(function(pair){
      var handle=document.getElementById(pair[0]);
      if(handle){
        handle.setAttribute("aria-valuenow",settings[pair[1]]);
        handle.setAttribute("aria-valuetext",settings[pair[1]]+" pixels");
      }
    });
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
  /* Direct manipulation of the same persisted widths as the settings sliders. */
  function installDivider(id,settingKey,minimum,maximum,getLimit){
    var divider=document.getElementById(id);
    if(!divider)return;
    var slider=document.getElementById("tc-"+settingKey);
    var output=document.getElementById("tc-"+settingKey+"-value");
    var option=controls.filter(function(c){return c.key===settingKey})[0];
    var drag=null;
    function bounds(){
      var dynamic=typeof getLimit==="function"?getLimit():maximum;
      return {min:minimum,max:Math.max(minimum,Math.min(maximum,dynamic))};
    }
    function setWidth(next,save){
      var range=bounds();
      var val=Math.round(Math.max(range.min,Math.min(range.max,next)));
      settings[settingKey]=val;
      root.style.setProperty(settingKey==="sidebar"?"--tc-side-width":"--tc-instructions-width",val+"px");
      divider.setAttribute("aria-valuemin",range.min);
      divider.setAttribute("aria-valuemax",range.max);
      divider.setAttribute("aria-valuenow",val);
      divider.setAttribute("aria-valuetext",val+" pixels");
      if(slider)slider.value=val;
      if(output)output.textContent=val+" px";
      if(save)try{localStorage.setItem(storageKey,JSON.stringify(settings));}catch(e){}
    }
    divider.addEventListener("pointerdown",function(event){
      if(event.button!==0||window.getComputedStyle(divider).display==="none")return;
      var item=settingKey==="sidebar"?document.querySelector(".sidebar"):document.querySelector(".assignment-card");
      drag={id:event.pointerId,startX:event.clientX,startWidth:item.getBoundingClientRect().width};
      divider.setPointerCapture(event.pointerId);
      divider.classList.add("dragging");
      document.body.classList.add("course-panels-resizing");
      event.preventDefault();
    });
    divider.addEventListener("pointermove",function(event){
      if(!drag||event.pointerId!==drag.id)return;
      setWidth(drag.startWidth+event.clientX-drag.startX,false);
    });
    function stop(event){
      if(!drag||(event&&event.pointerId!==drag.id))return;
      drag=null;
      divider.classList.remove("dragging");
      document.body.classList.remove("course-panels-resizing");
      setWidth(settings[settingKey],true);
    }
    divider.addEventListener("pointerup",function(event){
      if(drag&&event.pointerId===drag.id){
        if(divider.hasPointerCapture(event.pointerId))divider.releasePointerCapture(event.pointerId);
        stop(event);
      }
    });
    divider.addEventListener("pointercancel",stop);
    divider.addEventListener("lostpointercapture",stop);
    divider.addEventListener("keydown",function(event){
      var step=event.shiftKey?30:10;
      var next;
      if(event.key==="ArrowLeft")next=settings[settingKey]-step;
      else if(event.key==="ArrowRight")next=settings[settingKey]+step;
      else if(event.key==="Home")next=bounds().min;
      else if(event.key==="End")next=bounds().max;
      else return;
      event.preventDefault();
      setWidth(next,true);
    });
    divider.addEventListener("dblclick",function(){setWidth(option.initial,true)});
    setWidth(settings[settingKey],false);
    window.addEventListener("resize",function(){if(!drag)setWidth(settings[settingKey],false)});
  }
  installDivider("sidebarDivider","sidebar",220,390,function(){
    return window.innerWidth-740;
  });
  installDivider("lessonDivider","instructions",280,650,function(){
    var work=document.getElementById("workspace");
    return work?work.clientWidth-630:650;
  });
  // Both grips share one viewport Y coordinate. Their containers begin at
  // different document heights, so a fixed local 'top' cannot align them.
  var gripFramePending=false;
  function positionDividerGrips(){
    var left=document.getElementById("sidebarDivider");
    var right=document.getElementById("lessonDivider");
    if(!left||!right)return;
    if(getComputedStyle(left).display==="none"||getComputedStyle(right).display==="none"){
      left.style.removeProperty("--tc-grip-top");
      right.style.removeProperty("--tc-grip-top");
      return;
    }
    var l=left.getBoundingClientRect(),r=right.getBoundingClientRect();
    var gripHeight=39,pad=16;
    var first=Math.max(l.top+pad,r.top+pad,0);
    var last=Math.min(l.bottom-gripHeight-pad,r.bottom-gripHeight-pad,window.innerHeight-gripHeight-pad);
    // Align at the midpoint of the visible overlap, keeping each grip in
    // the part of its divider that can actually be dragged.
    if(last<first)return;
    var sharedY=Math.round((first+last)/2);
    left.style.setProperty("--tc-grip-top",Math.round(sharedY-l.top)+"px");
    right.style.setProperty("--tc-grip-top",Math.round(sharedY-r.top)+"px");
  }
  function scheduleGripPosition(){
    if(gripFramePending)return;
    gripFramePending=true;
    requestAnimationFrame(function(){gripFramePending=false;positionDividerGrips()});
  }
  window.addEventListener("resize",scheduleGripPosition);
  window.addEventListener("scroll",scheduleGripPosition,{passive:true});
  if(typeof ResizeObserver!=="undefined"){
    var dividerObserver=new ResizeObserver(scheduleGripPosition);
    ["workspace","lessonBody","lessonTitle"].forEach(function(id){
      var node=document.getElementById(id);
      if(node)dividerObserver.observe(node);
    });
  }
  document.getElementById("lessonMenu")?.addEventListener("click",scheduleGripPosition);
  scheduleGripPosition();
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
