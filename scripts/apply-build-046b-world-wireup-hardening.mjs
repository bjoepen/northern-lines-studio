import fs from 'node:fs';

const appPath = 'src/App.svelte';
const packagePath = 'package.json';

let app = fs.readFileSync(appPath, 'utf8');
const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

function replaceOnce(source, before, after, label) {
  if (source.includes(after)) return source;
  const occurrences = source.split(before).length - 1;
  if (occurrences !== 1) {
    throw new Error(`Build 046B apply failed: ${label} anchor count=${occurrences}`);
  }
  return source.replace(before, after);
}

app = replaceOnce(
  app,
  "import { companionVisibleForRole, fjordCompanionLayout, balticCompanionLayout } from './lib/companions/layout';",
  "import { companionVisibleForRole, requireCompanionLayout } from './lib/companions/layout';",
  'Companion layout import'
);

app = replaceOnce(
  app,
  "  $: activeCompanionLayout = editorialWorld?.id === 'baltic' ? balticCompanionLayout : fjordCompanionLayout;",
  "  $: activeCompanionLayout = editorialLayout ? requireCompanionLayout(editorialLayout.companionLayoutId) : null;",
  'Companion layout resolution'
);

app = replaceOnce(
  app,
  "    && companionVisibleForRole(activeCompanionLayout, selectedPage?.role);",
  "    && Boolean(activeCompanionLayout)\n    && companionVisibleForRole(activeCompanionLayout, selectedPage?.role);",
  'Companion visibility guard'
);

const worldClassAnchor = "  $: activeCompanion = editorialWorld ? requireCompanion(editorialWorld.companionId) : null;";
if (!app.includes("$: worldPageClass = editorialWorld ? `${editorialWorld.id}-page` : '';")) {
  if (!app.includes(worldClassAnchor)) throw new Error('Build 046B apply failed: World class anchor missing');
  app = app.replace(
    worldClassAnchor,
    `${worldClassAnchor}\n  $: worldPageClass = editorialWorld ? \`${'${editorialWorld.id}'}-page\` : '';`
  );
}

app = replaceOnce(
  app,
  '              class="a5-page"',
  '              class={`a5-page ${worldPageClass}`}',
  'A5 page class'
);

app = app.replace("              class:fjord-page={editorialWorld?.id === 'fjord'}\n", '');
app = app.replace("              class:baltic-page={editorialWorld?.id === 'baltic'}\n", '');

const gate = 'node scripts/check-build-046b-world-wireup-hardening-consistency.mjs';
if (!pkg.scripts.consistency.includes('check-build-046b-world-wireup-hardening-consistency.mjs')) {
  pkg.scripts.consistency = `${pkg.scripts.consistency} && ${gate}`;
}
pkg.scripts['consistency:build-046b'] = gate;

fs.writeFileSync(appPath, app);
fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2) + '\n');

console.log('Build 046B apply: PASS');
console.log('World page class and Companion layout resolution are now registry-driven.');
