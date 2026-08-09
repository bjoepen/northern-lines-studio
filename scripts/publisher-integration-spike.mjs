import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';

const binary = process.env.NLS_PUBLISHER_BIN;
if (!binary) {
  console.log('Publisher Integration Spike: NOT RUN');
  console.log('Set NLS_PUBLISHER_BIN to a Northern Lines Publisher executable once the CLI contract is available.');
  process.exit(0);
}
if (!existsSync(binary)) {
  console.error(`Publisher Integration Spike: configured binary does not exist: ${binary}`);
  process.exit(1);
}

const started = process.hrtime.bigint();
const result = spawnSync(binary, ['--version'], { encoding: 'utf8', timeout: 10000 });
const elapsedMs = Number(process.hrtime.bigint() - started) / 1_000_000;

console.log(`Publisher binary: ${binary}`);
console.log(`Version roundtrip: ${elapsedMs.toFixed(2)} ms`);
if (result.error) {
  console.error(`Publisher Integration Spike: ERROR: ${result.error.message}`);
  process.exit(1);
}
if (result.status !== 0) {
  console.error(`Publisher Integration Spike: --version exited with ${result.status}.`);
  if (result.stderr?.trim()) console.error(result.stderr.trim());
  process.exit(result.status ?? 1);
}
console.log(result.stdout.trim() || '(no version output)');
console.log('Publisher Integration Spike: VERSION ROUNDTRIP PASS');
console.log('Note: render timing requires the final versioned Publisher render contract and is intentionally not invented here.');
