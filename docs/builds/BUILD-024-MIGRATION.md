# Build 024 – Migration 0.9.0 → 0.10.0

Beim Öffnen eines Build-023-Projekts wird `formatVersion` von `0.9.0` auf `0.10.0` normalisiert.

Für jedes bestehende Destination Profile gilt:

```json
"editorialExtensions": []
```

Es werden keine Wissen-, Tipp-, Fotospot-, Souvenir-, Wichtig- oder Geschichte-Inhalte erfunden. Bestehende Journey-, Destination-, Bild-, Layout- und Companion-Daten bleiben unverändert.

Die Migration wird beim normalen `.nls`-Open-Flow ausgeführt und nutzt denselben Pfad für Finder- und internen Öffnen-Workflow.
