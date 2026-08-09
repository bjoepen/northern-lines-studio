# Build 019 – Validation

## Code Gates

```bash
pnpm consistency
pnpm check
pnpm test
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
git diff --check
```

## Consistency Gate

Prüfen, dass jedes neue Feld vorhanden ist in:

1. `src/lib/project.ts`
2. `src-tauri/src/lib.rs`
3. Migration 0.6.0 → 0.7.0
4. `update_journey_planning`
5. Reiseplanungs-Inspector
6. Reiseplanungs-Preview
7. TypeScript- und Rust-Tests

## Real-World Validation

1. Bestehende Build-018-Reise per Finder öffnen.
2. Migration auf `.nls` 0.7.0 prüfen.
3. Reiseplanung auswählen.
4. Beispielwerte eintragen:
   - 26.07.2026
   - 02.08.2026
   - Kiel
   - Kiel
   - Schiff
   - Kiel → Bergen → Geiranger → Ålesund → Haugesund → Kiel
   - Fotografie · Entdecken · Erinnerungen
5. Prüfen: Dauer = 8 Tage.
6. `Reiseplanung sichern`.
7. Prüfen: Werte erscheinen unmittelbar in der Preview.
8. Studio vollständig beenden.
9. `.nls` per Finder doppelklicken.
10. Prüfen: alle Werte sind persistent.
11. Startdatum nach Enddatum setzen und speichern.
12. Erwartung: verständliche Fehlermeldung; ungültiger Zustand wird nicht gespeichert.

## Regression

- Companion erscheint weiterhin ab Reiseplanung.
- Footer bleibt intakt.
- Orte und Route bleiben unverändert.
- Story Authoring funktioniert.
- Finder-Doppelklick funktioniert bei geschlossener und laufender App.
