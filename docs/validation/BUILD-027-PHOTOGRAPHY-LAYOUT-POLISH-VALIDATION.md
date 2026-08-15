# Build 027 · Photography Layout Polish · Validation

## Statische Gates

Alle vorhandenen Node-basierten Consistency Gates wurden im Build-Artefakt ausgeführt und melden PASS. Der Photography Gate prüft zusätzlich:

- positionsgleiche Fotospot/Brennweiten-Zuordnung
- sichtbaren Fallback `Brennweite offen`
- keine separate Brennweiten-Sammelbox
- kompakte Photography-Kopflinie
- Inspector-Label `Brennweite je Fotospot`

## macOS Real-World Gate

Auf dem Zielsystem ausführen:

```bash
pnpm check
pnpm test
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
git diff --check
./scripts/install-macos-app.sh
```

### Visueller Test

Bergen → Fotografie:

1. Fotospots zeilenweise: `Bryggen / Vågen`, `Fløyen Aussichtspunkt`, `Ulriken`.
2. Brennweiten zeilenweise: `18–35 mm`, `18–50 mm`, `50–230 mm`.
3. Prüfen, dass jede Brennweite unmittelbar rechts beim passenden Spot erscheint.
4. Eine Brennweite entfernen: nur der betroffene Spot zeigt `Brennweite offen`.
5. Fjord ↔ Ostsee wechseln: Zuordnung bleibt inhaltlich identisch, nur World Expression wechselt.
6. Speichern, schließen, neu öffnen: Persistenz bleibt erhalten.

**GO:** Zuordnung ist eindeutig, Kopfraum deutlich ruhiger/kompakter, alle Gates grün.
