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
import { audit, audits } from '../audit/measure.js';

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
 *
 * It also records what it actually cut. A hole made by dropping whole faces out of a grid
 * is quantised to that grid: it is never exactly the width of the port, and it is not even
 * centred on it, because the hull's stations are cosine-spaced and bunch toward the ends.
 * That is invisible while the port stands open — what shows through it is red lining
 * either way — and it is the whole problem as soon as a lid has to cover it, which is
 * what a ship in heavy weather needs. So each port comes back knowing the true extent of
 * its own opening, in `cutZ0` and `cutZ1`, and the lid is cut to that.
 */
export function makePortCutter(model, ports) {
  return (zA, zB, vA, vB) => {
    if (vB <= V.port_sill || vA >= V.port_head) return false;
    const zMid = (zA + zB) / 2;
    for (const p of ports) {
      if (Math.abs(zMid - p.z) <= p.width / 2) {
        // Only cut the middle of the V band, so a rim of hull is left as the sill and
        // the head of the port rather than the opening running edge to edge.
        if (!(vA >= p.v0 && vB <= p.v1)) return false;
        p.cutZ0 = Math.min(p.cutZ0 ?? zA, zA);
        p.cutZ1 = Math.max(p.cutZ1 ?? zB, zB);
        return true;
      }
    }
    return false;
  };
}

/**
 * The joinery round each opening: the lining that shows red from outside, and the lid.
 * At the distant LOD none of this is built — the opening alone reads as a port.
 *
 * `ctx.portsShut` decides which way the lids hang, and it is not a detail. A ship
 * running in a gale has her gunports shut and her guns housed: a gundeck port is about
 * two feet above the deck and four above the water amidships, and a frigate carrying that
 * row of holes open in a following sea would fill her gundeck. Twenty-four open ports on
 * a ship under a reefed foresail is the sort of thing that reads as wrong long before
 * anybody can say why.
 */
export function buildPorts(cfg, mats, model, ports, ctx = {}) {
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
        const t = SPEC.gunport_lid_thickness.value;
        // The lid overlaps its opening all round — see gunport_lid_overlap — so it is
        // cut larger than the port and hung so that the overlap falls outside it.
        const ov = SPEC.gunport_lid_overlap.value;
        // Shut, the lid is cut to the hole the lofter actually made and given its overlap
        // on top of that; open, it is the port's own size, because that is what is seen
        // of it hanging above the opening.
        const cutW = (p.cutZ1 ?? p.z + w / 2) - (p.cutZ0 ?? p.z - w / 2);
        const lidW = ctx.portsShut ? Math.max(w, cutW) + ov * 2 : w;
        const lidH = ctx.portsShut ? h + ov * 2 : h;
        const lid = new THREE.Mesh(new THREE.BoxGeometry(t, lidH, lidW), mats.black);
        const pivot = new THREE.Group();
        pivot.position.set(Math.abs(head.x) * side, f.port_head, p.z);
        pivot.rotation.z = lean;
        const swing = new THREE.Group();

        if (ctx.portsShut) {
          // Shut: hinged along its top edge and hanging down over the opening, lying
          // against the outside of the planking rather than sitting flush in the hole.
          // Hung from the hinge at the port head so that its top edge stands `ov` above
          // the opening and its foot the same below the sill.
          const cutMid = ((p.cutZ0 ?? p.z - w / 2) + (p.cutZ1 ?? p.z + w / 2)) / 2;
          lid.position.set(
            side * (t / 2 + SPEC.gunport_lid_closed_proud.value),
            -h / 2,
            cutMid - p.z
          );
        } else {
          // Open: swung up and outboard by seventy degrees on its hinges, which is how a
          // ship with her guns run out actually looks.
          lid.position.set(0, h / 2, 0);
          swing.rotation.z = side * -(70 * Math.PI) / 180;
        }
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

  // One lining measured on its own, so the audit checks the size of a port and not just
  // how many there are. The lining is cut a little inside the opening, so the tolerance
  // allows for that rather than pretending the two are identical.
  const sample = new THREE.Mesh(
    new THREE.BoxGeometry(0.001, SPEC.gunport_height.value * 0.97, SPEC.gunport_width.value * 0.97),
    mats.red
  );
  sample.visible = false;
  sample.name = 'gunport_gauge';
  audits(sample,
    ['gunport_width', 'extent_z', { tolerance: 0.05 }],
    ['gunport_height', 'extent_y', { tolerance: 0.05 }],
  );
  group.add(sample);

  // The spacing, measured across the whole battery rather than between one pair, so a
  // single misplaced port cannot hide inside a correct average.
  const span = new THREE.Object3D();
  span.position.z = (ports.at(-1).z - ports[0].z) / (ports.length - 1);
  span.name = 'gunport_spacing_gauge';
  audit(span, 'gunport_spacing', 'origin_z', { tolerance: 0.02 });
  group.add(span);

  for (const l of lids) group.add(l);
  return group;
}
