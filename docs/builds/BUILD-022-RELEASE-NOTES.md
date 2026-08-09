# Build 022 – Release Notes

## Destination Imagery Foundation – Final Image Composition Fix

- echte Ortsbilder für **Weite**, **Bild links** und **Bild rechts**
- zwei semantische Bildrollen: **Weite** und ein gemeinsames Hochformat-Bild für **Bild links / Bild rechts**
- Bildauswahl in Travel Language: **Bild des Ortes**
- kleine `?`-Geometriehilfe direkt bei der Bildauswahl
- JPEG/PNG werden in das `.nls`-Package übernommen
- keine absoluten Bildpfade im Projektmanifest
- Studio Preview ohne Crop-Editor oder freie Bildgeometrie
- `.nls` 0.9.0 mit Migration aus 0.8.0

## Image Composition Fix

- Fjord Destination Pages bleiben **weiß / neutral-weiß**
- echte Bilder werden nicht mehr auf farbige Medienbox-Hintergründe gesetzt
- Bildhöhe kann innerhalb der Layout Grammar aus dem vorbereiteten Seitenverhältnis folgen
- **Weite** ist eine atmosphärische Panoramazone statt einer starren Bannerbox
- **Bild links** und **Bild rechts** verwenden dasselbe Hochformat-Bild
- Inhaltsmodule werden nicht automatisch als Cards gerendert
- sanft eingefärbte Informationsflächen bleiben gezielte redaktionelle Akzente

## Layout corrections

- technische Mindest-Bindungszone: **15 mm**
- Papageientaucher an seiner bewährten Editorial-World-Position
- Companion-Position ist nicht an den Destination-Content-Inset gekoppelt
- Footer und Seitenzahl bleiben stabil

## Product DNA

Build 022 Final wurde gegen `docs/PRODUCT-DNA.md` validiert. Neu verbindlich:

> **Die Fotografie bringt die Atmosphäre. Die Typografie gibt ihr Haltung. Die Editorial World setzt die Akzente.**

## Regression fix – Reise innerhalb von Studio öffnen

- interner **Reise öffnen …**-Flow wählt `.nls` wieder als Northern-Lines-Dokument/Package statt als beliebiges Verzeichnis
- File Dialog liefert damit denselben `.nls`-Package-Pfadvertrag, den auch der funktionierende macOS/Finder-Open-Flow verwendet
- beide Wege laufen weiterhin über den gemeinsamen `load_nls_project`-Command und damit über dieselbe read/migrate/validate-Pipeline
- Finder-/UTType-Integration und `.nls`-Registrierung bleiben unverändert
- Hero-/Destination-Image-Composition aus Build 022 bleibt unverändert
