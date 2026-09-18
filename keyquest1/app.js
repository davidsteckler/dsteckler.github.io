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
  const funHud = $('funHud');
  const funPointsEl = $('funPoints');
  const funStreakEl = $('funStreak');
  const funLevelEl = $('funLevel');
  const pointBurstLayer = $('pointBurstLayer');
  const funResult = $('funResult');
  const funResultPoints = $('funResultPoints');
  const funResultMessage = $('funResultMessage');

  const funBank = window.KEYQUEST_FUN || [];

  const knowledge = (window.KEYQUEST_CONTENT && window.KEYQUEST_CONTENT.concepts) || [];
  const topicGroups = knowledge.reduce((map,item,index)=>{
    const key=item[0];
    if(!map[key]) map[key]=[];
    map[key].push(index);
    return map;
  },{});

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
    errors: {},
    ticker: null,
    ended: false,
    errorIndex: -1,
    currentKnowledge: null,
    precisionKey: '',
    mobileValue: '',
    lessonItem: null,
    lessonIndex: -1,
    lessonStep: 0,
    lessonLines: [],
    funPoints: 0,
    funStreak: 0,
    funBestStreak: 0,
    funSentenceMistakes: 0,
    funCorrectRun: 0,
    recentFun: []
  };

  function lower(text){return text.charAt(0).toLowerCase()+text.slice(1)}
  function lowerFirst(text){return text.charAt(0).toLowerCase()+text.slice(1)}
  function upperFirst(text){return text.charAt(0).toUpperCase()+text.slice(1)}
  function cleanSentence(text){return text.replace(/\s+/g,' ').replace(/\.\./g,'.').replace(/([.!?])\./g,'$1').trim()}
  function punctuate(text){const t=cleanSentence(text);return /[.!?]$/.test(t)?t:`${t}.`}
  function formatTime(seconds){seconds=Math.max(0,Math.ceil(seconds));return `${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`}
  function wpm(){const elapsed=Math.max(1,(Date.now()-state.startedAt)/1000);return Math.round((state.correct/5)/(elapsed/60))}
  function accuracy(){return state.attempts?Math.round(state.correct/state.attempts*100):100}
  function bestKey(){return `keyquest1-best-${state.mode}`}
  function getBest(){return Number(localStorage.getItem(bestKey())||0)}
  function setBest(value){if(value>getBest())localStorage.setItem(bestKey(),String(value))}
  function pick(arr){return arr[Math.floor(Math.random()*arr.length)]}
  function countChar(text,char){const c=char.toLowerCase();return [...text.toLowerCase()].reduce((n,x)=>n+(x===c?1:0),0)}
  function markActive(){const now=Date.now();if(state.lastKeyAt&&now-state.lastKeyAt<5000)state.activeMs+=now-state.lastKeyAt;state.lastKeyAt=now}

  function recentFromStorage(){try{return JSON.parse(localStorage.getItem('keyquest1-recent-concepts')||'[]').slice(-100)}catch{return []}}
  function rememberConcept(name){const saved=recentFromStorage().filter(x=>x!==name);saved.push(name);localStorage.setItem('keyquest1-recent-concepts',JSON.stringify(saved.slice(-100)))}

  function chooseConcept(options={}){
    if(!knowledge.length)return null;
    const avoidNames=new Set([...recentFromStorage().slice(-36),...state.recentConcepts.map(i=>knowledge[i]?.[1])]);
    let candidates=knowledge.map((_,i)=>i);
    if(options.topic&&topicGroups[options.topic])candidates=[...topicGroups[options.topic]];
    if(options.char){
      const ranked=candidates.map(i=>({i,hits:countChar(knowledge[i].slice(1).join(' '),options.char)})).filter(x=>x.hits>0).sort((a,b)=>b.hits-a.hits);
      const strong=ranked.filter(x=>x.hits>=Math.max(2,ranked[0]?.hits*0.55)).slice(0,80);
      if(strong.length)candidates=strong.map(x=>x.i);
    }
    const fresh=candidates.filter(i=>!avoidNames.has(knowledge[i][1]));
    if(fresh.length>8)candidates=fresh;
    const index=pick(candidates);
    state.recentConcepts.push(index);
    if(state.recentConcepts.length>45)state.recentConcepts.shift();
    rememberConcept(knowledge[index][1]);
    return {index,item:knowledge[index]};
  }

  function buildMicroLesson(item){
    const name=item[1];
    const definition=punctuate(item[2]);
    const reason=punctuate(item[3]);
    const example=punctuate(item[4]);

    const hooks=[
      example,
      `Start with a real example. ${example}`,
      `The easiest way to see ${name} is in action. ${example}`,
      `Before the definition, look at what happens in practice. ${example}`,
      `Here is the concrete part first. ${example}`
    ];

    const explanations=[
      definition,
      `Now give that idea a name. ${definition}`,
      `Here is what ${name} means. ${definition}`,
      `The definition is simpler than the name sounds. ${definition}`,
      `That example points to the main idea. ${definition}`
    ];

    const whys=[
      `Why does this matter? ${reason}`,
      `${reason} That is why ${name} matters.`,
      `The reason ${name} is useful is simple. ${reason}`,
      `The bigger idea is not the vocabulary word. ${reason}`,
      `This exists for a reason. ${reason}`
    ];

    const takeaways=[
      `Put it together: ${definition} ${reason}`,
      `If you remember one thing about ${name}, remember this. ${definition}`,
      `Do not just memorize the term ${name}. Remember what it helps explain. ${reason}`,
      `The short version is this. ${definition}`,
      `That is the whole idea behind ${name}. ${definition}`
    ];

    return [pick(hooks),pick(explanations),pick(whys),pick(takeaways)].map(cleanSentence);
  }

  function startNewMicroLesson(){
    const chosen=chooseConcept();
    if(!chosen){
      state.lessonItem=['Programming','Program','A program is a set of instructions a computer can execute','software behavior comes from instructions combined with data','A game can read input, update positions, and draw a new frame'];
      state.lessonIndex=-1;
    }else{
      state.lessonItem=chosen.item;
      state.lessonIndex=chosen.index;
    }
    state.currentKnowledge=state.lessonItem;
    state.lessonLines=buildMicroLesson(state.lessonItem);
    state.lessonStep=0;
    if(!state.seenConcepts.includes(state.lessonItem[1]))state.seenConcepts.push(state.lessonItem[1]);
  }

  function learningSentence(){
    if(!state.lessonItem||state.lessonStep>=state.lessonLines.length)startNewMicroLesson();
    const item=state.lessonItem;
    const step=state.lessonStep;
    const labels=['SEE IT','WHAT IT MEANS','WHY IT MATTERS','REMEMBER THIS'];
    $('topicLabel').textContent=`${item[0]} · ${labels[step]}`;
    conceptChip.textContent=`${item[1]} · ${step+1}/${state.lessonLines.length}`;
    conceptChip.hidden=false;
    const text=state.lessonLines[step];
    state.lessonStep++;
    return text;
  }

  function funSentence(){
    state.currentKnowledge=null;
    if(!funBank.length)return 'Code tells a computer what to do.';
    let candidates=funBank.map((_,i)=>i).filter(i=>!state.recentFun.includes(i));
    if(!candidates.length)candidates=funBank.map((_,i)=>i);
    const index=pick(candidates);
    state.recentFun.push(index);
    if(state.recentFun.length>35)state.recentFun.shift();
    const item=funBank[index];
    $('topicLabel').textContent=`${item[0]} · Easy reading`;
    conceptChip.textContent='FUN MODE';
    conceptChip.hidden=false;
    return item[1];
  }

  function updateFunHud(){
    funPointsEl.textContent=state.funPoints.toLocaleString();
    funStreakEl.textContent=String(state.funStreak);
    funLevelEl.textContent=String(state.funLevel||1);
  }

  function showPointBurst(amount,label=''){
    if(state.mode!=='fun')return;
    const pop=document.createElement('div');
    const colors=['pink','blue','green','orange','purple'];
    pop.className=`point-pop ${pick(colors)}`;
    pop.style.left=`${38+Math.random()*24}%`;
    pop.style.top=`${22+Math.random()*34}%`;
    pop.innerHTML=`<strong>+${amount}</strong>${label?`<span>${label}</span>`:''}`;
    pointBurstLayer.appendChild(pop);
    setTimeout(()=>pop.remove(),950);
  }

  function addFunPoints(amount,label='',showPop=false){
    if(state.mode!=='fun')return;
    const oldLevel=state.funLevel||1;
    state.funPoints+=amount;
    state.funLevel=Math.floor(state.funPoints/500)+1;
    updateFunHud();
    funPointsEl.parentElement.classList.remove('bump');
    void funPointsEl.parentElement.offsetWidth;
    funPointsEl.parentElement.classList.add('bump');
    if(showPop)showPointBurst(amount,label);
    if(state.funLevel>oldLevel)showPointBurst(100,`LEVEL ${state.funLevel}!`);
  }

  function speedSentence(){
    state.currentKnowledge=null;conceptChip.hidden=true;$('topicLabel').textContent='Flow practice';
    const count=2,selected=[],used=new Set();
    for(let i=0;i<count;i++){
      let choice=chooseConcept(),guard=0;
      while(choice&&used.has(choice.index)&&guard++<10)choice=chooseConcept();
      if(choice){used.add(choice.index);selected.push(choice.item)}
    }
    const flowFrames=[
      k=>punctuate(k[2]),
      k=>punctuate(k[4]),
      k=>`${punctuate(k[2])} ${punctuate(k[4])}`,
      k=>`One useful computing idea is ${k[1]}. ${punctuate(k[2])}`,
      k=>`A practical example of ${k[1]} comes first. ${punctuate(k[4])}`,
      k=>`${punctuate(k[3])} ${punctuate(k[2])}`
    ];
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
    return cleanSentence(pick([punctuate(item[2]),punctuate(item[4]),`${upperFirst(item[3])}.`,`${item[1]}: ${lowerFirst(punctuate(item[2]))}`]));
  }

  function nextTarget(){if(state.mode==='learn'||state.mode==='mobile')return learningSentence();if(state.mode==='fun')return funSentence();if(state.mode==='speed')return speedSentence();return precisionSentence()}

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
    state.completed++;
    $('sentenceCount').textContent=`${state.completed} ${state.completed===1?'sentence':'sentences'}`;
    sentenceEl.classList.add('complete');
    if(state.mode==='fun'){
      if(state.funSentenceMistakes===0)state.funStreak++;
      else state.funStreak=0;
      state.funBestStreak=Math.max(state.funBestStreak,state.funStreak);
      const bonus=30+Math.min(state.funStreak,10)*10;
      addFunPoints(bonus,state.funStreak>=2?`${state.funStreak} IN A ROW!`:'SENTENCE BONUS!',true);
      state.funSentenceMistakes=0;
      state.funCorrectRun=0;
    }
    if(state.mode==='mobile'){mobileInput.value='';state.mobileValue=''}
    setTimeout(()=>renderSentence(true),180);
  }

  function processCharacter(char){
    markActive();state.attempts++;const expected=state.target[state.position];
    if(char===expected){
      state.correct++;state.errorIndex=-1;feedbackEl.textContent='';state.position++;
      if(state.mode==='fun'){
        state.funCorrectRun++;
        addFunPoints(3);
        if(state.funCorrectRun%5===0)showPointBurst(15,'NICE!');
      }
      if(state.position>=state.target.length){completeSentence();updateLiveStats();return 'complete'}
    }else{
      if(state.mode==='fun')state.funSentenceMistakes++;
      state.errorIndex=state.position;state.errors[expected]=(state.errors[expected]||0)+1;feedbackEl.textContent=state.mode==='fun'?'Try again — your points are safe!':(expected===' '?'Space':`Try ${expected}`);
      setTimeout(()=>{if(state.errorIndex===state.position){state.errorIndex=-1;updateChars()}},220);
      updateChars();updateLiveStats();return 'error';
    }
    updateChars();updateLiveStats();return 'ok';
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
    const value=mobileInput.value;
    if(value.length<state.mobileValue.length){mobileInput.value=state.mobileValue;return}
    const added=value.slice(state.mobileValue.length);
    for(const char of added){
      const result=processCharacter(char);
      if(result==='error'){mobileInput.value=state.mobileValue;return}
      if(result==='complete'){mobileInput.value='';state.mobileValue='';return}
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
    state.mode=mode;state.startedAt=Date.now();state.endAt=state.startedAt+state.minutes*60*1000;state.lastKeyAt=0;state.activeMs=0;state.correct=0;state.attempts=0;state.position=0;state.completed=0;state.seenConcepts=[];state.recentConcepts=[];state.errors={};state.ended=false;state.currentKnowledge=null;state.precisionKey='';state.mobileValue='';state.lessonItem=null;state.lessonIndex=-1;state.lessonStep=0;state.lessonLines=[];state.funPoints=0;state.funStreak=0;state.funBestStreak=0;state.funSentenceMistakes=0;state.funCorrectRun=0;state.recentFun=[];state.funLevel=1;
    homeView.hidden=true;resultView.hidden=true;sessionView.hidden=false;homeButton.hidden=false;
    $('modeLabel').textContent={learn:'LEARN + TYPE',speed:'SPEED',precision:'PRECISION',fun:'FUN MODE',mobile:'MOBILE iOS'}[mode];
    speedTrail.hidden=mode!=='speed';precisionHint.hidden=mode!=='precision';conceptChip.hidden=!(mode==='learn'||mode==='mobile'||mode==='fun');mobileEntry.hidden=mode!=='mobile';funHud.hidden=mode!=='fun';
    typingStage.classList.toggle('fun-stage',mode==='fun');
    focusNote.textContent=mode==='mobile'?'Keep typing in the box. The session clock keeps running if you switch apps or tabs.':mode==='fun'?'Every correct key earns points. Mistakes never take points away. Keep going!':'Click here if typing stops. The session clock keeps running if you switch tabs.';
    $('sentenceCount').textContent='0 sentences';$('wpmValue').textContent='0';$('accuracyValue').textContent='100';$('timeValue').textContent=formatTime(state.minutes*60);$('progressFill').style.width='0%';updateFunHud();
    renderSentence(false);clearInterval(state.ticker);state.ticker=setInterval(tick,250);tick();
  }

  function endSession(){
    if(state.ended)return;state.ended=true;clearInterval(state.ticker);mobileInput.blur();const finalWpm=wpm(),oldBest=getBest();setBest(finalWpm);const newBest=getBest();
    sessionView.hidden=true;resultView.hidden=false;homeButton.hidden=true;$('resultWpm').textContent=String(finalWpm);$('resultAccuracy').textContent=`${accuracy()}%`;$('resultSentences').textContent=String(state.completed);$('resultActive').textContent=formatTime(state.activeMs/1000);$('resultBest').textContent=newBest?`${newBest} WPM`:'—';$('resultTitle').textContent=state.mode==='fun'?'Great typing!':(finalWpm>oldBest&&finalWpm>0?'New personal best.':'Nice run.');
    funResult.hidden=state.mode!=='fun';
    if(state.mode==='fun'){
      funResultPoints.textContent=state.funPoints.toLocaleString();
      funResultMessage.textContent=state.funBestStreak>=3?`Best streak: ${state.funBestStreak} sentences in a row!`:`You finished ${state.completed} sentences. Every point came from typing!`;
    }
    const learned=$('resultLearned'),chips=$('learnedChips');chips.innerHTML='';
    if((state.mode==='learn'||state.mode==='mobile')&&state.seenConcepts.length){learned.hidden=false;state.seenConcepts.slice(-12).forEach(c=>{const span=document.createElement('span');span.textContent=c;chips.appendChild(span)})}else learned.hidden=true;
  }

  function showHome(){clearInterval(state.ticker);state.ended=true;mobileInput.blur();sessionView.hidden=true;resultView.hidden=true;homeView.hidden=false;homeButton.hidden=true;feedbackEl.textContent=''}

  document.querySelectorAll('[data-mode]').forEach(btn=>btn.addEventListener('click',()=>startSession(btn.dataset.mode)));
  document.querySelectorAll('[data-minutes]').forEach(btn=>btn.addEventListener('click',()=>{state.minutes=Number(btn.dataset.minutes);document.querySelectorAll('[data-minutes]').forEach(b=>b.classList.toggle('selected',b===btn))}));
  $('endButton').addEventListener('click',endSession);homeButton.addEventListener('click',showHome);$('modesButton').addEventListener('click',showHome);$('againButton').addEventListener('click',()=>startSession(state.mode));
  typingStage.addEventListener('click',()=>{if(state.mode==='mobile')mobileInput.focus({preventScroll:true});else typingStage.focus({preventScroll:true})});
  mobileInput.addEventListener('input',handleMobileInput);
  mobileInput.addEventListener('keydown',e=>{if(e.key==='Enter')e.preventDefault()});
  document.addEventListener('keydown',handleKey);
})();