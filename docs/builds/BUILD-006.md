# Build 006 – Editorial Workspace Refinement

## Goal

Build 006 refines the real-world macOS workspace after the first Editorial Grammar test. It deliberately adds almost no new visible functionality. Instead, it makes Studio quieter, more responsive and more page-centered.

## Versions

- Northern Lines Studio: `0.6.0`
- `.nls` project format: `0.4.0` (unchanged)

## Main changes

### Slim project status line

The application shell now uses a flex-based vertical layout. The Travelbook workspace owns all remaining height whether or not an error banner is present. The project status is a fixed 26 px line instead of behaving like a large panel.

### Adaptive Editorial Desk

The central page workspace is internally named **Editorial Desk**. The A5 preview:

- preserves one proportional scale factor;
- uses more available width and height;
- keeps calm breathing space around the paper;
- remains centered;
- never exceeds the defined calm maximum scale.

### Quiet page transition

Selecting another page uses a short 190 ms opacity fade. The transition is intentionally restrained: it communicates continuity without becoming an animation feature.

### Neutral empty state

Before a project is opened, the page preview no longer presents the Norway sample as if it were active. It invites the user with a neutral Northern Lines message.

### Inspector polish

Inspector cards retain exactly the same information and hierarchy from Build 005 but use slightly softer borders, more spacing and lower visual contrast.

## Non-goals

No editor, arbitrary zoom control, new toolbar, free canvas, layer palette, asset browser, Publisher bridge, PDF renderer or second Editorial World is introduced.

## Product principle

> Studio may grow, but it must never become loud.
