# Build 030 · Validation

Required local gates:

- `pnpm consistency`
- `pnpm check`
- `pnpm test`
- `pnpm build`
- `cargo test --manifest-path src-tauri/Cargo.toml`
- `git diff --check`
- `./scripts/install-macos-app.sh`

Expected specialist gate:

`Culinary & Local Experience Consistency Gate: PASS`

Real-world test: create a Kulinarik & Lokal page for a destination, add two recommendations with different categories and text lengths, edit the intro, close/reopen the project, switch Fjord ↔ Ostsee and verify semantic content is unchanged while World Expression changes.
