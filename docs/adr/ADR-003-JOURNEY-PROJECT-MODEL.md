# ADR-003 – Journey Project Model

## Status

Accepted for Build 003.

## Context

Build 002 can open a `.nls` package and present its pages in a calm editorial workspace. The grouping is still derived from technical page types. Studio therefore knows how to display a Travelbook, but not yet what a journey, a destination, a knowledge page or a closing memory means.

Northern Lines Studio must remain independent from Publisher internals. The user-facing project model must describe journeys, page roles and editorial context rather than render jobs, regions or millimetre geometry.

## Decision

Build 003 introduces `.nls` project format `0.2.0` and a normalized Journey Project Model with these domain concepts:

- `Journey`
- `JourneyStage`
- `PageRole`
- `EditorialWorldReference`
- `StudioPage`

Page navigation is derived from `PageRole`, not from technical layout types.

The project loader in the Tauri/Rust boundary owns normalization and migration. The Svelte UI receives only the normalized `0.2.0` domain model.

## Migration

Build-001/002 `.nls` projects with format `0.1.0` remain readable.

On load, Studio:

1. recognizes `0.1.0`,
2. derives a minimal Journey from existing destination pages,
3. infers editorial roles from the existing page type,
4. links destination pages to the inferred Journey stages,
5. exposes the normalized project as `0.2.0`,
6. records `migratedFromVersion: "0.1.0"` in memory.

The source project is not rewritten automatically.

## Consequences

Positive:

- Studio begins to understand a Travelbook as a journey.
- UI grouping becomes author-facing and semantic.
- future `.nls` migrations have a defined ownership boundary.
- Publisher-specific geometry remains outside the Studio project model.

Trade-offs:

- Build 003 introduces the first format migration path.
- legacy inference is intentionally conservative and cannot reconstruct information that never existed in `0.1.0`.

## Non-goals

This ADR does not introduce Publisher integration, rendering, Knowledge Library editing, free layout editing or additional Editorial Worlds.
