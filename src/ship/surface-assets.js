// Optional photographic-style base colour. The procedural material is the offline
// fallback; loading this before buildShip gives every LOD the same authored wood.
import { preloadAuthoredAssets } from './authored-assets.js';
import { preloadCrew } from './crew-assets.js';
import { preloadDeadeyes } from './deadeye-assets.js';
import { preloadProps } from './prop-assets.js';
import { preloadHullScan } from './hull-scan.js';
import { preloadCarvings } from './carving-assets.js';
import { fetchImage, onAssetProgress, assetProgress } from './asset-fetch.js';
let deckImage = null;
let pending;
export function getDeckImage() { return deckImage; }
// `onProgress({ loaded, total })` hears every byte of it arrive — see src/ship/asset-fetch.js.
export function preloadSurfaceAssets({ detail = true, crew = true, onProgress } = {}) {
  if (!pending) pending = new Promise((resolve) => {
    const deadline = setTimeout(() => resolve(false), 8000);
    fetchImage(new URL('../assets/holystoned-deck-v1.png', import.meta.url)).then((image) => {
      clearTimeout(deadline); deckImage = image; resolve(true);
    }, () => { clearTimeout(deadline); resolve(false); });
  });
  // The quarterdeck fittings only: the watch now comes from src/ship/crew-assets.js, and
  // the Blender-authored crew in quarterdeck-detail.glb is no longer fetched by default.
  // The boats and deck clutter (src/ship/prop-assets.js), the photographed planking, copper
  // and spar grain (src/ship/hull-scan.js) and the stern's carving
  // (src/ship/carving-assets.js) come with the detail.
  const settled = detail
    ? Promise.all([pending, preloadAuthoredAssets({ crew: false }), crew && preloadCrew(), preloadDeadeyes(),
      preloadProps(), preloadHullScan(), preloadCarvings()])
    : pending;
  if (onProgress) {
    // Heard until everything asked for here has settled, loaded or not.
    const stop = onAssetProgress(onProgress);
    onProgress(assetProgress());
    settled.then(stop, stop);
  }
  return settled;
}
