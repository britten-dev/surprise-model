// The stern's carved work, made small enough to ship.
//
// Three pieces made with Meshy (provenance in src/assets/PROVENANCE.md): the cartouche at
// the middle of the taffrail, a scroll of acanthus for either side of it, and the bracket
// under each quarter gallery. src/ship/stern-detail.js and src/ship/stern.js bend them
// onto the stern, so each is left here in a frame of its own rather than at a size: its
// width along x, its height along y, centred on both, and its flat back on z = 0 with the
// carving standing out towards +z. Meshy hands each one back with its back to -z already;
// the face normals are checked for that rather than trusted.
//
// The maps go to JPEG (colour and normals 512, metal and roughness half that) — none of
// these is ever more than a metre across on the screen's ship — and the colour is moved
// to the spec's gilt, keeping Meshy's worn edges and dark hollows, so the carving and
// the gilt lettering under it are the same gold.
//
// The downloads live in build/crew-prototype/carvings/, which git ignores; the output, in
// src/assets/carvings/, is committed.
//
//   node tools/compress-carvings.mjs
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS, EXTMeshoptCompression } from '@gltf-transform/extensions';
import { MeshoptEncoder, MeshoptDecoder } from 'meshoptimizer';
import sharp from 'sharp';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { PAINT } from '../src/spec/spec.js';

export const CARVINGS = ['cartouche', 'scroll', 'bracket'];
const MAX_BYTES = 800e3;
// The spec's gilt, as the drawn lettering actually shows it: its finish map darkens and
// warms the flat colour, by these gains, measured off a render of the two side by side.
const GILT = [1, 3, 5].map((i) => parseInt(PAINT.gilt.hex.slice(i, i + 2), 16) * [.79, .66, .87][(i - 1) / 2]);

await Promise.all([MeshoptEncoder.ready, MeshoptDecoder.ready]);
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
  'meshopt.encoder': { ...MeshoptEncoder,
    // Version zero is compatible with the decoder bundled with Three 0.180.
    encodeGltfBuffer: (data, count, stride, mode) => MeshoptEncoder.encodeGltfBuffer(data, count, stride, mode, 0) },
  'meshopt.decoder': MeshoptDecoder,
});

const source = new URL('../build/crew-prototype/carvings/', import.meta.url);
const target = new URL('../src/assets/carvings/', import.meta.url);
await mkdir(target, { recursive: true });

for (const name of CARVINGS) {
  const raw = await readFile(new URL(`${name}.glb`, source));
  const doc = await io.readBinary(raw);
  const root = doc.getRoot();
  const prims = root.listMeshes().flatMap((m) => m.listPrimitives());
  assert.equal(prims.length, 1, `${name}: one mesh`);
  const prim = prims[0], position = prim.getAttribute('POSITION'), index = prim.getIndices();
  const count = position.getCount(), p = [0, 0, 0];

  // The flat back: the side with the most surface facing straight out along it.
  const a = [0, 0, 0], b = [0, 0, 0], c = [0, 0, 0];
  let back = 0, front = 0;
  for (let i = 0; i < index.getCount(); i += 3) {
    position.getElement(index.getScalar(i), a); position.getElement(index.getScalar(i + 1), b);
    position.getElement(index.getScalar(i + 2), c);
    const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
    const nz = u[0] * v[1] - u[1] * v[0], area = Math.hypot(u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], nz);
    if (area && nz / area < -0.95) back += area;
    if (area && nz / area > 0.95) front += area;
  }
  assert.ok(back > front * 1.3, `${name}: its flat back faces -z (${back.toFixed(2)} against ${front.toFixed(2)})`);

  const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < count; i++) {
    position.getElement(i, p);
    for (let k = 0; k < 3; k++) { min[k] = Math.min(min[k], p[k]); max[k] = Math.max(max[k], p[k]); }
  }
  const cx = (min[0] + max[0]) / 2, cy = (min[1] + max[1]) / 2;
  for (let i = 0; i < count; i++) {
    position.getElement(i, p);
    position.setElement(i, [p[0] - cx, p[1] - cy, p[2] - min[2]]);
  }
  for (const node of root.listNodes()) node.setTranslation([0, 0, 0]).setRotation([0, 0, 0, 1]).setScale([1, 1, 1]);

  const material = root.listMaterials()[0];
  const colour = material.getBaseColorTexture(), finish = material.getMetallicRoughnessTexture();
  for (const texture of root.listTextures()) {
    let image = sharp(texture.getImage());
    const size = texture === finish ? 256 : 512;
    if (texture === colour) {
      // Every channel scaled so the map's mean is that gilt: the same gold as the lettering,
      // with Meshy's wear and shadow left in it.
      const { channels } = await sharp(texture.getImage()).stats();
      const gain = GILT.map((g, k) => g / Math.max(1, channels[k].mean));
      image = image.removeAlpha().linear(gain, [0, 0, 0]);
    }
    const jpeg = await image.resize(size, size, { fit: 'inside', withoutEnlargement: true })
      // The gold is all in the brightness, so its colour can be halved; a normal map's cannot.
      .jpeg({ quality: texture === finish ? 82 : 86, chromaSubsampling: texture === colour ? '4:2:0' : '4:4:4' }).toBuffer();
    texture.setImage(jpeg).setMimeType('image/jpeg').setURI('');
  }
  material.setName(`carving_${name}`);
  for (const mesh of root.listMeshes()) mesh.setName(`carving_${name}`);

  doc.createExtension(EXTMeshoptCompression).setRequired(true)
    .setEncoderOptions({ method: EXTMeshoptCompression.EncoderMethod.QUANTIZE });
  const output = await io.writeBinary(doc);
  assert.ok(output.length < MAX_BYTES, `${name}: ${output.length} bytes is over budget`);
  await writeFile(new URL(`${name}.glb`, target), output);
  console.log(`${name.padEnd(10)} ${(raw.length / 1e6).toFixed(1)} MB -> ${(output.length / 1e3).toFixed(0)} kB, `
    + `${index.getCount() / 3} triangles, ${max.map((v, i) => (v - min[i]).toFixed(2)).join(' x ')} (Meshy's units)`);
}
