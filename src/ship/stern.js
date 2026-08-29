// The stern: the counter, the transom, the lights, the quarter galleries, the taffrail
// and the rudder.
//
// The hull loft stops at the aftmost station, which is the sternpost, so the ship
// arrives here open at the back. Closing her is the first job and it decides the shape
// of everything else, so it is worth saying how it is done.
//
// The closure is one grid. Every row of the grid is a horizontal cut through the stern
// at some height. A row starts on the centreline, runs outboard across the transom to
// the corner where the quarter piece stands, then turns forward and runs round the
// quarter until it lands exactly on a point of the hull's own aftmost section. Because
// the landing points ARE the hull's section — `model.sectionAt(model.zAft, …)`, the same
// call the hull loft makes — the seam cannot open, whatever the offsets are changed to.
//
// The rows below the tuck close flat at the last station: down there the ship is already
// down to the siding of the sternpost and there is nothing to overhang with. Above the
// tuck the rows step aft and outboard onto the counter, and above the ship's rail they
// carry on up to the taffrail, landing on the rail line further and further forward.
// That last part is the sweep of the quarter pieces, and it is what gives the stern its
// rise aft.
//
// The grid's V coordinate is the hull's own paint coordinate, so the copper line, the
// boot top and the wale carry round the counter without anything here having to be told
// where they are. Above the wing transom the V is overridden to black, because English
// practice painted the whole stern black and kept the ochre for the carving; the gunport
// strake therefore runs aft along the topside and stops at the quarter piece.
import * as THREE from 'three';
import { SPEC } from '../spec/spec.js';
import { monotoneCubic } from '../util/interp.js';
import { mergeGeometries, weldByPosition } from '../util/loft.js';
import { sweep, block, spar } from '../util/solids.js';
import { lerp, clamp, deg, smoothstep } from '../util/math.js';
import { audit } from '../audit/measure.js';

// ---------------------------------------------------------------------------
// The stern profile: everything the closure and the ornament need to know about
// where the back of the ship is, as functions of height above the waterline.
// ---------------------------------------------------------------------------
function sternProfile(model) {
  const zTuck = model.zAft;
  const f = model.featureYAt(zTuck);

  const yTuck = SPEC.stern_tuck_above_wl.value;
  const yWing = SPEC.stern_wing_transom_above_wl.value;
  const yUpper = SPEC.stern_upper_counter_above_wl.value;
  // The taffrail's height is one of the few things on the stern that was measured
  // directly off the draught — 29.5 ft above the moulded base line, which is 16 ft 8 in
  // above the load waterline — so that figure leads, and the relationship to the
  // quarterdeck follows from it rather than the other way round. The floor below it is
  // only a guard: the taffrail must still top the quarterdeck's own bulwark, or the
  // wheel and the after fittings would stand over the stern in plain view.
  const yTaff = Math.max(
    SPEC.stern_taffrail_above_wl.value,
    f.deck + SPEC.quarterdeck_above_gundeck.value + SPEC.stern_taffrail_above_quarterdeck.value,
  );

  // How far abaft the tuck the centreline of the stern stands, by height. This is the
  // rake of the counter and of the transom over it.
  const zAbaft = monotoneCubic(
    [yTuck, yWing, yUpper, yTaff],
    [0, SPEC.stern_wing_transom_abaft_tuck.value,
      SPEC.stern_upper_counter_abaft_tuck.value,
      SPEC.stern_taffrail_abaft_tuck.value],
  );

  // Half-breadth of the transom, by height, from the stern elevation — but never wider
  // than the hull's own half-breadth at the last station. The elevation was measured off
  // a 1280-pixel scan and reads about 0.4 m broader at the window band than the traced
  // offsets do; taken literally it makes the quarter flare outboard over the last metre
  // and a half into a swollen blister. Where the two disagree the hull wins, which is the
  // whole point of siting off the model. Above the rail there is no hull left to compare
  // with, so the elevation stands on its own.
  const yLights = f.deck + SPEC.stern_light_sill_above_deck.value + SPEC.stern_light_height.value / 2;
  const drawn = monotoneCubic(
    [yTuck, yWing, yLights, yTaff],
    [SPEC.stern_half_breadth_at_tuck.value,
      SPEC.stern_half_breadth_wing_transom.value,
      SPEC.stern_half_breadth_at_lights.value,
      SPEC.stern_half_breadth_at_taffrail.value],
  );
  const halfBreadth = (y) => Math.min(drawn(y), model.halfBreadthAt(zTuck, Math.min(y, f.rail)));

  // Steel: every stern rail carries "a handsome round-up and round-aft … each rail
  // continuing to have more round-up in proceeding upwards".
  const roundAft = (y) => lerp(
    SPEC.stern_round_aft_lower.value, SPEC.stern_round_aft_upper.value,
    clamp((y - yTuck) / (yTaff - yTuck), 0, 1),
  );
  // Round-up is measured down from the centreline: the height a stern rail is quoted at
  // is the height in the middle of the ship, and it is the ends of the rail that drop
  // away below it.
  const roundUp = (y) => SPEC.stern_round_up_taffrail.value
    * clamp((y - yWing) / (yTaff - yWing), 0, 1) ** 2;

  /** A point on the transom surface. `s` is 0 on the centreline and 1 at the corner. */
  function surface(y, s, out = 0) {
    const p = new THREE.Vector3(
      halfBreadth(y) * s,
      y - roundUp(y) * s * s,
      zTuck + zAbaft(y) - roundAft(y) * s * s,
    );
    return out === 0 ? p : p.addScaledVector(surfaceNormal(y, s), out);
  }

  /** The outward normal of the transom surface, found by differencing. */
  function surfaceNormal(y, s) {
    const h = 0.02;
    const a = surface(y, clamp(s + h, 0, 1)).sub(surface(y, clamp(s - h, 0, 1)));
    const b = surface(y + h, s).sub(surface(y - h, s));
    const n = new THREE.Vector3().crossVectors(a, b);
    return n.lengthSq() < 1e-12 ? new THREE.Vector3(0, 0, 1) : n.normalize();
  }

  /** The same point, given an x rather than a fraction of the half-breadth. */
  function surfaceAtX(y, x, out = 0) {
    const s = clamp(Math.abs(x) / Math.max(halfBreadth(y), 1e-4), 0, 1);
    const p = surface(y, s, out);
    if (x < 0) p.x = -p.x;
    return p;
  }

  return {
    zTuck, f, yTuck, yWing, yUpper, yLights, yTaff,
    zAbaft, halfBreadth, roundAft, roundUp, surface, surfaceNormal, surfaceAtX,
  };
}

// ---------------------------------------------------------------------------
// Grid helpers
// ---------------------------------------------------------------------------

/**
 * Turn a rectangular grid of points into geometry. Rows run up the ship, columns run
 * from the centreline outboard and then forward round the quarter. Each row carries its
 * own `v`, which is the hull's paint coordinate, so the bands land where they belong.
 */
function gridGeometry(rows, { mirror = true, inward = false } = {}) {
  const nR = rows.length, nC = rows[0].length;
  const half = (sign) => {
    const pos = [], uvs = [], idx = [];
    for (let i = 0; i < nR; i++) {
      let run = 0;
      for (let k = 0; k < nC; k++) {
        const p = rows[i][k].p;
        if (k > 0) run += p.distanceTo(rows[i][k - 1].p);
        pos.push(p.x * sign, p.y, p.z);
        uvs.push(run / 2.4, rows[i][k].v ?? rows[i].v);
      }
    }
    const front = (sign > 0) !== inward;
    for (let i = 0; i < nR - 1; i++) {
      for (let k = 0; k < nC - 1; k++) {
        const a = i * nC + k, b = a + 1, c = a + nC, d = c + 1;
        if (front) idx.push(a, b, c, b, d, c);
        else idx.push(a, c, b, b, c, d);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    g.setIndex(idx);
    return g;
  };
  const g = mirror ? mergeGeometries([half(1), half(-1)]) : half(1);
  if (mirror) weldByPosition(g, 1e-5);
  g.computeVertexNormals();
  return g;
}

/**
 * An oval patch lying on a parametric surface. Carved work is round: a row of gilt
 * rectangles on the transom reads as another tier of gunports, and a row of cartouches
 * and bosses reads as carving.
 */
function oval(pointAt, xc, halfW, yc, halfH, nu = 10, nv = 5) {
  const pos = [], uvs = [], idx = [];
  for (let i = 0; i <= nv; i++) {
    const t = (i / nv) * 2 - 1;
    const w = halfW * Math.sqrt(Math.max(0, 1 - t * t));
    for (let j = 0; j <= nu; j++) {
      const p = pointAt(xc + lerp(-w, w, j / nu), yc + t * halfH);
      pos.push(p.x, p.y, p.z);
      uvs.push(j / nu, i / nv);
    }
  }
  const w = nu + 1;
  for (let i = 0; i < nv; i++) {
    for (let j = 0; j < nu; j++) {
      const a = i * w + j, b = a + 1, c = a + w, d = c + 1;
      idx.push(a, b, c, b, d, c);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

/** A patch lying on a parametric surface — the glazing, its frames, the carved panels. */
function patch(pointAt, u0, u1, v0, v1, nu = 2, nv = 2) {
  const pos = [], uvs = [], idx = [];
  for (let i = 0; i <= nv; i++) {
    for (let j = 0; j <= nu; j++) {
      const p = pointAt(lerp(u0, u1, j / nu), lerp(v0, v1, i / nv));
      pos.push(p.x, p.y, p.z);
      uvs.push(j / nu, i / nv);
    }
  }
  const w = nu + 1;
  for (let i = 0; i < nv; i++) {
    for (let j = 0; j < nu; j++) {
      const a = i * w + j, b = a + 1, c = a + w, d = c + 1;
      idx.push(a, b, c, b, d, c);
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
 * Height to the hull's paint coordinate at the last station. Anything built here that
 * wears `mats.hull` — the counter, the badges, the rudder — asks this where it is in the
 * paint rather than guessing, so the copper line and the wale land on it correctly.
 */
function paintVAt(cfg, model) {
  const sec = model.sectionAt(model.zAft, cfg.hullPoints);
  const ys = [], vs = [];
  for (let j = 0; j < sec.length; j++) {
    ys.push(Math.max(sec[j][1], (ys[j - 1] ?? -Infinity) + 1e-4));
    vs.push(j / (sec.length - 1));
  }
  const f = monotoneCubic(ys, vs);
  return (y) => clamp(f(y), 0, 1);
}

// ---------------------------------------------------------------------------
// The closure: counter, transom and quarters
// ---------------------------------------------------------------------------
function closureRows(cfg, model, sp) {
  const zAft = model.zAft;
  const sec = model.sectionAt(zAft, cfg.hullPoints);
  const N = sec.length;
  const nT = Math.max(4, Math.round(cfg.sternStations * 0.6));      // across the transom
  const nQ = Math.max(3, Math.round(cfg.sternStations * 0.4));      // round the quarter
  const nRise = Math.max(2, Math.round(cfg.sternStations * 0.35));  // rail to taffrail

  // The section's heights are not quite monotonic at the stern — the traced gunport
  // heads there stand a little above the rail — so a working copy is forced to rise.
  // The landing points still use the section's own values, which is what shuts the seam.
  const yRow = [];
  for (let j = 0; j < N; j++) yRow[j] = Math.max(sec[j][1], (yRow[j - 1] ?? -Infinity) + 1e-4);
  const yTop = yRow[N - 1];
  const railY = sp.f.rail;
  const quarterRun = SPEC.stern_quarter_run.value;

  const rows = [];
  for (let j = 0; j < N + nRise; j++) {
    const rise = j >= N;
    const t = rise ? (j - N + 1) / nRise : 0;
    const y = rise ? lerp(yTop, sp.yTaff, t) : yRow[j];
    const v = rise ? 1 : j / (N - 1);

    // Where this row lands on the hull. Below the rail that is a point of the hull's own
    // last section; above it, a point on the rail line, further and further forward.
    let land;
    if (rise) {
      const zL = zAft - quarterRun * smoothstep(0, 1, t);
      land = new THREE.Vector3(model.halfBreadthAt(zL, railY), railY, zL);
    } else {
      land = new THREE.Vector3(sec[j][0], sec[j][1], zAft);
    }

    // The transom and the quarters above the wing transom are painted black, not carried
    // round with the ship's side: "Stern, Stern Galleries, Quarter Badges: black with
    // yellow carvings". The ochre gunport strake runs aft along the topside and stops at
    // the quarter piece, so the black holds all the way round the quarter and only gives
    // way to the strake in the last few inches before the hull's own planking takes over.
    // `black` is how far that has taken hold at this height.
    const black = smoothstep(sp.yWing, sp.yWing + SPEC.stern_counter_rail_depth.value * 3, y);
    const vBlack = lerp(v, 1, black);

    const pts = [];
    if (y <= sp.yTuck) {
      // Below the tuck the stern closes flat at the last station: a fan from the
      // centreline out to the hull's own edge, with no overhang to build.
      for (let k = 0; k < nT; k++) {
        pts.push({ p: new THREE.Vector3(land.x * (k / (nT - 1)), land.y, zAft), v });
      }
      for (let k = 1; k < nQ; k++) pts.push({ p: land.clone(), v });
    } else {
      for (let k = 0; k < nT; k++) pts.push({ p: sp.surface(y, k / (nT - 1)), v: vBlack });
      const corner = pts[nT - 1].p;
      for (let k = 1; k < nQ; k++) {
        const q = k / (nQ - 1);
        // The quarter leaves the corner as an edge and arrives at the hull running fore
        // and aft, so there is no crease where the two surfaces meet.
        const e = 1 - (1 - q) * (1 - q);
        pts.push({
          p: new THREE.Vector3(
            lerp(corner.x, land.x, e),
            lerp(corner.y, land.y, q),
            lerp(corner.z, land.z, q),
          ),
          v: lerp(vBlack, v, smoothstep(0.6, 1, q)),
        });
      }
    }
    rows.push(Object.assign(pts, { v }));
  }
  return rows;
}

/**
 * The inboard face of the stern above the deck, inset by the thickness of the side.
 * Without it you look straight through the taffrail into the counter from overhead.
 */
function innerRows(rows, fromY) {
  const t = SPEC.side_thickness.value;
  const out = [];
  for (const row of rows) {
    if (row[0].p.y < fromY) continue;
    const inner = row.map((pt, k) => {
      // Across the transom the inboard face lies forward of the outboard one; round the
      // quarter it lies inboard of it. Blending between the two keeps the corner square.
      const q = k / (row.length - 1);
      const across = clamp(1 - q * 2.2, 0, 1);
      const p = pt.p.clone();
      p.z -= t * across;
      p.x -= t * (1 - across);
      return { p };
    });
    out.push(Object.assign(inner, { v: row.v }));
  }
  return out;
}

// ---------------------------------------------------------------------------
// The lights across the transom, into the great cabin
// ---------------------------------------------------------------------------
/**
 * The row of lights across the transom.
 *
 * `build` is false at the distant level, where the windows are a few pixels across and
 * not worth a quarter of the whole triangle budget. The heights are still returned,
 * because the counter rails and the taffrail ornament are placed against them and have
 * to sit in the same place whether the windows are drawn or not.
 */
function sternLights(cfg, mats, sp, group, build = true) {
  const count = SPEC.stern_light_count.value;
  const ySill = sp.f.deck + SPEC.stern_light_sill_above_deck.value;
  const yHead = ySill + SPEC.stern_light_height.value;
  // The row of lights fills the transom between the two quarter pieces. It is worked out
  // before the early return, because the taffrail's carving is spaced off it and the two
  // LOD switches — whether the lights are glazed and whether anything is carved — have to
  // stay independent of each other.
  const halfSpan = sp.halfBreadth((ySill + yHead) / 2) - SPEC.stern_quarter_piece_width.value;
  if (!build) return { ySill, yHead, halfSpan };
  const bar = SPEC.stern_glazing_bar.value;
  const depth = SPEC.stern_light_frame_depth.value;
  const munions = (count - 1) * SPEC.stern_light_munion.value;
  const w = (2 * halfSpan - munions) / count;
  const pitch = w + SPEC.stern_light_munion.value;

  const at = (out) => (x, y) => sp.surfaceAtX(y, x, out);
  const frames = [], glass = [], bars = [];

  for (let i = 0; i < count; i++) {
    const cx = (i - (count - 1) / 2) * pitch;
    const x0 = cx - w / 2, x1 = cx + w / 2;
    // The frame is a ring, not a panel behind the glass. Crown glass is transmissive, so
    // a solid frame behind it shows straight through and every light reads as a slab of
    // ochre instead of as a window with the dark cabin behind it.
    const fx0 = x0 - bar * 2, fx1 = x1 + bar * 2;
    const fy0 = ySill - bar * 2, fy1 = yHead + bar * 2;
    frames.push(patch(at(depth * 0.5), fx0, x0, fy0, fy1, 1, 3));
    frames.push(patch(at(depth * 0.5), x1, fx1, fy0, fy1, 1, 3));
    frames.push(patch(at(depth * 0.5), x0, x1, fy0, ySill, 3, 1));
    frames.push(patch(at(depth * 0.5), x0, x1, yHead, fy1, 3, 1));
    glass.push(patch(at(depth), x0, x1, ySill, yHead, 3, 3));
    if (!cfg.galleryGlazing) continue;
    // Glazing bars: small rectangular panes in a grid, as contemporary sash windows were
    // glazed. Leaded diamond quarries were a century out of date by 1798.
    for (let k = 1; k < SPEC.stern_panes_wide.value; k++) {
      const bx = lerp(x0, x1, k / SPEC.stern_panes_wide.value);
      bars.push(patch(at(depth * 1.4), bx - bar / 2, bx + bar / 2, ySill, yHead, 1, 3));
    }
    for (let k = 1; k < SPEC.stern_panes_high.value; k++) {
      const by = lerp(ySill, yHead, k / SPEC.stern_panes_high.value);
      bars.push(patch(at(depth * 1.4), x0, x1, by - bar / 2, by + bar / 2, 3, 1));
    }
  }

  const frame = new THREE.Mesh(mergeGeometries(frames), mats.ochre);
  frame.name = 'stern_light_frames';
  frame.userData.count = count;
  audit(frame, 'stern_light_count', 'count');
  group.add(frame);

  const pane = new THREE.Mesh(mergeGeometries(glass), mats.glass);
  pane.name = 'stern_light_glazing';
  group.add(pane);

  if (bars.length) {
    const b = new THREE.Mesh(mergeGeometries(bars), mats.ochre);
    b.name = 'stern_glazing_bars';
    group.add(b);
  }

  // The munions between the lights and the quarter piece at each end of the row.
  const piers = [];
  for (let i = 0; i <= count; i++) {
    const edge = (i === 0 || i === count);
    const half = (edge ? SPEC.stern_quarter_piece_width.value : SPEC.stern_light_munion.value) / 2;
    const px = (i - count / 2) * pitch;
    const c = i === 0 ? px - half : i === count ? px + half : px;
    piers.push(patch(at(depth * 0.75), c - half * 1.15, c + half * 1.15, ySill - bar * 2, yHead + bar * 2, 1, 3));
  }
  const pier = new THREE.Mesh(mergeGeometries(piers), mats.ochre);
  pier.name = 'stern_munions';
  group.add(pier);

  return { ySill, yHead, halfSpan };
}

// ---------------------------------------------------------------------------
// The quarter galleries — closed badges, as a post ship carried
// ---------------------------------------------------------------------------
function quarterGallery(cfg, mats, model, sp, paintV, side, group) {
  const len = SPEC.quarter_gallery_length.value;
  // The badge finishes against the quarter piece rather than at the transom corner, so
  // that the joint between the two is covered by the quarter piece as it is on a ship.
  const z1 = model.zAft - SPEC.stern_quarter_piece_width.value;
  const z0 = z1 - len;
  const proj = SPEC.quarter_gallery_projection.value;

  // The badge is sited on the ship's own lines, not on a height above the waterline: its
  // lower stool sits on the top of the main wale and its bell-top dies into the rail, so
  // it fills the topside exactly as it does in the reference photograph. Steel wants the
  // lower rim "as long as possible", and on this hull that is the full run from the wale
  // to the rail — about 5 ft, which is the height 06 §12.3 reconstructs.
  const yBotAt = (z) => model.featureYAt(z).wale_top;
  const yTopAt = (z) => model.featureYAt(z).rail;

  // How far the badge stands off the ship's side at a station: nothing at the forward
  // end, where it dies into the planking, full projection at the after end.
  const spread = (z) => smoothstep(z0, z1 - len * 0.2, z) ** 0.7;
  // The section: out from the ship's side, round, and back to it — a closed badge with a
  // rim under it and a hollowed bell-top over it.
  const bulge = (p) => 1 - Math.abs(2 * p - 1) ** 2.4;

  /** A point on the badge. `z` runs aft, `p` runs up the section from rim to hood. */
  const at = (z, p) => {
    const y = lerp(yBotAt(z), yTopAt(z), p);
    const x = model.halfBreadthAt(z, y) + proj * bulge(p) * spread(z);
    return new THREE.Vector3(x * side, y, z);
  };

  const nz = Math.max(5, Math.round(cfg.sternStations * 0.9));
  const np = Math.max(5, Math.round(cfg.sternStations * 0.6));
  const rows = [];
  for (let i = 0; i < np; i++) {
    const p = i / (np - 1);
    const row = [];
    for (let k = 0; k < nz; k++) {
      const q = at(lerp(z0, z1, k / (nz - 1)), p);
      row.push({ p: q, v: paintV(q.y) });
    }
    rows.push(Object.assign(row, { v: paintV(at(z1, p).y) }));
  }
  // Black ground, ochre framing, gilt carving — "Stern, Stern Galleries, Quarter Badges:
  // black with yellow carvings". Painting the badge on the hull's own strip instead would
  // carry the ochre gunport strake straight across it, which is what the replica does but
  // not what English practice of 1798 did, and it makes the badge vanish into the side.
  const shell = new THREE.Mesh(gridGeometry(rows, { mirror: false, inward: side > 0 }), mats.black);
  shell.name = `quarter_gallery_${side > 0 ? 'starboard' : 'port'}`;
  if (side > 0) audit(shell, 'quarter_gallery_length', 'extent_z');
  group.add(shell);

  // The after end of the badge, closed by a flat finishing against the quarter piece.
  const cap = [];
  for (let i = 0; i < np - 1; i++) {
    const a = at(z1, i / (np - 1)), b = at(z1, (i + 1) / (np - 1));
    const ha = model.halfBreadthAt(z1, a.y) * side, hb = model.halfBreadthAt(z1, b.y) * side;
    const g = new THREE.BufferGeometry();
    const tri = side > 0
      ? [a.x, a.y, a.z, b.x, b.y, b.z, ha, a.y, a.z, b.x, b.y, b.z, hb, b.y, b.z, ha, a.y, a.z]
      : [a.x, a.y, a.z, ha, a.y, a.z, b.x, b.y, b.z, b.x, b.y, b.z, ha, a.y, a.z, hb, b.y, b.z];
    g.setAttribute('position', new THREE.Float32BufferAttribute(tri, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute([0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0], 2));
    g.computeVertexNormals();
    cap.push(g);
  }
  const finishing = new THREE.Mesh(mergeGeometries(cap), mats.black);
  finishing.name = 'quarter_gallery_finishing';
  group.add(finishing);

  // The lights, on the outboard face, where they catch the light abaft the beam. They
  // sit between the lower stool and the bell-top, which puts them across the gunport
  // strake — where the reference photograph has them.
  const span = yTopAt(z1) - yBotAt(z1);
  const p0 = SPEC.quarter_gallery_rim_depth.value / span;
  const p1 = 1 - SPEC.quarter_gallery_hood_depth.value / span;
  const n = SPEC.quarter_gallery_light_count.value;
  const glass = [], frames = [];
  const fz = (u, v) => at(lerp(z0, z1, u), v);
  const bar = SPEC.stern_glazing_bar.value / SPEC.quarter_gallery_length.value;
  // The lights are laid out inside a margin at each end of the badge. Running the frames
  // past u = 1 makes `at()` extrapolate abaft the badge and throws a great sheet of ochre
  // out over the quarter.
  const margin = 0.08, slot = (1 - 2 * margin) / n;
  const centres = [];
  for (let i = 0; i < n; i++) {
    const c = margin + slot * (i + 0.5);
    const half = slot * 0.34;
    const f0 = c - half - bar * 2, f1 = c + half + bar * 2;
    const q0 = p0 - 0.04, q1 = p1 + 0.04;
    frames.push(patch(fz, f0, c - half, q0, q1, 1, 3));
    frames.push(patch(fz, c + half, f1, q0, q1, 1, 3));
    frames.push(patch(fz, c - half, c + half, q0, p0, 3, 1));
    frames.push(patch(fz, c - half, c + half, p1, q1, 3, 1));
    glass.push(patch(fz, c - half, c + half, p0, p1, 3, 3));
    centres.push(c);
  }
  // Both sit proud of the badge's own surface, pushed out along its normal. Pushing
  // along x alone buries them where the badge turns to face aft at the quarter.
  const normalAt = (u, v) => {
    const h = 0.02;
    const a = fz(clamp(u + h, 0, 1), v).sub(fz(clamp(u - h, 0, 1), v));
    const b = fz(u, clamp(v + h, 0, 1)).sub(fz(u, clamp(v - h, 0, 1)));
    const nrm = new THREE.Vector3().crossVectors(a, b);
    if (nrm.lengthSq() < 1e-12) return new THREE.Vector3(side, 0, 0);
    nrm.normalize();
    return nrm.x * side < 0 ? nrm.negate() : nrm;
  };
  const push = (geom, d, u, v) => {
    const nrm = normalAt(u, v).multiplyScalar(d);
    geom.translate(nrm.x, nrm.y, nrm.z);
    geom.computeVertexNormals();
    return geom;
  };
  const gf = new THREE.Mesh(
    mergeGeometries(frames.map((g, i) => push(g, 0.014, centres[Math.floor(i / 4)], 0.5))), mats.ochre);
  gf.name = 'quarter_gallery_frames';
  group.add(gf);
  if (cfg.galleryGlazing) {
    const gg = new THREE.Mesh(
      mergeGeometries(glass.map((g, i) => push(g, 0.026, centres[i], 0.5))), mats.glass);
    gg.name = 'quarter_gallery_glazing';
    group.add(gg);
  }

  if (cfg.sternOrnament === 'none') return;

  // The rim under the badge and the moulding over the bell-top, both gilt on the black.
  const rimCurve = (p) => new THREE.CatmullRomCurve3(
    Array.from({ length: nz }, (_, k) => at(lerp(z0, z1, k / (nz - 1)), p)),
  );
  const d = SPEC.stern_counter_rail_proud.value, h = SPEC.stern_counter_rail_depth.value;
  const profile = [[-d, -h / 2], [d, -h / 2], [d, h / 2], [-d, h / 2]];
  const steps = Math.max(8, Math.round(cfg.mouldingSweeps / 4));
  const rims = new THREE.Mesh(mergeGeometries([
    sweep(rimCurve(0.06), profile, { steps, closed: true }),
    sweep(rimCurve(0.94), profile, { steps, closed: true }),
  ]), mats.ochre);
  rims.name = 'quarter_gallery_rims';
  group.add(rims);

  // The carved brackets that appear to carry the badge, gadrooned on the underside.
  const drop = SPEC.quarter_gallery_bracket_drop.value;
  const brackets = [];
  for (const u of [0.20, 0.80]) {
    const b = at(lerp(z0, z1, u), 0.06);
    const g = block(0.16, drop, 0.34, 1);
    g.translate(0, -drop, 0);
    g.translate(b.x - 0.05 * side, b.y, b.z);
    // Taper the bracket in toward the ship's side as it drops away below the rim.
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const t = clamp((b.y - p.getY(i)) / drop, 0, 1);
      // The bracket dies onto the planking, not into it: without the margin it sinks
      // inside the hull and all that survives is a gilt splinter on the topside.
      const onSide = (model.halfBreadthAt(b.z, p.getY(i)) + 0.03) * side;
      p.setX(i, lerp(p.getX(i), onSide, t ** 1.4));
      p.setZ(i, lerp(p.getZ(i), b.z, t * 0.5));
    }
    g.computeVertexNormals();
    brackets.push(g);
  }
  const bk = new THREE.Mesh(mergeGeometries(brackets), mats.gilt);
  bk.name = 'quarter_gallery_brackets';
  group.add(bk);
}

// ---------------------------------------------------------------------------
// The rudder, hung on the sternpost
// ---------------------------------------------------------------------------
function buildRudder(cfg, mats, model, sp, paintV, group) {
  const zAft = model.zAft;
  const rake = Math.tan(deg(SPEC.rudder_post_rake_deg.value));
  const yHeel = sp.f.keel_bottom;
  const yHead = SPEC.rudder_head_above_wl.value;
  const t = SPEC.rudder_thickness.value / 2;
  const bHeel = SPEC.rudder_breadth_at_heel.value;

  // The forward edge of the rudder is the after face of the post, which rakes aft as it
  // rises. The blade is broadest at the heel and narrows to the head.
  const bl = monotoneCubic(
    [yHeel, 0, sp.yTuck, yHead],
    [bHeel, bHeel * 0.92, bHeel * 0.62, SPEC.rudder_breadth_at_head.value],
  );
  const zFwd = (y) => zAft + SPEC.keel_siding.value * 0.25 + rake * (y - yHeel);

  const levels = [];
  const nY = Math.max(5, Math.round(cfg.sternStations * 0.8));
  for (let i = 0; i < nY; i++) {
    const y = lerp(yHeel, yHead, i / (nY - 1));
    // The main piece is thickest at its forward edge and thins toward the after edge.
    levels.push({ y, z0: zFwd(y), z1: zFwd(y) + bl(y), t0: t, t1: t * 0.55 });
  }
  const ring = (L) => [[L.t0, L.z0], [L.t1, L.z1], [-L.t1, L.z1], [-L.t0, L.z0]];

  const pos = [], uvs = [], idx = [];
  // The rudder is coppered below the waterline and blacked above it like the rest of the
  // ship, so its V comes from the hull's paint coordinate, not from its own length.
  for (const L of levels) {
    for (const [x, z] of ring(L)) { pos.push(x, L.y, z); uvs.push(z / 2.4, paintV(L.y)); }
  }
  for (let i = 0; i < levels.length - 1; i++) {
    for (let k = 0; k < 4; k++) {
      const kn = (k + 1) % 4;
      const a = i * 4 + k, b = i * 4 + kn, c = a + 4, d = (i + 1) * 4 + kn;
      idx.push(a, c, b, b, c, d);
    }
  }
  for (const [L, dir] of [[levels[0], -1], [levels[levels.length - 1], 1]]) {
    const o = pos.length / 3;
    for (const [x, z] of ring(L)) { pos.push(x, L.y, z); uvs.push(0, paintV(L.y)); }
    if (dir < 0) idx.push(o, o + 1, o + 2, o, o + 2, o + 3);
    else idx.push(o, o + 2, o + 1, o, o + 3, o + 2);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  g.setIndex(idx);
  g.computeVertexNormals();

  const rudder = new THREE.Mesh(g, mats.hull);
  rudder.name = 'rudder';
  audit(rudder, 'rudder_height', 'extent_y');
  group.add(rudder);

  if (cfg.rudderIrons) {
    const n = SPEC.rudder_pintle_count.value;
    const w = SPEC.rudder_iron_width.value, th = SPEC.rudder_iron_thickness.value;
    const irons = [];
    for (let i = 0; i < n; i++) {
      const y = lerp(yHeel + 0.30, sp.yTuck - 0.20, i / (n - 1));
      const z0 = zFwd(y);
      // The gudgeon strap runs forward onto the post, the pintle strap aft onto the
      // blade, and the pin stands between them on the axis of the post.
      for (const [zc, len] of [[z0 - 0.30, 0.58], [z0 + 0.34, 0.66]]) {
        const b = block(t * 2 + th * 2, w, len, 1);
        b.translate(0, y - w / 2, zc);
        irons.push(b);
      }
      const pin = new THREE.CylinderGeometry(th * 1.7, th * 1.7, w * 1.9, Math.max(5, Math.round(cfg.latheSegments / 2)));
      pin.translate(0, y - w / 2, z0);
      irons.push(pin);
    }
    const iron = new THREE.Mesh(mergeGeometries(irons), mats.iron);
    iron.name = 'rudder_irons';
    iron.userData.count = n;
    group.add(iron);
  }

  // The head comes up through the counter, and the tiller runs forward from it under the
  // quarterdeck to the sweep abaft the wheel.
  const tiller = new THREE.Mesh(spar({
    length: SPEC.tiller_length.value,
    radiusAt: (u) => lerp(SPEC.tiller_diameter.value / 2, SPEC.tiller_diameter.value / 3.2, u),
    segments: Math.max(2, cfg.sparSegments), radial: cfg.sparRadial,
  }), mats.timber);
  tiller.name = 'tiller';
  tiller.position.set(0, yHead - SPEC.tiller_diameter.value * 0.9, zFwd(yHead) + bl(yHead) / 2);
  // The tiller runs forward from the head, rising a little as it goes.
  tiller.rotation.x = deg(-86);
  group.add(tiller);
}

// ---------------------------------------------------------------------------
// Carved work
// ---------------------------------------------------------------------------

// A three-by-five stroke alphabet, enough for the ship's name. Each letter is a list of
// segments in a box three wide and five high; they are laid on the counter as relief.
const LETTERS = {
  S: [[0, 5, 3, 5], [0, 3, 0, 5], [0, 3, 3, 3], [3, 0, 3, 3], [0, 0, 3, 0]],
  U: [[0, 0.5, 0, 5], [3, 0.5, 3, 5], [0, 0, 3, 0]],
  R: [[0, 0, 0, 5], [0, 5, 3, 5], [3, 3, 3, 5], [0, 3, 3, 3], [1.4, 3, 3, 0]],
  P: [[0, 0, 0, 5], [0, 5, 3, 5], [3, 3, 3, 5], [0, 3, 3, 3]],
  I: [[1.5, 0, 1.5, 5]],
  E: [[0, 0, 0, 5], [0, 5, 3, 5], [0, 3, 2.4, 3], [0, 0, 3, 0]],
};

/** The ship's name in carved relief on the counter, inside its cartouche. */
function nameOnCounter(sp, name, yCentre) {
  const width = SPEC.stern_cartouche_width.value * 0.76;
  const hLetter = SPEC.stern_cartouche_height.value * 0.50;
  const wLetter = hLetter * 0.60;
  const pitch = width / name.length;
  const stroke = hLetter / 11;
  const relief = SPEC.stern_cartouche_relief.value * 0.6;

  const parts = [];
  for (let i = 0; i < name.length; i++) {
    const segs = LETTERS[name[i]];
    if (!segs) continue;
    // Laid out with x increasing to starboard, which is how the name reads the right way
    // round from astern: a camera abaft the ship looking forward has starboard on its
    // right, so +x is left-to-right in the picture.
    const ox = (i - (name.length - 1) / 2) * pitch;
    for (const [ax, ay, bx, by] of segs) {
      const x0 = ox + (ax / 3 - 0.5) * wLetter, x1 = ox + (bx / 3 - 0.5) * wLetter;
      const y0 = yCentre + (ay / 5 - 0.5) * hLetter, y1 = yCentre + (by / 5 - 0.5) * hLetter;
      const len = Math.hypot(x1 - x0, y1 - y0) + stroke;
      const g = new THREE.BoxGeometry(len, stroke, relief);
      g.rotateZ(Math.atan2(y1 - y0, x1 - x0));
      const my = (y0 + y1) / 2, mx = (x0 + x1) / 2;
      const s = clamp(Math.abs(mx) / Math.max(sp.halfBreadth(my), 1e-4), 0, 1);
      const n = sp.surfaceNormal(my, s);
      g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), n));
      const mid = sp.surfaceAtX(my, mx, relief * 0.6);
      g.translate(mid.x, mid.y, mid.z);
      parts.push(g);
    }
  }
  return parts;
}

// ---------------------------------------------------------------------------
export function buildStern(cfg, mats, model, ctx) {
  const group = new THREE.Group();
  group.name = 'stern';

  const sp = sternProfile(model);
  const paintV = paintVAt(cfg, model);
  const rows = closureRows(cfg, model, sp);

  // 1. The closure. One surface from the keel to the taffrail, carrying the hull's own
  //    paint bands round the counter and across the transom.
  const shell = new THREE.Mesh(gridGeometry(rows), mats.hull);
  shell.name = 'stern_shell';
  group.add(shell);

  // 2. The inboard face above the deck, so the stern is solid from overhead as well.
  if (cfg.innerBulwarks) {
    const inner = new THREE.Mesh(gridGeometry(innerRows(rows, sp.f.deck), { inward: true }), mats.red);
    inner.name = 'stern_inner';
    group.add(inner);
  }

  // 3. The taffrail: the cap over the transom and the quarter pieces, swept along the top
  //    row of the closure so that it takes its round-up and round-aft from the surface.
  const top = rows[rows.length - 1];
  // The port half is the starboard half reversed, less its centreline point: leaving the
  // duplicate in puts a zero-length segment in the curve and the sweep kinks there.
  const topPts = [
    ...[...top].reverse().map((q) => new THREE.Vector3(-q.p.x, q.p.y, q.p.z)),
    ...top.slice(1).map((q) => q.p.clone()),
  ];
  const cw = SPEC.taffrail_cap_width.value / 2, ct = SPEC.taffrail_cap_thickness.value;
  // The cap is let into the top of the stern timbers rather than laid on top of them, so
  // that the taffrail's quoted height is the height of the rail itself.
  const cap = new THREE.Mesh(
    sweep(new THREE.CatmullRomCurve3(topPts), [[-cw, -ct], [cw, -ct], [cw, 0], [-cw, 0]],
      { steps: cfg.mouldingSweeps, closed: true }),
    mats.black,
  );
  cap.name = 'taffrail';
  // The tolerance allows for the thickness of the cap itself: the spec figure is the
  // height of the taffrail, and what is measured is the top of the timber capping it.
  audit(cap, 'stern_taffrail_above_wl', 'max_y', { tolerance: 0.035 });
  group.add(cap);

  // 4. The lights across the transom.
  // At silhouette range a row of stern lights and a pair of quarter galleries are a few
  // pixels across and cost a quarter of the whole triangle budget for the level, so they
  // are not built at all there.
  const lights = sternLights(cfg, mats, sp, group, cfg.sternWindows);

  // 5. The counter rails. Steel names them from the bottom up — tuck rail, lower counter
  //    rail, upper counter rail — and each runs right across the stern.
  const rd = SPEC.stern_counter_rail_proud.value, rh = SPEC.stern_counter_rail_depth.value;
  const railAt = (y) => {
    const n = Math.max(8, Math.round(cfg.mouldingSweeps / 4));
    const pts = [];
    for (let i = 0; i <= n; i++) {
      pts.push(sp.surfaceAtX(y, sp.halfBreadth(y) * ((i / n) * 2 - 1), rd * 0.5));
    }
    return sweep(new THREE.CatmullRomCurve3(pts),
      [[-rd, -rh / 2], [rd, -rh / 2], [rd, rh / 2], [-rd, rh / 2]], { steps: n, closed: true });
  };
  const counterRails = new THREE.Mesh(mergeGeometries([
    railAt(sp.yTuck + rh),
    railAt(sp.yWing),
    railAt(lights.ySill - SPEC.stern_light_munion.value),
    railAt(lights.yHead + SPEC.stern_light_munion.value),
  ]), mats.ochre);
  counterRails.name = 'counter_rails';
  // The widest of the four is the one at the wing transom, so the mesh's athwartships
  // extent is the breadth of the stern there.
  audit(counterRails, 'stern_transom_breadth_wing', 'extent_x');
  group.add(counterRails);

  // 6. The quarter galleries, one each side.
  if (cfg.sternGalleries) for (const side of [1, -1]) quarterGallery(cfg, mats, model, sp, paintV, side, group);

  // 7. The rudder.
  buildRudder(cfg, mats, model, sp, paintV, group);

  // 8. The carved and gilded work. English practice for a ship in RN service is a black
  //    ground with the carving in gilt — "Stern, Stern Galleries, Quarter Badges: black
  //    with yellow carvings" — which is also what the reference photograph shows here.
  if (cfg.sternOrnament !== 'none') {
    const gilt = [];
    const relief = SPEC.stern_cartouche_relief.value;
    const on = (d) => (x, y) => sp.surfaceAtX(y, x, d);
    // Carved work is cheap in triangles only if its roundness is bought at the LOD's own
    // rate, so every oval here is subdivided against the same switch.
    const fine = cfg.sternOrnament === 'carved';
    const seg = (a, b) => (fine ? a : b);

    // The cartouche on the counter. ZAZ3067 is catalogued as showing "sternboard
    // decoration and name in a cartouche on stern counter", so the name goes on it.
    const yName = lerp(sp.yTuck, sp.yWing, 0.78);
    const cwid = SPEC.stern_cartouche_width.value, chgt = SPEC.stern_cartouche_height.value;
    gilt.push(oval(on(relief * 0.35), 0, cwid / 2, yName, chgt / 2, seg(16, 8), seg(6, 4)));

    // The taffrail's central cartouche, "a centre of attention within all the
    // decoration", with scrollwork spreading either side of it and dying away toward
    // the quarters.
    const yOrn = lerp(lights.yHead + SPEC.stern_light_munion.value * 2, sp.yTaff, 0.42);
    const ow = SPEC.taffrail_ornament_width.value, oh = SPEC.taffrail_ornament_height.value;
    gilt.push(oval(on(relief * 0.9), 0, ow / 2, yOrn, oh / 2, seg(16, 8), seg(6, 4)));
    for (const s of [1, -1]) {
      for (let i = 0; i < 3; i++) {
        const x = s * (ow / 2 + lights.halfSpan * lerp(0.14, 0.62, i / 2));
        const r = oh * lerp(0.34, 0.16, i / 2);
        gilt.push(oval(on(relief * 0.6), x, r * 1.5, yOrn, r, seg(8, 5), seg(4, 3)));
      }
    }

    // The term pieces: Steel's "carved work under each end of the taffarel".
    const tw = SPEC.stern_term_piece_width.value;
    for (const s of [1, -1]) {
      const y0 = lights.yHead + SPEC.stern_light_munion.value;
      const y1 = sp.yTaff - SPEC.taffrail_cap_thickness.value;
      const bAt = sp.halfBreadth((y0 + y1) / 2);
      gilt.push(oval(on(relief * 0.7), (bAt - tw * 0.6) * s, tw / 2, (y0 + y1) / 2, (y1 - y0) / 2, seg(6, 4), seg(8, 5)));
    }

    const carving = new THREE.Mesh(mergeGeometries(gilt), mats.gilt);
    carving.name = 'stern_carving';
    group.add(carving);

    // The name itself, carved in relief on the gilt cartouche and picked out dark, which
    // is the only way eight letters read at this size against gold.
    if (cfg.sternOrnament === 'carved') {
      const letters = new THREE.Mesh(mergeGeometries(nameOnCounter(sp, 'SURPRISE', yName)), mats.black);
      letters.name = 'stern_name';
      group.add(letters);
    }
  }

  return group;
}
