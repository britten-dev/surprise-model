// Verification renders. Shoots the named camera stations and writes PNGs, plus the
// side-by-side against the reference photograph.
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { openHarness, ROOT } from './harness.js';

const args = process.argv.slice(2);
const only = args.filter((a) => !a.startsWith('--'));
const lod = (args.find((a) => a.startsWith('--lod=')) || '--lod=hero').split('=')[1];
const sails = (args.find((a) => a.startsWith('--sails=')) || '--sails=full').split('=')[1];
const studio = args.includes('--studio');

const ALL = ['reference', 'bow', 'beam', 'quarter', 'stern', 'masthead', 'deck'];
const views = only.length ? only : ALL;

const h = await openHarness({ page: '/viewer/render.html' });
await fs.mkdir(path.join(ROOT, 'renders'), { recursive: true });

// The reference view is shot against the photograph's warm studio backdrop with no
// sea, so the two images can be laid side by side without the background fighting.
for (const view of views) {
  const asStudio = studio || view === 'reference';
  await h.page.evaluate((o) => window.setup(o), { lod, sails, studio: asStudio, sea: !asStudio });
  const info = await h.page.evaluate(([v]) => window.shoot(v), [view]);
  const el = await h.page.$('#shot');
  const suffix = sails === 'full' && lod === 'hero' ? '' : `-${lod}-${sails}`;
  const file = path.join(ROOT, 'renders', `${view}${suffix}.png`);
  await el.screenshot({ path: file });
  console.log(`${view.padEnd(10)} -> renders/${path.basename(file)}   bbox ${info.size.x.toFixed(1)} x ${info.size.y.toFixed(1)} x ${info.size.z.toFixed(1)} m`);
}

if (h.problems.length) {
  console.log('\npage problems:');
  h.problems.slice(0, 20).forEach((p) => console.log('  ' + p));
}
await h.close();
