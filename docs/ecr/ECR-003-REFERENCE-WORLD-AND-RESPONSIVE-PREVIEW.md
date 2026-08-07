# ECR-003 – Reference World Foundation and Responsive Preview

## Motivation
Two needs emerged from real use of Build 003:

1. Fjord was visible but still stored as duplicated project metadata rather than as a Studio-owned Reference World.
2. The A5 preview remained at a fixed size when the application window was enlarged, so the primary content did not benefit from the available workspace.

## Requested change
- establish a World Library with Fjord as Reference World 001;
- move companion, design-language descriptors and grammar availability into that library;
- keep only `editorialWorldId` in `.nls` projects;
- migrate `.nls` 0.1.0 and 0.2.0 projects in memory to 0.3.0;
- scale the A5 preview proportionally to the available center workspace;
- preserve the calm UI and avoid new toolbars or DTP controls.

## Acceptance criteria
- Fjord is the only shipped world;
- Papageientaucher has role `editorial_companion`;
- unknown world IDs fail clearly;
- preview scaling always preserves the A5 ratio;
- maximization increases the preview until a calm maximum scale is reached;
- sidebar and inspector keep their established visual weight;
- Build 003 project data can be opened through migration;
- static checks, tests, frontend build and Rust tests are green locally.
