# Studio Travel Opening Validation

## Status

```text
ACTIVE REGRESSION CONTRACT
```

This document records the durable regression cases for opening Northern Lines Studio `.nls` travel documents. It replaces historical build-specific validation notes and is intentionally independent of build numbering.

## Required opening paths

1. **Studio geschlossen → `.nls` im Finder doppelklicken** → Studio startet und öffnet die gewählte Reise.
2. **Studio geöffnet → `.nls` im Finder doppelklicken** → die gewählte Reise wird in der laufenden App geöffnet.
3. **Studio geöffnet → Reise innerhalb von Studio öffnen** → **Reise öffnen …** wählt ein `.nls`-Dokument und öffnet es über denselben gemeinsamen Load-Pfad.

## Compatibility regressions

4. **Legacy `.nls` migration path** → ältere unterstützte Projektformate werden durch die vorhandene read/migrate/validate-Kette geöffnet; es gibt keine Sonderlogik im Open-Flow.
5. **Current `.nls` path** → aktuelle Reisen öffnen ohne semantische Datenverluste.
6. Nach dem Öffnen bleiben **Route, Destination Profiles, Layoutvarianten und Hero-Referenzen** erhalten.
7. Beim Wechsel auf eine andere Reise mit ungespeicherten Änderungen bleibt der Schutz **Verwerfen · Abbrechen · Speichern** intakt.

## Invariants

- Der interne Studio-Dialog behandelt `.nls` als Northern-Lines-Reisedokument und nicht als frei zu wählenden Projektordner.
- Finder-Open und Studio-Open münden in denselben gemeinsamen Ladepfad.
- `load_nls_project` bleibt an `read_project` sowie die bestehende Migration/Validierung gekoppelt.
- UTType-/Finder-Registrierung und `.nls`-Dokumentsemantik dürfen durch Änderungen am Open-Flow nicht umgangen werden.

## Automated gate

```bash
node scripts/check-open-travel-consistency.mjs
```

The gate validates the current implementation against this durable regression contract rather than against a historical build-validation document.
