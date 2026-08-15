# Build 030 · Capacity Protection Regression Fix – Validation

## Anlass
Die neue Content-Fit-/Composition-Logik konnte bei zwei längeren kulinarischen Empfehlungen eine formal gültige Komposition auswählen, obwohl der gerenderte Inhalt in Companion-/Footer-Safe-Zonen lief. Damit wurde eine bereits etablierte Capacity-Protection-Regel regressiert.

## Fix
- vorhandene Kompositionssuche bleibt erhalten: 1/2–1/2, 1/3–2/3, 2/3–1/3, gestapelt
- geschütztes Höhenbudget konservativer auf die tatsächliche Content-Zone begrenzt
- `tight` bleibt eine einzige feste Entlastungsstufe
- wenn keine Kandidatenkomposition innerhalb des Budgets passt: `overflow`
- Travel-Language-Warnung bleibt autoritativ
- Companion und Footer werden nicht als nutzbare Content-Fläche betrachtet

## Regressionstest
Bergen / Kulinarik & Lokal mit:
1. Skillingsbolle bei Baker Brun
2. Bergener Fischmarkt / Mathallen

Erwartung: Die Engine prüft alle freigegebenen Varianten und meldet anschließend `overflow`, statt Inhalte in die Safe-Zonen zu rendern.

## Gates
- Content Fit & Composition Consistency Gate: PASS
- Capacity Protection Regression Gate: PASS
- vollständige statische Consistency-Kette: PASS

Die macOS-Gates `pnpm check`, `pnpm test`, `pnpm build` und `cargo test` bleiben Bestandteil der lokalen Freigabe.
