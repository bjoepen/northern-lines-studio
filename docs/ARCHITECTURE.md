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
