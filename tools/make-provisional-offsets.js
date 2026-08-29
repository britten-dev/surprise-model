// A provisional offset table, used only until tools/extract-draught.py has traced the
// real lines off ZAZ3067. It is a fair French-corvette form scaled to the recorded
// dimensions, not a reading of the plan, and it is marked as such in its provenance so
// it cannot be mistaken for evidence.
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { ROOT } from './serve.js';

const FOOT = 0.3048;
const L = 126 * FOOT;            // length on the gundeck
const B = (31 + 8 / 12) * FOOT;  // extreme breadth
const HB = B / 2;
const DRAUGHT = (14 + 0.5 / 12) * FOOT;

// The midship station — the station of maximum breadth — sits at this fraction of the
// length from the stem. French corvettes of the 1790s carried their beam further aft
// than a British-built hull of the same date.
const MID_U = 0.46;

// Half-breadth at the design waterline, as a fraction of the maximum, at 21 evenly
// spaced stations from the stem (0) to the sternpost (20). A fine entrance, a long
// full midbody and a moderately fine run.
const WATERPLANE = [
  0.02, 0.12, 0.26, 0.42, 0.57, 0.70, 0.81, 0.89, 0.95, 0.99, 1.00,
  0.995, 0.985, 0.965, 0.930, 0.878, 0.808, 0.718, 0.612, 0.492, 0.365,
];

// Where the maximum breadth of each section sits, as a fraction of the depth from the
// keel to the deck at side. Just above the load waterline amidships, rising forward.
const MAXB_T = 0.62;

const yKeel = -DRAUGHT - 0.30;   // underside of the keel, with the false keel
const yDeckMid = 1.372;          // gundeck above the load waterline amidships

// The sheer: the deck at side, as height above the load waterline. A frigate's sheer
// is a single sweet curve with its low point abaft midships.
function sheerAt(u) {
  const low = 0.56;
  const rise = (t) => t * t;
  return u < low
    ? yDeckMid + 1.30 * rise((low - u) / low)
    : yDeckMid + 1.02 * rise((u - low) / (1 - low));
}

// Rise of floor and the turn of the bilge, expressed as the section's half-breadth at
// a given fraction of its depth. Deadrise increases toward the ends.
function sectionShape(t, fineness) {
  const tc = Math.min(t / MAXB_T, 1);
  // A superelliptic section: `be` controls how quickly the floor rises, `bf` how hard
  // the bilge turns. Both sharpen toward the ends, which is what a fine entrance is.
  const be = 2.05 + fineness * 2.6;
  const bf = 1.55 + fineness * 0.55;
  let x = Math.pow(1 - Math.pow(1 - tc, be), 1 / bf);
  if (t > MAXB_T) {
    // Tumblehome above the maximum breadth.
    const over = (t - MAXB_T) / (1 - MAXB_T);
    x *= 1 - 0.115 * over * over;
  }
  return x;
}

const stations = [];
for (let i = 0; i <= 20; i++) {
  const u = i / 20;
  stations.push({
    u,
    z: (u - MID_U) * L,
    wp: WATERPLANE[i],
    // How fine this station is: 0 amidships, 1 at the ends.
    fineness: Math.min(1, Math.abs(u - MID_U) / Math.max(MID_U, 1 - MID_U)) ** 1.4,
    deckY: sheerAt(u),
  });
}

const waterlineY = [];
for (let k = 0; k <= 7; k++) waterlineY.push(yKeel + 0.30 + (k / 7) * (DRAUGHT + 1.20));

const halfBreadth = stations.map((s) => waterlineY.map((y) => {
  const depth = s.deckY - yKeel;
  const t = (y - yKeel) / depth;
  if (t < 0 || t > 1) return null;
  const x = HB * s.wp * sectionShape(t, s.fineness);
  return Math.round(x * 10000) / 10000;
}));

// The rabbet: where the planking meets the keel and, forward and aft, the stem and
// sternpost. It rises at the ends as the deadwood narrows.
const rabbetY = stations.map((s) => {
  const e = Math.min(1, Math.abs(s.u - MID_U) / Math.max(MID_U, 1 - MID_U));
  return yKeel + 0.30 + Math.pow(e, 3.4) * (DRAUGHT * 0.72);
});
const rabbetX = stations.map((s) => Math.max(0.055, 0.14 * (1 - Math.pow(
  Math.min(1, Math.abs(s.u - MID_U) / Math.max(MID_U, 1 - MID_U)), 2.2))));

const out = {
  provenance: {
    grade: 'PROVISIONAL — NOT TRACED FROM THE DRAUGHT',
    note: 'A fair French-corvette form scaled to the recorded dimensions of Surprise. '
      + 'Replaced by tools/extract-draught.py once the ZAZ3067 lines have been traced. '
      + 'Do not cite this as evidence of the ship\'s form.',
    dimensions: { length_gundeck_m: L, beam_extreme_m: B, draught_m: DRAUGHT, midship_station_u: MID_U },
  },
  stationZ: stations.map((s) => Math.round(s.z * 10000) / 10000),
  waterlineY: waterlineY.map((y) => Math.round(y * 10000) / 10000),
  halfBreadth,
  deckAtSideY: stations.map((s) => Math.round(s.deckY * 10000) / 10000),
  deckAtSideX: stations.map((s, i) => {
    const t = (s.deckY - rabbetY[i]) / (s.deckY - yKeel);
    return Math.round(HB * s.wp * sectionShape(Math.min(t, 1), s.fineness) * 10000) / 10000;
  }),
  rabbetY: rabbetY.map((y) => Math.round(y * 10000) / 10000),
  rabbetX: rabbetX.map((x) => Math.round(x * 10000) / 10000),
};

await fs.writeFile(path.join(ROOT, 'docs/offsets.provisional.json'), JSON.stringify(out, null, 1));
console.log(`provisional offsets: ${out.stationZ.length} stations x ${out.waterlineY.length} waterlines`);
console.log(`  z ${out.stationZ[0].toFixed(2)} to ${out.stationZ.at(-1).toFixed(2)} m`);
console.log(`  max half-breadth ${Math.max(...halfBreadth.flat().filter(Boolean)).toFixed(3)} m (recorded half-beam ${(B / 2).toFixed(3)})`);
