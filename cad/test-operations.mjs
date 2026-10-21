import assert from 'node:assert/strict';
import {THREE} from './vendor/engine.js';
import {createBody, buildMesh, calculateBounds, estimateVolume, exportSTL} from './model.js';
import {alignBodies, distributeBodies, mirrorBodies, linearPattern, radialPattern, importSTL, summarizeBodies} from './operations.js';

let checks = 0;
const near = (actual, expected, tolerance = 0.001) => assert(Math.abs(actual - expected) <= tolerance, `${actual} should be within ${tolerance} of ${expected}`);
const nearVector = (actual, expected, tolerance) => actual.forEach((value, axis) => near(value, expected[axis], tolerance));
const box = (position, dimensions = [10,10,10], rotation = [0,0,0], extra = {}) => createBody('box', {position, dimensions, rotation, ...extra});

const reference = box([15, -3, 20], [10,20,30], [0,0,30], {locked:true});
const moving = box([-40,8,5], [8,15,10], [0,0,90]);
const original = JSON.stringify([reference,moving]);
for (const axis of [0,1,2]) {
  for (const anchor of ['min','center','max']) {
    const result = alignBodies([reference,moving], axis, anchor);
    near(calculateBounds([result[1]])[anchor][axis], calculateBounds([reference])[anchor][axis]);
    assert.deepEqual(result[0], reference);
    assert.equal(result[1].id, moving.id);
  }
}
assert.equal(JSON.stringify([reference,moving]), original);
assert.throws(() => alignBodies([reference,{...moving,locked:true}],0,'min'), /Unlock/);
assert.throws(() => alignBodies([reference,moving],4), /axis/); checks++;

const endpoints = [box([0,0,5]), box([10,0,5]), box([100,0,5]), box([70,0,5])];
const distributed = distributeBodies(endpoints,0);
nearVector(distributed.map(body => body.position[0]), [0,100/3,100,200/3]);
assert.deepEqual(distributed[0], endpoints[0]); assert.deepEqual(distributed[2], endpoints[2]);
assert.throws(() => distributeBodies([endpoints[0],{...endpoints[1],locked:true},endpoints[2]],0), /Unlock/);
assert.throws(() => distributeBodies([endpoints[0],endpoints[0]],0)); checks++;

const asymmetric = createBody('extrusion', {points:[[0,0],[20,0],[4,12]], dimensions:[20,12,8], position:[23,5,17], rotation:[20,15,35]});
const partner = box([-25,3,5]);
const mirrored = mirrorBodies([asymmetric,partner],0);
const plane = calculateBounds([asymmetric,partner]).center[0];
for (let i=0;i<mirrored.length;i++) {
  assert.notEqual(mirrored[i].id, [asymmetric,partner][i].id);
  assert.equal(mirrored[i].type,'custom');
  near(estimateVolume(mirrored[i]), estimateVolume([asymmetric,partner][i]), 0.01);
  const bounds = calculateBounds([[asymmetric,partner][i]]), reflected = calculateBounds([mirrored[i]]);
  near(reflected.min[0],2*plane-bounds.max[0]); near(reflected.max[0],2*plane-bounds.min[0]);
  nearVector(reflected.min.slice(1), bounds.min.slice(1));
  const mesh = buildMesh(mirrored[i]), positions=mesh.geometry.getAttribute('position');
  let signed=0;
  for(let j=0;j<positions.count;j+=3) {
    const a = new THREE.Vector3().fromBufferAttribute(positions,j), b=new THREE.Vector3().fromBufferAttribute(positions,j+1), c=new THREE.Vector3().fromBufferAttribute(positions,j+2);
    signed+=a.dot(b.cross(c))/6;
  }
  assert(signed>0, 'A reflected solid retains outward triangle winding');
  mesh.geometry.dispose();mesh.material.dispose();
} checks++;

const source = box([5,10,5], [8,10,12], [10,20,30]);
const linear = linearPattern([source],{count:4,axis:1,spacing:-25});
assert.equal(linear.length,3);nearVector(linear.map(body=>body.position[1]),[-15,-40,-65]);
assert.equal(new Set([source,...linear].map(body=>body.id)).size,4);
assert.deepEqual(linear[0].rotation,source.rotation);
assert.throws(()=>linearPattern([source],{count:100,axis:0,spacing:10}),/2–20/);
assert.throws(()=>linearPattern([source],{count:3,axis:0,spacing:0}),/nonzero/); checks++;

const radial = radialPattern([box([20,0,5],[10,8,10])],{count:4,axis:2,angle:360,center:[0,0,5]});
nearVector(radial[0].position,[0,20,5]);nearVector(radial[1].position,[-20,0,5]);nearVector(radial[2].position,[0,-20,5]);
near(radial[0].rotation[2],90); near(Math.abs(radial[1].rotation[2]),180);
const partial = radialPattern([box([20,0,5])],{count:3,axis:2,angle:180,center:[0,0,5]});
nearVector(partial[0].position,[0,20,5]);nearVector(partial[1].position,[-20,0,5]);
const tilted = radialPattern([source],{count:2,axis:0,angle:90,center:[0,0,0]})[0];
const expected = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0),Math.PI/2).multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(...source.rotation.map(THREE.MathUtils.degToRad))));
const actual = new THREE.Quaternion().setFromEuler(new THREE.Euler(...tilted.rotation.map(THREE.MathUtils.degToRad)));
near(Math.abs(actual.dot(expected)),1);
assert.throws(()=>radialPattern([source],{count:3,axis:2,angle:0}),/nonzero/); checks++;

const stlSource=box([100,-50,40],[10,20,30],[0,0,90]);
const binary=exportSTL([stlSource]);
const binaryBody=importSTL(binary,'precise part.STL');
assert.equal(binaryBody.name,'precise part');nearVector(binaryBody.dimensions,[20,10,30]);
nearVector(calculateBounds([binaryBody]).min,[-10,-5,0]);near(estimateVolume(binaryBody),6000,0.01);
const buffered=new Uint8Array(binary.byteLength+16);buffered.set(new Uint8Array(binary),8);
nearVector(importSTL(new DataView(buffered.buffer,8,binary.byteLength)).dimensions,[20,10,30]);
const inches=importSTL(binary,'inches.stl',{units:'in'});nearVector(inches.dimensions,[508,254,762],0.01); checks++;

const view=new DataView(binary), facets=[];
for(let triangle=0;triangle<view.getUint32(80,true);triangle++) {
  const values=[];
  for(let i=0;i<3;i++) values.push(`vertex ${[0,1,2].map(axis=>view.getFloat32(84+triangle*50+12+i*12+axis*4,true)).join(' ')}`);
  facets.push(`facet normal 0 0 1\nouter loop\n${values.join('\n')}\nendloop\nendfacet`);
}
const ascii=`solid test\n${facets.join('\n')}\nendsolid test`;
const asciiBody=importSTL(ascii,'/folder/ascii.stl');
nearVector(asciiBody.dimensions,[20,10,30]);near(estimateVolume(asciiBody),6000,0.01);
for(const invalid of ['', 'not an stl', 'solid invalid\nendsolid invalid', binary.slice(0,binary.byteLength-1),ascii.replace(/vertex [^\n]+/,'vertex NaN 0 0')]) assert.throws(()=>importSTL(invalid));
const malicious=new ArrayBuffer(84);new DataView(malicious).setUint32(80,0xffffffff,true);assert.throws(()=>importSTL(malicious));
assert.throws(()=>importSTL(binary,'bad.stl',{units:'cm'}),/millimeters/); checks++;

const hidden=box([1000,1000,1000],[10,10,10],[0,0,0],{visible:false});
const stats=summarizeBodies([source,box([5,10,25],[10,10,10]),hidden]);
assert.equal(stats.bodyCount,2);assert.equal(stats.triangleCount,24);near(stats.centerDistance,20);
near(stats.estimatedVolume,1960,0.01);assert(stats.surfaceArea>0);assert.equal(stats.bounds.empty,false);
assert.deepEqual(summarizeBodies([]),{dimensions:[0,0,0],bounds:{min:[0,0,0],max:[0,0,0],size:[0,0,0],center:[0,0,0],empty:true},estimatedVolume:0,surfaceArea:0,bodyCount:0,triangleCount:0,centerDistance:null}); checks++;

console.log(`PASS ${checks} operation groups: world-space alignment/distribution, reflected winding, linear/radial patterns, binary/ASCII STL validation and scale, selected-body measurements.`);
