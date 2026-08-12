import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const files = {
  model: readFileSync(resolve(root, 'src/lib/project.ts'), 'utf8'),
  destination: readFileSync(resolve(root, 'src/lib/destinations/index.ts'), 'utf8'),
  rust: readFileSync(resolve(root, 'src-tauri/src/lib.rs'), 'utf8'),
  app: readFileSync(resolve(root, 'src/App.svelte'), 'utf8'),
  layouts: readFileSync(resolve(root, 'src/lib/layout/fjord.ts'), 'utf8'),
  tests: readFileSync(resolve(root, 'src/lib/destinations/destinations.test.ts'), 'utf8')
};

const failures = [];
const combined = Object.values(files).join('\n');

for (const token of [
  'Destination', 'destinations', 'destinationId', 'destination_id',
  'subtitle', 'introduction', 'journeyContext', 'journey_context',
  'reasons', 'highlights', 'practicalInfo', 'practical_info',
  'layoutVariant', 'layout_variant', 'update_destination_profile'
]) {
  if (!combined.includes(token)) failures.push(`Destination chain token: ${token}`);
}

for (const layout of ['destination-hero-banner', 'destination-hero-left', 'destination-hero-right']) {
  for (const [name, source] of Object.entries({ model: files.model, rust: files.rust, destination: files.destination, layouts: files.layouts })) {
    if (!source.includes(layout)) failures.push(`${name}: ${layout}`);
  }
}

for (const token of ['BUILD_019_FORMAT_VERSION', '0.8.0', 'syncDestinationDraft', 'saveDestinationProfile', 'destination-profile-card', 'destination-preview']) {
  if (!combined.includes(token)) failures.push(`Build 020 integration token: ${token}`);
}

for (const token of ['Ortsprofil', 'Seitenwirkung', 'Weite', 'Bild links', 'Bild rechts', 'Reise vor Ort']) {
  if (!files.app.includes(token) && !files.layouts.includes(token)) failures.push(`Travel Language token: ${token}`);
}

for (const forbidden of ['Destination Profile', 'Hero Banner', 'Image Left', 'Image Right']) {
  if (files.app.includes(forbidden)) failures.push(`Visible technical wording in App.svelte: ${forbidden}`);
}

if (!files.app.includes("selectedPage?.type !== 'destination'")) {
  failures.push('Destination inspector must keep technical architecture cards out of the primary travel workflow');
}

if (failures.length) {
  console.error('Destination Profile Consistency Gate: FAILED');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Destination Profile Consistency Gate: \x1b[32mPASS\x1b[0m');
console.log('Model → Rust → Migration → Command → Inspector → Preview → Layout Variants → Tests');
