# Build 021 – Git Workflow

## Branch

```bash
cd ~/Projekte/northern-lines-studio
git switch main
git pull --ff-only
git switch -c feature/layout-resilience-content-capacity
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

## Review

```bash
git status
git diff --stat
git diff
```

Danach den Real-World-Test aus `docs/validation/BUILD-021-VALIDATION.md` durchführen.

## Commit

```bash
git add .
git commit -m "feat(studio): add build 021 layout resilience foundation"
git push -u origin feature/layout-resilience-content-capacity
```

## Merge after validation

```bash
git switch main
git pull --ff-only
git merge --no-ff feature/layout-resilience-content-capacity
git push origin main
```
