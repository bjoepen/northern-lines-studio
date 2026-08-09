# ADR-013 – `.nls` als Reisedokument

## Status
Accepted – Build 016

## Entscheidung

Northern Lines Studio registriert `.nls` unter macOS als eigenes Reisedokument.
Die `.nls`-Struktur bleibt intern ein Paket, wird im Finder jedoch als Einheit behandelt.

Der Öffnungsweg ist unabhängig davon, ob Studio bereits läuft:

- **Kaltstart:** Finder-Doppelklick startet die installierte App und übergibt den `.nls`-Pfad.
- **Laufende App:** macOS liefert ein Open-Event an Studio; Studio öffnet dieselbe Reise über den bestehenden ProjectSession-Ladeweg.

## Architektur

`RunEvent::Opened` → Runtime Open Request → Frontend Event / Pending Request → `load_nls_project` → `ProjectSession`

## Grundsatz

> Der Reisende öffnet kein Projekt. Er öffnet seine Reise.
