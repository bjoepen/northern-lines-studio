# Build 045 · Destination Identity Integrity

## Decision

Accepted audit finding `AUD-DEST-001` is repaired without changing the `.nls` schema.

Runtime rename operations resolve a Destination through the persisted relationship:

```text
JourneyStage.destinationId -> Destination.id
```

They do not derive an existing Destination identity from:

```text
"destination-" + JourneyStage.id
```

## Invariant

Creation and legacy migration may derive an initial stable identity.

Once persisted, runtime updates must resolve through that persisted identity.

A visible rename changes:

- `JourneyStage.title`
- `Destination.name`
- Destination Page `title`
- existing authored page title when present

A visible rename does **not** change:

- `JourneyStage.id`
- `JourneyStage.destinationId`
- `Destination.id`
- destination page `journeyStage`
- content paths merely because the visible name changed

## Regression

Build 045 adds a Rust regression case whose Stage ID and Destination ID are deliberately not derivable from one another. The test renames the visible place to `Stavanger` and verifies that all visible names synchronize while every stable identity remains unchanged.

## Scope

No format bump.
No migration.
No existing `.nls` rewrite.
No layout or design change.
No asset change.
