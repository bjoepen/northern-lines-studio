# Northern Lines Studio

**Aktueller Stand:** Build 047 · Mediterranean Editorial World · Studio `0.40.0-alpha.1`

**Geometrische Authority:** Golden Build 040

Northern Lines Studio ist eine spezialisierte macOS-Desktop-Anwendung für Travelbook-Authoring, visuelle Studio-Komposition und PDF-Export im Northern-Lines-Reise- und Fotografie-Ökosystem.

Studio ist kein allgemeines DTP-Programm, kein CMS und kein freier Layout-Baukasten. Der Reisende beschreibt Reise, Orte, Interessen und Geschichten in Travel Language. Studio komponiert daraus kuratierte, exakt-A5-fähige Seiten.

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
Build 047                          CURRENT DEVELOPMENT BASELINE
Golden Build 040                   A5 GEOMETRY AUTHORITY
Editorial Worlds                   FJORD · OSTSEE · MITTELMEER
World extensibility                PROVEN
Curated Cover / Welcome / Closing  ACCEPTED
Single-page PDF Proof              ACCEPTED
Document Proof                     ACCEPTED
canonical publication order        ACCEPTED
exact DIN A5                       ACCEPTED
Standard whole-document PDF        ACCEPTED
PDF/A-2b Studio export             ACCEPTED
Publisher Production Host          INTEGRATED
external veraPDF validation         PASS
Windows                            OUT OF CURRENT SCOPE
```

Build 047 liefert mit Mittelmeer den praktischen Architekturbeweis, dass eine neue Editorial World über die vorgesehenen Registries, Contracts und World Expression hinzugefügt werden kann, ohne Studio eine neue Page Grammar oder einen neuen Renderer beizubringen. Die akzeptierte PDF/A-2b-Fähigkeit und die integrierte Production-Host-Architektur bleiben RC-relevante Meilensteine. Das README beschreibt damit den aktuellen belastbaren Studio-Stand, behauptet aber nicht, dass Studio bereits RC, fertig oder production-ready ist.

## Produktidee

Northern Lines Studio spricht in **Travel Language**. Technische Mechanismen bleiben im Hintergrund:

- **Neue Reise beginnen** statt Projekt anlegen
- **Reiseplanung** statt Journey-Metadaten
- **Ort hinzufügen** statt Destination Page erzeugen
- **Was möchtest du in [Ort] erleben?** statt Archetyp oder Unterseite konfigurieren
- **Deine Route** statt Manifest-Reihenfolge
- **Deine Geschichte** statt Textblock-Editor
- `.nls` im Finder doppelklicken statt Projektordner auswählen

> **Studio shows the journey, not the software.**

## Studio / Publisher

Studio ist für den normalen Studio-Travelbook-Pfad die autoritative Anwendung für:

- Authoring
- Editorial Worlds
- resolved page composition
- exact A5
- Single-page visual proof
- whole-document proof
- Standard PDF
- PDF/A-2b

Für die Production-Integration gilt die verbindliche Architekturregel:

> **Northern Lines Studio owns the page. Publisher owns the production job.**

Publisher darf die von Studio entschiedenen Seiten nicht neu interpretieren und keinen zweiten Renderer etablieren. Der integrierte Production Host reproduziert die bereits aufgelöste Studio-Seite für den Production Job; Layout, Renderer und World-Semantik bleiben Eigentum von Studio.

Studio ist damit nicht zu einem professionellen Prepress-/DTP-System geworden. Es bleibt eine fokussierte Travelbook-Anwendung.

## Architektur

- **Frontend:** Svelte + TypeScript
- **Desktop Shell:** Tauri v2
- **Backend:** Rust
- **Rendering:** HTML/CSS Studio page rendering
- **Projektformat:** offenes `.nls`-Package
- **Aktive Plattform:** macOS

Golden Build 040 bleibt die geometrische Authority:

```text
Studio page width       = 420 u
Studio physical height  = 420 × 210 / 148
                        = 595.9459459459 u
Golden composition      = 420 × 594 u
Physical target medium  = 148 × 210 mm
```

Build 047 ist die aktuelle Development-Baseline; Golden Build 040 bleibt davon unabhängig die geometrische Authority. Damit werden Geometrie-Referenz und Produktstand bewusst getrennt.

Studio ist die visuelle und geometrische Quelle der Wahrheit. Proof-, Export- und Production-Code reproduzieren die bereits aufgelöste Studio-Seite; sie erfinden keine zweite Komposition.

### Editorial World Extensibility Milestone

Build 046 härtete die World Registries und das World Wiring. Build 047 führt mit **Mittelmeer** erstmals eine dritte reale Editorial World über diese Extension Points ein.

```text
Editorial World
    ↓
World / Layout / Companion Registries
    ↓
World Expression
    ↓
shared semantic page model
    ↓
shared adaptive Layout Grammar
    ↓
shared Studio renderer
```

Für Mittelmeer waren keine neuen Page Types, keine neue Destination Grammar, kein World-spezifischer Renderer-Branch und keine `.nls`-Migration erforderlich. Die native Tauri-Projektvalidierung wurde als Teil des End-to-End-World-Contracts auf die dritte World erweitert und durch das Build-047-Gate abgesichert.

> **Build 047 proves Editorial World extensibility: a new World can be added without teaching Studio a new page language.**

## PDF Proof, Export und Production Host

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

PDF/A-2b ist ein bounded postprocessing des akzeptierten Document PDFs. Es gibt keinen zweiten Renderer, kein Re-Rendering, keine Rasterisierung, kein Transparency Flattening, kein Reflow und keinen Content-Stream-Rewrite.

Die Production-Host-Integration baut darauf auf: Studio rendert weiterhin die Seite; Publisher steuert ausschließlich den Production Job. Der macOS-WebKit-Host ist so integriert, dass der Export ohne sichtbares „Daumenkino“ durch das Dokument laufen kann und dabei dieselbe Studio-Komposition verwendet.

Die installierte macOS-App wurde mit einem realen Travelbook als PDF/A-2b validiert. Externe veraPDF-Evidence:

```text
PDF/A-2b compliant       true
passed rules             144
failed rules             0
passed checks            72,943
failed checks            0
```

## Verbindliche Referenzen

Northern Lines Studio wird durch diese dauerhaften Referenzen geführt:

- `README.md` – aktueller Produkt- und Baseline-Stand
- `AGENTS.md` – bindender Arbeitsvertrag für Coding Agents
- `docs/PRODUCT-DNA.md` – Produkt-, UX-, Travel-Language- und Layoutprinzipien
- `docs/VISION.md` – langfristiges Zielbild
- `docs/ARCHITECTURE.md` – technische Verantwortungsgrenzen
- `docs/editorial-worlds/EDITORIAL-WORLD-CONTRACT.md` – Vertrag für Editorial Worlds
- `docs/editorial-worlds/FJORD.md` / `docs/editorial-worlds/OSTSEE.md` – bestehende World Expressions
- `docs/builds/BUILD-046-WORLD-REGISTRY-HARDENING.md`
- `docs/builds/BUILD-046B-WORLD-WIREUP-HARDENING.md`
- `docs/builds/BUILD-047-MEDITERRANEAN-WORLD-EXTENSIBILITY-MILESTONE.md` – praktischer World-Extensibility-Nachweis
- `docs/adr/ADR-039-STUDIO-RESOLVED-PAGE-PDF-PROOF.md`
- `docs/adr/ADR-040-STUDIO-DOCUMENT-PROOF.md`
- `docs/adr/ADR-041-STUDIO-PDFA-2B-EXPORT.md`
- `docs/validation/STUDIO-PDFA-2B-INTEGRATION-VALIDATION.md`
- `docs/builds/BUILD-043-CURATED-WELCOME.md`
- `docs/builds/BUILD-044-CURATED-CLOSING.md`
- `docs/builds/BUILD-045-DESTINATION-IDENTITY-INTEGRITY.md`

## Aktueller Journey Lifecycle

1. Reise beginnen
2. Reisewelt wählen
3. Reisebegleiter kennenlernen
4. Reiseplanung ausfüllen
5. Orte hinzufügen
6. Route formen
7. Geschichten und Vertiefungen bearbeiten
8. Destination-Fotografie auswählen
9. Änderungen sichern
10. Travelbook im Studio prüfen
11. Single-page oder whole-document Proof erzeugen
12. Standard PDF oder PDF/A-2b exportieren
13. `.nls` direkt aus dem Finder wieder öffnen

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

Studio speichert diese Informationen im Journey-Modell und macht sie unmittelbar auf der Reiseplanungsseite sichtbar.

> **Der Reisende beschreibt den Rahmen seiner Reise. Studio macht ihn sichtbar.**

Die Dauer ist eine abgeleitete Größe und wird nicht redundant im `.nls` gespeichert.

## Ortsprofil, stabile Identität & Seitenwirkung

Der Ort ist ein strukturiertes redaktionelles Objekt. Im normalen Studio-Workflow arbeitet der Reisende am **Ortsprofil** und wählt die **Seitenwirkung**, während technische Destination-Strukturen im Hintergrund bleiben.

Ein Ortsprofil kann unter anderem enthalten:

- Reiseziel und persönliche Unterzeile
- **Der Ort in Kürze**
- **Was möchtest du erleben?**
- **Reise vor Ort** mit Ankunft, Abfahrt und Zeitzone
- nachgelagerte **Orte & Motive**
- nachgelagerte Hinweise **Für unterwegs**
- eine von drei kuratierten Seitenwirkungen

Die Route referenziert intern stabile `destinationId`-Werte. Sichtbare Umbenennungen ändern die stabile technische Identität nicht. Runtime-Updates lösen ein Destination Profile über die persistierte `JourneyStage.destinationId` auf; sie leiten eine bestehende Identität nicht erneut aus einem sichtbaren Namen oder einer Stage-ID ab.

> **Der Inhalt gehört zum Ort. Das Layout gehört zur Erzählweise.**

### Seitenwirkung

- **Weite** – der Ort öffnet sich über ein ruhiges, flaches Panorama
- **Bild links** – das Bild führt in den Ort
- **Bild rechts** – die Geschichte führt, das Bild begleitet

Es gibt keine freie Positionierung, keine Koordinaten und keinen Layoutdesigner. Footer, Seitenzahl und Reisebegleiter bleiben beim Wechsel stabil.

## Editorial Worlds

Eine Reisewelt bringt eine visuelle und redaktionelle Haltung mit. Aktiv verfügbar sind **Fjord**, **Ostsee** und **Mittelmeer**. Alle drei teilen dieselbe semantische und adaptive Layout Grammar; Typografie, Palette, Extension Expression, Curated Assets und Companion gehören zur jeweiligen World.

Mittelmeer trägt die World Expression **„Zypresse & Stein“**: Zypressengrün führt die typografische Hierarchie, helle Olive- und Steinflächen schaffen Wärme und Ruhe, gebrannte Terrakotta setzt kleine Akzente. Der **Iberische Luchs** ist der World Mittelmeer zugeordnet; seine Companion-Identität bleibt fachlich `iberian-lynx`.

Editorial Worlds färben die Seitenfläche nicht ein. Die A5-Seite bleibt neutral weiß; World Expression entsteht über Typografie, Akzente, Companion, Signets, gezielte Editorial-/Extension-Flächen, kuratierte Illustrationen und Fotografie.

Der praktische Nachweis aus Build 047 ist verbindlich: Eine neue World erweitert die Expression, nicht die Seitensprache. Neue World Expression allein ist kein Grund für eine neue Grammar oder einen Renderer-Sonderpfad.

> **Wenige starke Möglichkeiten. Viele persönliche Geschichten.**

## Kuratierte Start- und Abschlussseiten

Die Front- und Closing-Matter-Seiten folgen derselben Northern-Lines-Bildsprache wie die übrige World Expression:

- **Cover** – kuratierter Einstieg, keine zweite Layoutsprache
- **Willkommen** – Build 043, World-konformer Hero und persönlicher Gedankenraum
- **Die Reise bleibt** – Build 044, ruhiger Abschluss mit World-konformer Expression

Die Gestaltung ist kuratiert; Projektinhalt und World Expression bleiben getrennt. Editorial Worlds verwenden dieselbe Grammar, aber ihre jeweils eigene visuelle Sprache.

## Thematische Vertiefungen einer Destination

Die Destination ist ein semantisches Zentrum mit optionalen Zusatzseiten. Die Haupt-Ortsseite bleibt allgemein und ruhig; Vertiefungen folgen dem Interesse der konkreten Reise.

Verbindlich vorbereitet sind genau vier Archetypen:

- **Fotografie**
- **Wandern & Natur**
- **Kultur & Geschichte** – inklusive Museen, Architektur und historischen/antiken Stätten
- **Kulinarik & Lokal**

Mehrere Interessen dürfen zu demselben Ort gehören. Studio spricht dabei nicht von Seitentypen oder Archetypen, sondern fragt beispielsweise:

> **Was möchtest du in Bergen erleben?**

Die neue Seite bleibt mit Bergen verbunden, erscheint direkt bei diesem Ort in **Deine Route** und übernimmt automatisch die aktive Editorial World.

## Travel Companion Pages

Studio führt wiederverwendbare Travel Companion Pages für kuratierte Reisebegleitung. Der kuratierte Kern bleibt programmneutral und wiederverwendbar; kurze optionale Reisehinweise dürfen projektspezifisch authoriert werden.

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

Studio darf intern `comfortable`, `tight` oder `overflow` erkennen. Diese Zustände verändern weder Inhalte noch Primärtypografie und werden nicht als technische Sprache in die Reiseoberfläche getragen.

> **Der Begleiter ist unantastbar – und sein Raum ebenfalls.**

Wenn die endliche Grammar erschöpft ist, meldet Studio Kapazitätsdruck statt Text zu clippen, Typografie willkürlich zu schrumpfen oder Companion/Footer zu verschieben.

## Destination Imagery

Destination Pages verwenden semantische Bildrollen:

- **Weite** – breites Panorama; Richtwert etwa **3:1–4:1**, mindestens **2400 px** breit
- **Bild links / Bild rechts** – gemeinsames hochformatiges Leitbild, Richtwert **2:3 / 1500 × 2250 px**

Studio zeigt Hilfe zur empfohlenen Geometrie. Es gibt bewusst keinen Crop-Editor, keinen Focal Point und keine freie Bildpositionierung. Gewählte Bilder werden innerhalb des `.nls`-Packages unter `assets/destinations/` abgelegt; sichtbare Dateipfade oder Asset-IDs gehören nicht zur Reisenden-UX.

Damit ist Destination-Fotografie **project-owned**. Curated Heroes, Companion, Signets und World-Illustrationen bleiben dagegen **world-owned** und werden nicht in das `.nls` dupliziert.

> **Die Fotografie bringt die Atmosphäre. Die Typografie gibt ihr Haltung. Die Editorial World setzt die Akzente.**

## Editorial Extension Zones

Destination Pages können optionale semantische Erweiterungen tragen: **Wissen, Fotospot, Tipp, Souvenir, Wichtig und Geschichte**. Sie erscheinen nur dort, wo ein Ort tatsächlich zusätzliche redaktionelle Bedeutung trägt.

> **Das Signet sagt, was es ist. Die Farbe sagt, zu welcher Welt es gehört. Mehr muss die Box nicht erklären.**

Extension Zones sind rahmenlos. Ein gemeinsames semantisches Signet wird durch die aktive Editorial World eingefärbt; die Stärke der world-konformen Fläche übernimmt die Gewichtung. Es gibt keine frei wählbare Asset-Bibliothek und keinen Box-Designer.

## Travel Language Footer

Der wiederkehrende Fieldbook-Anker lautet:

**TRAVEL · PHOTOGRAPHY · Signet · MEMORIES**

Die Editorial World bestimmt seine visuelle Expression. Die Seitenzahl bleibt davon getrennt und dient ausschließlich der Navigation.

## Companion Layout

Der Companion ist World Expression innerhalb eines gemeinsamen geschützten Layout-Vertrags. Für die aktiven Worlds gilt derselbe Grundsatz: Companion-Position und -Proportionen dürfen World-spezifisch ausgedrückt werden; sein geschützter Raum nimmt nicht am Content-Fit teil.

Für Fjord gilt als Referenz:

- kein Companion auf Cover, Willkommen und Orientierung
- erster Auftritt mit **Reiseplanung**
- danach Begleitung auf Reise-, Orts-, Wissens-, Workflow-, Erinnerungs- und Abschlussseiten
- Platz: **unten links**
- Pose: **Standard**
- Spiegelung: **aus**
- Größe: **klein**

> **Der Begleiter ist unantastbar.**

## `.nls`

`.nls` ist ein offenes Northern-Lines-Studio-Package. Unter macOS ist es als Reisedokument registriert und lässt sich direkt im Finder öffnen.

**Aktuelles Projektformat:** `.nls` `0.16.0`

`.nls` speichert semantische Projekt- und Editorial-State-Daten, keine freie Seitengeometrie. Migrationen erhalten bestehende Journey-, Destination-, Bild-, Extension- und Interest-Daten; Studio erfindet keine Routen oder Interessen.

Interne Destination-Profile werden aus vorhandenen Reisezielen und Seiten aufgebaut. Fehlende redaktionelle Inhalte werden bewusst nicht erfunden.

## Windows Scope

Der aktive Produkt-, Engineering- und Validierungsscope ist macOS.

Windows-Anwendung, Windows-PDF-Proof-Adapter, Windows-PDF/A-Export und Windows-Runtime-Validierung sind derzeit außerhalb des aktiven Scopes / deferred. Das ist keine dauerhafte Absage an Windows, aber keine aktuelle Implementierungs- oder Roadmap-Zusage.

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
cargo check --manifest-path src-tauri/Cargo.toml
git diff --check
```

Für Build 047 zusätzlich:

```bash
pnpm consistency:build-047a
pnpm consistency:build-047b
```

Scoped PDF/export/Production-Host consistency gates exist for the accepted proof, PDF/A and Publisher-production architecture. Run them when touching those areas.

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

Neue Layouts, Komponenten und Workflows entstehen aus realen Anforderungen und bewährten Northern-Lines-Fieldbooks, nicht aus dem Ziel, jede theoretische Gestaltungsmöglichkeit abzubilden.

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
- **042** Curated Cover
- **Production Integration** Publisher Production Host ohne zweiten Renderer
- **043** Curated Welcome – Fjord und Ostsee
- **044** Curated Closing – „Die Reise bleibt“
- **045** Destination Identity Integrity – Rename über persistierte `destinationId`
- **046** World Registry Hardening
- **046B** World Wire-up Hardening
- **047** Mediterranean Editorial World – World Extensibility praktisch bewiesen

## Repository-Beispiele

`examples/Norway-Sample.nls` ist ein bewusst historisches `.nls`-Beispiel im Format `0.5.0`. Es dient als Legacy-/Migration-Referenz und ist **nicht** die kanonische Vorlage für ein neu erzeugtes Projekt. Das aktuelle Projektformat ist in `docs/project-format.md` dokumentiert.

## License and source availability

Northern Lines Studio is **source available, but not open source**.

The source code is publicly visible to make development transparent. The public repository may be viewed and forked using GitHub's functionality in accordance with the GitHub Terms of Service.

No general license is granted for independent redistribution, relicensing, incorporation into another product, or commercial exploitation.

Northern Lines brand and design materials remain separately reserved.

See [`LICENSE.md`](LICENSE.md) for the complete rights notice.

Copyright © 2026 Northern Lines. All rights reserved.

## Status

Northern Lines Studio befindet sich weiterhin in aktiver Entwicklung. Build 047 erweitert Studio um die dritte Editorial World Mittelmeer und hat die World-Extensibility-Architektur praktisch bewiesen. Golden Build 040 bleibt die geometrische Authority; die akzeptierten Proof-, PDF/A- und Production-Host-Pfade bleiben unverändert maßgeblich.
