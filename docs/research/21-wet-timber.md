# Water on the hull

This is a visual approximation of absorbed moisture and draining surface water,
not a fluid or wood-moisture simulation. The existing hull-contact texture now
uses R for the recent crest, G for current sea contact and B for fresh surface
water. A rising crest replenishes B; it decays over 7.5 seconds while the crest
history recedes much more slowly. The host smooths these sampled values at
render frequency to avoid stepped highlights.

The material separates darkened damp timber from the smoother water film.
Uneven drainage follows stable paths in the hull's coordinates and is confined
to the area wetted by the sea. Small streaks are filtered with screen-space
derivatives. Grain and beaten-copper roughness remain in the reflected light.
There are no extra transparent sheets, additive particles or light sources.
The finish adds no triangles, draw calls or GPU texture allocation.

Validation: the app's wetness unit tests cover retained moisture, independent
port/starboard contact, heel, changing canvas, draining film and interpolation.
`check-wet-timber.mjs` renders controlled crest/recession comparisons in Chromium
and WebKit. `check-stern-water.mjs` retains the speed-change flicker check at
0, 60, 600 and 3600 seconds. The first render check caught a fragment-only
derivative in shared vertex declarations; vertex declarations now contain only
the required varyings.
