# Studio PDF/A-2b Integration Validation

## Status

```text
PASS — ACCEPTED
```

This document records the automated and real installed-app validation of the Studio PDF/A-2b integration.

## Implemented path

```text
canonical Studio Travelbook
→ accepted Document PDF path
→ temporary exact-A5 Standard PDF
→ bounded PDF/A-2b postprocessor
→ internal structural/integrity validation
→ atomic final PDF/A output
```

## Automated evidence

Covered by Rust tests:

```text
XMP PDF/A identification                         PASS
trailer /ID                                      PASS
source-SHA-256 ID strategy                       PASS
embedded sRGB selection without fixed object ID  PASS
missing RGB profile failure                      PASS
OutputIntent insertion                           PASS
/Interpolate true normalization                  PASS
image stream integrity                           PASS
decoded content stream integrity                 PASS
MediaBox/CropBox integrity                       PASS
font integrity                                   PASS
page-count integrity                             PASS
invalid PDF failure                              PASS
wrong geometry failure                           PASS
atomic failure cleanup                           PASS
atomic temp candidate keeps .pdf extension       PASS
actual export command temp/final lifecycle       PASS
```

Covered by frontend tests and static consistency gate:

```text
PDF/A Tauri command boundary                     PASS
accepted Document PDF source reused              PASS
no second renderer                               PASS
no Publisher path                                PASS
no Windows expansion                             PASS
no .nls schema change                            PASS
```

Automated branch gates reported PASS for:

```text
PDF/A consistency gate
Document Proof consistency gate
Single-page PDF consistency gate
pnpm check
pnpm test
pnpm consistency
pnpm build
cargo test
58 Rust tests after temp-path regression fix
git diff --check
```

`cargo fmt --check` remains a separately documented non-blocking historical formatting-drift issue in `src-tauri/src/lib.rs`; no unrelated broad formatting was performed.

## Installed-app runtime evidence

The real installed macOS application successfully generated the PDF/A-2b Travelbook after the atomic temporary-path correction.

The earlier runtime defect was:

```text
final output:   Travelbook.pdf
old temp path:  Travelbook.pdf.pdfa2b.tmp
```

The PDF/A converter correctly required `.pdf`, so the internal caller violated its own contract.

The accepted fixed lifecycle is:

```text
final output:   Travelbook.pdf
temp candidate: Travelbook.pdfa2b.tmp.pdf
```

This fix changed only the temp-path generation and regression tests. The PDF/A conversion module itself remained unchanged.

## External veraPDF validation

The Studio-generated installed-app output:

```text
/Users/bernd/Documents/Norwegen 2027-Travelbook-PDFA-2b.pdf
```

was validated externally with veraPDF 1.30.2 against PDF/A-2b.

Result:

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

The same validator run against the ordinary non-PDF/A Travelbook correctly reproduced the known four-rule failure baseline, confirming that the PDF/A result is not a validator-profile false positive.

## Visual validation

The Studio-generated PDF/A-2b file was compared visually against the accepted Studio proof.

User result:

```text
no visible change to the proof = PASS
```

No layout, typography, footer, Companion, geometry, or color regression was observed in the final manual review.

The isolated PoC had already established that the only measurable render deltas came from required `/Interpolate false` image-sampling behavior and did not alter accepted layout/content.

## Definition of Done status

```text
accepted renderer unchanged                  PASS
Golden 040 unchanged                         PASS
canonical document path reused               PASS
XMP/PDF-A ID                                 PASS
trailer /ID                                  PASS
RGB OutputIntent                             PASS
Interpolate normalization                    PASS
page-content integrity                       PASS
image-stream integrity                       PASS
A5 PageBox integrity                         PASS
standard PDF architecture regression         PASS
automated gates                              PASS
installed-app PDF/A-2b                       PASS
external veraPDF                             PASS
visual Studio-proof vs PDF/A comparison      PASS
atomic temp-path regression                  PASS
```

## Acceptance result

```text
STUDIO PDF/A-2b EXPORT = ACCEPTED
PDF/A-2b CONVERSION PATH = PROVEN
RC-RELEVANT CAPABILITY = ACHIEVED
```

The accepted PDF/A-2b architecture must not be reopened without a new explicit architecture decision.
