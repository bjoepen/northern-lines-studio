# Scope

## In Scope

Northern Lines Studio is planned as a macOS application for the visual and
editorial workflow around Northern Lines Travel Fieldbooks.

Initial product scope may include:

- project creation and management
- journey metadata
- destinations and sections
- supported Northern Lines page types
- structured content entry
- image and asset assignment
- curated layout variants
- visual preview
- validation feedback
- publishing workflow
- integration with Northern Lines Publisher

## Out of Scope for the Initial Product

The first product should not attempt to provide:

- a complete general-purpose DTP engine
- arbitrary free-form vector drawing
- professional illustration tools
- unrestricted font engineering
- full photo editing
- universal import of third-party publication formats
- replacement of Affinity Publisher or Adobe InDesign
- arbitrary layout scripting by end users

## Product Boundary

### Northern Lines Publisher

Responsible for:

- schemas
- validation
- content normalization
- asset resolution
- composition contracts
- content-fit calculations
- render jobs
- staging
- output preparation

### Northern Lines Studio

Responsible for:

- macOS user experience
- project navigation
- visual editing
- content entry
- preview
- layout-variant selection
- editorial decisions
- publishing orchestration

## Initial Non-Goals

The repository foundation does not yet authorize:

- Swift implementation
- framework selection
- UI design production
- app signing
- packaging
- release automation

Those decisions require a dedicated discovery and architecture phase.
