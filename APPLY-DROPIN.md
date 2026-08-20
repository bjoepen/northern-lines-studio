# APPLY DROP-IN — Northern Lines Studio Build 039a

Build 039a is a **single-issue correction** to the approved Build 039 state.

It removes only the redundant visible `ERINNERUNGEN` eyebrow while preserving the H1 **Erinnerungen**. The approved Ostsee colors, Fjord expression, Curated Accent, writing geometry, Companion, Footer and all contracts remain unchanged.

## 1. Branch

Git operations are intentionally not performed by this package. From the repository root:

```bash
cd /Volumes/Kioxia/Projekte/northern-lines-studio
git status
```

Recommended branch name:

```bash
git switch -c fix/build-039a-memories-redundancy
```

## 2. Dry Run — STOP before Apply

Assuming the extracted drop-in is in `~/Downloads/Northern-Lines-Studio-Build-039a-Memories-Redundancy-Fix-DropIn`:

```bash
rsync -avn \
  ~/Downloads/Northern-Lines-Studio-Build-039a-Memories-Redundancy-Fix-DropIn/ \
  /Volumes/Kioxia/Projekte/northern-lines-studio/
```

Expected changed/added files are limited to:

```text
src/App.svelte
scripts/check-build-039a-memories-redundancy-consistency.mjs
docs/BUILD-039A-MEMORIES-REDUNDANCY-FIX.md
APPLY-DROPIN.md
DROP-IN-MANIFEST.md
BUILD-039A-DROPIN-SHA256SUMS.txt
```

**STOP** if unrelated implementation, layout, world or asset files appear.

## 3. Apply

```bash
rsync -av \
  ~/Downloads/Northern-Lines-Studio-Build-039a-Memories-Redundancy-Fix-DropIn/ \
  /Volumes/Kioxia/Projekte/northern-lines-studio/
```

Then:

```bash
cd /Volumes/Kioxia/Projekte/northern-lines-studio
```

## 4. Build-specific consistency gate

```bash
node scripts/check-build-039a-memories-redundancy-consistency.mjs
```

Expected:

```text
Build 039a Memories Redundancy Gate: PASS
```

This gate protects the exact correction scope: one visible Erinnerungen title, no duplicate eyebrow, unchanged Ostsee ochre expression and unchanged `notes` Curated Accent contract.

## 5. Full gates

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

This builds the Tauri-v2 application and installs:

```text
/Applications/Northern Lines Studio.app
```

## 7. Real-World Test — STOP/GO

### Erinnerungen — Fjord

1. Open **Erinnerungen** in Fjord.
2. Confirm only one visible heading remains: **Erinnerungen**.
3. Confirm the Curated Accent, writing boxes, Companion and Footer are unchanged.
4. Confirm Fjord colors are unchanged.

### Erinnerungen — Ostsee

1. Open **Erinnerungen** in Ostsee.
2. Confirm only one visible heading remains: **Erinnerungen**.
3. Confirm the approved light ochre/sand box expression is unchanged.
4. Confirm the physical A5 page remains white.
5. Confirm Curated Accent, writing capacity, Companion and Footer are unchanged.

**STOP** on any color change, geometry movement, missing Curated Accent, page-surface tint or additional visual change.

**GO** only when both worlds match the approved Build 039 appearance apart from the removed redundant eyebrow.

## 8. Commit & push — only after GO

After successful gates and visual review:

```bash
git status
git add .
git commit -m "fix: remove memories heading redundancy"
git push -u origin HEAD
```

Do not merge until all gates and the visual review are green.
