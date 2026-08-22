# Studio PDF/A-2b Local PoC Validation

## Result

```text
GO
PDF/A-2b CONVERSION PATH = PROVEN
```

This document records the isolated local evidence that justified ADR-041. The PoC was executed outside the Northern Lines Studio repository in `~/Projekte/veraPDF` and did not modify Studio, Git or GitHub.

## Source artifact

```text
Filename     Norwegen 2027-Travelbook-Proof.pdf
SHA-256      acc07a2d5695de0f6201b6b50431bcd942fa2c64876a93fb67feb096cf7a8072
PDF version  1.7
Pages        16
Page size    419.528 × 595.276 pt ≈ 148 × 210 mm
```

The original hash was identical before and after the audit and conversion PoC.

## Feasibility audit

Toolchain included veraPDF 1.30.2.

### PDF/A-2b baseline

```text
Result                  FAIL
Passed rules            140
Failed rules            4
Failed assertions       68
```

Findings:

1. catalog XMP metadata / PDF/A identification missing;
2. trailer `/ID` missing;
3. OutputIntent / blending color-space authority missing for transparency;
4. 50 image dictionaries had `/Interpolate true`.

### PDF/A-4 baseline

```text
Result                  FAIL
Passed rules            104
Failed rules            5
Failed assertions       69
```

PDF/A-4 had the same core findings plus the requirement to move the file header from PDF 1.7 to PDF 2.x. PDF/A-2b was therefore selected as the natural target for the current Studio PDF 1.7 output.

The audit decision was `CONDITIONAL GO` because no class-D or class-E requirement was found, but the visual neutrality of OutputIntent and `/Interpolate` changes still needed proof.

## Conversion PoC

Candidate:

```text
output/Norwegen 2027-Travelbook-PDFA-2b-candidate.pdf
SHA-256 bf35318b6885e72ea1e5589463129395abf301f14b9c902b310b2166e17499f8
```

Applied changes:

- added XMP metadata with `pdfaid:part="2"` and `pdfaid:conformance="B"`;
- added deterministic trailer `/ID` using the first 16 bytes of the source SHA-256;
- added document-level OutputIntent with `sRGB IEC61966-2.1` reused from an ICC profile embedded in the source PDF;
- changed exactly 50 image dictionaries from `/Interpolate true` to `/Interpolate false`.

No image stream bytes, page content streams, fonts, PageBoxes, page order, layout, scaling, translation or rendering were changed.

## Independent validation

veraPDF command used:

```text
tools/verapdf/verapdf --format json -f 2b output/Norwegen 2027-Travelbook-PDFA-2b-candidate.pdf
```

Result:

```text
PDF/A-2b compliant      true
Passed rules            144
Failed rules            0
Passed assertions       72,447
Failed assertions       0
```

## Structural integrity

```text
Page count                         PASS · 16 → 16
Page order                         PASS
PDF header                         PASS · remains PDF 1.7
Font resources                     PASS · unchanged
Font embedding                     PASS · unchanged
XMP                                PASS · present
PDF/A identification               PASS · present
Trailer /ID                        PASS · present
RGB OutputIntent                   PASS · present
/Interpolate violations            PASS · resolved
```

## Content integrity

All 16 decoded page-content-stream hashes were identical between source and candidate.

```text
PAGE_CONTENT_STREAMS_UNCHANGED = PASS
```

## Image integrity

Decoded image stream hashes and technical image properties were unchanged.

Allowed dictionary-only difference:

```text
/Interpolate true → /Interpolate false
```

```text
IMAGE_STREAMS_UNCHANGED = PASS
```

## PageBox integrity

All 16 MediaBox and CropBox values remained unchanged.

```text
PAGEBOXES_UNCHANGED = PASS
EXACT_A5 = PASS
```

## Visual diff

Source and candidate were rendered with Poppler at 300 dpi.

All pages rendered to:

```text
1749 × 2481 px
```

Results:

- pages 1–2: pixel-identical;
- pages 3–16: localized image-sampling differences only;
- maximum channel difference: 38 on page 3, localized around dotted leader marks;
- largest differing area: page 15, 1.965884%, localized around the sketch-dot surface and Companion image;
- no text movement;
- no line movement;
- no Footer movement;
- no layout shift;
- no geometry shift;
- no missing content.

Manual focus-page review passed for:

- Cover;
- Orientation;
- Bergen destination;
- Photography interest;
- Geiranger destination;
- Photography Workshop;
- Notes / Memory.

The Notes/Memory page retained writing surfaces, line geometry, dot grid, labels, Companion, Footer and colors.

## Non-actions proven

```text
ORIGINAL_PDF_UNCHANGED                 PASS
STUDIO_REPOSITORY_UNTOUCHED            PASS
GIT_GITHUB_USED                        NO
PUBLISHER_USED                         NO
RE_RENDERING_PERFORMED                 NO
RASTERIZATION_PERFORMED                NO
TRANSPARENCY_FLATTENING_PERFORMED      NO
CONTENT_STREAM_REWRITE_PERFORMED       NO
```

## Conclusion

The isolated PoC removes the earlier feasibility uncertainty.

PDF/A-2b can be produced from the accepted Studio-generated Travelbook through bounded structural post-processing while preserving page geometry, decoded page-content streams, image-stream bytes, fonts, page order and accepted visual fidelity.

This evidence authorizes the bounded Studio integration described by ADR-041. It does not itself prove the installed-app integration; that remains the implementation branch's real-world merge gate.

## Studio integration follow-up

Branch integration evidence is recorded separately in:

```text
docs/research/STUDIO-PDFA-2B-INTEGRATION.md
docs/validation/STUDIO-PDFA-2B-INTEGRATION-VALIDATION.md
```

The local PoC remains the feasibility baseline. The Studio integration must still pass installed-app Standard PDF/PDF-A generation, external veraPDF validation and 300-dpi visual comparison before merge.
