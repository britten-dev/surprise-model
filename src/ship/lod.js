// What each level of detail contains. Every part of the generator asks this module
// what it is allowed to spend, rather than deciding for itself, so the triangle budget
// is set in one readable place instead of being scattered through the build.
//
//   hero     200-500k tris — close inspection, every ratline, every gun, every light
//   game     30-60k        — the host game's ship at normal viewing range
//   distant  under 5k      — a silhouette on the horizon
export const LODS = ['hero', 'game', 'distant'];

const CONFIG = {
  hero: {
    // Hull surface resolution.
    hullStations: 121,
    hullPoints: 72,
    // Round things: spars, ropes, deadeyes, gun barrels.
    sparSegments: 14,
    sparRadial: 10,
    ropeRadial: 5,
    ropeSegments: 12,
    latheSegments: 20,

    // What exists at all.
    ropesAsTubes: true,
    ratlines: true,
    ratlineEvery: 1,
    footropes: true,
    runningRigging: 'full',
    deadeyes: true,
    blocks: true,
    gunBarrels: true,
    gunCarriages: true,
    portLids: true,
    innerBulwarks: true,
    deckFurniture: 'full',
    galleryGlazing: true,
    figurehead: 'carved',
    headRails: true,
    boats: 'full',
    anchorDetail: 'full',
    copperNails: true,
    sailSegments: [14, 10],
    mouldingSweeps: 96,

    textureSize: 1024,
  },

  game: {
    hullStations: 61,
    hullPoints: 34,
    sparSegments: 5,
    sparRadial: 6,
    ropeRadial: 3,
    ropeSegments: 5,
    latheSegments: 10,

    // Shrouds and stays stay as tubes because they read at gameplay range; ratlines
    // drop to lines, which cost nothing and still give the rigging its texture.
    ropesAsTubes: true,
    ratlines: 'lines',
    ratlineEvery: 2,
    footropes: false,
    runningRigging: 'principal',
    deadeyes: 'simple',
    blocks: false,
    gunBarrels: true,
    gunCarriages: 'simple',
    portLids: true,
    innerBulwarks: true,
    deckFurniture: 'principal',
    galleryGlazing: true,
    figurehead: 'simple',
    headRails: true,
    boats: 'simple',
    anchorDetail: 'simple',
    copperNails: false,
    sailSegments: [8, 6],
    mouldingSweeps: 48,

    textureSize: 512,
  },

  distant: {
    hullStations: 25,
    hullPoints: 16,
    sparSegments: 2,
    sparRadial: 4,
    ropeRadial: 3,
    ropeSegments: 2,
    latheSegments: 6,

    // At this range the rig is a smudge. Only the stays and the lower shrouds are
    // drawn, as lines, because without them the masts look like bare poles.
    ropesAsTubes: false,
    ratlines: false,
    ratlineEvery: 4,
    footropes: false,
    runningRigging: 'none',
    deadeyes: false,
    blocks: false,
    gunBarrels: false,
    gunCarriages: false,
    portLids: false,
    innerBulwarks: false,
    deckFurniture: 'none',
    galleryGlazing: false,
    figurehead: 'none',
    headRails: false,
    boats: 'block',
    anchorDetail: 'none',
    copperNails: false,
    sailSegments: [3, 2],
    mouldingSweeps: 16,

    textureSize: 256,
  },
};

export function lodConfig(lod) {
  const c = CONFIG[lod];
  if (!c) throw new Error(`unknown LOD "${lod}" — expected one of ${LODS.join(', ')}`);
  return c;
}

export const TRI_BUDGET = {
  hero: [200000, 500000],
  game: [30000, 60000],
  distant: [1500, 5000],
};
