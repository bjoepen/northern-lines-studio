# Build 023 – Git Workflow

## Branch

```bash
cd ~/Projekte/northern-lines-studio
git switch -c feature/destination-composition-refinement
```

## Gates

```bash
git status
git diff --stat
git diff --check
pnpm consistency
pnpm check
pnpm test
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
```

## Commit

```bash
git add -A
git commit -m "feat(studio): refine destination composition in build 023"
git push -u origin feature/destination-composition-refinement
```
