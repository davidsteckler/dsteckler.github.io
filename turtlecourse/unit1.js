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
  "1.1.8":"color(\"red\")\ncircle(50)\nforward(50)\n\ncircle(50)\nforward(50)"
};
var TRACE=["forward(100)","circle(10)","forward(10)","circle(20)","circle(30)","forward(30)"];
var QUIZ=[
  {q:"How would I tell Tracy to move forward 100 pixels?",options:["forward 100","move(100)","Tracy, move forward 100 pixels","forward(100)"],correct:3,hint:"A Python command needs the exact function name and parentheses."},
  {q:"When using the circle() command, what value do we put inside the parentheses?",options:["The radius of the circle","The center of the circle","The diameter of the circle","The width of the circle"],correct:0,hint:"Look at how the number 35 is used in the Slinky example."},
  {q:"When Tracy is facing right, from what location does she start drawing her circle?",options:["The top of the circle","The bottom of the circle","The left side of the circle","The middle of the circle"],correct:1,hint:"Run a single circle and look at where Tracy begins."}
];
var KEY="dsteckler-turtlecourse-unit1-v1";
var state={done:{},draft:{},checks:{},ran:{},validatedCode:{},experiments:{}};
try{
  var stored=JSON.parse(localStorage.getItem(KEY)||"null");
  if(stored && typeof stored==="object"){
    ["done","draft","checks","ran","validatedCode","experiments"].forEach(function(k){
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
  return '<h2>Run the Slinky program</h2>'+
    '<p>The original code is already loaded in <code>main.py</code>. Work through the three experiments in order. Type each response in the box below its question.</p>'+
    '<section class="slinky-part"><div class="slinky-part-head"><span>PART 1</span><h3>Run the program</h3></div>'+
    '<ol><li>Click <strong>Run</strong>.</li><li>Count the circles that Tracy draws.</li></ol>'+
    field("count","How many circles are drawn?","ANSWER →",0)+'</section>'+
    '<section class="slinky-part"><div class="slinky-part-head"><span>PART 2</span><h3>Capital letter</h3></div>'+
    '<ol><li>Before changing the code, predict what will happen if <code>circle</code> becomes <code>Circle</code>.</li></ol>'+
    field("capitalPrediction","What do you predict will happen?","PREDICTION → Write this before you run the changed program.",2)+
    '<ol start="2"><li>Change the <strong>first</strong> <code>circle</code> to <code>Circle</code>.</li><li>Click <strong>Run</strong>.</li></ol>'+
    field("capitalResult","What actually happened?","RESULT → Describe what Tracy drew or what appeared in Output.",2)+'</section>'+
    '<section class="slinky-part"><div class="slinky-part-head"><span>PART 3</span><h3>Remove parentheses</h3></div>'+
    '<ol><li>Change <code>Circle</code> back to <code>circle</code>.</li><li>Before running, predict what will happen if you remove the parentheses from the <strong>first</strong> <code>circle(35)</code>.</li></ol>'+
    field("parenPrediction","What do you predict will happen?","PREDICTION → Write this before you run the changed program.",2)+
    '<ol start="3"><li>Remove the two parentheses from the first command. Keep the number <code>35</code> in place.</li><li>Click <strong>Run</strong>.</li></ol>'+
    field("parenResult","What actually happened?","RESULT → Describe what Tracy drew or what appeared in Output.",2)+'</section>'+
    '<div class="mini-note">Once you have tested all three versions and recorded your five responses, click <strong>Save &amp; Next</strong>. Your answers save here; the Turtle editor keeps your code separately.</div>';
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
// Both the small reference and the overlay use the exact same example commands.
var EXAMPLE_PROGRAMS={
  stretched:Array(5).fill("circle(35)\nforward(40)").join("\n"),
  coil:[
    "circle(22)","forward(18)",
    "circle(35)","forward(30)",
    "circle(26)","forward(20)",
    "circle(40)","forward(25)",
    "circle(30)","forward(24)",
    "circle(20)","forward(18)"
  ].join("\n"),
  colors:[
    'bgcolor("#27A9E1")',
    'color("blue")',
    "circle(50)","forward(50)",
    'color("#E6E6FA")',
    "circle(50)","forward(50)"
  ].join("\n")
};
var EXAMPLE_FOR_LESSON={
  "1.1.4":"stretched",
  "1.1.7":"coil",
  "1.1.8":"colors"
};
function exampleImage(kind){
  var descriptions={
    stretched:"Five circles, radius 35, moving forward 40 after each ring.",
    coil:"One possible coil using six circles of different sizes.",
    colors:"Two circles in blue and lavender on a #27A9E1 background."
  };
  return '<figure class="example-figure">'+
    '<div class="example-figure-head"><strong>Example drawing</strong><span>Compare in Turtle World →</span></div>'+
    '<div class="example-live-stage">'+
      '<canvas class="example-world-canvas" width="400" height="400" data-example-kind="'+escapeHtml(kind)+'" data-example-code="'+encodeURIComponent(EXAMPLE_PROGRAMS[kind]||"")+'" role="img" aria-label="'+escapeHtml(descriptions[kind])+'"></canvas>'+
    '</div>'+
    '<figcaption>'+escapeHtml(descriptions[kind])+' Use <strong>Show example</strong> in Turtle World to overlay this drawing on your own.</figcaption>'+
  '</figure>';
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
  return '<h2>Slinky Coil Challenge</h2><p>Create a fun slinky-like pattern using only <code>circle()</code> and <code>forward()</code>.</p>'+
  exampleImage('coil')+
  '<h3>Requirements</h3><ul><li>Use <code>circle()</code> at least <strong>6 times</strong>.</li><li>Use <code>forward()</code> at least <strong>6 times</strong>.</li><li>Use at least <strong>2 different sizes</strong> for your circles.</li></ul>'+
  '<div class="mini-note">Experiment with different circle sizes and forward distances. Your drawing can look different from the example. Add a comment describing what your pattern looks like to you.</div>'+
  '<p>Click <strong>Run</strong> to view your creation, then check your program when ready.</p>';
}
function colorsContent(){
  return '<h2>Color &amp; Background Color</h2><p>You start with two red circles. Change the background and draw the circles with two new pen colors.</p>'+
  exampleImage('colors')+
  '<h3>Change these three things</h3><ol><li>Add <code>bgcolor("#27A9E1")</code> near the top to change the background.</li><li>Change <code>color("red")</code> to another built-in color, like <code>"blue"</code>.</li><li>Add a new <code>color("#...")</code> before the second circle, using a six-digit hex color.</li></ol>'+
  '<div class="mini-note">The second <code>color()</code> should come before the second <code>circle(50)</code>. Keep the two circles and their forward movements in your program.</div>'+
  '<div class="resource-links"><a href="/hex/" target="_blank" rel="noopener">Hex color picker ↗</a><a href="/turtlereference/" target="_blank" rel="noopener">Command reference ↗</a></div>';
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
  if(window.TurtleCourseExamples)window.TurtleCourseExamples.render(body);
  restoreDraft();
  previous.disabled=currentIndex===0;
  workspace.classList.toggle("no-editor",!l.editor);
  editorCard.hidden=!l.editor;
  workspace.classList.remove("focus-editor");
  if(expandEditorBtn){expandEditorBtn.setAttribute("aria-pressed","false");expandEditorBtn.textContent="⤢ Expand editor"}
  editorReady=false;pendingCheck=null;
  if(l.editor){
    var referenceKind=EXAMPLE_FOR_LESSON[l.id];
    var referenceCode=referenceKind?EXAMPLE_PROGRAMS[referenceKind]:"";
    var url="/turtle/?embed=course&ui=unit1-console-v2&rev=unit1-overlay-v1&lesson="+encodeURIComponent("turtlecourse-"+l.id)+"&code="+encodeURIComponent(STARTERS[l.id]||"")+(referenceCode?"&overlay="+encodeURIComponent(referenceCode):"");
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
    var colors=calls.filter(function(c){return c.name==="color" && typeof c.str==="string"}).map(function(c){return c.str});
    var backs=calls.filter(function(c){return c.name==="bgcolor"});
    var circles=calls.filter(function(c){return c.name==="circle"});
    var named=colors.some(function(c){return /^[a-z]+$/i.test(c) && c.toLowerCase()!=="red"});
    var hex=colors.some(function(c){return /^#[0-9a-f]{6}$/i.test(c)});
    var checks=[
      {pass:backs.some(function(c){return String(c.str||"").toUpperCase()==="#27A9E1"}),msg:'Use bgcolor("#27A9E1").'},
      {pass:named,msg:"Change the first pen to a different named color."},
      {pass:hex,msg:"Use a six-digit hex color for the second pen."},
      {pass:circles.length===2,msg:"Keep exactly two circles."},
      {pass:calls.filter(function(c){return c.name==="forward"}).length===2,msg:"Keep the two forward commands."}
    ];
    return {ok:checks.every(function(c){return c.pass}),detail:checks.map(function(c){return (c.pass?"✓ ":"• ")+c.msg})};
  }
  if(id==="1.1.7"){
    var rings=calls.filter(function(c){return c.name==="circle"});
    var moves=calls.filter(function(c){return c.name==="forward"});
    var radii=new Set(rings.map(function(c){return Number(c.num)}));
    var tests=[
      {ok:rings.length>=6,msg:"Use circle() at least 6 times. Found "+rings.length+"."},
      {ok:moves.length>=6,msg:"Use forward() at least 6 times. Found "+moves.length+"."},
      {ok:radii.size>=2,msg:"Try at least 2 different circle sizes."},
      {ok:calls.every(function(c){return c.name==="circle"||c.name==="forward"}),msg:"Use only circle() and forward() drawing commands."}
    ];
    return {ok:tests.every(function(x){return x.ok}),detail:tests.map(function(x){return (x.ok?"✓ ":"• ")+x.msg})};
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
    var seen=state.experiments[id]||{};
    if(!state.done[id]&&!seen.original){makeFeedback(false,"Run the original Slinky first.",["Click Run with the five original circle(35) commands."]);return}
    if(!state.done[id]&&!seen.capital){makeFeedback(false,"Test the capital letter change.",["Write your prediction, change the first line to Circle(35), and click Run."]);return}
    if(!state.done[id]&&!seen.paren){makeFeedback(false,"Test the missing parentheses.",["Write your prediction, remove both parentheses from the first command (keep 35), and click Run."]);return}
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
  if(data.type==="turtlecourse-starter-reset-result"){
    if(data.ok){
      delete state.checks[id];
      delete state.validatedCode[id];
      delete state.ran[id];
      delete state.experiments[id];
      persist();
      refreshAction();
      setStatus("Original starter restored · previous code stays in History");
    }else{
      setStatus("Could not reset the starter code. Please retry.");
    }
    return;
  }
  if(data.type==="pythoncourse-run-complete"){
    if(id==="1.1.2"&&typeof data.code==="string"){
      var steps=state.experiments[id]||{};
      var firstLine=data.code.split(/\r?\n/).map(function(line){return line.trim()}).find(function(line){return !!line&&line.charAt(0)!=="#"})||"";
      var executed=(data.runtime&&Array.isArray(data.runtime.calls))?data.runtime.calls:[];
      if(firstLine==="circle(35)"&&data.run&&data.run.ok&&executed.filter(function(op){return op.name==="circle"}).length===5){
        steps.original=true;
      }else if(firstLine==="Circle(35)"&&steps.original&&String(answers().capitalPrediction||"").trim()&&data.run&&!data.run.ok){
        steps.capital=true;
      }else if(/^circle\s*35$/.test(firstLine)&&steps.capital&&String(answers().parenPrediction||"").trim()&&data.run&&!data.run.ok){
        steps.paren=true;
      }
      state.experiments[id]=steps;
      persist();
      if(steps.paren)setStatus("All three versions tested · record your results");
      else if(steps.capital)setStatus("Capital letter tested · continue with parentheses");
      else if(steps.original)setStatus("Original Slinky ran · continue to your prediction");
    }
    if(data.run&&data.run.ok){state.ran[id]=true;persist();if(id!=="1.1.2")setStatus("Program ran · code is saved separately")}
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
