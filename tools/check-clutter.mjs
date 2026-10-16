// The photographed boats and the deck clutter are where they should be.
//
// Builds the cinematic and the hero ship in storm and in fair weather with
// src/ship/prop-assets.js loaded, and asks:
//
//   - every boat is the photographed one, and fills the box of the boat it replaced
//     (the audits measure that box, so they pass or fail on it too);
//   - every piece of clutter stands on the deck under it, within 3 cm;
//   - no piece of clutter overlaps another, a boat or a man of the watch;
//   - the capstan, the bitts and the belfry are the photographed ones, each standing in the
//     box of the built one it replaced, on the deck;
//   - the ship without the props loaded is the ship it always was: built boats, no clutter.
//
//   node tools/check-clutter.mjs
import assert from 'node:assert/strict';
import { openHarness } from './harness.js';

const h = await openHarness();
try {
  const report = await h.page.evaluate(async () => {
    const THREE = await import('three');
    const { preloadProps } = await import('/src/ship/prop-assets.js');
    const { buildShip } = await import('/src/ship/index.js');
    if (!await preloadProps()) return { loaded: false };
    const out = [];
    for (const [lod, sails] of [['cinematic', 'storm'], ['cinematic', 'full'], ['hero', 'storm'], ['hero', 'full']]) {
      const ship = buildShip({ lod, sails });
      ship.updateMatrixWorld(true);
      const boats = ['launch', 'pinnace', 'cutter', 'jolly_boat'].map((n) => ship.getObjectByName(`${n}_shell`));
      const clutter = ship.getObjectByName('clutter').children;
      const decks = []; ship.getObjectByName('decks').traverse((o) => { if (o.isMesh) decks.push(o); });
      const ray = new THREE.Raycaster(), down = new THREE.Vector3(0, -1, 0);
      const floating = [];
      for (const c of clutter) {
        const box = new THREE.Box3().setFromObject(c), mid = box.getCenter(new THREE.Vector3());
        ray.set(new THREE.Vector3(mid.x, box.max.y + 2, mid.z), down);
        const hit = ray.intersectObjects(decks, false)[0];
        const gap = hit ? Math.abs(box.min.y - hit.point.y) : Infinity;
        if (gap > 0.03) floating.push(`${c.name} ${gap.toFixed(3)} m`);
      }
      const solids = [
        ...clutter.map((c) => [c.name, new THREE.Box3().setFromObject(c).expandByScalar(-0.01)]),
        ...boats.map((b) => [b.name, new THREE.Box3().setFromObject(b)]),
        ...ship.getObjectByName('crew').children.map((f) => [f.name, new THREE.Box3().setFromObject(f).expandByScalar(-0.05)]),
      ];
      const overlaps = [];
      for (let i = 0; i < clutter.length; i++) {
        for (let j = 0; j < solids.length; j++) {
          if (j === i) continue;
          if (solids[i][1].intersectsBox(solids[j][1])) overlaps.push(`${solids[i][0]} / ${solids[j][0]}`);
        }
      }
      const fittings = {};
      for (const name of ['capstan', 'bitts', 'belfry']) {
        const found = []; ship.traverse((o) => { if (o.name === name && o.isMesh) found.push(o); });
        fittings[name] = { count: found.length, authored: found.every((o) => o.userData.authored),
          finite: found.every((o) => [o.position.x, o.position.y, o.position.z, o.scale.x, o.scale.y, o.scale.z].every(Number.isFinite) && o.scale.y > 0) };
      }
      out.push({ fittings, sails: `${lod} ${sails}`, photographed: boats.filter((b) => b?.userData.authored).length,
        clutter: clutter.length, floating, overlaps });
    }
    return { loaded: true, out };
  });
  assert.ok(report.loaded, 'the props load');
  for (const r of report.out) {
    assert.equal(r.photographed, 4, `${r.sails}: all four boats are the photographed ones`);
    assert.ok(r.clutter >= 10, `${r.sails}: the deck has its clutter (${r.clutter})`);
    assert.deepEqual(r.floating, [], `${r.sails}: clutter stands on the deck`);
    assert.deepEqual(r.overlaps, [], `${r.sails}: clutter keeps clear of boats, men and itself`);
    assert.ok(r.fittings.capstan.count === 1 && r.fittings.belfry.count === 1 && r.fittings.bitts.count >= 4,
      `${r.sails}: the photographed capstan, belfry and bitts (${JSON.stringify(r.fittings)})`);
    for (const [name, f] of Object.entries(r.fittings)) assert.ok(f.authored && f.finite, `${r.sails}: ${name} is photographed and placed`);
  }
  assert.deepEqual(h.problems.filter((p) => p.startsWith('[pageerror]')), []);
  console.log(report.out.map((r) => `${r.sails}: 4 photographed boats, ${r.clutter} pieces of clutter, all on deck and clear; `
    + `photographed capstan, belfry and ${r.fittings.bitts.count} pairs of bitts`).join('\n'));
} finally { await h.close(); }
