// The photographed watch keeps its feet and its grip.
//
// Builds the storm ship with the crew from src/ship/crew-assets.js, runs the motion layer
// through a minute of heel, pitch and helm, and asks of every frame:
//
//   - no bone of any man has gone to NaN;
//   - both helmsmen have their hands within 3 cm of the rim;
//   - every man on deck still has his feet within 10 cm of the deck he stands on.
//
//   node tools/check-crew-pose.mjs
import assert from 'node:assert/strict';
import { openHarness } from './harness.js';

const h = await openHarness();
try {
  const report = await h.page.evaluate(async () => {
    const THREE = await import('three');
    const { preloadCrew } = await import('/src/ship/crew-assets.js');
    const { buildShip } = await import('/src/ship/index.js');
    const { createMotion } = await import('/src/ship/motion.js');
    if (!await preloadCrew()) return { loaded: false };
    const ship = buildShip({ lod: 'cinematic', sails: 'storm' });
    const motion = createMotion(ship);
    const crew = ship.getObjectByName('crew');
    const men = crew.children.filter((f) => f.userData.crew?.skinned);
    const foot = new THREE.Vector3();
    let nan = 0, grip = 0, feet = 0, worst = '';
    for (let t = 0; t < 60; t += 0.5) {
      const heel = -.16 + .12 * Math.sin(t * .9), pitch = .05 * Math.sin(t * .6), helm = Math.sin(t * .37);
      ship.rotation.set(pitch, 0, heel, 'YXZ');
      ship.updateMatrixWorld(true);
      motion.update(t, { heel, pitch, helm, windSpeed: 24, windDeg: 155 });
      for (const f of men) {
        f.traverse((o) => { if (o.isBone && !o.quaternion.toArray().every(Number.isFinite)) nan++; });
        if (f.userData.crew.role === 'helm') grip = Math.max(grip, f.userData.crew.gripError ?? 1);
        if (f.userData.crew.role === 'aloft') continue;
        const home = motion.parts.crew.find((c) => c.node === f).home.position;
        for (const name of ['mixamorigLeftToeBase', 'mixamorigRightToeBase']) {
          crew.worldToLocal(f.getObjectByName(name).getWorldPosition(foot));
          const off = Math.abs(foot.y - home.y);
          if (off > feet) { feet = off; worst = `${f.name} at t=${t}`; }
        }
      }
    }
    return { loaded: true, men: men.length, nan, grip, feet, worst };
  });
  assert.ok(report.loaded, 'the crew figures load');
  assert.equal(report.men, 13, 'all thirteen stations use the photographed figures');
  assert.equal(report.nan, 0, 'no bone goes to NaN');
  assert.ok(report.grip < .03, `helmsmen reach the rim (worst ${report.grip.toFixed(3)} m short)`);
  assert.ok(report.feet < .10, `feet stay on the deck (worst ${report.feet.toFixed(3)} m, ${report.worst})`);
  assert.deepEqual(h.problems.filter((p) => p.startsWith('[pageerror]')), []);
  console.log(`crew pose: ${report.men} men, grip within ${(report.grip * 100).toFixed(1)} cm, `
    + `feet within ${(report.feet * 100).toFixed(1)} cm of the deck over a minute of weather`);
} finally { await h.close(); }
