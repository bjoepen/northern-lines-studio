# ADR-025B · Editorial World Contract & Ostsee PoC

## Status
Accepted for Build 025B.

## Decision
Northern Lines Studio supports multiple curated Editorial Worlds through a shared semantic and layout contract. Build 025B activates Ostsee beside Fjord without creating a general theme editor.

World-specific concerns: typography, palette, companion and limited expression of semantic extensions. Shared concerns: project semantics, adaptive Layout Grammar, signets, Safe Zones, Content Capacity and destination page effects.

The selected World is persisted through `editorialWorldId`. No new `.nls` schema field is introduced.

## Consequences
A future World must satisfy the Editorial World Contract instead of adding bespoke page logic. World switching must preserve content identity and publishing semantics.
