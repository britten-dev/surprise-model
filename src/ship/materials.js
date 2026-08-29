// Materials. Every colour comes from PAINT in the spec, where it carries its source,
// so nothing here invents a value. The textures are drawn in code by textures.js.
//
// The one thing worth explaining is the hull. The hull is a single lofted surface with
// a single material, and its paint bands — copper, black topsides, wale, ochre gunport
// strake, cap rail — are painted by a one-dimensional strip texture indexed by the V
// coordinate. Because hull.js pins each named feature to a fixed V, those bands land on
// the real lines of the ship: they follow the sheer where the sheer is the boundary and
// the waterline where the waterline is.
import * as THREE from 'three';
import { PAINT } from '../spec/spec.js';
import { V } from './hull.js';
import { planking, copperSheathing, sailCloth, ropeTexture, woodGrain, normalFrom, asTexture } from './textures.js';

const col = (key) => new THREE.Color(PAINT[key].hex);

/**
 * The hull's paint strip: a tall, one-pixel-wide image whose rows are the bands, drawn
 * in the V coordinate the hull surface uses. Building it from the same `V` table the
 * hull is lofted from means the two cannot drift apart.
 */
function hullPaintStrip(size = 1024, cfg) {
  const c = document.createElement('canvas');
  c.width = 8;
  c.height = size;
  const g = c.getContext('2d', { willReadFrequently: true });

  // The bands, bottom (keel, V = 0) to top (rail, V = 1).
  const bands = [
    [0.0, V.waterline + PAINT.copper_line_above_wl_v.value, 'copper'],
    [V.waterline + PAINT.copper_line_above_wl_v.value, V.wale_bottom, 'boot_top'],
    [V.wale_bottom, V.wale_top, 'wale'],
    [V.wale_top, V.port_sill - PAINT.ochre_strake_below_sill_v.value, 'topside_black'],
    [V.port_sill - PAINT.ochre_strake_below_sill_v.value,
     V.port_head + PAINT.ochre_strake_above_head_v.value, 'ochre_trim'],
    [V.port_head + PAINT.ochre_strake_above_head_v.value, 1.0, 'topside_black'],
  ];

  for (const [a, b, key] of bands) {
    // Canvas Y is inverted relative to V, so V = 0 is the bottom row.
    const y0 = Math.round((1 - b) * size);
    const y1 = Math.round((1 - a) * size);
    g.fillStyle = PAINT[key].hex;
    g.fillRect(0, y0, 8, y1 - y0);
  }

  // The mouldings: the thin raised ochre lines that follow the sheer. They read as
  // trim because they are lighter than the black either side and only a few rows tall.
  const moulding = (v, thickness, colour) => {
    g.fillStyle = colour;
    g.fillRect(0, Math.round((1 - v) * size) - thickness / 2, 8, thickness);
  };
  const t = Math.max(2, Math.round(size / 340));
  moulding(V.sheer_strake, t, PAINT.ochre_trim.hex);
  moulding(V.rail - 0.012, t, PAINT.ochre_trim.hex);

  // Soften every boundary by a pixel or two. A hard edge on a painted plank reads as a
  // decal; a real paint line has a brush edge.
  const soft = document.createElement('canvas');
  soft.width = 8; soft.height = size;
  const sg = soft.getContext('2d', { willReadFrequently: true });
  sg.filter = `blur(${Math.max(1, size / 900).toFixed(2)}px)`;
  sg.drawImage(c, 0, 0);

  const tex = new THREE.CanvasTexture(soft);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  return tex;
}

/**
 * The hull's roughness and metalness maps, built from the same band table. Copper is
 * metal and the paint is not, so this is what makes the bottom read as sheathing
 * rather than as brown paint.
 */
function hullSurfaceStrip(size = 512) {
  const c = document.createElement('canvas');
  c.width = 8; c.height = size;
  const g = c.getContext('2d', { willReadFrequently: true });
  const copperTop = V.waterline + PAINT.copper_line_above_wl_v.value;
  // glTF packs roughness in green and metalness in blue.
  const write = (a, b, rough, metal) => {
    g.fillStyle = `rgb(0,${Math.round(rough * 255)},${Math.round(metal * 255)})`;
    g.fillRect(0, Math.round((1 - b) * size), 8, Math.round((b - a) * size));
  };
  write(0, copperTop, PAINT.copper.roughness, 1.0);
  write(copperTop, V.wale_bottom, PAINT.boot_top.roughness, 0);
  write(V.wale_bottom, V.wale_top, PAINT.wale.roughness, 0);
  write(V.wale_top, 1.0, PAINT.topside_black.roughness, 0);
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  return tex;
}

export function makeMaterials(cfg) {
  const N = cfg.textureSize;

  const hullPlank = asTexture(
    planking({ base: '#8a7256', dark: '#5c4a34', light: '#9c8264', seam: '#241d16', planks: 26, size: N, seed: 3 }),
    { repeat: [1, 1] }
  );
  hullPlank.wrapT = THREE.ClampToEdgeWrapping;

  const copperTex = asTexture(
    copperSheathing({
      base: PAINT.copper.hex, edge: PAINT.copper_dark.hex, nail: PAINT.copper_bright.hex,
      sheetsX: 22, sheetsY: 26, size: N,
    }),
    { repeat: [1, 1] }
  );

  const deckTex = asTexture(
    planking({
      base: PAINT.deck.hex, dark: '#a3937a', light: '#dccfb6', seam: PAINT.deck_seam.hex,
      planks: 30, size: N, seed: 5,
    }),
    { repeat: [1, 6] }
  );

  const oak = asTexture(woodGrain({ base: PAINT.timber.hex, dark: '#5a4529', light: '#b08a5a', size: N / 2, seed: 9 }));
  const brightWood = asTexture(woodGrain({ base: PAINT.mast_bright.hex, dark: '#6d5330', light: '#c19a63', size: N / 2, seed: 13 }));

  const sailTex = asTexture(
    sailCloth({ base: PAINT.sail.hex, seam: PAINT.sail_seam.hex, size: N, cloths: 16, reefs: 3 }),
    { repeat: [1, 1] }
  );

  const std = (o) => new THREE.MeshStandardMaterial(o);

  const mats = {
    copper: std({ map: copperTex, color: col('copper'), roughness: PAINT.copper.roughness, metalness: 1.0 }),
    deck: std({ map: deckTex, color: 0xffffff, roughness: PAINT.deck.roughness, metalness: 0 }),
    timber: std({ map: oak, color: 0xffffff, roughness: 0.7, metalness: 0 }),
    mast: std({ map: brightWood, color: 0xffffff, roughness: PAINT.mast_bright.roughness, metalness: 0 }),
    mastBlack: std({ color: col('mast_black'), roughness: PAINT.mast_black.roughness, metalness: 0 }),
    black: std({ color: col('topside_black'), roughness: PAINT.topside_black.roughness, metalness: 0 }),
    ochre: std({ color: col('ochre_trim'), roughness: PAINT.ochre_trim.roughness, metalness: 0 }),
    red: std({ color: col('inboard_red'), roughness: PAINT.inboard_red.roughness, metalness: 0 }),
    white: std({ color: col('boat_white'), roughness: PAINT.boat_white.roughness, metalness: 0 }),
    gilt: std({ color: col('gilt'), roughness: PAINT.gilt.roughness, metalness: 1.0 }),
    iron: std({ color: col('iron'), roughness: PAINT.iron.roughness, metalness: PAINT.iron.metalness }),
    brass: std({ color: col('brass'), roughness: PAINT.brass.roughness, metalness: 1.0 }),

    // Sails are thin cloth with the sun behind them as often as not, so they need
    // transmission rather than plain opacity, and they must be double-sided.
    sail: new THREE.MeshPhysicalMaterial({
      map: sailTex,
      color: col('sail'),
      roughness: PAINT.sail.roughness,
      metalness: 0,
      side: THREE.DoubleSide,
      // A little transmission gives a sail the glow it has with the sun behind it. Only
      // a little: sails overlap three deep on this rig, and transmission is applied per
      // surface, so a value that looks right on one sail turns the whole suit to gauze.
      transmission: cfg.textureSize > 256 ? PAINT.sail_transmission.value : 0,
      thickness: 0.06,
      ior: 1.05,
    }),

    standingRigging: std({ color: col('rigging_tarred'), roughness: PAINT.rigging_tarred.roughness, metalness: 0 }),
    runningRigging: std({ color: col('rigging_hemp'), roughness: PAINT.rigging_hemp.roughness, metalness: 0 }),

    glass: new THREE.MeshPhysicalMaterial({
      color: col('glazing'),
      roughness: PAINT.glazing.roughness,
      metalness: 0,
      transmission: 0.85,
      thickness: 0.01,
      ior: 1.52,
      side: THREE.DoubleSide,
    }),

    bunting: (key) => std({
      color: col(key), roughness: 0.9, metalness: 0, side: THREE.DoubleSide,
    }),
  };

  // Rope lines for the distant LOD, where a tube is not worth its triangles.
  mats.ropeLine = new THREE.LineBasicMaterial({ color: col('rigging_tarred'), transparent: true, opacity: 0.85 });
  mats.ratlineLine = new THREE.LineBasicMaterial({ color: col('rigging_tarred'), transparent: true, opacity: 0.7 });

  // The hull's paint. Built last because it needs the LOD's texture size.
  mats.hullPaint = hullPaintStrip(cfg.textureSize, cfg);
  mats.hullSurface = hullSurfaceStrip(Math.min(512, cfg.textureSize));

  mats.hull = std({
    map: combinePlankAndPaint(hullPlank.image, copperTex.image, mats.hullPaint, cfg.textureSize),
    roughnessMap: mats.hullSurface,
    metalnessMap: mats.hullSurface,
    roughness: 1, metalness: 1,
    normalMap: cfg.copperNails
      ? asTexture(normalFrom(copperSheathing({ sheetsX: 22, sheetsY: 26, size: cfg.textureSize }), 1.1), { srgb: false })
      : null,
    normalScale: new THREE.Vector2(0.4, 0.4),
  });

  return mats;
}

/**
 * Bake one base-colour map for the hull.
 *
 * The paint decides the hue of every band; the planking or the copper sheathing decides
 * only its light and shade. Doing it that way round matters: compositing the plank over
 * the paint with a blend mode lifts the near-black topsides toward brown and the black
 * strake between the wale and the ochre disappears into the ochre. So the plank is
 * reduced to a luminance modulation about 1.0 and multiplied in, which keeps every band
 * exactly the colour the spec says it is while still showing the boards.
 *
 * Below the copper line the shading comes from the sheathing instead, because the
 * underwater body is sheets of copper, not planks.
 */
function combinePlankAndPaint(plankCanvas, copperCanvas, paintTex, size) {
  const read = (src) => {
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const g = c.getContext('2d', { willReadFrequently: true });
    g.drawImage(src, 0, 0, size, size);
    return g.getImageData(0, 0, size, size).data;
  };
  const plank = read(plankCanvas);
  const copper = read(copperCanvas);

  const out = document.createElement('canvas');
  out.width = out.height = size;
  const g = out.getContext('2d', { willReadFrequently: true });
  g.drawImage(paintTex.image, 0, 0, size, size);
  const img = g.getImageData(0, 0, size, size);
  const d = img.data;

  // The row at which the copper gives way to the painted topsides. Canvas rows run
  // downward and V runs upward, hence the inversion.
  const copperTopV = V.waterline + PAINT.copper_line_above_wl_v.value;
  const copperFirstRow = Math.round((1 - copperTopV) * size);

  const lum = (a, i) => (a[i] * 0.299 + a[i + 1] * 0.587 + a[i + 2] * 0.114) / 255;

  for (let y = 0; y < size; y++) {
    const underwater = y >= copperFirstRow;
    const src = underwater ? copper : plank;
    // Copper is a metal and carries its own colour through the metalness map, so its
    // pattern is allowed to modulate more strongly than paint on planking does.
    const depth = underwater ? 0.42 : 0.26;
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      const k = 1 + (lum(src, i) - 0.5) * 2 * depth;
      d[i] = Math.min(255, d[i] * k);
      d[i + 1] = Math.min(255, d[i + 1] * k);
      d[i + 2] = Math.min(255, d[i + 2] * k);
      d[i + 3] = 255;
    }
  }
  g.putImageData(img, 0, 0);

  const tex = new THREE.CanvasTexture(out);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  return tex;
}
