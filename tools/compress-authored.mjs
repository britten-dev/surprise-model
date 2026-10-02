// Compress the browser copy; the Blender workshop remains the editable original.
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS, EXTMeshoptCompression } from '@gltf-transform/extensions';
import { MeshoptEncoder, MeshoptDecoder } from 'meshoptimizer';
import sharp from 'sharp';
import { readFile, copyFile, stat } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

export async function compressAuthored() {
  await Promise.all([MeshoptEncoder.ready,MeshoptDecoder.ready]);
  const target=new URL('../src/assets/quarterdeck-detail.glb',import.meta.url);
  const raw=new URL('../build/quarterdeck-detail-uncompressed.glb',import.meta.url);
  await copyFile(target,raw);
  const io=new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
    'meshopt.encoder': {...MeshoptEncoder,
      // Version zero is compatible with the decoder bundled with Three 0.180.
      encodeGltfBuffer:(data,count,stride,mode)=>MeshoptEncoder.encodeGltfBuffer(data,count,stride,mode,0)},
    'meshopt.decoder':MeshoptDecoder,
  });
  const doc=await io.readBinary(await readFile(raw));
  const primitives=doc.getRoot().listMeshes().flatMap(m=>m.listPrimitives());
  const colours=primitives.map(p=>p.getAttribute('COLOR_0'));
  assert.ok(colours.every(Boolean),'Every authored surface carries contact shading');
  assert.ok(colours.some(c=>{
    const a=c.getArray(),full=a instanceof Uint16Array?65535:a instanceof Uint8Array?255:1;
    return a.some((x,i)=>i%4!==3 && x<full*.99);
  }),'Contact shading is not an empty white attribute');
  const originalPositions=primitives.map(p=>p.getAttribute('POSITION').getArray().slice());
  const materials=doc.getRoot().listMaterials();
  const dataMaps=new Set(materials.flatMap(m=>[m.getNormalTexture(),m.getMetallicRoughnessTexture(),m.getOcclusionTexture()]));
  for(const texture of new Set(materials.map(m=>m.getBaseColorTexture()).filter(Boolean))){
    if(dataMaps.has(texture)) continue;
    const jpeg=await sharp(texture.getImage()).jpeg({quality:94,chromaSubsampling:'4:4:4'}).toBuffer();
    if(jpeg.length<texture.getImage().length) texture.setImage(jpeg).setMimeType('image/jpeg');
  }
  // No quantization transform: vertex positions remain bit-for-bit unchanged.
  doc.createExtension(EXTMeshoptCompression).setRequired(true)
    .setEncoderOptions({method:EXTMeshoptCompression.EncoderMethod.QUANTIZE});
  const output=await io.writeBinary(doc);
  const decoded=await io.readBinary(output);
  const decodedPrimitives=decoded.getRoot().listMeshes().flatMap(m=>m.listPrimitives());
  assert.equal(decodedPrimitives.length,primitives.length);
  decodedPrimitives.forEach((p,i)=>assert.deepEqual(p.getAttribute('POSITION').getArray(),originalPositions[i]));
  // io.write recompresses this same source once, never an already-compressed file.
  const { writeFile }=await import('node:fs/promises');
  await writeFile(target,output);
  console.log(`Browser detail compressed: ${(await stat(raw)).size} -> ${output.length} bytes; all ${primitives.length} mesh positions preserved exactly.`);
}

if(process.argv[1]===fileURLToPath(import.meta.url)) await compressAuthored();
