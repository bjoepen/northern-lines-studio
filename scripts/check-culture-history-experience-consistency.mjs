import fs from 'node:fs';

const app = fs.readFileSync(new URL('../src/App.svelte', import.meta.url), 'utf8');
const entries = fs.readFileSync(new URL('../src/lib/destination-interests/entries.ts', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../src/styles/destination-interests.css', import.meta.url), 'utf8');

const required = [
  "destinationInterestKind === 'culture_history'",
  'culture-history-experience',
  'culture-history-places',
  'Orte & Stationen',
  'Einordnung & Bedeutung',
  'Besuchshinweis',
  'Zeitbezug',
  'Ort & Karte'
];
for (const token of required) {
  if (!app.includes(token)) throw new Error(`Culture & History gate failed: missing ${token}`);
}
for (const token of ["entryKind: 'culture_place'", "addLabel: 'Ort / Station hinzufügen'", "id: 'category'", "id: 'why'", "id: 'guidance'", "id: 'timeReference'", "id: 'placeReference'"]) {
  if (!entries.includes(token)) throw new Error(`Culture & History schema gate failed: missing ${token}`);
}
for (const token of ['.culture-history-experience', '.culture-history-entry-card', '.culture-history-entry-details']) {
  if (!css.includes(token)) throw new Error(`Culture & History style gate failed: missing ${token}`);
}
console.log('Culture & History Experience Consistency Gate: \x1b[32mPASS\x1b[0m');
