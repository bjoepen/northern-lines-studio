# ADR-018 – Publisher-Owned Layout Grammar and Interactive Preview Boundary

**Status:** Accepted for Build 020 foundation; runtime bridge remains to be validated with a Publisher binary.

## Context

Build 020 introduces structured Destination Profiles and three curated layout variants. Northern Lines Studio must provide an immediate editorial response without becoming a second publishing engine.

Northern Lines Publisher remains responsible for the publishing truth: schemas, final validation, Layout Grammar, Content Fit, render jobs, assets and preflight. Duplicating those rules in Studio would create two potentially divergent layout engines.

## Decision

1. Studio owns journey state, Destination Profiles, authoring state and the user's layout choice.
2. Publisher owns authoritative publishing composition and final rendering.
3. Studio may render a fast **Editorial Preview** that expresses the selected layout variant, but this preview must not introduce independent publishing geometry contracts.
4. The `.nls` file stores the semantic layout choice (`destination-hero-banner`, `destination-hero-left`, `destination-hero-right`), not coordinates.
5. Build 020 does not introduce free positioning, millimetre geometry or a second layout grammar.
6. The current CLI/sidecar boundary remains the planned initial Publisher connection. A persistent process/API is considered only after measured evidence shows that CLI roundtrips are unsuitable for interactive high-fidelity preview.

## Preview boundary

```text
Editorial change
      │
      ▼
Northern Lines Studio
      │
      ├── immediate Editorial Preview
      │
      └── later Publisher request
                 │
                 ▼
       Northern Lines Publisher
                 │
                 ▼
       authoritative Publishing Preview / output
```

The user-facing product should expose a coherent Preview experience; the technical distinction is an implementation concern.

## Consequences

### Positive

- one publishing truth;
- no duplicated geometry rules;
- Studio stays focused on travel and editorial decisions;
- Publisher remains independently testable/headless;
- layout changes are non-destructive semantic decisions.

### Costs

- the future high-fidelity preview bridge needs a versioned contract;
- CLI startup and render latency must be measured before choosing the long-term transport;
- Studio's Editorial Preview must remain intentionally constrained to avoid accidental engine duplication.

## Build 020 validation

Build 020 ships a Publisher spike harness (`scripts/publisher-integration-spike.mjs`). The repository does not contain a Northern Lines Publisher executable, so timing measurements are not fabricated. The harness can be run once a Publisher binary/CLI contract is available.

## Build 020 Final UX clarification

The final UX review does not change this boundary. Studio's visible Travel Language is **Ortsprofil**, **Seitenwirkung**, **Weite**, **Bild links** and **Bild rechts** while the persisted layout IDs remain unchanged. The **Weite** editorial preview is intentionally broad, flat and quiet; its exact final A5 geometry remains Publisher-owned. No domain field is repurposed to satisfy a UI question.
