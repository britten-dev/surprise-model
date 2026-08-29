// The furniture. Not built yet — see docs/MODULE-CONTRACT.md.
import * as THREE from 'three';

export function buildFurniture(cfg, mats, model, ctx) {
  const group = new THREE.Group();
  group.name = 'furniture';
  return group;
}
