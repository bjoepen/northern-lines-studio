# Northern Lines Studio · Build 025B · APPLY-DROPIN

Upgrade: **Build 025A CSS & Grammar Consolidation → Build 025B Ostsee Editorial World PoC**

Build 025B führt die zweite freigegebene Editorial World **Ostsee** ein. Das `.nls`-Format bleibt **0.10.0**; es gibt keine Schema-Migration.

## 1. Branch

```bash
cd ~/Projekte/northern-lines-studio
git switch main
git pull --ff-only
git switch -c build/025b-ostsee-editorial-world-poc
```

## 2. Dry Run

```bash
rsync -avn \
  ~/Downloads/Northern-Lines-Studio-Build-025B-Ostsee-Editorial-World-PoC-DropIn/ \
  ~/Projekte/northern-lines-studio/
```

Prüfe die Liste. Dieses Drop-in löscht keine Dateien.

## 3. Apply

```bash
rsync -av \
  ~/Downloads/Northern-Lines-Studio-Build-025B-Ostsee-Editorial-World-PoC-DropIn/ \
  ~/Projekte/northern-lines-studio/
```

## 4. Consistency Gate

```bash
cd ~/Projekte/northern-lines-studio
pnpm consistency
```

Neu ist zusätzlich:

```text
Editorial World PoC Consistency Gate: PASS
```

`PASS` wird dezent grün ausgegeben. Es werden keine Status-Emojis verwendet.

## 5. Erwarteter PASS

Alle bisherigen Gates müssen weiterhin PASS liefern. Zusätzlich muss der Editorial-World-PoC-Gate PASS sein.

## 6. Full Gates

```bash
pnpm consistency
pnpm check
pnpm test
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
git diff --check
```

## 7. Real-World-Test

Verwende bevorzugt eine bestehende Destination wie Bergen mit Bild und mindestens einer Editorial Extension.

1. Projekt in **Fjord** öffnen und Inhalt kontrollieren.
2. In der linken Reisewelt-Karte **Ostsee** wählen.
3. Prüfen: Typografie, Palette und Extension-Flächen wechseln; der **Fischotter** erscheint als Companion.
4. **Weite · Bild links · Bild rechts** durchschalten. Adaptive Grammar, Ortsnamen-Schutz und Capacity Protection müssen unverändert funktionieren.
5. Projekt schließen und erneut öffnen. **Ostsee** muss erhalten bleiben.
6. Zurück auf **Fjord** wechseln. Destination-Text, IDs, Bilder, Extensions und Seitenwirkung müssen unverändert sein.
7. Einen Overflow-Fall mit langen Extensions prüfen. Die geschützten Zonen bleiben auch in Ostsee hart; Studio zeigt weiterhin: **„Diese Seite kann diesen Inhalt nicht mehr ruhig erzählen.“**

### Stop / Go

**GO:** World-Wechsel bleibt persistent, Content bleibt identisch, Fischotter/Papageientaucher wechseln korrekt, alle Gates sind grün.

**STOP:** World-Wechsel verändert Content, Companion verletzt Safe Zones, Ostsee benötigt Fjord-Sonderlogik oder ein Gate schlägt fehl.

## Git Commit

```bash
git status
git diff --check
git add -A
git commit -m "feat: add Ostsee editorial world PoC"
git push -u origin build/025b-ostsee-editorial-world-poc
```
