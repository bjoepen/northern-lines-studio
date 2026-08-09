# Build 021 – Layout Resilience & Content Capacity Foundation

**Studio:** 0.21.0
**`.nls`:** 0.8.0
**Status:** Prepared for validation

## Leitgedanke

> **Der Bindungsraum ist unantastbar. Der Begleiter ist unantastbar – und sein Raum ebenfalls. Die Typografie wird nicht geopfert, nur damit noch eine Box auf die Seite passt.**

Build 021 strengthens the existing Destination page system instead of adding new product features. The page must remain recognisably Northern Lines with sparse, normal and dense content.

## Layout resilience

- **17 mm Binding Safe Area** on the left of A5 Destination pages;
- protected title/subtitle hierarchy;
- protected companion space at the footer threshold;
- stable Travel-Language footer and page number;
- **Weite** uses the upper A5 composition more efficiently while remaining broad and shallow;
- existing `Bild links` and `Bild rechts` remain semantically unchanged.

## Editorial module capacity

The Destination grammar may compose peer modules in one, two or three columns. Build 021 uses three columns when Reasons, Highlights and Practical Info all participate in the preview. This is an internal composition decision, not a fourth page effect and not a user-configurable grid.

The preview also computes an internal capacity state:

- `comfortable`
- `tight`
- `overflow`

The state never shrinks typography, hides content or changes persisted data. It is groundwork for later Publisher Content Fit and validation.

## Time in Travel Language

Arrival and departure inputs display a fixed **Uhr** suffix in the Inspector. The traveller enters only e.g. `08:00`. In the page preview clock-like values render as `08:00 Uhr`. Existing values ending in `Uhr` are normalised when loaded into the editing draft so the suffix is not duplicated.

## Content future-proofing

The proven Fieldbook can later include additional optional groups such as:

- Northern Lines Wissen
- Fotografie & Erleben
- typische Mitbringsel & Souvenirs
- länderspezifische Hinweise / „Gut zu wissen“
- maps, QR destinations and notes

Build 021 deliberately does **not** introduce those Domain fields. It prepares the page grammar so future information can be added without turning the Destination page into a vertical stack of boxes.

## Schema

No schema change. `.nls` remains 0.8.0. No coordinates, safe-area values or capacity states are persisted.

## Consistency

```text
Model → Rust → Migration → Command → Inspector → Preview → Layout Resilience → Tests
```

## Unsaved-change protection

Build 021 Final restores the established three-way protection for semantic Destination edits. Changes to the Ortsprofil – including nested **Orte & Motive**, **Für unterwegs** and the selected **Seitenwirkung** – mark the page as unsaved. Before navigation or another protected journey action, Studio offers exactly:

**Verwerfen · Abbrechen · Speichern**

- **Verwerfen** restores the persisted Ortsprofil before continuing.
- **Abbrechen** keeps the traveller on the current page with the draft intact.
- **Speichern** persists the complete Ortsprofil before continuing.

The protection reuses the established authoring workflow and does not introduce autosave.

## Dauerhafte Produkt-DNA

`docs/PRODUCT-DNA.md` is now a permanent repository reference beside README, VISION and ARCHITECTURE. Build planning, UX review and validation must preserve its principles explicitly.
