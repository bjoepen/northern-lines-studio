# Build 024 — Capacity Protection Git Workflow

```bash
git switch main
git pull --ff-only
git switch -c build/024-extension-capacity-protection
pnpm consistency
pnpm check
pnpm test
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
git diff --check
git add .
git commit -m "fix(studio): protect extension capacity and safe zones"
git push -u origin build/024-extension-capacity-protection
```
