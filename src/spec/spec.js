// THE SPEC. Every dimension the generator uses is written here and nowhere else.
//
// Each row carries the number in metres, the period figure it was converted from, and
// a source. `npm run trace` fails if a row has no source or no matching row in
// SPECS.md; `npm run audit` measures the built geometry and diffs it against these
// values. Between them, a number cannot drift without something going red.
//
// Grades used in `source`:
//   PRIMARY       read from the ship's own draught or the dockyard survey
//   SECONDARY     a published work citing those records
//   RECONSTRUCTED derived from a period rule; the rule is named in `note`
//   FICTIONAL     from O'Brian's novels or the 2003 film, never mixed with the above
import { ft } from '../util/math.js';

const m = (metres, source, opts = {}) => ({ value: metres, source, ...opts });

export const SPEC = {
  // ---------------------------------------------------------------- principal
  // The dockyard survey figures from the title cartouche of ZAZ3067, "SURPRISE late
  // L'UNITE", Plymouth Yard February 1798, signed John Marshall. These four are the
  // only dimensions of this ship that are genuinely recorded, and everything else is
  // built off them.
  hull_length_gundeck: m(ft(126, 0), 'PRIMARY §1 ZAZ3067 title cartouche; Winfield via threedecks', { tolerance: 0.01 }),
  hull_length_keel: m(ft(108, 6.125), 'PRIMARY §1 ZAZ3067; confirmed by the tonnage arithmetic', { noAudit: true }),
  hull_beam_extreme: m(ft(31, 8), 'PRIMARY §1 ZAZ3067; confirmed by the tonnage arithmetic', { tolerance: 0.015 }),
  hull_beam_moulded: m(ft(31, 2), 'RECONSTRUCTED §1 extreme less twice 3 in bottom plank (Steel 1805 scantlings)', { noAudit: true }),
  hull_depth_in_hold: m(ft(10, 0.5), 'PRIMARY §1 threedecks citing Winfield BWAS-1793', { noAudit: true }),
  hull_tons_burthen: { value: 578.777, source: 'PRIMARY §1 578 73/94 tons bm; (108.5104 x 31.6667 x 15.83335) / 94 checks exactly', noAudit: true },

  hull_draught_aft: m(ft(14, 0.5), 'SECONDARY §3 Wikipedia, HMS Surprise (1796)', { noAudit: true }),
  hull_draught_fwd: m(ft(11, 6), 'RECONSTRUCTED §3 normal trim by the stern for a frigate of this size', { noAudit: true }),

  // --------------------------------------------------------------- deck heights
  // Heights above the design load waterline, which is the model's y = 0.
  gundeck_above_wl: m(ft(4, 6), 'RECONSTRUCTED §3 from draught less depth in hold and deck thickness', { noAudit: true }),
  quarterdeck_above_gundeck: m(ft(6, 8), 'RECONSTRUCTED §3 Steel, height between decks for a sixth rate', { noAudit: true }),
  forecastle_above_gundeck: m(ft(6, 6), 'RECONSTRUCTED §3 Steel, height between decks forward', { noAudit: true }),
  deck_camber: m(ft(0, 5), 'RECONSTRUCTED §3 Steel, 5 in of round-up across the breadth', { noAudit: true }),

  // Where the quarterdeck and forecastle end, as a fraction of the gundeck length from
  // forward. Between them lies the open waist, which is what makes a frigate read as a
  // frigate rather than as a small two-decker.
  forecastle_break_u: { value: 0.22, source: 'RECONSTRUCTED §5 measured off ZAZ3068, the Marshall deck plan', noAudit: true },
  quarterdeck_break_u: { value: 0.55, source: 'RECONSTRUCTED §5 measured off ZAZ3068, the Marshall deck plan', noAudit: true },

  bulwark_height_waist: m(ft(4, 6), 'RECONSTRUCTED §5 period practice for a sixth rate', { noAudit: true }),
  bulwark_height_quarterdeck: m(ft(4, 4), 'RECONSTRUCTED §5 period practice for a sixth rate', { noAudit: true }),
  bulwark_height_forecastle: m(ft(4, 4), 'RECONSTRUCTED §5 period practice for a sixth rate', { noAudit: true }),

  // ----------------------------------------------------------------- gunports
  gunport_count_per_side: { value: 12, source: 'PRIMARY §2 threedecks, 24 x 9-pdr on the upper deck, June 1796', tolerance: 0.001 },
  gunport_width: m(ft(2, 6), 'RECONSTRUCTED §4 Steel, port width for a 9-pounder', { tolerance: 0.04 }),
  gunport_height: m(ft(2, 4), 'RECONSTRUCTED §4 Steel, port height for a 9-pounder', { tolerance: 0.04 }),
  gunport_sill_above_deck: m(ft(2, 0), 'RECONSTRUCTED §4 Steel, sill height above the deck', { noAudit: true }),
  gunport_spacing: m(ft(8, 6), 'RECONSTRUCTED §4 12 ports spread over the length available between the bow and the transom', { tolerance: 0.05 }),
  gunport_lid_thickness: m(ft(0, 3), 'SECONDARY §4 Steel, port-lid thickness', { noAudit: true }),

  qd_port_width: m(ft(2, 4), 'SECONDARY §4 Steel, quarterdeck port', { noAudit: true }),
  qd_port_height: m(ft(2, 4), 'SECONDARY §4 Steel, quarterdeck port', { noAudit: true }),
  qd_port_sill_above_deck: m(ft(1, 8), 'SECONDARY §4 Steel, quarterdeck port sill', { noAudit: true }),

  // -------------------------------------------------------------- hull surface
  wale_top_below_deck: m(ft(2, 6), 'RECONSTRUCTED §4 traced from the ZAZ3067 profile', { noAudit: true }),
  wale_depth: m(ft(1, 9), 'RECONSTRUCTED §4 traced from the ZAZ3067 profile', { noAudit: true }),
  // The backbone. A keel of this scantling for a 578-ton ship, sided (its width) and
  // moulded (its depth below the rabbet).
  keel_siding: m(ft(1, 1), 'RECONSTRUCTED §4 Steel 1805 scantling tables, keel sided for a ship of ~580 tons', { noAudit: true }),
  keel_moulding: m(ft(1, 3), 'RECONSTRUCTED §4 Steel 1805 scantling tables, keel moulded plus the false keel', { noAudit: true }),

  hull_tumblehome_ratio: { value: 0.055, source: 'RECONSTRUCTED §4 French corvette practice, less tumblehome than a British-built hull', noAudit: true },
};

// ------------------------------------------------------------------- paint
// Colours are sRGB hex as they should appear under neutral light. Roughness and
// metalness are linear. Sources are the pigment and practice research, cross-checked
// against pixels sampled from the reference photograph (docs/PHOTO-ANALYSIS.md).
export const PAINT = {
  topside_black: { hex: '#1C1613', roughness: 0.50, source: 'SECONDARY §8 lamp black in tar; warm brown-black, not pure black' },
  wale: { hex: '#241A12', roughness: 0.40, source: 'SECONDARY §8 wales left bright in tar, glossier than the topside' },
  ochre_trim: { hex: '#BB9476', roughness: 0.50, source: 'SECONDARY §8 NCS S 3020-Y40R, the Victory ochre; photo samples #dba55d-#eabc66 in warm light' },
  inboard_red: { hex: '#913832', roughness: 0.65, source: 'SECONDARY §8 red ochre for inboard works and port linings, not Venetian red' },
  boot_top: { hex: '#2A2018', roughness: 0.70, source: 'SECONDARY §8 exposed plank above the sheathing, algae-stained' },

  copper: { hex: '#A8603E', roughness: 0.62, source: 'RECONSTRUCTED §8 lightly weathered sheathing; the photo reads brown, never green' },
  copper_bright: { hex: '#F7BC9E', roughness: 0.35, source: 'SECONDARY §8 new copper, used for the nail heads' },
  copper_dark: { hex: '#3E2418', roughness: 0.75, source: 'SECONDARY §8 cupric oxide in the sheet laps' },
  copper_line_above_wl_v: { value: 0.055, source: 'RECONSTRUCTED §8 sheathing carried 2 ft 6 in to 3 ft above the load waterline, expressed in the hull V coordinate' },

  ochre_strake_below_sill_v: { value: 0.028, source: 'RECONSTRUCTED photo analysis; the ochre strake starts below the port sills' },
  ochre_strake_above_head_v: { value: 0.012, source: 'RECONSTRUCTED photo analysis; the strake finishes just above the port heads' },

  deck: { hex: '#C9BCA4', roughness: 0.72, source: 'SECONDARY §8 holystoned deck planking' },
  deck_seam: { hex: '#3A332A', roughness: 0.8, source: 'SECONDARY §8 pitched caulking' },
  timber: { hex: '#8A6A44', roughness: 0.70, source: 'SECONDARY §8 oak, bright' },
  mast_bright: { hex: '#9C7A4E', roughness: 0.38, source: 'SECONDARY §8 lower masts varnished bright' },
  mast_black: { hex: '#1C1613', roughness: 0.55, source: 'SECONDARY §8 mastheads, caps, tops and yards blacked' },

  boat_white: { hex: '#E4E8DC', roughness: 0.55, source: 'SECONDARY §8 white lead; the photo shows the boats white' },
  gilt: { hex: '#D4AF37', roughness: 0.32, source: 'SECONDARY §8 gilt on head, taffrail and quarter badges, matching the reference model' },
  iron: { hex: '#1A1A1A', roughness: 0.65, metalness: 0.70, source: 'SECONDARY §8 blacked wrought iron' },
  brass: { hex: '#F9E596', roughness: 0.30, source: 'SECONDARY §8 bell and sheaves' },
  glazing: { hex: '#DDE6E0', roughness: 0.08, source: 'SECONDARY §8 crown glass, faint green cast' },

  sail: { hex: '#D6CDB6', roughness: 0.85, source: 'SECONDARY §8 weathered flax; the photo samples #ddd6c4 lit and #a89880 shaded' },
  sail_seam: { hex: '#C6BDA7', roughness: 0.88, source: 'SECONDARY §8 seams between cloths' },
  sail_transmission: { value: 0.34, source: 'SECONDARY §8 thin flax canvas is markedly translucent with the sun behind it' },

  rigging_tarred: { hex: '#2A211A', roughness: 0.85, source: 'SECONDARY §8 standing rigging, tarred hemp' },
  rigging_hemp: { hex: '#A89574', roughness: 0.90, source: 'SECONDARY §8 running rigging, untarred hemp' },

  ensign_blue: { hex: '#22375E', roughness: 0.9, source: 'SECONDARY §8 blue ensign bunting, desaturated from the Flag Institute blue' },
  ensign_red: { hex: '#A32D34', roughness: 0.9, source: 'SECONDARY §8 bunting red' },
  ensign_white: { hex: '#E8E2D4', roughness: 0.9, source: 'SECONDARY §8 bunting white' },
};

// The offset table is generated from the draught by tools/extract-draught.py and lives
// in docs/offsets.json. It is imported rather than written here so that the numbers
// stay attached to the script that produced them.
export { OFFSETS } from './offsets.js';
