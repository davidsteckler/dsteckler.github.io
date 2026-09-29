window.PYTHON_COURSE = {
  title: "Python Turtle",
  subtitle: "Build it. Run it. Change it.",
  units: [
    {
      id: "unit-1",
      number: "1",
      title: "Turtle Basics",
      description: "Learn the world, read short programs, trace what happens, then make your own.",
      lessons: [
        {
          id: "1-1-first-path",
          number: "1.1",
          title: "Your First Path",
          type: "Lesson",
          minutes: 9,
          available: true,
          starter: "forward(80)\nleft(90)\nforward(80)",
          steps: [
            {label:"Run",title:"Run it before touching anything.",body:"Start by seeing the whole program work. The turtle begins in the center facing right.",task:"Press Run and watch all three lines execute.",tip:"Every lesson starts from something that already works."},
            {label:"Find",title:"Find the command that turns.",body:"Look at the three lines. Two move the turtle. One changes its direction.",task:"Identify the line that makes the corner.",tip:"forward() changes position. left() changes direction."},
            {label:"Change",title:"Change one distance.",body:"Change only the first 80 to 140 and run the program again.",task:"Watch which part of the path gets longer.",tip:"One change at a time makes the result easier to explain."},
            {label:"Turn",title:"Change the angle.",body:"Change left(90) to left(45). Leave the distances alone.",task:"Run it and compare the new corner to the original.",tip:"The number inside left() is the number of degrees to turn."},
            {label:"Build",title:"Add a third segment.",body:"Add another turn and another forward command at the bottom.",task:"Make a path with three straight segments.",tip:"Run after each new line instead of typing a whole drawing first."}
          ]
        },
        {
          id: "1-2-bubble-trail",
          number: "1.2",
          title: "Bubble Trail",
          type: "Example",
          minutes: 10,
          available: true,
          starter: "circle(25)\nforward(45)\ncircle(35)\nforward(55)\ncircle(45)",
          steps: [
            {label:"Run",title:"Read the picture first.",body:"Run the example exactly as written. Watch what circle() does and what forward() does between the circles.",task:"Press Run. Do not edit yet.",tip:"The turtle draws a circle from its current position, then keeps going."},
            {label:"Match",title:"Match code to the drawing.",body:"Look at the first two lines and watch the first bubble and the move that follows it.",task:"Find the line that controls the first bubble size and the line that controls the first gap.",tip:"Different commands control size and spacing."},
            {label:"Change",title:"Make only the middle bubble bigger.",body:"Change circle(35) to circle(60).",task:"Run the program and confirm that only the middle bubble changes size.",tip:"The number inside circle() is the radius."},
            {label:"Space",title:"Change only one gap.",body:"Change forward(55) to forward(90).",task:"Run it and find the gap that changed.",tip:"A distance command affects where later drawing begins."},
            {label:"Add",title:"Add one more bubble.",body:"At the bottom, add a forward command and another circle command.",task:"Make a fourth bubble with your own size and spacing.",tip:"Keep the program working before you add another line."}
          ]
        },
        {
          id: "1-3-predict",
          number: "1.3",
          title: "Predict the Turtle",
          type: "Check for Understanding",
          minutes: 8,
          available: true,
          starter: "forward(70)\nright(90)\nforward(40)",
          steps: [
            {label:"Predict",title:"Point before you run.",body:"Read the code from top to bottom. Decide where the turtle should finish.",task:"Before pressing Run, point on the grid where you think the turtle will end.",tip:"The turtle starts at (0, 0) facing right."},
            {label:"Run",title:"Check your prediction.",body:"Now run the code and compare the result to what you expected.",task:"Was your ending location right? If not, find the line you interpreted differently.",tip:"Prediction is useful because it forces you to read the program in order."},
            {label:"Question",title:"Which line changes direction?",body:"Only one line turns the turtle.",task:"Identify the turning line and say whether it turns clockwise or counterclockwise.",tip:"right() turns clockwise."},
            {label:"Test",title:"Prove it with one edit.",body:"Change right(90) to left(90) and run again.",task:"Explain why the second segment moved to the other side.",tip:"Changing one command gives you a clean comparison."}
          ]
        },
        {
          id: "1-4-stretch-path",
          number: "1.4",
          title: "Stretch the Path",
          type: "Exercise",
          minutes: 12,
          available: true,
          starter: "circle(30)\nforward(35)\ncircle(30)\nforward(35)\ncircle(30)",
          steps: [
            {label:"Run",title:"Start with three equal bubbles.",body:"Run the starter and look at the pattern before changing it.",task:"Confirm that all three circles are the same size and both gaps are the same.",tip:"A repeated pattern is easier to modify when you know which pieces match."},
            {label:"Stretch",title:"Make the gaps longer.",body:"Change both forward(35) commands to forward(70).",task:"Run it and keep all circle sizes unchanged.",tip:"You are changing spacing without changing the objects."},
            {label:"Vary",title:"Make the bubbles grow.",body:"Use three different circle sizes from smallest to largest.",task:"Run after each circle change.",tip:"A visual pattern can be made by changing just one parameter each time."},
            {label:"Turn",title:"Make the trail bend.",body:"Add a small turn between the second move and the last circle.",task:"Use left() or right() to make the last bubble leave the straight line.",tip:"You can change direction without changing the circle code."},
            {label:"Own it",title:"Make one deliberate variation.",body:"Choose one distance, one circle size, or one angle to change.",task:"Be able to point to the line that caused the visible change.",tip:"If you can explain the line, you understand the effect."}
          ]
        },
        {
          id: "1-5-trace-moves",
          number: "1.5",
          title: "Trace the Moves",
          type: "Trace Table",
          minutes: 13,
          available: true,
          starter: "forward(60)\nleft(90)\nforward(30)\nright(90)\nforward(20)",
          steps: [
            {label:"Read",title:"Treat the program like directions.",body:"Do not run the code yet. Read one line at a time from top to bottom.",task:"Start at (0, 0), facing right. Say what line 1 changes.",tip:"A trace table records the state after each line."},
            {label:"Trace",title:"Track position and direction.",body:"After forward(60), the turtle is at x = 60, y = 0. The next line changes direction without changing position.",task:"Continue the trace through line 3.",tip:"Turns change direction. forward() changes position."},
            {label:"Finish",title:"Complete the trace.",body:"Continue through the last two lines without using Run.",task:"Write or say the final x, y, and direction you expect.",tip:"You can trace a program even when nothing is drawn yet."},
            {label:"Run",title:"Use the computer to check.",body:"Now run the program.",task:"Compare the actual ending location and direction to your trace.",tip:"Running is the check. The trace is the reasoning."},
            {label:"Change",title:"Trace one edit.",body:"Change the final forward(20) to forward(80).",task:"Predict the new ending point before running again.",tip:"Only the last movement should change."}
          ]
        },
        {
          id: "1-6-predict-run-explain",
          number: "1.6",
          title: "Predict → Run → Explain",
          type: "Practice",
          minutes: 12,
          available: true,
          starter: "forward(50)\nleft(90)\ncircle(20)\nright(90)\nforward(50)",
          steps: [
            {label:"Predict",title:"Sketch the path with your finger.",body:"Read the five lines. Imagine the straight movement, the turn, the circle, and the final move in order.",task:"Describe what you expect before pressing Run.",tip:"You do not need exact coordinates to make a useful prediction."},
            {label:"Run",title:"Check the whole sequence.",body:"Run the code once.",task:"Find one part you predicted correctly and one part that surprised you.",tip:"Surprises are useful clues about how a command behaves."},
            {label:"Isolate",title:"Test the circle by itself.",body:"Temporarily comment out the other four commands with #.",task:"Run only circle(20), then remove the # marks when you are done.",tip:"Isolating one command is a strong debugging habit."},
            {label:"Explain",title:"Explain the order.",body:"The same commands in a different order can make a different picture.",task:"Move circle(20) to the bottom and run again. Explain what changed.",tip:"Python executes these commands from top to bottom."},
            {label:"Restore",title:"Put the program back together.",body:"Return the circle to its original location.",task:"Run once more and confirm the original picture returns.",tip:"A controlled experiment includes restoring the starting condition."}
          ]
        },
        {
          id: "1-7-bubble-chain",
          number: "1.7",
          title: "Bubble Chain Challenge",
          type: "Challenge",
          minutes: 15,
          available: true,
          starter: "circle(20)\nforward(35)",
          steps: [
            {label:"Start",title:"Begin with one working piece.",body:"Run the two-line starter. It makes one bubble and moves to the next starting point.",task:"Do not build the whole chain yet.",tip:"A challenge is easier when the smallest piece works first."},
            {label:"Repeat",title:"Make three bubbles by repeating code.",body:"Copy the two-line pattern two more times.",task:"Run after each copy so you always have a working program.",tip:"For now, repetition is intentional. Loops come later."},
            {label:"Grow",title:"Make each bubble larger.",body:"Change the circle sizes so the bubbles increase from left to right.",task:"Use three different radii.",tip:"Keep the forward distances unchanged while you test the sizes."},
            {label:"Curve",title:"Bend the chain.",body:"Add a small turn after each forward command.",task:"Make the bubbles travel in a curve instead of a straight row.",tip:"Small angles are easier to control."},
            {label:"Challenge",title:"Add a fourth bubble without breaking it.",body:"Extend the same idea one more time.",task:"Your final program should have four visible bubbles and a clear pattern.",tip:"A pattern can repeat while one number changes each time."}
          ]
        },
        {
          id: "1-8-color-lab",
          number: "1.8",
          title: "Color Lab",
          type: "Exercise",
          minutes: 12,
          available: true,
          starter: "bgcolor(\"midnightblue\")\ncolor(\"gold\")\npensize(4)\nforward(100)\nleft(90)\nforward(100)",
          steps: [
            {label:"Run",title:"See foreground and background color.",body:"Run the starter. One command changes the world behind the turtle and another changes the drawing color.",task:"Identify bgcolor() and color().",tip:"Background color and pen color are separate choices."},
            {label:"Swap",title:"Change the pen color.",body:"Replace gold with another named color.",task:"Run it and leave the background unchanged.",tip:"Color names go inside quotation marks."},
            {label:"Background",title:"Change the background.",body:"Pick a different bgcolor() value.",task:"Choose a combination where the drawing is easy to see.",tip:"Good contrast makes the drawing readable."},
            {label:"Thickness",title:"Change line thickness.",body:"Change pensize(4) to another whole number.",task:"Run and compare the line weight.",tip:"pensize() changes thickness without changing the path."},
            {label:"Design",title:"Add one more colored segment.",body:"Change the pen color again before adding another turn and forward command.",task:"Create a path with at least two drawing colors.",tip:"color() affects the lines drawn after that command."}
          ]
        },
        {
          id: "1-9-night-signals",
          number: "1.9",
          title: "Night Signals",
          type: "Mini Project",
          minutes: 18,
          available: true,
          starter: "bgcolor(\"black\")\ncolor(\"cyan\")\npensize(3)\ncircle(25)\nforward(60)",
          steps: [
            {label:"Run",title:"Start with one signal.",body:"Run the starter. You already have a background, a color, one circle, and one move.",task:"Make sure this small piece works before adding anything.",tip:"Projects still grow one working checkpoint at a time."},
            {label:"Second",title:"Add a second signal.",body:"Change the drawing color, draw another circle, and move again.",task:"Use a different circle size for the second signal.",tip:"Add only a few lines, then run."},
            {label:"Turn",title:"Change direction.",body:"Add a turn before the next move.",task:"Make the signal path leave the straight horizontal line.",tip:"The turn belongs before the movement you want it to affect."},
            {label:"Third",title:"Add a third signal.",body:"Choose another color and circle size.",task:"Run the program and make sure all three circles are visible.",tip:"If something disappears, check your position and color contrast."},
            {label:"Finish",title:"Make the pattern feel intentional.",body:"Adjust one distance, angle, or circle size so the composition feels balanced.",task:"Your finished program should use bgcolor(), color(), circle(), forward(), and a turn.",tip:"There is more than one correct final drawing."}
          ]
        },
        {
          id: "1-10-fix-path",
          number: "1.10",
          title: "Fix the Turtle",
          type: "Debugging",
          minutes: 10,
          available: true,
          starter: "forword(80)\nleft(90)\nforward(80",
          steps: [
            {label:"Run",title:"Let the broken code fail.",body:"Run the program exactly as written.",task:"Read the first error instead of changing several things at once.",tip:"Python usually reports one problem before it can reach the next one."},
            {label:"Name",title:"Fix the command name.",body:"The first command is misspelled.",task:"Change forword to forward and run again.",tip:"A NameError often means Python does not recognize a name you typed."},
            {label:"Syntax",title:"Fix the unfinished command.",body:"The last line is missing a closing parenthesis.",task:"Add the missing ) and run again.",tip:"A ParseError often means the code could not be read as complete Python."},
            {label:"Test",title:"Prove the program is healthy.",body:"Change one distance to a different whole number.",task:"Run again and confirm the drawing changes normally.",tip:"A small test after a fix helps confirm that the program is really working."}
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
        {id:"2-1-spot-repeat",number:"2.1",title:"Spot the Repeated Chunk",type:"Lesson",minutes:12,available:false},
        {id:"2-2-first-loop",number:"2.2",title:"Your First Loop",type:"Lesson",minutes:14,available:false},
        {id:"2-3-shapes",number:"2.3",title:"Shapes with Loops",type:"Exercise",minutes:15,available:false},
        {id:"2-4-patterns",number:"2.4",title:"Pattern Lab",type:"Practice",minutes:16,available:false},
        {id:"2-5-loop-debug",number:"2.5",title:"Debug a Loop",type:"Debugging",minutes:12,available:false},
        {id:"2-6-challenge",number:"2.6",title:"Loop Challenge",type:"Challenge",minutes:20,available:false}
      ]
    },
    {
      id: "unit-3",
      number: "3",
      title: "Functions",
      description: "Turn working drawing code into reusable commands.",
      lessons: [
        {id:"3-1-why-functions",number:"3.1",title:"Why Make a Function?",type:"Lesson",minutes:12,available:false},
        {id:"3-2-first-function",number:"3.2",title:"Your First Function",type:"Lesson",minutes:15,available:false},
        {id:"3-3-parameters",number:"3.3",title:"Parameters",type:"Lesson",minutes:15,available:false},
        {id:"3-4-function-practice",number:"3.4",title:"Function Practice",type:"Exercise",minutes:18,available:false},
        {id:"3-5-project",number:"3.5",title:"Reusable Drawing Project",type:"Project",minutes:25,available:false}
      ]
    },
    {
      id: "unit-4",
      number: "4",
      title: "Position + Design",
      description: "Move without drawing, place shapes, and combine ideas into larger scenes.",
      lessons: [
        {id:"4-1-penup",number:"4.1",title:"Move Without Drawing",type:"Lesson",minutes:12,available:false},
        {id:"4-2-position",number:"4.2",title:"Position on the Grid",type:"Lesson",minutes:14,available:false},
        {id:"4-3-coordinates",number:"4.3",title:"Coordinates When They Help",type:"Lesson",minutes:15,available:false},
        {id:"4-4-design",number:"4.4",title:"Build a Scene",type:"Project",minutes:30,available:false}
      ]
    }
  ]
};