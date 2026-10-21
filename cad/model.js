import {THREE, Brush, Evaluator, ADDITION, SUBTRACTION, INTERSECTION, STLExporter, FontLoader, TextGeometry, RoundedBoxGeometry, STUDIO_FONT} from './vendor/engine.js';

const TYPES = new Set(['box', 'roundedbox', 'cylinder', 'tube', 'sphere', 'cone', 'torus', 'wedge', 'text', 'extrusion', 'custom']);
const MAX_BODIES = 100;
const MAX_VERTICES = 150000;
const MAX_PROJECT_VERTICES = 300000;
const MAX_FILE_SIZE = 20 * 1024 * 1024;
const DEFAULT_NAMES = {box:'Box', roundedbox:'Rounded box', cylinder:'Cylinder', tube:'Tube', sphere:'Sphere', cone:'Cone', torus:'Ring', wedge:'Wedge', text:'Text', extrusion:'Extruded sketch', custom:'Combined body'};
const studioFont = new FontLoader().parse(STUDIO_FONT);

function check(condition, message) {
  if (!condition) throw new Error(message);
}

function vector(value, label, min, max) {
  check(Array.isArray(value) && value.length === 3, `${label} must contain three numbers.`);
  check(value.every(number => typeof number === 'number' && Number.isFinite(number) && number >= min && number <= max), `${label} contains an invalid or out-of-range number.`);
  return [...value];
}

function identifier() {
  return globalThis.crypto?.randomUUID?.() || `body-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

function orientation(a, b, c) {
  return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
}

function onSegment(a, b, p) {
  return Math.abs(orientation(a, b, p)) < 1e-8 && p[0] >= Math.min(a[0], b[0]) - 1e-8 && p[0] <= Math.max(a[0], b[0]) + 1e-8 && p[1] >= Math.min(a[1], b[1]) - 1e-8 && p[1] <= Math.max(a[1], b[1]) + 1e-8;
}

function intersects(a, b, c, d) {
  const abC = orientation(a, b, c), abD = orientation(a, b, d);
  const cdA = orientation(c, d, a), cdB = orientation(c, d, b);
  return (abC * abD < 0 && cdA * cdB < 0) || onSegment(a, b, c) || onSegment(a, b, d) || onSegment(c, d, a) || onSegment(c, d, b);
}

export function validateSketch(points) {
  check(Array.isArray(points) && points.length >= 3 && points.length <= 256, 'A sketch needs between 3 and 256 points.');
  const result = points.map(point => {
    check(Array.isArray(point) && point.length === 2 && point.every(number => typeof number === 'number' && Number.isFinite(number) && Math.abs(number) <= 100000), 'Sketch coordinates must be finite numbers.');
    return [...point];
  });
  let area = 0;
  for (let i = 0; i < result.length; i++) {
    const a = result[i], b = result[(i + 1) % result.length];
    check(Math.hypot(b[0] - a[0], b[1] - a[1]) > 1e-6, 'A sketch cannot contain repeated neighboring points.');
    area += a[0] * b[1] - b[0] * a[1];
    for (let j = i + 1; j < result.length; j++) {
      if (j === i + 1 || (i === 0 && j === result.length - 1)) continue;
      check(!intersects(a, b, result[j], result[(j + 1) % result.length]), 'Sketch edges cannot cross or touch one another.');
    }
  }
  check(Math.abs(area) > 1e-5, 'The sketch must enclose an area.');
  return result;
}

function geometryData(value) {
  check(value && typeof value === 'object', 'Custom bodies need mesh geometry.');
  const position = value.position;
  check(Array.isArray(position) && position.length >= 9 && position.length % 3 === 0 && position.length <= MAX_VERTICES * 3, 'Mesh geometry has an invalid vertex count.');
  check(position.every(number => typeof number === 'number' && Number.isFinite(number) && Math.abs(number) <= 1000000), 'Mesh geometry contains invalid coordinates.');
  let index = null;
  if (value.index != null) {
    check(Array.isArray(value.index) && value.index.length >= 3 && value.index.length % 3 === 0 && value.index.length <= MAX_VERTICES * 6, 'Mesh geometry has invalid triangle indices.');
    check(value.index.every(number => Number.isInteger(number) && number >= 0 && number < position.length / 3), 'Mesh geometry references a missing vertex.');
    index = [...value.index];
  } else {
    check(position.length % 9 === 0, 'Unindexed mesh geometry must contain complete triangles.');
  }
  const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < position.length; i += 3) {
    for (let axis = 0; axis < 3; axis++) {
      min[axis] = Math.min(min[axis], position[i + axis]);
      max[axis] = Math.max(max[axis], position[i + axis]);
    }
  }
  check(min.every((number, axis) => max[axis] - number > 1e-8), 'Custom mesh geometry must have width, depth, and height.');
  return {position:[...position], index};
}

function validateText(value) {
  check(typeof value === 'string' && value.trim().length > 0 && value.length <= 80, 'Text must contain 1–80 characters.');
  check(!/[\r\n\t]/.test(value), 'Use a single line of text.');
  const missing = [...value].find(character => !Object.hasOwn(STUDIO_FONT.glyphs, character));
  check(!missing, `The studio font does not contain the character “${missing}”. Use letters, numbers, and supported punctuation.`);
  return value;
}

function positiveParameter(value, label, allowZero = false) {
  check(typeof value === 'number' && Number.isFinite(value) && value >= (allowZero ? 0 : 0.001) && value <= 100000, `${label} must be a finite ${allowZero ? 'non-negative' : 'positive'} measurement.`);
  return value;
}

/** Clamp valid shape parameters after an explicit resize; imports remain strict. */
export function normalizeBodyParameters(body) {
  const dimensions = vector(body.dimensions, 'Dimensions', 0.01, 100000);
  if (body.type === 'roundedbox') {
    const radius = positiveParameter(body.params?.radius ?? Math.min(2, ...dimensions.map(n => n / 2)), 'Corner radius', true);
    body.params = {radius:Math.min(radius, ...dimensions.map(n => n / 2))};
  } else if (body.type === 'tube') {
    const limit = Math.min(dimensions[0], dimensions[1]) / 2;
    const wall = positiveParameter(body.params?.wall ?? Math.min(2, limit / 4), 'Wall thickness');
    body.params = {wall:Math.min(wall, limit * 0.99)};
  }
  return body;
}

function validateBody(raw) {
  check(raw && typeof raw === 'object' && !Array.isArray(raw), 'Each body must be an object.');
  check(TYPES.has(raw.type), 'Unsupported body type.');
  check(typeof raw.id === 'string' && /^[A-Za-z0-9_-]{1,80}$/.test(raw.id), 'Each body needs a valid unique identifier.');
  check(typeof raw.name === 'string' && raw.name.trim().length > 0 && raw.name.length <= 80, 'Body names must contain 1–80 characters.');
  check(typeof raw.color === 'string' && /^#[0-9a-f]{6}$/i.test(raw.color), 'Body colors must use a six-digit hex color.');
  check(raw.visible === undefined || typeof raw.visible === 'boolean', 'Visibility must be true or false.');
  check(raw.locked === undefined || typeof raw.locked === 'boolean', 'Locking must be true or false.');
  const body = {
    id:raw.id,
    name:raw.name.trim(),
    type:raw.type,
    color:raw.color.toLowerCase(),
    dimensions:vector(raw.dimensions, 'Dimensions', 0.01, 100000),
    position:vector(raw.position, 'Position', -1000000, 1000000),
    rotation:vector(raw.rotation, 'Rotation', -360000, 360000),
    visible:raw.visible !== false,
    locked:raw.locked === true
  };
  if (body.type === 'extrusion') body.points = validateSketch(raw.points);
  if (body.type === 'custom') body.geometry = geometryData(raw.geometry);
  if (raw.params !== undefined) check(raw.params && typeof raw.params === 'object' && !Array.isArray(raw.params), 'Shape parameters must be an object.');
  if (body.type === 'roundedbox') {
    const radius = positiveParameter(raw.params?.radius ?? Math.min(2, ...body.dimensions.map(n => n / 2)), 'Corner radius', true);
    check(radius <= Math.min(...body.dimensions) / 2, 'Corner radius cannot exceed half the smallest dimension.');
    body.params = {radius};
  }
  if (body.type === 'tube') {
    const wall = positiveParameter(raw.params?.wall ?? Math.min(2, Math.min(body.dimensions[0], body.dimensions[1]) / 8), 'Wall thickness');
    check(wall < Math.min(body.dimensions[0], body.dimensions[1]) / 2, 'Wall thickness must leave an open center in the tube.');
    body.params = {wall};
  }
  if (body.type === 'text') body.text = validateText(raw.text);
  return body;
}

export function createBody(type, options = {}) {
  if (type === 'text' && !options.dimensions) return createTextBody(options.text ?? 'Text', options);
  const dimensions = type === 'torus' ? [40, 40, 10] : type === 'extrusion' ? [40, 30, 12] : [30, 30, 30];
  return validateBody({
    id:identifier(), name:DEFAULT_NAMES[type] || 'Body', type, color:'#df9b64', dimensions,
    position:[0, 0, (options.dimensions || dimensions)[2] / 2], rotation:[0, 0, 0], visible:true, locked:false,
    ...options
  });
}

/** Create XY lettering, extruded upward along Z, without distorting its aspect. */
export function createTextBody(text, options = {}) {
  validateText(text);
  const {height = 10, depth = 2, ...bodyOptions} = options;
  positiveParameter(height, 'Letter height');
  positiveParameter(depth, 'Text thickness');
  const geometry = new TextGeometry(text, {font:studioFont, size:1, depth:1, curveSegments:8, bevelEnabled:false});
  try {
    geometry.computeBoundingBox();
    const size = geometry.boundingBox.getSize(new THREE.Vector3());
    check(size.x > 0 && size.y > 0, 'The text must contain visible letters.');
    return createBody('text', {name:text.slice(0, 80).trim(), dimensions:[size.x / size.y * height, height, depth], ...bodyOptions, text});
  } finally { geometry.dispose(); }
}

export function cloneBody(body, options = {}) {
  const copy = validateBody(body);
  copy.id = identifier();
  copy.name = `${copy.name.slice(0, 73)} copy`;
  return validateBody({...copy, ...options});
}

function normalizeGeometry(geometry, dimensions) {
  geometry.computeBoundingBox();
  const box = geometry.boundingBox;
  const size = box.getSize(new THREE.Vector3()), center = box.getCenter(new THREE.Vector3());
  check([size.x, size.y, size.z].every(number => Number.isFinite(number) && number > 1e-8), 'This operation did not create a solid body.');
  geometry.translate(-center.x, -center.y, -center.z);
  geometry.scale(dimensions[0] / size.x, dimensions[1] / size.y, dimensions[2] / size.z);
  // scale() already transforms existing normals, including the analytic normals
  // on curved primitives. Recomputing unindexed rounded-box normals facets them.
  if (!geometry.getAttribute('normal')) geometry.computeVertexNormals();
  const position = geometry.getAttribute('position');
  if (!geometry.getAttribute('uv')) geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(position.count * 2), 2));
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  return geometry;
}

export function buildMesh(body) {
  const valid = validateBody(body);
  let geometry;
  switch (valid.type) {
    case 'box': geometry = new THREE.BoxGeometry(1, 1, 1); break;
    case 'roundedbox': geometry = valid.params.radius === 0 ? new THREE.BoxGeometry(...valid.dimensions) : new RoundedBoxGeometry(...valid.dimensions, 4, valid.params.radius); break;
    case 'sphere': geometry = new THREE.SphereGeometry(1, 40, 24); break;
    case 'cylinder': geometry = new THREE.CylinderGeometry(1, 1, 1, 64); geometry.rotateX(Math.PI / 2); break;
    case 'cone': geometry = new THREE.ConeGeometry(1, 1, 64); geometry.rotateX(Math.PI / 2); break;
    case 'torus': geometry = new THREE.TorusGeometry(1, 0.25, 20, 64); break;
    case 'tube': {
      const shape = new THREE.Shape();
      shape.absellipse(0, 0, valid.dimensions[0] / 2, valid.dimensions[1] / 2, 0, Math.PI * 2, false);
      const opening = new THREE.Path();
      opening.absellipse(0, 0, valid.dimensions[0] / 2 - valid.params.wall, valid.dimensions[1] / 2 - valid.params.wall, 0, Math.PI * 2, true);
      shape.holes.push(opening);
      geometry = new THREE.ExtrudeGeometry(shape, {depth:valid.dimensions[2], bevelEnabled:false, curveSegments:32, steps:1});
      break;
    }
    case 'wedge': {
      geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute([
        -0.5,-0.5,-0.5, 0.5,-0.5,-0.5, 0.5,0.5,-0.5,
        -0.5,0.5,-0.5, 0.5,-0.5,0.5, 0.5,0.5,0.5
      ], 3));
      geometry.setIndex([0,3,2,0,2,1,1,2,5,1,5,4,0,1,4,3,5,2,0,4,5,0,5,3]);
      // Each prism face has a crisp normal rather than rounded ramp edges.
      const indexed = geometry;
      geometry = indexed.toNonIndexed();
      indexed.dispose();
      break;
    }
    case 'text': geometry = new TextGeometry(valid.text, {font:studioFont, size:1, depth:1, curveSegments:8, bevelEnabled:false}); break;
    case 'extrusion': {
      const shape = new THREE.Shape(valid.points.map(point => new THREE.Vector2(...point)));
      geometry = new THREE.ExtrudeGeometry(shape, {depth:1, bevelEnabled:false, steps:1});
      break;
    }
    case 'custom':
      geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(valid.geometry.position, 3));
      if (valid.geometry.index) geometry.setIndex(valid.geometry.index);
      break;
  }
  try {
    normalizeGeometry(geometry, valid.dimensions);
  } catch (error) {
    geometry.dispose();
    throw error;
  }
  const material = new THREE.MeshStandardMaterial({color:valid.color, roughness:0.48, metalness:0.12});
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.fromArray(valid.position);
  mesh.rotation.set(...valid.rotation.map(THREE.MathUtils.degToRad));
  mesh.name = valid.name;
  mesh.visible = valid.visible;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.userData.bodyId = valid.id;
  mesh.updateMatrixWorld(true);
  return mesh;
}

function disposeMesh(mesh) {
  mesh.geometry.dispose();
  for (const material of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) material.dispose();
}

function effectivePositions(geometry) {
  const attribute = geometry.getAttribute('position'), index = geometry.getIndex();
  const available = index ? index.count : attribute.count;
  const start = geometry.drawRange.start || 0;
  const count = Math.min(geometry.drawRange.count, available - start);
  check(count >= 3 && count % 3 === 0 && count <= MAX_VERTICES, 'The result is empty or too complex. Try simpler overlapping bodies.');
  const output = [];
  for (let i = start; i < start + count; i++) {
    const vertex = index ? index.getX(i) : i;
    output.push(attribute.getX(vertex), attribute.getY(vertex), attribute.getZ(vertex));
  }
  return output;
}

export function combineBodies(bodies, operation) {
  check(Array.isArray(bodies) && bodies.length >= 2 && bodies.length <= 20, 'Select between 2 and 20 bodies for a solid operation.');
  const operations = {union:ADDITION, subtract:SUBTRACTION, intersect:INTERSECTION, intersection:INTERSECTION};
  check(Object.hasOwn(operations, operation), 'Choose union, subtract, or intersect.');
  const evaluator = new Evaluator();
  evaluator.useGroups = false;
  const resources = new Set();
  try {
    const brushes = bodies.map(body => {
      const mesh = buildMesh(body);
      resources.add(mesh);
      const brush = new Brush(mesh.geometry, mesh.material);
      brush.position.copy(mesh.position);
      brush.quaternion.copy(mesh.quaternion);
      brush.updateMatrixWorld(true);
      return brush;
    });
    let result = brushes[0];
    for (let i = 1; i < brushes.length; i++) {
      result = evaluator.evaluate(result, brushes[i], operations[operation]);
      resources.add(result);
    }
    const geometry = new THREE.BufferGeometry();
    try {
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(effectivePositions(result.geometry), 3));
      result.updateMatrixWorld(true);
      geometry.applyMatrix4(result.matrixWorld);
      geometry.computeBoundingBox();
      const center = geometry.boundingBox.getCenter(new THREE.Vector3());
      const size = geometry.boundingBox.getSize(new THREE.Vector3()).toArray();
      check(size.every(number => number >= 0.01), 'The operation is empty. Subtract or intersect bodies that overlap.');
      normalizeGeometry(geometry, [1, 1, 1]);
      return createBody('custom', {
        name:operation === 'union' ? 'Joined body' : operation === 'subtract' ? 'Cut body' : 'Intersection',
        color:bodies[0].color, dimensions:size, position:center.toArray(), rotation:[0, 0, 0],
        geometry:{position:Array.from(geometry.getAttribute('position').array), index:null}
      });
    } finally {
      geometry.dispose();
    }
  } finally {
    const geometries = new Set(), materials = new Set();
    for (const resource of resources) {
      geometries.add(resource.geometry);
      for (const material of Array.isArray(resource.material) ? resource.material : [resource.material]) materials.add(material);
    }
    for (const geometry of geometries) geometry.dispose();
    for (const material of materials) material.dispose();
  }
}

export function calculateBounds(bodies) {
  const box = new THREE.Box3();
  for (const body of bodies.filter(body => body.visible !== false)) {
    const mesh = buildMesh(body);
    try { box.expandByObject(mesh, true); } finally { disposeMesh(mesh); }
  }
  if (box.isEmpty()) return {min:[0, 0, 0], max:[0, 0, 0], size:[0, 0, 0], center:[0, 0, 0], empty:true};
  return {min:box.min.toArray(), max:box.max.toArray(), size:box.getSize(new THREE.Vector3()).toArray(), center:box.getCenter(new THREE.Vector3()).toArray(), empty:false};
}

export function estimateVolume(bodyOrBodies) {
  const bodies = Array.isArray(bodyOrBodies) ? bodyOrBodies : [bodyOrBodies];
  let total = 0;
  for (const body of bodies) {
    const mesh = buildMesh(body);
    try {
      const geometry = mesh.geometry, position = geometry.getAttribute('position'), index = geometry.getIndex();
      let volume = 0;
      const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
      for (let i = 0; i < (index ? index.count : position.count); i += 3) {
        a.fromBufferAttribute(position, index ? index.getX(i) : i).applyMatrix4(mesh.matrixWorld);
        b.fromBufferAttribute(position, index ? index.getX(i + 1) : i + 1).applyMatrix4(mesh.matrixWorld);
        c.fromBufferAttribute(position, index ? index.getX(i + 2) : i + 2).applyMatrix4(mesh.matrixWorld);
        volume += a.dot(b.cross(c)) / 6;
      }
      total += Math.abs(volume);
    } finally { disposeMesh(mesh); }
  }
  return total;
}

export function exportSTL(bodies) {
  check(Array.isArray(bodies), 'Choose bodies to export.');
  const visible = bodies.filter(body => body.visible !== false);
  check(visible.length > 0, 'Add or show at least one body before exporting.');
  const scene = new THREE.Group();
  try {
    for (const body of visible) scene.add(buildMesh(body));
    scene.updateMatrixWorld(true);
    const result = new STLExporter().parse(scene, {binary:true});
    return result.buffer.slice(result.byteOffset, result.byteOffset + result.byteLength);
  } finally {
    for (const mesh of scene.children) disposeMesh(mesh);
  }
}

export function parseProject(input) {
  let raw = input;
  if (typeof input === 'string') {
    check(input.length <= MAX_FILE_SIZE, 'This project exceeds the 20 MB file limit.');
    try { raw = JSON.parse(input); } catch { throw new Error('This file is not valid project JSON.'); }
  }
  check(raw && typeof raw === 'object' && !Array.isArray(raw), 'This file is not a 3D Studio project.');
  check(raw.version === 1 && raw.units === 'mm', 'Use a version 1 project in millimeters.');
  check(typeof raw.name === 'string' && raw.name.trim().length > 0 && raw.name.length <= 80, 'Project names must contain 1–80 characters.');
  check(Array.isArray(raw.bodies) && raw.bodies.length <= MAX_BODIES, `A project can contain at most ${MAX_BODIES} bodies.`);
  const bodies = raw.bodies.map(validateBody), ids = new Set();
  let vertices = 0;
  for (const body of bodies) {
    check(!ids.has(body.id), 'This project contains duplicate body identifiers.');
    ids.add(body.id);
    vertices += body.geometry?.position.length / 3 || 0;
  }
  check(vertices <= MAX_PROJECT_VERTICES, 'This project contains too many mesh vertices.');
  return {version:1, units:'mm', name:raw.name.trim(), bodies};
}

export function serializeProject(bodiesOrProject, name = 'Untitled design') {
  const project = Array.isArray(bodiesOrProject) ? {version:1, units:'mm', name, bodies:bodiesOrProject} : bodiesOrProject;
  return JSON.stringify(parseProject(project));
}
