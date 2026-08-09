# Build 019 – Git Workflow

## Branch

```bash
git switch -c feature/journey-planning-foundation
```

## Gates

```bash
pnpm consistency
pnpm check
pnpm test
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
git diff --check
```

## Commit

```bash
git add .
git commit -m "feat(studio): introduce journey planning foundation"
git push -u origin feature/journey-planning-foundation
```
