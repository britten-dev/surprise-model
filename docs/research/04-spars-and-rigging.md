# HMS SURPRISE (ex-UNITE, 1794) — SPAR AND RIGGING DIMENSIONS

Research file for 3D modelling. Every number carries a source. Reconstructed values are
marked **[RECON]** and are never presented as fact.

Unit rule: 1 ft = 0.3048 m exactly. 1 in = 25.4 mm.

---

## 0. SOURCE STATUS — READ FIRST

| Source | Status |
|---|---|
| Marquardt's spar list for *Surprise* | **EXISTS BUT NOT ONLINE.** Karl Heinz Marquardt drew the reconstruction plans printed in Brian Lavery & Geoff Hunt, *The Frigate Surprise* (Conway/W.W. Norton, 2008/09). That book contains an appendix of "masts, yards and stores", "lists of spar dimensions as equipped the Surprise in 1802", and TWO Marquardt sail plans — one to the historical record and one with the mainmast of a 36-gun frigate as in O'Brian. No transcription of those tables is on the open web. Contents confirmed at [penguinrandomhouse.ca](https://www.penguinrandomhouse.ca/books/623669/the-frigate-surprise-by-geoff-aunt-and-brian-lavery/9780393070620) and [Ships of Scale book review](https://shipsofscale.com/sosforums/threads/book-review-the-frigate-surprise-by-brian-lavery-geoff-hunt.1961/). **Buy this book if you want the authoritative numbers.** |
| David Steel, *The Elements and Practice of Rigging and Seamanship*, London 1794 | **FULL SCANS OBTAINED AND READ.** Vol 1 [archive.org](https://archive.org/details/bim_eighteenth-century_the-elements-and-practic_steel-david_1794_1), Vol 2 [archive.org](https://archive.org/details/bim_eighteenth-century_the-elements-and-practic_steel-david_1794_2). Vol 1 p.50 carries the Royal Navy establishment table **"28 GUNS. 594 Tons."** — read directly off the page image. This is the primary basis of the table below. |
| David Steel, *The Elements and Practice of Naval Architecture* (1805; 1822 ed.) | **FULL SCAN OBTAINED AND READ.** [archive.org/details/elementspractice00stee](https://archive.org/details/elementspractice00stee). Folio "Centres of Masts" (leaves n525/n526) gives mast stations, rake per yard and bowsprit stive for a 28-gun frigate. |
| Contemporary masting draught for *Surprise* herself | **DOES NOT APPEAR TO SURVIVE.** RMG holds the hull draught only: [Unite (1796), body plan / sheer / half-breadth, July 1796, scale 1:48, signed J. Marshall, Master Shipwright, Plymouth](https://www.rmg.co.uk/collections/objects/rmgc-object-82972) — the catalogue entry explicitly covers hull only, no masts or spars. Also [Lines & Profile](https://www.rmg.co.uk/collections/objects/rmgc-object-82858) and [Deck, Quarter & Forecastle](https://www.rmg.co.uk/collections/objects/rmgc-object-82859). |
| threedecks.org | Page returns HTTP 403 to automated fetch; cached copy read locally. [threedecks.org id 6983](https://threedecks.org/index.php?display_type=show_ship&id=6983) — no spar data, hull/armament only. |

---

## 1. CONTROLLING SHIP DIMENSIONS (the inputs the spar rules need)

| Item | Imperial | Metric | Source |
|---|---|---|---|
| Tons burthen | 578 73/94 bm | — | [Wikipedia HMS Surprise (1796)](https://en.wikipedia.org/wiki/HMS_Surprise_(1796)) |
| Length on gundeck | 126 ft 0 in | 38.405 m | ibid. |
| Length of keel (for tonnage) | 108 ft 6 1/8 in | 33.073 m | ibid. |
| Beam, extreme | 31 ft 8 in | 9.652 m | ibid. |
| Depth in hold | 10 ft 0 in | 3.048 m | ibid. |
| Draught | 14 ft 0 1/2 in | 4.280 m | ibid. |
| Displacement | 657 tons | — | ibid. |
| Rig | Full-rigged ship (3 masts, square on all three) | | ibid.; [threedecks 6983](https://threedecks.org/index.php?display_type=show_ship&id=6983) "Ship Rigged" |

Note on rating: RMG records that the draught was taken at Plymouth "prior to fitting as a
**32-gun, Fifth Rate Frigate**" ([rmgc-object-82972](https://www.rmg.co.uk/collections/objects/rmgc-object-82972)),
though she was commissioned as a 28-gun Sixth Rate ([threedecks 6983](https://threedecks.org/index.php?display_type=show_ship&id=6983),
"Nominal Guns 28", source BWAS-1793). This matters — it means the 32-gun establishment is a
live alternative for her masting, not a fantasy.

### The mainmast controversy — critical for the modeller

- "She bore the **main-mast of a 36 gun ship**, just as unusual as her large armament. However,
  recent research by Brian Lavery suggests that this may have been at most a short-lived
  experiment on the part of Captain Hamilton."
  — [WikiPOBia, HMS Surprise (ship)](http://wiki.hmssurprise.org/phase3/index.php/HMS_Surprise_(ship))
  (site refused direct fetch; text captured via search index of that page).
- "A letter written by Hamilton in **May 1798** instructs the dockyard to **remove the mainmast
  and set up the existing foremast** (which would have been shorter) **in its place**, on the
  grounds that this would make the ship more 'stiff' or stable." — ibid.
- She fitted at Plymouth Dockyard January–May 1798 ([threedecks 6983 comment, Richard Wright,
  from Navy Board / Hamilton / Dockyard correspondence](https://threedecks.org/index.php?display_type=show_ship&id=6983)).
- **Build implication:** there are two legitimate rigs. (A) the 1796–98 tall rig with a 36-gun
  ship's mainmast; (B) the 1798–1802 reduced rig. Marquardt drew both (see §0). The film
  *Master and Commander* and the O'Brian novels use (A).

---

## 2. WHICH ESTABLISHMENT COLUMN APPLIES

Steel's Royal Navy table is by rate + tonnage, not by individual ship. *Surprise* at 578 73/94
tons and 28 nominal guns falls squarely on the **28 GUNS / 594 Tons** column. That column is the
Enterprise-class 28 (gundeck 120 ft 6 in, beam 33 ft 8 in), so it is a slightly *shorter and
beamier* ship than *Surprise* (126 ft 0 in x 31 ft 8 in) — a useful thing to know when scaling.

Cross-check with Steel's own masting rule:

> "The length of the lower deck and extreme breadth being added together, the half is the length
> of the main-mast."
> — Steel 1794 vol 1, p.39, "The following proportions for the heighth of masts are those by
> which ships at present are masted in the Royal Navy"
> [page image n56](https://archive.org/download/bim_eighteenth-century_the-elements-and-practic_steel-david_1794_1/page/n56.jpg)

Applied to *Surprise*: (126 ft 0 in + 31 ft 8 in) / 2 = **78 ft 10 in (24.028 m)** main mast.

| Candidate main mast | Length | Metric | Basis |
|---|---|---|---|
| Steel 28-gun / 594-ton establishment | 81 ft 4 in | 24.790 m | Steel 1794 v1 p.50, [n67](https://archive.org/download/bim_eighteenth-century_the-elements-and-practic_steel-david_1794_1/page/n67.jpg) |
| Steel's (LD + beam)/2 rule on *Surprise*'s own hull | 78 ft 10 in | 24.028 m | Steel 1794 v1 p.39, [n56](https://archive.org/download/bim_eighteenth-century_the-elements-and-practic_steel-david_1794_1/page/n56.jpg) |
| Steel 32-gun / 677-ton establishment (her intended rating) | 85 ft 0 in | 25.908 m | Steel 1794 v1 p.50, [n67](https://archive.org/download/bim_eighteenth-century_the-elements-and-practic_steel-david_1794_1/page/n67.jpg) |
| **36-gun / 871-ton establishment — the famous tall mainmast** | **89 ft 0 in** | **27.127 m** | Steel 1794 v1 p.50, [n67](https://archive.org/download/bim_eighteenth-century_the-elements-and-practic_steel-david_1794_1/page/n67.jpg); the "36-gun mainmast" claim from [WikiPOBia](http://wiki.hmssurprise.org/phase3/index.php/HMS_Surprise_(ship)) |

**Which I trust:** for a default build, the 28-gun / 594-ton column. It is the establishment for
her actual rate and tonnage, it is a directly-read primary printed source, and every internal
ratio checks out against Steel's own proportional rules (verified in §10). The (LD+beam)/2 rule
gives 78 ft 10 in — 3 % shorter — and is the honest lower bound; disagreement is only 2 ft 6 in
and is explained by *Surprise* being unusually narrow for her length. For an O'Brian / film build,
substitute the 36-gun mainmast group.

---

## 3. MASTER SPAR TABLE — Steel 1794, "28 GUNS. 594 Tons." (DEFAULT BUILD)

All figures read directly from the page image of Steel 1794 vol 1, p.50, *Dimensions of Masts and
Yards in the Royal Navy* —
[page image n67](https://archive.org/download/bim_eighteenth-century_the-elements-and-practic_steel-david_1794_1/page/n67.jpg).
Diameter is at the partners (masts) or at the slings (yards); the table header states diameters
are "Taken at the Partners; which are at the Middle-Deck in Three-Decked Ships, and at the
Upper-Deck in all other Ships."

### 3.1 Masts and booms

| Spar | Length (ft-in) | Length (m) | Max dia (in) | Max dia (mm) |
|---|---|---|---|---|
| Main mast | 81 ft 4 in | 24.790 | 23 5/8 | 600.1 |
| Main topmast | 48 ft 9 in | 14.859 | 14 3/8 | 365.1 |
| Main topgallant mast (incl. royal pole) | 24 ft 4 in | 7.417 | 8 | 203.2 |
| Main royal mast | none — 0 ft 0 in | — | 0 | — |
| Fore mast | 72 ft 0 in | 21.946 | 20 7/8 | 530.2 |
| Fore topmast | 43 ft 0 in | 13.106 | 14 3/8 | 365.1 |
| Fore topgallant mast (incl. royal pole) | 21 ft 6 in | 6.553 | 7 | 177.8 |
| Fore royal mast | none — 0 ft 0 in | — | 0 | — |
| Mizen mast | 69 ft 0 in | 21.031 | 16 3/4 | 425.4 |
| Mizen topmast | 36 ft 7 in | 11.151 | 10 | 254.0 |
| Mizen topgallant mast (incl. royal pole) | 18 ft 3 in | 5.563 | 6 | 152.4 |
| Mizen royal mast | none — 0 ft 0 in | — | 0 | — |
| **Bowsprit** (whole length) | 48 ft 9 in | 14.859 | 23 5/8 | 600.1 |
| **Jib boom** | 35 ft 0 in | 10.668 | 10 1/4 | 260.3 |
| Flying jib boom | **NOT LISTED** in the 1794 28-gun establishment | | | |
| **Driver (spanker) boom** | 52 ft 0 in | 15.850 | 9 3/4 | 247.6 |
| Lower studdingsail boom | 40 ft 0 in | 12.192 | 8 | 203.2 |
| Main topmast studdingsail boom | 36 ft 0 in | 10.973 | 7 1/8 | 181.0 |
| Main topgallant studdingsail boom | 26 ft 0 in | 7.925 | 5 1/4 | 133.4 |
| Fore topmast studdingsail boom | 31 ft 1 in | 9.474 | 6 1/8 | 155.6 |
| Fore topgallant studdingsail boom | 23 ft 0 in | 7.010 | 4 5/8 | 117.5 |
| Ensign staff | 30 ft 0 in | 9.144 | 5 1/4 | 133.4 |
| Jack staff | 14 ft 0 in | 4.267 | 3 3/8 | 85.7 |
| Fire boom | 26 ft 6 in | 8.077 | 8 | 203.2 |

**IMPORTANT — royals.** The 28-gun establishment gives **no separate royal masts** (all three
royal-mast cells read 0 ft 0 in) but **does give royal yards**. Royals were therefore set flying
on a long pole above the topgallant hounds. Model the topgallant mast as a single stick with a
long bare pole above the topgallant rigging stop. See §5 for pole length.

### 3.2 Yards and gaff

| Spar | Length (ft-in) | Length (m) | Max dia (in) | Max dia (mm) |
|---|---|---|---|---|
| Main yard | 71 ft 3 in | 21.717 | 16 1/2 | 419.1 |
| Main topsail yard | 52 ft 0 in | 15.850 | 11 | 279.4 |
| Main topgallant yard | 32 ft 6 in | 9.906 | 6 1/2 | 165.1 |
| Main royal yard | 26 ft 0 in | 7.925 | 5 1/2 | 139.7 |
| Fore yard | 62 ft 2 in | 18.948 | 14 1/2 | 368.3 |
| Fore topsail yard | 46 ft 0 in | 14.021 | 9 3/4 | 247.6 |
| Fore topgallant yard | 28 ft 6 in | 8.687 | 5 5/8 | 142.9 |
| Fore royal yard | 23 ft 0 in | 7.010 | 4 7/8 | 123.8 |
| **Mizen gaff** (printed under the heading "Gaff" on the Mizen line) | 32 ft 6 in | 9.906 | 9 3/4 | 247.6 |
| Mizen topsail yard | 35 ft 0 in | 10.668 | 7 1/4 | 184.1 |
| Mizen topgallant yard | 22 ft 0 in | 6.706 | 4 3/8 | 111.1 |
| Mizen royal yard | 17 ft 6 in | 5.334 | 3 5/8 | 92.1 |
| **Crossjack yard** | 46 ft 0 in | 14.021 | 9 3/4 | 247.6 |
| **Spritsail yard** | 46 ft 0 in | 14.021 | 9 3/4 | 247.6 |
| Sprit topsail yard | 28 ft 6 in | 8.687 | 5 5/8 | 142.9 |
| Driver yard | 28 ft 6 in | 8.687 | 5 5/8 | 142.9 |
| Lower studdingsail yard | 23 ft 0 in | 7.010 | 4 5/8 | 117.5 |
| Main topmast studdingsail yard | 20 ft 6 in | 6.248 | 4 | 101.6 |
| Main topgallant studdingsail yard | 15 ft 0 in | 4.572 | 3 | 76.2 |
| Fore topmast studdingsail yard | 17 ft 9 in | 5.410 | 3 1/2 | 88.9 |
| Fore topgallant studdingsail yard | 13 ft 3 in | 4.039 | 2 5/8 | 66.7 |

Note on the "Driver yard": the printed table gives the same 28 ft 6 in / 5 5/8 in on both the Jib
Boom line (= sprit topsail yard) and the Driver Boom line. Steel's rule text resolves it:
"Driver-yard, the same as the fore-topgallant-yard" and "Spritsail-topsail-yard, the same as the
fore-topgallant-yard" (Steel 1794 v1 p.40,
[n57](https://archive.org/download/bim_eighteenth-century_the-elements-and-practic_steel-david_1794_1/page/n57.jpg)).
Both are therefore genuinely 28 ft 6 in. A driver yard is a square-headed driver spar; if you rig
a modern gaff-headed spanker instead, omit it.

### 3.3 Bowsprit outboard length — **[RECON]**

Steel gives the **whole** bowsprit as 48 ft 9 in. He does not tabulate the housing (inboard part).

- Rule used: the bowsprit heel steps on the deck immediately abaft the bowsprit partners, just
  forward of the foremast; Steel's *Naval Architecture* describes the beam "that supports the step
  of the bowsprit" as the beam next before the foremast
  ([elementspractice00stee](https://archive.org/details/elementspractice00stee), Ch. on the upper deck).
- Foremast centre is 13 ft 6 in abaft the foremost perpendicular (§8). At a 21.9° steeve the
  slant distance from that station to the stem head is 13.5 / cos 21.9° = 14 ft 7 in, plus roughly
  1–2 ft for the run over the stem head and knightheads.
- **[RECON] Housing (inboard) ≈ 15 ft 0 in – 16 ft 0 in (4.57–4.88 m). Outboard from the
  knightheads ≈ 32 ft 9 in – 33 ft 9 in (9.98–10.29 m).** Use 33 ft 0 in (10.06 m) as the default.
- Jib boom 35 ft 0 in total; **[RECON]** housed on the bowsprit for about one third of its length,
  so **outboard beyond the bowsprit cap ≈ 23 ft 4 in (7.11 m)**. (Rule of thumb, not Steel.)
- **Flying jib boom: not in the 1794 28-gun establishment and probably not carried by *Surprise*.**
  Steel does give a rule — "Flying jib boom, [fraction illegible in the scan] of the bowsprit"
  (v1 p.40, [n57](https://archive.org/download/bim_eighteenth-century_the-elements-and-practic_steel-david_1794_1/page/n57.jpg)).
  If you want one for a post-1800 look, **[RECON] ≈ 29 ft 0 in (8.84 m)**, i.e. 5/6 of the jib boom.

---

## 4. ALTERNATIVE COLUMNS — the 36-gun mainmast rig and the 32-gun rig

Same page, same source: Steel 1794 v1 p.50
([n67](https://archive.org/download/bim_eighteenth-century_the-elements-and-practic_steel-david_1794_1/page/n67.jpg)).

| Spar | 36 GUNS / 871 Tons | 32 GUNS / 677 Tons |
|---|---|---|
| Main mast | 89 ft 0 in (27.127 m) x 26 in | 85 ft 0 in (25.908 m) x 24 3/4 in |
| Main topmast | 53 ft 4 in (16.256 m) x 15 3/4 in | 51 ft 0 in (15.545 m) x 15 1/8 in |
| Main topgallant | 25 ft 8 in (7.823 m) x 8 5/8 in | 25 ft 6 in (7.772 m) x 8 1/2 in |
| Main yard | 79 ft 0 in (24.079 m) x 18 5/8 in | 74 ft 4 in (22.657 m) x 17 1/8 in |
| Main topsail yard | 57 ft 0 in (17.374 m) x 12 in | 55 ft 0 in (16.764 m) x 11 3/8 in |
| Main topgallant yard | 34 ft 9 in (10.592 m) x 7 in | 33 ft 6 in (10.211 m) x 6 5/8 in |
| Main royal yard | 28 ft 0 in (8.534 m) x 6 in | 27 ft 0 in (8.230 m) x 5 5/8 in |
| Fore mast | 79 ft 6 in (24.232 m) x 23 3/4 in | 75 ft 0 in (22.860 m) x 22 in |
| Fore topmast | 47 ft 0 in (14.326 m) x 15 3/4 in | 45 ft 0 in (13.716 m) x 15 1/8 in |
| Fore topgallant | 22 ft 5 in (6.833 m) x 7 1/2 in | 22 ft 6 in (6.858 m) x 7 1/2 in |
| Fore yard | 69 ft 4 in (21.133 m) x 16 in | 65 ft 0 in (19.812 m) x 15 in |
| Fore topsail yard | 51 ft 9 in (15.773 m) x 11 in | 48 ft 0 in (14.630 m) x 10 in |
| Fore topgallant yard | 31 ft 6 in (9.601 m) x 6 3/8 in | 29 ft 6 in (8.992 m) x 5 7/8 in |
| Fore royal yard | 25 ft 0 in (7.620 m) x 5 1/2 in | 24 ft 0 in (7.315 m) x 5 in |
| Mizen mast | 74 ft 8 in (22.758 m) x 17 3/4 in | 72 ft 0 in (21.946 m) x 17 in |
| Mizen topmast | 40 ft 0 in (12.192 m) x 11 1/8 in | 38 ft 0 in (11.582 m) x 10 5/8 in |
| Mizen topgallant | 20 ft 0 in (6.096 m) x 6 1/2 in | 19 ft 0 in (5.791 m) x 6 1/4 in |
| Mizen gaff | 36 ft 0 in (10.973 m) x 11 in | 35 ft 0 in (10.668 m) x 10 in |
| Mizen topsail yard | 39 ft 4 in (11.989 m) x 7 7/8 in | 36 ft 9 in (11.201 m) x 7 in |
| Mizen topgallant yard | 27 ft 0 in (8.230 m) x 5 1/2 in | 24 ft 0 in (7.315 m) x 5 in |
| Mizen royal yard | 19 ft 0 in (5.791 m) x 3 7/8 in | 18 ft 0 in (5.486 m) x 3 1/2 in |
| Bowsprit | 54 ft 0 in (16.459 m) x 26 in | 52 ft 0 in (15.850 m) x 25 in |
| Jib boom | 38 ft 0 in (11.582 m) x 11 1/4 in | 36 ft 10 in (11.227 m) x 10 3/4 in |
| Driver boom | 57 ft 0 in (17.374 m) x 11 in | 55 ft 0 in (16.764 m) x 10 in |
| Crossjack yard | 51 ft 9 in (15.773 m) x 11 in | 48 ft 0 in (14.630 m) x 10 in |
| Spritsail yard | 51 ft 9 in (15.773 m) x 11 in | 48 ft 0 in (14.630 m) x 10 in |
| Sprit topsail yard | 31 ft 6 in (9.601 m) x 6 3/8 in | 29 ft 6 in (8.992 m) x 5 7/8 in |

### Recommended "O'Brian / film" variant

Take the §3 table and swap the **main group only** to the 36-gun column: main mast 89 ft 0 in,
main topmast 53 ft 4 in, main topgallant 25 ft 8 in, main yard 79 ft 0 in, main topsail yard
57 ft 0 in, main topgallant yard 34 ft 9 in, main royal yard 28 ft 0 in. That is exactly the
"mainmast of a 36-gun ship" the sources describe, and it reproduces the visually top-heavy,
over-sparred look. **Caution:** Lavery regards this as at most a short-lived experiment
([WikiPOBia](http://wiki.hmssurprise.org/phase3/index.php/HMS_Surprise_(ship))), and after
May 1798 the mainmast was replaced by the shorter existing foremast.

---

## 5. MAST HEADS, HOUNDS, DOUBLINGS AND POLES

Rules from Steel 1794 v1 p.42, the "LENGTHS OF" block under the fractional table —
[page image n59](https://archive.org/download/bim_eighteenth-century_the-elements-and-practic_steel-david_1794_1/page/n59.jpg):

- Head of the main and fore masts: **5 in per yard** of the mast's length.
- Head of the mizen mast, and of the main and fore topmasts: **4 in per yard**.
- Head of the mizen topmast and of all topgallant masts: **3 1/2 in per yard**.
- **Hounds of all lower masts: 7/15 of the length of the head.** Topmasts: 1/3 of the head.
- Cheeks: **3/7 of the length of the mast if oak, 9/20 if fir.**
- Long pole-heads to topgallant masts: **2/5 of the length of the stop** (the stop = whole length
  less the 3 1/2 in/yard head). Proper pole-heads: 3/15 of that length. Stump pole-heads:
  3 1/2 in per yard.

Computed for the §3 default build (arithmetic, from the rules above):

| Mast | Length | Head length (= doubling) | Hounds length | Cheek length (oak) |
|---|---|---|---|---|
| Main | 81 ft 4 in | 11 ft 3 5/8 in (3.443 m) | 5 ft 3 1/4 in | 34 ft 10 in |
| Fore | 72 ft 0 in | 10 ft 0 in (3.048 m) | 4 ft 8 in | 30 ft 10 in |
| Mizen | 69 ft 0 in | 7 ft 8 in (2.337 m) | 3 ft 6 7/8 in | 29 ft 7 in |
| Main topmast | 48 ft 9 in | 5 ft 5 in (1.651 m) | 1 ft 9 3/4 in (1/3 head) | — |
| Fore topmast | 43 ft 0 in | 4 ft 9 1/4 in (1.456 m) | 1 ft 7 1/8 in | — |
| Mizen topmast | 36 ft 7 in | 3 ft 6 3/4 in (1.084 m) | 1 ft 2 1/4 in | — |
| Main topgallant | 24 ft 4 in | 2 ft 4 3/8 in (0.721 m) | — | — |
| Fore topgallant | 21 ft 6 in | 2 ft 1 1/8 in (0.637 m) | — | — |
| Mizen topgallant | 18 ft 3 in | 1 ft 9 1/4 in (0.541 m) | — | — |

**Doubling length = head length.** The topmast heel is fidded on the trestletrees, which sit at
the bottom of the lower masthead. So the topmast overlaps the lower mast by exactly the lower
masthead length (11 ft 3 5/8 in at the main).

**Royal poles** (there being no separate royal masts). Main topgallant: stop length =
24 ft 4 in − 2 ft 4 3/8 in = 21 ft 11 5/8 in; **long pole-head = 2/5 x that = 8 ft 9 7/8 in
(2.690 m)** above the topgallant hounds. Fore: 21 ft 6 in − 2 ft 1 1/8 in = 19 ft 4 7/8 in; long
pole = **7 ft 9 1/8 in (2.365 m)**. Mizen: 18 ft 3 in − 1 ft 9 1/4 in = 16 ft 5 3/4 in; long pole
= **6 ft 7 1/8 in (2.010 m)**. Steel is ambiguous whether the tabulated topgallant length already
includes the pole; the internal check that the topgallant mast is exactly half its topmast
suggests **it does**, and the pole is measured down from the truck. **Flagged as ambiguous.**

---

## 6. SPAR TAPER — the fractional table (make this parametric)

From Steel 1794 v1 p.42, "A FRACTIONAL TABLE OF THE PROPORTION THAT EVERY PART OF A MAST OR YARD
BEARS TOWARD THE GIVEN DIAMETER IN THE TABLES OF DIMENSIONS" —
[page image n59](https://archive.org/download/bim_eighteenth-century_the-elements-and-practic_steel-david_1794_1/page/n59.jpg).
Multiply the tabulated max diameter by these fractions. Quarters are measured from the partners
(masts) or the slings (yards) toward the head/arm.

| Spar type | 1st qtr | 2nd qtr | 3rd qtr | Head, lower part | Head, upper part | Heel |
|---|---|---|---|---|---|---|
| Standing masts that are checked — fore and aft | 60/61 | 14/15 | 6/7 | 3/4 | 2/3 | 6/7 |
| Standing masts that are checked — athwartships | 60/61 | 14/15 | 6/7 | 6/7 | 2/3 | 6/7 |
| Standing masts that head themselves | 60/61 | 14/15 | 6/7 | 3/4 | 5/8 | 6/7 |
| Topmasts, topgallant masts and royal masts | 60/61 | 14/15 | 6/7 | 9/13 | 6/11 | — |
| Mizen yard, lower arm | 60/61 | 11/12 | 3/6 | arms 2/3 | — | — |
| Mizen yard, upper arm | 30/31 | 7/8 | 7/10 | arms 2/5 | — | — |
| **Yards in general** | **30/31** | **7/8** | **7/10** | **arms 3/7** | — | — |
| **Bowsprit** | **60/61** | **11/12** | **4/5** | ends 5/9 | outer end — | heel 6/7 |
| Driver booms | 40/41 | 11/12 | 5/6 | ends 2/3 | — | — |
| Main booms | 40/41 | 12/13 | 7/8 | fore end 2/3 | aft end 3/4 | middle 11/12 |
| Gaffs | 40/41 | 11/12 | 4/5 | fore end 5/9 | — | — |
| Heeling — standing masts | 2/3 athwartship | — | — | — | 1/2 fore & aft | — |
| Heeling — bowsprits | 7/12 athwartship | — | — | 2/3 up and down | — | — |

Steel's own worked example (same page): a 74's main mast is 37 in at the partners; the first
quarter is 60/61 of that = 36 1/4 in; second quarter 34 1/2; third quarter 31 1/2; head 27 3/4;
upper part of head 23 1/2.

Worked for *Surprise*'s main mast (23 5/8 in at the partners): 1st qtr **23.24 in**, 2nd qtr
**22.05 in**, 3rd qtr **20.25 in**, head lower **17.72 in** (fore-and-aft) / **20.25 in**
(athwartships), head upper **15.75 in**, heel **20.25 in**.
Main yard (16 1/2 in at slings): 1st qtr **15.97 in**, 2nd **14.44 in**, 3rd **11.55 in**,
arms **7.07 in**.

---

## 7. TOPS, TRESTLETREES, CROSSTREES, CAPS

### 7.1 Tops
Rule, Steel 1794 v1 p.37 —
[page image n54](https://archive.org/download/bim_eighteenth-century_the-elements-and-practic_steel-david_1794_1/page/n54.jpg):

> "TOPS. The dimensions of tops are, their breadths athwartships, **one-third the length of their
> topmasts**; their length fore and aft, **three-fourths the breadth**; and the square hole
> athwartships **two-fifths the breadth of the top**; and fore and aft **thirteen-fourteenths the
> breadth**; and the aftside of the hole **one-fifth the length of the top**, from the aftside of
> the platform, and placed in the middle athwartships."

Platform thickness: "of three inch deals, down to a third-rate ship, of two inches and a half to a
fourth and fifth rate, and **of two inches for all under**" — *Surprise* is a sixth rate, so
**2 in (50.8 mm) deals**. Elm rim: **1 in thick in small ships, 7–8 in broad** (mizen tops of
small ships only 6 in), overhanging the edge **3 1/2 in in small ships**, only **3 in on mizen
tops of small ships**.

| Top | Breadth athwartships | Length fore & aft | Square hole athwartships | Square hole fore & aft |
|---|---|---|---|---|
| **Main** | 16 ft 3 in (4.953 m) | 12 ft 2 1/4 in (3.715 m) | 6 ft 6 in (1.981 m) | 6 ft 0 3/8 in (1.839 m) |
| **Fore** | 14 ft 4 in (4.369 m) | 10 ft 9 in (3.277 m) | 5 ft 8 7/8 in (1.748 m) | 5 ft 4 in (1.623 m) |
| **Mizen** | 12 ft 2 1/4 in (3.717 m) | 9 ft 1 3/4 in (2.788 m) | 4 ft 10 1/2 in (1.487 m) | 4 ft 6 3/8 in (1.381 m) |

Reading note: "fore and aft thirteen-fourteenths the breadth" is taken as 13/14 of the **hole's**
athwartship dimension, not of the top's breadth — the alternative reading gives a hole longer than
the whole top and is impossible. Flagged.

### 7.2 Trestletrees
Rule, Steel 1794 v1 p.24–25: "In length, they are **one-fourth the length of the top-mast**; in
depth, **half the given diameter of the mast**; and in thickness, **two-thirds of the depth**."
The longest snapes go at the **foremost** ends of the main trestletrees and the **after** ends of
the foremast trestletrees.

| | Length | Depth | Thickness |
|---|---|---|---|
| Main | 12 ft 2 1/4 in (3.715 m) | 11 13/16 in (300 mm) | 7 7/8 in (200 mm) |
| Fore | 10 ft 9 in (3.277 m) | 10 7/16 in (265 mm) | 6 15/16 in (177 mm) |
| Mizen | 9 ft 1 3/4 in (2.788 m) | 8 3/8 in (213 mm) | 5 9/16 in (142 mm) |

### 7.3 Crosstrees
Rule, ibid.: "In length, they are **one-third the length of the topmast, deducting six inches**;
the breadth **as much as the trestletrees are thick**; and the depth **two-thirds the breadth**."
Framing: the aftside of the foremost crosstree stands the depth of the masthead (fore-and-aft)
from the middle of the trestletrees; the foreside of the after crosstree stands twice the depth of
the masthead abaft the middle of the trestletrees.

| | Length | Breadth | Depth |
|---|---|---|---|
| Main | 15 ft 9 in (4.801 m) | 7 7/8 in | 5 1/4 in |
| Fore | 13 ft 10 in (4.216 m) | 6 15/16 in | 4 5/8 in |
| Mizen | 11 ft 8 1/4 in (3.564 m) | 5 9/16 in | 3 3/4 in |

### 7.4 Caps
Rule, Steel 1794 v1 p.25–26: main cap length **4 x the diameter of the topmast + 3 in**, breadth
**2 x that diameter + 2 in**, depth **4/9 of the breadth**. Fore cap: **4 x dia + 2 in**, breadth
**2 x dia + 1 in**, depth 4/9 breadth. Mizen cap: **4 x dia + 1 in**, breadth **2 x dia**, depth
4/9 breadth. The round (forward) hole is swept **3/4 in larger than the topmast diameter** to
allow for leathering; the square (after) hole takes the lower masthead tenon.

| Cap | Length | Breadth | Depth | Round hole dia |
|---|---|---|---|---|
| Main | 5 ft 0 1/2 in (1.537 m) | 2 ft 6 3/4 in (0.781 m) | 13 5/8 in (347 mm) | 15 1/8 in |
| Fore | 4 ft 11 1/2 in (1.511 m) | 2 ft 5 3/4 in (0.756 m) | 13 1/4 in (336 mm) | 15 1/8 in |
| Mizen | 3 ft 5 in (1.041 m) | 1 ft 8 in (0.508 m) | 8 7/8 in (226 mm) | 10 3/4 in |

Four large eyebolts (1 3/4 – 1 7/8 in dia) are driven up through each cap: one each side of the
square hole near the after edge, one each side of the round hole forward.

---

## 8. MAST POSITIONS, RAKE, AND BOWSPRIT STEEVE

Source: David Steel, *The Elements and Practice of Naval Architecture*, folio "CENTRES OF MASTS",
read from the page images —
[left page n525](https://archive.org/download/elementspractice00stee/page/n525.jpg) (110 → 32 guns)
and [right page n526](https://archive.org/download/elementspractice00stee/page/n526.jpg)
(28 guns, 24 guns and smaller craft). Rake is given as inches of aft-lean **per yard of mast
length** — convert with angle = atan(inches / 36).

| | 28-gun frigate | 32-gun frigate | 36-gun frigate |
|---|---|---|---|
| Foremast centre, abaft the foremost perpendicular | 13 ft 6 in (4.115 m) | 14 ft 9 in (4.496 m) | 15 ft 10 in (4.826 m) |
| Foremast rake aft, per yard | 1/16 in | 1/16 in | 1/16 in |
| **Foremast rake, degrees** | **0.10°** | **0.10°** | **0.10°** |
| Mainmast centre, abaft the foremost perpendicular | 68 ft 3 in (20.803 m) | 73 ft 9 in (22.479 m) | 77 ft 0 in (23.470 m) |
| Mainmast rake aft, per yard | 5/8 in | 5/8 in | 5/8 in |
| **Mainmast rake, degrees** | **0.99°** | **0.99°** | **0.99°** |
| Mizen mast centre, afore the after perpendicular | 17 ft 3 in (5.258 m) | 19 ft 0 in (5.791 m) | 20 ft 9 in (6.325 m) |
| Mizen rake aft, per yard | 1 in | 1 in | 1 in |
| **Mizen rake, degrees** | **1.59°** | **1.59°** | **1.59°** |
| Bowsprit stive upwards, per yard of length | 1 ft 2 1/2 in | 1 ft 3 in | 1 ft 3 in |
| **Bowsprit steeve, degrees** | **21.9°** | **22.6°** | **22.6°** |

**These rakes are small. That is correct and deliberate** — late-18th-century Royal Navy masts
were much more upright than merchant or earlier practice. Do not "correct" them upward. The masts
fan: fore essentially plumb, main ~1°, mizen ~1.6° — each raking more than the one before it.

### Scaling to *Surprise*'s 126 ft gundeck — **[RECON]**

The 28-gun column belongs to a 120 ft 6 in gundeck ship. Expressed as fractions of gundeck length
(= length between perpendiculars):

| Mast | Fraction of gundeck length, from the fore perpendicular | Scaled onto *Surprise*, 126 ft 0 in |
|---|---|---|
| Fore | 0.1120 | 14 ft 1 1/2 in (4.303 m) abaft fore perp |
| Main | 0.5664 | 71 ft 4 1/2 in (21.752 m) abaft fore perp |
| Mizen | 0.8568 | 107 ft 11 1/2 in (32.903 m) abaft fore perp, i.e. 18 ft 0 1/2 in (5.499 m) afore the after perp |

**Two options, state which you use.** (a) Take the raw establishment figures (13 ft 6 in /
68 ft 3 in / 17 ft 3 in), which suits a modeller reproducing an Admiralty masting warrant.
(b) Take the scaled figures above, which suits a hull of *Surprise*'s actual length. I mildly
prefer (b) because *Surprise* is 5 ft 6 in longer on the gundeck than the establishment ship and
option (a) would crowd her masts noticeably forward of proportion. Both are within 3 ft.

Also useful: the chestree, for hauling home the main tack, is placed **half the length of the main
yard before the centre of the mainmast** (Steel, *Naval Architecture*, on drawing the sheer
draught, [elementspractice00stee](https://archive.org/details/elementspractice00stee)) — i.e.
35 ft 7 1/2 in (10.858 m) forward of the mainmast centre.

---

## 9. MASTHEAD HEIGHTS ABOVE THE WATERLINE — **[RECON]**

No source gives these directly for *Surprise*. Reconstructed as follows.

Assumptions, stated so they can be changed:
1. Fore, main **and mizen** all step on the keelson. (Internal consistency check: if the mizen
   stepped on the lower deck its head would come out level with the main's, which is impossible,
   so keelson-stepped is the only reading that works.)
2. Top of keelson stands ~3 ft 0 in above the underside of the keel (keel ~1 ft 2 in + floors
   ~11 in + keelson ~11 in — ordinary sixth-rate scantlings from Steel's *Naval Architecture*
   folios, [elementspractice00stee](https://archive.org/details/elementspractice00stee)).
3. Draught 14 ft 0 1/2 in ([Wikipedia](https://en.wikipedia.org/wiki/HMS_Surprise_(1796))), so the
   load waterline is 14 ft 0 1/2 in above the underside of the keel.
4. **Therefore every mast heel sits 11 ft 0 in (3.353 m) below the LWL.**
5. Mast lengths in Steel are heel-to-top-of-head; topmast heel is fidded at the bottom of the
   lower masthead; topgallant heel at the bottom of the topmast head.

| Point | Height above LWL (ft-in) | Metric |
|---|---|---|
| Main top platform / bottom of main masthead | 59 ft 0 1/2 in | 17.993 m |
| Top of main lower masthead | 70 ft 4 in | 21.438 m |
| Top of main topmast head (main topmast crosstrees) | 107 ft 9 1/2 in | 32.852 m |
| **Main truck** | **126 ft 8 1/2 in** | **38.618 m** |
| Fore top platform / bottom of fore masthead | 51 ft 0 in | 15.545 m |
| Top of fore lower masthead | 61 ft 0 in | 18.593 m |
| Top of fore topmast head | 94 ft 0 in | 28.651 m |
| **Fore truck** | **110 ft 8 3/4 in** | **33.749 m** |
| Mizen top platform / bottom of mizen masthead | 50 ft 4 in | 15.342 m |
| Top of mizen lower masthead | 58 ft 0 in | 17.678 m |
| Top of mizen topmast head | 86 ft 11 in | 26.492 m |
| **Mizen truck** | **101 ft 7 1/4 in** | **30.970 m** |

**Sanity check that this reconstruction is sound:** the *Surprise* replica (the ex-*Rose*, now at
the San Diego Maritime Museum) has a published rig height of **130 ft (40 m)** with 13,000 sq ft
(1,200 m²) of sail on a 179 ft 6 in sparred length
([Wikipedia, HMS Surprise (replica ship)](https://en.wikipedia.org/wiki/HMS_Surprise_(replica_ship))).
Our reconstructed main truck of 126 ft 8 in lands within 3 % of that. Note the replica is a
*Rose*-derived Bolger design, not a *Surprise* reconstruction, so this is a plausibility check
only, not a source.

---

## 10. PARAMETRIC RULE SET (for a generator)

Steel's stated proportions, with the ratio each actually produces in the 28-gun/594-ton column
alongside. Where the printed vulgar fraction is physically damaged in the archive.org scan I give
the empirical ratio from the table itself and say so. Rules from Steel 1794 v1 pp.39–40,
[n56](https://archive.org/download/bim_eighteenth-century_the-elements-and-practic_steel-david_1794_1/page/n56.jpg)
and [n57](https://archive.org/download/bim_eighteenth-century_the-elements-and-practic_steel-david_1794_1/page/n57.jpg).

### Mast lengths
| Rule | Stated | Table ratio (28-gun) | Verdict |
|---|---|---|---|
| Main mast | (lower deck length + extreme breadth) / 2 | — | Steel's own worked example: 74-gun, LD 176 ft + beam 48 ft 8 in = 224 ft 8 in, half = 112 ft 4 in. Exact. |
| Fore mast | 8/9 of main | 72.000 / 81.333 = **0.8852** | matches 8/9 = 0.8889 |
| Mizen mast | 6/7 of main (printed fraction damaged) | 69.000 / 81.333 = **0.8484** | use **0.848** empirically |
| Main topmast | 3/5 of main | 48.750 / 81.333 = **0.5994** | **exactly 3/5** |
| Fore topmast | 8/9 of main topmast | 43.000 / 48.750 = **0.8821** | matches 8/9 |
| Mizen topmast | 3/4 of main topmast | 36.583 / 48.750 = **0.7504** | **exactly 3/4** |
| Topgallant mast (each) | 1/2 of its topmast | 24.333/48.750, 21.500/43.000, 18.250/36.583 = **0.499, 0.500, 0.499** | **exactly 1/2** |
| Bowsprit (74 guns and under) | 3/5 of main mast | 48.750 / 81.333 = **0.5994** | **exactly 3/5** |
| Bowsprit (80 guns and upwards) | 7/11 of main mast | — | not applicable here |

### Mast diameters (at the partners)
| Rule | Stated | Check |
|---|---|---|
| Main/fore, 100–64 guns | 1 in per yard of length | — |
| Main/fore, **28 guns and under** | **7/8 in per yard** | 23.625 / (81.333/3) = **0.8714 in/yd** ✔ |
| Mizen mast, 90 guns and under | fraction of main mast dia | 16.75 / 23.625 = **0.709** (≈ 5/7) |
| **Main and fore topmasts** | 1 in per yard of the length of the **fore topmast** — both get the SAME diameter | fore topmast 43 ft = 14.33 yd → 14 3/8 in ✔ for both |
| Mizen topmast | fraction of main topmast dia | 10 / 14.375 = **0.696** (≈ 7/10) |
| Topgallant masts | 1 in per yard of their own length | main tg 24 ft 4 in = 8.11 yd → 8 in ✔ exact |

### Yard lengths
| Rule | Stated | Table ratio | Verdict |
|---|---|---|---|
| Main yard | 7/8 of main mast | 71.250 / 81.333 = **0.8760** | matches 7/8 = 0.875 |
| Fore yard | 7/8 of main yard | 62.167 / 71.250 = **0.8725** | matches 7/8 |
| Main topsail yard | fraction of main yard (print damaged) | 52.000 / 71.250 = **0.7298** | use **0.730** |
| Fore topsail yard | 8/9 of main topsail yard | 46.000 / 52.000 = **0.8846** | matches 8/9 |
| Mizen topsail yard | 2/3 of main topsail yard | 35.000 / 52.000 = **0.6731** | matches 2/3 |
| Topgallant yards, **ships under 74** | **5/8 of their topsail yards** | 32.5/52, 28.5/46, 22/35 = **0.625, 0.620, 0.629** | **exactly 5/8** |
| Topgallant yards, 74-gun ships | 2/3 of their topsail yards | — | not applicable |
| **Royal yards** | **1/2 of the topsail yards** | 26/52, 23/46, 17.5/35 = **0.500, 0.500, 0.500** | **exactly 1/2** |
| **Crossjack yard** | same as the fore topsail yard | both 46 ft 0 in | **exact** |
| **Spritsail yard** | same as the fore topsail yard | both 46 ft 0 in | **exact** |
| **Sprit topsail yard** | same as the fore topgallant yard | both 28 ft 6 in | **exact** |
| **Driver yard** | same as the fore topgallant yard | both 28 ft 6 in | **exact** |
| **Driver boom** | **same length as the main topsail yard** | both 52 ft 0 in | **exact** |
| Gaff | 2/3 of its boom | 32.500 / 52.000 = **0.625** | table gives 5/8, rule says 2/3; **trust the table** |
| Lower studdingsail booms | fraction of main yard | 40.000 / 71.250 = **0.561** | ≈ 5/9 |
| Top studdingsail booms | fraction of the yard they go on | 36/52 = **0.692**, 31.08/46 = **0.676** | ≈ 2/3 |
| Studdingsail yards | fraction of their booms | 23/40 = **0.575**, 20.5/36 = **0.569** | ≈ 4/7 |
| Ensign staff | fraction of main mast, above the taffrail | 30 / 81.333 = **0.369** | ≈ 3/8 |
| Jack staff | fraction of the ensign staff | 14 / 30 = **0.467** | ≈ 1/2 |

### Yard diameters (at the slings)
| Rule | Check against the table |
|---|---|
| Main and fore yards: **7/10 in per yard of length** | 16.5 / 23.75 = **0.695** ✔ |
| Topsail yards: **5/8 in per yard of length** | 11 / 17.33 = **0.635** ✔ |
| Topgallant yards: **6/10 in per yard of length** | 6.5 / 10.83 = **0.600** ✔ exact |
| Royal yards: **1/2 the diameter of their topsail yards** | 5.5 / 11 = **0.500** ✔ exact |
| Spritsail yard: same diameter as the fore topsail yard | both 9 3/4 in ✔ |
| Crossjack yard: same diameter as the fore topsail yard | both 9 3/4 in ✔ |
| Mizen yard: fraction of main yard diameter | 9.75 / 16.5 = **0.591** |
| Studdingsail yards: **1 in per 5 ft of length** | 4.625 / (23/5) = **1.005** ✔ |

---

## 11. STANDING RIGGING

Two independent Steel sources are used here, both primary.

### 11.1 Numbers, from the rigging warrant for exactly this class

Steel 1794, **vol 2**, "A SHIP OF 28 GUNS, Being of 594 Tons Burthen" — the complete standing and
running rigging schedule.
[archive.org/details/bim_eighteenth-century_the-elements-and-practic_steel-david_1794_2](https://archive.org/details/bim_eighteenth-century_the-elements-and-practic_steel-david_1794_2)
(read from the OCR text layer of that item; the class heading is unambiguous and the lanyard
counts corroborate every shroud count).

| Position | Shrouds | Per side | Corroboration in the same table |
|---|---|---|---|
| **Fore lower** | 7 pair | **7** | "Lanyards fine, 14"; eye seizings 14; end seizings 14 |
| **Main lower** | 7 pair | **7** | "Throat [seizings], 14" |
| **Mizen lower** | 5 pair | **5** | "Dead Eyes 8" (i.e. 8 in dia) and 10 lanyards |
| **Fore topmast** | 4 pair | **4** | "Lanyards fine, 8" |
| **Main topmast** | 4 pair | **4** | listed "Shrouds, fine, 4 Pair" |
| **Mizen topmast** | 3 pair | **3** | listed "Shrouds, fine, 3 Pair" |
| **Fore topgallant** | 3 pair | **3** | |
| **Main topgallant** | 3 pair | **3** | "Lanyards, 6" |
| **Mizen topgallant** | 2 pair | **2** | listed "Shrouds, 2 Pair" |
| **Fore futtock shrouds** | 4 pair | **4** | |
| **Main futtock shrouds** | 4 pair | **4** | "Futtock Shrouds, fine, 4 Pair" |
| **Mizen futtock shrouds** | 3 pair | **3** | "Futtock Shrouds, fine, 3 Pair" |
| **Bowsprit shrouds** | 1 pair | **1 each side** | set up with hearts |
| **Bobstays** | 2 pair | **2** | cabled, set up with hearts; 2 collars, 2 lanyards |
| Fore/main/mizen topmast standing backstays | 2 pair each (mizen 1 pair) | 2 / 2 / 1 | |
| Fore/main topmast shifting backstays | 1 pair each | 1 | |
| Fore/main topgallant standing backstays | 2 pair each | 2 | |
| Mizen topgallant backstay | 1 pair | 1 | |
| Topmast breast backstays | 1 each side, fore and main | 1 | fitted with a single block and runner |

Note the odd lower-shroud count (7 per side). Steel's fitting practice: shrouds go over the
masthead in pairs, alternating starboard-forward then larboard-forward, so with 7 per side the
aftermost on one side is a single — Steel calls the extra pair over the top of the shrouds
**swifters** ("SWIFTERS are swayed over the mast-head, next above the shrouds").

### 11.2 The complete standing rigging inventory

Steel prints a keyed plate, "EXPLANATION OF THE REFERENCES ON THE PLATE DELINEATING THE STANDING
RIGGING OF A TWENTY GUN SHIP" (Steel 1794 v1, pp. ~207–208, same item as above). A 20-gun ship is
the nearest published full plate to *Surprise*'s rig and every item on it applies. The full list,
which is your build checklist:

1 Gammoning · 2 Bobstays · 3 Bowsprit shrouds · 4 Fore tackle pendents · 5 Main tackle pendents ·
6 Mizen burton pendents · 7 Fore shrouds · 8 Main shrouds · 9 Mizen shrouds · 10 Fore preventer
stay · 11 Fore stay · 12 Main preventer stay · 13 Main stay · 14 Mizen stay · 15 Fore topmast
burton pendents · 16 Main topmast burton pendents · 17 Fore topmast shrouds · 18 Main topmast
shrouds · 19 Mizen topmast shrouds · 20 Fore topmast breast backstay · 21 Fore topmast standing
backstay · 22 Fore topmast shifting backstay · 23 Main topmast breast backstay · 24 Main topmast
standing backstay · 25 Main topmast shifting backstay · 26 Mizen topmast standing backstay ·
27 Mizen topmast shifting backstay · 28 Fore topmast preventer stay · 29 Fore topmast stay ·
30 Main topmast preventer stay · 31 Main topmast stay · 32 Mizen topmast stay · 33 Fore topgallant
shrouds · 34 Main topgallant shrouds · 35 Mizen topgallant shrouds · 36 Fore topgallant standing
backstays · 37 Main topgallant standing backstays · 38 Mizen topgallant standing backstay ·
39 Fore topgallant stay · 40 Main topgallant stay · 41 Mizen topgallant stay · **42 Martingale
stay** · 43 Bowsprit horse · 44 Fore stay tackle · 45 Main stay tackle · 46 Main stay tackle
pendent · 47 Fore futtock shrouds · 48 Main futtock shrouds · 49 Mizen futtock shrouds · 50 Stay
tackle tricing lines.

Steel's own caveat on that plate: "the shrouds and backstays are represented only on the starboard
side; but it must be remembered, that an equal number of them belong to the larboard side." And:
"**In ships, from twenty guns downwards, the preventer stays are sometimes [set] under the stays;
and to them the staysails are bent.**"

Item 42 confirms a **martingale stay** (dolphin striker) was standard by 1794 — include it.

### 11.3 Stay anchor points (Steel's rigging practice, v1)
- **Fore stay and fore preventer stay**: from the fore masthead down to the bowsprit; set up with
  hearts and lanyards at the bowsprit.
- **Main stay and main preventer stay**: from the main masthead forward to the deck/stem area
  through a collar; the main stay collar is "cabled 4 strands fine, double".
- **Mizen stay**: from the mizen masthead forward to the mainmast — Steel's table for this class
  lists a "Span abaft the Main Mast" for the mizen stay, i.e. it is set up to a span round the
  mainmast, not to the deck.
- **Fore topmast stay and preventer stay**: to the bowsprit end / jib boom.
- **Main topmast stay**: to the fore masthead. **Mizen topmast stay**: to the main masthead.
- **Topgallant stays**: fore topgallant stay to the jib boom end; main topgallant stay to the fore
  topmast head; mizen topgallant stay to the main topmast head.
- **Bobstays** (2 pair) from the bowsprit down to the stem below the figurehead; **bowsprit
  shrouds** (1 pair) hook to an eyebolt on each side of the bow — "SHROUDS hook to an eye-bolt on
  each side the bow; the fore-mast end has an heart, or dead-eye".
- **Backstay stools**: "STOOLS. Small channels, fixed to the ship's sides, to contain the dead-eyes
  for the backstays" (Steel 1794 v1, alphabetical explanation).

### 11.4 Ratlines — exact period figures
Steel 1794 v1, "Progressive Method of Rigging Ships", pp.198–199
([item](https://archive.org/details/bim_eighteenth-century_the-elements-and-practic_steel-david_1794_1)):

> "RATLINGS are fastened horizontally to the shrouds, at regular distances, from the futtock-staff
> downwards... The first ratling to be **thirteen inches** below the futtock-staff on the lower
> shrouds. The ratlings are fastened round each shroud with a clove-hitch, except at the ends,
> which have an eye spliced in and seized round the shroud. **Each ratling is placed thirteen
> inches asunder.** The **fore and aftermost shroud are left out for the first six ratlings down
> from the futtock-staff; and likewise the six lower ratlings next the dead eyes.** The
> topmast-shrouds are rattled in the same manner; the first ratling thirteen inches below the
> futtock-staff, and rattled throughout."

- **Ratline spacing: 13 in (330.2 mm), uniform.** Not 14, not 15. This is the figure.
- Additionally, "small spars or boat-oars are seized to the shrouds, **about five feet asunder**,
  for the men to stand upon" — i.e. a stiffened ratline every ~5 ft (1.524 m), roughly every
  4th–5th ratline. Worth modelling as slightly heavier bars.
- **Futtock staves**: "joined along the lower shrouds horizontally, **as much below the upperside
  of the trestletrees as the cap is above**." For the main: cap depth 13 5/8 in, so the futtock
  stave sits ~13 5/8 in (346 mm) below the top of the trestletrees.
- **Catharpins**: legs seized at each end round the futtock stave and shroud, drawing the lower
  shrouds in.
- **Deadeye lanyards** reeve after-hole to after-hole, then second hole, then third; upper deadeye
  end stopped with a wall knot.
- **Futtock shrouds** hook by iron hooks to futtock plates that pass up through mortises in the
  edge of the top, and are seized at their lower ends round the futtock stave.

---

## 12. RUNNING RIGGING — what is visible at model scale, and where it leads

The complete inventory, again from Steel's keyed plate: "EXPLANATION OF THE REFERENCES ON THE PLATE
DELINEATING THE RUNNING RIGGING OF A TWENTY GUN SHIP" (Steel 1794 v1, p.209,
[item](https://archive.org/details/bim_eighteenth-century_the-elements-and-practic_steel-david_1794_1)),
with leads added from Steel's rigging chapters and from the 28-gun/594-ton warrant in vol 2.

### 12.1 Braces (the most visible ropes on a model)
| Brace | Pendent from | Leads to |
|---|---|---|
| Fore braces | fore yardarms | aft to blocks on the **main stay / main stay collar**, then down to the deck at the mainmast |
| Main braces | main yardarms | **aft** to blocks on the quarter / mizen channels, then in to the deck |
| Crossjack braces | crossjack yardarms | **forward** to the main shrouds/mast |
| Fore topsail braces | fore topsail yardarms | aft to the **main topmast stay** area, then down |
| Main topsail braces | main topsail yardarms | aft to the **mizen topmast head / mizen stay**, then down |
| Mizen topsail braces | mizen topsail yardarms | forward to the **main topmast** |
| Fore topgallant braces | fore tg yardarms | aft to the main topgallant stay, then down |
| Main topgallant braces | main tg yardarms | aft to the mizen topmast head |
| Mizen topgallant braces | mizen tg yardarms | forward to the main topgallant |
| Spritsail braces | spritsail yardarms | **aft to the fore stay**, then down to the forecastle |
| Sprit topsail braces | sprit topsail yardarms | aft to the bowsprit / fore stay |

### 12.2 Lifts
Fore, main lifts and crossjack lifts run from the yardarms up to blocks at the lower masthead
(under the cap) and down to the deck. Topsail lifts run from the topsail yardarms to the topmast
cap. Topgallant lifts from the tg yardarms to the topgallant hounds. Steel's list has: fore lifts,
main lifts, crossjack lifts, fore/main/mizen topsail lifts, fore/main/mizen topgallant lifts,
spritsail lifts, sprit topsail lifts.

### 12.3 Halliards, tyes, jeers
- **Fore and main jeers** — tye and fall; the lower yards are hoisted and slung by jeers from the
  lower mastheads down to the deck at the mast.
- **Fore and main topsail tyes and halliards** — the tye passes through a sheave in the topmast
  head, down to a tye block, then the halliard falls to the ship's side (topsail halliards belay
  at the ship's side, near the main/fore channels).
- **Fore/main/mizen topgallant halliards** — single, up through the topgallant hounds.
- **Fore and main royal halliards** — reeve at the pole head.
- **Gaff throat halliards** and **gaff peak halliards** — mizen; plus **vang pendents and vang
  falls** to the quarters, and the **boom topping lift** and **guy pendent and tackle** for the
  driver boom.
- **Jib halliard and jib downhauler**; jib **guy pendents and falls** out to the spritsail
  yardarms; jib **out-hauler** and **tackle fall**.

### 12.4 Sheets, tacks, clewlines, buntlines, leechlines
- **Course tacks**: fore tack to the bumkin at the bow; **main tack to the chestree**, which stands
  half the main yard's length (35 ft 7 1/2 in) before the mainmast centre. Steel's 28-gun warrant
  lists "Tacks, 2 Pair" for fore and main.
- **Course sheets**: fore sheet aft to the gangway; main sheet aft to the quarter.
- **Topsail sheets**: reeve through the lower yardarm sheave, in along the yard, down to the deck.
- **Clewlines/clew garnets**: fore and main clew garnets from the clews up to blocks at the yard
  quarters and in to the mast; topsail clewlines and topgallant clewlines likewise.
- **Buntlines and leechlines**: lead up in front of the course, through blocks lashed **under the
  tops** ("the spritsail-brace, buntline, and leechline blocks, that are lashed under the tops" —
  Steel v1), then down to the deck. This detail matters visually: put those blocks under the top
  rim, not on the yard.
- **Bowlines and bowline bridles** on courses, topsails and topgallants, leading forward.
- **Reef tackle pendents** on fore and main topsails.

### 12.5 Yard furniture
- **Horses (footropes) and stirrups** on fore yard, main yard, crossjack, fore/main/mizen topsail
  yards (topsail yards additionally have **Flemish horses** at the yardarms), topgallant yards, and
  the spritsail yard. **Jib horses** on the jib boom; **bowsprit horse** (the man-rope).
- **Truss pendents and nave lines** on the fore and main lower yards.
- **Yard tackle pendents and yard tackles** on fore and main yards, with inner and outer tricing
  lines on the main yard tackle.
- **Slings** on the lower yards and on the gaff. **Parrel ropes** on topsail, topgallant and royal
  yards; trusses/parrels on the lower yards.
- **Stay tackles**: fore stay tackle and main stay tackle with pendent and tricing lines, for
  hoisting boats and stores.

---

## 13. WHAT COULD NOT BE FOUND — be honest about these

1. **Marquardt's actual spar table for *Surprise*.** It exists in Lavery & Hunt, *The Frigate
   Surprise* (2008/09) — including "spar dimensions as equipped the Surprise in 1802" and two
   Marquardt sail plans. Not on the open web in any form. Everything in §3 is Steel's establishment
   for her rate and tonnage, not a *Surprise*-specific document.
2. **No contemporary masting or sail draught for *Surprise* / *Unite* appears to survive.** RMG
   holds hull draughts only.
3. **The exact length of the 36-gun mainmast actually fitted.** The claim is qualitative ("the
   main-mast of a 36 gun ship"). The 89 ft 0 in in §4 is the 36-gun *establishment* figure, which
   is the best available proxy, not a recorded measurement of her spar.
4. **What was fitted after May 1798.** Hamilton ordered the mainmast replaced by "the existing
   foremast". We do not know what foremast was then supplied, nor the resulting yard sizes.
5. **Bowsprit housing / outboard split, and the jib boom housing.** Steel tabulates whole lengths
   only. §3.3 values are **[RECON]** from mast-station geometry.
6. **Masthead heights above the waterline.** Nobody tabulates these. §9 is **[RECON]** arithmetic
   from Steel's lengths plus a stated assumption about the keelson height and draught. Change
   assumption 2 or 3 and every number in §9 shifts together.
7. **Several of Steel's printed vulgar fractions are physically damaged in the archive.org scan**
   of vol 1 pp.39–40 (they photograph as ink blobs). Where that happened I substituted the
   empirical ratio computed from the 28-gun table on p.50, and said so in §10. The affected rules
   are: mizen mast / main, main topsail yard / main yard, lower studdingsail boom / main yard,
   studdingsail yard / boom, flying jib boom / bowsprit.
8. **Whether the tabulated topgallant mast length includes the royal pole.** Ambiguous in Steel;
   flagged in §5.
9. **Ratline spacing on topgallant shrouds.** Steel gives 13 in for lower and topmast shrouds and
   is silent on topgallant. **[RECON]** use 13 in there too.
