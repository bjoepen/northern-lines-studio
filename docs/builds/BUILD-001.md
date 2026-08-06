# Build 001 – Projektleser und statische A5-Vorschau

## Ziel

Der Build beweist den kleinsten vollständigen Studio-Ablauf: Projekt auswählen, Manifest laden, Seitenstruktur anzeigen und eine statische Vorschau darstellen.

## Abnahmekriterien

- `pnpm tauri dev` startet die Anwendung.
- Das Beispielverzeichnis `examples/Norway-Sample.nls` kann ausgewählt werden.
- Fünf Seiten erscheinen in Manifestreihenfolge.
- Die Auswahl einer Seite aktualisiert Vorschau und Inspector.
- Ein Verzeichnis ohne `.nls`-Endung wird abgewiesen.
- Eine falsche Projektformat-Version wird abgewiesen.
- Ungültige Projekte führen nicht zum App-Absturz.
- Keine ausgeschlossene DTP-Funktion ist vorhanden.

## Version

- App: `0.1.0`
- `.nls`-Format: `0.1.0`
