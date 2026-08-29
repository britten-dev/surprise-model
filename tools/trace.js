// The traceability check. The brief is that every dimension in the generator traces to
// SPECS.md, so this proves it mechanically: every key in src/spec/spec.js must appear
// in SPECS.md, and every key SPECS.md defines should be used by the generator.
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { ROOT } from './serve.js';

const specMd = await fs.readFile(path.join(ROOT, 'SPECS.md'), 'utf8');
const { SPEC } = await import(path.join(ROOT, 'src/spec/spec.js'));

// Keys as SPECS.md writes them: a snake_case token in the first cell of a table row.
const inDoc = new Set(
  [...specMd.matchAll(/^\|\s*`?([a-z][a-z0-9_]{3,})`?\s*\|/gm)].map((m) => m[1])
);

const codeKeys = Object.keys(SPEC);
const undocumented = codeKeys.filter((k) => !inDoc.has(k));
const unused = [...inDoc].filter((k) => !(k in SPEC));

// A source citation on every row is the other half of traceability.
const uncited = codeKeys.filter((k) => {
  const v = SPEC[k];
  return typeof v === 'object' && !v.source;
});

console.log(`spec.js: ${codeKeys.length} keys.  SPECS.md: ${inDoc.size} keys.`);

let bad = 0;
if (undocumented.length) {
  bad += undocumented.length;
  console.log(`\n${undocumented.length} generator dimension(s) with no row in SPECS.md:`);
  undocumented.forEach((k) => console.log('  ' + k));
}
if (uncited.length) {
  bad += uncited.length;
  console.log(`\n${uncited.length} spec row(s) with no source:`);
  uncited.forEach((k) => console.log('  ' + k));
}
if (unused.length) {
  console.log(`\n${unused.length} SPECS.md key(s) the generator does not use yet:`);
  console.log('  ' + unused.join(', '));
}

if (bad) { console.error(`\ntraceability broken: ${bad} problem(s).`); process.exit(1); }
console.log('\nevery generator dimension traces to a sourced row in SPECS.md.');
