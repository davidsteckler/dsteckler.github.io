import assert from 'node:assert/strict';
import {MEMORY_LIMITS, historyBytes, trimHistory} from './memory.js';
import {startMoldTask} from './mold-task.js';
import {moldCapacity, moldTriangleCount, moldCutters, shaveBody} from './mold.js';
import {createBody, buildMesh, serializeProject, estimateVolume} from './model.js';

const undo = Array.from({length:60}, (_, i) => String(i).padEnd(100000, '.'));
const redo = [];
trimHistory(undo, redo);
assert.equal(undo.length, MEMORY_LIMITS.historyEntries);
assert(undo.at(-1).startsWith('59'));
undo.push('x'.repeat(MEMORY_LIMITS.historyBytes / 2));
trimHistory(undo, redo);
assert.equal(undo.length, 1);
assert(historyBytes(undo, redo) <= MEMORY_LIMITS.historyBytes);
redo.push('next'); trimHistory(undo, redo, redo);
assert.equal(undo.length, 0); assert.equal(redo[0], 'next');
undo.push('x'.repeat(MEMORY_LIMITS.historyBytes)); trimHistory(undo, redo);
assert(historyBytes(undo, redo) <= MEMORY_LIMITS.historyBytes, 'Oversized individual snapshots are released too');

const plate = createBody('box', {dimensions:[80,60,10], position:[0,0,5]});
const brush = {points:[[0,0,10]], normal:[0,0,1], diameter:4, depth:1};
assert.throws(() => moldCutters({...brush, points:Array.from({length:MEMORY_LIMITS.strokePoints + 1}, () => [0,0,10])}), /shorter/);
const mesh = buildMesh(plate), triangles = mesh.geometry.toNonIndexed();
const positions = Array.from(triangles.attributes.position.array);
mesh.geometry.dispose(); mesh.material.dispose(); triangles.dispose();
const large = createBody('custom', {...plate, type:'custom', geometry:{position:Array.from({length:500}, () => positions).flat(), index:null}});
assert.equal(moldTriangleCount(large), 6000);
assert.equal(moldCapacity([large], large).allowed, false);
const before = serializeProject([large]);
assert.throws(() => shaveBody(large, brush), /detail limit/);
assert.equal(serializeProject([large]), before, 'Detail limits leave the original model intact');
assert.equal(moldCapacity([large, large, large, large]).allowed, false, 'The whole project has a detail budget');

class FakeWorker {
  static all = [];
  constructor() { this.terminated = false; FakeWorker.all.push(this); }
  postMessage(data) { this.input = data; }
  terminate() { this.terminated = true; }
}
const finished = startMoldTask(plate, brush, {WorkerClass:FakeWorker});
let worker = FakeWorker.all.at(-1);
worker.onmessage({data:{body:plate}});
assert.equal(await finished.promise, plate); assert(worker.terminated);
const canceled = startMoldTask(plate, brush, {WorkerClass:FakeWorker});
worker = FakeWorker.all.at(-1); canceled.cancel();
await assert.rejects(canceled.promise, /canceled/); assert(worker.terminated);
const timeout = startMoldTask(plate, brush, {WorkerClass:FakeWorker, timeoutMs:5});
worker = FakeWorker.all.at(-1);
await assert.rejects(timeout.promise, /too long/); assert(worker.terminated);
const failed = startMoldTask(plate, brush, {WorkerClass:FakeWorker});
worker = FakeWorker.all.at(-1); worker.onmessage({data:{error:'Missed the solid'}});
await assert.rejects(failed.promise, /Missed/); assert(worker.terminated);
const broken = startMoldTask(plate, brush, {WorkerClass:FakeWorker});
worker = FakeWorker.all.at(-1); worker.onerror({preventDefault(){}});
await assert.rejects(broken.promise, /could not finish/); assert(worker.terminated);
assert(FakeWorker.all.every(w => w.terminated), 'Success, cancel, timeout and errors release workers');

let current = plate;
for (let i = 0; i < 25; i++) {
  if (!moldCapacity([current], current).allowed) break;
  current = shaveBody(current, {...brush, points:[[-24 + (i % 5) * 12, -18 + Math.floor(i / 5) * 9, 10]]});
  assert(moldTriangleCount(current) <= MEMORY_LIMITS.moldOutputTriangles);
}
assert(estimateVolume(current) < estimateVolume(plate) - 250);
console.log('PASS memory limits: bounded Undo/Redo, short strokes, shape/project detail checks, worker cleanup on every outcome, and 25 sequential eraser operations.');
