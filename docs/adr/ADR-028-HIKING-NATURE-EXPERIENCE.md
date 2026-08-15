# ADR-028 · Hiking & Nature Experience

## Entscheidung

Der Archetyp `hiking_nature` erhält eine eigene Destination-Interest-Grammatik. Die Route ist der semantische Anker. Startpunkt, Dauer und Schwierigkeit werden als getrennt authorierbare Story Components gespeichert, in der Preview jedoch positionsgleich direkt an die jeweilige Route gebunden.

## Begründung

Eine getrennte Darstellung würde die inhaltliche Beziehung zerstören und dieselbe Schwäche erzeugen, die Build 027 bei Fotospot/Brennweite bereits korrigiert hat. Northern Lines Studio darf intern strukturiert sein; die Ausgabe muss die Beziehung selbstverständlich erzählen.

## Konsequenzen

- keine Tabellenoptik
- keine freie Zuordnung im Canvas
- keine GPX-/Navigationslogik
- World Expression und Capacity Protection bleiben gemeinsame Grammar
- spätere strukturiertere Routenmodelle dürfen diese sichtbare Beziehung nicht aufbrechen
