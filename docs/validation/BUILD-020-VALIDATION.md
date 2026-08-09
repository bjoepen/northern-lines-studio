# Build 020 – Final Validation

## Code Gates

```bash
pnpm consistency
pnpm check
pnpm test
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
git diff --check
```

Erwartung für `pnpm consistency`:

```text
Journey Planning Consistency Gate: PASS
Destination Profile Consistency Gate: PASS
Model → Rust → Migration → Command → Inspector → Preview → Layout Variants → Tests
```

## Migration / Projektformat

Build 020 Final bleibt bei `.nls` **0.8.0**. Für eine Build-019-Reise prüfen:

1. Destination Stages besitzen stabile `destinationId`-Referenzen.
2. Passende `destinations[]` existieren.
3. Bestehende Ortsnamen und vorhandene Einführungstexte bleiben erhalten.
4. Nicht vorhandene Inhalte werden nicht erfunden.
5. Die UX-Finalisierung erzeugt keine neue Schema-Version.

## Real-World-Test – Bergen

Bergen auswählen und im **Ortsprofil** eintragen:

- Reiseziel: `Bergen`
- Ein Satz für diesen Ort: `Tor zu den Fjorden`
- Der Ort in Kürze: eigener kurzer Text
- Was möchtest du erleben?:
  - `Historisches Bryggen`
  - `Hafenatmosphäre`
  - `Aussicht vom Fløyen`
- Reise vor Ort: Ankunft / Abfahrt / Zeitzone
- Orte & Motive: mindestens `Bryggen`, `Fischmarkt`, `Fløyen`
- Für unterwegs: mindestens ein praktischer Hinweis

`Ortsprofil sichern` → Preview prüfen → Studio beenden → `.nls` per Finder öffnen → Persistenz prüfen.

## Seitenwirkung

Nacheinander wählen:

1. **Weite**
2. **Bild links**
3. **Bild rechts**
4. zurück zu **Weite**

Prüfen:

- alle drei Varianten sind visuell eindeutig;
- **Weite** ist breit, flach, ruhig und nicht dominant;
- kein dekoratives Strich-Element oben rechts;
- Ortsinhalte verändern sich nicht;
- Footer bleibt an derselben Stelle;
- Seitenzahl bleibt stabil;
- Papageientaucher bleibt unten links an der Footer-Schwelle, klein, Standardpose, nicht gespiegelt;
- die zuletzt gesicherte Seitenwirkung bleibt nach erneutem Öffnen erhalten.

## Travel-Language-Check

Im normalen Ortsworkflow dürfen nicht sichtbar erscheinen:

- Destination Profile
- Hero Banner
- Image Left
- Image Right
- Layout Variant
- JourneyStage
- Manifest
- Asset ID
- Layout Language
- Editorial Grammar

Stattdessen müssen **Ortsprofil**, **Reise vor Ort**, **Seitenwirkung**, **Weite**, **Bild links** und **Bild rechts** sichtbar sein.

## Semantik-Check

- `reasons` werden nur für Gründe/Erlebnisse des Ortes verwendet.
- `highlights` bleiben strukturierte Orte/Motive.
- `practicalInfo` bleibt praktische Information.
- Es gibt in Build 020 **kein** persistiertes Feld „Was möchtest du fotografieren?“. Kein bestehendes Feld darf dafür missbraucht werden.

## Regression

- Journey Planning aus Build 019 bleibt vollständig funktionsfähig.
- Ort umbenennen und Route früher/später verschieben verlieren keine Destination-Daten.
- Story Authoring auf bestehenden Seitentypen bleibt verfügbar.
- Fjord-Reisebegleiter bleibt ab Reiseplanung sichtbar.
- Northern-Lines-Footer bleibt intakt.
- Finder-Doppelklick bleibt funktionsfähig.
