# Build 025C · Validation

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

1. Bestehendes Bergen-Projekt in Fjord öffnen; Referenzwirkung prüfen.
2. Reisewelt auf Ostsee wechseln.
3. Fischotter muss unten links in seiner geschützten Zone sichtbar sein; kein Broken-Image-Platzhalter.
4. Inhalt, IDs, Bildrollen, Extensions und Seitenwirkung bleiben unverändert.
5. Ostsee muss über Titeltypografie, Baltic/Steel-Akzente sowie Fog/Sand/Amber-Flächen klarer von Fjord unterscheidbar sein.
6. Wissen + Fotospot prüfen: shared Signets, world-spezifische Farbe, keine Rahmen/Ornamente.
7. Souvenir prüfen: gezielter Amber-Akzent.
8. Weite, Bild links, Bild rechts prüfen: identische adaptive Grammar und Safe Zones.
9. Zurück zu Fjord wechseln: Fjord-Erscheinungsbild muss unverändert zurückkehren.
10. Projekt speichern, schließen, erneut öffnen: gewählte World persistiert.

**GO**, wenn World-Wechsel semantisch verlustfrei bleibt, der Fischotter korrekt erscheint und Ostsee als eigene Expression erkennbar ist, ohne die gemeinsame Northern-Lines-Sprache zu verlassen.
