# What the reference photograph actually shows

A hand-crafted museum model by **The Model Shipyard**, photographed from the port bow
under a full suit of canvas against a warm studio backdrop, 800 × 600. It is published on
their own site: <https://www.stephensandkenau.com/ship/hms-surprise/>

**The photograph is not in this repository.** It is their work, not ours, so what is kept
here is the reading of it rather than the image: the paint bands with the hex values
sampled off them, the details visible on the model, and where the model is interpretation
rather than evidence. Everything the photograph decided is written down below and cited
from the relevant rows of `SPECS.md`, so the work is reproducible without it. Anyone who
wants the comparison tools to run can put their own copy in `reference/` — see
`reference/README.md`.

The brief says the photograph decides paint and character while published plans decide
dimensions. So the photograph needs reading carefully rather than from memory. These
notes come from magnified crops and from sampling the pixels directly.

## The paint banding, from the rail down

Sampled on vertical scan lines at three stations. Colours are the pixels as
photographed, under warm studio light — they are the *target appearance*, not the
pigment values, which are in `SPECS.md`.

| Band | Extent | Sampled | Note |
| --- | --- | --- | --- |
| Cap rail and bulwark | above the ports | near-black, `#2b2320`–`#3d1903` | Belaying pins along it in natural wood. |
| **Ochre gunport strake** | the gundeck battery row | `#f8cf7d`, `#eabc66`, `#dba55d` | The ports are cut into this band. |
| Black topsides and wales | strake down to the waterline | `#452e26`, `#2e281c` | The broadest band and what gives her her colour at a distance. |
| Lower hull | below the waterline | `#982f0f`, `#93401e` | Warm red-brown. Reads as bare or lightly weathered copper, never green. |

**A reconciliation.** The brief describes "black topsides with the gunport row set into
the black, thin ochre trim mouldings along the sheer". At full size that is exactly how
the model reads, because the black is much the largest area. Magnified, the ochre is
not a moulding but a **strake**, and the gunport row sits inside it. Both readings are
of the same object; the model follows the magnified one, which keeps the character the
brief asked for — a predominantly black ship with ochre trim — while being what the
photograph shows.

## Details visible on the model

* **Gunports** — around eleven per side in the main row, with black muzzles run out.
  The insides of the open ports show **red**, the usual treatment for port linings and
  inboard works.
* **Head** — three headrails curving up to the beakhead, in ochre against the black.
  Gratings in the head. A pale figurehead, a standing human figure, white with blue
  drapery.
* **Bow** — anchors catted, stocks canted out over the rail. Bowsprit with gammoning
  and a dolphin striker; the whole array of head stays and bobstays present.
* **Waist** — white boats nested on skid beams amidships, at least two, plus a further
  boat aft. Hammock cranes and netting along the rail.
* **Channels** — full length, with deadeyes and chainplates carried down onto the black.
* **Stern** — quarter galleries with glazed lights, ochre framing on black, gilt work.
* **Rig** — three masts, all crossing royal yards. Full suit: courses, topsails,
  topgallants, staysails between the masts and three headsails. Sails are a warm
  off-white, not white.
* **Colours** — the sails photograph at roughly `#ddd6c4` in the light and `#a89880` in
  shade, so the cloth is cream, not bleached white.
* **Ensign** — flown at the mizzen, blue.

## One place the model and the ship differ, and the model is followed anyway

The reference model's lower hull is **bright wood, not copper**. That is normal for a
display model and it is why she shows so much more black than this model does: her black
paint runs right down to the waterline, whereas a coppered ship's black stops where the
sheathing begins, about 2 ft 9 in above the load waterline.

*Surprise* was certainly coppered. The Progress Book entry quoted in the RMG catalogue
for her own draught says she "was docked on 15 February to be recoppered, and launched on
2 March" — six weeks before the plan was signed. So the sheathing is built, and the black
band is correspondingly narrower than the photograph's. What the photograph is followed
for is the *colour* of the lower hull: warm brown, the tone of copper a few months in the
water, and never the verdigris green of long immersion.

## Where the model is an interpretation, not evidence

The Model Shipyard build is a commercial museum-quality model, not a scale reproduction
of a surviving draught. It follows the general convention for a British frigate of the
period rather than the specific French-built hull of *Unité*. So it is trusted for
**paint, ornament, sail set and overall character**, and not for hull form, station
sections, spar lengths or the position of anything. Those come from `SPECS.md`.
