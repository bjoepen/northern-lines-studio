# Build 028 · Validation

## Gates

```bash
pnpm consistency
pnpm check
pnpm test
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
git diff --check
```

## Real-World-Test

1. Eine bestehende Build-027-Reise (`.nls` 0.12.0) öffnen und Migration auf 0.13.0 prüfen.
2. Bei einer Destination **Wandern & Natur** öffnen/anlegen.
3. Mindestens zwei Routen notieren.
4. Je Route Startpunkt, Dauer und Schwierigkeit in derselben Reihenfolge hinterlegen.
5. Prüfen, dass die Preview jede Route direkt mit ihren drei praktischen Angaben zeigt.
6. Aussicht/Naturziele und Streckenhinweise ergänzen.
7. Fjord ↔ Ostsee wechseln: Inhalt bleibt identisch, World Expression wechselt vollständig.
8. Projekt schließen und erneut öffnen: Inhalte bleiben erhalten.
9. Sehr viel Inhalt eintragen: Capacity Protection muss Companion/Footer schützen und den Travel-Language-Hinweis zeigen.
