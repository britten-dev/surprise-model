// How much of her moves, and how fast.
//
// None of this is measurable on a built ship, so every row here is `noAudit` — the audit
// measures geometry and this is not geometry, it is the amount by which geometry is
// allowed to move. What keeps it honest instead is that all of it is an amplitude in
// metres or a period in seconds, both of which can be argued with: a mast that whips
// half a metre at the truck is a claim about a mast, and it is either the sort of thing
// a mast does or it is not.
//
// The numbers are for a frigate running before a Southern Ocean gale, which is the
// weather this ship is built for. In a flat calm a host should scale them down; every
// one of them is multiplied by the wind and the ship's own motion at runtime, so a host
// that passes no weather gets a ship that is nearly still.
import { m, n } from '../units.js';

const R = 'RECONSTRUCTED §10';

export const MOTION_SPEC = {
  // ------------------------------------------------------------------ aloft
  // A lower mast is a tree trunk and does not visibly bend; a topgallant mast forty
  // metres up, carrying the weight of its yard and the pull of its rigging, does. The
  // whole rig therefore leans and recovers as she rolls, and it is the single motion
  // that most says a ship is alive: everything above the deck moves together, and
  // slightly late.
  motion_whip_amplitude: m(0.55, `${R} how far the main truck swings out of line at the height of a roll. Measured against her own mast: half a metre in forty-five is about a degree and a half of bend, which is what a rig this size takes`, { noAudit: true }),
  motion_whip_exponent: n(2.0, `${R} the bend goes as the square of the height above the deck, which is what a tapered spar loaded at its head does. Linear is wrong and reads as the whole ship leaning`, { noAudit: true }),
  motion_whip_lag: n(0.55, `${R} how far behind the hull's own roll the rig runs, in seconds. Without the lag the masts and the hull move as one piece, which is exactly the look this is meant to break`, { noAudit: true }),
  motion_whip_period: n(7.4, `${R} the rig's own period when nothing is driving it, in seconds — a slow working, so that a ship lying quietly is not perfectly still`, { noAudit: true }),

  // ------------------------------------------------------------------- canvas
  motion_sail_flutter: m(0.22, `${R} how far the belly of a set sail moves, at the middle of it, in a hard breeze. A quarter of a metre on a sail ten metres across is a shiver, not a flap: a drawing sail is a taut curved surface and it must not billow like a bedsheet`, { noAudit: true }),
  motion_sail_wave_length: m(3.4, `${R} the length of the ripple that travels across a sail from luff to leech`, { noAudit: true }),
  motion_sail_wave_speed: n(1.35, `${R} ripples per second across a sail; the wave runs to leeward, as the wind does`, { noAudit: true }),
  motion_sail_breathe: n(0.22, `${R} how much the whole belly of a sail comes and goes with the gusts, as a fraction of the flutter. This is the slow one, and it is what separates canvas from a curved plate`, { noAudit: true }),
  motion_sail_luff_shiver: n(2.2, `${R} how much harder the leech of a sail shivers than its middle. The leech is the free edge and it is where the eye looks`, { noAudit: true }),

  // ------------------------------------------------------------------ cordage
  motion_rope_sway: m(0.10, `${R} how far the middle of a shroud swings. A shroud is set up taut and moves very little; a slack brace or a buntline moves several times this, and the running rigging is given that multiple below`, { noAudit: true }),
  motion_rope_period: n(2.6, `${R} the period of a set-up shroud, in seconds`, { noAudit: true }),
  motion_running_rope_factor: n(3.0, `${R} running rigging is not set up taut and swings this many times as far as a shroud`, { noAudit: true }),

  // ------------------------------------------------------------------- colours
  motion_flag_wave_speed: n(2.4, `${R} how fast the wave runs down a flag, in wave lengths per second at the wind speed the model is drawn for. A flag is the fastest thing on the ship and the only part of her that moves at a speed the eye can follow`, { noAudit: true }),

  // -------------------------------------------------------------------- people
  motion_crew_sway_deg: n(3.5, `${R} how far a man standing on a moving deck sways out of his own upright, over and above the heel of the ship he is standing on`, { noAudit: true }),
  motion_crew_sway_period: n(4.2, `${R} his period, in seconds — near the ship's roll but not locked to it, so that thirteen men do not sway as one`, { noAudit: true }),
  motion_helm_throw_deg: n(140, `${R} how far the wheel turns from midships to hard over. A little under half a turn each way, which is the usual four spokes`, { noAudit: true }),
  motion_helmsman_reach_deg: n(26, `${R} how far a helmsman's shoulders follow the wheel. His hands go round with the spokes and his body does not`, { noAudit: true }),

  // ---------------------------------------------------------------------- wet
  motion_wet_dry_seconds: n(9.0, `${R} how long the topsides take to dry after a sea has been over them. It is slow, and it is what makes the wetness read as something that happened rather than as a setting`, { noAudit: true }),
};
