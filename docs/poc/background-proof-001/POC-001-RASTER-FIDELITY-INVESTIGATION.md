# Background Proof PoC 001 - Raster Fidelity Investigation

Status: INCONCLUSIVE - awaiting raster fidelity runtime validation
Date: 2026-08-23

## Scope

This investigation covers the raster fidelity difference between the accepted
visible Development PDF path and the Hidden Background Standard PDF path.

Unchanged:

```text
createStudioPdfProof()
create_studio_pdf_proof
native WKWebView createPDF
A5 PageBox normalization
A5 validation
Document Assembly
PDF/A-2b postprocessor
Golden Build 040
.nls schema
```

## Versions

Repository-resolved versions:

```text
@tauri-apps/api       2.11.1
@tauri-apps/cli       2.11.4
tauri                 2.11.5
tauri-runtime-wry     2.11.4
wry                   0.55.1
```

Installed API/source facts used:

- `WebviewWindow` `width` and `height` are initial logical window pixels.
- Tauri window APIs expose physical `innerSize()` and `scaleFactor()`, but the
  current PoC does not call them in the Hidden Host to avoid widening its ACL.
- The current native macOS proof path sets the same `WKPDFConfiguration.rect`
  to A5 for both visible and hidden callers.
- The command receives the actually invoking `tauri::WebviewWindow`.

## PDF Roles

The files were identified by path relationship, page count, size and image
structure, not by filename alone.

| Role | Path | SHA-256 | Pages | Size | Evidence |
| --- | --- | --- | ---: | ---: | --- |
| A. Development PDF | `/Users/bernd/Documents/Norwegen 2027-Travelbook.pdf` | `ea2506338dd2d17e172e3067f8faf8e5af20c977dcabfc1a3bdee7d7f9489394` | 16 | 48,289,621 bytes | Large source raster objects; reference output from visible `Entwicklungs-PDF` path. |
| B. Background Standard PDF | `/Users/bernd/Documents/Norwegen 2027-background-standard.pdf` | `1715efcfd7c764dac3d3bda105308fb46a4caa1de4192096b45fa258ebed437d` | 16 | 2,296,465 bytes | Deterministic sidecar path for final `/Users/bernd/Documents/Norwegen 2027.pdf`. |
| C. Final Background PDF/A-2b | `/Users/bernd/Documents/Norwegen 2027.pdf` | `f393ae044e537b98595548cc786da8cd74f671be6f9f174229838c7cbb8d12c6` | 16 | 2,297,481 bytes | Same raster dimensions as Background Standard; metadata stream present; `/Interpolate` normalized to `no`. |

## Structural Comparison

Development PDF and Background Standard PDF:

```text
page count     16 vs 16
page size      419.528 x 595.276 pt vs 419.528 x 595.276 pt
MediaBox       0.00 -0.28 419.53 595.00 vs same
CropBox        same
TrimBox        same
fonts          same embedded font set according to pdffonts
```

Therefore the observed fidelity difference is not a PageBox, page-count or font
embedding difference.

## Raster Evidence

Selected corresponding image objects from `pdfimages -list`.

| Visible asset class | Page / object | Development dimensions | Development effective PPI | Background dimensions | Background effective PPI | Final PDF/A dimensions | Final PDF/A Interpolate |
| --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| Companion | p4 obj 144 | 1536 x 1024 | 1907 x 1915 | 116 x 77 | 144 x 144 | 116 x 77 | no |
| Destination / hero image | p5 obj 172 | 2073 x 758 | 463 x 463 | 645 x 236 | 144 x 144 | 645 x 236 | no |
| Interest / workshop-style image | p6 obj 222 | 1672 x 941 | 1120 x 1120 | 215 x 121 | 144 x 144 | 215 x 121 | no |
| Portrait interest image | p9 obj 339 | 1023 x 1537 | 630 x 631 | 233 x 351 | 143 x 144 | 233 x 351 | no |
| Notes / Memory accent | p15 obj 609 | 420 x 280 | 291 x 292 | 420 x 280 | 325 x 325 | 420 x 280 | no |
| Companion on Notes / Memory page | p15 obj 606 | 1536 x 1024 | 1907 x 1915 | 116 x 77 | 144 x 144 | 116 x 77 | no |

The final PDF/A-2b file preserves the Background Standard raster dimensions.
Its expected PDF/A postprocess change is `/Interpolate yes` to `/Interpolate no`;
it does not explain the initial downsampling.

## Host / Render Contract Impact

| Field | Producer | Consumer | Current value before fix | Impact |
| --- | --- | --- | --- | --- |
| Canonical pages | `studioDocumentProofPages(project)` | Hidden Host loop | 16 pages | Unchanged. |
| Single-page proof command | Hidden Host and visible Main | `create_studio_pdf_proof` | Same request shape | Unchanged. |
| PDF capture rect | Rust `platform_pdf` | WKWebView `createPDF` | exact A5 rect | Unchanged. |
| Hidden logical window size | Main `new WebviewWindow(...)` | Wry/Tauri window creation | 420 x 596 | Downsampled raster resources to the small hidden viewport. |
| Visible Main logical window size | Tauri config/user window | visible Development PDF path | main editor viewport, typically much wider than 420 | Produced high-resolution raster objects. |
| Device pixel ratio | Browser/WebKit | image layer rasterization | runtime-dependent | To be confirmed by next runtime trace. |
| Asset source | Studio DOM images | WebKit PDF capture | same app assets/project images | No source selection difference found; no `srcset`/`sizes` used. |
| Intrinsic dimensions | DOM `naturalWidth/naturalHeight` | WebKit PDF capture | to be traced in next runtime | Existing PDFs show source rasters are available in visible path. |
| PDF image dimensions | WebKit PDF output | `pdfimages` | materially lower in Background Standard | Root symptom. |
| Validation | existing PDF gates | Rust/frontend tests | A5 and structural gates pass | No renderer validation change. |

## Root Cause

The Hidden Background Host was created at the capture page size:

```text
width: 420
height: 596
visible: false
```

The visible Development PDF path invokes the same renderer from the normal Main
WebView, whose viewport is the full Studio window. In the available PDFs,
Background raster dimensions line up with a low-resolution 420-wide host
condition:

```text
Destination hero:
Development 2073 px
Background   645 px
ratio        3.21

420 px * 3.21 ~= 1348 px visible Main viewport width
```

The Background Standard PDF therefore does not fail because of PDF/A or
Document Assembly. It is generated from the same proof command but under a
smaller WebView backing/viewport condition, and WebKit emits raster image
objects appropriate for that lower-resolution hidden host.

## Minimal Fix

The Hidden Host now receives a logical window size derived from the visible Main
viewport:

```text
hidden width  = max(ceil(window.innerWidth),  980)
hidden height = max(ceil(window.innerHeight), 700)
```

The fallback values match the Main window minimum from `tauri.conf.json`. The
A5 proof surface remains governed by the existing `pdf-proof-rendering` CSS and
the existing native A5 `WKPDFConfiguration.rect`.

No renderer parameter, PageBox normalization, Document Assembly or PDF/A logic
was changed.

## Runtime Trace Added

The next installed-app run emits:

```text
MAIN_RENDER_ENVIRONMENT
MAIN_ASSET_EVIDENCE
HOST_RENDER_ENVIRONMENT
PAGE_ASSET_EVIDENCE
```

The evidence includes:

```text
window.innerWidth / innerHeight
documentElement.clientWidth / clientHeight
devicePixelRatio
screen / avail size
visualViewport size / scale
document.visibilityState
image src/currentSrc
naturalWidth/naturalHeight
clientWidth/clientHeight
getBoundingClientRect()
computed width/height
object-fit
image-rendering
srcset/sizes presence
```

Tauri physical `innerSize()` / `scaleFactor()` are not called from the Hidden
Host in this fix because that would require additional Hidden Host window ACL.
The current fix stays on existing capabilities and uses browser-observable
render conditions.

## Post-Fix Evidence Required

After installing the app and rerunning:

```text
Ausgabe -> Entwicklungs-PDF
Ausgabe -> PDF exportieren
```

expected technical evidence:

```text
Background Standard page count remains 16.
Background Standard PageBoxes remain exact A5.
Background Standard corresponding raster dimensions are no longer materially downsampled.
Companion objects should match or approach the Development 1536 x 1024 source dimensions.
Destination / hero objects should match or approach the Development large raster dimensions.
Final PDF/A should preserve the fixed Background Standard raster dimensions and set Interpolate=no.
```

Status remains:

```text
INCONCLUSIVE - awaiting raster fidelity runtime validation
```
