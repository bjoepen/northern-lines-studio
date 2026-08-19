# Northern Lines Studio – Produkt-DNA & Retrospektive

**Stand:** Build 023 – Destination Composition Refinement
**Projekt:** Northern Lines Studio
**Dokumenttyp:** Dauerhafte Produkt-, UX- und Layoutreferenz
**Zweck:** Verbindliche Zusammenfassung der bisher entwickelten Produktphilosophie, UX-Grundsätze, Architekturgrenzen und Layoutregeln
**Status:** Referenzdokument für alle nachfolgenden Builds

---

## 1. Warum dieses Dokument existiert

Northern Lines Studio ist über viele Builds nicht einfach durch das Hinzufügen von Funktionen entstanden, sondern durch eine immer klarere gemeinsame Vorstellung davon, **wie sich Travel Publishing anfühlen soll**.

Viele der wichtigsten Entscheidungen sind keine technischen Details, sondern Produktprinzipien:

- Wie viel Komplexität darf der Reisende sehen?
- Welche Sprache spricht Studio?
- Wie viel Freiheit ist sinnvoll?
- Welche Aufgaben gehören zu Studio – und welche zum Publisher?
- Wie werden Reise, Orte und Geschichten strukturiert?
- Wie verhindern wir, dass aus Studio ein allgemeines DTP-Programm oder ein CMS wird?
- Wie bleibt ein A5-Travelbook belastbar, wenn Inhalte wachsen?
- Welche visuellen Elemente sind Teil der Editorial World und deshalb nicht verhandelbar?

Dieses Dokument hält diese Antworten zusammen.

Es soll verhindern, dass spätere Builds technisch korrekt, aber produktseitig fremd wirken.

---

# 2. Der zentrale Leitgedanke

> **Intern darf Northern Lines Studio komplex sein. Für den Reisenden muss es sich selbstverständlich anfühlen.**

Das ist der wichtigste Produktgrundsatz des gesamten Projekts.

Technische Komplexität darf existieren:

- im Datenmodell,
- im `.nls`-Projektformat,
- in Rust,
- in Migrationen,
- in Commands,
- in der Publisher Engine,
- in Layout Grammars,
- in Content-Fit-Regeln,
- in Consistency Gates,
- in Tests.

Sie darf aber nicht ungefiltert in die Produktoberfläche gelangen.

Studio soll **nicht erklären, wie es intern funktioniert**.

Studio soll dem Reisenden helfen, eine Reise zu planen, einen Ort zu erzählen, eine Seite zu beurteilen und ein Travelbook zu gestalten.

---

# 3. Northern Lines Studio ist kein allgemeines DTP-Programm

Northern Lines Studio ist eine spezialisierte visuelle und redaktionelle Arbeitsumgebung für Travel Publishing.

Es ist ausdrücklich **kein**:

- Affinity-Publisher-Ersatz,
- InDesign-Ersatz,
- freier Layoutdesigner,
- CMS,
- Datenbankeditor,
- Formularsystem,
- technisches Publishing-Frontend.

Der Reisende soll nicht mit folgenden Dingen arbeiten müssen:

- X/Y-Koordinaten,
- freien Textrahmen,
- beliebigen Rasterdefinitionen,
- frei verschiebbaren Elementen,
- manueller Box-Geometrie,
- hundert Templates,
- Layout-Makros,
- technischen IDs,
- Asset-IDs,
- Manifesten,
- internen JourneyStage-Begriffen.

Der Grundsatz lautet:

> **Der Inhalt gehört zur Reise und zum Ort. Das Layout gehört zur Erzählweise.**

Studio speichert semantische Entscheidungen, keine finalen Layoutkoordinaten.

---

# 4. Das Produktprinzip in einem Satz

> **Wenige starke Möglichkeiten. Viele persönliche Geschichten.**

Northern Lines Studio soll nicht möglichst viele Funktionen sichtbar machen.

Es soll wenige, klar verständliche Entscheidungen anbieten, die stark genug sind, viele individuelle Travelbooks zu tragen.

Ein gutes Studio-Feature fragt deshalb nicht:

> „Welche technischen Optionen können wir noch anzeigen?“

Sondern:

> „Welche Entscheidung muss der Reisende hier wirklich treffen?“

---

# 5. Travel Language

Studio spricht **Travel Language**, keine technische Sprache.

Technische Begriffe dürfen intern existieren, aber nicht als sichtbare Produktoberfläche erscheinen.

## Beispiele

| Intern | Studio |
|---|---|
| Destination | Ortsprofil / Reiseziel |
| JourneyStage | Deine Route / Reiseziel |
| Layout Variant | Seitenwirkung |
| destination-hero-banner | Weite |
| destination-hero-left | Bild links |
| destination-hero-right | Bild rechts |
| Asset | Bild |
| Manifest | nicht sichtbar |
| Reference World | Editorial World bzw. im normalen Workflow möglichst gar nicht technisch benennen |
| Grammar | nicht als normale Reisenden-UX |
| Destination Profile | Ortsprofil |

Die UI soll nicht erklären, wie Studio intern organisiert ist.

Sie soll den Nutzer durch seine Reise führen.

---

# 6. Die wichtigste Fläche ist das Travelbook

Die Priorität der Oberfläche lautet:

1. **Travelbook / Canvas**
2. Inspector
3. Navigation
4. technische Infrastruktur – unsichtbar

Der Canvas ist die Hauptfläche.

Der Inspector unterstützt die redaktionelle Entscheidung.

Er darf niemals mit der Seite um Aufmerksamkeit konkurrieren.

Daraus folgen:

- viel Weißraum,
- klare visuelle Hierarchie,
- wenige Entscheidungen gleichzeitig,
- kleine logisch gruppierte Bereiche,
- keine Formularwand,
- keine unnötigen technischen Informationen,
- keine Funktion nur deshalb sichtbar machen, weil das Datenmodell sie besitzt.

---

# 7. Die Rolle des Inspectors

Der Inspector ist kein Datenbankeditor.

Er ist ein **ruhiger redaktioneller Begleiter**.

Die Frage ist nicht:

> „Welche Felder besitzt Destination?“

Sondern:

> „Was muss ich über diesen Ort jetzt entscheiden?“

## Bevorzugte Hierarchie für Ortsprofile

### ORTSPROFIL

Beispielhafte Leitfrage:

> **Was bedeutet Bergen für deine Reise?**

Primäre redaktionelle Felder:

- Der Ort in Kürze
- Was möchtest du erleben?
- weitere redaktionelle Fragen nur dann, wenn dafür ein semantisch passendes Feld existiert

Wichtig:

Bestehende Domain-Felder dürfen **niemals semantisch zweckentfremdet** werden.

Wenn für „Was möchtest du fotografieren?“ kein passendes persistiertes Feld existiert, wird dafür weder ein neues Feld innerhalb eines laufenden Scope eingeführt noch ein vorhandenes Feld missbraucht.

### REISE VOR ORT

Sekundärer, ruhiger Bereich:

- Ankunft
- Abfahrt
- Zeitzone

### SEITENWIRKUNG

Visuelle Auswahl:

- Weite
- Bild links
- Bild rechts

Weitere strukturierte Daten können erhalten bleiben, aber nachgelagert oder einklappbar dargestellt werden.

---

# 8. Sichtbarkeit ist nicht gleich Datenbestand

Ein entscheidender Grundsatz:

> **Nicht jede vorhandene Information muss jederzeit sichtbar sein.**

Das Datenmodell darf reich sein.

Die Oberfläche darf selektiv sein.

Spätere Ortsprofile können beispielsweise enthalten:

- Der Ort in Kürze
- Geschichte & Hintergründe
- Was möchte ich erleben?
- Fotografie & Erleben
- Northern Lines Wissen
- Praktische Informationen
- länderspezifische Hinweise
- typische Mitbringsel & Souvenirs
- Karten / Hotspots
- QR / externe Ziele
- persönliche Notizen

Aber daraus folgt nicht:

> Jede Destination-Seite zeigt automatisch alle diese Module.

Studio muss langfristig unterscheiden können zwischen:

- **Information ist vorhanden**
- **Information wird auf dieser Seite erzählt**

Das ist eine redaktionelle Entscheidung, keine freie DTP-Funktion.

---

# 9. Die redaktionelle Tiefe kommt aus den echten Fieldbooks

Die bestehenden Northern-Lines-Fieldbooks sind nicht nur visuelle Referenzen, sondern Produktbeweise.

Sie zeigen, dass eine Ortsseite gleichzeitig:

- atmosphärisch,
- praktisch,
- fotografisch,
- informativ,
- persönlich

sein kann.

Das Norwegen-Fieldbook zeigt bereits Ortsseiten mit Elementen wie:

- Ortsname
- Subline
- Einleitung
- Ankunft
- Abfahrt
- Aufenthaltsdauer
- Zeitzone
- Fotospots
- Karten
- Fototipps
- praktische Informationen
- Notizen
- QR-Bezug

Die spätere Studio-Struktur muss diese Tiefe aufnehmen können, ohne die Seite in ein technisches Raster zu verwandeln.

---

# 10. Build 019 – Journey Planning Foundation

Build 019 war ein wichtiger Wendepunkt.

Studio begann erstmals, die **Reise selbst als semantisches Objekt** zu verstehen.

Vorher war ein Projekt stärker seiten- und dokumentorientiert.

Mit Build 019 wurde die Reise strukturierter:

- Zeitraum
- Route
- Start
- Ziel
- Reiseart
- Prioritäten
- Dauer als abgeleitete Information
- konsistente Modellkette

Leitsatz:

> **Studio versteht die Reise.**

Build 019 etablierte außerdem ein wichtiges Entwicklungsprinzip:

> Model → Rust → Migration → Command → Inspector → Preview → Tests

Daraus entstand das modulare **Consistency Gate**.

Diese Kette gilt verbindlich weiter.

---

# 11. Build 020 – Destination Profile & Layout Variants Foundation

Build 020 erweiterte die Reise um semantische Orte.

Eine Destination ist keine Seite.

Sie ist ein redaktionelles Objekt.

Build 020 brachte unter anderem:

- Destination als Entity
- stabile `destinationId`
- JourneyStage → Destination-Verknüpfung
- strukturierte Destination-Daten
- Arrival / Departure / Timezone
- Reasons
- Highlights
- Practical Info
- Editorial Layout Variant
- `.nls` 0.8.0
- Migration
- Publisher/Studio-Grenze
- modulare Consistency Gates

Leitsatz:

> **Studio versteht die Orte der Reise.**

---

# 12. Die drei Destination-Seitenwirkungen

Für Destination Pages gibt es zunächst exakt drei Seitenwirkungen.

Keine vierte.

Keine freie Variante.

Keinen Layoutdesigner.

## 1. Weite

Charakter:

- breit
- flach
- ruhig
- atmosphärisch
- Panorama als Öffnung
- nicht als dominanter Content-Block

Die genaue vertikale Position ergibt sich aus der besten visuellen A5-Komposition.

Sie wird nicht unnötig technisch als feste Y-Koordinate festgeschrieben.

## 2. Bild links

Das Bild führt in den Ort.

## 3. Bild rechts

Die Geschichte führt, das Bild begleitet.

Interne IDs dürfen bestehen bleiben:

- `destination-hero-banner`
- `destination-hero-left`
- `destination-hero-right`

Sichtbar bleibt ausschließlich:

- **Weite**
- **Bild links**
- **Bild rechts**

---

# 13. Layoutwechsel ist nicht-destruktiv

Ein Wechsel zwischen:

- Weite
- Bild links
- Bild rechts

darf niemals redaktionellen Content verändern.

Er verändert ausschließlich die Seitenwirkung.

Erhalten bleiben:

- Titel
- Subline
- Einführung
- Reasons
- Highlights
- Practical Info
- Bilder
- Reihenfolge
- Companion
- Footer
- Seitenzahl

Das ist ein verbindlicher Regressionstest.

---

# 14. Der Publisher bleibt die Publishing-Wahrheit

Die ursprüngliche Produkttrennung bleibt zentral.

## Northern Lines Studio

Verantwortlich für:

- Projektverwaltung
- redaktionelle Bearbeitung
- Navigation
- Canvas
- Layoutwahl
- Vorschau
- redaktionelle Entscheidungen
- Publishing Workflow

## Northern Lines Publisher

Verantwortlich für:

- Schemas
- Validierung
- Layout Grammar
- Content Fit
- finale Geometrie
- Render Jobs
- Assets
- Preflight

Studio besitzt **keine zweite vollständige Layout Engine**.

Das verhindert:

> Studio Preview ≠ Publisher Output

Die wichtigste Architekturregel lautet:

> **Studio besitzt den redaktionellen Zustand. Publisher besitzt die Publishing-Wahrheit.**

---

# 15. Preview-Prinzip

Studio soll Northern Lines Publisher nicht vollständig ersetzen.

Es gibt konzeptionell zwei Ebenen:

## Editorial Preview

- schnell
- glaubwürdig
- direkt
- editing-freundlich

## Publishing Preview

- publisher-authentisch
- typografisch korrekt
- Content-Fit-fähig
- asset-sicher
- möglichst nah am finalen Output

Technisch dürfen beide unterschiedlich arbeiten.

Für den Reisenden soll die Grenze möglichst unsichtbar bleiben.

---

# 16. Build 021 – Layout Resilience & Content Capacity Foundation

Build 021 wurde genehmigt als:

> **Layout Resilience & Content Capacity Foundation**

Der Build fügt nicht primär neue Features hinzu.

Er macht die vorhandenen Seiten **belastbar**.

Leitsatz:

> **Studio versteht, dass ein Ort unterschiedlich viel zu erzählen haben kann.**

---

# 17. Die geschützten Seitenzonen

Build 021 führt verbindliche Safe Areas als Teil der Layout Grammar ein.

Nicht als sichtbare DTP-Hilfslinien.

Sondern als interne Seitenregeln.

## Binding Safe Area

Links gilt verbindlich:

**15 mm technische Mindestzone**

Dieser Bereich ist für relevante Inhalte tabu.

Dort dürfen insbesondere nicht hineinragen:

- Fließtext
- wichtige Bildinhalte
- Informationsboxen
- QR-Codes
- Companion
- Seitenzahl
- Bildbeschriftungen

Der Bindungsrand ist Teil der Seitengeometrie.

Nicht Teil des Contents.

---

# 18. Der Begleiter ist unantastbar

Der Companion ist Teil der Editorial World.

Für Fjord gilt aktuell:

- Papageientaucher
- erster Auftritt ab Reiseplanung
- auf Destination Pages unten links
- an der Schwelle zum Footer
- klein
- unaufdringlich
- Standardpose
- keine Spiegelung

Verbindlicher Leitsatz:

> **Der Begleiter ist unantastbar – und sein Raum ebenfalls.**

Daraus folgt eine **Companion Safe Area**.

Inhaltsmodule dürfen diesen Bereich nicht überdecken.

Wenn ein Modul wächst, muss das Layout reagieren.

Nicht der Companion.

---

# 19. Footer Safe Area

Der Northern-Lines-Footer ist ein wiederkehrender visueller Anker:

> **TRAVEL · PHOTOGRAPHY · Signet · MEMORIES**

Footer, Companion und Seitenzahl bleiben bei einem Wechsel zwischen:

- Weite
- Bild links
- Bild rechts

stabil.

Der Footer wird nicht an dynamische Content-Höhen angepasst.

Der Content passt sich an die geschützte Zone an.

---

# 20. Title Safe Area

Auch der Ortsname ist ein geschützter Primäranker.

Die Subline bzw. „Ein Satz für diesen Ort“ darf visuell nicht in den Ortsnamen hineinragen.

Regel:

> **Der Ort spricht zuerst. Der Satz begleitet.**

Daraus folgen:

- klare Mindestdistanz
- stabile typografische Hierarchie
- Schutz für lange Ortsnamen
- keine Überlagerung
- keine visuelle Konkurrenz zwischen Titel und Subline

---

# 21. Weißraum ist bewusst – aber nicht verschenkt

Northern Lines lebt von Ruhe.

Aber Weißraum ist kein Selbstzweck.

Gerade auf DIN A5 ist vertikaler Raum wertvoll.

Für **Weite** gilt deshalb:

- Panorama darf näher in den oberen Seitenraum rücken
- keine unnötig großzügige leere Zone oberhalb
- trotzdem ruhig und atmosphärisch
- keine massive Hero-Fläche
- keine starre Y-Koordinate

Die beste A5-Komposition entscheidet.

---

# 22. Content Capacity

Eine Destination kann wenig oder sehr viel Inhalt besitzen.

Die Layout Grammar muss beide Fälle tragen.

Dafür wird nicht einfach jede neue Information als neue Box unter die vorherige gesetzt.

Sonst entsteht:

> CMS rechts + Kästchen-Tetris links.

Das ist ausdrücklich nicht Northern Lines Studio.

---

# 23. Drei Boxen nebeneinander sind erlaubt

Auch eine ruhige Editorial World darf kompakte Mehrspalten-Kompositionen verwenden.

Drei Boxen nebeneinander sind zulässig, wenn Inhalte:

- kurz,
- gleichgewichtig,
- scanbar,
- visuell kompakt

sind.

Geeignete Beispiele:

- Quick Facts
- kompakte Reiseinformationen
- kleine Hinweise

Nicht geeignet:

- lange Fließtexte
- ausführliche Souvenirhinweise
- komplexe länderspezifische Regeln

Die Zahl der Boxen ist nicht das Problem.

Die inhaltliche Eignung entscheidet.

---

# 24. Content darf nicht durch Typografie „hineingequetscht“ werden

Wenn eine Seite voller wird, darf die Engine nicht einfach die Schrift immer weiter verkleinern.

Nicht:

- 10 pt
- 9 pt
- 8 pt
- 7 pt

nur damit alles hineinpasst.

Northern Lines benötigt Mindestwerte für:

- Body Text
- Zwischenüberschriften
- Metadaten
- Modulabstände
- Weißraum
- Karten
- Bildflächen

Wenn diese Grenzen erreicht sind, muss später Content Fit reagieren.

Die Typografie wird nicht geopfert.

---

# 25. Content-Capacity-Zustände

Für die spätere Layout Grammar ist eine einfache Zustandslogik sinnvoll:

## comfortable

Alles passt mit gewünschtem Rhythmus.

## tight

Die Seite liegt nahe an ihrer Kapazitätsgrenze.

## overflow

Die Northern-Lines-Regeln können nicht mehr eingehalten werden.

Studio soll später nicht mit einem technischen Fehler reagieren.

Sondern beispielsweise:

> **Für diese Seitenwirkung wird es etwas eng.**

Das ist Travel Language auch im Fehlerfall.

---

# 26. Zeitangaben: semantisch erfassen, ruhig darstellen

Zeitwerte werden nicht als typografischer Freitext gespeichert.

Der Reisende soll nicht ständig „Uhr“ schreiben müssen.

Eingabe:

> `08:00`

Intern:

> strukturierter Zeitwert

Darstellung:

> `08:00`

oder – falls an einer Stelle sprachlich sinnvoll – automatisch ergänzt.

Wichtig:

> **„Uhr“ ist Darstellung, nicht Datenbestand.**

Im kompakten Travelbook-Kontext ist in der Regel ausreichend:

- Ankunft 08:00
- Abfahrt 17:30

Der Kontext macht bereits deutlich, dass es sich um eine Uhrzeit handelt.

---

# 27. Editorial World

Die Editorial World definiert die visuelle Sprache.

Sie kontrolliert:

- Farbwelt
- typografischen Charakter
- Companion
- Footer
- Layout Grammar
- wiederkehrende visuelle Anker

Der Reisende trifft Entscheidungen innerhalb dieser Sprache.

Er gestaltet die Sprache nicht neu.

Das schützt Northern Lines vor Beliebigkeit.

---

# 28. Companion und Footer gehören nicht zum Layoutvariant

Ein wichtiger technischer und visueller Grundsatz:

Layoutvarianten verändern die **redaktionelle Komposition**.

Sie dürfen nicht verändern:

- Companion-Position
- Companion-Größe
- Companion-Spiegelung
- Footer
- Seitenzahl
- World-Farbe

Diese Elemente gehören zur Editorial World bzw. zur Seitenarchitektur.

Nicht zur Destination-Variante.

---

# 29. Keine Funktion sichtbar machen, nur weil sie existiert

Ein Datenmodell ist keine UI-Spezifikation.

Wenn beispielsweise gespeichert werden:

- Reasons
- Highlights
- Practical Info
- IDs
- interne Layoutinformationen
- World-Referenzen

heißt das nicht, dass all diese Dinge permanent sichtbar sein müssen.

Die Oberfläche zeigt nur das, was für den aktuellen redaktionellen Schritt notwendig ist.

---

# 30. Keine semantische Zweckentfremdung

Eine besonders wichtige Regel aus Build 020 Final:

> **Bestehende Domain-Felder dürfen nicht für eine andere Bedeutung missbraucht werden.**

Beispiel:

Wenn `highlights` Highlights beschreibt, darf es nicht nur deshalb für „Was möchtest du fotografieren?“ verwendet werden, weil gerade kein Photography-Feld existiert.

Lieber zeigt Studio die Frage noch nicht, als das Modell semantisch zu beschädigen.

Das schützt die langfristige Datenqualität.

---

# 31. Keine Scope-Erosion

Jeder Build bekommt einen klaren Scope.

Nicht „wenn wir schon dabei sind“.

Für Build 020 Final galt ausdrücklich:

- kein Asset Management
- kein Crop Editor
- kein Focal Point
- kein Drag-and-drop
- keine freie Elementpositionierung
- keine weiteren Layoutvarianten
- keine neue Editorial World
- keine Schemaerweiterung ohne Notwendigkeit
- kein allgemeines Refactoring

Dasselbe Prinzip gilt für kommende Builds.

---

# 32. Build-Disziplin

Neue Änderungen müssen immer durch die vollständige Kette gedacht werden:

> **Model → Rust → Migration → Command → Inspector → Preview → Tests**

Keine Änderung gilt als fertig, wenn nur die Oberfläche funktioniert.

Ebenso darf eine funktionierende UI nicht durch eine inkonsistente Persistenz, Migration oder Command-Schicht erkauft werden.

Bestehende Funktionen dürfen nicht regressieren.

---

# 33. Consistency Gates

Consistency Gates sind kein optionales Extra.

Sie prüfen, ob ein Feature wirklich durch die gesamte Architektur getragen wird.

Beispiele:

- Journey Planning Consistency Gate
- Destination Profile Consistency Gate

Ein Gate sollte nicht nur das Vorhandensein von Dateien prüfen, sondern relevante Konsistenzregeln:

- Modell vorhanden
- Rust-Abbildung vorhanden
- Migration vorhanden
- Commands vorhanden
- Inspector angebunden
- Preview angebunden
- Tests vorhanden
- Travel Language eingehalten

---

# 34. Release-Verfahren

Für Northern Lines Studio Builds gilt verbindlich:

Jeder Build wird als vollständiges, GitHub-taugliches Repository-Paket geliefert.

Zusätzlich gibt es ein **Drop-in-Paket**.

## Full Repo

Autoritative vollständige Version des Repositories.

Beim Ersetzen bleibt nur das vorhandene `.git/`-Verzeichnis erhalten.

Repository-Dateien wie:

- `.gitignore`
- `.gitattributes`

werden aus dem neuen Build übernommen.

## Drop-in

Enthält nur die neuen bzw. geänderten Dateien.

Es wird verwendet, um einen validierten vorherigen Build gezielt zu aktualisieren.

---

# 35. APPLY-DROPIN.md

Jedes Drop-in enthält verbindlich eine `APPLY-DROPIN.md`.

Struktur nach dem etablierten Build-019-Muster:

1. Branch anlegen
2. Dry Run
3. rsync anwenden
4. Consistency Gate
5. erwartete PASS-Ausgabe
6. vollständige Gates
7. Real-World-Test
8. konkrete Beispieldaten
9. erwartetes Ergebnis

Standardpfade:

```bash
~/Projekte/northern-lines-studio
```

und:

```bash
~/Downloads/<Build-DropIn>/
```

---

# 36. Dokumentation pro Build

Die README muss mit jedem Build aktualisiert werden.

Zu einem Build gehören mindestens:

- README
- ADR
- ECR
- Build Notes
- Release Notes
- Validation
- Git Workflow
- `.nls` Project Format
- Consistency Gates
- APPLY-DROPIN.md
- ggf. Migration / Upgrade Notes

Dokumentation ist Teil des Builds.

Nicht Nacharbeit.

---

# 37. Validierung ist mehr als „Tests grün“

Ein Build ist technisch erst dann glaubwürdig, wenn:

- Consistency Gates grün
- `pnpm check`
- `pnpm test`
- `pnpm build`
- `cargo test`
- `git diff --check`

erfolgreich laufen.

Aber ein Studio-Build ist noch nicht produktseitig validiert.

Dazu gehört ein Real-World-Test.

Beispiel:

- echte Reise öffnen
- echten Ort bearbeiten
- Seitenwirkung wechseln
- speichern
- schließen
- `.nls` erneut öffnen
- Persistenz prüfen
- visuelle Wirkung prüfen
- Companion/Footer/Safe Areas prüfen

---

# 38. Referenzfälle statt künstlicher Demo

Die Entwicklung soll möglichst mit echten Reisebeispielen geprüft werden.

Geeignete Referenzen:

- Bergen
- Geiranger
- Ålesund
- Haugesund
- Visby

Für Content Capacity sind zusätzlich unterschiedliche Belastungsfälle sinnvoll:

## wenig Inhalt

z. B. Geiranger

## normaler Inhalt

z. B. Bergen

## Stress Test

bewusst sehr viele Inhalte

Damit wird sichtbar, ob die Layout Grammar wirklich belastbar ist.

---

# 39. A5 ist keine abstrakte Canvas-Fläche

Northern Lines Travel Fieldbooks entstehen für ein reales Format.

Wichtige Konsequenzen:

- DIN A5 Hochformat
- Bindung berücksichtigen
- 15 mm technische Mindestzone links
- Footer stabil
- Companion stabil
- Seitenzahl stabil
- visuelle Balance auf echter A5-Fläche
- keine Desktop-UI-Logik ungeprüft auf Papier übertragen

Der Canvas muss das spätere Travelbook glaubwürdig repräsentieren.

---

# 40. Designqualität bedeutet nicht maximale Dekoration

Northern Lines soll:

- ruhig,
- hochwertig,
- redaktionell,
- maritim,
- klar

wirken.

Dekoelemente ohne Funktion sind kritisch zu betrachten.

Ein Beispiel war das Strich-Element oben rechts in einer frühen Build-020-Destination-Preview.

Es wurde entfernt, weil bereits genügend wiederkehrende visuelle Anker existieren:

- Typografie
- Editorial World
- Companion
- Footer
- Bildsprache
- Akzentfarbe

Grundsatz:

> **Nicht jede freie Fläche braucht ein Gestaltungselement.**

---

# 41. „Weite“ ist kein klassischer Hero

Der frühere Begriff „Hero Banner“ führte zu einer falschen visuellen Interpretation.

Ein Northern-Lines-„Weite“-Element ist:

- kein riesiger Web-Hero,
- kein dominanter Content-Block,
- kein Marketingheader.

Es ist ein atmosphärisches Panorama, das den Ort öffnet.

Travel Language korrigiert hier nicht nur das Wording.

Sie verändert die Produktidee.

---

# 42. Die Reise steht über der Software

Ein Nutzer soll in Studio denken:

- Bergen
- meine Route
- was möchte ich erleben?
- wie soll dieser Ort wirken?
- was nehme ich mit?
- was möchte ich später erinnern?

Nicht:

- Entity
- Manifest
- LayoutVariant
- Asset
- Grammar
- JourneyStage

Das ist der Unterschied zwischen einer technischen Anwendung und Northern Lines Studio.

---

# 43. Der Reisende trifft redaktionelle Entscheidungen

Studio soll dem Nutzer Entscheidungen abnehmen, die keinen persönlichen Wert haben.

Studio soll Entscheidungen offenlassen, die persönliche Bedeutung besitzen.

Beispiele:

Studio entscheidet:

- technische Geometrie
- sichere Abstände
- Layout Grammar
- Footerposition
- Companion Safe Area
- Content-Fit-Regeln

Der Reisende entscheidet:

- was ein Ort für die Reise bedeutet
- welche Inhalte wichtig sind
- welche Seitenwirkung passt
- welche Geschichte erzählt wird
- welche Erinnerungen bewahrt werden

---

# 44. Layout Grammar statt Template-Sammlung

Northern Lines Studio soll nicht in eine Bibliothek aus Dutzenden statischen Templates wachsen.

Stattdessen:

> **wenige Archetypen + belastbare Layout Grammar**

Die gleiche Destination kann mit unterschiedlichen Seitenwirkungen dargestellt werden.

Die gleichen Regeln müssen mit wenig oder viel Content umgehen können.

Das ist nachhaltiger als:

- Bergen Template
- Geiranger Template
- Visby Template
- Ålesund Template

---

# 45. Content Fit ist redaktionelle Assistenz

Langfristig soll Content Fit nicht nur technisch melden, dass etwas überläuft.

Studio soll helfen.

Nicht:

> `ERR_LAYOUT_OVERFLOW`

Sondern:

> „Für diese Seitenwirkung wird es etwas eng.“

Oder später:

> „Bild rechts gibt deinem Text mehr Raum.“

Die Engine soll nicht heimlich entscheiden.

Sie soll nachvollziehbar unterstützen.

---

# 46. Warum Northern Lines Publisher wichtig bleibt

Gerade Content Capacity, Safe Areas und unterschiedliche Layoutwirkungen zeigen, warum Publisher nicht nur ein Exportskript ist.

Publisher ist langfristig die Instanz, die sicherstellt:

- gleiche Layoutregeln
- gleiche Typografie
- gleiche Content-Fit-Logik
- gleiche Seitengeometrie
- zuverlässigen Export
- Preflight

Studio ist die visuelle und redaktionelle Arbeitsumgebung.

Publisher ist die Publishing Engine.

Diese Trennung ist strategisch wichtig.

---

# 47. Die Produktentwicklung folgt einer natürlichen Linie

Bisher:

## Build 019
**Journey Planning Foundation**

Studio versteht die Reise.

## Build 020
**Destination Profile & Layout Variants Foundation**

Studio versteht ihre Orte.

## Build 021
**Layout Resilience & Content Capacity Foundation**

Studio versteht, dass ein Ort unterschiedlich viel zu erzählen haben kann.

Diese Abfolge ist kein Zufall.

Sie zeigt eine zunehmende semantische Reife:

> Projekt → Reise → Ort → redaktionelle Belastbarkeit → später Fotografie, Maps, Content Fit und Publishing Intelligence.

---

# 48. Spätere Themen – bewusst noch nicht jetzt

Bereits mitgedacht, aber nicht vorschnell implementieren:

- Photography Companion
- Shotlists
- Objektivempfehlungen
- Maps & Places
- QR
- Souvenirs
- länderspezifische Regeln
- Northern Lines Wissen
- History / Hintergründe
- Erinnerungen
- Content-Fit-Empfehlungen
- High-Fidelity Publisher Preview
- Asset Management
- Crop / Focal Point

Reihenfolge und Scope werden buildweise entschieden.

---

# 49. Was niemals passieren soll

Northern Lines Studio darf langfristig nicht zu Folgendem werden:

## CMS

Alle Felder permanent sichtbar.

## Datenbankeditor

Strukturen dominieren die Sprache.

## DTP light

Nutzer verschieben Kästchen.

## Template-Marktplatz

Dutzende Varianten ohne klare Editorial World.

## Entwickleroberfläche

Interne IDs und Grammars erklären sich selbst.

## Feature-Sammlung

Funktionen werden sichtbar, nur weil sie gebaut wurden.

---

# 50. Was Studio stattdessen sein soll

Northern Lines Studio soll sich anfühlen wie:

> **ein ruhiger Schreibtisch für eine bevorstehende Reise.**

Man sieht das Travelbook.

Man sieht den Ort.

Man trifft wenige Entscheidungen.

Man wird begleitet.

Die Technik bleibt im Hintergrund.

Die Reise bleibt im Vordergrund.

---

# 51. Die Rolle des Companion

Der Companion ist kein Maskottchen, das beliebig dekorativ eingesetzt wird.

Er ist Teil der Editorial World.

Er ist Reisebegleiter.

Deshalb besitzt er:

- definierte Auftrittspunkte
- definierte Position
- definierte Größe
- definierte Pose
- definierte Spiegelung
- geschützten Raum

Der Companion darf Layouts emotional verbinden, aber nie Inhalte stören.

Er ist präsent, ohne sich aufzudrängen.

---

# 52. Die Rolle des Footers

Der Footer ist ein wiederkehrender visueller Anker.

Er verankert die Seite in Northern Lines.

Er ist stabil.

Er passt sich farblich an die Editorial World an.

Er wird nicht von Layoutvarianten bewegt.

Er trägt die wiederkehrende Signatur:

> **TRAVEL · PHOTOGRAPHY · Signet · MEMORIES**

---

# 53. Die Rolle des Weißraums

Weißraum ist Teil der Northern-Lines-Sprache.

Er sorgt für:

- Ruhe
- Hierarchie
- hochwertige Wirkung
- Lesbarkeit
- Fokus

Aber:

> **Weißraum ist intentional, nicht zufällig.**

Auf A5 darf Platz nicht verschenkt werden, wenn dadurch wichtige redaktionelle Inhalte unnötig verdrängt werden.

---

# 54. Die Rolle von Kritik und Retrospektive

Ein technisch grüner Build ist nicht automatisch ein guter Studio-Build.

Die bisherige Entwicklung zeigt:

- Build implementieren
- technisch validieren
- reale Seite ansehen
- Kritik formulieren
- Produktregel daraus ableiten
- erst dann finalisieren

Viele der stärksten Produktregeln entstanden genau aus solchen Beobachtungen:

- Hero zu dominant → „Weite“
- technische Labels → Travel Language
- Inspector zu voll → progressive redaktionelle Hierarchie
- Companion überdeckt Inhalt → Companion Safe Area
- Subline ragt in Titel → Title Safe Area
- Bindungsrand → Binding Safe Area
- zu viel Inhalt → Content Capacity statt Schriftquetschen

Das ist kein Nachbessern ohne Plan.

Das ist produktive Iteration.

---

# 55. Der „Knigge“-Test

Im Projekt hat sich humorvoll ein sehr brauchbarer Qualitätstest etabliert.

Wenn Studio etwas technisch vom Nutzer verlangt, das es selbst wissen oder übernehmen könnte, ist die Frage:

> **Brauchen wir dafür eine neue Ausgabe des Knigge?**

Beispiel:

Warum soll der Nutzer bei einer Uhrzeit jedes Mal „Uhr“ eintippen?

Studio weiß bereits, dass es eine Zeit ist.

Also übernimmt Studio Darstellung und Formatierung.

Der Knigge-Test steht sinngemäß für:

> **Lass den Reisenden keine technische oder typografische Arbeit erledigen, die Studio selbst zuverlässig übernehmen kann.**

---

# 56. Die wichtigsten unverhandelbaren Regeln

## Produkt

1. Travelbook vor Technik.
2. Reisender vor Datenmodell.
3. Wenige starke Möglichkeiten.
4. Keine freie DTP-Logik.
5. Travel Language.
6. Technische Komplexität bleibt intern.

## Layout

7. 15 mm Binding Safe Area als technische Mindestzone.
8. Companion Safe Area.
9. Footer Safe Area.
10. Title Safe Area.
11. Weite bleibt flach und ruhig.
12. Typografie wird nicht für Content Capacity geopfert.
13. Drei Spalten nur bei geeigneten kompakten Inhalten.

## Architektur

14. Semantik statt finaler Koordinaten speichern.
15. Publisher bleibt Publishing-Wahrheit.
16. Studio bleibt redaktionelle Arbeitsumgebung.
17. Keine semantische Zweckentfremdung bestehender Felder.
18. Keine Schemaänderung ohne echten Domain-Grund.

## Entwicklung

19. Model → Rust → Migration → Command → Inspector → Preview → Tests.
20. Keine Regression.
21. Build-Scope einhalten.
22. Full Repo + Drop-in.
23. APPLY-DROPIN.md.
24. README und Build-Dokumentation aktualisieren.
25. Technische Gates + Real-World-Test.

---

# 57. Leitfragen für jeden zukünftigen Build

Vor der Freigabe eines neuen Features sollten mindestens diese Fragen beantwortet werden:

### Produkt

- Hilft das dem Reisenden?
- Muss der Nutzer diese technische Information wirklich sehen?
- Spricht die UI Travel Language?
- Wird das Travelbook dadurch wichtiger oder die Software?

### UX

- Gibt es zu viele Entscheidungen gleichzeitig?
- Kann Studio etwas automatisch übernehmen?
- Wirkt der Inspector wie ein Begleiter oder wie ein Formular?
- Bleibt genügend Ruhe?

### Layout

- Funktioniert es auf A5?
- Bleibt die 15-mm-Mindest-Bindungszone geschützt?
- Bleiben Companion und Footer unberührt?
- Funktioniert es mit wenig und viel Content?
- Wird Typografie geopfert?

### Architektur

- Ist die Information semantisch korrekt modelliert?
- Wird ein bestehendes Feld zweckentfremdet?
- Muss das Schema wirklich erweitert werden?
- Gehört diese Aufgabe zu Studio oder Publisher?

### Entwicklung

- Ist die komplette Consistency Chain umgesetzt?
- Sind ältere Builds regressionsfrei?
- Ist der Scope eingehalten?
- Ist Dokumentation Teil der Lieferung?

---

# 58. Die Northern-Lines-Studio-DNA

Am Ende lässt sich alles auf wenige Sätze verdichten.

> **Northern Lines Studio ist kein Programm, mit dem man Seiten baut.
> Es ist eine Umgebung, in der man eine Reise erzählt.**

> **Der Reisende entscheidet über Bedeutung und Wirkung.
> Studio übernimmt die technische Komplexität.**

> **Der Inhalt gehört zur Reise und zum Ort.
> Die Layout Grammar sorgt dafür, dass daraus Northern Lines wird.**

> **Wenige starke Möglichkeiten. Viele persönliche Geschichten.**

> **Intern darf es kompliziert sein. Für den Reisenden muss es sich selbstverständlich anfühlen.**

Und vielleicht der wichtigste praktische Prüfstein:

> **Northern Lines Studio wird nicht danach beurteilt, wie viele Funktionen es anbietet.
> Es wird danach beurteilt, wie selbstverständlich sich daraus eine Reise gestalten lässt.**

---

# 59. Schlussgedanke

Northern Lines Studio soll sich niemals wie eine technische Schicht zwischen Reisendem und Travelbook anfühlen.

Im besten Fall verschwindet die Software gedanklich.

Übrig bleiben:

- ein Ort,
- eine Route,
- ein Bild,
- eine Geschichte,
- ein paar Entscheidungen,
- Vorfreude,
- und später ein Rucksack voller Erinnerungen.

Das ist die DNA, die alle kommenden Builds schützen sollen.


# 60. Destination Imagery Foundation

Build 022 führt echte Ortsbilder ein, ohne Northern Lines Studio zu einer Medienverwaltung zu machen.

Verbindliche Regeln:

- Studio spricht von **Bild des Ortes**, nicht von Asset oder Media Resource.
- Es gibt zwei semantische Bildrollen: **Weite** und ein gemeinsames **Hochformat-Bild** für **Bild links / Bild rechts**.
- **Weite** verwendet ein breites Panorama; die Geometrie ist ein Zielkorridor und keine starre Box. Studio darf innerhalb der Layout Grammar die sichtbare Höhe aus dem vorbereiteten Bildverhältnis ableiten.
- **Bild links** und **Bild rechts** verwenden dieselbe hochformatige Bildrolle (Richtwert ca. 2:3).
- Studio bietet bei Bedarf eine kleine Geometrie-Hilfe neben der Bildauswahl.
- Build 022 besitzt keinen Crop-Editor, keinen Focal Point und keine freie Bildpositionierung.
- Bilder werden innerhalb des `.nls`-Packages verwaltet; technische Pfade bleiben unsichtbar.
- Die Bildrolle gehört semantisch zum Ortsprofil. Finale Geometrie bleibt Publisher-Verantwortung.

> **Hilfe bei Bedarf – nicht Technik auf Vorrat.**

Die Binding Safe Area ist ab Build 022 eine **15-mm-Mindestzone für relevante Nutzinhalte**. Der Companion wird davon nicht verschoben. Seine Position ist Bestandteil der Editorial World und über geeignete Seitentypen invariant.

---

# 61. Fjord – weiße Bühne und Bildkomposition

Für Destination Pages der Editorial World **Fjord** ist die eigentliche Seitenfläche grundsätzlich **weiß bzw. neutral-weiß**.

Diese Grundfläche wird nicht durch großflächig eingefärbte Seitenhintergründe ersetzt. Das Weiß ist die ruhige Bühne für Fotografie, Typografie und Inhalt.

Die visuelle Identität von Fjord entsteht über:

- Fotografie als wichtigste atmosphärische Farbquelle;
- Typografie und Fjord-Akzentfarbe als Identität und Hierarchie;
- Linien, Signets und kleine grafische Elemente;
- gezielt sanft eingefärbte redaktionelle Flächen;
- Footer und Companion;
- Bildsprache und Hero-Komposition.

Eine farbig hinterlegte Informationsfläche ist ein **redaktioneller Akzent**, kein neues Card-UI-System. Nicht jedes Inhaltsmodul wird automatisch in eine Box gesetzt.

Für **Weite**, **Bild links** und **Bild rechts** gilt dieselbe neutrale Seitenfläche.

Bilder werden nicht in farbige Medienboxen eingesetzt. Sie werden innerhalb der Editorial Grammar **in die Seite komponiert**. Bei vorbereiteten Aquarellmotiven darf die weiße Bildfläche optisch mit dem Papier verschmelzen.

Die Bildkomposition darf innerhalb definierter Grammar-Regeln auf das tatsächliche Seitenverhältnis reagieren. Das ist keine freie DTP-Geometrie: Studio speichert weiterhin keine x/y-Koordinaten, keine freien Boxgrößen und keine Crop-Rechtecke.

> **Die Fotografie bringt die Atmosphäre. Die Typografie gibt ihr Haltung. Die Editorial World setzt die Akzente.**


# 60. Build 023 – Composition Refinement und Inspector-Ergonomie

Build 023 bestätigt, dass die drei Seitenwirkungen **Weite · Bild links · Bild rechts** keine statischen Templates sind, sondern kuratierte Kompositionen innerhalb derselben Layout Grammar. Bilder werden nicht in Medienkarten montiert; sie werden mit Typografie und weißer Seitenfläche zu einer redaktionellen Komposition verbunden.

Die Grammar darf Inhaltsgruppen automatisch ein-, zwei- oder dreispaltig ordnen, wenn Menge und Dichte des Inhalts dies erlauben. Diese Entscheidung ist nicht frei konfigurierbar und wird nicht als Geometrie persistiert.

Der rechte Inspector darf als Workspace-Hilfe zwischen **320 und 440 px** wachsen. Seine Breite ist eine lokale Benutzerpräferenz, kein Travelbook-Inhalt. Der Canvas bleibt die wichtigste Fläche.

Verbindlicher Ergonomie-Leitsatz:

> **Der Inspector darf wachsen, wenn der Inhalt es verlangt – aber nie so weit, dass das Travelbook seine Rolle als Hauptfläche verliert.**

---

# 47. Geschützte Seitenzonen sind verbindliche Layout Grammar

Northern Lines Studio behandelt Seitenzonen als **semantisch getrennte Layoutbereiche**.

> **Hero Zone und Title Zone sind Geschwister, keine Mitbewohner. Sie dürfen sich nicht dasselbe Zimmer teilen.**

Daraus folgt verbindlich:

- Bilder bleiben vollständig innerhalb ihrer Bild- bzw. Hero-Zone.
- Titel, Marker und Titeltypografie bleiben vollständig innerhalb ihrer Title-Zone.
- Grafische Assets, redaktionelle Flächen und weitere Seitenelemente überschreiten die Grenzen ihrer definierten Zone nicht.
- Ein Element darf eine fremde Zone nur dann betreten, wenn die Layout Grammar dafür eine ausdrückliche und dokumentierte Ausnahme definiert.
- Zonen werden nicht durch zufällige Margins oder optische Korrekturen getrennt, sondern durch die Struktur der Layout Grammar.

Für **Weite** bedeutet das konkret: Die Hero-Zone besitzt einen kontrollierten, grammar-owned Höhenkorridor. Das gewählte Bild wird ohne Crop innerhalb dieses Korridors mit `contain` komponiert und darf den Hero-Raum nicht vergrößern oder visuell verlassen. Erst nach einer separaten geschützten Ruhezone beginnt die Title-Zone mit `REISEZIEL`.

Diese Regel ist bildunabhängig. Sie gilt für Aquarelle, Fotografien und andere zulässige Reisebilder gleichermaßen und darf nicht auf ein einzelnes Referenzbild optimiert werden.

## 62. Nicht festnageln, sondern komponieren

Semantische Inhalte besitzen eine feste Rolle, aber nicht zwingend eine einzige
starre Position innerhalb derselben zulässigen Seitenzone. Die Layout Grammar darf
Module innerhalb ihrer Zone neu komponieren, wenn dadurch Hierarchie, Rhythmus und
Content Capacity verbessert werden und die Wirkung der Editorial World erhalten
bleibt.

Für **Weite** ist die Title Zone deshalb als kuratierte horizontale Komposition
zulässig: Titelblock und Einleitung stehen nebeneinander und werden durch einen
funktionalen, zurückhaltenden vertikalen Trenner gegliedert. Das ist keine freie
DTP-Geometrie und keine Benutzeroption.

> **Nicht festnageln, sondern komponieren.**

Die geschützten Zonen bleiben dabei unantastbar: Die Hero Zone nimmt keine
Titeltypografie auf; die Companion-/Footer-Zone nimmt keinen überlaufenden Content
auf.

## Editorial Extension Zones

Editorial Extension Zones sind optionale, semantisch begründete Erweiterungsbereiche innerhalb der Layout Grammar. Sie erscheinen nur dort, wo ein Ort tatsächlich zusätzliche redaktionelle Bedeutung trägt. Nicht jeder Ort braucht eine Erweiterung; selektiver Einsatz ist Teil der redaktionellen Qualität.

Für Build 024 gelten als kanonische semantische Rollen:

- Wissen
- Fotospot
- Tipp
- Souvenir
- Wichtig
- Geschichte

Die visuelle Regel ist bewusst reduziert:

> **Das Signet sagt, was es ist. Die Farbe sagt, zu welcher Welt es gehört. Mehr muss die Box nicht erklären.**

Eine Editorial Extension Zone besteht aus Signet, world-konformer Fläche und Inhalt. Die Gewichtung darf über die Intensität der Fläche innerhalb der jeweiligen Editorial-World-Palette entstehen. Rahmen, zusätzliche Divider, Ornamente oder redundante Labels sind nicht erforderlich.

> **Ein Asset braucht in Studio einen redaktionellen Grund.**

Editorial Extension Zones dürfen Kernzonen nicht kolonisieren. Hero, Title, Content, Companion und Footer behalten ihre eigenen geschützten Räume. Eine Extension wird nur innerhalb einer ausdrücklich vorgesehenen Layoutzone komponiert.

> **Hero Zone und Title Zone sind Geschwister, keine Mitbewohner. Sie dürfen sich nicht dasselbe Zimmer teilen.**

Diese Zonenregel gilt analog für Bilder, Typografie, grafische Assets, Infoflächen und weitere Seitenelemente: Jedes Element bleibt in seiner vorgesehenen Zone, sofern die Layout Grammar keine ausdrückliche dokumentierte Ausnahme definiert.

> **Der Companion nimmt nicht am Layout teil. Das Layout nimmt Rücksicht auf den Companion.**

Der Companion ist ein invariantes World-Element mit eigener geschützter Zone. Content Fit darf ihn weder verschieben noch verkleinern; andere Zonen müssen ihre Komposition so organisieren, dass sein Raum frei bleibt.


## 63. Die Seitenwirkung bleibt stabil, die innere Komposition folgt dem Inhalt

Northern Lines Studio behandelt Seitenwirkungen nicht als starre 50/50-Templates.
Die Layout Grammar wählt innerhalb einer begrenzten, kuratierten Menge von
Kompositionszuständen diejenige Verteilung, die den realen Inhalt am besten trägt.

Für die Title Zone von **Weite** gilt insbesondere:

- kurze Ortsnamen können in einer ausgeglichenen 50/50-Komposition stehen;
- längere Ortsnamen erhalten kontrolliert mehr Raum, z. B. 60/40 oder 70/30;
- reicht auch das nicht sinnvoll aus, wechselt der Introtext unter den Titelblock;
- Ortsnamen werden niemals mitten im Wort getrennt;
- Schrift wird nicht heimlich verkleinert, um einen Zustand zu erzwingen.

Dasselbe Prinzip gilt für Editorial Extension Zones. Zwei kompakte Erweiterungen
dürfen eine ausgeglichene Zeile teilen. Ungleich lange Erweiterungen erhalten eine
asymmetrische Verteilung; dichte Erweiterungen dürfen gestapelt oder auf volle
Breite komponiert werden. Die Companion-/Footer-Safe-Zone bleibt dabei eine harte
Grenze.

> **Die Seitenwirkung bleibt stabil. Die innere Komposition passt sich dem Inhalt an.**

Diese Anpassung ist keine freie DTP-Geometrie. Der Reisende wählt keine Spaltenbreite
und keine Koordinaten. Studio übernimmt das Layoutdenken innerhalb der freigegebenen
Grammar-Zustände.

## Protected Capacity Rule

> **Eine Safe Zone ist eine Grenze, keine Empfehlung.**

Adaptive Layout Grammar löst das Lösbare. Wenn keine zulässige Komposition mehr existiert, wird Inhalt nicht über Companion, Footer oder andere geschützte Zonen gelegt. Studio verkleinert keine Schrift, schneidet keinen Text ab und verschiebt keine invarianten Elemente. Stattdessen informiert Studio den Reisenden in Travel Language:

> **Diese Seite kann diesen Inhalt nicht mehr ruhig erzählen.**

Vor `overflow` dürfen andere bereits vorhandene Seitenwirkungen als alternative Komposition geprüft werden. Automatische Fortsetzungsseiten bleiben ein späterer Content-Fit-Schritt.

# 59. Editorial Worlds und adaptive World Expression · Build 025B

Eine Editorial World ist keine Farbpalette. Sie ist eine kuratierte visuelle Sprache aus Typografie, Rhythmus, Bildsprache, Akzenten, Companion und wenigen charakteristischen Assets.

> Shared Graphic Language, World-specific Expression.

Die Semantik bleibt stabil. Signets behalten world-übergreifend ihre Bedeutung; die World interpretiert Farbe und Gewichtung.

> Das Signet sagt, was es ist. Die Farbe sagt, zu welcher Welt es gehört. Mehr muss die Box nicht erklären.

Der Companion gehört zur World, nimmt aber nicht am Layout teil. Das Layout nimmt Rücksicht auf ihn.

World-Wechsel darf Reiseinhalte, Destination IDs, Bildrollen, Extension-Semantik oder Seitenwirkungen nicht verändern.

Build 024 gilt als Milestone Build: adaptive Layout Grammar, Editorial Extension Zones, harte Safe Zones und Extension Capacity Protection bilden gemeinsam die belastbare Basis für weitere Editorial Worlds.

## 64. Build 025C · Editorial World Milestone

Build 025C gilt als Meilenstein: Der Wechsel zwischen **Fjord** und **Ostsee** beweist, dass Editorial Worlds echte Produktarchitektur sind und nicht lediglich Farbvarianten eines einzelnen Layouts.

Verbindlich bestätigt sind:

- dieselbe semantische Destination und dieselbe adaptive Layout Grammar in beiden Worlds;
- world-spezifische Typografie, Companion, Signets, Akzentfarben und Editorial-Flächen;
- weiße bzw. neutral-weiße Seitenfläche als ruhige gemeinsame Bühne;
- World Expression über Inhalt und Akzente statt über flächige Seitenhintergründe;
- keine Inhaltsduplikation beim World-Wechsel.

> **Gleiche Sprache. Andere Welt.**

## 65. Destination Interest Pages · Die Destination bleibt das Zentrum

Eine Destination ist nicht auf eine einzige Ortsseite beschränkt. Die Haupt-Ortsseite bleibt allgemein, ruhig und reisetauglich. Thematische Zusatzseiten vertiefen nur das, was für diese konkrete Reise Bedeutung hat.

Für die erste Foundation gelten genau vier Archetypen:

- **Fotografie**
- **Wandern & Natur**
- **Kultur & Geschichte** – inklusive Museen, Architektur, archäologischer/antiker Stätten und historischer Orte
- **Kulinarik & Lokal**

Mehrere Vertiefungen für dieselbe Destination sind ausdrücklich legitim. Bergen darf beispielsweise eine Fotografie-Seite und zusätzlich eine Kultur-&-Geschichte-Seite besitzen.

> **Die Destination bleibt das Zentrum. Die Vertiefung folgt dem Interesse der Reise.**

Studio spricht dabei Travel Language. Die Oberfläche fragt nicht nach einem technischen Archetyp, sondern beispielsweise:

> **Was möchtest du in Bergen erleben?**

Der Reisende wählt das Interesse; Studio erzeugt und ordnet die passende Zusatzseite innerhalb der Destination. Alle Zusatzseiten erben dieselbe Editorial World, dieselben Companion-/Footer-Invarianten und dieselbe Northern-Lines-Sprache. Build 026 legt zunächst Struktur, Navigation, Persistenz und World-Vererbung fest. Fachspezifische Module der vier Archetypen folgen in späteren Builds.


## 64. Destination Interest Pages erben die vollständige World Expression

Thematische Vertiefungsseiten übernehmen nicht nur die Typografie der aktiven Editorial World, sondern deren vollständige kuratierte Expression. Dazu gehören Akzentfarben, Signets, Meta-Typografie und gezielte Editorial-/Content-Flächen.

Die physische Seitenfläche bleibt weiß bzw. neutral-weiß. Interest Pages dürfen keine eigenen hardcodierten Neutralfarben einführen, die Fjord oder Ostsee visuell entkoppeln.

> **Die Semantik gehört zur Destination. Die Expression gehört zur World.**

## Photography & Place Experience

Fotografie ist in Northern Lines Studio eine mögliche Vertiefung eines Ortes, nicht die Voraussetzung für eine Reise. Die Destination bleibt das semantische Zentrum. Eine Fotografie-Seite darf Fotospots, Licht, Motive, Hinweise, Brennweitenorientierung und Ortsbezug vertiefen, ohne zur Kamera-, EXIF- oder Produktdatenbank zu werden.

> **Fotografie vertieft den Ort. Sie ersetzt ihn nicht.**


## Semantische Nähe bleibt sichtbar

Informationen, die inhaltlich zusammengehören, werden auch in der Seitenkomposition unmittelbar zusammen erzählt. Ein Routeneintrag trennt daher nicht künstlich Route, Startpunkt, Dauer und Schwierigkeit voneinander. Studio darf Daten intern getrennt speichern; für den Reisenden bleibt ihre Beziehung selbstverständlich sichtbar.


## Interest-Page Compact Typography Exception

Die bisherige Northern-Lines-Regel bleibt für alle normalen Seiten verbindlich: Schrift wird nicht verkleinert, um ein Layoutproblem zu retten. **Ausschließlich Interest Pages** dürfen für strukturierte, informationsdichte Praxisinhalte eine definierte kompaktere Typografie-Stufe verwenden.

Die Ausnahme gilt nur für sekundäre Praxisinformationen wie Route, Startpunkt, Dauer, Schwierigkeit, Naturziel, Streckenhinweis oder vergleichbare Detaildaten. Titel, Ortsname und die primäre Seitenhierarchie werden niemals verkleinert. Alle anderen Seitentypen sind von dieser Ausnahme ausdrücklich ausgeschlossen.

> **Interest Pages dürfen dichter erzählen. Alle anderen Seiten bleiben bei der bisherigen Typografie-Regel.**

Companion- und Footer-Safe-Zonen bleiben auch bei kompakter Interest-Typografie harte Grenzen. Wenn der Inhalt trotz erlaubter Verdichtung nicht ruhig passt, greift Capacity Protection statt weiterer Verkleinerung.

## Interest Pages · Structured Entry Authoring

Interest Pages werden nicht als Sammel-Textfelder authoriert. Sie bestehen aus **wiederholbaren semantischen Einträgen**. Der Reisende fügt zuerst einen konkreten Eintrag hinzu und beschreibt anschließend genau diesen Eintrag in einer passenden Maske.

Beispiele:

- Fotografie: **Fotospot hinzufügen** → Ort, Brennweite, Licht, Motive, Hinweis, Kartenbezug.
- Wandern & Natur: **Route hinzufügen** → Route, Startpunkt, Dauer, Schwierigkeit, Naturziele, Streckenhinweis, Kartenbezug.
- Kultur & Geschichte und Kulinarik & Lokal nutzen dieselbe Foundation mit archetypspezifischen Eintragsmasken.

> **Der Nutzer beschreibt den Eintrag. Studio komponiert die Darstellung.**

Die Layoutentscheidung bleibt bei Studio. Abhängig von Anzahl, Textmenge, Kartenbezug und verfügbarer Seitenkapazität kann Studio eine gemeinsame Editorial-Fläche oder zwei getrennte Boxen wählen. Der Reisende wählt keine Spaltenzahl und keine Box-Geometrie.

Die kompaktere Typografie bleibt dabei eine **adaptive Kapazitätsstufe ausschließlich für Interest Pages**. `comfortable` ist der Normalzustand; `tight` wird erst bei realem Platzdruck verwendet. Reicht auch `tight` nicht aus, greift `overflow`. Text wird niemals abgeschnitten. Companion und Footer bleiben harte Invarianten.

Für alle anderen Seitentypen bleibt die allgemeine Northern-Lines-Regel unverändert: Schrift wird nicht verkleinert, um ein Layoutproblem zu retten.

## Inspector UX Language · ruhige redaktionelle Aktionen

Auch wiederholbare Interest-Einträge folgen derselben UX Language wie die übrige Reisebearbeitung. **„Route hinzufügen“**, **„Fotospot hinzufügen“** und spätere vergleichbare Aktionen bleiben klar auffindbar, dürfen aber nicht wie dominante Verwaltungsbuttons wirken. Bestehende Einträge lesen sich im Inspector wie redaktioneller Inhalt; Entfernen bleibt eine sekundäre Aktion.

> **Der Inspector begleitet die Gestaltung. Er verwaltet keine Datensätze.**

Nicht editierbare Begleiter-Eigenschaften wie Platz, Pose und Spiegelung werden als ruhige Statuswerte dargestellt. Label und Wert verwenden dieselbe kleine UI-Schriftgröße; der Wert darf zur Erkennung fett gesetzt werden, erhält aber keine größere typografische Hierarchie und suggeriert keine Einstellbarkeit.



## Interest Page Authoring & Native UI Consistency · Build 029
- Interest Pages use repeatable semantic entries: the traveler adds a concrete place, route, photo spot or recommendation, then fills its dedicated mask.
- Studio composes those entries automatically; layout variants are not user settings.
- Culture & History uses **Ort / Station hinzufügen** and keeps category, editorial meaning, visit guidance, optional time reference and place/map reference attached to the same station.
- Travel Language applies inside editorial authoring. Entry navigation says **Zurück**, while the global dirty-state system keeps **Verwerfen · Abbrechen · Speichern**.
- Before release, visible Studio flows are checked for unintended browser/default HTML controls.
- Visible gate states remain semantic: **PASS green, WARN amber, FAIL red**; only the status word carries the signal color.


## 68. Interest Pages · Seitenanker, Ort und Einleitung

Für alle Destination Interest Pages gilt verbindlich eine reduzierte Kopf-Grammatik:

> **Das Interest wird einmal als blauer Seitenanker genannt. Der Ort ist der Seitentitel. Die Einleitung eröffnet die Vertiefung redaktionell.**

Damit entfällt die frühere doppelte Nennung des Interests als Seitenanker und großer Titel. Die vier kanonischen Anker lauten **Fotografie**, **Wandern & Natur**, **Kultur & Geschichte** und **Kulinarik & Lokal**. Der große Seitentitel ist immer der zugehörige Ort.

Die Einleitung ist kein fest verdrahteter Foundation-Text. Sie ist pro Interest Page editierbar und typografisch klar vom Seitentitel unterschieden. Studio darf einen ruhigen archetypspezifischen Vorschlag anzeigen, der Reisende kann ihn jedoch jederzeit ersetzen.

Diese Regel gilt ausschließlich für Interest Pages und verändert weder Destination Pages noch andere Seitengattungen.

## Build 030 · Kulinarik & Lokal — verbindliche Interest-Page-Regel
- Kulinarik & Lokal folgt derselben Structured-Entry-UX wie alle anderen Interest Pages.
- Der Nutzer fügt **Empfehlungen** hinzu; Studio verwaltet keine Restaurant- oder Bewertungsdatenbank.
- Eine Empfehlung hält Name, Art/Kategorie, redaktionelle Einordnung, **Probieren & entdecken**, **Gut zu wissen**, optionalen **Zeit-/Preisbezug** und optionalen **Ort-/Kartenbezug** semantisch zusammen.
- Der Nutzer entscheidet über Inhalte. Studio entscheidet automatisch über eine Box, zwei Boxen oder gruppierte/gestapelte Darstellung.
- Interest = Seitenanker · Ort = Seitentitel · Einleitung = editierbare redaktionelle Öffnung.
- Companion/Footer bleiben harte Safe-Zonen. `comfortable → tight → overflow` bleibt verbindlich; kompaktere Typografie ist ausschließlich für Interest Pages zulässig.


## Build 030 Polish · Culinary Density & Safe-Zone Correction

Für **alle Interest Pages** gelten bei informationsdichten Einträgen genau zwei feste Typografie-Stufen: `comfortable` und `tight`. `tight` ist eine definierte zweite Stufe und **niemals durch freie Skalierung** ersetzbar. Studio darf Text nicht schrittweise verkleinern, bis er zufällig in die Seite passt.

> **Interest Pages dürfen einmal dichter werden. Danach wird nicht weiter geschrumpft.**

Reicht die feste `tight`-Stufe nicht, wechselt die Seite in `overflow` und verwendet die bestehende Travel Language: **„Diese Seite kann diesen Inhalt nicht mehr ruhig erzählen.“** Companion- und Footer-Safe-Zonen bleiben dabei harte Invarianten.

Die Komposition wird vor der Verdichtung geprüft. Zwei ausgewogene Empfehlungen dürfen als zwei Boxen erzählt werden, wenn dadurch die Seite ruhiger und lesbarer wird. Ein textlicher Ort-/Kartenbezug ist noch keine gerenderte Karte und erzwingt daher nicht automatisch eine gestapelte Sammelfläche. Eine spätere echte Karte erhält eine eigene Kapazitätsreserve.

## Build 030 Fix · Global Content Fit & Composition Contract

Diese Regel gilt **für alle Seitentypen in Northern Lines Studio** – Interest Pages, Ortsseiten und alle weiteren redaktionellen Seiten.

> **Content Fit entscheidet über die Komposition.**

Studio darf eine Komposition erst final wählen, nachdem die für den jeweiligen Seitentyp freigegebenen Varianten gegen den vollständigen Inhalt geprüft wurden. Eine formal attraktive Variante ist ungültig, sobald sie Text abschneidet, Inhalt aus einer Fläche herauslaufen lässt, Companion-/Footer-Safe-Zonen verletzt oder eine unnötige Verdichtung erzwingt.

Für zwei redaktionelle Einheiten umfasst der freigegebene Kompositionsraum – sofern der jeweilige Seitentyp diese Varianten semantisch erlaubt – mindestens:

- volle Breite / gestapelt;
- 1/2–1/2;
- 1/3–2/3;
- 2/3–1/3;
- bereits etablierte adaptive Varianten wie 50/50, 60/40 und 70/30 in den dafür vorgesehenen Zonen.

Studio prüft die zulässigen Kandidaten vollständig und wählt die ruhigste passende Variante. Erst danach darf eine für den Seitentyp ausdrücklich erlaubte Dichte-Stufe greifen. Für Interest Pages bleiben ausschließlich `comfortable` und die eine feste `tight`-Stufe zulässig. Andere Seitentypen dürfen Schrift weiterhin **nicht** verkleinern, um ein Layoutproblem zu retten.

> **Nicht sammeln, sondern erzählen.**

Semantisch unterschiedliche Inhalte dürfen nicht aus Bequemlichkeit in eine große Sammelbox geschoben werden. Zusammengehörige Informationen bleiben zusammen; unterschiedliche Einheiten bleiben als eigene redaktionelle Einheiten erkennbar. Eine gemeinsame Fläche ist nur zulässig, wenn die Inhalte semantisch tatsächlich eine Einheit bilden und dadurch besser lesbar werden.

Die verbindliche Reihenfolge lautet:

1. vollständigen Inhalt erfassen;
2. alle für die Seite erlaubten Kompositionen prüfen;
3. Content Fit gegen die tatsächliche Content-Zone bewerten;
4. beste passende Komposition wählen;
5. nur falls ausdrücklich erlaubt, die feste alternative Dichte-Stufe prüfen;
6. Companion-, Footer- und weitere Safe-Zonen erneut prüfen;
7. wenn keine zulässige Variante passt: `overflow` statt Clipping, Verdrängen oder weiterer Verkleinerung.

Diese Regel ist kein Interest-Page-Sonderfall. Sie ist Teil der allgemeinen Northern-Lines-Layout-Grammatik.


## Build 030 Regression Fix · Capacity Protection bleibt autoritativ

Die adaptive Composition Engine darf die bestehende Capacity Protection niemals umgehen. Jede erlaubte Komposition wird gegen die geschützte Content-Zone geprüft. Wird in `comfortable` und der einmaligen Interest-Page-Stufe `tight` keine gültige Variante gefunden, wechselt Studio zwingend in `overflow`.

> **Capacity Protection bleibt autoritativ.**

Der bereits etablierte Travel-Language-Hinweis **„Diese Seite kann diesen Inhalt nicht mehr ruhig erzählen.“** ist der vorgesehene Endzustand. Companion und Footer bleiben frei; Clipping, weiteres Schrumpfen oder Rendern außerhalb der Content-Zone sind keine zulässigen Alternativen.

## Build 030 Fix · Overflow nur aus geometrischem Content Fit

Verbindliche Präzisierung der Capacity Protection:

> **Overflow nur aus geometrischem Content Fit.**

Eine Interest Page darf nicht allein wegen einer abstrakten Zeichenanzahl, einer pauschalen Textgewichtung oder eines nicht vorhandenen zukünftigen Moduls in `overflow` wechseln. Studio bewertet die zulässigen Kompositionen anhand ihrer umgebrochenen, kalibrierten Renderhöhe innerhalb der real geschützten Content-Zone.

- Vorhandener Seitenraum gehört dem vorhandenen Inhalt.
- Nicht vorhandene Module, insbesondere eine noch nicht gesetzte Karte, reservieren keinen Platz.
- Asymmetrische Höhen zweier Boxen sind zulässig.
- 1/2–1/2, 1/3–2/3, 2/3–1/3 und gestapelte Varianten bleiben Teil der Grammar.
- Companion und Footer bleiben harte Safe-Zonen.
- Erst wenn keine zulässige Komposition in `comfortable` bzw. der einen erlaubten Interest-Page-Stufe `tight` geometrisch passt, folgt `overflow`.

Der verbindliche Regressionstest ist **Geiranger · Wandern & Natur** mit den beiden Routen `Fosseråsa → Storsæterfossen` und `Skagehola → Skageflå → Homlong`. Der vollständige Hinweis `Sehr steile und teilweise ausgesetzte Abschnitte; Trittsicherheit erforderlich.` darf allein keinen Overflow auslösen.

## Build 031 · Travel Companion Pages

Northern Lines Studio unterscheidet verbindlich drei redaktionelle Seitengattungen:

- **Destination Pages** erzählen den Ort.
- **Interest Pages** vertiefen ein persönliches Interesse am Ort.
- **Travel Companion Pages** bewahren kuratiertes, wiederverwendbares Wissen, das viele oder alle Travelbooks begleitet.

> **Wiederkehrendes Wissen wird nicht bei jeder Reise neu erfunden. Es wird kuratiert, belegt und ruhig wiederverwendet.**

Travel Companion Pages dürfen einen kurzen, optionalen reisespezifischen Hinweis tragen. Dieser Hinweis ergänzt den kuratierten Kern, ersetzt ihn aber nicht. Destination-spezifische oder datumsabhängige Aussagen dürfen nicht als allgemeine Wahrheit in den Kern eingebrannt werden.

Für kuratierte Companion-Inhalte gilt zusätzlich:

1. Aussagen müssen auf belastbaren Quellen beruhen.
2. Quellenherkunft wird intern dokumentiert und bleibt mit dem kuratierten Inhalt nachvollziehbar.
3. Colloquiale Begriffe wie Goldene oder Blaue Stunde werden nicht als astronomisch exakt definiert dargestellt.
4. Zeit- und ortsabhängige Werte gehören in eine spätere date/location-aware Ebene, nicht in statischen Companion-Text.
5. Die globalen Content-Fit-, Safe-Zone- und Composition-Regeln gelten unverändert. Travel Companion Pages erhalten keine Sondererlaubnis für Clipping oder freie Typografie-Skalierung.

## Build 031 Fix · Page Geometry ist einmalig, nicht verschachtelt

Die physische A5-Seite besitzt bereits ihre verbindliche Seitengeometrie. Einzelne Seitentypen dürfen innerhalb dieser Geometrie **keine zweite pauschale, umlaufende Safe-Zone** erzeugen.

> **Safe-Zones sind semantisch, nicht dekorativ.**

Verbindlich gilt:

- die Bindungsreserve wirkt nur dort, wo sie physisch erforderlich ist;
- Companion- und Footer-Zonen bleiben eigene harte Schutzbereiche;
- Seitentypen dürfen nicht zusätzlich rundum Innenabstand reservieren und dadurch die nutzbare A5-Fläche künstlich verkleinern;
- Content Fit wird innerhalb der gemeinsamen Seitengeometrie bewertet;
- Ruhe entsteht durch Komposition und Hierarchie, nicht durch das Schrumpfen der nutzbaren Seite.

**Regressionstest:** Die Travel-Companion-Seite `Licht` muss dieselbe physische A5-Content-Fläche nutzen können wie eine Destination Page wie `Bergen`. Eine zweite innere Rahmengeometrie ist unzulässig.

## Build 032 · Travel Companion Master

`Licht` ist die erste freigegebene Ausprägung des **Travel Companion Master**. `Wetter` übernimmt dieselbe Grammar; der spätere Fotografie-Workshop folgt demselben Master, ohne die fachlichen Inhalte zu kopieren.

Verbindlich für Travel Companion Pages:

- weiße Seitenfläche und vollständige World Expression;
- ruhiger, kompakter Seitentitel ohne redundanten Seitentyp-Kicker;
- kurze redaktionelle Einleitung;
- ein kleiner, kuratierter Wissenskern aus semantisch getrennten Modulen;
- drei Module nebeneinander sind erlaubt und bevorzugt, wenn Content Fit und Lesbarkeit dies tragen;
- weitere Module werden adaptiv darunter komponiert;
- ein optionaler Bereich **„Für diese Reise“** ergänzt nur den konkreten Reisebezug;
- nicht vorhandene persönliche Ergänzungen reservieren keinen dekorativen Platz, gleichzeitig darf der kuratierte Kern die Seite nicht so füllen, dass sinnvolle Ergänzungen prinzipiell unmöglich werden;
- Companion- und Footer-Safe-Zonen bleiben hart;
- keine zweite umlaufende Safe-Zone;
- Content Fit entscheidet über die Komposition.

> **Der Master ist eine Grammar, kein Inhaltstemplate.**

`Licht`, `Wetter` und der Fotografie-Workshop teilen Seitensystem, Hierarchie und UX Language. Ihre Wissensmodule bleiben fachlich eigenständig und werden jeweils fundiert recherchiert.

### Travel Companion Inspector

Der Inspector bleibt UI und darf nicht wie eine zweite Druckseite auftreten. Titel und Statuswerte sind deshalb ruhig gesetzt:

- Titel wie `Licht` oder `Wetter`: kompakte UI-Typografie, semibold;
- Werte wie `kuratiert`, `4 vorhanden`, `optional`: gleiche Größenordnung wie die zugehörigen Labels, nur durch Gewicht hervorgehoben;
- keine große Serifentitel-Typografie für Inspector-Werte;
- Beschreibung bleibt klein, ruhig und erklärend.


## Travel Companion Master · Fotografie-Workshop (Build 033)

Der Fotografie-Workshop folgt der gemeinsamen Travel-Companion-Seitengeometrie, ist aber **vollständig kuratiert**.

Verbindlich:

- keine Softwarevorgabe (kein Luminar-, ON1-, Lightroom- oder anderer Produktworkflow),
- kein reisespezifisches Authoring,
- keine festen Kamera-Rezepte wie pauschale Blenden-, ISO- oder Brennweitenwerte,
- vier kuratierte Themenwelten: **Sehen · Gestalten · Belichten · Unterwegs**,
- der Workshop vermittelt Entscheidungen, nicht Rezepte,
- Licht und Wetter dürfen als benachbarte Companion-Themen referenziert werden, ohne deren Inhalte zu wiederholen,
- die gemeinsame A5-Geometrie, Companion-Safe-Zone und Footer-Safe-Zone bleiben verbindlich,
- der Inspector zeigt kuratierte Fakten in ruhiger UI-Typografie und keine Authoring-Maske.

Leitsatz:

> **Erst sehen und entscheiden. Dann die Kamera dafür arbeiten lassen.**

## Build 034 · Global Capacity Inheritance for New Page Grammars

New page grammars, curated heroes and secondary editorial elements must inherit the existing Content Fit and Safe-Zone contract. A newly introduced layout path may never bypass Capacity Protection.

Binding rules:

- Core content, Companion and Footer have priority over decorative or secondary elements.
- A secondary bridge, curated hero or similar supportive element yields space before core content is compressed.
- A page grammar must participate in the shared A5 geometry; it may not claim an independent full-page height that competes with Footer or Companion.
- If no allowed composition fits the real geometric content area, Studio uses the established travel-language overflow state instead of clipping or overlap.
- Capacity decisions are based on real layout geometry, not abstract character counts.

> **Neue Grammar erbt Capacity Protection. Sie definiert sie nicht neu.**

## Build 034 Final · Literal White Content Surfaces & Version Parity

The final Build-034 consistency review makes the existing white-page rule mechanically enforceable.

> **World Expression colours content surfaces. The physical editorial page remains white.**

Binding rules:

- Fjord Destination Pages use literal `#FFFFFF`; historical cream values such as `#fffdfa` and `#f8f7f3` are not valid paper surfaces.
- Ostsee Destination Pages use literal `#FFFFFF` as well.
- Destination Interest Pages and Travel Companion content pages remain white; World expression continues through typography, accents, signets, curated heroes and semantic content surfaces.
- `paperTone` is a semantic contract and must agree with the visible physical page surface.
- A Consistency Gate may never call a cream paper value a “white” surface.
- The app version in `package.json`, `src-tauri/tauri.conf.json`, `src-tauri/Cargo.toml` and the root package entry in `Cargo.lock` must match before release packaging.

This rule applies to editorial/content pages. Dedicated cover artwork remains governed by the Cover grammar.


## Curated World Heroes (Build 035)

- Interest Pages and the Fotografie-Workshop may use a small curated hero that is owned by the active Editorial World.
- The user cannot choose, replace, hide or upload this image. It is not travelbook content and is not stored redundantly in `.nls`.
- The Fotografie-Workshop is the maximum-size reference for this hero family.
- The hero lives only in the page header. Introductory text may flow around it; all following modules return to the established full content geometry.
- The hero never moves or narrows Companion, Footer or the persistent module grid.
- Capacity Protection remains authoritative. New hero grammar inherits the same safe-zone and content-fit rules as every other page grammar.
- Build 035 introduces this contract for the Fjord World first.
