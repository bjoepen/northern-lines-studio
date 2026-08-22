# ADR-039 — Studio Resolved Page PDF Proof

## Status

Accepted for PoC branch.

## Context

Golden Build 040 makes Studio the visual and geometric source of truth for the exact A5 page. Earlier Publisher-owned final geometry statements are superseded for Studio-originated proof/export.

System print proved insufficient because saved PDFs could remain A4.

## Decision

Studio PDF Proof uses a small boundary contract:

```ts
StudioPdfProofRequest {
  pageId: string;
  physicalMedium: 'A5';
  outputPath: string;
}
```

The active resolved Studio page is isolated for capture, then native webview PDF APIs produce the PDF:

- macOS: `WKWebView` PDF generation through the Tauri platform webview handle.
- Windows: deferred and not part of the current PoC validation.

On macOS, WebKit's PDF snapshot path may emit integer-point page boxes even when Studio requests fractional exact A5 dimensions. The PoC may therefore perform a metadata-only page-box normalization after native rendering: the rendered content stream is not scaled, translated, reflowed, or recomposed; `/MediaBox` and `/CropBox` are set to exact A5 while preserving the existing top-left page anchor, and `/TrimBox` is normalized the same way if present. Fractional page-area extension is added to the right and bottom.

The final PDF must validate exact A5 page boxes. Failure to produce A5 is a failure, not a fallback.

## Consequences

Studio layout grammar, `.nls`, World typography, Companion, footer, and safe zones remain unchanged.

Publisher may later validate, stage, hash, package, render, and preflight a Studio resolved page, but it must not re-compose Studio content through its independent Page Composition Model.
