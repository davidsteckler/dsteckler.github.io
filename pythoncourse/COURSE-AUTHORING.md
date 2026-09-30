# Python course authoring

The course lives at `/pythoncourse/`. Keep the lesson page usable in one desktop viewport: course map on the left, the current instruction in the middle, and the live Turtle editor/output on the right.

## Teaching sequence

Build lessons around visible checkpoints.

1. Start from code that already runs and makes a visible mark.
2. Ask the student to run it before editing.
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
  minutes: 10,
  available: true,
  starter: "forward(80)",
  steps: [
    {
      label: "Run",
      title: "Run the working version.",
      body: "Run it before changing anything.",
      task: "Press Run and watch the turtle.",
      tip: "Notice where the turtle starts."
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

The course page stores:
- lesson completion in `dsteckler-pythoncourse-progress-v1`
- current lesson step in `dsteckler-pythoncourse-step-LESSON_ID`
- lesson code in `dsteckler-pythoncourse-LESSON_ID`

The Reset code button clears only the current lesson's saved code and reloads its starter code.

## Layout rule

Desktop should remain a three-column learning workspace without document scrolling. Individual columns may scroll internally when necessary.

Mobile switches between Lesson and Editor + Output so the student is not forced to work inside three squeezed columns.

## Next useful additions

Automatic checks should be added lesson-by-lesson only when the check is meaningful. Good checks include whether required commands exist, whether a loop runs the intended number of times, whether code runs without an error, and whether a student-defined function is called. Do not grade exact coordinates when several drawings can correctly satisfy the task.
