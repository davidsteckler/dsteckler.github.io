(function () {
  'use strict';
  // Each friendly URL supplies its original gallery ID on the script tag.
  // Load one shared tutorial so improvements work across every project.
  var launcher = document.currentScript;
  var projectId = launcher && launcher.dataset.project;
  if (!projectId) return;
  var root = new URL('./', launcher.src).pathname;
  fetch(root + 'project.html', {cache:'no-cache'})
    .then(function(response) {
      if (!response.ok) throw new Error('Tutorial template unavailable');
      return response.text();
    })
    .then(function(html) {
      if (!html.includes('<head>')) throw new Error('Tutorial template has changed');
      // Keep relative CSS, JavaScript, gallery links, and embedded editor at /turtleprojects/.
      var head = '<head><base href="' + root + '">' +
        '<script>window.TURTLE_TUTORIAL_ID=' + JSON.stringify(projectId) + ';<' + '/script>';
      document.open();
      document.write(html.replace('<head>', head));
      document.close();
    })
    .catch(function() {
      var direct = root + 'project.html?id=' + encodeURIComponent(projectId);
      var link = document.createElement('a');
      link.href = direct;
      link.textContent = 'Open this tutorial';
      document.body.replaceChildren(document.createTextNode('The tutorial could not load. '), link);
    });
})();
