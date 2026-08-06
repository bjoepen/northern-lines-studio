# ADR-002 – Tauri 2, Svelte und Publisher CLI

- **Status:** Accepted
- **Datum:** 2026-08-06
- **Ersetzt:** ADR-001

## Kontext

Northern Lines Studio benötigt eine macOS-Desktopoberfläche für einen kontrollierten Travel-Publishing-Workflow. Build 001 muss lediglich ein `.nls`-Projekt öffnen, Seiten darstellen und eine statische A5-Vorschau zeigen. Eine vollständige Xcode-Installation belastet den Entwicklungsrechner unnötig.

## Entscheidung

- Tauri 2 stellt Desktop-Shell, Rechte, Dateidialog und Rust-Bridge bereit.
- Svelte mit TypeScript bildet Navigation, Canvasbereich und Inspector.
- HTML und CSS erzeugen zunächst die statische A5-Vorschau.
- Rust liest und validiert lokale `.nls`-Projekte.
- Northern Lines Publisher bleibt eigenständig und wird später über eine CLI-/Sidecar-Grenze angebunden.
- Das `.nls`-Format bleibt unabhängig von der UI-Technologie.

## Folgen

### Vorteile

- keine vollständige Xcode-App für normale Entwicklungsbuilds erforderlich
- schlanke WebView-basierte UI ohne gebündeltes Chromium
- gute Eignung für strukturierte Panels und skalierbare Dokumentvorschauen
- klare Trennung zwischen UI, Desktopzugriff und Publishing Engine
- spätere Plattformoptionen bleiben offen

### Akzeptierte Nachteile

- die zentrale UI ist nicht rein AppKit/SwiftUI-nativ
- macOS-spezifische Interaktionsdetails müssen bewusst gestaltet werden
- Accessibility und Tastaturbedienung benötigen eigene Validierung
- für Signierung und App-Store-Distribution können später zusätzliche Apple-Werkzeuge erforderlich werden

## Nicht entschieden

- endgültige Publisher-CLI-Verträge
- editierbarer Canvas
- Produktionsrenderer
- Distribution und Notarisierung
