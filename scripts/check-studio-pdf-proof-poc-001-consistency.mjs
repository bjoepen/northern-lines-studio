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
const studioPageAuthority =
  app.includes('class="a5-page"') ||
  (
    app.includes('class={`a5-page ${worldPageClass}`}') &&
    app.includes("$: worldPageClass = editorialWorld ? `${editorialWorld.id}-page` : '';")
  );

if (!studioPageAuthority) fail('Studio page authority missing.');
if (!app.includes("document.body.classList.add('pdf-proof-rendering')")) fail('resolved Studio page is not isolated before PDF capture.');
if (!app.includes("document.body.classList.remove('pdf-proof-rendering')")) fail('proof capture mode must be restored after completion.');
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
if (!rust.includes('async fn create_studio_pdf_proof')) fail('PDF proof command must not block native WebKit completion.');
if (!rust.includes('A5_WIDTH_PT')) fail('native A5 point validation missing.');
if (!rust.includes('normalize_pdf_a5_page_boxes')) fail('exact A5 PDF page-box normalization missing.');
if (!rust.includes('validate_pdf_a5_page_boxes')) fail('PDF page-box validation missing.');
if (!rust.includes('CropBox')) fail('PDF CropBox validation/normalization missing.');
if (!rust.includes('exact_a5_pdf_box_preserving_top_left')) fail('PDF page-box normalization must preserve the native top-left anchor.');
if (!rust.includes('source.y_max - A5_HEIGHT_PT')) fail('PDF page-box height extension must be added below the native top edge.');
if (!rust.includes('source.x_min + A5_WIDTH_PT')) fail('PDF page-box width extension must be added to the right of the native left edge.');
if (!rust.includes('WKPDFConfiguration')) fail('macOS WebKit PDF adapter missing.');
if (!rust.includes('WebView2')) fail('Windows WebView2 path assessment/stub missing.');
if (!rust.includes('prepare_pdf_proof_output')) fail('proof output must not validate a stale pre-existing PDF after timeout.');
if (!rust.includes('resolve_pdf_proof_completion')) fail('proof completion must resolve native result/watchdog outcome explicitly.');
if (!rust.includes('tauri::async_runtime::spawn_blocking')) fail('watchdog wait must not block the UI/WebKit thread.');
if (!rust.includes('pdf_proof_timeout_is_success_when_written_pdf_validates')) fail('false-timeout regression test missing.');
if (!rust.includes('pdf_proof_genuine_hang_reports_timeout')) fail('genuine hang timeout regression test missing.');
if (!rust.includes('pdf_proof_normalizes_webkit_integer_page_boxes_to_exact_a5_metadata')) fail('WebKit integer page-box normalization regression test missing.');
if (!rust.includes('pdf_proof_normalization_preserves_top_left_anchor_and_extends_right_bottom')) fail('top-left page-box anchor regression test missing.');
if (!rust.includes('pdf_proof_normalization_does_not_change_page_content_streams')) fail('content-stream integrity regression test missing.');
if (!rust.includes('pdf_proof_wrong_top_left_anchor_is_detectable')) fail('wrong-anchor negative regression test missing.');
if (!rust.includes('pdf_proof_rejects_a4_page_box')) fail('A4 page-box rejection regression test missing.');
if (!rust.includes('content_stream_evidence')) fail('content-stream count/length/hash evidence missing.');
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
if (!cargo.includes('lopdf = { version = "0.44.0", default-features = false }')) fail('PDF metadata dependency must remain explicit and minimal.');

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
