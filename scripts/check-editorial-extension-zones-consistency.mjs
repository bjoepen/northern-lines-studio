import { readConsolidatedStyles } from './read-consolidated-styles.mjs';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const mustContain = (source, token, message) => {
  if (!source.includes(token)) throw new Error(message);
};
const mustNotContain = (source, token, message) => {
  if (source.includes(token)) throw new Error(message);
};

const project = read('src/lib/project.ts');
const app = read('src/App.svelte');
const css = readConsolidatedStyles(root);
const rust = read('src-tauri/src/lib.rs');
const productDna = read('docs/PRODUCT-DNA.md');
const extensionLib = read('src/lib/editorial-extensions/index.ts');
const packageJson = JSON.parse(read('package.json'));

for (const kind of ['knowledge', 'photo_spot', 'tip', 'souvenir', 'important', 'history']) {
  mustContain(project, `'${kind}'`, `Missing extension kind in project model: ${kind}`);
  mustContain(extensionLib, `kind: '${kind}'`, `Missing extension definition: ${kind}`);
  mustContain(rust, `\"${kind}\"`, `Rust validation does not know extension kind: ${kind}`);
}

mustContain(project, 'editorialExtensions: DestinationEditorialExtension[]', 'Destination model must persist editorial extensions.');
mustContain(rust, 'const BUILD_025_FORMAT_VERSION: &str = "0.10.0"', 'Build 024 compatibility must keep .nls 0.10.0 migration support.');
mustContain(rust, 'const BUILD_023_FORMAT_VERSION: &str = "0.9.0"', 'Build 023 migration source must stay explicit.');
mustContain(rust, 'editorial_extensions: Vec<DestinationEditorialExtension>', 'Rust destination model must persist editorial extensions.');
mustContain(app, 'Besondere Hinweise', 'Travel-language extension authoring is missing.');
mustContain(app, 'destination-extension-zones', 'Preview extension zones are missing.');
mustContain(css, 'border: 0;', 'Extension surfaces must remain frameless.');
mustContain(css, 'color-mix(in srgb, var(--world-accent)', 'Extension surfaces must derive from the Editorial World palette.');
mustContain(productDna, 'Das Signet sagt, was es ist. Die Farbe sagt, zu welcher Welt es gehört.', 'Product DNA must contain the approved semantic signet rule.');
mustContain(productDna, 'Der Companion nimmt nicht am Layout teil. Das Layout nimmt Rücksicht auf den Companion.', 'Companion invariant must remain explicit.');
mustNotContain(css, '.destination-extension-zone {\n  border: 1px', 'Extension preview zones must not become framed cards.');

for (const signet of ['knowledge', 'photo-spot', 'tip', 'souvenir', 'important', 'history']) {
  const file = path.join(root, 'public/design-library/signets/shared', `${signet}.svg`);
  if (!fs.existsSync(file)) throw new Error(`Missing shared semantic signet: ${signet}`);
}

if (!String(packageJson.scripts?.consistency ?? '').includes('check-editorial-extension-zones-consistency.mjs')) {
  throw new Error('Editorial Extension Zones gate is not wired into pnpm consistency.');
}

console.log('Editorial Extension Zones Consistency Gate: \x1b[32mPASS\x1b[0m');
