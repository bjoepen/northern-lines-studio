# Build 008 Git Workflow

Recommended branch:

```bash
git switch feature/editorial-workspace
```

Before applying the Drop-in:

```bash
git status --short
```

Follow `APPLY-DROPIN.md`, then validate:

```bash
git status --short
git diff --check
pnpm check
pnpm test
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
```

Review the diff and commit:

```bash
git add .
git commit -m "feat(studio): introduce story components foundation"
git push origin feature/editorial-workspace
```

Do not commit `APPLY-DROPIN.md`; the standard rsync command excludes it.
