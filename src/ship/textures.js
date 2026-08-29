// Procedural textures, drawn on a canvas at build time. Nothing is downloaded and
// nothing is checked in as an image: the whole look of the ship is code, so a change
// to a colour in the spec propagates everywhere at once.
//
// Every generator is cached by its arguments, because the same oak appears on a
// hundred separate objects and a 1024-pixel canvas is not free.
import * as THREE from 'three';
import { rng } from '../util/math.js';

const cache = new Map();
const memo = (key, make) => {
  if (!cache.has(key)) cache.set(key, make());
  return cache.get(key);
};

function canvas(size) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  return { c, g: c.getContext('2d', { willReadFrequently: true }) };
}

function finish(c, { repeat = [1, 1], srgb = true, aniso = 8 } = {}) {
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat[0], repeat[1]);
  t.anisotropy = aniso;
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** Long, straight grain with occasional darker rays. The basis of every wooden part. */
export function woodGrain({ base = '#8a6a44', dark = '#5e452b', light = '#a5855c', size = 512, streaks = 220, seed = 7 } = {}) {
  return memo(`wood:${base}:${dark}:${light}:${size}:${seed}`, () => {
    const { c, g } = canvas(size);
    const r = rng(seed);
    g.fillStyle = base;
    g.fillRect(0, 0, size, size);
    for (let i = 0; i < streaks; i++) {
      const y = r() * size;
      const w = 0.4 + r() * 2.6;
      const a = 0.04 + r() * 0.16;
      g.strokeStyle = r() > 0.55 ? dark : light;
      g.globalAlpha = a;
      g.lineWidth = w;
      g.beginPath();
      g.moveTo(0, y);
      // A slow wander, so the grain is not a set of perfectly parallel lines.
      for (let x = 0; x <= size; x += 32) g.lineTo(x, y + Math.sin(x * 0.012 + i) * 2.2 + (r() - 0.5) * 1.6);
      g.stroke();
    }
    // Knots, sparingly. Too many and it reads as pine packing crate, not ship's timber.
    g.globalAlpha = 1;
    for (let i = 0; i < 3; i++) {
      const x = r() * size, y = r() * size, rad = 3 + r() * 5;
      const grad = g.createRadialGradient(x, y, 0, x, y, rad * 3);
      grad.addColorStop(0, dark);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = grad;
      g.beginPath(); g.arc(x, y, rad * 3, 0, 7); g.fill();
    }
    return c;
  });
}

/** Planking: wood grain divided into strakes with dark caulked seams and butt joints. */
export function planking({
  base = '#9c7b52', dark = '#6b512f', light = '#b59468', seam = '#2a2118',
  planks = 12, size = 1024, seed = 11, butts = true,
} = {}) {
  const key = `plank:${base}:${seam}:${planks}:${size}:${seed}:${butts}`;
  return memo(key, () => {
    const { c, g } = canvas(size);
    const r = rng(seed);
    const h = size / planks;
    for (let i = 0; i < planks; i++) {
      // Each strake gets its own slight tone, which is what makes a deck read as many
      // boards rather than one printed sheet.
      const shade = 0.88 + r() * 0.24;
      const src = woodGrain({ base, dark, light, size: 256, seed: seed + i });
      g.save();
      g.globalAlpha = 1;
      g.filter = `brightness(${shade.toFixed(3)})`;
      g.drawImage(src, 0, i * h, size, h);
      g.restore();
      g.filter = 'none';
      g.fillStyle = seam;
      g.fillRect(0, i * h - 1, size, 2);
    }
    if (butts) {
      // Butt joints on a three- or four-butt shift, never in line between neighbours.
      g.fillStyle = seam;
      for (let i = 0; i < planks; i++) {
        const offset = ((i % 4) / 4) * size;
        for (let x = offset; x < size + offset; x += size / 2) {
          g.fillRect((x % size) - 1, i * h, 2, h);
        }
      }
    }
    return c;
  });
}

/**
 * Copper sheathing. Sheets are laid like slates, each overlapping the one below and
 * the one ahead, and each held by a grid of nails. It is the nails that catch the
 * light and make copper read as copper rather than as brown paint.
 */
export function copperSheathing({
  base = '#8d5a3c', edge = '#6d4028', nail = '#a97a55',
  sheetsX = 16, sheetsY = 20, size = 1024, seed = 23,
} = {}) {
  return memo(`copper:${base}:${sheetsX}x${sheetsY}:${seed}`, () => {
    const { c, g } = canvas(size);
    const r = rng(seed);
    g.fillStyle = base;
    g.fillRect(0, 0, size, size);
    const w = size / sheetsX, h = size / sheetsY;
    for (let y = 0; y < sheetsY; y++) {
      for (let x = 0; x < sheetsX; x++) {
        // Every other course is offset half a sheet, as they were actually laid.
        const px = (x + (y % 2) * 0.5) * w;
        const py = y * h;
        g.fillStyle = `rgba(255,255,255,${(r() * 0.09).toFixed(3)})`;
        g.fillRect(px, py, w, h);
        g.strokeStyle = edge;
        g.lineWidth = 1.6;
        g.strokeRect(px, py, w, h);
        g.fillStyle = nail;
        const nx = 5, ny = 4;
        for (let i = 0; i <= nx; i++) {
          for (let j = 0; j <= ny; j++) {
            // Nails only round the edge of each sheet, which is where they went.
            if (i > 0 && i < nx && j > 0 && j < ny) continue;
            g.fillRect(px + (i / nx) * w - 0.9, py + (j / ny) * h - 0.9, 1.8, 1.8);
          }
        }
      }
    }
    return c;
  });
}

/**
 * Sail canvas. Period sails were sewn from cloths about two feet wide, so the seams
 * run the length of the sail at a fixed spacing, with heavier bands at the reef
 * points and a bolt rope round the edge.
 */
export function sailCloth({
  base = '#ddd6c4', seam = '#c6bda7', size = 1024, cloths = 14, reefs = 2, seed = 31,
} = {}) {
  return memo(`sail:${base}:${cloths}:${reefs}:${seed}`, () => {
    const { c, g } = canvas(size);
    const r = rng(seed);
    g.fillStyle = base;
    g.fillRect(0, 0, size, size);
    // The weave itself, faint but enough to break up a flat panel under a hard light.
    for (let i = 0; i < size; i += 3) {
      g.fillStyle = `rgba(0,0,0,${(0.012 + r() * 0.014).toFixed(3)})`;
      g.fillRect(i, 0, 1, size);
      g.fillRect(0, i, size, 1);
    }
    // Cloth seams, vertical, at the width of a bolt of canvas.
    const step = size / cloths;
    for (let i = 1; i < cloths; i++) {
      g.fillStyle = seam;
      g.globalAlpha = 0.55;
      g.fillRect(i * step - 1, 0, 2.5, size);
    }
    // Reef bands across the head of the sail, doubled canvas.
    g.globalAlpha = 0.4;
    for (let i = 1; i <= reefs; i++) {
      g.fillStyle = seam;
      g.fillRect(0, (i / (reefs + 5)) * size, size, size * 0.016);
    }
    // Tabling: the doubled hem all round.
    g.globalAlpha = 0.5;
    g.strokeStyle = seam;
    g.lineWidth = size * 0.018;
    g.strokeRect(0, 0, size, size);
    g.globalAlpha = 1;
    return c;
  });
}

/** Laid rope: three strands twisting round each other. Only the hero LOD sees this. */
export function ropeTexture({ base = '#6b5a44', dark = '#4a3d2c', size = 128, seed = 41 } = {}) {
  return memo(`rope:${base}:${seed}`, () => {
    const { c, g } = canvas(size);
    g.fillStyle = base;
    g.fillRect(0, 0, size, size);
    g.strokeStyle = dark;
    g.lineWidth = 3;
    g.globalAlpha = 0.5;
    for (let k = 0; k < 3; k++) {
      g.beginPath();
      for (let y = 0; y <= size; y += 4) {
        const x = ((y * 1.6 + (k * size) / 3) % size);
        y === 0 ? g.moveTo(x, y) : g.lineTo(x, y);
      }
      g.stroke();
    }
    return c;
  });
}

/**
 * A height map turned into a normal map, so the plank seams and the copper nails have
 * relief rather than being painted on flat.
 */
export function normalFrom(sourceCanvas, strength = 1.6) {
  const size = sourceCanvas.width;
  const src = sourceCanvas.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, size, size).data;
  const { c, g } = canvas(size);
  const out = g.createImageData(size, size);
  const lum = (x, y) => {
    const i = ((((y % size) + size) % size) * size + (((x % size) + size) % size)) * 4;
    return (src[i] * 0.299 + src[i + 1] * 0.587 + src[i + 2] * 0.114) / 255;
  };
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = (lum(x + 1, y) - lum(x - 1, y)) * strength;
      const dy = (lum(x, y + 1) - lum(x, y - 1)) * strength;
      const len = Math.hypot(dx, dy, 1);
      const i = (y * size + x) * 4;
      out.data[i] = ((-dx / len) * 0.5 + 0.5) * 255;
      out.data[i + 1] = ((-dy / len) * 0.5 + 0.5) * 255;
      out.data[i + 2] = (1 / len) * 0.5 * 255 + 127.5;
      out.data[i + 3] = 255;
    }
  }
  g.putImageData(out, 0, 0);
  return c;
}

export { finish as asTexture };
