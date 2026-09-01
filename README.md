# Northern Lines Studio

**Aktueller Stand:** Build 048 · Mediterranean Editorial World COMPLETE · Studio `0.40.0-alpha.1`

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
Build 048                          CURRENT DEVELOPMENT BASELINE
Golden Build 040                   A5 GEOMETRY AUTHORITY
Editorial Worlds                   FJORD · OSTSEE · MITTELMEER
Mediterranean Editorial World      COMPLETE
World extensibility                PROVEN
Curated World Assets               FJORD · OSTSEE · MITTELMEER
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

Build 047 erbrachte mit Mittelmeer den praktischen Architekturbeweis, dass eine neue Editorial World über die vorgesehenen Registries, Contracts und World Expression hinzugefügt werden kann, ohne Studio eine neue Page Grammar oder einen neuen Renderer beizubringen. Build 048 vervollständigt diese dritte World mit den kuratierten Mittelmeer-Assets, Welcome/Cover, Closing, Notes und dem produktiven Asset-Wiring. **Mittelmeer ist damit als Editorial World COMPLETE.**

Die akzeptierte PDF/A-2b-Fähigkeit und die integrierte Production-Host-Architektur bleiben RC-relevante Meilensteine. Das README beschreibt damit den aktuellen belastbaren Studio-Stand, behauptet aber nicht, dass Studio bereits RC, fertig oder production-ready ist.

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

Build 048 ist die aktuelle Development-Baseline; Golden Build 040 bleibt davon unabhängig die geometrische Authority. Damit werden Geometrie-Referenz und Produktstand bewusst getrennt.

Studio ist die visuelle und geometrische Quelle der Wahrheit. Proof-, Export- und Production-Code reproduzieren die bereits aufgelöste Studio-Seite; sie erfinden keine zweite Komposition.

### Editorial World Extensibility Milestone

Build 046 härtete die World Registries und das World Wiring. Build 047 führte mit **Mittelmeer** erstmals eine dritte reale Editorial World über diese Extension Points ein; Build 048 vervollständigt deren kuratierte Bildwelt.

```text
Editorial World
    ↓
World / Layout / Companion Registries
    ↓
World Expression + Curated World Assets
    ↓
shared semantic page model
    ↓
shared adaptive Layout Grammar
    ↓
shared Studio renderer
```

Für Mittelmeer waren keine neuen Page Types, keine neue Destination Grammar, kein World-spezifischer Renderer-Branch und keine `.nls`-Migration erforderlich. Die native Tauri-Projektvalidierung wurde als Teil des End-to-End-World-Contracts auf die dritte World erweitert und durch die Build-047-Gates abgesichert. Build 048 registriert die Mittelmeer-Assets über dasselbe generische World Asset Manifest wie Fjord und Ostsee.

> **Build 047 proves Editorial World extensibility: a new World can be added without teaching Studio a new page language.**

> **Build 048 completes Mediterranean through the shared World Asset architecture, without creating a Mediterranean renderer path.**

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
- `docs/editorial-worlds/FJORD.md` / `docs/editorial-worlds/OSTSEE.md` / `docs/editorial-worlds/MITTELMEER.md` – World Expressions
- `docs/editorial-worlds/MITTELMEER-CURATED-ASSET-CONTRACT.md` – Mittelmeer Curated Asset Contract
- `docs/builds/BUILD-046-WORLD-REGISTRY-HARDENING.md`
- `docs/builds/BUILD-046B-WORLD-WIREUP-HARDENING.md`
- `docs/builds/BUILD-047-MEDITERRANEAN-WORLD-EXTENSIBILITY-MILESTONE.md` – praktischer World-Extensibility-Nachweis
- `docs/builds/BUILD-048-MEDITERRANEAN-CURATED-ASSETS.md` – vollständige kuratierte Mittelmeer-Bildwelt
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

Build 048 vervollständigt die World mit eigenständigen kuratierten Assets für **Fotografie, Wandern & Natur, Kultur & Geschichte, Kulinarik & Lokal, Fotografie-Workshop, Welcome/Cover, Closing und Notes**. Der allgemeine Travel-Preparation-Hero der Checklisten bleibt bewusst world-neutral und wird von allen Worlds gemeinsam verwendet.

Editorial Worlds färben die Seitenfläche nicht ein. Die A5-Seite bleibt neutral weiß; World Expression entsteht über Typografie, Akzente, Companion, Signets, gezielte Editorial-/Extension-Flächen, kuratierte Illustrationen und Fotografie.

Der praktische Nachweis aus Build 047/048 ist verbindlich: Eine neue World erweitert Expression und World Assets, nicht die Seitensprache. Neue World Expression allein ist kein Grund für eine neue Grammar oder einen Renderer-Sonderpfad.

> **Wenige starke Möglichkeiten. Viele persönliche Geschichten.**

## Kuratierte Start- und Abschlussseiten

Die Front- und Closing-Matter-Seiten folgen derselben Northern-Lines-Bildsprache wie die übrige World Expression:

- **Cover** – kuratierter Einstieg; verwendet den World-`welcomeHero`, keine zweite Layoutsprache
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

## `.nls`-Projektformat

Studio verwendet ein offenes `.nls`-Package als Projektformat. Projektinhalte, Destination-Fotografie und strukturierte Reisedaten gehören zum Projekt; kuratierte World Assets bleiben Bestandteil der Studio Design Library.

Das Projektformat ist bewusst unabhängig von der konkreten visuellen Renderer-Implementierung. Editorial World, stabile Destination-Identitäten und semantische Inhalte werden persistiert; abgeleitete Layout- und Darstellungszustände werden nicht als zweite Wahrheit gespeichert.

## Windows Scope

Der aktuelle Produkt- und Validierungsscope ist macOS. Windows gehört nicht zum derzeit akzeptierten Studio-Pfad und darf nicht aus einer erfolgreichen macOS-Implementierung abgeleitet werden.

## Validation Gates

Der normale Quality-Gate-Pfad lautet:

```bash
pnpm check
pnpm test
pnpm consistency
pnpm build
git diff --check
```

Build-spezifisch stehen für Mittelmeer zusätzlich zur Verfügung:

```bash
pnpm consistency:build-047a
pnpm consistency:build-047b
pnpm consistency:build-047c
pnpm consistency:build-047d
pnpm consistency:build-048
```

Die Consistency Gates schützen nicht nur Implementierungsdetails, sondern dauerhafte Produkt- und Architekturverträge. Ein grüner Build darf diese Verträge nicht stillschweigend umgehen.

## Installation auf macOS

Für die lokale Entwicklungs-App:

```bash
pnpm tauri dev
```

Für die installierte macOS-App:

```bash
./scripts/install-macos-app.sh
```

Nach Packaging-relevanten Änderungen sollen sowohl `tauri dev` als auch die frisch installierte App aus `/Applications` geprüft werden.

## Entwicklungsprinzipien

- Studio besitzt Seite, Layout, Renderer und World-Semantik.
- Publisher besitzt den Production Job, nicht die Seite.
- Golden Build 040 bleibt geometrische Authority.
- Neue Editorial Worlds erweitern Expression und kuratierte Assets, nicht die Page Grammar.
- World-spezifische Sonderrenderer sind kein akzeptierter Erweiterungspfad.
- Companion und Footer behalten ihre geschützten Layout-Räume.
- `.nls` bleibt offen, semantisch und projektbezogen.
- Persistierte Identität darf nicht aus sichtbaren Namen rekonstruiert werden.
- Proof und Export reproduzieren Studio; sie komponieren Studio nicht neu.

## Build-Meilensteine

Aktuelle relevante Meilensteine:

```text
040   Golden A5 Geometry Authority
041   Curated Checklist
042   Curated Cover
043   Curated Welcome
044   Curated Closing
045   Destination Identity Integrity
046   World Registry Hardening
046B  World Wireup Hardening
047   Mediterranean World Extensibility · ACCEPTED
048   Mediterranean Curated Assets · ACCEPTED
      Mediterranean Editorial World · COMPLETE
```

## Repository-Beispiele

```text
src/lib/worlds/                 Editorial World Registry / Contracts
src/lib/layout/                 Layout Grammar / Capacity
src/lib/companions/             Companion Registry / Layout Contract
src/lib/world-assets.ts         Curated World Asset Manifest
public/design-library/worlds/   Runtime World Assets
public/design-library/companions/ Runtime Companion Assets
design-library/companions/      Canonical Companion Sources
docs/editorial-worlds/          Editorial World Contracts / Expressions
docs/builds/                    Build Decisions / Milestones
scripts/check-*.mjs             Consistency / Architecture Gates
```

## License and source availability

Northern Lines Studio is source available, but not open source.

The repository is published for transparency, documentation, review and controlled collaboration. Publication of the source code does not grant permission to reuse the Northern Lines product identity, editorial design system, curated assets, trademarks, travel language or proprietary visual expression outside the terms explicitly provided by the repository owner.

## Status

Northern Lines Studio befindet sich weiterhin in aktiver Entwicklung. **Build 048 ist die aktuelle Development-Baseline. Die Editorial World Mittelmeer ist COMPLETE und wurde zusammen mit Build 047/048 nach `main` übernommen.** Golden Build 040 bleibt die geometrische Authority; die akzeptierten Proof-, PDF/A- und Production-Host-Pfade bleiben unverändert maßgeblich.
