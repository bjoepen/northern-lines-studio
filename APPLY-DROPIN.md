# APPLY-DROPIN · Build 026 – Destination Interest Pages Foundation

**Baseline:** final Build 025C – Ostsee Warm Expression Polish
**Target:** Build 026 – Destination Interest Pages Foundation
**Project format:** `.nls` 0.10.0 → 0.11.0

This Drop-in contains only new/changed files. No `--delete` is required.

## 1. Branch

```bash
cd ~/Projekte/northern-lines-studio
git switch main
git pull --ff-only
git switch -c build/026-destination-interest-pages
```

Stop if `git status` is not clean unless the local changes are intentional and already backed up.

## 2. Dry Run

Assuming the extracted Drop-in is located in Downloads:

```bash
rsync -avn \
  ~/Downloads/Northern-Lines-Studio-Build-026-Destination-Interest-Pages-Foundation-DropIn/ \
  ~/Projekte/northern-lines-studio/
```

Expected: only Build-026 files are listed. `.git/` is never touched.

## 3. Apply

```bash
rsync -av \
  ~/Downloads/Northern-Lines-Studio-Build-026-Destination-Interest-Pages-Foundation-DropIn/ \
  ~/Projekte/northern-lines-studio/
```

## 4. Consistency Gate

```bash
cd ~/Projekte/northern-lines-studio
pnpm consistency
```

Expected new gate:

```text
Destination Interest Pages Consistency Gate: PASS
```

`PASS` is the positive status; no emoji/badge is required.

## 5. Full Gates

```bash
pnpm check
pnpm test
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
git diff --check
```

All gates must pass before committing.

## 6. Real-World Test

Use an existing Build-025 Travelbook such as the Norway/Bergen working project.

1. Open the `.nls` and confirm migration from 0.10.0 to 0.11.0.
2. Select **Bergen**.
3. Under **Deine Interessen**, add **Fotografie**.
4. Confirm the new page appears immediately after Bergen in **Deine Route**.
5. Return to Bergen and add **Kultur & Geschichte**.
6. Confirm both pages coexist before the next route destination.
7. Open one interest page, edit **Titel** and **Einleitung**, save, close Studio and reopen the `.nls`.
8. Confirm authoring and both interest pages persist.
9. Switch **Fjord → Ostsee → Fjord** while an interest page is selected. Content must remain unchanged; typography/Companion/World Expression may change.
10. Remove one interest page. The other interest and the main Bergen page must remain intact.
11. Add a new route destination after interest pages already exist. Route and page ordering must remain coherent.

### GO

The traveller can deepen a Destination in several directions without seeing technical page types or managing layout mechanics.

### STOP

Stop and do not commit if:

- a Build-025 project loses existing content during migration;
- an interest page appears detached from its Destination;
- duplicate copies of the same interest can be created for one Destination;
- World switching changes the semantic interest or authored content;
- removing one interest removes the Destination or another interest.

## 7. Commit

```bash
git add .
git commit -m "feat: add destination interest pages foundation"
git push -u origin build/026-destination-interest-pages
```
