# AGENTS.md — Northern Lines Studio

## 0. Purpose and authority

This file is the binding operating contract for coding agents working on **Northern Lines Studio**.

Read it completely **before analysing, modifying, generating, deleting, or moving repository files**.

Northern Lines Studio is part of the Northern Lines travel and photography ecosystem. It is a specialized editorial desktop application, not a generic DTP system, CMS, page builder, or template editor.

For agent work, authority is resolved in this order:

1. Explicit current user instruction.
2. This `AGENTS.md`.
3. Current approved Golden Build contracts and current source code.
4. `docs/PRODUCT-DNA.md`.
5. `docs/VISION.md`.
6. `docs/ARCHITECTURE.md`.
7. `docs/editorial-worlds/EDITORIAL-WORLD-CONTRACT.md` and World-specific contracts.
8. Accepted current ADRs and current validation/build documentation.
9. Historical build notes and superseded ADRs.

If a historical document conflicts with a newer approved contract, **do not restore the historical behavior**. Report the conflict and follow the newer authority.

### Current authority

The current approved geometry baseline is **Golden Build 040**.

Build 040 supersedes older statements that describe the Studio page merely as a `420 × 594 px` approximation or assign final Studio-originated page geometry to another subsystem.

The binding principle is:

> **Studio is the visual and geometric source of truth for the page. Downstream proof/export code must conform to Studio; Studio must not be reshaped to accommodate a renderer.**

---

# 1. Current platform scope — macOS only

The active implementation, validation, build, and product target for the current Northern Lines Studio development phase is **macOS**.

This is an explicit scope decision.

Current status:

```text
macOS application                    ACTIVE
macOS Studio development             ACTIVE
macOS PDF-proof implementation       ACTIVE
macOS PDF-proof stabilization        ACTIVE
macOS real-world validation          ACTIVE

Windows application                  OUT OF CURRENT SCOPE
Windows PDF-proof adapter            DEFERRED
Windows runtime validation           DEFERRED
Windows-specific dependencies        DO NOT EXPAND
```

Agents must **not implement, modify, expand, test, or refactor Windows-specific PDF-proof functionality unless explicitly instructed by the user**.

Do not add abstractions merely to prepare for Windows.

Do not introduce Windows dependencies for speculative future use.

Existing platform-scoped Windows code or dependencies created by an earlier approved PoC may remain unless the current task explicitly asks for cleanup. They are not part of the active Definition of Done.

This scope decision does **not** permanently reject future Windows support. It only establishes that current engineering decisions must solve the macOS product correctly first.

For the current phase:

> **Make the proven macOS path boring, deterministic and reliable first.**

macOS-specific implementation is therefore acceptable where it is the simplest correct implementation for the current product.

---

# 2. Product DNA

Northern Lines Studio follows the principle:

> **Wenige starke Möglichkeiten. Viele persönliche Geschichten.**

And:

> **Intern darf Northern Lines Studio komplex sein. Für den Reisenden muss es sich selbstverständlich anfühlen.**

The UI speaks **Travel Language**, not implementation language.

Examples:

- “Neue Reise beginnen”, not “create project”.
- “Reiseplanung”, not “journey metadata”.
- “Ort hinzufügen”, not “create destination page”.
- “Seitenwirkung”, not “layout template”.
- “Weite”, “Bild links”, “Bild rechts”, not technical layout IDs.
- “Was möchtest du in [Ort] erleben?”, not “create interest archetype”.

Never expose internal IDs, schema mechanics, renderer terms, manifests, asset IDs, coordinate systems, or implementation details unless the product explicitly requires a technical diagnostic surface.

Studio must never drift into:

- a generic DTP application;
- a CMS;
- a freeform page builder;
- a generic grid editor;
- arbitrary x/y positioning;
- user-defined boxes or frames;
- a theme editor;
- a database editor.

The author edits **meaning**. Studio composes it.

---

# 3. Technical baseline

Current application stack:

- Tauri v2
- Svelte
- TypeScript
- HTML/CSS page rendering
- Rust for controlled desktop/filesystem/native integration
- pnpm / Node
- Vitest
- Svelte Check

The active desktop runtime is macOS.

For framework/runtime/export tasks, inspect the exact dependency versions in the repository before making implementation claims.

Do not rely on remembered Tauri, Wry, WebKit, WKWebView, Rust, Svelte, or browser behavior.

---

# 4. Golden Build 040 — physical page contract

Golden Build 040 is the baseline for all current Studio work and PDF-proof work.

## 4.1 Logical and physical geometry

Binding geometry:

```text
Studio page width       = 420 u
Studio physical height  = 420 × 210 / 148
                        = 595.9459459459 u

Golden composition      = 420 × 594 u
A5 extension            = 1.9459459459 u
Physical aspect ratio   = exact DIN A5
Physical target medium  = 148 × 210 mm
Coordinate origin       = top-left
```

`u` means **Studio Unit**.

Do not describe the design contract conceptually as physical screen pixels. CSS pixels may be used as an implementation vehicle for the on-screen representation, but Studio Units are the design coordinates.

## 4.2 Golden composition preservation

The approved pre-040 composition inside `420 × 594 u` remains visually authoritative.

Build 040 deliberately corrected the physical page aspect ratio without moving the established composition.

Therefore:

- footer position must remain unchanged relative to the Golden composition;
- Companion position must remain unchanged;
- all protected safe zones must remain unchanged;
- title, hero, content and extension zones must remain unchanged;
- typography and line wrapping must not be altered merely to satisfy export;
- existing bottom anchors must preserve their Golden Y position;
- no proof/export mechanism may introduce fit-to-page or non-uniform scaling.

## 4.3 No renderer-driven scaling

Forbidden for the PDF-proof path:

- `fit-to-page`
- `scale-to-fit`
- `shrink-to-fit`
- non-uniform x/y scale
- renderer-dependent geometry correction
- post-render content scaling
- layout reconstruction after Studio has resolved the page

For PDF proof/export, the required relationship is:

```text
Studio resolved page
→ physical PDF representation
```

not:

```text
Studio data
→ second layout engine
→ interpreted page
```

---

# 5. Protected editorial zones

The following are binding layout concepts:

- Hero Zone
- Title Zone
- Content Zone
- Editorial Extension Zones
- Companion Safe Zone
- Footer Safe Zone
- Binding Safe Zone

Core rule:

> **Kuscheln erlaubt, jeder im eigenen Bett.**

Semantic zones may be visually close but must not overlap or borrow protected space.

## 5.1 Title and Hero

Hero and Title are siblings, not roommates.

- Hero content remains inside the Hero Zone.
- Title content remains inside the Title Zone.
- A title must never intrude into Hero content.
- A Hero must never visually escape into the Title Zone.
- Long place names may trigger approved adaptive grammar states.
- Do not hyphenate or shrink the place name merely to save a layout.

## 5.2 Companion

The Companion is not a normal layout participant.

> **Der Begleiter ist unantastbar – und sein Raum ebenfalls.**

The layout must reserve space for it.

Do not:

- move it to rescue content fit;
- scale it opportunistically;
- mirror it unless the World contract explicitly defines that;
- allow content to overlap it;
- treat it as a generic decorative image.

## 5.3 Footer

Footer identity and position are invariant across approved page effects.

Do not move the footer to accommodate content.

## 5.4 Capacity

Studio may classify capacity internally as:

- `comfortable`
- `tight`
- `overflow`

Capacity handling must remain non-destructive.

Never silently:

- clip authored content;
- shrink primary typography;
- remove content;
- move protected anchors;
- write free geometry to `.nls`.

When the finite grammar is exhausted, report capacity pressure instead of inventing another layout system.

---

# 6. Editorial Worlds

An Editorial World is a curated visual language, not a color theme.

Each World owns, as applicable:

- display and body typography;
- font authority;
- color language;
- graphic language;
- Curated Accents;
- Companion identity;
- image/asset expression;
- semantic surface expression.

The active World must not change semantic journey content.

## 6.1 White page rule

The physical page remains white / neutral-white.

World identity appears through:

- typography;
- accents;
- curated surfaces;
- signets;
- Companion;
- imagery.

Do not tint the whole page merely to make a World “more visible”.

## 6.2 Typography authority

Fonts are part of the Editorial World contract.

Do not:

- replace them with renderer-specific fallback fonts;
- silently substitute unavailable fonts;
- synthesize missing weights without explicit approval;
- redefine typography in a PDF/export subsystem.

If an export path cannot faithfully load the World fonts, it must fail or report the problem; it must not reinterpret the layout.

## 6.3 Destination Interest Pages

Interest Pages inherit the complete active World Expression.

Current curated archetypes are:

- Fotografie
- Wandern & Natur
- Kultur & Geschichte
- Kulinarik & Lokal

Do not create unlimited user-defined archetypes or independent mini-themes.

---

# 7. Travel Language and finite visual vocabulary

Prefer semantic, human wording over technical naming.

Northern Lines intentionally uses a finite visual vocabulary.

Do not grow an uncontrolled asset or template library.

Assets should have semantic roles such as:

- Tipp
- Wichtig
- Fotospot
- Wissen
- Souvenir

Where a signet and a subtle surface are enough, do not add borders, ornamental cards, decorative frames, badges, or additional chrome.

Primary photographic imagery should remain the main source of visual color.

---

# 8. `.nls` project contract

`.nls` stores semantic project/editorial state, not arbitrary page geometry.

Never persist free layout coordinates merely because a renderer needs them.

Do not repurpose existing fields for unrelated content.

New semantic concepts require explicit schema approval and migration behavior.

Migrations must not invent editorial content.

Stable IDs and existing project semantics are not to be rewritten for convenience.

Page count is variable and must never be a renderer assumption.

---

# 9. Studio / Publisher boundary

Northern Lines Publisher remains an independent product and may provide useful production infrastructure.

For **Studio-originated pages**, authority is:

```text
Studio resolved page
      ↓
proof/export contract
      ↓
optional downstream production infrastructure
```

The downstream system must conform to the resolved Studio page.

It must not re-compose the page using a second interpretation of the same content.

## 9.1 Publisher capabilities that may later be reused

Potentially reusable concepts/infrastructure include:

- deterministic validation reports;
- stable error codes;
- CLI structure;
- asset registries;
- asset staging;
- SHA-256 manifests;
- render/build contracts;
- connector separation;
- deterministic build philosophy;
- font validation/preflight concepts;
- Affinity build planning;
- renderer-independent domain layers.

Reuse is allowed only when it does not violate Studio authority.

## 9.2 Publisher functions that must not override Studio

Do not apply Publisher's independent Page Composition Model, template/region geometry, Content Fit heuristics, or typography registry to reconstruct an already-resolved Studio page.

For Studio-originated proof/export:

- Studio owns visual composition;
- Studio owns World typography;
- Studio owns protected zones;
- Studio owns page geometry;
- downstream tooling may validate, stage, hash, package, render, or preflight **the resolved Studio result**.

Historical ADRs that describe “Publisher-owned final geometry” are superseded for the Studio-originated page path by the current Golden Build 040 authority.

Do not edit historical ADRs casually. Record a superseding decision in a new current ADR when required.

---

# 10. Current macOS PDF-proof contract

The immediate product need is **visual PDF proof**, not production/prepress output.

The active proof implementation is macOS-only for the current development phase.

## 10.1 Proven evidence

The following has been demonstrated in real-world testing:

1. The earlier `window.print()` / system-print path could transport the resolved Studio page.
2. Exact print color adjustment improved color fidelity.
3. The system-print path did not reliably enforce A5 and produced A4 output.
4. That system-print path is therefore not the authoritative deterministic proof architecture.
5. The newer native macOS WebView PDF path successfully produced a PDF from the resolved Studio page.
6. The generated PDF used DIN A5 physical page geometry.
7. The generated A5 proof visually preserved the known Photography Workshop composition sufficiently to continue the PoC.
8. The current remaining observed defect is a **false failure/completion signal**: Studio may display `PDF_PROOF_RENDER_FAILED: PDF-Proof-Erzeugung hat zu lange gedauert.` even though the PDF was successfully produced.

Do not return to blind `@page`, system-print, or CSS paper-size experimentation unless explicitly instructed.

Do not replace the proven native macOS PDF architecture merely to fix completion signaling.

## 10.2 Current PDF-proof target

Required:

```text
resolved Studio page
→ temporary proof/capture state if required
→ minimal proof request
→ Tauri/Rust boundary
→ native macOS WebView PDF generation
→ exact A5 PDF
→ validation
→ explicit success/failure result
```

The exporter reproduces what Studio already decided.

## 10.3 Physical PDF requirement

The PDF must represent:

```text
DIN A5
148 × 210 mm
≈ 419.527559055 × 595.275590551 pt
```

A small numeric tolerance is allowed only for PDF numeric serialization/validation.

It is **not** layout tolerance.

A4 output is a FAIL.

Silent fallback to another page size is forbidden.

## 10.4 Capture/proof state

A temporary proof/capture mode may exist only to prepare the already-resolved Studio page for native PDF capture.

It must not:

- create a second composition model;
- recompute editorial layout differently;
- move title, hero, content, Companion, footer, or safe zones;
- change World typography;
- change authored content;
- introduce content scaling;
- introduce fit-to-page;
- clone the page into a second independently styled renderer unless explicitly approved.

If proof-only UI chrome is hidden, that is acceptable.

The proof state must restore Studio reliably after success or failure.

## 10.5 Completion and timeout semantics

The native PDF lifecycle must be deterministic and truthful.

A successful file creation must not be reported as a render failure.

Required conceptual lifecycle:

```text
IDLE
→ PREPARING
→ RENDERING
→ WRITING / VALIDATING
→ SUCCESS
```

or:

```text
→ FAILURE
```

Success must be coupled to the actual native operation result and required validation.

A timeout may exist only as protection against a genuine stuck operation.

Forbidden:

- arbitrary timeout increases used to hide a lifecycle bug;
- timeout winning after a completed successful export;
- reporting `PDF_PROOF_RENDER_FAILED` when a valid PDF has already been produced;
- swallowed native errors;
- success before required validation completes.

The current false timeout must be investigated at its root cause before further PDF-proof expansion.

## 10.6 Stable errors

Meaningful proof failures must remain auditable.

Use stable error identifiers such as:

```text
PDF_PROOF_NO_PAGE
PDF_PROOF_FONT_NOT_READY
PDF_PROOF_ASSET_NOT_READY
PDF_PROOF_RENDER_FAILED
PDF_PROOF_WRITE_FAILED
PDF_PROOF_PAGE_SIZE_INVALID
```

Adjustments are allowed only when the existing error model is demonstrably insufficient and the decision is documented.

Errors shown to the user should remain understandable and actionable.

---

# 11. macOS implementation discipline

For native PDF work:

1. Inspect the exact Tauri/Wry/WebKit versions in the repository.
2. Inspect the actual Rust/native adapter implementation.
3. Trace asynchronous native completion explicitly.
4. Distinguish rendering completion, file writing, validation, and frontend acknowledgement.
5. Do not infer success from elapsed time.
6. Do not infer failure solely from a UI timeout if native work can still complete.
7. Prefer one explicit result contract across the Tauri boundary.

macOS-specific APIs are acceptable for the active scope.

Do not introduce a second browser runtime such as Playwright/Puppeteer/Chromium unless the user explicitly reopens the architecture decision.

Do not add PDF post-processing merely to hide incorrect rendering.

---

# 12. Research discipline

For framework/runtime/export tasks, do not implement from assumptions.

Before code:

1. Inspect the actual repository and dependency versions.
2. Inspect the relevant framework source/docs for those versions.
3. Trace the existing implementation end-to-end.
4. Identify the exact failure mode.
5. Identify testability.
6. Explain why the chosen correction is simpler and more robust than alternatives.

Avoid trial-and-error patch chains.

A failed architectural assumption should trigger re-evaluation, not another stack of patches.

For the current false timeout issue, research must trace:

```text
Studio action
→ frontend proof state
→ Tauri invoke
→ Rust command
→ native WebView PDF callback/future
→ PDF bytes/file write
→ MediaBox validation
→ Rust result
→ frontend result
→ proof state restoration
```

Identify exactly where success and timeout race.

---

# 13. Change discipline

## 13.1 Studio contracts are protected

Do not change these merely to make a task easier:

- Product DNA
- Golden Build 040 geometry
- Editorial World contracts
- fonts
- protected zones
- Travel Language
- layout grammar
- `.nls` semantics
- Companion rules
- footer rules

If the task appears to require such a change, stop and explain why.

## 13.2 Proven macOS PDF path is protected

Until explicitly reopened, do not replace:

- resolved Studio page as authority;
- existing native macOS WebView PDF approach;
- exact A5 requirement;
- current minimal proof request boundary.

The current task is stabilization, not another renderer experiment.

## 13.3 Minimal diff

Prefer the smallest coherent implementation.

Do not introduce:

- a new subsystem when one function suffices;
- a second test framework;
- a second rendering engine without an explicitly approved architectural need;
- speculative abstractions;
- unused dependencies;
- Windows abstractions for deferred work;
- compatibility layers for hypothetical future requirements.

## 13.4 No autonomous cleanup outside scope

Do not refactor unrelated code while implementing a focused task.

Do not “modernize” surrounding code unless it blocks the approved task and is documented.

Do not run broad formatting operations that create unrelated diffs.

If `cargo fmt --check` fails because of pre-existing formatting drift, document it. Do not reformat unrelated historical code without approval.

---

# 14. Review protocol

When explicitly asked to perform a **code review**, the first review phase is strictly read-only.

During that phase:

- no fixes;
- no commits;
- no branch changes;
- no repository writes;
- no autonomous cleanup.

The result is a `REVIEW.md` or explicitly requested equivalent with auditable findings.

Every finding must have:

- stable ID;
- category;
- severity/priority;
- confidence;
- affected files/code;
- observation;
- rationale/risk;
- recommendation;
- status.

Subsequent decisions must record whether each finding is accepted, rejected, deferred, or resolved.

Do not silently fix review findings before approval.

---

# 15. Build and delivery quality contract

A build must not be described as green unless the applicable quality gate has passed.

Agent-side pre-delivery checks should include all checks available in the current environment.

The user's local toolchain remains the final local runtime/build gate when the agent environment cannot reproduce the macOS installation/runtime environment.

Canonical local gate from repository root:

```bash
pnpm check
pnpm test
pnpm consistency
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
git diff --check
```

If the repository contains a scoped PDF-proof consistency gate, run it before the cumulative gate.

macOS application build/install:

```bash
./scripts/install-macos-app.sh
```

Do not claim a command was run if it was not.

## 15.1 Rust test from repository root

Do not require:

```bash
cd src-tauri
cargo test
```

when the equivalent root command works:

```bash
cargo test --manifest-path src-tauri/Cargo.toml
```

Prefer root-relative quality commands in documentation.

## 15.2 Test architecture

Respect the repository's existing test environment.

Do not assume DOM globals exist in Node-based Vitest tests.

Do not add jsdom/happy-dom or another test runner merely to rescue a poorly shaped unit test.

Tests should reflect the actual responsibility boundary.

## 15.3 Runtime evidence is separate from automated gates

Automated PASS does not prove native macOS PDF behavior.

For PDF-proof changes, explicitly distinguish:

```text
automated gate        PASS / FAIL
macOS installed app   PASS / FAIL / NOT RUN
real PDF generated    PASS / FAIL / NOT RUN
physical A5 validated PASS / FAIL / NOT RUN
visual comparison     PASS / FAIL / NOT RUN
```

Do not collapse these into one generic “PASS”.

---

# 16. Branch / merge rule for PoCs

Experimental proof/export work must live on its own branch from the approved Golden Build unless explicitly promoted.

Do not merge a PoC to `main` until its current Definition of Done is proven.

If an experiment fails, prefer deleting/abandoning the branch rather than leaving experimental ballast in the long-lived repository.

Golden Build 040 remains the baseline for current PDF-proof development.

The abandoned earlier Print Core experiments must not be restored.

---

# 17. Current Definition of Done — macOS PDF proof

The current task is deliberately narrow:

> **Produce a reliable, truthful, exact-A5 PDF proof from the resolved Studio page on macOS.**

Required:

- exact physical A5 PDF;
- Studio composition remains authoritative;
- no content scaling;
- no fit-to-page;
- no second layout model;
- World font fidelity;
- useful color fidelity for editorial proof;
- protected zones unchanged;
- Companion unchanged;
- footer unchanged;
- safe zones unchanged;
- PDF is actually written;
- successful PDF generation is reported as success;
- failed PDF generation is reported as failure;
- no false timeout after successful generation;
- Studio returns cleanly from proof/capture mode;
- automated gates pass;
- installed macOS real-world test passes.

Not required for the current Definition of Done:

- Windows implementation;
- Windows adapter;
- Windows runtime test;
- whole-book batch export;
- production/prepress PDF;
- bleed/crop marks;
- imposition;
- printer profiles;
- Publisher integration;
- Affinity automation.

Do not expand scope until explicitly instructed.

---

# 18. Current immediate task priority

The current known defect is:

```text
PDF_PROOF_RENDER_FAILED:
PDF-Proof-Erzeugung hat zu lange gedauert.
```

observed even though the requested PDF was successfully generated.

The immediate engineering priority is:

1. reproduce/trace the completion lifecycle;
2. identify the exact source of the false timeout;
3. determine whether the native operation completed but acknowledgement was delayed/lost;
4. correct the lifecycle rather than masking it;
5. add regression coverage;
6. rerun all gates;
7. repeat installed macOS proof generation.

Do not modify the proven PDF rendering architecture unless the root-cause analysis proves that it is itself responsible.

Do not implement Windows while this task is active.

---

# 19. Deliverables for implementation work

For a focused build/PoC, provide:

- implementation;
- scoped consistency gate where useful;
- tests;
- concise architecture/decision note;
- clear local commands;
- explicit Definition of Done;
- exact list of changed files;
- actual gate results;
- explicit runtime evidence still required.

When delivering a drop-in, also provide `APPLY-DROPIN.md`.

Do not make the user manually repair generated source files.

If a correction is required, provide the corrected file/package.

---

# 20. Documentation discipline

Documentation must distinguish:

- current binding contracts;
- current evidence;
- historical experiments;
- deferred work.

Do not rewrite historical ADRs merely because a newer decision supersedes them.

Where necessary, add a new ADR that explicitly supersedes the older decision.

Current PDF-proof documentation should make clear that:

- the old system-print/A4 result is historical evidence;
- native macOS WebView PDF is the active path;
- exact A5 has been demonstrated;
- false completion timeout remains the active defect until resolved;
- Windows is deferred.

Do not document deferred Windows behavior as implemented functionality.

---

# 21. Stop conditions

Stop and report instead of coding when:

- current checkout is not based on the approved Golden Build / approved PoC lineage;
- the requested change conflicts with Product DNA;
- the solution requires changing Golden Build 040 geometry;
- the solution moves protected zones, Companion, or footer;
- a framework assumption cannot be verified;
- a required World font would be substituted;
- the proposed export would scale or reflow Studio;
- the correction would require replacing the proven native macOS PDF architecture without explicit approval;
- the task begins expanding into Windows without explicit instruction;
- quality gates reveal an architectural contradiction;
- the native success/failure lifecycle cannot be determined reliably.

Northern Lines prefers a documented stop over an opaque workaround.

---

# 22. Final principles

> **Studio shows the journey, not the software.**

For layout:

> **Studio decides what the page is.**

For PDF proof:

> **The exporter reproduces Studio; it does not reinterpret Studio.**

For the current engineering phase:

> **macOS first. Make the proven path boring, deterministic and reliable.**
