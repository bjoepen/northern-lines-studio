# Northern Lines Studio

**Aktueller Stand:** Golden Build 040 · Studio `0.40.0-alpha.1`

Northern Lines Studio ist eine spezialisierte macOS-Desktop-Anwendung für
Travelbook-Authoring, visuelle Studio-Komposition und PDF-Export im
Northern-Lines-Reise- und Fotografie-Ökosystem.

Studio ist kein allgemeines DTP-Programm, kein CMS und kein freier
Layout-Baukasten. Der Reisende beschreibt Reise, Orte, Interessen und
Geschichten in Travel Language. Studio komponiert daraus kuratierte,
exakt-A5-fähige Seiten.

> **Der Reisende öffnet kein Projekt. Er öffnet seine Reise.**

## Aktueller Produktstand

Der akzeptierte Studio-Pfad ist heute:

```text
Reise / Travelbook authorieren
→ Editorial World
→ semantische Seitenkomposition
→ exact-A5 Studio page
→ Single-page visual proof
→ whole-document proof
→ Standard PDF
→ PDF/A-2b
```

Aktueller Scope:

```text
macOS                              ACTIVE
Tauri v2                           ACTIVE
Golden Build 040                   AUTHORITATIVE
Single-page PDF Proof              ACCEPTED
Document Proof                     ACCEPTED
canonical publication order        ACCEPTED
exact DIN A5                       ACCEPTED
Standard whole-document PDF        ACCEPTED
PDF/A-2b Studio export             ACCEPTED
external veraPDF validation         PASS
Windows                            OUT OF CURRENT SCOPE
```

Die akzeptierte PDF/A-2b-Fähigkeit ist ein RC-relevanter Meilenstein. Das
README erklärt damit einen deutlich reiferen Studio-Stand, behauptet aber
nicht, dass Studio bereits RC, fertig oder production-ready ist.

## Produktidee

Northern Lines Studio spricht in **Travel Language**. Technische Mechanismen
bleiben im Hintergrund:

- **Neue Reise beginnen** statt Projekt anlegen
- **Reiseplanung** statt Journey-Metadaten
- **Ort hinzufügen** statt Destination Page erzeugen
- **Was möchtest du in [Ort] erleben?** statt Archetyp oder Unterseite konfigurieren
- **Deine Route** statt Manifest-Reihenfolge
- **Deine Geschichte** statt Textblock-Editor
- `.nls` im Finder doppelklicken statt Projektordner auswählen

> **Studio shows the journey, not the software.**

## Studio / Publisher

Studio ist für den normalen Studio-Travelbook-Pfad heute die autoritative
Anwendung für:

- Authoring
- Editorial Worlds
- resolved page composition
- exact A5
- Single-page visual proof
- whole-document proof
- Standard PDF
- PDF/A-2b

Northern Lines Publisher bleibt eine eigenständige spätere Publishing- und
Production-Perspektive. Er kann künftig professionelle oder
prepress-orientierte Erweiterungen, Validierung, Staging, Packaging oder
Produktionsinfrastruktur beitragen. Für Studio-originierte Seiten gilt aber:
Publisher darf die von Studio entschiedenen Seiten nicht neu interpretieren
oder mit einer zweiten Layout-Engine neu komponieren.

Studio ist damit nicht zu einem professionellen Prepress-/DTP-System geworden.
Es bleibt eine fokussierte Travelbook-Anwendung.

## Architektur

- **Frontend:** Svelte + TypeScript
- **Desktop Shell:** Tauri v2
- **Backend:** Rust
- **Rendering:** HTML/CSS Studio page rendering
- **Projektformat:** offenes `.nls`-Package
- **Aktive Plattform:** macOS

Golden Build 040 ist die aktuelle geometrische Authority:

```text
Studio page width       = 420 u
Studio physical height  = 420 × 210 / 148
                        = 595.9459459459 u
Golden composition      = 420 × 594 u
Physical target medium  = 148 × 210 mm
```

Studio ist die visuelle und geometrische Quelle der Wahrheit. Proof- und
Export-Code reproduzieren die bereits aufgelöste Studio-Seite; sie erfinden
keine zweite Komposition.

## PDF Proof und Export

Der akzeptierte Single-page PDF Proof ist in ADR-039 beschrieben:

```text
resolved Studio page
→ native macOS WKWebView PDF generation
→ metadata-only exact-A5 PageBox normalization
→ validation
```

Der akzeptierte Document Proof ist in ADR-040 beschrieben:

```text
canonical Studio publication order
→ serial resolved-page readiness
→ accepted single-page primitive for each page
→ content-preserving PDF assembly
→ final document validation
→ atomic output
```

Der akzeptierte PDF/A-2b-Pfad ist in ADR-041 beschrieben:

```text
canonical Studio Travelbook
→ accepted exact-A5 Document PDF
→ bounded PDF/A-2b postprocessing
   ├─ XMP / PDF-A identification
   ├─ trailer /ID
   ├─ RGB OutputIntent
   └─ /Interpolate true → false where required
→ integrity / structural validation
→ atomic final output
```

PDF/A-2b ist ein bounded postprocessing des akzeptierten Document PDFs. Es gibt
keinen zweiten Renderer, kein Re-Rendering, keine Rasterisierung, kein
Transparency Flattening, kein Reflow und keinen Content-Stream-Rewrite.

Die installierte macOS-App wurde mit einem realen 16-seitigen Travelbook als
PDF/A-2b validiert. Externe veraPDF-Evidence:

```text
PDF/A-2b compliant       true
passed rules             144
failed rules             0
passed checks            72,943
failed checks            0
```

## Verbindliche Referenzen

Northern Lines Studio wird durch diese dauerhaften Referenzen geführt:

- `README.md` – aktueller Produkt- und Build-Stand
- `AGENTS.md` – bindender Arbeitsvertrag für Coding Agents
- `docs/PRODUCT-DNA.md` – Produkt-, UX-, Travel-Language- und Layoutprinzipien
- `docs/VISION.md` – langfristiges Zielbild
- `docs/ARCHITECTURE.md` – technische Verantwortungsgrenzen
- `docs/editorial-worlds/EDITORIAL-WORLD-CONTRACT.md` – Vertrag für Editorial Worlds
- `docs/editorial-worlds/FJORD.md` / `docs/editorial-worlds/OSTSEE.md` – World Expressions
- `docs/adr/ADR-039-STUDIO-RESOLVED-PAGE-PDF-PROOF.md`
- `docs/adr/ADR-040-STUDIO-DOCUMENT-PROOF.md`
- `docs/adr/ADR-041-STUDIO-PDFA-2B-EXPORT.md`
- `docs/validation/STUDIO-PDFA-2B-INTEGRATION-VALIDATION.md`

## Aktueller Journey Lifecycle

1. Reise beginnen
2. Reisewelt wählen
3. Reisebegleiter kennenlernen
4. Reiseplanung ausfüllen
5. Orte hinzufügen
6. Route formen
7. Geschichten und Vertiefungen bearbeiten
8. Änderungen sichern
9. Travelbook im Studio prüfen
10. Single-page oder whole-document Proof erzeugen
11. Standard PDF oder PDF/A-2b exportieren
12. `.nls` direkt aus dem Finder wieder öffnen

## Journey Planning

Die Reiseplanung hält strukturierte Reisedaten fest:

- **Startdatum**
- **Enddatum**
- automatisch abgeleitete **Dauer**
- **Startpunkt**
- **Rückkehr / Ziel**
- **Transport**
- **Route im Überblick**
- **Fokus der Reise**

Studio speichert diese Informationen im Journey-Modell und macht sie unmittelbar
auf der Reiseplanungsseite sichtbar.

> **Der Reisende beschreibt den Rahmen seiner Reise. Studio macht ihn sichtbar.**

Die Dauer ist eine abgeleitete Größe und wird nicht redundant im `.nls`
gespeichert.

## Ortsprofil & Seitenwirkung

Der Ort ist ein strukturiertes redaktionelles Objekt. Im normalen
Studio-Workflow arbeitet der Reisende am **Ortsprofil** und wählt die
**Seitenwirkung**, während technische Destination-Strukturen im Hintergrund
bleiben.

Ein Ortsprofil kann unter anderem enthalten:

- Reiseziel und persönliche Unterzeile
- **Der Ort in Kürze**
- **Was möchtest du erleben?**
- **Reise vor Ort** mit Ankunft, Abfahrt und Zeitzone
- nachgelagerte **Orte & Motive**
- nachgelagerte Hinweise **Für unterwegs**
- eine von drei kuratierten Seitenwirkungen

Die Route referenziert intern stabile `destinationId`-Werte. Ein Wechsel der
Seitenwirkung ändert keine Inhalte, sondern ausschließlich die semantische
Layoutentscheidung.

> **Der Inhalt gehört zum Ort. Das Layout gehört zur Erzählweise.**

### Seitenwirkung

- **Weite** – der Ort öffnet sich über ein ruhiges, flaches Panorama
- **Bild links** – das Bild führt in den Ort
- **Bild rechts** – die Geschichte führt, das Bild begleitet

Es gibt keine freie Positionierung, keine Koordinaten und keinen Layoutdesigner.
Footer, Seitenzahl und Reisebegleiter bleiben beim Wechsel stabil.

## Editorial Worlds

Eine Reisewelt bringt eine visuelle und redaktionelle Haltung mit. Aktiv
verfügbar sind **Fjord** und **Ostsee**. Beide teilen dieselbe semantische und
adaptive Layout Grammar; Typografie, Palette, Extension Expression und
Companion gehören zur jeweiligen World.

Editorial Worlds färben die Seitenfläche nicht ein. Die A5-Seite bleibt
neutral weiß; World Expression entsteht über Typografie, Akzente, Companion,
Signets, gezielte Editorial-/Extension-Flächen und Fotografie.

> **Wenige starke Möglichkeiten. Viele persönliche Geschichten.**

## Thematische Vertiefungen einer Destination

Die Destination ist ein semantisches Zentrum mit optionalen Zusatzseiten. Die
Haupt-Ortsseite bleibt allgemein und ruhig; Vertiefungen folgen dem Interesse
der konkreten Reise.

Verbindlich vorbereitet sind genau vier Archetypen:

- **Fotografie**
- **Wandern & Natur**
- **Kultur & Geschichte** – inklusive Museen, Architektur und historischen/antiken Stätten
- **Kulinarik & Lokal**

Mehrere Interessen dürfen zu demselben Ort gehören. Studio spricht dabei nicht
von Seitentypen oder Archetypen, sondern fragt beispielsweise:

> **Was möchtest du in Bergen erleben?**

Die neue Seite bleibt mit Bergen verbunden, erscheint direkt bei diesem Ort in
**Deine Route** und übernimmt automatisch die aktive Editorial World.

## Travel Companion Pages

Studio führt wiederverwendbare Travel Companion Pages für kuratierte
Reisebegleitung. Der kuratierte Kern bleibt programmneutral und wiederverwendbar;
kurze optionale Reisehinweise dürfen projektspezifisch authoriert werden.

Aktuelle Companion-Themen umfassen unter anderem:

- **Licht**
- **Wetter**
- kuratierter **Fotografie-Workshop**

## Layout Resilience & Content Capacity

Die A5-Komposition kennt geschützte redaktionelle Zonen:

- technische Mindest-Bindungszone
- geschützte Titelhierarchie
- geschützter Raum für den World Companion
- stabiler Northern-Lines-Footer und Seitenzahl
- definierte Inhalts- und Extension-Zonen

Studio darf intern `comfortable`, `tight` oder `overflow` erkennen. Diese
Zustände verändern weder Inhalte noch Primärtypografie und werden nicht als
technische Sprache in die Reiseoberfläche getragen.

> **Der Begleiter ist unantastbar – und sein Raum ebenfalls.**

Wenn die endliche Grammar erschöpft ist, meldet Studio Kapazitätsdruck statt
Text zu clippen, Typografie willkürlich zu schrumpfen oder Companion/Footer zu
verschieben.

## Destination Imagery

Destination Pages verwenden semantische Bildrollen:

- **Weite** – breites Panorama; Richtwert etwa **3:1–4:1**, mindestens **2400 px** breit
- **Bild links / Bild rechts** – gemeinsames hochformatiges Leitbild, Richtwert **2:3 / 1500 × 2250 px**

Studio zeigt Hilfe zur empfohlenen Geometrie. Es gibt bewusst keinen
Crop-Editor, keinen Focal Point und keine freie Bildpositionierung. Gewählte
Bilder werden innerhalb des `.nls`-Packages unter `assets/destinations/`
abgelegt; sichtbare Dateipfade oder Asset-IDs gehören nicht zur Reisenden-UX.

> **Die Fotografie bringt die Atmosphäre. Die Typografie gibt ihr Haltung. Die Editorial World setzt die Akzente.**

## Editorial Extension Zones

Destination Pages können optionale semantische Erweiterungen tragen:
**Wissen, Fotospot, Tipp, Souvenir, Wichtig und Geschichte**. Sie erscheinen nur
dort, wo ein Ort tatsächlich zusätzliche redaktionelle Bedeutung trägt.

> **Das Signet sagt, was es ist. Die Farbe sagt, zu welcher Welt es gehört. Mehr muss die Box nicht erklären.**

Extension Zones sind rahmenlos. Ein gemeinsames semantisches Signet wird durch
die aktive Editorial World eingefärbt; die Stärke der world-konformen Fläche
übernimmt die Gewichtung. Es gibt keine frei wählbare Asset-Bibliothek und
keinen Box-Designer.

## Travel Language Footer

Der wiederkehrende Fieldbook-Anker lautet:

**TRAVEL · PHOTOGRAPHY · Signet · MEMORIES**

Die Editorial World bestimmt seine visuelle Expression. Die Seitenzahl bleibt
davon getrennt und dient ausschließlich der Navigation.

## Companion Layout

Für Fjord gilt aktuell:

- kein Companion auf Cover, Willkommen und Orientierung
- erster Auftritt mit **Reiseplanung**
- danach Begleitung auf Reise-, Orts-, Wissens-, Workflow-, Erinnerungs- und Abschlussseiten
- Platz: **unten links**
- Pose: **Standard**
- Spiegelung: **aus**
- Größe: **klein**

> **Der Companion begleitet die Reise. Er eröffnet sie nicht.**

## `.nls`

`.nls` ist ein offenes Northern-Lines-Studio-Package. Unter macOS ist es als
Reisedokument registriert und lässt sich direkt im Finder öffnen.

`.nls` speichert semantische Projekt- und Editorial-State-Daten, keine freie
Seitengeometrie. Migrationen erhalten bestehende Journey-, Destination-, Bild-,
Extension- und Interest-Daten; Studio erfindet keine Routen oder Interessen.

Interne Destination-Profile werden aus vorhandenen Reisezielen und Seiten
aufgebaut. Fehlende redaktionelle Inhalte werden bewusst nicht erfunden.

## Windows Scope

Der aktive Produkt-, Engineering- und Validierungsscope ist macOS.

Windows-Anwendung, Windows-PDF-Proof-Adapter, Windows-PDF/A-Export und
Windows-Runtime-Validierung sind derzeit außerhalb des aktiven Scopes /
deferred. Das ist keine dauerhafte Absage an Windows, aber keine aktuelle
Implementierungs- oder Roadmap-Zusage.

## Entwicklung

```bash
pnpm install
pnpm tauri dev
```

## Validation Gates

Canonical local gate from repository root:

```bash
pnpm check
pnpm test
pnpm consistency
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
git diff --check
```

Scoped PDF/export consistency gates exist for the accepted proof and PDF/A
architecture. Run them when touching those areas.

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
bewährten Northern-Lines-Fieldbooks, nicht aus dem Ziel, jede theoretische
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
- **021** Layout Resilience & Content Capacity Foundation – geschützte A5-Zonen
- **022** Destination Imagery Foundation – semantische Bildrollen und `.nls`-Assets
- **023** Destination Composition Refinement – stabile Hero/Title-Zonentrennung
- **024** Editorial Extension Zones Foundation – selektive semantische Erweiterungen
- **025C** Editorial Worlds Milestone – Fjord und Ostsee als echte World Architecture
- **026** Destination Interest Pages Foundation
- **027** Photography & Place Experience
- **028** Hiking & Nature Experience
- **029** Culture & History Experience
- **030** Culinary & Local Experience
- **031** Travel Companion Foundation: Licht
- **032** Travel Companion Wetter
- **033** Kuratierter Fotografie-Workshop
- **034** Workshop Capacity Protection und finaler White-Page-/Version-Cleanup
- **035** Fjord Curated Heroes
- **036** Ostsee Curated Heroes
- **037** Inhaltsverzeichnis & Notizen
- **038** Orientierung & Erinnerungen
- **039** Studio Resolved Page PDF Proof accepted
- **040** Golden Geometry Authority und Studio Document Proof accepted
- **041** Studio PDF/A-2b Export accepted

## License and source availability

Northern Lines Studio is **source available, but not open source**.

The source code is publicly visible to make development transparent. The public
repository may be viewed and forked using GitHub's functionality in accordance
with the GitHub Terms of Service.

No general license is granted for independent redistribution, relicensing,
incorporation into another product, or commercial exploitation.

Northern Lines brand and design materials remain separately reserved.

See [`LICENSE.md`](LICENSE.md) for the complete rights notice.

Copyright © 2026 Northern Lines. All rights reserved.
