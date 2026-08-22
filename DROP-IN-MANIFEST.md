# DROP-IN MANIFEST — Northern Lines Studio Build 040

## Build

**Build 040 — Exact A5 Geometry Foundation**

## Purpose

Correct the outer Studio page to the exact DIN A5 aspect ratio while preserving the complete Build 039 Golden Composition at `420 × 594 u`.

## Included changes

- `package.json` — version `0.40.0-alpha.1`, Build 040 consistency gate
- `src/lib/preview.ts` — exact A5 page height and Golden Composition constants
- `src/lib/preview.test.ts` — exact-ratio and Golden-height tests
- `src/styles/base-shell.css` — exact A5 outer page, preserved Golden footer/companion geometry
- `src/styles/book-utility-pages.css` — preserved Notes bottom anchor
- `src/styles/destination-foundation.css` — preserved Destination companion anchor and clarified geometry contract
- `src/styles/destination-interests.css` — preserved hard footer/companion anchors
- `src/styles/editorial-worlds.css` — preserved world-specific companion anchor
- `scripts/check-build-039-editorial-consistency.mjs` — historical 039 gate no longer pins the old release version
- `scripts/check-build-040-a5-geometry-consistency.mjs` — Build 040 geometry gate
- `src-tauri/Cargo.toml`, `Cargo.lock`, `tauri.conf.json` — version parity only
- `docs/builds/BUILD-040.md` — Build contract and DoD

## Explicitly unchanged

- `.nls` schema/content
- Editorial World contracts
- typography
- Hero geometry
- Capacity/grammar logic
- Tauri runtime behavior
- print/PDF implementation
- dependencies

## Pre-delivery Quality Gate executed by ChatGPT

- Build 040 specific consistency gate: PASS
- Full cumulative `npm run consistency`: PASS through Build 040
- Diff audit against uploaded clean `main`: PASS

The local toolchain gates remain intentionally user-run:

```text
pnpm check
pnpm test
pnpm consistency
pnpm build
cargo test
macOS app build/install
```
