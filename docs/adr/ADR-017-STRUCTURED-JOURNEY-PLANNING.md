# ADR-017 – Structured Journey Planning

## Status
Accepted – Build 019

## Entscheidung

Grunddaten einer Reise gehören in das strukturierte `Journey`-Modell und nicht in
beliebige Markdown-Felder.

Build 019 ergänzt:

- `startDate`
- `endDate`
- `departurePlace`
- `returnPlace`
- `transport`
- `routeSummary`
- `travelFocus`

Die **Dauer** wird aus Start- und Enddatum abgeleitet und nicht redundant gespeichert.

## Travel Language

Die Oberfläche spricht nicht von Journey-Metadaten, sondern fragt:

- Wann geht es los?
- Wann kommst du zurück?
- Wo beginnt deine Reise?
- Wo endet sie?
- Wie reist du?
- Wie verläuft deine Route?
- Was ist dir auf dieser Reise wichtig?

## Scope-Grenze

Keine Karten, Buchungen, externen APIs, Wetterdaten oder Tagesplanung in Build 019.
