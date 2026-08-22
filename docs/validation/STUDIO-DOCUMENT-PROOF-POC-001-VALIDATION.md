# Studio Document Proof PoC 001 Validation

## Automated Coverage

Frontend/Vitest coverage:

- native single-page proof command boundary remains intact;
- document proof staging command boundary;
- document proof assembly command boundary;
- document proof cleanup command boundary;
- actual Studio `pageManifest` order is preserved;
- variable page counts are supported;
- deterministic staged filenames are used;
- originally active Studio page can be restored.

Rust coverage:

- one staged A5 page assembles to a one-page document;
- multi-page order and decoded content stream hashes are preserved;
- variable page count is not fixed;
- invalid staged page fails the whole document proof;
- no final output remains for a failed document proof;
- final document validates exact A5 on every page;
- manifest schema and page entries match the final document;
- existing single-page completion, PageBox and content-stream tests remain active.

## Scoped Consistency Gate

PoC 001 adds:

```bash
node scripts/check-studio-document-proof-poc-001-consistency.mjs
```

The gate checks, statically where practical:

- accepted single-page renderer reuse;
- serial pageManifest orchestration;
- readiness waits for page, fonts and images;
- deterministic staging filenames;
- Manifest v1 schema;
- final validation;
- content-stream integrity checks;
- atomic temp-output replacement;
- no second renderer dependency;
- no fit/scale tokens;
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
