import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(read(file));
const fail = (message) => {
  console.error(`FAIL · Background Proof PoC 001 Capability Gate · ${message}`);
  process.exit(1);
};

const app = read('src/App.svelte');
const pdfProof = read('src/lib/pdf-proof.ts');
const main = readJson('src-tauri/capabilities/default.json');
const background = readJson('src-tauri/capabilities/background-proof.json');
const schema = readJson('src-tauri/gen/schemas/desktop-schema.json');

const sliceBetween = (source, start, end) => {
  const startIndex = source.indexOf(start);
  if (startIndex < 0) fail(`App source missing marker: ${start}`);
  const endIndex = source.indexOf(end, startIndex);
  if (endIndex < 0) fail(`App source missing marker after ${start}: ${end}`);
  return source.slice(startIndex, endIndex);
};

const identifiers = new Set(
  schema.definitions.Identifier.oneOf
    .map((entry) => entry.const)
    .filter(Boolean)
);

for (const [file, capability] of [
  ['default.json', main],
  ['background-proof.json', background]
]) {
  for (const key of ['identifier', 'permissions']) {
    if (!(key in capability)) fail(`${file} missing required key: ${key}`);
  }
  for (const permission of capability.permissions) {
    if (!identifiers.has(permission)) fail(`${file} uses permission not present in generated Tauri schema: ${permission}`);
  }
}

if (!app.includes('new WebviewWindow(`background-proof-poc-001-${jobId}`')) {
  fail('Hidden Host label must remain background-proof-poc-001-${jobId}.');
}
if (!main.windows?.includes('main')) fail('default capability must remain scoped to main.');
if (!main.permissions.includes('core:webview:allow-create-webview-window')) {
  fail('main must be allowed to create the Hidden WebviewWindow.');
}
if (!main.permissions.includes('core:window:allow-close')) {
  fail('main must be allowed to close the temporary Hidden Host after completion.');
}
if (!main.permissions.includes('core:event:allow-listen')) {
  fail('main must be allowed to register Background Proof PoC event listeners.');
}

for (const forbidden of [
  'core:webview:allow-create-webview',
  'core:window:allow-create',
  'core:webview:allow-show',
  'core:window:allow-show',
  'core:webview:default',
  'core:window:default',
  'core:event:default',
  'core:event:allow-emit',
  'core:event:allow-emit-to',
  'core:event:allow-unlisten'
]) {
  if (main.permissions.includes(forbidden)) fail(`main gained unnecessary broad permission: ${forbidden}`);
}

if (background.identifier !== 'background-proof') fail('Hidden Host capability identifier changed.');
if (JSON.stringify(background.windows) !== JSON.stringify(['background-proof-poc-001-*'])) {
  fail('Hidden Host capability must only match the Background Proof PoC label pattern.');
}
if (JSON.stringify(background.permissions) !== JSON.stringify(['core:event:allow-emit-to'])) {
  fail('Hidden Host capability must only allow emitting progress/result events back to main.');
}

const mainBackgroundPoc = sliceBetween(
  app,
  'async function createBackgroundProofPoc001()',
  'async function runBackgroundProofPoc001Host()'
);
const hiddenBackgroundPoc = sliceBetween(
  app,
  'async function runBackgroundProofPoc001Host()',
  'function applyInspectorWidth'
);
const editorOpenLifecycle = sliceBetween(
  app,
  "onMount(() => {\n    if (isBackgroundProofPocHost) {\n      void runBackgroundProofPoc001Host();",
  '$: preview = previewFor(selectedPage);'
);

const hostCreateIndex = mainBackgroundPoc.indexOf('new WebviewWindow(`background-proof-poc-001-${jobId}`');
if (hostCreateIndex < 0) fail('Main PoC host creation call-site missing.');
for (const listenerSnippet of [
  'await listen<BackgroundProofPoc001Result>(events.result',
  'await listen<BackgroundProofPoc001LifecycleEvent>(events.lifecycle',
  'await listen<{ referenceTitle: string }>(events.progress'
]) {
  const listenerIndex = mainBackgroundPoc.indexOf(listenerSnippet);
  if (listenerIndex < 0) fail(`Main PoC listener call-site missing: ${listenerSnippet}`);
  if (listenerIndex > hostCreateIndex) fail(`Main PoC listener must be registered before Hidden Host creation: ${listenerSnippet}`);
}

if (!mainBackgroundPoc.includes('await hiddenHost.close()')) {
  fail('Main must close the temporary Hidden Host after a terminal result or failure.');
}
if (!mainBackgroundPoc.includes("hiddenHost?.once('tauri://created'")) {
  fail('Main must observe the Hidden Host created event.');
}
if (!mainBackgroundPoc.includes("hiddenHost?.once<string>('tauri://error'")) {
  fail('Main must observe the Hidden Host create/load error event.');
}

if (hiddenBackgroundPoc.includes('listen<') || hiddenBackgroundPoc.includes('listen(')) {
  fail('Hidden Host must not register Tauri event listeners; do not grant hidden core:event:allow-listen.');
}
if (!hiddenBackgroundPoc.includes('currentWebview.emitTo(backgroundProofPocReturnTo, events.lifecycle')) {
  fail('Hidden Host must emit lifecycle evidence back to main.');
}
if (!hiddenBackgroundPoc.includes('currentWebview.emitTo(backgroundProofPocReturnTo, events.progress')) {
  fail('Hidden Host must emit progress back to main.');
}
if (!hiddenBackgroundPoc.includes('currentWebview.emitTo(backgroundProofPocReturnTo, events.result')) {
  fail('Hidden Host must emit terminal result back to main.');
}

if (!editorOpenLifecycle.includes("if (isBackgroundProofPocHost) {\n      void runBackgroundProofPoc001Host();\n      return;\n    }")) {
  fail('Hidden Host must enter PoC host lifecycle before Main-only open-nls registration.');
}
if (!editorOpenLifecycle.includes("await listen<string>('open-nls'")) {
  fail('Main-only open-nls listener call-site missing from lifecycle audit target.');
}
if (!editorOpenLifecycle.includes("invoke<string | null>('take_pending_open_path'")) {
  fail('Main-only take_pending_open_path call-site missing from lifecycle audit target.');
}

for (const step of [
  'MAIN_POC_START',
  'MAIN_LISTENERS_READY',
  'HOST_CREATE_REQUEST',
  'HOST_CREATED',
  'HOST_LOAD_STARTED',
  'HOST_LOAD_FINISHED',
  'HOST_LOAD_FAILED',
  'HOST_JS_BOOTSTRAP_START',
  'HOST_LOCATION_CAPTURED',
  'HOST_MODE_PARSED',
  'HOST_SVELTE_MOUNT_START',
  'HOST_SVELTE_MOUNTED',
  'HOST_DOM_COMMIT_START',
  'HOST_LAYOUT_FRAME_START',
  'HOST_LAYOUT_FRAME_COMPLETE',
  'HOST_LAYOUT_FRAME_FALLBACK',
  'HOST_DOM_READY',
  'PROJECT_LOAD_START',
  'PROJECT_LOADED',
  'REFERENCE_DISCOVERY_START',
  'REFERENCE_DISCOVERY_COMPLETE',
  'HOST_READY',
  'REFERENCE_PAGE_SELECT_START',
  'REFERENCE_PAGE_SELECTED',
  'REFERENCE_PAGE_READINESS_START',
  'REFERENCE_PAGE_READY',
  'PROOF_MODE_ENTER',
  'PROOF_MODE_READY',
  'PDF_INVOKE_START',
  'RUST_COMMAND_ENTER',
  'NATIVE_WEBVIEW_RENDER_START',
  'NATIVE_WEBVIEW_RENDER_COMPLETE',
  'PAGEBOX_NORMALIZE_START',
  'PAGEBOX_NORMALIZE_COMPLETE',
  'PDF_VALIDATE_START',
  'PDF_VALIDATE_COMPLETE',
  'RUST_COMMAND_SUCCESS',
  'PDF_INVOKE_SUCCESS',
  'OUTPUT_FILE_CONFIRMED',
  'PROOF_MODE_EXIT_START',
  'PROOF_MODE_CLASS_REMOVED',
  'PROOF_MODE_EXIT',
  'POST_PROOF_TICK_START',
  'POST_PROOF_TICK_COMPLETE',
  'POST_PROOF_LAYOUT_FRAME_START',
  'POST_PROOF_LAYOUT_FRAME_COMPLETE',
  'POST_PROOF_LAYOUT_FRAME_FALLBACK',
  'POST_PROOF_STATE_STABLE',
  'REFERENCE_ITERATION_COMPLETE',
  'NEXT_REFERENCE_PAGE',
  'HOST_RESULT_EMIT',
  'MAIN_RESULT_RECEIVED',
  'HOST_CLOSE_REQUEST',
  'HOST_CLOSED',
  'COMPLETE'
]) {
  if (!pdfProof.includes(`'${step}'`)) fail(`Lifecycle step missing from typed PoC contract: ${step}`);
}

for (const requiredSnippet of [
  'backgroundProofPoc001BuildHostUrl',
  'backgroundProofPoc001ParseHostParams',
  "const backgroundProofPocNoThrottling = 'disabled' as BackgroundThrottlingPolicy",
  "recordLifecycle('MAIN_POC_START'",
  "recordLifecycle('MAIN_LISTENERS_READY'",
  "recordLifecycle('HOST_CREATE_REQUEST'",
  "recordLifecycle('HOST_CREATED'",
  "recordLifecycle('MAIN_RESULT_RECEIVED'",
  "recordLifecycle('HOST_CLOSE_REQUEST'",
  "recordLifecycle('HOST_CLOSED'",
  "recordLifecycle('COMPLETE'",
  "emitLifecycle('HOST_JS_BOOTSTRAP_START'",
  "emitLifecycle('HOST_LOCATION_CAPTURED'",
  "emitLifecycle('HOST_MODE_PARSED'",
  "emitLifecycle('HOST_LOAD_STARTED'",
  "emitLifecycle('HOST_LOAD_FINISHED'",
  "emitLifecycle('HOST_DOM_READY'",
  "emitLifecycle('PROJECT_LOAD_START'",
  "emitLifecycle('REFERENCE_DISCOVERY_COMPLETE'",
  "emitLifecycle('HOST_READY'",
  "emitLifecycle('PROOF_MODE_EXIT_START'",
  "emitLifecycle('PROOF_MODE_CLASS_REMOVED'",
  "domCommitStartStep: 'POST_PROOF_TICK_START'",
  "layoutFrameFallbackStep: 'POST_PROOF_LAYOUT_FRAME_FALLBACK'",
  "emitLifecycle('POST_PROOF_STATE_STABLE'",
  "emitLifecycle('REFERENCE_ITERATION_COMPLETE'",
  "emitLifecycle('HOST_RESULT_EMIT'",
  "emitLifecycle('OUTPUT_FILE_CONFIRMED'",
  'background_proof_poc_output_file_evidence',
  'backgroundProofPoc001LifecycleTimeoutError',
  'Promise.race([resultPromise, watchdogPromise])'
]) {
  if (!app.includes(requiredSnippet)) fail(`Lifecycle evidence path missing App snippet: ${requiredSnippet}`);
}

const rust = read('src-tauri/src/lib.rs');
for (const requiredSnippet of [
  'emit_background_proof_poc_001_native_trace',
  '"RUST_COMMAND_ENTER"',
  '"NATIVE_WEBVIEW_RENDER_START"',
  '"NATIVE_WEBVIEW_RENDER_COMPLETE"',
  '"PAGEBOX_NORMALIZE_START"',
  '"PAGEBOX_NORMALIZE_COMPLETE"',
  '"PDF_VALIDATE_START"',
  '"PDF_VALIDATE_COMPLETE"',
  '"RUST_COMMAND_SUCCESS"',
  'background_proof_poc_output_file_evidence'
]) {
  if (!rust.includes(requiredSnippet)) fail(`Rust trace evidence missing snippet: ${requiredSnippet}`);
}

console.log('PASS · Background Proof PoC 001 Capability/Lifecycle Gate · minimal ACL and terminal lifecycle evidence.');
