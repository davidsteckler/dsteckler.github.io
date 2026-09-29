#!/usr/bin/env node
// Rebuild the friendly routes after adding or renaming Turtle gallery projects.
// Run from the repository root: node turtleprojects/build-tutorial-routes.cjs
const fs=require('node:fs'), path=require('node:path'), vm=require('node:vm');
const root=__dirname;
const context=vm.createContext({window:{}});
for(const file of ['base-catalog.js',...'abcdef'.split('').map(c=>'curated-'+c+'.js'),'starter-catalog.js'])
  vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context,{filename:file});
const catalog=[...context.window.TURTLE_BASE_CATALOG,...context.window.CURATED_EXAMPLES,...context.window.TURTLE_STARTER_CATALOG];
const overrides=JSON.parse(fs.readFileSync(path.join(root,'tutorial-slug-overrides.json'),'utf8'));
const toSlug=s=>s.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[’']/g,'').replace(/&/g,'-and-').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\"/g,'&quot;');
const projects=[{id:'robot-roll-call',title:'Robot roll call'},...catalog];
const slugs=Object.fromEntries(projects.map(p=>[p.id,overrides[p.id]||toSlug(p.title)]));
const seen=new Set();
for(const p of projects){const s=slugs[p.id];if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s)||seen.has(s))throw Error('Invalid or duplicate route: '+p.id+' -> '+s);seen.add(s)}
fs.writeFileSync(path.join(root,'tutorial-slugs.js'),'// Friendly URLs for gallery tutorials. Rebuild with: node turtleprojects/build-tutorial-routes.cjs\nwindow.TURTLE_TUTORIAL_SLUGS=Object.freeze('+JSON.stringify(slugs)+');\n');
for(const p of projects){
  const slug=slugs[p.id],id=encodeURIComponent(p.id);
  const html='<!doctype html>\n<html lang="en">\n<head>\n  <meta charset="utf-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n  <title>'+esc(p.title)+' · Python Turtle Tutorial | David Steckler</title>\n  <meta name="description" content="Learn to draw '+esc(p.title)+' with Python Turtle, step by step.">\n  <link rel="canonical" href="https://dsteckler.com/turtleprojects/'+slug+'/">\n  <script src="/turtleprojects/tutorial-route.js?v=2" data-project="'+esc(p.id)+'" defer></script>\n</head>\n<body>\n  <p>Opening the '+esc(p.title)+' tutorial… <a href="/turtleprojects/project.html?id='+id+'">Open directly</a>.</p>\n  <noscript><a href="/turtleprojects/project.html?id='+id+'">Open the tutorial (JavaScript required)</a>.</noscript>\n</body>\n</html>\n';
  const dir=path.join(root,slug);fs.mkdirSync(dir,{recursive:true});if(!fs.existsSync(path.join(dir,'index.html')))fs.writeFileSync(path.join(dir,'index.html'),html);
  const legacy=path.join(root,'..','turtledemo',slug);
  fs.mkdirSync(legacy,{recursive:true});
  const dest='/turtleprojects/'+slug+'/';
  const legacyHtml='<!doctype html><html lang="en"><head><meta charset="utf-8"><link rel="canonical" href="https://dsteckler.com'+dest+'"><meta http-equiv="refresh" content="0;url='+dest+'"><script>location.replace('+JSON.stringify(dest)+'+location.search+location.hash);<'+'/script></head><body><a href="'+dest+'">Continue</a></body></html>';
  if(!fs.existsSync(path.join(legacy,'index.html')))fs.writeFileSync(path.join(legacy,'index.html'),legacyHtml);

}
console.log('Built '+projects.length+' unique tutorial routes. Rebuild tutorial steps separately after changing project code.');
