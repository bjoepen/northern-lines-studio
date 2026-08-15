# Validation · Build 028 Interest Entry Authoring Fix

## Geiranger real-world case

1. Open the existing Geiranger `Wandern & Natur` Interest Page from Build 028 / `.nls` 0.13.0.
2. Confirm migration to `.nls` 0.14.0.
3. Confirm existing routes appear as separate structured entries and no text has disappeared.
4. Edit `Fosseråsa – Storsæterfossen`; verify Startpunkt, Dauer, Schwierigkeit, Aussicht & Naturziele and Hinweise are in the same route mask.
5. Edit `Skagehola – Skageflå – Homlong`; verify the full guidance including `Trittsicherheit erforderlich` remains visible.
6. Add a third test route and verify Studio changes density/composition before reporting overflow.
7. Remove the third route and verify two concise routes may use two boxes while longer routes use one grouped editorial surface.
8. Confirm Companion and Footer do not move.

## Photography regression

1. Open a Photography Interest Page.
2. Confirm existing spots migrate to structured entries.
3. Add a Fotospot and enter a focal length directly in the same mask.
4. Confirm the preview keeps Spot → Brennweite together without a table divider.

## Gates

```bash
pnpm consistency
pnpm check
pnpm test
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
git diff --check
./scripts/install-macos-app.sh
```
