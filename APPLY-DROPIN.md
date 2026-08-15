# APPLY-DROPIN · Build 030 Geometric Content Fit False-Positive Fix

Dieser Drop-in setzt auf dem **Build 030 Capacity Protection Regression Fix** auf.

## 1 · Branch anlegen

```bash
cd ~/Projekte/northern-lines-studio
git switch -c fix/build-030-geometric-content-fit
```

## 2 · Dry Run

Entpacke den Drop-in nach `~/Downloads/Northern-Lines-Studio-Build-030-Geometric-Content-Fit-Fix-DropIn/` und prüfe zuerst:

```bash
rsync -avn ~/Downloads/Northern-Lines-Studio-Build-030-Geometric-Content-Fit-Fix-DropIn/ ~/Projekte/northern-lines-studio/
```

Der Dry Run darf nur die in diesem Fix enthaltenen Dateien zeigen.

## 3 · Apply

```bash
rsync -av ~/Downloads/Northern-Lines-Studio-Build-030-Geometric-Content-Fit-Fix-DropIn/ ~/Projekte/northern-lines-studio/
```

## 4 · Consistency Gate

```bash
cd ~/Projekte/northern-lines-studio
npm run consistency
```

Erwartet unter anderem:

```text
Capacity Protection Regression Gate: PASS
Geometric Content Fit Regression Gate: PASS
```

Alle `PASS`-Statuswörter müssen grün dargestellt werden.

## 5 · Vollständige Gates

```bash
pnpm check
pnpm test
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
git diff --check
```

## 6 · macOS-App bauen und installieren

```bash
cd ~/Projekte/northern-lines-studio
./scripts/install-macos-app.sh
```

Das Script baut die Tauri-v2-App und installiert:

```text
/Applications/Northern Lines Studio.app
```

Manueller Build bei Bedarf:

```bash
pnpm tauri build --bundles app
```

## 7 · Real-World-Test · Geiranger

Öffne `Wandern & Natur · Geiranger` mit zwei Routen:

1. `Fosseråsa → Storsæterfossen`
2. `Skagehola → Skageflå → Homlong`

Für Route 02 muss vollständig eingetragen sein:

```text
Sehr steile und teilweise ausgesetzte Abschnitte; Trittsicherheit erforderlich.
```

Erwartung:

- die Seite bleibt renderbar und zeigt **nicht** allein wegen dieses Satzes den Overflow-Hinweis;
- der vollständige Hinweis ist sichtbar;
- Companion und Footer bleiben in ihren Safe-Zonen;
- erst bei tatsächlich nicht mehr passender Geometrie erscheint:
  `Diese Seite kann diesen Inhalt nicht mehr ruhig erzählen.`

## 8 · Commit

```bash
git add .
git commit -m "fix: prevent false positive interest overflow"
```
