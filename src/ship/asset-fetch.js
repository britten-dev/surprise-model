// Every optional file the ship loads, counted as it arrives.
//
// The detail — the deck image, the fittings, the watch, the boats, the scans, the
// carvings — is twenty-odd megabytes on a first visit, and a host that shows nothing but a
// line of text while it comes looks as if it has stopped. So each loader in this
// directory fetches through `fetchAsset` rather than `fetch`, and a host can ask
// `onAssetProgress` how many bytes of how many have arrived (src/ship/surface-assets.js
// passes it on as `preloadSurfaceAssets({ onProgress })`).
//
// A file counts towards the total from the moment its headers arrive, so the total grows
// for the first moment of a load as the requests answer one by one. A host drawing a bar
// should never let it go backwards.
const files = new Map();
const listeners = new Set();
let queued = false;

export function assetProgress() {
  let loaded = 0, total = 0;
  for (const f of files.values()) { loaded += f.loaded; total += Math.max(f.total, f.loaded); }
  return { loaded, total };
}

export function onAssetProgress(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function changed() {
  if (queued) return;
  queued = true;
  queueMicrotask(() => {
    queued = false;
    const progress = assetProgress();
    for (const listener of listeners) listener(progress);
  });
}

/** The file's bytes, as `fetch(url).then(r => r.arrayBuffer())` would give them, counted. */
export async function fetchAsset(url, { signal } = {}) {
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error(`${String(url).split('/').pop()}: HTTP ${response.status}`);
  const entry = { loaded: 0, total: Number(response.headers.get('content-length')) || 0 };
  files.set(String(url), entry);
  changed();
  if (!response.body) {
    const bytes = await response.arrayBuffer();
    entry.loaded = entry.total = bytes.byteLength;
    changed();
    return bytes;
  }
  const reader = response.body.getReader(), chunks = [];
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    entry.loaded += value.byteLength;
    changed();
  }
  entry.total = entry.loaded;
  changed();
  const bytes = new Uint8Array(entry.loaded);
  let at = 0;
  for (const chunk of chunks) { bytes.set(chunk, at); at += chunk.byteLength; }
  return bytes.buffer;
}

/**
 * The file as a decoded image, counted the same way. The object URL is kept for the life
 * of the page: these images are drawn into canvases whenever a ship is built, and a
 * browser is free to drop a decoded image and read it again from its source.
 */
export async function fetchImage(url, { signal } = {}) {
  const bytes = await fetchAsset(url, { signal });
  const image = new Image();
  image.src = URL.createObjectURL(new Blob([bytes]));
  await image.decode();
  return image;
}
