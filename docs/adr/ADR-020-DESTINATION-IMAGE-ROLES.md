# ADR-020 – Destination Image Roles inside `.nls`

**Status:** Accepted for Build 022
**Decision:** Destination imagery is stored as semantic project-relative image roles; Studio does not store crop or final layout coordinates.

## Context

Destination Pages now need real imagery. A single uncropped photo cannot reliably serve the very different geometries of **Weite**, **Bild links** and **Bild rechts**. At the same time Northern Lines Studio must not become an Asset Manager or free DTP tool.

## Decision

Each Destination may optionally store three image roles:

- `wide` → **Weite**
- `left` → **Bild links**
- `right` → **Bild rechts**

Images are copied into the open `.nls` package below `assets/destinations/<destinationId>/`. The project stores only project-relative paths.

Studio shows **Bild des Ortes** and the relevant Travel-Language role. A contextual `?` help displays recommended geometry. Build 022 supports JPEG and PNG.

Studio does not persist:

- crop rectangles;
- focal points;
- image x/y coordinates;
- arbitrary transforms;
- Asset IDs exposed to the traveller.

Northern Lines Publisher remains authoritative for final geometry and Content Fit.

## Physical layout correction

The technical minimum binding zone is **15 mm** for relevant content. The Fjord Companion is positioned by the Editorial World and is not shifted by the binding inset. Its established horizontal home remains invariant across eligible page archetypes.

## Consequences

Positive:

- suitable source geometry can be prepared before import;
- projects remain portable because images live inside `.nls`;
- Travel Language stays simple;
- no premature crop/asset subsystem is required;
- the same Destination remains semantically independent from final Publisher geometry.

Trade-off:

- authors may prepare more than one source image for the same destination;
- unsuitable source geometry may letterbox in Studio Preview because Build 022 deliberately uses non-destructive `contain` rendering.
