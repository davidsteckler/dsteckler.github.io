window.PYTHON_COURSE = {
  "title": "Python Turtle",
  "subtitle": "Make one. Solve one. Create one.",
  "units": [
    {
      "id": "unit-1",
      "number": "1",
      "title": "Turtle Basics",
      "description": "Five skill sets. Each one follows Make → Solve → Create: movement, patterns, sequencing, style, and text art.",
      "lessons": [
        {
          "id": "1-1-make-path",
          "number": "1.1",
          "title": "Make a Path",
          "type": "Make",
          "available": true,
          "notes": "Introduce forward/backward and left/right. Conference by asking students to point to the line causing a visible change. Keep emphasis on run-after-small-change.",
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
              "title": "Challenge: Make a zigzag route.",
              "body": "Think stair, lightning bolt, or crooked path.",
              "task": "Use 4+ movement commands, 2+ turns, backward() at least once, and 2 different distances.",
              "tip": "Example: a long segment, a turn, a shorter segment, another turn, then back up. Make your version different."
            }
          ],
          "group": "Movement"
        },
        {
          "id": "1-2-solve-route",
          "number": "1.2",
          "title": "Route Puzzle",
          "type": "Solve",
          "available": true,
          "notes": "First real reduction in scaffolding. Do not give the closing sequence. If stuck, ask what side is missing and which existing distance matches it.",
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
              "title": "Solve it a different way.",
              "body": "Reset the lesson, then try the original puzzle again.",
              "task": "Find a second working solution that still closes the shape.",
              "tip": "More than one sequence of turns and movements can reach the same final state."
            }
          ],
          "group": "Movement"
        },
        {
          "id": "1-3-create-route",
          "number": "1.3",
          "title": "Route Designer",
          "type": "Create",
          "available": true,
          "notes": "Check requirements rather than appearance. Students should choose the route. Encourage clean runs and explain only when conferencing.",
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
              "title": "Test from a clean start.",
              "body": "A finished program should work when run from the beginning.",
              "task": "Press Clear Run, then Run once.",
              "tip": "If the clean run looks different from what you expected, inspect the first place the route goes wrong."
            }
          ],
          "group": "Movement"
        },
        {
          "id": "1-4-make-bubbles",
          "number": "1.4",
          "title": "Make a Bubble Trail",
          "type": "Make",
          "available": true,
          "notes": "Teach circle radius separately from movement distance. Keep placement language concrete: move first, then draw.",
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
              "title": "Challenge: Make a growing bubble curve.",
              "body": "Your bubbles should get bigger as the trail bends.",
              "task": "Use 4 circles, make every circle larger than the last, move between each one, and turn at least once.",
              "tip": "Example shape: four bubbles climbing around a corner. You choose the sizes, gaps, and turn."
            }
          ],
          "group": "Circles + Patterns"
        },
        {
          "id": "1-5-solve-bubbles",
          "number": "1.5",
          "title": "Bubble Pattern Puzzle",
          "type": "Solve",
          "available": true,
          "notes": "Let students find the broken spacing value before opening the hint. Focus on comparing repeated parameters.",
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
              "title": "Leave one clean solution.",
              "body": "Choose whichever version you prefer.",
              "task": "Run from a clean start and keep all four bubbles visible.",
              "tip": "The final code should satisfy the pattern without needing an exact target image."
            }
          ],
          "group": "Circles + Patterns"
        },
        {
          "id": "1-6-create-bubbles",
          "number": "1.6",
          "title": "Bubble Design",
          "type": "Create",
          "available": true,
          "notes": "Open-ended application of circle, movement, and turning. Assess whether requirements are met, not whether drawings look alike.",
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
              "title": "Test the finished design.",
              "body": "The program should work from the top without manual setup.",
              "task": "Press Clear Run, then Run once.",
              "tip": "Keep the version that produces your intended design from a clean start."
            }
          ],
          "group": "Circles + Patterns"
        },
        {
          "id": "1-7-make-sequence",
          "number": "1.7",
          "title": "Make Sense of Sequence",
          "type": "Make",
          "available": true,
          "notes": "Use Step heavily here. The goal is seeing that each line inherits the turtle's current position and direction.",
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
              "title": "Challenge: Make a 3-segment zigzag.",
              "body": "Use exactly the same five commands: 3 movements and 2 turns.",
              "task": "Reorder them so the path changes direction twice and all 3 segments are visible.",
              "tip": "A zigzag could go right → up → right, but yours does not have to."
            }
          ],
          "group": "Sequence + Debugging"
        },
        {
          "id": "1-8-solve-debug",
          "number": "1.8",
          "title": "Debug Challenge",
          "type": "Solve",
          "available": true,
          "notes": "Have students fix one error at a time and rerun. Distinguish syntax/name errors from a program that runs but does the wrong thing.",
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
              "title": "Leave a clean solution.",
              "body": "All five lines should be valid and the drawing should be symmetric.",
              "task": "Clear Run, then Run once.",
              "tip": "The final test should produce no error message."
            }
          ],
          "group": "Sequence + Debugging"
        },
        {
          "id": "1-9-create-five-lines",
          "number": "1.9",
          "title": "Five-Line Drawing",
          "type": "Create",
          "available": true,
          "notes": "Constraint challenge. Do not suggest a target image. The five-command limit forces students to choose commands intentionally.",
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
              "title": "Test the final five lines.",
              "body": "The drawing should work from a clean start.",
              "task": "Press Clear Run, then Run once.",
              "tip": "Keep exactly five executable Turtle commands."
            }
          ],
          "group": "Sequence + Debugging"
        },
        {
          "id": "1-10-make-color",
          "number": "1.10",
          "title": "Make a Neon Lightning Bolt",
          "type": "Make",
          "available": true,
          "notes": "Concrete style lesson. Students build one recognizable neon bolt while learning that bgcolor(), color(), and pensize() change the appearance of later drawing. Keep each change visible and purposeful.",
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
              "title": "Challenge: finish the neon bolt.",
              "body": "Make it look like one deliberate lightning bolt on a dark background.",
              "task": "Use 5+ segments, 4+ turns, 3 drawing colors, and 2 different pensize() values.",
              "tip": "Your bolt can be tall, wide, or uneven. The examples show different structures."
            }
          ],
          "group": "Color + Style"
        },
        {
          "id": "1-11-solve-style",
          "number": "1.11",
          "title": "Repair the Neon Sign",
          "type": "Solve",
          "available": true,
          "notes": "Broken-style puzzle. Students should diagnose invisible output, weak line weight, and missing color state. The route itself is already valid; keep focus on appearance and command order.",
          "check": {
            "rules": [
              {
                "type": "minCalls",
                "commands": [
                  "bgcolor"
                ],
                "count": 1,
                "fail": "Keep a background color.",
                "label": "Background stays set"
              },
              {
                "type": "minDistinctStrings",
                "commands": [
                  "color"
                ],
                "count": 3,
                "fail": "Use three different drawing colors.",
                "label": "3 visible drawing colors"
              },
              {
                "type": "someNumberGreaterThan",
                "commands": [
                  "pensize"
                ],
                "value": 3,
                "fail": "Make the neon line thicker than 3.",
                "label": "pensize() above 3"
              },
              {
                "type": "minCalls",
                "commands": [
                  "forward",
                  "backward"
                ],
                "count": 3,
                "fail": "Keep all three movement segments.",
                "label": "3 sign segments"
              },
              {
                "type": "minCalls",
                "commands": [
                  "left",
                  "right"
                ],
                "count": 2,
                "fail": "Keep both turns.",
                "label": "2 turns"
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
          ]
        },
        {
          "id": "1-12-create-night",
          "number": "1.12",
          "title": "Design an Arcade Badge",
          "type": "Create",
          "available": true,
          "notes": "Open style capstone. Students choose a recognizable badge direction—bolt, maze, signal, or another angular icon. Requirements assess use of style and movement without prescribing one drawing.",
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
              "title": "Final challenge: make it feel intentional.",
              "body": "Your badge should read as one symbol when you look at the Turtle world.",
              "task": "Clear Run, run it from the top, and check your code.",
              "tip": "Bolt, maze, signal, letter-like mark, and invented arcade symbols all work."
            }
          ],
          "group": "Color + Style"
        },
        {
          "id": "1-13-make-ascii",
          "number": "1.13",
          "title": "Make Block Art",
          "type": "Make",
          "available": true,
          "notes": "Introduce print() as visible output. Keep the focus on one printed line at a time and on spacing. Unicode block characters are intentional; students should see that text can be used as a visual medium.",
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
          "paletteIntro": "Click a symbol to insert it at your code cursor and copy it too. Paste it again with Ctrl+V / Cmd+V."
        },
        {
          "id": "1-14-solve-ascii",
          "number": "1.14",
          "title": "ASCII Repair",
          "type": "Solve",
          "available": true,
          "notes": "This is a spacing and sequencing puzzle. Students should use the output as feedback. Do not provide the completed strings unless needed for accessibility support.",
          "check": {
            "rules": [
              {
                "type": "minCalls",
                "commands": [
                  "print"
                ],
                "count": 5,
                "fail": "Keep all five printed rows.",
                "label": "5 printed rows"
              },
              {
                "type": "requiresPrintString",
                "value": "  ███  ",
                "fail": "Repair the top row.",
                "label": "Top row repaired"
              },
              {
                "type": "requiresPrintString",
                "value": " █   █ ",
                "fail": "Repair the matching side row.",
                "label": "Side row repaired"
              },
              {
                "type": "requiresPrintString",
                "value": "  ███  ",
                "min": 2,
                "fail": "The top and bottom rows should match.",
                "label": "Top and bottom match"
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
          "paletteIntro": "Click a symbol to insert it at your code cursor and copy it too. Paste it again with Ctrl+V / Cmd+V."
        },
        {
          "id": "1-15-create-ascii",
          "number": "1.15",
          "title": "ASCII Badge",
          "type": "Create",
          "available": true,
          "notes": "Open-ended text-art challenge. Celebrate variation. Students can use Unicode block characters or ordinary keyboard symbols. The checker should enforce structure, not an exact image.",
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
          "paletteIntro": "Click a symbol to insert it at your code cursor and copy it too. Paste it again with Ctrl+V / Cmd+V."
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
