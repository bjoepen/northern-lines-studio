# Build 027 · Validation

## Gates

```bash
pnpm consistency
pnpm check
pnpm test
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
git diff --check
```

## Real-World-Test

1. Build-026-Reise (`.nls` 0.11.0) öffnen und Migration auf 0.12.0 prüfen.
2. Bestehende Fotografie-Vertiefung öffnen: Inhalt bleibt erhalten, neue Story Components sind verfügbar.
3. Bei Bergen Fotospots erfassen, z. B. je eine Zeile `Bryggen — Morgenlicht` und `Fløyen — Stadtblick`.
4. Licht, Motive, fotografischen Hinweis und Brennweitenorientierung ergänzen.
5. Optionalen Orts-/Kartenbezug ergänzen.
6. Fjord ↔ Ostsee wechseln: Inhalt bleibt identisch, Expression wechselt.
7. Überlangen Inhalt testen: Studio zeigt `Diese Seite kann diesen Inhalt nicht mehr ruhig erzählen.` und hält Companion/Footer frei.
8. Studio schließen und Reise erneut öffnen: alle Fotografie-Inhalte bleiben erhalten.

## PASS

PASS, wenn die Fotografie-Seite als Northern-Lines-Reiseseite funktioniert und nicht wie eine Technikdatenbank wirkt.

## Svelte nullability regression fix

A `svelte-check` failure in the photography content-capacity calculation exposed a TypeScript narrowing boundary inside `Array.reduce()`: `selectedPage` had been checked before the callback, but remained nullable inside the callback.

The calculation now snapshots the photography authoring state before entering `reduce()`. No persistence, `.nls`, grammar, capacity threshold or traveller-visible behavior changes.

Regression expectation:

```text
svelte-check found 0 errors and 0 warnings
```
