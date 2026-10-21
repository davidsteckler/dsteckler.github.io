import assert from 'node:assert/strict';
import {createBody, buildMesh, cloneBody, calculateBounds, combineBodies, estimateVolume, parseProject, serializeProject, exportSTL, validateSketch} from './model.js';

const near = (actual, expected, tolerance = 0.001) => assert(Math.abs(actual - expected) <= tolerance, `${actual} should be within ${tolerance} of ${expected}`);
let checks = 0;
for (const type of ['box', 'cylinder', 'sphere', 'cone', 'torus']) {
  const body = createBody(type, {dimensions:[20, 30, 40], position:[5, -2, 20]});
  const bounds = calculateBounds([body]);
  bounds.size.forEach((size, i) => near(size, body.dimensions[i]));
  bounds.center.forEach((center, i) => near(center, body.position[i]));
  const mesh = buildMesh(body);
  assert.equal(mesh.userData.bodyId, body.id);
  assert(estimateVolume(body) > 0);
  mesh.geometry.dispose(); mesh.material.dispose(); checks++;
}

const rotated = createBody('box', {dimensions:[10, 20, 30], rotation:[0, 0, 90], position:[0, 0, 15]});
calculateBounds([rotated]).size.forEach((size, i) => near(size, [20, 10, 30][i]));
near(estimateVolume(rotated), 6000); checks++;

const extrusion = createBody('extrusion', {points:[[0,0], [20,0], [20,10], [0,10]], dimensions:[20,10,5], position:[0,0,2.5]});
near(estimateVolume(extrusion), 1000);
assert.throws(() => validateSketch([[0,0],[10,10],[0,10],[10,0]]), /cross|area/);
assert.throws(() => validateSketch([[0,0],[1,0],[1,0],[0,1]]), /repeated|cross/); checks++;

const drawnProfile = createBody('extrusion', {points:[[100,50],[120,50],[120,60],[100,60]], dimensions:[20,10,5], position:[110,55,2.5]});
calculateBounds([drawnProfile]).min.forEach((value, i) => near(value, [100,50,0][i]));
calculateBounds([drawnProfile]).max.forEach((value, i) => near(value, [120,60,5][i])); checks++;

const a = createBody('box', {dimensions:[10,10,10], position:[0,0,5]});
const b = createBody('box', {dimensions:[10,10,10], position:[5,0,5]});
for (const [operation, volume] of [['union',1500], ['subtract',500], ['intersect',500]]) {
  const result = combineBodies([a,b], operation);
  assert.equal(result.type, 'custom');
  near(estimateVolume(result), volume, 0.1);
  const resized = {...result, dimensions:result.dimensions.map(value => value * 2)};
  near(estimateVolume(resized), volume * 8, 1); checks++;
}
const remote = createBody('box', {position:[100,100,100]});
assert.throws(() => combineBodies([a,remote], 'intersect'), /empty|solid/); checks++;

const angledA = createBody('box', {dimensions:[10,10,10], position:[100,50,45], rotation:[0,0,45]});
const angledB = createBody('box', {dimensions:[10,10,10], position:[100 + 5 / Math.sqrt(2),50 + 5 / Math.sqrt(2),45], rotation:[0,0,45]});
const angledUnion = combineBodies([angledA, angledB], 'union');
near(estimateVolume(angledUnion), 1500, 0.1);
calculateBounds([angledUnion]).center.forEach((value, i) => near(value, [100 + 2.5 / Math.sqrt(2),50 + 2.5 / Math.sqrt(2),45][i])); checks++;

const cylinder = createBody('cylinder', {dimensions:[6,6,20], position:[0,0,5]});
const hole = combineBodies([a,cylinder], 'subtract');
assert(estimateVolume(hole) < 730 && estimateVolume(hole) > 710); checks++;

const saved = serializeProject([a, extrusion, hole], 'Classroom test');
const loaded = parseProject(saved);
assert.equal(loaded.name, 'Classroom test');
assert.deepEqual(loaded.bodies, [a, extrusion, hole]);
const clone = cloneBody(a);
assert.notEqual(clone.id, a.id);
assert.deepEqual(clone.dimensions, a.dimensions);
assert.notEqual(clone.dimensions, a.dimensions); checks++;

for (const corrupt of [
  {...loaded, version:2}, {...loaded, units:'in'}, {...loaded, bodies:[a,a]},
  {...loaded, bodies:[{...a, dimensions:[-1,10,10]}]},
  {...loaded, bodies:[{...a, position:[NaN,0,0]}]},
  {...loaded, bodies:[{...a, color:'red'}]},
  {...loaded, bodies:[{...hole, geometry:{position:[0,0,0], index:null}}]},
  {...loaded, bodies:[{...hole, geometry:{position:[0,0,0,1,0,0,0,1,0],index:null}}]},
  {...loaded, bodies:[{...hole, geometry:{position:[0,0,0,1,0,0,0,1,0],index:[0,1,3]}}]}
]) assert.throws(() => parseProject(corrupt));
assert.throws(() => parseProject('{incomplete')); checks++;

const stlBody = createBody('box', {dimensions:[10,20,30], position:[50,-10,25], rotation:[0,0,90]});
const hidden = createBody('box', {visible:false, position:[1000,1000,1000]});
const binary = exportSTL([stlBody, hidden]), view = new DataView(binary);
const triangles = view.getUint32(80, true);
assert.equal(triangles, 12);
assert.equal(binary.byteLength, 84 + triangles * 50);
const min = [Infinity,Infinity,Infinity], max = [-Infinity,-Infinity,-Infinity];
for (let triangle = 0; triangle < triangles; triangle++) {
  for (let vertex = 0; vertex < 3; vertex++) {
    for (let axis = 0; axis < 3; axis++) {
      const coordinate = view.getFloat32(84 + triangle * 50 + 12 + vertex * 12 + axis * 4, true);
      min[axis] = Math.min(min[axis], coordinate); max[axis] = Math.max(max[axis], coordinate);
    }
  }
}
min.forEach((value, i) => near(value, [40,-15,10][i]));
max.forEach((value, i) => near(value, [60,-5,40][i]));
assert.throws(() => exportSTL([hidden]), /show/); checks++;
console.log(`PASS ${checks} geometry checks: dimensions, Z-up transforms, extrusion, solid booleans, resizing, project validation, cloning, binary STL world coordinates.`);
