# Close-range stern finish — 4 October 2026

The stern retains the existing loft, seven lights, cabin clearance, deck closure
and rudder. This pass changes the surface finish and reconstructed decoration.
It does not claim new measured carvings from the original Surprise.

The existing research distinguishes the original ship's RMG lines/profile
(ZAZ3067, https://www.rmg.co.uk/collections/objects/rmgc-object-82858) from the
film vessel. The Maritime Museum of San Diego describes the latter as the
former Rose, modified for the film:
https://sdmaritime.org/visit/the-ships/hms-surprise/ (checked 4 October 2026).
Exact foliage, moulding sections and lettering used here are visual
reconstructions, not surveyed details of either vessel.

The old stern UVs deliberately collapsed the upper paint coordinate to black.
They also sampled the wood and normal maps on that same row, stretching fine
vertical marks over the entire transom. The upper stern now has a separate
horizontal timber finish, with UVs in metres, caulk lines, staggered butts,
subtle grain and separate roughness/normal maps. The lower copper and the
existing hull paint coordinates are retained. This adds one material group.

A shallow black nameboard, narrow border and serif SURPRISE lettering replace
the thick metallic lozenge and box-stroke alphabet. The board is 26 mm proud;
lettering is 7.5 mm in relief, with a 2 mm chisel bevel on desktop and a
simplified face on phones. Its finish has fine fibres without a plank seam
running across the letters. Broader leaf faces supplement the scrolling stems.
The name keeps its specified overall width and letter height. Gentilis from
Three.js supplies the glyph shapes; the subset is renamed Surprise Roman and
its redistribution notice is included in src/ship/stern-lettering-LICENSE.txt.

Low scrolling foliage, a framed central shell fan and narrow end channels
replace the row of shiny bosses. The ochre/gold finish is roughened and only
partly metallic. These are deliberately restrained decorative approximations.

The host now places a complete seated photographic duet cutout in the room,
including chairs, feet and instruments. Its 1.257 m seated height fits below
the existing beams; it is 1.885 m wide and sits 1.35 m inside the stern.
The image is an AI-edited reconstruction from the earlier film reference;
the host records its source and full prompt. The figures remain a shallow
animated plane, so extreme lateral views do not have full body parallax.

The cabin has separate floorboards, recessed bulkhead panels, cupboards,
beams, a music stand and a hooded lamp. Dark casing encloses the existing
rudder stock; no steering geometry is removed. This furniture, its dimensions
and decorative sections are artistic reconstruction, not a measured cabin
plan. The original 1.34 m cabin clearance is retained. Warmth comes from
the room materials, not an unshadowed point light reaching through the hull.

The close finish now covers all wooden counter planking above the copper.
Window joinery uses a separate physical-scale UV channel along each piece's
grain, instead of stretching one map across every bar. Slight crown-glass
normal variation affects reflections; the host excludes transparent glass
from opaque shadow casting. Static custom materials explicitly participate
in baked contact shading, including white vertex colours on the phone tier.

Desktop allowance increases by 40,000 triangles for the optional crew-bearing
library models; this follow-up stays within that allowance and the browser's
1.5 million uncrewed limit. Phone
letter faces and scrolls are simplified to retain the existing 80,000 limit,
including the library's optional crew.
