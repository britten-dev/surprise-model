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
    // The channels' ironwork. The chains carry the whole pull of the rig into the hull
    // and are the most visible iron on the ship, so they survive to the game LOD; the
    // notched rail along the channel's outer edge does too, because without it the
    // channel reads as a bare shelf.
    chainplates: true,
    channelRails: true,
    channelKnees: true,
    blocks: true,
    gunBarrels: true,
    gunCarriages: true,
    // The turned stages of a gun barrel: 'full' gives the base ring, both reinforce
    // rings, the muzzle astragal and the swell; 'coarse' keeps only the stations they
    // stand between.
    gunBarrelStages: 'full',
    gunBreechings: true,
    gunTackles: true,
    portLids: true,
    innerBulwarks: true,
    deckFurniture: 'full',
    // Deck furniture sub-switches, owned by src/ship/furniture.js.
    gratingBattens: true,
    hammockCranes: 'full',
    belayingPins: true,
    galleryGlazing: true,
    // The stern, owned by src/ship/stern.js: how many stations the counter and the
    // transom are lofted through, whether the carved and gilded work exists, and
    // whether the rudder gets its pintles and gudgeons.
    sternStations: 16,
    sternOrnament: 'carved',
    rudderIrons: true,
    figurehead: 'carved',
    headRails: true,
    boats: 'full',
    // Boats: how finely each little hull is lofted, and whether her gear is in her.
    boatStations: 23,
    boatPoints: 14,
    boatGear: true,
    anchorDetail: 'full',
    // The colours. 'full' is ensign, masthead pendant and jack; 'principal' drops the
    // jack, which is only ever worn at anchor anyway; 'ensign' is the one flag that
    // still reads on a silhouette at the horizon.
    flags: 'full',
    flagSegments: [20, 10],
    flagHalliards: true,
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
    chainplates: true,
    channelRails: true,
    channelKnees: false,
    blocks: false,
    gunBarrels: true,
    gunCarriages: 'simple',
    gunBarrelStages: 'coarse',
    gunBreechings: true,
    gunTackles: false,
    portLids: true,
    innerBulwarks: true,
    deckFurniture: 'principal',
    gratingBattens: false,
    hammockCranes: 'simple',
    belayingPins: false,
    galleryGlazing: true,
    sternStations: 9,
    sternOrnament: 'simple',
    rudderIrons: true,
    figurehead: 'simple',
    headRails: true,
    boats: 'simple',
    boatStations: 13,
    boatPoints: 9,
    boatGear: false,
    anchorDetail: 'simple',
    flags: 'principal',
    flagSegments: [12, 6],
    flagHalliards: true,
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
    chainplates: false,
    channelRails: false,
    channelKnees: false,
    blocks: false,
    gunBarrels: false,
    gunCarriages: false,
    gunBarrelStages: 'coarse',
    gunBreechings: false,
    gunTackles: false,
    portLids: false,
    innerBulwarks: false,
    deckFurniture: 'none',
    gratingBattens: false,
    hammockCranes: false,
    belayingPins: false,
    galleryGlazing: false,
    // At this range the stern is a shape, not a piece of joinery: the counter and the
    // transom still have to close the hull, but nothing is carved and the rudder is a
    // plain blade.
    sternStations: 5,
    sternOrnament: 'none',
    rudderIrons: false,
    figurehead: 'none',
    headRails: false,
    boats: 'block',
    boatStations: 7,
    boatPoints: 5,
    boatGear: false,
    anchorDetail: 'none',
    flags: 'ensign',
    flagSegments: [4, 2],
    flagHalliards: false,
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
