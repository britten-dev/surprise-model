// Optional photographic-style base colour. The procedural material is the offline
// fallback; loading this before buildShip gives every LOD the same authored wood.
let deckImage = null;
let pending;
export function getDeckImage() { return deckImage; }
export function preloadSurfaceAssets() {
  if (!pending) pending = new Promise((resolve) => {
    const image = new Image();
    const deadline = setTimeout(() => resolve(false), 8000);
    image.onload = () => { clearTimeout(deadline); deckImage = image; resolve(true); };
    image.onerror = () => { clearTimeout(deadline); resolve(false); };
    image.src = new URL('../assets/holystoned-deck-v1.png', import.meta.url).href;
  });
  return pending;
}
