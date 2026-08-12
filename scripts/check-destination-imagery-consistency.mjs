import { readConsolidatedStyles } from './read-consolidated-styles.mjs';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const files = {
  app: readFileSync(resolve(root, 'src/App.svelte'), 'utf8'),
  project: readFileSync(resolve(root, 'src/lib/project.ts'), 'utf8'),
  destination: readFileSync(resolve(root, 'src/lib/destinations/index.ts'), 'utf8'),
  destinationTests: readFileSync(resolve(root, 'src/lib/destinations/destinations.test.ts'), 'utf8'),
  rust: readFileSync(resolve(root, 'src-tauri/src/lib.rs'), 'utf8'),
  styles: readConsolidatedStyles(root),
  productDna: readFileSync(resolve(root, 'docs/PRODUCT-DNA.md'), 'utf8'),
  format: readFileSync(resolve(root, 'docs/project-format.md'), 'utf8')
};

const failures = [];
const combined = Object.values(files).join('\n');

for (const token of [
  'DestinationImages',
  'wide?: string',
  'portrait?: string',
  "DestinationImageRole = 'wide' | 'portrait'",
  'destinationImageRole',
  'destinationImageGeometry',
  'Bild des Ortes',
  '+ Bild auswählen',
  'set_destination_image',
  'remove_destination_image',
  'read_image_preview',
  'assets/destinations/',
  'object-fit: contain',
  'ca. 3:1–4:1',
  '1500 × 2250 px',
  'destination-image-present',
  '0.9.0'
]) {
  if (!combined.includes(token)) failures.push(`Build 022 imagery token: ${token}`);
}

for (const forbidden of [
  'Asset Manager',
  'Crop Editor',
  'Focal Point',
  'object-fit: cover',
  'drag-and-drop image',
  'destinationImageX',
  'destinationImageY'
]) {
  if (files.app.includes(forbidden) || files.styles.includes(forbidden) || files.project.includes(forbidden)) {
    failures.push(`Forbidden Build 022 imagery shortcut: ${forbidden}`);
  }
}

if (!files.styles.includes('--binding-safe-left: 42.57px')) {
  failures.push('Build 022 must use the approved 15 mm technical binding minimum');
}
if (!files.styles.includes('.a5-page.destination-page .companion-zone-bottom-left') || !files.styles.includes('left: 34px;')) {
  failures.push('Companion must remain at its invariant Editorial-World position');
}
if (!files.styles.includes('.a5-page.fjord-page.destination-page') || !files.styles.includes('background: #fffdfa')) {
  failures.push('Fjord Destination Pages must keep the approved neutral-white paper surface');
}
if (!files.styles.includes('.destination-hero-placeholder.destination-image-present') || !files.styles.includes('background: transparent')) {
  failures.push('Real imagery must be composed on paper without a coloured image-card background');
}
if (!files.styles.includes('Editorial modules are not automatically cards')) {
  failures.push('Destination modules must not default to a Card UI system');
}
if (!files.productDna.includes('Der Begleiter ist unantastbar')) {
  failures.push('Product DNA must protect the Companion');
}
if (!files.destinationTests.includes('maps each page effect to its semantic image role')) {
  failures.push('Destination image-role test must be present');
}
if (!files.destinationTests.includes("toBe('portrait')")) {
  failures.push('Bild links and Bild rechts must share the portrait image role');
}

if (failures.length) {
  console.error('Destination Imagery Consistency Gate: FAILED');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Destination Imagery Consistency Gate: \x1b[32mPASS\x1b[0m');
console.log('Image Roles → Project Assets → Inspector → Geometry Help → Image Composition → White Fjord Surface → 15 mm Binding → Companion Invariance → Tests');
