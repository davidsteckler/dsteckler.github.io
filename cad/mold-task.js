import {MEMORY_LIMITS} from './memory.js';

/** Isolate each cut, then release the entire worker and its geometry caches. */
export function startMoldTask(body, stroke, {WorkerClass = globalThis.Worker, timeoutMs = MEMORY_LIMITS.moldTimeoutMs} = {}) {
  let worker, timer, rejectTask, settled = false;
  function cleanup() { clearTimeout(timer); worker?.terminate(); worker = null; }
  function fail(error) {
    if (settled) return;
    settled = true; cleanup(); rejectTask(error);
  }
  const promise = new Promise((resolve, reject) => {
    rejectTask = reject;
    try {
      if (!WorkerClass) throw Error('This browser cannot run the eraser. Try a current browser.');
      worker = new WorkerClass(new URL('./mold-worker.js?v=4', import.meta.url), {type:'module'});
      worker.onmessage = ({data}) => {
        if (settled) return;
        if (data?.error) { fail(Error(data.error)); return; }
        if (!data?.body) { fail(Error('The stroke could not finish. Try a shorter stroke.')); return; }
        settled = true; cleanup(); resolve(data.body);
      };
      worker.onerror = event => { event.preventDefault?.(); fail(Error('The stroke could not finish. Try a shorter stroke.')); };
      worker.onmessageerror = () => fail(Error('The stroke could not finish. Your design is unchanged.'));
      timer = setTimeout(() => fail(Error('This stroke took too long and was canceled. Try a shorter stroke.')), timeoutMs);
      const {points, normal, diameter, depth, through} = stroke;
      worker.postMessage({body, stroke:{points, normal, diameter, depth, through}});
    } catch (error) { fail(error); }
  });
  return {promise, cancel:() => fail(Error('Stroke canceled. Your design is unchanged.'))};
}
