# 05 — HULL FORM: lines, coefficients and a station-offset table

Research for a 3D modeller. Every number has an inline source. 1 ft = 0.3048 m.
Companion file: `02-rmg-draughts.md` (draught provenance, scale derivation, dimensions).

---

## 0. HEADLINE — a real lines plan EXISTS, and it was measured for this report

**RMG ZAZ3067, "Lines & Profile", SURPRISE late L'UNITE, John Marshall, Plymouth Yard,
February 1798.** Sheet 470 x 1350 mm, drawn at 1:48.
Catalogue: https://www.rmg.co.uk/collections/objects/rmgc-object-82858
Museum scan (free, 1280 x 451 px): https://collections.rmg.co.uk/media/2/440/707/j5948.jpg
Print J5948: https://prints.rmg.co.uk/products/plan-of-hms-surprise-1796-lines-and-profile-j5948

The sheet carries **all three lofting views**: body plan (left), sheer/inboard profile (centre
and right), longitudinal half-breadth (below). So the hull form does **not** have to be invented
from French practice. It has to be *read off*.

**No digitised offsets table exists anywhere.** No published table of half-breadths was found for
this ship in any source. So this report does the next best thing: it **measures the museum's own
scan** and fits a fair parametric surface to the measurements.

Everything below is tagged:
- **MEASURED** — taken off j5948.jpg by pixel analysis, method and error in §1.
- **RECORDED** — a published dimension from the plan's title block or Winfield.
- **RECONSTRUCTED** — not readable/found; derived from a stated rule, marked as such.

**Accuracy ceiling.** The free scan is 6.0 px per foot of ship, i.e. **1 px = 2 inches**. Every
MEASURED value carries roughly **+/- 2 to 3 inches**, and about **+/- 2%** on the scale itself.
For production work, buy the 1350 mm print (GBP 45) or license the RMG Images master (asset
16480, https://images.rmg.co.uk/asset/16480/) and re-measure. The numbers here are good enough to
loft a convincing hull; they are not good enough to cut frames for a museum model.

---

## 1. HOW THE SCAN WAS MEASURED, AND WHY THE SCALE IS TRUSTED

Method: local-median background subtraction on the greyscale image, then peak-picking of dark
pencil lines by row (for horizontals) and by column (for verticals).

**Datum found on the sheet:**

| Item | Pixel | Meaning |
|---|---|---|
| Body-plan centreline | x = 161.75 | vertical, symmetry axis of the body plan |
| Ruled base line | y = 272 | horizontal, spans the whole sheet; **top of keel = moulded base line, Z = 0** |
| Underside of keel | y ~ 280 | keel + false keel hang 1.33 ft below the base line |
| Body-plan breadth box | x = 68.5 and x = 255 | the extreme/moulded breadth verticals |
| Scale bar | x = 306 to 1105, y = 282 to 297 | ticks every 30 px |
| Half-breadth centreline | y = 402 | curves bulge **upward** toward the breadth datum at y = 309 |
| Profile / half-breadth | stern at **left**, bow at **right** | |

**Scale = 6.00 px per foot.** Four independent checks agree:

1. Scale-bar ticks 30 px apart = 5 ft divisions.
2. Body-plan breadth box half-width 93.25 px -> 31.08 ft breadth. The title block records
   extreme breadth 31 ft 8 in; moulded breadth is the illegible row. 31 ft 1 in moulded + 2 x
   4.5 in of wale = 31 ft 8 in extreme. Consistent, and within 1 in of the 31 ft 2 in
   reconstructed independently in `02-rmg-draughts.md`.
3. Half-breadth plan hull extent x = 306 to 1108 = 802 px = **133.7 ft**. Length on the lower
   deck is 126 ft (recorded); the remaining 7.7 ft is the counter overhanging the sternpost.
   Correct for a frigate stern.
4. **The draught check, which is decisive.** Waterlines are ruled in the body plan and the
   profile at z = 2.33, 5.83, 9.33 and 12.83 ft above the base line (3 ft 6 in spacing).
   The top one, z = 12.83 ft, plus the 1.33 ft of keel below the base line, gives a draught of
   **14.16 ft** against the recorded **14 ft 0.5 in = 14.04 ft**. Agreement to 1.4 in.
   *That top ruled waterline is the load waterline.*

Rejected scales: 5.714 px/ft (breadth becomes 32.6 ft, draught 14.6 ft), 5.0 and 6.667 px/ft
(breadth 37.3 ft and 28.0 ft, both impossible against the recorded 31 ft 8 in).

---

## 2. PRINCIPAL GEOMETRY — the numbers that set up the loft

Z is measured **up from the moulded base line = the top of the keel amidships**.
X is measured **aft from FP**; FP = fore side of the stem rabbet where it cuts the LWL.

| Quantity | Imperial | Metric | Status / source |
|---|---|---|---|
| Length on the lower (gun) deck, rabbet to rabbet | 126 ft 0 in | 38.405 m | RECORDED — plan title block; [Wikipedia](https://en.wikipedia.org/wiki/HMS_Surprise_(1796)) citing Winfield; [threedecks 6983](https://threedecks.org/index.php?display_type=show_ship&id=6983) |
| Length of keel for tonnage | 108 ft 6 1/8 in | 33.074 m | RECORDED — same |
| **Length on the LWL, FP to AP** | **121 ft 0 in** | **36.881 m** | MEASURED/derived — 126 ft on deck less the stem rake above the LWL and less the small post rake; see §6 |
| Breadth, extreme (over wales) | 31 ft 8 in | 9.652 m | RECORDED |
| **Breadth, moulded** | **31 ft 1 in** (use 31 ft 0 in) | **9.449 m** | MEASURED (breadth box, 6.0 px/ft). The title-block row is illegible at 1280 px |
| **Half-breadth, moulded** | **15.50 ft** | 4.724 m | derived |
| Depth in hold | 10 ft 0 1/2 in | 3.061 m | RECORDED — [threedecks 6983](https://threedecks.org/index.php?display_type=show_ship&id=6983) |
| **Load draught, to underside of false keel** | **14 ft 0 1/2 in** | **4.280 m** | RECORDED, and CONFIRMED on the plan (§1 check 4) |
| **LWL height above the moulded base line** | **12.83 ft** | 3.911 m | MEASURED |
| Keel + false keel below the base line | 1.33 ft (16 in) | 0.406 m | MEASURED |
| **Height of maximum breadth above base line** | **16.30 ft** | 4.968 m | MEASURED |
| Maximum breadth above the LWL | 3.47 ft | 1.058 m | derived |
| Burthen | 578 73/94 tons bm | — | RECORDED |
| Displacement | 657 tons | 667 tonnes | [Wikipedia](https://en.wikipedia.org/wiki/HMS_Surprise_(1796)); the model in §9 reproduces 656 tons |
| Waterline spacing on the draught | 3 ft 6 in | 1.067 m | MEASURED |

**Note the geometric oddity, and do not try to fix it.** Depth in hold (10 ft 0.5 in) is smaller
than the load draught (14 ft 0.5 in). This is normal for period frigates and is *not* an error:
the tabulated depth in hold runs from the ceiling at the limber strake to the underside of the
lowest complete deck, not to the gun deck. The 1773 tonnage act took depths "from under side of
upper deck to the ceiling at the timber strake"
([USNI Proceedings, "Rules for the Calculation of Tonnage and Their History", 1920](https://www.usni.org/magazines/proceedings/1920/march/rules-calculation-tonnage-and-their-history)).
The same relation appears on HMS Trincomalee (depth in hold 12 ft 9 in, load draught far
greater; [Wikipedia](https://en.wikipedia.org/wiki/HMS_Trincomalee)) and HMS Victory. **Set the
vertical datum from the measured LWL, not from the depth in hold.**

---

## 3. THE MIDSHIP SECTION — MEASURED, and it is not what the brief assumed

Taken as the outer envelope of the body plan (fore and aft halves agreed to within 0.15 ft,
which validates the centreline). Half-breadths in feet, Z above the moulded base line.

| Z (ft) | half-b (ft) | Z (ft) | half-b (ft) | Z (ft) | half-b (ft) |
|---|---|---|---|---|---|
| 0.00 | 0.54 (keel half-siding) | 4.00 | 11.21 | 12.00 | 15.30 |
| 0.33 | 3.38 | 4.67 | 11.90 | 12.83 (LWL) | 15.38 |
| 0.67 | 4.88 | 5.33 | 12.38 | 14.00 | 15.46 |
| 1.00 | 5.88 | 6.00 | 12.88 | 15.00 | 15.49 |
| 1.33 | 6.88 | 6.67 | 13.35 | **16.30** | **15.50 (max)** |
| 2.00 | 8.38 | 7.33 | 13.80 | 17.00 | 15.31 |
| 2.67 | 9.54 | 8.00 | 14.21 | 18.00 | 15.03 |
| 3.33 | 10.54 | 9.33 | 14.75 | 19.00 | 14.75 |
| | | 11.00 | 15.15 | 20.33 | 14.38 |

### What this section actually is

- **It is close to a semicircle below the maximum breadth.** A circle fitted through the
  measured points (9.54, 2.67), (12.88, 6.00) and (14.75, 9.33) has its centre at
  (y = 0.35, z = 15.23) and a **radius of 15.6 ft**. That is 0.50 x the moulded breadth, and the
  centre sits on the centreline just below the maximum-breadth level.
  **For the modeller: bilge radius = half the moulded breadth = 15 ft 7 in (4.75 m).**
- **The floor is round and full, not a sharp V with a hard bilge.** The bottom is already
  5.9 ft half-breadth only 1 ft above the keel, and 10.0 ft half-breadth 3 ft above it. There is
  no straight floor timber worth modelling as a straight line.
- **Deadrise** (definition: "the rise of the bottom of a midship frame from the keel to the
  bilge, usually given in inches per foot",
  [Merriam-Webster](https://www.merriam-webster.com/dictionary/dead%20rise)):
  - tangent at the garboard: **about 1.5 in per foot (7 deg)** — MEASURED, but this is the value
    most sensitive to 1-pixel noise, treat as +/- 3 deg.
  - chord from the keel to the floor head at half-breadth 9.5 ft: **3.6 in per foot (16.5 deg)**.
  - Use the round-bilge circle above rather than a straight floor plus arc.
- **Midship section coefficient, MEASURED: Cm = 0.777** (area to the LWL divided by
  half-breadth x draught). Sits exactly inside the published band for frigates, Cm 0.75 to 0.78
  ([ShipCalculators, block coefficient](https://shipcalculators.com/wiki/block-coefficient)).

### Where this contradicts the brief

The brief predicted a Forfait hull with **strong deadrise amidships** and capacity pushed to the
ends. That is a real Forfait signature — the French Wikipedia-sourced English article on him
quotes his own innovation for the frigate *Seine* as *"L'acculement du maitre-couple, et le
transport vers les extremites des capacites perdues au milieu par cet acculement"* (the rising
of the midship frame, and the transfer toward the extremities of the capacity lost amidships by
that rising), citing Levot p.192
([Wikipedia, Pierre-Alexandre-Laurent Forfait](https://en.wikipedia.org/wiki/Pierre-Alexandre-Laurent_Forfait)).

**But the drawn hull of Unité does not show it.** The measured midship section is full and round,
not hollow-floored. Two readings are possible and both are recorded here:

1. The *Seine* innovation (1793, a 24-pounder frigate) was specific to that class and Forfait did
   not carry it into the small corvettes. His *Etna*-class corvettes of 1795 are described as
   having a **"flat hull"** ([Wikipedia, Etna-class corvette](https://en.wikipedia.org/wiki/Etna-class_corvette)),
   which is consistent with the round, full floor measured here.
2. The 1798 British draught is a *survey* of a ship already four years old and re-coppered; the
   surveyors' fairing may have smoothed a sharper original floor.

**Trust the measurement.** It comes from the only surviving drawing of this hull. Reading 1 is
also the better-supported one: same designer, same yards (Le Havre / Honfleur), 1793-95, and the
*Etna* class is dimensionally almost this ship — 35.95 m overall, 32.48 m keel, 9.74 m beam,
about 564 tons bm ([Wikipedia, Etna-class corvette](https://en.wikipedia.org/wiki/Etna-class_corvette))
against Unité's 38.41 m, 33.07 m and 9.65 m.

---

## 4. TUMBLEHOME — MEASURED, and it is a lot

From the body-plan envelope above the maximum-breadth level:

| Z above base (ft) | half-breadth (ft) |
|---|---|
| 16.30 (max breadth) | 15.50 |
| 17.00 | 15.31 |
| 18.00 | 15.03 |
| 19.00 | 14.75 |
| 20.33 | 14.38 |
| 21.00 (last clear reading) | 14.19 |

**Tumblehome = 0.279 ft of inset per foot of height = 3.35 inches per foot = 15.6 degrees from
the vertical**, over the roughly 5 ft immediately above the maximum breadth. MEASURED, +/- 1.5 deg.

The brief expected *less* tumblehome than a British ship. The measurement says otherwise for the
zone just above the main breadth. Note also that the widely-repeated Wikipedia claim that
"the French Navy in particular promoted the design" of tumblehome
([Wikipedia, Tumblehome](https://en.wikipedia.org/wiki/Tumblehome)) is about **steel warships of
the 1880s-90s**, not the age of sail. Do not cite it for this ship. The measurement above is the
only evidence used here.

RECONSTRUCTED continuation above z = 21 ft (the body plan lines stop and the stern elevation
overlaps): ease the angle off as the topside rises, because a constant 15.6 deg to the rail would
close the ship in absurdly. Use the taper in the offsets model, §9:

| Station | 0 | 2 | 4 | 6 | 8 | 10 | 12 | 14 | 16 | 18 | 20 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| tumblehome, deg from vertical | 2.0 | 6.5 | 11.5 | 14.8 | 15.6 | 15.6 | 15.6 | 15.2 | 13.4 | 9.8 | 5.0 |

Rule for the taper (RECONSTRUCTED): tumblehome is a property of the mid-body topside; it must go
to near zero at the stem, where the sections are nearly vertical, and fall away aft into the
counter. The values above are shaped to do that and are what generated the table in §9.

---

## 5. SHEER — MEASURED off the main wale

The **main wale** traces cleanly across the whole profile and is the most reliable sheer line on
the sheet. Values are the traced line, Z above the moulded base line.

| ft aft of FP | 0 | 13.3 | 26.7 | 40.0 | 56.7 | 66.7 | 80.0 | 96.7 | 113.3 | 123.3 |
|---|---|---|---|---|---|---|---|---|---|---|
| **wale Z (ft)** | 17.17 | 16.50 | 16.00 | 15.83 | **15.67** | 15.67 | 16.00 | 16.50 | 17.33 | 17.83 |
| wale, ft above LWL | 4.34 | 3.67 | 3.17 | 3.00 | **2.84** | 2.84 | 3.17 | 3.67 | 4.50 | 5.00 |

**Key sheer facts (MEASURED):**
- **The low point of the sheer sits at 47% of the LWL length from the FP**, i.e. slightly
  *forward* of amidships, and the curve is flat from 0.39 L to 0.55 L.
- Rise from the low point forward to the FP: **1 ft 6 in**.
- Rise from the low point aft to the AP: **2 ft 2 in** (extrapolated to x = 121 ft).
- Total sheer, stem to stern: about **3 ft 8 in**. This is a restrained, graceful sheer, not the
  extravagant sheer of a 17th-century ship. It matches the profile in the photograph.
- Caveat: the tracer may have swapped between the wale's upper and lower edges at one point.
  The wale is 1 ft 8 in wide, so treat the sheer amplitude as **+/- 0.8 ft**.

**Deck at side, RECONSTRUCTED** from the wale line. Rule: the gun deck at side sits a constant
distance above the wale, and the ports sit 1 ft 9 in above the deck. The measured band of gunport
sills/heads on the profile is z = 20.3 to 22.8 ft, so the deck at side amidships is
20.4 - 1.75 = **18.65 ft above base = 5.82 ft above the LWL**. The full deck line is in §9.

| Point | Z above base (ft) | Z above LWL (ft) | m above LWL | Status |
|---|---|---|---|---|
| Gun deck at side, at the FP | 20.15 | 7.32 | 2.231 | RECONSTRUCTED |
| Gun deck at side, low point (0.47 L) | 18.65 | 5.82 | 1.774 | RECONSTRUCTED |
| Gun deck at side, at the AP | 20.90 | 8.07 | 2.460 | RECONSTRUCTED |
| Top of the side, at the stem head | 26.9 | 14.1 | 4.297 | MEASURED |
| Top of the side, minimum (waist) | 25.7 | 12.9 | 3.932 | MEASURED |
| **Taffrail** | **29.5** | **16.7** | **5.090** | MEASURED |

The measured "top of the side" curve is a composite of the forecastle rail, the waist rail and
the quarterdeck bulwark, so its minimum sits further forward than a true sheer low point. Use it
for the silhouette, not as a fair curve.

---

## 6. STEM, KEEL, STERNPOST, COUNTER

### Keel (MEASURED unless noted)

| Item | Imperial | Metric | Status |
|---|---|---|---|
| Keel + false keel, depth below the moulded base line | 1 ft 4 in | 0.406 m | MEASURED (1.33 ft) |
| Keel, moulded depth | 1 ft 0 in | 0.305 m | RECONSTRUCTED — 16 in total less a 4 in false keel |
| False keel | 4 in | 0.102 m | RECONSTRUCTED — standard for this size |
| Keel, sided (half-siding 6.5 in) | 1 ft 1 in | 0.330 m | MEASURED from the body plan (0.54 ft half-width) |
| Keel, straight bearing length | about 104 ft | 31.7 m | RECONSTRUCTED — the recorded 108 ft 6 1/8 in is the *tonnage* keel, a formula figure, not the timber |
| Drag (keel deeper aft) | none drawn | — | MEASURED — the keel line is a constant Z the full length of the profile. Model the LWL **parallel to the keel** |

### Stem (MEASURED, outer edge of the cutwater / knee of the head)

Forward projection ahead of the FP, at 6.0 px/ft:

| Z above base (ft) | ft forward of FP | m forward of FP |
|---|---|---|
| 0 (forefoot) | -4.2 (i.e. 4.2 ft **abaft** FP) | -1.28 |
| 3.0 | -3.5 | -1.07 |
| 6.3 | -0.5 | -0.15 |
| 10.3 | +4.5 | +1.37 |
| 12.83 (LWL) | +6.8 | +2.07 |
| 15.0 | +10.0 | +3.05 |
| 18.3 | +13.5 | +4.11 |
| 21.0 | +16.7 | +5.09 |
| 25.0 | +17.7 | +5.39 |

- **Mean rake of the cutwater / head, base to head: about 41 degrees from the vertical.** MEASURED.
- The **stem rabbet** proper rakes less. RECONSTRUCTED at **28 to 30 degrees** above the LWL: the
  knee of the head projects roughly **6 to 7 ft** forward of the rabbet at the level of the head,
  which is the difference between the measured 17.7 ft at z = 25 and the 10.6 ft that a 41-degree
  rabbet alone would give.
- The forefoot is **rounded**, not a sharp gripe: the measured points from z = 0 to z = 6 move
  forward only 3.7 ft, then the rake opens out sharply.
- Cross-check against the period rule: *"the sum of the rakes of the stem and stern posts was
  1/10 of the length of the ship, with their ratio to each other being 1:3"*
  ([Ships of Scale, French heavy frigate of 1686](https://shipsofscale.com/sosforums/threads/french-heavy-frigate-of-1686-%E2%80%93-designing-a-ship-in-the-dutch-manner.12230/)).
  For L = 121 ft that gives 12.1 ft total, 9.1 ft of stem and 3.0 ft of post. The measured stem
  rake to the LWL is 6.8 ft and to the head 17.7 ft, so this ship is **more raked forward than the
  old rule** and much less raked aft. Recorded as a disagreement; **trust the measurement**.
- Beakhead / bowsprit steeve: not measured reliably (the bowsprit line is cut by the sheet edge).
  RECONSTRUCTED at **20 to 22 degrees**, the normal range c.1795. This belongs to the rigging file.

### Sternpost and counter (MEASURED)

Aftermost edge of the stern profile, by height:

| Z above base (ft) | ft aft of FP | note |
|---|---|---|
| -1.0 | 127.2 | heel of the post / rudder |
| 5.0 | 127.5 | |
| 11.7 | 127.8 | |
| **15.0** | **126.5** | **the tuck — the furthest-forward point of the stern profile** |
| 20.3 | 128.7 | counter |
| 25.0 | 131.0 | |
| 30.3 | 131.5 | taffrail |

- **Sternpost rake: about 2.7 degrees aft of vertical** (0.67 ft of rake over 14 ft of height),
  measured on the rudder's after edge, which is parallel to the post. MEASURED. This is a very
  upright post by British standards and is the single most French thing about the profile.
- **Tuck at Z = 15.0 ft above base = 2.2 ft above the LWL.** The counter starts there.
- **Counter overhang: 7.7 ft (2.35 m) abaft the sternpost**, from the half-breadth plan extent
  (133.7 ft drawn against 126 ft on the deck). MEASURED.
- **Taffrail: 10.5 ft (3.2 m) abaft the sternpost, 29.5 ft above the base line.** MEASURED.

**Transom widths (MEASURED from the stern elevation superimposed on the body plan):**

| Item | half-breadth (ft) | breadth (ft) | breadth (m) | as fraction of Bmld |
|---|---|---|---|---|
| Wing transom, at Z about 19.6 ft | 9.5 | 19.0 | 5.79 | 0.61 |
| Stern at the window band | 10.0 | 20.0 | 6.10 | 0.65 |
| Taffrail (RECONSTRUCTED) | 7.0 | 14.0 | 4.27 | 0.45 |
| Tuck / lower counter at the post | 3.0 | 6.0 | 1.83 | 0.19 |

The stern elevation on the body plan shows a **single row of seven stern lights** with a
quarter-gallery outline each side. Square tuck.

---

## 7. POSITION OF THE MAXIMUM BEAM — MEASURED

From the half-breadth plan, the maximum-breadth curve is flat from x = 560 px to x = 960 px, with
its centre at **x = 707 px**. With FP at x = 1080 px and AP at x = 353 px:

**Maximum beam is at 62 ft aft of the FP = 0.51 of the LWL length.**

That is **essentially amidships, marginally abaft**. It is *not* the old French "cod's head"
position well forward, and it is not markedly aft either. The entrance is therefore slightly
longer than the run, and the fine, hollow entry that these corvettes were praised for comes from
the *shape* of the forward sections, not from shoving the midship frame aft.

**NOT FOUND:** no source was located that quantifies French versus British practice on the
longitudinal position of the *maitre-couple* in the 1790s. Searches of the naval-architecture
literature, Sane and Forfait material, and the ship-design workshop literature all failed. The
figure above stands on the measurement alone, and the measurement is the better evidence anyway.

For contrast, the length-to-beam ratio does separate the two navies cleanly:

| Ship | LGD x beam | L/B | Source |
|---|---|---|---|
| **Surprise / Unité (French, 1794)** | 126 ft 0 in x 31 ft 8 in | **3.98** | as §2 |
| HMS Pandora (British, 1779, 24-gun post ship) | 114 ft 7 in x 32 ft 3 in | **3.55** | [Wikipedia, HMS Pandora (1779)](https://en.wikipedia.org/wiki/HMS_Pandora_(1779)) |

Gardiner's summary of the difference is that British frigate hulls "were heavier than equivalent
French ships, had greater stowage and tended to be less fine at the extremities"
([Reviews in History, review of *Frigates of the Napoleonic Wars*](https://reviews.history.ac.uk/review/141/)).

---

## 8. WALES AND THE PAINT BANDING

All MEASURED off the profile, Z above the moulded base line. Add or subtract 12.83 ft for
heights relative to the LWL.

| Band | lower edge (Z, ft) | upper edge (Z, ft) | above LWL (ft) | width |
|---|---|---|---|---|
| Copper line / boot top | — | about 12.8 (the LWL) | 0 | — |
| **Main wale** | **15.2** | **16.9** | +2.4 to +4.1 | 1 ft 8 in |
| Black strake (RECONSTRUCTED, immediately above the wale) | 16.9 | 17.9 | +4.1 to +5.1 | 1 ft 0 in |
| Gun deck at side | 18.65 | — | +5.8 | — |
| Gunport sills | 20.4 | — | +7.6 | MEASURED band 20.3-20.7 |
| Gunport heads | 22.8 | — | +10.0 | MEASURED band 22.2-22.8 |
| **Channel wale / sheer strake band** | **22.9** | **24.1** | +10.1 to +11.3 | 1 ft 2 in, RECONSTRUCTED between the port heads and the rail |
| Top of the waist rail | 25.7 | — | +12.9 | MEASURED |

**The maximum breadth (Z = 16.30) falls inside the main wale.** That is the correct and expected
relationship, and it is a good sanity check on the whole vertical set-up: the ship is widest at
her wale, the wale runs just above the waterline amidships, and the topside tumbles home from
there. All bands follow the sheer curve of §5.

---

## 9. THE OFFSETS TABLE

### Model definition

- **21 stations, 0 = FP, 20 = AP**, spaced **6.05 ft (1.844 m)** on a 121.00 ft LWL.
- **FP** = fore side of the stem rabbet at the LWL. **AP** = after side of the sternpost at the LWL.
- **Z = 0** at the moulded base line = **top of the keel amidships**. The keel and false keel add
  1.33 ft below this. Add 1.33 ft to any Z to get a height above the underside of the false keel.
- **Y** = moulded half-breadth from the centreline. The moulded surface is the inside of the
  planking. Add the plank and wale thickness outside it for the visible hull.
- Ten waterlines: 1.00, 2.50, 4.00, 6.00, 8.50, 11.00, **12.83 (LWL)**, **16.30 (max breadth)**,
  19.00, 22.00 ft above base.
- Two extra columns: the **rabbet / cutting-down line** (the Z at which each station meets the
  keel or the stem/post) and the **gun deck at side** with its half-breadth.
- "—" means the station does not reach that waterline: it is above the keel rabbet there.

**How it was built.** The **midship section shape of §3 is the measured one**. Every other
station is that same normalised shape, scaled by a breadth line, lifted by a rising line of
floor, and sharpened by an exponent that grows toward the ends. The breadth line peaks at 0.51 L
(measured, §7), the rising line and the sharpening exponents were then tuned until the
displacement matched. This guarantees the surface is fair and monotonic by construction, and it
guarantees the midship section is the real one. **The stations are therefore RECONSTRUCTED, but
they are anchored at both ends of the problem: a measured midship section and a measured
displacement.**

The after body above the tuck (stations 16 to 20, waterlines 16.30, 19.00, 22.00) is **overridden
with the counter and transom geometry of §6**, because a section-morph cannot produce a counter.
Those cells are above the LWL and do not affect the displacement check.

### Offsets in FEET — half-breadths, Z above the moulded base line

| Stn | x aft FP | rabbet Z | 1.00 | 2.50 | 4.00 | 6.00 | 8.50 | 11.00 | **12.83** | **16.30** | 19.00 | 22.00 | deck Z | Y @ deck |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.00 | 12.20 | — | — | — | — | — | — | 0.03 | 0.46 | 0.37 | 0.27 | 20.15 | 0.33 |
| 1 | 6.05 | 8.10 | — | — | — | — | 0.07 | 2.96 | 5.67 | 6.97 | 6.79 | 6.58 | 19.85 | 6.73 |
| 2 | 12.10 | 5.05 | — | — | — | 0.58 | 4.06 | 7.58 | 8.98 | 9.64 | 9.33 | 8.99 | 19.58 | 9.27 |
| 3 | 18.15 | 3.00 | — | — | 0.94 | 4.10 | 7.49 | 10.19 | 11.04 | 11.45 | 11.03 | 10.55 | 19.35 | 10.97 |
| 4 | 24.20 | 1.72 | — | 1.05 | 3.77 | 6.88 | 9.92 | 11.86 | 12.47 | 12.78 | 12.23 | 11.62 | 19.15 | 12.20 |
| 5 | 30.25 | 0.95 | 0.06 | 3.36 | 6.26 | 8.86 | 11.60 | 13.04 | 13.51 | 13.75 | 13.11 | 12.39 | 18.98 | 13.11 |
| 6 | 36.30 | 0.50 | 1.74 | 5.44 | 8.07 | 10.38 | 12.72 | 13.89 | 14.27 | 14.47 | 13.75 | 12.96 | 18.85 | 13.79 |
| 7 | 42.35 | 0.22 | 3.46 | 7.09 | 9.46 | 11.52 | 13.52 | 14.49 | 14.80 | 14.96 | 14.22 | 13.39 | 18.75 | 14.29 |
| 8 | 48.40 | 0.07 | 4.79 | 8.30 | 10.45 | 12.30 | 14.05 | 14.88 | 15.14 | 15.28 | 14.53 | 13.69 | 18.68 | 14.61 |
| 9 | 54.45 | 0.01 | 5.61 | 9.02 | 11.02 | 12.74 | 14.33 | 15.08 | 15.33 | 15.45 | 14.69 | 13.86 | 18.65 | 14.79 |
| **10** | 60.50 | 0.00 | 5.88 | 9.25 | 11.21 | 12.88 | 14.43 | 15.15 | 15.38 | **15.50** | 14.75 | 13.91 | 18.66 | 14.84 |
| 11 | 66.55 | 0.00 | 5.86 | 9.22 | 11.18 | 12.84 | 14.38 | 15.10 | 15.34 | 15.45 | 14.70 | 13.86 | 18.70 | 14.78 |
| 12 | 72.60 | 0.02 | 5.41 | 8.80 | 10.81 | 12.52 | 14.13 | 14.88 | 15.13 | 15.25 | 14.49 | 13.66 | 18.79 | 14.55 |
| 13 | 78.65 | 0.10 | 4.40 | 7.87 | 10.01 | 11.87 | 13.62 | 14.46 | 14.73 | 14.87 | 14.12 | 13.29 | 18.91 | 14.15 |
| 14 | 84.70 | 0.30 | 2.85 | 6.37 | 8.74 | 10.80 | 12.83 | 13.82 | 14.14 | 14.30 | 13.57 | 12.75 | 19.07 | 13.55 |
| 15 | 90.75 | 0.70 | 0.83 | 4.27 | 6.94 | 9.26 | 11.67 | 12.91 | 13.31 | 13.52 | 12.82 | 12.04 | 19.28 | 12.75 |
| 16 | 96.80 | 1.45 | — | 1.62 | 4.31 | 7.13 | 9.97 | 11.66 | 12.20 | 12.50 | 12.35 | 11.90 | 19.52 | 12.27 |
| 17 | 102.85 | 2.70 | — | — | 1.25 | 4.22 | 7.46 | 9.96 | 10.72 | 11.20 | 11.35 | 11.05 | 19.81 | 11.27 |
| 18 | 108.90 | 4.60 | — | — | — | 0.84 | 4.02 | 7.38 | 8.66 | 9.60 | 10.15 | 10.05 | 20.13 | 10.11 |
| 19 | 114.95 | 7.20 | — | — | — | — | 0.48 | 3.37 | 5.64 | 7.30 | 9.55 | 9.35 | 20.50 | 9.45 |
| 20 | 121.00 | 10.40 | — | — | — | — | — | 0.04 | 0.98 | 3.80 | 9.30 | 8.90 | 20.90 | 9.05 |

### Offsets in METRES — same table, half-breadths and heights in m

Waterlines are 0.30, 0.76, 1.22, 1.83, 2.59, 3.35, **3.91 (LWL)**, **4.97 (max breadth)**, 5.79,
6.71 m above the moulded base line.

| Stn | x aft FP | rabbet Z | 0.30 | 0.76 | 1.22 | 1.83 | 2.59 | 3.35 | **3.91** | **4.97** | 5.79 | 6.71 | deck Z | Y @ deck |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.00 | 3.72 | — | — | — | — | — | — | 0.01 | 0.14 | 0.11 | 0.08 | 6.14 | 0.10 |
| 1 | 1.84 | 2.47 | — | — | — | — | 0.02 | 0.90 | 1.73 | 2.13 | 2.07 | 2.00 | 6.05 | 2.05 |
| 2 | 3.69 | 1.54 | — | — | — | 0.18 | 1.24 | 2.31 | 2.74 | 2.94 | 2.84 | 2.74 | 5.97 | 2.82 |
| 3 | 5.53 | 0.91 | — | — | 0.29 | 1.25 | 2.28 | 3.11 | 3.36 | 3.49 | 3.36 | 3.22 | 5.90 | 3.34 |
| 4 | 7.38 | 0.52 | — | 0.32 | 1.15 | 2.10 | 3.02 | 3.61 | 3.80 | 3.89 | 3.73 | 3.54 | 5.84 | 3.72 |
| 5 | 9.22 | 0.29 | 0.02 | 1.02 | 1.91 | 2.70 | 3.53 | 3.97 | 4.12 | 4.19 | 3.99 | 3.78 | 5.78 | 4.00 |
| 6 | 11.06 | 0.15 | 0.53 | 1.66 | 2.46 | 3.16 | 3.88 | 4.23 | 4.35 | 4.41 | 4.19 | 3.95 | 5.74 | 4.20 |
| 7 | 12.91 | 0.07 | 1.06 | 2.16 | 2.88 | 3.51 | 4.12 | 4.42 | 4.51 | 4.56 | 4.33 | 4.08 | 5.71 | 4.36 |
| 8 | 14.75 | 0.02 | 1.46 | 2.53 | 3.18 | 3.75 | 4.28 | 4.53 | 4.62 | 4.66 | 4.43 | 4.17 | 5.69 | 4.45 |
| 9 | 16.60 | 0.00 | 1.71 | 2.75 | 3.36 | 3.88 | 4.37 | 4.60 | 4.67 | 4.71 | 4.48 | 4.22 | 5.69 | 4.51 |
| **10** | 18.44 | 0.00 | 1.79 | 2.82 | 3.42 | 3.93 | 4.40 | 4.62 | 4.69 | **4.72** | 4.49 | 4.24 | 5.69 | 4.52 |
| 11 | 20.28 | 0.00 | 1.79 | 2.81 | 3.41 | 3.91 | 4.38 | 4.60 | 4.67 | 4.71 | 4.48 | 4.22 | 5.70 | 4.51 |
| 12 | 22.13 | 0.01 | 1.65 | 2.68 | 3.29 | 3.82 | 4.31 | 4.54 | 4.61 | 4.65 | 4.42 | 4.16 | 5.73 | 4.44 |
| 13 | 23.97 | 0.03 | 1.34 | 2.40 | 3.05 | 3.62 | 4.15 | 4.41 | 4.49 | 4.53 | 4.30 | 4.05 | 5.76 | 4.31 |
| 14 | 25.82 | 0.09 | 0.87 | 1.94 | 2.66 | 3.29 | 3.91 | 4.21 | 4.31 | 4.36 | 4.14 | 3.89 | 5.81 | 4.13 |
| 15 | 27.66 | 0.21 | 0.25 | 1.30 | 2.12 | 2.82 | 3.56 | 3.93 | 4.06 | 4.12 | 3.91 | 3.67 | 5.88 | 3.89 |
| 16 | 29.50 | 0.44 | — | 0.49 | 1.31 | 2.17 | 3.04 | 3.55 | 3.72 | 3.81 | 3.76 | 3.63 | 5.95 | 3.74 |
| 17 | 31.35 | 0.82 | — | — | 0.38 | 1.29 | 2.27 | 3.04 | 3.27 | 3.41 | 3.46 | 3.37 | 6.04 | 3.43 |
| 18 | 33.19 | 1.40 | — | — | — | 0.26 | 1.23 | 2.25 | 2.64 | 2.93 | 3.09 | 3.06 | 6.14 | 3.08 |
| 19 | 35.04 | 2.19 | — | — | — | — | 0.15 | 1.03 | 1.72 | 2.23 | 2.91 | 2.85 | 6.25 | 2.88 |
| 20 | 36.88 | 3.17 | — | — | — | — | — | 0.01 | 0.30 | 1.16 | 2.83 | 2.71 | 6.37 | 2.76 |

### Using the table

- Stations 0 and 20 are the **stem and post**, not real sections. Set their half-breadths to the
  half-siding of the stem (0.55 ft / 0.168 m) and of the post (0.55 ft / 0.168 m) when lofting,
  and let the surface run out to the profile curves of §6.
- Above Z = 22.0 ft continue each station on its tumblehome angle from the §4 table until it
  meets the deck-at-side line, then the rail.
- The bow is a **round bow** at the gun-deck level (the plan shows round-bow framing, and so does
  the deck plan ZAZ3068). Stations 0 to 2 above the deck should be filled out to a round bulkhead,
  not carried to a knife edge.
- Everything here is the **moulded** surface. Add outside it: bottom plank about 3 in, main wale
  4.5 in, topside plank 2.5 in.

---

## 10. HYDROSTATIC CHECK — the table was verified, not just drawn

Computed by numerical integration of the table above, to the LWL at Z = 12.83 ft:

| Quantity | Value | Target / band | Verdict |
|---|---|---|---|
| Volume of displacement | 22,963 ft³ (650.4 m³) | — | — |
| **Displacement (sea water, 35 ft³/ton)** | **656.1 tons / 666.6 tonnes** | 657 tons ([Wikipedia](https://en.wikipedia.org/wiki/HMS_Surprise_(1796))) | **matches to 0.1%** |
| Midship section area | 309.1 ft² | — | — |
| **Cm, midship coefficient** | **0.777** | frigates 0.75 to 0.78 | in band |
| **Cp, prismatic coefficient** | **0.614** | frigates 0.60 to 0.64 | in band |
| **Cb, block coefficient** | **0.477** | frigates 0.45 to 0.48 | in band |
| Cw, waterplane coefficient | 0.764 | — | reasonable |
| **LCB** | 60.79 ft aft of FP = **0.502 L** | — | just abaft amidships, correct for a fine hull |
| Builder's Old Measurement, (108.5104 x 31.6667 x 15.83335) / 94 | **578.79 = 578 73/94 tons** | 578 73/94 recorded | **exact** |
| Displacement / burthen ratio | 1.134 | 1.05 to 1.20 typical for warships | plausible |

Coefficient bands from [ShipCalculators, block coefficient](https://shipcalculators.com/wiki/block-coefficient),
which gives for frigates: block coefficient 0.45-0.48, prismatic coefficient 0.60-0.64, midship
area coefficient 0.75-0.78.

**The hull is monotonic where it should be.** Every station's half-breadth increases without
reversal from the rabbet up to the maximum-breadth level (verified programmatically). Second
differences along the length are small except at stations 0-1 and 19-20, where the hull genuinely
closes fast into the stem and post.

---

## 11. FRENCH PRACTICE — what the sources support, and what they do not

| Claim in the brief | Verdict | Evidence |
|---|---|---|
| French hulls finer, sharper entrance and run | **Supported** | L/B 3.98 against 3.55 for the comparable British Pandora; British hulls "tended to be less fine at the extremities" ([Reviews in History](https://reviews.history.ac.uk/review/141/)) |
| **Less** tumblehome than British ships | **Contradicted by measurement** | 3.35 in per foot, 15.6 deg, measured above the maximum breadth (§4). No period source was found that quantifies a French-versus-British tumblehome difference for the age of sail |
| **Fuller** midship section | **Supported for this ship** | measured Cm 0.777, an almost semicircular section, bilge radius 0.50 B (§3). Forfait's *Etna* corvettes are described as having a "flat hull" ([Wikipedia](https://en.wikipedia.org/wiki/Etna-class_corvette)) |
| Forfait used strong deadrise (*acculement*) with capacity pushed to the ends | **True of him, but not of this hull** | his own words, for the frigate *Seine*, cited to Levot p.192 ([Wikipedia](https://en.wikipedia.org/wiki/Pierre-Alexandre-Laurent_Forfait)). The measured Unité midship section is round-floored |
| Maximum beam further forward or aft than British | **NOT FOUND as a general rule** | no source located. Measured for this ship at 0.51 L from FP, essentially amidships (§7) |

Designer and build facts, for the record: *Unité* was designed by **Pierre-Alexandre-Laurent
Forfait**, built by **Jean Fouache at Le Havre**, laid down August 1793, launched 16 January 1794,
name ship of the *Unité* class
([Wikipedia, HMS Surprise (1796)](https://en.wikipedia.org/wiki/HMS_Surprise_(1796))). Forfait
also wrote the *Traite elementaire de la mature des vaisseaux* and designed the *Seine*,
*Romaine*, *Felicite* and *Etna* classes
([Wikipedia](https://en.wikipedia.org/wiki/Pierre-Alexandre-Laurent_Forfait)).

---

## 12. WHAT COULD NOT BE FOUND

1. **A published offsets table for this hull.** None exists in digitised form. Searched: RMG
   Collections Online, prints.rmg.co.uk, threedecks.org, Model Ship World, Ships of Scale,
   Google Books, archive.org.
2. **The moulded breadth from the title block.** The row is on the sheet but is illegible at
   1280 px. Measured here at 31 ft 1 in from the breadth box. Buy the print to read it.
3. **Marquardt's reconstructed plans.** Brian Lavery, *The Frigate Surprise* (Conway, 2008,
   ISBN 9781844860746) contains **more than 50 line plans drawn by Karl Heinz Marquardt** from
   ZAZ3067, plus 35 Geoff Hunt paintings
   ([Soundings Online feature](https://soundingsonline.com/features/the-frigate-surprise/);
   [Ships of Scale book review](https://shipsofscale.com/sosforums/threads/book-review-the-frigate-surprise-by-brian-lavery-geoff-hunt.1961/)).
   **This is the single most valuable unread source for this project.** It is a print book, not
   online. Buy it. A Model Ship World builder reports that "the dimensions of the hull and the
   positioning of the gunports, hatches and masts correspond exactly to plans by KH Marquardt
   once they are scaled to 1:46".
4. **A higher-resolution free scan.** Tried `j5948_large.jpg`, a `/large/` path variant and an S3
   path: all 404. images.rmg.co.uk returns 403 to tooling.
5. **A quantified French-versus-British rule for tumblehome, or for the position of the midship
   frame.** Multiple searches failed. Both are answered here by measurement instead.
6. **French-unit (pieds) dimensions for *Unité*.** Every source repeats the British survey
   figures. The original Le Havre draught, if it survives, is in France, not at Greenwich.
7. **Any contemporary ship model of this vessel.** None at RMG (see `02-rmg-draughts.md` §1).
8. **Deadrise and rise-of-floor tables for 1790s frigates.** Searched Steel's *Elements and
   Practice of Naval Architecture* (1805, https://archive.org/details/elementspractice00stee)
   and Duhamel du Monceau via archive.org; no usable numeric table surfaced online. The measured
   section in §3 replaces the need for one.

### Do not use these

- **Vanguard Models 1:64 kit** (hull length 752 mm, https://vanguardmodels.co.uk/products/hms-surprise).
  752 mm at 1:64 scales to 48.1 m, against this ship's 38.4 m. It is the O'Brian/film *Surprise*,
  a larger 28-gun ship, not the historical hull.
- **The San Diego replica** (https://sdmaritime.org/visit/the-ships/hms-surprise/). She is the
  former HMS *Rose*, built on the lines of a British 1757 sixth rate. Wrong hull entirely.
- **RMG plans ZAZ3181 to ZAZ3184.** They are the *other* HMS Unite, a 38-gun frigate. See
  `02-rmg-draughts.md` §0.
