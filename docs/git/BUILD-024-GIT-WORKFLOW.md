# Build 024 Git Workflow

```bash
cd ~/Projekte/northern-lines-studio
git switch main
git pull --ff-only
git switch -c build/024-editorial-extension-zones

pnpm consistency
pnpm check
pnpm test
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
git diff --check

git status
git add .
git commit -m "feat: add editorial extension zones foundation"
git push -u origin build/024-editorial-extension-zones
```
