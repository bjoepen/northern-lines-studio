# ECR-024B — Extension Capacity Protection

## Problem
Adaptive Editorial Extension Zones can still exceed the physical capacity of an A5 destination page. In the stress case, long extension copy overlaps the protected Companion/Footer area.

## Decision
Protected zones are hard boundaries. Adaptive grammar may try its finite composition states and existing page effects, but it may not recover space by shrinking type, clipping copy, moving the Companion or covering the Footer.

When the finite grammar cannot fit the content, Studio enters an overflow state and tells the traveller:

> **Diese Seite kann diesen Inhalt nicht mehr ruhig erzählen.**

Automatic continuation pages are deliberately out of scope for this fix.
