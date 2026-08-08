# Build 013 – Git Workflow

Empfohlener Branch:
```bash
git switch main
git pull
git switch -c feature/journey-beginning-foundation
```

Nach Drop-in und erfolgreicher Validierung:
```bash
git status
git diff --check
git add -A
git commit -m "feat(studio): introduce journey beginning foundation"
git push -u origin feature/journey-beginning-foundation
```
