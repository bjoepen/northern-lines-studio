# APPLY DROP-IN — Northern Lines Studio Build 038

Build 038 introduces **Orientierung**, **Erinnerungen** and the approved soft watercolor edge treatment for curated Fjord/Ostsee imagery.

## 1. Branch

```bash
cd ~/Projekte/northern-lines-studio
git checkout -b feat/build-038-orientation-memories-soft-world-imagery
```

## 2. Dry Run

```bash
rsync -avn \
  ~/Downloads/Northern-Lines-Studio-Build-038-Orientation-Memories-Soft-World-Imagery-DropIn/ \
  ~/Projekte/northern-lines-studio/
```

Build 038 intentionally removes the obsolete Orientation accent files. Remove them after the dry run:

```bash
rm -f ~/Projekte/northern-lines-studio/public/design-library/worlds/fjord/curated-accents/contents.png
rm -f ~/Projekte/northern-lines-studio/public/design-library/worlds/baltic/curated-accents/contents.png
```

## 3. Apply

```bash
rsync -av \
  ~/Downloads/Northern-Lines-Studio-Build-038-Orientation-Memories-Soft-World-Imagery-DropIn/ \
  ~/Projekte/northern-lines-studio/
```

## 4. Build-specific gate

```bash
cd ~/Projekte/northern-lines-studio
pnpm run consistency:build-038
```

Expected:

```text
Build 038 Orientation & Memories Consistency Gate: PASS
```

`PASS` must appear in green.

## 5. Full gates

```bash
pnpm consistency
pnpm check
pnpm test
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
git diff --check
```

## 6. Build & install macOS app

```bash
cd ~/Projekte/northern-lines-studio
./scripts/install-macos-app.sh
```

Expected target:

```text
/Applications/Northern Lines Studio.app
```

## 7. Visual real-world test — STOP/GO

### Orientierung
1. Open Fjord → **Orientierung**.
2. Confirm there is **no image** on this page.
3. Confirm title, groups and page numbers are calm and fully readable.
4. Switch to Ostsee: World typography/accent changes, but no image appears.

### Erinnerungen
1. Open **Erinnerungen** in Fjord.
2. Confirm the Curated Accent has a soft watercolor edge and opens into white space.
3. Confirm the writing area remains the dominant surface.
4. Switch to Ostsee and confirm the world-owned image changes while using the same soft-edge treatment.

### Curated Heroes
1. Check one Interest Page and the Fotografie-Workshop in Fjord and Ostsee.
2. Confirm the previously approved size/flow is unchanged.
3. Confirm Ostsee no longer reads as a hard rectangular image tile; its edge language matches Fjord.
4. Confirm Companion and Footer are unchanged.

**STOP** on clipping, hard tile edges, wrong visible page names, or any Companion/Footer displacement.  
**GO** only after visual approval.

## 8. Commit & push

```bash
git add .
git commit -m "feat: add orientation memories and soft world imagery"
git push -u origin feat/build-038-orientation-memories-soft-world-imagery
```
