import {THREE, OrbitControls, TransformControls} from './vendor/engine.js';
import {createBody, buildMesh, cloneBody, combineBodies, calculateBounds, serializeProject, parseProject, exportSTL} from './model.js';

const $ = id => document.getElementById(id);
const all = selector => [...document.querySelectorAll(selector)];
const STORAGE_KEY = 'dsteckler-form3d-v1';
const palette = ['#497cbd', '#e6a45f', '#69a79b', '#b08ac4', '#d37f76'];
let project = {version: 1, units: 'mm', name: 'Mounting bracket', bodies: []};
let selected = new Set(), meshes = new Map(), history = [], future = [];
let mode = 'select', sketch = null, transformSnapshot = null, saveTimer, statusTimer;
let storageAvailable = true, pendingConfirmation = null, renderRequested = true;
let renderer, scene, camera, orbit, transform, bodyGroup, selectionGroup, sketchGroup, grid;
const viewport = $('viewport');
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
let pointerStart = null;

function message(text, persistent = false) {
  clearTimeout(statusTimer);
  $('status-message').textContent = text;
  if (!persistent) statusTimer = setTimeout(() => {
    $('status-message').textContent = sketch ? sketchInstruction() : 'Ready to create. All dimensions are in millimeters.';
  }, 6000);
}

function snapshot() { return serializeProject(project); }
function remember(before = snapshot()) {
  if (history.at(-1) !== before) history.push(before);
  if (history.length > 60) history.shift();
  future = [];
}
function persist() {
  $('save-status').textContent = 'Saving…';
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try {
      localStorage.setItem(STORAGE_KEY, snapshot());
      $('save-status').textContent = 'Saved in this browser';
      storageAvailable = true;
    } catch {
      storageAvailable = false;
      $('save-status').textContent = 'Download a project to save';
      message('Browser storage is unavailable or full. Use Save project to keep a copy.', true);
    }
  }, 250);
}
function disposeObject(object) {
  object.traverse(child => {
    child.geometry?.dispose();
    if (Array.isArray(child.material)) child.material.forEach(m => m.dispose());
    else child.material?.dispose();
  });
}
function clearGroup(group) {
  [...group.children].forEach(child => { group.remove(child); disposeObject(child); });
}
function rebuild() {
  transform.detach();
  clearGroup(bodyGroup);
  meshes.clear();
  for (const body of project.bodies) {
    const mesh = buildMesh(body);
    mesh.visible = body.visible !== false;
    mesh.castShadow = true;
    mesh.receiveShadow = false;
    mesh.material.roughness = 0.52;
    mesh.material.metalness = 0.08;
    // Boolean meshes can have coplanar T junctions: outlining every triangle
    // exposes construction seams rather than the finished surface.
    if (body.type !== 'custom') {
      const edges = new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry, 38), new THREE.LineBasicMaterial({color: '#173957', transparent: true, opacity: 0.23}));
      mesh.add(edges);
    }
    bodyGroup.add(mesh);
    meshes.set(body.id, mesh);
  }
  selected = new Set([...selected].filter(id => project.bodies.some(b => b.id === id && b.visible !== false)));
  refresh();
}
function updateOutline() {
  clearGroup(selectionGroup);
  for (const id of selected) {
    const mesh = meshes.get(id);
    if (!mesh || !mesh.visible) continue;
    const helper = new THREE.BoxHelper(mesh, '#d28a39');
    helper.material.depthTest = false;
    helper.material.transparent = true;
    helper.material.opacity = 0.85;
    helper.renderOrder = 10;
    selectionGroup.add(helper);
  }
}
function selectionBodies() { return [...selected].map(id => project.bodies.find(b => b.id === id)).filter(Boolean); }
function editableBodies() { return selectionBodies().filter(b => !b.locked); }
function refresh() {
  renderRequested = true;
  const bodies = selectionBodies();
  $('project-name').value = project.name;
  $('body-count').textContent = project.bodies.length;
  $('selected-count').textContent = bodies.length ? `${bodies.length} selected` : 'No selection';
  $('undo').disabled = history.length === 0;
  $('redo').disabled = future.length === 0;
  $('delete-body').disabled = editableBodies().length === 0;
  $('duplicate').disabled = bodies.length === 0;
  all('[data-boolean]').forEach(button => { button.disabled = bodies.length < 2 || bodies.some(b => b.locked); });
  $('export-stl').disabled = !project.bodies.some(b => b.visible !== false);
  $('selection-properties').hidden = bodies.length !== 1;
  $('selection-empty').hidden = bodies.length === 1;
  if (bodies.length > 1) $('selection-empty').textContent = `${bodies.length} bodies selected. Subtract cuts the other bodies from “${bodies[0].name}”. Union joins them; Intersect keeps their shared volume.`;
  else $('selection-empty').textContent = 'Select a body in the canvas or the list to edit its dimensions and position.';
  if (bodies.length === 1) {
    const body = bodies[0];
    $('body-name').value = body.name;
    $('body-color').value = body.color;
    for (const [attribute, property] of [['dimension', 'dimensions'], ['position', 'position'], ['rotation', 'rotation']]) {
      all(`[data-${attribute}]`).forEach(input => {
        input.value = Number(body[property][Number(input.dataset[attribute])].toFixed(2));
        input.disabled = Boolean(body.locked);
      });
    }
    $('body-name').disabled = Boolean(body.locked);
    $('body-color').disabled = Boolean(body.locked);
    $('drop-body').disabled = Boolean(body.locked);
    $('center-body').disabled = Boolean(body.locked);
  }
  renderBodyList();
  updateOutline();
  if (bodies.length === 1 && !bodies[0].locked && mode !== 'select' && !sketch) {
    transform.setMode({move: 'translate', rotate: 'rotate', scale: 'scale'}[mode]);
    transform.attach(meshes.get(bodies[0].id));
  } else transform.detach();
}
function renderBodyList() {
  const list = $('body-list');
  list.replaceChildren();
  if (!project.bodies.length) {
    const empty = document.createElement('p');
    empty.className = 'body-list-empty';
    empty.textContent = 'Your next idea starts with a shape.';
    list.append(empty);
  }
  for (const body of project.bodies) {
    const row = document.createElement('div');
    row.className = 'body-row' + (selected.has(body.id) ? ' selected' : '');
    row.dataset.bodyId = body.id;
    const button = document.createElement('button');
    button.className = 'body-select';
    button.setAttribute('aria-pressed', String(selected.has(body.id)));
    button.title = 'Select body · Shift-click to select more';
    const swatch = document.createElement('span');
    swatch.className = 'body-swatch'; swatch.style.background = body.color;
    const text = document.createElement('span'); text.textContent = body.name;
    button.append(swatch, text);
    button.addEventListener('click', event => select(body.id, event.shiftKey || event.metaKey || event.ctrlKey));
    const visibility = document.createElement('button');
    visibility.className = 'body-visibility';
    visibility.setAttribute('aria-label', `${body.visible === false ? 'Show' : 'Hide'} ${body.name}`);
    visibility.title = body.visible === false ? 'Show body' : 'Hide body';
    visibility.textContent = body.visible === false ? '◌' : '◉';
    visibility.addEventListener('click', () => mutate(() => { body.visible = body.visible === false; }, body.visible === false ? 'Body shown.' : 'Body hidden.'));
    const lock = document.createElement('button');
    lock.className = 'body-lock';
    lock.textContent = body.locked ? '▣' : '▫';
    lock.setAttribute('aria-label', `${body.locked ? 'Unlock' : 'Lock'} ${body.name}`);
    lock.title = body.locked ? 'Unlock body' : 'Lock body';
    lock.addEventListener('click', () => mutate(() => { body.locked = !body.locked; }));
    row.append(button, visibility, lock); list.append(row);
  }
}
function select(id, extend = false) {
  if (sketch) return;
  if (!extend) selected.clear();
  if (id) {
    const body = project.bodies.find(b => b.id === id);
    if (body?.visible === false) {
      message('Show this body before selecting it.');
      refresh(); return;
    }
    if (extend && selected.has(id)) selected.delete(id); else selected.add(id);
  }
  refresh();
}
function mutate(action, text) {
  const before = snapshot();
  try {
    action();
    // Validate a complete document before committing it to browser storage.
    project = parseProject(serializeProject(project));
    remember(before);
    rebuild(); persist();
    if (text) message(text);
  } catch (error) {
    project = parseProject(before);
    rebuild(); message(error.message || 'That change could not be completed.', true);
  }
}
function restoreFromHistory(direction) {
  if (sketch) cancelSketch();
  const from = direction === 'undo' ? history : future;
  const to = direction === 'undo' ? future : history;
  if (!from.length) return;
  to.push(snapshot()); project = parseProject(from.pop());
  selected.clear(); rebuild(); persist(); message(direction === 'undo' ? 'Change undone.' : 'Change restored.');
}
function setMode(next) {
  if (sketch) cancelSketch();
  mode = next;
  all('[data-tool]').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.tool === mode));
    button.classList.toggle('active', button.dataset.tool === mode);
  });
  refresh();
  if (mode !== 'select') message(`Select one body to ${mode}. Drag a colored handle to edit that axis.`);
}
function addShape(type) {
  if (sketch) cancelSketch();
  const count = project.bodies.filter(b => b.type === type).length;
  const names = {box: 'Box', cylinder: 'Cylinder', sphere: 'Sphere', cone: 'Cone', torus: 'Ring'};
  const dimensions = type === 'torus' ? [36, 36, 10] : [30, 30, 30];
  const offset = Math.min(project.bodies.length, 10) * 6;
  const body = createBody(type, {name: `${names[type]} ${count + 1}`, dimensions, position: [offset, offset, dimensions[2] / 2], color: palette[project.bodies.length % palette.length]});
  mutate(() => { project.bodies.push(body); selected = new Set([body.id]); }, `${names[type]} added. Set exact dimensions in the inspector.`);
  $('welcome-card').hidden = true;
  setMode('move');
}
function duplicate() {
  const source = selectionBodies();
  if (!source.length) return;
  mutate(() => {
    const copies = source.map(body => {
      const copy = cloneBody(body);
      copy.position[0] += 10; copy.position[1] += 10;
      copy.locked = false;
      return copy;
    });
    project.bodies.push(...copies); selected = new Set(copies.map(b => b.id));
  }, 'Selection duplicated and offset by 10 mm.');
}
function removeSelected() {
  const removable = new Set(editableBodies().map(b => b.id));
  if (!removable.size) return;
  mutate(() => {
    project.bodies = project.bodies.filter(b => !removable.has(b.id));
    selected.clear();
  }, 'Selected bodies deleted. Undo restores them.');
}
function boolean(operation) {
  const bodies = selectionBodies();
  if (bodies.length < 2 || bodies.some(b => b.locked)) return;
  message('Calculating solid…', true);
  requestAnimationFrame(() => {
    mutate(() => {
      const result = combineBodies(bodies, operation);
      result.name = {union: 'Joined body', subtract: bodies[0].name.slice(0, 76) + ' cut', intersect: 'Intersection'}[operation];
      project.bodies = project.bodies.filter(b => !selected.has(b.id));
      project.bodies.push(result); selected = new Set([result.id]);
    }, {union: 'Overlapping bodies joined into one solid.', subtract: 'Other selected bodies cut from the first selection.', intersect: 'Only the shared volume remains.'}[operation]);
  });
}
function fit(view = 'iso') {
  const bounds = calculateBounds(project.bodies.filter(b => b.visible !== false));
  const center = bounds.empty ? new THREE.Vector3(0, 0, 10) : new THREE.Vector3(...bounds.center);
  const radius = Math.max(45, ...bounds.size) * 1.9;
  const directions = {iso: [1, -1.35, 1.05], top: [0, -0.00001, 1.7], front: [0, -1.7, 0.03], right: [1.7, 0, 0.03]};
  camera.up.set(0, 0, 1);
  camera.position.copy(center).add(new THREE.Vector3(...directions[view]).multiplyScalar(radius));
  camera.near = 0.1;
  camera.far = Math.max(10000, radius * 50);
  camera.updateProjectionMatrix();
  orbit.target.copy(center); orbit.update();
  all('[data-view]').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.view === view));
    button.classList.toggle('active', button.dataset.view === view);
  });
}
function download(data, filename, type) {
  const blob = new Blob([data], {type});
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a'); link.href = url; link.download = filename;
  document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 30000);
}
function filename() { return (project.name.replace(/[^a-z0-9 _-]/gi, '').trim() || 'design').slice(0, 80); }
function saveProject() {
  download(snapshot(), filename() + '.form3d', 'application/json');
  message('Editable project downloaded. Open it here to continue later.');
}
function exportModel() {
  try {
    download(exportSTL(project.bodies), filename() + '.stl', 'model/stl');
    message('STL exported in millimeters. Check your slicer preview before printing.', true);
  } catch (error) { message(error.message, true); }
}
function confirmChange(title, text, action) {
  pendingConfirmation = action;
  $('confirm-title').textContent = title; $('confirm-message').textContent = text;
  $('confirm-dialog').showModal();
}
function newProject() {
  const create = () => {
    cancelSketch();
    mutate(() => { project = {version: 1, units: 'mm', name: 'Untitled design', bodies: []}; selected.clear(); }, 'Empty workspace ready. Add a shape or sketch a profile.');
    $('welcome-card').hidden = false; fit();
  };
  if (project.bodies.length) confirmChange('Start a new design?', 'This replaces the browser’s autosaved design. Download your current project first if you want a separate copy. You can also undo this change.', create);
  else create();
}
function example(kind, initial = false) {
  const load = () => {
    if (sketch) cancelSketch();
    const color = '#5687bd';
    const box = (name, dimensions, position) => createBody('box', {name, dimensions, position, color});
    const cylinder = (dimensions, position, rotation = [0, 0, 0]) => createBody('cylinder', {dimensions, position, rotation, color});
    let body, name;
    try {
      if (kind === 'bracket') {
        const joined = combineBodies([box('Base', [68, 48, 8], [0, 0, 4]), box('Back', [68, 8, 48], [0, 20, 28])], 'union');
        body = combineBodies([joined, cylinder([10, 10, 12], [-22, -8, 4]), cylinder([10, 10, 12], [22, -8, 4]), cylinder([17, 17, 14], [0, 20, 33], [90, 0, 0])], 'subtract');
        name = 'Mounting bracket';
      } else if (kind === 'vase') {
        body = combineBodies([cylinder([44, 44, 60], [0, 0, 30]), cylinder([36, 36, 60], [0, 0, 35])], 'subtract');
        name = 'Desktop pencil cup';
      } else {
        const sphere = createBody('sphere', {dimensions: [32, 32, 32], position: [0, 0, 58], color});
        body = combineBodies([box('Base', [64, 44, 10], [0, 0, 5]), cylinder([20, 20, 40], [0, 0, 28]), sphere], 'union');
        name = 'Classroom trophy';
      }
      body.name = name;
      if (!initial) remember();
      project = {version: 1, units: 'mm', name, bodies: [body]};
      selected.clear(); rebuild(); persist(); fit();
      if (!initial) { $('welcome-card').hidden = true; message(`${name} loaded. Select the body to make it your own.`); }
    } catch (error) { message(error.message, true); }
  };
  if (!initial && project.bodies.length) confirmChange('Load an example?', 'The example replaces your current design. Save a project copy first if needed. You can undo this change.', load);
  else load();
}
function snap(value) {
  if (!$('snap-enabled').checked) return value;
  const step = Math.max(0.1, Number($('snap-step').value) || 1);
  return Math.round(value / step) * step;
}
function worldPoint(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.set((event.clientX - rect.left) / rect.width * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
  raycaster.setFromCamera(pointer, camera);
  const point = new THREE.Vector3();
  return raycaster.ray.intersectPlane(plane, point) ? [snap(point.x), snap(point.y)] : null;
}
function sketchInstruction() {
  if (!sketch) return '';
  return sketch.shape === 'polygon' ? 'Click corners on the grid. Finish with Extrude or Enter. At least 3 corners are needed.' : `Drag on the grid to draw a ${sketch.shape}. Then choose an extrusion height.`;
}
function startSketch() {
  if (sketch) return;
  mode = 'select';
  sketch = {shape: 'rectangle', points: [], start: null, current: null, drawing: false};
  selected.clear(); transform.detach();
  $('welcome-card').hidden = true; $('sketch-bar').hidden = false;
  viewport.classList.add('sketching');
  all('[data-sketch]').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.sketch === 'rectangle'));
    button.classList.toggle('active', button.dataset.sketch === 'rectangle');
  });
  all('[data-tool]').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.tool === mode));
    button.classList.toggle('active', button.dataset.tool === mode);
  });
  fit('top'); orbit.enabled = false; refresh(); message(sketchInstruction(), true);
}
function cancelSketch() {
  if (!sketch) return;
  sketch = null; clearGroup(sketchGroup); $('sketch-bar').hidden = true;
  viewport.classList.remove('sketching'); orbit.enabled = true; refresh();
  message('Sketch closed.');
}
function sketchOutline() {
  if (!sketch) return [];
  if (sketch.shape === 'polygon') return [...sketch.points, ...(sketch.current ? [sketch.current] : [])];
  if (!sketch.start || !sketch.current) return [];
  const [x, y] = sketch.start, [cx, cy] = sketch.current;
  if (sketch.shape === 'circle') {
    const radius = Math.hypot(cx - x, cy - y);
    return Array.from({length: 65}, (_, i) => [x + radius * Math.cos(i / 64 * Math.PI * 2), y + radius * Math.sin(i / 64 * Math.PI * 2)]);
  }
  return [[x, y], [cx, y], [cx, cy], [x, cy], [x, y]];
}
function drawSketch() {
  renderRequested = true;
  clearGroup(sketchGroup);
  const points = sketchOutline();
  if (!points.length) return;
  const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points.map(p => new THREE.Vector3(p[0], p[1], 0.2))), new THREE.LineBasicMaterial({color: '#16766e', depthTest: false}));
  line.renderOrder = 15; sketchGroup.add(line);
  const solidPoints = sketch.shape === 'polygon' ? sketch.points : points.slice(0, -1);
  if (solidPoints.length >= 3) {
    const shape = new THREE.Shape(solidPoints.map(p => new THREE.Vector2(...p)));
    const fill = new THREE.Mesh(new THREE.ShapeGeometry(shape), new THREE.MeshBasicMaterial({color: '#349d8e', opacity: 0.16, transparent: true, side: THREE.DoubleSide, depthWrite: false}));
    fill.position.z = 0.15; sketchGroup.add(fill);
  }
  $('sketch-hint').textContent = sketch.shape === 'polygon' ? `${sketch.points.length} corners · click to add, Enter to extrude` : sketch.shape === 'circle' ? `Radius ${Math.hypot(sketch.current[0] - sketch.start[0], sketch.current[1] - sketch.start[1]).toFixed(1)} mm` : `${Math.abs(sketch.current[0] - sketch.start[0]).toFixed(1)} × ${Math.abs(sketch.current[1] - sketch.start[1]).toFixed(1)} mm`;
}
function finishSketch() {
  if (!sketch) return;
  const height = Number($('sketch-height').value);
  if (!Number.isFinite(height) || height < 0.1 || height > 10000) { message('Choose an extrusion height between 0.1 and 10,000 mm.', true); return; }
  let body;
  try {
    if (sketch.shape === 'circle' && sketch.start && sketch.current) {
      const radius = Math.hypot(sketch.current[0] - sketch.start[0], sketch.current[1] - sketch.start[1]);
      if (radius < 0.1) throw Error('Draw a larger circle before extruding.');
      body = createBody('cylinder', {name: 'Circle extrusion', dimensions: [radius * 2, radius * 2, height], position: [...sketch.start, height / 2], color: palette[project.bodies.length % palette.length]});
    } else {
      const points = sketch.shape === 'polygon' ? sketch.points : sketchOutline().slice(0, -1);
      if (points.length < 3) throw Error('Draw a profile with at least three corners before extruding.');
      const xs = points.map(p => p[0]), ys = points.map(p => p[1]);
      const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
      if (maxX - minX < 0.1 || maxY - minY < 0.1) throw Error('Draw a profile with width and depth before extruding.');
      body = createBody('extrusion', {name: sketch.shape === 'polygon' ? 'Polygon extrusion' : 'Rectangle extrusion', points, dimensions: [maxX - minX, maxY - minY, height], position: [(minX + maxX) / 2, (minY + maxY) / 2, height / 2], color: palette[project.bodies.length % palette.length]});
    }
    // Build once before closing the sketch so an invalid polygon remains editable.
    const check = buildMesh(body); disposeObject(check);
    cancelSketch();
    mutate(() => { project.bodies.push(body); selected = new Set([body.id]); }, 'Sketch extruded into a solid body.');
    fit('iso'); setMode('move');
  } catch (error) { message(error.message, true); }
}
function setupScene() {
  renderer = new THREE.WebGLRenderer({antialias: true, alpha: false, preserveDrawingBuffer: true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor('#eef2f5');
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.setAttribute('aria-label', 'Interactive 3D design canvas');
  renderer.domElement.setAttribute('tabindex', '0');
  viewport.prepend(renderer.domElement);
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(38, 1, 0.1, 10000); camera.up.set(0, 0, 1);
  camera.position.set(160, -200, 160);
  orbit = new OrbitControls(camera, renderer.domElement);
  orbit.enableDamping = true; orbit.dampingFactor = 0.12;
  orbit.maxPolarAngle = Math.PI * 0.495;
  orbit.minDistance = 5; orbit.maxDistance = 10000;
  orbit.mouseButtons = {LEFT: THREE.MOUSE.ROTATE, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.PAN};
  orbit.target.set(0, 0, 20);
  orbit.addEventListener('change', () => { renderRequested = true; });
  scene.add(new THREE.HemisphereLight('#ffffff', '#a7b7c4', 2.3));
  const sun = new THREE.DirectionalLight('#fff9ef', 3.1); sun.position.set(-80, -120, 220); sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -220; sun.shadow.camera.right = 220; sun.shadow.camera.top = 220; sun.shadow.camera.bottom = -220;
  sun.shadow.normalBias = 0.15;
  scene.add(sun);
  const fill = new THREE.DirectionalLight('#d9edff', 1.3); fill.position.set(130, 60, 100); scene.add(fill);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(4000, 4000), new THREE.ShadowMaterial({color: '#65819a', opacity: 0.13}));
  floor.position.z = -0.08; floor.receiveShadow = true; scene.add(floor);
  grid = new THREE.GridHelper(1000, 100, '#c1ccd6', '#dae1e7'); grid.rotation.x = Math.PI / 2;
  grid.material.transparent = true; grid.material.opacity = 0.75; scene.add(grid);
  const axisMaterial = color => new THREE.LineBasicMaterial({color, transparent: true, opacity: 0.42});
  const xLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-500, 0, 0.02), new THREE.Vector3(500, 0, 0.02)]), axisMaterial('#bf7778'));
  const yLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, -500, 0.02), new THREE.Vector3(0, 500, 0.02)]), axisMaterial('#72a691'));
  scene.add(xLine, yLine);
  grid.userData.axes = [xLine, yLine];
  bodyGroup = new THREE.Group(); selectionGroup = new THREE.Group(); sketchGroup = new THREE.Group();
  scene.add(bodyGroup, selectionGroup, sketchGroup);
  transform = new TransformControls(camera, renderer.domElement);
  transform.setSize(0.85); transform.setSpace('world'); scene.add(transform.getHelper());
  transform.addEventListener('change', () => { renderRequested = true; });
  transform.addEventListener('dragging-changed', event => { orbit.enabled = !event.value && !sketch; });
  transform.addEventListener('mouseDown', () => {
    transformSnapshot = {json: snapshot(), dimensions: selectionBodies()[0]?.dimensions.slice()};
  });
  transform.addEventListener('objectChange', () => {
    const body = selectionBodies()[0], mesh = transform.object;
    if (!body || !mesh || !transformSnapshot) return;
    body.position = mesh.position.toArray().map(n => Number(n.toFixed(4)));
    body.rotation = [mesh.rotation.x, mesh.rotation.y, mesh.rotation.z].map(n => Number(THREE.MathUtils.radToDeg(n).toFixed(4)));
    body.dimensions = transformSnapshot.dimensions.map((n, i) => Math.max(0.1, Math.min(10000, n * mesh.scale.getComponent(i))));
    all('[data-position]').forEach(input => { input.value = body.position[Number(input.dataset.position)].toFixed(2); });
    all('[data-rotation]').forEach(input => { input.value = body.rotation[Number(input.dataset.rotation)].toFixed(2); });
    all('[data-dimension]').forEach(input => { input.value = body.dimensions[Number(input.dataset.dimension)].toFixed(2); });
    updateOutline();
  });
  transform.addEventListener('mouseUp', () => {
    if (transformSnapshot && transformSnapshot.json !== snapshot()) {
      remember(transformSnapshot.json); rebuild(); persist();
    }
    transformSnapshot = null;
  });
  const updateSnap = () => {
    const step = Math.max(0.1, Number($('snap-step').value) || 1);
    transform.setTranslationSnap($('snap-enabled').checked ? step : null);
    transform.setRotationSnap($('snap-enabled').checked ? Math.PI / 12 : null);
    transform.setScaleSnap($('snap-enabled').checked ? 0.1 : null);
  };
  $('snap-enabled').addEventListener('change', updateSnap); $('snap-step').addEventListener('change', updateSnap); updateSnap();
  const resize = () => {
    const {width, height} = viewport.getBoundingClientRect();
    renderer.setSize(Math.max(1, width), Math.max(1, height));
    camera.aspect = width / Math.max(1, height); camera.updateProjectionMatrix();
    renderRequested = true;
  };
  new ResizeObserver(resize).observe(viewport); resize();
  renderer.setAnimationLoop(() => {
    if (document.hidden) return;
    orbit.update();
    if (renderRequested) { renderer.render(scene, camera); renderRequested = false; }
  });
  renderer.domElement.addEventListener('contextmenu', e => e.preventDefault());
  renderer.domElement.addEventListener('pointerdown', event => {
    pointerStart = {x: event.clientX, y: event.clientY, button: event.button};
    if (!sketch || event.button !== 0) return;
    const point = worldPoint(event); if (!point) return;
    if (sketch.shape === 'polygon') {
      if (sketch.points.length >= 256) { message('A sketch can have at most 256 corners.'); return; }
      if (sketch.points.length >= 3 && Math.hypot(point[0] - sketch.points[0][0], point[1] - sketch.points[0][1]) < 1) { finishSketch(); return; }
      sketch.points.push(point); sketch.current = null;
    } else { sketch.start = point; sketch.current = point; sketch.drawing = true; }
    renderer.domElement.setPointerCapture(event.pointerId); drawSketch();
  });
  renderer.domElement.addEventListener('pointermove', event => {
    const point = worldPoint(event);
    if (point) $('cursor-position').textContent = `X ${point[0].toFixed(1)}  Y ${point[1].toFixed(1)} mm`;
    if (!sketch || !point || (!sketch.drawing && sketch.shape !== 'polygon')) return;
    sketch.current = point; drawSketch();
  });
  renderer.domElement.addEventListener('pointerup', event => {
    if (renderer.domElement.hasPointerCapture(event.pointerId)) renderer.domElement.releasePointerCapture(event.pointerId);
    if (sketch) { sketch.drawing = false; return; }
    if (!pointerStart || pointerStart.button !== 0 || Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y) > 5 || transform.dragging || transform.axis) return;
    worldPoint(event);
    const hit = raycaster.intersectObjects([...meshes.values()].filter(mesh => mesh.visible), false)[0];
    select(hit?.object.userData.bodyId, event.shiftKey || event.metaKey || event.ctrlKey);
  });
  renderer.domElement.addEventListener('webglcontextlost', event => {
    event.preventDefault(); message('The 3D view was interrupted. Download your project, then reload the page.', true);
  });
}

function bindUI() {
  all('[data-add]').forEach(button => button.addEventListener('click', () => addShape(button.dataset.add)));
  all('[data-tool]').forEach(button => button.addEventListener('click', () => setMode(button.dataset.tool)));
  all('[data-view]').forEach(button => button.addEventListener('click', () => { if (sketch) cancelSketch(); fit(button.dataset.view); }));
  all('[data-boolean]').forEach(button => button.addEventListener('click', () => boolean(button.dataset.boolean)));
  all('[data-example]').forEach(button => button.addEventListener('click', () => example(button.dataset.example)));
  $('dismiss-welcome').addEventListener('click', () => { $('welcome-card').hidden = true; });
  $('undo').addEventListener('click', () => restoreFromHistory('undo'));
  $('redo').addEventListener('click', () => restoreFromHistory('redo'));
  $('duplicate').addEventListener('click', duplicate); $('delete-body').addEventListener('click', removeSelected);
  $('fit-view').addEventListener('click', () => fit('iso'));
  $('grid-enabled').addEventListener('change', () => { grid.visible = $('grid-enabled').checked; grid.userData.axes.forEach(axis => { axis.visible = grid.visible; }); renderRequested = true; });
  $('project-name').addEventListener('change', () => mutate(() => { project.name = $('project-name').value.trim().slice(0, 80) || 'Untitled design'; }));
  $('body-name').addEventListener('change', () => mutate(() => { const b = editableBodies()[0]; if (b) b.name = $('body-name').value.trim().slice(0, 80) || b.type; }));
  $('body-color').addEventListener('change', () => mutate(() => { const b = editableBodies()[0]; if (b) b.color = $('body-color').value; }));
  for (const [attribute, property] of [['dimension', 'dimensions'], ['position', 'position'], ['rotation', 'rotation']]) {
    all(`[data-${attribute}]`).forEach(input => input.addEventListener('change', () => {
      const value = Number(input.value), body = editableBodies()[0];
      if (!body || !Number.isFinite(value) || (attribute === 'dimension' && (value < 0.1 || value > 10000)) || Math.abs(value) > 100000) {
        message('Enter a valid measurement. Dimensions must be 0.1–10,000 mm.'); refresh(); return;
      }
      mutate(() => { body[property][Number(input.dataset[attribute])] = value; });
    }));
  }
  $('drop-body').addEventListener('click', () => mutate(() => {
    const body = editableBodies()[0]; if (!body) return;
    const bounds = calculateBounds([body]); body.position[2] -= bounds.min[2];
  }, 'Body placed on the grid.'));
  $('center-body').addEventListener('click', () => mutate(() => {
    const body = editableBodies()[0]; if (body) { body.position[0] = 0; body.position[1] = 0; }
  }, 'Body centered on the workplane.'));
  $('new-project').addEventListener('click', newProject);
  $('save-project').addEventListener('click', saveProject); $('export-stl').addEventListener('click', exportModel);
  $('open-project').addEventListener('click', () => $('file-input').click());
  $('file-input').addEventListener('change', async event => {
    const file = event.target.files[0]; if (!file) return;
    try {
      if (file.size > 20 * 1024 * 1024) throw Error('Project files must be smaller than 20 MB.');
      const imported = parseProject(await file.text());
      // Validate geometry before replacing the current project.
      for (const body of imported.bodies) { const mesh = buildMesh(body); disposeObject(mesh); }
      const load = () => { cancelSketch(); mutate(() => { project = imported; selected.clear(); }, 'Project opened.'); $('welcome-card').hidden = true; fit(); };
      if (project.bodies.length) confirmChange('Open this project?', 'This replaces the current browser autosave. Download your current project first if you need a copy. You can undo opening the file.', load); else load();
    } catch (error) { message('Could not open project: ' + error.message, true); }
    event.target.value = '';
  });
  $('confirm-accept').addEventListener('click', () => { $('confirm-dialog').close(); const action = pendingConfirmation; pendingConfirmation = null; action?.(); });
  $('confirm-cancel').addEventListener('click', () => { pendingConfirmation = null; $('confirm-dialog').close(); });
  $('confirm-dialog').addEventListener('cancel', () => { pendingConfirmation = null; });
  $('help-button').addEventListener('click', () => $('help-dialog').showModal());
  all('[data-close-help]').forEach(button => button.addEventListener('click', () => $('help-dialog').close()));
  $('panel-toggle').addEventListener('click', () => {
    const open = document.body.classList.toggle('panel-open');
    $('panel-toggle').setAttribute('aria-expanded', String(open));
  });
  $('sketch-start').addEventListener('click', startSketch);
  $('sketch-cancel').addEventListener('click', cancelSketch); $('sketch-finish').addEventListener('click', finishSketch);
  all('[data-sketch]').forEach(button => button.addEventListener('click', () => {
    if (!sketch) return;
    sketch = {shape: button.dataset.sketch, points: [], start: null, current: null, drawing: false};
    clearGroup(sketchGroup);
    all('[data-sketch]').forEach(b => {
      b.setAttribute('aria-pressed', String(b === button));
      b.classList.toggle('active', b === button);
    });
    $('sketch-hint').textContent = sketchInstruction(); message(sketchInstruction(), true);
  }));
  document.addEventListener('keydown', event => {
    const editing = event.target.closest('input, textarea, select, [contenteditable="true"]');
    if (editing || $('help-dialog').open || $('confirm-dialog').open) return;
    const key = event.key.toLowerCase(), command = event.ctrlKey || event.metaKey;
    if (command && key === 's') { event.preventDefault(); saveProject(); return; }
    if (command && key === 'z') { event.preventDefault(); restoreFromHistory(event.shiftKey ? 'redo' : 'undo'); return; }
    if (command && key === 'y') { event.preventDefault(); restoreFromHistory('redo'); return; }
    if (command && key === 'd') { event.preventDefault(); duplicate(); return; }
    if (command && key === 'a') { event.preventDefault(); selected = new Set(project.bodies.filter(b => b.visible !== false).map(b => b.id)); refresh(); return; }
    if (command || event.altKey) return;
    if (event.key === 'Escape') { if (sketch) cancelSketch(); else select(null); return; }
    if (sketch && event.key === 'Enter') { event.preventDefault(); finishSketch(); return; }
    if (sketch) return;
    if (['Delete', 'Backspace'].includes(event.key)) { event.preventDefault(); removeSelected(); }
    if ({v: 'select', g: 'move', r: 'rotate', s: 'scale'}[key]) setMode({v: 'select', g: 'move', r: 'rotate', s: 'scale'}[key]);
    if (key === 'f') fit(); if (key === 'k') startSketch();
  });
  window.addEventListener('beforeunload', () => {
    if (storageAvailable) { try { localStorage.setItem(STORAGE_KEY, snapshot()); } catch {} }
  });
}

try {
  setupScene(); bindUI();
  let saved;
  try { saved = localStorage.getItem(STORAGE_KEY); }
  catch { storageAvailable = false; }
  if (saved) {
    try {
      project = parseProject(saved); rebuild(); fit();
      $('welcome-card').hidden = project.bodies.length > 0;
      $('save-status').textContent = 'Restored from this browser';
    } catch {
      // Preserve unreadable autosaves; the user can download/import a known good copy.
      storageAvailable = false;
      rebuild(); fit(); message('The saved design could not be restored. Use Open project to load a downloaded copy.', true);
      $('save-status').textContent = 'Saved design needs attention';
    }
  } else example('bracket', true);
  $('loading').hidden = true;
  document.documentElement.dataset.ready = 'true';
} catch (error) {
  console.error(error);
  $('loading').hidden = false;
  $('loading').replaceChildren();
  const title = document.createElement('strong'); title.textContent = 'The 3D workspace could not start';
  const detail = document.createElement('p'); detail.textContent = 'Use a browser with WebGL 2 enabled and hardware acceleration available, then reload. ' + error.message;
  $('loading').append(title, detail);
  $('loading').setAttribute('role', 'alert');
}
