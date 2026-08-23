# Background PDF Rendering — Postmortem

## Status

**REJECTED / FAILED EXPERIMENT**

This document preserves the durable engineering conclusion from the former `background-proof-001` PoC. The detailed PoC working documents were removed from active `main` documentation because they described an experimental path that is no longer authoritative.

## Goal

The experiment attempted to remove visible page switching during whole-document export by rendering pages in a separate hidden WKWebView.

## What worked

- a hidden host could be created;
- the Studio project could be loaded there;
- a multi-page document could be generated serially;
- PDF/A-2b postprocessing itself remained structurally valid.

## Why the approach was rejected

The hidden render host produced materially degraded raster fidelity compared with the accepted Main-WKWebView export path.

Observed evidence from the investigation included approximately:

```text
Main / Development PDF       ~48–50 MB
Hidden Background PDF        ~2.3 MB

Companion — Main             1536 × 1024 px
Companion — Hidden           116 × 77 px

Destination Hero — Main      2073 × 758 px
Destination Hero — Hidden    645 × 236 px
```

Affected hidden-host raster objects were observed around 144 ppi. The degradation was already present in the background Standard PDF before PDF/A postprocessing. PDF/A conversion was therefore not the root cause.

## Engineering conclusion

The exact internal WebKit mechanism behind the hidden-host raster downgrade was not proven sufficiently to justify further renderer experimentation.

The accepted authority remains:

```text
visible Main WKWebView
→ resolved Studio page
→ accepted native WKWebView PDF generation
→ exact-A5 normalization
→ document assembly
→ bounded PDF/A-2b postprocessing
```

The Main WKWebView remains the authoritative render host for Studio-originated pages.

## Known UX limitation

Because the accepted whole-document export serially selects each resolved Studio page in the visible Main WKWebView, the user can observe page switching during export. Internally this is referred to as the **Daumenkino** effect.

The UX limitation is accepted for now because output fidelity, print quality and deterministic PDF/A-2b generation take precedence over visual masking or background rendering.

## Non-goals / rejected shortcuts

Do not reintroduce the failed hidden renderer merely to suppress visible page switching. Do not replace the accepted renderer with screenshot/raster export, Chromium/Playwright/Puppeteer, fit-to-page, image upscaling, or a second layout engine without a new explicit architecture decision.

## Current status

```text
Main renderer quality        PASS
whole-document export        PASS
PDF/A-2b                     PASS
veraPDF                      PASS
hidden background renderer   REJECTED
visible page switching       KNOWN UX LIMITATION
```
