import { openHarness } from '../harness.js';
const h = await openHarness();
const out = await h.page.evaluate(() => {
  const THREE = window.THREE;
  const ship = window.build({ lod: 'hero', sails: 'full' });
  ship.updateWorldMatrix(true, true);
  const rows = [];
  ship.traverse((o) => {
    if (!o.isMesh) return;
    const b = new THREE.Box3().setFromObject(o);
    rows.push({ name: o.name || o.type, min: b.min.toArray().map(v=>+v.toFixed(2)), max: b.max.toArray().map(v=>+v.toFixed(2)) });
  });
  return rows.slice(0, 10);
});
console.log(JSON.stringify(out, null, 1));
await h.close();
