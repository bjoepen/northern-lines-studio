# APPLY-DROPIN · Northern Lines Studio

Diese Datei ist die **generische** Drop-in-Anleitung für Northern Lines Studio.
Build-spezifische Drop-ins können zusätzliche Schritte und eigene Consistency Gates enthalten; diese haben für den jeweiligen Build Vorrang.

## 1. Repository vorbereiten

```bash
cd ~/Projekte/northern-lines-studio
git switch main
git pull --ff-only origin main
```

Für einen neuen Build anschließend einen eigenen Branch anlegen, zum Beispiel:

```bash
git switch -c build/NNN-kurzer-name
```

## 2. Drop-in prüfen

Vor dem Überschreiben immer zuerst einen Dry Run ausführen:

```bash
rsync -avn \
  ~/Downloads/<DROPIN-ORDNER>/ \
  ~/Projekte/northern-lines-studio/
```

Prüfe die Ausgabe. `.git/` darf niemals Bestandteil eines Drop-ins sein oder überschrieben werden.

## 3. Drop-in anwenden

```bash
rsync -av \
  ~/Downloads/<DROPIN-ORDNER>/ \
  ~/Projekte/northern-lines-studio/
```

Falls der Build eine eigene `APPLY-DROPIN.md`, ein Apply-Script oder ein build-spezifisches Gate mitliefert, diese Anweisungen zusätzlich bzw. vorrangig befolgen.

## 4. Build-spezifisches Gate

Beispiel:

```bash
pnpm consistency:build-NNN
```

oder den im Drop-in dokumentierten `node scripts/check-...`-Aufruf verwenden.

## 5. Canonical Quality Gates

```bash
pnpm check
pnpm test
pnpm consistency
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
cargo check --manifest-path src-tauri/Cargo.toml
git diff --check
```

Bei Änderungen an PDF-, PDF/A- oder Production-Host-Code zusätzlich die dafür vorgesehenen scoped Consistency Gates ausführen.

## 6. Scope prüfen

```bash
git status --short
git diff --stat
git diff --check
```

Nur der freigegebene Build-Scope darf im Diff erscheinen. Temporäre Apply-Helper vor dem Commit entfernen, sofern die build-spezifische Anleitung nichts anderes vorgibt.

## 7. Real-World-Test

Nach den technischen Gates die betroffene Funktion in der installierten macOS-App prüfen:

```bash
./scripts/install-macos-app.sh
```

Danach die konkrete Reise bzw. Referenzseite im Studio öffnen und gegen den freigegebenen Stand testen.

## 8. Commit und Push

Nach PASS:

```bash
git add <freigegebene-dateien>
git diff --cached --check
git diff --cached --stat
git commit -m "<commit message>"
git push --set-upstream origin <branch-name>
```

Anschließend Pull Request gegen `main` erstellen und erst nach Review/Quality Gate mergen.

## Verbindliche Regel

> **Drop-ins verändern genau den genehmigten Scope. Sie etablieren weder einen zweiten Renderer noch eine zweite Layout- oder World-Semantik.**

Studio bleibt Eigentümer der Seite; Publisher bzw. Production-Code besitzt ausschließlich den Production Job.
