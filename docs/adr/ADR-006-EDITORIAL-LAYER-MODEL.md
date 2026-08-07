# ADR-006 – Editorial Layer Model

## Status

Accepted for Build 008.

## Context

Northern Lines Studio must eventually support richer editing without becoming a general DTP application. Classical layer stacks expose implementation detail and allow arbitrary object structures that do not reflect how a Travel Fieldbook is authored.

The approved product language distinguishes elements by editorial responsibility instead of z-order.

## Decision

Studio uses three fixed semantic layers:

```text
Editorial Frame
  Header · Footer · dynamic page number · Companion

Story
  Hero · title · text · Knowledge · photography · map · QR · quote · ...

Annotations
  future guides · selection · handles · non-published editing aids
```

### Editorial Frame

Carries continuity, identity and orientation across pages. The Companion is part of the Frame because it connects places and pages as a recurring emotional guide.

### Story

Contains the expression possibilities through which the author tells the page. A Story Component is typed by meaning, never by primitive shape.

### Annotations

Reserved for future editing assistance. Annotations never become publishing content.

## Consequences

- Studio does not expose arbitrary user-created layer stacks.
- Story Components can later become authoring targets without exposing rectangles/text frames.
- Publisher geometry remains outside this model.
- The model is intentionally small and stable enough to preserve the calm Studio interface.
