# Studio PDF Proof Architecture

Status: PoC branch `poc/studio-a5-pdf-proof`  
Baseline: Golden Build 040 (`a14aca4`)

## 1. Current-State Audit

Studio already resolves the visible A5 page in Svelte/HTML/CSS. Golden Build 040 defines the page as `420 × 595.9459459459 u`, with the established `420 × 594 u` composition preserved and only the A5 extension added below it.

The abandoned PoC 001 path used:

```text
.a5-page -> @media print -> window.print() -> system print dialog
```

That path proved color-adjust usefulness, but it did not deterministically force a saved PDF to exact A5. It is rejected for this PoC.

## 2. Exact Versions

- Package version: `0.40.0-alpha.1`
- Tauri JS API: `@tauri-apps/api 2.11.1`
- Tauri CLI: `@tauri-apps/cli 2.11.4`
- Rust Tauri crate: `tauri 2.11.5`
- Wry: `0.55.1`
- Tao: `0.35.3`
- WebView2 COM bindings: `webview2-com 0.38.2`
- Svelte: `5.56.8`
- Vite: `6.4.3`
- Vitest: `3.2.7`

## 3. Platform Capabilities

Tauri/Wry exposes `WebviewWindow::print()`, but Tauri 2.11.5 documents it as a print dialog API supported only on macOS for Wry; `window.print()` works cross-platform but does not provide deterministic PDF page-size control.

Tauri also exposes `with_webview`, which gives platform handles. On macOS that handle is a `WKWebView` pointer; on Windows it exposes the WebView2 controller and environment.

Apple WebKit exposes `WKWebView.createPDF(configuration:)` with `WKPDFConfiguration.rect`. This creates PDF data from the current webview content rectangle. The PoC uses this as the macOS adapter.

Microsoft WebView2 exposes `PrintToPdf` / `PrintToPdfStream` and `CoreWebView2PrintSettings` with explicit page width, page height, margins, scale, backgrounds, and headers/footers. This is the credible Windows adapter behind the same Studio proof request.

## 4. Candidate Architectures

| Candidate | Deterministic A5 | Layout Authority | Cross-Platform Path | Runtime Cost | Decision |
|---|---:|---:|---:|---:|---|
| `window.print()` / system dialog | No | Studio DOM | Dialog varies | Low | Rejected |
| Native WebView adapters | Yes, per platform API | Studio resolved page | WKWebView + WebView2 | Low | Selected |
| Chromium/Playwright sidecar | Yes | Serialized resolved page | Shared engine | High | Rejected for first PoC |
| PDF library only | Metadata only | Cannot render HTML | Possible | Medium | Rejected |
| Publisher composition model | Possible | Re-composes page | Possible | High | Rejected |

## 5. Selected Minimal Architecture

```text
resolved .a5-page
-> temporary proof capture mode
-> StudioPdfProofRequest { pageId, physicalMedium: 'A5', outputPath }
-> Tauri command
-> native webview PDF adapter
-> MediaBox validation
```

The proof capture mode hides Studio chrome and places the already-resolved `.a5-page` at the webview origin with preview scaling neutralized. It does not rebuild layout, change `.nls`, or reinterpret semantic project data.

## 6. Failure Modes

- `PDF_PROOF_NO_PAGE`: no selected or ready Studio page.
- `PDF_PROOF_FONT_NOT_READY`: reserved for future native/font preflight; frontend currently waits on `document.fonts.ready`.
- `PDF_PROOF_ASSET_NOT_READY`: a page image failed to load before proof generation.
- `PDF_PROOF_RENDER_FAILED`: native webview PDF generation failed or timed out.
- `PDF_PROOF_WRITE_FAILED`: output path/write/read failed.
- `PDF_PROOF_PAGE_SIZE_INVALID`: generated PDF MediaBox is not exact A5 within numeric tolerance.

No fallback to A4 is allowed.

## 7. Test Strategy

Automated:

- TypeScript unit test verifies the proof command boundary.
- Rust tests compile the macOS WebKit adapter.
- Scoped consistency gate verifies Golden 040 geometry tokens, no system-print restoration, no schema change, no Playwright/pdf-lib dependency, platform-scoped native dependencies, and stable failure codes.
- Native command validates the produced PDF MediaBox.

Manual/real-world:

- Run `./scripts/install-macos-app.sh`.
- Open the Photography Workshop golden reference page.
- Use `PDF-Proof`, save a PDF, and inspect exact A5 size plus title/body line breaks, module geometry, Companion, footer, safe zones, Fjord colors, and fonts.

## 8. Publisher Reuse Assessment

Useful future Publisher modules/concepts:

- `validation/codes.py`, `validation/models.py`, `validation/validator.py`
- `assets/registry.py`, `assets/validation.py`
- `rendering/staging.py`, `rendering/assets.py`
- deterministic report contracts in `docs/contracts/VALIDATION-REPORT-CONTRACT-1.0.md`
- Affinity/preflight reporting concepts in `affinity/report.py`

Not reused for this PoC:

- `rendering/composition/*`
- `layouts/*`
- Publisher typography registry or content-fit heuristics
- Page Composition Model from Publisher ADRs

Future direction remains:

```text
.nls -> Studio resolves page -> Studio Resolved Page / Proof Contract
-> Publisher validation + staging + production renderer
```

Publisher must not re-decide Studio layout.

## 9. Migration / Cleanup Impact

No `.nls` schema change is introduced. No Golden 040 geometry, Companion, footer, safe-zone, typography, or Editorial World contract is changed.

The old system-print proof implementation is replaced rather than extended. `core:webview:allow-print`, `window.print()`, `@page`, and `@media print` are not part of the selected architecture.

## 10. Contract Statement

Studio contracts remain unchanged. Studio is the visual and geometric source of truth. The exporter only proves the already-resolved page.
