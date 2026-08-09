# Northern Lines Studio – Build 022
## Destination Imagery Foundation

**Dokumenttyp:** Build-Spezifikation / Bildleitfaden
**Status:** Arbeitsgrundlage für Build 022
**Zweck:** Verbindliche Orientierung für Bildrollen, Zielgeometrien, Dateiformate und die UI-Hinweise zur Bildauswahl in Northern Lines Studio

---

# 1. Ziel von Build 022

Build 022 führt die erste kontrollierte Bildintegration für Destination Pages ein.

Der Fokus liegt **nicht** auf Asset Management, Bildbearbeitung oder freier Platzierung.

Der Fokus liegt auf einer einfachen, Northern-Lines-gerechten Frage:

> **Welches Bild eröffnet diesen Ort?**

Daraus folgt:

- Bilder werden **bewusst und einfach** ausgewählt
- die UI spricht **Travel Language**
- Bilder werden **rollenbasiert** gedacht
- die Bildauswahl bleibt **ruhig und verständlich**
- es gibt **keinen Crop-Editor**
- es gibt **keinen Focal-Point-Editor**
- es gibt **keine freie Geometrie**

---

# 2. Grundsatz

Da Build 022 **keinen Crop-Editor** vorsieht, wird **nicht ein einziges Bild** in alle Seitenwirkungen gezwungen.

Stattdessen arbeiten wir mit **passenden Bildrollen**.

Das vermeidet spätere Notlösungen und entspricht dem Produktprinzip:

> **Wenige starke Möglichkeiten. Viele persönliche Geschichten.**

---

# 3. Die Bildrollen

Für Destination Pages werden zunächst drei Bildrollen vorgesehen.

## 3.1 Weite

Verwendung für die Seitenwirkung:

- **Weite**

Charakter:

- breit
- flach
- ruhig
- atmosphärisch
- Panorama als Öffnung des Ortes
- kein dominanter Web-Hero
- kein hoher Marketing-Banner

Einsatz:

- flacher Panorama-Auftakt
- atmosphärischer Einstieg
- visuelle Öffnung der Seite

---

## 3.2 Bild links

Verwendung für die Seitenwirkung:

- **Bild links**

Charakter:

- hochformatiges Leitbild
- klarer Fokus
- gut lesbar
- ruhige Bildsprache
- geeignet für ein redaktionelles Travelbook

Einsatz:

- das Bild führt in den Ort
- der Text begleitet

---

## 3.3 Bild rechts

Verwendung für die Seitenwirkung:

- **Bild rechts**

Charakter:

- hochformatiges Leitbild
- klarer Fokus
- gut lesbar
- ruhige Bildsprache
- geeignet für ein redaktionelles Travelbook

Einsatz:

- die Geschichte führt
- das Bild begleitet

---

# 4. Zielgeometrien

Die folgenden Maße sind **Zielkorridore** für die Bildgestaltung.

Sie sind bewusst praxisnah formuliert und sollen helfen, passende Bilder vorzubereiten oder generieren zu lassen.

Ausgangspunkt:

- DIN A5 Hochformat
- Editorial World bleibt stabil
- Footer und Companion bleiben stabil
- Binding Safe Area: **15 mm Mindestzone**
- keine freie Bildgeometrie im Studio

## 4.1 Übersicht

| Bildrolle | Einsatz | Zielmaß (ca. mm) | Seitenverhältnis | empfohlene Generierungsgröße |
|---|---|---:|---:|---:|
| **Weite** | flaches Panorama | **118–122 × 26–32 mm** | **ca. 4:1** | **2400 × 600 px** |
| **Bild links** | hochformatiges Leitbild | **48–56 × 78–92 mm** | **ca. 2:3** | **1500 × 2250 px** |
| **Bild rechts** | hochformatiges Leitbild | **48–56 × 78–92 mm** | **ca. 2:3** | **1500 × 2250 px** |

## 4.2 Auflösungsreserve

Wenn Bilder gezielt erzeugt oder vorbereitet werden, ist eine leichte Auflösungsreserve sinnvoll.

Empfehlung:

- **Weite:** auch **2800 × 700 px** möglich
- **Bild links:** auch **1800 × 2700 px** möglich
- **Bild rechts:** auch **1800 × 2700 px** möglich

Diese Reserve ist hilfreich, ohne bereits in Bildbearbeitung oder Crop-Logik zu kippen.

---

# 5. Inhaltliche Anforderungen an die Bildmotive

## 5.1 Weite

Das Motiv für **Weite** sollte:

- als breites Panorama funktionieren
- Luft links und rechts besitzen
- keine wichtigen Motive an den äußersten Bildrändern tragen
- ruhig und atmosphärisch wirken
- keinen zu engen Bildausschnitt haben
- sich für einen flachen Banner eignen

Geeignet sind zum Beispiel:

- Stadtpanorama
- Hafenansicht
- Fjordblick
- Küstenlinie
- weite Architekturansicht
- ruhige Landschaftseröffnung

---

## 5.2 Bild links / Bild rechts

Das Motiv für **Bild links** oder **Bild rechts** sollte:

- hochformatig funktionieren
- einen klaren Hauptfokus besitzen
- nicht zu eng beschnitten sein
- genug Randluft besitzen
- in einem redaktionellen Travelbook ruhig wirken
- keine chaotische, überladene Szene zeigen

Geeignet sind zum Beispiel:

- Straßen- oder Hafenszene
- markante Architektur
- Ortsszene mit Tiefe
- charakteristischer Blick auf ein Reiseziel
- ein Motiv mit klarer Bildstruktur

---

# 6. Empfehlung für die praktische Bildvorbereitung

Für jeden Ort sollten nach Möglichkeit drei konkret benannte Bildvarianten vorbereitet werden:

- `ort-weite`
- `ort-bild-links`
- `ort-bild-rechts`

Beispiel:

- `bergen-weite`
- `bergen-bild-links`
- `bergen-bild-rechts`

Damit bleibt klar:

- welches Bild für welche Seitenwirkung gedacht ist
- warum das Bild eine bestimmte Geometrie besitzt
- dass Studio noch keinen Crop-Editor benötigt

---

# 7. Dateiformate

Für Build 022 sollten wir bewusst einfach bleiben.

Empfohlene Formate:

- **JPEG** für normale Fotos
- **PNG** nur dann, wenn es einen echten Grund gibt

Empfehlung:

- Farbraum praxisnah halten
- normale, robuste Bilddateien
- keine exotischen Formate
- keine komplexe RAW- oder EXIF-Logik in Build 022

Build 022 ist **keine** Bildverwaltung.

---

# 8. UI-Vorschlag in Travel Language

Die UI soll nicht nach Medienverwaltung klingen.

Stattdessen zum Beispiel:

## Ortsprofil

### Bild des Ortes

**Bild auswählen …**

Darunter – sofern ein Bild vorhanden ist – etwa:

- **Bild ersetzen**
- **Bild entfernen**

Keine Begriffe wie:

- Asset
- Media Library
- Manifest
- Resource
- Image Slot

---

# 9. Tooltip-Idee für die Bildgeometrie

Die vorgeschlagene Idee mit einem **Fragezeichen-Tooltip** ist sehr sinnvoll.

Sie passt gut zur Northern-Lines-Philosophie, weil sie:

- hilfreich ist
- nicht aufdringlich ist
- technische Information nur **bei Bedarf** zeigt
- den Inspector nicht überlädt

## Vorschlag

Neben dem Button:

**Bild auswählen …**
ein kleines **?**-Symbol

Beim Hover / Klick erscheint ein kurzer Tooltip oder ein kleines Popover.

---

# 10. Inhalt des Tooltips

Der Tooltip sollte **nicht technisch überladen** sein.

Er soll die Bildrolle erklären, nicht ein Mini-DTP-Handbuch werden.

## Beispieltext

### Für Weite

**Weite**
Breites, ruhiges Panorama.
Empfohlen: **ca. 4:1**
Zielgröße: **2400 × 600 px**

### Für Bild links / Bild rechts

**Bild links / Bild rechts**
Hochformatiges Leitbild mit klarem Fokus.
Empfohlen: **ca. 2:3**
Zielgröße: **1500 × 2250 px**

---

# 11. Erweiterter Tooltip mit Mini-Geometrie

Wenn wir etwas visueller werden wollen, könnte der Tooltip zusätzlich kleine abstrahierte Miniaturen zeigen.

Beispielhaft:

## Weite

```text
┌──────────────────────────────┐
│         WEITE                │
└──────────────────────────────┘
ca. 4:1
```

## Bild links

```text
┌──────────────┐
│██│          │
│██│          │
│██│          │
└──────────────┘
ca. 2:3
```

## Bild rechts

```text
┌──────────────┐
│          │██│
│          │██│
│          │██│
└──────────────┘
ca. 2:3
```

Wichtig:

- schlicht
- abstrahiert
- nicht zu dekorativ
- schnell erfassbar

---

# 12. Produktregel für den Tooltip

Der Tooltip erklärt nur das, was der Reisende gerade wissen muss.

Er soll **nicht** erklären:

- interne Asset-Struktur
- Publisher-Geometrie
- technische IDs
- Projektverzeichnisse
- Renderlogik

Der Tooltip hilft nur bei der Frage:

> **Welches Bild passt hier gut?**

---

# 13. Architekturhinweis

Auch wenn die UI einfach bleibt, sollten die Bildrollen semantisch sauber gedacht werden.

Wichtig:

- das Bild gehört zur **Destination**
- nicht zu frei gespeicherten X/Y-Koordinaten
- nicht zu einer technischen DTP-Ebene

Für Build 022 ist es sinnvoll, die Bildrolle intern eher neutral zu benennen, zum Beispiel:

- `primaryImage`
- oder rollenbezogen für die drei Seitenwirkungen

Welche konkrete technische Lösung gewählt wird, muss zur `.nls`-Logik passen.

Wichtig ist der Produktgrundsatz:

> **Die sichtbare UI bleibt einfach. Die technische Zuordnung bleibt intern.**

---

# 14. Ausdrücklich nicht Bestandteil von Build 022

Folgende Themen gehören **nicht** zu Build 022:

- Asset Management
- Crop Editor
- Focal Point
- Bildbearbeitung
- Drag-and-drop Layout
- freie Bildpositionierung
- Galerie pro Destination
- Metadatenverwaltung
- EXIF-Workflow
- AI-Bildanalyse
- automatische Motivempfehlungen
- weitere Layoutvarianten

Build 022 ist eine **Foundation**, keine Medienplattform.

---

# 15. Validation für Build 022

Ein sinnvoller Real-World-Test wäre:

## Beispiel Bergen

1. Ein Panorama für **Weite** wählen
2. Ein hochformatiges Bild für **Bild links** wählen
3. Ein hochformatiges Bild für **Bild rechts** wählen
4. Zwischen den Seitenwirkungen wechseln
5. Prüfen:

- wirkt **Weite** ruhig und atmosphärisch?
- funktioniert **Bild links** als bildgeführte Seite?
- funktioniert **Bild rechts** als textgeführte Seite?
- bleibt der Companion an seiner festen Position?
- bleibt der Footer stabil?
- bleibt die 15-mm-Bindungszone gewahrt?
- fühlt sich die Bildauswahl einfach und nicht technisch an?

---

# 16. Fazit

Build 022 soll nicht möglichst viel Bildtechnik einführen.

Build 022 soll den ersten guten, einfachen und Northern-Lines-gerechten Schritt ermöglichen:

> **Ein Ort bekommt ein Bild, das ihn glaubwürdig eröffnet.**

Die Bildauswahl bleibt:

- ruhig
- verständlich
- rollenbasiert
- ohne technische Überforderung

Und genau deshalb passt auch die kleine Tooltip-Idee sehr gut:

> **Hilfe bei Bedarf – nicht Technik auf Vorrat.**
