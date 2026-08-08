# BUILD 013 – Validation

## Automatische Gates
```bash
pnpm check
pnpm test
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
git diff --check
```

## Real World Validation
- [ ] `pnpm check` meldet 0 Fehler und 0 Warnungen.
- [ ] Empty State zeigt `Neue Reise beginnen`.
- [ ] Journey Beginning öffnet mit Fokus im Reisenamen.
- [ ] Fjord zeigt den Papageientaucher als ersten Companion Encounter.
- [ ] Abbrechen schließt den Dialog ohne Dateisystemänderung.
- [ ] `Reise beginnen` fragt nach dem Aufbewahrungsort.
- [ ] Studio erzeugt `<slug>.nls` mit `project.json` und Starterseiten.
- [ ] Die neue Reise wird unmittelbar geöffnet.
- [ ] Text kann geändert, gesichert und in der Preview gesehen werden.
- [ ] Reise schließen → erneut öffnen → Inhalt bleibt erhalten.
- [ ] Dirty State → Reise beginnen → Save-Dialog schützt ungesicherte Änderungen.
- [ ] Escape bricht den Save-Dialog ab; Enter sichert.

**Status:** pending local validation
