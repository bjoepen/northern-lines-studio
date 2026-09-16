# Build 049A · British Isles Typography Contract

Status: **CONTRACT APPROVED / IMPLEMENTATION NOT STARTED**

## Ziel

Build 049A schärft den generischen Editorial World Contract von Northern Lines Studio und definiert darauf aufbauend die vierte Editorial World **British Isles · Moor & Stein**.

Der Build reagiert auf einen Architekturpunkt, der mit der vierten World sichtbar wird: Typography war bereits die erste verbindliche World-Schicht, wurde technisch und vertraglich bislang aber zu knapp als reine Heading-/Body-Fontwahl behandelt.

## Entscheidung

Typography wird als **first-class World identity** festgeschrieben.

Jede Editorial World besitzt mindestens:

- eine Heading-Rolle;
- eine Body-Rolle;
- optional eine sparsame Accent-Rolle.

Die Rollen dürfen sich in Familie, Charakter, Gewicht und Rhythmus unterscheiden. Sie bleiben der shared Studio Geometry, der semantischen Hierarchie und Capacity Protection untergeordnet.

Verbindliche Acceptance-Invariante:

> **A World must remain visually distinguishable through typography and graphic expression without relying on Companion or World imagery.**

## British Isles

World ID: `britain`

Leitidee: **Moor & Stein**

Tagline: **WEATHERED ELEGANCE. TIMELESS PLACES.**

British Isles verwendet eine eigenständige literarisch-editoriale Serifensprache für die Hierarchie, eine ruhige buchartige Body-Sprache und optional eine zurückhaltende Script-/Handwriting-Stimme für kurze Akzente.

Die konkrete technische Font-Auswahl erfolgt erst in der Expression-Phase nach Prüfung von macOS-Verfügbarkeit, Fallback/Packaging, A5-Lesbarkeit und Capacity.

## Architekturgrenzen

049A verändert nicht:

- Page Types;
- Page Grammar;
- Destination Grammar;
- Renderer;
- `App.svelte`;
- `.nls`-Schema;
- Golden-Build-040-Geometrie;
- Companion Protection;
- Production/PDF/PDF-A authority;
- Curated Asset Registry.

## Folgephasen

- **049B** — World / Layout / Companion / native Persistence Integration
- **049C** — British Isles World Expression inklusive Typography
- **049D** — Extensibility Acceptance, Packaging und Real-World-Test
- **050** — British Isles Curated Assets

## Dokumente

049A aktualisiert:

- `docs/editorial-worlds/EDITORIAL-WORLD-CONTRACT.md`

049A ergänzt:

- `docs/editorial-worlds/BRITISH-ISLES-WORLD-CONTRACT.md`
- `docs/builds/BUILD-049A-BRITISH-ISLES-TYPOGRAPHY-CONTRACT.md`

## Milestone Statement

> **Build 049A makes typography an explicit first-class World identity contract and defines British Isles · Moor & Stein as its first acceptance case, without changing Northern Lines Studio's shared page language.**
