# Mast tops and lubber's holes — 4 October 2026

The former opening was only 1.4 lower-mast diameters wide: clearance around
the mast, not convincing climbing access. A solid transverse block also
stood in for the entire supporting frame.

## Evidence and interpretation

David Steel, [*Elements and Practice* (1794)](https://whalesite.org/anthology/1794_Steel_Elements_and_Practice.htm),
pp.37–39, gives the opening width as two-fifths of top breadth, its length
as thirteen-fourteenths of that width, and its aft inset as one-fifth of top
length. His close tops have deal flooring, an elliptical fore edge, an elm
rim, tapered ribs, futtock-plate mortises and four stanchions for an aft rail.
His rigging instructions place futtock staves as far below the trestles as
the cap is above them, with ratlines beginning below the staves.

These are period construction rules, not dimensions surveyed on Surprise.
Opening length interprets Steel's unqualified “breadth” as the hole breadth;
using overall top breadth would exceed the available platform length. The
existing overall top dimensions and two-inch flooring are retained. Small
beam sections, deadeye size, rail height, fastening locations and finishes
remain reconstruction. The simplified overlapping lower/topmast axes remain;
this pass does not claim a complete masthead and fid reconstruction.

## Built geometry

- Main opening: 1.9812 × 1.8397 m, with about 0.583 m unobstructed beside each
  trestletree. Fore passages are 0.513 m, mizzen passages 0.454 m.
- Separate longitudinal trestletrees and transverse crosstrees; no support
  closes the access passages. Openings survive both tier and distance changes.
- Cinematic deals have small bevels, narrow joints and varied grain placement.
  Raised radial ribs, a broad rim and outer bead break up the former plain slab.
- Aft rails have four octagonal posts and a rounded handrail. Side deadeye
  pairs have three bored holes, reeved lanyards, strops and iron plates.
- One shared coordinate definition places topmast-shroud feet and the futtock
  attachments on their physical fittings. Ratlines and staves intersect the
  actual sagging lower shrouds. Futtock ratlines provide an outside climbing path.

## Validation and cost

`tools/check-mast-tops.mjs` checks 24 tier/distance/mast cases with raycasts
through actual geometry, verifies floor/support hits and checks every full-detail
shroud foot against both rope and hardware after ship transforms. Dimension
audit: 58/58; existing motion checks: 22/22; running-rigging endpoint error
remains below 0.002 mm through bracing, wind reversal and furling.

Production host: 1,554,750 fair / 1,558,268 heavy triangles; hero 939,578 /
941,800; phone 81,967 / 83,249. Controlled M2 Max astern render samples:
adaptive median 9.4 ms, worst 10.1 ms; full detail median 11.0 ms, worst 12.2 ms.
This times detail selection, reflection and rendering with a GPU finish; it
excludes the complete simulation and is not a mobile performance promise.
Astern selected geometry is 906,362 triangles; far 738,866. Repeated zoom and
weather transitions retain 453 geometries / 130 textures after warm-up.

The host's revised guards are 1.6m / 960k / 84k. Library export allowances
include optional crew: 1.88m / 1.26m / 88k / 6.5k. Browser snapshots exercise
fair/heavy weather and all four canvas states in Chromium and phone WebKit.
