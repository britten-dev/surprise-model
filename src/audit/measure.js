// The audit measures the geometry that was actually produced. It does not read back
// the numbers the generator was given — that would only prove the generator can
// remember its own inputs. Every part that matters carries an `audit` tag, and this
// module walks the built scene, computes the measurement from world-space vertices,
// and pairs it with the spec row it is meant to satisfy.
import * as THREE from 'three';
import { SPEC } from '../spec/spec.js';
import { rad } from '../util/math.js';

/**
 * Tag an object for the audit. Call it where the part is built.
 *
 * @param {THREE.Object3D} obj
 * @param {string} key       the snake_case key in SPECS.md and src/spec/spec.js
 * @param {string} metric    how to measure it — see MEASURES below
 * @param {object} [opts]    `tolerance` overrides the default 2 per cent
 */
export function audit(obj, key, metric, opts = {}) {
  obj.userData.audit = { key, metric, ...opts };
  return obj;
}

// Each measurement takes the world-space bounding box, the object and the collected
// world-space vertex positions, and returns a number in metres or degrees.
const MEASURES = {
  extent_x: ({ size }) => size.x,
  extent_y: ({ size }) => size.y,
  extent_z: ({ size }) => size.z,
  // The longest of the three, for a spar whose orientation the audit should not care
  // about — a yard braced round still has the same length.
  extent_max: ({ size }) => Math.max(size.x, size.y, size.z),
  min_y: ({ box }) => box.min.y,
  max_y: ({ box }) => box.max.y,
  min_z: ({ box }) => box.min.z,
  max_z: ({ box }) => box.max.z,
  centre_x: ({ box }) => (box.min.x + box.max.x) / 2,
  centre_y: ({ box }) => (box.min.y + box.max.y) / 2,
  centre_z: ({ box }) => (box.min.z + box.max.z) / 2,
  // Where the object's own origin sits, which is what a mast step or a gunport is
  // really specified by.
  origin_x: ({ obj }) => obj.getWorldPosition(new THREE.Vector3()).x,
  origin_y: ({ obj }) => obj.getWorldPosition(new THREE.Vector3()).y,
  origin_z: ({ obj }) => obj.getWorldPosition(new THREE.Vector3()).z,
  // Rake: how far the object's local +Y leans aft of vertical, in degrees. Masts rake
  // aft, so a positive number is correct and a negative one means the mast is
  // leaning over the bow.
  rake_deg: ({ obj }) => {
    const up = new THREE.Vector3(0, 1, 0).applyQuaternion(obj.getWorldQuaternion(new THREE.Quaternion()));
    return rad(Math.atan2(up.z, up.y));
  },
  // Steeve: how far the bowsprit rises above the horizontal, in degrees.
  steeve_deg: ({ obj }) => {
    const axis = new THREE.Vector3(0, 1, 0).applyQuaternion(obj.getWorldQuaternion(new THREE.Quaternion()));
    return rad(Math.atan2(axis.y, Math.hypot(axis.x, axis.z)));
  },
  count: ({ obj }) => (obj.isInstancedMesh ? obj.count : obj.children.length),
};

/**
 * Walk a built ship and produce the audit table.
 * @param {THREE.Object3D} root
 */
export function measureShip(root) {
  root.updateWorldMatrix(true, true);
  const rows = [];
  const seen = new Set();
  const missing = [];

  root.traverse((obj) => {
    const tag = obj.userData.audit;
    if (!tag) return;
    const spec = SPEC[tag.key];
    if (spec === undefined) {
      missing.push(`audit tag "${tag.key}" has no row in src/spec/spec.js`);
      return;
    }
    const fn = MEASURES[tag.metric];
    if (!fn) { missing.push(`unknown audit metric "${tag.metric}" on ${tag.key}`); return; }

    const box = new THREE.Box3().setFromObject(obj);
    const size = box.getSize(new THREE.Vector3());
    const actual = fn({ obj, box, size });

    rows.push({
      key: tag.key,
      metric: tag.metric,
      expected: typeof spec === 'object' ? spec.value : spec,
      actual,
      tolerance: tag.tolerance ?? (typeof spec === 'object' ? spec.tolerance : undefined),
      source: typeof spec === 'object' ? spec.source : undefined,
      note: typeof spec === 'object' ? spec.note : undefined,
    });
    seen.add(tag.key);
  });

  // The other half of the contract: a spec row that nothing in the model is measured
  // against is a row the generator may have quietly stopped honouring.
  const unchecked = Object.keys(SPEC).filter((k) => !seen.has(k) && !SPEC[k]?.noAudit);

  rows.sort((a, b) => a.key.localeCompare(b.key));
  return { rows, missing, unchecked };
}
