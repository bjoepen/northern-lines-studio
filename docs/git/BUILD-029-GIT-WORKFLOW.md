# Build 029 — Git Workflow

```bash
cd ~/Projekte/northern-lines-studio
git status
git switch -c feature/build-029-culture-history-experience
```

After applying the Drop-in and validating:

```bash
git add -A
git diff --cached --check
git commit -m "feat: add culture and history experience"
git push -u origin feature/build-029-culture-history-experience
```

Merge according to the repository's normal GitHub workflow after the real-world test is PASS.
