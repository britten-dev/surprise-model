// What lies about a working deck.
//
// A ship's deck built to its drawings is bare: guns, hatches, boats and rigging, and
// nothing between them, which is exactly how a model on a bench looks and not at all how
// a frigate three months out of Spithead looks. This puts back the few things every one
// of them carried in the open: the scuttlebutt the watch drank from, casks lashed down in
// the waist, a hen coop at the break of the forecastle, the fire buckets in their rack at
// the break of the quarterdeck, shot garlands along the hatchways, and the falls of the
// running rigging coiled down by the masts.
//
// The objects are the photographed ones from src/ship/prop-assets.js. Where they are not
// loaded, or the level of detail does not want them, there is no clutter and the deck is
// as clean as it always was, and that includes every level below cinematic. Nothing here
// moves; it all gets wet with the deck.
import * as THREE from 'three';
import { SPEC } from '../spec/spec.js';
import { propModel } from './prop-assets.js';

const S = (k) => SPEC[k].value;

export function buildClutter(cfg, mats, model, ctx) {
  const group = new THREE.Group();
  group.name = 'clutter';
  // Cinematic only: at the hero level the ship is already within a few thousand triangles
  // of its host budget (src/ship/lod.js), and the clutter is about thirty-four thousand.
  if (cfg.boats === 'block' || cfg.textureSize < 2048 || !propModel('rope_coil', cfg)) return group;

  // Ship coordinates: x to starboard, y up, z aft. In the waist an object stands between
  // two gunports, so nothing sits in a gun's recoil; on the upper decks it keeps to the
  // centre, clear of the carronades along the sides.
  const portZ = ctx.ports.filter((p) => p.kind === 'gundeck').map((p) => p.z).sort((a, b) => a - b);
  const gaps = portZ.slice(1).map((z, i) => (z + portZ[i]) / 2)
    .filter((z) => z > ctx.zFcBreak + 1 && z < ctx.zQdBreak - 1);
  const gapNear = (z) => gaps.reduce((best, g) => (Math.abs(g - z) < Math.abs(best - z) ? g : best), gaps[0]);

  const place = (name, x, z, yaw = 0) => {
    const mesh = propModel(name, cfg);
    if (!mesh) return;
    const y = model.standingDeckAt(z);
    const half = model.halfBreadthAt(z, y);
    mesh.position.set(x, y + S('deck_camber') * (1 - (x / half) ** 2), z);
    mesh.rotation.y = yaw;
    group.add(mesh);
  };
  const along = Math.PI / 2;
  const zMain = ctx.zQdBreak - 1.3, zMizzen = model.fromStem(SPEC.wheel_station_from_stem.value) - 2.4;

  // ------------------------------------------------------------------- the waist
  // The scuttlebutt forward of the boats, where the watch could get at it and anyone above
  // can see it, and a pair of casks brought up from the hold and lashed to a chock until
  // they are struck below again.
  place('scuttlebutt', 1.95, gapNear(ctx.zQdBreak - 11.0));
  place('lashed_casks', -1.85, gapNear(ctx.zQdBreak - 9.0), along);
  // Shot garlands along the hatchway coamings, round shot ready to hand for the guns.
  place('shot_garland', 1.45, gapNear(ctx.zQdBreak - 7.2), along);
  place('shot_garland', -1.45, gapNear(ctx.zQdBreak - 6.0), along);
  // The main tack and sheet coiled down at the foot of the mainmast.
  place('rope_coil', 0.85, ctx.zQdBreak - 2.0, 0.3);

  // ----------------------------------------------------------- the quarterdeck
  // Fire buckets in their rack at the break, facing aft where the officer of the watch
  // can see them, and the falls of the braces coiled down on deck.
  place('fire_buckets', -1.5, ctx.zQdBreak + 0.4);
  place('rope_coil', -0.55, ctx.zQdBreak + 1.0, 1.1);
  place('rope_coil', 2.3, zMain + 6.0, 2.6);
  place('rope_coil', -0.85, zMizzen, 0.7);

  // ------------------------------------------------------------- the forecastle
  // Hen coops against the forecastle bulkhead, slats facing aft into the waist, and a
  // coil by the foremast.
  place('hen_coop', -2.2, ctx.zFcBreak - 0.55);
  place('hen_coop', 2.2, ctx.zFcBreak - 0.55);
  place('rope_coil', 1.0, ctx.zFcBreak - 3.6, 2.0);

  group.userData.count = group.children.length;
  return group;
}
