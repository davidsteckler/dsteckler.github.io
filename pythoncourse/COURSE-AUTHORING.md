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

A lesson step should usually have:
- a short action label
- one clear title
- a brief explanation
- exactly what the student should do
- one useful observation or debugging hint
- an optional small code example

Avoid steps where students type a large block of code before anything changes on screen.

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
