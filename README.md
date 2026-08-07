# Northern Lines Studio

**Travel Publishing für macOS – Build 002**

Northern Lines Studio ist eine spezialisierte visuelle und redaktionelle Arbeitsumgebung für Northern Lines Travel Fieldbooks. Es ist kein allgemeines DTP-Programm.

## Build 002

Build 002 entwickelt den Build-001-Projektleser zum ersten redaktionellen Workspace weiter. Reference Editorial World 001 – **Fjord** – wird sichtbar, ohne bereits eine allgemeine Theme- oder World-Engine einzuführen.

Der aktuelle Workflow:

1. ein `.nls`-Travelbook öffnen,
2. die Reference World **Fjord** und ihren Companion **Papageientaucher** erkennen,
3. das Travelbook über semantische Bereiche wie **Buch** und **Reiseziele** navigieren,
4. eine Seite auswählen,
5. Editorial Preview, Inspector und Projektstatus gemeinsam erleben.

Nicht enthalten sind Bearbeitung, Drag-and-drop, freie Layoutobjekte, Publisher-Aufruf, PDF-Export, Knowledge Library und Preflight.

## Architektur

- **Tauri 2** – Desktop-Shell, Dateidialog und sichere Rust-Bridge
- **Svelte 5 + TypeScript** – Benutzeroberfläche
- **HTML/CSS** – statische A5-Vorschau
- **Rust** – Laden und Validieren des `.nls`-Projektmanifests
- **Northern Lines Publisher** – bleibt eine eigenständige Engine; die CLI-Anbindung ist für einen späteren Build vorgesehen

Die frühere SwiftUI-/AppKit-Hypothese wurde durch [ADR-002](docs/adr/ADR-002-TAURI-SVELTE-PUBLISHER-CLI.md) ersetzt.

## Voraussetzungen

- macOS
- Xcode Command Line Tools
- Node.js 22 oder neuer
- pnpm 10 oder neuer
- Rust über `rustup`

```bash
xcode-select --install
corepack enable
rustup update stable
```

## Entwicklung starten

```bash
pnpm install
pnpm tauri dev
```

Nach dem Start über **Projekt öffnen** das Verzeichnis auswählen:

```text
examples/Norway-Sample.nls
```

## Tests und Build

```bash
pnpm check
pnpm test
cd src-tauri && cargo test && cd ..
pnpm tauri build
```

## Repository-Struktur

```text
northern-lines-studio/
├── src/                         # Svelte-Oberfläche
├── src-tauri/                   # Tauri/Rust-Desktop-Layer
├── examples/Norway-Sample.nls/ # Beispielprojekt
├── docs/                        # Architektur und Build-Dokumentation
├── package.json
└── README.md
```

## Build-Dokumentation

- `docs/builds/BUILD-002.md`
- `docs/validation/BUILD-002-VALIDATION.md`
- `docs/git/BUILD-002-GIT-WORKFLOW.md`

## Commit-Vorschlag

```text
feat(studio): introduce the Fjord editorial workspace
```
