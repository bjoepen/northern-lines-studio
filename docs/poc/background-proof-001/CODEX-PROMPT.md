# Auftrag: Northern Lines Studio – Background Proof PoC 001

Arbeite im aktuellen Repository von Northern Lines Studio.

Dies ist ein eng begrenzter Machbarkeitsnachweis.

Lies vor jeder Änderung vollständig:

- AGENTS.md
- POC-001-BRIEF.md
- POC-001-CONTRACT.md
- POC-001-ACCEPTANCE.md

Zusätzlich müssen die bestehenden PDF-Architekturentscheidungen und die aktuelle Implementierung untersucht werden, insbesondere:

- ADR-039
- ADR-040
- ADR-041
- src/App.svelte
- src/styles/pdf-proof.css
- src/lib/pdf-proof.ts
- src-tauri/src/lib.rs
- src-tauri/src/platform_pdf.rs bzw. aktuelle äquivalente Implementierung
- src-tauri/tauri.conf.json
- src-tauri/Cargo.toml

Die Dokumente im Repository sind Authority.

## Auftrag

Implementiere ausschließlich:

Background Proof PoC 001

Ziel ist der Nachweis, dass der bestehende akzeptierte Studio-PDF-Proof-Pfad aus einem separaten, nicht sichtbaren Studio-WebView heraus ausgeführt werden kann, ohne die aktuell sichtbare Seite des Hauptfensters zu verändern.

Es wird kein neuer Renderer gebaut.

## Vor der Implementierung

Untersuche zuerst den aktuellen Code und bestätige anhand der tatsächlich installierten Tauri-/Wry-/WebKit-Versionen:

1. wie ein zusätzliches WebviewWindow korrekt erzeugt wird;
2. wie es unsichtbar gestartet werden kann;
3. welche Background-Throttling-Eigenschaften in der verwendeten Version tatsächlich verfügbar sind;
4. dass ein aus diesem WebView aufgerufener Tauri-Command das aufrufende WebviewWindow erhält;
5. wie der Hidden Host nach Abschluss zuverlässig entfernt wird.

Keine API anhand von Erinnerung oder Vermutung implementieren.

## Implementierungsgrenze

Der PoC darf nur so viel Code hinzufügen oder minimal anpassen, wie für den Nachweis erforderlich ist.

Er darf insbesondere NICHT:

- bestehenden Document Proof ersetzen;
- bestehenden Standard-PDF-Export ersetzen;
- PDF/A-2b verändern;
- Golden Build 040 verändern;
- Layout Grammar verändern;
- `.nls`-Schema verändern;
- neuen Snapshot-Contract einführen;
- Publisher integrieren;
- zweiten Renderer einführen;
- Chromium/Playwright/Puppeteer einführen;
- A5-Normalisierung verändern;
- PDF-Assembly verändern;
- Renderer-Geometrie verändern;
- vorhandene Seiten neu komponieren;
- Produktionscode großflächig refaktorieren.

Keine vorbereitenden Refactorings für mögliche spätere Phasen.

YAGNI gilt strikt.

## Hidden Host

Implementiere einen eindeutig isolierten Background-Proof-Host.

Er muss:

- dieselbe Studio-App verwenden;
- unsichtbar sein;
- einen gespeicherten `.nls`-Projektzustand laden;
- eine vorhandene Seite auswählen können;
- die bestehende Readiness verwenden;
- den bestehenden `pdf-proof-rendering`-Modus verwenden;
- den bestehenden `create_studio_pdf_proof`-Pfad verwenden.

Der sichtbare Main Editor darf dafür nicht seine Seite wechseln.

## Lifecycle-Isolation

Der Background-Proof-Host darf keine normalen Editor-Lifecycle-Aktionen übernehmen, die nur zum Hauptfenster gehören.

Prüfe insbesondere:

- `open-nls`
- `take_pending_open_path`

und verhindere, dass der Hidden Host solche globalen Editor-Aktionen konsumiert.

Ändere dabei das Verhalten des normalen Main Editors nicht.

## PoC-Testumfang

Der PoC muss genau die Möglichkeit bereitstellen, drei vorhandene Referenzseiten nacheinander als einzelne PDFs über den Hidden Host zu prüfen:

1. Destination
2. Photography Workshop
3. Notes / Memory

Keine automatische Erkennung beliebiger drei Seiten erfinden, wenn dafür zusätzliche Architektur nötig wäre.

Eine einfache, klar begrenzte PoC-Auswahl ist ausreichend.

## Main-Window-Invariante

Der zentrale technische Test lautet:

Main selectedPage before
==
Main selectedPage during
==
Main selectedPage after

Das Main Window darf während der Proof-Erzeugung:

- keine anderen Studio-Seiten anzeigen;
- nicht in `pdf-proof-rendering` wechseln;
- nicht auf A5-Capture-Größe wechseln.

## Tests

Ergänze nur Tests, die für den neuen PoC-Code sinnvoll und stabil ausführbar sind.

Bestehende Tests dürfen nicht abgeschwächt oder gelöscht werden.

Führe mindestens aus:

pnpm check
pnpm test
pnpm build
cargo test

Dokumentiere die Ergebnisse.

## Keine Scope-Reparatur

Wenn der PoC nur durch eine der folgenden Maßnahmen funktionieren würde:

- neuer Renderer
- zweites Layoutsystem
- größere PDF-Architekturänderung
- `.nls`-Schemaänderung
- Golden-040-Änderung
- Document-Proof-Umbau

STOP.

Implementiere diese Änderung nicht.

Dokumentiere stattdessen:

POC BLOCKED

mit technischer Ursache.

## Abschlussbericht

Erstelle nach der Implementierung:

POC-001-RESULT.md

mit:

1. Ausgangshypothese
2. tatsächlich implementierter minimaler Änderung
3. geänderten Dateien
4. verwendeter Tauri/WebView-Architektur
5. Bestätigung, dass der bestehende Renderer unverändert blieb
6. Build-/Test-Ergebnissen
7. manueller Testanleitung gemäß POC-001-ACCEPTANCE.md
8. bekannten Einschränkungen
9. abschließender technischer Bewertung:

PASS
FAIL
oder
INCONCLUSIVE

Ein automatischer PASS ist nicht zulässig, wenn die drei visuellen Real-World-Proofs noch nicht durch den Nutzer geprüft wurden.

In diesem Fall muss der Status lauten:

INCONCLUSIVE – awaiting real-world visual validation

## Wichtige Schlussregel

Dieser Auftrag endet mit dem funktionierenden PoC und dessen Dokumentation.

Nicht anschließend:

- vollständigen Travelbook Background Export implementieren;
- Production UI umbauen;
- PDF/A integrieren;
- Architekturentscheidung vorwegnehmen;
- weitere Features ergänzen.

Nach dem PoC ist STOP.
