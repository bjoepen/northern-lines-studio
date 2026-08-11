# APPLY-DROPIN – Build 025A CSS & Grammar Consolidation

Upgrade von **Build 024 – Extension Capacity Protection Fix** auf **Build 025A – CSS & Grammar Consolidation**.

## 1. Branch

```bash
cd ~/Projekte/northern-lines-studio
git switch main
git pull --ff-only
git switch -c build/025a-css-grammar-consolidation
```

## 2. Dry Run

Nach dem Entpacken des Drop-ins nach `~/Downloads/Northern-Lines-Studio-Build-025A-CSS-Grammar-Consolidation-DropIn/`:

```bash
rsync -avn \
  ~/Downloads/Northern-Lines-Studio-Build-025A-CSS-Grammar-Consolidation-DropIn/ \
  ~/Projekte/northern-lines-studio/
```

Prüfen: 025A ersetzt `src/styles.css`, ergänzt `src/styles/`, einen Consistency Gate sowie Build-/ECR-/Validation-/Git-Dokumente. Es gibt keine `.nls`-Migration.

## 3. Apply

```bash
rsync -av \
  ~/Downloads/Northern-Lines-Studio-Build-025A-CSS-Grammar-Consolidation-DropIn/ \
  ~/Projekte/northern-lines-studio/
```

## 4. Consistency Gate

```bash
cd ~/Projekte/northern-lines-studio
pnpm consistency
```

Erwartet zusätzlich:

```text
CSS & Grammar Consolidation Consistency Gate: PASS
```

## 5. Full Gates

```bash
pnpm check
pnpm test
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
git diff --check
```

## 6. Real-world regression

025A darf visuell **nichts neu gestalten**. Vergleiche mit dem final freigegebenen Build 024:

- Bergen in Weite, Bild links und Bild rechts;
- Stavanger/Geiranger mit langen Ortsnamen und Bild;
- kurze und lange Editorial Extension Zones;
- Capacity-Hinweis `Diese Seite kann diesen Inhalt nicht mehr ruhig erzählen.`;
- Companion/Footer unverändert;
- Inspector 320–440 px;
- Finder-Open und internes `Reise öffnen`.

**Stop**, sobald eine traveller-visible Abweichung zu Build 024 auftritt. 025B beginnt erst nach grünem 025A-Regressionstest.
