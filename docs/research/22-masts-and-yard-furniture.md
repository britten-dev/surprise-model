# Masts, spars and working rig — 4 October 2026

## Evidence and limits

David Steel, [*The Elements and Practice of Rigging and Seamanship* (1794)](https://whalesite.org/anthology/1794_Steel_Elements_and_Practice.htm),
sections on mastmaking, yard construction and the progressive method of rigging,
describes built-up masts, cheeks, hoops and wooldings; scarfed lower yards;
yardarm cleats and rope eyes; horses, stirrups and topsail Flemish horses. These
are the basis for this pass. The existing spar lengths, diameters, taper and
mast stations remain those documented in `04-spars-and-rigging.md`.

Small fitting dimensions, their placement and the weathered finish are visual
reconstructions. This is not a complete reconstruction of Surprise's individual
rigging inventory. The existing simplified brace leads and overlapping mast
axes remain. Footropes are supported geometric curves which follow the yard;
there is no independent rope dynamics or crew-weight solver.

## Changes

- All main spars have physical texture scale: 0.8 m across and 4 m along the
  timber per tile, with restrained grain relief, long checks and roughness.
  Bright mast timber and blackened yards have separate colour maps. Circumference
  seams share normals, and cinematic spars use 24 radial sides instead of 16.
- Fore/main lower masts have narrow construction joints. The hounds have supporting
  cheeks; square mastheads have iron straps and small bolt heads.
- Tops have rounded forward corners, a real mast opening, and dark planked surfaces.
- Lower yards have scarf hoops. Yardarms have stop cleats and seized collars.
  Horses and their stirrups run beneath lower, topsail and topgallant yards and the
  spritsail yard. Topsail yards also carry short outer Flemish horses.
- Rope normal maps use a continuous three-strand lay. Texture U follows the rope's
  length with a nominal six-diameter pitch. Animation retains its separate,
  normalized attachment coordinate, so texture scaling cannot move an endpoint.

Fine hardware uses the existing camera-dependent detail controller. Footropes
remain part of the silhouette at hero/cinematic quality, with simplified curves
on hero. Its sail head ties also keep every attachment with fewer subdivisions.
Small construction fittings are cinematic-only. Phones keep their
lighter rig, gaining the spar/rope finishes and shaped tops. Woolding rings and
served yard collars use fewer redundant circular subdivisions to offset the
new geometry. No downloaded asset or per-frame geometry allocation is introduced.

## Checks

The host's `tools/check-spar-detail.mjs` captures matched live-before/production-after
views at the mast, yard centre, yardarm and bowsprit, plus the full rig. It checks
finite geometry, yard attachment through bracing, eight weather/canvas states
and existing desktop/phone triangle ceilings. `--phone` uses WebKit.

The model's `tools/check-rigging-anchors.mjs` independently measures running-rope
endpoints through wind reversals and furling. The host's adaptive-detail fixture
checks zoom transitions, stable GPU allocation and sampled render cost.
