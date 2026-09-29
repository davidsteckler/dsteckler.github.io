"""Short, movement-first projects. Each checkpoint is intentionally authored."""
from lessons_authored import Author


def starter_projects():
    projects=[]
    def make(slug,title,desc,skills):
        a=Author()
        p={'id':'starter-'+slug,'title':title,'category':'Shapes','desc':desc,
           'level':'Beginner','style':'Moves & turns','skills':skills,'order':len(projects)+1,'steps':a.steps}
        projects.append(p)
        return a
    def add(a,code,title,explain,expected,question,answer,kind='draw'):
        a.step(code,title,'Type the changed lines, then press Run. '+('Keep the rest of your working code.' if a.steps else 'The turtle starts in the center, facing right.'),explain,expected,question,answer,kind)
    def finish(a,code,subject):
        a.remix(code+'\nhideturtle()',subject)

    a=make('first-square','First Square','Start with one line. Turn it into a colorful square.',['forward','turns','first loop','fill'])
    c='pensize(5)\ncolor("teal")\nforward(100)'
    add(a,c,'Draw one line','forward(100) moves 100 units in the direction the turtle faces. The pen starts down.','One teal line to the right.','What would forward(60) change?','It would draw a shorter line.')
    c+='\nleft(90)\nforward(100)'
    add(a,c,'Turn one corner','left(90) turns a quarter of a full turn. It changes direction without drawing.','An L shape.','Which command makes the corner?','left(90). The next forward command draws upward.')
    c+='\nleft(90)\nforward(100)\nleft(90)\nforward(100)\nleft(90)'
    add(a,c,'Close the square','Four equal moves and four quarter turns return you to the start.','A complete square.','Which two lines repeat?','forward(100) and left(90).')
    c='pensize(5)\ncolor("teal")\nfor side in range(4):\n    forward(100)\n    left(90)'
    add(a,c,'Loop the sides','range(4) runs the two indented lines four times. Keep the movement and turn inside the loop.','The same square.','What if only forward(100) is indented?','All four moves happen in the same direction before the turtle turns.',kind='loop')
    c='pensize(5)\ncolor("teal")\nbegin_fill()\nfor side in range(4):\n    forward(100)\n    left(90)\nend_fill()'
    add(a,c,'Fill the square','begin_fill() remembers the outline. end_fill() colors the area it encloses.','A solid teal square.','Why is end_fill() outside the loop?','The whole square should be traced before it is filled.')
    c=c.replace('forward(100)','forward(140)')
    add(a,c,'Choose a size','The repeated distance controls every side. Change it in one place.','A larger square.','Could you use 120 instead?','Yes. These distances are design choices; any size that fits the canvas works.')
    finish(a,c,'square')

    a=make('staircase','Colorful Staircase','Use one small step to build a staircase.',['left and right','repetition','loop'])
    start='pensize(8)\ncolor("coral")\npenup()\nbackward(140)\nright(90)\nforward(100)\nleft(90)\npendown()'
    one='forward(40)\nleft(90)\nforward(40)\nright(90)'
    add(a,start+'\nforward(40)','Draw a tread','The pen-up moves choose a starting spot. The first drawn move is a horizontal tread.','A short coral line near the lower left.','Why lift the pen before moving to the start?','It prevents a line from the center to the staircase.')
    add(a,start+'\n'+one,'Add the rise','Turn left to go up. Turn right afterward to face along the next tread.','One L-shaped stair.','Which way is the turtle facing at the end?','Right, ready to draw another step.')
    add(a,start+'\n'+one+'\n'+one,'Repeat one more step','Copy the same four movements once. Check the join between steps.','Two connected steps.','What stays the same in both steps?','Both lengths and both turns.')
    c=start+'\nfor step in range(6):\n    forward(40)\n    left(90)\n    forward(40)\n    right(90)'
    add(a,c,'Loop six steps','The loop repeats the complete stair, including the turn that prepares the next one.','Six even steps rising right.','Which number chooses the number of steps?','6 in range(6).',kind='loop')
    c=c.replace('forward(40)\n    left','forward(45)\n    left').replace('forward(40)\n    right','forward(30)\n    right')
    add(a,c,'Change the proportions','Each tread can have a different length from its rise. Try whole-number distances.','A wider, less steep staircase.','Which distance changes the height?','The forward(30) after left(90).')
    finish(a,c,'staircase')

    a=make('bubble-trail','Bubble Trail','Draw circles, leave gaps, then repeat.',['circle radius','penup','loop'])
    start='pensize(4)\ncolor("steelblue")\npenup()\nbackward(150)\npendown()'
    add(a,start+'\ncircle(25)','Draw a bubble','circle(25) makes a circle with radius 25. The full width is 50. It ends where it began.','One outlined bubble.','How wide would circle(30) be?','60 units: twice the radius.')
    two='circle(25)\npenup()\nforward(60)\npendown()'
    add(a,start+'\n'+two+'\ncircle(25)','Leave a gap','Lift the pen between bubbles. Move a little farther than their width.','Two separate circles.','What would happen without penup()?','A line would join the bottoms of the circles.')
    c=start+'\nfor bubble in range(5):\n    circle(25)\n    penup()\n    forward(60)\n    pendown()'
    add(a,c,'Repeat five bubbles','Indent the circle and the move together. Each repeat draws once, then moves to the next spot.','Five evenly spaced bubbles.','Why is the move inside the loop?','Each bubble needs a new starting spot.',kind='loop')
    c=c.replace('    circle(25)','    begin_fill()\n    circle(25)\n    end_fill()').replace('steelblue','lightseagreen')
    add(a,c,'Fill each bubble','Fill one circle during each repeat. The pen-up gap remains empty.','Five solid turquoise bubbles.','Could you choose another color name?','Yes. Try gold, tomato, orchid, or another supported color name.')
    finish(a,c,'bubble trail')

    a=make('balloon','Balloon','A circle, a small knot, and a curved string.',['circles','fill','partial circles'])
    start='pensize(3)\ncolor("tomato")'
    add(a,start+'\ncircle(65)','Draw the balloon','A circle starts at the turtle’s position and curves to its left. Facing right, it grows upward.','A round balloon above the center.','Which number makes it larger?','The radius, 65.')
    c=start+'\nbegin_fill()\ncircle(65)\nend_fill()'
    add(a,c,'Add its color','Wrap the tested circle in fill commands.','A solid red balloon.','Does the turtle finish at a new position?','No. A full circle returns it to its starting position and direction.')
    knot='\nright(60)\nbegin_fill()\nfor side in range(3):\n    forward(15)\n    right(120)\nend_fill()\nleft(60)'
    c+=knot
    add(a,c,'Tie a small knot','A triangle uses three equal sides with a 120-degree turn between them. The first turn aims it downward.','A small triangle under the balloon.','Why is the turn 120 rather than 90?','Three turns of 120 degrees make one full 360-degree turn.',kind='loop')
    c+='\ncolor("slategray")\nright(90)\ncircle(50, 60)'
    add(a,c,'Start a curved string','The second input to circle is an angle. circle(50, 60) draws only 60 degrees of a circle.','A short curved string below the knot.','What does the second number control?','How much of the circle is drawn.')
    c+='\ncircle(-50, 60)\ncircle(50, 60)'
    add(a,c,'Let the string bend','A negative radius curves to the other side. Alternating the sign makes a gentle wave.','A longer wavy string.','Which numbers could you experiment with?','The radii change the bend size; the angles change how far each bend turns.')
    finish(a,c,'balloon')

    a=make('sun-rays','Sun Rays','Build a sun from a dot and repeated rays.',['dot','backward','loop'])
    c='bgcolor("lightcyan")\ncolor("gold")\ndot(100)'
    add(a,c,'Draw the sun','dot(100) stamps a filled circle centered on the turtle. Its input is the full width.','A golden sun in the center.','How is dot(100) different from circle(100)?','dot uses the full width. circle uses the radius and traces an outline.')
    ray='penup()\nforward(70)\npendown()\nforward(30)\npenup()\nbackward(100)\nleft(30)'
    c+='\npensize(6)\n'+ray
    add(a,c,'Draw one ray','Move past the sun with the pen up, draw a ray, then return to the center.','One detached ray to the right of the sun.','Why move backward 100?','The turtle traveled 70 + 30 units outward, so 100 returns it to the center.')
    c+='\n'+ray
    add(a,c,'Turn for a second ray','Each ray starts at the center with a new direction.','Two rays separated by 30 degrees.','What sets the gap angle?','left(30).')
    c='bgcolor("lightcyan")\ncolor("gold")\ndot(100)\npensize(6)\nfor ray in range(12):\n'+''.join('    '+line+'\n' for line in ray.splitlines())
    add(a,c,'Repeat around the sun','Twelve turns of 30 degrees cover a full turn: 12 × 30 = 360.','A full ring of twelve rays.','What would six rays need for equal spacing?','A 60-degree turn: 6 × 60 = 360.',kind='loop')
    c=c.replace('forward(30)','forward(40)').replace('backward(100)','backward(110)')
    add(a,c,'Choose longer rays','When you change the outward distance, update the return distance too.','A sun with longer rays.','Why change two numbers?','To keep every ray starting at the center.')
    finish(a,c.strip(),'sun')

    a=make('star-badge','Star Badge','Learn a star’s turning pattern one point at a time.',['turns','loop','fill'])
    start='pensize(4)\ncolor("goldenrod")\npenup()\nbackward(120)\npendown()'
    add(a,start+'\nforward(240)','Draw one edge','The first edge will cross the center of the star.','One long golden line.','Which input sets the overall size?','The distance 240.')
    one='forward(240)\nright(144)'
    add(a,start+'\n'+one+'\nforward(240)','Turn toward a point','A five-point star uses a 144-degree turn after each line. Try this one turn before repeating it.','Two lines making a sharp point on the right.','Would a 90-degree turn make the same point?','No. It would make a square corner.')
    add(a,start+'\n'+(one+'\n')*5,'Close five points','Repeat the move and turn five times in total. The final line reaches the start.','A complete five-point star.','How many forward commands are here?','Five. Each draws one long edge of the star.')
    c=start+'\nfor point in range(5):\n    forward(240)\n    right(144)'
    add(a,c,'Use a loop','Replace the repeated lines with one pair inside a loop.','The same star outline.','Why are both commands indented?','Each edge must be followed by a turn.',kind='loop')
    c=c.replace('for point','begin_fill()\nfor point')+'\nend_fill()'
    add(a,c,'Fill your badge','Fill commands enclose the complete path.','A solid golden star.','Can the distance change while the turn stays the same?','Yes. All five edges can be shorter or longer and still form a star.')
    finish(a,c,'star badge')

    a=make('circle-flower','Circle Flower','Repeat a circle at different angles to make petals.',['circle','rotation','loop'])
    start='bgcolor("lavenderblush")\npensize(3)\ncolor("mediumvioletred")'
    add(a,start+'\ncircle(55)','Draw one petal','A full circle brings the turtle back to the center, ready for another petal.','One circle above the center.','Where does the turtle finish?','At the same position and direction where it started.')
    add(a,start+'\ncircle(55)\nleft(45)\ncircle(55)','Rotate the next petal','Turn at the shared starting point. The next circle leans in a new direction.','Two overlapping circular petals.','Which input changes their angle?','45 in left(45).')
    c=start+'\nfor petal in range(8):\n    circle(55)\n    left(45)'
    add(a,c,'Loop eight petals','Eight turns of 45 degrees make one full turn.','A symmetrical flower of eight petals.','How do 8 and 45 fit together?','8 × 45 = 360.',kind='loop')
    c+='\ndot(45, "gold")'
    add(a,c,'Add the center','The loop ends at the shared starting point. Stamp the center there.','A gold center covering the crossing lines.','Why does the dot belong after the petals?','Later drawing covers earlier drawing, so the center sits on top.')
    c+='\npenup()\nright(90)\nforward(25)\npendown()\ncolor("seagreen")\npensize(6)\nforward(130)'
    add(a,c,'Grow a stem','Turn downward and move beyond the center before drawing the stem.','A complete flower with a green stem.','How would you shorten the stem?','Reduce the final forward distance.')
    finish(a,c,'flower')

    a=make('rainbow-arcs','Rainbow Arcs','Use half circles with different sizes and colors.',['radius','partial circles','color'])
    start='bgcolor("lightcyan")\npensize(16)\npenup()\nforward(140)\nleft(90)\npendown()'
    add(a,start+'\ncolor("tomato")\ncircle(140, 90)','Try a quarter circle','Facing upward, a positive circle radius places its center to the left. 90 degrees draws one quarter.','The right half of the red arch.','What angle would draw half a circle?','180 degrees.')
    c=start+'\ncolor("tomato")\ncircle(140, 180)'
    add(a,c,'Complete the arch','Increase only the angle to make a semicircle.','A complete red rainbow arch.','Does the radius change here?','No. Only the amount of the circle changes.')
    c+='\npenup()\nleft(90)\nforward(20)\nleft(90)\npendown()\ncolor("orange")\ncircle(-120, 180)'
    add(a,c,'Nest a second band','Move inward 20 units. Draw back across with a negative radius so this arch also curves upward.','Orange just inside the red band.','Why is the new radius smaller?','An inner arch needs less distance from its center to its edge.')
    c+='\npenup()\nright(90)\nforward(20)\nright(90)\npendown()\ncolor("gold")\ncircle(100, 180)'
    add(a,c,'Add the yellow band','Switch directions again. Each band has a radius 20 units smaller.','Three nested arches.','What radius should come next?','80.')
    c+='\npenup()\nleft(90)\nforward(20)\nleft(90)\npendown()\ncolor("mediumseagreen")\ncircle(-80, 180)'
    add(a,c,'Continue the pattern','The sign alternates because the turtle crosses the picture in opposite directions.','A four-color rainbow.','What stays the same for every band?','The 180-degree arc and the pen width.')
    c+='\npenup()\nright(90)\nforward(20)\nright(90)\npendown()\ncolor("cornflowerblue")\ncircle(60, 180)'
    add(a,c,'Finish in blue','Use the same move-inward pattern for the innermost arch.','Five evenly nested rainbow bands.','Could you choose different named colors?','Yes. The color choices do not change the shape.')
    finish(a,c,'rainbow')

    a=make('little-house','Little House','Build walls, a roof, and a doorway with simple moves.',['square loop','triangle','penup'])
    start='pensize(4)\ncolor("steelblue")\npenup()\nbackward(70)\nright(90)\nforward(100)\nleft(90)\npendown()'
    add(a,start+'\nforward(140)','Lay the bottom edge','Choose a round distance for the width of the house.','A horizontal blue line.','Why start left of the center?','It leaves room for the house to extend to the right.')
    wall=start+'\nfor side in range(4):\n    forward(140)\n    left(90)'
    add(a,wall,'Build four walls','Use the square loop from First Square.','A square outline.','How could you make the whole house narrower and shorter?','Use a smaller distance for all four sides.',kind='loop')
    wall=wall.replace('for side','begin_fill()\nfor side')+'\nend_fill()'
    add(a,wall,'Paint the house','Fill the tested square before adding its roof.','A solid blue wall.','Where does the turtle finish?','At the bottom-left corner, facing right.')
    roof='\npenup()\nleft(90)\nforward(140)\nright(90)\npendown()\ncolor("coral")\nleft(60)\nforward(140)\nright(120)\nforward(140)\nright(120)\nforward(140)'
    c=wall+roof
    add(a,c,'Add a triangular roof','Move up the left wall with the pen lifted. A 60-degree start aims the first roof edge upward.','A triangle sitting on top of the square.','Why lift the pen when moving up the wall?','It keeps that move from drawing over the wall in a new color.')
    c=c.replace('left(60)\nforward','begin_fill()\nleft(60)\nforward')+'\nend_fill()'
    add(a,c,'Fill the roof','The roof is its own closed shape, so it needs its own fill pair.','A coral roof above the blue house.','What would happen if the last roof edge were missing?','The fill would close the shape, but the outline would be missing that edge.')
    c+='\npenup()\nleft(90)\nforward(140)\nleft(90)\nforward(45)\npendown()\ncolor("midnightblue")\nbegin_fill()\nfor side in range(2):\n    forward(50)\n    left(90)\n    forward(90)\n    left(90)\nend_fill()'
    add(a,c,'Put in the doorway','From the roof’s left corner, move down and then along the bottom wall. A rectangle alternates two side lengths.','A dark door centered in the house.','Why does this rectangle loop repeat twice?','Each repeat draws a width and a height; two repeats make four sides.',kind='loop')
    c+='\npenup()\nforward(40)\nleft(90)\nforward(45)\ndot(8, "gold")'
    add(a,c,'Add the doorknob','Move inside the door and stamp a small dot. Its exact spot is your choice.','A gold doorknob.','Could you put the knob on the other side?','Yes. Use a shorter horizontal move before moving upward.')
    finish(a,c,'house')

    a=make('tiny-ice-cream','Tiny Ice Cream','One triangle and one circle become a finished treat.',['turns','fill','circle'])
    start='pensize(4)\ncolor("peru")\npenup()\nright(90)\nforward(145)\nleft(150)\npendown()'
    add(a,start+'\nforward(180)','Start at the cone tip','The starting turn points the turtle up and right from the cone’s bottom tip.','One sloping side of the cone.','Which number changes the side length?','180 in forward(180).')
    cone=start+'\nfor side in range(3):\n    forward(180)\n    left(120)'
    add(a,cone,'Close the cone','Three sides with 120-degree turns form an upside-down triangle.','A triangular cone.','How many sides does range(3) draw?','Three.',kind='loop')
    cone=cone.replace('for side','begin_fill()\nfor side')+'\nend_fill()'
    add(a,cone,'Fill the cone','Fill the triangle with its current color.','A golden-brown cone.','Can you change the color without changing the cone?','Yes. color changes the ink, while the moves determine the outline.')
    c=cone+'\npenup()\nleft(30)\nforward(200)\ndot(190, "lightpink")'
    add(a,c,'Add a scoop','Turn straight up and move from the tip to the scoop’s center. A wide dot overlaps the cone’s top.','A pink scoop resting on the cone.','What does 190 control?','The scoop’s full width.')
    c+='\nleft(90)\nforward(25)\nright(90)\nforward(30)\ndot(35, "mistyrose")'
    add(a,c,'Add a highlight','Use a smaller, lighter dot inside the scoop. It can go wherever you like.','A light spot on the scoop.','Does this highlight need an exact position?','No. Try nearby distances and choose the look you prefer.')
    finish(a,c,'ice cream')

    a=make('spiral-shell','Spiral Shell','Grow a spiral by changing one distance each time.',['variable','loop','size change'])
    start='bgcolor("seashell")\ncolor("sienna")\npensize(4)'
    add(a,start+'\ncircle(10, 90)','Draw the first bend','Start with a small quarter circle.','One small curved line.','What makes it a quarter circle?','The 90-degree angle.')
    c=start+'\ncircle(10, 90)\ncircle(20, 90)\ncircle(30, 90)\ncircle(40, 90)'
    add(a,c,'Grow each bend','Each bend has a radius 10 units larger. The growing turns open into a spiral.','Four connected bends around the center.','Which number increases in each line?','The first input: the radius.')
    c=start+'\nsize = 10\nfor bend in range(4):\n    circle(size, 90)\n    size = size + 10'
    add(a,c,'Let a variable grow','size starts at 10. After each bend, add 10 and store the result for the next repeat.','The same four bends.','What is size when the second bend starts?','20.',kind='loop')
    c=c.replace('range(4)','range(12)')
    add(a,c,'Let the shell grow','Keep the size change and repeat more times.','A larger twelve-bend spiral.','What happens if you remove size = size + 10?','Every bend has the same radius, so it keeps tracing a small circle.')
    c=c.replace('pensize(4)','pensize(7)').replace('sienna','coral')
    add(a,c,'Choose its ink','Line width and color change the appearance without changing the movement pattern.','A thicker coral spiral.','Would changing pensize make the spiral wider overall?','It thickens the line. The radii still set the path of the spiral.')
    finish(a,c,'spiral shell')

    a=make('mini-robot','Mini Robot','Reuse a square and move between the face details.',['loop','penup','dot','relative moves'])
    start='pensize(4)\ncolor("lightseagreen")\npenup()\nbackward(100)\nright(90)\nforward(100)\nleft(90)\npendown()'
    c=start+'\nfor side in range(4):\n    forward(200)\n    left(90)'
    add(a,c,'Outline the head','Use four equal sides and quarter turns.','A large square robot head.','Where will the turtle finish?','At the bottom-left corner, facing right.',kind='loop')
    c=c.replace('for side','begin_fill()\nfor side')+'\nend_fill()'
    add(a,c,'Fill the head','Keep the square loop inside the fill commands.','A turquoise head.','Why does the fill finish after the loop?','All four sides must be traced first.')
    c+='\npenup()\nforward(50)\nleft(90)\nforward(130)\ndot(45, "white")\ndot(20, "midnightblue")'
    add(a,c,'Place the first eye','Move 50 units right and 130 up from the corner. Two dots at one spot make an eye.','One white eye with a dark pupil.','Which dot belongs first?','The larger white dot, so the pupil stays visible on top.')
    c+='\nright(90)\nforward(100)\ndot(45, "white")\ndot(20, "midnightblue")'
    add(a,c,'Move to the other eye','Move sideways from the first eye. Both eyes stay at the same height.','Two matching eyes.','Does this need a list of coordinates?','No. Move 100 units from the first eye to place the next one.')
    c+='\nbackward(100)\nright(90)\nforward(70)\nleft(90)\npendown()\ncolor("midnightblue")\npensize(7)\nforward(100)'
    add(a,c,'Draw its mouth','Return left, move down, then draw across. Keep the pen lifted until you reach the mouth.','A straight mouth below the eyes.','Which movement changes how low the mouth is?','The forward(70) after the downward turn.')
    c+='\npenup()\nbackward(50)\nleft(90)\nforward(140)\npendown()\nforward(40)\ndot(25, "gold")'
    add(a,c,'Add an antenna','Move to the top center, then draw a short upward line and a gold tip.','A finished robot with an antenna.','Which input could make its antenna taller?','The final forward(40).')
    finish(a,c,'robot')

    for p in projects:
        p['code']=p['steps'][-1]['code']
        p['category']={'starter-balloon':'Art','starter-sun-rays':'Nature','starter-circle-flower':'Nature','starter-rainbow-arcs':'Nature','starter-little-house':'Architecture','starter-tiny-ice-cream':'Food','starter-spiral-shell':'Nature','starter-mini-robot':'Characters'}.get(p['id'],'Shapes')
    return projects
