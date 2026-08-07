# Build 007 – Git Workflow

## Apply the Drop-in

Follow the packaged `APPLY-DROPIN.md`. Build 007 uses the simplified Drop-in root layout without a `payload/` directory.

## Branch

The current approved thematic branch is:

```bash
git switch feature/editorial-workspace
```

If the branch does not yet exist locally, create it from the approved baseline rather than creating a build-number branch.

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
git add package.json src src-tauri README.md docs BUILD-007-SHA256SUMS.txt
git commit -m "feat(studio): balance the editorial header"
```

## Push

```bash
git push -u origin feature/editorial-workspace
```

## Commit title

`feat(studio): balance the editorial header`
