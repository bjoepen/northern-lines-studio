# ECR-031 — Travel Companion Foundation: Licht

## Change
Replace the generic Knowledge placeholder for `photography_light` with a curated, reusable Light companion page and a dedicated calm inspector surface.

## Data impact
`.nls` 0.14.0 → 0.15.0. Existing Light pages are normalized to `title`, `light_phases`, `photography`, `introduction`. No travel-specific text is invented during migration.

## Research impact
Curated statements are maintained in `src/lib/travel-companion-light.ts`; research provenance is documented in `docs/research/BUILD-031-LIGHT-RESEARCH.md`.
