# Build 021 – Validation

## Automated gates

```bash
pnpm consistency
pnpm check
pnpm test
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
git diff --check
```

Expected consistency output includes:

```text
Journey Planning Consistency Gate: PASS
Destination Profile Consistency Gate: PASS
Layout Resilience Consistency Gate: PASS
Binding → Title → Companion → Footer → Capacity → Time Language → Tests
```

## Real-world A5 test – Bergen

Open an existing validated Build-020 journey and select **Bergen**.

Use:

- Ein Satz für diesen Ort: `Tor zu den Fjorden`
- Ankunft: `08:00`
- Abfahrt: `17:00`
- at least two Reasons
- at least two Highlights
- at least one Practical Info entry

### Verify title hierarchy

- `Bergen` remains the primary anchor.
- `Tor zu den Fjorden` has clear positive spacing and never intrudes into the title.

### Verify time language

- Inspector shows the suffix **Uhr** without requiring it to be typed.
- Preview shows `08:00 Uhr` and `17:00 Uhr`.
- Existing input such as `08:00 Uhr` must not render as `08:00 Uhr Uhr`.

### Verify Weite

- panorama is broad, shallow, calm and atmospheric;
- upper page space is used more efficiently than Build 020;
- panorama does not become a dominant content block.

### Verify three-module composition

With Reasons + Highlights + Practical Info present:

- all three may live side by side when the preview composition permits;
- this remains the existing page effect and does not create a fourth layout option;
- no module is silently hidden.

### Verify protected areas

- left binding safety remains at least **17 mm** in the A5 grammar;
- Papageientaucher remains after the binding-safe edge, at the lower-left Footer threshold;
- content does not use the companion's protected space;
- Footer `TRAVEL · PHOTOGRAPHY · Signet · MEMORIES` and page number remain stable.

## Density test

Test three states:

1. sparse Destination (e.g. Geiranger)
2. normal Destination (Bergen)
3. dense stress test with long introduction, multiple Reasons, Highlights and Practical Info

Expected:

- typography does not shrink to force content fit;
- content is not silently discarded;
- Build 021 may internally classify pressure but does not expose technical capacity wording in the Travel UI.

## Regression

- Build 019 Journey Planning still works.
- Build 020 Destination persistence and the three page effects still work.
- Save → close → Finder-open `.nls` preserves all existing data.

## Unsaved Ortsprofil regression test

1. Open **Bergen**.
2. Add or change an entry in **Orte & Motive**.
3. Without saving, select **Stavanger**.
4. Expect the dialog with exactly **Verwerfen · Abbrechen · Speichern**.
5. Choose **Abbrechen**: Bergen remains selected and the draft remains visible.
6. Repeat the page switch and choose **Verwerfen**: navigation continues and the unsaved Destination draft is discarded.
7. Return to Bergen and confirm the discarded edit is not persisted.
8. Change **Für unterwegs** or the **Seitenwirkung**, switch pages again and choose **Speichern**.
9. Return to Bergen and confirm the full Ortsprofil change is persisted.
10. Quit Studio, reopen the `.nls` from Finder and verify persistence once more.

The same protection must also continue to work for the established semantic Story authoring path from Build 011.
