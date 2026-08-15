# ADR-023 · Destination Interest Pages

## Status
Accepted for Build 026.

## Decision
A Destination remains the semantic centre of a place. Optional thematic pages are represented as `destination_interest` pages bound to the same `journeyStage`.

Build 026 supports exactly four semantic interests:

- `photography` – Fotografie
- `hiking_nature` – Wandern & Natur
- `culture_history` – Kultur & Geschichte
- `culinary_local` – Kulinarik & Lokal

A destination may own several different interest pages, but only one page per interest kind in the Foundation.

## UX language
Studio does not expose “archetype”, “subpage” or schema terms. The author-facing question is:

> **Was möchtest du in [Ort] erleben?**

## Invariants

- The main Destination page remains general and calm.
- Interest pages inherit the Travelbook's Editorial World.
- Companion, footer, safe zones and shared grammar remain World/Grammar responsibilities.
- No World colours, coordinates or free page geometry are persisted.
- Interest pages stay adjacent to their Destination in route navigation.
- Build 026 provides structure and shared authoring only; specialist modules come later.
