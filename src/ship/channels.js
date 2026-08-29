// The channels, the deadeyes and the chainplates.
//
// A channel is the broad timber platform bolted to the ship's side abreast of a mast.
// Its whole purpose is leverage: it carries the foot of every lower shroud outboard of
// the rail so that the shrouds clear the topsides and stand at a wide enough angle to
// hold the mast up. The pull then goes down the chainplates into the wale, which is why
// the channel and the chains are the structural joint between the rig and the hull.
//
// The one thing that has to be right is the fan. Every chainplate lies in the plane of
// its own shroud, and a shroud is a straight line from the hounds down to its deadeye.
// So nothing here guesses an angle: each chain is laid on the line from the mast's
// hounds through its deadeye and carried on down to a bolt in the side, and the
// progressive lean falls out of the geometry. Set them all parallel and the eye knows.
//
// Everything is sited from the hull model — the platform follows the rail line and its
// inboard edge sits on the real planking at whatever half-breadth the station has — so
// the whole region moves with the hull rather than standing off it.
import * as THREE from 'three';
import { SPEC } from '../spec/spec.js';
import { mergeGeometries } from '../util/loft.js';
import { block } from '../util/solids.js';
import { lerp, clamp } from '../util/math.js';
import { audit } from '../audit/measure.js';

const S = (k) => SPEC[k].value;

// ------------------------------------------------------------------ small helpers

/**
 * Loft a closed cross-section along a run of stations. The channel is a solid bar of
 * timber whose width and thickness both change along its length, so it cannot be swept
 * with a constant profile; each station carries its own four corners.
 *
 * `sections` is an array of equal-length arrays of Vector3 forming a closed loop, wound
 * so that a starboard part faces outboard.
 */
function loftClosed(sections) {
  const np = sections[0].length;
  const ns = sections.length;
  const pos = [], uvs = [], idx = [];
  sections.forEach((sec, i) => sec.forEach((p, j) => {
    pos.push(p.x, p.y, p.z);
    uvs.push(i / (ns - 1), j / np);
  }));
  for (let i = 0; i < ns - 1; i++) {
    for (let j = 0; j < np; j++) {
      const jn = (j + 1) % np;
      const a = i * np + j, b = i * np + jn, c = (i + 1) * np + j, d = (i + 1) * np + jn;
      idx.push(a, c, b, b, c, d);
    }
  }
  // The two ends, as fans from the first corner. The forward cap keeps the profile's
  // own order and so faces forward; the after cap is reversed.
  const base = (ns - 1) * np;
  for (let j = 1; j < np - 1; j++) {
    idx.push(0, j, j + 1);
    idx.push(base, base + j + 1, base + j);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

/** The port copy of a starboard part: mirrored in X, with the winding put back. */
function mirrored(g) {
  const c = g.clone();
  c.applyMatrix4(new THREE.Matrix4().makeScale(-1, 1, 1));
  const idx = c.getIndex();
  if (idx) {
    const a = idx.array;
    for (let i = 0; i < a.length; i += 3) { const t = a[i]; a[i] = a[i + 2]; a[i + 2] = t; }
  } else {
    // An extruded shape comes back unindexed, so the winding has to be reversed by
    // swapping the first and last vertex of every triangle in every attribute.
    for (const name of Object.keys(c.attributes)) {
      const at = c.attributes[name], size = at.itemSize, arr = at.array;
      for (let i = 0; i < at.count; i += 3) {
        for (let k = 0; k < size; k++) {
          const p = i * size + k, q = (i + 2) * size + k;
          const t = arr[p]; arr[p] = arr[q]; arr[q] = t;
        }
      }
    }
  }
  c.computeVertexNormals();
  return c;
}

/**
 * A local frame whose +Y runs along `up` and whose +Z leans toward `out`. This is what
 * stands a deadeye or a chainplate in the plane of its own shroud: +Y is the shroud,
 * +Z is the outboard normal of the ship's side, and +X falls out fore-and-aft.
 */
function frameAt(origin, up, out) {
  const ey = up.clone().normalize();
  const ex = new THREE.Vector3().crossVectors(ey, out).normalize();
  const ez = new THREE.Vector3().crossVectors(ex, ey).normalize();
  return new THREE.Matrix4().makeBasis(ex, ey, ez).setPosition(origin);
}

/** Fit a straight line to a sampled series, least squares. */
function fitLine(ts, xs) {
  const n = ts.length;
  let st = 0, sx = 0, stt = 0, stx = 0;
  for (let i = 0; i < n; i++) { st += ts[i]; sx += xs[i]; stt += ts[i] * ts[i]; stx += ts[i] * xs[i]; }
  const den = n * stt - st * st;
  const slope = Math.abs(den) < 1e-9 ? 0 : (n * stx - st * sx) / den;
  const inter = (sx - slope * st) / n;
  return (t) => inter + slope * t;
}

/**
 * A deadeye: a flat disc of elm with three holes for the lanyard, bound in an iron
 * strop. The holes face outboard, which is why a channel seen from the water shows a
 * row of little three-eyed faces.
 */
function deadeyeGeometry(radius, thickness, cfg) {
  if (cfg.deadeyes !== true) {
    const g = new THREE.CylinderGeometry(radius, radius, thickness, cfg.latheSegments);
    g.rotateX(Math.PI / 2);
    return g;
  }
  const shape = new THREE.Shape();
  shape.absarc(0, 0, radius, 0, Math.PI * 2, false);
  const hr = S('deadeye_hole_diameter') / 2;
  const hc = radius * S('deadeye_hole_circle_fraction');
  // One hole up and two below, the way a deadeye is drilled so that the lanyard's ends
  // fall clear of the shroud.
  for (const a of [Math.PI / 2, Math.PI * 7 / 6, Math.PI * 11 / 6]) {
    const p = new THREE.Path();
    p.absarc(Math.cos(a) * hc, Math.sin(a) * hc, hr, 0, Math.PI * 2, true);
    shape.holes.push(p);
  }
  const g = new THREE.ExtrudeGeometry(shape, {
    depth: thickness, bevelEnabled: false, curveSegments: Math.max(6, Math.round(cfg.latheSegments / 2)),
  });
  g.translate(0, 0, -thickness / 2);
  return g;
}

// --------------------------------------------------------------- the channel plan

/**
 * Where each channel sits and what it carries. Worked out once, because the platform,
 * the rail, the deadeyes, the chains and the supporters all have to agree about it.
 */
function channelPlan(model) {
  const specs = [
    {
      name: 'fore',
      mastKey: 'fore_mast_from_stem', lengthKey: 'fore_channel_length',
      foreEndKey: 'channel_fore_end_before_mast', dropKey: 'channel_top_below_rail',
      tInKey: 'channel_thickness_inner', tOutKey: 'channel_thickness_outer',
      aimKey: 'fore_channel_shroud_aim_y',
      shroudsKey: 'fore_lower_shroud_pairs', backstayKey: 'fore_channel_backstay_deadeyes',
      totalKey: 'fore_channel_deadeyes_per_side',
      shroudDia: 'shroud_deadeye_diameter', thickKey: 'shroud_deadeye_thickness',
      tmDia: 'topmast_backstay_deadeye_diameter', tgDia: 'topgallant_backstay_deadeye_diameter',
      stropKey: 'deadeye_strop_iron', plateKey: 'chainplate_thickness',
      boltKey: 'chain_bolt_below_channel', supportersKey: 'fore_channel_supporters',
      taper: true,
    },
    {
      name: 'main',
      mastKey: 'main_mast_from_stem', lengthKey: 'main_channel_length',
      foreEndKey: 'channel_fore_end_before_mast', dropKey: 'channel_top_below_rail',
      tInKey: 'channel_thickness_inner', tOutKey: 'channel_thickness_outer',
      aimKey: 'main_channel_shroud_aim_y',
      shroudsKey: 'main_lower_shroud_pairs', backstayKey: 'main_channel_backstay_deadeyes',
      totalKey: 'main_channel_deadeyes_per_side',
      shroudDia: 'shroud_deadeye_diameter', thickKey: 'shroud_deadeye_thickness',
      tmDia: 'topmast_backstay_deadeye_diameter', tgDia: 'topgallant_backstay_deadeye_diameter',
      stropKey: 'deadeye_strop_iron', plateKey: 'chainplate_thickness',
      boltKey: 'chain_bolt_below_channel', supportersKey: 'main_channel_supporters',
      taper: false,
    },
    {
      name: 'mizzen',
      mastKey: 'mizzen_mast_from_stem', lengthKey: 'mizzen_channel_length',
      foreEndKey: 'mizzen_channel_fore_end_before_mast', dropKey: 'mizzen_channel_top_below_rail',
      tInKey: 'mizzen_channel_thickness_inner', tOutKey: 'mizzen_channel_thickness_outer',
      aimKey: 'mizzen_channel_shroud_aim_y',
      shroudsKey: 'mizzen_lower_shroud_pairs', backstayKey: 'mizzen_channel_backstay_deadeyes',
      totalKey: 'mizzen_channel_deadeyes_per_side',
      shroudDia: 'mizzen_shroud_deadeye_diameter', thickKey: 'mizzen_deadeye_thickness',
      tmDia: 'mizzen_topmast_backstay_deadeye_diameter', tgDia: 'mizzen_topgallant_backstay_deadeye_diameter',
      stropKey: 'mizzen_deadeye_strop_iron', plateKey: 'mizzen_chainplate_thickness',
      boltKey: 'mizzen_chain_bolt_below_channel', supportersKey: 'mizzen_channel_supporters',
      taper: false,
    },
  ];

  const zLimit = model.zAft - S('channel_aft_clearance');

  return specs.map((c) => {
    const zMast = model.fromStem(S(c.mastKey));
    const length = S(c.lengthKey);
    let z0 = zMast - S(c.foreEndKey);
    // Steel puts the mizzen mast far enough aft that its channel would run onto the
    // counter. It is shifted forward bodily rather than shortened, so that the channel
    // keeps the length the source gives it.
    if (z0 + length > zLimit) z0 = zLimit - length;

    return {
      ...c, zMast, length, z0, z1: z0 + length,
      nShroud: S(c.shroudsKey), nBackstay: S(c.backstayKey),
      aimY: S(c.aimKey), drop: S(c.dropKey),
      thickIn: S(c.tInKey), thickOut: S(c.tOutKey),
    };
  });
}

/** The top face and the two edge half-breadths of a channel, sampled along its length. */
function channelEdges(model, c, cfg) {
  const n = Math.max(5, Math.round(cfg.mouldingSweeps / 6));
  const ts = [], zs = [], yTop = [], xIn = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const z = lerp(c.z0, c.z1, t);
    const y = model.featureYAt(z).rail - c.drop;
    ts.push(t); zs.push(z); yTop.push(y);
    xIn.push(model.halfBreadthAt(z, y) - S('channel_inboard_inset'));
  }
  // The outboard edge is a fair line, not a copy of the hull's curve: a shipwright cuts
  // the channel to a fair outer edge and lets the projection vary along it, rather than
  // following every bend of the side.
  const fair = fitLine(ts, xIn);
  const proj = S('channel_projection');
  const taperFrom = 1 - S('fore_channel_taper_fraction');
  const taperTo = S('fore_channel_taper_projection');
  const xOut = ts.map((t, i) => {
    let p = proj;
    // Steel: the fore channel tapers at its after end, so that the fluke of the bower
    // beds against it when the anchor is stowed along the ship's side.
    if (c.taper && t > taperFrom) p = lerp(proj, taperTo, (t - taperFrom) / (1 - taperFrom));
    return Math.max(xIn[i] + S('channel_rail_width') * 1.2, fair(t) + p);
  });
  return { n, ts, zs, yTop, xIn, xOut, thickIn: c.thickIn, thickOut: c.thickOut };
}

/** Interpolate the edge tables at any fraction along the channel. */
function edgeAt(e, t) {
  const x = clamp(t, 0, 1) * (e.n - 1);
  const i = Math.min(e.n - 2, Math.floor(x));
  const f = x - i;
  return {
    z: lerp(e.zs[i], e.zs[i + 1], f),
    yTop: lerp(e.yTop[i], e.yTop[i + 1], f),
    xIn: lerp(e.xIn[i], e.xIn[i + 1], f),
    xOut: lerp(e.xOut[i], e.xOut[i + 1], f),
  };
}

// ------------------------------------------------------------------- the platform

function channelSlab(e) {
  const sections = [];
  for (let i = 0; i < e.n; i++) {
    const yT = e.yTop[i];
    sections.push([
      new THREE.Vector3(e.xIn[i], yT, e.zs[i]),
      new THREE.Vector3(e.xOut[i], yT, e.zs[i]),
      new THREE.Vector3(e.xOut[i], yT - e.thickOut, e.zs[i]),
      new THREE.Vector3(e.xIn[i], yT - e.thickIn, e.zs[i]),
    ]);
  }
  return loftClosed(sections);
}

/**
 * A length of the low rail along the outboard edge. The rail is built as the pieces
 * between the scores rather than as one bar with the notches cut out of it, which reads
 * the same for a fraction of the triangles.
 */
function railSegment(e, tA, tB, steps) {
  const sections = [];
  const w = S('channel_rail_width');
  const h = S('channel_rail_height');
  for (let i = 0; i <= steps; i++) {
    const p = edgeAt(e, lerp(tA, tB, i / steps));
    const xo = p.xOut, xi = p.xOut - w;
    sections.push([
      new THREE.Vector3(xi, p.yTop + h, p.z),
      new THREE.Vector3(xo, p.yTop + h, p.z),
      new THREE.Vector3(xo, p.yTop, p.z),
      new THREE.Vector3(xi, p.yTop, p.z),
    ]);
  }
  return loftClosed(sections);
}

/**
 * An iron T-plate supporter under the channel. By 1798 these had replaced the wooden
 * knee: a flat bracket bolted under the outer part of the channel and down to the ship's
 * side three and a half feet below it.
 */
function supporterGeometry(model, e, t) {
  const p = edgeAt(e, t);
  const yToe = p.yTop - S('supporter_drop');
  const shape = new THREE.Shape();
  shape.moveTo(p.xOut - S('channel_rail_width') * 0.5, p.yTop - e.thickOut);
  shape.lineTo(p.xIn, p.yTop - e.thickIn);
  shape.lineTo(model.halfBreadthAt(p.z, yToe) + S('chainplate_standoff'), yToe);
  shape.closePath();
  const th = S('supporter_width');
  const g = new THREE.ExtrudeGeometry(shape, { depth: th, bevelEnabled: false });
  g.translate(0, 0, p.z - th / 2);
  return g;
}

// ---------------------------------------------------------------------- assembly

export function buildChannels(cfg, mats, model, ctx) {
  const group = new THREE.Group();
  group.name = 'channels';

  for (const c of channelPlan(model)) {
    const e = channelEdges(model, c, cfg);
    const timber = [channelSlab(e)];
    const iron = [];

    // ---------------------------------------------------------- the deadeye row
    // The lower shrouds take the forward part of the channel and the standing backstays
    // the after end, each with its own size of deadeye. They are spread evenly between
    // the ends, set in from the butts so that the timber is not split.
    const total = c.nShroud + c.nBackstay;
    const margin = S('channel_deadeye_end_margin') / c.length;
    const eyes = [];
    for (let i = 0; i < total; i++) {
      const t = lerp(margin, 1 - margin, total === 1 ? 0.5 : i / (total - 1));
      const p = edgeAt(e, t);
      // The backstay deadeyes at the after end are smaller than the shrouds', and the
      // topgallant's smaller again.
      let dia = S(c.shroudDia);
      if (i >= c.nShroud) dia = (i - c.nShroud) < c.nBackstay / 2 ? S(c.tmDia) : S(c.tgDia);
      const r = dia / 2;
      eyes.push({
        t, r, p,
        centre: new THREE.Vector3(
          p.xOut - S('channel_rail_width') * 0.5,
          p.yTop + S('deadeye_bottom_above_channel') + r,
          p.z
        ),
      });
    }

    // The rail, in the pieces between the scores.
    if (cfg.channelRails) {
      const steps = Math.max(2, Math.round(cfg.mouldingSweeps / 24));
      const pieces = [];
      let last = 0;
      for (const eye of eyes) {
        const half = (eye.r + S('channel_rail_notch_clearance')) / c.length;
        pieces.push([last, Math.max(last, eye.t - half)]);
        last = Math.min(1, eye.t + half);
      }
      pieces.push([last, 1]);
      for (const [a, b] of pieces) {
        if (b - a < 2e-3) continue;
        timber.push(railSegment(e, a, b, steps));
      }
    }

    // ---------------------------------------- the deadeyes and their chainplates
    // The aim point is the hounds, where every lower shroud of this mast is gathered.
    // The line from there through a deadeye is the shroud; the chain below the deadeye
    // is that same line carried on down to its bolt in the ship's side.
    const aim = new THREE.Vector3(0, c.aimY, c.zMast);

    for (const eye of eyes) {
      const dir = new THREE.Vector3().subVectors(eye.centre, aim).normalize();  // down and aft
      const up = dir.clone().negate();                                          // toward the hounds
      // The outboard normal of the ship's side here, so that the ironwork lies on the
      // planking instead of standing square to the centreline.
      const yA = eye.p.yTop, yB = yA - S(c.boltKey);
      const out = new THREE.Vector3(
        yA - yB,
        model.halfBreadthAt(eye.p.z, yA) - model.halfBreadthAt(eye.p.z, yB),
        0
      ).normalize();

      if (cfg.deadeyes) {
        const g = deadeyeGeometry(eye.r, S(c.thickKey), cfg);
        g.applyMatrix4(frameAt(eye.centre, up, out));
        timber.push(g);
      }

      if (cfg.deadeyes === true) {
        // The iron strop round the deadeye, which is what the chain hooks to.
        const ir = S(c.stropKey) / 2;
        const g = new THREE.TorusGeometry(eye.r + ir, ir, 4, Math.max(8, cfg.latheSegments));
        g.applyMatrix4(frameAt(eye.centre, up, out));
        iron.push(g);
      }

      if (!cfg.chainplates) continue;

      // The chain bolt, driven into the side below the channel and on the shroud's own
      // line, which throws it aft of the deadeye by however much that shroud rakes.
      const yBolt = eye.p.yTop - c.thickIn - S(c.boltKey);
      const zBolt = eye.centre.z + (yBolt - eye.centre.y) * (dir.z / dir.y);
      const xBolt = model.halfBreadthAt(zBolt, yBolt) + S('chainplate_standoff');
      const bolt = new THREE.Vector3(xBolt, yBolt, zBolt);
      const foot = new THREE.Vector3(eye.centre.x, eye.centre.y - eye.r, eye.centre.z);

      const plate = block(S('chainplate_width'), bolt.distanceTo(foot), S(c.plateKey));
      plate.applyMatrix4(frameAt(bolt, new THREE.Vector3().subVectors(foot, bolt), out));
      iron.push(plate);

      if (cfg.deadeyes === true) {
        // The head of the bolt through the ship's side.
        const br = S('chain_bolt_diameter') / 2;
        const head = new THREE.CylinderGeometry(br, br, br, Math.max(6, Math.round(cfg.latheSegments / 2)));
        head.rotateZ(Math.PI / 2);
        head.translate(xBolt, yBolt, zBolt);
        iron.push(head);
      }
    }

    // -------------------------------------------------- the supporters under it
    if (cfg.channelKnees) {
      const nk = S(c.supportersKey);
      for (let i = 0; i < nk; i++) {
        iron.push(supporterGeometry(model, e, lerp(0.10, 0.90, nk === 1 ? 0.5 : i / (nk - 1))));
      }
    }

    // Both sides come off one build, so the two can never disagree.
    const platform = new THREE.Mesh(mergeGeometries([...timber, ...timber.map(mirrored)]), mats.timber);
    platform.name = `${c.name}_channel`;
    audit(platform, c.lengthKey, 'extent_z', { tolerance: 0.06 });
    if (cfg.deadeyes) {
      platform.userData.count = total;
      audit(platform, c.totalKey, 'count', { tolerance: 0.001 });
    }
    group.add(platform);

    if (iron.length) {
      const chains = new THREE.Mesh(mergeGeometries([...iron, ...iron.map(mirrored)]), mats.iron);
      chains.name = `${c.name}_chains`;
      group.add(chains);
    }
  }

  return group;
}
