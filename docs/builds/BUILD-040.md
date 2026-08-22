# Build 040 — Exact A5 Geometry Foundation

## Status

Candidate for the next Northern Lines Studio Golden Build.

## Purpose

Build 040 corrects the outer Studio page to the exact DIN A5 aspect ratio while preserving the complete Build 039 Golden Composition.

```text
Physical Studio page       420 × 595.945945946 u
Golden Composition         420 × 594 u
A5 extension                       1.945945946 u
```

The extension exists only below the established Golden Composition. Existing editorial geometry is not reflowed or rescaled.

## Binding contract

```text
420 Studio units = 148 mm
595.945945946 u = 210 mm
```

The same logical unit therefore applies uniformly in X and Y.

## Preserved invariants

- Build 039 composition remains 420 × 594 u.
- Footer Golden Y position remains unchanged.
- Companion Golden Y positions remain unchanged.
- Destination binding safe zone remains 42.57 u.
- Companion safe width remains 78 u.
- Companion safe height remains 76 u.
- Typography is unchanged.
- Hero geometry is unchanged.
- Editorial World expression is unchanged.
- Capacity and grammar rules are unchanged.
- `.nls` is unchanged.
- No print/PDF implementation is introduced by Build 040.

Bottom-anchored invariants preserve their previous page-relative Y coordinate by adding the A5 extension to their bottom offset.

## Quality gate

```bash
pnpm check
pnpm test
pnpm consistency
pnpm build

cd src-tauri
cargo test
```

Build-specific gate:

```bash
node scripts/check-build-040-a5-geometry-consistency.mjs
```

Build 040 may become the Golden Build only after all gates pass and visual Studio regression confirms the Build 039 composition is unchanged.
