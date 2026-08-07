# Build 004 – Git Workflow

## Recommended branch

```bash
git switch main
git pull
git switch -c feature/build-004-reference-world-foundation
```

If Build 004 is already being applied on an existing feature branch, do not create a second branch solely to match this example.

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
git commit -m "feat(studio): introduce the Fjord reference world"
```

## Push

```bash
git push -u origin feature/build-004-reference-world-foundation
```

## Commit title

`feat(studio): introduce the Fjord reference world`
