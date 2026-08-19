# APPLY DROP-IN — Northern Lines Studio Build 036

Build 036 adds the approved fixed **Ostsee Curated Heroes** and applies the Fjord Curated Hero contract to the Baltic World.

## 1. Branch

```bash
cd ~/Projekte/northern-lines-studio
git checkout -b feat/build-036-ostsee-curated-heroes
```

## 2. Dry Run

```bash
rsync -avn \
  ~/Downloads/Northern-Lines-Studio-Build-036-Ostsee-Curated-Heroes-DropIn/ \
  ~/Projekte/northern-lines-studio/
```

Review the changed files. No intentional deletion is required.

## 3. Apply

```bash
rsync -av \
  ~/Downloads/Northern-Lines-Studio-Build-036-Ostsee-Curated-Heroes-DropIn/ \
  ~/Projekte/northern-lines-studio/
```

## 4. Build-specific Consistency Gate

```bash
cd ~/Projekte/northern-lines-studio
pnpm run consistency:build-036-ostsee-heroes
```

Expected:

```text
Build 036 Ostsee Curated Heroes Consistency Gate: PASS
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

## 7. Real-World / Visual Approval Test

Switch the active Editorial World to **Ostsee** and inspect:

1. Fotografie
2. Wandern & Natur
3. Kultur & Geschichte
4. Kulinarik & Lokal
5. Fotografie-Workshop

Verify:

- the correct Ostsee hero appears automatically;
- no hero controls are exposed in the Inspector;
- the hero occupies only the upper-right head flow;
- intro copy may wrap beside / below it;
- modules resume their existing full-width geometry after the intro;
- Companion and Footer remain unchanged;
- page surface stays literal white;
- switching back to Fjord restores the corresponding Fjord hero;
- the Workshop remains the worst-case capacity reference without clipping or overlap.

**Wait for visual approval before merge.**

## 8. Commit & Push

```bash
git add .
git commit -m "feat: add fixed Ostsee curated heroes"
git push -u origin feat/build-036-ostsee-curated-heroes
```
