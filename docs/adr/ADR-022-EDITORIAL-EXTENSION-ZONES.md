# ADR-022 – Editorial Extension Zones

## Status
Accepted – Build 024

## Kontext
Destination Pages benötigen an ausgewählten Orten zusätzliche semantische Inhalte wie Wissen, Fotospots, Tipps, Souvenirs, wichtige Hinweise oder Geschichte. Eine allgemeine Asset- oder Card-Bibliothek würde der Northern-Lines-Produkt-DNA widersprechen.

## Entscheidung
Studio führt `DestinationEditorialExtension` als semantisches Domain-Objekt ein. Die erlaubten Foundation-Typen sind `knowledge`, `photo_spot`, `tip`, `souvenir`, `important` und `history`.

Die Preview verwendet gemeinsame semantische Signets und leitet Flächenfarbe und visuelles Gewicht aus der aktiven Editorial World ab. Extension Zones sind rahmenlos und enthalten keine zusätzlichen dekorativen Divider oder redundanten Typ-Labels.

Die Extension-Daten gehören zum Ort. Die World besitzt ihre visuelle Expression. Position und Geometrie bleiben Aufgabe der Layout Grammar und werden nicht im `.nls` gespeichert.

## Konsequenzen
- `.nls` steigt auf 0.10.0.
- Build-023-Projekte 0.9.0 migrieren mit leerer `editorialExtensions`-Liste.
- Dirty State und Save/Discard-Workflow umfassen Extensions.
- Build 025 kann den World-Wechsel mit identischer Extension-Semantik testen.
