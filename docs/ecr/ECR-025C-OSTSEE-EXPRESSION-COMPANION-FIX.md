# ECR-025C · Ostsee Expression & Companion Fix

## Anlass

Build 025B beweist den World-Wechsel, zeigt aber zwei sichtbare Abweichungen: Der Fischotter wird in der Preview nicht geladen und die Ostsee-Expression bleibt farblich zu nah an Fjord.

## Änderung

1. Das bereits vorhandene Fischotter-Asset der Design Library wird in den öffentlichen Runtime-Pfad gespiegelt, den die Companion Registry referenziert.
2. Die Ostsee-Palette wird innerhalb der bestehenden World Expression deutlicher verwendet: Baltic/Steel für Hierarchie und Signets, Fog/Sand für ruhige redaktionelle Flächen, Amber gezielt für Souvenir.
3. Die adaptive Layout Grammar, Destination-Semantik, Extension-Semantik, Safe Zones und `.nls` bleiben unverändert.

## Nicht Bestandteil

- keine neue Layoutvariante
- kein Theme-Editor
- keine freie Farbwahl
- keine Änderung am `.nls`-Format
- keine Fjord-Regression
