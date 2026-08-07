# ADR-008 – Semantic Story Authoring

**Status:** Accepted

## Decision
Northern Lines Studio authors content on semantic editorial components rather than arbitrary layout objects. An author edits an *Introduction*, *Photography Guidance* or *Northern Lines Knowledge* component; Studio does not expose free text frames, fonts, coordinates or shape tools as the primary authoring model.

Authoring data is persisted per page and per Editorial Component with a small editorial status lifecycle: `empty`, `draft`, `revised`, `approved`, `final`.

## Rationale
The author should decide what a page says. Editorial Grammar and the Publisher decide how that meaning becomes a Northern Lines page. This preserves the quiet workspace and keeps authoring independent from rendering geometry.

## Consequences
- `.nls` format advances to 0.5.0.
- Build-009 format 0.4.0 migrates in memory when opened.
- Authoring writes are explicit and project-local.
- Rich text, font controls and free layout remain out of scope.
