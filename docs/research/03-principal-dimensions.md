# HMS SURPRISE (ex-French corvette UNITÉ, 1794) — Principal Dimensions, Tonnage, Armament, Complement

Research pack for 3D modelling. 1 ft = 0.3048 m throughout.
Every figure carries a source. Figures I could not source are marked **RECONSTRUCTED** with the rule used.

---

## 0. Source ranking used in this document

| Rank | Source | Why |
|---|---|---|
| 1 | **NMM/RMG plans ZAZ3067 + ZAZ3068**, John Marshall, Master Shipwright Plymouth, 1798 — [ZAZ3067 Lines & Profile](https://www.rmg.co.uk/collections/objects/rmgc-object-82858), [ZAZ3068 Deck, Quarter & Forecastle](https://www.rmg.co.uk/collections/objects/rmgc-object-82859) | Contemporary measured draughts of *this ship*. Primary. Not digitised for free download; catalogue records only. |
| 2 | **Winfield, *British Warships in the Age of Sail 1793–1817*, p.225** — transcribed at [threedecks.org id=6983](https://threedecks.org/index.php?display_type=show_ship&id=6983) and in [Wikipedia infobox](https://en.wikipedia.org/wiki/HMS_Surprise_(1796)) | Winfield works from the Admiralty Progress Books and Survey/Dimension books. |
| 3 | **Lavery & Hunt, *The Frigate Surprise* (2009)** — plans redrawn by **Karl Heinz Marquardt**, ch.5 pp.64–71 ([Ships of Scale book review thread](https://shipsofscale.com/sosforums/threads/book-review-the-frigate-surprise-by-brian-lavery-geoff-hunt.1961/); [archive.org copy, lending only](https://archive.org/details/frigatesurprisec0000lave)) | The only modern scholarly reconstruction. **The Marquardt plans are the correct working drawing set for a 3D build.** I could not read the plates online — they are behind archive.org lending and the shipsofscale forum is Cloudflare-gated. **Buy or borrow this book; it is the single highest-value acquisition for this project.** |
| 4 | Steel, *The Elements and Practice of Naval Architecture* — [archive.org full text `elementspractice00stee`](https://archive.org/details/elementspractice00stee) | Used only for period rules-of-thumb where ship-specific data is absent. Every use flagged RECONSTRUCTED. |
| 5 | WikiPOBia / Patrick O'Brian wiki | Fiction only. |

**Note on the film ship:** the vessel in *Master and Commander* is the 1970 replica of **HMS *Rose* (1757)**, a completely different and larger hull. Do **not** take dimensions from her. See §8.

---

## 1. Principal dimensions — the core set

Winfield's dimension set (as HMS *Surprise*, British measurement, taken at Plymouth 1798):

| Dimension | Imperial | Metric | Source | Confidence |
|---|---|---|---|---|
| Length on the gundeck (= length of the upper deck, her battery deck) | **126 ft 0 in** | **38.405 m** | [threedecks](https://threedecks.org/index.php?display_type=show_ship&id=6983) ex Winfield BWAS-1793; [Wikipedia](https://en.wikipedia.org/wiki/HMS_Surprise_(1796)) ex Winfield 2008 p.225 | High — two independent transcriptions of Winfield agree exactly |
| Length of keel for tonnage | **108 ft 6⅛ in** (108.5104 ft) | **33.075 m** | [Wikipedia](https://en.wikipedia.org/wiki/HMS_Surprise_(1796)) ex Winfield 2008 p.225 | **Prefer this value** — see arithmetic check below |
| Length of keel for tonnage (variant) | 108 ft 6¼ in (108.5208 ft) | 33.078 m | [threedecks](https://threedecks.org/index.php?display_type=show_ship&id=6983) ex Winfield | Rejected — see check |
| Breadth extreme | **31 ft 8 in** | **9.652 m** | [threedecks](https://threedecks.org/index.php?display_type=show_ship&id=6983); [Wikipedia](https://en.wikipedia.org/wiki/HMS_Surprise_(1796)) | High — both agree |
| Depth in hold | **10 ft 0½ in** (10.0417 ft) | **3.061 m** | [threedecks](https://threedecks.org/index.php?display_type=show_ship&id=6983) | **Prefer** — threedecks preserves the half-inch |
| Depth in hold (variant) | 10 ft 0 in | 3.048 m | [Wikipedia](https://en.wikipedia.org/wiki/HMS_Surprise_(1796)) | Rounded transcription of the same Winfield figure |
| Burthen | **578 ⁷³⁄₉₄ tons bm** (578.777) | — | [threedecks](https://threedecks.org/index.php?display_type=show_ship&id=6983); [Wikipedia](https://en.wikipedia.org/wiki/HMS_Surprise_(1796)) | High — both agree to the 94th |
| Displacement | **657 tons** | ≈ 667.5 tonnes | [Wikipedia](https://en.wikipedia.org/wiki/HMS_Surprise_(1796)) citing Winfield & Roberts, *French Warships in the Age of Sail 1786–1861* (2015) p.168 | Medium — French-derived displacement, not a British measurement |

### Arithmetic check that resolves the keel discrepancy
Builder's Old Measurement: `tons bm = (K × B × B/2) / 94`, where K = keel for tonnage, B = breadth extreme.

- With B = 31.6667 ft and tonnage 578.7766: K = 578.7766 × 94 / (31.6667 × 15.83335) = **108.510 ft = 108 ft 6.12 in**.
- 108 ft 6⅛ in gives 578.777 → **578 ⁷³⁄₉₄** ✔ exact match.
- 108 ft 6¼ in gives 578.832 → 578 ⁷⁸⁄₉₄ ✘.

**Use 108 ft 6⅛ in.** The breadth of 31 ft 8 in and tonnage of 578 ⁷³⁄₉₄ are internally consistent to the last fraction, which is strong evidence all three are transcribed correctly from the Admiralty dimension book.

### Length overall of hull (stem head to taffrail) — RECONSTRUCTED
No source gives it. Not recorded by the Admiralty, which measured on the gundeck.
- **RECONSTRUCTED: ~145–150 ft (44.2–45.7 m)** hull LOA excluding bowsprit, ~126 ft gundeck + head/knee of the head forward + counter/taffrail overhang aft.
- Rule: for late-18th-C. RN frigates, stem-rabbet-to-taffrail typically runs 1.15–1.19 × length on the gundeck. Derived from the geometry described in Steel's chapter on proportional dimensions and head construction ([Steel, *Elements and Practice of Naval Architecture*, full text](https://archive.org/details/elementspractice00stee), "General Observations on the Proportional Dimensions"). **Take this from the Marquardt profile plan instead — do not build to my figure.**

### As the French *Unité* — conflicting figures, recorded for completeness
| Item | Value | Source | Comment |
|---|---|---|---|
| Length | 129 ft (39.32 m) | Ian Johnston comment, [threedecks id=6983](https://threedecks.org/index.php?display_type=show_ship&id=6983); repeated by [Grokipedia/fandom mirrors](https://en.wikipedia.org/wiki/HMS_Surprise_(1796)) | **Distrust.** Almost certainly a metric-to-imperial mangling or a different reference point. The British measured her at 126 ft 0 in on the gundeck. |
| Beam | 31 ft 8 in (9.652 m) | same | Agrees with British measurement |
| Draught | 14 ft / 4.2 m | same | See §2 |
| Burthen | 350 (French *tonneaux*) | [threedecks id=6984](https://threedecks.org/index.php?display_type=show_ship&id=6984) ex Winfield & Roberts, *French Warships in the Age of Sail 1786–1861* | French *tonneaux* ≠ tons bm. Not comparable to 578 bm. Do not average the two. |
| Designer / builder | Pierre-Alexandre Forfait (designer); Jean Fouache (constructor); Le Havre | [threedecks id=6984](https://threedecks.org/index.php?display_type=show_ship&id=6984); [Wikipedia](https://en.wikipedia.org/wiki/HMS_Surprise_(1796)) ex Winfield & Roberts 2015 p.168 | Laid down Aug 1793, launched 16 Jan 1794, commissioned Apr 1794 |

---

## 2. Draught, freeboard, and the waterline

**This is the weakest area. No source gives separate forward and after draughts, light or laden.**

| Item | Value | Source / status |
|---|---|---|
| Draught (single figure, presumed laden, presumed aft) | **14 ft 0½ in = 4.280 m** | [Wikipedia](https://en.wikipedia.org/wiki/HMS_Surprise_(1796)) ex Winfield 2008 p.225. threedecks does **not** list a draught, so this is single-sourced. |
| Draught forward, laden | **RECONSTRUCTED ~11 ft 6 in = 3.505 m** | Rule: small RN frigates of the 1790s were designed to trim by the stern by roughly 2 ft to 2 ft 6 in. Steel: *"The ship may be laid down in the draught either so as to sail on an even keel or so as to draw most water abaft; but the larger classes, in general, are recommended to be constructed for an even keel"* — i.e. smaller classes trimmed by the stern ([Steel, ch. on Tonnage](https://archive.org/details/elementspractice00stee)). Applying a 2 ft 6 in drag to 14 ft 0½ in aft. |
| Mean laden draught | **RECONSTRUCTED ~12 ft 9 in = 3.886 m** | Mean of the above |
| Light draught fore / aft | **NOT FOUND.** RECONSTRUCTED ~9 ft 6 in / ~12 ft 6 in (2.90 m / 3.81 m) | Rule: light (stores out, guns in) typically 2 ft to 2 ft 6 in less than laden for a vessel of this displacement. No period source found for *Surprise* specifically. Low confidence — flag to the modeller. |
| Height of upper-deck (battery) port sills above LWL amidships | **RECONSTRUCTED 6 ft 6 in = 1.981 m** | **Rule with a good period source.** Steel: *"the first thing to be considered in the construction of a ship of war is, to determine on the height of the gun-deck ports above the water at the lowest place, which is commonly at… the midships. This we find, in line of battle ships, should invariably be from five to six feet; in frigates, from six to seven feet; and in sloops, cutters, &c. from four to five feet."* ([Steel, *Elements and Practice of Naval Architecture*](https://archive.org/details/elementspractice00stee)). Mid-range for a frigate = 6 ft 6 in. |
| Height of the upper deck (deck plank at side) above LWL amidships | **RECONSTRUCTED 4 ft 6 in = 1.372 m** | 6 ft 6 in port-sill height less 2 ft 0 in sill-above-deck (see §4) |
| Freeboard amidships to top of waist bulwark | **RECONSTRUCTED ~9 ft 0 in = 2.743 m** | 4 ft 6 in deck-above-water + ~4 ft 6 in bulwark (see §5) |
| Draught marks | Cut on stem and sternpost, Roman numerals 6 in high, 12 in apart, painted white | Standard RN practice; no *Surprise*-specific source found |

**Caution for the modeller:** the 14 ft 0½ in figure is suspiciously close to the "4.2 m" quoted for her as *Unité*. It may be a single French-measured draught carried through both records rather than an independent British survey. Treat the whole waterline as provisional until checked against ZAZ3067, which will carry the LWL directly.

---

## 3. Deck heights, hold, and camber

**None of this is published online for *Surprise*.** All of §3 is RECONSTRUCTED from period tables. The Marquardt profile in Lavery & Hunt will supersede all of it.

| Item | RECONSTRUCTED value | Metric | Rule and source |
|---|---|---|---|
| Depth in hold (top of floor ceiling → underside of upper deck beams, amidships) | 10 ft 0½ in *(measured, not reconstructed)* | 3.061 m | [threedecks](https://threedecks.org/index.php?display_type=show_ship&id=6983) ex Winfield |
| Height upper-deck plank → underside of quarterdeck beam, midships | **6 ft 8 in** | 2.032 m | Steel's scantling table, "Upper Deck", row *Height from the upperside of the plank to the upperside of the quarterdeck beam in midships*: afore 6 ft 10 in / 6 ft 8 in / 6 ft 10 in / 6 ft 7 in; abaft 7 ft 1 in / 6 ft 11 in / 7 ft 0 in / 6 ft 8 in across classes ([Steel full text](https://archive.org/details/elementspractice00stee), line block "Upper Deck—continued"). Small-ship end of the range. |
| Height upper-deck plank → underside of forecastle beam, midships | **6 ft 6 in** | 1.981 m | Same Steel table, *forecastle beam in midships*: 6 ft 7 in / 6 ft 6 in / 6 ft 7 in / 6 ft 5 in across classes |
| Height of the platform/orlop tier under the upper deck | **~5 ft 6 in clear** | 1.676 m | *Surprise* has no full lower deck — she is a single-battery-deck ship with platforms only. Derived: 10 ft 0½ in hold depth less hold stowage. **Low confidence.** |
| Round-up (camber) of upper-deck beams, midships | **5 in over 31 ft 8 in** | 0.127 m | Steel's scantling table, row *Beams to round up in midships*: values 6 in / 6 in / 6 in / 5 in / 4 in / 4 in descending by class ([Steel full text](https://archive.org/details/elementspractice00stee)). A 578-ton sixth rate sits at 4–5 in; take 5 in. |
| Round-up — alternative rule | 7.9 in over 31 ft 8 in | 0.201 m | The modern boatbuilding rule of ¼ in camber per foot of beam (Skene, *Elements of Yacht Design*, ¼–⅜ in/ft), quoted via [Ships of Scale, "Deck beam camber"](https://shipsofscale.com/sosforums/threads/deck-beam-camber.13147/). **I trust Steel's 4–5 in over this** — the modern rule is not a period RN rule and over-cambers an 18th-C. warship deck. |
| Round-up of quarterdeck / forecastle beams | **4 in** | 0.102 m | Upper works were flatter than the battery deck; one step down from the 5 in above. RECONSTRUCTED, no direct source. |
| Sheer (rise of the deck at stem and stern above amidships) | **NOT FOUND** | — | Must be lifted from ZAZ3067 or the Marquardt profile. A French-designed corvette of 1793 by Forfait would carry markedly less sheer than a British-built ship of the same date — do not substitute a British frigate's sheer. |

---

## 4. Gunports — size, sill height, spacing

Steel's frigate scantling table gives real numbers for the quarterdeck and forecastle. The main battery figures are reconstructed.

### Quarterdeck and forecastle ports — SOURCED
From Steel's *"THE DIMENSIONS AND SCANTLINGS… Frigates"* table, Quarter Deck section, smallest-frigate columns ([Steel full text](https://archive.org/details/elementspractice00stee)):

| Item | Imperial | Metric | Note |
|---|---|---|---|
| Gun port, fore and aft (width) | **2 ft 4 in** | 0.711 m | Smallest-class column |
| Gun port, deep (height) | **2 ft 4 in** | 0.711 m | Constant 2 ft 4 in across all frigate columns |
| Gun port sill above deck plank | **1 ft 6 in – 1 ft 9 in**; take **1 ft 8 in** | 0.508 m | Steel row: 1 ft 8 in / 1 ft 8 in / 1 ft 10 in / 1 ft 7 in / 1 ft 6 in / 1 ft 9 in across classes |
| **Carronade** port, fore and aft (width) | **3 ft 4 in** | 1.016 m | Constant 3 ft 4 in in every frigate column — carronade ports are notably wider than gun ports |
| **Carronade** port sill above deck plank | **0 ft 11 in** | 0.279 m | Constant 11 in in every frigate column. Carronade slides sit much lower than gun carriages — **this is a distinctive and easily-got-wrong detail** |

### Upper deck (main battery) ports — RECONSTRUCTED
| Item | RECONSTRUCTED | Metric | Rule and source |
|---|---|---|---|
| Port, fore and aft (width) | **2 ft 6 in** | 0.762 m | Steel's upper-deck row for two-deckers gives 3 ft 0 in / 2 ft 10 in / 3 ft 0 in / 2 ft 10 in / 2 ft 8 in descending by class ([Steel](https://archive.org/details/elementspractice00stee)). *Surprise* mounts 9-pdrs, lighter than any of those, so one step smaller. |
| Port, deep (height) | **2 ft 4 in** | 0.711 m | Steel's upper-deck row: 2 ft 9 in / 2 ft 8 in / 2 ft 10 in / 2 ft 8 in / 2 ft 7 in by class; 9-pdr battery → 2 ft 4 in, matching the frigate QD value |
| Port sill above upper-deck plank | **1 ft 11 in – 2 ft 0 in**; take **2 ft 0 in** | 0.610 m | Steel, *Height from the plank to the port sills*, Upper Deck: 1 ft 11 in / 1 ft 11 in / 2 ft 0 in / 2 ft 0 in |
| Lower sill piece, depth (structural) | **7 in** | 0.178 m | Steel, *Port sills… Lower sills, deep*, upper deck: 7 in / 7 in / 6 in / 6 in |
| Upper sill piece, depth | **6 in** | 0.152 m | Steel, *Upper sills, deep*, upper deck: 6 in / 6 in / 5½ in |
| Port lid thickness | **3 in** (single), half-ports of ¾ in deal | 0.076 m | Steel, *Port Lids… not less than 3 in / 3½ in* |
| Port lid hinges | 2 iron hinges per lid, 4 in – 4½ in broad | 0.102–0.114 m | Steel, iron work to ports |

### Port spacing — RECONSTRUCTED
No source gives *Surprise*'s port spacing. Derivation:

- She was **pierced for 24 guns on the upper deck** — 12 ports per side ([WikiPOBia, via Wayback](https://web.archive.org/web/20230930162819/http://wiki.hmssurprise.org/phase3/index.php/HMS_Surprise_(ship))).
- Steel's placement rule: *"The foremost and aftermost ports being determined upon, the intermediate ports will be at equal distances asunder, according to the room and space; and double the room and space must be always sufficient to allow for the width of the port, the siding of the frame timbers… taking care to have two frames between every two ports, all fore and aft, and they will all be equally spaced."* ([Steel](https://archive.org/details/elementspractice00stee))
- Gundeck length 126 ft 0 in; allow ~17 ft from the fore perpendicular to the first port centre (manger and bow chase clearance) and ~15 ft from the after perpendicular to the last (quarter gallery clearance, scaled down from Steel's 12 ft 6 in / 7 ft 6 in figures for a 170 ft ship).
- Port span centre-to-centre ≈ 94 ft over 11 intervals.

| Item | RECONSTRUCTED | Metric |
|---|---|---|
| Upper-deck port spacing, centre to centre | **8 ft 6 in** (± 6 in) | 2.591 m |
| Clear distance between adjacent port cheeks | **6 ft 0 in** | 1.829 m |
| Room and space (frame centre to frame centre) | **2 ft 4 in – 2 ft 5 in** | 0.711–0.737 m |

Rule for room and space (definition, Steel): *"The distance from the moulding edge of one timber to the moulding edge of the next timber, which is always equal to the breadth of two timbers, and two to four inches more."* ([Steel](https://archive.org/details/elementspractice00stee)). Steel's Seppings-era class table gives ~2 ft 5⅜ in for a 6th rate of 28 guns, though the OCR of that column is unreliable.

**Verify all of §4 against ZAZ3068 (Deck, Quarter & Forecastle plan) — that plan shows the port positions directly.**

---

## 5. Bulwark and rail heights — ALL RECONSTRUCTED

No source found. Derived by stacking the sourced port geometry above.

| Location | Height above deck | Metric | Derivation |
|---|---|---|---|
| Waist (upper deck, open between gangways) — top of the sheer strake / gunwale | **4 ft 6 in** | 1.372 m | Port sill 2 ft 0 in + port depth 2 ft 4 in + upper sill/capping ~2 in |
| Waist — top of the rough-tree rail (if fitted above the gunwale) | **~3 ft 6 in – 4 ft 0 in above the gangway**, i.e. breast high | 1.07–1.22 m | Steel's definition: *"ROUGH-TREE RAILS. Rails along the waist and quarters, nearly breast high, to prevent persons from falling overboard."* ([Steel](https://archive.org/details/elementspractice00stee)) |
| Quarterdeck — top of bulwark/rail | **4 ft 4 in** | 1.321 m | QD gun-port sill 1 ft 8 in + port depth 2 ft 4 in + capping ~4 in |
| Forecastle — top of bulwark/rail | **4 ft 4 in** | 1.321 m | Same construction as the quarterdeck |
| Hammock cranes / netting above the rail | **+2 ft 0 in to 2 ft 6 in** where fitted | +0.61–0.76 m | Standard RN fitting; adds significantly to the apparent topside height. No *Surprise*-specific evidence that she carried them. |

**Flag:** as a French-built hull, *Surprise*'s topside tumblehome and the run of her drifts (the steps in the rail at the break of the quarterdeck and forecastle) will not follow British practice. This is exactly the kind of thing the Marquardt profile settles and my reconstruction cannot.

---

## 6. Armament — the real ship

### 6.1 Rating
- Winfield / threedecks list her as a **28-gun sixth-rate frigate** (threedecks header: *"Nominal Guns 28 — BWAS-1793"*; *"Category: Sixth Rate; Ship Type: Frigate"*) — [threedecks id=6983](https://threedecks.org/index.php?display_type=show_ship&id=6983).
- The brief's "24-gun sixth rate / post ship" describes the **battery** (24 guns on the upper deck) rather than her nominal rate. Both are defensible; the Navy List rating is 28.
- WikiPOBia adds nuance: *"She is usually described as a 28-gun ship, but this was a somewhat artificial reckoning to distinguish her from an unrated post ship on the one hand… and from a 32-gun frigate on the other."* — [WikiPOBia via Wayback](https://web.archive.org/web/20230930162819/http://wiki.hmssurprise.org/phase3/index.php/HMS_Surprise_(ship)). It also notes *"she briefly enjoyed the status of a fifth rate ship before reverting to the sixth rate."*
- **I could not verify Colledge & Warlow's rating for her.** Wikipedia cites Colledge & Warlow (2006) p.162 only for the *Hermione* cutting-out, not for the rating or dimensions.

### 6.2 As the French *Unité*, 1794–96
| Deck | Guns | Source |
|---|---|---|
| Upper deck | 22 × French 8-pdr | [threedecks id=6984](https://threedecks.org/index.php?display_type=show_ship&id=6984) ex Winfield & Roberts, *French Warships in the Age of Sail 1786–1861* |
| Quarterdeck/forecastle | 2 × French 12-pdr | same |
| **Total** | **24 pieces; broadside 100 French livres (107.92 lb / 48.95 kg)** | same |
| Wikipedia's variant | 24 × 8-pdr long guns + 8 × 4-pdr long guns (32 pieces) | [Wikipedia infobox](https://en.wikipedia.org/wiki/HMS_Surprise_(1796)) ex Winfield 2008 p.225 |
| Fremantle's capture report | *"a Corvette of 34 gun and 218 men"* | London Gazette, 28 May 1796, reproduced at [threedecks id=6984](https://threedecks.org/index.php?display_type=show_ship&id=6984) |

**Disagreement.** Three different counts (24 / 32 / 34). I trust the **Winfield & Roberts 22 × 8-pdr + 2 × 12-pdr** for the fitted-out state, and read Fremantle's "34" as a captor's inflation or a count including swivels. The 32-piece Wikipedia version is likely the designed establishment.

### 6.3 As HMS *Surprise* — the Plymouth Dockyard **recommendation**, June 1796
This is the figure Wikipedia and threedecks both print. **Note the caveat in §6.4 — it may never have been fitted.**

| Deck | Guns | Broadside contribution |
|---|---|---|
| Upper deck | **24 × 9-pdr long guns** | 12 × 9 = 108 lb |
| Quarterdeck | **8 × 4-pdr long guns** | 4 × 4 = 16 lb |
| Quarterdeck | **4 × 12-pdr carronades** | 2 × 12 = 24 lb |
| Forecastle | **2 × 4-pdr chase guns** | 1 × 4 = 4 lb |
| Forecastle | **2 × 12-pdr carronades** | 1 × 12 = 12 lb |
| **Total** | **40 pieces** | **broadside 164 lb (74.374 kg)** |

Sources: [threedecks id=6983](https://threedecks.org/index.php?display_type=show_ship&id=6983) ex Winfield BWAS-1793, dated 6.1796, broadside stated as 164 lb; [Wikipedia infobox](https://en.wikipedia.org/wiki/HMS_Surprise_(1796)) ex Winfield 2008 p.225. Broadside arithmetic checks: 108+16+24+4+12 = 164 ✔.

### 6.4 What she ACTUALLY received, 21 April 1798 — the carronade armament
Posted by **Richard Wright**, 2 April 2026, on [threedecks id=6983](https://threedecks.org/index.php?display_type=show_ship&id=6983):

> *"Armament listed comes from the 'recommended' armament from Plymouth Dockyard — this was never enacted and the actual armament received on board HMS Surprise on April 21 1798 was as follows: Upper Deck: 24 British 32-pound Carronade; Quarterdeck: 8 British 18-Pound Carronade; Forecastle: 2 British 18-Pound Carronade; Forecastle: 2 British 4-Pounder. Specific evidence uncovered from research with original documentation from correspondence between Navy Board, Captain Hamilton and Dockyard during refit after capture."*

| Deck | Guns | Broadside contribution |
|---|---|---|
| Upper deck | **24 × 32-pdr carronades** | 12 × 32 = 384 lb |
| Quarterdeck | **8 × 18-pdr carronades** | 4 × 18 = 72 lb |
| Forecastle | **2 × 18-pdr carronades** | 1 × 18 = 18 lb |
| Forecastle | **2 × 4-pdr long guns (chase)** | 1 × 4 = 4 lb |
| **Total** | **36 pieces** | **broadside 478 lb** |

**Corroboration:** WikiPOBia states *"The guns on the main deck were either nine-pounder long guns or 32-pounder carronades"* ([Wayback](https://web.archive.org/web/20230930162819/http://wiki.hmssurprise.org/phase3/index.php/HMS_Surprise_(ship))). [Vanguard Models' HMS Surprise kit](https://vanguardmodels.co.uk/products/hms-surprise) offers exactly this split: *"Choose between the fictional Patrick O'Brian version with 24 × 9-pounder long guns, or the historical HMS Surprise configuration with 24 × 32-pounder carronades."*

**Modelling consequence — this matters a great deal:**
- A **32-pdr carronade** sits on a slide-and-pivot mount, not a four-truck carriage. Port sill height drops to **11 in** above the deck (Steel, §4) versus ~2 ft 0 in for a long gun. Port width goes to **3 ft 4 in** versus 2 ft 6 in.
- The 1798 carronade battery therefore gives a **visibly different topside** — lower, wider ports and no long-gun carriages in the waist.
- **Recommendation for the build:** the 1796 recommended 9-pdr armament is what almost every published image and every model shows, and it is what O'Brian used. The 1798 carronade armament is better documented as what was actually aboard. Decide which ship you are building and say so in the model notes. Richard Wright's claim rests on unpublished Navy Board correspondence I could not independently verify online.

### 6.5 Career summary (for dating the model)
| Date | Event | Source |
|---|---|---|
| Aug 1793 | Laid down, Le Havre | [threedecks id=6984](https://threedecks.org/index.php?display_type=show_ship&id=6984) |
| 16 Jan 1794 | Launched as *Unité* | same |
| 20 Apr 1796 | Captured by HMS *Inconstant* (Capt. Thomas Fremantle) off Bône / near Cape Bon | [London Gazette 28 May 1796, via threedecks](https://threedecks.org/index.php?display_type=show_ship&id=6984) |
| Jun 1796 | Commissioned as HMS *Surprise*, Cdr Edward Hamilton | [threedecks id=6983](https://threedecks.org/index.php?display_type=show_ship&id=6983) |
| 29 Jul 1796 | Sailed for Jamaica | same |
| 21 Jan 1798 | Arrived Plymouth Dockyard | [RMG ZAZ3067 record](https://www.rmg.co.uk/collections/objects/rmgc-object-82858) quoting the Progress Book |
| 15 Feb 1798 | Docked to be recoppered | same |
| 2 Mar 1798 | Undocked | same |
| **21 Apr 1798** | **Carronade armament received on board** | Richard Wright comment, [threedecks id=6983](https://threedecks.org/index.php?display_type=show_ship&id=6983) |
| 2 May 1798 | Sailed after fitting; total cost **£6,992 0s 0d** | [RMG ZAZ3067](https://www.rmg.co.uk/collections/objects/rmgc-object-82858); [threedecks](https://threedecks.org/index.php?display_type=show_ship&id=6983) |
| 25 Oct 1799 | Cut out HMS *Hermione* from Puerto Cabello | [Wikipedia](https://en.wikipedia.org/wiki/HMS_Surprise_(1796)) ex Lavery 1994 p.74, London Gazette 15223 |
| May 1801 | Paid off at Sheerness | Hampshire Telegraph 25 May 1801, quoted at [threedecks](https://threedecks.org/index.php?display_type=show_ship&id=6983) |
| Feb 1802 | Sold at Deptford | [threedecks](https://threedecks.org/index.php?display_type=show_ship&id=6983); [Wikipedia](https://en.wikipedia.org/wiki/HMS_Surprise_(1796)) |

**Rig note relevant to the model:** the "abnormally tall mainmast from a 36-gun frigate" story is a myth or at most a short-lived experiment. Lavery found a letter from Hamilton of **May 1798** instructing the dockyard to *remove the mainmast and set up the existing foremast in its place* for stiffness; the 1802 sale inventory lists spars appropriate to a 20- or 24-gun ship. Mainmast then **71 ft**, foremast **66 ft**. By contrast Burney's *New Universal Dictionary of the Marine* (1815, art. 'Mast') gives 81 ft for a 28-gun ship, 89 ft for a 36. Geoff Hunt paints her with the 89 ft mainmast and reckons the main-topgallant truck at **146 ft** overall. — all from [WikiPOBia via Wayback](https://web.archive.org/web/20230930162819/http://wiki.hmssurprise.org/phase3/index.php/HMS_Surprise_(ship)), citing Lavery & Hunt *The Frigate Surprise* and Hunt, *The Marine Art of Geoff Hunt* (Conway, 2004) p.114.

---

## 7. Complement

| Figure | Value | Source | Comment |
|---|---|---|---|
| RN establishment, peace | **172** | [Wikipedia infobox](https://en.wikipedia.org/wiki/HMS_Surprise_(1796)) ex Winfield 2008 p.225 | |
| RN establishment, war | **220** | same | |
| Winfield, borne 6.1796 | **200** | [threedecks id=6983](https://threedecks.org/index.php?display_type=show_ship&id=6983) ex BWAS-1793 | Probably the actual complement as commissioned |
| Range across her service | **200–240** | [WikiPOBia via Wayback](https://web.archive.org/web/20230930162819/http://wiki.hmssurprise.org/phase3/index.php/HMS_Surprise_(ship)) | *"She was established for a crew of between 200 and 240."* |
| As French *Unité* at capture | **218** | Fremantle's dispatch, London Gazette 28 May 1796, via [threedecks id=6984](https://threedecks.org/index.php?display_type=show_ship&id=6984) |
| As French *Unité*, design | 240 | Ian Johnston comment, [threedecks id=6983](https://threedecks.org/index.php?display_type=show_ship&id=6983) | |
| RN sixth-rate class norm | 150–240 men | [Wikipedia, "Sixth-rate"](https://en.wikipedia.org/wiki/Sixth-rate) | Context only |

**Use 200 as the working figure for the RN ship.** It is the borne figure Winfield gives, it sits inside every other range, and it is what a 40-piece battery needs to fight.

**Officers:** a 28-gun sixth rate carried about 19 officers — captain, two lieutenants; warrant officers master, surgeon, purser ([Wikipedia, "Sixth-rate"](https://en.wikipedia.org/wiki/Sixth-rate)). Bears on the number of gunroom cabins to model.

---

## 8. The FICTIONAL *Surprise* — O'Brian's novels

O'Brian keeps the real ship's dimensions and history but changes the guns and stretches her life from before 1783 to after 1817.

### 8.1 What O'Brian changed
> *"O'Brian's Surprise retains the French origin and name, the specification and the history of the real ship… O'Brian also raises her principal armament (when she is carrying long guns) from 9-pounders to 12-pounders; he postulates several major refits (the last in* Blue at the Mizzen*) to account for her ability to cope with the stress of this."*
> — [WikiPOBia via Wayback](https://web.archive.org/web/20230930162819/http://wiki.hmssurprise.org/phase3/index.php/HMS_Surprise_(ship))

### 8.2 Fictional armament, with book and page citations
All from [WikiPOBia via Wayback](https://web.archive.org/web/20230930162819/http://wiki.hmssurprise.org/phase3/index.php/HMS_Surprise_(ship)), which cites the Norton editions page by page:

| Item | Detail | Book & page |
|---|---|---|
| Main-deck battery (later, "extended 1813") | *"twenty-two twelve-pounders on her maindeck and two beautiful brass long nines"* | *The Reverse of the Medal* (Norton, *Complete Aubrey/Maturin Novels* p.3656) |
| Carronades | *"She possessed six twenty-four-pounder carronades, but since they tended to oppress her in heavy seas they were often struck down into the hold"* | *The Nutmeg of Consolation* (Norton 1991) p.81 |
| Broadside as a privateer | *"he could only command a broadside of 141 pounds"* | *The Reverse of the Medal*, ibid. |
| Carronade vs long gun | carronades *"only a third the weight of the Surprise's regular twelve-pounder cannon but firing a ball twice as heavy… could be fought by a much smaller crew — two zealous hands at a pinch, as opposed to the seven or eight gathered round a long twelve"* | *The Truelove* (Norton 1992) pp.217, 220 |
| Locks | later fitted with *"brilliant flint-locks… doing away with those potential misfires when the linstock wavered over the touch hole"* (though later references revert to slow-match) | *The Hundred Days* (Norton 1998) p.40; cf. pp.58, 262 |
| Named guns (starboard, even-numbered 2–24) | *Wilful Murder* (No. 4), *Towser* (6), *Jumping Billy* (22), *True Blue* (24), plus *Viper*, *Mad Anthony*, *Bulldog*, *Nancy's Fancy*, *Belcher*, *Sudden Death*, *Tom Crib*, *Nancy Dawson*, *Revenge*, *Spitfire*; a brass long nine named *Beelzebub* | *The Reverse of the Medal* p.3658; *The Nutmeg of Consolation* pp.84–85, 125, 142; *The Letter of Marque* p.39 |
| Displacement in the Canon | *"less than six hundred tons"* | *The Letter of Marque* (Norton 1990) p.49 |
| Best bower anchor | 31 hundredweight = 3,472 lb (1,575 kg) | *The Far Side of the World* (Norton pbk 1992) pp.235–6 |
| Spritsail course | *"an odd, rather old-fashioned sail, slung under the bowsprit and masking the chasers"* | *The Reverse of the Medal* (Norton pbk 1992) p.111 |
| **Gunroom dimensions** | *"a long dim corridor-like room, some eighteen feet wide and twenty-eight in length, with an almost equally long table running down the middle and the officers' cabin doors opening on to the narrow space on either side — opening outwards, since if they opened the other way they must necessarily crush the man within."* Mizzen-mast runs through it to the keelson. | *The Wine-Dark Sea* (Norton 1993) p.107 |

**Gunroom check for the modeller:** 18 ft wide × 28 ft long. At a 31 ft 8 in extreme breadth that is credible for a compartment right aft on the platform under the quarterdeck. **18 ft = 5.486 m, 28 ft = 8.534 m.** This is the only interior dimension I found anywhere, in any source, fictional or otherwise.

**Simplified O'Brian battery (the version most often modelled):**
- 24 × 9-pdr long guns on the upper deck (early), or 22 × 12-pdr + 2 brass long 9-pdr chase (later)
- 6 × 24-pdr carronades
- Vanguard Models sells this as *"the fictional Patrick O'Brian version with 24 × 9-pounder long guns"* — [vanguardmodels.co.uk](https://vanguardmodels.co.uk/products/hms-surprise)

Wikipedia's account of the fictional ship: rated 28 guns; sold out of the service in *The Reverse of the Medal*, bought by Stephen Maturin, run as a letter of marque, later a hired ship; still at sea in 1817 at the end of *Blue at the Mizzen* — [Wikipedia](https://en.wikipedia.org/wiki/HMS_Surprise_(1796)) ex Lavery 1994 pp.71–73. Aubrey serving in her as a midshipman: *HMS Surprise* (1973), **Chapter 4** — [Wikipedia ref](https://en.wikipedia.org/wiki/HMS_Surprise_(1796)).

### 8.3 Fictional complement
No single canonical number found. WikiPOBia's *"established for a crew of between 200 and 240"* is a statement about the historical ship. **The film's 197 (below) is the most-quoted figure and is not stated as such in the books.** Treat any specific novel complement figure as unverified.

---

## 9. The FILM version (2003)

### 9.1 Stated in the film
Opening title card: *"April — 1805. Napoleon is master of Europe, only the British fleet stands before him. Oceans are now battlefields. **HMS Surprise, 28 Guns, 197 Souls**, N. Coast of Brazil."* — transcribed at [Woolly Days, "Master and Commander: the opening scenes"](http://nebuchadnezzarwoollyd.blogspot.com/2006/04/master-and-commander-opening-scenes.html) (one online transcription garbles this to "128 Guns" — it is 28).

### 9.2 Guns as shown on screen
> *"On her gun deck, she has 22 nine pounder long guns. On her top deck she has 6 more guns: 2 carronades on the forecastle, 2 carronades on the quarterdeck, and 2 long nines on the poop deck. The 2 nine pounders (which appear to be bronze) also can be moved to serve as stern chasers… They also appear to be bronze."*
> — [Patrick O'Brian Wiki, "HMS Surprise"](https://patrickobrian.fandom.com/wiki/HMS_Surprise) (retrieved via the Fandom MediaWiki API)

22 + 2 + 2 + 2 = 28 ✔ consistent with the title card.

### 9.3 The physical film ship — DO NOT USE THESE DIMENSIONS
She is the 1970 replica of **HMS *Rose* (1757)**, built at Smith and Rhuland, Lunenburg, Nova Scotia to a Phil Bolger design from Admiralty drawings of *Rose*, now at the Maritime Museum of San Diego.

| Item | Replica | Historical *Surprise* 1796 | Delta |
|---|---|---|---|
| Length on deck | 135 ft 6 in (41.30 m) | 126 ft 0 in (38.41 m) | **+9 ft 6 in** |
| Sparred length | 179 ft 6 in (54.71 m) | n/a | — |
| Waterline length | 114 ft 6 in (34.90 m) | n/a | — |
| Beam | 32 ft (9.8 m) | 31 ft 8 in (9.65 m) | +4 in |
| Draft | 13 ft (4.0 m) | 14 ft 0½ in (4.28 m) | −1 ft 0½ in |
| Displacement | 500 long tons (508 t) | 657 tons / 578 ⁷³⁄₉₄ bm | — |
| Height of rig | 130 ft (40 m) | — | — |
| Sail area | 13,000 ft² (1,200 m²) | — | — |
| Armament (props) | 28 × 9-pdr, non-operational | — | — |
| Propulsion | twin diesels, 300 hp each | — | — |

Sources: [Wikipedia, "HMS Surprise (replica ship)"](https://en.wikipedia.org/wiki/HMS_Surprise_(replica_ship)); [Maritime Museum of San Diego](https://sdmaritime.org/visit/the-ships/hms-surprise/) (LOA 179 ft, beam 32 ft, max draft 13 ft, GT 500, built 1970).

The film ship is roughly **7.5% longer on deck** than the real *Surprise* and is a British hull form, not a Forfait design. Modelling from film reference will give the wrong ship.

---

## 10. What I could NOT find

| Missing | Best substitute in this document | How to close the gap |
|---|---|---|
| Draught **forward** and **aft**, light and laden, as separate figures | §2, reconstructed from a 2 ft 6 in stern trim | Winfield 2008 p.225 in print may list fore/aft draughts; RMG plan ZAZ3067 carries the LWL |
| Freeboard amidships as a measured figure | §2, reconstructed from Steel's 6–7 ft frigate rule | ZAZ3067 |
| **All** deck heights and 'tween-deck heights for this ship | §3, from Steel's class tables | ZAZ3067 profile; Marquardt plans in Lavery & Hunt (2009) ch.5 pp.64–71 |
| Deck camber measured for this ship | §3, 5 in reconstructed from Steel | Marquardt plans |
| Sheer curve | Not attempted | ZAZ3067 — essential, and French sheer differs from British |
| Main-deck gunport size and spacing measured | §4, reconstructed | ZAZ3068 (Deck, Quarter & Forecastle plan) shows port positions directly |
| Bulwark and rail heights | §5, all reconstructed | Marquardt plans |
| Colledge & Warlow's entry for her | Not obtained | *Ships of the Royal Navy* (Chatham, rev. 2006) p.162 |
| Winfield's own wording | Only via threedecks and Wikipedia transcriptions | *British Warships in the Age of Sail 1793–1817* p.225 |
| Lavery & Hunt's text and the Marquardt plates | Not obtained — archive.org copy is lending-only and search-inside is blocked; the Ships of Scale forum threads are Cloudflare-gated | Borrow at [archive.org/details/frigatesurprisec0000lave](https://archive.org/details/frigatesurprisec0000lave) or buy the book |
| A canonical O'Brian complement figure | Film's 197 only | Read *HMS Surprise* ch.1–4 and *The Far Side of the World* directly |

### Two purchases that would close most of the gaps
1. **Lavery & Hunt, *The Frigate Surprise* (Conway/Norton, 2009), ISBN 978-0-393-07009-5.** 50+ plans by Karl Heinz Marquardt. This is the drawing set.
2. **RMG plan prints ZAZ3067 (Lines & Profile, 470 × 1350 mm) and ZAZ3068 (Deck, Quarter & Forecastle, 280 × 935 mm).** ZAZ3068 is sold as reference J5947, £31, reproduced same-size — [prints.rmg.co.uk](https://prints.rmg.co.uk/products/plan-of-hms-surprise-1796-deck-quarter-forecastle-j5947). Both signed by John Marshall, Master Shipwright at Plymouth 1795–1801, drawn 1798.

---

## 11. Quick-reference build sheet

```
HULL (measured, high confidence)
  Length on gundeck ............ 126 ft 0 in ........ 38.405 m
  Length of keel for tonnage ... 108 ft 6 1/8 in .... 33.075 m
  Breadth extreme .............. 31 ft 8 in ......... 9.652 m
  Depth in hold ................ 10 ft 0 1/2 in ..... 3.061 m
  Burthen ...................... 578 73/94 tons bm
  Displacement ................. 657 tons ........... 667.5 tonnes
  Length : breadth ratio ....... 3.98 : 1

HULL (reconstructed — verify against ZAZ3067 / Marquardt)
  Hull LOA (stem to taffrail) .. ~145-150 ft ........ 44.2-45.7 m
  Draught aft, laden ........... 14 ft 0 1/2 in ..... 4.280 m   [single-sourced]
  Draught fwd, laden ........... ~11 ft 6 in ........ 3.505 m   [RECONSTRUCTED]
  Upper deck above LWL ......... ~4 ft 6 in ......... 1.372 m   [RECONSTRUCTED]
  Port sills above LWL ......... ~6 ft 6 in ......... 1.981 m   [RECONSTRUCTED, Steel]
  Upper deck to QD beam ........ 6 ft 8 in .......... 2.032 m   [RECONSTRUCTED, Steel]
  Upper deck to Fc beam ........ 6 ft 6 in .......... 1.981 m   [RECONSTRUCTED, Steel]
  Upper deck camber ............ 5 in over 31'8" .... 0.127 m   [RECONSTRUCTED, Steel]
  Waist bulwark above deck ..... 4 ft 6 in .......... 1.372 m   [RECONSTRUCTED]
  QD/Fc bulwark above deck ..... 4 ft 4 in .......... 1.321 m   [RECONSTRUCTED]

GUNPORTS
  UD port, W x H ............... 2'6" x 2'4" ........ 0.762 x 0.711 m  [RECONSTRUCTED]
  UD port sill above deck ...... 2 ft 0 in .......... 0.610 m   [RECONSTRUCTED, Steel]
  UD port spacing, c/c ......... 8 ft 6 in .......... 2.591 m   [RECONSTRUCTED]
  UD ports per side ............ 12 (24 total)                 [SOURCED]
  QD/Fc gun port, W x H ........ 2'4" x 2'4" ........ 0.711 x 0.711 m  [SOURCED, Steel]
  QD/Fc gun port sill .......... 1 ft 8 in .......... 0.508 m   [SOURCED, Steel]
  Carronade port, width ........ 3 ft 4 in .......... 1.016 m   [SOURCED, Steel]
  Carronade port sill .......... 0 ft 11 in ......... 0.279 m   [SOURCED, Steel]
  Port lid thickness ........... 3 in ............... 0.076 m   [SOURCED, Steel]

ARMAMENT — pick one
  1796 recommended: UD 24 x 9pdr | QD 8 x 4pdr + 4 x 12pdr carr
                    Fc 2 x 4pdr + 2 x 12pdr carr .... 40 pieces, 164 lb broadside
  1798 as fitted:   UD 24 x 32pdr carr | QD 8 x 18pdr carr
                    Fc 2 x 18pdr carr + 2 x 4pdr .... 36 pieces, 478 lb broadside
  O'Brian (late):   UD 22 x 12pdr + 2 brass long 9pdr | 6 x 24pdr carr
  Film (2003):      22 x 9pdr gun deck | 2 carr Fc | 2 carr QD | 2 long 9 poop

COMPLEMENT
  RN borne 1796 ................ 200          [use this]
  RN establishment ............. 172 peace / 220 war
  French Unite at capture ...... 218
  Film ......................... 197
```
