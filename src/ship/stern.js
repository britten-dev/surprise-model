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
// The grid's V coordinate is the hull's own paint coordinate, so the copper, the black
// and the ochre gunport strake run round the counter and across the transom without
// anything here having to be told where they are.
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
  // The taffrail has to top the quarterdeck's own bulwark, or the wheel and the after
  // fittings stand over the stern in plain view. The traced offsets carry the rail line
  // dead level the whole length of the ship, so measuring the taffrail off it alone puts
  // it below the quarterdeck; the greater of the two readings of the same measurement is
  // the one that stands up.
  const yTaff = Math.max(
    f.rail + SPEC.stern_taffrail_above_rail.value,
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

  // Half-breadth of the transom, by height. The lower anchor is the smaller of the
  // measured tuck half-breadth and the hull's own half-breadth at the last station:
  // where the traced hull is the narrower of the two it has to win, or the transom
  // stands outboard of the ship's side and the quarter grows a fin.
  const yLights = f.deck + SPEC.stern_light_sill_above_deck.value + SPEC.stern_light_height.value / 2;
  const bTuck = Math.min(SPEC.stern_half_breadth_at_tuck.value, model.halfBreadthAt(zTuck, yTuck));
  const halfBreadth = monotoneCubic(
    [yTuck, yWing, yLights, yTaff],
    [bTuck, SPEC.stern_half_breadth_wing_transom.value,
      SPEC.stern_half_breadth_at_lights.value,
      SPEC.stern_half_breadth_at_taffrail.value],
  );

  // Steel: every stern rail carries "a handsome round-up and round-aft … each rail
  // continuing to have more round-up in proceeding upwards".
  const roundAft = (y) => lerp(
    SPEC.stern_round_aft_lower.value, SPEC.stern_round_aft_upper.value,
    clamp((y - yTuck) / (yTaff - yTuck), 0, 1),
  );
  const roundUp = (y) => SPEC.stern_round_up_taffrail.value
    * clamp((y - yWing) / (yTaff - yWing), 0, 1) ** 2;

  /** A point on the transom surface. `s` is 0 on the centreline and 1 at the corner. */
  function surface(y, s, out = 0) {
    const p = new THREE.Vector3(
      halfBreadth(y) * s,
      y + roundUp(y) * (1 - s * s),
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

    // The transom above the wing transom is painted black, not carried round with the
    // ship's side: "Stern, Stern Galleries, Quarter Badges: black with yellow carvings".
    // The ochre gunport strake therefore runs aft along the quarter and dies at the
    // quarter piece, which is what both the reference photograph and the replica show.
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
          v: lerp(vBlack, v, e),
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
function sternLights(cfg, mats, sp, group) {
  const count = SPEC.stern_light_count.value;
  const ySill = sp.f.deck + SPEC.stern_light_sill_above_deck.value;
  const yHead = ySill + SPEC.stern_light_height.value;
  const bar = SPEC.stern_glazing_bar.value;
  const depth = SPEC.stern_light_frame_depth.value;

  // The row of lights fills the transom between the two quarter pieces.
  const halfSpan = sp.halfBreadth((ySill + yHead) / 2) - SPEC.stern_quarter_piece_width.value;
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
  audit(frame, 'stern_light_row_breadth', 'extent_x');
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
    piers.push(patch(at(depth * 0.75), c - half * 1.15, c + half * 1.15, ySill - bar * 3, yHead + bar * 3, 1, 3));
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
  const z1 = model.zAft;
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
  const shell = new THREE.Mesh(gridGeometry(rows, { mirror: false, inward: side > 0 }), mats.hull);
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
  for (let i = 0; i < n; i++) {
    const c = lerp(0.40, 0.88, n === 1 ? 0.5 : i / (n - 1));
    const half = (0.48 / n) * 0.62;
    frames.push(patch(fz, c - half - bar * 2, c + half + bar * 2, p0 - 0.03, p1 + 0.03, 3, 3));
    glass.push(patch(fz, c - half, c + half, p0, p1, 3, 3));
  }
  // Both sit proud of the badge's own surface, which is why they are pushed outboard
  // rather than left coplanar with it.
  const push = (geom, d) => {
    const p = geom.attributes.position;
    for (let i = 0; i < p.count; i++) p.setX(i, p.getX(i) + d * side);
    geom.computeVertexNormals();
    return geom;
  };
  const gf = new THREE.Mesh(mergeGeometries(frames.map((g) => push(g, 0.012))), mats.ochre);
  gf.name = 'quarter_gallery_frames';
  group.add(gf);
  if (cfg.galleryGlazing) {
    const gg = new THREE.Mesh(mergeGeometries(glass.map((g) => push(g, 0.026))), mats.glass);
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
    sweep(rimCurve(0.05), profile, { steps, closed: true }),
    sweep(rimCurve(0.95), profile, { steps, closed: true }),
  ]), mats.gilt);
  rims.name = 'quarter_gallery_rims';
  group.add(rims);

  // The carved brackets that appear to carry the badge, gadrooned on the underside.
  const drop = SPEC.quarter_gallery_bracket_drop.value;
  const brackets = [];
  for (const u of [0.16, 0.56, 0.94]) {
    const b = at(lerp(z0, z1, u), 0.05);
    const g = block(0.11, drop, 0.24, 1);
    g.translate(0, -drop, 0);
    g.translate(b.x - 0.05 * side, b.y, b.z);
    // Taper the bracket in toward the ship's side as it drops away below the rim.
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const t = clamp((b.y - p.getY(i)) / drop, 0, 1);
      p.setX(i, lerp(p.getX(i), model.halfBreadthAt(b.z, p.getY(i)) * side, t ** 1.4));
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
      const pin = new THREE.CylinderGeometry(th * 1.7, th * 1.7, w * 1.9, 8);
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
    // Laid out from starboard to port. Seen from astern — the only place anyone reads a
    // name on a counter from — starboard is on the left of the picture, so a name written
    // with x increasing to starboard comes out backwards.
    const ox = -(i - (name.length - 1) / 2) * pitch;
    for (const [ax, ay, bx, by] of segs) {
      const x0 = ox - (ax / 3 - 0.5) * wLetter, x1 = ox - (bx / 3 - 0.5) * wLetter;
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
  const topPts = [
    ...[...top].reverse().map((q) => new THREE.Vector3(-q.p.x, q.p.y, q.p.z)),
    ...top.map((q) => q.p.clone()),
  ];
  const cw = SPEC.taffrail_cap_width.value / 2, ct = SPEC.taffrail_cap_thickness.value;
  const cap = new THREE.Mesh(
    sweep(new THREE.CatmullRomCurve3(topPts), [[-cw, 0], [cw, 0], [cw, ct], [-cw, ct]],
      { steps: cfg.mouldingSweeps, closed: true }),
    mats.black,
  );
  cap.name = 'taffrail';
  audit(cap, 'stern_taffrail_above_wl', 'max_y');
  group.add(cap);

  // 4. The lights across the transom.
  const lights = sternLights(cfg, mats, sp, group);

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
  group.add(counterRails);

  // 6. The quarter galleries, one each side.
  for (const side of [1, -1]) quarterGallery(cfg, mats, model, sp, paintV, side, group);

  // 7. The rudder.
  buildRudder(cfg, mats, model, sp, paintV, group);

  // 8. The carved and gilded work. English practice for a ship in RN service is a black
  //    ground with the carving in gilt — "Stern, Stern Galleries, Quarter Badges: black
  //    with yellow carvings" — which is also what the reference photograph shows here.
  if (cfg.sternOrnament !== 'none') {
    const gilt = [];
    const relief = SPEC.stern_cartouche_relief.value;
    const on = (d) => (x, y) => sp.surfaceAtX(y, x, d);

    // The cartouche on the counter. ZAZ3067 is catalogued as showing "sternboard
    // decoration and name in a cartouche on stern counter", so the name goes on it.
    const yName = lerp(sp.yTuck, sp.yWing, 0.58);
    const cwid = SPEC.stern_cartouche_width.value, chgt = SPEC.stern_cartouche_height.value;
    gilt.push(oval(on(relief * 0.35), 0, cwid / 2, yName, chgt / 2, 16, 6));

    // The taffrail's central cartouche, "a centre of attention within all the
    // decoration", with scrollwork spreading either side of it and dying away toward
    // the quarters.
    const yOrn = lerp(lights.yHead + SPEC.stern_light_munion.value * 2, sp.yTaff, 0.42);
    const ow = SPEC.taffrail_ornament_width.value, oh = SPEC.taffrail_ornament_height.value;
    gilt.push(oval(on(relief * 0.9), 0, ow / 2, yOrn, oh / 2, 16, 6));
    for (const s of [1, -1]) {
      for (let i = 0; i < 3; i++) {
        const x = s * (ow / 2 + lights.halfSpan * lerp(0.14, 0.62, i / 2));
        const r = oh * lerp(0.34, 0.16, i / 2);
        gilt.push(oval(on(relief * 0.6), x, r * 1.5, yOrn, r, 8, 4));
      }
    }

    // The term pieces: Steel's "carved work under each end of the taffarel".
    const tw = SPEC.stern_term_piece_width.value;
    for (const s of [1, -1]) {
      const y0 = lights.yHead + SPEC.stern_light_munion.value;
      const y1 = sp.yTaff - SPEC.taffrail_cap_thickness.value;
      const bAt = sp.halfBreadth((y0 + y1) / 2);
      gilt.push(oval(on(relief * 0.7), (bAt - tw * 0.6) * s, tw / 2, (y0 + y1) / 2, (y1 - y0) / 2, 6, 8));
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
