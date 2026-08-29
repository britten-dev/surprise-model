// Assemble dist/ for hosting. The viewer builds the ship in the browser from the same
// generator the exporter uses, so the deployed site needs no GLB files and no build of
// the model — it needs the source, the reference photograph, and three.
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { ROOT } from './serve.js';

const DIST = path.join(ROOT, 'dist');

async function copyDir(from, to, filter = () => true) {
  await fs.mkdir(to, { recursive: true });
  for (const entry of await fs.readdir(from, { withFileTypes: true })) {
    const src = path.join(from, entry.name);
    const dst = path.join(to, entry.name);
    if (!filter(src, entry)) continue;
    if (entry.isDirectory()) await copyDir(src, dst, filter);
    else await fs.copyFile(src, dst);
  }
}

await fs.rm(DIST, { recursive: true, force: true });
await fs.mkdir(DIST, { recursive: true });

// The generator and everything it imports.
await copyDir(path.join(ROOT, 'src'), path.join(DIST, 'src'));
await copyDir(path.join(ROOT, 'viewer'), path.join(DIST, 'viewer'));
await copyDir(path.join(ROOT, 'reference'), path.join(DIST, 'reference'));

// Only the two three files the viewer actually imports, at the paths the import map
// already names, so nothing in the source has to know it is being deployed.
const three = path.join(DIST, 'node_modules/three');
await fs.mkdir(path.join(three, 'build'), { recursive: true });
await fs.mkdir(path.join(three, 'examples/jsm/controls'), { recursive: true });
await fs.copyFile(
  path.join(ROOT, 'node_modules/three/build/three.module.js'),
  path.join(three, 'build/three.module.js')
);
await fs.copyFile(
  path.join(ROOT, 'node_modules/three/examples/jsm/controls/OrbitControls.js'),
  path.join(three, 'examples/jsm/controls/OrbitControls.js')
);

// The viewer is the site.
await fs.copyFile(path.join(ROOT, 'viewer/index.html'), path.join(DIST, 'index.html'));

// The documents that explain what the thing is, so the deployed site carries its own
// evidence rather than pointing at a private repository.
await fs.mkdir(path.join(DIST, 'docs'), { recursive: true });
for (const f of ['SPECS.md', 'README.md']) {
  try { await fs.copyFile(path.join(ROOT, f), path.join(DIST, f)); } catch {}
}
await copyDir(path.join(ROOT, 'docs'), path.join(DIST, 'docs'), (_, e) =>
  e.isDirectory() || e.name.endsWith('.md') || e.name.endsWith('.json'));

const count = async (dir) => {
  let n = 0;
  for (const e of await fs.readdir(dir, { withFileTypes: true, recursive: true })) if (e.isFile()) n++;
  return n;
};
console.log(`dist/ built — ${await count(DIST)} files`);
