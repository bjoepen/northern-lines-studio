import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const files = {
  app: readFileSync(resolve(root, 'src/App.svelte'), 'utf8'),
  styles: readFileSync(resolve(root, 'src/styles.css'), 'utf8'),
  destination: readFileSync(resolve(root, 'src/lib/destinations/index.ts'), 'utf8'),
  capacity: readFileSync(resolve(root, 'src/lib/layout/capacity.ts'), 'utf8'),
  capacityTests: readFileSync(resolve(root, 'src/lib/layout/capacity.test.ts'), 'utf8'),
  destinationTests: readFileSync(resolve(root, 'src/lib/destinations/destinations.test.ts'), 'utf8'),
  productDna: readFileSync(resolve(root, 'docs/PRODUCT-DNA.md'), 'utf8'),
  readme: readFileSync(resolve(root, 'README.md'), 'utf8')
};

const failures = [];
const combined = Object.values(files).join('\n');

for (const token of [
  '--binding-safe-left: 48.25px',
  '--companion-safe-width',
  '--companion-safe-height',
  'destination-modules-three',
  'grid-template-columns: repeat(3, minmax(0, 1fr))',
  'capacity-comfortable',
  'capacity-tight',
  'capacity-overflow',
  'destinationContentCapacity',
  'formatTravelTime',
  'normalizeTravelTimeInput',
  'travel-time-input',
  'destinationIsDirty',
  'hasUnsavedChanges',
  'Verwerfen',
  'Abbrechen',
  'Speichern'
]) {
  if (!combined.includes(token)) failures.push(`Build 021 resilience token: ${token}`);
}

if (files.styles.includes('.destination-subtitle { margin: -')) {
  failures.push('Subtitle must not use negative margin against the protected title zone');
}

if (!files.styles.includes('left: max(52px, var(--binding-safe-left))')) {
  failures.push('Fjord companion must begin after the 17 mm binding-safe edge');
}

if (!files.app.includes('placeholder="08:00"') || files.app.includes('placeholder="08:00 Uhr"')) {
  failures.push('Traveller must enter clock values without typing Uhr');
}

if (!files.app.includes('{formatTravelTime(destinationArrival)}') || !files.app.includes('{formatTravelTime(destinationDeparture)}')) {
  failures.push('Destination preview must use Travel Language time formatting');
}


if (!files.destinationTests.includes('detects unsaved destination changes across nested editorial fields')) {
  failures.push('Destination nested dirty-state regression test must be present');
}

if (!files.readme.includes('docs/PRODUCT-DNA.md') || !files.productDna.includes('Intern darf Northern Lines Studio komplex sein')) {
  failures.push('Product DNA must remain a permanent repository reference');
}

for (const forbidden of ['font-size: 6px !important', 'display: none; /* overflow', 'destination-hero-compact']) {
  if (files.styles.includes(forbidden) || files.app.includes(forbidden)) failures.push(`Forbidden fit/layout shortcut: ${forbidden}`);
}

if (failures.length) {
  console.error('Layout Resilience Consistency Gate: FAILED');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Layout Resilience Consistency Gate: PASS');
console.log('Binding → Title → Companion → Footer → Capacity → Time Language → Unsaved Changes → Product DNA → Tests');
