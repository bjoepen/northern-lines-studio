# Build 031 · Page Geometry Regression Fix

## Problem

The first Light layout polish added page-local padding inside the already padded A5 page. This created a second, artificial safe zone around the Travel Companion content and visibly shrank the usable page area compared with Destination pages such as Bergen.

## Correction

- `light-companion-preview` now uses the existing A5 content box directly (`padding: 0`).
- The physical page geometry remains authoritative.
- Binding, Companion and Footer protection stay semantic and local; they are not converted into an additional all-around frame.
- The Light page keeps the approved 3+1 knowledge composition, but now uses the real available A5 width.
- The fourth module uses the full row with a three-part internal composition so the available width is used instead of being stacked unnecessarily.

## Binding rule

> Safe-Zones are semantic, not decorative.

A page type may not create a second generic inner safe zone inside the common A5 page grammar.
