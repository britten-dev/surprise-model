# Sail and rig clearance — 4 October 2026

The reported disappearing shroud ladders were actual intersections. The old
square canvas filled aft (+Z) into its own standing rigging, and yards were
centred on the mast axes. A single rigid rotation also carried course clews
round the mast even though their sheets led to the hull.

David Steel's [1794 rigging instructions](https://whalesite.org/anthology/1794_Steel_Elements_and_Practice.htm)
describe yard trusses/parrels, masthead stays, topmast shrouds set up through
futtock plates, and separate sheets and braces. These support the arrangement,
not exact reconstructed positions or brace angles. The clearances, sail draft,
foot cuts and yard sling heights below remain visual reconstruction.

## Implementation

- Canvas fills forward of its spar; yards stand off the mast and swing around
  its axis with the truss/parrel clearance preserved.
- The lower yards hang farther below the tops. Topmast deadeye rows occupy the
  after part of each top; the physical hardware and shrouds move together.
- Stay collars sit above their yards. The fore preventer parallels the fore
  stay instead of descending steeply into the foresail. Upper sail feet are
  cut to clear the masthead below, rather than using the course's shallow arch.
- A sheeting transform twists each square sail between its head and foot.
  Course feet remain tied to the hull; upper feet follow the lower yard.
  All existing reef/furl morphs are retained. The transform applies after
  morphing in colour, reflection and shadow shaders; CPU vertex queries use
  the same transform, keeping sheets attached and raycasts meaningful.
- Each yard stops before its own standing shrouds. The reconstructed lower
  fans currently limit the lower yards to about 16–19 degrees, while upper
  yards can brace farther. The overall visual ceiling is 55 degrees, with
  45 degrees on the foremast to clear its long forward stays. These are limits
  of this model, not claimed historical measurements or an aerodynamic solver.
- The two fore sails closest to the bowsprit stays have shallower draft to
  leave room for gale-strength flutter. No triangles or per-frame collision
  searches are added. Bounds include the sheeting sweep.

## Verification

`tools/check-sail-clearance.mjs` bakes the same CPU sheeting transform into
raycastable poses, then checks actual standing-rope centre lines and ratlines
against all eight square sails. It covers three geometry tiers, both tacks,
all four suits, partial furling and sampled gale-strength flutter phases.
Rope surface radii and every possible continuous wind phase are not an
exhaustive collision proof. Running-rigging attachment and mast-top hardware
checks are separate regressions.

Production-browser screenshots cover close views of all three masts, both
sharp-braced poses and gathering cloth in Chromium and mobile WebKit. The
existing 1.6m/960k/84k host triangle limits remain unchanged.

## Wind-driven cloth movement

Square sails now move at their free leeches while the head, foot and loaded
corners stay attached. Each sail samples local apparent wind; low pressure
across the cloth strengthens the edge shaking. Shared drivers keep bolt ropes
and canvas together, and integrated phase avoids jumps when pressure changes.
This is a procedural visual approximation, not a cloth solver.

The clearance sweep includes the strongest new edge motion. The host's
`tools/check-sail-motion.mjs` compares rendered pixels in Chromium and mobile
WebKit for drawing, luffing, calm and furled sails. Geometry counts are unchanged.
