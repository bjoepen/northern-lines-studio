# APPLY DROP-IN — Northern Lines Studio Build 031 Fix

This polish fix refines **Travel Companion · Licht** so the page follows Northern Lines more closely:

- removes the redundant top rule and the extra `Reisebegleitung` eyebrow
- gives **Licht** a calmer, more compact headline treatment
- reduces empty space above the content
- arranges the curated light modules in a quieter, denser editorial composition
- keeps Companion and Footer protected

## 1. Branch

```bash
cd ~/Projekte/northern-lines-studio
git checkout -b fix/build-031-light-layout-polish
```

## 2. Dry Run

Assuming the ZIP was unpacked in `~/Downloads`:

```bash
rsync -avn \
  ~/Downloads/Northern-Lines-Studio-Build-031-Light-Layout-Polish-Fix-DropIn/ \
  ~/Projekte/northern-lines-studio/
```

## 3. Apply

```bash
rsync -av \
  ~/Downloads/Northern-Lines-Studio-Build-031-Light-Layout-Polish-Fix-DropIn/ \
  ~/Projekte/northern-lines-studio/
```

## 4. Consistency Gate

```bash
cd ~/Projekte/northern-lines-studio
pnpm run consistency:travel-companion-light
```

Expected result:

```text
Travel Companion · Licht Consistency Gate: PASS
```

`PASS` should appear in green.

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

Expected app target:

```text
/Applications/Northern Lines Studio.app
```

Manual fallback if required:

```bash
pnpm tauri build --bundles app
```

## 7. Real-World Test

1. Open a travelbook and select **Licht**.
2. Verify the page starts directly with **Licht** and no longer shows the redundant eyebrow.
3. Confirm the top rule is gone and the upper whitespace feels tighter.
4. Confirm the curated modules present a compact three-across composition with the fourth module in a calmer supporting row.
5. Verify Companion and Footer remain untouched.
6. Add an optional note under **Für diese Reise**, save, close, and reopen.
7. Confirm the note persists and the base curated knowledge remains unchanged.

## 8. Commit & Push

```bash
git add .
git commit -m "fix: polish travel companion light layout"
git push -u origin fix/build-031-light-layout-polish
```
