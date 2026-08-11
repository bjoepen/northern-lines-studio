# Build 025A – Git Workflow

Suggested branch:

```bash
git switch main
git pull --ff-only
git switch -c build/025a-css-grammar-consolidation
```

After applying the build:

```bash
pnpm consistency
pnpm check
pnpm test
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
git diff --check
git status
git diff
```

Suggested commit:

```bash
git add .
git commit -m "refactor: consolidate CSS and layout grammar"
git push -u origin build/025a-css-grammar-consolidation
```
