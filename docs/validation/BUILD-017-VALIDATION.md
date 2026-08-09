# Build 017 – Validation

## Gates

```bash
pnpm check
pnpm test
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
git diff --check
```

## Real-World Validation
1. Fjord-Reise per Finder-Doppelklick öffnen.
2. Cover, Willkommen und eine Ortsseite auswählen.
3. Fjord-Identität in der Preview prüfen.
4. Footer auf allen Seiten prüfen.
5. Seitenzahl prüfen.
6. Bergen-Einleitung ändern und sichern.
7. Prüfen: authorierter Text bleibt in der World-Preview sichtbar.
8. Inspector prüfen:
   - Fjord Layout Language
   - Footer-Anker
   - Weite · Bild links · Bild rechts
9. Studio schließen und `.nls` erneut per Finder öffnen.
10. Build-016-Opening-Workflow muss vollständig intakt bleiben.
