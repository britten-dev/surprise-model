// The sails, in four states.
//
// A square sail is not a flat sheet. It is bent to the yard above it, its clews are
// hauled out to the yardarms of the yard below, and the wind puts a belly in it. So
// each sail is built as a curved surface between two yards, with the head the width of
// its own yard and the foot the width of the yard beneath — which is why a topsail is
// wider at the foot than at the head, and why the whole suit sits in a pyramid.
//
// The four states the brief asks for:
//   full      courses, topsails, topgallants, staysails and three headsails
//   topsails  topsails and the spanker only — the usual cruising rig
//   storm     a reefed foresail and a close-reefed main topsail, nothing else
//   furled    every sail handed and stowed on its yard
import * as THREE from 'three';
import { SPEC } from '../spec/spec.js';
import { mergeGeometries } from '../util/loft.js';
import { spar } from '../util/solids.js';
import { lerp, clamp, deg } from '../util/math.js';
import { audit } from '../audit/measure.js';

const S = (k) => SPEC[k].value;

// Which sails are set in each state. A sail named here is drawn; anything not named is
// either furled on its yard or not there at all.
const SUIT = {
  full: {
    set: ['fore_course', 'main_course',
      'fore_topsail', 'main_topsail', 'mizzen_topsail',
      'fore_topgallant', 'main_topgallant', 'mizzen_topgallant',
      'main_staysail', 'main_topmast_staysail', 'mizzen_staysail',
      'fore_topmast_staysail', 'jib', 'flying_jib',
      'spanker'],
    reefs: {},
  },
  topsails: {
    set: ['fore_topsail', 'main_topsail', 'mizzen_topsail', 'fore_topmast_staysail', 'spanker'],
    reefs: {},
  },
  storm: {
    // Reefed foresail and close-reefed main topsail: what she would show in a gale.
    set: ['fore_course', 'main_topsail'],
    reefs: { fore_course: 0.62, main_topsail: 0.45 },
  },
  furled: { set: [], reefs: {} },
};

/**
 * A square sail: a surface hung from the head yard, spread to the foot yard, bellying
 * away from the wind. `reef` shortens the drop, as taking in a reef does.
 */
function squareSail(headCentre, headWidth, footCentre, footWidth, cfg, { reef = 1, belly = S('sail_belly'), braceRad = 0 } = {}) {
  const [nu, nv] = cfg.sailSegments;
  const drop = headCentre.distanceTo(footCentre) * reef;
  const foot = new THREE.Vector3().lerpVectors(headCentre, footCentre, reef);

  // The sail bellies to leeward. The yards are braced round by `braceRad`, so leeward
  // is square to the yard, not square to the ship.
  const lee = new THREE.Vector3(Math.sin(braceRad), 0, Math.cos(braceRad)).normalize();
  const across = new THREE.Vector3(Math.cos(braceRad), 0, -Math.sin(braceRad)).normalize();

  const pos = [], uvs = [], idx = [];
  for (let j = 0; j <= nv; j++) {
    const v = j / nv;
    const centre = new THREE.Vector3().lerpVectors(headCentre, foot, v);
    const width = lerp(headWidth, footWidth, v);
    for (let i = 0; i <= nu; i++) {
      const u = i / nu;
      const s = (u - 0.5) * width;
      // The belly: fullest in the middle of the sail and dying away at head, foot and
      // both leeches, where the sail is held to a spar or a rope.
      const b = Math.sin(Math.PI * u) * Math.sin(Math.PI * clamp(v * 0.86 + 0.07, 0, 1)) * belly * width;
      const p = centre.clone().addScaledVector(across, s).addScaledVector(lee, b);
      pos.push(p.x, p.y, p.z);
      uvs.push(u, 1 - v);
    }
  }
  for (let j = 0; j < nv; j++) {
    for (let i = 0; i < nu; i++) {
      const a = j * (nu + 1) + i, b = a + 1, c = a + nu + 1, d = c + 1;
      idx.push(a, c, b, b, c, d);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

/**
 * A fore-and-aft sail: a triangle for a staysail or a headsail, a quadrilateral for the
 * spanker. Given its corners in order, it bellies the same way a square sail does.
 */
function foreAndAftSail(corners, cfg, { belly = S('sail_belly'), side = 1 } = {}) {
  const [nu, nv] = cfg.sailSegments;
  const [head, tack, clew, throat] = corners.length === 4 ? corners : [corners[0], corners[1], corners[2], corners[0]];
  const pos = [], uvs = [], idx = [];
  // Bilinear across the quadrilateral head-throat / tack-clew.
  const span = Math.max(head.distanceTo(tack), throat.distanceTo(clew));
  for (let j = 0; j <= nv; j++) {
    const v = j / nv;
    const luff = new THREE.Vector3().lerpVectors(head, tack, v);
    const leech = new THREE.Vector3().lerpVectors(throat, clew, v);
    for (let i = 0; i <= nu; i++) {
      const u = i / nu;
      const p = new THREE.Vector3().lerpVectors(luff, leech, u);
      p.x += side * Math.sin(Math.PI * u) * Math.sin(Math.PI * v) * belly * span * 0.8;
      pos.push(p.x, p.y, p.z);
      uvs.push(u, 1 - v);
    }
  }
  for (let j = 0; j < nv; j++) {
    for (let i = 0; i < nu; i++) {
      const a = j * (nu + 1) + i, b = a + 1, c = a + nu + 1, d = c + 1;
      idx.push(a, c, b, b, c, d);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

/** A sail handed and stowed along its yard: a long tapered bundle. */
function furledBundle(yard, cfg) {
  const len = yard.length * 0.82;
  const d = S('furled_bundle_diameter');
  const g = spar({
    length: len,
    // Fat in the middle where the bulk of the canvas gathers, tapering to the arms.
    radiusAt: (t) => (d / 2) * (0.35 + 0.65 * Math.sin(Math.PI * clamp(t, 0, 1)) ** 0.6),
    segments: Math.max(5, cfg.sparSegments), radial: Math.max(5, cfg.sparRadial - 2),
  });
  g.translate(0, -len / 2, 0);
  g.rotateZ(Math.PI / 2);
  return g;
}

export function buildSails(cfg, mats, model, ctx, geo, yards) {
  const group = new THREE.Group();
  group.name = 'sails';
  const suit = SUIT[ctx.sails] ?? SUIT.full;
  const setNames = new Set(suit.set);
  const braceRad = deg(ctx.sails === 'storm' ? 22 : 12);

  const squares = [];
  const furled = [];

  // The square sails, each between its own yard and the one below it. The lowest sail
  // on each mast — the course — has no yard below, so its clews come down toward the
  // rail instead.
  const SQUARES = [
    ['fore_course', 'fore_yard', null],
    ['main_course', 'main_yard', null],
    ['fore_topsail', 'fore_topsail_yard', 'fore_yard'],
    ['main_topsail', 'main_topsail_yard', 'main_yard'],
    ['mizzen_topsail', 'mizzen_topsail_yard', 'crossjack_yard'],
    ['fore_topgallant', 'fore_topgallant_yard', 'fore_topsail_yard'],
    ['main_topgallant', 'main_topgallant_yard', 'main_topsail_yard'],
    ['mizzen_topgallant', 'mizzen_topgallant_yard', 'mizzen_topsail_yard'],
  ];

  for (const [sailName, headYardName, footYardName] of SQUARES) {
    const head = yards[headYardName];
    if (!head) continue;
    const foot = footYardName ? yards[footYardName] : null;

    if (!setNames.has(sailName)) {
      // Not set: it is stowed on its own yard, unless the whole state is 'furled', in
      // which case every yard gets a bundle.
      if (ctx.sails === 'furled' || cfg.deckFurniture !== 'none') {
        const g = furledBundle(head, cfg);
        const mesh = new THREE.Mesh(g, mats.sail);
        mesh.position.copy(head.centre);
        mesh.position.y -= S('furled_bundle_diameter') * 0.45;
        mesh.rotation.y = braceRad;
        furled.push(mesh);
      }
      continue;
    }

    // The head of the sail is bent to its yard, a little inside the arms.
    const headWidth = head.length * 0.94;
    const headCentre = head.centre.clone();
    headCentre.y -= 0.12;

    // The foot is spread to the yard below, or, for a course, hauled down toward the
    // rail. A course drops to about the height of the rail; that is what makes the
    // waist of the ship disappear behind canvas in the reference photograph.
    let footCentre, footWidth;
    if (foot) {
      footCentre = foot.centre.clone();
      footCentre.y += 0.15;
      footWidth = foot.length * 0.97;
    } else {
      const railY = model.featureYAt(head.mast.z0).rail;
      footCentre = head.mast.along(0).clone();
      footCentre.y = railY + 0.9;
      footCentre.z = head.mast.z0;
      footWidth = head.length * 1.0;
    }

    const reef = suit.reefs[sailName] ?? 1;
    squares.push(squareSail(headCentre, headWidth, footCentre, footWidth, cfg, { reef, braceRad }));
  }

  // ------------------------------------------------------------------- fore-and-aft
  const fa = [];
  const addTriangle = (head, tack, clew) => fa.push(foreAndAftSail([head, tack, clew], cfg, { side: -1 }));

  if (setNames.has('fore_topmast_staysail')) {
    addTriangle(
      geo.fore.along(geo.fore.topmastHoundsH),
      geo.bowsprit.at(geo.bowsprit.length * 0.92),
      geo.fore.along(geo.fore.above(0.18))
    );
  }
  if (setNames.has('jib')) {
    addTriangle(
      geo.fore.along(geo.fore.topmastHoundsH + 1.4),
      geo.bowsprit.end.clone().lerp(geo.bowsprit.cap, 0.30),
      geo.fore.along(geo.fore.above(0.52))
    );
  }
  if (setNames.has('flying_jib')) {
    addTriangle(
      geo.fore.along(geo.fore.tgHeel + geo.fore.tgLength * 0.62),
      geo.bowsprit.end,
      geo.fore.along(geo.fore.houndsH + 1.0)
    );
  }
  // Staysails between the masts, set on the stays that run forward from each masthead.
  if (setNames.has('main_staysail')) {
    addTriangle(
      geo.main.along(geo.main.houndsH - 0.5),
      new THREE.Vector3(0, model.featureYAt(geo.fore.z0 + 2).deck + 0.6, geo.fore.z0 + 2.2),
      geo.main.along(geo.main.above(0.10))
    );
  }
  if (setNames.has('main_topmast_staysail')) {
    addTriangle(
      geo.main.along(geo.main.topmastHoundsH),
      geo.fore.along(geo.fore.houndsH + 0.6),
      geo.main.along(geo.main.above(0.62))
    );
  }
  if (setNames.has('mizzen_staysail')) {
    addTriangle(
      geo.mizzen.along(geo.mizzen.houndsH - 0.4),
      geo.main.along(geo.main.above(0.14)),
      geo.mizzen.along(geo.mizzen.above(0.12))
    );
  }

  // The spanker: a four-cornered sail on the gaff and boom abaft the mizzen.
  if (setNames.has('spanker') && ctx.spanker) {
    const sp = ctx.spanker;
    fa.push(foreAndAftSail([sp.gaffRoot, sp.boomRoot, sp.boomEnd, sp.gaffEnd], cfg, { side: -1 }));
  }

  if (squares.length) {
    const mesh = new THREE.Mesh(mergeGeometries(squares), mats.sail);
    mesh.name = 'square_sails';
    mesh.userData.count = squares.length;
    audit(mesh, 'square_sails_set', 'count', { tolerance: 0.001 });
    group.add(mesh);
  }
  if (fa.length) {
    const mesh = new THREE.Mesh(mergeGeometries(fa), mats.sail);
    mesh.name = 'fore_and_aft_sails';
    group.add(mesh);
  }
  if (furled.length) {
    const geoms = furled.map((mm) => { mm.updateMatrix(); return mm.geometry.clone().applyMatrix4(mm.matrix); });
    const mesh = new THREE.Mesh(mergeGeometries(geoms), mats.sail);
    mesh.name = 'furled_sails';
    group.add(mesh);
  }

  return group;
}

/** How many square sails each state sets — the audit checks the built count matches. */
export const SQUARE_SAIL_COUNT = {
  full: 8, topsails: 3, storm: 2, furled: 0,
};
