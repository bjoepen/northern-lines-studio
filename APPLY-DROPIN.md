# APPLY DROP-IN — Northern Lines Studio Build 031

Build 031 introduces **Travel Companion Foundation: Licht** and migrates `.nls` 0.14.0 projects to 0.15.0.

## 1. Branch

```bash
cd ~/Projekte/northern-lines-studio
git checkout -b feat/build-031-travel-companion-light
```

## 2. Dry Run

Assuming the ZIP was unpacked in `~/Downloads`:

```bash
rsync -avn \
  ~/Downloads/Northern-Lines-Studio-Build-031-Travel-Companion-Light-DropIn/ \
  ~/Projekte/northern-lines-studio/
```

Review the list carefully. Build 031 does not intentionally delete existing files.

## 3. Apply

```bash
rsync -av \
  ~/Downloads/Northern-Lines-Studio-Build-031-Travel-Companion-Light-DropIn/ \
  ~/Projekte/northern-lines-studio/
```

## 4. Consistency Gate

```bash
cd ~/Projekte/northern-lines-studio
npm run consistency
```

Expected new result:

```text
Travel Companion · Licht Consistency Gate: PASS
```

`PASS` must be displayed in green, consistent with all other Studio gates.

## 5. Full Gates

```bash
pnpm check
pnpm test
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
git diff --check
```

All gates must pass before the build is accepted.

## 6. Install macOS App

```bash
cd ~/Projekte/northern-lines-studio
./scripts/install-macos-app.sh
```

Expected app target:

```text
/Applications/Northern Lines Studio.app
```

Manual Tauri build if required:

```bash
pnpm tauri build --bundles app
```

## 7. Real-World Test

Use the existing Norway 2026 project or another Build-030 `.nls` project.

1. Open the travelbook and select **Licht**.
2. Confirm that the curated Light page is immediately present without re-authoring general knowledge.
3. Verify these curated modules are visible: **Goldenes Licht**, **Blaue Stunde**, **Zivile Dämmerung**, **Bedeckter Himmel**.
4. Confirm that no destination-specific sun times have been invented.
5. In the Inspector, add a short note under **Für diese Reise**, for example: `Im norwegischen Sommer können die Übergänge zwischen den Lichtphasen lange anhalten.`
6. Save, close the travelbook, reopen it, and verify that only the travel-specific note persisted.
7. Switch Fjord ↔ Ostsee and verify full World Expression while page background stays white.
8. Verify Companion and Footer remain in their protected zones.
9. Check the Inspector for accidental native HTML styling before release.

## 8. Commit & Push

```bash
git add .
git commit -m "feat: add curated light travel companion"
git push -u origin feat/build-031-travel-companion-light
```
