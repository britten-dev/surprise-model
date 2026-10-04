# Stern deck closure — 4 October 2026

The loft ends at the sternpost (z = 18.4404 m), while the stern closure
continues aft. Both existing deck meshes stopped another 0.4 m forward of the
post. This left approximately 2.45 m missing at the centre of the quarterdeck.
The cabin lining only covered part of the opening, with its ceiling above the
quarterdeck, so some views showed lining and others showed the sea.

The quarterdeck and gundeck now continue to their intersections with the
existing stern-shell triangles. The intersection uses the deck's camber;
mesh stations include the boundary's bends. Width tapers into the round-aft
transom rather than ending in a rectangle. Matching fore/aft UV coordinates
continue the same plank texture across the old endpoint, with no overlapping
patch or new draw call. The side lining also reaches the sternpost.

The cabin ceiling now fits below the standing quarterdeck. Its reconstructed
window band is lowered as needed to keep the full-height lights below that
ceiling; the quarter-gallery lights follow the same band. Window height is
unchanged. The host scales its seated-musician plate to fit inside the cabin.
These are consistency corrections to the existing model, not new measurements
from a historical source. The small ceiling and frame clearances are visual
construction allowances.

`tools/check-afterdeck.mjs` casts 780 downward deck probes across four detail
levels and checks cabin clearance. No probes miss; cinematic camber error is
below 0.4 mm (under 10 mm at the distant silhouette tier). The quarterdeck
continues to approximately z = 20.49 m and the gundeck to z = 20.06 m.
The host checks both quarters, overhead, through the windows and in heavy
weather, followed by its cabin-animation and boarding-water regressions.
