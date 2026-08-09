# Build 020 – Final · Destination Profile & Layout Variants Foundation

**Studio:** 0.20.0  
**`.nls`:** 0.8.0  
**Status:** Finalisierung nach Real-World-UX-Review

## Leitgedanke

> **Wenige starke Möglichkeiten. Viele persönliche Geschichten.**

Build 020 behält seine technische Destination-Foundation vollständig bei, bringt die Produktoberfläche aber konsequent in die Northern-Lines-Studio-Sprache. Technische Komplexität bleibt im Modell; im normalen Workflow sieht der Reisende **Ortsprofil**, **Reise vor Ort** und **Seitenwirkung**.

## Technisch erhalten

- eigenständige `Destination` Entity
- stabile `destinationId`
- Journey Stage → Destination-Verknüpfung
- `subtitle`, `introduction`, Journey Context, `reasons`, `highlights`, `practicalInfo`
- interne Layout-IDs `destination-hero-banner`, `destination-hero-left`, `destination-hero-right`
- `.nls` 0.8.0 und Migration
- Publisher/Studio-Grenze
- Journey- und Destination-Consistency-Gates

## Finalisierte Travel Language

| intern | Studio |
|---|---|
| Destination Profile | **Ortsprofil** |
| `destination-hero-banner` | **Weite** |
| `destination-hero-left` | **Bild links** |
| `destination-hero-right` | **Bild rechts** |
| Layout Variant | **Seitenwirkung** |
| Editorial World / Reference World | **Reisewelt** |
| Companion | **Reisebegleiter** |

## Ortsprofil im Inspector

Der Inspector zeigt nicht mehr ungefiltert das Domain-Modell. Primär sichtbar sind:

1. **Ortsprofil** – Reiseziel, persönlicher Satz, „Der Ort in Kürze“, „Was möchtest du erleben?“
2. **Reise vor Ort** – Ankunft, Abfahrt, Zeitzone
3. nachgelagerte Bereiche **Orte & Motive** und **Für unterwegs**
4. **Seitenwirkung** als visuelle Dreierauswahl

`reasons` werden nur für ihre eigentliche semantische Bedeutung „Was möchtest du erleben?“ verwendet. Build 020 führt ausdrücklich kein Feld für „Was möchtest du fotografieren?“ ein und zweckentfremdet dafür weder Highlights noch andere vorhandene Strukturen.

## Seitenwirkung

- **Weite** – breit, flach, ruhig und atmosphärisch; kein dominanter Content-Block
- **Bild links** – Fotografie führt in den Ort
- **Bild rechts** – Geschichte führt, Bild begleitet

Die genaue vertikale Komposition von **Weite** bleibt eine visuelle A5-Entscheidung. Studio speichert weiterhin ausschließlich die semantische Layout-ID, keine finale Geometrie.

## Stabilität der Editorial World

Beim Wechsel der Seitenwirkung bleiben stabil:

- Northern-Lines-Footer `TRAVEL · PHOTOGRAPHY · Signet · MEMORIES`
- Seitenzahl
- Fjord-Reisebegleiter: Papageientaucher, unten links an der Footer-Schwelle, klein, Standardpose, keine Spiegelung

Das dekorative Strich-Element oben rechts wurde aus der Fjord-Seite entfernt.

## Publisher Boundary

Northern Lines Publisher bleibt verantwortlich für authoritative Layout Grammar, Content Fit, finale Geometrie, Rendering, Assets und Preflight. Studio liefert eine schnelle redaktionelle Vorschau und speichert semantische Entscheidungen.

## Nicht Bestandteil

Keine Schemaerweiterung, keine neue Entity, kein Asset Management, kein Crop/Focal-Point-Editor, kein Drag-and-drop-Layout, keine freie Positionierung, keine weitere Layoutvariante, keine neue Reisewelt und kein allgemeines Refactoring.

## Consistency

```text
Model → Rust → Migration → Command → Inspector → Preview → Tests
```

Das Destination Gate prüft zusätzlich die sichtbare Travel Language und verhindert, dass die technischen Layout-Bezeichnungen wieder in `App.svelte` auftauchen.
