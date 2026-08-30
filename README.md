# HMS Surprise — parametric model

A reusable 3-D asset project: a parametric generator that builds the Royal Navy frigate
**HMS Surprise** — historically the French corvette **Unité**, launched 1794, captured
by HMS Inconstant in April 1796 and taken into the Royal Navy — and exports her as glTF
at three levels of detail and four states of canvas.

This is an asset project, not a game. Nothing here is downloaded: the hull is lofted
from an offset table, every fitting is generated, and every texture is drawn in code.

She is built as a ship that has been at sea rather than one that has just left the
dockyard, and that is a deliberate part of the brief: the sheathing is weathered, the
topsides are salt-bleached and streaked with rust from every bolt in them, the canvas is
stained and patched, her watch of thirteen is on deck — and an optional runtime layer
makes her canvas shiver, her rigging swing, her masts work, her colours fly and her men
lean against the heel. See **[A ship, not a model](#a-ship-not-a-model)**.

## What it produces

| LOD | Triangles | Use |
| --- | --- | --- |
| `hero` | 200–500 k | Close inspection. Every ratline, gun, port lid and gallery light. |
| `game` | 30–80 k | A ship at gameplay range, with her watch on deck. Hull about 38 m. |
| `distant` | under 5 k | A silhouette on the horizon. |

Four sail states: `full` (courses, topsails, topgallants, staysails and three
headsails, as in the reference photograph), `topsails`, `storm` (reefed foresail and
close-reefed main topsail) and `furled`.

**The storm state secures her for sea.** `weather: 'heavy'` — which the storm state turns
on by itself — shuts her gunports and houses her guns, ships deadlights over the stern
windows, battens the hatches down under tarpaulins, rigs lifelines fore and aft through the
waist, double-gripes the boats on the skids and puts tompions in the guns on the open
decks. None of it is decoration: every item is something that, left undone, lets the sea
into the ship or lets something heavy go adrift in her.

**The storm state shuts her gunports and houses her guns.** A gundeck port is a couple of
feet above the deck and four above the water amidships, and a frigate running before a
following sea with twenty-four of them open would fill her gundeck. So under a reefed
foresail the lids are down and the battery is housed — drawn in until the muzzles are
inside the planking, elevated to the ring bolts above the ports, breechings bowsed. The
quarterdeck and forecastle guns are not: they fire over an open rail, there is nothing up
there to shut, and in heavy weather they are simply secured where they stand.

`buildShip({ weather: 'fair' | 'heavy', ports: 'open' | 'shut' })` says so explicitly, for
the cases where the canvas and the weather do not agree — a ship can be under her topsails
with her ports already in.

The watch on deck comes with her at the `hero` and `game` levels — thirteen figures, at
the wheel, at the con, at the pumps, at the braces and two in the main top. They are not
decoration. A ship with nobody on her has no scale at all: the eye has nothing it knows
the height of, so her gunports could be a foot high or four, and that is most of why a
rendered ship reads as a model. One man at the wheel fixes every dimension on board.

They are a ship's company and not thirteen copies of one man: the captain aft in a tailed
coat and a cocked hat worn athwartships, the officer of the watch by the binnacle, a
midshipman, the bosun, and the hands in tarpaulin jackets, wet duck trousers and low round
hats. At the size any of them is ever seen, what does the work is not detail but
**silhouette and the pattern of light and dark** — a tailed coat against a short jacket, a
cocked hat against a round one, white lapels on dark cloth. A face does not survive to two
metres; a hat does at two hundred. Each man's colours are written into his vertices, so he
can wear six of them and still cost one draw call.

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
| `audit` | the geometry that was actually built matches those numbers — 58 measurements |
| `check-motion` | she still moves. Every other step here proves something about geometry, and none of them can tell whether the ship is alive — which is exactly the failure the motion layer is prone to, because it finds what it moves *by name* |
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
import { buildShip, createMotion, LODS, SAIL_STATES } from 'surprise-model';

const ship = buildShip({ lod: 'game', sails: 'storm' });
scene.add(ship);

// Optional, and the difference between a ship and a model of one.
const motion = createMotion(ship);
// each frame, after the host has moved the hull:
motion.update(t, { windSpeed: 24, windDeg: 155, heel, pitch, helm, spray });
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
| `surprise-model/motion` | `createMotion`, the runtime movement layer |

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
src/ship/weathering.js  what the sea does to her, drawn as a layer over the paint
src/ship/crew.js      the watch on deck
src/ship/motion.js    the runtime movement layer — the only part of her that is not static
src/util/             lofting, interpolation, solid primitives
src/audit/            measures built geometry and pairs it with the spec
tools/                build, audit, trace, render, serve
viewer/               the inspection page and the render harness
```

## A ship, not a model

Everything above builds a ship that is *correct*. Correct is not the same as convincing,
and the four things that gave her away had nothing to do with her dimensions:

**1. Nothing had ever been to sea.** The paint was evidence, read off a museum model's
photograph, and it was perfectly clean. `src/ship/weathering.js` draws what a commission
does to her — weed and slime in the wind-and-water band, salt bleaching the topsides where
the sea comes over them, rust running down from every gunport hinge and chain bolt,
verdigris mottling the copper, and the black wash out of every scupper. It is drawn as a
separate overlay and composited on top, never mixed into the paint, because *the paint is
evidence and the dirt is not*, and a stain invented here must never be able to move a
colour that was measured.

It is counted in metres of the ship's side, and that is the only part of it that really
matters. One width of the hull map covers three metres, so it is laid along her thirteen
times: a modest two hundred streaks drawn in the map becomes two and a half thousand on
the ship, they overlap into a solid wash, and the result is not a weathered hull but a
repainted one. That was the first version, and it bleached her white.

**2. Half her surfaces had no texture at all.** The inboard works, the port lids, the gun
carriages and the boats were flat colours with no map, and a large flat colour is the
loudest thing on a model after its shape. They now share one modulation map about white,
so each keeps its own sourced colour and gains the unevenness of paint over sawn timber.

**3. Nobody was aboard.** See the watch, above.

**4. She moved as one solid piece.** On a real ship nothing above the deck is still, and
that is what `src/ship/motion.js` is for. It is a layer over a built ship rather than a
change to how she is built, so `buildShip` and the GLB export are untouched and a host
that never calls it gets exactly the ship it had before.

```js
const motion = createMotion(ship);
motion.update(t, { windSpeed: 24, windDeg: 155, heel, pitch, helm, spray });
```

| what moves | how |
| --- | --- |
| The yards | Braced to the wind, and hauled round at nine degrees a second because braces are hauled by hand. Each square sail is hung on its own yard rather than merged into the suit, so the canvas comes round with the spar — which is what a square rig is *for*, and what a merged suit makes impossible. |
| The rig | Every spar, rope and sail leans and recovers together, going as the square of the height above the deck and lagging the hull's roll. This is the *whip*, and everything aloft has to agree about it or the topmen stand in mid-air. |
| Canvas | A ripple runs across each sail from luff to leech and the whole belly breathes with the gusts, dying to nothing at the head, the foot and both leeches, which are bent to a spar and cannot move. The normal is bent with it, or a shivering sail stays evenly lit and reads as plastic. |
| Cordage | Shrouds and stays swing a little at the middle of their span, running rigging three times as far. |
| Colours | The ensign, pennant and jack are re-evaluated on the processor each frame — they are a hundred and fifty vertices between them and the exact surface is worth the microsecond. |
| The wheel | Turns with the helm, and the two men on it follow it with their shoulders. |
| The watch | Every man stands upright in the world rather than square to a heeled deck, and each has a period of his own so that thirteen of them do not sway as one. |
| Wetness | A sea comes aboard and she goes dark and glossy below the line it reached, then dries over about nine seconds. |

Three mechanisms, chosen per part by what that part is: a vertex shader for the merged
meshes aloft, node transforms for the rigid things that have nodes, and rewritten vertices
for the flags. The head of `src/ship/motion.js` says why each.

**What she still cannot do.** The belly of each sail is lofted to leeward for a wind
forward of the beam, and that is baked into the geometry — so bracing the yards round
swings the canvas correctly, but a wind from dead astern would want the bellies the other
way and would need a rebuild rather than a brace. It is why the viewer's gale is set with
the wind on the bow rather than dead aft.

**The weather.** `npm run viewer` has a **gale** button. It puts her in the third light
rig — a daylight Southern Ocean gale, which is a bright grey day and not a dark one — on a
sea of three crossed swells with the wind tearing spume off the crests, floats her on it
by sampling the water under her bow and her quarters exactly as a host would, and runs the
motion layer. `A`/`D` put the wheel over. `node tools/render.js quarter --storm` shoots the
same thing to a file, at one stated instant so the render stays repeatable.

The sea and the wake are the viewer's scenery, not part of the package: a host game has
its own ocean. They are here because a frigate sitting in a mirror is a frigate in a bath,
and she cannot be judged that way.

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
