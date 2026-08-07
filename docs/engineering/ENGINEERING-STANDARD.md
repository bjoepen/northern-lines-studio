# Engineering Standard

Für jeden Northern-Lines-Studio-Build gelten:

1. klarer Scope mit ausdrücklichen Nicht-Zielen
2. dokumentierte Architekturänderungen als ADR
3. technische Änderungen mit ECR, sobald bestehendes Verhalten geändert wird
4. automatisierte Tests für validierbare Kernlogik
5. manuelle Validierung des vollständigen Nutzerwegs
6. dokumentierte bekannte Einschränkungen
7. GitHub-taugliches vollständiges Repository-Paket
8. ein eindeutiger Commit-Vorschlag und reproduzierbarer Git-Ablauf

## Definition of Done

Ein Build ist erst abgeschlossen, wenn Quellcode, Dokumentation, Tests und Validierungsnachweis denselben freigegebenen Scope abbilden.

## Repository Drop-ins

Repository Drop-ins follow [`DROP-IN-STANDARD.md`](DROP-IN-STANDARD.md). Beginning with Studio Build 007, Drop-ins mirror repository paths directly and are applied with `rsync` dry-run + merge; Finder folder replacement and the temporary `payload/` wrapper are not part of the engineering workflow.
