# 06 — Deck Layout and Fittings

HMS SURPRISE (ex-French corvette UNITÉ, launched 16 Jan 1794, captured 20 Apr 1796),
24-gun Sixth Rate / post ship. Research for 3D modelling.

Conversion used throughout: **1 ft = 0.3048 m; 1 in = 25.4 mm; 1 cwt = 50.802 kg.**

---

## 0. SOURCE SITUATION — READ FIRST

### 0.1 The two "Surprise" ships

| | Historic SURPRISE 1796 | Film/replica SURPRISE (ex-HMS ROSE 1970) |
|---|---|---|
| Length on deck | 126 ft 0 in / 38.40 m | 135 ft 6 in / 41.30 m |
| Beam | 31 ft 8 in / 9.65 m | 32 ft 0 in / 9.75 m |
| Draught | 14 ft 0½ in / 4.28 m | 13 ft 0 in / 3.96 m |
| Keel (for tonnage) | 108 ft 6⅛ in / 33.07 m | — |
| Depth in hold | 10 ft 0 in / 3.05 m | — |
| Burthen | 578 73/94 tons bm (657 tons displ.) | 500 long tons displ. |
| Origin | French corvette, Forfait design | Phil Bolger design from the 1757 Admiralty draught of HMS ROSE, 20-gun Sixth Rate |

Sources: [Wikipedia HMS Surprise (1796)](https://en.wikipedia.org/wiki/HMS_Surprise_(1796)); [Wikipedia HMS Surprise (replica ship)](https://en.wikipedia.org/wiki/HMS_Surprise_(replica_ship)); [Maritime Museum of San Diego](https://sdmaritime.org/visit/the-ships/hms-surprise/).

**The reference photograph is the replica, which is 9 ft 6 in (2.90 m) longer on deck than the
historic ship and is a different hull (Rose 1757, not Unité 1794).** Where the photo and the
period evidence disagree, this file records both.

### 0.2 The primary drawings that exist for the real ship

| Plan | RMG no. | Date | Sheet size | Content |
|---|---|---|---|---|
| Lines & Profile | **ZAZ3067** | 1798 | 470 × 1350 mm | lines, inboard profile |
| **Deck, Quarter & Forecastle** | **ZAZ3068** | 1798 | 280 × 935 mm | upper deck, quarterdeck and forecastle **plan views** |

Draughtsman John Marshall, Master Shipwright, Plymouth Dockyard 1795–1801; taken off when
Surprize was docked 15 Feb 1798 to be recoppered, launched 2 Mar, completed May 1798, cost £6,992.
Sources: [RMG ZAZ3067](https://www.rmg.co.uk/collections/objects/rmgc-object-82858), [RMG ZAZ3068](https://www.rmg.co.uk/collections/objects/rmgc-object-82859).

**ZAZ3068 is the single document that answers most of this brief exactly.** It is not published
online at readable resolution. Scale is not stated in the catalogue record; a 126 ft ship at 1:48
is 800 mm long, which fits the 935 mm sheet, so **1:48 is near-certain** (RECONSTRUCTED from the
sheet dimensions). *Action for the modeller: order a scan of ZAZ3068 and ZAZ3067 from RMG. Every
"RECONSTRUCTED" value below can then be replaced with a measured one.*

A separate plan exists for the 38-gun frigate **Unite (1796)**, ZAZ3181, 1:48, July 1796, Plymouth,
also signed J. Marshall ([RMG](https://www.rmg.co.uk/collections/objects/rmgc-object-82972)) — **this
is a different ship** (the big Unité, fitted as a 32-gun Fifth Rate). Do not confuse the two.

### 0.3 Substitute source used for all dimensioned fittings

David Steel, *The Elements and Practice of Naval Architecture*, London 1805 — full text at
[archive.org/details/elementspractice00stee](https://archive.org/details/elementspractice00stee)
(public domain; all page references below are to the OCR'd `elementspractice00stee_djvu.txt`,
line numbers quoted so they can be checked).

Steel's master tables run in columns: 110 / 98 / 80 / 74 / 64 / 50 / 44 / 38 / 36 / **32** guns.
There is **no 24-gun column** (24-gun Sixth Rates were obsolete by 1805). The **32-gun frigate
column is used throughout as the proxy for Surprise**, because a Steel 32-gun frigate has a
126 ft gun deck — *identical* to Surprise's 126 ft — though it is ~3 ft 6 in broader
(35 ft 2 in vs 31 ft 8 in). **Lengths from the 32-gun column are therefore good; breadths and
athwartship offsets from it will be ~10 % too large.** Where a value is athwartship it is flagged.

The 1805 archive.org scan is OCR'd from a badly-set table; several rows are mis-registered.
Rows whose reading is uncertain are marked **[OCR-doubtful]**.

---

## 1. COORDINATE CONVENTION USED IN THIS FILE

* **X** = feet aft of the aft side of the stem rabbet, measured on the upper (gun) deck line.
  X = 0 at the stem; X = 126 ft 0 in (38.40 m) at the fore side of the stern-post rabbet.
* **Y** = feet from the centreline, + to starboard.
* **Z** = feet above the upper deck at the side, unless stated.

### 1.1 Master stations — RECONSTRUCTED baseline

Steel's mast-centre row is truncated in the scan (only the 110-gun value 21 ft 0 in for the
foremast, and 104 ft 8 / 103 ft 0 / 103 ft 2 / 99 ft 5 for the mainmast of the 110/98/80/74,
survive legibly — `steel1805.txt:33395-33403`). Ratios taken from the legible two-decker series
and applied to 126 ft:

| Item | Ratio of gun-deck length | X (ft-in) | X (m) | Status |
|---|---|---|---|---|
| Foremast centre | 0.113 (110-gun: 21 ft / 186 ft) | 14 ft 3 in | 4.34 | **RECONSTRUCTED** |
| Mainmast centre | 0.564 (mean of 110/98/80/74) | 71 ft 1 in | 21.67 | **RECONSTRUCTED** |
| Mizzen mast centre | 0.80 (period norm; main→mizzen = 0.52 × fore→main) | 100 ft 9 in | 30.71 | **RECONSTRUCTED** |
| Fore side of quarterdeck (break) | ~7 ft abaft mainmast | 78 ft 0 in | 23.77 | **RECONSTRUCTED** |
| Aft side of forecastle | Steel forecastle length series 36-gun = 36 ft 0 in, extrapolated | 33 ft 0 in | 10.06 | **RECONSTRUCTED** |
| Waist (open) | between the two above | 33 ft → 78 ft, 45 ft long / 13.72 m | | **RECONSTRUCTED** |

**If the masts/rigging research file gives different mast stations, shift everything below by the
same amount — the *relative* offsets (e.g. "capstan 19 ft abaft the mainmast") are the sourced
numbers and do not change.**

---

## 2. THE SHIP'S WHEEL AND BINNACLE

### 2.1 Wheel

| Item | 32-gun frigate value | Metric | Source |
|---|---|---|---|
| Wheel outside diameter | "a little over 5 ft" → **5 ft 2 in** | 1.575 m | Lavery, *Arming and Fitting of English Ships of War 1600–1815*, quoted via [search of the text](https://archive.org/details/armingfittingofe0000lave): "The typical wheel had an outside diameter of a little over 5ft" |
| Barrel (drum) length | **2 ft 3 in** | 0.686 m | Steel 1805, Quarter Deck table, `steel1805.txt:39506` (row Q, 32-gun col.) |
| Barrel diameter at ends | **1 ft 6 in** *[OCR-doubtful]* | 0.457 m | Steel `:39507` (row R) |
| Barrel diameter at middle | **1 ft 4 in** | 0.406 m | Steel `:39508` (row S) |
| Spindle, square | **1½ in** | 38 mm | Steel `:39509` (row T) |
| Stanchions, broad × thick | **1 ft 0 in × 5 in** | 0.305 × 0.127 m | Steel `:39504–39505` (rows N, O) |
| Stanchion heads above deck | **3 ft 4 in – 3 ft 6 in** | 1.02–1.07 m | Steel `:39506` (row P) |
| Number of stanchions | **two** | — | Steel: "The two beams of the quarter deck which come under it should be placed conformably to the two stantions of the wheel, so that they may tenon in them" (`:17583`) |

**Single or double wheel?** The barrel is only 2 ft 3 in (0.69 m) long in the 32-gun column, against
3 ft 0 in for a 110-gun. A double wheel needs a wheel at each end of the barrel plus the rope
turns in the middle — that will not fit in 2 ft 3 in. **A single wheel on the forward end of the
barrel is therefore indicated for a ship of Surprise's size** (this is an inference from Steel's
own numbers, not a quoted statement — treat as **RECONSTRUCTED**). The replica in the reference
photo should be checked; replicas commonly fit a double wheel for crew safety.

Wheel geometry to model: axle centre at stanchion-head height 3 ft 5 in (1.04 m) above the
quarterdeck; wheel radius 2 ft 7 in, so the wheel rim sweeps from 0 ft 10 in (0.25 m) to
6 ft 0 in (1.83 m) above the deck. Spokes: 8 or 10 is the period norm, each with a turned handle
projecting ~7 in (178 mm) beyond the rim — **RECONSTRUCTED; Steel gives no spoke count.**

### 2.2 Position of the wheel relative to the mizzen mast

**Conflict of sources — both recorded:**

* **Steel 1805**, describing the quarterdeck plan of a ship of the line, gives the order forward
  to aft as: gratings and ladderway → **steering wheel** → **mizzen mast** → lobby bulkhead →
  screen bulkhead (`steel1805.txt:17934-17937`). He also says the wheel "should be placed under the
  fore part of the round-house" (`:17582`), i.e. under the front of the poop.
* **Surviving frigates and the replica** put the wheel **abaft** the mizzen mast, with the binnacle
  between mizzen and wheel. A Sixth Rate has no poop, so Steel's "under the fore part of the
  round-house" rule cannot apply.

**Trusted: wheel abaft the mizzen**, because (a) Surprise has no roundhouse/poop, and (b) the
tiller sweep under the quarterdeck must be reached by a lead of tiller ropes that clears the
mizzen step and the after hatch.

| Item | X (ft-in from stem) | X (m) | Y | Status |
|---|---|---|---|---|
| Mizzen mast centre | 100 ft 9 in | 30.71 | 0 | RECONSTRUCTED (§1.1) |
| Binnacle, forward face | ~103 ft 6 in | 31.55 | 0 | **RECONSTRUCTED** |
| Wheel barrel axis | ~107 ft 6 in | 32.77 | 0 | **RECONSTRUCTED** |
| Rudder head / tiller pivot | ~123 ft 0 in | 37.49 | 0 | RECONSTRUCTED from stern-post position |

### 2.3 Binnacle

Steel's outfit table lists only **"BINNACLES complete … number: two"** for large ships
(`steel1805.txt:42943`) and gives **no dimensions at all**. Falconer 1776 defines it
(*habitacle*) but gives no sizes ([archive.org Falconer](https://archive.org/details/universaldiction00falc_0), `falconer.txt:30461`).

**RECONSTRUCTED** from the standard three-compartment RN binnacle of the period (two compass
boxes flanking a central lamp locker), scaled to a Sixth Rate:

| Dimension | Imperial | Metric |
|---|---|---|
| Length athwartships | 3 ft 6 in | 1.07 m |
| Depth fore-and-aft | 1 ft 4 in | 0.41 m |
| Height above deck | 3 ft 0 in | 0.91 m |
| Compartments | 3 (compass / lamp / compass) | — |
| Compass bowl diameter | 9 in | 0.23 m |

Placed on the centreline, forward of the wheel, close enough that the helmsman reads it over the
wheel rim: 3 ft 6 in – 4 ft 0 in (1.07–1.22 m) clear ahead of the wheel. **A Sixth Rate almost
certainly carried one binnacle, not the two Steel allows a First Rate** (judgement, not sourced).

---

## 3. CAPSTANS

### 3.1 How many

> "Frigates, or small ships, have only one capstan, the upper part of which is placed on the
> quarter deck." — Steel 1805, `steel1805.txt:17502-17503`

Steel's own table confirms it: the row "Centre of fore jear capstan, abaft centre of fore mast"
has values for the 110/98/80/74/64 and is **blank for every frigate column**
(`steel1805.txt:38406-38407`).

**Surprise therefore has ONE capstan — a double (two-drumhead) main jeer capstan.** The lower
drumhead and pall rim are on the upper (gun) deck; the barrel passes up through the quarterdeck to
the upper drumhead. **There is no fore jeer capstan.** (The replica may differ; check the photo.)

Caveat: Steel is describing 1805 Royal Navy practice. Surprise was French-built and re-fitted in
1796–98; her capstan is whatever Plymouth put in, shown on ZAZ3068.

### 3.2 Dimensions — Steel 32-gun frigate column

| Item | Imperial | Metric | Source line |
|---|---|---|---|
| **Centre of main jeer capstan abaft the centre of the mainmast** | **19 ft 0 in** | **5.79 m** | `:38405-38406` (row T) |
| → absolute station | X = 90 ft 1 in | 27.46 m | derived from §1.1 |
| Barrel diameter | 1 ft 9¾ in | 0.552 m | `:38408` |
| Barrel length (whole, deck to deck) | 10 ft 8 in | 3.251 m | `:38409` |
| Upper whelps, number | **six** | — | `:38412` |
| Upper whelp length | 3 ft 0 in | 0.914 m | `:38413` |
| Upper whelp, broad at heel | 0 ft 10¾ in | 0.273 m | `:38417` |
| Upper whelp, broad at head | 0 ft 7½ in | 0.191 m | `:38418` |
| Height of the surge | 2 ft 0 in | 0.610 m | `:38419` |
| Lower whelps, number | five or six | — | `:38424` |
| Lower whelp length | 2 ft 9 in | 0.838 m | `:38425` |
| **Drumhead diameter** | **4 ft 0 in** | **1.219 m** | `:38437` (row X) |
| Drumhead upper piece, thick | 5¾ in | 146 mm | `:38438` |
| Drumhead lower piece, thick | 5½ in | 140 mm | `:38439` |
| Tenon at head of barrel, square | 1 ft 2 in | 0.356 m | `:38441` |
| **Bar-holes in drumhead** | **twelve** | — | `:38565` |
| Bar-hole, square | 3⅞ in | 98 mm | `:38566` |
| Bar-hole depth | 11¾ in | 298 mm | `:38567` |
| Iron circular plates on drumhead | 3 in broad × ⅜ in thick, twelve countersunk holes | 76 × 9.5 mm | `:38569-38572` |
| **Capstan bars, number** | **twelve** | — | `:38575` |
| Capstan bar length | 11 ft 6 in *[OCR-doubtful: column alignment]* | 3.505 m | `:38576` |
| Bar, square at drumhead / at outer end | 4½ in / ~3 in | 114 / 76 mm | `:38577-38578` |
| Trundle-head (lower drumhead) bar-holes | **ten** | — | `:38592` |
| Trundle-head diameter | 4 ft 6 in *[OCR-doubtful]* | 1.372 m | `:38600` |
| Capstan partners, thick | 6 in | 152 mm | `:39379` |
| Ladderway immediately before the capstan, fore-and-aft | 2 ft 8 in | 0.813 m | `:39375` |
| Capstan bar diameter (stowage cranks) | 1¼ in *(iron cranks)* | 32 mm | `:37793` |

**Geometry note for modelling:** twelve bars at 4 ft 0 in drumhead diameter, radiating on 30°
centres; the effective sweep circle for the men is 4 ft 0 in + 2 × 11 ft 6 in ≈ 27 ft (8.2 m) —
which is wider than the ship. **The bars were therefore shipped shorter than Steel's 11 ft 6 in on
a ship of this beam; 8 ft 0 in – 9 ft 0 in (2.44–2.74 m) is the practical length.** RECONSTRUCTED
from the beam of 31 ft 8 in.

Capstan bars were stowed on **iron cranks fitted to the quarterdeck beams**
(Steel, `steel1805.txt:2371-2373`, definition of CRANKS).

---

## 4. HATCHWAYS, GRATINGS, LADDERWAYS, COMPANIONS

### 4.1 Steel's rules for placing them (upper deck of a frigate)

Quoted/paraphrased from `steel1805.txt:17434-17451` and `:17482-17497`, `:17867-17875`:

* The **aft side of the main hatchway** is set forward of the beam that forms the fore part of the
  well; the well is ~10 ft (3.05 m) fore-and-aft, centred on the mainmast.
* The **fore side of the fore hatchway** should range up and down with the **after end of the
  forecastle**.
* A **ladderway lies immediately forward of the fore hatchway** (down to the orlop) and a
  **double ladderway immediately forward of the main hatch**, ladders standing fore-and-aft.
* The **after hatchway's fore side comes to the aft side of the mast room** (i.e. just abaft the
  mainmast partners).
* On the upper deck of a frigate the **capstan partners sit between the after hatchway and the
  after ladderway**, with **gratings abaft the capstan running to the cabin bulkhead**
  (`:39377`).

### 4.2 Sizes — Steel 32-gun frigate column *[several rows OCR-doubtful]*

| Opening | Fore-and-aft | Thwartships | Metric (f&a × thw) | Source |
|---|---|---|---|---|
| **Main hatchway** | **7 ft 0 in** *(OCR shows "6 0"; the series 9-0 / 8-9 / 8-6 / **8-6 (74)** / 8-4 / 7-9 / 7-9 / 7-6 / 7-6 / ? is confirmed for the 74 by Steel's text "the main hatchway, fore and aft … is 8 feet 6 inches")* | ~4 ft 6 in | 2.13 × 1.37 m | `:33625` label, `:33355` values; text `:17434` |
| **Fore hatchway** | 4 ft 6 in | 4 ft 6 in | 1.37 × 1.37 m | `:33633`, `:33358-33359` |
| **After hatchway** | ~4 ft 0 in | ~4 ft 0 in | 1.22 × 1.22 m | `:33636` (values not legible) — **RECONSTRUCTED** |
| Ladderway before the capstan | 2 ft 8 in | (deck breadth allows) | 0.81 m | `:39375` |
| Ladderway, fore part of forecastle | ~1 ft 10 in × 4 ft 6 in | | 0.56 × 1.37 m | `:39538` (110/98 = 2 ft 2 in; frigate col. extrapolated) |
| Aft side of main hatch, forward of mainmast centre | ~4 ft 6 in | — | 1.37 m | `:33357` *[OCR-doubtful]* |

### 4.3 Coamings and head-ledges

| Item | Value | Metric | Source |
|---|---|---|---|
| Coamings (ladderway grating and capstan partners) broad | 9 in | 229 mm | Steel `:39445` |
| … deep | 8 in | 203 mm | Steel `:39446` |
| Scored down onto the beams | 1 in | 25 mm | Steel `:39447` |
| One bolt in each beam, diameter | ⅞ in | 22 mm | Steel `:39448` |
| **Coaming height above deck (contract standard)** | **"at least 13 inches"** | 330 mm | Steel, Form of a Contract, `:44581-44583` |
| Rabbet in head-ledges for the gratings | 3 in on, 2¾ in deep | 76 × 70 mm | Steel `:23126` |
| Hatchway to be 1½ in broader than the given size (to clear the gratings) | +1½ in | +38 mm | Steel `:34232` |
| Grating battens | ~2 in square, laid to leave ~2 in openings | 51 mm | Steel `:1293`, `:2968` |

### 4.4 Companion and skylights

| Item | Value | Metric | Source |
|---|---|---|---|
| Companion framing, thick | 4 in | 102 mm | Steel `:39450` |
| Companion stands above the deck | 9 in | 229 mm | Steel `:39451` |
| Bolt at each corner, diameter | ⅞ in | 22 mm | Steel `:39452` |

Steel: a **companion is placed over the middle of the lobby to give light to it** (`:17614`).
On a Sixth Rate with no poop this becomes **a companion on the quarterdeck aft, leading down to
the after cabin / lobby**, plus **gratings between the after ladderway and the cabin bulkhead**
(`:39377`) which serve as the skylight over the great cabin.

> "In every ship of the line all the beams from the ladder way to the four beams before it should
> be open, with gratings, for the more expeditious conveyance of different things in time of
> action, as well as for air." — Steel `:17573-17575`

**Great cabin gratings — RECONSTRUCTED position:** a run of gratings on the centreline from about
X = 112 ft to X = 118 ft (34.1–36.0 m), 4 ft 0 in (1.22 m) wide, between the wheel and the after
(screen) bulkhead.

Two scuttles are cut **one on each side of the mainmast** on the quarterdeck "through which the
pumps, &c. may be lifted"; two more abaft the brace bitts for leading the main top tackles to
eye-bolts in the upper deck (Steel `:17930-17933`). Two scuttles abaft the fore mast on the
forecastle do the same job for the fore top tackles (`:17919-17920`).

---

## 5. BITTS, KNIGHTHEADS, CATHEADS, TIMBERHEADS, KEVELS, CLEATS

### 5.1 Riding bitts (upper deck of a frigate = the gun deck)

Steel's placement rule (`steel1805.txt:17470-17473`):
> "The riding bitts may now be placed, letting the fore side of the after ones come against the aft
> side of the beam abaft the fourth port, and the fore side of the foremost ones against the next
> beam but one forward."

With the port layout of §9.1 (ports at 8 ft pitch, foremost at X = 19 ft), the **fourth port
centre is at X = 43 ft**; the beam abaft it is at ~X = 45 ft.

| Item | Value | Metric | Status / source |
|---|---|---|---|
| After riding bitt pins, fore side | X ≈ 45 ft 0 in | 13.72 m | RECONSTRUCTED from Steel's rule |
| Foremost riding bitt pins, fore side | X ≈ 37 ft 0 in | 11.28 m | RECONSTRUCTED (one beam-space + one forward ≈ 8 ft) |
| Bitt pin, square at the deck | **10½ in** | 267 mm | Steel contract `:44617-44619` (armed brigantine; scale up ~10 % for a Sixth Rate → **11½ in / 292 mm**, RECONSTRUCTED) |
| Bitt pins, Y offset from centreline | ±3 ft 0 in | ±0.91 m | **RECONSTRUCTED** (must straddle the two cables) |
| Cross-piece, broad × deep | 8 in × 5¾ in | 203 × 146 mm | Steel `:39442-39443` (32-gun col.) |
| Cross-piece upper side above deck | 1 ft 10 in | 0.559 m | Steel `:39444` |
| Cross-piece ends project beyond the bitts | 1 ft 6 in | 0.457 m | Steel `:39445` |
| Standards to the riding bitts | the foremost pair form the **foremast partners** | — | Steel `:17731-17733` |

The **galley/fire hearth of a frigate sits between the riding bitts** — see §7.

### 5.2 Jeer bitts and topsail-sheet bitts

| Item | Rule | Source |
|---|---|---|
| Main topsail-sheet bitts (foremost pair) | aft side against the fore side of the beam **abaft the main hatchway**; pass down to the deck below and step on the beam there | Steel `:17538-17540` |
| Main jeer bitts | against the **fore side of the beam abaft the mainmast**; step on the beam below | Steel `:17540-17541` |
| Cross-pieces | on the **fore** side of the foremost bitts and **abaft** the after ones | Steel `:17541-17543` |
| Cross-piece height above the upper deck | **one third of the height between upper deck and quarterdeck**, ≈ 2 ft 2 in / 0.66 m for a 6 ft 6 in tween-deck | Steel `:17543-17545` |
| Bitt insides plumb the centres of the pumps | main jeer + topsail-sheet bitts line up with the chain pumps | Steel `:17745-17746` |
| Fore topsail-sheet bitts | **one pair forward of, one pair abaft the foremast**, let into the sides of the forecastle beams, stepping on the upper deck beams below | Steel `:17592-17594` |
| Fore jeer bitts heels | cast off the centreline so the **fore tack leads clear of the galley** (a sheave or roller is fitted in the galley for it) | Steel `:17594-17595`, `:17856-17858` |
| Brace bitts | on the quarterdeck, **abaft the mainmast** | Steel `:17929` |
| Knee bitts | a small pair on each side of the mizzen mast, bolted through the mast carlings | Steel `:17610-17611` |
| Bitts, blocks and sheaves | blocks left on the outsides of the fore jeer/topsail-sheet bitts, two sheaves in each bitt, plus one sheave in each heel | Steel `:40163-40170` |

### 5.3 Knightheads / bollard timbers

> "The knightheads, or bollard timbers, must run sufficiently high above the bowsprit to admit of
> a chock coming between them for the better security of the bowsprit." — Steel `:15357-15359`

Position: immediately each side of the stem head, Y ≈ ±1 ft 2 in (±0.36 m) at the top
(**RECONSTRUCTED** — Steel gives the stem half-thickness for small ships as 1 ft 4 in at the stem,
`:15347`). Height above the forecastle deck: enough to take the bowsprit chock, ≈ 3 ft 0 in
(0.91 m) — **RECONSTRUCTED**.

### 5.4 Catheads

Steel's forecastle table, 32-gun frigate column. **The whole cathead block is badly OCR'd; values
marked ⚠ are read from an eroded row and should be checked against ZAZ3068.**

| Item | 32-gun value | Metric | Source |
|---|---|---|---|
| Cathead, sided (fore-and-aft) | ⚠ ~1 ft 2 in | 0.36 m | Steel `:40060` |
| Cathead, moulded (up-and-down) | ⚠ ~1 ft 1 in | 0.33 m | Steel `:40061` |
| **Stive (rise) upwards, per foot of length** | **5 in per ft** = **22.6° above horizontal** | — | Steel `:40062-40064` (whole row legible: 0-5 / 0-5 / 0-6 / 0-6 / 0-6 / 0-6 / 0-6 / 0-5 / 0-5 / **0-5**) |
| Length **outboard** ("sufficient to fit the anchor clear of the bow") | ⚠ ~6 ft 0 in | 1.83 m | Steel `:40065-40066` (series 9-0 / 8-6 / 9-0 / 8-6 / 7-9 / 7-6 / …) |
| Length **inboard** from the outside of the timber | ⚠ ~8 ft 6 in | 2.59 m | Steel `:40066` |
| Sheaves in the outer end | **three** | — | Steel `:40068-40069` |
| Sheave diameter | ⚠ ~10 in | 0.25 m | Steel `:40069` |
| Sheave thickness | 2 in | 51 mm | Steel `:40070` |
| Bolt through cathead and cross-chock, diameter | 1¼ in | 32 mm | Steel `:40067-40068` |
| Knee at the aft side of the cathead, sided | 5¾ in | 146 mm | Steel `:40072` |
| Knee, fore-and-aft arm | 4 ft 3 in | 1.30 m | Steel `:40073` |
| Knee, thwartship arm | 3 ft 6 in | 1.07 m | Steel `:40074` |
| Bolts in the knee | six, 1 in | 25 mm | Steel `:40075-40076` |
| Cat beam (foremost forecastle beam) | broad enough to take the aft side of the inboard arms of the catheads, with a 5 in rabbet for the forecastle flat | — | Steel `:17586-17590` |
| Supporters | circular knees under the catheads | — | Steel `:5081`, `:23138-23144` |

**Cathead station and angle in plan:** the cathead is drawn "letting it project from the aft side
of the head of the main-[rail]" (Steel `:15874`), i.e. its inboard arm bolts to the cat beam and its
outboard arm projects **square with the bow in plan** ("To stand square with the bow", Steel
`:40062`) — so in plan it is normal to the ship's side at that station, roughly **35–40° off the
centreline** on a bow of Surprise's fineness (**RECONSTRUCTED**), and rising 22.6° in elevation.

| Item | X | Y | Status |
|---|---|---|---|
| Cathead root (at the cat beam) | X ≈ 12 ft 0 in / 3.66 m | Y ≈ ±10 ft 0 in / ±3.05 m | **RECONSTRUCTED** |
| Cathead outer end (sheave centre) | X ≈ 8 ft 0 in / 2.44 m | Y ≈ ±14 ft 6 in / ±4.42 m | **RECONSTRUCTED** |
| Outer end height above forecastle deck | ≈ 2 ft 6 in / 0.76 m | — | **RECONSTRUCTED** from 22.6° stive over 6 ft |

A **timberhead is placed close forward of the cathead for the cat-block to bolt to**, and the after
end of the main head rail bolts to the same timber (Steel `:15364-15366`).

### 5.5 Timberheads, kevels, cleats

| Item | Rule / value | Source |
|---|---|---|
| Timberheads along the forecastle | placed so they correspond with the frame timbers that come **over the upper deck ports** | Steel `:15359-15362` |
| Timberhead above the plank-sheer | ⚠ series in Steel forecastle table `:40290-40293` (values not legible for the frigate column) — **use 1 ft 3 in / 0.38 m, RECONSTRUCTED** | Steel `:40290` |
| Timberhead for the anchor stopper | a dedicated, heavier head abaft the cathead | Steel `:40292-40294` |
| Two or three forecastle ports each side | formed **by the timberheads**, placed clear of the shrouds | Steel `:15363-15364` |
| Rough-tree rail (the rail on the timberheads round the bow and along the drifts) | broad 8 in / deep 5 in; underside 3 ft 6 in (1.07 m) above the deck | Steel `:39518-39520` |
| Fife rail on the forecastle | lets over the heads of the beakhead stanchions | Steel `:17916-17917` |
| Cleats on the drift/gangway | ~3 ft (0.91 m) long, 6 in (152 mm) apart, 5 in (127 mm) deep | Steel `:15801` |
| Chestrees, blocks, stopper bolts | fitted on the flat of the deck and other parts for rigging | Steel `:44635-44637` |
| Fenders abreast the main hatchway | sided 5 in (127 mm) | Steel `:42555`, placement rule `:1039`, `:15786-15788` |

---

## 6. PUMPS AND THE PUMP DALE

Steel, ship's outfit table, frigate columns (`steel1805.txt:35288-35296`):

| Item | 32-gun frigate | Metric | Source |
|---|---|---|---|
| **Chain pumps, number** | **two** (110–64 gun ships have four) | — | `:35288` |
| Chain pump size ("size in chain") | **7 in** | 178 mm | `:35289` |
| **Wood (elm-tree) pumps with brass chambers, number** | **two** | — | `:35290` |
| Elm-tree pump bore | **7 in** | 178 mm | `:35290` |
| Pump cisterns each side of the mainmast | one (frigate) / two (line) | — | `:35291` |
| Cistern deep | ~2 ft 0 in ⚠ | 0.61 m | `:35292` |
| Cistern broad, out to out | 2 ft 0 in ⚠ | 0.61 m | `:35293` |
| Cistern ends project beyond the pump heads | 8 in ⚠ | 203 mm | `:35294` |
| Cistern bottom | oak plank 3 in (76 mm) thick | 76 mm | `:35292` |
| Fire-engine hose fitted to the pumps | 1 ft 0 in (0.30 m) | — | `:35287-35288` |

**Positions** (Steel `:17414-17417`, `:17745-17747`):
* The **chain pumps stand immediately forward of and abaft the mainmast**, one pair each side of
  the centreline: "draw in the chain-pump that comes before the main-mast".
* The **inner cases of the pumps must not wound the mainmast partners** more than can be avoided.
* The **main jeer bitts and topsail-sheet bitts are set so that their insides plumb the centres of
  the pumps.**
* **Rhodings** (bearing plates) and **winches** of the pumps, and the **pump pillars**, are drawn on
  the deck plan (`:17747-17748`).

| Item | X | Y | Status |
|---|---|---|---|
| Forward chain pump heads | X ≈ 68 ft 0 in / 20.73 m | Y = ±2 ft 3 in / ±0.69 m | **RECONSTRUCTED** |
| After chain pump heads | X ≈ 74 ft 0 in / 22.56 m | Y = ±2 ft 3 in / ±0.69 m | **RECONSTRUCTED** |
| Elm-tree pumps | X ≈ 76 ft 6 in / 23.32 m | Y = ±3 ft 6 in / ±1.07 m | **RECONSTRUCTED** |
| Cistern (one, each side of mainmast) | straddling the pump heads | Y ≈ ±2 ft 3 in | **RECONSTRUCTED** |

**Pump dale.** Steel's index has the word but the passage is not recoverable from the OCR; his
general statement is that the leakage is conveyed to the pumps "in channels" (`:49658`). The dale
on a frigate is a square wooden trough leading from the chain-pump cistern outboard through the
ship's side, discharging above the waterway. **RECONSTRUCTED dimensions: 9 in × 7 in internal
(229 × 178 mm), sloping ~1 in 12 outboard, discharging through the side just above the upper-deck
waterway, one dale to each cistern.** No dimensioned period source was found for a Sixth Rate.

The Cole–Bentinck improved chain pump (patented 17 Jan 1771) was adopted for all Royal Navy ships
and is the correct pattern for 1796–98: an endless chain with leather-and-metal discs running in a
7 in square trunk, worked by **iron cranks and a flywheel-less winch** taking up to twelve men.
Sources: [Royal Society picture library, Cole–Bentinck chain pump](https://pictures.royalsociety.org/image-rs-5469);
[sailingwarship.com, "The Improved Chain Pump"](https://www.sailingwarship.com/the-improved-chain-pump.html).
Technical detail beyond this is in T. Oertling, "The chain pump: an 18th century example",
*IJNA* 11 (1982) — [DOI link](http://onlinelibrary.wiley.com/doi/10.1111/j.1095-9270.1982.tb00066.x/pdf) — **not accessed**.

---

## 7. BELFRY, BELL, GALLEY STOVE AND CHIMNEY

### 7.1 Belfry

> "At the aft part of the forecastle is drawn the **bellfry bitts**, with knees to support them; and
> over the breast beam are drawn the foot rail and stantions." — Steel `steel1805.txt:17921-17923`

> "BELLFRY. An ornamental framing, made of stantions, at the after beams of the forecastle, with a
> covering or top, under which the ship's bell is hung." — Steel `:1372-1373`

| Item | Value | Metric | Source |
|---|---|---|---|
| Position | **on the centreline, at the after beams of the forecastle** — X ≈ **32 ft 0 in** (9.75 m), Y = 0 | | Steel `:1372`, `:17921`; X derived from §1.1 |
| Belfry stanchions, broad × thick | ⚠ not legible in the frigate column | — | Steel `:40352-40353` |
| Stanchions asunder athwartships, in the clear | ⚠ | — | Steel `:40354` |
| Stand above the beams | ⚠ | — | Steel `:40355` |
| **RECONSTRUCTED** overall belfry | 3 ft 0 in wide × 1 ft 0 in deep × 4 ft 6 in high, two stanchions and a curved top | 0.91 × 0.30 × 1.37 m | scaled from the Steel 110-gun proportions |
| **RECONSTRUCTED** bell | 11 in mouth diameter, 13 in high | 279 × 330 mm | period Sixth-Rate norm; no dimensioned source found |

### 7.2 Galley / Brodie stove

> "In frigates and small ships it [the fire hearth] is fixed **under the forecastle**, though confined
> between the riding bitts; therefore, in such ships, it should be kept **as near as possible to the
> after riding bitts**, that there may be the more room between it and the foremost riding bitts, to
> form as convenient a galley as circumstances will admit." — Steel `:17532-17536`

So on Surprise the stove sits on the **upper (gun) deck, under the forecastle, immediately forward
of the after riding bitts**, on the centreline.

| Item | Value | Metric | Status |
|---|---|---|---|
| Stove station, aft face | X ≈ 44 ft 0 in | 13.41 m | **RECONSTRUCTED** from Steel's rule + §5.1 |
| Stove station, fore face | X ≈ 38 ft 0 in | 11.58 m | **RECONSTRUCTED** |
| Stove footprint (a Brodie stove for a frigate) | ~6 ft 0 in fore-and-aft × 5 ft 0 in athwartships × 5 ft 0 in high to the top of the funnel base | 1.83 × 1.52 × 1.52 m | **RECONSTRUCTED**; scaled drawings of a Brodie stove are published in D. White, *AOTS: The Frigate Diana*, cited by [Model Monkey 1/48 Brodie stove](https://www.model-monkey.com/product-page/1-48-brodie-galley-stove-for-19th-century-ships) |
| Galley enclosed abaft by two doors, with cants | — | — | Steel `:17862-17863` |
| Deck under the galley | **oak** flat; two strakes abreast the galley left **1 in (25 mm) proud** of the deck to save it from the cook | — | Steel `:17902-17905` |
| Sheave or roller in the galley for the fore tack | — | — | Steel `:17857-17858` |

The Brodie patent stove (Alexander Brodie, patented 1780) was fitted to RN ships of this period
including Victory, Bellona, Vanguard, **Diana** and Bounty
([Ships of Scale, galley-stove thread](https://shipsofscale.com/sosforums/threads/stove-galley-oven-firehearth-chimney-tech-details-and-development-over-time-at-different-navies.2159/page-3)).

### 7.3 Chimney and steam gratings on the forecastle

> "Over the galley amidships are framed the **steam gratings**; and, **between them, coamings for the
> chimney funnel**." — Steel `:17921-17922`

Steel's forecastle table (`:40180-40190`) lists, but the frigate column is not legible:
* Scuttles for the steam gratings, fore-and-aft as the beams admit; thwartships; coamings broad and deep.
* **Chimney funnel coamings**: thick; **square in the clear**; upper side to stand above the upper deck; one bolt at each corner.

Also: "There should be a scuttle for the funnel of the fire hearth to pass through, another over the
copper to give vent to the steam, and one or two over the galley" (Steel `:17588-17591`).

**RECONSTRUCTED**: chimney funnel coaming **1 ft 8 in square in the clear (0.51 m)**, standing
**9 in (229 mm)** above the forecastle deck, on the centreline at **X ≈ 40 ft 0 in (12.19 m)**;
one steam grating each side of it, each ~2 ft 6 in × 2 ft 0 in (0.76 × 0.61 m), Y = ±2 ft 6 in.
The funnel itself is a sheet-copper stack rising ~4 ft (1.22 m) above the forecastle with a cowl.

---

## 8. SKID BEAMS, GANGWAYS AND THE BOATS

### 8.1 Gangways and gang-boards

| Item | 32-gun frigate | Metric | Source |
|---|---|---|---|
| Gang-boards, Prussian deal thick | 3 in | 76 mm | Steel `:38398-38400` |
| Gang-board broad | **3 ft 4 in** | 1.016 m | Steel `:38400` (32-gun col.) |
| Bolted through every 4 ft, diameter | ⅞ in | 22 mm | Steel `:38401-38402` |
| Bolted down to the beams, diameter | 1 in | 25 mm | Steel `:38403` |
| Position | "Along the waist, at the side, is shewn the plan of the gang boards and fixed gangway" | — | Steel `:17924-17925` |

So the waist is bridged each side by a **3 ft 4 in (1.02 m) wide gangway** from the forecastle
(X = 33 ft) to the quarterdeck (X = 78 ft), leaving a central well ~24 ft (7.3 m) wide at the
midship station.

### 8.2 Skid beams and boat stowage

Steel calls the transverse skids over the waist by their function: the boats were stowed
**"on the booms, amidships, with the spare spars"**, and a **gallows bitts** — "a frame of strong
pieces of wood, in shape resembling a gallows, raised amidships for stowing spare spars" — carried
the after end of the spar tier
([Burney, *Vocabulary of Sea Terms*, 1876](http://www.bruzelius.info/Nautica/Etymology/English/Burney(1901)_dict.html);
[Kipling Society, British warships' boats](https://www.kiplingsociety.co.uk/rg_navyboats.htm)).
Boats "were stowed upon the deck, sometimes **nested one atop the other**"
([Wikipedia, Ship's boat](https://en.wikipedia.org/wiki/Ship%27s_boat)).

**RECONSTRUCTED skid-beam arrangement for Surprise** (no dimensioned source found):

| Item | Value | Metric |
|---|---|---|
| Number of skid beams over the waist | 4 | — |
| Stations | X = 44, 53, 62, 71 ft | 13.41 / 16.15 / 18.90 / 21.64 m |
| Section | 8 in sided × 6 in moulded, cambered | 203 × 152 mm |
| Height above the upper deck (top of skid) | 5 ft 0 in | 1.52 m |
| Span | gangway to gangway, ~24 ft 0 in clear | 7.32 m |
| Boat chocks | two per boat, shaped to the boat's bilges | — |

### 8.3 Which boats

**No boat list for Surprise 1796 was found.** What follows is **RECONSTRUCTED** from period
practice for a ~578-ton ship of 20–24 guns.

| Boat | Length | Metric | Beam (approx.) | Stowage | Basis |
|---|---|---|---|---|---|
| **Launch** (largest; replaced the long boat in the RN from 1780) | 24 ft | 7.32 m | 7 ft 0 in / 2.13 m | on the skid beams, centreline, keel down | Steel describes the launch as "a sort of Long Boat, now most frequently taken to sea in lieu thereof … stronger, longer, more flat in its bottom" (`steel1805.txt:11338-11344`); [Wikipedia, Longboat](https://en.wikipedia.org/wiki/Longboat) |
| **Pinnace** (or barge) | 24–26 ft | 7.32–7.92 m | 5 ft 9 in / 1.75 m | nested inside the launch | "Pinnaces never row more than eight oars, whereas Barges are constructed to row with ten" — Steel `:11362-11365` |
| **Cutter** | 18–22 ft | 5.49–6.71 m | 6 ft 0 in / 1.83 m | nested, or at a quarter davit | "Ships' Cutters … are shorter, broader and deeper in proportion; they are much lighter, are clincher built" — Steel `:11366-11369` |
| **Jolly boat** | 16–18 ft | 4.88–5.49 m | 5 ft 6 in / 1.68 m | **at the stern davits** | "Jolly boats … generally between 16 feet (4.9 m) and 18 feet (5.5 m) long … normally hung from davits at the stern" — [HandWiki, Jolly boat](https://handwiki.org/wiki/Engineering:Jolly_boat) |

**Total: 4 boats** — launch + pinnace nested on the skids, cutter alongside them or on a quarter
davit, jolly boat at the stern davits. This matches the reference photograph (white boats nested
amidships on skid beams + one boat at the stern davits).

### 8.4 Davits

* **Quarter davits were introduced in the Royal Navy from the 1790s; transom (stern) davits from
  1800**; by the Napoleonic Wars stern davits were standard on warships
  ([Society for Nautical Research forum, "Invention of Davits for Ships' Boats"](https://snr.org.uk/snr-forum/topic/invention-of-davits-for-ships-boats/), via search summary — page returns 403 to direct fetch).
* **This dates the stern-davit boat in the reference photo to the very end of Surprise's RN career
  (she was sold in 1802) or to the replica's own fit.** For a strictly 1796–98 Surprise, quarter
  davits are defensible; transom davits are marginal.

**RECONSTRUCTED transom davit geometry**: two davits at Y = ±5 ft 0 in (±1.52 m), stepped on the
taffrail at X ≈ 125 ft, projecting aft 6 ft 0 in (1.83 m) and raking up ~20°; single-sheave
davit heads with a three-fold boat fall.

### 8.5 Boats — construction scantlings

Steel gives full scantling tables for long-boats, launches, pinnaces, cutters and yawls
(`steel1805.txt:43272-43700`, Folios LVII–LVIII), but that block of the archive.org scan is
too degraded to read column-by-column. **Order the printed Folio LVII/LVIII plates if boat
framing detail is needed.** The named long-boat length columns that are legible are
**39, 30, 26, 22 and 19 ft** (`:43277`).

---

## 9. GUNS, GUN PORTS AND CARRONADE SLIDES

### 9.1 Armament — three different answers, all recorded

| Configuration | Upper deck | Quarterdeck | Forecastle | Source |
|---|---|---|---|---|
| **As French UNITÉ (1794)** | 24 × 8-pdr long guns | 8 × 4-pdr long guns | — | [Wikipedia HMS Surprise (1796)](https://en.wikipedia.org/wiki/HMS_Surprise_(1796)) |
| **RN establishment for the rate** | 24 × 9-pdr | 8 × 4-pdr + 4 × 12-pdr carronades | 2 × 4-pdr chase + 2 × 12-pdr carronades | [Wikipedia HMS Surprise (1796)](https://en.wikipedia.org/wiki/HMS_Surprise_(1796)) |
| **ACTUAL armament received on board, 21 April 1798** | **24 × 32-pdr carronades** | **8 × 18-pdr carronades** | **2 × 18-pdr carronades + 2 × 4-pdr chase guns** | threedecks.org ship 6983, quoted in [search results](https://threedecks.org/index.php?display_type=show_ship&id=6983) (page returns 403 to direct fetch); repeated at [Military Wiki](https://military-history.fandom.com/wiki/HMS_Surprise_(1796)) |

**TRUSTED: the 21 April 1798 fit**, because it is a dated receipt entry, it matches the 1798
Plymouth refit that produced ZAZ3067/3068, and it is the armament she carried at the cutting-out of
HERMIONE in 1799. **Model her as an all-carronade ship with two long 4-pdr chase guns.**
(The replica in the reference photo carries 28 dummy 9-pdrs — a different, non-historic fit.)

The user's brief asks for a **12-pdr long gun** and a **32-pdr carronade**: the 12-pdr is the
armament of the *fictional* Surprise of the Aubrey–Maturin novels, not the historic ship. Both are
tabulated below.

### 9.2 Gun port layout — RECONSTRUCTED

Method: Steel says the ports are equally spaced, with "**two frames between every two ports**", so
port pitch = 3 × room-and-space; Steel's room-and-space for a 32-gun frigate is **2 ft 4¾ in**
(`steel1805.txt:47986`, last column), giving a pitch of **7 ft 2¼ in (2.19 m)**. Twelve ports a
side at that pitch span only 78 ft 11 in on a 126 ft deck, which is too tightly bunched for a
French corvette. A pitch of **8 ft 0 in (2.44 m)** spans 88 ft and leaves sensible end margins, and
puts the mainmast exactly midway between two ports. **8 ft 0 in is used below; the room-and-space
figure is recorded as the alternative.**

Port sill height above the deck: **1 ft 4 in (0.406 m)**; port fore-and-aft **2 ft 9 in (0.838 m)**;
port deep **2 ft 6 in (0.762 m)** — Steel, Form of a Contract, `:44586-44588` (a carronade-armed
vessel, so directly applicable).

Half-breadths (Y) are **RECONSTRUCTED** from the hull proportions; the true offsets are on ZAZ3067.

| Port no. (fwd→aft) | X, ft-in | X, m | Y, ft-in | Y, m | Gun |
|---|---|---|---|---|---|
| 1 | 19 ft 0 in | 5.79 | ±8 ft 6 in | ±2.59 | 32-pdr carronade |
| 2 | 27 ft 0 in | 8.23 | ±10 ft 10 in | ±3.30 | 32-pdr carronade |
| 3 | 35 ft 0 in | 10.67 | ±12 ft 7 in | ±3.84 | 32-pdr carronade |
| 4 | 43 ft 0 in | 13.11 | ±13 ft 11 in | ±4.24 | 32-pdr carronade |
| 5 | 51 ft 0 in | 15.54 | ±14 ft 9 in | ±4.50 | 32-pdr carronade |
| 6 | 59 ft 0 in | 17.98 | ±15 ft 2 in | ±4.62 | 32-pdr carronade |
| 7 | 67 ft 0 in | 20.42 | ±15 ft 3 in | ±4.65 | 32-pdr carronade |
| 8 | 75 ft 0 in | 22.86 | ±15 ft 2 in | ±4.62 | 32-pdr carronade |
| 9 | 83 ft 0 in | 25.30 | ±14 ft 10 in | ±4.52 | 32-pdr carronade |
| 10 | 91 ft 0 in | 27.74 | ±14 ft 3 in | ±4.34 | 32-pdr carronade |
| 11 | 99 ft 0 in | 30.18 | ±13 ft 5 in | ±4.09 | 32-pdr carronade |
| 12 | 107 ft 0 in | 32.61 | ±12 ft 2 in | ±3.71 | 32-pdr carronade |

Plus: **bow chase ports in the beakhead bulkhead** (formed by the third stanchion out from the
centreline each side — Steel `:17849-17851`) and **stern chase ports in the counter** (Steel
`:44582`, "a bow and stern chase"). The two long 4-pdrs are the chase guns.

**Quarterdeck carronade slides — 8 × 18-pdr, 4 per side** (RECONSTRUCTED stations, quarterdeck
running X = 78 → 126 ft):

| No. | X, ft-in | X, m | Y, ft-in | Y, m |
|---|---|---|---|---|
| QD 1 | 83 ft 0 in | 25.30 | ±13 ft 6 in | ±4.11 |
| QD 2 | 91 ft 0 in | 27.74 | ±13 ft 0 in | ±3.96 |
| QD 3 | 99 ft 0 in | 30.18 | ±12 ft 2 in | ±3.71 |
| QD 4 | 107 ft 0 in | 32.61 | ±11 ft 0 in | ±3.35 |

**Forecastle carronade slides — 2 × 18-pdr, 1 per side** (RECONSTRUCTED):

| No. | X, ft-in | X, m | Y, ft-in | Y, m |
|---|---|---|---|---|
| FC 1 | 25 ft 0 in | 7.62 | ±10 ft 0 in | ±3.05 |

**Carronade port sizes:** Steel gives carronade ports "3 ft 2 in" fore-and-aft for the smaller
classes against 2 ft 5 in – 2 ft 9 in for gun ports (`:39418-39423` region, forecastle/quarterdeck
tables). Carronade ports are **wider and shallower** than gun ports because the piece is short and
must train widely. Iron work to carronade ports: ring bolts 1 in dia with 4 in rings; eye bolts
1 in dia with 2 in eyes (Steel `:39525-39530`, small-ship columns).

### 9.3 Ordnance dimensions

**Long guns** (iron, sea service, mensuration of 1753 — Falconer, *Universal Dictionary of the
Marine*, 1776, [archive.org](https://archive.org/details/universaldiction00falc_0), `falconer.txt:4775-4785`):

| Nature | Barrel length | Metric | Weight | Metric |
|---|---|---|---|---|
| 12-pdr | 9 ft 0 in | 2.743 m | 32 cwt 3 qr 3 lb | 1665 kg |
| 9-pdr | 8 ft 6 in | 2.591 m | 27 cwt 2 qr 2 lb | 1399 kg |
| 6-pdr | 7 ft 0 in ⚠ | 2.134 m | 17 cwt 1 qr 14 lb | 883 kg |
| 4-pdr | 6 ft 0 in | 1.829 m | 12 cwt 2 qr 13 lb | 641 kg |

**Blomefield 12-pdr (1790 pattern, the type Surprise would have carried had she been
12-pdr-armed):** 9 ft 0 in (2.743 m) long, **34¾ cwt (1765 kg)**; an 8 ft 6 in (2.591 m) variant at
33¼ cwt (1689 kg). Calibre **120.7 mm (4.75 in)**; shot 5.8 kg.
[Wikipedia, 12-pounder long gun](https://en.wikipedia.org/wiki/12-pounder_long_gun).

**32-pdr carronade:** bore **6.35 in (161 mm)**; barrel **4 ft 0 in (1.219 m)** long (some sources
give up to 6 ft / 1.83 m for later patterns); weight **17 cwt (864 kg)**; mounted on a **slide**,
not a truck carriage. Sources: [Wikipedia, 32-pounder gun](https://en.wikipedia.org/wiki/32-pounder_gun)
(calibre 6.3–6.41 in / 160–163 mm); [RMG print, 32-pounder carronade (1796)](https://prints.rmg.co.uk/products/32-pounder-carronade-1796-j0015).
**Trusted: 4 ft 0 in barrel, 17 cwt** — that is the 1790s Carron pattern and matches the RMG 1796
drawing; the 6 ft figure belongs to later long carronades.

**18-pdr carronade (QD/fc of Surprise):** bore **5.29 in (134 mm)**; barrel **3 ft 3 in (0.99 m)**;
weight **~10 cwt (508 kg)** — **RECONSTRUCTED** by scaling the 32-pdr on the cube-root-of-shot rule;
no direct source found.

### 9.4 Truck carriage — 12-pdr long gun

**No period table for a 12-pdr carriage was recovered online.** The following is **RECONSTRUCTED**
from the proportional rules Falconer states plus the one measured datum found:

| Item | Value | Metric | Basis |
|---|---|---|---|
| Carriage length overall (brackets) | 4 ft 8 in | 1.42 m | ≈ 0.52 × barrel length; **RECONSTRUCTED** |
| Carriage width over the trucks | 3 ft 2 in | 0.965 m | must clear a 2 ft 9 in port with the tackles; **RECONSTRUCTED** |
| Bracket (cheek) height at the fore end | 1 ft 8 in | 0.508 m | set by the port sill at 1 ft 4 in; **RECONSTRUCTED** |
| Fore truck diameter | 1 ft 4 in | 0.406 m | scaled from the measured 24-pdr fore truck of **18 in (457 mm)**, rear **16 in (406 mm)** — [Ships of Scale, Wheels on Truck Carriage 1777](https://shipsofscale.com/sosforums/threads/wheels-on-truck-carriage-period-including-1777-of-british-navy.15078/) |
| Rear truck diameter | 1 ft 2 in | 0.356 m | as above — the rear truck is **smaller** to compensate for the deck's camber/slope, which helps check recoil |
| Truck thickness | equal to the bracket thickness | — | "The breadth of the wheels is always equal to that of the cheeks" — Falconer `falconer.txt:4632` |
| Bracket thickness | 4 in | 102 mm | **RECONSTRUCTED** |

Carriage parts named by Falconer (`falconer.txt:4600-4630`), useful as a modelling checklist:
cap-squares (clamps), eye-bolts, joint bolts, cheeks, transom bolt, **bed** bolt (the bed supports
the breech under the quoin), hind axle-tree bolts, **breeching bolts with rings**, **loops/eye-bolts
for the gun tackles**, fore axle-tree and trucks, hind axle-tree and trucks, linch-pins.

Height rule: "the height of the cheeks and diameter of the trucks must conform to the height of the
gun-ports above the deck. The carriages … should be so formed that when the breech of the cannon
lies upon the hind axle-tree, the muzzle of the piece should touch above the port" — Falconer
`falconer.txt:4633-4638`. **Use this to derive the carriage height from the 1 ft 4 in sill and
2 ft 6 in port depth rather than guessing.**

### 9.5 Carronade slide

**RECONSTRUCTED** (Carron pattern, 1790s):

| Item | 32-pdr | Metric |
|---|---|---|
| Slide (lower bed) length | 5 ft 0 in | 1.52 m |
| Slide width | 1 ft 4 in | 0.406 m |
| Upper carriage (chock/slider) length | 2 ft 6 in | 0.762 m |
| Pivot bolt at the fore end of the slide, into the port sill | 1½ in dia | 38 mm |
| Rear roller / traverse trucks | 2, 6 in dia | 152 mm |
| Elevating screw through the cascabel | 1½ in dia | 38 mm |
| Total height, muzzle axis above deck | 2 ft 8 in | 0.813 m |

The carronade pivots on a bolt through the port sill and traverses on the slide's rear trucks,
which is why the **carronade port is wider than a gun port** and why **no breeching-bolt pattern
appears in the ship's side** for carronade positions on some ships.

### 9.6 Breeching and tackle

| Item | Value | Metric | Source |
|---|---|---|---|
| Breeching rope circumference | **4–7 in depending on calibre and era**; ≈ **0.95 × the bore diameter** | 102–178 mm | [Ships of Scale, Rigging gun carriages](https://shipsofscale.com/sosforums/threads/rigging-gun-carriages.16785/) (via search summary; page blocks direct fetch) |
| → for a 12-pdr (bore 4.75 in) | **4½ in circumference** (≈1.4 in / 36 mm diameter) | 114 mm circ. | derived from the 0.95 rule — **RECONSTRUCTED** |
| Breeching length | "of sufficient length to let the **muzzle of the cannon come within the ship's side** to be charged" | — | Falconer `falconer.txt:3665-3667` |
| → practical length | ≈ 3 × barrel length = **27 ft (8.23 m)** for a 12-pdr | 8.23 m | **RECONSTRUCTED** from the recoil requirement |
| Breeching rove | middle **seized to the cascabel/pomiglion**; the two ends pass **through the ring-bolts on the sides of the carriage** and are **clinched to ring-bolts in the ship's side** | — | Falconer `:3659-3663`, `:3671-3675` |
| Gun tackles | **two**, one each side, hooked to the loops/eye-bolts on the carriage brackets and to eye-bolts in the ship's side beside the port | — | Falconer `:4627`, `:4713-4714` |
| **Train tackle** | **one**, hooked to the rear of the carriage and to an eye-bolt in the deck on the centreline side; **for guns under 32-pdr, two single blocks**; 32-pdr and heavier, a single and a double | — | [Ships of Scale, Rigging gun carriages](https://shipsofscale.com/sosforums/threads/rigging-gun-carriages.16785/) (search summary) |
| Housed (secured) | breeching frapped, tackles bowsed taut, muzzle lashed up to an eye-bolt above the port | — | Falconer `:4727-4732`, `:8548` |
| Ring bolts in the ship's side per port | **two ring bolts + two eye bolts**, 1¼ in dia, rings 3½ in in the clear; deck bolts ¾ in; **stopper bolts 1¼ in** | 32 mm / 89 mm / 19 mm | Steel contract `:44588-44593` |

---

## 10. CHANNELS, DEADEYES AND CHAINPLATES

Steel 1805, "OUTBOARD" table, **32-gun frigate column** (`steel1805.txt:41929-41985`).
**Athwartship values here will be slightly generous for Surprise's narrower hull.**

| Item | Main | Fore | Mizzen | Source line |
|---|---|---|---|---|
| **Length** | **22 ft 9 in / 6.934 m** | **20 ft 0 in / 6.096 m** | **14 ft 0 in / 4.267 m** | `:41929`, `:41940`, `:41952` |
| Thickness at the inner edge | 5 in / 127 mm | 5 in / 127 mm | 4½ in / 114 mm | `:41930`, `:41941`, `:41953` |
| Thickness at the outer edge | 3¾ in / 95 mm | 3¾ in / 95 mm | 3½ in / 89 mm | `:41931`, `:41942`, `:41954` |
| **Breadth (projection from the side)** | "sufficient to clear the shrouds of the roughtree rail"; **1 ft 8 in / 0.508 m** for the large classes | 1 ft 8 in / 0.508 m | 1 ft 8 in / 0.508 m | `:41932`, `:41943`, `:41955` |
| Foremost end **forward of the mast centre** | **7 in / 178 mm** | **7 in / 178 mm** | **6 in / 152 mm** | `:41935`, `:41946`, `:41958` |
| Upper edge, vertical position | in line with the **upper edge of the sheer rail / top-timber line**; the fore channel is in the **same range as the main**; the mizzen channel is **1 ft 0 in (0.305 m) above** the range of the main | — | — | `:41936-41938`, `:41956-41957`, and `:15764-15766` |
| Bolts through the channel | **seven**, 1⅛ in / 29 mm | **six**, 1⅛ in / 29 mm | **five**, 1 in / 25 mm | `:41938-41939`, `:41947-41948`, `:41959-41960` |
| **Iron T-plates / supporters (in lieu of wood knees)** | **five** | **four** | **two** | `:41961-41962`, `:41984` |
| T-plate iron, broad | 3 in / 76 mm | 3 in | 3 in | `:41963` |
| T-plate thick at the shoulder / toe | 1⅛ in / 1 in | as main | as main | `:41964-41965` |
| T-plate length below the upper side of the channel | ~3 ft 6 in / 1.07 m ⚠ | as main | — | `:41966` |
| T-plate weight | ~1 cwt 0 qr (50.8 kg) | — | — | `:41970` |
| The fore channel **tapers at its after end to stow the anchor** | — | ✔ | — | `:41944` |

**Deadeyes** — Steel's dedicated table (Folio LIV, `:42074-42100`) is legible only in the 110/98
columns. Numbers for a 32-gun frigate, **RECONSTRUCTED** by scaling and cross-checked against
Steel's contract clause for a small vessel ("six dead eyes for the main channel of 10 inches
diameter; five … for the fore channels", `:44675-44680`):

| Item | Main | Fore | Mizzen | Basis |
|---|---|---|---|---|
| Deadeyes for shrouds, each side | **9** | **8** | **5** | **RECONSTRUCTED** (Steel gives "seven / six" mizzen deadeyes for the 110/98) |
| Shroud deadeye diameter | 11 in / 279 mm | 11 in / 279 mm | 8 in / 203 mm | **RECONSTRUCTED** |
| Shroud deadeye thickness | 6 in / 152 mm | 6 in / 152 mm | 4½ in / 114 mm | **RECONSTRUCTED** |
| Breast-backstay deadeyes | 3 | 3 | — | Steel `:42081-42084` (three, both large classes) |
| Topmast-backstay deadeye, in the after end | 1, 9 in / 229 mm dia | 1 | 1, 8 in | Steel `:42085-42086`, scaled |
| Topgallant-backstay deadeye | 1, 7 in / 178 mm dia | 1 | 1, 6 in | Steel `:42087-42088`, scaled |
| **Backstay stool abaft the mizzen channel** | — | — | length ~1 ft 8 in, broad 1 ft 6 in, thick 3½ / 3 in | Steel `:42095-42099`, scaled |

**Chains / chainplates and preventer links** — Steel `:42101-42125`:

| Item | Main & fore | Mizzen | Source |
|---|---|---|---|
| Deadeye **binding** (iron strop) diameter | 1⅛ in / 29 mm (scaled from 1¾ in on a 110) | 1 in / 25 mm | `:42107-42109` |
| Chain (chainplate) iron size | 1⅛ in / 29 mm | 1 in / 25 mm | `:42110`, `:42115` |
| **Chain bolt diameter** | 1½ in / 38 mm | 1¼ in / 32 mm | `:42111`, `:42116` |
| **Preventer bolt diameter** | 1¼ in / 32 mm | — | `:42112` |
| **Chain bolt driven below the channel** | **3 ft 6 in / 1.07 m** (110-gun: 4 ft 6 in) | ~3 ft 0 in / 0.91 m | `:42117`, scaled |
| Preventer eye-bolts between the chain bolts, main & fore | **five**, 1 in dia, eyes 3 in in the clear | — | `:42118-42120` |
| Preventer eye-bolts, mizzen | **three**, 1 in dia, eyes 2¼ in | — | `:42121-42123` |
| Swivel ring bolts, two in each channel | 1¼ in dia, eyes 2¼ in | — | `:42124-42125` |

**Geometry to build:** the chainplate runs from the deadeye strop at the outer edge of the channel,
**down and forward** to a chain bolt driven **3 ft 6 in (1.07 m) below the underside of the
channel** — i.e. the chain rakes aft-to-forward at the same angle as the shroud above it, so
shroud and chain are in one straight line through the deadeye. **Preventer links (short iron
straps) are bolted between the chain bolts** to spread the load into the wale.

Timbers in the range of the main and fore channels **run up to the top of the side**, and the
frames are filled solid in wake of the channels (Steel `:16879`, `:47089`).

---

## 11. HEAD STRUCTURE

### 11.1 Head rails

> "The rails of the head are distinguished by the **Lower, Middle, Main, and Upper Rails**."
> — Steel `steel1805.txt:4172-4173`

**Four head rails per side**, plus the **false rail** bolted to the main rail
(Steel `:41199-41200`: "the false rail to be sided [5 in for a small ship]; bolted to the main rail
with bolts ⅝ in diameter"). The forward ends of all rails are terminated by the **hair bracket**,
a moulding running into the back of the figurehead (Steel `:3043`).

Rail curvature: the rails run in a compound reverse curve — concave in profile from the cathead
forward and down to the hair bracket, convex in plan sweeping out from the stem to the cathead.
Steel's mould-loft instruction is "the customary method is to set the head rails to the after
timber…" (`:21404`). **No dimensioned curve is published; take the curve directly off ZAZ3067,
which shows the figurehead and head profile.**

| Item | 32-gun value | Metric | Source |
|---|---|---|---|
| False rail, sided | ~4½ in ⚠ | 114 mm | Steel `:41199` |
| Bolt to main rail | ⅝ in | 16 mm | Steel `:41200` |
| **Head timbers** (vertical pieces crossing the rails) | number not tabulated; **4 per side is the Sixth-Rate norm — RECONSTRUCTED** | — | definition Steel `:3133` |
| Carling each side of the gammoning, sided × deep | 4½ in × 5¼ in ⚠ | 114 × 133 mm | Steel `:41201-41202` |
| Ledges framing the flat of the head, broad × deep | 2 in × 2¼ in | 51 × 57 mm | Steel `:41205-41206` |
| Cheeks | upper and lower, knee'd between the hull under the hawse holes and the stem | — | Steel `:1985` |
| Bolsters (naval hoods) under the hawse holes | project from the cheeks 1½ in (38 mm); six bolts, 1 in | 38 mm | Steel `:41221-41224` |
| Gripe | elm, sided as the knee of the head | — | Steel `:41236-41238` |

### 11.2 Seats of ease and round-houses

* Steel's contract specification says only "**Seats of Ease, &c., as directed**" (`:41211`) —
  i.e. they were left to the dockyard, and **no dimensioned drawing is published**.
* **Two round-houses** (enclosed privies) are built into the **beakhead bulkhead**, one each side.
  Steel: when drawing the beakhead, "keep the two outer stantions to the size of the
  **round-houses**, and so that they may be kept far enough out for the funnel to come clear of the
  side" (`:17846-17849`). The upper part of the round-houses shows on the forecastle plan
  (`:17915-17916`), and the knee under the cat beam prevents a door at their after side, so they
  are shown **enclosed** and clear of the foremost gun (`:17913-17915`).
* **Open seats of ease** sit on the grating platform of the head between the rails, each side of the
  knee of the head. The head rails also serve as **the guard rail "so no seaman could fall down when
  sitting on the seat of ease"** ([Ships of Scale, "What is the purpose of these things? (headrails)"](https://shipsofscale.com/sosforums/threads/what-is-the-purpose-of-these-things-headrails.13556/)).
* By the late 18th century **three rows of multiple seats became common on larger ships**, with
  fewer than one seat per hundred men ([Wikipedia, Beakhead](https://en.wikipedia.org/wiki/Beakhead)).
* **RECONSTRUCTED for Surprise: 2 round-houses in the beakhead bulkhead + 2 open seats in the head**
  (one each side of the knee of the head, on the head grating at X ≈ 3 ft 0 in / 0.91 m forward of
  the stem, Y = ±2 ft 6 in / ±0.76 m).

### 11.3 Beakhead bulkhead

Steel's construction sequence (`:17843-17855`) gives the exact stanchion count and what each one
does — this is a complete recipe for the geometry:

1. Draw the **collar beams/carlings** at the height of the beakhead, to their siding, abaft the fore
   part of the beakhead; the **stanchions** stand on them.
2. **Outermost stanchion each side** — set to the width of the **round-house**, and far enough out
   for the **galley funnel to clear the side**.
3. **Third stanchion in from the centreline** — spaced to make the **bow chase port**.
4. **Next stanchion inboard** — makes the **head door**.
5. **Stanchion next the centreline** — the large stanchion into which the collar carling is tenoned.
6. On the midship side of the head door, a **scuttle with a hung flap**, through which the **fore
   tack leads inboard to the capstan** when required.

So: **five stanchions each side of the centreline**, and the bulkhead carries **2 head doors,
2 bow chase ports, 2 round-houses and 2 tack scuttles**. **Bulkhead station: X = 0 ft (the fore
side of the forecastle deck line), rounded aft in plan** — Steel's beakhead bulkheads round aft.

### 11.4 Gammoning and bowsprit partners

| Item | 32-gun frigate | Metric | Source |
|---|---|---|---|
| **Gammoning holes, number** | **two** | — | Steel `:41225` |
| Gammoning hole, length | 1 ft 1 in ⚠ (110-gun: 1 ft 4 in) | 0.33 m | Steel `:41226` |
| Gammoning hole, depth | 2 in ⚠ (110-gun: 3½ in) | 51 mm | Steel `:41227` |
| Position | cut through the **knee of the head**, between the cheeks, abaft the figure | — | Steel `:2914` |
| Carlings fore-and-aft each side of the gammoning | sided 4½ in, deep 5¼ in ⚠ | 114 × 133 mm | Steel `:41201-41202` |
| **Bobstay holes, number** | **two** | — | Steel `:41228` |
| Bobstay hole diameter | 4 in ⚠ (110-gun: 5½ in) | 102 mm | Steel `:41229` |
| Position | cut through the **fore part of the knee of the head**, below the [lower cheek] | — | Steel `:1537`, `:15374-15376` |
| Bobstay eye-bolt, one each side, through the knighthead in the lower piece of the wale | 1½ in dia, eyes 2½ in in the clear | 38 / 64 mm | Steel `:41231-41233` |
| **Bowsprit step** | multi-piece, rabbetted together, bolted athwartships with three bolts; sits **close before the foremast partners** on the deck below | — | Steel `:33610-33620`, `:17736-17737` |
| Bowsprit partners | beam under the bowsprit, sided and moulded per the forecastle table (frigate column not legible) | — | Steel `:39538-39542` |
| **Bowsprit stive** | Steel's row "Bowsprits to stive upwards, in a yard in length" is truncated in the scan (`:33404`); the period norm is **~1 ft in 3 ft ≈ 18–20°** for a frigate — **RECONSTRUCTED** | — | — |
| Boomkins | one each side, length sufficient to plumb the outer end of the fore yard braced sharp; outer end ~1 ft 1½ in × 1 ft 3 in (fir) | 0.34 × 0.38 m | Steel `:41207-41212` |
| Iron horses in the head | 2 in dia, with stanchions 1½ in dia | 51 / 38 mm | Steel `:41213-41215` |

---

## 12. STERN

### 12.1 What a Sixth Rate has

> "the stern … comprehends, in the intermediate space, in large ships, the ward-room lights and
> galleries; and, **in small ships, the great cabin windows only**." — Steel `steel1805.txt:15381-15383`

So Surprise has **one tier of stern lights (the great cabin), no wardroom tier**, terminated above
by the taffrail and below by the counters, and bounded on the sides by the quarter pieces.

ZAZ3067 shows "the body plan with **sternboard decoration and name in a cartouche on stern
counter**" ([RMG](https://www.rmg.co.uk/collections/objects/rmgc-object-82858) and the parallel Unite
plan ZAZ3181) — so **model a carved cartouche on the counter bearing the name.**

### 12.2 Number and proportion of lights

**No source states the number of stern lights on Surprise.** Steel's design rule
(`:15395-15399`) is the one usable guide:

> "If a stern be unavoidably deep … the lights [are] **less in number and deep also**; and some light
> carved work or device should be formed between the head of the lights and taffarel."

**RECONSTRUCTED for a 31 ft 8 in beam Sixth Rate: five stern lights** across the great cabin, each
**2 ft 0 in (0.61 m) wide × 3 ft 0 in (0.91 m) high**, with **munions 6 in (152 mm) wide** between
them; sash bars dividing each light into 6 panes (2 wide × 3 high). Total glazed width
5 × 2 ft + 4 × 6 in = 12 ft 0 in (3.66 m), which suits a stern ~16 ft (4.88 m) wide at the taffrail.

Stern rails, named from the bottom up (Steel `:4173-4175`): **Tuck rail → Lower counter rail →
Upper counter rail → Taffarel rail → Taffarel fife rail.** Each rail must have "a handsome round-up
and round-aft … each rail continuing to have more round-up in proceeding upwards" (`:15386-15389`).

### 12.3 Quarter galleries

> "The heights of the Quarter-Galleries depend upon the stern; but, to make them handsome, **the
> lower-rim should be as long as possible, and may spread within a few inches, if necessary, of the
> main-breadth amidships**." — Steel `:15404-15409`

That is a directly usable modelling constraint: **the outer face of the quarter-gallery lower rim
comes within a few inches of Y = ±15 ft 10 in (±4.83 m), i.e. the extreme half-breadth.**

Parts to model (Steel definitions): **lower stool, upper stool, bell-top** (`:1380`, "a term applied
to the top of a quarter gallery when the upper stool is hollowed"), the **finishing** at the aft
part (`:2634`), and the **quarter piece** connecting the gallery to the stern and taffrail (`:4131`).

**RECONSTRUCTED for Surprise:** closed quarter galleries (French corvette practice favoured light
*bouteilles*), **two lights in each gallery** facing aft-outboard, lower rim length ~7 ft 0 in
(2.13 m), height ~5 ft 0 in (1.52 m), bell-top.

### 12.4 Taffrail and stern lanterns

| Item | Value | Source |
|---|---|---|
| Taffrail | "the upper part of the ship's stern, usually ornamented" | Steel `:5117` |
| Cove | arched moulding sunk in at the foot of the taffrail | Steel `:2346` |
| Necking | small moulding at the foot of the taffrail over the lights | Steel `:3845` |
| Term / term pieces | carved work under each end of the taffrail | Steel `:5148` |
| Truss pieces | "short pieces of carved work, **mostly in small ships**, fitted under the taffarel" | Steel `:5259` |
| Taffrail transom, thick | 4½ in (114 mm), knee'd at each end with one iron knee ~1 cwt; f&a arm 4 ft 9 in (1.45 m), thwartship arm 3 ft 2 in (0.97 m), seven bolts | Steel `:39533-39537` |
| Transom above the taffrail, in the clear | 10 in (254 mm), broad 10 in, deep 4 in | Steel `:39538-39540` |
| **Stern lanterns** | supported on **CRANKS — "pieces of iron … driven in the upper part of the taffarel, to support the stern lanterns"**; Steel's illustration for this is the **Sloop of War, Plate 10**, i.e. small ships did carry them | Steel `:2371-2374` |
| Transporting blocks | two snatch blocks fitted each side **above the taffrail** | Steel `:5238` |
| Horse for the main sheet | made by the taffrail transom, sided 6½ in (165 mm) | Steel `:44682-44686` |
| Ensign staff | secured in the stern timbers | Steel `:44700-44702` |

**RECONSTRUCTED: one stern lantern** on the centreline of the taffrail (Sixth Rates carried one;
ships of the line three). Copper-and-glass, ~2 ft 0 in (0.61 m) high, 1 ft 3 in (0.38 m) across,
octagonal, on an iron crank. The replica may show more — check the reference photo.

---

## 13. ANCHORS

### 13.1 Weight and number

Steel 1805, Folio LVI "Dimensions and Weight of Anchors" (`steel1805.txt:43198-43222`):

| Class | 110 | 98 | 80 | 74 | 64 | 50 | 44 | 38 | 36 | **32** |
|---|---|---|---|---|---|---|---|---|---|---|
| **Bower anchor weight, cwt** | 83 | 81 | 73 | 71 | 67 | 57 | 49 | 44 | 40 | **34** |

**Surprise (578 tons bm) ≈ 34 cwt = 1 tonne 727 kg per bower anchor.**
(Comparison: HMS Victory's bowers were 8,400 lb / 75 cwt / 3,810 kg with a stock "more than
23 feet wide" — [USNI, Anchors Aweigh](https://www.usni.org/magazines/naval-history-magazine/2021/june/anchors-aweigh).)

**Anchor stocks: four large, two small** in every class, Steel `:43220-43221`. That implies the
outfit is **four large anchors** (best bower, small bower, sheet, spare) **+ two small** (stream and
kedge) — **six anchors, four of them catted-size.** The two bowers hang at the catheads; the sheet
anchor is stowed on the fore channel; the spare is stowed inboard on the booms or on the fore
channel of the other side.

### 13.2 Shank and stock

Steel's stock-length row is legible only for the larger classes: **22 ft 0 in / 21 ft 9 / 20 ft 6 /
20 ft 0 / 19 ft 6 / 19 ft 0 / 18 ft 6 / 17 ft …** (`:43221`), truncated before the 32-gun column.

**RECONSTRUCTED by cube-root-of-weight scaling from the 110-gun (83 cwt, 22 ft 0 in stock):**
(34/83)^⅓ = 0.744 → **22 ft × 0.744 = 16 ft 5 in**. This sits correctly on the end of Steel's own
series.

| Item | Value | Metric | Status |
|---|---|---|---|
| **Stock length** | **16 ft 6 in** | **5.03 m** | **RECONSTRUCTED** (rule + Steel's series) |
| **Shank length** (Admiralty long-shank: shank = stock) | **16 ft 6 in** | **5.03 m** | **RECONSTRUCTED**; the period rule is that the stock equals the shank |
| Stock, square at the middle | 1 ft 3 in | 0.38 m | **RECONSTRUCTED**, scaled from Steel's 1 ft 10 in / 1 ft 9¼ / 1 ft 8¼ / 1 ft 8 / 1 ft 7¾ series (`:43222`) |
| Stock, square at the ends | 8 in | 203 mm | **RECONSTRUCTED**, scaled from Steel `:43223` |
| Opening left between the two stock pieces at the middle | 11 in scaled → ~7 in | 178 mm | Steel `:43224` |
| Stock bolted with four bolts | ~1 in dia | 25 mm | Steel `:43225` |
| **Four iron hoops to each stock** | ~⅝ in thick × 3 in broad | 16 × 76 mm | Steel `:43226-43228` |
| Arm span (fluke tip to fluke tip) | ~9 ft 0 in (0.55 × shank) | 2.74 m | **RECONSTRUCTED**, standard long-shank proportion |
| Palm (fluke) length | ~3 ft 4 in (0.20 × shank) | 1.02 m | **RECONSTRUCTED** |
| Ring diameter | ~2 ft 2 in | 0.66 m | **RECONSTRUCTED** |

**Type: Admiralty long-shank, straight-armed, wooden stock in two pieces with four iron hoops.**
Curved (Rodgers) arms do not appear until after 1810, so straight arms are correct for 1796–98.

### 13.3 Catting and fishing (as in the reference photo)

| Element | Detail | Source |
|---|---|---|
| **Cat block** | 3-sheave block matching the **three sheaves in the outer end of the cathead**; the cat fall reeves between them | Steel `:40068-40070` |
| Cat block bolt | bolted to a **timberhead placed close forward of the cathead** | Steel `:15364-15366` |
| **Ring catted** | the anchor ring is hauled up hard under the cathead by the cat tackle and stopped there | — |
| **Shank painter** | "a **chain bolted through the topside, abaft the cathead**, to retain the [shank]" — it takes the shank/crown end and holds the anchor horizontal along the fore channel | Steel `:4552` |
| **Fish davit / fish tackle** | a spar rigged out over the fore channel; the fish hook takes the inner arm to raise the crown to the level of the cathead so the anchor lies fore-and-aft along the ship's side | — |
| **The fore channel tapers at its after end to stow the anchor** | so the fluke beds against the taper | Steel `:41944` |
| Anchor lining / bolster | oak, in length 10 ft 6 in (110-gun) → **RECONSTRUCTED ~7 ft 0 in / 2.13 m** for a 32-gun; a sacrificial plank on the topside where the fluke bears | Steel `:42535` |
| Stopper bolts / anchor stopper timberhead | a dedicated heavy timberhead abaft the cathead for the anchor stopper; stopper bolts 1¼ in (32 mm) | Steel `:40292-40294`, `:44589` |
| **Flaring bow** | "Its uses are, to shorten the Cathead, and yet keep the anchor clear of the bow" | Steel `:2755` |

**Stowed geometry to model:** anchor ring at the cathead sheave (X ≈ 8 ft, Y ≈ ±14 ft 6 in,
2 ft 6 in above the forecastle deck); shank running aft and slightly down along the topside; crown
and flukes resting on the fore channel about **X ≈ 24 ft (7.3 m)**, held by the shank painter chain
made fast to a bolt through the topside just abaft the cathead.

---

## 14. WHAT COULD NOT BE FOUND

1. **The Surprise deck plan itself (ZAZ3068).** The catalogue record exists; the image is not
   online at usable resolution. Everything in §1.1 and every "RECONSTRUCTED" station in this file
   is a substitute for one measurement off that sheet.
2. **Any published transcription of Marquardt for Surprise.** There is **no *Anatomy of the Ship*
   volume for HMS Surprise**. The nearest AOTS volumes are McKay & Coleman, *The 24-Gun Frigate
   Pandora* (1779 Sixth Rate — the closest published analogue by far) and D. White, *The Frigate
   Diana*. **Neither is accessible online; both should be bought.**
   ([Pandora on Google Books](https://books.google.com/books/about/The_24_Gun_Frigate_Pandora.html?id=dZRBhJ4NaaYC))
3. **Boat outfit for Surprise.** No document names her boats. §8.3 is entirely reconstructed.
4. **Binnacle dimensions** for any 18th-century RN ship — no dimensioned source located.
5. **Ship's bell dimensions** for a Sixth Rate.
6. **A period gun-carriage dimension table.** Only proportional rules (Falconer) and one measured
   pair of truck diameters (24-pdr: 18 in fore, 16 in rear) were recovered. Adrian Caruana,
   *The History of English Sea Ordnance* vol. II, is the source that has them; not accessible.
7. **Chain-pump and pump-dale dimensioned drawings.** Steel gives the bore (7 in) and the cistern
   but not the trunk, sprockets or dale. The published source is Oertling, *IJNA* 11 (1982).
8. **Number of stern lights, quarter-gallery lights and stern lanterns on Surprise.** Reconstructed.
9. **threedecks.org blocks automated fetching (HTTP 403).** Its Surprise page (ship id 6983) is the
   source of the 21 Apr 1798 armament receipt and should be read manually:
   `https://threedecks.org/index.php?display_type=show_ship&id=6983`
10. **Steel's Folios XLVI–XLVII (forecastle: catheads, belfry, chimney coamings) and LVII–LVIII
    (boats)** are the two table blocks whose 32-gun columns are worst damaged in the archive.org
    OCR. A clean scan of those four printed pages would resolve about a dozen ⚠ values above.
