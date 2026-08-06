# Repository Initialization

## Copy into the repository

Extract this package into the root of the empty `northern-lines-studio`
repository.

## Verify

```bash
git status --short
find . -maxdepth 3 -type f | sort
```

Expected files:

```text
.gitignore
README.md
INITIALIZATION.md
docs/ARCHITECTURE.md
docs/SCOPE.md
docs/VISION.md
```

## Initial Commit

```bash
git add README.md .gitignore INITIALIZATION.md docs
git commit -m "chore: initialize Northern Lines Studio project foundation"
git push
```

## Important

This package establishes documentation and repository structure only.

Do not start product implementation before the dedicated discovery and
architecture phase has been approved.
