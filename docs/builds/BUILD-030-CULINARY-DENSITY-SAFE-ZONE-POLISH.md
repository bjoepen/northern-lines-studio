# Build 030 Polish – Culinary Density & Safe-Zone Correction

## Ziel
Der Real-World-Test mit zwei Bergen-Empfehlungen zeigte, dass Kulinarik & Lokal die Interest-Page-Regeln zu aggressiv verdichtet hat. Dieser Polish ändert keine Semantik und kein `.nls`-Format, sondern korrigiert ausschließlich Layout Grammar und Capacity Protection.

## Änderungen
- genau zwei feste Interest-Typografiestufen: `comfortable` und `tight`;
- keine freie Skalierung unterhalb von `tight`;
- `overflow` statt weiterer Verkleinerung;
- Companion und Footer bleiben harte Safe-Zonen;
- zwei ausgewogene kulinarische Empfehlungen dürfen trotz textlichem Ortsbezug als zwei Boxen komponiert werden;
- ein textlicher Ortsbezug wird nicht wie eine bereits gerenderte Karte mit Flächenbedarf behandelt;
- eine zukünftige echte Karte muss separat Kapazität reservieren.

## Nicht im Scope
- kein Datenmodellwechsel;
- keine `.nls`-Migration;
- keine Kartenimplementierung;
- keine Änderung an World Expression oder Header Grammar.

## Real-World-Test
Bergen mit **Skillingsbolle bei Baker Brun** und **Bergener Fischmarkt / Mathallen**. Erwartung: lesbare feste Typografie, keine Überlagerung von Companion/Footer, intelligente Zwei-Box-Komposition sofern der Inhalt innerhalb der Kapazität bleibt. Bei deutlich längeren Inhalten erscheint Capacity Protection statt weiterer Schriftverkleinerung.
