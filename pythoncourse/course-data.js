window.PYTHON_COURSE = {
  title: "Python Turtle",
  subtitle: "Make one. Solve one. Create one.",
  units: [
    {
      id: "unit-1",
      number: "1",
      title: "Turtle Basics",
      description: "Each skill follows the same rhythm: make one with guidance, solve one with less help, then create one of your own.",
      lessons: [
        {
          id: "1-1-make-path",
          number: "1.1",
          title: "Make a Path",
          type: "Make",
          available: true,
          notes: "Introduce forward/backward and left/right. Conference by asking students to point to the line causing a visible change. Keep emphasis on run-after-small-change.",
          starter: "forward(80)\nleft(90)\nforward(80)",
          steps: [
            {title:"Run the working starter.",body:"Start by seeing the whole program work before changing anything.",task:"Press Run once.",tip:"The turtle starts in the center facing right."},
            {title:"Test the first distance.",body:"Change only the first forward(80) to forward(140).",task:"Run again and watch which segment becomes longer.",tip:"Only one number changed, so only one part of the drawing should change."},
            {title:"Test the turn.",body:"Put the first distance back to 80. Change left(90) to left(45).",task:"Run and compare the new corner with the original.",tip:"The number inside left() is the angle in degrees."},
            {title:"Add one turn.",body:"Add right(90) on a new line at the bottom.",task:"Run. The turtle should turn, but no new segment should appear yet.",tip:"Turning changes direction without moving."},
            {title:"Use the new direction.",body:"Add forward(50) below your new turn.",task:"Run and watch the new segment appear.",tip:"A movement uses whatever direction the turtle is facing at that moment."},
            {title:"Try backward movement.",body:"Add backward(30) on a new line.",task:"Run and see how backward() behaves without changing direction first.",tip:"Backward movement does not automatically turn the turtle around."},
            {title:"Build one more corner.",body:"Add one turn and one movement of your choice.",task:"Run after each new line so the program stays working.",tip:"Small working changes are easier to debug than a large block added all at once."},
            {title:"Finish your path.",body:"You now have enough commands to make a small route.",task:"Leave a working program with at least four visible segments and at least two turns.",tip:"There is no target picture for this last step."}
          ]
        },
        {
          id: "1-2-solve-route",
          number: "1.2",
          title: "Route Puzzle",
          type: "Solve",
          available: true,
          notes: "First real reduction in scaffolding. Do not give the closing sequence. If stuck, ask what side is missing and which existing distance matches it.",
          starter: "forward(90)\nleft(90)\nforward(50)\nleft(90)\nforward(90)",
          steps: [
            {title:"Run the route.",body:"The starter draws three sides of a shape.",task:"Press Run and study the unfinished drawing.",tip:"Look at where the turtle is and which direction it faces at the end."},
            {title:"Close the shape.",body:"Do not change the existing five lines.",task:"Add as little code as you can to make the turtle return to its starting point.",tip:"The missing side is the same length as one of the existing sides."},
            {title:"Change the challenge.",body:"Now change both forward(90) commands to forward(120).",task:"Repair your added code so the shape closes again.",tip:"Which distance controls the side that has to match?" },
            {title:"Make the turtle finish facing right.",body:"The drawing must stay closed.",task:"Add or change only a turn so the turtle finishes facing the same direction it started.",tip:"A turn at the end changes direction without changing the drawing."},
            {title:"Solve it a different way.",body:"Reset the lesson, then try the original puzzle again.",task:"Find a second working solution that still closes the shape.",tip:"More than one sequence of turns and movements can reach the same final state."}
          ]
        },
        {
          id: "1-3-create-route",
          number: "1.3",
          title: "Route Designer",
          type: "Create",
          available: true,
          notes: "Check requirements rather than appearance. Students should choose the route. Encourage clean runs and explain only when conferencing.",
          starter: "# Build your route below\n",
          steps: [
            {title:"Meet the requirements.",body:"Your route needs at least five visible segments, at least one left turn, at least one right turn, and two different movement distances.",task:"Write the first two commands and run them.",tip:"Start small. You do not need to know the final picture yet."},
            {title:"Keep building.",body:"Add commands until you have at least five visible segments.",task:"Run after every one or two new lines.",tip:"If the path leaves the screen, shorten a distance rather than starting over."},
            {title:"Make the route recognizably yours.",body:"Change at least two numbers so your route does not resemble the starter from 1.1.",task:"Run the full program.",tip:"The requirements describe what the code must contain, not what the final picture must look like."},
            {title:"Test from a clean start.",body:"A finished program should work when run from the beginning.",task:"Press Clear Run, then Run once.",tip:"If the clean run looks different from what you expected, inspect the first place the route goes wrong."}
          ]
        },

        {
          id: "1-4-make-bubbles",
          number: "1.4",
          title: "Make a Bubble Trail",
          type: "Make",
          available: true,
          notes: "Teach circle radius separately from movement distance. Keep placement language concrete: move first, then draw.",
          starter: "circle(25)\nforward(45)\ncircle(35)",
          steps: [
            {title:"Run two bubbles.",body:"The starter already draws two circles with a move between them.",task:"Press Run once.",tip:"circle() draws from the turtle's current position."},
            {title:"Change only the first bubble.",body:"Change circle(25) to circle(50).",task:"Run and confirm that the second bubble stays the same size.",tip:"The number inside circle() is its radius."},
            {title:"Restore the first bubble.",body:"Put circle(25) back.",task:"Run again so you are back at the starting version.",tip:"Returning to a known version helps when testing one idea at a time."},
            {title:"Change the spacing.",body:"Change forward(45) to forward(80).",task:"Run and watch the gap change without changing either circle size.",tip:"Movement controls where the next drawing begins."},
            {title:"Add a third bubble.",body:"Add another forward command and another circle command.",task:"Run after the move, then run again after the circle.",tip:"Place first, draw second."},
            {title:"Make the trail bend.",body:"Add a small turn before the move to your third bubble.",task:"Run and make the third bubble leave the straight row.",tip:"The turn has to happen before the movement it should affect."},
            {title:"Add a fourth bubble.",body:"Continue the pattern with one more move and circle.",task:"Use a new radius for the fourth bubble.",tip:"You can repeat the structure while changing the numbers."},
            {title:"Finish the trail.",body:"Adjust one size, one distance, or one angle.",task:"Leave four visible bubbles arranged in a clear pattern.",tip:"The pattern can grow, shrink, repeat, or curve."}
          ]
        },
        {
          id: "1-5-solve-bubbles",
          number: "1.5",
          title: "Bubble Pattern Puzzle",
          type: "Solve",
          available: true,
          notes: "Let students find the broken spacing value before opening the hint. Focus on comparing repeated parameters.",
          starter: "circle(20)\nforward(40)\ncircle(30)\nforward(70)\ncircle(40)\nforward(40)\ncircle(50)",
          steps: [
            {title:"Find what breaks the pattern.",body:"This program is supposed to make bubbles that grow by 10 while the gaps stay equal.",task:"Run it. Fix the one value that breaks the spacing pattern.",tip:"Compare the forward() values, not the circle() values."},
            {title:"Make the bubbles shrink instead.",body:"Keep all four gaps equal.",task:"Change only the circle radii so the bubbles go from largest to smallest.",tip:"There are four circle() commands."},
            {title:"Curve the whole pattern.",body:"Keep the sizes decreasing and the gaps equal.",task:"Add turns so the four bubbles follow a smooth bend.",tip:"Try the same small turn before each movement first."},
            {title:"Solve with fewer edits.",body:"Reset the lesson.",task:"Create a visibly curved bubble trail while changing no more than four lines of the starter.",tip:"A good solution changes the lines that have the most effect."},
            {title:"Leave one clean solution.",body:"Choose whichever version you prefer.",task:"Run from a clean start and keep all four bubbles visible.",tip:"The final code should satisfy the pattern without needing an exact target image."}
          ]
        },
        {
          id: "1-6-create-bubbles",
          number: "1.6",
          title: "Bubble Design",
          type: "Create",
          available: true,
          notes: "Open-ended application of circle, movement, and turning. Assess whether requirements are met, not whether drawings look alike.",
          starter: "# Make an original bubble design\n",
          steps: [
            {title:"Start with one working bubble.",body:"Your final design needs at least five circles, at least three different radii, and at least one change of direction.",task:"Write code for the first circle and run it.",tip:"A project is still easier when the smallest piece works first."},
            {title:"Build the structure.",body:"Add movement and more circles until you have at least three visible bubbles.",task:"Run often enough that you always know which new lines caused a change.",tip:"You can use repeated code for now. Loops come later."},
            {title:"Meet the full requirements.",body:"Reach at least five circles and three different radii.",task:"Add at least one left() or right() that changes the direction of the pattern.",tip:"The requirements leave the final arrangement open."},
            {title:"Revise one weak part.",body:"Look for crowding, overlap, or a gap that feels accidental.",task:"Change one number to improve the design, then run again.",tip:"Revision should have a visible reason."},
            {title:"Test the finished design.",body:"The program should work from the top without manual setup.",task:"Press Clear Run, then Run once.",tip:"Keep the version that produces your intended design from a clean start."}
          ]
        },

        {
          id: "1-7-make-sequence",
          number: "1.7",
          title: "Make Sense of Sequence",
          type: "Make",
          available: true,
          notes: "Use Step heavily here. The goal is seeing that each line inherits the turtle's current position and direction.",
          starter: "forward(60)\nleft(90)\nforward(30)\nright(90)\nforward(20)",
          steps: [
            {title:"Use Step for line 1.",body:"Instead of running everything at once, execute the program one statement at a time.",task:"Press Step once.",tip:"The first command should move the turtle to the right."},
            {title:"Step through the turn.",body:"The next statement is left(90).",task:"Press Step once more and watch the turtle change direction without adding a segment.",tip:"Program state can change even when the drawing does not."},
            {title:"Use the new direction.",body:"The next movement uses the direction created by the turn.",task:"Press Step again.",tip:"Each line starts from the state left by the line before it."},
            {title:"Finish one line at a time.",body:"Two statements remain.",task:"Press Step twice more to finish the program.",tip:"Watch the direction before the last forward() runs."},
            {title:"Compare Step with Run.",body:"Both controls execute the same program.",task:"Press Clear Run, then Run once. The finished drawing should match.",tip:"Step changes how you observe execution, not what the program means."},
            {title:"Change the middle distance.",body:"Change forward(30) to forward(80).",task:"Clear the run and Step until the edited line executes.",tip:"The first two statements should behave exactly as before."},
            {title:"Change the order.",body:"Move right(90) above forward(80).",task:"Press Run and see how changing sequence changes the picture.",tip:"The values stayed the same; their order changed."},
            {title:"Restore a working sequence.",body:"Arrange the five commands into a version you like.",task:"Run from a clean start and leave a complete visible drawing.",tip:"Sequence determines when each command acts on the turtle's current state."}
          ]
        },
        {
          id: "1-8-solve-debug",
          number: "1.8",
          title: "Debug Challenge",
          type: "Solve",
          available: true,
          notes: "Have students fix one error at a time and rerun. Distinguish syntax/name errors from a program that runs but does the wrong thing.",
          starter: "forword(70)\nleft(90\nforward(40)\nrite(90)\nforward(70)",
          steps: [
            {title:"Get the program to run.",body:"This five-line program has several typing and syntax mistakes.",task:"Press Run. Fix errors one at a time until the program executes.",tip:"Run again after every fix so the next error becomes easier to isolate."},
            {title:"Make the route symmetric.",body:"Once the code runs, look at the three visible segments.",task:"Change one distance so the first and last segments are the same length.",tip:"This is now a logic problem, not a syntax problem."},
            {title:"Make both turns opposite.",body:"The finished route should turn left once and right once.",task:"Fix the turn commands if needed without adding new lines.",tip:"A valid command can still be the wrong command for the goal."},
            {title:"Break it on purpose.",body:"Create one NameError yourself by misspelling a command.",task:"Run, read the error, then repair it.",tip:"Recognizing an error is easier after you have created the same kind deliberately."},
            {title:"Leave a clean solution.",body:"All five lines should be valid and the drawing should be symmetric.",task:"Clear Run, then Run once.",tip:"The final test should produce no error message."}
          ]
        },
        {
          id: "1-9-create-five-lines",
          number: "1.9",
          title: "Five-Line Drawing",
          type: "Create",
          available: true,
          notes: "Constraint challenge. Do not suggest a target image. The five-command limit forces students to choose commands intentionally.",
          starter: "# You get exactly five drawing commands\n",
          steps: [
            {title:"Read the constraint.",body:"Create a recognizable or interesting mark using exactly five Turtle commands. Comments do not count.",task:"Write your first command and run it.",tip:"You may use movement, turns, or circle()."},
            {title:"Build within the limit.",body:"You only get five commands total.",task:"Add commands until you reach five. Run after each addition.",tip:"Every line has to earn its place."},
            {title:"Revise instead of adding.",body:"Once you have five commands, you cannot add a sixth.",task:"Change numbers or replace commands to improve the drawing.",tip:"Constraints force you to make stronger choices."},
            {title:"Test the final five lines.",body:"The drawing should work from a clean start.",task:"Press Clear Run, then Run once.",tip:"Keep exactly five executable Turtle commands."}
          ]
        },

        {
          id: "1-10-make-color",
          number: "1.10",
          title: "Make a Color Study",
          type: "Make",
          available: true,
          notes: "Teach bgcolor, color, and pensize as state-setting commands. Change one visual property at a time.",
          starter: "bgcolor(\"midnightblue\")\ncolor(\"gold\")\npensize(4)\nforward(100)\nleft(90)\nforward(100)",
          steps: [
            {title:"Run the styled path.",body:"The first three lines change appearance before the turtle moves.",task:"Press Run once.",tip:"bgcolor(), color(), and pensize() affect later drawing."},
            {title:"Change only the pen color.",body:"Replace gold with another named color.",task:"Run and keep the background and line thickness unchanged.",tip:"Color names go inside quotation marks."},
            {title:"Change only the background.",body:"Choose another named color for bgcolor().",task:"Run and make sure the drawing remains easy to see.",tip:"Foreground and background need enough contrast."},
            {title:"Change line thickness.",body:"Change pensize(4) to another whole number.",task:"Run and compare the line weight.",tip:"pensize() changes appearance without changing the route."},
            {title:"Use two drawing colors.",body:"Add another color() command between the two forward commands.",task:"Run so the two segments have different colors.",tip:"A setting affects the commands that come after it."},
            {title:"Add a colored circle.",body:"Change color again, then add circle(30).",task:"Run and keep the circle visible with the existing path.",tip:"The circle uses the current pen color."},
            {title:"Move and draw in a fourth color.",body:"Add a turn, a move, and one more color change.",task:"Run and create another visible part of the drawing.",tip:"You are combining appearance commands with the movement commands from earlier lessons."},
            {title:"Finish the study.",body:"Choose the background, colors, and line thickness you want to keep.",task:"Run the complete program from a clean start.",tip:"There is no required final image."}
          ]
        },
        {
          id: "1-11-solve-style",
          number: "1.11",
          title: "Color Rescue",
          type: "Solve",
          available: true,
          notes: "Students should diagnose visibility and ordering problems. Avoid naming the exact fix unless they use the hint.",
          starter: "bgcolor(\"navy\")\ncolor(\"navy\")\npensize(1)\nforward(100)\nleft(90)\ncolor(\"yellow\")\nforward(100)\ncircle(30)",
          steps: [
            {title:"Find the invisible segment.",body:"The program runs, but part of the drawing disappears into the background.",task:"Run it and change one value so the first segment becomes visible.",tip:"The first pen color currently matches the background."},
            {title:"Improve the line weight.",body:"The drawing should be easy to see without becoming extremely thick.",task:"Choose a new pensize() value and run again.",tip:"Try a small whole number greater than 1."},
            {title:"Give the circle its own color.",body:"Keep the two path segments in their current colors.",task:"Add one color() command so the circle uses a third visible color.",tip:"Place the color change immediately before the command you want it to affect."},
            {title:"Keep every element readable.",body:"You may change the background once more if needed.",task:"Run from a clean start with both segments and the circle clearly visible.",tip:"Solve the visibility problem without changing the movement distances or turn angle."},
            {title:"Make one alternate solution.",body:"Reset the lesson and solve the same visibility requirements using different colors.",task:"Leave the alternate version working.",tip:"The requirements can have many correct visual solutions."}
          ]
        },
        {
          id: "1-12-create-night",
          number: "1.12",
          title: "Night Signals",
          type: "Create",
          available: true,
          notes: "Unit project. Conference around requirements, revision, and intentional choices. Final products should vary widely.",
          starter: "# Unit 1 project\n# Build your Night Signals design below\n",
          steps: [
            {title:"Read the project requirements.",body:"Your finished design needs at least six visible drawn elements, movement and turns, at least three circles, at least three drawing colors, a background color, and more than one pensize().",task:"Write the first small piece and run it.",tip:"An element can be a line segment or a circle."},
            {title:"Build a working foundation.",body:"Create two or three visible elements before worrying about the whole composition.",task:"Run after each small addition.",tip:"A project grows more reliably from working checkpoints."},
            {title:"Develop the design.",body:"Continue until you meet the circle, color, and movement requirements.",task:"Use turns and distances to place elements without copying a target image.",tip:"You decide whether the design is orderly, scattered, curved, symmetrical, or something else."},
            {title:"Add visual hierarchy.",body:"Use at least two different line thicknesses and three drawing colors.",task:"Run and make sure important elements remain visible against the background.",tip:"Use style changes deliberately rather than changing every line."},
            {title:"Check every requirement.",body:"Do not add code just to make the program longer.",task:"Run from a clean start and verify the six-element, circle, color, background, movement, turn, and pensize requirements.",tip:"If a requirement is missing, add the smallest change that satisfies it."},
            {title:"Revise one part.",body:"Choose one area that feels crowded, empty, or accidental.",task:"Change one distance, angle, radius, color, or pensize and run again.",tip:"Revision should improve something you can actually see."},
            {title:"Final clean run.",body:"Leave only the code you want in the finished project.",task:"Press Clear Run, then Run once and make sure there are no errors.",tip:"The final drawing should be yours. There is no reference picture to match."}
          ]
        }
      ]
    },

    {
      id: "unit-2",
      number: "2",
      title: "Loops + Repetition",
      description: "Build repeated code first, solve repetition problems, then create with loops.",
      lessons: [
        {id:"2-1-make-loop",number:"2.1",title:"Make a Loop",type:"Make",available:false},
        {id:"2-2-solve-loop",number:"2.2",title:"Loop Puzzle",type:"Solve",available:false},
        {id:"2-3-create-loop",number:"2.3",title:"Loop Design",type:"Create",available:false},
        {id:"2-4-make-shapes",number:"2.4",title:"Make Shapes with Loops",type:"Make",available:false},
        {id:"2-5-solve-pattern",number:"2.5",title:"Pattern Puzzle",type:"Solve",available:false},
        {id:"2-6-create-pattern",number:"2.6",title:"Pattern Project",type:"Create",available:false}
      ]
    },
    {
      id: "unit-3",
      number: "3",
      title: "Functions",
      description: "Turn working drawing code into reusable commands, then use functions independently.",
      lessons: [
        {id:"3-1-make-function",number:"3.1",title:"Make a Function",type:"Make",available:false},
        {id:"3-2-solve-function",number:"3.2",title:"Function Puzzle",type:"Solve",available:false},
        {id:"3-3-create-function",number:"3.3",title:"Function Design",type:"Create",available:false},
        {id:"3-4-make-parameters",number:"3.4",title:"Make Parameters",type:"Make",available:false},
        {id:"3-5-solve-parameters",number:"3.5",title:"Parameter Puzzle",type:"Solve",available:false},
        {id:"3-6-create-parameters",number:"3.6",title:"Reusable Drawing Project",type:"Create",available:false}
      ]
    },
    {
      id: "unit-4",
      number: "4",
      title: "Position + Design",
      description: "Move without drawing, place shapes, and combine ideas into larger scenes.",
      lessons: [
        {id:"4-1-make-position",number:"4.1",title:"Make Positioned Shapes",type:"Make",available:false},
        {id:"4-2-solve-position",number:"4.2",title:"Position Puzzle",type:"Solve",available:false},
        {id:"4-3-create-scene",number:"4.3",title:"Scene Design",type:"Create",available:false}
      ]
    }
  ]
};