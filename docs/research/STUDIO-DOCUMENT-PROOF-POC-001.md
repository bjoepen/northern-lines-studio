# Studio Document Proof PoC 001

## Status

```text
PASS / ARCHITECTURE ACCEPTED
```

PoC 001 extends the accepted macOS single-page PDF proof primitive to a serial multi-page visual proof.

Final architecture:

```text
canonical Studio publication order
→ one resolved Studio page at a time
→ rendered-page identity/readiness gate
→ accepted single-page A5 PDF proof command
→ staged validated page PDFs
→ content-preserving PDF structure assembly
→ final document validation
→ atomic final output
```

Windows and Publisher are out of scope.

## Page Order Authority

Studio remains the authority for page count, order and stable page IDs. The raw `project.pageManifest` is the project manifest, not the final publication sequence. Real-world validation proved that its insertion/storage order can differ from the visible book order.

The canonical Studio publication order is:

```text
publicationOrderedPages(pageManifest, routeStageIds)
```

It delegates to the same `groupPages()` sequence used by the visible Studio book semantics, including grouped navigation, Orientation and footer page numbers through `travelbookPageNumber()`.

Document Proof consumes `studioDocumentProofPages(project)`, which delegates to `publicationOrderedPages(project.pageManifest, project.journey.stages.map(...))`.

Binding invariant:

```text
Studio Orientation order
== Studio footer/page-number order
== Document Proof order
```

## Serial Orchestration

Document Proof renders strictly serially:

```text
for each page in canonical Studio publication order
→ select page
→ await resolved-page readiness
→ call accepted createStudioPdfProof page primitive
→ stage 0001.pdf, 0002.pdf, ...
→ validate page evidence
```

There is no parallel rendering, no second WebView, no hidden Studio render tree and no second HTML/PDF renderer.

## Readiness Contract

Before each page render, Studio requires:

- requested page ID equals active `selectedPage` ID;
- rendered `.a5-page` carries the same `data-studio-page-id`;
- Svelte DOM update committed;
- one browser layout frame after that commit;
- fonts ready when available;
- images inside the identified current `.a5-page` complete;
- page visually stable: visible, opacity `1`, no filter, no running page animation, and proof mode free from preview transform.

No arbitrary sleeps are used.

Corrected sequence:

```text
select requested page
→ await Svelte DOM commit
→ await browser layout frame
→ verify selected/rendered identity
→ wait for fonts
→ verify current-page images
→ verify visual stability
→ enable proof mode
→ await commit + layout frame
→ verify identity/stability again
→ capture
→ leave proof mode before next page
```

The first real-world run proved this contract was necessary: stale DOM and `in:fade` opacity could otherwise be captured as blank or washed-out pages.

## Empty-Capture Rejection

Exact A5 alone is not sufficient evidence of a valid staged page.

Before assembly, staged pages also provide structural content evidence:

- content stream count;
- decoded content byte total;
- decoded content hashes;
- page resource count.

A structurally empty staged A5 page fails with the document-proof empty-capture invariant before assembly.

## Notes/Memory Visual Fidelity

A later real-world run exposed dark/black Notes writing surfaces in both single-page and multi-page proof.

The defect was isolated to the Studio CSS used by the Notes/Memory page:

- writing fields used gradients with `color-mix(..., transparent)` and transparent stops;
- native WKWebView PDF rendered those large transparent mixed gradient fields incorrectly;
- assembly was ruled out because the single-page Notes proof reproduced the same defect.

Correction:

- explicit `--notes-surface` values;
- line/dot colors mix against the explicit surface;
- gradient gaps use the explicit surface instead of transparent;
- Baltic retains its own warm-paper/amber variables;
- no global white override, geometry change or renderer change.

Final single-page and multi-page Notes proofs are visually equivalent and user-validated.

## Single-Page Renderer Reuse

Every document page calls the accepted `createStudioPdfProof()` frontend wrapper and underlying `create_studio_pdf_proof` Tauri command:

```text
native WKWebView PDF
→ metadata-only PageBox normalization
→ exact A5 validation
```

The Document Proof does not duplicate or reinterpret page layout.

## Staging

Rust prepares a per-operation cache directory outside the repository:

```text
~/Library/Caches/Northern Lines Studio/document-proof-<pid>-<timestamp>/
```

Staged page files use deterministic names:

```text
0001.pdf
0002.pdf
0003.pdf
manifest.json
```

Cleanup is attempted after success or failure.

## Assembly Integrity

Only staged PDFs that already passed the single-page A5 validator and structural evidence checks are assembled.

The assembler uses the existing `lopdf` structural PDF library to:

- load each one-page staged PDF;
- record SHA-256 and decoded content evidence;
- renumber object IDs to avoid collisions;
- import PDF objects;
- attach pages to a new Page Tree in canonical order;
- write to temporary final output;
- validate final document;
- atomically replace the target only after success.

It does not render, scale, translate, crop, reflow, change fonts or rewrite content geometry.

## Manifest

The temporary staging manifest schema is:

```text
northern-lines.studio.document-proof.v1
```

Each page entry records:

- index;
- page ID;
- title;
- staged PDF SHA-256;
- width/height;
- validation status;
- content stream count;
- decoded content bytes;
- decoded content hashes;
- resource count.

No page-layout coordinates are stored.

## Failure Semantics

Document Proof is atomic.

Any readiness, render, page validation, assembly, write or final validation failure fails the full document proof. A partial new output is not reported as success and does not replace a previously valid requested output.

The originally active Studio page and proof/capture state are restored in `finally`.

## Final Validation

Before success, Studio verifies:

- final PDF readable;
- final page count equals expected/manifest count;
- canonical order represented by sequential manifest entries;
- every page exact A5;
- no duplicate page IDs;
- final decoded page content hashes match staged page evidence in order.

## Real-World Acceptance Evidence

The final installed-app test used the same 16-page Travelbook that exposed earlier failures.

Final order:

```text
01 Cover
02 Willkommen
03 Orientierung
04 Reiseplanung
05 Bergen
06 Fotografie
07 Kultur & Geschichte
08 Kulinarik & Lokal
09 Stavanger
10 Geiranger
11 Wandern & Natur
12 Licht
13 Wetter
14 Fotografie-Workshop
15 Erinnerungen / Notizen
16 Die Reise bleibt
```

User validation confirmed:

- all 16 pages present;
- order correct;
- exact A5;
- no accidental blanks;
- no duplicates/missing pages;
- Notes page corrected;
- overall visual fidelity acceptable;
- remaining known Studio layout findings are pre-existing/non-PoC regressions;
- one additional layout finding became visible only because the PDF proof provides a larger/physical inspection surface;
- state restoration and success reporting correct.

## Final Decision

PoC 001 is complete and accepted.

Future work must build on this renderer/orchestration/assembly architecture rather than reopen it as another PDF-renderer experiment.

Publisher integration remains a later, separate contract/production step.
