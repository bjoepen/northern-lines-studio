import fs from 'node:fs';

const read = (path) => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const entries = read('src/lib/destination-interests/entries.ts');
const tests = read('src/lib/destination-interests/entries.test.ts');
const dna = read('docs/PRODUCT-DNA.md');
const must = (condition, message) => { if (!condition) throw new Error(message); };

must(!entries.includes('function entryFitsWidth('), 'Geometric Content Fit gate failed: raw width/content-length threshold still exists.');
must(entries.includes('wrapped-height geometry'), 'Geometric Content Fit gate failed: wrapped-height fit contract is missing.');
must(tests.includes('Skagehola → Skageflå → Homlong'), 'Geometric Content Fit gate failed: Geiranger route fixture is missing.');
must(tests.includes('Trittsicherheit erforderlich.'), 'Geometric Content Fit gate failed: full safety note is missing from regression fixture.');
must(tests.includes('expect(state.overflow).toBe(false)'), 'Geometric Content Fit gate failed: Geiranger false-positive expectation is missing.');
must(dna.includes('Overflow nur aus geometrischem Content Fit'), 'Geometric Content Fit gate failed: Product DNA rule is missing.');

console.log('Geometric Content Fit Regression Gate: \x1b[32mPASS\x1b[0m');
