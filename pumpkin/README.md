# Pumpkin Studio

`/pumpkin/` provides a ten-step cumulative Python Turtle lesson and 48 runnable variations with matching drawing previews.

- `index.html`, `styles.css`, and `app.js` provide the lesson, gallery, and editor controls.
- The live editor is `/turtle/?embed=reference&pumpkin=1`, using `TurtleWorkbench` and `TraceTurtleEmbed`. Changes to steps do not replace the student's tutorial code. **Load & run this step** explicitly loads the reference program and saves the previous version.
- Tutorial work and each gallery design have separate browser-local drafts. Saved versions retain the latest 30 distinct checkpoints. Completion checkboxes are separate from execution.
- This page adapts the embedded drawing context's filled shapes to `source-over`, so filled eyes, hats, and patterns layer over the pumpkin body. The separate `/turtle/` page is unaffected.
- `build.py` contains the authored programs and a Turtle recorder. Running `python pumpkin/build.py` from the repository root rebuilds `data.json` and every SVG in `previews/`. It executes all 58 programs and checks their bounds against the 400 × 400 world.
- Keep gallery previews and lesson code in sync by regenerating them together. All programs use commands supported by the existing editor, with no `import turtle` line.

Validation for the initial version executed all 58 programs through the source of `/turtle/`'s Skulpt/canvas runtime. Every rendered drawing matched its SVG preview with a mean RGB difference below 3/255. Interaction checks covered filtering/search, draft preservation, explicit checkpoint loading, history restore, speed controls, deep links, and reload persistence. Full browser layout verification was unavailable in the managed environment.
