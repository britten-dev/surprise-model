# HMS Surprise — specification

The contract this model is built against. Every dimension in the generator traces to a
row below, and `npm run audit` measures the geometry that was actually produced and
diffs it against these numbers.

**How this file is maintained.** The prose is written by hand. The dimension tables are
generated from `src/spec/spec.js` and `docs/offsets.json` by `node tools/make-specs.js`,
so they cannot drift from the code. What a person maintains here is the part a machine
cannot: where each number came from, how far it is to be trusted, and what is still
guesswork. `npm run trace` closes the loop from the other side — it fails the build if a
generator dimension has no row here, or if a row has no source.

---

## 1. What ship this is

The French corvette **Unité**, launched 16 January 1794 at Le Havre, built by Jean
Fouache to a design attributed to Pierre-Alexandre Forfait. She was taken on 20 April
1796 in the Mediterranean by HMS Inconstant, bought into the Royal Navy, and renamed
**Surprise** because the Navy already had a Unité. Rated a sixth rate; 126 ft on the
gundeck, 31 ft 8 in extreme breadth, 578 73/94 tons burthen. Fitted at Plymouth
January–May 1798 at a cost of £6,992, which is when the only surviving draught of her was
made. She is the ship of Patrick O'Brian's Aubrey–Maturin novels.

The model is of the **real ship as she was in 1798**, not of the San Diego replica used
in the 2003 film — that vessel is a 1970 reconstruction of the 1757 HMS Rose, a
different ship of a different navy and a different generation.

### The modelling rule

Where the published plans and the reference photograph disagree, **the plans decide
dimensions and the photograph decides paint and character**. The photograph is a
hand-crafted museum model and is itself an interpretation; it is trusted for how the
ship should look and read, not for how big anything is.

## 2. Source register

| # | Source | Grade | What it gives |
|---|---|---|---|
| 1 | RMG **ZAZ3067**, "Lines & Profile", Plymouth Yard February 1798, signed John Marshall, titled "SURPRISE late L'UNITE". [Catalogue](https://www.rmg.co.uk/collections/objects/rmgc-object-82858) · [scan](https://collections.rmg.co.uk/media/2/440/707/j5948.jpg) | PRIMARY | The only surviving lines plan of this ship. Her recorded dimensions, the midship section, the sheer, the wales, the stem and stern profiles. |
| 2 | RMG **ZAZ3068**, "Deck, Quarter & Forecastle", same yard, date and hand. [Catalogue](https://www.rmg.co.uk/collections/objects/rmgc-object-82859) | PRIMARY | The deck plan: the waist, the gangways, the catheads, the round bow. |
| 3 | **David Steel, "The Elements and Practice of Rigging and Seamanship" (1794)**, vol 1 p.50, the column headed "28 GUNS. 594 Tons." [Scan](https://archive.org/download/bim_eighteenth-century_the-elements-and-practic_steel-david_1794_1/page/n67.jpg) | SECONDARY | Every spar length and diameter. This is *her own* establishment column, not an interpolation. |
| 4 | Steel 1794 vol 1 p.42, the fractional taper table and the head and hounds rules. [Scan](https://archive.org/download/bim_eighteenth-century_the-elements-and-practic_steel-david_1794_1/page/n59.jpg) | SECONDARY | How every spar tapers; masthead, doubling and pole lengths. |
| 5 | Steel 1794 vol 2, the rigging warrant for a 28-gun ship of 594 tons. | SECONDARY | Shroud, backstay and bobstay counts; ratlines at thirteen inches. |
| 6 | Steel, "The Elements and Practice of Naval Architecture", the "CENTRES OF MASTS" folio. | SECONDARY | Mast stations, mast rake, bowsprit steeve. |
| 7 | Rif Winfield, *British Warships in the Age of Sail 1793–1817*, via [threedecks 6983](https://threedecks.org/index.php?display_type=show_ship&id=6983) and [Wikipedia](https://en.wikipedia.org/wiki/HMS_Surprise_(1796)) | SECONDARY | Dimensions, tonnage, armament, complement, career. |
| 8 | `reference/surprise-reference.jpg` — a museum model by The Model Shipyard. Read pixel by pixel in `docs/PHOTO-ANALYSIS.md`. | INTERPRETATION | Paint, ornament, sail set, character. Never dimensions. |
| 9 | `docs/research/` — eight sourced research files behind all of the above. | — | Every citation, and an honest account of what could not be found. |

**A trap worth recording.** The RMG catalogue links four plans (ZAZ3181–3184) to
"Surprise (captured 1796)". They are of a **different ship**: HMS Unite, ex-*Gracieuse*,
a 32-gun fifth rate of 142 ft 5½ in. The title cartouche of ZAZ3067 reads "SURPRISE late
L'UNITE"; that of ZAZ3181 reads only "L'UNITE". Do not use ZAZ3181–3184.

---

## 3. Dimensions

### Principal dimensions

| key | metric | period figure | grade | source |
|---|---|---|---|---|
| `hull_length_gundeck` | 38.4048 | — | PRIMARY | §1 ZAZ3067 title cartouche; Winfield via threedecks |
| `hull_length_bp` | 36.8808 | — | MEASURED | §2 126 ft on the gundeck less the stem rake above the LWL and the post rake |
| `hull_length_keel` | 33.074 | — | PRIMARY | §1 ZAZ3067; confirmed by the tonnage arithmetic |
| `hull_beam_extreme` | 9.652 | — | PRIMARY | §1 ZAZ3067; confirmed by the tonnage arithmetic. Measured over the wales, which stand outside the moulded surface the offsets describe |
| `hull_beam_moulded` | 9.4488 | — | MEASURED | §2 breadth box on the ZAZ3067 body plan at 6.0 px per foot; the title-block row is illegible at this resolution |
| `hull_depth_in_hold` | 3.0607 | — | PRIMARY | §1 threedecks citing Winfield BWAS-1793 |
| `hull_tons_burthen` | 578.777 | — | PRIMARY | §1 578 73/94 tons bm; (108.5104 x 31.6667 x 15.83335) / 94 checks exactly |
| `hull_draught_aft` | 4.2799 | — | SECONDARY | §3 Wikipedia, HMS Surprise (1796) |
| `hull_draught_fwd` | 3.5052 | — | RECONSTRUCTED | §3 normal trim by the stern for a frigate of this size |
| `hull_tumblehome_deg` | 15.6 | — | MEASURED | §4 body-plan envelope above the maximum breadth: 0.279 ft of inset per foot of height, +/- 1.5 deg. Note this contradicts the common claim that a French hull tumbles home less than a British one. |

### Decks and bulwarks

| key | metric | period figure | grade | source |
|---|---|---|---|---|
| `gundeck_above_wl` | 1.7729 | 5 ft 9.8 in | MEASURED | §5 gun deck at side 18.65 ft above the moulded base line, LWL at 12.83 ft |
| `quarterdeck_above_gundeck` | 2.032 | 6 ft 8 in | RECONSTRUCTED | §3 Steel, height between decks for a sixth rate |
| `forecastle_above_gundeck` | 1.9812 | 6 ft 6 in | RECONSTRUCTED | §3 Steel, height between decks forward |
| `deck_camber` | 0.127 | 0 ft 5 in | RECONSTRUCTED | §3 Steel, 5 in of round-up across the breadth |
| `forecastle_break_u` | 0.2619 | — | RECONSTRUCTED | §5 aft side of the forecastle 33 ft abaft the stem, from Steel's forecastle-length series |
| `quarterdeck_break_u` | 0.619 | — | RECONSTRUCTED | §5 fore side of the quarterdeck 7 ft abaft the mainmast |
| `forecastle_sheer_rise` | 0 | — | MEASURED | §5 the derived rail matches the traced top-of-side when both upper decks are flat |
| `quarterdeck_sheer_rise` | 0 | — | MEASURED | §5 as above; a rise here would put the taffrail above its measured 29.5 ft |
| `bulwark_break_fairing` | 1.8288 | — | RECONSTRUCTED | §5 a fair run of planking through the break, as the reference photograph shows |
| `bulwark_height_waist` | 1.7526 | — | MEASURED | §8 rail to the top of the channel-wale band, 24.4 ft above base |
| `bulwark_height_quarterdeck` | 1.3208 | — | RECONSTRUCTED | §5 period practice; the rail itself now comes from the offset table |
| `bulwark_height_forecastle` | 1.3208 | — | RECONSTRUCTED | §5 period practice; the rail itself now comes from the offset table |
| `gundeck_above_wl_at_midships` | 1.8999 | — | MEASURED | §5 deck at side 5.82 ft above the LWL at the midship station, plus the full camber to the centreline |
| `side_thickness` | 0.2286 | 0 ft 9 in | RECONSTRUCTED | §4 the ship's side at the ports: plank, timber and inboard plank |
| `rail_cap_thickness` | 0.1016 | 0 ft 4 in | RECONSTRUCTED | §4 the capping over the top timbers |
| `gangway_width` | 1.0668 | 3 ft 6 in | RECONSTRUCTED | §8 gangway wide enough for one man and a hand rope |

### Backbone

| key | metric | period figure | grade | source |
|---|---|---|---|---|
| `keel_straight_length` | 31.6992 | 104 ft 0 in | MEASURED | §6 keel straight bearing about 104 ft; the recorded 108 ft 6 in is the tonnage keel |
| `keel_siding` | 0.3302 | 1 ft 1 in | MEASURED | §6 keel half-siding 0.54 ft off the body plan |
| `keel_moulding` | 0.4064 | 1 ft 4 in | MEASURED | §6 keel and false keel 1 ft 4 in below the moulded base line |

### Gunports

| key | metric | period figure | grade | source |
|---|---|---|---|---|
| `gunport_count_per_side` | 12 | — | PRIMARY | §2 threedecks, 24 x 9-pdr on the upper deck, June 1796 |
| `gunport_width` | 0.762 | 2 ft 6 in | RECONSTRUCTED | §4 Steel, port width for a 9-pounder |
| `gunport_height` | 0.7315 | 2 ft 4.8 in | MEASURED | §8 port sills at 20.4 ft and heads at 22.8 ft above the moulded base line |
| `gunport_sill_above_deck` | 0.5334 | 1 ft 9 in | MEASURED | §8 sills 20.4 ft above base, deck at side 18.65 ft |
| `gunport_spacing` | 2.5908 | 8 ft 6 in | RECONSTRUCTED | §4 12 ports spread over the length available between the bow and the transom |
| `gunport_lining_depth` | 0.2286 | 0 ft 9 in | RECONSTRUCTED | §4 thickness of the side at the ports, plank and timber |
| `gunport_lid_thickness` | 0.0762 | 0 ft 3 in | SECONDARY | §4 Steel, port-lid thickness |
| `qd_port_width` | 0.7112 | 2 ft 4 in | SECONDARY | §4 Steel, quarterdeck port |
| `qd_port_height` | 0.7112 | 2 ft 4 in | SECONDARY | §4 Steel, quarterdeck port |
| `qd_port_sill_above_deck` | 0.508 | 1 ft 8 in | SECONDARY | §4 Steel, quarterdeck port sill |
| `gunport_first_from_stem` | 7.3152 | 24 ft 0 in | RECONSTRUCTED | §4 foremost port clear of the round of the bow on ZAZ3067 |
| `qd_port_count_per_side` | 6 | — | PRIMARY | §2 threedecks, 8 x 4-pdr and 4 x 12-pdr carronades on the quarterdeck |
| `fc_port_count_per_side` | 2 | — | PRIMARY | §2 threedecks, 2 x 4-pdr and 2 x 12-pdr carronades on the forecastle |

### Wales

| key | metric | period figure | grade | source |
|---|---|---|---|---|
| `wale_top_below_deck` | 0.5334 | 1 ft 9 in | MEASURED | §8 main wale upper edge 16.9 ft above base, deck at side 18.65 ft |
| `wale_depth` | 0.508 | 1 ft 8 in | MEASURED | §8 main wale 15.2 to 16.9 ft above the moulded base line |

### Masts and their stations

| key | metric | period figure | grade | source |
|---|---|---|---|---|
| `fore_mast_from_stem` | 4.3053 | 14 ft 1.5 in | RECONSTRUCTED | §04 8 Steel CENTRES OF MASTS, 28-gun column, scaled from a 120 ft 6 in to a 126 ft gundeck: 13 ft 6 in, 0.1120 of the gundeck |
| `main_mast_from_stem` | 21.7551 | 71 ft 4.5 in | RECONSTRUCTED | §04 8 Steel CENTRES OF MASTS, 28-gun column, scaled from a 120 ft 6 in to a 126 ft gundeck: 68 ft 3 in, 0.5664 of the gundeck |
| `mizzen_mast_from_stem` | 32.9057 | 107 ft 11.5 in | RECONSTRUCTED | §04 8 Steel CENTRES OF MASTS, 28-gun column, scaled from a 120 ft 6 in to a 126 ft gundeck: 17 ft 3 in afore the after perpendicular, 0.8568 of the gundeck |
| `main_mast_length` | 24.7904 | 81 ft 4 in | SECONDARY | §3 Steel 1794 v1 p.50, "28 GUNS. 594 Tons." column |
| `main_mast_diameter` | 0.6001 | 1 ft 11.6 in | SECONDARY | §3 Steel 1794 v1 p.50, "28 GUNS. 594 Tons." column |
| `main_mast_head` | 3.4449 | — | SECONDARY | §5 Steel 1794 v1 p.42, head and hounds rules, arithmetic applied to the §3 lengths |
| `fore_mast_length` | 21.9456 | 72 ft 0 in | SECONDARY | §3 Steel 1794 v1 p.50, "28 GUNS. 594 Tons." column |
| `fore_mast_diameter` | 0.5302 | 1 ft 8.9 in | SECONDARY | §3 Steel 1794 v1 p.50, "28 GUNS. 594 Tons." column |
| `fore_mast_head` | 3.048 | — | SECONDARY | §5 Steel 1794 v1 p.42, head and hounds rules, arithmetic applied to the §3 lengths |
| `mizzen_mast_length` | 21.0312 | 69 ft 0 in | SECONDARY | §3 Steel 1794 v1 p.50, "28 GUNS. 594 Tons." column |
| `mizzen_mast_diameter` | 0.4254 | 1 ft 4.7 in | SECONDARY | §3 Steel 1794 v1 p.50, "28 GUNS. 594 Tons." column |
| `mizzen_mast_head` | 2.3368 | — | SECONDARY | §5 Steel 1794 v1 p.42, head and hounds rules, arithmetic applied to the §3 lengths |
| `fore_mast_rake_deg` | 0.1 | — | SECONDARY | §8 Steel, Naval Architecture, CENTRES OF MASTS, 28-gun column; 1/16 in of rake per yard of mast |
| `main_mast_rake_deg` | 0.99 | — | SECONDARY | §8 Steel, Naval Architecture, CENTRES OF MASTS, 28-gun column; 5/8 in per yard |
| `mizzen_mast_rake_deg` | 1.59 | — | SECONDARY | §8 Steel, Naval Architecture, CENTRES OF MASTS, 28-gun column; 1 in per yard |
| `mast_step_y` | -3.5052 | -11 ft 6 in | RECONSTRUCTED | §9 keelson top, from the moulded base line plus the floors |

### Topmasts, topgallants and poles

| key | metric | period figure | grade | source |
|---|---|---|---|---|
| `mizzen_topmast_backstay_deadeye_diameter` | 0.2032 | 0 ft 8 in | RECONSTRUCTED | §06 10 scaled from Steel 1805 OUTBOARD folio and Folio LIV: 8 in |
| `main_topmast_length` | 14.859 | 48 ft 9 in | SECONDARY | §3 Steel 1794 v1 p.50, "28 GUNS. 594 Tons." column |
| `main_topmast_diameter` | 0.3651 | 1 ft 2.4 in | SECONDARY | §3 Steel 1794 v1 p.50, "28 GUNS. 594 Tons." column |
| `main_topmast_head` | 1.651 | — | SECONDARY | §5 Steel 1794 v1 p.42, head and hounds rules, arithmetic applied to the §3 lengths |
| `fore_topmast_length` | 13.1064 | 43 ft 0 in | SECONDARY | §3 Steel 1794 v1 p.50, "28 GUNS. 594 Tons." column |
| `fore_topmast_diameter` | 0.3651 | 1 ft 2.4 in | SECONDARY | §3 Steel 1794 v1 p.50, "28 GUNS. 594 Tons." column |
| `fore_topmast_head` | 1.4542 | — | SECONDARY | §5 Steel 1794 v1 p.42, head and hounds rules, arithmetic applied to the §3 lengths |
| `mizzen_topmast_length` | 11.1506 | 36 ft 7 in | SECONDARY | §3 Steel 1794 v1 p.50, "28 GUNS. 594 Tons." column |
| `mizzen_topmast_diameter` | 0.254 | 0 ft 10 in | SECONDARY | §3 Steel 1794 v1 p.50, "28 GUNS. 594 Tons." column |
| `mizzen_topmast_head` | 1.0858 | — | SECONDARY | §5 Steel 1794 v1 p.42, head and hounds rules, arithmetic applied to the §3 lengths |
| `main_topgallant_length` | 7.4168 | 24 ft 4 in | SECONDARY | §3 Steel 1794 v1 p.50, "28 GUNS. 594 Tons." column |
| `main_topgallant_diameter` | 0.2032 | 0 ft 8 in | SECONDARY | §3 Steel 1794 v1 p.50, "28 GUNS. 594 Tons." column |
| `main_royal_pole` | 2.6892 | — | SECONDARY | §5 Steel 1794 v1 p.42, head and hounds rules, arithmetic applied to the §3 lengths; long pole-head = 2/5 of the stop |
| `fore_topgallant_length` | 6.5532 | 21 ft 6 in | SECONDARY | §3 Steel 1794 v1 p.50, "28 GUNS. 594 Tons." column |
| `fore_topgallant_diameter` | 0.1778 | 0 ft 7 in | SECONDARY | §3 Steel 1794 v1 p.50, "28 GUNS. 594 Tons." column |
| `fore_royal_pole` | 2.3654 | — | SECONDARY | §5 Steel 1794 v1 p.42, head and hounds rules, arithmetic applied to the §3 lengths; long pole-head = 2/5 of the stop |
| `mizzen_topgallant_length` | 5.5626 | 18 ft 3 in | SECONDARY | §3 Steel 1794 v1 p.50, "28 GUNS. 594 Tons." column |
| `mizzen_topgallant_diameter` | 0.1524 | 0 ft 6 in | SECONDARY | §3 Steel 1794 v1 p.50, "28 GUNS. 594 Tons." column |
| `mizzen_royal_pole` | 2.0098 | — | SECONDARY | §5 Steel 1794 v1 p.42, head and hounds rules, arithmetic applied to the §3 lengths; long pole-head = 2/5 of the stop |
| `fore_topmast_shroud_pairs` | 4 | — | SECONDARY | §11 Steel 1794 v2, rigging warrant for a 28-gun ship of 594 tons |
| `main_topmast_shroud_pairs` | 4 | — | SECONDARY | §11 Steel 1794 v2, rigging warrant for a 28-gun ship of 594 tons |
| `mizzen_topmast_shroud_pairs` | 3 | — | SECONDARY | §11 Steel 1794 v2, rigging warrant for a 28-gun ship of 594 tons |

### Bowsprit, jibboom and dolphin striker

| key | metric | period figure | grade | source |
|---|---|---|---|---|
| `bowsprit_heel_from_stem` | 4.2672 | 13 ft 12 in | RECONSTRUCTED | §4 research 04 §3.3: the heel steps on the gun deck on the beam next before the foremast, whose centre is 14 ft 1.5 in abaft the fore perpendicular. Checked against ZAZ3067: at rig.bowsprit_steeve_deg this puts the spar where the draught draws it crossing the stem |
| `bowsprit_heel_above_gundeck` | 0.3048 | 1 ft 0 in | RECONSTRUCTED | §4 half the bowsprit's diameter, the spar lying in its step on the deck |
| `bowsprit_partner_thickness` | 0.1524 | 0 ft 6 in | RECONSTRUCTED | §6 Steel :39538 tabulates the bowsprit partners but the frigate column is not legible; the thickness of the capstan partners is used |
| `bowsprit_chock_length` | 0.762 | 2 ft 6 in | SECONDARY | §6 Steel :15357, a chock between the knightheads for the better security of the bowsprit |
| `gammoning_hole_count` | 2 | — | SECONDARY | §6 Steel :41225, two gammoning holes |
| `gammoning_cleat_forward_of_stem` | 0.9144 | — | SECONDARY | §6 Steel :2914, the gammoning is cut through the knee of the head between the cheeks, abaft the figure |
| `gammoning_cleat_spacing` | 0.4064 | 1 ft 4 in | RECONSTRUCTED | §6 from Steel :41226, a gammoning hole 1 ft 1 in long, with a little wood between the two |
| `gammoning_cleat_projection` | 0.0762 | — | RECONSTRUCTED | §6 the cleat that keeps the gammoning lashing from surging forward |
| `bowsprit_length` | 14.859 | 48 ft 9 in | SECONDARY | §3 Steel 1794 v1 p.50, "28 GUNS. 594 Tons." column |
| `bowsprit_diameter` | 0.6001 | 1 ft 11.6 in | SECONDARY | §3 Steel 1794 v1 p.50, "28 GUNS. 594 Tons." column |
| `bowsprit_steeve_deg` | 21.9 | — | SECONDARY | §8 Steel, Naval Architecture, CENTRES OF MASTS, 28-gun column; 1 ft 2 1/2 in of stive per yard of length |
| `bowsprit_housing` | 4.7244 | 15 ft 6 in | RECONSTRUCTED | §3.3 heel stepped on the beam next before the foremast, geometry at a 21.9 deg steeve |
| `jibboom_length` | 10.668 | 35 ft 0 in | SECONDARY | §3 Steel 1794 v1 p.50, "28 GUNS. 594 Tons." column |
| `jibboom_diameter` | 0.2604 | 0 ft 10.3 in | SECONDARY | §3 Steel 1794 v1 p.50, "28 GUNS. 594 Tons." column |
| `jibboom_housing_fraction` | 0.333 | — | RECONSTRUCTED | §3.3 jib boom housed on the bowsprit for about a third of its length |
| `bowsprit_shroud_pairs` | 1 | — | SECONDARY | §11 Steel 1794 v2, rigging warrant for a 28-gun ship of 594 tons |
| `dolphin_striker_length` | 2.7432 | 9 ft 0 in | RECONSTRUCTED | §12 about a quarter of the jib boom; not in Steel 1794, but visible in the reference photograph |
| `dolphin_striker_diameter` | 0.1778 | 0 ft 7 in | RECONSTRUCTED | §12 in proportion to its length |
| `dolphin_striker_rake_deg` | 12 | — | RECONSTRUCTED | §12 raked slightly forward so the martingale leads fair to the jib boom end |
| `gammoning_turns` | 8 | — | SECONDARY | §11.2 Steel lists the gammoning first on the standing-rigging plate; seven or eight turns is the period figure |

### Yards and booms

| key | metric | period figure | grade | source |
|---|---|---|---|---|
| `main_yard_length` | 21.717 | 71 ft 3 in | SECONDARY | §3 Steel 1794 v1 p.50, "28 GUNS. 594 Tons." column |
| `main_yard_diameter` | 0.4191 | 1 ft 4.5 in | SECONDARY | §3 Steel 1794 v1 p.50, "28 GUNS. 594 Tons." column |
| `main_topsail_yard_length` | 15.8496 | 52 ft 0 in | SECONDARY | §3 Steel 1794 v1 p.50, "28 GUNS. 594 Tons." column |
| `main_topsail_yard_diameter` | 0.2794 | 0 ft 11 in | SECONDARY | §3 Steel 1794 v1 p.50, "28 GUNS. 594 Tons." column |
| `main_topgallant_yard_length` | 9.906 | 32 ft 6 in | SECONDARY | §3 Steel 1794 v1 p.50, "28 GUNS. 594 Tons." column |
| `main_topgallant_yard_diameter` | 0.1651 | 0 ft 6.5 in | SECONDARY | §3 Steel 1794 v1 p.50, "28 GUNS. 594 Tons." column |
| `main_royal_yard_length` | 7.9248 | 26 ft 0 in | SECONDARY | §3 Steel 1794 v1 p.50, "28 GUNS. 594 Tons." column |
| `main_royal_yard_diameter` | 0.1397 | 0 ft 5.5 in | SECONDARY | §3 Steel 1794 v1 p.50, "28 GUNS. 594 Tons." column |
| `fore_yard_length` | 18.9484 | 62 ft 2 in | SECONDARY | §3 Steel 1794 v1 p.50, "28 GUNS. 594 Tons." column |
| `fore_yard_diameter` | 0.3683 | 1 ft 2.5 in | SECONDARY | §3 Steel 1794 v1 p.50, "28 GUNS. 594 Tons." column |
| `fore_topsail_yard_length` | 14.0208 | 46 ft 0 in | SECONDARY | §3 Steel 1794 v1 p.50, "28 GUNS. 594 Tons." column |
| `fore_topsail_yard_diameter` | 0.2477 | 0 ft 9.8 in | SECONDARY | §3 Steel 1794 v1 p.50, "28 GUNS. 594 Tons." column |
| `fore_topgallant_yard_length` | 8.6868 | 28 ft 6 in | SECONDARY | §3 Steel 1794 v1 p.50, "28 GUNS. 594 Tons." column |
| `fore_topgallant_yard_diameter` | 0.1429 | 0 ft 5.6 in | SECONDARY | §3 Steel 1794 v1 p.50, "28 GUNS. 594 Tons." column |
| `fore_royal_yard_length` | 7.0104 | 23 ft 0 in | SECONDARY | §3 Steel 1794 v1 p.50, "28 GUNS. 594 Tons." column |
| `fore_royal_yard_diameter` | 0.1238 | 0 ft 4.9 in | SECONDARY | §3 Steel 1794 v1 p.50, "28 GUNS. 594 Tons." column |
| `crossjack_yard_length` | 14.0208 | 46 ft 0 in | SECONDARY | §3 Steel 1794 v1 p.50, "28 GUNS. 594 Tons." column |
| `crossjack_yard_diameter` | 0.2477 | 0 ft 9.8 in | SECONDARY | §3 Steel 1794 v1 p.50, "28 GUNS. 594 Tons." column |
| `mizzen_topsail_yard_length` | 10.668 | 35 ft 0 in | SECONDARY | §3 Steel 1794 v1 p.50, "28 GUNS. 594 Tons." column |
| `mizzen_topsail_yard_diameter` | 0.1842 | 0 ft 7.3 in | SECONDARY | §3 Steel 1794 v1 p.50, "28 GUNS. 594 Tons." column |
| `mizzen_topgallant_yard_length` | 6.7056 | 22 ft 0 in | SECONDARY | §3 Steel 1794 v1 p.50, "28 GUNS. 594 Tons." column |
| `mizzen_topgallant_yard_diameter` | 0.1111 | 0 ft 4.4 in | SECONDARY | §3 Steel 1794 v1 p.50, "28 GUNS. 594 Tons." column |
| `mizzen_royal_yard_length` | 5.334 | 17 ft 6 in | SECONDARY | §3 Steel 1794 v1 p.50, "28 GUNS. 594 Tons." column |
| `mizzen_royal_yard_diameter` | 0.0921 | 0 ft 3.6 in | SECONDARY | §3 Steel 1794 v1 p.50, "28 GUNS. 594 Tons." column |
| `spritsail_yard_length` | 14.0208 | 46 ft 0 in | SECONDARY | §3 Steel 1794 v1 p.50, "28 GUNS. 594 Tons." column |
| `spritsail_yard_diameter` | 0.2477 | 0 ft 9.8 in | SECONDARY | §3 Steel 1794 v1 p.50, "28 GUNS. 594 Tons." column |
| `driver_boom_length` | 15.8496 | 52 ft 0 in | SECONDARY | §3 Steel 1794 v1 p.50, "28 GUNS. 594 Tons." column; the driver rig, not built — see spanker_boom_length |
| `spanker_boom_length` | 10.3632 | 34 ft 0 in | RECONSTRUCTED | from the reference photograph: a gaff spanker whose boom overhangs the taffrail by about 10 ft |
| `spanker_boom_diameter` | 0.2477 | 0 ft 9.8 in | SECONDARY | §3 Steel 1794 v1 p.50, "28 GUNS. 594 Tons." column |
| `spanker_gaff_length` | 9.906 | 32 ft 6 in | SECONDARY | §3 Steel 1794 v1 p.50, "28 GUNS. 594 Tons." column; printed under "Gaff" on the mizen line |
| `spanker_gaff_diameter` | 0.2477 | 0 ft 9.8 in | SECONDARY | §3 Steel 1794 v1 p.50, "28 GUNS. 594 Tons." column |
| `spanker_gaff_peak_deg` | 38 | — | RECONSTRUCTED | §12 gaff peaked at about 38 degrees, as the reference photograph shows |

### Tops

| key | metric | period figure | grade | source |
|---|---|---|---|---|
| `main_top_breadth` | 4.953 | 16 ft 3 in | SECONDARY | §7.1 Steel 1794 v1 p.37, one third of the topmast length |
| `main_top_length` | 3.7147 | 12 ft 2.3 in | SECONDARY | §7.1 three quarters of the breadth |
| `fore_top_breadth` | 4.3688 | 14 ft 4 in | SECONDARY | §7.1 Steel 1794 v1 p.37 |
| `fore_top_length` | 3.2766 | 10 ft 9 in | SECONDARY | §7.1 three quarters of the breadth |
| `mizzen_top_breadth` | 3.7147 | 12 ft 2.3 in | SECONDARY | §7.1 Steel 1794 v1 p.37 |
| `mizzen_top_length` | 2.7877 | 9 ft 1.8 in | SECONDARY | §7.1 three quarters of the breadth |
| `top_platform_thickness` | 0.0508 | 0 ft 2 in | SECONDARY | §7.1 two-inch deals for a sixth rate |

### Standing rigging

| key | metric | period figure | grade | source |
|---|---|---|---|---|
| `bobstay_hole_count` | 2 | — | SECONDARY | §6 Steel :41228, two bobstay holes |
| `bobstay_hole_diameter` | 0.1016 | 0 ft 4 in | SECONDARY | §6 Steel :41229, 4 in diameter, OCR-doubtful |
| `bobstay_hole_forward_of_stem` | 1.9812 | — | SECONDARY | §6 Steel :1537, cut through the fore part of the knee of the head below the lower cheek. The model puts the eyes on the cutwater below the wale instead, which is the same place expressed as a line of the ship rather than as a distance |
| `fore_channel_shroud_aim_y` | 15.545 | — | RECONSTRUCTED | §04 9 fore top platform 51 ft 0 in above the load waterline |
| `main_channel_shroud_aim_y` | 17.993 | — | RECONSTRUCTED | §04 9 main top platform 59 ft 0 1/2 in above the load waterline |
| `mizzen_channel_shroud_aim_y` | 15.342 | — | RECONSTRUCTED | §04 9 mizen top platform 50 ft 4 in above the load waterline |
| `fore_lower_shroud_pairs` | 7 | — | PRIMARY | §04 11.1 Steel 1794 v2 rigging warrant, a ship of 28 guns of 594 tons: corroborated by 14 lanyards |
| `main_lower_shroud_pairs` | 7 | — | PRIMARY | §04 11.1 Steel 1794 v2 rigging warrant, a ship of 28 guns of 594 tons: corroborated by 14 throat seizings |
| `mizzen_lower_shroud_pairs` | 5 | — | PRIMARY | §04 11.1 Steel 1794 v2 rigging warrant, a ship of 28 guns of 594 tons: corroborated by 10 lanyards |
| `fore_channel_backstay_deadeyes` | 4 | — | PRIMARY | §04 11.1 Steel 1794 v2 rigging warrant, a ship of 28 guns of 594 tons: two topmast and two topgallant standing backstays a side |
| `main_channel_backstay_deadeyes` | 4 | — | PRIMARY | §04 11.1 Steel 1794 v2 rigging warrant, a ship of 28 guns of 594 tons: two topmast and two topgallant standing backstays a side |
| `mizzen_channel_backstay_deadeyes` | 2 | — | PRIMARY | §04 11.1 Steel 1794 v2 rigging warrant, a ship of 28 guns of 594 tons: one mizen topmast and one mizen topgallant standing backstay a side |
| `shroud_deadeye_diameter` | 0.2794 | 0 ft 11 in | RECONSTRUCTED | §06 10 scaled from Steel 1805 OUTBOARD folio and Folio LIV: 11 in for the main and fore shrouds |
| `mizzen_shroud_deadeye_diameter` | 0.2032 | 0 ft 8 in | PRIMARY | §04 11.1 Steel 1794 v2 rigging warrant, a ship of 28 guns of 594 tons: the mizen entry reads "Dead Eyes 8" inches |
| `topmast_backstay_deadeye_diameter` | 0.2286 | 0 ft 9 in | RECONSTRUCTED | §06 10 scaled from Steel 1805 OUTBOARD folio and Folio LIV: 9 in, the after end of the main and fore channels |
| `topgallant_backstay_deadeye_diameter` | 0.1778 | 0 ft 7 in | RECONSTRUCTED | §06 10 scaled from Steel 1805 OUTBOARD folio and Folio LIV: 7 in |
| `mizzen_topgallant_backstay_deadeye_diameter` | 0.1524 | 0 ft 6 in | RECONSTRUCTED | §06 10 scaled from Steel 1805 OUTBOARD folio and Folio LIV: 6 in |
| `shroud_deadeye_thickness` | 0.1524 | 0 ft 6 in | RECONSTRUCTED | §06 10 scaled from Steel 1805 OUTBOARD folio and Folio LIV: a deadeye is a little over half its diameter through |
| `fore_topgallant_shroud_pairs` | 3 | — | SECONDARY | §11 Steel 1794 v2, rigging warrant for a 28-gun ship of 594 tons |
| `main_topgallant_shroud_pairs` | 3 | — | SECONDARY | §11 Steel 1794 v2, rigging warrant for a 28-gun ship of 594 tons |
| `mizzen_topgallant_shroud_pairs` | 2 | — | SECONDARY | §11 Steel 1794 v2, rigging warrant for a 28-gun ship of 594 tons |
| `fore_futtock_shroud_pairs` | 4 | — | SECONDARY | §11 Steel 1794 v2, rigging warrant for a 28-gun ship of 594 tons |
| `main_futtock_shroud_pairs` | 4 | — | SECONDARY | §11 Steel 1794 v2, rigging warrant for a 28-gun ship of 594 tons |
| `mizzen_futtock_shroud_pairs` | 3 | — | SECONDARY | §11 Steel 1794 v2, rigging warrant for a 28-gun ship of 594 tons |
| `topmast_standing_backstay_pairs` | 2 | — | SECONDARY | §11 Steel 1794 v2, rigging warrant for a 28-gun ship of 594 tons |
| `topgallant_backstay_pairs` | 2 | — | SECONDARY | §11 Steel 1794 v2, rigging warrant for a 28-gun ship of 594 tons |
| `bobstay_pairs` | 2 | — | SECONDARY | §11 Steel 1794 v2, rigging warrant for a 28-gun ship of 594 tons; cabled, set up with hearts |
| `ratline_spacing` | 0.3302 | 1 ft 1 in | SECONDARY | §11.4 Steel 1794 v1 pp.198-199, Progressive Method of Rigging Ships |
| `ratline_stiffener_spacing` | 1.524 | 5 ft 0 in | SECONDARY | §11.4 boat oars seized to the shrouds about five feet asunder for the men to stand on |
| `shroud_diameter` | 0.1143 | 0 ft 4.5 in | RECONSTRUCTED | §11 lower shroud circumference for this class, expressed as a diameter |
| `stay_diameter` | 0.1524 | 0 ft 6 in | RECONSTRUCTED | §11 lower stay heavier than the shrouds |
| `running_rigging_diameter` | 0.0508 | 0 ft 2 in | RECONSTRUCTED | §12 braces, lifts and sheets at model-visible size |

### Sails

| key | metric | period figure | grade | source |
|---|---|---|---|---|
| `sail_cloth_width` | 0.6096 | 2 ft 0 in | SECONDARY | §7.3 of the paint research; period flax canvas bolt width |
| `sail_roach` | 0.085 | — | RECONSTRUCTED | measured off the reference photograph, where the cut of the courses is clearest |
| `sail_leech_curve` | 0.045 | — | RECONSTRUCTED | from the reference photograph; a sail under strain is a curved surface |
| `sail_belly` | 0.115 | — | RECONSTRUCTED | from the reference photograph; the draught of a full sail on a soldier's wind |
| `square_sails_set` | 8 | — | RECONSTRUCTED | the full suit in the reference photograph: two courses, three topsails and three topgallants |
| `furled_bundle_diameter` | 0.4572 | 1 ft 6 in | RECONSTRUCTED | a course furled and harbour-stowed makes a bundle about this thick |

### Channels, deadeyes and chainplates

| key | metric | period figure | grade | source |
|---|---|---|---|---|
| `fore_channel_deadeyes_per_side` | 11 | — | RECONSTRUCTED | §04 11.1 seven lower shrouds and four standing backstays |
| `main_channel_deadeyes_per_side` | 11 | — | RECONSTRUCTED | §04 11.1 seven lower shrouds and four standing backstays |
| `mizzen_channel_deadeyes_per_side` | 7 | — | RECONSTRUCTED | §04 11.1 five lower shrouds and two standing backstays |
| `channel_length` | 6.096 | 20 ft 0 in | SECONDARY | §06 10 Steel 1805 OUTBOARD folio, 32-gun frigate column: the fore channel, used as the single value the rig module still reads |
| `channel_width` | 0.508 | 1 ft 8 in | SECONDARY | §06 10 Steel 1805 OUTBOARD folio, 32-gun frigate column: breadth "sufficient to clear the shrouds of the roughtree rail" |
| `fore_channel_length` | 6.096 | 20 ft 0 in | SECONDARY | §06 10 Steel 1805 OUTBOARD folio, 32-gun frigate column |
| `main_channel_length` | 6.9342 | 22 ft 9 in | SECONDARY | §06 10 Steel 1805 OUTBOARD folio, 32-gun frigate column |
| `mizzen_channel_length` | 4.2672 | 13 ft 12 in | SECONDARY | §06 10 Steel 1805 OUTBOARD folio, 32-gun frigate column; the built channel is cut short of this at the after end to clear the counter |
| `channel_projection` | 0.508 | — | SECONDARY | §06 10 Steel 1805 OUTBOARD folio, 32-gun frigate column: 1 ft 8 in clear of the ship's side |
| `channel_thickness_inner` | 0.127 | — | SECONDARY | §06 10 Steel 1805 OUTBOARD folio, 32-gun frigate column: thickness at the inner edge, main and fore |
| `channel_thickness_outer` | 0.0953 | — | SECONDARY | §06 10 Steel 1805 OUTBOARD folio, 32-gun frigate column: thickness at the outer edge, main and fore |
| `mizzen_channel_thickness_inner` | 0.1143 | — | SECONDARY | §06 10 Steel 1805 OUTBOARD folio, 32-gun frigate column: thickness at the inner edge, mizzen |
| `mizzen_channel_thickness_outer` | 0.0889 | — | SECONDARY | §06 10 Steel 1805 OUTBOARD folio, 32-gun frigate column: thickness at the outer edge, mizzen |
| `channel_fore_end_before_mast` | 0.1778 | — | SECONDARY | §06 10 Steel 1805 OUTBOARD folio, 32-gun frigate column: foremost end of the main and fore channels forward of the mast centre |
| `mizzen_channel_fore_end_before_mast` | 0.1524 | — | SECONDARY | §06 10 Steel 1805 OUTBOARD folio, 32-gun frigate column: foremost end of the mizzen channel forward of the mast centre |
| `channel_top_below_rail` | 0.254 | — | RECONSTRUCTED | §06 10 Steel puts the channel in line with the upper edge of the sheer rail, one strake below the cap |
| `mizzen_channel_top_below_rail` | 0.1524 | — | RECONSTRUCTED | §06 10 Steel carries the mizzen channel 1 ft above the range of the main; four inches of that taken against a level rail line |
| `channel_inboard_inset` | 0.0508 | — | RECONSTRUCTED | §06 10 the inner edge is let into the ship's side, not butted against the planking |
| `mizzen_channel_aft_clearance` | 2.7432 | — | RECONSTRUCTED | §06 10 the after end of the mizzen channel kept clear of the quarter badge |
| `channel_aft_clearance` | 0.6096 | — | RECONSTRUCTED | §06 10 the after end of a channel is kept off the run of the counter so that it lands on the side proper |
| `channel_deadeye_end_margin` | 0.2286 | — | RECONSTRUCTED | §06 10 the outer deadeyes are set in from the ends so the channel is not split at the butt |
| `fore_channel_taper_fraction` | 0.24 | — | RECONSTRUCTED | §06 10 Steel says the fore channel tapers at its after end to stow the anchor but does not give the length of the taper |
| `fore_channel_taper_projection` | 0.2286 | — | RECONSTRUCTED | §06 10 projection left at the after end of the fore channel taper |
| `channel_rail_height` | 0.1016 | 0 ft 4 in | RECONSTRUCTED | §06 10 the low rail on the outer edge, scored down for every deadeye strop |
| `channel_rail_width` | 0.1016 | 0 ft 4 in | RECONSTRUCTED | §06 10 sided as deep as it is high, ordinary practice for a chain rail |
| `channel_rail_notch_clearance` | 0.0508 | — | RECONSTRUCTED | §06 10 the score is cut a little wider than the strop it takes |
| `mizzen_deadeye_thickness` | 0.1143 | 0 ft 4.5 in | RECONSTRUCTED | §06 10 scaled from Steel 1805 OUTBOARD folio and Folio LIV |
| `deadeye_hole_diameter` | 0.0381 | 0 ft 1.5 in | RECONSTRUCTED | §06 10 the three holes take the lanyard doubled; taken as a seventh of the deadeye |
| `deadeye_hole_circle_fraction` | 0.42 | — | RECONSTRUCTED | §06 10 the three holes stand on a circle of about two fifths of the diameter |
| `deadeye_bottom_above_channel` | 0.0762 | — | RECONSTRUCTED | §06 10 the strop sits down in the score, so the body of the deadeye stands just clear of the channel |
| `deadeye_strop_iron` | 0.0286 | — | SECONDARY | §06 10 Steel: the deadeye binding is 1 1/8 in for the main and fore |
| `mizzen_deadeye_strop_iron` | 0.0254 | — | SECONDARY | §06 10 Steel: the deadeye binding is 1 in for the mizzen |
| `chainplate_width` | 0.0635 | 0 ft 2.5 in | RECONSTRUCTED | §06 10 a plate of 1 1/8 in iron is sided about 2 1/2 in |
| `chainplate_thickness` | 0.0286 | 0 ft 1.1 in | SECONDARY | §06 10 Steel: chain iron 1 1/8 in, main and fore |
| `mizzen_chainplate_thickness` | 0.0254 | 0 ft 1 in | SECONDARY | §06 10 Steel: chain iron 1 in, mizzen |
| `chain_bolt_below_channel` | 1.0668 | — | SECONDARY | §06 10 Steel: the chain bolt driven 3 ft 6 in below the channel |
| `mizzen_chain_bolt_below_channel` | 0.9144 | — | SECONDARY | §06 10 Steel, scaled for the mizzen |
| `chain_bolt_diameter` | 0.0381 | 0 ft 1.5 in | SECONDARY | §06 10 Steel: chain bolt 1 1/2 in |
| `chainplate_standoff` | 0.0127 | — | RECONSTRUCTED | §06 10 the plate lies on the planking; half an inch keeps the iron clear of the hull surface |
| `fore_channel_supporters` | 4 | — | SECONDARY | §06 10 Steel: four iron T-plates in lieu of wood knees under the fore channel |
| `main_channel_supporters` | 5 | — | SECONDARY | §06 10 Steel: five iron T-plates under the main channel |
| `mizzen_channel_supporters` | 2 | — | SECONDARY | §06 10 Steel: two iron T-plates under the mizzen channel |
| `supporter_width` | 0.0762 | 0 ft 3 in | SECONDARY | §06 10 Steel: the T-plate broad 3 in |
| `supporter_thickness` | 0.0286 | 0 ft 1.1 in | SECONDARY | §06 10 Steel: thick 1 1/8 in at the shoulder |
| `supporter_drop` | 1.0668 | — | SECONDARY | §06 10 Steel: the T-plate reaches 3 ft 6 in below the upper side of the channel |

### Stern, galleries and rudder

| key | metric | period figure | grade | source |
|---|---|---|---|---|
| `stern_tuck_above_wl` | 0.6604 | 2 ft 2 in | MEASURED | §6 the tuck at 15.0 ft above the moulded base line, LWL at 12.83 ft |
| `stern_wing_transom_above_wl` | 2.0574 | 6 ft 9 in | MEASURED | §6 wing transom at about 19.6 ft above the moulded base line |
| `stern_upper_counter_above_wl` | 3.7084 | — | MEASURED | §6 stern profile point at 25.0 ft above the moulded base line |
| `stern_taffrail_above_rail` | 1.5494 | — | MEASURED | §6 taffrail 29.5 ft above the moulded base line, rail line 24.4 ft |
| `stern_taffrail_above_quarterdeck` | 0.5842 | — | MEASURED | §5/§6 taffrail 29.5 ft above the moulded base line; gun deck at side at the after perpendicular 20.90 ft, quarterdeck 6 ft 8 in above that at 27.57 ft |
| `stern_taffrail_above_wl` | 5.08 | 16 ft 8 in | MEASURED | §6 taffrail 29.5 ft above the moulded base line, LWL at 12.83 ft. This is the figure the taffrail is built to; the height above the quarterdeck follows from it |
| `stern_wing_transom_abaft_tuck` | 1.3716 | — | RECONSTRUCTED | §6 between the 2.2 ft of the measured profile points and the 7.7 ft of the counter-overhang bullet; least that carries the counter clear of the rudder head |
| `stern_upper_counter_abaft_tuck` | 1.9812 | — | RECONSTRUCTED | §6 between the measured 4.5 ft and the summary bullets, on a fair curve between the wing transom and the taffrail |
| `stern_taffrail_abaft_tuck` | 2.286 | — | RECONSTRUCTED | §6 between the measured 5.0 ft and the 10.5 ft of the taffrail-overhang bullet |
| `stern_half_breadth_at_tuck` | 0.9144 | — | MEASURED | §6 tuck / lower counter at the post, 3.0 ft half-breadth |
| `stern_half_breadth_wing_transom` | 2.8956 | — | MEASURED | §6 wing transom half-breadth 9.5 ft, 0.61 of the moulded breadth |
| `stern_half_breadth_at_lights` | 3.048 | — | MEASURED | §6 stern at the window band, 10.0 ft half-breadth, 0.65 of the moulded breadth |
| `stern_half_breadth_at_taffrail` | 2.1336 | — | RECONSTRUCTED | §6 taffrail half-breadth 7.0 ft, 0.45 of the moulded breadth, read off the same elevation |
| `stern_transom_breadth_wing` | 5.7912 | — | MEASURED | §6 wing transom 19.0 ft across the stern elevation on the ZAZ3067 body plan |
| `stern_round_aft_lower` | 0.1016 | — | RECONSTRUCTED | §12.2 Steel, round-aft of the lower counter rail; least at the bottom |
| `stern_round_aft_upper` | 0.254 | — | RECONSTRUCTED | §12.2 Steel, round-aft increasing in proceeding upwards |
| `stern_round_up_taffrail` | 0.2032 | — | RECONSTRUCTED | §12.2 Steel, the taffrail carries the most round-up of any stern rail |
| `stern_quarter_run` | 2.4384 | — | RECONSTRUCTED | §12.4 the quarter pieces run forward far enough to carry the sheer up to the taffrail without a step |
| `stern_counter_rail_depth` | 0.127 | — | RECONSTRUCTED | §12.2 Steel names five stern rails; scantling taken from the sheer mouldings of the same ship |
| `stern_counter_rail_proud` | 0.0762 | — | RECONSTRUCTED | §12.2 a counter rail stands proud of the planking by about its own thickness |
| `taffrail_cap_width` | 0.2794 | 0 ft 11 in | RECONSTRUCTED | §12.4 Steel, taffrail transom 4½ in thick with the taffarel rail over it |
| `taffrail_cap_thickness` | 0.127 | 0 ft 5 in | RECONSTRUCTED | §12.4 Steel, taffarel rail over the taffrail transom |
| `stern_light_count` | 7 | — | MEASURED | §6 the stern elevation on the ZAZ3067 body plan shows a single row of seven lights; 06 §12.2 and 08 §5.2 reconstruct five from a breadth rule whose stated range is 5 to 7 |
| `stern_light_height` | 0.9144 | 3 ft 0 in | RECONSTRUCTED | §12.2 lights 3 ft 0 in deep for a Sixth Rate great cabin |
| `stern_light_sill_above_deck` | 0.762 | 2 ft 6 in | RECONSTRUCTED | §12.2 sill height of a great-cabin light above the gun deck at side |
| `stern_light_munion` | 0.1524 | — | RECONSTRUCTED | §12.2 munions 6 in wide between the lights |
| `stern_quarter_piece_width` | 0.3048 | 1 ft 0 in | RECONSTRUCTED | §12.2 the quarter piece bounding the row of lights each side |
| `stern_light_frame_depth` | 0.1016 | 0 ft 4 in | RECONSTRUCTED | §5.2 the sash frame stands proud of the transom planking |
| `stern_glazing_rebate` | 0.0381 | — | RECONSTRUCTED | §5.2 the rebate a crown-glass pane is bedded in, from contemporary sash practice |
| `stern_glazing_bar` | 0.0254 | — | SECONDARY | §5.2 wooden glazing bars about 1 in, following contemporary domestic sash practice |
| `stern_panes_wide` | 2 | — | SECONDARY | §5.2 rectangular panes 2 wide per light, not leaded diamonds |
| `stern_panes_high` | 3 | — | RECONSTRUCTED | §12.2 sash bars dividing each light into 6 panes, 2 wide by 3 high |
| `quarter_gallery_light_count` | 2 | — | RECONSTRUCTED | §12.3 two lights in each gallery facing aft and outboard |
| `quarter_gallery_length` | 2.1336 | 6 ft 12 in | RECONSTRUCTED | §12.3 lower rim about 7 ft, Steel: "the lower-rim should be as long as possible" |
| `quarter_gallery_projection` | 0.381 | — | RECONSTRUCTED | §12.3 a closed badge stands about 15 in off the ship's side |
| `quarter_gallery_rim_depth` | 0.3048 | 1 ft 0 in | RECONSTRUCTED | §12.3 the lower stool and rim below the lights |
| `quarter_gallery_hood_depth` | 0.3556 | 1 ft 2 in | RECONSTRUCTED | §12.3 the bell-top hood over the lights; Steel, the upper stool hollowed |
| `quarter_gallery_bracket_drop` | 0.3048 | — | RECONSTRUCTED | §5.2 the carved bracket under the badge, gadrooned on its underside; about a foot deep on a Sixth Rate badge |
| `quarter_gallery_bracket_length` | 0.2286 | 0 ft 9 in | RECONSTRUCTED | §5.2 the bracket seen fore and aft, rather less than it is deep |
| `quarter_gallery_frame_proud` | 0.0381 | — | RECONSTRUCTED | §12.3 the sash frame of a badge light stands proud of the badge planking |
| `quarter_gallery_carving_relief` | 0.0508 | — | RECONSTRUCTED | §5.2 the gilt carving on a quarter badge, cut a little shallower than the work on the counter because it is seen edge-on from abaft the beam |
| `stern_carving_bevel` | 0.42 | — | RECONSTRUCTED | §12.1 the ground cut away round a piece of carved work; about two fifths of its half-width taken by the chamfer, leaving a field in the middle |
| `stern_carving_panel_corner` | 3 | — | RECONSTRUCTED | §12.1 a carved panel is worked square with the corners rounded off, not drawn as a lens |
| `stern_cartouche_width` | 1.8288 | 6 ft 0 in | RECONSTRUCTED | §12.1 the name cartouche on the counter, drawn on ZAZ3067 and on the parallel Unite plan ZAZ3181; wide enough to carry the eight letters of the name at the letter width below, with a margin each end |
| `stern_cartouche_height` | 0.4064 | 1 ft 4 in | RECONSTRUCTED | §12.1 proportion of a period name cartouche to its width |
| `stern_cartouche_relief` | 0.0762 | — | RECONSTRUCTED | §12.1 depth of the carved relief |
| `stern_cartouche_bevel` | 0.18 | — | RECONSTRUCTED | §12.1 a name board is chamfered round its edge and left flat inside, so the chamfer takes much less of it than a boss does |
| `taffrail_ornament_width` | 1.0668 | 3 ft 6 in | RECONSTRUCTED | §5.2 the central carved and gilded cartouche of the taffrail, "a centre of attention within all the decoration" |
| `taffrail_ornament_height` | 0.3556 | 1 ft 2 in | RECONSTRUCTED | §5.2 flanked by scrollwork and trophies of arms |
| `taffrail_ornament_relief` | 0.1016 | — | RECONSTRUCTED | §5.2 the centre of attention of the stern, and the boldest cut of any of it |
| `stern_scroll_relief` | 0.0635 | — | RECONSTRUCTED | §5.2 the scrollwork either side of the taffrail cartouche, cut shallower than the cartouche and dying away toward the quarters |
| `stern_term_piece_width` | 0.2286 | 0 ft 9 in | RECONSTRUCTED | §12.4 Steel, term pieces: carved work under each end of the taffrail |
| `stern_term_piece_relief` | 0.0762 | — | RECONSTRUCTED | §12.4 the term piece stands out from the quarter piece it is cut on |
| `stern_name_letter_height` | 0.2032 | 0 ft 8 in | RECONSTRUCTED | §12.1 name letters 8 in high, half the depth of the cartouche they are cut on |
| `stern_name_letter_width` | 0.1143 | 0 ft 4.5 in | RECONSTRUCTED | §12.1 a condensed letter about four ninths of its height, as period name boards are lettered |
| `stern_name_letter_gap` | 0.0635 | — | RECONSTRUCTED | §12.1 the space between one letter and the next, rather more than half a letter width |
| `stern_name_stroke` | 0.0254 | — | RECONSTRUCTED | §12.1 the width of the cut stroke of a letter |
| `stern_name_relief` | 0.0381 | — | RECONSTRUCTED | §12.1 the letters stand proud of the field of the cartouche |
| `stern_name_length` | 1.3843 | 4 ft 6.5 in | RECONSTRUCTED | §12.1 SURPRISE: eight letters of 4½ in with 2½ in between them, and the cut stroke over the ends |
| `rudder_breadth_at_heel` | 1.0668 | — | RECONSTRUCTED | §6 blade breadth at the heel, about a quarter of the draught |
| `rudder_breadth_at_head` | 0.4572 | — | RECONSTRUCTED | §6 the main piece at the head, sided a little more than the post |
| `rudder_thickness` | 0.254 | 0 ft 10 in | RECONSTRUCTED | §6 the main piece moulded, from the measured sternpost siding of 1 ft 1 in |
| `rudder_head_above_wl` | 4.1148 | 13 ft 6 in | RECONSTRUCTED | §2.2 the head carried up through the counter to the tiller under the quarterdeck |
| `rudder_height` | 5.334 | 17 ft 6 in | RECONSTRUCTED | §6 heel at the underside of the keel, head 13 ft 6 in above the LWL |
| `rudder_post_rake_deg` | 2.7 | — | MEASURED | §6 sternpost rake 0.67 ft over 14 ft of height, taken on the rudder's after edge |
| `rudder_pintle_count` | 5 | — | RECONSTRUCTED | §6 five pairs of pintles and gudgeons on a rudder of this depth |
| `rudder_iron_width` | 0.1016 | 0 ft 4 in | RECONSTRUCTED | §6 the straps of the pintles and gudgeons |
| `rudder_iron_thickness` | 0.0381 | 0 ft 1.5 in | RECONSTRUCTED | §6 wrought-iron strap thickness |
| `tiller_length` | 3.3528 | 11 ft 0 in | RECONSTRUCTED | §2.2 long enough to reach the sweep abaft the wheel at 107 ft 6 in from the stem |
| `tiller_diameter` | 0.1778 | 0 ft 7 in | RECONSTRUCTED | §2.2 tiller at the rudder head, tapering forward |
| `ensign_staff_step_abaft_tuck` | 1.2192 | — | RECONSTRUCTED | §12.4 Steel, "the ensign staff is secured in the stern timbers" |
| `stern_lantern_height` | 0.6096 | 2 ft 0 in | RECONSTRUCTED | §12.4 one lantern for a Sixth Rate, on an iron crank in the taffrail |
| `stern_lantern_breadth` | 0.381 | 1 ft 3 in | RECONSTRUCTED | §12.4 octagonal, copper and glass |

### Head, beakhead and figurehead

| key | metric | period figure | grade | source |
|---|---|---|---|---|
| `head_stem_siding` | 0.3302 | 1 ft 1 in | RECONSTRUCTED | §6 Steel: the stem is sided as the keel, and the keel of this ship is sided 1 ft 1 in (SPEC.keel_siding) |
| `head_stem_aft_overlap` | 0.1524 | — | RECONSTRUCTED | modelling allowance: how far abaft the hull's foremost station the stem timber is carried, so that it closes the fore end of the lofted shell |
| `head_stem_copper_above_waterline` | 0.762 | — | SECONDARY | §8 research 08 §3.5, sheathing carried 2 ft 6 in to 3 ft above the load waterline; the same height is used on the stem as on the hull |
| `head_stem_sheathing_proud` | 0.0254 | — | RECONSTRUCTED | §8 the sheathing board and the copper over it, standing proud of the bare stem |
| `head_stem_head_above_rail` | 0.2286 | — | MEASURED | §2 ZAZ3067 sheer profile, traced off the RMG scan at 6.021 px per foot; stem at x=1112 px, rail at y=141 px: the stem head between the knightheads reads 4 to 5 px above the rail line |
| `head_knee_siding` | 0.2794 | 0 ft 11 in | RECONSTRUCTED | §6 Steel :41236 the gripe is sided as the knee of the head; a knee slightly thinner than the stem it lies against |
| `head_knee_projection` | 3.6576 | — | MEASURED | §2 ZAZ3067 sheer profile, traced off the RMG scan at 6.021 px per foot; stem at x=1112 px, rail at y=141 px: the foremost ink of the head stands 75 px forward of the stem |
| `head_knee_top_above_rail` | 0 | — | MEASURED | §2 ZAZ3067 sheer profile, traced off the RMG scan at 6.021 px per foot; stem at x=1112 px, rail at y=141 px: the top of the knee under the hair bracket runs out level with the rail |
| `head_knee_forward_at_deck` | 2.8956 | — | MEASURED | §2 ZAZ3067 sheer profile, traced off the RMG scan at 6.021 px per foot; stem at x=1112 px, rail at y=141 px: the cutwater's fore edge crossing the gun-deck line |
| `head_knee_forward_at_waterline` | 1.2192 | — | RECONSTRUCTED | : the cutwater at the load waterline. The draught shows the stem raking aft below the water, which the traced offset table does not carry, so the fore edge is kept plumb over the hull's own forefoot here rather than crossing behind it |
| `head_knee_upper_exponent` | 0.8 | — | MEASURED | §2 ZAZ3067 sheer profile, traced off the RMG scan at 6.021 px per foot; stem at x=1112 px, rail at y=141 px: read off the upper edge of the knee |
| `head_knee_length` | 3.81 | 12 ft 6 in | MEASURED | §2 ZAZ3067 sheer profile, traced off the RMG scan at 6.021 px per foot; stem at x=1112 px, rail at y=141 px: the knee and stem together, from the aft face of the stem timber to the hair bracket — the fore-and-aft extent of the built piece |
| `head_cheek_count` | 2 | — | SECONDARY | §6 Steel :1985, an upper and a lower cheek each side |
| `head_cheek_sided` | 0.1524 | — | RECONSTRUCTED | §6 a cheek rather lighter than the knee it is bolted to |
| `head_cheek_moulded` | 0.2286 | — | RECONSTRUCTED | §6 as above |
| `head_cheek_aft_from_stem` | 2.7432 | 9 ft 0 in | MEASURED | §2 ZAZ3067 sheer profile, traced off the RMG scan at 6.021 px per foot; stem at x=1112 px, rail at y=141 px: the after ends of the cheeks fair into the bow about 54 px abaft the stem |
| `head_rail_count` | 3 | — | SECONDARY | §8 the reference photograph shows three rails curving up to the figurehead; Steel :4172 names four (lower, middle, main, upper) plus a false rail, so this is the photograph's reading of a four-rail arrangement |
| `head_rail_sided` | 0.127 | — | SECONDARY | §6 Steel :41199, the false rail sided 5 in for a small ship |
| `head_rail_moulded` | 0.1778 | — | RECONSTRUCTED | §6 a rail rather deeper than it is broad, as the draught draws them |
| `head_rail_profile_exponent` | 1.44 | — | MEASURED | §2 ZAZ3067 sheer profile, traced off the RMG scan at 6.021 px per foot; stem at x=1112 px, rail at y=141 px: re-fitted to the same four points on the lowest rail — see the note above |
| `head_rail_lower_aft_from_stem` | 0.3048 | 1 ft 0 in | MEASURED | §2 ZAZ3067 sheer profile, traced off the RMG scan at 6.021 px per foot; stem at x=1112 px, rail at y=141 px: the lowest rail runs into the ship's side within a foot of the stem, at about the gun-deck line |
| `head_rail_lower_fore_above_rail` | 0.1524 | — | MEASURED | §2 ZAZ3067 sheer profile, traced off the RMG scan at 6.021 px per foot; stem at x=1112 px, rail at y=141 px |
| `head_rail_lower_half_breadth` | 1.3716 | 4 ft 6 in | RECONSTRUCTED | : no plan view of the head survives, so the three plan widths are set against the reference photograph and bounded by the catheads, which no head rail passes outside of |
| `head_rail_middle_aft_from_stem` | 1.8288 | 6 ft 0 in | MEASURED | §2 ZAZ3067 sheer profile, traced off the RMG scan at 6.021 px per foot; stem at x=1112 px, rail at y=141 px |
| `head_rail_middle_fore_above_rail` | 0.4572 | — | MEASURED | §2 ZAZ3067 sheer profile, traced off the RMG scan at 6.021 px per foot; stem at x=1112 px, rail at y=141 px |
| `head_rail_middle_half_breadth` | 1.905 | 6 ft 3 in | RECONSTRUCTED | : as head_rail_lower_half_breadth |
| `head_rail_main_aft_from_stem` | 3.6576 | 12 ft 0 in | SECONDARY | §6 Steel :15364, the after end of the main head rail bolts to the same timberhead the cat block does, so it ends at the cathead |
| `head_rail_main_fore_above_rail` | 0.762 | — | MEASURED | §2 ZAZ3067 sheer profile, traced off the RMG scan at 6.021 px per foot; stem at x=1112 px, rail at y=141 px: the uppermost rail runs into the back of the figure about 15 px above the rail line |
| `head_rail_main_half_breadth` | 2.4384 | 8 ft 0 in | RECONSTRUCTED | : the main rail sweeps out in plan to a little more than half the extreme half-breadth, and well inside the cathead at 14 ft 6 in |
| `head_timber_count` | 4 | — | SECONDARY | §6 research 06-deck-layout §11, head structure: Steel :3133 defines the head timbers but tabulates no count; four a side is the Sixth-Rate norm — RECONSTRUCTED |
| `head_timber_sided` | 0.127 | — | RECONSTRUCTED | §6 a head timber sided as the rails it crosses |
| `head_timber_moulded` | 0.1016 | — | RECONSTRUCTED | §6 as above |
| `head_grating_aft_from_stem` | 0.3048 | 1 ft 0 in | RECONSTRUCTED | : the after end of the flat of the head, where it meets the bow |
| `head_grating_forward_of_stem` | 2.4384 | — | RECONSTRUCTED | : the fore end of the flat, short of the hair bracket |
| `head_grating_above_lower_rail` | 0.1016 | — | RECONSTRUCTED | : the ledges and gratings laid on top of the lowest rail |
| `head_ledge_sided` | 0.0508 | — | SECONDARY | §6 Steel :41205, ledges framing the flat of the head, 2 in broad |
| `head_ledge_moulded` | 0.0572 | — | SECONDARY | §6 Steel :41206, 2 1/4 in deep |
| `head_grating_batten_square` | 0.0508 | — | SECONDARY | §6 Steel :1293, grating battens about 2 in square |
| `head_grating_batten_gap` | 0.0508 | — | SECONDARY | §6 Steel :2968, laid to leave about 2 in openings |
| `head_seat_count` | 2 | — | SECONDARY | §6 research 06-deck-layout §11, head structure §11.2: Steel :41211 says only "Seats of Ease, &c., as directed"; two open seats on the flat, one each side of the knee — RECONSTRUCTED |
| `head_seat_forward_of_stem` | 0.9144 | — | SECONDARY | §6 research 06-deck-layout §11, head structure §11.2, RECONSTRUCTED position |
| `head_seat_half_breadth` | 0.762 | 2 ft 6 in | SECONDARY | §6 research 06-deck-layout §11, head structure §11.2, RECONSTRUCTED position |
| `head_seat_width` | 0.508 | 1 ft 8 in | RECONSTRUCTED | : a seat wide enough for one man |
| `head_seat_depth` | 0.4572 | 1 ft 6 in | RECONSTRUCTED | : as above |
| `head_seat_height` | 0.4064 | 1 ft 4 in | RECONSTRUCTED | : seat height above the grating |
| `head_seat_back_height` | 0.4572 | 1 ft 6 in | RECONSTRUCTED | : the coaming behind the seat |
| `beakhead_bulkhead_from_stem` | 3.6576 | 12 ft 0 in | RECONSTRUCTED | §6 research 06 §5.4: the cat beam is the foremost forecastle beam and the cathead root is at 12 ft, so the bulkhead stands there. Research 06 §11.3 says X = 0 ft, which cannot be right — the hull is 4 in wide at the stem |
| `beakhead_bulkhead_height` | 1.8288 | 6 ft 0 in | RECONSTRUCTED | §6 a bulkhead tall enough to take a round-house and a head door, with its head at the forecastle rail |
| `beakhead_bulkhead_above_rail` | 0.2286 | — | RECONSTRUCTED | §6 Steel :39518, the rough-tree rail carried round the bow above the bulkhead |
| `beakhead_bulkhead_round_forward` | 0.4572 | — | RECONSTRUCTED | §6 Steel's beakhead bulkheads are rounded in plan; this ship has a round bow (ZAZ3067), so the middle of the bulkhead stands forward of its wings |
| `beakhead_stanchion_per_side` | 5 | — | SECONDARY | §6 Steel :17843-17855, five stanchions each side of the centreline |
| `beakhead_stanchion_sided` | 0.1778 | — | RECONSTRUCTED | §6 a stanchion sided as a top timber |
| `beakhead_plank_thickness` | 0.0762 | 0 ft 3 in | RECONSTRUCTED | §6 the bulkhead planked as the ship's side above the ports |
| `head_roundhouse_width` | 0.8382 | 2 ft 9 in | SECONDARY | §6 research 06-deck-layout §11, head structure §11.2: Steel :17846 keeps the two outer stanchions to the size of the round-houses; no dimension is given — RECONSTRUCTED as a privy for one man |
| `head_roundhouse_depth` | 0.762 | 2 ft 6 in | RECONSTRUCTED | §6 as above |
| `head_roundhouse_height` | 1.524 | 5 ft 0 in | RECONSTRUCTED | §6 as above |
| `head_door_width` | 0.6604 | 2 ft 2 in | RECONSTRUCTED | §6 Steel :17849, the stanchion next inboard of the bow chase port makes the head door |
| `head_door_height` | 1.3716 | 4 ft 6 in | RECONSTRUCTED | §6 as above |
| `bow_chase_port_width` | 0.7112 | 2 ft 4 in | SECONDARY | §6 Steel, quarterdeck port width used for the bow chase port in the bulkhead (research 06 §9) |
| `bow_chase_port_height` | 0.7112 | 2 ft 4 in | SECONDARY | §6 as above |
| `knighthead_half_breadth` | 0.3556 | 1 ft 2 in | SECONDARY | §6 research 06-deck-layout §5.3, knightheads: immediately each side of the stem head, from Steel :15347's stem half-thickness — RECONSTRUCTED |
| `knighthead_sided` | 0.254 | — | RECONSTRUCTED | §6 a bollard timber heavier than a top timber |
| `knighthead_above_bowsprit` | 0.4572 | — | SECONDARY | §6 Steel :15357-15359, the knightheads run high enough above the bowsprit to admit a chock between them |
| `cathead_root_from_stem` | 3.6576 | 12 ft 0 in | SECONDARY | §6 research 06-deck-layout §5.4, catheads: the inboard arm bolts to the cat beam |
| `cathead_root_half_breadth` | 3.048 | 10 ft 0 in | SECONDARY | §6 research 06-deck-layout §5.4, catheads |
| `cathead_outer_from_stem` | 2.4384 | 8 ft 0 in | SECONDARY | §6 research 06-deck-layout §5.4, catheads: the sheave centre at the outer end |
| `cathead_outer_half_breadth` | 4.4196 | 14 ft 6 in | SECONDARY | §6 research 06-deck-layout §5.4, catheads |
| `cathead_spread` | 8.8392 | — | SECONDARY | §6 research 06-deck-layout §5.4, catheads: twice cathead_outer_half_breadth, the athwartships span over the two outer ends |
| `cathead_stive_deg` | 22.6 | — | SECONDARY | §6 Steel :40062-40064, 5 in of rise per foot of length; the whole row is legible across all ten columns |
| `cathead_sided` | 0.3556 | — | SECONDARY | §6 Steel :40060, OCR-doubtful |
| `cathead_moulded` | 0.3302 | — | SECONDARY | §6 Steel :40061, OCR-doubtful |
| `cathead_inboard_length` | 2.5908 | 8 ft 6 in | SECONDARY | §6 Steel :40066, length inboard from the outside of the timber, OCR-doubtful |
| `cathead_sheave_count` | 3 | — | SECONDARY | §6 Steel :40068-40069, three sheaves in the outer end |
| `cathead_sheave_diameter` | 0.254 | 0 ft 10 in | SECONDARY | §6 Steel :40069, OCR-doubtful |
| `cathead_supporter_arm` | 1.0668 | — | SECONDARY | §6 Steel :40074, the thwartship arm of the knee under the cathead |
| `figurehead_forward_of_stem` | 3.3528 | — | RECONSTRUCTED | §8 research 08-paint-and-ornament §4.4 — CONJECTURAL: the figurehead of this ship is not documented anywhere; this is a classical female figure reconstructed from the ship's name and period practice, NOT the film ship's woman with sword and shield; sited on the head of the knee where ZAZ3067 draws a small figure, 66 px forward of the stem |
| `figurehead_above_rail` | 0.1524 | — | RECONSTRUCTED | §8 research 08-paint-and-ornament §4.4 — CONJECTURAL: the figurehead of this ship is not documented anywhere; this is a classical female figure reconstructed from the ship's name and period practice, NOT the film ship's woman with sword and shield; the plinth on the hair bracket |
| `figurehead_height` | 1.2192 | 4 ft 0 in | RECONSTRUCTED | §8 research 08-paint-and-ornament §4.4 — CONJECTURAL: the figurehead of this ship is not documented anywhere; this is a classical female figure reconstructed from the ship's name and period practice, NOT the film ship's woman with sword and shield; research 08 §4.4 — "the scale was drastically reduced", so a small figure |
| `figurehead_rake_deg` | 30 | — | RECONSTRUCTED | §8 research 08-paint-and-ornament §4.4 — CONJECTURAL: the figurehead of this ship is not documented anywhere; this is a classical female figure reconstructed from the ship's name and period practice, NOT the film ship's woman with sword and shield; the figure leans forward over the water, following the run of the head |
| `figurehead_hem_diameter` | 0.6096 | 2 ft 0 in | RECONSTRUCTED | §8 research 08-paint-and-ornament §4.4 — CONJECTURAL: the figurehead of this ship is not documented anywhere; this is a classical female figure reconstructed from the ship's name and period practice, NOT the film ship's woman with sword and shield; the spread of the drapery at the plinth |
| `figurehead_waist_diameter` | 0.3556 | 1 ft 2 in | RECONSTRUCTED | §8 research 08-paint-and-ornament §4.4 — CONJECTURAL: the figurehead of this ship is not documented anywhere; this is a classical female figure reconstructed from the ship's name and period practice, NOT the film ship's woman with sword and shield |
| `figurehead_waist_height` | 0.6858 | 2 ft 3 in | RECONSTRUCTED | §8 research 08-paint-and-ornament §4.4 — CONJECTURAL: the figurehead of this ship is not documented anywhere; this is a classical female figure reconstructed from the ship's name and period practice, NOT the film ship's woman with sword and shield |
| `figurehead_shoulder_height` | 0.9144 | 3 ft 0 in | RECONSTRUCTED | §8 research 08-paint-and-ornament §4.4 — CONJECTURAL: the figurehead of this ship is not documented anywhere; this is a classical female figure reconstructed from the ship's name and period practice, NOT the film ship's woman with sword and shield; set so that the neck and the head together make up the remaining quarter of her height |
| `figurehead_shoulder_breadth` | 0.4064 | 1 ft 4 in | RECONSTRUCTED | §8 research 08-paint-and-ornament §4.4 — CONJECTURAL: the figurehead of this ship is not documented anywhere; this is a classical female figure reconstructed from the ship's name and period practice, NOT the film ship's woman with sword and shield |
| `figurehead_head_diameter` | 0.2286 | 0 ft 9 in | RECONSTRUCTED | §8 research 08-paint-and-ornament §4.4 — CONJECTURAL: the figurehead of this ship is not documented anywhere; this is a classical female figure reconstructed from the ship's name and period practice, NOT the film ship's woman with sword and shield |
| `figurehead_arm_diameter` | 0.1016 | 0 ft 4 in | RECONSTRUCTED | §8 research 08-paint-and-ornament §4.4 — CONJECTURAL: the figurehead of this ship is not documented anywhere; this is a classical female figure reconstructed from the ship's name and period practice, NOT the film ship's woman with sword and shield |
| `figurehead_arm_length` | 0.5334 | 1 ft 9 in | RECONSTRUCTED | §8 research 08-paint-and-ornament §4.4 — CONJECTURAL: the figurehead of this ship is not documented anywhere; this is a classical female figure reconstructed from the ship's name and period practice, NOT the film ship's woman with sword and shield |
| `figurehead_neck_diameter` | 0.1143 | 0 ft 4.5 in | RECONSTRUCTED | §8 research 08-paint-and-ornament §4.4 — CONJECTURAL: the figurehead of this ship is not documented anywhere; this is a classical female figure reconstructed from the ship's name and period practice, NOT the film ship's woman with sword and shield; the neck at three fifths of the head, so that the head reads as a head and not as a knob on the shoulders |
| `figurehead_neck_height` | 0.0762 | 0 ft 3 in | RECONSTRUCTED | §8 research 08-paint-and-ornament §4.4 — CONJECTURAL: the figurehead of this ship is not documented anywhere; this is a classical female figure reconstructed from the ship's name and period practice, NOT the film ship's woman with sword and shield; the gap between the shoulder line and the chin |
| `figurehead_chest_breadth` | 0.381 | 1 ft 3 in | RECONSTRUCTED | §8 research 08-paint-and-ornament §4.4 — CONJECTURAL: the figurehead of this ship is not documented anywhere; this is a classical female figure reconstructed from the ship's name and period practice, NOT the film ship's woman with sword and shield; the body between the waist and the shoulder, wider than the waist and narrower than the shoulder, which is what gives the torso its taper |
| `figurehead_hip_breadth` | 0.4318 | 1 ft 5 in | RECONSTRUCTED | §8 research 08-paint-and-ornament §4.4 — CONJECTURAL: the figurehead of this ship is not documented anywhere; this is a classical female figure reconstructed from the ship's name and period practice, NOT the film ship's woman with sword and shield; the drapery over the hips, the widest of the body above the hem |
| `figurehead_hip_height` | 0.4572 | 1 ft 6 in | RECONSTRUCTED | §8 research 08-paint-and-ornament §4.4 — CONJECTURAL: the figurehead of this ship is not documented anywhere; this is a classical female figure reconstructed from the ship's name and period practice, NOT the film ship's woman with sword and shield; the hips, under the drapery |
| `figurehead_plinth_diameter` | 0.508 | 1 ft 8 in | RECONSTRUCTED | §8 research 08-paint-and-ornament §4.4 — CONJECTURAL: the figurehead of this ship is not documented anywhere; this is a classical female figure reconstructed from the ship's name and period practice, NOT the film ship's woman with sword and shield; the foot of the carving where it is let into the hair bracket, narrower than the hem because the drapery rolls under above it |
| `figurehead_hem_height` | 0.1016 | 0 ft 4 in | RECONSTRUCTED | §8 research 08-paint-and-ornament §4.4 — CONJECTURAL: the figurehead of this ship is not documented anywhere; this is a classical female figure reconstructed from the ship's name and period practice, NOT the film ship's woman with sword and shield; how far above the plinth the drapery stands widest |
| `figurehead_depth_fraction` | 0.62 | — | RECONSTRUCTED | §8 research 08-paint-and-ornament §4.4 — CONJECTURAL: the figurehead of this ship is not documented anywhere; this is a classical female figure reconstructed from the ship's name and period practice, NOT the film ship's woman with sword and shield; the fore-and-aft depth of the carving as a fraction of its athwartships breadth — a figurehead is carved out of a stack sided close to the knee of the head, so it is a flat-backed relief rather than a statue in the round |
| `figurehead_arm_forward_deg` | 24 | — | RECONSTRUCTED | §8 research 08-paint-and-ornament §4.4 — CONJECTURAL: the figurehead of this ship is not documented anywhere; this is a classical female figure reconstructed from the ship's name and period practice, NOT the film ship's woman with sword and shield; both arms carried forward of the body, which is the pose every surviving small figurehead of the date is carved in and the one thing that reads at a distance |
| `figurehead_arm_spread_deg` | 16 | — | RECONSTRUCTED | §8 research 08-paint-and-ornament §4.4 — CONJECTURAL: the figurehead of this ship is not documented anywhere; this is a classical female figure reconstructed from the ship's name and period practice, NOT the film ship's woman with sword and shield; and spread a little off the sides, so the arms show against the drapery instead of disappearing into it |
| `figurehead_mantle_top_below_head` | 0.0508 | — | RECONSTRUCTED | §8 research 08-paint-and-ornament §4.4 — CONJECTURAL: the figurehead of this ship is not documented anywhere; this is a classical female figure reconstructed from the ship's name and period practice, NOT the film ship's woman with sword and shield; the collar of the mantle, just below the neck |
| `figurehead_mantle_below_waist` | 0.127 | — | RECONSTRUCTED | §8 research 08-paint-and-ornament §4.4 — CONJECTURAL: the figurehead of this ship is not documented anywhere; this is a classical female figure reconstructed from the ship's name and period practice, NOT the film ship's woman with sword and shield; the mantle falling a little past the waist, which is where the blue stops and the pale robe begins in the reference photograph |
| `figurehead_mantle_proud` | 0.0254 | — | RECONSTRUCTED | §8 research 08-paint-and-ornament §4.4 — CONJECTURAL: the figurehead of this ship is not documented anywhere; this is a classical female figure reconstructed from the ship's name and period practice, NOT the film ship's woman with sword and shield; the cloth standing off the body |
| `hair_bracket_length` | 1.2192 | 4 ft 0 in | SECONDARY | §6 Steel :3043, the moulding terminating the head rails and running into the back of the figure |
| `hair_bracket_sided` | 0.127 | — | RECONSTRUCTED | §6 a moulding sided as the rails it gathers |
| `trailboard_depth` | 0.3048 | 1 ft 0 in | RECONSTRUCTED | §8 research 08 §4.4, "very limited trailboard decoration" on a small ship of this date |

### Deck furniture

| key | metric | period figure | grade | source |
|---|---|---|---|---|
| `furniture_foremast_station_from_stem` | 4.3053 | 14 ft 1.5 in | SECONDARY | §6 research 04 §8, Steel Centres of Masts 28-gun column scaled to a 126 ft gun deck |
| `furniture_mainmast_station_from_stem` | 21.7551 | 71 ft 4.5 in | SECONDARY | §6 research 04 §8, Steel Centres of Masts 28-gun column scaled to a 126 ft gun deck |
| `furniture_mizzen_station_from_stem` | 32.9057 | 107 ft 11.5 in | SECONDARY | §6 research 04 §8, Steel Centres of Masts 28-gun column scaled to a 126 ft gun deck |
| `wheel_station_from_stem` | 34.9504 | 114 ft 8 in | RECONSTRUCTED | §6 research 06 deck-layout §2.2, wheel 6 ft 9 in abaft the mizzen |
| `wheel_diameter` | 1.5748 | 5 ft 2 in | SECONDARY | §6 Lavery, Arming and Fitting of English Ships of War: an outside diameter of a little over 5 ft |
| `wheel_swept_diameter` | 1.9304 | 6 ft 4 in | RECONSTRUCTED | §6 research 06 deck-layout §2.1, the rim plus a turned handle projecting 7 in at each end of a spoke |
| `wheel_count` | 1 | — | RECONSTRUCTED | §6 research 06 deck-layout §2.1, a 2 ft 3 in barrel will not take a wheel at each end and the rope turns between |
| `wheel_axle_above_deck` | 1.0414 | 3 ft 5 in | SECONDARY | §6 Steel 1805 :39506, stanchion heads 3 ft 4 in to 3 ft 6 in above the deck |
| `wheel_barrel_length` | 0.6858 | 2 ft 3 in | SECONDARY | §6 Steel 1805 :39506, quarter deck table row Q, 32-gun column |
| `wheel_barrel_diameter_mid` | 0.4064 | — | SECONDARY | §6 Steel 1805 :39508, row S |
| `wheel_barrel_diameter_end` | 0.4572 | — | SECONDARY | §6 Steel 1805 :39507, row R, OCR-doubtful |
| `wheel_stanchion_broad` | 0.3048 | — | SECONDARY | §6 Steel 1805 :39504, row N |
| `wheel_stanchion_thick` | 0.127 | — | SECONDARY | §6 Steel 1805 :39505, row O |
| `wheel_spoke_count` | 10 | — | RECONSTRUCTED | §6 research 06 deck-layout §2.1, Steel gives no spoke count; 8 or 10 is the period norm |
| `wheel_spoke_handle` | 0.1778 | — | RECONSTRUCTED | §6 research 06 deck-layout §2.1, turned handle projecting beyond the rim |
| `wheel_rim_thickness` | 0.0762 | 0 ft 3 in | RECONSTRUCTED | §6 research 06 deck-layout §2.1, the felloe of a wheel this size |
| `binnacle_station_from_stem` | 33.9852 | 111 ft 6 in | RECONSTRUCTED | §6 research 06 deck-layout §2.3, 3 ft 6 in clear ahead of the wheel |
| `binnacle_length` | 1.0668 | 3 ft 6 in | RECONSTRUCTED | §6 research 06 deck-layout §2.3, three-compartment RN binnacle |
| `binnacle_depth` | 0.4064 | 1 ft 4 in | RECONSTRUCTED | §6 research 06 deck-layout §2.3 |
| `binnacle_height` | 0.9144 | 3 ft 0 in | RECONSTRUCTED | §6 research 06 deck-layout §2.3 |
| `capstan_abaft_mainmast` | 5.7912 | — | SECONDARY | §6 Steel 1805 :38405, centre of main jeer capstan abaft the centre of the mainmast, 32-gun column |
| `capstan_barrel_diameter` | 0.5524 | 1 ft 9.8 in | SECONDARY | §6 Steel 1805 :38408 |
| `capstan_barrel_above_deck` | 1.1684 | 3 ft 10 in | RECONSTRUCTED | §6 research 06 deck-layout §3.2, what is left of the 10 ft 8 in deck-to-deck barrel above the quarterdeck |
| `capstan_drumhead_diameter` | 1.2192 | 4 ft 0 in | SECONDARY | §6 Steel 1805 :38437, row X |
| `capstan_drumhead_thickness` | 0.2858 | 0 ft 11.3 in | SECONDARY | §6 Steel 1805 :38438-38439, upper piece 5 3/4 in and lower piece 5 1/2 in |
| `capstan_bar_hole_count` | 12 | — | SECONDARY | §6 Steel 1805 :38565, bar-holes in the drumhead |
| `capstan_bar_hole_square` | 0.0984 | — | SECONDARY | §6 Steel 1805 :38566 |
| `capstan_bar_hole_depth` | 0.2984 | 0 ft 11.8 in | SECONDARY | §6 Steel 1805 :38567 |
| `capstan_whelp_count` | 6 | — | SECONDARY | §6 Steel 1805 :38412, upper whelps |
| `capstan_whelp_length` | 0.9144 | 3 ft 0 in | SECONDARY | §6 Steel 1805 :38413 |
| `capstan_whelp_broad_heel` | 0.2731 | — | SECONDARY | §6 Steel 1805 :38417 |
| `capstan_whelp_broad_head` | 0.1905 | — | SECONDARY | §6 Steel 1805 :38418 |
| `capstan_partner_thickness` | 0.1524 | 0 ft 6 in | SECONDARY | §6 Steel 1805 :39379, capstan partners thick |
| `main_hatch_station_from_stem` | 19.304 | 63 ft 4 in | RECONSTRUCTED | §6 research 06 deck-layout §4.1, aft side 4 ft 6 in forward of the mainmast centre |
| `main_hatch_length` | 2.1336 | 6 ft 12 in | SECONDARY | §6 Steel 1805 :33355 fore-and-aft, 32-gun column |
| `main_hatch_width` | 1.3716 | 4 ft 6 in | SECONDARY | §6 Steel 1805 :33355 thwartships, 32-gun column |
| `fore_hatch_station_from_stem` | 10.7442 | 35 ft 3 in | RECONSTRUCTED | §6 research 06 deck-layout §4.1, fore side ranging with the after end of the forecastle at 33 ft |
| `fore_hatch_length` | 1.3716 | 4 ft 6 in | SECONDARY | §6 Steel 1805 :33633 |
| `fore_hatch_width` | 1.3716 | 4 ft 6 in | SECONDARY | §6 Steel 1805 :33633 |
| `after_hatch_station_from_stem` | 23.4696 | 77 ft 0 in | RECONSTRUCTED | §6 research 06 deck-layout §4.2, abaft the mast room and clear of the after chain pump |
| `after_hatch_length` | 1.2192 | 4 ft 0 in | RECONSTRUCTED | §6 research 06 deck-layout §4.2, the Steel row is not legible in the frigate column |
| `after_hatch_width` | 1.2192 | 4 ft 0 in | RECONSTRUCTED | §6 research 06 deck-layout §4.2 |
| `ladderway_station_from_stem` | 17.526 | 57 ft 6 in | SECONDARY | §6 Steel 1805 :17482, double ladderway immediately forward of the main hatch |
| `ladderway_length` | 0.8128 | 2 ft 8 in | SECONDARY | §6 Steel 1805 :39375, ladderway fore-and-aft |
| `ladderway_width` | 1.8288 | 6 ft 0 in | RECONSTRUCTED | §6 research 06 deck-layout §4.1, a double ladderway takes two ladders abreast |
| `coaming_height_above_deck` | 0.3302 | 1 ft 1 in | SECONDARY | §6 Steel, Form of a Contract :44581, coamings at least 13 inches |
| `coaming_broad` | 0.2286 | — | SECONDARY | §6 Steel 1805 :39445 |
| `grating_batten_square` | 0.0508 | — | SECONDARY | §6 Steel 1805 :1293, grating battens about 2 in square |
| `grating_batten_gap` | 0.0508 | — | SECONDARY | §6 Steel 1805 :2968, laid to leave about 2 in openings |
| `riding_bitt_aft_station_from_stem` | 13.716 | 45 ft 0 in | RECONSTRUCTED | §6 research 06 deck-layout §5.1, Steel 1805 :17470 rule applied to the fourth port |
| `riding_bitt_fwd_station_from_stem` | 11.2776 | 37 ft 0 in | RECONSTRUCTED | §6 research 06 deck-layout §5.1, one beam-space and one more forward |
| `riding_bitt_pin_square` | 0.2921 | — | RECONSTRUCTED | §6 research 06 deck-layout §5.1, Steel's armed-brigantine contract 10 1/2 in scaled up for a Sixth Rate |
| `riding_bitt_pin_offset` | 0.9144 | — | RECONSTRUCTED | §6 research 06 deck-layout §5.1, the pins must straddle the two cables |
| `riding_bitt_pin_height` | 0.9144 | 3 ft 0 in | RECONSTRUCTED | §6 research 06 deck-layout §5.1, head standing clear above the cross-piece |
| `riding_bitt_crosspiece_broad` | 0.2032 | — | SECONDARY | §6 Steel 1805 :39442 |
| `riding_bitt_crosspiece_deep` | 0.1461 | — | SECONDARY | §6 Steel 1805 :39443 |
| `riding_bitt_crosspiece_above_deck` | 0.5588 | 1 ft 10 in | SECONDARY | §6 Steel 1805 :39444, upper side above the deck |
| `riding_bitt_crosspiece_projection` | 0.4572 | — | SECONDARY | §6 Steel 1805 :39445, ends project beyond the bitts |
| `main_topsail_sheet_bitt_station_from_stem` | 20.2692 | 66 ft 6 in | SECONDARY | §6 Steel 1805 :17538, aft side against the beam abaft the main hatchway |
| `main_jeer_bitt_station_from_stem` | 22.2504 | 73 ft 0 in | SECONDARY | §6 Steel 1805 :17540, against the fore side of the beam abaft the mainmast |
| `jeer_bitt_pin_offset` | 1.2192 | — | RECONSTRUCTED | §6 research 06 deck-layout §5.2, insides plumbing the pumps, set out far enough to clear the cisterns |
| `jeer_bitt_pin_square` | 0.2286 | — | RECONSTRUCTED | §6 research 06 deck-layout §5.2, lighter than a riding bitt |
| `jeer_bitt_pin_height` | 1.0668 | 3 ft 6 in | RECONSTRUCTED | §6 research 06 deck-layout §5.2, standing clear above the cross-piece |
| `jeer_bitt_crosspiece_above_deck` | 0.6604 | 2 ft 2 in | SECONDARY | §6 Steel 1805 :17543, one third of the height between upper deck and quarterdeck |
| `fore_topsail_sheet_bitt_from_foremast` | 0.8382 | — | SECONDARY | §6 Steel 1805 :17592, one pair forward of and one abaft the foremast |
| `fore_topsail_sheet_bitt_offset` | 0.6096 | — | RECONSTRUCTED | §6 research 06 deck-layout §5.2, let into the sides of the forecastle beams |
| `chain_pump_fwd_station_from_stem` | 20.7264 | 68 ft 0 in | RECONSTRUCTED | §6 research 06 deck-layout §6, immediately forward of the mainmast |
| `chain_pump_aft_station_from_stem` | 22.7076 | 74 ft 6 in | RECONSTRUCTED | §6 research 06 deck-layout §6, immediately abaft the mainmast, clear of the jeer bitts |
| `chain_pump_offset` | 0.6858 | — | RECONSTRUCTED | §6 research 06 deck-layout §6, clear of the mainmast partners |
| `chain_pump_trunk_square` | 0.3048 | — | RECONSTRUCTED | §6 research 06 deck-layout §6, a 7 in chain in a 7 in trunk, cased |
| `chain_pump_head_above_deck` | 0.9144 | 3 ft 0 in | RECONSTRUCTED | §6 research 06 deck-layout §6, head standing above the cistern to take the sprocket and the cranks |
| `pump_cistern_broad` | 0.6096 | — | SECONDARY | §6 Steel 1805 :35293, cistern broad out to out, OCR-doubtful |
| `pump_cistern_deep` | 0.6096 | — | SECONDARY | §6 Steel 1805 :35292, OCR-doubtful |
| `pump_cistern_projection` | 0.2032 | — | SECONDARY | §6 Steel 1805 :35294, ends project beyond the pump heads |
| `pump_winch_above_deck` | 0.8382 | 2 ft 9 in | RECONSTRUCTED | §6 research 06 deck-layout §6, the iron crank spindle of the Cole-Bentinck pump |
| `pump_winch_diameter` | 0.0635 | 0 ft 2.5 in | RECONSTRUCTED | §6 research 06 deck-layout §6, wrought-iron spindle and cranks |
| `pump_dale_width` | 0.2286 | 0 ft 9 in | RECONSTRUCTED | §6 research 06 deck-layout §6, square wooden trough, 9 in by 7 in internal |
| `pump_dale_depth` | 0.1778 | 0 ft 7 in | RECONSTRUCTED | §6 research 06 deck-layout §6 |
| `pump_dale_fall` | 0.0833 | — | RECONSTRUCTED | §6 research 06 deck-layout §6, sloping about 1 in 12 outboard |
| `elm_pump_station_from_stem` | 23.3172 | 76 ft 6 in | RECONSTRUCTED | §6 research 06 deck-layout §6, the two elm-tree pumps abaft the chain pumps |
| `elm_pump_offset` | 1.0668 | — | RECONSTRUCTED | §6 research 06 deck-layout §6 |
| `elm_pump_diameter` | 0.2794 | 0 ft 11 in | RECONSTRUCTED | §6 research 06 deck-layout §6, a 7 in bore in an elm trunk |
| `elm_pump_height` | 1.0668 | 3 ft 6 in | RECONSTRUCTED | §6 research 06 deck-layout §6, head above the deck to take the brake |
| `belfry_station_from_stem` | 9.7536 | 32 ft 0 in | SECONDARY | §6 Steel 1805 :1372 and :17921, at the after beams of the forecastle |
| `belfry_width` | 0.9144 | 3 ft 0 in | RECONSTRUCTED | §6 research 06 deck-layout §7.1, scaled from Steel's 110-gun proportions |
| `belfry_depth` | 0.3048 | 1 ft 0 in | RECONSTRUCTED | §6 research 06 deck-layout §7.1 |
| `belfry_height` | 1.3716 | 4 ft 6 in | RECONSTRUCTED | §6 research 06 deck-layout §7.1 |
| `belfry_stanchion_square` | 0.1016 | — | RECONSTRUCTED | §6 research 06 deck-layout §7.1 |
| `bell_mouth_diameter` | 0.2794 | 0 ft 11 in | RECONSTRUCTED | §6 research 06 deck-layout §7.1, period Sixth-Rate norm; no dimensioned source found |
| `bell_height` | 0.3302 | 1 ft 1 in | RECONSTRUCTED | §6 research 06 deck-layout §7.1 |
| `galley_chimney_station_from_stem` | 8.5344 | 27 ft 12 in | RECONSTRUCTED | §6 research 06 deck-layout §7.3, moved forward of the model's forecastle break |
| `galley_chimney_coaming_square` | 0.508 | — | RECONSTRUCTED | §6 research 06 deck-layout §7.3, coaming square in the clear |
| `galley_chimney_coaming_height` | 0.2286 | 0 ft 9 in | SECONDARY | §6 Steel 1805 :39451, upper side standing above the deck |
| `galley_funnel_diameter` | 0.3556 | 1 ft 2 in | RECONSTRUCTED | §6 research 06 deck-layout §7.3, sheet-copper stack inside the coaming |
| `galley_funnel_height` | 1.2192 | 4 ft 0 in | RECONSTRUCTED | §6 research 06 deck-layout §7.3, rising about 4 ft above the forecastle with a cowl |
| `steam_grating_offset` | 0.762 | — | RECONSTRUCTED | §6 research 06 deck-layout §7.3, one steam grating each side of the funnel |
| `steam_grating_length` | 0.762 | 2 ft 6 in | RECONSTRUCTED | §6 research 06 deck-layout §7.3 |
| `steam_grating_width` | 0.6096 | 2 ft 0 in | RECONSTRUCTED | §6 research 06 deck-layout §7.3 |
| `skylight_station_from_stem` | 35.9664 | 118 ft 0 in | RECONSTRUCTED | §6 research 06 deck-layout §4.4, the run of gratings over the great cabin, moved abaft the wheel |
| `skylight_length` | 1.2192 | 4 ft 0 in | RECONSTRUCTED | §6 research 06 deck-layout §4.4 |
| `skylight_width` | 1.0668 | 3 ft 6 in | RECONSTRUCTED | §6 research 06 deck-layout §4.4, 4 ft 0 in of grating on the centreline |
| `skylight_height` | 0.4572 | 1 ft 6 in | RECONSTRUCTED | §6 research 06 deck-layout §4.4, a low glazed skylight with a pitched top |
| `companion_station_from_stem` | 37.0332 | 121 ft 6 in | RECONSTRUCTED | §6 research 06 deck-layout §4.4, over the after ladderway to the cabin |
| `companion_length` | 1.0668 | 3 ft 6 in | RECONSTRUCTED | §6 research 06 deck-layout §4.4 |
| `companion_width` | 0.9144 | 3 ft 0 in | RECONSTRUCTED | §6 research 06 deck-layout §4.4 |
| `companion_above_deck` | 0.2286 | 0 ft 9 in | SECONDARY | §6 Steel 1805 :39451, the companion stands 9 in above the deck |
| `companion_hood_height` | 0.762 | 2 ft 6 in | RECONSTRUCTED | §6 research 06 deck-layout §4.4, sloping hood over the ladder head |
| `companion_framing_thick` | 0.1016 | — | SECONDARY | §6 Steel 1805 :39450, companion framing thick |
| `skid_beam_count` | 4 | — | RECONSTRUCTED | §6 research 06 deck-layout §8.2 |
| `skid_beam_first_station_from_stem` | 13.4112 | 44 ft 0 in | RECONSTRUCTED | §6 research 06 deck-layout §8.2, the foremost skid |
| `skid_beam_spacing` | 2.4384 | 8 ft 0 in | RECONSTRUCTED | §6 research 06 deck-layout §8.2, four skids spanning 24 ft — the length of the launch — and clear of the mainmast |
| `skid_beam_sided` | 0.2032 | — | RECONSTRUCTED | §6 research 06 deck-layout §8.2 |
| `skid_beam_moulded` | 0.1524 | — | RECONSTRUCTED | §6 research 06 deck-layout §8.2 |
| `skid_beam_top_above_deck` | 1.9812 | 6 ft 6 in | RECONSTRUCTED | §6 from the reference photograph, in which the boats stand with their keels level with the gangways; research 06 §8.2 offers an unsourced 5 ft 0 in |
| `skid_stanchion_square` | 0.127 | — | RECONSTRUCTED | §6 research 06 deck-layout §8.2, a stanchion under each end of each skid |
| `hammock_crane_spacing` | 0.6096 | 2 ft 0 in | RECONSTRUCTED | §6 counted off the reference photograph, in which the cranes stand close — nearer 2 ft apart than the 2 ft 6 in to 3 ft usually quoted |
| `hammock_crane_height` | 0.6096 | 2 ft 0 in | RECONSTRUCTED | §6 from the reference photograph, standing about 2 ft above the cap rail |
| `hammock_crane_diameter` | 0.0381 | 0 ft 1.5 in | RECONSTRUCTED | §6 the crane is drawn bright rather than blacked, because that is how the reference photograph shows it |
| `hammock_rail_diameter` | 0.0508 | 0 ft 2 in | RECONSTRUCTED | §6 the rail run through the heads of the cranes, which the photograph shows as a light line along the top of them |
| `hammock_crane_spread` | 0.3556 | — | RECONSTRUCTED | §6 the fork at the head of the crane, which carries the netting outboard of the rail |
| `hammock_crane_run_from_stem` | 3.6576 | 12 ft 0 in | RECONSTRUCTED | §6 the cranes begin where the rail leaves the head |
| `hammock_crane_run_short_of_stern` | 0.762 | — | RECONSTRUCTED | §6 the after run stops short of the taffrail |
| `hammock_netting_rows` | 3 | — | RECONSTRUCTED | §6 from the reference photograph, three rows of netting between the cranes |
| `belaying_pin_spacing` | 0.3048 | 1 ft 0 in | RECONSTRUCTED | §6 from the reference photograph, pins about a foot apart along the rail |
| `belaying_pin_length` | 0.3556 | 1 ft 2 in | RECONSTRUCTED | §6 a turned pin of this length is the period norm |
| `belaying_pin_diameter` | 0.0381 | 0 ft 1.5 in | RECONSTRUCTED | §6 |
| `fife_rail_radius` | 1.0668 | — | RECONSTRUCTED | §6 a fife rail standing clear of the mast and its partners |
| `fife_rail_height` | 0.9144 | 3 ft 0 in | RECONSTRUCTED | §6 a man belays at waist height |
| `fife_rail_timber` | 0.127 | — | RECONSTRUCTED | §6 rail and stanchion scantling |
| `ladder_width` | 0.6096 | 2 ft 0 in | RECONSTRUCTED | §6 one man wide |
| `ladder_tread_spacing` | 0.2286 | 0 ft 9 in | RECONSTRUCTED | §6 period companion-ladder rise |
| `ladder_stringer_square` | 0.1016 | — | RECONSTRUCTED | §6 |
| `ladder_tread_thickness` | 0.0508 | 0 ft 2 in | RECONSTRUCTED | §6 |

### Armament

| key | metric | period figure | grade | source |
|---|---|---|---|---|
| `gun_9pdr_count` | 24 | — | PRIMARY | §6.3 threedecks ex Winfield BWAS-1793, Plymouth establishment 6.1796: 24 long 9-pdr on the upper deck. ALTERNATIVE: 24 x 32-pdr carronades in the 21.4.1798 fit |
| `gun_4pdr_count` | 10 | — | PRIMARY | §6.3 8 long 4-pdr on the quarterdeck and 2 on the forecastle, Plymouth establishment 6.1796. ALTERNATIVE: only the 2 forecastle chase guns survive in the 21.4.1798 fit |
| `carronade_12pdr_count` | 6 | — | PRIMARY | §6.3 4 twelve-pounder carronades on the quarterdeck and 2 on the forecastle, Plymouth establishment 6.1796. ALTERNATIVE: 18-pdr carronades, 10 of them, in the 21.4.1798 fit |
| `gun_truck_carriage_count` | 34 | — | PRIMARY | §6.3 one four-truck carriage under each of the 24 long 9-pdr and 10 long 4-pdr; the carronades are on slides and are not counted here |
| `gun_9pdr_barrel_length` | 2.5908 | 8 ft 6 in | SECONDARY | §9.3 Falconer, Universal Dictionary of the Marine 1776, mensuration of 1753: iron sea-service 9-pdr, 8 ft 6 in, 27 cwt 2 qr 2 lb |
| `gun_9pdr_bore` | 0.1067 | — | SECONDARY | §9.3 nominal bore of a 9-pounder: 4.0 in shot with the establishment windage of 0.2 in |
| `gun_4pdr_barrel_length` | 1.8288 | 6 ft 0 in | SECONDARY | §9.3 Falconer, mensuration of 1753: iron sea-service 4-pdr, 6 ft 0 in, 12 cwt 2 qr 13 lb |
| `gun_4pdr_bore` | 0.0813 | — | SECONDARY | §9.3 nominal bore of a 4-pounder: 3.05 in shot with establishment windage |
| `carronade_12pdr_barrel_length` | 0.8128 | 2 ft 8 in | RECONSTRUCTED | §9.3 the 32-pdr Carron pattern of 1796 is 4 ft 0 in on a 6.35 in bore, 7.6 calibres; 7.0 calibres on the 12-pdr bore gives 2 ft 8 in |
| `carronade_12pdr_bore` | 0.1173 | — | RECONSTRUCTED | §9.3 12-pdr shot of 4.4 in with carronade windage, which is tighter than a long gun's |
| `gun_base_ring_radius_cal` | 1.52 | — | RECONSTRUCTED | §9.3 metal at the vent is one calibre thick all round on the 1753 pattern, plus the base ring |
| `gun_first_reinforce_radius_cal` | 1.38 | — | RECONSTRUCTED | §9.3 the first reinforce tapers about one twelfth of its diameter over its length |
| `gun_second_reinforce_radius_cal` | 1.22 | — | RECONSTRUCTED | §9.3 second reinforce, one step down from the first |
| `gun_chase_radius_cal` | 0.86 | — | RECONSTRUCTED | §9.3 the chase at the muzzle astragal, metal about a third of a calibre thick |
| `gun_muzzle_swell_radius_cal` | 1.02 | — | RECONSTRUCTED | §9.3 the swell of the muzzle stands proud of the chase by about a sixth of a calibre |
| `gun_ring_proud_cal` | 0.08 | — | RECONSTRUCTED | §9.3 how far a base ring, reinforce ring or astragal stands above the metal beside it |
| `gun_first_reinforce_end_u` | 0.29 | — | RECONSTRUCTED | §9.3 the first reinforce is two sevenths of the length from the base ring on the 1753 pattern |
| `gun_second_reinforce_end_u` | 0.5 | — | RECONSTRUCTED | §9.3 the second reinforce ends at half the length |
| `gun_muzzle_astragal_u` | 0.9 | — | RECONSTRUCTED | §9.3 the astragal and fillets that begin the swell of the muzzle |
| `gun_cascabel_length_cal` | 1.6 | — | RECONSTRUCTED | §9.3 button, neck and fillet abaft the base ring, about one and a half calibres |
| `gun_cascabel_button_radius_cal` | 0.46 | — | RECONSTRUCTED | §9.3 the pomiglion, which the breeching is seized round |
| `gun_cascabel_neck_radius_cal` | 0.28 | — | RECONSTRUCTED | §9.3 the neck between the button and the breech |
| `gun_trunnion_from_breech_u` | 0.41 | — | RECONSTRUCTED | §9.4 the trunnions are set at the point of balance, a little abaft three sevenths of the length from the base ring |
| `gun_trunnion_diameter_cal` | 1 | — | SECONDARY | §9.3 a trunnion is one calibre in diameter and one calibre long, which is the founders' rule |
| `gun_trunnion_length_cal` | 1 | — | SECONDARY | §9.3 as above |
| `gun_rimbase_radius_cal` | 0.66 | — | RECONSTRUCTED | §9.3 the rimbase where the trunnion leaves the gun, which keeps the piece from working fore and aft in the carriage |
| `carronade_breech_radius_cal` | 1.02 | — | RECONSTRUCTED | §9.3 a carronade is thin metal beside a long gun: about one calibre of radius at the breech ring |
| `carronade_body_radius_cal` | 0.86 | — | RECONSTRUCTED | §9.3 the parallel body forward of the reinforce ring |
| `carronade_chase_radius_cal` | 0.78 | — | RECONSTRUCTED | §9.3 the chase just abaft the muzzle ring |
| `carronade_muzzle_radius_cal` | 0.88 | — | RECONSTRUCTED | §9.3 the muzzle, which on a carronade is a cup rather than a swell |
| `carronade_muzzle_cup_depth_u` | 0.07 | — | RECONSTRUCTED | §9.3 the countersunk cup at the muzzle, the carronade's most recognisable feature |
| `carronade_reinforce_ring_u` | 0.16 | — | RECONSTRUCTED | §9.3 the ring abaft which the metal is thickest |
| `carronade_muzzle_ring_u` | 0.86 | — | RECONSTRUCTED | §9.3 the ring at the root of the muzzle |
| `carronade_loop_from_muzzle_u` | 0.52 | — | RECONSTRUCTED | §9.5 the loop under the piece, which takes the bolt through the upper carriage, is at the point of balance |
| `carronade_loop_depth_cal` | 0.7 | — | RECONSTRUCTED | §9.5 how far the loop hangs below the metal |
| `gun_9pdr_axis_above_deck` | 0.8636 | 2 ft 10 in | RECONSTRUCTED | §9.4 Falconer's rule applied to the hull's own sill of 1 ft 9 in and port depth of 2 ft 4.8 in: the bore axis stands 13 in above the sill |
| `gun_4pdr_axis_above_deck` | 0.6858 | 2 ft 3 in | RECONSTRUCTED | §9.4 the same rule on the smaller piece and its lower carriage |
| `gun_9pdr_carriage_length` | 1.3462 | 4 ft 5 in | RECONSTRUCTED | §9.4 Falconer's proportion of about 0.52 of the barrel length, on an 8 ft 6 in gun |
| `gun_9pdr_carriage_width` | 0.9144 | 3 ft 0 in | RECONSTRUCTED | §9.4 over the trucks; must clear the 2 ft 6 in port with the side tackles |
| `gun_4pdr_carriage_length` | 0.9652 | 3 ft 2 in | RECONSTRUCTED | §9.4 the same proportion of 0.52 on a 6 ft 0 in gun |
| `gun_4pdr_carriage_width` | 0.7112 | 2 ft 4 in | RECONSTRUCTED | §9.4 scaled with the piece |
| `gun_carriage_trunnion_from_fore` | 0.254 | — | RECONSTRUCTED | §9.4 the trunnion notch is cut ten inches abaft the fore end of the cheeks, over the fore axletree |
| `gun_carriage_cheek_thickness` | 0.1016 | 0 ft 4 in | RECONSTRUCTED | §9.4 bracket thickness; Falconer: "the breadth of the wheels is always equal to that of the cheeks" |
| `gun_carriage_cheek_mid_u` | 0.72 | — | RECONSTRUCTED | §9.4 the first step down in the top of the cheek, as a fraction of the height at the fore end |
| `gun_carriage_cheek_aft_u` | 0.46 | — | RECONSTRUCTED | §9.4 the second step down, at the after end where the bed and quoin go |
| `gun_carriage_step_mid_u` | 0.4 | — | RECONSTRUCTED | §9.4 where the first step falls, as a fraction of the carriage length from the fore end |
| `gun_carriage_step_aft_u` | 0.68 | — | RECONSTRUCTED | §9.4 where the second step falls |
| `gun_axletree_siding` | 0.1143 | 0 ft 4.5 in | RECONSTRUCTED | §9.4 the axletrees are square timbers a little stouter than the cheeks |
| `gun_9pdr_truck_fore_diameter` | 0.381 | 1 ft 3 in | SECONDARY | §9.4 scaled from the measured 24-pdr fore truck of 18 in (Ships of Scale, truck carriages of 1777) |
| `gun_9pdr_truck_rear_diameter` | 0.3302 | 1 ft 1 in | SECONDARY | §9.4 the rear truck is smaller than the fore, which helps check the recoil against the deck camber |
| `gun_4pdr_truck_fore_diameter` | 0.3048 | 1 ft 0 in | RECONSTRUCTED | §9.4 the same proportion on the smaller carriage |
| `gun_4pdr_truck_rear_diameter` | 0.2667 | 0 ft 10.5 in | RECONSTRUCTED | §9.4 as above |
| `gun_truck_thickness` | 0.1016 | 0 ft 4 in | SECONDARY | §9.4 Falconer: the breadth of the wheels equals that of the cheeks |
| `gun_stool_bed_length` | 0.4064 | 1 ft 4 in | SECONDARY | §9.4 Falconer names the bed, which carries the quoin under the breech |
| `gun_stool_bed_depth` | 0.127 | 0 ft 5 in | RECONSTRUCTED | §9.4 thickness of the bed between the cheeks |
| `gun_quoin_length` | 0.3556 | 1 ft 2 in | RECONSTRUCTED | §9.4 the wedge that lies on the bed and holds the breech up |
| `gun_cap_square_thickness` | 0.0254 | 0 ft 1 in | RECONSTRUCTED | §9.4 the iron clamp over each trunnion, which Falconer calls the cap-square |
| `gun_transom_siding` | 0.127 | 0 ft 5 in | RECONSTRUCTED | §9.4 the transom across the cheeks abaft the bed |
| `carronade_slide_length` | 1.2192 | 4 ft 0 in | RECONSTRUCTED | §9.5 5 ft 0 in on the 32-pdr Carron pattern, scaled to the 12-pdr piece |
| `carronade_slide_width` | 0.3556 | 1 ft 2 in | RECONSTRUCTED | §9.5 1 ft 4 in on the 32-pdr slide, scaled |
| `carronade_slide_depth` | 0.1524 | 0 ft 6 in | RECONSTRUCTED | §9.5 depth of the lower bed timber |
| `carronade_bed_length` | 0.6096 | 2 ft 0 in | RECONSTRUCTED | §9.5 the upper carriage, or slider, that the piece is bolted to: 2 ft 6 in on the 32-pdr |
| `carronade_bed_depth` | 0.127 | 0 ft 5 in | RECONSTRUCTED | §9.5 depth of the upper carriage |
| `carronade_axis_above_deck` | 0.6604 | 2 ft 2 in | RECONSTRUCTED | §9.5 2 ft 8 in on the 32-pdr slide, scaled to the 12-pdr; a carronade sits markedly lower than a long gun on its truck carriage |
| `carronade_muzzle_beyond_pivot` | 0.508 | — | RECONSTRUCTED | §9.5 how far the muzzle stands forward of the pivot bolt when the piece is run out on the slide |
| `carronade_pivot_bolt_diameter` | 0.0381 | 0 ft 1.5 in | SECONDARY | §9.5 pivot bolt at the fore end of the slide, 1.5 in |
| `carronade_rear_truck_diameter` | 0.1524 | 0 ft 6 in | SECONDARY | §9.5 two traverse trucks of 6 in under the after end of the slide |
| `carronade_elevating_screw_diameter` | 0.0381 | 0 ft 1.5 in | SECONDARY | §9.5 the elevating screw through the breech, 1.5 in; it replaces the quoin of a long gun |
| `gun_breeching_diameter` | 0.033 | 0 ft 1.3 in | SECONDARY | §9.6 breeching circumference is about 0.95 of the bore diameter, so 4 in of circumference on a 9-pdr, which is 1.3 in in the round |
| `gun_breeching_sag` | 0.09 | — | RECONSTRUCTED | §9.6 the bight of the breeching hangs slack between the cascabel and the ship's side when the gun is run out |
| `gun_breeching_bolt_from_port` | 0.6858 | — | SECONDARY | §9.6 the two ring bolts in the ship's side, one each side of the port; Steel's contract gives 1.25 in bolts with 3.5 in rings |
| `gun_breeching_bolt_above_sill` | 0.1016 | 0 ft 4 in | RECONSTRUCTED | §9.6 the ring bolts stand a little above the level of the port sill |
| `gun_tackle_diameter` | 0.0229 | 0 ft 0.9 in | RECONSTRUCTED | §9.6 the gun and train tackle falls are lighter than the breeching |
| `gun_tackle_sag` | 0.05 | — | RECONSTRUCTED | §9.6 the falls are bowsed taut when the gun is run out, so there is very little bight in them |
| `gun_train_tackle_length` | 1.2192 | 4 ft 0 in | SECONDARY | §9.6 the train tackle runs from the rear of the carriage to an eye bolt in the deck on the centreline side |
| `gun_run_out_side_clearance` | 0.0508 | — | RECONSTRUCTED | §9.4 a gun run out has its fore trucks all but against the ship's side; this is what is left between the fore end of the cheeks and the inboard face of the side |
| `gun_quarterdeck_first_from_stem` | 24.0792 | 79 ft 0 in | RECONSTRUCTED | §9.2 the foremost quarterdeck piece stands just abaft the break, which is 78 ft abaft the stem |
| `gun_quarterdeck_spacing` | 1.9304 | 6 ft 4 in | RECONSTRUCTED | §9.2 six pieces a side on Steel's equal-spacing rule, closed up so that the aftermost stands forward of the quarter badge |
| `gun_quarterdeck_carronades_forward` | 2 | — | RECONSTRUCTED | §9.1 the two carronades a side take the foremost quarterdeck stations, where the piece can be trained widest across the waist; the four long 4-pdrs stand abaft them |
| `gun_forecastle_carronade_from_stem` | 7.62 | 25 ft 0 in | RECONSTRUCTED | §9.2 forecastle carronade station, one a side |
| `gun_forecastle_gun_from_stem` | 5.4864 | 18 ft 0 in | RECONSTRUCTED | §9.2 the two long 4-pdr chase guns, one a side, mounted abreast on the forecastle; in action they were shifted to the bow ports in the beakhead bulkhead |
| `gun_deck_inset` | 0.1524 | — | RECONSTRUCTED | §9.2 how far inboard of the deck edge a quarterdeck or forecastle piece stands, there being no bulwark carried up round those decks in the hull as traced |

### Boats

| key | metric | period figure | grade | source |
|---|---|---|---|---|
| `boat_count` | 4 | — | RECONSTRUCTED | §8.3 launch, pinnace, cutter and jolly boat — the outfit of a sixth rate of 578 tons; no boat list for Surprise was found |
| `launch_length` | 7.3152 | 24 ft 0 in | RECONSTRUCTED | §8.3 24 ft launch for a ship of this rate |
| `launch_beam` | 2.1336 | 6 ft 12 in | RECONSTRUCTED | §8.3 launch beam 7 ft 0 in |
| `launch_depth` | 0.8636 | 2 ft 10 in | RECONSTRUCTED | §8.5 depth amidships at length/8.5, Steel's boat proportion; the scantling folio is illegible |
| `pinnace_length` | 7.3152 | 24 ft 0 in | RECONSTRUCTED | §8.3 pinnace 24-26 ft; the shorter figure taken so that she stows on the same skid beams as the launch |
| `pinnace_beam` | 1.7526 | 5 ft 9 in | RECONSTRUCTED | §8.3 pinnace beam 5 ft 9 in |
| `pinnace_depth` | 0.6858 | 2 ft 3 in | RECONSTRUCTED | §8.5 length/10.7; a pinnace is shallower and finer than a launch |
| `cutter_length` | 5.4864 | 18 ft 0 in | RECONSTRUCTED | §8.3 cutter 18-22 ft; the shortest taken so that she nests inside the 24 ft launch |
| `cutter_beam` | 1.8288 | 6 ft 0 in | RECONSTRUCTED | §8.3 cutter beam 6 ft 0 in — "shorter, broader and deeper in proportion", Steel |
| `cutter_depth` | 0.7112 | 2 ft 4 in | RECONSTRUCTED | §8.5 length/7.7; a cutter is deep for her length |
| `jolly_length` | 4.8768 | 16 ft 0 in | RECONSTRUCTED | §8.3 jolly boat 16-18 ft, the smaller taken |
| `jolly_beam` | 1.6764 | 5 ft 6 in | RECONSTRUCTED | §8.3 jolly boat beam 5 ft 6 in |
| `jolly_depth` | 0.6096 | 2 ft 0 in | RECONSTRUCTED | §8.5 length/8 |
| `boat_max_beam_station` | 0.55 | — | RECONSTRUCTED | §8.5 maximum breadth a little abaft midships, the usual place in a ship's boat |
| `boat_entry_power` | 0.55 | — | RECONSTRUCTED | §8.5 fineness of the entry, as an exponent on the forward waterline |
| `boat_run_power` | 1.6 | — | RECONSTRUCTED | §8.5 fineness of the run aft to the transom |
| `boat_transom_width_frac` | 0.62 | — | RECONSTRUCTED | §8.5 transom breadth as a fraction of the extreme breadth |
| `boat_sheer_rise_fwd` | 0.28 | — | RECONSTRUCTED | §8.5 rise of the gunwale at the stem, as a fraction of the depth amidships |
| `boat_sheer_rise_aft` | 0.14 | — | RECONSTRUCTED | §8.5 rise of the gunwale at the transom |
| `boat_rocker_fwd` | 0.62 | — | RECONSTRUCTED | §8.5 rise of the keel into the forefoot, as a fraction of the depth |
| `boat_sheer_power` | 1.8 | — | RECONSTRUCTED | §8.5 the sheer of a boat runs flat amidships and lifts quickly at the ends; exponent on the rise |
| `boat_rocker_power` | 1.8 | — | RECONSTRUCTED | §8.5 the same rule applied to the rocker of the keel |
| `boat_rocker_aft` | 0.3 | — | RECONSTRUCTED | §8.5 rise of the keel into the tuck |
| `boat_section_fullness_launch` | 3.2 | — | RECONSTRUCTED | §8.3 Steel: the launch is "more flat in its bottom"; superellipse exponent giving a flat floor and a hard bilge |
| `boat_section_fullness_pulling` | 2.4 | — | RECONSTRUCTED | §8.5 rounder section of a pinnace, cutter or jolly boat |
| `boat_plank_thickness` | 0.0318 | 0 ft 1.3 in | RECONSTRUCTED | §8.5 boat planking about 1¼ in; Steel's boat scantling folio is illegible in the scan |
| `boat_keel_siding` | 0.0762 | 0 ft 3 in | RECONSTRUCTED | §8.5 boat keel sided 3 in |
| `boat_keel_moulding` | 0.1016 | 0 ft 4 in | RECONSTRUCTED | §8.5 boat keel moulded 4 in below the rabbet |
| `boat_stem_siding` | 0.1016 | 0 ft 4 in | RECONSTRUCTED | §8.5 stem and sternpost sided a little more than the keel |
| `boat_gunwale_width` | 0.0762 | 0 ft 3 in | RECONSTRUCTED | §8.5 gunwale capping over the heads of the timbers |
| `boat_gunwale_thickness` | 0.0381 | 0 ft 1.5 in | RECONSTRUCTED | §8.5 thickness of the capping |
| `boat_washstrake_height` | 0.127 | 0 ft 5 in | RECONSTRUCTED | §8.5 washstrake above the sheer strake, white outside as the photograph shows |
| `boat_thwart_spacing` | 0.8382 | 2 ft 9 in | RECONSTRUCTED | §8.3 thwarts spaced for a rower's stroke; Steel gives a pinnace eight oars in 24 ft |
| `boat_thwart_width` | 0.254 | 0 ft 10 in | RECONSTRUCTED | §8.5 thwart 10 in fore and aft |
| `boat_thwart_thickness` | 0.0381 | 0 ft 1.5 in | RECONSTRUCTED | §8.5 thwart 1½ in thick |
| `boat_thwart_below_gunwale` | 0.2286 | — | RECONSTRUCTED | §8.5 thwarts set 9 in below the gunwale |
| `boat_rudder_depth` | 0.762 | 2 ft 6 in | RECONSTRUCTED | §8.5 rudder hanging a little deeper than the boat |
| `boat_rudder_width` | 0.2794 | 0 ft 11 in | RECONSTRUCTED | §8.5 rudder blade width |
| `boat_rudder_thickness` | 0.0508 | 0 ft 2 in | RECONSTRUCTED | §8.5 rudder thickness |
| `boat_tiller_length` | 0.9144 | 3 ft 0 in | RECONSTRUCTED | §8.5 tiller reaching the after thwart |
| `boat_stow_height` | 1.524 | 5 ft 0 in | RECONSTRUCTED | §8.2 top of the skid beams 5 ft 0 in above the upper deck; used only where the furniture module has not defined skid_beam_top_above_deck |
| `boat_chock_height` | 0.2032 | 0 ft 8 in | RECONSTRUCTED | §8.2 "boat chocks, two per boat, shaped to the boat's bilges" |
| `boat_chock_width` | 0.1524 | 0 ft 6 in | RECONSTRUCTED | §8.2 chock sided 6 in |
| `boat_chock_spread` | 0.62 | — | RECONSTRUCTED | §8.2 the chocks take the boat under her bilges, at 0.62 of the half breadth |
| `boat_chock_station` | 0.28 | — | RECONSTRUCTED | §8.2 the two chocks stand this fraction of the length either side of the boat's midlength |
| `boat_stow_station` | 17.0688 | — | RECONSTRUCTED | §8.2 midway along the four skid beams; the furniture module lays them from X = 44 ft at 8 ft centres, so their middle is X = 56 ft |
| `launch_stow_offset` | 1.0668 | — | RECONSTRUCTED | §8.2 launch stowed to starboard of the centreline so that the pinnace stows beside her inside the 24 ft clear of the waist |
| `pinnace_stow_offset` | 1.0668 | — | RECONSTRUCTED | §8.2 pinnace to port, the mirror of the launch |
| `cutter_nest_rise` | 0.762 | — | RECONSTRUCTED | §8.2 "nested one atop the other"; the rise that lands the cutter's keel on top of the launch's thwarts rather than through them |
| `cutter_nest_shift` | 0.3048 | — | RECONSTRUCTED | §8.2 the nested cutter set a foot aft in the launch to clear her stem |
| `davit_station` | 35.3568 | — | RECONSTRUCTED | §8.4 quarter davits stepped on the starboard quarterdeck rail 10 ft forward of the sternpost, where the photograph carries a boat aft |
| `davit_spacing` | 2.7432 | 9 ft 0 in | RECONSTRUCTED | §8.4 the two davits set to take the jolly boat a little inside her stem and stern |
| `davit_height_above_rail` | 1.3716 | — | RECONSTRUCTED | §8.4 davit head high enough to swing the boat clear of the rail |
| `davit_outreach` | 1.524 | — | RECONSTRUCTED | §8.4 the davits reach far enough outboard to swing the boat clear of the quarterdeck rail; §8.4 gives 6 ft of projection for the longer transom davit |
| `davit_diameter` | 0.127 | 0 ft 5 in | RECONSTRUCTED | §8.4 davit 5 in in diameter at the step |
| `davit_fall_diameter` | 0.0381 | 0 ft 1.5 in | RECONSTRUCTED | §8.4 boat fall of 1½ in rope |
| `jolly_hang_below_davit` | 0.8382 | — | RECONSTRUCTED | §8.4 boat griped up close under the davit heads for sea |
| `boat_oar_count` | 10 | — | RECONSTRUCTED | §8.3 Steel: "Pinnaces never row more than eight oars, whereas Barges are constructed to row with ten" |
| `boat_oar_length` | 4.572 | 15 ft 0 in | RECONSTRUCTED | §8.3 oar length by Steel's rule for a boat of this beam, stowed fore and aft |
| `boat_oar_diameter` | 0.0762 | 0 ft 3 in | RECONSTRUCTED | §8.5 loom of the oar 3 in |
| `boat_oar_blade_width` | 0.1397 | 0 ft 5.5 in | RECONSTRUCTED | §8.5 blade of the oar |
| `boat_hook_count` | 2 | — | RECONSTRUCTED | §8.3 a pair of boat hooks stowed along the thwarts |
| `boat_hook_length` | 3.048 | 10 ft 0 in | RECONSTRUCTED | §8.3 boat hook stowed along the thwarts |
| `boat_mast_length` | 4.572 | 15 ft 0 in | RECONSTRUCTED | §8.3 the boat's own mast, unstepped and stowed in her with the sail furled to it |
| `boat_furled_sail_diameter` | 0.254 | 0 ft 10 in | RECONSTRUCTED | §8.3 the boat's lug sail furled round its own yard |
| `boat_furled_sail_length` | 2.7432 | 9 ft 0 in | RECONSTRUCTED | §8.3 the furl runs over the middle of the mast |

### Ground tackle

| key | metric | period figure | grade | source |
|---|---|---|---|---|
| `anchor_count_total` | 4 | — | SECONDARY | §13.1 Steel 1805 :43220 — four large stocks and two small to every class; the two bowers, the sheet and the kedge are the four modelled |
| `anchor_count_bower` | 2 | — | PRIMARY | §13.1 best bower and small bower, one to each cathead |
| `anchor_bower_weight_cwt` | 34 | — | SECONDARY | §13.1 Steel 1805 Folio LVI, 32-gun column — 34 cwt, 1727 kg |
| `anchor_shank_length` | 5.0292 | 16 ft 6 in | RECONSTRUCTED | §13.2 the period rule that the shank equals the stock; stock from Steel's series scaled by the cube root of the weight |
| `anchor_shank_square_trend` | 0.2286 | — | RECONSTRUCTED | §13.2 shank square at the trend, about 1/22 of the shank — the smith's proportion |
| `anchor_shank_square_head` | 0.1524 | — | RECONSTRUCTED | §13.2 shank square at the head, two thirds of the square at the trend |
| `anchor_arm_span` | 2.7432 | — | RECONSTRUCTED | §13.2 fluke tip to fluke tip at 0.55 of the shank, the standard long-shank proportion |
| `anchor_arm_angle_deg` | 60 | — | RECONSTRUCTED | §13.2 the arm stands 60 degrees off the shank on the Admiralty long-shank pattern |
| `anchor_arm_square_crown` | 0.2032 | — | RECONSTRUCTED | §13.2 the arm at the crown, a little under the shank at the trend |
| `anchor_arm_square_tip` | 0.0762 | — | RECONSTRUCTED | §13.2 the arm tapering to the bill |
| `anchor_palm_length` | 1.016 | 3 ft 4 in | RECONSTRUCTED | §13.2 palm at 0.20 of the shank |
| `anchor_palm_width` | 0.6096 | 2 ft 0 in | RECONSTRUCTED | §13.2 palm breadth at 0.6 of its length, the usual proportion |
| `anchor_palm_thickness` | 0.0762 | 0 ft 3 in | RECONSTRUCTED | §13.2 palm thickness, forged out of the arm |
| `anchor_palm_along_arm` | 0.6 | — | RECONSTRUCTED | §13.2 the palm centred at 0.60 of the arm out from the crown |
| `anchor_ring_diameter` | 0.6604 | 2 ft 2 in | RECONSTRUCTED | §13.2 ring diameter for a 34 cwt anchor |
| `anchor_ring_bar_diameter` | 0.0762 | 0 ft 3 in | RECONSTRUCTED | §13.2 the ring bar at about one eighth of the ring |
| `anchor_nut_length` | 0.2032 | 0 ft 8 in | RECONSTRUCTED | §13.2 the nuts under the stock that stop it turning on the shank |
| `anchor_stock_length` | 5.0292 | 16 ft 6 in | RECONSTRUCTED | §13.2 Steel 1805 :43221 series (22-0 / 21-9 / 20-6 / …) carried to the 32-gun column by cube-root-of-weight scaling |
| `anchor_stock_square_middle` | 0.381 | — | RECONSTRUCTED | §13.2 scaled from Steel :43222 (1-10 / 1-9¼ / 1-8¼ / 1-8 / 1-7¾) |
| `anchor_stock_square_ends` | 0.2032 | — | RECONSTRUCTED | §13.2 scaled from Steel :43223 |
| `anchor_stock_gap_middle` | 0.1778 | — | SECONDARY | §13.2 Steel :43224, the opening left between the two pieces at the middle for the shank |
| `anchor_stock_below_head` | 0.254 | — | RECONSTRUCTED | §13.2 the stock seated one shank-square below the head, under the nuts |
| `anchor_stock_hoop_count` | 4 | — | SECONDARY | §13.2 Steel :43226 — four iron hoops to each stock |
| `anchor_stock_hoop_breadth` | 0.076 | 0 ft 3 in | SECONDARY | §13.2 Steel :43227, hoops 3 in broad |
| `anchor_stock_hoop_thickness` | 0.016 | 0 ft 0.6 in | SECONDARY | §13.2 Steel :43228, hoops 5/8 in thick |
| `anchor_ring_below_cathead` | 0.762 | — | RECONSTRUCTED | §13.3 a three-sheave cat block, its strop and the hook into the ring, hanging from the sheaves in the cathead |
| `anchor_crown_from_stem` | 7.3152 | 24 ft 0 in | RECONSTRUCTED | §13.3 research 06, crown and flukes bedded on the fore channel 24 ft abaft the stem |
| `anchor_crown_above_channel` | 0.1016 | — | RECONSTRUCTED | §13.3 the arm bearing on the channel, not sunk into it |
| `anchor_crown_outboard_of_side` | 0.4572 | — | RECONSTRUCTED | §13.3 the crown bedded a foot and a half outboard of the ship's side, inside the channel's outer edge |
| `anchor_stock_cant_deg` | 84 | — | RECONSTRUCTED | §PHOTO the stock standing up beside the cathead and canted out over the forecastle rail, read off the reference photograph and set so that the whole stock clears the head rails |
| `sheet_anchor_scale` | 1 | — | SECONDARY | §13.1 Steel :43220 — the sheet is one of the four large anchors, so it is a bower's size |
| `kedge_anchor_scale` | 0.585 | — | RECONSTRUCTED | §13.1 the kedge at one fifth of a bower's weight, scaled by the cube root |
| `stowed_anchor_ring_from_stem` | 4.1148 | 13 ft 6 in | RECONSTRUCTED | §13.1 stowed on the forecastle, ring forward, set so that the crown of the larger spare lies clear forward of the forecastle break |
| `stowed_anchor_forward_of_break` | 0.4572 | — | RECONSTRUCTED | §13.1 how far forward of the break of the forecastle the crown of a stowed anchor is chocked, so that the palms bear on the deck and not on the coaming |
| `stowed_anchor_inboard_of_side` | 1.2192 | — | RECONSTRUCTED | §13.1 the shank laid four feet in from the ship's side, leaving the gangway clear |
| `stowed_anchor_above_deck` | 0.127 | 0 ft 5 in | RECONSTRUCTED | §13.1 the shank bearing on the palms and on its chocks |
| `stowed_stock_beside_shank` | 0.5334 | — | RECONSTRUCTED | §13.1 the unshipped stock lashed on deck alongside its own anchor |
| `hawse_hole_count_per_side` | 2 | — | RECONSTRUCTED | §12 two hawse holes a side, the working hawse and the spare, as on every frigate of the rate |
| `hawse_hole_first_from_stem` | 1.2192 | 4 ft 0 in | RECONSTRUCTED | §12 as far forward as the hawse pieces allow |
| `hawse_hole_spacing` | 0.5334 | 1 ft 9 in | RECONSTRUCTED | §12 the two holes of a side set a bore and a half apart |
| `hawse_hole_diameter` | 0.2032 | 0 ft 8 in | RECONSTRUCTED | §12 bored at about 1.6 times the cable, so that the cable renders freely |
| `hawse_hole_above_deck` | 0.1016 | 0 ft 4 in | RECONSTRUCTED | §12 bored with the lower edge on the gundeck at side, which puts the centre half a bore above it |
| `hawse_bolster_projection` | 0.038 | — | SECONDARY | §12 Steel :41221, the bolsters (naval hoods) project 1½ in from the cheeks |
| `anchor_cable_diameter` | 0.128 | 0 ft 5 in | RECONSTRUCTED | §13 the standing rule that the bower cable's circumference in inches is half the extreme breadth in feet: 31 ft 8 in gives 15.8 in round, 5.03 in through |
| `anchor_cable_sag` | 0.11 | — | RECONSTRUCTED | §13 the slack in a heavy cable bent to a catted anchor |
| `cat_block_length` | 0.6096 | 2 ft 0 in | RECONSTRUCTED | §13.3 a three-sheave cat block to match the three sheaves in the cathead (Steel :40068) |
| `cat_block_width` | 0.3556 | 1 ft 2 in | RECONSTRUCTED | §13.3 three sheaves of 10 in and their partitions |
| `cat_block_thickness` | 0.254 | 0 ft 10 in | RECONSTRUCTED | §13.3 sheaves 2 in thick in a three-sheave shell (Steel :40070) |
| `shank_painter_diameter` | 0.032 | 0 ft 1.3 in | SECONDARY | §13.3 Steel :40292 and :44589, stopper bolts 1¼ in — the shank painter chain is of that bar |
| `shank_painter_bolt_from_stem` | 6.096 | 20 ft 0 in | RECONSTRUCTED | §13.3 "a chain bolted through the topside, abaft the cathead" (Steel :4552) |
| `shank_painter_on_shank` | 0.78 | — | RECONSTRUCTED | §13.3 the painter takes the shank near the crown |
| `anchor_lining_from_stem` | 6.096 | 20 ft 0 in | RECONSTRUCTED | §13.3 the lining laid where the fluke bears, forward of the crown |
| `anchor_lining_length` | 2.1336 | 6 ft 12 in | RECONSTRUCTED | §13.3 Steel :42535 gives 10 ft 6 in for a 110-gun ship, scaled to the rate |
| `anchor_lining_height` | 0.4572 | 1 ft 6 in | RECONSTRUCTED | §13.3 a sacrificial plank deep enough to take the fluke |
| `anchor_lining_thickness` | 0.0762 | 0 ft 3 in | RECONSTRUCTED | §13.3 a thick strake laid on the topside |

### Colours

| key | metric | period figure | grade | source |
|---|---|---|---|---|
| `ensign_staff_length` | 4.8768 | 16 ft 0 in | RECONSTRUCTED | §12.4 staff long enough to fly an 8-breadth ensign clear of the taffrail |
| `canton_post_1801` | 0 | — | PRIMARY | §6.1 the Union of 1707 stood until 31 Dec 1800; SURPRISE is modelled 1798, so no St Patrick |
| `ensign_at_staff` | 0 | — | SECONDARY | §6.4 ensign at the gaff peak under sail; confirmed by the reference photograph |
| `jack_worn_under_way` | 0 | — | SECONDARY | §6.4 "a ship under full sail does NOT wear a jack" — anchors catted means under way |
| `ensign_hoist` | 1.8288 | — | RECONSTRUCTED | §6.3 8 breadths x 9 in bunting (crwflags ensign establishment) |
| `ensign_fly` | 3.2918 | — | SECONDARY | §6.3 mid-18th-c ensign proportion 5:9, correct for 1798 (1:2 only from 1799) |
| `ensign_canton_hoist_frac` | 0.5 | — | RECONSTRUCTED | §6.3 standard British ensign construction, canton = 1/2 hoist |
| `ensign_canton_fly_frac` | 0.4444 | — | RECONSTRUCTED | §6.3 standard British ensign construction, canton = 4/9 fly on a 5:9 ensign |
| `ensign_peak_from_stem` | 41.13 | 134 ft 11.3 in | RECONSTRUCTED | §04-8/§04-3.2 mizen centre 32.903 + rake 0.43 + gaff 9.906 x cos 38 deg; agrees with the spanker gaff the rig now builds — RECONCILE WITH RIG |
| `ensign_peak_height` | 15.2 | 49 ft 10.4 in | SECONDARY | §04-3.2 the peak of the mizzen gaff: throat at 8.93 m, where 0.52 of the run from the mizzen deck to its hounds falls, plus a 32 ft 6 in gaff peaked at 38 degrees, plus the flag head a hand above the peak |
| `ensign_staff_from_stem` | 38.3 | 125 ft 7.9 in | RECONSTRUCTED | §04-10 taffrail station, just forward of the sternpost — RECONCILE WITH STERN |
| `flag_ensign_staff_height` | 9.144 | 30 ft 0 in | SECONDARY | §04-10 Steel, ensign staff 30 ft above the taffrail for a 28-gun ship |
| `ensign_halliard_belay_from_stem` | 34.6 | 113 ft 6.2 in | RECONSTRUCTED | §6.4 peak halliard belayed at the mizen fife rail, a fathom abaft the mast |
| `pennant_hoist` | 0.6604 | — | SECONDARY | §6.3 frigate masthead pendant 2 ft 2 in x 46 ft 9 in (gwpda naval establishment) |
| `pennant_length` | 14.2494 | 46 ft 9 in | SECONDARY | §6.3 frigate masthead pendant 2 ft 2 in x 46 ft 9 in (gwpda naval establishment) |
| `pennant_fly_width` | 0.1016 | 0 ft 4 in | RECONSTRUCTED | §6.3 4 in given for pendants over 6 yd; read here as the width of the tapered fly |
| `pennant_george_frac` | 2 | — | RECONSTRUCTED | §6.4 pre-1801 pendant: St George at the hoist, squadron colour in the fly; hoist portion drawn twice the hoist depth |
| `pennant_from_stem` | 22.62 | 74 ft 2.6 in | RECONSTRUCTED | §04-8 main centre 21.752 abaft the fore perpendicular + 0.99 deg of rake; matched to the main royal pole the rig builds — RECONCILE WITH RIG |
| `pennant_height` | 38.62 | 126 ft 8.5 in | SECONDARY | §04-9 main truck by Steel 1794 masting: keelson step, 81 ft 4 in lower mast, 48 ft 9 in topmast and 24 ft 4 in topgallant with their doublings |
| `pennant_halliard_drop` | 2.4384 | — | RECONSTRUCTED | §6.4 pendant halliard from the truck down to the topgallant crosstrees — RECONCILE WITH RIG |
| `pennant_segment_multiple` | 2 | — | RECONSTRUCTED | §6.4 mesh resolution only, not a dimension of the ship |
| `jack_hoist` | 0.9144 | — | RECONSTRUCTED | §6.3 4 breadths x 9 in, half the ensign, on the standard 1:2 Union proportion |
| `jack_fly` | 1.8288 | — | RECONSTRUCTED | §6.3 Union flag proportion 1:2 |
| `jack_from_stem` | 0.3 | 0 ft 11.8 in | RECONSTRUCTED | §6.4 jackstaff on the stemhead at the heel of the bowsprit — RECONCILE WITH HEAD/RIG |
| `flag_jack_staff_height` | 4.2672 | 13 ft 12 in | SECONDARY | §04-10 Steel, jack staff 14 ft, i.e. 14/30 of the ensign staff |
| `union_cross_width_frac` | 0.2 | — | RECONSTRUCTED | §6.1 standard Union construction, St George cross 1/5 of the hoist |
| `union_fimbriation_frac` | 0.0667 | — | RECONSTRUCTED | §6.1 standard Union construction, white fimbriation 1/15 of the hoist each side |
| `union_saltire_width_frac` | 0.2 | — | RECONSTRUCTED | §6.1 standard Union construction, the diagonal band 1/5 of the hoist |
| `union_patrick_frac` | 0.0667 | — | RECONSTRUCTED | §6.1 post-1801 only, St Patrick red 2/30 of the hoist |
| `union_patrick_offset_frac` | 0.0333 | — | RECONSTRUCTED | §6.1 post-1801 counterchange, red offset 1/30 from the band centre so the broad white is uppermost at the top hoist |
| `flag_wind_bearing_deg` | 60 | — | RECONSTRUCTED | §6.4 wind from the starboard bow; the flags stream aft and to port, agreeing with the sails full on the starboard tack |
| `flag_droop_frac` | 0.17 | — | RECONSTRUCTED | §6.4 "pronounced sag at the fly" — wool bunting, sag as a fraction of the fly |
| `flag_wave_amplitude_frac` | 0.24 | — | RECONSTRUCTED | §6.4 "long, slow wave" — amplitude as a fraction of the hoist |
| `flag_wave_length_frac` | 0.45 | — | RECONSTRUCTED | §6.4 "long, slow wave" — wavelength as a fraction of the fly |
| `flag_wave_skew` | 0.3 | — | RECONSTRUCTED | §6.4 the wave runs diagonally across the cloth, not straight down the hoist |
| `flag_stream_slack` | 0.07 | — | RECONSTRUCTED | §6.4 cloth taken up by the wave, so the fly does not reach its full length downwind |
| `flag_wave_growth_exponent` | 1.3 | — | RECONSTRUCTED | §6.4 "higher damping and lower stiffness than a modern flag preset" |
| `flag_wave_harmonic` | 0.35 | — | RECONSTRUCTED | §6.4 a second harmonic at a third of the amplitude, so the wave is not a pure sine |
| `flag_wave_phase` | 0.35 | — | RECONSTRUCTED | §6.4 baked attitude of the ensign; a phase, not a dimension |
| `flag_wave_phase_pennant` | 2.1 | — | RECONSTRUCTED | §6.4 baked attitude of the pendant; a phase, not a dimension |
| `flag_wave_phase_jack` | 4.05 | — | RECONSTRUCTED | §6.4 baked attitude of the jack; a phase, not a dimension |
| `flag_halliard_diameter` | 0.016 | 0 ft 0.6 in | RECONSTRUCTED | §6.4 signal halliard, small stuff rove through a block at the peak |
| `flag_halliard_sag` | 0.015 | — | RECONSTRUCTED | §6.4 a halliard swigged up taut carries very little sag |


---

## 4. Hull form

The offsets below were taken off source 1. **The midship section is measured**; the other
stations are that section scaled by a measured breadth line, lifted by a rising line of
floor and sharpened toward the ends, then tuned until the displacement came right. So
they are a reconstruction, but one anchored at both ends of the problem: a measured
midship shape and a measured displacement.

### It was verified, not just drawn

| Quantity | Model | Record | Verdict |
|---|---|---|---|
| Displacement | 656.1 tons | 657 tons | 0.1 per cent |
| Burthen, Builder's Old Measurement | 578.79 tons | 578 73/94 | exact |
| Midship coefficient Cm | 0.777 | frigates 0.75–0.78 | in band |
| Prismatic coefficient Cp | 0.614 | frigates 0.60–0.64 | in band |
| Block coefficient Cb | 0.477 | frigates 0.45–0.48 | in band |
| Longitudinal centre of buoyancy | 0.502 L | just abaft amidships | correct for a fine hull |
| Maximum beam | 0.51 of the LWL from forward | — | essentially amidships |

Tumblehome above the maximum breadth measures **15.6 degrees from the vertical**, which
is a lot — and contradicts the common claim that a French hull tumbles home less than a
British one. The measurement is what is built.

Half-breadths in metres, at 21 stations and 10 waterlines.
Station `z` is metres from the station of maximum breadth, negative forward. Waterline `y`
is metres above the design load waterline, so most are negative. `—` means the station does
not reach that waterline.

| station | z | rabbet y | y -3.61 | y -3.15 | y -2.69 | y -2.08 | y -1.32 | y -0.56 | y 0.00 | y 1.06 | y 1.88 | y 2.79 | deck y | deck half-b | top of side y | top of side half-b |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | -18.44 | -0.19 | — | — | — | — | — | — | 0.168 | 0.168 | 0.168 | 0.168 | 2.23 | 0.168 | 3.88 | 0.168 |
| 1 | -16.60 | -1.44 | — | — | — | — | 0.168 | 0.902 | 1.728 | 2.124 | 2.070 | 2.006 | 2.14 | 2.051 | 3.84 | 1.928 |
| 2 | -14.75 | -2.37 | — | — | — | 0.177 | 1.238 | 2.310 | 2.737 | 2.938 | 2.844 | 2.740 | 2.06 | 2.825 | 3.75 | 2.631 |
| 3 | -12.91 | -3.00 | — | — | 0.286 | 1.250 | 2.283 | 3.106 | 3.365 | 3.490 | 3.362 | 3.216 | 1.99 | 3.344 | 3.65 | 3.080 |
| 4 | -11.06 | -3.39 | — | 0.320 | 1.149 | 2.097 | 3.024 | 3.615 | 3.801 | 3.895 | 3.728 | 3.542 | 1.93 | 3.719 | 3.59 | 3.381 |
| 5 | -9.22 | -3.62 | 0.168 | 1.024 | 1.908 | 2.700 | 3.536 | 3.975 | 4.118 | 4.191 | 3.996 | 3.776 | 1.87 | 3.996 | 3.58 | 3.594 |
| 6 | -7.38 | -3.76 | 0.530 | 1.658 | 2.460 | 3.164 | 3.877 | 4.234 | 4.349 | 4.410 | 4.191 | 3.950 | 1.83 | 4.203 | 3.56 | 3.748 |
| 7 | -5.53 | -3.84 | 1.055 | 2.161 | 2.883 | 3.511 | 4.121 | 4.417 | 4.511 | 4.560 | 4.334 | 4.081 | 1.80 | 4.356 | 3.54 | 3.878 |
| 8 | -3.69 | -3.89 | 1.460 | 2.530 | 3.185 | 3.749 | 4.282 | 4.535 | 4.615 | 4.657 | 4.429 | 4.173 | 1.78 | 4.453 | 3.52 | 3.969 |
| 9 | -1.84 | -3.91 | 1.710 | 2.749 | 3.359 | 3.883 | 4.368 | 4.596 | 4.673 | 4.709 | 4.478 | 4.224 | 1.77 | 4.508 | 3.52 | 4.023 |
| 10 | 0.00 | -3.91 | 1.792 | 2.819 | 3.417 | 3.926 | 4.398 | 4.618 | 4.688 | 4.724 | 4.496 | 4.240 | 1.78 | 4.523 | 3.54 | 4.031 |
| 11 | 1.84 | -3.91 | 1.786 | 2.810 | 3.408 | 3.914 | 4.383 | 4.603 | 4.676 | 4.709 | 4.481 | 4.224 | 1.79 | 4.505 | 3.59 | 4.001 |
| 12 | 3.69 | -3.90 | 1.649 | 2.682 | 3.295 | 3.816 | 4.307 | 4.535 | 4.612 | 4.648 | 4.417 | 4.164 | 1.82 | 4.435 | 3.63 | 3.929 |
| 13 | 5.53 | -3.88 | 1.341 | 2.399 | 3.051 | 3.618 | 4.151 | 4.407 | 4.490 | 4.532 | 4.304 | 4.051 | 1.85 | 4.313 | 3.66 | 3.813 |
| 14 | 7.38 | -3.82 | 0.869 | 1.942 | 2.664 | 3.292 | 3.911 | 4.212 | 4.310 | 4.359 | 4.136 | 3.886 | 1.90 | 4.130 | 3.76 | 3.625 |
| 15 | 9.22 | -3.70 | 0.253 | 1.302 | 2.115 | 2.822 | 3.557 | 3.935 | 4.057 | 4.121 | 3.908 | 3.670 | 1.97 | 3.886 | 3.92 | 3.383 |
| 16 | 11.06 | -3.47 | — | 0.494 | 1.314 | 2.173 | 3.039 | 3.554 | 3.719 | 3.810 | 3.764 | 3.627 | 2.04 | 3.740 | 4.12 | 3.312 |
| 17 | 12.91 | -3.09 | — | — | 0.381 | 1.286 | 2.274 | 3.036 | 3.268 | 3.414 | 3.459 | 3.368 | 2.13 | 3.435 | 4.32 | 3.055 |
| 18 | 14.75 | -2.51 | — | — | — | 0.256 | 1.225 | 2.249 | 2.640 | 2.926 | 3.094 | 3.063 | 2.23 | 3.082 | 4.50 | 2.769 |
| 19 | 16.60 | -1.72 | — | — | — | — | 0.168 | 1.027 | 1.719 | 2.225 | 2.911 | 2.850 | 2.34 | 2.880 | 4.63 | 2.612 |
| 20 | 18.44 | -0.74 | — | — | — | — | — | 0.168 | 0.299 | 1.158 | 2.835 | 2.713 | 2.46 | 2.758 | 4.68 | 2.548 |


---

## 5. Materials and paint

Colours are sRGB hex as they should appear under neutral light. Roughness and metalness
are linear. The paint bands are applied in the hull's own surface coordinate, so each one
follows the line of the ship it belongs to — the copper follows the waterline, the wale
and the ochre strake follow the sheer.

| key | colour | roughness | metalness | source |
|---|---|---|---|---|
| `topside_black` | #1C1613 | 0.5 | 0 | SECONDARY §8 lamp black in tar; warm brown-black, not pure black |
| `wale` | #241A12 | 0.4 | 0 | SECONDARY §8 wales left bright in tar, glossier than the topside |
| `ochre_trim` | #CB9C55 | 0.55 | 0 | SECONDARY §8 yellow ochre in oil, the Victory ochre (NCS S 3020-Y40R), taken at pigment strength; renders inside the photograph's sampled #dba55d-#f8cf7d under both the sea and the studio rig |
| `inboard_red` | #913832 | 0.65 | 0 | SECONDARY §8 red ochre for inboard works and port linings, not Venetian red |
| `boot_top` | #2A2018 | 0.7 | 0 | SECONDARY §8 exposed plank above the sheathing, algae-stained |
| `copper` | #A2603A | 0.44 | 0 | RECONSTRUCTED §8 sheathing after some months in the water: brown, not the salmon of new copper and never the green of long immersion. The reference photograph reads warm brown here, and that is what is matched. Roughness is the polish of a sheet that has been in the water a few months, not of one that has been painted |
| `copper_bright` | #F7BC9E | 0.35 | 0 | SECONDARY §8 new copper, used for the nail heads |
| `copper_dark` | #3E2418 | 0.75 | 0 | SECONDARY §8 cupric oxide in the sheet laps |
| `copper_line_above_wl_v` | 0.12 | — | — | MEASURED §8 the main wale's lower edge is 15.2 ft above the moulded base line, 2.4 ft above the load waterline; the sheathing was carried to 2 ft 6 in - 3 ft, so the two coincide |
| `copper_sheets_along` | 22 | — | — | SECONDARY §8 sheets 4 ft on the long edge, laid fore and aft over 121 ft of waterline; counted across the hull base map |
| `copper_sheets_up` | 26 | — | — | SECONDARY §8 sheets 14 in on the short edge; the courses that fit between the keel and the sheathing line, counted over the whole V range of the base map |
| `copper_lap_relief` | 0.34 | — | — | RECONSTRUCTED §8 the doubling at a sheet lap is one thickness of sheet copper; tuned so the laps are legible at beam distance and do not read as corrugation |
| `copper_nail_relief` | 0.55 | — | — | RECONSTRUCTED §8 a raised nail head; tuned so the nails catch the sun at beam distance |
| `hull_normal_scale` | 1.15 | — | — | RECONSTRUCTED §8 the normal map is built from a height map whose relief is already scaled by the two rows above, so this stays near unity. At the old 0.4 the copper nails were invisible at every distance |
| `copper_pattern_depth` | 0.62 | — | — | RECONSTRUCTED §8 how strongly the sheathing pattern modulates the base colour. Copper carries its own colour through the metalness map rather than through the base map, so its pattern is allowed to bite far harder than paint on planking does; at the old 0.42 the sheets were invisible at beam distance |
| `copper_sheet_variation` | 0.16 | — | — | RECONSTRUCTED §8 no two sheets weather alike, and it is the spread between them that stops the bottom reading as one printed panel |
| `ochre_strake_below_sill_v` | 0.008 | — | — | MEASURED §8 the ochre strake carries the port band, sills at 20.4 ft and heads at 22.8 ft above base; black above the wale and again above the port heads |
| `ochre_strake_above_head_v` | 0.004 | — | — | MEASURED §8 the channel-wale band above the port heads is black, 22.9 to 24.1 ft above base. The strake is carried just clear of the port heads and no further: the band between the heads and the rail is narrow, and any more ochre than this closes it up and the ship stops reading as black |
| `ochre_moulding_v` | 0.006 | — | — | MEASURED §8 a moulding about 4 in deep on a topside whose V range spans some 22 ft; the reference photograph shows one such line on the sheer and none above the port heads |
| `deck` | #C9BCA4 | 0.72 | 0 | SECONDARY §8 holystoned deck planking |
| `deck_seam` | #3A332A | 0.8 | 0 | SECONDARY §8 pitched caulking |
| `timber` | #8A6A44 | 0.7 | 0 | SECONDARY §8 oak, bright |
| `mast_bright` | #9C7A4E | 0.38 | 0 | SECONDARY §8 lower masts varnished bright |
| `mast_black` | #1C1613 | 0.55 | 0 | SECONDARY §8 mastheads, caps, tops and yards blacked |
| `boat_white` | #E4E8DC | 0.55 | 0 | SECONDARY §8 white lead; the photo shows the boats white |
| `gilt` | #D4AF37 | 0.32 | 0 | SECONDARY §8 gilt on head, taffrail and quarter badges, matching the reference model |
| `iron` | #1A1A1A | 0.65 | 0.7 | SECONDARY §8 blacked wrought iron |
| `brass` | #F9E596 | 0.3 | 0 | SECONDARY §8 bell and sheaves |
| `glazing` | #DDE6E0 | 0.08 | 0 | SECONDARY §8 crown glass, faint green cast |
| `sail` | #D6CDB6 | 0.85 | 0 | SECONDARY §8 weathered flax; the photo samples #ddd6c4 lit and #a89880 shaded |
| `sail_seam` | #C6BDA7 | 0.88 | 0 | SECONDARY §8 seams between cloths |
| `sail_glow` | 0.055 | — | — | RECONSTRUCTED §8 flax canvas is translucent backlit; the emission that replaces it is tuned against the reference photograph, in which the sails glow faintly and are opaque |
| `sail_glow_tint` | #FFEFD2 | — | 0 | RECONSTRUCTED §8 light through flax picks up the warmth of the cloth, so the glow is warmer than the cloth itself |
| `rigging_tarred` | #2A211A | 0.85 | 0 | SECONDARY §8 standing rigging, tarred hemp |
| `rigging_hemp` | #A89574 | 0.9 | 0 | SECONDARY §8 running rigging, untarred hemp |
| `ensign_blue` | #22375E | 0.9 | 0 | SECONDARY §8 blue ensign bunting, desaturated from the Flag Institute blue |
| `ensign_red` | #A32D34 | 0.9 | 0 | SECONDARY §8 bunting red |
| `ensign_white` | #E8E2D4 | 0.9 | 0 | SECONDARY §8 bunting white |
| `sun_colour` | #FFF1DA | — | 0 | RECONSTRUCTED §8 direct sunlight a few hours off noon, about 5000 K |
| `sun_intensity` | 2.6 | — | — | RECONSTRUCTED §8 bright enough for a sunny day, not so bright that the deck, the boats and the canvas clip to white and lose their colour |
| `sun_distance` | 70 | — | — | RECONSTRUCTED §8 far enough outside a ship 59 m over all that the shadow camera can see all of her |
| `sea_sun_azimuth_deg` | 296 | — | — | RECONSTRUCTED §8 a little forward of the port beam, so that the side the verification views look at is the lit side and the rig throws its shadow away from the camera |
| `sea_sun_elevation_deg` | 34 | — | — | RECONSTRUCTED §8 low enough to light the topsides rather than only the deck, high enough that the sail plan does not shade the whole ship |
| `studio_sun_azimuth_deg` | 308 | — | — | RECONSTRUCTED §8 matched to the key light in the reference photograph, which comes over the photographer's left shoulder |
| `studio_sun_elevation_deg` | 44 | — | — | RECONSTRUCTED §8 matched to the reference photograph, where the shadows under the channels are short |
| `sea_sky_colour` | #E6DCC6 | — | 0 | RECONSTRUCTED §8 the warm haze low in a sunny sky, which is the part of it a ship's side actually sees; tuned so sunlit canvas lands on the photograph's #ddd6c4 |
| `sea_water_colour` | #4A5A56 | — | 0 | RECONSTRUCTED §8 bounce off the sea: dark, and green-grey rather than blue, so that it does not tint the black topsides |
| `sea_fill_intensity` | 0.62 | — | — | RECONSTRUCTED §8 enough that the black topsides are not a silhouette, little enough that the sun still decides the colour of everything it touches |
| `studio_sky_colour` | #F0DCB4 | — | 0 | RECONSTRUCTED §8 the warm backdrop of the reference photograph |
| `studio_floor_colour` | #8A7250 | — | 0 | RECONSTRUCTED §8 bounce off the photographer's warm sweep |
| `studio_fill_intensity` | 0.85 | — | — | RECONSTRUCTED §8 the reference photograph is lit softly; its shadows are open |
| `rim_colour` | #BFD2E2 | — | 0 | RECONSTRUCTED §8 open sky on the shaded side |
| `rim_intensity` | 0.22 | — | — | RECONSTRUCTED §8 an edge, not a second key; at 0.35 with a colder colour it was half of why the shaded canvas sampled #7e9bb0 |
| `rim_azimuth_deg` | 110 | — | — | RECONSTRUCTED §8 on the starboard quarter, opposite the sun |
| `rim_elevation_deg` | 32 | — | — | RECONSTRUCTED §8 a horizontal sea mirrors a light straight back at the camera when the light stands at the angle the camera looks down at the water. At 14 degrees that put a wall of glare across the quarter of every sea render, so the rim is carried above the band the water can return |
| `sea_env_colour` | #B9B4A2 | — | 0 | RECONSTRUCTED §8 the whole sky and sea averaged as seen from a hull: warm haze, not the blue of the zenith. It is what the copper reflects |
| `studio_env_colour` | #DCC199 | — | 0 | RECONSTRUCTED §8 the reference photograph's backdrop, averaged |
| `env_sun_colour` | #FFF6E4 | — | 0 | RECONSTRUCTED §8 the sun's own disc in the environment, which is what gives copper and gilt a highlight to catch |
| `env_sun_extent` | 34 | — | — | RECONSTRUCTED §8 the card is 34 m across at 55 m, about 35 degrees. Wider than the real sun by a long way, because a half-degree disc survives neither the PMREM blur nor a roughness of 0.44 — but small enough that the sea does not mirror it as a wall of white |
| `env_sun_elevation_deg` | 58 | — | — | RECONSTRUCTED §8 the card is carried well above the sun's own elevation on purpose. It is there to give the copper and the gilt a highlight, and at the sun's real height the sea mirrors it straight back into the camera as a glare path |
| `hull_env_intensity` | 1.8 | — | — | RECONSTRUCTED §8 the copper band is metal, so the environment is the only thing that lights it at all; tuned so the sheathing lands near the photograph's #982f0f-#93401e rather than a third of that |
| `sea_surface_colour` | #153549 | — | 0 | RECONSTRUCTED §8 deep water on a sunny day, dark enough that a black hull still reads against it |
| `sea_surface_roughness` | 0.4 | — | — | RECONSTRUCTED §8 a light chop rather than a mirror; at 0.16 the sun's path across the water came back as a hard white wall |
| `sea_surface_env_intensity` | 0.42 | — | — | RECONSTRUCTED §8 the water is held back from the environment so that warming the sky for the ship's sake does not bleach the sea |
| `shadow_taps` | 3 | — | — | RECONSTRUCTED §8 three is the fewest that reads as a penumbra rather than as a double image, and each one costs a full shadow pass |
| `shadow_spread_deg` | 2.6 | — | — | RECONSTRUCTED §8 five times the sun's true half-degree, which is what it takes for the penumbra to be visible at this scale; tuned on the ship's shadow on the sea in the beam view |
| `shadow_map_size` | 2048 | — | — | RECONSTRUCTED §8 over a shadow camera 96 m across this is 47 mm to the texel. Three of these are rendered every frame, one per tap, so the size is a third of what a single map could afford — and it can be, because the taps blend away the staircase a single map has to resolve out with resolution |
| `shadow_extent` | 48 | — | — | RECONSTRUCTED §8 half-width of the shadow camera: a ship 59 m over all and 45 m to the trucks, plus the reach of her shadow on the water |
| `shadow_bias` | -0.0004 | — | — | RECONSTRUCTED §8 with a normal bias as well, the depth bias only has to close the last of the acne, and a large one detaches a shadow from its caster |
| `shadow_normal_bias` | 0.035 | — | — | RECONSTRUCTED §8 rather more than a texel of the shadow camera, which is what stops the jagged self-shadowing along the sails and the topsides |


---

## 6. Levels of detail

| LOD | Triangles | Carries | Drops |
|---|---|---|---|
| `hero` | 200–500 k | Every ratline, gun, port lid, gallery light and deadeye. Ropes as tubes. | Nothing. |
| `game` | 30–60 k | Hull, decks, guns, boats, full spar plan, shrouds and stays as tubes. Hull about 38 m, sized to replace the host game's procedural ship. | Ratlines become lines, footropes and blocks go, deck furniture reduced to the principal items. |
| `distant` | under 5 k | Silhouette: hull, masts, yards, sails, lower shrouds and stays as lines. | Everything else. |

Sail states: `full` (courses, topsails, topgallants, staysails, three headsails and the
spanker, as in the reference photograph), `topsails`, `storm` (reefed foresail and
close-reefed main topsail) and `furled`.

---

## 7. What is honestly not known

* **Her lines below the midship section.** One draught survives, at 1:48, readable here
  only as a 1280-pixel scan. The midship section is measured off it; the rest is a fair
  reconstruction that reproduces her recorded displacement.
* **Her figurehead.** Not documented anywhere reachable. The "woman with sword and
  shield" belongs to the film ship, not to her. What is modelled is conjectural and is
  marked so.
* **The exact arrangement of her stern lights.** The body plan shows a single row of
  seven with a quarter gallery each side; the detail is reconstructed.
* **Her moulded breadth.** The row exists on the draught but is illegible at this
  resolution.
* **Which ensign she wore, and when.** That depended on her admiral's squadron. The
  pre-1801 Union canton is correct for 1798 and is what is built.
* **The height the copper was carried to.** Reconstructed at 2 ft 6 in to 3 ft above the
  load waterline.
* **The spanker.** Steel gives a 52 ft driver boom; the photograph shows a much shorter
  gaff spanker. The photograph decides character, so the spanker is what is built and
  the driver boom is recorded beside it.

Every one of these would be closed by two purchases: Karl Heinz Marquardt, *The Frigate
Surprise* (Anatomy of the Ship, 2003), and full-size prints of RMG J5947 and J5948.
