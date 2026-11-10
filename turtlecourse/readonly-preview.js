/* Lightweight, read-only 400×400 Turtle world for course examples.
   Drawing geometry and turtle sprite match /turtle/'s canvas implementation.
   Only the example's supported drawing instructions are replayed: no iframe,
   Python CDN, editor, local storage, or network requests are required. */
(function(){
"use strict";
function rad(a){return a*Math.PI/180}
function drawSprite(ctx,state){
  ctx.save();
  ctx.translate(200+state.x,200-state.y);
  ctx.rotate(-rad(state.heading));
  var accent=state.color||"#176b73",outline="#173b3d",body="#8fc6ae";
  ctx.lineCap="round";ctx.lineJoin="round";ctx.lineWidth=1.35;
  ctx.fillStyle=body;ctx.strokeStyle=outline;
  ctx.beginPath();
  ctx.moveTo(-10.5,0);ctx.lineTo(-14.5,-2.1);ctx.lineTo(-14.5,2.1);
  ctx.closePath();ctx.fill();ctx.stroke();
  [[-5,-7,-.34],[-5,7,.34],[4,-7,-.52],[4,7,.52]].forEach(function(leg){
    ctx.save();ctx.translate(leg[0],leg[1]);ctx.rotate(leg[2]);
    ctx.beginPath();ctx.ellipse(0,0,3.7,2,0,0,Math.PI*2);
    ctx.fill();ctx.stroke();ctx.restore();
  });
  ctx.fillStyle=accent;ctx.beginPath();ctx.ellipse(-1,0,8.8,6.3,0,0,Math.PI*2);
  ctx.fill();ctx.stroke();
  ctx.save();ctx.globalAlpha=.45;ctx.strokeStyle="#ffffff";ctx.lineWidth=.9;
  ctx.beginPath();ctx.moveTo(-6.5,-3);ctx.lineTo(4.5,2.8);
  ctx.moveTo(-6.5,3);ctx.lineTo(4.5,-2.8);ctx.stroke();ctx.restore();
  ctx.fillStyle=body;ctx.strokeStyle=outline;
  ctx.beginPath();ctx.arc(9.8,0,4,0,Math.PI*2);ctx.fill();ctx.stroke();
  ctx.fillStyle=outline;ctx.beginPath();ctx.arc(11.2,-1.2,.7,0,Math.PI*2);ctx.fill();
  ctx.restore();
}
function parse(code){
  return String(code||"").split(/\r?\n/).map(function(line){
    var match=line.trim().match(/^([a-z_]+)\((.*)\)$/i);
    if(!match)return null;
    var raw=match[2].trim();
    var value=/^["']/.test(raw)?raw.slice(1,-1):Number(raw);
    return {name:match[1].toLowerCase(),value:value};
  }).filter(Boolean);
}
function run(canvas,code,kind){
  if(!canvas||typeof canvas.getContext!=="function")return false;
  var ctx=canvas.getContext("2d");
  if(!ctx)return false;
  canvas.width=400;canvas.height=400;
  var ops=parse(code);
  var background="#ffffff";
  ops.forEach(function(op){if(op.name==="bgcolor" && typeof op.value==="string")background=op.value});
  ctx.fillStyle=background;ctx.fillRect(0,0,400,400);
  ctx.save();ctx.strokeStyle="rgba(32,37,37,.075)";ctx.lineWidth=1;
  ctx.beginPath();
  for(var tick=20;tick<400;tick+=20){
    ctx.moveTo(tick+.5,0);ctx.lineTo(tick+.5,400);
    ctx.moveTo(0,tick+.5);ctx.lineTo(400,tick+.5);
  }
  ctx.stroke();ctx.strokeStyle="rgba(32,37,37,.28)";ctx.beginPath();
  ctx.moveTo(200,0);ctx.lineTo(200,400);ctx.moveTo(0,200);ctx.lineTo(400,200);ctx.stroke();
  ctx.restore();
  ctx.fillStyle="rgba(40,50,52,.65)";ctx.font="9px Consolas,monospace";
  ctx.fillText("−200",5,214);ctx.fillText("200",372,214);
  ctx.fillText("200",204,12);ctx.fillText("−200",204,391);
  // Tracy starts at (0, 0), facing right, exactly as in the editable Turtle world.
  var state={x:0,y:0,heading:0,down:true,color:"#000000",size:1};
  function point(x,y){return [200+x,200-y]}
  ops.forEach(function(op){
    var n=Number(op.value);
    if(op.name==="color" && typeof op.value==="string"){state.color=op.value;return}
    if(op.name==="bgcolor")return;
    if(op.name==="penup"){state.down=false;return}
    if(op.name==="pendown"){state.down=true;return}
    if(op.name==="left"){if(Number.isFinite(n))state.heading+=n;return}
    if(op.name==="right"){if(Number.isFinite(n))state.heading-=n;return}
    if(op.name==="forward" && Number.isFinite(n)){
      var x=state.x+Math.cos(rad(state.heading))*n;
      var y=state.y+Math.sin(rad(state.heading))*n;
      if(state.down){
        var a=point(state.x,state.y),b=point(x,y);
        ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);
        ctx.strokeStyle=state.color;ctx.lineWidth=state.size;
        ctx.lineCap="round";ctx.stroke();
      }
      state.x=x;state.y=y;return;
    }
    if(op.name==="circle" && Number.isFinite(n) && n!==0){
      var base=rad(state.heading);
      var cx=state.x-n*Math.sin(base),cy=state.y+n*Math.cos(base);
      var theta0=Math.atan2(state.y-cy,state.x-cx);
      if(state.down){
        ctx.beginPath();
        for(var i=0;i<=180;i++){
          var a=theta0+(n>=0?1:-1)*Math.PI*2*i/180;
          var xx=cx+Math.abs(n)*Math.cos(a);
          var yy=cy+Math.abs(n)*Math.sin(a);
          var p=point(xx,yy);
          if(i===0)ctx.moveTo(p[0],p[1]);else ctx.lineTo(p[0],p[1]);
        }
        ctx.strokeStyle=state.color;ctx.lineWidth=state.size;
        ctx.lineCap="round";ctx.lineJoin="round";ctx.stroke();
      }
    }
  });
  drawSprite(ctx,state);
  canvas.dataset.rendered="true";
  return true;
}
function render(root){
  var parent=root||document;
  var nodes=parent.querySelectorAll("canvas[data-example-code]");
  nodes.forEach(function(canvas){
    try{
      var code=decodeURIComponent(canvas.getAttribute("data-example-code")||"");
      run(canvas,code,canvas.getAttribute("data-example-kind")||"");
    }catch(e){
      canvas.dataset.rendered="failed";
    }
  });
}
window.TurtleCourseExamples={render:render,run:run};
})();