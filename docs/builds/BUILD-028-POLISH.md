# Build 028 · Hiking & Nature Polish

## Ziel

Der Polish schließt drei reale Layout-Lücken der Hiking-&-Nature-Interest-Page: harte Companion-/Footer-Safe-Zonen, eindeutige Route-Zuordnung für Naturziele und Streckenhinweise sowie eine eng begrenzte kompakte Typografie-Stufe ausschließlich für Interest Pages.

## Verbindliche Änderungen

- **Route → Start → Dauer → Schwierigkeit → Naturziel → Streckenhinweis** bleibt ein zusammengehöriger redaktioneller Block.
- `hike_highlights` und `hike_guidance` werden zeilenweise derselben Route per Index zugeordnet.
- Die bisherigen ungebundenen Sammelboxen für Naturziele und Hinweise entfallen.
- Companion und Footer sind harte Seitenanker und werden nicht durch wachsenden Inhalt verdrängt.
- Interest Pages dürfen bei höherer Informationsdichte auf eine definierte kompakte Sekundärtypografie wechseln.
- Titel, Ortsname und primäre Hierarchie bleiben unverändert.
- **Alle anderen Seitentypen sind von dieser Typografie-Ausnahme ausdrücklich ausgeschlossen.**
- Reicht die erlaubte Verdichtung nicht, greift weiterhin: „Diese Seite kann diesen Inhalt nicht mehr ruhig erzählen.“
- `.nls` bleibt bei **0.13.0**; keine Migration.

## Kartenreserve

`Ort & Karte` bleibt ein eigener semantischer Bereich. Der Polish reduziert die vertikale Grundlast der Route-Module, damit eine spätere echte Kartenkomponente Platz erhalten kann, ohne Companion oder Footer zu verdrängen. Eine GIS-/GPX-Funktion ist nicht Teil dieses Builds.
