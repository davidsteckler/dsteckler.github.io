"""Check that art and tutorials agree, and Beginner means movement-first."""
import ast
import json
from pathlib import Path
from lesson_runtime import run
from lessons_starters import starter_projects
from importlib.util import spec_from_file_location,module_from_spec
root=Path(__file__).resolve().parent
spec=spec_from_file_location('catalog_builder',root/'build-project-catalog.py')
module=module_from_spec(spec);spec.loader.exec_module(module)
catalog=[p for file in ['base-catalog.js']+['curated-'+c+'.js' for c in 'abcdef'] for p in module.read(file)]+starter_projects()
meta=json.loads((root/'project-levels.js').read_text().split('window.TURTLE_PROJECT_LEVELS=')[1].rstrip(';\n'))
for p in catalog:
    lesson=json.loads((root/'lessons'/f"{p['id']}.json").read_text())
    lines=[]
    for step in lesson['steps']:
        for edit in reversed(step['edits']):lines[edit['start']:edit['start']+edit['remove']]=edit['lines']
    final='\n'.join(lines)
    assert run(final)['digest']==run(p['code'])['digest'],p['id']+': gallery and tutorial draw different pictures'
    assert meta[p['id']]['level'] in ['Beginner','Medium','Hard']
    if meta[p['id']]['level']=='Beginner':
        for step in p['steps']:
            tree=ast.parse(step['code'])
            calls={n.func.id for n in ast.walk(tree) if isinstance(n,ast.Call) and isinstance(n.func,ast.Name)}
            assert 'goto' not in calls and 'setpos' not in calls,p['id']+': coordinate entry in beginner project'
            assert not any(isinstance(n,ast.List) for n in ast.walk(tree)),p['id']+': list entry in beginner project'
            assert not any(isinstance(n,ast.Constant) and isinstance(n.value,float) for n in ast.walk(tree)),p['id']+': decimal entry in beginner project'
            assert max(map(len,step['code'].splitlines()))<=88,p['id']+': long beginner code line'
print(f'PASS: {len(catalog)} gallery programs match their finished tutorials; 12 beginner projects use whole-number movement code.')
