# Python course authoring

The course lives at `/pythoncourse/`. Keep the lesson page usable in one desktop viewport: a horizontal activity strip above the current instruction and live Turtle editor/output. The complete course map opens with **All lessons**. On mobile, the activity strip stays visible above the Lessons / Lesson / Editor tabs.

## Teaching sequence

Build lessons around visible checkpoints.

1. Open a blank editor and show a short numbered example that the student types. Working examples should make a visible mark or printed result; a debugging lesson can deliberately begin with an error.
2. Ask the student to run after each new drawing or movement command before editing the example.
3. Change one thing and run again.
4. Repeat working code before introducing a loop.
5. Turn working drawing code into a function only after the student has seen that code work.
6. When a function is introduced, call it in the same step.
7. Use coordinates when they solve a real placement problem. Do not make beginners type long coordinate lists just to reproduce a drawing.
8. Keep instructions short enough that the student can look back at the editor without losing the task.
9. Do not ask students to "describe," "explain," "say," "write," or "point to" an answer unless the page provides a real place to submit it.
10. Prediction activities need a real interaction: use Step, a selectable answer, or a response field. Do not leave an unrecorded thinking prompt as the main task.
11. Every visible "Do this" instruction should result in an action the student can complete on the page: edit code, run code, step through code, reset, or use a purpose-built question control.

A lesson step should usually have:

- a short title
- one brief teaching sentence when the student needs it
- one direct action
- an optional hidden hint

Student-facing text should be minimal. Do not restate the title in the body, and do not wrap the action in labels such as "Do this." If the action itself teaches the idea, omit extra explanation.

Teacher-only notes belong on the lesson object as a `notes` field. They can include instructional intent, misconceptions to watch for, conferencing questions, and editing reminders. They are hidden from students and appear only in teacher mode with `?teacher=1`.

## Learning pattern: Make → Solve → Create

New concepts should usually appear as a three-activity cycle.

**Make** is the most scaffolded. Start with working code, change one thing at a time, run constantly, and reveal what each command controls. End each Make lesson with a concrete mini-challenge: name the thing to build, give 3–5 objective requirements, and show 2–3 small visual examples of the kind of result without giving the solution code. Visuals are inspiration, not a reference image students must copy.

**Solve** removes instructions. Give a clear target, constraints, or a broken/unfinished program. Students should have to decide which command or value to change. Hints stay optional and hidden until opened.

**Create** gives requirements instead of a recipe. Start with a blank or minimal file, define what the final program must include, and let the student choose the code and visual result.

Use the text output as a creative medium too. ASCII / block art with `print()` is valuable because students get an immediate visual payoff from very little syntax. Revisit it later when loops, variables, and functions can make the art more powerful; do not treat it as a one-off novelty.

The amount of scaffolding should deliberately decrease from Make to Solve to Create. A challenge should not simply restate the solution as a sequence of steps.

## Adding lessons

Course structure and lesson text are stored in `pythoncourse/course-data.js`.

Each available lesson needs:

```js
{
  id: "1-5-example",
  number: "1.5",
  title: "Example",
  type: "Lesson",
  available: true,
  starter: "",
  draftVersion: "unit1-v4",
  contentVersion: "unit1-v4",
  purpose: "Separate distance from direction before planning repeated routes.",
  steps: [
    {
      id: "1-5-example-type",
      phase: "Type the example",
      draftId: "example",
      title: "Type the example.",
      body: "The turtle starts facing right.",
      task: "Type line 1 and Run.",
      example: "forward(80)",
      numbered: true,
      focusLines: [1]
    }
  ]
}
```

Set `available: false` for a future lesson that should appear in the course map but cannot be opened yet.

## Final code checks

Every completable lesson should define a lesson-specific `check.rules` array. The final button becomes **Check my code**. The embedded Turtle editor runs the student's actual program first; a program with an error cannot pass.

Checks should validate the lesson requirements without demanding one exact solution. Prefer constraints such as minimum command counts, required command types, distinct values, pattern relationships, or final Turtle state. Create activities should accept many different correct programs.

Do not check subjective qualities such as whether a drawing is "good," "balanced," or "interesting." Convert those into objective requirements only when that serves the learning goal.

A failed check should tell the student what requirement is still missing without supplying the exact code. Each rule should also have a short student-facing `label` so the checker can render a live requirements checklist with the student's current value and the target. The checker should show progress visually (for example, 3 of 4 requirements met) and a clear success state when every requirement passes.

## Editor integration

The course loads the existing editor with:

```
/turtle/?embed=course&lesson=LESSON_ID&code=STARTER_CODE
```

The Turtle page stores student code separately for each lesson using the lesson ID. It does not overwrite the student's normal `/turtle/` sandbox code.

The revised unit stores:
- lesson completion in `dsteckler-pythoncourse-progress-v3-unit1`
- current lesson step in `dsteckler-pythoncourse-step-unit1-v4-LESSON_ID`
- each draft in `dsteckler-pythoncourse-LESSON_ID-unit1-v4-DRAFT_ID`
- responses in `dsteckler-pythoncourse-responses-v1-LESSON_ID-unit1-v4`

Earlier drafts, response records, and completion records stay in their original keys. A curriculum revision uses new version keys so an obsolete starter or passed requirement cannot be confused with the revised assignment. The student home reads the revised progress key when it exists, falling back to the earlier records before the revised course has been opened.

The Reset code button clears only the current lesson's saved code and reloads its starter code.

## Layout rule

Desktop should remain a three-column learning workspace without document scrolling. Individual columns may scroll internally when necessary.

Mobile switches between Lesson and Editor + Output so the student is not forced to work inside three squeezed columns.

## Next useful additions

Automatic checks should be added lesson-by-lesson only when the check is meaningful. Good checks include whether required commands exist, whether a loop runs the intended number of times, whether code runs without an error, and whether a student-defined function is called. Do not grade exact coordinates when several drawings can correctly satisfy the task.

## Student home and four habits

The student entry point is `/learn/`; `/learn/python/` opens this course. Include the shared `/learn/student-nav.css` and `/learn/student-nav.js` on new standalone learning pages. Embedded editors automatically omit this navigation. Keep the four principles visible through the shared navigation: focus your energy, guard your time, train your mind, think for yourself.

The **My thinking** notebook provides a place to record a goal, a distraction to put aside, an attempt and observation, and evidence for a decision. It saves per activity in this browser. Course changes dispatch `learning-activity` with a stable `id`, friendly `title`, and same-origin `url`; keep these identities stable when renaming lessons. The home reads existing course completion data and the most recently visited learning activity. It never marks an activity complete from a visit.

Keep activity navigation separate from checkpoint navigation. Changing an activity preserves its code, checkpoint, and notebook. Do not add forced notebook completion before students can use the editor.

## Understanding and independent experiments

Unit 1 keeps its 15 Make / Solve / Create activities. Each includes two checked predictions, a fixed assignment, a saved observation, and a creative project. Route Puzzle also has two guided checks; ASCII Dashboard includes a cumulative signal-beacon repair. All code checkpoints must pass before the creative draft opens. Understanding checks must pass before final completion. Evidence responses save for discussion and remain ungraded.

Steps can include these fields:

- `id`: stable step identity; required for isolated experiments and saved responses.
- `draftId`: `example` for controlled edits, `prediction-SLUG` for an isolated running example, `assignment-SLUG` for a required task, and `project` for the blank creative draft. Navigation restores each draft.
- `lab`: the prediction program or the numbered starting program for an assignment. `typed: true` makes the assignment start empty even when `lab` contains code.
- `question`: `{id,prompt,choices,answer,explanation}`. `answer` is the zero-based correct choice. Checking saves the first prediction and runs the example. A revised, correct answer is labeled “Corrected prediction.” The first answer remains available for comparison. Changing a selection clears its checked status.
- `check`: the step’s code rules. Passing a step never completes the whole lesson.
- `requirements`: short, visible descriptions of every graded condition.
- `visuals`: previews for a fixed assignment or an independent project. Fixed previews represent the required result; creative previews give possible designs. Drawing previews with `previewCode` must match that program and pass the corresponding project rules.
- `response`: `{id,prompt,placeholder}` for a saved observation. Give the student a precise change, comparison, or error to record. Keep notes in the lesson tab.
- `outputMode: "text"` on a lesson enlarges printed output and hides the unused Turtle grid. `editorOutput: "drawing"` on a mixed step restores the grid.

Responses are separate from the optional four-step notebook. A successful final code check validates the independent project.

Teach a command before asking students to explain its behavior. Keep working examples short and isolate one property at a time. Use an unfamiliar target to test whether students can transfer the idea. Do not turn experiments into more copy-the-solution steps.

Run `node pythoncourse/test-unit-one.mjs` to check the revised unit with real CodeMirror and Skulpt. It checks all assignment solutions, the creative preview programs, the prediction programs, incorrect-result cases, saved drafts and notes, gated navigation, feedback, target placement, and mobile layout. Set `BROWSER_EXECUTABLE` for a custom Chromium binary. Set `UNIT_TEST_MODULES` to an installed node_modules directory with Playwright, CodeMirror, and Skulpt to use local dependencies. `UNIT_TEST_UI_ONLY=1` checks only the interface flows. `UNIT_TEST_FULL_FLOW=1` also completes every lesson through the visible controls.


## Typed examples and assignment order

Every available lesson opens with a blank example editor. Students type the numbered example and run after each command. Give exact line numbers for edits and additions, and set `focusLines` on guided steps to highlight those lines in the live editor. Keep command line numbers accurate against the current example; identify insertions before a command when preceding edits can shift its line.

Each lesson needs a student-facing `purpose` explaining the command understanding and its connection to later loops, variables, functions, or parameters. Follow the typed example with controlled changes and checked predictions. Finish with a fixed required assignment (`check` on a separate draft), then a choice assignment with objective requirements. Fixed assignments show the required result. Creative assignments show possible ideas with a caption explaining that the listed requirements govern the check. `typed: true` starts an isolated draft empty; `example` and `numbered: true` display starting code to type. Preserve student drafts when navigating. Final completion requires the required assignment and understanding checks to pass.

Line instructions belong in a separate strip above CodeMirror. Only line backgrounds belong inside the code. Target coordinates and persistent success messages belong outside the drawing canvas. Clear results when the step or its code changes. A failed check must display the failed rule’s repair guidance; a passed check needs a prominent status near the controls and an unambiguous button state.

Validate visible effects, not unused command names. Style rules inspect the color and width used by actual strokes. Circle-placement rules inspect their starting points. Text rules compare the actual Python output, including spaces and row order. The first unit uses one literal command per line, with comments allowed; that constraint makes its simple trace reliable. Loops, variables, and functions will need execution-based checks when introduced.

This order supersedes earlier guidance to begin with prefilled code or offer choice during the guided example.

## Unit 2: loops and repetition

`unit-two-data.js` fills the six reserved Unit 2 slots after `course-data.js` loads. It keeps stable lesson IDs and isolated `loops-v1` drafts. Lessons cover block repetition, indentation, ASCII textures, polygon closure, nested rosettes, and an independent pattern project. Each opens empty, has two checked predictions, a saved observation, a required result, and a blank creative draft with exact program-backed previews.

Unit 2 checks set `execution: true`: the course editor reports the commands actually executed by the Turtle runtime, including repeated calls. Unit 1 continues to use its existing literal-source checks. Loop syntax checks accept literal `range()` counts of 2–60 and direct literal commands; later units will extend this language for variables and functions. Drawing checks use executed strokes and final state, while text checks use actual Python output. Required rosettes also check distinct shape orientations; circle flowers check distinct centers.

Run `node pythoncourse/test-unit-two.mjs` with `UNIT_TEST_MODULES` pointing to dependencies containing Skulpt. This command-line check executes assignment solutions, creative preview programs, and predictions with real Python semantics and checks incorrect outputs, indentation errors, unrolled solutions, and JavaScript syntax. It does not replace browser layout QA.
