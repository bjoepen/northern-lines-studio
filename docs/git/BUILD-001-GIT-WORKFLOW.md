# Git-Workflow – Build 001

Das Paket basiert auf dem Branch:

```text
feature/build-001-foundation
```

## Prüfung

```bash
git status
git diff --stat
git diff
```

## Commit

```bash
git add .
git commit -m "feat(studio): rebuild Build 001 with Tauri and Svelte"
```

## Push

```bash
git push -u origin feature/build-001-foundation
```

## Nach erfolgreicher Validierung

```bash
git switch main
git pull --ff-only
git merge --no-ff feature/build-001-foundation
git push origin main
```

Optionaler Tag:

```bash
git tag -a studio-build-001 -m "Northern Lines Studio Build 001"
git push origin studio-build-001
```
