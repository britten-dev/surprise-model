// The guns. Not built yet — see docs/MODULE-CONTRACT.md.
import * as THREE from 'three';

export function buildGuns(cfg, mats, model, ctx) {
  const group = new THREE.Group();
  group.name = 'guns';
  return group;
}
