# Repository Documentation Cleanup

This cleanup branch separates current repository authority from historical development artifacts.

## Keep in active main

- `README.md`
- `AGENTS.md`
- `docs/000-NORTHERN-LINES.md`
- `docs/VISION.md`
- `docs/PRODUCT-DNA.md`
- `docs/ARCHITECTURE.md`
- `docs/SCOPE.md`
- `docs/project-format.md`
- `docs/adr/`
- `docs/design/`
- `docs/editorial-worlds/`
- `docs/engineering/ENGINEERING-STANDARD.md`
- `docs/engineering/DROP-IN-STANDARD.md`
- `docs/validation/STUDIO-PDFA-2B-INTEGRATION-VALIDATION.md`
- `docs/validation/STUDIO-TRAVEL-OPENING-VALIDATION.md`

## Round 1 — historical build/process artifacts

Removed from active main view:

- build-by-build release/build notes
- per-build Git workflow notes
- root build checksum manifests
- obsolete drop-in transport manifests
- completed build-specific research notes
- failed background-rendering PoC working files, replaced by one postmortem

## Round 2 — superseded platform and evidence layers

Removed from active main view:

- historical `BUILD-*-VALIDATION.md` reports
- superseded PDF/Document/PDF-A PoC validation reports; the accepted PDF/A-2b integration validation remains
- `docs/ecr/` implementation-history records; durable decisions remain in Product DNA, Architecture and ADRs
- obsolete Swift Package / SwiftUI implementation tree (`Package.swift`, `Sources/`, `Tests/`) superseded by Tauri v2
- `INITIALIZATION.md` from Build 001; current setup commands are maintained in README
- `STUDIO-UNDERSTANDING.md`; it was an audit snapshot of an old PoC branch and referenced now-removed historical documentation

During Round 2 an active consistency gate was found to depend on historical `BUILD-022-VALIDATION.md`. The durable travel-opening regression contract was therefore extracted into `docs/validation/STUDIO-TRAVEL-OPENING-VALIDATION.md` and the gate was updated to use that build-independent authority.

## Round 3 — final hygiene

- removed the duplicate historical `docs/adr/ADR-001-swiftui-appkit-publisher-cli.md`
- retained `docs/adr/ADR-001-SWIFTUI-APPKIT.md` as the single ADR-001 record because it explicitly marks the former SwiftUI/AppKit decision as superseded by ADR-002
- no broad renaming of Build- or PoC-named consistency scripts was performed: despite historical names, these scripts still enforce current source invariants and renaming them would create churn without improving runtime or product authority

Git history remains the audit trail for all removed historical material.

## Rule going forward

`main` contains the current contract, current validation authority and durable architectural decisions. Build chronology, superseded implementation evidence and development history belong in Git history and the project Chronicle/BookStack layer rather than in the active repository surface.
