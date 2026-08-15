import fs from 'node:fs';

const interestCss = fs.readFileSync(new URL('../src/styles/destination-interests.css', import.meta.url), 'utf8');
const shellCss = fs.readFileSync(new URL('../src/styles/base-shell.css', import.meta.url), 'utf8');

const checks = [
  ['Interest add action is text-weighted, not full-width', /\.interest-entry-add\s*\{[\s\S]*?width:\s*auto;[\s\S]*?background:\s*transparent;/],
  ['Interest entry title uses calm UI typography', /\.interest-entry-authoring-row > button:first-child strong\s*\{[\s\S]*?font-family:\s*inherit;[\s\S]*?font-size:\s*9px;[\s\S]*?font-weight:\s*600;/],
  ['Remove action remains secondary', /\.interest-entry-remove\s*\{[\s\S]*?background:\s*transparent;[\s\S]*?font-size:\s*8px;[\s\S]*?opacity:\s*\.66;/],
  ['Companion facts align status labels and values', /\.companion-layout-facts\s*\{[\s\S]*?align-items:\s*baseline;[\s\S]*?font-size:\s*9px;/],
  ['Companion values use label-size bold status treatment', /\.companion-layout-facts strong\s*\{[\s\S]*?font-family:\s*inherit;[\s\S]*?font-size:\s*9px;[\s\S]*?font-weight:\s*700;/],
];

for (const [label, pattern] of checks) {
  const source = label.startsWith('Companion') ? shellCss : interestCss;
  if (!pattern.test(source)) {
    console.error(`Inspector UX Language Consistency Gate: FAIL — ${label}`);
    process.exit(1);
  }
}

console.log('Inspector UX Language Consistency Gate: \x1b[32mPASS\x1b[0m');
console.log('Travel Language → calm entry actions → secondary removal → aligned companion status values');
