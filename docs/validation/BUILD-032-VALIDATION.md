# Build 032 · Validation

## Mandatory Gates

```bash
pnpm consistency
pnpm check
pnpm test
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
git diff --check
```

## Real-World Review

1. Wetter öffnen.
2. Prüfen, dass Seite und Titelgeometrie dem Travel Companion Master `Licht` folgen.
3. Vier kuratierte Wettersituationen vollständig und lesbar prüfen.
4. Companion und Footer müssen frei bleiben.
5. Reisehinweis ergänzen, speichern, schließen, neu öffnen.
6. Fjord ↔ Ostsee wechseln; weiße Seite bleibt erhalten, World Expression ändert sich.
7. Inspector prüfen: `Wetter`, `kuratiert`, `4 vorhanden`, `optional` bleiben in ruhiger UI-Typografie.
8. Native-HTML-/Standard-Control-Check durchführen.
