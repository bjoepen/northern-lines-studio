# APPLY DROP-IN — Northern Lines Studio Build 034 Final Consistency Cleanup

This cleanup follows the successful Build-034 Workshop real-world test. It introduces **no new feature** and does not change `.nls` data.

It fixes four release-consistency issues:

- Fjord Destination Page surface: historical cream → literal `#FFFFFF`
- Fjord semantic `paperTone` → `#FFFFFF`
- stale white-surface gate corrected
- Tauri/Cargo version metadata synchronized to `0.34.0-alpha.1`

## 1. Branch

```bash
cd ~/Projekte/northern-lines-studio
git checkout -b fix/build-034-final-consistency-cleanup
```

## 2. Dry Run

Assuming the ZIP was unpacked in `~/Downloads`:

```bash
rsync -avn \
  ~/Downloads/Northern-Lines-Studio-Build-034-Final-Consistency-Cleanup-DropIn/ \
  ~/Projekte/northern-lines-studio/
```

Review the changed files. There are no intentional file deletions.

## 3. Apply

```bash
rsync -av \
  ~/Downloads/Northern-Lines-Studio-Build-034-Final-Consistency-Cleanup-DropIn/ \
  ~/Projekte/northern-lines-studio/
```

## 4. Consistency Gate

```bash
cd ~/Projekte/northern-lines-studio
pnpm consistency
```

Expected final gate:

```text
Build 034 Final Consistency Gate: PASS
```

`PASS` must appear in green.

The Destination Imagery gate must also still report:

```text
Destination Imagery Consistency Gate: PASS
```

## 5. Full Gates

```bash
pnpm check
pnpm test
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
git diff --check
```

All must pass locally before release acceptance.

## 6. Install macOS App

```bash
cd ~/Projekte/northern-lines-studio
./scripts/install-macos-app.sh
```

Expected app target:

```text
/Applications/Northern Lines Studio.app
```

Manual fallback:

```bash
pnpm tauri build --bundles app
```

## 7. Real-World Test

1. Open **Bergen** in **Fjord**.
2. Confirm the physical A5 page surface is **true white**, not cream.
3. Switch to **Ostsee** and confirm the page remains white while typography, accents and semantic content surfaces change with the World.
4. Open at least one Interest Page and `Licht`, `Wetter`, `Fotografie-Workshop`; confirm the physical page surface remains white.
5. Re-check the Workshop capacity result: four core worlds + `Licht & Wetter` bridge visible, Companion and Footer untouched.
6. Verify the built macOS app reports version `0.34.0-alpha.1`.

## 8. Commit & Push

```bash
git add .
git commit -m "fix: finalize build 034 consistency cleanup"
git push -u origin fix/build-034-final-consistency-cleanup
```
