import fs from 'node:fs';

const app = fs.readFileSync(new URL('../src/App.svelte', import.meta.url), 'utf8');
const entries = fs.readFileSync(new URL('../src/lib/destination-interests/entries.ts', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../src/styles/destination-interests.css', import.meta.url), 'utf8');
const dna = fs.readFileSync(new URL('../docs/PRODUCT-DNA.md', import.meta.url), 'utf8');

for (const token of [
  "selectedPage.destinationInterestKind === 'culinary_local'",
  'culinary-local-experience',
  'culinary-local-recommendations',
  'Probieren & entdecken',
  'Gut zu wissen',
  'Zeit / Preis',
  'Noch keine Empfehlung angelegt.'
]) {
  if (!app.includes(token)) throw new Error(`Culinary & Local gate failed: missing ${token}`);
}

for (const token of [
  "entryKind: 'culinary_recommendation'",
  "addLabel: 'Empfehlung hinzufügen'",
  "id: 'try'",
  "id: 'timePrice'",
  "label: 'Ort / Kartenbezug'"
]) {
  if (!entries.includes(token)) throw new Error(`Culinary & Local schema gate failed: missing ${token}`);
}

for (const token of ['.culinary-local-experience', '.culinary-local-entry-card', '.culinary-local-entry-details']) {
  if (!css.includes(token)) throw new Error(`Culinary & Local style gate failed: missing ${token}`);
}

if (!dna.includes('Kulinarik & Lokal')) throw new Error('Culinary & Local Product DNA rule missing.');

console.log('Culinary & Local Experience Consistency Gate: \x1b[32mPASS\x1b[0m');
