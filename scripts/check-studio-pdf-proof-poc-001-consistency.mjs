import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const fail = (m) => { console.error(`FAIL · Studio PDF Proof PoC · ${m}`); process.exit(1); };

const app = read('src/App.svelte');
const proof = read('src/lib/pdf-proof.ts');
const proofTest = read('src/lib/pdf-proof.test.ts');
const css = read('src/styles/pdf-proof.css');
const cargo = read('src-tauri/Cargo.toml');
const rust = read('src-tauri/src/lib.rs');
const pkg = JSON.parse(read('package.json'));
const capability = JSON.parse(read('src-tauri/capabilities/default.json'));

if (capability.permissions?.includes('core:webview:allow-print')) fail('abandoned system-print permission was restored.');
if (!capability.permissions?.includes('dialog:allow-save')) fail('save dialog permission missing.');
if (!app.includes('class="a5-page"')) fail('Studio page authority missing.');
if (!app.includes("document.body.classList.add('pdf-proof-rendering')")) fail('resolved Studio page is not isolated before PDF capture.');
if (!app.includes('document.fonts?.ready')) fail('font readiness wait missing.');
if (!app.includes('PDF_PROOF_ASSET_NOT_READY')) fail('asset readiness failure code missing.');
if (!app.includes("physicalMedium: 'A5'")) fail('frontend proof request must be A5.');

if (/\bwindow\b/.test(proofTest)) fail('Node-compatible proof test must not access window directly.');
if (!proofTest.includes('create_studio_pdf_proof')) fail('proof test must verify the native proof command boundary.');
if (!proof.includes('StudioPdfProofRequest')) fail('small proof request contract missing.');
if (!proof.includes("physicalMedium: 'A5'")) fail('proof request must constrain physical medium to A5.');
if (!proof.includes('create_studio_pdf_proof')) fail('proof invoke command missing.');

if (!css.includes('body.pdf-proof-rendering')) fail('resolved-page proof capture mode missing.');
if (!css.includes('height: 595.9459459459px')) fail('Build 040 proof capture geometry missing.');
if (!css.includes('transform: none !important')) fail('proof capture must remove preview scaling.');

if (!rust.includes('StudioPdfProofRequest')) fail('native proof request contract missing.');
if (!rust.includes('A5_WIDTH_PT')) fail('native A5 point validation missing.');
if (!rust.includes('validate_pdf_a5_media_box')) fail('PDF MediaBox validation missing.');
if (!rust.includes('WKPDFConfiguration')) fail('macOS WebKit PDF adapter missing.');
if (!rust.includes('WebView2')) fail('Windows WebView2 path assessment/stub missing.');
for (const code of [
  'PDF_PROOF_NO_PAGE',
  'PDF_PROOF_ASSET_NOT_READY',
  'PDF_PROOF_RENDER_FAILED',
  'PDF_PROOF_WRITE_FAILED',
  'PDF_PROOF_PAGE_SIZE_INVALID'
]) {
  if (!app.includes(code) && !rust.includes(code)) fail(`stable error code missing: ${code}`);
}

if (!cargo.includes('[target.\'cfg(target_os = "macos")\'.dependencies]')) fail('macOS adapter dependencies must be platform-scoped.');
if (!cargo.includes('[target.\'cfg(windows)\'.dependencies]')) fail('Windows adapter dependencies must be platform-scoped.');

const deps = JSON.stringify({...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {})});
for (const forbidden of ['playwright','puppeteer','pdf-lib','pdfjs-dist']) {
  if (deps.includes(forbidden)) fail(`forbidden renderer dependency: ${forbidden}`);
}
for (const forbidden of ['window.print', '@media print', '@page', 'shrink-to-fit', 'fit-to-page', 'scale-to-fit']) {
  if (proof.includes(forbidden)) fail(`forbidden proof implementation token: ${forbidden}`);
  if (css.includes(forbidden)) fail(`forbidden proof stylesheet token: ${forbidden}`);
  if (rust.includes(forbidden)) fail(`forbidden proof native token: ${forbidden}`);
}
for (const forbidden of ['transform: scale(', 'zoom:']) {
  if (css.includes(forbidden)) fail(`forbidden proof fit token: ${forbidden}`);
}

console.log('PASS · Studio PDF Proof PoC · native A5 proof contract · resolved Studio page authoritative · abandoned system print not restored.');
