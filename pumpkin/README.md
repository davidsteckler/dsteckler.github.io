# Pumpkin Studio

`/pumpkin/` provides ten Python Turtle checkpoints and 48 runnable variations for seventh graders.

- Each student program defines its functions first. The drawing then uses explicit pen movement, positions, headings, colors, and small shape functions.
- Examples use ordinary Turtle commands, single `for i in range(number)` loops, and at most one simple variable or a single `size` parameter. There are no lists, indexing, conditionals, nested loops, coordinate formulas, or generic multi-argument shape helpers.
- The tutorial starts by making `triangle()` and `small_triangle()`. Students then draw the body, stem, left eye, right eye, nose, and teeth in that order.
- `build.py` authors all student code and uses a Turtle recorder to regenerate `data.json` and matching SVG previews. Run `python pumpkin/build.py` from the repository root. It executes all 58 programs, checks their bounds in the 400 × 400 world, and checks the beginner Python vocabulary.
- Pattern and scene examples keep repetition visible. The goofy face introduces one explained `size` parameter; the spiral introduces one changing `size` variable.
- The live editor remains `/turtle/?embed=reference&pumpkin=1`. Lesson navigation preserves a student's current work. Loading an example saves the previous code in Saved versions.
- `legacy-hashes.json` identifies unedited references from the previous curriculum. On the first visit to the new version, those drafts update to the simplified code and their earlier code is checkpointed. Edited student drafts remain in place.
- Tutorial work and each design keep separate browser-local drafts and the latest 30 distinct checkpoints. Completion checkboxes are separate from execution.
- Filled shapes use the embedded canvas's `source-over` adaptation so eyes and decorations layer above the body. The standalone Turtle page is unaffected.
