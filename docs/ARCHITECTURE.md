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
