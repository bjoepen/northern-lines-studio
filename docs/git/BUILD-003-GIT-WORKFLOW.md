# Build 003 – Git Workflow

## Before applying the drop-in

```bash
git status --short
git branch --show-current
git pull --ff-only
```

Use a dedicated build branch if not already present:

```bash
git switch -c feature/build-003-journey-project-model
```

## Apply

Extract the Build-003 drop-in at the repository root.

Then inspect:

```bash
git status --short
git diff --check
git diff
```

## Validate

```bash
pnpm check
pnpm test
pnpm build

cd src-tauri
cargo fmt --check
cargo test
cargo clippy -- -D warnings
cd ..

pnpm tauri dev
```

## Commit

```bash
git add \
  package.json \
  src-tauri \
  src \
  examples/Norway-Sample.nls \
  docs/adr/ADR-003-JOURNEY-PROJECT-MODEL.md \
  docs/ecr/ECR-002-JOURNEY-PROJECT-MODEL.md \
  docs/builds/BUILD-003.md \
  docs/builds/BUILD-003-RELEASE-NOTES.md \
  docs/validation/BUILD-003-VALIDATION.md \
  docs/git/BUILD-003-GIT-WORKFLOW.md

git commit -m "feat(studio): introduce the journey project model"
```

## Push

```bash
git push -u origin feature/build-003-journey-project-model
```

## Commit convention

Recommended authoritative Build-003 commit:

`feat(studio): introduce the journey project model`
