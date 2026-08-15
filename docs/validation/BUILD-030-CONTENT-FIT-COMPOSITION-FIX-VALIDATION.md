# Validation – Build 030 Content Fit & Composition Fix

## Static gates
`npm run consistency` → PASS

Enthalten:
- `Content Fit & Composition Consistency Gate: PASS`
- `Culinary Density & Safe-Zone Consistency Gate: PASS`
- alle bestehenden Studio Consistency Gates weiterhin PASS.

## TypeScript source check
Der geänderte Layoutkern wurde isoliert mit globalem `tsc` geprüft:

```bash
tsc src/lib/destination-interests/entries.ts src/lib/project.ts --noEmit --target ES2022 --module ESNext --moduleResolution bundler --skipLibCheck
```

Ergebnis: PASS.

Der vollständige Workspace-Check benötigt weiterhin die lokalen npm/pnpm-Abhängigkeiten auf macOS.

## Real-World-Heuristik
Bergen / Kulinarik & Lokal:
1. Skillingsbolle bei Baker Brun
2. Bergener Fischmarkt / Mathallen

Mit den realistischen Testtexten bewertet die neue finite Kandidatensuche alle vier erlaubten Zweierkompositionen und wählt `stacked` + `tight`, ohne `overflow`. Damit wird die vorher fehlerhafte 1/2–1/2-Komposition verworfen, bevor sie Companion/Footer verletzen kann.

## Verbindlicher visueller macOS-Test
- beide Empfehlungen vollständig sichtbar;
- keine Box ragt in Companion-/Footer-Safe-Zonen;
- keine dritte kleinere Typografiestufe;
- keine Sammelbox für beide Empfehlungen;
- 1/2–1/2, 1/3–2/3, 2/3–1/3 und stacked werden als Kandidaten unterstützt;
- bei unlösbarem Inhalt erscheint `overflow` statt Clipping.
