# Northern Lines Studio

**Travel Publishing für macOS – Build 006**

Northern Lines Studio ist die ruhige visuelle und redaktionelle Arbeitsumgebung für Northern Lines Travel Fieldbooks. Es ist kein allgemeines DTP-Programm.

> Die Seite ist der Mittelpunkt der Arbeitsumgebung. Alles andere dient der Geschichte.

Vor der technischen Dokumentation sollte zuerst [`docs/000-NORTHERN-LINES.md`](docs/000-NORTHERN-LINES.md) gelesen werden.

## Build 006 – Editorial Workspace Refinement

Build 006 verfeinert den realen macOS-Arbeitsplatz, ohne neue DTP-Werkzeuge einzuführen. Der Fokus bleibt auf der Seite.

Der aktuelle Workflow:

1. ein `.nls`-Travelbook öffnen,
2. Reference World **Fjord** auflösen,
3. Reise und Seitenrollen semantisch navigieren,
4. Editorial Grammar und Story Completeness verstehen,
5. die A5-Seite proportional im **Editorial Desk** betrachten,
6. den verfügbaren Fensterraum ruhig und automatisch nutzen,
7. zwischen Seiten mit einer dezenten Transition wechseln.

Build 006 ersetzt außerdem den zu großen unteren Statusbereich durch eine schlanke Statuszeile. Das `.nls`-Projektformat bleibt bewusst bei `0.4.0`.

Nicht enthalten sind Textbearbeitung, Bildimport, freie Layoutbearbeitung, Publisher-Aufruf, finaler Renderer, PDF-Export, beliebige Zoomsteuerung oder eine zweite Editorial World.

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

- `docs/builds/BUILD-006.md`
- `docs/ecr/ECR-005-EDITORIAL-WORKSPACE-REFINEMENT.md`
- `docs/validation/BUILD-006-VALIDATION.md`
- `docs/git/BUILD-006-GIT-WORKFLOW.md`
- `docs/engineering/DROP-IN-STANDARD.md`

## Commit-Vorschlag

```text
feat(studio): refine the editorial workspace experience
```
