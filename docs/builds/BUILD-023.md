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

## Final Weite Spacing Fix

The `Weite` grammar now owns an explicit protected breathing zone after the panorama. The spacing is attached to the hero block itself rather than to the title copy. This prevents the `REISEZIEL` marker from visually entering the watercolor edge while keeping the hero asset model and persisted layout semantics unchanged.

## Final Weite Grammar Consolidation

The previous visual spacing patches were superseded after real-world review showed that `REISEZIEL` could still sit inside the watercolor transition. Build 023 now uses one authoritative grid grammar for **Weite**:

1. Hero / panorama
2. explicit 18 px title-safe zone
3. Destination story beginning with `REISEZIEL`
4. semantic modules

The safe zone is a real layout row, not margin or padding on the image or title copy. Accumulated Weite-specific spacing overrides from Build 021/022/023 have been removed. `Bild links` and `Bild rechts`, the Hero asset model, persistence and `.nls` 0.9.0 are unchanged.

## Final Zone Separation Fix

The final Build-023 correction replaces the remaining image-dependent `Weite` geometry with a strict semantic zone contract:

- Hero Zone: fixed grammar-owned corridor (`118px` in Studio's 420×594 A5 preview grammar);
- Hero image: `width/height: 100%`, `object-fit: contain`, clipped to the Hero Zone;
- Title Safe Zone: separate `20px` row;
- Title Zone: begins only after the protected row;
- no intrinsic image height may enlarge the Hero Zone;
- no source-specific crop or focal-point UI is introduced.

This is deliberately not a Bergen-specific fix. The same rule must remain stable for other panorama ratios and image styles.

## Final Weite Editorial Composition Fix

Real-world review after strict zone separation showed that the protected Hero/Title
boundary worked, but the vertically stacked title and introduction consumed too
much of the page and pushed semantic modules toward the Companion/Footer safe zone.

The final composition therefore keeps the zone contract and changes only the
internal grammar of the **Title Zone**:

- the legacy horizontal rule below the panorama is removed;
- `REISEZIEL`, place title and subtitle remain one title block;
- the introduction is composed beside that title block;
- a restrained vertical divider separates title and introduction by editorial role;
- facts and semantic modules move upward without shrinking typography;
- Companion and Footer remain invariant and are not used as overflow space;
- `Bild links` and `Bild rechts` remain unchanged;
- `.nls` 0.9.0 and image persistence remain unchanged.

This is still curated Layout Grammar: no x/y coordinates, free boxes or user-editable
column geometry are introduced.
