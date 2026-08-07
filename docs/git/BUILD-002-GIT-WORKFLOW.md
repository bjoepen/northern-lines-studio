# Build 002 – Git Workflow

## Empfohlener Branch

```bash
git switch main
git pull
git switch -c feature/build-002-editorial-workspace
```

## Dateien übernehmen

Den Build-002-Drop-in über das lokale Repository legen. Bereits vorhandene Philosophie-Dokumente wie `docs/000-NORTHERN-LINES.md` bleiben unverändert.

## Prüfen

```bash
git status --short
git diff --check
pnpm check
pnpm test
cd src-tauri && cargo test && cd ..
```

Danach den vollständigen App-Smoke-Test mit:

```bash
pnpm tauri dev
```

## Commit

```bash
git add package.json src src-tauri examples docs README.md
git commit -m "feat(studio): introduce the Fjord editorial workspace"
```

## Push

```bash
git push -u origin feature/build-002-editorial-workspace
```

Nicht nach `main` mergen, bevor der Build gemeinsam visuell und technisch abgenommen wurde.
