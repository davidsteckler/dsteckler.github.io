# Turtle editor

The file bar supports named Python tabs. Run executes the selected tab. Other open Python files can be imported by module name, for example `import helpers` for `helpers.py`. Each file keeps its own undo state and saved history. The Files menu opens local `.py` files, downloads the selected file, renames files, and deletes them. Existing single-file code and history remain in `main.py`.

Background image → Upload image accepts PNG, JPEG, GIF, and WebP up to 10 MB and 40 megapixels. Fit controls show the whole image, fill the drawing area, or stretch it. The background is shared across tabs and remains through Run and Clear Run. Remove image clears it. Images are stored in IndexedDB; Python files and history use localStorage. Both are specific to the browser and device. Downloaded `.py` files contain code only. Course and reference embeds retain their existing editor interface.

Reference examples use stacked cards for readable Python code and actual executed results. Printed values appear separately from drawings. Drawings fit around the visible marks; background-color examples retain the full drawing area. Expand example opens an editable workspace in a dialog; Use this code copies it into the selected Python tab. The background image settings sit in normal layout below Turtle World, including when expanded.

## Browser checks

Install `playwright`, `codemirror@5`, and `skulpt@1.2.0` in your development environment. Serve the repository root at `http://127.0.0.1:8794`, then run `node turtle/test-files.mjs`. Set `BROWSER_EXECUTABLE` for an existing Chromium installation or install Playwright's Chromium. `TURTLE_TEST_ORIGIN` overrides the server URL. `TURTLE_FILES_PROOF` optionally selects an existing screenshot output directory.

For offline dependency fixtures, set `TURTLE_TEST_DEPS_DIR` to a directory containing `codemirror.css`, `codemirror.js`, `python.js`, `skulpt.js`, and `skulpt-stdlib.js` from the versions used in `index.html`.

The existing `node turtle/test-sidebar.mjs` suite covers reference examples, code history, display controls, and desktop/mobile layout.
