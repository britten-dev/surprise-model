// The ground tackle. Not built yet — see docs/MODULE-CONTRACT.md.
import * as THREE from 'three';

export function buildGroundTackle(cfg, mats, model, ctx) {
  const group = new THREE.Group();
  group.name = 'ground_tackle';
  return group;
}
