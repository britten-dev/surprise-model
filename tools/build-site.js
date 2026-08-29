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
// The reference folder's prose, but never its images: the photograph is a third party's
// and is not republished, on this site or anywhere else. See reference/README.md.
await copyDir(path.join(ROOT, 'reference'), path.join(DIST, 'reference'),
  (_, e) => e.isDirectory() || e.name.endsWith('.md'));

// three, at the paths the import map already names, so nothing in the source has to
// know it is being deployed. The whole build directory goes, not just three.module.js:
// that file re-exports from three.core.js beside it, and shipping one without the other
// gives a page that loads every module successfully and then does nothing.
const three = path.join(DIST, 'node_modules/three');
await copyDir(
  path.join(ROOT, 'node_modules/three/build'),
  path.join(three, 'build'),
  (_, e) => e.isDirectory() || (e.name.endsWith('.js') && !e.name.includes('.cjs'))
);
await copyDir(
  path.join(ROOT, 'node_modules/three/examples/jsm/controls'),
  path.join(three, 'examples/jsm/controls'),
  (_, e) => e.isDirectory() || e.name === 'OrbitControls.js'
);

// The viewer is the site.
await fs.copyFile(path.join(ROOT, 'viewer/index.html'), path.join(DIST, 'index.html'));

// The exported models, so the deliverable can be fetched from the site rather than only
// rebuilt from the repository. The hero LOD ships in its full-suit state only; all four
// states of it are 34 MB and the viewer can generate any of them live anyway.
try {
  const files = await fs.readdir(path.join(ROOT, 'build'));
  const wanted = files.filter((f) => f.endsWith('.glb')
    && (!f.startsWith('surprise-hero') || f === 'surprise-hero-full.glb'));
  if (wanted.length) {
    await fs.mkdir(path.join(DIST, 'build'), { recursive: true });
    for (const f of [...wanted, 'manifest.json']) {
      try { await fs.copyFile(path.join(ROOT, 'build', f), path.join(DIST, 'build', f)); } catch {}
    }
    console.log(`  ${wanted.length} GLB file(s) included`);
  } else {
    console.log('  no GLB files found — run `npm run build` first if the site should carry them');
  }
} catch {
  console.log('  build/ not present; the site will carry no GLB files');
}

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
