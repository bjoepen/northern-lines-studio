import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const app = readFileSync(resolve(root, 'src/App.svelte'), 'utf8');
const rust = readFileSync(resolve(root, 'src-tauri/src/lib.rs'), 'utf8');
const validation = readFileSync(resolve(root, 'docs/validation/BUILD-022-VALIDATION.md'), 'utf8');
const failures = [];

const openTravelStart = app.indexOf('async function openTravelNow()');
const openTravelEnd = app.indexOf('function requestOpenTravel()', openTravelStart);
const openTravel = app.slice(openTravelStart, openTravelEnd);

for (const token of [
  "extensions: ['nls']",
  "await openTravelPath(selected)",
  "listen<string>('open-nls'",
  'requestOpenTravelPath(event.payload)',
  "invoke<StudioProject>('load_nls_project', { path })"
]) {
  if (!app.includes(token)) failures.push(`Open-flow token missing: ${token}`);
}

if (openTravel.includes('directory: true')) {
  failures.push('Internal Reise öffnen must not use a directory picker for the .nls macOS package');
}
if (!openTravel.includes("name: 'Northern Lines Reise'")) {
  failures.push('Internal Reise öffnen must present the .nls travel as a Northern Lines document');
}
if (!rust.includes('fn load_nls_project(path: String)')) {
  failures.push('Shared load_nls_project command must remain present');
}
if (!rust.includes('let project = read_project(project_path)?;')) {
  failures.push('load_nls_project must continue through read/migrate/validate');
}
for (const required of [
  'Studio geschlossen → `.nls` im Finder doppelklicken',
  'Studio geöffnet → `.nls` im Finder doppelklicken',
  'Studio geöffnet → Reise innerhalb von Studio öffnen',
  'Build-019-Datei',
  'Build-020-Datei',
  'Hero-Referenzen'
]) {
  if (!validation.includes(required)) failures.push(`Validation case missing: ${required}`);
}

if (failures.length) {
  console.error('Travel Opening Consistency Gate: FAILED');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Travel Opening Consistency Gate: PASS');
console.log('Studio Dialog → .nls Package Path → Shared Load Command ← Finder Open → Session → Frontend State → Page Selection');
