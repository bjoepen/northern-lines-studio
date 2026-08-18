# Build 031 — Travel Companion Foundation: Licht

## Ziel

Build 031 etabliert **Travel Companion Pages** als dritte redaktionelle Seitengattung neben Destination und Interest Pages. Die erste Companion Page ist **Licht**.

## Umsetzung

- eigener Light-Companion-Preview statt generischem Knowledge-Platzhalter;
- kuratierter Kern mit Goldenem Licht, Blauer Stunde, ziviler Dämmerung und bedecktem Himmel;
- drei kurze, wiederverwendbare Hinweise „Für unterwegs“;
- optionaler reisespezifischer Hinweis unter **Für diese Reise**;
- Quellenherkunft bleibt im Code und in `docs/research/BUILD-031-LIGHT-RESEARCH.md` dokumentiert;
- keine orts- oder datumsabhängigen Sonnenzeiten im statischen Kern;
- bestehende Editorial World, Companion- und Footer-Regeln bleiben aktiv;
- `.nls` 0.15.0: bestehende Licht-Seiten erhalten die saubere `introduction`-Semantik für den optionalen Reisehinweis.

## UX

Der kuratierte Kern wird nicht wie ein CMS-Textblock authoriert. Im Inspector ist lediglich der optionale Reisehinweis editierbar. Wiederkehrendes Wissen bleibt Produktinhalt von Northern Lines.
