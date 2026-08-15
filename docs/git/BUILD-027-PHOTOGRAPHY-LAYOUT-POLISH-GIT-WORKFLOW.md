# Git Workflow · Build 027 Photography Layout Polish

```bash
cd ~/Projekte/northern-lines-studio
git status
git switch main
git pull --ff-only
git switch -c fix/027-photography-layout-polish

# Drop-in anwenden, Gates + Real-World-Test ausführen

git add .
git commit -m "fix: pair photography spots with focal lengths"
git push -u origin fix/027-photography-layout-polish
```
