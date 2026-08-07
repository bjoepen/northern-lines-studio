# Build 008 Validation

## Automated gates

Run from the repository root:

```bash
pnpm check
pnpm test
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
```

Expected: all commands succeed.

## Real-world Studio smoke test

```bash
pnpm tauri dev
```

Open:

```text
examples/Norway-Sample.nls
```

Check at least these pages:

1. **Bergen** – Story card lists Hero, Titel, Einleitung, Geschichte & Hintergründe, Fotografie & Erleben, Northern Lines Wissen and QR as present; `Mitbringsel & Souvenirs` appears only as optional.
2. **Licht** – Story vocabulary changes to Light-specific expressions.
3. **ON1 Photo RAW** – workflow expressions replace Destination expressions.
4. **Notizen** – only the Notes grammar expressions are shown.
5. **Abschluss** – quote and closing text appear as memory expressions.

## UX acceptance

- no new toolbar or floating palette
- page remains the visual focus
- Story card reads as information, not an editing panel
- Inspector remains scrollable on smaller windows
- header and Editorial Desk are visually unchanged from Build 007

## Compatibility

Open an existing Build-005/006/007 `.nls` project with format `0.4.0`. It must load without migration because Build 008 changes Studio domain interpretation only.
