# ADR-038 — Orientierung, Erinnerungen and Soft World Imagery

## Decision

Northern Lines uses Travel Language for the two utility pages:

- `contents` is presented as **Orientierung**;
- `notes` is presented as **Erinnerungen**.

Orientation is image-free by contract. Memories may retain one subordinate world-owned Curated Accent.

Curated Fjord and Ostsee imagery uses a shared soft watercolor-edge treatment. World identity comes from the image content and world palette, not from a different geometric framing language.

## Consequences

- internal persistence identifiers remain stable;
- no `.nls` migration;
- no image picker or user control is introduced;
- white space becomes part of the image composition;
- hard rectangular image tiles are excluded from this grammar.
