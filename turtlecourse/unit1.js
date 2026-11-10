(function(){
"use strict";

var LESSONS=[
  {id:"1.1.1",name:"Intro to Python with Tracy the Turtle",short:"Intro to Python",kind:"Video",subtitle:"Meet Tracy and see what a program can tell her to do.",editor:false},
  {id:"1.1.2",name:"Slinky (Example Program)",short:"Slinky example",kind:"Example program",subtitle:"Run a program, predict changes, and notice what the error messages tell you.",editor:true},
  {id:"1.1.3",name:"Intro to Tracy",short:"Check for understanding",kind:"Quiz · 3 questions",subtitle:"Check what you know about commands and circles.",editor:false},
  {id:"1.1.4",name:"Stretched Slinky",short:"Stretched Slinky",kind:"Coding exercise",subtitle:"Write the commands yourself and compare your output with the instructions.",editor:true},
  {id:"1.1.5",name:"Sequencing with Trace Tables",short:"Trace tables",kind:"Trace table",subtitle:"Read a program one instruction at a time and record the order.",editor:false},
  {id:"1.1.6",name:"How Trace Tables Work & How to Make a Sandbox Program",short:"Trace table video",kind:"Video",subtitle:"Watch how to complete a trace table and make your own sandbox program.",editor:false},
  {id:"1.1.7",name:"Slinky Coil Challenge",short:"Slinky Coil Challenge",kind:"Coding challenge",subtitle:"Practice writing a longer sequence of circle and forward commands.",editor:true},
  {id:"1.1.8",name:"Color & Background Color",short:"Color & background",kind:"Coding exercise",subtitle:"Give the drawing a new background and use different pen colors.",editor:true}
];
var SLINKY=[
  "circle(35)",
  "forward(20)",
  "circle(35)",
  "forward(20)",
  "circle(35)",
  "forward(20)",
  "circle(35)",
  "forward(20)",
  "circle(35)",
  "forward(20)"
].join("\n");
var STARTERS={
  "1.1.2":SLINKY,
  "1.1.4":"",
  "1.1.7":"",
  "1.1.8":""
};
var TRACE=["forward(100)","circle(10)","forward(10)","circle(20)","circle(30)","forward(30)"];
var QUIZ=[
  {q:"How would I tell Tracy to move forward 100 pixels?",options:["forward 100","move(100)","Tracy, move forward 100 pixels","forward(100)"],correct:3,hint:"A Python command needs the exact function name and parentheses."},
  {q:"When using the circle() command, what value do we put inside the parentheses?",options:["The radius of the circle","The center of the circle","The diameter of the circle","The width of the circle"],correct:0,hint:"Look at how the number 35 is used in the Slinky example."},
  {q:"When Tracy is facing right, from what location does she start drawing her circle?",options:["The top of the circle","The bottom of the circle","The left side of the circle","The middle of the circle"],correct:1,hint:"Run a single circle and look at where Tracy begins."}
];
var KEY="dsteckler-turtlecourse-unit1-v1";
var state={done:{},draft:{},checks:{},ran:{},validatedCode:{}};
try{
  var stored=JSON.parse(localStorage.getItem(KEY)||"null");
  if(stored && typeof stored==="object"){
    ["done","draft","checks","ran","validatedCode"].forEach(function(k){
      if(stored[k] && typeof stored[k]==="object")state[k]=stored[k];
    });
  }
}catch(e){}
var menu=document.getElementById("lessonMenu");
var body=document.getElementById("lessonBody");
var workspace=document.getElementById("workspace");
var editorCard=document.getElementById("editorCard");
var frame=document.getElementById("editorFrame");
var action=document.getElementById("actionButton");
var previous=document.getElementById("backButton");
var expandEditorBtn=document.getElementById("expandEditorBtn");
var saveState=document.getElementById("saveState");
var currentIndex=0,editorReady=false,pendingCheck=null,finishView=false;
function el(id){return document.getElementById(id)}
function escapeHtml(x){return String(x).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function persist(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch(e){}}
function answers(){var id=LESSONS[currentIndex].id;if(!state.draft[id])state.draft[id]={};return state.draft[id]}
function doneCount(){return LESSONS.filter(function(l){return !!state.done[l.id]}).length}
function updateProgress(){
  var total=doneCount();
  el("progressText").textContent=total+" / 8";
  el("progressFill").style.width=(total/8*100)+"%";
  el("progressTrack").setAttribute("aria-valuenow",total);
}
function setStatus(text){saveState.textContent=text||"Answers are saved on this device"}
function markDone(){state.done[LESSONS[currentIndex].id]=true;persist();updateProgress();renderMenu()}
function makeFeedback(good,title,details){
  var container=el("activityFeedback");
  if(!container){container=document.createElement("div");container.id="activityFeedback";body.appendChild(container)}
  container.className="feedback "+(good?"good":"bad");
  container.innerHTML="<strong>"+escapeHtml(title)+"</strong>"+(details&&details.length?"<ul>"+details.map(function(d){return "<li>"+escapeHtml(d)+"</li>"}).join("")+"</ul>":"");
  container.scrollIntoView({block:"nearest",behavior:"smooth"});
}
function renderMenu(){
  menu.innerHTML=LESSONS.map(function(l,i){
    var active=i===currentIndex&&!finishView,complete=!!state.done[l.id];
    return '<button type="button" class="lesson-nav'+(active?' active':'')+'" data-index="'+i+'" '+(active?'aria-current="step"':'')+'><span class="lesson-num">'+String(i+1).padStart(2,"0")+'</span><span><span class="lesson-name">'+escapeHtml(l.short)+'</span><span class="lesson-type">'+escapeHtml(l.kind)+'</span></span><span class="lesson-tick" aria-label="'+(complete?'Completed':'Not complete')+'">'+(complete?'✓':'')+'</span></button>';
  }).join("");
}
function field(key,title,hint,rows){
  return '<div class="field"><label for="answer-'+key+'">'+title+'</label>'+
    (rows?'<textarea id="answer-'+key+'" data-answer="'+key+'" rows="'+rows+'"></textarea>':'<input id="answer-'+key+'" data-answer="'+key+'" type="text" autocomplete="off">')+
    (hint?'<div class="field-help">'+hint+'</div>':'')+'</div>';
}
function videoContent(videoId,intro){
  return '<h2>'+intro+'</h2><div class="mini-note">Watch the video before continuing. You can pause and replay it at any time.</div>'+
    '<iframe class="youtube-frame" src="https://www.youtube-nocookie.com/embed/'+encodeURIComponent(videoId)+'" title="'+escapeHtml(intro)+'" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen loading="lazy"></iframe>'+
    '<p class="linkline">Video not loading at school? <a href="https://www.youtube.com/watch?v='+encodeURIComponent(videoId)+'" target="_blank" rel="noopener">Open it on YouTube</a>.</p>'+
    '<p class="mini-note">After watching, select <strong>Mark watched &amp; Next</strong>. Your progress saves on this browser.</p>';
}
function slinkyContent(){
  return '<h2>Run the Slinky program</h2><p>The code is already in your editor. Click <strong>Run</strong>, watch Tracy draw, and type your responses below. You can change the code for each experiment.</p>'+
    '<div class="mini-note">Tracy starts at the center of her 400 × 400 world, facing right. <code>circle(35)</code> draws a circle with radius 35.</div>'+
    '<h3>Part 1 · Run the program</h3>'+field("count","How many circles are drawn?","Click Run before answering.",0)+
    '<h3>Part 2 · Capital letter</h3><p>Change only the <strong>first</strong> <code>circle</code> to <code>Circle</code>, then run again.</p>'+
    field("capitalPrediction","What do you predict will happen?","Make your prediction before running.",2)+
    field("capitalResult","What actually happened?","Include any error message you notice.",2)+
    '<h3>Part 3 · Remove parentheses</h3><p>Change <code>Circle</code> back to <code>circle</code>. Predict the effect of removing the parentheses from the first command, then try it.</p>'+
    field("parenPrediction","What do you predict?","",2)+
    field("parenResult","What actually happened?","Describe exactly how you changed that first line.",2)+
    '<div class="mini-note">Save your answers here before moving on. Your code in the Turtle editor is autosaved separately.</div>';
}
function quizContent(){
  return '<h2>Check for understanding</h2><p>Choose an answer for each question. Use <strong>Check answers</strong> to see what you understand before moving on.</p>'+
  QUIZ.map(function(q,i){
    return '<div class="quiz-block"><div class="quiz-count">Question '+(i+1)+' of 3</div><div class="quiz-title">'+escapeHtml(q.q.replace("circle()","circle()"))+'</div>'+
      '<div class="radio-options">'+q.options.map(function(o,j){
        return '<label class="radio-option"><input type="radio" name="quiz-'+i+'" data-answer="q'+i+'" value="'+j+'"><span>'+escapeHtml(o)+'</span></label>';
      }).join("")+'</div><div class="quiz-result" id="quizResult'+i+'" aria-live="polite"></div></div>';
  }).join("")+'<div class="mini-note">You can change an answer and check again. A score of 3 out of 3 completes this activity.</div>';
}
function exampleImage(kind){
  var count=kind==="stretched"?5:kind==="coil"?6:2;
  var radius=kind==="stretched"?35:kind==="coil"?25:48;
  var step=kind==="stretched"?40:kind==="coil"?25:55;
  var start=radius+15, cy=radius+20;
  var width=Math.max(240,start+count*step+radius+14);
  var height=radius*2+55;
  var baseline=cy+radius;
  var bg=kind==="colors"?"#daf0e6":"#ffffff";
  var line=kind==="colors"?"#c26354":"#253f4b";
  var circles=Array.from({length:count},function(_,i){
    var stroke=kind==="colors"?(i===0?"#c26354":"#376aa1"):line;
    return '<circle cx="'+(start+i*step)+'" cy="'+cy+'" r="'+radius+'" fill="none" stroke="'+stroke+'" stroke-width="2.3" />';
  }).join("");
  var end=start+count*step;
  var guide='<path d="M '+start+' '+baseline+' L '+end+' '+baseline+'" stroke="'+(kind==="colors"?"#376aa1":line)+'" stroke-width="2.4" fill="none"/>';
  var turtle='<circle cx="'+end+'" cy="'+baseline+'" r="5.5" fill="#168b82" stroke="#23444a" stroke-width="1.3"/>'+
             '<circle cx="'+(end+7)+'" cy="'+baseline+'" r="3" fill="#a9d5ba" stroke="#23444a" stroke-width="1.1"/>';
  var label=kind==="stretched"?"Five circles · radius 35 · forward 40 after each circle":
            kind==="coil"?"Six circles · radius 25 · forward 25 after each circle":
            "An example with two pen colors and a background";
  return '<figure class="example-figure">'+
    '<div class="example-figure-head"><strong>Example output</strong><span>A visual reference</span></div>'+
    '<svg viewBox="0 0 '+width+' '+height+'" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'+escapeHtml(label)+'">'+
    '<rect width="'+width+'" height="'+height+'" fill="'+bg+'"/>'+
    circles+guide+turtle+'</svg>'+
    '<figcaption>'+escapeHtml(label)+'</figcaption></figure>';
}

function stretchedContent(){
  return '<h2>Make a stretched-out slinky</h2><p>Write your own program in <code>main.py</code>. Click <strong>Run</strong> to inspect the drawing, then use <strong>Check my work</strong> when ready.</p>'+
  exampleImage('stretched')+
  '<p>Your program should have:</p><ul><li><strong>Five rings</strong></li><li>Each circle with a <strong>radius of 35</strong></li><li>Tracy moving forward <strong>40 pixels after every circle</strong></li></ul>'+
  '<div class="mini-note">You already saw the original slinky in 1.1.2. Compare your new spacing with that example. The checker looks at the commands your program executes.</div>'+
  '<div class="resource-links"><a href="/turtlereference/" target="_blank" rel="noopener">Turtle command reference ↗</a></div>';
}
function traceContent(){
  var table=TRACE.map(function(command,i){
    return '<tr><td>'+(i+1)+'</td><td><input class="line-field" aria-label="Line number for step '+(i+1)+'" data-answer="line'+i+'" inputmode="numeric" autocomplete="off"></td><td><input aria-label="Command for step '+(i+1)+'" data-answer="command'+i+'" autocomplete="off" spellcheck="false"></td></tr>';
  }).join("");
  return '<h2>Complete a trace table</h2><p>A trace table helps us test a program by writing down the lines that run, in order.</p>'+
    '<p>Read the program from top to bottom. For each step, fill in the <strong>line number</strong> and the <strong>exact command</strong> that runs.</p>'+
    '<pre class="codebox">'+TRACE.map(function(line,i){return (i+1)+'   '+line}).join("\n")+'</pre>'+
    '<table class="trace-table"><thead><tr><th>Step</th><th>Line number</th><th>Command</th></tr></thead><tbody>'+table+'</tbody></table>'+
    '<div class="mini-note">In this first example, each line runs once. Later, loops and functions will make the order more interesting.</div>'+
    '<div class="resource-links"><a href="/tracetable/" target="_blank" rel="noopener">Explore the animated trace table ↗</a></div>';
}
function coilContent(){
  return '<h2>Slinky Coil Challenge</h2><p>You made the original and stretched slinkies. Now write a new version from scratch using the rules below.</p>'+
  exampleImage('coil')+
  '<ul><li>Draw <strong>six circles</strong> with a <strong>radius of 25</strong>.</li><li>Move forward <strong>25 pixels</strong> after <strong>each circle</strong>.</li><li>Use only commands you have learned so far. Make sure your drawing fits in Tracy’s world.</li></ul>'+
  '<div class="mini-note">Challenge rules for this version of the activity: there should be exactly six circles and six forward movements, alternating in that order.</div>'+
  '<p>Run your program, compare the output to your prediction, and check it when you are ready.</p>';
}
function colorsContent(){
  return '<h2>Give the slinky some color</h2><p>Two commands can change the look of your drawing:</p>'+
  '<pre class="codebox">bgcolor("lightblue")\ncolor("purple")\ncircle(35)</pre>'+
  '<p><code>bgcolor()</code> changes the background. <code>color()</code> changes the pen color.</p>'+
  exampleImage('colors')+
  '<h3>Your task</h3><ul><li>Choose a background with <code>bgcolor()</code>.</li><li>Draw at least <strong>two circles</strong>.</li><li>Use <code>color()</code> to draw with <strong>two different pen colors</strong>.</li></ul>'+
  '<div class="mini-note">You can choose the colors and sizes. Try changing the background and rerunning your code to see the result.</div>'+
  '<div class="resource-links"><a href="/hex/" target="_blank" rel="noopener">Color picker ↗</a><a href="/turtlereference/" target="_blank" rel="noopener">Command reference ↗</a></div>';
}
function contentFor(id){
  switch(id){
    case "1.1.1":return videoContent("rOL_hje-rio","Intro to Python with Tracy the Turtle");
    case "1.1.2":return slinkyContent();
    case "1.1.3":return quizContent();
    case "1.1.4":return stretchedContent();
    case "1.1.5":return traceContent();
    case "1.1.6":return videoContent("nY53Th82CRU","How Trace Tables Work");
    case "1.1.7":return coilContent();
    case "1.1.8":return colorsContent();
    default:return "";
  }
}
function restoreDraft(){
  var data=answers();
  body.querySelectorAll("[data-answer]").forEach(function(input){
    var value=data[input.dataset.answer];
    if(value===undefined)return;
    if(input.type==="radio"){input.checked=String(value)===input.value}
    else input.value=value;
  });
}
function refreshAction(){
  var l=LESSONS[currentIndex],checked=!!state.checks[l.id];
  if(l.kind==="Video")action.textContent="Mark watched & Next →";
  else if(["1.1.4","1.1.7","1.1.8"].indexOf(l.id)!==-1||l.id==="1.1.5"||l.id==="1.1.3"){
    action.textContent=checked?"Save & Next →":("Check "+(l.id==="1.1.3"?"answers":"my work"));
  }else action.textContent="Save & Next →";
}
function render(){
  finishView=false;
  var l=LESSONS[currentIndex];
  el("breadcrumb").textContent="Unit 1 / Tracy's World / "+l.id;
  el("lessonTitle").textContent=l.id+" "+l.name;
  el("lessonSubtitle").textContent=l.subtitle;
  el("lessonBadge").textContent=l.kind;
  el("activityCounter").textContent=(currentIndex+1)+" of "+LESSONS.length;
  body.innerHTML=contentFor(l.id);
  restoreDraft();
  previous.disabled=currentIndex===0;
  workspace.classList.toggle("no-editor",!l.editor);
  editorCard.hidden=!l.editor;
  workspace.classList.remove("focus-editor");
  if(expandEditorBtn){expandEditorBtn.setAttribute("aria-pressed","false");expandEditorBtn.textContent="⤢ Expand editor"}
  editorReady=false;pendingCheck=null;
  if(l.editor){
    var url="/turtle/?embed=course&ui=unit1-console-v2&lesson="+encodeURIComponent("turtlecourse-"+l.id)+"&code="+encodeURIComponent(STARTERS[l.id]||"");
    if(frame.getAttribute("src")!==url)frame.setAttribute("src",url);
    else editorReady=!!frame.contentWindow;
  }else{
    frame.removeAttribute("src");
  }
  renderMenu();refreshAction();updateProgress();
  setStatus(state.done[l.id]?"Previously completed · progress saved":"Answers save automatically on this device");
  if(state.checks[l.id]) {
    var message=l.id==="1.1.3"?"3 out of 3 correct.":l.id==="1.1.5"?"All six rows correct.":"Your program passed its last check.";
    makeFeedback(true,message,[]);
  }
  history.replaceState(null,"","#"+l.id);
}
function gotoIndex(i){if(i<0||i>=LESSONS.length)return;currentIndex=i;render();window.scrollTo({top:0,behavior:"auto"})}
function completeAndNext(){
  markDone();
  setStatus("Saved · activity "+(currentIndex+1)+" completed");
  if(currentIndex<LESSONS.length-1){gotoIndex(currentIndex+1)}else showFinish();
}
function showFinish(){
  finishView=true;renderMenu();workspace.classList.add("no-editor");editorCard.hidden=true;frame.removeAttribute("src");
  el("breadcrumb").textContent="Unit 1 / Tracy's World";
  el("lessonTitle").textContent="Unit 1 complete";
  el("lessonSubtitle").textContent="You have worked through the eight activities in Tracy's World.";
  el("lessonBadge").textContent="8 of 8";
  el("activityCounter").textContent="Finished";
  body.innerHTML='<div class="unit-done"><h3>You have finished Unit 1.</h3><p>You have run programs, tested changes, written drawing commands, read trace tables, and used color.</p></div><div class="resource-links"><a href="/turtle/" target="_blank" rel="noopener">Keep experimenting in Turtle ↗</a><a href="/tracetable/" target="_blank" rel="noopener">Review trace tables ↗</a></div><p>Your completion record stays in this browser.</p>';
  previous.disabled=false;action.textContent="Review Unit 1 ↺";
  history.replaceState(null,"","#complete");
  updateProgress();setStatus("All 8 activities completed on this device");
}
function quizCheck(){
  var data=answers(),unanswered=0,pass=0,notes=[];
  QUIZ.forEach(function(q,i){
    var p=el("quizResult"+i);p.className="quiz-result";
    if(data["q"+i]===undefined){unanswered++;p.textContent="Choose an answer.";p.classList.add("bad");return}
    if(Number(data["q"+i])===q.correct){pass++;p.textContent="✓ Correct";p.classList.add("good")}
    else{p.textContent="Try again. "+q.hint;p.classList.add("bad")}
  });
  if(pass===3){state.checks["1.1.3"]=true;persist();refreshAction();makeFeedback(true,"3 / 3 correct. Save and continue.",[])}
  else{state.checks["1.1.3"]=false;persist();refreshAction();makeFeedback(false,pass+" / 3 correct.",[unanswered?"Answer all three questions.":"Review the questions marked Try again."])}
}
function traceCheck(){
  var data=answers(),bad=[];
  TRACE.forEach(function(cmd,i){
    var line=String(data["line"+i]||"").trim(),text=String(data["command"+i]||"").replace(/\s+/g,"");
    if(line!==String(i+1)||text!==cmd.replace(/\s+/g,""))bad.push("Step "+(i+1)+" needs another look.");
  });
  if(bad.length===0){state.checks["1.1.5"]=true;persist();refreshAction();makeFeedback(true,"All six steps are correct. Save and continue.",[])}
  else{state.checks["1.1.5"]=false;persist();refreshAction();makeFeedback(false,"Check your line numbers and commands.",bad)}
}
function checkCommands(data,id){
  if(!data.run || !data.run.ok)return {ok:false,detail:[data.run&&data.run.error?data.run.error:"Your program did not finish running."]};
  var calls=(data.runtime&&Array.isArray(data.runtime.calls)?data.runtime.calls:[]);
  if(id==="1.1.8"){
    var colors=calls.filter(function(c){return c.name==="color"&&typeof c.str==="string"&&c.str}).map(function(c){return c.str.toLowerCase()});
    var backs=calls.filter(function(c){return c.name==="bgcolor"});
    var circles=calls.filter(function(c){return c.name==="circle"});
    var checks=[
      {pass:backs.length>0,msg:"Use bgcolor() to set a background."},
      {pass:new Set(colors).size>=2,msg:"Use color() with two different colors."},
      {pass:circles.length>=2,msg:"Draw at least two circles."}
    ];
    return {ok:checks.every(function(c){return c.pass}),detail:checks.map(function(c){return (c.pass?"✓ ":"• ")+c.msg})};
  }
  var count=id==="1.1.4"?5:6,radius=id==="1.1.4"?35:25,dist=id==="1.1.4"?40:25;
  var relevant=calls.filter(function(c){return c.name==="circle"||c.name==="forward"});
  var circles=relevant.filter(function(c){return c.name==="circle"});
  var forwards=relevant.filter(function(c){return c.name==="forward"});
  var sameCount=circles.length===count,forwardCount=forwards.length===count;
  var radiusRight=circles.every(function(c){return Number(c.num)===radius});
  var distanceRight=forwards.every(function(c){return Number(c.num)===dist});
  var orderRight=relevant.length===count*2&&relevant.every(function(c,i){return c.name===(i%2===0?"circle":"forward")});
  var tests=[
    {ok:sameCount,msg:"Draw exactly "+count+" circles. Found "+circles.length+"."},
    {ok:forwardCount,msg:"Move forward exactly "+count+" times. Found "+forwards.length+"."},
    {ok:sameCount&&radiusRight,msg:"Give every circle radius "+radius+"."},
    {ok:forwardCount&&distanceRight,msg:"Move "+dist+" pixels after each circle."},
    {ok:orderRight,msg:"Alternate circle, then forward, after every ring."}
  ];
  return {ok:tests.every(function(x){return x.ok}),detail:tests.map(function(x){return (x.ok?"✓ ":"• ")+x.msg})};
}
function requestCodeCheck(){
  if(!editorReady||!frame.contentWindow){makeFeedback(false,"The editor is still loading.",["Wait for the editor to appear, then try again."]);return}
  if(pendingCheck)return;
  var id=LESSONS[currentIndex].id;
  pendingCheck={id:id,requestId:"unit1-"+Date.now()+"-"+Math.random().toString(36).slice(2)};
  action.disabled=true;action.textContent="Checking…";
  frame.contentWindow.postMessage({type:"pythoncourse-check-request",requestId:pendingCheck.requestId},window.location.origin);
  var request=pendingCheck.requestId;
  setTimeout(function(){if(!pendingCheck||pendingCheck.requestId!==request)return;pendingCheck=null;action.disabled=false;refreshAction();makeFeedback(false,"No response from the editor.",["Use Run inside the Turtle editor, then check again."])},12000);
}
function handleAction(){
  if(finishView){gotoIndex(0);return}
  var l=LESSONS[currentIndex],id=l.id;
  if(l.kind==="Video"){completeAndNext();return}
  if(id==="1.1.2"){
    var d=answers(),needs=["count","capitalPrediction","capitalResult","parenPrediction","parenResult"];
    var missing=needs.filter(function(k){return !String(d[k]||"").trim()});
    if(missing.length){makeFeedback(false,"Finish all five responses.",["Predict, run, and record what happened in each experiment."]);return}
    if(!state.ran[id]){makeFeedback(false,"Run the program in the editor first.",["Use the green Run button in the Turtle editor."]);return}
    if(!/^\s*(5|five)\s*$/i.test(String(d.count))){makeFeedback(false,"Take another look at Part 1.",["Count the circles in the original Slinky program."]);return}
    completeAndNext();return;
  }
  if(id==="1.1.3"){if(state.checks[id])completeAndNext();else quizCheck();return}
  if(id==="1.1.5"){if(state.checks[id])completeAndNext();else traceCheck();return}
  if(["1.1.4","1.1.7","1.1.8"].indexOf(id)>-1){if(state.checks[id])completeAndNext();else requestCodeCheck();return}
}
menu.addEventListener("click",function(event){var btn=event.target.closest("[data-index]");if(btn)gotoIndex(Number(btn.dataset.index))});
body.addEventListener("input",function(event){
  var target=event.target;if(!target.dataset.answer)return;
  if(target.type==="radio" && !target.checked)return;
  var id=LESSONS[currentIndex].id;answers()[target.dataset.answer]=target.value;
  if(id==="1.1.3"||id==="1.1.5")state.checks[id]=false;
  persist();refreshAction();setStatus("Draft saved on this device");
});
body.addEventListener("change",function(event){
  var target=event.target;if(!target.dataset.answer)return;
  answers()[target.dataset.answer]=target.value;
  var id=LESSONS[currentIndex].id;
  if(id==="1.1.3"||id==="1.1.5")state.checks[id]=false;
  persist();refreshAction();setStatus("Draft saved on this device");
});
if(expandEditorBtn)expandEditorBtn.addEventListener("click",function(){
  var expanded=workspace.classList.toggle("focus-editor");
  expandEditorBtn.setAttribute("aria-pressed",String(expanded));
  expandEditorBtn.textContent=expanded?"↙ Show instructions":"⤢ Expand editor";
});
previous.addEventListener("click",function(){if(finishView)gotoIndex(7);else gotoIndex(currentIndex-1)});
action.addEventListener("click",handleAction);
frame.addEventListener("load",function(){editorReady=true});
window.addEventListener("message",function(event){
  if(event.origin!==window.location.origin||event.source!==frame.contentWindow)return;
  var data=event.data||{},id=LESSONS[currentIndex].id;
  if(data.lesson!=="turtlecourse-"+id)return;
  if(data.type==="pythoncourse-run-complete"){
    if(data.run&&data.run.ok){state.ran[id]=true;persist();setStatus("Program ran · code is saved separately")}
    if(state.checks[id]&&state.validatedCode[id]&&typeof data.code==="string"&&data.code!==state.validatedCode[id]){
      state.checks[id]=false;persist();refreshAction();
    }
    return;
  }
  if(data.type!=="pythoncourse-check-result"||!pendingCheck||data.requestId!==pendingCheck.requestId)return;
  pendingCheck=null;action.disabled=false;
  var result=checkCommands(data,id);
  state.checks[id]=result.ok;
  if(result.ok)state.validatedCode[id]=data.code;
  persist();refreshAction();
  makeFeedback(result.ok,result.ok?"Your program meets the requirements. Save and continue.":"Not quite yet. Compare your output and try again.",result.detail);
});
window.addEventListener("hashchange",function(){
  var id=decodeURIComponent(window.location.hash.slice(1));
  if(id==="complete" && doneCount()===8){showFinish();return}
  var ix=LESSONS.findIndex(function(l){return l.id===id});
  if(ix>=0&&ix!==currentIndex)gotoIndex(ix);
});
var hash=decodeURIComponent(location.hash.slice(1));
var startIndex=LESSONS.findIndex(function(l){return l.id===hash});
if(startIndex>=0)currentIndex=startIndex;
if(hash==="complete"&&doneCount()===8)showFinish();else render();
})();
