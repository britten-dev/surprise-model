// The named camera stations used for verification renders. Angles are in degrees.
// `azimuth` is measured from dead ahead of the ship, turning to port; `elevation` is
// above the waterline plane; `distance` is a multiple of the sparred length so the
// framing survives a change to the ship's size.
export const VIEWS = {
  // Matched to reference/surprise-reference.jpg: a museum model photographed from the
  // port bow, a little above deck level, the whole rig in frame.
  reference: { azimuth: 148, elevation: 12, distance: 1.32, fov: 32, target: [0, 0.42, 0] },

  bow: { azimuth: 178, elevation: 8, distance: 1.15, fov: 34, target: [0, 0.40, 0] },
  beam: { azimuth: 90, elevation: 6, distance: 1.20, fov: 32, target: [0, 0.45, 0] },
  quarter: { azimuth: 42, elevation: 14, distance: 1.15, fov: 34, target: [0, 0.42, 0] },
  stern: { azimuth: 2, elevation: 9, distance: 1.02, fov: 34, target: [0, 0.34, 0] },
  masthead: { azimuth: 120, elevation: 46, distance: 0.78, fov: 40, target: [0, 0.70, 0] },
  deck: { azimuth: 6, elevation: 3, distance: 0.30, fov: 55, target: [0, 0.30, -0.06] },

  // Close studies, used when iterating on a specific area.
  head: { azimuth: 158, elevation: 4, distance: 0.42, fov: 36, target: [0, 0.26, -0.34] },
  gallery: { azimuth: 34, elevation: 5, distance: 0.36, fov: 36, target: [0, 0.26, 0.36] },
  channels: { azimuth: 84, elevation: 4, distance: 0.40, fov: 36, target: [0, 0.30, 0] },
  underwater: { azimuth: 118, elevation: -16, distance: 1.05, fov: 34, target: [0, -0.05, 0] },
};

/**
 * Place a camera at a named view. `size` is the model's bounding box so that the
 * distances above stay relative and no view needs retuning when the ship changes.
 */
export function applyView(camera, view, size, center = { x: 0, y: 0, z: 0 }) {
  const span = Math.max(size.x, size.y, size.z);
  const a = (view.azimuth * Math.PI) / 180;
  const e = (view.elevation * Math.PI) / 180;
  const d = view.distance * span;
  // The aim point is a fraction of the ship's own height, not of the longest span, so
  // that a hull on its own and a fully rigged ship are both framed sensibly.
  const tx = center.x + view.target[0] * span;
  const ty = view.target[1] * size.y;
  const tz = center.z + view.target[2] * span;
  camera.position.set(
    tx + Math.sin(a) * Math.cos(e) * d,
    ty + Math.sin(e) * d,
    tz - Math.cos(a) * Math.cos(e) * d
  );
  camera.fov = view.fov;
  camera.updateProjectionMatrix();
  camera.lookAt(tx, ty, tz);
  return { target: [tx, ty, tz] };
}
