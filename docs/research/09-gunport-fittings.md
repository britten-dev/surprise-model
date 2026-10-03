# Gunport lids and lifting spans — researched detail pass, 3 October 2026

This pass models a plausible working arrangement for the existing 9-pounder
openings. It does **not** claim that the small ironwork survives in a measured
Surprise fitting schedule. The hull identity remains the 1794 Unité taken into
British service as Surprise, with the correct 1798 draughts discussed in §02.
The film vessel, the fictional ship and the historical vessel are separate evidence.

## What the period texts establish

- [Falconer, *An Universal Dictionary of the Marine* (1769), PORTS](https://whalesite.org/anthology/1769_Falconer_Dictionary_of_the_Marine.htm)
  describes lids hinged along the upper edge, closing when guns are drawn in
  to exclude a heavy sea. This establishes the hinge orientation and purpose;
  it does not give this ship's bolt pattern or paint scheme.
- [Steel, *The Elements and Practice of Rigging and Seamanship* (1794), p.233, PORT-TACKLES](https://whalesite.org/anthology/1794_Steel_Elements_and_Practice.htm)
  describes a span with a block at its bight, its ends led through the ship's
  side and secured to the port's ringbolts. The visible exterior legs are
  represented here. The internal runner, blocks and fall are not modelled.
- [Royal Museums Greenwich, SLR2396, *Warship, circa 1825*](https://www.rmg.co.uk/collections/objects/rmgc-object-68355)
  records a **later proposed** chain-strop/lever mechanism. That mechanism is
  excluded from this 1805 scene. The object's black exterior/red interior is
  contextual evidence only, not proof of Surprise's precise port-lid colours.

These links are transcriptions of primary period texts and the museum's own
object record, consulted on 3 October 2026. No dimensions have been inferred
from a thumbnail or from the later mechanism.

## Reconstruction choices

`src/spec/parts/ports.js` labels every new fitting dimension RECONSTRUCTED.
Four outer boards crossed by four inner boards, their relative thicknesses,
2.5 mm edge easing and 1.6 mm seams are representational joinery choices. A
concealed central web prevents seams crossing into pinholes. The red inner
face continues the model's existing inboard colour treatment; its exact hue
and application to Surprise are unverified. No blood-concealment explanation
is used for red paint.

The paired 45 mm hinge straps, 30 mm barrels, 20 mm fastenings, 66 mm lifting
rings and 14 mm rope are scaled to fit this model's openings, **not measured
Surprise dimensions**. Their spacing and bolt pattern are likewise inferred.
The 110° raised angle is an illustrative sailing pose. Future better evidence
should replace these values in the specification fragment, not be hidden in
geometry code.

The same lid dimensions are used open and shut. The outside boards and iron
straps rotate around the upper axle, exposing the red inner face below the
raised lid. Rope ends follow the rotating rings; the other ends enter the
ship's side above the port. Closed lids retain the existing overlap and
weather behaviour. Fittings are batched by material; phone quality keeps the
two painted faces and omits the small ironwork and ropes.

## Verification

`node tools/check-port-fittings.js` checks both sides, open/shut geometry,
closed coverage, reflected winding, rope endpoints and material batch count.
The application's `tools/check-port-detail.mjs` checks all eight canvas/weather
states, captures open/shut/broadside views and measures complete rendered
frames with the ocean, shadows and reflection enabled. Timings describe the
reported device and view, not a guarantee for every browser or sea state.
