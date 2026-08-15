import fs from 'node:fs';

const read = (path) => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const entries = read('src/lib/destination-interests/entries.ts');
const capacity = read('src/lib/layout/capacity.ts');
const css = read('src/styles/destination-interests.css');
const dna = read('docs/PRODUCT-DNA.md');
const architecture = read('docs/ARCHITECTURE.md');

const must = (condition, message) => { if (!condition) throw new Error(message); };

for (const token of ["'two-up'", "'one-third-two-thirds'", "'two-thirds-one-third'", "'stacked'"]) {
  must(entries.includes(token), `Content Fit gate failed: Interest candidate ${token} is missing.`);
}
must(entries.includes('bestFittingTwoEntryComposition'), 'Content Fit gate failed: Interest candidate search is missing.');
must(entries.includes('evaluatedCompositions'), 'Content Fit gate failed: evaluated composition evidence is missing.');
must(entries.includes('Content Fit decides the composition'), 'Content Fit gate failed: runtime rule is not documented in code.');
must(!entries.includes("'grouped'"), 'Content Fit gate failed: catch-all grouped Interest composition still exists.');
must(css.includes('.interest-entry-grid.interest-entry-one-third-two-thirds'), 'Content Fit gate failed: 1/3–2/3 layout CSS is missing.');
must(css.includes('.interest-entry-grid.interest-entry-two-thirds-one-third'), 'Content Fit gate failed: 2/3–1/3 layout CSS is missing.');
must(css.includes('never collapse heterogeneous entries'), 'Content Fit gate failed: catch-all box prohibition is missing from Interest CSS grammar.');
for (const token of ["'balanced'", "'wide-first'", "'wide-second'", "'stacked'"]) {
  must(capacity.includes(token), `Content Fit gate failed: Destination extension candidate ${token} is missing.`);
}
must(dna.includes('Content Fit entscheidet über die Komposition'), 'Content Fit gate failed: global Product DNA rule is missing.');
must(dna.includes('Nicht sammeln, sondern erzählen'), 'Content Fit gate failed: catch-all box rule is missing from Product DNA.');
must(dna.includes('1/3–2/3'), 'Content Fit gate failed: asymmetric composition rule is missing from Product DNA.');
must(architecture.includes('Content Fit before Composition'), 'Content Fit gate failed: architecture contract is missing.');

console.log('Content Fit & Composition Consistency Gate: \x1b[32mPASS\x1b[0m');
