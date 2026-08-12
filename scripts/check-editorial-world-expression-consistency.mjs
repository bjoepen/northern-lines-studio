import fs from 'node:fs';
const read = (p) => fs.readFileSync(p, 'utf8');
const css = read('src/styles/editorial-worlds.css');
const baseCss = read('src/styles/base-shell.css');
const extensionCss = read('src/styles/editorial-extensions.css');
const companion = read('src/lib/companions/registry.ts');
const asset = 'public/design-library/companions/baltic/companion.png';
const required = [
  [fs.existsSync(asset) && fs.statSync(asset).size > 0, 'public Fischotter asset'],
  [companion.includes("assetPath: 'design-library/companions/baltic/companion.png'"), 'Fischotter registry path'],
  [css.includes('--baltic-deep: #0d3b5b') && css.includes('--baltic-steel: #457b8d'), 'Ostsee core palette'],
  [css.includes('.extension-souvenir .editorial-signet') && css.includes('var(--baltic-amber)'), 'Amber souvenir expression'],
  [css.includes('.destination-extension-zone.extension-knowledge { --extension-strength: 42%; }'), 'distinct Wissen surface'],
  [css.includes('.destination-modules-preview .destination-practical-preview') && css.includes('var(--baltic-sand)'), 'Sand practical-info expression'],
  [css.includes('.a5-page.baltic-page.destination-page .companion-zone-bottom-left'), 'world-specific companion expression without changing safe-zone ownership'],
  [baseCss.includes('.a5-page.fjord-page') && baseCss.includes('background: #ffffff;'), 'neutral-white page surface independent of Editorial World'],
  [extensionCss.includes('color-mix(in srgb, var(--world-accent) var(--extension-strength), var(--world-paper))'), 'World expression remains on editorial extension surfaces']
];
const failed = required.filter(([ok]) => !ok);
if (failed.length) {
  for (const [, label] of failed) console.error(`Editorial World Expression: \x1b[31mFAIL\x1b[0m · ${label}`);
  process.exit(1);
}
console.log('Editorial World Expression Consistency Gate: \x1b[32mPASS\x1b[0m');
