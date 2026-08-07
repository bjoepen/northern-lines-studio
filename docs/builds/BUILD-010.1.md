# Build 010.1 – Story Authoring Engineering Stabilization

## Purpose
Build 010.1 incorporates the first real-world findings from semantic story authoring into the official Studio source tree. It is a stabilization build, not a feature build.

## Corrections
1. **TypeScript strictness:** `authoring.test.ts` uses an explicit runtime guard before reading the persisted introduction entry.
2. **Runtime project path:** `App.svelte` captures the selected `.nls` directory as session state when a project is opened.
3. **Repeated-save resilience:** the runtime path is reattached after every save response, preventing a second save in the same session from losing the path.
4. **Build-009 migration fixture:** Rust test data for project format `0.4.0` now reflects the schema that already used `editorialWorldId`.
5. **Regression diagnostics:** Build-009 migration validation now reports the actual validation error if normalization regresses.

## Versioning
- Studio: `0.10.1`
- `.nls` project format: `0.5.0` (unchanged)

## Scope control
No new authoring component, layout capability, toolbar, Publisher integration or Editorial World is introduced.
