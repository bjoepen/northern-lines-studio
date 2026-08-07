# Northern Lines Studio

**Travel Publishing für macOS – Build 004**

Northern Lines Studio ist die ruhige visuelle und redaktionelle Arbeitsumgebung für Northern Lines Travel Fieldbooks. Es ist kein allgemeines DTP-Programm.

> Die Seite ist der Mittelpunkt der Arbeitsumgebung. Alles andere dient der Geschichte.

Vor der technischen Dokumentation sollte zuerst [`docs/000-NORTHERN-LINES.md`](docs/000-NORTHERN-LINES.md) gelesen werden.

## Build 004 – Reference World Foundation

Build 004 etabliert **Fjord** als erste echte Northern-Lines-Editorial-World und macht die A5-Seite im Workspace responsiv.

Der aktuelle Workflow:

1. ein `.nls`-Travelbook öffnen,
2. die projektseitige Referenz `fjord` gegen die Studio World Library auflösen,
3. Reference World 001 mit dem Editorial Companion **Papageientaucher** verstehen,
4. das Travelbook semantisch über Buch, Reiseziele, Reisebegleitung, Fotografie und Erinnerungen navigieren,
5. eine Seite auswählen,
6. die A5-Vorschau proportional mit dem verfügbaren Workspace skalieren,
7. World-, Reise- und Seitenkontext im ruhigen Inspector prüfen.

Nicht enthalten sind Bearbeitung, Drag-and-drop, Publisher-Aufruf, finaler Renderer, PDF-Export, Knowledge-Editing oder eine zweite Editorial World.

## Architektur

- **Tauri 2** – Desktop-Shell, Dateidialog und Rust-Bridge
- **Svelte 5 + TypeScript** – Benutzeroberfläche
- **World Library** – Studio-eigene Editorial-World-Definitionen
- **HTML/CSS** – statische, responsive A5-Vorschau
- **Rust** – Laden, Migration und Validierung des `.nls`-Projektmanifests
- **Northern Lines Publisher** – eigenständige Engine; CLI-Anbindung folgt später

## Projekt- und World-Grenze

Das Projekt speichert nur:

```json
"editorialWorldId": "fjord"
```

Die eigentliche World-Definition lebt in Studio unter:

```text
src/lib/worlds/fjord/
```

Dadurch bleibt ein `.nls` eine Reise und keine Kopie des Northern-Lines-Designsystems.

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

- `docs/builds/BUILD-004.md`
- `docs/adr/ADR-004-REFERENCE-WORLD-LIBRARY.md`
- `docs/ecr/ECR-003-REFERENCE-WORLD-AND-RESPONSIVE-PREVIEW.md`
- `docs/validation/BUILD-004-VALIDATION.md`
- `docs/git/BUILD-004-GIT-WORKFLOW.md`

## Commit-Vorschlag

```text
feat(studio): introduce the Fjord reference world
```
