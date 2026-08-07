# Build 008 – Story Components Foundation

## Version

Northern Lines Studio `0.8.0`

`.nls` project format: `0.4.0` (unchanged)

## Purpose

Build 008 teaches Studio to understand the concrete semantic expressions that make up a Northern Lines page. Editorial Grammar says what may or must exist; Story Components materialize those rules as author-facing concepts.

## Implemented

- semantic `StoryComponentDefinition` registry
- derived `StoryStructure` for the selected page
- present / optional / missing / unexpected component states
- explicit Editorial Frame view
- reserved Annotations layer
- Story Components Inspector card
- deterministic Story Component unit tests
- ADR-006 Editorial Layer Model
- no `.nls` migration

## UX principle

> In Northern Lines Studio there are no generic tools where an editorial expression will do.

The Inspector names `Hero`, `Northern Lines Wissen`, `Fotografie`, `Zitat` and similar expressions; it does not introduce `Rectangle`, `Text Box` or arbitrary layer objects.

## Non-goals

- Story editing
- component insertion/removal controls
- canvas selection handles
- free layout
- Publisher bridge
- final rendering
- additional Editorial Worlds
