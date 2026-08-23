# Background Proof PoC 001 - ACL / Event Call-Site Audit

Status: PoC-audit for `poc/background-proof-001`
Date: 2026-08-23

## Scope

This audit covers the current Background Proof PoC 001 Tauri Event, Window,
WebView and dialog call-sites. It does not reopen the accepted renderer, PDF,
A5, Document Proof, PDF/A, Golden 040 or `.nls` contracts.

## Runtime Finding

Observed installed-app error:

```text
Error: Command plugin:event|listen not allowed by ACL
```

At the same time Main reported:

```text
Main selectedPage before: page-bergen
Lifecycle: MAIN_RESULT_RECEIVED
```

This means Main had at least one working result/lifecycle receive path. The
remaining `listen` ACL error was therefore not explained by the Main
job-scoped listeners alone.

## Installed Permission Semantics Used

Sources inspected:

- `src-tauri/gen/schemas/desktop-schema.json`
- `node_modules/@tauri-apps/api/webviewWindow.js`
- `src-tauri/Cargo.lock`

Resolved versions:

- `@tauri-apps/api` 2.11.1
- `@tauri-apps/cli` 2.11.4
- `tauri` 2.11.5
- `tauri-runtime-wry` 2.11.4
- `wry` 0.55.1

Relevant schema/API facts:

- `new WebviewWindow(...)` invokes `plugin:webview|create_webview_window`.
- `listen(...)` invokes `plugin:event|listen` and needs `core:event:allow-listen` in the executing window.
- `emitTo(...)` needs `core:event:allow-emit-to` in the executing window.
- `hiddenHost.close()` needs `core:window:allow-close` in the executing window.
- `core:event:default` would grant listen, unlisten, emit and emit-to and is intentionally not used.

## Final Capability Matrix

Main window `main`:

```text
core:default
core:webview:allow-create-webview-window
core:window:allow-close
core:event:allow-listen
dialog:allow-open
dialog:allow-save
```

Hidden Host windows `background-proof-poc-001-*`:

```text
core:event:allow-emit-to
```

The Hidden Host does not receive `core:event:allow-listen`.

## Call-Site Matrix

| ID | File | Function / Call-Site | Tauri API | Executing Window | Main Required? | Hidden Host Required? | Current Permission | Needed Permission | Decision | Reason |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ACL-DLG-001 | `src/App.svelte` | `createPdfProofForCurrentPage()` save dialog | `save()` | main | YES | NO | `dialog:allow-save` | `dialog:allow-save` | KEEP MAIN | Existing single-page proof only runs in Main. |
| ACL-DLG-002 | `src/App.svelte` | `createTravelbookPdf()` save dialog | `save()` | main | YES | NO | `dialog:allow-save` | `dialog:allow-save` | KEEP MAIN | Existing document/PDF-A export only runs in Main. |
| ACL-DLG-003 | `src/App.svelte` | `createBackgroundProofPoc001()` output folder | `open()` | main | YES | NO | `dialog:allow-open` | `dialog:allow-open` | KEEP MAIN | Main chooses the PoC output folder before host creation. |
| ACL-WVW-001 | `src/App.svelte` | `createBackgroundProofPoc001()` current label lookup | `getCurrentWebviewWindow()` | main | YES | NO | no extra ACL | no extra ACL | KEEP | Used to derive `returnTo=main`. |
| ACL-EVT-001 | `src/App.svelte` | Background result listener | `listen(events.result)` | main | YES | NO | `core:event:allow-listen` | `core:event:allow-listen` | KEEP MAIN | Main must receive terminal success/failure. Registered before host creation. |
| ACL-EVT-002 | `src/App.svelte` | Background lifecycle listener | `listen(events.lifecycle)` | main | YES | NO | `core:event:allow-listen` | `core:event:allow-listen` | KEEP MAIN | Main must show the last lifecycle state. Registered before host creation. |
| ACL-EVT-003 | `src/App.svelte` | Background progress listener | `listen(events.progress)` | main | YES | NO | `core:event:allow-listen` | `core:event:allow-listen` | KEEP MAIN | Main samples selected-page invariant during hidden progress. |
| ACL-WVW-002 | `src/App.svelte` | Hidden Host creation | `new WebviewWindow(...)` | main | YES | NO | `core:webview:allow-create-webview-window` | `core:webview:allow-create-webview-window` | KEEP MAIN | Main creates `background-proof-poc-001-${jobId}`. |
| ACL-EVT-004 | `src/App.svelte` | Hidden Host created object event | `hiddenHost.once('tauri://created')` | main JS object | YES | NO | covered by WebviewWindow object lifecycle | no extra Event ACL | KEEP | Local constructor lifecycle, not a hidden host event listener. |
| ACL-EVT-005 | `src/App.svelte` | Hidden Host error object event | `hiddenHost.once('tauri://error')` | main JS object | YES | NO | covered by WebviewWindow object lifecycle | no extra Event ACL | KEEP | Local constructor error lifecycle. |
| ACL-WIN-001 | `src/App.svelte` | Hidden Host close | `hiddenHost.close()` | main | YES | NO | `core:window:allow-close` | `core:window:allow-close` | KEEP MAIN | Main removes the temporary hidden host. |
| ACL-WVW-003 | `src/App.svelte` | Hidden current label lookup | `getCurrentWebviewWindow()` | `background-proof-poc-001-*` | NO | YES | no extra ACL | no extra ACL | KEEP HIDDEN | Used to emit back to Main and trace the host label. |
| ACL-EVT-006 | `src/App.svelte` | Native trace bridge before fix | `listen(events.native)` | `background-proof-poc-001-*` | NO | NO | none in Hidden | would require `core:event:allow-listen` if kept | REMOVE | This diagnostic listener caused the ACL error and is not required for the PoC result path. |
| ACL-EVT-007 | `src/App.svelte` | Hidden lifecycle event | `emitTo(returnTo, events.lifecycle)` | `background-proof-poc-001-*` | NO | YES | `core:event:allow-emit-to` | `core:event:allow-emit-to` | KEEP HIDDEN | Hidden reports bootstrap/readiness/proof lifecycle to Main. |
| ACL-EVT-008 | `src/App.svelte` | Hidden progress event | `emitTo(returnTo, events.progress)` | `background-proof-poc-001-*` | NO | YES | `core:event:allow-emit-to` | `core:event:allow-emit-to` | KEEP HIDDEN | Hidden reports reference-page progress. |
| ACL-EVT-009 | `src/App.svelte` | Hidden success result | `emitTo(returnTo, events.result)` | `background-proof-poc-001-*` | NO | YES | `core:event:allow-emit-to` | `core:event:allow-emit-to` | KEEP HIDDEN | Hidden returns terminal success to Main. |
| ACL-EVT-010 | `src/App.svelte` | Hidden failure result | `emitTo(returnTo, events.result)` | `background-proof-poc-001-*` | NO | YES | `core:event:allow-emit-to` | `core:event:allow-emit-to` | KEEP HIDDEN | Hidden returns terminal failure to Main. |
| ACL-DLG-004 | `src/App.svelte` | New travel parent folder | `open()` | main | YES | NO | `dialog:allow-open` | `dialog:allow-open` | KEEP MAIN | Normal editor workflow only. |
| ACL-DLG-005 | `src/App.svelte` | Destination image picker | `open()` | main | YES | NO | `dialog:allow-open` | `dialog:allow-open` | KEEP MAIN | Normal editor workflow only. |
| ACL-DLG-006 | `src/App.svelte` | Open travel dialog | `open()` | main | YES | NO | `dialog:allow-open` | `dialog:allow-open` | KEEP MAIN | Normal editor workflow only. |
| ACL-EVT-011 | `src/App.svelte` | External file-open listener | `listen('open-nls')` | main | YES | NO | `core:event:allow-listen` | `core:event:allow-listen` | KEEP MAIN, HIDDEN MUST SKIP | Editor-only lifecycle. Hidden returns before this listener is registered. |
| ACL-CMD-001 | `src/App.svelte` | Pending file-open consumption | `invoke('take_pending_open_path')` | main | YES | NO | app command | app command | KEEP MAIN, HIDDEN MUST SKIP | Editor-only lifecycle. Hidden returns before this command is invoked. |
| ACL-EVT-012 | `src-tauri/src/lib.rs` | macOS file-open broadcast | `app_handle.emit('open-nls')` | native app | YES | NO | native-side emit | native-side emit | KEEP | Main consumes this via ACL-EVT-011; Hidden must not consume it. |
| ACL-EVT-013 | `src-tauri/src/lib.rs` | PoC native trace emit | `window.emit('background-proof-poc-001-native-trace')` | native command caller | NO | NO | native-side emit | native-side emit | KEEP LOG ONLY | Diagnostic Rust event may remain, but Hidden no longer listens to it. |

Audited call-sites: 24.

## Root Cause

The concrete failing call-site was:

```text
ACL-EVT-006
src/App.svelte
runBackgroundProofPoc001Host()
listen(events.native)
event name: background-proof-poc-001-native-trace
window label: background-proof-poc-001-${jobId}
isBackgroundProofPocHost: true
```

It ran because the previous full-trace investigation added a diagnostic bridge
inside the Hidden Host to listen for Rust native trace events and re-emit them
as job-scoped lifecycle events. That listener is useful evidence, but it is not
required for:

- project loading;
- selecting the three reference pages;
- existing readiness;
- entering proof mode;
- invoking `createStudioPdfProof()`;
- emitting progress/result to Main.

Granting the Hidden Host `core:event:allow-listen` would widen its lifecycle
rights for a diagnostic convenience. The narrower fix is to remove that Hidden
listener.

## Fix

Removed the Hidden Host `listen(events.native)` registration and its unlisten
cleanup. No capability was added for Hidden Host.

The static PoC capability gate now asserts:

- Main registers result/lifecycle/progress listeners before Hidden Host creation.
- Main can create and close the Hidden Host.
- Hidden Host contains no Tauri `listen(...)` call-site.
- Hidden Host emits lifecycle/progress/result to Main via `emitTo(...)`.
- Hidden Host skips `open-nls` and `take_pending_open_path`.
- Hidden Host capability remains exactly `core:event:allow-emit-to`.
- Broad Event, Window and WebView defaults remain forbidden.

## Status

Automated gates can verify the ACL matrix and static lifecycle isolation. The
installed macOS runtime still requires a user validation run.

PoC status remains:

```text
INCONCLUSIVE - awaiting real-world visual validation
```
