// Photographed painted planking, for the boards src/ship/hull-timber.js lays out.
//
// Two greyscale atlases made by tools/import-scans.mjs from "Black Painted Planks"
// (Poly Haven, CC0; provenance in src/assets/PROVENANCE.md): one strip per board of the
// scan, laid along x, about mid-grey. `colour` is the scuffs, scratches and grain under
// the paint; `height` is the same inverted and softened, a scratch being a shallow groove.
// `copper` is the brightness of a photographed sheet of weathered copper (Metal058B,
// ambientCG, CC0), for src/ship/textures.js's copperSheathing, and `spar` the grain of a
// long sliced board ("Oak Veneer 01", Poly Haven, CC0), for src/ship/spar-finish.js.
//
// Like the photographed crew and boats they are optional: `preloadHullScan()` has to have
// finished before `buildShip`, and if it has not, the planks keep their drawn grain.
import { fetchImage } from './asset-fetch.js';

export const HULL_SCAN = {
  strip: 64,        // pixels per board across
  length: 1024,     // pixels per board along
  tileMetres: 1.6,  // the length of hull one strip covers
};
let scan = null;
let pending = null;

export function getHullScan() { return scan; }

export function preloadHullScan() {
  pending ??= new Promise((resolve) => {
    const deadline = setTimeout(() => resolve(false), 15000);
    const load = (name) => fetchImage(new URL(`../assets/hull/${name}.jpg`, import.meta.url));
    Promise.all(['planks-colour', 'planks-height', 'copper', 'spar'].map(load)).then(([colour, height, copper, spar]) => {
      clearTimeout(deadline);
      scan = { ...HULL_SCAN, colour, height, copper, spar, boards: Math.floor(colour.naturalHeight / HULL_SCAN.strip) };
      resolve(true);
    }, () => { clearTimeout(deadline); resolve(false); });
  });
  return pending;
}
