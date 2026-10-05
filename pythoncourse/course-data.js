window.PYTHON_COURSE = {
  "title": "Python Turtle",
  "subtitle": "Make one. Solve one. Create one.",
  "units": [
    {
      "id": "unit-1",
      "number": "1",
      "title": "Turtle Basics",
      "description": "Learn movement, circle geometry, execution and debugging, drawing state, and text output. Every lesson includes a typed example, named line edits, predictions that run, a fixed assignment, and an independent design.",
      "lessons": [
        {
          "id": "1-1-make-path",
          "number": "1.1",
          "title": "Make a Path",
          "type": "Make",
          "available": true,
          "notes": "Purpose: Separate distance from direction. This is the foundation for planning routes and later repeating them with loops. Students type the example and test the named line changes. Predictions record the first answer as well as the revised answer. A wrong first prediction can become a checked, correct explanation after observation. Fixed assignments must pass before the creative project opens. Discuss the saved note and ask the student to identify the command responsible for the observed result. Project checks grade the stated measurable requirements; the visual idea and quality of the design remain a teacher conversation. Ask the student to change one value and predict which visible property it controls.",
          "check": {
            "rules": [
              {
                "type": "allowedCommands",
                "label": "Use only the commands in this assignment",
                "commands": [
                  "forward",
                  "backward",
                  "left",
                  "right"
                ],
                "fail": "Use one command per line, with literal values. Comments are allowed. Loops and functions come later."
              },
              {
                "type": "minCalls",
                "label": "4+ movement commands",
                "commands": [
                  "forward",
                  "backward"
                ],
                "count": 4,
                "fail": "Check the highlighted requirement and compare your output with the target."
              },
              {
                "type": "minCalls",
                "label": "2+ turns",
                "commands": [
                  "left",
                  "right"
                ],
                "count": 2,
                "fail": "Check the highlighted requirement and compare your output with the target."
              },
              {
                "type": "minCalls",
                "label": "Use backward() to retrace",
                "commands": [
                  "backward"
                ],
                "count": 1,
                "fail": "Check the highlighted requirement and compare your output with the target."
              },
              {
                "type": "minDistinctNumbers",
                "label": "2+ movement distances",
                "commands": [
                  "forward",
                  "backward"
                ],
                "count": 2,
                "fail": "Check the highlighted requirement and compare your output with the target."
              },
              {
                "type": "drawingBounds",
                "label": "Keep the drawing inside the grid",
                "limit": 190,
                "fail": "A line or circle extends beyond the grid. Reduce a distance or radius, or change the route."
              }
            ]
          },
          "starter": "",
          "visuals": [
            {
              "label": "Pixel key",
              "bg": "#fbfaf6",
              "caption": "Retrace a stem to add a branch.",
              "previewCode": "forward(70)\nbackward(25)\nleft(90)\nforward(20)\nbackward(20)\nright(90)\nforward(25)\nright(90)\nforward(15)",
              "paths": [
                {
                  "points": [
                    [
                      14,
                      54.714
                    ],
                    [
                      146,
                      54.714
                    ],
                    [
                      98.857,
                      54.714
                    ],
                    [
                      98.857,
                      17
                    ],
                    [
                      98.857,
                      54.714
                    ],
                    [
                      146,
                      54.714
                    ],
                    [
                      146,
                      83
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 3.7714285714285714
                }
              ],
              "circles": []
            },
            {
              "label": "Signal arrow",
              "bg": "#fbfaf6",
              "caption": "A shaft and two branches.",
              "previewCode": "forward(70)\nleft(135)\nforward(25)\nbackward(25)\nleft(90)\nforward(25)",
              "paths": [
                {
                  "points": [
                    [
                      14,
                      50
                    ],
                    [
                      146,
                      50
                    ],
                    [
                      112.665,
                      16.665
                    ],
                    [
                      146,
                      50
                    ],
                    [
                      112.665,
                      83.335
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 3.7714285714285714
                }
              ],
              "circles": []
            },
            {
              "label": "Mountain signal",
              "bg": "#fbfaf6",
              "caption": "Change the angles to change the silhouette.",
              "previewCode": "forward(25)\nleft(45)\nforward(50)\nright(90)\nforward(50)\nbackward(20)",
              "paths": [
                {
                  "points": [
                    [
                      14,
                      74.38
                    ],
                    [
                      48.479,
                      74.38
                    ],
                    [
                      97.239,
                      25.62
                    ],
                    [
                      146,
                      74.38
                    ],
                    [
                      126.496,
                      54.876
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2.7583129196171097
                }
              ],
              "circles": []
            }
          ],
          "steps": [
            {
              "id": "1-1-make-path-type-example",
              "title": "Type the example.",
              "body": "The turtle starts at (0, 0), facing right. forward() moves along its current direction; left() turns in place.",
              "task": "Start with an empty editor. Type the numbered commands. Run after each new movement or drawing command.",
              "phase": "Type the example",
              "example": "forward(80)\nleft(90)\nforward(80)",
              "numbered": true,
              "focusLines": [
                1,
                2,
                3
              ],
              "draftId": "example"
            },
            {
              "id": "1-1-make-path-distance",
              "title": "Lengthen the first side.",
              "body": "The number in forward() is a distance in grid units.",
              "task": "On line 1, change forward(80) to forward(140). Keep lines 2–3. Run and compare the first side.",
              "phase": "Change specific lines",
              "focusLines": [
                1
              ],
              "draftId": "example"
            },
            {
              "id": "1-1-make-path-angle",
              "title": "Change the corner.",
              "body": "The number in left() is a turn in degrees. A 90° turn makes a square corner.",
              "task": "Restore forward(80) on line 1. Change line 2 to left(45). Run. Then restore left(90) and Run again.",
              "phase": "Change specific lines",
              "focusLines": [
                1,
                2
              ],
              "draftId": "example"
            },
            {
              "id": "1-1-make-path-predict",
              "title": "Predict a backward move.",
              "body": "Commit to a prediction before checking. Then compare it with the run.",
              "task": "Choose an answer, then Check prediction & run. Watch again to follow the highlighted lines.",
              "phase": "Predict and test",
              "example": "forward(60)\nleft(90)\nbackward(20)",
              "lab": "forward(60)\nleft(90)\nbackward(20)",
              "numbered": true,
              "draftId": "prediction-predict",
              "question": {
                "id": "1-1-make-path-predict",
                "prompt": "Where does line 3 move the turtle?",
                "choices": [
                  "20 units up",
                  "20 units down",
                  "20 units right"
                ],
                "answer": 1,
                "explanation": "Line 2 leaves the turtle facing up. backward(20) moves down while the turtle keeps facing up."
              }
            },
            {
              "id": "1-1-make-path-retrace",
              "title": "Add a branch from a retraced line.",
              "body": "backward() changes position while keeping the same direction.",
              "task": "Keep the original three-line example. Add backward(30) on line 4 and Run. Add right(90) on line 5 and forward(40) on line 6. Run again.",
              "phase": "Change specific lines",
              "focusLines": [
                4,
                5,
                6
              ],
              "draftId": "example"
            },
            {
              "id": "1-1-make-path-reason",
              "title": "Predict two opposite turns.",
              "body": "Commit to a prediction before checking. Then compare it with the run.",
              "task": "Choose an answer, then Check prediction & run. Watch again to follow the highlighted lines.",
              "phase": "Predict and test",
              "example": "left(90)\nright(90)\nforward(25)",
              "lab": "left(90)\nright(90)\nforward(25)",
              "numbered": true,
              "draftId": "prediction-reason",
              "question": {
                "id": "1-1-make-path-reason",
                "prompt": "Where does the final move go?",
                "choices": [
                  "25 units up",
                  "25 units left",
                  "25 units right"
                ],
                "answer": 2,
                "explanation": "The equal turns cancel. Neither turn moves the turtle. The final movement follows the restored right-facing direction."
              }
            },
            {
              "id": "1-1-make-path-evidence",
              "title": "Record one result.",
              "body": "Your notes stay in this lesson and save as you type.",
              "task": "In the first example, line 1 changed from 80 to 140. Which side became longer? Did the 90° corner change? Record both observations.",
              "phase": "Lesson notes",
              "draftId": "example",
              "response": {
                "id": "1-1-make-path-evidence",
                "prompt": "In the first example, line 1 changed from 80 to 140. Which side became longer? Did the 90° corner change? Record both observations.",
                "placeholder": "The first side became ___. The corner stayed ___ because line ___ did not change."
              }
            },
            {
              "id": "1-1-make-path-transfer",
              "title": "Required: reach (90, 30).",
              "body": "Use exactly this three-command route. Change the two movement distances.",
              "task": "Type the program, change only the numbers on lines 1 and 3, then Run and Check assignment.",
              "phase": "Required assignment",
              "lab": "forward(60)\nleft(90)\nforward(40)",
              "typed": true,
              "numbered": true,
              "example": "forward(60)\nleft(90)\nforward(40)",
              "draftId": "assignment-transfer",
              "check": {
                "rules": [
                  {
                    "type": "allowedCommands",
                    "label": "Use only the commands in this assignment",
                    "commands": [
                      "forward",
                      "backward",
                      "left",
                      "right"
                    ],
                    "fail": "Use one command per line, with literal values. Comments are allowed. Loops and functions come later."
                  },
                  {
                    "type": "commandSequence",
                    "label": "Keep the required command order",
                    "sequence": [
                      [
                        "forward"
                      ],
                      [
                        "left"
                      ],
                      [
                        "forward"
                      ]
                    ],
                    "fail": "Read the command names from top to bottom and keep the required order."
                  },
                  {
                    "type": "literalNumbers",
                    "label": "Keep the 90° left turn",
                    "commands": [
                      "left"
                    ],
                    "values": [
                      90
                    ],
                    "prefix": false,
                    "fail": "Keep the required distances, radii, or angles. Compare the values in your code with the assignment."
                  },
                  {
                    "type": "finalPosition",
                    "label": "Finish at (90, 30)",
                    "x": 90,
                    "y": 30,
                    "tolerance": 1,
                    "fail": "Follow each movement from the start. The turtle has not reached the marked target."
                  },
                  {
                    "type": "finalHeading",
                    "label": "Finish facing up",
                    "heading": 90,
                    "tolerance": 1,
                    "fail": "The position and the direction are separate. Check the last turn."
                  }
                ]
              },
              "requirements": [
                "Exactly 3 commands: move, left turn, move.",
                "Finish 90 units right and 30 units above the start.",
                "Keep left(90) and finish facing up."
              ],
              "tip": "The first move sets the horizontal distance. The move after the turn sets the vertical distance.",
              "focusLines": [
                1,
                3
              ],
              "visuals": [
                {
                  "label": "Required route",
                  "bg": "#fbfaf6",
                  "caption": "90 right, then 30 up.",
                  "previewCode": "forward(90)\nleft(90)\nforward(30)",
                  "paths": [
                    {
                      "points": [
                        [
                          14,
                          72
                        ],
                        [
                          146,
                          72
                        ],
                        [
                          146,
                          28
                        ]
                      ],
                      "stroke": "#202525",
                      "width": 2.933333333333333
                    }
                  ],
                  "circles": []
                }
              ],
              "visualsTitle": "Required result"
            },
            {
              "id": "1-1-make-path-choice",
              "title": "Create a branching symbol.",
              "body": "Make a key, an arrow, a mountain signal, or a symbol of your own. Choose its distances and angles.",
              "task": "Build from the blank project editor. Run as you build, then Check my code.",
              "phase": "Create your own",
              "draftId": "project",
              "lab": "\n",
              "typed": true,
              "requirements": [
                "At least 4 movements and 2 turns.",
                "Use backward() at least once to retrace.",
                "Use at least 2 different movement distances.",
                "Keep the drawing inside the grid."
              ],
              "tip": "Retrace to a point where you want another branch, then turn before drawing the branch.",
              "visuals": [
                {
                  "label": "Pixel key",
                  "bg": "#fbfaf6",
                  "caption": "Retrace a stem to add a branch.",
                  "previewCode": "forward(70)\nbackward(25)\nleft(90)\nforward(20)\nbackward(20)\nright(90)\nforward(25)\nright(90)\nforward(15)",
                  "paths": [
                    {
                      "points": [
                        [
                          14,
                          54.714
                        ],
                        [
                          146,
                          54.714
                        ],
                        [
                          98.857,
                          54.714
                        ],
                        [
                          98.857,
                          17
                        ],
                        [
                          98.857,
                          54.714
                        ],
                        [
                          146,
                          54.714
                        ],
                        [
                          146,
                          83
                        ]
                      ],
                      "stroke": "#202525",
                      "width": 3.7714285714285714
                    }
                  ],
                  "circles": []
                },
                {
                  "label": "Signal arrow",
                  "bg": "#fbfaf6",
                  "caption": "A shaft and two branches.",
                  "previewCode": "forward(70)\nleft(135)\nforward(25)\nbackward(25)\nleft(90)\nforward(25)",
                  "paths": [
                    {
                      "points": [
                        [
                          14,
                          50
                        ],
                        [
                          146,
                          50
                        ],
                        [
                          112.665,
                          16.665
                        ],
                        [
                          146,
                          50
                        ],
                        [
                          112.665,
                          83.335
                        ]
                      ],
                      "stroke": "#202525",
                      "width": 3.7714285714285714
                    }
                  ],
                  "circles": []
                },
                {
                  "label": "Mountain signal",
                  "bg": "#fbfaf6",
                  "caption": "Change the angles to change the silhouette.",
                  "previewCode": "forward(25)\nleft(45)\nforward(50)\nright(90)\nforward(50)\nbackward(20)",
                  "paths": [
                    {
                      "points": [
                        [
                          14,
                          74.38
                        ],
                        [
                          48.479,
                          74.38
                        ],
                        [
                          97.239,
                          25.62
                        ],
                        [
                          146,
                          74.38
                        ],
                        [
                          126.496,
                          54.876
                        ]
                      ],
                      "stroke": "#202525",
                      "width": 2.7583129196171097
                    }
                  ],
                  "circles": []
                }
              ]
            }
          ],
          "group": "Movement",
          "objective": "Distance, direction, and backward movement",
          "purpose": "Separate distance from direction. This is the foundation for planning routes and later repeating them with loops.",
          "draftVersion": "unit1-v4",
          "contentVersion": "unit1-v4"
        },
        {
          "id": "1-2-solve-route",
          "number": "1.2",
          "title": "Route Puzzle",
          "type": "Solve",
          "available": true,
          "notes": "Purpose: Close an outline and restore its direction. A later shape or function can then start from a predictable state. Students type the example and test the named line changes. Predictions record the first answer as well as the revised answer. A wrong first prediction can become a checked, correct explanation after observation. Fixed assignments must pass before the creative project opens. Discuss the saved note and ask the student to identify the command responsible for the observed result. Project checks grade the stated measurable requirements; the visual idea and quality of the design remain a teacher conversation. Ask which line first differs from the intended result before offering a hint.",
          "check": {
            "rules": [
              {
                "type": "allowedCommands",
                "label": "Use only the commands in this assignment",
                "commands": [
                  "forward",
                  "backward",
                  "left",
                  "right"
                ],
                "fail": "Use one command per line, with literal values. Comments are allowed. Loops and functions come later."
              },
              {
                "type": "closedOutline",
                "label": "Closed outline with space inside",
                "minArea": 100,
                "fail": "Return to the start around an area. Moving out and back on one line does not enclose a shape."
              },
              {
                "type": "finalPosition",
                "label": "Finish at (0, 0)",
                "x": 0,
                "y": 0,
                "tolerance": 1,
                "fail": "Follow each movement from the start. The turtle has not reached the marked target."
              },
              {
                "type": "finalHeading",
                "label": "Finish facing right",
                "heading": 0,
                "tolerance": 1,
                "fail": "The position and the direction are separate. Check the last turn."
              },
              {
                "type": "minCalls",
                "label": "4+ movements",
                "commands": [
                  "forward",
                  "backward"
                ],
                "count": 4,
                "fail": "Check the highlighted requirement and compare your output with the target."
              },
              {
                "type": "minDistinctNumbers",
                "label": "2+ movement distances",
                "commands": [
                  "forward",
                  "backward"
                ],
                "count": 2,
                "fail": "Check the highlighted requirement and compare your output with the target."
              },
              {
                "type": "drawingBounds",
                "label": "Keep the drawing inside the grid",
                "limit": 190,
                "fail": "A line or circle extends beyond the grid. Reduce a distance or radius, or change the route."
              }
            ]
          },
          "starter": "",
          "steps": [
            {
              "id": "1-2-solve-route-type-example",
              "title": "Type the example.",
              "body": "This draws three sides of a rectangle. The turtle stops above the start, facing left.",
              "task": "Start with an empty editor. Type the numbered commands. Run after each new movement or drawing command.",
              "phase": "Type the example",
              "example": "forward(90)\nleft(90)\nforward(50)\nleft(90)\nforward(90)",
              "numbered": true,
              "focusLines": [
                1,
                2,
                3,
                4,
                5
              ],
              "draftId": "example"
            },
            {
              "id": "1-2-solve-route-predict",
              "title": "Predict the missing side.",
              "body": "Commit to a prediction before checking. Then compare it with the run.",
              "task": "Choose an answer, then Check prediction & run. Watch again to follow the highlighted lines.",
              "phase": "Predict and test",
              "example": "forward(90)\nleft(90)\nforward(50)\nleft(90)\nforward(90)",
              "lab": "forward(90)\nleft(90)\nforward(50)\nleft(90)\nforward(90)",
              "numbered": true,
              "draftId": "prediction-predict",
              "question": {
                "id": "1-2-solve-route-predict",
                "prompt": "How long must the missing vertical side be?",
                "choices": [
                  "50 units",
                  "90 units",
                  "140 units"
                ],
                "answer": 0,
                "explanation": "The horizontal movements cancel. The turtle is 50 units above the start, so the missing vertical side is 50 units."
              }
            },
            {
              "id": "1-2-solve-route-close-example",
              "title": "Close the outline.",
              "body": "Turn toward the gap before moving along it.",
              "task": "Keep lines 1–5. Add one turn on line 6 and one movement on line 7 to return to the start. Run, then Check assignment.",
              "phase": "Change specific lines",
              "focusLines": [
                6,
                7
              ],
              "draftId": "example",
              "check": {
                "rules": [
                  {
                    "type": "allowedCommands",
                    "label": "Use only the commands in this assignment",
                    "commands": [
                      "forward",
                      "backward",
                      "left",
                      "right"
                    ],
                    "fail": "Use one command per line, with literal values. Comments are allowed. Loops and functions come later."
                  },
                  {
                    "type": "literalNumbers",
                    "label": "Keep the 90 × 50 sides",
                    "commands": [
                      "forward"
                    ],
                    "values": [
                      90,
                      50,
                      90,
                      50
                    ],
                    "prefix": false,
                    "fail": "Keep the required distances, radii, or angles. Compare the values in your code with the assignment."
                  },
                  {
                    "type": "closedOutline",
                    "label": "Closed outline with space inside",
                    "minArea": 100,
                    "fail": "Return to the start around an area. Moving out and back on one line does not enclose a shape."
                  },
                  {
                    "type": "finalPosition",
                    "label": "Finish at (0, 0)",
                    "x": 0,
                    "y": 0,
                    "tolerance": 1,
                    "fail": "Follow each movement from the start. The turtle has not reached the marked target."
                  }
                ]
              },
              "tip": "After line 5 the turtle faces left. A left turn points it down."
            },
            {
              "id": "1-2-solve-route-widen",
              "title": "Create a gap deliberately.",
              "body": "Opposite sides need matching lengths to close this rectangle.",
              "task": "Change only line 1 to forward(130). Run. Find the gap and compare it with the 40-unit change.",
              "phase": "Change specific lines",
              "focusLines": [
                1
              ],
              "draftId": "example"
            },
            {
              "id": "1-2-solve-route-repair-width",
              "title": "Repair the opposite side.",
              "body": "One horizontal side is 130 units. The opposite side still uses 90.",
              "task": "Change one other movement distance so the 130 × 50 rectangle closes again. Keep both vertical sides at 50. Run and Check assignment.",
              "phase": "Change specific lines",
              "focusLines": [
                3,
                5,
                7
              ],
              "draftId": "example",
              "check": {
                "rules": [
                  {
                    "type": "allowedCommands",
                    "label": "Use only the commands in this assignment",
                    "commands": [
                      "forward",
                      "backward",
                      "left",
                      "right"
                    ],
                    "fail": "Use one command per line, with literal values. Comments are allowed. Loops and functions come later."
                  },
                  {
                    "type": "literalNumbers",
                    "label": "130 × 50 opposite sides",
                    "commands": [
                      "forward"
                    ],
                    "values": [
                      130,
                      50,
                      130,
                      50
                    ],
                    "prefix": false,
                    "fail": "Keep the required distances, radii, or angles. Compare the values in your code with the assignment."
                  },
                  {
                    "type": "closedOutline",
                    "label": "Closed outline with space inside",
                    "minArea": 100,
                    "fail": "Return to the start around an area. Moving out and back on one line does not enclose a shape."
                  },
                  {
                    "type": "finalPosition",
                    "label": "Finish at (0, 0)",
                    "x": 0,
                    "y": 0,
                    "tolerance": 1,
                    "fail": "Follow each movement from the start. The turtle has not reached the marked target."
                  }
                ]
              }
            },
            {
              "id": "1-2-solve-route-restore-direction",
              "title": "Return facing right.",
              "body": "The outline closes before the final turn.",
              "task": "Add one turn on line 8 to finish facing right. Run. The rectangle should stay the same.",
              "phase": "Change specific lines",
              "focusLines": [
                8
              ],
              "draftId": "example"
            },
            {
              "id": "1-2-solve-route-reason",
              "title": "Separate position from direction.",
              "body": "Commit to a prediction before checking. Then compare it with the run.",
              "task": "Choose an answer, then Check prediction & run. Watch again to follow the highlighted lines.",
              "phase": "Predict and test",
              "example": "forward(30)\nleft(90)\nforward(20)\nleft(90)\nforward(30)\nleft(90)\nforward(20)\nleft(90)",
              "lab": "forward(30)\nleft(90)\nforward(20)\nleft(90)\nforward(30)\nleft(90)\nforward(20)\nleft(90)",
              "numbered": true,
              "draftId": "prediction-reason",
              "question": {
                "id": "1-2-solve-route-reason",
                "prompt": "What does the final left(90) change?",
                "choices": [
                  "Only the direction",
                  "The position and rectangle size",
                  "The last side’s length"
                ],
                "answer": 0,
                "explanation": "The fourth movement already returns to the start. Line 8 turns the turtle to the right without drawing or moving."
              }
            },
            {
              "id": "1-2-solve-route-evidence",
              "title": "Record one result.",
              "body": "Your notes stay in this lesson and save as you type.",
              "task": "After widening the example, which other line repaired the gap? Record the two matching horizontal distances.",
              "phase": "Lesson notes",
              "draftId": "example",
              "response": {
                "id": "1-2-solve-route-evidence",
                "prompt": "After widening the example, which other line repaired the gap? Record the two matching horizontal distances.",
                "placeholder": "Line ___ had to match line ___. Both became ___ units."
              }
            },
            {
              "id": "1-2-solve-route-transfer",
              "title": "Required: repair a 110 × 40 rectangle.",
              "body": "The program runs, but one side has the wrong distance. Find it from the output.",
              "task": "Type the program. Repair one distance, keep the four left(90) turns, then Run and Check assignment.",
              "phase": "Required assignment",
              "lab": "forward(110)\nleft(90)\nforward(40)\nleft(90)\nforward(80)\nleft(90)\nforward(40)\nleft(90)",
              "typed": true,
              "numbered": true,
              "example": "forward(110)\nleft(90)\nforward(40)\nleft(90)\nforward(80)\nleft(90)\nforward(40)\nleft(90)",
              "draftId": "assignment-transfer",
              "check": {
                "rules": [
                  {
                    "type": "allowedCommands",
                    "label": "Use only the commands in this assignment",
                    "commands": [
                      "forward",
                      "backward",
                      "left",
                      "right"
                    ],
                    "fail": "Use one command per line, with literal values. Comments are allowed. Loops and functions come later."
                  },
                  {
                    "type": "commandSequence",
                    "label": "Keep the required command order",
                    "sequence": [
                      [
                        "forward"
                      ],
                      [
                        "left"
                      ],
                      [
                        "forward"
                      ],
                      [
                        "left"
                      ],
                      [
                        "forward"
                      ],
                      [
                        "left"
                      ],
                      [
                        "forward"
                      ],
                      [
                        "left"
                      ]
                    ],
                    "fail": "Read the command names from top to bottom and keep the required order."
                  },
                  {
                    "type": "literalNumbers",
                    "label": "110 × 40 matching sides",
                    "commands": [
                      "forward"
                    ],
                    "values": [
                      110,
                      40,
                      110,
                      40
                    ],
                    "prefix": false,
                    "fail": "Keep the required distances, radii, or angles. Compare the values in your code with the assignment."
                  },
                  {
                    "type": "literalNumbers",
                    "label": "Keep four 90° left turns",
                    "commands": [
                      "left"
                    ],
                    "values": [
                      90,
                      90,
                      90,
                      90
                    ],
                    "prefix": false,
                    "fail": "Keep the required distances, radii, or angles. Compare the values in your code with the assignment."
                  },
                  {
                    "type": "closedOutline",
                    "label": "Closed outline with space inside",
                    "minArea": 100,
                    "fail": "Return to the start around an area. Moving out and back on one line does not enclose a shape."
                  },
                  {
                    "type": "finalPosition",
                    "label": "Finish at (0, 0)",
                    "x": 0,
                    "y": 0,
                    "tolerance": 1,
                    "fail": "Follow each movement from the start. The turtle has not reached the marked target."
                  },
                  {
                    "type": "finalHeading",
                    "label": "Finish facing right",
                    "heading": 0,
                    "tolerance": 1,
                    "fail": "The position and the direction are separate. Check the last turn."
                  }
                ]
              },
              "requirements": [
                "A closed rectangle 110 units wide and 40 units tall.",
                "Exactly 4 movements and 4 left(90) turns.",
                "Finish at (0, 0), facing right."
              ],
              "tip": "Compare opposite movements. The gap shows which distance differs.",
              "focusLines": [
                1,
                3,
                5,
                7
              ],
              "visuals": [
                {
                  "label": "Required rectangle",
                  "bg": "#fbfaf6",
                  "caption": "110 wide × 40 tall.",
                  "previewCode": "forward(110)\nleft(90)\nforward(40)\nleft(90)\nforward(110)\nleft(90)\nforward(40)",
                  "paths": [
                    {
                      "points": [
                        [
                          14,
                          74
                        ],
                        [
                          146,
                          74
                        ],
                        [
                          146,
                          26
                        ],
                        [
                          14,
                          26
                        ],
                        [
                          14,
                          74
                        ]
                      ],
                      "stroke": "#202525",
                      "width": 2.4
                    }
                  ],
                  "circles": []
                }
              ],
              "visualsTitle": "Required result"
            },
            {
              "id": "1-2-solve-route-choice",
              "title": "Create a closed badge outline.",
              "body": "Design a house, a castle, a shield, or another outline. Choose your own size and angles.",
              "task": "Start blank. Build an outline with space inside, then Check my code.",
              "phase": "Create your own",
              "draftId": "project",
              "lab": "\n",
              "typed": true,
              "requirements": [
                "Use at least 4 movements and 2 different distances.",
                "Close the outline around an area.",
                "Return to (0, 0), facing right.",
                "Keep the drawing inside the grid."
              ],
              "tip": "Sketch the path mentally one side at a time. If it closes but faces the wrong way, a final turn can restore the direction.",
              "visuals": [
                {
                  "label": "Castle badge",
                  "bg": "#fbfaf6",
                  "caption": "",
                  "previewCode": "forward(80)\nleft(90)\nforward(60)\nleft(90)\nforward(20)\nleft(90)\nforward(20)\nright(90)\nforward(20)\nright(90)\nforward(20)\nleft(90)\nforward(40)\nleft(90)\nforward(60)\nleft(90)",
                  "paths": [
                    {
                      "points": [
                        [
                          32,
                          86
                        ],
                        [
                          128,
                          86
                        ],
                        [
                          128,
                          14
                        ],
                        [
                          104,
                          14
                        ],
                        [
                          104,
                          38
                        ],
                        [
                          80,
                          38
                        ],
                        [
                          80,
                          14
                        ],
                        [
                          32,
                          14
                        ],
                        [
                          32,
                          86
                        ]
                      ],
                      "stroke": "#202525",
                      "width": 2.4
                    }
                  ],
                  "circles": []
                },
                {
                  "label": "House outline",
                  "bg": "#fbfaf6",
                  "caption": "Square corners and two roof slopes.",
                  "previewCode": "forward(80)\nleft(90)\nforward(40)\nleft(45)\nforward(56.5685)\nleft(90)\nforward(56.5685)\nleft(45)\nforward(40)\nleft(90)",
                  "paths": [
                    {
                      "points": [
                        [
                          44,
                          86
                        ],
                        [
                          116,
                          86
                        ],
                        [
                          116,
                          50
                        ],
                        [
                          80,
                          14
                        ],
                        [
                          44,
                          50
                        ],
                        [
                          44,
                          86
                        ]
                      ],
                      "stroke": "#202525",
                      "width": 2
                    }
                  ],
                  "circles": []
                },
                {
                  "label": "Pixel shield",
                  "bg": "#fbfaf6",
                  "caption": "",
                  "previewCode": "forward(80)\nleft(90)\nforward(40)\nleft(90)\nforward(20)\nright(90)\nforward(20)\nleft(90)\nforward(40)\nleft(90)\nforward(20)\nright(90)\nforward(20)\nleft(90)\nforward(40)\nleft(90)",
                  "paths": [
                    {
                      "points": [
                        [
                          32,
                          86
                        ],
                        [
                          128,
                          86
                        ],
                        [
                          128,
                          38
                        ],
                        [
                          104,
                          38
                        ],
                        [
                          104,
                          14
                        ],
                        [
                          56,
                          14
                        ],
                        [
                          56,
                          38
                        ],
                        [
                          32,
                          38
                        ],
                        [
                          32,
                          86
                        ]
                      ],
                      "stroke": "#202525",
                      "width": 2.4
                    }
                  ],
                  "circles": []
                }
              ]
            }
          ],
          "group": "Movement",
          "objective": "Opposite sides, closure, and final direction",
          "purpose": "Close an outline and restore its direction. A later shape or function can then start from a predictable state.",
          "visuals": [
            {
              "label": "Castle badge",
              "bg": "#fbfaf6",
              "caption": "",
              "previewCode": "forward(80)\nleft(90)\nforward(60)\nleft(90)\nforward(20)\nleft(90)\nforward(20)\nright(90)\nforward(20)\nright(90)\nforward(20)\nleft(90)\nforward(40)\nleft(90)\nforward(60)\nleft(90)",
              "paths": [
                {
                  "points": [
                    [
                      32,
                      86
                    ],
                    [
                      128,
                      86
                    ],
                    [
                      128,
                      14
                    ],
                    [
                      104,
                      14
                    ],
                    [
                      104,
                      38
                    ],
                    [
                      80,
                      38
                    ],
                    [
                      80,
                      14
                    ],
                    [
                      32,
                      14
                    ],
                    [
                      32,
                      86
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2.4
                }
              ],
              "circles": []
            },
            {
              "label": "House outline",
              "bg": "#fbfaf6",
              "caption": "Square corners and two roof slopes.",
              "previewCode": "forward(80)\nleft(90)\nforward(40)\nleft(45)\nforward(56.5685)\nleft(90)\nforward(56.5685)\nleft(45)\nforward(40)\nleft(90)",
              "paths": [
                {
                  "points": [
                    [
                      44,
                      86
                    ],
                    [
                      116,
                      86
                    ],
                    [
                      116,
                      50
                    ],
                    [
                      80,
                      14
                    ],
                    [
                      44,
                      50
                    ],
                    [
                      44,
                      86
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                }
              ],
              "circles": []
            },
            {
              "label": "Pixel shield",
              "bg": "#fbfaf6",
              "caption": "",
              "previewCode": "forward(80)\nleft(90)\nforward(40)\nleft(90)\nforward(20)\nright(90)\nforward(20)\nleft(90)\nforward(40)\nleft(90)\nforward(20)\nright(90)\nforward(20)\nleft(90)\nforward(40)\nleft(90)",
              "paths": [
                {
                  "points": [
                    [
                      32,
                      86
                    ],
                    [
                      128,
                      86
                    ],
                    [
                      128,
                      38
                    ],
                    [
                      104,
                      38
                    ],
                    [
                      104,
                      14
                    ],
                    [
                      56,
                      14
                    ],
                    [
                      56,
                      38
                    ],
                    [
                      32,
                      38
                    ],
                    [
                      32,
                      86
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2.4
                }
              ],
              "circles": []
            }
          ],
          "draftVersion": "unit1-v4",
          "contentVersion": "unit1-v4"
        },
        {
          "id": "1-3-create-route",
          "number": "1.3",
          "title": "Route Designer",
          "type": "Create",
          "available": true,
          "notes": "Purpose: Plan a route from several parts and resize it deliberately. Later, variables and parameters will control these distances. Students type the example and test the named line changes. Predictions record the first answer as well as the revised answer. A wrong first prediction can become a checked, correct explanation after observation. Fixed assignments must pass before the creative project opens. Discuss the saved note and ask the student to identify the command responsible for the observed result. Project checks grade the stated measurable requirements; the visual idea and quality of the design remain a teacher conversation. Ask what the student planned before typing and what they revised after running.",
          "check": {
            "rules": [
              {
                "type": "allowedCommands",
                "label": "Use only the commands in this assignment",
                "commands": [
                  "forward",
                  "backward",
                  "left",
                  "right"
                ],
                "fail": "Use one command per line, with literal values. Comments are allowed. Loops and functions come later."
              },
              {
                "type": "drawnMoves",
                "label": "5+ visible movements",
                "count": 5,
                "fail": "Check the highlighted requirement and compare your output with the target."
              },
              {
                "type": "requiresCommands",
                "label": "Use both left() and right()",
                "commands": [
                  "left",
                  "right"
                ],
                "fail": "Check the highlighted requirement and compare your output with the target."
              },
              {
                "type": "minDistinctNumbers",
                "label": "2+ movement distances",
                "commands": [
                  "forward",
                  "backward"
                ],
                "count": 2,
                "fail": "Check the highlighted requirement and compare your output with the target."
              },
              {
                "type": "drawingBounds",
                "label": "Keep the drawing inside the grid",
                "limit": 190,
                "fail": "A line or circle extends beyond the grid. Reduce a distance or radius, or change the route."
              }
            ]
          },
          "starter": "",
          "visuals": [
            {
              "label": "Heart monitor",
              "bg": "#fbfaf6",
              "caption": "",
              "previewCode": "forward(30)\nleft(60)\nforward(35)\nright(120)\nforward(55)\nleft(120)\nforward(25)\nright(60)\nforward(35)",
              "paths": [
                {
                  "points": [
                    [
                      14,
                      56.999
                    ],
                    [
                      46.327,
                      56.999
                    ],
                    [
                      65.184,
                      24.337
                    ],
                    [
                      94.816,
                      75.663
                    ],
                    [
                      108.286,
                      52.333
                    ],
                    [
                      146,
                      52.333
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2.1551020408163266
                }
              ],
              "circles": []
            },
            {
              "label": "Cliff trail",
              "bg": "#fbfaf6",
              "caption": "",
              "previewCode": "forward(35)\nleft(90)\nforward(20)\nright(90)\nforward(35)\nleft(90)\nforward(40)\nright(90)\nforward(30)",
              "paths": [
                {
                  "points": [
                    [
                      20,
                      86
                    ],
                    [
                      62,
                      86
                    ],
                    [
                      62,
                      62
                    ],
                    [
                      104,
                      62
                    ],
                    [
                      104,
                      14
                    ],
                    [
                      140,
                      14
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2.4
                }
              ],
              "circles": []
            },
            {
              "label": "Mountain ridge",
              "bg": "#fbfaf6",
              "caption": "",
              "previewCode": "left(45)\nforward(40)\nright(90)\nforward(30)\nleft(90)\nforward(60)\nright(90)\nforward(35)\nleft(90)\nforward(25)",
              "paths": [
                {
                  "points": [
                    [
                      14,
                      74.316
                    ],
                    [
                      41.789,
                      46.526
                    ],
                    [
                      62.632,
                      67.368
                    ],
                    [
                      104.316,
                      25.684
                    ],
                    [
                      128.632,
                      50
                    ],
                    [
                      146,
                      32.632
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                }
              ],
              "circles": []
            }
          ],
          "steps": [
            {
              "id": "1-3-create-route-type-example",
              "title": "Type the example.",
              "body": "A route is built from the position and direction left by each previous command.",
              "task": "Start with an empty editor. Type the numbered commands. Run after each new movement or drawing command.",
              "phase": "Type the example",
              "example": "forward(40)\nleft(90)\nforward(20)\nright(90)\nforward(40)",
              "numbered": true,
              "focusLines": [
                1,
                2,
                3,
                4,
                5
              ],
              "draftId": "example"
            },
            {
              "id": "1-3-create-route-resize",
              "title": "Double the route’s dimensions.",
              "body": "To keep the same proportions, scale every movement distance.",
              "task": "Change lines 1 and 5 to forward(80), and line 3 to forward(40). Keep both turns. Run and compare the shape.",
              "phase": "Change specific lines",
              "focusLines": [
                1,
                3,
                5
              ],
              "draftId": "example"
            },
            {
              "id": "1-3-create-route-predict",
              "title": "Predict a partial resize.",
              "body": "Commit to a prediction before checking. Then compare it with the run.",
              "task": "Choose an answer, then Check prediction & run. Watch again to follow the highlighted lines.",
              "phase": "Predict and test",
              "example": "forward(80)\nleft(90)\nforward(20)\nright(90)\nforward(80)",
              "lab": "forward(80)\nleft(90)\nforward(20)\nright(90)\nforward(80)",
              "numbered": true,
              "draftId": "prediction-predict",
              "question": {
                "id": "1-3-create-route-predict",
                "prompt": "Only the horizontal distances doubled. What happened?",
                "choices": [
                  "The route doubled in every direction",
                  "It became wider; its height stayed 20",
                  "Both turns doubled"
                ],
                "answer": 1,
                "explanation": "Lines 1 and 5 control width. Line 3 still moves up 20 units. Scaling only some distances changes the proportions."
              }
            },
            {
              "id": "1-3-create-route-extend",
              "title": "Add another rise.",
              "body": "A repeated corner can become a pattern. You will automate repeated sections later.",
              "task": "Keep the doubled route. Add left(90) on line 6 and forward(40) on line 7. Run. The route now has two 40-unit rises.",
              "phase": "Change specific lines",
              "focusLines": [
                6,
                7
              ],
              "draftId": "example"
            },
            {
              "id": "1-3-create-route-reason",
              "title": "Predict the next direction.",
              "body": "Commit to a prediction before checking. Then compare it with the run.",
              "task": "Choose an answer, then Check prediction & run. Watch again to follow the highlighted lines.",
              "phase": "Predict and test",
              "example": "forward(40)\nright(90)\nforward(30)\nleft(90)",
              "lab": "forward(40)\nright(90)\nforward(30)\nleft(90)",
              "numbered": true,
              "draftId": "prediction-reason",
              "question": {
                "id": "1-3-create-route-reason",
                "prompt": "Which way does the turtle face after line 4?",
                "choices": [
                  "Down",
                  "Up",
                  "Right"
                ],
                "answer": 2,
                "explanation": "right(90) turns from right to down. left(90) turns from down back to right. The last turn adds no movement."
              }
            },
            {
              "id": "1-3-create-route-evidence",
              "title": "Record one result.",
              "body": "Your notes stay in this lesson and save as you type.",
              "task": "In the resize, list the three original movement distances and their replacements. Which commands kept the corners unchanged?",
              "phase": "Lesson notes",
              "draftId": "example",
              "response": {
                "id": "1-3-create-route-evidence",
                "prompt": "In the resize, list the three original movement distances and their replacements. Which commands kept the corners unchanged?",
                "placeholder": "Distances: ___ became ___. The turns stayed ___ and ___."
              }
            },
            {
              "id": "1-3-create-route-transfer",
              "title": "Required: make a delivery route.",
              "body": "The delivery point is 100 units right and 40 below the start. The first stop is 40 units right.",
              "task": "Type this starting route. Keep the two turns. Change the movement distances to meet all three stops, then check.",
              "phase": "Required assignment",
              "lab": "forward(40)\nright(90)\nforward(20)\nleft(90)\nforward(30)",
              "typed": true,
              "numbered": true,
              "example": "forward(40)\nright(90)\nforward(20)\nleft(90)\nforward(30)",
              "draftId": "assignment-transfer",
              "check": {
                "rules": [
                  {
                    "type": "allowedCommands",
                    "label": "Use only the commands in this assignment",
                    "commands": [
                      "forward",
                      "backward",
                      "left",
                      "right"
                    ],
                    "fail": "Use one command per line, with literal values. Comments are allowed. Loops and functions come later."
                  },
                  {
                    "type": "commandSequence",
                    "label": "Keep the required command order",
                    "sequence": [
                      [
                        "forward"
                      ],
                      [
                        "right"
                      ],
                      [
                        "forward"
                      ],
                      [
                        "left"
                      ],
                      [
                        "forward"
                      ]
                    ],
                    "fail": "Read the command names from top to bottom and keep the required order."
                  },
                  {
                    "type": "literalNumbers",
                    "label": "40 right, 40 down, 60 right",
                    "commands": [
                      "forward"
                    ],
                    "values": [
                      40,
                      40,
                      60
                    ],
                    "prefix": false,
                    "fail": "Keep the required distances, radii, or angles. Compare the values in your code with the assignment."
                  },
                  {
                    "type": "literalNumbers",
                    "label": "Keep right(90)",
                    "commands": [
                      "right"
                    ],
                    "values": [
                      90
                    ],
                    "prefix": false,
                    "fail": "Keep the required distances, radii, or angles. Compare the values in your code with the assignment."
                  },
                  {
                    "type": "literalNumbers",
                    "label": "Keep left(90)",
                    "commands": [
                      "left"
                    ],
                    "values": [
                      90
                    ],
                    "prefix": false,
                    "fail": "Keep the required distances, radii, or angles. Compare the values in your code with the assignment."
                  },
                  {
                    "type": "finalPosition",
                    "label": "Finish at (100, -40)",
                    "x": 100,
                    "y": -40,
                    "tolerance": 1,
                    "fail": "Follow each movement from the start. The turtle has not reached the marked target."
                  },
                  {
                    "type": "finalHeading",
                    "label": "Finish facing right",
                    "heading": 0,
                    "tolerance": 1,
                    "fail": "The position and the direction are separate. Check the last turn."
                  }
                ]
              },
              "requirements": [
                "Exactly 5 commands.",
                "Move 40 right, then 40 down, then 60 right.",
                "Finish at (100, -40), facing right."
              ],
              "tip": "The two horizontal movements add together. The vertical movement controls how far below the start you finish.",
              "focusLines": [
                1,
                3,
                5
              ],
              "visuals": [
                {
                  "label": "Required delivery route",
                  "bg": "#fbfaf6",
                  "caption": "First stop: 40 right. Delivery: (100, -40).",
                  "previewCode": "forward(40)\nright(90)\nforward(40)\nleft(90)\nforward(60)",
                  "paths": [
                    {
                      "points": [
                        [
                          14,
                          23.6
                        ],
                        [
                          66.8,
                          23.6
                        ],
                        [
                          66.8,
                          76.4
                        ],
                        [
                          146,
                          76.4
                        ]
                      ],
                      "stroke": "#202525",
                      "width": 2.64
                    }
                  ],
                  "circles": []
                }
              ],
              "visualsTitle": "Required result"
            },
            {
              "id": "1-3-create-route-choice",
              "title": "Create a route with a purpose.",
              "body": "Make a heart-monitor trace, a climbing trail, a mountain ridge, or another connected route. Choose what its corners should communicate.",
              "task": "Build from blank. Use both turning directions to shape the route. Run and Check my code.",
              "phase": "Create your own",
              "draftId": "project",
              "lab": "\n",
              "typed": true,
              "requirements": [
                "At least 5 visible movements.",
                "Use both left() and right().",
                "Use at least 2 different movement distances.",
                "Keep the drawing inside the grid."
              ],
              "tip": "Start with three segments, then add the next corner. Check the direction before every move.",
              "visuals": [
                {
                  "label": "Heart monitor",
                  "bg": "#fbfaf6",
                  "caption": "",
                  "previewCode": "forward(30)\nleft(60)\nforward(35)\nright(120)\nforward(55)\nleft(120)\nforward(25)\nright(60)\nforward(35)",
                  "paths": [
                    {
                      "points": [
                        [
                          14,
                          56.999
                        ],
                        [
                          46.327,
                          56.999
                        ],
                        [
                          65.184,
                          24.337
                        ],
                        [
                          94.816,
                          75.663
                        ],
                        [
                          108.286,
                          52.333
                        ],
                        [
                          146,
                          52.333
                        ]
                      ],
                      "stroke": "#202525",
                      "width": 2.1551020408163266
                    }
                  ],
                  "circles": []
                },
                {
                  "label": "Cliff trail",
                  "bg": "#fbfaf6",
                  "caption": "",
                  "previewCode": "forward(35)\nleft(90)\nforward(20)\nright(90)\nforward(35)\nleft(90)\nforward(40)\nright(90)\nforward(30)",
                  "paths": [
                    {
                      "points": [
                        [
                          20,
                          86
                        ],
                        [
                          62,
                          86
                        ],
                        [
                          62,
                          62
                        ],
                        [
                          104,
                          62
                        ],
                        [
                          104,
                          14
                        ],
                        [
                          140,
                          14
                        ]
                      ],
                      "stroke": "#202525",
                      "width": 2.4
                    }
                  ],
                  "circles": []
                },
                {
                  "label": "Mountain ridge",
                  "bg": "#fbfaf6",
                  "caption": "",
                  "previewCode": "left(45)\nforward(40)\nright(90)\nforward(30)\nleft(90)\nforward(60)\nright(90)\nforward(35)\nleft(90)\nforward(25)",
                  "paths": [
                    {
                      "points": [
                        [
                          14,
                          74.316
                        ],
                        [
                          41.789,
                          46.526
                        ],
                        [
                          62.632,
                          67.368
                        ],
                        [
                          104.316,
                          25.684
                        ],
                        [
                          128.632,
                          50
                        ],
                        [
                          146,
                          32.632
                        ]
                      ],
                      "stroke": "#202525",
                      "width": 2
                    }
                  ],
                  "circles": []
                }
              ]
            }
          ],
          "group": "Movement",
          "objective": "Proportions and planned routes",
          "purpose": "Plan a route from several parts and resize it deliberately. Later, variables and parameters will control these distances.",
          "draftVersion": "unit1-v4",
          "contentVersion": "unit1-v4"
        },
        {
          "id": "1-4-make-bubbles",
          "number": "1.4",
          "title": "Make a Bubble Trail",
          "type": "Make",
          "available": true,
          "notes": "Purpose: Control a circle’s radius and its spacing separately. These become separate parameters in reusable drawing functions. Students type the example and test the named line changes. Predictions record the first answer as well as the revised answer. A wrong first prediction can become a checked, correct explanation after observation. Fixed assignments must pass before the creative project opens. Discuss the saved note and ask the student to identify the command responsible for the observed result. Project checks grade the stated measurable requirements; the visual idea and quality of the design remain a teacher conversation. Ask the student to change one value and predict which visible property it controls.",
          "check": {
            "rules": [
              {
                "type": "allowedCommands",
                "label": "Use only the commands in this assignment",
                "commands": [
                  "forward",
                  "backward",
                  "left",
                  "right",
                  "circle"
                ],
                "fail": "Use one command per line, with literal values. Comments are allowed. Loops and functions come later."
              },
              {
                "type": "minCalls",
                "label": "4+ circles",
                "commands": [
                  "circle"
                ],
                "count": 4,
                "fail": "Check the highlighted requirement and compare your output with the target."
              },
              {
                "type": "monotonicNumbers",
                "label": "Each radius is larger than the previous one",
                "commands": [
                  "circle"
                ],
                "min": 4,
                "direction": "up",
                "fail": "Check the highlighted requirement and compare your output with the target."
              },
              {
                "type": "circleTrail",
                "label": "Move between every circle",
                "min": 4,
                "fail": "Check the highlighted requirement and compare your output with the target."
              },
              {
                "type": "minCalls",
                "label": "Bend the trail with a turn",
                "commands": [
                  "left",
                  "right"
                ],
                "count": 1,
                "fail": "Check the highlighted requirement and compare your output with the target."
              },
              {
                "type": "drawingBounds",
                "label": "Keep the drawing inside the grid",
                "limit": 190,
                "fail": "A line or circle extends beyond the grid. Reduce a distance or radius, or change the route."
              }
            ]
          },
          "starter": "",
          "visuals": [
            {
              "label": "Growing signal",
              "bg": "#fbfaf6",
              "caption": "",
              "previewCode": "circle(8)\nforward(35)\ncircle(12)\nforward(40)\nleft(30)\ncircle(18)\nforward(45)\ncircle(25)",
              "paths": [
                {
                  "points": [
                    [
                      21.853,
                      82.756
                    ],
                    [
                      56.21,
                      82.756
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      56.21,
                      82.756
                    ],
                    [
                      95.475,
                      82.756
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      95.475,
                      82.756
                    ],
                    [
                      133.73,
                      60.67
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                }
              ],
              "circles": [
                {
                  "cx": 21.853,
                  "cy": 74.903,
                  "r": 7.853,
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "cx": 56.21,
                  "cy": 70.977,
                  "r": 11.779,
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "cx": 86.64,
                  "cy": 67.454,
                  "r": 17.669,
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "cx": 121.459,
                  "cy": 39.417,
                  "r": 24.541,
                  "stroke": "#202525",
                  "width": 2
                }
              ]
            },
            {
              "label": "Corner trail",
              "bg": "#fbfaf6",
              "caption": "",
              "previewCode": "circle(8)\nforward(35)\ncircle(12)\nleft(90)\nforward(35)\ncircle(18)\nforward(45)\ncircle(25)",
              "paths": [
                {
                  "points": [
                    [
                      69.029,
                      86
                    ],
                    [
                      93.029,
                      86
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      93.029,
                      86
                    ],
                    [
                      93.029,
                      62
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      93.029,
                      62
                    ],
                    [
                      93.029,
                      31.143
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                }
              ],
              "circles": [
                {
                  "cx": 69.029,
                  "cy": 80.514,
                  "r": 5.486,
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "cx": 93.029,
                  "cy": 77.771,
                  "r": 8.229,
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "cx": 80.686,
                  "cy": 62,
                  "r": 12.343,
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "cx": 75.886,
                  "cy": 31.143,
                  "r": 17.143,
                  "stroke": "#202525",
                  "width": 2
                }
              ]
            },
            {
              "label": "Turning orbit",
              "bg": "#fbfaf6",
              "caption": "",
              "previewCode": "circle(8)\nforward(35)\nleft(30)\ncircle(14)\nforward(35)\nleft(30)\ncircle(20)\nforward(40)\ncircle(28)",
              "paths": [
                {
                  "points": [
                    [
                      49.607,
                      84.594
                    ],
                    [
                      75.852,
                      84.594
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      75.852,
                      84.594
                    ],
                    [
                      98.582,
                      71.471
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      98.582,
                      71.471
                    ],
                    [
                      113.579,
                      45.495
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                }
              ],
              "circles": [
                {
                  "cx": 49.607,
                  "cy": 78.595,
                  "r": 5.999,
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "cx": 70.603,
                  "cy": 75.502,
                  "r": 10.498,
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "cx": 85.593,
                  "cy": 63.972,
                  "r": 14.997,
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "cx": 95.396,
                  "cy": 34.996,
                  "r": 20.996,
                  "stroke": "#202525",
                  "width": 2
                }
              ]
            }
          ],
          "steps": [
            {
              "id": "1-4-make-bubbles-type-example",
              "title": "Type the example.",
              "body": "circle(20) uses a radius of 20: center to edge. The circle is 40 units across. A full circle returns the turtle to its starting position and direction.",
              "task": "Start with an empty editor. Type the numbered commands. Run after each new movement or drawing command.",
              "phase": "Type the example",
              "example": "circle(20)\nforward(60)\ncircle(20)",
              "numbered": true,
              "focusLines": [
                1,
                2,
                3
              ],
              "draftId": "example"
            },
            {
              "id": "1-4-make-bubbles-radius",
              "title": "Change radius without changing spacing.",
              "body": "A larger radius makes a larger circle. The move between the circles stays the same.",
              "task": "On line 1 change circle(20) to circle(30). Run. Compare only the first circle. Then restore circle(20).",
              "phase": "Change specific lines",
              "focusLines": [
                1
              ],
              "draftId": "example"
            },
            {
              "id": "1-4-make-bubbles-predict",
              "title": "Predict the width.",
              "body": "Commit to a prediction before checking. Then compare it with the run.",
              "task": "Choose an answer, then Check prediction & run. Watch again to follow the highlighted lines.",
              "phase": "Predict and test",
              "example": "circle(20)",
              "lab": "circle(20)",
              "numbered": true,
              "draftId": "prediction-predict",
              "question": {
                "id": "1-4-make-bubbles-predict",
                "prompt": "How wide is this circle?",
                "choices": [
                  "20 units",
                  "40 units",
                  "80 units"
                ],
                "answer": 1,
                "explanation": "The diameter crosses two radii. A radius of 20 gives a diameter of 40. The turtle starts on the circle’s edge."
              }
            },
            {
              "id": "1-4-make-bubbles-spacing",
              "title": "Compare overlap, touch, and a gap.",
              "body": "These equal circles have centers 20 units above their starting points. Changing the horizontal move changes their separation.",
              "task": "Keep both radii at 20. On line 2 test forward(20), then forward(40), then forward(60). Run after each change. Compare overlap, touching, and a gap.",
              "phase": "Change specific lines",
              "focusLines": [
                2
              ],
              "draftId": "example"
            },
            {
              "id": "1-4-make-bubbles-bend",
              "title": "Bend the growing trail.",
              "body": "A positive-radius circle’s center is to the turtle’s left. A turn changes which direction that is.",
              "task": "After the three-line example, add left(90) on line 4, forward(50) on line 5, and circle(30) on line 6. Run.",
              "phase": "Change specific lines",
              "focusLines": [
                4,
                5,
                6
              ],
              "draftId": "example"
            },
            {
              "id": "1-4-make-bubbles-reason",
              "title": "Predict two circles without a move.",
              "body": "Commit to a prediction before checking. Then compare it with the run.",
              "task": "Choose an answer, then Check prediction & run. Watch again to follow the highlighted lines.",
              "phase": "Predict and test",
              "example": "circle(20)\ncircle(40)",
              "lab": "circle(20)\ncircle(40)",
              "numbered": true,
              "draftId": "prediction-reason",
              "question": {
                "id": "1-4-make-bubbles-reason",
                "prompt": "Where do the two circles start?",
                "choices": [
                  "At different turtle positions",
                  "At the same turtle position on their edges",
                  "At their centers"
                ],
                "answer": 1,
                "explanation": "Each full circle returns to the same starting point. With no move between the calls, both circles start there; their different radii give different centers."
              }
            },
            {
              "id": "1-4-make-bubbles-evidence",
              "title": "Record one result.",
              "body": "Your notes stay in this lesson and save as you type.",
              "task": "For two radius-20 circles, which move made them touch? Which move left a 20-unit gap?",
              "phase": "Lesson notes",
              "draftId": "example",
              "response": {
                "id": "1-4-make-bubbles-evidence",
                "prompt": "For two radius-20 circles, which move made them touch? Which move left a 20-unit gap?",
                "placeholder": "They touched at ___. A 20-unit gap used ___. Their diameter was ___."
              }
            },
            {
              "id": "1-4-make-bubbles-transfer",
              "title": "Required: two circles with a 20-unit gap.",
              "body": "Both circles must have radius 20. Place their starting points 60 units apart horizontally.",
              "task": "Type the three lines. Change only the movement distance, then Run and Check assignment.",
              "phase": "Required assignment",
              "lab": "circle(20)\nforward(40)\ncircle(20)",
              "typed": true,
              "numbered": true,
              "example": "circle(20)\nforward(40)\ncircle(20)",
              "draftId": "assignment-transfer",
              "check": {
                "rules": [
                  {
                    "type": "allowedCommands",
                    "label": "Use only the commands in this assignment",
                    "commands": [
                      "forward",
                      "backward",
                      "left",
                      "right",
                      "circle"
                    ],
                    "fail": "Use one command per line, with literal values. Comments are allowed. Loops and functions come later."
                  },
                  {
                    "type": "commandSequence",
                    "label": "Keep the required command order",
                    "sequence": [
                      [
                        "circle"
                      ],
                      [
                        "forward"
                      ],
                      [
                        "circle"
                      ]
                    ],
                    "fail": "Read the command names from top to bottom and keep the required order."
                  },
                  {
                    "type": "literalNumbers",
                    "label": "Keep two radius-20 circles",
                    "commands": [
                      "circle"
                    ],
                    "values": [
                      20,
                      20
                    ],
                    "prefix": false,
                    "fail": "Keep the required distances, radii, or angles. Compare the values in your code with the assignment."
                  },
                  {
                    "type": "literalNumbers",
                    "label": "60-unit spacing",
                    "commands": [
                      "forward"
                    ],
                    "values": [
                      60
                    ],
                    "prefix": false,
                    "fail": "Keep the required distances, radii, or angles. Compare the values in your code with the assignment."
                  },
                  {
                    "type": "finalPosition",
                    "label": "Finish at (60, 0)",
                    "x": 60,
                    "y": 0,
                    "tolerance": 1,
                    "fail": "Follow each movement from the start. The turtle has not reached the marked target."
                  },
                  {
                    "type": "finalHeading",
                    "label": "Finish facing right",
                    "heading": 0,
                    "tolerance": 1,
                    "fail": "The position and the direction are separate. Check the last turn."
                  }
                ]
              },
              "requirements": [
                "Exactly 2 circles, both radius 20.",
                "One forward movement of 60.",
                "A 20-unit gap between the circle edges."
              ],
              "tip": "The two radii total 40. Add the required 20-unit gap to that width.",
              "focusLines": [
                2
              ],
              "visuals": [
                {
                  "label": "Required separated circles",
                  "bg": "#fbfaf6",
                  "caption": "Diameter 40 + gap 20 = spacing 60.",
                  "previewCode": "circle(20)\nforward(60)\ncircle(20)",
                  "paths": [
                    {
                      "points": [
                        [
                          40.4,
                          76.4
                        ],
                        [
                          119.6,
                          76.4
                        ]
                      ],
                      "stroke": "#202525",
                      "width": 2.64
                    }
                  ],
                  "circles": [
                    {
                      "cx": 40.4,
                      "cy": 50,
                      "r": 26.4,
                      "stroke": "#202525",
                      "width": 2.64
                    },
                    {
                      "cx": 119.6,
                      "cy": 50,
                      "r": 26.4,
                      "stroke": "#202525",
                      "width": 2.64
                    }
                  ]
                }
              ],
              "visualsTitle": "Required result"
            },
            {
              "id": "1-4-make-bubbles-choice",
              "title": "Create a growing bubble signal.",
              "body": "Make an orbit trail, a corner trail, or your own connected bubble pattern. Decide how quickly the bubbles grow.",
              "task": "Start blank. Draw at least four circles, growing in the order they are drawn. Run and check.",
              "phase": "Create your own",
              "draftId": "project",
              "lab": "\n",
              "typed": true,
              "requirements": [
                "At least 4 circles, each radius larger than the last.",
                "Move between every pair of circles.",
                "Use at least 1 turn to bend the trail.",
                "Keep every circle and line inside the grid."
              ],
              "tip": "Plan small radii first. A radius of 25 makes a circle 50 units across.",
              "visuals": [
                {
                  "label": "Growing signal",
                  "bg": "#fbfaf6",
                  "caption": "",
                  "previewCode": "circle(8)\nforward(35)\ncircle(12)\nforward(40)\nleft(30)\ncircle(18)\nforward(45)\ncircle(25)",
                  "paths": [
                    {
                      "points": [
                        [
                          21.853,
                          82.756
                        ],
                        [
                          56.21,
                          82.756
                        ]
                      ],
                      "stroke": "#202525",
                      "width": 2
                    },
                    {
                      "points": [
                        [
                          56.21,
                          82.756
                        ],
                        [
                          95.475,
                          82.756
                        ]
                      ],
                      "stroke": "#202525",
                      "width": 2
                    },
                    {
                      "points": [
                        [
                          95.475,
                          82.756
                        ],
                        [
                          133.73,
                          60.67
                        ]
                      ],
                      "stroke": "#202525",
                      "width": 2
                    }
                  ],
                  "circles": [
                    {
                      "cx": 21.853,
                      "cy": 74.903,
                      "r": 7.853,
                      "stroke": "#202525",
                      "width": 2
                    },
                    {
                      "cx": 56.21,
                      "cy": 70.977,
                      "r": 11.779,
                      "stroke": "#202525",
                      "width": 2
                    },
                    {
                      "cx": 86.64,
                      "cy": 67.454,
                      "r": 17.669,
                      "stroke": "#202525",
                      "width": 2
                    },
                    {
                      "cx": 121.459,
                      "cy": 39.417,
                      "r": 24.541,
                      "stroke": "#202525",
                      "width": 2
                    }
                  ]
                },
                {
                  "label": "Corner trail",
                  "bg": "#fbfaf6",
                  "caption": "",
                  "previewCode": "circle(8)\nforward(35)\ncircle(12)\nleft(90)\nforward(35)\ncircle(18)\nforward(45)\ncircle(25)",
                  "paths": [
                    {
                      "points": [
                        [
                          69.029,
                          86
                        ],
                        [
                          93.029,
                          86
                        ]
                      ],
                      "stroke": "#202525",
                      "width": 2
                    },
                    {
                      "points": [
                        [
                          93.029,
                          86
                        ],
                        [
                          93.029,
                          62
                        ]
                      ],
                      "stroke": "#202525",
                      "width": 2
                    },
                    {
                      "points": [
                        [
                          93.029,
                          62
                        ],
                        [
                          93.029,
                          31.143
                        ]
                      ],
                      "stroke": "#202525",
                      "width": 2
                    }
                  ],
                  "circles": [
                    {
                      "cx": 69.029,
                      "cy": 80.514,
                      "r": 5.486,
                      "stroke": "#202525",
                      "width": 2
                    },
                    {
                      "cx": 93.029,
                      "cy": 77.771,
                      "r": 8.229,
                      "stroke": "#202525",
                      "width": 2
                    },
                    {
                      "cx": 80.686,
                      "cy": 62,
                      "r": 12.343,
                      "stroke": "#202525",
                      "width": 2
                    },
                    {
                      "cx": 75.886,
                      "cy": 31.143,
                      "r": 17.143,
                      "stroke": "#202525",
                      "width": 2
                    }
                  ]
                },
                {
                  "label": "Turning orbit",
                  "bg": "#fbfaf6",
                  "caption": "",
                  "previewCode": "circle(8)\nforward(35)\nleft(30)\ncircle(14)\nforward(35)\nleft(30)\ncircle(20)\nforward(40)\ncircle(28)",
                  "paths": [
                    {
                      "points": [
                        [
                          49.607,
                          84.594
                        ],
                        [
                          75.852,
                          84.594
                        ]
                      ],
                      "stroke": "#202525",
                      "width": 2
                    },
                    {
                      "points": [
                        [
                          75.852,
                          84.594
                        ],
                        [
                          98.582,
                          71.471
                        ]
                      ],
                      "stroke": "#202525",
                      "width": 2
                    },
                    {
                      "points": [
                        [
                          98.582,
                          71.471
                        ],
                        [
                          113.579,
                          45.495
                        ]
                      ],
                      "stroke": "#202525",
                      "width": 2
                    }
                  ],
                  "circles": [
                    {
                      "cx": 49.607,
                      "cy": 78.595,
                      "r": 5.999,
                      "stroke": "#202525",
                      "width": 2
                    },
                    {
                      "cx": 70.603,
                      "cy": 75.502,
                      "r": 10.498,
                      "stroke": "#202525",
                      "width": 2
                    },
                    {
                      "cx": 85.593,
                      "cy": 63.972,
                      "r": 14.997,
                      "stroke": "#202525",
                      "width": 2
                    },
                    {
                      "cx": 95.396,
                      "cy": 34.996,
                      "r": 20.996,
                      "stroke": "#202525",
                      "width": 2
                    }
                  ]
                }
              ]
            }
          ],
          "group": "Circles + Patterns",
          "objective": "Radius, diameter, and spacing",
          "purpose": "Control a circle’s radius and its spacing separately. These become separate parameters in reusable drawing functions.",
          "draftVersion": "unit1-v4",
          "contentVersion": "unit1-v4"
        },
        {
          "id": "1-5-solve-bubbles",
          "number": "1.5",
          "title": "Bubble Pattern Puzzle",
          "type": "Solve",
          "available": true,
          "notes": "Purpose: Identify a size pattern and a placement pattern separately. Later, loops and variables will generate both. Students type the example and test the named line changes. Predictions record the first answer as well as the revised answer. A wrong first prediction can become a checked, correct explanation after observation. Fixed assignments must pass before the creative project opens. Discuss the saved note and ask the student to identify the command responsible for the observed result. Project checks grade the stated measurable requirements; the visual idea and quality of the design remain a teacher conversation. Ask which line first differs from the intended result before offering a hint.",
          "check": {
            "rules": [
              {
                "type": "allowedCommands",
                "label": "Use only the commands in this assignment",
                "commands": [
                  "forward",
                  "backward",
                  "left",
                  "right",
                  "circle"
                ],
                "fail": "Use one command per line, with literal values. Comments are allowed. Loops and functions come later."
              },
              {
                "type": "exactCalls",
                "label": "Exactly 5 circles",
                "commands": [
                  "circle"
                ],
                "count": 5,
                "fail": "Count these commands. The assignment requires exactly this many."
              },
              {
                "type": "alternatingNumbers",
                "label": "Alternate two different radii A–B–A–B–A",
                "commands": [
                  "circle"
                ],
                "count": 5,
                "fail": "Check the highlighted requirement and compare your output with the target."
              },
              {
                "type": "circleTrail",
                "label": "Move between every circle",
                "min": 5,
                "fail": "Check the highlighted requirement and compare your output with the target."
              },
              {
                "type": "minCalls",
                "label": "Bend the pattern",
                "commands": [
                  "left",
                  "right"
                ],
                "count": 1,
                "fail": "Check the highlighted requirement and compare your output with the target."
              },
              {
                "type": "drawingBounds",
                "label": "Keep the drawing inside the grid",
                "limit": 190,
                "fail": "A line or circle extends beyond the grid. Reduce a distance or radius, or change the route."
              }
            ]
          },
          "starter": "",
          "steps": [
            {
              "id": "1-5-solve-bubbles-type-example",
              "title": "Type the example.",
              "body": "The starting points are evenly spaced, but the radii do not follow the intended increase of 10.",
              "task": "Start with an empty editor. Type the numbered commands. Run after each new movement or drawing command.",
              "phase": "Type the example",
              "example": "circle(10)\nforward(45)\ncircle(20)\nforward(45)\ncircle(15)",
              "numbered": true,
              "focusLines": [
                1,
                2,
                3,
                4,
                5
              ],
              "draftId": "example"
            },
            {
              "id": "1-5-solve-bubbles-predict",
              "title": "Predict the next radius.",
              "body": "Commit to a prediction before checking. Then compare it with the run.",
              "task": "Choose an answer, then Check prediction & run. Watch again to follow the highlighted lines.",
              "phase": "Predict and test",
              "example": "circle(10)\nforward(45)\ncircle(20)\nforward(45)\ncircle(15)",
              "lab": "circle(10)\nforward(45)\ncircle(20)\nforward(45)\ncircle(15)",
              "numbered": true,
              "draftId": "prediction-predict",
              "question": {
                "id": "1-5-solve-bubbles-predict",
                "prompt": "To increase each radius by 10, what should line 5 use?",
                "choices": [
                  "circle(25)",
                  "circle(30)",
                  "circle(40)"
                ],
                "answer": 1,
                "explanation": "The intended radii are 10, 20, 30. The 45-unit moves control starting-point spacing, not circle size."
              }
            },
            {
              "id": "1-5-solve-bubbles-repair-radius",
              "title": "Repair the size pattern.",
              "body": "Change the radius that breaks the sequence.",
              "task": "Change line 5 so the radii are 10, 20, 30. Keep both moves at 45. Run.",
              "phase": "Change specific lines",
              "focusLines": [
                1,
                3,
                5
              ],
              "draftId": "example"
            },
            {
              "id": "1-5-solve-bubbles-repair-spacing",
              "title": "Create and repair uneven spacing.",
              "body": "Equal starting-point spacing does not mean equal gaps between circles of different sizes.",
              "task": "Change line 4 to forward(60) and Run. Then change line 2 to forward(60) and Run. Compare the two starting-point distances.",
              "phase": "Change specific lines",
              "focusLines": [
                2,
                4
              ],
              "draftId": "example"
            },
            {
              "id": "1-5-solve-bubbles-reason",
              "title": "Predict a turn before a circle.",
              "body": "Commit to a prediction before checking. Then compare it with the run.",
              "task": "Choose an answer, then Check prediction & run. Watch again to follow the highlighted lines.",
              "phase": "Predict and test",
              "example": "circle(15)\nforward(55)\nleft(90)\ncircle(20)",
              "lab": "circle(15)\nforward(55)\nleft(90)\ncircle(20)",
              "numbered": true,
              "draftId": "prediction-reason",
              "question": {
                "id": "1-5-solve-bubbles-reason",
                "prompt": "What does line 3 change before the next circle?",
                "choices": [
                  "It moves the starting point 90 units",
                  "It changes direction at the same point",
                  "It doubles the radius"
                ],
                "answer": 1,
                "explanation": "left(90) changes the heading without moving. The next circle starts at the same point, but its center lies to the left of the new heading."
              }
            },
            {
              "id": "1-5-solve-bubbles-evidence",
              "title": "Record one result.",
              "body": "Your notes stay in this lesson and save as you type.",
              "task": "Record the three repaired radii and the two repaired spacing values. Which command name controls each pattern?",
              "phase": "Lesson notes",
              "draftId": "example",
              "response": {
                "id": "1-5-solve-bubbles-evidence",
                "prompt": "Record the three repaired radii and the two repaired spacing values. Which command name controls each pattern?",
                "placeholder": "Radii: ___, ___, ___. Spacing: ___, ___. circle() controls ___; forward() controls ___."
              }
            },
            {
              "id": "1-5-solve-bubbles-transfer",
              "title": "Required: repair a +10 radius pattern.",
              "body": "Keep the first two radii and both 60-unit moves. The radii must increase by exactly 10.",
              "task": "Type the program. Repair one radius, then Run and Check assignment.",
              "phase": "Required assignment",
              "lab": "circle(15)\nforward(60)\ncircle(25)\nforward(60)\ncircle(20)",
              "typed": true,
              "numbered": true,
              "example": "circle(15)\nforward(60)\ncircle(25)\nforward(60)\ncircle(20)",
              "draftId": "assignment-transfer",
              "check": {
                "rules": [
                  {
                    "type": "allowedCommands",
                    "label": "Use only the commands in this assignment",
                    "commands": [
                      "forward",
                      "backward",
                      "left",
                      "right",
                      "circle"
                    ],
                    "fail": "Use one command per line, with literal values. Comments are allowed. Loops and functions come later."
                  },
                  {
                    "type": "commandSequence",
                    "label": "Keep the required command order",
                    "sequence": [
                      [
                        "circle"
                      ],
                      [
                        "forward"
                      ],
                      [
                        "circle"
                      ],
                      [
                        "forward"
                      ],
                      [
                        "circle"
                      ]
                    ],
                    "fail": "Read the command names from top to bottom and keep the required order."
                  },
                  {
                    "type": "literalNumbers",
                    "label": "Radii 15 → 25 → 35",
                    "commands": [
                      "circle"
                    ],
                    "values": [
                      15,
                      25,
                      35
                    ],
                    "prefix": false,
                    "fail": "Keep the required distances, radii, or angles. Compare the values in your code with the assignment."
                  },
                  {
                    "type": "literalNumbers",
                    "label": "Keep both 60-unit moves",
                    "commands": [
                      "forward"
                    ],
                    "values": [
                      60,
                      60
                    ],
                    "prefix": false,
                    "fail": "Keep the required distances, radii, or angles. Compare the values in your code with the assignment."
                  },
                  {
                    "type": "finalPosition",
                    "label": "Finish at (120, 0)",
                    "x": 120,
                    "y": 0,
                    "tolerance": 1,
                    "fail": "Follow each movement from the start. The turtle has not reached the marked target."
                  }
                ]
              },
              "requirements": [
                "Exactly 3 circles with radii 15, 25, 35.",
                "Keep both forward(60) movements.",
                "Change only the incorrect radius."
              ],
              "tip": "Compare the difference between neighboring radii.",
              "focusLines": [
                1,
                3,
                5
              ],
              "visuals": [
                {
                  "label": "Required growing pattern",
                  "bg": "#fbfaf6",
                  "caption": "Radii 15, 25, 35; starting points 60 apart.",
                  "previewCode": "circle(15)\nforward(60)\ncircle(25)\nforward(60)\ncircle(35)",
                  "paths": [
                    {
                      "points": [
                        [
                          25.647,
                          77.176
                        ],
                        [
                          72.235,
                          77.176
                        ]
                      ],
                      "stroke": "#202525",
                      "width": 2
                    },
                    {
                      "points": [
                        [
                          72.235,
                          77.176
                        ],
                        [
                          118.824,
                          77.176
                        ]
                      ],
                      "stroke": "#202525",
                      "width": 2
                    }
                  ],
                  "circles": [
                    {
                      "cx": 25.647,
                      "cy": 65.529,
                      "r": 11.647,
                      "stroke": "#202525",
                      "width": 2
                    },
                    {
                      "cx": 72.235,
                      "cy": 57.765,
                      "r": 19.412,
                      "stroke": "#202525",
                      "width": 2
                    },
                    {
                      "cx": 118.824,
                      "cy": 50,
                      "r": 27.176,
                      "stroke": "#202525",
                      "width": 2
                    }
                  ]
                }
              ],
              "visualsTitle": "Required result"
            },
            {
              "id": "1-5-solve-bubbles-choice",
              "title": "Create a five-bubble code.",
              "body": "Choose a small radius and a larger radius. Repeat them in a bent trail: small, large, small, large, small.",
              "task": "Start blank. Choose the two sizes, spacing, and shape of the trail. Run and check.",
              "phase": "Create your own",
              "draftId": "project",
              "lab": "\n",
              "typed": true,
              "requirements": [
                "Exactly 5 circles using 2 different radii.",
                "Alternate A–B–A–B–A.",
                "Move between every circle and use at least 1 turn.",
                "Keep the drawing inside the grid."
              ],
              "tip": "Reuse the two radius values consistently. Decide the sizes separately from the route.",
              "visuals": [
                {
                  "label": "Pulse chain",
                  "bg": "#fbfaf6",
                  "caption": "",
                  "previewCode": "circle(8)\nforward(30)\ncircle(18)\nforward(35)\ncircle(8)\nleft(30)\nforward(35)\ncircle(18)\nforward(30)\ncircle(8)",
                  "paths": [
                    {
                      "points": [
                        [
                          21.922,
                          75.297
                        ],
                        [
                          51.632,
                          75.297
                        ]
                      ],
                      "stroke": "#202525",
                      "width": 2
                    },
                    {
                      "points": [
                        [
                          51.632,
                          75.297
                        ],
                        [
                          86.293,
                          75.297
                        ]
                      ],
                      "stroke": "#202525",
                      "width": 2
                    },
                    {
                      "points": [
                        [
                          86.293,
                          75.297
                        ],
                        [
                          116.31,
                          57.966
                        ]
                      ],
                      "stroke": "#202525",
                      "width": 2
                    },
                    {
                      "points": [
                        [
                          116.31,
                          57.966
                        ],
                        [
                          142.039,
                          43.112
                        ]
                      ],
                      "stroke": "#202525",
                      "width": 2
                    }
                  ],
                  "circles": [
                    {
                      "cx": 21.922,
                      "cy": 67.374,
                      "r": 7.922,
                      "stroke": "#202525",
                      "width": 2
                    },
                    {
                      "cx": 51.632,
                      "cy": 57.471,
                      "r": 17.826,
                      "stroke": "#202525",
                      "width": 2
                    },
                    {
                      "cx": 86.293,
                      "cy": 67.374,
                      "r": 7.922,
                      "stroke": "#202525",
                      "width": 2
                    },
                    {
                      "cx": 107.397,
                      "cy": 42.529,
                      "r": 17.826,
                      "stroke": "#202525",
                      "width": 2
                    },
                    {
                      "cx": 138.078,
                      "cy": 36.251,
                      "r": 7.922,
                      "stroke": "#202525",
                      "width": 2
                    }
                  ]
                },
                {
                  "label": "Corner code",
                  "bg": "#fbfaf6",
                  "caption": "",
                  "previewCode": "circle(8)\nforward(35)\ncircle(16)\nleft(90)\nforward(35)\ncircle(8)\nforward(35)\ncircle(16)\nleft(90)\nforward(35)\ncircle(8)",
                  "paths": [
                    {
                      "points": [
                        [
                          62,
                          86
                        ],
                        [
                          91.302,
                          86
                        ]
                      ],
                      "stroke": "#202525",
                      "width": 2
                    },
                    {
                      "points": [
                        [
                          91.302,
                          86
                        ],
                        [
                          91.302,
                          56.698
                        ]
                      ],
                      "stroke": "#202525",
                      "width": 2
                    },
                    {
                      "points": [
                        [
                          91.302,
                          56.698
                        ],
                        [
                          91.302,
                          27.395
                        ]
                      ],
                      "stroke": "#202525",
                      "width": 2
                    },
                    {
                      "points": [
                        [
                          91.302,
                          27.395
                        ],
                        [
                          62,
                          27.395
                        ]
                      ],
                      "stroke": "#202525",
                      "width": 2
                    }
                  ],
                  "circles": [
                    {
                      "cx": 62,
                      "cy": 79.302,
                      "r": 6.698,
                      "stroke": "#202525",
                      "width": 2
                    },
                    {
                      "cx": 91.302,
                      "cy": 72.605,
                      "r": 13.395,
                      "stroke": "#202525",
                      "width": 2
                    },
                    {
                      "cx": 84.605,
                      "cy": 56.698,
                      "r": 6.698,
                      "stroke": "#202525",
                      "width": 2
                    },
                    {
                      "cx": 77.907,
                      "cy": 27.395,
                      "r": 13.395,
                      "stroke": "#202525",
                      "width": 2
                    },
                    {
                      "cx": 62,
                      "cy": 34.093,
                      "r": 6.698,
                      "stroke": "#202525",
                      "width": 2
                    }
                  ]
                },
                {
                  "label": "Bubble wave",
                  "bg": "#fbfaf6",
                  "caption": "",
                  "previewCode": "circle(8)\nleft(30)\nforward(30)\ncircle(15)\nright(60)\nforward(35)\ncircle(8)\nleft(60)\nforward(35)\ncircle(15)\nright(60)\nforward(30)\ncircle(8)",
                  "paths": [
                    {
                      "points": [
                        [
                          21.965,
                          69.623
                        ],
                        [
                          47.831,
                          54.689
                        ]
                      ],
                      "stroke": "#202525",
                      "width": 2
                    },
                    {
                      "points": [
                        [
                          47.831,
                          54.689
                        ],
                        [
                          78.009,
                          72.112
                        ]
                      ],
                      "stroke": "#202525",
                      "width": 2
                    },
                    {
                      "points": [
                        [
                          78.009,
                          72.112
                        ],
                        [
                          108.186,
                          54.689
                        ]
                      ],
                      "stroke": "#202525",
                      "width": 2
                    },
                    {
                      "points": [
                        [
                          108.186,
                          54.689
                        ],
                        [
                          134.053,
                          69.623
                        ]
                      ],
                      "stroke": "#202525",
                      "width": 2
                    }
                  ],
                  "circles": [
                    {
                      "cx": 21.965,
                      "cy": 61.658,
                      "r": 7.965,
                      "stroke": "#202525",
                      "width": 2
                    },
                    {
                      "cx": 40.364,
                      "cy": 41.755,
                      "r": 14.934,
                      "stroke": "#202525",
                      "width": 2
                    },
                    {
                      "cx": 81.991,
                      "cy": 65.214,
                      "r": 7.965,
                      "stroke": "#202525",
                      "width": 2
                    },
                    {
                      "cx": 100.719,
                      "cy": 41.755,
                      "r": 14.934,
                      "stroke": "#202525",
                      "width": 2
                    },
                    {
                      "cx": 138.035,
                      "cy": 62.725,
                      "r": 7.965,
                      "stroke": "#202525",
                      "width": 2
                    }
                  ]
                }
              ]
            }
          ],
          "group": "Circles + Patterns",
          "objective": "Arithmetic patterns and repeating sizes",
          "purpose": "Identify a size pattern and a placement pattern separately. Later, loops and variables will generate both.",
          "visuals": [
            {
              "label": "Pulse chain",
              "bg": "#fbfaf6",
              "caption": "",
              "previewCode": "circle(8)\nforward(30)\ncircle(18)\nforward(35)\ncircle(8)\nleft(30)\nforward(35)\ncircle(18)\nforward(30)\ncircle(8)",
              "paths": [
                {
                  "points": [
                    [
                      21.922,
                      75.297
                    ],
                    [
                      51.632,
                      75.297
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      51.632,
                      75.297
                    ],
                    [
                      86.293,
                      75.297
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      86.293,
                      75.297
                    ],
                    [
                      116.31,
                      57.966
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      116.31,
                      57.966
                    ],
                    [
                      142.039,
                      43.112
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                }
              ],
              "circles": [
                {
                  "cx": 21.922,
                  "cy": 67.374,
                  "r": 7.922,
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "cx": 51.632,
                  "cy": 57.471,
                  "r": 17.826,
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "cx": 86.293,
                  "cy": 67.374,
                  "r": 7.922,
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "cx": 107.397,
                  "cy": 42.529,
                  "r": 17.826,
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "cx": 138.078,
                  "cy": 36.251,
                  "r": 7.922,
                  "stroke": "#202525",
                  "width": 2
                }
              ]
            },
            {
              "label": "Corner code",
              "bg": "#fbfaf6",
              "caption": "",
              "previewCode": "circle(8)\nforward(35)\ncircle(16)\nleft(90)\nforward(35)\ncircle(8)\nforward(35)\ncircle(16)\nleft(90)\nforward(35)\ncircle(8)",
              "paths": [
                {
                  "points": [
                    [
                      62,
                      86
                    ],
                    [
                      91.302,
                      86
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      91.302,
                      86
                    ],
                    [
                      91.302,
                      56.698
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      91.302,
                      56.698
                    ],
                    [
                      91.302,
                      27.395
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      91.302,
                      27.395
                    ],
                    [
                      62,
                      27.395
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                }
              ],
              "circles": [
                {
                  "cx": 62,
                  "cy": 79.302,
                  "r": 6.698,
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "cx": 91.302,
                  "cy": 72.605,
                  "r": 13.395,
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "cx": 84.605,
                  "cy": 56.698,
                  "r": 6.698,
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "cx": 77.907,
                  "cy": 27.395,
                  "r": 13.395,
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "cx": 62,
                  "cy": 34.093,
                  "r": 6.698,
                  "stroke": "#202525",
                  "width": 2
                }
              ]
            },
            {
              "label": "Bubble wave",
              "bg": "#fbfaf6",
              "caption": "",
              "previewCode": "circle(8)\nleft(30)\nforward(30)\ncircle(15)\nright(60)\nforward(35)\ncircle(8)\nleft(60)\nforward(35)\ncircle(15)\nright(60)\nforward(30)\ncircle(8)",
              "paths": [
                {
                  "points": [
                    [
                      21.965,
                      69.623
                    ],
                    [
                      47.831,
                      54.689
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      47.831,
                      54.689
                    ],
                    [
                      78.009,
                      72.112
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      78.009,
                      72.112
                    ],
                    [
                      108.186,
                      54.689
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      108.186,
                      54.689
                    ],
                    [
                      134.053,
                      69.623
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                }
              ],
              "circles": [
                {
                  "cx": 21.965,
                  "cy": 61.658,
                  "r": 7.965,
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "cx": 40.364,
                  "cy": 41.755,
                  "r": 14.934,
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "cx": 81.991,
                  "cy": 65.214,
                  "r": 7.965,
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "cx": 100.719,
                  "cy": 41.755,
                  "r": 14.934,
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "cx": 138.035,
                  "cy": 62.725,
                  "r": 7.965,
                  "stroke": "#202525",
                  "width": 2
                }
              ]
            }
          ],
          "draftVersion": "unit1-v4",
          "contentVersion": "unit1-v4"
        },
        {
          "id": "1-6-create-bubbles",
          "number": "1.6",
          "title": "Bubble Creature",
          "type": "Create",
          "available": true,
          "notes": "Purpose: Use radius, movement, and heading to place parts of a drawing. Later, a function can build the same creature at different sizes. Students type the example and test the named line changes. Predictions record the first answer as well as the revised answer. A wrong first prediction can become a checked, correct explanation after observation. Fixed assignments must pass before the creative project opens. Discuss the saved note and ask the student to identify the command responsible for the observed result. Project checks grade the stated measurable requirements; the visual idea and quality of the design remain a teacher conversation. Ask what the student planned before typing and what they revised after running.",
          "check": {
            "rules": [
              {
                "type": "allowedCommands",
                "label": "Use only the commands in this assignment",
                "commands": [
                  "forward",
                  "backward",
                  "left",
                  "right",
                  "circle"
                ],
                "fail": "Use one command per line, with literal values. Comments are allowed. Loops and functions come later."
              },
              {
                "type": "minCalls",
                "label": "5+ circles",
                "commands": [
                  "circle"
                ],
                "count": 5,
                "fail": "Check the highlighted requirement and compare your output with the target."
              },
              {
                "type": "minDistinctNumbers",
                "label": "3+ circle radii",
                "commands": [
                  "circle"
                ],
                "count": 3,
                "fail": "Check the highlighted requirement and compare your output with the target."
              },
              {
                "type": "minCalls",
                "label": "Move to place different parts",
                "commands": [
                  "forward",
                  "backward"
                ],
                "count": 2,
                "fail": "Check the highlighted requirement and compare your output with the target."
              },
              {
                "type": "minCalls",
                "label": "Turn to place a part",
                "commands": [
                  "left",
                  "right"
                ],
                "count": 1,
                "fail": "Check the highlighted requirement and compare your output with the target."
              },
              {
                "type": "drawingBounds",
                "label": "Keep the drawing inside the grid",
                "limit": 190,
                "fail": "A line or circle extends beyond the grid. Reduce a distance or radius, or change the route."
              }
            ]
          },
          "starter": "",
          "visuals": [
            {
              "label": "Bubble bot",
              "bg": "#fbfaf6",
              "caption": "Connecting strokes can become the bot’s features.",
              "previewCode": "circle(30)\nleft(90)\nforward(35)\nright(90)\nbackward(12)\ncircle(6)\nforward(24)\ncircle(6)\nbackward(12)\nright(90)\nforward(20)\nleft(90)\ncircle(10)\nbackward(30)\ncircle(8)",
              "paths": [
                {
                  "points": [
                    [
                      84.8,
                      86
                    ],
                    [
                      84.8,
                      44
                    ],
                    [
                      70.4,
                      44
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2.4
                },
                {
                  "points": [
                    [
                      70.4,
                      44
                    ],
                    [
                      99.2,
                      44
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2.4
                },
                {
                  "points": [
                    [
                      99.2,
                      44
                    ],
                    [
                      84.8,
                      44
                    ],
                    [
                      84.8,
                      68
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2.4
                },
                {
                  "points": [
                    [
                      84.8,
                      68
                    ],
                    [
                      48.8,
                      68
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2.4
                }
              ],
              "circles": [
                {
                  "cx": 84.8,
                  "cy": 50,
                  "r": 36,
                  "stroke": "#202525",
                  "width": 2.4
                },
                {
                  "cx": 70.4,
                  "cy": 36.8,
                  "r": 7.2,
                  "stroke": "#202525",
                  "width": 2.4
                },
                {
                  "cx": 99.2,
                  "cy": 36.8,
                  "r": 7.2,
                  "stroke": "#202525",
                  "width": 2.4
                },
                {
                  "cx": 84.8,
                  "cy": 56,
                  "r": 12,
                  "stroke": "#202525",
                  "width": 2.4
                },
                {
                  "cx": 48.8,
                  "cy": 58.4,
                  "r": 9.6,
                  "stroke": "#202525",
                  "width": 2.4
                }
              ]
            },
            {
              "label": "Snow buddy",
              "bg": "#fbfaf6",
              "caption": "",
              "previewCode": "circle(30)\nleft(90)\nforward(60)\nright(90)\ncircle(20)\nleft(90)\nforward(25)\nright(90)\nbackward(8)\ncircle(4)\nforward(16)\ncircle(4)\nbackward(8)\nright(90)\nforward(12)\nleft(90)\ncircle(6)",
              "paths": [
                {
                  "points": [
                    [
                      80,
                      86
                    ],
                    [
                      80,
                      42.8
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      80,
                      42.8
                    ],
                    [
                      80,
                      24.8
                    ],
                    [
                      74.24,
                      24.8
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      74.24,
                      24.8
                    ],
                    [
                      85.76,
                      24.8
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      85.76,
                      24.8
                    ],
                    [
                      80,
                      24.8
                    ],
                    [
                      80,
                      33.44
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                }
              ],
              "circles": [
                {
                  "cx": 80,
                  "cy": 64.4,
                  "r": 21.6,
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "cx": 80,
                  "cy": 28.4,
                  "r": 14.4,
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "cx": 74.24,
                  "cy": 21.92,
                  "r": 2.88,
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "cx": 85.76,
                  "cy": 21.92,
                  "r": 2.88,
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "cx": 80,
                  "cy": 29.12,
                  "r": 4.32,
                  "stroke": "#202525",
                  "width": 2
                }
              ]
            },
            {
              "label": "Orbit creature",
              "bg": "#fbfaf6",
              "caption": "",
              "previewCode": "circle(22)\nleft(90)\ncircle(14)\nleft(90)\ncircle(22)\nleft(90)\ncircle(14)\nforward(35)\ncircle(6)\nbackward(10)\ncircle(8)",
              "paths": [
                {
                  "points": [
                    [
                      80,
                      50
                    ],
                    [
                      80,
                      78.636
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      80,
                      78.636
                    ],
                    [
                      80,
                      70.455
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                }
              ],
              "circles": [
                {
                  "cx": 80,
                  "cy": 32,
                  "r": 18,
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "cx": 68.545,
                  "cy": 50,
                  "r": 11.455,
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "cx": 80,
                  "cy": 68,
                  "r": 18,
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "cx": 91.455,
                  "cy": 50,
                  "r": 11.455,
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "cx": 84.909,
                  "cy": 78.636,
                  "r": 4.909,
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "cx": 86.545,
                  "cy": 70.455,
                  "r": 6.545,
                  "stroke": "#202525",
                  "width": 2
                }
              ]
            }
          ],
          "steps": [
            {
              "id": "1-6-create-bubbles-type-example",
              "title": "Type the example.",
              "body": "The first circle is a head. Move to a point inside it before drawing a smaller part. Connecting lines remain part of this sketch.",
              "task": "Start with an empty editor. Type the numbered commands. Run after each new movement or drawing command.",
              "phase": "Type the example",
              "example": "circle(30)\nleft(90)\nforward(35)\nright(90)\nbackward(12)",
              "numbered": true,
              "focusLines": [
                1,
                2,
                3,
                4,
                5
              ],
              "draftId": "example"
            },
            {
              "id": "1-6-create-bubbles-eyes",
              "title": "Add two matching eyes.",
              "body": "A full circle returns to its edge starting point. Move from there to place the second eye.",
              "task": "Add circle(6) on line 6, forward(24) on line 7, and circle(6) on line 8. Run after each addition.",
              "phase": "Change specific lines",
              "focusLines": [
                6,
                7,
                8
              ],
              "draftId": "example"
            },
            {
              "id": "1-6-create-bubbles-predict",
              "title": "Predict eye spacing.",
              "body": "Commit to a prediction before checking. Then compare it with the run.",
              "task": "Choose an answer, then Check prediction & run. Watch again to follow the highlighted lines.",
              "phase": "Predict and test",
              "example": "backward(12)\ncircle(6)\nforward(24)\ncircle(6)",
              "lab": "backward(12)\ncircle(6)\nforward(24)\ncircle(6)",
              "numbered": true,
              "draftId": "prediction-predict",
              "question": {
                "id": "1-6-create-bubbles-predict",
                "prompt": "If only forward(24) becomes forward(36), what changes?",
                "choices": [
                  "Both eyes grow",
                  "The second eye starts farther right",
                  "The first eye moves"
                ],
                "answer": 1,
                "explanation": "The move occurs after the first eye, so it changes the second eye’s position. The two circle radii stay 6."
              }
            },
            {
              "id": "1-6-create-bubbles-resize-part",
              "title": "Resize a part without moving it.",
              "body": "A radius controls size independently of the placement commands.",
              "task": "Change only line 6 to circle(10) and Run. Compare the two eyes. Then restore circle(6).",
              "phase": "Change specific lines",
              "focusLines": [
                6
              ],
              "draftId": "example"
            },
            {
              "id": "1-6-create-bubbles-reason",
              "title": "Predict the center after a turn.",
              "body": "Commit to a prediction before checking. Then compare it with the run.",
              "task": "Choose an answer, then Check prediction & run. Watch again to follow the highlighted lines.",
              "phase": "Predict and test",
              "example": "left(90)\ncircle(20)",
              "lab": "left(90)\ncircle(20)",
              "numbered": true,
              "draftId": "prediction-reason",
              "question": {
                "id": "1-6-create-bubbles-reason",
                "prompt": "The turtle faces up. Where is the circle’s center relative to its starting point?",
                "choices": [
                  "20 units left",
                  "20 units up",
                  "Exactly at the turtle"
                ],
                "answer": 0,
                "explanation": "For a positive radius, the center is to the turtle’s left. Facing up makes that screen-left. The turtle starts on the edge."
              }
            },
            {
              "id": "1-6-create-bubbles-evidence",
              "title": "Record one result.",
              "body": "Your notes stay in this lesson and save as you type.",
              "task": "Which line placed the second eye? Which lines set the eye sizes? Record their command names and values.",
              "phase": "Lesson notes",
              "draftId": "example",
              "response": {
                "id": "1-6-create-bubbles-evidence",
                "prompt": "Which line placed the second eye? Which lines set the eye sizes? Record their command names and values.",
                "placeholder": "Placement: line ___, ___. Sizes: lines ___ and ___, ___."
              }
            },
            {
              "id": "1-6-create-bubbles-transfer",
              "title": "Required: head and two matching eyes.",
              "body": "Build this fixed sketch before designing your own creature. The head radius is 30; each eye radius is 6.",
              "task": "Type the starting sketch, repair the two eye radii, and preserve every movement and turn. Run and check.",
              "phase": "Required assignment",
              "lab": "circle(30)\nleft(90)\nforward(35)\nright(90)\nbackward(12)\ncircle(10)\nforward(24)\ncircle(4)",
              "typed": true,
              "numbered": true,
              "example": "circle(30)\nleft(90)\nforward(35)\nright(90)\nbackward(12)\ncircle(10)\nforward(24)\ncircle(4)",
              "draftId": "assignment-transfer",
              "check": {
                "rules": [
                  {
                    "type": "allowedCommands",
                    "label": "Use only the commands in this assignment",
                    "commands": [
                      "forward",
                      "backward",
                      "left",
                      "right",
                      "circle"
                    ],
                    "fail": "Use one command per line, with literal values. Comments are allowed. Loops and functions come later."
                  },
                  {
                    "type": "commandSequence",
                    "label": "Keep the required command order",
                    "sequence": [
                      [
                        "circle"
                      ],
                      [
                        "left"
                      ],
                      [
                        "forward"
                      ],
                      [
                        "right"
                      ],
                      [
                        "backward"
                      ],
                      [
                        "circle"
                      ],
                      [
                        "forward"
                      ],
                      [
                        "circle"
                      ]
                    ],
                    "fail": "Read the command names from top to bottom and keep the required order."
                  },
                  {
                    "type": "literalNumbers",
                    "label": "Head radius 30; eye radii 6 and 6",
                    "commands": [
                      "circle"
                    ],
                    "values": [
                      30,
                      6,
                      6
                    ],
                    "prefix": false,
                    "fail": "Keep the required distances, radii, or angles. Compare the values in your code with the assignment."
                  },
                  {
                    "type": "literalNumbers",
                    "label": "Keep the placement moves",
                    "commands": [
                      "forward"
                    ],
                    "values": [
                      35,
                      24
                    ],
                    "prefix": false,
                    "fail": "Keep the required distances, radii, or angles. Compare the values in your code with the assignment."
                  },
                  {
                    "type": "literalNumbers",
                    "label": "Keep backward(12)",
                    "commands": [
                      "backward"
                    ],
                    "values": [
                      12
                    ],
                    "prefix": false,
                    "fail": "Keep the required distances, radii, or angles. Compare the values in your code with the assignment."
                  },
                  {
                    "type": "literalNumbers",
                    "label": "Keep the two turns",
                    "commands": [
                      "left",
                      "right"
                    ],
                    "values": [
                      90,
                      90
                    ],
                    "prefix": false,
                    "fail": "Keep the required distances, radii, or angles. Compare the values in your code with the assignment."
                  },
                  {
                    "type": "finalPosition",
                    "label": "Finish at (12, 35)",
                    "x": 12,
                    "y": 35,
                    "tolerance": 1,
                    "fail": "Follow each movement from the start. The turtle has not reached the marked target."
                  },
                  {
                    "type": "finalHeading",
                    "label": "Finish facing right",
                    "heading": 0,
                    "tolerance": 1,
                    "fail": "The position and the direction are separate. Check the last turn."
                  }
                ]
              },
              "requirements": [
                "Exactly 3 circles: head radius 30, eyes radius 6.",
                "Preserve the placement moves and turns.",
                "Finish at (12, 35), facing right."
              ],
              "tip": "Change size values in circle(), not placement values in movement commands.",
              "focusLines": [
                1,
                6,
                8
              ],
              "visuals": [
                {
                  "label": "Required bubble face",
                  "bg": "#fbfaf6",
                  "caption": "Head radius 30; two eyes radius 6.",
                  "previewCode": "circle(30)\nleft(90)\nforward(35)\nright(90)\nbackward(12)\ncircle(6)\nforward(24)\ncircle(6)",
                  "paths": [
                    {
                      "points": [
                        [
                          80,
                          86
                        ],
                        [
                          80,
                          44
                        ],
                        [
                          65.6,
                          44
                        ]
                      ],
                      "stroke": "#202525",
                      "width": 2.4
                    },
                    {
                      "points": [
                        [
                          65.6,
                          44
                        ],
                        [
                          94.4,
                          44
                        ]
                      ],
                      "stroke": "#202525",
                      "width": 2.4
                    }
                  ],
                  "circles": [
                    {
                      "cx": 80,
                      "cy": 50,
                      "r": 36,
                      "stroke": "#202525",
                      "width": 2.4
                    },
                    {
                      "cx": 65.6,
                      "cy": 36.8,
                      "r": 7.2,
                      "stroke": "#202525",
                      "width": 2.4
                    },
                    {
                      "cx": 94.4,
                      "cy": 36.8,
                      "r": 7.2,
                      "stroke": "#202525",
                      "width": 2.4
                    }
                  ]
                }
              ],
              "visualsTitle": "Required result"
            },
            {
              "id": "1-6-create-bubbles-choice",
              "title": "Create a bubble creature.",
              "body": "Make a bot, a snow creature, an orbit creature, or your own character from circles and connecting lines. Choose what the different sizes represent.",
              "task": "Build from blank. Place the parts deliberately, then Run and Check my code.",
              "phase": "Create your own",
              "draftId": "project",
              "lab": "\n",
              "typed": true,
              "requirements": [
                "At least 5 circles using at least 3 radii.",
                "At least 2 movements to place parts.",
                "At least 1 turn.",
                "Keep the whole creature inside the grid."
              ],
              "tip": "Use a large circle for a body and smaller circles for details. Overlap can be intentional; movement changes where the next part starts.",
              "visuals": [
                {
                  "label": "Bubble bot",
                  "bg": "#fbfaf6",
                  "caption": "Connecting strokes can become the bot’s features.",
                  "previewCode": "circle(30)\nleft(90)\nforward(35)\nright(90)\nbackward(12)\ncircle(6)\nforward(24)\ncircle(6)\nbackward(12)\nright(90)\nforward(20)\nleft(90)\ncircle(10)\nbackward(30)\ncircle(8)",
                  "paths": [
                    {
                      "points": [
                        [
                          84.8,
                          86
                        ],
                        [
                          84.8,
                          44
                        ],
                        [
                          70.4,
                          44
                        ]
                      ],
                      "stroke": "#202525",
                      "width": 2.4
                    },
                    {
                      "points": [
                        [
                          70.4,
                          44
                        ],
                        [
                          99.2,
                          44
                        ]
                      ],
                      "stroke": "#202525",
                      "width": 2.4
                    },
                    {
                      "points": [
                        [
                          99.2,
                          44
                        ],
                        [
                          84.8,
                          44
                        ],
                        [
                          84.8,
                          68
                        ]
                      ],
                      "stroke": "#202525",
                      "width": 2.4
                    },
                    {
                      "points": [
                        [
                          84.8,
                          68
                        ],
                        [
                          48.8,
                          68
                        ]
                      ],
                      "stroke": "#202525",
                      "width": 2.4
                    }
                  ],
                  "circles": [
                    {
                      "cx": 84.8,
                      "cy": 50,
                      "r": 36,
                      "stroke": "#202525",
                      "width": 2.4
                    },
                    {
                      "cx": 70.4,
                      "cy": 36.8,
                      "r": 7.2,
                      "stroke": "#202525",
                      "width": 2.4
                    },
                    {
                      "cx": 99.2,
                      "cy": 36.8,
                      "r": 7.2,
                      "stroke": "#202525",
                      "width": 2.4
                    },
                    {
                      "cx": 84.8,
                      "cy": 56,
                      "r": 12,
                      "stroke": "#202525",
                      "width": 2.4
                    },
                    {
                      "cx": 48.8,
                      "cy": 58.4,
                      "r": 9.6,
                      "stroke": "#202525",
                      "width": 2.4
                    }
                  ]
                },
                {
                  "label": "Snow buddy",
                  "bg": "#fbfaf6",
                  "caption": "",
                  "previewCode": "circle(30)\nleft(90)\nforward(60)\nright(90)\ncircle(20)\nleft(90)\nforward(25)\nright(90)\nbackward(8)\ncircle(4)\nforward(16)\ncircle(4)\nbackward(8)\nright(90)\nforward(12)\nleft(90)\ncircle(6)",
                  "paths": [
                    {
                      "points": [
                        [
                          80,
                          86
                        ],
                        [
                          80,
                          42.8
                        ]
                      ],
                      "stroke": "#202525",
                      "width": 2
                    },
                    {
                      "points": [
                        [
                          80,
                          42.8
                        ],
                        [
                          80,
                          24.8
                        ],
                        [
                          74.24,
                          24.8
                        ]
                      ],
                      "stroke": "#202525",
                      "width": 2
                    },
                    {
                      "points": [
                        [
                          74.24,
                          24.8
                        ],
                        [
                          85.76,
                          24.8
                        ]
                      ],
                      "stroke": "#202525",
                      "width": 2
                    },
                    {
                      "points": [
                        [
                          85.76,
                          24.8
                        ],
                        [
                          80,
                          24.8
                        ],
                        [
                          80,
                          33.44
                        ]
                      ],
                      "stroke": "#202525",
                      "width": 2
                    }
                  ],
                  "circles": [
                    {
                      "cx": 80,
                      "cy": 64.4,
                      "r": 21.6,
                      "stroke": "#202525",
                      "width": 2
                    },
                    {
                      "cx": 80,
                      "cy": 28.4,
                      "r": 14.4,
                      "stroke": "#202525",
                      "width": 2
                    },
                    {
                      "cx": 74.24,
                      "cy": 21.92,
                      "r": 2.88,
                      "stroke": "#202525",
                      "width": 2
                    },
                    {
                      "cx": 85.76,
                      "cy": 21.92,
                      "r": 2.88,
                      "stroke": "#202525",
                      "width": 2
                    },
                    {
                      "cx": 80,
                      "cy": 29.12,
                      "r": 4.32,
                      "stroke": "#202525",
                      "width": 2
                    }
                  ]
                },
                {
                  "label": "Orbit creature",
                  "bg": "#fbfaf6",
                  "caption": "",
                  "previewCode": "circle(22)\nleft(90)\ncircle(14)\nleft(90)\ncircle(22)\nleft(90)\ncircle(14)\nforward(35)\ncircle(6)\nbackward(10)\ncircle(8)",
                  "paths": [
                    {
                      "points": [
                        [
                          80,
                          50
                        ],
                        [
                          80,
                          78.636
                        ]
                      ],
                      "stroke": "#202525",
                      "width": 2
                    },
                    {
                      "points": [
                        [
                          80,
                          78.636
                        ],
                        [
                          80,
                          70.455
                        ]
                      ],
                      "stroke": "#202525",
                      "width": 2
                    }
                  ],
                  "circles": [
                    {
                      "cx": 80,
                      "cy": 32,
                      "r": 18,
                      "stroke": "#202525",
                      "width": 2
                    },
                    {
                      "cx": 68.545,
                      "cy": 50,
                      "r": 11.455,
                      "stroke": "#202525",
                      "width": 2
                    },
                    {
                      "cx": 80,
                      "cy": 68,
                      "r": 18,
                      "stroke": "#202525",
                      "width": 2
                    },
                    {
                      "cx": 91.455,
                      "cy": 50,
                      "r": 11.455,
                      "stroke": "#202525",
                      "width": 2
                    },
                    {
                      "cx": 84.909,
                      "cy": 78.636,
                      "r": 4.909,
                      "stroke": "#202525",
                      "width": 2
                    },
                    {
                      "cx": 86.545,
                      "cy": 70.455,
                      "r": 6.545,
                      "stroke": "#202525",
                      "width": 2
                    }
                  ]
                }
              ]
            }
          ],
          "group": "Circles + Patterns",
          "objective": "Circle placement and overlapping parts",
          "purpose": "Use radius, movement, and heading to place parts of a drawing. Later, a function can build the same creature at different sizes.",
          "draftVersion": "unit1-v4",
          "contentVersion": "unit1-v4"
        },
        {
          "id": "1-7-make-sequence",
          "number": "1.7",
          "title": "Make Sense of Sequence",
          "type": "Make",
          "available": true,
          "notes": "Purpose: Predict execution one command at a time. The order of operations will matter even more when programs contain decisions and loops. Students type the example and test the named line changes. Predictions record the first answer as well as the revised answer. A wrong first prediction can become a checked, correct explanation after observation. Fixed assignments must pass before the creative project opens. Discuss the saved note and ask the student to identify the command responsible for the observed result. Project checks grade the stated measurable requirements; the visual idea and quality of the design remain a teacher conversation. Ask the student to change one value and predict which visible property it controls.",
          "check": {
            "rules": [
              {
                "type": "allowedCommands",
                "label": "Use only the commands in this assignment",
                "commands": [
                  "forward",
                  "backward",
                  "left",
                  "right"
                ],
                "fail": "Use one command per line, with literal values. Comments are allowed. Loops and functions come later."
              },
              {
                "type": "exactTurtleCalls",
                "label": "Exactly 5 Turtle commands",
                "count": 5,
                "fail": "Check the highlighted requirement and compare your output with the target."
              },
              {
                "type": "commandSequence",
                "label": "Keep the required command order",
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
                "fail": "Read the command names from top to bottom and keep the required order."
              },
              {
                "type": "drawnMoves",
                "label": "3 visible movement segments",
                "count": 3,
                "fail": "Check the highlighted requirement and compare your output with the target."
              },
              {
                "type": "drawingBounds",
                "label": "Keep the drawing inside the grid",
                "limit": 190,
                "fail": "A line or circle extends beyond the grid. Reduce a distance or radius, or change the route."
              }
            ]
          },
          "starter": "",
          "visuals": [
            {
              "label": "Cliff step",
              "bg": "#fbfaf6",
              "caption": "",
              "previewCode": "forward(60)\nleft(90)\nforward(40)\nright(90)\nforward(35)",
              "paths": [
                {
                  "points": [
                    [
                      14,
                      77.789
                    ],
                    [
                      97.368,
                      77.789
                    ],
                    [
                      97.368,
                      22.211
                    ],
                    [
                      146,
                      22.211
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2.778947368421053
                }
              ],
              "circles": []
            },
            {
              "label": "Lightning notch",
              "bg": "#fbfaf6",
              "caption": "",
              "previewCode": "forward(60)\nright(135)\nforward(30)\nleft(135)\nforward(60)",
              "paths": [
                {
                  "points": [
                    [
                      14,
                      35.827
                    ],
                    [
                      94.173,
                      35.827
                    ],
                    [
                      65.827,
                      64.173
                    ],
                    [
                      146,
                      64.173
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2.6724219144801045
                }
              ],
              "circles": []
            },
            {
              "label": "Roof ridge",
              "bg": "#fbfaf6",
              "caption": "",
              "previewCode": "forward(30)\nleft(45)\nforward(50)\nright(90)\nforward(50)",
              "paths": [
                {
                  "points": [
                    [
                      14,
                      73.17
                    ],
                    [
                      53.321,
                      73.17
                    ],
                    [
                      99.66,
                      26.83
                    ],
                    [
                      146,
                      73.17
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2.621370493493867
                }
              ],
              "circles": []
            }
          ],
          "steps": [
            {
              "id": "1-7-make-sequence-type-example",
              "title": "Type the example.",
              "body": "Python runs the top-level commands from top to bottom. Each movement uses the direction left by earlier commands.",
              "task": "Type the three lines. Use Step three times and watch which line executes and what changes.",
              "phase": "Type the example",
              "example": "forward(40)\nleft(90)\nforward(30)",
              "numbered": true,
              "focusLines": [
                1,
                2,
                3
              ],
              "draftId": "example"
            },
            {
              "id": "1-7-make-sequence-predict",
              "title": "Predict the original endpoint.",
              "body": "Commit to a prediction before checking. Then compare it with the run.",
              "task": "Choose an answer, then Check prediction & run. Watch again to follow the highlighted lines.",
              "phase": "Predict and test",
              "example": "forward(40)\nleft(90)\nforward(30)",
              "lab": "forward(40)\nleft(90)\nforward(30)",
              "numbered": true,
              "draftId": "prediction-predict",
              "question": {
                "id": "1-7-make-sequence-predict",
                "prompt": "Where does the turtle finish?",
                "choices": [
                  "(40, 30)",
                  "(70, 0)",
                  "(0, 70)"
                ],
                "answer": 0,
                "explanation": "Line 1 moves right 40. Line 2 turns up without moving. Line 3 moves up 30."
              }
            },
            {
              "id": "1-7-make-sequence-swap",
              "title": "Move the turn before the first movement.",
              "body": "The same commands can create a different result when their order changes.",
              "task": "Swap lines 1 and 2: put left(90) first, then forward(40). Keep forward(30) on line 3. Run and compare.",
              "phase": "Change specific lines",
              "focusLines": [
                1,
                2
              ],
              "draftId": "example"
            },
            {
              "id": "1-7-make-sequence-reason",
              "title": "Predict the swapped endpoint.",
              "body": "Commit to a prediction before checking. Then compare it with the run.",
              "task": "Choose an answer, then Check prediction & run. Watch again to follow the highlighted lines.",
              "phase": "Predict and test",
              "example": "left(90)\nforward(40)\nforward(30)",
              "lab": "left(90)\nforward(40)\nforward(30)",
              "numbered": true,
              "draftId": "prediction-reason",
              "question": {
                "id": "1-7-make-sequence-reason",
                "prompt": "Where does this version finish?",
                "choices": [
                  "(40, 30)",
                  "(70, 0)",
                  "(0, 70)"
                ],
                "answer": 2,
                "explanation": "The turtle turns up before either movement. Both distances extend the same vertical line: 40 + 30 = 70."
              }
            },
            {
              "id": "1-7-make-sequence-restore",
              "title": "Restore two visible corners.",
              "body": "A turn belongs before the movement whose direction it should change.",
              "task": "Restore the original three lines. Add right(90) on line 4 and forward(20) on line 5. Run with Step.",
              "phase": "Change specific lines",
              "focusLines": [
                1,
                2,
                4,
                5
              ],
              "draftId": "example"
            },
            {
              "id": "1-7-make-sequence-evidence",
              "title": "Record one result.",
              "body": "Your notes stay in this lesson and save as you type.",
              "task": "Compare the original and swapped programs. Which line first changes their results, and what happens differently there?",
              "phase": "Lesson notes",
              "draftId": "example",
              "response": {
                "id": "1-7-make-sequence-evidence",
                "prompt": "Compare the original and swapped programs. Which line first changes their results, and what happens differently there?",
                "placeholder": "Line ___ differs first. Original: ___. Swapped: ___."
              }
            },
            {
              "id": "1-7-make-sequence-transfer",
              "title": "Required: reorder the same five commands.",
              "body": "Use the existing commands and numbers. The target route goes right 50, up 30, then right 20.",
              "task": "Type the scrambled program. Reorder its lines without adding commands or changing values, then Run and check.",
              "phase": "Required assignment",
              "lab": "forward(50)\nforward(30)\nleft(90)\nforward(20)\nright(90)",
              "typed": true,
              "numbered": true,
              "example": "forward(50)\nforward(30)\nleft(90)\nforward(20)\nright(90)",
              "draftId": "assignment-transfer",
              "check": {
                "rules": [
                  {
                    "type": "allowedCommands",
                    "label": "Use only the commands in this assignment",
                    "commands": [
                      "forward",
                      "backward",
                      "left",
                      "right"
                    ],
                    "fail": "Use one command per line, with literal values. Comments are allowed. Loops and functions come later."
                  },
                  {
                    "type": "commandSequence",
                    "label": "Keep the required command order",
                    "sequence": [
                      [
                        "forward"
                      ],
                      [
                        "left"
                      ],
                      [
                        "forward"
                      ],
                      [
                        "right"
                      ],
                      [
                        "forward"
                      ]
                    ],
                    "fail": "Read the command names from top to bottom and keep the required order."
                  },
                  {
                    "type": "literalNumbers",
                    "label": "Keep distances 50, 30, 20",
                    "commands": [
                      "forward"
                    ],
                    "values": [
                      50,
                      30,
                      20
                    ],
                    "prefix": false,
                    "fail": "Keep the required distances, radii, or angles. Compare the values in your code with the assignment."
                  },
                  {
                    "type": "literalNumbers",
                    "label": "Keep left(90)",
                    "commands": [
                      "left"
                    ],
                    "values": [
                      90
                    ],
                    "prefix": false,
                    "fail": "Keep the required distances, radii, or angles. Compare the values in your code with the assignment."
                  },
                  {
                    "type": "literalNumbers",
                    "label": "Keep right(90)",
                    "commands": [
                      "right"
                    ],
                    "values": [
                      90
                    ],
                    "prefix": false,
                    "fail": "Keep the required distances, radii, or angles. Compare the values in your code with the assignment."
                  },
                  {
                    "type": "finalPosition",
                    "label": "Finish at (70, 30)",
                    "x": 70,
                    "y": 30,
                    "tolerance": 1,
                    "fail": "Follow each movement from the start. The turtle has not reached the marked target."
                  },
                  {
                    "type": "finalHeading",
                    "label": "Finish facing right",
                    "heading": 0,
                    "tolerance": 1,
                    "fail": "The position and the direction are separate. Check the last turn."
                  }
                ]
              },
              "requirements": [
                "Use exactly the same 5 commands and values.",
                "Route: right 50 → up 30 → right 20.",
                "Finish at (70, 30), facing right."
              ],
              "tip": "Place each turn immediately before the move it needs to direct.",
              "focusLines": [
                1,
                2,
                3,
                4,
                5
              ],
              "visuals": [
                {
                  "label": "Required ordered route",
                  "bg": "#fbfaf6",
                  "caption": "Right 50 → up 30 → right 20.",
                  "previewCode": "forward(50)\nleft(90)\nforward(30)\nright(90)\nforward(20)",
                  "paths": [
                    {
                      "points": [
                        [
                          14,
                          78.286
                        ],
                        [
                          108.286,
                          78.286
                        ],
                        [
                          108.286,
                          21.714
                        ],
                        [
                          146,
                          21.714
                        ]
                      ],
                      "stroke": "#202525",
                      "width": 3.7714285714285714
                    }
                  ],
                  "circles": []
                }
              ],
              "visualsTitle": "Required result"
            },
            {
              "id": "1-7-make-sequence-choice",
              "title": "Create a two-corner trail.",
              "body": "Choose a cliff step, a lightning notch, a roof ridge, or another trail. Your five-command budget makes the order matter.",
              "task": "Start blank. Use the order move → turn → move → turn → move. Run and check.",
              "phase": "Create your own",
              "draftId": "project",
              "lab": "\n",
              "typed": true,
              "requirements": [
                "Exactly 5 Turtle commands.",
                "3 nonzero movements and 2 nonzero turns, alternating.",
                "Keep the route inside the grid."
              ],
              "tip": "A turn on the final line changes the turtle’s direction but adds no new segment. Put turns between movements.",
              "visuals": [
                {
                  "label": "Cliff step",
                  "bg": "#fbfaf6",
                  "caption": "",
                  "previewCode": "forward(60)\nleft(90)\nforward(40)\nright(90)\nforward(35)",
                  "paths": [
                    {
                      "points": [
                        [
                          14,
                          77.789
                        ],
                        [
                          97.368,
                          77.789
                        ],
                        [
                          97.368,
                          22.211
                        ],
                        [
                          146,
                          22.211
                        ]
                      ],
                      "stroke": "#202525",
                      "width": 2.778947368421053
                    }
                  ],
                  "circles": []
                },
                {
                  "label": "Lightning notch",
                  "bg": "#fbfaf6",
                  "caption": "",
                  "previewCode": "forward(60)\nright(135)\nforward(30)\nleft(135)\nforward(60)",
                  "paths": [
                    {
                      "points": [
                        [
                          14,
                          35.827
                        ],
                        [
                          94.173,
                          35.827
                        ],
                        [
                          65.827,
                          64.173
                        ],
                        [
                          146,
                          64.173
                        ]
                      ],
                      "stroke": "#202525",
                      "width": 2.6724219144801045
                    }
                  ],
                  "circles": []
                },
                {
                  "label": "Roof ridge",
                  "bg": "#fbfaf6",
                  "caption": "",
                  "previewCode": "forward(30)\nleft(45)\nforward(50)\nright(90)\nforward(50)",
                  "paths": [
                    {
                      "points": [
                        [
                          14,
                          73.17
                        ],
                        [
                          53.321,
                          73.17
                        ],
                        [
                          99.66,
                          26.83
                        ],
                        [
                          146,
                          73.17
                        ]
                      ],
                      "stroke": "#202525",
                      "width": 2.621370493493867
                    }
                  ],
                  "circles": []
                }
              ]
            }
          ],
          "group": "Sequence + Debugging",
          "objective": "Execution order and tracing",
          "purpose": "Predict execution one command at a time. The order of operations will matter even more when programs contain decisions and loops.",
          "draftVersion": "unit1-v4",
          "contentVersion": "unit1-v4"
        },
        {
          "id": "1-8-solve-debug",
          "number": "1.8",
          "title": "Debug Challenge",
          "type": "Solve",
          "available": true,
          "notes": "Purpose: Separate syntax errors, unknown commands, and wrong results. This gives you a method for debugging longer programs. Students type the example and test the named line changes. Predictions record the first answer as well as the revised answer. A wrong first prediction can become a checked, correct explanation after observation. Fixed assignments must pass before the creative project opens. Discuss the saved note and ask the student to identify the command responsible for the observed result. Project checks grade the stated measurable requirements; the visual idea and quality of the design remain a teacher conversation. Ask which line first differs from the intended result before offering a hint.",
          "check": {
            "rules": [
              {
                "type": "allowedCommands",
                "label": "Use only the commands in this assignment",
                "commands": [
                  "forward",
                  "backward",
                  "left",
                  "right"
                ],
                "fail": "Use one command per line, with literal values. Comments are allowed. Loops and functions come later."
              },
              {
                "type": "exactTurtleCalls",
                "label": "Exactly 5 Turtle commands",
                "count": 5,
                "fail": "Check the highlighted requirement and compare your output with the target."
              },
              {
                "type": "commandSequence",
                "label": "Keep the required command order",
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
                "fail": "Read the command names from top to bottom and keep the required order."
              },
              {
                "type": "drawingBounds",
                "label": "Keep the drawing inside the grid",
                "limit": 190,
                "fail": "A line or circle extends beyond the grid. Reduce a distance or radius, or change the route."
              }
            ]
          },
          "starter": "",
          "steps": [
            {
              "id": "1-8-solve-debug-type-example",
              "title": "Type the example.",
              "body": "This is intentionally broken. Python must parse the whole program before it can run the commands.",
              "task": "Type the five lines with the mistakes shown. If the editor supplies the closing ) on line 2, delete it for this test. Press Run and read the error in Output.",
              "phase": "Type the example",
              "example": "forword(70)\nleft(90\nforward(40)\nrite(90)\nforward(70)",
              "numbered": true,
              "focusLines": [
                1,
                2,
                3,
                4,
                5
              ],
              "draftId": "example"
            },
            {
              "id": "1-8-solve-debug-syntax",
              "title": "Repair the unclosed command first.",
              "body": "A missing closing parenthesis can make Python report the following line.",
              "task": "Add the missing ) to line 2 so it reads left(90). Run again. Read the next error before changing anything else.",
              "phase": "Change specific lines",
              "focusLines": [
                2
              ],
              "draftId": "example"
            },
            {
              "id": "1-8-solve-debug-predict",
              "title": "Predict a misspelled command.",
              "body": "Commit to a prediction before checking. Then compare it with the run.",
              "task": "Choose an answer, then Check prediction & run. Watch again to follow the highlighted lines.",
              "phase": "Predict and test",
              "example": "forwad(30)",
              "lab": "forwad(30)",
              "numbered": true,
              "draftId": "prediction-predict",
              "question": {
                "id": "1-8-solve-debug-predict",
                "prompt": "What prevents this command from running?",
                "choices": [
                  "The distance is too short",
                  "The command name is unknown",
                  "A turn must come first"
                ],
                "answer": 1,
                "explanation": "forwad is not the name of a Python command in this editor. The spelling must be forward; changing 30 would leave the same NameError."
              }
            },
            {
              "id": "1-8-solve-debug-names",
              "title": "Repair the two command names.",
              "body": "Once the syntax is valid, Python can reach the first unknown name.",
              "task": "On line 1 replace forword with forward and Run. Then on line 4 replace rite with right and Run. Keep every number.",
              "phase": "Change specific lines",
              "focusLines": [
                1,
                4
              ],
              "draftId": "example"
            },
            {
              "id": "1-8-solve-debug-reason",
              "title": "Predict what runs before a parse error.",
              "body": "Commit to a prediction before checking. Then compare it with the run.",
              "task": "Choose an answer, then Check prediction & run. Watch again to follow the highlighted lines.",
              "phase": "Predict and test",
              "example": "forward(30\nleft(90)",
              "lab": "forward(30\nleft(90)",
              "numbered": true,
              "draftId": "prediction-reason",
              "question": {
                "id": "1-8-solve-debug-reason",
                "prompt": "What can run while the parenthesis is unclosed?",
                "choices": [
                  "Only the first line",
                  "Both lines",
                  "Neither line"
                ],
                "answer": 2,
                "explanation": "Python cannot parse this program, so no movement executes. Repair the unfinished command before testing the route."
              }
            },
            {
              "id": "1-8-solve-debug-evidence",
              "title": "Record one result.",
              "body": "Your notes stay in this lesson and save as you type.",
              "task": "Record one error from this example, the line you repaired, and the exact change that fixed it.",
              "phase": "Lesson notes",
              "draftId": "example",
              "response": {
                "id": "1-8-solve-debug-evidence",
                "prompt": "Record one error from this example, the line you repaired, and the exact change that fixed it.",
                "placeholder": "Error: ___. Line: ___. I changed ___ to ___. The next run ___."
              }
            },
            {
              "id": "1-8-solve-debug-transfer",
              "title": "Required: fix a name and a wrong result.",
              "body": "This route should go right 60, up 30, then right 60. It contains an unknown command and an incorrect distance.",
              "task": "Type the program. Repair the name error, Run, then repair the route. Keep five commands and check.",
              "phase": "Required assignment",
              "lab": "forword(60)\nleft(90)\nforward(30)\nright(90)\nforward(20)",
              "typed": true,
              "numbered": true,
              "example": "forword(60)\nleft(90)\nforward(30)\nright(90)\nforward(20)",
              "draftId": "assignment-transfer",
              "check": {
                "rules": [
                  {
                    "type": "allowedCommands",
                    "label": "Use only the commands in this assignment",
                    "commands": [
                      "forward",
                      "backward",
                      "left",
                      "right"
                    ],
                    "fail": "Use one command per line, with literal values. Comments are allowed. Loops and functions come later."
                  },
                  {
                    "type": "commandSequence",
                    "label": "Keep the required command order",
                    "sequence": [
                      [
                        "forward"
                      ],
                      [
                        "left"
                      ],
                      [
                        "forward"
                      ],
                      [
                        "right"
                      ],
                      [
                        "forward"
                      ]
                    ],
                    "fail": "Read the command names from top to bottom and keep the required order."
                  },
                  {
                    "type": "literalNumbers",
                    "label": "Distances 60 → 30 → 60",
                    "commands": [
                      "forward"
                    ],
                    "values": [
                      60,
                      30,
                      60
                    ],
                    "prefix": false,
                    "fail": "Keep the required distances, radii, or angles. Compare the values in your code with the assignment."
                  },
                  {
                    "type": "literalNumbers",
                    "label": "Keep both 90° turns",
                    "commands": [
                      "left",
                      "right"
                    ],
                    "values": [
                      90,
                      90
                    ],
                    "prefix": false,
                    "fail": "Keep the required distances, radii, or angles. Compare the values in your code with the assignment."
                  },
                  {
                    "type": "finalPosition",
                    "label": "Finish at (120, 30)",
                    "x": 120,
                    "y": 30,
                    "tolerance": 1,
                    "fail": "Follow each movement from the start. The turtle has not reached the marked target."
                  },
                  {
                    "type": "finalHeading",
                    "label": "Finish facing right",
                    "heading": 0,
                    "tolerance": 1,
                    "fail": "The position and the direction are separate. Check the last turn."
                  }
                ]
              },
              "requirements": [
                "The program runs without an error.",
                "Exactly 5 commands, with movements 60, 30, 60.",
                "Finish at (120, 30), facing right."
              ],
              "tip": "A successful run only confirms the syntax and names. Compare the output with the intended distances too.",
              "focusLines": [
                1,
                2,
                3,
                4,
                5
              ],
              "visuals": [
                {
                  "label": "Required repaired route",
                  "bg": "#fbfaf6",
                  "caption": "Right 60 → up 30 → right 60.",
                  "previewCode": "forward(60)\nleft(90)\nforward(30)\nright(90)\nforward(60)",
                  "paths": [
                    {
                      "points": [
                        [
                          14,
                          66.5
                        ],
                        [
                          80,
                          66.5
                        ],
                        [
                          80,
                          33.5
                        ],
                        [
                          146,
                          33.5
                        ]
                      ],
                      "stroke": "#202525",
                      "width": 2.2
                    }
                  ],
                  "circles": []
                }
              ],
              "visualsTitle": "Required result"
            },
            {
              "id": "1-8-solve-debug-choice",
              "title": "Create and debug your own trail.",
              "body": "Choose the path, then use a deliberate spelling error to practice reading Python’s response.",
              "task": "Build a five-command trail and Run. Misspell one movement command and Run again. Restore it, Run, then Check my code.",
              "phase": "Create your own",
              "draftId": "project",
              "lab": "\n",
              "typed": true,
              "requirements": [
                "Exactly 5 Turtle commands in move → turn → move → turn → move order.",
                "Every movement and turn is nonzero.",
                "The final version runs and stays inside the grid."
              ],
              "tip": "For the debugging test, change one letter in a movement command. The error should name that unknown command.",
              "visuals": [
                {
                  "label": "Switchback",
                  "bg": "#fbfaf6",
                  "caption": "",
                  "previewCode": "forward(45)\nleft(90)\nforward(30)\nright(90)\nforward(65)",
                  "paths": [
                    {
                      "points": [
                        [
                          14,
                          68
                        ],
                        [
                          68,
                          68
                        ],
                        [
                          68,
                          32
                        ],
                        [
                          146,
                          32
                        ]
                      ],
                      "stroke": "#202525",
                      "width": 2.4
                    }
                  ],
                  "circles": []
                },
                {
                  "label": "Three-sided frame",
                  "bg": "#fbfaf6",
                  "caption": "",
                  "previewCode": "forward(60)\nleft(90)\nforward(45)\nleft(90)\nforward(60)",
                  "paths": [
                    {
                      "points": [
                        [
                          32,
                          86
                        ],
                        [
                          128,
                          86
                        ],
                        [
                          128,
                          14
                        ],
                        [
                          32,
                          14
                        ]
                      ],
                      "stroke": "#202525",
                      "width": 3.1999999999999993
                    }
                  ],
                  "circles": []
                },
                {
                  "label": "Mountain repair",
                  "bg": "#fbfaf6",
                  "caption": "",
                  "previewCode": "forward(35)\nleft(45)\nforward(50)\nright(90)\nforward(50)",
                  "paths": [
                    {
                      "points": [
                        [
                          14,
                          72.074
                        ],
                        [
                          57.704,
                          72.074
                        ],
                        [
                          101.852,
                          27.926
                        ],
                        [
                          146,
                          72.074
                        ]
                      ],
                      "stroke": "#202525",
                      "width": 2.4973825227350606
                    }
                  ],
                  "circles": []
                }
              ]
            }
          ],
          "group": "Sequence + Debugging",
          "objective": "Error messages and one-change repairs",
          "purpose": "Separate syntax errors, unknown commands, and wrong results. This gives you a method for debugging longer programs.",
          "visuals": [
            {
              "label": "Switchback",
              "bg": "#fbfaf6",
              "caption": "",
              "previewCode": "forward(45)\nleft(90)\nforward(30)\nright(90)\nforward(65)",
              "paths": [
                {
                  "points": [
                    [
                      14,
                      68
                    ],
                    [
                      68,
                      68
                    ],
                    [
                      68,
                      32
                    ],
                    [
                      146,
                      32
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2.4
                }
              ],
              "circles": []
            },
            {
              "label": "Three-sided frame",
              "bg": "#fbfaf6",
              "caption": "",
              "previewCode": "forward(60)\nleft(90)\nforward(45)\nleft(90)\nforward(60)",
              "paths": [
                {
                  "points": [
                    [
                      32,
                      86
                    ],
                    [
                      128,
                      86
                    ],
                    [
                      128,
                      14
                    ],
                    [
                      32,
                      14
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 3.1999999999999993
                }
              ],
              "circles": []
            },
            {
              "label": "Mountain repair",
              "bg": "#fbfaf6",
              "caption": "",
              "previewCode": "forward(35)\nleft(45)\nforward(50)\nright(90)\nforward(50)",
              "paths": [
                {
                  "points": [
                    [
                      14,
                      72.074
                    ],
                    [
                      57.704,
                      72.074
                    ],
                    [
                      101.852,
                      27.926
                    ],
                    [
                      146,
                      72.074
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2.4973825227350606
                }
              ],
              "circles": []
            }
          ],
          "draftVersion": "unit1-v4",
          "contentVersion": "unit1-v4"
        },
        {
          "id": "1-9-create-five-lines",
          "number": "1.9",
          "title": "Five-Command Logo",
          "type": "Create",
          "available": true,
          "notes": "Purpose: Choose commands that each contribute to a design. Later, functions will package several useful commands into one call. Students type the example and test the named line changes. Predictions record the first answer as well as the revised answer. A wrong first prediction can become a checked, correct explanation after observation. Fixed assignments must pass before the creative project opens. Discuss the saved note and ask the student to identify the command responsible for the observed result. Project checks grade the stated measurable requirements; the visual idea and quality of the design remain a teacher conversation. Ask what the student planned before typing and what they revised after running.",
          "check": {
            "rules": [
              {
                "type": "allowedCommands",
                "label": "Use only the commands in this assignment",
                "commands": [
                  "forward",
                  "backward",
                  "left",
                  "right",
                  "circle"
                ],
                "fail": "Use one command per line, with literal values. Comments are allowed. Loops and functions come later."
              },
              {
                "type": "exactTurtleCalls",
                "label": "Exactly 5 Turtle commands",
                "count": 5,
                "fail": "Check the highlighted requirement and compare your output with the target."
              },
              {
                "type": "minCalls",
                "label": "Include a visible circle",
                "commands": [
                  "circle"
                ],
                "count": 1,
                "fail": "Check the highlighted requirement and compare your output with the target."
              },
              {
                "type": "drawnMoves",
                "label": "At least 1 visible straight movement",
                "count": 1,
                "fail": "Check the highlighted requirement and compare your output with the target."
              },
              {
                "type": "minCalls",
                "label": "Use at least 1 turn",
                "commands": [
                  "left",
                  "right"
                ],
                "count": 1,
                "fail": "Check the highlighted requirement and compare your output with the target."
              },
              {
                "type": "drawingBounds",
                "label": "Keep the drawing inside the grid",
                "limit": 190,
                "fail": "A line or circle extends beyond the grid. Reduce a distance or radius, or change the route."
              }
            ]
          },
          "starter": "",
          "visuals": [
            {
              "label": "Lollipop",
              "bg": "#fbfaf6",
              "caption": "",
              "previewCode": "circle(20)\nright(90)\nforward(50)\nleft(90)\nforward(20)",
              "paths": [
                {
                  "points": [
                    [
                      80,
                      46
                    ],
                    [
                      80,
                      86
                    ],
                    [
                      96,
                      86
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                }
              ],
              "circles": [
                {
                  "cx": 80,
                  "cy": 30,
                  "r": 16,
                  "stroke": "#202525",
                  "width": 2
                }
              ]
            },
            {
              "label": "Balloon tail",
              "bg": "#fbfaf6",
              "caption": "",
              "previewCode": "circle(25)\nright(60)\nforward(45)\nleft(90)\nforward(20)",
              "paths": [
                {
                  "points": [
                    [
                      74.003,
                      54.463
                    ],
                    [
                      92.211,
                      86
                    ],
                    [
                      106.228,
                      77.907
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                }
              ],
              "circles": [
                {
                  "cx": 74.003,
                  "cy": 34.231,
                  "r": 20.231,
                  "stroke": "#202525",
                  "width": 2
                }
              ]
            },
            {
              "label": "Orbit hook",
              "bg": "#fbfaf6",
              "caption": "",
              "previewCode": "circle(25)\nforward(45)\ncircle(10)\nright(90)\nforward(30)",
              "paths": [
                {
                  "points": [
                    [
                      66.5,
                      59
                    ],
                    [
                      107,
                      59
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      107,
                      59
                    ],
                    [
                      107,
                      86
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                }
              ],
              "circles": [
                {
                  "cx": 66.5,
                  "cy": 36.5,
                  "r": 22.5,
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "cx": 107,
                  "cy": 50,
                  "r": 9,
                  "stroke": "#202525",
                  "width": 2
                }
              ]
            }
          ],
          "steps": [
            {
              "id": "1-9-create-five-lines-type-example",
              "title": "Type the example.",
              "body": "This uses five commands, but the two movements extend one straight line and the three turns draw nothing.",
              "task": "Start with an empty editor. Type the numbered commands. Run after each new movement or drawing command.",
              "phase": "Type the example",
              "example": "forward(20)\nforward(20)\nleft(90)\nleft(90)\nleft(90)",
              "numbered": true,
              "focusLines": [
                1,
                2,
                3,
                4,
                5
              ],
              "draftId": "example"
            },
            {
              "id": "1-9-create-five-lines-predict",
              "title": "Predict the visible result.",
              "body": "Commit to a prediction before checking. Then compare it with the run.",
              "task": "Choose an answer, then Check prediction & run. Watch again to follow the highlighted lines.",
              "phase": "Predict and test",
              "example": "forward(20)\nforward(20)\nleft(90)\nleft(90)\nleft(90)",
              "lab": "forward(20)\nforward(20)\nleft(90)\nleft(90)\nleft(90)",
              "numbered": true,
              "draftId": "prediction-predict",
              "question": {
                "id": "1-9-create-five-lines-predict",
                "prompt": "How many straight lines are visible?",
                "choices": [
                  "5",
                  "2",
                  "1"
                ],
                "answer": 2,
                "explanation": "The two movements join into one 40-unit straight line. The turns change direction at its endpoint without drawing."
              }
            },
            {
              "id": "1-9-create-five-lines-use-budget",
              "title": "Make the five commands do more.",
              "body": "Replacing commands keeps the budget at five. circle() can draw a complete circle in one command.",
              "task": "Replace the example with: line 1 circle(20), line 2 right(90), line 3 forward(50), line 4 left(90), line 5 forward(20). Run.",
              "phase": "Change specific lines",
              "focusLines": [
                1,
                2,
                3,
                4,
                5
              ],
              "draftId": "example"
            },
            {
              "id": "1-9-create-five-lines-resize",
              "title": "Revise the logo without adding commands.",
              "body": "A value change can revise one feature while keeping the command count.",
              "task": "On line 1 change circle(20) to circle(30) and Run. Restore circle(20), then change line 3 to forward(70) and Run. Compare the two revisions.",
              "phase": "Change specific lines",
              "focusLines": [
                1,
                3
              ],
              "draftId": "example"
            },
            {
              "id": "1-9-create-five-lines-reason",
              "title": "Predict the command budget.",
              "body": "Commit to a prediction before checking. Then compare it with the run.",
              "task": "Choose an answer, then Check prediction & run. Watch again to follow the highlighted lines.",
              "phase": "Predict and test",
              "example": "circle(20)\nright(90)\nforward(50)\nleft(90)\nforward(20)",
              "lab": "circle(20)\nright(90)\nforward(50)\nleft(90)\nforward(20)",
              "numbered": true,
              "draftId": "prediction-reason",
              "question": {
                "id": "1-9-create-five-lines-reason",
                "prompt": "Which revision keeps exactly five Turtle commands?",
                "choices": [
                  "Add another circle()",
                  "Change 50 to 70",
                  "Add color(\"red\")"
                ],
                "answer": 1,
                "explanation": "Changing an existing value keeps five commands. Adding either a drawing command or a color command uses an additional Turtle command."
              }
            },
            {
              "id": "1-9-create-five-lines-evidence",
              "title": "Record one result.",
              "body": "Your notes stay in this lesson and save as you type.",
              "task": "In the lollipop, which line controls the round part and which controls the long stem? Record one change you tested.",
              "phase": "Lesson notes",
              "draftId": "example",
              "response": {
                "id": "1-9-create-five-lines-evidence",
                "prompt": "In the lollipop, which line controls the round part and which controls the long stem? Record one change you tested.",
                "placeholder": "Round part: line ___. Stem: line ___. I changed ___ and saw ___."
              }
            },
            {
              "id": "1-9-create-five-lines-transfer",
              "title": "Required: a five-command lollipop.",
              "body": "The round part has radius 20. The stem goes down 50, then right 20.",
              "task": "Start blank. Type exactly five commands to produce the fixed result, then Run and check.",
              "phase": "Required assignment",
              "lab": "\n",
              "typed": true,
              "numbered": true,
              "draftId": "assignment-transfer",
              "check": {
                "rules": [
                  {
                    "type": "allowedCommands",
                    "label": "Use only the commands in this assignment",
                    "commands": [
                      "forward",
                      "backward",
                      "left",
                      "right",
                      "circle"
                    ],
                    "fail": "Use one command per line, with literal values. Comments are allowed. Loops and functions come later."
                  },
                  {
                    "type": "commandSequence",
                    "label": "Keep the required command order",
                    "sequence": [
                      [
                        "circle"
                      ],
                      [
                        "right"
                      ],
                      [
                        "forward"
                      ],
                      [
                        "left"
                      ],
                      [
                        "forward"
                      ]
                    ],
                    "fail": "Read the command names from top to bottom and keep the required order."
                  },
                  {
                    "type": "literalNumbers",
                    "label": "Round part radius 20",
                    "commands": [
                      "circle"
                    ],
                    "values": [
                      20
                    ],
                    "prefix": false,
                    "fail": "Keep the required distances, radii, or angles. Compare the values in your code with the assignment."
                  },
                  {
                    "type": "literalNumbers",
                    "label": "Stem: down 50, right 20",
                    "commands": [
                      "forward"
                    ],
                    "values": [
                      50,
                      20
                    ],
                    "prefix": false,
                    "fail": "Keep the required distances, radii, or angles. Compare the values in your code with the assignment."
                  },
                  {
                    "type": "literalNumbers",
                    "label": "Two 90° turns",
                    "commands": [
                      "right",
                      "left"
                    ],
                    "values": [
                      90,
                      90
                    ],
                    "prefix": false,
                    "fail": "Keep the required distances, radii, or angles. Compare the values in your code with the assignment."
                  },
                  {
                    "type": "finalPosition",
                    "label": "Finish at (20, -50)",
                    "x": 20,
                    "y": -50,
                    "tolerance": 1,
                    "fail": "Follow each movement from the start. The turtle has not reached the marked target."
                  },
                  {
                    "type": "finalHeading",
                    "label": "Finish facing right",
                    "heading": 0,
                    "tolerance": 1,
                    "fail": "The position and the direction are separate. Check the last turn."
                  }
                ]
              },
              "requirements": [
                "Exactly 5 commands.",
                "One radius-20 circle at the starting point.",
                "Move down 50, then right 20; finish facing right."
              ],
              "tip": "Draw the circle first. Turn before each stem movement.",
              "visuals": [
                {
                  "label": "Required lollipop",
                  "bg": "#fbfaf6",
                  "caption": "Radius 20; stem down 50, right 20.",
                  "previewCode": "circle(20)\nright(90)\nforward(50)\nleft(90)\nforward(20)",
                  "paths": [
                    {
                      "points": [
                        [
                          80,
                          46
                        ],
                        [
                          80,
                          86
                        ],
                        [
                          96,
                          86
                        ]
                      ],
                      "stroke": "#202525",
                      "width": 2
                    }
                  ],
                  "circles": [
                    {
                      "cx": 80,
                      "cy": 30,
                      "r": 16,
                      "stroke": "#202525",
                      "width": 2
                    }
                  ]
                }
              ],
              "visualsTitle": "Required result"
            },
            {
              "id": "1-9-create-five-lines-choice",
              "title": "Create a five-command logo.",
              "body": "Make a lollipop variant, a balloon tail, an orbit hook, or your own symbol. Choose the sizes and angles.",
              "task": "Start blank. Make each of your five commands contribute to the result, then Run and check.",
              "phase": "Create your own",
              "draftId": "project",
              "lab": "\n",
              "typed": true,
              "requirements": [
                "Exactly 5 Turtle commands.",
                "At least 1 circle and 1 visible straight movement.",
                "At least 1 nonzero turn.",
                "Keep the design inside the grid."
              ],
              "tip": "Try replacing one command instead of adding a sixth. A full circle returns to its starting point and direction.",
              "visuals": [
                {
                  "label": "Lollipop",
                  "bg": "#fbfaf6",
                  "caption": "",
                  "previewCode": "circle(20)\nright(90)\nforward(50)\nleft(90)\nforward(20)",
                  "paths": [
                    {
                      "points": [
                        [
                          80,
                          46
                        ],
                        [
                          80,
                          86
                        ],
                        [
                          96,
                          86
                        ]
                      ],
                      "stroke": "#202525",
                      "width": 2
                    }
                  ],
                  "circles": [
                    {
                      "cx": 80,
                      "cy": 30,
                      "r": 16,
                      "stroke": "#202525",
                      "width": 2
                    }
                  ]
                },
                {
                  "label": "Balloon tail",
                  "bg": "#fbfaf6",
                  "caption": "",
                  "previewCode": "circle(25)\nright(60)\nforward(45)\nleft(90)\nforward(20)",
                  "paths": [
                    {
                      "points": [
                        [
                          74.003,
                          54.463
                        ],
                        [
                          92.211,
                          86
                        ],
                        [
                          106.228,
                          77.907
                        ]
                      ],
                      "stroke": "#202525",
                      "width": 2
                    }
                  ],
                  "circles": [
                    {
                      "cx": 74.003,
                      "cy": 34.231,
                      "r": 20.231,
                      "stroke": "#202525",
                      "width": 2
                    }
                  ]
                },
                {
                  "label": "Orbit hook",
                  "bg": "#fbfaf6",
                  "caption": "",
                  "previewCode": "circle(25)\nforward(45)\ncircle(10)\nright(90)\nforward(30)",
                  "paths": [
                    {
                      "points": [
                        [
                          66.5,
                          59
                        ],
                        [
                          107,
                          59
                        ]
                      ],
                      "stroke": "#202525",
                      "width": 2
                    },
                    {
                      "points": [
                        [
                          107,
                          59
                        ],
                        [
                          107,
                          86
                        ]
                      ],
                      "stroke": "#202525",
                      "width": 2
                    }
                  ],
                  "circles": [
                    {
                      "cx": 66.5,
                      "cy": 36.5,
                      "r": 22.5,
                      "stroke": "#202525",
                      "width": 2
                    },
                    {
                      "cx": 107,
                      "cy": 50,
                      "r": 9,
                      "stroke": "#202525",
                      "width": 2
                    }
                  ]
                }
              ]
            }
          ],
          "group": "Sequence + Debugging",
          "objective": "Designing within a command budget",
          "purpose": "Choose commands that each contribute to a design. Later, functions will package several useful commands into one call.",
          "draftVersion": "unit1-v4",
          "contentVersion": "unit1-v4"
        },
        {
          "id": "1-10-make-color",
          "number": "1.10",
          "title": "Make a Neon Lightning Bolt",
          "type": "Make",
          "available": true,
          "notes": "Purpose: Set drawing state before the stroke it should affect. Later, reusable shapes can receive color and width as parameters. Students type the example and test the named line changes. Predictions record the first answer as well as the revised answer. A wrong first prediction can become a checked, correct explanation after observation. Fixed assignments must pass before the creative project opens. Discuss the saved note and ask the student to identify the command responsible for the observed result. Project checks grade the stated measurable requirements; the visual idea and quality of the design remain a teacher conversation. Ask the student to change one value and predict which visible property it controls.",
          "check": {
            "rules": [
              {
                "type": "allowedCommands",
                "label": "Use only the commands in this assignment",
                "commands": [
                  "forward",
                  "backward",
                  "left",
                  "right",
                  "circle",
                  "color",
                  "bgcolor",
                  "pensize"
                ],
                "fail": "Use one command per line, with literal values. Comments are allowed. Loops and functions come later."
              },
              {
                "type": "backgroundColor",
                "label": "Black background",
                "value": "black",
                "fail": "Use bgcolor(\"black\") and keep the drawing visible against it."
              },
              {
                "type": "drawingStyle",
                "label": "3+ visible drawing colors; every stroke width 4+",
                "colors": 3,
                "width": 4,
                "contrast": true,
                "distinctWidths": 2,
                "fail": "Set each color and width before drawing. Unused color changes do not count. All strokes must contrast with the background."
              },
              {
                "type": "drawnMoves",
                "label": "4+ visible straight movements",
                "count": 4,
                "fail": "Check the highlighted requirement and compare your output with the target."
              },
              {
                "type": "minCalls",
                "label": "2+ turns",
                "commands": [
                  "left",
                  "right"
                ],
                "count": 2,
                "fail": "Check the highlighted requirement and compare your output with the target."
              },
              {
                "type": "drawingBounds",
                "label": "Keep the drawing inside the grid",
                "limit": 190,
                "fail": "A line or circle extends beyond the grid. Reduce a distance or radius, or change the route."
              }
            ]
          },
          "starter": "",
          "visuals": [
            {
              "label": "Pixel bolt",
              "bg": "black",
              "caption": "",
              "previewCode": "bgcolor(\"black\")\ncolor(\"cyan\")\npensize(6)\nforward(60)\nright(135)\ncolor(\"yellow\")\nforward(30)\nleft(135)\ncolor(\"magenta\")\npensize(10)\nforward(60)\nright(135)\nforward(25)",
              "paths": [
                {
                  "points": [
                    [
                      14,
                      24.017
                    ],
                    [
                      94.173,
                      24.017
                    ]
                  ],
                  "stroke": "cyan",
                  "width": 5
                },
                {
                  "points": [
                    [
                      94.173,
                      24.017
                    ],
                    [
                      65.827,
                      52.362
                    ]
                  ],
                  "stroke": "yellow",
                  "width": 5
                },
                {
                  "points": [
                    [
                      65.827,
                      52.362
                    ],
                    [
                      146,
                      52.362
                    ],
                    [
                      122.379,
                      75.983
                    ]
                  ],
                  "stroke": "magenta",
                  "width": 5
                }
              ],
              "circles": []
            },
            {
              "label": "Neon pulse",
              "bg": "black",
              "caption": "",
              "previewCode": "bgcolor(\"black\")\ncolor(\"cyan\")\npensize(6)\nforward(25)\nleft(60)\ncolor(\"yellow\")\nforward(30)\nright(120)\ncolor(\"magenta\")\npensize(10)\nforward(45)\nleft(120)\nforward(20)\nright(60)\nforward(25)",
              "paths": [
                {
                  "points": [
                    [
                      14,
                      58.793
                    ],
                    [
                      47.846,
                      58.793
                    ]
                  ],
                  "stroke": "cyan",
                  "width": 5
                },
                {
                  "points": [
                    [
                      47.846,
                      58.793
                    ],
                    [
                      68.154,
                      23.62
                    ]
                  ],
                  "stroke": "yellow",
                  "width": 5
                },
                {
                  "points": [
                    [
                      68.154,
                      23.62
                    ],
                    [
                      98.615,
                      76.38
                    ],
                    [
                      112.154,
                      52.931
                    ],
                    [
                      146,
                      52.931
                    ]
                  ],
                  "stroke": "magenta",
                  "width": 5
                }
              ],
              "circles": []
            },
            {
              "label": "Arcade stairs",
              "bg": "black",
              "caption": "",
              "previewCode": "bgcolor(\"black\")\ncolor(\"cyan\")\npensize(6)\nforward(35)\nleft(90)\ncolor(\"yellow\")\nforward(25)\nright(90)\ncolor(\"magenta\")\npensize(10)\nforward(40)\nleft(90)\nforward(30)",
              "paths": [
                {
                  "points": [
                    [
                      30.909,
                      86
                    ],
                    [
                      76.727,
                      86
                    ]
                  ],
                  "stroke": "cyan",
                  "width": 5
                },
                {
                  "points": [
                    [
                      76.727,
                      86
                    ],
                    [
                      76.727,
                      53.273
                    ]
                  ],
                  "stroke": "yellow",
                  "width": 5
                },
                {
                  "points": [
                    [
                      76.727,
                      53.273
                    ],
                    [
                      129.091,
                      53.273
                    ],
                    [
                      129.091,
                      14
                    ]
                  ],
                  "stroke": "magenta",
                  "width": 5
                }
              ],
              "circles": []
            }
          ],
          "steps": [
            {
              "id": "1-10-make-color-type-example",
              "title": "Type the example.",
              "body": "bgcolor() sets the background. color() sets future drawing color. pensize() sets future stroke width. Color names are strings, so keep their quotes.",
              "task": "Start with an empty editor. Type the numbered commands. Run after each new movement or drawing command.",
              "phase": "Type the example",
              "example": "bgcolor(\"black\")\ncolor(\"cyan\")\npensize(6)\nforward(50)",
              "numbered": true,
              "focusLines": [
                1,
                2,
                3,
                4
              ],
              "draftId": "example"
            },
            {
              "id": "1-10-make-color-second-color",
              "title": "Add the next color before drawing.",
              "body": "Changing the pen color affects later strokes.",
              "task": "Add right(135) on line 5, color(\"yellow\") on line 6, and forward(30) on line 7. Run. The first stroke should stay cyan.",
              "phase": "Change specific lines",
              "focusLines": [
                5,
                6,
                7
              ],
              "draftId": "example"
            },
            {
              "id": "1-10-make-color-predict",
              "title": "Predict an unused color change.",
              "body": "Commit to a prediction before checking. Then compare it with the run.",
              "task": "Choose an answer, then Check prediction & run. Watch again to follow the highlighted lines.",
              "phase": "Predict and test",
              "example": "color(\"cyan\")\nforward(40)\ncolor(\"yellow\")",
              "lab": "color(\"cyan\")\nforward(40)\ncolor(\"yellow\")",
              "numbered": true,
              "draftId": "prediction-predict",
              "question": {
                "id": "1-10-make-color-predict",
                "prompt": "What color is the line already drawn?",
                "choices": [
                  "Yellow",
                  "Cyan",
                  "A mixture"
                ],
                "answer": 1,
                "explanation": "The line executes while the pen is cyan. The later color change prepares future drawing; it does not repaint the earlier stroke."
              }
            },
            {
              "id": "1-10-make-color-third-stroke",
              "title": "Add a wider third stroke.",
              "body": "Width persists until another pensize() changes it.",
              "task": "Add left(135) on line 8, pensize(10) on line 9, color(\"magenta\") on line 10, and forward(50) on line 11. Run.",
              "phase": "Change specific lines",
              "focusLines": [
                8,
                9,
                10,
                11
              ],
              "draftId": "example"
            },
            {
              "id": "1-10-make-color-reason",
              "title": "Predict width independently of length.",
              "body": "Commit to a prediction before checking. Then compare it with the run.",
              "task": "Choose an answer, then Check prediction & run. Watch again to follow the highlighted lines.",
              "phase": "Predict and test",
              "example": "pensize(10)\nforward(30)\npensize(2)\nforward(30)",
              "lab": "pensize(10)\nforward(30)\npensize(2)\nforward(30)",
              "numbered": true,
              "draftId": "prediction-reason",
              "question": {
                "id": "1-10-make-color-reason",
                "prompt": "What changes in the second stroke?",
                "choices": [
                  "Its length",
                  "Its thickness",
                  "Its direction"
                ],
                "answer": 1,
                "explanation": "Both movements use 30 and the same direction. Only the pen width changes, from 10 to 2."
              }
            },
            {
              "id": "1-10-make-color-evidence",
              "title": "Record one result.",
              "body": "Your notes stay in this lesson and save as you type.",
              "task": "Which color command affects the second stroke of your bolt? Which pensize() affects the third? Record their line numbers.",
              "phase": "Lesson notes",
              "draftId": "example",
              "response": {
                "id": "1-10-make-color-evidence",
                "prompt": "Which color command affects the second stroke of your bolt? Which pensize() affects the third? Record their line numbers.",
                "placeholder": "Second color: line ___ before movement line ___. Third width: line ___ before movement line ___."
              }
            },
            {
              "id": "1-10-make-color-transfer",
              "title": "Required: two different visible strokes.",
              "body": "Both strokes are 40 units long on black. The first must be cyan and width 6; the second yellow and width 10.",
              "task": "Type the starting program. Repair the widths and add the second width change before the second movement. Run and check.",
              "phase": "Required assignment",
              "lab": "bgcolor(\"black\")\ncolor(\"cyan\")\npensize(2)\nforward(40)\ncolor(\"yellow\")\nforward(40)",
              "typed": true,
              "numbered": true,
              "example": "bgcolor(\"black\")\ncolor(\"cyan\")\npensize(2)\nforward(40)\ncolor(\"yellow\")\nforward(40)",
              "draftId": "assignment-transfer",
              "check": {
                "rules": [
                  {
                    "type": "allowedCommands",
                    "label": "Use only the commands in this assignment",
                    "commands": [
                      "forward",
                      "backward",
                      "left",
                      "right",
                      "circle",
                      "color",
                      "bgcolor",
                      "pensize"
                    ],
                    "fail": "Use one command per line, with literal values. Comments are allowed. Loops and functions come later."
                  },
                  {
                    "type": "backgroundColor",
                    "label": "Black background",
                    "value": "black",
                    "fail": "Use bgcolor(\"black\") and keep the drawing visible against it."
                  },
                  {
                    "type": "literalNumbers",
                    "label": "Keep both 40-unit strokes",
                    "commands": [
                      "forward"
                    ],
                    "values": [
                      40,
                      40
                    ],
                    "prefix": false,
                    "fail": "Keep the required distances, radii, or angles. Compare the values in your code with the assignment."
                  },
                  {
                    "type": "strokeStyles",
                    "label": "Cyan width 6, then yellow width 10",
                    "strokes": [
                      {
                        "color": "cyan",
                        "width": 6
                      },
                      {
                        "color": "yellow",
                        "width": 10
                      }
                    ],
                    "fail": "Check the highlighted requirement and compare your output with the target."
                  },
                  {
                    "type": "finalPosition",
                    "label": "Finish at (80, 0)",
                    "x": 80,
                    "y": 0,
                    "tolerance": 1,
                    "fail": "Follow each movement from the start. The turtle has not reached the marked target."
                  },
                  {
                    "type": "drawingStyle",
                    "label": "2+ visible drawing colors; every stroke width 6+",
                    "colors": 2,
                    "width": 6,
                    "contrast": true,
                    "increasingWidth": true,
                    "fail": "Set each color and width before drawing. Unused color changes do not count. All strokes must contrast with the background."
                  }
                ]
              },
              "requirements": [
                "Black background; exactly 2 straight strokes of length 40.",
                "First stroke: cyan, width 6.",
                "Second stroke: yellow, width 10."
              ],
              "tip": "Set the width before the movement that should use it. The two movements can meet along one line.",
              "focusLines": [
                3,
                4,
                5,
                6
              ],
              "visuals": [
                {
                  "label": "Required styled strokes",
                  "bg": "black",
                  "caption": "Cyan 6 → yellow 10. Both lengths 40.",
                  "previewCode": "bgcolor(\"black\")\ncolor(\"cyan\")\npensize(6)\nforward(40)\ncolor(\"yellow\")\npensize(10)\nforward(40)",
                  "paths": [
                    {
                      "points": [
                        [
                          14,
                          50
                        ],
                        [
                          80,
                          50
                        ]
                      ],
                      "stroke": "cyan",
                      "width": 5
                    },
                    {
                      "points": [
                        [
                          80,
                          50
                        ],
                        [
                          146,
                          50
                        ]
                      ],
                      "stroke": "yellow",
                      "width": 5
                    }
                  ],
                  "circles": []
                }
              ],
              "visualsTitle": "Required result"
            },
            {
              "id": "1-10-make-color-choice",
              "title": "Create a neon signal.",
              "body": "Build a lightning bolt, a heart-monitor pulse, arcade stairs, or your own icon. Use style changes to distinguish its parts.",
              "task": "Start blank. Choose the geometry, then set each style before its drawing command. Run and check.",
              "phase": "Create your own",
              "draftId": "project",
              "lab": "\n",
              "typed": true,
              "requirements": [
                "Black background.",
                "At least 3 colors used on visible strokes.",
                "At least 2 widths used on strokes; every stroke width 4 or more.",
                "At least 4 visible movements and 2 turns; stay inside the grid."
              ],
              "tip": "An unused color() or pensize() does not change the drawing. Put a drawing command after each style you want to use.",
              "visuals": [
                {
                  "label": "Pixel bolt",
                  "bg": "black",
                  "caption": "",
                  "previewCode": "bgcolor(\"black\")\ncolor(\"cyan\")\npensize(6)\nforward(60)\nright(135)\ncolor(\"yellow\")\nforward(30)\nleft(135)\ncolor(\"magenta\")\npensize(10)\nforward(60)\nright(135)\nforward(25)",
                  "paths": [
                    {
                      "points": [
                        [
                          14,
                          24.017
                        ],
                        [
                          94.173,
                          24.017
                        ]
                      ],
                      "stroke": "cyan",
                      "width": 5
                    },
                    {
                      "points": [
                        [
                          94.173,
                          24.017
                        ],
                        [
                          65.827,
                          52.362
                        ]
                      ],
                      "stroke": "yellow",
                      "width": 5
                    },
                    {
                      "points": [
                        [
                          65.827,
                          52.362
                        ],
                        [
                          146,
                          52.362
                        ],
                        [
                          122.379,
                          75.983
                        ]
                      ],
                      "stroke": "magenta",
                      "width": 5
                    }
                  ],
                  "circles": []
                },
                {
                  "label": "Neon pulse",
                  "bg": "black",
                  "caption": "",
                  "previewCode": "bgcolor(\"black\")\ncolor(\"cyan\")\npensize(6)\nforward(25)\nleft(60)\ncolor(\"yellow\")\nforward(30)\nright(120)\ncolor(\"magenta\")\npensize(10)\nforward(45)\nleft(120)\nforward(20)\nright(60)\nforward(25)",
                  "paths": [
                    {
                      "points": [
                        [
                          14,
                          58.793
                        ],
                        [
                          47.846,
                          58.793
                        ]
                      ],
                      "stroke": "cyan",
                      "width": 5
                    },
                    {
                      "points": [
                        [
                          47.846,
                          58.793
                        ],
                        [
                          68.154,
                          23.62
                        ]
                      ],
                      "stroke": "yellow",
                      "width": 5
                    },
                    {
                      "points": [
                        [
                          68.154,
                          23.62
                        ],
                        [
                          98.615,
                          76.38
                        ],
                        [
                          112.154,
                          52.931
                        ],
                        [
                          146,
                          52.931
                        ]
                      ],
                      "stroke": "magenta",
                      "width": 5
                    }
                  ],
                  "circles": []
                },
                {
                  "label": "Arcade stairs",
                  "bg": "black",
                  "caption": "",
                  "previewCode": "bgcolor(\"black\")\ncolor(\"cyan\")\npensize(6)\nforward(35)\nleft(90)\ncolor(\"yellow\")\nforward(25)\nright(90)\ncolor(\"magenta\")\npensize(10)\nforward(40)\nleft(90)\nforward(30)",
                  "paths": [
                    {
                      "points": [
                        [
                          30.909,
                          86
                        ],
                        [
                          76.727,
                          86
                        ]
                      ],
                      "stroke": "cyan",
                      "width": 5
                    },
                    {
                      "points": [
                        [
                          76.727,
                          86
                        ],
                        [
                          76.727,
                          53.273
                        ]
                      ],
                      "stroke": "yellow",
                      "width": 5
                    },
                    {
                      "points": [
                        [
                          76.727,
                          53.273
                        ],
                        [
                          129.091,
                          53.273
                        ],
                        [
                          129.091,
                          14
                        ]
                      ],
                      "stroke": "magenta",
                      "width": 5
                    }
                  ],
                  "circles": []
                }
              ]
            }
          ],
          "group": "Color + Style",
          "objective": "Color, background, and line width",
          "purpose": "Set drawing state before the stroke it should affect. Later, reusable shapes can receive color and width as parameters.",
          "draftVersion": "unit1-v4",
          "contentVersion": "unit1-v4"
        },
        {
          "id": "1-11-solve-style",
          "number": "1.11",
          "title": "Repair the Neon Sign",
          "type": "Solve",
          "available": true,
          "notes": "Purpose: Repair appearance while preserving geometry. This separates what a program draws from how it draws it. Students type the example and test the named line changes. Predictions record the first answer as well as the revised answer. A wrong first prediction can become a checked, correct explanation after observation. Fixed assignments must pass before the creative project opens. Discuss the saved note and ask the student to identify the command responsible for the observed result. Project checks grade the stated measurable requirements; the visual idea and quality of the design remain a teacher conversation. Ask which line first differs from the intended result before offering a hint.",
          "check": {
            "rules": [
              {
                "type": "allowedCommands",
                "label": "Use only the commands in this assignment",
                "commands": [
                  "forward",
                  "backward",
                  "left",
                  "right",
                  "color",
                  "bgcolor",
                  "pensize"
                ],
                "fail": "Use one command per line, with literal values. Comments are allowed. Loops and functions come later."
              },
              {
                "type": "backgroundColor",
                "label": "Black background",
                "value": "black",
                "fail": "Use bgcolor(\"black\") and keep the drawing visible against it."
              },
              {
                "type": "closedOutline",
                "label": "Closed outline with space inside",
                "minArea": 100,
                "fail": "Return to the start around an area. Moving out and back on one line does not enclose a shape."
              },
              {
                "type": "finalPosition",
                "label": "Finish at (0, 0)",
                "x": 0,
                "y": 0,
                "tolerance": 1,
                "fail": "Follow each movement from the start. The turtle has not reached the marked target."
              },
              {
                "type": "drawingStyle",
                "label": "2+ visible drawing colors; every stroke width 4+",
                "colors": 2,
                "width": 4,
                "contrast": true,
                "distinctWidths": 2,
                "fail": "Set each color and width before drawing. Unused color changes do not count. All strokes must contrast with the background."
              },
              {
                "type": "drawingBounds",
                "label": "Keep the drawing inside the grid",
                "limit": 190,
                "fail": "A line or circle extends beyond the grid. Reduce a distance or radius, or change the route."
              }
            ]
          },
          "starter": "",
          "steps": [
            {
              "id": "1-11-solve-style-type-example",
              "title": "Type the example.",
              "body": "The program runs, but the first stroke matches the background and the last has very low contrast. The route itself is already correct.",
              "task": "Start with an empty editor. Type the numbered commands. Run after each new movement or drawing command.",
              "phase": "Type the example",
              "example": "bgcolor(\"black\")\ncolor(\"black\")\npensize(2)\nforward(60)\nleft(90)\ncolor(\"cyan\")\nforward(30)\nright(90)\ncolor(\"navy\")\nforward(40)",
              "numbered": true,
              "focusLines": [
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10
              ],
              "draftId": "example"
            },
            {
              "id": "1-11-solve-style-predict",
              "title": "Predict the invisible first stroke.",
              "body": "Commit to a prediction before checking. Then compare it with the run.",
              "task": "Choose an answer, then Check prediction & run. Watch again to follow the highlighted lines.",
              "phase": "Predict and test",
              "example": "bgcolor(\"black\")\ncolor(\"black\")\nforward(40)",
              "lab": "bgcolor(\"black\")\ncolor(\"black\")\nforward(40)",
              "numbered": true,
              "draftId": "prediction-predict",
              "question": {
                "id": "1-11-solve-style-predict",
                "prompt": "Why can the successful run look empty?",
                "choices": [
                  "The stroke matches the background",
                  "forward() cannot draw on black",
                  "A turn is required"
                ],
                "answer": 0,
                "explanation": "The turtle moves and draws, but a black stroke blends into a black background. A successful run does not confirm the appearance."
              }
            },
            {
              "id": "1-11-solve-style-first-stroke",
              "title": "Repair the first stroke.",
              "body": "Keep the movements and turns; change only appearance.",
              "task": "On line 2 use color(\"yellow\"). On line 3 use pensize(6). Run. Check that the route still finishes at the same point.",
              "phase": "Change specific lines",
              "focusLines": [
                2,
                3
              ],
              "draftId": "example"
            },
            {
              "id": "1-11-solve-style-last-stroke",
              "title": "Repair the final stroke’s contrast.",
              "body": "A dark color can still be hard to see even when it differs from black.",
              "task": "On line 9 replace color(\"navy\") with color(\"magenta\"). Run. Keep every movement distance and turn unchanged.",
              "phase": "Change specific lines",
              "focusLines": [
                9
              ],
              "draftId": "example"
            },
            {
              "id": "1-11-solve-style-reason",
              "title": "Predict where a style belongs.",
              "body": "Commit to a prediction before checking. Then compare it with the run.",
              "task": "Choose an answer, then Check prediction & run. Watch again to follow the highlighted lines.",
              "phase": "Predict and test",
              "example": "forward(40)\ncolor(\"red\")",
              "lab": "forward(40)\ncolor(\"red\")",
              "numbered": true,
              "draftId": "prediction-reason",
              "question": {
                "id": "1-11-solve-style-reason",
                "prompt": "To make the existing line red, where must the color command move?",
                "choices": [
                  "Before forward(40)",
                  "After another turn",
                  "To the end"
                ],
                "answer": 0,
                "explanation": "The pen needs the intended color when the drawing command executes. Put color(\"red\") before forward(40)."
              }
            },
            {
              "id": "1-11-solve-style-evidence",
              "title": "Record one result.",
              "body": "Your notes stay in this lesson and save as you type.",
              "task": "Record one style-only repair and one distance or angle you kept unchanged. What did you compare in the two runs?",
              "phase": "Lesson notes",
              "draftId": "example",
              "response": {
                "id": "1-11-solve-style-evidence",
                "prompt": "Record one style-only repair and one distance or angle you kept unchanged. What did you compare in the two runs?",
                "placeholder": "I changed ___ on line ___. I kept ___ on line ___. The route stayed ___ while the stroke became ___."
              }
            },
            {
              "id": "1-11-solve-style-transfer",
              "title": "Required: preserve the route, repair its style.",
              "body": "The route is 40 right, then 30 up. Make the first stroke yellow width 6 and the second cyan width 10.",
              "task": "Type the program. Change or insert style commands only. Preserve the two movements and left(90). Run and check.",
              "phase": "Required assignment",
              "lab": "bgcolor(\"black\")\ncolor(\"black\")\npensize(2)\nforward(40)\nleft(90)\ncolor(\"cyan\")\nforward(30)",
              "typed": true,
              "numbered": true,
              "example": "bgcolor(\"black\")\ncolor(\"black\")\npensize(2)\nforward(40)\nleft(90)\ncolor(\"cyan\")\nforward(30)",
              "draftId": "assignment-transfer",
              "check": {
                "rules": [
                  {
                    "type": "allowedCommands",
                    "label": "Use only the commands in this assignment",
                    "commands": [
                      "forward",
                      "backward",
                      "left",
                      "right",
                      "color",
                      "bgcolor",
                      "pensize"
                    ],
                    "fail": "Use one command per line, with literal values. Comments are allowed. Loops and functions come later."
                  },
                  {
                    "type": "backgroundColor",
                    "label": "Black background",
                    "value": "black",
                    "fail": "Use bgcolor(\"black\") and keep the drawing visible against it."
                  },
                  {
                    "type": "literalNumbers",
                    "label": "Preserve distances 40 and 30",
                    "commands": [
                      "forward"
                    ],
                    "values": [
                      40,
                      30
                    ],
                    "prefix": false,
                    "fail": "Keep the required distances, radii, or angles. Compare the values in your code with the assignment."
                  },
                  {
                    "type": "literalNumbers",
                    "label": "Preserve left(90)",
                    "commands": [
                      "left"
                    ],
                    "values": [
                      90
                    ],
                    "prefix": false,
                    "fail": "Keep the required distances, radii, or angles. Compare the values in your code with the assignment."
                  },
                  {
                    "type": "exactCalls",
                    "label": "No extra route commands",
                    "commands": [
                      "right",
                      "backward"
                    ],
                    "count": 0,
                    "fail": "Count these commands. The assignment requires exactly this many."
                  },
                  {
                    "type": "strokeStyles",
                    "label": "Yellow width 6, then cyan width 10",
                    "strokes": [
                      {
                        "color": "yellow",
                        "width": 6
                      },
                      {
                        "color": "cyan",
                        "width": 10
                      }
                    ],
                    "fail": "Check the highlighted requirement and compare your output with the target."
                  },
                  {
                    "type": "finalPosition",
                    "label": "Finish at (40, 30)",
                    "x": 40,
                    "y": 30,
                    "tolerance": 1,
                    "fail": "Follow each movement from the start. The turtle has not reached the marked target."
                  },
                  {
                    "type": "finalHeading",
                    "label": "Finish facing up",
                    "heading": 90,
                    "tolerance": 1,
                    "fail": "The position and the direction are separate. Check the last turn."
                  }
                ]
              },
              "requirements": [
                "Preserve the 40-right, 30-up route and its 90° turn.",
                "First stroke yellow width 6; second cyan width 10.",
                "Black background; no extra movements or turns."
              ],
              "tip": "The style commands may move or be added. The geometry commands must keep their values and order.",
              "focusLines": [
                2,
                3,
                4,
                6,
                7
              ],
              "visuals": [
                {
                  "label": "Required repaired corner",
                  "bg": "black",
                  "caption": "Same route; visible colors and different widths.",
                  "previewCode": "bgcolor(\"black\")\ncolor(\"yellow\")\npensize(6)\nforward(40)\nleft(90)\ncolor(\"cyan\")\npensize(10)\nforward(30)",
                  "paths": [
                    {
                      "points": [
                        [
                          32,
                          86
                        ],
                        [
                          128,
                          86
                        ]
                      ],
                      "stroke": "yellow",
                      "width": 5
                    },
                    {
                      "points": [
                        [
                          128,
                          86
                        ],
                        [
                          128,
                          14
                        ]
                      ],
                      "stroke": "cyan",
                      "width": 5
                    }
                  ],
                  "circles": []
                }
              ],
              "visualsTitle": "Required result"
            },
            {
              "id": "1-11-solve-style-choice",
              "title": "Create a neon frame.",
              "body": "Design a game chip, a shield, a doorway, or another closed sign. Use a second style to make one section stand out.",
              "task": "Start blank. Close the frame around an area, then Run and check.",
              "phase": "Create your own",
              "draftId": "project",
              "lab": "\n",
              "typed": true,
              "requirements": [
                "Black background and a closed outline with space inside.",
                "Return to (0, 0).",
                "At least 2 visible stroke colors and 2 used widths.",
                "Every stroke width 4 or more; keep the frame inside the grid."
              ],
              "tip": "Build the geometry first, then add styles before selected sides. Keep comparing the same outline.",
              "visuals": [
                {
                  "label": "Neon game chip",
                  "bg": "black",
                  "caption": "",
                  "previewCode": "bgcolor(\"black\")\ncolor(\"cyan\")\npensize(6)\nforward(80)\nleft(90)\nforward(50)\nleft(90)\ncolor(\"yellow\")\npensize(10)\nforward(80)\nleft(90)\nforward(50)\nleft(90)",
                  "paths": [
                    {
                      "points": [
                        [
                          22.4,
                          86
                        ],
                        [
                          137.6,
                          86
                        ],
                        [
                          137.6,
                          14
                        ]
                      ],
                      "stroke": "cyan",
                      "width": 5
                    },
                    {
                      "points": [
                        [
                          137.6,
                          14
                        ],
                        [
                          22.4,
                          14
                        ],
                        [
                          22.4,
                          86
                        ]
                      ],
                      "stroke": "yellow",
                      "width": 5
                    }
                  ],
                  "circles": []
                },
                {
                  "label": "Scanner shield",
                  "bg": "black",
                  "caption": "",
                  "previewCode": "bgcolor(\"black\")\ncolor(\"cyan\")\npensize(6)\nforward(60)\nleft(90)\nforward(40)\nleft(45)\ncolor(\"magenta\")\npensize(10)\nforward(42.4264)\nleft(90)\nforward(42.4264)\nleft(45)\nforward(40)\nleft(90)",
                  "paths": [
                    {
                      "points": [
                        [
                          49.143,
                          86
                        ],
                        [
                          110.857,
                          86
                        ],
                        [
                          110.857,
                          44.857
                        ]
                      ],
                      "stroke": "cyan",
                      "width": 5
                    },
                    {
                      "points": [
                        [
                          110.857,
                          44.857
                        ],
                        [
                          80,
                          14
                        ],
                        [
                          49.143,
                          44.857
                        ],
                        [
                          49.143,
                          86
                        ]
                      ],
                      "stroke": "magenta",
                      "width": 5
                    }
                  ],
                  "circles": []
                },
                {
                  "label": "Pixel doorway",
                  "bg": "black",
                  "caption": "",
                  "previewCode": "bgcolor(\"black\")\ncolor(\"yellow\")\npensize(6)\nforward(70)\nleft(90)\nforward(70)\nleft(90)\ncolor(\"cyan\")\npensize(10)\nforward(70)\nleft(90)\nforward(70)\nleft(90)",
                  "paths": [
                    {
                      "points": [
                        [
                          44,
                          86
                        ],
                        [
                          116,
                          86
                        ],
                        [
                          116,
                          14
                        ]
                      ],
                      "stroke": "yellow",
                      "width": 5
                    },
                    {
                      "points": [
                        [
                          116,
                          14
                        ],
                        [
                          44,
                          14
                        ],
                        [
                          44,
                          86
                        ]
                      ],
                      "stroke": "cyan",
                      "width": 5
                    }
                  ],
                  "circles": []
                }
              ]
            }
          ],
          "group": "Color + Style",
          "visuals": [
            {
              "label": "Neon game chip",
              "bg": "black",
              "caption": "",
              "previewCode": "bgcolor(\"black\")\ncolor(\"cyan\")\npensize(6)\nforward(80)\nleft(90)\nforward(50)\nleft(90)\ncolor(\"yellow\")\npensize(10)\nforward(80)\nleft(90)\nforward(50)\nleft(90)",
              "paths": [
                {
                  "points": [
                    [
                      22.4,
                      86
                    ],
                    [
                      137.6,
                      86
                    ],
                    [
                      137.6,
                      14
                    ]
                  ],
                  "stroke": "cyan",
                  "width": 5
                },
                {
                  "points": [
                    [
                      137.6,
                      14
                    ],
                    [
                      22.4,
                      14
                    ],
                    [
                      22.4,
                      86
                    ]
                  ],
                  "stroke": "yellow",
                  "width": 5
                }
              ],
              "circles": []
            },
            {
              "label": "Scanner shield",
              "bg": "black",
              "caption": "",
              "previewCode": "bgcolor(\"black\")\ncolor(\"cyan\")\npensize(6)\nforward(60)\nleft(90)\nforward(40)\nleft(45)\ncolor(\"magenta\")\npensize(10)\nforward(42.4264)\nleft(90)\nforward(42.4264)\nleft(45)\nforward(40)\nleft(90)",
              "paths": [
                {
                  "points": [
                    [
                      49.143,
                      86
                    ],
                    [
                      110.857,
                      86
                    ],
                    [
                      110.857,
                      44.857
                    ]
                  ],
                  "stroke": "cyan",
                  "width": 5
                },
                {
                  "points": [
                    [
                      110.857,
                      44.857
                    ],
                    [
                      80,
                      14
                    ],
                    [
                      49.143,
                      44.857
                    ],
                    [
                      49.143,
                      86
                    ]
                  ],
                  "stroke": "magenta",
                  "width": 5
                }
              ],
              "circles": []
            },
            {
              "label": "Pixel doorway",
              "bg": "black",
              "caption": "",
              "previewCode": "bgcolor(\"black\")\ncolor(\"yellow\")\npensize(6)\nforward(70)\nleft(90)\nforward(70)\nleft(90)\ncolor(\"cyan\")\npensize(10)\nforward(70)\nleft(90)\nforward(70)\nleft(90)",
              "paths": [
                {
                  "points": [
                    [
                      44,
                      86
                    ],
                    [
                      116,
                      86
                    ],
                    [
                      116,
                      14
                    ]
                  ],
                  "stroke": "yellow",
                  "width": 5
                },
                {
                  "points": [
                    [
                      116,
                      14
                    ],
                    [
                      44,
                      14
                    ],
                    [
                      44,
                      86
                    ]
                  ],
                  "stroke": "cyan",
                  "width": 5
                }
              ],
              "circles": []
            }
          ],
          "objective": "Contrast and style-only repairs",
          "purpose": "Repair appearance while preserving geometry. This separates what a program draws from how it draws it.",
          "draftVersion": "unit1-v4",
          "contentVersion": "unit1-v4"
        },
        {
          "id": "1-12-create-night",
          "number": "1.12",
          "title": "Design an Arcade Badge",
          "type": "Create",
          "available": true,
          "notes": "Purpose: Control whether movement draws. Independent pieces become easier to combine into scenes and reusable functions. Students type the example and test the named line changes. Predictions record the first answer as well as the revised answer. A wrong first prediction can become a checked, correct explanation after observation. Fixed assignments must pass before the creative project opens. Discuss the saved note and ask the student to identify the command responsible for the observed result. Project checks grade the stated measurable requirements; the visual idea and quality of the design remain a teacher conversation. Ask what the student planned before typing and what they revised after running.",
          "check": {
            "rules": [
              {
                "type": "allowedCommands",
                "label": "Use only the commands in this assignment",
                "commands": [
                  "forward",
                  "backward",
                  "left",
                  "right",
                  "circle",
                  "color",
                  "bgcolor",
                  "pensize",
                  "penup",
                  "pendown"
                ],
                "fail": "Use one command per line, with literal values. Comments are allowed. Loops and functions come later."
              },
              {
                "type": "backgroundColor",
                "label": "Black background",
                "value": "black",
                "fail": "Use bgcolor(\"black\") and keep the drawing visible against it."
              },
              {
                "type": "drawnCircles",
                "label": "Include a visible circle",
                "count": 1,
                "fail": "Check the highlighted requirement and compare your output with the target."
              },
              {
                "type": "penTravel",
                "label": "Move without drawing at least once",
                "minDistance": 20,
                "fail": "Check the highlighted requirement and compare your output with the target."
              },
              {
                "type": "drawingParts",
                "label": "2+ separate drawing parts",
                "count": 2,
                "fail": "Check the highlighted requirement and compare your output with the target."
              },
              {
                "type": "drawingStyle",
                "label": "3+ visible drawing colors; every stroke width 4+",
                "colors": 3,
                "width": 4,
                "contrast": true,
                "distinctWidths": 2,
                "fail": "Set each color and width before drawing. Unused color changes do not count. All strokes must contrast with the background."
              },
              {
                "type": "drawingBounds",
                "label": "Keep the drawing inside the grid",
                "limit": 190,
                "fail": "A line or circle extends beyond the grid. Reduce a distance or radius, or change the route."
              }
            ]
          },
          "starter": "",
          "visuals": [
            {
              "label": "Neon planet",
              "bg": "black",
              "caption": "",
              "previewCode": "bgcolor(\"black\")\ncolor(\"cyan\")\npensize(6)\ncircle(30)\npenup()\nforward(80)\npendown()\ncolor(\"yellow\")\npensize(10)\ncircle(10)\npenup()\nbackward(120)\nleft(90)\nforward(55)\npendown()\ncolor(\"magenta\")\ncircle(8)",
              "paths": [],
              "circles": [
                {
                  "cx": 64.63,
                  "cy": 51.356,
                  "r": 27.123,
                  "stroke": "cyan",
                  "width": 5
                },
                {
                  "cx": 136.959,
                  "cy": 69.438,
                  "r": 9.041,
                  "stroke": "yellow",
                  "width": 5
                },
                {
                  "cx": 21.233,
                  "cy": 28.753,
                  "r": 7.233,
                  "stroke": "magenta",
                  "width": 5
                }
              ]
            },
            {
              "label": "Game medal",
              "bg": "black",
              "caption": "",
              "previewCode": "bgcolor(\"black\")\ncolor(\"yellow\")\npensize(6)\ncircle(25)\npenup()\nleft(90)\nforward(15)\nright(90)\npendown()\ncolor(\"cyan\")\npensize(10)\ncircle(10)\npenup()\nbackward(50)\npendown()\ncolor(\"magenta\")\ncircle(6)",
              "paths": [],
              "circles": [
                {
                  "cx": 102.32,
                  "cy": 50,
                  "r": 36,
                  "stroke": "yellow",
                  "width": 5
                },
                {
                  "cx": 102.32,
                  "cy": 50,
                  "r": 14.4,
                  "stroke": "cyan",
                  "width": 5
                },
                {
                  "cx": 30.32,
                  "cy": 55.76,
                  "r": 8.64,
                  "stroke": "magenta",
                  "width": 5
                }
              ]
            },
            {
              "label": "Robot eyes",
              "bg": "black",
              "caption": "",
              "previewCode": "bgcolor(\"black\")\ncolor(\"cyan\")\npensize(6)\ncircle(15)\npenup()\nforward(60)\npendown()\ncolor(\"yellow\")\npensize(10)\ncircle(15)\npenup()\nbackward(60)\nright(90)\nforward(25)\nleft(90)\npendown()\ncolor(\"magenta\")\nforward(60)",
              "paths": [
                {
                  "points": [
                    [
                      40.727,
                      86
                    ],
                    [
                      119.273,
                      86
                    ]
                  ],
                  "stroke": "magenta",
                  "width": 5
                }
              ],
              "circles": [
                {
                  "cx": 40.727,
                  "cy": 33.636,
                  "r": 19.636,
                  "stroke": "cyan",
                  "width": 5
                },
                {
                  "cx": 119.273,
                  "cy": 33.636,
                  "r": 19.636,
                  "stroke": "yellow",
                  "width": 5
                }
              ]
            }
          ],
          "steps": [
            {
              "id": "1-12-create-night-type-example",
              "title": "Type the example.",
              "body": "The pen starts down. Movement between parts leaves a connecting line. penup() lets you reposition without drawing; pendown() resumes drawing.",
              "task": "Start with an empty editor. Type the numbered commands. Run after each new movement or drawing command.",
              "phase": "Type the example",
              "example": "bgcolor(\"black\")\ncolor(\"cyan\")\npensize(6)\ncircle(20)\nforward(60)\ncircle(10)",
              "numbered": true,
              "focusLines": [
                1,
                2,
                3,
                4,
                5,
                6
              ],
              "draftId": "example"
            },
            {
              "id": "1-12-create-night-penup",
              "title": "Remove the connector.",
              "body": "Pen state affects future movement and drawing.",
              "task": "Insert penup() as line 5. The move becomes line 6 and the second circle line 7. Run. Both the connector and the second circle disappear.",
              "phase": "Change specific lines",
              "focusLines": [
                5,
                6,
                7
              ],
              "draftId": "example"
            },
            {
              "id": "1-12-create-night-predict",
              "title": "Predict a circle with the pen up.",
              "body": "Commit to a prediction before checking. Then compare it with the run.",
              "task": "Choose an answer, then Check prediction & run. Watch again to follow the highlighted lines.",
              "phase": "Predict and test",
              "example": "circle(20)\npenup()\nforward(60)\ncircle(10)",
              "lab": "circle(20)\npenup()\nforward(60)\ncircle(10)",
              "numbered": true,
              "draftId": "prediction-predict",
              "question": {
                "id": "1-12-create-night-predict",
                "prompt": "How many circles are visible?",
                "choices": [
                  "2",
                  "1",
                  "0"
                ],
                "answer": 1,
                "explanation": "The first circle draws while the pen is down. After penup(), the movement and second circle still execute, but leave no marks."
              }
            },
            {
              "id": "1-12-create-night-pendown",
              "title": "Resume drawing at the new position.",
              "body": "The pen stays up until you explicitly put it down.",
              "task": "Insert pendown() on line 7, before the second circle. Insert color(\"yellow\") on line 8. The second circle is now line 9. Run.",
              "phase": "Change specific lines",
              "focusLines": [
                7,
                8,
                9
              ],
              "draftId": "example"
            },
            {
              "id": "1-12-create-night-reason",
              "title": "Predict a late pen lift.",
              "body": "Commit to a prediction before checking. Then compare it with the run.",
              "task": "Choose an answer, then Check prediction & run. Watch again to follow the highlighted lines.",
              "phase": "Predict and test",
              "example": "circle(20)\nforward(60)\npenup()",
              "lab": "circle(20)\nforward(60)\npenup()",
              "numbered": true,
              "draftId": "prediction-reason",
              "question": {
                "id": "1-12-create-night-reason",
                "prompt": "Does the final penup() erase the connector?",
                "choices": [
                  "Yes",
                  "No"
                ],
                "answer": 1,
                "explanation": "The connector was drawn before the pen lifted. Pen state controls later actions. To prevent the line, lift the pen before moving."
              }
            },
            {
              "id": "1-12-create-night-evidence",
              "title": "Record one result.",
              "body": "Your notes stay in this lesson and save as you type.",
              "task": "Which line lifts the pen, which line moves it, and which line puts it down again? Record the order that avoids a connector.",
              "phase": "Lesson notes",
              "draftId": "example",
              "response": {
                "id": "1-12-create-night-evidence",
                "prompt": "Which line lifts the pen, which line moves it, and which line puts it down again? Record the order that avoids a connector.",
                "placeholder": "Lift on line ___. Move on line ___. Resume drawing on line ___."
              }
            },
            {
              "id": "1-12-create-night-transfer",
              "title": "Required: two separate neon circles.",
              "body": "Make a cyan radius-20 circle, then a yellow radius-10 circle starting 60 units right. Both strokes use width 6.",
              "task": "Start blank. Draw the fixed pair with no connecting line. Finish with the pen down, then Run and check.",
              "phase": "Required assignment",
              "lab": "\n",
              "typed": true,
              "numbered": true,
              "draftId": "assignment-transfer",
              "check": {
                "rules": [
                  {
                    "type": "allowedCommands",
                    "label": "Use only the commands in this assignment",
                    "commands": [
                      "forward",
                      "backward",
                      "left",
                      "right",
                      "circle",
                      "color",
                      "bgcolor",
                      "pensize",
                      "penup",
                      "pendown"
                    ],
                    "fail": "Use one command per line, with literal values. Comments are allowed. Loops and functions come later."
                  },
                  {
                    "type": "backgroundColor",
                    "label": "Black background",
                    "value": "black",
                    "fail": "Use bgcolor(\"black\") and keep the drawing visible against it."
                  },
                  {
                    "type": "literalNumbers",
                    "label": "Radii 20 and 10",
                    "commands": [
                      "circle"
                    ],
                    "values": [
                      20,
                      10
                    ],
                    "prefix": false,
                    "fail": "Keep the required distances, radii, or angles. Compare the values in your code with the assignment."
                  },
                  {
                    "type": "literalNumbers",
                    "label": "Move right 60 between circles",
                    "commands": [
                      "forward"
                    ],
                    "values": [
                      60
                    ],
                    "prefix": false,
                    "fail": "Keep the required distances, radii, or angles. Compare the values in your code with the assignment."
                  },
                  {
                    "type": "exactCalls",
                    "label": "No extra movement or turns",
                    "commands": [
                      "backward",
                      "left",
                      "right"
                    ],
                    "count": 0,
                    "fail": "Count these commands. The assignment requires exactly this many."
                  },
                  {
                    "type": "strokeStyles",
                    "label": "Cyan circle then yellow circle, both width 6",
                    "strokes": [
                      {
                        "color": "cyan",
                        "width": 6
                      },
                      {
                        "color": "yellow",
                        "width": 6
                      }
                    ],
                    "fail": "Check the highlighted requirement and compare your output with the target."
                  },
                  {
                    "type": "penTravel",
                    "label": "60-unit move with pen up",
                    "minDistance": 60,
                    "fail": "Check the highlighted requirement and compare your output with the target."
                  },
                  {
                    "type": "drawingParts",
                    "label": "Two separate parts",
                    "count": 2,
                    "fail": "Check the highlighted requirement and compare your output with the target."
                  },
                  {
                    "type": "penState",
                    "label": "Finish with pen down",
                    "down": true,
                    "fail": "Check the highlighted requirement and compare your output with the target."
                  },
                  {
                    "type": "finalPosition",
                    "label": "Finish at (60, 0)",
                    "x": 60,
                    "y": 0,
                    "tolerance": 1,
                    "fail": "Follow each movement from the start. The turtle has not reached the marked target."
                  }
                ]
              },
              "requirements": [
                "Black background; cyan radius 20, yellow radius 10; width 6.",
                "Second circle starts 60 units right of the first.",
                "No connector; finish with the pen down."
              ],
              "tip": "Lift the pen before the 60-unit move. Put it down before drawing the second circle.",
              "visuals": [
                {
                  "label": "Required separate circles",
                  "bg": "black",
                  "caption": "Two circles; no connecting stroke.",
                  "previewCode": "bgcolor(\"black\")\ncolor(\"cyan\")\npensize(6)\ncircle(20)\npenup()\nforward(60)\npendown()\ncolor(\"yellow\")\ncircle(10)",
                  "paths": [],
                  "circles": [
                    {
                      "cx": 43.333,
                      "cy": 50,
                      "r": 29.333,
                      "stroke": "cyan",
                      "width": 5
                    },
                    {
                      "cx": 131.333,
                      "cy": 64.667,
                      "r": 14.667,
                      "stroke": "yellow",
                      "width": 5
                    }
                  ]
                }
              ],
              "visualsTitle": "Required result"
            },
            {
              "id": "1-12-create-night-choice",
              "title": "Create an arcade badge with separate parts.",
              "body": "Make a planet with satellites, a game medal, robot eyes, or your own icon. Use pen state to position independent details.",
              "task": "Start blank. Combine separate drawing parts, then Run and check.",
              "phase": "Create your own",
              "draftId": "project",
              "lab": "\n",
              "typed": true,
              "requirements": [
                "Black background; at least 1 visible circle.",
                "At least 2 separate parts; use a pen-up move of 20 or more.",
                "At least 3 visible colors and 2 used widths; every stroke width 4 or more.",
                "Keep the badge inside the grid."
              ],
              "tip": "Plan the next starting point. Use penup(), move there, then pendown() before drawing the detail.",
              "visuals": [
                {
                  "label": "Neon planet",
                  "bg": "black",
                  "caption": "",
                  "previewCode": "bgcolor(\"black\")\ncolor(\"cyan\")\npensize(6)\ncircle(30)\npenup()\nforward(80)\npendown()\ncolor(\"yellow\")\npensize(10)\ncircle(10)\npenup()\nbackward(120)\nleft(90)\nforward(55)\npendown()\ncolor(\"magenta\")\ncircle(8)",
                  "paths": [],
                  "circles": [
                    {
                      "cx": 64.63,
                      "cy": 51.356,
                      "r": 27.123,
                      "stroke": "cyan",
                      "width": 5
                    },
                    {
                      "cx": 136.959,
                      "cy": 69.438,
                      "r": 9.041,
                      "stroke": "yellow",
                      "width": 5
                    },
                    {
                      "cx": 21.233,
                      "cy": 28.753,
                      "r": 7.233,
                      "stroke": "magenta",
                      "width": 5
                    }
                  ]
                },
                {
                  "label": "Game medal",
                  "bg": "black",
                  "caption": "",
                  "previewCode": "bgcolor(\"black\")\ncolor(\"yellow\")\npensize(6)\ncircle(25)\npenup()\nleft(90)\nforward(15)\nright(90)\npendown()\ncolor(\"cyan\")\npensize(10)\ncircle(10)\npenup()\nbackward(50)\npendown()\ncolor(\"magenta\")\ncircle(6)",
                  "paths": [],
                  "circles": [
                    {
                      "cx": 102.32,
                      "cy": 50,
                      "r": 36,
                      "stroke": "yellow",
                      "width": 5
                    },
                    {
                      "cx": 102.32,
                      "cy": 50,
                      "r": 14.4,
                      "stroke": "cyan",
                      "width": 5
                    },
                    {
                      "cx": 30.32,
                      "cy": 55.76,
                      "r": 8.64,
                      "stroke": "magenta",
                      "width": 5
                    }
                  ]
                },
                {
                  "label": "Robot eyes",
                  "bg": "black",
                  "caption": "",
                  "previewCode": "bgcolor(\"black\")\ncolor(\"cyan\")\npensize(6)\ncircle(15)\npenup()\nforward(60)\npendown()\ncolor(\"yellow\")\npensize(10)\ncircle(15)\npenup()\nbackward(60)\nright(90)\nforward(25)\nleft(90)\npendown()\ncolor(\"magenta\")\nforward(60)",
                  "paths": [
                    {
                      "points": [
                        [
                          40.727,
                          86
                        ],
                        [
                          119.273,
                          86
                        ]
                      ],
                      "stroke": "magenta",
                      "width": 5
                    }
                  ],
                  "circles": [
                    {
                      "cx": 40.727,
                      "cy": 33.636,
                      "r": 19.636,
                      "stroke": "cyan",
                      "width": 5
                    },
                    {
                      "cx": 119.273,
                      "cy": 33.636,
                      "r": 19.636,
                      "stroke": "yellow",
                      "width": 5
                    }
                  ]
                }
              ]
            }
          ],
          "group": "Color + Style",
          "objective": "Pen state and separate drawing parts",
          "purpose": "Control whether movement draws. Independent pieces become easier to combine into scenes and reusable functions.",
          "draftVersion": "unit1-v4",
          "contentVersion": "unit1-v4"
        },
        {
          "id": "1-13-make-ascii",
          "number": "1.13",
          "title": "Make Block Art",
          "type": "Make",
          "available": true,
          "notes": "Purpose: Treat spaces and characters as exact data. Later, variables and loops will build changing text displays. Students type the example and test the named line changes. Predictions record the first answer as well as the revised answer. A wrong first prediction can become a checked, correct explanation after observation. Fixed assignments must pass before the creative project opens. Discuss the saved note and ask the student to identify the command responsible for the observed result. Project checks grade the stated measurable requirements; the visual idea and quality of the design remain a teacher conversation. Ask the student to change one value and predict which visible property it controls.",
          "check": {
            "rules": [
              {
                "type": "allowedCommands",
                "label": "Use only the commands in this assignment",
                "commands": [
                  "print"
                ],
                "fail": "Use one command per line, with literal values. Comments are allowed. Loops and functions come later."
              },
              {
                "type": "printedRows",
                "label": "5+ output rows",
                "min": 5,
                "fail": "Check the highlighted requirement and compare your output with the target."
              },
              {
                "type": "differentRows",
                "label": "3+ different output rows",
                "min": 3,
                "fail": "Check the highlighted requirement and compare your output with the target."
              },
              {
                "type": "requiresAnyCharacter",
                "label": "Use blocks or other visual characters",
                "commands": [
                  "print"
                ],
                "characters": [
                  "█",
                  "▓",
                  "▒",
                  "░",
                  "#",
                  "*",
                  "|",
                  "/",
                  "\\",
                  "_",
                  "─",
                  "│"
                ],
                "fail": "Check the highlighted requirement and compare your output with the target."
              },
              {
                "type": "printedCharacters",
                "label": "20+ printed characters",
                "min": 20,
                "fail": "Check the highlighted requirement and compare your output with the target."
              }
            ]
          },
          "starter": "",
          "visuals": [
            {
              "label": "Pixel face",
              "ascii": " █████ \n█ █ █ █\n█     █\n█ ███ █\n █████ ",
              "caption": "",
              "previewCode": "print(\" █████ \")\nprint(\"█ █ █ █\")\nprint(\"█     █\")\nprint(\"█ ███ █\")\nprint(\" █████ \")"
            },
            {
              "label": "Signal bars",
              "ascii": "█░░░░░\n██░░░░\n███░░░\n████░░\n█████░",
              "caption": "",
              "previewCode": "print(\"█░░░░░\")\nprint(\"██░░░░\")\nprint(\"███░░░\")\nprint(\"████░░\")\nprint(\"█████░\")"
            },
            {
              "label": "Block tree",
              "ascii": "   █   \n  ███  \n █████ \n███████\n   █   ",
              "caption": "",
              "previewCode": "print(\"   █   \")\nprint(\"  ███  \")\nprint(\" █████ \")\nprint(\"███████\")\nprint(\"   █   \")"
            }
          ],
          "steps": [
            {
              "id": "1-13-make-ascii-type-example",
              "title": "Type the example.",
              "body": "print() sends text to Output. Quotes mark a string; they are not printed. Each print() starts a new output row.",
              "task": "Start with an empty editor. Type the numbered commands. Run after each new movement or drawing command.",
              "phase": "Type the example",
              "example": "print(\"█████\")\nprint(\"█░░░█\")\nprint(\"█████\")",
              "numbered": true,
              "focusLines": [
                1,
                2,
                3
              ],
              "draftId": "example"
            },
            {
              "id": "1-13-make-ascii-spaces",
              "title": "Make an opening with spaces.",
              "body": "Spaces inside quotes are printed characters. They hold positions in the picture.",
              "task": "On line 2 replace the three ░ characters with three spaces: print(\"█   █\"). Run. Keep the blocks at both edges.",
              "phase": "Change specific lines",
              "focusLines": [
                2
              ],
              "draftId": "example"
            },
            {
              "id": "1-13-make-ascii-predict",
              "title": "Predict an internal space.",
              "body": "Commit to a prediction before checking. Then compare it with the run.",
              "task": "Choose an answer, then Check prediction & run. Watch again to follow the highlighted lines.",
              "phase": "Predict and test",
              "example": "print(\"█ █\")\nprint(\"███\")",
              "lab": "print(\"█ █\")\nprint(\"███\")",
              "numbered": true,
              "draftId": "prediction-predict",
              "question": {
                "id": "1-13-make-ascii-predict",
                "prompt": "Does the space in the first output row disappear?",
                "choices": [
                  "Yes, Python ignores it",
                  "No, it occupies one character position"
                ],
                "answer": 1,
                "explanation": "Spaces inside a string are part of the printed text. The first row has three positions, including the gap."
              }
            },
            {
              "id": "1-13-make-ascii-extend",
              "title": "Add a status bar under the tile.",
              "body": "The content of a string makes the picture. Another print() makes another row.",
              "task": "Add print(\"[██░░]\") on line 4 and print(\"2 / 4\") on line 5. Run. Count the two filled and two shaded slots.",
              "phase": "Change specific lines",
              "focusLines": [
                4,
                5
              ],
              "draftId": "example"
            },
            {
              "id": "1-13-make-ascii-reason",
              "title": "Predict the exact row width.",
              "body": "Commit to a prediction before checking. Then compare it with the run.",
              "task": "Choose an answer, then Check prediction & run. Watch again to follow the highlighted lines.",
              "phase": "Predict and test",
              "example": "print(\"  █  \")",
              "lab": "print(\"  █  \")",
              "numbered": true,
              "draftId": "prediction-reason",
              "question": {
                "id": "1-13-make-ascii-reason",
                "prompt": "How many characters appear before the newline?",
                "choices": [
                  "1",
                  "3",
                  "5"
                ],
                "answer": 2,
                "explanation": "Two spaces, one block, and two more spaces make five printed characters. The quotes mark the string and do not appear in Output."
              }
            },
            {
              "id": "1-13-make-ascii-evidence",
              "title": "Record one result.",
              "body": "Your notes stay in this lesson and save as you type.",
              "task": "Record the middle tile row and count its characters: blocks and spaces. What would removing one inside space change?",
              "phase": "Lesson notes",
              "draftId": "example",
              "response": {
                "id": "1-13-make-ascii-evidence",
                "prompt": "Record the middle tile row and count its characters: blocks and spaces. What would removing one inside space change?",
                "placeholder": "Middle row: ___. ___ blocks + ___ spaces = ___ positions. Removing a space would ___."
              }
            },
            {
              "id": "1-13-make-ascii-transfer",
              "title": "Required: repair a hollow tile.",
              "body": "The required tile has three rows, each five characters wide. The middle has a three-space opening.",
              "task": "Type the program. Repair the middle row only. Run and Check assignment.",
              "phase": "Required assignment",
              "lab": "print(\"█████\")\nprint(\"█ █\")\nprint(\"█████\")",
              "typed": true,
              "numbered": true,
              "example": "print(\"█████\")\nprint(\"█ █\")\nprint(\"█████\")",
              "draftId": "assignment-transfer",
              "check": {
                "rules": [
                  {
                    "type": "allowedCommands",
                    "label": "Use only the commands in this assignment",
                    "commands": [
                      "print"
                    ],
                    "fail": "Use one command per line, with literal values. Comments are allowed. Loops and functions come later."
                  },
                  {
                    "type": "exactCalls",
                    "label": "Exactly 3 print commands",
                    "commands": [
                      "print"
                    ],
                    "count": 3,
                    "fail": "Count these commands. The assignment requires exactly this many."
                  },
                  {
                    "type": "outputRows",
                    "label": "Print the required rows in order",
                    "rows": [
                      "█████",
                      "█   █",
                      "█████"
                    ],
                    "fail": "Compare the actual text output row by row. Spaces inside quotes are part of the output."
                  }
                ]
              },
              "requirements": [
                "Top and bottom: 5 full blocks.",
                "Middle: block, 3 spaces, block.",
                "Exactly 3 output rows; each width 5."
              ],
              "tip": "Keep the spaces inside the quotes. Use Show spaces to count them.",
              "focusLines": [
                2
              ],
              "visuals": [
                {
                  "label": "Required hollow tile",
                  "ascii": "█████\n█   █\n█████",
                  "caption": "Three rows; five character positions per row."
                }
              ],
              "visualsTitle": "Required output"
            },
            {
              "id": "1-13-make-ascii-choice",
              "title": "Create a tiny text picture.",
              "body": "Make a pixel face, a growing signal, a tree, or another picture made of rows. Choose your own symbols and spacing.",
              "task": "Start blank. Build with print() and quoted strings. Run and check.",
              "phase": "Create your own",
              "draftId": "project",
              "lab": "\n",
              "typed": true,
              "requirements": [
                "At least 5 output rows and 3 different rows.",
                "At least 20 printed characters in total.",
                "Use blocks or another visual character."
              ],
              "tip": "Each space counts. Use the symbol palette and keep quote marks around each row.",
              "visuals": [
                {
                  "label": "Pixel face",
                  "ascii": " █████ \n█ █ █ █\n█     █\n█ ███ █\n █████ ",
                  "caption": "",
                  "previewCode": "print(\" █████ \")\nprint(\"█ █ █ █\")\nprint(\"█     █\")\nprint(\"█ ███ █\")\nprint(\" █████ \")"
                },
                {
                  "label": "Signal bars",
                  "ascii": "█░░░░░\n██░░░░\n███░░░\n████░░\n█████░",
                  "caption": "",
                  "previewCode": "print(\"█░░░░░\")\nprint(\"██░░░░\")\nprint(\"███░░░\")\nprint(\"████░░\")\nprint(\"█████░\")"
                },
                {
                  "label": "Block tree",
                  "ascii": "   █   \n  ███  \n █████ \n███████\n   █   ",
                  "caption": "",
                  "previewCode": "print(\"   █   \")\nprint(\"  ███  \")\nprint(\" █████ \")\nprint(\"███████\")\nprint(\"   █   \")"
                }
              ]
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
          "paletteIntro": "Click to insert at the cursor and copy for later pasting. █ is a full block; ░ is light shade. These block symbols are Unicode characters used in text art.",
          "objective": "Strings, rows, and spaces",
          "purpose": "Treat spaces and characters as exact data. Later, variables and loops will build changing text displays.",
          "draftVersion": "unit1-v4",
          "contentVersion": "unit1-v4",
          "outputMode": "text"
        },
        {
          "id": "1-14-solve-ascii",
          "number": "1.14",
          "title": "ASCII Repair",
          "type": "Solve",
          "available": true,
          "notes": "Purpose: Count character positions to repair alignment. Later, formatted strings will organize numbers and status messages. Students type the example and test the named line changes. Predictions record the first answer as well as the revised answer. A wrong first prediction can become a checked, correct explanation after observation. Fixed assignments must pass before the creative project opens. Discuss the saved note and ask the student to identify the command responsible for the observed result. Project checks grade the stated measurable requirements; the visual idea and quality of the design remain a teacher conversation. Ask which line first differs from the intended result before offering a hint.",
          "check": {
            "rules": [
              {
                "type": "allowedCommands",
                "label": "Use only the commands in this assignment",
                "commands": [
                  "print"
                ],
                "fail": "Use one command per line, with literal values. Comments are allowed. Loops and functions come later."
              },
              {
                "type": "printedRows",
                "label": "5+ output rows",
                "min": 5,
                "fail": "Check the highlighted requirement and compare your output with the target."
              },
              {
                "type": "differentRows",
                "label": "3+ different rows",
                "min": 3,
                "fail": "Check the highlighted requirement and compare your output with the target."
              },
              {
                "type": "sameRowWidth",
                "label": "All picture rows have the same width",
                "min": 5,
                "minWidth": 5,
                "maxWidth": 15,
                "fail": "Check the highlighted requirement and compare your output with the target."
              },
              {
                "type": "textSymmetry",
                "label": "Each row mirrors left to right",
                "fail": "Check the highlighted requirement and compare your output with the target."
              },
              {
                "type": "requiresAnyCharacter",
                "label": "Use blocks or other visual characters",
                "commands": [
                  "print"
                ],
                "characters": [
                  "█",
                  "▓",
                  "▒",
                  "░",
                  "#",
                  "*",
                  "|",
                  "/",
                  "\\",
                  "_",
                  "─",
                  "│"
                ],
                "fail": "Check the highlighted requirement and compare your output with the target."
              }
            ]
          },
          "starter": "",
          "visuals": [
            {
              "label": "Pixel alien",
              "ascii": "  █████  \n ██ █ ██ \n█████████\n█ █████ █\n  █   █  ",
              "caption": "Nine character positions in each row."
            },
            {
              "label": "Diamond",
              "ascii": "    █    \n   ███   \n  █████  \n ███████ \n█████████\n ███████ \n  █████  \n   ███   \n    █    ",
              "caption": "The same width, with a changing silhouette."
            },
            {
              "label": "Pixel shield",
              "ascii": "█████████\n█       █\n █     █ \n  █   █  \n   ███   ",
              "caption": "Leading and trailing spaces keep the center fixed."
            }
          ],
          "steps": [
            {
              "id": "1-14-solve-ascii-type-example",
              "title": "Type the example.",
              "body": "Output uses a monospace font: each character position has equal width. The bottom two rows need spacing repairs.",
              "task": "Start with an empty editor. Type the numbered commands. Run after each new movement or drawing command.",
              "phase": "Type the example",
              "example": "print(\"  ██  \")\nprint(\" █  █ \")\nprint(\"█    █\")\nprint(\" █  █\")\nprint(\"   ██\")",
              "numbered": true,
              "focusLines": [
                1,
                2,
                3,
                4,
                5
              ],
              "draftId": "example"
            },
            {
              "id": "1-14-solve-ascii-predict",
              "title": "Predict alignment.",
              "body": "Commit to a prediction before checking. Then compare it with the run.",
              "task": "Choose an answer, then Check prediction & run. Watch again to follow the highlighted lines.",
              "phase": "Predict and test",
              "example": "print(\"  ██  \")\nprint(\" █  █ \")",
              "lab": "print(\"  ██  \")\nprint(\" █  █ \")",
              "numbered": true,
              "draftId": "prediction-predict",
              "question": {
                "id": "1-14-solve-ascii-predict",
                "prompt": "Why do these rows line up in a six-position picture?",
                "choices": [
                  "Python centers strings",
                  "Both strings have 6 character positions",
                  "The quotes are aligned in code"
                ],
                "answer": 1,
                "explanation": "The leading and trailing spaces are part of each six-character string. Output does not center them automatically."
              }
            },
            {
              "id": "1-14-solve-ascii-repair",
              "title": "Repair the two shifted rows.",
              "body": "Match spaces around the visible blocks, not just the number of blocks.",
              "task": "On line 4 use print(\" █  █ \"). On line 5 use print(\"  ██  \"). Keep lines 1–3. Run and compare the top and bottom.",
              "phase": "Change specific lines",
              "focusLines": [
                4,
                5
              ],
              "draftId": "example"
            },
            {
              "id": "1-14-solve-ascii-test-width",
              "title": "Test what one space does.",
              "body": "A leading space shifts every later character in that row.",
              "task": "Temporarily remove one leading space inside the quotes on line 1. Run, then restore it and Run again. Use Show spaces to see the change.",
              "phase": "Change specific lines",
              "focusLines": [
                1
              ],
              "draftId": "example"
            },
            {
              "id": "1-14-solve-ascii-reason",
              "title": "Predict where a space belongs.",
              "body": "Commit to a prediction before checking. Then compare it with the run.",
              "task": "Choose an answer, then Check prediction & run. Watch again to follow the highlighted lines.",
              "phase": "Predict and test",
              "example": "print(\"█ █\")",
              "lab": "print(\"█ █\")",
              "numbered": true,
              "draftId": "prediction-reason",
              "question": {
                "id": "1-14-solve-ascii-reason",
                "prompt": "To add a gap between the two blocks, where should the extra space go?",
                "choices": [
                  "Inside the string between the blocks",
                  "Before print()",
                  "After the closing parenthesis"
                ],
                "answer": 0,
                "explanation": "Only the characters inside the quotes are printed. Indentation before print() is Python syntax and can cause an error at the top level."
              }
            },
            {
              "id": "1-14-solve-ascii-evidence",
              "title": "Record one result.",
              "body": "Your notes stay in this lesson and save as you type.",
              "task": "Write the old and repaired line 5 strings. How many leading and trailing spaces are in the repaired row?",
              "phase": "Lesson notes",
              "draftId": "example",
              "response": {
                "id": "1-14-solve-ascii-evidence",
                "prompt": "Write the old and repaired line 5 strings. How many leading and trailing spaces are in the repaired row?",
                "placeholder": "Before: ___. After: ___. Repaired row: ___ leading spaces and ___ trailing spaces."
              }
            },
            {
              "id": "1-14-solve-ascii-transfer",
              "title": "Required: repair a centered arrow.",
              "body": "The arrow has five rows, each five character positions wide. Its point must stay centered.",
              "task": "Type the misaligned output. Repair spaces inside the strings to match the required arrow. Keep five print() calls.",
              "phase": "Required assignment",
              "lab": "print(\"   █ \")\nprint(\" ███ \")\nprint(\"█████\")\nprint(\"  █ \")\nprint(\"   █\")",
              "typed": true,
              "numbered": true,
              "example": "print(\"   █ \")\nprint(\" ███ \")\nprint(\"█████\")\nprint(\"  █ \")\nprint(\"   █\")",
              "draftId": "assignment-transfer",
              "check": {
                "rules": [
                  {
                    "type": "allowedCommands",
                    "label": "Use only the commands in this assignment",
                    "commands": [
                      "print"
                    ],
                    "fail": "Use one command per line, with literal values. Comments are allowed. Loops and functions come later."
                  },
                  {
                    "type": "exactCalls",
                    "label": "Exactly 5 print commands",
                    "commands": [
                      "print"
                    ],
                    "count": 5,
                    "fail": "Count these commands. The assignment requires exactly this many."
                  },
                  {
                    "type": "outputRows",
                    "label": "Print the required rows in order",
                    "rows": [
                      "  █  ",
                      " ███ ",
                      "█████",
                      "  █  ",
                      "  █  "
                    ],
                    "fail": "Compare the actual text output row by row. Spaces inside quotes are part of the output."
                  }
                ]
              },
              "requirements": [
                "Exactly 5 rows, each width 5.",
                "Point and stem centered in position 3.",
                "The required arrow matches the preview."
              ],
              "tip": "Count positions from the left. Every space inside the quotes uses a position.",
              "focusLines": [
                1,
                2,
                3,
                4,
                5
              ],
              "visuals": [
                {
                  "label": "Required arrow",
                  "ascii": "  █  \n ███ \n█████\n  █  \n  █  ",
                  "caption": "Every row has five positions."
                }
              ],
              "visualsTitle": "Required output"
            },
            {
              "id": "1-14-solve-ascii-choice",
              "title": "Create a mirrored pixel badge.",
              "body": "Make an alien, a diamond, a shield, or another design whose rows mirror left to right. Choose a width from 5 to 15 positions.",
              "task": "Start blank. Build at least five rows with equal width and a mirrored arrangement, then Run and check.",
              "phase": "Create your own",
              "draftId": "project",
              "lab": "\n",
              "typed": true,
              "requirements": [
                "At least 5 rows and 3 different rows.",
                "All rows have the same width, from 5 to 15 characters.",
                "Every row reads the same from left to right and right to left.",
                "Use visual characters."
              ],
              "tip": "For each block or space left of the center, put the same character the same distance to the right.",
              "visuals": [
                {
                  "label": "Pixel alien",
                  "ascii": "  █████  \n ██ █ ██ \n█████████\n█ █████ █\n  █   █  ",
                  "caption": "Nine character positions in each row."
                },
                {
                  "label": "Diamond",
                  "ascii": "    █    \n   ███   \n  █████  \n ███████ \n█████████\n ███████ \n  █████  \n   ███   \n    █    ",
                  "caption": "The same width, with a changing silhouette."
                },
                {
                  "label": "Pixel shield",
                  "ascii": "█████████\n█       █\n █     █ \n  █   █  \n   ███   ",
                  "caption": "Leading and trailing spaces keep the center fixed."
                }
              ]
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
          "paletteIntro": "Click to insert and copy. Spaces inside quotes position the symbols; use Show spaces to count them.",
          "objective": "Monospace alignment and symmetry",
          "purpose": "Count character positions to repair alignment. Later, formatted strings will organize numbers and status messages.",
          "draftVersion": "unit1-v4",
          "contentVersion": "unit1-v4",
          "outputMode": "text"
        },
        {
          "id": "1-15-create-ascii",
          "number": "1.15",
          "title": "ASCII Dashboard",
          "type": "Create",
          "available": true,
          "notes": "Purpose: Make a visual meter agree with its numbers. Later, variables will update the picture and label from the same value. Students type the example and test the named line changes. Predictions record the first answer as well as the revised answer. A wrong first prediction can become a checked, correct explanation after observation. Fixed assignments must pass before the creative project opens. Discuss the saved note and ask the student to identify the command responsible for the observed result. Project checks grade the stated measurable requirements; the visual idea and quality of the design remain a teacher conversation. Ask what the student planned before typing and what they revised after running.",
          "check": {
            "rules": [
              {
                "type": "allowedCommands",
                "label": "Use only the commands in this assignment",
                "commands": [
                  "print"
                ],
                "fail": "Use one command per line, with literal values. Comments are allowed. Loops and functions come later."
              },
              {
                "type": "printedRows",
                "label": "6+ output rows",
                "min": 6,
                "fail": "Check the highlighted requirement and compare your output with the target."
              },
              {
                "type": "differentRows",
                "label": "4+ different rows",
                "min": 4,
                "fail": "Check the highlighted requirement and compare your output with the target."
              },
              {
                "type": "meters",
                "label": "2 different meters with matching fractions",
                "min": 2,
                "minSlots": 4,
                "different": true,
                "fail": "Check the highlighted requirement and compare your output with the target."
              },
              {
                "type": "requiresAnyCharacter",
                "label": "Use blocks or other visual characters",
                "commands": [
                  "print"
                ],
                "characters": [
                  "█",
                  "▓",
                  "▒",
                  "░",
                  "#",
                  "*",
                  "|",
                  "/",
                  "\\",
                  "_",
                  "─",
                  "│"
                ],
                "fail": "Check the highlighted requirement and compare your output with the target."
              }
            ]
          },
          "starter": "",
          "visuals": [
            {
              "label": "Game HUD",
              "ascii": "ENERGY\n[███░░░]\n3 / 6\nSHIELD\n[████░░]\n4 / 6",
              "caption": "Two meters; every fraction matches its bar."
            },
            {
              "label": "Pet care panel",
              "ascii": "FOOD\n[███░]\n3 / 4\nPLAY\n[█░░░]\n1 / 4",
              "caption": "Choose the labels and states."
            },
            {
              "label": "Mission tracker",
              "ascii": "MAP FOUND\n[████░]\n4 / 5\nGEMS FOUND\n[██░░░]\n2 / 5",
              "caption": "Use output to communicate progress."
            }
          ],
          "steps": [
            {
              "id": "1-15-create-ascii-type-example",
              "title": "Type the example.",
              "body": "The program runs, but the bar and its numeric label disagree. The bracketed meter contains four slots.",
              "task": "Start with an empty editor. Type the numbered commands. Run after each new movement or drawing command.",
              "phase": "Type the example",
              "example": "print(\"ENERGY\")\nprint(\"[██░░]\")\nprint(\"4 / 4\")",
              "numbered": true,
              "focusLines": [
                1,
                2,
                3
              ],
              "draftId": "example"
            },
            {
              "id": "1-15-create-ascii-predict",
              "title": "Predict what the meter communicates.",
              "body": "Commit to a prediction before checking. Then compare it with the run.",
              "task": "Choose an answer, then Check prediction & run. Watch again to follow the highlighted lines.",
              "phase": "Predict and test",
              "example": "print(\"ENERGY\")\nprint(\"[██░░]\")\nprint(\"4 / 4\")",
              "lab": "print(\"ENERGY\")\nprint(\"[██░░]\")\nprint(\"4 / 4\")",
              "numbered": true,
              "draftId": "prediction-predict",
              "question": {
                "id": "1-15-create-ascii-predict",
                "prompt": "Which statement matches the bar?",
                "choices": [
                  "4 of 4 slots are filled",
                  "2 of 4 slots are filled",
                  "The brackets count as filled slots"
                ],
                "answer": 1,
                "explanation": "The bar has two full blocks and two shaded slots. Its label should say 2 / 4. The brackets frame the meter and do not count as slots."
              }
            },
            {
              "id": "1-15-create-ascii-truth",
              "title": "Make the first display agree.",
              "body": "The label and picture need to communicate the same state.",
              "task": "Change line 3 to print(\"2 / 4\"). Run and compare the fraction with the filled blocks.",
              "phase": "Change specific lines",
              "focusLines": [
                3
              ],
              "draftId": "example"
            },
            {
              "id": "1-15-create-ascii-new-state",
              "title": "Update both parts to a new state.",
              "body": "Changing a bar without its label makes the output contradictory again.",
              "task": "On line 2 use print(\"[███░]\"). On line 3 use print(\"3 / 4\"). Run. Count both filled and total slots.",
              "phase": "Change specific lines",
              "focusLines": [
                2,
                3
              ],
              "draftId": "example"
            },
            {
              "id": "1-15-create-ascii-reason",
              "title": "Predict a six-slot label.",
              "body": "Commit to a prediction before checking. Then compare it with the run.",
              "task": "Choose an answer, then Check prediction & run. Watch again to follow the highlighted lines.",
              "phase": "Predict and test",
              "example": "print(\"[████░░]\")",
              "lab": "print(\"[████░░]\")",
              "numbered": true,
              "draftId": "prediction-reason",
              "question": {
                "id": "1-15-create-ascii-reason",
                "prompt": "What fraction should follow this meter?",
                "choices": [
                  "4 / 4",
                  "2 / 6",
                  "4 / 6"
                ],
                "answer": 2,
                "explanation": "There are four filled blocks and six slots in total. The numerator counts filled slots; the denominator counts all slots."
              }
            },
            {
              "id": "1-15-create-ascii-evidence",
              "title": "Record one result.",
              "body": "Your notes stay in this lesson and save as you type.",
              "task": "For [███░], record the filled count, empty count, total count, and matching fraction.",
              "phase": "Lesson notes",
              "draftId": "example",
              "response": {
                "id": "1-15-create-ascii-evidence",
                "prompt": "For [███░], record the filled count, empty count, total count, and matching fraction.",
                "placeholder": "Filled: ___. Empty: ___. Total: ___. Fraction: ___ / ___."
              }
            },
            {
              "id": "1-15-create-ascii-transfer",
              "title": "Required: repair the shield meter.",
              "body": "The shield must show four filled slots out of six. Keep the SHIELD label and exactly three rows.",
              "task": "Type the program, repair the bar and fraction, then Run and check.",
              "phase": "Required assignment",
              "lab": "print(\"SHIELD\")\nprint(\"[██░░░░]\")\nprint(\"4 / 4\")",
              "typed": true,
              "numbered": true,
              "example": "print(\"SHIELD\")\nprint(\"[██░░░░]\")\nprint(\"4 / 4\")",
              "draftId": "assignment-transfer",
              "check": {
                "rules": [
                  {
                    "type": "allowedCommands",
                    "label": "Use only the commands in this assignment",
                    "commands": [
                      "print"
                    ],
                    "fail": "Use one command per line, with literal values. Comments are allowed. Loops and functions come later."
                  },
                  {
                    "type": "exactCalls",
                    "label": "Exactly 3 print commands",
                    "commands": [
                      "print"
                    ],
                    "count": 3,
                    "fail": "Count these commands. The assignment requires exactly this many."
                  },
                  {
                    "type": "outputRows",
                    "label": "Print the required rows in order",
                    "rows": [
                      "SHIELD",
                      "[████░░]",
                      "4 / 6"
                    ],
                    "fail": "Compare the actual text output row by row. Spaces inside quotes are part of the output."
                  }
                ]
              },
              "requirements": [
                "Label: SHIELD.",
                "Bar: 4 filled slots and 2 empty slots.",
                "Fraction: 4 / 6; exactly 3 output rows."
              ],
              "tip": "Count the slots between the brackets. The fraction uses filled / total.",
              "focusLines": [
                2,
                3
              ],
              "visuals": [
                {
                  "label": "Required shield meter",
                  "ascii": "SHIELD\n[████░░]\n4 / 6",
                  "caption": "Four filled out of six."
                }
              ],
              "visualsTitle": "Required output"
            },
            {
              "id": "1-15-create-ascii-unit-beacon",
              "title": "Required: repair the signal beacon.",
              "body": "Combine the unit’s skills. The route is already correct; the drawing and printed meter need repairs.",
              "task": "Type the program. Keep the movements, turn, and circle radius. Make all strokes visible on black at width 6 or more, use 2 drawing colors, and make the meter show 3 / 4.",
              "phase": "Required assignment",
              "lab": "bgcolor(\"black\")\ncolor(\"black\")\npensize(2)\nforward(60)\nleft(90)\nforward(40)\ncircle(15)\nprint(\"[██░░]\")\nprint(\"3 / 4\")",
              "typed": true,
              "numbered": true,
              "example": "bgcolor(\"black\")\ncolor(\"black\")\npensize(2)\nforward(60)\nleft(90)\nforward(40)\ncircle(15)\nprint(\"[██░░]\")\nprint(\"3 / 4\")",
              "draftId": "assignment-unit-beacon",
              "check": {
                "rules": [
                  {
                    "type": "allowedCommands",
                    "label": "Use only the commands in this assignment",
                    "commands": [
                      "forward",
                      "backward",
                      "left",
                      "right",
                      "circle",
                      "color",
                      "bgcolor",
                      "pensize",
                      "penup",
                      "pendown",
                      "print"
                    ],
                    "fail": "Use one command per line, with literal values. Comments are allowed. Loops and functions come later."
                  },
                  {
                    "type": "backgroundColor",
                    "label": "Black background",
                    "value": "black",
                    "fail": "Use bgcolor(\"black\") and keep the drawing visible against it."
                  },
                  {
                    "type": "literalNumbers",
                    "label": "Preserve the 60-right, 40-up route",
                    "commands": [
                      "forward"
                    ],
                    "values": [
                      60,
                      40
                    ],
                    "prefix": false,
                    "fail": "Keep the required distances, radii, or angles. Compare the values in your code with the assignment."
                  },
                  {
                    "type": "literalNumbers",
                    "label": "Keep left(90)",
                    "commands": [
                      "left"
                    ],
                    "values": [
                      90
                    ],
                    "prefix": false,
                    "fail": "Keep the required distances, radii, or angles. Compare the values in your code with the assignment."
                  },
                  {
                    "type": "exactCalls",
                    "label": "No extra movements or turns",
                    "commands": [
                      "backward",
                      "right"
                    ],
                    "count": 0,
                    "fail": "Count these commands. The assignment requires exactly this many."
                  },
                  {
                    "type": "literalNumbers",
                    "label": "Keep the radius-15 signal circle",
                    "commands": [
                      "circle"
                    ],
                    "values": [
                      15
                    ],
                    "prefix": false,
                    "fail": "Keep the required distances, radii, or angles. Compare the values in your code with the assignment."
                  },
                  {
                    "type": "drawnCircles",
                    "label": "Draw the signal circle with the pen down",
                    "count": 1,
                    "fail": "Check the highlighted requirement and compare your output with the target."
                  },
                  {
                    "type": "finalPosition",
                    "label": "Finish at (60, 40)",
                    "x": 60,
                    "y": 40,
                    "tolerance": 1,
                    "fail": "Follow each movement from the start. The turtle has not reached the marked target."
                  },
                  {
                    "type": "drawingStyle",
                    "label": "2+ visible drawing colors; every stroke width 6+",
                    "colors": 2,
                    "width": 6,
                    "contrast": true,
                    "fail": "Set each color and width before drawing. Unused color changes do not count. All strokes must contrast with the background."
                  },
                  {
                    "type": "outputRows",
                    "label": "Print the required rows in order",
                    "rows": [
                      "[███░]",
                      "3 / 4"
                    ],
                    "fail": "Compare the actual text output row by row. Spaces inside quotes are part of the output."
                  }
                ]
              },
              "requirements": [
                "Preserve the route: 60 right, 40 up; signal circle radius 15.",
                "Black background; at least 2 visible drawing colors; every stroke width 6 or more.",
                "Print exactly [███░] and 3 / 4 on two rows."
              ],
              "tip": "Repair one property and Run before changing the next. Set the second color before a stroke.",
              "editorOutput": "drawing",
              "visuals": [
                {
                  "label": "Required beacon route",
                  "bg": "#fbfaf6",
                  "caption": "Keep this geometry; choose two visible colors.",
                  "previewCode": "forward(60)\nleft(90)\nforward(40)\ncircle(15)",
                  "paths": [
                    {
                      "points": [
                        [
                          40.727,
                          86
                        ],
                        [
                          119.273,
                          86
                        ],
                        [
                          119.273,
                          33.636
                        ]
                      ],
                      "stroke": "#202525",
                      "width": 2.618181818181818
                    }
                  ],
                  "circles": [
                    {
                      "cx": 99.636,
                      "cy": 33.636,
                      "r": 19.636,
                      "stroke": "#202525",
                      "width": 2.618181818181818
                    }
                  ]
                },
                {
                  "label": "Required meter",
                  "ascii": "[███░]\n3 / 4",
                  "caption": "The drawing and meter must both work."
                }
              ],
              "visualsTitle": "Required results",
              "focusLines": [
                2,
                3,
                4,
                6,
                7,
                8,
                9
              ]
            },
            {
              "id": "1-15-create-ascii-choice",
              "title": "Create a two-meter dashboard.",
              "body": "Make a game HUD, a pet-care panel, a mission tracker, or another display. Choose what each meter measures and what state it shows.",
              "task": "Start blank. Print a label, bar, and fraction for each of two different meters. Run and Check my code.",
              "phase": "Create your own",
              "draftId": "project",
              "lab": "\n",
              "typed": true,
              "requirements": [
                "At least 6 output rows and 4 different rows.",
                "At least 2 bracketed meters using █ and ░, each with 4 or more slots.",
                "Put each matching filled / total fraction immediately below its bar.",
                "The two meters must show different filled/total states."
              ],
              "tip": "Use three rows per meter: label, [filled and empty slots], fraction. Count the blocks every time you revise the state.",
              "visuals": [
                {
                  "label": "Game HUD",
                  "ascii": "ENERGY\n[███░░░]\n3 / 6\nSHIELD\n[████░░]\n4 / 6",
                  "caption": "Two meters; every fraction matches its bar."
                },
                {
                  "label": "Pet care panel",
                  "ascii": "FOOD\n[███░]\n3 / 4\nPLAY\n[█░░░]\n1 / 4",
                  "caption": "Choose the labels and states."
                },
                {
                  "label": "Mission tracker",
                  "ascii": "MAP FOUND\n[████░]\n4 / 5\nGEMS FOUND\n[██░░░]\n2 / 5",
                  "caption": "Use output to communicate progress."
                }
              ]
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
          "paletteIntro": "█ means a filled slot; ░ means an empty slot in these meters. Click to insert and copy either symbol.",
          "objective": "Visual meaning and consistent output",
          "purpose": "Make a visual meter agree with its numbers. Later, variables will update the picture and label from the same value.",
          "draftVersion": "unit1-v4",
          "contentVersion": "unit1-v4",
          "outputMode": "text"
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
