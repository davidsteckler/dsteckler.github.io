/* Examples use the commands implemented by the shared browser Turtle editor. */
window.TURTLE_REFERENCE = (() => {
  const entries = [];
  const add = (id, title, group, syntax, summary, params, code, expected, tryThis, watchFor, options = {}) => {
    entries.push({id, title, group, syntax, summary, params, code, expected, tryThis, watchFor, ...options});
  };
  add('start', 'Start drawing', 'Start here', 'forward(80)',
    'The turtle begins in the middle, facing right, with its pen touching the page. Run a command and watch what changes.',
    [['Command', 'The name tells Python what to do.'], ['Parentheses ( )', 'Hold the information the command needs.'], ['80', 'The distance to move, in pixels.']],
    'forward(80)\nleft(90)\nforward(60)',
    'A line to the right, a left turn, then a line upward.',
    'Change 80 to 120. Run again. Then change the turn from 90 to 45.',
    'Type command names in lowercase. Keep both parentheses. This editor already provides the Turtle commands.',
    {related:['forward','left','circle','errors-name'], visual:'heading'});
  add('coordinates', 'The 400 × 400 world', 'Start here', 'goto(x, y)',
    'The middle is (0, 0). The first number moves across the page. The second moves up or down. The edges are 200 pixels from the middle.',
    [['x', 'Negative goes left; positive goes right.'], ['y', 'Negative goes down; positive goes up.']],
    'dot(10, "teal")\npenup()\ngoto(100, 50)\npendown()\ndot(14, "coral")\nprint(position())',
    'A teal dot at the middle and a coral dot 100 pixels right and 50 pixels up. The output prints the new position.',
    'Use goto(-100, 50), then goto(-100, -50).',
    'Movement beyond an edge is still happening; it is outside the visible drawing. home() brings the turtle back.',
    {related:['goto','home','position','penup'], visual:'coordinates'});
  add('radius', 'Radius and diameter', 'Start here', 'circle(40)\ndot(80)',
    'Radius is the distance from a circle’s center to its edge. Diameter goes all the way across. A circle with radius 40 is 80 pixels wide.',
    [['circle(radius)', 'Starts at a point on the circle’s edge.'], ['dot(diameter)', 'Puts a filled circle around the turtle’s current position.']],
    'color("teal")\npensize(3)\ncircle(40)\npenup()\nforward(110)\ndot(80, "coral")',
    'Two circles with the same width. The outlined circle sits above its starting point; the dot is centered on its position.',
    'Change both sizes so the circles are 120 pixels wide.',
    'circle(80) and dot(80) have different widths. The number means radius for circle and diameter for dot.',
    {related:['circle','dot'], visual:'radius'});
  add('angles', 'Turns and directions', 'Start here', 'left(90)\nsetheading(90)',
    'A turn changes the direction the turtle faces. A quarter turn is 90°, a half turn is 180°, and a full turn is 360°.',
    [['left / right', 'Turn this many degrees from the current direction.'], ['setheading', 'Face a particular direction: 0 right, 90 up, 180 left, 270 down.']],
    'forward(60)\nleft(90)\nforward(60)\nleft(90)\nforward(60)',
    'Three sides of a square. Each left turn is measured from where the turtle was facing.',
    'Replace the second left(90) with setheading(90). Look at the last line.',
    'Turning happens in place. Add forward() after the turn to draw in the new direction.',
    {related:['left','right','setheading','heading'], visual:'heading'});
  add('forward', 'forward()', 'Move & turn', 'forward(distance)',
    'Move in the direction the turtle is facing. The pen draws a line when it is down.',
    [['distance', 'How far to move, in pixels.']],
    'pensize(4)\nforward(100)', 'A 100-pixel line to the right.',
    'Try distances of 30, 80, and 150. Add left(90) before forward().',
    'forward() needs a distance inside the parentheses.', {aliases:['fd'], related:['backward','left','penup']});
  add('backward', 'backward()', 'Move & turn', 'backward(distance)',
    'Move behind the turtle. It keeps facing the same direction.', [['distance', 'How far to move backward, in pixels.']],
    'color("teal")\nforward(80)\ncolor("coral")\nbackward(120)',
    'The turtle traces back over the line, then continues 40 pixels left of the middle.',
    'Add forward(30) at the end. Watch which way the turtle moves.',
    'Moving backward does not turn the turtle around.', {aliases:['back','bk'], related:['forward','heading']});
  add('left', 'left()', 'Move & turn', 'left(angle)',
    'Turn counterclockwise, staying in the same place.', [['angle', 'The size of the turn, in degrees.']],
    'forward(80)\nleft(90)\nforward(80)', 'A corner that turns upward.',
    'Change 90 to 45, then 180.', 'Use forward() after left() to see a line in the new direction.',
    {aliases:['lt'], related:['right','angles','setheading'], visual:'heading'});
  add('right', 'right()', 'Move & turn', 'right(angle)',
    'Turn clockwise, staying in the same place.', [['angle', 'The size of the turn, in degrees.']],
    'forward(80)\nright(90)\nforward(80)', 'A corner that turns downward.',
    'Replace right(90) with right(45).', 'A turn changes the heading. It does not move the turtle forward.',
    {aliases:['rt'], related:['left','angles','setheading']});
  add('goto', 'goto()', 'Move & turn', 'goto(x, y)',
    'Move to a point in the world. The turtle keeps its current heading.',
    [['x', 'Horizontal position: left is negative, right is positive.'], ['y', 'Vertical position: down is negative, up is positive.']],
    'goto(100, 50)\ngoto(-60, 90)\ngoto(0, 0)', 'Three connected lines between three positions.',
    'Add penup() before the first goto(), then pendown() after it.',
    'A line connects each position while the pen is down. Supply x and y as two separate numbers in this editor.',
    {aliases:['setpos','setposition'], related:['coordinates','penup','setx','sety']});
  add('setx', 'setx()', 'Move & turn', 'setx(x)',
    'Move horizontally to a new x position. The height stays the same.', [['x', 'The new horizontal coordinate.']],
    'goto(0, 60)\nsetx(100)\nsetx(-100)', 'A vertical line followed by a horizontal line at height 60.',
    'Change 60 to -60.', 'This sets an x coordinate. It does not move forward by that amount.',
    {related:['sety','goto','xcor']});
  add('sety', 'sety()', 'Move & turn', 'sety(y)',
    'Move vertically to a new y position. The horizontal position stays the same.', [['y', 'The new vertical coordinate.']],
    'goto(60, 0)\nsety(100)\nsety(-100)', 'A horizontal line followed by a vertical line at x = 60.',
    'Change 60 to -60.', 'The turtle keeps its heading even when it moves up or down.',
    {related:['setx','goto','ycor']});
  add('setheading', 'setheading()', 'Move & turn', 'setheading(angle)',
    'Choose exactly which direction to face.', [['angle', '0 is right, 90 is up, 180 is left, and 270 is down.']],
    'setheading(90)\nforward(80)\nsetheading(0)\nforward(80)', 'A line upward, followed by a line to the right.',
    'Set the second heading to 45.', 'A heading is measured from the world’s right direction. left() and right() measure a turn from the current heading.',
    {aliases:['seth'], related:['heading','angles','left'], visual:'heading'});
  add('home', 'home()', 'Move & turn', 'home()',
    'Return to the middle and face right again.', [],
    'forward(100)\nleft(90)\nforward(60)\nhome()', 'A triangle as the turtle draws its way back to (0, 0).',
    'Add penup() immediately before home().', 'home() can draw a line back to the middle. Lift the pen first when you want to move without drawing.',
    {related:['goto','penup','reset']});
  add('penup', 'penup() / pendown()', 'Pen & color', 'penup()\npendown()',
    'Lift the pen to travel without drawing. Lower it when you want the next movement to leave a line.', [],
    'forward(50)\npenup()\nforward(40)\npendown()\nforward(50)', 'Two lines with a 40-pixel gap.',
    'Change the middle forward() distance.', 'The pen stays up until pendown() runs. The turtle begins each Run with its pen down.',
    {aliases:['pendown','up','down','pu','pd'], related:['forward','goto','isdown']});
  add('pensize', 'pensize()', 'Pen & color', 'pensize(width)',
    'Choose how thick the next lines will be.', [['width', 'Line thickness in pixels.']],
    'pensize(2)\nforward(60)\npensize(8)\nforward(60)', 'One thin line followed by a thicker line.',
    'Try pensize(15).', 'Changing the width affects later drawing commands.',
    {aliases:['width'], related:['color','circle']});
  add('color', 'color()', 'Pen & color', 'color("teal")',
    'Choose the pen color and fill color together.', [['color name', 'A quoted color such as "teal", "coral", "navy", or "gold".'], ['Hex color', 'A quoted six-digit color such as "#176b73".']],
    'pensize(6)\ncolor("teal")\nforward(70)\ncolor("coral")\nleft(90)\nforward(70)', 'A teal line followed by a coral line.',
    'Try "purple", "orange", or "#176b73".', 'Color names need quotation marks. Use one color string at a time in this editor.',
    {related:['pencolor','fillcolor','bgcolor']});
  add('pencolor', 'pencolor()', 'Pen & color', 'pencolor("navy")',
    'Change the line color while keeping the current fill color.', [['color', 'A quoted color name or hex color.']],
    'color("gold")\npencolor("navy")\npensize(5)\nforward(100)\ndot(20)', 'A navy line and a navy dot.',
    'Change "navy" to "teal".', 'pencolor() controls the pen. Use fillcolor() for the inside of a filled shape.',
    {related:['color','fillcolor','fill']});
  add('fillcolor', 'fillcolor()', 'Pen & color', 'fillcolor("gold")',
    'Set the color used by the next begin_fill() and end_fill() pair.', [['color', 'A quoted color name or hex color.']],
    'fillcolor("gold")\nbegin_fill()\nfor side in range(4):\n    forward(80)\n    left(90)\nend_fill()', 'A square filled with gold.',
    'Change the fill color to "skyblue".', 'Setting the fill color alone does not fill a drawing. Wrap the drawing commands in begin_fill() and end_fill().',
    {related:['fill','color','pencolor']});
  add('bgcolor', 'bgcolor()', 'Pen & color', 'bgcolor("lightcyan")',
    'Set the background color of the drawing world.', [['color', 'A quoted color name or hex color.']],
    'bgcolor("midnightblue")\ncolor("gold")\npensize(4)\ncircle(60)', 'A gold circle on a dark blue background.',
    'Try "lavender" with a "purple" pen.', 'The grid is a display guide. Switch Show grid off to see the plain background.',
    {related:['color','clear','reset']});
  add('circle', 'circle()', 'Shapes & fills', 'circle(radius, extent, steps)',
    'Draw a circle or part of a circle. You can use just the radius for a complete, smooth circle.',
    [['radius', 'Distance from center to edge. Positive curves left of the turtle; negative curves right.'], ['extent (optional)', 'How much to draw in degrees. 90 is a quarter; 180 is a half; 360 is a whole circle.'], ['steps (optional)', 'Number of straight sides. Leave it out for a smooth circle.']],
    'pensize(3)\ncolor("teal")\ncircle(60)', 'A circle 120 pixels wide, above the starting position.',
    'Try circle(60, 180), then circle(60, 360, 6).', 'The turtle starts on the edge of the circle. Its current position is not the circle’s center.',
    {related:['radius','dot','angles'], visual:'radius'});
  add('dot', 'dot()', 'Shapes & fills', 'dot(diameter, "color")',
    'Put a filled circular dot at the turtle’s current position. The turtle stays in place.',
    [['diameter', 'The full width of the dot, in pixels.'], ['color (optional)', 'A quoted color. Leave it out to use the current pen color.']],
    'dot(60, "teal")\npenup()\nforward(90)\ndot(30, "coral")', 'A large teal dot and a smaller coral dot.',
    'Make the coral dot the same size as the teal dot.', 'The size is a diameter. A dot with size 60 is as wide as a circle with radius 30.',
    {related:['radius','circle','penup']});
  add('fill', 'begin_fill() / end_fill()', 'Shapes & fills', 'begin_fill()\n# Draw the shape here.\nend_fill()',
    'Record a shape’s outline, then fill its inside when end_fill() runs.', [],
    'color("teal")\nbegin_fill()\nfor side in range(3):\n    forward(100)\n    left(120)\nend_fill()', 'A filled teal triangle.',
    'Use four sides and left(90) for a square.', 'Keep both fill commands outside the loop so the whole shape is filled once.',
    {aliases:['begin_fill','end_fill'], related:['fillcolor','for','circle']});
  add('write', 'write()', 'Shapes & fills', 'write("Hello", align="center", font=("Arial", 20))',
    'Draw text at the turtle’s current position, using the pen color.',
    [['text', 'The words or value to draw.'], ['align (optional)', '"left", "center", or "right" relative to the turtle.'], ['font (optional)', 'A font name and text size, inside a tuple.']],
    'color("teal")\nwrite("Hello, Turtle!", align="center", font=("Arial", 20))\nhideturtle()', 'A greeting centered in the world.',
    'Change the words and the font size.', 'Use print() for the text output panel. write() puts text on the drawing. This editor keeps the turtle in place.',
    {related:['print','goto','color']});
  add('position', 'position()', 'Read the turtle', 'position()',
    'Get the current x and y coordinates as a pair of numbers.', [],
    'forward(80)\nleft(90)\nforward(40)\nprint(position())', 'The output shows (80, 40), with possible decimal places.',
    'Add backward(20) before print().', 'Use print(position()) to display the returned value in the output panel.',
    {aliases:['pos'], related:['xcor','ycor','coordinates']});
  add('xcor', 'xcor()', 'Read the turtle', 'xcor()',
    'Get the turtle’s horizontal coordinate.', [],
    'forward(90)\nprint(xcor())', 'A line to the right. The output prints 90.',
    'Add backward(120) before print().', 'Reading xcor() does not move the turtle.', {related:['ycor','position','setx']});
  add('ycor', 'ycor()', 'Read the turtle', 'ycor()',
    'Get the turtle’s vertical coordinate.', [],
    'left(90)\nforward(70)\nprint(ycor())', 'A line upward. The output prints 70.',
    'Use right(90) instead of left(90).', 'Up is positive and down is negative.', {related:['xcor','position','sety']});
  add('heading', 'heading()', 'Read the turtle', 'heading()',
    'Get the direction the turtle is facing, in degrees.', [],
    'left(90)\nforward(60)\nprint(heading())', 'The turtle faces up and the output prints 90.',
    'Add right(45) before print().', 'A heading describes direction. It does not tell you the position.',
    {related:['setheading','angles','position']});
  add('isdown', 'isdown()', 'Read the turtle', 'isdown()',
    'Ask whether the pen is touching the page. The answer is True or False.', [],
    'print(isdown())\nforward(50)\npenup()\nprint(isdown())\nforward(50)', 'The output prints True, then False. Only the first movement draws.',
    'Add pendown() and print(isdown()) at the end.', 'True and False are Boolean values. Keep their first letters uppercase when you type them.',
    {related:['penup','if','print']});
  add('speed', 'speed()', 'Screen & turtle', 'speed(6)',
    'Choose how quickly the turtle moves and turns.', [['speed', '0 draws instantly. Values from 1 through 10 animate from slow to fast. This editor also accepts decimals.']],
    'speed(3)\nfor side in range(4):\n    forward(80)\n    left(90)', 'A square drawn slowly enough to follow each movement.',
    'Try 1, 6, 10, then 0.', 'Put speed() before the movement commands you want it to affect.',
    {related:['for','forward']});
  add('visibility', 'hideturtle() / showturtle()', 'Screen & turtle', 'hideturtle()\nshowturtle()',
    'Hide or show the small turtle pointer. Drawing commands still work while the pointer is hidden.', [],
    'circle(60)\nhideturtle()', 'A circle with the turtle pointer hidden.',
    'Add showturtle() at the end.', 'Hiding the turtle does not lift the pen or erase the drawing.',
    {aliases:['hideturtle','showturtle','ht','st'], related:['shape','stamp','penup']});
  add('shape', 'shape()', 'Screen & turtle', 'shape("turtle")',
    'Choose the shape of the moving turtle pointer.', [['name', '"turtle", "arrow", "circle", "square", "triangle", or "classic".']],
    'shape("triangle")\ncolor("teal")\nforward(80)', 'A triangular pointer at the end of the line.',
    'Try "square" or "arrow".', 'shape() changes the pointer. stamp() leaves a copy of that pointer on the drawing.',
    {related:['stamp','visibility']});
  add('stamp', 'stamp()', 'Screen & turtle', 'stamp()',
    'Leave a copy of the turtle pointer on the drawing.', [],
    'shape("turtle")\ncolor("teal")\npenup()\nfor mark in range(4):\n    stamp()\n    forward(40)', 'A row of four turtle stamps, followed by the moving pointer.',
    'Change the shape and the spacing.', 'Stamps stay where you placed them when the turtle moves away.',
    {related:['shape','penup','for']});
  add('clear', 'clear()', 'Screen & turtle', 'clear()',
    'Erase the drawing while keeping the turtle’s current position, heading, pen settings, and background.', [],
    'forward(80)\nclear()\nleft(90)\nforward(60)', 'The first line disappears. A new line goes upward from x = 80.',
    'Replace clear() with reset() and compare the starting point of the last line.', 'The Clear Run button also clears printed output and resets the turtle. clear() inside your code keeps its position.',
    {related:['reset','home']});
  add('reset', 'reset()', 'Screen & turtle', 'reset()',
    'Erase the drawing and return the turtle to its starting settings: middle of the world, facing right, black pen, white background.', [],
    'color("coral")\nforward(90)\nreset()\nforward(50)', 'A short black line from the middle after the earlier drawing is erased.',
    'Put color("teal") after reset().', 'reset() also restores the default pen width, speed, pointer, and pen-down state.',
    {related:['clear','home','color']});
  add('variables', 'Variables', 'Python for drawing', 'size = 80',
    'Give a value a name so you can use it again. Changing that value can change several parts of a drawing.',
    [['name = value', 'Store the value on the right under the name on the left.']],
    'size = 80\nforward(size)\nleft(90)\nforward(size)', 'Two lines with the same length.',
    'Change size to 120 in one place.', 'Use the name without quotation marks when you want its stored value.',
    {related:['for','parameters','errors-name']});
  add('for', 'for loops & range()', 'Python for drawing', 'for side in range(4):\n    forward(80)\n    left(90)',
    'Repeat a group of commands a set number of times. Indented lines belong to the loop.',
    [['range(4)', 'Repeat four times. The loop variable takes the values 0, 1, 2, and 3.'], ['Colon :', 'Marks the start of the loop’s body.'], ['Indentation', 'Use four spaces before each line that repeats.']],
    'for side in range(4):\n    forward(80)\n    left(90)', 'A square made by repeating one side and one turn.',
    'Use range(3) and left(120) for a triangle.', 'Both the movement and the turn need to be inside this loop.',
    {aliases:['range','loop','repeat','indentation'], related:['nested','variables','errors-indent']});
  add('nested', 'Nested loops', 'Python for drawing', 'for shape in range(3):\n    for side in range(4):',
    'Put one loop inside another. Here the inner loop draws a square, and the outer loop repeats that whole square.',
    [['Outer loop', 'Repeats the larger pattern.'], ['Inner loop', 'Finishes all of its repetitions each time the outer loop runs.']],
    'speed(0)\nfor shape in range(3):\n    for side in range(4):\n        forward(60)\n        left(90)\n    left(120)', 'Three squares arranged around the starting point.',
    'Try six shapes with a 60-degree turn after each square.', 'The last left() belongs to the outer loop. Its indentation is four spaces.',
    {related:['for','functions','errors-indent']});
  add('functions', 'Define and call a function', 'Python for drawing', 'def square():\n    # Drawing commands\n\nsquare()',
    'Give a useful group of commands a name. Call that name to run those commands.',
    [['def', 'Starts a function definition.'], ['square()', 'Calls the function and runs its indented body.']],
    'def square():\n    for side in range(4):\n        forward(70)\n        left(90)\n\nsquare()', 'One square appears when square() is called.',
    'Add right(45) and square() after the first call.', 'Defining a function saves the instructions. Include a call below the definition to see the drawing.',
    {aliases:['def','function','call'], related:['parameters','return','for']});
  add('parameters', 'Function parameters', 'Python for drawing', 'def square(size):\n    forward(size)\n\nsquare(70)',
    'Let a function receive a value. Each call can use a different size, color, or distance.',
    [['Parameter', 'A name inside the function’s parentheses, such as size.'], ['Argument', 'The value supplied by a call, such as 70.']],
    'def square(size):\n    for side in range(4):\n        forward(size)\n        left(90)\n\nsquare(60)\nsquare(100)', 'Two squares of different sizes sharing a corner.',
    'Add square(140).', 'Use the parameter inside the function body so changing the argument changes the drawing.',
    {related:['functions','variables','return']});
  add('return', 'Return a value', 'Python for drawing', 'return value',
    'Send a result back to the line that called the function.', [['return', 'Ends the function and provides its result.']],
    'def double(number):\n    return number * 2\n\nsize = double(30)\ncircle(size)\nprint(size)', 'A circle with radius 60. The output prints 60.',
    'Change double(30) to double(45).', 'print() displays a value. return makes a value available to the rest of your program.',
    {related:['functions','parameters','print']});
  add('if', 'if / elif / else', 'Python for drawing', 'if size > 60:\n    color("teal")\nelse:\n    color("coral")',
    'Choose which commands to run based on a condition.', [['Condition', 'An expression that is True or False.'], ['elif', 'Check another condition if the earlier one was False.'], ['else', 'Run when none of the earlier conditions were True.']],
    'size = 80\nif size > 60:\n    color("teal")\nelse:\n    color("coral")\n\ncircle(size)', 'A teal circle because size is greater than 60.',
    'Change size to 40 and run again.', 'Use == to compare equality. Use = to store a value.',
    {aliases:['elif','else','condition','comparison','boolean'], related:['variables','isdown','while']});
  add('while', 'while loops', 'Python for drawing', 'while size < 100:',
    'Repeat while a condition stays True. Change something inside the loop so it can finish.', [['Condition', 'Checked before each repetition.']],
    'size = 20\nwhile size < 100:\n    forward(size)\n    left(90)\n    size = size + 20', 'Four connected lines that grow from 20 to 80 pixels.',
    'Change the increase from 20 to 10.', 'If the condition never becomes False, the loop continues. Use Stop, then check the value being updated.',
    {related:['if','variables','for']});
  add('lists', 'Lists of colors or values', 'Python for drawing', 'colors = ["teal", "coral", "gold"]',
    'Keep several values together and work through them with a loop.', [['[ ]', 'Square brackets hold the list.'], ['Comma', 'Separates one item from the next.'], ['colors[0]', 'The first item. List positions start at zero.']],
    'colors = ["teal", "coral", "gold"]\npenup()\nfor shade in colors:\n    dot(40, shade)\n    forward(55)', 'Three colored dots in list order.',
    'Replace a color or add a fourth item.', 'Keep color names in quotes and separate items with commas.',
    {related:['for','color','variables']});
  add('strings', 'Text and strings', 'Python for drawing', 'name = "Turtle"',
    'A string is text inside quotation marks. Join strings with + or repeat them with *.', [['"text"', 'A string value. Single quotes also work.'], ['str(value)', 'Convert a number or another value into text.']],
    'name = "Turtle"\nmessage = "Hello, " + name\nwrite(message, align="center", font=("Arial", 20))\nprint(message)', 'The same greeting appears in the drawing and the output.',
    'Put your own name inside the quotes.', 'The opening and closing quote must match.',
    {aliases:['str','text','quotes'], related:['write','print','input']});
  add('print', 'print()', 'Python for drawing', 'print(value)',
    'Show a message or a value in the text output panel below the drawing.', [['value', 'Text in quotes, a number, a variable, or the result of a command.']],
    'forward(60)\nprint("Distance moved:", 60)\nprint("Position:", position())', 'A line in the world and two messages in the output panel.',
    'Add print("Heading:", heading()).', 'Text printed here is separate from text drawn by write().',
    {related:['write','position','variables']});
  add('input', 'input()', 'Python for drawing', 'answer = input("Question? ")',
    'Ask the person running the program for an answer. The answer comes back as text.', [['Prompt', 'The question shown in the input dialog.'], ['int(answer)', 'Convert whole-number text into a number.']],
    'answer = input("Choose a circle radius from 10 to 80: ")\nsize = int(answer)\ncircle(size)', 'Press Run, type a whole number, and a circle uses that radius.',
    'Run twice and choose a different radius each time.', 'Type a whole number for this example. int("blue") cannot become a number.',
    {auto:false, aliases:['int','float','user input'], related:['strings','variables','circle']});
  add('random', 'Random choices', 'Python for drawing', 'import random\nrandom.choice(values)',
    'Let the program choose a color or number each time it runs.', [['random.choice(list)', 'Choose one item from a list.'], ['random.randint(low, high)', 'Choose a whole number between the two limits, including both limits.']],
    'import random\n\ncolors = ["teal", "coral", "gold", "purple"]\ncolor(random.choice(colors))\ncircle(random.randint(20, 80))', 'A circle with a randomly chosen color and radius.',
    'Run several times. Add another color to the list.', 'Put import random before you use random.choice() or random.randint().',
    {aliases:['randint','choice','import'], related:['lists','circle','variables']});
  add('comments', 'Comments', 'Python for drawing', '# This is a comment.',
    'Leave a note for someone reading your code. Python skips the text after # on that line.', [],
    '# Draw the first side.\nforward(80)\nleft(90)\n# Draw the second side.\nforward(80)', 'Two lines form a corner. The comments do not change the drawing.',
    'Add a comment explaining the turn.', 'A command after # is part of the comment and will not run.',
    {related:['start','for']});
  add('onclick', 'Click the turtle', 'Click interactions', 'onclick(function_name)',
    'Run a function when someone clicks the turtle pointer. The function receives the click’s x and y coordinates.', [['Callback', 'The function to run when the click happens.'], ['x, y', 'Two parameters for the click position.']],
    'def turtle_clicked(x, y):\n    dot(40, "gold")\n    forward(50)\n\nonclick(turtle_clicked)', 'After Run finishes, click the turtle. It leaves a dot and moves forward.',
    'Add left(30) inside the function.', 'Pass the function’s name without calling it: onclick(turtle_clicked). Keep the turtle visible so it can be clicked.',
    {related:['screen-click','functions','parameters']});
  add('screen-click', 'Click anywhere to draw', 'Click interactions', 'getscreen().onclick(function_name)',
    'Run a function when someone clicks the drawing world.', [['x, y', 'The world coordinates of the click.'], ['getscreen()', 'Provides the screen object used to register its click handler.']],
    'def mark(x, y):\n    penup()\n    goto(x, y)\n    dot(20, "teal")\n\ngetscreen().onclick(mark)', 'After Run finishes, click in the world to place dots.',
    'Change the dot size and color, then run again.', 'The function is called later by a click. Define it before registering it.',
    {aliases:['getscreen','callback','event'], related:['onclick','goto','functions']});
  add('errors-name', 'NameError', 'Fix a problem', 'forward(80)',
    'Python found a name it does not recognize. Check spelling, capitalization, and whether a variable or function was defined earlier.',
    [['Common example', 'foward(80) is misspelled. Use forward(80).'], ['Color example', 'color(blue) looks for a variable called blue. Use color("blue").']],
    'color("blue")\nforward(80)', 'A blue line after correcting the command name and color quotes.',
    'Try color("teal") and run the corrected code.', 'Read the exact name shown in the error message, then find it in your code.',
    {aliases:['error','spelling','capitalization','not defined'], related:['color','variables','functions']});
  add('errors-syntax', 'ParseError / SyntaxError', 'Fix a problem', 'circle(40)\nforward(80)',
    'Python could not read the structure of a line. Check parentheses, quotation marks, commas, and colons.',
    [['Missing )', 'circle(40 needs a closing parenthesis.'], ['Missing :', 'A for, if, while, or def line needs a colon.']],
    'circle(40)\nforward(80)', 'A circle followed by a line after the missing parenthesis is restored.',
    'Add a second circle(20) on a new line.', 'The highlighted line can be after the actual mistake. Check the line just above it, too.',
    {aliases:['error','parentheses','syntax','parse','colon'], related:['start','for','errors-indent']});
  add('errors-indent', 'Indentation', 'Fix a problem', 'for side in range(4):\n    forward(80)\n    left(90)',
    'Spaces at the beginning of a line show which commands belong to a loop, function, or condition.',
    [['Four spaces', 'One level inside a block.'], ['Eight spaces', 'Two levels inside, such as a loop inside a function.']],
    'for side in range(4):\n    forward(80)\n    left(90)', 'A square because both commands repeat.',
    'Move left(90) out of the loop and predict what changes before running.', 'Use the Tab key in this editor to insert four spaces. Keep commands in the same block lined up.',
    {aliases:['IndentationError','spaces','tabs'], related:['for','nested','functions']});
  add('drawing-help', 'My drawing is missing', 'Fix a problem', 'pendown()\nhome()\nshowturtle()',
    'Check the pen, position, color, and function calls. The program may run successfully while the drawing is outside the visible world or the pen is up.',
    [['No lines', 'Check that pendown() runs before movement.'], ['Off the screen', 'Use penup(), home(), then pendown() to return.'], ['Function only', 'Call your function below its definition.'], ['Same color as the background', 'Choose a visible pen color.']],
    'penup()\nhome()\npendown()\nshowturtle()\ncolor("teal")\nforward(80)', 'A visible teal line starting in the middle.',
    'Add circle(40) to confirm both commands draw.', 'Run starts the program again from the beginning. Check the commands in their execution order.',
    {related:['penup','home','functions','color']});
  add('desktop', 'Using desktop Python', 'Start here', 'from turtle import *',
    'The examples on this page run directly in this browser. In a desktop Python file, import the Turtle commands before your drawing and call done() at the end to keep its window open.',
    [['Here in the browser', 'Use forward(80), circle(40), and the other examples directly.'], ['Desktop setup', 'Install Python with Tk support. Add from turtle import * as your first line and done() as your last.'], ['Other Turtle features', 'Desktop Python includes additional APIs such as multiple Turtle objects, keyboard events, and window settings.']],
    'forward(80)\nleft(90)\ncircle(40)', 'This browser example draws a line and a circle. For a desktop file, add the import and done() around these lines.',
    'Try this drawing here before moving it into a desktop file.', 'This reference shows the forms supported by this site’s editor. The official documentation covers the complete desktop library.',
    {related:['start','forward'], source:'https://docs.python.org/3/library/turtle.html'});
  return entries;
})();
