# Build 029 · Interest Page Header & Intro Fix

## Ziel

Die Interest Pages erhalten eine ruhigere, nicht redundante Kopf-Grammatik und eine direkt editierbare Einleitung.

## Änderungen

- Interest wird nur einmal als blauer Seitenanker angezeigt.
- Der Ort ist der große Seitentitel.
- Die zusätzliche Orts-Unterzeile entfällt.
- `Wandern & Natur` wird als kanonischer Anker verwendet; kein separates `Draußen unterwegs` mehr.
- Die Einleitung ist direkt im Vertiefungs-Inspector editier- und speicherbar.
- Structured Interest Pages zeigen keinen redundanten generischen Story-Editor mehr.
- Archetypspezifische Fallback-Einleitungen bleiben Vorschläge, keine fest verdrahteten Inhalte.
- `.nls` bleibt 0.14.0; keine Migration erforderlich.

## Verbindliche Grammar

> **Interest = Seitenanker · Ort = Seitentitel · Einleitung = editierbare redaktionelle Öffnung.**

## Scope

Der Fix gilt für alle vier Interest-Archetypen. Andere Seitengattungen werden nicht verändert.
