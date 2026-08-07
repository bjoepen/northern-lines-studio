# ADR-009 – Human Language First

## Status
Accepted – Build 011

## Context
Northern Lines Studio is not a general DTP application. Its users think in journeys, places, stories and memories, while the implementation necessarily works with projects, files, manifests, commands and persistence.

Exposing the technical vocabulary would force authors to learn the implementation model before they can work on a Travelbook.

## Decision
The user interface uses the language of the traveller and author wherever a technical term is not necessary for informed action.

Examples:

| Technical model | Studio language |
| --- | --- |
| Project open | Reise öffnen |
| Project close | Reise schließen |
| Project state | Reisestatus |
| Section/object | Story / named Story Component |
| Template | Editorial World |
| Generic text object | Einleitung, Fotografie & Erleben, Northern Lines Wissen, … |

Technical concepts remain valid internally and in engineering documentation. They do not become user-facing merely because the implementation uses them.

## Consequences
- UI copy is reviewed as part of product architecture, not cosmetic polish.
- New features must first define their author-facing meaning.
- File-format and implementation details stay below the editorial surface unless users genuinely need them.
- Studio may change technical implementation without changing the author's mental model.
