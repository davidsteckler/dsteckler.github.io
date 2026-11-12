/* Course language picker. Uses Google Translate for the lesson page;
   Python code, the code editor and student answers are never translated. */
(function(){
  "use strict";
  var KEY="dsteckler-turtlecourse-lang";
  var inEditor=!document.querySelector(".topbar-actions");
  // Inside the embedded editor, only translate when it's the course's Unit 1 editor.
  if(inEditor&&new URLSearchParams(location.search).get("ui")!=="unit1-console-v2")return;
  var LANGS=[
    ["en","English"],["es","Español"],["fr","Français"],["ja","日本語"],["zh-CN","中文（简体）"],
    ["ko","한국어"],["pt","Português"],["vi","Tiếng Việt"],["ar","العربية"],["ru","Русский"],
    ["hi","हिन्दी"],["ht","Kreyòl ayisyen"],["it","Italiano"],["de","Deutsch"],["pl","Polski"],["uk","Українська"]
  ];
  var current="en";
  try{current=localStorage.getItem(KEY)||"en"}catch(e){}
  if(!LANGS.some(function(l){return l[0]===current}))current="en";

  function setCookie(v){
    var exp=v?"":";expires=Thu, 01 Jan 1970 00:00:00 GMT";
    var val=v?"/en/"+v:"";
    document.cookie="googtrans="+val+";path=/"+exp;
    var host=location.hostname;
    if(host.indexOf(".")>-1)document.cookie="googtrans="+val+";path=/;domain=."+host.replace(/^www\./,"")+exp;
  }
  function protect(root){
    (root||document).querySelectorAll("code,pre,kbd,.codebox,.mono,textarea,input,iframe,.brandmark,.notes-text,.stamp-chip,.trace-table input,.CodeMirror,.uwe-src,.uwe-raw,.unit1-error-source,.unit1-error-raw,.uwe-badge,.unit1-error-badge,.panel-title,#output>:not(.unit1-error)").forEach(function(n){
      n.classList.add("notranslate");n.setAttribute("translate","no");
    });
  }

  // Picker in the top bar
  var host=document.querySelector(".topbar-actions");
  if(host){
    var wrap=document.createElement("label");wrap.className="lang-picker notranslate";wrap.setAttribute("translate","no");
    wrap.title="Change the course language (idea by Sky Eid El Boustany)";
    wrap.innerHTML='<span aria-hidden="true">🌐</span><select aria-label="Language">'+
      LANGS.map(function(l){return '<option value="'+l[0]+'"'+(l[0]===current?" selected":"")+'>'+l[1]+'</option>'}).join("")+'</select>';
    host.insertBefore(wrap,host.querySelector(".view-settings"));
    wrap.querySelector("select").addEventListener("change",function(e){
      var v=e.target.value;
      try{localStorage.setItem(KEY,v)}catch(err){}
      setCookie(v==="en"?"":v);
      location.reload();
    });
  }

  document.documentElement.classList.toggle("lang-translated",current!=="en");
  if(current==="en"){setCookie("");return}

  // Keep code untranslated, including lesson content rendered later.
  protect(document);
  new MutationObserver(function(list){list.forEach(function(m){m.addedNodes.forEach(function(n){if(n.nodeType===1){protect(n.parentNode||n)}})})})
    .observe(document.body,{childList:true,subtree:true});

  setCookie(current);
  var box=document.createElement("div");box.id="google_translate_element";box.hidden=true;document.body.appendChild(box);
  window.tcGoogleTranslateInit=function(){
    try{new google.translate.TranslateElement({pageLanguage:"en",autoDisplay:false},"google_translate_element")}catch(e){}
  };
  var s=document.createElement("script");
  s.src="https://translate.google.com/translate_a/element.js?cb=tcGoogleTranslateInit";
  s.onerror=function(){
    var note=document.createElement("div");note.className="lang-blocked";
    if(inEditor)return;
    note.textContent="Translation isn't available on this network, so the course is shown in English.";
    document.body.appendChild(note);setTimeout(function(){note.remove()},6000);
  };
  document.head.appendChild(s);
})();
