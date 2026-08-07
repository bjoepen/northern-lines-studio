# Build 002 – Validation

## Automatisierte Prüfungen

```bash
pnpm check
pnpm test
cd src-tauri && cargo test && cd ..
```

## Manueller Smoke Test

1. `pnpm tauri dev` starten.
2. `examples/Norway-Sample.nls` öffnen.
3. Prüfen, dass `Fjord` als `Reference World` erscheint.
4. Prüfen, dass `Papageientaucher` als Companion erscheint.
5. Prüfen, dass Cover, Willkommen und Inhaltsverzeichnis unter `Buch` gruppiert sind.
6. Prüfen, dass Bergen und Geiranger unter `Reiseziele` gruppiert sind.
7. Zwischen den Seiten wechseln; Preview und Inspector müssen folgen.
8. Statusleiste muss `Projekt gültig` anzeigen.
9. Ein Build-001-Projekt ohne `editorialWorld` muss weiterhin geöffnet werden können.
10. Es dürfen keine Publisher-, YAML- oder Render-Job-Begriffe in der normalen Benutzeroberfläche erscheinen.

## Erwartetes Ergebnis

Der Nutzer erlebt erstmals eine redaktionelle Arbeitsumgebung statt einer technischen Dateiansicht.
