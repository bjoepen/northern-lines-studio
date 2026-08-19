# Fjord World · Curated Hero Contract

Status: **APPROVED · Build 035**

## Zweck

Curated Heroes sind feste Bestandteile der Fjord Editorial World. Sie lockern kuratierte Companion- und Interest-Seiten visuell auf, ohne deren redaktionelle Geometrie in eine Bildseite zu verwandeln.

> **World bestimmt das Bild. Die Seite bestimmt seine Aussage. Der Reisende muss nichts auswählen.**

Curated Heroes sind **keine Nutzer-Assets**. Sie werden nicht im `.nls`-Projekt gespeichert, nicht über den Inspector gewählt und nicht durch Uploads ersetzt.

## Verbindliche Eigenschaften

- genau ein Hero pro unterstütztem Seitentyp;
- fest an die Fjord World gebunden;
- Northern-Lines-Hero-Stil: malerisch / aquarellartig, organische weiche Kanten, keine harte Fotokarte;
- keine Caption, kein Badge, kein Rahmen und keine Bildbedienung;
- keine Nutzerwahl, kein Upload, kein Ersetzen, kein Entfernen;
- weiße Seitenfläche bleibt `#FFFFFF`;
- World Expression entsteht durch Bild, Typografie, Akzente und Companion – nicht durch eine eingefärbte Seite.

## Unterstützte Fjord-Seiten

| Semantik | Curated Hero |
| --- | --- |
| Fotografie | Fjord-/Stadtmotiv mit fotografischer Licht- und Raumwirkung |
| Wandern & Natur | Fjordlandschaft mit Weg, Naturraum und Weite |
| Kultur & Geschichte | Bergen/Hanse als kulturhistorisch lesbare Stadtansicht |
| Kulinarik & Lokal | Hafen-/Marktszene mit lokaler Küche und Küstenbezug |
| Fotografie-Workshop | fotografische Fjordszene mit bewusst lesbarer Tiefe, Blickführung und Licht |

Die technische Zuordnung liegt in `src/lib/curated-heroes.ts`.

## Head-Flow Grammar

Der Curated Hero gehört **ausschließlich zum Kopfbereich** der Seite.

1. Titel und Einleitung beginnen in der bestehenden Seitengeometrie.
2. Das Hero sitzt rechts im freien Kopfbereich.
3. Einleitungstext darf korrekt links neben dem Hero und – wenn nötig – darunter weiterfließen.
4. Vor Beginn der regulären Inhaltsmodule endet der Textfluss explizit.
5. Danach verwenden die Inhaltsmodule wieder ihre vollständige bestehende Breite und Grammar.

> **Das Hero darf mit dem Text kuscheln. Es zieht nicht das Mobiliar der Seite auf seine Seite.**

Insbesondere darf das Hero **nicht**:

- die 2×2-Workshopmodule nach links verschieben;
- Interest-Module schmaler machen;
- Companion oder Footer verschieben;
- eine zweite innere Safe-Zone erzeugen;
- die globale A5-Geometrie verändern.

## Größenreferenz

Der **Fotografie-Workshop** ist der verbindliche Worst-Case und damit die Größenreferenz.

- `Standard`: maximal die im freigegebenen Workshop-Kopf vorhandene freie Fläche rechts;
- `Compact`: kleinere systemische Variante, falls Content Fit sie benötigt;
- keine stufenlose Nutzer-Skalierung.

Das Hero bleibt dem Kerninhalt untergeordnet.

## Capacity Protection

Jede Seite mit Curated Hero erbt die globale Capacity Protection.

Priorität:

1. Companion Safe Zone schützen;
2. Footer Safe Zone schützen;
3. Lesbarkeit und Kerninhalt schützen;
4. Hero von `Standard` auf `Compact` reduzieren;
5. zulässige Grammar-Varianten prüfen;
6. wenn weiterhin kein ruhiger Fit möglich ist: Overflow-Zustand.

Verbindliche Travel Language:

> **Diese Seite kann diesen Inhalt nicht mehr ruhig erzählen.**

Das Hero darf niemals Anlass sein, Typografie unkontrolliert zu schrumpfen, Kernmodule zu clippen oder geschützte Zonen zu verletzen.

## World Asset Contract

Fjord Curated Heroes liegen als Studio-/World-Assets unter:

```text
public/design-library/worlds/fjord/curated-heroes/
```

Sie gehören nicht zum Reiseprojekt und werden nicht in `.nls` dupliziert.

## Inspector Contract

Für Curated Heroes gibt es **keine Traveller-Bedienelemente**.

Nicht zulässig:

- Hero auswählen
- Hero ersetzen
- Hero hochladen
- Hero entfernen
- Hero-Galerie
- Crop/Focal Point/Drag & Drop

Der World-Wechsel darf das Bild systemisch austauschen, ohne den Seiteninhalt zu verändern.

## Regression Gates

Builds, die diese Grammar berühren, müssen mindestens prüfen:

- Fjord Hero wird nur auf unterstützten Seiten gerendert;
- Hero ist nicht authorierbar;
- Intro darf um das Hero fließen;
- reguläre Module beginnen wieder über volle Breite;
- Companion und Footer bleiben invariant;
- Seitenfläche bleibt `#FFFFFF`;
- keine zweite Safe-Zone;
- Workshop als Worst-Case bleibt kapazitätssicher;
- World-/Hero-Wechsel verändert keine Semantik oder Inhalte.

## Freigabestatus

Der Fjord-Stand wurde in Build 035 im Real-World-Test visuell freigegeben.

**Status: PASS / MASTER REFERENCE**
