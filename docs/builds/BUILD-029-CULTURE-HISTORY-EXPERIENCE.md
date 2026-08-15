# Build 029 — Culture & History Experience

Build 029 turns the existing Culture & History Interest Page from a foundation placeholder into a structured editorial experience.

## Product behavior
- Add a cultural **Ort / Station** rather than editing a shared text bucket.
- Each station owns its own type, meaning, visit hint, optional time reference and optional place/map reference.
- Studio automatically composes entries as one box, two balanced boxes or a grouped stack.
- The active Editorial World is inherited without changing content.
- Companion and Footer remain protected invariants.
- Interest-only compact typography remains adaptive, never the default.

## UX polish carried into 029
- Local entry navigation: **Zurück**.
- Global dirty-state language remains **Verwerfen · Abbrechen · Speichern**.
- Native/default HTML-looking controls are part of the pre-release consistency check.
- Gate status semantics remain PASS green / WARN amber / FAIL red.

## Technical note
The `.nls` format remains 0.14.0. Culture & History uses the existing extensible structured interest-entry field map; no migration is required.
