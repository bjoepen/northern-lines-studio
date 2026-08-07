# Build 004 – Reference World Foundation

## Goal
Build 004 gives Studio its first real Editorial World and makes the page in the center respond to the available workspace.

The build deliberately adds understanding rather than controls.

## App version
`0.4.0`

## `.nls` format
`0.3.0`

## Reference World 001 – Fjord
Fjord is now owned by the Studio World Library instead of being copied into every Travelbook.

The world defines:
- identity: `fjord` / `Fjord`;
- status: Reference World 001;
- character: calm, spacious, nordic, photographic, reflective;
- design language: Northern · Calm · Image-led;
- Editorial Companion: Papageientaucher;
- supported grammars: cover, welcome, contents, destination, light, weather, workflow, notes and closing.

Build 004 intentionally ships no second world.

## Project boundary
A `.nls` project now stores only:

```json
"editorialWorldId": "fjord"
```

The world definition belongs to Northern Lines Studio. It is not project content and it is not a Publisher render artifact.

## Responsive A5 preview
The center page now reacts to the size of the available preview stage.

Rules:
- one uniform scale factor for both axes;
- A5 proportions are never distorted;
- quiet padding remains around the sheet;
- large windows make the page larger;
- scaling stops at a deliberate maximum so the sheet does not become visually oppressive;
- compact workspaces remain usable.

The scaling implementation is isolated and unit-tested in `src/lib/preview.ts`.

## Compatibility
- `.nls` 0.2.0 is migrated in memory to 0.3.0 by replacing the embedded Editorial World with its ID.
- `.nls` 0.1.0 remains migratable through the existing Build-003 normalization path and receives Fjord as the historical reference world.
- source project files are never changed automatically.

## UI changes
The UI remains intentionally restrained.

Visible refinements:
- `Editorial Workspace` replaces the more technical preview label;
- Reference World 001 is identified consistently;
- the Inspector shows Companion, Design Language and available grammars;
- the page grows and shrinks with the workspace.

No new toolbar, editor, asset browser or DTP control is added.

## Non-goals
Build 004 does not implement:
- Publisher CLI bridge;
- final page renderer;
- content editing;
- image import or editing;
- Knowledge Library editing;
- Editorial World creation UI;
- a second Editorial World;
- PDF export.

## Success criterion
Studio knows where its first world lives, projects reference it cleanly, and the central page remains the visual focus at every supported window size.
