# Channel deadeyes and lanyards — 3 October 2026

## Period evidence and limits

David Steel's [The Elements and Practice of Rigging and Seamanship (1794)](https://whalesite.org/anthology/1794_Steel_Elements_and_Practice.htm),
pp.158 and 198, describes elm deadeyes with three holes, eased mouths and a
perimeter score, paired by a lanyard. The shroud encloses the upper eye and is
secured by seizings. The lanyard starts with a knot and passes successively
through the corresponding upper and lower holes; its spare length is secured
around the parts and to the shroud. This supports the assembly, not exact
Surprise fitting dimensions.

The existing channel positions, deadeye counts and principal diameters remain
from research §04/§06. Separation, hole dimensions, groove profile, wear,
seizing arrangement and small iron radii are explicitly reconstructed. Each
smaller backstay eye scales its thickness and holes proportionally. Detailed
running rigging elsewhere is still simplified.

Steel's rope-making text discusses size by circumference. The existing 4.5-inch
lower-shroud assumption was labelled circumference but used directly as a
diameter. Dividing by pi changes its model diameter from 114.3 to 36.38 mm. The
4.5-inch starting value remains an assumption, not a recovered ship schedule.
The new upper bindings use the same radius as their attached shroud/backstay.

## Asset and runtime construction

Blender 5.2.2 LTS produces one 826-triangle solid with three actual bores, a
perimeter groove and a packed 512-pixel elm colour map. Short-range occlusion
is baked into vertex colours, including samples inside the bores. The exported
GLB is 260,468 bytes. No extra lighting pass is required. The source script is
`tools/author-deadeyes.py`; the editable workshop stays in `build/`.

At cinematic/hero quality, 58 assemblies each have two eyes. A continuous
lanyard traverses all six bores. The upper shroud loops into the score and has
seizing turns; the lower iron strop leads to a rounded strap and bolt washer.
Rope anchors now meet the upper assembly rather than the former single eye.
Mirrored parts retain outward winding. Wood, hemp and tarred bindings form
three shared batches per mast. A failed GLB download retains open-hole
procedural pairs. Phone and distant tiers skip the download and fine fittings.

## Checks and costs

`tools/check-deadeyes.mjs` checks bore clearance from both sides, mirrored new
fittings, finite attributes, normalized baked shading, all 58 pairs, anchor
alignment, and host triangle limits. It is part of `npm run check`. The existing
platform loft is checked for finite data but excluded from the new-fitting
winding check because its corner-sharing normals predate this increment.

Full fair-weather ships without people measure 1,370,182 triangles cinematic,
792,494 hero and 63,964 game. Optional figures add 299,096 desktop triangles;
the library limits therefore allow 1.7m cinematic and 1.1m hero, while the
no-crew host retains 1.5m/900k. Phone geometry is unchanged. The app records
production frame times and sail/weather checks in its detail programme.
