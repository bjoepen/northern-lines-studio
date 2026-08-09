# Build 017 – Git Workflow

## Branch
```bash
git switch -c feature/editorial-world-layout-foundation
```

## Gates
```bash
pnpm check
pnpm test
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
git diff --check
```

## Commit
```bash
git add .
git commit -m "feat(studio): introduce editorial world layout foundation"
git push -u origin feature/editorial-world-layout-foundation
```
