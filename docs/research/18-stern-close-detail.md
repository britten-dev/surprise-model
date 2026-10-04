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
the thick metallic lozenge and box-stroke alphabet. The board is 18 mm proud;
lettering is 7 mm in relief on desktop, with a simplified face on phones.
The name keeps its specified overall width and letter height. Gentilis from
Three.js supplies the glyph shapes; the subset is renamed Surprise Roman and
its redistribution notice is included in src/ship/stern-lettering-LICENSE.txt.

Low scrolling foliage, a framed central shell fan and narrow end channels
replace the row of shiny bosses. The ochre/gold finish is roughened and only
partly metallic. These are deliberately restrained decorative approximations.

The host sizes the existing cropped musician photograph from an approximate
23 cm head height, rather than filling the cabin wall. Its image width is
1.28 m and it sits 1.25 m inside the stern. This is still a shallow animated
photographic scene, not a fully modelled cabin performance.

Desktop allowance increases by 40,000 triangles for the optional crew-bearing
library models; the browser's 1.5 million uncrewed limit is unchanged. Phone
letter faces and scrolls are simplified to retain the existing 80,000 limit,
including the library's optional crew.
