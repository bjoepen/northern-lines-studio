# ECR-023 – Destination Composition Refinement

**Status:** Approved / Implemented

## Anlass

Real-World-Tests mit Bergen zeigten, dass die Bildintegration technisch funktioniert, aber insbesondere **Bild rechts** und der Rhythmus zwischen Bild, Story und Informationsgruppen noch nicht die gewünschte redaktionelle Selbstverständlichkeit besitzen. Gleichzeitig wird der rechte Inspector mit wachsender redaktioneller Tiefe zu eng.

## Änderung

- drei bestehende Seitenwirkungen kompositorisch nachschärfen;
- automatische, begrenzte 1-/2-/3-Spalten-Grammar für Inhaltsgruppen;
- Inspectorbreite lokal zwischen 320 und 440 px veränderbar machen.

## Nicht ändern

Kein Schema, keine neue Seitenwirkung, kein Crop, kein Focal Point, keine neue Editorial World und kein freier Layouteditor.

## Final composition correction – Weite

After the strict Hero/Title zone fix, real-world A5 review showed a secondary
capacity issue: the correct separation consumed enough vertical space that lower
content approached the protected Companion/Footer zone.

Approved correction:

- keep Hero and Title zones structurally separate;
- remove the now-redundant horizontal rule below the Hero;
- use the Title Zone horizontally: title block left, introduction right;
- separate both semantic roles with a restrained vertical divider;
- preserve type sizes, Companion position and Footer position;
- do not add free layout controls or persisted geometry.
