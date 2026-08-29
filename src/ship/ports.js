// The gunports. A port is a rectangle in the hull's own surface coordinates — it spans
// a known band of V, between the sill and the head, at a known station — so the ports
// are cut by dropping faces out of the loft grid rather than by boolean subtraction.
// That gives a genuine opening through the ship's side for the price of an index test.
//
// Each opening then gets a lining (red, as the inboard works were), a sill and a lid
// hinged above it.
import * as THREE from 'three';
import { SPEC } from '../spec/spec.js';
import { V } from './hull.js';
import { mergeGeometries } from '../util/loft.js';
import { block } from '../util/solids.js';
import { audit } from '../audit/measure.js';

/**
 * Where every port sits. Positions are `z` in model space; each port also carries the
 * V band it occupies, which is what the lofter tests against.
 */
export function portLayout(model) {
  const ports = [];
  const n = SPEC.gunport_count_per_side.value;
  const spacing = SPEC.gunport_spacing.value;
  const first = model.fromStem(SPEC.gunport_first_from_stem.value);

  for (let i = 0; i < n; i++) {
    ports.push({
      kind: 'gundeck',
      index: i,
      z: first + i * spacing,
      width: SPEC.gunport_width.value,
      v0: V.port_sill,
      v1: V.port_head,
    });
  }
  return ports;
}

/**
 * The predicate the lofter uses. A quad is dropped when its station falls inside a
 * port's width and its V band falls inside the port's opening.
 */
export function makePortCutter(model, ports) {
  return (z, vA, vB) => {
    if (vB <= V.port_sill || vA >= V.port_head) return false;
    for (const p of ports) {
      if (Math.abs(z - p.z) <= p.width / 2) {
        // Only cut the middle of the V band, so a rim of hull is left as the sill and
        // the head of the port rather than the opening running edge to edge.
        return vA >= p.v0 && vB <= p.v1;
      }
    }
    return false;
  };
}

/**
 * The joinery round each opening: the lining that shows red from outside, and the lid.
 * At the distant LOD none of this is built — the opening alone reads as a port.
 */
export function buildPorts(cfg, mats, model, ports) {
  const group = new THREE.Group();
  group.name = 'gunports';
  if (!cfg.portLids && cfg.deckFurniture === 'none') return group;

  const linings = [];
  const lids = [];
  const w = SPEC.gunport_width.value;
  const h = SPEC.gunport_height.value;
  const depth = SPEC.gunport_lining_depth.value;

  for (const p of ports) {
    for (const side of [1, -1]) {
      const f = model.featureYAt(p.z);
      const sill = model.pointAt(p.z, 'port_sill', side);
      const head = model.pointAt(p.z, 'port_head', side);

      // The side leans inboard as it rises, so the lining has to be tilted to match or
      // it stands proud of the planking at one edge and sinks into it at the other.
      const lean = Math.atan2(Math.abs(sill.x) - Math.abs(head.x), head.y - sill.y) * side;

      // The lining plugs the opening from inboard. It is deliberately a little smaller
      // than the hole and set well inside it, so what shows through the port is red
      // painted timber in shadow — which is what a gunport looks like from outboard.
      const lining = new THREE.Mesh(
        new THREE.BoxGeometry(depth * 1.6, h * 0.97, w * 0.97),
        mats.red
      );
      lining.position.set(
        (Math.abs(sill.x) + Math.abs(head.x)) / 2 * side - depth * 0.95 * side,
        (sill.y + head.y) / 2,
        p.z
      );
      lining.rotation.z = lean;
      linings.push(lining);

      if (cfg.portLids) {
        // The lid, hinged along its top edge and hanging open above the port, which is
        // how a ship with her guns run out actually looks.
        const lid = new THREE.Mesh(
          new THREE.BoxGeometry(SPEC.gunport_lid_thickness.value, h, w),
          mats.black
        );
        const pivot = new THREE.Group();
        pivot.position.set(Math.abs(head.x) * side, f.port_head, p.z);
        pivot.rotation.z = lean;
        lid.position.set(0, h / 2, 0);
        lid.rotation.z = 0;
        // Swung up and outboard by 70 degrees.
        const swing = new THREE.Group();
        swing.rotation.x = 0;
        swing.rotation.z = side * -(70 * Math.PI) / 180;
        swing.add(lid);
        pivot.add(swing);
        lids.push(pivot);
      }
    }
  }

  const liningGeom = mergeGeometries(linings.map((mL) => {
    const g = mL.geometry.clone();
    mL.updateMatrix();
    g.applyMatrix4(mL.matrix);
    return g;
  }));
  const liningMesh = new THREE.Mesh(liningGeom, mats.red);
  liningMesh.name = 'port_linings';
  audit(liningMesh, 'gunport_count_per_side', 'count', { tolerance: 0.001 });
  liningMesh.userData.count = ports.length;
  group.add(liningMesh);

  for (const l of lids) group.add(l);
  return group;
}
