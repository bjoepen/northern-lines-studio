# Build 027 · Release Notes

- erster fachlich ausgebauter Destination-Interest-Archetyp: Fotografie
- Fotospots, Licht, Motive, Hinweise, Brennweiten & Praxis, Orts-/Kartenbezug
- World Expression für Fjord und Ostsee
- Capacity Protection auf der Fotografie-Vertiefung
- `.nls` 0.12.0, Migration aus Build 026 / 0.11.0
- neuer `Photography & Place Experience Consistency Gate`

### Polish fix: null-safe photography capacity calculation

The photography page capacity calculation now uses a null-safe authoring snapshot before reducing component content lengths. This closes the `selectedPage is possibly null` Svelte/TypeScript diagnostic without changing user-visible behavior or the `.nls` format.
