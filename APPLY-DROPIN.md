# APPLY DROP-IN — Northern Lines Studio Build 033

Build 033 turns the existing photography workflow page into a fully curated, program-neutral **Fotografie-Workshop**.

## 1. Branch

```bash
cd ~/Projekte/northern-lines-studio
git checkout -b feat/build-033-curated-photography-workshop
```

## 2. Dry Run

Assuming the ZIP was unpacked in `~/Downloads`:

```bash
rsync -avn \
  ~/Downloads/Northern-Lines-Studio-Build-033-Curated-Photography-Workshop-DropIn/ \
  ~/Projekte/northern-lines-studio/
```

Review the list carefully. Build 033 does not intentionally delete existing files.

## 3. Apply

```bash
rsync -av \
  ~/Downloads/Northern-Lines-Studio-Build-033-Curated-Photography-Workshop-DropIn/ \
  ~/Projekte/northern-lines-studio/
```

## 4. Consistency Gate

```bash
cd ~/Projekte/northern-lines-studio
pnpm run consistency
```

Expected new result:

```text
Travel Companion · Fotografie-Workshop Consistency Gate: PASS
```

`PASS` must be displayed in green.

## 5. Full Gates

```bash
pnpm check
pnpm test
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
git diff --check
```

All gates must pass before the build is accepted.

## 6. Install macOS App

```bash
cd ~/Projekte/northern-lines-studio
./scripts/install-macos-app.sh
```

Expected app target:

```text
/Applications/Northern Lines Studio.app
```

Manual fallback:

```bash
pnpm tauri build --bundles app
```

## 7. Real-World Test

1. Open the Norway project and select **Fotografie-Workshop**.
2. Confirm the page contains exactly four curated worlds: **Sehen**, **Gestalten**, **Belichten**, **Unterwegs**.
3. Confirm there is no software-specific language (Luminar, ON1, Lightroom, Photoshop).
4. Confirm no authoring mask is offered for the workshop.
5. Confirm the short **Licht & Wetter** bridge is present without duplicating the Light/Weather companion pages.
6. Switch Fjord ↔ Ostsee and verify the World Expression remains intact.
7. Verify Companion and Footer stay in their protected zones.
8. Confirm the Inspector uses calm UI typography and reports `kuratiert`, `4 vorhanden`, `nicht vorgesehen`.
9. Run the Native UI Consistency Check and confirm no default HTML control styling leaked into the visible flow.

## 8. Commit & Push

```bash
git add .
git commit -m "feat: add curated photography workshop"
git push -u origin feat/build-033-curated-photography-workshop
```
