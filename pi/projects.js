window.PI_PROJECTS = [
  {
    "id": "terminal-badge",
    "title": "Terminal identity badge",
    "level": "Beginner",
    "category": "Python & Linux",
    "minutes": "25–40",
    "summary": "Make a text badge that responds to your name.",
    "skills": [
      "print",
      "input",
      "f-strings"
    ],
    "needs": [
      "Raspberry Pi 4 or 5",
      "Raspberry Pi OS desktop",
      "Monitor, keyboard, mouse"
    ],
    "prereq": "No Python experience needed.",
    "sources": [
      {
        "title": "Raspberry Pi: About me",
        "url": "https://projects.raspberrypi.org/en/projects/about-me"
      },
      {
        "title": "Python: input and print",
        "url": "https://docs.python.org/3/library/functions.html#input"
      }
    ],
    "small": "print(\"+------------------+\")\nprint(\"|   PI MAKER LAB   |\")\nprint(\"+------------------+\")\n",
    "code": "name = input(\"Your first name: \")\nproject = input(\"What will you build? \")\nwidth = max(len(name), len(project), 18) + 4\nprint(\"+\" + \"-\" * width + \"+\")\nprint(\"|\" + name.center(width) + \"|\")\nprint(\"|\" + project.center(width) + \"|\")\nprint(\"+\" + \"-\" * width + \"+\")\n",
    "build": "Run the three print lines first. In the next checkpoint replace the file with the complete example to add input and a border that grows.",
    "expected": "A three-line badge appears. The complete version asks two questions and puts your answers inside a border.",
    "change": "Change PI MAKER LAB to your own heading. Run again.",
    "predict": [
      "What will width do when you enter a very long project name?",
      [
        "Grow so the border fits",
        "Stay 18 forever",
        "Delete the name"
      ],
      0,
      "max() chooses the longest value, then adds space."
    ],
    "solve": [
      "Make the border use = along the top and bottom.",
      "Keep both answers inside the border.",
      "Test one short and one long answer."
    ],
    "create": [
      "Add a third question.",
      "Display all three answers inside one border.",
      "Make the border adjust to the longest answer."
    ],
    "wiring": [],
    "trouble": "Click in the Thonny Shell before typing an answer. Quotation marks must stay paired.",
    "setup": "",
    "smallExpected": "A three-line PI MAKER LAB badge prints in the Shell.",
    "walkthrough": [
      {
        "line": 1,
        "text": "Collect two answers. input() pauses and returns the text you type."
      },
      {
        "line": 3,
        "text": "Choose a width from the longest answer. The same width is used for every row."
      },
      {
        "line": 4,
        "text": "Repeat the border character and center the answers inside it."
      }
    ],
    "addedLines": [
      1,
      2,
      3,
      4,
      5,
      6,
      7
    ]
  },
  {
    "id": "number-guess",
    "title": "Number guessing game",
    "level": "Beginner",
    "category": "Python & Linux",
    "minutes": "35–50",
    "summary": "Build a game that gives useful hints after each guess.",
    "skills": [
      "random",
      "while",
      "if",
      "input validation"
    ],
    "needs": [
      "Raspberry Pi 4 or 5",
      "Raspberry Pi OS desktop",
      "Monitor, keyboard, mouse"
    ],
    "prereq": "Terminal identity badge.",
    "sources": [
      {
        "title": "Raspberry Pi: Guess the number",
        "url": "https://projects.raspberrypi.org/en/projects/cd-beginner-python-sushi"
      },
      {
        "title": "Python: random",
        "url": "https://docs.python.org/3/library/random.html"
      }
    ],
    "small": "from random import randint\nsecret = randint(1, 20)\nprint(\"A secret number from 1 to 20 is ready.\")\nprint(\"Test number:\", secret)\n",
    "code": "from random import randint\nsecret = randint(1, 20)\nattempts = 0\nwhile True:\n    text = input(\"Guess 1 to 20: \")\n    if not text.isdigit():\n        print(\"Use a whole number.\")\n        continue\n    guess = int(text)\n    attempts += 1\n    if guess == secret:\n        print(f\"Found it in {attempts} guesses!\")\n        break\n    print(\"Too low\" if guess < secret else \"Too high\")\n",
    "build": "Run the random-number example twice. Then use the complete example to add repeated guesses and hints.",
    "expected": "The starter prints a test number. The complete game keeps asking until the guess matches and reports the attempt count.",
    "change": "Change the random range to 1–10 in the starter and run it several times.",
    "predict": [
      "If the secret is 12 and the guess is 8, which message appears?",
      [
        "Too high",
        "Too low",
        "Found it"
      ],
      1,
      "8 is less than 12, so the lower branch prints Too low."
    ],
    "solve": [
      "Change both the number range and the prompt to 1–50.",
      "Reject numbers outside 1–50 without counting them.",
      "Keep the correct-answer message."
    ],
    "create": [
      "Limit the player to six valid attempts.",
      "Show attempts remaining.",
      "Reveal the secret when the player runs out."
    ],
    "wiring": [],
    "trouble": "input() returns text. Convert it with int() only after checking it is a number.",
    "setup": "",
    "smallExpected": "A random whole number between 1 and 20 prints as a test value. There is no guessing input yet.",
    "walkthrough": [
      {
        "line": 4,
        "text": "Keep accepting guesses until a correct answer reaches break."
      },
      {
        "line": 6,
        "text": "Reject text that cannot become a nonnegative whole number before using int()."
      },
      {
        "line": 11,
        "text": "Compare the guess with the secret, then choose a success message or a directional hint."
      }
    ],
    "addedLines": [
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14
    ]
  },
  {
    "id": "file-sorter",
    "title": "Sort a practice folder",
    "level": "Intermediate",
    "category": "Python & Linux",
    "minutes": "40–60",
    "summary": "Use Python to plan and organize files by extension.",
    "skills": [
      "pathlib",
      "files",
      "conditions",
      "dry run"
    ],
    "needs": [
      "Raspberry Pi 4 or 5",
      "Raspberry Pi OS desktop",
      "Monitor, keyboard, mouse"
    ],
    "prereq": "Loops, if statements, and variables.",
    "sources": [
      {
        "title": "Python: pathlib",
        "url": "https://docs.python.org/3/library/pathlib.html"
      }
    ],
    "small": "from pathlib import Path\nfolder = Path.home() / \"pi-sort-practice\"\nfolder.mkdir(exist_ok=True)\n(folder / \"note.txt\").touch(exist_ok=True)\nprint(\"Practice folder:\", folder)\nfor item in folder.iterdir():\n    print(item.name)\n",
    "code": "from pathlib import Path\nfolder = Path.home() / \"pi-sort-practice\"\nfolder.mkdir(exist_ok=True)\ndry_run = True\nfor item in sorted(folder.iterdir()):\n    if not item.is_file():\n        continue\n    group = item.suffix.lower().lstrip(\".\") or \"no-extension\"\n    target = folder / group / item.name\n    if target.exists():\n        print(\"Skip existing:\", target.name)\n        continue\n    print(item.name, \"->\", group)\n    if not dry_run:\n        target.parent.mkdir(exist_ok=True)\n        item.rename(target)\nprint(\"Plan only\" if dry_run else \"Files sorted\")\n",
    "build": "Run the starter to create a practice folder and note.txt. Use File Manager to add a copy of an image. Then run the complete example with dry_run still True.",
    "expected": "The starter lists files. The complete example prints a plan; files move only after you set dry_run = False.",
    "change": "Add a second .txt file with File Manager and run the plan again.",
    "predict": [
      "What happens while dry_run is True?",
      [
        "Files are deleted",
        "Only the plan prints",
        "Files move immediately"
      ],
      1,
      "The rename call is inside if not dry_run."
    ],
    "solve": [
      "Sort copies of a .txt and a .png file.",
      "Check the plan before setting dry_run to False.",
      "Run twice; the second run must leave the sorted folders alone."
    ],
    "create": [
      "Add a category that groups png and jpg together.",
      "Handle an extensionless file.",
      "Print how many files actually moved."
    ],
    "wiring": [],
    "trouble": "Work inside pi-sort-practice with copies. If nothing prints, files may already be inside their category folders.",
    "setup": "",
    "smallExpected": "A pi-sort-practice folder and note.txt are created inside your home folder. The file name prints.",
    "walkthrough": [
      {
        "line": 5,
        "text": "Loop over the practice folder. Skip directories so already-sorted groups stay in place."
      },
      {
        "line": 8,
        "text": "Turn an extension into a folder name and calculate the destination."
      },
      {
        "line": 14,
        "text": "Move the file only when dry_run is False. The plan still prints before the move."
      }
    ],
    "addedLines": [
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17
    ]
  },
  {
    "id": "pi-data-log",
    "title": "Pi health data logger",
    "level": "Intermediate",
    "category": "Python & Linux",
    "minutes": "40–60",
    "summary": "Measure the Pi’s CPU temperature and save a CSV.",
    "skills": [
      "csv",
      "time",
      "pathlib",
      "data collection"
    ],
    "needs": [
      "Raspberry Pi 4 or 5",
      "Raspberry Pi OS desktop",
      "Monitor, keyboard, mouse"
    ],
    "prereq": "Loops and variables.",
    "sources": [
      {
        "title": "GPIO Zero: internal devices",
        "url": "https://gpiozero.readthedocs.io/en/stable/api_internal.html"
      },
      {
        "title": "Python: CSV",
        "url": "https://docs.python.org/3/library/csv.html"
      }
    ],
    "small": "from gpiozero import CPUTemperature\ncpu = CPUTemperature()\nprint(f\"CPU: {cpu.temperature:.1f} C\")\n",
    "code": "from gpiozero import CPUTemperature\nfrom pathlib import Path\nfrom datetime import datetime\nfrom time import sleep\nimport csv\ncpu = CPUTemperature()\npath = Path.home() / \"pi-health.csv\"\nnew_file = not path.exists() or path.stat().st_size == 0\nwith path.open(\"a\", newline=\"\") as file:\n    writer = csv.writer(file)\n    if new_file:\n        writer.writerow([\"timestamp\", \"cpu_celsius\"])\n    for sample in range(10):\n        row = [datetime.now().isoformat(timespec=\"seconds\"), round(cpu.temperature, 1)]\n        writer.writerow(row)\n        file.flush()\n        print(*row)\n        sleep(2)\nprint(\"Saved:\", path)\n",
    "build": "Run one temperature reading. Then use the complete example to collect ten readings in your home folder.",
    "expected": "Ten timestamped readings appear about two seconds apart. Open pi-health.csv in a text editor or spreadsheet.",
    "change": "Change sleep(2) to sleep(1) and compare the timestamp gaps.",
    "predict": [
      "What does opening the file with \"a\" do?",
      [
        "Append new rows",
        "Erase all old rows",
        "Read only"
      ],
      0,
      "Append mode keeps existing rows and adds new ones."
    ],
    "solve": [
      "Collect 15 samples one second apart.",
      "Keep one header row when running twice.",
      "Verify 30 new data rows across the two runs."
    ],
    "create": [
      "Make a second Python program read the CSV.",
      "Print minimum, maximum, and mean CPU temperature.",
      "Label these as CPU measurements, not room temperature."
    ],
    "wiring": [],
    "trouble": "CPUTemperature needs a real Pi. A CPU sensor measures the processor; it does not measure room temperature.",
    "setup": "gpio",
    "smallExpected": "One CPU temperature reading prints in degrees Celsius. No CSV is written yet.",
    "walkthrough": [
      {
        "line": 8,
        "text": "Check whether the CSV needs a header before opening it in append mode."
      },
      {
        "line": 13,
        "text": "Collect ten real processor readings with a timestamp for each."
      },
      {
        "line": 15,
        "text": "Write and flush each row so you can open the saved data afterward."
      }
    ],
    "addedLines": [
      2,
      3,
      4,
      5,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19
    ]
  },
  {
    "id": "bouncing-ball",
    "title": "Bouncing ball",
    "level": "Beginner",
    "category": "Pygame",
    "minutes": "40–60",
    "summary": "Animate a ball and make it rebound from the window edges.",
    "skills": [
      "game loop",
      "coordinates",
      "velocity"
    ],
    "needs": [
      "Raspberry Pi 4 or 5",
      "Raspberry Pi OS desktop",
      "Monitor, keyboard, mouse"
    ],
    "prereq": "Variables and if statements.",
    "sources": [
      {
        "title": "Pygame: quick start",
        "url": "https://www.pygame.org/docs/"
      },
      {
        "title": "Pygame: drawing",
        "url": "https://www.pygame.org/docs/ref/draw.html"
      }
    ],
    "small": "import pygame\nfrom random import randint\npygame.init()\nscreen = pygame.display.set_mode((640, 480))\npygame.display.set_caption(\"Pi Python Lab\")\nclock = pygame.time.Clock()\nfont = pygame.font.Font(None, 30)\nx, y = 100, 100\nrunning = True\nwhile running:\n    for event in pygame.event.get():\n        if event.type == pygame.QUIT:\n            running = False\n        if event.type == pygame.KEYDOWN and event.key == pygame.K_ESCAPE:\n            running = False\n    keys = pygame.key.get_pressed()\n    pass\n    screen.fill((20, 37, 42))\n    pygame.draw.circle(screen, (214, 237, 147), (x, y), 15)\n    pygame.display.flip()\n    clock.tick(60)\npygame.quit()\n",
    "code": "import pygame\nfrom random import randint\npygame.init()\nscreen = pygame.display.set_mode((640, 480))\npygame.display.set_caption(\"Pi Python Lab\")\nclock = pygame.time.Clock()\nfont = pygame.font.Font(None, 30)\nx, y = 100, 100\nvx, vy = 4, 3\nrunning = True\nwhile running:\n    for event in pygame.event.get():\n        if event.type == pygame.QUIT:\n            running = False\n        if event.type == pygame.KEYDOWN and event.key == pygame.K_ESCAPE:\n            running = False\n    keys = pygame.key.get_pressed()\n    x += vx\n    y += vy\n    if x <= 15 or x >= 625:\n        vx = -vx\n    if y <= 15 or y >= 465:\n        vy = -vy\n    screen.fill((20, 37, 42))\n    pygame.draw.circle(screen, (214, 237, 147), (x, y), 15)\n    pygame.display.flip()\n    clock.tick(60)\npygame.quit()\n",
    "build": "Type the starter to draw one still ball. In the complete checkpoint add velocity and edge tests.",
    "expected": "A ball moves diagonally and changes direction at all four edges. Escape or the window close button ends the program.",
    "change": "Change the circle color in the starter. Run, then change its radius from 15 to 25.",
    "predict": [
      "What does vx = -vx change?",
      [
        "The horizontal direction",
        "The ball color",
        "The frame rate"
      ],
      0,
      "Negating the horizontal velocity reverses left/right movement."
    ],
    "solve": [
      "Make the ball bounce with a radius of 25.",
      "Update all four boundaries so it stays visible.",
      "Give horizontal and vertical movement different speeds."
    ],
    "create": [
      "Add a second ball with independent position and velocity.",
      "Give it a different color.",
      "Keep both balls inside the window."
    ],
    "wiring": [],
    "trouble": "Use Raspberry Pi OS desktop. Click the Pygame window to focus it. Thonny Stop also ends a stuck program.",
    "setup": "pygame",
    "smallExpected": "One still green ball appears at (100, 100). Escape closes the window.",
    "walkthrough": [
      {
        "line": 9,
        "text": "Store horizontal and vertical velocity separately."
      },
      {
        "line": 18,
        "text": "Add velocity to position once per frame."
      },
      {
        "line": 20,
        "text": "Reverse a velocity at the matching edge. The radius is included in the boundary values."
      }
    ],
    "addedLines": [
      9,
      18,
      19,
      20,
      21,
      22,
      23
    ]
  },
  {
    "id": "keyboard-maze",
    "title": "Keyboard maze",
    "level": "Intermediate",
    "category": "Pygame",
    "minutes": "60–85",
    "summary": "Build walls that stop a player, then design a route to an exit.",
    "skills": [
      "Rect",
      "keyboard",
      "collision"
    ],
    "needs": [
      "Raspberry Pi 4 or 5",
      "Raspberry Pi OS desktop",
      "Monitor, keyboard, mouse"
    ],
    "prereq": "Bouncing ball; lists and loops.",
    "sources": [
      {
        "title": "Pygame: keyboard input",
        "url": "https://www.pygame.org/docs/ref/key.html"
      },
      {
        "title": "Pygame: rectangles and collision",
        "url": "https://www.pygame.org/docs/ref/rect.html"
      }
    ],
    "small": "import pygame\nfrom random import randint\npygame.init()\nscreen = pygame.display.set_mode((640, 480))\npygame.display.set_caption(\"Pi Python Lab\")\nclock = pygame.time.Clock()\nfont = pygame.font.Font(None, 30)\nplayer = pygame.Rect(25, 25, 24, 24)\nrunning = True\nwhile running:\n    for event in pygame.event.get():\n        if event.type == pygame.QUIT:\n            running = False\n        if event.type == pygame.KEYDOWN and event.key == pygame.K_ESCAPE:\n            running = False\n    keys = pygame.key.get_pressed()\n    player.x += (keys[pygame.K_RIGHT] - keys[pygame.K_LEFT]) * 3\n    player.clamp_ip(screen.get_rect())\n    screen.fill((20, 37, 42))\n    pygame.draw.rect(screen, \"orange\", player)\n    pygame.display.flip()\n    clock.tick(60)\npygame.quit()\n",
    "code": "import pygame\nfrom random import randint\npygame.init()\nscreen = pygame.display.set_mode((640, 480))\npygame.display.set_caption(\"Pi Python Lab\")\nclock = pygame.time.Clock()\nfont = pygame.font.Font(None, 30)\nplayer = pygame.Rect(25, 25, 24, 24)\nwalls = [pygame.Rect(120, 0, 20, 310), pygame.Rect(260, 170, 20, 310), pygame.Rect(400, 0, 20, 310)]\ngoal = pygame.Rect(570, 410, 45, 45)\nrunning = True\nwhile running:\n    for event in pygame.event.get():\n        if event.type == pygame.QUIT:\n            running = False\n        if event.type == pygame.KEYDOWN and event.key == pygame.K_ESCAPE:\n            running = False\n    keys = pygame.key.get_pressed()\n    dx = (keys[pygame.K_RIGHT] - keys[pygame.K_LEFT]) * 3\n    dy = (keys[pygame.K_DOWN] - keys[pygame.K_UP]) * 3\n    player.x += dx\n    if any(player.colliderect(wall) for wall in walls):\n        player.x -= dx\n    player.y += dy\n    if any(player.colliderect(wall) for wall in walls):\n        player.y -= dy\n    player.clamp_ip(screen.get_rect())\n    screen.fill((20, 37, 42))\n    for wall in walls:\n        pygame.draw.rect(screen, (90, 140, 145), wall)\n    pygame.draw.rect(screen, (214, 237, 147), goal)\n    pygame.draw.rect(screen, (255, 170, 110), player)\n    if player.colliderect(goal):\n        screen.blit(font.render(\"Escaped!\", True, \"white\"), (450, 20))\n    pygame.display.flip()\n    clock.tick(60)\npygame.quit()\n",
    "build": "Move a square left and right first. The complete checkpoint adds vertical controls, three walls, and an exit.",
    "expected": "Arrow keys move the square. It stops at walls and displays Escaped! when it touches the green exit.",
    "change": "Change the starter movement speed from 3 to 5.",
    "predict": [
      "Why does the program subtract dx after touching a wall?",
      [
        "Undo the blocked move",
        "Move through the wall",
        "Erase the player"
      ],
      0,
      "It restores the previous horizontal position."
    ],
    "solve": [
      "Add a fourth wall.",
      "Keep a possible route from start to exit.",
      "Test that the player cannot cross any wall."
    ],
    "create": [
      "Build a different maze using at least six walls.",
      "Add a second level after reaching the exit.",
      "Give each level a visible title."
    ],
    "wiring": [],
    "trouble": "Rect values are x, y, width, height. Keep movement small so the player cannot jump through narrow walls.",
    "setup": "pygame",
    "smallExpected": "An orange square moves horizontally with left and right arrows. It stays inside the window. There are no walls yet.",
    "walkthrough": [
      {
        "line": 9,
        "text": "Represent each wall as a rectangle and store the rectangles in a list."
      },
      {
        "line": 21,
        "text": "Try one horizontal move. Undo it if the square overlaps any wall; do the same vertically."
      },
      {
        "line": 33,
        "text": "Test the goal separately and draw a message when the player overlaps it."
      }
    ],
    "addedLines": [
      9,
      10,
      19,
      20,
      21,
      22,
      23,
      24,
      25,
      26,
      29,
      30,
      31,
      32,
      33,
      34
    ]
  },
  {
    "id": "catch-game",
    "title": "Catch the falling blocks",
    "level": "Intermediate",
    "category": "Pygame",
    "minutes": "60–85",
    "summary": "Track catches and misses in a falling-object game.",
    "skills": [
      "collision",
      "score",
      "random positions"
    ],
    "needs": [
      "Raspberry Pi 4 or 5",
      "Raspberry Pi OS desktop",
      "Monitor, keyboard, mouse"
    ],
    "prereq": "Keyboard maze.",
    "sources": [
      {
        "title": "Pygame: rectangles",
        "url": "https://www.pygame.org/docs/ref/rect.html"
      },
      {
        "title": "Python: random positions",
        "url": "https://docs.python.org/3/library/random.html"
      }
    ],
    "small": "import pygame\nfrom random import randint\npygame.init()\nscreen = pygame.display.set_mode((640, 480))\npygame.display.set_caption(\"Pi Python Lab\")\nclock = pygame.time.Clock()\nfont = pygame.font.Font(None, 30)\ndrop = pygame.Rect(300, 0, 20, 20)\nrunning = True\nwhile running:\n    for event in pygame.event.get():\n        if event.type == pygame.QUIT:\n            running = False\n        if event.type == pygame.KEYDOWN and event.key == pygame.K_ESCAPE:\n            running = False\n    keys = pygame.key.get_pressed()\n    drop.y = (drop.y + 4) % 480\n    screen.fill((20, 37, 42))\n    pygame.draw.rect(screen, \"orange\", drop)\n    pygame.display.flip()\n    clock.tick(60)\npygame.quit()\n",
    "code": "import pygame\nfrom random import randint\npygame.init()\nscreen = pygame.display.set_mode((640, 480))\npygame.display.set_caption(\"Pi Python Lab\")\nclock = pygame.time.Clock()\nfont = pygame.font.Font(None, 30)\nbasket = pygame.Rect(280, 430, 90, 20)\ndrop = pygame.Rect(randint(0, 620), 0, 20, 20)\nscore, misses = 0, 0\nrunning = True\nwhile running:\n    for event in pygame.event.get():\n        if event.type == pygame.QUIT:\n            running = False\n        if event.type == pygame.KEYDOWN and event.key == pygame.K_ESCAPE:\n            running = False\n    keys = pygame.key.get_pressed()\n    basket.x += (keys[pygame.K_RIGHT] - keys[pygame.K_LEFT]) * 6\n    basket.clamp_ip(screen.get_rect())\n    drop.y += 4\n    if drop.colliderect(basket):\n        score += 1\n        drop.topleft = (randint(0, 620), 0)\n    elif drop.top > 480:\n        misses += 1\n        drop.topleft = (randint(0, 620), 0)\n    screen.fill((20, 37, 42))\n    pygame.draw.rect(screen, (214, 237, 147), basket)\n    pygame.draw.rect(screen, (255, 170, 110), drop)\n    screen.blit(font.render(f\"Caught {score}   Missed {misses}\", True, \"white\"), (20, 20))\n    pygame.display.flip()\n    clock.tick(60)\npygame.quit()\n",
    "build": "Make a block fall first. Add the complete checkpoint to catch it with a keyboard-controlled basket.",
    "expected": "A new block falls after each catch or miss; separate counts appear at the top.",
    "change": "Change drop.y + 4 to drop.y + 2 in the starter.",
    "predict": [
      "If a block touches the basket, which value changes?",
      [
        "misses",
        "score",
        "Both every time"
      ],
      1,
      "The catch branch increments score; elif skips the miss branch."
    ],
    "solve": [
      "End movement after three misses.",
      "Keep the final score visible.",
      "Add a Game over message."
    ],
    "create": [
      "Increase falling speed every five catches.",
      "Add a restart key.",
      "Reset score, misses, and positions on restart."
    ],
    "wiring": [],
    "trouble": "Use elif for the miss check so one block cannot count as both caught and missed.",
    "setup": "pygame",
    "smallExpected": "An orange block falls and reappears at the top. There is no basket or score yet.",
    "walkthrough": [
      {
        "line": 8,
        "text": "Create a wide basket and a separate falling block."
      },
      {
        "line": 22,
        "text": "Count a catch and reset the block; count a miss only if it falls below the window."
      },
      {
        "line": 31,
        "text": "Draw score text from the current counts on every frame."
      }
    ],
    "addedLines": [
      8,
      9,
      10,
      19,
      20,
      21,
      22,
      23,
      24,
      25,
      26,
      27,
      29,
      30,
      31
    ]
  },
  {
    "id": "paddle-rally",
    "title": "Two-player paddle rally",
    "level": "Intermediate",
    "category": "Pygame",
    "minutes": "75–100",
    "summary": "Combine two sets of controls, rebounds, and scoring.",
    "skills": [
      "lists",
      "collision",
      "game state"
    ],
    "needs": [
      "Raspberry Pi 4 or 5",
      "Raspberry Pi OS desktop",
      "Monitor, keyboard, mouse"
    ],
    "prereq": "Bouncing ball and keyboard maze.",
    "sources": [
      {
        "title": "Pygame: making games",
        "url": "https://www.pygame.org/docs/tut/MakeGames.html"
      },
      {
        "title": "Pygame: Rect",
        "url": "https://www.pygame.org/docs/ref/rect.html"
      }
    ],
    "small": "import pygame\nfrom random import randint\npygame.init()\nscreen = pygame.display.set_mode((640, 480))\npygame.display.set_caption(\"Pi Python Lab\")\nclock = pygame.time.Clock()\nfont = pygame.font.Font(None, 30)\nx, y = 100, 100\nvx, vy = 4, 3\nrunning = True\nwhile running:\n    for event in pygame.event.get():\n        if event.type == pygame.QUIT:\n            running = False\n        if event.type == pygame.KEYDOWN and event.key == pygame.K_ESCAPE:\n            running = False\n    keys = pygame.key.get_pressed()\n    x += vx\n    y += vy\n    if x <= 15 or x >= 625:\n        vx = -vx\n    if y <= 15 or y >= 465:\n        vy = -vy\n    screen.fill((20, 37, 42))\n    pygame.draw.circle(screen, (214, 237, 147), (x, y), 15)\n    pygame.display.flip()\n    clock.tick(60)\npygame.quit()\n",
    "code": "import pygame\nfrom random import randint\npygame.init()\nscreen = pygame.display.set_mode((640, 480))\npygame.display.set_caption(\"Pi Python Lab\")\nclock = pygame.time.Clock()\nfont = pygame.font.Font(None, 30)\nleft = pygame.Rect(20, 180, 14, 100)\nright = pygame.Rect(606, 180, 14, 100)\nball = pygame.Rect(310, 230, 16, 16)\nvx, vy = 4, 3\nscores = [0, 0]\nrunning = True\nwhile running:\n    for event in pygame.event.get():\n        if event.type == pygame.QUIT:\n            running = False\n        if event.type == pygame.KEYDOWN and event.key == pygame.K_ESCAPE:\n            running = False\n    keys = pygame.key.get_pressed()\n    left.y += (keys[pygame.K_s] - keys[pygame.K_w]) * 5\n    right.y += (keys[pygame.K_DOWN] - keys[pygame.K_UP]) * 5\n    left.clamp_ip(screen.get_rect())\n    right.clamp_ip(screen.get_rect())\n    ball.move_ip(vx, vy)\n    if ball.top <= 0 or ball.bottom >= 480:\n        vy = -vy\n    if vx < 0 and ball.colliderect(left):\n        ball.left = left.right\n        vx = abs(vx)\n    if vx > 0 and ball.colliderect(right):\n        ball.right = right.left\n        vx = -abs(vx)\n    if ball.right < 0 or ball.left > 640:\n        scores[1 if ball.right < 0 else 0] += 1\n        ball.center = (320, 240)\n        vx = -vx\n    screen.fill((20, 37, 42))\n    for paddle in (left, right):\n        pygame.draw.rect(screen, (214, 237, 147), paddle)\n    pygame.draw.ellipse(screen, \"white\", ball)\n    screen.blit(font.render(f\"{scores[0]} : {scores[1]}\", True, \"white\"), (290, 20))\n    pygame.display.flip()\n    clock.tick(60)\npygame.quit()\n",
    "build": "Reuse the bouncing-ball checkpoint. The complete example adds paddles: W/S for the left player and up/down for the right.",
    "expected": "The ball rebounds from paddles; a miss awards the opponent one point and serves again.",
    "change": "Make the starter ball slower by reducing both velocities.",
    "predict": [
      "A ball exits the left edge. Who gets the point?",
      [
        "Left player",
        "Right player",
        "Neither"
      ],
      1,
      "The player on the opposite side earns the point."
    ],
    "solve": [
      "Use 70-pixel-high paddles.",
      "Stop the rally when either score reaches five.",
      "Display which player won."
    ],
    "create": [
      "Add a start screen.",
      "Add a restart key that resets both scores.",
      "Add a choice of slow and fast ball speeds."
    ],
    "wiring": [],
    "trouble": "Correct the ball position after a paddle collision so it cannot rebound repeatedly inside a paddle.",
    "setup": "pygame",
    "smallExpected": "A green ball bounces inside the window. There are no paddles or scores yet.",
    "walkthrough": [
      {
        "line": 21,
        "text": "Read W/S and arrow keys independently so both players can move."
      },
      {
        "line": 28,
        "text": "Bounce only when moving toward a paddle. Place the ball outside the paddle after the hit."
      },
      {
        "line": 34,
        "text": "Award the opposite player a point when the ball leaves the window, then center the next serve."
      }
    ],
    "addedLines": [
      8,
      9,
      10,
      12,
      21,
      22,
      23,
      24,
      25,
      26,
      27,
      28,
      29,
      30,
      31,
      32,
      33,
      34,
      35,
      36,
      39,
      40,
      41,
      42
    ]
  },
  {
    "id": "snake",
    "title": "Grid snake",
    "level": "Advanced",
    "category": "Pygame",
    "minutes": "90–125",
    "summary": "Use a list to build a growing snake on a grid.",
    "skills": [
      "tuples",
      "list state",
      "grid",
      "collision"
    ],
    "needs": [
      "Raspberry Pi 4 or 5",
      "Raspberry Pi OS desktop",
      "Monitor, keyboard, mouse"
    ],
    "prereq": "Lists, tuples, game loops, and paddle rally.",
    "sources": [
      {
        "title": "Pygame: game tutorial",
        "url": "https://www.pygame.org/docs/tut/MakeGames.html"
      },
      {
        "title": "Pygame: clock timing",
        "url": "https://www.pygame.org/docs/ref/time.html"
      }
    ],
    "small": "import pygame\nfrom random import randint\npygame.init()\nscreen = pygame.display.set_mode((640, 480))\npygame.display.set_caption(\"Pi Python Lab\")\nclock = pygame.time.Clock()\nfont = pygame.font.Font(None, 30)\nsnake = [(160, 160), (140, 160), (120, 160)]\nrunning = True\nwhile running:\n    for event in pygame.event.get():\n        if event.type == pygame.QUIT:\n            running = False\n        if event.type == pygame.KEYDOWN and event.key == pygame.K_ESCAPE:\n            running = False\n    keys = pygame.key.get_pressed()\n    pass\n    screen.fill((20, 37, 42))\n    for x, y in snake:\n        pygame.draw.rect(screen, (214, 237, 147), (x, y, 18, 18))\n    pygame.display.flip()\n    clock.tick(60)\npygame.quit()\n",
    "code": "import pygame\nfrom random import randint\npygame.init()\nscreen = pygame.display.set_mode((640, 480))\npygame.display.set_caption(\"Pi Python Lab\")\nclock = pygame.time.Clock()\nfont = pygame.font.Font(None, 30)\nsnake = [(160, 160), (140, 160), (120, 160)]\ndirection = (20, 0)\nfood = (400, 300)\nover = False\nrunning = True\nwhile running:\n    for event in pygame.event.get():\n        if event.type == pygame.QUIT:\n            running = False\n        if event.type == pygame.KEYDOWN and event.key == pygame.K_ESCAPE:\n            running = False\n    keys = pygame.key.get_pressed()\n    if not over:\n        new_direction = direction\n        if keys[pygame.K_UP]: new_direction = (0, -20)\n        elif keys[pygame.K_DOWN]: new_direction = (0, 20)\n        elif keys[pygame.K_LEFT]: new_direction = (-20, 0)\n        elif keys[pygame.K_RIGHT]: new_direction = (20, 0)\n        if new_direction != (-direction[0], -direction[1]):\n            direction = new_direction\n        head = (snake[0][0] + direction[0], snake[0][1] + direction[1])\n        growing = head == food\n        body = snake if growing else snake[:-1]\n        over = not (0 <= head[0] < 640 and 0 <= head[1] < 480) or head in body\n        if not over:\n            snake.insert(0, head)\n            if growing:\n                empty = [(x, y) for x in range(0, 640, 20) for y in range(0, 480, 20) if (x, y) not in snake]\n                if empty:\n                    food = empty[randint(0, len(empty) - 1)]\n                else:\n                    over = True\n            else:\n                snake.pop()\n    screen.fill((20, 37, 42))\n    for x, y in snake:\n        pygame.draw.rect(screen, (214, 237, 147), (x, y, 18, 18))\n    pygame.draw.rect(screen, (255, 170, 110), (*food, 18, 18))\n    label = \"Game over - Escape to quit\" if over else f\"Score: {len(snake) - 3}\"\n    screen.blit(font.render(label, True, \"white\"), (15, 10))\n    pygame.display.flip()\n    clock.tick(10)\npygame.quit()\n",
    "build": "Draw three body cells first. Then use the complete example to move one grid cell per tick and add food.",
    "expected": "Arrow keys steer. Food adds a segment. Hitting an edge or the body freezes the game.",
    "change": "Add a fourth tuple to the starter list and draw another segment.",
    "predict": [
      "Why skip snake.pop() after eating?",
      [
        "Keep the extra segment",
        "Slow the clock",
        "Remove food from the screen"
      ],
      0,
      "Inserting a head without removing the tail grows the body."
    ],
    "solve": [
      "Add a restart key.",
      "Reset the snake, direction, food, and game-over flag together.",
      "Confirm reversing directly into the neck is still blocked."
    ],
    "create": [
      "Add at least five obstacle cells.",
      "Keep food off obstacles and the snake.",
      "Add a speed increase after every three foods."
    ],
    "wiring": [],
    "trouble": "Keep all movement and food coordinates in multiples of 20. This version uses ten updates per second.",
    "setup": "pygame",
    "smallExpected": "Three green squares appear in a horizontal row. They do not move yet.",
    "walkthrough": [
      {
        "line": 9,
        "text": "Keep positions on a 20-pixel grid and store direction as a coordinate pair."
      },
      {
        "line": 30,
        "text": "Check the part of the body that will remain after this move. The tail can vacate its cell."
      },
      {
        "line": 33,
        "text": "Insert a new head. Remove the tail unless food was eaten; choose new food from empty cells."
      }
    ],
    "addedLines": [
      9,
      10,
      11,
      20,
      21,
      22,
      23,
      24,
      25,
      26,
      27,
      28,
      29,
      30,
      31,
      32,
      33,
      34,
      35,
      36,
      37,
      38,
      39,
      40,
      41,
      45,
      46,
      47,
      49
    ]
  },
  {
    "id": "first-led",
    "title": "Your first blinking LED",
    "level": "Beginner",
    "category": "Physical computing",
    "minutes": "30–45",
    "summary": "Control a real light with your first GPIO program.",
    "skills": [
      "gpiozero",
      "output",
      "timing"
    ],
    "needs": [
      "Raspberry Pi 4 or 5",
      "Raspberry Pi OS desktop",
      "Monitor, keyboard, mouse",
      "Breadboard, jumper wires",
      "1 LED and 330 Ω resistor"
    ],
    "prereq": "Terminal identity badge.",
    "sources": [
      {
        "title": "Raspberry Pi: physical computing",
        "url": "https://projects.raspberrypi.org/en/projects/physical-computing"
      },
      {
        "title": "GPIO Zero: LED",
        "url": "https://gpiozero.readthedocs.io/en/stable/api_output.html#led"
      }
    ],
    "small": "from gpiozero import LED\nfrom time import sleep\nwith LED(17) as light:\n    light.on()\n    sleep(2)\n",
    "code": "from gpiozero import LED\nfrom time import sleep\nwith LED(17) as light:\n    for flash in range(5):\n        light.on()\n        sleep(0.5)\n        light.off()\n        sleep(0.5)\nprint(\"Five flashes finished\")\n",
    "build": "Wire the LED with power disconnected. Run the starter for one two-second light. Then use the full checkpoint for five flashes.",
    "expected": "The LED turns on once in the starter and switches off when the with block ends. The full program flashes five times.",
    "change": "Change sleep(2) to sleep(1) in the starter.",
    "predict": [
      "If both sleeps become 1 second, five flashes take about…",
      [
        "5 seconds",
        "10 seconds",
        "1 second"
      ],
      1,
      "Each flash includes one second on and one second off."
    ],
    "solve": [
      "Flash three times.",
      "Keep the LED on for one second and off for half a second.",
      "Finish with the LED off."
    ],
    "create": [
      "Make a repeating pattern of two short flashes and one long flash.",
      "Repeat the pattern four times.",
      "Finish with a printed message."
    ],
    "wiring": [
      [
        "GPIO17 · physical 11",
        "330 Ω resistor → LED long leg (+)"
      ],
      [
        "LED short leg (−)",
        "GND · physical 6"
      ]
    ],
    "trouble": "Check LED polarity, resistor, and GPIO17 (physical pin 11). Never connect an LED without its resistor.",
    "setup": "gpio",
    "smallExpected": "The LED lights for two seconds, then switches off.",
    "walkthrough": [
      {
        "line": 3,
        "text": "Open the GPIO output. Leaving this block closes it and turns the LED off."
      },
      {
        "line": 4,
        "text": "Repeat one on/off pair five times."
      },
      {
        "line": 7,
        "text": "Switch the light off before waiting for the gap between flashes."
      }
    ],
    "addedLines": [
      4,
      5,
      6,
      7,
      8,
      9
    ]
  },
  {
    "id": "traffic-lights",
    "title": "Traffic light sequence",
    "level": "Beginner",
    "category": "Physical computing",
    "minutes": "40–60",
    "summary": "Program three separate outputs in a timed sequence.",
    "skills": [
      "sequences",
      "loops",
      "multiple outputs"
    ],
    "needs": [
      "Raspberry Pi 4 or 5",
      "Raspberry Pi OS desktop",
      "Monitor, keyboard, mouse",
      "3 LEDs: red, amber, green",
      "3 × 330 Ω resistors, breadboard, wires"
    ],
    "prereq": "Your first blinking LED.",
    "sources": [
      {
        "title": "GPIO Zero: traffic lights recipe",
        "url": "https://gpiozero.readthedocs.io/en/stable/recipes.html#traffic-lights"
      },
      {
        "title": "Raspberry Pi: physical computing",
        "url": "https://projects.raspberrypi.org/en/projects/physical-computing"
      }
    ],
    "small": "from gpiozero import LED\nfrom time import sleep\nwith LED(17) as red, LED(27) as amber, LED(22) as green:\n    red.on()\n    sleep(2)\n",
    "code": "from gpiozero import LED\nfrom time import sleep\nwith LED(17) as red, LED(27) as amber, LED(22) as green:\n    for cycle in range(3):\n        green.on()\n        sleep(3)\n        green.off()\n        amber.on()\n        sleep(1)\n        amber.off()\n        red.on()\n        sleep(3)\n        red.off()\nprint(\"Sequence finished\")\n",
    "build": "Wire three independent LEDs. Test red with the starter, then run the full sequence.",
    "expected": "Green lights for three seconds, amber for one, then red for three. The cycle repeats three times.",
    "change": "Change the red-only starter to turn on amber instead.",
    "predict": [
      "Why call green.off() before amber.on()?",
      [
        "Avoid both being on together",
        "Change the pin number",
        "Restart Python"
      ],
      0,
      "An output keeps its state until another command changes it."
    ],
    "solve": [
      "Make green last five seconds.",
      "Keep amber one second and red three seconds.",
      "Ensure only one LED is on at a time."
    ],
    "create": [
      "Add a pedestrian request button on GPIO2.",
      "Wait for a request before beginning amber then red.",
      "Return to green after the crossing period."
    ],
    "wiring": [
      [
        "GPIO17 · physical 11",
        "330 Ω → red LED long leg"
      ],
      [
        "GPIO27 · physical 13",
        "330 Ω → amber LED long leg"
      ],
      [
        "GPIO22 · physical 15",
        "330 Ω → green LED long leg"
      ],
      [
        "All three short LED legs",
        "GND · physical 6"
      ]
    ],
    "trouble": "Each LED needs its own resistor. Match the color to the pin used in the code.",
    "setup": "gpio",
    "smallExpected": "Only the red LED lights for two seconds, then switches off.",
    "walkthrough": [
      {
        "line": 3,
        "text": "Create a separate output for each LED color."
      },
      {
        "line": 5,
        "text": "Switch on green, wait, then turn it off before amber."
      },
      {
        "line": 11,
        "text": "Finish with red and turn it off before beginning the next cycle."
      }
    ],
    "addedLines": [
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14
    ]
  },
  {
    "id": "button-lamp",
    "title": "Button-controlled lamp",
    "level": "Beginner",
    "category": "Physical computing",
    "minutes": "35–50",
    "summary": "Connect a physical input to a light.",
    "skills": [
      "input",
      "events",
      "functions"
    ],
    "needs": [
      "Raspberry Pi 4 or 5",
      "Raspberry Pi OS desktop",
      "Monitor, keyboard, mouse",
      "1 button, 1 LED, 330 Ω resistor",
      "Breadboard and jumper wires"
    ],
    "prereq": "Your first blinking LED.",
    "sources": [
      {
        "title": "GPIO Zero: button-controlled LED",
        "url": "https://gpiozero.readthedocs.io/en/stable/recipes.html#button-controlled-led"
      },
      {
        "title": "GPIO Zero: Button",
        "url": "https://gpiozero.readthedocs.io/en/stable/api_input.html#button"
      }
    ],
    "small": "from gpiozero import Button\nwith Button(2, bounce_time=0.05) as button:\n    print(\"Press the button\")\n    button.wait_for_press()\n    print(\"Pressed!\")\n",
    "code": "from gpiozero import LED, Button\nfrom signal import pause\nwith LED(17) as light, Button(2, bounce_time=0.05) as button:\n    button.when_pressed = light.on\n    button.when_released = light.off\n    print(\"Hold the button to light the LED. Stop to finish.\")\n    pause()\n",
    "build": "Test the button alone. Then use the full program to make the light follow the press.",
    "expected": "The LED lights while you hold the button and turns off when you release it.",
    "change": "Add another wait_for_press and print to the starter. Release between presses.",
    "predict": [
      "What happens if pause() is removed from the full program?",
      [
        "The program ends and closes its devices",
        "The LED becomes brighter",
        "The button changes pins"
      ],
      0,
      "pause keeps the process alive for event callbacks."
    ],
    "solve": [
      "Change the program so one press toggles the lamp.",
      "Remove the release action.",
      "Verify the lamp stays on after you release."
    ],
    "create": [
      "Make a three-mode lamp: off, blinking, solid.",
      "Cycle modes with one button.",
      "Print the current mode on every change."
    ],
    "wiring": [
      [
        "GPIO17 · physical 11",
        "330 Ω resistor → LED long leg (+)"
      ],
      [
        "LED short leg (−)",
        "GND · physical 6"
      ],
      [
        "GPIO2 · physical 3",
        "One side of button"
      ],
      [
        "Other switched side of button",
        "GND · physical 6"
      ]
    ],
    "trouble": "A four-leg button has pairs already joined internally. Use opposite switched contacts; straddle the breadboard center gap.",
    "setup": "gpio",
    "smallExpected": "Press the button once. Pressed! prints and the program ends. The LED is not used yet.",
    "walkthrough": [
      {
        "line": 3,
        "text": "Open the LED output and the button input; debounce filters rapid contact changes."
      },
      {
        "line": 4,
        "text": "Assign the function to call on a press. Leave off the parentheses so it runs later."
      },
      {
        "line": 7,
        "text": "Keep the program alive while GPIO Zero watches for press and release events."
      }
    ],
    "addedLines": [
      1,
      2,
      3,
      4,
      5,
      6,
      7
    ]
  },
  {
    "id": "reaction-timer",
    "title": "Reaction time challenge",
    "level": "Intermediate",
    "category": "Physical computing",
    "minutes": "50–75",
    "summary": "Measure the time between a light and a button press.",
    "skills": [
      "monotonic",
      "random delay",
      "false starts"
    ],
    "needs": [
      "Raspberry Pi 4 or 5",
      "Raspberry Pi OS desktop",
      "Monitor, keyboard, mouse",
      "1 button, 1 LED, 330 Ω resistor",
      "Breadboard, wires"
    ],
    "prereq": "Button-controlled lamp and number guessing.",
    "sources": [
      {
        "title": "Raspberry Pi: quick reaction game",
        "url": "https://projects.raspberrypi.org/en/projects/python-quick-reaction-game"
      }
    ],
    "small": "from gpiozero import Button\nfrom time import monotonic\nwith Button(2, bounce_time=0.02) as button:\n    input(\"Press Enter to arm\")\n    start = monotonic()\n    button.wait_for_press()\n    print(round(monotonic() - start, 3), \"seconds\")\n",
    "code": "from gpiozero import LED, Button\nfrom time import monotonic, sleep\nfrom random import uniform\nwith LED(17) as light, Button(2, bounce_time=0.02) as button:\n    for round_number in range(3):\n        input(\"Release button, then Enter to start: \")\n        early = [button.is_pressed]\n        def false_start():\n            early[0] = True\n        button.when_pressed = false_start\n        sleep(uniform(2, 5))\n        button.when_pressed = None\n        if early[0] or button.is_pressed:\n            print(\"False start. Round skipped.\")\n            continue\n        light.on()\n        start = monotonic()\n        button.wait_for_press(timeout=5)\n        elapsed = monotonic() - start\n        light.off()\n        print(f\"{elapsed:.3f} seconds\" if elapsed < 5 else \"Timed out\")\n        button.wait_for_release()\n",
    "build": "Test a basic timed button press. The full program adds a random wait, LED cue, and false-start handling.",
    "expected": "Three rounds report a reaction time, false start, or timeout. Classroom measurements include OS and hardware timing delay.",
    "change": "In the starter, wait two seconds before setting start. Compare what the timer measures.",
    "predict": [
      "Why start the clock after the random wait?",
      [
        "Measure response to the cue",
        "Include the waiting time",
        "Make every score five seconds"
      ],
      0,
      "The waiting period is not part of the reaction measurement."
    ],
    "solve": [
      "Run five rounds.",
      "Use a random delay from one to four seconds.",
      "Reject a press during the waiting period."
    ],
    "create": [
      "Store valid reaction times in a list.",
      "Show the fastest and mean times.",
      "Do not include false starts or timeouts in either statistic."
    ],
    "wiring": [
      [
        "GPIO17 · physical 11",
        "330 Ω resistor → LED long leg (+)"
      ],
      [
        "LED short leg (−)",
        "GND · physical 6"
      ],
      [
        "GPIO2 · physical 3",
        "One side of button"
      ],
      [
        "Other switched side of button",
        "GND · physical 6"
      ]
    ],
    "trouble": "Release the button before arming. These are approximate measurements, not laboratory timing.",
    "setup": "gpio",
    "smallExpected": "After Enter, a timer measures the wait until a button press. There is no LED cue or random delay yet.",
    "walkthrough": [
      {
        "line": 10,
        "text": "Watch for a false start during the random waiting period."
      },
      {
        "line": 16,
        "text": "Start the reaction measurement immediately after switching on the cue."
      },
      {
        "line": 18,
        "text": "Wait up to five seconds, then calculate elapsed time using a monotonic clock."
      }
    ],
    "addedLines": [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22
    ]
  },
  {
    "id": "morse-beacon",
    "title": "Morse light beacon",
    "level": "Intermediate",
    "category": "Physical computing",
    "minutes": "45–65",
    "summary": "Turn a message into timed dots and dashes.",
    "skills": [
      "dictionary",
      "functions",
      "nested loops"
    ],
    "needs": [
      "Raspberry Pi 4 or 5",
      "Raspberry Pi OS desktop",
      "Monitor, keyboard, mouse",
      "1 LED, 330 Ω resistor, breadboard, wires"
    ],
    "prereq": "Blinking LED; loops and functions.",
    "sources": [
      {
        "title": "GPIO Zero: LED output",
        "url": "https://gpiozero.readthedocs.io/en/stable/api_output.html#led"
      }
    ],
    "small": "from gpiozero import LED\nfrom time import sleep\nwith LED(17) as light:\n    for duration in (0.2, 0.2, 0.2):\n        light.on()\n        sleep(duration)\n        light.off()\n        sleep(0.2)\n",
    "code": "from gpiozero import LED\nfrom time import sleep\nsymbols = {\"S\": \"...\", \"O\": \"---\"}\nunit = 0.2\nwith LED(17) as light:\n    def flash(duration):\n        light.on()\n        sleep(duration)\n        light.off()\n        sleep(unit)\n    message = input(\"Use S and O: \").upper()\n    for letter in message:\n        if letter not in symbols:\n            print(\"Skipped:\", letter)\n            continue\n        for symbol in symbols[letter]:\n            flash(unit if symbol == \".\" else unit * 3)\n        sleep(unit * 2)\nprint(\"Message complete\")\n",
    "build": "Make three short flashes. The complete checkpoint uses a dictionary to turn S and O into timed patterns.",
    "expected": "Entering SOS produces three short flashes, three long flashes, and three short flashes.",
    "change": "Change the starter duration tuple to (0.2, 0.6, 0.2).",
    "predict": [
      "A dash uses unit * 3. If unit is 0.2, the dash lasts…",
      [
        "0.2 seconds",
        "0.6 seconds",
        "3 seconds"
      ],
      1,
      "Three times 0.2 is 0.6."
    ],
    "solve": [
      "Add A (.-) and T (-) to the dictionary.",
      "Send SAT.",
      "Keep a dash three times as long as a dot."
    ],
    "create": [
      "Support your first name’s letters.",
      "Add a seven-unit gap between words.",
      "Print each supported letter as it transmits."
    ],
    "wiring": [
      [
        "GPIO17 · physical 11",
        "330 Ω resistor → LED long leg (+)"
      ],
      [
        "LED short leg (−)",
        "GND · physical 6"
      ]
    ],
    "trouble": "Leave the light off during gaps. The flash function already includes one unit after each symbol.",
    "setup": "gpio",
    "smallExpected": "The LED flashes three short pulses, with short gaps.",
    "walkthrough": [
      {
        "line": 3,
        "text": "Look up each supported letter in a dictionary of dots and dashes."
      },
      {
        "line": 6,
        "text": "Group the on, wait, off, and gap commands in one function."
      },
      {
        "line": 16,
        "text": "Use one unit for a dot and three for a dash. Leave a larger gap between letters."
      }
    ],
    "addedLines": [
      3,
      4,
      6,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19
    ]
  },
  {
    "id": "pwm-light",
    "title": "Fading mood light",
    "level": "Intermediate",
    "category": "Physical computing",
    "minutes": "40–60",
    "summary": "Control brightness using pulse-width modulation.",
    "skills": [
      "PWM",
      "fractions",
      "loops"
    ],
    "needs": [
      "Raspberry Pi 4 or 5",
      "Raspberry Pi OS desktop",
      "Monitor, keyboard, mouse",
      "1 LED, 330 Ω resistor, breadboard, wires"
    ],
    "prereq": "Blinking LED and loops.",
    "sources": [
      {
        "title": "GPIO Zero: PWMLED",
        "url": "https://gpiozero.readthedocs.io/en/stable/api_output.html#pwmled"
      }
    ],
    "small": "from gpiozero import PWMLED\nfrom time import sleep\nwith PWMLED(17) as light:\n    light.value = 0.2\n    sleep(3)\n",
    "code": "from gpiozero import PWMLED\nfrom time import sleep\nwith PWMLED(17) as light:\n    for cycle in range(3):\n        for step in range(101):\n            light.value = step / 100\n            sleep(0.01)\n        for step in range(100, -1, -1):\n            light.value = step / 100\n            sleep(0.01)\nprint(\"Fade finished\")\n",
    "build": "Run a steady dim light first. Then use two loops to increase and decrease brightness.",
    "expected": "The LED fades up and down three times, then switches off.",
    "change": "Compare values 0.1, 0.5, and 1 in the starter.",
    "predict": [
      "Which value means half duty cycle?",
      [
        "50",
        "0.5",
        "5"
      ],
      1,
      "PWMLED values range from 0 to 1. Perceived brightness is not perfectly linear."
    ],
    "solve": [
      "Make each fade-up take roughly two seconds.",
      "Keep fade-down around one second.",
      "Keep every value between 0 and 1."
    ],
    "create": [
      "Add a button on GPIO2.",
      "Switch between steady, slow fade, and fast fade.",
      "Keep the button responsive during animation."
    ],
    "wiring": [
      [
        "GPIO17 · physical 11",
        "330 Ω resistor → LED long leg (+)"
      ],
      [
        "LED short leg (−)",
        "GND · physical 6"
      ]
    ],
    "trouble": "Use PWMLED, not LED. GPIO Zero software PWM can show timing jitter under load.",
    "setup": "gpio",
    "smallExpected": "The LED stays at a dim setting for three seconds, then switches off.",
    "walkthrough": [
      {
        "line": 5,
        "text": "Count brightness upward from 0 to 100 and divide by 100 for the required 0–1 value."
      },
      {
        "line": 8,
        "text": "Count back downward, including zero."
      },
      {
        "line": 7,
        "text": "Pause between brightness changes so the fade is visible."
      }
    ],
    "addedLines": [
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11
    ]
  },
  {
    "id": "rgb-mixer",
    "title": "RGB color mixer",
    "level": "Intermediate",
    "category": "Physical computing",
    "minutes": "50–70",
    "summary": "Combine three light channels to make new colors.",
    "skills": [
      "tuples",
      "RGB",
      "validation"
    ],
    "needs": [
      "Raspberry Pi 4 or 5",
      "Raspberry Pi OS desktop",
      "Monitor, keyboard, mouse",
      "Common-cathode RGB LED",
      "3 × 330 Ω resistors, breadboard, wires"
    ],
    "prereq": "Fading mood light; tuples.",
    "sources": [
      {
        "title": "GPIO Zero: RGBLED",
        "url": "https://gpiozero.readthedocs.io/en/stable/api_output.html#rgbled"
      }
    ],
    "small": "from gpiozero import RGBLED\nfrom time import sleep\nwith RGBLED(red=17, green=27, blue=22) as light:\n    light.color = (1, 0, 1)\n    sleep(3)\n",
    "code": "from gpiozero import RGBLED\nwith RGBLED(red=17, green=27, blue=22) as light:\n    while True:\n        text = input(\"Red green blue (0-100), or q: \")\n        if text.lower() == \"q\":\n            break\n        try:\n            values = [int(part) for part in text.split()]\n            if len(values) != 3 or any(v < 0 or v > 100 for v in values):\n                raise ValueError\n            light.color = tuple(v / 100 for v in values)\n        except ValueError:\n            print(\"Enter three whole numbers from 0 to 100.\")\n",
    "build": "Check the RGB LED datasheet to identify its four legs. Run magenta first, then use terminal values to mix colors.",
    "expected": "Type 100 0 0 for red, 0 100 0 for green, or 100 0 100 for magenta. q ends the program.",
    "change": "Change the starter color to (0, 1, 1).",
    "predict": [
      "What color does (1, 1, 0) combine?",
      [
        "Red + green",
        "Green + blue",
        "Red + blue"
      ],
      0,
      "The tuple order is red, green, blue."
    ],
    "solve": [
      "Add named presets for red, cyan, and white.",
      "Keep numeric input working.",
      "Reject values above 100."
    ],
    "create": [
      "Create a five-color palette.",
      "Fade between adjacent colors.",
      "Provide a way to stop the sequence."
    ],
    "wiring": [
      [
        "Common cathode of RGB LED",
        "GND · physical 6"
      ],
      [
        "GPIO17 · physical 11",
        "330 Ω → red channel"
      ],
      [
        "GPIO27 · physical 13",
        "330 Ω → green channel"
      ],
      [
        "GPIO22 · physical 15",
        "330 Ω → blue channel"
      ]
    ],
    "trouble": "This wiring is for a common-cathode RGB LED. Each channel needs a resistor; identify legs from its datasheet.",
    "setup": "gpio",
    "smallExpected": "The RGB LED mixes red and blue to make magenta for three seconds.",
    "walkthrough": [
      {
        "line": 4,
        "text": "Read three percentages or q to finish."
      },
      {
        "line": 8,
        "text": "Split the input and verify it contains exactly three whole numbers in range."
      },
      {
        "line": 11,
        "text": "Convert percentages to an RGB tuple of values from 0 to 1."
      }
    ],
    "addedLines": [
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13
    ]
  },
  {
    "id": "motion-alarm",
    "title": "Motion event logger",
    "level": "Intermediate",
    "category": "Physical computing",
    "minutes": "50–75",
    "summary": "Detect movement and save timestamped events.",
    "skills": [
      "PIR",
      "events",
      "CSV"
    ],
    "needs": [
      "Raspberry Pi 4 or 5",
      "Raspberry Pi OS desktop",
      "Monitor, keyboard, mouse",
      "HC-SR501 PIR module with 3.3V output",
      "Breadboard, wires"
    ],
    "prereq": "Button events and Pi health logger.",
    "sources": [
      {
        "title": "Raspberry Pi: motion sensor",
        "url": "https://projects.raspberrypi.org/en/projects/rpi-pir"
      },
      {
        "title": "GPIO Zero: MotionSensor",
        "url": "https://gpiozero.readthedocs.io/en/stable/api_input.html#motionsensor-d-sun-pir"
      }
    ],
    "small": "from gpiozero import MotionSensor\nfrom time import sleep\nwith MotionSensor(4) as sensor:\n    print(\"Keep still for 60 seconds while the sensor settles\")\n    sleep(60)\n    print(\"Move in front of the sensor\")\n    sensor.wait_for_motion()\n    print(\"Motion detected\")\n",
    "code": "from gpiozero import MotionSensor\nfrom datetime import datetime\nfrom pathlib import Path\nfrom time import sleep\nimport csv\npath = Path.home() / \"motion-events.csv\"\nwith MotionSensor(4) as sensor:\n    print(\"Warming up for 60 seconds\")\n    sleep(60)\n    print(\"Logging five motion events\")\n    for event in range(5):\n        sensor.wait_for_motion()\n        stamp = datetime.now().isoformat(timespec=\"seconds\")\n        with path.open(\"a\", newline=\"\") as file:\n            csv.writer(file).writerow([stamp, \"motion\"])\n        print(stamp, \"motion\")\n        sensor.wait_for_no_motion()\nprint(\"Saved:\", path)\n",
    "build": "Check the module’s pin labels; their order varies. Run one motion detection, then log five separate events.",
    "expected": "An event is written when motion begins. The program waits for no motion before counting the next event.",
    "change": "Try crossing in front of the sensor after warmup and note how long it remains active.",
    "predict": [
      "Why wait_for_no_motion() after logging?",
      [
        "Avoid counting the same active signal repeatedly",
        "Erase the CSV",
        "Take a photo"
      ],
      0,
      "The next event begins after the signal returns inactive."
    ],
    "solve": [
      "Log three separate motion events.",
      "Keep timestamps in the file.",
      "Test that standing in view does not fill the file with repeated rows."
    ],
    "create": [
      "Add an LED indicator.",
      "Count events during a fixed two-minute window.",
      "Save a summary alongside the raw events."
    ],
    "wiring": [
      [
        "PIR VCC (HC-SR501 module)",
        "5V · physical 2"
      ],
      [
        "PIR GND",
        "GND · physical 6"
      ],
      [
        "PIR OUT (verify 3.3V logic)",
        "GPIO4 · physical 7"
      ]
    ],
    "trouble": "PIR detects changing infrared patterns, not a person’s identity. Allow warmup and check the module delay adjustment.",
    "setup": "gpio",
    "smallExpected": "After a 60-second settling period, the program waits for movement and prints Motion detected.",
    "walkthrough": [
      {
        "line": 9,
        "text": "Give the PIR sensor time to settle before logging."
      },
      {
        "line": 12,
        "text": "Wait for a motion event, then generate its timestamp."
      },
      {
        "line": 17,
        "text": "Wait for the output to return inactive before counting another event."
      }
    ],
    "addedLines": [
      2,
      3,
      5,
      6,
      8,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18
    ]
  },
  {
    "id": "distance-meter",
    "title": "Ultrasonic distance meter",
    "level": "Intermediate",
    "category": "Physical computing",
    "minutes": "60–85",
    "summary": "Measure distance and build a simple proximity indicator.",
    "skills": [
      "ultrasonic sensor",
      "units",
      "thresholds"
    ],
    "needs": [
      "Raspberry Pi 4 or 5",
      "Raspberry Pi OS desktop",
      "Monitor, keyboard, mouse",
      "HC-SR04 ultrasonic module",
      "330 Ω and 470 Ω resistors for divider",
      "Breadboard, wires"
    ],
    "prereq": "Sensor inputs and while loops.",
    "sources": [
      {
        "title": "GPIO Zero: distance sensor wiring",
        "url": "https://gpiozero.readthedocs.io/en/stable/api_input.html#distancesensor-hc-sr04"
      }
    ],
    "small": "from gpiozero import DistanceSensor\nfrom time import sleep\nwith DistanceSensor(echo=24, trigger=23, max_distance=2) as sensor:\n    for sample in range(10):\n        print(round(sensor.distance * 100, 1), \"cm\")\n        sleep(0.3)\n",
    "code": "from gpiozero import DistanceSensor\nfrom time import sleep\nwith DistanceSensor(echo=24, trigger=23, max_distance=2) as sensor:\n    for sample in range(60):\n        cm = sensor.distance * 100\n        state = \"NEAR\" if cm < 20 else \"CLEAR\"\n        print(f\"{cm:5.1f} cm | {state}\")\n        sleep(0.3)\n",
    "build": "With power disconnected, build the ECHO voltage divider exactly as listed. Have the wiring checked, then measure a flat book.",
    "expected": "Distances print in centimeters; a book closer than 20 cm changes the label to NEAR.",
    "change": "Move a flat book between about 10 cm and 40 cm from the sensor.",
    "predict": [
      "sensor.distance is 0.35 meters. What prints in centimeters?",
      [
        "0.35",
        "3.5",
        "35"
      ],
      2,
      "Multiply meters by 100 to get centimeters."
    ],
    "solve": [
      "Add a middle zone from 20 to 50 cm.",
      "Keep NEAR below 20 and CLEAR above 50.",
      "Test at three known ruler distances."
    ],
    "create": [
      "Connect three separate LEDs for the three zones.",
      "Keep only one on at a time.",
      "Use averaged readings to reduce flicker."
    ],
    "wiring": [
      [
        "HC-SR04 VCC",
        "5V · physical 2"
      ],
      [
        "HC-SR04 GND",
        "GND · physical 6"
      ],
      [
        "HC-SR04 TRIG",
        "GPIO23 · physical 16"
      ],
      [
        "HC-SR04 ECHO",
        "330 Ω resistor → junction at GPIO24 · physical 18"
      ],
      [
        "Same ECHO/GPIO24 junction",
        "470 Ω resistor → GND (voltage divider)"
      ]
    ],
    "trouble": "Never connect the 5V ECHO signal directly to a GPIO. This divider reduces it to about 2.94V. Soft or angled surfaces give unreliable readings.",
    "setup": "gpio",
    "smallExpected": "Ten distance readings print in centimeters, about 0.3 seconds apart.",
    "walkthrough": [
      {
        "line": 3,
        "text": "Declare echo and trigger separately. These numbers must match the checked wiring."
      },
      {
        "line": 5,
        "text": "Convert the meter reading to centimeters."
      },
      {
        "line": 6,
        "text": "Compare the reading with 20 cm to choose a proximity label."
      }
    ],
    "addedLines": [
      4,
      5,
      6,
      7
    ]
  },
  {
    "id": "light-sensor",
    "title": "Automatic night light",
    "level": "Intermediate",
    "category": "Physical computing",
    "minutes": "60–85",
    "summary": "Read ambient light and switch an LED using a threshold.",
    "skills": [
      "LDR",
      "RC timing",
      "threshold",
      "calibration"
    ],
    "needs": [
      "Raspberry Pi 4 or 5",
      "Raspberry Pi OS desktop",
      "Monitor, keyboard, mouse",
      "LDR (light-dependent resistor)",
      "1 μF capacitor, 1 LED, 330 Ω resistor",
      "Breadboard, wires"
    ],
    "prereq": "Distance meter or motion event logger.",
    "sources": [
      {
        "title": "Raspberry Pi: light sensor",
        "url": "https://projects.raspberrypi.org/en/projects/rpi-ldr"
      },
      {
        "title": "GPIO Zero: LightSensor",
        "url": "https://gpiozero.readthedocs.io/en/stable/api_input.html#lightsensor-ldr"
      }
    ],
    "small": "from gpiozero import LightSensor\nfrom time import sleep\nwith LightSensor(4) as sensor:\n    for sample in range(30):\n        print(round(sensor.value, 2))\n        sleep(0.3)\n",
    "code": "from gpiozero import LightSensor, LED\nfrom time import sleep\nwith LightSensor(4) as sensor, LED(17) as light:\n    for sample in range(200):\n        value = sensor.value\n        if value < 0.3:\n            light.on()\n        elif value > 0.5:\n            light.off()\n        print(round(value, 2), \"lamp\", light.is_lit)\n        sleep(0.2)\n",
    "build": "Build the LDR-capacitor circuit, then record readings covered and uncovered. Add the LED only after the sensor responds.",
    "expected": "Covering the LDR lowers the value. The lamp turns on below 0.3 and off above 0.5; adapt those values to your room.",
    "change": "Compare the starter readings with the LDR covered, in room light, and near a lamp.",
    "predict": [
      "Why use different on and off thresholds?",
      [
        "Reduce rapid flickering near one boundary",
        "Double the voltage",
        "Make the LED read light"
      ],
      0,
      "The gap between thresholds keeps the previous state until a clear change."
    ],
    "solve": [
      "Choose thresholds from your measured values.",
      "Confirm the lamp turns on in shade.",
      "Keep it stable near the boundary."
    ],
    "create": [
      "Log 30 light samples to CSV.",
      "Show the observed minimum and maximum.",
      "Use your measurements to set the lamp thresholds."
    ],
    "wiring": [
      [
        "3.3V · physical 1",
        "One LDR leg"
      ],
      [
        "Other LDR leg",
        "GPIO4 · physical 7 AND capacitor positive lead"
      ],
      [
        "Capacitor negative lead",
        "GND · physical 6"
      ],
      [
        "GPIO17 · physical 11",
        "330 Ω resistor → LED long leg (+)"
      ],
      [
        "LED short leg (−)",
        "GND · physical 6"
      ]
    ],
    "trouble": "GPIO cannot directly read analog voltage. This circuit times an LDR-capacitor charge; use a 1 μF capacitor with polarity correct. Keep the LED away from the LDR.",
    "setup": "gpio",
    "smallExpected": "Thirty values between 0 and 1 print. Covering the LDR should reduce the value. The lamp is not used yet.",
    "walkthrough": [
      {
        "line": 5,
        "text": "Read the light sensor once per loop and reuse that value for both decisions."
      },
      {
        "line": 6,
        "text": "Turn on below the lower threshold."
      },
      {
        "line": 8,
        "text": "Turn off above the higher threshold. Between them, keep the previous output state."
      }
    ],
    "addedLines": [
      1,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11
    ]
  },
  {
    "id": "gpio-soundboard",
    "title": "Physical soundboard",
    "level": "Intermediate",
    "category": "Physical computing",
    "minutes": "60–85",
    "summary": "Trigger a sound from a real button using Pygame.",
    "skills": [
      "pygame mixer",
      "callbacks",
      "audio files"
    ],
    "needs": [
      "Raspberry Pi 4 or 5",
      "Raspberry Pi OS desktop",
      "Monitor, keyboard, mouse",
      "1 button and jumper wires",
      "HDMI or USB audio output",
      "A short WAV recording named chime.wav"
    ],
    "prereq": "Button-controlled lamp.",
    "sources": [
      {
        "title": "Raspberry Pi: GPIO music box",
        "url": "https://projects.raspberrypi.org/en/projects/gpio-music-box"
      },
      {
        "title": "Pygame: mixer",
        "url": "https://www.pygame.org/docs/ref/mixer.html"
      }
    ],
    "small": "from pathlib import Path\nimport pygame\npygame.mixer.init()\nsound = pygame.mixer.Sound(str(Path(__file__).with_name(\"chime.wav\")))\nsound.set_volume(0.4)\nsound.play()\npygame.time.wait(int(sound.get_length() * 1000) + 100)\npygame.quit()\n",
    "code": "from pathlib import Path\nfrom gpiozero import Button\nfrom signal import pause\nimport pygame\npygame.mixer.init()\nsound = pygame.mixer.Sound(str(Path(__file__).with_name(\"chime.wav\")))\nsound.set_volume(0.4)\ntry:\n    with Button(2, bounce_time=0.1) as button:\n        button.when_pressed = sound.play\n        print(\"Press to play. Stop to finish.\")\n        pause()\nfinally:\n    pygame.quit()\n",
    "build": "Place a WAV recording named chime.wav beside your saved Python file. Test playback first, then add the button.",
    "expected": "Each button press plays your recording. The reference uses no downloaded audio assets.",
    "change": "Change volume from 0.4 to 0.2 and compare playback.",
    "predict": [
      "Where must chime.wav be in this program?",
      [
        "Beside the saved .py file",
        "Any folder on the Pi",
        "Inside the browser"
      ],
      0,
      "Path(__file__).with_name locates a sibling file."
    ],
    "solve": [
      "Add a second button on GPIO3 and a second recording.",
      "Play a different recording for each button.",
      "Set both volumes to 0.3."
    ],
    "create": [
      "Create a four-button soundboard.",
      "Label the buttons physically.",
      "Add a button or keyboard action that stops all playing sounds."
    ],
    "wiring": [
      [
        "GPIO2 · physical 3",
        "One side of button"
      ],
      [
        "Other switched side of button",
        "GND · physical 6"
      ]
    ],
    "trouble": "Save the .py file before running. Verify HDMI/USB sound output; Pi 5 has no analog headphone jack. This project needs your own WAV file.",
    "setup": "sound",
    "smallExpected": "Your chime.wav plays once at 40% volume. The program waits for playback to finish.",
    "walkthrough": [
      {
        "line": 6,
        "text": "Load the WAV file from the same folder as the saved program."
      },
      {
        "line": 10,
        "text": "Assign sound.play as the button callback."
      },
      {
        "line": 13,
        "text": "Release the audio system when the program stops."
      }
    ],
    "addedLines": [
      2,
      3,
      8,
      9,
      10,
      11,
      12,
      13,
      14
    ]
  },
  {
    "id": "physical-controller",
    "title": "Build a game controller",
    "level": "Advanced",
    "category": "Physical computing",
    "minutes": "75–100",
    "summary": "Move a Pygame player with two wired buttons.",
    "skills": [
      "GPIO polling",
      "game loop",
      "clamping"
    ],
    "needs": [
      "Raspberry Pi 4 or 5",
      "Raspberry Pi OS desktop",
      "Monitor, keyboard, mouse",
      "2 buttons, breadboard, wires"
    ],
    "prereq": "Button lamp and keyboard maze.",
    "sources": [
      {
        "title": "GPIO Zero: Button",
        "url": "https://gpiozero.readthedocs.io/en/stable/api_input.html#button"
      },
      {
        "title": "Pygame: quick start",
        "url": "https://www.pygame.org/docs/"
      }
    ],
    "small": "from gpiozero import Button\nfrom time import sleep\nwith Button(2) as left, Button(3) as right:\n    for sample in range(50):\n        print(\"left\", left.is_pressed, \"right\", right.is_pressed)\n        sleep(0.1)\n",
    "code": "from gpiozero import Button\nimport pygame\npygame.init()\nscreen = pygame.display.set_mode((640, 480))\nclock = pygame.time.Clock()\nplayer = pygame.Rect(300, 400, 40, 40)\ntry:\n    with Button(2, bounce_time=0.02) as left, Button(3, bounce_time=0.02) as right:\n        running = True\n        while running:\n            for event in pygame.event.get():\n                if event.type == pygame.QUIT:\n                    running = False\n                if event.type == pygame.KEYDOWN and event.key == pygame.K_ESCAPE:\n                    running = False\n            player.x += (int(right.is_pressed) - int(left.is_pressed)) * 5\n            player.clamp_ip(screen.get_rect())\n            screen.fill((20, 37, 42))\n            pygame.draw.rect(screen, (214, 237, 147), player)\n            pygame.display.flip()\n            clock.tick(60)\nfinally:\n    pygame.quit()\n",
    "build": "Test both inputs in the Shell. Then use the complete checkpoint to poll the buttons once per frame.",
    "expected": "Left and right buttons move the square; holding both cancels movement.",
    "change": "Hold both buttons in the starter and confirm both print True.",
    "predict": [
      "Why avoid wait_for_press() inside this game loop?",
      [
        "It would block drawing while waiting",
        "It changes the display size",
        "It plays a sound"
      ],
      0,
      "Polling reads the current state and lets the next frame continue."
    ],
    "solve": [
      "Add the button controls to your catch game.",
      "Keep keyboard controls available.",
      "Stop the basket at the screen edges."
    ],
    "create": [
      "Build a cardboard controller with labeled buttons.",
      "Add a third button for restart.",
      "Make one of your earlier games work completely with the controller."
    ],
    "wiring": [
      [
        "GPIO2 · physical 3",
        "One side of button"
      ],
      [
        "Other switched side of button",
        "GND · physical 6"
      ],
      [
        "GPIO3 · physical 5",
        "One side of right button"
      ],
      [
        "Other switched side of right button",
        "GND · physical 6"
      ]
    ],
    "trouble": "Use opposite switched contacts on each button. Never wait in the drawing loop; read is_pressed.",
    "setup": "controller",
    "smallExpected": "The Shell prints whether the left and right buttons are pressed. There is no game window yet.",
    "walkthrough": [
      {
        "line": 8,
        "text": "Keep both inputs open while the game runs."
      },
      {
        "line": 16,
        "text": "Convert button states to 0 or 1. Subtract left from right to choose the movement direction."
      },
      {
        "line": 21,
        "text": "Limit drawing to 60 frames per second while continuing to poll the buttons."
      }
    ],
    "addedLines": [
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23
    ]
  },
  {
    "id": "camera-booth",
    "title": "Countdown photo booth",
    "level": "Intermediate",
    "category": "Camera & robotics",
    "minutes": "60–85",
    "summary": "Capture timestamped photos with a keyboard countdown.",
    "skills": [
      "Picamera2",
      "pathlib",
      "datetime"
    ],
    "needs": [
      "Raspberry Pi 4 or 5",
      "Raspberry Pi OS desktop",
      "Monitor, keyboard, mouse",
      "Raspberry Pi CSI camera module",
      "Correct ribbon cable for your Pi (Pi 5 uses a smaller connector)"
    ],
    "prereq": "Pi health data logger.",
    "sources": [
      {
        "title": "Raspberry Pi: camera software",
        "url": "https://www.raspberrypi.com/documentation/computers/camera_software.html"
      },
      {
        "title": "Raspberry Pi: camera module",
        "url": "https://projects.raspberrypi.org/en/projects/getting-started-with-picamera"
      }
    ],
    "small": "from picamera2 import Picamera2\nfrom pathlib import Path\nfrom time import sleep\ncamera = Picamera2()\ntry:\n    camera.configure(camera.create_still_configuration())\n    camera.start()\n    sleep(2)\n    path = Path.home() / \"pi-test.jpg\"\n    camera.capture_file(str(path))\n    print(\"Saved:\", path)\nfinally:\n    camera.close()\n",
    "code": "from picamera2 import Picamera2\nfrom pathlib import Path\nfrom datetime import datetime\nfrom time import sleep\nfolder = Path.home() / \"pi-photos\"\nfolder.mkdir(exist_ok=True)\ncamera = Picamera2()\ntry:\n    camera.configure(camera.create_still_configuration())\n    camera.start()\n    sleep(2)\n    while input(\"Enter to take photo, q to quit: \").lower() != \"q\":\n        for count in (3, 2, 1):\n            print(count)\n            sleep(1)\n        name = datetime.now().strftime(\"photo-%Y%m%d-%H%M%S-%f.jpg\")\n        camera.capture_file(str(folder / name))\n        print(\"Saved:\", name)\nfinally:\n    camera.close()\n",
    "build": "Test one still photo with the starter. Then use the full checkpoint for a repeated countdown booth.",
    "expected": "Each Enter press counts down 3, 2, 1 and writes a new JPG inside pi-photos. Open it in File Manager.",
    "change": "Change the starter filename to pi-test-2.jpg and verify both images exist.",
    "predict": [
      "Why put a timestamp in every filename?",
      [
        "Keep earlier captures",
        "Increase camera resolution",
        "Change exposure"
      ],
      0,
      "Unique names prevent each new capture replacing the previous one."
    ],
    "solve": [
      "Use a five-second countdown.",
      "Take two photos per request one second apart.",
      "Keep every filename unique."
    ],
    "create": [
      "Add a GPIO button to trigger a capture.",
      "Add an LED during countdown.",
      "Keep a quit action and close the camera on exit."
    ],
    "wiring": [
      [
        "With power disconnected",
        "Fit a supported camera to the CSI camera connector; use the correct Pi 4/Pi 5 cable"
      ],
      [
        "Before Python",
        "Run rpicam-hello --list-cameras in Terminal and check a camera is listed"
      ]
    ],
    "trouble": "Only one app can use the camera at a time. Close other camera programs. These instructions use Picamera2 and a CSI camera, not the old picamera library.",
    "setup": "camera",
    "smallExpected": "One image is saved as pi-test.jpg in your home folder. Open it in File Manager.",
    "walkthrough": [
      {
        "line": 9,
        "text": "Configure and start still capture, then allow exposure to settle."
      },
      {
        "line": 13,
        "text": "Print a visible countdown before each photo."
      },
      {
        "line": 16,
        "text": "Build a timestamped filename so earlier images are retained."
      }
    ],
    "addedLines": [
      3,
      5,
      6,
      12,
      13,
      14,
      15,
      16,
      17,
      18
    ]
  },
  {
    "id": "time-lapse",
    "title": "Time-lapse photo sequence",
    "level": "Advanced",
    "category": "Camera & robotics",
    "minutes": "75–100",
    "summary": "Capture numbered frames and turn them into a short movie.",
    "skills": [
      "intervals",
      "file naming",
      "ffmpeg"
    ],
    "needs": [
      "Raspberry Pi 4 or 5",
      "Raspberry Pi OS desktop",
      "Monitor, keyboard, mouse",
      "Raspberry Pi CSI camera module",
      "Correct ribbon cable for your Pi (Pi 5 uses a smaller connector)"
    ],
    "prereq": "Countdown photo booth.",
    "sources": [
      {
        "title": "Raspberry Pi: Cress Egg Heads",
        "url": "https://projects.raspberrypi.org/en/projects/cress-egg-heads"
      },
      {
        "title": "Picamera2 manual",
        "url": "https://datasheets.raspberrypi.com/camera/picamera2-manual.pdf"
      }
    ],
    "small": "from picamera2 import Picamera2\nfrom pathlib import Path\nfrom time import sleep\ncamera = Picamera2()\ntry:\n    camera.configure(camera.create_still_configuration())\n    camera.start()\n    sleep(2)\n    path = Path.home() / \"pi-test.jpg\"\n    camera.capture_file(str(path))\n    print(\"Saved:\", path)\nfinally:\n    camera.close()\n",
    "code": "from picamera2 import Picamera2\nfrom pathlib import Path\nfrom datetime import datetime\nfrom time import sleep\nfolder = Path.home() / \"pi-timelapse\" / datetime.now().strftime(\"%Y%m%d-%H%M%S-%f\")\nfolder.mkdir(parents=True)\ncamera = Picamera2()\ntry:\n    camera.configure(camera.create_still_configuration(main={\"size\": (1280, 720)}))\n    camera.start()\n    sleep(2)\n    for number in range(30):\n        path = folder / f\"frame-{number:04d}.jpg\"\n        camera.capture_file(str(path))\n        print(path.name)\n        sleep(2)\nfinally:\n    camera.close()\nprint(\"Frames saved in:\", folder)\n",
    "build": "Test one still. The full checkpoint saves 30 numbered frames. Move a toy a little between captures. Afterward use the Terminal command in the result panel to assemble a movie.",
    "expected": "Thirty frames taken about two seconds apart become a three-second movie at ten frames per second. Capture time adds a small interval delay.",
    "change": "Change the starter capture resolution by using create_still_configuration(main={\"size\": (1280, 720)}).",
    "predict": [
      "30 frames played at 10 frames per second last…",
      [
        "3 seconds",
        "30 seconds",
        "60 seconds"
      ],
      0,
      "Playback duration is frame count divided by playback frame rate."
    ],
    "solve": [
      "Capture 60 frames.",
      "Keep the camera still and move a toy between captures.",
      "Assemble a six-second movie at 10 fps."
    ],
    "create": [
      "Choose a slow process to document.",
      "Calculate a frame count and interval before recording.",
      "Export a movie and record actual capture and playback durations."
    ],
    "wiring": [
      [
        "With power disconnected",
        "Fit a supported camera to the CSI camera connector; use the correct Pi 4/Pi 5 cable"
      ],
      [
        "Before Python",
        "Run rpicam-hello --list-cameras in Terminal and check a camera is listed"
      ]
    ],
    "trouble": "Start a new run folder each time so frames from earlier attempts do not enter the movie. Use even image dimensions for H.264 output.",
    "setup": "timelapse",
    "smallExpected": "One image is saved as pi-test.jpg in your home folder. Open it before building the sequence.",
    "walkthrough": [
      {
        "line": 5,
        "text": "Create a fresh timestamped run folder for this sequence."
      },
      {
        "line": 12,
        "text": "Save thirty frames with four-digit sequence numbers."
      },
      {
        "line": 11,
        "text": "Wait between captures. The actual capture time also contributes to the interval."
      }
    ],
    "addedLines": [
      3,
      5,
      6,
      9,
      12,
      13,
      14,
      15,
      16,
      19
    ]
  },
  {
    "id": "camera-motion",
    "title": "Camera motion detector",
    "level": "Advanced",
    "category": "Camera & robotics",
    "minutes": "90–125",
    "summary": "Find changing pixels in a camera image using OpenCV.",
    "skills": [
      "arrays",
      "OpenCV",
      "background subtraction"
    ],
    "needs": [
      "Raspberry Pi 4 or 5",
      "Raspberry Pi OS desktop",
      "Monitor, keyboard, mouse",
      "Raspberry Pi CSI camera module",
      "Correct ribbon cable for your Pi (Pi 5 uses a smaller connector)"
    ],
    "prereq": "Photo booth; loops and image arrays.",
    "sources": [
      {
        "title": "OpenCV: background subtraction",
        "url": "https://docs.opencv.org/4.x/d1/dc5/tutorial_background_subtraction.html"
      },
      {
        "title": "Raspberry Pi: camera software",
        "url": "https://www.raspberrypi.com/documentation/computers/camera_software.html"
      }
    ],
    "small": "from picamera2 import Picamera2\nfrom pathlib import Path\nfrom time import sleep\ncamera = Picamera2()\ntry:\n    camera.configure(camera.create_still_configuration())\n    camera.start()\n    sleep(2)\n    path = Path.home() / \"pi-test.jpg\"\n    camera.capture_file(str(path))\n    print(\"Saved:\", path)\nfinally:\n    camera.close()\n",
    "code": "from picamera2 import Picamera2\nimport cv2\ncamera = Picamera2()\nbackground = cv2.createBackgroundSubtractorMOG2(history=100, varThreshold=25, detectShadows=False)\ntry:\n    camera.configure(camera.create_video_configuration(main={\"size\": (640, 480), \"format\": \"RGB888\"}))\n    camera.start()\n    frames = 0\n    while True:\n        frame = camera.capture_array()\n        mask = background.apply(frame)\n        frames += 1\n        changed = cv2.countNonZero(mask) / mask.size\n        label = \"WARMUP\" if frames < 60 else (\"MOTION\" if changed > 0.03 else \"Still\")\n        cv2.putText(frame, label, (20, 40), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)\n        cv2.imshow(\"Motion detector - q quits\", frame)\n        cv2.imshow(\"Changed pixels\", mask)\n        if cv2.waitKey(20) & 0xFF == ord(\"q\"):\n            break\nfinally:\n    camera.close()\n    cv2.destroyAllWindows()\n",
    "build": "Check still capture first. Keep the camera fixed, then run the full example and allow 60 frames for the background model to settle.",
    "expected": "Two windows show the camera and a change mask. A label responds when more than 3% of pixels differ from the learned background.",
    "change": "After the starter photo test, move an object in front of the fixed camera. Compare its position with the saved still.",
    "predict": [
      "Would a sudden lighting change trigger this detector?",
      [
        "It could: many pixels change",
        "Never",
        "Only if a face is visible"
      ],
      0,
      "Pixel changes can come from motion, lighting, or camera movement."
    ],
    "solve": [
      "Show the changed-pixel percentage on screen.",
      "Test a moving hand, a lighting change, and an empty scene.",
      "Choose a threshold using those observations."
    ],
    "create": [
      "Save a still after a motion event.",
      "Use a five-second cooldown between saves.",
      "Record a test where lighting triggers a false alarm."
    ],
    "wiring": [
      [
        "With power disconnected",
        "Fit a supported camera to the CSI camera connector; use the correct Pi 4/Pi 5 cable"
      ],
      [
        "Before Python",
        "Run rpicam-hello --list-cameras in Terminal and check a camera is listed"
      ]
    ],
    "trouble": "This is a pixel-change detector, not AI object recognition. Fixed camera placement and steady lighting matter. q works when an OpenCV window has focus.",
    "setup": "vision",
    "smallExpected": "One image is saved as pi-test.jpg in your home folder. No motion detector window opens yet.",
    "walkthrough": [
      {
        "line": 4,
        "text": "Create a background model that learns the camera scene."
      },
      {
        "line": 13,
        "text": "Count nonzero pixels in the motion mask and divide by total pixels."
      },
      {
        "line": 14,
        "text": "Allow a warmup period before comparing the changed fraction with 0.03."
      }
    ],
    "addedLines": [
      2,
      4,
      6,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      22
    ]
  },
  {
    "id": "sensor-dashboard",
    "title": "Local sensor dashboard",
    "level": "Advanced",
    "category": "Physical computing",
    "minutes": "90–125",
    "summary": "Serve a Python dashboard that reports real Pi and button readings.",
    "skills": [
      "Flask",
      "JSON",
      "routes",
      "GPIO"
    ],
    "needs": [
      "Raspberry Pi 4 or 5",
      "Raspberry Pi OS desktop",
      "Monitor, keyboard, mouse",
      "1 button and jumper wires"
    ],
    "prereq": "Pi health logger and button-controlled lamp.",
    "sources": [
      {
        "title": "Raspberry Pi: Python web server with Flask",
        "url": "https://projects.raspberrypi.org/en/projects/python-web-server-with-flask"
      },
      {
        "title": "Flask: quickstart",
        "url": "https://flask.palletsprojects.com/en/stable/quickstart/"
      }
    ],
    "small": "from flask import Flask\napp = Flask(__name__)\n@app.get(\"/\")\ndef home():\n    return \"<h1>My Pi dashboard</h1>\"\nif __name__ == \"__main__\":\n    app.run(host=\"127.0.0.1\", port=5000, debug=False)\n",
    "code": "from flask import Flask, jsonify\nfrom gpiozero import CPUTemperature, Button\nfrom datetime import datetime\napp = Flask(__name__)\ncpu = CPUTemperature()\nbutton = Button(2, bounce_time=0.05)\n@app.get(\"/api\")\ndef data():\n    return jsonify(cpu_c=round(cpu.temperature, 1), button=button.is_pressed,\n                   time=datetime.now().isoformat(timespec=\"seconds\"))\n@app.get(\"/\")\ndef home():\n    values = data().get_json()\n    state = \"Pressed\" if values[\"button\"] else \"Released\"\n    return (\"<meta http-equiv='refresh' content='2'><h1>Pi dashboard</h1>\"\n            f\"<p>CPU: {values['cpu_c']} C</p><p>Button: {state}</p>\"\n            f\"<p>{values['time']}</p><p><a href='/api'>JSON data</a></p>\")\nif __name__ == \"__main__\":\n    try:\n        app.run(host=\"127.0.0.1\", port=5000, debug=False, use_reloader=False)\n    finally:\n        button.close()\n        cpu.close()\n",
    "build": "Run the starter and open http://127.0.0.1:5000 on the Pi. Stop it before running the complete example with CPU and button readings.",
    "expected": "The page refreshes every two seconds. Hold the button during a refresh to see Pressed. /api shows the same readings as JSON.",
    "change": "Change the starter h1 text and restart the Python script.",
    "predict": [
      "Which machine can open 127.0.0.1 for this dashboard?",
      [
        "The Pi running the server",
        "Every computer on the internet",
        "Only the teacher computer"
      ],
      0,
      "127.0.0.1 refers to the computer opening it; this server listens locally."
    ],
    "solve": [
      "Add a named status when CPU temperature is above a threshold.",
      "Keep the label clearly about CPU temperature.",
      "Include that status in the JSON route."
    ],
    "create": [
      "Add a second sensor.",
      "Show its reading on the page and /api.",
      "Display the units and last reading time."
    ],
    "wiring": [
      [
        "GPIO2 · physical 3",
        "One side of button"
      ],
      [
        "Other switched side of button",
        "GND · physical 6"
      ]
    ],
    "trouble": "Keep debug and reloader off while using GPIO. Stop an old copy before starting another on port 5000. This is a local classroom development server.",
    "setup": "dashboard",
    "smallExpected": "A local page at http://127.0.0.1:5000 shows My Pi dashboard. No live readings appear yet.",
    "walkthrough": [
      {
        "line": 7,
        "text": "Create a route that returns the current measurements as JSON."
      },
      {
        "line": 12,
        "text": "Build a page from the same data and refresh it every two seconds."
      },
      {
        "line": 20,
        "text": "Bind only to the Pi itself; keep debug and the reloader off so devices are opened once."
      }
    ],
    "addedLines": [
      1,
      2,
      3,
      5,
      6,
      7,
      8,
      9,
      10,
      13,
      14,
      15,
      16,
      17,
      19,
      20,
      21,
      22,
      23
    ]
  },
  {
    "id": "robot-buggy",
    "title": "Program a robot buggy",
    "level": "Advanced",
    "category": "Camera & robotics",
    "minutes": "100–150",
    "summary": "Drive two motors through a driver and plan a timed route.",
    "skills": [
      "motor driver",
      "functions",
      "timed control"
    ],
    "needs": [
      "Raspberry Pi 4 or 5",
      "Raspberry Pi OS desktop",
      "Monitor, keyboard, mouse",
      "2-wheel chassis, 2 low-voltage DC gear motors, caster",
      "DRV8833 dual H-bridge breakout",
      "Separate motor battery matched to motors/driver",
      "Pi power supply or suitable USB battery, jumper wires"
    ],
    "prereq": "GPIO inputs/outputs and functions; teacher wiring check.",
    "sources": [
      {
        "title": "Raspberry Pi: build a buggy",
        "url": "https://projects.raspberrypi.org/en/projects/build-a-buggy"
      },
      {
        "title": "GPIO Zero: Robot",
        "url": "https://gpiozero.readthedocs.io/en/stable/api_boards.html#robot"
      }
    ],
    "small": "from gpiozero import Robot\nfrom time import sleep\nwith Robot(left=(17, 18), right=(22, 23)) as buggy:\n    buggy.forward(0.3)\n    sleep(0.5)\n    buggy.stop()\n",
    "code": "from gpiozero import Robot\nfrom time import sleep\nwith Robot(left=(17, 18), right=(22, 23)) as buggy:\n    def move(action, speed, seconds):\n        action(speed)\n        sleep(seconds)\n        buggy.stop()\n        sleep(0.5)\n    input(\"Clear the route, then Enter: \")\n    for side in range(4):\n        move(buggy.forward, 0.3, 1)\n        move(buggy.right, 0.3, 0.5)\nprint(\"Route complete\")\n",
    "build": "Test with wheels lifted. Confirm each motor’s direction using the starter before placing the buggy on a clear floor. Calibrate the turn duration before running the route.",
    "expected": "The buggy repeats four forward moves and four turns. A roughly square route requires calibration; time alone does not measure angle.",
    "change": "With wheels lifted, compare forward(0.2) and forward(0.3). Check both wheels turn in the forward direction.",
    "predict": [
      "Why may a 0.5-second turn fail to make exactly 90 degrees?",
      [
        "Battery, friction, and motors affect turning",
        "Python ignores decimals",
        "All robots always turn 180 degrees"
      ],
      0,
      "Open-loop timing does not measure the actual angle or distance."
    ],
    "solve": [
      "Calibrate a roughly 90-degree turn on your floor.",
      "Complete four forward-and-turn pairs.",
      "Measure the final distance from the start."
    ],
    "create": [
      "Navigate around three marked checkpoints.",
      "Use functions for repeated movements.",
      "Record one calibration change and the effect on the route."
    ],
    "wiring": [
      [
        "GPIO17 · physical 11 / GPIO18 · physical 12",
        "DRV8833 AIN1 / AIN2"
      ],
      [
        "GPIO22 · physical 15 / GPIO23 · physical 16",
        "DRV8833 BIN1 / BIN2"
      ],
      [
        "DRV8833 AOUT1/AOUT2 and BOUT1/BOUT2",
        "Left and right DC motors"
      ],
      [
        "DRV8833 VM",
        "Separate motor battery +, matched to motor and driver ratings"
      ],
      [
        "Battery −, driver GND, Pi GND · physical 6",
        "Common ground"
      ],
      [
        "DRV8833 nSLEEP if exposed",
        "3.3V · physical 1 (check your breakout datasheet)"
      ]
    ],
    "trouble": "Never connect a motor directly to GPIO or power motors from a GPIO pin. This wiring targets a DRV8833 breakout; follow its labels and ratings. Stop and lift wheels if a motor stalls.",
    "setup": "gpio",
    "smallExpected": "Both motors run forward at 30% for half a second, then stop. Keep the wheels lifted for this first test.",
    "walkthrough": [
      {
        "line": 4,
        "text": "Wrap a timed movement, stop, and pause in one function."
      },
      {
        "line": 9,
        "text": "Wait until you clear the route and press Enter."
      },
      {
        "line": 10,
        "text": "Repeat four forward-and-turn pairs. Calibrate the turn duration for your own buggy."
      }
    ],
    "addedLines": [
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13
    ]
  }
];
