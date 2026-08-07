# Build 007 – Editorial Header Balance

## Goal

Build 007 refines the persistent Northern Lines Studio header after the maximized-window real-world review of Build 006. It follows the principle **Polish before Power**.

## Versions

- Northern Lines Studio: `0.7.0`
- `.nls` project format: `0.4.0` (unchanged)

## Main changes

### Balanced Editorial Frame

Brand, active Travelbook context and project control now occupy the full 70 px header height and are vertically centered on a common visual axis.

### Work before system context

When a project is open, the centered header names the active Travelbook first and shows `Editorial World · Fjord` below it. The Reference World number remains available in the sidebar and inspector, where it belongs as metadata.

### Quiet project control

The large light action is replaced with a compact translucent project control with a simple folder symbol. It remains discoverable without becoming the most visually prominent object in the application.

### Drop-in simplification

The approved Drop-in format no longer contains a `payload/` wrapper. The Drop-in root mirrors repository paths directly, and `APPLY-DROPIN.md` documents generic macOS paths without a personal user name.

## Non-goals

No authoring controls, layers, Publisher bridge, asset browser, layout editing or new Editorial World are introduced.

## Product principle

> Polish before Power.
