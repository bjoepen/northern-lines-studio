# Architecture

## Status

This document records an initial architecture hypothesis only.
No implementation decision is final.

## Proposed System Boundary

```text
Northern Lines Studio
        │
        │ structured project data
        ▼
Northern Lines Publisher
        │
        │ validated render job
        ▼
Preview / PDF / Affinity Handoff
```

## Proposed Components

### Studio App

The native macOS application and user-facing workspace.

Potential responsibilities:

- project library
- navigation
- content editing
- image assignment
- layout selection
- preview orchestration
- publishing commands

### Studio Project Format

A versioned, transparent project representation.

Preferred characteristics:

- text-based where practical
- deterministic
- diff-friendly
- migration-capable
- independent of generated output

### Publisher Integration Layer

Connects Studio to Northern Lines Publisher.

Potential integration models:

1. local CLI invocation
2. shared Python service
3. local HTTP or IPC bridge
4. later native library boundary

The initial implementation should prefer the simplest reliable boundary and
avoid premature coupling.

### Preview Renderer

Provides visual feedback inside Studio.

Possible approaches to evaluate:

- HTML/CSS preview
- PDF-based preview
- native Core Graphics rendering
- generated raster previews
- template-driven renderer

Preview fidelity and implementation cost must be assessed before selection.

### Output Layer

Potential outputs:

- validated project data
- render job
- Desktop staging bundle
- PDF
- Affinity handoff
- later native publication package

## Architectural Principles

- Northern Lines Publisher remains the source of truth for publishing rules.
- Studio must not duplicate schema and composition logic.
- Generated files are outputs, not primary project data.
- Every project format change requires migration support.
- Preview rendering and production rendering must not silently diverge.
- Product identity and editorial decisions remain explicit.

## First Architecture Decision Required

Before Build 001, create an ADR comparing:

- native SwiftUI shell with Publisher CLI integration
- embedded web UI
- hybrid desktop architecture

The ADR should include:

- macOS integration
- preview options
- distribution
- maintainability
- testing
- dependency management
- reuse of the existing Python publishing engine
