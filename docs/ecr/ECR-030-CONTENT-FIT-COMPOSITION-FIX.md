# ECR-030 – Global Content Fit & Composition Fix

## Change
Replace early Interest composition selection with finite candidate evaluation and promote the same Content-Fit-before-Composition contract to the global Layout Grammar.

## Scope
- Interest candidates: 1/2–1/2, 1/3–2/3, 2/3–1/3, stacked.
- remove catch-all `grouped` Interest composition.
- choose `comfortable` candidate first; Interest-only fixed `tight` candidate second; otherwise overflow.
- preserve all Companion/Footer safe zones.
- document the rule globally for Destination and future page grammars.

## Non-goals
- no free layout controls;
- no new `.nls` schema;
- no map implementation;
- no new typography level.
