# Build 010 Validation

Run from the repository root:

```bash
pnpm check
pnpm test
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
git diff --check
```

## Real-world smoke test
1. Start `pnpm tauri dev`.
2. Open `examples/Norway-Sample.nls`.
3. Select **Bergen**.
4. Select **Einleitung** in the Story card.
5. Change the text and status to `Überarbeitet`.
6. Click **Sichern**.
7. Change pages and return to Bergen. The authored value must still be visible.
8. Quit and reopen Studio and the project. The value must persist.
9. Verify `project.json` is valid JSON and reports `formatVersion: 0.5.0`.
10. Verify the page remains the visual focus and no generic formatting toolbar was introduced.

## Migration test
Open a clean Build-009 `.nls` 0.4.0 project. It must load as 0.5.0 in memory and only be written in 0.5.0 after an explicit authoring save.
