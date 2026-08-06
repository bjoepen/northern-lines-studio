# Git workflow: Build 001

The supplied repository already uses:

```text
feature/build-001-foundation
```

## Review

```bash
git status
git diff --stat
git diff
```

## Test on macOS

```bash
swift test
```

## Commit

```bash
git add README.md Package.swift Sources Tests Examples docs .gitignore
git commit -m "feat(studio): add Build 001 project reader and A5 preview"
```

## Push

```bash
git push -u origin feature/build-001-foundation
```

After review, merge the branch into `main` using the repository's normal pull-request workflow.
