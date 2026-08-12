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
