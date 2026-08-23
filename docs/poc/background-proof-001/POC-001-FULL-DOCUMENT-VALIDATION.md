# Background Proof PoC 001 - Full Document Validation

Status: INCONCLUSIVE - awaiting full-document runtime validation

## Scope

This note records the full-Travelbook completion scope added to the existing
Background Proof PoC 001 branch.

The accepted renderer, exact-A5 normalization, Document Assembly and PDF/A-2b
postprocessor remain the authority. This PoC changes only the Background Host
orchestration and the visible export entry point.

## Expected Runtime Evidence

Reference Travelbook:

```text
expected pages: 16
page source: canonical publication order via studioDocumentProofPages()
Main selectedPage before == during == after
```

Hidden Host trace must show one serial iteration per canonical page:

```text
DOCUMENT_BACKGROUND_START
PAGE_COUNT_RESOLVED pages=16
PAGE_ITERATION_START index=1/16
PAGE_SELECTED
PAGE_READY
PAGE_PROOF_START
PAGE_PROOF_COMPLETE
PAGE_STAGED
PAGE_ITERATION_COMPLETE
...
PAGE_ITERATION_START index=16/16
PAGE_ITERATION_COMPLETE
DOCUMENT_ASSEMBLY_START
DOCUMENT_ASSEMBLY_COMPLETE
STANDARD_DOCUMENT_READY
PDFA_POSTPROCESS_START
PDFA_POSTPROCESS_COMPLETE
FINAL_OUTPUT_READY
COMPLETE
```

## Output Artifacts

`PDF exportieren` produces:

```text
final PDF/A-2b: user-selected output path
background standard PDF: <final-name>-background-standard.pdf
```

The Background Standard PDF is retained beside the final PDF as comparison
evidence. Staged single-page PDFs remain temporary and are cleaned up through
the existing staging cleanup command.

`Entwicklungs-PDF` remains the existing accepted visible Standard PDF path and
serves as the comparison reference during this PoC.

## Host Request Contract

The Full-Document caller must provide a complete Hidden Host request before
`new WebviewWindow(...)`:

| Field | Caller Writes | Hidden Host Reads | Required | Source | Target Name | Encoding | Validation |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `nlsBackgroundProofPoc` | yes | yes | yes | constant `001` | `nlsBackgroundProofPoc` | `URLSearchParams` | equals `001` |
| `mode` | yes | yes | yes | caller mode | `mode` | `URLSearchParams` | `document-pdfa2b` for final export |
| `projectPath` | yes | yes | yes | saved project | `projectPath` | `URLSearchParams` | non-empty |
| `outputDir` | yes | yes | yes | derived final-output parent | `outputDir` | `URLSearchParams` | non-empty |
| `jobId` | yes | yes | yes | Main caller | `jobId` | `URLSearchParams` | non-empty |
| `returnTo` | yes | yes | yes | Main window label | `returnTo` | `URLSearchParams` | non-empty |
| `finalOutputPath` | yes | yes | yes | save dialog | `finalOutputPath` | `URLSearchParams` | non-empty |
| `backgroundStandardPath` | no | derived | no URL parameter | `finalOutputPath` | none | derived | deterministic |

Runtime blocker fixed:

```text
BACKGROUND_PROOF_POC_001_INVALID_HOST_REQUEST
```

Cause:

```text
Full-Document caller wrote final output path but left outputDir empty.
Hidden Host required outputDir for all valid requests.
```

Fix:

```text
finalOutputPath selected by Main
→ outputDir derived from finalOutputPath parent
→ finalOutputPath transported under the same name the Hidden Host reads
→ backgroundStandardPath derived in Hidden Host
```

The request validation remains strict. Missing `outputDir`, `projectPath`,
`jobId`, `returnTo`, or Full-Document `finalOutputPath` still fails.

## Comparison Checklist

Background Standard PDF vs Entwicklungs-PDF:

```text
page count                  user runtime validation required
canonical page order         user runtime validation required
MediaBox / CropBox / TrimBox user runtime validation required
fonts / embedding            user runtime validation required
image streams                user runtime validation required
decoded content streams      user runtime validation required
visual output                user runtime validation required
```

Byte identity is not required because PDF object numbering and metadata may
differ between runs. Structural and visual differences must not be accepted
silently.

## PDF/A-2b

The final user PDF is produced by the existing PDF/A-2b postprocessor:

```text
Background Standard Document PDF
→ export_studio_pdfa2b
→ final user PDF
```

External veraPDF validation is user-owned unless the local toolchain is
available in the runtime environment.

Target external result:

```text
profileName: PDF/A-2b
compliant: true
failedRules: 0
failedChecks: 0
```

## Current Status

Automated gates can prove only call-site structure, typed lifecycle coverage and
ordinary test/build correctness.

```text
16/16 installed-app runtime pages      NOT RUN
Main invariant                         NOT RUN
Background Standard PDF generated      NOT RUN
Final PDF/A-2b generated               NOT RUN
External veraPDF                       NOT RUN
Visual validation                      NOT RUN
```

## Raster Fidelity Follow-Up

Runtime after the full-document path produced a new quality finding:

```text
Development PDF          sharper / higher raster dimensions
Background Standard PDF  visibly softer raster resources
Final PDF/A-2b           inherits the Background Standard raster dimensions
```

Focused evidence is recorded in:

```text
docs/poc/background-proof-001/POC-001-RASTER-FIDELITY-INVESTIGATION.md
```

Root cause:

```text
Hidden Host was created at 420 x 596 logical px.
Visible Development PDF runs from the normal larger Main WebView.
WKWebView PDF output rasterized image layers under the smaller hidden viewport.
```

Minimal fix:

```text
Hidden Host logical window size now derives from the visible Main viewport,
with the Main-window minimum as fallback.
```

The A5 proof surface, renderer, Document Assembly and PDF/A-2b postprocessor
remain unchanged.

Current full-document status is therefore:

```text
INCONCLUSIVE - awaiting raster fidelity runtime validation
```
