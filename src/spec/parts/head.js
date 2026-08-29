// Dimensions for the head of the ship — stem, knee of the head, head rails, the flat
// of the head, the beakhead bulkhead, the knightheads and bowsprit partners, the
// catheads and the figurehead. See src/spec/parts/index.js for the shape of an entry
// and for the rule that every key must also appear in SPECS.md.
//
// THREE SOURCE FAMILIES ARE USED HERE, and they are not of equal weight.
//
//  * ZAZ3067 itself. The sheer/inboard profile on the ship's own draught draws the
//    head: the knee, the rails, the knightheads, the bowsprit and a small figurehead.
//    Rows marked MEASURED were read off the RMG scan
//    (collections.rmg.co.uk/media/2/440/707/j5948.jpg, 1280 x 451 px) by tracing the
//    ink. The calibration used is the one the hull offsets were extracted with:
//    6.021 px per foot of ship. Two anchors were established on the scan and every
//    measured row below is quoted against them — the stem (the forward termination of
//    the horizontal rail and wale lines of the profile) at x = 1112 px, and the rail
//    itself at y = 141 px. The check on the pair is the bowsprit: its two drawn edges
//    lie 31 px apart horizontally on a 21.8 deg slope, which is a spar 0.58 m thick
//    steeved 21.8 deg, against Steel's 23 5/8 in at 21.9 deg. That is a 3 per cent
//    agreement on a figure that was not used to derive the calibration, so the
//    calibration is sound. Individual measured rows are still only good to about
//    +/- 0.5 ft, which is a pixel or two at this scan resolution.
//
//  * Steel 1805, by way of research 06 §5.4 and §11. Scantlings — sidings, mouldings,
//    counts, the cathead's stive — come from his 32-gun frigate column, which is the
//    nearest tabulated class to a 24-gun Sixth Rate.
//
//  * The reference photograph, for what the head LOOKS like: three rails in ochre
//    against the black, gratings between them, a pale standing figure with blue
//    drapery. Per docs/PHOTO-ANALYSIS.md the photograph is trusted for paint,
//    ornament and character and for nothing dimensioned.
//
// THE FIGUREHEAD IS CONJECTURAL. Research 08 §4.1 is explicit that the figurehead of
// the 1796 Surprise / 1794 Unite is not documented in any reachable source, and §4.2
// is equally explicit that the "female figure with sword and shield" belongs to the
// film ship and must not be attributed to this one. Every figurehead_* row below is a
// reconstruction from period practice, built to research 08 §4.4's recommendation: a
// modest classical female figure, small, with trailboard scrollwork. It is a guess
// that reads correctly in silhouette. It is not evidence.
import { ft, m, n } from '../units.js';

const Z = 'MEASURED §2 ZAZ3067 sheer profile, traced off the RMG scan at 6.021 px per foot; stem at x=1112 px, rail at y=141 px';
const R6H = 'SECONDARY §6 research 06-deck-layout §11, head structure';
const R6C = 'SECONDARY §6 research 06-deck-layout §5.4, catheads';
const R6K = 'SECONDARY §6 research 06-deck-layout §5.3, knightheads';
const R8F = 'RECONSTRUCTED §8 research 08-paint-and-ornament §4.4 — CONJECTURAL: the figurehead of this ship is not documented anywhere; this is a classical female figure reconstructed from the ship\'s name and period practice, NOT the film ship\'s woman with sword and shield';

export const HEAD_SPEC = {
  // ------------------------------------------------------------------ the stem
  // The traced offset table ends the hull at one vertical station, so the rake of the
  // stem and everything forward of it lives here. The stem timber is carried a little
  // abaft that station so that it caps the fore end of the lofted shell: without the
  // overlap there is an open sliver at the bow the width of the keel.
  head_stem_siding: m(ft(1, 1), 'RECONSTRUCTED §6 Steel: the stem is sided as the keel, and the keel of this ship is sided 1 ft 1 in (SPEC.keel_siding)', { noAudit: true }),
  head_stem_aft_overlap: m(ft(0, 6), 'RECONSTRUCTED modelling allowance: how far abaft the hull\'s foremost station the stem timber is carried, so that it closes the fore end of the lofted shell', { noAudit: true }),
  head_stem_head_above_rail: m(ft(0, 9), `${Z}: the stem head between the knightheads reads 4 to 5 px above the rail line`, { noAudit: true }),

  // -------------------------------------------------- the knee of the head
  // The cutwater. Its fore edge is a single fair curve from the forefoot up and forward
  // to the hair bracket, and it is the line that decides whether the bow looks like a
  // frigate's. Three points off the draught define it, at the waterline, at the gun
  // deck and at its head.
  head_knee_siding: m(ft(0, 11), 'RECONSTRUCTED §6 Steel :41236 the gripe is sided as the knee of the head; a knee slightly thinner than the stem it lies against', { noAudit: true }),
  head_knee_projection: m(ft(12, 0), `${Z}: the foremost ink of the head stands 75 px forward of the stem`, { noAudit: true }),
  head_knee_top_above_rail: m(ft(0, 0), `${Z}: the top of the knee under the hair bracket runs out level with the rail`, { noAudit: true }),
  head_knee_forward_at_deck: m(ft(9, 6), `${Z}: the cutwater's fore edge crossing the gun-deck line`, { noAudit: true }),
  head_knee_forward_at_waterline: m(ft(4, 0), 'RECONSTRUCTED: the cutwater at the load waterline. The draught shows the stem raking aft below the water, which the traced offset table does not carry, so the fore edge is kept plumb over the hull\'s own forefoot here rather than crossing behind it', { noAudit: true }),
  // The upper edge of the knee, from the ship's side at the wale up to the hair
  // bracket: the fraction of its rise made at a fraction t of its run is t raised to
  // this power, so a figure below 1 is an edge that lifts away from the bow quickly and
  // flattens as it runs into the figure, which is how ZAZ3067 draws it.
  head_knee_upper_exponent: n(0.8, `${Z}: read off the upper edge of the knee`, { noAudit: true }),
  head_knee_length: m(ft(12, 6), `${Z}: the knee and stem together, from the aft face of the stem timber to the hair bracket — the fore-and-aft extent of the built piece`, { tolerance: 0.05 }),

  // The cheeks: the knee'd brackets that carry the knee of the head back onto the bow
  // under the hawse holes, and take the thrust of the head rails.
  head_cheek_count: n(2, 'SECONDARY §6 Steel :1985, an upper and a lower cheek each side', { noAudit: true }),
  head_cheek_sided: m(ft(0, 6), 'RECONSTRUCTED §6 a cheek rather lighter than the knee it is bolted to', { noAudit: true }),
  head_cheek_moulded: m(ft(0, 9), 'RECONSTRUCTED §6 as above', { noAudit: true }),
  head_cheek_aft_from_stem: m(ft(9, 0), `${Z}: the after ends of the cheeks fair into the bow about 54 px abaft the stem`, { noAudit: true }),

  // ------------------------------------------------------------- the head rails
  // Steel names four rails and a false rail. The reference photograph shows three, and
  // per docs/PHOTO-ANALYSIS.md the photograph decides character, so three are built.
  head_rail_count: n(3, 'SECONDARY §8 the reference photograph shows three rails curving up to the figurehead; Steel :4172 names four (lower, middle, main, upper) plus a false rail, so this is the photograph\'s reading of a four-rail arrangement', { tolerance: 0.001 }),
  head_rail_sided: m(ft(0, 5), 'SECONDARY §6 Steel :41199, the false rail sided 5 in for a small ship', { noAudit: true }),
  head_rail_moulded: m(ft(0, 7), 'RECONSTRUCTED §6 a rail rather deeper than it is broad, as the draught draws them', { noAudit: true }),
  // How the rail rises against its run: the fraction of its total rise reached at a
  // fraction s of its length is s raised to this power, so a figure above 1 is a rail
  // that lies flat off the bow and sweeps up into the figure. Fitted to four points
  // traced off the lowest rail on ZAZ3067 — at 2.3, 4.5, 6.8 and 10.0 ft forward of the
  // stem the rail has made 0.20, 0.38, 0.58 and 0.90 of its rise, against 0.20, 0.38,
  // 0.58 and 0.90 for an exponent of 1.25.
  head_rail_profile_exponent: n(1.25, `${Z}: fitted to four points on the lowest rail`, { noAudit: true }),

  // Each rail is fixed by three things: where it lands on the ship's side, how high its
  // fore end stands at the hair bracket, and how far out it bows in plan. The three
  // after ends fan down and aft from the cathead to the bow; the three fore ends
  // converge on the head of the knee.
  head_rail_lower_aft_from_stem: m(ft(1, 0), `${Z}: the lowest rail runs into the ship's side within a foot of the stem, at about the gun-deck line`, { noAudit: true }),
  head_rail_lower_fore_above_rail: m(ft(0, 6), `${Z}`, { noAudit: true }),
  head_rail_lower_half_breadth: m(ft(3, 6), 'RECONSTRUCTED: no plan view of the head is published; the widest point of the lowest rail, set inside the middle rail', { noAudit: true }),
  head_rail_middle_aft_from_stem: m(ft(6, 0), `${Z}`, { noAudit: true }),
  head_rail_middle_fore_above_rail: m(ft(1, 6), `${Z}`, { noAudit: true }),
  head_rail_middle_half_breadth: m(ft(5, 0), 'RECONSTRUCTED: as head_rail_lower_half_breadth', { noAudit: true }),
  head_rail_main_aft_from_stem: m(ft(12, 0), 'SECONDARY §6 Steel :15364, the after end of the main head rail bolts to the same timberhead the cat block does, so it ends at the cathead', { noAudit: true }),
  head_rail_main_fore_above_rail: m(ft(2, 6), `${Z}: the uppermost rail runs into the back of the figure about 15 px above the rail line`, { noAudit: true }),
  head_rail_main_half_breadth: m(ft(6, 6), 'RECONSTRUCTED: the main rail sweeps out nearly to the cathead in plan', { noAudit: true }),

  head_timber_count: n(4, `${R6H}: Steel :3133 defines the head timbers but tabulates no count; four a side is the Sixth-Rate norm — RECONSTRUCTED`, { noAudit: true }),
  head_timber_sided: m(ft(0, 5), 'RECONSTRUCTED §6 a head timber sided as the rails it crosses', { noAudit: true }),
  head_timber_moulded: m(ft(0, 4), 'RECONSTRUCTED §6 as above', { noAudit: true }),

  // ------------------------------------------- the flat of the head and its gratings
  head_grating_aft_from_stem: m(ft(1, 0), 'RECONSTRUCTED: the after end of the flat of the head, where it meets the bow', { noAudit: true }),
  head_grating_forward_of_stem: m(ft(8, 0), 'RECONSTRUCTED: the fore end of the flat, short of the hair bracket', { noAudit: true }),
  head_grating_above_lower_rail: m(ft(0, 4), 'RECONSTRUCTED: the ledges and gratings laid on top of the lowest rail', { noAudit: true }),
  head_ledge_sided: m(ft(0, 2), 'SECONDARY §6 Steel :41205, ledges framing the flat of the head, 2 in broad', { noAudit: true }),
  head_ledge_moulded: m(ft(0, 2.25), 'SECONDARY §6 Steel :41206, 2 1/4 in deep', { noAudit: true }),
  head_grating_batten_square: m(ft(0, 2), 'SECONDARY §6 Steel :1293, grating battens about 2 in square', { noAudit: true }),
  head_grating_batten_gap: m(ft(0, 2), 'SECONDARY §6 Steel :2968, laid to leave about 2 in openings', { noAudit: true }),

  head_seat_count: n(2, `${R6H} §11.2: Steel :41211 says only "Seats of Ease, &c., as directed"; two open seats on the flat, one each side of the knee — RECONSTRUCTED`, { noAudit: true }),
  head_seat_forward_of_stem: m(ft(3, 0), `${R6H} §11.2, RECONSTRUCTED position`, { noAudit: true }),
  head_seat_half_breadth: m(ft(2, 6), `${R6H} §11.2, RECONSTRUCTED position`, { noAudit: true }),
  head_seat_width: m(ft(1, 8), 'RECONSTRUCTED: a seat wide enough for one man', { noAudit: true }),
  head_seat_depth: m(ft(1, 6), 'RECONSTRUCTED: as above', { noAudit: true }),
  head_seat_height: m(ft(1, 4), 'RECONSTRUCTED: seat height above the grating', { noAudit: true }),
  head_seat_back_height: m(ft(1, 6), 'RECONSTRUCTED: the coaming behind the seat', { noAudit: true }),

  // ------------------------------------------------------- the beakhead bulkhead
  // Steel :17843-17855 gives the stanchion recipe exactly: five stanchions each side of
  // the centreline, making between them two round-houses, two bow chase ports, two head
  // doors and two tack scuttles. Research 06 §11.3 puts the bulkhead at its X = 0,
  // which is the stem — impossible, because the ship has no breadth there. It is put
  // instead at the cat beam, the foremost forecastle beam, which is where the cathead's
  // inboard arm bolts and therefore where the forecastle really ends.
  beakhead_bulkhead_from_stem: m(ft(12, 0), 'RECONSTRUCTED §6 research 06 §5.4: the cat beam is the foremost forecastle beam and the cathead root is at 12 ft, so the bulkhead stands there. Research 06 §11.3 says X = 0 ft, which cannot be right — the hull is 4 in wide at the stem', { noAudit: true }),
  beakhead_bulkhead_height: m(ft(6, 0), 'RECONSTRUCTED §6 a bulkhead tall enough to take a round-house and a head door, with its head at the forecastle rail', { noAudit: true }),
  beakhead_bulkhead_above_rail: m(ft(0, 9), 'RECONSTRUCTED §6 Steel :39518, the rough-tree rail carried round the bow above the bulkhead', { noAudit: true }),
  beakhead_bulkhead_round_forward: m(ft(1, 6), 'RECONSTRUCTED §6 Steel\'s beakhead bulkheads are rounded in plan; this ship has a round bow (ZAZ3067), so the middle of the bulkhead stands forward of its wings', { noAudit: true }),
  beakhead_stanchion_per_side: n(5, 'SECONDARY §6 Steel :17843-17855, five stanchions each side of the centreline', { noAudit: true }),
  beakhead_stanchion_sided: m(ft(0, 7), 'RECONSTRUCTED §6 a stanchion sided as a top timber', { noAudit: true }),
  beakhead_plank_thickness: m(ft(0, 3), 'RECONSTRUCTED §6 the bulkhead planked as the ship\'s side above the ports', { noAudit: true }),
  head_roundhouse_width: m(ft(2, 9), `${R6H} §11.2: Steel :17846 keeps the two outer stanchions to the size of the round-houses; no dimension is given — RECONSTRUCTED as a privy for one man`, { noAudit: true }),
  head_roundhouse_depth: m(ft(2, 6), 'RECONSTRUCTED §6 as above', { noAudit: true }),
  head_roundhouse_height: m(ft(5, 0), 'RECONSTRUCTED §6 as above', { noAudit: true }),
  head_door_width: m(ft(2, 2), 'RECONSTRUCTED §6 Steel :17849, the stanchion next inboard of the bow chase port makes the head door', { noAudit: true }),
  head_door_height: m(ft(4, 6), 'RECONSTRUCTED §6 as above', { noAudit: true }),
  bow_chase_port_width: m(ft(2, 4), 'SECONDARY §6 Steel, quarterdeck port width used for the bow chase port in the bulkhead (research 06 §9)', { noAudit: true }),
  bow_chase_port_height: m(ft(2, 4), 'SECONDARY §6 as above', { noAudit: true }),

  // --------------------------------------- knightheads, partners and the bowsprit
  // THE BOWSPRIT ITSELF IS THE RIG MODULE'S. These rows fix where it passes through the
  // head, so that the two agree. The steeve is not repeated here: bowsprit_steeve_deg
  // already exists in src/spec/parts/rig.js (21.9 deg, Steel's 28-gun column) and spec
  // keys must be unique across the ship, so this module reads that row rather than
  // defining a second one. Together bowsprit_heel_from_stem, the gun deck at that
  // station and rig's bowsprit_steeve_deg put the spar's centreline 0.51 m above the
  // rail as it crosses the stem — which is where ZAZ3067 draws it, to within 0.03 m.
  bowsprit_heel_from_stem: m(ft(14, 0), 'RECONSTRUCTED §4 research 04 §3.3: the heel steps on the gun deck on the beam next before the foremast, whose centre is 14 ft 1.5 in abaft the fore perpendicular. Checked against ZAZ3067: at rig.bowsprit_steeve_deg this puts the spar where the draught draws it crossing the stem', { noAudit: true }),
  bowsprit_heel_above_gundeck: m(ft(1, 0), 'RECONSTRUCTED §4 half the bowsprit\'s diameter, the spar lying in its step on the deck', { noAudit: true }),
  bowsprit_partner_thickness: m(ft(0, 6), 'RECONSTRUCTED §6 Steel :39538 tabulates the bowsprit partners but the frigate column is not legible; the thickness of the capstan partners is used', { noAudit: true }),
  bowsprit_chock_length: m(ft(2, 6), 'SECONDARY §6 Steel :15357, a chock between the knightheads for the better security of the bowsprit', { noAudit: true }),

  knighthead_half_breadth: m(ft(1, 2), `${R6K}: immediately each side of the stem head, from Steel :15347's stem half-thickness — RECONSTRUCTED`, { noAudit: true }),
  knighthead_sided: m(ft(0, 10), 'RECONSTRUCTED §6 a bollard timber heavier than a top timber', { noAudit: true }),
  knighthead_above_bowsprit: m(ft(1, 6), 'SECONDARY §6 Steel :15357-15359, the knightheads run high enough above the bowsprit to admit a chock between them', { noAudit: true }),

  gammoning_hole_count: n(2, 'SECONDARY §6 Steel :41225, two gammoning holes', { noAudit: true }),
  gammoning_cleat_forward_of_stem: m(ft(3, 0), 'SECONDARY §6 Steel :2914, the gammoning is cut through the knee of the head between the cheeks, abaft the figure', { noAudit: true }),
  gammoning_cleat_spacing: m(ft(1, 4), 'RECONSTRUCTED §6 from Steel :41226, a gammoning hole 1 ft 1 in long, with a little wood between the two', { noAudit: true }),
  gammoning_cleat_projection: m(ft(0, 3), 'RECONSTRUCTED §6 the cleat that keeps the gammoning lashing from surging forward', { noAudit: true }),
  bobstay_hole_count: n(2, 'SECONDARY §6 Steel :41228, two bobstay holes', { noAudit: true }),
  bobstay_hole_diameter: m(ft(0, 4), 'SECONDARY §6 Steel :41229, 4 in diameter, OCR-doubtful', { noAudit: true }),
  bobstay_hole_forward_of_stem: m(ft(6, 6), 'SECONDARY §6 Steel :1537, cut through the fore part of the knee of the head below the lower cheek', { noAudit: true }),

  // ---------------------------------------------------------------- the catheads
  // Steel's forecastle table for a 32-gun frigate, by way of research 06 §5.4. Every
  // row in that table is flagged as badly OCR'd except the stive, which is legible
  // through the whole series. The station and half-breadth pair are research 06's
  // reconstruction; the check on them is that the two points are 6 ft apart, which is
  // exactly Steel's outboard length, so they are at least self-consistent.
  //
  // THE ANCHORS HANG FROM THESE. The ground-tackle module should site the catted
  // anchors on cathead_outer_from_stem / cathead_outer_half_breadth and the stive.
  cathead_root_from_stem: m(ft(12, 0), `${R6C}: the inboard arm bolts to the cat beam`, { noAudit: true }),
  cathead_root_half_breadth: m(ft(10, 0), `${R6C}`, { noAudit: true }),
  cathead_outer_from_stem: m(ft(8, 0), `${R6C}: the sheave centre at the outer end`, { noAudit: true }),
  cathead_outer_half_breadth: m(ft(14, 6), `${R6C}`, { noAudit: true }),
  cathead_spread: m(ft(29, 0), `${R6C}: twice cathead_outer_half_breadth, the athwartships span over the two outer ends`, { tolerance: 0.06 }),
  cathead_stive_deg: n(22.6, 'SECONDARY §6 Steel :40062-40064, 5 in of rise per foot of length; the whole row is legible across all ten columns', { noAudit: true }),
  cathead_sided: m(ft(1, 2), 'SECONDARY §6 Steel :40060, OCR-doubtful', { noAudit: true }),
  cathead_moulded: m(ft(1, 1), 'SECONDARY §6 Steel :40061, OCR-doubtful', { noAudit: true }),
  cathead_inboard_length: m(ft(8, 6), 'SECONDARY §6 Steel :40066, length inboard from the outside of the timber, OCR-doubtful', { noAudit: true }),
  cathead_sheave_count: n(3, 'SECONDARY §6 Steel :40068-40069, three sheaves in the outer end', { noAudit: true }),
  cathead_sheave_diameter: m(ft(0, 10), 'SECONDARY §6 Steel :40069, OCR-doubtful', { noAudit: true }),
  cathead_supporter_arm: m(ft(3, 6), 'SECONDARY §6 Steel :40074, the thwartship arm of the knee under the cathead', { noAudit: true }),

  // --------------------------------------------------------------- the figurehead
  // CONJECTURAL. See the note at the head of this file and research 08 §4. Nothing
  // below is evidence for what this ship carried; it is a reconstruction of what a
  // Revolutionary French corvette named Unite would plausibly have worn and what the
  // Royal Navy would plausibly have left on her after 1796 — a small classical female
  // personification, pine, painted rather than gilt.
  figurehead_forward_of_stem: m(ft(11, 0), `${R8F}; sited on the head of the knee where ZAZ3067 draws a small figure, 66 px forward of the stem`, { noAudit: true }),
  figurehead_above_rail: m(ft(0, 6), `${R8F}; the plinth on the hair bracket`, { noAudit: true }),
  figurehead_height: m(ft(4, 0), `${R8F}; research 08 §4.4 — "the scale was drastically reduced", so a small figure`, { tolerance: 0.15 }),
  figurehead_rake_deg: n(30, `${R8F}; the figure leans back against the hair bracket, following the run of the head`, { noAudit: true }),
  figurehead_hem_diameter: m(ft(2, 0), `${R8F}; the spread of the drapery at the plinth`, { noAudit: true }),
  figurehead_waist_diameter: m(ft(1, 2), `${R8F}`, { noAudit: true }),
  figurehead_waist_height: m(ft(2, 3), `${R8F}`, { noAudit: true }),
  figurehead_shoulder_height: m(ft(3, 3), `${R8F}`, { noAudit: true }),
  figurehead_shoulder_breadth: m(ft(1, 4), `${R8F}`, { noAudit: true }),
  figurehead_head_diameter: m(ft(0, 9), `${R8F}`, { noAudit: true }),
  figurehead_arm_diameter: m(ft(0, 4), `${R8F}`, { noAudit: true }),
  figurehead_arm_length: m(ft(1, 9), `${R8F}`, { noAudit: true }),

  hair_bracket_length: m(ft(4, 0), 'SECONDARY §6 Steel :3043, the moulding terminating the head rails and running into the back of the figure', { noAudit: true }),
  hair_bracket_sided: m(ft(0, 5), 'RECONSTRUCTED §6 a moulding sided as the rails it gathers', { noAudit: true }),
  trailboard_depth: m(ft(1, 0), 'RECONSTRUCTED §8 research 08 §4.4, "very limited trailboard decoration" on a small ship of this date', { noAudit: true }),
};
