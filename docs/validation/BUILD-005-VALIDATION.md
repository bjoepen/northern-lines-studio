# Build 005 – Validation and Definition of Done

## Automated checks

Run from the repository root:

```bash
pnpm check
pnpm test
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
```

Expected: all commands complete successfully.

## Real-world Studio smoke test

```bash
pnpm tauri dev
```

Open:

```text
examples/Norway-Sample.nls
```

Verify:

- the workspace remains visually as calm as Build 004;
- Fjord remains Reference World 001;
- page navigation works for all eleven sample pages;
- selecting Bergen resolves `Destination` grammar;
- Bergen reports 100% required Story completeness while `Mitbringsel & Souvenirs` remains optional;
- Light resolves `Light`, Weather resolves `Weather`;
- ON1 and Luminar resolve `Workflow`;
- Notes resolves `Notes` and Abschluss resolves `Closing Memory`;
- Editorial Frame is presented as a single responsibility group;
- no new toolbar, layer palette or DTP-style control appears;
- responsive A5 preview behavior from Build 004 is unchanged.

## Migration checks

Confirm that `.nls` projects with format versions 0.1.0, 0.2.0 and 0.3.0 can still be opened through in-memory migration and are not rewritten merely by opening them.

## Repository hygiene

```bash
git status --short
git diff --check
git clean -ndX
```

Generated directories such as `node_modules/`, `dist/`, `.build/` and `src-tauri/target/` must not enter the commit.

## Definition of Done

- [ ] Svelte/TypeScript checks pass
- [ ] Vitest passes
- [ ] Vite build passes
- [ ] Rust tests pass
- [ ] Tauri smoke test passes
- [ ] Grammar Inspector is calm and readable
- [ ] all Fjord grammars resolve correctly
- [ ] old project formats migrate in memory
- [ ] repository hygiene is clean
