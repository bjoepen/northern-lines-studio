# Build 034 · Workshop Capacity Protection Regression Fix

Build 034 fixes a regression where the curated Fotografie-Workshop could extend secondary content into the protected Companion/Footer area.

The root cause was page-local geometry: the workshop preview claimed the full available page height independently of the shared A5 flex composition. The fix restores inheritance from the global page geometry and makes the `Licht & Wetter` bridge explicitly secondary.

## Rules restored

- shared A5 geometry remains authoritative;
- Companion and Footer are hard safe-zones;
- core workshop content wins over secondary bridge content;
- secondary content clears the Companion zone;
- no clipping, overlap or arbitrary font shrink;
- future curated heroes must inherit the same capacity contract.
