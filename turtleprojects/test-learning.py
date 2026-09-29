"""Validate every lesson edit, runnable checkpoint, and introduced function."""
import ast
import json
from pathlib import Path
from lesson_runtime import run

root=Path(__file__).resolve().parent
total=0
errors=[]
for file in sorted((root/'lessons').glob('*.json')):
    data=json.loads(file.read_text()); lines=[]; known=set()
    for index,step in enumerate(data['steps']):
        label=f'{data["id"]} step {index+1} ({step["title"]})'
        try:
            end=0
            for edit in step['edits']:
                assert end<=edit['start']<=len(lines),'Invalid edit location'
                assert edit['start']+edit['remove']<=len(lines),'Edit exceeds old program'
                end=edit['start']+edit['remove']
            for edit in reversed(step['edits']):
                lines[edit['start']:edit['start']+edit['remove']]=edit['lines']
            code='\n'.join(lines)
            result=run(code,capture=True)
            assert result['ink']>0,'No visible drawing commands'
            functions={n.name for n in ast.parse(code).body if isinstance(n,ast.FunctionDef)}
            assert functions-known <= result['calls'],'A new function is not exercised: '+repr(functions-known-result['calls'])
            assert all(step.get(k) for k in ['instruction','explain','expected','question','answer','help']),'Missing teaching content'
            known=functions
            total+=1
        except Exception as e:
            errors.append(label+': '+repr(e))
    print(data['id']+': '+str(len(data['steps']))+' checked',flush=True)
mapping=(root/'tutorial-slugs.js').read_text()
routes=json.loads(mapping.split('Object.freeze(')[1].rsplit(');',1)[0])
assert len(list((root/'lessons').glob('*.json')))==len(routes),'Every route needs a lesson'
if errors:
    raise AssertionError('\n'.join(errors))
print(f'PASS: {total} executable checkpoints; every new function called in its introducing step.')
