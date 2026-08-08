# Build 014 – Validation

## Gates
```bash
pnpm check
pnpm test
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
git diff --check
```

Erwartung: 0 Fehler, 0 Warnungen.

## Real World Validation
1. Studio ohne Reise starten und eine neue Reise anlegen.
2. `+ Ort hinzufügen` wählen.
3. `Bergen` und `Norwegen` eintragen.
4. `Ort hinzufügen` wählen.
5. Prüfen: Bergen erscheint unter Reiseziele und wird sofort geöffnet.
6. Prüfen: Story enthält die Destination-Komponenten inklusive Geschichte, Fotografie, Northern Lines Wissen und Mitbringsel & Souvenirs.
7. Einleitung schreiben und sichern; Preview prüfen.
8. Studio vollständig beenden und Reise erneut öffnen.
9. Prüfen: Bergen, Journey Stage und Authoring sind weiterhin vorhanden.
