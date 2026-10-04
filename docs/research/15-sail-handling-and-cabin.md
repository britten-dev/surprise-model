# Sail handling and the great cabin — 4 October 2026

## Evidence and limits

- Royal Museums Greenwich [PAE6438](https://www.rmg.co.uk/collections/objects/rmgc-object-120588), Edward William Cooke's annotated square-rig gear drawing, distinguishes sheets, clew lines and reefing gear. This is evidence for the equipment, not a measured Surprise animation.
- The ship operator's [Statsraad Lehmkuhl trainee handbook](https://oceantrainingcourse2025.esa.int/wp-content/uploads/2024/06/English_Handbook_S_Lehmkuhl_LQ.pdf), printed pages 62–67, describes giving up sheets, hauling clews and bunts, gathering cloth and securing the roll. This is a later operating square-rigger: its split topsails and exact lead arrangements must not be attributed to Surprise in 1805.

The animation reconstructs the broad sequence: clews rise ahead of the centre,
cloth folds and gathers to the yard, then fills in reverse when set. Staysails
gather to their tacks; the spanker gathers on its boom. Reefed canvas gathers
at its head. Cloth textures and edge ropes remain with the same sail.

This is a controlled morph approximation, not a cloth solver or an exact
sail-handling drill. The 15–25 second durations are compressed for the game.
Yard hoisting, every running-line purchase and men tying gaskets are not
simulated. Crew animation is deliberately outside this change.

## Runtime contract

Build `buildShip({ sails: 'full', animatedSails: true, crew: false })`, then
`createSailHandling(ship, 'topsails')` before `createMotion(ship)`.
Call `setState('storm')` for an order and `update(dt)` each simulation tick.
The animator retains all 15 sails, with position and normal morph targets.
The head stays at its own braced yard; shared deployment uniforms reduce
flutter as the cloth is stowed. Colour and depth passes use Three's same
morph target mechanism. No whole-ship replacement occurs for a sail order.

Interrupted orders start at the current pose. `snapshot` and `restore` retain
a half-completed order across a fair/heavy-weather hull swap. `effectiveIndex`
lets the host interpolate driving force and heel while the sails change.
Static exports retain their existing four discrete suits.

## Stern lights

The existing seven-window layout, sill, head and glazing bars remain tied to
the ship specification. Apertures are cut in both the outer and inner stern
skins, interpolating the loft UVs and normals; solid recessed surrounds join
the window to the cabin. An enclosed interior prevents sky or sea appearing
through the opened transom. Its 3.3 m depth is a visual reconstruction, not a
measured cabin plan. Thin alpha-blended glass gives a restrained reflection;
it is an inexpensive approximation to crown glass, not optical refraction.

Existing heavy-weather deadlights cover the windows. The host supplies a
film-derived photographic duet with slight local movement, hides it behind
the deadlights and stops it after the cabin is stove in or the vessel founders.
The image, its source and edit prompt belong to the host app, not this model.

## Checks

The complete model audit, motion checks, joinery checks and GLB exports pass.
The host checks every sail's state, uninterrupted hull identity, reversing an
order, weather-change continuity, window ray clearance, visible image motion,
deadlights, damage and repair. Desktop and phone render paths are inspected.
