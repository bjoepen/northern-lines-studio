# APPLY-DROPIN — Build 030 · Culinary & Local Experience

Baseline: final Build 029 Interest Page Header & Intro Fix  
Target: Build 030 Culinary & Local Experience

## 1. Branch

```bash
cd ~/Projekte/northern-lines-studio
git status
git switch -c feature/build-030-culinary-local-experience
```

## 2. Dry Run

```bash
rsync -avn ~/Downloads/Northern-Lines-Studio-Build-030-Culinary-Local-Experience-DropIn/ ~/Projekte/northern-lines-studio/
```

Review the list. This Drop-in contains only new/changed Build-030 files and uses no `--delete`.

## 3. Apply

```bash
rsync -av ~/Downloads/Northern-Lines-Studio-Build-030-Culinary-Local-Experience-DropIn/ ~/Projekte/northern-lines-studio/
cd ~/Projekte/northern-lines-studio
```

## 4. Consistency Gate

```bash
pnpm consistency
```

Expected new output includes:

```text
Culinary & Local Experience Consistency Gate: PASS
Native UI Consistency Gate: PASS
Interest Page Header & Intro Consistency Gate: PASS
```

The word `PASS` must be green. Existing semantics remain: WARN amber, FAIL red.

## 5. Full Gates

```bash
pnpm check
pnpm test
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
git diff --check
```

Stop on any error.

## 6. Build and install the macOS app

```bash
cd ~/Projekte/northern-lines-studio
./scripts/install-macos-app.sh
```

Expected target:

```text
/Applications/Northern Lines Studio.app
```

Manual alternative:

```bash
pnpm tauri build --bundles app
```

Development run:

```bash
pnpm tauri dev
```

## 7. Real-world test

Use an existing Destination and add **Kulinarik & Lokal**.

- Confirm the page header follows the shared Interest grammar: **KULINARIK & LOKAL → Ort → editable introduction**.
- Add two entries through **+ Empfehlung hinzufügen**.
- Recommendation 01: e.g. local dish or speciality with category, reason and **Probieren & entdecken**.
- Recommendation 02: e.g. market, café or local shop with **Gut zu wissen**, optional **Zeit / Preis**, and optional map/place reference.
- Confirm each recommendation retains its own details after save, page switch, app close/reopen.
- Confirm Studio automatically chooses an appropriate single / two-up / grouped composition.
- Confirm `comfortable` is the default; `tight` is only used under real capacity pressure.
- Confirm no text clipping.
- Confirm Companion and Footer stay fixed.
- Confirm Fjord ↔ Ostsee changes expression, not content.
- Confirm the local entry-editor action says **Zurück**.
- Scan the visible flow for unintended browser/default HTML controls.
- Confirm all visible PASS state words use the approved green status treatment.

## 8. Commit and Push

```bash
cd ~/Projekte/northern-lines-studio
git status
git add -A
git diff --cached --check
git commit -m "feat: add culinary and local experience"
git push -u origin feature/build-030-culinary-local-experience
```
