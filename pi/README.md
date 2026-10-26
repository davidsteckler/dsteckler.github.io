# Raspberry Pi Lab

`/pi/` is a buildless Python project library for Raspberry Pi 4 and 5 running Raspberry Pi OS desktop. `projects.js` owns the 26 project records, source links, first checkpoints, complete reference programs, line walkthroughs, wiring, predictions, and independent tasks. `pi.js` renders the searchable catalogue and eight-checkpoint learning workspace. `pi.css` follows the existing Python course palette and shared student navigation.

Each short project address redirects to its stable `?project=ID` address. Each project directory also includes its complete downloadable Python reference. Keep that file identical to the corresponding `code` value when editing.

The sequence is Prepare → Type & run → Change → Build → Predict → Solve → Create → Evidence. Build highlights code changed from the first example. All Python executes on the Raspberry Pi in Thonny; the browser never claims to run GPIO or camera code. Completion is a self-reported record requiring a correct prediction, both requirement checklists, and a note. No teacher grade or hardware verification is inferred.

Progress is local to the browser under `dsteckler-pi-lab-v1`. Each project emits a stable `learning-activity` identity `pi-ID` for the shared notebook and learning-home resume link. Downloads include the current Python checkpoint or a project evidence record. Do not mark a visit as completion.

Run `python pi/validate.py` from the repository root after installing `pygame`, `gpiozero`, and `flask` in a development environment. It checks all data and Python syntax, executes the Pygame examples with dummy SDL, verifies maze collision and practice-folder sorting, tests GPIO outputs with mock pins, and checks Flask routes with a simulated CPU reading. The test writes only to temporary directories and does not verify physical circuits or camera hardware.

Research checked 2026-10-26. Primary sources are linked per project. Camera examples use Picamera2, GPIO examples use GPIO Zero, and dependency instructions use Raspberry Pi OS apt packages. Older inspiration pages can use different camera software; keep classroom code aligned to current APIs.

## Real visual references

`visuals.js` maps every project to a locally hosted photograph or a screen capture from the actual Pygame reference program. `images/CREDITS.html` records sources and licenses. Hardware images are reference photographs; exact project connections remain in the wiring tables. The page draws SVG leader lines and labels over each image, with coordinates normalized to that source image. Keep image and SVG aspect-ratio behavior aligned when changing a crop. The lesson supports hiding labels and enlarging the photograph. Avoid replacing these assets with decorative hardware illustrations.
