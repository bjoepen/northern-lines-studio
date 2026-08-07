# Northern Lines Studio Project Format

## Current version

`.nls` format: **0.4.0**

A `.nls` project is a transparent project directory with the `.nls` extension. Build 005 continues to use `project.json` as the manifest while the domain model evolves.

## Principle

The project stores the journey and the author's editorial decisions. It does not duplicate Studio's World Library or Editorial Grammar Library and does not contain Publisher render jobs as primary project data.

## Editorial World reference

```json
{
  "editorialWorldId": "fjord"
}
```

The world definition remains owned by Studio.

## Story component presence

Build 005 adds a per-page `components` list. It records which editorial Story components are present without copying the grammar itself:

```json
{
  "id": "page-bergen",
  "type": "destination",
  "components": [
    "hero",
    "title",
    "introduction",
    "history",
    "photography",
    "knowledge",
    "qr"
  ]
}
```

The Destination grammar itself remains in Studio and can therefore evolve independently under versioned rules.

## Core manifest shape

```json
{
  "format": "northern-lines-studio-project",
  "formatVersion": "0.4.0",
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

- 0.4.0 – current Build-005 format; pages declare present Story components.
- 0.3.0 – Build-004 format; component presence is inferred in memory from page semantics.
- 0.2.0 – Build-003 format; embedded Editorial World is normalized and components are inferred.
- 0.1.0 – legacy format; Journey, roles, Fjord reference and components are inferred in memory.

Studio never rewrites the source project merely because it was opened through a migration path.
