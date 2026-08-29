# The host game

**Done.** The game at [britten-dev/hms-surprise](https://github.com/britten-dev/hms-surprise)
takes its ship from this package — see
[PR #1](https://github.com/britten-dev/hms-surprise/pull/1). What follows is the record of
how it was fitted, and what a different host would need to know.

## How it is wired

```js
import { buildShip } from 'surprise-model';
import { SPEC } from 'surprise-model/spec';

this.model = buildShip({ lod: 'game', sails: 'storm' });
this.group.add(this.model);
```

The host keeps everything the model knows nothing about — the wave field, the motion, the
wake, the spray, the mood lighting — and takes only the mesh. It reads her dimensions from
`SPEC` rather than repeating them, so the wake and the flag stations follow the hull.

Its flags are animated, and the model's are baked into one attitude, so the model's are
hidden and used only for their positions. That keeps the model the authority on *where* a
flag flies and the animation the host's.

## What it costs

| | |
| --- | --- |
| Build | about 920 ms cold, 80 ms after. Materials are cached per level, so changing canvas at runtime is a geometry rebuild and not another download. |
| Triangles | 58,832 at the `game` level |
| Materials | 19, all `MeshStandardMaterial` with baked procedural maps |
| three | a peer dependency, so the host provides it and there is exactly one copy |

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

## What a host has to decide

**1. The wave field is sampled in the host, not here.** `ship.js` samples at
`±13 m` fore and aft and `±4.4 m` on each beam, and eases heave, pitch and roll toward
those samples. Those numbers are the host's and they stay the host's — this model has no
motion of its own. The only thing to check is that `±13 m` is still the right lever arm
for a hull whose perpendiculars are 36.9 m apart: the fore and aft sample points sit at
about 0.70 of the half-length, which is a reasonable place to take a ship's trim from and
is what the existing ship uses.

**2. The flags are baked.** The model flies the ensign, the pennant and the jack as static
meshes with a wind curve frozen into them. A host that animates its own should hide these
and read their positions — the meshes are named `ensign`, `pennant` and `jack` inside the
`flags` group. That is what hms-surprise does, and it is the recommended arrangement: the
model stays the authority on where a flag flies, and the motion stays the host's.

**3. Sail state.** Building from source rather than loading a GLB is what makes this
cheap: the materials are cached per level, so a second `buildShip` at a different sail
state costs about 80 ms of geometry and no download at all. A ship can shorten sail in
front of you.

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

## The thing that was actually wrong

The host's `HULL.length` was 39 m, and it is read by more than the drawing — the wake, the
spume emitters and the bounds all use it. Her gundeck is 38.4 m. It now comes from
`SPEC.hull_length_gundeck`, so everything that reads it follows the hull rather than a
number somebody typed once.
