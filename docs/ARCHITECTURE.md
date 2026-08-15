> **Dauerhafte Produktreferenz:** Technische Entscheidungen werden zusätzlich gegen `PRODUCT-DNA.md` geprüft. Architektur darf komplex werden; die Produktoberfläche bleibt ruhig, redaktionell und in Travel Language.

# Architektur

## Status

Verbindlich für Build 001.

```text
Svelte + TypeScript UI
        │ Tauri invoke
        ▼
Rust Desktop Bridge
        │ liest und validiert
        ▼
.nls-Projekt / project.json

Northern Lines Publisher CLI
        │
        └── spätere Integration, nicht Teil von Build 001
```

## Verantwortungsgrenzen

### Northern Lines Studio

- Projekt auswählen
- Seitenstruktur darstellen
- redaktionelle Auswahlzustände verwalten
- Vorschau und Inspector darstellen
- später Publisher-Workflows auslösen

### Northern Lines Publisher

- Schemas und fachliche Validierung
- Layout Grammar
- Content Fit
- Render Jobs
- Assets
- Preflight
- Produktionsausgabe

Studio darf diese Publishing-Regeln nicht duplizieren.

## Technische Bausteine

- Tauri 2 für Desktop-Fenster, Rechte und Rust-Kommandos
- Svelte und TypeScript für die Benutzeroberfläche
- HTML/CSS für die statische A5-Seite
- Rust für kontrollierten Dateisystemzugriff und Manifestvalidierung
- Publisher später als externe CLI bzw. Sidecar

Die Entscheidung ist in ADR-002 dokumentiert.

## Editorial Grammar Layer (Build 005)

Studio now contains an author-facing Editorial Grammar Layer between the Journey/World model and future rendering integration.

```text
.nls Journey Project
        │
        ▼
Reference World (Fjord)
        │
        ▼
Editorial Grammar
        │
        ├── Story contract
        │     Hero · text · Knowledge · photography · QR · ...
        │
        └── Editorial Frame contract
              Header · Footer · page number · Companion
```

The grammar layer does not render geometry and does not call Northern Lines Publisher. Its responsibility is to explain page intent and editorial completeness in the language of the author. Publisher integration remains a later boundary.


## Story Components Layer (Build 008)

Build 008 makes the approved editorial layer model explicit in the Studio domain:

```text
Journey Project
      ↓
Editorial World
      ↓
Page Grammar
      ↓
Story Components
      ↓
future authored Content
```

A Story Component is an author-facing semantic expression such as `Hero`, `Fotografie`, `Northern Lines Wissen`, `Zitat` or `Mitbringsel & Souvenirs`. It is not a rectangle, text frame or generic layer. Components are derived from the page manifest and grammar; no geometry is introduced.

The persistent page identity remains a separate **Editorial Frame** (`Header`, `Footer`, dynamic page number, `Companion`). **Annotations** are reserved for future selection/guides and never belong to published content.

## Companion Collection (Build 009)

Editorial Worlds reference a stable Companion ID. Studio resolves that ID through `src/lib/companions/`; the visual asset and metadata are retained in `design-library/companions/`.

```text
Editorial World
    ↓ companionId
Companion Registry
    ↓ assetPath
Northern Lines Design Library
```

Only Fjord is an active Editorial World in Build 009. Planned Companion concepts may exist without making additional Worlds available in Studio.

## Build 022 – Destination imagery boundary

Destination imagery is semantic project data, not free layout geometry.

Studio owns:

- selecting a prepared **Weite** image or one shared portrait image for **Bild links / Bild rechts**;
- copying supported JPEG/PNG files into the `.nls` package;
- storing project-relative image-role paths;
- fast non-destructive editorial preview;
- contextual source-geometry guidance.

Publisher remains responsible for authoritative image composition, final geometry, Content Fit, rendering and Preflight.

Build 022 deliberately introduces no crop rectangle, focal point, x/y image position, free image-box geometry or generic Asset Manager. Fjord Destination pages keep a neutral-white paper surface; real imagery is composed directly on that surface and may preserve its prepared source ratio inside the grammar. Information modules are not automatically cardified. The 15 mm technical binding minimum protects relevant page content; Companion positioning remains an Editorial-World invariant and is not derived from the content inset.


## Build 023 – composition and workspace preference boundary

Destination composition refinement remains entirely in the Editorial Preview/Layout Grammar layer. No new `.nls` fields, crop geometry, x/y coordinates or layout variants are introduced. Module grouping is derived at runtime from semantic destination content and is not persisted.

Inspector width is a **workspace preference**, not project state. It is stored locally in the webview preference store (`localStorage`) and clamped between 320 and 440 px with an additional viewport-dependent maximum. This keeps machine/user ergonomics outside the portable `.nls` document contract.

## Build 024 – Editorial Extension Zones

Editorial Extensions gehören semantisch zum `Destination`-Domain-Modell. Persistiert werden ausschließlich ID, semantischer Typ, optionaler Titel und Inhalt. Signet-Datei, World-Farbe, Flächenintensität und Position gehören nicht in `.nls`; sie werden aus der Editorial World bzw. Layout Grammar abgeleitet.

Damit bleibt die Grenze erhalten:

- **Studio/Domain:** Was ist diese redaktionelle Ergänzung und was erzählt sie?
- **Editorial World:** Wie drückt sich diese Semantik farblich und grafisch aus?
- **Layout Grammar / Publisher:** Wo darf sie erscheinen und wie wird Content Fit autoritativ aufgelöst?

Der Companion bleibt außerhalb des Content-Flows. Extension Zones müssen seine geschützte Zone respektieren.

## Build 025B · Editorial World Contract

Editorial Worlds are resolved through a registry and a shared contract. World-specific expression is kept separate from semantic project data and adaptive Layout Grammar. See `docs/editorial-worlds/EDITORIAL-WORLD-CONTRACT.md`.

## Build 026 – Destination Interest Pages boundary

A Destination remains the semantic centre of a place. The main Destination Profile is not duplicated when the traveller adds a thematic deep-dive page.

Build 026 models a thematic deep-dive as a `destination_interest` page in `pageManifest` with two semantic links:

- `journeyStage` binds the page to the existing Destination/Journey Stage;
- `destinationInterestKind` identifies one of the four curated interests.

The page therefore owns editorial page state while the Destination continues to own shared place data such as name, journey context, imagery and Editorial Extensions. World Expression, Companion placement, Footer and safe-zone geometry remain derived responsibilities of Editorial World / Layout Grammar and are not persisted per interest page.

This keeps the architecture aligned with the product rule:

> **Die Destination bleibt das Zentrum. Die Vertiefung folgt dem Interesse der Reise.**

## Structured Interest Entry Authoring · Build 028 Fix

Interest Pages persist repeated semantic units as `StudioPage.interestEntries`. The frontend provides archetype-specific forms, while Rust remains authoritative for persistence and 0.13.0 → 0.14.0 migration.

The page model stores **what belongs together**; it does not store the chosen visual composition. One-box/two-box layout, density (`comfortable` / `tight`) and overflow remain derived Layout Grammar decisions.

Legacy line-based Photography/Hiking authoring remains readable during migration but is no longer the primary editing model.

## Build 029 · Structured Culture & History Interest Experience
Culture & History uses the same structured `DestinationInterestEntry` foundation as Photography and Hiking. Page-specific field schemas live in the Interest Entry schema layer; persistence remains generic in Rust. Rendering is archetype-specific, while composition, density, World Expression, Companion/Footer protection and overflow behavior remain shared Interest Page grammar responsibilities. This keeps the architecture on **Model → Rust persistence → semantic entry schema → Inspector → adaptive preview → consistency tests**, without introducing a page-specific persistence command.

## Build 030 · Structured Culinary & Local Interest Experience
Kulinarik & Lokal uses the same generic `DestinationInterestEntry` persistence foundation as the other Interest archetypes. The specialist schema lives in the Interest Entry definition layer, while rendering remains archetype-specific and composition/density/capacity remain shared grammar responsibilities. This completes the four-archetype proof that the Interest Page architecture is semantic rather than photography-specific.
