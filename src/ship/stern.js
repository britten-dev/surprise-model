// The stern. Not built yet — see docs/MODULE-CONTRACT.md.
import * as THREE from 'three';

export function buildStern(cfg, mats, model, ctx) {
  const group = new THREE.Group();
  group.name = 'stern';
  return group;
}
