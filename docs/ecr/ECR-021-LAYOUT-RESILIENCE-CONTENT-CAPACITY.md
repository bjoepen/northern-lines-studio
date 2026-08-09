# ECR-021 – Layout Resilience & Content Capacity Foundation

## Problem
Build 020 is technically solid, but real-world review exposed three layout weaknesses:

1. „Ein Satz für diesen Ort“ sits too close to the place name.
2. Practical information can intrude into the Fjord companion area.
3. The current page grammar does not yet explicitly account for the 17 mm binding safety or for denser future editorial content.

In addition, the traveller should not have to type the word „Uhr“ repeatedly for arrival/departure clock values.

Real-world validation also exposed a regression: **Unsaved Destination changes were no longer protected when leaving the page.** The established three-way decision must apply to the complete Ortsprofil, including nested lists and the page effect.

## Change

- protect title/subtitle hierarchy with positive spacing;
- define the 17 mm binding safe area for A5 destination previews;
- define and enforce a companion safe area;
- keep footer and page number stable across the three existing page effects;
- reduce unused upper whitespace for **Weite** while keeping the panorama broad, shallow and calm;
- permit 3-column editorial module composition when a third peer module is present;
- introduce internal non-destructive capacity states: `comfortable`, `tight`, `overflow`;
- add Travel-Language time formatting: input `08:00`, display `08:00 Uhr`;
- keep `.nls` at 0.8.0 and do not add or repurpose Domain fields;
- restore full Ortsprofil dirty-state protection with **Verwerfen · Abbrechen · Speichern** before protected navigation;
- make `docs/PRODUCT-DNA.md` a permanent repository reference beside README, VISION and ARCHITECTURE.

## Explicit non-goals

- no new Destination fields;
- no Souvenir editor or country-rule editor yet;
- no new page effect;
- no free grid/layout controls;
- no font shrinking to force fit;
- no Publisher replacement;
- no Asset Management, Crop/Focal Point, drag-and-drop or free positioning;
- no general refactoring.
