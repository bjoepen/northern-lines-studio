# Studio Document Proof PoC 001 Validation

## Automated Coverage

Frontend/Vitest coverage:

- native single-page proof command boundary remains intact;
- document proof staging command boundary;
- document proof assembly command boundary;
- document proof cleanup command boundary;
- Document Proof uses canonical Studio publication order instead of raw manifest insertion;
- Orientation and footer page numbers share that same publication sequence;
- same page IDs with different manifest insertion order still produce publication order;
- variable page counts are supported;
- deterministic staged filenames are used;
- originally active Studio page can be restored.
- stale DOM identity is rejected before capture;
- matching selected/rendered page identity is accepted;
- the capture sequence requires Svelte commit and browser layout frame before capture;
- transitional opacity/running page animation is rejected;
- current-page image readiness remains scoped to the identified page;
- original page restoration is covered for readiness failure.
- Notes writing surfaces use proof-stable explicit light gradient stops;
- Photography Workshop proof CSS remains present and unchanged by the Notes fix.

Rust coverage:

- one staged A5 page assembles to a one-page document;
- multi-page order and decoded content stream hashes are preserved;
- variable page count is not fixed;
- invalid staged page fails the whole document proof;
- structurally empty staged A5 captures fail before assembly;
- non-text drawing content remains valid;
- no final output remains for a failed document proof;
- final document validates exact A5 on every page;
- manifest schema, page entries, stream counts, decoded byte counts, content hashes and resource counts match the final document;
- existing single-page completion, PageBox and content-stream tests remain active.

## Real-World Failure Regression

The first installed-app Document Proof test used a real 16-page Travelbook. The final PDF had the expected page count and the assembly produced a readable multi-page PDF, but most pages were visually blank. A small number of pages contained content and those captures appeared washed out or had the wrong color appearance.

This is classified as a frontend orchestration/readiness failure, not a WKWebView rendering failure and not an assembly failure. Blank staged A5 pages could pass the previous checks because page-box validation only proved physical size. The assembler then correctly preserved those already bad staged pages.

Root cause:

- `.a5-page` had no stable rendered page identity;
- `waitForResolvedStudioPage()` checked `selectedPage.id` but accepted any `.a5-page`;
- page images were queried globally from `.a5-page img`, not from the requested page root;
- the page root uses Svelte `in:fade={{ duration: 190 }}`, so a newly selected page can exist with opacity below `1`;
- the document loop kept proof mode enabled while switching pages, then captured after a single `tick()`.

The old sequence was:

```text
enable proof mode once
-> select page
-> await tick
-> selectedPage.id matches requested page
-> any .a5-page exists
-> global .a5-page images complete
-> capture
```

The corrected sequence is:

```text
select page
-> await Svelte DOM commit
-> await browser layout frame
-> selectedPage.id == requested page
-> .a5-page[data-studio-page-id] == requested page
-> fonts ready
-> current page images ready
-> page visually stable
-> enable proof mode
-> await Svelte DOM commit
-> await browser layout frame
-> identity and stability still true under proof CSS
-> capture
-> leave proof mode before the next page switch
```

This fixes lifecycle readiness rather than masking the issue with a delay. `requestAnimationFrame` is used only as a browser layout/paint boundary after Svelte `tick()`, not as elapsed-time synchronization. While `pdfProofStatus === 'rendering'`, the Svelte page fade duration is `0`, and proof CSS forces the `.a5-page` root to `opacity: 1` and `filter: none`; this prevents washed-out transition captures without changing Studio geometry, World typography or child-level World color styling.

## Empty-Capture Rejection

Each staged single-page PDF is still required to validate as exact A5 before assembly. PoC 001 now additionally extracts decoded page content evidence before importing the page:

- content stream count;
- decoded content byte total;
- decoded content hashes;
- page resource count.

`PDF_DOCUMENT_PROOF_EMPTY_CAPTURE` is raised when a staged page has valid A5 boxes but no decoded page content. This rejects accidental blank captures without requiring text, so image-dominant or vector-drawing pages remain valid.

## Ordering Finding

The newest real-world Travelbook proof showed that iterating raw `project.pageManifest` was wrong. The generated PDF followed manifest/insertion order for later page classes, placing destination-interest pages after memories instead of directly after their destination. Studio itself already knew the correct order: Sidebar, Orientation and footer page numbers are derived from `groupPages(project.pageManifest, routeStageIds)` through `travelbookPageNumber()`.

Correction:

```text
project.pageManifest
-> publicationOrderedPages(pageManifest, routeStageIds)
-> Document Proof staged render order
```

`publicationOrderedPages()` is a small named wrapper around the existing `groupPages()` order. This avoids a new order table, avoids a page-type hardcoded export sort and keeps Document Proof aligned with the current Studio book semantics.

Regression coverage now verifies the observed mixed 16-page style order:

```text
Cover
Willkommen
Orientierung
Reiseplanung
Bergen
Fotografie
Kultur & Geschichte
Kulinarik & Lokal
Stavanger
Geiranger
Wandern & Natur
Licht
Wetter
Fotografie-Workshop
Erinnerungen
Die Reise bleibt
```

## Notes/Memory Visual Finding

The Notes/Memory defect was reproduced by the user in both single-page Notes proof and the assembled Travelbook proof. Therefore it is not caused by assembly, object import, page ordering or multi-page validation.

CSS root cause:

- `.notes-main`, `.notes-side > section`, `.notes-lines`, `.notes-mini-lines` and `.notes-dot-grid` render the writing areas;
- the large writing line/grid children used gradients whose color stops mixed `var(--world-accent)` with `transparent`;
- WKWebView PDF output rendered those transparent mixed gradient surfaces as dark/black writing areas;
- the accepted Photography Workshop proof did not exercise large transparent `color-mix` gradient writing fields.

Correction:

- Notes surfaces now define explicit light `--notes-surface`, `--notes-line`, `--notes-mini-line` and `--notes-dot` variables;
- gradient gaps use `var(--notes-surface)`, not `transparent`;
- Baltic keeps its own warm-paper/amber variables;
- no global white-background override, opacity hack or renderer change was introduced.

Browser computed-style inspection was attempted in the Codex environment, but no controllable browser was available through the Browser connector. The runtime visual proof remains user-owned.

## Scoped Consistency Gate

PoC 001 adds:

```bash
node scripts/check-studio-document-proof-poc-001-consistency.mjs
```

The gate checks, statically where practical:

- accepted single-page renderer reuse;
- serial canonical publication-order orchestration;
- Orientation/footer/Document Proof order source;
- rendered page identity contract;
- readiness waits for page identity, fonts, current-page images and visual stability;
- no arbitrary sleep synchronization;
- deterministic staging filenames;
- Manifest v1 schema;
- final validation;
- content-stream integrity checks;
- empty-capture validation;
- atomic temp-output replacement;
- no second renderer dependency;
- no fit/scale tokens;
- Notes proof surfaces avoid transparent color-mix gradient stops;
- no Publisher path.

It does not claim runtime visual proof.

## Required Gate Sequence

Run from repository root:

```bash
node scripts/check-studio-document-proof-poc-001-consistency.mjs
node scripts/check-studio-pdf-proof-poc-001-consistency.mjs
pnpm check
pnpm test
pnpm consistency
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
git diff --check
```

## Runtime Evidence

Codex does not mark installed-app evidence as pass.

User validation:

```bash
./scripts/install-macos-app.sh
```

Then export a real Travelbook with the Document Proof action.

Required runtime checks:

- PDF generated immediately;
- Studio reports success;
- actual page count matches Studio;
- page order matches Studio;
- every page validates exact A5;
- no blank accidental pages;
- no washed-out transitional captures;
- no missing or duplicated page;
- no visual re-layout;
- Companion and footer remain correct;
- Studio returns to the originally active page;
- final PDF is readable;
- no false success or false failure message.

Current installed-app status:

```text
macOS installed app   PENDING USER VALIDATION
real PDF generated    PENDING USER VALIDATION
physical A5 validated PENDING USER VALIDATION
visual comparison     PENDING USER VALIDATION
```

## Limitations

This is still a visual editorial proof, not production/prepress export. It does not add bleed, crop marks, imposition, output profiles, printer profiles or Publisher integration.
