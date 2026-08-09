# Build 022 – Destination Imagery Foundation

**Studio:** 0.22.0
**Project format:** `.nls` 0.9.0

## Purpose

Build 022 gives Destination Pages real imagery without turning Northern Lines Studio into a media manager.

> **Studio understands which image opens a place.**

## What changed

### Destination image roles

A Destination may hold three optional image roles:

- **Weite** – broad, flat panorama;
- **Bild links** – portrait-oriented lead image;
- **Bild rechts** – portrait-oriented lead image.

The visible UI never exposes internal asset paths.

### Geometry help

Next to the image action a small `?` help shows the recommended source geometry:

- Weite: ca. 4:1 / 2400 × 600 px;
- Bild links / Bild rechts: ca. 2:3 / 1500 × 2250 px.

### Project-contained images

Selected JPEG/PNG files are copied into:

```text
<reise>.nls/assets/destinations/<destinationId>/
```

The `.nls` manifest stores project-relative paths only.

### Preview

Studio renders the selected role in the active Destination page effect. It deliberately uses a non-destructive fit and does not invent crop coordinates.

### Layout corrections

- Binding Safe Area is now a **15 mm technical minimum** for relevant content.
- The Fjord Companion returns to its established Editorial-World home.
- Destination layout rules no longer move the Companion horizontally.

## Out of scope

No crop, focal point, asset library, free image placement, EXIF, gallery, AI image selection or new layout variants.

## Consistency chain

```text
Model
→ Rust
→ Migration
→ Command
→ Inspector
→ Geometry Help
→ Preview
→ 15 mm Binding
→ Companion Invariance
→ Tests
```
