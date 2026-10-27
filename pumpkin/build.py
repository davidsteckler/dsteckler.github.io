"""Author the student programs with visible Turtle commands and small functions."""
from pathlib import Path
import ast
import html
import json
import math

ROOT = Path(__file__).parent

def combine(*parts):
    return '\n\n'.join(part.strip() for part in parts if part).strip() + '\n'

class Drawing:
    """Authoring convenience only; none of this class is shown to students."""
    def __init__(self, background='black'):
        self.background = background
        self.functions = {}
        self.blocks = []

    def function(self, name, commands):
        text = 'def ' + name + '():\n' + '\n'.join('    ' + line for line in commands.splitlines())
        assert name not in self.functions or self.functions[name] == text, name
        self.functions[name] = text
        return name + '()'

    def add(self, label, commands):
        self.blocks.append('# ' + label + '\n' + commands)

    def position(self, x, y, heading=0):
        def number(value):
            value = round(value, 1)
            return str(int(value)) if value == int(value) else str(value)
        return f'penup()\nsetposition({number(x)}, {number(y)})\nsetheading({number(heading)})\npendown()'

    def filled(self, label, x, y, commands, color, heading=0, function=None):
        shape = 'begin_fill()\n' + commands + '\nend_fill()'
        if function:
            shape = self.function(function, shape)
        self.add(label, self.position(x, y, heading) + '\ncolor(' + json.dumps(color) + ')\n' + shape)

    def circle(self, label, x, y, size, color, function=None):
        # The authored center is converted to a literal bottom-edge coordinate.
        self.filled(label, x, y-size, f'circle({size})', color, function=function)

    def rectangle(self, label, x, y, width, height, color, function=None):
        commands = f'for i in range(2):\n    forward({width})\n    left(90)\n    forward({height})\n    left(90)'
        self.filled(label, x, y, commands, color, function=function)

    def triangle(self, label, x, y, size, color='white', heading=0, function='triangle'):
        commands = f'for i in range(3):\n    forward({size})\n    left(120)'
        self.filled(label, x, y, commands, color, heading, function)

    def arc(self, label, x, y, heading, size, angle, color='white', width=6):
        self.add(label, self.position(x,y,heading) + f'\ncolor({json.dumps(color)})\npensize({width})\ncircle({size}, {angle})\npensize(1)')

    def line(self, label, x, y, heading, length, color='white', width=3):
        self.add(label, self.position(x,y,heading) + f'\ncolor({json.dumps(color)})\npensize({width})\nforward({length})\npensize(1)')

    def path(self, label, points, color):
        # Student code visits each point explicitly, with no lists or indexing.
        first, *rest = points
        commands = '\n'.join(f'setposition({x}, {y})' for x,y in rest+[first])
        self.filled(label, *first, commands, color)

    def star(self, label, x, y, size=24, color='gold'):
        self.filled(label,x,y,f'for i in range(5):\n    forward({size})\n    right(144)',color,72,'star')

    def body(self, color='darkorange', x=0, y=0, size=134):
        self.circle('Draw the pumpkin body. The circle starts at its bottom.',x,y,size,color)
        self.rectangle('Draw the green stem at the top.',x-12,y+size-4,24,36,'green','stem')

    def eyes(self, kind='triangle', color='white', x=0, y=0, size=45, distance=48):
        if kind == 'triangle':
            self.triangle('Draw the left eye.',x-distance-size/2,y+32,size,color)
            self.triangle('Draw the right eye. Reuse triangle().',x+distance-size/2,y+32,size,color)
        else:
            self.circle('Draw the left eye.',x-distance,y+48,size,color,'eye')
            self.circle('Draw the right eye. Reuse eye().',x+distance,y+48,size,color,'eye')

    def smile(self, x=0, y=0, size=49, color='white'):
        self.arc('Draw the smile. 180 makes half a circle.',x-size,y-33,270,size,180,color,7)

    def face(self, color='white'):
        self.eyes(color=color)
        self.triangle('Face left to draw the nose pointing down.',15,-10,30,color,180,'small_triangle')
        self.add('Draw six teeth, moving left after each tooth.', self.position(90,-44,180) + f'\ncolor({json.dumps(color)})\nfor i in range(6):\n    small_triangle()\n    penup()\n    forward(30)\n    pendown()')

    def code(self):
        definitions = combine('# Make these functions first. They run when you call them below.', *self.functions.values()) if self.functions else ''
        return combine(definitions, f'# Set up the drawing.\nspeed(0)\nbgcolor({json.dumps(self.background)})', *self.blocks, 'hideturtle()')

designs = []
def design(id, title, category, description, experiment, drawing, level='Practice', focus=''):
    code = drawing if isinstance(drawing,str) else drawing.code()
    designs.append(dict(id=id,title=title,category=category,description=description,experiment=experiment,
                        code=code,level=level,focus=focus,preview=f'previews/{id}.svg'))

# The tutorial uses the same familiar two triangle functions throughout.
TRIANGLE = '''def triangle():
    color("white")
    begin_fill()
    for i in range(3):
        forward(50)
        left(120)
    end_fill()'''
SMALL = TRIANGLE.replace('def triangle():','def small_triangle():').replace('forward(50)','forward(30)')
FUNCTIONS = combine('# Make these functions first.',TRIANGLE,SMALL)
SETUP = 'speed(0)\nbgcolor("black")'
BODY = '''# Draw the body. The circle starts at its bottom edge.
penup()
setposition(0, -140)
setheading(0)
pendown()
color("darkorange")
begin_fill()
circle(140)
end_fill()'''
STEM = '''# Draw the stem at the top.
penup()
setposition(-14, 136)
setheading(0)
pendown()
color("green")
begin_fill()
for i in range(2):
    forward(28)
    left(90)
    forward(48)
    left(90)
end_fill()'''
LEFT_EYE = '''# Draw the left eye.
penup()
setposition(-75, 35)
setheading(0)
pendown()
triangle()'''
RIGHT_EYE = LEFT_EYE.replace('left eye','right eye').replace('(-75, 35)','(25, 35)')
NOSE = '''# Face left to draw the nose pointing down.
penup()
setposition(15, -12)
setheading(180)
pendown()
small_triangle()'''
TOOTH_START = '''# Start at the right end of the mouth and face left.
penup()
setposition(90, -44)
setheading(180)
pendown()'''
TEETH = combine(TOOTH_START,'''# Draw a tooth, then move left. Repeat six times.
for i in range(6):
    small_triangle()
    penup()
    forward(30)
    pendown()''')
FINAL = combine(FUNCTIONS, SETUP, BODY, STEM, LEFT_EYE, RIGHT_EYE, NOSE, TEETH, 'hideturtle()')
stages = []
def stage(id,title,skill,instruction,why,snippet,parts,expected,predict,answer,experiment,focus):
    code = combine(FUNCTIONS, SETUP, *parts, 'hideturtle()')
    stages.append(dict(id=id,title=title,skill=skill,instruction=instruction,why=why,snippet=snippet,
                       code=code,expected=expected,predict=predict,answer=answer,experiment=experiment,
                       focus=focus,preview=f'previews/step-{id}.svg'))

stage('functions','Make the triangle functions first','Functions + a loop',
      'Type these two functions at the top. Then try triangle() underneath speed(0) and bgcolor("black").',
      'def gives a name to a group of commands. The indented lines wait until you call the function. Each loop repeats three sides and three turns.',
      combine(TRIANGLE,SMALL,'speed(0)\nbgcolor("black")\ntriangle()'),['triangle()'],
      'One white triangle. The small triangle function is ready for later.',
      'Does defining small_triangle() also draw a small triangle?',
      'It waits. Add small_triangle() below the definitions to use it.',
      'Replace the last triangle() call with small_triangle(). Compare the sizes.', ['def triangle():','def small_triangle():'])
stage('body','Draw the pumpkin body','Position + color + fill',
      'Keep both functions at the top. Replace the practice triangle() call with this body code.',
      'Start at (0, −140), facing right. circle(140) draws the body above that point. begin_fill() and end_fill() fill the circle.',
      BODY,[BODY],'A filled orange circle on a black background.',
      'Why do we move with the pen up?','Tracy can reach the bottom of the body without drawing a line from the center.',
      'Try color("orange") for the body. Keep the quotation marks.', ['circle(140)','setposition(0, -140)'])
stage('stem','Add the stem at the top','A rectangle + a loop',
      'Add the stem after the body code and before hideturtle().',
      'The loop draws a short side and a long side twice. That makes four sides. We draw the body first so the stem can sit on top of it.',
      STEM,[BODY,STEM],'The orange body with a green stem.',
      'How many sides does range(2) draw here?','Four. Each repeat draws two sides.',
      'Change forward(48) to forward(36) for a shorter stem.', ['for i in range(2):','forward(48)'])
stage('left-eye','Use triangle() for the left eye','Call a function',
      'Add these movement commands below the stem. Call the triangle function you made in step 1.',
      'Move with the pen up, face right, then put the pen down. triangle() runs the white triangle commands at the top of your program.',
      LEFT_EYE,[BODY,STEM,LEFT_EYE],'One white triangle eye on the left.',
      'Where is the code that sets the eye color?','Inside triangle(), near the top of the program.',
      'Change −75 to −85 to move the left eye farther left.', ['setposition(-75, 35)','triangle()'])
stage('right-eye','Reuse triangle() for the right eye','Reuse a function',
      'Move to the right side of the face and call triangle() again.',
      'Both eyes use the same function. The movement commands give each eye a different starting place.',
      RIGHT_EYE,[BODY,STEM,LEFT_EYE,RIGHT_EYE],'Two matching white triangle eyes.',
      'What happens if forward(50) inside triangle() becomes forward(40)?','Both eyes get smaller because both calls use that function.',
      'Change the right eye’s y value from 35 to 50.', ['setposition(25, 35)','triangle()'])
stage('nose','Add the smaller nose','Heading + a function',
      'Add this below the eyes. Use small_triangle(), which is already defined at the top.',
      'setheading(180) faces left. The same left turns now draw a triangle pointing down.',
      NOSE,[BODY,STEM,LEFT_EYE,RIGHT_EYE,NOSE],'Two eyes and a smaller upside-down nose.',
      'Which number sets the nose’s side length?','forward(30), inside small_triangle().',
      'Try setheading(0) here, then change it back to 180.', ['setheading(180)','small_triangle()'])
stage('one-tooth','Try one tooth','Use the same function again',
      'Move below the nose and reuse small_triangle() once.',
      'The tooth and nose use exactly the same function. Their starting positions put them in different places.',
      combine(TOOTH_START,'small_triangle()'),[BODY,STEM,LEFT_EYE,RIGHT_EYE,NOSE,TOOTH_START,'small_triangle()'],
      'One downward-pointing tooth at the right of the mouth.',
      'Will the tooth match the nose’s size?','Yes. Both call small_triangle().',
      'Try setposition(60, -44) to move this tooth left.', ['setposition(90, -44)','small_triangle()'])
stage('teeth','Repeat a row of teeth','A loop + a function',
      'Replace the single tooth call with this loop. Keep the positioning commands above it.',
      'Each repeat draws a tooth, lifts the pen, moves 30 pixels left, and lowers the pen for the next tooth.',
      TEETH,[BODY,STEM,LEFT_EYE,RIGHT_EYE,NOSE,TEETH],'Six teeth across the mouth.',
      'Which number changes the number of teeth?','The 6 in range(6). forward(30) changes their spacing.',
      'Try range(5), then range(6). Watch the left end of the row.', ['for i in range(6):','forward(30)'])
stage('finish','Read and run the whole drawing','Follow the program from top to bottom',
      'Check the order: functions first, then setup, body, stem, left eye, right eye, nose, teeth, and hideturtle().',
      'The functions wait at the top. Below them, the drawing commands run in order. Comments name the part you are drawing.',
      FINAL,[BODY,STEM,LEFT_EYE,RIGHT_EYE,NOSE,TEETH],'The complete pumpkin.',
      'Does hideturtle() erase the drawing?','It hides Tracy’s marker and leaves the drawing in place.',
      'Change speed(0) to speed(3) to watch the drawing happen.', ['hideturtle()'])
stage('remix','Make your own version','Change one thing at a time',
      'Choose a gallery pumpkin or change this one. Make three changes you can point to in the code.',
      'Each gallery example starts with its functions. The comments below them name each part as you draw it.',
      '# Try a new color.\n# Move an eye.\n# Change the number of teeth.',[BODY,STEM,LEFT_EYE,RIGHT_EYE,NOSE,TEETH],
      'A pumpkin with choices you can explain.',
      'Which function changes the nose and every tooth together?','small_triangle(), because they all call it.',
      'Change one thing, run the code, and explain what changed.', ['def small_triangle():','for i in range(6):'])

design('original','The original','Faces','The triangle-eyed pumpkin from the tutorial.',
       'Change range(6) to range(5) in the teeth loop.',FINAL,'Start here','for i in range(6):')

for id,title,description,task in [
    ('smile','Big smile','Two round eyes and a half-circle smile.','Change pensize(7) in the smile to pensize(12).'),
    ('surprised','Surprised','Three white circles make a surprised face.','Change circle(24) in the mouth to circle(30).'),
    ('sleepy','Sleepy','Two half-circle eyelids and a small round mouth.','Change pensize(7) in the eyelids to pensize(4).'),
    ('angry','Angry eyebrows','Two slanted lines change the expression.','Change the eyebrow headings to 20 and 340.'),
    ('wink','One wink','One circle eye, one curved eye, and a smile.','Change the winking eye’s starting y value from 48 to 60.'),
    ('vampire','Vampire','A rectangle mouth with two triangle fangs.','Change forward(28) inside fang() to forward(36).'),
    ('cat','Cat face','Triangle ears and nose, circle eyes, and straight whiskers.','Change the whiskers from forward(35) to forward(45).'),
    ('robot','Robot face','Square eyes and a rectangle mouth with straight dividing lines.','Change the eye color from lightblue to yellow.'),
    ('zipper','Zipper smile','A straight mouth with a row of little stitches.','Change range(7) to range(5) in the stitch loop.'),
    ('hearts','Heart eyes','Each heart uses two half circles and two straight lines.','Change the eye color from crimson to deeppink.'),
    ('goofy','Goofy grin','Two different eye sizes and two square teeth.','Change the eye(28) call to eye(20).')]:
    p=Drawing();p.body()
    if id=='smile': p.eyes('round',size=18);p.smile()
    elif id=='surprised': p.eyes('round',size=18);p.circle('Draw the open mouth.',0,-43,24,'white')
    elif id=='sleepy':
        p.arc('Draw the left closed eye.',-70,49,270,22,180)
        p.arc('Draw the right closed eye.',27,49,270,22,180)
        p.circle('Draw the little sleeping mouth.',0,-43,12,'white')
    elif id=='angry':
        p.eyes('round',size=18)
        p.line('Draw the left eyebrow slanting down.',-78,87,340,55,'black',9)
        p.line('Draw the right eyebrow slanting up.',27,68,20,55,'black',9)
        p.line('Draw the straight mouth.',-32,-52,0,64,'white',7)
    elif id=='wink':
        p.circle('Draw the open eye.',-48,48,20,'white','eye')
        p.arc('Draw the winking eye.',26,48,270,22,180);p.smile()
    elif id=='vampire':
        p.eyes();p.rectangle('Draw the dark mouth.',-65,-69,130,42,'black')
        p.triangle('Draw the left fang pointing down.',-32,-27,28,'white',180,'fang')
        p.triangle('Draw the right fang. Reuse fang().',57,-27,28,'white',180,'fang')
    elif id=='cat':
        p.triangle('Draw the left ear.',-103,86,65,'darkorange',function='ear')
        p.triangle('Draw the right ear. Reuse ear().',39,86,65,'darkorange',function='ear')
        p.eyes('round','black',size=15)
        p.triangle('Draw the pink nose pointing down.',12,1,24,'pink',180,'nose')
        for side in [-1,1]:
            for y,heading in [(-13,170),(-29,180),(-45,190)]:
                p.line('Draw a left whisker.' if side==-1 else 'Draw a right whisker.',side*50,y,heading if side==-1 else 180-heading,35)
    elif id=='robot':
        for x,label in [(-75,'left'),(28,'right')]:p.rectangle(f'Draw the {label} square eye.',x,25,44,44,'lightblue','eye')
        p.rectangle('Draw the black mouth.',-68,-72,136,43,'black')
        p.add('Draw four lines across the mouth.',p.position(-41,-70,90)+'''\ncolor("white")
for i in range(4):
    forward(39)
    penup()
    backward(39)
    right(90)
    forward(27)
    left(90)
    pendown()''')
    elif id=='zipper':
        p.eyes();p.line('Draw the mouth from left to right.',-78,-50,0,156,'black',5)
        p.add('Draw a stitch, then move right for the next one.',p.position(-66,-63,90)+'''\ncolor("black")
pensize(3)
for i in range(7):
    forward(26)
    penup()
    backward(26)
    right(90)
    forward(22)
    left(90)
    pendown()
pensize(1)''')
    elif id=='hearts':
        for x,label in [(-48,'left'),(48,'right')]:
            p.filled(f'Draw the {label} heart eye.',x,27,'''left(45)
forward(30)
circle(15, 180)
right(90)
circle(15, 180)
forward(30)''','crimson',function='heart')
        p.smile(color='black')
    elif id=='goofy':
        # One optional parameter, with a familiar name and a plain explanation.
        p.functions['eye']='''# size is the number you put inside eye(...).
def eye(size):
    begin_fill()
    circle(size)
    end_fill()'''
        p.add('Draw the big left eye. Use 28 for size.',p.position(-47,20)+'\ncolor("white")\neye(28)')
        p.add('Draw the smaller right eye. Use 18 for size.',p.position(47,30)+'\ncolor("white")\neye(18)')
        p.circle('Draw the left pupil.',-43,46,9,'black','pupil')
        p.circle('Draw the right pupil.',44,50,9,'black','pupil')
        p.rectangle('Draw the mouth.',-63,-68,126,42,'black')
        p.rectangle('Draw the left tooth.',-34,-48,22,22,'white','tooth')
        p.rectangle('Draw the right tooth.',12,-68,22,22,'white','tooth')
    design(id,title,'Faces',description,task,p,'One parameter' if id=='goofy' else 'Practice')

for id,title,color,background,face_color in [
    ('ghost','Ghost pumpkin','ivory','darkslategray','black'),
    ('teal','Teal pumpkin','teal','black','white'),
    ('pink','Pink pumpkin','pink','black','purple'),
    ('purple','Purple pumpkin','mediumpurple','black','yellow'),
    ('green','Green pumpkin','yellowgreen','black','darkgreen'),
    ('red','Red pumpkin','tomato','black','white'),
    ('blue','Blue pumpkin','steelblue','black','white'),
    ('gold','Golden pumpkin','goldenrod','black','black')]:
    p=Drawing(background);p.body(color);p.face(face_color)
    design(id,title,'Colors','The same shapes with a different body and face color.',
           'Find the comment for the body. Change its color() command.',p,'Start here')

for id,title,description,task in [
    ('dots','Polka dots','A dot function and one loop draw each row.','Change range(5) to range(4) in one row.'),
    ('stripes','Vertical stripes','A stripe function and one loop repeat tall rectangles.','Change range(7) to range(5).'),
    ('patchwork','Patchwork','Three square patches, each with a row of stitches.','Change a patch color and run the code.'),
    ('stars','Star-covered','Reuse star() at five starting positions.','Change forward(24) inside star() to forward(30).'),
    ('checker','Checker pattern','A square function draws each row with one loop.','Change the square color from chocolate to brown.'),
    ('rings','Concentric rings','Three circles sit inside the pumpkin.','Change circle(90) to circle(85) and move its start to (0, -85).'),
    ('rainbow','Rainbow stripes','Seven rectangles use seven named colors.','Change the color() command for one band.'),
    ('spiral','Spiral pumpkin','A variable makes each straight line a little longer.','Change size = size + 1 to size = size + 2.')]:
    p=Drawing();p.body('mediumpurple' if id=='stars' else 'darkorange')
    if id=='dots':
        p.function('dot','begin_fill()\ncircle(7)\nend_fill()')
        for y in [64,19,-26,-71]:
            p.add('Draw a row of five dots, moving right after each one.',p.position(-78,y)+'''\ncolor("gold")
for i in range(5):
    dot()
    penup()
    forward(39)
    pendown()''')
    elif id=='stripes':
        p.function('stripe','''begin_fill()
for i in range(2):
    forward(11)
    left(90)
    forward(176)
    left(90)
end_fill()''')
        p.add('Draw seven stripes. Move right 26 pixels after each one.',p.position(-84,-88)+'''\ncolor("chocolate")
for i in range(7):
    stripe()
    penup()
    forward(26)
    pendown()''')
    elif id=='patchwork':
        for x,y,color in [(-90,20,'gold'),(35,0,'coral'),(-25,-100,'khaki')]:
            p.rectangle('Draw a square patch.',x,y,48,48,color,'patch')
            p.add('Add three stitches along the patch edge.',p.position(x+8,y-5,90)+'''\ncolor("black")
for i in range(3):
    forward(10)
    penup()
    backward(10)
    right(90)
    forward(16)
    left(90)
    pendown()''')
    elif id=='stars':
        for x,y in [(-85,40),(-25,83),(57,57),(-65,-63),(24,-67)]:p.star('Move to a new place and call star().',x,y)
    elif id=='checker':
        p.function('square','''begin_fill()
for i in range(4):
    forward(30)
    left(90)
end_fill()''')
        for x,y,count in [(-75,45,3),(-45,15,2),(-75,-15,3),(-45,-45,2),(-75,-75,3)]:
            p.add('Draw one row of squares, with a gap between them.',p.position(x,y)+f'''\ncolor("chocolate")
for i in range({count}):
    square()
    penup()
    forward(60)
    pendown()''')
    elif id=='rings':
        for size in [112,90,68]:p.arc('Draw a circle outline from its bottom edge.',0,-size,0,size,360,'chocolate',3)
    elif id=='rainbow':
        for y,color in [(60,'red'),(36,'orange'),(12,'yellow'),(-12,'green'),(-36,'turquoise'),(-60,'blue'),(-84,'purple')]:
            p.rectangle(f'Draw the {color} band.',-94,y,188,24,color,'band')
    elif id=='spiral':
        p.add('Start with a short line. Add 1 to size after every turn.',p.position(0,0)+'''\ncolor("gold")
pensize(3)
size = 1
for i in range(40):
    forward(size)
    right(25)
    size = size + 1
pensize(1)''')
    p.eyes(color='black');p.smile(color='black')
    design(id,title,'Patterns',description,task,p,'One variable' if id=='spiral' else 'More shapes')

for id,title,description,task in [
    ('witch','Witch hat','A purple triangle and a rectangle brim.','Change the hat color from rebeccapurple to blueviolet.'),
    ('pirate','Pirate','A rectangle bandana and a circle eye patch.','Change circle(27) in the eye patch to circle(22).'),
    ('wizard','Starry wizard','A blue triangle hat with two gold stars.','Change the two star starting positions.'),
    ('crown','Pumpkin royalty','A rectangle, three triangles, and three circle jewels.','Change the three jewel colors.'),
    ('headphones','Headphones','A half circle joins two rectangle ear cups.','Change pensize(12) for the headband to pensize(18).'),
    ('glasses','Round glasses','Two circle outlines and three connecting lines.','Change pensize(5) on the lenses to pensize(8).'),
    ('bowtie','Bow tie','Two triangles meet below the face.','Change the bow tie color to royalblue.'),
    ('mummy','Mummy wrap','Five rectangle bands leave room for two eyes.','Change one band color to lightgray.'),
    ('bat','Bat wings','Two large triangles make wings behind a small pumpkin.','Change the wing color from mediumpurple to gray.'),
    ('alien','Alien antennae','Two straight stalks and two circle tips.','Change the antenna tip color from yellowgreen to yellow.'),
    ('unicorn','Unicorn','A gold triangle horn on a pink pumpkin.','Change the horn color from gold to ivory.'),
    ('flowers','Flower crown','Reuse a flower function three times above the face.','Change the petal color from hotpink to plum.')]:
    p=Drawing()
    if id=='bat':
        p.triangle('Draw the left wing behind the body.',-178,75,130,'mediumpurple',300,'wing')
        p.triangle('Draw the right wing behind the body.',48,75,130,'mediumpurple',300,'wing')
        p.body(size=91)
        p.circle('Draw the left eye.',-34,30,12,'white','eye');p.circle('Draw the right eye.',34,30,12,'white','eye')
        p.smile(y=13,size=34)
    else:
        p.body('pink' if id=='unicorn' else 'darkorange')
        # Headwear belongs above the eyes in the main drawing sequence.
        if id in ['witch','wizard']:
            p.triangle('Draw the pointed hat.',-49,100,98,'rebeccapurple' if id=='witch' else 'royalblue',function='hat')
            p.rectangle('Draw the wide hat brim.',-110,96,220,16,'indigo' if id=='witch' else 'navy')
            if id=='wizard':
                p.star('Draw the left star on the hat.',-29,142,20)
                p.star('Draw the right star on the hat.',19,118,20)
        elif id=='pirate':
            p.rectangle('Draw the red bandana.',-99,82,198,30,'crimson')
            p.line('Draw the eye patch strap.',-91,78,340,182,'black',6)
        elif id=='crown':
            p.rectangle('Draw the bottom of the crown.',-78,103,156,24,'goldenrod')
            for x in [-78,-26,26]:p.triangle('Draw a crown point.',x,125,52,'gold',function='crown_point')
            for x,color in [(-48,'crimson'),(0,'royalblue'),(48,'limegreen')]:p.circle('Draw a colored jewel.',x,116,7,color,'jewel')
        elif id=='headphones':
            p.arc('Draw the headband from left to right.',-143,5,90,-143,180,'slateblue',12)
            p.rectangle('Draw the left ear cup.',-151,-29,26,73,'cornflowerblue','ear_cup')
            p.rectangle('Draw the right ear cup.',125,-29,26,73,'cornflowerblue','ear_cup')
        elif id=='mummy':
            for y,width,x in [(78,168,-84),(49,224,-112),(-15,240,-120),(-50,208,-104),(-85,160,-80)]:
                p.rectangle('Draw a wrap band across the body.',x,y,width,24,'wheat')
        elif id=='alien':
            p.line('Draw the left antenna stalk.',-58,116,112,58,'yellowgreen',6)
            p.line('Draw the right antenna stalk.',58,116,68,58,'yellowgreen',6)
            p.circle('Draw the left antenna tip.',-80,170,13,'yellowgreen','antenna_tip')
            p.circle('Draw the right antenna tip.',80,170,13,'yellowgreen','antenna_tip')
        elif id=='unicorn':p.triangle('Draw the horn above the face.',-30,115,60,'gold',function='horn')
        elif id=='flowers':
            p.functions['flower']='''def flower():
    color("hotpink")
    for i in range(4):
        begin_fill()
        circle(12)
        end_fill()
        left(90)'''
            for x,y in [(-65,118),(0,142),(65,118)]:
                p.add('Draw a flower above the eyes.',p.position(x,y)+'\nflower()')
                p.circle('Add the yellow flower center.',x,y,7,'gold','flower_center')
        if id=='pirate':
            p.circle('Draw the black eye patch.',-48,44,27,'black')
            p.circle('Draw the open eye.',48,44,19,'white')
        elif id=='mummy':p.eyes('round','black',size=16)
        else:p.eyes('round','black' if id=='glasses' else 'white',size=18)
        if id=='glasses':
            p.arc('Draw the left lens.',-48,10,0,38,360,'black',5)
            p.arc('Draw the right lens.',48,10,0,38,360,'black',5)
            p.line('Join the lenses with a bridge.',-10,48,0,20,'black',5)
            p.line('Draw the left glasses arm.',-112,54,0,26,'black',4)
            p.line('Draw the right glasses arm.',86,54,0,26,'black',4)
        if id!='mummy':p.smile(color='black' if id=='glasses' else 'white')
        if id=='bowtie':
            p.triangle('Draw the left half of the bow tie.',-50,-90,52,'crimson',270,'bow')
            p.triangle('Draw the right half of the bow tie.',50,-142,52,'crimson',90,'bow')
            p.circle('Draw the bow tie knot.',0,-116,12,'darkred')
    design(id,title,'Costumes',description,task,p,'More shapes')

def small_pumpkin(p):
    # A complete, repeated object. Only ordinary relative pen movements inside.
    p.functions['small_pumpkin']='''def small_pumpkin():
    # Draw the body from its bottom edge.
    color("darkorange")
    begin_fill()
    circle(32)
    end_fill()

    # Move up to the stem.
    penup()
    left(90)
    forward(60)
    right(90)
    backward(4)
    pendown()
    color("green")
    begin_fill()
    for i in range(2):
        forward(8)
        left(90)
        forward(16)
        left(90)
    end_fill()

    # Move down and left to the first eye.
    penup()
    backward(14)
    right(90)
    forward(24)
    left(90)
    pendown()
    color("white")
    begin_fill()
    circle(6)
    end_fill()

    # Move right to the second eye.
    penup()
    forward(36)
    pendown()
    begin_fill()
    circle(6)
    end_fill()

    # Move down and left to the smile.
    penup()
    backward(30)
    right(90)
    forward(12)
    pendown()
    pensize(3)
    circle(12, 180)
    pensize(1)'''

for id,title,description,task in [
    ('twins','Pumpkin twins','Call the same small_pumpkin() function twice.','Change the second pumpkin’s starting x value from 90 to 70.'),
    ('family','Pumpkin family','Three pumpkins share the same drawing function.','Move the middle pumpkin up by changing its starting y value.'),
    ('patch','Pumpkin patch','One function draws a pumpkin. One loop repeats it across the ground.','Change range(5) to range(4).'),
    ('moon','Under the moon','Two circles make a crescent above a smaller pumpkin.','Change the moon color from khaki to ivory.'),
    ('web','Spiderweb corner','Straight lines connect a few points in the corner.','Change the web’s color() commands to silver.'),
    ('leaves','Autumn leaves','A diamond leaf function is reused around the pumpkin.','Change the color() command before one leaf() call.'),
    ('stack','Pumpkin stack','Three calls stack the same small pumpkin from top to bottom.','Change the middle pumpkin’s starting x value to 10.'),
    ('glow','Lantern glow','Three background circles sit behind the pumpkin.','Change a glow color from peru to sienna.')]:
    p=Drawing('midnightblue' if id in ['moon','web'] else 'black')
    if id in ['twins','family','patch','stack']:
        small_pumpkin(p)
        if id=='patch':
            p.rectangle('Draw the ground behind the pumpkins.',-200,-200,400,128,'darkgreen')
            p.add('Draw five pumpkins, moving right after each one.',p.position(-152,-100)+'''\nfor i in range(5):
    small_pumpkin()
    # Return to the bottom of this pumpkin.
    penup()
    setheading(0)
    backward(12)
    right(90)
    forward(24)
    left(90)
    # Move to the next pumpkin.
    forward(76)
    pendown()''')
        else:
            positions = [(-90,-80),(90,-80)] if id=='twins' else [(-100,-80),(0,-65),(100,-80)] if id=='family' else [(0,78),(0,-12),(0,-102)]
            for x,y in positions:p.add('Move to the bottom of a pumpkin and call small_pumpkin().',p.position(x,y)+'\nsmall_pumpkin()')
    elif id=='moon':
        p.circle('Draw the moon.',-120,140,38,'khaki')
        p.circle('Cover part of the moon with the background color.',-103,151,34,'midnightblue')
        for x,y in [(55,157),(132,111),(2,125)]:p.star('Draw a star in the sky.',x,y,18,'khaki')
        p.body(x=0,y=-40,size=100)
        p.circle('Draw the left eye.',-35,-5,14,'white','eye');p.circle('Draw the right eye.',35,-5,14,'white','eye')
        p.smile(y=-20,size=35)
    elif id=='web':
        p.body(x=-20,y=-25,size=108)
        p.circle('Draw the left eye.',-56,12,14,'white','eye');p.circle('Draw the right eye.',16,12,14,'white','eye')
        p.smile(x=-20,y=-8,size=35)
        for heading in [180,225,270]:p.line('Draw a line from the corner.',185,185,heading,135,'silver',2)
        for commands in [
            'setposition(135, 185)\nsetposition(150, 150)\nsetposition(185, 135)',
            'setposition(95, 185)\nsetposition(121, 121)\nsetposition(185, 95)',
            'setposition(55, 185)\nsetposition(93, 93)\nsetposition(185, 55)']:
            first,*rest=commands.splitlines()
            p.add('Connect three points to make a web strand.', 'penup()\n'+first+'\npendown()\ncolor("silver")\n'+'\n'.join(rest))
    elif id=='leaves':
        p.body(size=106);p.eyes('round',size=18);p.smile()
        for x,y,color,heading in [(-155,98,'coral',30),(145,95,'gold',30),(-153,-102,'sienna',30),(150,-98,'yellowgreen',30)]:
            p.filled('Draw a leaf beside the pumpkin.',x,y,'''for i in range(2):
    forward(25)
    left(60)
    forward(25)
    left(120)''',color,heading,'leaf')
    elif id=='glow':
        for size,color in [(183,'saddlebrown'),(165,'sienna'),(148,'peru')]:p.circle('Draw a glow circle behind the pumpkin.',0,0,size,color)
        p.body(size=125);p.face('yellow')
    design(id,title,'Scenes',description,task,p,'More shapes')


class TurtleRecorder:
    """Small, deterministic implementation of the drawing commands used here."""
    def __init__(self):
        self.x=self.y=self.heading=0
        self.down=True;self.shade='black';self.fillshade='black';self.width=1
        self.filling=None;self.elements=[];self.bg='white';self.path=[];self.bounds=[]
    @staticmethod
    def n(v): return str(round(v,3))
    def flush(self):
        if len(self.path)>1:
            d='M '+' L '.join(f'{self.n(x)} {self.n(y)}' for x,y in self.path)
            self.elements.append(f'<path d="{d}" fill="none" stroke="{html.escape(self.shade)}" stroke-width="{self.width}" stroke-linecap="round" stroke-linejoin="round"/>')
        self.path=[]
    def speed(self,v): assert 0<=v<=10
    def bgcolor(self,v): self.bg=v
    def penup(self): self.flush();self.down=False
    def pendown(self): self.down=True
    def setposition(self,x,y):
        assert math.isfinite(x) and math.isfinite(y)
        if self.filling is not None:self.filling.append((x,y))
        if self.down:
            if self.filling is None:
                if not self.path:self.path=[(self.x,self.y)]
                self.path.append((x,y))
            self.bounds.extend([(self.x,self.y),(x,y)])
        self.x,self.y=x,y
    def setheading(self,v): self.heading=v
    def forward(self,v):
        a=math.radians(self.heading);self.setposition(self.x+math.cos(a)*v,self.y+math.sin(a)*v)
    def backward(self,v): self.forward(-v)
    def left(self,v): self.heading+=v
    def right(self,v): self.heading-=v
    def color(self,c): self.flush();self.shade=self.fillshade=c
    def pensize(self,v):self.flush();self.width=v
    def begin_fill(self):self.flush();assert self.filling is None;self.filling=[(self.x,self.y)]
    def end_fill(self):
        assert self.filling is not None
        d='M '+' L '.join(f'{self.n(x)} {self.n(y)}' for x,y in self.filling)+' Z'
        self.elements.append(f'<path d="{d}" fill="{html.escape(self.fillshade)}" stroke="{html.escape(self.shade)}" stroke-width="{self.width}" stroke-linejoin="round"/>')
        self.filling=None
    def circle(self,r,extent=360):
        h=math.radians(self.heading);cx=self.x-r*math.sin(h);cy=self.y+r*math.cos(h)
        a=math.atan2(self.y-cy,self.x-cx);start=self.heading
        count=max(1,math.ceil(abs(extent)/3))
        for i in range(1,count+1):
            delta=extent*(1 if r>=0 else -1)*i/count
            theta=a+math.radians(delta)
            self.setposition(cx+abs(r)*math.cos(theta),cy+abs(r)*math.sin(theta))
        self.heading=start+extent*(1 if r>=0 else -1)
    def hideturtle(self):pass
    def render(self,code,title):
        names=['speed','bgcolor','penup','pendown','setposition','setheading','forward','backward','left','right','color','pensize','begin_fill','end_fill','circle','hideturtle']
        env={n:getattr(self,n) for n in names}
        exec(compile(code,'<pumpkin>','exec'),env)
        self.flush();assert self.filling is None;assert self.elements
        title=html.escape(title)
        return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" role="img" aria-label="{title}"><title>{title}</title><rect width="400" height="400" fill="{html.escape(self.bg)}"/><g transform="translate(200 200) scale(1 -1)">'+''.join(self.elements)+'</g></svg>'


def check_student_code(code):
    """Keep the examples within the vocabulary taught in the first lessons."""
    tree = ast.parse(code)
    banned = (ast.If, ast.While, ast.List, ast.Tuple, ast.Dict, ast.Set,
              ast.Subscript, ast.Attribute, ast.ListComp, ast.Lambda, ast.Import,
              ast.ImportFrom, ast.Return, ast.Mult, ast.Div, ast.Mod, ast.Pow)
    assert not any(isinstance(node,banned) for node in ast.walk(tree))
    functions = {node.name:node for node in tree.body if isinstance(node,ast.FunctionDef)}
    started = False
    for node in tree.body:
        if isinstance(node,ast.FunctionDef):
            assert not started, 'Define functions before the drawing starts.'
            assert len(node.args.args) <= 1
            assert all(arg.arg == 'size' for arg in node.args.args)
        else:
            started = True
    for node in ast.walk(tree):
        if isinstance(node,ast.For):
            assert isinstance(node.iter,ast.Call) and node.iter.func.id == 'range'
            assert len(node.iter.args) == 1 and isinstance(node.iter.args[0],ast.Constant)
            assert not any(isinstance(child,ast.For) for statement in node.body for child in ast.walk(statement)), 'Use one loop at a time.'
        if isinstance(node,ast.Call):
            assert isinstance(node.func,ast.Name)
            if node.func.id in functions:
                assert len(node.args) <= 1
            assert node.func.id not in {'move','disk','box','arc','polygon','line'}
    return tree


def build():
    assert len(stages) == 10
    assert len(designs) == 48
    assert len({d['id'] for d in designs}) == 48
    (ROOT/'previews').mkdir(exist_ok=True)
    for item in stages+designs:
        check_student_code(item['code'])
        recorder = TurtleRecorder()
        svg = recorder.render(item['code'],item['title'])
        (ROOT/item['preview']).write_text(svg)
        if recorder.bounds:
            xs,ys = zip(*recorder.bounds)
            assert min(xs)>=-200.001 and max(xs)<=200.001 and min(ys)>=-200.001 and max(ys)<=200.001, (item['id'],min(xs),max(xs),min(ys),max(ys))
    keep = {item['preview'].split('/')[-1] for item in stages+designs}
    for preview in (ROOT/'previews').glob('step-*.svg'):
        if preview.name not in keep:
            preview.unlink()
    legacy = json.loads((ROOT/'legacy-hashes.json').read_text())
    (ROOT/'data.json').write_text(json.dumps(dict(revision='beginner-2026-10',legacyHashes=legacy,stages=stages,designs=designs),ensure_ascii=False,indent=2)+'\n')
    print(f'Built and executed {len(stages)} tutorial checkpoints and {len(designs)} variations; all drawings fit the 400 × 400 world and pass the beginner-code checks.')


if __name__ == '__main__':
    build()
