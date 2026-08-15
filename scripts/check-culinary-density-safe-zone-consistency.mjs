import fs from 'node:fs';

const app = fs.readFileSync(new URL('../src/App.svelte', import.meta.url), 'utf8');
const entries = fs.readFileSync(new URL('../src/lib/destination-interests/entries.ts', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../src/styles/destination-interests.css', import.meta.url), 'utf8');
const dna = fs.readFileSync(new URL('../docs/PRODUCT-DNA.md', import.meta.url), 'utf8');

const must = (text, token, message) => { if (!text.includes(token)) throw new Error(message); };

must(app, 'interestPageLayoutState(', 'Culinary density gate failed: shared Interest layout state is not used.');
must(app, 'interestLayoutState.overflow', 'Culinary density gate failed: overflow must come from bounded layout state.');
must(entries, "kind === 'culinary_local'", 'Culinary density gate failed: culinary capacity needs an explicit bounded branch.');
must(entries, 'allowsTwoUpWithPlaceReference', 'Culinary density gate failed: text place references must not force stacking by themselves.');
must(entries, "density: InterestPageDensity", 'Culinary density gate failed: density must be a closed fixed-state type.');
must(css, 'Interest Pages have exactly two fixed typography states', 'Culinary density gate failed: fixed comfortable/tight typography rule is missing.');
must(css, 'font-size: 9px; line-height: 1.34;', 'Culinary density gate failed: tight body floor is missing.');
must(css, '.a5-page.destination-interest-page .editorial-footer', 'Culinary density gate failed: Footer safe-zone invariant is missing.');
must(css, '.a5-page.destination-interest-page .companion-zone-bottom-left', 'Culinary density gate failed: Companion safe-zone invariant is missing.');
must(dna, 'genau zwei feste Typografie-Stufen', 'Culinary density gate failed: Product DNA does not record the bounded typography rule.');
must(dna, 'niemals durch freie Skalierung', 'Culinary density gate failed: Product DNA does not prohibit arbitrary scaling.');

console.log('Culinary Density & Safe-Zone Consistency Gate: \x1b[32mPASS\x1b[0m');
