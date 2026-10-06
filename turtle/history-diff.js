/* Shared by the history timeline and its changes view. */
(function(root){
  'use strict';
  function lines(code){return code === '' ? [] : String(code).split('\n');}
  function diff(before, after){
    var a=lines(before),b=lines(after),prefix=0,suffix=0;
    while(prefix<a.length&&prefix<b.length&&a[prefix]===b[prefix])prefix++;
    while(suffix<a.length-prefix&&suffix<b.length-prefix&&a[a.length-1-suffix]===b[b.length-1-suffix])suffix++;
    var old=a.slice(prefix,a.length-suffix),next=b.slice(prefix,b.length-suffix),ops=[];
    function push(kind,text,oldLine,newLine){ops.push({kind:kind,text:text,oldLine:oldLine,newLine:newLine});}
    for(var p=0;p<prefix;p++)push('same',a[p],p+1,p+1);
    // Bound the matrix for unusually large programs; keep all code in the result.
    if(old.length*next.length>350000){
      old.forEach(function(text,i){push('removed',text,prefix+i+1,null);});
      next.forEach(function(text,i){push('added',text,null,prefix+i+1);});
    }else{
      var table=Array.from({length:old.length+1},function(){return new Uint32Array(next.length+1);});
      for(var i=old.length-1;i>=0;i--)for(var j=next.length-1;j>=0;j--)table[i][j]=old[i]===next[j]?table[i+1][j+1]+1:Math.max(table[i+1][j],table[i][j+1]);
      var x=0,y=0;
      while(x<old.length||y<next.length){
        if(x<old.length&&y<next.length&&old[x]===next[y]){push('same',old[x],prefix+x+1,prefix+y+1);x++;y++;}
        else if(x<old.length&&(y===next.length||table[x+1][y]>=table[x][y+1])){push('removed',old[x],prefix+x+1,null);x++;}
        else{push('added',next[y],null,prefix+y+1);y++;}
      }
    }
    for(var s=suffix;s>0;s--)push('same',a[a.length-s],a.length-s+1,b.length-s+1);
    return {rows:ops,added:ops.filter(function(row){return row.kind==='added';}).length,removed:ops.filter(function(row){return row.kind==='removed';}).length};
  }
  root.TurtleHistoryDiff=diff;
})(typeof window==='undefined'?globalThis:window);
