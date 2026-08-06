# ECR-001 – Neuaufbau von Build 001 mit Tauri

- **Status:** Implemented
- **Build:** 001
- **Datum:** 2026-08-06

## Ausgangslage

Die Repository-Grundlage enthielt noch keine Produktimplementierung. Die zunächst geplante SwiftUI-/AppKit-Architektur hätte eine vollständige Xcode-Installation erfordert.

## Änderung

Build 001 wird mit Tauri 2, Svelte, TypeScript und Rust aufgebaut. ADR-001 wird abgelöst und ADR-002 verbindlich.

## Unverändert

- Produkttrennung zwischen Studio und Publisher
- offenes `.nls`-Projektformat
- fachliches Build-001-Ziel
- Ausschluss eines allgemeinen DTP-Systems

## Validierung

Siehe `docs/validation/BUILD-001-VALIDATION.md`.
