import fs from 'node:fs';

const read = (path) => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const entries = read('src/lib/destination-interests/entries.ts');
const tests = read('src/lib/destination-interests/entries.test.ts');
const app = read('src/App.svelte');
const dna = read('docs/PRODUCT-DNA.md');
const must = (condition, message) => { if (!condition) throw new Error(message); };

must(entries.includes("kind === 'culinary_local' ? 20.0"), 'Capacity regression gate failed: protected culinary content budget is missing.');
must(entries.includes("tightRelief = density === 'tight' ? 1.5 : 0"), 'Capacity regression gate failed: bounded tight relief is missing.');
must(tests.includes('restores the Bergen culinary capacity warning'), 'Capacity regression gate failed: Bergen regression test is missing.');
must(tests.includes('expect(state.overflow).toBe(true)'), 'Capacity regression gate failed: Bergen regression no longer expects overflow.');
must(app.includes('Diese Seite kann diesen Inhalt nicht mehr ruhig erzählen.'), 'Capacity regression gate failed: Travel Language overflow warning is missing.');
must(dna.includes('Capacity Protection bleibt autoritativ'), 'Capacity regression gate failed: Product DNA regression rule is missing.');

console.log('Capacity Protection Regression Gate: \x1b[32mPASS\x1b[0m');
