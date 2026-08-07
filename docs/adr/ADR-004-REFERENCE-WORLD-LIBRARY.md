# ADR-004 – Reference World Library

## Status
Accepted for Build 004.

## Context
Build 003 stored the complete Editorial World description inside each `.nls` project. That duplicated Northern Lines identity data in every Travelbook and made the project responsible for knowledge that belongs to Studio itself.

Build 004 establishes **Fjord** as Reference World 001 and separates project data from Northern Lines world definitions.

## Decision
- `.nls` stores only `editorialWorldId`.
- Studio owns the Editorial World Library.
- Build 004 ships exactly one world: `fjord`.
- Fjord defines its identity, design-language descriptors, Editorial Companion and supported page grammars.
- The Papageientaucher is modeled as `editorial_companion`, not as a generic icon or mascot.
- Unknown worlds are rejected by Studio with an understandable error instead of being invented or silently substituted.
- The World Library remains independent from the Northern Lines Publisher. Publisher integration is still out of scope.

## Consequences
The Travelbook stays compact and references a culture rather than embedding a theme. Future Editorial Worlds can be added deliberately without changing the project model beyond their ID.

The runtime world definition currently lives in TypeScript because Build 004 has no YAML runtime dependency. A data-driven external world-package format may be introduced later if it improves distribution without weakening validation.
