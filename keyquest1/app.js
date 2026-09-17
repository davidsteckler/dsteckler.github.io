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

  const knowledge = [
    ['Shortcuts','Ctrl + L','Ctrl + L moves the cursor to the browser address bar','It lets you type a new website without reaching for the mouse','Press Ctrl + L, type a web address, and press Enter'],
    ['Shortcuts','Ctrl + Z','Ctrl + Z undoes the most recent action in many programs','It is one of the fastest ways to recover from a small mistake','If you delete the wrong text, Ctrl + Z can often bring it back'],
    ['Shortcuts','Ctrl + Shift + T','Ctrl + Shift + T reopens the most recently closed browser tab','It can recover a page you closed by accident','Repeated presses can reopen several recently closed tabs'],
    ['Shortcuts','Alt + Tab','Alt + Tab switches between open windows in Windows','It reduces time spent moving the mouse to the taskbar','Hold Alt and tap Tab to move through open apps'],
    ['Shortcuts','Windows + D','Windows + D shows or hides the desktop in Windows','It gives you a fast way to reach files or shortcuts on the desktop','Pressing Windows + D again restores the windows you were using'],
    ['Shortcuts','Ctrl + A','Ctrl + A selects all text or items in many programs','Selecting everything first can make copying, moving, or formatting faster','Ctrl + A followed by Ctrl + C copies an entire selected block'],
    ['Programming','Variable','A variable gives a value a name so a program can use it later','Programs need a way to remember information while they run','In Python, score = 10 stores the number ten in a variable named score'],
    ['Programming','Loop','A loop repeats instructions without rewriting the same code again','Repetition is common in programs and loops make it manageable','A loop can draw one hundred shapes using only a few lines of code'],
    ['Programming','Condition','A condition lets a program choose what to do based on whether something is true','Programs become interactive when they can make decisions','An if statement can check whether a score is greater than ten'],
    ['Programming','Function','A function groups instructions under a name so they can be reused','Reusable code is easier to organize and change','A function named jump can contain every instruction needed for a game character to jump'],
    ['Programming','Parameter','A parameter lets a function receive information when it is called','One function can behave differently without being rewritten','A draw_circle size parameter can control how large the circle becomes'],
    ['Programming','Bug','A bug is an error or flaw that causes a program to behave differently than intended','Finding and fixing bugs is a normal part of programming','A missing parenthesis can stop Python from understanding a line of code'],
    ['Programming','Debugging','Debugging is the process of finding and fixing problems in code','Programmers improve software by testing what actually happens','Reading an error message can point you toward the line that needs attention'],
    ['Programming','Algorithm','An algorithm is a sequence of steps for solving a problem or completing a task','Good programs depend on clear procedures','A recipe and a search procedure can both be described as algorithms'],
    ['Programming','Syntax','Syntax is the set of rules that determines how code must be written','A computer needs code to follow the grammar of its programming language','Python uses a colon after an if statement or loop header'],
    ['Languages','Python','Python was designed with an emphasis on readable code','Readable syntax helps people focus on ideas instead of punctuation','Python is widely used for education, automation, data work, web services, and AI'],
    ['Languages','JavaScript','JavaScript became the language used to make web pages interactive in the browser','Web pages need code that can react to clicks, typing, and changing data','A JavaScript program can change part of a page without reloading the whole site'],
    ['Languages','C','C gives programmers relatively direct control over memory and hardware','That control made it important for operating systems and performance-sensitive software','Large parts of Unix and many system tools were written in C'],
    ['Languages','Java','Java was designed so compiled programs could run through a virtual machine on many systems','A common runtime reduces how much software must change for each computer','The phrase write once, run anywhere became closely associated with Java'],
    ['Languages','FORTRAN','FORTRAN was created in the 1950s to make scientific and mathematical programming more practical','Early programmers wanted a higher-level alternative to writing machine instructions directly','FORTRAN became especially important in scientific and engineering computing'],
    ['History','Ada Lovelace','Ada Lovelace described an algorithm for Charles Babbage\'s proposed Analytical Engine in the 1840s','Her notes explored how a general-purpose machine could manipulate symbols through instructions','Her Bernoulli number notes are often discussed in the history of programming'],
    ['History','Grace Hopper','Grace Hopper helped develop early compiler technology and worked on ideas that influenced COBOL','She pushed programming toward languages that were easier for people to read and write','Compilers helped programmers move away from entering only low-level machine instructions'],
    ['History','ENIAC','ENIAC was an early electronic general-purpose computer completed in the 1940s','It showed the power and difficulty of programming large electronic machines','Early ENIAC programming involved configuring cables and switches'],
    ['History','World Wide Web','Tim Berners-Lee proposed the World Wide Web while working at CERN','The web connected documents through hyperlinks and shared standards','The first web browser and web server were created as part of that project'],
    ['Hardware','CPU','The CPU executes instructions and performs the core calculations requested by programs','Every running program depends on the processor carrying out instructions','Modern CPUs can contain multiple cores that work on different tasks'],
    ['Hardware','RAM','RAM temporarily stores data that active programs need to access quickly','Fast working memory helps the processor avoid waiting for slower storage','Opening more programs usually increases the amount of RAM being used'],
    ['Hardware','Storage','Storage keeps files and programs even when the computer is turned off','Long-term data needs a place that does not disappear when power is removed','Solid-state drives use flash memory and have no spinning disks'],
    ['Hardware','GPU','A GPU is designed to perform many calculations in parallel','Parallel computation is useful for graphics and many machine-learning workloads','A GPU can process large groups of pixels or numbers at the same time'],
    ['Hardware','Input device','An input device sends information into a computer','Computers need ways to receive actions and data from people or sensors','Keyboards, mice, microphones, cameras, and sensors are input devices'],
    ['Hardware','Output device','An output device presents information produced by a computer','Results need a way to reach people or other systems','Monitors, speakers, printers, and some motors can act as output devices'],
    ['Internet','IP address','An IP address identifies a device or network interface so data can be routed across an IP network','Routers need destination information to move packets toward the right place','Public websites can be reached through IP addresses even though people usually use domain names'],
    ['Internet','DNS','DNS translates human-friendly domain names into information computers can use to locate services','People remember names more easily than long numerical addresses','When you enter a website name, DNS can help your device find the server address'],
    ['Internet','Packet','Internet data is commonly divided into packets that can travel across networks','Breaking data into pieces makes large network systems more flexible and resilient','Packets contain addressing and control information along with part of the data being sent'],
    ['Internet','Router','A router forwards data between networks','Home and school networks need devices that decide where outgoing packets should go','A router can send local traffic toward the wider internet'],
    ['Internet','HTTP','HTTP is a protocol used for requesting and transferring web resources','Browsers and servers need agreed rules for exchanging web content','A browser can send an HTTP request for an HTML page'],
    ['Internet','HTTPS','HTTPS protects HTTP traffic with encryption and authentication provided by TLS','Encryption helps prevent other people on the network from reading or changing the traffic','The lock indicator in a browser usually means the connection is using HTTPS'],
    ['Data','Bit','A bit is a binary digit that can have a value of zero or one','Digital systems can represent complex information using combinations of two states','Eight bits are commonly grouped into one byte'],
    ['Data','Byte','A byte is commonly a group of eight bits','Bytes are a basic unit used to measure digital data','A text character may use one or more bytes depending on its encoding'],
    ['Data','Binary','Binary represents values using only zero and one','Electronic systems can reliably distinguish two states and combine them into larger patterns','The binary number 1010 represents decimal ten'],
    ['Data','ASCII','ASCII is an early character encoding that assigns numbers to letters, digits, punctuation, and control characters','Computers need agreed numeric representations for text','In ASCII, uppercase A is represented by the decimal value 65'],
    ['Data','Unicode','Unicode gives characters from many writing systems consistent code points','Global software needs to represent far more text than early English-focused encodings allowed','Unicode includes letters, symbols, emoji, and characters from many languages'],
    ['Cybersecurity','Password','A strong password is long, unique, and difficult to guess','Reusing one password lets a single breach threaten multiple accounts','A password manager can help create and store different passwords for different sites'],
    ['Cybersecurity','Phishing','Phishing tries to trick people into revealing information or opening something harmful','Attackers often target human trust instead of breaking technical defenses directly','Unexpected login links and urgent requests deserve careful checking'],
    ['Cybersecurity','Two-factor authentication','Two-factor authentication requires a second form of proof in addition to a password','A stolen password alone becomes less useful to an attacker','A sign-in might require both a password and a temporary code from an authenticator app'],
    ['Cybersecurity','Encryption','Encryption transforms readable data so that it cannot be understood without the correct key','Sensitive information needs protection while stored or transmitted','Encrypted messaging protects message contents from many forms of interception'],
    ['AI','Machine learning','Machine learning builds models by finding patterns in data rather than relying only on hand-written rules','Some problems are easier to learn from examples than to describe with fixed instructions','A model can learn to classify images after training on many labeled examples'],
    ['AI','Training data','Training data is the information used to adjust a machine-learning model','The examples a model learns from influence the patterns it can recognize','Biased or incomplete training data can lead to uneven results'],
    ['AI','Model','A machine-learning model is a learned mathematical system that maps inputs to outputs','Training changes internal parameters so the model performs a task more effectively','A language model estimates likely patterns in sequences of text'],
    ['AI','Generative AI','Generative AI produces new content such as text, images, audio, or code from learned patterns','These systems predict and construct outputs rather than retrieving one fixed answer','A generated response can sound confident even when it contains an error'],
    ['AI','Prompt','A prompt is the input or instruction given to a generative AI system','Clear context can help a model produce a more useful response','A prompt can include a goal, constraints, examples, and the format you want back'],
    ['Files','File extension','A file extension often indicates the format or kind of data stored in a file','Programs use file types to decide how content should be opened or handled','A file ending in .py usually contains Python source code'],
    ['Files','Folder','Folders organize files into a hierarchy','Clear organization makes work easier to find and back up','A Computer Science folder can contain separate folders for projects and assignments'],
    ['Files','Save','Saving writes the current version of your work to storage','Unsaved changes can disappear if a program closes unexpectedly','Ctrl + S saves in many desktop applications'],
    ['Web','HTML','HTML describes the structure and content of a web page','Browsers need markup that identifies headings, paragraphs, links, images, and other elements','An h1 element represents a top-level heading'],
    ['Web','CSS','CSS controls the visual presentation of web content','Separating style from structure makes designs easier to change consistently','CSS can control spacing, fonts, colors, layout, and animation'],
    ['Web','URL','A URL identifies the location of a resource on a network','Browsers need an address for the resource you want to open','A URL can include a protocol, domain, path, query, and fragment'],
    ['Problem Solving','Decomposition','Decomposition breaks a large problem into smaller parts','Smaller problems are easier to understand, test, and fix','A game can be separated into movement, scoring, input, enemies, and graphics'],
    ['Problem Solving','Abstraction','Abstraction hides unnecessary detail so you can focus on the important part of a problem','Complex systems become easier to use when details are organized behind simpler interfaces','Calling a function lets you use its behavior without rewriting every internal step'],
    ['Problem Solving','Pattern recognition','Pattern recognition looks for similarities that can help solve a new problem','Repeated structures often suggest reusable strategies','If several drawings use the same shape pattern, one function may handle all of them']
  ];

  const frames = [
    (k) => k[2] + '.',
    (k) => `${k[1]} matters because ${lower(k[3])}.`,
    (k) => `${k[4]}.`,
    (k) => `A useful thing to remember about ${k[1]} is that ${lower(k[2])}.`,
    (k) => `${k[2]}. ${k[4]}.`,
    (k) => `In computer science, ${lowerFirst(k[2])}.`,
    (k) => `${k[1]} connects to a bigger idea: ${lower(k[3])}.`,
    (k) => `One practical example of ${k[1]} is this: ${lowerFirst(k[4])}.`
  ];

  const speedSentences = [
    'Small improvements become easier to notice when you measure them over time.',
    'A steady rhythm usually produces better typing than rushing through the first few words.',
    'Strong typists look ahead while their hands finish the word they are already typing.',
    'Accuracy creates speed because fewer mistakes mean less time spent correcting the same line.',
    'Computers can complete millions of operations while a person types a single sentence.',
    'Good software often feels simple because difficult decisions were handled before the user arrived.',
    'A keyboard becomes much faster when your hands learn where keys are without searching for them.',
    'The goal of practice is to make common movements automatic enough that attention can stay on the idea.',
    'When a task feels smooth, the brain can spend less effort on each individual key press.',
    'Typing a little faster every week can become a large difference across an entire school year.',
    'Readable code helps programmers understand what happened months after the code was first written.',
    'The internet works because many independent computers follow shared technical rules.',
    'A browser turns files and network responses into the interactive pages you see on screen.',
    'Every digital photo is stored as data even though people experience it as an image.',
    'Most useful computer skills feel slow at first and become natural after enough correct repetition.',
    'You can often solve a technical problem faster by describing exactly what changed before it stopped working.',
    'Professional programmers spend a surprising amount of time reading code instead of writing new code.',
    'A fast computer is still limited by unclear instructions, missing data, and software bugs.',
    'The best shortcut is the one you remember at the exact moment it saves you several unnecessary steps.',
    'Learning to type well makes almost every other computer task feel easier because the keyboard stops getting in the way.'
  ];

  const precisionPools = {
    home: ['asdf jkl;','fall ask salad flask','all dads add salad','a sad lad falls','ask a lad; add salad'],
    top: ['qwerty uiop','power query typewriter','quiet power requires practice','write your query properly','priority requires power'],
    bottom: ['zxcv bnm','zoom can move between zones','mix numbers, move calmly','binary can become complex','zoom beyond maximum'],
    numbers: ['version 2 uses 8 bits per byte','1010 in binary equals 10 in decimal','a score of 95 beats a score of 89','Ctrl + 1 can select the first tab','2026 has four digits'],
    symbols: ['score = 10','if score > 5:','print("hello")','items = [1, 2, 3]','point = (4, 7)','value += 1']
  };

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
    sentenceStartedAt: 0,
    completed: 0,
    seenConcepts: [],
    recentTargets: [],
    errors: {},
    ticker: null,
    ended: false,
    errorIndex: -1,
    currentKnowledge: null,
    precisionPool: 'home'
  };

  function lower(text){return text.charAt(0).toLowerCase()+text.slice(1)}
  function lowerFirst(text){return text.charAt(0).toLowerCase()+text.slice(1)}
  function cleanSentence(text){return text.replace(/\.\./g,'.').replace(/\s+/g,' ').trim()}
  function formatTime(seconds){seconds=Math.max(0,Math.ceil(seconds));return `${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`}
  function wpm(){const elapsed=Math.max(1,(Date.now()-state.startedAt)/1000);return Math.round((state.correct/5)/(elapsed/60))}
  function accuracy(){return state.attempts?Math.round(state.correct/state.attempts*100):100}
  function bestKey(){return `keyquest1-best-${state.mode}`}
  function getBest(){return Number(localStorage.getItem(bestKey())||0)}
  function setBest(value){if(value>getBest())localStorage.setItem(bestKey(),String(value))}

  function learningSentence(){
    let index = Math.floor(Math.random()*knowledge.length);
    for(let i=0;i<8 && state.recentTargets.includes(index);i++) index=Math.floor(Math.random()*knowledge.length);
    state.recentTargets.push(index); if(state.recentTargets.length>8) state.recentTargets.shift();
    const item=knowledge[index]; state.currentKnowledge=item;
    const frame=frames[Math.floor(Math.random()*frames.length)];
    const sentence=cleanSentence(frame(item));
    if(!state.seenConcepts.includes(item[1])) state.seenConcepts.push(item[1]);
    $('topicLabel').textContent=item[0];
    conceptChip.textContent=item[1]; conceptChip.hidden=false;
    return sentence;
  }

  function speedSentence(){
    state.currentKnowledge=null; conceptChip.hidden=true; $('topicLabel').textContent='Flow practice';
    const pieces=[...speedSentences].sort(()=>Math.random()-.5).slice(0,3);
    return pieces.join(' ');
  }

  function choosePrecisionPool(){
    const entries=Object.entries(state.errors).sort((a,b)=>b[1]-a[1]);
    if(entries.length){
      const key=entries[0][0].toLowerCase();
      if(/[0-9]/.test(key)) return 'numbers';
      if(/[=+>:\[\]()"',.]/.test(key)) return 'symbols';
      if('asdfghjkl;'.includes(key)) return 'home';
      if('qwertyuiop'.includes(key)) return 'top';
      if('zxcvbnm'.includes(key)) return 'bottom';
    }
    const order=['home','top','bottom','numbers','symbols'];
    return order[state.completed%order.length];
  }

  function precisionSentence(){
    state.currentKnowledge=null; conceptChip.hidden=true;
    state.precisionPool=choosePrecisionPool();
    const pool=precisionPools[state.precisionPool];
    $('topicLabel').textContent={home:'Home row',top:'Top row',bottom:'Bottom row',numbers:'Numbers',symbols:'Programming symbols'}[state.precisionPool];
    precisionHint.textContent = state.attempts ? 'Adapting toward the keys you miss most.' : 'Accuracy first. Speed can come later.';
    return pool[Math.floor(Math.random()*pool.length)];
  }

  function nextTarget(){
    if(state.mode==='learn') return learningSentence();
    if(state.mode==='speed') return speedSentence();
    return precisionSentence();
  }

  function renderSentence(animate=true){
    state.position=0; state.errorIndex=-1; state.target=nextTarget(); state.sentenceStartedAt=Date.now();
    sentenceEl.className='sentence'+(animate?' enter':'');
    sentenceEl.innerHTML='';
    Array.from(state.target).forEach((ch,i)=>{
      const span=document.createElement('span'); span.className='char'+(i===0?' current':''); span.textContent=ch; sentenceEl.appendChild(span);
    });
    feedbackEl.textContent='';
    if(animate)setTimeout(()=>sentenceEl.classList.remove('enter'),320);
    typingStage.focus({preventScroll:true});
  }

  function updateChars(){
    const chars=sentenceEl.querySelectorAll('.char');
    chars.forEach((span,i)=>{
      span.className='char';
      if(i<state.position)span.classList.add('done');
      else if(i===state.position)span.classList.add('current');
      if(i===state.errorIndex)span.classList.add('error');
    });
  }

  function completeSentence(){
    state.completed++;
    $('sentenceCount').textContent=`${state.completed} ${state.completed===1?'sentence':'sentences'}`;
    sentenceEl.classList.add('complete');
    setTimeout(()=>renderSentence(true),180);
  }

  function handleKey(e){
    if(sessionView.hidden || state.ended) return;
    if(e.ctrlKey||e.metaKey||e.altKey||e.key==='Tab'||e.key==='Escape') return;
    if(e.key==='Backspace'){e.preventDefault();return;}
    if(e.key.length!==1) return;
    e.preventDefault();
    const now=Date.now();
    if(state.lastKeyAt && now-state.lastKeyAt<5000) state.activeMs += now-state.lastKeyAt;
    state.lastKeyAt=now;
    state.attempts++;
    const expected=state.target[state.position];
    if(e.key===expected){
      state.correct++; state.errorIndex=-1; feedbackEl.textContent=''; state.position++;
      if(state.position>=state.target.length){completeSentence();return;}
    }else{
      state.errorIndex=state.position;
      state.errors[expected]=(state.errors[expected]||0)+1;
      feedbackEl.textContent=expected===' ' ? 'Space' : `Try ${expected}`;
      setTimeout(()=>{if(state.errorIndex===state.position){state.errorIndex=-1;updateChars()}},220);
    }
    updateChars(); updateLiveStats();
  }

  function updateLiveStats(){
    $('wpmValue').textContent=String(wpm());
    $('accuracyValue').textContent=String(accuracy());
    if(state.mode==='speed'){
      const current=wpm(); const best=Math.max(getBest(),1); const pct=Math.min(100,Math.max(3,current/(Math.max(best,30)*1.2)*100));
      $('paceDot').style.left=`${pct}%`; $('paceText').textContent=`${current} wpm`;
      $('bestMarker').style.left=`${Math.min(92,Math.max(15,best/(Math.max(best,30)*1.2)*100))}%`;
    }
  }

  function tick(){
    if(state.ended)return;
    const now=Date.now(); const remaining=(state.endAt-now)/1000;
    $('timeValue').textContent=formatTime(remaining);
    const total=state.minutes*60; const elapsed=Math.min(total,Math.max(0,total-remaining));
    $('progressFill').style.width=`${elapsed/total*100}%`;
    updateLiveStats();
    if(remaining<=0)endSession();
  }

  function startSession(mode){
    state.mode=mode; state.startedAt=Date.now(); state.endAt=state.startedAt+state.minutes*60*1000; state.lastKeyAt=0; state.activeMs=0; state.correct=0; state.attempts=0; state.position=0; state.completed=0; state.seenConcepts=[]; state.recentTargets=[]; state.errors={}; state.ended=false; state.currentKnowledge=null;
    homeView.hidden=true; resultView.hidden=true; sessionView.hidden=false; homeButton.hidden=false;
    $('modeLabel').textContent={learn:'LEARN + TYPE',speed:'SPEED',precision:'PRECISION'}[mode];
    speedTrail.hidden=mode!=='speed'; precisionHint.hidden=mode!=='precision'; conceptChip.hidden=mode!=='learn';
    $('sentenceCount').textContent='0 sentences'; $('wpmValue').textContent='0'; $('accuracyValue').textContent='100'; $('timeValue').textContent=formatTime(state.minutes*60); $('progressFill').style.width='0%';
    renderSentence(false);
    clearInterval(state.ticker); state.ticker=setInterval(tick,250); tick();
  }

  function endSession(){
    if(state.ended)return; state.ended=true; clearInterval(state.ticker);
    const finalWpm=wpm(); const oldBest=getBest(); setBest(finalWpm); const newBest=getBest();
    sessionView.hidden=true; resultView.hidden=false; homeButton.hidden=true;
    $('resultWpm').textContent=String(finalWpm); $('resultAccuracy').textContent=`${accuracy()}%`; $('resultSentences').textContent=String(state.completed); $('resultActive').textContent=formatTime(state.activeMs/1000); $('resultBest').textContent=newBest?`${newBest} WPM`:'—';
    $('resultTitle').textContent=finalWpm>oldBest&&finalWpm>0?'New personal best.':'Nice run.';
    const learned=$('resultLearned'); const chips=$('learnedChips'); chips.innerHTML='';
    if(state.mode==='learn'&&state.seenConcepts.length){learned.hidden=false;state.seenConcepts.slice(-10).forEach(c=>{const span=document.createElement('span');span.textContent=c;chips.appendChild(span)})}else learned.hidden=true;
  }

  function showHome(){clearInterval(state.ticker);state.ended=true;sessionView.hidden=true;resultView.hidden=true;homeView.hidden=false;homeButton.hidden=true;feedbackEl.textContent=''}

  document.querySelectorAll('[data-mode]').forEach(btn=>btn.addEventListener('click',()=>startSession(btn.dataset.mode)));
  document.querySelectorAll('[data-minutes]').forEach(btn=>btn.addEventListener('click',()=>{state.minutes=Number(btn.dataset.minutes);document.querySelectorAll('[data-minutes]').forEach(b=>b.classList.toggle('selected',b===btn))}));
  $('endButton').addEventListener('click',endSession); homeButton.addEventListener('click',showHome); $('modesButton').addEventListener('click',showHome); $('againButton').addEventListener('click',()=>startSession(state.mode));
  typingStage.addEventListener('click',()=>typingStage.focus({preventScroll:true}));
  document.addEventListener('keydown',handleKey);
})();
