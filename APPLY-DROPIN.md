# APPLY DROP-IN — Northern Lines Studio Build 039

Build 039 is a narrow **Editorial Consistency Fix**. It changes only the approved issues from the Build 038 review:

- remove the duplicate visible `ORIENTIERUNG` eyebrow while keeping the page title **Orientierung**;
- give Ostsee **Erinnerungen** boxes a very light ochre surface using the established Baltic Amber/Warm Paper palette;
- repair the Build 038 Curated Accent contract so only `notes` remains a Curated Accent key; Orientierung stays image-free;
- align the stale Curated Accent test and Build 038 consistency gate with that contract;
- advance version parity to `0.39.0-alpha.1`.

No `.nls` migration, layout redesign, Companion/Footer change, new controls or additional refactoring is part of this build.

## 1. Branch

Git operations are intentionally **not** performed by the build package. Create/switch the branch yourself before applying the files.

From the repository root:

```bash
cd /Volumes/Kioxia/Projekte/northern-lines-studio
git status
```

Recommended branch name:

```bash
git switch -c fix/build-039-editorial-consistency-fix
```

If you use another branch name, keep it consistently for commit/push later.

## 2. Dry Run — STOP before Apply

Assuming the extracted drop-in is in `~/Downloads/Northern-Lines-Studio-Build-039-Editorial-Consistency-Fix-DropIn`:

```bash
rsync -avn \
  ~/Downloads/Northern-Lines-Studio-Build-039-Editorial-Consistency-Fix-DropIn/ \
  /Volumes/Kioxia/Projekte/northern-lines-studio/
```

Expected changed/added implementation files are limited to:

```text
package.json
src/App.svelte
src/lib/curated-accents.ts
src/lib/curated-accents.test.ts
src/styles/book-utility-pages.css
scripts/check-build-038-orientation-memories-consistency.mjs
scripts/check-build-039-editorial-consistency.mjs
src-tauri/Cargo.toml
src-tauri/Cargo.lock
src-tauri/tauri.conf.json
docs/BUILD-039-EDITORIAL-CONSISTENCY-FIX.md
APPLY-DROPIN.md
DROP-IN-MANIFEST.md
BUILD-039-DROPIN-SHA256SUMS.txt
```

**STOP** if unrelated source/layout files appear in the dry run.

## 3. Apply

```bash
rsync -av \
  ~/Downloads/Northern-Lines-Studio-Build-039-Editorial-Consistency-Fix-DropIn/ \
  /Volumes/Kioxia/Projekte/northern-lines-studio/
```

Then:

```bash
cd /Volumes/Kioxia/Projekte/northern-lines-studio
```

## 4. Build-specific consistency gate

```bash
pnpm run consistency:build-039
```

Expected:

```text
Build 039 Editorial Consistency Gate: PASS
```

The gate specifically protects:

- one visible Orientierung title, no duplicate eyebrow;
- Orientierung remains image-free;
- Curated Accent API remains `notes` only;
- obsolete `contents` Curated Accent mappings/assets do not return;
- Ostsee Erinnerungen uses the Baltic Amber/Warm Paper expression while the page remains white;
- version parity is `0.39.0-alpha.1`.

## 5. Full gates

Run all gates in this order:

```bash
pnpm consistency
pnpm check
pnpm test
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
git diff --check
```

All must be green before the macOS app build.

## 6. Build & install the macOS app

From the repository root:

```bash
./scripts/install-macos-app.sh
```

The script builds the Tauri-v2 application and installs:

```text
/Applications/Northern Lines Studio.app
```

## 7. Real-World Test — STOP/GO

### Orientierung

1. Open a Fjord travelbook and select **Orientierung**.
2. Confirm there is only one visible `Orientierung` heading.
3. Confirm no Curated Accent/image appears on the page.
4. Confirm groups, leaders and page numbers are unchanged.
5. Repeat in Ostsee.

### Erinnerungen — Fjord regression

1. Open **Erinnerungen** in Fjord.
2. Confirm the Curated Accent remains unchanged.
3. Confirm writing boxes retain the existing Fjord expression.
4. Confirm Companion, Footer and writing geometry are unchanged.

### Erinnerungen — Ostsee correction

1. Open **Erinnerungen** in Ostsee.
2. Confirm the physical A5 page remains literal white.
3. Confirm only the writing boxes carry a very light warm ochre/sand impression.
4. Confirm the tone reads as Ostsee and is visibly distinct from Fjord, but remains quiet.
5. Confirm Curated Accent, Companion, Footer and writing capacity are unchanged.

**STOP** on any new layout movement, non-white page surface, Fjord color regression, missing memories accent, duplicate heading or Companion/Footer displacement.

**GO** only when all three checks are visually approved.

## 8. Commit & push — only after GO

The package does not execute Git commands. After successful gates and Real-World Test:

```bash
git status
git add .
git commit -m "fix: align build 039 editorial consistency"
git push -u origin HEAD
```

Do not merge until the branch gates and visual review are green.
