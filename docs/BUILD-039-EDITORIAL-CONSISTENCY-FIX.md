# Build 039 — Editorial Consistency Fix

Build 039 is a deliberately narrow correction build. It introduces no new page grammar, no new user controls and no `.nls` migration.

## Approved corrections

### Orientierung

The visible duplicate eyebrow **Orientierung** is removed. The actual page title **Orientierung** remains unchanged. Grouping, page numbers, navigation and the internal persistence key `contents` are untouched. The page remains image-free.

### Erinnerungen · Ostsee

The Ostsee writing boxes receive a very light ochre warmth using the existing Baltic `Amber` and `Warm Paper` palette. The physical A5 page remains literal white. Fjord styling is unchanged. Companion, Footer and writing geometry are unchanged.

### Curated Accent contract repair

Build 038 made Orientierung deliberately image-free and removed the obsolete `contents` accent assets. Build 039 therefore restores the Curated Accent API and tests to the contract-correct single key `notes`. The stale test/implementation mismatch discovered during the Build 038 align is removed.

## Scope freeze

No additional refactoring, layout changes, asset pickers, schema changes, page-type changes or world-expression redesign are part of this build.

## Compatibility

No `.nls` migration is required. Existing persistence identifiers remain unchanged.
