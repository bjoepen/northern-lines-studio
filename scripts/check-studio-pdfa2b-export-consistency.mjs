import fs from 'node:fs';

function read(path) {
  return fs.readFileSync(path, 'utf8');
}

function fail(message) {
  console.error(`FAIL · Studio PDF/A-2b export consistency · ${message}`);
  process.exit(1);
}

const app = read('src/App.svelte');
const proof = read('src/lib/pdf-proof.ts');
const proofTest = read('src/lib/pdf-proof.test.ts');
const rust = read('src-tauri/src/lib.rs');
const pdfa = read('src-tauri/src/pdfa.rs');
const cargo = read('src-tauri/Cargo.toml');
const adr = read('docs/adr/ADR-041-STUDIO-PDFA-2B-EXPORT.md');

if (!app.includes("createTravelbookPdf(profile: TravelbookExportProfile = 'standard')")) fail('Travelbook export orchestration must remain shared.');
if (!app.includes("profile === 'pdfa2b' ? 'document-pdfa2b' : 'document-standard'")) fail('Studio UI must route Standard/PDF-A document export through the shared Production Host.');
if (!app.includes("backgroundProofPocMode !== 'reference-pages'")) fail('Production Host must own full-document rendering.');
if (!app.includes("await assembleStudioDocumentPdfProof")) fail('PDF/A export must reuse accepted Document PDF assembly as its source.');
if (!app.includes("backgroundProofPocMode === 'document-pdfa2b'")) fail('PDF/A mode boundary is missing.');
if (!app.includes("backgroundProofPoc001BackgroundStandardOutputPath(backgroundProofPocFinalOutputPath)")) fail('PDF/A path must assemble a temporary Standard PDF before post-processing.');
if (!app.includes("sourcePath: standardOutputPath")) fail('PDF/A postprocessor must consume the assembled Standard PDF.');
if (!app.includes("await exportStudioPdfA2b")) fail('PDF/A export command is not wired from Studio.');
if (!app.includes("document.body.classList.add('pdf-proof-rendering')")) fail('accepted resolved-page capture mode must remain the source path.');
if (!app.includes("document.body.classList.remove('pdf-proof-rendering')")) fail('Studio proof/capture state restoration is missing.');
if (!app.includes('hasUnsavedChanges')) fail('Travelbook export must require saved edits.');

if (!proof.includes('StudioPdfA2bExportRequest')) fail('PDF/A TypeScript request contract missing.');
if (!proof.includes('StudioPdfA2bExportResult')) fail('PDF/A TypeScript result contract missing.');
if (!proof.includes("profile: 'PDF/A-2b'")) fail('PDF/A frontend profile must stay product-level.');
if (!proof.includes('export_studio_pdfa2b')) fail('PDF/A frontend invoke boundary missing.');
if (!proofTest.includes('standard PDF source boundary')) fail('PDF/A command boundary frontend test missing.');

if (!rust.includes('mod pdfa;')) fail('PDF/A postprocessor must live in an explicit Rust module.');
if (!rust.includes('fn export_studio_pdfa2b')) fail('PDF/A Tauri command missing.');
if (!rust.includes('pdfa::convert_to_pdfa2b(source_path, &temp_output)')) fail('PDF/A command must call bounded postprocessor.');
if (!rust.includes('fs::rename(&temp_output, output_path)')) fail('PDF/A command must atomically publish the validated candidate.');
if (!rust.includes('pdfa_export_failure_does_not_leave_final_or_candidate_output')) fail('PDF/A atomic failure regression test missing.');

if (!pdfa.includes('add_pdfa_xmp_metadata')) fail('XMP metadata operation missing.');
if (!pdfa.includes('<pdfaid:part>2</pdfaid:part>')) fail('PDF/A part identification missing.');
if (!pdfa.includes('<pdfaid:conformance>B</pdfaid:conformance>')) fail('PDF/A conformance identification missing.');
if (!pdfa.includes('add_deterministic_trailer_id')) fail('deterministic trailer /ID strategy missing.');
if (!pdfa.includes('Sha256::digest(source_bytes)')) fail('trailer /ID must derive from source SHA-256.');
if (!pdfa.includes('find_suitable_srgb_icc_profile')) fail('structural RGB ICC selection missing.');
if (!pdfa.includes('is_suitable_srgb_icc_stream')) fail('RGB ICC validation helper missing.');
if (!pdfa.includes('add_rgb_output_intent')) fail('OutputIntent operation missing.');
if (!pdfa.includes('normalize_interpolate_flags')) fail('/Interpolate normalization missing.');
if (!pdfa.includes('collect_pdfa_integrity')) fail('PDF/A integrity collection missing.');
if (!pdfa.includes('assert_pdfa_integrity_unchanged')) fail('PDF/A integrity comparison missing.');
if (!pdfa.includes('page_content_hashes')) fail('page-content integrity check missing.');
if (!pdfa.includes('image_stream_hashes')) fail('image-stream integrity check missing.');
if (!pdfa.includes('page_font_resources')) fail('font integrity check missing.');
if (!pdfa.includes('PDF_A_OUTPUT_INTENT_UNAVAILABLE')) fail('stable OutputIntent failure code missing.');
if (!pdfa.includes('PDF_A_INTEGRITY_FAILED')) fail('stable integrity failure code missing.');
if (!pdfa.includes('wrong_geometry_fails')) fail('wrong geometry regression test missing.');
if (!pdfa.includes('missing_suitable_profile_fails_truthfully')) fail('missing profile regression test missing.');

if (!cargo.includes('lopdf = { version = "0.44.0", default-features = false }')) fail('PDF/A must reuse the existing minimal lopdf dependency.');
for (const forbidden of ['playwright', 'puppeteer', 'pdf-lib', 'pdfjs-dist', 'jspdf', 'verapdf', 'veraPDF']) {
  if (cargo.includes(forbidden)) fail(`forbidden runtime dependency token: ${forbidden}`);
}
for (const forbidden of ['target_os = "windows"', 'WebView2', 'windows_pdf']) {
  if (pdfa.includes(forbidden) || proof.includes(forbidden)) fail(`forbidden Windows expansion token: ${forbidden}`);
}
for (const forbidden of ['.nlpackage', 'Publisher CLI']) {
  if (app.includes(forbidden) || proof.includes(forbidden) || pdfa.includes(forbidden)) fail(`forbidden handoff expansion token: ${forbidden}`);
}
if (!adr.includes('Studio resolved Travelbook')) fail('ADR-041 must keep Studio as source authority.');
if (!adr.includes('bounded PDF/A-2b structural post-processing')) fail('ADR-041 must document bounded post-processing.');
if (!adr.includes('Publisher remains outside this integration scope')) fail('ADR-041 must preserve Publisher boundary.');

console.log('PASS · Studio PDF/A-2b export consistency · Document PDF source reused · bounded postprocessor only · static gate does not claim ISO conformance.');
