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

Studio remains the authority for page count, order and stable page IDs. The frontend uses `project.pageManifest` exactly as it exists in the current Studio project. It does not infer order from page type, role, route structure, destination kind or any fixed Travelbook length.

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
- the `.a5-page` resolved Studio page to exist;
- `document.fonts.ready` when available;
- all images inside the current `.a5-page` to complete or report `PDF_PROOF_ASSET_NOT_READY`.

No sleeps are used for synchronization.

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
- validation `status`;
- decoded `content_stream_hashes`.

The manifest contains no x/y layout values.

## Failure Semantics

Document Proof is atomic from the user-visible output perspective.

If any page render, page validation, assembly, write or final validation fails:

- the document proof returns failure;
- the final output path is not reported as success;
- temp output is removed;
- an existing target PDF is left untouched until final temp-output replacement;
- staging cleanup is attempted in the frontend `finally`.

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
