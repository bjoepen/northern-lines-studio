# Build 024 Release Notes

## Editorial Extension Zones Foundation
Destinationen können jetzt selektiv zusätzliche redaktionelle Hinweise tragen. Die Foundation umfasst Wissen, Fotospot, Tipp, Souvenir, Wichtig und Geschichte.

## Northern-Lines-Gestaltung
- semantisches Signet statt Asset-Auswahl
- Flächenfarbe aus der Editorial World
- unterschiedliche Gewichtung über Farbintensität
- keine Rahmen, Divider oder dekorativen Zusatzformen
- Companion-Zone bleibt geschützt

## Migration
`.nls` 0.9.0 → 0.10.0. Bestehende Destinationen erhalten eine leere Extension-Liste; Inhalte werden nicht erfunden.


## Adaptive Grammar Polish

- Weite reagiert auf Ortsnamenlänge mit kuratierten 50/50-, 60/40-, 70/30- oder gestapelten Title-Zuständen.
- Ortsnamen werden nicht mitten im Wort getrennt.
- Editorial Extension Zones reagieren auf Textgewicht und müssen nicht mehr statisch 50/50 stehen.
- Keine Schema- oder Persistenzänderung gegenüber Build 024 Foundation.

## Capacity Protection Polish

- Editorial Extension Zones now use hard capacity protection before the Companion/Footer safe zone.
- `comfortable`, `tight` and `overflow` are evaluated per selected page effect.
- When overflow is reached, Studio does not render an invalid overlapping composition; it shows the Travel Language notice **„Diese Seite kann diesen Inhalt nicht mehr ruhig erzählen.“**
- Existing alternative page effects are suggested when they can carry the same content.
- Root `LICENSE.md` and README source-availability notice added.
