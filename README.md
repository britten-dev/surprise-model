# HMS Surprise — parametric model

A reusable 3-D asset project: a parametric generator that builds the Royal Navy frigate
**HMS Surprise** — historically the French corvette **Unité**, launched 1794, captured
by HMS Inconstant in April 1796 and taken into the Royal Navy — and exports her as glTF
at three levels of detail and four states of canvas.

This is an asset project, not a game. Nothing here is downloaded: the hull is lofted
from an offset table, every fitting is generated, and every texture is drawn in code.

![the reference](reference/surprise-reference.jpg)

## What it produces

| LOD | Triangles | Use |
| --- | --- | --- |
| `hero` | 200–500 k | Close inspection. Every ratline, gun, port lid and gallery light. |
| `game` | 30–60 k | A ship at gameplay range. Hull about 38 m. |
| `distant` | under 5 k | A silhouette on the horizon. |

Four sail states: `full` (courses, topsails, topgallants, staysails and three
headsails, as in the reference photograph), `topsails`, `storm` (reefed foresail and
close-reefed main topsail) and `furled`.

## Commands

```bash
npm install
npm run build     # export every GLB to build/
npm run audit     # measure the built model and diff it against the spec
npm run trace     # prove every generator dimension traces to a sourced SPECS.md row
npm run render    # verification renders to renders/
npm run viewer    # inspect interactively at http://127.0.0.1:8099/viewer/
```

`npm run check` runs trace, audit and build in order, and is the gate a change has to
pass.

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

## Where the evidence is thin

Unité's own lines do not survive in digitised form. Where a number is reconstructed
rather than recorded, `SPECS.md` says so and gives the period rule it was derived from.
The reference photograph is a hand-crafted museum model and is itself an
interpretation: published plans decide dimensions, the photograph decides paint and
character.
