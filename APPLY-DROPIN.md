# APPLY DROP-IN — Northern Lines Studio Build 031 Light Capacity & Inspector Fix

This fix refines the Travel Companion page `Licht` so it stays within the established Northern Lines geometry and safe-zone rules.

It implements the approved corrections:

- remove the extra `Für unterwegs` block from the page
- keep the four curated light modules as the reusable core
- keep three modules in the first row and `Bedeckter Himmel` as the wider second-row module
- preserve real page space for an optional personal `Für diese Reise` note
- protect Companion and Footer safe-zones
- calm the Inspector title typography for `Licht`

## 1. Branch

```bash
cd ~/Projekte/northern-lines-studio
git checkout -b fix/build-031-light-capacity-inspector
```

## 2. Dry Run

Assuming the ZIP was unpacked in `~/Downloads`:

```bash
rsync -avn \
  ~/Downloads/Northern-Lines-Studio-Build-031-Light-Capacity-Inspector-Fix-DropIn/ \
  ~/Projekte/northern-lines-studio/
```

Expected changed/new areas are limited to the Light page preview and Light-specific styling.

## 3. Apply

```bash
rsync -av \
  ~/Downloads/Northern-Lines-Studio-Build-031-Light-Capacity-Inspector-Fix-DropIn/ \
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

1. Open `Licht`.
2. Confirm the page no longer renders the additional `Für unterwegs` block.
3. Confirm the top row uses three compact knowledge cards.
4. Confirm `Bedeckter Himmel` sits as the wider fourth module below.
5. Confirm the page preserves calm white space for an optional `Für diese Reise` note.
6. Confirm Companion and Footer safe-zones remain untouched.
7. Confirm the page does not feel geometrically shrunk compared with the shared A5 page system.
8. Confirm the Inspector title `Licht` now reads in a calmer, less dominant UI style.

## 8. Commit & Push

```bash
git add .
git commit -m "fix: refine light companion capacity and inspector typography"
git push -u origin fix/build-031-light-capacity-inspector
```
