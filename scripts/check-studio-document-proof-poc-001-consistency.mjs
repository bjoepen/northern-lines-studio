import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const fail = (m) => { console.error(`FAIL · Studio Document Proof PoC 001 · ${m}`); process.exit(1); };

const app = read('src/App.svelte');
const proof = read('src/lib/pdf-proof.ts');
const proofTest = read('src/lib/pdf-proof.test.ts');
const workspace = read('src/lib/workspace.ts');
const workspaceTest = read('src/lib/workspace.test.ts');
const rust = read('src-tauri/src/lib.rs');
const css = read('src/styles/pdf-proof.css');
const utilityCss = read('src/styles/book-utility-pages.css');
const pkg = JSON.parse(read('package.json'));

if (!app.includes('createPdfProofForTravelbook')) fail('Travelbook proof UI action missing.');
if (!app.includes('studioDocumentProofPages(project)')) fail('Document proof must use the Studio document proof page helper.');
if (!app.includes('for (const [position, page] of pages.entries())')) fail('Document proof must render pages serially.');
if (!app.includes('await createStudioPdfProof')) fail('Document proof must reuse the accepted single-page renderer command.');
if (!app.includes('await waitForResolvedStudioPage(page.id,')) fail('Document proof must wait for each active page readiness.');
if (!app.includes('data-studio-page-id')) fail('Rendered page identity contract missing.');
if (!app.includes('currentRenderedStudioPage(pageId)')) fail('Readiness must verify the requested rendered page identity.');
if (!app.includes('waitForStudioDomCommit')) fail('Document proof must cross Svelte/browser commit boundary before capture.');
if (!app.includes('requestAnimationFrame')) fail('Document proof must wait for a browser layout frame without sleeps.');
if (!app.includes('in:fade={{ duration: studioPageFadeDurationMs(pdfProofStatus, isBackgroundProofPocHost) }}')) fail('Document proof capture must use the shared proof/hidden-host page fade policy.');
if (!app.includes('document.fonts?.ready')) fail('Document proof readiness must include font readiness.');
if (!app.includes("page.querySelectorAll<HTMLImageElement>('img')")) fail('Document proof readiness must check assets on the identified current page.');
if (!app.includes('runningPageAnimationCount')) fail('Document proof readiness must reject transitional page state.');
if (!app.includes('restoredDocumentProofPage')) fail('Document proof must restore the originally active page.');
if (!app.includes('cleanupStudioDocumentPdfProof')) fail('Document proof staging cleanup missing.');
if (!app.includes('hasUnsavedChanges')) fail('Document proof must not silently discard pending authoring state.');
for (const forbiddenSleep of ['setTimeout(', 'sleep(', 'magic 50', 'magic 100', 'magic 500']) {
  if (app.includes(forbiddenSleep)) fail(`forbidden arbitrary readiness synchronization: ${forbiddenSleep}`);
}

if (!proof.includes('StudioDocumentProofRequest')) fail('Document proof request contract missing.');
if (!proof.includes('StudioDocumentProofPage')) fail('Document proof page contract missing.');
if (!proof.includes('publicationOrderedPages')) fail('Document proof must use canonical Studio publication order.');
if (!proof.includes('evaluateRenderedStudioPageReadiness')) fail('Rendered page readiness helper missing.');
if (!proof.includes('studioPageFadeDurationMs')) fail('Shared page fade policy helper missing.');
if (!proof.includes('STUDIO_DOCUMENT_PROOF_CAPTURE_SEQUENCE')) fail('Document proof capture sequence contract missing.');
if (!proof.includes('prepare_studio_document_pdf_proof')) fail('Document proof staging command missing.');
if (!proof.includes('assemble_studio_document_pdf_proof')) fail('Document proof assembly command missing.');
if (!proof.includes('cleanup_studio_document_pdf_proof')) fail('Document proof cleanup command missing.');
if (!workspace.includes('publicationOrderedPages')) fail('Canonical Studio publication order helper missing.');
if (!workspace.includes('return groupPages(pages, routeStageIds).flatMap((section) => section.pages);')) fail('Publication order must share the Orientation/sidebar grouped order source.');
if (!proof.includes("padStart(4, '0')")) fail('Staged page filenames must be deterministic.');
if (!proofTest.includes('canonical Studio publication order')) fail('Document proof publication order regression test missing.');
if (!workspaceTest.includes('uses one publication sequence for Orientation and footer page numbers')) fail('Orientation/footer publication order regression test missing.');
if (!proofTest.includes('supports variable page counts')) fail('Variable page-count regression test missing.');
if (!proofTest.includes('restores the originally active Studio page')) fail('State restoration regression test missing.');
if (!proofTest.includes('rejects stale DOM identity')) fail('Stale DOM identity regression test missing.');
if (!proofTest.includes('rejects transitional page opacity')) fail('Transitional visual state regression test missing.');
if (!proofTest.includes('keeps normal page fade only outside proof capture and Hidden Host')) fail('Page fade policy regression test missing.');

if (!rust.includes('StudioDocumentProofManifest')) fail('Document proof manifest missing.');
if (!rust.includes('northern-lines.studio.document-proof.v1')) fail('Document proof manifest schema missing.');
if (!rust.includes('join("Library")') || !rust.includes('join("Caches")') || !rust.includes('document-proof-')) fail('Document proof staging must use user cache outside the repo.');
if (!rust.includes('assemble_validated_document_pdf')) fail('Document proof assembly function missing.');
if (!rust.includes('validate_document_pdf_output')) fail('Final document proof validation missing.');
if (!rust.includes('page_content_stream_hashes')) fail('Per-page content stream integrity missing.');
if (!rust.includes('validate_page_not_empty_capture')) fail('Empty-capture validation missing.');
if (!rust.includes('PDF_DOCUMENT_PROOF_EMPTY_CAPTURE')) fail('Empty-capture error code missing.');
if (!rust.includes('decoded_content_bytes')) fail('Manifest must record decoded content byte evidence.');
if (!rust.includes('source.renumber_objects_with(document.max_id + 1)')) fail('PDF object import must avoid object-id collisions.');
if (!rust.includes('page_object.set("Parent", pages_root_id)')) fail('Assembly must attach pages to a new Page Tree.');
if (!rust.includes('fs::rename(&temp_output, output_path)')) fail('Document proof must use temp output then final replace.');
if (!rust.includes('PDF_DOCUMENT_PROOF_NO_PAGES')) fail('Document no-pages error missing.');
if (!rust.includes('PDF_DOCUMENT_PROOF_PAGE_FAILED')) fail('Document page-failure error missing.');
if (!rust.includes('PDF_DOCUMENT_PROOF_ASSEMBLY_FAILED')) fail('Document assembly error missing.');
if (!rust.includes('PDF_DOCUMENT_PROOF_VALIDATION_FAILED')) fail('Document validation error missing.');
if (!rust.includes('PDF_DOCUMENT_PROOF_WRITE_FAILED')) fail('Document write error missing.');
if (!rust.includes('document_proof_assembles_one_page_document')) fail('One-page document proof regression test missing.');
if (!rust.includes('document_proof_preserves_multi_page_order_and_content_streams')) fail('Multi-page order/content regression test missing.');
if (!rust.includes('document_proof_supports_variable_page_count_without_fixed_assumption')) fail('Variable page-count Rust regression test missing.');
if (!rust.includes('document_proof_page_failure_fails_whole_document_without_final_output')) fail('Atomic failure regression test missing.');
if (!rust.includes('document_proof_rejects_empty_staged_capture_before_assembly')) fail('Empty staged capture regression test missing.');
if (!rust.includes('document_proof_manifest_matches_final_document')) fail('Manifest/final validation regression test missing.');
if (!css.includes('opacity: 1 !important;') || !css.includes('filter: none !important;')) fail('Proof capture CSS must prevent faded/filtered page-root capture.');
if (!utilityCss.includes('--notes-surface') || !utilityCss.includes('var(--notes-surface) 0')) fail('Notes writing surfaces must use proof-stable explicit light gradient stops.');
if (/\.notes-(?:lines|mini-lines|dot-grid)[\s\S]*?color-mix\([^;]*transparent/.test(utilityCss)) fail('Notes proof line/grid surfaces must not depend on transparent color-mix stops.');

const deps = JSON.stringify({...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {})});
for (const forbidden of ['playwright','puppeteer','pdf-lib','pdfjs-dist','jspdf','react-pdf']) {
  if (deps.includes(forbidden)) fail(`forbidden renderer dependency: ${forbidden}`);
}
for (const forbidden of ['window.print', '@media print', '@page', 'shrink-to-fit', 'fit-to-page', 'scale-to-fit', 'Publisher']) {
  if (app.includes(forbidden)) fail(`forbidden Document Proof app token: ${forbidden}`);
  if (proof.includes(forbidden)) fail(`forbidden Document Proof contract token: ${forbidden}`);
  if (rust.includes(forbidden)) fail(`forbidden Document Proof native token: ${forbidden}`);
}
for (const forbidden of ['windows_pdf', 'WebView2', 'target_os = "windows"']) {
  if (app.includes(forbidden)) fail(`forbidden Windows expansion in app: ${forbidden}`);
  if (proof.includes(forbidden)) fail(`forbidden Windows expansion in proof contract: ${forbidden}`);
}
for (const forbidden of ['transform: scale(', 'zoom:']) {
  if (css.includes(forbidden)) fail(`forbidden proof fit token: ${forbidden}`);
}

console.log('PASS · Studio Document Proof PoC 001 · serial pageManifest orchestration · accepted single-page renderer reused · no second renderer.');
