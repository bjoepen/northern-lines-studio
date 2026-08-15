# Build 026 · Git Workflow

```bash
git switch main
git pull --ff-only
git switch -c build/026-destination-interest-pages

pnpm consistency
pnpm check
pnpm test
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
git diff --check

git status
git diff

git add .
git commit -m "feat: add destination interest pages foundation"
git push -u origin build/026-destination-interest-pages
```

After review and real-world validation, merge back to `main` according to the normal Northern Lines Studio release workflow.
