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
import {
  planking, copperSheathing, sailCloth, ropeTexture, woodGrain, paintedSurface, normalFrom, asTexture,
} from './textures.js';
import { hullStains, deckStains, sailStains } from './weathering.js';

const col = (key) => new THREE.Color(PAINT[key].hex);

/**
 * Lay a weathering overlay over a drawn map, on a copy.
 *
 * A copy because the generators in textures.js memoise their canvases by their
 * arguments: staining one in place would stain every other part of the ship that had
 * asked for the same oak.
 */
function stainOver(base, overlay) {
  const size = base.width;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d', { willReadFrequently: true });
  g.drawImage(base, 0, 0, size, size);
  g.drawImage(overlay, 0, 0, size, size);
  return c;
}

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
    // No boot top on this ship: the sheathing is carried up to the lower edge of the
    // main wale, so the copper meets the black with nothing between them. On a ship
    // whose copper stopped lower there would be a band of bare, algae-stained plank
    // here, and PAINT.boot_top is kept for that case.
    [V.wale_bottom, V.wale_top, 'wale'],
    [V.wale_top, V.port_sill - PAINT.ochre_strake_below_sill_v.value, 'topside_black'],
    [V.port_sill - PAINT.ochre_strake_below_sill_v.value,
     V.port_head + PAINT.ochre_strake_above_head_v.value, 'ochre_trim'],
    [V.port_head + PAINT.ochre_strake_above_head_v.value, 1.0, 'topside_black'],
  ];

  for (const [a, b, key] of bands) {
    // A band whose top is at or below its bottom cannot draw, and silently produces a
    // seam where two colours meet with nothing between them. That is worth noticing
    // rather than ignoring: it means two of the feature heights have crossed over.
    if (b <= a) {
      console.warn(`hull paint: the "${key}" band is degenerate (V ${a.toFixed(3)} to ${b.toFixed(3)}) `
        + 'and will not draw — two feature heights have crossed.');
      continue;
    }
    // Canvas Y is inverted relative to V, so V = 0 is the bottom row.
    const y0 = Math.round((1 - b) * size);
    const y1 = Math.round((1 - a) * size);
    g.fillStyle = PAINT[key].hex;
    g.fillRect(0, y0, 8, y1 - y0);
  }

  // The moulding: the thin ochre line that follows the sheer strake, down in the black
  // topside below the ports. It reads as trim because it is lighter than the black either
  // side and only a few rows tall. Its line comes from the hull's own feature table, so
  // it follows the sheer rather than the horizon and cannot drift from the surface.
  //
  // There is exactly one, and it is here rather than up at the rail. The band between the
  // port heads and the rail is the bulwark, and the photograph shows it near-black,
  // #2b2320-#3d1903, right over the cap. It is a narrow band, so a light line drawn
  // across it swallows most of it — which is most of why the bulwark used to sample tan.
  const t = Math.max(2, Math.round(PAINT.ochre_moulding_v.value * size));
  g.fillStyle = PAINT.ochre_trim.hex;
  g.fillRect(0, Math.round((1 - V.sheer_strake) * size) - t / 2, 8, t);

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

// Materials are immutable and depend only on the level of detail, but building them
// means drawing and compositing several canvases — which is the great majority of the
// cost of building the ship, roughly 800 ms against 60 ms for all the geometry. Caching
// them per level makes a second build nearly free, which is what lets a host switch her
// canvas at runtime: shortening sail becomes a rebuild of the geometry alone.
//
// The consequence is that every ship built at a given level shares one set of materials.
// That is what you want for a fleet, and it means a caller who mutates a material
// changes every ship. `makeMaterials.uncached()` is there for a caller who needs a set
// of their own.
const materialCache = new Map();

export function makeMaterials(cfg) {
  const key = [cfg.textureSize, cfg.copperNails, cfg.hullRelief, cfg.mouldingSweeps].join(':');
  if (!materialCache.has(key)) materialCache.set(key, buildMaterials(cfg));
  return materialCache.get(key);
}

makeMaterials.uncached = buildMaterials;

function buildMaterials(cfg) {
  const N = cfg.textureSize;

  const hullPlank = asTexture(
    planking({ base: '#8a7256', dark: '#5c4a34', light: '#9c8264', seam: '#241d16', planks: 26, size: N, seed: 3 }),
    { repeat: [1, 1] }
  );
  hullPlank.wrapT = THREE.ClampToEdgeWrapping;

  // The sheathing, and the same pattern again as a height field for the hull's normal
  // map. Drawing it twice from one generator is what keeps the relief on the laps and the
  // nails registered with the laps and the nails in the colour.
  const copperArgs = {
    sheetsX: PAINT.copper_sheets_along.value,
    sheetsY: PAINT.copper_sheets_up.value,
    variation: PAINT.copper_sheet_variation.value,
    lap: PAINT.copper_lap_relief.value,
    nailRelief: PAINT.copper_nail_relief.value,
    size: N,
  };
  const copperTex = asTexture(
    copperSheathing({
      ...copperArgs,
      base: PAINT.copper.hex, edge: PAINT.copper_dark.hex, nail: PAINT.copper_bright.hex,
    }),
    { repeat: [1, 1] }
  );

  // The deck, then what is walked and washed into it. A holystoned deck is the palest
  // thing on the ship and it is the first surface to give the game away when it is
  // clean, because it is large, flat, and lit straight down.
  const deckTex = asTexture(
    stainOver(
      planking({
        base: PAINT.deck.hex, dark: '#a3937a', light: '#dccfb6', seam: PAINT.deck_seam.hex,
        planks: 30, size: N, seed: 5,
      }),
      deckStains({ size: N })
    ),
    { repeat: [1, 6] }
  );

  const oak = asTexture(woodGrain({ base: PAINT.timber.hex, dark: '#5a4529', light: '#b08a5a', size: N / 2, seed: 9 }));
  const brightWood = asTexture(woodGrain({ base: PAINT.mast_bright.hex, dark: '#6d5330', light: '#c19a63', size: N / 2, seed: 13 }));

  // The canvas, drawn as a grid of independent variants. sails.js gives each sail one
  // square of it, so no two sails in the suit carry the same patch in the same place.
  const sailTex = asTexture(
    sailCloth({
      base: PAINT.sail.hex, seam: PAINT.sail_seam.hex,
      // The map stays the level's own texture size and is divided between the variants,
      // rather than being multiplied by them: four sails at half the resolution read
      // better than one at full, because what is wrong with one is that it is the same
      // sail four times over.
      size: N, cloths: 16 * PAINT.weather_sail_variants.value,
      reefs: 3,
      variants: PAINT.weather_sail_variants.value,
      stain: (g, o) => sailStains(g, o),
    }),
    { repeat: [1, 1] }
  );

  // One modulation map for every painted surface on the ship. It carries no colour of
  // its own — it is a light-and-shade map about white — so each material keeps the
  // sourced colour PAINT gives it and only gains the unevenness of paint on timber.
  // Without it the inboard works, the port lids, the carriages and the boats are large
  // areas of one exact colour, which is the loudest thing on the ship after the shape.
  // The repeat is a compromise and has to be. This one map is laid on parts whose UVs
  // run from a whole ship's length of inner bulwark down to a single port lid, and no
  // repeat is right for both. Ten is chosen so the largest of them — the inboard works
  // through the waist — reads as boards rather than as stretched bands; on the small
  // parts it lands as the fine tooth of paint, which is what those want anyway.
  const paintedTex = asTexture(paintedSurface({ size: Math.max(256, N / 2) }), { repeat: [10, 10] });

  const std = (o) => new THREE.MeshStandardMaterial(o);
  // A painted surface: the sourced colour, modulated.
  const painted = (key, o = {}) => std({
    map: paintedTex, color: col(key), roughness: PAINT[key].roughness, metalness: 0, ...o,
  });

  const mats = {
    copper: std({ map: copperTex, color: col('copper'), roughness: PAINT.copper.roughness, metalness: 1.0 }),
    deck: std({ map: deckTex, color: 0xffffff, roughness: PAINT.deck.roughness, metalness: 0 }),
    timber: std({ map: oak, color: 0xffffff, roughness: 0.7, metalness: 0 }),
    mast: std({ map: brightWood, color: 0xffffff, roughness: PAINT.mast_bright.roughness, metalness: 0 }),
    mastBlack: painted('mast_black'),
    black: painted('topside_black'),
    ochre: painted('ochre_trim'),
    red: painted('inboard_red'),
    white: painted('boat_white'),
    gilt: std({ color: col('gilt'), roughness: PAINT.gilt.roughness, metalness: 1.0 }),
    iron: painted('iron', { metalness: PAINT.iron.metalness }),
    brass: std({ color: col('brass'), roughness: PAINT.brass.roughness, metalness: 1.0 }),

    // Sails are thin cloth with the sun behind them as often as not, and they must be
    // double-sided.
    //
    // The glow of light through canvas used to be got with `transmission`, and that was
    // the wrong tool twice over. A transmissive material is drawn in a separate pass off
    // a copy of the frame buffer, so a double-sided sail seen from its back side with
    // nothing but sky behind it came out of that pass black: the spanker rendered as a
    // solid black polygon from aft and to port. It is a MeshStandardMaterial now, and the
    // glow is a faint emission through the same cloth map — which cannot go black from
    // any angle, costs nothing, and is core glTF rather than an extension.
    sail: std({
      map: sailTex,
      // The map already carries the cloth colour. Tinting it again with the same value
      // multiplies the colour into itself and turns warm flax canvas into cold sage.
      color: 0xffffff,
      envMapIntensity: 0.35,
      roughness: PAINT.sail.roughness,
      metalness: 0,
      side: THREE.DoubleSide,
      // Emission through the weave, at the cloth's own pattern so the seams stay visible
      // in it. Only a little: sails overlap three deep on this rig and it is applied per
      // surface, so a value that looks right on one sail lights the whole suit like paper
      // lanterns.
      emissive: col('sail_glow_tint'),
      emissiveMap: sailTex,
      emissiveIntensity: PAINT.sail_glow.value,
    }),

    // The watch. Slop clothing takes the same painted-timber modulation as everything
    // else, which sounds wrong and is not: what that map actually does is break up a
    // flat colour, and wet tarpaulin needs it as much as a port lid does.
    crewSlop: painted('slop_tarpaulin'),
    crewCoat: painted('officer_coat'),

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
    // The lengthwise wear, which hull.js writes into the vertex colours because the map
    // repeats along her and cannot carry anything that varies from bow to stern.
    vertexColors: true,
    roughnessMap: mats.hullSurface,
    metalnessMap: mats.hullSurface,
    roughness: 1, metalness: 1,
    // The sheathed band is metal, so it has no diffuse colour at all and the environment
    // is the only thing lighting it. Turn this down and the bottom of the ship goes
    // black; leave it at unity and it reads as dark brick.
    envMapIntensity: PAINT.hull_env_intensity.value,
    // The relief. It used to be the sheathing alone, which meant the underwater body had
    // texture and the twenty feet of topside above it — the part anyone actually looks
    // at — was a perfectly smooth surface with the planking painted on. A hull whose
    // planks catch no light along their seams is the flattest thing on the ship.
    normalMap: cfg.hullRelief
      ? asTexture(
        normalFrom(
          hullHeightField(
            hullPlank.image,
            // The sheathing's own relief is the more expensive half — it is a second full
            // pass of the copper generator — and it is only ever read from alongside, so
            // below the game level the bottom keeps its colour and loses its laps.
            cfg.copperNails ? copperSheathing({ ...copperArgs, height: true }) : null,
            cfg.textureSize
          ),
          1.1
        ),
        { srgb: false }
      )
      : null,
    normalScale: new THREE.Vector2(PAINT.hull_normal_scale.value, PAINT.hull_normal_scale.value),
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
    const depth = underwater ? PAINT.copper_pattern_depth.value : 0.26;
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

  // The weathering last, over the finished paint: rust from the ironwork, salt where the
  // sea has been over her, weed in the wind-and-water band, and the black wash down from
  // every scupper. It is drawn on top rather than mixed in because the paint underneath
  // is evidence and this is not — see the head of src/ship/weathering.js.
  g.drawImage(hullStains({ size }), 0, 0, size, size);

  const tex = new THREE.CanvasTexture(out);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  return tex;
}

/**
 * The hull's height field: the sheathing below the copper line and the planking above
 * it, joined at the same row the colour changes at. `normalFrom` reads relief out of
 * this, so plank seams cast the thin shadow a plank seam casts and the copper keeps the
 * laps and nails it had before.
 *
 * The planking is flattened toward the middle grey first. Its luminance swings the whole
 * range, and fed to a normal map at that strength every board would stand a hand's
 * breadth proud of the one beside it.
 */
function hullHeightField(plankCanvas, copperHeightCanvas, size) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d', { willReadFrequently: true });

  g.fillStyle = 'rgb(128,128,128)';
  g.fillRect(0, 0, size, size);

  const copperTopV = V.waterline + PAINT.copper_line_above_wl_v.value;
  const copperFirstRow = Math.round((1 - copperTopV) * size);

  // The planking, flattened about mid-grey, down to the copper line.
  g.save();
  g.globalAlpha = PAINT.hull_plank_relief.value;
  g.drawImage(plankCanvas, 0, 0, size, copperFirstRow, 0, 0, size, copperFirstRow);
  g.restore();

  // The sheathing below it, at full strength: its laps and nails are already drawn as a
  // height field about mid-grey by copperSheathing({ height: true }).
  if (copperHeightCanvas) {
    g.drawImage(
      copperHeightCanvas,
      0, copperFirstRow, size, size - copperFirstRow,
      0, copperFirstRow, size, size - copperFirstRow
    );
  }
  return c;
}
