// Deterministic, reusable copy prompts. Levels continue; vocabulary stays accessible.
export const worlds=[
 {name:'Space snack run',icon:'🚀',prize:'🪐',actors:['the cat','a robot','the dog','a duck'],actions:['packs','finds','drops','wants'],things:['a taco','a moon pie','a red hat','a snack']},
 {name:'Pet arcade',icon:'🎮',prize:'🕹️',actors:['the pug','a cat','the frog','a fox'],actions:['wins','gets','finds','likes'],things:['a game','a gold cup','a big hat','a pizza']},
 {name:'Dino lunch club',icon:'🦖',prize:'🌮',actors:['the dino','a dragon','the duck','a robot'],actions:['wants','packs','gets','drops'],things:['a taco','a hot dog','a big cake','a tiny spoon']},
 {name:'Ocean remix',icon:'🐙',prize:'🎧',actors:['the crab','a shark','the squid','a fish'],actions:['finds','likes','gets','wants'],things:['a drum','a cool hat','a pink wig','a jam']},
 {name:'Robot skate park',icon:'🛹',prize:'🤖',actors:['the robot','a frog','the cat','a duck'],actions:['gets','finds','packs','likes'],things:['a board','a red cape','a big helmet','a snack']},
 {name:'Monster movie night',icon:'👾',prize:'🍿',actors:['the monster','a ghost','the bat','a yeti'],actions:['wants','drops','gets','packs'],things:['a corn dog','a soft pillow','a funny hat','a big snack']}
];
export const facts=[
'f and j have bumps','a key can type a letter','a space makes a gap','i can type one key','i can pause and rest',
'a keyboard sends input','a screen shows output','a mouse can click','a computer follows steps','i can save my work',
'a folder holds files','a file has a name','i can find my file','i can fix a typo','i can use a clear title',
'i keep my code private','i ask before i share','i can ask for help','people need clear text','big text can help',
'a network links computers','a message has a path','data can move in parts','a device has an address','a network has rules',
'i check a link first','i ask before i download','i lock my screen','i keep private facts safe','i ask a trusted adult',
'a plan has steps','the order of steps matters','code gives a computer steps','a bug is a code mistake','i can test one step',
'a name can store a value','a loop repeats steps','a function has a name','a choice can change a step','i test and fix my code',
'data is information','a chart can show a pattern','a model can help us test','a tool can help with a task','i give credit for art',
'we can test with many people','a game tester finds bugs','we can take turns','i can save and share my work','i can practice my typing'
];
export function questPrompt(completed:number,lesson:number){
 const n=Math.max(0,Math.floor(completed));const level=Math.floor(n/5)+1;
 const world=worlds[Math.floor(n/5)%worlds.length];
 // Mixed-radix combinations: 384 playful sentences, interleaved with 50 facts.
 const k=n*17;
 const sentence=n%4===3?facts[(lesson-1+Math.floor(n/24))%facts.length]:`${world.actors[k%4]} ${world.actions[Math.floor(k/4)%4]} ${world.things[Math.floor(k/16)%4]}`;
 return {sentence,level,world,isFact:n%4===3,steps:n%5};
}
export function copyChunks(sentence:string,mode:string){
 if(mode==='letters')return [...sentence];
 if(mode==='words')return sentence.split(' ').map((word,i,a)=>word+(i<a.length-1?' ':''));
 return [sentence];
}
