import {THREE} from './vendor/engine.js';
import {createBody, combineBodies, calculateBounds, estimateVolume, parseProject} from './model.js';

const check = (condition, message) => { if (!condition) throw Error(message); };

/** A surface-aligned, closed cutter for each segment, with round ends. */
export function moldCutters({points, normal, diameter = 10, depth = 2}) {
  check(Array.isArray(points) && points.length >= 1 && points.length <= 48, 'Use a shorter mold stroke, with up to 48 points.');
  check(points.every(p => Array.isArray(p) && p.length === 3 && p.every(n => Number.isFinite(n) && Math.abs(n) <= 1000000)), 'Mold points must contain valid coordinates.');
  check(Array.isArray(normal) && normal.length === 3 && normal.every(Number.isFinite), 'Choose a valid surface for the mold brush.');
  const n = new THREE.Vector3(...normal);
  check(n.length() > 0.9 && n.length() < 1.1, 'Choose a valid surface normal.'); n.normalize();
  check(Number.isFinite(diameter) && diameter >= 0.5 && diameter <= 1000, 'Choose a brush size between 0.5 and 1,000 mm.');
  check(Number.isFinite(depth) && depth >= 0.1 && depth <= 100000, 'Choose a cut depth between 0.1 and 100,000 mm.');
  const u = new THREE.Vector3(Math.abs(n.z) < 0.9 ? 0 : 1, 0, Math.abs(n.z) < 0.9 ? 1 : 0).cross(n).normalize();
  const v = n.clone().cross(u), origin = new THREE.Vector3(...points[0]);
  const matrix = new THREE.Matrix4().makeBasis(u, v, n);
  const euler = new THREE.Euler().setFromRotationMatrix(matrix);
  const rotation = [euler.x, euler.y, euler.z].map(THREE.MathUtils.radToDeg);
  const projected = points.map(p => {
    const relative = new THREE.Vector3(...p).sub(origin);
    check(Math.abs(relative.dot(n)) < 0.01, 'Keep each stroke on the surface where it started.');
    return [relative.dot(u), relative.dot(v)];
  });
  const cutters = [], radius = diameter / 2, overrun = Math.max(0.05, depth * 0.01);
  for (let i = 0; i < Math.max(1, projected.length - 1); i++) {
    const a = projected[i], b = projected[i + 1] || a;
    const angle = Math.atan2(b[1] - a[1], b[0] - a[0]), profile = [];
    if (Math.hypot(b[0] - a[0], b[1] - a[1]) < 0.0001) {
      for (let step = 0; step < 24; step++) {
        const t = step / 24 * Math.PI * 2;
        profile.push([a[0] + Math.cos(t) * radius, a[1] + Math.sin(t) * radius]);
      }
    } else {
      for (const [center, start] of [[b, angle - Math.PI / 2], [a, angle + Math.PI / 2]]) {
        for (let step = 0; step <= 12; step++) {
          const t = start + step / 12 * Math.PI;
          profile.push([center[0] + Math.cos(t) * radius, center[1] + Math.sin(t) * radius]);
        }
      }
    }
    const xs = profile.map(p => p[0]), ys = profile.map(p => p[1]);
    const center = [(Math.min(...xs) + Math.max(...xs)) / 2, (Math.min(...ys) + Math.max(...ys)) / 2];
    const position = origin.clone().addScaledVector(u, center[0]).addScaledVector(v, center[1]).addScaledVector(n, (overrun - depth) / 2);
    cutters.push(createBody('extrusion', {name:'Mold brush', color:'#dc795c', points:profile,
      dimensions:[Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys), depth + overrun], position:position.toArray(), rotation}));
  }
  return cutters;
}

/** One atomic edit: unrelated bodies and the input remain unchanged. */
export function shaveBody(body, stroke) {
  check(body && !body.locked && body.visible !== false, 'Choose a visible, unlocked shape to mold.');
  const source = parseProject({version:1, units:'mm', name:'Mold', bodies:[body]}).bodies[0];
  const depth = stroke.through ? calculateBounds([source]).size.reduce((sum, n) => sum + n, 1) : stroke.depth;
  const cutters = moldCutters({...stroke, depth});
  const originalVolume = estimateVolume(source);
  let result = source;
  for (let i = 0; i < cutters.length; i += 19) result = combineBodies([result, ...cutters.slice(i, i + 19)], 'subtract');
  check(originalVolume - estimateVolume(result) > Math.max(0.00001, originalVolume * 1e-8), 'The brush missed the solid. Start a stroke on a solid surface.');
  result.id = source.id; result.name = source.name; result.color = source.color;
  return parseProject({version:1, units:'mm', name:'Mold', bodies:[result]}).bodies[0];
}
