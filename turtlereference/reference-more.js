/* Drawing recipes and deeper Python examples, using the same editable runtime. */
(() => {
  const add = (id, title, group, syntax, summary, params, code, expected, tryThis, watchFor, options = {}) => {
    window.TURTLE_REFERENCE.push({id, title, group, syntax, summary, params, code, expected, tryThis, watchFor, ...options});
  };
  add('triangle', 'Draw a triangle', 'Shape recipes', 'for side in range(3):\n    forward(100)\n    left(120)',
    'Three equal sides and three equal turns make an equilateral triangle.',
    [['3 repeats', 'Draw three sides.'], ['120° turn', 'A full turn of 360° divided by three corners.']],
    'pensize(4)\ncolor("teal")\nfor side in range(3):\n    forward(100)\n    left(120)',
    'A closed triangle with three equal sides.', 'Make a triangle with 60-pixel sides. Keep the turn the same.',
    'The turtle turns through the outside angle at each corner. The angle inside this triangle is 60°.',
    {related:['exterior-angles','for','hexagon'], visual:'polygon'});
  add('rectangle', 'Draw a rectangle', 'Shape recipes', 'for pair in range(2):',
    'A rectangle alternates between a long side and a short side. Repeat that pair twice.',
    [['Long side', '100 pixels in this example.'], ['Short side', '60 pixels in this example.']],
    'pensize(4)\ncolor("coral")\nfor pair in range(2):\n    forward(100)\n    left(90)\n    forward(60)\n    left(90)',
    'A rectangle that is wider than it is tall.', 'Make it 60 pixels wide and 120 pixels tall.',
    'Each repetition draws two sides. Two repetitions complete all four sides.', {related:['for','variables','scaling']});
  add('hexagon', 'Draw a hexagon', 'Shape recipes', 'for side in range(6):\n    forward(60)\n    left(60)',
    'Six sides share one complete turn. Each corner turns 360 ÷ 6, which is 60°.',
    [['6', 'Number of sides.'], ['60°', 'Turn after each side.']],
    'pensize(4)\ncolor("purple")\nfor side in range(6):\n    forward(60)\n    left(60)',
    'A closed, six-sided shape.', 'Change it into an octagon: eight sides and a 45° turn.',
    'Change the number of repetitions and the turn together when changing the number of sides.', {related:['triangle','exterior-angles','for']});
  add('star-shape', 'Draw a five-point star', 'Shape recipes', 'right(144)',
    'A larger turn makes the lines cross to form a star. Watch the five points appear as the loop runs.',
    [['5 repeats', 'Five long lines complete this star.'], ['144°', 'The turn used at each point.']],
    'color("goldenrod")\npensize(4)\nfor point in range(5):\n    forward(140)\n    right(144)\nhideturtle()',
    'A five-point star with crossing lines inside.', 'Try 72 instead of 144. Predict the shape before running.',
    'Keep the line lengths equal so the last line meets the start.', {related:['for','right','fill']});
  add('semicircle', 'Draw a semicircle', 'Shape recipes', 'circle(60, 180)',
    'The second number limits the circle to part of a full turn. Here it draws half a circle.',
    [['60', 'The radius.'], ['180', 'Half of 360°, so half the circle is drawn.']],
    'pensize(4)\ncolor("teal")\ncircle(60, 180)',
    'A curved line forming the right half of a circle, ending 120 pixels above the start.',
    'Change 180 to 90. Then try a radius of -60 with an extent of 180.',
    'The turtle changes heading as it follows the curve. Its final direction affects the next command.',
    {related:['circle','radius','petal'], visual:'arc'});
  add('petal', 'Draw one petal', 'Shape recipes', 'circle(80, 60)\nleft(120)',
    'Two curved edges meet at pointed ends. Try one edge, then watch the loop complete the second.',
    [['60° arc', 'A short piece of a circle.'], ['120° turn', 'Points the turtle toward the return edge.']],
    'color("seagreen")\nbegin_fill()\nfor edge in range(2):\n    circle(80, 60)\n    left(120)\nend_fill()',
    'One filled green leaf or petal.', 'Change both curves by changing the radius from 80 to 120.',
    'The turn between curves is part of the shape. Changing it can leave the two ends apart.', {related:['circle','fill','circle-rosette']});
  add('ring', 'Make a ring with layers', 'Shape recipes', 'dot(120, "teal")\ndot(70, "white")',
    'Place a smaller dot over a larger one. The visible edge of the larger dot becomes a ring.',
    [['First dot', 'The outside size and color.'], ['Second dot', 'The inside size, using the background color.']],
    'bgcolor("white")\ndot(120, "teal")\ndot(70, "white")\nhideturtle()',
    'A teal ring centered in the world.', 'Make the ring thinner by increasing the inner dot to 100.',
    'Drawing order matters. The most recent dot covers the earlier one.', {related:['dot','bgcolor','concentric-circles']});
  add('smiley', 'Build a smiley face', 'Shape recipes', 'dot() + goto() + circle()',
    'Combine a filled face, two small eyes, and a half-circle smile. Each part uses a command you already know.',
    [['Face', 'A large gold dot.'], ['Eyes', 'Two small dots at matching heights.'], ['Smile', 'A semicircle drawn from its left endpoint.']],
    'dot(140, "gold")\npenup()\ngoto(-25, 25)\ndot(10, "navy")\ngoto(25, 25)\ndot(10, "navy")\ngoto(-35, -10)\nsetheading(270)\npendown()\ncolor("navy")\npensize(4)\ncircle(35, 180)\nhideturtle()',
    'A gold face with two navy eyes and a curved smile.', 'Move both eyes 10 pixels higher. Keep their x coordinates the same.',
    'Lift the pen while moving between facial features to avoid connecting lines.', {related:['dot','goto','semicircle']});
  add('house-outline', 'Combine shapes into a house', 'Shape recipes', 'square + two roof lines',
    'Draw the square wall first. Then move to its top-left corner and add two sloping roof lines.',
    [['Square', 'Four 100-pixel sides.'], ['Roof', 'Two more 100-pixel lines, turned to meet above the square.']],
    'penup()\ngoto(-50, -70)\npendown()\npensize(4)\ncolor("teal")\nfor side in range(4):\n    forward(100)\n    left(90)\nleft(90)\nforward(100)\nright(30)\nforward(100)\nright(120)\nforward(100)\nhideturtle()',
    'A square house with a triangular roof.', 'Make the roof coral by changing the pen color just before right(30).',
    'Track where the square loop finishes before adding the roof commands.', {related:['for','triangle','color']});
  add('heart', 'Draw a heart with arcs', 'Shape recipes', 'circle(50, 180)',
    'Two straight sides make the bottom point. Two semicircles form the rounded top.',
    [['100-pixel sides', 'Lead into and out of the curved top.'], ['50-pixel radius', 'Each top semicircle is 100 pixels wide.']],
    'penup()\nright(90)\nforward(70)\nleft(135)\npendown()\ncolor("crimson")\nbegin_fill()\nforward(100)\ncircle(50, 180)\nright(90)\ncircle(50, 180)\nforward(100)\nend_fill()\nhideturtle()',
    'A filled heart with two rounded lobes and a pointed bottom.', 'Make the heart smaller using 60-pixel sides and 30-pixel radii.',
    'Scale the straight sides and the circle radii together to keep the ends connected.', {related:['semicircle','fill','scaling']});

  add('dashed-line', 'Draw a dashed line', 'Pattern recipes', 'pendown()\nforward(15)\npenup()\nforward(10)',
    'Repeat a short drawn movement and a short movement with the pen lifted.',
    [['15 pixels', 'Length of each dash.'], ['10 pixels', 'Length of each gap.']],
    'penup()\nbackward(100)\ncolor("teal")\npensize(4)\nfor dash in range(8):\n    pendown()\n    forward(15)\n    penup()\n    forward(10)',
    'Eight dashes separated by equal gaps.', 'Make the dashes 10 pixels long and the gaps 15 pixels long.',
    'Put both pen changes inside the loop so every dash gets a gap.', {related:['penup','for','stair-pattern']});
  add('stair-pattern', 'Repeat a staircase', 'Pattern recipes', 'forward(25)\nleft(90)\nforward(25)\nright(90)',
    'One horizontal line, one vertical line, and two turns make a repeatable step.', [],
    'penup()\ngoto(-60, -60)\npendown()\ncolor("coral")\npensize(4)\nfor step in range(5):\n    forward(25)\n    left(90)\n    forward(25)\n    right(90)',
    'Five steps climbing upward to the right.', 'Make each step wider while keeping its height at 25.',
    'The right turn returns the turtle to its original heading, ready for the next step.', {related:['for','left','right']});
  add('circle-rosette', 'Rotate circles into a flower', 'Pattern recipes', 'circle(40)\nleft(45)',
    'Each circle returns to its starting point. A small turn changes where the next circle sits.',
    [['8 circles', 'Eight repeats arranged around the middle.'], ['45° turn', '360 ÷ 8, so the turns complete one full rotation.']],
    'color("orchid")\npensize(2)\nfor petal in range(8):\n    circle(40)\n    left(45)\ndot(24, "gold")\nhideturtle()',
    'Eight overlapping circular petals around a gold center.', 'Make 12 petals by using range(12) and left(30).',
    'Changing the number of petals also changes the turn needed to spread them evenly.', {related:['circle','exterior-angles','click-flower']});
  add('square-spiral', 'Grow a square spiral', 'Pattern recipes', 'for length in range(10, 160, 10):',
    'Make each line longer while keeping the same quarter turn. The drawing grows outward.',
    [['Start: 10', 'Length of the first line.'], ['Stop: 160', 'The loop stops before this value.'], ['Step: 10', 'How much the length grows each time.']],
    'color("teal")\npensize(3)\nfor length in range(10, 160, 10):\n    forward(length)\n    left(90)',
    'A square spiral with gradually increasing gaps between its arms.', 'Try left(91) to add a slight twist.',
    'The loop variable itself supplies each new length.', {related:['range-step','loop-index','augmented-assignment']});
  add('concentric-circles', 'Circles with one center', 'Pattern recipes', 'goto(0, -radius)\ncircle(radius)',
    'Move to the bottom edge of each circle before drawing it. This keeps every circle centered at (0, 0).',
    [['-radius', 'Places the starting point directly below the center.']],
    'color("teal")\npensize(3)\nfor radius in range(20, 101, 20):\n    penup()\n    goto(0, -radius)\n    pendown()\n    circle(radius)\nhideturtle()',
    'Five circles sharing the same center.', 'Use a step of 10 to draw more rings.',
    'Each circle starts on its edge. Moving to the same starting point for every size would give them different centers.', {related:['radius','range-step','goto']});
  add('sunburst', 'Repeat rays around a center', 'Pattern recipes', 'forward(45)\nbackward(80)\nleft(30)',
    'Draw one ray, return to the middle, and turn before drawing the next ray.',
    [['35-pixel move', 'A pen-up gap between the center and each ray.'], ['12 rays', 'Each ray gets a 30° turn.']],
    'color("goldenrod")\npensize(4)\nfor ray in range(12):\n    penup()\n    forward(35)\n    pendown()\n    forward(45)\n    penup()\n    backward(80)\n    left(30)\ndot(50, "gold")\nhideturtle()',
    'Twelve rays evenly spaced around a gold center.', 'Make six rays using 60° turns.',
    'Return the full distance traveled: 35 + 45 = 80.', {related:['backward','for','exterior-angles']});
  add('dot-grid', 'Build rows and columns', 'Pattern recipes', 'x = column * 50 - 100\ny = row * 60 - 60',
    'Use one loop for rows and another for columns. The loop numbers calculate every dot’s position.',
    [['Column', 'Changes the horizontal position.'], ['Row', 'Changes the vertical position.']],
    'penup()\nfor row in range(3):\n    for column in range(5):\n        x = column * 50 - 100\n        y = row * 60 - 60\n        goto(x, y)\n        dot(24, "teal")\nhideturtle()',
    'Three rows of five evenly spaced dots.', 'Change the horizontal spacing from 50 to 40.',
    'The inner loop completes a whole row before the outer loop starts the next one.', {related:['nested','coordinates','checkerboard'], visual:'grid'});
  add('checkerboard', 'Alternate a checkerboard', 'Pattern recipes', '(row + column) % 2',
    'The row and column together decide whether a square has an even or odd position in the pattern.',
    [['Remainder 0', 'Use teal.'], ['Remainder 1', 'Use gold.']],
    'speed(0)\nfor row in range(4):\n    for column in range(4):\n        penup()\n        goto(column * 40 - 80, row * 40 - 80)\n        pendown()\n        if (row + column) % 2 == 0:\n            color("teal")\n        else:\n            color("gold")\n        begin_fill()\n        for side in range(4):\n            forward(40)\n            left(90)\n        end_fill()\nhideturtle()',
    'A four-by-four checkerboard with alternating colors.', 'Use six rows and six columns. Keep the squares small enough to fit.',
    'Adding the row number makes the colors switch at the start of each row.', {related:['modulo','nested','fill'], visual:'grid'});

  add('range-step', 'Choose a range start and step', 'More Python', 'range(start, stop, step)',
    'Choose where counting begins and how much to add each time.',
    [['start', 'First value to use.'], ['stop', 'Stop before reaching this value.'], ['step', 'The change between successive values.']],
    'color("purple")\nfor radius in range(20, 81, 20):\n    circle(radius)\n    print(radius)',
    'Circles with radii 20, 40, 60, and 80. Those numbers also appear in the output.',
    'Use range(10, 91, 10). Predict how many circles it will draw.',
    'The stop value is excluded. A stop of 81 allows the loop to use 80.', {related:['for','square-spiral','concentric-circles']});
  add('loop-index', 'Use the loop number', 'More Python', 'size = 20 + index * 10',
    'The loop number can change each shape. Here it makes each dot larger.',
    [['index', 'Takes the values 0, 1, 2, 3, and 4.'], ['20 + index * 10', 'Produces sizes 20, 30, 40, 50, and 60.']],
    'penup()\nbackward(100)\nfor index in range(5):\n    size = 20 + index * 10\n    dot(size, "teal")\n    forward(50)\n    print(index, size)\nhideturtle()',
    'Five dots growing from left to right. The output pairs each loop number with its dot size.',
    'Make the sizes grow by 5 each time.', 'range(5) begins at zero. Work out the first calculation using index = 0.',
    {related:['for','variables','enumerate']});
  add('augmented-assignment', 'Update a variable with +=', 'More Python', 'length += 20',
    'Increase a stored number. length += 20 has the same effect as length = length + 20.',
    [['+=', 'Add to the existing value.'], ['-=', 'Subtract from the existing value.']],
    'length = 20\ncolor("coral")\npensize(3)\nfor turn in range(5):\n    forward(length)\n    left(90)\n    length += 20',
    'Five lines grow by 20 pixels each time.', 'Start at 100 and use length -= 15 to make the lines shrink.',
    'Create the variable before updating it.', {related:['variables','while','square-spiral']});
  add('list-index', 'Choose one item from a list', 'More Python', 'colors[1]',
    'Use an index to get one item from a list. The first item is at index 0.',
    [['[0]', 'The first item.'], ['[1]', 'The second item.'], ['[-1]', 'The last item.']],
    'colors = ["teal", "coral", "purple"]\ncolor(colors[1])\ncircle(50)\nprint("Last color:", colors[-1])',
    'A coral circle. The output identifies purple as the last color.', 'Draw with colors[0], then colors[-1].',
    'A three-item list has indexes 0, 1, and 2. Index 3 is beyond its end.', {related:['lists','list-length','modulo']});
  add('list-length', 'Count items with len()', 'More Python', 'len(colors)',
    'Use the number of items in a list to control the drawing.',
    [['len()', 'Returns how many items the list contains.']],
    'colors = ["teal", "coral", "gold", "purple"]\nangle = 360 / len(colors)\npensize(5)\nfor shade in colors:\n    color(shade)\n    forward(80)\n    backward(80)\n    left(angle)\nprint("Spokes:", len(colors))',
    'Four colored spokes, evenly spaced around the center.', 'Add two colors to the list. Run again and look at the new spacing.',
    'The list must contain at least one color before dividing by its length.', {aliases:['len'], related:['lists','exterior-angles','sunburst']});
  add('list-append', 'Add an item with append()', 'More Python', 'colors.append("gold")',
    'Add one item to the end of an existing list.',
    [['append(item)', 'Changes the list by adding the item.']],
    'colors = ["teal", "coral"]\ncolors.append("gold")\npenup()\nbackward(60)\nfor shade in colors:\n    dot(40, shade)\n    forward(60)\nhideturtle()\nprint(colors)',
    'Three dots. The gold dot comes from the item added with append().', 'Append "purple" before the loop.',
    'Write colors.append("gold") on its own line. It changes the existing list.', {aliases:['append'], related:['lists','list-length']});
  add('enumerate', 'Get the item and its number', 'More Python', 'for index, shade in enumerate(colors):',
    'enumerate() gives you both an item and its position in the list.',
    [['index', 'The item number, starting at zero.'], ['shade', 'The color from the list.']],
    'colors = ["teal", "coral", "gold"]\npenup()\nfor index, shade in enumerate(colors):\n    goto(index * 70 - 70, 0)\n    dot(50, shade)\n    color("navy")\n    write(index, align="center", font=("Arial", 18))\nhideturtle()',
    'Three colored dots labeled 0, 1, and 2.', 'Add another color and see which label it receives.',
    'The two names before in receive two different values each time.', {related:['lists','loop-index','unpacking']});
  add('dictionary', 'Name values with a dictionary', 'More Python', 'palette = {"cool": "teal", "warm": "coral"}',
    'A dictionary connects a key to a value. Use the key to look up the value you need.',
    [['Key', 'A name such as "cool".'], ['Value', 'The color stored under that key.']],
    'palette = {"cool": "teal", "warm": "coral"}\ncolor(palette["cool"])\npensize(4)\ncircle(50)\nprint(palette["warm"])',
    'A teal circle. The output prints coral.', 'Change the value for "cool" to "skyblue".',
    'The key in square brackets must match a key stored in the dictionary.', {aliases:['dict','key','value'], related:['variables','lists','color']});
  add('tuples', 'Keep a coordinate pair', 'More Python', 'point = (80, 40)',
    'A tuple keeps values together in a fixed order. A pair is useful for storing an x and y position.',
    [['point[0]', 'The first value: x.'], ['point[1]', 'The second value: y.']],
    'point = (80, 40)\ngoto(point[0], point[1])\ndot(14, "teal")\nprint(point)',
    'A line ending at (80, 40), marked by a dot.', 'Store (-80, 40) and run again.',
    'Pass the two values separately to this editor’s goto() command.', {related:['coordinates','unpacking','list-index']});
  add('unpacking', 'Unpack x and y', 'More Python', 'for x, y in points:',
    'Give each part of a pair its own name. A loop can unpack one coordinate pair at a time.',
    [['x, y', 'Names for the two numbers in each pair.']],
    'points = [(0, 80), (60, -20), (-60, -20)]\npenup()\ngoto(-60, -20)\npendown()\ncolor("teal")\npensize(3)\nfor x, y in points:\n    goto(x, y)',
    'A triangle made by joining the points in list order.', 'Move the top point from (0, 80) to (20, 80).',
    'Each pair must provide two values because the loop uses two names.', {related:['tuples','lists','goto']});
  add('default-parameters', 'Give a parameter a default', 'More Python', 'def square(size=60):',
    'A default lets the function run even when a call leaves that argument out.',
    [['square()', 'Uses the default size of 60.'], ['square(90)', 'Uses the supplied size of 90.']],
    'def square(size=60):\n    for side in range(4):\n        forward(size)\n        left(90)\n\nsquare()\npenup()\nforward(90)\npendown()\nsquare(90)',
    'A 60-pixel square followed by a 90-pixel square.', 'Change the default to 40. Which square changes?',
    'The value in the function definition is used only when that argument is omitted.', {related:['parameters','functions','multiple-parameters']});
  add('multiple-parameters', 'Pass a size and a color', 'More Python', 'def bead(size, shade):',
    'Let a function receive more than one value. Each call chooses the size and color of its bead.',
    [['size', 'Diameter of the dot.'], ['shade', 'Color of the dot.']],
    'def bead(size, shade):\n    dot(size, shade)\n    penup()\n    forward(size + 15)\n\nbead(30, "teal")\nbead(60, "coral")\nbead(90, "gold")\nhideturtle()',
    'Three beads with different sizes and colors.', 'Add a fourth bead and choose its arguments. Reposition the row if it reaches an edge.',
    'Arguments are matched to parameters in order: size first, then shade.', {related:['parameters','default-parameters','dot']});

  add('exterior-angles', 'Calculate a polygon’s turn', 'Math for drawing', 'angle = 360 / sides',
    'Equal turns around a regular polygon add up to one full rotation. Divide 360 by the number of sides.',
    [['sides', 'Number of equal-length sides.'], ['360 / sides', 'The outside turn at each corner.']],
    'sides = 6\nangle = 360 / sides\ncolor("teal")\npensize(3)\nfor side in range(sides):\n    forward(60)\n    left(angle)\nprint("Turn:", angle)',
    'A hexagon. The output reports a 60° turn.', 'Try 3, 4, or 8 sides by changing the first line.',
    'Use at least three sides for a polygon. Larger shapes may need shorter side lengths to fit.', {related:['triangle','hexagon','variables'], visual:'polygon'});
  add('modulo', 'Cycle colors with %', 'Math for drawing', 'index % len(colors)',
    'The remainder operator makes a repeating sequence of list indexes.',
    [['% 3', 'Produces 0, 1, 2, then starts at 0 again as the input increases.']],
    'colors = ["teal", "coral", "gold"]\npenup()\nbackward(130)\nfor index in range(8):\n    shade = colors[index % len(colors)]\n    dot(28, shade)\n    forward(35)\nhideturtle()',
    'A row repeating teal, coral, gold, teal, coral, gold…', 'Add a fourth color. The repeating cycle will use it automatically.',
    'The remainder stays within the list’s valid indexes.', {aliases:['remainder','mod'], related:['list-index','list-length','checkerboard']});
  add('scaling', 'Scale a drawing', 'Math for drawing', 'new_size = base_size * scale',
    'Multiply dimensions by the same factor to make a drawing larger or smaller.',
    [['Scale 2', 'Twice as wide and twice as tall.'], ['Scale 0.5', 'Half as wide and half as tall.']],
    'def square(size):\n    for side in range(4):\n        forward(size)\n        left(90)\n\nbase_size = 40\nsquare(base_size)\npenup()\nforward(70)\npendown()\nsquare(base_size * 2)',
    'A small square and a square with twice its side length.', 'Change the second scale factor from 2 to 0.5.',
    'Scale distances and radii together. The turning angles stay the same.', {related:['parameters','heart','rectangle']});
  add('reflection', 'Reflect across the middle', 'Math for drawing', 'mirror_x = -x',
    'Change the sign of x to reflect a point across the vertical center line. Keep y unchanged.',
    [['(60, 40)', 'A point on the right.'], ['(-60, 40)', 'Its matching point on the left.']],
    'penup()\nfor x in [-60, 60]:\n    goto(x, 40)\n    dot(50, "teal")\nhideturtle()',
    'Two matching dots at equal distances from the middle.', 'Change the two x values to -100 and 100.',
    'Reflecting across the horizontal center line changes the sign of y instead.', {related:['coordinates','click-mirror','lists']});
  add('distance-math', 'Measure a diagonal', 'Math for drawing', 'math.sqrt(x * x + y * y)',
    'Use a point’s horizontal and vertical distances to calculate its straight-line distance from the middle.',
    [['x * x + y * y', 'Add the squares of the two distances.'], ['math.sqrt()', 'Take the square root of that total.']],
    'import math\n\nx = 80\ny = 60\ngoto(x, y)\ndot(12, "coral")\ndistance = math.sqrt(x * x + y * y)\nprint("Distance:", distance)',
    'A diagonal to (80, 60). Its length is 100 pixels.', 'Try x = 30 and y = 40. Predict the printed distance.',
    'Import math before using math.sqrt(). These distances are measured from (0, 0).', {aliases:['sqrt','Pythagorean'], related:['goto','coordinates','rounding']});
  add('rounding', 'Round a calculated number', 'Math for drawing', 'round(value, 1)',
    'Choose how many decimal places to keep when displaying a calculated value.',
    [['value', 'The number you want to round.'], ['1', 'Keep one digit after the decimal point.']],
    'length = 100 / 3\nforward(length)\nprint("Original:", length)\nprint("Rounded:", round(length, 1))',
    'A line about 33 pixels long. The output shows the calculation and its rounded value, 33.3.',
    'Round to two decimal places instead.', 'round() returns a value. Store it if you want to use the rounded number later.', {aliases:['round','decimal','float'], related:['variables','distance-math','print']});

  add('random-seed', 'Repeat a random pattern', 'Random drawings', 'random.seed(7)',
    'A seed gives a random-number generator a repeatable starting point. The same seed recreates the same pattern.',
    [['7', 'The seed for this example. Choose another whole number for another arrangement.']],
    'import random\n\nrandom.seed(7)\nspeed(0)\nbgcolor("midnightblue")\npenup()\nfor star in range(20):\n    goto(random.randint(-160, 160), random.randint(-160, 160))\n    dot(random.randint(3, 9), "gold")\nhideturtle()',
    'A small star field that repeats each time you run it with seed 7.', 'Change the seed to 12, then run twice.',
    'Set the seed before the loop. Resetting it inside the loop would restart the sequence each time.', {aliases:['seed'], related:['random','for','dot']});
  add('coin-flip', 'Draw a random coin flip', 'Random drawings', 'result = random.choice(["heads", "tails"])',
    'Choose one outcome, then use a condition to decide how to draw it.', [],
    'import random\n\nresult = random.choice(["heads", "tails"])\nif result == "heads":\n    dot(120, "gold")\nelse:\n    dot(120, "silver")\ncolor("navy")\nwrite(result, align="center", font=("Arial", 18))\nhideturtle()',
    'A gold heads coin or a silver tails coin.', 'Run several times and keep a count of the two outcomes.',
    'Random choices can repeat. A few flips do not have to contain equal numbers of each outcome.', {related:['random','if','write']});

  add('click-flower', 'Plant flowers with a click', 'Interactive recipes', 'getscreen().onclick(flower)',
    'Build a flower function, try it once, then use click coordinates to decide where the next flowers grow.',
    [['x, y', 'Where the flower’s center will be placed.']],
    'speed(0)\ndef flower(x, y):\n    penup()\n    goto(x, y)\n    pendown()\n    color("orchid")\n    for petal in range(6):\n        circle(18)\n        left(60)\n    dot(14, "gold")\n\nflower(0, 0)\ngetscreen().onclick(flower)',
    'One flower in the middle. Click the world to plant more.', 'Change the petal color and circle radius. Run again, then plant a new arrangement.',
    'The first function call proves the drawing works before the click handler uses it.',
    {related:['screen-click','circle-rosette','parameters']});
  add('click-mirror', 'Make a mirror drawing tool', 'Interactive recipes', 'goto(x, y)\ngoto(-x, y)',
    'Place one dot at the click and another at its reflection. Every click adds a matching pair.',
    [['x, y', 'The position you clicked.'], ['-x, y', 'The reflected position.']],
    'speed(0)\ndef pair(x, y):\n    penup()\n    goto(x, y)\n    dot(16, "teal")\n    goto(-x, y)\n    dot(16, "coral")\n\npair(60, 40)\ngetscreen().onclick(pair)',
    'Two starting dots. Each click adds another teal-and-coral pair.', 'Reflect across the horizontal line by changing the second goto() to goto(x, -y).',
    'A click exactly on the reflection line puts both dots in the same place.', {related:['reflection','screen-click','parameters']});
})();
