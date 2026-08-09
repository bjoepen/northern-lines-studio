# Northern Lines Studio – Upgrade Build 019 → Build 020

Dieses Drop-in aktualisiert einen **validierten Build 019** auf Build 020, ohne das bestehende `.git/`-Verzeichnis oder unveränderte Repository-Dateien anzutasten.

## 1. Voraussetzung

Vor dem Upgrade sollte das Repository auf Build 019 stehen und `git status` sauber sein.

```bash
git status
```

Wenn noch eigene, nicht committete Änderungen vorhanden sind, diese zuerst committen oder sichern.

## 2. Drop-in entpacken

Beispiel: Das ZIP liegt in `~/Downloads`.

```bash
cd ~/Downloads
unzip Northern-Lines-Studio-Build-020-Destination-Profile-Layout-Variants-Drop-in.zip
```

Danach existiert:

```text
~/Downloads/Northern-Lines-Studio-Build-020-Destination-Profile-Layout-Variants-Drop-in/
```

## 3. Pfad zum bestehenden Repository setzen

Passe nur diese Zeile an dein lokales Repository an:

```bash
REPO="$HOME/Developer/Northern-Lines-Studio"
DROPIN="$HOME/Downloads/Northern-Lines-Studio-Build-020-Destination-Profile-Layout-Variants-Drop-in"
```

## 4. Dry Run mit rsync

**Wichtig:** Beim Drop-in wird bewusst **kein `--delete`** verwendet. Das Paket enthält nur neue und geänderte Dateien; Build 020 löscht gegenüber Build 019 keine Dateien.

```bash
rsync -avhn \
  --exclude='.git/' \
  --exclude='UPGRADE-BUILD-019-TO-020.md' \
  --exclude='DROP-IN-MANIFEST.md' \
  --exclude='DROP-IN-SHA256SUMS.txt' \
  "$DROPIN/" \
  "$REPO/"
```

Prüfe die Ausgabe. Sie sollte ausschließlich Dateien aus dem Build-020-Manifest betreffen.

## 5. Upgrade durchführen

Wenn der Dry Run plausibel aussieht:

```bash
rsync -avh \
  --exclude='.git/' \
  --exclude='UPGRADE-BUILD-019-TO-020.md' \
  --exclude='DROP-IN-MANIFEST.md' \
  --exclude='DROP-IN-SHA256SUMS.txt' \
  "$DROPIN/" \
  "$REPO/"
```

## 6. Änderungen kontrollieren

```bash
cd "$REPO"
git status
git diff --stat
git diff --check
```

Build 020 enthält gegenüber Build 019 **12 neue und 13 geänderte Dateien, keine Löschungen**.

## 7. Dependencies / Lockfile

Da `package.json`, `pnpm-lock.yaml` jedoch **nicht** verändert wurde, reicht in der Regel die vorhandene Installation. Für eine reproduzierbare Validierung kann dennoch ausgeführt werden:

```bash
pnpm install --frozen-lockfile
```

## 8. Build-020-Validierung

```bash
pnpm consistency
pnpm check
pnpm test
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
git diff --check
```

Alle Gates müssen grün sein, bevor Build 020 als validiert gilt.

## 9. Manuelle UX-Prüfung

1. Northern Lines Studio starten.
2. Ein bestehendes Build-019-Projekt öffnen.
3. Eine Destination auswählen, z. B. Bergen.
4. Destination-Daten ergänzen oder ändern.
5. Zwischen `Hero Banner`, `Image Left` und `Image Right` wechseln.
6. Prüfen, dass beim Layoutwechsel kein redaktioneller Inhalt verloren geht.
7. Projekt speichern, schließen und erneut öffnen.
8. Prüfen, dass Inhalte und Layoutvariante erhalten bleiben.

## 10. Git-Commit nach erfolgreicher Validierung

Empfohlener Commit:

```bash
git add -A
git commit -m "feat(studio): add destination profiles and layout variants for build 020"
git push
```

Weitere Details stehen in `docs/git/BUILD-020-GIT-WORKFLOW.md` und `docs/validation/BUILD-020-VALIDATION.md`.

## Full Repo vs. Drop-in

- **Full Repo:** autoritativer vollständiger Build. Beim Ersetzen bleibt nur das bestehende `.git/`-Verzeichnis erhalten.
- **Drop-in:** Upgrade von Build 019 auf Build 020. Es werden nur die tatsächlich neuen/geänderten Dateien kopiert.

Für normale Build-zu-Build-Upgrades ist das Drop-in die bequemere Variante; das Full Repo bleibt die Referenzversion.
