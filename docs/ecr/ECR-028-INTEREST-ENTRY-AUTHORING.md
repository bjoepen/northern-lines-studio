# ECR-028 · Structured Interest Entry Authoring

## Decision

Replace parallel line-list authoring on Interest Pages with repeated semantic entries.

## Why

Parallel text fields make relationships implicit and fragile. A user should not have to understand that line 2 in one textarea belongs to line 2 in five other textareas. The semantic unit must be explicit before layout begins.

## Product rule

> Der Nutzer beschreibt den Eintrag. Studio komponiert die Darstellung.

## Consequences

- Photography owns focal length, light, motifs and guidance per Fotospot.
- Hiking owns start, duration, difficulty, nature targets and guidance per Route.
- Culture/History and Culinary/Local use the same shared entry foundation when their specialist builds arrive.
- Studio derives one shared editorial box or two boxes from content; no layout picker is exposed.
- Interest-only compact typography is adaptive, not default.
- No fixed-height clipping is allowed.
- `.nls` advances to 0.14.0.
