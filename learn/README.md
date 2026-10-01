# Student learning home

`/learn/` is the student entry point. The public homepage and course overview both link here.

The home connects David's four principles with existing lessons: **Focus your energy, Guard your time, Train your mind, Think for yourself.** The classroom practice loop is **Try → Run → Notice → Adjust**. Keep these distinct: the four principles guide how students work; the loop describes an attempt.

## Addresses

| Student address | Existing page |
| --- | --- |
| `/learn/` | Student home |
| `/learn/python/` | `/pythoncourse/` |
| `/learn/binary/` | `/binary1.html` and the connected sequence |
| `/learn/think/` | `/class2.html` |
| `/learn/projects/` | `/turtleprojects/` |
| `/learn/trails/` | `/turtlereference/trails/` |
| `/learn/reference/` | `/turtlereference/` |
| `/learn/colors/` | `/turtlereference/#color/hex` |
| `/learn/trace/` | `/tracetable/` |
| `/learn/create/` | `/turtle/` |
| `/learn/blackbox/` | `/blackboxintro.html` |
| `/learn/ascii/` | `/asciiart.html` |
| `/learn/timeline/` | `/timeline/` |
| `/learn/languages/` | `/TIOBE.html` |
| `/learn/code/` | `/python/` |
| `/learn/habits/` | `/learn/#habits` |
| `/learn/challenges/` | `/learn/#challenges` |

Aliases retain query parameters and fragments; they do not duplicate apps or change their code storage keys. Existing bookmarks still work.

## Shared navigation and notes

Standalone learning pages include `student-nav.css` and `student-nav.js`, with `data-student-area` and (for full-screen apps) `data-student-layout` on the body. The shared script skips iframes and embed/preview query modes. It must never shrink an embedded editor by adding a second header.

For a page with multiple activities, set `window.LEARNING_ACTIVITY = {id,title,url}` and dispatch `new CustomEvent('learning-activity',{detail:window.LEARNING_ACTIVITY})` when the activity changes. Set it even if the navigation script has not loaded yet. IDs must remain stable. URLs must be on the same origin.

Notes use `dsteckler-thinking-v1:ACTIVITY_ID` in localStorage; the recent activity uses `dsteckler-learning-recent-v1`. They are local to this browser, with a text download for notes. The home reads the course's existing completion data. Visits never imply completion. No account, class reporting, or cross-device synchronization is implemented.

`home.js` contains the curated activity list and search/category filtering. Add only working lessons; label future course units as coming next.

## Check

Run `node learn/test-learning-home.mjs`. Optionally set `BROWSER_EXECUTABLE`, `TURTLE_TEST_DEPS` (cached CodeMirror/Skulpt), and `LEARNING_HOME_PROOF` (screenshots). The test starts its own server. It checks navigation, drafts, history, progress, notebook isolation, redirects, and desktop/mobile layouts. The shared workflow also exercises the existing reference and tutorial programs.
