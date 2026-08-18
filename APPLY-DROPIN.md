# APPLY DROP-IN — Northern Lines Studio Build 031 Page Geometry Regression Fix

This fix removes the accidental second inner safe-zone from the Travel Companion page `Licht`.

## 1. Branch

```bash
cd ~/Projekte/northern-lines-studio
git checkout -b fix/build-031-page-geometry
```

## 2. Dry Run

Assuming the ZIP was unpacked in `~/Downloads`:

```bash
rsync -avn \
  ~/Downloads/Northern-Lines-Studio-Build-031-Page-Geometry-Regression-Fix-DropIn/ \
  ~/Projekte/northern-lines-studio/
```

Expected changed/new areas are limited to the Light layout, its consistency gate and documentation.

## 3. Apply

```bash
rsync -av \
  ~/Downloads/Northern-Lines-Studio-Build-031-Page-Geometry-Regression-Fix-DropIn/ \
  ~/Projekte/northern-lines-studio/
```

## 4. Consistency Gate

```bash
cd ~/Projekte/northern-lines-studio
pnpm run consistency:travel-companion-light
```

Expected:

```text
Travel Companion · Licht Consistency Gate: PASS
```

`PASS` must appear in green.

## 5. Full Gates

```bash
pnpm check
pnpm test
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
git diff --check
```

## 6. Install macOS App

```bash
cd ~/Projekte/northern-lines-studio
./scripts/install-macos-app.sh
```

Expected target:

```text
/Applications/Northern Lines Studio.app
```

Manual fallback:

```bash
pnpm tauri build --bundles app
```

## 7. Real-World Test

1. Open `Bergen` and note the real usable A5 content width.
2. Switch to `Licht`.
3. Confirm that `Licht` now uses the same physical A5 content box and does not appear as a smaller page inside the page.
4. Confirm there is no additional all-around inner safe-zone.
5. Confirm the three top knowledge cards use the available width cleanly.
6. Confirm `Bedeckter Himmel` uses the next row without crowding Companion or Footer.
7. Switch Fjord ↔ Ostsee and verify World Expression remains intact.
8. Verify no clipping or overflow.

## 8. Commit & Push

```bash
git add .
git commit -m "fix: restore shared A5 geometry for light companion"
git push -u origin fix/build-031-page-geometry
```
