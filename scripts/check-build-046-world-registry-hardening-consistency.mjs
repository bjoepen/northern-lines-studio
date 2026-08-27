import fs from 'node:fs';

function must(condition, message) {
  if (!condition) throw new Error(`Build 046 World Registry Hardening gate failed: ${message}`);
}

const assets = fs.readFileSync('src/lib/world-assets.ts', 'utf8');
const heroes = fs.readFileSync('src/lib/curated-heroes.ts', 'utf8');
const welcome = fs.readFileSync('src/lib/curated-welcome.ts', 'utf8');
const closing = fs.readFileSync('src/lib/curated-closing.ts', 'utf8');
const accents = fs.readFileSync('src/lib/curated-accents.ts', 'utf8');
const companionLayouts = fs.readFileSync('src/lib/companions/layout.ts', 'utf8');

must(assets.includes('interface WorldAssetManifest'), 'WorldAssetManifest is missing');
must(assets.includes("['fjord', fjordAssets]") && assets.includes("['baltic', balticAssets]"), 'existing Worlds are not registered in the asset manifest');
must(heroes.includes('worldAssetManifestFor'), 'Curated heroes bypass the World asset registry');
must(welcome.includes('worldAssetManifestFor'), 'Welcome hero bypasses the World asset registry');
must(closing.includes('worldAssetManifestFor'), 'Closing hero bypasses the World asset registry');
must(!closing.includes("worldId === 'fjord'") && !closing.includes("worldId === 'baltic'"), 'Closing hero still branches on concrete World ids');
must(accents.includes('worldAssetManifestFor'), 'Curated accents bypass the World asset registry');
must(companionLayouts.includes('companionLayoutRegistry'), 'Companion layout registry is missing');
must(companionLayouts.includes('loadCompanionLayout'), 'Companion layout lookup is missing');
must(companionLayouts.includes('requireCompanionLayout'), 'Required companion layout lookup is missing');

console.log('Build 046 World Registry Hardening Gate: PASS');
console.log('Curated assets and companion layouts now have registry-owned extension points.');
