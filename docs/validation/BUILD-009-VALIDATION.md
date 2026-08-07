# Build 009 Validation

## Automated Quality Gates

Run from the repository root:

```bash
pnpm check
pnpm test
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
git diff --check
```

## Companion-specific checks

The Vitest suite verifies:

- unique Companion IDs
- exactly one active Companion for every shipped Editorial World
- stable Fjord mapping to `fjord-puffin`
- physical asset presence under `design-library/companions/`
- metadata/registry ID alignment
- planned companions do not ship new Editorial Worlds
- Canary source is explicitly marked as requiring transparency cleanup

## Real-World Test

1. Start with `pnpm tauri dev`.
2. Open `examples/Norway-Sample.nls`.
3. Confirm Fjord remains Reference World 001.
4. Confirm the Inspector still shows `Papageientaucher` as Editorial Companion.
5. Click through several pages; there must be no visual regression in Header, Editorial Desk, Story card or status bar.
6. Confirm no Companion image is rendered into the Studio UI in Build 009.

## Expected result

Build 009 changes the identity infrastructure, not the visual hierarchy of the workspace.
