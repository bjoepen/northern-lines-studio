# Build 041 — Curated Checklist

**Status:** APPROVED IMPLEMENTATION CONTRACT
**Baseline:** Golden Build 040 · Studio 0.40.0-alpha.1
**Branch:** `build/041-curated-checklist`

## Intent

Build 041 adds the Northern Lines **Checkliste** as a curated Travelbook unit. It is product-owned editorial content, not author input. The reference Travelbook supplies the editorial idea and source material; the current Studio / Editorial World grammar is the visual authority.

The build deliberately returns to visible editorial development after the proof/export work. It must not reopen the accepted PDF renderer, Document Proof or PDF/A architecture.

## Product contract

- The checklist is curated Studio content.
- There is no Inspector authoring for checklist items.
- There are no persisted checkbox states.
- There is no free checklist editor.
- There is no new generic page builder, card system or template system.
- The printed checkbox is a paper interaction: the traveller marks it by hand.
- Checklist content is identical in semantic meaning across Editorial Worlds.
- World Expression is derived from the active Editorial World.

## Publication order

The checklist is one semantic unit made from two consecutive pages:

```text
…
→ Checkliste · 1/2
→ Checkliste · 2/2
→ Notizen / Erinnerungen
→ Abschluss
```

The two checklist pages must remain adjacent in canonical Studio publication order and must appear immediately before Notes / Memories. Document Proof, Standard PDF and PDF/A-2b consume this canonical order; Build 041 adds no export-specific ordering mechanism.

## Curated content structure

### Checkliste · 1/2

Primary preparation page:

1. Reise & Dokumente
2. Fotografie
3. Kleidung & Persönliches

### Checkliste · 2/2

Practical completion page:

1. Unterwegs & Outdoor
2. Technik
3. Vor der Abreise
4. Die kleinen Dinge / Nicht vergessen

Exact wording may be editorially refined during implementation, but categories remain curated product content and are not stored as user-authored project data.

## Visual direction

The old reference page is **reference, not template**.

Build 041 follows current Northern Lines Studio:

- exact Golden Build 040 A5 physical page contract;
- white / neutral-white paper surface;
- calm editorial hierarchy;
- current World typography;
- World-derived accent and semantic surface roles;
- finite visual vocabulary;
- existing Footer contract;
- existing Companion contract and protected zone;
- no borders/cards merely to reproduce the historical Fieldbook;
- no typography shrinking to force all reference content onto one page.

The two-page split is intentional Content Fit, not overflow recovery.

### Page 1 rhythm

The first page establishes the unit with a clear `Checkliste` title, a short curated introductory line and three calm checklist groups. It should feel like preparation for departure, not a form.

### Page 2 rhythm

The second page continues the same unit without repeating a heavy opening composition. It carries the practical groups and ends with the small-things / do-not-forget material as a lighter closing gesture before Notes / Memories.

## Editorial World contract

The checklist must inherit the complete active World Expression.

### Fjord

Uses Fjord typography, accent roles, surfaces, graphic language and Companion behavior from the existing Fjord World contract.

### Ostsee / Baltic

Uses Baltic typography, accent roles, surfaces, graphic language and Companion behavior from the existing Baltic World contract.

Forbidden:

- Fjord-hardcoded colors on Baltic;
- Fjord-hardcoded fonts on Baltic;
- Fjord-only assets leaking into Baltic;
- a globally tinted page surface;
- checklist-specific mini-themes independent of Editorial World.

The page remains white / neutral-white in both Worlds.

## Four visual acceptance cases

Build 041 is not visually accepted until all four combinations have been inspected:

```text
Fjord  · Checkliste 1/2
Fjord  · Checkliste 2/2
Ostsee · Checkliste 1/2
Ostsee · Checkliste 2/2
```

A World leak is a FAIL.

## Architecture boundary

Prefer curated product resources and derived page behavior over new `.nls` authoring semantics. If page identity must be represented in the manifest for canonical ordering/rendering, store only the minimum stable semantic identity required by the existing Studio page model. Do not persist visual composition, World colors, typography, checkbox state or free geometry.

No changes are permitted to:

- Golden Build 040 geometry;
- accepted native macOS WKWebView proof path;
- Document Proof assembly architecture;
- PDF/A-2b post-processing architecture;
- Companion/Footer protected-zone contracts.

## Content Fit

**Content Fit before Composition** remains binding.

Do not rescue the checklist by:

- shrinking primary typography;
- clipping items;
- borrowing Companion/Footer space;
- collapsing unrelated categories into a generic catch-all box;
- reproducing the dense historical one-page layout.

The approved two-page unit exists precisely to preserve Northern Lines rhythm on A5.

## Scope exclusions

Build 041 does not add:

- editable checklist items;
- persisted ticks;
- custom categories;
- drag and drop;
- free positioning;
- new Editorial Worlds;
- new export renderer behavior;
- Windows work;
- Publisher production integration.

## Quality gate

Implementation must add a scoped Build 041 consistency gate and include it in the cumulative consistency gate where appropriate.

Required final local checks:

```bash
pnpm check
pnpm test
pnpm consistency
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
git diff --check
```

Installed macOS validation:

```bash
./scripts/install-macos-app.sh
```

Real-world visual validation must explicitly record the four World/page combinations above and confirm publication order immediately before Notes / Memories.

## Delivery contract

The completed build must be delivered as:

1. Full Repo
2. Drop-in containing only changed/new files
3. `APPLY-DROPIN.md`
4. GitHub workflow / local alignment instructions
5. scoped + cumulative Quality Gate instructions
6. explicit macOS installed-app visual validation steps

No build is called green merely because documentation or static checks pass.