# Build 025C · Git Workflow

```bash
git switch -c build/025c-ostsee-expression-fix
pnpm consistency
pnpm check
pnpm test
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
git diff --check
git status
git add .
git commit -m "fix: refine Ostsee world expression and companion"
git push -u origin build/025c-ostsee-expression-fix
```
