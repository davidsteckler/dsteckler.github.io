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
          "starter": "",
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
              "id": "1-1-make-path-type-example",
              "title": "Type the example, one line at a time.",
              "body": "Start on line 1. Use the line numbers below and Run after each command.",
              "task": "Type each command on its numbered line. Keep the editor free of blank lines above the first command.",
              "example": "forward(80)\nleft(90)\nforward(80)",
              "numbered": true,
              "focusLines": [
                1,
                2,
                3
              ],
              "phase": "Type the example"
            },
            {
              "id": "1-1-make-path-edit",
              "title": "Change distance on line 1.",
              "body": "Change one property, then compare the output.",
              "task": "Replace forward(80) on line 1 with forward(140). Leave lines 2–3 unchanged. Run and compare the first segment.",
              "focusLines": [
                1
              ],
              "phase": "Change specific lines"
            },
            {
              "title": "Change the turn on line 2.",
              "body": "The turn angle changes direction.",
              "task": "Restore forward(80) on line 1. Change line 2 to left(45). Run and compare the corner.",
              "focusLines": [
                1,
                2
              ]
            },
            {
              "title": "Add a turn and a move.",
              "body": "A turn changes direction; a movement draws in that direction.",
              "task": "On line 4 type right(90). Run. On line 5 type forward(50). Run again.",
              "focusLines": [
                4,
                5
              ]
            },
            {
              "title": "Move backward on line 6.",
              "body": "backward() moves opposite the heading without turning.",
              "task": "On line 6 type backward(30). Run and watch the last segment retrace.",
              "focusLines": [
                6
              ]
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
              "lab": "forward(60)\nleft(90)\nbackward(20)",
              "phase": "Check understanding"
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
              "lab": "left(90)\nright(90)\nforward(25)",
              "phase": "Check understanding"
            },
            {
              "id": "1-1-make-path-evidence",
              "title": "What changed when you changed line 1?",
              "body": "In step 2, you changed line 1 from forward(80) to forward(140). The other two lines stayed the same.",
              "task": "Which part of the path became longer: the first horizontal line or the line after the turn? Did the turtle turn by a different amount? Write both answers below.",
              "response": {
                "id": "1-1-make-path-evidence",
                "prompt": "Which part of the path became longer: the first horizontal line or the line after the turn? Did the turtle turn by a different amount? Write both answers below.",
                "placeholder": "The ______ line became longer. The turn ______ because ______."
              },
              "phase": "Lesson notes",
              "example": "Before: forward(80)\nAfter:  forward(140)\n\nUnchanged:\nleft(90)\nforward(80)"
            },
            {
              "id": "1-1-make-path-transfer",
              "title": "Required: Reach the target without changing the turn.",
              "body": "Complete this fixed target and pass Check assignment before starting your own design. This assignment has its own saved code. First type the numbered starting program below, then make the required changes.",
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
              "tip": "Use Step to find the first command whose result differs from your prediction.",
              "phase": "Required assignment",
              "focusLines": [
                1,
                2,
                3
              ],
              "typed": true,
              "numbered": true
            },
            {
              "title": "Choice: build your own drawing.",
              "body": "Choose your own design using the skills from this lesson. The visual examples are inspiration; the requirements below are what gets checked.",
              "task": "Build from a blank editor. Requirements: 4+ movement commands; 2+ turns; Use backward(); 2 different distances. Run, then Check my code.",
              "phase": "Create your own",
              "id": "1-1-make-path-choice",
              "lab": "\n",
              "typed": true
            }
          ],
          "group": "Movement",
          "objective": "Track position and heading separately",
          "purpose": "Control distance and direction separately so you can plan paths and later repeat them with loops."
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
          "starter": "",
          "steps": [
            {
              "id": "1-2-solve-route-type-example",
              "title": "Type the example, one line at a time.",
              "body": "Start on line 1. Use the line numbers below and Run after each command.",
              "task": "Type each command on its numbered line. Keep the editor free of blank lines above the first command.",
              "example": "forward(90)\nleft(90)\nforward(50)\nleft(90)\nforward(90)",
              "numbered": true,
              "focusLines": [
                1,
                2,
                3,
                4,
                5
              ],
              "phase": "Type the example"
            },
            {
              "id": "1-2-solve-route-edit",
              "title": "Close the route.",
              "body": "Change one property, then compare the output.",
              "task": "Keep lines 1–5. On line 6 type left(90), then on line 7 type forward(50). Run to return to the start.",
              "focusLines": [
                6,
                7
              ],
              "phase": "Change specific lines"
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
              "lab": "forward(70)\nleft(90)\nforward(30)\nleft(90)\nforward(70)",
              "phase": "Check understanding"
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
              "lab": "forward(50)\nbackward(50)",
              "phase": "Check understanding"
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
              "id": "1-2-solve-route-transfer",
              "title": "Required: Close a different route.",
              "body": "Complete this fixed target and pass Check assignment before starting your own design. This assignment has its own saved code. First type the numbered starting program below, then make the required changes.",
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
              "tip": "Use Step to find the first command whose result differs from your prediction.",
              "phase": "Required assignment",
              "focusLines": [
                1,
                2,
                3,
                4,
                5
              ],
              "typed": true,
              "numbered": true
            },
            {
              "title": "Choice: build your own drawing.",
              "body": "Choose your own design using the skills from this lesson. The visual examples are inspiration; the requirements below are what gets checked.",
              "task": "Build from a blank editor. Requirements: 5+ visible movement segments; Use both left() and right(); 2 different movement distances. Run, then Check my code.",
              "phase": "Create your own",
              "id": "1-2-solve-route-choice",
              "lab": "\n",
              "typed": true
            }
          ],
          "group": "Movement",
          "objective": "Track position and heading separately",
          "purpose": "Track where each command leaves the turtle so you can close shapes and later build reusable shape functions.",
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
          ]
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
          "starter": "",
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
              "id": "1-3-create-route-type-example",
              "title": "Type the example, one line at a time.",
              "body": "Start on line 1. Use the line numbers below and Run after each command.",
              "task": "Type each command on its numbered line. Keep the editor free of blank lines above the first command.",
              "example": "forward(40)\nleft(90)\nforward(20)",
              "numbered": true,
              "focusLines": [
                1,
                2,
                3
              ],
              "phase": "Type the example"
            },
            {
              "id": "1-3-create-route-edit",
              "title": "Change both distances.",
              "body": "Change one property, then compare the output.",
              "task": "In the example, change line 1 to forward(80) and line 3 to forward(40). Keep line 2 unchanged. Run.",
              "focusLines": [
                1,
                3
              ],
              "phase": "Change specific lines"
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
              "lab": "forward(40)\nleft(90)\nforward(20)",
              "phase": "Check understanding"
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
              "lab": "forward(20)\nleft(90)\nforward(20)\nleft(90)\nforward(20)",
              "phase": "Check understanding"
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
              "id": "1-3-create-route-transfer",
              "title": "Required: Plan a route before typing.",
              "body": "Complete this fixed target and pass Check assignment before starting your own design. This assignment has its own saved code. First type the numbered starting program below, then make the required changes.",
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
              "tip": "Use Step to find the first command whose result differs from your prediction.",
              "phase": "Required assignment",
              "focusLines": [
                1,
                2,
                3,
                4,
                5
              ],
              "typed": true,
              "numbered": true
            },
            {
              "title": "Choice: build your own drawing.",
              "body": "Choose your own design using the skills from this lesson. The visual examples are inspiration; the requirements below are what gets checked.",
              "task": "Build from a blank editor. Requirements: 5+ visible movement segments; Use both left() and right(); 2 different movement distances. Run, then Check my code.",
              "phase": "Create your own",
              "id": "1-3-create-route-choice",
              "lab": "\n",
              "typed": true
            }
          ],
          "group": "Movement",
          "objective": "Track position and heading separately",
          "purpose": "Combine movements and turns deliberately so you can design a route and later express repeated sections with loops."
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
          "starter": "",
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
              "id": "1-4-make-bubbles-type-example",
              "title": "Type the example, one line at a time.",
              "body": "Start on line 1. Use the line numbers below and Run after each command.",
              "task": "Type each command on its numbered line. Keep the editor free of blank lines above the first command.",
              "example": "circle(25)\nforward(45)\ncircle(35)",
              "numbered": true,
              "focusLines": [
                1,
                2,
                3
              ],
              "phase": "Type the example"
            },
            {
              "id": "1-4-make-bubbles-edit",
              "title": "Change size, then spacing.",
              "body": "Change one property, then compare the output.",
              "task": "Change line 1 to circle(50). Run. Restore circle(25), then change line 2 to forward(80) and Run again.",
              "focusLines": [
                1,
                2
              ],
              "phase": "Change specific lines"
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
              "lab": "circle(20)",
              "phase": "Check understanding"
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
              "lab": "circle(20)\ncircle(40)",
              "phase": "Check understanding"
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
              "id": "1-4-make-bubbles-transfer",
              "title": "Required: Make two equal, separated circles.",
              "body": "Complete this fixed target and pass Check assignment before starting your own design. This assignment has its own saved code. First type the numbered starting program below, then make the required changes.",
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
              "tip": "Use Step to find the first command whose result differs from your prediction.",
              "phase": "Required assignment",
              "focusLines": [
                1,
                2,
                3
              ],
              "typed": true,
              "numbered": true
            },
            {
              "title": "Choice: build your own drawing.",
              "body": "Choose your own design using the skills from this lesson. The visual examples are inspiration; the requirements below are what gets checked.",
              "task": "Build from a blank editor. Requirements: 4 circles; Circles grow each time; 3+ moves between bubbles; At least 1 turn. Run, then Check my code.",
              "phase": "Create your own",
              "id": "1-4-make-bubbles-choice",
              "lab": "\n",
              "typed": true
            }
          ],
          "group": "Circles + Patterns",
          "objective": "Use radius and spacing deliberately",
          "purpose": "Control radius and spacing separately so you can build patterns and later change their size with parameters."
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
          "starter": "",
          "steps": [
            {
              "id": "1-5-solve-bubbles-type-example",
              "title": "Type the example, one line at a time.",
              "body": "Start on line 1. Use the line numbers below and Run after each command.",
              "task": "Type each command on its numbered line. Keep the editor free of blank lines above the first command.",
              "example": "circle(20)\nforward(40)\ncircle(30)\nforward(70)\ncircle(40)\nforward(40)\ncircle(50)",
              "numbered": true,
              "focusLines": [
                1,
                2,
                3,
                4,
                5,
                6,
                7
              ],
              "phase": "Type the example"
            },
            {
              "id": "1-5-solve-bubbles-edit",
              "title": "Change spacing on line 2.",
              "body": "Change one property, then compare the output.",
              "task": "On line 2 replace forward(40) with forward(60). Leave circle sizes unchanged. Run and compare the first gap.",
              "focusLines": [
                2
              ],
              "phase": "Change specific lines"
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
              "lab": "circle(15)\nforward(50)\ncircle(30)\nforward(50)\ncircle(45)",
              "phase": "Check understanding"
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
              "lab": "circle(15)\nforward(55)\nleft(30)\ncircle(30)",
              "phase": "Check understanding"
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
              "id": "1-5-solve-bubbles-transfer",
              "title": "Required: Repair only one radius.",
              "body": "Complete this fixed target and pass Check assignment before starting your own design. This assignment has its own saved code. First type the numbered starting program below, then make the required changes.",
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
              "tip": "Use Step to find the first command whose result differs from your prediction.",
              "phase": "Required assignment",
              "focusLines": [
                1,
                2,
                3,
                4,
                5
              ],
              "typed": true,
              "numbered": true
            },
            {
              "title": "Choice: build your own drawing.",
              "body": "Choose your own design using the skills from this lesson. The visual examples are inspiration; the requirements below are what gets checked.",
              "task": "Build from a blank editor. Requirements: 5+ circles; 3 different circle sizes; Change direction. Run, then Check my code.",
              "phase": "Create your own",
              "id": "1-5-solve-bubbles-choice",
              "lab": "\n",
              "typed": true
            }
          ],
          "group": "Circles + Patterns",
          "objective": "Use radius and spacing deliberately",
          "purpose": "Find relationships between circle sizes and spacing so you can later generate patterns with variables and loops.",
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
          ]
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
          "starter": "",
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
              "id": "1-6-create-bubbles-type-example",
              "title": "Type the example, one line at a time.",
              "body": "Start on line 1. Use the line numbers below and Run after each command.",
              "task": "Type each command on its numbered line. Keep the editor free of blank lines above the first command.",
              "example": "circle(15)\nforward(45)\ncircle(30)",
              "numbered": true,
              "focusLines": [
                1,
                2,
                3
              ],
              "phase": "Type the example"
            },
            {
              "id": "1-6-create-bubbles-edit",
              "title": "Change radius on line 1.",
              "body": "Change one property, then compare the output.",
              "task": "On line 1 replace circle(15) with circle(20). Leave lines 2–3 unchanged. Run and compare the first circle.",
              "focusLines": [
                1
              ],
              "phase": "Change specific lines"
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
              "lab": "circle(15)\nforward(45)\ncircle(30)",
              "phase": "Check understanding"
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
              "lab": "left(90)\ncircle(20)",
              "phase": "Check understanding"
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
              "id": "1-6-create-bubbles-transfer",
              "title": "Required: Compare size with spacing.",
              "body": "Complete this fixed target and pass Check assignment before starting your own design. This assignment has its own saved code. First type the numbered starting program below, then make the required changes.",
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
              "tip": "Use Step to find the first command whose result differs from your prediction.",
              "phase": "Required assignment",
              "focusLines": [
                1,
                2,
                3
              ],
              "typed": true,
              "numbered": true
            },
            {
              "title": "Choice: build your own drawing.",
              "body": "Choose your own design using the skills from this lesson. The visual examples are inspiration; the requirements below are what gets checked.",
              "task": "Build from a blank editor. Requirements: 5+ circles; 3 different circle sizes; Change direction. Run, then Check my code.",
              "phase": "Create your own",
              "id": "1-6-create-bubbles-choice",
              "lab": "\n",
              "typed": true
            }
          ],
          "group": "Circles + Patterns",
          "objective": "Use radius and spacing deliberately",
          "purpose": "Plan circle size and placement so you can later reuse a drawing function at different sizes."
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
          "starter": "",
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
              "id": "1-7-make-sequence-type-example",
              "title": "Type the example, one line at a time.",
              "body": "Start on line 1. Use the line numbers below and Run after each command.",
              "task": "Type each command on its numbered line. Keep the editor free of blank lines above the first command.",
              "example": "forward(60)\nleft(90)\nforward(30)\nright(90)\nforward(20)",
              "numbered": true,
              "focusLines": [
                1,
                2,
                3,
                4,
                5
              ],
              "phase": "Type the example"
            },
            {
              "id": "1-7-make-sequence-edit",
              "title": "Swap lines 1 and 2.",
              "body": "Change one property, then compare the output.",
              "task": "Put left(90) on line 1 and forward(60) on line 2. Keep lines 3–5 unchanged. Run and compare the first segment.",
              "focusLines": [
                1,
                2
              ],
              "phase": "Change specific lines"
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
              "lab": "forward(30)\nleft(90)\nforward(20)",
              "phase": "Check understanding"
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
              "lab": "left(90)\nforward(30)\nright(90)",
              "phase": "Check understanding"
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
              "id": "1-7-make-sequence-transfer",
              "title": "Required: Same commands, different result.",
              "body": "Complete this fixed target and pass Check assignment before starting your own design. This assignment has its own saved code. First type the numbered starting program below, then make the required changes.",
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
              "tip": "Use Step to find the first command whose result differs from your prediction.",
              "phase": "Required assignment",
              "focusLines": [
                1,
                2,
                3
              ],
              "typed": true,
              "numbered": true
            },
            {
              "title": "Choice: build your own drawing.",
              "body": "Choose your own design using the skills from this lesson. The visual examples are inspiration; the requirements below are what gets checked.",
              "task": "Build from a blank editor. Requirements: Exactly 5 Turtle commands; 3 movement commands; 2 turn commands; Movement and turns alternate. Run, then Check my code.",
              "phase": "Create your own",
              "id": "1-7-make-sequence-choice",
              "lab": "\n",
              "typed": true
            }
          ],
          "group": "Sequence + Debugging",
          "objective": "Trace order and isolate errors",
          "purpose": "Read commands in execution order so you can predict what longer programs will do."
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
          "starter": "",
          "steps": [
            {
              "id": "1-8-solve-debug-type-example",
              "title": "Type the example, one line at a time.",
              "body": "This example contains three deliberate syntax errors. Type the numbered program, then Run to see the first error.",
              "task": "Type lines 1–5 exactly as shown, including the mistakes. The next step repairs them.",
              "example": "forword(70)\nleft(90\nforward(40)\nrite(90)\nforward(70)",
              "numbered": true,
              "focusLines": [
                1,
                2,
                3,
                4,
                5
              ],
              "phase": "Type the example"
            },
            {
              "id": "1-8-solve-debug-edit",
              "title": "Repair lines 1, 2 and 4.",
              "body": "Change one property, then compare the output.",
              "task": "On line 1 change forword(70) to forward(70). On line 2 add the closing parenthesis: left(90). On line 4 change rite(90) to right(90). Run after each repair and read the next error.",
              "focusLines": [
                1,
                2,
                4
              ],
              "phase": "Change specific lines"
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
              "lab": "forwad(30)",
              "phase": "Check understanding"
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
              "lab": "forward(30\nleft(90)",
              "phase": "Check understanding"
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
              "id": "1-8-solve-debug-transfer",
              "title": "Required: A program can run and still be wrong.",
              "body": "Complete this fixed target and pass Check assignment before starting your own design. This assignment has its own saved code. First type the numbered starting program below, then make the required changes.",
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
              "tip": "Use Step to find the first command whose result differs from your prediction.",
              "phase": "Required assignment",
              "focusLines": [
                1,
                2,
                3,
                4,
                5
              ],
              "typed": true,
              "numbered": true
            },
            {
              "title": "Choice: build your own drawing.",
              "body": "Choose your own design using the skills from this lesson. The visual examples are inspiration; the requirements below are what gets checked.",
              "task": "Build from a blank editor. Requirements: Exactly 5 Turtle commands; At least 2 visible drawing commands. Run, then Check my code.",
              "phase": "Create your own",
              "id": "1-8-solve-debug-choice",
              "lab": "\n",
              "typed": true
            }
          ],
          "group": "Sequence + Debugging",
          "objective": "Trace order and isolate errors",
          "purpose": "Find the first incorrect command so you can debug longer programs one change at a time.",
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
          ]
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
          "starter": "",
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
              "id": "1-9-create-five-lines-type-example",
              "title": "Type the example, one line at a time.",
              "body": "Start on line 1. Use the line numbers below and Run after each command.",
              "task": "Type each command on its numbered line. Keep the editor free of blank lines above the first command.",
              "example": "forward(20)\nforward(20)\nleft(90)\nleft(90)\nleft(90)",
              "numbered": true,
              "focusLines": [
                1,
                2,
                3,
                4,
                5
              ],
              "phase": "Type the example"
            },
            {
              "id": "1-9-create-five-lines-edit",
              "title": "Change distance on line 1.",
              "body": "Change one property, then compare the output.",
              "task": "On line 1 replace forward(20) with forward(60). Leave lines 2–5 unchanged. Run and compare the first segment.",
              "focusLines": [
                1
              ],
              "phase": "Change specific lines"
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
              "lab": "forward(20)\nforward(20)\nleft(90)\nleft(90)\nleft(90)",
              "phase": "Check understanding"
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
              "lab": "forward(20)\nleft(90)\nforward(20)\nright(90)\nforward(20)",
              "phase": "Check understanding"
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
              "id": "1-9-create-five-lines-transfer",
              "title": "Required: Design within a constraint.",
              "body": "Complete this fixed target and pass Check assignment before starting your own design. This assignment has its own saved code. First type the numbered starting program below, then make the required changes.",
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
              "tip": "Use Step to find the first command whose result differs from your prediction.",
              "phase": "Required assignment",
              "focusLines": [
                1,
                2,
                3,
                4,
                5
              ],
              "typed": true,
              "numbered": true
            },
            {
              "title": "Choice: build your own drawing.",
              "body": "Choose your own design using the skills from this lesson. The visual examples are inspiration; the requirements below are what gets checked.",
              "task": "Build from a blank editor. Requirements: Exactly 5 Turtle commands; At least 2 visible drawing commands. Run, then Check my code.",
              "phase": "Create your own",
              "id": "1-9-create-five-lines-choice",
              "lab": "\n",
              "typed": true
            }
          ],
          "group": "Sequence + Debugging",
          "objective": "Trace order and isolate errors",
          "purpose": "Choose commands deliberately so you can later simplify repeated work with loops and functions."
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
          "starter": "",
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
              "id": "1-10-make-color-type-example",
              "title": "Type the example, one line at a time.",
              "body": "Start on line 1. Use the line numbers below and Run after each command.",
              "task": "Type each command on its numbered line. Keep the editor free of blank lines above the first command.",
              "example": "bgcolor(\"black\")\ncolor(\"cyan\")\npensize(6)\nforward(70)",
              "numbered": true,
              "focusLines": [
                1,
                2,
                3,
                4
              ],
              "phase": "Type the example"
            },
            {
              "id": "1-10-make-color-edit",
              "title": "Add a styled segment.",
              "body": "Change one property, then compare the output.",
              "task": "On line 5 type right(60). On line 6 type color(\"yellow\"). On line 7 type forward(35). Run.",
              "focusLines": [
                5,
                6,
                7
              ],
              "phase": "Change specific lines"
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
              "lab": "color(\"cyan\")\nforward(40)\ncolor(\"yellow\")",
              "phase": "Check understanding"
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
              "lab": "pensize(10)\nforward(30)\npensize(2)\nforward(30)",
              "phase": "Check understanding"
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
              "id": "1-10-make-color-transfer",
              "title": "Required: Control each stroke.",
              "body": "Complete this fixed target and pass Check assignment before starting your own design. This assignment has its own saved code. First type the numbered starting program below, then make the required changes.",
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
              "tip": "Use Step to find the first command whose result differs from your prediction.",
              "phase": "Required assignment",
              "focusLines": [
                1,
                2,
                3,
                4,
                5,
                6
              ],
              "typed": true,
              "numbered": true
            },
            {
              "title": "Choice: build your own drawing.",
              "body": "Choose your own design using the skills from this lesson. The visual examples are inspiration; the requirements below are what gets checked.",
              "task": "Build from a blank editor. Requirements: Dark background; 3 drawing colors; 2 line thicknesses; 5+ bolt segments; 4+ turns. Run, then Check my code.",
              "phase": "Create your own",
              "id": "1-10-make-color-choice",
              "lab": "\n",
              "typed": true
            }
          ],
          "group": "Color + Style",
          "objective": "Control style before drawing",
          "purpose": "Place color and width changes before drawing so you can later style reusable shapes."
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
          "starter": "",
          "steps": [
            {
              "id": "1-11-solve-style-type-example",
              "title": "Type the example, one line at a time.",
              "body": "Start on line 1. Use the line numbers below and Run after each command.",
              "task": "Type each command on its numbered line. Keep the editor free of blank lines above the first command.",
              "example": "bgcolor(\"black\")\ncolor(\"black\")\npensize(1)\nforward(70)\nright(60)\ncolor(\"cyan\")\nforward(35)\nleft(120)\nforward(60)",
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
                9
              ],
              "phase": "Type the example"
            },
            {
              "id": "1-11-solve-style-edit",
              "title": "Repair the first stroke.",
              "body": "Change one property, then compare the output.",
              "task": "On line 2 replace color(\"black\") with color(\"yellow\"). On line 3 change pensize(1) to pensize(6). Run.",
              "focusLines": [
                2,
                3
              ],
              "phase": "Change specific lines"
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
              "lab": "bgcolor(\"black\")\ncolor(\"black\")\nforward(40)",
              "phase": "Check understanding"
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
              "lab": "forward(40)\ncolor(\"red\")",
              "phase": "Check understanding"
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
              "id": "1-11-solve-style-transfer",
              "title": "Required: Repair appearance without changing geometry.",
              "body": "Complete this fixed target and pass Check assignment before starting your own design. This assignment has its own saved code. First type the numbered starting program below, then make the required changes.",
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
              "tip": "Use Step to find the first command whose result differs from your prediction.",
              "phase": "Required assignment",
              "focusLines": [
                1,
                2,
                3,
                4,
                5,
                6,
                7
              ],
              "typed": true,
              "numbered": true
            },
            {
              "title": "Choice: build your own drawing.",
              "body": "Choose your own design using the skills from this lesson. The visual examples are inspiration; the requirements below are what gets checked.",
              "task": "Build from a blank editor. Requirements: Set a background; 3 drawing colors; 2 line thicknesses; 6+ visible segments; 4+ turns. Run, then Check my code.",
              "phase": "Create your own",
              "id": "1-11-solve-style-choice",
              "lab": "\n",
              "typed": true
            }
          ],
          "group": "Color + Style",
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
          "objective": "Control style before drawing",
          "purpose": "Separate drawing geometry from appearance so you can repair a program without rebuilding its path."
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
          "starter": "",
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
              "id": "1-12-create-night-type-example",
              "title": "Type the example, one line at a time.",
              "body": "Start on line 1. Use the line numbers below and Run after each command.",
              "task": "Type each command on its numbered line. Keep the editor free of blank lines above the first command.",
              "example": "color(\"red\")\nforward(30)\ncolor(\"blue\")\nforward(30)",
              "numbered": true,
              "focusLines": [
                1,
                2,
                3,
                4
              ],
              "phase": "Type the example"
            },
            {
              "id": "1-12-create-night-edit",
              "title": "Change color on line 3.",
              "body": "Change one property, then compare the output.",
              "task": "On line 3 replace color(\"blue\") with color(\"yellow\"). Leave both forward(30) commands unchanged. Run.",
              "focusLines": [
                3
              ],
              "phase": "Change specific lines"
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
              "lab": "color(\"red\")\nforward(30)\ncolor(\"blue\")\nforward(30)",
              "phase": "Check understanding"
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
              "lab": "bgcolor(\"black\")\ncolor(\"cyan\")\nforward(30)\ncolor(\"yellow\")\nforward(30)",
              "phase": "Check understanding"
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
              "id": "1-12-create-night-transfer",
              "title": "Required: Change style; keep structure.",
              "body": "Complete this fixed target and pass Check assignment before starting your own design. This assignment has its own saved code. First type the numbered starting program below, then make the required changes.",
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
              "tip": "Use Step to find the first command whose result differs from your prediction.",
              "phase": "Required assignment",
              "focusLines": [
                1,
                2,
                3,
                4,
                5,
                6
              ],
              "typed": true,
              "numbered": true
            },
            {
              "title": "Choice: build your own drawing.",
              "body": "Choose your own design using the skills from this lesson. The visual examples are inspiration; the requirements below are what gets checked.",
              "task": "Build from a blank editor. Requirements: Set a background; 3 drawing colors; 2 line thicknesses; 6+ visible segments; 4+ turns. Run, then Check my code.",
              "phase": "Create your own",
              "id": "1-12-create-night-choice",
              "lab": "\n",
              "typed": true
            }
          ],
          "group": "Color + Style",
          "objective": "Control style before drawing",
          "purpose": "Combine geometry and drawing state so you can later build a badge from reusable functions."
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
          "starter": "",
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
              "id": "1-13-make-ascii-type-example",
              "title": "Type the example, one line at a time.",
              "body": "Start on line 1. Use the line numbers below and Run after each command.",
              "task": "Type each command on its numbered line. Keep the editor free of blank lines above the first command.",
              "example": "print(\"  ███  \")\nprint(\" █░░░█ \")",
              "numbered": true,
              "focusLines": [
                1,
                2
              ],
              "phase": "Type the example"
            },
            {
              "id": "1-13-make-ascii-edit",
              "title": "Edit the first printed row.",
              "body": "Change one property, then compare the output.",
              "task": "On line 1 replace the text inside the quotes with \" █▓▒░█ \". Keep print(), parentheses, and quotes. Run.",
              "focusLines": [
                1
              ],
              "phase": "Change specific lines"
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
              "lab": "print(\"█ █\")\nprint(\"███\")",
              "phase": "Check understanding"
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
              "lab": "print(\"  █  \")",
              "phase": "Check understanding"
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
              "id": "1-13-make-ascii-transfer",
              "title": "Required: Repair a hollow tile.",
              "body": "Complete this fixed target and pass Check assignment before starting your own design. This assignment has its own saved code. First type the numbered starting program below, then make the required changes.",
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
              "tip": "Use Step to find the first command whose result differs from your prediction.",
              "phase": "Required assignment",
              "focusLines": [
                1,
                2,
                3
              ],
              "typed": true,
              "numbered": true
            },
            {
              "title": "Choice: build your own text picture.",
              "body": "Choose your own design using the skills from this lesson. The visual examples are inspiration; the requirements below are what gets checked.",
              "task": "Build from a blank editor. Requirements: 5+ printed lines; 3 different lines; Use visual characters. Run, then Check my code.",
              "phase": "Create your own",
              "id": "1-13-make-ascii-choice",
              "lab": "\n",
              "typed": true
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
          "objective": "Use strings and spaces to communicate",
          "purpose": "Use quoted strings and spaces precisely so you can later build text displays with variables."
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
          "starter": "",
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
              "id": "1-14-solve-ascii-type-example",
              "title": "Type the example, one line at a time.",
              "body": "Start on line 1. Use the line numbers below and Run after each command.",
              "task": "Type each command on its numbered line. Keep the editor free of blank lines above the first command.",
              "example": "print(\"  ███\")\nprint(\" █   █ \")\nprint(\"█  █  █\")\nprint(\" █   █\")\nprint(\" ███   \")",
              "numbered": true,
              "focusLines": [
                1,
                2,
                3,
                4,
                5
              ],
              "phase": "Type the example"
            },
            {
              "id": "1-14-solve-ascii-edit",
              "title": "Repair matching rows.",
              "body": "Change one property, then compare the output.",
              "task": "On lines 1 and 5 use print(\"  ███  \"). On line 4 use print(\" █   █ \"). Leave lines 2–3 unchanged. Run.",
              "focusLines": [
                1,
                4,
                5
              ],
              "phase": "Change specific lines"
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
              "lab": "print(\"  ███  \")\nprint(\" █   █ \")",
              "phase": "Check understanding"
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
              "lab": "print(\" █ \")\nprint(\"█ █\")\nprint(\" █ \")",
              "phase": "Check understanding"
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
              "id": "1-14-solve-ascii-transfer",
              "title": "Required: Transfer the spacing idea.",
              "body": "Complete this fixed target and pass Check assignment before starting your own design. This assignment has its own saved code. First type the numbered starting program below, then make the required changes.",
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
              "tip": "Use Step to find the first command whose result differs from your prediction.",
              "phase": "Required assignment",
              "focusLines": [
                1,
                2,
                3
              ],
              "typed": true,
              "numbered": true
            },
            {
              "title": "Choice: build your own text picture.",
              "body": "Choose your own design using the skills from this lesson. The visual examples are inspiration; the requirements below are what gets checked.",
              "task": "Build from a blank editor. Requirements: 6+ printed rows; 4 different rows; Use visual characters; 30+ printed characters. Run, then Check my code.",
              "phase": "Create your own",
              "id": "1-14-solve-ascii-choice",
              "lab": "\n",
              "typed": true
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
          "objective": "Use strings and spaces to communicate",
          "purpose": "Trace spaces and characters in each string so you can later format program output accurately."
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
          "starter": "",
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
              "id": "1-15-create-ascii-type-example",
              "title": "Type the example, one line at a time.",
              "body": "Start on line 1. Use the line numbers below and Run after each command.",
              "task": "Type each command on its numbered line. Keep the editor free of blank lines above the first command.",
              "example": "print(\"[██░░]\")",
              "numbered": true,
              "focusLines": [
                1
              ],
              "phase": "Type the example"
            },
            {
              "id": "1-15-create-ascii-edit",
              "title": "Change the meter.",
              "body": "Change one property, then compare the output.",
              "task": "On line 1 change print(\"[██░░]\") to print(\"[███░]\"). Run and count the filled blocks.",
              "focusLines": [
                1
              ],
              "phase": "Change specific lines"
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
              "lab": "print(\"[██░░]\")",
              "phase": "Check understanding"
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
              "lab": "print(\"[██░░]\")\nprint(\"4 / 4\")",
              "phase": "Check understanding"
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
              "id": "unit-1-beacon",
              "title": "Unit 1 challenge: repair the signal beacon.",
              "body": "This program runs, but its drawing and printed meter need repairs. Use what you learned about order, movement, circles, style, and strings. First type the numbered starting program below, then make the required changes.",
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
              "tip": "Repair one property at a time. Keep a working version between changes.",
              "typed": true,
              "example": "bgcolor(\"black\")\ncolor(\"black\")\npensize(2)\nforward(60)\nleft(90)\nforward(40)\ncircle(15)\nprint(\"[██░░]\")\nprint(\"3 / 4\")",
              "numbered": true
            },
            {
              "id": "1-15-create-ascii-transfer",
              "title": "Required: Make the meter tell the truth.",
              "body": "Complete this fixed target and pass Check assignment before starting your own design. This assignment has its own saved code. First type the numbered starting program below, then make the required changes.",
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
              "tip": "Use Step to find the first command whose result differs from your prediction.",
              "phase": "Required assignment",
              "focusLines": [
                1,
                2,
                3
              ],
              "typed": true,
              "numbered": true
            },
            {
              "title": "Choice: build your own text picture.",
              "body": "Choose your own design using the skills from this lesson. The visual examples are inspiration; the requirements below are what gets checked.",
              "task": "Build from a blank editor. Requirements: 6+ printed rows; 4 different rows; Use visual characters; 30+ printed characters. Run, then Check my code.",
              "phase": "Create your own",
              "id": "1-15-create-ascii-choice",
              "lab": "\n",
              "typed": true
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
          "objective": "Use strings and spaces to communicate",
          "purpose": "Make text and visual information agree so you can later build changing status displays with variables."
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
