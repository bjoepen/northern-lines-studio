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


## Final Polish Fix – additional validation

1. Open a Destination with **Weite** and a real panorama image. Verify that `REISEZIEL` starts clearly below the visual image area and never overlays the watercolor fade.
2. Switch to **Bild links** and **Bild rechts** and verify no regression in composition.
3. In the Inspector, verify `Bild links / Bild rechts` reads as quiet status text, while `Bild ersetzen · Entfernen` remains the actionable line.
4. Re-run `pnpm consistency`, `pnpm check`, `pnpm test`, `pnpm build`, `cargo test --manifest-path src-tauri/Cargo.toml`, and `git diff --check`.

### Weite title-safe regression
- Verify an active panorama in `Weite` has a visible neutral-paper breathing zone before `REISEZIEL`.
- Verify `REISEZIEL` does not touch or visually overlap the watercolor edge.
- Verify `Bild links` and `Bild rechts` remain unchanged.

## Final Weite Grammar regression test

Real-world trigger: Bergen / **Weite** with the watercolor panorama used during Build 023 review.

Expected visual sequence:

`Panorama → visible white breathing room → REISEZIEL → Bergen`

Validation points:

- `REISEZIEL` must start below the visible watercolor transition.
- The title-safe zone must remain an explicit layout row, not a margin/padding workaround.
- `Bild links` and `Bild rechts` must remain visually unchanged.
- Hero image replace/remove behavior and `.nls` persistence must remain unchanged.

## Final zone-separation real-world test

Use at least three panorama sources, not only the Bergen watercolor reference:

1. the Build-023 Bergen panorama (approx. 2.74:1);
2. a wider panorama around 3.5–4:1;
3. a less-wide source around 2:1–2.4:1.

For each source select **Weite** and verify:

- the image remains entirely inside the Hero Zone;
- no image pixel or visual effect enters the Title Safe Zone or Title Zone;
- the source is not cropped by Studio (`contain` behavior);
- additional neutral space caused by a different aspect ratio remains inside the Hero Zone;
- after the Hero Zone there is a visible protected neutral gap;
- `REISEZIEL` begins only in the Title Zone;
- changing the source image does not move the Title Zone;
- Bild links / Bild rechts remain unchanged.

Expected visual sequence:

`Hero Zone → protected neutral gap → REISEZIEL → Bergen`

## Final Weite Editorial Composition Fix – Real-World-Test

Use Bergen first, then repeat with another destination containing a different
panorama ratio.

1. Select **Weite**.
2. Verify the panorama remains completely inside the Hero Zone.
3. Verify there is no horizontal decorative rule between panorama and Title Zone.
4. Verify `REISEZIEL`, place title and subtitle form the left part of the Title Zone.
5. Verify the introduction sits beside the title block and never enters the Hero Zone.
6. Verify one restrained vertical divider separates title role and introduction role.
7. Verify facts and semantic modules start higher than in the previous stacked composition.
8. Verify the final content remains clearly above the Companion/Footer safe zone.
9. Verify the Companion has not moved and Footer/page number remain invariant.
10. Switch to **Bild links** and **Bild rechts** and verify both compositions are unchanged.
11. Change the Weite source image to a different aspect ratio and verify Title/Content/Companion zones do not move into one another.

Expected editorial sequence:

`Hero Zone → Title Safe Zone → Title + Introduction → Facts → Modules → Companion/Footer Safe Zone`

The build fails the real-world test if vertical capacity is recovered by shrinking
text, moving the Companion, moving the Footer, or allowing content to enter a
foreign semantic zone.
