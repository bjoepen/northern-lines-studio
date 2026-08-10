import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const capacity = read('src/lib/layout/capacity.ts');
const app = read('src/App.svelte');
const css = read('src/styles.css');
const dna = read('docs/PRODUCT-DNA.md');
const failures = [];

for (const token of ['destinationTitleComposition', "'balanced'", "'title-wide'", "'title-dominant'", "'stacked'", 'destinationExtensionComposition', "'wide-first'", "'wide-second'"]) {
  if (!capacity.includes(token)) failures.push(`Missing adaptive grammar token: ${token}`);
}
for (const token of ['title-${destinationTitleLayout}', 'destination-title-${destinationTitleLayout}', 'destination-extensions-${destinationExtensionLayout}']) {
  if (!app.includes(token)) failures.push(`Preview does not apply adaptive grammar class: ${token}`);
}
for (const token of ['overflow-wrap: normal', 'word-break: normal', 'hyphens: none', 'destination-title-title-wide', 'destination-title-title-dominant', 'destination-title-stacked', 'destination-extensions-wide-first', 'destination-extensions-wide-second', 'destination-hero-left.title-title-wide', 'destination-hero-right.title-title-wide']) {
  if (!css.includes(token)) failures.push(`Missing adaptive CSS rule: ${token}`);
}
if (!dna.includes('Die Seitenwirkung bleibt stabil. Die innere Komposition passt sich dem Inhalt an.')) failures.push('Product DNA does not contain adaptive grammar principle.');

if (failures.length) {
  console.error('Adaptive Layout Grammar Consistency Gate: FAIL');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log('Adaptive Layout Grammar Consistency Gate: PASS');
console.log('Stable Page Effect → Adaptive Title → Adaptive Extensions → Companion Protection → Tests');
