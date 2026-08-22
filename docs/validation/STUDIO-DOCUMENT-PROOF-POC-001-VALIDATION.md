# Studio Document Proof PoC 001 Validation

## Status

```text
PoC 001                         PASS
macOS installed app            PASS
real 16-page Travelbook proof  PASS
exact A5 on all pages          PASS
publication order              PASS
visual comparison              PASS
state restoration              PASS
```

The PoC is closed successfully. The remaining known Studio layout findings were already present before this PoC and are not regressions caused by Document Proof. One additional layout finding became visible only in the PDF proof because the Studio canvas view was too small to expose it clearly; that finding is tracked separately from this PoC.

## Accepted Architecture

Document Proof extends the accepted single-page proof without introducing a second renderer:

```text
Studio publication order
→ select one resolved Studio page
→ readiness / DOM identity gate
→ accepted single-page WKWebView PDF proof
→ metadata-only exact-A5 PageBox normalization
→ staged validated page PDFs
→ content-preserving PDF assembly
→ final multi-page validation
```

Binding properties:

- Studio remains the sole layout and geometry authority.
- Golden Build 040 remains unchanged.
- Native `WKWebView` remains the page renderer.
- PageBox normalization changes metadata only and preserves top/left anchoring.
- Document Proof renders pages serially.
- No second WebView, browser runtime, renderer, layout engine, fit-to-page, scaling, or reflow is used.
- Publisher and Windows are outside this PoC.

## Automated Coverage

Frontend/Vitest coverage includes:

- canonical Studio publication ordering;
- Orientation/footer/Document Proof order consistency;
- variable page counts;
- rendered DOM page identity;
- Svelte commit + browser layout-frame readiness;
- current-page image readiness;
- transitional opacity/animation rejection;
- original-page restoration after success/failure;
- Notes proof-safe CSS;
- Photography Workshop non-regression.

Rust coverage includes:

- one-page and multi-page assembly;
- order preservation;
- exact A5 validation on every final page;
- decoded content-stream integrity;
- invalid-page rejection;
- structurally empty-capture rejection;
- non-text drawing content acceptance;
- atomic final-output behavior;
- manifest/final-document consistency.

Latest reported automated gate set before runtime validation:

```text
node scripts/check-studio-document-proof-poc-001-consistency.mjs PASS
node scripts/check-studio-pdf-proof-poc-001-consistency.mjs      PASS
pnpm check                                                       PASS
pnpm test                                                        PASS · 115 tests
pnpm consistency                                                 PASS
pnpm build                                                       PASS
cargo test --manifest-path src-tauri/Cargo.toml                  PASS · 46 tests
git diff --check                                                 PASS
```

## Real-World Regression History

### Failure 1 — blank / washed-out pages

The first installed-app 16-page Travelbook proof produced mostly blank pages and a small number of washed-out captures.

Root cause:

- `.a5-page` had no stable rendered-page identity;
- readiness could accept stale DOM after `selectedPage` changed;
- image readiness was scoped too broadly;
- Svelte `in:fade` allowed capture during temporary opacity.

Correction:

```text
select requested page
→ await Svelte DOM commit
→ await one browser layout frame
→ require selectedPage.id == requested page
→ require .a5-page[data-studio-page-id] == requested page
→ fonts ready
→ current-page images ready
→ visual stability
→ enter proof mode
→ commit + layout frame
→ re-check identity/stability
→ capture
```

No arbitrary sleeps were introduced. Structurally empty staged PDFs are now rejected with the document-proof empty-capture invariant.

### Failure 2 — wrong publication order

The next real-world proof showed that raw `project.pageManifest` insertion order is not publication order.

Canonical Studio order already existed through `groupPages(...routeStageIds)` and was used by visible Studio book semantics.

Correction:

```text
publicationOrderedPages(pageManifest, routeStageIds)
```

is now the named shared source for Document Proof publication order.

Binding invariant:

```text
Studio Orientation order
== Studio footer/page-number order
== Document Proof order
```

### Failure 3 — Notes/Memory writing surfaces

The Notes/Memory page showed large dark writing fields in both single-page and multi-page PDF proof.

Because the single-page Notes proof reproduced the same issue, assembly was excluded as root cause.

Root cause:

- Notes writing fields used large CSS gradients with `color-mix(..., transparent)` and transparent stops;
- the native WKWebView PDF path rendered those transparent mixed gradient surfaces incorrectly.

Correction:

- explicit light `--notes-surface` values;
- line/dot colors mix against the explicit surface;
- gradient gaps use the surface instead of `transparent`;
- Baltic retains its own warm-paper/amber variables;
- no global white override, renderer change, or geometry change.

## Final Real-World Evidence

The final installed-app validation used the same real 16-page Travelbook regression project.

Final physical/page order:

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

This matches Studio Orientation and footer page numbers.

Final runtime result:

- 16/16 pages present;
- no accidental blank pages;
- no duplicated pages;
- no missing pages;
- publication order correct;
- every page uses the accepted exact-A5 page boxes;
- World expression, typography, images, Companion, footer and safe zones visually acceptable;
- Notes/Memory page visually corrected;
- single-page Notes proof and Document Proof Notes page are visually equivalent;
- Photography Workshop remains correct;
- Studio reports success without false error;
- original Studio page/state restoration works;
- user visual validation: PASS.

## Manifest / Integrity

The temporary manifest schema remains:

```text
northern-lines.studio.document-proof.v1
```

Per page it records audit evidence including:

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

The final document validator checks page count, exact A5 and staged-vs-final decoded page content hashes in order.

## Scope Boundary

This accepted feature is a **visual editorial PDF proof**.

It does not yet provide:

- production/prepress PDF;
- bleed/crop marks;
- imposition;
- output/printer profiles;
- Publisher integration;
- Windows proof support.

## Final Decision

```text
Studio Document Proof PoC 001 = PASS / ARCHITECTURE ACCEPTED
```

The renderer/assembly architecture established by this PoC is no longer experimental and must not be replaced without a new explicit architecture decision.
