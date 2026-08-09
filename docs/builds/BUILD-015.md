# Build 015 – Journey Route Foundation

**Studio:** 0.15.0  
**`.nls`:** 0.5.0

## Leitgedanke
> Der Reisende ordnet seine Reise. Studio ordnet die Darstellung.

## Neu
- Navigation `Deine Route`
- persistente Reihenfolge über `journey.stages`
- `Früher in der Reise` / `Später in der Reise`
- `Ort bearbeiten`
- Land/Region nachträglich änderbar
- Route bleibt unabhängig von technischen Seitenpositionen
- ProjectSession-Hotfix aus Build 014 ist Bestandteil der Baseline


## Final Stabilization – Travelbook-Seitenzahlen

Die sichtbare Seitenzahl wird nicht länger direkt aus dem technischen `page.order`
übernommen. Studio leitet sie aus der tatsächlichen semantischen Dokumentreihenfolge ab:

1. Buch / Einstieg
2. Deine Route in `journey.stages`-Reihenfolge
3. Reisebegleitung
4. Fotografie
5. Erinnerungen

Damit bleibt `journey.stages` die Quelle der Wahrheit für die Route, während Studio
automatisch die korrekte sichtbare Seitenzahl berechnet. Ein Verschieben eines Ortes
ändert somit unmittelbar seine Seitenzahl und die nachfolgenden Seiten.

Diese Lösung vermeidet gleichzeitig Kollisionen mit den technischen Order-Bereichen
(10, 20, 30, 40) und zwingt keine Dateiumbenennungen innerhalb eines `.nls`-Pakets.
