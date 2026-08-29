// The lighting and environment shared by the interactive viewer and the render tool,
// so that what you inspect by hand is what the verification renders show.
import * as THREE from 'three';

export function makeEnvironment(renderer, { studio = false } = {}) {
  const scene = new THREE.Scene();

  // A gradient sky. The reference photo is shot against a warm studio backdrop, so the
  // `studio` variant reproduces that for side-by-side comparison; the sea variant is
  // what the model will actually live in.
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

  // Bright enough for a sunny day, not so bright that everything pale in the ship —
  // the deck, the boats, the canvas — clips to white and loses its colour. Scrubbed
  // deck planking and flax canvas are both warm, and that warmth is most of what makes
  // the ship look like wood and cloth rather than plastic.
  const sun = new THREE.DirectionalLight(0xfff0d6, 2.1);
  sun.position.set(-38, 46, -30);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  const s = 40;
  Object.assign(sun.shadow.camera, { left: -s, right: s, top: s, bottom: -s, near: 1, far: 160 });
  sun.shadow.bias = -0.0008;
  scene.add(sun);

  // Fill from the sky and bounce from the water, which is what stops the black
  // topsides reading as a silhouette.
  scene.add(new THREE.HemisphereLight(studio ? 0xf0dcb4 : 0xbcd4ea, studio ? 0x8a7250 : 0x3c5a68, 0.85));

  const rim = new THREE.DirectionalLight(0xcfe0f0, 0.35);
  rim.position.set(30, 12, 40);
  scene.add(rim);

  scene.environment = new THREE.PMREMGenerator(renderer).fromScene(
    (() => {
      const e = new THREE.Scene();
      e.add(new THREE.Mesh(
        new THREE.SphereGeometry(100, 16, 8),
        new THREE.MeshBasicMaterial({ color: studio ? 0xdcc199 : 0x9fbdd8, side: THREE.BackSide })
      ));
      const l = new THREE.Mesh(
        new THREE.PlaneGeometry(60, 60),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      );
      l.position.set(-20, 40, -20);
      l.lookAt(0, 0, 0);
      e.add(l);
      return e;
    })(),
    0.04
  ).texture;

  return { scene, sun };
}

export function makeSea() {
  const sea = new THREE.Mesh(
    new THREE.PlaneGeometry(1200, 1200, 1, 1),
    new THREE.MeshStandardMaterial({ color: 0x1d3b4a, roughness: 0.16, metalness: 0.0 })
  );
  sea.rotation.x = -Math.PI / 2;
  sea.receiveShadow = true;
  return sea;
}
