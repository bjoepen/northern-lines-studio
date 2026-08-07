# Build 011 – Editorial Story Workspace

## Purpose
Build 011 turns the semantic persistence foundation of Build 010.1 into an author-facing editorial workspace.

The guiding principle is:

> The author works with the journey and its story. Technical project mechanics remain under the surface.

## Delivered

### Story workspace
Each present Story Component can be selected by its editorial name and shows its authoring status. The Inspector remains the quiet place for focused work rather than becoming a generic properties panel.

### Dirty-state protection
Unsaved semantic changes are detected. Page changes, Story Component changes, opening another journey and closing the current journey are protected by a calm three-way choice: **Sichern**, **Verwerfen**, **Abbrechen**.

### Journey lifecycle
The persistent header control now speaks the language of the traveller:

- **Reise öffnen …**
- **Reise schließen**

Closing returns Studio to its established empty state: **Deine Reise beginnt hier.**

### Living preview
The A5 preview uses persisted authored content when available. The preview is still not the Publisher renderer; it is an immediate editorial response that keeps the page at the centre of the workspace.

### Northern Lines Destination standard
The Destination grammar now treats **Mitbringsel & Souvenirs** as a required part of the Northern Lines destination story alongside introduction, history/background, photography/experience and Northern Lines knowledge. QR remains optional.

## Versioning
- Studio: `0.11.0`
- `.nls` project format: `0.5.0` (unchanged)

No schema migration is required.
