import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');

const files = {
  model: readFileSync(resolve(root, 'src/lib/project.ts'), 'utf8'),
  rust: readFileSync(resolve(root, 'src-tauri/src/lib.rs'), 'utf8'),
  app: readFileSync(resolve(root, 'src/App.svelte'), 'utf8'),
  tests: readFileSync(resolve(root, 'src/lib/journey-planning/journey-planning.test.ts'), 'utf8')
};

const fields = [
  ['startDate', 'start_date'],
  ['endDate', 'end_date'],
  ['departurePlace', 'departure_place'],
  ['returnPlace', 'return_place'],
  ['transport', 'transport'],
  ['routeSummary', 'route_summary'],
  ['travelFocus', 'travel_focus']
];

const failures = [];

for (const [tsName, rustName] of fields) {
  if (!files.model.includes(tsName)) failures.push(`TypeScript model: ${tsName}`);
  if (!files.rust.includes(rustName)) failures.push(`Rust schema: ${rustName}`);
  if (!files.app.includes(tsName === 'travelFocus' ? 'planningTravelFocus' : `planning${tsName[0].toUpperCase()}${tsName.slice(1)}`)) {
    failures.push(`Studio planning UI: ${tsName}`);
  }
}

for (const token of [
  'BUILD_018_FORMAT_VERSION',
  'update_journey_planning',
  'journey-planning-card',
  'journey-planning-preview',
  'journeyDurationLabel'
]) {
  const combined = Object.values(files).join('\n');
  if (!combined.includes(token)) failures.push(`Integration token: ${token}`);
}

if (failures.length) {
  console.error('Journey Planning Consistency Gate: FAILED');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Journey Planning Consistency Gate: \x1b[32mPASS\x1b[0m');
console.log('Model → Rust → Migration → Command → Inspector → Preview → Tests');
