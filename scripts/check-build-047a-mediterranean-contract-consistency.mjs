import fs from 'node:fs';

function read(path) {
  return fs.readFileSync(path, 'utf8');
}

function must(condition, message) {
  if (!condition) throw new Error(`Build 047A Mediterranean Contract gate failed: ${message}`);
}

const worlds = read('src/lib/worlds/index.ts');
const mediterraneanWorld = read('src/lib/worlds/mediterranean/world.ts');
const layouts = read('src/lib/layout/index.ts');
const mediterraneanLayout = read('src/lib/layout/mediterranean.ts');
const companionRegistry = read('src/lib/companions/registry.ts');
const companionLayouts = read('src/lib/companions/layout.ts');
const companionMetadata = JSON.parse(read('design-library/companions/iberian/metadata.json'));
const app = read('src/App.svelte');
const native = read('src-tauri/src/lib.rs');

must(mediterraneanWorld.includes("id: 'mediterranean'"), 'Mediterranean World id missing');
must(mediterraneanWorld.includes("companionId: 'iberian-lynx'"), 'Mediterranean World is not bound to Iberian lynx');
must(mediterraneanWorld.includes("layoutSystemId: 'mediterranean-layout'"), 'Mediterranean layout id missing');
must(worlds.includes('[mediterraneanWorld.id, mediterraneanWorld]'), 'Mediterranean World is not registered');

must(mediterraneanLayout.includes("worldId: 'mediterranean'"), 'Mediterranean layout world binding missing');
must(mediterraneanLayout.includes("companionLayoutId: 'mediterranean-companion-layout'"), 'Mediterranean companion layout binding missing');
must(['destination-hero-banner', 'destination-hero-left', 'destination-hero-right'].every((id) => mediterraneanLayout.includes(`id: '${id}'`)), 'shared destination layout vocabulary is incomplete');
must(layouts.includes('[mediterraneanLayoutSystem.worldId, mediterraneanLayoutSystem]'), 'Mediterranean layout is not registered');

must(companionRegistry.includes("id: 'iberian-lynx'"), 'Iberian lynx companion missing');
must(companionRegistry.includes("editorialWorldId: 'mediterranean'"), 'Iberian lynx is not assigned to Mediterranean');
must(companionRegistry.includes("status: 'active'"), 'Companion registry has no active state');
must(companionMetadata.id === 'iberian-lynx', 'Iberian lynx metadata id changed');
must(companionMetadata.world === 'mediterranean', 'Iberian lynx metadata world mismatch');
must(companionMetadata.status === 'active', 'Iberian lynx metadata is not active');
must(companionLayouts.includes("['mediterranean-companion-layout', mediterraneanCompanionLayout]"), 'Mediterranean companion layout is not registered');

must(native.includes('const MEDITERRANEAN_WORLD_ID: &str = "mediterranean";'), 'native project API does not know the Mediterranean World id');
must(native.includes('id == REFERENCE_WORLD_ID || id == BALTIC_WORLD_ID || id == MEDITERRANEAN_WORLD_ID'), 'native project API does not accept Mediterranean for create/open/update');
must(native.includes('fn supports_mediterranean_world_and_persists_world_switch()'), 'native Mediterranean persistence regression test is missing');

must(app.includes("$: worldPageClass = editorialWorld ? `${editorialWorld.id}-page` : '';"), 'generic World page class derivation was lost');
must(!app.includes("editorialWorld?.id === 'mediterranean'"), 'Mediterranean-specific renderer branch introduced');
must(!app.includes("if (worldId === 'mediterranean')"), 'Mediterranean-specific renderer branch introduced');

console.log('Build 047A Mediterranean Contract Gate: PASS');
console.log('Mediterranean is registered through World, layout, Companion and native persistence contracts without a renderer branch.');
