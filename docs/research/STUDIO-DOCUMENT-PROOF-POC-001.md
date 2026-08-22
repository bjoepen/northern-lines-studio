# Studio Document Proof PoC 001

## Scope

PoC 001 extends the accepted macOS single-page PDF proof primitive to a serial multi-page visual proof.

```text
Studio project
-> current Studio pageManifest order
-> one resolved Studio page at a time
-> existing single-page A5 PDF proof command
-> staged validated page PDFs
-> PDF structure assembly
-> final document validation
```

Windows and Publisher are out of scope for this PoC.

## Page Order Authority

Studio remains the authority for page count, order and stable page IDs. The raw `project.pageManifest` is the project manifest, not the final publication sequence. Real-world validation proved that its insertion/storage order can differ from the visible book order.

The canonical Studio publication order is now named explicitly:

```text
publicationOrderedPages(pageManifest, routeStageIds)
```

It delegates to the same `groupPages()` sequence already used by:

- the visible page navigation;
- the Orientation page;
- footer/page-number calculation through `travelbookPageNumber()`.

Document Proof consumes `studioDocumentProofPages(project)`, which now delegates to `publicationOrderedPages(project.pageManifest, project.journey.stages.map(id))`. It does not hardcode a 16-page order and does not infer a separate export order from page types.

Binding invariant:

```text
Studio Orientation order
==
Studio footer/page-number order
==
Document Proof order
```

## Serial Orchestration

The frontend document proof action renders pages strictly serially:

```text
for each page in project.pageManifest
-> select page
-> wait for resolved page readiness
-> call create_studio_pdf_proof
-> store 0001.pdf, 0002.pdf, ...
```

There is no parallel rendering, no second WebView, no hidden Studio tree and no second HTML/PDF renderer.

## Readiness

Before each page render, Studio waits for:

- the requested page ID to be the active `selectedPage`;
- the rendered `.a5-page` to carry the same `data-studio-page-id`;
- the Svelte DOM update to be committed;
- one browser layout frame after that commit;
- `document.fonts.ready` when available;
- all images inside the identified current `.a5-page` to complete or report `PDF_PROOF_ASSET_NOT_READY`;
- the page root to be visually stable: visible, opacity `1`, no filter, no running page animation, and in proof mode no preview transform.

No sleeps are used for synchronization. The browser frame boundary is not a time delay; it gives WebKit one layout/paint boundary after Svelte has committed the selected page or proof-mode class change.

The first installed-app Travelbook proof exposed the missing identity contract. The document loop selected a new `selectedPage`, crossed one `tick()`, and then accepted any `.a5-page`. Because the page root used `in:fade={{ duration: 190 }}` and had no page identity attribute, readiness could see `selectedPage.id === requestedPageId` while the rendered page was still stale, not yet fully painted, or in a fade-in opacity state. Image readiness also queried generic `.a5-page img`, so stale page images could satisfy a later page.

The corrected sequence is:

```text
select requested page
-> await Svelte DOM commit
-> await browser layout frame
-> require selectedPage.id == requested page ID
-> require .a5-page[data-studio-page-id] == requested page ID
-> wait for fonts
-> check images only inside that identified page
-> require visual stability
-> enable proof mode
-> await Svelte DOM commit
-> await browser layout frame
-> repeat identity and stability checks under proof CSS
-> call existing single-page renderer
```

During `pdfProofStatus === 'rendering'`, the normal page `in:fade` duration is `0`. Proof CSS also forces the `.a5-page` root to `opacity: 1` and `filter: none`. This prevents WebKit from capturing a temporary fade opacity or page-root filter state; it does not alter World child styling, layout geometry, typography, content, Companion or footer.

## Notes/Memory Visual Fidelity

The newest real-world proof showed the Notes/Memory page with large dark writing areas. A single-page Notes proof reproduced the same defect as the Notes page inside the assembled Travelbook proof, so the assembler and page order were ruled out.

Root cause found in the Studio CSS path:

- Notes writing surfaces are `.notes-main`, `.notes-side > section`, `.notes-lines`, `.notes-mini-lines` and `.notes-dot-grid`;
- the large line/grid children used CSS gradients with `color-mix(..., transparent)` and transparent stops;
- this technique was not exercised by the accepted Photography Workshop proof;
- the proof CSS did not intentionally change these Notes surfaces, but the native WKWebView PDF path rendered those transparent mixed gradient surfaces incorrectly as dark/black areas.

The correction keeps the same Notes geometry and semantic World styling but makes the line/grid surfaces PDF-stable:

- each writing box defines `--notes-surface`;
- line and dot colors mix against that explicit light surface, not `transparent`;
- gradient gaps use `var(--notes-surface)`, not transparent;
- Baltic still uses its own amber/warm-paper variables;
- no global background override was added.

## Single-Page Renderer Reuse

Document Proof calls the existing `createStudioPdfProof()` frontend wrapper for each page. That wrapper invokes the accepted `create_studio_pdf_proof` Tauri command, which performs:

```text
native WKWebView PDF
-> metadata-only PageBox normalization
-> exact A5 validation
```

The Document Proof implementation does not duplicate or reinterpret the native render path.

## Staging

Rust prepares a per-operation cache directory:

```text
~/Library/Caches/Northern Lines Studio/document-proof-<pid>-<timestamp>/
```

Staged page files use deterministic names:

```text
0001.pdf
0002.pdf
0003.pdf
manifest.json
```

The staging directory is outside the source repository. The frontend calls cleanup in `finally`, after success or failure.

## Assembly Integrity

Only staged PDFs that already passed the single-page A5 proof validator may be assembled.

The assembler uses `lopdf`, the existing structured PDF library in this branch. It:

- loads each staged page PDF;
- requires each staged PDF to contain exactly one page;
- records file SHA-256 and decoded content stream hashes;
- renumbers source objects to avoid object ID collisions;
- copies source objects into a new PDF;
- attaches page objects to a new Page Tree in the supplied order;
- writes the final document to a temp output path;
- validates the final document before replacing the target path.

It does not render, scale, translate, crop, reflow, change fonts or rewrite content stream geometry.

## Manifest

The staging directory receives `manifest.json` with schema:

```text
northern-lines.studio.document-proof.v1
```

Each page entry records:

- `index`;
- `page_id`;
- `title`;
- staged PDF `sha256`;
- `width_pt`;
- `height_pt`;
- `validation_status`;
- `content_stream_count`;
- `decoded_content_bytes`;
- decoded `decoded_content_hashes`;
- `resource_count`.

The manifest contains no x/y layout values.

## Failure Semantics

Document Proof is atomic from the user-visible output perspective.

If any page render, page validation, assembly, write or final validation fails:

- the document proof returns failure;
- the final output path is not reported as success;
- temp output is removed;
- an existing target PDF is left untouched until final temp-output replacement;
- staging cleanup is attempted in the frontend `finally`.

If a page is not ready, the frontend fails the document proof with `PDF_DOCUMENT_PROOF_PAGE_NOT_READY`. If a staged single-page proof is structurally empty even though it has valid A5 page boxes, Rust fails before assembly with `PDF_DOCUMENT_PROOF_EMPTY_CAPTURE`.

## Final Validation

Before success, Rust verifies:

- final output exists;
- final PDF is readable;
- final page count equals manifest page count;
- every page validates exact A5;
- manifest page indexes are sequential;
- manifest page IDs are not duplicated;
- final decoded per-page content stream hashes match the staged page hashes in order.

## State Restoration

The frontend records the originally active page ID before export. In `finally`, it removes proof/capture mode and reselects the original page when it still exists in the current `pageManifest`.

## Publisher

Publisher is not involved in PoC 001. The current goal is to prove a Studio-owned visual document proof from already resolved Studio pages. Publisher validation/staging concepts may be revisited only after real-world Document Proof validation passes.
