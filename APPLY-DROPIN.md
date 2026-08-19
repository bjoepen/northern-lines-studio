# APPLY DROP-IN — Northern Lines Studio Build 035

Build 035 adds the approved fixed **Fjord Curated Heroes** to the four Interest Pages and the Fotografie-Workshop. The hero is owned by the Fjord World, is not user-editable, and affects only the page header flow.

## 1. Branch

```bash
cd ~/Projekte/northern-lines-studio
git checkout -b feat/build-035-fjord-curated-heroes
```

## 2. Dry Run

```bash
rsync -avn \
  ~/Downloads/Northern-Lines-Studio-Build-035-Fjord-Curated-Heroes-DropIn/ \
  ~/Projekte/northern-lines-studio/
```

## 3. Apply

```bash
rsync -av \
  ~/Downloads/Northern-Lines-Studio-Build-035-Fjord-Curated-Heroes-DropIn/ \
  ~/Projekte/northern-lines-studio/
```

## 4. Consistency Gate

```bash
cd ~/Projekte/northern-lines-studio
pnpm run consistency:build-035-heroes
```

Expected:

```text
Build 035 Fjord Curated Heroes Consistency Gate: PASS
```

`PASS` must be green.

## 5. Full Gates

```bash
pnpm consistency
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

Expected target:

```text
/Applications/Northern Lines Studio.app
```

Manual fallback:

```bash
pnpm tauri build --bundles app
```

## 7. Real-World / Visual Approval Test

Use **Fjord** and check these pages:

1. Fotografie
2. Wandern & Natur
3. Kultur & Geschichte
4. Kulinarik & Lokal
5. Fotografie-Workshop

Verify for each:

- the curated hero appears automatically;
- there is no hero control in the Inspector;
- the hero occupies only the upper-right header area;
- intro text may flow beside/under it;
- subsequent content returns to the established full page geometry;
- Companion and Footer remain unchanged and protected;
- the page surface stays literal white;
- switching away from Fjord does not reuse the Fjord hero.

**Do not merge before visual approval.**

## 8. Commit & Push

```bash
git add .
git commit -m "feat: add fixed Fjord curated heroes"
git push -u origin feat/build-035-fjord-curated-heroes
```
