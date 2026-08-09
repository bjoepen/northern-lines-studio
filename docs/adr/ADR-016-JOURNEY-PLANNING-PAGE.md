# ADR-016 – Journey Planning als semantische Seite

## Status
Accepted – Build 018

## Entscheidung

`Reiseplanung` wird als eigener Seitentyp `planning` mit Rolle `journey_planning`
Teil jeder neuen Reise.

Sie liegt zwischen Front Matter und Route und ist gleichzeitig der erste reguläre
Auftrittspunkt des Companions.

Das `.nls`-Format steigt deshalb von 0.5.0 auf 0.6.0. Projekte aus Build 017 werden
beim Öffnen automatisch ergänzt.
