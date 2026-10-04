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
