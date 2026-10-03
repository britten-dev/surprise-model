# Hull surface and reflected light — 3 October 2026

The model remains the historical Surprise, ex-Unité, described by the
[1798 sheer/body draught, ZAZ3067](https://www.rmg.co.uk/collections/objects/rmgc-object-82858)
and the companion deck plan already discussed in §02. The film replica and
the historical ship are not interchangeable sources for construction details.
This pass changes surface response, not the traced hull shape.

## Evidence and limits

The [National Museum of the Royal Navy's Victory conservation log](https://www.royalnavymuseums.org.uk/hms-victory-conservation-log)
describes original exterior planking mainly of oak, with beech where oak was
unavailable, elm in the lowest twelve strakes, and oak planks averaging about
25 feet. It also distinguishes this from modern replacement materials. This
is evidence for long structural timber on a contemporary British warship,
not a Surprise scantling schedule. Modern restoration colours and timber
species are not treated as a photographic record of an 1805 hull at sea.

The procedural surface uses reconstructed 235–310 mm plank breadths and
20-foot lengths staggered within a 40-foot repeat. These dimensions and the
joint layout are visual approximations, not measurements from the draught.
We have not identified Surprise's complete original planking expansion or
scarph schedule. Caulking widths, paint abrasion, cupping, oxidation and the
drain rate of the wet film are likewise restrained rendering choices.

## Material construction

Colour, height and roughness are generated separately from the same course
layout. A rust stain therefore does not become a dent. The V positions follow
the loft's named height features, calibrated at midships, so the courses rise
with the existing sheer. The longitudinal grain repeats seamlessly; it is
subordinate to intact paint. General isotropic micro-bump is reduced on the
hull so it does not resemble stone or crumpled foil.

Copper retains its own colour. Thin laps, nail relief and sheet-to-sheet
colour variation are reduced, while irregular weathering remains. Dense
surface weathering reduces the metallic response as an approximation to an
oxide layer; this is not a measured layered optical model. The copper/paint
boundary and existing paint scheme are unchanged.

The host may supply a two-sided water-contact profile to `createMotion`.
Fragments below the highest recent contact darken and become smoother, then
dry gradually as the profile drains. A missing profile retains the existing
uniform wetness behaviour for other hosts and exported assets. No additional
geometry or draw pass is required for this treatment.

Gunport reveals also carry a small baked cavity gradient, darker toward the
gundeck. This supplements the existing coarse ambient-occlusion bake without
putting a false red backing plate across the opening. It is a lighting
approximation; lining depth and port dimensions retain their previous values.

## Verification

The model's trace, audit, motion, fittings and GLB checks cover the existing
shape and export contracts. The app's `check-hull-cinema.mjs` compares fixed
close and aft-quarter views on both sides, in morning, grey daylight and
rough weather, and reports actual texture sizes, geometry and frame times.
The app separately checks wet-film history, heel, canvas changes, hull flow
and stern-wake stability. These checks do not establish historical accuracy
for the explicitly reconstructed surface dimensions above.
