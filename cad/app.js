import {THREE, OrbitControls, TransformControls} from './vendor/engine.js';
import {createBody, createTextBody, normalizeBodyParameters, buildMesh, cloneBody, combineBodies, calculateBounds, estimateVolume, serializeProject, parseProject, exportSTL} from './model.js';
import {moldCutters, moldCapacity} from './mold.js';
import {MEMORY_LIMITS, trimHistory} from './memory.js';
import {startMoldTask} from './mold-task.js';
import {alignBodies, distributeBodies, mirrorBodies, linearPattern, radialPattern, importSTL, summarizeBodies} from './operations.js';

const $ = id => document.getElementById(id);
const all = selector => [...document.querySelectorAll(selector)];
const STORAGE_KEY = 'dsteckler-form3d-v1';
const PREFERENCES_KEY = 'dsteckler-form3d-preferences';
const palette = ['#497cbd', '#e6a45f', '#69a79b', '#b08ac4', '#d37f76'];
let project = {version: 1, units: 'mm', name: 'Mounting bracket', bodies: []};
let selected = new Set(), meshes = new Map(), history = [], future = [];
let mode = 'select', sketch = null, transformSnapshot = null, saveTimer, statusTimer;
let storageAvailable = true, pendingConfirmation = null, renderRequested = true;
let renderer, scene, camera, perspectiveCamera, orthographicCamera, orbit, transform, bodyGroup, selectionGroup, sketchGroup, grid;
let experience = 'beginner', guideExpanded = true, guideProgress = new Set();
let measurementTimer, textTargetId = null, workplaneGrid = null;
const viewport = $('viewport');
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
let pointerStart = null;
let moldStroke = null, moldBusy = false, moldGroup, moldCursor, moldHover = null;
let textPreviewGroup = null, textPreviewTimer, textEditingId = null;
let moldBatchStrokes = 0, moldTask = null, moldPreviewFrame = null, moldPreviewAt = 0, projectRevision = 0;

function message(text, persistent = false) {
  clearTimeout(statusTimer);
  $('status-message').textContent = text;
  if (!persistent) statusTimer = setTimeout(() => {
    $('status-message').textContent = sketch ? sketchInstruction() : mode === 'mold' ? 'Drag on a shape to shave it. Release to apply. Undo restores each stroke.' : 'Ready to create. All dimensions are in millimeters.';
  }, 6000);
}

function snapshot() { return JSON.stringify(project); }
function remember(before = snapshot()) {
  if (history.at(-1) !== before) history.push(before);
  future = [];
  trimHistory(history, future);
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
  projectRevision++;
  if (moldCursor) moldCursor.visible = false;
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
    mesh.material.wireframe = $('wireframe-enabled')?.checked || false;
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
function preferences() {
  try { return JSON.parse(localStorage.getItem(PREFERENCES_KEY) || '{}') || {}; } catch { return {}; }
}
function savePreferences() {
  try { localStorage.setItem(PREFERENCES_KEY, JSON.stringify({experience, guideExpanded, guideProgress: [...guideProgress]})); } catch {}
}
function setExperience(value, announce = true) {
  experience = value === 'advanced' ? 'advanced' : 'beginner';
  document.body.dataset.experience = experience;
  $('experience-mode').value = experience;
  if (experience === 'beginner') {
    $('export-selected').checked = false;
    $('stl-units').value = 'mm';
    $('wireframe-enabled').checked = false;
    for (const mesh of meshes.values()) mesh.material.wireframe = false;
    setProjection('perspective');
  }
  savePreferences(); refresh();
  if (announce) message(experience === 'beginner' ? 'Beginner mode: start with a shape, then follow the guide. Your design is unchanged.' : 'Advanced mode: precision tools are available. Your design is unchanged.');
}
function markGuide(step) { guideProgress.add(step); savePreferences(); refreshGuide(); }
function refreshGuide() {
  if (!$('guide-steps')) return;
  $('guide-steps').hidden = !guideExpanded;
  $('guide-toggle').setAttribute('aria-expanded', String(guideExpanded));
  $('guide-toggle').textContent = guideExpanded ? 'Hide steps' : 'Show steps';
  $('guide-steps').replaceChildren();
  const steps = [
    ['start', 'Choose a starting shape', 'Add a box or use the example.', () => addShape('box')],
    ['size', 'Make it the right size', 'Select a body and enter exact dimensions.', () => {
      if (!selectionBodies().length && project.bodies.length) select(project.bodies.find(b => b.visible !== false)?.id);
      document.body.classList.add('panel-open'); $('panel-toggle').setAttribute('aria-expanded', 'true');
      if (selectionBodies().length === 1) all('[data-dimension]')[0].focus();
      else message('Select one visible body to change its size.');
    }],
    ['sketch', 'Try a sketch', 'Draw a profile and give it height.', startSketch],
    ['export', 'Save a printable copy', 'Export STL, then open it in your slicer.', exportModel]
  ];
  steps.forEach(([id, title, detail, action], index) => {
    const button = document.createElement('button'); button.type = 'button';
    button.className = 'guide-step' + (guideProgress.has(id) ? ' complete' : '');
    const number = document.createElement('span'); number.className = 'guide-step-number'; number.textContent = guideProgress.has(id) ? '✓' : index + 1;
    const copy = document.createElement('span'), heading = document.createElement('strong'), hint = document.createElement('small');
    heading.textContent = title; hint.textContent = detail; copy.append(heading, hint); button.append(number, copy);
    button.addEventListener('click', action); $('guide-steps').append(button);
  });
}
function scheduleMeasurements() {
  clearTimeout(measurementTimer);
  if (experience !== 'advanced') return;
  measurementTimer = setTimeout(() => {
    try {
      const bodies = selectionBodies(), summary = summarizeBodies(bodies.length ? bodies : project.bodies);
      $('measurement-size').textContent = summary.dimensions.map(n => n.toFixed(2)).join(' × ') + ' mm';
      $('measurement-volume').textContent = (summary.estimatedVolume / 1000).toFixed(3) + ' cm³';
      $('measurement-triangles').textContent = summary.triangleCount.toLocaleString() + ' triangles';
      $('measurement-distance').textContent = summary.centerDistance == null ? 'Select two bodies' : summary.centerDistance.toFixed(2) + ' mm between centers';
    } catch (error) { $('measurement-size').textContent = error.message; }
  }, 100);
}
function replaceBodies(updated) {
  const replacements = new Map(updated.map(body => [body.id, body]));
  project.bodies = project.bodies.map(body => replacements.get(body.id) || body);
}
function runAlignment(axis, anchor) {
  mutate(() => replaceBodies(alignBodies(selectionBodies(), Number(axis), anchor)), 'Bodies aligned to the first selected body.');
}
function runDistribution(axis) {
  mutate(() => replaceBodies(distributeBodies(selectionBodies(), Number(axis))), 'Body centers distributed evenly; the endpoints stayed fixed.');
}
function runMirror(axis) {
  mutate(() => {
    const copies = mirrorBodies(selectionBodies(), Number(axis));
    project.bodies.push(...copies); selected = new Set(copies.map(body => body.id));
  }, 'Mirrored copies created across the selection’s center plane. Originals are unchanged.');
}
function openPattern() {
  if (!selectionBodies().length) return;
  $('pattern-feedback').textContent = '';
  $('pattern-dialog').showModal();
}
function createPattern() {
  const source = selectionBodies();
  try {
    const options = {count: Number($('pattern-count').value), axis: Number($('pattern-axis').value), spacing: Number($('pattern-spacing').value), angle: Number($('pattern-angle').value)};
    if ($('pattern-center').value === 'origin') options.center = [0, 0, 0];
    const copies = $('pattern-type').value === 'radial' ? radialPattern(source, options) : linearPattern(source, options);
    if (project.bodies.length + copies.length > 100) throw Error('This pattern would exceed the 100-body project limit. Use fewer instances.');
    if (mutate(() => { project.bodies.push(...copies); selected = new Set([...source, ...copies].map(b => b.id)); }, 'Pattern created. Each copy remains editable.')) {
      $('pattern-dialog').close(); fit();
    }
  } catch (error) { $('pattern-feedback').textContent = error.message; }
}
function openText() {
  if (moldBusy) return;
  setMode('select');
  const bodies = editableBodies();
  textTargetId = bodies.length === 1 && selectionBodies().length === 1 ? bodies[0].id : null;
  const editing = bodies.length === 1 && bodies[0].type === 'text' ? bodies[0] : null;
  textEditingId = editing?.id || null;
  if (editing) textTargetId = null;
  $('text-content').value = editing?.text || '';
  $('text-height').value = editing?.dimensions[1] || 10;
  $('text-depth').value = editing?.dimensions[2] || 2;
  $('text-action').value = textTargetId ? 'raised' : 'standalone';
  $('text-fit').checked = true;
  $('text-fit-field').hidden = !textTargetId;
  $('text-target-note').textContent = editing ? 'Edit the words and press Enter to update this text.' : textTargetId ? `Lettering will be centered on the flat top of “${bodies[0].name}”. Fit to shape keeps it within the edges.` : 'Type your words and press Enter. Select a shape first to put raised or engraved lettering on its flat top.';
  [...$('text-action').options].forEach(option => { option.disabled = option.value !== 'standalone' && !textTargetId; });
  $('text-feedback').textContent = ''; $('text-dialog').showModal();
  updateTextPreview(); $('text-content').focus();
}
function textDraft() {
  const content = $('text-content').value.trim(), height = Number($('text-height').value), depth = Number($('text-depth').value);
  if (!content || content.length > 40) throw Error('Enter 1–40 characters for the lettering.');
  if (!Number.isFinite(height) || height < 0.5 || height > 1000 || !Number.isFinite(depth) || depth < 0.1 || depth > 1000) throw Error('Choose letter height 0.5–1,000 mm and thickness 0.1–1,000 mm.');
  const action = $('text-action').value;
  const body = createTextBody(content, {height, depth, name:content, color:palette[project.bodies.length % palette.length]});
  let target;
  if (textEditingId) {
    const existing = project.bodies.find(b => b.id === textEditingId);
    if (!existing || existing.locked || existing.visible === false) throw Error('Select visible, unlocked text to edit.');
    Object.assign(body, {id:existing.id, color:existing.color, position:existing.position.slice(), rotation:existing.rotation.slice()});
    const normal = new THREE.Vector3(0, 0, 1).applyEuler(new THREE.Euler(...existing.rotation.map(THREE.MathUtils.degToRad)));
    body.position = new THREE.Vector3(...existing.position).addScaledVector(normal, (depth - existing.dimensions[2]) / 2).toArray();
  } else if (action !== 'standalone') {
    target = project.bodies.find(b => b.id === textTargetId);
    if (!target || target.locked || target.visible === false) throw Error('Select one visible, unlocked body before opening the text tool.');
    const bounds = calculateBounds([target]);
    if ($('text-fit').checked) {
      const shrink = Math.min(1, bounds.size[0] * 0.85 / body.dimensions[0], bounds.size[1] * 0.8 / body.dimensions[1]);
      body.dimensions[0] *= shrink; body.dimensions[1] *= shrink;
    }
    if (Math.min(body.dimensions[0], body.dimensions[1]) < 0.1) throw Error('The selected top surface is too small for this text.');
    body.position = [bounds.center[0], bounds.center[1], action === 'raised' ? bounds.max[2] + depth / 2 - Math.min(0.3, depth * 0.2) : bounds.max[2] - depth / 2 + Math.min(0.2, depth * 0.1)];
    body.color = target.color;
  } else if (project.bodies.length) {
    const bounds = calculateBounds(project.bodies);
    body.position = [bounds.max[0] + body.dimensions[0] / 2 + 5, bounds.center[1], depth / 2];
  }
  return {body, target, action};
}
function clearTextPreview() {
  clearTimeout(textPreviewTimer);
  if (textPreviewGroup) { scene.remove(textPreviewGroup); disposeObject(textPreviewGroup); textPreviewGroup = null; }
  renderRequested = true;
}
function updateTextPreview() {
  clearTextPreview();
  const content = $('text-content').value.trim();
  $('text-preview-words').textContent = content || 'Your text';
  $('text-fit-field').hidden = !textTargetId || $('text-action').value === 'standalone';
  $('text-submit').lastChild.textContent = textEditingId ? 'Update text' : 'Add text';
  if (!content) { $('text-submit').disabled = true; $('text-preview-size').textContent = 'Type above to preview your lettering'; $('text-feedback').textContent = ''; return; }
  try {
    const {body} = textDraft();
    $('text-submit').disabled = false; $('text-feedback').textContent = '';
    $('text-preview-size').textContent = body.dimensions.map(n => Number(n.toFixed(1))).join(' × ') + ' mm';
    textPreviewGroup = new THREE.Group();
    const mesh = buildMesh(body); mesh.material.transparent = true; mesh.material.opacity = 0.6;
    mesh.material.color.set('#d28a39'); mesh.material.depthTest = false; mesh.renderOrder = 30;
    textPreviewGroup.add(mesh); scene.add(textPreviewGroup); renderRequested = true;
  } catch (error) { $('text-submit').disabled = true; $('text-feedback').textContent = error.message; }
}

function addText() {
  try {
    const {body, target, action} = textDraft();
    if (mutate(() => {
      if (textEditingId) { replaceBodies([body]); selected = new Set([body.id]); }
      else if (!target) { project.bodies.push(body); selected = new Set([body.id]); }
      else {
        const targetVolume = estimateVolume(target), textVolume = estimateVolume(body);
        const result = combineBodies([target, body], action === 'raised' ? 'union' : 'subtract');
        const resultVolume = estimateVolume(result), tolerance = Math.max(0.00001, textVolume * 0.0001);
        if ((action === 'engraved' && targetVolume - resultVolume <= tolerance) || (action === 'raised' && targetVolume + textVolume - resultVolume <= tolerance)) {
          throw Error('The lettering did not touch a solid top surface. Select a flat, upward-facing plaque or add standalone text.');
        }
        result.name = (target.name + (action === 'raised' ? ' lettered' : ' engraved')).slice(0, 80);
        project.bodies = project.bodies.filter(b => b.id !== target.id); project.bodies.push(result); selected = new Set([result.id]);
      }
    }, action === 'standalone' ? '3D lettering added. Edit its words in Properties.' : 'Lettering applied. Undo restores the original body.')) {
      $('text-dialog').close(); $('welcome-card').hidden = true; setMode('move'); fit(); markGuide('start');
    } else $('text-feedback').textContent = $('status-message').textContent;
  } catch (error) { $('text-feedback').textContent = error.message; }
}
function refresh() {
  renderRequested = true;
  const bodies = selectionBodies();
  $('project-name').value = project.name;
  $('body-count').textContent = project.bodies.length;
  $('selected-count').textContent = bodies.length ? `${bodies.length} selected` : 'No selection';
  $('undo').disabled = moldBusy || history.length === 0;
  $('mold-undo').disabled = moldBusy || history.length === 0;
  $('redo').disabled = moldBusy || future.length === 0;
  $('delete-body').disabled = editableBodies().length === 0;
  $('duplicate').disabled = bodies.length === 0;
  all('[data-boolean]').forEach(button => { button.disabled = bodies.length < 2 || bodies.some(b => b.locked); });
  $('export-stl').disabled = !project.bodies.some(b => b.visible !== false);
  if ($('export-selected')?.checked) $('export-stl').disabled = bodies.length === 0;
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
    const radius = body.type === 'roundedbox', wall = body.type === 'tube', text = body.type === 'text';
    $('shape-parameters').hidden = !(radius || wall || text);
    $('radius-field').hidden = !radius; $('wall-field').hidden = !wall; $('body-text-field').hidden = !text;
    if (radius) { $('corner-radius').value = body.params.radius; $('corner-radius').max = Math.min(...body.dimensions) / 2; }
    if (wall) { $('tube-wall').value = body.params.wall; $('tube-wall').max = Math.min(body.dimensions[0], body.dimensions[1]) / 2 - 0.01; }
    if (text) $('body-text').value = body.text;
    for (const id of ['corner-radius', 'tube-wall', 'body-text']) $(id).disabled = Boolean(body.locked);
  }
  $('multi-properties').hidden = bodies.length === 0;
  all('[data-align-axis]').forEach(button => { button.disabled = bodies.length < 2 || bodies.slice(1).some(b => b.locked); });
  all('[data-distribute]').forEach(button => { button.disabled = bodies.length < 3 || bodies.some(b => b.locked); });
  all('[data-mirror]').forEach(button => { button.disabled = bodies.length === 0; });
  $('pattern-start').disabled = bodies.length === 0;
  scheduleMeasurements(); refreshGuide(); refreshMoldBudget();
  renderBodyList();
  updateOutline();
  if (bodies.length === 1 && !bodies[0].locked && ['move', 'rotate', 'scale'].includes(mode) && !sketch) {
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
  if (moldBusy) return false;
  if (moldStroke) cancelMoldStroke();
  const before = snapshot();
  try {
    action();
    for (const body of project.bodies) normalizeBodyParameters(body);
    // Validate a complete document before committing it to browser storage.
    project = parseProject(project);
    remember(before);
    rebuild(); persist();
    if (text) message(text);
    return true;
  } catch (error) {
    project = parseProject(before);
    rebuild(); message(error.message || 'That change could not be completed.', true);
    return false;
  }
}
function restoreFromHistory(direction) {
  if (moldBusy) return;
  cancelMoldStroke();
  if (sketch) cancelSketch();
  const from = direction === 'undo' ? history : future;
  const to = direction === 'undo' ? future : history;
  if (!from.length) return;
  const next = from.pop();
  to.push(snapshot()); trimHistory(history, future, to); project = parseProject(next);
  selected.clear(); rebuild(); persist(); message(direction === 'undo' ? 'Change undone.' : 'Change restored.');
}
function setMode(next) {
  if (moldBusy) return;
  cancelMoldStroke();
  if (sketch) cancelSketch();
  mode = next;
  $('mold-bar').hidden = mode !== 'mold';
  viewport.classList.toggle('molding', mode === 'mold');
  $('mold-start').setAttribute('aria-pressed', String(mode === 'mold'));
  orbit.enableRotate = mode !== 'mold';
  if (moldCursor) moldCursor.visible = false;
  all('[data-tool]').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.tool === mode));
    button.classList.toggle('active', button.dataset.tool === mode);
  });
  refresh();
  if (mode === 'mold') { $('welcome-card').hidden = true; message('Drag on a shape to shave it. Release to apply. Undo restores each stroke.', true); }
  else if (mode !== 'select') message(`Select one body to ${mode}. Drag a colored handle to edit that axis.`);
}
function addShape(type) {
  if (moldBusy) return;
  if (mode === 'mold') setMode('select');
  if (sketch) cancelSketch();
  const count = project.bodies.filter(b => b.type === type).length;
  const names = {box: 'Box', cylinder: 'Cylinder', sphere: 'Sphere', cone: 'Cone', torus: 'Ring', roundedbox: 'Rounded box', tube: 'Tube', wedge: 'Wedge'};
  const dimensions = type === 'torus' ? [36, 36, 10] : type === 'roundedbox' ? [40, 30, 20] : [30, 30, 30];
  const offset = Math.min(project.bodies.length, 10) * 6;
  const body = createBody(type, {name: `${names[type]} ${count + 1}`, dimensions, position: [offset, offset, dimensions[2] / 2], color: palette[project.bodies.length % palette.length]});
  if (!mutate(() => { project.bodies.push(body); selected = new Set([body.id]); }, `${names[type]} added. Set exact dimensions in the inspector.`)) return;
  $('welcome-card').hidden = true;
  setMode('move');
  markGuide('start');
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
  const bodies = structuredClone(selectionBodies()), sourceIds = new Set(bodies.map(b => b.id));
  if (bodies.length < 2 || bodies.some(b => b.locked)) return;
  message('Calculating solid…', true);
  requestAnimationFrame(() => {
    mutate(() => {
      if (bodies.some(body => !project.bodies.some(current => current.id === body.id))) throw Error('The source selection changed. Select the bodies and try again.');
      const result = combineBodies(bodies, operation);
      result.name = {union: 'Joined body', subtract: bodies[0].name.slice(0, 76) + ' cut', intersect: 'Intersection'}[operation];
      project.bodies = project.bodies.filter(b => !sourceIds.has(b.id));
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
  orbit.maxDistance = Math.max(10000, radius * 5);
  if (camera.isOrthographicCamera) {
    const aspect = viewport.clientWidth / Math.max(1, viewport.clientHeight);
    const half = Math.max(45, ...bounds.size) * 0.9;
    camera.left = -half * aspect; camera.right = half * aspect; camera.top = half; camera.bottom = -half; camera.zoom = 1;
  }
  camera.updateProjectionMatrix();
  orbit.target.copy(center); orbit.update();
  all('[data-view]').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.view === view));
    button.classList.toggle('active', button.dataset.view === view);
  });
  renderRequested = true;
}
function setProjection(value) {
  const next = value === 'orthographic' ? orthographicCamera : perspectiveCamera;
  if (next === camera) return;
  const distance = camera.position.distanceTo(orbit.target), aspect = viewport.clientWidth / Math.max(1, viewport.clientHeight);
  const half = camera.isPerspectiveCamera ? distance * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) : (camera.top - camera.bottom) / (2 * camera.zoom);
  next.position.copy(camera.position); next.up.copy(camera.up); next.quaternion.copy(camera.quaternion);
  if (next.isOrthographicCamera) {
    next.left = -half * aspect; next.right = half * aspect; next.top = half; next.bottom = -half; next.zoom = 1;
  } else {
    const direction = next.position.clone().sub(orbit.target).normalize();
    next.position.copy(orbit.target).addScaledVector(direction, half / Math.tan(THREE.MathUtils.degToRad(next.fov / 2)));
    next.aspect = aspect;
  }
  next.near = camera.near; next.far = camera.far; next.updateProjectionMatrix();
  camera = next; orbit.object = camera; transform.camera = camera;
  if (sketch) orientToSketch(); else orbit.update();
  $('projection-mode').value = value;
  document.querySelector('.workspace-label').textContent = (camera.isOrthographicCamera ? 'ORTHOGRAPHIC' : 'PERSPECTIVE') + ' · MILLIMETERS';
  renderRequested = true;
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
    const bodies = experience === 'advanced' && $('export-selected').checked ? selectionBodies() : project.bodies;
    download(exportSTL(bodies), filename() + '.stl', 'model/stl');
    markGuide('export');
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
function refreshMoldBudget() {
  $('mold-stroke-count').textContent = `${moldBatchStrokes} / ${MEMORY_LIMITS.moldStrokes} strokes`;
  $('mold-next-batch').disabled = moldBusy || moldBatchStrokes === 0;
  $('mold-done').disabled = moldBusy;
  $('mold-cancel-task').hidden = !moldBusy;
  $('undo').disabled = moldBusy || history.length === 0;
  $('mold-undo').disabled = moldBusy || history.length === 0;
  $('redo').disabled = moldBusy || future.length === 0;
  for (const id of ['mold-size', 'mold-depth', 'mold-through']) $(id).disabled = moldBusy || (id === 'mold-depth' && $('mold-through').checked);
  if (mode !== 'mold') return;
  const body = selectionBodies().length === 1 ? selectionBodies()[0] : null;
  const capacity = moldCapacity(project.bodies, body);
  $('mold-next-batch').disabled ||= !capacity.allowed;
  const full = moldBatchStrokes >= MEMORY_LIMITS.moldStrokes;
  $('mold-budget').textContent = !capacity.allowed ? capacity.reason : full ? 'Batch complete. Keep your cuts and clear Undo to continue.' : 'Use short strokes. Up to five strokes per batch.';
  $('mold-budget').classList.toggle('at-limit', !capacity.allowed || full);
}
function nextMoldBatch() {
  if (moldBusy || moldBatchStrokes === 0) return;
  const capacity = moldCapacity(project.bodies, selectionBodies().length === 1 ? selectionBodies()[0] : null);
  if (!capacity.allowed) { message(capacity.reason, true); return; }
  cancelMoldStroke();
  history = []; future = []; moldBatchStrokes = 0;
  refresh(); persist();
  message('Cuts kept. Undo history cleared. A new five-stroke batch is ready.');
}
function moldSettings() {
  const diameter = Number($('mold-size').value), through = $('mold-through').checked;
  const depth = through ? 2 : Number($('mold-depth').value);
  if (!Number.isFinite(diameter) || diameter < 0.5 || diameter > 1000) throw Error('Choose a brush size between 0.5 and 1,000 mm.');
  if (!Number.isFinite(depth) || depth < 0.1 || depth > 1000) throw Error('Choose a shave depth between 0.1 and 1,000 mm.');
  return {diameter, depth, through};
}
function moldHit(event) {
  worldPoint(event);
  const hit = raycaster.intersectObjects([...meshes.values()].filter(mesh => mesh.visible), false)[0];
  if (!hit?.face) return null;
  const body = project.bodies.find(b => b.id === hit.object.userData.bodyId);
  if (!body || body.locked) return null;
  const normal = hit.face.normal.clone().transformDirection(hit.object.matrixWorld).normalize();
  return {body, point:hit.point, normal};
}
function showMoldCursor(point, normal, settings) {
  if (!moldCursor) {
    moldCursor = new THREE.Group();
    const geometry = new THREE.CylinderGeometry(1, 1, 1, 32); geometry.rotateX(Math.PI / 2);
    const fill = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color:'#dc795c', transparent:true, opacity:0.18, depthTest:false, depthWrite:false}));
    fill.name = 'volume'; fill.renderOrder = 22;
    const ring = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(Array.from({length:48}, (_, i) => new THREE.Vector3(Math.cos(i / 48 * Math.PI * 2), Math.sin(i / 48 * Math.PI * 2), 0))), new THREE.LineBasicMaterial({color:'#b34f36', depthTest:false}));
    ring.name = 'ring'; ring.renderOrder = 23; moldCursor.add(fill, ring); scene.add(moldCursor);
  }
  const source = project.bodies.find(b => b.id === moldStroke?.bodyId) || moldHover?.body;
  const depth = settings.through && source ? source.dimensions.reduce((sum, n) => sum + n, 1) : settings.depth;
  moldCursor.visible = true; moldCursor.position.copy(point);
  moldCursor.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
  const fill = moldCursor.getObjectByName('volume'), ring = moldCursor.getObjectByName('ring');
  fill.scale.set(settings.diameter / 2, settings.diameter / 2, depth); fill.position.z = -depth / 2 + 0.025;
  ring.scale.setScalar(settings.diameter / 2); ring.position.z = 0.1;
  renderRequested = true;
}
function beginMold(event) {
  if (moldStroke || moldBusy) return;
  if (moldBatchStrokes >= MEMORY_LIMITS.moldStrokes) { message('Batch complete. Use Keep cuts & continue to start another batch.', true); return; }
  try {
    const settings = moldSettings(), hit = moldHit(event);
    if (!hit) { message('Start the brush on a visible, unlocked shape.'); return; }
    const capacity = moldCapacity(project.bodies, hit.body);
    if (!capacity.allowed) { message(capacity.reason, true); return; }
    moldHover = hit;
    selected = new Set([hit.body.id]); refresh();
    moldStroke = {...settings, bodyId:hit.body.id, normal:hit.normal.toArray(), points:[hit.point.toArray()], pointerId:event.pointerId,
      plane:new THREE.Plane().setFromNormalAndCoplanarPoint(hit.normal, hit.point)};
    renderer.domElement.setPointerCapture(event.pointerId); orbit.enabled = false;
    showMoldCursor(hit.point, hit.normal, settings); queueMoldPreview();
    message('Release to apply this stroke. Escape cancels it.', true);
  } catch (error) { message(error.message, true); }
}
function moveMold(event) {
  if (moldStroke) {
    if (event.pointerId !== moldStroke.pointerId) return;
    worldPoint(event);
    const point = raycaster.ray.intersectPlane(moldStroke.plane, new THREE.Vector3());
    if (!point) return;
    showMoldCursor(point, new THREE.Vector3(...moldStroke.normal), moldStroke);
    const points = moldStroke.points, last = new THREE.Vector3(...points.at(-1));
    if (point.distanceTo(last) < moldStroke.diameter * 0.12) return;
    // Merge straight portions so a long drag cuts a continuous capsule.
    if (points.length > 1) {
      const previous = new THREE.Vector3(...points.at(-2));
      const oldDirection = last.clone().sub(previous), direction = point.clone().sub(last);
      const deviation = new THREE.Line3(previous, point).closestPointToPoint(last, true, new THREE.Vector3()).distanceTo(last);
      if (oldDirection.dot(direction) > 0 && deviation < moldStroke.diameter * 0.04) points.pop();
    }
    if (points.length >= MEMORY_LIMITS.strokePoints) { message('Release to apply this stroke, then keep shaving with a new stroke.', true); return; }
    points.push(point.toArray()); queueMoldPreview();
  } else {
    try {
      moldHover = moldHit(event);
      if (moldHover) showMoldCursor(moldHover.point, moldHover.normal, moldSettings());
      else if (moldCursor) { moldCursor.visible = false; renderRequested = true; }
    } catch { if (moldCursor) moldCursor.visible = false; }
  }
}
function queueMoldPreview() {
  if (moldPreviewFrame !== null) return;
  const update = time => {
    if (time - moldPreviewAt < 33) { moldPreviewFrame = requestAnimationFrame(update); return; }
    moldPreviewFrame = null; moldPreviewAt = time; drawMoldStroke();
  };
  moldPreviewFrame = requestAnimationFrame(update);
}
function drawMoldStroke() {
  if (!moldGroup) { moldGroup = new THREE.Group(); scene.add(moldGroup); }
  if (!moldStroke) { clearGroup(moldGroup); return; }
  const source = project.bodies.find(b => b.id === moldStroke.bodyId);
  const depth = moldStroke.through ? source.dimensions.reduce((sum, n) => sum + n, 1) : moldStroke.depth;
  const cutters = moldCutters({...moldStroke, depth});
  while (moldGroup.children.length > cutters.length) {
    const mesh = moldGroup.children.at(-1); moldGroup.remove(mesh); disposeObject(mesh);
  }
  for (let i = 0; i < cutters.length; i++) {
    const cutter = cutters[i], key = JSON.stringify([cutter.points, cutter.position, depth, moldStroke.diameter]);
    const existing = moldGroup.children[i];
    if (existing?.userData.previewKey === key) continue;
    const mesh = buildMesh(cutter); mesh.material.transparent = true; mesh.material.opacity = 0.2;
    mesh.material.depthTest = false; mesh.material.depthWrite = false; mesh.renderOrder = 21; mesh.userData.previewKey = key;
    // Reuse unchanged segments. A pointer move only replaces the moving end.
    if (existing) {
      existing.geometry.dispose(); existing.material.dispose();
      existing.geometry = mesh.geometry; existing.material = mesh.material;
      existing.position.copy(mesh.position); existing.quaternion.copy(mesh.quaternion); existing.userData.previewKey = key;
    } else moldGroup.add(mesh);
  }
  renderRequested = true;
}
function cancelMoldStroke() {
  if (moldPreviewFrame !== null) cancelAnimationFrame(moldPreviewFrame);
  moldPreviewFrame = null; moldHover = null;
  const stroke = moldStroke; moldStroke = null;
  if (stroke && renderer.domElement.hasPointerCapture(stroke.pointerId)) renderer.domElement.releasePointerCapture(stroke.pointerId);
  if (moldGroup) clearGroup(moldGroup);
  if (moldCursor) moldCursor.visible = false;
  if (orbit) orbit.enabled = !sketch;
  renderRequested = true;
}
async function finishMold(event) {
  if (!moldStroke || event.pointerId !== moldStroke.pointerId) return;
  moveMold(event);
  const stroke = moldStroke, source = project.bodies.find(b => b.id === stroke.bodyId), revision = projectRevision;
  cancelMoldStroke();
  moldBusy = true; viewport.setAttribute('aria-busy', 'true'); refreshMoldBudget();
  message('Shaving the shape…', true);
  try {
    moldTask = startMoldTask(source, stroke);
    const result = await moldTask.promise;
    if (projectRevision !== revision) throw Error('The design changed. Try the mold stroke again.');
    const capacity = moldCapacity(project.bodies.map(body => body.id === source.id ? result : body));
    if (!capacity.allowed) throw Error(capacity.reason);
    moldBusy = false;
    if (mutate(() => { replaceBodies([result]); selected = new Set([result.id]); }, 'Shape shaved. Undo restores recent cuts.')) {
      moldBatchStrokes++;
      if (moldBatchStrokes >= MEMORY_LIMITS.moldStrokes) message('Shape shaved. Batch complete. Keep your cuts and clear Undo to continue.', true);
    }
  } catch (error) { message(error.message, true); }
  finally { moldTask = null; moldBusy = false; viewport.removeAttribute('aria-busy'); refresh(); }
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
  if (!raycaster.ray.intersectPlane(plane, point)) return null;
  if (!sketch) return [snap(point.x), snap(point.y)];
  const basis = sketchBasis();
  return [snap(point.dot(basis.u)), snap(point.dot(basis.v))];
}
function sketchBasis() {
  const name = sketch?.plane || 'xy';
  const axes = name === 'xz' ? [[1, 0, 0], [0, 0, 1], [0, -1, 0]] : name === 'yz' ? [[0, 1, 0], [0, 0, 1], [1, 0, 0]] : [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
  return {u: new THREE.Vector3(...axes[0]), v: new THREE.Vector3(...axes[1]), n: new THREE.Vector3(...axes[2])};
}
function sketchPoint(u, v, depth = 0) {
  const basis = sketchBasis();
  return basis.u.multiplyScalar(u).addScaledVector(basis.v, v).addScaledVector(basis.n, (sketch?.offset || 0) + depth);
}
function orientToSketch() {
  if (!sketch) return;
  const basis = sketchBasis(), bounds = calculateBounds(project.bodies), center = new THREE.Vector3(...bounds.center);
  const target = sketchPoint(center.dot(basis.u), center.dot(basis.v));
  orbit.target.copy(target);
  camera.position.copy(target).addScaledVector(basis.n, Math.max(90, ...bounds.size.map(n => n * 3.3)));
  camera.up.copy(basis.v); camera.lookAt(target);
  plane.setFromNormalAndCoplanarPoint(basis.n, basis.n.clone().multiplyScalar(sketch.offset));
  if (workplaneGrid) { scene.remove(workplaneGrid); disposeObject(workplaneGrid); }
  workplaneGrid = new THREE.GridHelper(1000, 100, '#6ba99e', '#c8ded9');
  workplaneGrid.geometry.rotateX(Math.PI / 2);
  workplaneGrid.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(basis.u, basis.v, basis.n));
  workplaneGrid.position.copy(basis.n).multiplyScalar(sketch.offset);
  scene.add(workplaneGrid); updateGridVisibility();
  renderRequested = true;
}
function updateGridVisibility() {
  const enabled = $('grid-enabled').checked;
  grid.visible = enabled && !sketch; grid.userData.axes.forEach(axis => { axis.visible = grid.visible; });
  if (workplaneGrid) workplaneGrid.visible = enabled && Boolean(sketch);
  renderRequested = true;
}
function sketchInstruction() {
  if (!sketch) return '';
  const surface = sketch.plane.toUpperCase() + (sketch.offset ? ` at offset ${sketch.offset} mm` : '');
  return surface + ': ' + (sketch.shape === 'polygon' ? 'Click corners. Extrude or Enter finishes; Backspace removes a corner.' : `Drag to draw a ${sketch.shape}, then choose its extrusion height.`);
}
function startSketch() {
  if (moldBusy) return;
  if (mode === 'mold') setMode('select');
  if (sketch) return;
  mode = 'select';
  sketch = {shape: 'rectangle', points: [], start: null, current: null, drawing: false, plane: experience === 'advanced' ? $('sketch-plane').value : 'xy', offset: experience === 'advanced' ? Number($('sketch-offset').value) || 0 : 0};
  if (experience === 'beginner') { $('sketch-plane').value = 'xy'; $('sketch-offset').value = '0'; }
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
  fit('top'); orbit.enabled = false; orientToSketch(); refresh(); message(sketchInstruction(), true);
}
function cancelSketch() {
  if (!sketch) return;
  sketch = null; clearGroup(sketchGroup); $('sketch-bar').hidden = true;
  if (workplaneGrid) { scene.remove(workplaneGrid); disposeObject(workplaneGrid); workplaneGrid = null; }
  plane.set(new THREE.Vector3(0, 0, 1), 0); updateGridVisibility();
  viewport.classList.remove('sketching'); orbit.enabled = true; refresh();
  fit('iso'); message('Sketch closed.');
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
  const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points.map(p => sketchPoint(p[0], p[1], 0.2))), new THREE.LineBasicMaterial({color: '#16766e', depthTest: false}));
  line.renderOrder = 15; sketchGroup.add(line);
  const solidPoints = sketch.shape === 'polygon' ? sketch.points : points.slice(0, -1);
  if (solidPoints.length >= 3) {
    const shape = new THREE.Shape(solidPoints.map(p => new THREE.Vector2(...p)));
    const fill = new THREE.Mesh(new THREE.ShapeGeometry(shape), new THREE.MeshBasicMaterial({color: '#349d8e', opacity: 0.16, transparent: true, side: THREE.DoubleSide, depthWrite: false}));
    const basis = sketchBasis();
    fill.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(basis.u, basis.v, basis.n));
    fill.position.copy(basis.n).multiplyScalar(sketch.offset + 0.15); fill.material.depthTest = false; sketchGroup.add(fill);
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
    const basis = sketchBasis();
    body.position = sketchPoint(body.position[0], body.position[1], height / 2).toArray();
    body.rotation = new THREE.Euler().setFromRotationMatrix(new THREE.Matrix4().makeBasis(basis.u, basis.v, basis.n)).toArray().slice(0, 3).map(THREE.MathUtils.radToDeg);
    // Build once before closing the sketch so an invalid polygon remains editable.
    const check = buildMesh(body); disposeObject(check);
    if (!mutate(() => { project.bodies.push(body); selected = new Set([body.id]); }, 'Sketch extruded into a solid body.')) return;
    cancelSketch();
    message('Sketch extruded into a solid body.');
    fit('iso'); setMode('move');
    markGuide('sketch');
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
  perspectiveCamera = new THREE.PerspectiveCamera(38, 1, 0.1, 10000);
  orthographicCamera = new THREE.OrthographicCamera(-100, 100, 100, -100, 0.1, 10000);
  camera = perspectiveCamera; camera.up.set(0, 0, 1); orthographicCamera.up.set(0, 0, 1);
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
  transform.addEventListener('dragging-changed', event => { orbit.enabled = !event.value && !sketch && !moldStroke; });
  transform.addEventListener('mouseDown', () => {
    const body = selectionBodies()[0];
    transformSnapshot = {json: snapshot(), dimensions: body?.dimensions.slice(), params: body?.params ? {...body.params} : null};
  });
  transform.addEventListener('objectChange', () => {
    const body = selectionBodies()[0], mesh = transform.object;
    if (!body || !mesh || !transformSnapshot) return;
    body.position = mesh.position.toArray().map(n => Number(n.toFixed(4)));
    body.rotation = [mesh.rotation.x, mesh.rotation.y, mesh.rotation.z].map(n => Number(THREE.MathUtils.radToDeg(n).toFixed(4)));
    body.dimensions = transformSnapshot.dimensions.map((n, i) => Math.max(0.1, Math.min(10000, n * mesh.scale.getComponent(i))));
    if (mode === 'scale' && $('aspect-lock').checked) {
      const factor = mesh.scale.toArray().reduce((best, current) => Math.abs(current - 1) > Math.abs(best - 1) ? current : best, 1);
      const bounded = Math.max(0.1 / Math.min(...transformSnapshot.dimensions), Math.min(10000 / Math.max(...transformSnapshot.dimensions), factor));
      mesh.scale.setScalar(bounded); body.dimensions = transformSnapshot.dimensions.map(n => n * bounded);
    }
    if (transformSnapshot.params) body.params = {...transformSnapshot.params};
    normalizeBodyParameters(body);
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
    const aspect = width / Math.max(1, height);
    if (camera.isPerspectiveCamera) camera.aspect = aspect;
    else { const half = (camera.top - camera.bottom) / 2; camera.left = -half * aspect; camera.right = half * aspect; }
    camera.updateProjectionMatrix();
    renderRequested = true;
  };
  new ResizeObserver(resize).observe(viewport); resize();
  renderer.setAnimationLoop(() => {
    if (document.hidden) return;
    if (!sketch) orbit.update();
    if (renderRequested) { renderer.render(scene, camera); renderRequested = false; }
  });
  renderer.domElement.addEventListener('contextmenu', e => e.preventDefault());
  renderer.domElement.addEventListener('pointerdown', event => {
    pointerStart = {x: event.clientX, y: event.clientY, button: event.button};
    if (mode === 'mold') {
      if (event.button === 0 && !moldBusy) beginMold(event);
      return;
    }
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
    if (mode === 'mold') { if (!moldBusy) moveMold(event); return; }
    const point = worldPoint(event);
    if (point) {
      const axes = sketch?.plane === 'xz' ? ['X', 'Z'] : sketch?.plane === 'yz' ? ['Y', 'Z'] : ['X', 'Y'];
      $('cursor-position').textContent = `${axes[0]} ${point[0].toFixed(1)}  ${axes[1]} ${point[1].toFixed(1)} mm`;
    }
    if (!sketch || !point || (!sketch.drawing && sketch.shape !== 'polygon')) return;
    sketch.current = point; drawSketch();
  });
  renderer.domElement.addEventListener('pointerup', event => {
    if (mode === 'mold') { if (event.button === 0) finishMold(event); return; }
    if (renderer.domElement.hasPointerCapture(event.pointerId)) renderer.domElement.releasePointerCapture(event.pointerId);
    if (sketch) { sketch.drawing = false; return; }
    if (!pointerStart || pointerStart.button !== 0 || Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y) > 5 || transform.dragging || transform.axis) return;
    worldPoint(event);
    const hit = raycaster.intersectObjects([...meshes.values()].filter(mesh => mesh.visible), false)[0];
    select(hit?.object.userData.bodyId, event.shiftKey || event.metaKey || event.ctrlKey);
  });
  renderer.domElement.addEventListener('pointercancel', () => { cancelMoldStroke(); });
  renderer.domElement.addEventListener('lostpointercapture', () => { if (moldStroke) cancelMoldStroke(); });
  renderer.domElement.addEventListener('pointerleave', () => { if (!moldStroke && moldCursor) { moldCursor.visible = false; renderRequested = true; } });
  renderer.domElement.addEventListener('webglcontextlost', event => {
    event.preventDefault(); message('The 3D view was interrupted. Download your project, then reload the page.', true);
  });
}

function bindUI() {
  all('[data-add]').forEach(button => button.addEventListener('click', () => { addShape(button.dataset.add); button.closest('details')?.removeAttribute('open'); }));
  $('experience-mode').addEventListener('change', () => setExperience($('experience-mode').value));
  $('guide-toggle').addEventListener('click', () => { guideExpanded = !guideExpanded; savePreferences(); refreshGuide(); });
  $('text-start').addEventListener('click', openText); $('text-submit').addEventListener('click', addText);
  $('text-cancel').addEventListener('click', () => $('text-dialog').close());
  $('text-dialog').addEventListener('close', clearTextPreview);
  $('text-dialog').addEventListener('keydown', event => {
    if (event.key === 'Enter' && !event.isComposing && event.target.matches('input')) { event.preventDefault(); addText(); }
  });
  for (const id of ['text-content', 'text-height', 'text-depth', 'text-action', 'text-fit']) $(id).addEventListener('input', () => { clearTimeout(textPreviewTimer); textPreviewTimer = setTimeout(updateTextPreview, 120); });
  $('mold-start').addEventListener('click', () => setMode(mode === 'mold' ? 'select' : 'mold'));
  $('mold-done').addEventListener('click', () => setMode('select'));
  $('mold-undo').addEventListener('click', () => restoreFromHistory('undo'));
  $('mold-next-batch').addEventListener('click', nextMoldBatch);
  $('mold-cancel-task').addEventListener('click', () => moldTask?.cancel());
  $('mold-through').addEventListener('change', () => { $('mold-depth').disabled = $('mold-through').checked; });
  $('pattern-start').addEventListener('click', openPattern); $('pattern-submit').addEventListener('click', createPattern);
  $('pattern-cancel').addEventListener('click', () => $('pattern-dialog').close());
  all('[data-align-axis]').forEach(button => button.addEventListener('click', () => runAlignment(button.dataset.alignAxis, button.dataset.alignAnchor)));
  all('[data-distribute]').forEach(button => button.addEventListener('click', () => runDistribution(button.dataset.distribute)));
  all('[data-mirror]').forEach(button => button.addEventListener('click', () => runMirror(button.dataset.mirror)));
  $('projection-mode').addEventListener('change', () => setProjection($('projection-mode').value));
  $('wireframe-enabled').addEventListener('change', () => {
    for (const mesh of meshes.values()) mesh.material.wireframe = $('wireframe-enabled').checked;
    renderRequested = true;
  });
  $('export-selected').addEventListener('change', refresh);
  $('import-stl').addEventListener('click', () => $('stl-input').click());
  $('stl-input').addEventListener('change', async event => {
    const file = event.target.files[0]; if (!file) return;
    try {
      if (file.size > 20 * 1024 * 1024) throw Error('STL files must be smaller than 20 MB.');
      const body = importSTL(await file.arrayBuffer(), file.name, {units: $('stl-units').value});
      if (mutate(() => { project.bodies.push(body); selected = new Set([body.id]); }, 'STL imported at its file scale and placed on the grid.')) {
        $('welcome-card').hidden = true; fit(); markGuide('start');
      }
    } catch (error) { message('Could not import STL: ' + error.message, true); }
    event.target.value = '';
  });
  for (const [id, parameter] of [['corner-radius', 'radius'], ['tube-wall', 'wall']]) {
    $(id).addEventListener('change', () => {
      const body = editableBodies()[0], value = Number($(id).value);
      const max = parameter === 'radius' ? Math.min(...(body?.dimensions || [0])) / 2 : Math.min(...(body?.dimensions.slice(0, 2) || [0])) / 2 - 0.01;
      if (!body || !Number.isFinite(value) || value < 0.01 || value > max) { refresh(); message(`Use a ${parameter} between 0.01 and ${max.toFixed(2)} mm.`); return; }
      mutate(() => { body.params[parameter] = value; }, 'Shape updated.');
    });
  }
  $('body-text').addEventListener('change', () => {
    const body = editableBodies()[0]; if (!body || body.type !== 'text') return;
    mutate(() => {
      const updated = createTextBody($('body-text').value.trim(), {height: body.dimensions[1], depth: body.dimensions[2]});
      body.text = updated.text; body.dimensions = updated.dimensions;
    }, 'Lettering updated, preserving letter height and thickness.');
  });
  all('[data-tool]').forEach(button => button.addEventListener('click', () => setMode(button.dataset.tool)));
  all('[data-view]').forEach(button => button.addEventListener('click', () => { if (sketch) cancelSketch(); fit(button.dataset.view); }));
  all('[data-boolean]').forEach(button => button.addEventListener('click', () => boolean(button.dataset.boolean)));
  all('[data-example]').forEach(button => button.addEventListener('click', () => example(button.dataset.example)));
  $('dismiss-welcome').addEventListener('click', () => { $('welcome-card').hidden = true; });
  $('undo').addEventListener('click', () => restoreFromHistory('undo'));
  $('redo').addEventListener('click', () => restoreFromHistory('redo'));
  $('duplicate').addEventListener('click', duplicate); $('delete-body').addEventListener('click', removeSelected);
  $('fit-view').addEventListener('click', () => fit('iso'));
  $('grid-enabled').addEventListener('change', updateGridVisibility);
  $('project-name').addEventListener('change', () => mutate(() => { project.name = $('project-name').value.trim().slice(0, 80) || 'Untitled design'; }));
  $('body-name').addEventListener('change', () => mutate(() => { const b = editableBodies()[0]; if (b) b.name = $('body-name').value.trim().slice(0, 80) || b.type; }));
  $('body-color').addEventListener('change', () => mutate(() => { const b = editableBodies()[0]; if (b) b.color = $('body-color').value; }));
  for (const [attribute, property] of [['dimension', 'dimensions'], ['position', 'position'], ['rotation', 'rotation']]) {
    all(`[data-${attribute}]`).forEach(input => input.addEventListener('change', () => {
      const value = Number(input.value), body = editableBodies()[0];
      if (!body || !Number.isFinite(value) || (attribute === 'dimension' && (value < 0.1 || value > 10000)) || Math.abs(value) > 100000) {
        message('Enter a valid measurement. Dimensions must be 0.1–10,000 mm.'); refresh(); return;
      }
      const index = Number(input.dataset[attribute]);
      mutate(() => {
        if (attribute === 'dimension' && $('aspect-lock').checked) {
          const ratio = value / body.dimensions[index];
          const dimensions = body.dimensions.map(n => n * ratio);
          if (dimensions.some(n => n < 0.1 || n > 10000)) throw Error('That proportional resize would exceed the 0.1–10,000 mm dimension limits.');
          body.dimensions = dimensions;
        } else body[property][index] = value;
      });
      if (attribute === 'dimension') markGuide('size');
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
    sketch = {...sketch, shape: button.dataset.sketch, points: [], start: null, current: null, drawing: false};
    clearGroup(sketchGroup);
    all('[data-sketch]').forEach(b => {
      b.setAttribute('aria-pressed', String(b === button));
      b.classList.toggle('active', b === button);
    });
    $('sketch-hint').textContent = sketchInstruction(); message(sketchInstruction(), true);
  }));
  $('sketch-undo-point').addEventListener('click', () => {
    if (!sketch || sketch.shape !== 'polygon') return;
    sketch.points.pop(); sketch.current = null; drawSketch();
    $('sketch-hint').textContent = `${sketch.points.length} corners · click to add, Enter to extrude`;
  });
  for (const id of ['sketch-plane', 'sketch-offset']) $(id).addEventListener('change', () => {
    if (!sketch) return;
    const offset = Number($('sketch-offset').value);
    if (!Number.isFinite(offset) || Math.abs(offset) > 100000) { $('sketch-offset').value = sketch.offset; message('Plane offset must be within ±100,000 mm.'); return; }
    sketch.plane = $('sketch-plane').value; sketch.offset = offset;
    orientToSketch(); drawSketch(); message(sketchInstruction(), true);
  });
  document.addEventListener('keydown', event => {
    const editing = event.target.closest('input, textarea, select, [contenteditable="true"]');
    const key = event.key.toLowerCase(), command = event.ctrlKey || event.metaKey;
    if ($('help-dialog').open || $('confirm-dialog').open || $('text-dialog').open || $('pattern-dialog').open) return;
    if (command && key === 's') { event.preventDefault(); saveProject(); return; }
    if (moldBusy) { if (event.key === 'Escape') moldTask?.cancel(); return; }
    if (editing) return;
    if (command && key === 'z') { event.preventDefault(); restoreFromHistory(event.shiftKey ? 'redo' : 'undo'); return; }
    if (command && key === 'y') { event.preventDefault(); restoreFromHistory('redo'); return; }
    if (command && key === 'd') { event.preventDefault(); duplicate(); return; }
    if (command && key === 'a') { event.preventDefault(); selected = new Set(project.bodies.filter(b => b.visible !== false).map(b => b.id)); refresh(); return; }
    if (command || event.altKey) return;
    if (event.key === 'Escape') { if (mode === 'mold') { if (moldStroke) cancelMoldStroke(); else setMode('select'); } else if (sketch) cancelSketch(); else select(null); return; }
    if (sketch && event.key === 'Enter') { event.preventDefault(); finishSketch(); return; }
    if (sketch && ['Backspace', 'Delete'].includes(event.key)) { event.preventDefault(); $('sketch-undo-point').click(); return; }
    if (sketch) return;
    if (['Delete', 'Backspace'].includes(event.key)) { event.preventDefault(); removeSelected(); }
    if ({v: 'select', g: 'move', r: 'rotate', s: 'scale'}[key]) setMode({v: 'select', g: 'move', r: 'rotate', s: 'scale'}[key]);
    if (key === 'f') fit(); if (key === 'k') startSketch();
    if (key === 'e') setMode(mode === 'mold' ? 'select' : 'mold');
    if (key === 't') openText();
  });
  window.addEventListener('pagehide', () => { moldTask?.cancel(); cancelMoldStroke(); });
  window.addEventListener('beforeunload', () => {
    if (storageAvailable) { try { localStorage.setItem(STORAGE_KEY, snapshot()); } catch {} }
  });
}

try {
  setupScene(); bindUI();
  const options = preferences();
  guideExpanded = options.guideExpanded !== false;
  guideProgress = new Set(Array.isArray(options.guideProgress) ? options.guideProgress.filter(s => ['start', 'size', 'sketch', 'export'].includes(s)) : []);
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
  setExperience(options.experience, false);
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
