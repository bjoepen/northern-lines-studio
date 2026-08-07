# Build 006 – Drop-in anwenden

Dieser Drop-in wird **nicht** per Finder-Ordnerersetzung eingespielt. Finder darf nur zum Entpacken des ZIPs verwendet werden.

## 1. Repository prüfen

```bash
cd ~/Projekte/northern-lines-studio
git status --short
```

Der Arbeitsstand sollte sauber sein oder bewusst bekannte lokale Änderungen enthalten.

## 2. Dry Run

Passe `<DROPIN>` an den entpackten Ordner an:

```bash
rsync -avn --exclude='.DS_Store' \
  <DROPIN>/payload/ \
  ~/Projekte/northern-lines-studio/
```

Prüfe die angezeigten Dateien. Es werden bestehende Verzeichnisse **zusammengeführt**, nicht komplett ersetzt.

## 3. Drop-in anwenden

```bash
rsync -av --exclude='.DS_Store' \
  <DROPIN>/payload/ \
  ~/Projekte/northern-lines-studio/
```

## 4. Ergebnis prüfen

```bash
cd ~/Projekte/northern-lines-studio
git status --short
git diff --check
git diff
```

## 5. Build 006 validieren

```bash
pnpm check
pnpm test
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
pnpm tauri dev
```

Beim Real-World-Test besonders prüfen:

- die untere Statuszeile ist nur noch etwa 26 px hoch;
- die A5-Seite wächst im maximierten Fenster sichtbar mit;
- das A5-Seitenverhältnis bleibt unverändert;
- Seitenwechsel blenden nur dezent ein;
- Inspector und Sidebar bleiben ruhig;
- kein neues DTP-Bedienelement ist hinzugekommen.

## 6. Commit

```bash
git add \
  package.json \
  src src-tauri \
  README.md docs \
  BUILD-006-SHA256SUMS.txt

git status --short
git commit -m "feat(studio): refine the editorial workspace experience"
```

> Northern Lines Drop-in Standard: erst Dry Run, dann `rsync`, danach Validierung und Commit.
