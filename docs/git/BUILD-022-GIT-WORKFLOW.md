# Build 022 Final – Git Workflow

## Branch

```bash
cd ~/Projekte/northern-lines-studio
git switch -c fix/build-022-image-composition
```

## After applying the Fix Drop-in

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
git commit -m "fix(studio): finalize build 022 image composition"
git push -u origin fix/build-022-image-composition
```

After review and real-world validation, merge back to `main` according to the normal repository workflow.

## Final regression fix branch

For the internal travel-opening regression discovered during Build-022 final validation:

```bash
git switch main
git pull --ff-only
git switch -c fix/build-022-internal-travel-opening
```

After applying the Drop-in, run all Build-022 gates and the seven opening regression scenarios documented in `docs/validation/BUILD-022-VALIDATION.md` before commit/merge.

Suggested commit:

```bash
git add .
git commit -m "fix(studio): restore internal nls travel opening in build 022"
```
