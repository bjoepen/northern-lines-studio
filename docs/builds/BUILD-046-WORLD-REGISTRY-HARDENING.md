# Build 046A · World Registry Hardening

## Purpose

Build 046 begins with platform hardening before the Mediterranean World is integrated.
The goal is to remove two-World-specific extension mechanics without changing page semantics, layout grammar, `.nls`, or production rendering.

## Decisions

### World-owned curated assets

Curated heroes, Welcome, Closing and curated utility accents are now resolved through one finite `WorldAssetManifest` registry.

The manifest owns only world-owned visual vocabulary. Project-owned destination photography remains inside `.nls/assets/destinations/` and is not part of this registry.

### Companion layout registry

Companion layout rules now have a stable registry lookup by `companionLayoutId`.
Existing Fjord and Ostsee exports remain compatible while future Worlds gain a data-driven extension point.

## Architectural invariant

```text
New World
→ World definition
→ Layout system
→ Companion definition + companion layout
→ finite World asset manifest
→ shared page grammar
```

A new World must not require a new page grammar or a renderer branch merely to exist.

## Scope intentionally deferred to 046B

- dynamic renderer World class
- App.svelte companion-layout lookup through the registry
- Mediterranean World registration
- Mediterranean tokens / CSS expression
- Iberia activation
- Mediterranean curated assets

These are wired only after the registries themselves are protected by tests and consistency checks.

## No-change guarantees

- no `.nls` format bump
- no migration
- no Page Grammar change
- no Destination Layout change
- no Production/PDF renderer change
- no Fjord/Ostsee visual change
