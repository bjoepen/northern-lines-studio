import { readConsolidatedStyles } from './read-consolidated-styles.mjs';
import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';

const root = resolve(import.meta.dirname, '..');
const files = {
  app: readFileSync(new URL('../src/App.svelte', import.meta.url), 'utf8'),
  css: readConsolidatedStyles(root),
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
  'destination-title-safe-zone',
  'destination-title-intro-composition',
  'destination-title-block',
  'destination-introduction',
  '--weites-hero-height: 118px',
  '--weites-title-gap: 16px',
  'border-left: 1px solid rgba(84, 113, 129, .38)',
  'destination-preview.destination-hero-banner .destination-story .page-rule',
  'grid-template-rows: var(--weites-hero-height) var(--weites-title-gap) auto auto',
  'grid-template-columns: minmax(0, 1.05fr) minmax(0, .95fr)',
  'overflow: hidden',
  'height: 100%',
  'max-height: 100%',
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

if (files.css.includes('margin-bottom: 24px') || files.css.includes('padding-top: 18px')) {
  failures.push('Legacy Weite spacing patches must not survive the consolidated grammar');
}

if (files.css.includes('.destination-preview.destination-hero-banner .destination-hero-placeholder.destination-image-present {\n  min-height: 0;\n  height: auto;')) {
  failures.push('Weite image-present state must not return to intrinsic auto height');
}

if (!files.css.includes('object-fit: contain') || !files.css.includes('object-position: center center')) {
  failures.push('Weite hero image must remain contained inside the grammar-owned Hero Zone');
}

const safeZoneMarkupCount = (files.app.match(/destination-title-safe-zone/g) ?? []).length;
if (safeZoneMarkupCount !== 1) {
  failures.push(`Expected exactly one destination title-safe zone in App.svelte, found ${safeZoneMarkupCount}`);
}

const authoritativeWeiteCount = (files.css.match(/Build 023 · Final Zone Separation Fix/g) ?? []).length;
const finalEditorialCompositionCount = (files.css.match(/Build 023 · Final Weite Editorial Composition Fix/g) ?? []).length;
if (authoritativeWeiteCount !== 1) {
  failures.push(`Expected exactly one authoritative final zone-separation grammar block, found ${authoritativeWeiteCount}`);
}

if (finalEditorialCompositionCount !== 1) {
  failures.push(`Expected exactly one final Weite editorial composition block, found ${finalEditorialCompositionCount}`);
}


if (!files.css.includes('.destination-preview.destination-hero-banner .destination-story .page-rule {\n  display: none;')) {
  failures.push('Weite must not render the legacy decorative horizontal page rule');
}

if (!files.css.includes('.destination-preview.destination-hero-banner .destination-title-intro-composition')) {
  failures.push('Weite must compose title and introduction inside the protected Title Zone');
}

if (!files.css.includes('border-left: 1px solid rgba(84, 113, 129, .38)')) {
  failures.push('Weite title/introduction composition must keep its functional vertical divider');
}

if (failures.length) {
  console.error('Destination Composition Consistency Gate: FAIL');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Destination Composition Consistency Gate: PASS');
console.log('Image Composition → Module Grammar → Inspector Ergonomics → Local Preference → Product DNA → Tests');
