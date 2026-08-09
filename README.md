# Northern Lines Studio

**Travel Publishing – Build 013**

Northern Lines Studio ist die ruhige visuelle und redaktionelle Arbeitsumgebung für Northern Lines Travel Fieldbooks. Es ist kein allgemeines DTP-Programm.

> Die Seite ist der Mittelpunkt der Arbeitsumgebung. Alles andere dient der Geschichte.

Vor der technischen Dokumentation sollte zuerst [`docs/000-NORTHERN-LINES.md`](docs/000-NORTHERN-LINES.md) gelesen werden.





## Build 013 – Journey Beginning Foundation

Build 013 closes the journey lifecycle at its beginning: Studio can now create a new `.nls` travelbook from the calm Empty State. The first creation world is **Fjord**, and the Papageientaucher appears as the first deliberate **Companion First Encounter**. The known Build-011 accessibility warning is also resolved as part of this build.

The creation flow deliberately asks only for what the traveller needs to understand: the journey name and its Editorial World. Technical project structure is generated in the background.

## Build 011 – Editorial Story Workspace

Build 011 turns semantic Story Authoring into an author-facing editorial workspace. Studio now protects unsaved changes, shows editorial status for Story Components, lets the user **Reise öffnen …** and **Reise schließen**, and uses persisted authored text in the A5 preview.

The build also establishes **Human Language First**: the interface speaks in journeys, stories and Travelbooks while technical project mechanics remain below the surface. The `.nls` format remains `0.5.0`.

## Build 010.1 – Story Authoring Engineering Stabilization

Build 010.1 stabilizes the first semantic authoring workflow without changing the `.nls` format (`0.5.0`). It incorporates the first real-world findings: strict TypeScript test narrowing, a schema-correct Build-009 migration fixture, and reliable runtime preservation of the local project path across load and repeated save operations.

The validated real-world path is: open project → edit Bergen introduction → save → change page → return → quit Studio → reopen → authored content persists.

## Build 009 – Companion Collection Foundation

Build 009 introduces the shared **Companion Collection** as part of the Northern Lines Design Library. Fjord no longer embeds its companion definition; it references the stable ID `fjord-puffin`, which Studio resolves through a central Companion Registry.

Approved concepts for Baltic, Britain, Woodland, Iberian, Canary and Arctic are retained as **planned** assets without exposing those Editorial Worlds in Studio. The squirrel remains an intentionally unassigned candidate. The Canary source is preserved but explicitly marked as requiring real transparency cleanup before production use.

The visible Studio workspace is intentionally unchanged. The `.nls` project format remains `0.4.0`.

## Build 008 – Story Components Foundation

Build 008 introduces the first explicit **Story Components** layer. Studio no longer sees only that a Destination grammar expects `Hero`, `Northern Lines Wissen` or `Fotografie`; it materializes these as semantic expression possibilities with purpose, role and status.

The layer model is now executable domain logic:

```text
Editorial Frame
  Header · Footer · Seitenzahl · Companion

Story
  Hero · Titel · Einleitung · Ortswissen · Fotografie · Knowledge · QR · ...

Annotations
  reserviert für spätere Bearbeitungshilfen
```

Story Components are **not** freely positioned DTP objects and Build 008 adds no authoring controls. The `.nls` project format therefore remains deliberately at `0.4.0`; the new model is derived deterministically from the existing page manifest plus Editorial Grammar.

## Build 007 – Editorial Header Balance

Build 007 follows the **Polish before Power** principle. It does not add an authoring feature; it balances the persistent Studio header so brand, active Travelbook context and project control sit on one calm vertical axis.

The center of the header now names the work first (`Norwegen Fieldbook`) and treats `Editorial World · Fjord` as context. The project control is deliberately quieter and more compact. The `.nls` project format remains `0.4.0`.

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
- **Companion Collection** – stabile Companion-IDs, Registry und Design-Library-Assets
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

Nach dem Start über **Reise öffnen** auswählen:

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

- `docs/builds/BUILD-011.md`
- `docs/adr/ADR-009-HUMAN-LANGUAGE-FIRST.md`
- `docs/ecr/ECR-011-EDITORIAL-STORY-WORKSPACE.md`
- `docs/validation/BUILD-011-VALIDATION.md`
- `docs/git/BUILD-011-GIT-WORKFLOW.md`

- `docs/builds/BUILD-009.md`
- `docs/adr/ADR-007-EDITORIAL-COMPANION-SYSTEM.md`
- `docs/ecr/ECR-008-COMPANION-COLLECTION-FOUNDATION.md`
- `docs/validation/BUILD-009-VALIDATION.md`
- `docs/git/BUILD-009-GIT-WORKFLOW.md`
- `docs/design/COMPANION-GUIDE.md`

- `docs/builds/BUILD-008.md`
- `docs/adr/ADR-006-EDITORIAL-LAYER-MODEL.md`
- `docs/ecr/ECR-007-STORY-COMPONENTS-FOUNDATION.md`
- `docs/validation/BUILD-008-VALIDATION.md`
- `docs/git/BUILD-008-GIT-WORKFLOW.md`
- `docs/builds/BUILD-007.md`
- `docs/builds/BUILD-006.md`
- `docs/ecr/ECR-005-EDITORIAL-WORKSPACE-REFINEMENT.md`
- `docs/validation/BUILD-007-VALIDATION.md`
- `docs/validation/BUILD-006-VALIDATION.md`
- `docs/git/BUILD-007-GIT-WORKFLOW.md`
- `docs/git/BUILD-006-GIT-WORKFLOW.md`
- `docs/engineering/DROP-IN-STANDARD.md`

## Commit-Vorschlag

```text
feat(studio): introduce the editorial story workspace
```


## Current development milestone

**Build 011 – Editorial Story Workspace** makes semantic authoring safe, understandable and immediate while preserving the calm Northern Lines shell.


## Journey Route Foundation

Studio behandelt die Reihenfolge von Orten als **Deine Route**. Der Reisende ordnet seine Reise; technische Seiten- und Dateistrukturen bleiben im Hintergrund.


## Journey Opening Foundation

Ab Build 016 ist `.nls` nicht nur ein Projektformat, sondern ein Reisedokument:
Auf macOS kann eine Reise direkt aus dem Finder geöffnet werden.

> Der Reisende öffnet kein Projekt. Er öffnet seine Reise.


## Editorial World Layout Foundation

Ab Build 017 besitzt die Fjord Reference World eine eigene visuelle Layout Language.
Wiederkehrende Elemente wie der Northern-Lines-Footer gehören zur Editorial World
und nicht zu einzelnen frei platzierten Seitenobjekten.

> Wenige starke Layouts. Viele persönliche Geschichten.
