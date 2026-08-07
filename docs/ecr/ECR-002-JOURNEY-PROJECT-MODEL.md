# ECR-002 – Introduce Journey Project Model

## Status

Approved for Build 003.

## Reason

Build 002 groups pages from technical page types. This is sufficient for a prototype, but it does not express the Northern Lines domain: journey, destination, travel knowledge, workflow and memory.

## Change

- increment application version to `0.3.0`
- increment `.nls` project format to `0.2.0`
- add `journey` and `journey.stages`
- add explicit `page.role`
- allow `journeyStage` and `knowledgeType` references
- add migration from `0.1.0` to normalized `0.2.0`
- group the workspace from editorial roles
- show semantic role and journey-stage information in the Inspector

## Compatibility

Legacy `0.1.0` projects remain readable. Studio does not rewrite them during load.

## Risk

Incorrect role inference could place legacy pages in the wrong workspace section. Migration tests and explicit mappings mitigate this risk.
