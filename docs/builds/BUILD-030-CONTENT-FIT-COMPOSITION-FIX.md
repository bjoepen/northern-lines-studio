# Build 030 Fix – Global Content Fit & Composition Contract

## Ziel
Der Fix macht aus den bisher beschlossenen Layoutregeln einen verbindlichen Laufzeitvertrag: **Content Fit entscheidet über die Komposition.**

## Behoben
- Interest-Komposition wird nicht mehr vor der Kapazitätsprüfung festgelegt.
- Für zwei strukturierte Einträge werden 1/2–1/2, 1/3–2/3, 2/3–1/3 und gestapelt geprüft.
- Die alte `grouped`-Sammelbox für mehrere unterschiedliche Interest-Einträge entfällt.
- `comfortable` wird zuerst geprüft; bei Interest Pages folgt höchstens die feste `tight`-Stufe.
- Passt keine erlaubte Variante, folgt `overflow` statt Clipping oder Safe-Zone-Verletzung.
- Die Regel wird global in Product DNA und Architektur verankert und gilt auch für Ortsseiten und künftige Seitentypen.

## Verbindliche Regeln
> **Content Fit entscheidet über die Komposition.**

> **Nicht sammeln, sondern erzählen.**

## Kein Scope-Zuwachs
- kein neues `.nls`-Format;
- keine Migration;
- keine frei positionierbaren Elemente;
- keine frei wählbare Layoutmatrix im Inspector;
- keine zusätzliche Typografie-Stufe.
