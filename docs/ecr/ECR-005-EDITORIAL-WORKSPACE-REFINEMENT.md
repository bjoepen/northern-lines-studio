# ECR-005 – Editorial Workspace Refinement

## Motivation

Build 005 proved that Studio can understand Editorial Grammar without making the interface louder. Real-world use in a maximized macOS window exposed two workspace issues:

1. the bottom project status area can consume a disproportionate amount of vertical space when no optional error banner is present;
2. the A5 page does not yet make full, calm use of the Editorial Desk when more window space becomes available.

The product direction remains unchanged: the page is the visual center and Studio must stay quieter than the Travelbook itself.

## Approved change

Build 006 shall:

- make the shell height allocation robust with and without an error banner;
- reduce the project status area to a slim status line;
- let the A5 page use more of the available Editorial Desk while preserving A5 proportions;
- keep a calm maximum preview scale and a minimum breathing space around the page;
- add a subtle page-change fade without introducing decorative motion;
- make the empty-project preview neutral and invitational rather than tied to the Norway sample;
- lightly refine Inspector spacing and contrast without adding controls;
- use **Editorial Desk** as the internal name for the central page workspace;
- keep the `.nls` project format unchanged at `0.4.0`.

## Explicit non-goals

Build 006 does not add editing, drag and drop, free layers, image import, Publisher integration, PDF export, a second Editorial World, toolbar features or arbitrary zoom controls.

## Product principle

> More available space should benefit the page, not the application chrome.
