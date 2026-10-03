# Stern and quarter-gallery joinery — 3 October 2026

## Evidence and scope

The USS Constitution Museum's [The Quarter Galleries](https://ussconstitutionmuseum.org/2017/02/03/the-quarter-galleries/),
by Naval History & Heritage Command historian Margherita Desy (3 February
2017), discusses the ship's 1794 plans, glazed galleries and their wooden
construction. This is evidence for comparable period construction, not a
source for Surprise's window count, dimensions or moulding profiles.

The existing layout, including its uncertainty recorded in research §08,
is retained. This increment gives the previously flat wooden strips real
thickness. The approximately 4 mm eased edge is an artistic reconstruction;
no newly measured Surprise joinery is claimed. Stern piers stand a further
6 mm forward of the adjoining frames to avoid coincident surface faces.

## Geometry and cost

`src/ship/window-joinery.js` builds closed strips along the actual stern or
badge surface normal. A bevelled front edge catches sunlight and the side
faces provide depth beside the recessed panes. Glazing bars are split at
crossings so horizontal and vertical faces do not coincide. Mirrored quarter
galleries preserve outward winding. The existing material batches, glass
material, reflections, heavy-weather deadlights and phone tier are retained.

Cinematic and hero gain 5,790 triangles without extra texture assets, mesh
objects or draw calls. Full-canvas ships without people measure:

| Quality | Fair weather | Heavy weather |
| --- | ---: | ---: |
| Cinematic | 1,375,972 | 1,379,490 |
| Hero | 798,284 | 800,506 |
| Game/phone | 63,964 | 65,246 |

Optional desktop figures add 299,096 triangles. All combinations remain
inside the library and host limits; the hero library budget is nearly full.

## Verification

`tools/check-window-joinery.mjs`, included in `npm run check`, verifies closed
geometry, positive volume and front-face visibility on both orientations,
finite attributes, expected detail tiers and the host's triangle limits in
fair and heavy weather. The app's `tools/check-stern-joinery.mjs` captures the
stern, both quarter galleries and fitted deadlights in the browser; use
`--production` for the compiled release. The app detail programme records
production rendering checks and frame cost.
