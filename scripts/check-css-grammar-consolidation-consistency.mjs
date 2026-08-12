import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const manifest = fs.readFileSync(path.join(root, 'src/styles.css'), 'utf8');
const expected = [
  'base-shell.css',
  'destination-editor.css',
  'destination-foundation.css',
  'destination-imagery.css',
  'destination-composition.css',
  'editorial-extensions.css',
];
for (const file of expected) {
  if (!manifest.includes(file)) throw new Error(`CSS grammar manifest misses ${file}`);
  if (!fs.existsSync(path.join(root, 'src/styles', file))) throw new Error(`Missing CSS module ${file}`);
}
const composition = fs.readFileSync(path.join(root, 'src/styles/destination-composition.css'), 'utf8');
const imagery = fs.readFileSync(path.join(root, 'src/styles/destination-imagery.css'), 'utf8');
const foundation = fs.readFileSync(path.join(root, 'src/styles/destination-foundation.css'), 'utf8');
if ((imagery.match(/\.destination-preview\.destination-hero-right\s*\{/g) ?? []).length !== 1) {
  throw new Error('Bild rechts must have one authoritative approved base proportion in destination-imagery.css.');
}
if ((composition.match(/\.destination-preview\.destination-hero-banner\s*\{/g) ?? []).length !== 1) {
  throw new Error('Weite must have one authoritative zone/grid rule in destination-composition.css.');
}
if (!composition.includes('--weites-title-gap: 16px')) throw new Error('Approved Weite title gap changed.');
if (!foundation.includes('--companion-safe-height: 76px')) throw new Error('Companion Safe Zone changed.');
const all = expected.map(f => fs.readFileSync(path.join(root,'src/styles',f),'utf8')).join('\n');
for (const forbidden of ['--weites-title-gap: 20px', '1.08fr) minmax(0, .92fr']) {
  if (all.includes(forbidden)) throw new Error(`Historical override residue remains: ${forbidden}`);
}
console.log('CSS & Grammar Consolidation Consistency Gate: \x1b[32mPASS\x1b[0m');
