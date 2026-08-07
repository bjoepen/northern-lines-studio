# Build 010 Git Workflow

Suggested branch:

```bash
git switch -c feature/story-authoring
```

After applying the drop-in and validation:

```bash
git status
git diff --check
git add .
git commit -m "feat(studio): introduce semantic story authoring"
git push -u origin feature/story-authoring
```
