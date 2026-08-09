# ADR-020 – Destination Image Roles and Image Composition

**Status:** Accepted for Build 022 Final
**Decision:** Destination imagery is stored as semantic project-relative image roles; Studio composes prepared imagery inside the Editorial Grammar and does not persist crop or final layout coordinates.

## Context

Destination Pages need real imagery, but Northern Lines Studio must not become an Asset Manager or free DTP tool. The Build-022 preview also showed that fixed coloured media boxes weaken the Fjord language: prepared watercolor imagery should be able to merge visually with the neutral-white paper surface instead of being mounted inside a rigid card.

The mirrored page effects **Bild links** and **Bild rechts** use the same source geometry in the current Fjord grammar. Maintaining separate left and right source roles would ask the traveller for a distinction that carries no editorial value.

## Decision

Each Destination may optionally store two semantic image roles:

- `wide` → **Weite**
- `portrait` → shared source for **Bild links / Bild rechts**

Images are copied into the open `.nls` package below `assets/destinations/<destinationId>/`. The project stores project-relative paths only.

Studio shows **Bild des Ortes** and the relevant Travel-Language role. A contextual `?` help displays recommended source geometry. Build 022 supports JPEG and PNG.

### Image composition

A selected image is not rendered inside a coloured media card. The Fjord Destination page remains neutral-white and the image is composed directly on that paper surface.

The Studio preview preserves the prepared source ratio (`object-fit: contain`) and allows the image zone to derive its visible height from that ratio inside the approved grammar. This is controlled composition, not free geometry.

The three page effects remain exactly:

- **Weite** – atmospheric panorama zone;
- **Bild links** – portrait image leads from the left;
- **Bild rechts** – the story leads and the same portrait role accompanies it on the right.

Studio does not persist:

- crop rectangles;
- focal points;
- image x/y coordinates;
- arbitrary transforms;
- free image-box geometry;
- Asset IDs exposed to the traveller.

Northern Lines Publisher remains authoritative for final geometry and Content Fit.

## Fjord surface rule

Destination Pages use the same white / neutral-white paper surface for **Weite**, **Bild links** and **Bild rechts**. Photography is the primary atmospheric colour source. Typography, accent colour, Companion, Footer, Signet and selective editorial accents provide World identity.

Information modules are not automatically rendered as cards. A softly tinted information area is a deliberate editorial accent, not a general Card UI system.

## Physical layout correction

The technical minimum binding zone is **15 mm** for relevant content. The Fjord Companion is positioned by the Editorial World and is not shifted by the binding inset. Its established horizontal home remains invariant across eligible page archetypes.

## Compatibility

Pre-final Build-022 projects may contain `left` and `right` image paths. Studio may read these as compatibility fallbacks for the shared portrait role. New writes use `wide` and `portrait`.

## Consequences

Positive:

- only two image decisions are required for the current three page effects;
- watercolor imagery can merge naturally with the Fjord paper surface;
- projects remain portable because images live inside `.nls`;
- Travel Language stays simple;
- no premature crop/asset subsystem is required;
- the same Destination remains semantically independent from final Publisher geometry.

Trade-off:

- authors may still prepare a panorama and a portrait source for the same destination;
- unsuitable source geometry is preserved rather than silently cropped;
- Publisher must later formalize the same composition rules for authoritative output.
