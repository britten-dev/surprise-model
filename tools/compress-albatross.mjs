// The game's albatross, made with Meshy, shrunk and given her joints.
//
// The ship's own Meshy pieces are made and shrunk here, so the game's bird is too, though
// she lives in the game (helmsmans-watch, src/flight/wings.js) and not in this package.
// This takes Meshy's model of a wandering albatross in a flat glide and:
//
//   - turns her to face -z, the game's forward, and sizes her to a 3.3 m span;
//   - tucks her trailing feet in a little closer under the tail;
//   - weights every vertex to the skeleton src/flight/wings.js drives: body, head and
//     tail, and on each side a shoulder, elbow and wrist and ten primaries fanned across
//     the hand — the same joints the drawn bird has, so the same flight poses work. The
//     joint positions go into the model's extras as `rig`, so the game builds its bones
//     where these weights expect them;
//   - shrinks her maps to JPEG (colour 1024, normals 512, roughness 256) and meshopt.
//
// The download lives in build/crew-prototype/meshy/albatross-3q/, which git ignores.
//
//   node tools/compress-albatross.mjs --out ../helmsmans-watch/src/assets/albatross/albatross.glb
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS, EXTMeshoptCompression } from '@gltf-transform/extensions';
import { MeshoptEncoder, MeshoptDecoder } from 'meshoptimizer';
import sharp from 'sharp';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';

const out = process.argv[process.argv.indexOf('--out') + 1];
if (!process.argv.includes('--out') || !out) { console.error('usage: node tools/compress-albatross.mjs --out <file.glb>'); process.exit(1); }
const SOURCE = new URL('../build/crew-prototype/meshy/albatross-3q/albatross-3q.glb', import.meta.url);
const SPAN = 3.3;          // metres, tip to tip; a wanderer is 2.5 to 3.5
const MAX_BYTES = 1.0e6;

await Promise.all([MeshoptEncoder.ready, MeshoptDecoder.ready]);
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
  'meshopt.encoder': { ...MeshoptEncoder,
    // Version zero is compatible with the decoder bundled with Three 0.180.
    encodeGltfBuffer: (data, count, stride, mode) => MeshoptEncoder.encodeGltfBuffer(data, count, stride, mode, 0) },
  'meshopt.decoder': MeshoptDecoder,
});

const raw = await readFile(SOURCE);
const doc = await io.readBinary(raw);
const root = doc.getRoot();
const prims = root.listMeshes().flatMap((m) => m.listPrimitives());
assert.equal(prims.length, 1, 'one mesh');
const prim = prims[0];
const position = prim.getAttribute('POSITION'), normal = prim.getAttribute('NORMAL');
const count = position.getCount(), p = [0, 0, 0], n = [0, 0, 0];

// ---- Her frame. Meshy built her facing +z with her span along x, about 1.9 m across.
// Turn her about the vertical to face -z, size her to SPAN, and put the middle of her wing
// root at z = -0.045 and the middle of her body at y = 0, where the drawn bird has them.
let min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
for (let i = 0; i < count; i++) { position.getElement(i, p); for (let k = 0; k < 3; k++) { min[k] = Math.min(min[k], p[k]); max[k] = Math.max(max[k], p[k]); } }
const S = SPAN / (max[0] - min[0]);
// The wing root: the chord at a fifth of the half-span out from the middle.
let fore = -Infinity, aft = Infinity, low = Infinity, high = -Infinity;
const half = (max[0] - min[0]) / 2;
for (let i = 0; i < count; i++) {
  position.getElement(i, p);
  if (Math.abs(p[0]) > half * 0.17 && Math.abs(p[0]) < half * 0.25) { fore = Math.max(fore, p[2]); aft = Math.min(aft, p[2]); }
  if (Math.abs(p[0]) < half * 0.05) { low = Math.min(low, p[1]); high = Math.max(high, p[1]); }
}
const rootMid = (fore + aft) / 2, bodyMid = (low + high) / 2;
const toBird = ([x, y, z]) => [-x * S, (y - bodyMid) * S, -(z - rootMid) * S - 0.045];
const turn = ([x, y, z]) => [-x, y, -z];
const bird = new Float32Array(count * 3), original = new Float32Array(count * 3);
for (let i = 0; i < count; i++) {
  position.getElement(i, p);
  bird.set(toBird(p), i * 3); original.set(bird.subarray(i * 3, i * 3 + 3), i * 3);
  if (normal) { normal.getElement(i, n); normal.setElement(i, turn(n)); }
}

// ---- Her feet. She holds them trailing back under her tail, as wanderers do, but a little
// low and wide for the chase camera behind her: they are drawn up and in, more the further
// back. The feet are everything under the tail and behind the vent.
const VENT = 0.24, FOOT_TOP = -0.07;
const isFoot = (x, y, z) => z > VENT && y < FOOT_TOP;
const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
for (let i = 0; i < count; i++) {
  const [x, y, z] = bird.subarray(i * 3, i * 3 + 3);
  if (!isFoot(x, y, z)) continue;
  const w = smooth(VENT, VENT + 0.14, z);
  bird[i * 3] = x * (1 - 0.40 * w);
  bird[i * 3 + 1] = y + 0.04 * w;
  bird[i * 3 + 2] = VENT + (z - VENT) * (1 - 0.18 * w);
}
for (let i = 0; i < count; i++) position.setElement(i, Array.from(bird.subarray(i * 3, i * 3 + 3)));

// ---- Her skeleton, in her own frame (metres, forward -z). Each wing's joints are given
// for her right wing, +x; src/flight/wings.js mirrors them for the left.
const tipX = SPAN / 2;
const rig = {
  head: [0, 0.03, -0.36],        // the base of her neck
  tail: [0, 0.02, 0.22],         // her rump
  shoulder: [0.12, 0.05, -0.045],
  elbow: [0.50, 0.04, -0.035],   // from the shoulder
  wrist: [0.42, -0.04, -0.025],  // from the elbow
  primaries: 10,
};
const shoulderX = rig.shoulder[0], elbowX = shoulderX + rig.elbow[0], wristX = elbowX + rig.wrist[0];
// The leading and trailing edge of the hand at each step out along it, to fan the
// primaries across its chord: the outermost primary at the leading edge, the innermost at
// the trailing edge.
const STEP = 0.02, edges = new Map();
for (let i = 0; i < count; i++) {
  const ax = Math.abs(original[i * 3]), z = original[i * 3 + 2];
  if (ax < wristX) continue;
  const k = Math.round(ax / STEP), e = edges.get(k) ?? [Infinity, -Infinity];
  edges.set(k, [Math.min(e[0], z), Math.max(e[1], z)]);
}
const BODY = 0, HEAD = 1, TAIL = 2, wingBase = (side) => (side > 0 ? 3 : 16);
// Bytes, as glTF allows: 29 bones, and weights in 255ths that add up exactly.
const joints = new Uint8Array(count * 4), weights = new Uint8Array(count * 4);
for (let i = 0; i < count; i++) {
  const [x, y, z] = original.subarray(i * 3, i * 3 + 3), ax = Math.abs(x), side = x >= 0 ? 1 : -1;
  const foot = z > VENT && y < FOOT_TOP;
  const influence = new Map();
  const add = (bone, w) => { if (w > 1e-4) influence.set(bone, (influence.get(bone) ?? 0) + w); };
  // Body to wing across the shoulder — only alongside the wing root, so her head, tail and
  // feet stay with her body however hard she flaps.
  const alongRoot = smooth(-0.30, -0.24, z) * (1 - smooth(0.17, 0.23, z));
  const arm = foot ? 0 : smooth(0.10, 0.26, ax) * (1 - (1 - alongRoot) * (1 - smooth(0.26, 0.34, ax)));
  const body = 1 - arm;
  const head = smooth(-0.30, -0.40, z) * (1 - smooth(0.08, 0.14, ax));
  const tail = foot ? 0 : smooth(0.18, 0.30, z) * (1 - smooth(0.12, 0.20, ax));
  add(HEAD, body * head); add(TAIL, body * tail); add(BODY, body * (1 - head - tail));
  // Shoulder to elbow to wrist, as the drawn wing blends them.
  const base = wingBase(side);
  const atElbow = smooth(elbowX - 0.16, elbowX + 0.16, ax), atWrist = smooth(wristX - 0.14, wristX + 0.14, ax);
  add(base, arm * (1 - atElbow)); add(base + 1, arm * atElbow * (1 - atWrist));
  // Beyond the wrist the hand hands over, more and more toward the tip, to the primary
  // whose part of the chord this is.
  const hand = arm * atElbow * atWrist, flex = smooth(wristX + 0.14, tipX, ax) * 0.94;
  add(base + 2, hand * (1 - flex));
  if (flex > 0) {
    const e = edges.get(Math.round(ax / STEP)) ?? [z, z + 1e-3];
    const chord = Math.min(1, Math.max(0, (z - e[0]) / Math.max(1e-3, e[1] - e[0])));
    const f = (1 - chord) * (rig.primaries - 1), j = Math.min(rig.primaries - 2, Math.floor(f)), a = f - j;
    add(base + 3 + j, hand * flex * (1 - a)); add(base + 4 + j, hand * flex * a);
  }
  const top = [...influence].sort((a, b) => b[1] - a[1]).slice(0, 4), total = top.reduce((s, [, w]) => s + w, 0);
  const bytes = top.map(([, w]) => Math.round(w / total * 255));
  bytes[0] += 255 - bytes.reduce((s, v) => s + v, 0);
  top.forEach(([bone], k) => { joints[i * 4 + k] = bone; weights[i * 4 + k] = bytes[k]; });
}
prim.setAttribute('JOINTS_0', doc.createAccessor().setType('VEC4').setArray(joints).setBuffer(position.getBuffer()));
prim.setAttribute('WEIGHTS_0', doc.createAccessor().setType('VEC4').setArray(weights).setNormalized(true).setBuffer(position.getBuffer()));
for (const node of root.listNodes()) node.setTranslation([0, 0, 0]).setRotation([0, 0, 0, 1]).setScale([1, 1, 1]).setExtras({ rig });
for (const mesh of root.listMeshes()) mesh.setName('albatross').setExtras({ rig });
for (const material of root.listMaterials()) material.setName('albatross plumage');

// Colour carries the feathers and gets the pixels; she is seldom close enough for the
// normals to need as many, and the roughness is nearly flat.
const roughness = new Set(root.listMaterials().map((m) => m.getMetallicRoughnessTexture()));
const normals = new Set(root.listMaterials().map((m) => m.getNormalTexture()));
for (const texture of root.listTextures()) {
  const size = roughness.has(texture) ? 256 : normals.has(texture) ? 512 : 1024;
  const jpeg = await sharp(texture.getImage()).resize(size, size, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: roughness.has(texture) ? 82 : 86, chromaSubsampling: '4:4:4' }).toBuffer();
  texture.setImage(jpeg).setMimeType('image/jpeg').setURI('');
  console.log(`  ${roughness.has(texture) ? 'roughness' : normals.has(texture) ? 'normals' : 'colour'} ${size}: ${(jpeg.length / 1e3).toFixed(0)} kB`);
}
doc.createExtension(EXTMeshoptCompression).setRequired(true)
  .setEncoderOptions({ method: EXTMeshoptCompression.EncoderMethod.QUANTIZE });
const output = await io.writeBinary(doc);
assert.ok(output.length < MAX_BYTES, `${output.length} bytes is over budget`);
await mkdir(path.dirname(out), { recursive: true });
await writeFile(out, output);
let under = Infinity; for (let i = 0; i < count; i++) { const [x, y, z] = original.subarray(i * 3, i * 3 + 3); if (z > 0.32 && Math.abs(x) < 0.1 && !isFoot(x, y, z)) under = Math.min(under, y); }
console.log(`  tail underside ${under.toFixed(3)} m`);
let feet = 0; for (let i = 0; i < count; i++) if (isFoot(...original.subarray(i * 3, i * 3 + 3))) feet++;
const size = [0, 1, 2].map((k) => { let a = Infinity, b = -Infinity; for (let i = 0; i < count; i++) { a = Math.min(a, bird[i * 3 + k]); b = Math.max(b, bird[i * 3 + k]); } return (b - a).toFixed(2); });
console.log(`albatross ${(raw.length / 1e6).toFixed(1)} MB -> ${(output.length / 1e6).toFixed(2)} MB, ${count} vertices, `
  + `${prim.getIndices().getCount() / 3} triangles, ${size.join(' x ')} m, ${feet} foot vertices tucked`);
