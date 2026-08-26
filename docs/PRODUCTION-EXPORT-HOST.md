# Production Export Host — macOS/WebKit Rendering Contract

Status: **resolved / validated**  
Branch: `feature/publisher-production-integration`  
Validated: 2026-08-26

## Architecture invariant

> Northern Lines Studio owns the page. Publisher owns the production job.

Studio remains the sole owner of layout, renderer, and Editorial World semantics. The production integration must not establish a second renderer. Publisher orchestrates the production job around Studio's renderer.

## Final production-host configuration

The full-document Production Host is a real, visible, onscreen `WKWebView` hosted by Tauri/AppKit. On macOS its `WKWebViewConfiguration` is created with:

- `suppressesIncrementalRendering = true`
- `inactiveSchedulingPolicy = none`
- Tauri `backgroundThrottling = Disabled`

The native `NSWindow` that contains the Production Host is intentionally assigned:

```rust
host_ns.setAlphaValue(0.01);
```

This is a production invariant, not cosmetic cleanup.

Do **not** change the value to `0.0` without a new controlled validation. Do **not** geometrically align the Production Host beneath the native cover as a replacement for this mechanism.

## Why this exists

During full-document export, macOS/WebKit changes rendering behaviour depending on the effective visibility/occlusion state of the Production Host.

The original G checkpoint produced full-resolution images and fast export, but part of the onscreen host remained visible to the user. G1 attempted to remove that visible area by positioning the Production Host at `(40, 40)` so that it became geometrically aligned with the native cover.

That single geometry change immediately restored the low-resolution image behaviour (approximately 144 ppi). Removing the G1 position change restored full image resolution. G1 was therefore removed and must not be reintroduced.

### H0 — Window state instrumentation

H0 measured the native Render Host and Cover around the AppKit child-window attach. It confirmed that G intentionally/structurally had different frames for the two windows. Attaching the cover changed its parent relationship but did not align the frames.

### H0.1 — Render-time instrumentation

H0.1 measured the Production Host immediately before every native PDF render in an 18-page export.

Result: all 18 render operations reported the Production Host as:

```text
isVisible=true
occlusionVisible=true
key=false
main=false
```

This demonstrated that key/main-window status was not required, while the working high-resolution G state correlated with the host remaining visible/non-occluded at actual PDF render time.

### H1A — compositor presentation

H1A left the successful G geometry and WebKit configuration unchanged and changed only the native window presentation:

```rust
host_ns.setAlphaValue(0.01);
```

Result:

- Production Host remained `isVisible=true`.
- Production Host remained `occlusionVisible=true` for all 18 page renders.
- No perceptible page-flipping/render animation was observed by the user.
- Full/high image resolution was retained.

A `0.0` experiment was deliberately not performed. `0.01` already solves the user-visible problem while preserving the validated WindowServer/WebKit state; testing exact zero would introduce an unnecessary compositor edge case.

## Validated output

The final H1A state passed the real-world 18-page Travelbook export.

Known good embedded image dimensions include:

```text
Companion:   1536 × 1024 px
Bergen Hero: 2073 × 758 px
Curated:     1672 × 941 px
```

The PDF/A-2b output was validated with veraPDF 1.30.2:

```text
profile:       PDF/A-2b
compliant:     true
passedRules:   144
failedRules:   0
passedChecks:  85893
failedChecks:  0
```

The validated PDF/A-2b file contained the complete 18-page Travelbook.

## Rejected / disproven directions

The investigation established that the quality regression was not caused by:

- PDF/A-2b itself
- veraPDF processing
- Studio's page renderer
- source image quality/assets
- Companion `drop-shadow()`
- key-window status
- main-window status

Do not revive these as primary explanations without new evidence.

Also avoid these previously unsuccessful approaches:

- moving the Production Host offscreen
- hiding/order-out of the Production Host
- geometrically covering the Production Host completely (G1)
- duplicating the Studio renderer
- replacing native PDF rendering with snapshot/bitmap rendering

## Maintenance contract

The production export path depends on the following combined invariant:

```text
Studio renderer unchanged
+ real onscreen WKWebView
+ G WebKit scheduling/configuration
+ background throttling disabled
+ native Production Cover
+ Production Host NSWindow alphaValue = 0.01
= fast, high-resolution, visually calm production export
```

Any future change to Production Host position, visibility, alpha, window ordering, WebKit configuration, scheduling, or background throttling must be treated as a rendering-quality-sensitive change and re-run the complete real-world export gate.

Required gates from repository root:

```bash
git diff --check
pnpm check
pnpm consistency
cargo check --manifest-path src-tauri/Cargo.toml
pnpm tauri build
```

Then verify:

1. full 18-page Development PDF export;
2. no perceptible page-flipping;
3. known-good image dimensions / high image quality;
4. full 18-page PDF/A-2b export;
5. veraPDF `compliant=true`.

## Historical checkpoints

- `001A` — Rust Production Core
- `001B` — Production Controller / native Cover
- `001C` — Studio UI full-document Production Host
- `R2` — Cold-Start Layout Frame Repair
- `G` — WebKit Scheduling / Configuration PoC; high-resolution and fast, but host edge visible
- `G1` — geometry alignment experiment; rejected because image quality regressed
- `H0` — attach-time AppKit window-state instrumentation
- `H0.1` — render-time occlusion instrumentation
- `H1A` — `NSWindow.alphaValue = 0.01`; validated final presentation solution

The production-host visibility/quality issue is considered **closed** at this checkpoint.
