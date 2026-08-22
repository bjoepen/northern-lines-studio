# APPLY — Northern Lines Studio Build 040 · Exact A5 Geometry Foundation

## 0. Contract

Build 040 changes only Studio page geometry:

```text
Physical Studio Page    420 × 595.945945946 u
Golden Composition      420 × 594 u
A5 Extension                  1.945945946 u
```

Footer positions, Companion positions and Safe Zones remain at their Build 039 Golden Y coordinates.

No print/PDF implementation is included.

## 1. Branch

Create/use a fresh Build 040 branch from clean `main`:

```bash
cd /Volumes/Kioxia/Projekte/northern-lines-studio
git status
git switch main
git pull --ff-only
git switch -c build/040-exact-a5-geometry
```

If the branch already exists, switch to it instead.

## 2. Unpack

```bash
cd ~/Downloads
unzip Northern-Lines-Studio-Build-040-Exact-A5-Geometry-DropIn.zip
```

## 3. Dry Run — mandatory

```bash
rsync -avn \
  ~/Downloads/Northern-Lines-Studio-Build-040-Exact-A5-Geometry-DropIn/ \
  /Volumes/Kioxia/Projekte/northern-lines-studio/
```

Expected project changes are limited to the files listed in `DROP-IN-MANIFEST.md` plus the drop-in documentation/checksum files.

STOP if unrelated Studio files would be overwritten.

## 4. Apply

```bash
rsync -av \
  ~/Downloads/Northern-Lines-Studio-Build-040-Exact-A5-Geometry-DropIn/ \
  /Volumes/Kioxia/Projekte/northern-lines-studio/
```

## 5. Build-specific Gate first

```bash
cd /Volumes/Kioxia/Projekte/northern-lines-studio
node scripts/check-build-040-a5-geometry-consistency.mjs
```

Expected:

```text
PASS · Build 040 · exact DIN A5 page geometry with preserved 420×594 Golden Composition, footer/companion anchors and safe zones.
```

## 6. Full local Quality Gate

```bash
pnpm check
pnpm test
pnpm consistency
pnpm build

cd src-tauri
cargo test
cd ..
```

All commands must PASS. Do not continue on FAIL.

## 7. macOS App Build / Install

From repo root:

```bash
./scripts/install-macos-app.sh
```

This builds the Tauri-v2 app and installs `Northern Lines Studio.app` to `/Applications`.

## 8. Real-world visual regression

Open the known Build 039 Golden travelbook and verify at minimum:

- Fjord and Ostsee World switching unchanged
- Cover / planning / destination pages unchanged inside the prior composition
- Destination hero variants unchanged
- Companion positions unchanged
- Footer positions unchanged
- Binding Safe Zone unchanged
- Interest Pages and hard footer anchors unchanged
- Orientierung unchanged
- Erinnerungen unchanged

The only intended geometric difference is the additional `1.945945946 u` physical page extension below the existing 594-unit Golden Composition.

## 9. Git diff audit

```bash
git status --short
git diff --stat main...HEAD
git diff --check
```

Verify no unrelated layout, World, `.nls`, Tauri runtime or dependency change is present.

## 10. Commit / Push

Only after all local gates and the visual regression PASS:

```bash
git add \
  package.json \
  src/lib/preview.ts \
  src/lib/preview.test.ts \
  src/styles/base-shell.css \
  src/styles/book-utility-pages.css \
  src/styles/destination-foundation.css \
  src/styles/destination-interests.css \
  src/styles/editorial-worlds.css \
  scripts/check-build-039-editorial-consistency.mjs \
  scripts/check-build-040-a5-geometry-consistency.mjs \
  src-tauri/Cargo.toml \
  src-tauri/Cargo.lock \
  src-tauri/tauri.conf.json \
  docs/builds/BUILD-040.md \
  APPLY-DROPIN.md \
  DROP-IN-MANIFEST.md \
  BUILD-040-DROPIN-SHA256SUMS.txt

git commit -m "build: establish exact A5 studio geometry in 040"
git push -u origin build/040-exact-a5-geometry
```

## 11. Golden Build promotion

Build 040 becomes the new Golden Build only after:

```text
ChatGPT pre-delivery consistency gate PASS
+ local pnpm/cargo gates PASS
+ macOS app build PASS
+ visual Build 039 regression PASS
```

After promotion, all subsequent PDF/Publisher PoCs branch from Build 040/main.
