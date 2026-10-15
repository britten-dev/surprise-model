// The photographed carving is on the stern, and nowhere else.
//
// Builds the ship at each level with src/ship/carving-assets.js loaded, and asks:
//
//   - cinematic and hero carry the cartouche and a scroll either side of it, and cinematic
//     two brackets under each quarter gallery (hero keeps its drawn ones), all finite and
//     all facing out;
//   - the cartouche and scrolls lie across the counter, between the heads of the lights
//     and the top of the taffrail and inside the counter's own breadth, and the two scrolls mirror
//     each other;
//   - each bracket stands on its own side of the ship, below its gallery;
//   - the game level, the one phones build, has none of it.
//
//   node tools/check-carvings.mjs
import assert from 'node:assert/strict';
import { openHarness } from './harness.js';

const h = await openHarness({ page: '/viewer/render.html' });
try {
  const report = await h.page.evaluate(async () => {
    const THREE = await import('three');
    const { preloadCarvings } = await import('/src/ship/carving-assets.js');
    const { buildShip } = await import('/src/ship/index.js');
    if (!await preloadCarvings()) return { loaded: false };
    const box = (o) => { const b = new THREE.Box3().setFromObject(o); return { min: b.min.toArray(), max: b.max.toArray() }; };
    const out = {};
    for (const lod of ['cinematic', 'hero', 'game']) {
      const ship = buildShip({ lod, sails: 'full', crew: false });
      ship.updateMatrixWorld(true);
      const find = (name) => { const found = []; ship.traverse((o) => { if (o.name === name) found.push(o); }); return found; };
      const meshes = ['stern_cartouche', 'stern_scroll', 'quarter_gallery_brackets'].flatMap(find);
      // Facing out: the mean normal of each piece points away from the ship's middle.
      const facing = meshes.map((m) => {
        const n = m.geometry.attributes.normal, p = m.geometry.attributes.position, mean = new THREE.Vector3(), c = new THREE.Vector3();
        for (let i = 0; i < p.count; i++) { mean.x += n.getX(i); mean.y += n.getY(i); mean.z += n.getZ(i); c.x += p.getX(i); c.z += p.getZ(i); }
        c.divideScalar(p.count);
        const out = m.name === 'quarter_gallery_brackets' ? Math.sign(c.x) * mean.x : mean.z;
        return { name: m.name, out: out / p.count, finite: p.array.every(Number.isFinite) && n.array.every(Number.isFinite) };
      });
      out[lod] = {
        cartouche: find('stern_cartouche').map(box), scrolls: find('stern_scroll').map(box),
        brackets: find('quarter_gallery_brackets').map(box), facing,
        frames: find('stern_light_frames').map(box), taffrail: find('taffrail').map(box),
        galleries: ['quarter_gallery_starboard', 'quarter_gallery_port'].flatMap(find).map(box),
      };
    }
    return { loaded: true, out };
  });
  assert.ok(report.loaded, 'the carvings load');
  for (const lod of ['cinematic', 'hero']) {
    const r = report.out[lod];
    assert.equal(r.cartouche.length, 1, `${lod}: one cartouche`);
    assert.equal(r.scrolls.length, 2, `${lod}: a scroll either side`);
    assert.equal(r.brackets.length, lod === 'cinematic' ? 2 : 0, `${lod}: photographed brackets on cinematic only`);
    for (const f of r.facing) {
      assert.ok(f.finite, `${lod}: ${f.name} is finite`);
      assert.ok(f.out > 0.05, `${lod}: ${f.name} faces out (${f.out.toFixed(2)})`);
    }
    const lightsTop = r.frames[0].max[1], railTop = r.taffrail[0].max[1], counter = r.frames[0].max[0] + 0.5;
    for (const piece of [...r.cartouche, ...r.scrolls]) {
      assert.ok(piece.min[1] > lightsTop - 0.02 && piece.max[1] < railTop - 0.02,
        `${lod}: the counter's carving lies between the lights and the taffrail (${piece.min[1].toFixed(2)}-${piece.max[1].toFixed(2)})`);
      assert.ok(Math.max(Math.abs(piece.min[0]), Math.abs(piece.max[0])) < counter, `${lod}: inside the counter's breadth`);
    }
    const [a, b] = r.scrolls;
    assert.ok(Math.abs(a.min[0] + b.max[0]) < 0.01 && Math.abs(a.max[1] - b.max[1]) < 0.01, `${lod}: the scrolls mirror each other`);
    for (const bracket of r.brackets) {
      const side = Math.sign(bracket.min[0] + bracket.max[0]);
      const gallery = r.galleries.find((g) => Math.sign(g.min[0] + g.max[0]) === side);
      assert.ok(gallery && bracket.max[1] < gallery.min[1] + 0.1, `${lod}: each bracket is under its own gallery`);
    }
  }
  const g = report.out.game;
  assert.equal(g.cartouche.length + g.scrolls.length + g.brackets.length, 0, 'the game level has none of it');
  console.log(`ok   carvings: cartouche and two scrolls on cinematic and hero, four brackets on cinematic; none on the game level`);
} finally {
  const errors = h.problems.filter((p) => /pageerror/.test(p));
  await h.close();
  assert.deepEqual(errors, [], 'no page errors');
}
