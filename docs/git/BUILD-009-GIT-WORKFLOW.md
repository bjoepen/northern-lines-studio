# Build 009 Git Workflow

Recommended branch:

```bash
git switch feature/editorial-workspace
```

Before applying the Drop-in:

```bash
git status --short
```

After applying and validating:

```bash
git status --short
git diff --check
pnpm check
pnpm test
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
```

Commit:

```bash
git add .
git commit -m "feat(studio): establish companion collection foundation"
git push origin feature/editorial-workspace
```
