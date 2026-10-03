# Raised hull timber and painted plank detail — 3 October 2026

## Evidence and reconstruction limits

This retains the model's existing main-wale and sheer-moulding positions from
research §08 and the loft tied to Surprise's ZAZ3067 draught in §02. No newly
recovered Surprise planking expansion or fastening schedule is claimed.

Trevor Kenchington's [The Structures of English Wooden Ships: William
Sutherland's Ship, Circa 1710](https://www.cnrs-scrn.org/northern_mariner/vol03/tnm_3_1_1-43.pdf),
p.19, explains projecting wales with level upper/lower faces outside thinner
planking. Its subject is earlier English construction; it supports that
structural distinction, not exact scantlings or joint patterns for a captured
French corvette of 1794. Those earlier dimensions are not copied here.

The [Royal Navy Museums conservation record](https://www.royalnavymuseums.org.uk/hms-victory-conservation-log)
distinguishes Victory's original long oak planks from later replacement
materials. The [Queen Anne's Revenge conservation project](https://www.qaronline.org/conservation/artifacts/ship-components)
describes wooden treenails among the recovered ship components. These are
comparative evidence for construction, not Surprise-specific measurements.

The wale's 101.6 mm maximum projection is a reconstruction bounded by half
the model's existing extreme-minus-moulded beam difference. The moulding's
26 mm projection, 5–8 mm eased edges, 22 mm subdued fastening marks and
609.6 mm fastening grid are likewise visual reconstructions. Existing
235–310 mm plank breadths and 20-foot butt pattern remain as documented in
§10. Fastening marks align to a common grid across staggered planks and stay
flush beneath the paint, rather than becoming protruding metal rivets.

## Rendering

One additional hull mesh combines both sides' closed, bevelled timber.
It samples the actual rendered loft and shares its UV coordinates and hull
material. This avoids a second hull approximation floating off the shell.
Ends taper into the stem and quarters, with closed end grain buried inside
the shell. Material sampling stays clear of the copper boundary so the
wood does not inherit copper's metalness. It adds no texture assets.

The main wale gains a visible upper landing and lower edge. Cinematic/hero
also receive the shaped ochre moulding. Plank seams have stronger shallow
relief, modest board-to-board paint variation, faint fastening plugs and
short end checks. Copper colour and relief are retained. The new timber uses
the same two-sided water-contact history as the hull, including slow drying.
The original audited shell, gunport cuts and collision/sailing geometry are
unchanged.

## Costs and checks

| Tier | Added triangles | Full, fair, no crew | Full, heavy, no crew |
| --- | ---: | ---: | ---: |
| Cinematic | 8,672 | 1,384,644 | 1,388,162 |
| Hero | 5,792 | 804,076 | 806,298 |
| Game/phone | 1,456 | 65,420 | 66,702 |

The distant tier is unchanged. The hero library allowance rises from 1.1m to
1.12m to accommodate its optional 299,096-triangle crew; the application's
900k hero / 1.5m cinematic limits remain unchanged. One material batch and
no extra textures are added. The app records complete frame cost separately,
including reflected and shadow views.

`tools/check-hull-sides.mjs` verifies closed edges, finite attributes, mirrored
visibility, outward normals, actual hull projection, clear gunport height,
wet-profile integration and fair/heavy budgets. It runs in `npm run check`.
The app's `check-hull-cinema.mjs` inspects nine views, including both quarters,
the bow and stern ends of the planking, overcast/storm conditions and phone
WebKit. The compiled renderer must use the water-contact profile on the new
joinery, not only carry its metadata.
