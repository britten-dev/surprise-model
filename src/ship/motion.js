// Motion. The part of a ship that a still model cannot have.
//
// `buildShip` returns a ship that does not move, and that is deliberate: a GLB is a
// static thing and the host owns the hull's own heave, pitch and roll. But a ship whose
// every rope, sail and flag is welded to her hull is unmistakable however good the
// geometry is, because on a real ship *nothing above the deck is still*. The masts work,
// the shrouds swing, the canvas shivers, the ensign flies, the wheel turns and the men
// lean against the heel. Take all of that away and what is left reads as a model being
// carried through a scene, which is exactly what it is.
//
// So this is a layer laid over a built ship rather than a change to how she is built:
//
//     const ship = buildShip({ lod: 'game', sails: 'storm' });
//     const motion = createMotion(ship);
//     // each frame, after the host has moved the hull:
//     motion.update(t, { windSpeed: 24, heel: -0.18, pitch: 0.04, helm: -0.4, spray: 1 });
//
// `buildShip` is untouched, the GLB export is untouched, and a host that never calls
// this gets exactly the ship it had before.
//
// ## How the movement is done
//
// Three mechanisms, chosen per part by what that part is:
//
//  * **A vertex shader**, for everything aloft. The rig and the canvas are a handful of
//    merged meshes of tens of thousands of vertices with no nodes inside them to
//    animate, so the movement has to happen per vertex — and the processor has better
//    things to do with forty thousand triangles a frame.
//  * **Node transforms**, for the wheel and for the men. Both are rigid, both have their
//    own nodes, and moving a node is free.
//  * **Rewriting the vertices**, for the three flags. A flag is a hundred and fifty
//    vertices and its exact surface is worth more than the microsecond that costs.
//
// ## The one rule that matters
//
// Everything aloft has to agree about **the whip**: how far the rig has swung out of
// line at a given height. If the shader's answer and the processor's answer differ by a
// centimetre, the topmen stand in mid-air and the ensign leaves the gaff. So it is
// written once, in `whipAt`, and the shader is handed the same expression in GLSL
// immediately below it. That is the only duplicated logic in this file, and the two are
// kept touching for exactly that reason.
//
// ## Why the shader works in the ship's frame and not the mesh's
//
// Every mesh in the rig carries a transform of its own: a mast is placed at its step and
// raked, a yard is placed at its slings and braced round. So a vertex's own `position.y`
// is not its height above the deck, and using it would bend each spar about its own
// origin rather than about the ship. The shader therefore recovers the height in the
// ship's frame from the model matrix, and applies the displacement in world space after
// the projection — which costs one dot product and one matrix multiply per vertex, works
// whatever transform a mesh happens to carry, and keeps working when the host rolls the
// whole ship over forty degrees.
import * as THREE from 'three';
import { SPEC, PAINT } from '../spec/spec.js';
import { poseFlag } from './flags.js';
import { clamp, deg } from '../util/math.js';

const S = (k) => SPEC[k].value;

/**
 * How far the rig has swung out of line at a height in the ship's frame, as a fraction
 * of the whip amplitude: nil at the deck, one at the trucks, going as the square of the
 * height between — which is the shape a tapered spar loaded at its head bends in.
 */
function whipAt(y, deckY, truckY, exponent) {
  return Math.pow(clamp((y - deckY) / Math.max(0.001, truckY - deckY), 0, 1), exponent);
}

/** The same function, for the shader. It must stay the same function. */
const ALOFT_GLSL = `
  uniform float uTime;
  uniform vec3 uWhipWorld;
  uniform float uWhipExp;
  uniform float uDeckY;
  uniform float uTruckY;
  uniform vec3 uWindWorld;
  uniform float uWind;
  uniform float uSway;
  uniform float uSwayPeriod;
  uniform float uSwayFactor;

  float whipAt(float y) {
    return pow(clamp((y - uDeckY) / max(0.001, uTruckY - uDeckY), 0.0, 1.0), uWhipExp);
  }
`;

/**
 * The displacement every aloft part shares, applied in world space after the vertex has
 * been projected. `uShipRowY` is the row of the ship's inverse world matrix that gives
 * the height in her own frame, so one dot product turns a world position into the
 * number `whipAt` wants.
 */
const ALOFT_BODY = `
  {
    vec4 wPos = modelMatrix * vec4(transformed, 1.0);
    float shipY = dot(uShipRowY, wPos);
    vec3 disp = uWhipWorld * whipAt(shipY);
    // Cordage as well: a rope swings most at the middle of its span and not at all at
    // its ends. There is no telling where a rope's ends are once fifty of them have been
    // merged into one mesh — but a shroud's span is the height it covers, so height
    // stands in for it, and the phase is varied along and across the ship so that no two
    // ropes swing together.
    if (uSwayFactor > 0.0) {
      float hf = clamp((shipY - uDeckY) / max(0.001, uTruckY - uDeckY), 0.0, 1.0);
      float span = sin(3.14159 * hf);
      float ph = uTime * 6.28318 / uSwayPeriod + wPos.z * 0.7 + wPos.x * 1.3;
      disp += uWindWorld * (uSway * uSwayFactor * uWind * span * sin(ph));
      disp.y += uSway * uSwayFactor * 0.25 * uWind * span * sin(ph * 1.7);
    }
    mvPosition.xyz += (viewMatrix * vec4(disp, 0.0)).xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

/**
 * A sail.
 *
 * The ripple runs across the cloth from luff to leech and the whole belly breathes with
 * the gusts. Both die away to nothing at the head, the foot and the two leeches, because
 * those edges are bent to a spar or roped to a bolt rope and cannot move — a sail that
 * ripples at its head has come adrift from its yard.
 *
 * The displacement is along the sail's own normal and so is done in the mesh's own
 * frame, where the normal is; the whip above is done in the world's. `uv` arrives tiled
 * into the cloth map's variant grid — see `retileUV` in sails.js — so the sail's own
 * coordinates have to be recovered from it before anything can be said about where its
 * head and foot are.
 */
const SAIL_PARS = `
  uniform float uFlutter;
  uniform float uWaveLength;
  uniform float uWaveSpeed;
  uniform float uBreathe;
  uniform float uLuff;
  uniform float uSailTiles;
`;

const SAIL_BODY = `
  {
    vec2 suv = fract(uv * uSailTiles);
    // Freedom to move: nil at every edge, most in the middle, and more toward the leech,
    // which is the free edge and the one the eye watches.
    float across = sin(3.14159 * suv.x);
    float down = sin(3.14159 * suv.y);
    float leech = mix(1.0, uLuff, pow(1.0 - across, 3.0));
    float freedom = pow(across, 0.7) * pow(down, 0.55) * leech;

    float k = 6.28318 / max(0.5, uWaveLength);
    float phase = k * (suv.x * 8.0) - uTime * uWaveSpeed * 6.28318;
    float ripple = sin(phase) + 0.42 * sin(phase * 1.9 + suv.y * 4.0);
    float breath = uBreathe * sin(uTime * 0.55 + suv.y * 1.3);

    transformed += objectNormal * (uFlutter * uWind * freedom * (ripple * 0.5 + breath));

    // The bent surface's normal. There is no tangent frame on this geometry, so one is
    // built from the sail's own normal and the vertical — close enough on a sail, whose
    // cloths hang and whose head and foot are level — and the normal is leaned toward
    // the slope of the ripple. Without this the sail moves and its shading does not,
    // and canvas that shivers under perfectly even light reads as moving plastic.
    vec3 tU = normalize(cross(objectNormal, vec3(0.0, 1.0, 0.0)) + vec3(1e-4, 0.0, 0.0));
    vec3 tV = cross(objectNormal, tU);
    float dU = uFlutter * uWind * freedom * cos(phase) * k * 3.0;
    float dV = uFlutter * uWind * freedom * 0.3 * cos(phase * 1.9 + suv.y * 4.0);
    vNormal = normalize(normalMatrix * normalize(objectNormal - tU * dU - tV * dV));
  }
`;

// What a wet ship looks like. Wet paint is about half the brightness of dry and very
// much smoother, and it is the smoothness that does the work: the darkening alone reads
// as a repaint, while the sheet of specular the water puts on the topsides reads as a
// sea that has just gone over her.
const WET_PARS = `
  uniform float uWetness;
  uniform float uWetY;
  uniform float uWetDarken;
  uniform float uWetRough;
  uniform float uAlwaysWet;
  varying float vShipYWet;

  // How wet this fragment is: everything the sea reached, and the decks always, because
  // in this weather a deck is never dry.
  float wetAmount() {
    return uWetness * max(uAlwaysWet, smoothstep(uWetY + 0.8, uWetY - 1.2, vShipYWet));
  }
`;

export function createMotion(ship, opts = {}) {
  const uniforms = {
    uTime: { value: 0 },
    uWhipWorld: { value: new THREE.Vector3() },
    uWhipExp: { value: S('motion_whip_exponent') },
    uDeckY: { value: 0 },
    uTruckY: { value: 1 },
    uShipRowY: { value: new THREE.Vector4(0, 1, 0, 0) },
    uWindWorld: { value: new THREE.Vector3(0, 0, 1) },
    uWind: { value: 1 },
    uSway: { value: S('motion_rope_sway') },
    uSwayPeriod: { value: S('motion_rope_period') },
    // Sails
    uFlutter: { value: S('motion_sail_flutter') },
    uWaveLength: { value: S('motion_sail_wave_length') },
    uWaveSpeed: { value: S('motion_sail_wave_speed') },
    uBreathe: { value: S('motion_sail_breathe') },
    uLuff: { value: S('motion_sail_luff_shiver') },
    uSailTiles: { value: PAINT.weather_sail_variants.value },
    // Wet
    uWetness: { value: 0 },
    uWetY: { value: 0 },
    uWetDarken: { value: PAINT.wet_darken.value },
    uWetRough: { value: PAINT.wet_roughness.value },
  };

  ship.updateMatrixWorld(true);

  // The two heights everything aloft is scaled between. Taken from the built ship rather
  // than from the spec, because the spec knows how long a topgallant mast is and not
  // where its truck ended up once the mast had been raked.
  const shipBox = new THREE.Box3().setFromObject(ship);
  const truckY = shipBox.max.y;
  const hullGroup = ship.getObjectByName('hull');
  const deckGroup = ship.getObjectByName('decks');
  const deckY = deckGroup ? new THREE.Box3().setFromObject(deckGroup).max.y : 0;
  uniforms.uDeckY.value = deckY;
  uniforms.uTruckY.value = truckY;

  // Where the sea reaches when she is running hard, from the hull's own extent and the
  // spec's wet line.
  if (hullGroup) {
    const hb = new THREE.Box3().setFromObject(hullGroup);
    uniforms.uWetY.value = hb.min.y + PAINT.wet_line_v.value * (hb.max.y - hb.min.y);
  }

  const patched = [];

  /**
   * Patch one mesh's material.
   *
   * The material is cloned first. Materials are cached per level of detail and shared by
   * every ship built at that level, so patching one in place would set a whole fleet
   * shivering to the same wave at the same instant — and would put movement into the
   * material the GLB exporter reads, which has to stay still.
   */
  function patch(mesh, { aloft = false, sail = false, wet = false, alwaysWet = 0, sway = 0 }) {
    const mat = mesh.material.clone();
    const own = { ...uniforms, uSwayFactor: { value: sway }, uAlwaysWet: { value: alwaysWet } };

    mat.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, own);

      // The declarations every branch below needs, assembled once and inserted once, so
      // that nothing here depends on a second search finding an include the first search
      // has already rewritten.
      const vertexPrelude = [
        (aloft || sail || wet) ? 'uniform vec4 uShipRowY;' : '',
        aloft ? ALOFT_GLSL : '',
        sail ? SAIL_PARS : '',
        wet ? WET_PARS : '',
      ].filter(Boolean).join('\n');

      let v = shader.vertexShader.replace('#include <common>', `#include <common>\n${vertexPrelude}`);
      if (sail) v = v.replace('#include <begin_vertex>', `#include <begin_vertex>\n${SAIL_BODY}`);
      if (wet) {
        v = v.replace('#include <project_vertex>',
          '  vShipYWet = dot(uShipRowY, modelMatrix * vec4(transformed, 1.0));\n#include <project_vertex>');
      }
      if (aloft) v = v.replace('#include <project_vertex>', `#include <project_vertex>\n${ALOFT_BODY}`);
      shader.vertexShader = v;

      if (wet) {
        shader.fragmentShader = shader.fragmentShader
          .replace('#include <common>', `#include <common>\n${WET_PARS}`)
          .replace('#include <roughnessmap_fragment>', `#include <roughnessmap_fragment>
            roughnessFactor = mix(roughnessFactor, uWetRough, wetAmount());
          `)
          .replace('#include <color_fragment>', `#include <color_fragment>
            diffuseColor.rgb *= 1.0 - uWetDarken * wetAmount();
          `);
      }
    };

    // Each shape of patch needs its own compiled program. Without a key that says which,
    // three hands the sails the rigging's shader and nothing moves but the rigging.
    const key = `motion:${aloft ? 'a' : ''}${sail ? 's' : ''}${wet ? 'w' : ''}${alwaysWet}:${sway}`;
    mat.customProgramCacheKey = () => key;
    mat.needsUpdate = true;
    mesh.material = mat;
    patched.push(mat);
    return mat;
  }

  // ---------------------------------------------------------------- what moves, and how
  const parts = { flags: [], crew: [], wheel: null };
  const named = (n) => ship.getObjectByName(n);

  const sailNames = new Set(['square_sails', 'fore_and_aft_sails']);
  const runningNames = new Set(['running_rigging_ropes']);
  const ropeNames = new Set(['shrouds_and_stays', 'ratlines']);

  // Everything in the rig and the canvas moves; what differs is how freely. A shroud is
  // set up taut and barely moves; a brace is not and swings several times as far; a spar
  // does not swing at all and only goes where the rig takes it.
  const rig = named('rig');
  if (rig) {
    rig.traverse((o) => {
      if (!(o.isMesh || o.isLine || o.isLineSegments)) return;
      if (sailNames.has(o.name)) patch(o, { aloft: true, sail: true });
      else if (runningNames.has(o.name)) {
        patch(o, { aloft: true, sway: S('motion_running_rope_factor') });
      } else if (ropeNames.has(o.name)) patch(o, { aloft: true, sway: 1 });
      else patch(o, { aloft: true });
    });
  }

  // The hull and everything standing on her deck: no movement of their own, but they get
  // wet. The deck is always wet in this weather; the topsides only where the sea reached.
  for (const name of ['hull', 'decks', 'furniture', 'guns', 'ports', 'boats']) {
    const g = named(name);
    if (!g) continue;
    const always = name === 'decks' ? 1 : 0;
    g.traverse((o) => { if (o.isMesh) patch(o, { wet: true, alwaysWet: always }); });
  }

  // ------------------------------------------------------------------------- the flags
  const flagGroup = named('flags');
  if (flagGroup) {
    for (const o of flagGroup.children) {
      if (!o.isMesh || !o.geometry.userData?.flag) continue;
      parts.flags.push({
        node: o,
        phase: o.geometry.userData.flag.phase,
        home: o.position.clone(),
        f: whipAt(new THREE.Box3().setFromObject(o).max.y, deckY, truckY, uniforms.uWhipExp.value),
      });
    }
  }

  // -------------------------------------------------------------------------- the watch
  const crewGroup = named('crew');
  if (crewGroup) {
    for (const [i, f] of crewGroup.children.entries()) {
      const info = f.userData.crew ?? {};
      const arms = [f.getObjectByName('arm_port'), f.getObjectByName('arm_starboard')].filter(Boolean);
      parts.crew.push({
        node: f,
        home: { position: f.position.clone(), x: f.rotation.x, y: f.rotation.y },
        role: info.role ?? 'deck',
        arms,
        armHome: arms.map((a) => a.rotation.clone()),
        // Each man has a phase of his own, so that thirteen of them do not sway as one.
        phase: i * 1.37,
        f: whipAt(f.position.y, deckY, truckY, uniforms.uWhipExp.value),
      });
    }
  }
  parts.wheel = named('ships_wheel');

  // ------------------------------------------------------------------------ the update
  const whip = new THREE.Vector3();
  const q = new THREE.Quaternion();
  const inv = new THREE.Matrix4();
  let lastHeel = 0;
  let lastTime = 0;
  let wet = 0;

  function update(time, state = {}) {
    const {
      windSpeed = 12,       // metres per second
      windDeg = 150,        // where the wind is going, from dead ahead, turning to starboard
      heel = 0,             // radians, positive to starboard
      pitch = 0,            // radians, positive bow up
      helm = 0,             // -1 hard a-port to +1 hard a-starboard
      spray = 0,            // 0 to 1: a sea has just come aboard
    } = state;
    const dt = Math.min(0.25, Math.max(0, time - lastTime));
    lastTime = time;

    ship.updateMatrixWorld();
    inv.copy(ship.matrixWorld).invert();
    const e = inv.elements;
    uniforms.uShipRowY.value.set(e[1], e[5], e[9], e[13]);
    ship.getWorldQuaternion(q);

    // The wind as a strength the shaders multiply by. A gale is about 22 m/s, which is
    // the weather every amplitude in the spec is written for.
    const w = clamp(windSpeed / 22, 0, 1.6);
    uniforms.uTime.value = time;
    uniforms.uWind.value = w;
    const wr = (windDeg * Math.PI) / 180;
    uniforms.uWindWorld.value.set(Math.sin(wr), 0, -Math.cos(wr)).applyQuaternion(q);

    // The whip: the rig leans away from the roll, lags behind it, and works slowly on its
    // own besides, so that a ship lying quietly is still not perfectly still.
    const rollRate = dt > 0 ? (heel - lastHeel) / dt : 0;
    lastHeel = heel;
    const amp = S('motion_whip_amplitude');
    const own = Math.sin((time * Math.PI * 2) / S('motion_whip_period'));
    whip.set(
      -amp * (Math.sin(heel) * 0.6 + rollRate * S('motion_whip_lag')) - amp * 0.25 * own * w,
      0,
      amp * Math.sin(pitch) * 0.5 + amp * 0.18 * Math.sin(time * 0.9) * w
    );
    // The shaders work in world space; the whip is written in the ship's.
    uniforms.uWhipWorld.value.copy(whip).applyQuaternion(q);

    // Wetness. A sea comes aboard and she dries slowly, which is what makes it read as
    // something that happened rather than as a setting.
    wet = Math.max(clamp(spray, 0, 1), wet - dt / S('motion_wet_dry_seconds'));
    uniforms.uWetness.value = wet;

    // ------------------------------------------------------------------ the flags
    for (const f of parts.flags) {
      f.node.position.set(f.home.x + whip.x * f.f, f.home.y, f.home.z + whip.z * f.f);
      // A flag flies at the wind's speed and not the ship's, so its wave runs on
      // whatever she is doing.
      poseFlag(f.node.geometry, f.phase + time * S('motion_flag_wave_speed') * (0.4 + w));
    }

    // ------------------------------------------------------------------- the wheel
    if (parts.wheel) parts.wheel.rotation.x = -helm * deg(S('motion_helm_throw_deg'));

    // -------------------------------------------------------------------- the watch
    const swayAmp = deg(S('motion_crew_sway_deg'));
    const swayW = (Math.PI * 2) / S('motion_crew_sway_period');
    for (const c of parts.crew) {
      // A man stands upright in the world, not square to a deck that is heeled: what has
      // to be leaned is the ship's tilt, taken off him. His own heading has already been
      // applied, so the tilt is rotated into his frame before it is set — otherwise the
      // men facing aft lean uphill.
      const tiltX = c.home.x - pitch * 0.7 + Math.sin(time * swayW * 0.7 + c.phase) * swayAmp * 0.5;
      const tiltZ = -heel * 0.85 + Math.sin(time * swayW + c.phase) * swayAmp;
      const cy = Math.cos(c.home.y), sy = Math.sin(c.home.y);
      c.node.rotation.x = tiltX * cy - tiltZ * sy;
      c.node.rotation.z = tiltX * sy + tiltZ * cy;

      if (c.role === 'aloft') {
        // A topman goes where the mast goes: he is standing on the thing that is
        // swinging, forty metres up.
        c.node.position.set(
          c.home.position.x + whip.x * c.f,
          c.home.position.y,
          c.home.position.z + whip.z * c.f
        );
      }
      if (c.role === 'helm') {
        // His hands go round with the spokes; his feet do not.
        const reach = -helm * deg(S('motion_helmsman_reach_deg'));
        for (const [i, a] of c.arms.entries()) {
          a.rotation.x = c.armHome[i].x;
          a.rotation.z = c.armHome[i].z + reach;
        }
      }
    }
  }

  function dispose() {
    for (const m of patched) m.dispose();
  }

  return { update, uniforms, parts, dispose };
}
