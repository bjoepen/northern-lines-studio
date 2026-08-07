# Build 002 – Editorial Workspace

## Ziel

Build 002 überführt die technische Projektansicht aus Build 001 erstmals in eine Northern-Lines-Arbeitsumgebung. Der Nutzer navigiert nicht mehr durch eine flache Seitenliste, sondern durch die redaktionelle Struktur seines Travelbooks.

Build 002 führt außerdem **Reference Editorial World 001 – Fjord** als erste sichtbare World ein. Die World ist bewusst noch keine Theme-Engine. Sie beschreibt zunächst Identität und Kontext des Beispielprojekts.

## User Experience

Nach dem Öffnen von `examples/Norway-Sample.nls` zeigt Studio:

- Travelbook-Titel und Edition,
- Reference World **Fjord**,
- Editorial Companion **Papageientaucher**,
- semantische Navigationsbereiche `Buch`, `Reiseziele` und bei passenden Seiten `Reisebegleitung`,
- eine ruhige `Editorial Preview`,
- einen kontextbezogenen Inspector,
- einen unaufdringlichen Projektstatus.

## Technische Änderungen

- App-Version `0.2.0`
- `.nls`-Format bleibt `0.1.0`
- neues optionales Projektfeld `editorialWorld`
- Build-001-Projekte ohne `editorialWorld` bleiben gültig
- neue reine Workspace-Modellfunktionen in `src/lib/workspace.ts`
- Rust-Validierung für Reference World und Companion
- UI-Navigation wird aus Seitentypen semantisch gruppiert

## Reference World 001 – Fjord

Das Beispielprojekt enthält:

```json
"editorialWorld": {
  "id": "fjord",
  "name": "Fjord",
  "reference": true,
  "companion": {
    "id": "puffin",
    "name": "Papageientaucher"
  }
}
```

Build 002 unterstützt bewusst noch keine zweite Reference World.

## Nicht-Ziele

Build 002 enthält ausdrücklich nicht:

- Seitenbearbeitung,
- Drag-and-drop,
- freie Layoutobjekte,
- Publisher-CLI-Anbindung,
- PDF-Export,
- Knowledge Library,
- World-Auswahl oder World-Editor,
- dynamisches Rendering des finalen Travelbook-Designs.

## Definition of Done

Build 002 ist abgeschlossen, wenn das Beispielprojekt geöffnet werden kann und der vollständige Workspace-Workflow ohne technische Begriffe wie Render Job oder YAML erlebbar ist.
