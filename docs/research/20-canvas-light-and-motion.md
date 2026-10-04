# Canvas light and motion

Period construction reference: David Steel, *The Elements and Practice of Rigging
and Seamanship* (1794), sail-making, pp. 92–103, available in the
[transcription](https://whalesite.org/anthology/1794_Steel_Elements_and_Practice.htm).
His account distinguishes seams, tabling, reef bands, leech linings, corner
pieces and repair work. Those layers provide a better visual cue than uniform
emission through every part of the canvas. The existing sail atlas is a
reconstruction, not a complete transcription of every sail's individual cut.

The blue channel of the existing roughness atlas now stores optical thickness.
Thin canvas, seams, reef bands, hems, reinforcing corners and the existing sewn
patches have different values. Runtime lighting reads the actual directional
lights and attenuates the warm backlit contribution through those layers.
Self-emission is reduced to a small fallback; diffuse moonlight remains visible.
Canvas remains opaque and double-sided, with the existing shadow and reflection
passes. No screen-space transmission or additional texture allocation is used.
The optical coefficients are artistic approximations, not measurements of flax.

Checks: `node tools/check-motion.js` (22 checks), and the consuming app's
`tools/check-canvas-detail.mjs` in Chromium and phone WebKit. Matching images show
morning, golden backlighting, close cloth at two instants and moonlight; tests
check the thickness range and shader errors. Draw calls and triangles are
unchanged by the lighting pass.

The next pass broadens the pressure shape and introduces restrained folds from
the loaded clews. It replaces the former repeating edge ripple; this is still
an artistic pressure surface, not a cloth simulation. Slow, overlapping pressure
changes animate the belly while the head and loaded corners remain pinned.
Close views add ropebands around the tapered yards and sewn rope eyes at the
clews. Ropebands share the yard's movement, survive furling, and disappear below
a pixel-size threshold; the phone model omits them. Running-rigging flutter is
now phased in the ship's frame so travel over the ocean cannot change its rate.

`check-rigging-anchors.mjs` checks full, reefed and furled attachments, finite
ropebands, their close/distant detail selection, and translation-invariant
flutter. The app's sail/cabin check exercises the complete furling and setting
sequence and checks the triangle budget.
