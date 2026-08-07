# Build 005 – Git Workflow

## Branch

```bash
git switch main
git pull
git switch -c feature/build-005-editorial-grammar-foundation
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
  package.json pnpm-lock.yaml \
  src src-tauri \
  examples/Norway-Sample.nls/project.json \
  README.md docs

git status --short
git commit -m "feat(studio): introduce editorial grammar foundation"
```

## Push

```bash
git push -u origin feature/build-005-editorial-grammar-foundation
```

## Commit title

`feat(studio): introduce editorial grammar foundation`
