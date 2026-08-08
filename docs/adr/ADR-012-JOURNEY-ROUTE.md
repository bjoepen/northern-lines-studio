# ADR-012 – Journey Route

## Status
Accepted – Build 015

## Decision
Die Reihenfolge einer Reise wird semantisch durch `journey.stages` bestimmt. Die Seitenreihenfolge ist nicht die Quelle der Wahrheit für die Route.

Studio spricht darüber ausschließlich in Travel Language: **Deine Route**, **Früher in der Reise**, **Später in der Reise** und **Ort bearbeiten**.

## Consequences
- Route und Seitenmanifest bleiben getrennte Konzepte.
- Ein Ort behält beim Umbenennen seine stabile Stage-ID.
- Ein Umordnen verändert die Journey-Reihenfolge und nicht künstlich Dateinamen oder Content-Pfade.
- Die Navigation visualisiert Destination-Seiten anhand der Journey-Reihenfolge.
