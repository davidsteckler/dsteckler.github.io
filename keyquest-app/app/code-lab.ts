// A deliberately bounded classroom interpreter; no eval, network, files, or imports.
type Value=string|number|boolean;
type Node={text:string;line:number;children:Node[]};
export function runClassroomPython(source:string):{output:string;error?:string}{
 const output:string[]=[];let steps=0;const functions=new Map<string,{params:string[];body:Node[]}>();
 try{
 const root:Node[]=[];const stack:{indent:number;nodes:Node[]}[]=[{indent:-4,nodes:root}];
 for(const [i,raw] of source.split('\n').entries()){
  if(!raw.trim()||raw.trimStart().startsWith('#'))continue;
  if(raw.includes('\t'))throw Error(`Line ${i+1}: use spaces instead of Tab.`);
  const indent=raw.length-raw.trimStart().length;
  if(indent%4)throw Error(`Line ${i+1}: indent in groups of four spaces.`);
  while(stack.length>1&&indent<=stack.at(-1)!.indent)stack.pop();
  if(indent!==stack.at(-1)!.indent+4)throw Error(`Line ${i+1}: check the indentation.`);
  const n:Node={text:raw.trim(),line:i+1,children:[]};stack.at(-1)!.nodes.push(n);
  if(n.text.endsWith(':'))stack.push({indent,nodes:n.children});
 }
 function value(text:string,vars:Map<string,Value>):Value{
  // Tokenize a small expression grammar. Invalid tokens never become executable JavaScript.
  const tokens:string[]=[];let rest=text.trim();
  while(rest){const match=rest.match(/^("[^"\n]*"|'[^'\n]*'|\d+(?:\.\d+)?|[A-Za-z_][A-Za-z_0-9]*|==|!=|>=|<=|[()+\-><])/);if(!match)throw Error('This expression is not supported. Use a number, quoted word, variable, +, -, or comparison.');tokens.push(match[0]);rest=rest.slice(match[0].length).trimStart();}
  let index=0;
  function atom():Value{const t=tokens[index++];if(t===undefined)throw Error('An expression is missing.');if(t==='('){const v=compare();if(tokens[index++]!==')')throw Error('Add the closing parenthesis ).');return v;}if(t==='-'){const v=atom();if(typeof v!=='number')throw Error('Use a number after minus.');return -v;}if(t[0]==='"'||t[0]==="'")return t.slice(1,-1);if(/^\d/.test(t))return Number(t);if(t==='True'||t==='False')return t==='True';if(vars.has(t))return vars.get(t)!;throw Error(`The name ${t} has no value yet. Check spelling or assign it first.`);}
  function add():Value{let a=atom();while(tokens[index]==='+'||tokens[index]==='-'){const op=tokens[index++],b=atom();if(op==='+'&&typeof a==='string'&&typeof b==='string')a=a+b;else if(typeof a==='number'&&typeof b==='number')a=op==='+'?a+b:a-b;else throw Error('Use two numbers, or join two strings with +.');}return a;}
  function compare():Value{const a=add(),op=tokens[index];if(['>','<','==','!=','>=','<='].includes(op)){index++;const b=add();switch(op){case'==':return a===b;case'!=':return a!==b;case'>':return a>b;case'<':return a<b;case'>=':return a>=b;default:return a<=b;}}return a;}
  const result=compare();if(index!==tokens.length)throw Error('Check the expression and parentheses.');return result;
 }
 function execute(nodes:Node[],vars:Map<string,Value>,depth=0){if(depth>15)throw Error('Too many function calls. Check whether a function calls itself.');for(const n of nodes){if(++steps>500)throw Error('Practice limit reached. Try a smaller loop.');try{
  let m:RegExpMatchArray|null;
  if((m=n.text.match(/^def ([a-zA-Z_]\w*)\(([^)]*)\):$/))){const params=m[2].trim()?m[2].split(',').map(p=>p.trim()):[];if(!params.every(p=>/^[a-zA-Z_]\w*$/.test(p)))throw Error('Use simple parameter names.');if(!n.children.length)throw Error('Add an indented instruction inside the function.');functions.set(m[1],{params,body:n.children});}
  else if((m=n.text.match(/^for ([a-zA-Z_]\w*) in range\((.+)\):$/))){const count=value(m[2],vars);if(typeof count!=='number'||!Number.isInteger(count)||count<0||count>100)throw Error('Use a whole number from 0 to 100 in range.');if(!n.children.length)throw Error('Add an indented instruction inside the loop.');for(let i=0;i<count;i++){vars.set(m[1],i);execute(n.children,vars,depth);}}
  else if((m=n.text.match(/^if (.+):$/))){if(!n.children.length)throw Error('Add an indented instruction after if.');if(value(m[1],vars))execute(n.children,vars,depth);}
  else if((m=n.text.match(/^print\((.*)\)$/))){if(output.length>=100)throw Error('Output limit reached. Try fewer repeats.');const result=value(m[1],vars);output.push(typeof result==='boolean'?(result?'True':'False'):String(result));}
  else if((m=n.text.match(/^([a-zA-Z_]\w*)\s*=\s*(?!=)(.+)$/))){vars.set(m[1],value(m[2],vars));}
  else if((m=n.text.match(/^([a-zA-Z_]\w*)\((.*)\)$/))){const fn=functions.get(m[1]);if(!fn)throw Error(`The function ${m[1]} is not defined. Check its name.`);const parts=m[2].trim()?m[2].match(/(?:"[^"]*"|'[^']*'|[^,])+/g)||[]:[];if(parts.length!==fn.params.length)throw Error(`This function needs ${fn.params.length} input(s).`);const local=new Map(vars);fn.params.forEach((p,i)=>local.set(p,value(parts[i].trim(),vars)));execute(fn.body,local,depth+1);}
  else throw Error('Check spelling, parentheses, and the colon after def, for, or if. This lab supports print, variables, functions, range loops, and if.');
 }catch(e:any){if(e.message.startsWith('Line '))throw e;throw Error(`Line ${n.line}: ${e.message}`)}}}
 execute(root,new Map());return {output:output.join('\n')||'The program finished with no printed output.'};
 }catch(e:any){return {output:output.join('\n'),error:e.message}}
}
