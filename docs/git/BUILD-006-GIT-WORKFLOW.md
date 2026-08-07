# Build 006 – Git Workflow

## Apply the Drop-in

Use the packaged `APPLY-DROPIN.md`. The approved mechanism is `rsync`; Finder folder replacement is not used for repository Drop-ins.

## Branch

```bash
git switch main
git pull --ff-only
git switch -c feature/build-006-editorial-workspace-refinement
```

If development already continues on an approved feature branch, do not create a duplicate branch merely to match this example.

## Validate

```bash
pnpm check
pnpm test
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
pnpm tauri dev
```

## Inspect

```bash
git status --short
git diff --check
git diff
```

## Commit

```bash
git add \
  package.json \
  src src-tauri \
  README.md docs \
  BUILD-006-SHA256SUMS.txt

git status --short
git commit -m "feat(studio): refine the editorial workspace experience"
```

## Push

```bash
git push -u origin feature/build-006-editorial-workspace-refinement
```

## Commit title

`feat(studio): refine the editorial workspace experience`
