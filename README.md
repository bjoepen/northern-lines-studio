# Northern Lines Studio

**Travel Publishing for macOS**

Northern Lines Studio is the planned visual macOS workspace for creating,
previewing and publishing Northern Lines Travel Fieldbooks.

The repository currently contains the project foundation only. No product
implementation has started yet.

## Purpose

Northern Lines Studio will provide the visual application layer around the
existing Northern Lines publishing system.

The intended separation is:

- **Northern Lines Publisher** — publishing engine, schemas, validation,
  composition, rendering contracts and output preparation
- **Northern Lines Studio** — macOS application, project workspace, visual
  editing, previews and publishing workflow

## Current Status

**Status:** Vision and repository foundation  
**Implementation:** Not started  
**First planned milestone:** Product discovery and architecture decision

## Initial Repository Structure

```text
northern-lines-studio/
├── README.md
├── .gitignore
└── docs/
    ├── VISION.md
    ├── SCOPE.md
    └── ARCHITECTURE.md
```

## Product Principles

Northern Lines Studio should:

- support travel publishing rather than imitate a general-purpose DTP suite
- preserve Northern Lines design language and editorial quality
- combine structured content with curated page templates
- keep final editorial control with the user
- reuse the Northern Lines Publisher instead of duplicating its engine
- produce transparent, reproducible and versioned project output

## Not Yet Decided

The following remain open for a future discovery phase:

- native SwiftUI versus another macOS UI technology
- integration boundary with Northern Lines Publisher
- live preview renderer
- template authoring model
- direct PDF output versus Affinity handoff
- project file format
- release and distribution model

## Suggested First Commit

```text
chore: initialize Northern Lines Studio project foundation
```
