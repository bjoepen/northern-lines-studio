# Northern Lines Studio Project Format

**Current format:** `.nls` 0.8.0

An `.nls` document is an open package whose primary manifest is `project.json`. The project stores the journey and the author's editorial decisions. It does not duplicate Studio's World Library or Editorial Grammar Library and it does not contain Publisher render jobs as primary project data.

## Core structure

```text
<journey>.nls/
├── project.json
└── content/
    └── pages/
```

## Journey

The `journey` object describes the trip itself. Journey stages form the route. Since 0.8.0 destination stages can reference a stable Destination Profile:

```json
{
  "id": "bergen",
  "kind": "destination",
  "title": "Bergen",
  "country": "Norway",
  "destinationId": "destination-bergen"
}
```

The route order remains the order of `journey.stages`.

## Destination Profiles

Build 020 introduces top-level `destinations`:

```json
{
  "id": "destination-bergen",
  "name": "Bergen",
  "subtitle": "Tor zu den Fjorden",
  "introduction": "...",
  "journeyContext": {
    "arrival": "08:00 Uhr",
    "departure": "17:00 Uhr",
    "timezone": "MEZ / MESZ"
  },
  "reasons": [
    "Bryggen im Morgenlicht"
  ],
  "highlights": [
    {
      "id": "highlight-bryggen",
      "name": "Bryggen",
      "description": "Historische Hansehäuser",
      "category": "architecture"
    }
  ],
  "practicalInfo": [
    {
      "id": "practical-walk",
      "title": "Zu Fuß",
      "text": "Viele Highlights liegen dicht beieinander."
    }
  ],
  "editorial": {
    "layoutVariant": "destination-hero-banner"
  }
}
```

## Destination layout values

Only three semantic values are valid in 0.8.0:

- `destination-hero-banner`
- `destination-hero-left`
- `destination-hero-right`

They are editorial choices, not geometry descriptions. Coordinates and Publisher-specific layout measurements do not belong in `.nls`.


## Studio Travel Language for destination layouts

The persisted values remain technical and stable, while Studio presents them as Travel Language:

| `.nls` value | Studio |
|---|---|
| `destination-hero-banner` | **Weite** |
| `destination-hero-left` | **Bild links** |
| `destination-hero-right` | **Bild rechts** |

Build 020 Final introduces **no schema change** beyond 0.8.0 and stores no preview geometry. The exact A5 composition remains outside the project data.

## Migration 0.7.0 → 0.8.0

When a 0.7.0 project is opened:

1. every destination Journey Stage receives a stable `destinationId`;
2. a matching Destination Profile is created if absent;
3. the visible destination name is preserved;
4. an existing authored `introduction` is reused when available;
5. older `destination-standard` page layouts normalize to `destination-hero-banner`;
6. missing subtitles, reasons, highlights and practical information remain empty.

Migration must not invent editorial content.
