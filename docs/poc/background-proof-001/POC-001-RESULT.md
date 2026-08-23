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
- `src-tauri/src/lib.rs`
- `src-tauri/capabilities/default.json`
- `src-tauri/capabilities/background-proof.json`
- `scripts/check-background-proof-poc-001-capabilities.mjs`
- `scripts/check-studio-document-proof-poc-001-consistency.mjs`
- `docs/poc/background-proof-001/POC-001-ACL-EVENT-AUDIT.md`
- `docs/poc/background-proof-001/POC-001-RESULT.md`

## 4. Verwendete Tauri/WebView-Architektur

Installierte Versionen laut Repository:

- `@tauri-apps/api` 2.11.1
- `@tauri-apps/cli` 2.11.4
- `tauri` 2.11.5
- `tauri-runtime-wry` 2.11.4
- `wry` 0.55.1

Verifizierte API-Eigenschaften:

- Zusätzliche WebViewWindows werden in der installierten JS-API über `new WebviewWindow(label, options)` erzeugt.
- Die JS-API ruft `plugin:webview|create_webview_window` auf und liefert nur die lokalen Objekt-Events `tauri://created` und `tauri://error`.
- Die `url`-Option akzeptiert Remote-URLs oder lokale Routen/Dateien; lokale Routen werden im Produktionsbundle an die App-URL (`tauri://localhost/` bzw. plattformabhängige App-URL) angehängt. Für dieselbe gebündelte App wird die aktuelle App-URL ohne stale Query/Hash wiederverwendet und mit PoC-Query-Parametern neu aufgebaut.
- Query-Parameter werden über die `url`-Option transportiert und im Hidden Host über `window.location.search` vor dem Svelte-`onMount` geparst.
- Unsichtbarer Start ist über `visible: false` in `WindowOptions` verfügbar.
- `backgroundThrottling` ist in den installierten Typen vorhanden; der verwendete Wert ist `disabled`. In `tauri-utils` wird dies als `BackgroundThrottlingPolicy::Disabled` serialisiert, `tauri-runtime-wry` mappt es auf `wry::BackgroundThrottlingPolicy::Disabled`, und Wry setzt auf macOS 14+ `WKInactiveSchedulingPolicy::None`.
- Die installierte JS-API bietet kein eigenes `HOST_LOAD_FINISHED`/Navigation-Failed-Event für `WebviewWindow`. Load-Erfolg wird deshalb durch einen Bootstrap-Handshake der geladenen App sichtbar; `tauri://error` bleibt der Create-/Load-Fehlerpfad des Konstruktor-Aufrufs.
- Der bestehende Rust-Command `create_studio_pdf_proof(window: tauri::WebviewWindow, ...)` erhält das aufrufende WebviewWindow.
- Der Hidden Host wird nach Abschluss vom Main über `hiddenHost.close()` entfernt.
- Der native WKWebView-PDF-Call wird im Trace über PoC-spezifische Events direkt vor/nach den bestehenden Aufrufen sichtbar gemacht; die Rendererfunktionen selbst bleiben funktional unverändert.

## 4.1 ACL-/Capability-Fix

Runtime-Blocker in der installierten macOS-App:

```text
Error: Command plugin:webview|create_webview_window not allowed by ACL
```

Bestätigte Ursache:

- Der Hidden Host wird vom Main Window über `new WebviewWindow(...)` erzeugt.
- Dieser JS-API-Aufruf verwendet `plugin:webview|create_webview_window`.
- `src-tauri/capabilities/default.json` war auf `main` beschränkt und enthielt keine `core:webview:allow-create-webview-window` Permission.

Minimaler Fix für `main`:

- `core:webview:allow-create-webview-window`
- `core:window:allow-close`

`core:window:allow-close` ist erforderlich, weil der bereits implementierte PoC den temporären Hidden Host nach Abschluss über `hiddenHost.close()` entfernt. Es wurde keine allgemeine `core:window:default`- oder `core:window:allow-create`-Permission ergänzt.

Tatsächlicher Hidden-Host-Label:

```text
background-proof-poc-001-${jobId}
```

Separate Hidden-Host-Capability:

```text
src-tauri/capabilities/background-proof.json
windows: ["background-proof-poc-001-*"]
permissions: ["core:event:allow-emit-to"]
```

Der Hidden Host erhält keine Dialogrechte und keine allgemeinen Window-/WebView-Rechte. Eigene App-Commands wie `load_nls_project` und `create_studio_pdf_proof` verwenden in diesem Repository kein separates App-ACL-Manifest; die benötigte zusätzliche Plugin/Core-Permission im Hidden Host ist daher nur `core:event:allow-emit-to` für Progress-/Result-Rückmeldung an `main`.

## 4.2 Runtime-Hang-Untersuchung und Fix

Beobachteter Runtime-Hänger nach dem ACL-Fix:

```text
Main selectedPage before: page-bergen
Background PoC …
```

Letzter im bisherigen Build sicher erreichter Code-Zustand:

```text
HOST_CREATED
→ Main wartet auf resultPromise
```

Root Cause:

- Main registrierte den Result-Listener in einem `async` Promise-Executor. Ein Listener-Registrierungsfehler konnte dadurch selbst einen dauerhaft pending Promise erzeugen.
- Nach erfolgreicher Hidden-Host-Erzeugung gab es keinen terminalen Gegenpfad, wenn der Hidden Host kein Result-Event emitten konnte oder vor dem Result in einem Lifecycle-Schritt hängen blieb.
- Der bisherige UI-Status enthielt keinen Host-Lifecycle-Zustand. Daher war der konkrete Hidden-Host-Schritt im installierten Hänger nicht sichtbar.

Minimaler Fix:

- Result-, Lifecycle- und Progress-Listener werden vor `new WebviewWindow(...)` explizit awaited registriert. Listener-Fehler laufen nun in den normalen Error-Pfad.
- Der PoC verwendet job-scoped Eventnamen für `lifecycle`, `progress` und `result`.
- Main und Hidden Host protokollieren strukturierte Lifecycle-Zustände:

```text
HOST_CREATE_REQUEST
HOST_CREATED
HOST_LOAD_STARTED
HOST_DOM_READY
PROJECT_LOAD_START
PROJECT_LOADED
HOST_READY
REFERENCE_PAGE_SELECT_START
REFERENCE_PAGE_SELECTED
REFERENCE_PAGE_READINESS_START
REFERENCE_PAGE_READY
PROOF_MODE_ENTER
PROOF_START
PROOF_COMPLETE
PROOF_MODE_EXIT
NEXT_REFERENCE_PAGE
HOST_RESULT_EMIT
MAIN_RESULT_RECEIVED
HOST_CLOSE
COMPLETE
```

- Ein enger PoC-Watchdog macht nur einen verlorenen Lifecycle terminal:

```text
BACKGROUND_PROOF_POC_001_LIFECYCLE_TIMEOUT
```

Der Watchdog ersetzt keine Readiness-Regel, erhöht keinen bestehenden PDF-Renderer-Timeout und verändert den Proof-Pfad nicht. Er meldet den letzten bekannten Lifecycle-Zustand, damit der nächste installierte Runtime-Lauf eindeutig zeigt, ob der Hidden Host z. B. bei `HOST_LOAD_STARTED`, `HOST_DOM_READY`, `PROJECT_LOAD_START`, `REFERENCE_PAGE_READINESS_START` oder `PROOF_START` hängen bleibt.

Event-/Handshake-Pfad nach Fix:

- Sender Main → Empfänger Hidden Host: `new WebviewWindow("background-proof-poc-001-${jobId}", ...)`.
- Sender Hidden Host → Empfänger Main: `emitTo(returnTo, background-proof-poc-001-lifecycle-${jobId})`.
- Sender Hidden Host → Empfänger Main: `emitTo(returnTo, background-proof-poc-001-progress-${jobId})`.
- Sender Hidden Host → Empfänger Main: `emitTo(returnTo, background-proof-poc-001-result-${jobId})`.
- Listener werden vor `HOST_CREATE_REQUEST` und vor Hidden-Host-Erzeugung registriert.
- Hidden Host hat für diese Rückkanäle weiterhin ausschließlich `core:event:allow-emit-to`.
- Main hat keine zusätzlichen ACL-Rechte für diesen Runtime-Hang-Fix erhalten.

## 4.3 Main Event-Listen-ACL-Fix

Runtime-Blocker in der installierten macOS-App nach den Trace-Ergänzungen:

```text
Error: Command plugin:event|listen not allowed by ACL
```

Bestätigte Ursache:

- Main registriert die job-scoped `lifecycle`-, `progress`- und `result`-Listener über `listen(...)` aus `@tauri-apps/api/event`.
- Dieser Aufruf verwendet `plugin:event|listen`.
- Die Main-Capability enthielt bisher keine explizite `core:event:allow-listen` Permission.

Minimaler Fix für `main`:

```text
core:event:allow-listen
```

Es wurden keine weiteren Event-Rechte ergänzt. Insbesondere nicht:

```text
core:event:default
core:event:allow-emit
core:event:allow-emit-to
core:event:allow-unlisten
```

Die Hidden-Host-Capability bleibt unverändert:

```text
windows: ["background-proof-poc-001-*"]
permissions: ["core:event:allow-emit-to"]
```

Spätere Runtime-Evidenz zeigte, dass damit nur die Main-Call-Sites abgedeckt
waren. Der verbliebene `plugin:event|listen`-Fehler wurde im ACL-/Event-Audit
unten einer Hidden-Host-Call-Site zugeordnet.

## 4.4 Hidden-Host-Bootstrap-Trace-Fix

Aktueller installierter Runtime-Befund:

```text
BACKGROUND_PROOF_POC_001_LIFECYCLE_TIMEOUT
letzter Lifecycle-Zustand: HOST_LOAD_STARTED
```

Main zeigte:

```text
Main selectedPage before: page-bergen
Lifecycle: HOST_LOAD_STARTED
returnTo=main
```

Eingrenzung:

```text
HOST_CREATE_REQUEST
→ HOST_CREATED
→ HOST_LOAD_STARTED
→ TIMEOUT
```

Nicht erreicht:

```text
HOST_DOM_READY
PROJECT_LOAD_START
```

Root Cause:

- Der Hidden Host hatte die gebündelte App bereits geladen und konnte Events an Main emitten.
- Der Hänger lag im ersten `waitForStudioDomCommit()`.
- Dieser Commit wartet nach `tick()` auf `requestAnimationFrame`.
- Im unsichtbaren macOS WKWebView wurde dieser erste `requestAnimationFrame` trotz `backgroundThrottling: disabled` nicht zuverlässig ausgelöst.
- Dadurch blockierte der Hidden Host vor `HOST_DOM_READY` und vor dem Projektloader. Der bestehende PDF-Renderer wurde nicht erreicht.

Minimaler Fix:

- Die Hidden-Host-URL wird jetzt über `backgroundProofPoc001BuildHostUrl()` aus der aktuellen App-URL ohne alte Query/Hash neu aufgebaut.
- Der Hidden Host trace't `window.location.href`, `pathname`, `search` und die PoC-Parameter gekürzt.
- Der Hidden Host unterscheidet jetzt:

```text
HOST_JS_BOOTSTRAP_START
HOST_LOCATION_CAPTURED
HOST_MODE_PARSED
HOST_SVELTE_MOUNT_START
HOST_SVELTE_MOUNTED
HOST_LOAD_STARTED
HOST_LOAD_FINISHED
HOST_DOM_COMMIT_START
HOST_LAYOUT_FRAME_START
HOST_LAYOUT_FRAME_COMPLETE
HOST_LAYOUT_FRAME_FALLBACK
HOST_DOM_READY
```

- Nur für den unsichtbaren Hidden-Host-PoC darf das erste Browser-Frame-Warten nach 250 ms über `HOST_LAYOUT_FRAME_FALLBACK` fortgesetzt werden, wenn `document.visibilityState === "hidden"` und `requestAnimationFrame` nicht feuert.
- Die bestehende sichtbare Proof-/Document-Proof-Readiness bleibt unverändert; deren Aufrufe erhalten diese Hidden-Host-Fallback-Option nicht.
- Die Hidden-Host-Readiness nutzt weiterhin dieselben bestehenden Prüfungen: selected page, rendered page identity, Fonts, Images, Animation/Stability und Proof-Mode-Transform.

Der nächste Runtime-Lauf soll damit mindestens erreichen:

```text
HOST_DOM_READY
PROJECT_LOAD_START
```

Falls danach ein neuer Blocker entsteht, enthält der Watchdog zusätzlich:

```text
last=<Lifecycle>
component=<main|hidden-host|rust>
operation=<konkreter Schritt>
```

## 4.5 Vollständiger Trace bis PDF

Der PoC kann nun in einem Lauf bis zum letzten erreichten Schritt trace'n:

```text
MAIN_POC_START
MAIN_LISTENERS_READY
HOST_CREATE_REQUEST
HOST_CREATED
HOST_LOAD_STARTED
HOST_LOAD_FINISHED
HOST_LOAD_FAILED
HOST_JS_BOOTSTRAP_START
HOST_LOCATION_CAPTURED
HOST_MODE_PARSED
HOST_SVELTE_MOUNT_START
HOST_SVELTE_MOUNTED
HOST_DOM_READY
PROJECT_LOAD_START
PROJECT_LOADED
REFERENCE_DISCOVERY_START
REFERENCE_DISCOVERY_COMPLETE
HOST_READY
REFERENCE_PAGE_SELECT_START
REFERENCE_PAGE_SELECTED
REFERENCE_PAGE_READINESS_START
REFERENCE_PAGE_READY
PROOF_MODE_ENTER
PROOF_MODE_READY
PDF_INVOKE_START
RUST_COMMAND_ENTER
NATIVE_WEBVIEW_RENDER_START
NATIVE_WEBVIEW_RENDER_COMPLETE
PAGEBOX_NORMALIZE_START
PAGEBOX_NORMALIZE_COMPLETE
PDF_VALIDATE_START
PDF_VALIDATE_COMPLETE
RUST_COMMAND_SUCCESS
PDF_INVOKE_SUCCESS
OUTPUT_FILE_CONFIRMED
PROOF_MODE_EXIT
NEXT_REFERENCE_PAGE
HOST_RESULT_EMIT
MAIN_RESULT_RECEIVED
HOST_CLOSE_REQUEST
HOST_CLOSED
COMPLETE
```

Renderer-relevante Trace-Punkte werden nur direkt vor/nach bestehenden Aufrufen emittiert:

```text
createStudioPdfProof()
→ create_studio_pdf_proof
→ render_active_webview_a5_pdf
→ normalize_pdf_a5_page_boxes
→ validate_pdf_a5_page_boxes
```

Der bestehende `create_studio_pdf_proof`-Request und Result-Contract bleiben unverändert. Für `OUTPUT_FILE_CONFIRMED` gibt es nur einen PoC-spezifischen Dateievidenz-Command, der nach erfolgreichem Proof `exists` und `byteLength > 0` meldet. Er implementiert keine neue PDF-Validierung.

## 4.6 ACL-/Event-Call-Site-Audit

Aktueller installierter Runtime-Befund:

```text
Error: Command plugin:event|listen not allowed by ACL
Main selectedPage before: page-bergen
Lifecycle: MAIN_RESULT_RECEIVED
```

Audit-Datei:

```text
docs/poc/background-proof-001/POC-001-ACL-EVENT-AUDIT.md
```

Konkrete fehlerhafte Call-Site:

```text
ACL-EVT-006
src/App.svelte
runBackgroundProofPoc001Host()
listen(events.native)
event name: background-proof-poc-001-native-trace
window label: background-proof-poc-001-${jobId}
isBackgroundProofPocHost: true
```

Root Cause:

- Main hat `core:event:allow-listen` und kann die job-scoped Result-/Lifecycle-/Progress-Events empfangen.
- Der Hidden Host registrierte zusätzlich einen diagnostischen Listener auf `background-proof-poc-001-native-trace`.
- Dieser Listener lief unter dem Hidden-Host-Label `background-proof-poc-001-${jobId}`.
- Die Hidden-Host-Capability ist absichtlich eng und erlaubt nur `core:event:allow-emit-to`.
- Der Hidden-Host-Listener ist für den PoC nicht erforderlich, weil der Hidden Host Projektladung, Seitenauswahl, Readiness, Proof-Aufruf und terminales Result ohne diesen Listener ausführen kann.

Minimaler Fix:

- Der Hidden-Host-Listener auf `events.native` wurde entfernt.
- Es wurde keine Hidden-Host-Permission `core:event:allow-listen` ergänzt.
- Die Hidden-Host-Capability bleibt unverändert:

```text
windows: ["background-proof-poc-001-*"]
permissions: ["core:event:allow-emit-to"]
```

Finale Main-Capability:

```text
core:default
core:webview:allow-create-webview-window
core:window:allow-close
core:event:allow-listen
dialog:allow-open
dialog:allow-save
```

Der statische Capability-Gate prüft nun zusätzlich:

- Main registriert Result-/Lifecycle-/Progress-Listener vor Hidden-Host-Erzeugung.
- Hidden Host enthält keine Tauri-`listen(...)`-Call-Site.
- Hidden Host emittiert Lifecycle, Progress und Result weiterhin über `emitTo(...)`.
- `open-nls` und `take_pending_open_path` bleiben Main-only.
- Broad Event-/Window-/WebView-Defaults bleiben verboten.

## 4.7 Hidden-Host Opacity-/Transition-Fix

Aktueller installierter Runtime-Befund:

```text
PDF_DOCUMENT_PROOF_PAGE_NOT_READY:
Destination: Die Studio-Seite ist noch nicht vollständig bereit (opacity=0).
```

Damit war belegt:

```text
Hidden Host erstellt          PASS
ACL/Event-Kommunikation       PASS
Projektloader erreicht        PASS
Referenzseite gefunden        PASS
DOM-Seite vorhanden           PASS
Readiness erreicht            PASS
Renderer gestartet            NO
```

Konkrete Ursache:

- Die gerenderte Studio-Seite ist das `<article class="a5-page">` in `src/App.svelte`.
- Dieses Element verwendet die dekorative Svelte-Transition:

```text
in:fade
```

- Vor dem Fix war die Dauer direkt am Markup gebunden:

```text
pdfProofStatus === 'rendering' ? 0 : 190
```

- Der normale Editor nutzt damit die gewollte ruhige 190-ms-Seitenblende.
- Der akzeptierte sichtbare Single-/Document-Proof setzt während `pdfProofStatus === "rendering"` bereits `duration: 0`, damit keine Übergangsopacity in den Proof gerät.
- Der Hidden Host prüft die erste aufgelöste Referenzseite aber vor `pdfProofStatus === "rendering"`. In der unsichtbaren WKWebView blieb diese dekorative Fade-Transition bei `opacity=0` stehen.

Minimaler Fix:

- Die bestehende Proof-/Export-Transition-Policy wurde in `studioPageFadeDurationMs()` zentralisiert.
- Normaler Editor:

```text
studioPageFadeDurationMs("idle", false) = 190
```

- Akzeptierter sichtbarer Proof/Document Proof:

```text
studioPageFadeDurationMs("rendering", false) = 0
```

- Hidden Background Proof Host:

```text
studioPageFadeDurationMs(any status, true) = 0
```

Der bestehende Markup-Call-Site nutzt jetzt:

```text
in:fade={{ duration: studioPageFadeDurationMs(pdfProofStatus, isBackgroundProofPocHost) }}
```

Readiness blieb unverändert:

- `opacity=0` bleibt `NOT READY`.
- `opacity=1` kann nur bestehen, wenn DOM-Identität, Visibility, Filter, laufende Animationen, Fonts, Images und Proof-Transform ebenfalls passen.
- `evaluateRenderedStudioPageReadiness()` wurde nicht geändert.

## 4.8 Post-Proof-Orchestrierungsfix

Aktueller installierter Runtime-Befund nach dem Opacity-Fix:

```text
BACKGROUND_PROOF_POC_001_LIFECYCLE_TIMEOUT:
Hidden Host lieferte kein terminales Ergebnis nach 45000 ms
last=PROOF_MODE_EXIT
component=hidden-host
```

Positive Evidenz aus diesem Lauf:

- Der Hidden Host erreichte den bestehenden akzeptierten Studio-Proof-Pfad.
- `PDF_INVOKE_START` wurde erreicht.
- `PDF_INVOKE_SUCCESS` wurde erreicht.
- `OUTPUT_FILE_CONFIRMED` wurde erreicht.
- Mindestens das erste Background-PDF wurde real erzeugt.

Der Fehler lag damit nach dem ersten erfolgreichen Proof und vor der zweiten
Referenzseite:

```text
OUTPUT_FILE_CONFIRMED
→ PROOF_MODE_EXIT
→ TIMEOUT
```

Nicht erreicht wurden:

```text
NEXT_REFERENCE_PAGE
HOST_RESULT_EMIT
MAIN_RESULT_RECEIVED
COMPLETE
```

Root Cause:

- Nach `OUTPUT_FILE_CONFIRMED` entfernte der Hidden Host `pdf-proof-rendering`.
- Danach wurde `PROOF_MODE_EXIT` emittiert.
- Direkt danach wartete der Code auf `waitForStudioDomCommit()`.
- Dieser Aufruf nutzte im Hidden Host keinen `allowHiddenHostFallback`.
- In der unsichtbaren WKWebView konnte der darin wartende `requestAnimationFrame()` erneut ausbleiben.
- `NEXT_REFERENCE_PAGE` lag erst nach diesem await und konnte deshalb nicht erreicht werden.

Minimaler Fix:

- Der Post-Proof-Abschnitt wurde explizit instrumentiert:

```text
PROOF_MODE_EXIT_START
PROOF_MODE_CLASS_REMOVED
PROOF_MODE_EXIT
POST_PROOF_TICK_START
POST_PROOF_TICK_COMPLETE
POST_PROOF_LAYOUT_FRAME_START
POST_PROOF_LAYOUT_FRAME_COMPLETE
POST_PROOF_LAYOUT_FRAME_FALLBACK
POST_PROOF_STATE_STABLE
REFERENCE_ITERATION_COMPLETE
NEXT_REFERENCE_PAGE
```

- Der Post-Proof-DOM-Commit im Hidden Host nutzt nun denselben bestehenden
  Hidden-rAF-Fallback wie Bootstrap und Hidden-Readiness.
- Sichtbare Editor- und Document-Proof-Aufrufe bleiben unverändert; sie erhalten
  diesen Hidden-Post-Proof-Fallback nicht.
- Die Loop-Reihenfolge ist jetzt:

```text
Destination
→ REFERENCE_ITERATION_COMPLETE index=1/3
→ NEXT_REFERENCE_PAGE completed=1/3 next=2/3
→ Photography Workshop
→ REFERENCE_ITERATION_COMPLETE index=2/3
→ NEXT_REFERENCE_PAGE completed=2/3 next=3/3
→ Notes / Memory
→ REFERENCE_ITERATION_COMPLETE index=3/3
→ HOST_RESULT_EMIT
```

Die drei erwarteten Output-Pfade sind abhängig vom gewählten Zielordner:

```text
<outputDir>/Destination-Background-Proof-PoC-001.pdf
<outputDir>/Photography Workshop-Background-Proof-PoC-001.pdf
<outputDir>/Notes - Memory-Background-Proof-PoC-001.pdf
```

Ein Regressionstest prüft, dass diese drei Pfade unterschiedlich sind und in
der begrenzten PoC-Referenzreihenfolge entstehen.

veraPDF-Hinweis: Die vorhandene veraPDF-Evidenz bleibt ausschließlich Evidenz
für den akzeptierten PDF/A-2b Standard-Export. Sie ist kein automatischer
visueller PASS für diese Background-Proof-PoC-PDFs.

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
- `pnpm test`: PASS, 23 Test Files, 126 Tests
- `pnpm build`: PASS
- `cargo test --manifest-path src-tauri/Cargo.toml`: PASS, 58 Rust Tests
- `pnpm consistency`: PASS
- `git diff --check`: PASS
- `node scripts/check-background-proof-poc-001-capabilities.mjs`: PASS
- `node scripts/check-studio-pdf-proof-poc-001-consistency.mjs`: PASS
- `node scripts/check-studio-document-proof-poc-001-consistency.mjs`: PASS
- `node scripts/check-studio-pdfa2b-export-consistency.mjs`: PASS
- `cargo fmt --check --manifest-path src-tauri/Cargo.toml`: FAIL, existing broad Rust formatting drift remains. No broad Rust reformatting was performed for this PoC fix.

Runtime-Evidenz:

- macOS installed app: NOT RUN
- real PDFs generated: PARTIAL USER RUNTIME EVIDENCE, first Background Proof PDF generated before `PROOF_MODE_EXIT` timeout
- physical A5 validated from PoC PDFs: NOT RUN
- visual comparison with accepted visible Proofs: NOT RUN
- Current installed-app trace before this fix: `HOST_LOAD_STARTED` then lifecycle timeout.
- Current installed-app ACL trace before this audit fix: `plugin:event|listen not allowed by ACL`.
- Current installed-app readiness trace before this opacity fix: `PDF_DOCUMENT_PROOF_PAGE_NOT_READY ... opacity=0`.
- Current installed-app post-proof trace before this orchestration fix: first PDF generated, then `BACKGROUND_PROOF_POC_001_LIFECYCLE_TIMEOUT ... last=PROOF_MODE_EXIT`.
- Agent-side runtime after this fix: NOT RUN.

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
- Der ACL-Fix muss in der installierten macOS-App erneut validiert werden. Erwartung: `create_webview_window` wird nicht mehr von ACL blockiert.
- Der Runtime-Hang-Fix muss in der installierten macOS-App validiert werden. Erwartung: Der Button bleibt nicht dauerhaft busy; bei weiterem Hidden-Host-Problem erscheint `BACKGROUND_PROOF_POC_001_LIFECYCLE_TIMEOUT` mit letztem Lifecycle-Zustand.
- Der Bootstrap-Fix muss in der installierten macOS-App validiert werden. Erwartung: Kein permanentes `HOST_LOAD_STARTED`; der Trace erreicht `HOST_DOM_READY` und danach `PROJECT_LOAD_START`.
- Der ACL-/Event-Call-Site-Audit-Fix muss in der installierten macOS-App validiert werden. Erwartung: `plugin:event|listen not allowed by ACL` tritt nicht mehr auf.
- Der Hidden-Host-Opacity-Fix muss in der installierten macOS-App validiert werden. Erwartung: Kein `PDF_DOCUMENT_PROOF_PAGE_NOT_READY` wegen `opacity=0`; Destination erreicht `REFERENCE_PAGE_READY`.
- Der Post-Proof-Orchestrierungsfix muss in der installierten macOS-App validiert werden. Erwartung: Kein Timeout bei `PROOF_MODE_EXIT`; der Trace erreicht `NEXT_REFERENCE_PAGE`, verarbeitet Photography Workshop und Notes / Memory und emittiert erst danach `HOST_RESULT_EMIT`.

## 9. Abschließende technische Bewertung

INCONCLUSIVE – awaiting real-world visual validation

Die geforderten automatisierten Build-, Test- und Consistency-Gates sind PASS. `cargo fmt --check` bleibt separat durch bestehenden Rust-Formatting-Drift rot. Der PoC darf erst nach manueller Real-World-Prüfung der drei Background-Proofs und des Main-Window-Invariants als PASS bewertet werden.



STATUS = PASS

Runtime:

- 3/3 reference PDFs generated
- Destination PASS
- Photography Workshop PASS
- Notes / Memory PASS
- Main selectedPage remained page-bergen
- no visible page switching
- no lifecycle timeout
- terminal lifecycle completed successfully
- visual validation PASS

BACKGROUND_PROOF_POC_001 = PROVEN
