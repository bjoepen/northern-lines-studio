# Build 003 – Journey Project Model

## Goal

Build 003 changes Studio from a workspace that can **show** a Travelbook into a workspace that can begin to **understand** it.

The visible UI remains deliberately calm. Progress is expressed by semantic project data rather than additional controls.

## App version

`0.3.0`

## `.nls` format

`0.2.0`

## Domain model

Build 003 introduces:

- Journey
- Journey Stage
- Page Role
- journey-stage references
- knowledge-type references
- normalized project migration

## Author-facing navigation

Pages are grouped from their role:

- **Buch** – front matter
- **Reiseziele** – destinations and stages
- **Reisebegleitung** – knowledge used on the journey
- **Fotografie** – reusable photo workflows
- **Erinnerungen** – notes and closing pages

The grouping is no longer derived from the technical page type.

## Reference World

Reference World 001 remains **Fjord** with the Papageientaucher as Editorial Companion. Build 003 does not introduce another World and does not implement a World editor.

## Sample project

`examples/Norway-Sample.nls` now models:

- the journey `Norwegen 2026`
- cruise as the journey type
- Bergen and Geiranger as stages
- front matter
- destination pages
- Light and Weather as journey knowledge
- ON1 Photo RAW and Luminar Neo as photography workflows
- notes
- a closing memory page

The additional sample pages contain placeholder content only. Their purpose is to validate the domain model and navigation.

## Compatibility

`0.1.0` projects are normalized in memory to `0.2.0`. The original project files are never changed automatically.

## Explicit non-goals

Build 003 does not contain:

- Publisher CLI integration
- final page rendering
- content editing
- Knowledge Library editing
- Editorial World creation
- drag-and-drop layout
- PDF export
- image editing
- additional toolbars

## Success criterion

The Build-002 workspace should look almost unchanged, but Studio must now know *why* a page belongs to a section and which journey stage it represents.
