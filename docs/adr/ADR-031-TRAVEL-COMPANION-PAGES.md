# ADR-031 — Travel Companion Pages

## Status
Accepted for Build 031.

## Decision
Northern Lines Studio introduces **Travel Companion Pages** as a first-class editorial category for reusable knowledge. Curated core content lives with Studio and is not duplicated into each `.nls` project. A project may store only explicitly travel-specific additions.

The first implementation is **Licht**. Its reusable core is researched and source-traceable. The optional `introduction` authoring component is reserved for the short travel-specific note **Für diese Reise**.

## Consequences
- no repeated manual authoring of general light knowledge;
- no destination/date-specific sun times in static curated copy;
- source provenance becomes part of the content-maintenance contract;
- `.nls` advances to 0.15.0 so existing light pages receive the correct semantic component set;
- global Content Fit and Safe-Zone rules remain authoritative.
