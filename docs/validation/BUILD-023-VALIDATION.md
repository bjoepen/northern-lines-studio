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
4. Bei **Weite**: Unterkante des Panoramas und `REISEZIEL` dürfen sich nicht visuell überlagern; der Titelblock folgt dem Bild mit ruhigem Abstand.
5. Bei **Bild links** und **Bild rechts**: keine dekorative obere Linie über `REISEZIEL`.
6. Im Inspector Hero-Bild prüfen:
   - ohne Bild: `Noch kein Bild gewählt` und `+ Bild auswählen`;
   - mit Bild: `Bild ersetzen · Entfernen`;
   - keine gefüllten Buttons, keine Button-Kacheln, keine zusätzliche Card;
   - `Entfernen` bleibt visuell sekundär und wird erst bei Hover deutlicher.
7. Bei Bild rechts: Text führt; Bild begleitet und konkurriert nicht mit Titel/Intro.
8. Kurze Inhalte prüfen: drei kompakte Gruppen dürfen nebeneinander stehen.
9. Längere Inhalte ergänzen: Grammar muss auf eine ruhigere Zwei-Spalten-Komposition zurückfallen, ohne Schrift zu verkleinern.
10. Companion, Footer, Seitenzahl und 15-mm-Bindungszone bleiben stabil.
11. Inspector an der linken Kante aufziehen: Minimum ca. 320 px, Maximum 440 px.
12. Studio neu starten: lokale Inspectorbreite bleibt erhalten.
13. `.nls` auf einem zweiten Öffnungspfad prüfen: Inspectorbreite darf nicht Bestandteil des Projekts sein.

## Regression

- Finder-Open und interner Open-Flow aus Build 022 bleiben grün.
- Dirty-State-Dialog bleibt **Verwerfen · Abbrechen · Speichern**.
- Destination-Bilder und Bildrollen bleiben vorhanden.
