// The ship's carved work, as photographed carvings.
//
// Four pieces made with Meshy and shrunk by tools/compress-carvings.mjs (provenance in
// src/assets/PROVENANCE.md): the cartouche at the middle of the taffrail, a scroll of
// acanthus for either side of it and the bracket under each quarter gallery, all in the
// spec's gilt, and the figurehead in her painter's colours.
//
// The stern's pieces are each in a frame of their own — width along x, height along y,
// centred on both, the flat back on z = 0 — and `bendCarving` lays one onto the ship
// through whatever function maps that frame onto her: src/ship/stern-detail.js bends the
// cartouche and the scrolls round the counter, src/ship/stern.js the brackets onto her
// side. The figurehead stands on her feet at the origin, facing +z, and src/ship/head.js
// sets her up on the knee of the head.
//
// Like the photographed watch and boats they are optional: `preloadCarvings()` has to have
// finished before `buildShip`, and if it has not, the stern keeps its drawn carving.
import * as THREE from 'three';
import { fetchAsset } from './asset-fetch.js';

export const CARVING_NAMES = ['cartouche', 'scroll', 'bracket', 'figurehead'];
const models = new Map();
let pending = null;

export function preloadCarvings() {
  pending ??= (async () => {
    const abort = new AbortController();
    const timeout = setTimeout(() => abort.abort(), 25000);
    try {
      const [{ GLTFLoader }, { MeshoptDecoder }] = await Promise.all([
        import('three/addons/loaders/GLTFLoader.js'),
        import('three/addons/libs/meshopt_decoder.module.js'),
      ]);
      const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
      await Promise.all(CARVING_NAMES.map(async (name) => {
        const bytes = await fetchAsset(new URL(`../assets/carvings/${name}.glb`, import.meta.url), { signal: abort.signal });
        const gltf = await loader.parseAsync(bytes, '');
        const mesh = gltf.scene.getObjectByProperty('isMesh', true);
        mesh.updateWorldMatrix(true, false);
        const geometry = mesh.geometry.clone().applyMatrix4(mesh.matrixWorld);
        geometry.computeBoundingBox();
        const material = mesh.material;
        material.name = `carving_${name}`;
        // Meshy's maps make it solid polished metal, which under an open sky is a lemon-yellow
        // mirror. Worn leaf over gesso is mostly the gesso: the metalness and the sheen of the
        // drawn gilt (src/ship/stern-finishes.js), so the carving and the lettering match.
        // The figurehead is painted wood, and no metal at all.
        material.metalness = name === 'figurehead' ? 0 : .35;
        material.roughness = 1;
        material.envMapIntensity = .65;
        for (const key of ['map', 'normalMap', 'roughnessMap', 'metalnessMap']) {
          if (material[key]) material[key].anisotropy = 4;
        }
        models.set(name, { geometry, material });
      }));
      return true;
    } catch (error) {
      models.clear();
      console.warn('Using the drawn stern carving.', error.message);
      return false;
    } finally { clearTimeout(timeout); }
  })();
  return pending;
}

/**
 * The carving's geometry and material, or null when not loaded or not wanted at this level:
 * hero and cinematic, and only where the level carves that part of her at all — the stern
 * where `sternOrnament` is 'carved', the figurehead where `figurehead` is.
 */
export function carvingModel(name, cfg) {
  if (!cfg || cfg.textureSize < 1024) return null;
  if ((name === 'figurehead' ? cfg.figurehead : cfg.sternOrnament) !== 'carved') return null;
  return models.get(name) ?? null;
}

/**
 * A copy of the carving laid onto the ship. `place(x, y, z)` takes a point in the
 * carving's own frame, already scaled to metres by the caller, and returns where on the
 * ship it goes; it may bend, stretch or mirror. Normals go through the same mapping —
 * by its inverse transpose, measured at each vertex — rather than being worked out
 * again from the triangles, which would put a hard edge along every seam in Meshy's UVs;
 * and where the mapping mirrors, the triangles are turned over so their fronts face out.
 */
export function bendCarving(model, place) {
  const geometry = model.geometry.clone();
  const position = geometry.attributes.position, normal = geometry.attributes.normal;
  const p = new THREE.Vector3(), n = new THREE.Vector3(), at = new THREE.Vector3();
  const J = new THREE.Matrix3(), h = 1e-3;
  let det = 0;
  for (let i = 0; i < position.count; i++) {
    p.fromBufferAttribute(position, i);
    at.copy(place(p.x, p.y, p.z));
    const dx = place(p.x + h, p.y, p.z).sub(at).divideScalar(h);
    const dy = place(p.x, p.y + h, p.z).sub(at).divideScalar(h);
    const dz = place(p.x, p.y, p.z + h).sub(at).divideScalar(h);
    J.set(dx.x, dy.x, dz.x, dx.y, dy.y, dz.y, dx.z, dy.z, dz.z);
    if (i === 0) det = J.determinant();
    if (normal) {
      n.fromBufferAttribute(normal, i).applyMatrix3(J.clone().invert().transpose()).normalize();
      normal.setXYZ(i, n.x, n.y, n.z);
    }
    position.setXYZ(i, at.x, at.y, at.z);
  }
  if (det < 0 && geometry.index) {
    const index = geometry.index.array;
    for (let i = 0; i < index.length; i += 3) { const t = index[i + 1]; index[i + 1] = index[i + 2]; index[i + 2] = t; }
    geometry.index.needsUpdate = true;
  }
  position.needsUpdate = true;
  if (normal) normal.needsUpdate = true;
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  return geometry;
}
