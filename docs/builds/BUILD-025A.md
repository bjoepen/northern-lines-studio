# Build 025A – CSS & Grammar Consolidation

**Phase:** 025A of Build 025  
**Purpose:** clean technical baseline before the Ostsee Editorial World PoC.

## Goal

Build 025A deliberately introduces **no new traveller-facing feature and no visual redesign**. It consolidates the approved Build 024 styling and layout grammar so Build 025B can add a second Editorial World without stacking new world rules on historical Fjord overrides.

> 025A is complete when Build 024 is reproduced visually, while CSS responsibilities are explicit and the cascade is reviewable.

## Changes

The former monolithic `src/styles.css` is now an import manifest. CSS is separated into:

- `base-shell.css` – application shell, navigation, canvas and shared page chrome;
- `destination-editor.css` – Ortsprofil/Inspector authoring surfaces;
- `destination-foundation.css` – protected zones, content-capacity foundation and image-picker foundation;
- `destination-imagery.css` – approved image composition and white-surface Fjord treatment;
- `destination-composition.css` – final Weite/Bild links/Bild rechts composition and adaptive title grammar;
- `editorial-extensions.css` – Editorial Extension Zones, adaptive extension grammar and capacity protection.

Two historical cascade residues were folded into their authoritative rules without changing their final values:

- Bild rechts keeps the approved `1.10 / 0.90` base proportion in one rule;
- Weite keeps the approved `16px` Title Safe gap in one rule.

## Invariants

025A must not change:

- `.nls` format `0.10.0`;
- Destination semantics or persistence;
- Weite / Bild links / Bild rechts appearance;
- adaptive long-place-name behaviour;
- Editorial Extension Zone rendering;
- Extension Capacity Protection;
- Companion position or Safe Zone;
- footer/page-number behaviour;
- inspector resize behaviour;
- Travel Language.

## Why now

Build 025B introduces Ostsee as the second Editorial World. Shared grammar must therefore be distinguishable from World Expression before another world is added. 025A is housekeeping, not theming.
