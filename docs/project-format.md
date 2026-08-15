# Northern Lines Studio Project Format

**Current format:** `.nls` 0.11.0

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
  "images": {
    "wide": "assets/destinations/destination-bergen/wide.jpg",
    "portrait": "assets/destinations/destination-bergen/portrait.jpg"
  },
  "editorial": {
    "layoutVariant": "destination-hero-banner"
  }
}
```

## Destination layout values

Only three semantic layout values are valid in 0.9.0:

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


## Build 021 – Layout resilience without schema expansion

Build 021 keeps `.nls` at **0.8.0**. Binding safety, title/companion/footer safe areas and content-capacity states are preview/publishing concerns and are **not persisted** as coordinates or layout metadata.

Arrival and departure remain semantic string values. Studio normalises a trailing German `Uhr` in the editing draft and adds `Uhr` when rendering clock-like values such as `08:00`. No schema migration is required.

Future optional content such as Souvenirs, country-specific guidance, Northern Lines Wissen or Photography must receive dedicated semantic fields in a later approved build; existing fields must not be repurposed.


## Build 022 – Destination imagery / format 0.9.0

Build 022 adds an optional `images` object to each Destination Profile. The final Build-022 grammar uses two semantic image roles for the three existing page effects:

```json
"images": {
  "wide": "assets/destinations/destination-bergen/wide.jpg",
  "portrait": "assets/destinations/destination-bergen/portrait.jpg"
}
```

`wide` serves **Weite**. `portrait` is shared by **Bild links** and **Bild rechts**. Pre-final Build-022 projects containing `left` or `right` may be read as compatibility fallbacks; new writes use `portrait`.

Rules:

- paths are project-relative and live below `assets/destinations/`;
- JPEG and PNG are supported in Build 022;
- Studio copies selected files into the `.nls` package;
- final crop coordinates are not persisted;
- image box dimensions are not persisted; Studio Preview may derive visible height from the prepared source ratio inside the Layout Grammar;
- there is no Asset ID, crop, focal point or free x/y position in the 0.9.0 schema.

### Migration 0.8.0 → 0.9.0

Opening a 0.8.0 project adds an empty image-role structure through serde defaults. Existing Journey, Destination, layout and editorial data remain unchanged. Migration never invents or downloads imagery.

### Physical layout rule

The technical minimum binding zone is **15 mm** from the left page edge. It is a publishing/layout constraint and is not stored as per-page geometry. The Fjord Companion keeps its Editorial-World position independently of this content inset.


### Fjord Destination surface and image composition

For Fjord Destination Pages, `.nls` does not store a page background choice. The Editorial World defines a white / neutral-white page surface for **Weite**, **Bild links** and **Bild rechts**.

Selected imagery is composed directly on that surface. Coloured image-card backgrounds and arbitrary image-box geometry are not project data. Information modules are likewise not automatically persisted or rendered as cards; selective tinted editorial accents remain a grammar concern.


## Build 023 – no project-format change

Build 023 changes only derived Editorial Preview composition and local workspace ergonomics. `.nls` remains **0.9.0**. Inspector width and 1-/2-/3-column preview grouping are not persisted.

## Build 024 – Destination Editorial Extensions (`0.10.0`)

Destination Profiles können ab 0.10.0 eine optionale Liste `editorialExtensions` tragen:

```json
{
  "editorialExtensions": [
    {
      "id": "extension-hanse",
      "kind": "knowledge",
      "title": "Hanse in Bergen",
      "text": "Bryggen erzählt von Bergens jahrhundertelanger Rolle im Hansehandel."
    }
  ]
}
```

Erlaubte Foundation-Kinds: `knowledge`, `photo_spot`, `tip`, `souvenir`, `important`, `history`.

Die Daten speichern Semantik und Inhalt, aber keine Farbe, Box-Geometrie, Koordinaten oder Signet-Dateipfade. Diese Expression gehört zur Editorial World und Layout Grammar.


## Editorial Worlds · Build 025B

`editorialWorldId` unterstützt `fjord` und `baltic`. Der World-Wechsel ändert keine Schema-Version und keine semantischen Reiseinhalte.


## Build 026 – Destination Interest Pages (`0.11.0`)

Build 026 introduces destination-bound thematic pages without duplicating the Destination Profile. A thematic page stays in `pageManifest`, references the existing Journey Stage through `journeyStage`, and stores only the semantic interest kind:

```json
{
  "id": "page-bergen-photography",
  "order": 11,
  "type": "destination_interest",
  "role": "destination",
  "title": "Fotografie",
  "content": "content/pages/011-bergen-photography.md",
  "layout": "destination-interest",
  "journeyStage": "bergen",
  "destinationInterestKind": "photography"
}
```

Allowed interest kinds in the Foundation are:

- `photography`
- `hiking_nature`
- `culture_history`
- `culinary_local`

A destination may carry several different interest pages. Build 026 deliberately allows only one page per interest kind and destination; this keeps the vocabulary finite and avoids duplicate technical page variants.

The page does **not** persist World colours, typography, Companion position or free layout geometry. Those remain World/Grammar responsibilities.

### Migration 0.10.0 → 0.11.0

Opening a Build-025/0.10.0 project updates `formatVersion` to 0.11.0. Existing Journey, Destination, imagery, Editorial Extensions and page content remain unchanged. No interest page is invented during migration. New interest pages exist only after an explicit author action in Studio.
