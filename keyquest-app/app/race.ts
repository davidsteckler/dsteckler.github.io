export type RaceScore={text:string;correct:number;attempts:number;seconds:number;points:number;wpm:number;accuracy:number};
export function raceScore(text:string,correct:number,attempts:number,seconds:number):RaceScore{
 const accuracy=attempts?Math.round(correct/attempts*100):0;
 return {text,correct,attempts,seconds,accuracy,wpm:seconds>=1?Math.round(correct*12/seconds*10)/10:0,points:correct*10+50+Math.round(accuracy/2)};
}
export function wordRange(text:string,pos:number){let from=pos,to=pos;while(from>0&&text[from-1]!==' ')from--;while(to<text.length&&text[to]!==' ')to++;return {from,to};}
