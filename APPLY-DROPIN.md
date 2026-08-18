# APPLY DROP-IN — Northern Lines Studio Build 032

Build 032 introduces **Travel Companion · Wetter** on the master established by `Licht` and fixes the Travel Companion Inspector typography.

## 1. Branch

```bash
cd ~/Projekte/northern-lines-studio
git checkout -b feat/build-032-travel-companion-weather
```

## 2. Dry Run

Assuming the ZIP was unpacked in `~/Downloads`:

```bash
rsync -avn \
  ~/Downloads/Northern-Lines-Studio-Build-032-Travel-Companion-Weather-DropIn/ \
  ~/Projekte/northern-lines-studio/
```

Review the list. Build 032 intentionally adds the new weather companion module, documentation, tests and migration support. It does not intentionally delete files.

## 3. Apply

```bash
rsync -av \
  ~/Downloads/Northern-Lines-Studio-Build-032-Travel-Companion-Weather-DropIn/ \
  ~/Projekte/northern-lines-studio/
```

## 4. Consistency Gate

```bash
cd ~/Projekte/northern-lines-studio
pnpm consistency
```

Expected new result:

```text
Travel Companion · Wetter Consistency Gate: PASS
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

Expected app target:

```text
/Applications/Northern Lines Studio.app
```

Manual fallback:

```bash
pnpm tauri build --bundles app
```

## 7. Real-World Test

Use an existing Build-031 `.nls` travelbook.

1. Open the travelbook and confirm migration from `.nls` 0.15.0 to 0.16.0.
2. Open **Licht** and verify the page remains visually unchanged from the approved Build-031 master.
3. In the Inspector, verify `Licht`, `kuratiert`, `4 vorhanden`, and `optional` now use calm UI typography and no oversized serif values.
4. Open **Wetter**.
5. Confirm these curated modules are visible and fully readable: **Regen & Nässe**, **Wind & Böen**, **Nebel & Sicht**, **Wolken & Wandel**.
6. Confirm the page uses the same Travel Companion Master geometry as `Licht`: white page, compact title, three modules across where content fit permits, fourth module below, Companion and Footer protected.
7. Add a short **Für diese Reise** note, save, close the travelbook, reopen it, and verify the note persisted.
8. Confirm no destination-specific forecast or invented regional weather claim appears in the curated core.
9. Switch Fjord ↔ Ostsee and verify full World Expression while the page surface stays white.
10. Inspect the right column for accidental native HTML/default-control styling.

## 8. Commit & Push

```bash
git add .
git commit -m "feat: add curated weather travel companion"
git push -u origin feat/build-032-travel-companion-weather
```
