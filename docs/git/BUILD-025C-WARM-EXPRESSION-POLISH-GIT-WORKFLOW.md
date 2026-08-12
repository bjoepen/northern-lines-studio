# Build 025C · Warm Expression Polish · Git Workflow

```bash
git switch main
git pull --ff-only
git switch -c build/025c-warm-expression-polish

pnpm consistency
pnpm check
pnpm test
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
git diff --check

git add .
git commit -m "fix: warm Ostsee editorial expression"
git push -u origin build/025c-warm-expression-polish
```
