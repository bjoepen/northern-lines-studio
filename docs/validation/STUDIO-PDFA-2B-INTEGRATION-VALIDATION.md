# Studio PDF/A-2b Integration Validation

## Status

```text
PENDING USER VALIDATION
```

This document records automated branch validation for the Studio PDF/A-2b integration. It does not replace installed-app validation or independent veraPDF validation.

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

## Engineering veraPDF gate

Run on a Studio-generated candidate:

```bash
verapdf --format json -f 2b "<Studio-exported-PDFA.pdf>"
```

Required result:

```text
compliant             true
failed rules          0
failed assertions     0
```

## Installed-app validation still required

The user-owned macOS installed-app validation must generate both Standard PDF and PDF/A-2b from the same real 16-page Travelbook lineage.

Required runtime evidence:

```text
both outputs exist                         PENDING
both have 16 pages                         PENDING
canonical order identical                  PENDING
every page exact A5                        PENDING
visual Studio fidelity                     PENDING
PDF/A file opens normally                  PENDING
Standard PDF path unchanged                PENDING
Studio state restored                      PENDING
no false error                             PENDING
external veraPDF                           PENDING
300-dpi Standard-vs-PDF/A visual diff      PENDING
```

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
standard PDF regression                      AUTOMATED PASS / RUNTIME PENDING
automated gates                              PENDING
installed-app Standard PDF                   PENDING USER VALIDATION
installed-app PDF/A-2b                       PENDING USER VALIDATION
external veraPDF                             PENDING USER VALIDATION
visual Standard-vs-PDF/A comparison          PENDING USER VALIDATION
```
