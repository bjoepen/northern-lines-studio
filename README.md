# Northern Lines Studio

**Travel Publishing für macOS – Build 001**

Northern Lines Studio ist eine spezialisierte visuelle und redaktionelle Arbeitsumgebung für Northern Lines Travel Fieldbooks. Es ist kein allgemeines DTP-Programm.

## Build 001

Der erste Build beweist ausschließlich den kleinsten vollständigen Workflow:

1. ein `.nls`-Projektverzeichnis auswählen,
2. `project.json` lesen und validieren,
3. die Seitenstruktur anzeigen,
4. eine Seite auswählen,
5. eine statische A5-Vorschau und Metadaten darstellen.

Nicht enthalten sind Bearbeitung, Drag-and-drop, freie Layoutobjekte, Publisher-Aufruf, PDF-Export und Preflight.

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

## Commit-Vorschlag

```text
feat(studio): rebuild Build 001 with Tauri and Svelte
```
