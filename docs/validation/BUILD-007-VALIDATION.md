# Build 007 – Validation and Definition of Done

## Automated quality gates

```bash
pnpm check
pnpm test
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
```

## Real-world macOS review

Run:

```bash
pnpm tauri dev
```

Validate both normal and maximized window states.

### Empty state

- brand block is vertically centered in the navy header;
- project control is vertically centered;
- no project context is invented in the center;
- Editorial Desk remains the dominant visual area.

### Open Norway sample

- `Norwegen Fieldbook` is centered in the header;
- `Editorial World · Fjord` appears as secondary context;
- brand, center context and project control share one calm vertical axis;
- project button no longer dominates the header;
- sidebar, page, inspector and status line are unchanged in hierarchy;
- page focus remains stronger than application chrome.

## Repository hygiene

```bash
git status --short
git diff --check
```

## Definition of Done

Build 007 is complete when the header visually belongs to Northern Lines rather than reading as a generic toolbar.
