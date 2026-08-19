# APPLY DROP-IN — Northern Lines Studio Build 037

Build 037 implements the approved **Inhaltsverzeichnis** and **Notizen** grammar plus fixed world-specific **Curated Accents** for Fjord and Ostsee.

## 1. Branch

```bash
cd ~/Projekte/northern-lines-studio
git checkout -b feat/build-037-contents-notes-curated-accents
```

## 2. Dry Run

```bash
rsync -avn \
  ~/Downloads/Northern-Lines-Studio-Build-037-Contents-Notes-Curated-Accents-DropIn/ \
  ~/Projekte/northern-lines-studio/
```

No intentional deletions are required.

## 3. Apply

```bash
rsync -av \
  ~/Downloads/Northern-Lines-Studio-Build-037-Contents-Notes-Curated-Accents-DropIn/ \
  ~/Projekte/northern-lines-studio/
```

## 4. Build-specific Consistency Gate

```bash
cd ~/Projekte/northern-lines-studio
pnpm consistency:build-037-utility-pages
```

Expected:

```text
Build 037 Contents & Notes Consistency Gate: PASS
```

`PASS` must appear green.

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

Target:

```text
/Applications/Northern Lines Studio.app
```

## 7. Real-world / Visual Test

Test **both Fjord and Ostsee**.

### Inhaltsverzeichnis

- page surface is literal white;
- page list is automatically derived from the current Travelbook;
- section hierarchy and page numbers remain the visual priority;
- Curated Accent appears small in the upper-right area and is clearly subordinate;
- there is no image control in the Inspector;
- no Companion appears on Contents;
- Footer stays protected.

### Notizen

- page surface is literal white;
- large main writing area remains dominant;
- secondary areas are exactly `Schnellnotiz`, `Ideen`, `Skizze`;
- Curated Accent remains small and secondary;
- Companion and Footer do not overlap any writing area;
- there is no image control in the Inspector.

Switch Worlds and confirm only the accent expression changes; structure and semantics remain identical.

**Wait for visual approval before merge.**

## 8. Commit & Push

```bash
git add .
git commit -m "feat: add contents and notes curated accents"
git push -u origin feat/build-037-contents-notes-curated-accents
```
