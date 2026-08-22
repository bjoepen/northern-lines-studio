# ADR-041 — Studio PDF/A-2b Export

## Status

**Accepted for Studio integration.**

The PDF/A-2b conversion path has been proven in an isolated local PoC against a real 16-page Studio Travelbook. Studio runtime integration remains subject to the normal branch gates and installed-app real-world validation before merge to `main`.

## Context

Northern Lines Studio already owns the accepted visual/export chain for Studio-originated pages:

```text
Studio resolved page
→ native macOS WKWebView PDF
→ metadata-only exact-A5 PageBox normalization
→ validation
→ canonical publication order
→ content-preserving document assembly
```

The user-facing requirement is no longer limited to visual proof. A normal Travelbook user should be able to create a durable, validated PDF directly in Studio without requiring Northern Lines Publisher or a professional prepress workflow.

An isolated PDF/A feasibility audit and conversion PoC were executed outside the Studio repository against the corrected 16-page `Norwegen 2027-Travelbook-Proof.pdf`.

## Evidence

Source artifact:

```text
SHA-256  acc07a2d5695de0f6201b6b50431bcd942fa2c64876a93fb67feb096cf7a8072
PDF      1.7
Pages    16
Medium   exact DIN A5
```

Feasibility audit result:

```text
PDF/A-2b        CONDITIONAL GO
PDF/A-4         rejected as the less natural target for this PDF 1.7 source
```

The audit found only bounded A/B/C corrections for PDF/A-2b:

1. XMP metadata / PDF/A identification.
2. Trailer `/ID`.
3. RGB OutputIntent / blending color-space authority.
4. Fifty image dictionaries with `/Interpolate true`.

No validator evidence required:

- re-rendering;
- rasterization;
- transparency flattening;
- page-content-stream rewriting;
- layout reflow;
- scaling or translation;
- Studio renderer redesign.

The isolated conversion PoC then produced a PDF/A-2b candidate and validated it with veraPDF 1.30.2:

```text
PDF/A-2b validation      PASS
passed rules             144
failed rules             0
passed assertions        72,447
failed assertions        0
```

Structural/content evidence:

```text
page count                     unchanged
page order                     unchanged
MediaBox/CropBox               unchanged
page content-stream hashes     unchanged on all 16 pages
image stream hashes            unchanged
font resources/embedding       unchanged
```

Visual evidence at 300 dpi:

- pages 1–2 were pixel-identical;
- pages 3–16 showed only localized image-sampling differences attributable to the required `/Interpolate false` correction;
- no text, line, footer, layout or geometry shift was detected;
- manual review of Cover, Orientation, Bergen, Photography, Geiranger, Workshop and Notes/Memory passed.

The local PoC decision was:

```text
GO
PDF/A-2b CONVERSION PATH = PROVEN
```

## Decision

Northern Lines Studio may integrate **PDF/A-2b** as a bounded post-processing/export capability on top of the already accepted Studio PDF path.

The architecture is:

```text
Studio resolved Travelbook
→ accepted exact-A5 Document PDF path
→ bounded PDF/A-2b structural post-processing
→ Studio PDF/A structural validation
→ final output
```

The PDF/A stage must perform only the proven operations required by the PoC:

1. add valid XMP metadata including `pdfaid:part=2` and `pdfaid:conformance=B`;
2. add a valid trailer `/ID`;
3. add a document-level RGB OutputIntent using an appropriate sRGB ICC profile aligned with the source PDF;
4. normalize image dictionaries from `/Interpolate true` to `/Interpolate false` where required.

The post-processor must not become a second renderer.

## Content-integrity contract

The following are invariants of the Studio PDF/A path:

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

The `/Interpolate` change is an approved image-dictionary correction only. Image streams themselves must remain unchanged.

## ICC / OutputIntent rule

Studio must not blindly inject an unrelated profile.

The implementation must select an appropriate RGB ICC profile consistent with the generated Studio PDF. The proven PoC reused the embedded `sRGB IEC61966-2.1` profile already present in the source PDF.

If the required compatible profile cannot be identified safely, the PDF/A export must fail truthfully rather than claim conformance.

## Validation authority

Studio may implement deterministic internal structural checks, but it must not invent a proprietary definition of PDF/A compliance.

The local PoC used veraPDF as the independent conformance authority. Production integration should preserve evidence that the generated structure matches the proven PDF/A-2b contract and should keep a reproducible veraPDF validation path in engineering/quality gates.

A user-facing export must never label a file PDF/A-2b after a known failed validation step.

## Product language

PDF/A is an export capability, not a new layout mode.

The normal user should not be exposed to:

- XMP internals;
- ICC object IDs;
- `/Interpolate` keys;
- PDF object dictionaries;
- veraPDF rule IDs.

The product surface should remain simple, for example:

```text
Travelbook exportieren …
  Standard PDF
  PDF/A-2b
```

Exact wording may be refined during implementation, but the existing `PDF-Proof` remains the visual QA function and must not be conflated with the durable export action.

## Publisher boundary

Northern Lines Publisher is not required for this capability.

Publisher remains outside this integration scope. The proven Studio PDF is the input authority; PDF/A post-processing may validate and structurally augment that output but must not re-compose it.

## Platform scope

Current active integration target remains macOS, matching the accepted Studio PDF architecture.

No Windows PDF/A work is authorized by this ADR.

## Consequences

Positive:

- Studio can move materially closer to RC as a self-contained Travelbook authoring and export application.
- The normal 1–2-copy home/copyshop workflow no longer depends on Publisher.
- PDF/A can be reached without reopening the accepted renderer architecture.
- The conversion is auditable and bounded.

Costs/risks:

- `/Interpolate false` can create renderer-dependent image-sampling differences.
- ICC selection must remain deterministic and appropriate.
- PDF/A validation adds a new export-quality responsibility to Studio.

## Integration design

Studio integration uses a dedicated Rust post-processing module:

```text
src-tauri/src/pdfa.rs
```

The module is intentionally narrow. It loads an accepted Studio Document PDF, collects integrity evidence, applies only the four approved structural operations, writes a candidate PDF, reloads it, validates the required structure, and compares integrity evidence before success.

The Tauri command boundary is:

```text
export_studio_pdfa2b(sourcePath, outputPath)
```

The frontend creates the PDF/A source through the already accepted Travelbook Document PDF path:

```text
canonical Studio Travelbook
→ existing Document PDF orchestration
→ temporary exact-A5 Standard PDF
→ export_studio_pdfa2b
→ final PDF/A-2b file
```

The UI labels this as a Travelbook export option and does not expose PDF object details.

### Trailer ID strategy

The trailer `/ID` is deterministic and auditable:

```text
SHA-256(source Standard PDF bytes)
→ first 16 bytes
→ both trailer ID entries as hexadecimal PDF strings
```

### ICC selection strategy

The OutputIntent uses an ICC profile already embedded in the source PDF. The implementation does not assume an object ID. It selects the first structurally suitable stream with RGB channel count (`/N 3`) and RGB evidence such as `/Alternate /DeviceRGB` or explicit sRGB profile content.

If no suitable embedded RGB/sRGB profile is found, export fails with:

```text
PDF_A_OUTPUT_INTENT_UNAVAILABLE
```

### Internal validation limit

Studio validates the expected structure and integrity invariants, including PDF/A identification, trailer `/ID`, OutputIntent, absence of `/Interpolate true`, page count, exact-A5 boxes, decoded content streams, image stream bytes and font resources.

This internal validation is not a replacement for independent ISO conformance validation. Engineering validation remains:

```bash
verapdf --format json -f 2b "<candidate.pdf>"
```

## Merge gate for implementation

The Studio integration is mergeable only when a real installed-app Travelbook export proves:

```text
PDF/A-2b candidate generated                    PASS
independent veraPDF validation                  PASS
failed rules/assertions                         0 / 0
page count/order                                unchanged
A5 PageBoxes                                    unchanged
content-stream integrity                        PASS
image-stream integrity                          PASS
visual fidelity                                 PASS
existing Standard PDF/Proof paths               no regression
Studio state restoration                        PASS
```

Until then the architecture is accepted, but the Studio integration remains pending validation.
