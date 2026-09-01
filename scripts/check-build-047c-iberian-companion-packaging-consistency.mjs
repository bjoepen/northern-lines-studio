import fs from 'node:fs';
import crypto from 'node:crypto';

function must(condition, message) {
  if (!condition) throw new Error(`Build 047C Iberian Companion Packaging gate failed: ${message}`);
}

function sha256(path) {
  return crypto.createHash('sha256').update(fs.readFileSync(path)).digest('hex');
}

const registry = fs.readFileSync('src/lib/companions/registry.ts', 'utf8');
const app = fs.readFileSync('src/App.svelte', 'utf8');
const installScript = fs.readFileSync('scripts/install-macos-app.sh', 'utf8');
const sourceAsset = 'design-library/companions/iberian/companion.png';
const publicAsset = 'public/design-library/companions/iberian/companion.png';

must(fs.existsSync(sourceAsset), 'canonical Iberian lynx asset is missing from the Design Library');
must(fs.existsSync(publicAsset), 'packaged Iberian lynx public asset is missing');
must(sha256(sourceAsset) === sha256(publicAsset), 'public Iberian lynx asset differs from the canonical Design Library source');
must(registry.includes("id: 'iberian-lynx'"), 'Iberian lynx companion id is missing');
must(registry.includes("editorialWorldId: 'mediterranean'"), 'Iberian lynx is not assigned to Mediterranean');
must(registry.includes("assetPath: 'design-library/companions/iberian/companion.png'"), 'Iberian lynx registry path is not canonical');
must(registry.includes("status: 'active'"), 'Iberian lynx is not active');
must(app.includes('src={`/${activeCompanion.assetPath}`}'), 'Studio renderer no longer uses the shared companion public-asset contract');
must(installScript.includes('pnpm tauri build --bundles app'), 'macOS install flow no longer uses the canonical Tauri app build');
must(!installScript.includes('companions/iberian'), 'install script contains an ad-hoc Iberian asset copy');

console.log('Build 047C Iberian Companion Packaging Gate: PASS');
console.log('The Iberian lynx keeps its canonical Design Library path and ships through the same public asset contract as existing active companions.');
