import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

export function readConsolidatedStyles(root) {
  const dir = resolve(root, 'src/styles');
  const manifest = readFileSync(resolve(root, 'src/styles.css'), 'utf8');
  const imports = [...manifest.matchAll(/@import\s+['"]\.\/styles\/([^'"]+)['"]/g)].map((m) => m[1]);
  if (!imports.length) return manifest;
  return imports.map((file) => readFileSync(resolve(dir, file), 'utf8')).join('\n');
}
