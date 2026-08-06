# ADR-001: SwiftUI shell, AppKit canvas and Publisher CLI

- **Status:** Accepted
- **Date:** 2026-08-06
- **Applies from:** Build 001

## Context

Northern Lines Studio needs a native macOS shell and, over time, precise desktop canvas interaction. Publishing rules already belong to Northern Lines Publisher and must not be duplicated in the app.

## Decision

1. SwiftUI provides the app lifecycle, navigation, toolbar, inspector and project state presentation.
2. AppKit provides the page canvas and later precise mouse, zoom, selection and drag-and-drop behaviour.
3. Northern Lines Publisher remains a separate engine.
4. Studio will initially invoke Publisher through a versioned CLI contract.
5. Build 001 establishes this boundary but does not execute Publisher.

## Consequences

- Studio remains a native macOS application.
- Canvas work can use mature AppKit interaction primitives.
- Publisher stays independently testable and usable in headless workflows.
- Studio must treat Publisher results as authoritative for validation, content fit, rendering and preflight.
- Build 001 contains no duplicate publishing logic.
