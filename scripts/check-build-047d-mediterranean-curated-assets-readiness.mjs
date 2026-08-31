import fs from 'node:fs';

function must(condition, message) {
  if (!condition) throw new Error(`Build 047D Mediterranean Curated Assets readiness gate failed: ${message}`);
}

const worldAssets = fs.readFileSync('src/lib/world-assets.ts', 'utf8');
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

const present = requiredAssets.filter((path) => fs.existsSync(path));
const complete = present.length === requiredAssets.length;
const empty = present.length === 0;

must(contract.includes('No fake completeness. No borrowed World assets.'), 'curated asset contract is missing the no-fallback rule');
must(empty || complete, `partial Mediterranean asset delivery detected (${present.length}/${requiredAssets.length}); deliver all eight assets before registration`);

if (empty) {
  must(!worldAssets.includes("['mediterranean', mediterraneanAssets]"), 'Mediterranean manifest is registered before real assets exist');
  must(!worldAssets.includes('const mediterraneanAssets'), 'Mediterranean asset manifest exists before asset delivery');
  console.log('Build 047D Mediterranean Curated Assets Readiness Gate: PASS (CONTRACT READY / ASSETS PENDING)');
  console.log('No Mediterranean curated images are registered until the complete eight-file asset set exists.');
} else {
  must(worldAssets.includes('const mediterraneanAssets'), 'complete Mediterranean asset set exists but manifest is missing');
  must(worldAssets.includes("['mediterranean', mediterraneanAssets]"), 'complete Mediterranean asset set exists but registry entry is missing');
  for (const path of requiredAssets) {
    const runtimePath = path.replace(/^public/, '');
    must(worldAssets.includes(runtimePath), `manifest does not reference ${runtimePath}`);
  }
  console.log('Build 047D Mediterranean Curated Assets Readiness Gate: PASS (ASSETS COMPLETE / MANIFEST REGISTERED)');
}
