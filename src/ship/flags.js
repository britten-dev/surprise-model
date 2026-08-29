// The flags. Not built yet — see docs/MODULE-CONTRACT.md.
import * as THREE from 'three';

export function buildFlags(cfg, mats, model, ctx) {
  const group = new THREE.Group();
  group.name = 'flags';
  return group;
}
