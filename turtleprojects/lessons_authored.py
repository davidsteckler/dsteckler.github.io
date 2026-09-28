"""Deliberately paced introductions: one visible result per checkpoint."""
from textwrap import dedent
from lesson_runtime import run

class Author:
    def __init__(self): self.steps=[]
    def step(self,code,title,instruction,explain,expected,question,answer,kind='draw'):
        code=dedent(code).strip()
        self.steps.append(dict(nav=title,title=title,code=code,instruction=instruction,explain=explain,
            expected=expected,question=question,answer=answer,kind=kind,practice=False,remix=kind=='remix',
            sameDrawing=bool(self.steps and run(self.steps[-1]['code'])['digest']==run(code)['digest']),
            help='Compare the changed lines with your editor. Check parentheses, commas, and quotation marks. Indent a loop or function body four spaces.'))
    def remix(self,code,subject):
        self.step(code,'Make it yours','Change one size, position, or color. Predict the result, then run. Try a second change after checking the first.',
            'Keep your working program while you experiment. If an edit has an unexpected effect, undo that one edit and run again.',
            'Your own '+subject+'.','Show a partner one edit. Why did that line change the picture?',
            'Name the command, explain what its input controls, and point to the result.',kind='remix')

def robot():
    a=Author()
    start='speed(5)\npensize(5)\ncolor("royalblue")\npenup()\ngoto(-80, -80)\npendown()'
    a.step(start+'\nforward(160)','Draw the first side','Type these lines, then press Run.',
        'The turtle starts facing right. penup() lifts the pen to reach the starting point. pendown() draws again. forward(160) draws 160 units.',
        'One blue horizontal line below the center.','Which line chooses the length?','forward(160). The number is the distance the turtle travels.')
    two=start+'\nforward(160)\nleft(90)\nforward(160)'
    a.step(two,'Turn one corner','Add the turn and the second side. Run again.',
        'left(90) changes the turtle’s direction by a quarter turn. A turn changes where the next movement goes.',
        'An L shape: the bottom and right side of the head.','Would right(90) draw the second side upward?','No. From facing right, right(90) points down.')
    square=start+'\n'+('forward(160)\nleft(90)\n'*4).strip()
    a.step(square,'Close the square','Complete all four sides and turns.',
        'A square has four equal sides. Four 90-degree turns make a full turn, leaving the turtle facing right again.',
        'A blue square centered on the grid.','Which two commands repeat?','forward(160) and left(90) repeat four times.')
    loop=start+'\nfor side in range(4):\n    forward(160)\n    left(90)'
    a.step(loop,'Use a loop for the sides','Replace the eight repeated lines with this loop.',
        'range(4) repeats the body four times. Both the move and the turn must be indented so each side gets its own corner.',
        'Exactly the same square. You changed how the program expresses the repetition.','What if left(90) is outside the loop?','The turtle draws four forward movements in the same direction, then turns once.',kind='loop')
    fn='def square(size):\n    for side in range(4):\n        forward(size)\n        left(90)'
    head=start+'\n\n'+fn+'\n\nsquare(160)'
    a.step(head,'Name the square code','Put the working loop in a function. Call it underneath.',
        'size is an input. square(160) gives size the value 160 and runs the loop. We will use the same function for smaller squares next.',
        'The same blue head. The call square(160) makes it draw.','Which line calls the function?','square(160). The line starting with def defines it.',kind='function')
    ear='\n\npenup()\ngoto(-104, -12)\npendown()\nsquare(24)'
    head+=ear
    a.step(head,'Reuse it for an ear','Add this call after the head.',
        'The same square function now receives 24. Move to a new starting point before calling it.',
        'A small square ear touching the left side of the head.','Does square(24) change the head?','No. It draws a new square where the turtle is now. The earlier square(160) call keeps its input.',kind='function')
    head+='\n\npenup()\ngoto(80, -12)\npendown()\nsquare(24)'
    a.step(head,'Add the other ear','Reuse square(24) on the other side.',
        'The shape and size stay the same. The x-coordinate changes from −104 to 80 to place the ear on the right.',
        'Matching square ears on both sides.','Why do the starting x-coordinates have different distances from zero?','Each square starts at its lower-left corner. The left ear extends from −104 to −80; the right ear extends from 80 to 104.')
    eye='\n\ncolor("black")\npenup()\ngoto(-40, 20)\npendown()\ncircle(12)'
    base=head; head+=eye
    a.step(head,'Draw one eye','Move inside the head and draw a circle.',
        'circle(12) uses a radius of 12: the distance from the center to the edge. Facing right, the turtle starts at the bottom of the circle.',
        'One black eye in the left half of the head.','How wide is this eye?','24 units. Its diameter is twice its radius.')
    head+='\npenup()\ngoto(40, 20)\npendown()\ncircle(12)'
    a.step(head,'Add a second eye','Add a second circle at x = 40.',
        'Only the x-coordinate changes. Both eyes have the same y-coordinate, so they line up horizontally.',
        'Two matching eyes.','Which value would move only the second eye higher?','The 20 in its goto(40, 20). Increase it to move the eye up.')
    eyes='\n\ncolor("black")\nfor x in [-40, 40]:\n    penup()\n    goto(x, 20)\n    pendown()\n    circle(12)'
    head=base+eyes
    a.step(head,'Loop through both positions','Replace the two eye blocks with this loop.',
        'The list [-40, 40] supplies two x-coordinates. The loop first sets x to −40, then sets it to 40.',
        'The same two eyes.','How could you draw a third eye between them?','Use [-40, 0, 40]. The body will run three times.',kind='loop')
    head+='\n\npenup()\ngoto(-30, -35)\npendown()\nforward(60)'
    a.step(head,'Give it a mouth','Add a horizontal mouth below the eyes.',
        'The mouth starts at x = −30. Moving 60 units to the right ends at x = 30.',
        'A straight mouth centered below the eyes.','How would you make the mouth lower?','Decrease the y-coordinate in goto(-30, -35).')
    head+='\n\ncolor("royalblue")\npenup()\ngoto(0, 80)\npendown()\nleft(90)\nforward(45)'
    a.step(head,'Build an antenna','Move to the top of the head, turn up, and draw.',
        'The top edge is at y = 80. The turtle was facing right, so left(90) points it upward.',
        'An antenna above the head.','Which input makes the antenna taller?','45 in forward(45).')
    head+='\nright(90)\ncircle(8)\nhideturtle()'
    a.step(head,'Add the round tip','Turn right again and add a circle.',
        'Facing right puts the new circle above the tip of the antenna. hideturtle() hides the pen icon after the drawing finishes.',
        'A complete robot with ears, eyes, mouth, and antenna.','What did your square function let you reuse?','One loop drew a large head and two smaller ears, using different size inputs.')
    a.remix(head,'robot'); return a.steps

def pizza():
    a=Author()
    setup='speed(5)\nbgcolor("#f8f1e5")\npensize(5)\ncolor("#c68d4e")\npenup()\ngoto(-125, 80)\npendown()'
    edge=setup+'\ngoto(0, -145)'
    a.step(edge,'Draw one edge','Draw the left edge of the slice and press Run.',
        'goto(x, y) chooses a position on the grid. Negative x is left of center; negative y is below center. The pen is down for the slanted edge.',
        'One golden line from the upper left to the bottom tip.','Which coordinate controls how low the tip goes?','The second input, −145, is its vertical position.')
    edge+='\ngoto(125, 80)'
    a.step(edge,'Add the other edge','Draw from the tip to the upper right.',
        'The two top corners use opposite x-coordinates and the same y-coordinate. This gives the slice matching sides.',
        'A V-shaped outline.','Why do both top corners use y = 80?','They are at the same height.')
    edge+='\ngoto(-125, 80)'
    a.step(edge,'Close the triangle','Join the right corner back to the starting point.',
        'The third movement closes the outline. Trace the three points in order before running.',
        'A closed triangle.','What would happen if the last point were (0, 0)?','The last edge would end in the middle of the slice, leaving the outline open.')
    base=setup+'\nbegin_fill()\ngoto(0, -145)\ngoto(125, 80)\ngoto(-125, 80)\nend_fill()'
    a.step(base,'Fill the base','Insert begin_fill() before the triangle movements and end_fill() after them.',
        'The outline already works. These two commands fill the area enclosed by that outline, using the current color.',
        'A solid golden triangle.','Which commands have to be between begin_fill() and end_fill()?','The movements that trace the shape.')
    cheese='\n\npenup()\ngoto(-111, 69)\ncolor("#f4d68d")\npendown()\nbegin_fill()\ngoto(0, -123)\ngoto(111, 69)\ngoto(-111, 69)\nend_fill()'
    base+=cheese
    a.step(base,'Add the cheese','Draw a smaller, lighter triangle inside the first one.',
        'Shapes drawn later cover earlier shapes. This smaller triangle leaves a golden border visible around the cheese.',
        'Pale cheese with a golden edge.','Why is the cheese drawn after the base?','Its lighter fill needs to sit on top of the base.')
    topping='\n\npenup()\ngoto(-53, 35)\ndot(47, "#ad5040")\ndot(37, "#d97958")'
    code=base+topping
    a.step(code,'Make one pepperoni','Use two filled circles at the same position.',
        'dot() takes the circle’s diameter. The smaller red circle sits inside the larger dark circle, leaving a rim.',
        'One pepperoni with a darker edge.','Which number controls the outside diameter?','47. The second dot, with diameter 37, covers its center.')
    code+='\n\npenup()\ngoto(48, 33)\ndot(47, "#ad5040")\ndot(37, "#d97958")'
    a.step(code,'Make a second pepperoni','Repeat the same commands at a new position.',
        'The drawing instructions are identical. Only the coordinates change. These are useful inputs for a function.',
        'Two pepperoni near the top of the slice.','Which two numbers would a reusable pepperoni function need?','An x-coordinate and a y-coordinate for its center.')
    fn='def pepperoni(x, y):\n    penup()\n    goto(x, y)\n    dot(47, "#ad5040")\n    dot(37, "#d97958")'
    calls='pepperoni(-53, 35)\npepperoni(48, 33)'
    code=base+'\n\n'+fn+'\n\n'+calls
    a.step(code,'Name the working code','Replace the repeated pepperoni blocks with this function and two calls.',
        'x and y are inputs. Each call supplies a different position. The function contains the exact drawing commands you just tested.',
        'The same two pepperoni.','Why are the two calls outside the indentation?','They run the function. Indented lines belong to the definition and run when it is called.',kind='function')
    calls+='\npepperoni(-3, -35)'
    code=base+'\n\n'+fn+'\n\n'+calls
    a.step(code,'Reuse it once more','Add one function call for a third pepperoni.',
        'You already tested the function. A new call supplies a new center without repeating the drawing commands.',
        'A third pepperoni below the first two.','How many drawing commands did you need to retype?','None. The function call reuses all four commands.',kind='function')
    calls='for x, y in [(-53, 35), (48, 33), (-3, -35)]:\n    pepperoni(x, y)'
    code=base+'\n\n'+fn+'\n\n'+calls
    a.step(code,'Loop through the positions','Replace the three calls with one loop.',
        'Each pair in the list supplies one x and one y. The loop calls pepperoni once for each pair.',
        'The same three pepperoni.','How could you add a fourth?','Add another coordinate pair to the list, with a comma between pairs.',kind='loop')
    fn='def pepperoni(x, y, size):\n    penup()\n    goto(x, y)\n    dot(size + 10, "#ad5040")\n    dot(size, "#d97958")'
    calls='for x, y in [(-53, 35), (48, 33), (-3, -35)]:\n    pepperoni(x, y, 37)\npepperoni(31, -61, 22)'
    code=base+'\n\n'+fn+'\n\n'+calls
    a.step(code,'Let the size change','Add a size input and update every call. Test the smaller pepperoni near the tip.',
        'size replaces the fixed inner diameter. size + 10 keeps a dark rim around circles of different sizes.',
        'Three full-size pepperoni and a smaller one near the right edge.','What happens if you forget the size in an old call?','Python reports a missing input. Every pepperoni call now needs x, y, and size.',kind='function')
    fn+='\n    goto(x - size / 5, y + size / 6)\n    dot(5, "#f0b08a")\n    goto(x + size / 6, y - size / 7)\n    dot(4, "#a84d3d")'
    code=base+'\n\n'+fn+'\n\n'+calls
    a.step(code,'Improve every pepperoni','Add two small marks inside the function.',
        'Positions relative to x and y keep the marks on each pepperoni. Editing the function changes every call, including the small one.',
        'Light and dark speckles on all four pepperoni.','Why does editing one function affect four toppings?','The program runs that same function body for every call.',kind='function')
    crust_start='\n\npenup()\ngoto(-130, 83)\ncolor("#a56b44")\npensize(27)\npendown()\ngoto(-88, 99)'
    code+=crust_start
    a.step(code,'Start the crust','Draw the first thick segment across the top.',
        'pensize(27) makes a broad stroke. Start with one segment so you can inspect its thickness and location.',
        'A thick brown segment above the left corner.','Which command changes thickness without moving the crust?','pensize(27).')
    points=[(-30,106),(30,104),(88,95),(130,82)]
    crust_rest='\n'+'\n'.join(f'goto({x}, {y})' for x,y in points)
    code+=crust_rest
    a.step(code,'Finish the crust path','Continue through the remaining points.',
        'Short connected segments follow the curved top of the slice. Their order determines the path.',
        'A complete brown crust from left to right.','Which commands repeat the same action with different coordinates?','Each goto() moves to another point on the crust.')
    before_crust=base+'\n\n'+fn+'\n\n'+calls
    path='penup()\ngoto(-130, 83)\ncolor("#a56b44")\npensize(27)\npendown()\nfor x, y in [(-88, 99), (-30, 106), (30, 104), (88, 95), (130, 82)]:\n    goto(x, y)'
    code=before_crust+'\n\n'+path
    a.step(code,'Loop along the crust','Replace the separate movements with a list of points and a loop.',
        'The list preserves the drawing order. Each pair becomes the next x and y for goto().',
        'The same crust shape.','Would reversing the point order keep this particular starting point correct?','No. The pen still starts at the left end. The first point must continue from that end.',kind='loop')
    crust='def crust(shade, width):\n    penup()\n    goto(-130, 83)\n    color(shade)\n    pensize(width)\n    pendown()\n    for x, y in [(-88, 99), (-30, 106), (30, 104), (88, 95), (130, 82)]:\n        goto(x, y)'
    code=before_crust+'\n\n'+crust+'\n\ncrust("#a56b44", 27)'
    a.step(code,'Reuse the crust path','Turn the tested path into a function with color and width inputs.',
        'The coordinates stay inside the function. Only the color and line width need to change for the next layer.',
        'The same brown crust, drawn by one call.','Why are shade and width useful inputs here?','They let the same path draw a dark outside and a lighter inside.',kind='function')
    code+='\ncrust("#e8bc7e", 15)'
    a.step(code,'Add a lighter crust layer','Call the same function with a lighter color and a smaller width.',
        'The thinner stroke follows the same path and covers its center. The darker outside stays visible.',
        'A golden crust with a toasted brown edge.','What would happen if the lighter width were 35?','It would be wider than the dark stroke and cover its edges.',kind='function')
    leaf='\n\npenup()\ngoto(3, 57)\nsetheading(30)\npensize(1)\ncolor("#67916d")\npendown()\nbegin_fill()\ncircle(13, 70)\nleft(110)\ncircle(13, 70)\nend_fill()'
    code+=leaf
    a.step(code,'Draw one basil leaf','Use two matching arcs to enclose a small leaf.',
        'Each circle(13, 70) draws part of a circle. The turn between them points the second arc back toward the starting point.',
        'A green leaf between the top pepperoni.','What does 70 control in circle(13, 70)?','How many degrees of the circle are drawn.')
    plain=code[:-len(leaf)]
    leaves='\n\nfor x, y in [(3, 57), (-45, -16), (10, -91)]:\n    penup()\n    goto(x, y)\n    setheading(30)\n    pensize(1)\n    color("#67916d")\n    pendown()\n    begin_fill()\n    circle(13, 70)\n    left(110)\n    circle(13, 70)\n    end_fill()\nhideturtle()'
    code=plain+leaves
    a.step(code,'Repeat the tested leaf','Put the working leaf code in a loop with three positions.',
        'setheading(30) resets the direction for each leaf. Without that reset, the turns from one leaf would affect the next.',
        'Three basil leaves and a complete pizza slice.','Why reset the heading inside the loop?','Each leaf should start facing the same direction, regardless of where the previous leaf finished.',kind='loop')
    a.remix(code,'pizza'); return a.steps

def spirograph():
    a=Author(); setup='speed(5)\nbgcolor("#101b2d")\npensize(2)\ncolor("#fe6582")'
    code=setup+'\ncircle(78)'
    a.step(code,'Draw one circle','Type this short program and run it.',
        'circle(78) draws a circle with a radius of 78. The turtle returns to its starting position and direction.',
        'One pink circle on a dark background.','Is 78 the full width?','No. It is the radius. The width is 156 units.')
    code+='\nleft(20)\ncircle(78)'
    a.step(code,'Turn and draw another','Turn the turtle, then repeat the circle.',
        'The turtle starts at the same point, facing a new direction. That changes where the center of the next circle lies.',
        'Two overlapping circles.','Which command made the second circle land somewhere different?','left(20) changed the direction before drawing it.')
    code=setup+'\nfor i in range(2):\n    circle(78)\n    left(20)'
    a.step(code,'Repeat with a loop','Replace the separate circles with a two-repeat loop.',
        'Both circle() and left() are inside the loop. The turtle draws, turns, then does the same work again.',
        'The same two circles. The last turn moves the pen direction without drawing.',
        'What if only circle(78) were indented?','Both circles would draw on top of each other, then the turtle would turn once.',kind='loop')
    code=code.replace('range(2)','range(18)')
    a.step(code,'Complete a full turn','Increase the loop to 18 repeats.',
        '18 × 20° = 360°. The circle positions spread all the way around the starting point.',
        'A complete ring of overlapping pink circles.','Why use 18 repeats with a 20-degree turn?','Eighteen 20-degree turns add up to one full turn.',kind='loop')
    code=code.replace('range(18)','range(90)').replace('left(20)','left(4)')
    a.step(code,'Make the pattern denser','Use a smaller turn and enough repeats to total 360 degrees.',
        '90 × 4° = 360°. More circles fit into the same full rotation.',
        'A denser pattern in the same overall area.','Would 90 repeats with 20-degree turns give 90 different positions?','The direction repeats after every 18 turns, so many circles would overlap existing circles.',kind='loop')
    code='speed(0)\nbgcolor("#101b2d")\npensize(2)\ncolors = ["#fe6582", "#ffca73", "#6ed7cb", "#7da8f7", "#d0a6f3"]\nfor i in range(90):\n    color(colors[i % 5])\n    circle(78)\n    left(4)'
    a.step(code,'Cycle through five colors','Add the color list and select a color inside the loop.',
        'i counts from 0. i % 5 gives the remainder after dividing by 5, so it cycles through 0, 1, 2, 3, 4. Those positions select the five colors. speed(0) draws this longer program instantly.',
        'A multicolored spirograph.','Which list position is used when i is 7?','7 % 5 is 2, so it uses the third color. List positions start at 0.',kind='loop')
    code=code.replace('i % 5','i % len(colors)')
    a.step(code,'Let the list set the cycle','Replace 5 with len(colors).',
        'len(colors) counts the list’s items. The cycle will still work if you later add or remove a color.',
        'The same picture. This rewrite makes the color list easier to change.',
        'Why would leaving % 5 be a problem after shortening the list?','The loop could ask for a position that no longer exists.',kind='loop')
    code+='\npenup()\ngoto(0, -10)\ncolor("#ffe9b5")\ndot(19)\nhideturtle()'
    a.step(code,'Finish with a center dot','Lift the pen and add the small center detail.',
        'penup() prevents a connecting line. dot(19) uses a diameter, so this dot is 19 units wide.',
        'The finished multicolored pattern with a pale center dot.','How is the input to dot() different from circle()?','dot() takes a diameter. circle() takes a radius.')
    a.remix(code,'spirograph'); return a.steps

def authored_lessons():
    return {'robot-roll-call':robot(),'curatedA25':pizza(),'gallery0':spirograph(),'gallery7':pixel_heart()}

def pixel_heart():
    a=Author()
    setup='speed(5)\nbgcolor("#fff1f0")\ncolor("#da4567")\npenup()\ngoto(-148, 124)\nsetheading(0)\npendown()'
    code=setup+'\nforward(25)'
    a.step(code,'Draw one pixel edge','Draw a 25-unit edge and run.',
        'This picture will use squares as pixels. Start by checking the size of one edge.',
        'One short pink line near the upper left.','Which value sets this edge’s length?','25 in forward(25).')
    code=setup+'\n'+('forward(25)\nright(90)\n'*4).strip()
    a.step(code,'Finish the pixel outline','Add the remaining sides and turns.',
        'Each right(90) turns a square corner. Four equal sides close the outline.',
        'One small square.','How many times did you repeat the move and turn?','Four times.')
    code=setup+'\nfor side in range(4):\n    forward(25)\n    right(90)'
    a.step(code,'Loop the four sides','Replace the repeated pairs with a loop.',
        'Both commands belong inside the loop. range(4) repeats them four times.',
        'The same square.','What would range(3) leave unfinished?','The fourth side.',kind='loop')
    code=setup+'\nbegin_fill()\nfor side in range(4):\n    forward(25)\n    right(90)\nend_fill()'
    a.step(code,'Fill one pixel','Add filling around the working loop.',
        'The loop already traces the outline. begin_fill() and end_fill() color the enclosed area.',
        'One solid pink square.','Does end_fill() need to be inside the loop?','No. It runs once, after all four sides are drawn.')
    fn='def pixel(x, y, shade):\n    penup()\n    goto(x, y)\n    setheading(0)\n    color(shade)\n    pendown()\n    begin_fill()\n    for side in range(4):\n        forward(25)\n        right(90)\n    end_fill()'
    base='speed(0)\nbgcolor("#fff1f0")\n\n'+fn
    code=base+'\n\npixel(-148, 124, "#da4567")'
    a.step(code,'Make a pixel function','Move the tested commands into a function and call it.',
        'x and y choose the starting corner; shade chooses the color. The square-building loop stays the same.',
        'The same filled square.','Which inputs will change from one pixel to another?','The position inputs, and sometimes the color.',kind='function')
    code+='\npixel(-121, 124, "#da4567")'
    a.step(code,'Draw a neighbor','Add a second pixel 27 units to the right.',
        'Each square is 25 units wide. Moving its start by 27 units leaves a small gap.',
        'Two pink squares with a gap.','How large is the gap?','2 units: 27 − 25.')
    row='for col in range(11):\n    x = -148 + col * 27\n    pixel(x, 124, "#da4567")'
    code=base+'\n\n'+row
    a.step(code,'Build a row','Replace the separate calls with a loop across eleven columns.',
        'col starts at 0. Multiplying col by 27 spaces each pixel 27 units from the previous one.',
        'A full row of eleven squares.','Where is column 2 placed?','x = −148 + 2 × 27, which is −94.',kind='loop')
    data='row = "00110001100"'
    row='for col in range(len(row)):\n    if row[col] == "1":\n        x = -148 + col * 27\n        pixel(x, 124, "#da4567")'
    code=base+'\n\n'+data+'\n'+row
    a.step(code,'Use 1s and 0s as a pattern','Draw a square only when this row’s character is 1.',
        'row[col] selects one character. The if condition decides whether to draw. A 0 leaves a gap; a 1 draws a pixel.',
        'Two pairs of squares: the top of the heart.','What would changing the first 0 to 1 do?','It would add a square in the first column.',kind='condition')
    rows=['00110001100','01111011110']
    grid='for row in range(len(pixels)):\n    for col in range(len(pixels[row])):\n        if pixels[row][col] == "1":\n            x = -148 + col * 27\n            y = 124 - row * 27\n            pixel(x, y, "#da4567")'
    def program(rows,body=grid): return base+'\n\npixels = [\n'+',\n'.join('    "'+r+'"' for r in rows)+'\n]\n\n'+body
    code=program(rows)
    a.step(code,'Add a second row','Store both rows in a list. Use an outer loop to move downward.',
        'The outer loop chooses a row. The inner loop reads its columns. Subtracting row × 27 moves each new row down.',
        'The top two rows of the heart.','Why subtract for y while adding for x?','Columns move right, where x increases. Rows move down, where y decreases.',kind='loop')
    rows+=['11111111111','11111111111','01111111110']
    code=program(rows)
    a.step(code,'Build the wider middle','Add three rows to the pattern data.',
        'The drawing logic already works. len(pixels) adjusts the row count to match the list.',
        'The top and wide middle of the heart.','Do you need to change the loop’s repeat count?','No. len(pixels) counts the rows you supplied.',kind='data')
    rows+=['00111111100','00011111000','00001110000','00000100000']
    code=program(rows)
    a.step(code,'Taper to the point','Add the remaining rows.',
        'Fewer 1s in each lower row make the outline narrower. The code uses the same pixel function throughout.',
        'A complete pixel heart.','Which row creates the single bottom pixel?','The last string, "00000100000".',kind='data')
    colored=grid.replace('            pixel(x, y, "#da4567")','            shade = "#da4567"\n            if (row + col) % 3 == 0:\n                shade = "#f07791"\n            pixel(x, y, shade)')
    code=program(rows,colored)+'\nhideturtle()'
    a.step(code,'Add a color pattern','Choose a lighter shade for every third diagonal position.',
        '(row + col) % 3 is the remainder after dividing by 3. A remainder of 0 selects the lighter shade; other pixels keep the original shade.',
        'A heart with a repeating two-color pattern.','What would % 2 do to the spacing of the lighter pixels?','It would select positions every two diagonal counts instead of every three.',kind='condition')
    a.remix(code,'pixel design'); return a.steps
