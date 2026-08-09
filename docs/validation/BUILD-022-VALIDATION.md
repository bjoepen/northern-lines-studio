# Build 022 – Validation

## Automated gates

```bash
pnpm consistency
pnpm check
pnpm test
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
git diff --check
```

Expected Consistency output includes:

```text
Journey Planning Consistency Gate: PASS
Destination Profile Consistency Gate: PASS
Layout Resilience Consistency Gate: PASS
Destination Imagery Consistency Gate: PASS
Travel Opening Consistency Gate: PASS
```

## Regression validation – Reisen öffnen

Die folgenden Fälle sind für Build 022 Final verbindlich:

1. **Studio geschlossen → `.nls` im Finder doppelklicken** → Studio startet und die Reise öffnet sich.
2. **Studio geöffnet → `.nls` im Finder doppelklicken** → die ausgewählte Reise wechselt/öffnet sich in der laufenden App.
3. **Studio geöffnet → Reise innerhalb von Studio öffnen** → **Reise öffnen …** wählen, `.nls` auswählen, Reise öffnet sich.
4. **Build-019-Datei** → öffnen → Migration auf das aktuelle Projektformat → Reise öffnet sich.
5. **Build-020-Datei** → öffnen → bestehende Migrations-/Normalisierungskette wird korrekt ausgeführt; keine Open-Flow-Sonderlogik.
6. Nach dem Öffnen sind **Route, Destination Profiles, Layoutvarianten und Hero-Referenzen** korrekt vorhanden.
7. Projekt A mit ungespeicherten Ortsprofil-Änderungen → Reise B über **Reise öffnen …** wählen → erwartete Auswahl **Verwerfen · Abbrechen · Speichern** bleibt intakt.

Wichtig: UTType, Finder-Integration und `.nls`-Registrierung werden für diesen Fix nicht verändert.

## Real-world test – Bergen imagery

Prepare two source images:

- `bergen-weite` – broad panorama; recommended corridor about 3:1–4:1
- `bergen-portrait` – approximately 2:3 portrait

Then:

1. open the validated Build-021 travel;
2. select Bergen;
3. choose **Weite**;
4. use **Bild auswählen …** and import the panorama;
5. open `?` and verify the geometry help;
6. verify that the panorama sits directly on the neutral-white Fjord page without a coloured media-card backdrop;
7. switch to **Bild links** and import the portrait image;
8. switch to **Bild rechts** and verify that the same portrait image is used;
9. cycle Weite → Bild links → Bild rechts → Weite;
10. close Studio;
11. reopen the `.nls` from Finder.

Expected:

- Weite preserves the prepared panorama ratio and no longer uses a fixed-height coloured image box;
- Bild links / Bild rechts share one portrait image role;
- images remain part of the travel after reopening;
- no crop controls, focal point or free positioning appear;
- all three page effects use the same white / neutral-white Fjord surface;
- content modules are not all presented as Cards;
- a selective practical-info accent may remain subtle and editorial;
- the 15 mm binding minimum remains respected by relevant content;
- Companion, footer and page number stay visually stable;
- the Companion has the same horizontal home as established Fjord knowledge pages;
- replacing or removing an image updates only the active semantic image role.

## Compatibility test – pre-final Build 022

If a test project from the pre-final Build 022 contains `left` or `right` imagery:

- Studio may use either as a fallback for the shared portrait role;
- a new portrait import writes the final `portrait` role;
- no image is silently cropped or transformed.

## Migration test

Open a Build-021 `.nls` (0.8.0). Expected:

- automatic normalization to 0.9.0;
- Journey and Destination content unchanged;
- image roles empty until the traveller selects images;
- no invented imagery.
