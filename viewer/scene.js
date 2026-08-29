// The lighting and environment shared by the interactive viewer and the render tool,
// so that what you inspect by hand is what the verification renders show.
//
// Two rigs, one target appearance. `studio` reproduces the warm backdrop and warm key of
// the reference photograph so that the reference render and the photograph can be laid
// side by side. The sea rig is where the ship will actually live, and it is tuned to land
// on the same appearance rather than on a physically blue one — the photograph's sunlit
// canvas samples #ddd6c4 and its shaded canvas #a89880, and the sea rig is set so that it
// does too. That is the whole point of this file. A blue sky fill and a blue environment
// turn flax canvas sage, oak grey, ochre paint cream and copper cold, and the ship stops
// reading as wood and cloth and starts reading as plastic.
//
// Every number here is a row in PAINT in the spec, where it carries its source.
import * as THREE from 'three';
import { PAINT } from '../src/spec/spec.js';

const col = (key) => new THREE.Color(PAINT[key].hex);
const num = (key) => PAINT[key].value;

/**
 * Put a light at an azimuth and elevation round the ship. Azimuth is measured the way
 * `viewer/views.js` measures a camera station — 0 dead ahead, 90 on the starboard beam,
 * 270 on the port beam — so a light and a camera can be talked about in the same terms.
 */
function place(object, azimuthDeg, elevationDeg, distance) {
  const a = (azimuthDeg * Math.PI) / 180;
  const e = (elevationDeg * Math.PI) / 180;
  object.position.set(
    Math.sin(a) * Math.cos(e) * distance,
    Math.sin(e) * distance,
    -Math.cos(a) * Math.cos(e) * distance
  );
}

/**
 * The sun, and its shadow.
 *
 * three's PCFSoftShadowMap ignores `shadow.radius`: the soft branch of its shader takes a
 * fixed bilinear tap pattern one texel wide, so however large a radius is asked for the
 * edge stays one texel wide and a shroud's shadow on the water comes out as a hard jagged
 * line. Softness therefore cannot be asked for — it has to be built, by giving the sun a
 * finite size the way the real one has. `shadow_taps` lights share the key's intensity
 * round a small ring, each casting its own shadow. Close to an occluder every tap agrees
 * and the shadow stays sharp; far from it they disagree and the edge opens into a
 * penumbra. So a gun's shadow on the deck stays crisp while the shadow of the sail plan
 * on the sea, thrown from forty metres up, goes soft.
 *
 * Returns the centre light, which is the one to move if you want to move the sun.
 */
function sunRig(scene, { azimuth, elevation }) {
  const taps = Math.max(1, Math.round(num('shadow_taps')));
  const spread = num('shadow_spread_deg');
  const size = num('shadow_map_size');
  const extent = num('shadow_extent');
  const distance = num('sun_distance');
  const colour = col('sun_colour');
  const each = num('sun_intensity') / taps;

  let centre = null;
  for (let i = 0; i < taps; i++) {
    const light = new THREE.DirectionalLight(colour, each);
    // The ring is drawn on the sky, where a step in azimuth subtends less angle the
    // higher the sun stands; dividing by the cosine keeps the ring circular.
    const phi = (i / taps) * Math.PI * 2;
    const dAz = taps > 1 ? (Math.cos(phi) * spread) / Math.cos((elevation * Math.PI) / 180) : 0;
    const dEl = taps > 1 ? Math.sin(phi) * spread : 0;
    place(light, azimuth + dAz, elevation + dEl, distance);

    light.castShadow = true;
    light.shadow.mapSize.set(size, size);
    Object.assign(light.shadow.camera, {
      left: -extent, right: extent, top: extent, bottom: -extent,
      near: 1, far: distance * 2.4,
    });
    light.shadow.bias = num('shadow_bias');
    // Offsetting the sample along the surface normal is what kills the self-shadowing
    // acne on the sails and the topsides, and it does it without detaching a shadow from
    // the thing casting it the way a large depth bias does.
    light.shadow.normalBias = num('shadow_normal_bias');
    scene.add(light);
    if (i === 0) centre = light;
  }
  return centre;
}

export function makeEnvironment(renderer, { studio = false } = {}) {
  const scene = new THREE.Scene();

  // A gradient sky. The reference photo is shot against a warm studio backdrop, so the
  // `studio` variant reproduces that for side-by-side comparison; the sea variant is
  // what the model will actually live in. This is only the backdrop — what lights the
  // ship is the rig below, not the sky mesh.
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(400, 32, 16),
    new THREE.ShaderMaterial({
      side: THREE.BackSide,
      uniforms: {
        top: { value: new THREE.Color(studio ? 0xd8b98a : 0x7ba4cc) },
        bottom: { value: new THREE.Color(studio ? 0xe8d3ad : 0xcdd9e2) },
      },
      vertexShader: `varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
      fragmentShader: `
        uniform vec3 top; uniform vec3 bottom; varying vec3 vP;
        void main(){
          float h = clamp(vP.y / 400.0 * 0.5 + 0.5, 0.0, 1.0);
          gl_FragColor = vec4(mix(bottom, top, pow(h, 0.8)), 1.0);
        }`,
    })
  );
  scene.add(sky);

  const sun = sunRig(scene, {
    azimuth: num(studio ? 'studio_sun_azimuth_deg' : 'sea_sun_azimuth_deg'),
    elevation: num(studio ? 'studio_sun_elevation_deg' : 'sea_sun_elevation_deg'),
  });

  // Fill from the sky and bounce from below, which is what stops the black topsides
  // reading as a silhouette. Weak, and warm at the top: the part of a sunny sky a ship's
  // side actually sees is the haze near the horizon, not the blue of the zenith.
  scene.add(new THREE.HemisphereLight(
    col(studio ? 'studio_sky_colour' : 'sea_sky_colour'),
    col(studio ? 'studio_floor_colour' : 'sea_water_colour'),
    num(studio ? 'studio_fill_intensity' : 'sea_fill_intensity')
  ));

  // One cool edge from the opposite quarter, to lift the black topsides off a dark sea.
  // This is the only blue left in the sea rig, and it lands on the side away from the sun
  // where blue is what the eye expects to see.
  const rim = new THREE.DirectionalLight(col('rim_colour'), num('rim_intensity'));
  place(rim, num('rim_azimuth_deg'), num('rim_elevation_deg'), num('sun_distance'));
  scene.add(rim);

  // What the metals reflect. The copper sheathing has no diffuse colour at all — it is
  // metal, so everything seen of it is this environment tinted copper — which is why a
  // blue environment makes the bottom of the ship read cold, and why the bright card in
  // it matters: it is the highlight the sheets catch.
  scene.environment = new THREE.PMREMGenerator(renderer).fromScene(
    (() => {
      const e = new THREE.Scene();
      e.add(new THREE.Mesh(
        new THREE.SphereGeometry(100, 16, 8),
        new THREE.MeshBasicMaterial({
          color: col(studio ? 'studio_env_colour' : 'sea_env_colour'),
          side: THREE.BackSide,
        })
      ));
      const extent = num('env_sun_extent');
      const disc = new THREE.Mesh(
        new THREE.PlaneGeometry(extent, extent),
        new THREE.MeshBasicMaterial({ color: col('env_sun_colour') })
      );
      place(disc, num(studio ? 'studio_sun_azimuth_deg' : 'sea_sun_azimuth_deg'),
        num('env_sun_elevation_deg'), 55);
      disc.lookAt(0, 0, 0);
      e.add(disc);
      return e;
    })(),
    0.04
  ).texture;

  return { scene, sun };
}

export function makeSea() {
  // The water is deliberately held back from the environment. The environment had to be
  // warmed for the ship's sake — copper and gilt see nothing else — and a mirror-smooth
  // sea at full environment strength answers that by turning the sun's path across it
  // into a wall of white.
  const sea = new THREE.Mesh(
    new THREE.PlaneGeometry(1200, 1200, 1, 1),
    new THREE.MeshStandardMaterial({
      color: col('sea_surface_colour'),
      roughness: num('sea_surface_roughness'),
      metalness: 0.0,
      envMapIntensity: num('sea_surface_env_intensity'),
    })
  );
  sea.rotation.x = -Math.PI / 2;
  sea.receiveShadow = true;
  return sea;
}
