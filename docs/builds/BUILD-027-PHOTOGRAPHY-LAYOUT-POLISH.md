# Build 027 · Photography Layout Polish

## Ziel

Die Photography & Place Experience soll fotografische Entscheidungen unmittelbar lesbar machen. Ein Fotospot und seine Brennweitenempfehlung bilden deshalb in der Preview eine feste visuelle Paarung.

## Änderungen

- Fotospot → Brennweite wird zeilenweise gekoppelt.
- Der bestehende `photo_focal_lengths`-Baustein bleibt semantisch eigenständig und persistent.
- Eine Brennweite pro Zeile entspricht dem Fotospot an derselben Position.
- Einzeilige Alt-Eingaben wie `18–35 mm 18–50 mm 50–230 mm` werden für die Preview per Brennweitenmuster erkannt und den Spots der Reihe nach zugeordnet.
- Fehlende Zuordnungen werden als `Brennweite offen` sichtbar statt stillschweigend geraten.
- Die separate Sammelbox „Brennweiten & Praxis“ wird aus der Preview entfernt.
- Der Inspector benennt den Baustein nun als „Brennweite je Fotospot“ und erklärt die Zeilenlogik.
- Die dünne Editorial-Linie bleibt erhalten, wird aber auf 1 px / 38 px Länge und deutlich weniger vertikalen Abstand reduziert.
- Photography Interest Pages beginnen mit 44 px Top-Padding statt der generischen 58 px.

## Nicht verändert

- `.nls` bleibt 0.12.0; keine Migration.
- World Expression, Companion, Footer und Capacity Protection bleiben unverändert.
- Keine Kamera-/EXIF-/Objektivdatenbank, kein GIS.

## Designregel

> Ort → Brennweite ist eine unmittelbare fotografische Beziehung. Studio darf sie nicht in getrennten Informationsflächen auseinanderreißen.
