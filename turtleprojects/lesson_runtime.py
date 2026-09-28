"""Small deterministic Turtle probe used to validate curriculum, without a GUI.

The browser audit remains authoritative for Skulpt and actual rendered pixels.
This probe catches missing names, blank checkpoints, and uncalled definitions.
"""
import ast
import copy
import hashlib
import math
import random


class Pen:
    def __init__(self):
        self.x = self.y = self.heading = 0
        self.down = True
        self.filling = False
        self.points = []
        self.ink = 0
        self.operations = []
        self.shade = 'black'
        self.width = 1

    def mark(self, name, *args):
        self.operations.append((name, args))
        self.ink += 1

    def goto(self, x, y=None):
        if y is None:
            x, y = x
        if self.down and (x != self.x or y != self.y):
            if min(x, self.x) <= 200 and max(x, self.x) >= -200 and min(y, self.y) <= 200 and max(y, self.y) >= -200:
                self.mark('line', self.x, self.y, x, y, self.shade, self.width)
        self.x, self.y = x, y
        if self.filling:
            self.points.append((x, y))

    def forward(self, length):
        a = math.radians(self.heading)
        self.goto(self.x + length * math.cos(a), self.y + length * math.sin(a))

    def backward(self, length):
        self.forward(-length)

    def left(self, angle):
        self.heading = (self.heading + angle) % 360

    def right(self, angle):
        self.left(-angle)

    def setheading(self, angle):
        self.heading = angle

    def penup(self):
        self.down = False

    def pendown(self):
        self.down = True

    def color(self, *args):
        if args:
            self.shade = args[-1]
        return self.shade

    def pensize(self, width=1):
        self.width = width

    def dot(self, size=5, shade=None):
        if size > 0 and abs(self.x) <= 200 + size / 2 and abs(self.y) <= 200 + size / 2:
            self.mark('dot', self.x, self.y, size, shade or self.shade)

    def begin_fill(self):
        self.filling = True
        self.points = [(self.x, self.y)]

    def end_fill(self):
        if len(set(self.points)) > 2:
            self.mark('fill', tuple(self.points), self.shade)
        self.filling = False

    def circle(self, radius, extent=360, steps=None):
        if radius and extent:
            if self.down or self.filling:
                self.mark('circle', self.x, self.y, self.heading, radius, extent, self.shade)
            angle = math.radians(self.heading)
            cx, cy = self.x - radius * math.sin(angle), self.y + radius * math.cos(angle)
            turn = math.radians(extent * (1 if radius >= 0 else -1))
            dx, dy = self.x - cx, self.y - cy
            self.x = cx + dx * math.cos(turn) - dy * math.sin(turn)
            self.y = cy + dx * math.sin(turn) + dy * math.cos(turn)
            self.heading += math.degrees(turn)
            if self.filling:
                self.points.extend([(cx, cy), (self.x, self.y)])

    def write(self, text, **kwargs):
        if text:
            self.mark('text', self.x, self.y, str(text))

    def noop(self, *args, **kwargs):
        pass


def run(code, capture=False):
    pen = Pen()
    env = {k: getattr(pen, k) for k in ['goto', 'forward', 'backward', 'left', 'right', 'setheading', 'penup', 'pendown', 'color', 'pensize', 'dot', 'begin_fill', 'end_fill', 'circle', 'write']}
    for k in ['speed', 'hideturtle', 'showturtle', 'bgcolor', 'shape', 'tracer', 'update', 'done']:
        env[k] = pen.noop
    env.update({'fillcolor': pen.color, 'pencolor': pen.color, 'fd': pen.forward, 'bk': pen.backward,
                'lt': pen.left, 'rt': pen.right, 'seth': pen.setheading, 'position': lambda: (pen.x, pen.y),
                'heading': lambda: pen.heading, 'xcor': lambda: pen.x, 'ycor': lambda: pen.y, 'print': pen.noop})
    samples = {}
    calls = set()
    tree = ast.parse(code)
    if capture:
        def record(fn):
            def wrapped(*args, **kwargs):
                calls.add(fn.__name__)
                if fn.__name__ not in samples:
                    import inspect
                    values = inspect.signature(fn).bind(*args, **kwargs)
                    values.apply_defaults()
                    samples[fn.__name__] = copy.deepcopy(dict(values.arguments))
                return fn(*args, **kwargs)
            return wrapped
        env['__record'] = record
        for n in ast.walk(tree):
            if isinstance(n, ast.FunctionDef):
                n.decorator_list.append(ast.Name(id='__record', ctx=ast.Load()))
    random.seed(1729)
    exec(compile(ast.fix_missing_locations(tree), '<lesson>', 'exec'), env)
    return {'ink': pen.ink, 'env': env, 'samples': samples, 'calls': calls,
            'pen': pen, 'digest': hashlib.sha256(repr(pen.operations).encode()).hexdigest()}
