# ECR-007 – Story Components Foundation

## Status

Approved / implemented in Build 008.

## Problem

Build 005 can validate that grammar components are present, but Studio still treats component IDs mainly as completeness markers. The author-facing meaning and editorial layer responsibility are not represented as a reusable domain object.

## Change

Introduce a derived Story Components model that:

- maps grammar component rules to semantic component definitions,
- assigns editorial roles such as atmosphere, narrative, photography, knowledge or memory,
- distinguishes present, optional-available, missing-required and unexpected states,
- materializes the Editorial Frame separately,
- reserves Annotations without exposing editing controls,
- presents Story Components quietly in the Inspector.

## Compatibility

No `.nls` schema change is required. Build 008 remains project format `0.4.0`; Story Components are derived from existing `page.components` plus the Editorial Grammar.

## Non-goals

No text editing, image import, drag-and-drop, free positioning, Publisher integration, second Editorial World or generic DTP layer panel.
