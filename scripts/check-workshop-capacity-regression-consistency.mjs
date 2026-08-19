import fs from 'node:fs';

const read = (path) => fs.readFileSync(path, 'utf8');
const css = read('src/styles/travel-companion-workshop.css');
const app = read('src/App.svelte');
const dna = read('docs/PRODUCT-DNA.md');

const checks = [
  ['workshop no longer claims independent full page height', css.includes('height: auto;') && css.includes('flex: 0 1 auto;') && !/\.photography-workshop-preview\s*\{[\s\S]*?height:\s*100%/.test(css)],
  ['core workshop remains 2x2', css.includes('grid-template-columns: repeat(2, minmax(0, 1fr));')],
  ['secondary light weather bridge clears companion zone', css.includes('margin: 6px 0 0 72px;') && css.includes('grid-template-columns: auto minmax(0, 1fr);')],
  ['bridge stays secondary', app.includes('photography-workshop-bridge') && app.includes('Licht & Wetter')],
  ['global capacity inheritance documented', dna.includes('Neue Grammar erbt Capacity Protection') && dna.includes('real layout geometry')],
  ['existing overflow travel language remains available', app.includes('Diese Seite kann diesen Inhalt nicht mehr ruhig erzählen.')]
];

const failed = checks.filter(([, ok]) => !ok);
if (failed.length) {
  for (const [name] of failed) console.error(`FAIL: ${name}`);
  process.exit(1);
}
console.log('\x1b[32mWorkshop Capacity Protection Regression Gate: PASS\x1b[0m');
