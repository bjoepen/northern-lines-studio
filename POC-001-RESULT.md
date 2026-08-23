# Background Proof PoC 001 – Result

## 1. Ausgangshypothese

Ein separates, nicht sichtbares Studio-WebView kann als temporärer Background-Proof-Host dienen und den bestehenden akzeptierten Studio-PDF-Proof-Pfad ausführen, ohne die aktuell sichtbare Seite des Main Editors zu verändern.

Der PoC prüft nur den Host. Er ersetzt keinen bestehenden Proof-, Document-Proof-, Standard-PDF- oder PDF/A-2b-Pfad.

## 2. Tatsächlich implementierte minimale Änderung

- `src/App.svelte` erzeugt über `WebviewWindow` einen temporären Hidden Host mit derselben Studio-App-URL.
- Der Hidden Host erhält per URL-Parameter nur `projectPath`, `outputDir`, `jobId` und Rückkanal-Label.
- Der Hidden Host lädt den gespeicherten `.nls`-Projektzustand über den bestehenden `load_nls_project`-Pfad.
- Der Hidden Host wählt nacheinander genau drei begrenzte Referenzrollen aus: Destination, Photography Workshop, Notes / Memory.
- Der Hidden Host verwendet die bestehende Readiness, den bestehenden `pdf-proof-rendering`-Modus und `createStudioPdfProof()`.
- Der Main Editor protokolliert `selectedPage` before/during/after und schließt den Hidden Host nach Ergebnis.
- Im Hidden Host werden `open-nls` und `take_pending_open_path` nicht konsumiert.

## 3. Geänderte Dateien

- `src/App.svelte`
- `src/lib/pdf-proof.ts`
- `src/lib/pdf-proof.test.ts`
- `src/styles/pdf-proof.css`
- `POC-001-RESULT.md`

## 4. Verwendete Tauri/WebView-Architektur

Installierte Versionen laut Repository:

- `@tauri-apps/api` 2.11.1
- `@tauri-apps/cli` 2.11.4
- `tauri` 2.11.5
- `tauri-runtime-wry` 2.11.4
- `wry` 0.55.1

Verifizierte API-Eigenschaften:

- Zusätzliche WebViewWindows werden in der installierten JS-API über `new WebviewWindow(label, options)` erzeugt.
- Unsichtbarer Start ist über `visible: false` in `WindowOptions` verfügbar.
- `backgroundThrottling` ist in den installierten Typen vorhanden; `disabled` ist der dokumentierte Policy-Wert und auf macOS 14+ unterstützt.
- Der bestehende Rust-Command `create_studio_pdf_proof(window: tauri::WebviewWindow, ...)` erhält das aufrufende WebviewWindow.
- Der Hidden Host wird nach Abschluss vom Main über `hiddenHost.close()` entfernt.

## 5. Bestehender Renderer unverändert

Der bestehende PDF-Renderer blieb unverändert:

- keine Änderung an `create_studio_pdf_proof`;
- keine Änderung an der nativen macOS WKWebView-PDF-Erzeugung;
- keine Änderung an A5-PageBox-Normalisierung;
- keine Änderung an PDF-Assembly;
- keine Änderung an PDF/A-2b;
- keine Änderung an Golden Build 040 oder Layout Grammar.

## 6. Build-/Test-Ergebnisse

- `pnpm check`: PASS
- `pnpm test`: PASS, 23 Test Files, 117 Tests
- `pnpm build`: PASS
- `cargo test --manifest-path src-tauri/Cargo.toml`: PASS, 58 Rust Tests
- `pnpm consistency`: PASS
- `git diff --check`: PASS

Runtime-Evidenz:

- macOS installed app: NOT RUN
- real PDFs generated: NOT RUN
- physical A5 validated from PoC PDFs: NOT RUN
- visual comparison with accepted visible Proofs: NOT RUN

## 7. Manuelle Testanleitung

Gemäß `docs/poc/background-proof-001/POC-001-ACCEPTANCE.md`:

1. App starten und ein gespeichertes Referenz-`.nls` öffnen, das Destination, Photography Workshop und Notes / Memory enthält.
2. Im Main Window eine eindeutig erkennbare Destination auswählen, z. B. Bergen.
3. Main selected page before notieren.
4. `Background PoC` auslösen und einen Zielordner wählen.
5. Während der PoC läuft prüfen, dass Main Window keine andere Seite zeigt, nicht in Proof Mode wechselt und nicht auf Capture-Größe resized.
6. Main selected page during notieren.
7. Nach Abschluss Main selected page after notieren.
8. Die drei erzeugten PDFs prüfen:
   - Destination
   - Photography Workshop
   - Notes / Memory
9. Für alle drei PDFs prüfen: eine Seite, DIN A5, korrekte Seite, korrekte World Expression, Companion, Footer und keine Main-Window-Veränderung.
10. Visuell gegen die akzeptierten sichtbaren Proofs derselben Seiten vergleichen.

PASS ist nur zulässig, wenn Build Gate, Main-Window-Invariante, alle drei visuellen Proofs und Hidden-Host-Lifecycle bestehen.

## 8. Bekannte Einschränkungen

- Der PoC verwendet ausschließlich gespeicherte Projektzustände.
- Ungespeicherte Bearbeitungen sind ausgeschlossen.
- Es gibt keine automatische Auswahl beliebiger drei Seiten; die Auswahl ist bewusst auf die drei Referenzrollen begrenzt.
- Der bestehende Document Proof, Standard PDF Export und PDF/A-2b Export bleiben unverändert und nutzen weiterhin den akzeptierten Produktionspfad.
- Die installierte macOS-App und reale visuelle Proofs wurden in dieser Agent-Umgebung nicht ausgeführt.

## 9. Abschließende technische Bewertung

INCONCLUSIVE – awaiting real-world visual validation

Automatisierte Build- und Test-Evidenz ist PASS. Der PoC darf erst nach manueller Real-World-Prüfung der drei Background-Proofs und des Main-Window-Invariants als PASS bewertet werden.
