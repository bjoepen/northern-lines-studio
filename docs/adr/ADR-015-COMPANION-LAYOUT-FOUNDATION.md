# ADR-015 – Companion Layout Foundation

## Status
Accepted – Build 018

## Entscheidung

Editorial Companions sind keine frei platzierten DTP-Objekte. Die Editorial World
definiert zunächst eine semantische Companion Zone.

Für Fjord gilt:

- erster Auftritt: `journey_planning`
- Position: `bottom-left`
- Pose: `default`
- Spiegelung: `false`
- Größe: `small`

Cover, Willkommen und Inhaltsverzeichnis bleiben companion-frei.

## Grundlage

Das Norwegen Fieldbook 2026 zeigt den Companion erstmals auf der Reiseplanung und
danach als wiederkehrenden, unaufdringlichen Begleiter. Build 018 übernimmt dieses
bewährte Prinzip, reduziert es für die Foundation aber bewusst auf eine Pose und eine
Position.

## Zukunft

Mehrere Posen, Spiegelung und freie/restriktive Platzierung bleiben möglich, werden
aber erst auf Basis echter redaktioneller Anforderungen entschieden.

> Der Companion begleitet die Reise. Er eröffnet sie nicht.
