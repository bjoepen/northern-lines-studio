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
```

## Real-world test – Bergen

Prepare three image files:

- `bergen-weite.jpg` – approximately 4:1
- `bergen-bild-links.jpg` – approximately 2:3 portrait
- `bergen-bild-rechts.jpg` – approximately 2:3 portrait

Then:

1. open the validated Build-021 travel;
2. select Bergen;
3. choose **Weite**;
4. use **Bild auswählen …** and import the wide image;
5. open `?` and verify the geometry help;
6. switch to **Bild links** and import the portrait image;
7. switch to **Bild rechts** and import its portrait image;
8. cycle Weite → Bild links → Bild rechts;
9. close Studio;
10. reopen the `.nls` from Finder.

Expected:

- each page effect shows its own prepared image role;
- images remain part of the travel after reopening;
- no crop controls or free positioning appear;
- the 15 mm binding minimum remains respected by relevant content;
- Companion, footer and page number stay visually stable;
- the Companion has the same horizontal home as established Fjord knowledge pages;
- replacing or removing an image updates only that image role.

## Migration test

Open a Build-021 `.nls` (0.8.0). Expected:

- automatic normalization to 0.9.0;
- Journey and Destination content unchanged;
- image roles empty until the traveller selects images;
- no invented imagery.
