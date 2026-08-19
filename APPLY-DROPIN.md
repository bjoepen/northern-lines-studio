# APPLY DROP-IN — Northern Lines Studio Build 034 Capacity Protection Regression Fix

This fix restores the established Capacity Protection contract for the curated **Fotografie-Workshop**.

## 1. Branch

```bash
cd ~/Projekte/northern-lines-studio
git checkout -b fix/build-034-workshop-capacity-protection
```

## 2. Dry Run

Assuming the ZIP was unpacked in `~/Downloads`:

```bash
rsync -avn \
  ~/Downloads/Northern-Lines-Studio-Build-034-Workshop-Capacity-Protection-Fix-DropIn/ \
  ~/Projekte/northern-lines-studio/
```

Build 034 intentionally changes only the workshop layout policy, its regression gate and documentation. No files are intentionally deleted.

## 3. Apply

```bash
rsync -av \
  ~/Downloads/Northern-Lines-Studio-Build-034-Workshop-Capacity-Protection-Fix-DropIn/ \
  ~/Projekte/northern-lines-studio/
```

## 4. Consistency Gate

```bash
cd ~/Projekte/northern-lines-studio
pnpm consistency
```

Expected new result:

```text
Workshop Capacity Protection Regression Gate: PASS
```

All `PASS` status words must remain green.

## 5. Full Gates

```bash
pnpm check
pnpm test
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
git diff --check
```

All gates must pass before acceptance.

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

Open **Fotografie-Workshop** with the complete curated content.

Verify:

1. `Sehen`, `Gestalten`, `Belichten`, and `Unterwegs` are fully readable.
2. `Licht & Wetter` stays secondary and no longer enters the Companion zone.
3. The Papageientaucher remains in its fixed bottom-left safe-zone.
4. Footer and page number remain fixed and unobstructed.
5. No content is clipped and no typography is arbitrarily shrunk.
6. Switch Fjord ↔ Ostsee and confirm the page composition remains stable.
7. Confirm the known travel-language overflow state remains available for any future composition that genuinely cannot fit.
8. Check the Inspector for accidental native/default HTML controls before release.

## 8. Commit & Push

```bash
git add .
git commit -m "fix: restore workshop capacity protection"
git push -u origin fix/build-034-workshop-capacity-protection
```
