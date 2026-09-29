"""Teaching sequences: draw, inspect, repeat, then name tested code.

Full executable programs are the authoring unit. The published files contain
line edits, including replacements, rather than slices of a finished program.
"""
import ast
import copy
import difflib
import json
import subprocess
from pathlib import Path
from lesson_runtime import run

ROOT = Path(__file__).resolve().parent
VERSION = 'art-levels-20260928-1'

def readable(source):
    """Put long coordinate lists on separate lines without changing Python."""
    lines=source.splitlines()
    offsets=[];offset=0
    for line in lines: offsets.append(offset);offset+=len(line)+1
    changes=[]
    for node in ast.walk(ast.parse(source)):
        if not isinstance(node,ast.List) or node.lineno!=node.end_lineno or len(node.elts)<3:continue
        if not all(isinstance(e,ast.Tuple) for e in node.elts):continue
        line=lines[node.lineno-1]
        if len(line)<=88:continue
        indent=' '*(len(line)-len(line.lstrip()))
        value='[\n'+''.join(indent+'    '+ast.unparse(e)+',\n' for e in node.elts)+indent+']'
        changes.append((offsets[node.lineno-1]+node.col_offset,offsets[node.end_lineno-1]+node.end_col_offset,value))
    for a,b,value in sorted(changes,reverse=True):source=source[:a]+value+source[b:]
    return source

def text(nodes):
    if isinstance(nodes, str): return nodes.strip()
    if not isinstance(nodes, list): nodes = [nodes]
    return readable(ast.unparse(ast.fix_missing_locations(ast.Module(body=nodes, type_ignores=[]))).strip())

def join(*parts):
    return '\n\n'.join(text(p) for p in parts if text(p))

def literal(value): return ast.parse(repr(value), mode='eval').body

def friendly(value):
    """Practice coordinates are for typing; the project calls keep exact values."""
    if isinstance(value,float): return round(value,1)
    if isinstance(value,list): return [friendly(x) for x in value]
    if isinstance(value,tuple): return tuple(friendly(x) for x in value)
    if isinstance(value,dict): return {k:friendly(v) for k,v in value.items()}
    return value

def called(node):
    return [n.func.id for n in ast.walk(node) if isinstance(n, ast.Call) and isinstance(n.func, ast.Name)]

class Substitute(ast.NodeTransformer):
    def __init__(self, values): self.values = values
    def visit_Name(self, node):
        if isinstance(node.ctx, ast.Load) and node.id in self.values:
            return ast.copy_location(literal(self.values[node.id]), node)
        return node
    def generic_visit(self, node):
        node = super().generic_visit(node)
        if isinstance(node, (ast.BinOp, ast.UnaryOp, ast.Subscript)) and not any(isinstance(n, (ast.Name, ast.Call, ast.comprehension)) for n in ast.walk(node)):
            try:
                value = eval(compile(ast.fix_missing_locations(ast.Expression(node)), '', 'eval'), {})
                if len(repr(value)) < 250: return ast.copy_location(literal(value), node)
            except Exception: pass
        return node

def substitute(nodes, values):
    return Substitute(values).visit(copy.deepcopy(ast.Module(body=nodes, type_ignores=[]))).body

def unroll(nodes):
    result = []
    for n in nodes:
        if isinstance(n, ast.For):
            try:
                values = list(eval(compile(ast.fix_missing_locations(ast.Expression(n.iter)), '', 'eval'), {}))
                if 1 <= len(values) <= 8 and not any(isinstance(x, (ast.Break, ast.Continue)) for x in ast.walk(n)):
                    for value in values:
                        env = {}
                        exec(text(ast.Assign(targets=[n.target], value=literal(value))), {}, env)
                        result.extend(unroll(substitute(n.body, env)))
                    continue
            except Exception: pass
        result.append(n)
    return result

def units(nodes):
    batch, filling = [], 0
    settings = {'speed','bgcolor','hideturtle','showturtle','color','pencolor','fillcolor','pensize','penup','pendown','setheading','left','right','shape','seed'}
    for node in nodes:
        batch.append(node)
        names = called(node)
        if isinstance(node, ast.Expr):
            if names and names[0] == 'begin_fill': filling += 1
            if names and names[0] == 'end_fill': filling -= 1
        if not filling and (isinstance(node, (ast.For, ast.While, ast.If)) or isinstance(node, ast.Expr) and any(n not in settings for n in names)):
            yield batch
            batch = []
    if batch: yield batch

SHAPES = {'disc':'circle','spot':'circle','fill':'filled shape','polygon':'filled shape','poly':'filled shape',
    'path':'connected line','line':'connected line','rect':'rectangle','rectangle':'rectangle','box':'rectangle',
    'oval':'oval','paint':'curved shape','rope':'curved line','car':'car','flower':'flower','burst':'firework',
    'hexagon':'hexagon','cube':'cube','star':'star','arc':'arc'}

def describe(code):
    calls = [n for n in ast.walk(ast.parse(code)) if isinstance(n, ast.Call) and isinstance(n.func, ast.Name)]
    names = [n.func.id for n in calls]
    if any(n in names for n in ['end_fill','fill','polygon','poly','rect','rectangle','paint']):
        return ('Add a filled shape','The new filled area. Check its edges and position against the step preview.',
            'The coordinates describe the outline in order. begin_fill() starts collecting the outline; end_fill() colors the area inside it.',
            'Why does the order of the corners matter?', 'The turtle joins consecutive corners. Changing their order can make edges cross and change the filled area.')
    for n in reversed(calls):
        name = n.func.id
        if name in {'dot','disc','spot'}:
            return ('Add a circle','The new circle at the chosen coordinate.',
                'dot() draws a filled circle centered on the turtle. Its first input is the diameter: the full width across the circle.',
                'What changes if you double the diameter?', 'The circle becomes twice as wide and twice as tall. Its center stays in the same place.')
        if name == 'circle':
            return ('Draw a curve','The new curve, beginning at the turtle’s current position.',
                'circle(radius) puts the turtle on the edge of a circle. The radius is the distance from the center to the edge. A second input limits the turn in degrees.',
                'How would circle(40, 180) differ from circle(40)?', 'It draws a half-circle. Without the second input, circle(40) draws a full circle.')
        if name == 'write':
            return ('Add the label','The new text at the chosen coordinate.',
                'write() places text at the turtle’s position. align="center" centers the text on that position.',
                'Which input changes the words? Which line moves the label?', 'The first input to write() changes the words. The preceding goto() changes the position.')
    return ('Draw the next line','The new line or connected edges at the coordinates in this block.',
        'goto(x, y) chooses a position: x moves left or right; y moves up or down. penup() lets you reposition without a connecting line. pendown() draws the next movement.',
        'What happens if you leave the pen down while moving to a new starting point?', 'A connecting line appears between the previous position and the new one.')

def changed_text(before, after):
    old = {ast.dump(n) for n in ast.parse(before).body}
    return text([n for n in ast.parse(after).body if ast.dump(n) not in old]) or after

class Lesson:
    def __init__(self, project):
        self.project, self.steps, self.prefix, self.known = project, [], '', set()
        self.functions = {n.name:n for n in ast.parse(project['code']).body if isinstance(n,ast.FunctionDef)}
        self.reference = run(project['code'],capture=True)
        self.samples = self.reference['samples']

    def add(self, code, title=None, instruction=None, explain=None, expected=None, question=None, answer=None,
            help=None, kind='draw', practice=False, remix=False):
        code = text(code)
        if self.steps and code == self.steps[-1]['code'] and not remix: return False
        check = run(code,capture=True)
        if not check['ink']: return False
        dt,de,dx,dq,da = describe(changed_text(self.steps[-1]['code'],code) if self.steps else code)
        same = bool(self.steps and run(self.steps[-1]['code'])['digest']==check['digest'])
        self.steps.append(dict(nav=title or dt,title=title or dt,code=code,kind=kind,
            instruction=instruction or 'Make the edit shown below, then run the whole program.',
            explain=explain or dx,expected=expected or de,question=question or dq,answer=answer or da,
            help=help or 'Check the changed lines first. Keep parentheses and commas in place. Indent each line inside a loop or function by four spaces.',
            practice=practice,remix=remix,sameDrawing=same))
        return True

    def teach_function(self,name):
        if name in self.known: return
        fn = self.functions[name]
        for dep in dict.fromkeys(called(fn)):
            if dep in self.functions and dep != name: self.teach_function(dep)
        sample = friendly(copy.deepcopy(self.samples.get(name)))
        if sample is None: raise ValueError(f'{self.project["id"]}: no exercised example for {name}')
        if name == 'paint':
            self.teach_paint(fn,sample)
            return
        if name == 'oval' and 'rx' in sample:
            self.teach_oval(fn,sample)
            return
        if name in called(fn):
            self.teach_recursion(name,fn,sample)
            return
        if 'points' in sample and len(sample['points'])>7:
            pts = sample['points']
            sample['points'] = [pts[round(i*(len(pts)-1)/5)] for i in range(6)]
        body = substitute(fn.body,sample)
        direct = unroll(body)
        shape = SHAPES.get(name,name.replace('_',' '))
        call = name+'('+', '.join(repr(sample[a.arg]) for a in fn.args.args)+')'
        inline = text(direct)
        outline = [n for n in direct if not (isinstance(n,ast.Expr) and called(n) and called(n)[0] in {'begin_fill','end_fill'})]
        progressive = []
        for part in units(outline):
            progressive.extend(part)
            candidate = join(self.prefix,text(progressive))
            if run(candidate)['ink']>run(self.prefix)['ink']:
                self.add(candidate,'Start one '+shape,
                    'Type this small working example. Run it before adding more.',
                    expected='The first visible part of the '+shape+'. This practice example tests the drawing code you will use next.',practice=True)
                break
        if text(outline)!=inline:
            self.add(join(self.prefix,text(outline)),'Complete the outline',
                explain='Each movement joins one corner to the next. Follow the corner order around the outside of the shape.',
                expected='The complete practice outline. Its inside is still the background color.',practice=True)
        self.add(join(self.prefix,inline),'Finish one '+shape,
            expected='One complete '+shape+'. Check it before making this code reusable.',practice=True)
        if text(body)!=inline:
            self.add(join(self.prefix,text(body)),'Replace repetition with a loop',
                'Replace the repeated movement lines with the loop below. Run and compare.',
                'The for line takes one item from the list at a time. The indented lines run for each item. The loop traces the same points you just wrote separately.',
                'The same practice shape. The code now repeats the movement for you.',
                'Which line repeats? Which value changes on each repeat?',
                'The indented drawing lines repeat. The loop variable takes the next value from the list each time.',kind='loop',practice=True)
        params = ', '.join(a.arg for a in fn.args.args)
        self.add(join(self.prefix,text(fn),call),'Name the '+shape+' code',
            'Replace the tested example with this function and its call. Keep the call at the left edge.',
            f'def {name}({params}) names the code you tested. Its inputs replace the fixed values. The call underneath supplies those values and runs the indented body.',
            'The practice shape should still appear. This step includes both the definition and a call.',
            f'What would happen if you removed the {name}(...) call at the bottom?',
            'The function would be stored, but this example would no longer draw. A definition only runs when it is called.',
            help='End the def line with a colon. Indent the body four spaces and a nested loop another four spaces. Put the call at the left edge.',kind='function',practice=True)
        self.prefix = join(self.prefix,text(fn))
        self.known.add(name)

    def teach_oval(self,fn,s):
        x,y,rx,ry,c=(s[k] for k in ['x','y','rx','ry','c'])
        corners=[(x+rx,y),(x,y+ry),(x-rx,y),(x,y-ry)]
        self.add(join(self.prefix,f'polygon({corners!r}, {c!r})'),'Place four oval points',
            'Start with the right, top, left, and bottom points. Join them with your polygon function.',
            'An oval has a horizontal radius and a vertical radius. These four points show its width and height before we add points between them.',
            'A diamond occupying the oval’s width and height. It is a rough first outline.',
            'Which pair of points controls the width?','The left and right points. Their x-coordinates are the center minus or plus the horizontal radius.',practice=True)
        def outline(count):
            return f'points = []\nfor i in range({count+1}):\n    angle = i * 2 * math.pi / {count}\n    x = {x!r} + {rx!r} * math.cos(angle)\n    y = {y!r} + {ry!r} * math.sin(angle)\n    points.append((x, y))\npolygon(points, {c!r})'
        self.add(join(self.prefix,outline(12)),'Add points between the corners',
            'Replace the four fixed points with a loop that calculates twelve positions.',
            'math.cos(angle) and math.sin(angle) give the horizontal and vertical parts of a position around a circle. Multiplying them by different radii stretches the shape. points.append() saves each calculated pair.',
            'A twelve-sided outline with the same width and height. The corners now look rounder.',
            'What would happen if the horizontal and vertical radii were equal?','The points would form a circle.',kind='loop',practice=True)
        self.add(join(self.prefix,outline(48)),'Smooth the oval',
            'Increase the sample count from 12 to 48 in both places.',
            'More points make shorter straight segments. The full turn still covers 2 × pi radians, so the shape keeps the same size.',
            'A smooth oval in the same position.',
            'Why change the divisor as well as the range?','The angle spacing must match the number of segments so the points cover exactly one full turn.',kind='loop',practice=True)
        # Keep the explicit loop students have just used; avoid introducing a
        # list comprehension as an unexplained one-line rewrite.
        fn=ast.parse('def oval(x, y, rx, ry, c):\n    points = []\n    for i in range(49):\n        angle = i * math.pi / 24\n        points.append((x + rx * math.cos(angle), y + ry * math.sin(angle)))\n    polygon(points, c)').body[0]
        self.functions['oval']=fn
        call='oval('+', '.join(repr(s[a.arg]) for a in fn.args.args)+')'
        self.add(join(self.prefix,text(fn),call),'Name the tested oval code',
            'Put the working calculation in a function. Supply its position, two radii, and color in the call.',
            'The function uses the same point calculation. x and y move the center; rx and ry control the two radii; c supplies the color.',
            'The same oval, now drawn with one call.',
            'Which input would make the oval taller without making it wider?','ry, the vertical radius.',kind='function',practice=True)
        self.prefix=join(self.prefix,text(fn)); self.known.add('oval')

    def teach_paint(self,fn,s):
        start,segments,c=(s[k] for k in ['start','segments','c'])
        corners=[start]+[item[2] for item in segments]
        self.add(join(self.prefix,f'polygon({corners!r}, {c!r})'),'Connect the curve endpoints',
            'First connect the start and endpoints with straight edges.',
            'Each segment has two control points and an endpoint. The endpoint tells the curve where to finish. For this first outline, use only those endpoints.',
            'A rough outline with straight edges. The next steps bend those edges.',
            'Which points must stay fixed if the edges should meet in the same places?','The start and endpoints. The control points can move to change how the edges bend.',practice=True)
        body='pts = [start]\nfor c1, c2, end in segments:\n    x, y = pts[-1]\n    for n in range(1, 13):\n        t = n / 12\n        q = 1 - t\n        px = q*q*q*x + 3*q*q*t*c1[0] + 3*q*t*t*c2[0] + t*t*t*end[0]\n        py = q*q*q*y + 3*q*q*t*c1[1] + 3*q*t*t*c2[1] + t*t*t*end[1]\n        pts.append((px, py))\npolygon(pts, c)'
        # Build one entire curved edge, then repeat the tested calculation.
        first=f'start = {start!r}\nsegments = {segments[:1]!r}\nc = {c!r}\n'+body
        self.add(join(self.prefix,first),'Bend one edge',
            'Use the first segment’s control points. Run this edge by itself before adding the remaining segments.',
            't moves from 1/12 to 1 along the edge; q is the amount remaining. The px and py formulas blend the start, two control points, and endpoint. Twelve calculated points trace the bend.',
            'One curved edge, closed by a straight line back to its start. It is a small test of the curve calculation.',
            'What should happen if you move both control points upward?','The curve should bend upward more strongly. The endpoints stay where they are.',kind='loop',practice=True)
        all_edges=f'start = {start!r}\nsegments = {segments!r}\nc = {c!r}\n'+body
        self.add(join(self.prefix,all_edges),'Repeat for the other edges',
            'Add the remaining segments to the list. Keep the calculation the same.',
            'The outer loop chooses one curved edge. The inner loop calculates twelve points on that edge. pts[-1] makes the next edge start where the previous one ended.',
            'The full curved shape. Look for smooth connections between its edges.',
            'Which loop chooses an edge, and which loop adds points along it?','The segments loop chooses an edge. The range(1, 13) loop calculates its intermediate points.',kind='loop',practice=True)
        # Preserve readable intermediate names in the final function too.
        fn=ast.parse('def paint(start, segments, c):\n'+'\n'.join('    '+line for line in body.splitlines())).body[0]
        self.functions['paint']=fn
        call=f'paint({start!r}, {segments!r}, {c!r})'
        self.add(join(self.prefix,text(fn),call),'Name the working curve code',
            'Put the tested calculation in a function and call it with the same inputs.',
            'paint() now takes a start point, a list of segments, and a color. The shape data changes from call to call; the calculation stays inside the function.',
            'The same curved shape. Future calls can use different outlines.',
            'Which input changes the fill without changing the outline?','The final color input.',kind='function',practice=True)
        self.prefix=join(self.prefix,text(fn)); self.known.add('paint')

    def teach_recursion(self,name,fn,sample):
        depth = next((a for a in ['depth','level'] if a in sample),None)
        base = dict(sample)
        if depth: base[depth] = 1 if name in {'tree','hilbert'} else 0
        elif name=='branch': base['length']=7
        def call(v): return name+'('+', '.join(repr(v[a.arg]) for a in fn.args.args)+')'
        demo_prefix=join(self.prefix,'pendown()')
        env=run(demo_prefix)['env']|base
        def base_case(nodes):
            out=[]
            for n in nodes:
                if isinstance(n,ast.Return): return out,True
                if isinstance(n,ast.If):
                    try:
                        yes=eval(compile(ast.fix_missing_locations(ast.Expression(n.test)),'','eval'),env)
                        part,stop=base_case(n.body if yes else n.orelse)
                        out.extend(part)
                        if stop: return out,True
                        continue
                    except Exception: pass
                if isinstance(n,ast.Expr) and name in called(n): continue
                out.append(n)
            return out,False
        direct,_=base_case(fn.body)
        self.add(join(demo_prefix,text(substitute(direct,base))),'Draw the smallest piece',
            'Run the smallest building block by itself.',
            'This is the piece that remains when the pattern stops subdividing. Check it before adding calls that repeat it.',
            'One building block of the pattern.',
            'Which commands actually leave a mark?','Trace the drawing commands. Turns and movements with the pen up prepare the next mark.',practice=True)
        self.add(join(demo_prefix,text(fn),call(base)),'Test the stopping case',
            'Add the function and its small test call together. Run before increasing the number of levels.',
            'A recursive function calls itself with a smaller problem. The stopping condition ends the repetition. Start with that case to see the smallest piece.',
            'One smallest piece of the pattern. Compare it with this step’s preview.',
            'Which condition stops this function from calling itself again?',
            'Find the if condition near the beginning. The recursive calls move their input toward that stopping condition.',kind='recursion',practice=True)
        deeper=dict(base)
        if depth: deeper[depth]+=1
        else: deeper['length']=10
        self.add(join(demo_prefix,text(fn),call(deeper)),'Add one recursive level',
            'Change only the test call. Predict how many pieces will appear, then run.',
            'The function reaches its recursive calls once more before reaching the stopping case. Each call makes a smaller copy.',
            'The next level of the pattern. Compare the number and size of pieces.',
            'How many smaller calls does one call make?','Count the calls to the function inside its own body. Follow one down to the stopping condition.',kind='recursion',practice=True)
        self.prefix=join(self.prefix,text(fn)); self.known.add(name)

    def single_inner(self,node,base):
        try:
            env=run(base)['env']
            values=list(eval(compile(ast.fix_missing_locations(ast.Expression(node.iter)),'','eval'),env))
            for value in values[:200]:
                code=join(base,text([ast.Assign(targets=[node.target],value=literal(value))]+node.body))
                if run(code)['ink']>run(base)['ink']:
                    self.add(code,'Start with one item',
                        'Use one value for each position variable. Run this small test first.',
                        'A nested loop will build rows of items. This version chooses one position so you can check how one item is drawn.',
                        'One new item. Locate it on the grid before repeating it.')
                    break
        except (SyntaxError,NameError): pass

    def loop_stages(self,node,base):
        try:
            env=run(base)['env']
            values=list(eval(compile(ast.fix_missing_locations(ast.Expression(node.iter)),'','eval'),env))
        except Exception: return
        if len(values)<2: return
        selected=None
        for value in values[:200]:
            assign=ast.Assign(targets=[copy.deepcopy(node.target)],value=literal(value))
            first=join(base,text([assign]+node.body))
            try:
                if run(first)['ink']>run(base)['ink']:
                    selected=value; break
            except (SyntaxError,NameError): return
        if selected is None:
            # A continuous curve needs two consecutive positions to leave ink.
            # Testing isolated iterations would keep lifting the pen each time.
            if not any(isinstance(x,(ast.Break,ast.Continue)) for x in ast.walk(node)):
                two=[]
                for value in values[:2]:
                    two.extend([ast.Assign(targets=[copy.deepcopy(node.target)],value=literal(value))]+node.body)
                first=join(base,text(two))
                if run(first)['ink']>run(base)['ink']:
                    self.add(first,'Connect two calculated points',
                        'Calculate two positions and run the movements in order.',
                        'The first position places the pen. The second position draws a short segment. The changing input moves along the curve.',
                        'One short segment of the curve. Use the step preview to locate it.',
                        'Why do you need two points before a line appears?','A line joins a starting point and an ending point. The first movement only positions the pen.')
            for count in sorted(set([min(8,len(values)),max(2,len(values)//4),len(values)//2])):
                if count>=len(values): continue
                short=copy.deepcopy(node)
                # Keep the original expressions; restrict only the repeat values.
                short.iter=ast.Subscript(value=ast.Call(func=ast.Name(id='list',ctx=ast.Load()),args=[short.iter],keywords=[]),slice=ast.Slice(upper=ast.Constant(count)),ctx=ast.Load())
                candidate=join(base,text(short))
                if run(candidate)['ink']>run(base)['ink']:
                    self.add(candidate,'Draw '+str(count)+' points',
                        'Repeat the tested calculation for this shorter part of the curve.',
                        'The slice selects the first '+str(count)+' values. The equations stay the same; only the number of positions changes.',
                        'A longer section of the curve. Follow how each segment joins the next.',
                        'What changes when you increase the number of input values?','The turtle continues farther through the curve.',kind='loop')
            self.add(join(base,text(node)),'Complete the curve',
                'Use the complete range of input values.',
                'The same calculation now runs through the whole range. Each position adds another segment to the path.',
                'The complete curve. Compare it with the short section you tested.',kind='loop')
            return
        target,iterator=ast.unparse(node.target),ast.unparse(node.iter)
        prior=[ast.Assign(targets=[copy.deepcopy(node.target)],value=literal(selected))]
        for child in node.body:
            if isinstance(child,ast.For):
                self.single_inner(child,join(base,text(prior))); break
            prior.append(child)
        self.add(first,'Test one repeat',
            'Build one example using the value shown. Run and inspect it.',
            f'{target} has one value in this test. Follow how it controls the drawing before putting the commands in a loop.',
            'One visible example from the group. Check its position, size, and color.',
            f'Where is {target} used in the drawing code?','Find the variable in the movement, size, or color expressions. A different value changes those instructions.')
        if len(values)<=8 and selected==values[0] and not any(isinstance(x,(ast.Break,ast.Continue)) for x in ast.walk(node)):
            two=[]
            for value in values[:2]: two.extend([ast.Assign(targets=[copy.deepcopy(node.target)],value=literal(value))]+node.body)
            self.add(join(base,text(two)),'Make a second example',
                'Add a second example. Look for the lines you repeated.',
                'Both examples use the same drawing instructions. Only an input value changes. You can put that repeated work in a loop.',
                'Two examples from the group. Compare their positions or sizes.',
                'Which lines are identical in both examples?','The drawing instructions match. A loop can reuse them for each value.')
        if len(values)>8:
            for count in sorted(set([4,max(5,len(values)//3)])):
                short=copy.deepcopy(node)
                short.iter=ast.Subscript(value=ast.Call(func=ast.Name(id='list',ctx=ast.Load()),args=[short.iter],keywords=[]),slice=ast.Slice(upper=ast.Constant(count)),ctx=ast.Load())
                preview=join(base,text(short))
                if run(preview)['ink']>run(base)['ink']:
                    self.add(preview,'Try '+str(count)+' repeats',
                        'Put the tested example in a loop. Use a short part of the input list first.',
                        'list(...) makes the repeat values available as a list. The slice [: '+str(count)+'] takes its first '+str(count)+' values. The indented body runs once per value.',
                        'A partial group. Inspect the spacing and repeated shape before drawing all of them.',
                        'Which part of the code changes how many examples are drawn?','The values supplied to the loop. The drawing instructions inside it stay the same.',kind='loop')
        self.add(join(base,text(node)),'Repeat the whole group',
            'Replace the trial examples with this loop. Run the whole program again.',
            f'for {target} in {iterator}: takes one value at a time. Indent the repeated body four spaces. The first line after the loop returns to the left edge.',
            'The complete group. Compare it with the first example you tested.',
            'What changes if the loop has fewer values?','The body runs fewer times. range(n) supplies n values, starting at 0.',kind='loop')

    def build(self):
        nodes=[n for n in ast.parse(self.project['code']).body if not isinstance(n,ast.FunctionDef)]
        for part in units(nodes):
            names=list(dict.fromkeys(called(ast.Module(body=part,type_ignores=[]))))
            new=[n for n in names if n in self.functions and n not in self.known]
            setup=[]
            while part and (isinstance(part[0],(ast.Import,ast.ImportFrom,ast.Assign)) or isinstance(part[0],ast.Expr) and called(part[0]) and called(part[0])[0] in {'speed','bgcolor','hideturtle','pensize','color'}):
                setup.append(part.pop(0))
            self.prefix=join(self.prefix,text(setup))
            for name in new: self.teach_function(name)
            candidate=join(self.prefix,text(part))
            if run(candidate)['ink']<=run(self.prefix)['ink']:
                self.prefix=candidate; continue
            if not self.steps and 'end_fill' in names and not new:
                direct=unroll(part)
                outline=[n for n in direct if not (isinstance(n,ast.Expr) and called(n) and called(n)[0] in {'begin_fill','end_fill'})]
                progressive=[]
                for piece in units(outline):
                    progressive.extend(piece)
                    if run(join(self.prefix,text(progressive)))['ink']:
                        self.add(join(self.prefix,text(progressive)),'Draw the first edge',
                            'Start with one edge. Run before adding the rest.',
                            'The pen moves in the current direction or to the coordinate you choose. This first edge gives you a starting point to inspect.',
                            'The first edge of the shape.'); break
                self.add(join(self.prefix,text(outline)),'Complete the outline',
                    'Add the remaining sides and close the shape.',
                    'The movements run in order. Check that the last side reaches the starting point.',
                    'The complete outline with an unfilled center.')
                self.add(join(self.prefix,text(direct)),'Fill the working shape',
                    'Put begin_fill() and end_fill() around the tested outline.',
                    'These commands fill the area enclosed by the movements between them.',
                    'The same outline with color inside it.')
                if text(direct)!=text(part):
                    self.add(candidate,'Loop the repeated sides',
                        'Replace the repeated movement lines with the loop.',
                        'Both the movement and turn repeat. Keep them together inside the indentation.',
                        'The same filled shape with fewer repeated commands.',kind='loop')
            if part and isinstance(part[-1],ast.For): self.loop_stages(part[-1],join(self.prefix,text(part[:-1])))
            self.add(candidate,instruction='Replace the practice call with the project code below, then run.' if new else None)
            self.prefix=candidate
        self.add(self.prefix,'Check the complete drawing',
            'Run the completed program. Compare its shapes and details with the finished example.',
            'The complete program combines the pieces you have tested, in drawing order.',self.project['desc'])
        self.add(self.prefix,'Make a change and explain it',
            'Choose one input in a function call or loop. Predict its effect, change it, and run. Then try a second change.',
            'Change one thing at a time so you can connect the result to the exact line you edited.',
            'Your own version of '+self.project['title']+'.',
            'Which line changed your drawing, and why?','Point to your edit, name the input you changed, and compare the result before and after.',kind='remix',remix=True)
        return self.steps

def pack(steps):
    old=[]; result=[]
    for step in steps:
        new=step['code'].splitlines(); changes=[]
        for op,i,j,a,b in difflib.SequenceMatcher(a=old,b=new,autojunk=False).get_opcodes():
            if op!='equal': changes.append({'start':i,'remove':j-i,'lines':new[a:b]})
        result.append({k:v for k,v in step.items() if k!='code'}|{'edits':changes}); old=new
    return result

def main():
    import argparse
    parser=argparse.ArgumentParser()
    parser.add_argument('--only',help='Comma-separated project IDs to rebuild during artwork iteration')
    requested=set((parser.parse_args().only or '').split(','))-{''}
    from lessons_authored import authored_lessons
    from lessons_starters import starter_projects
    source="""const fs=require('fs'),vm=require('vm');const c={window:{}};vm.createContext(c);for(const f of ['base-catalog.js',...'abcdef'.split('').map(x=>'curated-'+x+'.js')])vm.runInContext(fs.readFileSync(f,'utf8'),c);process.stdout.write(JSON.stringify([...c.window.TURTLE_BASE_CATALOG,...c.window.CURATED_EXAMPLES]));"""
    catalog=json.loads(subprocess.check_output(['node','-e',source],cwd=ROOT)); authored=authored_lessons()
    starters=starter_projects()
    catalog.extend({k:v for k,v in p.items() if k!='steps'} for p in starters)
    authored.update({p['id']:p['steps'] for p in starters})
    catalog.append({'id':'robot-roll-call','title':'Robot roll call','code':authored['robot-roll-call'][-1]['code'],'desc':'A robot built from shapes.'})
    manifest={}; total=0
    for p in catalog:
        existing=ROOT/'lessons'/f'{p["id"]}.json'
        if requested and p['id'] not in requested and existing.exists():
            steps=json.loads(existing.read_text())['steps']
            manifest[p['id']]={'steps':len(steps),'concepts':list(dict.fromkeys(s['kind'] for s in steps if s['kind'] not in {'draw','remix'}))}
            total+=len(steps)
            continue
        steps=authored[p['id']] if p['id'] in authored else Lesson(p).build()
        assert steps,p['id']
        for i,s in enumerate(steps): assert run(s['code'])['ink'],(p['id'],i,'blank')
        data={'version':VERSION,'id':p['id'],'title':p['title'],'steps':pack(steps)}
        (ROOT/'lessons'/f'{p["id"]}.json').write_text(json.dumps(data,separators=(',',':'),ensure_ascii=False)+'\n')
        manifest[p['id']]={'steps':len(steps),'concepts':list(dict.fromkeys(s['kind'] for s in steps if s['kind'] not in {'draw','remix'}))}
        total+=len(steps); print(p['id']+': '+str(len(steps)),flush=True)
    (ROOT/'tutorial-steps.js').write_text('// Rebuild with build-tutorial-steps.py.\nwindow.TURTLE_LESSON_VERSION='+json.dumps(VERSION)+';\nwindow.TURTLE_STEP_PLANS='+json.dumps(manifest,separators=(',',':'))+';\n')
    print(f'Built {total} visible checkpoints for {len(manifest)} tutorials.')
