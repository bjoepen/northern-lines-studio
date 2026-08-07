# ECR-010 – Story Authoring Stabilization

## Trigger
The first real-world authoring validation of Build 010 exposed three integration findings: a strict TypeScript test diagnostic, an inaccurate Build-009 migration fixture, and missing runtime project-path continuity during persistence.

## Decision
Correct all findings within Build 010 before starting the next feature build. Preserve the `.nls` project format at `0.5.0` and keep local filesystem paths outside persisted project content.

## Acceptance
- all automated gates green;
- first and repeated saves work in one Studio session;
- authored content survives page navigation and full application restart;
- Build-009 migration test is schema-accurate.
