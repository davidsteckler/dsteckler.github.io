"""Author Pumpkin Studio data and preview every program by executing its Turtle calls."""
from pathlib import Path
import json
import math
import html

ROOT = Path(__file__).parent

BODY = '''speed(6)
bgcolor("black")

# The circle starts at its bottom edge.
penup()
setposition(0, -140)
setheading(0)
pendown()
color("darkorange")
begin_fill()
circle(140)
end_fill()'''

TRIANGLE = '''def triangle():
    color("white")
    begin_fill()
    for i in range(3):
        forward(50)
        left(120)
    end_fill()'''

SMALL = '''def small_triangle():
    color("white")
    begin_fill()
    for i in range(3):
        forward(30)
        left(120)
    end_fill()'''

LEFT_EYE = '''penup()
setposition(-75, 35)
setheading(0)
pendown()
triangle()'''
RIGHT_EYE = '''penup()
setposition(25, 35)
setheading(0)
pendown()
triangle()'''
NOSE = '''penup()
setposition(15, -12)
setheading(180)
pendown()
small_triangle()'''
STEM = '''# A rectangle: two long sides and two short sides.
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
TOOTH_START = '''penup()
setposition(90, -44)
setheading(180)
pendown()'''
TEETH = TOOTH_START + '''
for i in range(6):
    small_triangle()
    penup()
    forward(30)
    pendown()'''

def combine(*parts):
    return '\n\n'.join(p.strip() for p in parts if p).strip() + '\n'

FINAL = combine(BODY, TRIANGLE, SMALL, LEFT_EYE, RIGHT_EYE, NOSE, STEM, TEETH, 'hideturtle()')

EYE_RAW = '''# One filled triangle, before we turn it into a function.
penup()
setposition(-75, 35)
setheading(0)
pendown()
color("white")
begin_fill()
forward(50)
left(120)
forward(50)
left(120)
forward(50)
left(120)
end_fill()'''

stages = []
def stage(id, title, skill, instruction, why, snippet, code, expected, predict, answer, experiment, focus):
    stages.append(dict(id=id, title=title, skill=skill, instruction=instruction, why=why,
                       snippet=snippet, code=code, expected=expected, predict=predict,
                       answer=answer, experiment=experiment, focus=focus,
                       preview=f'previews/step-{id}.svg'))

OUTLINE = '''speed(6)
bgcolor("black")

penup()
setposition(0, -140)
setheading(0)
pendown()
color("darkorange")
circle(140)'''
stage('circle', 'Draw the pumpkin outline', 'Position + circle',
      'Start with the outline. Type this program in the editor, then press Run.',
      'Our world runs from −200 to 200. A circle is drawn to Tracy’s left. Facing right at (0, −140) puts its center at (0, 0).',
      OUTLINE, combine(OUTLINE), 'One orange circle centered in the black world.',
      'Why is the starting y value −140 instead of 0?',
      'circle(140) starts on the edge, 140 pixels below the center. Starting at (0, 0) would put the center at (0, 140), partly outside the world.',
      'Change circle(140) to circle(100). Notice that its bottom stays in the same place.', ['circle(140)', 'setposition(0, -140)'])
stage('fill', 'Fill the circle', 'Color + fill',
      'Put begin_fill() immediately before circle(140), and end_fill() immediately after it.',
      'color() sets the outline and fill color. begin_fill() records a shape; end_fill() fills that shape.',
      'color("darkorange")\nbegin_fill()\ncircle(140)\nend_fill()', combine(BODY),
      'A solid orange pumpkin body.', 'What happens if you leave out end_fill()?',
      'The outline is drawn, but the fill is never completed.',
      'Try color("orange") or color("#f97316"). Keep the quotation marks.', ['begin_fill()', 'end_fill()'])
stage('eye', 'Draw one triangle eye', 'Pen up + turning',
      'Add this after the body. Move with the pen up so there is no line from the pumpkin’s bottom to the eye.',
      'Each side is 50 pixels. Tracy turns 120° at each corner: three exterior turns add up to 360°.',
      EYE_RAW, combine(BODY, EYE_RAW), 'One white triangle on the left side of the face.',
      'Would left(60) close this three-sided shape?',
      'No. Tracy needs an exterior turn of 120°. The inside angle of an equilateral triangle is 60°.',
      'Move the eye: change −75 to −95. Negative x values move left.', ['setposition(-75, 35)', 'left(120)'])
stage('two-eyes', 'Give it a second eye', 'Reuse + coordinates',
      'Replace the long eye instructions with triangle(), then call it at two different positions.',
      'The definition saves the drawing instructions. Calling triangle() runs them. setheading(0) gives each eye the same starting direction.',
      combine(TRIANGLE, LEFT_EYE, RIGHT_EYE), combine(BODY, TRIANGLE, LEFT_EYE, RIGHT_EYE),
      'Two matching white triangle eyes.', 'Does defining triangle() draw an eye by itself?',
      'No. The indented instructions run when Python reaches a triangle() call.',
      'Change forward(50) inside the function to forward(40). Both eyes shrink.', ['def triangle():', 'triangle()'])
stage('nose', 'Add an upside-down nose', 'Direction + functions',
      'Add a smaller triangle function. Move to (15, −12), face left, and call it once.',
      'This triangle uses 30-pixel sides. Starting at 180° turns the same left-turn triangle upside down.',
      combine(SMALL, NOSE), combine(BODY, TRIANGLE, SMALL, LEFT_EYE, RIGHT_EYE, NOSE),
      'Two eyes and a small downward-pointing nose.', 'What would setheading(0) do to the nose?',
      'It would point up and extend to the right from (15, −12). Heading changes both the direction and where the triangle lands.',
      'Change the nose’s y value from −12 to 0 to move it up.', ['setheading(180)', 'forward(30)'])
stage('stem', 'Build the green stem', 'Rectangle + loop',
      'Add a green filled rectangle at the top of the pumpkin.',
      'The loop repeats a short side, a corner, a long side, and a corner twice. The stem overlaps the body slightly so the pieces connect.',
      STEM, combine(BODY, TRIANGLE, SMALL, LEFT_EYE, RIGHT_EYE, NOSE, STEM),
      'A green stem attached to the top.', 'Why does range(2) draw four sides?',
      'Each repeat draws two sides. Two repeats × two sides = four sides.',
      'Change forward(48) to forward(36) for a shorter stem.', ['for i in range(2):', 'forward(48)'])
stage('one-tooth', 'Try one tooth', 'Reuse a smaller shape',
      'Move to the right end of the mouth, face left, and reuse small_triangle().',
      'The nose and this tooth use the same function. Position and heading give the same shape a different job.',
      combine(TOOTH_START, 'small_triangle()'), combine(BODY, TRIANGLE, SMALL, LEFT_EYE, RIGHT_EYE, NOSE, STEM, TOOTH_START, 'small_triangle()'),
      'One downward-pointing tooth below the right eye.', 'Will this tooth be the same size as the nose?',
      'Yes. Both calls use small_triangle(), whose sides are 30 pixels.',
      'Try a tooth at (0, −44). Set the position before calling the function.', ['setposition(90, -44)', 'small_triangle()'])
stage('teeth', 'Repeat a whole row of teeth', 'For loop + spacing',
      'Replace the single tooth call with this loop. Keep the positioning lines above it.',
      'Each repeat draws a tooth and moves 30 pixels left. The pen goes up for the move and down for the next tooth.',
      TEETH, combine(BODY, TRIANGLE, SMALL, LEFT_EYE, RIGHT_EYE, NOSE, STEM, TEETH),
      'Six connected triangular teeth across the face.', 'What changes if forward(30) becomes forward(35)?',
      'The teeth keep their 30-pixel sides, but their starting points are 35 pixels apart. Five-pixel gaps appear.',
      'Try range(5), then range(7). The row starts at the same place and grows toward the left.', ['for i in range(6):', 'forward(30)'])
stage('finish', 'Finish your jack-o’-lantern', 'Read the whole program',
      'Add hideturtle() at the end. Run the complete drawing and compare it with the target.',
      'The drawing is built in layers: body, eyes, nose, stem, then teeth. hideturtle() removes Tracy’s marker after her work is done.',
      'hideturtle()', FINAL,
      'The complete pumpkin from this tutorial.', 'Does hideturtle() erase the picture?',
      'No. It hides Tracy’s marker. The shapes she drew stay on the canvas.',
      'Use speed(0) for an instant drawing. Use speed(3) to watch the movements.', ['hideturtle()'])
stage('remix', 'Make your own version', 'Change + explain',
      'Choose a variation below, or change your own pumpkin. Make three changes you can point to in the code.',
      'Try one change at a time. Run, look at the result, and decide what to change next. You can return to any saved draft.',
      '# Ideas to try:\n# 1. A new body or background color\n# 2. Different eye positions or sizes\n# 3. A different tooth count or spacing', FINAL,
      'A pumpkin with choices you can explain.', 'Which function would you change to resize both eyes?',
      'triangle(). Both eyes call that function, so changing its side length affects both eyes.',
      'Pick a gallery design and add a detail of your own. Explain which commands make it appear.', ['def triangle():', 'for i in range(6):'])

HELPERS = {
    'move': ([], '''def move(x, y):
    penup()
    setposition(x, y)
    setheading(0)
    pendown()'''),
    'disk': (['move'], '''def disk(x, y, radius, shade):
    move(x, y - radius)
    color(shade)
    begin_fill()
    circle(radius)
    end_fill()'''),
    'box': (['move'], '''def box(x, y, width, height, shade):
    move(x, y)
    color(shade)
    begin_fill()
    for i in range(2):
        forward(width)
        left(90)
        forward(height)
        left(90)
    end_fill()'''),
    'triangle': (['move'], '''def triangle(x, y, side, heading, shade):
    move(x, y)
    setheading(heading)
    color(shade)
    begin_fill()
    for i in range(3):
        forward(side)
        left(120)
    end_fill()'''),
    'arc': (['move'], '''def arc(x, y, heading, radius, extent, shade, thickness):
    move(x, y)
    setheading(heading)
    color(shade)
    pensize(thickness)
    circle(radius, extent)
    pensize(1)'''),
    'line': (['move'], '''def line(x, y, heading, length, shade, thickness):
    move(x, y)
    setheading(heading)
    color(shade)
    pensize(thickness)
    forward(length)
    pensize(1)'''),
    'polygon': (['move'], '''def polygon(points, shade):
    move(points[0][0], points[0][1])
    color(shade)
    begin_fill()
    for point in points[1:]:
        setposition(point[0], point[1])
    setposition(points[0][0], points[0][1])
    end_fill()'''),
    'star': (['move'], '''def star(x, y, side, shade):
    move(x, y)
    setheading(72)
    color(shade)
    begin_fill()
    for i in range(5):
        forward(side)
        right(144)
    end_fill()'''),
    'heart': (['disk','triangle'], '''def heart(x, y, size, shade):
    disk(x - size / 4, y, size / 3, shade)
    disk(x + size / 4, y, size / 3, shade)
    triangle(x + size / 2, y, size, 180, shade)''')
}

class Program:
    def __init__(self, bg='#101b22'):
        self.bg, self.lines, self.used = bg, [], []
    def need(self, name):
        for dep in HELPERS[name][0]: self.need(dep)
        if name not in self.used: self.used.append(name)
    def call(self, name, *args):
        self.need(name)
        self.lines.append(name + '(' + ', '.join(json.dumps(a) for a in args) + ')')
    def add(self, text): self.lines.append(text)
    def code(self):
        return combine('speed(0)\nbgcolor('+json.dumps(self.bg)+')',
                       *[HELPERS[n][1] for n in self.used], '\n'.join(self.lines), 'hideturtle()')

ORANGE='#ff9500'; WHITE='#fff4d0'; INK='#20212b'; GREEN='#487c43'
def body(p, shade=ORANGE, x=0, y=0, r=134, ribs=False):
    p.call('disk',x,y,r,shade)
    if ribs:
        for offset in [-44, 44]:
            p.call('arc',x+offset-20,y-102,15,118,148,'#dc7210',2)
    p.call('box',x-13,y+r-4,26,43,GREEN)
def eyes(p, x=0,y=0,scale=1,kind='triangle',shade=WHITE):
    if kind=='triangle':
        for dx in [-72,27]: p.call('triangle',x+dx*scale,y+32*scale,45*scale,0,shade)
    else:
        for dx in [-48,48]: p.call('disk',x+dx*scale,y+48*scale,18*scale,shade)
def smile(p,x=0,y=0,s=1,shade=WHITE):
    p.call('arc',x-49*s,y-33*s,270,49*s,180,shade,8*s)
def face(p, kind='classic', x=0, y=0, s=1, shade=WHITE):
    if kind=='classic':
        eyes(p,x,y,s,shade=shade)
        p.call('triangle',x+13*s,y-10*s,26*s,180,shade)
        for i in range(6): p.call('triangle',x+(84-i*28)*s,y-43*s,28*s,180,shade)
    elif kind=='smile': eyes(p,x,y,s,'round',shade);smile(p,x,y,s,shade)

designs=[]
def design(id,title,category,description,experiment,p,focus='',level='Medium'):
    code=p if isinstance(p,str) else p.code()
    designs.append(dict(id=id,title=title,category=category,description=description,
                        experiment=experiment,code=code,focus=focus,level=level,
                        preview=f'previews/{id}.svg'))

design('original','The original','Faces','The triangle-eyed pumpkin from the tutorial.',
       'Change range(6) to range(5). Predict which end of the tooth row gets shorter.',FINAL.replace('speed(6)','speed(0)'), 'for i in range(6):')
for kind,title,desc,task in [
    ('smile','Big smile','Round eyes and a wide curved smile.','Change the smile’s thickness from 8 to 14.'),
    ('surprised','Surprised','Three circles make a surprised expression.','Change the mouth radius from 24 to 35.'),
    ('sleepy','Sleepy','Curved eyelids and a tiny sleeping mouth.','Change the eye arc extent from 180 to 120.'),
    ('angry','Angry eyebrows','Slanted eyebrows change the same round eyes.','Reverse the two eyebrow headings to soften the expression.'),
    ('wink','One wink','One open eye, one closed eye, and a smile.','Move the winking eye up by changing its y value.'),
    ('vampire','Vampire','A dark mouth with two bright fangs.','Change both fang side lengths from 27 to 36.'),
    ('cat','Cat face','Pointed ears, whiskers, and small round eyes.','Change the whisker lengths from 38 to 50.'),
    ('robot','Robot face','Square eyes and a gridded robot mouth.','Change the number of vertical mouth lines.'),
    ('zipper','Zipper smile','A diagonal mouth with repeated stitches.','Change the stitch spacing from 22 to 18.'),
    ('hearts','Heart eyes','Two hearts above a curved smile.','Change both heart sizes from 42 to 50.'),
    ('goofy','Goofy grin','Different-sized eyes and two square teeth.','Swap the two eye radii and watch the expression change.')]:
    p=Program();body(p)
    if kind=='smile': face(p,'smile')
    elif kind=='surprised': eyes(p,kind='round');p.call('disk',0,-43,24,WHITE);p.call('disk',0,-43,14,INK)
    elif kind=='sleepy':
        for x in [-70,27]: p.call('arc',x,49,270,22,180,WHITE,7)
        p.call('disk',0,-43,12,WHITE)
    elif kind=='angry':
        eyes(p,kind='round');p.call('line',-78,87,340,55,INK,10);p.call('line',27,68,20,55,INK,10)
        p.call('line',-32,-52,0,64,WHITE,8)
    elif kind=='wink': p.call('disk',-48,48,20,WHITE);p.call('arc',26,48,270,22,180,WHITE,7);smile(p)
    elif kind=='vampire':
        eyes(p,kind='triangle');p.call('box',-65,-69,130,42,INK)
        for x in [-32,57]: p.call('triangle',x,-27,27,180,WHITE)
    elif kind=='cat':
        p.call('triangle',-103,86,65,0,ORANGE);p.call('triangle',39,86,65,0,ORANGE)
        eyes(p,kind='round',shade=INK);p.call('triangle',12,1,24,180,'#eea1a0')
        for y,h in [(-13,170),(-29,180),(-45,190)]: p.call('line',-50,y,h,38,WHITE,3);p.call('line',50,y,180-h,38,WHITE,3)
    elif kind=='robot':
        for x in [-75,28]: p.call('box',x,25,47,43,INK);p.call('box',x+13,37,20,18,'#a9f0dd')
        p.call('box',-68,-72,136,43,INK)
        for i in range(1,5): p.call('line',-68+i*27,-70,90,39,WHITE,2)
        p.call('line',-67,-51,0,134,WHITE,2)
    elif kind=='zipper':
        eyes(p,kind='triangle');p.call('line',-78,-60,10,158,INK,6)
        for i in range(7): p.call('line',-65+i*22,-69+i*4,80,25,INK,4)
    elif kind=='hearts':
        for x in [-48,48]: p.call('heart',x,58,42,'#9e2844')
        smile(p,shade=INK)
    elif kind=='goofy':
        p.call('disk',-47,48,28,WHITE);p.call('disk',47,47,19,WHITE)
        p.call('disk',-42,46,10,INK);p.call('disk',43,49,7,INK)
        p.call('box',-63,-68,126,42,INK)
        p.call('box',-34,-51,22,25,WHITE);p.call('box',12,-68,22,25,WHITE)
    design(kind,title,'Faces',desc,task,p)

for id,title,shade,bg,face_shade in [
    ('ghost','Ghost pumpkin','#eee8d8','#26332f','#253b38'),
    ('teal','Teal pumpkin','#49aeb0','#10292d','#f8e7b6'),
    ('pink','Pink pumpkin','#eb9bad','#362733','#482a4d'),
    ('purple','Purple pumpkin','#9f80d0','#201c32','#f4df9b'),
    ('green','Green pumpkin','#a1b35b','#1f3025','#263f2a'),
    ('red','Red pumpkin','#d95542','#2c2028','#ffe7bd'),
    ('blue','Blue pumpkin','#689fc7','#1b293a','#f5efd6'),
    ('gold','Golden pumpkin','#dfbc65','#303028','#3f3e26')]:
    p=Program(bg);body(p,shade);face(p,shade=face_shade)
    design(id,title,'Colors','Change the body, background, and face palette together.',
           'Find the first disk() call below the functions. Replace its last value with a color you choose.',p,'disk(0, 0, 134')

for id,title,desc,task in [
    ('dots','Polka dots','Rows of small circles across the pumpkin.','Change the dot radius from 7 to 11.'),
    ('stripes','Vertical stripes','Repeated green stripes on an orange body.','Change range(7) to range(5) and compare the spacing.'),
    ('patchwork','Patchwork','Warm-colored square patches with stitched edges.','Try different colors in the three box() calls.'),
    ('stars','Star-covered','Small gold stars across a purple pumpkin.','Change star sizes from 24 to 32.'),
    ('checker','Checker pattern','Nested loops draw a checker pattern.','Change the row and column counts separately.'),
    ('rings','Concentric rings','Repeated outlines inside the pumpkin body.','Change the three ring radii.'),
    ('rainbow','Rainbow stripes','Seven colored bands cross the pumpkin.','Change the order of the colors in the list.'),
    ('spiral','Spiral pumpkin','A growing spiral is drawn with a loop.','Change right(16) to right(22).')]:
    p=Program();body(p,'#9772bf' if id=='stars' else ORANGE)
    if id=='dots':
        p.need('disk');p.add('for row in range(4):\n    for col in range(5):\n        disk(-78 + col * 39, -78 + row * 45, 7, "#ffd375")')
    elif id=='stripes':
        p.need('box');p.add('for i in range(7):\n    box(-84 + i * 26, -88, 11, 176, "#d57719")')
    elif id=='patchwork':
        for x,y,s,c in [(-95,-65,57,'#f9b145'),(38,8,54,'#cd6945'),(-20,-100,42,'#e6bd68')]:
            p.call('box',x,y,s,s,c)
            for i in range(3):p.call('line',x+8+i*17,y-4,90,10,INK,2);p.call('line',x+8+i*17,y+s-5,90,10,INK,2)
    elif id=='stars':
        for x,y in [(-85,40),(-25,83),(57,57),(-65,-63),(24,-67)]:p.call('star',x,y,24,'#fbe5a4')
    elif id=='checker':
        p.need('box');p.add('for row in range(5):\n    for col in range(5):\n        if (row + col) % 2 == 0:\n            box(-85 + col * 34, -85 + row * 34, 34, 34, "#db7627")')
    elif id=='rings':
        for r in [112,91,69]:p.call('arc',0,-r,0,r,360,'#da741a',3)
    elif id=='rainbow':
        p.need('box');p.add('colors = ["#e8756f", "#efa363", "#e9ca70", "#8caf73", "#68aeaa", "#6c92ba", "#a488bb"]\nfor i in range(7):\n    box(-94, -84 + i * 24, 188, 24, colors[i])')
    elif id=='spiral':
        p.call('move',0,0);p.add('color("#ffc85a")\npensize(3)\nfor i in range(90):\n    forward(i / 3)\n    right(16)\npensize(1)')
    eyes(p,kind='triangle',shade=INK);smile(p,shade=INK)
    design(id,title,'Patterns',desc,task,p,level='Hard' if id=='checker' else 'Medium')

for id,title,desc,task in [
    ('witch','Witch hat','A pointed purple hat and a wide brim.','Change the hat’s polygon points to make it taller or wider.'),
    ('pirate','Pirate','A dark bandana, an eye patch, and a grin.','Move the eye patch by changing its disk() coordinates.'),
    ('wizard','Starry wizard','A blue hat decorated with golden stars.','Add another star() call to the hat.'),
    ('crown','Pumpkin royalty','A crown with three points and colored jewels.','Change the jewel colors or add a fourth jewel.'),
    ('headphones','Headphones','An arc joins two padded ear cups.','Change the headphone arc thickness from 13 to 20.'),
    ('glasses','Round glasses','Two ring-shaped lenses and a bridge.','Change both outer lens radii together.'),
    ('bowtie','Bow tie','Two triangles meet under the smile.','Change the bow tie color or triangle side length.'),
    ('mummy','Mummy wrap','Pale bands leave a narrow gap for the eyes.','Change the band heights to reveal more of the pumpkin.'),
    ('bat','Bat wings','Two angular wings extend from a smaller body.','Move one wing point and compare the silhouette.'),
    ('alien','Alien antennae','Two stalks end in small glowing circles.','Change the antenna stalk lengths and move the circles to match.'),
    ('unicorn','Unicorn','A striped horn rises above a pink face.','Change the two horn stripe positions.'),
    ('flowers','Flower crown','Little circles cluster around three flower centers.','Change the petal shade and center shade separately.')]:
    p=Program()
    if id=='bat':
        p.call('polygon',[[-65,48],[-183,113],[-167,25],[-130,41],[-111,-24],[-80,2]],'#8262a1')
        p.call('polygon',[[65,48],[183,113],[167,25],[130,41],[111,-24],[80,2]],'#8262a1')
        body(p,r=91);face(p,x=0,y=0,s=.66)
    else:
        body(p,'#e6a0b5' if id=='unicorn' else ORANGE)
        if id not in ['pirate','mummy','glasses']:face(p,'smile')
    if id in ['witch','wizard']:
        p.call('polygon',[[-87,102],[80,102],[-17,189]],'#7557a0' if id=='witch' else '#426692')
        p.call('box',-113,95,226,19,'#503b70' if id=='witch' else '#30496e')
        p.call('box',-62,112,106,12,'#d4ad68')
        if id=='wizard':p.call('star',-36,142,24,'#ffe2a4');p.call('star',9,120,16,'#ffe2a4')
    elif id=='pirate':
        p.call('box',-99,82,198,32,'#992e46');p.call('line',-91,78,340,182,INK,7)
        p.call('disk',-48,44,27,INK);p.call('disk',48,44,19,WHITE);smile(p)
        p.call('disk',-107,92,18,'#992e46');p.call('triangle',-111,85,42,240,'#992e46')
    elif id=='crown':
        p.call('polygon',[[-78,106],[-86,168],[-40,141],[0,187],[40,141],[86,168],[78,106]],'#e6bf61')
        for x,c in [(-48,'#c85264'),(0,'#558c9e'),(48,'#77a36d')]:p.call('disk',x,121,7,c)
    elif id=='headphones':
        p.call('arc',-143,5,90,-143,180,'#6d7a9f',13)
        p.call('box',-151,-29,26,73,'#8e9fc7');p.call('box',125,-29,26,73,'#8e9fc7')
    elif id=='glasses':
        eyes(p,kind='round',shade=INK);smile(p,shade=INK)
        for x in [-48,48]:p.call('arc',x,10,0,38,360,'#433d44',6)
        p.call('line',-10,48,0,20,INK,6);p.call('line',-112,54,0,26,INK,5);p.call('line',86,54,0,26,INK,5)
    elif id=='bowtie':
        p.call('triangle',-50,-93,52,270,'#a84051');p.call('triangle',50,-145,52,90,'#a84051');p.call('disk',0,-119,12,'#702f41')
    elif id=='mummy':
        for x,y,w,h in [(-84,86,168,26),(-112,57,224,24),(-123,-8,246,26),(-112,-40,224,27),(-89,-73,178,27),(-62,-103,124,25)]:p.call('box',x,y,w,h,'#e8dfc6')
        for x in [-45,45]:p.call('disk',x,36,16,INK);p.call('disk',x+3,39,5,'#d2e6be')
    elif id=='alien':
        p.call('line',-58,116,112,58,'#93c476',7);p.call('line',58,116,68,58,'#93c476',7)
        p.call('disk',-80,170,13,'#c8eb94');p.call('disk',80,170,13,'#c8eb94')
    elif id=='unicorn':
        p.call('polygon',[[-23,111],[0,188],[23,111]],'#f3df9e')
        p.call('line',-13,140,348,26,'#cf9ac1',5);p.call('line',-7,161,348,15,'#cf9ac1',4)
    elif id=='flowers':
        for x,y,c in [(-65,116,'#df8c9c'),(0,137,'#c4b0d9'),(65,116,'#e6ce79')]:
            for dx,dy in [(-14,0),(14,0),(0,14),(0,-14)]:p.call('disk',x+dx,y+dy,12,c)
            p.call('disk',x,y,8,'#f8e8b9')
    design(id,title,'Costumes',desc,task,p,level='Hard' if id in ['witch','wizard','crown','bat'] else 'Medium')

for id,title,desc,task in [
    ('twins','Pumpkin twins','A pair of small pumpkins share the world.','Change the x values to move the pumpkins closer together.'),
    ('family','Pumpkin family','Three sizes sit along the same ground line.','Change the small pumpkin’s radius and move its face to match.'),
    ('patch','Pumpkin patch','A loop plants a row of little pumpkins.','Change the number of pumpkins and the distance between them.'),
    ('moon','Under the moon','A crescent moon and stars above a pumpkin.','Move the crescent’s two disks together to a new location.'),
    ('web','Spiderweb corner','Spokes and connecting lines build a corner web.','Change the number of web rings from 3 to 4.'),
    ('leaves','Autumn leaves','Colored diamond-shaped leaves frame the pumpkin.','Change the leaf colors or their four points.'),
    ('stack','Pumpkin stack','Three pumpkins get smaller as they stack up.','Change the face of the middle pumpkin.'),
    ('glow','Lantern glow','Warm circles behind the body suggest a soft glow.','Change the three glow colors to a cooler palette.')]:
    p=Program('#18242c')
    if id=='twins':
        for x in [-93,93]:body(p,x=x,y=-25,r=79);face(p,'smile',x=x,y=-25,s=.55)
    elif id=='family':
        for x,y,r,s in [(-107,-34,73,.48),(46,-5,100,.67),(137,-72,36,.24)]:body(p,x=x,y=y,r=r);face(p,'smile',x=x,y=y,s=s)
        p.call('line',-185,-110,0,370,'#78915d',4)
    elif id=='patch':
        p.call('box',-200,-200,400,128,'#384938');p.need('disk');p.need('box');p.need('triangle')
        p.add('for i in range(5):\n    x = -152 + i * 76\n    disk(x, -70, 32, "#ef922b")\n    box(x - 4, -40, 8, 16, "#60834f")\n    triangle(x - 18, -63, 12, 0, "#fff0b8")\n    triangle(x + 7, -63, 12, 0, "#fff0b8")')
        for x,y in [(-150,100),(-40,148),(105,95)]:p.call('star',x,y,20,'#d9d9ad')
    elif id=='moon':
        p.call('disk',-120,132,43,'#f4df9e');p.call('disk',-102,146,39,p.bg)
        for x,y in [(62,150),(130,102),(4,122)]:p.call('star',x,y,18,'#f1dfad')
        body(p,x=10,y=-36,r=104);face(p,x=10,y=-36,s=.7)
    elif id=='web':
        body(p,x=-18,y=-21,r=111);face(p,x=-18,y=-21,s=.76)
        for x,y in [(45,190),(86,83),(190,45)]:p.call('line',190,190,math.degrees(math.atan2(y-190,x-190)),math.hypot(x-190,y-190),'#a4b5b2',2)
        p.need('line');p.add('for i in range(1, 4):\n    d = i * 43\n    line(190 - d, 190, 315, d * 0.6, "#a4b5b2", 2)\n    line(190 - d * 0.576, 190 - d * 0.424, 315, d * 0.6, "#a4b5b2", 2)')
        p.call('line',158,131,270,48,'#a4b5b2',2);p.call('disk',158,74,9,'#bdc9c1')
        for h in [25,65,115,155,205,245,295,335]:p.call('line',158,74,h,19,'#bdc9c1',2)
    elif id=='leaves':
        body(p,r=111);face(p,s=.8)
        for x,y,c in [(-157,108,'#c77740'),(148,94,'#d2ad59'),(-153,-102,'#9d684f'),(150,-98,'#99a66b')]:
            p.call('polygon',[[x,y+25],[x+14,y],[x,y-25],[x-14,y]],c);p.call('line',x,y-27,90,51,'#544931',2)
    elif id=='stack':
        for x,y,r,s in [(0,-103,79,.5),(-6,25,57,.37),(0,117,40,.25)]:body(p,x=x,y=y,r=r);face(p,'smile',x=x,y=y,s=s)
    elif id=='glow':
        for r,c in [(183,'#30281e'),(165,'#4d351d'),(148,'#79501e')]:p.call('disk',0,0,r,c)
        body(p,r=125);face(p,shade='#ffea92')
    design(id,title,'Scenes',desc,task,p,level='Hard')

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

def build():
    assert len(designs)==48, len(designs)
    assert len({d['id'] for d in designs})==48
    (ROOT/'previews').mkdir(exist_ok=True)
    for item in stages+designs:
        recorder=TurtleRecorder()
        svg=recorder.render(item['code'],item['title'])
        (ROOT/item['preview']).write_text(svg)
        if recorder.bounds:
            xs,ys=zip(*recorder.bounds)
            assert min(xs)>=-200.001 and max(xs)<=200.001 and min(ys)>=-200.001 and max(ys)<=200.001, (item['id'],min(xs),max(xs),min(ys),max(ys))
    (ROOT/'data.json').write_text(json.dumps(dict(stages=stages,designs=designs),ensure_ascii=False,indent=2)+'\n')
    print(f'Built and executed {len(stages)} tutorial checkpoints and {len(designs)} variations; all drawings fit the 400 × 400 world.')

if __name__=='__main__':build()
