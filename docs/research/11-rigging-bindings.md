# Rigging bindings and an optional watch — 3 October 2026

The browser host now omits people at the user's request. The model library keeps
its existing default watch for other consumers; `buildShip({ crew: false })`
constructs an empty crew group and skips its geometry and motion work.
`preloadSurfaceAssets({ crew: false })` downloads the fittings-only GLB. The
wheel, wheel stand and binnacle retain exactly their original vertices and
materials. The Blender crew prototype is parked locally, outside the release.

## Evidence and reconstruction

David Steel's [The Elements and Practice of Rigging and Seamanship (1794)](https://whalesite.org/anthology/1794_Steel_Elements_and_Practice.htm),
the sections on belaying pins (p.159), slings/straps (p.189), mast wooldings
(p.193) and rigging yards (pp.201–205), describe the relevant period practice.
Wooldings have thirteen to fifteen close turns; his mainmast carries ten to
twelve, foremast one fewer, and mizzen one under the hounds. Wooden racks,
turned pins, served sling eyes and rope-strapped wooden blocks are all
appropriate to the period. This is general rigging evidence, not Surprise's
own surviving fitting schedule.

The cinematic model adds thirteen-turn mast bindings with adjacent hoops,
served collars and stop cleats parented to the bracing yards, shaped belaying
pin handles, crossed turns and hanging rope hanks. Their small dimensions and
individual positions are artistic reconstruction. Pin length and spacing still
come from the existing ship specification. Selected pins carry hanks, rather
than making every pin identical. Rope geometry is merged by material.

Three simple mast-foot leads show open wooden cheeks, sheaves, axles and strops.
The line turns through the sheave toward the rail; the complete purchase above
is still simplified. This addition is not a claim to have reconstructed every
halyard or corrected the existing brace routing. The full running-rigging plan
remains research work. Short collars follow their yards during bracing, rather
than floating at the original yard angle.

Extra bindings and hanks are restricted to cinematic quality. Hero retains its
900k limit and phones keep their original lightweight rig. Detail is allocated
to visible fittings, not additional subdivisions of already smooth hull areas.

## Measured cost

Across the authored desktop tiers the previous watch occupies 299,096
triangles and 239 separate mesh objects. Omitting it also removes its material
instances and shadow submissions. The fittings-only download is 3,236,888 bytes,
compared with 7,575,416 bytes for the shared crew/fittings asset. These are file
and geometry counts, not frame-rate guarantees.

`tools/check-crew-option.mjs` checks both modes and preserves the library's
default crew contract. `tools/extract-fittings.mjs` verifies exact retained
vertex positions and excludes every crew root. The app's authored-detail
check covers all eight weather/canvas combinations, no crew download, retained
wheel and rudder motion, and screenshots of the fittings.
