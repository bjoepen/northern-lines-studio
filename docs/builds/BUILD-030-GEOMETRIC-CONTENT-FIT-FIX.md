# Build 030 Fix – Geometric Content Fit False-Positive Correction

## Ziel

Capacity Protection soll nur dann in `overflow` wechseln, wenn keine freigegebene Komposition den real verfügbaren, geschützten Seitenraum tragen kann.

Der Geiranger-Test zeigte eine False-Positive-Regression: Ein einzelner zusätzlicher Streckenhinweis führte trotz sichtbar vorhandener Seitenfläche unmittelbar zum Overflow-Hinweis.

## Korrektur

- rohe Zeichenanzahl ist kein eigenständiges Ausschlusskriterium mehr;
- die Kandidatensuche bewertet umgebrochene Höhen innerhalb der jeweiligen Breite;
- alle freigegebenen Kompositionen bleiben aktiv;
- der kulinarische Safe-Content-Bereich bleibt separat konservativ kalibriert, damit der bereits nachgewiesene Bergen-Overflow weiterhin geschützt wird;
- nicht vorhandene Module reservieren keinen Platz;
- Companion und Footer bleiben harte Safe-Zonen.

## Verbindlicher Regressionstest

`Geiranger · Wandern & Natur`

- Fosseråsa → Storsæterfossen
- Skagehola → Skageflå → Homlong
- vollständiger Hinweis: `Sehr steile und teilweise ausgesetzte Abschnitte; Trittsicherheit erforderlich.`

Erwartung: kein Overflow allein wegen dieses zusätzlichen Satzes; vollständiger Text bleibt sichtbar.
