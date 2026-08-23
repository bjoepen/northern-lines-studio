# Background Proof PoC 001 – Result

## 1. Ausgangshypothese

Ein separates, nicht sichtbares Studio-WebView kann als temporärer Background-Proof-Host dienen und den bestehenden akzeptierten Studio-PDF-Proof-Pfad ausführen, ohne die aktuell sichtbare Seite des Main Editors zu verändern.

Der PoC prüft nur den Host. Er ersetzt keinen bestehenden Proof-, Document-Proof-, Standard-PDF- oder PDF/A-2b-Pfad.

## 2. Tatsächlich implementierte minimale Änderung

- `src/App.svelte` erzeugt über `WebviewWindow` einen temporären Hidden Host mit derselben Studio-App-URL.
- Der Hidden Host erhält per URL-Parameter `mode`, `projectPath`, `outputDir`, `finalOutputPath` für Full Document, `jobId` und Rückkanal-Label.
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
- `src/styles/base-shell.css`
- `src-tauri/src/lib.rs`
- `src-tauri/capabilities/default.json`
- `src-tauri/capabilities/background-proof.json`
- `scripts/check-background-proof-poc-001-capabilities.mjs`
- `scripts/check-studio-document-proof-poc-001-consistency.mjs`
- `docs/poc/background-proof-001/POC-001-ACL-EVENT-AUDIT.md`
- `docs/poc/background-proof-001/POC-001-FULL-DOCUMENT-VALIDATION.md`
- `docs/poc/background-proof-001/POC-001-RASTER-FIDELITY-INVESTIGATION.md`
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

## 4.9 Full-Travelbook Completion und UI-Konsolidierung

Nach der erfolgreichen 3-Referenzseiten-Runtime wurde derselbe PoC-Branch für
den vollständigen Travelbook-Pfad erweitert.

UI-Konsolidierung:

- Die Canvas-Entwicklungsbuttons wurden aus der normalen Arbeitsfläche entfernt:
  `Seiten-Proof`, `Standard PDF`, `PDF/A-2b`, `Background PoC`.
- Die PoC-Lifecycle-/selectedPage-Debugzeile wird nicht mehr im Canvas gerendert.
- Die globale Toolbar enthält nun:

```text
Ausgabe ▾    Reise ▾
```

`Ausgabe` enthält:

```text
PDF exportieren
Entwicklungs-PDF
```

`PDF exportieren` verwendet:

```text
Hidden Background Document Export
→ bestehende Document Assembly
→ bestehender PDF/A-2b Postprocessor
→ finale Benutzer-PDF
```

`Entwicklungs-PDF` bleibt der bisherige akzeptierte sichtbare Standard-PDF-Pfad
und dient als Vergleichsreferenz.

Full-Document-Orchestrierung:

- Seitenquelle ist ausschließlich `studioDocumentProofPages(project)`, also
  derselbe kanonische Publication-Order-Pfad wie im akzeptierten Document Proof.
- Variable Seitenzahlen bleiben unterstützt; das Referenzprojekt wird in der
  Runtime mit 16 Seiten erwartet.
- Jede Seite läuft seriell durch Hidden-Host-Seitenauswahl, bestehende
  Readiness, bestehenden `pdf-proof-rendering`-Modus und `createStudioPdfProof()`.
- Danach werden die staged pages mit `assembleStudioDocumentPdfProof()`
  zusammengesetzt.
- Anschließend erzeugt `exportStudioPdfA2b()` die finale PDF/A-2b-Datei.

Der Background Standard PDF-Zwischenschritt wird als Vergleichsevidenz neben
der finalen PDF abgelegt:

```text
<final-name>-background-standard.pdf
```

Full-Document-Trace:

```text
DOCUMENT_BACKGROUND_START
PAGE_COUNT_RESOLVED
PAGE_ITERATION_START
PAGE_SELECTED
PAGE_READY
PAGE_PROOF_START
PAGE_PROOF_COMPLETE
PAGE_STAGED
PAGE_ITERATION_COMPLETE
DOCUMENT_ASSEMBLY_START
DOCUMENT_ASSEMBLY_COMPLETE
STANDARD_DOCUMENT_READY
PDFA_POSTPROCESS_START
PDFA_POSTPROCESS_COMPLETE
FINAL_OUTPUT_READY
COMPLETE
```

Zusätzliche Validierungsnotiz:

```text
docs/poc/background-proof-001/POC-001-FULL-DOCUMENT-VALIDATION.md
```

Ausstehend bleiben installierte macOS-Runtime, 16/16-Seiten-Nachweis,
Background-vs-Entwicklungs-PDF-Vergleich, externe veraPDF-Prüfung und visuelle
Validierung.

## 4.10 Full-Document Host Request Contract Fix

Runtime-Fehler in der installierten macOS-App:

```text
BACKGROUND_PROOF_POC_001_INVALID_HOST_REQUEST:
Hidden Host wurde ohne vollständige PoC-Parameter gestartet.
```

Der Fehler trat vor `PROJECT_LOAD_START`, `REFERENCE_PAGE_SELECT_START` und
`PDF_INVOKE_START` auf. Damit lag er im Request-/Bootstrap-Contract zwischen
Main Window und Hidden Host, nicht im Renderer.

Root Cause:

- Der ursprüngliche 3-Seiten-PoC übergab einen Zielordner als `outputDir`.
- Der Full-Document-Caller wechselte auf einen finalen Dateipfad, setzte aber
  `outputDir` im Hidden-Host-Request auf leer.
- Der Hidden Host validierte weiterhin `projectPath`, `outputDir` und `jobId`
  als Pflichtfelder.
- Dadurch war der Full-Document-Request technisch unvollständig.

Request-Matrix nach Fix:

| Feld | Caller schreibt | Hidden Host liest | Required? | Source | Target name | Encoding | Validation |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `nlsBackgroundProofPoc` | `001` | `isHost` | YES | constant | `nlsBackgroundProofPoc` | `URLSearchParams` | must be `001` |
| `mode` | `reference-pages` oder `document-pdfa2b` | `mode` | YES | caller mode | `mode` | `URLSearchParams` | defaults only to reference mode if absent |
| `projectPath` | saved `.nls` path | `projectPath` | YES | `project.projectPath` | `projectPath` | `URLSearchParams` | non-empty |
| `outputDir` | reference output folder or derived final-output parent | `outputDir` | YES | folder dialog or `finalOutputPath` parent | `outputDir` | `URLSearchParams` | non-empty |
| `jobId` | generated id | `jobId` | YES | Main caller | `jobId` | `URLSearchParams` | non-empty |
| `returnTo` | current Main label | `returnTo` | YES | `getCurrentWebviewWindow().label` | `returnTo` | `URLSearchParams` | non-empty |
| `finalOutputPath` | final PDF target for Full Document | `finalOutputPath` | YES for `document-pdfa2b`, NO for reference mode | save dialog | `finalOutputPath` | `URLSearchParams` | non-empty in Full Document |
| `backgroundStandardPath` | not transported | derived in Hidden Host | NO URL parameter | `finalOutputPath` | none | derived by helper | deterministic derivation |

Minimaler Fix:

- Der Full-Document-Caller leitet `outputDir` deterministisch aus dem vom Nutzer
  gewählten finalen PDF-Pfad ab.
- Der finale Pfad wird eindeutig als `finalOutputPath` transportiert.
- `backgroundStandardPath` wird nicht als zweiter Output-Parameter übertragen,
  sondern im Hidden Host deterministisch aus `finalOutputPath` abgeleitet.
- Die Host-Validierung wurde nicht abgeschwächt. Ein unvollständiger Request
  bleibt `BACKGROUND_PROOF_POC_001_INVALID_HOST_REQUEST`.

Neue Trace-Punkte vor Hidden-Host-Erzeugung:

```text
FULL_DOCUMENT_HOST_REQUEST
FULL_DOCUMENT_HOST_REQUEST_VALID
```

Der nächste Runtime-Lauf soll damit mindestens erreichen:

```text
FULL_DOCUMENT_HOST_REQUEST_VALID
HOST_MODE_PARSED
HOST_DOM_READY
PROJECT_LOAD_START
PROJECT_LOADED
PAGE_COUNT_RESOLVED
```

## 4.11 Raster-Fidelity-/Hidden-WebView-Resolution-Fix

Runtime-Befund nach erfolgreichem Full-Document-Background-Export:

```text
Development PDF          sichtbar schaerfer / kontrastreicher
Background Standard PDF  sichtbar weichere Rasterbilder
Final PDF/A-2b           erbt die Background-Standard-Rasterdimensionen
```

Der Unterschied ist bereits im Background Standard PDF vorhanden und damit kein
primaerer PDF/A-Befund.

Identifizierte Artefakte:

| Rolle | Pfad | SHA-256 | Seiten | Groesse |
| --- | --- | --- | ---: | ---: |
| Development PDF | `/Users/bernd/Documents/Norwegen 2027-Travelbook.pdf` | `ea2506338dd2d17e172e3067f8faf8e5af20c977dcabfc1a3bdee7d7f9489394` | 16 | 48,289,621 bytes |
| Background Standard PDF | `/Users/bernd/Documents/Norwegen 2027-background-standard.pdf` | `1715efcfd7c764dac3d3bda105308fb46a4caa1de4192096b45fa258ebed437d` | 16 | 2,296,465 bytes |
| Final Background PDF/A-2b | `/Users/bernd/Documents/Norwegen 2027.pdf` | `f393ae044e537b98595548cc786da8cd74f671be6f9f174229838c7cbb8d12c6` | 16 | 2,297,481 bytes |

Strukturelle Evidence:

```text
page count 16/16
page size 419.528 x 595.276 pt
MediaBox/CropBox/TrimBox gleich
pdffonts: gleiche eingebettete Font-Struktur
```

Raster-Evidence aus `pdfimages -list`:

| Asset-Klasse | Development PDF | Background Standard PDF | Final PDF/A-2b |
| --- | ---: | ---: | ---: |
| Companion, p4 | 1536 x 1024 px, ca. 1907 ppi | 116 x 77 px, 144 ppi | 116 x 77 px, 144 ppi, Interpolate=no |
| Destination/Hero, p5 | 2073 x 758 px, 463 ppi | 645 x 236 px, 144 ppi | 645 x 236 px, 144 ppi, Interpolate=no |
| Interest/Workshop-artig, p6 | 1672 x 941 px, 1120 ppi | 215 x 121 px, 144 ppi | 215 x 121 px, 144 ppi, Interpolate=no |
| Portrait Interest, p9 | 1023 x 1537 px, 630 ppi | 233 x 351 px, 143/144 ppi | 233 x 351 px, 143/144 ppi, Interpolate=no |

Root Cause:

- Der Hidden Host wurde vor dem Fix als unsichtbares WebviewWindow mit
  `width: 420` und `height: 596` erzeugt.
- Der sichtbare Entwicklungs-PDF-Pfad ruft denselben `createStudioPdfProof()` /
  `create_studio_pdf_proof` / nativen `WKWebView createPDF`-Pfad aus dem
  normalen, deutlich groesseren Main WebView auf.
- Die Background-Rasterdimensionen korrelieren mit dem kleinen Hidden-Viewport.
  Beispiel: Destination/Hero `2073 / 645 = 3.21`; `420 * 3.21 ~= 1348`, also
  typische Main-Viewport-Breite im sichtbaren Studio.
- WebKit emittiert die Bildlayer im Hidden Host deshalb unter einer kleineren
  Backing-/Viewport-Bedingung.

Minimaler Fix:

- `backgroundProofPoc001HiddenHostViewportForMain()` leitet die Hidden-Host-
  Fensterabmessung aus `window.innerWidth` / `window.innerHeight` des sichtbaren
  Main WebViews ab.
- Fallback ist die Main-Window-Mindestgroesse aus `tauri.conf.json`:

```text
width  >= 980
height >= 700
```

- `new WebviewWindow(...)` nutzt jetzt diese abgeleitete Main-Viewport-Groesse.
- Der A5-Capture bleibt unverändert: bestehendes `pdf-proof-rendering` CSS und
  bestehender nativer `WKPDFConfiguration.rect`.

Neue PoC-Evidence:

```text
MAIN_RENDER_ENVIRONMENT
MAIN_ASSET_EVIDENCE
HOST_RENDER_ENVIRONMENT
PAGE_ASSET_EVIDENCE
```

Diese Trace-Punkte erfassen Browser-Viewport, DPR, Screen/VisualViewport,
Visibility sowie DOM-Bilddaten (`naturalWidth`, `currentSrc`, CSS-/Client-/
Bounding-Box-Groessen, `object-fit`, `image-rendering`, `srcset`/`sizes`).

Ausfuehrliche Evidence:

```text
docs/poc/background-proof-001/POC-001-RASTER-FIDELITY-INVESTIGATION.md
```

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
- `pnpm test`: PASS, 23 Test Files, 132 Tests
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
- Current raster-fidelity agent-side PDF inspection: Development PDF vs
  Background Standard PDF shows matching page count/PageBoxes/fonts and
  materially smaller Background raster objects before the fix.
- Raster-fidelity installed-app runtime after this fix: NOT RUN.

## 7. Manuelle Testanleitung

Full-Document-Runtime gemäß aktuellem Auftrag:

1. App starten und das 16-seitige Referenz-Travelbook öffnen.
2. Im Main Window eine eindeutig erkennbare Seite sichtbar lassen, z. B. Bergen.
3. Main selected page before notieren.
4. `Ausgabe` → `PDF exportieren` starten und finalen Zielpfad wählen.
5. Während der Export läuft prüfen, dass Main Window keine andere Seite zeigt,
   nicht in Proof Mode wechselt, nicht resized und nicht flackert.
6. Main selected page during notieren.
7. Nach Abschluss Main selected page after notieren.
8. Prüfen, dass die finale PDF entsteht.
9. Prüfen, dass die Background Standard PDF neben der finalen PDF entsteht:
   `<final-name>-background-standard.pdf`.
10. Prüfen, dass der Trace 16/16 Seiten in kanonischer Publication Order durchläuft.
11. `Ausgabe` → `Entwicklungs-PDF` erzeugen.
12. Background Standard PDF gegen Entwicklungs-PDF vergleichen:
    page count, page order, PageBoxes, Fonts, Images, decoded content streams
    und visuelle Stichproben.
13. Finale PDF extern mit veraPDF prüfen:

```text
profileName: PDF/A-2b
compliant: true
failedRules: 0
failedChecks: 0
```

Visuelle Stichproben:

- Cover
- Orientation
- Destination
- Interest
- Workshop
- Notes / Memory

PASS ist für diesen erweiterten Auftrag nur zulässig, wenn Full-Document-Runtime,
Main-Window-Invariante, Background-vs-Entwicklungs-PDF-Vergleich, finale PDF/A
und visuelle Stichproben bestehen.

## 8. Bekannte Einschränkungen

- Der PoC verwendet ausschließlich gespeicherte Projektzustände.
- Ungespeicherte Bearbeitungen sind ausgeschlossen.
- Die drei Referenzseiten wurden in der Nutzer-Runtime validiert; der neue
  Full-Document-Pfad benötigt separate 16-Seiten-Runtime-Validierung.
- Der bestehende sichtbare Document Proof, Entwicklungs-PDF-Pfad und PDF/A-2b
  Kern bleiben unverändert.
- Die installierte macOS-App und reale Full-Document-PDFs wurden in dieser
  Agent-Umgebung nicht ausgeführt.
- Der ACL-Fix muss in der installierten macOS-App erneut validiert werden. Erwartung: `create_webview_window` wird nicht mehr von ACL blockiert.
- Der Runtime-Hang-Fix muss in der installierten macOS-App validiert werden. Erwartung: Der Button bleibt nicht dauerhaft busy; bei weiterem Hidden-Host-Problem erscheint `BACKGROUND_PROOF_POC_001_LIFECYCLE_TIMEOUT` mit letztem Lifecycle-Zustand.
- Der Bootstrap-Fix muss in der installierten macOS-App validiert werden. Erwartung: Kein permanentes `HOST_LOAD_STARTED`; der Trace erreicht `HOST_DOM_READY` und danach `PROJECT_LOAD_START`.
- Der ACL-/Event-Call-Site-Audit-Fix muss in der installierten macOS-App validiert werden. Erwartung: `plugin:event|listen not allowed by ACL` tritt nicht mehr auf.
- Der Hidden-Host-Opacity-Fix muss in der installierten macOS-App validiert werden. Erwartung: Kein `PDF_DOCUMENT_PROOF_PAGE_NOT_READY` wegen `opacity=0`; Destination erreicht `REFERENCE_PAGE_READY`.
- Der Post-Proof-Orchestrierungsfix muss in der installierten macOS-App validiert werden. Erwartung: Kein Timeout bei `PROOF_MODE_EXIT`; der Trace erreicht `NEXT_REFERENCE_PAGE`, verarbeitet Photography Workshop und Notes / Memory und emittiert erst danach `HOST_RESULT_EMIT`.
- Der Full-Document-Pfad muss in der installierten macOS-App validiert werden.
  Erwartung: `PDF exportieren` läuft über 16/16 kanonische Seiten, erzeugt
  Background Standard PDF und finale PDF/A-2b, ohne die Main-Seite zu ändern.
- Der Raster-Fidelity-Fix muss in der installierten macOS-App validiert werden.
  Erwartung: Background Standard PDF und Entwicklungs-PDF enthalten
  korrespondierende Rasterobjekte ohne materielle Downsampling-Differenz.

## 9. Abschließende technische Bewertung

INCONCLUSIVE – awaiting raster fidelity runtime validation

Die frühere 3/3-Referenzseiten-Runtime ist bestanden:

```text
3/3 reference PDFs generated
Destination PASS
Photography Workshop PASS
Notes / Memory PASS
Main selectedPage remained page-bergen
no visible page switching
no lifecycle timeout
terminal lifecycle completed successfully
visual validation PASS
```

Der erweiterte Full-Document-Auftrag ist erst nach installierter
16-Seiten-Runtime, Vergleich Background Standard PDF vs Entwicklungs-PDF,
externer veraPDF-Prüfung und visueller Validierung bewertbar.
