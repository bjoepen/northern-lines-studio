# Build 018 – Git Workflow

## Branch

```bash
git switch -c feature/companion-layout-foundation
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
git commit -m "feat(studio): introduce companion layout foundation"
git push -u origin feature/companion-layout-foundation
```
