# Build 023 – Release Notes

## Finaler UX- / Composition-Fix

- **Weite:** der Titelbereich folgt dem intrinsischen Panorama mit geschütztem Abstand; `REISEZIEL` konkurriert nicht mehr mit dem Bild;
- **Bild links / Bild rechts:** die rein dekorative obere Linie entfällt;
- **Bild rechts:** leicht mehr Raum für die Textspalte;
- **Hero-Bild im Inspector:** keine Button-Gruppe mehr, sondern ruhige kontextuelle Textaktionen nach dem Vorbild von `+ Ort hinzufügen`;
- ohne Bild: `Noch kein Bild gewählt` + `+ Bild auswählen`;
- mit Bild: `Bild ersetzen · Entfernen`, wobei `Entfernen` klar sekundär bleibt;
- Persistenz, Hero-Asset-Modell und Bildlogik bleiben unverändert.

## Bereits in Build 023

- feinere Balance für **Weite · Bild links · Bild rechts**;
- textgeführtes **Bild rechts** mit ruhigerer Bildposition;
- automatische 1-/2-/3-spaltige Inhaltsgruppierung innerhalb der Layout Grammar;
- rechter Inspector auf **320–440 px** resizebar;
- Inspectorbreite wird lokal gespeichert und nicht im Travelbook.

## Unverändert

- `.nls` bleibt 0.9.0;
- 15-mm-Bindungszone;
- Companion-Position;
- Footer/Seitenzahl;
- zwei Bildrollen aus Build 022;
- interner und Finder-Open-Flow;
- keine freie Bild-/Layoutgeometrie.


## Final Polish Fix

- corrected the remaining `Weite` title-safe collision by separating panorama and title block in normal layout flow with an editorial breathing zone;
- reduced the visual weight of the image-role status in the Destination inspector and removed the redundant „Für“ prefix;
- no project-format, persistence or asset-model changes.

### Final Weite spacing correction
- Added an explicit protected gap after an active `Weite` panorama.
- `REISEZIEL` begins only after this hero-owned breathing zone.
- No changes to `.nls`, image persistence, asset roles, or portrait layouts.
