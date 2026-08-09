# Build 020 – Final Git Workflow

## Branch

```bash
cd ~/Projekte/northern-lines-studio
git switch main
git pull --ff-only
git switch -c feature/destination-profile-layout-variants-final
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

Danach den Real-World-Test aus `docs/validation/BUILD-020-VALIDATION.md` durchführen.

## Commit

```bash
git add .
git commit -m "feat(studio): finalize build 020 travel language and destination layouts"
git push -u origin feature/destination-profile-layout-variants-final
```

## Merge after validation

```bash
git switch main
git pull --ff-only
git merge --no-ff feature/destination-profile-layout-variants-final
git push origin main
```
