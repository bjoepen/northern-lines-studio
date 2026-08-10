# Build 024 – Editorial Extension Zones Foundation

Build 024 erweitert Destination Pages um optionale semantische Editorial Extension Zones.

## Enthalten
- Wissen
- Fotospot
- Tipp
- Souvenir
- Wichtig
- Geschichte

Die Reisenden-UX bleibt bewusst klein: Im Ortsprofil werden besondere Hinweise nur bei Bedarf ergänzt. Im Travelbook zeigt das Signet die Semantik; die aktive Editorial World liefert Farbe und Gewichtung.

Keine Rahmen, keine zusätzlichen Linien, keine Asset-Bibliothek und keine freie Box-Gestaltung.

## Projektformat
`.nls` 0.10.0. Build 023 / 0.9.0 wird automatisch migriert.


## Adaptive Grammar Polish

Build 024 erhält vor der Finalfreigabe eine adaptive Preview-Grammar. Die Seitenwirkung wird nicht verändert; nur die innere Komposition folgt dem Inhalt.

- Title Zone: `balanced` (50/50), `title-wide` (60/40), `title-dominant` (ca. 70/30), `stacked`.
- Lange Ortsnamen bleiben ungetrennt; keine Silben-/Zeichenbrechung und keine automatische Schriftverkleinerung.
- Extension Zones: `single`, `balanced`, `wide-first`, `wide-second`, `stacked`.
- Der Companion bleibt invariant; adaptive Zustände dürfen seinen geschützten Raum nicht als Layoutkapazität verwenden.
- Keine dieser Entscheidungen wird im `.nls` persistiert. Sie sind reine Layout Grammar.
