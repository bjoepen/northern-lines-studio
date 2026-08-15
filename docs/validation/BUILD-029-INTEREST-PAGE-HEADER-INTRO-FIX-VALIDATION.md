# Build 029 · Interest Page Header & Intro Fix · Validation

## Statische Gates

- Interest Page Header & Intro Consistency Gate: PASS
- Culture & History Experience Consistency Gate: PASS
- Native UI Consistency Gate: PASS
- vollständige bestehende Consistency-Kette: PASS

## Real-World-Test auf macOS

1. Bergen → Kultur & Geschichte öffnen.
2. Erwartete Kopfstruktur prüfen: `KULTUR & GESCHICHTE` als blauer Anker, `Bergen` als großer Titel, keine zweite Interest-Nennung.
3. Im Inspector unter `Deine Vertiefung` die Einleitung bearbeiten.
4. Eigenen Satz eintragen, `Einleitung sichern` wählen.
5. Erwartung: Vorschau aktualisiert sich sofort; Projekt schließen/öffnen; Satz bleibt erhalten.
6. Fotografie und Wandern & Natur gegenprüfen: `FOTOGRAFIE → Ort` und `WANDERN & NATUR → Ort`.
7. World Switch Fjord ↔ Ostsee prüfen: Inhalt bleibt identisch, Expression wechselt.

## Lokale Toolchain-Gates

```bash
pnpm consistency
pnpm check
pnpm test
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
git diff --check
./scripts/install-macos-app.sh
```
