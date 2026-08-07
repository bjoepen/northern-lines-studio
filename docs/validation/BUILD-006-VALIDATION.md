# Build 006 – Validation and Definition of Done

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

Start Studio:

```bash
pnpm tauri dev
```

### A. Empty workspace

Before opening a project, maximize the window and verify:

- the bottom status area is a slim line, not a large empty panel;
- the center remains visually calm;
- the page placeholder uses the neutral message **Deine Reise beginnt hier.**;
- Sidebar and Inspector remain secondary to the page.

### B. Open Fjord reference project

Open:

```text
examples/Norway-Sample.nls
```

Verify:

- Reference World 001 – Fjord resolves unchanged;
- the eleven-page navigation from Build 005 remains intact;
- Editorial Grammar and Story Completeness remain intact;
- the A5 page becomes visibly larger in a maximized window than in Build 005;
- the page remains proportional and centered while resizing the window;
- the page never touches Sidebar, Inspector or window edges;
- switching Bergen → Geiranger → Licht uses only a subtle fade;
- no toolbar, panel or control has been added for the transition or scaling;
- the status line remains approximately 26 px high in all states.

### C. Resize matrix

Test at least:

1. minimum supported window size;
2. normal desktop window;
3. wide window;
4. tall window;
5. maximized window;
6. maximized → restored window.

In all cases the A5 aspect ratio must remain unchanged.

## Regression checks

Confirm:

- `.nls` project format remains `0.4.0`;
- 0.1.0–0.3.0 in-memory migration behavior is unchanged;
- Fjord remains the only approved Editorial World;
- all Build-005 grammars still resolve;
- no project file is modified merely by opening it.

## Repository hygiene

```bash
git status --short
git diff --check
git clean -ndX
```

Generated directories such as `node_modules/`, `dist/`, `.build/` and `src-tauri/target/` must not enter the commit.

## Definition of Done

- [ ] `pnpm check` passes
- [ ] Vitest passes
- [ ] Vite build passes
- [ ] Rust tests pass
- [ ] Tauri smoke test passes
- [ ] large empty bottom panel is gone
- [ ] A5 page uses maximized workspace more effectively
- [ ] page remains proportional at every tested window size
- [ ] page transition remains subtle
- [ ] Inspector remains calm and readable
- [ ] no new DTP-style controls were introduced
- [ ] repository hygiene is clean
