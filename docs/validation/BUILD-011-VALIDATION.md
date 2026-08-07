# Build 011 – Validation

## Automated gates

```bash
pnpm check
pnpm test
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
git diff --check
```

All must pass before commit.

## Real-world editorial validation

1. Start Studio without a journey and confirm the empty state remains calm and complete.
2. Use **Reise öffnen** and open `examples/Norway-Sample.nls`.
3. Select Bergen and open **Einleitung**.
4. Change the text and verify `● Nicht gesichert` appears.
5. Attempt to switch to another page.
6. Choose **Abbrechen** and confirm the current authoring state remains untouched.
7. Repeat the page switch and choose **Verwerfen**; confirm navigation continues without saving.
8. Edit again, navigate, choose **Sichern**, and confirm the new content persists.
9. Confirm the saved authored text is visible in the A5 preview.
10. Change a Story Component and test the same save/discard/cancel protection.
11. Edit and then choose **Reise schließen**; verify the protection dialog appears.
12. Save, close the journey and confirm Studio returns to **Deine Reise beginnt hier.**
13. Reopen the journey and confirm persisted content is still present.
14. Use **Reise öffnen …** while a journey is already open and verify the current unsaved content is protected.

## Destination grammar
Bergen must show **Mitbringsel & Souvenirs** as part of the Destination story. QR may remain optional.

## PASS criterion
No authored content can be lost through ordinary Studio navigation without an explicit user decision.
