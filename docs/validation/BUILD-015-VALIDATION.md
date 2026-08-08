# Build 015 – Validation

## Gates
```bash
pnpm check
pnpm test
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
git diff --check
```

## Real-World Validation
1. Neue Reise beginnen.
2. Bergen, Geiranger und Ålesund hinzufügen.
3. Ålesund auf `Früher in der Reise` setzen.
4. Prüfen, dass `Deine Route` unmittelbar reagiert.
5. Studio beenden und Reise erneut öffnen.
6. Prüfen, dass die Reihenfolge erhalten bleibt.
7. Ålesund über `Ort bearbeiten` umbenennen.
8. Land/Region ändern und sichern.
9. Prüfen, dass Preview, Navigation und Etappeninformationen aktualisiert bleiben.
10. Während ungesicherter Story-Änderungen eine Routenaktion auslösen und den Dirty-State-Dialog prüfen.
