import { readFileSync } from 'node:fs';

const files = {
  app: readFileSync(new URL('../src/App.svelte', import.meta.url), 'utf8'),
  css: readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8'),
  capacity: readFileSync(new URL('../src/lib/layout/capacity.ts', import.meta.url), 'utf8'),
  inspector: readFileSync(new URL('../src/lib/inspector-layout.ts', import.meta.url), 'utf8'),
  dna: readFileSync(new URL('../docs/PRODUCT-DNA.md', import.meta.url), 'utf8'),
  architecture: readFileSync(new URL('../docs/ARCHITECTURE.md', import.meta.url), 'utf8')
};
const combined = Object.values(files).join('\n');
const failures = [];

for (const token of [
  'destinationModuleComposition',
  "DestinationModuleComposition = 'single' | 'two' | 'three'",
  'destination-modules-single',
  'destination-modules-two',
  'destination-modules-three',
  'destination-hero-right',
  'margin-top: 24px',
  'destination-image-text-action',
  'destination-image-remove-action',
  "'+ Bild auswählen'",
  "'Bild ersetzen'",
  'Entfernen</button>',
  'destination-preview.destination-hero-banner .destination-story',
  'padding-top: 18px',
  'destination-image-role-status',
  'grid-template-columns: minmax(0, 1.10fr) minmax(0, .90fr)',
  'INSPECTOR_MIN_WIDTH = 320',
  'INSPECTOR_MAX_WIDTH = 440',
  'INSPECTOR_WIDTH_STORAGE_KEY',
  'inspector-resize-handle',
  '--inspector-width',
  'localStorage',
  '15 mm',
  'Companion',
  'neutral-white'
]) {
  if (!combined.includes(token)) failures.push(`Missing Build 023 composition token: ${token}`);
}

for (const forbidden of [
  'cropX', 'cropY', 'focalPoint', 'freeLayout', 'layoutX', 'layoutY'
]) {
  if (files.app.includes(forbidden) || files.inspector.includes(forbidden)) {
    failures.push(`Forbidden Build 023 free-layout shortcut: ${forbidden}`);
  }
}

if (combined.includes('inspectorWidth:') && combined.includes('formatVersion')) {
  failures.push('Inspector width must not become part of the .nls project schema');
}

if (failures.length) {
  console.error('Destination Composition Consistency Gate: FAIL');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Destination Composition Consistency Gate: PASS');
console.log('Image Composition → Module Grammar → Inspector Ergonomics → Local Preference → Product DNA → Tests');
