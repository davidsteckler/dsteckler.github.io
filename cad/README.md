# Form · 3D Studio

A static, account-free 3D modeling workspace at `/cad/`. It runs directly on GitHub Pages. All JavaScript, styles, and geometry dependencies are served from this repository; there is no backend, CDN, analytics, or login requirement for this page.

## Making a model

- Choose **Beginner** for a short guided workflow, simpler tool names, and fewer precision controls. Choose **Advanced** for alignment, distribution, mirroring, patterns, model measurements, workplanes, and view options. Switching modes preserves the project; the preference is remembered on this device. Beginner exports all visible bodies and uses millimeters for STL import.
- Add boxes, cylinders, spheres, cones, rings, rounded boxes, tubes, or wedges. Rounded boxes have an editable physical corner radius; tubes have an editable wall thickness. These remain adjustable until a boolean operation converts them to a combined mesh.
- Click a body to select it. Shift-click selects additional bodies. The body list also supports selection, visibility, and locking.
- Use Move, Rotate, and Scale handles, or enter exact dimensions, center positions, and rotation angles in Properties. **Keep proportions** resizes all dimensions together. Z points up; dimensions are measured in the body's local axes, and all lengths use millimeters. Snap controls movement and sketch points; rotation snaps in 15° steps. Radius and wall thickness are clamped to fit smaller dimensions.
- **Mold** (`E`) is a direct eraser brush. Drag on a visible, unlocked shape, then release to apply the tinted cut preview. Adjust brush diameter and shave depth in millimeters or enable **Cut all the way through**. Strokes sweep a round cutter across a plane aligned to the surface normal where the drag started; each stroke edits only its starting body. Repeated strokes shave deeper. Each batch allows five successful strokes, with up to eight swept segments per stroke. **Keep cuts & continue** keeps the design and clears Undo/Redo before starting a new batch. Undoing or changing tools does not reset the batch count. Recent Undo is bounded by a shared 8 MiB / 12-entry budget, so older states are released as needed. Escape cancels a stroke, including one being calculated, and Done restores orbit controls. Cuts run in disposable module workers, with an eight-second timeout and a Cancel stroke button. A shape must have fewer than 6,000 input triangles; a cut may produce at most 8,000, and the whole project is limited to 20,000 triangles for erasing. Further erasing is blocked at these limits; the current model is preserved and can still be saved or exported. Starting a new batch clears history, without simplifying or resetting the model’s detail. Preview updates are limited to 30 fps and reuse unchanged segments. The resulting mesh saves and exports normally.
- **Text** (`T`) opens with an empty, focused text field and a preview with fitted dimensions. Enter adds the lettering. Selecting a shape defaults to raised lettering, with automatic fitting and an engraved option. Selecting standalone text opens its words for editing. Text creates real extruded lettering, including counters in letters such as O and B. Standalone text retains editable words. Raised or engraved text fits and joins/cuts the selected body's world-XY top surface. Use a flat upward-facing plaque; this is not an arbitrary-face lettering tool. Operations that do not contact material are rejected. Joining/engraving turns the target into a combined mesh; Undo restores its editable inputs.
- Sketch a rectangle, circle, or polygon, choose a height, and extrude. Click polygon corners, then Extrude or Enter; Backspace or **Undo corner** removes the last polygon corner. Profiles must enclose an area and cannot cross themselves. Advanced workplanes are XY (extrudes +Z), XZ (extrudes −Y), and YZ (extrudes +X), with a signed offset along that normal. The grid and view follow the workplane. A failed extrusion preserves the sketch.
- Union, Subtract, and Intersect calculate real triangle geometry. Subtract uses the first selected body as the target and removes the other selected bodies. Operations replace the inputs; Undo restores them. Overlap solids before joining them for a connected print.
- Advanced **Align** matches bounding faces/centers to the first selected reference. **Distribute** evenly spaces centers while retaining the outer bodies. **Mirror** adds reflected copies about the selection's center plane. **Pattern** makes editable linear or radial copies; the instance count includes the original. Radial patterns can use the selection center or world origin. Full 360° patterns avoid a duplicate endpoint.
- Advanced measurements show world bounding dimensions, triangle count, the distance between two selected body centers, and estimated volume. Volume is the sum of individual bodies: overlaps are counted separately. Use Union when you need one combined volume. Perspective/orthographic viewing and wireframe are also available.
- Changes autosave to this browser/device. **Save project** downloads a `.form3d` JSON file, and **Open design** restores it. Download important work: clearing browser storage removes the autosave. Starting a new design, loading an example, or opening another project asks before replacing the current design and can be undone.
- **Import STL** accepts bounded binary or ASCII files and adds the mesh without replacing the project. In Advanced mode, choose millimeters or inches before importing; inch coordinates are converted by 25.4. The imported body is centered on XY and placed on the ground. Its dimensions and transforms remain editable. STL geometry should be closed and consistently wound for solid booleans.
- **Export STL** downloads all visible bodies with their world transforms, or only selected bodies when that Advanced option is enabled. STL is unitless; exported coordinates use millimeters, so select millimeters in your slicer. Hidden bodies are excluded. Multiple unjoined bodies remain separate shells. Check the sliced result and printing orientation before fabrication.

The three examples are editable solids: a mounting bracket with through-holes, a trophy, and a hollow pencil cup. The cup is labeled Vase in the starter menu; printing does not guarantee a watertight container.

This is a mesh CAD editor inspired by direct modeling workflows. It does not implement Shapr3D’s full solid-modeling kernel, arbitrary-face push/pull or fillets, sketch constraints, parametric history, STEP export, or collaborative cloud projects. Rounded corners are supported on rounded-box primitives. Shape changes after an extrusion use its dimensions; there is no retained editable sketch feature tree. Curved surfaces and boolean results are tessellated meshes.

## Development

Serve the repository root, then open the `/cad/` route in a browser with WebGL 2:

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

No build is needed to edit the app's source modules. `app.js` owns rendering, interaction, undo/redo, and local storage. `model.js` handles geometry, project validation, and STL export. `mold.js` creates surface-aligned swept cutters and applies atomic shaving operations. `operations.js` handles arrangements, patterns, measurements, and STL input. The committed `vendor/engine.js` bundles Three.js, its controls/loaders/exporter, a local Helvetiker Bold font, three-bvh-csg, and three-mesh-bvh. Licenses and exact versions are included in `vendor/LICENSES.txt`, `fonts/LICENSE.txt`, and `tools/package-lock.json`. The HTML import map versions all browser modules together; bump its version and the app/style query strings together when publishing another module release.

To reproduce the vendor bundle (Node 22+):

```sh
cd cad/tools
npm ci
npm run build
```

## Validation

From the repository root:

```sh
node cad/test-model.mjs
node cad/test-operations.mjs
node cad/test-mold.mjs
node --max-old-space-size=96 cad/test-memory.mjs
BROWSER_EXECUTABLE=/usr/bin/chromium node cad/test-browser.mjs
BROWSER_EXECUTABLE=/usr/bin/chromium node cad/test-features.mjs
```

Browser tests need `playwright` available to Node. The original workflow uses port 8794 and saves proof under `/tmp/form3d-test`; the expanded features suite uses port 8795 and `/tmp/form3d-features-test`. Omit `BROWSER_EXECUTABLE` to use Playwright’s installed Chromium. The cloud environment already has Playwright in `/workspace/node_modules`; other development machines can install it outside the checkout in a parent directory. No production browser dependency installation is required.

Geometry tests verify dimensions, transforms, real boolean volumes, text counters, rounded corners, tube openings, old project compatibility, and STL coordinates. Operations tests cover arrangements, reflected winding, pattern placements, STL input/units, and measurements. Browser checks cover both modes, lettering/engraving, shape parameters, proportional resizing, advanced operations, workplanes, view options, original editing/saving workflows, mobile layouts, and the absence of external requests.

Project input is limited to version 1 JSON in millimeters, 100 bodies, 20 MB, and 300,000 custom vertices overall. A solid operation accepts 2–20 bodies and has its own complexity limit. Invalid imports and unsuccessful operations preserve the current design.
