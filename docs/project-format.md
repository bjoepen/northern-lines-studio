# Northern Lines Studio Project Format

## Current version

`.nls` format: **0.3.0**

A `.nls` project is a transparent project directory with the `.nls` extension. Build 004 continues to use `project.json` as the project manifest while the domain model evolves.

## Principle

The project stores the journey and the author's editorial decisions. It must not duplicate Northern Lines Studio's internal World Library and must not contain Publisher render jobs as primary project data.

## Editorial World reference

Build 004 replaces the embedded world object used by Build 003 with a stable reference:

```json
{
  "editorialWorldId": "fjord"
}
```

`fjord` is resolved by Studio's World Library. The current project therefore does not own colors, Companion definitions, grammar lists or other World identity data.

## Core manifest shape

```json
{
  "format": "northern-lines-studio-project",
  "formatVersion": "0.3.0",
  "projectId": "nl-norway-sample",
  "title": "Norwegen Fieldbook",
  "edition": "2.0",
  "language": "de",
  "editorialWorldId": "fjord",
  "journey": {},
  "document": {
    "pageFormat": "A5",
    "orientation": "portrait"
  },
  "pageManifest": []
}
```

## Compatibility

- 0.3.0 – current Build-004 format; project references an Editorial World by ID.
- 0.2.0 – Build-003 format; embedded `editorialWorld` is normalized in memory to `editorialWorldId`.
- 0.1.0 – legacy format; page roles and Journey data are inferred in memory and Fjord is retained as the historical reference world.

Studio never rewrites the source project merely because it was opened through a migration path.
