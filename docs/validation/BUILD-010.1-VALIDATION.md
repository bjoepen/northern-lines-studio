# Build 010.1 Validation

Run from the repository root:

```bash
pnpm check
pnpm test
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
git diff --check
```

## Real-world authoring validation
1. Start Studio with `pnpm tauri dev`.
2. Open `examples/Norway-Sample.nls`.
3. Select **Bergen** → **Einleitung**.
4. Change the text and choose an editorial status.
5. Save.
6. Change to another page and return to Bergen.
7. Save a second authoring change in the same Studio session.
8. Quit Studio completely.
9. Restart Studio and reopen the project.
10. Confirm both authored changes persist.

Expected result: **PASS**.

## Migration regression
`migrates_build_009_project_to_current_format` must pass and validate a schema-accurate Build-009 (`0.4.0`) fixture after normalization to `0.5.0`.
