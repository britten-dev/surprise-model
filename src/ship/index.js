// The ship. Assembles every region in the order a shipwright would: hull, then decks,
// then the fittings that stand on them, then the masts, then what hangs from the masts.
//
// Each module is handed the LOD configuration, the materials and the hull model, and
// returns a Group. No module invents a dimension; all of them read the spec.
import * as THREE from 'three';
import { lodConfig, LODS } from './lod.js';
import { makeMaterials } from './materials.js';
import { buildHull, hullModel } from './hull.js';
import { portLayout, makePortCutter, buildPorts } from './ports.js';
import { buildDecks } from './decks.js';
import { buildStern } from './stern.js';
import { buildHead } from './head.js';
import { buildChannels } from './channels.js';
import { buildFurniture } from './furniture.js';
import { buildGuns } from './guns.js';
import { buildBoats } from './boats.js';
import { buildGroundTackle } from './ground-tackle.js';
import { buildFlags } from './flags.js';
import { buildRig } from './rig.js';
import { buildCrew } from './crew.js';

export { LODS };
export const SAIL_STATES = ['full', 'topsails', 'storm', 'furled'];

// The ship this module builds does not move. `createMotion` is the layer that makes her:
// a host calls it once on a built ship and then once a frame, and her canvas shivers, her
// rigging swings, her masts work, her colours fly and her watch leans against the heel.
// It is re-exported here rather than only from its own module so that a host has one
// import for the whole package.
export { createMotion } from './motion.js';

/**
 * @param {object} [opts]
 * @param {string} [opts.lod]   'hero' | 'game' | 'distant'
 * @param {string} [opts.sails] 'full' | 'topsails' | 'storm' | 'furled'
 * @param {string} [opts.weather] 'fair' | 'heavy'. Defaults to heavy in the storm state.
 *   This is what a ship *does* about the weather, as against what she is wearing, and it
 *   is a long list: her gunports are shut and her guns housed, deadlights are shipped over
 *   the stern windows, the hatches are battened under tarpaulins, lifelines are rigged
 *   fore and aft for the people to hold by, the boats are double-gripped and the guns on
 *   the open decks have their tompions in. None of it is decoration — every item is
 *   something that, left undone, lets the sea into the ship or lets something heavy go
 *   adrift in her.
 * @param {string} [opts.ports] 'open' | 'shut'. Follows the weather unless it is given.
 *   It is separable because the two are not quite the same claim: a ship can be under her
 *   topsails in a rising sea with her ports already in.
 */
export function buildShip({ lod = 'hero', sails = 'full', weather, ports: portState } = {}) {
  if (!SAIL_STATES.includes(sails)) {
    throw new Error(`unknown sail state "${sails}" — expected one of ${SAIL_STATES.join(', ')}`);
  }
  if (weather !== undefined && !['fair', 'heavy'].includes(weather)) {
    throw new Error(`unknown weather "${weather}" — expected "fair" or "heavy"`);
  }
  if (portState !== undefined && !['open', 'shut'].includes(portState)) {
    throw new Error(`unknown port state "${portState}" — expected "open" or "shut"`);
  }
  const heavyWeather = weather === undefined ? sails === 'storm' : weather === 'heavy';
  const portsShut = portState === undefined ? heavyWeather : portState === 'shut';
  const cfg = lodConfig(lod);
  const mats = makeMaterials(cfg);
  const model = hullModel();

  const ship = new THREE.Group();
  ship.name = `surprise_${lod}_${sails}`;
  ship.userData.lod = lod;
  ship.userData.sails = sails;
  ship.userData.ports = portsShut ? 'shut' : 'open';
  ship.userData.weather = heavyWeather ? 'heavy' : 'fair';

  // The hull first, with the gunports cut out of the loft grid as it is built.
  const ports = portLayout(model);
  const hull = buildHull(cfg, mats, model, { skipQuad: makePortCutter(model, ports) });
  ship.add(hull.group);

  const decks = buildDecks(cfg, mats, model);
  ship.add(decks.group);

  const ctx = {
    cfg, mats, model, sails, lod, ports, portsShut, heavyWeather,
    zFcBreak: decks.zFcBreak,
    zQdBreak: decks.zQdBreak,
  };

  ship.add(buildPorts(cfg, mats, model, ports, ctx));
  ship.add(buildStern(cfg, mats, model, ctx));
  ship.add(buildHead(cfg, mats, model, ctx));
  ship.add(buildChannels(cfg, mats, model, ctx));
  ship.add(buildFurniture(cfg, mats, model, ctx));
  ship.add(buildGuns(cfg, mats, model, ctx));
  ship.add(buildBoats(cfg, mats, model, ctx));
  ship.add(buildGroundTackle(cfg, mats, model, ctx));
  ship.add(buildRig(cfg, mats, model, ctx));
  ship.add(buildFlags(cfg, mats, model, ctx));
  // The watch last, because two of them stand in the main top and the rig has to have
  // been built before anything can be stood on it.
  ship.add(buildCrew(cfg, mats, model, ctx));

  return ship;
}
