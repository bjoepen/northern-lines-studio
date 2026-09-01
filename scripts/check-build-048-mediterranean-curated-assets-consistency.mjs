import fs from 'node:fs';

function must(condition, message) {
  if (!condition) throw new Error(`Build 048 Mediterranean Curated Assets gate failed: ${message}`);
}

const worldAssets = fs.readFileSync('src/lib/world-assets.ts', 'utf8');
const app = fs.readFileSync('src/App.svelte', 'utf8');
const contract = fs.readFileSync('docs/editorial-worlds/MITTELMEER-CURATED-ASSET-CONTRACT.md', 'utf8');

const requiredAssets = [
  'public/design-library/worlds/mediterranean/curated-heroes/photography.png',
  'public/design-library/worlds/mediterranean/curated-heroes/hiking-nature.png',
  'public/design-library/worlds/mediterranean/curated-heroes/culture-history.png',
  'public/design-library/worlds/mediterranean/curated-heroes/culinary-local.png',
  'public/design-library/worlds/mediterranean/curated-heroes/photography-workshop.png',
  'public/design-library/worlds/mediterranean/curated-heroes/welcome.png',
  'public/design-library/worlds/mediterranean/curated-heroes/closing.png',
  'public/design-library/worlds/mediterranean/curated-accents/notes.png'
];

const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

must(contract.includes('No fake completeness. No borrowed World assets.'), 'Mediterranean no-fallback contract is missing');
must(worldAssets.includes('const mediterraneanAssets: WorldAssetManifest'), 'Mediterranean manifest is missing');
must(worldAssets.includes("['mediterranean', mediterraneanAssets]"), 'Mediterranean manifest is not registered');

for (const path of requiredAssets) {
  must(fs.existsSync(path), `required asset is missing: ${path}`);
  const bytes = fs.readFileSync(path);
  must(bytes.length > pngSignature.length, `asset is empty: ${path}`);
  must(bytes.subarray(0, pngSignature.length).equals(pngSignature), `asset is not a PNG: ${path}`);
  const runtimePath = path.replace(/^public/, '');
  must(worldAssets.includes(runtimePath), `manifest does not reference ${runtimePath}`);
}

must(!app.includes("editorialWorld?.id === 'mediterranean'"), 'renderer contains a Mediterranean-specific branch');
must(!app.includes("editorialWorld.id === 'mediterranean'"), 'renderer contains a Mediterranean-specific branch');
must(!app.includes('mediterraneanAssets'), 'renderer imports Mediterranean asset implementation details');

console.log('Build 048 Mediterranean Curated Assets Gate: PASS');
console.log('8/8 Mediterranean curated assets are present, registered through the shared World Asset Manifest and rendered without a World-specific page branch.');
