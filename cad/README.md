# Form · 3D Studio

A static, account-free 3D modeling workspace at `/cad/`. It runs directly on GitHub Pages. All JavaScript, styles, and geometry dependencies are served from this repository; there is no backend, CDN, analytics, or login requirement for this page.

## Making a model

- Add boxes, cylinders, spheres, cones, or rings.
- Click a body to select it. Shift-click selects additional bodies. The body list also supports selection, visibility, and locking.
- Use Move, Rotate, and Scale handles, or enter exact dimensions, center positions, and rotation angles in Properties. Z points up; all lengths use millimeters. Snap controls movement and sketch points; rotation snaps in 15° steps.
- Sketch a rectangle, circle, or polygon on the XY ground plane, choose a height, and extrude. Click polygon corners, then Extrude or Enter. Profiles must enclose an area and cannot cross themselves.
- Union, Subtract, and Intersect calculate real triangle geometry. Subtract uses the first selected body as the target and removes the other selected bodies. Operations replace the inputs; Undo restores them. Overlap solids before joining them for a connected print.
- Changes autosave to this browser/device. **Save project** downloads a `.form3d` JSON file, and **Open design** restores it. Download important work: clearing browser storage removes the autosave. Starting a new design, loading an example, or opening another project asks before replacing the current design and can be undone.
- **Export STL** downloads all visible bodies with their world transforms. STL is unitless; the coordinates here use millimeters, so select millimeters in your slicer. Hidden bodies are excluded. Multiple unjoined bodies remain separate shells. Check the sliced result and printing orientation before fabrication.

The three examples are editable solids: a mounting bracket with through-holes, a trophy, and a hollow pencil cup. The cup is labeled Vase in the starter menu; printing does not guarantee a watertight container.

This is a mesh CAD editor inspired by direct modeling workflows. It does not implement Shapr3D’s full solid-modeling kernel, face-based push/pull, fillets, sketch constraints, parametric history, STEP export, or collaborative cloud projects. Sketches start on the ground plane. Shape changes after an extrusion use its dimensions; there is no retained editable sketch feature tree. Curved surfaces and boolean results are tessellated meshes.

## Development

Serve the repository root, then open the `/cad/` route in a browser with WebGL 2:

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

No build is needed to run or edit the app. `app.js` owns rendering, interaction, undo/redo, and local storage. `model.js` handles geometry, project validation, and STL export. The committed `vendor/engine.js` bundles Three.js, its controls/exporter, three-bvh-csg, and three-mesh-bvh. Licenses and exact versions are included in `vendor/LICENSES.txt` and `tools/package-lock.json`.

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
BROWSER_EXECUTABLE=/usr/bin/chromium node cad/test-browser.mjs
```

The browser test needs `playwright` available to Node, starts its own server on port 8794, and saves screenshots/downloads under `/tmp/form3d-test`. Omit `BROWSER_EXECUTABLE` to use Playwright’s installed Chromium. The cloud environment already has Playwright in `/workspace/node_modules`; other development machines can install it outside the checkout in a parent directory. No production browser dependency installation is required.

Geometry tests verify dimensions, Z-up transforms, sketch placement, real boolean volumes, result resizing, malformed project rejection, and binary STL coordinates. Browser checks cover editing, through-hole subtraction, undo/redo, every sketch tool, project round trips, downloads, browser autosave, visibility/locking, mobile properties, and the absence of external requests.

Project input is limited to version 1 JSON in millimeters, 100 bodies, 20 MB, and 300,000 custom vertices overall. A solid operation accepts 2–20 bodies and has its own complexity limit. Invalid imports and unsuccessful operations preserve the current design.
