# Northern Lines Studio – Build 022
## Destination Imagery Foundation – Final Image Composition Specification

**Status:** Verbindliche Referenz für Build 022 Final

## 1. Bildrollen

Für die drei Destination-Seitenwirkungen benötigt Fjord zwei Bildrollen:

| Studio-Seitenwirkung | Bildrolle | Empfehlung |
|---|---|---|
| **Weite** | `wide` | breites Panorama, ca. **3:1–4:1**, mindestens **2400 px breit** |
| **Bild links** | `portrait` | Hochformat, ca. **2:3**, etwa **1500 × 2250 px** oder größer |
| **Bild rechts** | `portrait` | dasselbe Hochformat wie Bild links |

Die Maße sind Zielkorridore zur Bildvorbereitung, keine finale Publisher-Geometrie.

## 2. Image Composition statt Bildbox

Ein ausgewähltes Bild wird nicht in eine farbige Medienkarte eingesetzt.

Für Fjord gilt:

- Destination-Seiten bleiben **weiß / neutral-weiß**;
- Fotografie ist die wichtigste atmosphärische Farbquelle;
- echte Bilder liegen direkt auf der Papierfläche;
- bei Aquarellmotiven darf der weiße Bildrand optisch mit der Seite verschmelzen;
- die Preview darf die sichtbare Bildhöhe aus dem vorbereiteten Seitenverhältnis ableiten;
- die Breite und Platzierung bleiben durch **Weite / Bild links / Bild rechts** und die Layout Grammar kontrolliert;
- Studio speichert keine freien Bildboxgrößen oder Koordinaten.

> **Bilder werden nicht in Boxen eingesetzt. Sie werden innerhalb der Editorial Grammar in die Seite komponiert.**

## 3. Weite

**Weite** ist eine atmosphärische Panoramazone, kein Web-Hero und keine starre Bannerkarte.

Geeignet:

- Stadtpanorama
- Hafenansicht
- Fjord- oder Küstenblick
- ruhige Landschaftseröffnung
- Motive mit Luft an den Seiten

Das Bild darf innerhalb des vorgesehenen horizontalen Raums seine natürliche Höhe behalten. Ein Panorama von etwa 3:1 bis 4:1 ist für die aktuelle A5-Grammar ein sinnvoller Ausgangspunkt.

## 4. Bild links / Bild rechts

Beide Seitenwirkungen verwenden **dieselbe Portrait-Bildrolle**.

Geeignet:

- hochformatige Ortsansicht
- Architektur
- Hafen- oder Straßenszene
- klarer Hauptfokus
- ausreichend Randluft

Die Seitenwirkung entscheidet nur, ob das Bild links oder rechts komponiert wird. Sie verlangt kein zweites Bild.

## 5. Tooltip

Neben **Bild auswählen …** erscheint bei Bedarf `?`.

Für Weite:

> **Weite**
> Breites Panorama. Empfohlen: ca. **3:1–4:1**, mindestens **2400 px breit**.
> Die sichtbare Höhe folgt innerhalb der Layout Grammar dem vorbereiteten Motiv.

Für Bild links / Bild rechts:

> **Bild links / Bild rechts**
> Gemeinsames hochformatiges Leitbild. Empfohlen: ca. **2:3**, etwa **1500 × 2250 px** oder größer.

Der Tooltip erklärt keine Asset-Pfade, IDs, Renderlogik oder freie Geometrie.

## 6. Informationsflächen

Nicht jedes Inhaltsmodul wird automatisch in eine Box gesetzt.

- Typografie, Abstände und feine Linien strukturieren den Normalfall.
- Eine sanft eingefärbte Informationsfläche darf gezielt einen redaktionellen Akzent setzen.
- Daraus entsteht kein allgemeines Card-UI-System.

## 7. Fjord-Grundfläche

Für **Weite · Bild links · Bild rechts** gilt dieselbe weiße / neutral-weiße Seite.

> **Die Fotografie bringt die Atmosphäre. Die Typografie gibt ihr Haltung. Die Editorial World setzt die Akzente.**

Keine zusätzlichen Hintergrundvarianten, Themes oder frei wählbaren Seitenfarben.

## 8. Physische Invarianten

- Binding Safe Area: **15 mm technische Mindestzone** für relevante Nutzinhalte.
- Companion: feste Editorial-World-Position, unabhängig vom Content-Inset.
- Footer und Seitenzahl: stabil über alle drei Seitenwirkungen.

## 9. Nicht Bestandteil von Build 022

- Crop Editor
- Focal Point
- freie Bildpositionierung
- freie Bildboxgröße
- Asset Manager
- Drag-and-drop Layout
- Gallery
- EXIF-Workflow
- automatische AI-Bildauswahl
- neue Seitenwirkung
- frei wählbare Seitenfarben

## 10. Real-World-Test

Für Bergen reichen zwei Dateien:

- `bergen-weite` – Panorama
- `bergen-portrait` – Hochformat

Prüfen:

1. Weite importieren und natürliche Panoramahöhe beurteilen.
2. Bild links importieren.
3. Zu Bild rechts wechseln – dasselbe Portrait muss erscheinen.
4. Zurück zu Weite wechseln.
5. Keine farbige Medienbox hinter echten Bildern.
6. Neutral-weiße Seite bleibt invariant.
7. Companion, Footer, Seitenzahl und 15-mm-Sicherheitszone bleiben stabil.
8. Speichern, Studio schließen, `.nls` erneut öffnen und Persistenz prüfen.
