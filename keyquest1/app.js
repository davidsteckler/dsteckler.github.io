(() => {
  const $ = (id) => document.getElementById(id);
  const homeView = $('homeView');
  const sessionView = $('sessionView');
  const resultView = $('resultView');
  const homeButton = $('homeButton');
  const sentenceEl = $('sentence');
  const feedbackEl = $('feedback');
  const typingStage = $('typingStage');
  const conceptChip = $('conceptChip');
  const speedTrail = $('speedTrail');
  const precisionHint = $('precisionHint');
  const mobileEntry = $('mobileEntry');
  const mobileInput = $('mobileInput');
  const focusNote = $('focusNote');

  const knowledge = (window.KEYQUEST_CONTENT && window.KEYQUEST_CONTENT.concepts) || [];
  const topicGroups = knowledge.reduce((map,item,index)=>{
    const key=item[0];
    if(!map[key]) map[key]=[];
    map[key].push(index);
    return map;
  },{});

  const frames = [
    k => `${k[2]}.`,
    k => `${k[1]} matters because ${lower(k[3])}.`,
    k => `${k[4]}.`,
    k => `A useful thing to remember about ${k[1]} is that ${lower(k[2])}.`,
    k => `In computer science, ${lowerFirst(k[2])}.`,
    k => `${k[1]} connects to a bigger idea: ${lower(k[3])}.`,
    k => `One practical example of ${k[1]} is this: ${lowerFirst(k[4])}.`,
    k => `Think of ${k[1]} this way: ${lowerFirst(k[2])}.`,
    k => `When you see ${k[1]}, remember that ${lower(k[2])}.`,
    k => `The purpose behind ${k[1]} becomes clearer when you know that ${lower(k[3])}.`,
    k => `A real example helps explain ${k[1]}: ${lowerFirst(k[4])}.`,
    k => `${k[2]}. That matters because ${lower(k[3])}.`,
    k => `${k[2]}. For example, ${lowerFirst(k[4])}.`,
    k => `${k[1]} is worth knowing because ${lower(k[3])}.`,
    k => `Here is the key idea about ${k[1]}: ${lowerFirst(k[2])}.`,
    k => `If someone asks what ${k[1]} means, remember this: ${lowerFirst(k[2])}.`,
    k => `One reason ${k[1]} exists is that ${lower(k[3])}.`,
    k => `You can see ${k[1]} in practice when ${lower(k[4])}.`,
    k => `The basic idea is simple: ${lowerFirst(k[2])}.`,
    k => `${k[1]} becomes useful when you realize that ${lower(k[3])}.`,
    k => `A good mental note for ${k[1]} is this: ${lowerFirst(k[2])}.`,
    k => `The computer science idea called ${k[1]} works like this: ${lowerFirst(k[2])}.`,
    k => `Remember the example for ${k[1]}: ${lowerFirst(k[4])}.`,
    k => `Why learn ${k[1]}? Because ${lower(k[3])}.`,
    k => `The important part of ${k[1]} is that ${lower(k[2])}.`,
    k => `${k[1]} shows up in real computing because ${lower(k[3])}.`,
    k => `A quick definition of ${k[1]} is this: ${lowerFirst(k[2])}.`,
    k => `A practical way to recognize ${k[1]} is this: ${lowerFirst(k[4])}.`,
    k => `The idea behind ${k[1]} is connected to this fact: ${lowerFirst(k[2])}.`,
    k => `${k[1]} helps make more sense when you connect it to this example: ${lowerFirst(k[4])}.`,
    k => `Computers rely on ideas like ${k[1]} because ${lower(k[3])}.`,
    k => `Keep this fact about ${k[1]} in mind: ${lowerFirst(k[2])}.`,
    k => `A useful connection for ${k[1]} is that ${lower(k[3])}.`,
    k => `In everyday computer use, ${k[1]} can appear like this: ${lowerFirst(k[4])}.`,
    k => `If you remember one thing about ${k[1]}, remember that ${lower(k[2])}.`,
    k => `${k[1]} can be understood through a simple example: ${lowerFirst(k[4])}.`
  ];

  const precisionCode = [
    'score = 10','lives = 3','name = "Pixie"','ready = True','level = 7',
    'if score > 5:','if lives == 0:','if ready and safe:','if not finished:','else:',
    'for i in range(10):','for name in names:','while score < 100:','while running:','break',
    'print("hello")','print(score)','input("Name: ")','len(items)','range(5)',
    'items = [1, 2, 3]','names = ["Ada", "Grace"]','point = (4, 7)','user = {"name": "Sam"}','items.append(4)',
    'def greet(name):','def add(a, b):','return score','return x + y','import random',
    'random.choice(items)','from math import pi','text[0:3]','items[0]','items[-1]',
    'value += 1','value -= 1','total *= 2','average = total / count','remainder = x % 2',
    'x == y','x != y','x >= 10','x <= 20','a and b','a or b','not done',
    '<h1>Hello</h1>','<p>Learn to code.</p>','color: blue;','font-size: 20px;','display: grid;',
    'SELECT name FROM students;','WHERE grade = 7','{"score": 10}','1010 1100 0011','0xFF = 255'
  ];

  const state = {
    mode: null,
    minutes: 5,
    startedAt: 0,
    endAt: 0,
    lastKeyAt: 0,
    activeMs: 0,
    correct: 0,
    attempts: 0,
    position: 0,
    target: '',
    completed: 0,
    seenConcepts: [],
    recentConcepts: [],
    recentSignatures: [],
    errors: {},
    ticker: null,
    ended: false,
    errorIndex: -1,
    currentKnowledge: null,
    precisionKey: '',
    mobileValue: ''
  };

  function lower(text){return text.charAt(0).toLowerCase()+text.slice(1)}
  function lowerFirst(text){return text.charAt(0).toLowerCase()+text.slice(1)}
  function cleanSentence(text){return text.replace(/\s+/g,' ').replace(/\.\./g,'.').replace(/([.!?])\./g,'$1').trim()}
  function formatTime(seconds){seconds=Math.max(0,Math.ceil(seconds));return `${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`}
  function wpm(){const elapsed=Math.max(1,(Date.now()-state.startedAt)/1000);return Math.round((state.correct/5)/(elapsed/60))}
  function accuracy(){return state.attempts?Math.round(state.correct/state.attempts*100):100}
  function bestKey(){return `keyquest1-best-${state.mode}`}
  function getBest(){return Number(localStorage.getItem(bestKey())||0)}
  function setBest(value){if(value>getBest())localStorage.setItem(bestKey(),String(value))}
  function pick(arr){return arr[Math.floor(Math.random()*arr.length)]}
  function countChar(text,char){const c=char.toLowerCase();return [...text.toLowerCase()].reduce((n,x)=>n+(x===c?1:0),0)}
  function markActive(){const now=Date.now();if(state.lastKeyAt&&now-state.lastKeyAt<5000)state.activeMs+=now-state.lastKeyAt;state.lastKeyAt=now}

  function recentFromStorage(){try{return JSON.parse(localStorage.getItem('keyquest1-recent-concepts')||'[]').slice(-80)}catch{return []}}
  function rememberConcept(name){const saved=recentFromStorage().filter(x=>x!==name);saved.push(name);localStorage.setItem('keyquest1-recent-concepts',JSON.stringify(saved.slice(-80)))}

  function chooseConcept(options={}){
    if(!knowledge.length)return null;
    const avoidNames=new Set([...recentFromStorage().slice(-28),...state.recentConcepts.map(i=>knowledge[i]?.[1])]);
    let candidates=knowledge.map((_,i)=>i);
    if(options.topic&&topicGroups[options.topic])candidates=[...topicGroups[options.topic]];
    if(options.char){
      const ranked=candidates.map(i=>({i,hits:countChar(knowledge[i].slice(1).join(' '),options.char)})).filter(x=>x.hits>0).sort((a,b)=>b.hits-a.hits);
      const strong=ranked.filter(x=>x.hits>=Math.max(2,ranked[0]?.hits*0.55)).slice(0,70);
      if(strong.length)candidates=strong.map(x=>x.i);
    }
    const fresh=candidates.filter(i=>!avoidNames.has(knowledge[i][1]));
    if(fresh.length>8)candidates=fresh;
    const index=pick(candidates);
    state.recentConcepts.push(index);
    if(state.recentConcepts.length>35)state.recentConcepts.shift();
    rememberConcept(knowledge[index][1]);
    return {index,item:knowledge[index]};
  }

  function makeSingle(item,frameIndex=null){const fi=frameIndex===null?Math.floor(Math.random()*frames.length):frameIndex%frames.length;return {text:cleanSentence(frames[fi](item)),frame:fi}}

  function learningSentence(){
    const chosen=chooseConcept();
    if(!chosen)return 'Computers follow instructions written as programs.';
    const {index,item}=chosen;
    state.currentKnowledge=item;
    if(!state.seenConcepts.includes(item[1]))state.seenConcepts.push(item[1]);
    $('topicLabel').textContent=item[0];conceptChip.textContent=item[1];conceptChip.hidden=false;
    let text='',signature='';
    const usePair=Math.random()<0.22&&(topicGroups[item[0]]||[]).length>2;
    if(usePair){
      const peers=(topicGroups[item[0]]||[]).filter(i=>i!==index&&!state.recentConcepts.slice(-8).includes(i));
      const otherIndex=peers.length?pick(peers):pick((topicGroups[item[0]]||[]).filter(i=>i!==index));
      const other=knowledge[otherIndex];
      const forms=[
        `Two ${item[0].toLowerCase()} ideas connect here. ${item[2]}. ${other[2]}.`,
        `${item[1]} and ${other[1]} belong to the same bigger topic. ${item[4]}. ${other[4]}.`,
        `Compare two ideas from ${item[0]}. ${item[1]}: ${lowerFirst(item[2])}. ${other[1]}: ${lowerFirst(other[2])}.`,
        `One connection inside ${item[0]} is between ${item[1]} and ${other[1]}. ${item[3]}. ${other[3]}.`
      ];
      const pairForm=Math.floor(Math.random()*forms.length);text=cleanSentence(forms[pairForm]);signature=`p-${index}-${otherIndex}-${pairForm}`;
    }else{
      let made,tries=0;
      do{made=makeSingle(item);signature=`s-${index}-${made.frame}`;tries++}while(state.recentSignatures.includes(signature)&&tries<12);
      text=made.text;
    }
    state.recentSignatures.push(signature);if(state.recentSignatures.length>70)state.recentSignatures.shift();
    return text;
  }

  function speedSentence(){
    state.currentKnowledge=null;conceptChip.hidden=true;$('topicLabel').textContent='Flow practice';
    const count=3+Math.floor(Math.random()*2),selected=[],used=new Set();
    for(let i=0;i<count;i++){
      let choice=chooseConcept(),guard=0;
      while(choice&&used.has(choice.index)&&guard++<10)choice=chooseConcept();
      if(choice){used.add(choice.index);selected.push(choice.item)}
    }
    const flowFrames=[k=>k[2]+'.',k=>`${k[4]}.`,k=>`${k[2]}. ${k[4]}.`,k=>`${k[1]} is useful to know because ${lower(k[3])}.`,k=>`A practical computing example is this: ${lowerFirst(k[4])}.`,k=>`One computer science fact worth remembering is that ${lower(k[2])}.`];
    return selected.map(k=>cleanSentence(pick(flowFrames)(k))).join(' ');
  }

  function mostMissedKey(){const entries=Object.entries(state.errors).sort((a,b)=>b[1]-a[1]);return entries.length?entries[0][0]:''}

  function precisionSentence(){
    state.currentKnowledge=null;conceptChip.hidden=true;const key=mostMissedKey();state.precisionKey=key;
    if(key&&/[0-9=+>:\[\]()"'.,;<>/%{}_-]/.test(key)&&Math.random()<0.7){
      $('topicLabel').textContent='Programming symbols';precisionHint.textContent=`Targeting ${key===' '?'space':key} through real code patterns.`;
      const matching=precisionCode.filter(s=>s.includes(key));return pick(matching.length?matching:precisionCode);
    }
    const chosen=chooseConcept(key?{char:key}:{});if(!chosen)return pick(precisionCode);const item=chosen.item;
    $('topicLabel').textContent=key?`Focus key: ${key.toUpperCase()}`:'Accuracy + control';
    precisionHint.textContent=key?`Adapting toward ${key.toUpperCase()} because it is showing up in your mistakes.`:'Accuracy first. The target will adapt after it sees your mistakes.';
    return cleanSentence(pick([`${item[1]}: ${item[2]}.`,`${item[4]}.`,`${item[1]} matters because ${lower(item[3])}.`,`${item[2]}.`]));
  }

  function nextTarget(){if(state.mode==='learn'||state.mode==='mobile')return learningSentence();if(state.mode==='speed')return speedSentence();return precisionSentence()}

  function renderSentence(animate=true){
    state.position=0;state.errorIndex=-1;state.target=nextTarget();state.mobileValue='';
    sentenceEl.className='sentence'+(animate?' enter':'');sentenceEl.innerHTML='';
    Array.from(state.target).forEach((ch,i)=>{const span=document.createElement('span');span.className='char'+(i===0?' current':'');span.textContent=ch;sentenceEl.appendChild(span)});
    feedbackEl.textContent='';
    if(state.mode==='mobile'){mobileInput.value='';setTimeout(()=>mobileInput.focus({preventScroll:true}),animate?190:40)}else{typingStage.focus({preventScroll:true})}
    if(animate)setTimeout(()=>sentenceEl.classList.remove('enter'),320);
  }

  function updateChars(){
    const chars=sentenceEl.querySelectorAll('.char');
    chars.forEach((span,i)=>{span.className='char';if(i<state.position)span.classList.add('done');else if(i===state.position)span.classList.add('current');if(i===state.errorIndex)span.classList.add('error')});
  }

  function completeSentence(){
    state.completed++;$('sentenceCount').textContent=`${state.completed} ${state.completed===1?'sentence':'sentences'}`;sentenceEl.classList.add('complete');
    if(state.mode==='mobile'){mobileInput.value='';state.mobileValue=''}
    setTimeout(()=>renderSentence(true),180);
  }

  function processCharacter(char){
    markActive();state.attempts++;const expected=state.target[state.position];
    if(char===expected){state.correct++;state.errorIndex=-1;feedbackEl.textContent='';state.position++;if(state.position>=state.target.length){completeSentence();updateLiveStats();return true}}
    else{state.errorIndex=state.position;state.errors[expected]=(state.errors[expected]||0)+1;feedbackEl.textContent=expected===' '?'Space':`Try ${expected}`;setTimeout(()=>{if(state.errorIndex===state.position){state.errorIndex=-1;updateChars()}},220);updateChars();updateLiveStats();return false}
    updateChars();updateLiveStats();return true;
  }

  function handleKey(e){
    if(sessionView.hidden||state.ended||state.mode==='mobile')return;
    if(e.target&&['INPUT','TEXTAREA'].includes(e.target.tagName))return;
    if(e.ctrlKey||e.metaKey||e.altKey||e.key==='Tab'||e.key==='Escape')return;
    if(e.key==='Backspace'){e.preventDefault();return}
    if(e.key.length!==1)return;e.preventDefault();processCharacter(e.key);
  }

  function handleMobileInput(){
    if(state.mode!=='mobile'||state.ended)return;
    let value=mobileInput.value;
    if(value.length<state.mobileValue.length){mobileInput.value=state.mobileValue;return}
    const added=value.slice(state.mobileValue.length);
    for(const char of added){
      const ok=processCharacter(char);
      if(!ok){mobileInput.value=state.mobileValue;return}
      if(state.position===0){return}
      state.mobileValue+=char;
    }
    mobileInput.value=state.mobileValue;
  }

  function updateLiveStats(){
    $('wpmValue').textContent=String(wpm());$('accuracyValue').textContent=String(accuracy());
    if(state.mode==='speed'){
      const current=wpm(),best=Math.max(getBest(),1),pct=Math.min(100,Math.max(3,current/(Math.max(best,30)*1.2)*100));
      $('paceDot').style.left=`${pct}%`;$('paceText').textContent=`${current} wpm`;$('bestMarker').style.left=`${Math.min(92,Math.max(15,best/(Math.max(best,30)*1.2)*100))}%`;
    }
  }

  function tick(){
    if(state.ended)return;const now=Date.now(),remaining=(state.endAt-now)/1000;$('timeValue').textContent=formatTime(remaining);
    const total=state.minutes*60,elapsed=Math.min(total,Math.max(0,total-remaining));$('progressFill').style.width=`${elapsed/total*100}%`;updateLiveStats();if(remaining<=0)endSession();
  }

  function startSession(mode){
    state.mode=mode;state.startedAt=Date.now();state.endAt=state.startedAt+state.minutes*60*1000;state.lastKeyAt=0;state.activeMs=0;state.correct=0;state.attempts=0;state.position=0;state.completed=0;state.seenConcepts=[];state.recentConcepts=[];state.recentSignatures=[];state.errors={};state.ended=false;state.currentKnowledge=null;state.precisionKey='';state.mobileValue='';
    homeView.hidden=true;resultView.hidden=true;sessionView.hidden=false;homeButton.hidden=false;
    $('modeLabel').textContent={learn:'LEARN + TYPE',speed:'SPEED',precision:'PRECISION',mobile:'MOBILE iOS'}[mode];
    speedTrail.hidden=mode!=='speed';precisionHint.hidden=mode!=='precision';conceptChip.hidden=!(mode==='learn'||mode==='mobile');mobileEntry.hidden=mode!=='mobile';
    focusNote.textContent=mode==='mobile'?'Keep typing in the box. The session clock keeps running if you switch apps or tabs.':'Click here if typing stops. The session clock keeps running if you switch tabs.';
    $('sentenceCount').textContent='0 sentences';$('wpmValue').textContent='0';$('accuracyValue').textContent='100';$('timeValue').textContent=formatTime(state.minutes*60);$('progressFill').style.width='0%';
    renderSentence(false);clearInterval(state.ticker);state.ticker=setInterval(tick,250);tick();
  }

  function endSession(){
    if(state.ended)return;state.ended=true;clearInterval(state.ticker);mobileInput.blur();const finalWpm=wpm(),oldBest=getBest();setBest(finalWpm);const newBest=getBest();
    sessionView.hidden=true;resultView.hidden=false;homeButton.hidden=true;$('resultWpm').textContent=String(finalWpm);$('resultAccuracy').textContent=`${accuracy()}%`;$('resultSentences').textContent=String(state.completed);$('resultActive').textContent=formatTime(state.activeMs/1000);$('resultBest').textContent=newBest?`${newBest} WPM`:'—';$('resultTitle').textContent=finalWpm>oldBest&&finalWpm>0?'New personal best.':'Nice run.';
    const learned=$('resultLearned'),chips=$('learnedChips');chips.innerHTML='';
    if((state.mode==='learn'||state.mode==='mobile')&&state.seenConcepts.length){learned.hidden=false;state.seenConcepts.slice(-12).forEach(c=>{const span=document.createElement('span');span.textContent=c;chips.appendChild(span)})}else learned.hidden=true;
  }

  function showHome(){clearInterval(state.ticker);state.ended=true;mobileInput.blur();sessionView.hidden=true;resultView.hidden=true;homeView.hidden=false;homeButton.hidden=true;feedbackEl.textContent=''}

  document.querySelectorAll('[data-mode]').forEach(btn=>btn.addEventListener('click',()=>startSession(btn.dataset.mode)));
  document.querySelectorAll('[data-minutes]').forEach(btn=>btn.addEventListener('click',()=>{state.minutes=Number(btn.dataset.minutes);document.querySelectorAll('[data-minutes]').forEach(b=>b.classList.toggle('selected',b===btn))}));
  $('endButton').addEventListener('click',endSession);homeButton.addEventListener('click',showHome);$('modesButton').addEventListener('click',showHome);$('againButton').addEventListener('click',()=>startSession(state.mode));
  typingStage.addEventListener('click',()=>{if(state.mode==='mobile')mobileInput.focus({preventScroll:true});else typingStage.focus({preventScroll:true})});
  mobileInput.addEventListener('input',handleMobileInput);
  mobileInput.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault()}});
  document.addEventListener('keydown',handleKey);
})();