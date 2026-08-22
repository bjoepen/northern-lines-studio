# ADR-041 — Studio PDF/A-2b Export

## Status

**ACCEPTED.**

The PDF/A-2b conversion path and the installed macOS Studio integration are proven against a real 16-page Travelbook. The accepted Studio renderer architecture remains unchanged.

## Context

Northern Lines Studio owns the accepted visual/export chain for Studio-originated pages:

```text
Studio resolved page
→ native macOS WKWebView PDF
→ metadata-only exact-A5 PageBox normalization
→ validation
→ canonical publication order
→ content-preserving document assembly
```

A normal Travelbook user must be able to create a durable, validated PDF directly in Studio without requiring Northern Lines Publisher or a professional prepress workflow.

An isolated feasibility audit and conversion PoC were first executed outside the Studio repository against the corrected 16-page `Norwegen 2027-Travelbook-Proof.pdf`. The same bounded conversion was then integrated into Studio and validated in the installed macOS app.

## Evidence

Source audit artifact:

```text
SHA-256  acc07a2d5695de0f6201b6b50431bcd942fa2c64876a93fb67feb096cf7a8072
PDF      1.7
Pages    16
Medium   exact DIN A5
```

The feasibility audit found only bounded A/B/C corrections for PDF/A-2b:

1. XMP metadata / PDF/A identification.
2. Trailer `/ID`.
3. RGB OutputIntent / blending color-space authority.
4. Image dictionaries with `/Interpolate true`.

No validator evidence required re-rendering, rasterization, transparency flattening, page-content-stream rewriting, layout reflow, scaling, translation, or Studio renderer redesign.

The isolated conversion PoC produced a compliant candidate with veraPDF 1.30.2:

```text
PDF/A-2b validation      PASS
passed rules             144
failed rules             0
passed assertions        72,447
failed assertions        0
```

Structural/content evidence from the PoC:

```text
page count                     unchanged
page order                     unchanged
MediaBox/CropBox               unchanged
page content-stream hashes     unchanged on all 16 pages
image stream hashes            unchanged
font resources/embedding       unchanged
```

Visual evidence at 300 dpi showed only localized image-sampling differences attributable to `/Interpolate false`; no text, line, footer, layout, or geometry shift was detected.

## Installed-app runtime validation

The real installed macOS Studio application successfully exported the same Travelbook lineage as PDF/A-2b after correction of the atomic temporary-path bug.

The Studio-generated PDF/A-2b file was validated externally with veraPDF 1.30.2:

```text
profile                 PDF/A-2b validation profile
compliant               true
passed rules            144
failed rules            0
passed checks            72,943
failed checks            0
failed parsing jobs      0
vera exceptions          0
```

The user performed the final visual comparison against the accepted Studio proof and reported no visible change.

Therefore:

```text
Studio PDF/A-2b export          PASS
external veraPDF validation     PASS
visual fidelity                 PASS
PDF/A-2b conversion path        PROVEN
```

## Decision

Northern Lines Studio owns **PDF/A-2b** as a bounded post-processing/export capability on top of the accepted Studio PDF path.

The accepted architecture is:

```text
Studio resolved Travelbook
→ accepted exact-A5 Document PDF path
→ bounded PDF/A-2b structural post-processing
→ Studio structural/integrity validation
→ final PDF/A-2b output
```

The PDF/A stage performs only the proven operations:

1. add valid XMP metadata including `pdfaid:part=2` and `pdfaid:conformance=B`;
2. add a valid trailer `/ID`;
3. add a document-level RGB OutputIntent using an appropriate sRGB ICC profile aligned with the source PDF;
4. normalize image dictionaries from `/Interpolate true` to `/Interpolate false` where required.

The post-processor is not a second renderer.

## Content-integrity contract

The following remain invariant:

```text
page count                  unchanged
canonical page order        unchanged
A5 PageBoxes                unchanged
page content streams        unchanged
image stream bytes          unchanged
font resources              unchanged
layout geometry             unchanged
```

Forbidden:

- page re-rendering for PDF/A conversion;
- page rasterization;
- transparency flattening;
- content-stream geometry rewrites;
- scaling or translation;
- reflow;
- a second browser runtime;
- Publisher composition/layout ownership.

The `/Interpolate` change is an approved image-dictionary correction only. Image streams themselves remain unchanged.

## ICC / OutputIntent rule

Studio must not blindly inject an unrelated profile.

The implementation selects an appropriate RGB ICC profile already embedded in the generated Studio PDF. The implementation does not assume a fixed object ID.

If a compatible profile cannot be identified safely, PDF/A export must fail truthfully with the defined OutputIntent error rather than claim conformance.

## Validation authority

Studio performs deterministic internal structural and integrity checks, but these are not a proprietary replacement for PDF/A conformance validation.

veraPDF remains the independent engineering conformance authority for acceptance/regression evidence.

A user-facing export must never label a file PDF/A-2b after a known failed validation step.

## Product language

PDF/A is an export capability, not a layout mode.

The normal user is not exposed to XMP internals, ICC object IDs, `/Interpolate` keys, PDF object dictionaries, or veraPDF rule IDs.

The existing PDF-Proof remains the visual QA function. PDF/A-2b is the durable/exportable document option.

## Publisher boundary

Northern Lines Publisher is not required for this capability.

Publisher remains outside this integration scope. The proven Studio PDF is the input authority; PDF/A post-processing validates and structurally augments that output but never re-composes it.

## Platform scope

The accepted implementation target remains macOS, matching the current Studio PDF architecture.

No Windows PDF/A work is authorized by this ADR.

## Consequences

Positive:

- Studio is materially closer to RC as a self-contained Travelbook authoring and export application.
- The normal 1–2-copy home/copyshop workflow no longer depends on Publisher.
- PDF/A-2b is reached without reopening the accepted renderer architecture.
- The conversion is bounded, auditable, and independently validated.

Known characteristic:

- `/Interpolate false` can create renderer-dependent image-sampling differences, but the proven Studio export showed no visible regression in the accepted visual review.

## Integration design

Studio uses a dedicated Rust post-processing module:

```text
src-tauri/src/pdfa.rs
```

The module loads an accepted Studio Document PDF, collects integrity evidence, applies only the four approved structural operations, writes a candidate PDF, reloads it, validates the required structure, and compares integrity evidence before success.

The Tauri command boundary is:

```text
export_studio_pdfa2b(sourcePath, outputPath)
```

The frontend path is:

```text
canonical Studio Travelbook
→ existing Document PDF orchestration
→ temporary exact-A5 Standard PDF
→ export_studio_pdfa2b
→ final PDF/A-2b file
```

### Atomic output rule

The final output and internal candidate are separate files. The internal candidate must retain a `.pdf` extension so it satisfies the PDF/A converter contract:

```text
final:      Travelbook.pdf
temporary:  Travelbook.pdfa2b.tmp.pdf
```

The earlier `.tmp`-extension defect is fixed and regression-tested.

### Trailer ID strategy

```text
SHA-256(source Standard PDF bytes)
→ first 16 bytes
→ both trailer ID entries as hexadecimal PDF strings
```

### ICC selection strategy

The OutputIntent uses an ICC profile already embedded in the source PDF. The implementation selects a structurally suitable RGB/sRGB stream without assuming an object ID.

### Internal validation limit

Studio validates the expected structure and integrity invariants, including PDF/A identification, trailer `/ID`, OutputIntent, absence of `/Interpolate true`, page count, exact-A5 boxes, decoded content streams, image stream bytes, and font resources.

Independent engineering validation remains reproducible with:

```bash
verapdf --format json -f 2b "<candidate.pdf>"
```

## Final acceptance

The installed-app merge gate is satisfied for the PDF/A capability:

```text
PDF/A-2b candidate generated                    PASS
independent veraPDF validation                  PASS
failed rules/checks                             0 / 0
visual fidelity                                 PASS
accepted renderer architecture                  unchanged
```

The PDF/A-2b export architecture is now accepted and must not be reopened without a new explicit architecture decision.
