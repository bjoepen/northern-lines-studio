# ADR 032 · Travel Companion Master: Wetter

## Entscheidung

`Wetter` wird nicht als Dashboard oder Destination-Datenseite modelliert. Die Seite übernimmt den in Build 031 etablierten Travel Companion Master: kuratierter Kern, optionale Reiseergänzung, gemeinsame A5-Grammatik und harte Safe-Zones.

## Konsequenzen

- allgemeines Wissen bleibt Studio-kuratiert;
- Reiseprognosen und ortsabhängige Werte werden nicht statisch eingebrannt;
- `travel_weather` erhält `introduction` als optionalen Reisehinweis;
- `.nls` steigt auf 0.16.0;
- Inspector-Werte der Travel-Companion-Seiten verwenden ruhige UI-Typografie.
