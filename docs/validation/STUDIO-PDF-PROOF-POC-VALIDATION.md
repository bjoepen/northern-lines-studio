# Studio PDF Proof PoC Validation

## Completion Lifecycle Root Cause

The false failure was produced in `src-tauri/src/lib.rs` by the macOS PDF bridge at the synchronous `mpsc::Receiver::recv_timeout(Duration::from_secs(20))` wait inside the Tauri command. That timeout generated:

```text
PDF_PROOF_RENDER_FAILED: PDF-Proof-Erzeugung hat zu lange gedauert.
```

The timeout was waiting for the `WKWebView.createPDFWithConfiguration` completion handler to send its result back across the Rust channel. The frontend had no independent timeout; it awaited the Tauri command and then restored proof mode in `finally`.

The PDF could exist despite Studio reporting failure because the synchronous command blocked while waiting for a native callback that WebKit needed to deliver asynchronously. The Rust receiver could time out first, return `PDF_PROOF_RENDER_FAILED` through Tauri IPC, and let Studio show the error. Once that blocking wait ended, WebKit could still run the completion callback; in that late callback path, `NSData.writeToFile_atomically` wrote the PDF successfully, but the user-visible operation had already failed. The ignored channel send then had no effect on the frontend result.

This was therefore a Rust/native asynchronous lifecycle issue: a blocking watchdog wait interfered with the native completion acknowledgement and then raced it. It was not a layout, page-size, frontend state-restoration, or WebKit rendering architecture failure.

The correction keeps the proven native macOS renderer unchanged. The Tauri command is now async, and the watchdog channel wait runs through `tauri::async_runtime::spawn_blocking`, so the UI/WebKit thread remains free to deliver the native PDF completion callback. Before rendering, Studio removes any pre-existing target PDF so a stale file cannot satisfy validation. If the watchdog fires, the bridge checks whether this operation nevertheless produced a written PDF and runs the same A5 MediaBox validator. A valid newly written A5 PDF resolves as success; no file remains a genuine timeout; an invalid written PDF reports `PDF_PROOF_PAGE_SIZE_INVALID`; render and write failures returned by the native callback remain unchanged.

This fixes the lifecycle instead of masking it with a longer timeout: normal success now derives from the actual native callback result and required validation, the watchdog no longer blocks callback delivery, and a genuine hang with no proof file remains detectable.

## Lifecycle After Correction

```text
frontend PDF-Proof action
-> font and asset readiness
-> proof/capture class enabled
-> Tauri create_studio_pdf_proof invoke
-> stale target PDF removed
-> macOS WKWebView A5 PDF generation
-> Rust watchdog waits off the UI/WebKit thread
-> native callback writes PDF and sends result
-> Rust receives success and validates MediaBox
-> frontend success
-> proof/capture class removed
```

Late acknowledgement path:

```text
WKWebView callback writes PDF
-> Rust watchdog fires before channel result is observed
-> written PDF exists
-> MediaBox validation passes
-> Rust returns success
-> frontend success
-> proof/capture class removed
```

Genuine hang path:

```text
WKWebView callback never writes PDF
-> Rust watchdog fires
-> no newly written PDF exists
-> PDF_PROOF_RENDER_FAILED timeout
-> frontend error
-> proof/capture class removed
```

## macOS native PDF physical page-box investigation

Requested physical dimensions:

```text
148 × 210 mm
= 419.527559055 × 595.275590551 pt
```

Observed real-world native `WKWebView` PDF output before normalization:

```text
MediaBox = 419 × 595 pt
```

Observed validation failure:

```text
PDF_PROOF_PAGE_SIZE_INVALID:
PDF ist 419.000 × 595.000 pt statt A5 419.528 × 595.276 pt.
```

This was a physical page-box issue only. The rendered Studio page, composition, typography, Companion, footer and visual proof fidelity remained valid for the current proof purpose.

Conversion chain:

```text
Golden Build 040 Studio page
420 u × 595.9459459459 u
-> proof capture CSS
420 px × 595.9459459459 px
-> Rust A5 constants
419.527559055 pt × 595.275590551 pt
-> objc2_core_foundation::CGSize
CGFloat/f64 on macOS arm64, fractional values preserved
-> WKPDFConfiguration.rect
CGRect with fractional width/height
-> WebKit createPDFWithConfiguration
FloatRect receives fractional rect
-> WebKit PDF snapshot implementation
FloatRect is converted to IntRect before PDF page creation
-> Quartz/CoreGraphics PDF context
receives integer snapshot page size
-> PDF output
MediaBox 419 × 595 pt
```

Our bridge does not round or truncate the requested dimensions. `A5_WIDTH_PT` and `A5_HEIGHT_PT` are `f64`; `objc2-core-foundation` defines `CGFloat` as `f64` on 64-bit targets and `CGSize::new` stores fractional values. `WKPDFConfiguration.rect` is a `CGRect`. No `round`, `floor`, `ceil`, `i32`, `u32`, or `as` cast is present in the Studio A5 size path before WebKit.

Quantization occurs inside WebKit. Apple documents `createPDFWithConfiguration:completionHandler:` as an asynchronous PDF capture API whose configuration specifies the portion of the web view to capture. The `objc2-web-kit 0.3.2` generated binding documents `WKPDFConfiguration.rect` as a rect in web page coordinates. Current WebKit source converts that `CGRect` to `WebCore::FloatRect` in `WKWebView.mm`, then the PDF snapshot path converts the rect to `IntRect` before `pdfSnapshotAtSize`. The integer snapshot size is then used for `context.beginPage(FloatRect { { }, bitmapSize })`. Quartz itself can create a PDF graphics context with a caller-supplied `CGRect` media box, so the integer result is not a general PDF or CoreGraphics limitation.

Sources:

- Apple Developer Documentation: `WKWebView.createPDFWithConfiguration:completionHandler:` describes asynchronous PDF data generation from web view contents.
- Apple Quartz 2D Programming Guide, “Creating a PDF Graphics Context”: `CGPDFContextCreate` accepts a `CGRect` media box as the default page bounds, and page dictionaries can specify `kCGPDFContextMediaBox`.
- WebKit `WKWebView.mm`: `WKPDFConfiguration.rect` is converted to `WebCore::FloatRect` and passed to `_page->drawToPDF`.
- WebKit `WebPage.cpp`: the PDF snapshot path creates `IntRect { rect.value_or(...) }`, uses `IntSize bitmapSize`, and begins the PDF page from that integer size.
- `objc2-core-foundation 0.3.2`: `CGFloat` is `f64` on 64-bit targets; `CGSize` stores `CGFloat` width and height.

Corrective options considered:

- Native exact fix: rejected for the current `WKWebView.createPDFWithConfiguration` path. The public API exposes only the capture rect, and WebKit quantizes that rect to integer snapshot dimensions before page creation. No supported configuration was found that separately supplies a fractional PDF MediaBox while preserving the same rendered content.
- macOS native visual-proof contract: technically viable. It would intentionally accept `419 × 595 pt`, with physical deltas of about `-0.186 mm` width and `-0.097 mm` height. That is visually immaterial for editorial proof, but it is not mathematically exact DIN A5 and would contradict the current exact-A5 proof contract.
- Metadata-only PDF box normalization: selected. WebKit remains the renderer and the rendered content is not scaled, translated, reflowed, or recomposed. After WebKit writes the PDF, Studio rewrites only page-box metadata to exact A5 using structured PDF objects, then validates `/MediaBox` and `/CropBox`. If `/TrimBox` is present, it is normalized and validated as well.

Selected contract:

```text
native WKWebView render output
-> metadata-only page-box normalization
-> MediaBox = exact A5
-> CropBox = exact A5
-> TrimBox = exact A5 when present
-> validation
```

Risks:

- `lopdf` rewrites the PDF file structure while preserving page content objects. This is intentionally limited to page dictionary box entries, but real-world inspection must confirm Preview and downstream readers still render the visual proof identically.
- If future WebKit output uses inherited page boxes from parent page-tree nodes only, the normalizer still writes explicit page-level boxes, which is valid PDF behavior but should be kept under regression coverage.
- This remains a visual proof path, not production/prepress export. Box normalization satisfies physical page size metadata; it does not add bleed, crop marks, profiles, or prepress guarantees.

## Automated Gates

Run from repository root:

```bash
node scripts/check-studio-pdf-proof-poc-001-consistency.mjs
pnpm check
pnpm test
pnpm consistency
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
git diff --check
```

## Real-World macOS Evidence Required

```bash
./scripts/install-macos-app.sh
```

Then:

```text
open Golden reference page
-> PDF-Proof
-> choose output path
-> PDF exists
-> PDF MediaBox and CropBox are exact A5
-> PDF TrimBox is exact A5 if present
```

Visual checks:

- title position and line breaks;
- body line breaks;
- module and hero/image geometry;
- Companion and footer positions;
- page number;
- safe zones;
- Fjord quiet/accent colors;
- World fonts.

## Known Environment Limits

The Codex macOS shell can compile the macOS adapter and run Rust tests. It cannot prove the installed Tauri app workflow unless `./scripts/install-macos-app.sh` is executed in the real user environment.

The Windows WebView2 adapter is architecturally identified but not executed in this macOS environment.

## Definition of Done Status

The PoC is not merge-ready until the real-world macOS proof produces an exact A5 PDF and the visual checks pass.
