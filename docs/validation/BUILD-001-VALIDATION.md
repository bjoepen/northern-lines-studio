# Build 001 – Validierung

## Automatisiert

```bash
pnpm install
pnpm check
pnpm test
cd src-tauri
cargo test
```

## Manuell unter macOS

- [ ] App mit `pnpm tauri dev` gestartet
- [ ] `examples/Norway-Sample.nls` geöffnet
- [ ] Projektname wird angezeigt
- [ ] fünf Seiten werden korrekt sortiert angezeigt
- [ ] jede Seite kann ausgewählt werden
- [ ] A5-Vorschau aktualisiert sich
- [ ] Inspector aktualisiert sich
- [ ] ungültiger Ordner erzeugt eine verständliche Fehlermeldung
- [ ] App bleibt stabil
- [ ] keine Bearbeitungs- oder Publishing-Funktion vorhanden

## Noch ausstehend

Die vollständige Tauri-/Rust-Kompilierung und visuelle Prüfung müssen auf macOS erfolgen. Das bereitgestellte Paket wurde strukturell und im Frontend-Build geprüft, soweit die Ausführungsumgebung dies zulässt.
