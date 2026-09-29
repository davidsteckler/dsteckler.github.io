"""Revised gallery artwork, kept as readable Python source.

Whole-number coordinates position larger pieces. Arcs, loops and dimensions
supply the detail so outlines do not need long lists of traced points.
"""
from textwrap import dedent
import ast

HELPERS='''
import math
speed(0)
def disc(x, y, radius, shade):
    penup()
    goto(x, y)
    dot(radius * 2, shade)

def path(points, shade, width=3):
    penup()
    goto(points[0][0], points[0][1])
    color(shade)
    pensize(width)
    pendown()
    for point in points[1:]:
        goto(point[0], point[1])
    penup()

def fill(points, shade):
    pensize(1)
    penup()
    goto(points[0][0], points[0][1])
    color(shade)
    pendown()
    begin_fill()
    for point in points[1:]:
        goto(point[0], point[1])
    goto(points[0][0], points[0][1])
    end_fill()
    penup()

def rect(x, y, width, height, shade):
    penup()
    goto(x, y)
    setheading(0)
    color(shade)
    pendown()
    begin_fill()
    for side in range(2):
        forward(width)
        left(90)
        forward(height)
        left(90)
    end_fill()
    penup()

def oval(x, y, width, height, shade):
    penup()
    goto(x + width, y)
    color(shade)
    pendown()
    begin_fill()
    for angle in range(0, 361, 5):
        radians = math.radians(angle)
        goto(x + width * math.cos(radians),
             y + height * math.sin(radians))
    end_fill()
    penup()

def arc(x, y, heading, radius, angle, shade, width=3):
    penup()
    goto(x, y)
    setheading(heading)
    color(shade)
    pensize(width)
    pendown()
    circle(radius, angle)
    penup()
'''

def program(body):
    source=dedent(HELPERS).strip()+'\n\n'+dedent(body).strip()+'\nhideturtle()'
    # A straight starting position does not need a fake zero-radius arc.
    expanded=[]
    for line in source.splitlines():
        if line.strip().startswith('arc('):
            call=ast.parse(line.strip()).body[0].value
            if len(call.args)==7 and all(isinstance(a,ast.Constant) and a.value==0 for a in call.args[3:5]):
                x,y,heading,_,_,shade,width=map(ast.unparse,call.args)
                indent=line[:len(line)-len(line.lstrip())]
                expanded.extend(indent+s for s in ['penup()',f'goto({x}, {y})',f'setheading({heading})',f'color({shade})',f'pensize({width})','pendown()'])
                continue
        expanded.append(line)
    source='\n'.join(expanded)
    tree=ast.parse(source)
    functions={n.name:n for n in tree.body if isinstance(n,ast.FunctionDef)}
    used=set()
    def visit(nodes):
        for root in nodes:
            for n in ast.walk(root):
                if isinstance(n,ast.Call) and isinstance(n.func,ast.Name) and n.func.id in functions and n.func.id not in used:
                    used.add(n.func.id);visit([functions[n.func.id]])
    visit([n for n in tree.body if not isinstance(n,ast.FunctionDef)])
    lines=source.splitlines()
    for n in sorted((f for name,f in functions.items() if name not in used),key=lambda n:n.lineno,reverse=True):
        del lines[n.lineno-1:n.end_lineno]
    source='\n'.join(lines)
    if 'math.' not in source:source=source.replace('import math\n','')
    while '\n\n\n' in source:source=source.replace('\n\n\n','\n\n')
    return source.strip()

ART={}
def draw(id,body,desc=None):ART[id]={'code':program(body),**({'desc':desc} if desc else {})}

draw('curatedE17','''
bgcolor("lightblue")
# Rain and a puddle sit behind the umbrella.
for x in range(-180, 181, 60):
    for y in range(-130, 171, 60):
        arc(x, y, 250, 0, 0, "aliceblue", 3)
        pendown()
        forward(18)
oval(20, -170, 100, 10, "#8cbbc7")
# The shaft reaches all the way to the top of the canopy.
arc(0, 155, 270, 0, 0, "#375c6b", 8)
pendown()
forward(280)
circle(25, 180)
forward(20)
# One continuous canopy: a dome with four scalloped edges.
penup()
goto(-140, 25)
setheading(90)
color("#d99b38")
fillcolor("#f2c75c")
pensize(4)
pendown()
begin_fill()
circle(-140, 180)
left(180)
for scallop in range(4):
    circle(35, 180)
    left(180)
end_fill()
# Ribs attach to the same top point and the scallop joins.
for x in [-70, 0, 70]:
    path([(0, 165), (x, 25)], "#c38b36", 3)
disc(0, 165, 7, "#375c6b")
''','A complete scalloped canopy, connected shaft, and curved handle')

draw('curatedC6','''
bgcolor("#f1eee5")
# An upper semicircle connects both ear cups.
arc(-110, 0, 90, -110, 180, "#294958", 20)
arc(-95, 0, 90, -95, 180, "#729aa1", 8)
for x in [-110, 110]:
    arc(x, 5, 270, 0, 0, "#294958", 12)
    pendown()
    forward(50)
    rect(x-25, -105, 50, 85, "#294958")
    rect(x-17, -96, 34, 66, "#8eb5b9")
    rect(x-10, -88, 20, 50, "#aacdcd")
arc(110, -105, 270, 30, 160, "#557a84", 4)
''','An arched headband joins two padded ear cups')

draw('curatedC21','''
bgcolor("#edf1e9")
# Draw one continuous U, with the opening at the top.
penup()
goto(-85, 100)
setheading(270)
color("#80979f")
pensize(45)
pendown()
forward(115)
circle(85, 180)
forward(115)
# Color the poles and add short metal tips.
for x, shade in [(-85, "#d37468"), (85, "#629cae")]:
    arc(x, 35, 90, 0, 0, shade, 45)
    pendown()
    forward(60)
    color("#dce1d9")
    forward(20)
for x in [-30, 0, 30]:
    path([(x, 100), (x, 125)], "#829da4", 3)
''','A U-shaped magnet with two colored poles')

draw('curatedE25','''
bgcolor("#e9f0eb")
rect(-10, -155, 20, 90, "#527e89")
rect(-65, -170, 130, 18, "#426b78")
disc(0, 30, 120, "#c9dfe0")
# Three broad blades rotate around one shared center.
for angle in range(0, 360, 120):
    penup()
    goto(0, 30)
    setheading(angle)
    forward(20)
    color("#79a8b5")
    pensize(40)
    pendown()
    forward(65)
# Every grille ring uses the same center.
for radius in [45, 80, 115]:
    arc(0, 30-radius, 0, radius, 360, "#426b78", 2)
for angle in range(0, 360, 30):
    penup()
    goto(0, 30)
    setheading(angle)
    pendown()
    pensize(1)
    forward(115)
disc(0, 30, 20, "#426b78")
disc(-5, 36, 6, "#99c2c8")
''','Three blades inside a centered circular grille')

draw('curatedC35','''
bgcolor("#123640")
# Each arc shares its center with the signal dot.
for radius in [60, 105, 150]:
    penup()
    goto(0, -85)
    setheading(45)
    forward(radius)
    left(90)
    pendown()
    color("#79cfc1")
    pensize(14)
    circle(radius, 90)
disc(0, -85, 15, "#f3cf83")
''','Three centered arcs spreading upward from the signal dot')

draw('curatedA11','''
bgcolor("#d4e8da")
rect(-200, -200, 400, 55, "#91b28a")
# Long ears overlap the head instead of floating above it.
oval(-40, 80, 25, 90, "#fff6e8")
oval(40, 80, 25, 90, "#fff6e8")
oval(-40, 95, 12, 60, "#eebac3")
oval(40, 95, 12, 60, "#eebac3")
oval(0, -90, 75, 80, "#f2e9dc")
disc(0, -20, 80, "#fff6e8")
for x in [-55, 55]:
    oval(x, -155, 32, 17, "#fff6e8")
for x in [-30, 30]:
    disc(x, -5, 8, "#35474a")
    disc(x-2, -2, 2, "white")
fill([(-10, -30), (10, -30), (0, -40)], "#d98e9d")
path([(0,-40),(0,-50),(-12,-56)], "#8c7371", 2)
path([(0,-50),(12,-56)], "#8c7371", 2)
for side in [-1, 1]:
    for y in [-30, -45]:
        path([(side*35,y),(side*95,y+5)], "#a7988c", 2)
for x in [-150, 140]:
    path([(x,-155),(x,-105)], "#5b966a", 4)
    disc(x,-100,12,"#eeb45f")
''','A seated rabbit with connected long ears, paws, and whiskers')

draw('curatedA15','''
bgcolor("#edf1e2")
rect(-200, -200, 400, 55, "#a0b783")
def mushroom(x, y, size):
    rect(x-size/5, y-size, size*2/5, size, "#f4e2bd")
    # The cap is a half circle resting above the stem.
    penup()
    goto(x+size, y)
    setheading(90)
    color("#d97960")
    pendown()
    begin_fill()
    circle(size, 180)
    left(90)
    forward(size*2)
    end_fill()
    oval(x, y, size, size/6, "#c66150")
    for dx, dy in [(-0.5,0.35),(0,0.65),(0.5,0.35)]:
        disc(x+dx*size,y+dy*size,size/10,"#fff0d1")
mushroom(-100,-65,65)
mushroom(45,-50,90)
mushroom(135,-110,35)
for x in [-170, -20, 170]:
    path([(x,-145),(x+5,-120),(x+10,-145)], "#62865b", 3)
''','Three domed caps with visible stems and pale spots')

draw('curatedB0','''
bgcolor("#143b55")
# Curved tentacles hang from the lower edge of the bell.
for x in [-80, -40, 0, 40, 80]:
    penup()
    goto(x, 25)
    setheading(255)
    pendown()
    color("#dab8df")
    pensize(4)
    for bend in range(3):
        circle(35, 65)
        circle(-35, 65)
# A dome and a scalloped skirt form one continuous bell.
penup()
goto(-100, 20)
setheading(90)
color("#a996d2")
pendown()
begin_fill()
circle(-100, 180)
left(180)
for scallop in range(5):
    circle(20, 180)
    left(180)
end_fill()
arc(-65, 55, 65, -60, 70, "#c9b9e9", 8)
for x,y in [(-140,130),(135,-70),(130,130)]:
    arc(x,y,0,10,360,"#79b7cf",2)
''','A domed jellyfish bell with flowing, connected tentacles')

draw('curatedB24','''
bgcolor("#deeadb")
oval(0,-150,120,14,"#b4c8ad")
disc(0,0,140,"#304b52")
disc(0,0,135,"#fff9e8")
# A central pentagon and five outer patches meet at seam lines.
for angle in range(90,450,72):
    penup()
    goto(0,0)
    setheading(angle)
    forward(55)
    a=xcor()
    b=ycor()
    pendown()
    color("#91a7a5")
    pensize(3)
    forward(75)
    penup()
    goto(a,b)
    right(55)
    pendown()
    forward(70)
penup()
goto(0,55)
setheading(-36)
color("#304b52")
pendown()
begin_fill()
for side in range(5):
    forward(65)
    right(72)
end_fill()
for angle in range(90,450,72):
    penup()
    goto(0,0)
    setheading(angle)
    forward(110)
    right(90)
    backward(20)
    pendown()
    begin_fill()
    for side in range(5):
        forward(35)
        right(72)
    end_fill()
''','A round football with pentagonal patches and connecting seams')

draw('curatedB30','''
bgcolor("#bfd0a8")
def track(radius, shade, width):
    penup()
    goto(-60,-radius)
    setheading(0)
    color(shade)
    pensize(width)
    pendown()
    forward(120)
    circle(radius,180)
    forward(120)
    circle(radius,180)
track(90,"#c97765",60)
for radius in [62,76,90,104,118]:
    track(radius,"#f7dfbe",2)
# A finish line crosses every lane.
path([(-35,-120),(-35,-60)],"#fff6e2",5)
for y in [-112,-98,-84,-70]:
    penup()
    goto(-18,y-4)
    color("#f7ead2")
    write(str((y+126)//14),font=("Arial",8,"normal"))
rect(-45,-30,90,60,"#90b984")
path([(0,-30),(0,30)],"#eff3d8",2)
arc(0,-14,0,14,360,"#eff3d8",2)
''','Four running lanes, a finish line, and a central field')

draw('curatedA38','''
bgcolor("#d9eae4")
rect(-200,-200,400,55,"#a4bf96")
disc(140,130,35,"#f2d9a1")
fill([(-65,-145),(-40,65),(40,65),(65,-145)],"#f1e4c8")
fill([(-55,65),(0,110),(55,65)],"#a07760")
rect(-18,-145,36,55,"#81644f")
rect(-12,-25,24,35,"#74a9b4")
# Rotate the entire blade shape with the turtle's heading.
for angle in [45,135,225,315]:
    penup()
    goto(0,60)
    setheading(angle)
    pendown()
    color("#4f6b71")
    pensize(6)
    forward(125)
    backward(80)
    color("#f7f0dc")
    begin_fill()
    forward(80)
    left(90)
    forward(28)
    left(90)
    forward(80)
    left(90)
    forward(28)
    end_fill()
disc(0,60,14,"#bc8b5d")
''','Four complete sails rotated around the windmill hub')

PALM='''
def palm(x,y,height):
    # A curved trunk ends at the shared center of the fronds.
    arc(x,y,80,height*2,30,"#9b7651",14)
    topx=xcor()
    topy=ycor()
    for angle in [15,50,95,140,175,210]:
        penup()
        goto(topx,topy)
        setheading(angle)
        pendown()
        color("#397c60")
        begin_fill()
        circle(-90,60)
        right(120)
        circle(-90,60)
        end_fill()
    for dx in [-8,8]:
        disc(topx+dx,topy-7,8,"#876240")
'''
draw('curatedB48',PALM+'''
bgcolor("#b3dede")
disc(140,125,40,"#f8dda0")
rect(-200,-200,400,125,"#5da8b7")
oval(0,-115,145,35,"#ead19d")
palm(0,-100,140)
for x in [-150,-65,80]:
    arc(x,-160,20,-45,40,"#c9e9e4",3)
''','A curved palm with broad leaves on a sandy island')
draw('curatedD13',PALM+'''
bgcolor("#efd0a1")
disc(125,125,45,"#ffe3ab")
fill([(-200,-120),(-80,-65),(65,-125),(200,-60),(200,-200),(-200,-200)],"#d6aa76")
oval(40,-120,125,35,"#78b6b8")
oval(40,-125,100,22,"#9ccfd0")
palm(-70,-110,140)
for x in [130,160]:
    path([(x,-120),(x+3,-80)],"#6b9965",5)
''','A palm beside a broad pool among sand dunes')

draw('curatedD34','''
bgcolor("#cce3e5")
# Suspension lines meet a person under the canopy.
for x in [-140,-70,0,70,140]:
    path([(x,45),(0,-85)],"#6b8b91",2)
penup()
goto(-140,45)
setheading(90)
color("#547f98")
pendown()
begin_fill()
circle(-140,180)
left(180)
for scallop in range(4):
    circle(35,180)
    left(180)
end_fill()
for x in [-70,0,70]:
    path([(0,185),(x,45)],"#afc7cc",2)
# A compact figure and a harness.
disc(0,-100,14,"#d7b187")
path([(0,-115),(0,-155)],"#395568",10)
path([(-25,-90),(0,-125),(25,-90)],"#395568",6)
path([(-22,-185),(0,-155),(22,-185)],"#395568",6)
''','A rounded parachute with connected suspension lines and a person')

draw('curatedE0','''
bgcolor("#c3d7ad")
# Two matching circular arcs form pointed ends.
penup()
goto(-155,0)
setheading(45)
color("#955432")
pendown()
begin_fill()
circle(-220,90)
right(90)
circle(-220,90)
end_fill()
# White end stripes follow the ball's curved profile.
for x in [-110,110]:
    path([(x,-35),(x,-12),(x,12),(x,35)],"#f6e7c7",9)
path([(-55,0),(55,0)],"#f6e7c7",5)
for x in range(-40,41,20):
    path([(x,-13),(x,13)],"#f6e7c7",4)
arc(-60,35,10,-150,45,"#b87950",3)
''','A pointed oval with seams and clear white laces')

draw('curatedD1','''
bgcolor("#e9e7f0")
# Mane behind the face, with a horn that joins the forehead.
for x,y,shade in [(-75,60,"#bb9dc9"),(-95,15,"#89b7cb"),(-95,-35,"#e4bb75"),(-70,-75,"#d69bb5")]:
    disc(x,y,35,shade)
fill([(-65,80),(-85,145),(-15,100)],"#fff8e9")
fill([(40,95),(80,145),(78,60)],"#fff8e9")
fill([(-58,92),(-75,125),(-30,100)],"#e9b8c6")
fill([(52,96),(72,125),(68,82)],"#e9b8c6")
fill([(-15,105),(8,180),(30,105)],"#e7c77c")
for y in [125,140,155]:
    path([(y/10-14,y),(28-y/12,y+5)],"#c49f58",2)
oval(12,-15,85,120,"#fff8e9")
oval(45,-65,65,40,"#f3e7df")
arc(20,15,230,25,70,"#46555f",4)
disc(65,-55,5,"#af8c91")
arc(10,-65,280,22,80,"#af8c91",3)
''','A flowing mane, connected ears, striped horn, and soft muzzle')

draw('curatedD6','''
bgcolor("#b7dcdb")
rect(-200,-200,400,70,"#639fa9")
# A sweeping tail narrows toward two joined fins.
fill([(-70,160),(60,160),(55,85),(35,10),(5,-50),(-20,-70),(-55,-40),(-25,5),(-45,80)],"#58a7a1")
fill([(-70,160),(-40,150),(-15,70),(5,0),(-20,-70),(-55,-40),(-25,5),(-45,80)],"#83c6b9")
fill([(-20,-65),(-65,-70),(-140,-125),(-65,-130),(-10,-95)],"#69b5ba")
fill([(-20,-65),(25,-75),(85,-130),(20,-125),(-10,-95)],"#82c8c3")
for row in range(4):
    for col in range(3):
        x=-40+col*25+row*4
        y=120-row*30
        arc(x,y,210,12,120,"#c2e8d6",2)
path([(-20,-70),(-100,-120)],"#45939c",2)
path([(-20,-70),(55,-120)],"#45939c",2)
for x,y in [(-140,75),(135,30),(115,135)]:
    arc(x,y,0,10,360,"#e2f3e8",2)
''','A tapered scaled tail flowing into a connected split fin')

draw('curatedE39','''
bgcolor("#b4dce2")
rect(-200,-200,400,70,"#559aaa")
# A long curved back, short snout, and distinct dorsal fin.
fill([(-165,15),(-130,55),(-80,75),(-25,70),(15,55),(50,25),(85,5),(130,35),(110,-10),(155,-35),(95,-30),(55,-20),(5,-10),(-45,-5),(-95,5),(-130,-5)],"#6297ac")
fill([(-40,65),(-10,115),(10,55)],"#4b8097")
fill([(-30,0),(20,-55),(25,-10)],"#48798c")
path([(-160,15),(-115,10),(-65,0),(0,-10)],"#b9dae0",3)
disc(-130,30,4,"#243e4a")
for x in [-140,80,120]:
    arc(x,-125,60,-25,90,"#e0f1ef",3)
for x in [-100,110]:
    disc(x,-100,5,"#e0f1ef")
''','A leaping dolphin with a long snout, dorsal fin, and splash')

draw('curatedE50','''
bgcolor("#c8e4df")
rect(-200,-200,400,85,"#7ab4bc")
# Tail, body, neck, and head overlap to make one silhouette.
fill([(-100,-30),(-155,10),(-140,-65),(-85,-90)],"#e8b944")
oval(-20,-40,100,70,"#efc65c")
rect(15,-35,50,60,"#efc65c")
disc(45,50,60,"#f2ce68")
oval(-40,-35,50,35,"#dfac43")
fill([(95,50),(165,25),(95,5)],"#e39a46")
path([(100,25),(150,25)],"#c57c36",2)
disc(65,65,7,"#2c4750")
disc(63,68,2,"white")
for x in [-125,80]:
    arc(x,-135,15,-70,40,"#d8eeeb",3)
''','A connected duck silhouette with a bill, wing, and raised tail')

draw('curatedD46','''
bgcolor("#e9e0cc")
# Stacked curved bands form the oval amphitheater.
for y,shade in [(-65,"#b59570"),(-15,"#c3a57d"),(35,"#d1b28a")]:
    oval(0,y,165,50,shade)
    rect(-165,y,330,45,shade)
# Dark archways stay inside each tier.
for y in [-65,-15,35]:
    for x in range(-140,141,35):
        rect(x-10,y,20,25,"#776951")
        disc(x,y+25,10,"#776951")
# An open top shows an inner arena, not a solid disc.
oval(0,80,165,50,"#e1c8a1")
oval(0,80,130,32,"#9d8464")
oval(0,75,95,18,"#c3ac82")
for y in [-72,-22,28]:
    arc(-160,y,0,0,0,"#e0c8a0",5)
    pendown()
    forward(320)
''','An oval amphitheater with three tiers of arches and an open arena')

# A curved croissant with tapered ends and broad overlapping dough segments.
draw('curatedE28','''
bgcolor("#f5eee2")
oval(0,-140,155,15,"#dfd5c5")
# Broad outer crescent, with a smaller background-colored cutout.
penup()
goto(-125,-70)
setheading(80)
color("#b77b41")
pensize(65)
pendown()
circle(-125,160)
penup()
goto(-120,-65)
setheading(80)
color("#e2ae68")
pensize(52)
pendown()
circle(-122,160)
# Taper the two horns into distinct points.
fill([(-150,-55),(-130,-120),(-98,-75)],"#d79b54")
fill([(130,-55),(115,-120),(88,-75)],"#d79b54")
# Curved seams follow the laminated dough.
for x,y,heading in [(-80,10,285),(-30,50,275),(30,50,265),(80,10,255)]:
    arc(x,y,heading,55,70,"#b47b44",4)
    arc(x+6,y+5,heading,55,50,"#f5ce8a",4)
''','A crescent-shaped croissant with tapered horns and curved layers')

# Small repairs preserve the existing drawings while fixing broken connections.
PATCHES={
 'gallery2':[("goto(0,-48)","goto(0,0)"),("forward(139)","forward(175)")],
 'gallery24':[("# Three subtle interior diagonals", "# Three subtle interior diagonals")],
 'curatedF0':[("path([(-166,27),(-29,0)]", "path([(-166,27),(0,0)]")],
}

def revisions(catalog):
    result={k:dict(v) for k,v in ART.items()}
    for p in catalog:
        id=p['id']
        if id=='gallery24':
            code=p['code'].split('# Three subtle interior diagonals')[0].replace('hideturtle()','').rstrip()+'\nhideturtle()'
            result[id]={'code':code,'desc':'Two squares joined at matching corners make a clear wireframe cube'}
        elif id=='gallery2':
            code=p['code']
            for before,after in PATCHES[id]:code=code.replace(before,after)
            result[id]={'code':code}
        elif id=='curatedD0':
            code=p['code'].replace('def fill(points,c):\n    penup()', 'def fill(points,c):\n    pensize(1)\n    penup()')
            start=code.index('# Long curled tail') if '# Long curled tail' in code else code.index('# The tail is a curve')
            stop=code.index('# Left and right',start)
            code=code[:start]+'''# The tail is a curve, controlled by its radius and turn.
penup()
goto(25, -85)
setheading(-10)
color("#487e6c")
pensize(24)
pendown()
forward(60)
circle(50, 135)
penup()
# A pointed tip follows the end of the curve.
color("#b8a172")
pendown()
begin_fill()
for side in range(3):
    forward(25)
    left(120)
end_fill()
penup()
'''+code[stop:]
            result[id]={'code':code,'desc':'A winged dragon with a curved tail, horns, claws, and fire'}
        elif id=='curatedF0':
            # Make the white incident beam meet the prism's actual left edge.
            body='''
bgcolor("#172b40")
fill([(-60,-105),(0,85),(110,-105)],"#87adbd")
fill([(-50,-95),(0,65),(95,-95)],"#bdd8da")
path([(-170,25),(-25,5),(35,-5)],"#fff7d8",5)
for angle,shade in [(25,"#ed6a74"),(15,"#efac60"),(5,"#f3cf78"),(-5,"#82c494"),(-15,"#73bdcb"),(-25,"#9aa8df")]:
    arc(35,-5,angle,0,0,shade,3)
    pendown()
    forward(140)
'''
            result[id]={'code':program(body),'desc':'A white beam enters a glass prism and spreads into colored rays'}
    return result
