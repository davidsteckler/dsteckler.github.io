(function(){
"use strict";

var LESSONS=[
  {id:"1.1.1",name:"Intro to Python with Tracy the Turtle",short:"Intro to Python",kind:"Video",type:"video",subtitle:"Meet Tracy and see what a program can tell her to do.",editor:false},
  {id:"1.1.2",name:"Slinky (Example Program)",short:"Slinky example",kind:"Example",type:"example",subtitle:"Run a program, predict changes, and notice what the error messages tell you.",editor:true},
  {id:"1.1.3",name:"Intro to Tracy",short:"Check for understanding",kind:"Quiz · 3 questions",type:"quiz",subtitle:"Check what you know about commands and circles.",editor:false},
  {id:"1.1.4",name:"Stretched Slinky",short:"Stretched Slinky",kind:"Assignment",type:"assignment",subtitle:"Write the commands yourself and compare your output with the instructions.",editor:true},
  {id:"1.1.5",name:"Sequencing with Trace Tables",short:"Trace tables",kind:"Assignment · Trace table",type:"assignment",subtitle:"Read a program one instruction at a time and record the order.",editor:false},
  {id:"1.1.6",name:"How Trace Tables Work & How to Make a Sandbox Program",short:"Trace table video",kind:"Video",type:"video",subtitle:"Watch how to complete a trace table and make your own sandbox program.",editor:false},
  {id:"1.1.7",name:"Slinky Coil Challenge",short:"Slinky Coil Challenge",kind:"Project · Challenge",type:"project",subtitle:"Practice writing a longer sequence of circle and forward commands.",editor:true},
  {id:"1.1.8",name:"Color & Background Color",short:"Color & background",kind:"Assignment",type:"assignment",subtitle:"Give the drawing a new background and use different pen colors.",editor:true}
];
/* Activity types: icon + label shown in the lesson list and the title bar. */
var TYPE_INFO={
  video:{label:"Video",icon:'<svg viewBox="0 0 20 20" aria-hidden="true"><rect x="2.5" y="4.5" width="15" height="11" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M8.5 7.6v4.8l4-2.4z" fill="currentColor"/></svg>'},
  example:{label:"Example",icon:'<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M7 6 3 10l4 4M13 6l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'},
  quiz:{label:"Quiz",icon:'<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="7.3" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M7.9 8.1a2.2 2.2 0 1 1 3.2 2c-.7.4-1.1.8-1.1 1.6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="10" cy="14.2" r="1" fill="currentColor"/></svg>'},
  assignment:{label:"Assignment",icon:'<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M12.8 3.5 16.5 7.2 8 15.7l-4.3.6.6-4.3z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="m11.2 5.1 3.7 3.7" stroke="currentColor" stroke-width="1.7"/></svg>'},
  project:{label:"Project",icon:'<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 2.8l2.2 4.6 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5L2.8 8.1l5-.7z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>'}
};
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
  {q:"How would I tell Tracy to move forward 100 pixels?",options:["forward 100","move(100)","Tracy, move forward 100 pixels","forward(100)"],correct:3,
   feedback:["Close! Python needs something around the number. Look at how every command in the Slinky program is written.","Tracy doesn't know a command called move. Which command name made her go straight in the Slinky program?","Python can't read English sentences. It needs a command name with the value written in a special way.",""]},
  {q:"When using the circle() command, what value do we put inside the parentheses?",options:["The radius of the circle","The center of the circle","The diameter of the circle","The width of the circle"],correct:0,
   feedback:["","You never type a location inside circle(). The number is a distance. Think about what circle(35) measured.","Close! The diameter goes all the way across the circle. The number Tracy uses is only part of that distance.","Width is all the way across the circle. The number Tracy uses is only part of that distance."]},
  {q:"When Tracy is facing right, from what location does she start drawing her circle?",options:["The top of the circle","The bottom of the circle","The left side of the circle","The middle of the circle"],correct:1,
   feedback:["Run circle(50) in the Sandbox and watch Tracy. When she's done, is the circle above her or below her?","","Tracy is facing right, so her first step goes to the right, not up or down. Where would that put her on the circle?","Tracy draws the outline of the circle, so she's standing on its edge, not inside it."]}
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
  container.className="feedback "+(good?"good":"bad");
  container.innerHTML="<strong>"+escapeHtml(title)+"</strong>"+(details&&details.length?"<ul>"+details.map(function(d){return "<li>"+escapeHtml(d)+"</li>"}).join("")+"</ul>":"");
  container.hidden=false;
}
function renderMenu(){
  menu.innerHTML=LESSONS.map(function(l,i){
    var active=i===currentIndex&&!finishView,complete=!!state.done[l.id];
    return '<button type="button" class="lesson-nav'+(active?' active':'')+(complete?' done':'')+'" data-index="'+i+'" title="'+escapeHtml(l.id+' '+l.short+' · '+l.kind)+'" '+(active?'aria-current="step"':'')+'><span class="lesson-num type-'+l.type+'" aria-label="'+TYPE_INFO[l.type].label+'">'+TYPE_INFO[l.type].icon+'</span><span class="lesson-text"><span class="lesson-name">'+escapeHtml(l.short)+'</span><span class="lesson-type">'+escapeHtml(l.kind)+'</span></span><span class="lesson-tick" aria-label="'+(complete?'Completed':'Not complete')+'">'+(complete?'✓':'')+'</span></button>';
  }).join("");
}
function field(key,title,hint,rows){
  return '<div class="field"><label for="answer-'+key+'">'+title+'</label>'+
    (rows?'<textarea id="answer-'+key+'" data-answer="'+key+'" rows="'+rows+'"></textarea>':'<input id="answer-'+key+'" data-answer="'+key+'" type="text" autocomplete="off">')+
    (hint?'<div class="field-help">'+hint+'</div>':'')+'</div>';
}
/* Chapters: [seconds, "title"]. Students can jump to any chapter, but only
   parts they actually watch count toward the WATCH_NEEDED percentage. */
var WATCH_NEEDED=90;
var VIDEO_CHAPTERS={
  "1.1.1":[[0,"Meet Tracy: forward()"],[48,"Starting spot (0, 0)"],[63,"The circle() command"],[88,"Building the Slinky"],[145,"Errors & missing parentheses"],[263,"Keyboard tips & finishing up"]],
  "1.1.6":[]
};
var VIDEO_PROMPTS={
  "1.1.1":["What is Tracy, and where does she start?","What does the number inside circle() or forward() change?","What happens when a command is typed incorrectly?"],
  "1.1.6":["What goes in each column of a trace table?","Why do we write down the line number for each step?","How do you start a new sandbox program?"]
};
function videoContent(videoId,intro){
  var id=LESSONS[currentIndex].id,prompts=VIDEO_PROMPTS[id]||[];
  return '<h2>'+intro+'</h2>'+
    '<div class="video-layout">'+
      '<div class="video-main">'+
        '<div class="vp-box" id="vpBox">'+
          '<div class="video-wrap"><div class="cp-overlay" id="cpOverlay" hidden></div><iframe class="youtube-frame" id="ytPlayer" data-video="'+escapeHtml(videoId)+'" src="https://www.youtube-nocookie.com/embed/'+encodeURIComponent(videoId)+'?enablejsapi=1&rel=0&controls=0&disablekb=1&fs=0&iv_load_policy=3&playsinline=1&origin='+encodeURIComponent(location.origin)+'" title="'+escapeHtml(intro)+'" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>'+
          '<div class="vp-bar" role="toolbar" aria-label="Video controls">'+
            '<button type="button" class="vp-play" id="vpPlay" title="Play / pause (Space when not typing)">▶</button>'+
            '<button type="button" class="vt-btn" data-video-skip="-10" title="Back 10 seconds">↺ 10s</button>'+
            '<div class="vp-track" id="vpTrack" title="Click a part you\'ve already watched to go back. Use chapters to jump ahead."><div class="vp-watched" id="vpWatched"></div><div class="vp-ticks" id="vpTicks"></div><div class="vp-head" id="vpHead"></div></div>'+
            '<span class="vp-time" id="vpTime">0:00 / –:––</span>'+
            '<select class="vp-speed" id="vpSpeed" aria-label="Playback speed">'+[0.75,1,1.25,1.5].map(function(r){return '<option value="'+r+'"'+(r===1?' selected':'')+'>'+r+'×</option>'}).join("")+'</select>'+
            '<button type="button" class="vt-btn" id="vpFull" title="Full screen">⛶</button>'+
          '</div>'+
        '</div>'+
        '<div class="vp-meter"><div class="vp-meter-bar"><span id="vpMeterFill"></span></div><span id="vpMeterText">Watched 0% · watch at least '+WATCH_NEEDED+'% to continue</span><span class="vt-status" id="videoStatus" aria-live="polite"></span>'+
          '<select class="vp-reset" id="vpReset" aria-label="Reset watch progress" title="Start over: clears watch progress so you can see the video fresh"><option value="">↺ Reset…</option><option value="all">Whole video</option>'+(VIDEO_CHAPTERS[id]||[]).map(function(c,i){return '<option value="'+i+'">Chapter '+(i+1)+': '+escapeHtml(c[1])+'</option>'}).join("")+'</select>'+
        '</div>'+
        '<div class="vp-keys">Keys: <kbd>Space</kbd> play/pause · <kbd>←</kbd><kbd>→</kbd> 5 sec · '+((VIDEO_CHAPTERS[id]||[]).length?'<kbd>1</kbd>–<kbd>'+(VIDEO_CHAPTERS[id]||[]).length+'</kbd> chapters · ':'')+'→ only moves through parts you\'ve watched</div>'+
        '<div class="chapters" id="chapterList"></div>'+
        '<p class="linkline">Video not loading? <a href="https://www.youtube.com/watch?v='+encodeURIComponent(videoId)+'" target="_blank" rel="noopener">Open it on YouTube ↗</a> and tell your teacher.</p>'+
      '</div>'+
      '<aside class="notes-panel" aria-label="Your notes">'+
        (vxTranscript(id).length?'<div class="np-tabs" role="tablist"><button type="button" role="tab" class="np-tab on" data-tab="notes" aria-selected="true">📝 My notes</button><button type="button" role="tab" class="np-tab" data-tab="transcript" aria-selected="false">💬 Transcript</button></div>'+
          '<div class="transcript" id="transcriptPane" hidden><div class="tr-tip">Click a line to jump there. The line being spoken is highlighted.</div>'+vxTranscript(id).map(function(l,i){return '<button type="button" class="tr-line" data-tline="'+i+'"><span class="tr-time">'+fmtTime(l[0])+'</span><span class="tr-text">'+escapeHtml(l[1])+'</span></button>'}).join("")+'</div>':'')+
        '<div class="notes-pane" id="notesPane">'+
        '<div class="notes-head"><strong>My notes</strong><span id="notesSaved">Saves automatically</span></div>'+
        (prompts.length?'<div class="watch-for"><div class="watch-label">Watch for</div>'+prompts.map(function(q){return '<button type="button" class="watch-q" data-prompt="'+escapeHtml(q)+'" title="Add this question to your notes">+ '+escapeHtml(q)+'</button>'}).join("")+'</div>':'')+
        '<textarea id="answer-notes" class="notes-text" data-answer="notes" spellcheck="true" placeholder="Type notes while you watch.&#10;&#10;Tip: click ⏱ Add time to stamp the moment — click the stamp later to jump back."></textarea>'+
        '<div class="notes-actions">'+
          '<button type="button" class="vt-btn primary" id="stampBtn" title="Insert the current video time (Alt+T)">⏱ Add time</button>'+
          '<button type="button" class="vt-btn" id="pauseNoteBtn" title="Pause the video and jump to your notes (Alt+N)">❚❚ Pause &amp; write</button>'+
          '<button type="button" class="vt-btn" id="copyNotesBtn" title="Copy your notes">Copy</button>'+
        '</div>'+
        '<div class="stamp-list" id="stampList" aria-label="Jump to a moment"></div>'+
        '</div>'+
      '</aside>'+
    '</div>';
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
/* Quiz rules: all answers must be correct to move on. Wrong picks are crossed
   out with a hint (never the answer), and the first-try score is what counts. */
var QUIZ_WAIT=5;
function quizData(){var d=answers();if(!d.qz)d.qz={tries:[0,0,0],locked:[[],[],[]],solved:[false,false,false],first:[null,null,null]};return d.qz}
function quizContent(){
  return '<h2>Check for understanding</h2><p>Pick one answer for each question, then click <strong>Check answers</strong>. Your <strong>first-try score</strong> is recorded, so think before you answer. If you miss one, you\'ll get a hint and can try that question again. You need all '+QUIZ.length+' right to move on.</p>'+
    '<div class="quiz-progress" id="quizProgress">'+QUIZ.map(function(_,i){return '<span data-dot="'+i+'"></span>'}).join("")+'</div>'+
  QUIZ.map(function(q,i){
    return '<div class="quiz-block" id="quizBlock'+i+'"><div class="quiz-count">Question '+(i+1)+' of '+QUIZ.length+'<span class="quiz-tries" id="quizTries'+i+'"></span></div><div class="quiz-title">'+escapeHtml(q.q)+'</div>'+
      '<div class="radio-options">'+q.options.map(function(o,j){
        return '<label class="radio-option" data-opt="'+j+'"><input type="radio" name="quiz-'+i+'" data-answer="q'+i+'" value="'+j+'"><span class="opt-letter">'+"ABCD"[j]+'</span><span class="opt-text">'+escapeHtml(o)+'</span><span class="opt-tag"></span></label>';
      }).join("")+'</div><div class="quiz-result" id="quizResult'+i+'" aria-live="polite"></div></div>';
  }).join("");
}
function quizPaint(){
  var z=quizData(),d=answers();
  QUIZ.forEach(function(q,i){
    var block=el("quizBlock"+i);if(!block)return;
    block.classList.toggle("solved",z.solved[i]);
    block.querySelectorAll(".radio-option").forEach(function(opt){
      var j=Number(opt.dataset.opt),inp=opt.querySelector("input"),tag=opt.querySelector(".opt-tag");
      var crossed=z.locked[i].indexOf(j)>-1;
      opt.classList.toggle("opt-crossed",crossed);
      opt.classList.toggle("opt-correct",z.solved[i]&&j===q.correct);
      inp.disabled=crossed||z.solved[i];
      tag.textContent=crossed?"✗ Not this one":(z.solved[i]&&j===q.correct?"✓ Correct":"");
    });
    var res=el("quizResult"+i),lastWrong=z.locked[i][z.locked[i].length-1];
    if(z.solved[i]){res.className="quiz-result good";res.innerHTML="<strong>Correct!</strong>"+(z.first[i]?" First try.":"")}
    else if(lastWrong!==undefined){res.className="quiz-result bad";res.innerHTML="<strong>Not quite. Hint:</strong> "+escapeHtml(q.feedback[lastWrong])}
    else{res.className="quiz-result";res.textContent=""}
    el("quizTries"+i).textContent=z.tries[i]>1||(!z.solved[i]&&z.tries[i])?" · try "+(z.tries[i]+(z.solved[i]?0:1)):"";
    var dot=body.querySelector('[data-dot="'+i+'"]');if(dot)dot.className=z.solved[i]?(z.first[i]?"right":"later"):(z.tries[i]?"wrong":"");
  });
  setHeadScore();
}
function setHeadScore(animate){
  var z=quizData(),d=answers(),hs=el("headScore");
  var checked=z.first.filter(function(x){return x!==null}).length,firstRight=z.first.filter(function(x){return x===true}).length;
  hs.hidden=false;el("headRetake").hidden=false;
  hs.className="head-score "+(checked<QUIZ.length?"":firstRight===QUIZ.length?"perfect":firstRight>0?"some":"none");
  hs.title="First-try score: questions answered correctly on the first attempt";
  hs.innerHTML='<span>First try</span><b>'+(checked?firstRight:"–")+"/"+QUIZ.length+'</b>'+(d.best!==undefined?'<em>Best '+d.best+'/'+QUIZ.length+'</em>':'');
  if(animate){hs.classList.remove("pop");void hs.offsetWidth;hs.classList.add("pop")}
}
var quizCooldown=null;
function startCooldown(){
  var left=QUIZ_WAIT;clearInterval(quizCooldown);action.disabled=true;
  action.textContent="Read the hint… "+left;
  quizCooldown=setInterval(function(){
    left--;
    if(left<=0||LESSONS[currentIndex].id!=="1.1.3"){clearInterval(quizCooldown);quizCooldown=null;action.disabled=false;refreshAction();return}
    action.textContent="Read the hint… "+left;
  },1000);
}
function quizCheck(){
  if(quizCooldown)return;
  var z=quizData(),d=answers(),open=[],missing=[];
  QUIZ.forEach(function(_,i){if(!z.solved[i]){open.push(i);if(d["q"+i]===undefined)missing.push(i)}});
  if(missing.length){
    missing.forEach(function(i){var r=el("quizResult"+i);r.className="quiz-result bad";r.textContent="Choose an answer.";var b=el("quizBlock"+i);b.classList.remove("nudge");void b.offsetWidth;b.classList.add("nudge")});
    makeFeedback(false,"Answer every question first.",[]);return;
  }
  var wrong=0;
  open.forEach(function(i){
    var q=QUIZ[i],pick=Number(d["q"+i]),ok=pick===q.correct,block=el("quizBlock"+i);
    z.tries[i]++;
    if(z.first[i]===null)z.first[i]=ok;
    if(ok)z.solved[i]=true;else{wrong++;if(z.locked[i].indexOf(pick)<0)z.locked[i].push(pick);delete d["q"+i];var inp=block.querySelector('input[value="'+pick+'"]');if(inp)inp.checked=false}
    block.classList.remove("anim-right","anim-wrong");void block.offsetWidth;block.classList.add(ok?"anim-right":"anim-wrong");
  });
  quizPaint();setHeadScore(z.first.every(function(x){return x!==null})&&open.length===QUIZ.length);
  var allDone=z.solved.every(Boolean);
  if(allDone){
    var firstRight=z.first.filter(function(x){return x===true}).length;
    d.best=Math.max(Number(d.best)||0,firstRight);setHeadScore();
    state.checks["1.1.3"]=true;persist();refreshAction();
    makeFeedback(true,"All "+QUIZ.length+" correct! First-try score: "+firstRight+"/"+QUIZ.length+". Click Save & Next to continue.",[]);
    if(firstRight===QUIZ.length)celebrate();
  }else{
    state.checks["1.1.3"]=false;persist();
    makeFeedback(false,wrong+" answer"+(wrong>1?"s need":" needs")+" another look. Read the hint under each red question, then choose again.",[]);
    var firstBad=open.filter(function(i){return !z.solved[i]})[0];
    el("quizBlock"+firstBad).scrollIntoView({block:"center",behavior:"smooth"});
    startCooldown();
  }
}
function quizRetake(){
  if(!confirm("Start the quiz over? Your answers will be cleared. Your best first-try score is kept."))return;
  var d=answers();
  QUIZ.forEach(function(_,i){delete d["q"+i]});delete d.qz;
  clearInterval(quizCooldown);quizCooldown=null;action.disabled=false;
  state.checks["1.1.3"]=false;persist();
  body.innerHTML=quizContent();quizPaint();
  el("activityFeedback").hidden=true;refreshAction();body.scrollTop=0;
  setStatus("New attempt · choose your answers");
}
function celebrate(){
  var layer=document.createElement("div");layer.className="confetti";layer.setAttribute("aria-hidden","true");
  var colors=["#087f8c","#24835b","#d29d43","#e8705a","#5b8def","#9b6bd6"];
  for(var i=0;i<70;i++){
    var c=document.createElement("i");
    c.style.left=(Math.random()*100)+"%";c.style.background=colors[i%colors.length];
    c.style.animationDelay=(Math.random()*.5)+"s";c.style.animationDuration=(1.6+Math.random()*1.3)+"s";
    c.style.setProperty("--drift",(Math.random()*160-80)+"px");c.style.setProperty("--spin",(Math.random()*720-360)+"deg");
    layer.appendChild(c);
  }
  document.body.appendChild(layer);setTimeout(function(){layer.remove()},3400);
}
body.addEventListener("click",function(e){if(e.target.closest("#quizRetake"))quizRetake()});
el("headRetake").addEventListener("click",quizRetake);
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
    '<div class="example-figure-head"><strong>Goal drawing</strong></div>'+
    '<div class="example-live-stage">'+
      '<canvas class="example-world-canvas" width="400" height="400" data-example-kind="'+escapeHtml(kind)+'" data-example-code="'+encodeURIComponent(EXAMPLE_PROGRAMS[kind]||"")+'" role="img" aria-label="'+escapeHtml(descriptions[kind])+'"></canvas>'+
    '</div>'+
    '<figcaption>Tip: click <strong>Show example</strong> above Turtle World to lay this over your drawing.</figcaption>'+
  '</figure>';
}

function stretchedContent(){
  return '<h2>Make a stretched-out slinky</h2><p>Write your own program in <code>main.py</code>. Click <strong>Run</strong> to see the drawing, then <strong>Check my work</strong>.</p>'+
  '<div class="example-row"><div><strong>Your program should have:</strong><ul class="task-list"><li><span><strong>Five rings</strong></span></li><li><span>Every circle has a <strong>radius of 35</strong></span></li><li><span>Tracy moves forward <strong>40 pixels after every circle</strong></span></li></ul></div>'+exampleImage('stretched')+'</div>'+
  '<div class="mini-note">You already saw the original slinky in 1.1.2. Compare your new spacing with that example. The checker looks at the commands your program executes.</div>'+
  '<div class="resource-links"><a href="/turtlereference/" target="_blank" rel="noopener">Turtle command reference ↗</a></div>';
}
function traceContent(){
  var table=TRACE.map(function(command,i){
    return '<tr><td>'+(i+1)+'</td><td><input class="line-field" aria-label="Line number for step '+(i+1)+'" data-answer="line'+i+'" inputmode="numeric" autocomplete="off"></td><td><input aria-label="Command for step '+(i+1)+'" data-answer="command'+i+'" autocomplete="off" spellcheck="false"></td></tr>';
  }).join("");
  var ex=["circle(50)","forward(25)","circle(20)"];
  return '<h2>Sequencing with Trace Tables</h2>'+
    '<p>A <strong>trace table</strong> is a way to test a program by stepping through each line of code as the program runs. We\'ll come back to trace tables all year. For now, here\'s a simple start.</p>'+
    '<div class="trace-example"><div class="trace-example-label">Example</div>'+
      '<div class="trace-layout"><pre class="codebox">'+ex.map(function(l,i){return (i+1)+'   '+l}).join("\n")+'</pre>'+
      '<table class="trace-table trace-filled"><thead><tr><th>Step</th><th>Line</th><th>Command</th></tr></thead><tbody>'+
        ex.map(function(l,i){return '<tr><td>'+(i+1)+'</td><td class="mono">'+(i+1)+'</td><td class="mono">'+l+'</td></tr>'}).join("")+'</tbody></table></div>'+
      '<p class="trace-why">Line 1 runs first, then line 2, and the program ends with line 3. Each step is one command, written exactly as it appears in the code.</p></div>'+
    '<h3>Your turn: complete the trace table for this program</h3>'+
    '<p>Fill in the <strong>line number</strong> and the <strong>exact command</strong> for each step, in the order they run.</p>'+
    '<div class="trace-layout"><pre class="codebox">'+TRACE.map(function(line,i){return (i+1)+'   '+line}).join("\n")+'</pre>'+
    '<table class="trace-table"><thead><tr><th>Step</th><th>Line</th><th>Command</th></tr></thead><tbody>'+table+'</tbody></table></div>'+
    '<div class="mini-note">In this first example, each line runs once. Later, loops and functions will make the order more interesting.</div>'+
    '<div class="resource-links"><a href="/tracetable/" target="_blank" rel="noopener">Explore the animated trace table ↗</a></div>';
}
function coilContent(){
  return '<h2>Slinky Coil Challenge</h2><p>Create a fun slinky-like pattern using only <code>circle()</code> and <code>forward()</code>.</p>'+
  '<div class="example-row"><div><strong>Requirements</strong><ul class="task-list"><li><span>Use <code>circle()</code> at least <strong>6 times</strong></span></li><li><span>Use <code>forward()</code> at least <strong>6 times</strong></span></li><li><span>Use at least <strong>2 different sizes</strong> of circle</span></li></ul></div>'+exampleImage('coil')+'</div>'+
  '<div class="mini-note">Experiment with different circle sizes and forward distances. Your drawing can look different from the example. Add a comment describing what your pattern looks like to you.</div>'+
  '<p>Click <strong>Run</strong> to view your creation, then check your program when ready.</p>';
}
function colorsContent(){
  return '<h2>Color &amp; Background Color</h2><p>You start with two red circles. Change the background and draw the circles with two new pen colors.</p>'+
  '<div class="example-row"><div><strong>Change these three things</strong><ul class="task-list"><li><span>Add <code>bgcolor("#27A9E1")</code> near the top to change the background.</span></li><li><span>Change <code>color("red")</code> to another built-in color, like <code>"blue"</code>.</span></li><li><span>Add a new <code>color("#...")</code> before the second circle, using a six-digit hex color.</span></li></ul></div>'+exampleImage('colors')+'</div>'+
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
/* ---- Video lessons: YouTube player API for timestamps, speed, skipping ---- */
var ytPlayer=null,ytApiState="none",ytQueue=[];
function fmtTime(t){t=Math.max(0,Math.floor(t));return Math.floor(t/60)+":"+String(t%60).padStart(2,"0")}
function parseTime(x){var m=/^(\d+):(\d{2})$/.exec(x);return m?Number(m[1])*60+Number(m[2]):null}
function videoStatus(msg){var n=el("videoStatus");if(n)n.textContent=msg||""}
function withYT(cb){
  if(window.YT&&window.YT.Player){cb();return}
  ytQueue.push(cb);
  if(ytApiState!=="none")return;
  ytApiState="loading";
  var prev=window.onYouTubeIframeAPIReady;
  window.onYouTubeIframeAPIReady=function(){ytApiState="ready";if(prev)try{prev()}catch(e){};var q=ytQueue;ytQueue=[];q.forEach(function(f){f()})};
  var tag=document.createElement("script");tag.src="https://www.youtube.com/iframe_api";
  tag.onerror=function(){ytApiState="failed";videoStatus("Video tools unavailable on this network — notes still save.")};
  document.head.appendChild(tag);
}
var vpTimer=null,vpDur=0,vpLastT=null,vpSaveTick=0,vpFallbackTimer=null;
function watchData(){var d=answers();if(typeof d.watched!=="string")d.watched="";return d}
function watchedBits(){return watchData().watched}
function markSecond(sec){
  var d=watchData(),w=d.watched;if(!vpDur||sec<0||sec>=vpDur)return;
  if(w.length<vpDur)w=w+"0".repeat(vpDur-w.length);
  if(w[sec]==="1")return;
  d.watched=w.slice(0,sec)+"1"+w.slice(sec+1);
}
function watchedPct(){var w=watchedBits();if(!vpDur)return 0;var n=0;for(var i=0;i<Math.min(w.length,vpDur);i++)if(w[i]==="1")n++;return Math.round(n/vpDur*100)}
function furthestWatched(){var w=watchedBits();return w.lastIndexOf("1")}
function videoUnlocked(){var id=LESSONS[currentIndex].id;return !!state.done[id]||!!state.checks[id]}
function paintVideo(){
  if(!el("vpTrack"))return;
  var t=playerOk()?ytPlayer.getCurrentTime():0,w=watchedBits();
  el("vpTime").textContent=fmtTime(t)+" / "+(vpDur?fmtTime(vpDur):"–:––");
  if(vpDur){
    el("vpHead").style.left=(t/vpDur*100)+"%";
    // watched segments → gradient stops
    var stops=[],i=0;
    while(i<vpDur){var on=w[i]==="1",j=i;while(j<vpDur&&(w[j]==="1")===on)j++;stops.push((on?"var(--vp-on)":"transparent")+" "+(i/vpDur*100)+"% "+(j/vpDur*100)+"%");i=j}
    el("vpWatched").style.background="linear-gradient(90deg,"+stops.join(",")+")";
  }
  var pct=watchedPct(),unlocked=videoUnlocked();
  el("vpMeterFill").style.width=Math.min(100,pct/WATCH_NEEDED*100)+"%";
  el("vpMeterFill").parentNode.classList.toggle("done",unlocked);
  el("vpMeterText").textContent=unlocked?"✓ Watched "+pct+"% · you can continue":"Watched "+pct+"% · watch at least "+WATCH_NEEDED+"% to continue";
  paintChapters(t);paintTranscript(t);
  var cps=vxCheckpoints(LESSONS[currentIndex].id),cdone=cps.filter(function(_,i){var c=cpState()[i];return c&&c.ok}).length;
  if(cps.length&&!unlocked)el("vpMeterText").textContent+=" · checkpoints "+cdone+"/"+cps.length;
  if(!unlocked&&pct>=WATCH_NEEDED&&checkpointsDone()){state.checks[LESSONS[currentIndex].id]=true;persist();refreshAction();makeFeedback(true,"Video watched. Click Mark watched & Next to continue.",[])}
}
function paintChapters(t){
  var list=el("chapterList"),ch=VIDEO_CHAPTERS[LESSONS[currentIndex].id]||[];
  if(!list)return;
  if(!ch.length){list.hidden=true;return}
  list.hidden=false;
  var w=watchedBits();
  if(!list.dataset.built||list.dataset.built!==String(vpDur)){
    list.dataset.built=String(vpDur);
    list.innerHTML='<div class="watch-label">Chapters</div>'+ch.map(function(c,i){return '<button type="button" class="chapter" data-chapter="'+i+'"><span class="ch-time">'+fmtTime(c[0])+'</span><span class="ch-title">'+escapeHtml(c[1])+'</span><span class="ch-state"></span></button>'}).join("");
    el("vpTicks").innerHTML=vpDur?ch.map(function(c){return '<i style="left:'+(c[0]/vpDur*100)+'%"></i>'}).join(""):"";
  }
  ch.forEach(function(c,i){
    var start=c[0],end=i+1<ch.length?ch[i+1][0]:(vpDur||start+1),n=0,tot=Math.max(1,end-start);
    for(var k=start;k<end;k++)if(w[k]==="1")n++;
    var btn=list.querySelector('[data-chapter="'+i+'"]');if(!btn)return;
    var done=n/tot>=0.9;
    btn.classList.toggle("watched",done);
    btn.classList.toggle("current",t>=start&&t<end);
    btn.querySelector(".ch-state").textContent=done?"✓":(n?Math.round(n/tot*100)+"%":"");
  });
}
function videoTick(){
  if(!playerOk())return;
  if(!vpDur){var d0=Math.floor(ytPlayer.getDuration()||0);if(d0>0){vpDur=d0;paintChapters(0)}}
  var st=ytPlayer.getPlayerState&&ytPlayer.getPlayerState(),t=ytPlayer.getCurrentTime();
  if(cpOpen!==null&&st===1){ytPlayer.pauseVideo();return}
  el("vpPlay")&&(el("vpPlay").textContent=st===1?"❚❚":"▶");
  if(st===1&&vpLastT!==null&&t>=vpLastT&&t-vpLastT<2.5&&cpOpen===null){
    var cps=vxCheckpoints(LESSONS[currentIndex].id),cs=cpState();
    for(var ci=0;ci<cps.length;ci++){if(!(cs[ci]&&cs[ci].ok)&&cps[ci].at>vpLastT-0.01&&cps[ci].at<=t+0.01){vpLastT=t;showCheckpoint(ci);paintVideo();return}}
  }
  if(st===1&&vpLastT!==null&&t>=vpLastT&&t-vpLastT<2.5){
    for(var s0=Math.floor(vpLastT);s0<=Math.floor(t);s0++)markSecond(s0);
    if(++vpSaveTick%8===0)persist();
  }
  vpLastT=t;
  paintVideo();
}
function videoFallback(reason){
  // Tracking isn't possible (YouTube API blocked): give back normal controls and don't lock students out.
  var f=el("ytPlayer");if(!f||f.dataset.fallback)return;
  f.dataset.fallback="1";
  f.src=f.src.replace("controls=0","controls=1").replace("&disablekb=1","").replace("&fs=0","");
  var bar=document.querySelector(".vp-bar");if(bar)bar.hidden=true;
  var id=LESSONS[currentIndex].id;state.checks[id]=true;persist();refreshAction();
  var m=el("vpMeterText");if(m)m.textContent="Watch-time tracking isn't available on this network. Watch the whole video, then continue.";
}
function vxTranscript(id){var x=window.TurtleCourseVideoExtras;return (x&&x.transcripts[id])||[]}
function vxCheckpoints(id){var x=window.TurtleCourseVideoExtras;return (x&&x.checkpoints[id])||[]}
function cpState(){var d=answers();if(!d.cp||typeof d.cp!=="object")d.cp={};return d.cp}
function checkpointsDone(){var id=LESSONS[currentIndex].id,c=cpState();return vxCheckpoints(id).every(function(_,i){return c[i]&&c[i].ok})}
var cpOpen=null;
function showCheckpoint(i){
  var id=LESSONS[currentIndex].id,cp=vxCheckpoints(id)[i],box=el("cpOverlay");if(!cp||!box)return;
  cpOpen=i;if(playerOk())ytPlayer.pauseVideo();
  var st=cpState()[i]||{wrong:[]};
  box.innerHTML='<div class="cp-card"><div class="cp-kicker">⏸ Checkpoint '+(i+1)+' of '+vxCheckpoints(id).length+' · predict before you watch</div>'+
    '<div class="cp-q">'+escapeHtml(cp.q)+'</div><div class="cp-choices">'+cp.choices.map(function(c,j){
      var crossed=(st.wrong||[]).indexOf(j)>-1;
      return '<button type="button" class="cp-choice'+(crossed?' crossed':'')+'" data-cp="'+i+'" data-choice="'+j+'"'+(crossed?' disabled':'')+'><b>'+"ABCD"[j]+'</b>'+escapeHtml(c)+'</button>';
    }).join("")+'</div><div class="cp-feedback" id="cpFeedback" aria-live="polite"></div></div>';
  box.hidden=false;
  var first=box.querySelector(".cp-choice:not([disabled])");if(first)first.focus();
}
function answerCheckpoint(i,j){
  var id=LESSONS[currentIndex].id,cp=vxCheckpoints(id)[i],c=cpState();
  c[i]=c[i]||{wrong:[]};
  var fb=el("cpFeedback"),btn=el("cpOverlay").querySelector('[data-choice="'+j+'"]');
  if(j===cp.answer){
    c[i].ok=true;if(c[i].first===undefined)c[i].first=true;persist();
    btn.classList.add("right");fb.className="cp-feedback good";fb.textContent="✓ Nice thinking! Let's watch and see.";
    el("cpOverlay").querySelectorAll(".cp-choice").forEach(function(b){b.disabled=true});
    setTimeout(function(){el("cpOverlay").hidden=true;cpOpen=null;if(playerOk())ytPlayer.playVideo();paintVideo()},1300);
  }else{
    if(c[i].first===undefined)c[i].first=false;
    if(c[i].wrong.indexOf(j)<0)c[i].wrong.push(j);persist();
    btn.classList.add("wrong","crossed");btn.disabled=true;
    fb.className="cp-feedback bad";fb.textContent="Not quite. "+(cp.hints[j]||"Try again.");
    btn.parentNode.classList.remove("shake");void btn.parentNode.offsetWidth;btn.parentNode.classList.add("shake");
  }
}
function paintTranscript(t){
  var pane=el("transcriptPane");if(!pane||pane.hidden)return;
  var lines=vxTranscript(LESSONS[currentIndex].id),cur=-1;
  for(var i=0;i<lines.length;i++){if(lines[i][0]<=t)cur=i;else break}
  if(String(cur)===pane.dataset.cur)return;
  pane.dataset.cur=String(cur);
  pane.querySelectorAll(".tr-line.now").forEach(function(n){n.classList.remove("now")});
  var now=pane.querySelector('[data-tline="'+cur+'"]');
  if(now){now.classList.add("now");if(!pane.matches(":hover"))now.scrollIntoView({block:"center",behavior:"smooth"})}
}
function setupVideo(){
  ytPlayer=null;vpDur=0;vpLastT=null;clearInterval(vpTimer);clearTimeout(vpFallbackTimer);
  var frameEl=el("ytPlayer");if(!frameEl)return;
  vpFallbackTimer=setTimeout(function(){if(!playerOk())videoFallback("timeout")},12000);
  withYT(function(){
    if(!document.body.contains(frameEl))return;
    try{ytPlayer=new YT.Player(frameEl,{events:{
      onReady:function(){clearTimeout(vpFallbackTimer);videoStatus("");vpDur=Math.floor(ytPlayer.getDuration()||0);paintVideo()},
      onStateChange:function(){vpLastT=playerOk()?ytPlayer.getCurrentTime():null;videoTick()},
      onError:function(){videoFallback("error")}
    }})}catch(e){ytPlayer=null}
  });
  if(ytApiState==="failed")videoFallback("blocked");
  vpTimer=setInterval(function(){if(!el("vpTrack")){clearInterval(vpTimer);persist();return}videoTick()},500);
  renderStamps();paintVideo();
}
function videoSeek(t,allowAhead){
  if(!needPlayer())return false;
  if(!allowAhead){
    var limit=Math.max(furthestWatched()+1,Math.floor(ytPlayer.getCurrentTime()));
    if(t>limit+1){videoStatus("You haven't watched past here yet. Use a chapter to jump ahead.");setTimeout(function(){videoStatus("")},2500);return false}
  }
  ytPlayer.seekTo(t,true);vpLastT=t;return true;
}
function playerOk(){return ytPlayer&&typeof ytPlayer.getCurrentTime==="function"}
function needPlayer(){if(playerOk())return true;videoStatus("Start the video first, then try again.");return false}
function notesBox(){return el("answer-notes")}
function saveNotes(){var n=notesBox();if(n)n.dispatchEvent(new Event("input",{bubbles:true}))}
function insertAtCursor(text){
  var n=notesBox();if(!n)return;
  var start=n.selectionStart!=null?n.selectionStart:n.value.length,end=n.selectionEnd!=null?n.selectionEnd:start;
  var before=n.value.slice(0,start),pre=(before&&!/\n$/.test(before))?"\n":"";
  n.value=before+pre+text+n.value.slice(end);
  var pos=(before+pre+text).length;n.focus();n.setSelectionRange(pos,pos);saveNotes();
}
function renderStamps(){
  var list=el("stampList"),n=notesBox();if(!list||!n)return;
  var seen={},chips=[];
  (n.value.match(/\[(\d+:\d{2})\]/g)||[]).forEach(function(m){var t=m.slice(1,-1);if(!seen[t]){seen[t]=1;chips.push(t)}});
  chips.sort(function(a,b){return parseTime(a)-parseTime(b)});
  list.innerHTML=chips.length?'<span class="watch-label">Jump to</span>'+chips.map(function(t){return '<button type="button" class="stamp-chip" data-seek="'+t+'">▶ '+t+'</button>'}).join(""):"";
}
function stampNow(){if(!needPlayer())return;insertAtCursor("["+fmtTime(ytPlayer.getCurrentTime())+"] ");videoStatus("")}
function pauseAndWrite(){
  if(playerOk()){try{ytPlayer.pauseVideo()}catch(e){}}
  var n=notesBox();if(!n)return;
  if(playerOk())insertAtCursor("["+fmtTime(ytPlayer.getCurrentTime())+"] ");else n.focus();
}
body.addEventListener("click",function(event){
  var t=event.target.closest("button");if(!t||!body.contains(t))return;
  if(t.id==="stampBtn"){stampNow();return}
  if(t.id==="pauseNoteBtn"){pauseAndWrite();return}
  if(t.id==="copyNotesBtn"){
    var n=notesBox();if(!n)return;
    var text=LESSONS[currentIndex].id+" "+LESSONS[currentIndex].name+" — notes\n\n"+n.value;
    (navigator.clipboard?navigator.clipboard.writeText(text):Promise.reject()).then(function(){t.textContent="Copied ✓";setTimeout(function(){t.textContent="Copy"},1500)},function(){n.select();document.execCommand("copy")});
    return;
  }
  if(t.dataset.prompt){insertAtCursor("Q: "+t.dataset.prompt+"\nA: ");t.classList.add("used");return}
  if(t.dataset.seek){if(videoSeek(parseTime(t.dataset.seek),true))ytPlayer.playVideo();return}
  if(t.dataset.videoSkip){if(!needPlayer())return;videoSeek(Math.max(0,ytPlayer.getCurrentTime()+Number(t.dataset.videoSkip)),false);return}
  if(t.dataset.chapter!==undefined){var c=(VIDEO_CHAPTERS[LESSONS[currentIndex].id]||[])[Number(t.dataset.chapter)];if(c&&videoSeek(c[0],true))ytPlayer.playVideo();return}
  if(t.dataset.choice!==undefined){answerCheckpoint(Number(t.dataset.cp),Number(t.dataset.choice));return}
  if(t.dataset.tline!==undefined){var ln=vxTranscript(LESSONS[currentIndex].id)[Number(t.dataset.tline)];if(ln&&videoSeek(ln[0],true)){if(cpOpen===null)ytPlayer.playVideo();paintVideo()}return}
  if(t.dataset.tab){
    body.querySelectorAll(".np-tab").forEach(function(b){var on=b===t;b.classList.toggle("on",on);b.setAttribute("aria-selected",String(on))});
    el("notesPane").hidden=t.dataset.tab!=="notes";el("transcriptPane").hidden=t.dataset.tab!=="transcript";
    if(t.dataset.tab==="transcript"){el("transcriptPane").dataset.cur="";paintVideo()}
    return;
  }
  if(t.id==="vpPlay"){if(cpOpen!==null)return;if(!needPlayer())return;if(ytPlayer.getPlayerState()===1)ytPlayer.pauseVideo();else ytPlayer.playVideo();return}
  if(t.id==="vpFull"){var box=el("vpBox");if(document.fullscreenElement)document.exitFullscreen();else if(box.requestFullscreen)box.requestFullscreen();return}
  if(t.dataset.videoSpeed){
    if(!needPlayer())return;ytPlayer.setPlaybackRate(Number(t.dataset.videoSpeed));
    body.querySelectorAll(".vt-speed").forEach(function(b){b.classList.toggle("on",b===t)});return;
  }
});
body.addEventListener("change",function(e){
  if(e.target.id==="vpSpeed"&&playerOk())ytPlayer.setPlaybackRate(Number(e.target.value));
  if(e.target.id==="vpReset"&&e.target.value!==""){
    var v=e.target.value,l=LESSONS[currentIndex],ch=VIDEO_CHAPTERS[l.id]||[],d=watchData();e.target.value="";
    if(v==="all"){
      if(!confirm("Reset all watch progress for this video? It will look like you've never watched it."))return;
      d.watched="";delete d.cp;delete state.checks[l.id];delete state.done[l.id];el("cpOverlay").hidden=true;cpOpen=null;
      if(playerOk()){ytPlayer.pauseVideo();ytPlayer.seekTo(0,true)}vpLastT=0;
    }else{
      var i=Number(v),start=ch[i][0],end=i+1<ch.length?ch[i+1][0]:vpDur;
      vxCheckpoints(l.id).forEach(function(c,k){if(c.at>=start&&c.at<end&&d.cp)delete d.cp[k]});
      var w=d.watched;for(var k=start;k<end&&k<w.length;k++)w=w.slice(0,k)+"0"+w.slice(k+1);d.watched=w;
      if(watchedPct()<WATCH_NEEDED){delete state.checks[l.id];delete state.done[l.id]}
      if(playerOk()){ytPlayer.seekTo(start,true);ytPlayer.pauseVideo()}vpLastT=start;
    }
    persist();updateProgress();renderMenu();refreshAction();el("activityFeedback").hidden=true;
    var list=el("chapterList");if(list)delete list.dataset.built;paintVideo();
    setStatus(v==="all"?"Video progress reset":"Chapter "+(Number(v)+1)+" progress reset");
  }
});
body.addEventListener("click",function(e){
  var tr=e.target.closest("#vpTrack");if(!tr||!vpDur)return;
  var r=tr.getBoundingClientRect();videoSeek(Math.floor((e.clientX-r.left)/r.width*vpDur),false);
});
body.addEventListener("input",function(event){if(event.target.id==="answer-notes"){renderStamps();var s=el("notesSaved");if(s)s.textContent="Saved ✓"}});
document.addEventListener("keydown",function(event){
  var typing=/^(INPUT|TEXTAREA|SELECT)$/.test(event.target.tagName||"")||event.target.isContentEditable;
  if(cpOpen!==null&&/^[a-dA-D1-4]$/.test(event.key)&&!typing){var cb=el("cpOverlay").querySelector('[data-choice="'+("abcd".indexOf(event.key.toLowerCase())>-1?"abcd".indexOf(event.key.toLowerCase()):Number(event.key)-1)+'"]');if(cb&&!cb.disabled){event.preventDefault();cb.click()}return}
  if(cpOpen!==null&&(event.key===" "||event.key.indexOf("Arrow")===0)&&!typing&&event.target.tagName!=="BUTTON"){event.preventDefault();return}
  if(el("vpPlay")&&!typing&&!event.altKey&&!event.ctrlKey&&!event.metaKey){
    if(event.key===" "&&event.target.tagName!=="BUTTON"){event.preventDefault();el("vpPlay").click();return}
    if((event.key==="ArrowLeft"||event.key==="ArrowRight")&&playerOk()){
      event.preventDefault();
      var nt=ytPlayer.getCurrentTime()+(event.key==="ArrowRight"?5:-5);
      videoSeek(Math.max(0,Math.min(vpDur||nt,nt)),false);paintVideo();return;
    }
    var ch=VIDEO_CHAPTERS[LESSONS[currentIndex].id]||[];
    if(/^[1-9]$/.test(event.key)&&ch[Number(event.key)-1]&&playerOk()){
      event.preventDefault();videoSeek(ch[Number(event.key)-1][0],true);ytPlayer.playVideo();return;
    }
  }
  if(!event.altKey||!el("answer-notes"))return;
  var k=event.key.toLowerCase();
  if(k==="t"){event.preventDefault();stampNow()}else if(k==="n"){event.preventDefault();pauseAndWrite()}
});
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
  if(l.type==="video"){var ok=videoUnlocked();action.textContent=ok?"Mark watched & Next →":"Watch the video to continue";action.classList.toggle("locked",!ok);return}
  action.classList.remove("locked");
  if(["1.1.4","1.1.7","1.1.8"].indexOf(l.id)!==-1||l.id==="1.1.5"||l.id==="1.1.3"){
    action.textContent=checked?"Save & Next →":("Check "+(l.id==="1.1.3"?"answers":"my work"));
  }else action.textContent="Save & Next →";
}
function render(){
  finishView=false;
  var l=LESSONS[currentIndex];
  el("breadcrumb").textContent="Unit 1 · Tracy's World · Activity "+(currentIndex+1)+" of "+LESSONS.length;
  el("lessonTitle").textContent=l.id+" "+l.name;
  el("lessonSubtitle").textContent=l.subtitle;
  el("lessonBadge").innerHTML=TYPE_INFO[l.type].icon+'<span>'+escapeHtml(l.kind)+'</span>';el("lessonBadge").className="meta-pill type-"+l.type;
  el("activityCounter").textContent="Instructions";
  document.title=l.id+" "+l.short+" · Python Turtle Course";
  el("activityFeedback").hidden=true;
  body.innerHTML=contentFor(l.id);
  body.scrollTop=0;
  if(window.TurtleCourseExamples)window.TurtleCourseExamples.render(body);
  restoreDraft();
  workspace.classList.toggle("video-mode",l.type==="video");
  if(l.type==="video")setupVideo();
  previous.disabled=currentIndex===0;
  workspace.classList.toggle("no-editor",!l.editor);
  editorCard.hidden=!l.editor;
  workspace.classList.remove("focus-editor");
  setFocusEditor(false);
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
  el("headScore").hidden=true;el("headRetake").hidden=true;
  if(l.id==="1.1.3")quizPaint();
  if(state.checks[l.id]&&l.id!=="1.1.3"&&l.type!=="video") {
    var message=l.id==="1.1.5"?"All six rows correct.":"Your program passed its last check.";
    makeFeedback(true,message,[]);
  }
  history.replaceState(null,"","#"+l.id);
}
function gotoIndex(i){if(i<0||i>=LESSONS.length)return;currentIndex=i;render();window.scrollTo({top:0,behavior:"auto"})}
function setFocusEditor(on){
  workspace.classList.toggle("focus-editor",on);
  if(expandEditorBtn){expandEditorBtn.setAttribute("aria-pressed",String(on))}
}
function completeAndNext(){
  markDone();
  setStatus("Saved · activity "+(currentIndex+1)+" completed");
  if(currentIndex<LESSONS.length-1){gotoIndex(currentIndex+1)}else showFinish();
}
function showFinish(){
  finishView=true;el("headScore").hidden=true;el("headRetake").hidden=true;renderMenu();workspace.classList.add("no-editor");workspace.classList.remove("video-mode");editorCard.hidden=true;frame.removeAttribute("src");
  el("breadcrumb").textContent="Unit 1 / Tracy's World";
  el("lessonTitle").textContent="Unit 1 complete";
  el("lessonSubtitle").textContent="You have worked through the eight activities in Tracy's World.";
  el("lessonBadge").textContent="8 of 8";
  el("activityCounter").textContent="Finished";el("activityFeedback").hidden=true;
  body.innerHTML='<div class="unit-done"><h3>You have finished Unit 1.</h3><p>You have run programs, tested changes, written drawing commands, read trace tables, and used color.</p></div><div class="resource-links"><a href="/turtle/" target="_blank" rel="noopener">Keep experimenting in Turtle ↗</a><a href="/tracetable/" target="_blank" rel="noopener">Review trace tables ↗</a></div><p>Your completion record stays in this browser.</p>';
  previous.disabled=false;action.textContent="Review Unit 1 ↺";
  history.replaceState(null,"","#complete");
  updateProgress();setStatus("All 8 activities completed on this device");
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
  if(l.type==="video"){
    if(!videoUnlocked()){var cpsN=vxCheckpoints(id).length;makeFeedback(false,"Keep watching!",["You've watched "+watchedPct()+"% so far. Watch at least "+WATCH_NEEDED+"% to continue."].concat(cpsN&&!checkpointsDone()?["Answer every checkpoint question in the video ("+vxCheckpoints(id).filter(function(_,i){var c=cpState()[i];return c&&c.ok}).length+"/"+cpsN+" done)."]:[]));return}
    persist();completeAndNext();return;
  }
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
if(expandEditorBtn)expandEditorBtn.addEventListener("click",function(){setFocusEditor(true);el("showInstructionsBtn").focus()});
el("showInstructionsBtn").addEventListener("click",function(){setFocusEditor(false);expandEditorBtn.focus()});
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
