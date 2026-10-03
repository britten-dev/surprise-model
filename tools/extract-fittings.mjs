// Publish the same authored helm furniture without downloading/decoding people.
// No simplification or material conversion; retained vertices are unchanged.
import {NodeIO} from '@gltf-transform/core';
import {ALL_EXTENSIONS} from '@gltf-transform/extensions';
import {MeshoptEncoder,MeshoptDecoder} from 'meshoptimizer';
import {stat} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';

export async function extractFittings() {
  await Promise.all([MeshoptEncoder.ready,MeshoptDecoder.ready]);
  const io=new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
    'meshopt.decoder':MeshoptDecoder,
    'meshopt.encoder':{...MeshoptEncoder,encodeGltfBuffer:(data,count,stride,mode)=>MeshoptEncoder.encodeGltfBuffer(data,count,stride,mode,0)},
  });
  const input=new URL('../src/assets/quarterdeck-detail.glb',import.meta.url);
  const output=new URL('../src/assets/quarterdeck-fittings.glb',import.meta.url);
  const doc=await io.read(fileURLToPath(input)),root=doc.getRoot(),nodes=new Set();
  for(const name of ['authored_wheel','authored_wheel_stand','authored_binnacle']) {
    const node=root.listNodes().find(n=>n.getName()===name);
    assert.ok(node,`Missing fitting ${name}`);node.traverse(n=>nodes.add(n));
  }
  root.listNodes().filter(n=>!nodes.has(n)).forEach(n=>n.dispose());
  const meshes=new Set([...nodes].map(n=>n.getMesh()).filter(Boolean));
  root.listMeshes().filter(m=>!meshes.has(m)).forEach(m=>m.dispose());
  const primitives=root.listMeshes().flatMap(m=>m.listPrimitives());
  const accessors=new Set(primitives.flatMap(p=>[p.getIndices(),...p.listAttributes()]));
  const materials=new Set(primitives.map(p=>p.getMaterial()));
  root.listMaterials().filter(m=>!materials.has(m)).forEach(m=>m.dispose());
  root.listAccessors().filter(a=>!accessors.has(a)).forEach(a=>a.dispose());
  const textures=new Set([...materials].flatMap(m=>[m.getBaseColorTexture(),m.getNormalTexture(),
    m.getMetallicRoughnessTexture(),m.getOcclusionTexture(),m.getEmissiveTexture()]));
  root.listTextures().filter(t=>!textures.has(t)).forEach(t=>t.dispose());
  const before=primitives.map(p=>p.getAttribute('POSITION').getArray().slice());
  await io.write(fileURLToPath(output),doc);
  const readback=await io.read(fileURLToPath(output));
  const after=readback.getRoot().listMeshes().flatMap(m=>m.listPrimitives());
  assert.equal(after.length,before.length);
  after.forEach((p,i)=>{
    const a=p.getAttribute('POSITION').getArray(),b=before[i];
    assert.ok(a.length===b.length&&a.every((v,j)=>v===b[j]),`Fitting ${i} changed shape`);
  });
  assert.equal(readback.getRoot().listNodes().some(n=>/authored_(seaman|officer|oilskin|captain)/.test(n.getName())),false);
  console.log(JSON.stringify({inputBytes:(await stat(input)).size,fittingsBytes:(await stat(output)).size,
    meshes:meshes.size,triangles:primitives.reduce((n,p)=>n+p.getIndices().getCount()/3,0),textures:textures.size}));
}
if(process.argv[1]===fileURLToPath(import.meta.url))await extractFittings();
