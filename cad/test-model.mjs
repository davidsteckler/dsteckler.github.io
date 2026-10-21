import assert from 'node:assert/strict';
import {createBody, createTextBody, normalizeBodyParameters, buildMesh, cloneBody, calculateBounds, combineBodies, estimateVolume, parseProject, serializeProject, exportSTL, validateSketch} from './model.js';
import {THREE} from './vendor/engine.js';

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

const rounded = createBody('roundedbox', {dimensions:[20,30,40], position:[0,0,20], params:{radius:3}});
calculateBounds([rounded]).size.forEach((value, i) => near(value, [20,30,40][i]));
assert(estimateVolume(rounded) < 24000 && estimateVolume(rounded) > 22000, 'Rounded corners remove actual material');
const roundedMesh = buildMesh(rounded);
const roundedRay = new THREE.Raycaster(new THREE.Vector3(9.9,14.9,100), new THREE.Vector3(0,0,-1));
assert.equal(roundedRay.intersectObject(roundedMesh, false).length, 0, 'The original box corner is rounded away');
roundedMesh.geometry.dispose(); roundedMesh.material.dispose();
const resizedRounded = normalizeBodyParameters({...rounded, dimensions:[2,30,40]});
near(resizedRounded.params.radius, 1);
assert.equal(buildMesh(resizedRounded).geometry.getAttribute('position').count > 0, true);
checks++;

const tube = createBody('tube', {dimensions:[20,30,40], position:[0,0,20], params:{wall:2}});
calculateBounds([tube]).size.forEach((value, i) => near(value, [20,30,40][i]));
near(estimateVolume(tube), Math.PI * (10 * 15 - 8 * 13) * 40, 12);
const tubeMesh = buildMesh(tube);
const centerRay = new THREE.Raycaster(new THREE.Vector3(0,0,100), new THREE.Vector3(0,0,-1));
assert.equal(centerRay.intersectObject(tubeMesh, false).length, 0, 'Tube center remains open through both ends');
tubeMesh.geometry.dispose(); tubeMesh.material.dispose();
const resizedTube = normalizeBodyParameters({...tube, dimensions:[3,4,20]});
assert(resizedTube.params.wall < 1.5);
assert(estimateVolume(resizedTube) > 0); checks++;

const wedge = createBody('wedge', {dimensions:[20,30,40], position:[10,15,20]});
calculateBounds([wedge]).min.forEach((value, i) => near(value, [0,0,0][i]));
near(estimateVolume(wedge), 12000); checks++;

const letter = createTextBody('O', {height:10, depth:2});
near(letter.dimensions[1], 10); near(letter.dimensions[2], 2);
const letterMesh = buildMesh(letter);
assert.equal(centerRay.intersectObject(letterMesh, false).length, 0, 'O has a real counter, not a filled glyph');
const inkRay = new THREE.Raycaster(new THREE.Vector3(letter.dimensions[0] * 0.44,0,100), new THREE.Vector3(0,0,-1));
assert(inkRay.intersectObject(letterMesh, false).length > 0, 'The lettering still contains solid strokes');
letterMesh.geometry.dispose(); letterMesh.material.dispose();
assert(estimateVolume(letter) < letter.dimensions[0] * 10 * 2 * 0.7);
const caption = createTextBody('HIGHLANDS', {height:7, depth:1.5});
near(caption.dimensions[1], 7); near(caption.dimensions[2], 1.5);
assert(caption.dimensions[0] > 40);
assert.equal(createTextBody('B', {...letter}).text, 'B', 'The requested text overrides older body text');
checks++;

const expandedProject = parseProject(serializeProject([rounded, tube, wedge, caption], 'New shapes'));
assert.deepEqual(expandedProject.bodies, [rounded, tube, wedge, caption]);
assert.deepEqual(parseProject(saved).bodies, [a, extrusion, hole], 'Original version 1 projects remain compatible');
for (const body of [
  {...rounded, params:{radius:11}}, {...rounded, params:{radius:-1}}, {...rounded, params:{radius:NaN}},
  {...tube, params:{wall:10}}, {...tube, params:{wall:'2'}}, {...tube, params:[]},
  {...letter, text:''}, {...letter, text:'😺'}, {...letter, text:'A\nB'}
]) assert.throws(() => parseProject({version:1, units:'mm', name:'Invalid parameters', bodies:[body]}));
checks++;
console.log(`PASS ${checks} geometry checks: dimensions, Z-up transforms, extrusion, solid booleans, resizing, project validation, cloning, binary STL, rounded boxes, tubes, wedges, text counters, and v1 compatibility.`);
