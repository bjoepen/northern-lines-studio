import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const files = {
  app: readFileSync(resolve(root, 'src/App.svelte'), 'utf8'),
  project: readFileSync(resolve(root, 'src/lib/project.ts'), 'utf8'),
  destination: readFileSync(resolve(root, 'src/lib/destinations/index.ts'), 'utf8'),
  destinationTests: readFileSync(resolve(root, 'src/lib/destinations/destinations.test.ts'), 'utf8'),
  rust: readFileSync(resolve(root, 'src-tauri/src/lib.rs'), 'utf8'),
  styles: readFileSync(resolve(root, 'src/styles.css'), 'utf8'),
  productDna: readFileSync(resolve(root, 'docs/PRODUCT-DNA.md'), 'utf8'),
  format: readFileSync(resolve(root, 'docs/project-format.md'), 'utf8')
};

const failures = [];
const combined = Object.values(files).join('\n');

for (const token of [
  'DestinationImages',
  'wide?: string',
  'left?: string',
  'right?: string',
  'destinationImageRole',
  'destinationImageGeometry',
  'Bild des Ortes',
  'Bild auswählen …',
  'set_destination_image',
  'remove_destination_image',
  'read_image_preview',
  'assets/destinations/',
  'object-fit: contain',
  '2400 × 600 px',
  '1500 × 2250 px',
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
  failures.push('Companion must return to its invariant Editorial-World position');
}
if (!files.productDna.includes('Der Begleiter ist unantastbar')) {
  failures.push('Product DNA must protect the Companion');
}
if (!files.destinationTests.includes('maps each page effect to its semantic image role')) {
  failures.push('Destination image-role test must be present');
}

if (failures.length) {
  console.error('Destination Imagery Consistency Gate: FAILED');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Destination Imagery Consistency Gate: PASS');
console.log('Image Roles → Project Assets → Inspector → Geometry Help → Preview → 15 mm Binding → Companion Invariance → Tests');
