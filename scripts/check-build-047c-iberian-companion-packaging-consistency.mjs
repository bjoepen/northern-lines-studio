import fs from 'node:fs';

function must(condition, message) {
  if (!condition) throw new Error(`Build 047C Iberian Companion Packaging gate failed: ${message}`);
}

const registry = fs.readFileSync('src/lib/companions/registry.ts', 'utf8');
const installScript = fs.readFileSync('scripts/install-macos-app.sh', 'utf8');
const sourceAsset = 'design-library/companions/iberian/companion.png';
const publicDuplicate = 'public/design-library/companions/iberian/companion.png';

must(fs.existsSync(sourceAsset), 'canonical Iberian lynx asset is missing from the Design Library');
must(!fs.existsSync(publicDuplicate), 'Iberian lynx must not be maintained as a duplicate public asset');
must(registry.includes("../../../design-library/companions/iberian/companion.png"), 'registry does not bind the canonical lynx asset through Vite');
must(registry.includes('new URL(') && registry.includes('import.meta.url'), 'lynx asset is not Vite-bundled');
must(registry.includes('assetPath: iberianLynxAssetPath'), 'Iberian lynx does not use the bundled asset URL');
must(registry.includes("id: 'iberian-lynx'"), 'Iberian lynx companion id is missing');
must(registry.includes("editorialWorldId: 'mediterranean'"), 'Iberian lynx is not assigned to Mediterranean');
must(registry.includes("status: 'active'"), 'Iberian lynx is not active');
must(installScript.includes('pnpm tauri build --bundles app'), 'macOS install flow no longer uses the canonical Tauri app build');
must(!installScript.includes('companions/iberian'), 'install script contains an ad-hoc Iberian asset copy');

console.log('Build 047C Iberian Companion Packaging Gate: PASS');
console.log('The canonical Iberian lynx asset is Vite-bundled for dev and packaged macOS builds without a duplicate public PNG.');
