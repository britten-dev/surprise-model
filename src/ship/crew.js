// The watch on deck.
//
// Twelve figures do more for this ship than any other twelve thousand triangles in her,
// and not because anybody looks at them. They are what she is measured against. Without
// a man on her, a frigate is a shape with no size: the eye has nothing it knows the
// height of, so the gunports could be a foot high or four feet, and the whole ship reads
// as a model on a bench. Put one man at the wheel and every dimension on board is fixed
// at once.
//
// So they are built to be right at the two things that carry that: **height**, which
// comes from the muster rolls by way of the spec, and **posture**, which is what says
// these are people working a ship in a gale rather than mannequins set out on a deck.
// Nothing else about them matters much. Each is a few hundred triangles of jacket and
// tarpaulin, and at any distance where you could see a face there is a whole ship in the
// way of it.
//
// Every figure is its own Group with its arms as separate children, because
// src/ship/motion.js poses them: the helmsmen work the wheel, the men aloft sway with
// the mast, and everyone leans against the heel. A figure merged into the deck could not
// do any of that.
import * as THREE from 'three';
import { SPEC } from '../spec/spec.js';
import { mergeGeometries } from '../util/loft.js';
import { deg } from '../util/math.js';
import { audit } from '../audit/measure.js';

const S = (k) => SPEC[k].value;

/**
 * One figure, built about the origin at his feet, facing +Z.
 *
 * Roles differ only in what they are wearing and how they stand. `pose` is not an
 * animation — the motion layer does that — it is the attitude the figure is built in:
 * a man hauling stands differently from a man at a rail, and it reads from across the
 * ship when nothing else about him does.
 */
function figure(mats, { officer = false, pose = 'stand' } = {}) {
  const group = new THREE.Group();
  const h = officer ? S('crew_officer_height') : S('crew_figure_height');
  const legH = h * S('crew_leg_fraction');
  const shoulder = S('crew_shoulder_breadth');
  const hip = S('crew_hip_breadth');
  const depth = S('crew_depth');
  const headH = S('crew_head_height');
  const headW = S('crew_head_breadth');
  const armLen = h * S('crew_arm_fraction');
  const armT = S('crew_arm_thickness');
  const legT = S('crew_leg_thickness');
  const stance = S('crew_stance');
  const torsoH = h - legH - headH;

  // Everything below the neck that does not move is one mesh: two legs, the trunk, the
  // head and the hat. Six boxes and a draw call, against six draw calls.
  const solid = [];
  const box = (w, hh, d, x, y, z, rot = 0) => {
    const g = new THREE.BoxGeometry(w, hh, d, 1, 1, 1);
    if (rot) g.rotateX(rot);
    g.translate(x, y + hh / 2, z);
    solid.push(g);
    return g;
  };

  // Legs, apart. A man on a wet deck in a seaway stands with his feet well spread and
  // his knees soft, and that stance is most of what says the deck is moving.
  for (const sx of [-1, 1]) {
    const g = new THREE.BoxGeometry(legT, legH, legT * 1.05);
    g.translate(sx * stance / 2, legH / 2, 0);
    // The legs splay out to the stance, which means they lean, which means the figure
    // is standing on the deck rather than balanced on it.
    g.rotateZ(0);
    solid.push(g);
  }
  // The trunk: broader at the shoulder than at the hip, so it is built as two stacked
  // boxes rather than one, which at this size is enough to read as a body.
  box(hip * 1.05, torsoH * 0.45, depth, 0, legH, 0);
  box(shoulder, torsoH * 0.6, depth * 1.1, 0, legH + torsoH * 0.4, 0);
  // Head, and the tarpaulin hat over it that every man on deck in this weather is
  // wearing. The hat matters more than the head: it is wider, it is darker, and it is
  // the part that survives being three hundred pixels away.
  box(headW * 0.8, headH * 0.8, headW * 0.8, 0, legH + torsoH, 0);
  box(headW * 1.45, headH * 0.22, headW * 1.45, 0, legH + torsoH + headH * 0.78, 0);

  const body = new THREE.Mesh(mergeGeometries(solid), officer ? mats.crewCoat : mats.crewSlop);
  body.name = 'body';
  group.add(body);

  // The arms, one node each, hung from the shoulder so that the motion layer can swing
  // them about it. Their built attitude is the pose.
  const shoulderY = legH + torsoH * 0.92;
  const arms = [];
  for (const sx of [-1, 1]) {
    const pivot = new THREE.Group();
    pivot.name = sx < 0 ? 'arm_port' : 'arm_starboard';
    pivot.position.set(sx * (shoulder / 2 - armT * 0.3), shoulderY, 0);
    const g = new THREE.BoxGeometry(armT, armLen, armT);
    // Built hanging straight down from the shoulder; the pivot's rotation is the pose.
    g.translate(0, -armLen / 2, 0);
    const mesh = new THREE.Mesh(g, officer ? mats.crewCoat : mats.crewSlop);
    mesh.name = 'limb';
    pivot.add(mesh);
    group.add(pivot);
    arms.push(pivot);
  }

  // The poses.
  //
  // These arms have no elbows, and that decides the whole vocabulary. A straight arm
  // raised above about seventy degrees stops reading as an arm and starts reading as a
  // semaphore — two of them at once and the figure has rabbit's ears. So every pose here
  // keeps the shoulders inside a working range and gets its meaning from where the arms
  // point and how the man is standing, which is where it comes from in life anyway.
  const A = (k) => deg(S(k));
  const POSES = {
    // Hands down, braced. The watch when there is nothing to do but hold on.
    stand: {
      arms: [[A('crew_arm_rest_deg'), 0, A('crew_arm_rest_splay_deg')],
        [A('crew_arm_rest_deg'), 0, -A('crew_arm_rest_splay_deg')]],
      lean: 0,
    },
    // Both arms forward and down onto the spokes of the wheel.
    helm: {
      arms: [[A('crew_arm_helm_deg'), 0, A('crew_arm_helm_splay_deg')],
        [A('crew_arm_helm_deg'), 0, -A('crew_arm_helm_splay_deg')]],
      lean: -A('crew_lean_deg') * 0.5,
    },
    // One hand out to a shroud or a rail, the other down. A lookout, or a man standing
    // by a brace waiting for the word.
    hold: {
      arms: [[A('crew_arm_reach_deg'), 0, A('crew_arm_reach_splay_deg')],
        [A('crew_arm_rest_deg'), 0, -A('crew_arm_rest_splay_deg')]],
      lean: A('crew_lean_deg') * 0.3,
    },
    // Hauling on a fall: arms forward, weight back, which is the shape of a man pulling
    // and reads as one from right across the ship.
    haul: {
      arms: [[A('crew_arm_haul_deg'), 0, A('crew_arm_haul_splay_deg')],
        [A('crew_arm_haul_deg') * 0.9, 0, -A('crew_arm_haul_splay_deg')]],
      lean: A('crew_haul_lean_deg'),
    },
  };
  const pick = POSES[pose] ?? POSES.stand;
  arms[0].rotation.set(...pick.arms[0]);
  arms[1].rotation.set(...pick.arms[1]);
  // The lean is put on the body and the arms together — it is the man leaning, not his
  // coat — so it is applied to the group by the caller through this.
  const lean = pick.lean;

  group.userData.crew = { pose, officer, armLen, shoulderY, height: h, lean };
  return group;
}

/**
 * Put a figure on deck at a station, facing a direction.
 *
 * `side` is which side of the ship he stands on and `out` how far toward the rail, as a
 * fraction of the half-breadth there — because a man stands by the rail or at a fitting,
 * never on the centreline for no reason.
 */
function station(model, { fromStem, side = 1, out = 0.6, facing = Math.PI }) {
  const z = model.fromStem(fromStem);
  const y = model.standingDeckAt(z);
  const x = side * model.halfBreadthAt(z, y) * out;
  return { position: new THREE.Vector3(x, y, z), facing };
}

export function buildCrew(cfg, mats, model, ctx) {
  const group = new THREE.Group();
  group.name = 'crew';
  if (!cfg.crew) return group;

  const officers = cfg.crew === 'full';
  const place = (name, at, opts) => {
    const f = figure(mats, opts);
    f.position.copy(at.position);
    // Heading first, then the lean of the pose about his own athwartships axis. YXZ
    // order is what makes that read the way it is written: turn him, then tip him.
    f.rotation.order = 'YXZ';
    f.rotation.y = at.facing;
    f.rotation.x = f.userData.crew.lean;
    f.name = name;
    // Which way is up for this man, before the ship heels: the motion layer leans him
    // off it. Kept here because a figure has to know its own upright to be leaned.
    f.userData.crew.home = { y: f.rotation.y };
    group.add(f);
    return f;
  };

  // ------------------------------------------------------------------- the wheel
  // Two men at a double wheel, one at each of them, facing forward at the spokes. This
  // is the pair that carries the whole scene: they are the tallest thing on the after
  // deck that is not a mast, and everything else on board is measured off them.
  {
    const zWheel = model.fromStem(SPEC.wheel_station_from_stem.value);
    const y = model.standingDeckAt(zWheel);
    const spread = S('crew_helm_spread') / 2;
    for (const sx of [-1, 1]) {
      const f = figure(mats, { pose: 'helm' });
      f.position.set(sx * spread, y, zWheel + S('crew_helm_abaft_wheel'));
      f.rotation.order = 'YXZ';
      f.rotation.y = Math.PI;                       // facing forward, at the wheel
      f.rotation.x = f.userData.crew.lean;
      f.name = sx < 0 ? 'helmsman_port' : 'helmsman_starboard';
      f.userData.crew.role = 'helm';
      f.userData.crew.home = { y: f.rotation.y };
      group.add(f);
    }
  }

  // ----------------------------------------------------------------- the officers
  // The officer of the watch by the binnacle, where he can see the compass; a second
  // aft at the taffrail with his eye on the following sea, which in this weather is the
  // whole of the ship's business.
  {
    const zBin = SPEC.binnacle_station_from_stem.value + S('crew_con_abaft_binnacle');
    place('officer_of_the_watch',
      station(model, { fromStem: zBin, side: 1, out: 0.30, facing: Math.PI }),
      { officer: officers, pose: 'stand' });
    place('officer_aft',
      station(model, { fromStem: S('crew_taffrail_from_stem'), side: -1, out: S('crew_rail_inset'), facing: 0 }),
      { officer: officers, pose: 'hold' });
  }

  // -------------------------------------------------------------------- the watch
  // Hands at the pumps beside the mainmast, hands standing by the braces aft, and a
  // lookout forward. All of them at the rail or at a fitting, none of them in the
  // middle of a deck doing nothing.
  const watch = [
    ['lookout', S('crew_lookout_from_stem'), 1, 'hold', 0],
    ['pump_hand_port', S('crew_waist_from_stem'), -1, 'haul', Math.PI * 0.5],
    ['pump_hand_starboard', S('crew_waist_from_stem') + 1.2, 1, 'haul', -Math.PI * 0.5],
    ['waist_hand', S('crew_waist_from_stem') - 3.0, -1, 'stand', Math.PI],
    ['brace_hand_port', S('crew_brace_from_stem'), -1, 'haul', Math.PI * 0.8],
    ['brace_hand_starboard', S('crew_brace_from_stem') + 1.6, 1, 'stand', Math.PI],
    ['quarterdeck_hand', SPEC.wheel_station_from_stem.value - 5.0, -1, 'hold', Math.PI],
  ];
  for (const [name, fromStem, side, pose, facing] of watch) {
    place(name, station(model, { fromStem, side, out: S('crew_rail_inset'), facing }), { pose });
  }

  // ---------------------------------------------------------------------- aloft
  // Two hands in the main top. It is the one place on the ship where a figure is seen
  // against the sky, which is where the eye goes first, and it is the only way of
  // saying how high the mast is.
  if (ctx.rig && cfg.crew === 'full') {
    const m = ctx.rig.masts.find((x) => x.name === 'main') ?? ctx.rig.masts[1];
    if (m) {
      const p = m.along(m.houndsH);
      const half = (m.topBreadth ?? 3.4) / 2;
      for (const [i, sx] of [-1, 1].entries()) {
        const f = figure(mats, { pose: i ? 'haul' : 'hold' });
        f.position.set(sx * half * S('crew_top_inset'), p.y + SPEC.top_platform_thickness.value, p.z);
        f.rotation.order = 'YXZ';
        f.rotation.y = i ? Math.PI * 0.9 : Math.PI * 1.1;
        f.rotation.x = f.userData.crew.lean;
        f.name = i ? 'topman_starboard' : 'topman_port';
        f.userData.crew.role = 'aloft';
        f.userData.crew.home = { y: f.rotation.y };
        group.add(f);
      }
    }
  }

  // The audit measures one man and counts the rest. Height is the row that matters:
  // it is the ship's scale, and if it drifts the whole ship changes size with it.
  const first = group.children[0];
  if (first) audit(first, 'crew_figure_height', 'extent_y', { tolerance: 0.05 });
  group.userData.count = group.children.length;
  audit(group, 'crew_count', 'count', { tolerance: 0.34 });

  return group;
}
