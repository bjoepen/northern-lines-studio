# Build 020 – Final Release Notes

Northern Lines Studio 0.20.0 macht aus einem Routenpunkt ein echtes redaktionelles Reiseziel – und lässt die technische Komplexität dabei bewusst im Hintergrund.

## Für Reisende

Der Destination Inspector heißt jetzt **Ortsprofil** und folgt einer ruhigeren redaktionellen Hierarchie. Statt einer Formularwand stehen die Fragen zur Reise im Vordergrund:

- **Der Ort in Kürze**
- **Was möchtest du erleben?**
- **Reise vor Ort**
- nachgelagerte **Orte & Motive**
- nachgelagerte Hinweise **Für unterwegs**

Technische Architekturkarten werden auf Ortsseiten nicht mehr im primären Inspector gezeigt.

## Seitenwirkung

Die drei kuratierten Erzählweisen heißen in Studio verbindlich:

- **Weite**
- **Bild links**
- **Bild rechts**

**Weite** wurde visuell neu ausbalanciert: Das Panorama ist breit, flach, ruhig und atmosphärisch und wirkt nicht mehr wie ein dominanter Content-Block. Das dekorative Strich-Element oben rechts entfällt.

Footer, Seitenzahl und Papageientaucher bleiben bei allen drei Varianten stabil.

## Travel Language

Sichtbare technische Begriffe wie „Destination Profile“, „Hero Banner“, „Image Left“ und „Image Right“ wurden aus dem Ortsworkflow entfernt. Interne IDs bleiben unverändert und stabil.

## Projektformat und Architektur

`.nls` bleibt **0.8.0**. Die Finalisierung führt keine Schemaerweiterung ein. Gründe, Highlights und praktische Informationen behalten ihre bestehende Semantik; kein Feld wird für eine gewünschte UX-Frage zweckentfremdet.

ADR-018 bleibt gültig: Studio besitzt die redaktionelle Entscheidung, Northern Lines Publisher die Publishing-Wahrheit.
