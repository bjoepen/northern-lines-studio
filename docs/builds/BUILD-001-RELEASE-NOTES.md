# Northern Lines Studio – Build 001 Release Notes

## Änderung

Das Repository wurde von einer reinen Konzeptgrundlage zu einem ausführbaren Tauri-2-Projekt umgebaut.

## Enthalten

- Svelte-/TypeScript-App-Shell
- Tauri-/Rust-Desktop-Layer
- `.nls`-Verzeichnisauswahl
- Manifestvalidierung
- Seitenstruktur
- statische A5-Vorschau
- schreibgeschützter Inspector
- Norwegen-Beispielprojekt
- Rust- und TypeScript-Tests
- ADR, ECR, Engineering Standard, Scope und Validierungscheckliste

## Bewusst nicht enthalten

Keine Layoutbearbeitung, kein Publisher-Aufruf, kein Export, kein Preflight und keine Distribution.

## Validierungsstatus

- JSON-Konfigurationen: geprüft
- Beispielmanifest und referenzierte Inhaltsdateien: geprüft
- Repository-Struktur: geprüft
- vollständiger pnpm-/Tauri-/Rust-Build: lokal unter macOS auszuführen, da die Paketregistrierung und Rust-Toolchain in der Erstellungsumgebung nicht verfügbar waren

## Commit

```text
feat(studio): rebuild Build 001 with Tauri and Svelte
```
