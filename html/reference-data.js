window.HTML_REFERENCE = [
  {id:"heading",title:"Headings",group:"HTML essentials",summary:"Use h1 through h6 to give a page a clear heading structure.",code:`<h1>My favorite place</h1>
<h2>Why I like it</h2>
<p>This heading is smaller because it is a section inside the page.</p>`},
  {id:"paragraph",title:"Paragraphs",group:"HTML essentials",summary:"Use p for normal blocks of text.",code:`<h2>About Pixie</h2>
<p>Pixie notices everything happening around her.</p>
<p>Each paragraph gets its own space.</p>`},
  {id:"button",title:"Buttons",group:"HTML essentials",summary:"A button is something the visitor can click.",code:`<button onclick="this.textContent='You clicked me!'">Click me</button>`},
  {id:"comment",title:"Comments",group:"HTML essentials",summary:"Comments leave notes in your code without showing them on the webpage.",code:`<!-- This note only appears in the code. -->
<h2>The visitor sees this.</h2>`},
  {id:"div",title:"Div containers",group:"HTML essentials",summary:"A div groups pieces of a page so you can style or arrange them together.",code:`<div style="padding: 16px; border: 2px solid teal; border-radius: 12px;">
  <h2>A grouped section</h2>
  <p>The heading and paragraph are inside the same div.</p>
</div>`},

  {id:"strong",title:"Bold & emphasis",group:"Text",summary:"strong adds importance. em adds emphasis.",code:`<p>I <strong>really</strong> like this part.</p>
<p>This word is <em>emphasized</em>.</p>`},
  {id:"linebreak",title:"Line breaks",group:"Text",summary:"br moves the next text to a new line without starting a new paragraph.",code:`<p>
  First line<br>
  Second line<br>
  Third line
</p>`},
  {id:"unordered-list",title:"Bullet lists",group:"Text",summary:"ul makes a bullet list. Each li is one item.",code:`<h2>Things to bring</h2>
<ul>
  <li>Water</li>
  <li>Notebook</li>
  <li>Charged laptop</li>
</ul>`},
  {id:"ordered-list",title:"Numbered lists",group:"Text",summary:"ol automatically numbers each list item.",code:`<h2>Three steps</h2>
<ol>
  <li>Write the HTML</li>
  <li>Run the page</li>
  <li>Change something</li>
</ol>`},
  {id:"quote",title:"Quotes",group:"Text",summary:"blockquote sets longer quoted text apart from the rest of the page.",code:`<blockquote>
  Make something small, run it, then improve it.
</blockquote>`},

  {id:"link",title:"Links",group:"Links & media",summary:"a creates a link. href tells the browser where to go.",code:`<a href="https://www.wikipedia.org/" target="_blank">Open Wikipedia</a>`},
  {id:"image",title:"Images",group:"Links & media",summary:"img displays an image. src is the image address and alt describes it.",code:`<img
  src="https://picsum.photos/320/180"
  alt="A random example photograph"
  style="max-width: 100%; border-radius: 12px;"
>`},
  {id:"image-size",title:"Image sizing",group:"Links & media",summary:"CSS can control an image's width while keeping its proportions.",code:`<img
  src="https://picsum.photos/400/240"
  alt="Example photograph"
  style="width: 220px; max-width: 100%; height: auto;"
>`},
  {id:"video",title:"Video",group:"Links & media",summary:"video can play a video file directly on the page.",code:`<video controls width="320" style="max-width:100%;">
  <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" type="video/mp4">
</video>`},
  {id:"link-card",title:"Clickable cards",group:"Links & media",summary:"A link can wrap other elements to make a whole card clickable.",code:`<a href="https://www.nasa.gov/" target="_blank" style="display:block; padding:18px; border:1px solid #ccc; border-radius:12px; color:inherit; text-decoration:none;">
  <strong>Explore NASA</strong>
  <p style="margin-bottom:0;">The whole card is a link.</p>
</a>`},

  {id:"header-main-footer",title:"Page structure",group:"Structure",summary:"header, main, section, and footer describe the major parts of a webpage.",code:`<header>
  <h1>School Newspaper</h1>
</header>

<main>
  <section>
    <h2>Top story</h2>
    <p>This is the main content.</p>
  </section>
</main>

<footer>Made by our class</footer>`},
  {id:"nav",title:"Navigation",group:"Structure",summary:"nav groups links that help visitors move around a site.",code:`<nav style="display:flex; gap:16px;">
  <a href="#home">Home</a>
  <a href="#projects">Projects</a>
  <a href="#about">About</a>
</nav>`},
  {id:"details",title:"Expandable details",group:"Structure",summary:"details creates a section the visitor can open and close.",code:`<details>
  <summary>Click to reveal a clue</summary>
  <p>The answer was hiding here.</p>
</details>`},
  {id:"table",title:"Tables",group:"Structure",summary:"Tables organize information into rows and columns.",code:`<table border="1" cellpadding="8" style="border-collapse:collapse;">
  <tr>
    <th>Game</th>
    <th>Score</th>
  </tr>
  <tr>
    <td>Round 1</td>
    <td>12</td>
  </tr>
  <tr>
    <td>Round 2</td>
    <td>18</td>
  </tr>
</table>`},

  {id:"text-input",title:"Text input",group:"Forms",summary:"input lets a visitor type information into the page.",code:`<label>
  Your name
  <input type="text" placeholder="Type here">
</label>`},
  {id:"textarea",title:"Text area",group:"Forms",summary:"textarea gives the visitor a larger place to type.",code:`<label for="idea">Your idea</label><br>
<textarea id="idea" rows="4" cols="28" placeholder="Write something..."></textarea>`},
  {id:"select",title:"Dropdown menu",group:"Forms",summary:"select creates a menu of choices.",code:`<label>
  Choose a difficulty:
  <select>
    <option>Beginner</option>
    <option>Medium</option>
    <option>Hard</option>
  </select>
</label>`},
  {id:"checkbox",title:"Checkboxes",group:"Forms",summary:"Checkboxes let visitors turn options on or off.",code:`<label><input type="checkbox"> Music</label><br>
<label><input type="checkbox"> Sound effects</label><br>
<label><input type="checkbox"> Hints</label>`},

  {id:"color",title:"Text & background color",group:"CSS basics",summary:"color changes text. background changes the area behind it.",code:`<div style="background: #e1efed; color: #0f5057; padding: 18px; border-radius: 12px;">
  <h2 style="margin-top:0;">Color changes the feeling.</h2>
  <p style="margin-bottom:0;">Both colors are controlled with CSS.</p>
</div>`},
  {id:"font-size",title:"Font size",group:"CSS basics",summary:"font-size controls how large text appears.",code:`<p style="font-size: 14px;">Small text</p>
<p style="font-size: 22px;">Medium text</p>
<p style="font-size: 36px; font-weight:800;">Big text</p>`},
  {id:"spacing",title:"Margin & padding",group:"CSS basics",summary:"Padding adds space inside an element. Margin adds space around it.",code:`<div style="background:#eee; padding:24px;">
  This box has <strong>padding</strong> inside it.
</div>

<div style="margin-top:24px; border:2px solid teal; padding:10px;">
  The gap above this box is <strong>margin</strong>.
</div>`},
  {id:"border-radius",title:"Borders & rounded corners",group:"CSS basics",summary:"border draws an edge. border-radius rounds the corners.",code:`<div style="border:3px solid #176b73; border-radius:18px; padding:20px;">
  Rounded card
</div>`},
  {id:"class",title:"CSS classes",group:"CSS basics",summary:"A class lets one CSS rule style several HTML elements.",code:`<style>
  .highlight {
    background: gold;
    padding: 4px 8px;
    border-radius: 6px;
  }
</style>

<p>Classes can style <span class="highlight">this</span>...</p>
<p>...and <span class="highlight">this too</span>.</p>`},
  {id:"hover",title:"Hover effects",group:"CSS basics",summary:"The :hover selector changes an element while the pointer is over it.",code:`<style>
  .hover-button {
    background: #176b73;
    color: white;
    border: 0;
    padding: 12px 18px;
    border-radius: 10px;
  }
  .hover-button:hover {
    transform: translateY(-2px);
    background: #0f5057;
  }
</style>

<button class="hover-button">Hover over me</button>`},

  {id:"flex-row",title:"Flexbox row",group:"Layout",summary:"display:flex places items next to each other and makes spacing easier.",code:`<div style="display:flex; gap:12px;">
  <div style="background:#e1efed; padding:18px; flex:1;">One</div>
  <div style="background:#f5e6df; padding:18px; flex:1;">Two</div>
  <div style="background:#eee; padding:18px; flex:1;">Three</div>
</div>`},
  {id:"flex-center",title:"Center with flexbox",group:"Layout",summary:"Flexbox can center something horizontally and vertically.",code:`<div style="height:180px; display:flex; align-items:center; justify-content:center; background:#eee;">
  <button>Perfectly centered</button>
</div>`},
  {id:"grid",title:"CSS grid",group:"Layout",summary:"Grid makes rows and columns for cards, galleries, and dashboards.",code:`<div style="display:grid; grid-template-columns:repeat(2,1fr); gap:12px;">
  <div style="background:#e1efed; padding:22px;">A</div>
  <div style="background:#f5e6df; padding:22px;">B</div>
  <div style="background:#eee; padding:22px;">C</div>
  <div style="background:#e8e4da; padding:22px;">D</div>
</div>`},
  {id:"responsive",title:"Responsive width",group:"Layout",summary:"max-width keeps content readable and lets it shrink on smaller screens.",code:`<div style="width:90%; max-width:520px; margin:auto; padding:20px; background:#e1efed; border-radius:14px;">
  Resize the preview. This box can shrink, but it never gets wider than 520px.
</div>`}
];