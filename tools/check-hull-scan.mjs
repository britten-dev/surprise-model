// The photographed planking, copper and spar grain change the finish and nothing else.
//
// Builds the hull's materials before and after src/ship/hull-scan.js has loaded, and asks:
//
//   - the scan loads, and the cinematic hull is the scanned one;
//   - every band keeps the colour the spec gives it: row by row down the cinematic hull map,
//     the scanned paint averages within a few grey levels of the drawn paint, so black
//     stays black and ochre stays ochre;
//   - the scan shows: the planking and the copper both carry more fine variation than
//     the drawing did;
//   - the spars keep the spec's bright varnish and black, and the scan shows on them too;
//   - the game level, the one phones build, is pixel for pixel what it was.
//
//   node tools/check-hull-scan.mjs
import assert from 'node:assert/strict';
import { openHarness } from './harness.js';

// render.html, because harness.html preloads the scan before anything can be built without it.
const h = await openHarness({ page: '/viewer/render.html' });
try {
  const report = await h.page.evaluate(async () => {
    const { makeMaterials } = await import('/src/ship/materials.js');
    const { lodConfig } = await import('/src/ship/lod.js');
    const { preloadHullScan } = await import('/src/ship/hull-scan.js');
    const { V } = await import('/src/ship/hull.js');
    const { sparMaterials } = await import('/src/ship/spar-finish.js');
    const { PAINT } = await import('/src/spec/spec.js');
    const pixels = (texture) => {
      const { width, height } = texture.image;
      if (!width || !height) throw new Error('texture has no canvas');
      const c = document.createElement('canvas'); c.width = width; c.height = height;
      const g = c.getContext('2d', { willReadFrequently: true });
      g.drawImage(texture.image, 0, 0);
      return { width, height, data: g.getImageData(0, 0, width, height).data };
    };
    // Each row's mean colour, and how much it changes from one pixel to the next along
    // the row: the mean is the band's paint, the change is the grain, scratches and mottle.
    const rows = ({ width, height, data }) => Array.from({ length: height }, (_, y) => {
      const sum = [0, 0, 0]; let fine = 0, last = null;
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        for (let c = 0; c < 3; c++) sum[c] += data[i + c];
        const l = data[i] * .299 + data[i + 1] * .587 + data[i + 2] * .114;
        if (last !== null) fine += Math.abs(l - last);
        last = l;
      }
      return { mean: sum.map((s) => s / width), fine: fine / (width - 1) };
    });
    const hash = ({ data }) => { let a = 0; for (let i = 0; i < data.length; i += 7) a = (a * 31 + data[i]) >>> 0; return a; };
    const build = (lod) => makeMaterials.uncached(lodConfig(lod));

    // A spar map's mean colour and its fine detail across the grain, as for the hull rows.
    const spar = (texture) => {
      const r = rows(pixels(texture));
      return { mean: [0, 1, 2].map((c) => r.reduce((t, row) => t + row.mean[c], 0) / r.length), fine: r.reduce((t, row) => t + row.fine, 0) / r.length };
    };
    const spars = (finish) => ({ bright: spar(finish.bright.map), black: spar(finish.black.map) });
    const drawnSpars = spars(sparMaterials(lodConfig('cinematic')));
    const drawnCinematic = build('cinematic'), drawnGame = build('game');
    const before = { cin: rows(pixels(drawnCinematic.hull.map)), game: hash(pixels(drawnGame.hull.map)) };
    const loaded = await preloadHullScan();
    const scannedCinematic = build('cinematic'), scannedGame = build('game');
    const scannedSpars = spars(sparMaterials(lodConfig('cinematic')));
    const after = { cin: rows(pixels(scannedCinematic.hull.map)), game: hash(pixels(scannedGame.hull.map)) };

    const size = before.cin.length;
    const copperFirstRow = Math.round((1 - (V.waterline + PAINT.copper_line_above_wl_v.value)) * size);
    const spread = { plank: [0, 0], copper: [0, 0] };
    for (let y = 0; y < size; y++) {
      const part = y >= copperFirstRow ? 'copper' : 'plank';
      spread[part][0] += before.cin[y].fine; spread[part][1] += after.cin[y].fine;
    }
    // The bands, read off the paint strip: runs of rows painted one colour, less a tenth
    // at each edge where the strip's softened step and the weathering bands sit.
    const paint = pixels(scannedCinematic.hullPaint);
    const colourAt = (y) => { const i = Math.round(y * paint.height / size) * paint.width * 4; return [paint.data[i], paint.data[i + 1], paint.data[i + 2]]; };
    const bands = [];
    for (let y = 0, start = 0; y <= size; y++) {
      if (y < size && Math.max(...colourAt(y).map((v, c) => Math.abs(v - colourAt(start)[c]))) <= 3) continue;
      const trim = Math.ceil((y - start) / 10);
      if (y - start > 20) bands.push([start + trim, y - trim, colourAt(start)]);
      start = y;
    }
    const average = (r, a, b) => [0, 1, 2].map((c) => { let t = 0; for (let y = a; y < b; y++) t += r[y].mean[c]; return t / (b - a); });
    let worst = { delta: 0 };
    for (const [a, b, colour] of bands) {
      const was = average(before.cin, a, b), now = average(after.cin, a, b);
      const delta = Math.max(...now.map((m, c) => Math.abs(m - was[c])));
      if (delta >= worst.delta) worst = { delta, rows: [a, b], paint: colour, before: was.map(Math.round), after: now.map(Math.round) };
    }
    return {
      loaded, worst, spread, bands: bands.length, spars: { drawn: drawnSpars, scanned: scannedSpars },
      finish: [drawnCinematic.hull.userData.hullFinish, scannedCinematic.hull.userData.hullFinish, scannedGame.hull.userData.hullFinish],
      gameSame: before.game === after.game,
    };
  });
  assert.ok(report.loaded, 'the hull scan loads');
  assert.deepEqual(report.finish, ['caulked-timber-v3', 'scanned-timber-v1', 'caulked-timber-v3'], 'cinematic is scanned, game is not');
  assert.ok(report.bands >= 5, `the paint strip has its bands (${report.bands})`);
  assert.ok(report.worst.delta <= 6, `every band keeps its paint: worst ${JSON.stringify(report.worst)}`);
  for (const part of ['plank', 'copper']) {
    const [drawn, scanned] = report.spread[part];
    assert.ok(scanned > drawn * 1.1, `${part}: the scan shows (fine detail ${drawn.toFixed(0)} drawn, ${scanned.toFixed(0)} scanned)`);
  }
  for (const kind of ['bright', 'black']) {
    const { drawn, scanned } = { drawn: report.spars.drawn[kind], scanned: report.spars.scanned[kind] };
    const delta = Math.max(...scanned.mean.map((m, c) => Math.abs(m - drawn.mean[c])));
    assert.ok(delta <= 6, `${kind} spars keep their colour (${drawn.mean.map(Math.round)} drawn, ${scanned.mean.map(Math.round)} scanned)`);
  }
  assert.ok(report.spars.scanned.bright.fine > 0.5, `the spar grain shows (${report.spars.scanned.bright.fine.toFixed(2)})`);
  assert.ok(report.gameSame, 'the game level hull is unchanged');
  console.log(`ok   hull scan: ${report.bands} bands within ${report.worst.delta.toFixed(1)} grey levels; `
    + `fine detail planks ${report.spread.plank.map((v) => v.toFixed(0)).join(' -> ')}, `
    + `copper ${report.spread.copper.map((v) => v.toFixed(0)).join(' -> ')}; `
    + `spars ${report.spars.drawn.bright.mean.map(Math.round)} -> ${report.spars.scanned.bright.mean.map(Math.round)}; game level unchanged`);
} finally {
  const errors = h.problems.filter((p) => /pageerror/.test(p));
  await h.close();
  assert.deepEqual(errors, [], 'no page errors');
}
