# ADR-040 — Studio Document Proof

## Status

Accepted.

## Context

ADR-039 established and validated the accepted macOS single-page PDF proof primitive:

```text
Studio resolved page
→ native WKWebView PDF
→ metadata-only exact-A5 PageBox normalization
→ validation
```

The next requirement was a multi-page visual proof for a complete Travelbook without introducing a second layout or rendering system.

Real-world PoC 001 exposed and resolved three orchestration/fidelity issues before acceptance:

1. stale DOM / transition capture could produce blank or washed-out pages;
2. raw `project.pageManifest` storage order was not canonical publication order;
3. Notes/Memory transparent mixed gradients rendered incorrectly in native WKWebView PDF output.

The final 16-page installed-app Travelbook proof passed page count, publication order, exact-A5, visual fidelity and state-restoration validation.

## Decision

Studio Document Proof is accepted with this architecture:

```text
canonical Studio publication order
→ serially select one Studio page
→ rendered-page identity/readiness gate
→ accepted ADR-039 single-page PDF primitive
→ staged exact-A5 validated page PDF
→ repeat for all pages
→ content-preserving PDF assembly
→ final document validation
→ atomic final output
```

### Publication-order authority

The Document Proof must use the same canonical publication sequence as Studio's visible book semantics:

```text
publicationOrderedPages(pageManifest, routeStageIds)
```

This source is aligned with Sidebar/grouped navigation, Orientation and footer page numbering.

Binding invariant:

```text
Studio Orientation order
== Studio footer/page-number order
== Document Proof order
```

Raw `pageManifest` insertion/storage order is not a publication-order contract.

### Serial orchestration

Pages are rendered one at a time through the existing Studio WebView.

No parallel page rendering, hidden second WebView or secondary render tree is introduced.

Before capture, the requested page must satisfy the rendered-page identity/readiness contract, including:

- requested page ID equals selected Studio page ID;
- rendered `.a5-page` identifies the same page;
- Svelte DOM commit has completed;
- browser layout boundary has been crossed;
- current-page fonts/assets are ready;
- page is visually stable and not captured during transition opacity/filter state.

### Page rendering

Every page uses the unchanged ADR-039 single-page primitive.

Document Proof does not duplicate or reinterpret page layout.

### Assembly

Only already-rendered, already-normalized, already-validated single-page PDFs are assembled.

Assembly may construct the PDF page tree and document structure, but must not:

- render;
- scale;
- translate;
- reflow;
- alter typography;
- change page content geometry.

Decoded page content integrity is validated between staged pages and final document.

### Atomicity

Document Proof is atomic from the user-visible output perspective.

Any page/render/readiness/validation/assembly failure fails the whole job. A partially generated new document must not be reported or replace the requested successful output.

### Manifest

The temporary proof manifest schema is:

```text
northern-lines.studio.document-proof.v1
```

It records audit evidence per page, including page identity, order, physical dimensions, checksum and decoded content evidence. It is orchestration/validation metadata, not a second layout model.

## Consequences

Studio remains the sole authority for:

- page content;
- page geometry;
- publication order;
- World typography and expression;
- Companion/footer/safe zones.

The accepted Document Proof is a **visual editorial proof**, not production/prepress publishing.

The following remain outside this ADR:

- Publisher integration;
- production/prepress PDF;
- bleed/crop marks;
- imposition;
- output/printer profiles;
- Windows proof implementation.

Publisher may later consume a Studio-owned proof/package for validation, staging, preflight and production, but must not re-compose resolved Studio pages.

## Architecture Stability

The Document Proof architecture established here is accepted and must not be replaced or reworked as another renderer experiment without a new explicit ADR.

Future work should build on this primitive rather than reopen the solved rendering/assembly question.
