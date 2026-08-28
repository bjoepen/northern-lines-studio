# Build 046B validation contract

Build 046B is valid only if all of the following hold after local apply:

- `App.svelte` resolves Companion layout via `requireCompanionLayout(editorialLayout.companionLayoutId)`.
- `App.svelte` contains no direct Fjord/Ostsee Companion layout import or World-specific Companion branch.
- A5 World CSS class is derived from `editorialWorld.id` and preserves existing `fjord-page` / `baltic-page` CSS contracts.
- Existing World CSS, Grammar and layout files remain untouched.
- `.nls` persistence remains byte-compatible unless the user explicitly edits project content through Studio.
- Fjord and Ostsee remain visual regression baselines.
