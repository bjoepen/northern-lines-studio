# Northern Lines Studio

**Travel Publishing für macOS – Build 005**

Northern Lines Studio ist die ruhige visuelle und redaktionelle Arbeitsumgebung für Northern Lines Travel Fieldbooks. Es ist kein allgemeines DTP-Programm.

> Die Seite ist der Mittelpunkt der Arbeitsumgebung. Alles andere dient der Geschichte.

Vor der technischen Dokumentation sollte zuerst [`docs/000-NORTHERN-LINES.md`](docs/000-NORTHERN-LINES.md) gelesen werden.

## Build 005 – Editorial Grammar Foundation

Build 005 gibt Studio erstmals ein redaktionelles Verständnis für den Zweck einer Seite.

Der aktuelle Workflow:

1. ein `.nls`-Travelbook öffnen,
2. Reference World **Fjord** auflösen,
3. Reise und Seitenrollen semantisch navigieren,
4. eine Seite auswählen,
5. die passende Editorial Grammar laden,
6. Required/Optional Story Components deterministisch prüfen,
7. Editorial Completeness im ruhigen Inspector anzeigen,
8. Editorial Frame und Story als getrennte Verantwortlichkeiten verstehen.

Nicht enthalten sind Textbearbeitung, Bildimport, freie Layoutbearbeitung, Publisher-Aufruf, finaler Renderer, PDF-Export, KI-Bewertung oder eine zweite Editorial World.

## Architektur

- **Tauri 2** – Desktop-Shell, Dateidialog und Rust-Bridge
- **Svelte 5 + TypeScript** – Benutzeroberfläche
- **World Library** – Studio-eigene Editorial-World-Definitionen
- **Editorial Grammar Library** – Seitensprache, Komponentenrollen und Completeness
- **HTML/CSS** – ruhige, responsive A5-Vorschau
- **Rust** – Laden, Migration und Validierung des `.nls`-Projektmanifests
- **Northern Lines Publisher** – eigenständige Engine; CLI-Anbindung folgt später

## Editorial Layers

Studio verwendet keine beliebigen DTP-Ebenen. Es unterscheidet Verantwortlichkeiten:

```text
Editorial Frame
  Header · Footer · Seitenzahl · Companion

Story
  Hero · Titel · Texte · Knowledge · Fotografie · QR · ...

Annotations
  zukünftige Bearbeitungshilfen; nicht Teil des publizierten Inhalts
```

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

Nach dem Start über **Projekt öffnen** auswählen:

```text
examples/Norway-Sample.nls
```

## Tests und Build

```bash
pnpm check
pnpm test
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
```

## Build-Dokumentation

- `docs/builds/BUILD-005.md`
- `docs/adr/ADR-005-EDITORIAL-GRAMMAR-LIBRARY.md`
- `docs/ecr/ECR-004-EDITORIAL-GRAMMAR-FOUNDATION.md`
- `docs/validation/BUILD-005-VALIDATION.md`
- `docs/git/BUILD-005-GIT-WORKFLOW.md`

## Commit-Vorschlag

```text
feat(studio): introduce editorial grammar foundation
```
