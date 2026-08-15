# APPLY-DROPIN — Build 029 · Culture & History Experience

Baseline: final Build 028 Inspector UX Language Fix
Target: Build 029 Culture & History Experience

## 1. Branch

```bash
cd ~/Projekte/northern-lines-studio
git status
git switch -c feature/build-029-culture-history-experience
```

## 2. Dry Run

```bash
rsync -avn ~/Downloads/Northern-Lines-Studio-Build-029-Culture-History-Experience-DropIn/ ~/Projekte/northern-lines-studio/
```

Review the list. This Drop-in contains only new/changed Build-029 files and uses no `--delete`.

## 3. Apply

```bash
rsync -av ~/Downloads/Northern-Lines-Studio-Build-029-Culture-History-Experience-DropIn/ ~/Projekte/northern-lines-studio/
cd ~/Projekte/northern-lines-studio
```

## 4. Consistency Gate

```bash
pnpm consistency
```

Expected new output includes:

```text
Culture & History Experience Consistency Gate: PASS
Native UI Consistency Gate: PASS
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

Use an existing Destination and add **Kultur & Geschichte**.

- Add two entries through **+ Ort / Station hinzufügen**.
- Station 01: type `Museum`, editorial meaning, visit hint.
- Station 02: type `Historischer Ort`, editorial meaning, optional time reference and map/place reference.
- Confirm each station retains its own details after save, page switch, app close/reopen.
- Confirm Studio automatically chooses an appropriate one/two/grouped composition.
- Confirm `comfortable` is the default; `tight` is only used under real capacity pressure.
- Confirm no text clipping.
- Confirm Companion and Footer stay fixed.
- Confirm Fjord ↔ Ostsee changes expression, not content.
- Confirm the local entry-editor action says **Zurück**.
- Scan the visible flow for unintended browser/default HTML controls.

## 8. Commit and Push

```bash
cd ~/Projekte/northern-lines-studio
git status
git add -A
git diff --cached --check
git commit -m "feat: add culture and history experience"
git push -u origin feature/build-029-culture-history-experience
```
