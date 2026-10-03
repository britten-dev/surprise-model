// Build reproducible Blender assets using the ship's dimensions and credited CC0 head.
import { SPEC } from '../src/spec/spec.js';
import { writeFile, mkdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { compressAuthored } from './compress-authored.mjs';
import { extractFittings } from './extract-fittings.mjs';
const root = fileURLToPath(new URL('../', import.meta.url));
await mkdir(new URL('../build/', import.meta.url), { recursive: true });
await writeFile(new URL('../build/hero-dimensions.json', import.meta.url),
  JSON.stringify(Object.fromEntries(Object.entries(SPEC).map(([k, v]) => [k, v.value])), null, 2));
const blender = process.env.BLENDER_BIN || '/Applications/Blender.app/Contents/MacOS/Blender';
const result = spawnSync(blender, ['--background', '--python-exit-code', '1', '--python', `${root}tools/author-details.py`], {
  cwd: root, stdio: 'inherit',
});
if (result.status !== 0) throw new Error(`Blender asset build failed: ${result.status ?? result.signal}`);
await compressAuthored();
await extractFittings();
