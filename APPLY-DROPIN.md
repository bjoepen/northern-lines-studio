# APPLY-DROPIN – Build 023 Final Weite Editorial Composition Fix

**Ausgangsbasis:** Build 023 Final Zone Separation Fix
**Ziel:** Build 023 Final Weite Editorial Composition Fix
**Projektformat:** `.nls` 0.9.0 – unverändert

Dieser Drop-in korrigiert ausschließlich die finale **Weite**-Komposition. Die
strikte Trennung von Hero Zone und Title Zone bleibt bestehen. Innerhalb der
Title Zone werden Titelblock und Einleitung nun horizontal komponiert, damit
untere Inhaltsmodule die geschützte Companion-/Footer-Zone nicht bedrängen.

## 1. Branch anlegen

```bash
cd ~/Projekte/northern-lines-studio
git switch main
git pull --ff-only
git switch -c build-023-final-weite-editorial-composition
```

## 2. Dry Run

Der Drop-in enthält nur geänderte Dateien; es werden keine Dateien gelöscht.

```bash
rsync -avn \
  ~/Downloads/Northern-Lines-Studio-Build-023-Final-Weite-Editorial-Composition-Fix-DropIn/ \
  ~/Projekte/northern-lines-studio/
```

Erwartung: ausschließlich Build-023-Kompositions-, Dokumentations- und
Consistency-Dateien werden angezeigt.

## 3. Drop-in anwenden

```bash
rsync -av \
  ~/Downloads/Northern-Lines-Studio-Build-023-Final-Weite-Editorial-Composition-Fix-DropIn/ \
  ~/Projekte/northern-lines-studio/
```

Kein `--delete` verwenden.

## 4. Consistency Gate

```bash
cd ~/Projekte/northern-lines-studio
pnpm consistency
```

Erwartete Kernmeldung:

```text
Journey Planning Consistency Gate: PASS
Destination Profile Consistency Gate: PASS
Layout Resilience Consistency Gate: PASS
Destination Imagery Consistency Gate: PASS
Travel Opening Consistency Gate: PASS
Destination Composition Consistency Gate: PASS
```

Der Composition Gate prüft zusätzlich:

- Weite besitzt weiterhin getrennte Hero- und Title-Zonen;
- die horizontale Alt-Linie unter dem Hero ist in Weite deaktiviert;
- Titelblock und Einleitung werden innerhalb der Title Zone komponiert;
- der vertikale Trenner ist funktional und grammar-owned;
- keine freie x/y-Geometrie, Crop- oder Focal-Point-Abkürzung wird eingeführt.

## 5. Vollständige Gates

```bash
pnpm consistency
pnpm check
pnpm test
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
git diff --check
```

Alle Gates müssen grün sein, bevor der Build übernommen wird.

## 6. Real-World-Test – Bergen / Weite

Öffne das bekannte Bergen-Ortsprofil und wähle **Weite**.

Prüfe in dieser Reihenfolge:

1. Das Panorama bleibt vollständig innerhalb der Hero Zone.
2. Unter dem Bild erscheint **kein horizontaler Dekorationsstrich**.
3. `REISEZIEL`, `Bergen` und `Tor zu den Fjorden` bilden den Titelblock.
4. Die Einleitung steht rechts daneben innerhalb derselben **Title Zone**.
5. Ein zurückhaltender vertikaler Trenner gliedert Titel und Einleitung.
6. Der Introtext darf weder in die Hero Zone noch in den unteren Modulbereich laufen.
7. Reisezeiten und Inhaltsmodule stehen höher als in der vorherigen Stapelung.
8. Der Papageientaucher behält seine Position und seinen geschützten Raum.
9. Footer und Seitenzahl bleiben invariant.
10. **Bild links** und **Bild rechts** anschließend kontrollieren: keine Regression.

Danach dieselbe Prüfung mit mindestens einem anders proportionierten Panorama
wiederholen. Die Zonen dürfen sich unabhängig vom Quellbild nicht überlagern.

Erwartete Reihenfolge:

```text
Hero Zone
→ Title Safe Zone
→ Title + Introduction
→ Facts
→ Modules
→ Companion/Footer Safe Zone
```

**Knigge-Regel:** Hero Zone und Title Zone sind Geschwister, keine Mitbewohner.
Und auch die Content Zone bekommt keinen Schlüssel für das Zimmer des
Papageientauchers.

## 7. Git prüfen und committen

```bash
git status
git diff --check
git diff
```

Commit-Vorschlag:

```bash
git add .
git commit -m "fix(studio): refine final weite editorial composition"
git push -u origin build-023-final-weite-editorial-composition
```
