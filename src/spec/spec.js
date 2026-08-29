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
import { PART_SPECS } from './parts/index.js';

export const m = (metres, source, opts = {}) => ({ value: metres, source, ...opts });

// The core of the spec: the ship herself, her decks and her battery. Regions of the
// ship that are built by their own module keep their dimensions in
// `src/spec/parts/<region>.js` and are merged in below, so that two people working on
// two regions never edit the same file.
const CORE = {
  // ---------------------------------------------------------------- principal
  // The dockyard survey figures from the title cartouche of ZAZ3067, "SURPRISE late
  // L'UNITE", Plymouth Yard February 1798, signed John Marshall. These four are the
  // only dimensions of this ship that are genuinely recorded, and everything else is
  // built off them.
  hull_length_gundeck: m(ft(126, 0), 'PRIMARY §1 ZAZ3067 title cartouche; Winfield via threedecks', { noAudit: true }),
  // The length the offset table actually spans: the load waterline, from the fore side
  // of the stem rabbet to the after side of the sternpost. Five feet shorter than the
  // gundeck, because both the stem and the post rake and the deck line runs on past the
  // perpendiculars at each end.
  hull_length_bp: m(ft(121, 0), 'MEASURED §2 126 ft on the gundeck less the stem rake above the LWL and the post rake', { tolerance: 0.01 }),
  hull_length_keel: m(ft(108, 6.125), 'PRIMARY §1 ZAZ3067; confirmed by the tonnage arithmetic', { noAudit: true }),
  hull_beam_extreme: m(ft(31, 8), 'PRIMARY §1 ZAZ3067; confirmed by the tonnage arithmetic. Measured over the wales, which stand outside the moulded surface the offsets describe', { noAudit: true }),
  hull_beam_moulded: m(ft(31, 0), 'MEASURED §2 breadth box on the ZAZ3067 body plan at 6.0 px per foot; the title-block row is illegible at this resolution', { tolerance: 0.012 }),
  hull_depth_in_hold: m(ft(10, 0.5), 'PRIMARY §1 threedecks citing Winfield BWAS-1793', { noAudit: true }),
  hull_tons_burthen: { value: 578.777, source: 'PRIMARY §1 578 73/94 tons bm; (108.5104 x 31.6667 x 15.83335) / 94 checks exactly', noAudit: true },

  hull_draught_aft: m(ft(14, 0.5), 'SECONDARY §3 Wikipedia, HMS Surprise (1796)', { noAudit: true }),
  hull_draught_fwd: m(ft(11, 6), 'RECONSTRUCTED §3 normal trim by the stern for a frigate of this size', { noAudit: true }),

  // --------------------------------------------------------------- deck heights
  // Heights above the design load waterline, which is the model's y = 0.
  gundeck_above_wl: m(ft(5, 9.8), 'MEASURED §5 gun deck at side 18.65 ft above the moulded base line, LWL at 12.83 ft', { noAudit: true }),
  quarterdeck_above_gundeck: m(ft(6, 8), 'RECONSTRUCTED §3 Steel, height between decks for a sixth rate', { noAudit: true }),
  forecastle_above_gundeck: m(ft(6, 6), 'RECONSTRUCTED §3 Steel, height between decks forward', { noAudit: true }),
  deck_camber: m(ft(0, 5), 'RECONSTRUCTED §3 Steel, 5 in of round-up across the breadth', { noAudit: true }),

  // Where the quarterdeck and forecastle end, as a fraction of the gundeck length from
  // forward. Between them lies the open waist, which is what makes a frigate read as a
  // frigate rather than as a small two-decker.
  forecastle_break_u: { value: 33 / 126, source: 'RECONSTRUCTED §5 aft side of the forecastle 33 ft abaft the stem, from Steel\'s forecastle-length series', noAudit: true },
  quarterdeck_break_u: { value: 78 / 126, source: 'RECONSTRUCTED §5 fore side of the quarterdeck 7 ft abaft the mainmast', noAudit: true },

  // The forecastle and the quarterdeck are laid on their own beams and are much flatter
  // than the gun deck beneath them: the gun deck sweeps up toward the ends with the
  // sheer, so the space between the two narrows aft rather than staying constant. Taking
  // these as zero puts the taffrail at 16 ft 8 in above the load waterline, which is
  // what the draught measures — so the flat reading is the one the evidence supports.
  forecastle_sheer_rise: m(0, 'MEASURED §5 the derived rail matches the traced top-of-side when both upper decks are flat', { noAudit: true }),
  quarterdeck_sheer_rise: m(0, 'MEASURED §5 as above; a rise here would put the taffrail above its measured 29.5 ft', { noAudit: true }),
  // How far either side of a deck break the bulwark fairs between the waist rail and the
  // higher rail at the ends. The planking is continuous, so the change is a sweep and
  // not a step.
  bulwark_break_fairing: m(ft(6, 0), 'RECONSTRUCTED §5 a fair run of planking through the break, as the reference photograph shows', { noAudit: true }),

  bulwark_height_waist: m(ft(5, 9), 'MEASURED §8 rail to the top of the channel-wale band, 24.4 ft above base', { noAudit: true }),
  bulwark_height_quarterdeck: m(ft(4, 4), 'RECONSTRUCTED §5 period practice; the rail itself now comes from the offset table', { noAudit: true }),
  bulwark_height_forecastle: m(ft(4, 4), 'RECONSTRUCTED §5 period practice; the rail itself now comes from the offset table', { noAudit: true }),

  // ----------------------------------------------------------------- gunports
  gunport_count_per_side: { value: 12, source: 'PRIMARY §2 threedecks, 24 x 9-pdr on the upper deck, June 1796', tolerance: 0.001 },
  gunport_width: m(ft(2, 6), 'RECONSTRUCTED §4 Steel, port width for a 9-pounder', { tolerance: 0.04 }),
  gunport_height: m(ft(2, 4.8), 'MEASURED §8 port sills at 20.4 ft and heads at 22.8 ft above the moulded base line', { tolerance: 0.04 }),
  gunport_sill_above_deck: m(ft(1, 9), 'MEASURED §8 sills 20.4 ft above base, deck at side 18.65 ft', { noAudit: true }),
  gunport_spacing: m(ft(8, 6), 'RECONSTRUCTED §4 12 ports spread over the length available between the bow and the transom', { tolerance: 0.05 }),
  gunport_lining_depth: m(ft(0, 9), 'RECONSTRUCTED §4 thickness of the side at the ports, plank and timber', { noAudit: true }),
  gunport_lid_thickness: m(ft(0, 3), 'SECONDARY §4 Steel, port-lid thickness', { noAudit: true }),

  qd_port_width: m(ft(2, 4), 'SECONDARY §4 Steel, quarterdeck port', { noAudit: true }),
  qd_port_height: m(ft(2, 4), 'SECONDARY §4 Steel, quarterdeck port', { noAudit: true }),
  qd_port_sill_above_deck: m(ft(1, 8), 'SECONDARY §4 Steel, quarterdeck port sill', { noAudit: true }),

  // Where the battery sits along the ship, as metres abaft the stem measured on the
  // gundeck. Twelve ports at 8 ft 6 in centres spread over 93 ft 6 in, set so the
  // foremost port clears the bow and the aftermost clears the quarter.
  gunport_first_from_stem: m(ft(24, 0), 'RECONSTRUCTED §4 foremost port clear of the round of the bow on ZAZ3067', { noAudit: true }),
  qd_port_count_per_side: { value: 6, source: 'PRIMARY §2 threedecks, 8 x 4-pdr and 4 x 12-pdr carronades on the quarterdeck', noAudit: true },
  fc_port_count_per_side: { value: 2, source: 'PRIMARY §2 threedecks, 2 x 4-pdr and 2 x 12-pdr carronades on the forecastle', noAudit: true },

  // -------------------------------------------------------------- hull surface
  wale_top_below_deck: m(ft(1, 9), 'MEASURED §8 main wale upper edge 16.9 ft above base, deck at side 18.65 ft', { noAudit: true }),
  wale_depth: m(ft(1, 8), 'MEASURED §8 main wale 15.2 to 16.9 ft above the moulded base line', { noAudit: true }),
  // Where the gundeck sits at the centreline amidships, which is the one deck height
  // the audit can measure directly off the built surface.
  gundeck_above_wl_at_midships: m(ft(5, 9.8) + ft(0, 5), 'MEASURED §5 deck at side 5.82 ft above the LWL at the midship station, plus the full camber to the centreline', { tolerance: 0.05 }),

  side_thickness: m(ft(0, 9), 'RECONSTRUCTED §4 the ship\'s side at the ports: plank, timber and inboard plank', { noAudit: true }),
  rail_cap_thickness: m(ft(0, 4), 'RECONSTRUCTED §4 the capping over the top timbers', { noAudit: true }),
  gangway_width: m(ft(3, 6), 'RECONSTRUCTED §8 gangway wide enough for one man and a hand rope', { noAudit: true }),

  // The backbone. A keel of this scantling for a 578-ton ship, sided (its width) and
  // moulded (its depth below the rabbet).
  // The straight bearing length of the keel timber — not the 108 ft 6⅛ in "keel for
  // tonnage", which is a formula figure and not a piece of wood. Between the forefoot
  // and the sternpost the keel runs dead level; forward and aft of that the stem and the
  // post carry the rabbet up, and the space between the rabbet and the keel is filled by
  // the deadwood.
  keel_straight_length: m(ft(104, 0), 'MEASURED §6 keel straight bearing about 104 ft; the recorded 108 ft 6 in is the tonnage keel', { noAudit: true }),

  keel_siding: m(ft(1, 1), 'MEASURED §6 keel half-siding 0.54 ft off the body plan', { noAudit: true }),
  keel_moulding: m(ft(1, 4), 'MEASURED §6 keel and false keel 1 ft 4 in below the moulded base line', { noAudit: true }),

  hull_tumblehome_deg: { value: 15.6, source: 'MEASURED §4 body-plan envelope above the maximum breadth: 0.279 ft of inset per foot of height, +/- 1.5 deg. Note this contradicts the common claim that a French hull tumbles home less than a British one.', noAudit: true },
};

export const SPEC = Object.freeze({ ...CORE, ...PART_SPECS });

// A key defined twice means two modules disagree about the same dimension, which is
// exactly the drift this spec exists to prevent.
for (const key of Object.keys(PART_SPECS)) {
  if (key in CORE) throw new Error(`spec key "${key}" is defined in both the core spec and a part spec`);
}

// ------------------------------------------------------------------- paint
// Colours are sRGB hex as they should appear under neutral light. Roughness and
// metalness are linear. Sources are the pigment and practice research, cross-checked
// against pixels sampled from the reference photograph (docs/PHOTO-ANALYSIS.md).
export const PAINT = {
  topside_black: { hex: '#1C1613', roughness: 0.50, source: 'SECONDARY §8 lamp black in tar; warm brown-black, not pure black' },
  wale: { hex: '#241A12', roughness: 0.40, source: 'SECONDARY §8 wales left bright in tar, glossier than the topside' },
  // The single strongest thing about this ship's appearance is that she is a black ship
  // with an ochre gunport strake, so this row has to be right. It is a *pigment* value,
  // not a photographed one. The old value here was the photograph's own #dba55d-#eabc66
  // range entered as an albedo, which lights the paint twice: it rendered at #cbb0a0,
  // a pale pink cream, and the strake stopped reading as ochre at all.
  ochre_trim: { hex: '#BC9046', roughness: 0.55, source: 'SECONDARY §8 yellow ochre in oil, the Victory ochre (NCS S 3020-Y40R), taken at pigment strength; renders inside the photograph\'s sampled #dba55d-#f8cf7d under both the sea and the studio rig' },
  inboard_red: { hex: '#913832', roughness: 0.65, source: 'SECONDARY §8 red ochre for inboard works and port linings, not Venetian red' },
  boot_top: { hex: '#2A2018', roughness: 0.70, source: 'SECONDARY §8 exposed plank above the sheathing, algae-stained' },

  // Copper is a metal, so almost none of what you see of it is its own colour: it is the
  // sky and the sea reflected in it, tinted. That is why it goes wrong so easily. At
  // roughness 0.66 the reflection is spread so wide that the sheathing has no highlight
  // at all and reads as flat brick-red paint; the lap shadows and the nail heads are
  // what break it up and tell the eye it is beaten sheet.
  copper: { hex: '#A2603A', roughness: 0.44, source: 'RECONSTRUCTED §8 sheathing after some months in the water: brown, not the salmon of new copper and never the green of long immersion. The reference photograph reads warm brown here, and that is what is matched. Roughness is the polish of a sheet that has been in the water a few months, not of one that has been painted' },
  copper_bright: { hex: '#F7BC9E', roughness: 0.35, source: 'SECONDARY §8 new copper, used for the nail heads' },
  copper_dark: { hex: '#3E2418', roughness: 0.75, source: 'SECONDARY §8 cupric oxide in the sheet laps' },
  copper_line_above_wl_v: { value: 0.132, source: 'RECONSTRUCTED §8 sheathing carried 2 ft 9 in above the load waterline, converted into the hull V coordinate through the feature heights at the midship station' },

  // The sheathing pattern. A sheet was 4 ft by 14 in, laid like slates with each course
  // overlapping the one below and each sheet the one ahead. Over a hull 40 m long and
  // a sheathed band about 3.5 m deep at the midship station, that is roughly these
  // counts across the base map.
  copper_sheets_along: { value: 22, source: 'SECONDARY §8 sheets 4 ft on the long edge, laid fore and aft over 121 ft of waterline; counted across the hull base map' },
  copper_sheets_up: { value: 26, source: 'SECONDARY §8 sheets 14 in on the short edge; the courses that fit between the keel and the sheathing line, counted over the whole V range of the base map' },
  // How far a lap and a nail head stand off the sheet, as a fraction of the base map's
  // luminance range. These drive the height map the hull's normal map is made from, so
  // they decide whether the sheathing has relief or is a printed pattern.
  copper_lap_relief: { value: 0.34, source: 'RECONSTRUCTED §8 the doubling at a sheet lap is one thickness of sheet copper; tuned so the laps are legible at beam distance and do not read as corrugation' },
  copper_nail_relief: { value: 0.55, source: 'RECONSTRUCTED §8 a raised nail head; tuned so the nails catch the sun at beam distance' },
  hull_normal_scale: { value: 1.15, source: 'RECONSTRUCTED §8 the normal map is built from a height map whose relief is already scaled by the two rows above, so this stays near unity. At the old 0.4 the copper nails were invisible at every distance' },
  copper_pattern_depth: { value: 0.62, source: 'RECONSTRUCTED §8 how strongly the sheathing pattern modulates the base colour. Copper carries its own colour through the metalness map rather than through the base map, so its pattern is allowed to bite far harder than paint on planking does; at the old 0.42 the sheets were invisible at beam distance' },
  copper_sheet_variation: { value: 0.16, source: 'RECONSTRUCTED §8 no two sheets weather alike, and it is the spread between them that stops the bottom reading as one printed panel' },

  ochre_strake_below_sill_v: { value: 0.008, source: 'MEASURED §8 the ochre strake carries the port band, sills at 20.4 ft and heads at 22.8 ft above base; black above the wale and again above the port heads' },
  ochre_strake_above_head_v: { value: 0.004, source: 'MEASURED §8 the channel-wale band above the port heads is black, 22.9 to 24.1 ft above base. The strake is carried just clear of the port heads and no further: the band between the heads and the rail is narrow, and any more ochre than this closes it up and the ship stops reading as black' },
  // The one thin ochre moulding, swept along the sheer strake in the black topside below
  // the ports. Its line comes from the hull's own feature table, not from here, so it
  // cannot drift; this is only how deep it is in the V coordinate. There is no second
  // moulding at the rail: the photograph shows the cap rail and the bulwark above the
  // ports as one near-black band, #2b2320-#3d1903, and a light line drawn across a band
  // that narrow is most of why the bulwark was sampling tan.
  ochre_moulding_v: { value: 0.006, source: 'MEASURED §8 a moulding about 4 in deep on a topside whose V range spans some 22 ft; the reference photograph shows one such line on the sheer and none above the port heads' },

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
  // Canvas is translucent with the sun behind it, and a sail wants that glow. It used to
  // be got with `transmission`, which was the wrong tool twice over: a transmissive
  // material is drawn in a separate pass off a copy of the frame buffer, and a
  // double-sided sail seen from its back side against nothing came out of that pass as a
  // solid black polygon — which is what the spanker did from aft and to port. The glow is
  // now a faint emission through the same cloth map, which costs nothing, cannot go
  // black, and exports as core glTF.
  sail_glow: { value: 0.055, source: 'RECONSTRUCTED §8 flax canvas is translucent backlit; the emission that replaces it is tuned against the reference photograph, in which the sails glow faintly and are opaque' },
  sail_glow_tint: { hex: '#FFEFD2', source: 'RECONSTRUCTED §8 light through flax picks up the warmth of the cloth, so the glow is warmer than the cloth itself' },

  rigging_tarred: { hex: '#2A211A', roughness: 0.85, source: 'SECONDARY §8 standing rigging, tarred hemp' },
  rigging_hemp: { hex: '#A89574', roughness: 0.90, source: 'SECONDARY §8 running rigging, untarred hemp' },

  ensign_blue: { hex: '#22375E', roughness: 0.9, source: 'SECONDARY §8 blue ensign bunting, desaturated from the Flag Institute blue' },
  ensign_red: { hex: '#A32D34', roughness: 0.9, source: 'SECONDARY §8 bunting red' },
  ensign_white: { hex: '#E8E2D4', roughness: 0.9, source: 'SECONDARY §8 bunting white' },

  // ----------------------------------------------------------------- the light
  // The rows above are pigments; these are the light they are seen in, and they belong
  // here because a colour is only half of an appearance. `viewer/scene.js` builds both
  // rigs out of them.
  //
  // Two rigs, one target. The studio rig reproduces the reference photograph's warm
  // backdrop so the two images can be compared directly. The sea rig is where the ship
  // will actually live, and it is tuned to land on the same appearance rather than on a
  // physically blue one: the photograph's sunlit canvas samples #ddd6c4 and its shaded
  // canvas #a89880, and the sea rig is set so that it does too. This matters more than
  // it sounds. A blue sky fill and a blue environment turn flax canvas sage, oak grey
  // and ochre paint cream, and the ship stops reading as wood and cloth.
  //
  // Azimuth is measured the way viewer/views.js measures a camera station: 0 dead ahead,
  // 90 on the starboard beam, 270 on the port beam. Elevation is above the horizontal.
  sun_colour: { hex: '#FFF1DA', source: 'RECONSTRUCTED §8 direct sunlight a few hours off noon, about 5000 K' },
  sun_intensity: { value: 2.6, source: 'RECONSTRUCTED §8 bright enough for a sunny day, not so bright that the deck, the boats and the canvas clip to white and lose their colour' },
  sun_distance: { value: 70, source: 'RECONSTRUCTED §8 far enough outside a ship 59 m over all that the shadow camera can see all of her' },
  sea_sun_azimuth_deg: { value: 296, source: 'RECONSTRUCTED §8 a little forward of the port beam, so that the side the verification views look at is the lit side and the rig throws its shadow away from the camera' },
  sea_sun_elevation_deg: { value: 34, source: 'RECONSTRUCTED §8 low enough to light the topsides rather than only the deck, high enough that the sail plan does not shade the whole ship' },
  studio_sun_azimuth_deg: { value: 308, source: 'RECONSTRUCTED §8 matched to the key light in the reference photograph, which comes over the photographer\'s left shoulder' },
  studio_sun_elevation_deg: { value: 44, source: 'RECONSTRUCTED §8 matched to the reference photograph, where the shadows under the channels are short' },

  // The fill. In the sea rig this is the sky and the bounce off the water; the sky is
  // blue, but it is a warm-hazed blue near the horizon and it is deliberately weak,
  // because a strong blue fill is what made the whole ship read as cold plastic.
  sea_sky_colour: { hex: '#E6DCC6', source: 'RECONSTRUCTED §8 the warm haze low in a sunny sky, which is the part of it a ship\'s side actually sees; tuned so sunlit canvas lands on the photograph\'s #ddd6c4' },
  sea_water_colour: { hex: '#4A5A56', source: 'RECONSTRUCTED §8 bounce off the sea: dark, and green-grey rather than blue, so that it does not tint the black topsides' },
  sea_fill_intensity: { value: 0.62, source: 'RECONSTRUCTED §8 enough that the black topsides are not a silhouette, little enough that the sun still decides the colour of everything it touches' },
  studio_sky_colour: { hex: '#F0DCB4', source: 'RECONSTRUCTED §8 the warm backdrop of the reference photograph' },
  studio_floor_colour: { hex: '#8A7250', source: 'RECONSTRUCTED §8 bounce off the photographer\'s warm sweep' },
  studio_fill_intensity: { value: 0.85, source: 'RECONSTRUCTED §8 the reference photograph is lit softly; its shadows are open' },

  // A cool edge from the opposite quarter. It is what separates the black topsides from
  // a dark sea, and it is the one thing in the sea rig allowed to stay blue — but only
  // just, because it lands on the side away from the sun and reads as sky.
  rim_colour: { hex: '#BFD2E2', source: 'RECONSTRUCTED §8 open sky on the shaded side' },
  rim_intensity: { value: 0.22, source: 'RECONSTRUCTED §8 an edge, not a second key; at 0.35 with a colder colour it was half of why the shaded canvas sampled #7e9bb0' },
  rim_azimuth_deg: { value: 110, source: 'RECONSTRUCTED §8 on the starboard quarter, opposite the sun' },
  rim_elevation_deg: { value: 32, source: 'RECONSTRUCTED §8 a horizontal sea mirrors a light straight back at the camera when the light stands at the angle the camera looks down at the water. At 14 degrees that put a wall of glare across the quarter of every sea render, so the rim is carried above the band the water can return' },

  // The environment the metals and the glazing reflect. Everything metallic on the ship
  // — the copper sheathing above all — has no diffuse colour of its own and shows this
  // and nothing else, so a cold environment makes copper read as cold.
  sea_env_colour: { hex: '#B9B4A2', source: 'RECONSTRUCTED §8 the whole sky and sea averaged as seen from a hull: warm haze, not the blue of the zenith. It is what the copper reflects' },
  studio_env_colour: { hex: '#DCC199', source: 'RECONSTRUCTED §8 the reference photograph\'s backdrop, averaged' },
  env_sun_colour: { hex: '#FFF6E4', source: 'RECONSTRUCTED §8 the sun\'s own disc in the environment, which is what gives copper and gilt a highlight to catch' },
  env_sun_extent: { value: 34, source: 'RECONSTRUCTED §8 the card is 34 m across at 55 m, about 35 degrees. Wider than the real sun by a long way, because a half-degree disc survives neither the PMREM blur nor a roughness of 0.44 — but small enough that the sea does not mirror it as a wall of white' },
  env_sun_elevation_deg: { value: 58, source: 'RECONSTRUCTED §8 the card is carried well above the sun\'s own elevation on purpose. It is there to give the copper and the gilt a highlight, and at the sun\'s real height the sea mirrors it straight back into the camera as a glare path' },
  hull_env_intensity: { value: 1.8, source: 'RECONSTRUCTED §8 the copper band is metal, so the environment is the only thing that lights it at all; tuned so the sheathing lands near the photograph\'s #982f0f-#93401e rather than a third of that' },
  sea_surface_colour: { hex: '#153549', source: 'RECONSTRUCTED §8 deep water on a sunny day, dark enough that a black hull still reads against it' },
  sea_surface_roughness: { value: 0.40, source: 'RECONSTRUCTED §8 a light chop rather than a mirror; at 0.16 the sun\'s path across the water came back as a hard white wall' },
  sea_surface_env_intensity: { value: 0.42, source: 'RECONSTRUCTED §8 the water is held back from the environment so that warming the sky for the ship\'s sake does not bleach the sea' },

  // Shadows. three\'s PCFSoftShadowMap ignores `shadow.radius`, so softness cannot be
  // asked for; it has to be built, by giving the sun a finite size. `shadow_taps` lights
  // share the key\'s intensity round a ring `shadow_spread_deg` wide, each casting its own
  // shadow. Their shadows agree close to an occluder and disagree far from it, which is
  // what a penumbra is: the ship\'s shadow on the water, thrown from forty metres up,
  // comes out soft, while a gun\'s shadow on the deck beside it stays sharp.
  shadow_taps: { value: 3, source: 'RECONSTRUCTED §8 three is the fewest that reads as a penumbra rather than as a double image, and each one costs a full shadow pass' },
  shadow_spread_deg: { value: 2.6, source: 'RECONSTRUCTED §8 five times the sun\'s true half-degree, which is what it takes for the penumbra to be visible at this scale; tuned on the ship\'s shadow on the sea in the beam view' },
  shadow_map_size: { value: 3072, source: 'RECONSTRUCTED §8 over a shadow camera 96 m across this is 31 mm to the texel, fine enough that a shroud casts a line and not a staircase' },
  shadow_extent: { value: 48, source: 'RECONSTRUCTED §8 half-width of the shadow camera: a ship 59 m over all and 45 m to the trucks, plus the reach of her shadow on the water' },
  shadow_bias: { value: -0.0004, source: 'RECONSTRUCTED §8 with a normal bias as well, the depth bias only has to close the last of the acne, and a large one detaches a shadow from its caster' },
  shadow_normal_bias: { value: 0.035, source: 'RECONSTRUCTED §8 rather more than a texel of the shadow camera, which is what stops the jagged self-shadowing along the sails and the topsides' },
};

// The offset table is generated from the draught by tools/extract-draught.py and lives
// in docs/offsets.json. It is imported rather than written here so that the numbers
// stay attached to the script that produced them.
export { OFFSETS } from './offsets.js';
