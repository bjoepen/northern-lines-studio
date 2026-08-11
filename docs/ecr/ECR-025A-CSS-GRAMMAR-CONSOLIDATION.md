# ECR-025A – CSS & Grammar Consolidation

## Problem

The Build 024 UI is visually approved, but `src/styles.css` accumulated historical build-layer overrides during rapid grammar refinement. Adding a second Editorial World on top of that would increase coupling between shared layout grammar and Fjord expression.

## Decision

Consolidate and modularise CSS before the Ostsee PoC. Preserve final computed values and all user-visible behaviour. Do not use 025A to redesign Fjord.

## Definition of Done

- CSS responsibilities are separated into reviewable modules.
- Known historical duplicate overrides for Weite and Bild rechts are collapsed into authoritative rules.
- A consistency gate protects the consolidated structure and approved invariants.
- `.nls` remains `0.10.0`.
- Real-world visual regression against Build 024 is green.
