# Build 031 — Validation

## Static Gates

- `npm run consistency`
- `node scripts/check-travel-companion-light-consistency.mjs`
- `git diff --check`

## macOS Gates

```bash
pnpm check
pnpm test
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
git diff --check
./scripts/install-macos-app.sh
```

## Real-World Test

1. bestehendes `.nls`-Projekt aus Build 030 öffnen;
2. Seite **Licht** wählen;
3. prüfen, dass der kuratierte Kern ohne manuelles Authoring sichtbar ist;
4. optional unter **Für diese Reise** einen kurzen Hinweis ergänzen und sichern;
5. Reise schließen und erneut öffnen;
6. prüfen, dass nur der Reisehinweis projektspezifisch persistiert, der kuratierte Kern aber unverändert bleibt;
7. Fjord ↔ Ostsee wechseln und vollständige World Expression sowie freie Companion-/Footer-Safe-Zonen kontrollieren.
