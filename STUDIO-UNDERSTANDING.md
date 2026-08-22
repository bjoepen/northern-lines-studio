# Northern Lines Studio – System Understanding

**Prepared:** 2026-08-22
**Repository state analyzed:** branch `poc/studio-pdf-proof-001`, working tree includes uncommitted PDF-Proof PoC 001 changes on top of committed Build 040 ("A5 studio geometry", commit `a14aca4`)
**Method:** read-only repository analysis (docs, ADRs, ECRs, Rust backend, TypeScript/Svelte frontend, scripts, build history)

---

## 1. Scope

This document is the output of a first-pass **understanding audit**, not a code review. Its purpose is to demonstrate — for manual verification — that the product DNA, architecture, contracts, design principles, data models, workflow rules and technical boundaries of Northern Lines Studio have been reconstructed correctly from the repository.

It covers:

- product purpose and philosophy (`docs/VISION.md`, `docs/000-NORTHERN-LINES.md`, `docs/PRODUCT-DNA.md`)
- architecture decisions (`docs/adr/*`, `docs/ecr/*`, `docs/ARCHITECTURE.md`)
- Editorial World contracts (`docs/editorial-worlds/*`)
- the `.nls` project format and its full migration history (`docs/project-format.md`, `src-tauri/src/lib.rs`)
- the frontend domain model and layout grammar (`src/lib/**`, `src/App.svelte`)
- the Rust/Tauri backend (`src-tauri/src/lib.rs`, `Cargo.toml`, `tauri.conf.json`, `capabilities/default.json`)
- the build, drop-in and quality-gate process (`docs/engineering/*`, `APPLY-DROPIN.md`, `DROP-IN-MANIFEST.md`, `scripts/check-*.mjs`, `package.json`)
- a sample of the build/validation/git-workflow document triads (`docs/builds/*`, `docs/validation/*`, `docs/git/*`)

It does **not** cover Northern Lines Publisher (no Publisher source exists in this repository), does not evaluate code quality, and does not produce prioritized findings.

## 2. Read-only Statement

This analysis was performed without modifying any existing repository file. The only file created is this one, `STUDIO-UNDERSTANDING.md`, placed at the repository root alongside other top-level product references (`README.md`, `APPLY-DROPIN.md`, `DROP-IN-MANIFEST.md`). No commands with write side effects (formatters, `git add`, `git commit`, dependency installs/updates, `cargo fix`, build scripts that install to `/Applications`) were executed. `scripts/install-macos-app.sh` was read but not run.

## 3. Executive Understanding

Northern Lines Studio is the **authoring environment** of a three-part product family — Studio, Northern Lines Publisher, and Northern Lines Travel Fieldbooks — built to let a traveller turn a real journey into an A5 print travelbook without ever touching layout, coordinates, or DTP concepts. Studio owns the *editorial state* (what a page says, which images, which layout **effect** was chosen); Northern Lines Publisher — which does not exist in this repository, only as a described future boundary — owns the *publishing truth* (final geometry, typography enforcement, rendering, preflight). Studio deliberately does not become a second layout engine.

The product is built from a small, closed vocabulary rather than an open one: three destination "page effects" (**Weite**, **Bild links**, **Bild rechts**), six Extension Zone kinds (**Wissen, Fotospot, Tipp, Souvenir, Wichtig, Geschichte**), four Destination Interest archetypes (**Fotografie, Wandern & Natur, Kultur & Geschichte, Kulinarik & Lokal**), two currently released Editorial Worlds (**Fjord**, **Ostsee/Baltic**), and one Companion per World. All of this vocabulary is deliberately finite and is documented as a conscious rejection of an open template/asset marketplace.

Everything the user sees is expressed in "Travel Language" — a maintained mapping table between internal technical identifiers (`destination-hero-banner`, `EditorialWorldId`, `JourneyStage`, …) and traveller-facing words (**Weite**, **Reisewelt**, **Deine Route**, …). This separation is treated as architecture, not cosmetic copywriting, and is enforced by dedicated consistency gates.

The technical stack is Tauri v2 (Rust backend) + Svelte 5/TypeScript frontend, replacing an originally planned SwiftUI/AppKit shell (ADR‑001 → ADR‑002). The `.nls` project format is an open package (`project.json` + `content/pages/`) that has evolved through 15 documented schema migrations (0.1.0 → 0.16.0), all additive and non-destructive; the Rust layer is authoritative for schema validation and migration, the TypeScript layer mirrors the same domain shapes for the UI.

The single most load-bearing architectural idea, repeated verbatim across ADRs, ECRs, `PRODUCT-DNA.md`, `ARCHITECTURE.md` and `README.md`, is: **Studio may be internally complex; for the traveller it must feel self-evident.** ("Intern darf Northern Lines Studio komplex sein. Für den Reisenden muss es sich selbstverständlich anfühlen.")

## 4. Product Purpose

Northern Lines is presented explicitly as *not* a software product first: **"Northern Lines ist keine Software. Northern Lines ist eine Art, Reisen zu erleben und Geschichten zu erzählen."** (Evidence: `docs/000-NORTHERN-LINES.md:3-5`.) The three pillars are Studio ("Die Arbeitsumgebung… kennt Menschen, nicht Render-Jobs"), Publisher ("Die Engine… kennt keine Reisen. Publisher kennt Regeln."), and Travel Fieldbooks ("Das Ergebnis"). Evidence: `docs/000-NORTHERN-LINES.md:44-73`.

Studio's product promise (`docs/VISION.md:11-23`) is to preserve *atmosphere, anticipation, place-based storytelling, photographic intention, editorial rhythm, functional travel information, personal memories* — while the author "should not have to think about the technical machinery that makes this possible." The authoring principle is explicit: **"Authors work on meaning, never on generic page objects."** (`docs/VISION.md:37`). Confidence: HIGH — this is stated, not inferred, and is reinforced almost verbatim by ADR‑008 (Semantic Story Authoring) and ADR‑006 (Editorial Layer Model).

Studio is explicitly bounded away from: an Affinity/InDesign replacement, a free layout designer, a CMS, a database editor, a form system, a technical publishing frontend (`docs/PRODUCT-DNA.md:59-91`). The traveller should never work with x/y coordinates, free text frames, arbitrary grid definitions, freely movable elements, manual box geometry, hundreds of templates, layout macros, technical IDs, asset IDs, manifests, or internal `JourneyStage` vocabulary (`docs/PRODUCT-DNA.md:73-85`).

The one-sentence product principle: **"Wenige starke Möglichkeiten. Viele persönliche Geschichten."** ("Few strong possibilities. Many personal stories.") — `docs/PRODUCT-DNA.md:97`. A feature is evaluated not by "which technical options can we still show" but "which decision does the traveller actually need to make here" (`docs/PRODUCT-DNA.md:103-109`).

## 5. Product DNA

`docs/PRODUCT-DNA.md` (70KB, ~2,121 lines) is explicitly declared a **binding, permanent reference**, not a retrospective ("Die Produkt-DNA ist ab Build 021 keine Retrospektive am Rand, sondern eine dauerhafte Referenz." — `README.md:63`). It is checked against every subsequent build's UX/product decisions.

Note on the term **"Klarheit" ("clarity")**: this exact term does not literally occur anywhere in the repository (verified via case-insensitive full-text search across all `.md`/`.ts`/`.svelte` files — zero hits). See §28, U‑001. The closest reconstructable equivalent is a *cluster* of concrete, named principles rather than one named pillar:

- **Weißraum ist bewusst, aber nicht verschenkt** ("Whitespace is intentional, not wasted") — whitespace exists for calm, hierarchy, quality, readability, focus, but must not be squandered on A5 if it displaces real editorial content (`docs/PRODUCT-DNA.md:619-636, 1381-1398`).
- **Sichtbarkeit ist nicht gleich Datenbestand** ("Visibility is not the same as data existing") — a rich data model does not imply a rich UI; not every stored field must always be shown (`docs/PRODUCT-DNA.md:222-256`).
- **Keine Funktion sichtbar machen, nur weil sie existiert** (§29) and **Keine semantische Zweckentfremdung** (§30, existing domain fields may never be repurposed for an unrelated meaning) are treated as concrete, testable UI/data-model rules derived from this "calm surface over rich model" idea.
- **Travel Language** (§5 of the DNA doc, detailed in §16 below) is the concrete UI-language rule derived from the same underlying idea: the interface must not explain how Studio is organized internally.

Confidence: MEDIUM-HIGH that this cluster is the intended referent of "clarity" as used in the audit brief — the underlying idea (hide internal complexity, keep the surface calm and selective) is unambiguous and heavily evidenced; the specific German/English word "Klarheit"/"clarity" as a named section is not present.

The central maxim, repeated at least four times across different documents in near-identical wording: **"Intern darf Northern Lines Studio komplex sein. Für den Reisenden muss es sich selbstverständlich anfühlen."** Evidence: `docs/PRODUCT-DNA.md:34`, echoed in `docs/ARCHITECTURE.md:1`, and closing thought `docs/PRODUCT-DNA.md:1550`. Confidence: HIGH.

### 5.1 Studio is explicitly not a CMS

`docs/PRODUCT-DNA.md` §49 ("Was niemals passieren soll") lists exactly what Studio must never become: **CMS** ("Alle Felder permanent sichtbar"), **Datenbankeditor** ("Strukturen dominieren die Sprache"), **DTP light** ("Nutzer verschieben Kästchen"), **Template-Marktplatz** ("Dutzende Varianten ohne klare Editorial World"), **Entwickleroberfläche** ("Interne IDs und Grammars erklären sich selbst"), **Feature-Sammlung** ("Funktionen werden sichtbar, nur weil sie gebaut wurden"). Evidence: `docs/PRODUCT-DNA.md:1290-1318`. This is reinforced concretely in ECR‑020, which records a real regression and its fix: *"Der Destination Inspector wirkte wie ein CMS-/Datenbankeditor"* was explicitly diagnosed and corrected by introducing **Ortsprofil** language, visual layout thumbnails instead of technical radio-button lists, and removing raw World/Layout/Grammar technical cards from the primary workflow (`docs/ecr/ECR-020-DESTINATION-PROFILE-LAYOUT-VARIANTS.md`). Confidence: HIGH — this is a documented real correction, not an aspiration.

Instead, Studio is meant to feel like **"ein ruhiger Schreibtisch für eine bevorstehende Reise"** ("a calm desk for an upcoming journey") — `docs/PRODUCT-DNA.md:1320-1337`.

## 6. Core Design Principles

These are the recurring, cross-cutting rules gathered from `PRODUCT-DNA.md` §56 ("Die wichtigsten unverhandelbaren Regeln"), reinforced by ADRs/ECRs:

| # | Principle | Evidence |
|---|---|---|
| 1 | Travelbook before technology; traveller before data model | `PRODUCT-DNA.md:1454-1461` |
| 2 | Few strong possibilities, no free DTP logic | ditto |
| 3 | Travel Language everywhere in the UI | ADR‑009, ADR‑011 |
| 4 | Technical complexity stays internal | `PRODUCT-DNA.md:32-56` |
| 5 | Semantic decisions are persisted, never final coordinates | ADR‑018, ADR‑020, `project-format.md` |
| 6 | Publisher remains the publishing truth; Studio owns no second layout engine | ADR‑018, `PRODUCT-DNA.md:433-471` |
| 7 | No repurposing of existing domain fields for a different meaning | ECR‑020, `PRODUCT-DNA.md:835-848` |
| 8 | No schema change without a genuine domain reason | `PRODUCT-DNA.md §56` |
| 9 | Full development chain discipline: **Model → Rust → Migration → Command → Inspector → Preview → Tests** | `PRODUCT-DNA.md:875-877`, `README.md:283-297` |
| 10 | No regression; build-scope discipline; no scope erosion ("nicht, weil wir schon dabei sind") | `PRODUCT-DNA.md §31-32` |
| 11 | Documentation is part of the build, not follow-up work | `PRODUCT-DNA.md §36` |
| 12 | Real-world validation beyond green tests (open → edit → save → close → reopen → verify) | `PRODUCT-DNA.md §37`, `ENGINEERING-STANDARD.md:34-36` |

Confidence: HIGH — this table is a direct transcription of an explicit "non-negotiable rules" section, not an inference.

A named, humorous but explicitly product-serious heuristic exists for deciding what Studio should automate away from the user: the **"Knigge"-Test** — *"Brauchen wir dafür eine neue Ausgabe des Knigge?"* ("Would we need a new edition of Emily Post's etiquette guide for this?"), used e.g. to justify automatically appending "Uhr" to clock values rather than asking the user to type it (`docs/PRODUCT-DNA.md:1430-1449`). Confidence: HIGH.

## 7. Layout Grammar

Northern Lines Studio treats page zones as **semantically separated layout regions**, not free canvas space. The canonical statement, repeated verbatim in two places (`docs/PRODUCT-DNA.md:1643` and `:1699`):

> **"Hero Zone und Title Zone sind Geschwister, keine Mitbewohner. Sie dürfen sich nicht dasselbe Zimmer teilen."**
> ("Hero Zone and Title Zone are siblings, not roommates. They may not share the same room.")

**Interpretation (Confidence: HIGH, directly evidenced):** "Siblings" means Hero and Title are two structurally distinct, non-overlapping layout regions that both belong to the same page family and sit adjacent to one another — but neither may render *inside* the other's space, borrow its typography, or let its content bleed across the boundary. Concretely for the **Weite** effect: the Hero Zone owns a grammar-defined height corridor; the chosen image is composed with `contain` inside that corridor and may not grow beyond it; only *after* a separate protected "quiet zone" does the Title Zone begin with the place name (`REISEZIEL`) (`docs/PRODUCT-DNA.md:1653`, `ARCHITECTURE.md` Build 023 notes). This is explicitly generalized to *all* page elements ("Diese Zonenregel gilt analog für Bilder, Typografie, grafische Assets, Infoflächen…", `docs/PRODUCT-DNA.md:1701`) and to the Rust/CSS layer (`ADR‑019` Build 023 clarification: "semantic page zones do not visually overlap unless a documented Layout Grammar exception exists").

### 7.1 Protected zones ("Safe Areas")

| Zone | Rule | Evidence |
|---|---|---|
| Binding Safe Area | Technical minimum inset on the left (page-binding edge); currently **15 mm**; earlier ADR‑019 stated 17 mm and was explicitly corrected to 15 mm by ADR‑020 ("Physical layout correction") | `ADR-019`, `ADR-020`, `PRODUCT-DNA.md:526-547` |
| Title Safe Area | The place name leads; the subline/intro must never visually intrude on it — **"Der Ort spricht zuerst. Der Satz begleitet."** | `PRODUCT-DNA.md:599-617` |
| Companion Safe Area | See §8 | `ADR-019`, `PRODUCT-DNA.md §18` |
| Footer Safe Area | Footer, Companion, page number never move between Weite/Bild links/Bild rechts | `PRODUCT-DNA.md §19` |

### 7.2 Adaptive composition, not free geometry

The Layout Grammar chooses **within a finite, curated set of composition states**, never freely: for the Title Zone of *Weite*, short names get a balanced 50/50 split; longer names get 60/40 or 70/30; if that's still not enough, the intro wraps below the title block; place names are never hyphenated mid-word; type is never secretly shrunk to force a fit (`docs/PRODUCT-DNA.md:1708-1732`, codified in `src/lib/layout/capacity.ts::destinationTitleComposition`). Editorial module groups (Reasons/Highlights/Practical Info) may render as **one, two, or three columns** depending on content (ADR‑019, ADR‑023). Extension Zones follow the same finite-candidate logic: balanced, asymmetric (wide-first/wide-second), or stacked (`src/lib/layout/capacity.ts::destinationExtensionComposition`).

Since Build 030 (ADR‑030 "Content Fit before Composition"), this is elevated to a **global rule for every page type**, not just Destinations: Studio must evaluate the *complete* allowed candidate set for a page against real content before choosing a composition; a candidate that requires clipping, arbitrary scaling, overflow beyond its surface, or borrowing Companion/Footer space is invalid. The named rule: **"Content Fit entscheidet über die Komposition. Nicht sammeln, sondern erzählen."** ("Content Fit decides the composition. Don't collect, narrate.") — `docs/ARCHITECTURE.md:180-188`, `docs/PRODUCT-DNA.md:1894-1926`. Confidence: HIGH.

## 8. Companion Model

The Companion (Fjord: **Papageientaucher**/Puffin; Ostsee: **Fischotter**/Otter) is part of the **Editorial Frame** — the persistent page identity layer alongside Header, Footer and page number — not a freely placed decoration (ADR‑006, `docs/ARCHITECTURE.md:70-96`).

**"Der Begleiter ist unantastbar – und sein Raum ebenfalls."** ("The companion is untouchable — and so is its space.") — stated verbatim at `docs/PRODUCT-DNA.md:567`, repeated in `README.md:152,168` and `docs/builds/BUILD-021.md:9`. Confidence: HIGH, load-bearing, repeated across at least 4 independent files.

The Editorial World Contract states the layout-mechanical version of the same rule: **"Der Companion nimmt nicht am Layout teil. Das Layout nimmt Rücksicht auf den Companion."** ("The Companion does not participate in the layout. The layout accommodates the Companion.") — `docs/editorial-worlds/EDITORIAL-WORLD-CONTRACT.md:25`, also `docs/PRODUCT-DNA.md:1703`. **Interpretation:** the Companion is not a layout participant that competes for space with content modules; it occupies a fixed, protected reservation (Fjord: `bottom-left`, small, standard pose, no mirroring, first appearance from the Journey Planning page onward — `src/lib/companions/layout.ts::fjordCompanionLayout`), and every other layout decision (extension stacking, content-fit compression, capacity overflow) must yield space around that reservation rather than push into it. If a module grows, "Nicht der Companion [weicht]" — the module must adapt, not the Companion (`PRODUCT-DNA.md:569-576`).

**On the requested phrase "Kuscheln erlaubt, jeder im eigenen Bett":** this exact phrase does not occur in the repository (see §28, U‑002). The closest actual quote, in a *different and narrower* context (the Curated Hero image's relationship to body text, not the Companion generally), is:

> **"Das Hero darf mit dem Text kuscheln. Es zieht nicht das Mobiliar der Seite auf seine Seite."**
> ("The Hero may cuddle with the text. It does not pull the page's furniture onto its side.")
> Evidence: `docs/editorial-worlds/FJORD-CURATED-HERO-CONTRACT.md:45`.

**Interpretation of the actual quote (Confidence: HIGH for the quote's existence and literal meaning; MEDIUM for whether this is "the" principle the audit brief intended):** a Curated Hero image may sit close to and let text wrap beside/below it (visual proximity, "cuddling") — but it may never displace or resize a page's other structural elements (2×2 workshop modules, Interest modules, Companion, Footer) to make room for itself. It is the Hero-specific instance of the same broader idea also expressed for the Companion ("layout accommodates the protected element, not vice versa") and for zone separation generally — i.e. elements may sit *next to* each other, and even lean into each other's margin ("cuddle"), but each protected element keeps its own inviolable footprint ("its own bed"). This generalizes the "siblings, not roommates" rule from §7: adjacency and visual warmth are fine; structural intrusion is not.

## 9. Editorial Worlds

An Editorial World is explicitly and repeatedly defined as **not a color palette**:

> **"Eine Editorial World ist keine Farbpalette. Sie ist eine kuratierte visuelle Sprache aus Typografie, Rhythmus, Bildsprache, Akzenten, Companion und wenigen charakteristischen Assets."**
> Evidence: `docs/editorial-worlds/EDITORIAL-WORLD-CONTRACT.md:5`, restated `docs/PRODUCT-DNA.md:1746`.

The contract defines five **binding layers** (`EDITORIAL-WORLD-CONTRACT.md:7-13`):

1. Typography
2. Color Language
3. Graphic Language
4. Companion Language
5. Image & Asset Language

**Shared vs. World-specific split:** Semantics (extension kinds, layout grammar, safe zones, destination fields, interest kinds) are **shared/world-independent**; a World supplies **expression** only — typography, palette, companion, weighting of extension surfaces (`EDITORIAL-WORLD-CONTRACT.md:15-19`, ADR‑025B). Signets carry stable cross-World meaning: **"Das Signet sagt, was es ist. Die Farbe sagt, zu welcher Welt es gehört."** World switching must never alter travel content, IDs, image roles, or page effects (`EDITORIAL-WORLD-CONTRACT.md:28`).

**World Assets** are explicitly finite and curated, not a growing library: *"Es gibt keine frei wachsende Asset-Bibliothek. Reiseinhalt wie Ortsfotos oder QR-Ziele gehört nicht zur World."* (`EDITORIAL-WORLD-CONTRACT.md:30-32`).

### 9.1 Fjord vs. Ostsee — same contract shape, different expression

| | Fjord (Reference World 001) | Ostsee/Baltic (Editorial World 002) |
|---|---|---|
| Status in code | `status: 'reference'` | `status: 'editorial'` |
| Character | calm, spacious, nordic, photographic, reflective | light, coastal, hanseatic, summer-calm, open |
| Companion | Papageientaucher (`fjord-puffin`) | Fischotter (`baltic-otter`) |
| Typography | classical serif throughout | humanist sans for titles, editorial serif for body |
| Palette | Fjord-dark ink, cool Fjord-blue accent | Baltic `#0D3B5B`, Steel `#457B8D`, Fog `#B9D3DC`, Sand `#DED8CB`, Amber `#D08A2E` |
| Page surface | neutral-white / literal `#FFFFFF` | neutral-white / literal `#FFFFFF` |

Evidence: `docs/editorial-worlds/FJORD.md`, `docs/editorial-worlds/OSTSEE.md`, `src/lib/worlds/fjord/world.ts`, `src/lib/worlds/baltic/world.ts`, `src/lib/layout/fjord.ts`. The World registry (`src/lib/worlds/index.ts`) confirms only these two are loadable; the Companion registry (`src/lib/companions/registry.ts`) additionally lists five **planned** (not yet active) World/Companion pairs — `britain-red-grouse` (Moorhuhn), `woodland-badger` (Dachs), `iberian-lynx`, `canary-gecko` (explicitly `alphaTransparencyReady: false`, matching `docs/design/COMPANION-GUIDE.md:29`'s note that the Canary Gecko source needs re-cutout before production), `arctic-walrus` — and one **candidate** with no assigned World (`candidate-squirrel`, `editorialWorldId: null`). This directly confirms ADR‑007's distinction between *active*, *planned*, and *unassigned/candidate* Companion concepts, and that "a source image exists" ≠ "production ready." Confidence: HIGH (code-confirmed).

The Fjord↔Ostsee switch (Build 025B/025C) is explicitly framed as the architectural proof that Worlds are real product architecture, not theme skinning: **"Gleiche Sprache. Andere Welt."** (`docs/PRODUCT-DNA.md:1772`).

## 10. World Expression

The base page is explicitly kept neutral: **"Die Grundseite bleibt neutral-weiß"** (Ostsee doc), and as of Build 034 this is enforced as *literal* `#FFFFFF`, not a "warm white"/cream approximation: **"World Expression colours content surfaces. The physical editorial page remains white."** Historical cream values (`#fffdfa`, `#f8f7f3`) are explicitly declared invalid paper surfaces, and a dedicated gate checks this (`docs/PRODUCT-DNA.md:2055-2070`, confirmed in code: `fjordLayoutSystem.paperTone = '#ffffff'` in `src/lib/layout/fjord.ts:7`).

World Expression is instead applied through (evidenced across `docs/PRODUCT-DNA.md:1599-1622`, `EDITORIAL-WORLD-CONTRACT.md`, `ECR-025C`):

- **photography** as "the most important atmospheric colour source" — the image itself carries the World's mood
- **typography** (heading/body family, weight) — identity and hierarchy
- **accent colour** — a single World accent used selectively, not as a background
- **signets** — the six shared Extension-Zone icons, colored per World but semantically stable
- **selectively tinted editorial surfaces** — explicitly *not* a general "Card UI system": "Eine farbig hinterlegte Informationsfläche ist ein redaktioneller Akzent, kein neues Card-UI-System. Nicht jedes Inhaltsmodul wird automatisch in eine Box gesetzt."
- **the Companion and Footer** — recurring visual anchors
- **Curated Heroes / Curated Accents** — small, fixed, World-owned imagery for Interest Pages, the Photography Workshop, and the Contents/Notes utility pages (see §14)

**How the system guards against a World collapsing into "just a palette":** the Editorial World Contract makes the five-layer shape (Typography / Color / Graphic / Companion / Image-Asset Language) *mandatory* for every World, and ADR‑025B/ECR‑025B's entire purpose was to prove architecturally that a second World (Ostsee) requires typography, companion and graphic-language changes, not merely different accent hex values — with an explicit non-goal of "freie Theme-Konfiguration" (free theme configuration) or an asset browser (`ECR-025B-OSTSEE-EDITORIAL-WORLD-POC.md`). Confidence: HIGH.

## 11. Destination Model

The `Destination` entity (Rust `struct Destination`, `src-tauri/src/lib.rs:160-181`; mirrored TypeScript `interface Destination`, `src/lib/project.ts:119-133`) is a first-class, ID-stable object referenced by (not embedded in) a `JourneyStage`:

| Field | Structural / Editorial | Notes |
|---|---|---|
| `id` (`destinationId`) | Structural, stable | Referenced by `JourneyStage.destinationId`; must be unique; validated in Rust (`validate_project`) |
| `name` | Structural | Required, non-empty |
| `subtitle` | Editorial (free text) | "Ein Satz für diesen Ort" |
| `introduction` | Editorial (free text) | — |
| `journeyContext { arrival, departure, timezone }` | Editorial, semantic strings | Arrival/departure stay as strings; "Uhr" is a *display*-time convenience, never stored (`docs/PRODUCT-DNA.md:741-770`, `docs/project-format.md:112-116`) |
| `reasons: string[]` | Editorial | Free list |
| `highlights: {id, name, description, category}[]` | Editorial, ID-stable per item | category is a closed enum: landmark/viewpoint/architecture/nature/culture/photography/other |
| `practicalInfo: {id, title, text}[]` | Editorial, ID-stable per item | — |
| `editorialExtensions: {id, kind, title, text}[]` | Editorial, semantic | `kind` is a closed six-value enum (§13) |
| `images: {wide?, portrait?, left?, right? (compat only)}` | Structural (paths) | Project-relative; must live under `assets/destinations/`; no crop/focal-point/x-y data ever stored |
| `editorial.layoutVariant` | Structural, closed enum | One of exactly `destination-hero-banner`/`-left`/`-right` |
| `interestEntries` | Lives on the `destination_interest` **page**, not on Destination itself | See §12 |

**Journey ↔ Destination relationship:** a `JourneyStage` (`kind: 'destination'`) carries a `destinationId` reference; the Destination Profile itself lives in a separate top-level `destinations[]` array. Rust validation enforces referential integrity both ways (every `destination`-kind stage must resolve to an existing Destination Profile; every Destination `id` must be unique) — `src-tauri/src/lib.rs:751-770`. This two-object split (Journey Stage = route position/identity; Destination Profile = place content) was itself a deliberate architectural step (ADR‑003 → ADR builds toward ADR‑020/ECR‑020), motivated by keeping the Destination "not a page but a redaktionelles Objekt" (`docs/PRODUCT-DNA.md:330-332`). Confidence: HIGH, fully code-confirmed on both the Rust and TypeScript sides with identical shapes.

Layout-variant change is explicitly non-destructive: switching Weite/Bild links/Bild rechts must never alter title, subtitle, intro, reasons, highlights, practical info, images, order, Companion, Footer or page number — this is a "verbindlicher Regressionstest" (`docs/PRODUCT-DNA.md:403-430`).

## 12. Interest Pages

A Destination is "the semantic centre of a place," not limited to one page. Optional `destination_interest` pages deepen a specific traveller interest while staying bound to the same `journeyStage` (ADR‑023, ECR‑026). Exactly **four** archetypes are supported in the current Foundation, and only one page per (destination, interest-kind) pair:

| Interest kind | Label | First fully developed in |
|---|---|---|
| `photography` | Fotografie | Build 027 (ADR‑027/ECR‑027) |
| `hiking_nature` | Wandern & Natur | Build 028 (ADR‑028/ECR‑028) |
| `culture_history` | Kultur & Geschichte (incl. museums, architecture, archaeological/historic sites) | Build 029 (ADR‑029/ECR‑029) |
| `culinary_local` | Kulinarik & Lokal | Build 030 (ADR‑030/ECR‑030) |

User-facing question: **"Was möchtest du in [Ort] erleben?"** — never "select an archetype" (`docs/PRODUCT-DNA.md:1789-1791`).

**Authoring model:** since Build 028 (ECR‑028‑INTEREST‑ENTRY‑AUTHORING), Interest Pages are authored as **repeatable structured entries**, not parallel free-text line lists — the earlier model made cross-field relationships ("line 2 of textarea A relates to line 2 of textarea B") implicit and fragile. Rule: **"Der Nutzer beschreibt den Eintrag. Studio komponiert die Darstellung."** Entry kinds: `photo_spot`, `hiking_route`, `culture_place`, `culinary_recommendation`, each with an archetype-specific `fields: Record<string,string>` map (Rust: `DestinationInterestEntry { id, kind, title, fields: BTreeMap<String,String> }`, `src-tauri/src/lib.rs:200-206`).

**World-inheritance — explicitly the FULL World Expression, not just typography:**

> **"Thematische Vertiefungsseiten übernehmen nicht nur die Typografie der aktiven Editorial World, sondern deren vollständige kuratierte Expression. Dazu gehören Akzentfarben, Signets, Meta-Typografie und gezielte Editorial-/Content-Flächen."**
> Evidence: `docs/PRODUCT-DNA.md:1796-1802` (section literally titled "Destination Interest Pages erben die vollständige World Expression"), reinforced by `EDITORIAL-WORLD-CONTRACT.md:34-36` and the README Build‑026 World Expression Polish note (`README.md:9`). Confidence: HIGH, explicit and repeated.

Interest Pages have one narrowly-scoped exception to the "never shrink type to fit" rule: a single defined `tight` compact-typography step, used only for secondary practice data (route/start/duration/difficulty and similar), never for titles or place names, and never as free/arbitrary scaling (`docs/PRODUCT-DNA.md:1816-1824, 1884-1890`).

## 13. Extension Zones

Six canonical, semantically stable roles (`docs/design/EDITORIAL-EXTENSION-ZONES.md:11-20`, mirrored in `src/lib/editorial-extensions/index.ts`):

| Kind | Purpose (German original) |
|---|---|
| `knowledge` (Wissen) | überraschender oder hilfreicher Fakt |
| `photo_spot` (Fotospot) | besonderer Ort für ein Bild |
| `tip` (Tipp) | persönliche Empfehlung für unterwegs |
| `souvenir` (Souvenir) | authentisches Mitbringsel oder regionale Besonderheit |
| `important` (Wichtig) | Hinweis mit erhöhter redaktioneller Priorität |
| `history` (Geschichte) | historischer Kontext zum Ort |

A single visual grammar: **"Das Signet sagt, was es ist. Die Farbe sagt, zu welcher Welt es gehört. Mehr muss die Box nicht erklären."** An extension consists of exactly three things — semantic signet, World-conformant surface color, editorial content — with no frames, no extra dividers, no ornaments, no redundant type labels (`docs/design/EDITORIAL-EXTENSION-ZONES.md:22-32`). Weighting (e.g. `Wichtig` reading more prominent than a casual `Tipp`) comes from surface *intensity* within the same World palette, not from different visual systems. Extensions are "Gäste der Destination Grammar" — guests, not owners — and must never displace Hero, Title, regular content, Companion, or Footer (`ADR-022`, `docs/design/EDITORIAL-EXTENSION-ZONES.md:34-38`).

Signets are explicitly shared and World-independent files (`public/design-library/signets/shared/`), not color-bound — confirming the shared-semantics/World-expression split from §9 at the asset-file level.

## 14. Finite Visual Vocabulary

The system is explicit about rejecting an open, growing asset library in favor of a small, semantically coupled vocabulary:

- **Signets**: exactly six, shared across all Worlds, colored per World (§13).
- **Curated Heroes**: fixed, per-World, five-image sets (Photography / Hiking-Nature / Culture-History / Culinary-Local / Photography-Workshop), stored under `public/design-library/worlds/<world>/curated-heroes/`. Explicitly **not user assets** — "keine Nutzerwahl, kein Upload, kein Ersetzen, kein Entfernen," not stored in `.nls` at all (`docs/editorial-worlds/FJORD-CURATED-HERO-CONTRACT.md:11-19`; Ostsee equivalent confirmed in `OSTSEE-CURATED-HERO-CONTRACT.md`). Confirmed in code: `src/lib/curated-heroes.ts` is a static `Record<CuratedHeroKey,string>` lookup with zero user-input path.
- **Curated Accents**: a deliberately *smaller and quieter* sibling concept for utility pages (Contents/"Orientierung", Notes/"Erinnerungen"), same non-editable, World-owned, non-persisted nature (`docs/PRODUCT-DNA.md:2106-2120`; code: `src/lib/curated-accents.ts`).
- **Frames/borders**: explicitly avoided for content surfaces — Extension Zones are "rahmenlos" (frameless); imagery is composed directly onto the paper surface rather than mounted in a colored/bordered media card (`docs/PRODUCT-DNA.md §61`, ADR‑020's "Fjord surface rule").

Rationale stated directly: *"Ein Asset braucht in Studio einen redaktionellen Grund."* ("An asset needs an editorial reason to exist in Studio.") — `docs/PRODUCT-DNA.md:1695`. This finiteness is presented as protecting visual consistency and preventing Studio from becoming an asset manager, echoed as an explicit non-goal in nearly every ADR/ECR that touches imagery (ADR‑020, ECR‑022, ADR‑035/036 Curated Hero rules). Confidence: HIGH.

## 15. Finite Visual Vocabulary — Boxes/Information Surfaces

(Continuing §14's theme with the specific "boxes" question.)

**Three boxes side by side are explicitly, deliberately allowed** — this is a named, dedicated section of the Product DNA:

> **"§23. Drei Boxen nebeneinander sind erlaubt"** — permitted when content is short, balanced in weight, scannable, and visually compact (e.g. Quick Facts, compact travel info, small hints); *not* suitable for long prose, extensive souvenir notes, or complex country-specific rules. **"Die Zahl der Boxen ist nicht das Problem. Die inhaltliche Eignung entscheidet."** (The number of boxes isn't the issue; content suitability decides.)
> Evidence: `docs/PRODUCT-DNA.md:655-683`, restated as invariant #13 in §56 ("Drei Spalten nur bei geeigneten kompakten Inhalten").

This is also confirmed independently for **Travel Companion pages** (Licht/Wetter/Photography-Workshop): *"drei Module nebeneinander sind erlaubt und bevorzugt, wenn Content Fit und Lesbarkeit dies tragen"* (`docs/PRODUCT-DNA.md:1990-2010`). Signets, surface color and hierarchy for boxes all derive from the active World (§9-10); no frames are used (§14). Confidence: HIGH.

## 16. Content Capacity & Overflow

Content Capacity is a named, three-state internal (never persisted) classification: `comfortable` / `tight` / `overflow` (ADR‑019, `docs/PRODUCT-DNA.md §25`; implemented in `src/lib/layout/capacity.ts::destinationContentCapacity` and `destinationExtensionCapacity` as text-length heuristic scoring functions with explicit doc-comments: *"Fast editorial-preview heuristic only. It never changes typography, content, persisted data or authoritative Publisher geometry."*).

**Governing rule (Build 030, elevated to a global contract):** **"Content Fit entscheidet über die Komposition."** Studio must fully evaluate the finite candidate set for a page's content *before* choosing a final composition; a candidate is invalid if it would clip text, let content escape its surface, borrow the Companion/Footer safe zone, or force unnecessary density. Only after candidate evaluation may a page-type-specific density step (where explicitly allowed) be tried. If nothing fits: **overflow**, never silent shrinking/clipping/displacement (`docs/ARCHITECTURE.md:180-188`, `docs/PRODUCT-DNA.md:1894-1926`).

**Overflow's Travel-Language message (not a technical error):**

> **"Diese Seite kann diesen Inhalt nicht mehr ruhig erzählen."**
> ("This page can no longer tell this content calmly.")
> Evidence: `docs/PRODUCT-DNA.md:735, 1740, 1935`; `ADR-024B`; `docs/editorial-worlds/FJORD-CURATED-HERO-CONTRACT.md:80`.

**Priority order when a Curated Hero is present and space is under pressure** (`FJORD-CURATED-HERO-CONTRACT.md:65-76`): (1) protect Companion safe zone → (2) protect Footer safe zone → (3) protect readability/core content → (4) reduce Hero from `Standard` to `Compact` → (5) try other allowed grammar variants → (6) overflow. This same "protected zones are hard boundaries, decorative/secondary elements yield first" rule is generalized to *any* new page grammar in Build 034 ("Neue Grammar erbt Capacity Protection. Sie definiert sie nicht neu.").

**Regression discipline is content-aware, not character-count-aware:** a later fix (Build 030 "Overflow nur aus geometrischem Content Fit") explicitly forbids triggering overflow from abstract character counts or "not-yet-existing modules reserving space" — capacity must be evaluated against real, calibrated, wrapped render height inside the actually protected content zone (`docs/PRODUCT-DNA.md:1937-1952`). The documented regression test is Geiranger's "Wandern & Natur" page with two specific real routes and a full-length safety note that must remain renderable without overflow.

## 17. Travel Language

The mapping between internal technical values and user-facing vocabulary is treated as an architectural boundary, not a translation table:

| Internal (`.nls`, code) | Studio (user-facing) |
|---|---|
| `Destination` | Ortsprofil / Reiseziel |
| `JourneyStage` | Deine Route / Reiseziel |
| Layout Variant | Seitenwirkung |
| `destination-hero-banner` | **Weite** |
| `destination-hero-left` | **Bild links** |
| `destination-hero-right` | **Bild rechts** |
| Asset | Bild |
| Manifest | not surfaced |
| Reference World | "Editorial World" or, in normal workflow, not named technically at all |
| Grammar | not surfaced as ordinary traveller UX |
| Destination Profile | Ortsprofil |

Evidence: this exact table is given directly in `docs/PRODUCT-DNA.md:119-134`, restated in `docs/project-format.md:86-94`, and confirmed in code as literal `label` strings on the layout-variant objects (`src/lib/layout/fjord.ts:19-36`: `label: 'Weite' | 'Bild links' | 'Bild rechts'`). Confidence: HIGH, triple-anchored (product doc, format spec, source code).

**Why the split matters (stated rationale, not inference):** the persisted values must remain "technical and stable" so `.nls` documents stay forward-compatible and Publisher-consumable, while the *presentation* layer is free to evolve wording without a schema migration. This is explicit in ADR‑018's "Build 020 Final UX clarification": *"Studio's visible Travel Language is Ortsprofil, Seitenwirkung, Weite, Bild links and Bild rechts while the persisted layout IDs remain unchanged. … No domain field is repurposed to satisfy a UI question."* It is also the concrete expression of ADR‑009 "Human Language First" and ADR‑011 "Travel Language," whose guiding sentence is: **"Der Reisende legt Orte an. Studio baut daraus Seiten."** (The traveller creates places. Studio builds pages from that.)

A further Travel Language example, explicitly named a "Leitsatz": route navigation is expressed only as **"Deine Route," "Früher in der Reise," "Später in der Reise,"** and **"Ort bearbeiten"** — never as manifest/index operations (`ADR-012`).

## 18. Inspector & Editing Model

The Inspector is explicitly **not a database editor**: *"Er ist ein ruhiger redaktioneller Begleiter."* The guiding question it should answer is not "which fields does Destination have" but "what do I need to decide about this place right now" (`docs/PRODUCT-DNA.md:168-181`).

**Sizing (ADR‑021, confirmed in code):**

- Resizable by dragging its left edge.
- Clamped **320–440 px**, with the effective maximum further reduced on narrow windows to protect Canvas space (`inspectorMaximumWidth()` in `src/lib/inspector-layout.ts` computes `viewportWidth − 264 (sidebar) − 360 (min canvas)`, clamped into [320,440]).
- Width is a **local workspace preference**, stored in `localStorage` under key `northern-lines-studio.inspector-width` — explicitly **not** part of `.nls` (`ADR-021`, `docs/ARCHITECTURE.md:129-134`).
- Guiding sentence: **"Der Inspector darf wachsen, wenn der Inhalt es verlangt – aber nie so weit, dass das Travelbook seine Rolle als Hauptfläche verliert."**

**What appears in the Inspector** follows a preferred hierarchy for Destination editing (`docs/PRODUCT-DNA.md §7`): primary — **ORTSPROFIL** ("Der Ort in Kürze," "Was möchtest du erleben?"); secondary, calmer — **REISE VOR ORT** (Arrival/Departure/Timezone); visual choice — **SEITENWIRKUNG** (Weite/Bild links/Bild rechts). Deeper structured data (Highlights, Practical Info, Extensions) is available but progressively disclosed, not dumped as a flat form. Non-editable Companion status values (position/pose/mirroring) are rendered as quiet status text at label-sized typography, deliberately *not* suggesting they are adjustable (`docs/PRODUCT-DNA.md:1844-1851`).

**Authoring lifecycle:** authored content (Story Components) carries a small editorial status: `empty → draft → revised → approved → final` (ADR‑008, validated in Rust: `matches!(entry.status.as_str(), "empty"|"draft"|"revised"|"approved"|"final")`, `src-tauri/src/lib.rs:833`).

## 19. Persistence & Save Protection

Dirty-state tracking is split into three independent, composable flags in the Svelte frontend (`src/App.svelte`): `authoringDirty`, `destinationDirty`, `interestEntryDirty`, combined as `hasUnsavedChanges = authoringDirty || destinationDirty || interestEntryDirty` (`App.svelte:1104-1146`).

**Guarded actions:** opening another journey (`open-travel`, `open-travel-path`), starting a new journey (`begin-travel`), closing the current journey (`close-travel`), reordering places (`move-place`), editing a place (`edit-place`), switching the selected page (`select-page`), and switching the active Story component (`select-component`) all check `hasUnsavedChanges` first and, if dirty, set a `pendingAction` instead of proceeding immediately (`App.svelte:160,309,326,635,690,716,737,757,782`).

**Dialog sequence, in this order:** **Verwerfen** (Discard) → **Abbrechen** (Cancel) → **Speichern** (Save) — confirmed both in the DNA doc's stated pattern (ADR‑029: *"the global dirty-state system keeps Verwerfen · Abbrechen · Speichern"*) and in the actual button order in the markup (`App.svelte:2461-2463`). Keyboard behavior: `Escape` cancels; `Enter` (outside a `<textarea>`) triggers Save; the Save button receives initial focus (`handleSaveDialogKeydown`, `focusSaveDialog`, `App.svelte:991-1004`).

**Save-then-continue chaining:** `saveActiveUnsavedChanges()` saves, in order, any dirty interest entry → dirty destination profile → dirty authoring component, aborting the chain (and the pending navigation) if any individual save fails; `discardActiveUnsavedChanges()` resets each dirty draft back to its last-persisted value (`App.svelte:912-936`). This directly implements the "Hinweise / Orte & Motive / Praktische Infos" three-way protection referenced by the audit brief — those three areas correspond respectively to authoring components, the Destination profile fields, and (for Interest Pages) structured entries, and all three funnel through the same `pendingAction`/dialog mechanism. Confidence: HIGH, code-confirmed.

**Persistence side:** every mutating IPC command (`save_authoring_component`, `update_destination_profile`, `save_interest_entries`, `update_journey_planning`, `move_journey_place`, `set_destination_image`, …) round-trips through Rust, which re-validates and re-writes `project.json` (`write_project()`); the frontend never writes the file directly.

## 20. `.nls` Model

`.nls` is an **open package** — a directory with the extension `.nls`, treated by macOS as a document since Build 016 (ADR‑013: *"Der Reisende öffnet kein Projekt. Er öffnet seine Reise."*). Structure (`docs/project-format.md:7-14`):

```text
<journey>.nls/
├── project.json
└── content/
    └── pages/
```

**Current format version: `0.16.0`** (`docs/project-format.md:3`, matching `CURRENT_FORMAT_VERSION` in `src-tauri/src/lib.rs:5`). The format has undergone **15 documented, additive migrations** since `0.1.0`, each tied to a specific Build/ADR/ECR and each explicitly stated to *never invent content* during migration:

`0.1.0` (legacy) → `0.2.0` (Build 003, Journey/Stage/Role model) → `0.3.0` (Build 004, Reference World Library) → `0.4.0` (Build 005/008, Editorial Grammar + Story Components/Companion Collection) → `0.5.0` (Build 009/017, Semantic Story Authoring; example project shown to the user matches this era — see §28 U‑006) → `0.6.0` (Build 018, Journey Planning page) → `0.7.0` (Build 019, structured planning fields) → `0.8.0` (Build 020/021, Destination Profiles + layout variants + capacity rules, no schema growth) → `0.9.0` (Build 022/023, imagery roles) → `0.10.0` (Build 024, Editorial Extensions) → `0.11.0` (Build 026, Interest Pages) → `0.12.0` (Build 027, Photography components) → `0.13.0` (Build 028, Hiking/Nature components) → `0.14.0`→`0.15.0` (Build 028 fix/031, structured Interest entries + Light Companion) → `0.16.0` (Build 032, Weather Companion `introduction`).

Every migration step in `docs/project-format.md` explicitly states what it does *not* invent (no fabricated introductions, routes, interests, or imagery). Rust's `migrate_project()` (`src-tauri/src/lib.rs:534-674`) is the single authoritative implementation; `read_project()` calls it before validation and re-persists the project if `migrated_from_version` is set (`src-tauri/src/lib.rs:675-708`).

**What `.nls` explicitly never stores:** final layout coordinates, crop rectangles, focal points, free image x/y, Publisher render-job data, World color/typography definitions (only `editorialWorldId`), Companion position/size/pose (derived from the World), Inspector width, or preview-derived geometry. It stores *semantic decisions*: which of exactly three layout variants, which Extension kind + text, which Interest entries + fields, which images (as project-relative paths only). This is the concrete meaning of the repeated architecture rule "Semantik statt finaler Koordinaten speichern" (invariant #14, §56).

**Studio produces** a fully validated, migrated `project.json` plus copied-in image assets under `assets/destinations/<id>/`. **Publisher would consume** this same `.nls` package as its authoritative editorial input and would own final geometry, Content Fit enforcement, rendering, and preflight (ADR‑018, `ARCHITECTURE.md §Verantwortungsgrenzen`) — but no Publisher source, schema, or contract file exists in this repository; the CLI/sidecar boundary is *described*, not *implemented*, and `scripts/publisher-integration-spike.mjs` exists as an as-yet-unusable measurement harness pending a Publisher binary (ADR‑018: *"The repository does not contain a Northern Lines Publisher executable, so timing measurements are not fabricated."*). Confidence: HIGH that this boundary is intentional and explicit; the Publisher side is necessarily unverifiable from this repository alone.

## 21. Studio / Publisher Boundary

| | Northern Lines Studio | Northern Lines Publisher |
|---|---|---|
| Owns | Journey state, Destination Profiles, authoring state, the user's layout *choice*, navigation, Canvas, Editorial Preview | Schemas, final validation, Layout Grammar enforcement, Content Fit, render jobs, assets, preflight, production output |
| Knows | "Menschen, nicht Render-Jobs" | "Regeln, nicht Reisen" |
| Present in this repo? | Yes — full source | **No** — described only; no executable, no schema files, no CLI contract implementation found |

Evidence: `docs/000-NORTHERN-LINES.md:44-67`, `docs/ARCHITECTURE.md:23-43`, `docs/PRODUCT-DNA.md §14`, ADR‑002, ADR‑018. The architectural guardrail against drift: **"Studio besitzt keine zweite vollständige Layout Engine. … Studio Preview ≠ Publisher Output."** Studio's own preview is explicitly split conceptually into an **Editorial Preview** (fast, plausible, editing-friendly) and a future **Publishing Preview** (publisher-authentic, typographically exact, content-fit-capable, asset-safe) — the two may technically differ, but the boundary should be invisible to the traveller (`docs/PRODUCT-DNA.md:475-499`).

**Future CLI integration:** ADR‑002 states Publisher "bleibt eigenständig und wird später über eine CLI-/Sidecar-Grenze angebunden" (remains independent, later connected via a CLI/sidecar boundary); ADR‑018 adds that a persistent process/API would only be considered "after measured evidence shows that CLI roundtrips are unsuitable for interactive high-fidelity preview" — i.e. the current default assumption is a versioned CLI/sidecar contract, not a long-running service, but this is explicitly provisional and unmeasured. **This is speculative/future scope, not implemented** — flagged accordingly.

## 22. Technical Architecture

```text
Svelte 5 + TypeScript (src/, ~4,700 LOC across App.svelte + src/lib/**)
        │  @tauri-apps/api invoke()
        ▼
Rust / Tauri v2 desktop bridge (src-tauri/src/lib.rs, ~2,155 LOC)
        │  reads / validates / migrates / writes
        ▼
.nls package (project.json + content/pages/)

Northern Lines Publisher CLI — described boundary only, not present in this repo
```

- **Frontend:** Svelte 5 + TypeScript (`package.json`: `svelte ^5.0.0`, `@sveltejs/vite-plugin-svelte ^5.0.0`), single monolithic `App.svelte` (2,558 lines) plus a well-factored `src/lib/` domain layer (workspace/project/grammar/story/layout/worlds/companions/destinations/destination-interests/editorial-extensions/journey-planning/travel-language/travel-companion-*). Vite 6 is the bundler; `vitest` is the test runner; `svelte-check` is the type-checker (`pnpm check`).
- **Desktop shell:** Tauri v2 (`@tauri-apps/cli ^2.0.0`, Rust `tauri = "2"`), with `tauri-plugin-dialog` for file dialogs. `tauri.conf.json` registers `.nls` as a macOS document type/package (`fileAssociations`), fixes a minimum window size (980×700), and currently declares **no CSP** (`security.csp: null`).
- **Capabilities:** `src-tauri/capabilities/default.json` currently grants `core:default`, `dialog:allow-open`, and (newly, on the current branch) `core:webview:allow-print` — added specifically to unblock `window.print()` for the PDF-Proof PoC (see §26).
- **Backend/domain:** Rust owns the entire `StudioProject`/`Journey`/`JourneyStage`/`Destination`/`StudioPage` struct graph (`serde`-derived, `camelCase` on the wire), all migration logic, all file I/O, and all validation (`validate_project()`, ~150 lines of structural/referential checks). It exposes exactly **16 `#[tauri::command]` functions** — `load_nls_project`, `create_nls_project`, `update_editorial_world`, `save_authoring_component`, `save_interest_entries`, `add_journey_place`, `add_destination_interest`, `remove_destination_interest`, `update_journey_planning`, `move_journey_place`, `update_journey_place`, `update_destination_profile`, `set_destination_image`, `remove_destination_image`, `read_image_preview`, `take_pending_open_path` — no other write path into `project.json` exists.
- **State:** `OpenRequestState` (a `Mutex<Option<String>>`) bridges macOS "open this .nls" events to the frontend via a Tauri event (`open-nls`) plus a pull-based fallback command (`take_pending_open_path`), handling both cold-start-via-Finder-double-click and already-running-app cases (ADR‑013).
- **Domain shape duplication (intentional, not accidental):** the Rust structs and the TypeScript interfaces in `src/lib/project.ts` describe the *same* shapes independently (both hand-written, not generated from one schema) — confirmed field-for-field identical for `Destination`, `Journey`, `JourneyStage`, `StudioPage`, `DestinationInterestEntry`. This is an implicit, code-level contract rather than a single generated source of truth. Confidence: HIGH (directly observed); whether this is deliberate design or emergent risk is not stated anywhere in the docs — noted, not judged, per the read-only scope of this phase.
- **Testing:** Rust — 26 `#[test]`/`#[cfg(test)]` occurrences inside `lib.rs` (no separate test files), covering migration and validation paths. Frontend — `vitest` unit tests exist alongside most `src/lib/*.ts` modules (`*.test.ts`) plus `App.svelte` is exercised indirectly through those. A Swift test file (`tests/NorthernLinesStudioTests/NLSProjectLoaderTests.swift`) survives from the abandoned SwiftUI/AppKit prototype (ADR‑001→002) and is not part of the current Tauri build path — noted as a likely-orphaned artifact, not evaluated further in this read-only phase.

## 23. Core Data Flows

**Opening a journey (evidenced: `ARCHITECTURE.md`, `lib.rs::read_project`):**

```text
Finder double-click .nls (or in-app "Reise öffnen …")
    ↓
Tauri RunEvent::Opened  /  load_nls_project(path) command
    ↓
Rust: read project.json → migrate_project() → validate_project()
    ↓ (if migrated_from_version set)
Rust: write_project() — persist normalized form back to disk
    ↓
ProjectSession { project, project_path } returned over IPC
    ↓
Svelte: StudioProject bound into App.svelte state → Canvas + Inspector render
```

**Editing a Destination field (evidenced: `App.svelte` dirty-state + `update_destination_profile` command):**

```text
User edits Ortsprofil field in Inspector
    ↓
destinationDraft mutated locally → destinationDirty becomes true
    ↓ (user tries to navigate away, or clicks Speichern)
saveActiveUnsavedChanges() → invoke('update_destination_profile', {...})
    ↓
Rust: locate Destination by id → apply change → validate_project() → write_project()
    ↓
Updated ProjectSession returned → Svelte state resynced → destinationDirty resets
```

**Content-fit/composition (preview-only, never persisted; evidenced: `src/lib/layout/capacity.ts`):**

```text
Destination content (reasons/highlights/practicalInfo/extensions)
    ↓
destinationContentCapacity() / destinationModuleComposition() / destinationTitleComposition()
  (pure heuristic scoring functions, no I/O)
    ↓
comfortable | tight | overflow  +  single|two|three columns  +  balanced|title-wide|...
    ↓
Svelte renders the chosen composition class; nothing is written back to project.json
```

All three flows converge on the documented discipline: **Model → Rust → Migration → Command → Inspector → Preview → Tests** (`README.md:283-297`).

## 24. Contracts

| Contract | Type | Purpose | Location | Enforcement | Tests/Gates |
|---|---|---|---|---|---|
| `.nls` Project Format | Data Contract (explicit, versioned) | Defines the open package Studio produces and Publisher would consume | `docs/project-format.md`, `src-tauri/src/lib.rs` structs | Rust `serde` deserialization + `validate_project()` | `pnpm test` (project.test.ts), `cargo test`, migration tests in `lib.rs` |
| Editorial World Contract | Design/Data Contract (explicit) | Five mandatory layers every World must supply; shared-semantics/world-expression split | `docs/editorial-worlds/EDITORIAL-WORLD-CONTRACT.md` | Convention + `is_supported_editorial_world()` allow-list in Rust; `worlds/index.ts` registry in TS | `check-editorial-world-poc-consistency.mjs`, `check-editorial-world-expression-consistency.mjs` |
| Curated Hero Contract (per World) | Design Contract (explicit) | Fixed, non-editable World imagery; head-flow-only geometry; capacity priority order | `docs/editorial-worlds/FJORD-CURATED-HERO-CONTRACT.md`, `OSTSEE-CURATED-HERO-CONTRACT.md` | Convention + static lookup table (`curated-heroes.ts`) with no user-write path | `check-build-035-curated-heroes-consistency.mjs`, `check-build-036-ostsee-curated-heroes-consistency.mjs` |
| Protected Editorial Zones / Content Capacity | Layout Contract (explicit) | Binding/Title/Companion/Footer safe areas; comfortable/tight/overflow states; Content-Fit-before-Composition | `ADR-019`, `ADR-030-CONTENT-FIT-BEFORE-COMPOSITION`, `docs/PRODUCT-DNA.md §17-25` | `src/lib/layout/capacity.ts` heuristics; CSS zone structure | `check-layout-resilience-consistency.mjs`, `check-content-fit-composition-consistency.mjs`, `check-geometric-content-fit-consistency.mjs`, `check-capacity-protection-regression-consistency.mjs` |
| Editorial Grammar / Story Components | UI Contract (explicit) | Deterministic per-page-type required/optional component sets; Editorial Frame vs Story vs Annotations layering | ADR‑005, ADR‑006, `src/lib/grammar/*`, `src/lib/story/*` | `GrammarEvaluation`/`StoryStructure` computed types in TS; component presence validated in Rust (`validate_project`) | implicit via consistency gates per feature build |
| Travel Language mapping | UI/Data Contract (explicit) | Internal ID ↔ user-facing label pairs must never drift or be repurposed | `docs/PRODUCT-DNA.md §5`, `docs/project-format.md` table | literal `label` fields in `layout/fjord.ts`/`baltic.ts` | `check-inspector-ux-language-consistency.mjs`, `check-native-ui-consistency.mjs`, Travel-Language checks embedded in several build-specific gates |
| Extension Zone semantics | Design/Data Contract (explicit) | Six fixed kinds, frameless, signet+color+text only, must not colonize core zones | `docs/design/EDITORIAL-EXTENSION-ZONES.md`, `ADR-022` | closed enum in Rust (`matches!` on six literal kinds) + TS `EditorialExtensionKind` union | `check-editorial-extension-zones-consistency.mjs`, `check-extension-capacity-protection-consistency.mjs` |
| Companion Layout Foundation | Layout Contract (explicit) | Fixed position/pose/mirror/scale per World; not part of normal layout flow | `ADR-015`, `src/lib/companions/layout.ts` | `CompanionLayoutRule` typed object, no free parameters exposed | implicit in destination/composition gates |
| Studio↔Publisher boundary | Design Contract (explicit, partially aspirational) | Studio owns editorial state; Publisher owns publishing truth; no duplicate layout engine | ADR‑002, ADR‑018, `docs/ARCHITECTURE.md` | Structural — Studio simply contains no Publisher-equivalent rendering/preflight code | `scripts/publisher-integration-spike.mjs` (currently unusable — no Publisher binary exists) |
| Development chain discipline | Implicit process contract | Every schema-affecting change must traverse Model→Rust→Migration→Command→Inspector→Preview→Tests | `docs/PRODUCT-DNA.md §32`, `README.md` Validation Gates section | Enforced by convention + the ~39 feature-specific consistency gate scripts | `pnpm consistency` (chains all `check-*.mjs`) |

Confidence: HIGH for the existence and shape of each contract (directly evidenced); MEDIUM for how *completely* each is mechanically enforced vs. relying on developer discipline — the consistency gates largely do string/structural presence checks on source files (see §24 below), not full semantic verification.

## 25. Validation & Quality Gates

**Gate families (all read-only-verified, none executed):**

1. **Consistency Gates** (`scripts/check-*.mjs`, 39 files) — each is a small Node script that reads specific source files (TS modules, CSS files, sometimes `package.json`/`tauri.conf.json`/`Cargo.toml`) and asserts the presence of specific tokens, numeric relationships, or structural invariants, printing `FAIL · <label> · <message>` and exiting non-zero on violation. Example (`check-build-040-a5-geometry-consistency.mjs`): asserts `src/lib/preview.ts` contains the literal tokens `PREVIEW_BASE_WIDTH = 420`, `PREVIEW_GOLDEN_HEIGHT = 594`, the exact A5 ratio formula, and that the computed ratio matches 148:210 to within `1e-12`. `pnpm consistency` chains all 39 in sequence (`package.json` scripts).
2. **Type checking** — `pnpm check` → `svelte-check --tsconfig ./tsconfig.json`.
3. **Unit tests** — `pnpm test` → `vitest run` (frontend, `*.test.ts` files colocated with `src/lib/**`) and `cargo test --manifest-path src-tauri/Cargo.toml` (Rust; also exposed as `./scripts/test-rust.sh`, added specifically because the repo has no root `Cargo.toml`/workspace manifest, so a bare `cargo test` at repo root does not find a manifest — documented explicitly in `docs/STUDIO-PDF-PROOF-POC-001.md` and `APPLY-DROPIN.md`).
4. **Build** — `pnpm build` (Vite) as a gate in its own right.
5. **Diff hygiene** — `git diff --check` (whitespace-error gate), listed in the standard validation sequence.
6. **Real-World-Test** — a manual, documented, non-automatable step: open a real journey, edit a real place, switch page effect, save, close, reopen, verify persistence and visual/Companion/Footer/Safe-Area correctness (`docs/PRODUCT-DNA.md §37`, `ENGINEERING-STANDARD.md §Real-world persistence validation`).

**What the gates do *not* cover** (observed, not asserted by the docs): the `check-*.mjs` scripts are largely **static source-text assertions**, not runtime/DOM/visual assertions — they cannot catch a case where the *documented* token is present in source but the resulting rendered composition is wrong; that class of defect is explicitly deferred to the manual Real-World-Test step. There is no automated visual-regression or screenshot-diff tooling in the repository. Confidence: HIGH (directly observed from reading the gate scripts).

`pnpm consistency` in `package.json` chains exactly 37 `node scripts/check-*.mjs` invocations; two files in the `scripts/` directory (`check-build-034-final-consistency.mjs`'s siblings and `check-build-031...`-style names) match up with the 39 files present, so the chain and the file list are consistent — no orphaned or missing gate scripts were found in this pass. Confidence: MEDIUM — this was a name-pattern cross-check, not an exhaustive line-by-line diff of the `consistency` script against `ls scripts/check-*.mjs`.

## 26. Build / Drop-in Process

Two parallel delivery shapes exist per the Engineering Standard, evidenced in `docs/PRODUCT-DNA.md §34-36` and `docs/engineering/{ENGINEERING-STANDARD,DROP-IN-STANDARD}.md`:

- **Full Repo** — the authoritative, complete repository version; replacing it preserves only the existing `.git/` directory, and repo-management files (`.gitignore`, `.gitattributes`) come from the new build.
- **Drop-in** — contains only new/changed files, applied with `rsync` dry-run → merge (never Finder folder replacement — this is a named rule: *"Finder may be used to unpack the ZIP, but repository Drop-ins are merged with rsync, not Finder folder replacement."*). Since Build 007 the Drop-in root mirrors repository paths directly (no `payload/` wrapper).

**Every Drop-in ships an `APPLY-DROPIN.md`** with a fixed structure: create branch → dry run → apply rsync → run gates → expected PASS output → full gate suite → Real-World-Test → concrete example data → expected result (`docs/PRODUCT-DNA.md §35`). The current uncommitted working-tree state matches this exactly: `APPLY-DROPIN.md` and `DROP-IN-MANIFEST.md` at repo root describe a **"Studio PDF Proof PoC 001 · Print Capability Fix"** drop-in whose manifest is `src/App.svelte`, `src/styles.css`, `src/styles/pdf-proof.css`, `src/lib/pdf-proof.ts`, `src/lib/pdf-proof.test.ts`, `scripts/check-studio-pdf-proof-poc-001-consistency.mjs`, `docs/STUDIO-PDF-PROOF-POC-001.md`. Its stated cause: Tauri v2 intercepts `window.print()` and requires the `core:webview:allow-print` capability, which is the sole permission the PoC adds (confirmed present in `capabilities/default.json`, git-status `modified`).

**`scripts/install-macos-app.sh`** (read, not executed): runs `pnpm tauri build --bundles app`, verifies the resulting `.app` bundle exists, removes any previously installed copy at `/Applications/Northern Lines Studio.app`, copies the new one in with `ditto`, re-registers it with macOS Launch Services (`lsregister`), and prints a manual Finder double-click test instruction. This script is the standard path from source to an installed, `.nls`-file-associated desktop app, referenced consistently across `README.md`, `INITIALIZATION.md`, and `APPLY-DROPIN.md`.

Every SHA256SUMS file at repo root (`BUILD-020-SHA256SUMS.txt` … `BUILD-040-DROPIN-SHA256SUMS.txt`, ~30 files) is the checksummed manifest of a historical Drop-in delivery, consistent with the "reproducible Drop-in" discipline. Confidence: HIGH — the process is both documented and directly observable in the current working tree's own uncommitted change set.

## 27. Reference Reconstruction / End-to-End Model

**"Norway 2026" / "Norwegen 2026"** is the journey inside the shipped example fixture `examples/Norway-Sample.nls` (`journey.id: "norway-2026"`, `journey.title: "Norwegen 2026"`), covering Bergen and Geiranger. It plays **two roles**, both directly evidenced:

1. **The canonical manual-validation fixture from Build 001 onward.** Nearly every early `docs/validation/BUILD-0XX-VALIDATION.md` checklist (Builds 001, 002, 004, 005, 006, 008, 009, 010, 010.1, 011) instructs the tester to open exactly this package via **"Reise öffnen"**; `INITIALIZATION.md` names it as *the* example project for first setup; it is also used as literal fixture data inside unit tests (`src/lib/project.test.ts`, `src/lib/workspace.test.ts` both construct a `journey` object with `id: 'norway-2026', title: 'Norwegen 2026'`).
2. **A stand-in for the real, proven Northern Lines Fieldbook that grounds product decisions.** `docs/PRODUCT-DNA.md §9` explicitly cites "Das Norwegen-Fieldbook" as showing real destination-page richness (name, subline, intro, arrival/departure, duration, timezone, photospots, maps, phototips, practical info, notes, QR) that the Studio data model must be able to hold without becoming a technical grid. ADR‑015 grounds the Companion's first-appearance rule directly in this reference: *"Das Norwegen Fieldbook 2026 zeigt den Companion erstmals auf der Reiseplanung und danach als wiederkehrenden, unaufdringlichen Begleiter. Build 018 übernimmt dieses bewährte Prinzip…"* `docs/PRODUCT-DNA.md §38` additionally names Bergen/Geiranger/Ålesund/Haugesund/Visby as the preferred real-world stress-test set for Content Capacity (low/normal/stress content cases), and a later regression test (Build 030 fix) is pinned specifically to Geiranger's two real hiking routes.

**Why it can serve as an end-to-end test:** it is a real (if fictional-dated, 2026) multi-destination journey with front matter, destination pages, knowledge pages (Light/Weather), workflow pages, notes and closing — i.e. it exercises essentially the full `PageType` union in one package, and its role as "the thing you open to check Studio still works" is stated directly rather than inferred. Confidence: HIGH for its role as the validation fixture; MEDIUM for how current it is as a *schema* fixture — see §28 U‑006, its on-disk `formatVersion` (`0.5.0`) is far behind the current `0.16.0` format, meaning opening it today would trigger Studio's full in-memory migration chain rather than reflect the current schema shape as static JSON.

## 28. Uncertainties & Ambiguities

### U-001 — "Klarheit" as a named principle

**Source A (audit brief):** assumes "clarity" is a named product-DNA pillar with derivable UI/data-model/layout/interaction/content-structure/extensibility rules.
**Source B (repository):** the literal term "Klarheit"/"clarity" does not occur anywhere in the repository (verified by case-insensitive full-text search across all `.md`/`.ts`/`.svelte` files).
**Observed ambiguity:** the *concept* the brief is pointing at is clearly present and heavily evidenced (calm surface over a rich model, no unnecessary visibility, selective UI, Travel Language) but is never given this specific name.
**Current interpretation:** treated the cluster described in §5 as the closest reconstructable equivalent.
**Confidence:** MEDIUM.

### U-002 — "Kuscheln erlaubt, jeder im eigenen Bett"

**Source A (audit brief):** presents this as an apparent Companion-related principle.
**Source B (repository):** the only "kuscheln" occurrence in the entire repo is `docs/editorial-worlds/FJORD-CURATED-HERO-CONTRACT.md:45`, about the Curated **Hero image's** relationship to body **text** — not about the Companion, and without a "jeder im eigenen Bett" continuation anywhere.
**Observed ambiguity:** whether the brief is (a) paraphrasing/extending this Hero-Text quote, (b) referencing an oral/internal phrase not committed to the repository, or (c) testing whether the reconstruction would falsely confirm an unverifiable quote.
**Current interpretation:** reported the actual quote and its actual (narrower) scope in §8, and explicitly declined to present the broader phrase as repository-sourced.
**Confidence:** LOW on any claim that this maps onto general Companion behavior; HIGH on the literal quote's existence and scope.

### U-003 — Duplicate ADR/ECR numbers

Several ADR/ECR numbers are reused for unrelated content:
- `ADR-001-swiftui-appkit-publisher-cli.md` (Accepted, dated 2026‑08‑06) vs. `ADR-001-SWIFTUI-APPKIT.md` (Status: Superseded, "Ersetzt durch: ADR‑002") — these read as two different write-ups of the same original (now-abandoned) decision, one detailed/English, one short German pointer-stub.
- `ADR-030-CONTENT-FIT-BEFORE-COMPOSITION.md` vs. `ADR-030-CULINARY-LOCAL-EXPERIENCE.md` — two genuinely unrelated decisions sharing number 030.
- `ECR-001-build-001-foundation.md` (English, "Accepted") vs. `ECR-001-TAURI-REBUILD.md` (German, "Implemented") — related (both cover the Build‑001 foundation, one from the SwiftUI-era plan, one documenting the pivot to Tauri) but still two files under one number.
- `ECR-013-JOURNEY-BEGINNING.md` vs. `ECR-013-JOURNEY-OPENING-FOUNDATION.md` — two unrelated Build‑013/016-era features sharing number 013.
- `ECR-014-EDITORIAL-WORLD-LAYOUT-FOUNDATION.md` vs. `ECR-014-JOURNEY-PLACES.md` — two unrelated features sharing number 014.
**Current interpretation:** treated as a document-numbering/housekeeping artifact of iterative delivery, not a semantic contradiction — in every case the *content* of each file was internally coherent and attributable to a specific Build. Not escalated as a defect per the read-only, non-review scope of this phase.
**Confidence:** HIGH that the duplicates exist as named; not evaluated for "rightness."

### U-004 — `PRODUCT-DNA.md`'s own currency and internal section numbering

The document's header states **"Stand: Build 023"**, but its body contains dated content through **Build 038** appended below that header without the header being updated. Additionally, section numbers restart/duplicate past roughly §46 — e.g. two sections titled `# 47`, two titled `# 59`, two titled `# 60`, and a `## 62`–`## 68` block that does not continue the earlier `# NN` numbering scheme cleanly (`docs/PRODUCT-DNA.md:1240, 1559, 1578, 1625, 1639, 1657…`).
**Current interpretation:** the document was extended incrementally per build without renumbering earlier sections — content is not contradictory, but a reader citing "§47" or "§60" must disambiguate by content, not number alone. This report cites by line range and quoted title to avoid this ambiguity.
**Confidence:** HIGH (directly observed).

### U-005 — README's declared "current" build/version vs. actual repository state

`README.md:23` states **"Aktueller Stand: Build 031"** and `README.md:29` states **"Studio: 0.32.0-alpha.1"**, while the README's own body documents features through **Build 038** (`README.md:480-483`), `package.json` declares version **0.40.0-alpha.1**, and `docs/builds/BUILD-040.md` plus the most recent commit (`a14aca4`, "build: establish exact A5 studio geometry in 040") show the repository is actually at Build 040.
**Observed ambiguity:** the README's "current state" banner is stale by roughly 9 builds relative to both its own later content and the actual shipped version.
**Current interpretation:** treated `package.json`/`tauri.conf.json`/`Cargo.toml` (all consistently `0.40.0-alpha.1`) and the git log/commit history as the authoritative "current state," not the README banner.
**Confidence:** HIGH (directly observed, numerically unambiguous).

### U-006 — Example fixture schema currency

`examples/Norway-Sample.nls/project.json` declares `"formatVersion": "0.5.0"`, while the current authoritative format is `0.16.0` (`docs/project-format.md`, `CURRENT_FORMAT_VERSION` in `lib.rs`).
**Observed ambiguity:** the checked-in static fixture does not reflect the current schema shape (e.g. it predates `editorialExtensions`, `destinations[]` top-level array in the 0.8.0 sense may or may not be pre-populated, `interestEntries`, imagery roles, etc.).
**Current interpretation:** this is very likely benign in practice — Studio's `read_project()` runs the full migration chain in memory and (per `migrated_from_version.is_some()`) rewrites the file on first open — but a reader inspecting the raw JSON on disk (rather than opening it in Studio) would see an outdated shape and could draw wrong conclusions about "the current schema" from this file alone.
**Confidence:** MEDIUM — the *mechanism* that resolves this (auto-migration) is code-confirmed; whether the fixture has actually been re-saved through Studio recently, or is deliberately kept at 0.5.0 as a "does old-format migration still work" regression fixture, is not stated anywhere.

### U-007 — Binding safe-area width: 17 mm vs. 15 mm

`ADR-019` (Build 021) states **"a 17 mm binding safe area."** `ADR-020` (Build 022 Final) contains a section explicitly titled **"Physical layout correction"** stating **"The technical minimum binding zone is 15 mm."** All later documents (`ADR-022`, `ARCHITECTURE.md`, `PRODUCT-DNA.md` §17/39/56, `README.md`) consistently use **15 mm**.
**Current interpretation:** this reads as a documented, deliberate in-repo correction (ADR‑020 names it as a correction), not an unresolved conflict — but `ADR-019` itself was never marked "Superseded" the way `ADR-001-SWIFTUI-APPKIT.md` was, so a reader consulting ADR‑019 in isolation would get the outdated figure.
**Confidence:** HIGH that 15 mm is the current, intended value; MEDIUM on whether the lack of a formal supersession marker on ADR‑019 is itself worth flagging to the team.

## 29. Questions for Manual Review

1. I interpret **"Klarheit"** (§5, U‑001) as *not* a literal named pillar in this repository, and instead reconstruct it from the combination of "Weißraum ist bewusst," "Sichtbarkeit ist nicht gleich Datenbestand," "Keine Funktion sichtbar machen, nur weil sie existiert," and Travel Language. Is this the intended referent, or is there an external/oral "Klarheit" principle this repository should already reflect but doesn't yet?

2. I could not locate **"Kuscheln erlaubt, jeder im eigenen Bett"** as a repository-sourced phrase (§8, U‑002); the only related quote is scoped narrowly to the Curated Hero/text relationship, not the Companion generally. Should this phrase be understood as (a) a paraphrase of the Companion-untouchable + Hero-cuddles-with-text rules combined, (b) a distinct principle that hasn't yet been written into the docs, or (c) not part of this system at all?

3. `ADR-019`'s 17 mm binding safe area was never formally marked "Superseded" even though `ADR-020` explicitly corrects it to 15 mm (§28, U‑007). Is leaving early ADRs un-superseded when later ADRs correct them the intended documentation convention, or should ADR‑019 receive a superseded/corrected marker for future readers?

4. The example fixture `examples/Norway-Sample.nls/project.json` is pinned at `formatVersion 0.5.0` while the live schema is at `0.16.0` (§28, U‑006). Is this fixture intentionally kept at an old version as a "legacy migration still works" regression check, or should it be periodically re-saved through current Studio to also serve as a current-schema example for new contributors reading the raw JSON?

5. `README.md`'s "Aktueller Stand"/version banner (Build 031 / 0.32.0-alpha.1) is roughly nine builds behind both its own later content and `package.json`'s `0.40.0-alpha.1` (§28, U‑005). Given `docs/PRODUCT-DNA.md §36` states documentation is "Teil des Builds. Nicht Nacharbeit" (part of the build, not follow-up work), is there a specific reason the top banner lagged for Builds 032–040, or is this simply an outstanding housekeeping item?

6. The Rust `StudioProject`/`Destination`/`StudioPage` structs and the TypeScript `interface` equivalents in `src/lib/project.ts` are maintained as two independently hand-written, field-for-field-matching definitions rather than generated from one shared schema (§22). Is this duplication an accepted, deliberate tradeoff (e.g. to keep Rust free of a codegen toolchain), or is there a schema-generation step elsewhere that this analysis missed?

7. `scripts/publisher-integration-spike.mjs` exists specifically to measure CLI-roundtrip latency once a Publisher binary is available (ADR‑018), but no Publisher executable or contract file exists anywhere in this repository. Should the Studio→Publisher CLI/sidecar *contract itself* (argument shape, expected stdout/stderr, versioning) be documented somewhere even before a Publisher binary exists, so Studio-side integration code has something concrete to be reviewed against?

## 30. Confidence Summary

| Area | Confidence | Basis |
|---|---|---|
| Product purpose, DNA, "not a CMS" | HIGH | Extensively and repeatedly stated in `VISION.md`, `000-NORTHERN-LINES.md`, `PRODUCT-DNA.md`, reinforced by a real documented regression (ECR‑020) |
| Layout Grammar (siblings/roommates, safe zones, adaptive composition) | HIGH | Verbatim repeated quotes across 3+ independent docs, plus direct code confirmation (`layout/capacity.ts`) |
| Companion Model ("unantastbar", layout accommodation) | HIGH | Verbatim repeated quotes across 4+ files, code-confirmed fixed layout rule object |
| "Kuscheln…eigenen Bett" specifically | LOW | Phrase not found verbatim; only a narrower, differently-scoped relative exists (§28 U‑002) |
| Editorial Worlds / World Contract | HIGH | Explicit contract document + two fully implemented, code-diverging World definitions |
| World Expression (white page, expression elsewhere) | HIGH | Explicit doc language + code-level literal `#FFFFFF` + dedicated gate |
| Destination Model (fields, Journey↔Destination relationship) | HIGH | Field-for-field confirmed identically in Rust and TypeScript, plus Rust validation logic |
| Interest Pages inherit full World Expression | HIGH | Explicit, directly-titled doc section, not inferred |
| Extension Zones (six kinds, frameless, signet+color) | HIGH | Explicit design doc + closed-enum validation in Rust + matching TS definitions |
| Finite Visual Vocabulary / 3-boxes rule | HIGH | Explicit, dedicated Product-DNA sections |
| Content Capacity & Overflow | HIGH | Explicit rules + working heuristic implementation in `layout/capacity.ts` |
| Travel Language mapping | HIGH | Identical table given in three independent sources (product doc, format spec, code labels) |
| Inspector sizing/role | HIGH | ADR + exact numeric match in `inspector-layout.ts` |
| Save protection / dirty-state | HIGH | Directly traced through `App.svelte` control flow |
| `.nls` model & migration history | HIGH | Cross-confirmed in `project-format.md` and `lib.rs` constants/migration function |
| Studio/Publisher boundary | HIGH for Studio's side; **not verifiable** for Publisher (no Publisher source in repo) | Structural absence, explicitly acknowledged in ADR‑018 itself |
| Technical architecture | HIGH | Directly read: `Cargo.toml`, `tauri.conf.json`, `capabilities/default.json`, full command list in `lib.rs::run()` |
| Contracts inventory | HIGH for existence/shape; MEDIUM for enforcement completeness | Gate scripts read directly but are static-text assertions, not semantic proofs |
| Build/Drop-in process | HIGH | Directly observable in the current uncommitted branch, which *is* a Drop-in in progress |
| Norway 2026 reference role | HIGH for its role as validation fixture; MEDIUM for current schema fidelity | Cross-confirmed across many validation docs; version mismatch noted separately |
| "Klarheit" as named pillar | MEDIUM (reconstructed, not literal) | Zero literal hits; concept present under other names |

## 31. Final System Model

**So verstehe ich Northern Lines Studio:**

Northern Lines Studio is the authoring half of a two-engine publishing system for a very specific, non-generic product: A5 print travelbooks that must feel like Northern Lines regardless of which journey or which of the two (eventually more) Editorial Worlds produced them. It is built by deliberately *subtracting* the degrees of freedom a general DTP tool or CMS would offer — no coordinates, no free frames, no arbitrary templates, no open asset library, no exposed internal vocabulary — and replacing them with a small, closed, named vocabulary at every layer: three Destination page effects, six Extension kinds, four Interest archetypes, two Editorial Worlds each built from the same five-layer contract, one Companion per World, and a page grammar of protected zones (Hero, Title, Content, Extension, Companion, Footer) that behave like siblings sharing a floor plan rather than roommates sharing a room.

Underneath this small user-facing vocabulary sits a genuinely rich, evolving domain model — a `.nls` format now on its 16th schema revision, a Rust backend that owns migration and validation with real referential-integrity checks, and a TypeScript layer that mirrors the same shapes for the UI. The product philosophy explicitly permits and expects this internal richness ("Intern darf Northern Lines Studio komplex sein") as long as none of it leaks unfiltered into the interface — which is why a "Travel Language" translation table between technical IDs and traveller words is treated as load-bearing architecture, checked by dedicated consistency gates, and why an entire section of the Product DNA is devoted to things Studio must never become (CMS, database editor, DTP-light, template marketplace, developer surface, feature pile).

Layout is not templated but *composed*: for any given page type, Studio evaluates a small, finite, curated set of allowed compositions against the real content (Content-Fit-before-Composition) and picks the calmest one that fits without ever shrinking type below defined minimums, clipping text, or letting content invade a protected zone — Companion and Footer above all. When nothing fits, the system says so in the same calm travel voice it uses everywhere else ("Diese Seite kann diesen Inhalt nicht mehr ruhig erzählen") rather than failing technically.

Studio explicitly stops short of being a complete publishing engine: it owns editorial state and offers a fast, plausible Editorial Preview, but the actual publishing truth — final geometry, typography enforcement, rendering, preflight — is reserved for Northern Lines Publisher, a system this repository describes at length but does not contain. Every architectural decision that touches layout is measured against the question "does this duplicate Publisher's job," and the repeated answer, by design, is no.

The development process mirrors the product philosophy: every feature must survive the same seven-step chain (Model → Rust → Migration → Command → Inspector → Preview → Tests), every build ships as both a Full Repo and a reproducible rsync Drop-in with its own `APPLY-DROPIN.md`, and roughly 39 small, fast consistency gates encode individual product rules as machine-checkable string/structural assertions — a lightweight but real defense against exactly the kind of "technically correct, product-alien" regression the team has clearly hit and corrected before (most visibly in the CMS-like Inspector regression documented and fixed in ECR‑020, and the binding-safe-area figure quietly corrected from 17 mm to 15 mm in ADR‑020).

## 32. Audit Statement

This analysis was performed in read-only mode.

No existing source code was modified.
No existing documentation was modified.
No configuration was modified.
No dependency was changed.
No test was modified.
No refactoring was performed.
No automatic fix was applied.
No commit was created.
No branch was created or modified.
No change was pushed.

The only artifact created during this phase is:

`STUDIO-UNDERSTANDING.md`

This phase evaluated system understanding only.

No code-review findings were created and no remediation was performed.
