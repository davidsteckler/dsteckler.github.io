window.PYTHON_COURSE = {
  title: "Python Turtle",
  subtitle: "Build it. Run it. Change it.",
  units: [
    {
      id: "unit-1",
      number: "1",
      title: "Make the Turtle Move",
      description: "Start with visible movement, then change one thing at a time.",
      lessons: [
        {
          id: "1-1-first-moves",
          number: "1.1",
          title: "First Moves",
          type: "Lesson",
          minutes: 8,
          available: true,
          starter: "forward(80)\nleft(90)\nforward(80)",
          steps: [
            {
              label: "Run",
              title: "See what the code already does.",
              body: "Run the program before changing anything. Watch the turtle make two straight lines with one turn between them.",
              task: "Press Run. Then find the line that makes the turtle turn.",
              tip: "The turtle starts in the center facing right."
            },
            {
              label: "Change",
              title: "Change one distance.",
              body: "Change the first 80 to 140. Run the whole program again.",
              task: "What changed on the screen? Leave the second distance at 80.",
              tip: "Change one number at a time so you can see what that number controls."
            },
            {
              label: "Turn",
              title: "Make a different corner.",
              body: "Change left(90) to left(45), then run it.",
              task: "Compare the new turn to the original 90-degree turn.",
              tip: "A smaller angle makes a smaller turn."
            },
            {
              label: "Build",
              title: "Add one more move.",
              body: "Add another turn and another forward command below the existing code.",
              task: "Make a three-segment path. Use any distances and turn angles you want.",
              tip: "Your code should still run after every line you add."
            }
          ]
        },
        {
          id: "1-2-slinky",
          number: "1.2",
          title: "Slinky",
          type: "Example + Experiment",
          minutes: 10,
          available: true,
          starter: "circle(35)\nforward(20)\ncircle(35)\nforward(20)",
          steps: [
            {
              label: "Notice",
              title: "Run the Slinky first.",
              body: "Do not edit it yet. Run the code and watch which command makes the loops and which command moves the turtle forward.",
              task: "Find circle(35) and forward(20) in the editor.",
              tip: "The number inside circle() is the radius."
            },
            {
              label: "Experiment",
              title: "Make the circles bigger.",
              body: "Change both circle(35) commands to circle(55). Run it again.",
              task: "Keep the forward commands exactly the same.",
              tip: "The program should still work before you move on."
            },
            {
              label: "Experiment",
              title: "Change the spacing.",
              body: "Now change both forward(20) commands to forward(45).",
              task: "Run it and compare the distance between the circles.",
              tip: "The circle size and the spacing are controlled by different commands."
            },
            {
              label: "Extend",
              title: "Add another loop.",
              body: "Copy the two-command pattern one more time at the bottom.",
              task: "Your Slinky should have one more circle and one more move.",
              tip: "For now, repeating code is okay. We will turn repeated code into a loop after it works."
            }
          ]
        },
        {
          id: "1-3-repeat-it",
          number: "1.3",
          title: "Make It Repeat",
          type: "Lesson",
          minutes: 12,
          available: true,
          starter: "forward(70)\nleft(90)\nforward(70)\nleft(90)\nforward(70)\nleft(90)\nforward(70)\nleft(90)",
          steps: [
            {
              label: "Run",
              title: "Start with working code.",
              body: "Run the long version first. It draws a square using the same two commands four times.",
              task: "Count how many times forward(70) appears.",
              tip: "The repeated version matters because you should understand what the loop will replace."
            },
            {
              label: "Find",
              title: "Spot the repeating chunk.",
              body: "The same two-line pattern repeats four times: forward(70), then left(90).",
              task: "Do not delete anything yet. Point to one complete repeated chunk.",
              tip: "A loop is useful when a working chunk repeats."
            },
            {
              label: "Rewrite",
              title: "Replace the copies with a loop.",
              body: "Replace the eight lines with the four-line version shown here.",
              task: "Type: for i in range(4): then indent forward(70) and left(90).",
              example: "for i in range(4):\n    forward(70)\n    left(90)",
              tip: "The two indented lines are the code that repeats."
            },
            {
              label: "Change",
              title: "Make the loop prove itself.",
              body: "Change range(4) to range(6), then change left(90) to left(60).",
              task: "Run it. You should get a six-sided shape.",
              tip: "Once the loop works, a small change can control the whole pattern."
            }
          ]
        },
        {
          id: "1-4-debug",
          number: "1.4",
          title: "NameError + ParseError",
          type: "Debugging",
          minutes: 10,
          available: true,
          starter: "forword(80)\nleft(90)\nforward(80",
          steps: [
            {
              label: "Break",
              title: "Run the broken program.",
              body: "This code has two different mistakes. Run it without fixing anything first.",
              task: "Read the error message. Notice which line it points to.",
              tip: "The editor can only report one problem at a time."
            },
            {
              label: "Fix",
              title: "Fix the spelling mistake.",
              body: "The command forword does not exist. Change it to forward and run again.",
              task: "A different error should appear after the first one is fixed.",
              tip: "A NameError often means Python does not recognize a name you typed."
            },
            {
              label: "Fix",
              title: "Close the command.",
              body: "The last forward command is missing a closing parenthesis.",
              task: "Add the missing ) and run the program.",
              tip: "A ParseError often means Python could not make sense of the way the code was written."
            },
            {
              label: "Test",
              title: "Make one safe change.",
              body: "Change either distance to a different whole number.",
              task: "Run it one more time and make sure the program still works.",
              tip: "After fixing an error, test a small change before adding more code."
            }
          ]
        }
      ]
    },
    {
      id: "unit-2",
      number: "2",
      title: "Loops + Patterns",
      description: "Use repetition after the repeated code is already understood.",
      lessons: [
        {id:"2-1-shapes",number:"2.1",title:"Shapes with Loops",type:"Lesson",minutes:12,available:false},
        {id:"2-2-patterns",number:"2.2",title:"Pattern Lab",type:"Practice",minutes:15,available:false},
        {id:"2-3-challenge",number:"2.3",title:"Loop Challenge",type:"Challenge",minutes:18,available:false}
      ]
    },
    {
      id: "unit-3",
      number: "3",
      title: "Functions",
      description: "Turn working drawing code into reusable commands.",
      lessons: [
        {id:"3-1-functions",number:"3.1",title:"Your First Function",type:"Lesson",minutes:15,available:false},
        {id:"3-2-parameters",number:"3.2",title:"Parameters",type:"Lesson",minutes:15,available:false},
        {id:"3-3-project",number:"3.3",title:"Function Project",type:"Project",minutes:25,available:false}
      ]
    },
    {
      id: "unit-4",
      number: "4",
      title: "Position + Design",
      description: "Place shapes, use color, and combine ideas into larger drawings.",
      lessons: [
        {id:"4-1-penup",number:"4.1",title:"Move Without Drawing",type:"Lesson",minutes:12,available:false},
        {id:"4-2-goto",number:"4.2",title:"Coordinates When They Help",type:"Lesson",minutes:15,available:false},
        {id:"4-3-design",number:"4.3",title:"Build a Scene",type:"Project",minutes:30,available:false}
      ]
    }
  ]
};