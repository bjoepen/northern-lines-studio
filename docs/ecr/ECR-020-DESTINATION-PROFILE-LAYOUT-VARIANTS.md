# ECR-020 – Destination Profile & Layout Variants Foundation – Final

## Problem

Build 020 hatte die richtige Domain-Foundation, präsentierte deren technische Struktur jedoch zu direkt in der Benutzeroberfläche. Der Destination Inspector wirkte wie ein CMS-/Datenbankeditor; technische Begriffe und eine zu dominante Hero-Darstellung widersprachen der Northern-Lines-Studio-Philosophie.

## Change

Die bestehende Architektur bleibt erhalten. Die Finalisierung ändert ausschließlich die Produktoberfläche und die redaktionelle Preview innerhalb des freigegebenen Build-020-Scopes:

- sichtbares **Ortsprofil** statt „Destination Profile“;
- **Seitenwirkung** mit **Weite**, **Bild links**, **Bild rechts**;
- visuelle Layout-Miniaturen statt technischer Radiobutton-Liste;
- ruhigere Inspector-Hierarchie;
- Journey Context als **Reise vor Ort**;
- Highlights und Practical Info als nachgelagerte Bereiche;
- technische World/Layout/Grammar-Karten auf Destination Pages aus dem primären Workflow entfernt;
- **Weite** als flaches, ruhiges Panorama neu balanciert;
- dekoratives Fjord-Strich-Element entfernt;
- Footer, Seitenzahl und Companion bei Layoutwechsel stabil gehalten;
- Consistency Gate um Travel-Language-Schutz erweitert.

## Semantic Constraint

Bestehende Domain-Felder werden nicht zweckentfremdet. `reasons`, `highlights` und `practicalInfo` behalten ihre Bedeutung. Weil Build 020 kein passendes persistiertes Feld für „Was möchtest du fotografieren?“ besitzt, wird weder ein neues Feld eingeführt noch eine vorhandene Struktur dafür missbraucht.

## Schema

Keine Änderung. `.nls` bleibt 0.8.0. Interne Layout-IDs bleiben unverändert.

## Explicit non-goals

Kein Asset Management, Crop Editor, Focal Point, Drag-and-drop, freie Positionierung, zusätzliche Layoutvariante, neue Reisewelt, Photography Intelligence, Schemaerweiterung oder allgemeines Refactoring.
