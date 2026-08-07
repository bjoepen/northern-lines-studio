# ECR-008 – Companion Collection Foundation

## Change

Introduce the first shared Northern Lines Companion Collection and replace the embedded Fjord companion object with a stable registry reference.

## Scope

- Companion types and registry
- Design Library asset structure
- metadata and manifest
- Fjord `companionId` integration
- registry/asset/metadata validation
- no second Editorial World
- no image rendering in Studio
- no Publisher invocation

## User impact

The visible workspace remains intentionally unchanged. The existing Inspector continues to show `Papageientaucher`, now resolved from the Companion Collection rather than duplicated inside the Fjord World definition.

## Compatibility

No persistent project schema change. `.nls` remains `0.4.0`.
