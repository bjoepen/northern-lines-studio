# Build 022 – Destination Imagery Foundation / Image Composition Fix

**Studio:** 0.22.0
**Project format:** `.nls` 0.9.0

## Purpose

Build 022 gives Destination Pages real imagery without turning Northern Lines Studio into a media manager.

> **Studio understands which image opens a place – and composes it as part of the page rather than mounting it in a box.**

## Destination image roles

A Destination may hold two optional semantic image roles:

- **Weite** – broad panorama;
- **Bild links / Bild rechts** – one shared portrait-oriented lead image.

The visible UI never exposes internal asset paths.

## Geometry help

Next to the image action a small `?` help shows a source-geometry corridor:

- Weite: broad panorama, about **3:1–4:1**, at least **2400 px wide**;
- Bild links / Bild rechts: about **2:3 / 1500 × 2250 px**.

These are preparation guidelines, not fixed Publisher geometry.

## Project-contained images

Selected JPEG/PNG files are copied into:

```text
<reise>.nls/assets/destinations/<destinationId>/
```

The `.nls` manifest stores project-relative paths only.

## Image Composition Fix

Real Bergen test imagery showed that fixed coloured media boxes made the image feel inserted rather than editorially composed.

Build 022 Final therefore defines:

- Fjord Destination pages use a **white / neutral-white** paper surface;
- a selected image loses the coloured placeholder background and border treatment;
- prepared source ratio determines the preview image height within the approved grammar;
- **Weite** becomes an atmospheric panorama zone, not a fixed-height banner card;
- **Bild links** and **Bild rechts** use the same portrait source role;
- information modules use rhythm and dividers rather than automatic Card UI;
- a softly tinted practical-information area may remain as a deliberate editorial accent.

Studio still stores no crop, focal point, x/y coordinate or free geometry.

## Physical layout rules

- Binding Safe Area: **15 mm technical minimum** for relevant content.
- Fjord Companion remains at its established Editorial-World home.
- Destination layout rules do not move the Companion.
- Footer and page number remain invariant.

## Out of scope

No crop, focal point, asset library, free image placement, free sizing, EXIF, gallery, AI image selection, page background themes or new layout variants.

## Consistency chain

```text
Model
→ Rust
→ Compatibility
→ Command
→ Inspector
→ Geometry Help
→ Image Composition
→ White Fjord Surface
→ 15 mm Binding
→ Companion Invariance
→ Tests
```
