# Northern Lines Studio – Architektur

**Stand:** Golden Build 040 · Studio 0.40.0-alpha.1  
**Status:** Aktuelle Architekturreferenz  
**Plattform:** macOS  

> **Dauerhafte Produktreferenz:** Technische Entscheidungen werden zusätzlich gegen `PRODUCT-DNA.md` geprüft. Architektur darf komplex werden; die Produktoberfläche bleibt ruhig, redaktionell und in Travel Language.

## 1. Aktuelle Authority

Golden Build 040 ist die verbindliche geometrische Basis für die aktuelle Studio-Entwicklung.

Der zentrale Architekturgrundsatz lautet:

> **Studio ist die visuelle und geometrische Quelle der Wahrheit für Studio-originierte Seiten. Nachgelagerte Proof- und Exportpfade reproduzieren Studio; sie interpretieren die Seite nicht neu.**

Historische Aussagen, nach denen Northern Lines Publisher die finale Geometrie oder eine zweite Layout Grammar für bereits in Studio aufgelöste Seiten besitzt, sind für diesen Pfad superseded. Historische ADRs bleiben als Entscheidungsverlauf erhalten; die aktuelle Authority wird durch `AGENTS.md`, Golden Build 040 und die akzeptierten aktuellen ADRs bestimmt.

## 2. Systemübersicht

```text
.nls Journey Project
        │
        ▼
Svelte + TypeScript Authoring UI
        │
        ├── Journey / Destination Domain
        ├── Editorial Worlds
        ├── Semantic Page Models
        ├── Layout Grammar
        └── Content Fit / Capacity
        │
        ▼
Resolved Studio Page
        │
        ├── Canvas / Editorial Preview
        ├── Single-page PDF Proof
        └── canonical Travelbook order
                │
                ▼
        Document Proof / Standard PDF
                │
                ▼
        bounded PDF/A-2b post-processing
```

Rust/Tauri übernimmt kontrollierten Dateisystemzugriff, `.nls`-Persistenz und Migrationen, native macOS-Integration sowie den akzeptierten PDF-/PDF-A-Pfad.

## 3. Verantwortungsgrenzen

### Northern Lines Studio

Studio besitzt für Studio-originierte Travelbooks:

- Reise- und Destination-Semantik;
- redaktionelles Authoring;
- Editorial Worlds und World Expression;
- semantische Page Models;
- adaptive Layout Grammar;
- Content Fit und Capacity Protection;
- Hero-, Title-, Content-, Extension-, Companion-, Footer- und Binding-Zonen;
- World-Typografie;
- visuelle Seitenkomposition;
- Golden-Build-040-Seitengeometrie;
- canonical publication order;
- Single-page PDF Proof;
- Document Proof und Standard Travelbook PDF;
- PDF/A-2b als begrenzte, content-erhaltende Nachverarbeitung.

Studio speichert Bedeutung und redaktionellen Zustand. Freie X/Y-Geometrie, beliebige Frames oder ein allgemeines DTP-Modell gehören nicht in `.nls`.

### Northern Lines Publisher

Northern Lines Publisher bleibt ein unabhängiges Produkt und eine mögliche spätere Production-/Prepress-Infrastruktur.

Für Studio-originierte, bereits aufgelöste Seiten gilt jedoch:

```text
Studio resolved page
      ↓
proof/export contract
      ↓
optional downstream production infrastructure
```

Publisher darf eine bereits aufgelöste Studio-Seite nicht mit einer zweiten Composition Engine, eigenen Content-Fit-Heuristiken oder abweichender Typografie neu zusammensetzen.

Potentiell wiederverwendbar bleiben unter anderem deterministische Validierungsberichte, stabile Fehlercodes, CLI-Struktur, Asset-Staging, Hash-Manifeste, Preflight- und Production-Konzepte – sofern Studio Authority unangetastet bleibt.

## 4. Technische Basis

- Tauri v2
- Svelte
- TypeScript
- HTML/CSS für Studio Page Rendering
- Rust für Desktop-, Dateisystem-, Persistenz- und native macOS-Funktionen
- pnpm / Node
- Vitest
- Svelte Check

Die aktive Produkt- und Entwicklungsplattform ist macOS. Windows ist für die aktuelle Phase ausdrücklich deferred.

## 5. Semantische Architektur

Die Kernkette lautet:

```text
Journey Project
      ↓
Editorial World
      ↓
Page Type / Page Grammar
      ↓
Semantic Story Content
      ↓
finite Layout Candidates
      ↓
Content Fit before Composition
      ↓
Resolved Studio Page
```

Der Nutzer editiert Bedeutung. Studio komponiert sie.

Persistiert werden semantische Entscheidungen, nicht die endgültige freie Seitengeometrie.

## 6. Journey und Destinations

Eine Destination ist ein semantisches Objekt und nicht mit einer einzelnen Seite identisch.

Stabile Beziehungen verbinden Journey Stages, Destinations und die daraus entstehenden redaktionellen Seiten.

Das Destination Profile bleibt das Zentrum des Ortes. Thematische Vertiefungen referenzieren dieselbe Destination, statt gemeinsame Ortsdaten zu duplizieren.

> **Die Destination bleibt das Zentrum. Die Vertiefung folgt dem Interesse der Reise.**

## 7. Destination Interest Pages

Die vier kuratierten Archetypen sind:

- Fotografie
- Wandern & Natur
- Kultur & Geschichte
- Kulinarik & Lokal

Interest Pages speichern semantische Inhalte und wiederholbare strukturierte Entries. Sie speichern nicht die gewählte visuelle Komposition.

World Expression, Companion, Footer, Safe Zones, Composition und Density bleiben abgeleitete Verantwortlichkeiten.

Die vier Archetypen verwenden eine gemeinsame semantische Grundlage; ihre fachlichen Entry-Schemata und Darstellungen dürfen archetypspezifisch sein.

## 8. Editorial Worlds

Eine Editorial World ist eine kuratierte visuelle Sprache, kein Theme und keine Farbpalette.

Sie besitzt – soweit für die World definiert –:

- Display- und Body-Typografie;
- Color Language;
- Graphic Language;
- Curated Accents;
- Companion Identity;
- Image / Asset Expression;
- semantische Surface Expression.

Die physische Seite bleibt weiß bzw. neutral-weiß. World Expression erscheint gezielt über Typografie, Akzente, Signets, Flächen, Companion und Fotografie.

Interest Pages erben die vollständige aktive World Expression.

World-spezifische Darstellung darf semantische Journey-Daten nicht verändern.

## 9. Finite Visual Vocabulary

Northern Lines Studio verwendet bewusst ein begrenztes visuelles Vokabular.

Semantische Rollen wie `Tipp`, `Wichtig`, `Fotospot`, `Wissen` oder `Souvenir` können World-konforme Signets, Akzente und Flächen erhalten.

Eine unkontrollierte Asset-, Card- oder Template-Bibliothek ist nicht Teil der Produktarchitektur.

## 10. Protected Editorial Zones

Verbindliche Zonen sind:

- Hero Zone
- Title Zone
- Content Zone
- Editorial Extension Zones
- Companion Safe Zone
- Footer Safe Zone
- Binding Safe Zone

> **Kuscheln erlaubt, jeder im eigenen Bett.**

Hero und Title sind Geschwister, keine Mitbewohner. Semantische Zonen dürfen visuell nah beieinander liegen, aber nicht überlappen oder geschützten Raum ausleihen.

Der Companion ist kein normaler Layoutteilnehmer. Footer und Companion werden nicht verschoben, verkleinert oder geopfert, um Content Fit zu retten.

## 11. Content Fit before Composition

Layoutauswahl ist eine endliche Suche über zugelassene Kompositionen.

```text
semantic content
      ↓
allowed candidates
      ↓
fit against content + protected zones
      ↓
density evaluation
      ↓
resolved composition
```

Ein Kandidat ist ungültig, wenn er Clipping, willkürliche Typografie-Verkleinerung, Content außerhalb seiner redaktionellen Fläche oder das Ausleihen von Companion-/Footer-Safe-Zones verlangt.

Capacity kann intern als `comfortable`, `tight` oder `overflow` bewertet werden.

Wenn die finite Grammar erschöpft ist, meldet Studio Kapazitätsdruck. Es erfindet nicht spontan ein neues Layoutsystem.

> **Nicht sammeln, sondern erzählen.**

Unabhängige semantische Entries dürfen nicht nur zur Platzersparnis in eine generische Sammelbox kollabieren.

## 12. Golden Build 040 – physische Seite

Verbindliche Geometrie:

```text
Studio page width       = 420 u
Studio physical height  = 420 × 210 / 148
                        = 595.9459459459 u
Golden composition      = 420 × 594 u
A5 extension            = 1.9459459459 u
Physical aspect ratio   = exact DIN A5
Physical medium         = 148 × 210 mm
Coordinate origin       = top-left
```

`u` bezeichnet Studio Units.

Build 040 korrigiert das physische Seitenverhältnis auf exaktes DIN A5, ohne die etablierte Golden Composition innerhalb `420 × 594 u` umzubauen.

Footer, Companion, Safe Zones, Title, Hero, Content, Typografie und bestehende Bottom Anchors bleiben relativ zur Golden Composition unverändert.

Renderer-getriebenes `fit-to-page`, `scale-to-fit`, `shrink-to-fit`, nicht-uniforme Skalierung oder nachträgliche Rekonstruktion sind verboten.

## 13. Studio PDF Proof

Der akzeptierte Single-page-Pfad lautet:

```text
resolved Studio page
→ proof/readiness state
→ Tauri/Rust
→ native macOS WKWebView PDF
→ metadata-only exact-A5 PageBox normalization
→ validation
→ explicit success/failure
```

Die Normalisierung verändert die PageBox-Metadaten auf exaktes DIN A5. Sie skaliert, verschiebt oder komponiert den Seiteninhalt nicht neu.

Der frühere System-Print-/A4-Pfad ist historische Evidenz und keine aktuelle Architektur.

## 14. Document Proof und Standard PDF

Der akzeptierte Whole-document-Pfad lautet:

```text
canonical Studio publication order
→ serial resolved-page readiness
→ accepted single-page primitive per page
→ staged exact-A5 PDFs
→ content-preserving assembly
→ final validation
→ atomic output
```

Die Seitenzahl ist variabel und darf niemals als Renderer-Annahme festgeschrieben werden.

Die reale installierte macOS-App hat den akzeptierten Pfad mit einem 16-seitigen Travelbook erfolgreich durchlaufen.

## 15. PDF/A-2b

PDF/A-2b ist eine begrenzte Nachverarbeitung des akzeptierten Standard Document PDF und kein Render-Modus.

Akzeptierte Operationen:

1. XMP / PDF-A identification;
2. trailer `/ID`;
3. RGB OutputIntent aus einem geeigneten eingebetteten Profil;
4. `/Interpolate true` → `/Interpolate false`, wo erforderlich.

Geschützt bleiben:

```text
page count
canonical page order
A5 PageBoxes
page content streams
image stream bytes
font resources
layout geometry
```

Keine Rasterisierung, kein Transparency Flattening, kein Reflow, keine Skalierung, keine Translation und keine zweite Rendering-Architektur.

Studio prüft Struktur und Integrität. **veraPDF bleibt die externe ISO-Conformance-Authority** für Engineering- und Release-Evidenz.

Der akzeptierte reale Test meldete PDF/A-2b-konform mit 144 bestandenen und 0 fehlgeschlagenen Regeln.

## 16. `.nls` Contract

`.nls` speichert semantischen Projekt- und Editorial-Zustand.

Nicht persistiert werden freie Layoutkoordinaten nur deshalb, weil ein Renderer sie bequem fände.

Bestehende Felder dürfen nicht semantisch zweckentfremdet werden. Neue semantische Konzepte benötigen einen echten Domain-Grund, explizite Schemaentscheidung und Migrationsverhalten.

Migrationscode darf keinen redaktionellen Inhalt erfinden.

## 17. Workspace Preferences

Maschinen- oder nutzerspezifische Ergonomie ist kein portabler Projektzustand.

Beispiel: Inspector-Breite wird lokal als Workspace Preference gespeichert und gehört nicht in `.nls`.

## 18. Travel Companion Content

Travel Companion Pages sind erstklassige redaktionelle Seitentypen für wiederverwendbares Northern-Lines-Wissen.

Kuratiertes Produktwissen lebt in Studio-Code/Content-Ressourcen. Nur ausdrücklich reisespezifische Ergänzungen gehören in das jeweilige Projekt.

> **Curated truth is product content; personal travel context is project content.**

## 19. Entwicklungs- und Validierungsvertrag

Eine fachliche Änderung muss entlang ihrer tatsächlichen Responsibility Chain umgesetzt werden. Für persistierte Domain-Funktionen bleibt das etablierte Muster maßgeblich:

```text
Model → Rust → Migration → Command → Inspector → Preview → Tests
```

Nicht jede rein abgeleitete Layout- oder Workspace-Änderung benötigt künstlich jede Schicht dieser Kette.

Canonical local gate:

```bash
pnpm check
pnpm test
pnpm consistency
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
git diff --check
```

Native macOS-Real-World-Evidenz ist von automatisierten Gates getrennt zu dokumentieren.

## 20. Architekturprinzipien

1. **Studio shows the journey, not the software.**
2. **Der Nutzer editiert Bedeutung. Studio komponiert sie.**
3. **Studio entscheidet, was die Seite ist.**
4. **Content Fit before Composition.**
5. **Semantik statt freier Geometrie in `.nls`.**
6. **Editorial Worlds sind kuratierte Sprachen, keine Themes.**
7. **Hero, Title, Content, Companion und Footer respektieren ihre Zonen.**
8. **Die physische Seite bleibt neutral-weiß.**
9. **Der Exporter reproduziert Studio; er interpretiert Studio nicht neu.**
10. **Der bewiesene macOS-Pfad wird stabilisiert, nicht ohne neue Entscheidung neu erfunden.**

## 21. Historische Entwicklung

Die Architektur entstand inkrementell. Besonders prägend waren:

- Build 005: Editorial Grammar Layer;
- Build 008: Story Components;
- Build 009: Companion Collection;
- Build 019: Journey Planning;
- Build 020: Destination Entity und Seitenwirkungen;
- Build 021–023: Layout Resilience, Safe Zones, Imagery und Composition;
- Build 024: Editorial Extension Zones;
- Build 025B: Editorial World Contract;
- Build 026–030: Destination Interest Pages und vier strukturierte Archetypen;
- Build 030 Fix: Content Fit before Composition;
- Build 031+: Travel Companion und weitere redaktionelle Seitentypen;
- Build 035–036: Curated Heroes / World Expression;
- Build 037–039: Utility Pages und Editorial Consolidation;
- Build 040: exact-A5 physical page contract;
- ADR-039: accepted Single-page PDF Proof;
- ADR-040: accepted Document Proof / Standard PDF;
- ADR-041: accepted PDF/A-2b Export.

Historische ADRs und Build-Notizen erklären, wie diese Architektur entstanden ist. Bei Konflikten gilt die aktuelle Authority aus `AGENTS.md`, Golden Build 040, aktuellem Source Code und akzeptierten aktuellen ADRs.
