# Northern Lines Studio

**Aktueller Stand:** Build 023 – Destination Composition Refinement
**Studio:** 0.23.0
**Projektformat:** `.nls` 0.9.0

Northern Lines Studio ist eine spezialisierte Desktop-Anwendung für Travel Publishing.
Es ist kein allgemeines DTP-Programm. Studio begleitet eine Reise redaktionell und
visuell – von der ersten Idee über Reiseplanung, Orte, Route und Geschichten bis zum
späteren Publishing mit Northern Lines Publisher.

> **Der Reisende öffnet kein Projekt. Er öffnet seine Reise.**

## Produktidee

Northern Lines Studio spricht in **Travel Language**. Technische Mechanismen bleiben
im Hintergrund:

- **Neue Reise beginnen** statt Projekt anlegen
- **Reiseplanung** statt Journey-Metadaten
- **Ort hinzufügen** statt Destination Page erzeugen
- **Deine Route** statt Manifest-Reihenfolge
- **Deine Geschichte** statt Textblock-Editor
- `.nls` im Finder doppelklicken statt Projektordner auswählen

## Verbindliche Referenzen

Northern Lines Studio wird durch vier dauerhafte Referenzen geführt:

- `README.md` – aktueller Produkt- und Build-Stand
- `docs/VISION.md` – langfristiges Zielbild
- `docs/ARCHITECTURE.md` – technische Verantwortungsgrenzen
- `docs/PRODUCT-DNA.md` – verbindliche Produkt-, UX-, Travel-Language- und Layoutprinzipien

Die **Produkt-DNA** ist ab Build 021 keine Retrospektive am Rand, sondern eine dauerhafte Referenz. Neue Builds müssen ihre UX- und Produktentscheidungen dagegen prüfen.

## Architektur

- **Frontend:** Svelte + TypeScript
- **Desktop Shell:** Tauri 2
- **Backend:** Rust
- **Projektformat:** offenes `.nls`-Package
- **Publishing:** Northern Lines Publisher bleibt eigenständige Publishing Engine

Studio verwaltet visuelle und redaktionelle Entscheidungen. Publisher bleibt zuständig
für Schemas, Validierung, Layout Grammar, Content Fit, Render Jobs, Assets und Preflight.

## Aktueller Journey Lifecycle

1. Reise beginnen
2. Reisewelt wählen
3. Reisebegleiter kennenlernen
4. Reiseplanung ausfüllen
5. Orte hinzufügen
6. Route formen
7. Geschichten bearbeiten
8. Änderungen sichern
9. Travelbook-Preview prüfen
10. `.nls` direkt aus dem Finder wieder öffnen

## Journey Planning Foundation

Build 019 machte die Reiseplanung erstmals zu strukturierten Reisedaten.

Der Reisende kann festhalten:

- **Startdatum**
- **Enddatum**
- automatisch abgeleitete **Dauer**
- **Startpunkt**
- **Rückkehr / Ziel**
- **Transport**
- **Route im Überblick**
- **Fokus der Reise**

Studio speichert diese Informationen im Journey-Modell und macht sie unmittelbar auf
der Reiseplanungsseite sichtbar.

> **Der Reisende beschreibt den Rahmen seiner Reise. Studio macht ihn sichtbar.**

Die Dauer ist eine abgeleitete Größe und wird nicht redundant im `.nls` gespeichert.


## Ortsprofil & Seitenwirkung

Build 020 macht den Ort selbst zu einem strukturierten redaktionellen Objekt. Im normalen Studio-Workflow spricht die Oberfläche dabei bewusst **Travel Language**: Der Reisende arbeitet am **Ortsprofil** und wählt die **Seitenwirkung**, während technische Destination-Strukturen im Hintergrund bleiben.

Ein Ortsprofil kann unter anderem enthalten:

- Reiseziel und persönliche Unterzeile
- **Der Ort in Kürze**
- **Was möchtest du erleben?**
- **Reise vor Ort** mit Ankunft, Abfahrt und Zeitzone
- nachgelagerte **Orte & Motive**
- nachgelagerte Hinweise **Für unterwegs**
- eine von drei kuratierten Seitenwirkungen

Die Route referenziert intern weiterhin stabile `destinationId`-Werte. Ein Wechsel der Seitenwirkung ändert keine Inhalte, sondern ausschließlich die semantische Layoutentscheidung.

> **Der Inhalt gehört zum Ort. Das Layout gehört zur Erzählweise.**

### Seitenwirkung

- **Weite** – der Ort öffnet sich über ein ruhiges, flaches Panorama
- **Bild links** – das Bild führt in den Ort
- **Bild rechts** – die Geschichte führt, das Bild begleitet

Es gibt keine freie Positionierung, keine Koordinaten und keinen Layoutdesigner. Footer, Seitenzahl und Reisebegleiter bleiben beim Wechsel stabil. Northern Lines Publisher bleibt die authoritative Publishing Engine; Studio zeigt eine schnelle, glaubwürdige redaktionelle Vorschau.

## Layout Resilience & Content Capacity

Build 021 macht die vorhandenen Ortsseiten belastbarer, ohne neue Produktfunktionen oder neue `.nls`-Felder einzuführen. Die A5-Komposition kennt jetzt geschützte redaktionelle Zonen:

- **15 mm technische Mindest-Bindungszone** links
- geschützte Titelhierarchie
- geschützter Raum für den Fjord-Reisebegleiter
- stabiler Northern-Lines-Footer und Seitenzahl
- 1-, 2- oder 3-spaltige Modulgruppen je nach Kontext

**Weite** bleibt breit, flach und ruhig, nutzt den oberen Seitenraum aber effizienter. Wenn ein Ort mehr Inhalt trägt, darf Studio intern `comfortable`, `tight` oder `overflow` erkennen. Diese Zustände verändern weder Inhalte noch Typografie und werden nicht als technische Sprache in die Reiseoberfläche getragen.

Für Ankunft und Abfahrt tippt der Reisende nur die Uhrzeit, zum Beispiel `08:00`; Studio zeigt daraus automatisch **08:00 Uhr**.

> **Der Begleiter ist unantastbar – und sein Raum ebenfalls.**


## Destination Imagery Foundation

Build 022 gibt Reisezielen erstmals echte Ortsbilder, ohne Studio in eine Bildverwaltung zu verwandeln. Die finalisierte Fjord-Grammar benötigt dafür nur zwei Bildrollen:

- **Weite** – breites Panorama; Richtwert etwa **3:1–4:1**, mindestens **2400 px** breit
- **Bild links / Bild rechts** – gemeinsames hochformatiges Leitbild, Richtwert **2:3 / 1500 × 2250 px**

Studio zeigt neben **Bild auswählen …** eine kleine Hilfe mit der empfohlenen Geometrie. Die Bildhöhe der Preview darf innerhalb der Layout Grammar aus dem vorbereiteten Seitenverhältnis folgen; es gibt weiterhin bewusst **keinen Crop-Editor, keinen Focal Point und keine freie Bildpositionierung**. Gewählte Bilder werden innerhalb des `.nls`-Packages unter `assets/destinations/` abgelegt; sichtbare Dateipfade oder Asset-IDs gehören nicht zur Reisenden-UX.

Für Fjord gilt auf Destination Pages verbindlich eine **weiße / neutral-weiße Grundfläche**. Echte Bilder werden direkt in diese Seite komponiert und nicht auf farbige Medienboxen montiert. Informationsmodule werden ebenfalls nicht automatisch zu Cards; sanft eingefärbte Flächen bleiben gezielte redaktionelle Akzente.

> **Die Fotografie bringt die Atmosphäre. Die Typografie gibt ihr Haltung. Die Editorial World setzt die Akzente.**

Die Binding Safe Area beträgt ab Build 022 **15 mm technische Mindestzone**. Der Papageientaucher bleibt davon unabhängig an seiner bewährten Editorial-World-Position: **Der Begleiter ist unantastbar – und sein Zuhause ebenfalls.**

## Reisewelten

Eine Reisewelt bringt eine visuelle und redaktionelle Haltung mit. Die aktuelle Reisewelt ist **Fjord**.

Fjord definiert unter anderem:

- ruhige nordische Farb- und Typografiesprache
- kontrollierte Destination-Layouts
- Northern-Lines-Travel-Language-Footer
- Companion-Regeln
- Page Grammars
- Journey-Planning-Grammar

### Layout Principle

> **Wenige starke Layouts. Viele persönliche Geschichten.**

Für Ortsseiten sind bewusst nur drei Varianten vorbereitet:

- **Weite** – ruhiges, flaches Panorama
- **Bild links** – Bild führt
- **Bild rechts** – Geschichte führt, Bild begleitet

Studio bleibt damit ein Travel-Publishing-System und wird nicht zum freien DTP-Baukasten.

## Travel Language Footer

Der wiederkehrende Fieldbook-Anker lautet:

**TRAVEL · PHOTOGRAPHY · Signet · MEMORIES**

Die Editorial World bestimmt seine visuelle Expression. Die Seitenzahl bleibt davon
getrennt und dient ausschließlich der Navigation.

## Companion Layout

Für Fjord gilt aktuell:

- kein Companion auf Cover, Willkommen und Inhaltsverzeichnis
- erster Auftritt mit **Reiseplanung**
- danach Begleitung auf Reise-, Orts-, Wissens-, Workflow-, Notiz- und Abschlussseiten
- Platz: **unten links**
- Pose: **Standard**
- Spiegelung: **aus**
- Größe: **klein**

> **Der Companion begleitet die Reise. Er eröffnet sie nicht.**

## `.nls`

`.nls` ist ein offenes Northern-Lines-Studio-Package. Seit Build 016 ist es unter macOS
als Reisedokument registriert und lässt sich direkt im Finder öffnen.

Build 022 aktualisiert das Format auf **0.9.0** und ergänzt semantische Bildrollen für Ortsprofile. Projekte im Format 0.8.0 sowie die bereits unterstützten älteren Formate werden beim Öffnen automatisch normalisiert.
Interne Destination-Profile werden aus vorhandenen Reisezielen und Seiten aufgebaut; fehlende
redaktionelle Inhalte werden dabei bewusst nicht erfunden.

## Entwicklung

```bash
pnpm install
pnpm tauri dev
```

## Validation Gates

Jeder Build muss mindestens diese Gates bestehen:

```bash
pnpm consistency
pnpm check
pnpm test
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
git diff --check
```

### Consistency Gate

Neue Journey- und Destination-Felder müssen durch die vollständige Datenkette geprüft werden:

```text
TypeScript Model
→ Rust Schema
→ .nls Migration
→ Tauri Command
→ Inspector
→ Preview
→ Layout Variants (für Destinations)
→ Layout Resilience / Content Capacity
→ Destination Imagery
→ Tests
```

## macOS-App installieren

```bash
./scripts/install-macos-app.sh
```

Danach liegt die Anwendung unter:

```text
/Applications/Northern Lines Studio.app
```

## Entwicklungsprinzipien

> **Studio wächst mit echten Reisen.**

Neue Layouts, Komponenten und Workflows entstehen aus realen Anforderungen und
bewährten Northern-Lines-Fieldbooks – nicht aus dem Ziel, jede theoretische
Gestaltungsmöglichkeit abzubilden.

## Build-Meilensteine

- **010** Story Authoring Foundation
- **011** Travel Language und Preview-Integration
- **013** Journey Beginning + Companion First Encounter
- **014** Journey Places Foundation
- **015** Journey Route Foundation
- **016** Journey Opening Foundation – `.nls` als echtes macOS-Reisedokument
- **017** Editorial World Layout Foundation
- **018** Companion Layout Foundation + Reiseplanung
- **019** Journey Planning Foundation – strukturierte Reisedaten
- **020** Destination Profile & Layout Variants Foundation – Ortsprofil und Seitenwirkung
- **021** Layout Resilience & Content Capacity Foundation – geschützte A5-Zonen und belastbare Inhaltskomposition

---

**Northern Lines Studio**
*Deine Reise. Deine Geschichten. Dein Fieldbook.*

#
## Build 023 – Destination Composition Refinement

Build 023 macht die drei vorhandenen Destination-Seitenwirkungen gestalterisch belastbarer, ohne neue Varianten oder freie DTP-Geometrie einzuführen.

Der finale UX-/Composition-Fix schützt bei **Weite** den Abstand zwischen Panorama und Titelblock, entfernt die dekorative Kopflinie der Portraitvarianten, gibt **Bild rechts** etwas mehr Textluft und reduziert die Hero-Bildbedienung im Inspector auf ruhige kontextuelle Textaktionen (`+ Bild auswählen`, `Bild ersetzen · Entfernen`). Persistenz und Hero-Asset-Modell bleiben unverändert.

- **Weite** bleibt eine atmosphärische Panoramazone auf weißer/neutral-weißer Fjord-Grundfläche.
- **Bild links** wird als bildgeführte Komposition feinjustiert.
- **Bild rechts** wird als textgeführte Komposition neu ausbalanciert; das Bild beginnt bewusst etwas tiefer und begleitet die Geschichte.
- Inhaltsgruppen verwenden automatisch eine zulässige **1-/2-/3-spaltige** Komposition abhängig von Menge und Dichte des Inhalts.
- Sanft eingefärbte Flächen bleiben semantische Akzente und werden nicht zu einem Card-UI-System.
- 15-mm-Bindungszone, Companion, Footer und Seitenzahl bleiben Invarianten.

### Inspector-Ergonomie

Der rechte Inspector lässt sich nun an seiner linken Kante Richtung Canvas vergrößern. Die Arbeitsbreite liegt bei **320–440 px**; auf kleineren Fenstern schützt Studio automatisch ausreichend Canvas-Raum. Die gewählte Breite wird lokal als Workspace-Präferenz gespeichert und gehört ausdrücklich **nicht** zum `.nls`-Projekt.

> **Der Inspector darf wachsen, wenn der Inhalt es verlangt – aber nie so weit, dass das Travelbook seine Rolle als Hauptfläche verliert.**

## Build 022 Final – Open-Flow Regression geschlossen

Der interne Befehl **Reise öffnen …** verwendet wieder den `.nls`-Dokument-/Package-Pfad und damit dieselbe gemeinsame Ladepipeline wie der macOS/Finder-Open-Flow. Finder-Integration, `.nls`-Registrierung und die Destination-Image-Composition bleiben unverändert.
