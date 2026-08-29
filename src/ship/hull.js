// The hull. Built the way a shipwright defines one: an offset table of half-breadths
// at a grid of stations and waterlines, lofted into a surface.
//
// The one idea that makes the rest of the ship easy is the *paint coordinate*. Rather
// than mapping V up each section by arc length, every section is built through the
// same ordered list of named features — rabbet, waterline, wale, deck at side, gunport
// sill, gunport head, rail — each pinned to a fixed V. Those features are real lines on
// a real ship and they follow the sheer, not the horizon. Pinning them to fixed V means
// a single one-dimensional paint texture puts the copper, the black and the ochre
// strake exactly where they belong at every station, and it means any other part of the
// generator can ask "where is the wale at this station" and get an answer.
import * as THREE from 'three';
import { SPEC, OFFSETS } from '../spec/spec.js';
import { monotoneCubic, naturalCubic } from '../util/interp.js';
import { loftSections, mergeGeometries } from '../util/loft.js';
import { lerp, clamp, deg } from '../util/math.js';
import { audit, audits } from '../audit/measure.js';

// The feature stops, bottom to top. The V values are arbitrary but fixed: they are the
// contract between the hull surface and the paint.
export const FEATURES = [
  // The section starts on the centreline at the underside of the keel, not at the
  // rabbet, so that the two mirrored halves close the bottom of the ship between them.
  // Without this the hull is an open trough and you can see straight through the
  // garboard from any low angle.
  ['keel_bottom', 0.00],
  ['keel_top', 0.030],
  ['rabbet', 0.055],
  ['floor', 0.16],
  ['bilge', 0.32],
  ['waterline', 0.50],
  ['wale_bottom', 0.62],
  ['wale_top', 0.70],
  ['sheer_strake', 0.78],
  ['deck', 0.84],
  ['port_sill', 0.885],
  ['port_head', 0.965],
  ['rail', 1.00],
];
export const V = Object.fromEntries(FEATURES);

/**
 * The hull's geometry as a set of queryable curves. Every other module — the channels,
 * the gunports, the head, the stern, the chainplates — asks this object where things
 * are, so nothing else has to know how the offset table works.
 */
export function hullModel() {
  const stationZ = OFFSETS.stationZ;
  const wlY = OFFSETS.waterlineY;

  // Half-breadth as a function of height, one interpolant per station. Monotone,
  // because a section widens steadily from the keel to the maximum breadth and must
  // not bulge past its neighbours just to be smooth.
  const sectionX = stationZ.map((_, i) => {
    const yBottom = OFFSETS.rabbetY[i];
    // The section is carried right up to the rail, not stopped at the deck. The two
    // highest waterlines on the draught are above the gun deck at side and describe the
    // tumblehome of the topside, so truncating at the deck would throw away the only
    // measured evidence there is for the shape of the bulwark.
    const yTop = OFFSETS.railY[i];
    const ys = [yBottom], xs = [OFFSETS.rabbetX[i]];
    for (let j = 0; j < wlY.length; j++) {
      const x = OFFSETS.halfBreadth[i][j];
      if (x === null || x === undefined) continue;
      // Toward the ends the rabbet rises above the lower waterlines, so those entries
      // do not describe this station at all. Including them makes the height sequence
      // non-monotonic and the interpolant folds back on itself, which shows up as
      // spikes at the stem and the tuck.
      if (wlY[j] <= yBottom + 1e-4 || wlY[j] >= yTop - 1e-4) continue;
      ys.push(wlY[j]); xs.push(x);
    }
    ys.push(yTop); xs.push(OFFSETS.railX[i]);
    const f = monotoneCubic(ys, xs);
    // Outside its own range a station's interpolant means nothing, so clamp rather than
    // extrapolate. Without this, evaluating a forward station down at a waterline that
    // only exists amidships sends the curve folding back on itself.
    f.yMin = yBottom; f.yMax = yTop;
    return f;
  });

  // Longitudinal curves, fair through the stations. These are the lines a draughtsman
  // would draw on the sheer plan.
  const sheerY = naturalCubic(stationZ, OFFSETS.deckAtSideY);
  const sheerX = naturalCubic(stationZ, OFFSETS.deckAtSideX);
  const rabbetY = naturalCubic(stationZ, OFFSETS.rabbetY);
  const rabbetX = naturalCubic(stationZ, OFFSETS.rabbetX);

  const zFwd = stationZ[0];
  const zAft = stationZ[stationZ.length - 1];

  /** Interpolate a half-breadth at any station and height, not only at a table entry. */
  function halfBreadthAt(z, y) {
    const zc = clamp(z, zFwd, zAft);
    // Find the bracketing stations and blend their section interpolants, which keeps
    // the surface fair between table entries.
    let i = 0;
    while (i < stationZ.length - 2 && zc > stationZ[i + 1]) i++;
    const t = (zc - stationZ[i]) / (stationZ[i + 1] - stationZ[i]);
    const a = sectionX[i], b = sectionX[i + 1];
    return Math.max(0, lerp(
      a(clamp(y, a.yMin, a.yMax)),
      b(clamp(y, b.yMin, b.yMax)),
      clamp(t, 0, 1)
    ));
  }

  // The rail and the tumblehome both come off the draught now, one value per station,
  // so they are interpolated the same way every other line of the ship is.
  const railYAt = naturalCubic(stationZ, OFFSETS.railY);
  const tumblehomeAt = naturalCubic(stationZ, OFFSETS.tumblehome);

  /** Height of the bulwark above the deck at side, which changes along the ship. */
  function bulwarkHeightAt(z) {
    return railYAt(z) - sheerY(z);
  }

  /** The named feature heights at a station. The paint and the fittings both use these. */
  function featureYAt(z) {
    const deck = sheerY(z);
    const rab = rabbetY(z);
    const out = {
      keel_bottom: rab - SPEC.keel_moulding.value,
      keel_top: rab - SPEC.keel_moulding.value * 0.35,
      rabbet: rab,
      waterline: 0,
      wale_top: deck - SPEC.wale_top_below_deck.value,
      wale_bottom: deck - SPEC.wale_top_below_deck.value - SPEC.wale_depth.value,
      deck,
      port_sill: deck + SPEC.gunport_sill_above_deck.value,
      port_head: deck + SPEC.gunport_sill_above_deck.value + SPEC.gunport_height.value,
      rail: railYAt(z),
    };
    // The three shape-only stops sit proportionally between the rabbet and the wale.
    out.floor = lerp(rab, 0, 0.30);
    out.bilge = lerp(rab, 0, 0.66);
    if (out.floor <= rab) out.floor = rab + 0.01;
    if (out.bilge <= out.floor) out.bilge = out.floor + 0.01;
    out.sheer_strake = lerp(out.wale_top, deck, 0.55);
    return out;
  }

  /**
   * A complete station section as `[x, y]` points, one per V stop, resampled to the
   * LOD's point count while keeping every feature stop exactly on its V.
   */
  function sectionAt(z, points) {
    const f = featureYAt(z);
    const xAtDeck = halfBreadthAt(z, f.deck);

    // Build the control points: the hull proper from the offset table, then the
    // bulwark above the deck, which tumbles home faster than the topsides do.
    const halfSiding = SPEC.keel_siding.value / 2;
    const control = FEATURES.map(([name, v]) => {
      const y = f[name];
      let x;
      // The keel: the section runs from the centreline out to the keel's side, then up
      // to the rabbet where the garboard strake lands on it.
      if (name === 'keel_bottom') x = 0;
      else if (name === 'keel_top') x = halfSiding;
      else if (name === 'rabbet') x = Math.max(halfSiding * 0.92, halfBreadthAt(z, y));
      // Above the deck the draught still has two waterlines, so the bulwark comes off
      // the measured table like everything else rather than off a made-up rule.
      else x = Math.max(halfSiding * 0.9, halfBreadthAt(z, y));
      return { v, x, y };
    });

    // Resample to `points` samples, evenly in V, interpolating the control polygon.
    const vs = control.map((c) => c.v);
    const fx = monotoneCubic(vs, control.map((c) => c.x));
    const fy = monotoneCubic(vs, control.map((c) => c.y));
    const out = [];
    for (let k = 0; k < points; k++) {
      const v = k / (points - 1);
      out.push([fx(v), fy(v)]);
    }
    // Force the feature stops to land exactly, so the paint bands are not a sample
    // width out of place.
    for (const c of control) {
      const k = Math.round(c.v * (points - 1));
      out[k] = [c.x, c.y];
    }
    return out;
  }

  return {
    stationZ, zFwd, zAft,
    halfBreadthAt, featureYAt, sectionAt, bulwarkHeightAt,
    /**
     * Convert the period way of locating things — so many feet abaft the stem, measured
     * along the gundeck — into the model's `z`. Every dimension taken off a deck plan
     * arrives in that form, and doing the conversion here means no other module has to
     * know where the midship station happens to fall.
     */
    /** Tangent of the tumblehome angle at a station, from the draught. */
    tumblehomeAt,
    railYAt,
    fromStem: (metresAftOfStem) => zFwd + metresAftOfStem,
    toStem: (z) => z - zFwd,
    lengthOnDeck: zAft - zFwd,
    sheerY, sheerX, rabbetY, rabbetX,
    /** A world-space point on the hull surface at a station and a named feature. */
    pointAt(z, feature, side = 1) {
      const f = featureYAt(z);
      const y = f[feature];
      return new THREE.Vector3(halfBreadthAt(z, y) * side, y, z);
    },
    /** A curve following a named feature the length of the ship — a wale, the sheer. */
    featureCurve(feature, side = 1, samples = 80, from = null, to = null) {
      const a = from ?? zFwd, b = to ?? zAft;
      const pts = [];
      for (let i = 0; i <= samples; i++) pts.push(this.pointAt(lerp(a, b, i / samples), feature, side));
      return new THREE.CatmullRomCurve3(pts);
    },
  };
}

/**
 * Build the hull mesh group.
 * @param {object} [opts.skipQuad] the port cutter, which drops the faces inside each
 *   gunport so the openings are real holes through the ship's side.
 */
export function buildHull(cfg, mats, model = hullModel(), { skipQuad = null } = {}) {
  const group = new THREE.Group();
  group.name = 'hull';

  const n = cfg.hullStations;
  const sections = [];
  for (let i = 0; i < n; i++) {
    // Cosine spacing, so stations bunch where the shape changes fastest — at the bow
    // and the stern — instead of being wasted amidships where the hull barely alters.
    const t = i / (n - 1);
    const eased = 0.5 - 0.5 * Math.cos(t * Math.PI);
    const z = lerp(model.zFwd, model.zAft, lerp(t, eased, 0.55));
    sections.push({ z, points: model.sectionAt(z, cfg.hullPoints) });
  }

  // U runs the length of the ship so the planking texture runs fore and aft as real
  // planking does; V is the paint coordinate.
  const geom = loftSections(sections, {
    mirror: true,
    skipQuad,
    uv: (u, v) => [u * SPEC.hull_length_gundeck.value / 3.0, v],
  });
  const hull = new THREE.Mesh(geom, mats.hull);
  hull.name = 'hull_shell';
  // What the shell itself can honestly be measured for.
  //
  // Not the length on the gundeck: the offset table runs between the perpendiculars, and
  // the gundeck is longer than that because both the stem and the sternpost rake, so the
  // deck line runs on past the shell at each end. The head and stern modules build those
  // overhangs, and the gundeck length is checked against the finished ship, not here.
  //
  // Not the extreme breadth either: these are the *moulded* offsets, the inside of the
  // planking. Extreme breadth is measured over the wales, which stand outside it.
  audits(hull,
    ['hull_length_bp', 'extent_z'],
    ['hull_beam_moulded', 'extent_x'],
  );
  group.add(hull);

  // A marker at the midship station on the centreline, so that the height of the gun
  // deck can be measured where it is specified — amidships — rather than averaged over
  // a deck that sweeps up at both ends.
  const midDeck = new THREE.Object3D();
  const f = model.featureYAt(0);
  midDeck.position.set(0, f.deck + SPEC.deck_camber.value, 0);
  midDeck.name = 'midship_deck_marker';
  audit(midDeck, 'gundeck_above_wl_at_midships', 'origin_y');
  group.add(midDeck);

  return { group, model, sections, hull };
}
