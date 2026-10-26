from pathlib import Path
import json, ast, os, io, contextlib, builtins, tempfile
from unittest.mock import patch
root=Path(__file__).resolve().parent
projects=json.loads((root/'projects.js').read_text().removeprefix('window.PI_PROJECTS = ').rstrip(';\n'))
for p in projects:
    ast.parse(p['small']);ast.parse(p['code'])
    assert (root/p['id']/'index.html').exists()
    assert (root/p['id']/(p['id'].replace('-','_')+'.py')).read_text()==p['code']
    assert p['solve'] and p['create'] and 0<=p['predict'][2]<len(p['predict'][1])
print('26 project records and 52 Python examples pass structural and syntax checks')
# Real Pygame executes both examples for every screen-only game.
os.environ['SDL_VIDEODRIVER']='dummy';os.environ['SDL_AUDIODRIVER']='dummy';os.environ['PYGAME_HIDE_SUPPORT_PROMPT']='1'
import pygame
class FastClock:
    def tick(self,*args):return 16
for p in projects:
    if p['category']!='Pygame':continue
    for version in ['small','code']:
        ticks=[0]
        def events():
            ticks[0]+=1
            return [pygame.event.Event(pygame.QUIT)] if ticks[0]>=180 else []
        with patch.object(pygame.event,'get',events),patch.object(pygame.time,'Clock',FastClock):
            data={};exec(p['' + version],data)
        if p['id']=='bouncing-ball' and version=='code':
            assert 12<=data['x']<=628 and 12<=data['y']<=468
        if p['id']=='snake' and version=='code':assert data['over']
print('10 Pygame examples run for 180 frames each with the real Pygame library')
# Maze rejects a held right movement at its first wall.
maze=next(p for p in projects if p['id']=='keyboard-maze')
class Keys:
    def __getitem__(self,key):return int(key==pygame.K_RIGHT)
ticks=[0]
def events():
    ticks[0]+=1
    return [pygame.event.Event(pygame.QUIT)] if ticks[0]>=100 else []
with patch.object(pygame.event,'get',events),patch.object(pygame.time,'Clock',FastClock),patch.object(pygame.key,'get_pressed',lambda:Keys()):
    data={};exec(maze['code'],data)
assert data['player'].right<=120
print('Maze collision prevents held-key movement through a wall')
# Files stay put during dry run; moving a practice folder is repeatable.
sorter=next(p for p in projects if p['id']=='file-sorter')
with tempfile.TemporaryDirectory() as temporary:
    home=Path(temporary)
    with patch('pathlib.Path.home',lambda:home),contextlib.redirect_stdout(io.StringIO()):
        exec(sorter['small'],{})
        (home/'pi-sort-practice'/'image.png').write_text('sample')
        exec(sorter['code'],{})
        assert (home/'pi-sort-practice'/'image.png').exists()
        assert not (home/'pi-sort-practice'/'png').exists()
        exec(sorter['code'].replace('dry_run = True','dry_run = False'),{})
        exec(sorter['code'].replace('dry_run = True','dry_run = False'),{})
        assert (home/'pi-sort-practice'/'png'/'image.png').exists()
        assert (home/'pi-sort-practice'/'txt'/'note.txt').exists()
print('File sorter dry run and repeated sorting pass in a temporary home')
from gpiozero import Device
from gpiozero.pins.mock import MockFactory,MockPWMPin
Device.pin_factory=MockFactory(pin_class=MockPWMPin)
for slug in ['first-led','traffic-lights','morse-beacon','pwm-light','rgb-mixer']:
    p=next(p for p in projects if p['id']==slug)
    with patch('time.sleep',lambda _:None),patch.object(builtins,'input',lambda _: 'SOS' if slug=='morse-beacon' else 'q'),contextlib.redirect_stdout(io.StringIO()):
        exec(p['code'],{})
print('5 GPIO output programs run with GPIO Zero mock pins (no physical hardware)')
# Flask routes use simulated sensor values and actual Flask request handling.
p=next(p for p in projects if p['id']=='sensor-dashboard')
class CPU:
    temperature=42.1
    def close(self):pass
with patch('gpiozero.CPUTemperature',CPU):
    namespace={'__name__':'pi_test'};exec(p['code'],namespace)
    client=namespace['app'].test_client()
    assert client.get('/api').json['cpu_c']==42.1
    assert b'Pi dashboard' in client.get('/').data
    namespace['button'].close()
print('Flask HTML and JSON routes pass with a simulated CPU reading')
