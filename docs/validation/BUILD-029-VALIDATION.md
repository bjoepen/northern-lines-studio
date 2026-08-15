# Build 029 — Validation

## Automated consistency
Run:

```bash
pnpm consistency
pnpm check
pnpm test
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
git diff --check
```

Expected new gates:

```text
Culture & History Experience Consistency Gate: PASS
Native UI Consistency Gate: PASS
```

All visible `PASS` status words must render green; `WARN` amber; `FAIL` red.

## Real-world editorial test
Destination: **Bergen** or another existing destination.

1. Add **Kultur & Geschichte**.
2. Add two independent **Orte / Stationen**.
3. Give each a different type and different amounts of editorial text.
4. Add a visit hint to one station and a time reference to the other.
5. Optionally add a place/map reference.
6. Verify each station keeps its own details.
7. Verify Studio chooses one/two/grouped composition without exposing layout controls.
8. Switch Fjord ↔ Ostsee and verify content remains unchanged while World Expression changes.
9. Verify Companion/Footer remain fixed and no text clips.
10. Open the entry editor: local navigation must say **Zurück**, not `Abbrechen`.
