# ADR-030 – Content Fit before Composition

## Status
Accepted

## Context
A layout can be formally valid and still fail in real A5 content: a balanced two-column Interest layout allowed text to grow into protected Companion/Footer space. Earlier heuristics selected composition too early.

## Decision
Every page type uses a finite candidate set. Content is evaluated against all semantically allowed candidates before a final composition is selected. For two structured Interest entries the set is 1/2–1/2, 1/3–2/3, 2/3–1/3 and stacked.

Density is a later fallback, never a prerequisite for preserving a chosen layout. Interest Pages may use one fixed `tight` state. Other pages retain their existing no-font-shrink rule. If no candidate fits, Studio reports overflow.

Heterogeneous semantic entries remain separate units; a generic catch-all box is not a fallback strategy.

## Consequences
- Content Fit is now part of composition selection.
- Safe zones cannot be borrowed by a layout candidate.
- Asymmetric editorial layouts remain available.
- Preview logic stays finite and non-DTP.
