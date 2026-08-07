# ADR-007 – Editorial Companion System

**Status:** Accepted  
**Build:** 009

## Context

Northern Lines Editorial Worlds use recurring visual companions to connect pages, places and memories. The concept must not degrade into a generic asset picker or mascot system.

## Decision

1. Every active Editorial World references exactly one Companion by stable `companionId`.
2. Companion definitions live in a central Studio registry; visual source assets and metadata live in the Northern Lines Design Library.
3. Companions are part of editorial identity, not generic UI decoration and not freely created DTP layers.
4. Planned Companion concepts may be preserved before their Editorial World ships. This does not make the corresponding World available in Studio.
5. Asset existence and production readiness are separate states. A source image may remain in the collection while requiring transparency or editorial cleanup.

## Consequences

Studio and Publisher can later resolve a World to a stable Companion contract without embedding file paths in `.nls` projects. The current `.nls` project format remains unchanged at `0.4.0`.
