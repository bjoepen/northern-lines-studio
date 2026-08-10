# Build 023 – Destination Composition Refinement

**Studio:** 0.23.0
**Project format:** `.nls` 0.9.0 (unchanged)

## Purpose

Build 023 refines the three existing Destination compositions and improves Inspector ergonomics without adding new travel-domain features. The final UX / composition fix also removes unnecessary visual competition around the Hero image.

## Scope

- refine **Weite**, **Bild links**, **Bild rechts**;
- keep **Weite** clear of the title marker by letting the story follow the intrinsic panorama block plus a protected editorial gap;
- remove the decorative top rule from **Bild links** and **Bild rechts**;
- give **Bild rechts** slightly more text room;
- reduce Hero image controls to quiet contextual text actions: **+ Bild auswählen**, **Bild ersetzen · Entfernen**;
- preserve white / neutral-white Fjord Destination surface;
- automatically choose approved 1-/2-/3-column module groupings from semantic content density;
- keep tinted boxes semantic and exceptional;
- make the right Inspector resizable from 320 to 440 px;
- persist Inspector width locally only;
- preserve 15 mm Binding Safe Area, Companion position, footer and page number;
- keep `.nls` 0.9.0 unchanged.

## Out of scope

No new Editorial World, Page Archetype, crop/focal-point tool, Asset Manager, free grid/layout editing, new layout variants or schema fields.

## Product-DNA check

- Travelbook remains the primary surface.
- Inspector resizing is workspace ergonomics, not DTP.
- Composition remains grammar-controlled.
- Photography remains the atmospheric colour source on Fjord Destination pages.
- No content field is semantically repurposed.
- Image actions remain available without becoming a toolbar or card system.


## Final Polish Fix

- **Weite:** Hero-Medium und Titelblock sind nun strukturell getrennte Zonen. Der Titelblock beginnt mit einer festen Editorial-Ruhezone unter dem Panorama; `REISEZIEL` darf nicht in die sichtbare Bildwirkung rücken.
- **Inspector:** Die Bildrollen-Zeile ist jetzt ruhiger Meta-Kontext (`Bild links / Bild rechts`) statt einer zusätzlichen Zwischenüberschrift. Das erklärende „Für“ entfällt.
- Persistenz, `.nls`, Hero-Asset-Modell und Bildlogik bleiben unverändert.
