# Background Proof PoC 001 – Acceptance Protocol

## Testziel

Nachweis, dass derselbe Studio-PDF-Pfad aus einem separaten versteckten WebView heraus verwendet werden kann, ohne den sichtbaren Editor umzuschalten.

## A. Build Gate

Erforderlich:

- pnpm check
- pnpm test
- pnpm build
- cargo test

Ergebnis:

[ ] PASS
[ ] FAIL

Bei FAIL wird der PoC nicht visuell bewertet.

## B. Main Window Invariant

Vor Beginn eine eindeutig erkennbare Destination im Hauptfenster auswählen, z. B. Bergen.

Dokumentieren:

Main selected page before:
____________________________

Background Proof starten.

Main selected page during:
____________________________

Nach Abschluss:

Main selected page after:
____________________________

PASS nur wenn:

before == during == after

Zusätzlich:

[ ] kein sichtbarer Seitenwechsel
[ ] kein sichtbarer Proof Mode
[ ] kein sichtbares Resize des Main Windows
[ ] kein Flackern durch die drei Proof-Seiten

## C. Background Proof – Destination

[ ] PDF erzeugt
[ ] genau eine Seite
[ ] DIN A5
[ ] richtige Destination
[ ] Hero korrekt
[ ] Titel korrekt
[ ] World Expression korrekt
[ ] Companion korrekt
[ ] Footer korrekt
[ ] keine sichtbare Veränderung des Main Windows

Ergebnis:

[ ] PASS
[ ] FAIL

## D. Background Proof – Photography Workshop

[ ] PDF erzeugt
[ ] genau eine Seite
[ ] DIN A5
[ ] korrekte Seite
[ ] Komposition entspricht dem sichtbaren Studio-Proof
[ ] Typografie korrekt
[ ] geschützte Zonen korrekt
[ ] keine sichtbare Veränderung des Main Windows

Ergebnis:

[ ] PASS
[ ] FAIL

## E. Background Proof – Notes / Memory

[ ] PDF erzeugt
[ ] genau eine Seite
[ ] DIN A5
[ ] korrekte Seite
[ ] Flächen korrekt
[ ] Linien/Punkte korrekt
[ ] Gradient bzw. vorhandene grafische Expression korrekt
[ ] keine sichtbare Veränderung des Main Windows

Ergebnis:

[ ] PASS
[ ] FAIL

## F. Vergleich

Die drei Background-Proofs werden visuell mit den bereits akzeptierten sichtbaren Proofs derselben Seiten verglichen.

Gefordert:

Background Proof ≈ accepted visible Proof

Bei layoutrelevanten Abweichungen:

FAIL

## G. Lifecycle

[ ] Hidden Host wird erfolgreich erzeugt
[ ] Projekt wird erfolgreich geladen
[ ] Seite wird erfolgreich resolved
[ ] Fonts/Assets werden abgewartet
[ ] Proof wird erzeugt
[ ] Hidden Host wird anschließend entfernt
[ ] Main Studio bleibt anschließend normal bedienbar

## H. Final Gate

PASS nur wenn:

- Build Gate PASS
- Main Window Invariant PASS
- Destination PASS
- Photography Workshop PASS
- Notes / Memory PASS
- Lifecycle PASS

Gesamtergebnis:

[ ] PASS
[ ] FAIL
[ ] INCONCLUSIVE

### Bei PASS

Keine automatische Produktionsintegration.

Nächster zulässiger Schritt:

Architekturreview für Background Document Proof.

Erst danach darf über einen vollständigen Document-Proof-Test gesprochen werden.

### Bei FAIL

Bestehenden Produktionspfad unverändert lassen.
Fehlerursache dokumentieren.
Keine alternative Rendering-Architektur implementieren.

### Bei INCONCLUSIVE

PoC stoppen.
Offene technische Ursache dokumentieren.
Scope nicht erweitern, um ein Ergebnis zu erzwingen.
