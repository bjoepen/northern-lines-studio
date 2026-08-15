# ADR-029 — Culture & History Experience

## Status
Accepted · Build 029

## Decision
`culture_history` is the third fully developed Destination Interest archetype. Authoring follows the shared structured-entry model: the traveler adds an **Ort / Station**, then describes that concrete station in a dedicated mask.

A cultural station keeps these semantic fields together:
- name/title,
- type/category,
- editorial meaning / why it matters,
- visit guidance,
- optional time reference,
- optional place/map reference.

Studio owns composition. The user does not select one-box/two-box/stacked layouts. The shared Interest Page grammar evaluates content length, entry count and map references and chooses the calmest fitting composition.

## UX language
The entry flow uses Travel Language. The local editor navigation is **Zurück** rather than the generic HTML/system-language **Abbrechen**. The global unsaved-changes dialog remains **Verwerfen · Abbrechen · Speichern**, because that is an explicit system decision rather than editorial navigation.

## Invariants
- active Editorial World is inherited completely;
- page surface remains neutral white;
- Companion and Footer safe zones are hard boundaries;
- compact typography remains an Interest-Page-only adaptive capacity state;
- no content clipping;
- overflow uses the existing Travel-Language capacity message;
- no museum database, CMS inventory or free-layout controls.

## Format
No `.nls` migration. Build 029 remains on format `0.14.0`; the structured interest-entry field map is already extensible.
