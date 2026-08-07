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
