import fs from 'node:fs';

const read = (path) => fs.readFileSync(path, 'utf8');
const fail = (message) => {
  console.error(`FAIL · Build 040 · ${message}`);
  process.exit(1);
};

const preview = read('src/lib/preview.ts');
const base = read('src/styles/base-shell.css');
const destination = read('src/styles/destination-foundation.css');
const worlds = read('src/styles/editorial-worlds.css');
const utility = read('src/styles/book-utility-pages.css');
const interests = read('src/styles/destination-interests.css');
const packageJson = JSON.parse(read('package.json'));
const tauri = JSON.parse(read('src-tauri/tauri.conf.json'));
const cargo = read('src-tauri/Cargo.toml');

for (const [label, token] of [
  ['logical width', 'PREVIEW_BASE_WIDTH = 420'],
  ['golden height', 'PREVIEW_GOLDEN_HEIGHT = 594'],
  ['exact A5 height formula', 'PREVIEW_BASE_HEIGHT = PREVIEW_BASE_WIDTH * 210 / 148'],
  ['A5 extension formula', 'PREVIEW_A5_EXTENSION = PREVIEW_BASE_HEIGHT - PREVIEW_GOLDEN_HEIGHT']
]) {
  if (!preview.includes(token)) fail(`missing ${label}: ${token}`);
}

const expectedHeight = 420 * 210 / 148;
const extension = expectedHeight - 594;
if (Math.abs((420 / expectedHeight) - (148 / 210)) > 1e-12) {
  fail('logical page ratio is not exact DIN A5');
}
if (!(extension > 1.94 && extension < 1.95)) fail('unexpected A5 extension');

for (const token of [
  '--studio-page-width: 420px;',
  '--studio-golden-height: 594px;',
  '--studio-a5-height: 595.945946px;',
  '--studio-a5-extension: 1.945946px;',
  'width: var(--studio-page-width);',
  'height: var(--studio-a5-height);',
  'padding: 58px 52px calc(42px + var(--studio-a5-extension));'
]) {
  if (!base.includes(token)) fail(`base page geometry invariant missing: ${token}`);
}

const anchored = [
  ['base companion', base, 'bottom: calc(51px + var(--studio-a5-extension));'],
  ['destination companion', destination, 'bottom: calc(51px + var(--studio-a5-extension));'],
  ['Baltic destination companion', worlds, 'bottom: calc(51px + var(--studio-a5-extension));'],
  ['notes companion', utility, 'bottom: calc(50px + var(--studio-a5-extension));'],
  ['interest footer', interests, 'bottom: calc(42px + var(--studio-a5-extension));'],
  ['interest companion', interests, 'bottom: calc(51px + var(--studio-a5-extension));']
];
for (const [label, source, token] of anchored) {
  if (!source.includes(token)) fail(`${label} no longer preserves its Golden Y position`);
}

for (const token of [
  '--binding-safe-left: 42.57px;',
  '--companion-safe-width: 78px;',
  '--companion-safe-height: 76px;'
]) {
  if (!destination.includes(token)) fail(`safe-zone invariant changed or missing: ${token}`);
}

for (const token of [
  'hiking-nature-interest-page {\n  padding-top: 40px;\n  padding-bottom: calc(42px + var(--studio-a5-extension));',
  'culture-history-interest-page {\n  padding-top: 40px;\n  padding-bottom: calc(42px + var(--studio-a5-extension));',
  'culinary-local-interest-page {\n  padding-top: 40px;\n  padding-bottom: calc(42px + var(--studio-a5-extension));'
]) {
  if (!interests.includes(token)) fail('Interest Page content-box preservation missing');
}

// Build 040 is geometry-only. It must not introduce print/render dependencies or Tauri print code.
for (const forbidden of ['playwright', 'pdf-lib', 'pdfjs-dist']) {
  if (packageJson.dependencies?.[forbidden] || packageJson.devDependencies?.[forbidden]) {
    fail(`forbidden print dependency introduced: ${forbidden}`);
  }
}
for (const source of [preview, base, destination, worlds, utility, interests]) {
  if (/window\.print\(|@media\s+print|createPDF|print_to_pdf|PrintToPdf/i.test(source)) {
    fail('Build 040 must contain no print implementation');
  }
}

if (packageJson.version !== '0.40.0-alpha.1') fail('package version is not 0.40.0-alpha.1');
if (tauri.version !== '0.40.0-alpha.1') fail('Tauri version is not 0.40.0-alpha.1');
if (!cargo.includes('version = "0.40.0-alpha.1"')) fail('Cargo version is not 0.40.0-alpha.1');

console.log('PASS · Build 040 · exact DIN A5 page geometry with preserved 420×594 Golden Composition, footer/companion anchors and safe zones.');
