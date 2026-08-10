# Northern Lines Studio – Build 023 Final Polish Fix · APPLY-DROPIN

Ausgangspunkt ist der bereits installierte **Build 023 Final UX / Composition Fix**.

## 1. Branch

```bash
cd ~/Projekte/northern-lines-studio
git switch main
git pull --ff-only
git switch -c fix/build-023-final-polish
```

## 2. Dry Run

```bash
rsync -avn \
  ~/Downloads/Northern-Lines-Studio-Build-023-Final-Polish-Fix-DropIn/ \
  ~/Projekte/northern-lines-studio/
```

Erwartung: nur Build-023-Polish-Dateien werden aktualisiert. Es gibt keine Löschungen.

## 3. Apply

```bash
rsync -av \
  ~/Downloads/Northern-Lines-Studio-Build-023-Final-Polish-Fix-DropIn/ \
  ~/Projekte/northern-lines-studio/
```

`APPLY-DROPIN.md` darf im Repo anschließend entfernt werden, falls du die Anleitung nicht versionieren möchtest.

## 4. Consistency Gate

```bash
pnpm consistency
```

Erwartet:

```text
Journey Planning Consistency Gate: PASS
Destination Profile Consistency Gate: PASS
Layout Resilience Consistency Gate: PASS
Destination Imagery Consistency Gate: PASS
Travel Opening Consistency Gate: PASS
Destination Composition Consistency Gate: PASS
```

## 5. Full Gates

```bash
pnpm check
pnpm test
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
git diff --check
```

Alle Gates müssen grün sein, bevor der Fix übernommen wird.

## 6. Real-World-Test

1. Bergen als Destination öffnen und **Weite** wählen.
2. Das Panorama muss vollständig oberhalb des Titelblocks liegen; `REISEZIEL` darf nicht in die sichtbare Aquarellkante rücken.
3. **Bild links** und **Bild rechts** durchschalten und auf unveränderte Komposition prüfen.
4. Im Inspector unter **Bild des Ortes** prüfen: `Bild links / Bild rechts` ist ruhiger Meta-Status, nicht Zwischenüberschrift.
5. `Bild ersetzen · Entfernen` bleiben dezent funktionsfähig.
6. Bild ersetzen, speichern, Projekt schließen/öffnen und Persistenz kontrollieren.

## Ergebnis

Der Fix ändert ausschließlich Composition-/UX-Darstellung. `.nls`, Persistenz, Hero-Asset-Modell und Bildlogik bleiben unverändert.
