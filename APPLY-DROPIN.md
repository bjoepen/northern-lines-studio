# Northern Lines Studio · Build 030 Capacity Protection Regression Fix

Ausgangsstand: **Build 030 · Content Fit & Composition Fix**  
Ziel: Wiederherstellung der bereits freigegebenen Capacity Protection.

## 1. Branch

```bash
cd ~/Projekte/northern-lines-studio
git switch -c fix/build-030-capacity-protection-regression
```

## 2. Dry Run

```bash
rsync -avn ~/Downloads/Northern-Lines-Studio-Build-030-Capacity-Protection-Regression-Fix-DropIn/ ~/Projekte/northern-lines-studio/
```

Erwartung: geändert werden nur die in diesem Drop-in enthaltenen Source-, Gate- und Dokumentationsdateien.

## 3. Apply

```bash
rsync -av ~/Downloads/Northern-Lines-Studio-Build-030-Capacity-Protection-Regression-Fix-DropIn/ ~/Projekte/northern-lines-studio/
```

## 4. Consistency Gate

```bash
cd ~/Projekte/northern-lines-studio
pnpm consistency
```

Erwartung unter anderem:

```text
Content Fit & Composition Consistency Gate: PASS
Capacity Protection Regression Gate: PASS
```

`PASS` muss in der sichtbaren Gate-Ausgabe grün erscheinen.

## 5. Vollständige Gates

```bash
pnpm check
pnpm test
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
git diff --check
```

STOP bei jedem Fehler. Erst bei vollständig grünen Gates fortfahren.

## 6. macOS App bauen und installieren

```bash
cd ~/Projekte/northern-lines-studio
./scripts/install-macos-app.sh
```

Manuell alternativ:

```bash
pnpm tauri build --bundles app
```

Erwartetes Ziel:

```text
/Applications/Northern Lines Studio.app
```

## 7. Real-World-Test · Bergen / Kulinarik & Lokal

Verwende die zwei bereits vorhandenen Empfehlungen:

1. **Skillingsbolle bei Baker Brun**
2. **Bergener Fischmarkt / Mathallen**

Mit den ausführlichen Einordnungen, Probierhinweisen, Besuchshinweisen und Ortsbezügen aus dem Build-030-Test.

### Erwartetes Verhalten

Studio prüft alle für diesen Seitentyp freigegebenen Kompositionen:

- 1/2–1/2
- 1/3–2/3
- 2/3–1/3
- gestapelt
- `comfortable`
- anschließend maximal die feste Interest-Page-Stufe `tight`

Wenn keine Variante vollständig innerhalb der Content-Zone bleibt, muss Studio **nicht weiter quetschen**, sondern anzeigen:

> **Diese Seite kann diesen Inhalt nicht mehr ruhig erzählen.**

Dabei müssen Companion und Footer vollständig in ihren Safe-Zonen bleiben. Kein Text darf geclippt oder außerhalb einer Box bzw. unter den Footer gerendert werden.

## 8. Commit und Push

```bash
git status
git add .
git commit -m "fix: restore capacity protection after composition"
git push -u origin fix/build-030-capacity-protection-regression
```
