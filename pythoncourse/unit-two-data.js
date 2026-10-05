/* Loops curriculum; loaded after the shared course map. */
(function(){
  var unit = {
  "id": "unit-2",
  "number": "2",
  "title": "Loops + Repetition",
  "description": "Repeat working blocks, repair indentation, print ASCII textures, close polygons, and build nested rosettes. Two Make → Solve → Create sequences with checked predictions and independent projects.",
  "lessons": [
    {
      "id": "2-1-make-loop",
      "number": "2.1",
      "title": "Make a Loop",
      "type": "Make",
      "available": true,
      "starter": "",
      "draftVersion": "loops-v1",
      "contentVersion": "loops-v1",
      "purpose": "Repeat a working block. Learn how range() and indentation control its repeats.",
      "objective": "Repeat a working block. Learn how range() and indentation control its repeats.",
      "notes": "Students type from a blank editor. Check the single repeat before increasing its count. Conference: identify the block, trace one repeat, and predict one deliberate edit. A mistaken first prediction remains saved. Judge creative choices through discussion; the checker grades listed requirements. Only literal range loops and commands are introduced here; variables and functions come later.",
      "check": {
        "execution": true,
        "rules": [
          {
            "type": "loopStructure",
            "label": "Use a running range loop",
            "fail": "Use for NAME in range(COUNT): with an indented block. Counts must be 2–60. Use literal command values in this unit.",
            "min": 1,
            "depth": 1,
            "minCount": 4
          },
          {
            "type": "drawnMoves",
            "label": "8+ drawn moves",
            "fail": "Make each repeat draw a visible section.",
            "count": 8
          },
          {
            "type": "visibleCorners",
            "label": "7+ visible corners",
            "fail": "Place turns between drawn moves.",
            "count": 7
          },
          {
            "type": "drawingBounds",
            "label": "Stay inside the grid",
            "fail": "Reduce distances or repeat count.",
            "limit": 185
          }
        ]
      },
      "steps": [
        {
          "id": "2-1-make-loop-type",
          "phase": "Type the example",
          "title": "Type and run.",
          "task": "Type lines 1–4. Run. Add the same four lines again on lines 5–8. Run: you now have two stairs.",
          "draftId": "example",
          "example": "forward(25)\nleft(90)\nforward(25)\nright(90)",
          "numbered": true,
          "focusLines": [
            1,
            2,
            3,
            4
          ],
          "body": ""
        },
        {
          "id": "2-1-make-loop-transform",
          "phase": "Change one thing",
          "title": "Build the repeated block.",
          "task": "Replace the repeated code with this five-line loop. Use four spaces before lines 2–5. Run; one indented block makes one stair, four times.",
          "draftId": "example",
          "example": "for step in range(4):\n    forward(25)\n    left(90)\n    forward(25)\n    right(90)",
          "numbered": true,
          "body": "range(n) runs the block n times. The name after for labels the repeat; it is not a Turtle command. A colon starts the block. Indentation shows which commands belong to it.",
          "focusLines": [
            1,
            2,
            3,
            4,
            5
          ]
        },
        {
          "id": "2-1-make-loop-edit",
          "phase": "Change one thing",
          "title": "Test a change.",
          "task": "Change range(4) to range(6). Run.",
          "body": "The loop count changes how many stairs appear; the distances still control each stair.",
          "draftId": "example"
        },
        {
          "id": "2-1-make-loop-predict0",
          "phase": "Predict + run",
          "title": "Predict the result.",
          "task": "Choose an answer, check, then inspect the run.",
          "draftId": "prediction-0",
          "lab": "for step in range(4):\n    forward(25)\n    left(90)\n    forward(25)\n    right(90)",
          "example": "for step in range(4):\n    forward(25)\n    left(90)\n    forward(25)\n    right(90)",
          "numbered": true,
          "question": {
            "id": "2-1-make-loop-q0",
            "prompt": "How many forward() commands execute?",
            "choices": [
              "4",
              "8",
              "16"
            ],
            "answer": 1,
            "explanation": "Each of four repeats executes two forward commands."
          }
        },
        {
          "id": "2-1-make-loop-predict1",
          "phase": "Predict + run",
          "title": "Predict the result.",
          "task": "Choose an answer, check, then inspect the run.",
          "draftId": "prediction-1",
          "lab": "for step in range(4):\n    forward(25)\n    left(90)\n    forward(25)\n    right(90)\ncircle(10)",
          "example": "for step in range(4):\n    forward(25)\n    left(90)\n    forward(25)\n    right(90)\ncircle(10)",
          "numbered": true,
          "question": {
            "id": "2-1-make-loop-q1",
            "prompt": "Which command runs only once?",
            "choices": [
              "forward(25)",
              "right(90)",
              "circle(10)"
            ],
            "answer": 2,
            "explanation": "circle(10) is outside the indented block."
          }
        },
        {
          "id": "2-1-make-loop-observe",
          "phase": "Record an observation",
          "title": "Save what changed.",
          "task": "Compare the two versions you tested. Record the line you changed and what happened.",
          "draftId": "example",
          "response": {
            "id": "2-1-make-loop-observation",
            "prompt": "Which line did you change, and what visible result changed?",
            "placeholder": "I changed ___ from ___ to ___. The result ___."
          }
        },
        {
          "id": "2-1-make-loop-required",
          "phase": "Required assignment",
          "title": "Build the required result.",
          "task": "Build exactly five stairs, each 20 right and 20 up. Finish at (100, 100), facing right.",
          "draftId": "assignment-required",
          "typed": true,
          "check": {
            "execution": true,
            "rules": [
              {
                "type": "loopStructure",
                "label": "Use a running range loop",
                "fail": "Use for NAME in range(COUNT): with an indented block. Counts must be 2–60. Use literal command values in this unit.",
                "min": 1,
                "depth": 1
              },
              {
                "type": "exactCalls",
                "label": "10 executed forward commands",
                "fail": "Compare the number of repeated forward commands with the target.",
                "commands": [
                  "forward"
                ],
                "count": 10
              },
              {
                "type": "exactCalls",
                "label": "5 executed left commands",
                "fail": "Compare the number of repeated left commands with the target.",
                "commands": [
                  "left"
                ],
                "count": 5
              },
              {
                "type": "exactCalls",
                "label": "5 executed right commands",
                "fail": "Compare the number of repeated right commands with the target.",
                "commands": [
                  "right"
                ],
                "count": 5
              },
              {
                "type": "finalPosition",
                "label": "Finish at (100, 100)",
                "fail": "Check the movement and which commands are inside the loop.",
                "x": 100,
                "y": 100,
                "tolerance": 1
              }
            ]
          },
          "requirements": [
            "Use a running range loop",
            "10 executed forward commands",
            "5 executed left commands",
            "5 executed right commands",
            "Finish at (100, 100)"
          ],
          "visuals": [
            {
              "label": "Required result",
              "caption": "Match these requirements.",
              "paths": [
                {
                  "points": [
                    [
                      44.0,
                      86.0
                    ],
                    [
                      58.4,
                      86.0
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      58.4,
                      86.0
                    ],
                    [
                      58.4,
                      71.6
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      58.4,
                      71.6
                    ],
                    [
                      72.8,
                      71.6
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      72.8,
                      71.6
                    ],
                    [
                      72.8,
                      57.2
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      72.8,
                      57.2
                    ],
                    [
                      87.2,
                      57.2
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      87.2,
                      57.2
                    ],
                    [
                      87.2,
                      42.8
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      87.2,
                      42.8
                    ],
                    [
                      101.6,
                      42.8
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      101.6,
                      42.8
                    ],
                    [
                      101.6,
                      28.4
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      101.6,
                      28.4
                    ],
                    [
                      116.0,
                      28.4
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      116.0,
                      28.4
                    ],
                    [
                      116.0,
                      14.0
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                }
              ],
              "circles": [],
              "previewCode": "for step in range(5):\n    forward(20)\n    left(90)\n    forward(20)\n    right(90)"
            }
          ],
          "tip": "Check the repeat count, the turn, and the indentation separately. Run after each repair."
        },
        {
          "id": "2-1-make-loop-project",
          "phase": "Create your own",
          "title": "Make your own design.",
          "task": "Create a staircase, skyline edge, or zigzag trail. Repeat a block at least four times; draw at least eight moves and eight turns.",
          "draftId": "project",
          "typed": true,
          "requirements": [
            "Use a running range loop",
            "8+ drawn moves",
            "7+ visible corners",
            "Stay inside the grid"
          ],
          "visuals": [
            {
              "label": "Design A",
              "caption": "One possible design.",
              "paths": [
                {
                  "points": [
                    [
                      15.0,
                      85.45
                    ],
                    [
                      41.0,
                      85.45
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      41.0,
                      85.45
                    ],
                    [
                      41.0,
                      71.27
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      41.0,
                      71.27
                    ],
                    [
                      67.0,
                      71.27
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      67.0,
                      71.27
                    ],
                    [
                      67.0,
                      57.09
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      67.0,
                      57.09
                    ],
                    [
                      93.0,
                      57.09
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      93.0,
                      57.09
                    ],
                    [
                      93.0,
                      42.91
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      93.0,
                      42.91
                    ],
                    [
                      119.0,
                      42.91
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      119.0,
                      42.91
                    ],
                    [
                      119.0,
                      28.73
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      119.0,
                      28.73
                    ],
                    [
                      145.0,
                      28.73
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      145.0,
                      28.73
                    ],
                    [
                      145.0,
                      14.55
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                }
              ],
              "circles": [],
              "previewCode": "for step in range(5):\n    forward(22)\n    left(90)\n    forward(12)\n    right(90)"
            },
            {
              "label": "Design B",
              "caption": "One possible design.",
              "paths": [
                {
                  "points": [
                    [
                      15.0,
                      58.12
                    ],
                    [
                      31.25,
                      41.88
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      31.25,
                      41.88
                    ],
                    [
                      47.5,
                      58.12
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      47.5,
                      58.12
                    ],
                    [
                      63.75,
                      41.88
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      63.75,
                      41.88
                    ],
                    [
                      80.0,
                      58.12
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      80.0,
                      58.12
                    ],
                    [
                      96.25,
                      41.88
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      96.25,
                      41.88
                    ],
                    [
                      112.5,
                      58.12
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      112.5,
                      58.12
                    ],
                    [
                      128.75,
                      41.88
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      128.75,
                      41.88
                    ],
                    [
                      145.0,
                      58.12
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                }
              ],
              "circles": [],
              "previewCode": "for step in range(4):\n    left(45)\n    forward(25)\n    right(90)\n    forward(25)\n    left(45)"
            }
          ],
          "tip": "Start with one working motif. Repeat it, then change one property at a time."
        }
      ],
      "visuals": [
        {
          "label": "Design A",
          "caption": "One possible design.",
          "paths": [
            {
              "points": [
                [
                  15.0,
                  85.45
                ],
                [
                  41.0,
                  85.45
                ]
              ],
              "stroke": "#202525",
              "width": 2
            },
            {
              "points": [
                [
                  41.0,
                  85.45
                ],
                [
                  41.0,
                  71.27
                ]
              ],
              "stroke": "#202525",
              "width": 2
            },
            {
              "points": [
                [
                  41.0,
                  71.27
                ],
                [
                  67.0,
                  71.27
                ]
              ],
              "stroke": "#202525",
              "width": 2
            },
            {
              "points": [
                [
                  67.0,
                  71.27
                ],
                [
                  67.0,
                  57.09
                ]
              ],
              "stroke": "#202525",
              "width": 2
            },
            {
              "points": [
                [
                  67.0,
                  57.09
                ],
                [
                  93.0,
                  57.09
                ]
              ],
              "stroke": "#202525",
              "width": 2
            },
            {
              "points": [
                [
                  93.0,
                  57.09
                ],
                [
                  93.0,
                  42.91
                ]
              ],
              "stroke": "#202525",
              "width": 2
            },
            {
              "points": [
                [
                  93.0,
                  42.91
                ],
                [
                  119.0,
                  42.91
                ]
              ],
              "stroke": "#202525",
              "width": 2
            },
            {
              "points": [
                [
                  119.0,
                  42.91
                ],
                [
                  119.0,
                  28.73
                ]
              ],
              "stroke": "#202525",
              "width": 2
            },
            {
              "points": [
                [
                  119.0,
                  28.73
                ],
                [
                  145.0,
                  28.73
                ]
              ],
              "stroke": "#202525",
              "width": 2
            },
            {
              "points": [
                [
                  145.0,
                  28.73
                ],
                [
                  145.0,
                  14.55
                ]
              ],
              "stroke": "#202525",
              "width": 2
            }
          ],
          "circles": [],
          "previewCode": "for step in range(5):\n    forward(22)\n    left(90)\n    forward(12)\n    right(90)"
        },
        {
          "label": "Design B",
          "caption": "One possible design.",
          "paths": [
            {
              "points": [
                [
                  15.0,
                  58.12
                ],
                [
                  31.25,
                  41.88
                ]
              ],
              "stroke": "#202525",
              "width": 2
            },
            {
              "points": [
                [
                  31.25,
                  41.88
                ],
                [
                  47.5,
                  58.12
                ]
              ],
              "stroke": "#202525",
              "width": 2
            },
            {
              "points": [
                [
                  47.5,
                  58.12
                ],
                [
                  63.75,
                  41.88
                ]
              ],
              "stroke": "#202525",
              "width": 2
            },
            {
              "points": [
                [
                  63.75,
                  41.88
                ],
                [
                  80.0,
                  58.12
                ]
              ],
              "stroke": "#202525",
              "width": 2
            },
            {
              "points": [
                [
                  80.0,
                  58.12
                ],
                [
                  96.25,
                  41.88
                ]
              ],
              "stroke": "#202525",
              "width": 2
            },
            {
              "points": [
                [
                  96.25,
                  41.88
                ],
                [
                  112.5,
                  58.12
                ]
              ],
              "stroke": "#202525",
              "width": 2
            },
            {
              "points": [
                [
                  112.5,
                  58.12
                ],
                [
                  128.75,
                  41.88
                ]
              ],
              "stroke": "#202525",
              "width": 2
            },
            {
              "points": [
                [
                  128.75,
                  41.88
                ],
                [
                  145.0,
                  58.12
                ]
              ],
              "stroke": "#202525",
              "width": 2
            }
          ],
          "circles": [],
          "previewCode": "for step in range(4):\n    left(45)\n    forward(25)\n    right(90)\n    forward(25)\n    left(45)"
        }
      ],
      "outputMode": "drawing"
    },
    {
      "id": "2-2-solve-loop",
      "number": "2.2",
      "title": "Loop Repair Shop",
      "type": "Solve",
      "available": true,
      "starter": "",
      "draftVersion": "loops-v1",
      "contentVersion": "loops-v1",
      "purpose": "Use indentation to decide what repeats and what happens once.",
      "objective": "Use indentation to decide what repeats and what happens once.",
      "notes": "Students type from a blank editor. Check the single repeat before increasing its count. Conference: identify the block, trace one repeat, and predict one deliberate edit. A mistaken first prediction remains saved. Judge creative choices through discussion; the checker grades listed requirements. Only literal range loops and commands are introduced here; variables and functions come later.",
      "check": {
        "execution": true,
        "rules": [
          {
            "type": "loopStructure",
            "label": "Use a running range loop",
            "fail": "Use for NAME in range(COUNT): with an indented block. Counts must be 2–60. Use literal command values in this unit.",
            "min": 1,
            "depth": 1
          },
          {
            "type": "minCalls",
            "label": "4+ sides",
            "fail": "Repeat a side and a turn.",
            "commands": [
              "forward"
            ],
            "count": 4
          },
          {
            "type": "exactCalls",
            "label": "1 executed circle commands",
            "fail": "Compare the number of repeated circle commands with the target.",
            "commands": [
              "circle"
            ],
            "count": 1
          },
          {
            "type": "finalPosition",
            "label": "Finish at (0, 0)",
            "fail": "Check the movement and which commands are inside the loop.",
            "x": 0,
            "y": 0,
            "tolerance": 1
          },
          {
            "type": "closedOutline",
            "label": "Closed outline",
            "fail": "Draw a closed frame with area.",
            "ignoreCircles": true
          }
        ]
      },
      "steps": [
        {
          "id": "2-2-solve-loop-type",
          "phase": "Type the example",
          "title": "Type and run.",
          "task": "Type the example. Run. Four moves happen before the single turn.",
          "draftId": "example",
          "example": "for step in range(4):\n    forward(25)\nleft(90)",
          "numbered": true,
          "focusLines": [
            1,
            2,
            3
          ],
          "body": "Use four spaces for each indentation level. Run after the complete block is typed; a header without a body cannot run."
        },
        {
          "id": "2-2-solve-loop-transform",
          "phase": "Change one thing",
          "title": "Build the repeated block.",
          "task": "Indent line 3 by four spaces. Run. Now the turn repeats with the movement.",
          "draftId": "example",
          "example": "for step in range(4):\n    forward(25)\n    left(90)",
          "numbered": true,
          "body": "",
          "focusLines": [
            1,
            2,
            3
          ]
        },
        {
          "id": "2-2-solve-loop-edit",
          "phase": "Change one thing",
          "title": "Test a change.",
          "task": "Change range(4) to range(3). Run. Find the missing side.",
          "body": "A square needs four repetitions of a side and a quarter-turn.",
          "draftId": "example"
        },
        {
          "id": "2-2-solve-loop-predict0",
          "phase": "Predict + run",
          "title": "Predict the result.",
          "task": "Choose an answer, check, then inspect the run.",
          "draftId": "prediction-0",
          "lab": "for step in range(4):\n    forward(25)\nleft(90)",
          "example": "for step in range(4):\n    forward(25)\nleft(90)",
          "numbered": true,
          "question": {
            "id": "2-2-solve-loop-q0",
            "prompt": "In the first program, where does the turtle finish?",
            "choices": [
              "(25, 25)",
              "(100, 0)",
              "(0, 0)"
            ],
            "answer": 1,
            "explanation": "Only forward is indented; four 25-unit moves happen in the same direction."
          }
        },
        {
          "id": "2-2-solve-loop-predict1",
          "phase": "Predict + run",
          "title": "Predict the result.",
          "task": "Choose an answer, check, then inspect the run.",
          "draftId": "prediction-1",
          "lab": "for side in range(4):\n    forward(50)\n    left(90)\n    circle(8)",
          "example": "for side in range(4):\n    forward(50)\n    left(90)\n    circle(8)",
          "numbered": true,
          "question": {
            "id": "2-2-solve-loop-q1",
            "prompt": "What happens when circle(8) is indented?",
            "choices": [
              "One circle",
              "Four circles, one at each corner",
              "No circles"
            ],
            "answer": 1,
            "explanation": "The circle executes on every repeat, after the turn."
          }
        },
        {
          "id": "2-2-solve-loop-observe",
          "phase": "Record an observation",
          "title": "Save what changed.",
          "task": "Compare the two versions you tested. Record the line you changed and what happened.",
          "draftId": "example",
          "response": {
            "id": "2-2-solve-loop-observation",
            "prompt": "Which line did you change, and what visible result changed?",
            "placeholder": "I changed ___ from ___ to ___. The result ___."
          }
        },
        {
          "id": "2-2-solve-loop-required",
          "phase": "Required assignment",
          "title": "Build the required result.",
          "task": "Repair this program into a 60-unit square with exactly one radius-12 circle after the square closes. Keep a loop.",
          "draftId": "assignment-required",
          "typed": true,
          "check": {
            "execution": true,
            "rules": [
              {
                "type": "loopStructure",
                "label": "Use a running range loop",
                "fail": "Use for NAME in range(COUNT): with an indented block. Counts must be 2–60. Use literal command values in this unit.",
                "min": 1,
                "depth": 1
              },
              {
                "type": "exactCalls",
                "label": "4 executed forward commands",
                "fail": "Compare the number of repeated forward commands with the target.",
                "commands": [
                  "forward"
                ],
                "count": 4
              },
              {
                "type": "exactCalls",
                "label": "4 executed left commands",
                "fail": "Compare the number of repeated left commands with the target.",
                "commands": [
                  "left"
                ],
                "count": 4
              },
              {
                "type": "exactCalls",
                "label": "1 executed circle commands",
                "fail": "Compare the number of repeated circle commands with the target.",
                "commands": [
                  "circle"
                ],
                "count": 1
              },
              {
                "type": "finalPosition",
                "label": "Finish at (0, 0)",
                "fail": "Check the movement and which commands are inside the loop.",
                "x": 0,
                "y": 0,
                "tolerance": 1
              },
              {
                "type": "closedOutline",
                "label": "Closed outline",
                "fail": "Match the repeats to the turns.",
                "ignoreCircles": true
              }
            ]
          },
          "requirements": [
            "Use a running range loop",
            "4 executed forward commands",
            "4 executed left commands",
            "1 executed circle commands",
            "Finish at (0, 0)",
            "Closed outline"
          ],
          "visuals": [
            {
              "label": "Required result",
              "caption": "Match these requirements.",
              "paths": [
                {
                  "points": [
                    [
                      51.2,
                      86.0
                    ],
                    [
                      123.2,
                      86.0
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      123.2,
                      86.0
                    ],
                    [
                      123.2,
                      14.0
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      123.2,
                      14.0
                    ],
                    [
                      51.2,
                      14.0
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      51.2,
                      14.0
                    ],
                    [
                      51.2,
                      86.0
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                }
              ],
              "circles": [
                {
                  "cx": 51.199999999999996,
                  "cy": 71.6,
                  "r": 14.399999999999999,
                  "stroke": "#202525",
                  "width": 2
                }
              ],
              "previewCode": "for side in range(4):\n    forward(60)\n    left(90)\ncircle(12)"
            }
          ],
          "tip": "Check the repeat count, the turn, and the indentation separately. Run after each repair."
        },
        {
          "id": "2-2-solve-loop-project",
          "phase": "Create your own",
          "title": "Make your own design.",
          "task": "Design a loop-drawn frame with a single circle ornament outside the repeated block. Use four or more sides and return to the start.",
          "draftId": "project",
          "typed": true,
          "requirements": [
            "Use a running range loop",
            "4+ sides",
            "1 executed circle commands",
            "Finish at (0, 0)",
            "Closed outline"
          ],
          "visuals": [
            {
              "label": "Design A",
              "caption": "One possible design.",
              "paths": [
                {
                  "points": [
                    [
                      53.97,
                      86.0
                    ],
                    [
                      125.97,
                      86.0
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      125.97,
                      86.0
                    ],
                    [
                      125.97,
                      14.0
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      125.97,
                      14.0
                    ],
                    [
                      53.97,
                      14.0
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      53.97,
                      14.0
                    ],
                    [
                      53.97,
                      86.0
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                }
              ],
              "circles": [
                {
                  "cx": 53.96923076923077,
                  "cy": 66.06153846153845,
                  "r": 19.938461538461535,
                  "stroke": "#202525",
                  "width": 2
                }
              ],
              "previewCode": "for side in range(4):\n    forward(65)\n    left(90)\ncircle(18)"
            },
            {
              "label": "Design B",
              "caption": "One possible design.",
              "paths": [
                {
                  "points": [
                    [
                      59.22,
                      86.0
                    ],
                    [
                      100.78,
                      86.0
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      100.78,
                      86.0
                    ],
                    [
                      121.57,
                      50.0
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      121.57,
                      50.0
                    ],
                    [
                      100.78,
                      14.0
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      100.78,
                      14.0
                    ],
                    [
                      59.22,
                      14.0
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      59.22,
                      14.0
                    ],
                    [
                      38.43,
                      50.0
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      38.43,
                      50.0
                    ],
                    [
                      59.22,
                      86.0
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                }
              ],
              "circles": [
                {
                  "cx": 59.21539030917348,
                  "cy": 71.74769621200466,
                  "r": 14.252303787995332,
                  "stroke": "#202525",
                  "width": 2
                }
              ],
              "previewCode": "for side in range(6):\n    forward(35)\n    left(60)\ncircle(12)"
            }
          ],
          "tip": "Start with one working motif. Repeat it, then change one property at a time."
        }
      ],
      "visuals": [
        {
          "label": "Design A",
          "caption": "One possible design.",
          "paths": [
            {
              "points": [
                [
                  53.97,
                  86.0
                ],
                [
                  125.97,
                  86.0
                ]
              ],
              "stroke": "#202525",
              "width": 2
            },
            {
              "points": [
                [
                  125.97,
                  86.0
                ],
                [
                  125.97,
                  14.0
                ]
              ],
              "stroke": "#202525",
              "width": 2
            },
            {
              "points": [
                [
                  125.97,
                  14.0
                ],
                [
                  53.97,
                  14.0
                ]
              ],
              "stroke": "#202525",
              "width": 2
            },
            {
              "points": [
                [
                  53.97,
                  14.0
                ],
                [
                  53.97,
                  86.0
                ]
              ],
              "stroke": "#202525",
              "width": 2
            }
          ],
          "circles": [
            {
              "cx": 53.96923076923077,
              "cy": 66.06153846153845,
              "r": 19.938461538461535,
              "stroke": "#202525",
              "width": 2
            }
          ],
          "previewCode": "for side in range(4):\n    forward(65)\n    left(90)\ncircle(18)"
        },
        {
          "label": "Design B",
          "caption": "One possible design.",
          "paths": [
            {
              "points": [
                [
                  59.22,
                  86.0
                ],
                [
                  100.78,
                  86.0
                ]
              ],
              "stroke": "#202525",
              "width": 2
            },
            {
              "points": [
                [
                  100.78,
                  86.0
                ],
                [
                  121.57,
                  50.0
                ]
              ],
              "stroke": "#202525",
              "width": 2
            },
            {
              "points": [
                [
                  121.57,
                  50.0
                ],
                [
                  100.78,
                  14.0
                ]
              ],
              "stroke": "#202525",
              "width": 2
            },
            {
              "points": [
                [
                  100.78,
                  14.0
                ],
                [
                  59.22,
                  14.0
                ]
              ],
              "stroke": "#202525",
              "width": 2
            },
            {
              "points": [
                [
                  59.22,
                  14.0
                ],
                [
                  38.43,
                  50.0
                ]
              ],
              "stroke": "#202525",
              "width": 2
            },
            {
              "points": [
                [
                  38.43,
                  50.0
                ],
                [
                  59.22,
                  86.0
                ]
              ],
              "stroke": "#202525",
              "width": 2
            }
          ],
          "circles": [
            {
              "cx": 59.21539030917348,
              "cy": 71.74769621200466,
              "r": 14.252303787995332,
              "stroke": "#202525",
              "width": 2
            }
          ],
          "previewCode": "for side in range(6):\n    forward(35)\n    left(60)\ncircle(12)"
        }
      ],
      "outputMode": "drawing"
    },
    {
      "id": "2-3-create-loop",
      "number": "2.3",
      "title": "ASCII Texture Studio",
      "type": "Create",
      "available": true,
      "starter": "",
      "draftVersion": "loops-v1",
      "contentVersion": "loops-v1",
      "purpose": "Use loops to build repeated text rows and keep labels outside the block.",
      "objective": "Use loops to build repeated text rows and keep labels outside the block.",
      "notes": "Students type from a blank editor. Check the single repeat before increasing its count. Conference: identify the block, trace one repeat, and predict one deliberate edit. A mistaken first prediction remains saved. Judge creative choices through discussion; the checker grades listed requirements. Only literal range loops and commands are introduced here; variables and functions come later.",
      "check": {
        "execution": true,
        "rules": [
          {
            "type": "loopStructure",
            "label": "Use a running range loop",
            "fail": "Use for NAME in range(COUNT): with an indented block. Counts must be 2–60. Use literal command values in this unit.",
            "min": 1,
            "depth": 1
          },
          {
            "type": "printedRows",
            "label": "7+ output rows",
            "fail": "Add a title and at least six pattern rows.",
            "min": 7
          },
          {
            "type": "differentRows",
            "label": "Title differs from texture",
            "fail": "Keep your title outside the pattern loop.",
            "min": 2
          },
          {
            "type": "printedCharacters",
            "label": "40+ printed characters",
            "fail": "Give the repeated row enough detail.",
            "min": 40
          },
          {
            "type": "textTexture",
            "min": 6,
            "label": "One title, six matching texture rows",
            "fail": "Print one title, then repeat the same pattern row at least six times."
          }
        ]
      },
      "steps": [
        {
          "id": "2-3-create-loop-type",
          "phase": "Type the example",
          "title": "Type and run.",
          "task": "Type line 1 and Run. Add line 2 and Run. These are two identical texture rows.",
          "draftId": "example",
          "example": "print(\"+--+\")\nprint(\"+--+\")",
          "numbered": true,
          "focusLines": [
            1,
            2
          ],
          "body": ""
        },
        {
          "id": "2-3-create-loop-transform",
          "phase": "Change one thing",
          "title": "Build the repeated block.",
          "task": "Replace the two repeated print lines with this program. Run. The heading prints once; the texture row prints four times.",
          "draftId": "example",
          "example": "print(\"TEXTURE\")\nfor row in range(4):\n    print(\"+--+\")",
          "numbered": true,
          "body": "",
          "focusLines": [
            1,
            2,
            3
          ]
        },
        {
          "id": "2-3-create-loop-edit",
          "phase": "Change one thing",
          "title": "Test a change.",
          "task": "Change the pattern on line 3 to \"[::][::]\". Run.",
          "body": "A loop repeats the whole row, including its spaces and symbols.",
          "draftId": "example"
        },
        {
          "id": "2-3-create-loop-predict0",
          "phase": "Predict + run",
          "title": "Predict the result.",
          "task": "Choose an answer, check, then inspect the run.",
          "draftId": "prediction-0",
          "lab": "print(\"TEXTURE\")\nfor row in range(4):\n    print(\"+--+\")",
          "example": "print(\"TEXTURE\")\nfor row in range(4):\n    print(\"+--+\")",
          "numbered": true,
          "question": {
            "id": "2-3-create-loop-q0",
            "prompt": "How many rows print, including the heading?",
            "choices": [
              "4",
              "5",
              "8"
            ],
            "answer": 1,
            "explanation": "One heading plus four repeated rows makes five rows."
          }
        },
        {
          "id": "2-3-create-loop-predict1",
          "phase": "Predict + run",
          "title": "Predict the result.",
          "task": "Choose an answer, check, then inspect the run.",
          "draftId": "prediction-1",
          "lab": "for row in range(4):\n    print(\"TEXTURE\")\n    print(\"+--+\")",
          "example": "for row in range(4):\n    print(\"TEXTURE\")\n    print(\"+--+\")",
          "numbered": true,
          "question": {
            "id": "2-3-create-loop-q1",
            "prompt": "How many headings print if the heading is inside the loop?",
            "choices": [
              "1",
              "4",
              "5"
            ],
            "answer": 1,
            "explanation": "An indented heading prints on every repeat."
          }
        },
        {
          "id": "2-3-create-loop-observe",
          "phase": "Record an observation",
          "title": "Save what changed.",
          "task": "Compare the two versions you tested. Record the line you changed and what happened.",
          "draftId": "example",
          "response": {
            "id": "2-3-create-loop-observation",
            "prompt": "Which line did you change, and what visible result changed?",
            "placeholder": "I changed ___ from ___ to ___. The result ___."
          }
        },
        {
          "id": "2-3-create-loop-required",
          "phase": "Required assignment",
          "title": "Build the required result.",
          "task": "Print BRICK once, then exactly five rows of [__][__]. Use a loop for the five rows.",
          "draftId": "assignment-required",
          "typed": true,
          "check": {
            "execution": true,
            "rules": [
              {
                "type": "loopStructure",
                "label": "Use a running range loop",
                "fail": "Use for NAME in range(COUNT): with an indented block. Counts must be 2–60. Use literal command values in this unit.",
                "min": 1,
                "depth": 1
              },
              {
                "type": "outputRows",
                "label": "Heading + five brick rows",
                "fail": "Check spaces, row count, and heading placement.",
                "rows": [
                  "BRICK",
                  "[__][__]",
                  "[__][__]",
                  "[__][__]",
                  "[__][__]",
                  "[__][__]"
                ]
              }
            ]
          },
          "requirements": [
            "Use a running range loop",
            "Heading + five brick rows"
          ],
          "visuals": [
            {
              "label": "Required output",
              "ascii": "BRICK\n[__][__]\n[__][__]\n[__][__]\n[__][__]\n[__][__]",
              "previewCode": "print(\"BRICK\")\nfor row in range(5):\n    print(\"[__][__]\")",
              "caption": "Match these requirements."
            }
          ],
          "tip": "Check the repeat count, the turn, and the indentation separately. Run after each repair."
        },
        {
          "id": "2-3-create-loop-project",
          "phase": "Create your own",
          "title": "Make your own design.",
          "task": "Design an ASCII wallpaper with a title and at least six repeated pattern rows. Use spaces and symbols to create bricks, scales, circuits, or another texture.",
          "draftId": "project",
          "typed": true,
          "requirements": [
            "Use a running range loop",
            "7+ output rows",
            "Title differs from texture",
            "40+ printed characters",
            "One title, six matching texture rows"
          ],
          "visuals": [
            {
              "label": "Scales",
              "ascii": "SCALES\n /\\ /\\ /\\ \n /\\ /\\ /\\ \n /\\ /\\ /\\ \n /\\ /\\ /\\ \n /\\ /\\ /\\ \n /\\ /\\ /\\ ",
              "previewCode": "print(\"SCALES\")\nfor row in range(6):\n    print(\" /\\ /\\ /\\ \")",
              "caption": "One possible design."
            },
            {
              "label": "Circuit",
              "ascii": "CIRCUIT\no--+--o\no--+--o\no--+--o\no--+--o\no--+--o\no--+--o",
              "previewCode": "print(\"CIRCUIT\")\nfor row in range(6):\n    print(\"o--+--o\")",
              "caption": "One possible design."
            }
          ],
          "tip": "Start with one working motif. Repeat it, then change one property at a time."
        }
      ],
      "visuals": [
        {
          "label": "Scales",
          "ascii": "SCALES\n /\\ /\\ /\\ \n /\\ /\\ /\\ \n /\\ /\\ /\\ \n /\\ /\\ /\\ \n /\\ /\\ /\\ \n /\\ /\\ /\\ ",
          "previewCode": "print(\"SCALES\")\nfor row in range(6):\n    print(\" /\\ /\\ /\\ \")",
          "caption": "One possible design."
        },
        {
          "label": "Circuit",
          "ascii": "CIRCUIT\no--+--o\no--+--o\no--+--o\no--+--o\no--+--o\no--+--o",
          "previewCode": "print(\"CIRCUIT\")\nfor row in range(6):\n    print(\"o--+--o\")",
          "caption": "One possible design."
        }
      ],
      "outputMode": "text"
    },
    {
      "id": "2-4-make-shapes",
      "number": "2.4",
      "title": "Polygon Badge Lab",
      "type": "Make",
      "available": true,
      "starter": "",
      "draftVersion": "loops-v1",
      "contentVersion": "loops-v1",
      "purpose": "Match repeat count and turning angle so a polygon closes: sides × turn = 360°.",
      "objective": "Match repeat count and turning angle so a polygon closes: sides × turn = 360°.",
      "notes": "Students type from a blank editor. Check the single repeat before increasing its count. Conference: identify the block, trace one repeat, and predict one deliberate edit. A mistaken first prediction remains saved. Judge creative choices through discussion; the checker grades listed requirements. Only literal range loops and commands are introduced here; variables and functions come later.",
      "check": {
        "execution": true,
        "rules": [
          {
            "type": "loopStructure",
            "label": "Use a running range loop",
            "fail": "Use for NAME in range(COUNT): with an indented block. Counts must be 2–60. Use literal command values in this unit.",
            "min": 1,
            "depth": 1,
            "maxCount": 12
          },
          {
            "type": "minCalls",
            "label": "5+ sides",
            "fail": "Choose at least five repeats.",
            "commands": [
              "forward"
            ],
            "count": 5
          },
          {
            "type": "closedOutline",
            "label": "Closed badge",
            "fail": "Divide 360 by the number of sides."
          },
          {
            "type": "finalPosition",
            "label": "Finish at (0, 0)",
            "fail": "Check the movement and which commands are inside the loop.",
            "x": 0,
            "y": 0,
            "tolerance": 1
          },
          {
            "type": "drawingStyle",
            "label": "Colored bold outline",
            "fail": "Set color and pensize before drawing.",
            "colors": 1,
            "width": 4
          },
          {
            "type": "drawingBounds",
            "label": "Fits the grid",
            "fail": "Shorten each side.",
            "limit": 180
          },
          {
            "type": "sameNumbers",
            "commands": [
              "forward"
            ],
            "min": 5,
            "label": "Equal side lengths",
            "fail": "Use the same distance for every side."
          }
        ]
      },
      "steps": [
        {
          "id": "2-4-make-shapes-type",
          "phase": "Type the example",
          "title": "Type and run.",
          "task": "Type the loop header, then its two indented commands. Run. Four 90° turns complete one full turn.",
          "draftId": "example",
          "example": "for side in range(4):\n    forward(60)\n    left(90)",
          "numbered": true,
          "focusLines": [
            1,
            2,
            3
          ],
          "body": "Use four spaces for each indentation level. Run after the complete block is typed; a header without a body cannot run."
        },
        {
          "id": "2-4-make-shapes-transform",
          "phase": "Change one thing",
          "title": "Build the repeated block.",
          "task": "Change line 1 to six repeats and line 3 to a 60° turn. Run. Six × 60° = 360°.",
          "draftId": "example",
          "example": "for side in range(6):\n    forward(40)\n    left(60)",
          "numbered": true,
          "body": "",
          "focusLines": [
            1,
            2,
            3
          ]
        },
        {
          "id": "2-4-make-shapes-edit",
          "phase": "Change one thing",
          "title": "Test a change.",
          "task": "Change only the repeat count to 5. Run. Then change the turn to 72°. Run.",
          "body": "Five equal turns of 72° close a pentagon.",
          "draftId": "example"
        },
        {
          "id": "2-4-make-shapes-predict0",
          "phase": "Predict + run",
          "title": "Predict the result.",
          "task": "Choose an answer, check, then inspect the run.",
          "draftId": "prediction-0",
          "lab": "for side in range(6):\n    forward(40)\n    left(60)",
          "example": "for side in range(6):\n    forward(40)\n    left(60)",
          "numbered": true,
          "question": {
            "id": "2-4-make-shapes-q0",
            "prompt": "Which turn closes an eight-sided badge?",
            "choices": [
              "45°",
              "60°",
              "80°"
            ],
            "answer": 0,
            "explanation": "360 ÷ 8 = 45 degrees per turn."
          }
        },
        {
          "id": "2-4-make-shapes-predict1",
          "phase": "Predict + run",
          "title": "Predict the result.",
          "task": "Choose an answer, check, then inspect the run.",
          "draftId": "prediction-1",
          "lab": "for side in range(6):\n    forward(40)\n    left(90)",
          "example": "for side in range(6):\n    forward(40)\n    left(90)",
          "numbered": true,
          "question": {
            "id": "2-4-make-shapes-q1",
            "prompt": "With six repeats and a 90° turn, what goes wrong?",
            "choices": [
              "It makes a hexagon",
              "It retraces part of a square",
              "It draws no lines"
            ],
            "answer": 1,
            "explanation": "Quarter-turns make a square; extra repeats retrace two sides."
          }
        },
        {
          "id": "2-4-make-shapes-observe",
          "phase": "Record an observation",
          "title": "Save what changed.",
          "task": "Compare the two versions you tested. Record the line you changed and what happened.",
          "draftId": "example",
          "response": {
            "id": "2-4-make-shapes-observation",
            "prompt": "Which line did you change, and what visible result changed?",
            "placeholder": "I changed ___ from ___ to ___. The result ___."
          }
        },
        {
          "id": "2-4-make-shapes-required",
          "phase": "Required assignment",
          "title": "Build the required result.",
          "task": "Make a closed equilateral triangle: three 70-unit sides. Choose the turn.",
          "draftId": "assignment-required",
          "typed": true,
          "check": {
            "execution": true,
            "rules": [
              {
                "type": "loopStructure",
                "label": "Use a running range loop",
                "fail": "Use for NAME in range(COUNT): with an indented block. Counts must be 2–60. Use literal command values in this unit.",
                "min": 1,
                "depth": 1
              },
              {
                "type": "exactCalls",
                "label": "3 executed forward commands",
                "fail": "Compare the number of repeated forward commands with the target.",
                "commands": [
                  "forward"
                ],
                "count": 3
              },
              {
                "type": "executedNumber",
                "label": "70-unit sides",
                "fail": "Use 70 for each executed forward movement.",
                "commands": [
                  "forward"
                ],
                "value": 70
              },
              {
                "type": "finalPosition",
                "label": "Finish at (0, 0)",
                "fail": "Check the movement and which commands are inside the loop.",
                "x": 0,
                "y": 0,
                "tolerance": 1
              },
              {
                "type": "closedOutline",
                "label": "Triangle closes",
                "fail": "Use a turn that completes 360° in three repeats."
              }
            ]
          },
          "requirements": [
            "Use a running range loop",
            "3 executed forward commands",
            "70-unit sides",
            "Finish at (0, 0)",
            "Triangle closes"
          ],
          "visuals": [
            {
              "label": "Required result",
              "caption": "Match these requirements.",
              "paths": [
                {
                  "points": [
                    [
                      38.43,
                      86.0
                    ],
                    [
                      121.57,
                      86.0
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      121.57,
                      86.0
                    ],
                    [
                      80.0,
                      14.0
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      80.0,
                      14.0
                    ],
                    [
                      38.43,
                      86.0
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                }
              ],
              "circles": [],
              "previewCode": "for side in range(3):\n    forward(70)\n    left(120)"
            }
          ],
          "tip": "Check the repeat count, the turn, and the indentation separately. Run after each repair."
        },
        {
          "id": "2-4-make-shapes-project",
          "phase": "Create your own",
          "title": "Make your own design.",
          "task": "Create a polygon badge with 5–12 equal sides, a bold outline, and your chosen color. Keep it within the grid.",
          "draftId": "project",
          "typed": true,
          "requirements": [
            "Use a running range loop",
            "5+ sides",
            "Closed badge",
            "Finish at (0, 0)",
            "Colored bold outline",
            "Fits the grid",
            "Equal side lengths"
          ],
          "visuals": [
            {
              "label": "Design A",
              "caption": "One possible design.",
              "paths": [
                {
                  "points": [
                    [
                      59.22,
                      86.0
                    ],
                    [
                      100.78,
                      86.0
                    ]
                  ],
                  "stroke": "teal",
                  "width": 4
                },
                {
                  "points": [
                    [
                      100.78,
                      86.0
                    ],
                    [
                      121.57,
                      50.0
                    ]
                  ],
                  "stroke": "teal",
                  "width": 4
                },
                {
                  "points": [
                    [
                      121.57,
                      50.0
                    ],
                    [
                      100.78,
                      14.0
                    ]
                  ],
                  "stroke": "teal",
                  "width": 4
                },
                {
                  "points": [
                    [
                      100.78,
                      14.0
                    ],
                    [
                      59.22,
                      14.0
                    ]
                  ],
                  "stroke": "teal",
                  "width": 4
                },
                {
                  "points": [
                    [
                      59.22,
                      14.0
                    ],
                    [
                      38.43,
                      50.0
                    ]
                  ],
                  "stroke": "teal",
                  "width": 4
                },
                {
                  "points": [
                    [
                      38.43,
                      50.0
                    ],
                    [
                      59.22,
                      86.0
                    ]
                  ],
                  "stroke": "teal",
                  "width": 4
                }
              ],
              "circles": [],
              "previewCode": "color(\"teal\")\npensize(4)\nfor side in range(6):\n    forward(45)\n    left(60)"
            },
            {
              "label": "Design B",
              "caption": "One possible design.",
              "paths": [
                {
                  "points": [
                    [
                      65.09,
                      86.0
                    ],
                    [
                      94.91,
                      86.0
                    ]
                  ],
                  "stroke": "purple",
                  "width": 4
                },
                {
                  "points": [
                    [
                      94.91,
                      86.0
                    ],
                    [
                      116.0,
                      64.91
                    ]
                  ],
                  "stroke": "purple",
                  "width": 4
                },
                {
                  "points": [
                    [
                      116.0,
                      64.91
                    ],
                    [
                      116.0,
                      35.09
                    ]
                  ],
                  "stroke": "purple",
                  "width": 4
                },
                {
                  "points": [
                    [
                      116.0,
                      35.09
                    ],
                    [
                      94.91,
                      14.0
                    ]
                  ],
                  "stroke": "purple",
                  "width": 4
                },
                {
                  "points": [
                    [
                      94.91,
                      14.0
                    ],
                    [
                      65.09,
                      14.0
                    ]
                  ],
                  "stroke": "purple",
                  "width": 4
                },
                {
                  "points": [
                    [
                      65.09,
                      14.0
                    ],
                    [
                      44.0,
                      35.09
                    ]
                  ],
                  "stroke": "purple",
                  "width": 4
                },
                {
                  "points": [
                    [
                      44.0,
                      35.09
                    ],
                    [
                      44.0,
                      64.91
                    ]
                  ],
                  "stroke": "purple",
                  "width": 4
                },
                {
                  "points": [
                    [
                      44.0,
                      64.91
                    ],
                    [
                      65.09,
                      86.0
                    ]
                  ],
                  "stroke": "purple",
                  "width": 4
                }
              ],
              "circles": [],
              "previewCode": "color(\"purple\")\npensize(5)\nfor side in range(8):\n    forward(32)\n    left(45)"
            }
          ],
          "tip": "Start with one working motif. Repeat it, then change one property at a time."
        }
      ],
      "visuals": [
        {
          "label": "Design A",
          "caption": "One possible design.",
          "paths": [
            {
              "points": [
                [
                  59.22,
                  86.0
                ],
                [
                  100.78,
                  86.0
                ]
              ],
              "stroke": "teal",
              "width": 4
            },
            {
              "points": [
                [
                  100.78,
                  86.0
                ],
                [
                  121.57,
                  50.0
                ]
              ],
              "stroke": "teal",
              "width": 4
            },
            {
              "points": [
                [
                  121.57,
                  50.0
                ],
                [
                  100.78,
                  14.0
                ]
              ],
              "stroke": "teal",
              "width": 4
            },
            {
              "points": [
                [
                  100.78,
                  14.0
                ],
                [
                  59.22,
                  14.0
                ]
              ],
              "stroke": "teal",
              "width": 4
            },
            {
              "points": [
                [
                  59.22,
                  14.0
                ],
                [
                  38.43,
                  50.0
                ]
              ],
              "stroke": "teal",
              "width": 4
            },
            {
              "points": [
                [
                  38.43,
                  50.0
                ],
                [
                  59.22,
                  86.0
                ]
              ],
              "stroke": "teal",
              "width": 4
            }
          ],
          "circles": [],
          "previewCode": "color(\"teal\")\npensize(4)\nfor side in range(6):\n    forward(45)\n    left(60)"
        },
        {
          "label": "Design B",
          "caption": "One possible design.",
          "paths": [
            {
              "points": [
                [
                  65.09,
                  86.0
                ],
                [
                  94.91,
                  86.0
                ]
              ],
              "stroke": "purple",
              "width": 4
            },
            {
              "points": [
                [
                  94.91,
                  86.0
                ],
                [
                  116.0,
                  64.91
                ]
              ],
              "stroke": "purple",
              "width": 4
            },
            {
              "points": [
                [
                  116.0,
                  64.91
                ],
                [
                  116.0,
                  35.09
                ]
              ],
              "stroke": "purple",
              "width": 4
            },
            {
              "points": [
                [
                  116.0,
                  35.09
                ],
                [
                  94.91,
                  14.0
                ]
              ],
              "stroke": "purple",
              "width": 4
            },
            {
              "points": [
                [
                  94.91,
                  14.0
                ],
                [
                  65.09,
                  14.0
                ]
              ],
              "stroke": "purple",
              "width": 4
            },
            {
              "points": [
                [
                  65.09,
                  14.0
                ],
                [
                  44.0,
                  35.09
                ]
              ],
              "stroke": "purple",
              "width": 4
            },
            {
              "points": [
                [
                  44.0,
                  35.09
                ],
                [
                  44.0,
                  64.91
                ]
              ],
              "stroke": "purple",
              "width": 4
            },
            {
              "points": [
                [
                  44.0,
                  64.91
                ],
                [
                  65.09,
                  86.0
                ]
              ],
              "stroke": "purple",
              "width": 4
            }
          ],
          "circles": [],
          "previewCode": "color(\"purple\")\npensize(5)\nfor side in range(8):\n    forward(32)\n    left(45)"
        }
      ],
      "outputMode": "drawing"
    },
    {
      "id": "2-5-solve-pattern",
      "number": "2.5",
      "title": "Rosette Repair",
      "type": "Solve",
      "available": true,
      "starter": "",
      "draftVersion": "loops-v1",
      "contentVersion": "loops-v1",
      "purpose": "Trace the inner loop as one complete shape, then rotate that shape in the outer loop.",
      "objective": "Trace the inner loop as one complete shape, then rotate that shape in the outer loop.",
      "notes": "Students type from a blank editor. Check the single repeat before increasing its count. Conference: identify the block, trace one repeat, and predict one deliberate edit. A mistaken first prediction remains saved. Judge creative choices through discussion; the checker grades listed requirements. Only literal range loops and commands are introduced here; variables and functions come later.",
      "check": {
        "execution": true,
        "rules": [
          {
            "type": "loopStructure",
            "label": "Use a running range loop inside another loop",
            "fail": "Use for NAME in range(COUNT): with an indented block. Counts must be 2–60. Use literal command values in this unit.",
            "min": 1,
            "depth": 2
          },
          {
            "type": "drawnMoves",
            "label": "20+ drawn sides",
            "fail": "Repeat a shape with an inner loop.",
            "count": 20
          },
          {
            "type": "visibleCorners",
            "label": "19+ visible corners",
            "fail": "Turn within each shape and rotate between shapes.",
            "count": 19
          },
          {
            "type": "drawingStyle",
            "label": "Bold colored outline",
            "fail": "Set pensize to at least 3 and choose a color.",
            "colors": 1,
            "width": 3
          },
          {
            "type": "drawingBounds",
            "label": "Fits the grid",
            "fail": "Use shorter sides.",
            "limit": 180
          }
        ]
      },
      "steps": [
        {
          "id": "2-5-solve-pattern-type",
          "phase": "Type the example",
          "title": "Type and run.",
          "task": "Type the example. Indent the inner header and last turn four spaces; indent the square commands eight spaces. Run.",
          "draftId": "example",
          "example": "for petal in range(3):\n    for side in range(4):\n        forward(40)\n        left(90)\n    left(120)",
          "numbered": true,
          "focusLines": [
            1,
            2,
            3,
            4,
            5
          ],
          "body": "Use four spaces for each indentation level. Run after the complete block is typed; a header without a body cannot run."
        },
        {
          "id": "2-5-solve-pattern-transform",
          "phase": "Change one thing",
          "title": "Build the repeated block.",
          "task": "Change the outer count to 6 and the final turn to 60°. Run. The inner loop closes a square before the outer loop rotates it.",
          "draftId": "example",
          "example": "for petal in range(6):\n    for side in range(4):\n        forward(40)\n        left(90)\n    left(60)",
          "numbered": true,
          "body": "",
          "focusLines": [
            1,
            2,
            3,
            4,
            5
          ]
        },
        {
          "id": "2-5-solve-pattern-edit",
          "phase": "Change one thing",
          "title": "Test a change.",
          "task": "Move the last turn all the way left. Run. Then restore its four spaces.",
          "body": "The rotation belongs inside the outer loop and outside the inner loop.",
          "draftId": "example"
        },
        {
          "id": "2-5-solve-pattern-predict0",
          "phase": "Predict + run",
          "title": "Predict the result.",
          "task": "Choose an answer, check, then inspect the run.",
          "draftId": "prediction-0",
          "lab": "for petal in range(6):\n    for side in range(4):\n        forward(40)\n        left(90)\n    left(60)",
          "example": "for petal in range(6):\n    for side in range(4):\n        forward(40)\n        left(90)\n    left(60)",
          "numbered": true,
          "question": {
            "id": "2-5-solve-pattern-q0",
            "prompt": "How many forward commands execute in the six-square version?",
            "choices": [
              "6",
              "10",
              "24"
            ],
            "answer": 2,
            "explanation": "Six outer repeats each execute four inner moves: 6 × 4 = 24."
          }
        },
        {
          "id": "2-5-solve-pattern-predict1",
          "phase": "Predict + run",
          "title": "Predict the result.",
          "task": "Choose an answer, check, then inspect the run.",
          "draftId": "prediction-1",
          "lab": "for petal in range(6):\n    for side in range(4):\n        forward(40)\n        left(90)\nleft(60)",
          "example": "for petal in range(6):\n    for side in range(4):\n        forward(40)\n        left(90)\nleft(60)",
          "numbered": true,
          "question": {
            "id": "2-5-solve-pattern-q1",
            "prompt": "What if the final turn has no indentation?",
            "choices": [
              "The squares overlap; rotation happens once at the end",
              "Every square rotates",
              "Only one side draws"
            ],
            "answer": 0,
            "explanation": "The outer loop repeats closed squares without rotating between them."
          }
        },
        {
          "id": "2-5-solve-pattern-observe",
          "phase": "Record an observation",
          "title": "Save what changed.",
          "task": "Compare the two versions you tested. Record the line you changed and what happened.",
          "draftId": "example",
          "response": {
            "id": "2-5-solve-pattern-observation",
            "prompt": "Which line did you change, and what visible result changed?",
            "placeholder": "I changed ___ from ___ to ___. The result ___."
          }
        },
        {
          "id": "2-5-solve-pattern-required",
          "phase": "Required assignment",
          "title": "Build the required result.",
          "task": "Repair the rosette: draw eight 35-unit squares, rotated by 45° between squares. Use nested loops.",
          "draftId": "assignment-required",
          "typed": true,
          "check": {
            "execution": true,
            "rules": [
              {
                "type": "loopStructure",
                "label": "Use a running range loop inside another loop",
                "fail": "Use for NAME in range(COUNT): with an indented block. Counts must be 2–60. Use literal command values in this unit.",
                "min": 1,
                "depth": 2
              },
              {
                "type": "exactCalls",
                "label": "32 executed forward commands",
                "fail": "Compare the number of repeated forward commands with the target.",
                "commands": [
                  "forward"
                ],
                "count": 32
              },
              {
                "type": "exactCalls",
                "label": "40 executed left commands",
                "fail": "Compare the number of repeated left commands with the target.",
                "commands": [
                  "left"
                ],
                "count": 40
              },
              {
                "type": "executedNumber",
                "label": "35-unit sides",
                "fail": "Set the inner movement to 35.",
                "commands": [
                  "forward"
                ],
                "value": 35
              },
              {
                "type": "finalPosition",
                "label": "Finish at (0, 0)",
                "fail": "Check the movement and which commands are inside the loop.",
                "x": 0,
                "y": 0,
                "tolerance": 1
              },
              {
                "type": "finalHeading",
                "label": "Full rotation",
                "fail": "Eight shape rotations should total 360°.",
                "heading": 0,
                "tolerance": 1
              },
              {
                "type": "visibleCorners",
                "label": "31+ visible corners",
                "fail": "Close and rotate each square.",
                "count": 31
              },
              {
                "type": "shapeRotations",
                "sides": 4,
                "count": 8,
                "label": "Eight different square orientations",
                "fail": "Rotate after each complete square, inside the outer loop."
              }
            ]
          },
          "requirements": [
            "Use a running range loop inside another loop",
            "32 executed forward commands",
            "40 executed left commands",
            "35-unit sides",
            "Finish at (0, 0)",
            "Full rotation",
            "31+ visible corners",
            "Eight different square orientations"
          ],
          "visuals": [
            {
              "label": "Required result",
              "caption": "Match these requirements.",
              "paths": [
                {
                  "points": [
                    [
                      80.0,
                      50.0
                    ],
                    [
                      105.46,
                      50.0
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      105.46,
                      50.0
                    ],
                    [
                      105.46,
                      24.54
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      105.46,
                      24.54
                    ],
                    [
                      80.0,
                      24.54
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      80.0,
                      24.54
                    ],
                    [
                      80.0,
                      50.0
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      80.0,
                      50.0
                    ],
                    [
                      98.0,
                      32.0
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      98.0,
                      32.0
                    ],
                    [
                      80.0,
                      14.0
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      80.0,
                      14.0
                    ],
                    [
                      62.0,
                      32.0
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      62.0,
                      32.0
                    ],
                    [
                      80.0,
                      50.0
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      80.0,
                      50.0
                    ],
                    [
                      80.0,
                      24.54
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      80.0,
                      24.54
                    ],
                    [
                      54.54,
                      24.54
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      54.54,
                      24.54
                    ],
                    [
                      54.54,
                      50.0
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      54.54,
                      50.0
                    ],
                    [
                      80.0,
                      50.0
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      80.0,
                      50.0
                    ],
                    [
                      62.0,
                      32.0
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      62.0,
                      32.0
                    ],
                    [
                      44.0,
                      50.0
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      44.0,
                      50.0
                    ],
                    [
                      62.0,
                      68.0
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      62.0,
                      68.0
                    ],
                    [
                      80.0,
                      50.0
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      80.0,
                      50.0
                    ],
                    [
                      54.54,
                      50.0
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      54.54,
                      50.0
                    ],
                    [
                      54.54,
                      75.46
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      54.54,
                      75.46
                    ],
                    [
                      80.0,
                      75.46
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      80.0,
                      75.46
                    ],
                    [
                      80.0,
                      50.0
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      80.0,
                      50.0
                    ],
                    [
                      62.0,
                      68.0
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      62.0,
                      68.0
                    ],
                    [
                      80.0,
                      86.0
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      80.0,
                      86.0
                    ],
                    [
                      98.0,
                      68.0
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      98.0,
                      68.0
                    ],
                    [
                      80.0,
                      50.0
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      80.0,
                      50.0
                    ],
                    [
                      80.0,
                      75.46
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      80.0,
                      75.46
                    ],
                    [
                      105.46,
                      75.46
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      105.46,
                      75.46
                    ],
                    [
                      105.46,
                      50.0
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      105.46,
                      50.0
                    ],
                    [
                      80.0,
                      50.0
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      80.0,
                      50.0
                    ],
                    [
                      98.0,
                      68.0
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      98.0,
                      68.0
                    ],
                    [
                      116.0,
                      50.0
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      116.0,
                      50.0
                    ],
                    [
                      98.0,
                      32.0
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                },
                {
                  "points": [
                    [
                      98.0,
                      32.0
                    ],
                    [
                      80.0,
                      50.0
                    ]
                  ],
                  "stroke": "#202525",
                  "width": 2
                }
              ],
              "circles": [],
              "previewCode": "for petal in range(8):\n    for side in range(4):\n        forward(35)\n        left(90)\n    left(45)"
            }
          ],
          "tip": "Check the repeat count, the turn, and the indentation separately. Run after each repair."
        },
        {
          "id": "2-5-solve-pattern-project",
          "phase": "Create your own",
          "title": "Make your own design.",
          "task": "Design a rosette from nested loops. Draw at least 20 sides, rotate between shapes, and use a bold colored outline.",
          "draftId": "project",
          "typed": true,
          "requirements": [
            "Use a running range loop inside another loop",
            "20+ drawn sides",
            "19+ visible corners",
            "Bold colored outline",
            "Fits the grid"
          ],
          "visuals": [
            {
              "label": "Design A",
              "caption": "One possible design.",
              "paths": [
                {
                  "points": [
                    [
                      80.0,
                      50.0
                    ],
                    [
                      106.35,
                      50.0
                    ]
                  ],
                  "stroke": "teal",
                  "width": 3.0
                },
                {
                  "points": [
                    [
                      106.35,
                      50.0
                    ],
                    [
                      106.35,
                      23.65
                    ]
                  ],
                  "stroke": "teal",
                  "width": 3.0
                },
                {
                  "points": [
                    [
                      106.35,
                      23.65
                    ],
                    [
                      80.0,
                      23.65
                    ]
                  ],
                  "stroke": "teal",
                  "width": 3.0
                },
                {
                  "points": [
                    [
                      80.0,
                      23.65
                    ],
                    [
                      80.0,
                      50.0
                    ]
                  ],
                  "stroke": "teal",
                  "width": 3.0
                },
                {
                  "points": [
                    [
                      80.0,
                      50.0
                    ],
                    [
                      93.18,
                      27.18
                    ]
                  ],
                  "stroke": "teal",
                  "width": 3.0
                },
                {
                  "points": [
                    [
                      93.18,
                      27.18
                    ],
                    [
                      70.35,
                      14.0
                    ]
                  ],
                  "stroke": "teal",
                  "width": 3.0
                },
                {
                  "points": [
                    [
                      70.35,
                      14.0
                    ],
                    [
                      57.18,
                      36.82
                    ]
                  ],
                  "stroke": "teal",
                  "width": 3.0
                },
                {
                  "points": [
                    [
                      57.18,
                      36.82
                    ],
                    [
                      80.0,
                      50.0
                    ]
                  ],
                  "stroke": "teal",
                  "width": 3.0
                },
                {
                  "points": [
                    [
                      80.0,
                      50.0
                    ],
                    [
                      66.82,
                      27.18
                    ]
                  ],
                  "stroke": "teal",
                  "width": 3.0
                },
                {
                  "points": [
                    [
                      66.82,
                      27.18
                    ],
                    [
                      44.0,
                      40.35
                    ]
                  ],
                  "stroke": "teal",
                  "width": 3.0
                },
                {
                  "points": [
                    [
                      44.0,
                      40.35
                    ],
                    [
                      57.18,
                      63.18
                    ]
                  ],
                  "stroke": "teal",
                  "width": 3.0
                },
                {
                  "points": [
                    [
                      57.18,
                      63.18
                    ],
                    [
                      80.0,
                      50.0
                    ]
                  ],
                  "stroke": "teal",
                  "width": 3.0
                },
                {
                  "points": [
                    [
                      80.0,
                      50.0
                    ],
                    [
                      53.65,
                      50.0
                    ]
                  ],
                  "stroke": "teal",
                  "width": 3.0
                },
                {
                  "points": [
                    [
                      53.65,
                      50.0
                    ],
                    [
                      53.65,
                      76.35
                    ]
                  ],
                  "stroke": "teal",
                  "width": 3.0
                },
                {
                  "points": [
                    [
                      53.65,
                      76.35
                    ],
                    [
                      80.0,
                      76.35
                    ]
                  ],
                  "stroke": "teal",
                  "width": 3.0
                },
                {
                  "points": [
                    [
                      80.0,
                      76.35
                    ],
                    [
                      80.0,
                      50.0
                    ]
                  ],
                  "stroke": "teal",
                  "width": 3.0
                },
                {
                  "points": [
                    [
                      80.0,
                      50.0
                    ],
                    [
                      66.82,
                      72.82
                    ]
                  ],
                  "stroke": "teal",
                  "width": 3.0
                },
                {
                  "points": [
                    [
                      66.82,
                      72.82
                    ],
                    [
                      89.65,
                      86.0
                    ]
                  ],
                  "stroke": "teal",
                  "width": 3.0
                },
                {
                  "points": [
                    [
                      89.65,
                      86.0
                    ],
                    [
                      102.82,
                      63.18
                    ]
                  ],
                  "stroke": "teal",
                  "width": 3.0
                },
                {
                  "points": [
                    [
                      102.82,
                      63.18
                    ],
                    [
                      80.0,
                      50.0
                    ]
                  ],
                  "stroke": "teal",
                  "width": 3.0
                },
                {
                  "points": [
                    [
                      80.0,
                      50.0
                    ],
                    [
                      93.18,
                      72.82
                    ]
                  ],
                  "stroke": "teal",
                  "width": 3.0
                },
                {
                  "points": [
                    [
                      93.18,
                      72.82
                    ],
                    [
                      116.0,
                      59.65
                    ]
                  ],
                  "stroke": "teal",
                  "width": 3.0
                },
                {
                  "points": [
                    [
                      116.0,
                      59.65
                    ],
                    [
                      102.82,
                      36.82
                    ]
                  ],
                  "stroke": "teal",
                  "width": 3.0
                },
                {
                  "points": [
                    [
                      102.82,
                      36.82
                    ],
                    [
                      80.0,
                      50.0
                    ]
                  ],
                  "stroke": "teal",
                  "width": 3.0
                }
              ],
              "circles": [],
              "previewCode": "color(\"teal\")\npensize(3)\nfor petal in range(6):\n    for side in range(4):\n        forward(45)\n        left(90)\n    left(60)"
            },
            {
              "label": "Design B",
              "caption": "One possible design.",
              "paths": [
                {
                  "points": [
                    [
                      80.0,
                      50.0
                    ],
                    [
                      116.0,
                      50.0
                    ]
                  ],
                  "stroke": "purple",
                  "width": 3.0
                },
                {
                  "points": [
                    [
                      116.0,
                      50.0
                    ],
                    [
                      98.0,
                      18.82
                    ]
                  ],
                  "stroke": "purple",
                  "width": 3.0
                },
                {
                  "points": [
                    [
                      98.0,
                      18.82
                    ],
                    [
                      80.0,
                      50.0
                    ]
                  ],
                  "stroke": "purple",
                  "width": 3.0
                },
                {
                  "points": [
                    [
                      80.0,
                      50.0
                    ],
                    [
                      105.46,
                      24.54
                    ]
                  ],
                  "stroke": "purple",
                  "width": 3.0
                },
                {
                  "points": [
                    [
                      105.46,
                      24.54
                    ],
                    [
                      70.68,
                      15.23
                    ]
                  ],
                  "stroke": "purple",
                  "width": 3.0
                },
                {
                  "points": [
                    [
                      70.68,
                      15.23
                    ],
                    [
                      80.0,
                      50.0
                    ]
                  ],
                  "stroke": "purple",
                  "width": 3.0
                },
                {
                  "points": [
                    [
                      80.0,
                      50.0
                    ],
                    [
                      80.0,
                      14.0
                    ]
                  ],
                  "stroke": "purple",
                  "width": 3.0
                },
                {
                  "points": [
                    [
                      80.0,
                      14.0
                    ],
                    [
                      48.82,
                      32.0
                    ]
                  ],
                  "stroke": "purple",
                  "width": 3.0
                },
                {
                  "points": [
                    [
                      48.82,
                      32.0
                    ],
                    [
                      80.0,
                      50.0
                    ]
                  ],
                  "stroke": "purple",
                  "width": 3.0
                },
                {
                  "points": [
                    [
                      80.0,
                      50.0
                    ],
                    [
                      54.54,
                      24.54
                    ]
                  ],
                  "stroke": "purple",
                  "width": 3.0
                },
                {
                  "points": [
                    [
                      54.54,
                      24.54
                    ],
                    [
                      45.23,
                      59.32
                    ]
                  ],
                  "stroke": "purple",
                  "width": 3.0
                },
                {
                  "points": [
                    [
                      45.23,
                      59.32
                    ],
                    [
                      80.0,
                      50.0
                    ]
                  ],
                  "stroke": "purple",
                  "width": 3.0
                },
                {
                  "points": [
                    [
                      80.0,
                      50.0
                    ],
                    [
                      44.0,
                      50.0
                    ]
                  ],
                  "stroke": "purple",
                  "width": 3.0
                },
                {
                  "points": [
                    [
                      44.0,
                      50.0
                    ],
                    [
                      62.0,
                      81.18
                    ]
                  ],
                  "stroke": "purple",
                  "width": 3.0
                },
                {
                  "points": [
                    [
                      62.0,
                      81.18
                    ],
                    [
                      80.0,
                      50.0
                    ]
                  ],
                  "stroke": "purple",
                  "width": 3.0
                },
                {
                  "points": [
                    [
                      80.0,
                      50.0
                    ],
                    [
                      54.54,
                      75.46
                    ]
                  ],
                  "stroke": "purple",
                  "width": 3.0
                },
                {
                  "points": [
                    [
                      54.54,
                      75.46
                    ],
                    [
                      89.32,
                      84.77
                    ]
                  ],
                  "stroke": "purple",
                  "width": 3.0
                },
                {
                  "points": [
                    [
                      89.32,
                      84.77
                    ],
                    [
                      80.0,
                      50.0
                    ]
                  ],
                  "stroke": "purple",
                  "width": 3.0
                },
                {
                  "points": [
                    [
                      80.0,
                      50.0
                    ],
                    [
                      80.0,
                      86.0
                    ]
                  ],
                  "stroke": "purple",
                  "width": 3.0
                },
                {
                  "points": [
                    [
                      80.0,
                      86.0
                    ],
                    [
                      111.18,
                      68.0
                    ]
                  ],
                  "stroke": "purple",
                  "width": 3.0
                },
                {
                  "points": [
                    [
                      111.18,
                      68.0
                    ],
                    [
                      80.0,
                      50.0
                    ]
                  ],
                  "stroke": "purple",
                  "width": 3.0
                },
                {
                  "points": [
                    [
                      80.0,
                      50.0
                    ],
                    [
                      105.46,
                      75.46
                    ]
                  ],
                  "stroke": "purple",
                  "width": 3.0
                },
                {
                  "points": [
                    [
                      105.46,
                      75.46
                    ],
                    [
                      114.77,
                      40.68
                    ]
                  ],
                  "stroke": "purple",
                  "width": 3.0
                },
                {
                  "points": [
                    [
                      114.77,
                      40.68
                    ],
                    [
                      80.0,
                      50.0
                    ]
                  ],
                  "stroke": "purple",
                  "width": 3.0
                }
              ],
              "circles": [],
              "previewCode": "color(\"purple\")\npensize(3)\nfor petal in range(8):\n    for side in range(3):\n        forward(55)\n        left(120)\n    left(45)"
            }
          ],
          "tip": "Start with one working motif. Repeat it, then change one property at a time."
        }
      ],
      "visuals": [
        {
          "label": "Design A",
          "caption": "One possible design.",
          "paths": [
            {
              "points": [
                [
                  80.0,
                  50.0
                ],
                [
                  106.35,
                  50.0
                ]
              ],
              "stroke": "teal",
              "width": 3.0
            },
            {
              "points": [
                [
                  106.35,
                  50.0
                ],
                [
                  106.35,
                  23.65
                ]
              ],
              "stroke": "teal",
              "width": 3.0
            },
            {
              "points": [
                [
                  106.35,
                  23.65
                ],
                [
                  80.0,
                  23.65
                ]
              ],
              "stroke": "teal",
              "width": 3.0
            },
            {
              "points": [
                [
                  80.0,
                  23.65
                ],
                [
                  80.0,
                  50.0
                ]
              ],
              "stroke": "teal",
              "width": 3.0
            },
            {
              "points": [
                [
                  80.0,
                  50.0
                ],
                [
                  93.18,
                  27.18
                ]
              ],
              "stroke": "teal",
              "width": 3.0
            },
            {
              "points": [
                [
                  93.18,
                  27.18
                ],
                [
                  70.35,
                  14.0
                ]
              ],
              "stroke": "teal",
              "width": 3.0
            },
            {
              "points": [
                [
                  70.35,
                  14.0
                ],
                [
                  57.18,
                  36.82
                ]
              ],
              "stroke": "teal",
              "width": 3.0
            },
            {
              "points": [
                [
                  57.18,
                  36.82
                ],
                [
                  80.0,
                  50.0
                ]
              ],
              "stroke": "teal",
              "width": 3.0
            },
            {
              "points": [
                [
                  80.0,
                  50.0
                ],
                [
                  66.82,
                  27.18
                ]
              ],
              "stroke": "teal",
              "width": 3.0
            },
            {
              "points": [
                [
                  66.82,
                  27.18
                ],
                [
                  44.0,
                  40.35
                ]
              ],
              "stroke": "teal",
              "width": 3.0
            },
            {
              "points": [
                [
                  44.0,
                  40.35
                ],
                [
                  57.18,
                  63.18
                ]
              ],
              "stroke": "teal",
              "width": 3.0
            },
            {
              "points": [
                [
                  57.18,
                  63.18
                ],
                [
                  80.0,
                  50.0
                ]
              ],
              "stroke": "teal",
              "width": 3.0
            },
            {
              "points": [
                [
                  80.0,
                  50.0
                ],
                [
                  53.65,
                  50.0
                ]
              ],
              "stroke": "teal",
              "width": 3.0
            },
            {
              "points": [
                [
                  53.65,
                  50.0
                ],
                [
                  53.65,
                  76.35
                ]
              ],
              "stroke": "teal",
              "width": 3.0
            },
            {
              "points": [
                [
                  53.65,
                  76.35
                ],
                [
                  80.0,
                  76.35
                ]
              ],
              "stroke": "teal",
              "width": 3.0
            },
            {
              "points": [
                [
                  80.0,
                  76.35
                ],
                [
                  80.0,
                  50.0
                ]
              ],
              "stroke": "teal",
              "width": 3.0
            },
            {
              "points": [
                [
                  80.0,
                  50.0
                ],
                [
                  66.82,
                  72.82
                ]
              ],
              "stroke": "teal",
              "width": 3.0
            },
            {
              "points": [
                [
                  66.82,
                  72.82
                ],
                [
                  89.65,
                  86.0
                ]
              ],
              "stroke": "teal",
              "width": 3.0
            },
            {
              "points": [
                [
                  89.65,
                  86.0
                ],
                [
                  102.82,
                  63.18
                ]
              ],
              "stroke": "teal",
              "width": 3.0
            },
            {
              "points": [
                [
                  102.82,
                  63.18
                ],
                [
                  80.0,
                  50.0
                ]
              ],
              "stroke": "teal",
              "width": 3.0
            },
            {
              "points": [
                [
                  80.0,
                  50.0
                ],
                [
                  93.18,
                  72.82
                ]
              ],
              "stroke": "teal",
              "width": 3.0
            },
            {
              "points": [
                [
                  93.18,
                  72.82
                ],
                [
                  116.0,
                  59.65
                ]
              ],
              "stroke": "teal",
              "width": 3.0
            },
            {
              "points": [
                [
                  116.0,
                  59.65
                ],
                [
                  102.82,
                  36.82
                ]
              ],
              "stroke": "teal",
              "width": 3.0
            },
            {
              "points": [
                [
                  102.82,
                  36.82
                ],
                [
                  80.0,
                  50.0
                ]
              ],
              "stroke": "teal",
              "width": 3.0
            }
          ],
          "circles": [],
          "previewCode": "color(\"teal\")\npensize(3)\nfor petal in range(6):\n    for side in range(4):\n        forward(45)\n        left(90)\n    left(60)"
        },
        {
          "label": "Design B",
          "caption": "One possible design.",
          "paths": [
            {
              "points": [
                [
                  80.0,
                  50.0
                ],
                [
                  116.0,
                  50.0
                ]
              ],
              "stroke": "purple",
              "width": 3.0
            },
            {
              "points": [
                [
                  116.0,
                  50.0
                ],
                [
                  98.0,
                  18.82
                ]
              ],
              "stroke": "purple",
              "width": 3.0
            },
            {
              "points": [
                [
                  98.0,
                  18.82
                ],
                [
                  80.0,
                  50.0
                ]
              ],
              "stroke": "purple",
              "width": 3.0
            },
            {
              "points": [
                [
                  80.0,
                  50.0
                ],
                [
                  105.46,
                  24.54
                ]
              ],
              "stroke": "purple",
              "width": 3.0
            },
            {
              "points": [
                [
                  105.46,
                  24.54
                ],
                [
                  70.68,
                  15.23
                ]
              ],
              "stroke": "purple",
              "width": 3.0
            },
            {
              "points": [
                [
                  70.68,
                  15.23
                ],
                [
                  80.0,
                  50.0
                ]
              ],
              "stroke": "purple",
              "width": 3.0
            },
            {
              "points": [
                [
                  80.0,
                  50.0
                ],
                [
                  80.0,
                  14.0
                ]
              ],
              "stroke": "purple",
              "width": 3.0
            },
            {
              "points": [
                [
                  80.0,
                  14.0
                ],
                [
                  48.82,
                  32.0
                ]
              ],
              "stroke": "purple",
              "width": 3.0
            },
            {
              "points": [
                [
                  48.82,
                  32.0
                ],
                [
                  80.0,
                  50.0
                ]
              ],
              "stroke": "purple",
              "width": 3.0
            },
            {
              "points": [
                [
                  80.0,
                  50.0
                ],
                [
                  54.54,
                  24.54
                ]
              ],
              "stroke": "purple",
              "width": 3.0
            },
            {
              "points": [
                [
                  54.54,
                  24.54
                ],
                [
                  45.23,
                  59.32
                ]
              ],
              "stroke": "purple",
              "width": 3.0
            },
            {
              "points": [
                [
                  45.23,
                  59.32
                ],
                [
                  80.0,
                  50.0
                ]
              ],
              "stroke": "purple",
              "width": 3.0
            },
            {
              "points": [
                [
                  80.0,
                  50.0
                ],
                [
                  44.0,
                  50.0
                ]
              ],
              "stroke": "purple",
              "width": 3.0
            },
            {
              "points": [
                [
                  44.0,
                  50.0
                ],
                [
                  62.0,
                  81.18
                ]
              ],
              "stroke": "purple",
              "width": 3.0
            },
            {
              "points": [
                [
                  62.0,
                  81.18
                ],
                [
                  80.0,
                  50.0
                ]
              ],
              "stroke": "purple",
              "width": 3.0
            },
            {
              "points": [
                [
                  80.0,
                  50.0
                ],
                [
                  54.54,
                  75.46
                ]
              ],
              "stroke": "purple",
              "width": 3.0
            },
            {
              "points": [
                [
                  54.54,
                  75.46
                ],
                [
                  89.32,
                  84.77
                ]
              ],
              "stroke": "purple",
              "width": 3.0
            },
            {
              "points": [
                [
                  89.32,
                  84.77
                ],
                [
                  80.0,
                  50.0
                ]
              ],
              "stroke": "purple",
              "width": 3.0
            },
            {
              "points": [
                [
                  80.0,
                  50.0
                ],
                [
                  80.0,
                  86.0
                ]
              ],
              "stroke": "purple",
              "width": 3.0
            },
            {
              "points": [
                [
                  80.0,
                  86.0
                ],
                [
                  111.18,
                  68.0
                ]
              ],
              "stroke": "purple",
              "width": 3.0
            },
            {
              "points": [
                [
                  111.18,
                  68.0
                ],
                [
                  80.0,
                  50.0
                ]
              ],
              "stroke": "purple",
              "width": 3.0
            },
            {
              "points": [
                [
                  80.0,
                  50.0
                ],
                [
                  105.46,
                  75.46
                ]
              ],
              "stroke": "purple",
              "width": 3.0
            },
            {
              "points": [
                [
                  105.46,
                  75.46
                ],
                [
                  114.77,
                  40.68
                ]
              ],
              "stroke": "purple",
              "width": 3.0
            },
            {
              "points": [
                [
                  114.77,
                  40.68
                ],
                [
                  80.0,
                  50.0
                ]
              ],
              "stroke": "purple",
              "width": 3.0
            }
          ],
          "circles": [],
          "previewCode": "color(\"purple\")\npensize(3)\nfor petal in range(8):\n    for side in range(3):\n        forward(55)\n        left(120)\n    left(45)"
        }
      ],
      "outputMode": "drawing"
    },
    {
      "id": "2-6-create-pattern",
      "number": "2.6",
      "title": "Pattern Print Studio",
      "type": "Create",
      "available": true,
      "starter": "",
      "draftVersion": "loops-v1",
      "contentVersion": "loops-v1",
      "purpose": "Combine repeated motifs, turning, color, and line width into an independent pattern.",
      "objective": "Combine repeated motifs, turning, color, and line width into an independent pattern.",
      "notes": "Students type from a blank editor. Check the single repeat before increasing its count. Conference: identify the block, trace one repeat, and predict one deliberate edit. A mistaken first prediction remains saved. Judge creative choices through discussion; the checker grades listed requirements. Only literal range loops and commands are introduced here; variables and functions come later.",
      "check": {
        "execution": true,
        "rules": [
          {
            "type": "loopStructure",
            "label": "Use a running range loop",
            "fail": "Use for NAME in range(COUNT): with an indented block. Counts must be 2–60. Use literal command values in this unit.",
            "min": 1,
            "depth": 1
          },
          {
            "type": "minDrawElements",
            "label": "8+ drawn elements",
            "fail": "Repeat visible lines or circles.",
            "count": 8
          },
          {
            "type": "drawingStyle",
            "label": "Two visible colors; width 3+",
            "fail": "Draw with both colors. Set a width of at least 3.",
            "colors": 2,
            "width": 3
          },
          {
            "type": "drawingBounds",
            "label": "Fits the grid",
            "fail": "Adjust the radius or distances.",
            "limit": 180
          }
        ]
      },
      "steps": [
        {
          "id": "2-6-create-pattern-type",
          "phase": "Type the example",
          "title": "Type and run.",
          "task": "Type the example and Run. Each circle returns to its start; the turn points the next circle in a new direction.",
          "draftId": "example",
          "example": "for petal in range(6):\n    circle(35)\n    left(60)",
          "numbered": true,
          "focusLines": [
            1,
            2,
            3
          ],
          "body": "Use four spaces for each indentation level. Run after the complete block is typed; a header without a body cannot run."
        },
        {
          "id": "2-6-create-pattern-transform",
          "phase": "Change one thing",
          "title": "Build the repeated block.",
          "task": "Add color and pensize before the loop. Change to twelve repeats and a 30° turn. Run.",
          "draftId": "example",
          "example": "color(\"teal\")\npensize(4)\nfor petal in range(12):\n    circle(35)\n    left(30)",
          "numbered": true,
          "body": "",
          "focusLines": [
            1,
            2,
            3,
            4,
            5
          ]
        },
        {
          "id": "2-6-create-pattern-edit",
          "phase": "Change one thing",
          "title": "Test a change.",
          "task": "Change the circle radius to 50. Run. Then try radius 20.",
          "body": "The count controls density; radius controls the size of the motif.",
          "draftId": "example"
        },
        {
          "id": "2-6-create-pattern-predict0",
          "phase": "Predict + run",
          "title": "Predict the result.",
          "task": "Choose an answer, check, then inspect the run.",
          "draftId": "prediction-0",
          "lab": "color(\"teal\")\npensize(4)\nfor petal in range(12):\n    circle(35)\n    left(30)",
          "example": "color(\"teal\")\npensize(4)\nfor petal in range(12):\n    circle(35)\n    left(30)",
          "numbered": true,
          "question": {
            "id": "2-6-create-pattern-q0",
            "prompt": "What changes when the radius doubles?",
            "choices": [
              "The number of circles",
              "The size of every circle",
              "The turning angle"
            ],
            "answer": 1,
            "explanation": "The loop count stays fixed. The circle command uses a larger radius each time."
          }
        },
        {
          "id": "2-6-create-pattern-predict1",
          "phase": "Predict + run",
          "title": "Predict the result.",
          "task": "Choose an answer, check, then inspect the run.",
          "draftId": "prediction-1",
          "lab": "for petal in range(10):\n    circle(30)\n    left(36)",
          "example": "for petal in range(10):\n    circle(30)\n    left(36)",
          "numbered": true,
          "question": {
            "id": "2-6-create-pattern-q1",
            "prompt": "Which count and turn evenly fill one rotation?",
            "choices": [
              "10 and 36°",
              "10 and 30°",
              "12 and 36°"
            ],
            "answer": 0,
            "explanation": "10 × 36° = 360°."
          }
        },
        {
          "id": "2-6-create-pattern-observe",
          "phase": "Record an observation",
          "title": "Save what changed.",
          "task": "Compare the two versions you tested. Record the line you changed and what happened.",
          "draftId": "example",
          "response": {
            "id": "2-6-create-pattern-observation",
            "prompt": "Which line did you change, and what visible result changed?",
            "placeholder": "I changed ___ from ___ to ___. The result ___."
          }
        },
        {
          "id": "2-6-create-pattern-required",
          "phase": "Required assignment",
          "title": "Build the required result.",
          "task": "Build a six-petal circle flower: radius 25, 60° between petals, width at least 3, and a chosen color.",
          "draftId": "assignment-required",
          "typed": true,
          "check": {
            "execution": true,
            "rules": [
              {
                "type": "loopStructure",
                "label": "Use a running range loop",
                "fail": "Use for NAME in range(COUNT): with an indented block. Counts must be 2–60. Use literal command values in this unit.",
                "min": 1,
                "depth": 1
              },
              {
                "type": "exactCalls",
                "label": "6 executed circle commands",
                "fail": "Compare the number of repeated circle commands with the target.",
                "commands": [
                  "circle"
                ],
                "count": 6
              },
              {
                "type": "exactCalls",
                "label": "6 executed left commands",
                "fail": "Compare the number of repeated left commands with the target.",
                "commands": [
                  "left"
                ],
                "count": 6
              },
              {
                "type": "executedNumber",
                "label": "Radius 25",
                "fail": "Use radius 25 for every circle.",
                "commands": [
                  "circle"
                ],
                "value": 25
              },
              {
                "type": "executedNumber",
                "label": "60° turns",
                "fail": "Use a 60° rotation between petals.",
                "commands": [
                  "left"
                ],
                "value": 60
              },
              {
                "type": "drawingStyle",
                "label": "Bold colored petals",
                "fail": "Choose a color and a width of at least 3.",
                "colors": 1,
                "width": 3
              },
              {
                "type": "circleCenters",
                "count": 6,
                "label": "Six distinct petals",
                "fail": "Turn between circles so their centers spread around the start."
              }
            ]
          },
          "requirements": [
            "Use a running range loop",
            "6 executed circle commands",
            "6 executed left commands",
            "Radius 25",
            "60° turns",
            "Bold colored petals",
            "Six distinct petals"
          ],
          "visuals": [
            {
              "label": "Required result",
              "caption": "Match these requirements.",
              "paths": [],
              "circles": [
                {
                  "cx": 80.0,
                  "cy": 32.0,
                  "r": 18.0,
                  "stroke": "coral",
                  "width": 3.0
                },
                {
                  "cx": 64.4115427318801,
                  "cy": 41.0,
                  "r": 18.0,
                  "stroke": "coral",
                  "width": 3.0
                },
                {
                  "cx": 64.4115427318801,
                  "cy": 59.0,
                  "r": 18.0,
                  "stroke": "coral",
                  "width": 3.0
                },
                {
                  "cx": 80.0,
                  "cy": 68.0,
                  "r": 18.0,
                  "stroke": "coral",
                  "width": 3.0
                },
                {
                  "cx": 95.5884572681199,
                  "cy": 59.00000000000001,
                  "r": 18.0,
                  "stroke": "coral",
                  "width": 3.0
                },
                {
                  "cx": 95.5884572681199,
                  "cy": 41.0,
                  "r": 18.0,
                  "stroke": "coral",
                  "width": 3.0
                }
              ],
              "previewCode": "color(\"coral\")\npensize(3)\nfor petal in range(6):\n    circle(25)\n    left(60)"
            }
          ],
          "tip": "Check the repeat count, the turn, and the indentation separately. Run after each repair."
        },
        {
          "id": "2-6-create-pattern-project",
          "phase": "Create your own",
          "title": "Make your own design.",
          "task": "Create a flower, seal, sunburst, or pattern logo. Use a loop, at least eight drawn elements, and two colors that both appear in the drawing. Stay inside the grid.",
          "draftId": "project",
          "typed": true,
          "requirements": [
            "Use a running range loop",
            "8+ drawn elements",
            "Two visible colors; width 3+",
            "Fits the grid"
          ],
          "visuals": [
            {
              "label": "Design A",
              "caption": "One possible design.",
              "paths": [
                {
                  "points": [
                    [
                      80.0,
                      50.0
                    ],
                    [
                      108.29,
                      50.0
                    ]
                  ],
                  "stroke": "coral",
                  "width": 3.0
                },
                {
                  "points": [
                    [
                      108.29,
                      50.0
                    ],
                    [
                      80.0,
                      50.0
                    ]
                  ],
                  "stroke": "coral",
                  "width": 3.0
                },
                {
                  "points": [
                    [
                      80.0,
                      50.0
                    ],
                    [
                      100.0,
                      30.0
                    ]
                  ],
                  "stroke": "coral",
                  "width": 3.0
                },
                {
                  "points": [
                    [
                      100.0,
                      30.0
                    ],
                    [
                      80.0,
                      50.0
                    ]
                  ],
                  "stroke": "coral",
                  "width": 3.0
                },
                {
                  "points": [
                    [
                      80.0,
                      50.0
                    ],
                    [
                      80.0,
                      21.71
                    ]
                  ],
                  "stroke": "coral",
                  "width": 3.0
                },
                {
                  "points": [
                    [
                      80.0,
                      21.71
                    ],
                    [
                      80.0,
                      50.0
                    ]
                  ],
                  "stroke": "coral",
                  "width": 3.0
                },
                {
                  "points": [
                    [
                      80.0,
                      50.0
                    ],
                    [
                      60.0,
                      30.0
                    ]
                  ],
                  "stroke": "coral",
                  "width": 3.0
                },
                {
                  "points": [
                    [
                      60.0,
                      30.0
                    ],
                    [
                      80.0,
                      50.0
                    ]
                  ],
                  "stroke": "coral",
                  "width": 3.0
                },
                {
                  "points": [
                    [
                      80.0,
                      50.0
                    ],
                    [
                      51.71,
                      50.0
                    ]
                  ],
                  "stroke": "coral",
                  "width": 3.0
                },
                {
                  "points": [
                    [
                      51.71,
                      50.0
                    ],
                    [
                      80.0,
                      50.0
                    ]
                  ],
                  "stroke": "coral",
                  "width": 3.0
                },
                {
                  "points": [
                    [
                      80.0,
                      50.0
                    ],
                    [
                      60.0,
                      70.0
                    ]
                  ],
                  "stroke": "coral",
                  "width": 3.0
                },
                {
                  "points": [
                    [
                      60.0,
                      70.0
                    ],
                    [
                      80.0,
                      50.0
                    ]
                  ],
                  "stroke": "coral",
                  "width": 3.0
                },
                {
                  "points": [
                    [
                      80.0,
                      50.0
                    ],
                    [
                      80.0,
                      78.29
                    ]
                  ],
                  "stroke": "coral",
                  "width": 3.0
                },
                {
                  "points": [
                    [
                      80.0,
                      78.29
                    ],
                    [
                      80.0,
                      50.0
                    ]
                  ],
                  "stroke": "coral",
                  "width": 3.0
                },
                {
                  "points": [
                    [
                      80.0,
                      50.0
                    ],
                    [
                      100.0,
                      70.0
                    ]
                  ],
                  "stroke": "coral",
                  "width": 3.0
                },
                {
                  "points": [
                    [
                      100.0,
                      70.0
                    ],
                    [
                      80.0,
                      50.0
                    ]
                  ],
                  "stroke": "coral",
                  "width": 3.0
                }
              ],
              "circles": [
                {
                  "cx": 80.0,
                  "cy": 32.0,
                  "r": 18.0,
                  "stroke": "teal",
                  "width": 3.0
                },
                {
                  "cx": 67.27207793864214,
                  "cy": 37.27207793864214,
                  "r": 18.0,
                  "stroke": "teal",
                  "width": 3.0
                },
                {
                  "cx": 62.0,
                  "cy": 50.0,
                  "r": 18.0,
                  "stroke": "teal",
                  "width": 3.0
                },
                {
                  "cx": 67.27207793864214,
                  "cy": 62.72792206135785,
                  "r": 18.0,
                  "stroke": "teal",
                  "width": 3.0
                },
                {
                  "cx": 80.0,
                  "cy": 68.0,
                  "r": 18.0,
                  "stroke": "teal",
                  "width": 3.0
                },
                {
                  "cx": 92.72792206135786,
                  "cy": 62.72792206135786,
                  "r": 18.0,
                  "stroke": "teal",
                  "width": 3.0
                },
                {
                  "cx": 98.0,
                  "cy": 50.0,
                  "r": 18.0,
                  "stroke": "teal",
                  "width": 3.0
                },
                {
                  "cx": 92.72792206135786,
                  "cy": 37.27207793864215,
                  "r": 18.0,
                  "stroke": "teal",
                  "width": 3.0
                }
              ],
              "previewCode": "pensize(3)\nfor petal in range(8):\n    color(\"teal\")\n    circle(35)\n    color(\"coral\")\n    forward(55)\n    backward(55)\n    left(45)"
            },
            {
              "label": "Design B",
              "caption": "One possible design.",
              "paths": [],
              "circles": [
                {
                  "cx": 80.0,
                  "cy": 32.0,
                  "r": 18.0,
                  "stroke": "purple",
                  "width": 3.0
                },
                {
                  "cx": 80.0,
                  "cy": 41.36,
                  "r": 8.64,
                  "stroke": "goldenrod",
                  "width": 3.0
                },
                {
                  "cx": 69.41986545873549,
                  "cy": 35.43769410125095,
                  "r": 18.0,
                  "stroke": "purple",
                  "width": 3.0
                },
                {
                  "cx": 74.92153542019304,
                  "cy": 43.010093168600456,
                  "r": 8.64,
                  "stroke": "goldenrod",
                  "width": 3.0
                },
                {
                  "cx": 62.880982706687234,
                  "cy": 44.43769410125095,
                  "r": 18.0,
                  "stroke": "purple",
                  "width": 3.0
                },
                {
                  "cx": 71.78287169920988,
                  "cy": 47.330093168600456,
                  "r": 8.64,
                  "stroke": "goldenrod",
                  "width": 3.0
                },
                {
                  "cx": 62.880982706687234,
                  "cy": 55.56230589874905,
                  "r": 18.0,
                  "stroke": "purple",
                  "width": 3.0
                },
                {
                  "cx": 71.78287169920988,
                  "cy": 52.669906831399544,
                  "r": 8.64,
                  "stroke": "goldenrod",
                  "width": 3.0
                },
                {
                  "cx": 69.41986545873549,
                  "cy": 64.56230589874905,
                  "r": 18.0,
                  "stroke": "purple",
                  "width": 3.0
                },
                {
                  "cx": 74.92153542019304,
                  "cy": 56.989906831399544,
                  "r": 8.64,
                  "stroke": "goldenrod",
                  "width": 3.0
                },
                {
                  "cx": 80.0,
                  "cy": 68.0,
                  "r": 18.0,
                  "stroke": "purple",
                  "width": 3.0
                },
                {
                  "cx": 80.0,
                  "cy": 58.64,
                  "r": 8.64,
                  "stroke": "goldenrod",
                  "width": 3.0
                },
                {
                  "cx": 90.58013454126451,
                  "cy": 64.56230589874906,
                  "r": 18.0,
                  "stroke": "purple",
                  "width": 3.0
                },
                {
                  "cx": 85.07846457980696,
                  "cy": 56.989906831399544,
                  "r": 8.64,
                  "stroke": "goldenrod",
                  "width": 3.0
                },
                {
                  "cx": 97.11901729331277,
                  "cy": 55.56230589874906,
                  "r": 18.0,
                  "stroke": "purple",
                  "width": 3.0
                },
                {
                  "cx": 88.21712830079012,
                  "cy": 52.669906831399544,
                  "r": 8.64,
                  "stroke": "goldenrod",
                  "width": 3.0
                },
                {
                  "cx": 97.11901729331277,
                  "cy": 44.43769410125095,
                  "r": 18.0,
                  "stroke": "purple",
                  "width": 3.0
                },
                {
                  "cx": 88.21712830079012,
                  "cy": 47.330093168600456,
                  "r": 8.64,
                  "stroke": "goldenrod",
                  "width": 3.0
                },
                {
                  "cx": 90.58013454126453,
                  "cy": 35.43769410125095,
                  "r": 18.0,
                  "stroke": "purple",
                  "width": 3.0
                },
                {
                  "cx": 85.07846457980698,
                  "cy": 43.010093168600456,
                  "r": 8.64,
                  "stroke": "goldenrod",
                  "width": 3.0
                }
              ],
              "previewCode": "pensize(3)\nfor petal in range(10):\n    color(\"purple\")\n    circle(25)\n    color(\"goldenrod\")\n    circle(12)\n    left(36)"
            }
          ],
          "tip": "Start with one working motif. Repeat it, then change one property at a time."
        }
      ],
      "visuals": [
        {
          "label": "Design A",
          "caption": "One possible design.",
          "paths": [
            {
              "points": [
                [
                  80.0,
                  50.0
                ],
                [
                  108.29,
                  50.0
                ]
              ],
              "stroke": "coral",
              "width": 3.0
            },
            {
              "points": [
                [
                  108.29,
                  50.0
                ],
                [
                  80.0,
                  50.0
                ]
              ],
              "stroke": "coral",
              "width": 3.0
            },
            {
              "points": [
                [
                  80.0,
                  50.0
                ],
                [
                  100.0,
                  30.0
                ]
              ],
              "stroke": "coral",
              "width": 3.0
            },
            {
              "points": [
                [
                  100.0,
                  30.0
                ],
                [
                  80.0,
                  50.0
                ]
              ],
              "stroke": "coral",
              "width": 3.0
            },
            {
              "points": [
                [
                  80.0,
                  50.0
                ],
                [
                  80.0,
                  21.71
                ]
              ],
              "stroke": "coral",
              "width": 3.0
            },
            {
              "points": [
                [
                  80.0,
                  21.71
                ],
                [
                  80.0,
                  50.0
                ]
              ],
              "stroke": "coral",
              "width": 3.0
            },
            {
              "points": [
                [
                  80.0,
                  50.0
                ],
                [
                  60.0,
                  30.0
                ]
              ],
              "stroke": "coral",
              "width": 3.0
            },
            {
              "points": [
                [
                  60.0,
                  30.0
                ],
                [
                  80.0,
                  50.0
                ]
              ],
              "stroke": "coral",
              "width": 3.0
            },
            {
              "points": [
                [
                  80.0,
                  50.0
                ],
                [
                  51.71,
                  50.0
                ]
              ],
              "stroke": "coral",
              "width": 3.0
            },
            {
              "points": [
                [
                  51.71,
                  50.0
                ],
                [
                  80.0,
                  50.0
                ]
              ],
              "stroke": "coral",
              "width": 3.0
            },
            {
              "points": [
                [
                  80.0,
                  50.0
                ],
                [
                  60.0,
                  70.0
                ]
              ],
              "stroke": "coral",
              "width": 3.0
            },
            {
              "points": [
                [
                  60.0,
                  70.0
                ],
                [
                  80.0,
                  50.0
                ]
              ],
              "stroke": "coral",
              "width": 3.0
            },
            {
              "points": [
                [
                  80.0,
                  50.0
                ],
                [
                  80.0,
                  78.29
                ]
              ],
              "stroke": "coral",
              "width": 3.0
            },
            {
              "points": [
                [
                  80.0,
                  78.29
                ],
                [
                  80.0,
                  50.0
                ]
              ],
              "stroke": "coral",
              "width": 3.0
            },
            {
              "points": [
                [
                  80.0,
                  50.0
                ],
                [
                  100.0,
                  70.0
                ]
              ],
              "stroke": "coral",
              "width": 3.0
            },
            {
              "points": [
                [
                  100.0,
                  70.0
                ],
                [
                  80.0,
                  50.0
                ]
              ],
              "stroke": "coral",
              "width": 3.0
            }
          ],
          "circles": [
            {
              "cx": 80.0,
              "cy": 32.0,
              "r": 18.0,
              "stroke": "teal",
              "width": 3.0
            },
            {
              "cx": 67.27207793864214,
              "cy": 37.27207793864214,
              "r": 18.0,
              "stroke": "teal",
              "width": 3.0
            },
            {
              "cx": 62.0,
              "cy": 50.0,
              "r": 18.0,
              "stroke": "teal",
              "width": 3.0
            },
            {
              "cx": 67.27207793864214,
              "cy": 62.72792206135785,
              "r": 18.0,
              "stroke": "teal",
              "width": 3.0
            },
            {
              "cx": 80.0,
              "cy": 68.0,
              "r": 18.0,
              "stroke": "teal",
              "width": 3.0
            },
            {
              "cx": 92.72792206135786,
              "cy": 62.72792206135786,
              "r": 18.0,
              "stroke": "teal",
              "width": 3.0
            },
            {
              "cx": 98.0,
              "cy": 50.0,
              "r": 18.0,
              "stroke": "teal",
              "width": 3.0
            },
            {
              "cx": 92.72792206135786,
              "cy": 37.27207793864215,
              "r": 18.0,
              "stroke": "teal",
              "width": 3.0
            }
          ],
          "previewCode": "pensize(3)\nfor petal in range(8):\n    color(\"teal\")\n    circle(35)\n    color(\"coral\")\n    forward(55)\n    backward(55)\n    left(45)"
        },
        {
          "label": "Design B",
          "caption": "One possible design.",
          "paths": [],
          "circles": [
            {
              "cx": 80.0,
              "cy": 32.0,
              "r": 18.0,
              "stroke": "purple",
              "width": 3.0
            },
            {
              "cx": 80.0,
              "cy": 41.36,
              "r": 8.64,
              "stroke": "goldenrod",
              "width": 3.0
            },
            {
              "cx": 69.41986545873549,
              "cy": 35.43769410125095,
              "r": 18.0,
              "stroke": "purple",
              "width": 3.0
            },
            {
              "cx": 74.92153542019304,
              "cy": 43.010093168600456,
              "r": 8.64,
              "stroke": "goldenrod",
              "width": 3.0
            },
            {
              "cx": 62.880982706687234,
              "cy": 44.43769410125095,
              "r": 18.0,
              "stroke": "purple",
              "width": 3.0
            },
            {
              "cx": 71.78287169920988,
              "cy": 47.330093168600456,
              "r": 8.64,
              "stroke": "goldenrod",
              "width": 3.0
            },
            {
              "cx": 62.880982706687234,
              "cy": 55.56230589874905,
              "r": 18.0,
              "stroke": "purple",
              "width": 3.0
            },
            {
              "cx": 71.78287169920988,
              "cy": 52.669906831399544,
              "r": 8.64,
              "stroke": "goldenrod",
              "width": 3.0
            },
            {
              "cx": 69.41986545873549,
              "cy": 64.56230589874905,
              "r": 18.0,
              "stroke": "purple",
              "width": 3.0
            },
            {
              "cx": 74.92153542019304,
              "cy": 56.989906831399544,
              "r": 8.64,
              "stroke": "goldenrod",
              "width": 3.0
            },
            {
              "cx": 80.0,
              "cy": 68.0,
              "r": 18.0,
              "stroke": "purple",
              "width": 3.0
            },
            {
              "cx": 80.0,
              "cy": 58.64,
              "r": 8.64,
              "stroke": "goldenrod",
              "width": 3.0
            },
            {
              "cx": 90.58013454126451,
              "cy": 64.56230589874906,
              "r": 18.0,
              "stroke": "purple",
              "width": 3.0
            },
            {
              "cx": 85.07846457980696,
              "cy": 56.989906831399544,
              "r": 8.64,
              "stroke": "goldenrod",
              "width": 3.0
            },
            {
              "cx": 97.11901729331277,
              "cy": 55.56230589874906,
              "r": 18.0,
              "stroke": "purple",
              "width": 3.0
            },
            {
              "cx": 88.21712830079012,
              "cy": 52.669906831399544,
              "r": 8.64,
              "stroke": "goldenrod",
              "width": 3.0
            },
            {
              "cx": 97.11901729331277,
              "cy": 44.43769410125095,
              "r": 18.0,
              "stroke": "purple",
              "width": 3.0
            },
            {
              "cx": 88.21712830079012,
              "cy": 47.330093168600456,
              "r": 8.64,
              "stroke": "goldenrod",
              "width": 3.0
            },
            {
              "cx": 90.58013454126453,
              "cy": 35.43769410125095,
              "r": 18.0,
              "stroke": "purple",
              "width": 3.0
            },
            {
              "cx": 85.07846457980698,
              "cy": 43.010093168600456,
              "r": 8.64,
              "stroke": "goldenrod",
              "width": 3.0
            }
          ],
          "previewCode": "pensize(3)\nfor petal in range(10):\n    color(\"purple\")\n    circle(25)\n    color(\"goldenrod\")\n    circle(12)\n    left(36)"
        }
      ],
      "outputMode": "drawing"
    }
  ]
};
  var i=window.PYTHON_COURSE.units.findIndex(function(u){return u.id===unit.id;});
  window.PYTHON_COURSE.units[i]=unit;
})();
