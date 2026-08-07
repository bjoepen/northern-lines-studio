# Build 005 – Editorial Grammar Foundation

## Goal

Build 005 changes Studio from a workspace that understands the **structure** of a Travelbook into a workspace that begins to understand the **editorial purpose** of each page.

## Versions

- Northern Lines Studio: `0.5.0`
- `.nls` project format: `0.4.0`

## Main additions

### Editorial Grammar Library

The new `src/lib/grammar/` domain contains the nine Fjord reference grammars. Each grammar defines its purpose, required/optional Story components and Editorial Frame contract.

### Editorial Completeness

Studio evaluates required Story components deterministically. The value is not a subjective quality score and does not use AI.

Example for Destination:

- required: Hero, Title, Introduction, History & Background, Photography & Experience, Northern Lines Knowledge;
- optional: Souvenirs, QR reference;
- recurring Editorial Frame: Header, Footer, dynamic page number, Companion.

### Grammar Inspector

The Inspector now shows, without adding editing controls:

- active grammar;
- editorial purpose;
- Story completeness;
- required Story count;
- Editorial Frame;
- missing required or optional available components.

### `.nls` 0.4.0

Each page may declare a `components` list containing present Story components. Grammar definitions themselves remain in Studio and are not copied into the project.

Older projects are migrated in memory. Build 004 (`0.3.0`) projects receive inferred component presence from their existing page semantics.

## Non-goals

Build 005 intentionally does not implement editing, Publisher integration, image import, PDF export, free layers, a second Editorial World or AI evaluation.

## Product principle

> Studio validates editorial intent, not arbitrary boxes.
