# Build 025C · White Page Expression Polish · Validation

## Ziel

Die Editorial World darf die Seitenfläche selbst nicht einfärben. Fjord und Ostsee bleiben auf einer neutral-weißen A5-Seite. World Expression entsteht über Typografie, Akzente, Signets, Companion und gezielt eingefärbte Editorial-/Extension-Flächen.

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

1. Bergen in Fjord öffnen: Seitenfläche bleibt neutral weiß.
2. Auf Ostsee wechseln: Seitenfläche bleibt ebenfalls neutral weiß.
3. Ostsee-Expression muss weiterhin über Baltic/Steel/Fog/Sand/Amber, Typografie, Signets und Fischotter erkennbar bleiben.
4. Wissen/Fotospot/Souvenir prüfen: Extension-Flächen dürfen world-konform eingefärbt sein; keine Rahmen oder zusätzliche Dekoration.
5. Weite, Bild links und Bild rechts prüfen: keine Änderung an Grammar, Safe Zones, Companion oder Footer.
6. Zurück zu Fjord wechseln: keine Seitentönung und keine semantischen Änderungen.

**GO**, wenn die Seite in beiden Worlds weiß bleibt und die World-Zugehörigkeit ausschließlich über gezielte Expression-Elemente erkennbar ist.
