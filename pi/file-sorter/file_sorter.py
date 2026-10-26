from pathlib import Path
folder = Path.home() / "pi-sort-practice"
folder.mkdir(exist_ok=True)
dry_run = True
for item in sorted(folder.iterdir()):
    if not item.is_file():
        continue
    group = item.suffix.lower().lstrip(".") or "no-extension"
    target = folder / group / item.name
    if target.exists():
        print("Skip existing:", target.name)
        continue
    print(item.name, "->", group)
    if not dry_run:
        target.parent.mkdir(exist_ok=True)
        item.rename(target)
print("Plan only" if dry_run else "Files sorted")
