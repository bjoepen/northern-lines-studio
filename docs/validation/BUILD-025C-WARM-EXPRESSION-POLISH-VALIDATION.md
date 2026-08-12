# Build 025C · Warm Expression Polish · Validation

## Ziel

Ostsee muss auf einer echten weißen Seite sichtbar wärmer wirken, ohne die gemeinsame Northern-Lines-Grammar zu verändern.

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

1. Bergen in **Fjord** öffnen: freigegebene Darstellung bleibt unverändert.
2. Auf **Ostsee** wechseln: Seitenfläche ist echtes Weiß.
3. Wissen/Geschichte prüfen: warme Backstein-/Sand-Anmutung, rahmenlos.
4. Tipp/Souvenir prüfen: dezente Bernstein-Anmutung, rahmenlos.
5. Fotospot prüfen: etwas kühler, aber weiterhin in der Ostsee Expression.
6. Praktische Infos prüfen: warme Sandtönung statt Seitenfärbung.
7. Fischotter, Safe Zones und Footer prüfen: unverändert.
8. Fjord ↔ Ostsee zurückwechseln: keine Inhalts- oder Layoutänderung.

**GO**, wenn die World klar über Content-Flächen und Akzente spricht, während die Seite selbst weiß bleibt.
