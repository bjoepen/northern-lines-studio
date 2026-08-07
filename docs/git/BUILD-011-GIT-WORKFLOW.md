# Build 011 – Git Workflow

Recommended branch:

```bash
git switch main
git pull --ff-only
git switch -c feature/editorial-story-workspace
```

Apply the Drop-in with the included `APPLY-DROPIN.md`, then run all Build-011 gates.

Review:

```bash
git status --short
git diff --check
git diff
```

Commit:

```bash
git add .
git commit -m "feat(studio): introduce the editorial story workspace"
git push -u origin feature/editorial-story-workspace
```

Merge through the normal pull-request workflow after validation.
