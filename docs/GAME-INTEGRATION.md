# Dropping the game LOD into the host game

The `game` level of detail exists to replace the procedural ship in
`hms-surprise/src/world/ocean/ship.js`. This is what has to line up, checked against that
file rather than assumed. **Nothing in that repository has been changed** — this is a note
for whoever does the integration.

## What already matches

| | Host game (`HULL` in `ship.js`) | This model | |
| --- | --- | --- | --- |
| Local frame origin | waterline amidships | waterline amidships (`y = 0`, `z = 0` at the midship station) | ✅ |
| Bow direction | `-Z` | `-Z` | ✅ |
| Keel depth | `-4.3` m | `-4.28` m | ✅ |
| Half beam | `4.95` m | `4.83` m moulded, `4.93` m over the wales | ✅ |
| Length, stem to sternpost | `39` m | `38.4` m on the gundeck, `36.9` m between perpendiculars | ✅ within 1.5 % |
| Triangles | procedural, a few thousand | 59.7 k at the game LOD | see below |

The `game` GLB therefore drops straight in without a scale factor or a rotation. Load it,
add it to `this.group`, and delete the procedural hull builder.

## What needs a decision

**1. The wave field is sampled in the host, not here.** `ship.js` samples at
`±13 m` fore and aft and `±4.4 m` on each beam, and eases heave, pitch and roll toward
those samples. Those numbers are the host's and they stay the host's — this model has no
motion of its own. The only thing to check is that `±13 m` is still the right lever arm
for a hull whose perpendiculars are 36.9 m apart: the fore and aft sample points sit at
about 0.70 of the half-length, which is a reasonable place to take a ship's trim from and
is what the existing ship uses.

**2. The flags are baked.** The GLB carries the ensign, the pennant and the jack as static
meshes with a wind curve frozen into them. `ship.js` animates its own flags. Either strip
the `flags` group from the loaded GLB and keep the host's animation, or keep the baked
ones and drop the host's. The baked ones are more accurate; the host's move. Suggested:
keep the host's animation, and drive it from the baked geometry — the meshes are named
`ensign`, `pennant` and `jack` inside the `flags` group and can be found and re-animated.

**3. Sail state.** The host runs storm canvas. `surprise-game-storm.glb` is the one to
load. All four states share the same hull and rig, so swapping between them at runtime
means loading more than one GLB, or loading the hero source and generating in-browser —
the generator takes about 400 ms for the whole ship, which is affordable at a loading
screen but not mid-frame.

**4. Triangle count.** 59.7 k against the host's few thousand. That is the point of the
exchange, but it is a real cost on a scene that also carries a wave field, spume and
cloud. Measure before committing; if it is too much, the levers in
`src/ship/lod.js` under `game` are, in order of triangles saved per unit of appearance
lost: `gunCarriages` to `'simple'`, `boats` to `'block'`, `deckFurniture` to `'none'`,
`ratlines` to `false`.

**5. Materials.** 19 materials at the game LOD, all `MeshStandardMaterial` with baked
procedural maps. Nothing needs the host's lighting to change. If the host batches by
material, the count could come down by merging the timber and mast materials, which differ
only in roughness.

## The one thing that would actually be wrong

The host's `HULL.length` of 39 m is used for more than drawing — the wake, the spume
emitters and the boat's bounding checks all read it. It is 0.6 m longer than this hull's
gundeck. Either set it to `38.4` and re-check anything that reads it, or accept a 1.5 per
cent difference, which is smaller than the wave field's own amplitude and will not be
visible.
