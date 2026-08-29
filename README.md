# HMS Surprise — parametric model

A reusable 3-D asset project: a parametric generator that builds the Royal Navy frigate
**HMS Surprise** — historically the French corvette **Unité**, launched 1794, captured
by HMS Inconstant in April 1796 and taken into the Royal Navy — and exports her as glTF
at three levels of detail and four states of canvas.

This is an asset project, not a game. Nothing here is downloaded: the hull is lofted
from an offset table, every fitting is generated, and every texture is drawn in code.

## What it produces

| LOD | Triangles | Use |
| --- | --- | --- |
| `hero` | 200–500 k | Close inspection. Every ratline, gun, port lid and gallery light. |
| `game` | 30–60 k | A ship at gameplay range. Hull about 38 m. |
| `distant` | under 5 k | A silhouette on the horizon. |

Four sail states: `full` (courses, topsails, topgallants, staysails and three
headsails, as in the reference photograph), `topsails`, `storm` (reefed foresail and
close-reefed main topsail) and `furled`.

Live at **[hms-surprise-model.netlify.app](https://hms-surprise-model.netlify.app)** — the
viewer builds the ship in your browser from this source, in about 400 ms, and the exported
glTF files can be downloaded from the same page.

## Commands

```bash
npm install
npm run viewer    # inspect interactively at http://127.0.0.1:8099/viewer/
npm run build     # export every GLB to build/
npm run render    # verification renders to renders/
npm run check     # the gate: specs, trace, audit, build, verify
```

`npm run check` runs, in order:

| step | what it proves |
| --- | --- |
| `make-specs` | SPECS.md is regenerated from the spec, so it cannot drift from the code |
| `trace` | every dimension in the generator has a sourced row in SPECS.md |
| `audit` | the geometry that was actually built matches those numbers — 54 measurements |
| `build` | all ten GLB files export inside their triangle budgets |
| `verify` | all ten load back through a glTF loader and are the right size and the right way up |

A change that breaks any of them fails the build.

## Using her in another project

The package is the generator, not a file. A host installs it and builds the ship in its
own scene, from the same source this viewer runs:

```bash
npm i github:britten-dev/surprise-model
```

```js
import { buildShip, LODS, SAIL_STATES } from 'surprise-model';

const ship = buildShip({ lod: 'game', sails: 'storm' });
scene.add(ship);
```

`buildShip` returns a `THREE.Group` in the conventions of `docs/CONVENTIONS.md`: metres,
`-Z` forward, `+Y` up, origin at the design load waterline amidships. Building the whole
ship takes a few hundred milliseconds, so it belongs at a loading screen and not in a
frame — but once built, switching sail state is another build, not another download,
which is what lets a ship shorten sail in front of you.

Other entry points, for a host that wants more than the finished object:

| import | gives |
| --- | --- |
| `surprise-model` | `buildShip`, `LODS`, `SAIL_STATES` |
| `surprise-model/spec` | `SPEC`, `PAINT`, `OFFSETS` — every dimension with its source |
| `surprise-model/hull` | `hullModel()`, for siting your own parts against her lines |
| `surprise-model/lod` | the level-of-detail table and the triangle budgets |
| `surprise-model/views` | the named camera stations used for the verification renders |

**three is a peer dependency.** The host provides it, and there is exactly one copy. If
it were a dependency of this package instead, a host resolving three differently would
end up with two copies of the library on one page — two `Vector3` classes, two material
registries, and `instanceof` failing in ways that take a day to find.

Updates carry across by reinstalling: `npm update surprise-model` and redeploy.

## How it is organised

```
SPECS.md              the contract — every dimension, with its source and reliability
docs/research/        the sourced research the spec was synthesised from
docs/CONVENTIONS.md   axes, units and origin
src/spec/spec.js      the spec as code; the only place a number may be written
src/ship/             the generator, one module per region of the ship
src/util/             lofting, interpolation, solid primitives
src/audit/            measures built geometry and pairs it with the spec
tools/                build, audit, trace, render, serve
viewer/               the inspection page and the render harness
```

## The rule about numbers

No dimension may be written anywhere except `src/spec/spec.js`, and every entry there
carries a `source`. `npm run trace` fails the build if a generator dimension has no row
in `SPECS.md` or if a row has no source. `npm run audit` then measures the geometry that
was actually produced and diffs it against those numbers, so a change that quietly
moves a mast is caught rather than admired.

## How she was researched

Eight researchers worked in parallel on the sources, and between them they found something
better than the secondary literature: **her own draught**. RMG plan ZAZ3067, "Lines &
Profile", signed by John Marshall at Plymouth Yard in February 1798 and titled *SURPRISE
late L'UNITE*, is the only surviving lines plan of this ship. The museum's own scan was
measured at 6.0 pixels to the foot, and the hull in this model is lofted from it.

They also found that the RMG catalogue links four plans to her that belong to a different
ship — HMS *Unite*, ex-*Gracieuse*, a 32-gun fifth rate half again her size. The title
cartouche settles it. See `SPECS.md` §2.

The rig comes from David Steel's *Elements and Practice of Rigging and Seamanship* (1794),
from the column headed "28 GUNS. 594 Tons." — which is *her own* establishment column, not
an interpolation, so the rig is the best-evidenced part of the whole model.

The hull was then checked rather than admired: integrating the offsets gives a
displacement of 656 tons against the 657 recorded, with a midship coefficient of 0.777, a
prismatic of 0.614 and a block of 0.477 — all inside the band for a frigate.

## Where the evidence is thin

Unité's own lines do not survive in digitised form. Where a number is reconstructed
rather than recorded, `SPECS.md` says so and gives the period rule it was derived from.
The reference she was matched against is a hand-crafted museum model by The Model
Shipyard, and is itself an interpretation: published plans decide dimensions, the
photograph decides paint and character. The photograph is their work and is not
redistributed here — `docs/PHOTO-ANALYSIS.md` records what it shows, with the colours
sampled from it, so the reading survives without the image. See `reference/README.md`.
