# ECR-026 · Destination Interest Pages Foundation

## Anlass
A single A5 Destination page should not carry every possible travel interest. Northern Lines Studio must support photography, nature, culture or local food without forcing all travellers into a photography-first model or overloading the main place page.

## Änderung

1. Add `destination_interest` as a semantic page type.
2. Add four curated interest kinds: Fotografie, Wandern & Natur, Kultur & Geschichte, Kulinarik & Lokal.
3. Bind every interest page to an existing Journey Stage.
4. Add Travel-Language selection to the Destination Inspector: **“Was möchtest du in [Ort] erleben?”**
5. Allow several different interest pages for one Destination.
6. Place interest pages directly after their Destination in **Deine Route**.
7. Provide a shared foundation preview and shared title/introduction authoring.
8. Add explicit remove action for an interest page.
9. Update `.nls` to 0.11.0 with migration from 0.10.0.
10. Document Build 025C as a milestone.

## Nicht Bestandteil

- no photography map/light modules yet
- no hiking route model yet
- no museum/place database
- no culinary database
- no free layout controls
- no per-interest World/theme selector
