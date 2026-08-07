# Build 004 – Validation and Definition of Done

## Automated checks
Run from repository root:

```bash
pnpm check
pnpm test
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
```

Then start the real desktop app:

```bash
pnpm tauri dev
```

## World Library checks
Verify:
- `fjord` loads as Reference World 001;
- Papageientaucher appears as Editorial Companion;
- Design Language reads `Northern · Calm · Image-led`;
- nine grammars are available;
- an unknown world ID is rejected instead of silently falling back.

## Responsive preview real-world test
With `examples/Norway-Sample.nls` open:

1. start at the normal window size;
2. make the window wider;
3. make the window taller;
4. maximize the window;
5. restore it;
6. resize it toward the configured minimum.

Expected result:
- the A5 page grows and shrinks smoothly;
- its aspect ratio never changes;
- it remains centered;
- it keeps breathing room around itself;
- sidebar and inspector remain readable;
- no clipping or horizontal distortion appears;
- the page stops growing at the configured maximum scale.

## Migration checks
Open a Build-003 `.nls` 0.2.0 sample copy and verify:
- it opens successfully;
- the UI reports migration from 0.2.0;
- Fjord resolves from the Studio World Library;
- the source file is unchanged.

If a Build-002 `.nls` 0.1.0 sample is available, repeat the same check for 0.1.0.

## Repository hygiene
Before commit:

```bash
git status --short
git diff --check
git status --ignored
```

Do not commit `.build/`, `.vscode/settings.json`, `node_modules/`, `dist/`, `src-tauri/target/`, generated Tauri artifacts or Finder metadata.

`src-tauri/Cargo.lock` remains committed because Studio is an application and requires reproducible Rust dependency resolution.

## Definition of Done
- [ ] `pnpm check` green
- [ ] `pnpm test` green
- [ ] `pnpm build` green
- [ ] Rust tests green
- [ ] Tauri smoke test green
- [ ] Norway sample opens
- [ ] responsive preview verified at normal, maximized and minimum-ish window sizes
- [ ] Fjord resolves from World Library
- [ ] legacy project migration verified
- [ ] repository clean
