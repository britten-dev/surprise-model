// The rig. Masts, spars, standing and running rigging.
//
// The whole rig is built from one idea: `mastGeometry()` works out, once, where every
// spar and every attachment point in the ship is, in world space. Everything after that
// — the shrouds, the ratlines, the stays, the braces, the sails — is drawn between
// points that object hands out. Nothing measures anything twice, so nothing can
// disagree with anything else.
//
// A mast rakes aft, so it is not a vertical line. Each mast has its own local frame:
// the origin at the step on the keelson, +Y up the mast, rotated aft about X by the
// rake. Heights along a mast are therefore distances up that leaning line, and the
// world position of a point on it comes from `alongMast()`.
import * as THREE from 'three';
import { SPEC } from '../spec/spec.js';
import { spar, ropeCurve, ropeTube, ropeLines, sweep, block } from '../util/solids.js';
import { mergeGeometries } from '../util/loft.js';
import { deg, lerp, clamp } from '../util/math.js';
import { audit, audits } from '../audit/measure.js';
import { buildSails } from './sails.js';

const S = (k) => SPEC[k].value;

/**
 * Steel's fractional taper table, for "yards in general" and for standing masts.
 * Multiply the tabulated maximum diameter by these to get the diameter at each quarter
 * from the partners (masts) or the slings (yards).
 */
const TAPER = {
  mast: [1, 60 / 61, 14 / 15, 6 / 7, 3 / 4, 2 / 3],
  topmast: [1, 60 / 61, 14 / 15, 6 / 7, 9 / 13, 6 / 11],
  yard: [1, 30 / 31, 7 / 8, 7 / 10, 3 / 7],
  bowsprit: [1, 60 / 61, 11 / 12, 4 / 5, 5 / 9],
};

/** Sample a taper table at fraction `t` along the spar. */
function taperAt(table, t) {
  const n = table.length - 1;
  const x = clamp(t, 0, 1) * n;
  const i = Math.min(n - 1, Math.floor(x));
  return lerp(table[i], table[i + 1], x - i);
}

/** A yard tapers from the slings at its middle out to both arms. */
const yardRadius = (maxDia) => (t) => (maxDia / 2) * taperAt(TAPER.yard, Math.abs(t - 0.5) * 2);

/**
 * Where everything is. Call once; everything else reads from the result.
 */
export function mastGeometry(model) {
  const stepY = S('mast_step_y');

  function mast(name, { positionKey, rakeKey, lengthKey, diaKey, headKey,
                        topmastKey, topmastDiaKey, topmastHeadKey,
                        tgKey, tgDiaKey, poleKey, topBreadthKey, topLengthKey }) {
    const z0 = model.fromStem(S(positionKey));
    const rake = deg(S(rakeKey));

    // A point `h` up the mast, in world space. The mast leans aft, so rising along it
    // moves aft as well as up.
    const along = (h) => new THREE.Vector3(0, stepY + h * Math.cos(rake), z0 + h * Math.sin(rake));

    const lower = S(lengthKey);
    const head = S(headKey);
    // The trestletrees, and therefore the top, sit at the foot of the lower masthead.
    const houndsH = lower - head;
    // The topmast is fidded on the trestletrees and overlaps the lower mast by exactly
    // the length of the lower masthead.
    const topmastHeel = houndsH;
    const topmast = S(topmastKey);
    const topmastHead = S(topmastHeadKey);
    const topmastHoundsH = topmastHeel + topmast - topmastHead;
    const tgHeel = topmastHoundsH;
    const tg = S(tgKey);
    const pole = S(poleKey);
    const truckH = tgHeel + tg;

    // How far up the mast the deck is. Everything that lands on deck — a stay's foot, a
    // staysail's clew, the heel of the spanker boom — has to be expressed against this
    // rather than against a fraction of the mast's length, because a mast is stepped on
    // the keelson and a fraction of its length lands somewhere in the hold.
    const deckY = model.featureYAt(z0).deck;
    const railY = model.featureYAt(z0).rail;
    const deckH = (deckY - stepY) / Math.cos(rake);
    const railH = (railY - stepY) / Math.cos(rake);
    /** A height up the mast, as a fraction of the run from the deck to the hounds. */
    const above = (f) => deckH + (houndsH - deckH) * f;

    return {
      name, z0, rake, along, deckH, railH, above, deckY, railY,
      stepY,
      lowerLength: lower, lowerHead: head, lowerDia: S(diaKey),
      houndsH, capH: lower,
      topmastHeel, topmastLength: topmast, topmastHead, topmastDia: S(topmastDiaKey),
      topmastHoundsH, topmastCapH: topmastHeel + topmast,
      tgHeel, tgLength: tg, tgDia: S(tgDiaKey), poleLength: pole,
      truckH,
      topBreadth: topBreadthKey ? S(topBreadthKey) : 0,
      topLength: topLengthKey ? S(topLengthKey) : 0,
      // The heights the yards hang at. A course yard hangs just below the top; a
      // topsail yard just below the topmast crosstrees; and so on up.
      yardH: {
        lower: houndsH - S('main_top_breadth') * 0.12,
        topsail: topmastHoundsH - 0.9,
        topgallant: tgHeel + tg * 0.62,
        royal: tgHeel + tg + pole * 0.55,
      },
    };
  }

  const fore = mast('fore', {
    positionKey: 'fore_mast_from_stem', rakeKey: 'fore_mast_rake_deg',
    lengthKey: 'fore_mast_length', diaKey: 'fore_mast_diameter', headKey: 'fore_mast_head',
    topmastKey: 'fore_topmast_length', topmastDiaKey: 'fore_topmast_diameter', topmastHeadKey: 'fore_topmast_head',
    tgKey: 'fore_topgallant_length', tgDiaKey: 'fore_topgallant_diameter', poleKey: 'fore_royal_pole',
    topBreadthKey: 'fore_top_breadth', topLengthKey: 'fore_top_length',
  });
  const main = mast('main', {
    positionKey: 'main_mast_from_stem', rakeKey: 'main_mast_rake_deg',
    lengthKey: 'main_mast_length', diaKey: 'main_mast_diameter', headKey: 'main_mast_head',
    topmastKey: 'main_topmast_length', topmastDiaKey: 'main_topmast_diameter', topmastHeadKey: 'main_topmast_head',
    tgKey: 'main_topgallant_length', tgDiaKey: 'main_topgallant_diameter', poleKey: 'main_royal_pole',
    topBreadthKey: 'main_top_breadth', topLengthKey: 'main_top_length',
  });
  const mizzen = mast('mizzen', {
    positionKey: 'mizzen_mast_from_stem', rakeKey: 'mizzen_mast_rake_deg',
    lengthKey: 'mizzen_mast_length', diaKey: 'mizzen_mast_diameter', headKey: 'mizzen_mast_head',
    topmastKey: 'mizzen_topmast_length', topmastDiaKey: 'mizzen_topmast_diameter', topmastHeadKey: 'mizzen_topmast_head',
    tgKey: 'mizzen_topgallant_length', tgDiaKey: 'mizzen_topgallant_diameter', poleKey: 'mizzen_royal_pole',
    topBreadthKey: 'mizzen_top_breadth', topLengthKey: 'mizzen_top_length',
  });

  // The bowsprit. Its heel steps on the beam next before the foremast and it rises over
  // the stem head at its steeve; the jibboom runs out beyond it.
  const steeve = deg(S('bowsprit_steeve_deg'));
  const bowspritHeel = new THREE.Vector3(
    0,
    model.featureYAt(fore.z0).deck - 0.35,
    fore.z0 + 0.9
  );
  const bowspritDir = new THREE.Vector3(0, Math.sin(steeve), -Math.cos(steeve));
  const bowspritCap = bowspritHeel.clone().addScaledVector(bowspritDir, S('bowsprit_length'));
  const jibboomOut = S('jibboom_length') * (1 - S('jibboom_housing_fraction'));
  const jibboomEnd = bowspritCap.clone().addScaledVector(bowspritDir, jibboomOut);

  return {
    masts: [fore, main, mizzen], fore, main, mizzen,
    bowsprit: {
      heel: bowspritHeel, dir: bowspritDir, cap: bowspritCap, end: jibboomEnd,
      length: S('bowsprit_length'), steeve,
      at: (d) => bowspritHeel.clone().addScaledVector(bowspritDir, d),
    },
  };
}

/** The lower mast, top, topmast, crosstrees, topgallant and pole for one mast. */
function buildMast(m, cfg, mats, group) {
  const seg = cfg.sparSegments;
  const radial = cfg.sparRadial;

  const stick = (length, maxDia, table, heelH, material) => {
    const g = spar({
      length,
      radiusAt: (t) => (maxDia / 2) * taperAt(table, t),
      segments: seg, radial,
    });
    const mesh = new THREE.Mesh(g, material);
    mesh.position.copy(m.along(heelH));
    mesh.rotation.x = m.rake;
    return mesh;
  };

  // Lower masts were left bright — varnished, not painted — with the mastheads black.
  const lower = stick(m.lowerLength, m.lowerDia, TAPER.mast, 0, mats.mast);
  lower.name = `${m.name}_lower_mast`;
  audits(lower, [`${m.name}_mast_rake_deg`, 'rake_deg']);
  group.add(lower);

  // The masthead above the hounds, blacked.
  const headMesh = new THREE.Mesh(
    new THREE.BoxGeometry(m.lowerDia * 0.82, m.lowerHead, m.lowerDia * 0.82),
    mats.mastBlack
  );
  headMesh.position.copy(m.along(m.houndsH + m.lowerHead / 2));
  headMesh.rotation.x = m.rake;
  group.add(headMesh);

  const topmast = stick(m.topmastLength, m.topmastDia, TAPER.topmast, m.topmastHeel, mats.mast);
  topmast.name = `${m.name}_topmast`;
  group.add(topmast);

  const tg = stick(m.tgLength + m.poleLength, m.tgDia, TAPER.topmast, m.tgHeel, mats.mast);
  tg.name = `${m.name}_topgallant`;
  group.add(tg);

  // The top: the platform on the trestletrees at the lower masthead. Its breadth is a
  // third of the topmast's length, and its length fore and aft three quarters of that.
  if (m.topBreadth) {
    const t = S('top_platform_thickness');
    const plat = new THREE.Mesh(
      new THREE.BoxGeometry(m.topBreadth, t, m.topLength),
      mats.mastBlack
    );
    const p = m.along(m.houndsH);
    plat.position.set(0, p.y, p.z + m.topLength * 0.18);
    plat.name = `${m.name}_top`;
    if (m.name === 'main') audit(plat, 'main_top_breadth', 'extent_x');
    group.add(plat);

    // Trestletrees and crosstrees under it.
    const tree = new THREE.Mesh(
      new THREE.BoxGeometry(m.topBreadth * 0.94, t * 1.6, m.topLength * 0.16),
      mats.mastBlack
    );
    tree.position.set(0, p.y - t, p.z + m.topLength * 0.18);
    group.add(tree);

    // The cap over the lower masthead, through which the topmast passes.
    const cap = new THREE.Mesh(
      new THREE.BoxGeometry(m.lowerDia * 2.1, m.lowerDia * 0.45, m.lowerDia * 1.05),
      mats.mastBlack
    );
    const c = m.along(m.capH);
    cap.position.set(0, c.y, c.z);
    group.add(cap);
  }

  // Topmast crosstrees, a bare frame, no platform.
  const cross = new THREE.Mesh(
    new THREE.BoxGeometry(m.topBreadth * 0.52 || 1.2, S('top_platform_thickness') * 1.4, m.topLength * 0.5 || 0.8),
    mats.mastBlack
  );
  const cp = m.along(m.topmastHoundsH);
  cross.position.set(0, cp.y, cp.z);
  group.add(cross);
}

/** One yard, hung across a mast at a given height, braced round by `braceDeg`. */
function buildYard(m, heightH, length, maxDia, braceDeg, cfg, mats, group, name, auditKey) {
  const g = spar({
    length,
    radiusAt: yardRadius(maxDia),
    segments: Math.max(4, cfg.sparSegments),
    radial: cfg.sparRadial,
  });
  // The spar helper builds along +Y from the origin; a yard lies athwartships, so it is
  // laid down onto the X axis and then swung to the brace angle.
  g.translate(0, -length / 2, 0);
  g.rotateZ(Math.PI / 2);
  const mesh = new THREE.Mesh(g, mats.mastBlack);
  const p = m.along(heightH);
  mesh.position.copy(p);
  mesh.rotation.y = deg(braceDeg);
  mesh.name = name;
  if (auditKey) audit(mesh, auditKey, 'extent_max');
  group.add(mesh);
  return mesh;
}

/** The two ends of a yard, in world space, after bracing. */
function yardArms(m, heightH, length, braceDeg) {
  const p = m.along(heightH);
  const a = deg(braceDeg);
  const half = length / 2;
  const dx = Math.cos(a) * half, dz = Math.sin(a) * half;
  return [
    new THREE.Vector3(p.x + dx, p.y, p.z - dz),
    new THREE.Vector3(p.x - dx, p.y, p.z + dz),
  ];
}

export function buildRig(cfg, mats, model, ctx) {
  const group = new THREE.Group();
  group.name = 'rig';
  const geo = mastGeometry(model);
  ctx.rig = geo;

  // The reference photograph shows her with the wind on the quarter and the yards
  // braced up a little; square yards look wrong dead square unless she is running.
  const BRACE = ctx.sails === 'storm' ? 22 : 12;

  for (const m of geo.masts) buildMast(m, cfg, mats, group);

  // ------------------------------------------------------------------- the bowsprit
  const bs = geo.bowsprit;
  const bsG = spar({
    length: bs.length,
    radiusAt: (t) => (S('bowsprit_diameter') / 2) * taperAt(TAPER.bowsprit, t),
    segments: cfg.sparSegments, radial: cfg.sparRadial,
  });
  const bsMesh = new THREE.Mesh(bsG, mats.mast);
  bsMesh.position.copy(bs.heel);
  bsMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), bs.dir);
  bsMesh.name = 'bowsprit';
  audit(bsMesh, 'bowsprit_steeve_deg', 'steeve_deg');
  group.add(bsMesh);

  const jbLen = bs.end.distanceTo(bs.cap);
  const jb = new THREE.Mesh(
    spar({
      length: jbLen,
      radiusAt: (t) => (S('jibboom_diameter') / 2) * taperAt(TAPER.bowsprit, t * 0.8),
      segments: Math.max(3, cfg.sparSegments - 2), radial: cfg.sparRadial,
    }),
    mats.mast
  );
  jb.position.copy(bs.cap);
  jb.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), bs.dir);
  jb.name = 'jibboom';
  group.add(jb);

  // The spritsail yard, across the bowsprit.
  const sy = new THREE.Mesh(
    (() => {
      const g = spar({
        length: S('spritsail_yard_length'),
        radiusAt: yardRadius(S('spritsail_yard_diameter')),
        segments: 5, radial: cfg.sparRadial,
      });
      g.translate(0, -S('spritsail_yard_length') / 2, 0);
      g.rotateZ(Math.PI / 2);
      return g;
    })(),
    mats.mastBlack
  );
  sy.position.copy(bs.at(bs.length * 0.62));
  sy.name = 'spritsail_yard';
  group.add(sy);

  // ---------------------------------------------------------------------- the yards
  const YARDS = [
    ['fore', 'lower', 'fore_yard_length', 'fore_yard_diameter', 'fore_yard'],
    ['fore', 'topsail', 'fore_topsail_yard_length', 'fore_topsail_yard_diameter', 'fore_topsail_yard'],
    ['fore', 'topgallant', 'fore_topgallant_yard_length', 'fore_topgallant_yard_diameter', 'fore_topgallant_yard'],
    ['fore', 'royal', 'fore_royal_yard_length', 'fore_royal_yard_diameter', 'fore_royal_yard'],
    ['main', 'lower', 'main_yard_length', 'main_yard_diameter', 'main_yard'],
    ['main', 'topsail', 'main_topsail_yard_length', 'main_topsail_yard_diameter', 'main_topsail_yard'],
    ['main', 'topgallant', 'main_topgallant_yard_length', 'main_topgallant_yard_diameter', 'main_topgallant_yard'],
    ['main', 'royal', 'main_royal_yard_length', 'main_royal_yard_diameter', 'main_royal_yard'],
    ['mizzen', 'lower', 'crossjack_yard_length', 'crossjack_yard_diameter', 'crossjack_yard'],
    ['mizzen', 'topsail', 'mizzen_topsail_yard_length', 'mizzen_topsail_yard_diameter', 'mizzen_topsail_yard'],
    ['mizzen', 'topgallant', 'mizzen_topgallant_yard_length', 'mizzen_topgallant_yard_diameter', 'mizzen_topgallant_yard'],
    ['mizzen', 'royal', 'mizzen_royal_yard_length', 'mizzen_royal_yard_diameter', 'mizzen_royal_yard'],
  ];
  const AUDITED = new Set(['main_yard', 'main_topsail_yard', 'fore_yard']);
  const yards = {};
  for (const [mastName, tier, lenKey, diaKey, name] of YARDS) {
    const m = geo[mastName];
    const h = m.yardH[tier];
    yards[name] = {
      mast: m, tier, h,
      length: S(lenKey),
      arms: yardArms(m, h, S(lenKey), BRACE),
      centre: m.along(h),
    };
    buildYard(m, h, S(lenKey), S(diaKey), BRACE, cfg, mats, group, name,
      AUDITED.has(name) ? `${name}_length` : null);
  }
  ctx.yards = yards;

  // ------------------------------------------------------------ the spanker boom and gaff
  const miz = geo.mizzen;
  // The spanker boom is slung from the mizzen a little above the rail, and cocks up
  // slightly toward its outer end so that it clears the taffrail.
  const boomRoot = miz.along(miz.railH + 0.6);
  const boom = new THREE.Mesh(
    spar({
      length: S('spanker_boom_length'),
      radiusAt: (t) => (S('spanker_boom_diameter') / 2) * taperAt([1, 40 / 41, 11 / 12, 5 / 6, 2 / 3], t),
      segments: cfg.sparSegments, radial: cfg.sparRadial,
    }),
    mats.mastBlack
  );
  boom.position.copy(boomRoot);
  boom.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0.09, 1).normalize());
  boom.name = 'spanker_boom';
  audit(boom, 'spanker_boom_length', 'extent_max');
  group.add(boom);

  const gaffRoot = miz.along(miz.above(0.52));
  const gaffDir = new THREE.Vector3(0, Math.sin(deg(S('spanker_gaff_peak_deg'))), Math.cos(deg(S('spanker_gaff_peak_deg'))));
  const gaff = new THREE.Mesh(
    spar({
      length: S('spanker_gaff_length'),
      radiusAt: (t) => (S('spanker_gaff_diameter') / 2) * taperAt([1, 40 / 41, 11 / 12, 4 / 5, 5 / 9], t),
      segments: cfg.sparSegments, radial: cfg.sparRadial,
    }),
    mats.mastBlack
  );
  gaff.position.copy(gaffRoot);
  gaff.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), gaffDir);
  gaff.name = 'spanker_gaff';
  group.add(gaff);
  ctx.spanker = {
    boomRoot, boomEnd: boomRoot.clone().addScaledVector(new THREE.Vector3(0, 0.09, 1).normalize(), S('spanker_boom_length')),
    gaffRoot, gaffEnd: gaffRoot.clone().addScaledVector(gaffDir, S('spanker_gaff_length')),
  };

  // ------------------------------------------------------------------ standing rigging
  group.add(buildStandingRigging(cfg, mats, model, geo, ctx));

  if (cfg.runningRigging !== 'none') {
    group.add(buildRunningRigging(cfg, mats, model, geo, yards, ctx, BRACE));
  }

  group.add(buildSails(cfg, mats, model, ctx, geo, yards));

  return group;
}

/**
 * Shrouds, ratlines, stays and backstays.
 *
 * The shrouds are the thing most worth getting right: they are what the eye reads as
 * "rigged". They run from the masthead down to the channel, spreading as they go, and
 * the ratlines are the ladder rungs across them at thirteen inches.
 */
function buildStandingRigging(cfg, mats, model, geo, ctx) {
  const group = new THREE.Group();
  group.name = 'standing_rigging';
  const tubes = [];
  const lines = [];
  const r = S('shroud_diameter') / 2;

  const addRope = (a, b, sag, radius = r) => {
    const c = ropeCurve(a, b, sag, cfg.ropeSegments);
    if (cfg.ropesAsTubes) tubes.push(ropeTube(c, radius, { tubular: cfg.ropeSegments, radial: cfg.ropeRadial }));
    else lines.push(c);
    return c;
  };

  const SHROUDS = [
    ['fore', 'fore_lower_shroud_pairs'],
    ['main', 'main_lower_shroud_pairs'],
    ['mizzen', 'mizzen_lower_shroud_pairs'],
  ];

  const ratlineCurves = [];

  for (const [name, countKey] of SHROUDS) {
    const m = geo[name];
    const n = S(countKey);
    // The channel: the shrouds land on it, spread along its length. The channels
    // module builds the platform itself; the rig only needs to know where it is.
    const chanY = model.featureYAt(m.z0).deck - 0.15;
    const chanX = model.halfBreadthAt(m.z0, chanY) + S('channel_width') * 0.72;

    for (const side of [1, -1]) {
      const shrouds = [];
      for (let i = 0; i < n; i++) {
        const t = n === 1 ? 0 : i / (n - 1);
        // The masthead end: the shrouds go over the head in pairs and are all seized
        // within the length of the head, so they start close together.
        const top = m.along(m.houndsH + m.lowerHead * (0.25 + 0.5 * t));
        top.x += side * m.lowerDia * 0.48;
        // The deck end: spread along the channel, running aft as they go down.
        const zc = m.z0 - S('channel_length') * 0.30 + S('channel_length') * 0.72 * t;
        const foot = new THREE.Vector3(side * chanX, chanY, zc);
        shrouds.push({ top, foot, curve: addRope(top, foot, 0.006) });
      }

      // Ratlines: horizontal, thirteen inches apart, from just below the futtock stave
      // down to just above the deadeyes. The outermost shrouds are left out of the top
      // six and the bottom six, exactly as Steel describes.
      if (cfg.ratlines && shrouds.length > 1) {
        const spacing = S('ratline_spacing') * cfg.ratlineEvery;
        const topY = shrouds[0].top.y - 0.35;
        const botY = chanY + 0.55;
        const count = Math.max(0, Math.floor((topY - botY) / spacing));
        for (let k = 0; k < count; k++) {
          const y = botY + k * spacing;
          const fromTop = count - 1 - k;
          const inset = (fromTop < 6 || k < 6) ? 1 : 0;
          const first = inset, last = shrouds.length - 1 - inset;
          if (last <= first) continue;
          const pts = [];
          for (let i = first; i <= last; i++) {
            pts.push(pointOnRopeAtHeight(shrouds[i].top, shrouds[i].foot, y));
          }
          for (let i = 0; i < pts.length - 1; i++) {
            const c = new THREE.CatmullRomCurve3([pts[i], pts[i + 1]]);
            ratlineCurves.push(c);
          }
        }
      }

      // Futtock shrouds: from the futtock stave on the lower shrouds up and outboard to
      // the rim of the top.
      const futtockN = S(`${name}_futtock_shroud_pairs`);
      const staveY = m.along(m.houndsH).y - 0.42;
      for (let i = 0; i < futtockN; i++) {
        const t = futtockN === 1 ? 0.5 : i / (futtockN - 1);
        const rim = m.along(m.houndsH);
        const a = new THREE.Vector3(
          side * (m.topBreadth / 2) * 0.92,
          rim.y,
          rim.z + lerp(-m.topLength * 0.25, m.topLength * 0.4, t)
        );
        const idx = Math.min(shrouds.length - 1, Math.round(t * (shrouds.length - 1)));
        const b = pointOnRopeAtHeight(shrouds[idx].top, shrouds[idx].foot, staveY);
        addRope(a, b, 0, r * 0.8);
      }

      // Topmast shrouds, from the topmast head down to the rim of the top.
      const tmN = S(`${name}_topmast_shroud_pairs`);
      for (let i = 0; i < tmN; i++) {
        const t = tmN === 1 ? 0 : i / (tmN - 1);
        const top = m.along(m.topmastHoundsH + 0.2 + 0.3 * t);
        top.x += side * m.topmastDia * 0.45;
        const rim = m.along(m.houndsH);
        const foot = new THREE.Vector3(
          side * (m.topBreadth / 2) * 0.88,
          rim.y + S('top_platform_thickness'),
          rim.z + lerp(-m.topLength * 0.22, m.topLength * 0.34, t)
        );
        addRope(top, foot, 0.005, r * 0.66);
      }

      // Standing backstays, from the topmast head down abaft the channel.
      const bsN = S('topmast_standing_backstay_pairs');
      for (let i = 0; i < bsN; i++) {
        const top = m.along(m.topmastHoundsH + 0.1);
        top.x += side * m.topmastDia * 0.5;
        const zc = m.z0 + S('channel_length') * (0.55 + 0.22 * i);
        const foot = new THREE.Vector3(side * chanX, chanY, zc);
        addRope(top, foot, 0.004, r * 0.8);
      }
    }
  }

  // ------------------------------------------------------------------------- stays
  // Every stay runs forward and down from its masthead: the mizzen to the main, the
  // main to the foremast and the deck, the fore to the bowsprit.
  const sr = S('stay_diameter') / 2;
  const deckAt = (z) => model.featureYAt(z).deck + 0.25;

  const foreStayFoot = geo.bowsprit.at(geo.bowsprit.length * 0.55);
  addRope(geo.fore.along(geo.fore.houndsH + 0.4), foreStayFoot, 0.012, sr);
  addRope(geo.fore.along(geo.fore.houndsH + 0.1), geo.bowsprit.at(geo.bowsprit.length * 0.35), 0.012, sr * 0.85);
  // Fore topmast stay, out to the jibboom.
  addRope(geo.fore.along(geo.fore.topmastHoundsH), geo.bowsprit.end.clone().lerp(geo.bowsprit.cap, 0.25), 0.008, sr * 0.6);
  addRope(geo.fore.along(geo.fore.tgHeel + geo.fore.tgLength * 0.7), geo.bowsprit.end, 0.006, sr * 0.45);

  const mainStayFoot = new THREE.Vector3(0, deckAt(geo.fore.z0 + 1.2), geo.fore.z0 + 1.2);
  addRope(geo.main.along(geo.main.houndsH + 0.4), mainStayFoot, 0.012, sr);
  addRope(geo.main.along(geo.main.topmastHoundsH), geo.fore.along(geo.fore.houndsH + 0.6), 0.008, sr * 0.6);
  addRope(geo.main.along(geo.main.tgHeel + geo.main.tgLength * 0.7), geo.fore.along(geo.fore.topmastHoundsH), 0.006, sr * 0.45);

  addRope(geo.mizzen.along(geo.mizzen.houndsH + 0.3), geo.main.along(geo.main.above(0.30)), 0.010, sr * 0.75);
  addRope(geo.mizzen.along(geo.mizzen.topmastHoundsH), geo.main.along(geo.main.houndsH + 0.7), 0.008, sr * 0.55);

  // Bobstays and bowsprit shrouds, holding the bowsprit down and sideways against the
  // pull of every headsail and the fore topmast stay.
  const stemZ = model.zFwd;
  for (let i = 0; i < S('bobstay_pairs'); i++) {
    const t = 0.42 + 0.2 * i;
    addRope(geo.bowsprit.at(geo.bowsprit.length * t),
      new THREE.Vector3(0, lerp(-0.4, 0.5, i / Math.max(1, S('bobstay_pairs') - 1)), stemZ + 0.5 + i * 0.35),
      0.004, sr * 0.7);
  }
  for (const side of [1, -1]) {
    const fy = model.featureYAt(stemZ + 2.2);
    addRope(geo.bowsprit.at(geo.bowsprit.length * 0.72),
      new THREE.Vector3(side * model.halfBreadthAt(stemZ + 2.2, fy.wale_top), fy.wale_top, stemZ + 2.2),
      0.004, sr * 0.55);
  }

  if (tubes.length) {
    const mesh = new THREE.Mesh(mergeGeometries(tubes), mats.standingRigging);
    mesh.name = 'shrouds_and_stays';
    group.add(mesh);
  }
  if (lines.length) {
    group.add(new THREE.LineSegments(ropeLines(lines, cfg.ropeSegments), mats.ropeLine));
  }

  // Ratlines are always lines, never tubes, even at the hero level: there are well over
  // a thousand of them and as tubes they would cost more triangles than the rest of the
  // ship put together, for something a millimetre thick at scale.
  if (ratlineCurves.length) {
    const rl = new THREE.LineSegments(ropeLines(ratlineCurves, 1), mats.ratlineLine);
    rl.name = 'ratlines';
    rl.userData.count = ratlineCurves.length;
    group.add(rl);
  }

  return group;
}

/** Where a shroud, hanging between two points, crosses a given height. */
function pointOnRopeAtHeight(top, foot, y) {
  const t = clamp((y - foot.y) / (top.y - foot.y || 1), 0, 1);
  return new THREE.Vector3().lerpVectors(foot, top, t);
}

/**
 * The running rigging that shows at model scale: the braces that swing the yards, the
 * lifts that hold the yardarms up, and the sheets.
 */
function buildRunningRigging(cfg, mats, model, geo, yards, ctx, braceDeg) {
  const group = new THREE.Group();
  group.name = 'running_rigging';
  const curves = [];
  const rr = S('running_rigging_diameter') / 2;
  const add = (a, b, sag = 0.02) => curves.push(ropeCurve(a, b, sag, cfg.ropeSegments));

  for (const [name, y] of Object.entries(yards)) {
    const m = y.mast;
    // Lifts: from each yardarm up to the masthead above it.
    const aboveH = y.tier === 'lower' ? m.topmastHoundsH
      : y.tier === 'topsail' ? m.tgHeel + m.tgLength * 0.5
        : m.tgHeel + m.tgLength + m.poleLength * 0.8;
    for (const arm of y.arms) add(arm, m.along(aboveH), 0.01);

    // Braces: aft from each yardarm to the mast behind, or to the deck for the mizzen.
    const behind = m.name === 'fore' ? geo.main : m.name === 'main' ? geo.mizzen : null;
    for (const arm of y.arms) {
      if (behind) {
        add(arm, behind.along(behind.houndsH * (y.tier === 'lower' ? 0.75 : 0.95)), 0.03);
      } else {
        const z = model.zAft - 1.2;
        add(arm, new THREE.Vector3(Math.sign(arm.x) * model.halfBreadthAt(z, model.featureYAt(z).deck) * 0.8,
          model.featureYAt(z).deck + 0.4, z), 0.03);
      }
    }
  }

  if (cfg.runningRigging === 'full') {
    // Sheets and tacks from the clews of the courses down to the deck and the rail.
    for (const key of ['fore_yard', 'main_yard']) {
      const y = yards[key];
      const below = model.featureYAt(y.mast.z0).deck + 0.3;
      for (const arm of y.arms) {
        const z = y.mast.z0 + 3.5;
        add(arm, new THREE.Vector3(Math.sign(arm.x) * model.halfBreadthAt(z, below) * 0.92, below, z), 0.05);
      }
    }
    // Halliards down to the deck at the mast.
    for (const m of geo.masts) {
      add(m.along(m.topmastHoundsH), new THREE.Vector3(0.4, model.featureYAt(m.z0).deck + 0.4, m.z0 + 0.5), 0.02);
    }
  }

  if (!curves.length) return group;
  if (cfg.ropesAsTubes) {
    const mesh = new THREE.Mesh(
      mergeGeometries(curves.map((c) => ropeTube(c, rr, { tubular: cfg.ropeSegments, radial: 3 }))),
      mats.runningRigging
    );
    mesh.name = 'running_rigging_ropes';
    group.add(mesh);
  } else {
    group.add(new THREE.LineSegments(ropeLines(curves, cfg.ropeSegments), mats.ropeLine));
  }
  return group;
}
