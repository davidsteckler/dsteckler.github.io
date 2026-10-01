# Turtle lesson authoring

A checkpoint is a complete working program. The lesson files store reversible line edits between those programs; a step may add, replace, or remove code.

- Begin with a visible mark or a recognizable piece.
- Test one example before repeating it. When repetition is useful, replace the working copies with a loop.
- Introduce a function after its drawing code has been tried. Include a call in the same checkpoint.
- Introduce helpers when the project needs them. Omit unused helpers.
- For recursive work, draw the smallest piece, exercise the stopping case, and increase the depth before drawing the full pattern.
- Give each checkpoint an instruction, explanation, expected result, prediction, answer, and practical help.
- A rewrite may intentionally keep the same picture. Say so. Never make a definition-only or setup-only checkpoint.
- Keep the student's editor independent from the reference. Navigating steps must not overwrite student work.

`lessons_authored.py` contains the paced introductory lessons. `lesson_builder.py` handles the remaining catalog, including direct shape trials, loop rewrites, curve sampling, and function calls. It keeps the finished gallery drawings while removing unused definitions.

Run `python turtleprojects/build-tutorial-steps.py` after changing lesson sources or the catalog. This writes `lessons/*.json` and the small `tutorial-steps.js` manifest. Keep the friendly routes and legacy redirects intact. If an authored lesson changes its finished picture, synchronize its gallery program too.

Validation:

```
python turtleprojects/test-learning.py
node turtleprojects/test-learning.mjs
```

The Python check executes every checkpoint and verifies that every newly introduced function is called immediately. The browser check executes every distinct checkpoint in the actual Skulpt/canvas runtime and rejects errors and drawings without ink. `test-tutorial.mjs` checks navigation, references, student-code preservation, previews, and the resizing handles.

## Difficulty and drawing design

The gallery opens on the 12 movement-first Beginner projects in `lessons_starters.py`. These deliberately use named colors, whole numbers, and short lines. They introduce a visible example before its loop. There are no coordinate lists in this sequence. Their order is part of the authored curriculum.

Medium projects combine loops, functions, and positioned shapes. Hard projects include detailed coordinate work, nested loops, mathematical curves, or recursion. `build-project-catalog.py` derives the other labels and skill descriptions from the programs. Review these labels when a project changes substantially. The original robot tutorial remains available as a first function lesson.

`project_art.py` keeps readable sources for repaired drawings. Use whole-number dimensions, shared centers, connected silhouettes, and arcs wherever practical. Review the actual Turtle output at thumbnail size. The gallery and lesson must produce the same finished drawing; both now read the shared catalog.

Rebuild after editing art or a starter lesson:

```
python turtleprojects/build-project-catalog.py
node turtleprojects/build-tutorial-routes.cjs
python turtleprojects/build-tutorial-steps.py
```

For a drawing iteration, `build-tutorial-steps.py --only curatedE17,starter-first-square` rebuilds those lessons and preserves the rest. Before publishing, also run `test-project-catalog.py` and `test-project-levels.mjs`. They check gallery/tutorial agreement, Beginner code constraints, difficulty and search filters, labels, and mobile loading without involuntary scrolling.

## Quick run and the command reference

Clicking a gallery picture or its Quick run button opens the finished program in the same page and runs it. Keep that action separate from the Open tutorial link. Gallery / Quick run switches preserve the editor, difficulty, subject, and search. A shared quick-run URL can use `?view=run&project=starter-first-square&level=Beginner`.

`/turtlereference/` uses the same editor through the tutorial embed protocol. Its authored topics live in `turtlereference/reference-data.js` and `reference-more.js`. Every topic has a complete runnable program, expected result, suggested change, and relevant help. Keep examples compatible with the site's actual Turtle API. Document desktop-only behavior in the desktop topic. Previous/Next follows the sidebar's group order. Diagram markers should identify the turtle or a labeled point rather than resemble an interactive play control.

### Runnable example choices

Every reference topic and creative trail stop has several choices in the same page. `turtlereference/reference-examples.js` and `reference-trail-examples.js` author these variations. Keep the first program unchanged so existing saved work remains compatible. Each additional choice needs a distinct complete program, a descriptive label, an observation, an expected result, and a small experiment. Change one idea at a time where possible; let the learner see its effect before combining ideas. A circle topic, for example, compares radius, extent, direction, and polygon sides in separate choices.

Use `focus` strings to highlight meaningful changes in the code and syntax, and `focusParam` to identify the relevant parameter description. Supply `syntax`, `visual`, `output`, and `watchFor` overrides when the original explanation no longer fits. Text and ASCII examples use `output:'ascii'`; add `assertOutput` checks for significant printed results. Callback examples may provide a `previewCall` and a preview note to show what happens after interaction. Input examples use `auto:false` so they run when the learner asks.

The first example keeps the existing `#topic` link and draft key. Variations use `#topic/example`; each has independent saved edits and Reset affects only the selected choice. Browser history, direct links, search, arrow keys, and the example navigation buttons all select the same state. Topic Previous/Next still moves between topics or trail stops. On phones, one shared chooser remains visible in both Reference and Code views.

The `color()` topic includes a hex color viewer. Exploring the picker or entering a hex value changes its preview; **Use color & run** updates the first actual `color()` call and runs the student's program. Preserve other code, later color calls, undo history, and the example's saved draft. If the program has no color call, insert one at the start. The short addresses `/colors/` and `/reference/` lead to the color example and full reference; both are linked from the homepage.

Build preview images and text from actual runtime output after changing any example program:

```
node turtlereference/build-example-previews.mjs
node turtlereference/test-reference.mjs
```

Commit `example-previews.js` and `example-previews.webp` with their sources. The test checks the source hash of every preview, runs every example in the actual Python/canvas runtime, and verifies independent drafts, reset, parameter highlights, shared links, keyboard navigation, and the mobile chooser. Review screenshots as well: passing bounds checks alone does not establish that a selected card or drawing looks complete.

Run `node turtlereference/test-reference.mjs` after changing quick run or the reference. It checks the editor workflow, example execution, callbacks, saved drafts, navigation, resizing, and mobile layouts.

## Creative trails and the pleasure of making things

`turtlereference/reference-trails.js` holds the short, cumulative trails linked from `/turtlereference/trails/`. Every stop is a standalone runnable program, with a visible result, a specific observation, and an experiment. Give a trail as many stops as its ideas need. A pixel project should test one square and one row before rendering the full map. Introduce a function only after its body has produced a working result.

Treat the journey and small details as part of the teaching. A character can wink; a found item can have a name; a collected coin should stay collected. Choose details that reveal code behavior, such as state, branching, layering, or reuse. Keep enough room for students to invent their own details. Do not add timers, streaks, or artificial urgency.

ASCII and text art are a recurring medium, not a one-off novelty. Use creatures, inventories, maps, signs, meters, borders, and little scenes to make strings, loops, lists, and state visible. Monospace output must preserve spaces and remain readable on phones. True ASCII uses ordinary keyboard characters; identify Unicode blocks as an optional variation. The reference expands Text Output for ASCII stops and restores the canvas for drawing stops. Avoid hand-entered coordinate grids when relative movement, a small character map, or one spacing rule can express the idea.

Trail difficulty labels are Beginner, Medium, and Hard. Completion is a learner-controlled checklist, stored separately from code drafts; opening or running an example never claims mastery. Previous/Next stays inside the current trail. The hub resumes at the first unchecked stop. Runtime tests verify the expected printed art as well as code execution. Build the two drawing previews from actual runtime output with `BUILD_TRAIL_PREVIEWS=1 node turtlereference/test-reference.mjs` when their finished drawings change.
