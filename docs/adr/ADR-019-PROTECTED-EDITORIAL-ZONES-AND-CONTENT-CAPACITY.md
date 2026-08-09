# ADR-019 – Protected Editorial Zones and Non-Destructive Content Capacity

## Status
Accepted for Build 021.

## Context
Destination pages must remain calm and usable even when content density changes. The proven Travel Fieldbooks show that one, two or three editorial modules can coexist on an A5 page, while the physical binding edge, footer and Fjord companion remain stable visual anchors.

The project format must not store final layout coordinates. Northern Lines Publisher remains authoritative for final geometry and Content Fit.

## Decision
Build 021 introduces preview-level layout resilience rules without changing `.nls` 0.8.0:

- a **17 mm binding safe area** on the left side of A5 destination pages;
- a protected **title zone**: the place name leads, the personal sentence follows with positive spacing;
- a protected **companion safe area** at the footer threshold;
- a protected **footer zone** that does not move between `Weite`, `Bild links` and `Bild rechts`;
- editorial module groups may use **one, two or three columns** when context and content support it;
- content capacity is classified internally as `comfortable`, `tight` or `overflow` for preview/testing purposes;
- capacity state never shrinks typography, discards content or writes geometry to `.nls`;
- arrival/departure remain semantic string values; Travel Language adds **„Uhr“** at display time for clock values.

## Consequences
Positive:

- binding, companion and footer become explicit layout invariants;
- dense pages gain horizontal composition options instead of box stacking;
- Studio can detect pressure before a full Publisher Content-Fit system exists;
- time entry is less repetitive for the traveller;
- no schema migration is required.

Trade-offs:

- Studio preview uses a heuristic content-capacity estimate, not authoritative Publisher fit;
- final A5 geometry still belongs to Northern Lines Publisher;
- future content groups such as Souvenirs, country-specific rules, Northern Lines Wissen or Photography must integrate with the same protected zones rather than bypass them.
