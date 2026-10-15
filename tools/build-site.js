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
const threeSrc = path.join(ROOT, 'node_modules/three/build');
try {
  await fs.access(threeSrc);
} catch {
  throw new Error(
    'node_modules/three is missing, so the viewer would load nothing.\n' +
    'three is a peer dependency of this package, which means `npm install --omit=dev`\n' +
    'does not install it. Install the dev dependencies for a site build.'
  );
}
const three = path.join(DIST, 'node_modules/three');
await copyDir(
  path.join(ROOT, 'node_modules/three/build'),
  path.join(three, 'build'),
  (_, e) => e.isDirectory() || (e.name.endsWith('.js') && !e.name.includes('.cjs'))
);
// The add-ons: every file under examples/jsm that the shipped code imports, and everything
// those files import in turn, worked out from the imports themselves.
//
// This used to be a list written by hand, and that is deliberately gone. The list named
// `OrbitControls.js` exactly, and the day viewer/post.js started importing six modules out
// of `postprocessing/`, and the generator started using RoundedBoxGeometry and GLTFLoader,
// the deployed site broke completely — not gracefully, but with an empty control panel and
// a black canvas, because a failed module import kills the whole script that was going to
// draw the ship. Nothing in the local development server notices: it serves node_modules
// straight off the disk, so the only place the omission exists is the built site.
//
// So nothing here names an add-on. Every `three/addons/` specifier in src/ and viewer/ is
// a starting point, static and dynamic imports alike, and each add-on's own imports are
// followed from there, which is how the passes bring in shaders/ and GLTFLoader brings in
// utils/. A specifier naming a file three does not have stops the build here, rather than
// becoming a 404 on the live site. All of examples/jsm would also work, but it is 14 MB,
// most of it decoders and physics engines nothing here loads.
const JSM = path.join(ROOT, 'node_modules/three/examples/jsm');
const ADDON = /['"]three\/addons\/([^'"]+)['"]/g;
const IMPORT =
  /\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)|\b(?:import|export)\s+(?:[^'";]*?\s+from\s+)?['"]([^'"]+)['"]/g;
const addons = new Map(); // add-on file -> the file that first asked for it
const want = (file, from, spec) => {
  if (addons.has(file)) return;
  addons.set(file, { from, spec });
};
for (const dir of ['src', 'viewer']) {
  for (const e of await fs.readdir(path.join(ROOT, dir), { withFileTypes: true, recursive: true })) {
    if (!e.isFile() || !/\.(m?js|html)$/.test(e.name)) continue;
    const file = path.join(e.parentPath, e.name);
    for (const [spec, rest] of (await fs.readFile(file, 'utf8')).matchAll(ADDON)) {
      want(path.join(JSM, rest), file, spec);
    }
  }
}
// The Map grows while it is walked, which is what follows the imports all the way down.
for (const [file, { from, spec }] of addons) {
  let text;
  try {
    text = await fs.readFile(file, 'utf8');
  } catch {
    throw new Error(`${path.relative(ROOT, from)} imports '${spec}', which three does not have.`);
  }
  // Comments first: three's own documentation shows imports in them.
  text = text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  for (const m of text.matchAll(IMPORT)) {
    const next = m[1] ?? m[2];
    // `three` itself is the build directory, copied whole above.
    if (next.startsWith('three/addons/')) want(path.join(JSM, next.slice(13)), file, next);
    else if (next.startsWith('.')) want(path.resolve(path.dirname(file), next), file, next);
  }
}
for (const file of addons.keys()) {
  const dst = path.join(three, 'examples/jsm', path.relative(JSM, file));
  await fs.mkdir(path.dirname(dst), { recursive: true });
  await fs.copyFile(file, dst);
}
console.log(`  ${addons.size} three add-on file(s) included`);

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
