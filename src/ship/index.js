// The ship. Assembles every region in the order a shipwright would: hull, then decks,
// then the fittings that stand on them, then the masts, then what hangs from the masts.
//
// Each module is handed the LOD configuration and the materials and returns a Group. No
// module invents a dimension; all of them read the spec.
import * as THREE from 'three';
import { lodConfig, LODS } from './lod.js';
import { makeMaterials } from './materials.js';
import { buildHull, hullModel } from './hull.js';
import { portLayout, makePortCutter, buildPorts } from './ports.js';

export { LODS };
export const SAIL_STATES = ['full', 'topsails', 'storm', 'furled'];

export function buildShip({ lod = 'hero', sails = 'full' } = {}) {
  if (!SAIL_STATES.includes(sails)) {
    throw new Error(`unknown sail state "${sails}" — expected one of ${SAIL_STATES.join(', ')}`);
  }
  const cfg = lodConfig(lod);
  const mats = makeMaterials(cfg);

  const ship = new THREE.Group();
  ship.name = `surprise_${lod}_${sails}`;
  ship.userData.lod = lod;
  ship.userData.sails = sails;

  const model = hullModel();
  const ctx = { cfg, mats, model, sails, lod };

  const ports = portLayout(model);
  const hull = buildHull(cfg, mats, model, { skipQuad: makePortCutter(model, ports) });
  ship.add(hull.group);
  ship.add(buildPorts(cfg, mats, model, ports));

  return ship;
}
