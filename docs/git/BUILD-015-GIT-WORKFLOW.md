# Build 015 – Git Workflow

## Branch
```bash
git switch -c feature/journey-route-foundation
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
git commit -m "feat(studio): introduce journey route foundation"
git push -u origin feature/journey-route-foundation
```
