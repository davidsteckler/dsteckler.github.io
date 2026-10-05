(() => {
  'use strict';
  const activities = [
    ['Route puzzle','Reach the goal using movement and turns.','Beginner','challenge','Movement · debugging','/learn/python/?lesson=1-2-solve-route'],
    ['Bubble pattern puzzle','Work out the sizes and spacing in a pattern.','Beginner','challenge','circle() · patterns','/learn/python/?lesson=1-5-solve-bubbles'],
    ['Repair the neon sign','Find the commands that changed the sign’s appearance.','Beginner','challenge','Color · line width','/learn/python/?lesson=1-11-solve-style'],
    ['Design an arcade badge','Build your own symbol using lines, color, and text.','Beginner','challenge','Design · Python','/learn/python/?lesson=1-12-create-night'],
    ['ASCII repair','Repair a text picture one line at a time.','Beginner','challenge','print() · spaces · symbols','/learn/python/?lesson=1-14-solve-ascii'],
    ['Black Box','Decode transmissions and follow the evidence through a scavenger hunt.','Medium','challenge','Binary · reasoning','/learn/blackbox/'],
    ['Drawing projects','Choose a drawing, then build it through working checkpoints.','Beginner → Hard','challenge','Turtle · loops · functions','/learn/projects/'],
    ['Adopt a pocket owl','Give a tiny ASCII owl a name, a friend, and a sleepy face.','Beginner','creative','print → variables → functions','/learn/reference/#owl-meet'],
    ['Creative trails','Build little worlds with text and Turtle. Each stop runs on its own.','Beginner → Hard','creative','ASCII · animation · patterns','/learn/trails/'],
    ['Python Turtle reference','Try command variations in the editor and watch what changes.','All levels','tool','Commands · runnable examples','/learn/reference/'],
    ['Hex color viewer','Discover a color and use its hex code in a running drawing.','All levels','tool','color() · hex codes','/learn/colors/'],
    ['Trace tables','Follow variables and output as a program runs, line by line.','Beginner → Medium','tool','Variables · loops · execution','/learn/trace/'],
    ['Create with Python','Open the editor and build an idea of your own.','All levels','tool','Turtle · ASCII · sandbox','/learn/create/'],
    ['ASCII art & its history','Explore how a small collection of characters can become a picture.','Beginner','creative','Text · art · early games','/learn/ascii/'],
    ['Programming timeline','Explore the ideas that led to different programming languages.','Beginner','creative','History · languages · experiments','/learn/timeline/'],
    ['Programming languages','Explore how programming languages are compared.','All levels','tool','Languages · evidence','/learn/languages/'],
    ['Python text editor','Write and run Python with a text console.','All levels','tool','print() · variables · functions','/learn/code/']
  ];
  const escape = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let filter = 'all';
  function render() {
    const search = document.getElementById('learningSearch').value.toLowerCase().trim();
    const found = activities.filter(item=>(filter==='all'||item[3]===filter)&&item.slice(0,5).join(' ').toLowerCase().includes(search));
    document.getElementById('activityGrid').innerHTML=found.map(([title,description,level,category,skills,url])=>'<a class="activity-card" href="'+url+'"><div class="activity-meta"><span>'+escape(level)+'</span></div><h3>'+escape(title)+'</h3><p>'+escape(description)+'</p><span class="activity-skill">'+escape(skills)+'</span></a>').join('');
    document.getElementById('noResults').hidden=found.length>0;
    document.getElementById('resultCount').textContent=found.length+' activities';
  }
  document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
    filter=button.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
    render();
  }));
  document.getElementById('learningSearch').addEventListener('input',render);
  function refreshProgress() {
    const available=window.PYTHON_COURSE.units.flatMap(unit=>unit.lessons).filter(lesson=>lesson.available);
    try {
      const progress=JSON.parse(localStorage.getItem('dsteckler-pythoncourse-progress-v3-unit1')||localStorage.getItem('dsteckler-pythoncourse-progress-v2')||'{}')||{};
      const complete=available.filter(lesson=>progress[lesson.id]).length;
      document.getElementById('pythonProgress').textContent=complete+' / '+available.length+' complete';
      document.getElementById('pythonProgressFill').style.width=(complete/available.length*100)+'%';
      const recent=JSON.parse(localStorage.getItem('dsteckler-learning-recent-v1')||'null');
      if(recent?.url&&recent?.title){
        const url=new URL(recent.url,location.origin);
        if(url.origin===location.origin && !/^\/learn\/?$/.test(url.pathname)){
          const link=document.getElementById('continueLink');link.href=url.pathname+url.search+url.hash;link.textContent='Continue learning';
          document.getElementById('resumeCaption').textContent=recent.title;
        }
      }
    } catch {}
  }
  render();refreshProgress();window.addEventListener('pageshow',refreshProgress);window.addEventListener('storage',refreshProgress);
})();
