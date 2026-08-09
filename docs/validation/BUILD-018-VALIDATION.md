# Build 018 – Validation

## Code Gates

```bash
pnpm check
pnpm test
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
git diff --check
```

## Migration
1. Eine bestehende `.nls`-Reise aus Build 017 öffnen.
2. Prüfen: `Reiseplanung` erscheint zwischen Inhaltsverzeichnis und Route.
3. Studio schließen und Reise erneut öffnen.
4. Prüfen: Migration bleibt persistent und die Reise öffnet weiterhin per Finder.

## Companion
1. Cover wählen → kein Companion.
2. Willkommen wählen → kein Companion.
3. Inhaltsverzeichnis wählen → kein Companion.
4. Reiseplanung wählen → Papageientaucher erscheint unten links.
5. Destination, Licht, Wetter, Workflow, Notizen und Abschluss prüfen → Companion bleibt präsent.
6. Footer prüfen → Companion sitzt oberhalb des Travel-Language-Footers und überdeckt ihn nicht.
7. Inspector prüfen:
   - Platz: unten links
   - Pose: Standard
   - Spiegelung: aus

## Regression
- Story Authoring speichern
- Route verändern
- Seitenzahlen prüfen
- Finder-Doppelklick bei geschlossenem und laufendem Studio
