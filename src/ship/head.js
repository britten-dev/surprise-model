// The head. Not built yet — see docs/MODULE-CONTRACT.md.
import * as THREE from 'three';

export function buildHead(cfg, mats, model, ctx) {
  const group = new THREE.Group();
  group.name = 'head';
  return group;
}
