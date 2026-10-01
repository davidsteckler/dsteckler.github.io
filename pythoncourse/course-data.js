window.PYTHON_COURSE = {
  "title": "Python Turtle",
  "subtitle": "Make one. Solve one. Create one.",
  "units": [
    {
      "id": "unit-1",
      "number": "1",
      "title": "Turtle Basics",
      "description": "Movement and heading, circle geometry, execution and debugging, drawing state, and text representation. Each skill set includes predictions, an independent experiment, a saved explanation, and a Make → Solve → Create challenge.",
      "lessons": [
        {
          "id": "1-1-make-path",
          "number": "1.1",
          "title": "Make a Path",
          "type": "Make",
          "available": true,
          "notes": "Introduce forward/backward and left/right. Conference by asking students to point to the line causing a visible change. Keep emphasis on run-after-small-change. Check understanding through the two prediction questions, independent experiment, and saved evidence response. Conference by asking the student to explain the first differing line. A saved explanation is evidence to discuss, not an automatically graded claim.",
          "check": {
            "rules": [
              {
                "type": "minCalls",
                "commands": [
                  "forward",
                  "backward"
                ],
                "count": 4,
                "fail": "Use at least four movement commands.",
                "label": "4+ movement commands"
              },
              {
                "type": "minCalls",
                "commands": [
                  "left",
                  "right"
                ],
                "count": 2,
                "fail": "Use at least two turns.",
                "label": "2+ turns"
              },
              {
                "type": "minCalls",
                "commands": [
                  "backward"
                ],
                "count": 1,
                "fail": "Use backward() at least once.",
                "label": "Use backward()"
              },
              {
                "type": "minDistinctNumbers",
                "commands": [
                  "forward",
                  "backward"
                ],
                "count": 2,
                "fail": "Use at least two different movement distances.",
                "label": "2 different distances"
              }
            ]
          },
          "starter": "forward(80)\nleft(90)\nforward(80)",
          "visuals": [
            {
              "label": "Stair route",
              "bg": "#fbfaf6",
              "paths": [
                {
                  "points": [
                    [
                      18,
                      82
                    ],
                    [
                      72,
                      82
                    ],
                    [
                      72,
                      58
                    ],
                    [
                      48,
                      58
                    ],
                    [
                      48,
                      24
                    ],
                    [
                      118,
                      24
                    ]
                  ]
                }
              ]
            },
            {
              "label": "Lightning route",
              "bg": "#fbfaf6",
              "paths": [
                {
                  "points": [
                    [
                      18,
                      24
                    ],
                    [
                      76,
                      24
                    ],
                    [
                      52,
                      52
                    ],
                    [
                      106,
                      52
                    ],
                    [
                      82,
                      82
                    ],
                    [
                      146,
                      82
                    ]
                  ]
                }
              ]
            },
            {
              "label": "Switchback route",
              "bg": "#fbfaf6",
              "paths": [
                {
                  "points": [
                    [
                      16,
                      80
                    ],
                    [
                      68,
                      80
                    ],
                    [
                      68,
                      54
                    ],
                    [
                      34,
                      54
                    ],
                    [
                      34,
                      28
                    ],
                    [
                      106,
                      28
                    ],
                    [
                      106,
                      14
                    ]
                  ]
                }
              ]
            }
          ],
          "steps": [
            {
              "title": "Run the working starter.",
              "body": "Start by seeing the whole program work before changing anything.",
              "task": "Press Run once.",
              "tip": "The turtle starts in the center facing right."
            },
            {
              "title": "Test the first distance.",
              "body": "Change only the first forward(80) to forward(140).",
              "task": "Run again and watch which segment becomes longer.",
              "tip": "Only one number changed, so only one part of the drawing should change."
            },
            {
              "title": "Test the turn.",
              "body": "Put the first distance back to 80. Change left(90) to left(45).",
              "task": "Run and compare the new corner with the original.",
              "tip": "The number inside left() is the angle in degrees."
            },
            {
              "title": "Add one turn.",
              "body": "Add right(90) on a new line at the bottom.",
              "task": "Run. The turtle should turn, but no new segment should appear yet.",
              "tip": "Turning changes direction without moving."
            },
            {
              "title": "Use the new direction.",
              "body": "Add forward(50) below your new turn.",
              "task": "Run and watch the new segment appear.",
              "tip": "A movement uses whatever direction the turtle is facing at that moment."
            },
            {
              "title": "Try backward movement.",
              "body": "Add backward(30) on a new line.",
              "task": "Run and see how backward() behaves without changing direction first.",
              "tip": "Backward movement does not automatically turn the turtle around."
            },
            {
              "title": "Build one more corner.",
              "body": "Add one turn and one movement of your choice.",
              "task": "Run after each new line so the program stays working.",
              "tip": "Small working changes are easier to debug than a large block added all at once."
            },
            {
              "id": "1-1-make-path-predict",
              "title": "Predict before running.",
              "body": "Read the code before running it.",
              "task": "Choose a prediction, then check it. Use Run or Step to test your reasoning.",
              "example": "forward(60)\nleft(90)\nbackward(20)",
              "question": {
                "id": "1-1-make-path-predict",
                "prompt": "Where does the last command move?",
                "choices": [
                  "Up",
                  "Down",
                  "Right"
                ],
                "answer": 1,
                "explanation": "The turtle faces up after left(90). backward(20) moves down while it keeps facing up."
              },
              "lab": "forward(60)\nleft(90)\nbackward(20)"
            },
            {
              "id": "1-1-make-path-transfer",
              "title": "Reach the target without changing the turn.",
              "body": "This experiment has its own saved code. Your project will return when you leave this step.",
              "task": "Change only the two movement distances. Finish 90 to the right and 30 above the start.",
              "lab": "forward(60)\nleft(90)\nforward(40)",
              "example": "forward(60)\nleft(90)\nforward(40)",
              "check": {
                "rules": [
                  {
                    "type": "finalPosition",
                    "x": 90,
                    "y": 30,
                    "tolerance": 1.5,
                    "label": "Finish at the target",
                    "fail": "Trace each move and turn. The endpoint does not reach the target yet."
                  },
                  {
                    "type": "finalHeading",
                    "heading": 90,
                    "tolerance": 1,
                    "label": "Finish facing 90°",
                    "fail": "Check the direction left by the final turn."
                  }
                ]
              },
              "tip": "Use Step to find the first command whose result differs from your prediction."
            },
            {
              "id": "1-1-make-path-reason",
              "title": "Check your understanding.",
              "body": "Read the code before running it.",
              "task": "Choose a prediction, then check it. Use Run or Step to test your reasoning.",
              "example": "left(90)\nright(90)\nforward(25)",
              "question": {
                "id": "1-1-make-path-reason",
                "prompt": "What do the two turns do together?",
                "choices": [
                  "Move the turtle in a corner",
                  "Cancel each other; the move goes right",
                  "Make the move go left"
                ],
                "answer": 1,
                "explanation": "Turns change heading. Equal turns in opposite directions cancel; neither turn moves the turtle."
              },
              "lab": "left(90)\nright(90)\nforward(25)"
            },
            {
              "id": "1-1-make-path-evidence",
              "title": "Keep evidence of your thinking.",
              "body": "Use a specific change from your project. Your answer saves on this device.",
              "task": "Which movement distance did you change? Record the old value, new value, and the segment that changed.",
              "response": {
                "id": "1-1-make-path-evidence",
                "prompt": "Which movement distance did you change? Record the old value, new value, and the segment that changed.",
                "placeholder": "Before… After… I observed…"
              }
            },
            {
              "title": "Challenge: Make a zigzag route.",
              "body": "Think stair, lightning bolt, or crooked path.",
              "task": "Use 4+ movement commands, 2+ turns, backward() at least once, and 2 different distances.",
              "tip": "Example: a long segment, a turn, a shorter segment, another turn, then back up. Make your version different."
            }
          ],
          "group": "Movement",
          "objective": "Track position and heading separately"
        },
        {
          "id": "1-2-solve-route",
          "number": "1.2",
          "title": "Route Puzzle",
          "type": "Solve",
          "available": true,
          "notes": "First real reduction in scaffolding. Do not give the closing sequence. If stuck, ask what side is missing and which existing distance matches it. Check understanding through the two prediction questions, independent experiment, and saved evidence response. Conference by asking the student to explain the first differing line. A saved explanation is evidence to discuss, not an automatically graded claim.",
          "check": {
            "rules": [
              {
                "type": "minCalls",
                "commands": [
                  "forward",
                  "backward"
                ],
                "count": 4,
                "fail": "Add a movement that completes the route.",
                "label": "Add the missing movement"
              },
              {
                "type": "finalPosition",
                "x": 0,
                "y": 0,
                "tolerance": 1.5,
                "fail": "The turtle needs to finish back at its starting point.",
                "label": "Finish at the starting point"
              },
              {
                "type": "finalHeading",
                "heading": 0,
                "tolerance": 1,
                "label": "Finish facing 0°",
                "fail": "Check the direction left by the final turn."
              }
            ]
          },
          "starter": "forward(90)\nleft(90)\nforward(50)\nleft(90)\nforward(90)",
          "steps": [
            {
              "title": "Run the route.",
              "body": "The starter draws three sides of a shape.",
              "task": "Press Run and study the unfinished drawing.",
              "tip": "Look at where the turtle is and which direction it faces at the end."
            },
            {
              "id": "1-2-solve-route-predict",
              "title": "Predict before running.",
              "body": "Read the code before running it.",
              "task": "Choose a prediction, then check it. Use Run or Step to test your reasoning.",
              "example": "forward(70)\nleft(90)\nforward(30)\nleft(90)\nforward(70)",
              "question": {
                "id": "1-2-solve-route-predict",
                "prompt": "Which side is missing?",
                "choices": [
                  "A 70-unit horizontal side",
                  "A 30-unit vertical side",
                  "Another 90-degree turn only"
                ],
                "answer": 1,
                "explanation": "The two horizontal movements cancel. The turtle is still 30 units above the start."
              },
              "lab": "forward(70)\nleft(90)\nforward(30)\nleft(90)\nforward(70)"
            },
            {
              "title": "Close the shape.",
              "body": "Do not change the existing five lines.",
              "task": "Add as little code as you can to make the turtle return to its starting point.",
              "tip": "The missing side is the same length as one of the existing sides."
            },
            {
              "title": "Change the challenge.",
              "body": "Now change both forward(90) commands to forward(120).",
              "task": "Repair your added code so the shape closes again.",
              "tip": "Which distance controls the side that has to match?"
            },
            {
              "title": "Make the turtle finish facing right.",
              "body": "The drawing must stay closed.",
              "task": "Add or change only a turn so the turtle finishes facing the same direction it started.",
              "tip": "A turn at the end changes direction without changing the drawing."
            },
            {
              "id": "1-2-solve-route-transfer",
              "title": "Close a different route.",
              "body": "This experiment has its own saved code. Your project will return when you leave this step.",
              "task": "Keep the five lines. Add commands that return to the start and finish facing right.",
              "lab": "forward(70)\nleft(90)\nforward(30)\nleft(90)\nforward(70)",
              "example": "forward(70)\nleft(90)\nforward(30)\nleft(90)\nforward(70)",
              "check": {
                "rules": [
                  {
                    "type": "finalPosition",
                    "x": 0,
                    "y": 0,
                    "tolerance": 1.5,
                    "label": "Finish at the target",
                    "fail": "Trace each move and turn. The endpoint does not reach the target yet."
                  },
                  {
                    "type": "finalHeading",
                    "heading": 0,
                    "tolerance": 1,
                    "label": "Finish facing 0°",
                    "fail": "Check the direction left by the final turn."
                  },
                  {
                    "type": "minCalls",
                    "commands": [
                      "forward",
                      "backward"
                    ],
                    "count": 4,
                    "label": "Complete the missing side"
                  }
                ]
              },
              "tip": "Use Step to find the first command whose result differs from your prediction."
            },
            {
              "id": "1-2-solve-route-reason",
              "title": "Check your understanding.",
              "body": "Read the code before running it.",
              "task": "Choose a prediction, then check it. Use Run or Step to test your reasoning.",
              "example": "forward(50)\nbackward(50)",
              "question": {
                "id": "1-2-solve-route-reason",
                "prompt": "Is returning to the start enough to make a closed shape?",
                "choices": [
                  "Yes, every return creates a shape",
                  "No; this retraces one line"
                ],
                "answer": 1,
                "explanation": "The endpoint returns to the start, but the path has no enclosed area. Inspect the drawing as well as its endpoint."
              },
              "lab": "forward(50)\nbackward(50)"
            },
            {
              "id": "1-2-solve-route-evidence",
              "title": "Keep evidence of your thinking.",
              "body": "Use a specific change from your project. Your answer saves on this device.",
              "task": "Record both ways you closed the route. Which commands changed, and which result stayed the same?",
              "response": {
                "id": "1-2-solve-route-evidence",
                "prompt": "Record both ways you closed the route. Which commands changed, and which result stayed the same?",
                "placeholder": "Before… After… I observed…"
              }
            },
            {
              "title": "Solve it a different way.",
              "body": "Reset the lesson, then try the original puzzle again.",
              "task": "Find a second working solution that still closes the shape.",
              "tip": "More than one sequence of turns and movements can reach the same final state."
            }
          ],
          "group": "Movement",
          "objective": "Track position and heading separately"
        },
        {
          "id": "1-3-create-route",
          "number": "1.3",
          "title": "Route Designer",
          "type": "Create",
          "available": true,
          "notes": "Check requirements rather than appearance. Students should choose the route. Encourage clean runs and explain only when conferencing. Check understanding through the two prediction questions, independent experiment, and saved evidence response. Conference by asking the student to explain the first differing line. A saved explanation is evidence to discuss, not an automatically graded claim.",
          "check": {
            "rules": [
              {
                "type": "minCalls",
                "commands": [
                  "forward",
                  "backward"
                ],
                "count": 5,
                "fail": "Your route needs at least five visible movement segments.",
                "label": "5+ visible movement segments"
              },
              {
                "type": "requiresCommands",
                "commands": [
                  "left",
                  "right"
                ],
                "fail": "Use at least one left turn and one right turn.",
                "label": "Use both left() and right()"
              },
              {
                "type": "minDistinctNumbers",
                "commands": [
                  "forward",
                  "backward"
                ],
                "count": 2,
                "fail": "Use at least two different movement distances.",
                "label": "2 different movement distances"
              }
            ]
          },
          "starter": "# Build your route below\n",
          "visuals": [
            {
              "label": "Stair route",
              "bg": "#fbfaf6",
              "paths": [
                {
                  "points": [
                    [
                      14,
                      82
                    ],
                    [
                      58,
                      82
                    ],
                    [
                      58,
                      62
                    ],
                    [
                      94,
                      62
                    ],
                    [
                      94,
                      40
                    ],
                    [
                      130,
                      40
                    ],
                    [
                      130,
                      18
                    ]
                  ]
                }
              ]
            },
            {
              "label": "Mountain route",
              "bg": "#fbfaf6",
              "paths": [
                {
                  "points": [
                    [
                      12,
                      78
                    ],
                    [
                      42,
                      48
                    ],
                    [
                      68,
                      68
                    ],
                    [
                      98,
                      30
                    ],
                    [
                      124,
                      50
                    ],
                    [
                      150,
                      20
                    ]
                  ]
                }
              ]
            },
            {
              "label": "Box route",
              "bg": "#fbfaf6",
              "paths": [
                {
                  "points": [
                    [
                      18,
                      80
                    ],
                    [
                      78,
                      80
                    ],
                    [
                      78,
                      30
                    ],
                    [
                      128,
                      30
                    ],
                    [
                      128,
                      62
                    ],
                    [
                      98,
                      62
                    ],
                    [
                      98,
                      14
                    ]
                  ]
                }
              ]
            }
          ],
          "steps": [
            {
              "title": "Meet the requirements.",
              "body": "Your route needs at least five visible segments, at least one left turn, at least one right turn, and two different movement distances.",
              "task": "Write the first two commands and run them.",
              "tip": "Start small. You do not need to know the final picture yet."
            },
            {
              "id": "1-3-create-route-predict",
              "title": "Predict before running.",
              "body": "Read the code before running it.",
              "task": "Choose a prediction, then check it. Use Run or Step to test your reasoning.",
              "example": "forward(40)\nleft(90)\nforward(20)",
              "question": {
                "id": "1-3-create-route-predict",
                "prompt": "If both movement distances double, what changes?",
                "choices": [
                  "Size doubles; the corner stays 90°",
                  "The turn doubles too",
                  "Only the last segment changes"
                ],
                "answer": 0,
                "explanation": "Distances control length. Changing their numbers does not change the angle in left(90)."
              },
              "lab": "forward(40)\nleft(90)\nforward(20)"
            },
            {
              "title": "Keep building.",
              "body": "Add commands until you have at least five visible segments.",
              "task": "Run after every one or two new lines.",
              "tip": "If the path leaves the screen, shorten a distance rather than starting over."
            },
            {
              "title": "Make the route recognizably yours.",
              "body": "Change at least two numbers so your route does not resemble the starter from 1.1.",
              "task": "Run the full program.",
              "tip": "The requirements describe what the code must contain, not what the final picture must look like."
            },
            {
              "id": "1-3-create-route-transfer",
              "title": "Plan a route before typing.",
              "body": "This experiment has its own saved code. Your project will return when you leave this step.",
              "task": "Keep three movements and two turns. Reach a point 100 right and 40 below the start. Choose the two horizontal distances yourself.",
              "lab": "forward(40)\nright(90)\nforward(20)\nleft(90)\nforward(30)",
              "example": "forward(40)\nright(90)\nforward(20)\nleft(90)\nforward(30)",
              "check": {
                "rules": [
                  {
                    "type": "finalPosition",
                    "x": 100,
                    "y": -40,
                    "tolerance": 1.5,
                    "label": "Finish at the target",
                    "fail": "Trace each move and turn. The endpoint does not reach the target yet."
                  },
                  {
                    "type": "finalHeading",
                    "heading": 0,
                    "tolerance": 1,
                    "label": "Finish facing 0°",
                    "fail": "Check the direction left by the final turn."
                  },
                  {
                    "type": "exactCalls",
                    "commands": [
                      "forward"
                    ],
                    "count": 3,
                    "label": "Three movements"
                  }
                ]
              },
              "tip": "Use Step to find the first command whose result differs from your prediction."
            },
            {
              "id": "1-3-create-route-reason",
              "title": "Check your understanding.",
              "body": "Read the code before running it.",
              "task": "Choose a prediction, then check it. Use Run or Step to test your reasoning.",
              "example": "forward(20)\nleft(90)\nforward(20)\nleft(90)\nforward(20)",
              "question": {
                "id": "1-3-create-route-reason",
                "prompt": "What information would you need to add a fourth side?",
                "choices": [
                  "The current position and direction",
                  "The number of lines only",
                  "The pen color"
                ],
                "answer": 0,
                "explanation": "A movement starts from the position and heading left by earlier commands."
              },
              "lab": "forward(20)\nleft(90)\nforward(20)\nleft(90)\nforward(20)"
            },
            {
              "id": "1-3-create-route-evidence",
              "title": "Keep evidence of your thinking.",
              "body": "Use a specific change from your project. Your answer saves on this device.",
              "task": "Name one intentional feature of your route. Which two commands create that feature?",
              "response": {
                "id": "1-3-create-route-evidence",
                "prompt": "Name one intentional feature of your route. Which two commands create that feature?",
                "placeholder": "Before… After… I observed…"
              }
            },
            {
              "title": "Test from a clean start.",
              "body": "A finished program should work when run from the beginning.",
              "task": "Press Clear Run, then Run once.",
              "tip": "If the clean run looks different from what you expected, inspect the first place the route goes wrong."
            }
          ],
          "group": "Movement",
          "objective": "Track position and heading separately"
        },
        {
          "id": "1-4-make-bubbles",
          "number": "1.4",
          "title": "Make a Bubble Trail",
          "type": "Make",
          "available": true,
          "notes": "Teach circle radius separately from movement distance. Keep placement language concrete: move first, then draw. Check understanding through the two prediction questions, independent experiment, and saved evidence response. Conference by asking the student to explain the first differing line. A saved explanation is evidence to discuss, not an automatically graded claim.",
          "check": {
            "rules": [
              {
                "type": "minCalls",
                "commands": [
                  "circle"
                ],
                "count": 4,
                "fail": "Draw at least four circles.",
                "label": "4 circles"
              },
              {
                "type": "monotonicNumbers",
                "commands": [
                  "circle"
                ],
                "min": 4,
                "direction": "up",
                "fail": "Make each circle larger than the one before it.",
                "label": "Circles grow each time"
              },
              {
                "type": "minCalls",
                "commands": [
                  "forward",
                  "backward"
                ],
                "count": 3,
                "fail": "Move between the bubbles at least three times.",
                "label": "3+ moves between bubbles"
              },
              {
                "type": "minCalls",
                "commands": [
                  "left",
                  "right"
                ],
                "count": 1,
                "fail": "Use a turn so the trail bends.",
                "label": "At least 1 turn"
              }
            ]
          },
          "starter": "circle(25)\nforward(45)\ncircle(35)",
          "visuals": [
            {
              "label": "Growing arc",
              "bg": "#fbfaf6",
              "circles": [
                {
                  "cx": 24,
                  "cy": 70,
                  "r": 10
                },
                {
                  "cx": 56,
                  "cy": 58,
                  "r": 14
                },
                {
                  "cx": 92,
                  "cy": 40,
                  "r": 18
                },
                {
                  "cx": 132,
                  "cy": 24,
                  "r": 22
                }
              ]
            },
            {
              "label": "Around a corner",
              "bg": "#fbfaf6",
              "circles": [
                {
                  "cx": 26,
                  "cy": 72,
                  "r": 9
                },
                {
                  "cx": 60,
                  "cy": 72,
                  "r": 13
                },
                {
                  "cx": 94,
                  "cy": 60,
                  "r": 17
                },
                {
                  "cx": 118,
                  "cy": 30,
                  "r": 21
                }
              ]
            },
            {
              "label": "Rising chain",
              "bg": "#fbfaf6",
              "circles": [
                {
                  "cx": 22,
                  "cy": 78,
                  "r": 8
                },
                {
                  "cx": 52,
                  "cy": 62,
                  "r": 12
                },
                {
                  "cx": 84,
                  "cy": 44,
                  "r": 16
                },
                {
                  "cx": 122,
                  "cy": 24,
                  "r": 20
                }
              ]
            }
          ],
          "steps": [
            {
              "title": "Run two bubbles.",
              "body": "The starter already draws two circles with a move between them.",
              "task": "Press Run once.",
              "tip": "circle() draws from the turtle's current position."
            },
            {
              "title": "Change only the first bubble.",
              "body": "Change circle(25) to circle(50).",
              "task": "Run and confirm that the second bubble stays the same size.",
              "tip": "The number inside circle() is its radius."
            },
            {
              "title": "Restore the first bubble.",
              "body": "Put circle(25) back.",
              "task": "Run again so you are back at the starting version.",
              "tip": "Returning to a known version helps when testing one idea at a time."
            },
            {
              "title": "Change the spacing.",
              "body": "Change forward(45) to forward(80).",
              "task": "Run and watch the gap change without changing either circle size.",
              "tip": "Movement controls where the next drawing begins."
            },
            {
              "title": "Add a third bubble.",
              "body": "Add another forward command and another circle command.",
              "task": "Run after the move, then run again after the circle.",
              "tip": "Place first, draw second."
            },
            {
              "title": "Make the trail bend.",
              "body": "Add a small turn before the move to your third bubble.",
              "task": "Run and make the third bubble leave the straight row.",
              "tip": "The turn has to happen before the movement it should affect."
            },
            {
              "title": "Add a fourth bubble.",
              "body": "Continue the pattern with one more move and circle.",
              "task": "Use a new radius for the fourth bubble.",
              "tip": "You can repeat the structure while changing the numbers."
            },
            {
              "id": "1-4-make-bubbles-predict",
              "title": "Predict before running.",
              "body": "Read the code before running it.",
              "task": "Choose a prediction, then check it. Use Run or Step to test your reasoning.",
              "example": "circle(20)",
              "question": {
                "id": "1-4-make-bubbles-predict",
                "prompt": "How wide is the circle?",
                "choices": [
                  "20 units",
                  "40 units",
                  "80 units"
                ],
                "answer": 1,
                "explanation": "The argument is the radius: center to edge. The diameter is twice that distance."
              },
              "lab": "circle(20)"
            },
            {
              "id": "1-4-make-bubbles-transfer",
              "title": "Make two equal, separated circles.",
              "body": "This experiment has its own saved code. Your project will return when you leave this step.",
              "task": "Change the move to leave a 20-unit gap between these circles. Keep both radii 20.",
              "lab": "circle(20)\nforward(40)\ncircle(20)",
              "example": "circle(20)\nforward(40)\ncircle(20)",
              "check": {
                "rules": [
                  {
                    "type": "finalPosition",
                    "x": 60,
                    "y": 0,
                    "tolerance": 1.5,
                    "label": "Finish at the target",
                    "fail": "Trace each move and turn. The endpoint does not reach the target yet."
                  },
                  {
                    "type": "sameNumbers",
                    "commands": [
                      "circle"
                    ],
                    "min": 2,
                    "label": "Keep equal radii"
                  },
                  {
                    "type": "literalNumbers",
                    "commands": [
                      "circle"
                    ],
                    "values": [
                      20,
                      20
                    ],
                    "prefix": false,
                    "label": "Keep the unchanged values",
                    "fail": "This experiment asks you to change one property while preserving the other values."
                  }
                ]
              },
              "tip": "Use Step to find the first command whose result differs from your prediction."
            },
            {
              "id": "1-4-make-bubbles-reason",
              "title": "Check your understanding.",
              "body": "Read the code before running it.",
              "task": "Choose a prediction, then check it. Use Run or Step to test your reasoning.",
              "example": "circle(20)\ncircle(40)",
              "question": {
                "id": "1-4-make-bubbles-reason",
                "prompt": "Where do the circles start?",
                "choices": [
                  "At two different positions",
                  "At the same turtle position",
                  "At their centers"
                ],
                "answer": 1,
                "explanation": "circle() starts on the edge at the current turtle position. With no move between calls, the circles share that starting point."
              },
              "lab": "circle(20)\ncircle(40)"
            },
            {
              "id": "1-4-make-bubbles-evidence",
              "title": "Keep evidence of your thinking.",
              "body": "Use a specific change from your project. Your answer saves on this device.",
              "task": "Record a radius, its diameter, and one spacing value you tested. What happened to the gap?",
              "response": {
                "id": "1-4-make-bubbles-evidence",
                "prompt": "Record a radius, its diameter, and one spacing value you tested. What happened to the gap?",
                "placeholder": "Before… After… I observed…"
              }
            },
            {
              "title": "Challenge: Make a growing bubble curve.",
              "body": "Your bubbles should get bigger as the trail bends.",
              "task": "Use 4 circles, make every circle larger than the last, move between each one, and turn at least once.",
              "tip": "Example shape: four bubbles climbing around a corner. You choose the sizes, gaps, and turn."
            }
          ],
          "group": "Circles + Patterns",
          "objective": "Use radius and spacing deliberately"
        },
        {
          "id": "1-5-solve-bubbles",
          "number": "1.5",
          "title": "Bubble Pattern Puzzle",
          "type": "Solve",
          "available": true,
          "notes": "Let students find the broken spacing value before opening the hint. Focus on comparing repeated parameters. Check understanding through the two prediction questions, independent experiment, and saved evidence response. Conference by asking the student to explain the first differing line. A saved explanation is evidence to discuss, not an automatically graded claim.",
          "check": {
            "rules": [
              {
                "type": "minCalls",
                "commands": [
                  "circle"
                ],
                "count": 4,
                "fail": "Keep four circles in the pattern.",
                "label": "Keep 4 circles"
              },
              {
                "type": "sameNumbers",
                "commands": [
                  "forward"
                ],
                "min": 3,
                "fail": "Keep the three forward gaps equal.",
                "label": "Keep the gaps equal"
              },
              {
                "type": "monotonicNumbers",
                "commands": [
                  "circle"
                ],
                "min": 4,
                "direction": "either",
                "fail": "The circle sizes should consistently grow or consistently shrink.",
                "label": "Sizes consistently grow or shrink"
              },
              {
                "type": "minCalls",
                "commands": [
                  "left",
                  "right"
                ],
                "count": 1,
                "fail": "Add a turn so the trail is curved.",
                "label": "Curve the trail"
              }
            ]
          },
          "starter": "circle(20)\nforward(40)\ncircle(30)\nforward(70)\ncircle(40)\nforward(40)\ncircle(50)",
          "steps": [
            {
              "title": "Find what breaks the pattern.",
              "body": "This program is supposed to make bubbles that grow by 10 while the gaps stay equal.",
              "task": "Run it. Fix the one value that breaks the spacing pattern.",
              "tip": "Compare the forward() values, not the circle() values."
            },
            {
              "id": "1-5-solve-bubbles-predict",
              "title": "Predict before running.",
              "body": "Read the code before running it.",
              "task": "Choose a prediction, then check it. Use Run or Step to test your reasoning.",
              "example": "circle(15)\nforward(50)\ncircle(30)\nforward(50)\ncircle(45)",
              "question": {
                "id": "1-5-solve-bubbles-predict",
                "prompt": "Which list describes the diameters?",
                "choices": [
                  "15, 30, 45",
                  "30, 60, 90",
                  "50, 50, 50"
                ],
                "answer": 1,
                "explanation": "Each diameter is twice the corresponding radius. Movement values set placement, not diameter."
              },
              "lab": "circle(15)\nforward(50)\ncircle(30)\nforward(50)\ncircle(45)"
            },
            {
              "title": "Make the bubbles shrink instead.",
              "body": "Keep all four gaps equal.",
              "task": "Change only the circle radii so the bubbles go from largest to smallest.",
              "tip": "There are four circle() commands."
            },
            {
              "title": "Curve the whole pattern.",
              "body": "Keep the sizes decreasing and the gaps equal.",
              "task": "Add turns so the four bubbles follow a smooth bend.",
              "tip": "Try the same small turn before each movement first."
            },
            {
              "title": "Solve with fewer edits.",
              "body": "Reset the lesson.",
              "task": "Create a visibly curved bubble trail while changing no more than four lines of the starter.",
              "tip": "A good solution changes the lines that have the most effect."
            },
            {
              "id": "1-5-solve-bubbles-transfer",
              "title": "Repair only one radius.",
              "body": "This experiment has its own saved code. Your project will return when you leave this step.",
              "task": "Keep the first two circles and both moves. Change the final radius so all three sizes increase.",
              "lab": "circle(15)\nforward(55)\ncircle(30)\nforward(55)\ncircle(25)",
              "example": "circle(15)\nforward(55)\ncircle(30)\nforward(55)\ncircle(25)",
              "check": {
                "rules": [
                  {
                    "type": "exactCalls",
                    "commands": [
                      "circle"
                    ],
                    "count": 3,
                    "label": "Three circles"
                  },
                  {
                    "type": "monotonicNumbers",
                    "commands": [
                      "circle"
                    ],
                    "min": 3,
                    "direction": "up",
                    "label": "Radii increase"
                  },
                  {
                    "type": "finalPosition",
                    "x": 110,
                    "y": 0,
                    "tolerance": 1.5,
                    "label": "Finish at the target",
                    "fail": "Trace each move and turn. The endpoint does not reach the target yet."
                  },
                  {
                    "type": "literalNumbers",
                    "commands": [
                      "circle"
                    ],
                    "values": [
                      15,
                      30
                    ],
                    "prefix": true,
                    "label": "Keep the unchanged values",
                    "fail": "This experiment asks you to change one property while preserving the other values."
                  }
                ]
              },
              "tip": "Use Step to find the first command whose result differs from your prediction."
            },
            {
              "id": "1-5-solve-bubbles-reason",
              "title": "Check your understanding.",
              "body": "Read the code before running it.",
              "task": "Choose a prediction, then check it. Use Run or Step to test your reasoning.",
              "example": "circle(15)\nforward(55)\nleft(30)\ncircle(30)",
              "question": {
                "id": "1-5-solve-bubbles-reason",
                "prompt": "Does the turn move the next circle’s starting point?",
                "choices": [
                  "Yes, it moves 30 units",
                  "No; it changes heading at the same point"
                ],
                "answer": 1,
                "explanation": "A turn changes heading at the current position. To move the starting point, a movement must follow the turn."
              },
              "lab": "circle(15)\nforward(55)\nleft(30)\ncircle(30)"
            },
            {
              "id": "1-5-solve-bubbles-evidence",
              "title": "Keep evidence of your thinking.",
              "body": "Use a specific change from your project. Your answer saves on this device.",
              "task": "Which radius broke the original pattern? Explain the relationship you used to repair it.",
              "response": {
                "id": "1-5-solve-bubbles-evidence",
                "prompt": "Which radius broke the original pattern? Explain the relationship you used to repair it.",
                "placeholder": "Before… After… I observed…"
              }
            },
            {
              "title": "Leave one clean solution.",
              "body": "Choose whichever version you prefer.",
              "task": "Run from a clean start and keep all four bubbles visible.",
              "tip": "The final code should satisfy the pattern without needing an exact target image."
            }
          ],
          "group": "Circles + Patterns",
          "objective": "Use radius and spacing deliberately"
        },
        {
          "id": "1-6-create-bubbles",
          "number": "1.6",
          "title": "Bubble Design",
          "type": "Create",
          "available": true,
          "notes": "Open-ended application of circle, movement, and turning. Assess whether requirements are met, not whether drawings look alike. Check understanding through the two prediction questions, independent experiment, and saved evidence response. Conference by asking the student to explain the first differing line. A saved explanation is evidence to discuss, not an automatically graded claim.",
          "check": {
            "rules": [
              {
                "type": "minCalls",
                "commands": [
                  "circle"
                ],
                "count": 5,
                "fail": "Your design needs at least five circles.",
                "label": "5+ circles"
              },
              {
                "type": "minDistinctNumbers",
                "commands": [
                  "circle"
                ],
                "count": 3,
                "fail": "Use at least three different circle radii.",
                "label": "3 different circle sizes"
              },
              {
                "type": "minCalls",
                "commands": [
                  "left",
                  "right"
                ],
                "count": 1,
                "fail": "Change direction at least once.",
                "label": "Change direction"
              }
            ]
          },
          "starter": "# Make an original bubble design\n",
          "visuals": [
            {
              "label": "Spiral-ish",
              "bg": "#fbfaf6",
              "circles": [
                {
                  "cx": 35,
                  "cy": 65,
                  "r": 8
                },
                {
                  "cx": 66,
                  "cy": 72,
                  "r": 12
                },
                {
                  "cx": 98,
                  "cy": 58,
                  "r": 16
                },
                {
                  "cx": 108,
                  "cy": 29,
                  "r": 11
                },
                {
                  "cx": 72,
                  "cy": 22,
                  "r": 18
                }
              ]
            },
            {
              "label": "Wave",
              "bg": "#fbfaf6",
              "circles": [
                {
                  "cx": 20,
                  "cy": 55,
                  "r": 8
                },
                {
                  "cx": 48,
                  "cy": 35,
                  "r": 12
                },
                {
                  "cx": 80,
                  "cy": 55,
                  "r": 16
                },
                {
                  "cx": 116,
                  "cy": 35,
                  "r": 10
                },
                {
                  "cx": 142,
                  "cy": 55,
                  "r": 14
                }
              ]
            },
            {
              "label": "Cluster",
              "bg": "#fbfaf6",
              "circles": [
                {
                  "cx": 44,
                  "cy": 50,
                  "r": 9
                },
                {
                  "cx": 70,
                  "cy": 28,
                  "r": 13
                },
                {
                  "cx": 98,
                  "cy": 50,
                  "r": 17
                },
                {
                  "cx": 72,
                  "cy": 72,
                  "r": 11
                },
                {
                  "cx": 126,
                  "cy": 70,
                  "r": 15
                }
              ]
            }
          ],
          "steps": [
            {
              "title": "Start with one working bubble.",
              "body": "Your final design needs at least five circles, at least three different radii, and at least one change of direction.",
              "task": "Write code for the first circle and run it.",
              "tip": "A project is still easier when the smallest piece works first."
            },
            {
              "id": "1-6-create-bubbles-predict",
              "title": "Predict before running.",
              "body": "Read the code before running it.",
              "task": "Choose a prediction, then check it. Use Run or Step to test your reasoning.",
              "example": "circle(15)\nforward(45)\ncircle(30)",
              "question": {
                "id": "1-6-create-bubbles-predict",
                "prompt": "What changes if only forward(45) becomes forward(80)?",
                "choices": [
                  "Both circles grow",
                  "The second circle starts farther away",
                  "The first circle moves"
                ],
                "answer": 1,
                "explanation": "Movement between circles changes the next starting point. It does not change either radius."
              },
              "lab": "circle(15)\nforward(45)\ncircle(30)"
            },
            {
              "title": "Build the structure.",
              "body": "Add movement and more circles until you have at least three visible bubbles.",
              "task": "Run often enough that you always know which new lines caused a change.",
              "tip": "You can use repeated code for now. Loops come later."
            },
            {
              "title": "Meet the full requirements.",
              "body": "Reach at least five circles and three different radii.",
              "task": "Add at least one left() or right() that changes the direction of the pattern.",
              "tip": "The requirements leave the final arrangement open."
            },
            {
              "title": "Revise one weak part.",
              "body": "Look for crowding, overlap, or a gap that feels accidental.",
              "task": "Change one number to improve the design, then run again.",
              "tip": "Revision should have a visible reason."
            },
            {
              "id": "1-6-create-bubbles-transfer",
              "title": "Compare size with spacing.",
              "body": "This experiment has its own saved code. Your project will return when you leave this step.",
              "task": "Keep both circles unchanged. Move the second circle’s starting point to 75 units right of the first.",
              "lab": "circle(15)\nforward(45)\ncircle(30)",
              "example": "circle(15)\nforward(45)\ncircle(30)",
              "check": {
                "rules": [
                  {
                    "type": "finalPosition",
                    "x": 75,
                    "y": 0,
                    "tolerance": 1.5,
                    "label": "Finish at the target",
                    "fail": "Trace each move and turn. The endpoint does not reach the target yet."
                  },
                  {
                    "type": "exactCalls",
                    "commands": [
                      "circle"
                    ],
                    "count": 2,
                    "label": "Two circles"
                  },
                  {
                    "type": "literalNumbers",
                    "commands": [
                      "circle"
                    ],
                    "values": [
                      15,
                      30
                    ],
                    "prefix": false,
                    "label": "Keep the unchanged values",
                    "fail": "This experiment asks you to change one property while preserving the other values."
                  }
                ]
              },
              "tip": "Use Step to find the first command whose result differs from your prediction."
            },
            {
              "id": "1-6-create-bubbles-reason",
              "title": "Check your understanding.",
              "body": "Read the code before running it.",
              "task": "Choose a prediction, then check it. Use Run or Step to test your reasoning.",
              "example": "left(90)\ncircle(20)",
              "question": {
                "id": "1-6-create-bubbles-reason",
                "prompt": "Where is the center relative to the turtle?",
                "choices": [
                  "To the turtle’s left as it faces up",
                  "Always directly above the screen origin",
                  "Exactly at the turtle"
                ],
                "answer": 0,
                "explanation": "A positive-radius circle has its center to the turtle’s left. The turtle’s heading changes which screen direction that means."
              },
              "lab": "left(90)\ncircle(20)"
            },
            {
              "id": "1-6-create-bubbles-evidence",
              "title": "Keep evidence of your thinking.",
              "body": "Use a specific change from your project. Your answer saves on this device.",
              "task": "Choose two neighboring bubbles. Record their radii and starting-point spacing. Explain one revision you made.",
              "response": {
                "id": "1-6-create-bubbles-evidence",
                "prompt": "Choose two neighboring bubbles. Record their radii and starting-point spacing. Explain one revision you made.",
                "placeholder": "Before… After… I observed…"
              }
            },
            {
              "title": "Test the finished design.",
              "body": "The program should work from the top without manual setup.",
              "task": "Press Clear Run, then Run once.",
              "tip": "Keep the version that produces your intended design from a clean start."
            }
          ],
          "group": "Circles + Patterns",
          "objective": "Use radius and spacing deliberately"
        },
        {
          "id": "1-7-make-sequence",
          "number": "1.7",
          "title": "Make Sense of Sequence",
          "type": "Make",
          "available": true,
          "notes": "Use Step heavily here. The goal is seeing that each line inherits the turtle's current position and direction. Check understanding through the two prediction questions, independent experiment, and saved evidence response. Conference by asking the student to explain the first differing line. A saved explanation is evidence to discuss, not an automatically graded claim.",
          "check": {
            "rules": [
              {
                "type": "exactTurtleCalls",
                "count": 5,
                "fail": "Keep exactly five Turtle commands in the final sequence.",
                "label": "Exactly 5 Turtle commands"
              },
              {
                "type": "minCalls",
                "commands": [
                  "forward",
                  "backward"
                ],
                "count": 3,
                "fail": "Keep three movement commands in the sequence.",
                "label": "3 movement commands"
              },
              {
                "type": "minCalls",
                "commands": [
                  "left",
                  "right"
                ],
                "count": 2,
                "fail": "Keep two turn commands in the sequence.",
                "label": "2 turn commands"
              },
              {
                "type": "commandSequence",
                "sequence": [
                  [
                    "forward",
                    "backward"
                  ],
                  [
                    "left",
                    "right"
                  ],
                  [
                    "forward",
                    "backward"
                  ],
                  [
                    "left",
                    "right"
                  ],
                  [
                    "forward",
                    "backward"
                  ]
                ],
                "label": "Movement and turns alternate",
                "fail": "A zigzag needs a turn between its movement segments."
              }
            ]
          },
          "starter": "forward(60)\nleft(90)\nforward(30)\nright(90)\nforward(20)",
          "visuals": [
            {
              "label": "Right · up · right",
              "bg": "#fbfaf6",
              "paths": [
                {
                  "points": [
                    [
                      18,
                      72
                    ],
                    [
                      68,
                      72
                    ],
                    [
                      68,
                      34
                    ],
                    [
                      138,
                      34
                    ]
                  ]
                }
              ]
            },
            {
              "label": "Down · right · down",
              "bg": "#fbfaf6",
              "paths": [
                {
                  "points": [
                    [
                      45,
                      16
                    ],
                    [
                      45,
                      54
                    ],
                    [
                      112,
                      54
                    ],
                    [
                      112,
                      88
                    ]
                  ]
                }
              ]
            },
            {
              "label": "Corner · corner",
              "bg": "#fbfaf6",
              "paths": [
                {
                  "points": [
                    [
                      18,
                      25
                    ],
                    [
                      68,
                      25
                    ],
                    [
                      68,
                      72
                    ],
                    [
                      140,
                      72
                    ]
                  ]
                }
              ]
            }
          ],
          "steps": [
            {
              "title": "Use Step for line 1.",
              "body": "Instead of running everything at once, execute the program one statement at a time.",
              "task": "Press Step once.",
              "tip": "The first command should move the turtle to the right."
            },
            {
              "title": "Step through the turn.",
              "body": "The next statement is left(90).",
              "task": "Press Step once more and watch the turtle change direction without adding a segment.",
              "tip": "Program state can change even when the drawing does not."
            },
            {
              "title": "Use the new direction.",
              "body": "The next movement uses the direction created by the turn.",
              "task": "Press Step again.",
              "tip": "Each line starts from the state left by the line before it."
            },
            {
              "title": "Finish one line at a time.",
              "body": "Two statements remain.",
              "task": "Press Step twice more to finish the program.",
              "tip": "Watch the direction before the last forward() runs."
            },
            {
              "title": "Compare Step with Run.",
              "body": "Both controls execute the same program.",
              "task": "Press Clear Run, then Run once. The finished drawing should match.",
              "tip": "Step changes how you observe execution, not what the program means."
            },
            {
              "title": "Change the middle distance.",
              "body": "Change forward(30) to forward(80).",
              "task": "Clear the run and Step until the edited line executes.",
              "tip": "The first two statements should behave exactly as before."
            },
            {
              "title": "Change the order.",
              "body": "Move right(90) above forward(80).",
              "task": "Press Run and see how changing sequence changes the picture.",
              "tip": "The values stayed the same; their order changed."
            },
            {
              "id": "1-7-make-sequence-predict",
              "title": "Predict before running.",
              "body": "Read the code before running it.",
              "task": "Choose a prediction, then check it. Use Run or Step to test your reasoning.",
              "example": "forward(30)\nleft(90)\nforward(20)",
              "question": {
                "id": "1-7-make-sequence-predict",
                "prompt": "After line 2, what has changed?",
                "choices": [
                  "Position only",
                  "Heading only",
                  "Both position and heading"
                ],
                "answer": 1,
                "explanation": "Line 2 is a turn. The first movement changed position; the turn changes heading at that position."
              },
              "lab": "forward(30)\nleft(90)\nforward(20)"
            },
            {
              "id": "1-7-make-sequence-transfer",
              "title": "Same commands, different result.",
              "body": "This experiment has its own saved code. Your project will return when you leave this step.",
              "task": "Reorder these three lines without changing any numbers. Finish 40 right and 30 above the start.",
              "lab": "forward(40)\nforward(30)\nleft(90)",
              "example": "forward(40)\nforward(30)\nleft(90)",
              "check": {
                "rules": [
                  {
                    "type": "finalPosition",
                    "x": 40,
                    "y": 30,
                    "tolerance": 1.5,
                    "label": "Finish at the target",
                    "fail": "Trace each move and turn. The endpoint does not reach the target yet."
                  },
                  {
                    "type": "finalHeading",
                    "heading": 90,
                    "tolerance": 1,
                    "label": "Finish facing 90°",
                    "fail": "Check the direction left by the final turn."
                  },
                  {
                    "type": "exactTurtleCalls",
                    "count": 3,
                    "label": "Keep three commands"
                  },
                  {
                    "type": "literalNumbers",
                    "commands": [
                      "forward"
                    ],
                    "values": [
                      40,
                      30
                    ],
                    "prefix": false,
                    "label": "Keep the unchanged values",
                    "fail": "This experiment asks you to change one property while preserving the other values."
                  },
                  {
                    "type": "literalNumbers",
                    "commands": [
                      "left"
                    ],
                    "values": [
                      90
                    ],
                    "prefix": false,
                    "label": "Keep the unchanged values",
                    "fail": "This experiment asks you to change one property while preserving the other values."
                  }
                ]
              },
              "tip": "Use Step to find the first command whose result differs from your prediction."
            },
            {
              "id": "1-7-make-sequence-reason",
              "title": "Check your understanding.",
              "body": "Read the code before running it.",
              "task": "Choose a prediction, then check it. Use Run or Step to test your reasoning.",
              "example": "left(90)\nforward(30)\nright(90)",
              "question": {
                "id": "1-7-make-sequence-reason",
                "prompt": "Why does forward(30) move up?",
                "choices": [
                  "forward always means screen-up",
                  "The previous turn left the turtle facing up",
                  "The number 30 is positive"
                ],
                "answer": 1,
                "explanation": "forward() uses the current heading. It does not mean one fixed screen direction."
              },
              "lab": "left(90)\nforward(30)\nright(90)"
            },
            {
              "id": "1-7-make-sequence-evidence",
              "title": "Keep evidence of your thinking.",
              "body": "Use a specific change from your project. Your answer saves on this device.",
              "task": "Record the original order and your new order. Which line first makes their execution differ?",
              "response": {
                "id": "1-7-make-sequence-evidence",
                "prompt": "Record the original order and your new order. Which line first makes their execution differ?",
                "placeholder": "Before… After… I observed…"
              }
            },
            {
              "title": "Challenge: Make a 3-segment zigzag.",
              "body": "Use exactly the same five commands: 3 movements and 2 turns.",
              "task": "Reorder them so the path changes direction twice and all 3 segments are visible.",
              "tip": "A zigzag could go right → up → right, but yours does not have to."
            }
          ],
          "group": "Sequence + Debugging",
          "objective": "Trace order and isolate errors"
        },
        {
          "id": "1-8-solve-debug",
          "number": "1.8",
          "title": "Debug Challenge",
          "type": "Solve",
          "available": true,
          "notes": "Have students fix one error at a time and rerun. Distinguish syntax/name errors from a program that runs but does the wrong thing. Check understanding through the two prediction questions, independent experiment, and saved evidence response. Conference by asking the student to explain the first differing line. A saved explanation is evidence to discuss, not an automatically graded claim.",
          "check": {
            "rules": [
              {
                "type": "exactCalls",
                "commands": [
                  "forward"
                ],
                "count": 3,
                "fail": "The repaired program should have three forward() commands.",
                "label": "3 forward() commands"
              },
              {
                "type": "exactCalls",
                "commands": [
                  "left"
                ],
                "count": 1,
                "fail": "The repaired program should have one left() turn.",
                "label": "1 left() turn"
              },
              {
                "type": "exactCalls",
                "commands": [
                  "right"
                ],
                "count": 1,
                "fail": "The repaired program should have one right() turn.",
                "label": "1 right() turn"
              },
              {
                "type": "firstLastSameNumber",
                "commands": [
                  "forward"
                ],
                "fail": "The first and last forward distances should match.",
                "label": "First and last distances match"
              }
            ]
          },
          "starter": "forword(70)\nleft(90\nforward(40)\nrite(90)\nforward(70)",
          "steps": [
            {
              "title": "Get the program to run.",
              "body": "This five-line program has several typing and syntax mistakes.",
              "task": "Press Run. Fix errors one at a time until the program executes.",
              "tip": "Run again after every fix so the next error becomes easier to isolate."
            },
            {
              "id": "1-8-solve-debug-predict",
              "title": "Predict before running.",
              "body": "Read the code before running it.",
              "task": "Choose a prediction, then check it. Use Run or Step to test your reasoning.",
              "example": "forwad(30)",
              "question": {
                "id": "1-8-solve-debug-predict",
                "prompt": "What kind of repair is needed?",
                "choices": [
                  "Change the distance",
                  "Correct the command’s spelling",
                  "Add a turn"
                ],
                "answer": 1,
                "explanation": "Python cannot find a command named forwad. Correcting the distance would leave the same NameError."
              },
              "lab": "forwad(30)"
            },
            {
              "title": "Make the route symmetric.",
              "body": "Once the code runs, look at the three visible segments.",
              "task": "Change one distance so the first and last segments are the same length.",
              "tip": "This is now a logic problem, not a syntax problem."
            },
            {
              "title": "Make both turns opposite.",
              "body": "The finished route should turn left once and right once.",
              "task": "Fix the turn commands if needed without adding new lines.",
              "tip": "A valid command can still be the wrong command for the goal."
            },
            {
              "title": "Break it on purpose.",
              "body": "Create one NameError yourself by misspelling a command.",
              "task": "Run, read the error, then repair it.",
              "tip": "Recognizing an error is easier after you have created the same kind deliberately."
            },
            {
              "id": "1-8-solve-debug-transfer",
              "title": "A program can run and still be wrong.",
              "body": "This experiment has its own saved code. Your project will return when you leave this step.",
              "task": "Make the first and last segments equal without adding or removing commands.",
              "lab": "forward(60)\nleft(90)\nforward(30)\nright(90)\nforward(20)",
              "example": "forward(60)\nleft(90)\nforward(30)\nright(90)\nforward(20)",
              "check": {
                "rules": [
                  {
                    "type": "firstLastSameNumber",
                    "commands": [
                      "forward"
                    ],
                    "label": "Matching outer distances"
                  },
                  {
                    "type": "exactTurtleCalls",
                    "count": 5,
                    "label": "Keep five commands"
                  }
                ]
              },
              "tip": "Use Step to find the first command whose result differs from your prediction."
            },
            {
              "id": "1-8-solve-debug-reason",
              "title": "Check your understanding.",
              "body": "Read the code before running it.",
              "task": "Choose a prediction, then check it. Use Run or Step to test your reasoning.",
              "example": "forward(30\nleft(90)",
              "question": {
                "id": "1-8-solve-debug-reason",
                "prompt": "Where should you look first?",
                "choices": [
                  "Only the line the error highlights",
                  "The unclosed parenthesis on the previous line",
                  "The color settings"
                ],
                "answer": 1,
                "explanation": "An unclosed command can cause the parser to report the following line. Inspect the line just before the reported location too."
              },
              "lab": "forward(30\nleft(90)"
            },
            {
              "id": "1-8-solve-debug-evidence",
              "title": "Keep evidence of your thinking.",
              "body": "Use a specific change from your project. Your answer saves on this device.",
              "task": "Record one exact error message, its cause, the single change you made, and what the next run showed.",
              "response": {
                "id": "1-8-solve-debug-evidence",
                "prompt": "Record one exact error message, its cause, the single change you made, and what the next run showed.",
                "placeholder": "Before… After… I observed…"
              }
            },
            {
              "title": "Leave a clean solution.",
              "body": "All five lines should be valid and the drawing should be symmetric.",
              "task": "Clear Run, then Run once.",
              "tip": "The final test should produce no error message."
            }
          ],
          "group": "Sequence + Debugging",
          "objective": "Trace order and isolate errors"
        },
        {
          "id": "1-9-create-five-lines",
          "number": "1.9",
          "title": "Five-Line Drawing",
          "type": "Create",
          "available": true,
          "notes": "Constraint challenge. Do not suggest a target image. The five-command limit forces students to choose commands intentionally. Check understanding through the two prediction questions, independent experiment, and saved evidence response. Conference by asking the student to explain the first differing line. A saved explanation is evidence to discuss, not an automatically graded claim.",
          "check": {
            "rules": [
              {
                "type": "exactTurtleCalls",
                "count": 5,
                "fail": "Use exactly five Turtle commands.",
                "label": "Exactly 5 Turtle commands"
              },
              {
                "type": "minDrawElements",
                "count": 2,
                "fail": "At least two of the five commands need to draw something visible.",
                "label": "At least 2 visible drawing commands"
              }
            ]
          },
          "starter": "# You get exactly five drawing commands\n",
          "visuals": [
            {
              "label": "Bolt",
              "bg": "#fbfaf6",
              "paths": [
                {
                  "points": [
                    [
                      22,
                      18
                    ],
                    [
                      78,
                      18
                    ],
                    [
                      52,
                      48
                    ],
                    [
                      112,
                      48
                    ],
                    [
                      80,
                      82
                    ]
                  ]
                }
              ]
            },
            {
              "label": "Cup",
              "bg": "#fbfaf6",
              "paths": [
                {
                  "points": [
                    [
                      28,
                      22
                    ],
                    [
                      28,
                      72
                    ],
                    [
                      72,
                      88
                    ],
                    [
                      116,
                      72
                    ],
                    [
                      116,
                      22
                    ]
                  ]
                }
              ]
            },
            {
              "label": "Hook",
              "bg": "#fbfaf6",
              "paths": [
                {
                  "points": [
                    [
                      26,
                      20
                    ],
                    [
                      96,
                      20
                    ],
                    [
                      96,
                      62
                    ],
                    [
                      62,
                      62
                    ],
                    [
                      62,
                      86
                    ]
                  ]
                }
              ]
            }
          ],
          "steps": [
            {
              "title": "Read the constraint.",
              "body": "Create a recognizable or interesting mark using exactly five Turtle commands. Comments do not count.",
              "task": "Write your first command and run it.",
              "tip": "You may use movement, turns, or circle()."
            },
            {
              "id": "1-9-create-five-lines-predict",
              "title": "Predict before running.",
              "body": "Read the code before running it.",
              "task": "Choose a prediction, then check it. Use Run or Step to test your reasoning.",
              "example": "forward(20)\nforward(20)\nleft(90)\nleft(90)\nleft(90)",
              "question": {
                "id": "1-9-create-five-lines-predict",
                "prompt": "How many separate straight segments are visible?",
                "choices": [
                  "Five",
                  "Two",
                  "One"
                ],
                "answer": 2,
                "explanation": "Two consecutive forward movements extend the same straight segment. Three turns at the endpoint draw nothing."
              },
              "lab": "forward(20)\nforward(20)\nleft(90)\nleft(90)\nleft(90)"
            },
            {
              "title": "Build within the limit.",
              "body": "You only get five commands total.",
              "task": "Add commands until you reach five. Run after each addition.",
              "tip": "Every line has to earn its place."
            },
            {
              "title": "Revise instead of adding.",
              "body": "Once you have five commands, you cannot add a sixth.",
              "task": "Change numbers or replace commands to improve the drawing.",
              "tip": "Constraints force you to make stronger choices."
            },
            {
              "id": "1-9-create-five-lines-transfer",
              "title": "Design within a constraint.",
              "body": "This experiment has its own saved code. Your project will return when you leave this step.",
              "task": "Keep exactly five commands. Change distances so the endpoint is 90 right and 35 above the start.",
              "lab": "forward(40)\nleft(90)\nforward(20)\nright(90)\nforward(30)",
              "example": "forward(40)\nleft(90)\nforward(20)\nright(90)\nforward(30)",
              "check": {
                "rules": [
                  {
                    "type": "finalPosition",
                    "x": 90,
                    "y": 35,
                    "tolerance": 1.5,
                    "label": "Finish at the target",
                    "fail": "Trace each move and turn. The endpoint does not reach the target yet."
                  },
                  {
                    "type": "exactTurtleCalls",
                    "count": 5,
                    "label": "Exactly five commands"
                  }
                ]
              },
              "tip": "Use Step to find the first command whose result differs from your prediction."
            },
            {
              "id": "1-9-create-five-lines-reason",
              "title": "Check your understanding.",
              "body": "Read the code before running it.",
              "task": "Choose a prediction, then check it. Use Run or Step to test your reasoning.",
              "example": "forward(20)\nleft(90)\nforward(20)\nright(90)\nforward(20)",
              "question": {
                "id": "1-9-create-five-lines-reason",
                "prompt": "Which revision keeps the five-command constraint?",
                "choices": [
                  "Add another forward()",
                  "Replace a distance with a different number",
                  "Append a color() command"
                ],
                "answer": 1,
                "explanation": "Changing a value revises a command that already exists. Adding another Turtle command breaks the constraint."
              },
              "lab": "forward(20)\nleft(90)\nforward(20)\nright(90)\nforward(20)"
            },
            {
              "id": "1-9-create-five-lines-evidence",
              "title": "Keep evidence of your thinking.",
              "body": "Use a specific change from your project. Your answer saves on this device.",
              "task": "Which command matters most to your design? Predict what would change if it were removed.",
              "response": {
                "id": "1-9-create-five-lines-evidence",
                "prompt": "Which command matters most to your design? Predict what would change if it were removed.",
                "placeholder": "Before… After… I observed…"
              }
            },
            {
              "title": "Test the final five lines.",
              "body": "The drawing should work from a clean start.",
              "task": "Press Clear Run, then Run once.",
              "tip": "Keep exactly five executable Turtle commands."
            }
          ],
          "group": "Sequence + Debugging",
          "objective": "Trace order and isolate errors"
        },
        {
          "id": "1-10-make-color",
          "number": "1.10",
          "title": "Make a Neon Lightning Bolt",
          "type": "Make",
          "available": true,
          "notes": "Concrete style lesson. Students build one recognizable neon bolt while learning that bgcolor(), color(), and pensize() change the appearance of later drawing. Keep each change visible and purposeful. Check understanding through the two prediction questions, independent experiment, and saved evidence response. Conference by asking the student to explain the first differing line. A saved explanation is evidence to discuss, not an automatically graded claim.",
          "check": {
            "rules": [
              {
                "type": "minCalls",
                "commands": [
                  "bgcolor"
                ],
                "count": 1,
                "fail": "Set a background color.",
                "label": "Dark background"
              },
              {
                "type": "minDistinctStrings",
                "commands": [
                  "color"
                ],
                "count": 3,
                "fail": "Use at least three drawing colors.",
                "label": "3 drawing colors"
              },
              {
                "type": "minDistinctNumbers",
                "commands": [
                  "pensize"
                ],
                "count": 2,
                "fail": "Use at least two line thicknesses.",
                "label": "2 line thicknesses"
              },
              {
                "type": "minCalls",
                "commands": [
                  "forward",
                  "backward"
                ],
                "count": 5,
                "fail": "Draw at least five bolt segments.",
                "label": "5+ bolt segments"
              },
              {
                "type": "minCalls",
                "commands": [
                  "left",
                  "right"
                ],
                "count": 4,
                "fail": "Use at least four turns.",
                "label": "4+ turns"
              }
            ]
          },
          "starter": "bgcolor(\"black\")\ncolor(\"cyan\")\npensize(6)\nforward(70)",
          "visuals": [
            {
              "label": "Sharp bolt",
              "bg": "#111318",
              "paths": [
                {
                  "points": [
                    [
                      25,
                      18
                    ],
                    [
                      92,
                      18
                    ],
                    [
                      63,
                      46
                    ],
                    [
                      112,
                      46
                    ],
                    [
                      74,
                      84
                    ],
                    [
                      145,
                      84
                    ]
                  ],
                  "stroke": "#5eead4",
                  "width": 6
                }
              ]
            },
            {
              "label": "Tall bolt",
              "bg": "#141420",
              "paths": [
                {
                  "points": [
                    [
                      75,
                      10
                    ],
                    [
                      122,
                      10
                    ],
                    [
                      92,
                      39
                    ],
                    [
                      126,
                      39
                    ],
                    [
                      65,
                      90
                    ],
                    [
                      82,
                      53
                    ],
                    [
                      42,
                      53
                    ]
                  ],
                  "stroke": "#fde047",
                  "width": 7
                }
              ]
            },
            {
              "label": "Split-color bolt",
              "bg": "#151827",
              "paths": [
                {
                  "points": [
                    [
                      18,
                      24
                    ],
                    [
                      78,
                      24
                    ],
                    [
                      52,
                      50
                    ]
                  ],
                  "stroke": "#67e8f9",
                  "width": 6
                },
                {
                  "points": [
                    [
                      52,
                      50
                    ],
                    [
                      108,
                      50
                    ],
                    [
                      82,
                      80
                    ]
                  ],
                  "stroke": "#f472b6",
                  "width": 9
                },
                {
                  "points": [
                    [
                      82,
                      80
                    ],
                    [
                      146,
                      80
                    ]
                  ],
                  "stroke": "#fde68a",
                  "width": 5
                }
              ]
            }
          ],
          "steps": [
            {
              "title": "Run the first neon segment.",
              "body": "The black background, cyan pen, and thick line are already set.",
              "task": "Press Run.",
              "tip": "Style commands change how later drawing looks."
            },
            {
              "title": "Make the first corner.",
              "body": "Add right(60), then forward(35).",
              "task": "Run and make the path bend down.",
              "tip": "The turn changes direction; the next forward() draws in that direction."
            },
            {
              "title": "Change color before the next segment.",
              "body": "Add color(\"yellow\") before the next movement.",
              "task": "Add left(120), then forward(60), and Run.",
              "tip": "color() affects the drawing that comes after it."
            },
            {
              "title": "Make one segment thicker.",
              "body": "Add a second pensize() value before the next movement.",
              "task": "Use pensize(10), add right(60), then forward(35). Run again.",
              "tip": "Changing thickness midway makes one part stand out."
            },
            {
              "title": "Add a third color.",
              "body": "Change color again before drawing the next piece.",
              "task": "Use a new color, add a turn, then another movement.",
              "tip": "Use a color name inside quotation marks."
            },
            {
              "title": "Keep the bolt shape sharp.",
              "body": "A lightning bolt changes direction several times.",
              "task": "Add one more turn and movement so the route has at least five visible segments.",
              "tip": "Shorter middle segments usually make the zigzag easier to read."
            },
            {
              "id": "1-10-make-color-predict",
              "title": "Predict before running.",
              "body": "Read the code before running it.",
              "task": "Choose a prediction, then check it. Use Run or Step to test your reasoning.",
              "example": "color(\"cyan\")\nforward(40)\ncolor(\"yellow\")",
              "question": {
                "id": "1-10-make-color-predict",
                "prompt": "What color is the line already drawn?",
                "choices": [
                  "Yellow",
                  "Cyan",
                  "A mixture"
                ],
                "answer": 1,
                "explanation": "color() controls future drawing. Changing it afterward does not repaint an earlier segment."
              },
              "lab": "color(\"cyan\")\nforward(40)\ncolor(\"yellow\")"
            },
            {
              "id": "1-10-make-color-transfer",
              "title": "Control each stroke.",
              "body": "This experiment has its own saved code. Your project will return when you leave this step.",
              "task": "Keep two movements. Make both visible on black, with different colors and line widths of at least 6.",
              "lab": "bgcolor(\"black\")\ncolor(\"cyan\")\npensize(2)\nforward(40)\ncolor(\"yellow\")\nforward(40)",
              "example": "bgcolor(\"black\")\ncolor(\"cyan\")\npensize(2)\nforward(40)\ncolor(\"yellow\")\nforward(40)",
              "check": {
                "rules": [
                  {
                    "type": "drawingStyle",
                    "colors": 2,
                    "width": 6,
                    "contrast": true,
                    "label": "Two visible colors, both thick"
                  },
                  {
                    "type": "exactCalls",
                    "commands": [
                      "forward"
                    ],
                    "count": 2,
                    "label": "Two strokes"
                  }
                ]
              },
              "tip": "Use Step to find the first command whose result differs from your prediction."
            },
            {
              "id": "1-10-make-color-reason",
              "title": "Check your understanding.",
              "body": "Read the code before running it.",
              "task": "Choose a prediction, then check it. Use Run or Step to test your reasoning.",
              "example": "pensize(10)\nforward(30)\npensize(2)\nforward(30)",
              "question": {
                "id": "1-10-make-color-reason",
                "prompt": "What changes in the second segment?",
                "choices": [
                  "Its length",
                  "Its thickness",
                  "Its direction"
                ],
                "answer": 1,
                "explanation": "pensize() changes stroke width. Both movements still use the same distance and heading."
              },
              "lab": "pensize(10)\nforward(30)\npensize(2)\nforward(30)"
            },
            {
              "id": "1-10-make-color-evidence",
              "title": "Keep evidence of your thinking.",
              "body": "Use a specific change from your project. Your answer saves on this device.",
              "task": "Pick one color or thickness change. Which later segment did it affect, and which earlier segment stayed unchanged?",
              "response": {
                "id": "1-10-make-color-evidence",
                "prompt": "Pick one color or thickness change. Which later segment did it affect, and which earlier segment stayed unchanged?",
                "placeholder": "Before… After… I observed…"
              }
            },
            {
              "title": "Challenge: finish the neon bolt.",
              "body": "Make it look like one deliberate lightning bolt on a dark background.",
              "task": "Use 5+ segments, 4+ turns, 3 drawing colors, and 2 different pensize() values.",
              "tip": "Your bolt can be tall, wide, or uneven. The examples show different structures."
            }
          ],
          "group": "Color + Style",
          "objective": "Control style before drawing"
        },
        {
          "id": "1-11-solve-style",
          "number": "1.11",
          "title": "Repair the Neon Sign",
          "type": "Solve",
          "available": true,
          "notes": "Broken-style puzzle. Students should diagnose invisible output, weak line weight, and missing color state. The route itself is already valid; keep focus on appearance and command order. Check understanding through the two prediction questions, independent experiment, and saved evidence response. Conference by asking the student to explain the first differing line. A saved explanation is evidence to discuss, not an automatically graded claim.",
          "check": {
            "rules": [
              {
                "type": "exactCalls",
                "commands": [
                  "forward",
                  "backward"
                ],
                "count": 3,
                "label": "Keep exactly three segments"
              },
              {
                "type": "exactCalls",
                "commands": [
                  "left",
                  "right"
                ],
                "count": 2,
                "label": "Keep exactly two turns"
              },
              {
                "type": "drawingStyle",
                "colors": 3,
                "width": 4,
                "contrast": true,
                "label": "Three visible, thick, differently colored strokes",
                "fail": "Set each stroke’s style before drawing it. Every stroke must contrast with the background."
              }
            ]
          },
          "starter": "bgcolor(\"black\")\ncolor(\"black\")\npensize(1)\nforward(70)\nright(60)\ncolor(\"cyan\")\nforward(35)\nleft(120)\nforward(60)",
          "steps": [
            {
              "title": "Run the broken sign.",
              "body": "The program runs, but the first segment disappears.",
              "task": "Press Run and find the style command causing it.",
              "tip": "Compare the first color() with bgcolor()."
            },
            {
              "id": "1-11-solve-style-predict",
              "title": "Predict before running.",
              "body": "Read the code before running it.",
              "task": "Choose a prediction, then check it. Use Run or Step to test your reasoning.",
              "example": "bgcolor(\"black\")\ncolor(\"black\")\nforward(40)",
              "question": {
                "id": "1-11-solve-style-predict",
                "prompt": "Why can a successful run look empty?",
                "choices": [
                  "The pen matches the background",
                  "forward() cannot draw on black",
                  "A turn is required before moving"
                ],
                "answer": 0,
                "explanation": "The stroke is drawn in the same color as the background. A successful run does not guarantee a visible result."
              },
              "lab": "bgcolor(\"black\")\ncolor(\"black\")\nforward(40)"
            },
            {
              "title": "Make the first segment visible.",
              "body": "Do not change the route commands.",
              "task": "Change only the first drawing color and Run.",
              "tip": "The pen and background should not be the same color."
            },
            {
              "title": "Fix the weak line.",
              "body": "The sign should look like a thick neon stroke.",
              "task": "Change pensize() to a value greater than 3 and Run.",
              "tip": "Keep the movement distances and turn angles unchanged."
            },
            {
              "title": "Give the last segment its own color.",
              "body": "The final two segments currently share a color.",
              "task": "Add one color() command so all three segments can use different colors.",
              "tip": "Put the color change immediately before the segment it should affect."
            },
            {
              "id": "1-11-solve-style-transfer",
              "title": "Repair appearance without changing geometry.",
              "body": "This experiment has its own saved code. Your project will return when you leave this step.",
              "task": "Keep movements and turn unchanged. Make both segments visible, differently colored, and thicker than 3.",
              "lab": "bgcolor(\"black\")\ncolor(\"black\")\npensize(2)\nforward(40)\nleft(90)\ncolor(\"cyan\")\nforward(30)",
              "example": "bgcolor(\"black\")\ncolor(\"black\")\npensize(2)\nforward(40)\nleft(90)\ncolor(\"cyan\")\nforward(30)",
              "check": {
                "rules": [
                  {
                    "type": "finalPosition",
                    "x": 40,
                    "y": 30,
                    "tolerance": 1.5,
                    "label": "Finish at the target",
                    "fail": "Trace each move and turn. The endpoint does not reach the target yet."
                  },
                  {
                    "type": "finalHeading",
                    "heading": 90,
                    "tolerance": 1,
                    "label": "Finish facing 90°",
                    "fail": "Check the direction left by the final turn."
                  },
                  {
                    "type": "drawingStyle",
                    "colors": 2,
                    "width": 4,
                    "contrast": true,
                    "label": "Both strokes visible and thick"
                  },
                  {
                    "type": "literalNumbers",
                    "commands": [
                      "forward"
                    ],
                    "values": [
                      40,
                      30
                    ],
                    "prefix": false,
                    "label": "Keep the unchanged values",
                    "fail": "This experiment asks you to change one property while preserving the other values."
                  },
                  {
                    "type": "literalNumbers",
                    "commands": [
                      "left"
                    ],
                    "values": [
                      90
                    ],
                    "prefix": false,
                    "label": "Keep the unchanged values",
                    "fail": "This experiment asks you to change one property while preserving the other values."
                  }
                ]
              },
              "tip": "Use Step to find the first command whose result differs from your prediction."
            },
            {
              "id": "1-11-solve-style-reason",
              "title": "Check your understanding.",
              "body": "Read the code before running it.",
              "task": "Choose a prediction, then check it. Use Run or Step to test your reasoning.",
              "example": "forward(40)\ncolor(\"red\")",
              "question": {
                "id": "1-11-solve-style-reason",
                "prompt": "Where must the color change move to color that line red?",
                "choices": [
                  "Before forward(40)",
                  "After another turn",
                  "At the end of the program"
                ],
                "answer": 0,
                "explanation": "A style must be set before the drawing command it should affect."
              },
              "lab": "forward(40)\ncolor(\"red\")"
            },
            {
              "id": "1-11-solve-style-evidence",
              "title": "Keep evidence of your thinking.",
              "body": "Use a specific change from your project. Your answer saves on this device.",
              "task": "Record a style-only repair. How did you verify the route itself stayed the same?",
              "response": {
                "id": "1-11-solve-style-evidence",
                "prompt": "Record a style-only repair. How did you verify the route itself stayed the same?",
                "placeholder": "Before… After… I observed…"
              }
            },
            {
              "title": "Final repair.",
              "body": "The route should stay exactly three segments with two turns.",
              "task": "Run from a clean start with all three segments visible, thick, and differently colored.",
              "tip": "You are repairing style, not rebuilding the path."
            }
          ],
          "group": "Color + Style",
          "visuals": [
            {
              "label": "Goal: all visible",
              "bg": "#111318",
              "paths": [
                {
                  "points": [
                    [
                      24,
                      30
                    ],
                    [
                      84,
                      30
                    ]
                  ],
                  "stroke": "#67e8f9",
                  "width": 7
                },
                {
                  "points": [
                    [
                      84,
                      30
                    ],
                    [
                      62,
                      53
                    ]
                  ],
                  "stroke": "#f472b6",
                  "width": 7
                },
                {
                  "points": [
                    [
                      62,
                      53
                    ],
                    [
                      118,
                      53
                    ]
                  ],
                  "stroke": "#fde047",
                  "width": 7
                }
              ]
            }
          ],
          "objective": "Control style before drawing"
        },
        {
          "id": "1-12-create-night",
          "number": "1.12",
          "title": "Design an Arcade Badge",
          "type": "Create",
          "available": true,
          "notes": "Open style capstone. Students choose a recognizable badge direction—bolt, maze, signal, or another angular icon. Requirements assess use of style and movement without prescribing one drawing. Check understanding through the two prediction questions, independent experiment, and saved evidence response. Conference by asking the student to explain the first differing line. A saved explanation is evidence to discuss, not an automatically graded claim.",
          "check": {
            "rules": [
              {
                "type": "minCalls",
                "commands": [
                  "bgcolor"
                ],
                "count": 1,
                "fail": "Set a background color.",
                "label": "Set a background"
              },
              {
                "type": "minDistinctStrings",
                "commands": [
                  "color"
                ],
                "count": 3,
                "fail": "Use at least three drawing colors.",
                "label": "3 drawing colors"
              },
              {
                "type": "minDistinctNumbers",
                "commands": [
                  "pensize"
                ],
                "count": 2,
                "fail": "Use at least two line thicknesses.",
                "label": "2 line thicknesses"
              },
              {
                "type": "minCalls",
                "commands": [
                  "forward",
                  "backward"
                ],
                "count": 6,
                "fail": "Draw at least six visible movement segments.",
                "label": "6+ visible segments"
              },
              {
                "type": "minCalls",
                "commands": [
                  "left",
                  "right"
                ],
                "count": 4,
                "fail": "Use at least four turns.",
                "label": "4+ turns"
              }
            ]
          },
          "starter": "# Design an arcade-style badge below\n",
          "visuals": [
            {
              "label": "Bolt badge",
              "bg": "#111827",
              "paths": [
                {
                  "points": [
                    [
                      22,
                      18
                    ],
                    [
                      84,
                      18
                    ],
                    [
                      58,
                      45
                    ],
                    [
                      108,
                      45
                    ],
                    [
                      76,
                      82
                    ],
                    [
                      142,
                      82
                    ]
                  ],
                  "stroke": "#67e8f9",
                  "width": 6
                },
                {
                  "points": [
                    [
                      58,
                      45
                    ],
                    [
                      108,
                      45
                    ]
                  ],
                  "stroke": "#fde047",
                  "width": 9
                }
              ]
            },
            {
              "label": "Maze badge",
              "bg": "#151827",
              "paths": [
                {
                  "points": [
                    [
                      22,
                      78
                    ],
                    [
                      22,
                      28
                    ],
                    [
                      62,
                      28
                    ],
                    [
                      62,
                      60
                    ],
                    [
                      102,
                      60
                    ],
                    [
                      102,
                      20
                    ],
                    [
                      140,
                      20
                    ]
                  ],
                  "stroke": "#f472b6",
                  "width": 7
                },
                {
                  "points": [
                    [
                      62,
                      28
                    ],
                    [
                      62,
                      60
                    ]
                  ],
                  "stroke": "#86efac",
                  "width": 4
                }
              ]
            },
            {
              "label": "Signal badge",
              "bg": "#101620",
              "paths": [
                {
                  "points": [
                    [
                      24,
                      76
                    ],
                    [
                      52,
                      48
                    ],
                    [
                      80,
                      76
                    ],
                    [
                      108,
                      48
                    ],
                    [
                      136,
                      76
                    ]
                  ],
                  "stroke": "#fde047",
                  "width": 6
                },
                {
                  "points": [
                    [
                      52,
                      48
                    ],
                    [
                      80,
                      20
                    ],
                    [
                      108,
                      48
                    ]
                  ],
                  "stroke": "#67e8f9",
                  "width": 4
                }
              ]
            }
          ],
          "steps": [
            {
              "title": "Choose a badge direction.",
              "body": "Build a bolt, maze, signal icon, or another sharp arcade-style symbol.",
              "task": "Set a background color, a drawing color, and pensize(), then draw your first segment.",
              "tip": "Start with one recognizable direction instead of adding random lines."
            },
            {
              "id": "1-12-create-night-predict",
              "title": "Predict before running.",
              "body": "Read the code before running it.",
              "task": "Choose a prediction, then check it. Use Run or Step to test your reasoning.",
              "example": "color(\"red\")\nforward(30)\ncolor(\"blue\")\nforward(30)",
              "question": {
                "id": "1-12-create-night-predict",
                "prompt": "Which choice creates a visible corner?",
                "choices": [
                  "Change blue to green",
                  "Insert a turn between the movements",
                  "Increase pensize()"
                ],
                "answer": 1,
                "explanation": "Color and width alter appearance. A turn between movements changes the path’s geometry."
              },
              "lab": "color(\"red\")\nforward(30)\ncolor(\"blue\")\nforward(30)"
            },
            {
              "title": "Build the silhouette.",
              "body": "The outside shape should become readable before you decorate it.",
              "task": "Reach at least four visible segments and Run.",
              "tip": "Use turns and different distances to shape the badge."
            },
            {
              "title": "Add color changes.",
              "body": "Different sections can feel like separate neon tubes.",
              "task": "Use at least three drawing colors.",
              "tip": "Place each color() before the segment you want it to affect."
            },
            {
              "title": "Add thickness contrast.",
              "body": "One part of the badge should stand out more than another.",
              "task": "Use at least two different pensize() values.",
              "tip": "A thicker center or edge can create a focal point."
            },
            {
              "title": "Finish the icon.",
              "body": "Keep developing the same badge instead of starting a second unrelated drawing.",
              "task": "Reach 6+ visible segments and 4+ turns.",
              "tip": "The checker looks for the structure and style requirements, not one exact picture."
            },
            {
              "id": "1-12-create-night-transfer",
              "title": "Change style; keep structure.",
              "body": "This experiment has its own saved code. Your project will return when you leave this step.",
              "task": "Keep both moves and the turn. Give the second segment a contrasting new color and a thicker stroke.",
              "lab": "bgcolor(\"black\")\ncolor(\"cyan\")\npensize(6)\nforward(40)\nleft(90)\nforward(20)",
              "example": "bgcolor(\"black\")\ncolor(\"cyan\")\npensize(6)\nforward(40)\nleft(90)\nforward(20)",
              "check": {
                "rules": [
                  {
                    "type": "finalPosition",
                    "x": 40,
                    "y": 20,
                    "tolerance": 1.5,
                    "label": "Finish at the target",
                    "fail": "Trace each move and turn. The endpoint does not reach the target yet."
                  },
                  {
                    "type": "finalHeading",
                    "heading": 90,
                    "tolerance": 1,
                    "label": "Finish facing 90°",
                    "fail": "Check the direction left by the final turn."
                  },
                  {
                    "type": "drawingStyle",
                    "colors": 2,
                    "width": 6,
                    "contrast": true,
                    "label": "Two visible colors",
                    "increasingWidth": true
                  },
                  {
                    "type": "literalNumbers",
                    "commands": [
                      "forward"
                    ],
                    "values": [
                      40,
                      20
                    ],
                    "prefix": false,
                    "label": "Keep the unchanged values",
                    "fail": "This experiment asks you to change one property while preserving the other values."
                  },
                  {
                    "type": "literalNumbers",
                    "commands": [
                      "left"
                    ],
                    "values": [
                      90
                    ],
                    "prefix": false,
                    "label": "Keep the unchanged values",
                    "fail": "This experiment asks you to change one property while preserving the other values."
                  }
                ]
              },
              "tip": "Use Step to find the first command whose result differs from your prediction."
            },
            {
              "id": "1-12-create-night-reason",
              "title": "Check your understanding.",
              "body": "Read the code before running it.",
              "task": "Choose a prediction, then check it. Use Run or Step to test your reasoning.",
              "example": "bgcolor(\"black\")\ncolor(\"cyan\")\nforward(30)\ncolor(\"yellow\")\nforward(30)",
              "question": {
                "id": "1-12-create-night-reason",
                "prompt": "Which commands would you change to make the entire badge longer?",
                "choices": [
                  "The movement distances",
                  "Only the color names",
                  "Only bgcolor()"
                ],
                "answer": 0,
                "explanation": "Appearance and geometry use different commands. Decide which property you intend to revise first."
              },
              "lab": "bgcolor(\"black\")\ncolor(\"cyan\")\nforward(30)\ncolor(\"yellow\")\nforward(30)"
            },
            {
              "id": "1-12-create-night-evidence",
              "title": "Keep evidence of your thinking.",
              "body": "Use a specific change from your project. Your answer saves on this device.",
              "task": "Name your badge’s feature. Explain one geometry choice and one style choice that support it.",
              "response": {
                "id": "1-12-create-night-evidence",
                "prompt": "Name your badge’s feature. Explain one geometry choice and one style choice that support it.",
                "placeholder": "Before… After… I observed…"
              }
            },
            {
              "title": "Final challenge: make it feel intentional.",
              "body": "Your badge should read as one symbol when you look at the Turtle world.",
              "task": "Clear Run, run it from the top, and check your code.",
              "tip": "Bolt, maze, signal, letter-like mark, and invented arcade symbols all work."
            }
          ],
          "group": "Color + Style",
          "objective": "Control style before drawing"
        },
        {
          "id": "1-13-make-ascii",
          "number": "1.13",
          "title": "Make Block Art",
          "type": "Make",
          "available": true,
          "notes": "Introduce print() as visible output. Keep the focus on one printed line at a time and on spacing. Unicode block characters are intentional; students should see that text can be used as a visual medium. Check understanding through the two prediction questions, independent experiment, and saved evidence response. Conference by asking the student to explain the first differing line. A saved explanation is evidence to discuss, not an automatically graded claim.",
          "check": {
            "rules": [
              {
                "type": "minCalls",
                "commands": [
                  "print"
                ],
                "count": 5,
                "fail": "Print at least five lines.",
                "label": "5+ printed lines"
              },
              {
                "type": "minDistinctStrings",
                "commands": [
                  "print"
                ],
                "count": 3,
                "fail": "Use at least three different printed lines.",
                "label": "3 different lines"
              },
              {
                "type": "requiresAnyCharacter",
                "commands": [
                  "print"
                ],
                "characters": [
                  "█",
                  "▓",
                  "░",
                  "#",
                  "*",
                  "|",
                  "/",
                  "\\",
                  "_"
                ],
                "fail": "Use at least one visual character such as █, #, *, |, /, or _.",
                "label": "Use visual characters"
              }
            ]
          },
          "starter": "print(\"  ███  \")\nprint(\" █░░░█ \")\n",
          "visuals": [
            {
              "label": "Block face",
              "ascii": " █████ \n██ ░ ██\n█  ▄  █\n █████ "
            },
            {
              "label": "Mini tower",
              "ascii": "  ██  \n ████ \n██████\n  ██  "
            },
            {
              "label": "Signal bars",
              "ascii": "█      \n██     \n████   \n██████ "
            },
            {
              "label": "Tiny tree",
              "ascii": "   ▲   \n  ▲▲▲  \n ▲▲▲▲▲ \n   █   "
            },
            {
              "label": "Shading",
              "ascii": "░░▒▒▓▓██\n░▒▓█████\n░░▒▒▓▓██"
            },
            {
              "label": "Arrow",
              "ascii": "   █   \n  ███  \n █████ \n   █   \n   █   "
            }
          ],
          "steps": [
            {
              "title": "Meet the block characters.",
              "body": "░ is light shade, ▒ is medium shade, ▓ is dark shade, and █ is a full block. They are regular text characters that Python can print.",
              "task": "Click one in the symbol palette, paste it inside a print() string, and Run.",
              "tip": "More filled block = darker-looking text art."
            },
            {
              "title": "Build one row with shading.",
              "body": "Mix blocks and spaces inside one print() string.",
              "task": "Make a row that uses at least two of ░ ▒ ▓ █, then Run.",
              "tip": "Example idea: █▓▒░ — copy the symbols from the palette instead of searching for them."
            },
            {
              "title": "Add the middle of the face.",
              "body": "Add a third print() line below the starter.",
              "task": "Print a line that uses blocks or another symbol to make the center different.",
              "tip": "Example characters: █ ▓ ░ # * | _"
            },
            {
              "title": "Add another row.",
              "body": "ASCII art is built one row at a time.",
              "task": "Add a fourth print() line and run again.",
              "tip": "Keep the opening and closing quotation marks around every row."
            },
            {
              "title": "Change the width.",
              "body": "Add or remove spaces and symbols inside one string.",
              "task": "Run and watch how spacing changes the shape.",
              "tip": "Python prints the characters exactly in the order you type them."
            },
            {
              "id": "1-13-make-ascii-predict",
              "title": "Predict before running.",
              "body": "Read the code before running it.",
              "task": "Choose a prediction, then check it. Use Run or Step to test your reasoning.",
              "example": "print(\"█ █\")\nprint(\"███\")",
              "question": {
                "id": "1-13-make-ascii-predict",
                "prompt": "Does the space in the first row disappear?",
                "choices": [
                  "Yes, Python ignores spaces in quotes",
                  "No, it is one printed character"
                ],
                "answer": 1,
                "explanation": "Spaces inside a string are part of the printed text. They contribute to its width and alignment."
              },
              "lab": "print(\"█ █\")\nprint(\"███\")"
            },
            {
              "id": "1-13-make-ascii-transfer",
              "title": "Repair a hollow tile.",
              "body": "This experiment has its own saved code. Your project will return when you leave this step.",
              "task": "Keep three print() calls. Make all three rows five characters wide, with a three-space opening in the middle row.",
              "lab": "print(\"█████\")\nprint(\"█ █\")\nprint(\"█████\")",
              "example": "print(\"█████\")\nprint(\"█ █\")\nprint(\"█████\")",
              "check": {
                "rules": [
                  {
                    "type": "exactCalls",
                    "commands": [
                      "print"
                    ],
                    "count": 3,
                    "label": "Three rows"
                  },
                  {
                    "type": "requiresPrintString",
                    "value": "█   █",
                    "label": "Three-space opening"
                  }
                ]
              },
              "tip": "Use Step to find the first command whose result differs from your prediction."
            },
            {
              "id": "1-13-make-ascii-reason",
              "title": "Check your understanding.",
              "body": "Read the code before running it.",
              "task": "Choose a prediction, then check it. Use Run or Step to test your reasoning.",
              "example": "print(\"  █  \")",
              "question": {
                "id": "1-13-make-ascii-reason",
                "prompt": "How many characters are printed before the newline?",
                "choices": [
                  "One",
                  "Three",
                  "Five"
                ],
                "answer": 2,
                "explanation": "Two spaces, a block, and two more spaces make five characters. The quotes delimit the string and are not printed."
              },
              "lab": "print(\"  █  \")"
            },
            {
              "id": "1-13-make-ascii-evidence",
              "title": "Keep evidence of your thinking.",
              "body": "Use a specific change from your project. Your answer saves on this device.",
              "task": "Record a row before and after changing its spaces. How many characters wide is each version?",
              "response": {
                "id": "1-13-make-ascii-evidence",
                "prompt": "Record a row before and after changing its spaces. How many characters wide is each version?",
                "placeholder": "Before… After… I observed…"
              }
            },
            {
              "title": "Challenge: Finish a tiny block picture.",
              "body": "Make a face, tower, signal, creature, or symbol.",
              "task": "Use 5+ printed lines, at least 3 different rows, and at least one visual character such as █, #, *, |, /, \\, or _.",
              "tip": "The examples are ideas only. Your rows can be completely different."
            }
          ],
          "group": "Text + ASCII Art",
          "palette": [
            {
              "char": "░",
              "name": "light shade"
            },
            {
              "char": "▒",
              "name": "medium shade"
            },
            {
              "char": "▓",
              "name": "dark shade"
            },
            {
              "char": "█",
              "name": "full block"
            },
            {
              "char": "│",
              "name": "vertical line"
            },
            {
              "char": "─",
              "name": "horizontal line"
            },
            {
              "char": "┌",
              "name": "top-left corner"
            },
            {
              "char": "┐",
              "name": "top-right corner"
            },
            {
              "char": "└",
              "name": "bottom-left corner"
            },
            {
              "char": "┘",
              "name": "bottom-right corner"
            },
            {
              "char": "╱",
              "name": "slash"
            },
            {
              "char": "╲",
              "name": "backslash"
            },
            {
              "char": "●",
              "name": "dot"
            },
            {
              "char": "▲",
              "name": "triangle"
            },
            {
              "char": "#",
              "name": "hash"
            },
            {
              "char": "*",
              "name": "star"
            }
          ],
          "paletteIntro": "Click a symbol to insert it at your code cursor and copy it too. Paste it again with Ctrl+V / Cmd+V.",
          "objective": "Use strings and spaces to communicate"
        },
        {
          "id": "1-14-solve-ascii",
          "number": "1.14",
          "title": "ASCII Repair",
          "type": "Solve",
          "available": true,
          "notes": "This is a spacing and sequencing puzzle. Students should use the output as feedback. Do not provide the completed strings unless needed for accessibility support. Check understanding through the two prediction questions, independent experiment, and saved evidence response. Conference by asking the student to explain the first differing line. A saved explanation is evidence to discuss, not an automatically graded claim.",
          "check": {
            "rules": [
              {
                "type": "exactCalls",
                "commands": [
                  "print"
                ],
                "count": 5,
                "label": "Exactly five rows"
              },
              {
                "type": "requiresPrintString",
                "value": "  ███  ",
                "min": 2,
                "label": "Matching top and bottom"
              },
              {
                "type": "requiresPrintString",
                "value": " █   █ ",
                "min": 2,
                "label": "Matching side rows"
              },
              {
                "type": "requiresPrintString",
                "value": "█  █  █",
                "label": "Keep the center row"
              }
            ]
          },
          "starter": "print(\"  ███\")\nprint(\" █   █ \")\nprint(\"█  █  █\")\nprint(\" █   █\")\nprint(\" ███   \")",
          "visuals": [
            {
              "label": "Target silhouette",
              "ascii": "  ███  \n █   █ \n█  █  █\n █   █ \n  ███  "
            }
          ],
          "steps": [
            {
              "title": "Run the broken picture.",
              "body": "The five rows are meant to form a centered badge, but several spaces are wrong.",
              "task": "Press Run and look for rows that do not line up.",
              "tip": "Do not change the symbols yet. Fix spacing first."
            },
            {
              "id": "1-14-solve-ascii-predict",
              "title": "Predict before running.",
              "body": "Read the code before running it.",
              "task": "Choose a prediction, then check it. Use Run or Step to test your reasoning.",
              "example": "print(\"  ███  \")\nprint(\" █   █ \")",
              "question": {
                "id": "1-14-solve-ascii-predict",
                "prompt": "Why do these rows align?",
                "choices": [
                  "Their strings both have seven character positions",
                  "Python centers strings automatically",
                  "Their quotation marks line up"
                ],
                "answer": 0,
                "explanation": "A monospace output gives each character position the same width. Spaces inside the strings place the visible blocks."
              },
              "lab": "print(\"  ███  \")\nprint(\" █   █ \")"
            },
            {
              "title": "Repair the top and bottom.",
              "body": "The first and last rows should be identical.",
              "task": "Edit spaces until those two rows match.",
              "tip": "Count spaces inside the quotation marks."
            },
            {
              "title": "Repair the side rows.",
              "body": "Rows 2 and 4 should also match.",
              "task": "Edit spaces until the left and right sides line up.",
              "tip": "A monospace font makes every character the same width."
            },
            {
              "title": "Keep the center row.",
              "body": "The middle row is already the widest row.",
              "task": "Run again and make the five rows look centered around it.",
              "tip": "Use the target silhouette only as a visual check."
            },
            {
              "id": "1-14-solve-ascii-transfer",
              "title": "Transfer the spacing idea.",
              "body": "This experiment has its own saved code. Your project will return when you leave this step.",
              "task": "Make top and bottom equal, four characters wide, with one leading space. Keep the middle row unchanged.",
              "lab": "print(\"  ██\")\nprint(\" █  █\")\nprint(\"  ██\")",
              "example": "print(\"  ██\")\nprint(\" █  █\")\nprint(\"  ██\")",
              "check": {
                "rules": [
                  {
                    "type": "exactCalls",
                    "commands": [
                      "print"
                    ],
                    "count": 3,
                    "label": "Keep three rows"
                  },
                  {
                    "type": "requiresPrintString",
                    "value": " ██ ",
                    "min": 2,
                    "label": "Matching four-character edge rows"
                  },
                  {
                    "type": "requiresPrintString",
                    "value": " █  █",
                    "label": "Keep the middle row unchanged"
                  }
                ]
              },
              "tip": "Use Step to find the first command whose result differs from your prediction."
            },
            {
              "id": "1-14-solve-ascii-reason",
              "title": "Check your understanding.",
              "body": "Read the code before running it.",
              "task": "Choose a prediction, then check it. Use Run or Step to test your reasoning.",
              "example": "print(\" █ \")\nprint(\"█ █\")\nprint(\" █ \")",
              "question": {
                "id": "1-14-solve-ascii-reason",
                "prompt": "Which edits make the middle row wider without moving the edge rows?",
                "choices": [
                  "Add spaces inside the middle string",
                  "Add spaces before print()",
                  "Change the quote marks"
                ],
                "answer": 0,
                "explanation": "Leading indentation is Python syntax. Spaces inside the quoted string are the characters printed in the picture."
              },
              "lab": "print(\" █ \")\nprint(\"█ █\")\nprint(\" █ \")"
            },
            {
              "id": "1-14-solve-ascii-evidence",
              "title": "Keep evidence of your thinking.",
              "body": "Use a specific change from your project. Your answer saves on this device.",
              "task": "Choose a misaligned row. Record its old and repaired text, then identify the spaces that changed.",
              "response": {
                "id": "1-14-solve-ascii-evidence",
                "prompt": "Choose a misaligned row. Record its old and repaired text, then identify the spaces that changed.",
                "placeholder": "Before… After… I observed…"
              }
            },
            {
              "title": "Final check.",
              "body": "The badge should be centered and symmetrical.",
              "task": "Leave all five print() lines in the program and check your code.",
              "tip": "The checker looks at the exact repaired rows."
            }
          ],
          "group": "Text + ASCII Art",
          "palette": [
            {
              "char": "░",
              "name": "light shade"
            },
            {
              "char": "▒",
              "name": "medium shade"
            },
            {
              "char": "▓",
              "name": "dark shade"
            },
            {
              "char": "█",
              "name": "full block"
            },
            {
              "char": "│",
              "name": "vertical line"
            },
            {
              "char": "─",
              "name": "horizontal line"
            },
            {
              "char": "┌",
              "name": "top-left corner"
            },
            {
              "char": "┐",
              "name": "top-right corner"
            },
            {
              "char": "└",
              "name": "bottom-left corner"
            },
            {
              "char": "┘",
              "name": "bottom-right corner"
            },
            {
              "char": "╱",
              "name": "slash"
            },
            {
              "char": "╲",
              "name": "backslash"
            },
            {
              "char": "●",
              "name": "dot"
            },
            {
              "char": "▲",
              "name": "triangle"
            },
            {
              "char": "#",
              "name": "hash"
            },
            {
              "char": "*",
              "name": "star"
            }
          ],
          "paletteIntro": "Click a symbol to insert it at your code cursor and copy it too. Paste it again with Ctrl+V / Cmd+V.",
          "objective": "Use strings and spaces to communicate"
        },
        {
          "id": "1-15-create-ascii",
          "number": "1.15",
          "title": "ASCII Badge",
          "type": "Create",
          "available": true,
          "notes": "Open-ended text-art challenge. Celebrate variation. Students can use Unicode block characters or ordinary keyboard symbols. The checker should enforce structure, not an exact image. Check understanding through the two prediction questions, independent experiment, and saved evidence response. Conference by asking the student to explain the first differing line. A saved explanation is evidence to discuss, not an automatically graded claim.",
          "check": {
            "rules": [
              {
                "type": "minCalls",
                "commands": [
                  "print"
                ],
                "count": 6,
                "fail": "Print at least six rows.",
                "label": "6+ printed rows"
              },
              {
                "type": "minDistinctStrings",
                "commands": [
                  "print"
                ],
                "count": 4,
                "fail": "Use at least four different rows.",
                "label": "4 different rows"
              },
              {
                "type": "requiresAnyCharacter",
                "commands": [
                  "print"
                ],
                "characters": [
                  "█",
                  "▓",
                  "░",
                  "#",
                  "*",
                  "|",
                  "/",
                  "\\",
                  "_",
                  "-"
                ],
                "fail": "Use visual characters in the badge.",
                "label": "Use visual characters"
              },
              {
                "type": "minLiteralCharacters",
                "commands": [
                  "print"
                ],
                "count": 30,
                "fail": "Build a larger design with at least 30 printed characters total.",
                "label": "30+ printed characters"
              }
            ]
          },
          "starter": "# Build an ASCII badge in the output panel\n",
          "visuals": [
            {
              "label": "Pixel heart",
              "ascii": " ██ ██ \n███████\n █████ \n  ███  \n   █   "
            },
            {
              "label": "Cat badge",
              "ascii": " /\\_/\\ \n| o o |\n|  ^  |\n \\___/ "
            },
            {
              "label": "Battery",
              "ascii": "┌──────┐\n│████░░│\n└──────┘"
            },
            {
              "label": "Tiny house",
              "ascii": "   ▲   \n  ▲▲▲  \n ┌───┐ \n │ █ │ \n └───┘ "
            },
            {
              "label": "Rocket",
              "ascii": "  ▲  \n /█\\ \n ███ \n ███ \n ▓▓▓ "
            },
            {
              "label": "Power bars",
              "ascii": "█░░░░░\n██░░░░\n████░░\n██████"
            }
          ],
          "steps": [
            {
              "title": "Choose a shape.",
              "body": "A badge can be a symbol, creature, logo-like mark, meter, or tiny scene.",
              "task": "Write one print() row and run it.",
              "tip": "Try █ ▓ ░ # * / \\ | _ - and spaces."
            },
            {
              "id": "1-15-create-ascii-predict",
              "title": "Predict before running.",
              "body": "Read the code before running it.",
              "task": "Choose a prediction, then check it. Use Run or Step to test your reasoning.",
              "example": "print(\"[██░░]\")",
              "question": {
                "id": "1-15-create-ascii-predict",
                "prompt": "Which part changes a bar’s filled amount?",
                "choices": [
                  "Spaces before print()",
                  "The characters between the brackets",
                  "The name print"
                ],
                "answer": 1,
                "explanation": "The content of the string makes the meter. Keeping the brackets and replacing fill characters changes its state."
              },
              "lab": "print(\"[██░░]\")"
            },
            {
              "title": "Build downward.",
              "body": "Add rows one at a time instead of typing the whole picture first.",
              "task": "Reach at least three printed rows and run again.",
              "tip": "If alignment looks wrong, change spaces before changing the whole design."
            },
            {
              "title": "Make the silhouette clearer.",
              "body": "Use wider and narrower rows to shape the outside edge.",
              "task": "Reach at least six rows.",
              "tip": "Repeating a character can create strong visual blocks."
            },
            {
              "title": "Add one detail.",
              "body": "Change the inside of one or two rows to create eyes, a stripe, a gap, or another feature.",
              "task": "Run and keep the overall shape readable.",
              "tip": "Small changes inside the silhouette are usually enough."
            },
            {
              "id": "1-15-create-ascii-transfer",
              "title": "Make the meter tell the truth.",
              "body": "This experiment has its own saved code. Your project will return when you leave this step.",
              "task": "Keep three rows. Show three full blocks and one shaded block, and update the numeric label to 3 / 4.",
              "lab": "print(\"READY\")\nprint(\"[██░░]\")\nprint(\"2 / 4\")",
              "example": "print(\"READY\")\nprint(\"[██░░]\")\nprint(\"2 / 4\")",
              "check": {
                "rules": [
                  {
                    "type": "exactCalls",
                    "commands": [
                      "print"
                    ],
                    "count": 3,
                    "label": "Three rows"
                  },
                  {
                    "type": "requiresPrintString",
                    "value": "[███░]",
                    "label": "Three of four blocks filled"
                  },
                  {
                    "type": "requiresPrintString",
                    "value": "3 / 4",
                    "label": "Label matches the bar"
                  }
                ]
              },
              "tip": "Use Step to find the first command whose result differs from your prediction."
            },
            {
              "id": "1-15-create-ascii-reason",
              "title": "Check your understanding.",
              "body": "Read the code before running it.",
              "task": "Choose a prediction, then check it. Use Run or Step to test your reasoning.",
              "example": "print(\"[██░░]\")\nprint(\"4 / 4\")",
              "question": {
                "id": "1-15-create-ascii-reason",
                "prompt": "Why is this output misleading?",
                "choices": [
                  "It has two print() calls",
                  "The numeric label disagrees with the bar",
                  "It uses square brackets"
                ],
                "answer": 1,
                "explanation": "A program can run while communicating contradictory information. Compare the meaning of the two outputs."
              },
              "lab": "print(\"[██░░]\")\nprint(\"4 / 4\")"
            },
            {
              "id": "unit-1-beacon",
              "title": "Unit 1 challenge: repair the signal beacon.",
              "body": "This program runs, but its drawing and printed meter need repairs. Use what you learned about order, movement, circles, style, and strings.",
              "task": "Keep the endpoint 60 right and 40 above the start. Draw a circle and two differently colored strokes, all visible on black with width 4+. Print a bar and label that both show 3 / 4.",
              "lab": "bgcolor(\"black\")\ncolor(\"black\")\npensize(2)\nforward(60)\nleft(90)\nforward(40)\ncircle(15)\nprint(\"[██░░]\")\nprint(\"3 / 4\")",
              "check": {
                "rules": [
                  {
                    "type": "finalPosition",
                    "x": 60,
                    "y": 40,
                    "tolerance": 1.5,
                    "label": "Keep the endpoint",
                    "fail": "Keep the geometry while repairing the appearance."
                  },
                  {
                    "type": "minCalls",
                    "commands": [
                      "circle"
                    ],
                    "count": 1,
                    "label": "Include a circle"
                  },
                  {
                    "type": "drawingStyle",
                    "colors": 2,
                    "width": 4,
                    "contrast": true,
                    "label": "Visible contrasting strokes, width 4+"
                  },
                  {
                    "type": "requiresPrintString",
                    "value": "[███░]",
                    "label": "Meter shows three of four"
                  },
                  {
                    "type": "requiresPrintString",
                    "value": "3 / 4",
                    "label": "Label agrees with meter"
                  }
                ]
              },
              "tip": "Repair one property at a time. Keep a working version between changes."
            },
            {
              "id": "1-15-create-ascii-evidence",
              "title": "Keep evidence of your thinking.",
              "body": "Use a specific change from your project. Your answer saves on this device.",
              "task": "Record one repair from the signal beacon and one revision from your own ASCII badge. What evidence showed each change worked?",
              "response": {
                "id": "1-15-create-ascii-evidence",
                "prompt": "Record one repair from the signal beacon and one revision from your own ASCII badge. What evidence showed each change worked?",
                "placeholder": "Before… After… I observed…"
              }
            },
            {
              "title": "Challenge: Finish an original ASCII badge.",
              "body": "It should look intentional in the output panel.",
              "task": "Use 6+ rows, 4 different rows, visual characters, and at least 30 printed characters total.",
              "tip": "A heart, creature, battery meter, tiny building, initials, or invented symbol all work."
            }
          ],
          "group": "Text + ASCII Art",
          "palette": [
            {
              "char": "░",
              "name": "light shade"
            },
            {
              "char": "▒",
              "name": "medium shade"
            },
            {
              "char": "▓",
              "name": "dark shade"
            },
            {
              "char": "█",
              "name": "full block"
            },
            {
              "char": "│",
              "name": "vertical line"
            },
            {
              "char": "─",
              "name": "horizontal line"
            },
            {
              "char": "┌",
              "name": "top-left corner"
            },
            {
              "char": "┐",
              "name": "top-right corner"
            },
            {
              "char": "└",
              "name": "bottom-left corner"
            },
            {
              "char": "┘",
              "name": "bottom-right corner"
            },
            {
              "char": "╱",
              "name": "slash"
            },
            {
              "char": "╲",
              "name": "backslash"
            },
            {
              "char": "●",
              "name": "dot"
            },
            {
              "char": "▲",
              "name": "triangle"
            },
            {
              "char": "#",
              "name": "hash"
            },
            {
              "char": "*",
              "name": "star"
            }
          ],
          "paletteIntro": "Click a symbol to insert it at your code cursor and copy it too. Paste it again with Ctrl+V / Cmd+V.",
          "objective": "Use strings and spaces to communicate"
        }
      ]
    },
    {
      "id": "unit-2",
      "number": "2",
      "title": "Loops + Repetition",
      "description": "Build repeated code first, solve repetition problems, then create with loops.",
      "lessons": [
        {
          "id": "2-1-make-loop",
          "number": "2.1",
          "title": "Make a Loop",
          "type": "Make",
          "available": false
        },
        {
          "id": "2-2-solve-loop",
          "number": "2.2",
          "title": "Loop Puzzle",
          "type": "Solve",
          "available": false
        },
        {
          "id": "2-3-create-loop",
          "number": "2.3",
          "title": "Loop Design",
          "type": "Create",
          "available": false
        },
        {
          "id": "2-4-make-shapes",
          "number": "2.4",
          "title": "Make Shapes with Loops",
          "type": "Make",
          "available": false
        },
        {
          "id": "2-5-solve-pattern",
          "number": "2.5",
          "title": "Pattern Puzzle",
          "type": "Solve",
          "available": false
        },
        {
          "id": "2-6-create-pattern",
          "number": "2.6",
          "title": "Pattern Project",
          "type": "Create",
          "available": false
        }
      ]
    },
    {
      "id": "unit-3",
      "number": "3",
      "title": "Functions",
      "description": "Turn working drawing code into reusable commands, then use functions independently.",
      "lessons": [
        {
          "id": "3-1-make-function",
          "number": "3.1",
          "title": "Make a Function",
          "type": "Make",
          "available": false
        },
        {
          "id": "3-2-solve-function",
          "number": "3.2",
          "title": "Function Puzzle",
          "type": "Solve",
          "available": false
        },
        {
          "id": "3-3-create-function",
          "number": "3.3",
          "title": "Function Design",
          "type": "Create",
          "available": false
        },
        {
          "id": "3-4-make-parameters",
          "number": "3.4",
          "title": "Make Parameters",
          "type": "Make",
          "available": false
        },
        {
          "id": "3-5-solve-parameters",
          "number": "3.5",
          "title": "Parameter Puzzle",
          "type": "Solve",
          "available": false
        },
        {
          "id": "3-6-create-parameters",
          "number": "3.6",
          "title": "Reusable Drawing Project",
          "type": "Create",
          "available": false
        }
      ]
    },
    {
      "id": "unit-4",
      "number": "4",
      "title": "Position + Design",
      "description": "Move without drawing, place shapes, and combine ideas into larger scenes.",
      "lessons": [
        {
          "id": "4-1-make-position",
          "number": "4.1",
          "title": "Make Positioned Shapes",
          "type": "Make",
          "available": false
        },
        {
          "id": "4-2-solve-position",
          "number": "4.2",
          "title": "Position Puzzle",
          "type": "Solve",
          "available": false
        },
        {
          "id": "4-3-create-scene",
          "number": "4.3",
          "title": "Scene Design",
          "type": "Create",
          "available": false
        }
      ]
    }
  ]
};
