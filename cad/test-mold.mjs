import assert from 'node:assert/strict';
import {THREE} from './vendor/engine.js';
import {createBody, estimateVolume, serializeProject, parseProject, exportSTL, calculateBounds} from './model.js';
import {moldCutters, shaveBody} from './mold.js';

const plate = createBody('box', {name:'My plate', color:'#497cbd', dimensions:[40,30,10], position:[0,0,5]});
const before = JSON.stringify(plate), original = estimateVolume(plate);
const brush = {points:[[0,0,10]], normal:[0,0,1], diameter:10, depth:2};
const area = 24 / 2 * 25 * Math.sin(Math.PI / 12);
const near = (actual, expected, tolerance = 0.15) => assert(Math.abs(actual - expected) < tolerance, `${actual} != ${expected}`);
const cut = shaveBody(plate, brush);
near(original - estimateVolume(cut), area * 2);
assert.equal(cut.id, plate.id); assert.equal(cut.name, plate.name); assert.equal(cut.color, plate.color);
assert.equal(JSON.stringify(plate), before, 'Molding preserves the source for Undo');
near(calculateBounds([cut]).max[2], 10);

const stroke = shaveBody(plate, {...brush, points:[[-10,0,10],[10,0,10]]});
near(original - estimateVolume(stroke), (area + 20 * 10) * 2);
const through = shaveBody(plate, {...brush, through:true});
near(original - estimateVolume(through), area * 10);
const deeper = shaveBody(cut, {...brush, points:[[0,0,8]]});
near(original - estimateVolume(deeper), area * 4, 0.3);

const side = shaveBody(plate, {...brush, points:[[20,0,5]], normal:[1,0,0], diameter:6});
assert(estimateVolume(side) < original - 50);
const turned = createBody('box', {...plate, rotation:[25,15,35], position:[30,20,25]});
const rotation = new THREE.Euler(...turned.rotation.map(THREE.MathUtils.degToRad));
const normal = new THREE.Vector3(0,0,1).applyEuler(rotation);
const point = normal.clone().multiplyScalar(5).add(new THREE.Vector3(...turned.position));
const angled = shaveBody(turned, {...brush, normal:normal.toArray(), points:[point.toArray()]});
near(estimateVolume(turned) - estimateVolume(angled), area * 2);

const curved = shaveBody(plate, {...brush, points:[[-10,0,10],[0,5,10],[10,0,10]], diameter:8});
assert(estimateVolume(curved) < original - 400);
assert(estimateVolume(curved) > original - 550);
const loop = shaveBody(plate, {...brush, diameter:4, points:[[-8,-5,10],[8,5,10],[-8,5,10],[8,-5,10]]});
assert(estimateVolume(loop) < original - 200 && estimateVolume(loop) > original - 600);
assert.deepEqual(parseProject(serializeProject([cut, {...through,id:'through'}])).bodies[0], cut);
assert(exportSTL([curved]).byteLength > 84);
assert.throws(() => shaveBody({...plate,locked:true}, brush), /unlocked/);
assert.throws(() => shaveBody({...plate,visible:false}, brush), /visible/);
assert.throws(() => shaveBody(plate, {...brush, points:[[200,0,10]]}), /missed/);
assert.throws(() => moldCutters({...brush, depth:0}), /depth/);
assert.throws(() => moldCutters({...brush, diameter:0}), /size/);
assert.throws(() => moldCutters({...brush, normal:[0,0,0]}), /normal/);
assert.throws(() => moldCutters({...brush, points:[[0,0,10],[0,0,11]]}), /surface/);
assert.equal(JSON.stringify(plate), before);
console.log('PASS mold: shallow, continuous, curved, crossing, side, rotated, repeated and through cuts; source preservation, stable identity, save/export and invalid inputs.');
