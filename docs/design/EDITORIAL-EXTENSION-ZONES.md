# Editorial Extension Zones

**Status:** Build 024 Foundation
**Scope:** Destination Pages
**Projektformat:** `.nls` 0.10.0

## Ziel

Editorial Extension Zones geben einzelnen Orten zusätzliche redaktionelle Tiefe, ohne Northern Lines Studio in einen Box- oder Asset-Baukasten zu verwandeln. Eine Extension entsteht aus dem Inhalt heraus und ist optional.

## Kanonische Semantik

| Rolle | Zweck |
|---|---|
| Wissen | überraschender oder hilfreicher Fakt |
| Fotospot | besonderer Ort für ein Bild |
| Tipp | persönliche Empfehlung für unterwegs |
| Souvenir | authentisches Mitbringsel oder regionale Besonderheit |
| Wichtig | Hinweis mit erhöhter redaktioneller Priorität |
| Geschichte | historischer Kontext zum Ort |

## Visuelle Grammatik

Eine Extension besteht ausschließlich aus:

1. semantischem Signet,
2. world-konformer Flächenfarbe,
3. redaktionellem Inhalt.

Keine Rahmen, keine zusätzlichen Linien, keine Ornamente und keine redundanten Typ-Labels im Travelbook.

Die Semantik des Signets ist world-übergreifend stabil. Die jeweilige Editorial World bestimmt die farbliche Expression. Die Gewichtung kann über die Stärke der Fläche entstehen; `Wichtig` oder `Wissen` dürfen beispielsweise präsenter sein als ein beiläufiger `Tipp`, bleiben aber innerhalb derselben World-Palette.

## Layout-Regel

Extension Zones sind Gäste der Destination Grammar. Sie dürfen Hero, Title, regulären Content, Companion oder Footer nicht verdrängen oder überlagern. Der Companion bleibt invariant; das Layout nimmt auf seinen geschützten Bereich Rücksicht.

Build 024 führt keine freie Positionierung, keinen Extension-Layouteditor und keine Asset-Bibliothek ein.

## Signets

Die sechs Foundation-Signets liegen als gemeinsame semantische Vektoren unter:

`public/design-library/signets/shared/`

Sie sind nicht farbgebunden. Die Farbe wird durch die aktive Editorial World bestimmt. Damit kann Build 025 denselben semantischen Bestand im Ostsee-PoC neu ausdrücken, ohne Inhalte oder Signet-Bedeutungen zu duplizieren.

## Nicht Bestandteil von Build 024

- World-Wechsel Fjord → Ostsee
- freie Auswahl dekorativer Assets
- Crop/Focal Point
- frei platzierbare Boxen
- automatische Fortsetzungsseiten
- finales Publisher Content Fit
- neue Hintergrund-/Theme-Auswahl
