# Build 046B · World Wire-up Hardening

## Goal

Remove the remaining concrete Fjord/Ostsee renderer wiring before adding a third Editorial World.

## Invariants

- No `.nls` schema or migration change.
- No Page Grammar change.
- No renderer branch for a concrete Editorial World.
- Existing Fjord and Ostsee output must remain visually and functionally unchanged.
- Companion visibility semantics remain unchanged.

## Changes

- Resolve Companion layout through the Companion layout registry instead of direct Fjord/Ostsee imports.
- Derive the A5 World CSS class dynamically from the active Editorial World id.
- Preserve existing class names (`fjord-page`, `baltic-page`) so current CSS remains unchanged.

## Definition of Done

- `App.svelte` contains no direct `fjordCompanionLayout` / `balticCompanionLayout` dependency.
- `App.svelte` contains no explicit Fjord/Ostsee World-class conditionals.
- Existing Fjord and Ostsee pages render unchanged.
- Full consistency, type check, tests and production build pass.
