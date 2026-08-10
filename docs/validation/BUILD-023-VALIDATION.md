# Build 023 – Validation

## Technische Gates

```bash
pnpm consistency
pnpm check
pnpm test
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
git diff --check
```

## Real-World-Test – Bergen

1. Build-022-Reise öffnen.
2. Bergen auswählen.
3. **Weite**, **Bild links**, **Bild rechts** nacheinander prüfen.
4. Bei Bild rechts: Text führt; Bild begleitet und konkurriert nicht mit Titel/Intro.
5. Kurze Inhalte prüfen: drei kompakte Gruppen dürfen nebeneinander stehen.
6. Längere Inhalte ergänzen: Grammar muss auf eine ruhigere Zwei-Spalten-Komposition zurückfallen, ohne Schrift zu verkleinern.
7. Companion, Footer, Seitenzahl und 15-mm-Bindungszone bleiben stabil.
8. Inspector an der linken Kante aufziehen: Minimum ca. 320 px, Maximum 440 px.
9. Studio neu starten: lokale Inspectorbreite bleibt erhalten.
10. `.nls` auf einem zweiten Öffnungspfad prüfen: Inspectorbreite darf nicht Bestandteil des Projekts sein.

## Regression

- Finder-Open und interner Open-Flow aus Build 022 bleiben grün.
- Dirty-State-Dialog bleibt **Verwerfen · Abbrechen · Speichern**.
- Destination-Bilder und Bildrollen bleiben vorhanden.
