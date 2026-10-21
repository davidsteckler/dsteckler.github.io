import {THREE, STLLoader} from './vendor/engine.js';
import {createBody, cloneBody, buildMesh, calculateBounds, parseProject} from './model.js';

const MAX_BODIES = 100;
const MAX_VERTICES = 150000;
const MAX_BYTES = 20 * 1024 * 1024;
const EPSILON = 1e-7;

function check(condition, message) {
  if (!condition) throw new Error(message);
}

function axisIndex(axis) {
  const index = typeof axis === 'string' ? ['x', 'y', 'z'].indexOf(axis.toLowerCase()) : axis;
  check(Number.isInteger(index) && index >= 0 && index <= 2, 'Choose the X, Y, or Z axis.');
  return index;
}

function selection(bodies, minimum = 1) {
  check(Array.isArray(bodies) && bodies.length >= minimum && bodies.length <= MAX_BODIES, `Select between ${minimum} and ${MAX_BODIES} bodies.`);
  const copied = parseProject({version:1, units:'mm', name:'Model operation', bodies}).bodies;
  check(copied.every(body => body.visible !== false), 'Show all selected bodies before using this tool.');
  return copied;
}

function disposeMesh(mesh) {
  mesh.geometry.dispose();
  for (const material of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) material.dispose();
}

function boundsFor(body) {
  return calculateBounds([body]);
}

function move(body, axis, delta) {
  check(!body.locked || Math.abs(delta) < EPSILON, `Unlock “${body.name}” before moving it.`);
  body.position[axis] += delta;
  return body;
}

function validateResult(bodies) {
  return parseProject({version:1, units:'mm', name:'Model operation', bodies}).bodies;
}

/** Align world-space bounding faces or centers to the first selected body. */
export function alignBodies(bodies, axis = 0, anchor = 'center') {
  const copied = selection(bodies, 2), coordinate = axisIndex(axis);
  check(['min', 'center', 'max'].includes(anchor), 'Choose minimum, center, or maximum alignment.');
  const target = boundsFor(copied[0])[anchor][coordinate];
  for (const body of copied.slice(1)) move(body, coordinate, target - boundsFor(body)[anchor][coordinate]);
  return validateResult(copied);
}

/** Space bounding-box centers evenly, retaining the two outer bodies. */
export function distributeBodies(bodies, axis = 0) {
  const copied = selection(bodies, 3), coordinate = axisIndex(axis);
  const ordered = copied.map((body, index) => ({body, index, center:boundsFor(body).center[coordinate]}))
    .sort((a, b) => a.center - b.center || a.index - b.index);
  const start = ordered[0].center, end = ordered.at(-1).center;
  check(end - start > EPSILON, 'Move the outer bodies apart before distributing their centers.');
  ordered.forEach(({body, center}, index) => move(body, coordinate, start + (end - start) * index / (ordered.length - 1) - center));
  return validateResult(copied);
}

function worldTriangles(mesh) {
  const geometry = mesh.geometry;
  const position = geometry.getAttribute('position'), index = geometry.getIndex();
  const count = index ? index.count : position.count;
  check(count >= 3 && count % 3 === 0 && count <= MAX_VERTICES, 'The mesh is too complex for this operation. Use a simpler model.');
  mesh.updateMatrixWorld(true);
  const point = new THREE.Vector3(), output = [];
  for (let i = 0; i < count; i++) {
    point.fromBufferAttribute(position, index ? index.getX(i) : i).applyMatrix4(mesh.matrixWorld);
    output.push(point.x, point.y, point.z);
  }
  return output;
}

function positionBounds(position) {
  const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < position.length; i += 3) {
    for (let axis = 0; axis < 3; axis++) {
      const value = position[i + axis];
      check(Number.isFinite(value), 'Mesh vertices must contain only finite coordinates.');
      min[axis] = Math.min(min[axis], value); max[axis] = Math.max(max[axis], value);
    }
  }
  const dimensions = max.map((value, axis) => value - min[axis]);
  check(dimensions.every(value => value >= 0.01 && value <= 100000), 'The mesh needs nonzero width, depth, and height within the supported model size.');
  return {min, max, dimensions, center:min.map((value, axis) => (value + max[axis]) / 2)};
}

function customBody(position, options) {
  const bounds = positionBounds(position);
  // Normalize the stored mesh to avoid losing precision when the original
  // geometry had a large world offset. Its physical dimensions remain exact.
  const normalized = position.map((value, i) => (value - bounds.center[i % 3]) / bounds.dimensions[i % 3]);
  return createBody('custom', {
    ...options,
    dimensions:bounds.dimensions,
    position:options.position || bounds.center,
    rotation:[0, 0, 0],
    geometry:{position:normalized, index:null}
  });
}

/** Return reflected copies around the selection's bounding-box center plane. */
export function mirrorBodies(bodies, axis = 0) {
  const copied = selection(bodies), coordinate = axisIndex(axis);
  check(copied.length * 2 <= MAX_BODIES, 'Mirroring would exceed the 100-body project limit.');
  const plane = calculateBounds(copied).center[coordinate];
  const output = copied.map(body => {
    const mesh = buildMesh(body);
    try {
      const position = worldTriangles(mesh);
      for (let i = coordinate; i < position.length; i += 3) position[i] = 2 * plane - position[i];
      // Reflection reverses handedness. Swap the second/third triangle vertices
      // to preserve outward winding and a positive signed solid volume.
      for (let i = 0; i < position.length; i += 9) {
        for (let component = 0; component < 3; component++) {
          [position[i + 3 + component], position[i + 6 + component]] = [position[i + 6 + component], position[i + 3 + component]];
        }
      }
      return customBody(position, {name:body.name.slice(0, 71) + ' mirrored', color:body.color, visible:true, locked:false});
    } finally { disposeMesh(mesh); }
  });
  return validateResult([...copied, ...output]).slice(copied.length);
}

function patternSelection(bodies, count) {
  const copied = selection(bodies);
  check(Number.isInteger(count) && count >= 2 && count <= 20, 'Choose 2–20 total pattern instances, including the original.');
  check(copied.length * count <= MAX_BODIES, 'This pattern would exceed the 100-body project limit.');
  return copied;
}

/** Return new copies only; count includes the original selection. */
export function linearPattern(bodies, {count = 3, axis = 0, spacing = 20} = {}) {
  const copied = patternSelection(bodies, count), coordinate = axisIndex(axis);
  check(typeof spacing === 'number' && Number.isFinite(spacing) && Math.abs(spacing) >= 0.01 && Math.abs(spacing) <= 1000000, 'Enter a nonzero pattern spacing between −1,000,000 and 1,000,000 mm.');
  const output = [];
  for (let instance = 1; instance < count; instance++) {
    for (const body of copied) {
      const clone = cloneBody(body, {name:body.name.slice(0, 70) + ` ${instance + 1}`, locked:false});
      clone.position[coordinate] += spacing * instance;
      output.push(clone);
    }
  }
  return validateResult([...copied, ...output]).slice(copied.length);
}

/** Rotate copies around a world axis; 360° patterns exclude a duplicate end. */
export function radialPattern(bodies, {count = 4, axis = 2, angle = 360, center} = {}) {
  const copied = patternSelection(bodies, count), coordinate = axisIndex(axis);
  check(typeof angle === 'number' && Number.isFinite(angle) && Math.abs(angle) >= 0.01 && Math.abs(angle) <= 360, 'Enter a nonzero pattern angle between −360° and 360°.');
  const pivot = center === undefined ? calculateBounds(copied).center : center;
  check(Array.isArray(pivot) && pivot.length === 3 && pivot.every(value => typeof value === 'number' && Number.isFinite(value) && Math.abs(value) <= 1000000), 'The pattern center must contain three valid millimeter coordinates.');
  const unit = new THREE.Vector3().setComponent(coordinate, 1), origin = new THREE.Vector3(...pivot);
  const fullTurn = Math.abs(Math.abs(angle) - 360) < EPSILON;
  const step = THREE.MathUtils.degToRad(angle) / (fullTurn ? count : count - 1);
  const output = [];
  for (let instance = 1; instance < count; instance++) {
    const rotation = new THREE.Quaternion().setFromAxisAngle(unit, step * instance);
    for (const body of copied) {
      const clone = cloneBody(body, {name:body.name.slice(0, 70) + ` ${instance + 1}`, locked:false});
      clone.position = new THREE.Vector3(...body.position).sub(origin).applyQuaternion(rotation).add(origin).toArray();
      const original = new THREE.Quaternion().setFromEuler(new THREE.Euler(...body.rotation.map(THREE.MathUtils.degToRad), 'XYZ'));
      const euler = new THREE.Euler().setFromQuaternion(rotation.clone().multiply(original), 'XYZ');
      clone.rotation = [euler.x, euler.y, euler.z].map(THREE.MathUtils.radToDeg);
      output.push(clone);
    }
  }
  return validateResult([...copied, ...output]).slice(copied.length);
}

function stlBytes(data) {
  if (typeof data === 'string') {
    check(data.length <= MAX_BYTES, 'STL files must be smaller than 20 MB.');
    return new TextEncoder().encode(data);
  }
  if (data instanceof ArrayBuffer) return new Uint8Array(data);
  if (ArrayBuffer.isView(data)) return new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
  throw new Error('Choose an ASCII or binary STL file.');
}

/** Import triangles in mm (or explicitly selected inches), centered on the grid. */
export function importSTL(data, filename = 'Imported STL', {units = 'mm'} = {}) {
  check(['mm', 'in', 'inches'].includes(units), 'Choose millimeters or inches for the STL input.');
  const bytes = stlBytes(data);
  check(bytes.byteLength > 0 && bytes.byteLength <= MAX_BYTES, 'STL files must contain data and be smaller than 20 MB.');
  let expectedVertices;
  const facetCount = bytes.byteLength >= 84 ? new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength).getUint32(80, true) : 0;
  const isBinary = bytes.byteLength >= 84 && 84 + facetCount * 50 === bytes.byteLength;
  if (isBinary) {
    expectedVertices = facetCount * 3;
    check(expectedVertices >= 3 && expectedVertices <= MAX_VERTICES, 'This STL is empty or has more than 50,000 triangles. Simplify the mesh before importing.');
  } else {
    let text;
    try { text = new TextDecoder('utf-8', {fatal:true}).decode(bytes); }
    catch { throw new Error('This STL is truncated or does not contain valid triangle data.'); }
    check(/^\s*solid(?:\s|$)/i.test(text) && /\bendsolid\b/i.test(text), 'This is not a complete ASCII or binary STL file.');
    const vertices = text.match(/\bvertex\s+/gi) || [];
    const facets = text.match(/\bfacet\s+normal\s+/gi) || [];
    check(vertices.length >= 3 && vertices.length <= MAX_VERTICES && vertices.length === facets.length * 3, 'Each STL facet needs exactly three vertices, with no more than 50,000 triangles overall.');
    const number = '[+-]?(?:\\d*\\.\\d+|\\d+\\.?\\d*)(?:[eE][+-]?\\d+)?';
    const vertexPattern = new RegExp(`\\bvertex\\s+(${number})\\s+(${number})\\s+(${number})(?=\\s|$)`, 'gi');
    const validVertices = [...text.matchAll(vertexPattern)];
    check(validVertices.length === vertices.length && validVertices.every(match => match.slice(1).every(value => Number.isFinite(Number(value)))), 'STL vertices must contain three finite coordinates.');
    expectedVertices = vertices.length;
  }
  const buffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
  let geometry;
  try {
    geometry = new STLLoader().parse(buffer);
    const attribute = geometry.getAttribute('position');
    check(attribute && attribute.count === expectedVertices, 'The STL contains malformed or incomplete triangles.');
    const factor = units === 'mm' ? 1 : 25.4;
    const position = Array.from(attribute.array, value => value * factor);
    const bounds = positionBounds(position);
    const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
    for (let i = 0; i < position.length; i += 9) {
      a.fromArray(position, i); b.fromArray(position, i + 3); c.fromArray(position, i + 6);
      check(b.sub(a).cross(c.sub(a)).lengthSq() > 1e-16, 'The STL contains a collapsed triangle. Repair or simplify it before importing.');
    }
    const name = String(filename).split(/[\\/]/).at(-1).replace(/\.stl$/i, '').trim().slice(0, 80) || 'Imported STL';
    return customBody(position, {name, color:'#718ca6', visible:true, locked:false, position:[0, 0, bounds.dimensions[2] / 2]});
  } catch (error) {
    if (error instanceof RangeError || error instanceof TypeError) throw new Error('The STL contains malformed or incomplete triangle data.');
    throw error;
  } finally { geometry?.dispose(); }
}

/** Volume is the sum of visible-body estimates; overlapping volumes count twice. */
export function summarizeBodies(bodies) {
  check(Array.isArray(bodies), 'Choose bodies to measure.');
  const visible = bodies.filter(body => body.visible !== false);
  const copied = visible.length ? selection(visible) : [];
  const box = new THREE.Box3(), centers = [];
  let triangleCount = 0, estimatedVolume = 0, surfaceArea = 0;
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
  const cross = new THREE.Vector3(), edgeA = new THREE.Vector3(), edgeB = new THREE.Vector3();
  for (const body of copied) {
    const mesh = buildMesh(body);
    try {
      mesh.updateMatrixWorld(true);
      const bounds = new THREE.Box3().setFromObject(mesh, true);
      box.union(bounds); centers.push(bounds.getCenter(new THREE.Vector3()));
      const position = mesh.geometry.getAttribute('position'), index = mesh.geometry.getIndex();
      const count = index ? index.count : position.count;
      triangleCount += count / 3;
      let signedVolume = 0;
      for (let i = 0; i < count; i += 3) {
        a.fromBufferAttribute(position, index ? index.getX(i) : i);
        b.fromBufferAttribute(position, index ? index.getX(i + 1) : i + 1);
        c.fromBufferAttribute(position, index ? index.getX(i + 2) : i + 2);
        signedVolume += a.dot(cross.crossVectors(b, c)) / 6;
        surfaceArea += edgeA.subVectors(b, a).cross(edgeB.subVectors(c, a)).length() / 2;
      }
      estimatedVolume += Math.abs(signedVolume);
    } finally { disposeMesh(mesh); }
  }
  const bounds = box.isEmpty() ? {min:[0,0,0], max:[0,0,0], size:[0,0,0], center:[0,0,0], empty:true} : {
    min:box.min.toArray(), max:box.max.toArray(), size:box.getSize(new THREE.Vector3()).toArray(), center:box.getCenter(new THREE.Vector3()).toArray(), empty:false
  };
  return {dimensions:bounds.size, bounds, estimatedVolume, surfaceArea, bodyCount:copied.length, triangleCount, centerDistance:centers.length === 2 ? centers[0].distanceTo(centers[1]) : null};
}
