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
