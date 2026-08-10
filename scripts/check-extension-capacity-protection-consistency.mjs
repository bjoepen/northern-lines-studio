import fs from 'node:fs';

const capacity = fs.readFileSync('src/lib/layout/capacity.ts', 'utf8');
const app = fs.readFileSync('src/App.svelte', 'utf8');
const css = fs.readFileSync('src/styles.css', 'utf8');
const dna = fs.readFileSync('docs/PRODUCT-DNA.md', 'utf8');
const readme = fs.readFileSync('README.md', 'utf8');

const must = (condition, message) => { if (!condition) throw new Error(message); };
must(capacity.includes('destinationExtensionCapacityResult'), 'capacity result missing');
must(capacity.includes("if (score >= 22) return 'overflow'"), 'hard overflow threshold missing');
must(app.includes('Diese Seite kann diesen Inhalt nicht mehr ruhig erzählen.'), 'Travel Language overflow notice missing');
must(app.includes('destinationExtensionAlternativeLabels'), 'layout alternative guidance missing');
must(css.includes('.destination-capacity-stop'), 'preview capacity stop styling missing');
must(dna.includes('Eine Safe Zone ist eine Grenze, keine Empfehlung.'), 'Product DNA safe-zone rule missing');
must(readme.includes('source available, but not open source'), 'README source availability notice missing');
must(fs.existsSync('LICENSE.md'), 'LICENSE.md missing from repository root');
console.log('Extension Capacity Protection Consistency Gate: PASS');
