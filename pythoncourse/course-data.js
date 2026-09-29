window.PYTHON_COURSE = {
  title: "Python Turtle",
  subtitle: "Build it. Run it. Change it.",
  units: [
    {
      id: "unit-1",
      number: "1",
      title: "Turtle Basics",
      description: "Learn how Turtle moves, read short programs, trace execution, debug mistakes, and build a small original drawing.",
      lessons: [
        {
          id: "1-1-first-path",
          number: "1.1",
          title: "Your First Path",
          type: "Lesson",
          available: true,
          starter: "forward(80)\nleft(90)\nforward(80)",
          steps: [
            {label:"Step 1",title:"Run the starter exactly as written.",body:"Start by seeing the entire program work. The turtle begins in the center facing right.",task:"Press Run and watch all three lines execute.",tip:"You should see two straight segments with one turn between them."},
            {label:"Step 2",title:"Isolate the last movement.",body:"Put # at the start of line 3 so Python skips that line, then run the program.",task:"Run with line 3 commented out. Remove the # and run again.",tip:"Commenting out one line is a quick way to see exactly what that line adds."},
            {label:"Step 3",title:"Change only the first distance.",body:"Edit the first forward(80) to forward(140). Leave the other two lines alone.",task:"Run again and identify exactly which segment changed.",tip:"Changing one value makes cause and effect easier to see."},
            {label:"Step 4",title:"Change the turn.",body:"Change left(90) to left(45).",task:"Run again and compare the new angle with the original corner.",tip:"The number inside left() is an angle in degrees."},
            {label:"Step 5",title:"Add a third segment.",body:"Keep the program you have. Add one turn and one forward command at the bottom.",task:"Run after adding the turn, then run again after adding the movement.",tip:"Do not type a whole drawing before testing it."},
            {label:"Step 6",title:"Try moving backward.",body:"Add backward(40) on a new line.",task:"Run it and watch how backward() uses the turtle's current direction.",tip:"Backward movement does not automatically turn the turtle around."},
            {label:"Step 7",title:"Build a path with four segments.",body:"Use forward(), backward(), left(), or right() to extend your program.",task:"Create a four-segment path that is visibly different from the starter.",tip:"There is no single correct picture."},
            {label:"Step 8",title:"Finish with a clean working version.",body:"Make one final movement change and one final turn change.",task:"Run the full program from the top and leave it in a working state.",tip:"Your final path should be visibly different from the starter."}
          ]
        },
        {
          id: "1-2-bubble-trail",
          number: "1.2",
          title: "Bubble Trail",
          type: "Example",
          available: true,
          starter: "circle(25)\nforward(45)\ncircle(35)\nforward(55)\ncircle(45)",
          steps: [
            {label:"Step 1",title:"Run the complete example.",body:"Run the program without editing it. Watch where each circle is drawn and how the turtle moves between them.",task:"Press Run once and observe the whole picture.",tip:"The program already works. Your job is to figure out why."},
            {label:"Step 2",title:"Read the first two lines together.",body:"The first line draws a circle. The second line moves the turtle before the next circle.",task:"Find the first bubble and the first gap in the picture.",tip:"circle() and forward() control different parts of the pattern."},
            {label:"Step 3",title:"Test the first circle size.",body:"Change circle(25) to circle(50). Do not change anything else.",task:"Run and confirm that only the first bubble gets larger.",tip:"The number inside circle() is the radius."},
            {label:"Step 4",title:"Put the first circle back.",body:"Restore circle(25). Then change forward(45) to forward(80).",task:"Run and identify which spacing changed.",tip:"Restoring the original value gives you a clean comparison."},
            {label:"Step 5",title:"Change only the middle bubble.",body:"Restore forward(45). Change circle(35) to a new radius.",task:"Make the middle bubble clearly larger or smaller than the other two.",tip:"Keep the other circle values unchanged."},
            {label:"Step 6",title:"Add a fourth bubble.",body:"Add a forward command and another circle command at the bottom.",task:"Choose your own spacing and radius, then run.",tip:"Add the movement first and run before adding the circle."},
            {label:"Step 7",title:"Make the trail bend.",body:"Add a small left() or right() turn before your fourth bubble.",task:"Make the fourth bubble leave the straight horizontal line.",tip:"The turn must happen before the movement you want it to affect."},
            {label:"Step 8",title:"Finish the pattern.",body:"Adjust one size, one distance, or one angle so the four bubbles follow a visible pattern.",task:"Run the completed trail and leave all four bubbles visible.",tip:"The pattern can grow, shrink, repeat, or curve."}
          ]
        },
        {
          id: "1-3-predict",
          number: "1.3",
          title: "Step Through the Turtle",
          type: "Practice",
          available: true,
          starter: "forward(70)\nright(90)\nforward(40)",
          steps: [
            {label:"Step 1",title:"Use Step instead of Run.",body:"The Step button executes one Python statement at a time.",task:"Press Step once. Watch only the first forward(70) happen.",tip:"Do not press Run yet. We are following the program one line at a time."},
            {label:"Step 2",title:"Execute the turn by itself.",body:"Press Step again. The next command changes direction without adding a new segment.",task:"Press Step once and watch the turtle rotate.",tip:"The drawing does not need to change for the program state to change."},
            {label:"Step 3",title:"Execute the final movement.",body:"The third line uses the direction created by right(90).",task:"Press Step again and watch the final forward(40) segment appear.",tip:"The movement uses whatever direction the turtle is facing at that moment."},
            {label:"Step 4",title:"Reverse the turn.",body:"Change right(90) to left(90).",task:"Press Run and compare the new path with the original.",tip:"Keep both forward distances unchanged so the turn is the only change."},
            {label:"Step 5",title:"Change the second distance.",body:"Keep left(90). Change forward(40) to forward(100).",task:"Press Run and confirm that only the second segment changes length.",tip:"A later command cannot change a segment that was already drawn."},
            {label:"Step 6",title:"Add another turn.",body:"Add right(90) at the bottom.",task:"Run and notice that the turtle's direction changes even though no new line is drawn yet.",tip:"A turn changes state even when it leaves no mark."},
            {label:"Step 7",title:"Use that new direction.",body:"Add forward(50) after the new turn.",task:"Press Run and watch the new segment use the direction from the line above it.",tip:"A turn followed by a movement works as a pair."},
            {label:"Step 8",title:"Make your own step-through test.",body:"Change one angle and one distance, then clear the run.",task:"Use Step to execute the edited program one line at a time.",tip:"Watch each command change either position, direction, or both."}
          ]
        },
        {
          id: "1-4-stretch-path",
          number: "1.4",
          title: "Stretch the Path",
          type: "Exercise",
          available: true,
          starter: "circle(30)\nforward(35)\ncircle(30)\nforward(35)\ncircle(30)",
          steps: [
            {label:"Step 1",title:"Run the repeated starter.",body:"The same circle size and same gap are used more than once.",task:"Press Run once, then change the first circle(30) to circle(45) and run again.",tip:"Changing one repeated value shows which part of the picture it controls."},
            {label:"Step 2",title:"Double the spacing.",body:"Change both forward(35) commands to forward(70).",task:"Run and keep every circle at radius 30.",tip:"You are changing spacing without changing size."},
            {label:"Step 3",title:"Make the circles grow.",body:"Change the three circle values so each circle is larger than the one before it.",task:"Run after each edit.",tip:"Use simple whole numbers that are easy to compare."},
            {label:"Step 4",title:"Make the distances grow too.",body:"Use two different forward distances, with the second one larger than the first.",task:"Run and compare the size pattern with the spacing pattern.",tip:"Different parameters can follow the same idea."},
            {label:"Step 5",title:"Add a turn before the last move.",body:"Insert a left() or right() command before the second forward command.",task:"Make the final circle leave the straight row.",tip:"Where you place the turn in the sequence matters."},
            {label:"Step 6",title:"Add a fourth circle.",body:"Extend the program with another move and circle.",task:"Continue either the size pattern or the spacing pattern.",tip:"Your new values should make sense with the pattern you chose."},
            {label:"Step 7",title:"Change one thing that breaks the pattern.",body:"Intentionally make one value inconsistent.",task:"Run it and identify the part of the picture that now looks out of place.",tip:"Breaking a pattern can make the pattern easier to notice."},
            {label:"Step 8",title:"Repair the pattern.",body:"Fix the inconsistent value so the pattern is regular again.",task:"Run the final version and leave every circle visible.",tip:"The code values should now follow the same pattern as the picture."}
          ]
        },
        {
          id: "1-5-trace-moves",
          number: "1.5",
          title: "Trace with Step",
          type: "Practice",
          available: true,
          starter: "forward(60)\nleft(90)\nforward(30)\nright(90)\nforward(20)",
          steps: [
            {label:"Step 1",title:"Start from a clean run.",body:"Clear the run so the turtle is back at the center facing right.",task:"Press Clear Run, then press Step once.",tip:"Step lets you trace the program without needing a separate worksheet."},
            {label:"Step 2",title:"Watch line 1 change position.",body:"The first Step executed forward(60).",task:"Look at the turtle's new location, then press Step again to execute left(90).",tip:"The first command moves. The second command turns."},
            {label:"Step 3",title:"Watch a turn without movement.",body:"After left(90), the turtle stays in the same place but faces a new direction.",task:"Press Step again to execute forward(30).",tip:"A command can change direction even when the drawing does not get longer."},
            {label:"Step 4",title:"Watch the new direction affect movement.",body:"forward(30) follows the direction created by the previous turn.",task:"Press Step again to execute right(90).",tip:"The program carries its current direction from one line to the next."},
            {label:"Step 5",title:"Finish the program one line at a time.",body:"You have one turn and one movement left.",task:"Press Step once for right(90), then once more for forward(20).",tip:"Do not use Run yet."},
            {label:"Step 6",title:"Compare Step with Run.",body:"Clear the run and execute the same program with Run.",task:"Press Clear Run, then Run. The finished drawing should match the one you built line by line.",tip:"Step and Run execute the same code at different speeds."},
            {label:"Step 7",title:"Change one line and step through again.",body:"Change forward(30) to forward(80), then clear the run.",task:"Use Step until the edited forward(80) executes.",tip:"The first two commands behave exactly as before."},
            {label:"Step 8",title:"Finish the edited program.",body:"Continue stepping until the program ends.",task:"Then Clear Run and press Run once to confirm the same final drawing appears.",tip:"You have now traced the program using the actual execution controls."}
          ]
        },
        {
          id: "1-6-predict-run-explain",
          number: "1.6",
          title: "Sequence Lab",
          type: "Practice",
          available: true,
          starter: "forward(50)\nleft(90)\ncircle(20)\nright(90)\nforward(50)",
          steps: [
            {label:"Step 1",title:"Run the original sequence.",body:"Start by seeing the five-line program work exactly as written.",task:"Press Run once.",tip:"You will change the order next, so first see the original result."},
            {label:"Step 2",title:"Move the circle to the end.",body:"Cut circle(20) from line 3 and paste it below the final forward(50).",task:"Press Run and watch where the circle is drawn now.",tip:"The circle command is unchanged. Only its place in the sequence moved."},
            {label:"Step 3",title:"Isolate the circle.",body:"Temporarily add # at the start of the other four command lines.",task:"Run only circle(20).",tip:"Commenting out lines lets you test one part without deleting code."},
            {label:"Step 4",title:"Restore the program.",body:"Remove the # characters so all five lines run again.",task:"Run and confirm the original drawing returns.",tip:"Always restore the starting condition after an experiment."},
            {label:"Step 5",title:"Move the circle command.",body:"Move circle(20) to the bottom of the program.",task:"Run and compare the new drawing with the original.",tip:"The same commands in a different order can make a different result."},
            {label:"Step 6",title:"Move the circle one more time.",body:"Place circle(20) directly after the first forward(50).",task:"Press Run and compare its new location with the previous two versions.",tip:"The same circle command uses whatever position and direction exist when it runs."},
            {label:"Step 7",title:"Move a turn command.",body:"Move one 90-degree turn to a different place without changing the angle.",task:"Press Run and watch how the later movement changes.",tip:"Change command order, not command values."},
            {label:"Step 8",title:"Create your own final sequence.",body:"Arrange the five original commands into any order that produces a clear visible drawing.",task:"Press Run and leave the program in a working state.",tip:"Use only the original five commands. Change their order, not their values."}
          ]
        },
        {
          id: "1-7-bubble-chain",
          number: "1.7",
          title: "Bubble Chain Challenge",
          type: "Challenge",
          available: true,
          starter: "circle(20)\nforward(35)",
          steps: [
            {label:"Step 1",title:"Run the smallest working piece.",body:"The starter draws one bubble and moves to a new starting point.",task:"Run it before adding anything.",tip:"Challenges are easier when the smallest piece works first."},
            {label:"Step 2",title:"Make a second bubble.",body:"Add another circle command after the move.",task:"Run and make sure two circles appear.",tip:"Do not add the third bubble yet."},
            {label:"Step 3",title:"Move again.",body:"Add another forward command after the second circle.",task:"Run and verify the turtle reaches a third starting position.",tip:"The new move should happen after the second circle."},
            {label:"Step 4",title:"Make a third bubble.",body:"Add another circle command.",task:"Run and confirm you now have three bubbles.",tip:"You now have a repeated two-command idea."},
            {label:"Step 5",title:"Make the bubbles grow.",body:"Use three different radii from smallest to largest.",task:"Run after changing each radius.",tip:"Keep the movement distances the same while testing size."},
            {label:"Step 6",title:"Make the chain curve.",body:"Add a small turn after each move.",task:"Run and make the bubbles travel in a curve.",tip:"Use the same angle first so the effect is easy to see."},
            {label:"Step 7",title:"Add a fourth bubble.",body:"Continue your pattern with another move, optional turn, and circle.",task:"Make the fourth bubble fit the pattern.",tip:"Run after each small addition."},
            {label:"Step 8",title:"Finish without copying a target picture.",body:"Adjust size, spacing, and turning until the chain looks intentional.",task:"Run the final program and keep four visible bubbles with a clear pattern.",tip:"The challenge has requirements, not one exact answer."}
          ]
        },
        {
          id: "1-8-color-lab",
          number: "1.8",
          title: "Color Lab",
          type: "Exercise",
          available: true,
          starter: "bgcolor(\"midnightblue\")\ncolor(\"gold\")\npensize(4)\nforward(100)\nleft(90)\nforward(100)",
          steps: [
            {label:"Step 1",title:"Run the starter, then change one setting.",body:"The first three lines control appearance before movement begins.",task:"Press Run, then change color(\"gold\") to another named color and run again.",tip:"Only the drawing color should change."},
            {label:"Step 2",title:"Change only the pen color.",body:"Replace gold with another named color.",task:"Run while leaving the background and pensize unchanged.",tip:"Color names belong inside quotation marks."},
            {label:"Step 3",title:"Change only the background.",body:"Choose a different bgcolor() value.",task:"Run and make sure the drawing remains easy to see.",tip:"Contrast matters."},
            {label:"Step 4",title:"Change only line thickness.",body:"Change pensize(4) to another whole number.",task:"Run and compare the visual weight of the path.",tip:"pensize() changes appearance without changing movement."},
            {label:"Step 5",title:"Use two pen colors in one drawing.",body:"Add a second color() command between the two forward commands.",task:"Run and make the two segments different colors.",tip:"A setting affects the commands that come after it."},
            {label:"Step 6",title:"Add a circle in a third color.",body:"Change color again, then add circle(30).",task:"Press Run and keep the new circle visible without deleting the existing path.",tip:"The circle begins from the turtle's current position."},
            {label:"Step 7",title:"Move before drawing another shape.",body:"Use a turn and forward command before adding another circle.",task:"Keep the new shape separated from the first one.",tip:"Use movement to place a drawing instead of guessing a coordinate."},
            {label:"Step 8",title:"Create a readable color study.",body:"Choose a final background, at least three drawing colors, and a line thickness.",task:"Make a small composition where every element is easy to see.",tip:"Your choices should be visible in both the code and the output."}
          ]
        },
        {
          id: "1-9-night-signals",
          number: "1.9",
          title: "Night Signals",
          type: "Mini Project",
          available: true,
          starter: "bgcolor(\"black\")\ncolor(\"cyan\")\npensize(3)\ncircle(25)\nforward(60)",
          steps: [
            {label:"Step 1",title:"Run the project seed.",body:"You already have a background, a pen color, a circle, and a move.",task:"Press Run, then change cyan to another bright color and run again.",tip:"The project begins from a small working checkpoint."},
            {label:"Step 2",title:"Create a second signal.",body:"Change the pen color and draw a second circle.",task:"Use a different radius from the first circle.",tip:"Run immediately after adding the second circle."},
            {label:"Step 3",title:"Move to a third location.",body:"Add a turn and a forward command.",task:"Run before drawing anything else.",tip:"First place the turtle. Then draw."},
            {label:"Step 4",title:"Create a third signal.",body:"Choose another color and draw another circle.",task:"Make all three signals visibly different.",tip:"Difference can come from color, size, or both."},
            {label:"Step 5",title:"Add a connecting path.",body:"Use movement commands to draw a deliberate line between two parts of the design.",task:"Run and decide whether the connection helps the composition.",tip:"Not every move needs penup(). A visible path can be part of the design."},
            {label:"Step 6",title:"Add one more visual setting.",body:"Change pensize() somewhere later in the program.",task:"Use at least two line thicknesses in the final image.",tip:"Settings can change midway through a program."},
            {label:"Step 7",title:"Add a fourth signal.",body:"Place and draw one more circle.",task:"Do not use exact coordinates. Get there with movement and turns.",tip:"This keeps the project focused on Unit 1 skills."},
            {label:"Step 8",title:"Revise one awkward part.",body:"Look for a section that is too crowded, too far apart, or hard to see.",task:"Change one distance, angle, size, or color to improve it.",tip:"Revision means changing code for a visible reason."},
            {label:"Step 9",title:"Check the project requirements.",body:"Your program should use movement, turning, circles, color, a background, and more than one visual setting.",task:"Run the final version from the top and make sure every line still works.",tip:"The finished picture can be different for every student."}
          ]
        },
        {
          id: "1-10-fix-path",
          number: "1.10",
          title: "Fix the Turtle",
          type: "Debugging",
          available: true,
          starter: "forword(80)\nleft(90)\nforward(80",
          steps: [
            {label:"Step 1",title:"Run the broken program first.",body:"Do not fix anything before seeing the error.",task:"Press Run and read the first message.",tip:"The computer can only reach errors in the code it has successfully read so far."},
            {label:"Step 2",title:"Fix the misspelled command.",body:"The first line contains a command name Python does not recognize.",task:"Change forword to forward, then press Run again.",tip:"A NameError often points to a misspelled name."},
            {label:"Step 3",title:"Fix only that spelling.",body:"Change forword to forward.",task:"Run again before changing anything else.",tip:"One fix may reveal the next error."},
            {label:"Step 4",title:"Fix the unfinished command.",body:"The final forward command is missing punctuation.",task:"Add the missing closing parenthesis, then press Run.",tip:"Punctuation is part of Python syntax."},
            {label:"Step 5",title:"Close the command.",body:"Add the missing closing parenthesis.",task:"Run again and confirm the program finally draws.",tip:"A ParseError often means Python could not understand the structure of the code."},
            {label:"Step 6",title:"Create your own NameError.",body:"Intentionally misspell left as lefft.",task:"Run, read the message, then repair the spelling.",tip:"Creating an error on purpose makes its pattern easier to recognize later."},
            {label:"Step 7",title:"Create your own ParseError.",body:"Remove one closing parenthesis from a forward command.",task:"Run, read the message, then put the parenthesis back.",tip:"Always return the code to a working state before moving on."},
            {label:"Step 8",title:"Finish with a clean test.",body:"Change one distance to a new whole number.",task:"Run once more and confirm the program behaves normally.",tip:"A final successful run verifies that the debugging is actually finished."}
          ]
        }
      ]
    },
    {
      id: "unit-2",
      number: "2",
      title: "Loops + Repetition",
      description: "Turn working repeated code into shorter programs.",
      lessons: [
        {id:"2-1-spot-repeat",number:"2.1",title:"Spot the Repeated Chunk",type:"Lesson",available:false},
        {id:"2-2-first-loop",number:"2.2",title:"Your First Loop",type:"Lesson",available:false},
        {id:"2-3-shapes",number:"2.3",title:"Shapes with Loops",type:"Exercise",available:false},
        {id:"2-4-patterns",number:"2.4",title:"Pattern Lab",type:"Practice",available:false},
        {id:"2-5-loop-debug",number:"2.5",title:"Debug a Loop",type:"Debugging",available:false},
        {id:"2-6-challenge",number:"2.6",title:"Loop Challenge",type:"Challenge",available:false}
      ]
    },
    {
      id: "unit-3",
      number: "3",
      title: "Functions",
      description: "Turn working drawing code into reusable commands.",
      lessons: [
        {id:"3-1-why-functions",number:"3.1",title:"Why Make a Function?",type:"Lesson",available:false},
        {id:"3-2-first-function",number:"3.2",title:"Your First Function",type:"Lesson",available:false},
        {id:"3-3-parameters",number:"3.3",title:"Parameters",type:"Lesson",available:false},
        {id:"3-4-function-practice",number:"3.4",title:"Function Practice",type:"Exercise",available:false},
        {id:"3-5-project",number:"3.5",title:"Reusable Drawing Project",type:"Project",available:false}
      ]
    },
    {
      id: "unit-4",
      number: "4",
      title: "Position + Design",
      description: "Move without drawing, place shapes, and combine ideas into larger scenes.",
      lessons: [
        {id:"4-1-penup",number:"4.1",title:"Move Without Drawing",type:"Lesson",available:false},
        {id:"4-2-position",number:"4.2",title:"Position on the Grid",type:"Lesson",available:false},
        {id:"4-3-coordinates",number:"4.3",title:"Coordinates When They Help",type:"Lesson",available:false},
        {id:"4-4-design",number:"4.4",title:"Build a Scene",type:"Project",available:false}
      ]
    }
  ]
};