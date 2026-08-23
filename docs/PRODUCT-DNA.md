# Northern Lines Studio – Produkt-DNA & Retrospektive

**Stand:** Golden Build 040 · Studio 0.40.0-alpha.1  
**Projekt:** Northern Lines Studio  
**Dokumenttyp:** Dauerhafte Produkt-, UX- und Layoutreferenz  
**Status:** Verbindliche Produktreferenz für nachfolgende Builds

---

## 1. Warum dieses Dokument existiert

Northern Lines Studio ist nicht durch eine Featureliste entstanden, sondern durch wiederholtes Bauen, Anschauen, Kritisieren und Verdichten.

Viele der stärksten Regeln entstanden genau dann, wenn eine technisch funktionierende Lösung noch nicht nach Northern Lines aussah oder sich nicht nach Northern Lines anfühlte.

Dieses Dokument schützt deshalb nicht einzelne Implementierungen. Es schützt die Produktidee.

> **Ein Build kann technisch korrekt und trotzdem produktseitig falsch sein.**

Neue Funktionen, Refactorings, Exportpfade und Architekturentscheidungen werden gegen diese DNA geprüft.

---

## 2. Der zentrale Leitgedanke

> **Intern darf Northern Lines Studio komplex sein. Für den Reisenden muss es sich selbstverständlich anfühlen.**

Komplexität darf existieren:

- im Datenmodell;
- in `.nls`;
- in Rust;
- in Migrationen;
- in Layout Grammars;
- in Content Fit;
- in Consistency Gates;
- in PDF- und PDF/A-Infrastruktur;
- in Tests und Validierung.

Sie darf nicht ungefiltert in die Produktoberfläche gelangen.

Studio erklärt dem Reisenden nicht seine Implementierung. Studio hilft ihm, eine Reise zu planen, einen Ort zu erzählen, eine Seite zu beurteilen und ein Travelbook entstehen zu lassen.

---

## 3. Das Produktprinzip

> **Wenige starke Möglichkeiten. Viele persönliche Geschichten.**

Ein gutes Studio-Feature fragt nicht:

> Welche technischen Optionen können wir noch anzeigen?

Sondern:

> Welche Entscheidung muss der Reisende hier wirklich treffen?

Studio soll Entscheidungen abnehmen, die keinen persönlichen Wert besitzen, und Entscheidungen offenlassen, die Bedeutung tragen.

Der Reisende entscheidet über Inhalt, Erinnerung und Wirkung. Studio übernimmt technische Geometrie, sichere Abstände, Layout Grammar, Content Fit und Exportmechanik.

---

## 4. Studio ist kein allgemeines DTP-Programm

Northern Lines Studio ist eine spezialisierte visuelle und redaktionelle Arbeitsumgebung für Travel Publishing.

Es ist ausdrücklich kein:

- Affinity-Publisher- oder InDesign-Ersatz;
- freier Layoutdesigner;
- CMS;
- Datenbankeditor;
- Formularsystem;
- Theme Editor;
- Template-Marktplatz;
- generischer Page Builder.

Der Reisende arbeitet nicht mit:

- freien X/Y-Koordinaten;
- beliebigen Textrahmen;
- frei verschiebbaren Elementen;
- manueller Box-Geometrie;
- technischen IDs;
- Manifesten;
- Asset-IDs;
- Renderer-Begriffen.

> **Der Nutzer editiert Bedeutung. Studio komponiert sie.**

---

## 5. Travel Language

Studio spricht Travel Language, keine Implementierungssprache.

Beispiele:

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
| Grammar | nicht als normale Reisenden-UX |
| Destination Interest Kind | Interesse / redaktionelle Vertiefung |

Travel Language ist nicht bloß freundlicheres Wording. Sie beeinflusst die Produktidee.

Aus einem technischen „Hero Banner“ wurde beispielsweise **Weite** – und damit ein flaches, ruhiges Panorama statt eines dominanten Web-Heros.

---

## 6. Die wichtigste Fläche ist das Travelbook

Priorität der Oberfläche:

1. **Travelbook / Canvas**
2. Inspector
3. Navigation
4. technische Infrastruktur – unsichtbar

Der Inspector ist ein ruhiger redaktioneller Begleiter und kein Datenbankeditor.

Nicht jedes vorhandene Feld muss sichtbar sein. Ein reiches Datenmodell ist keine Aufforderung zu einer reichen Formularoberfläche.

> **Sichtbarkeit ist nicht gleich Datenbestand.**

---

## 7. Der Reisende entscheidet über Bedeutung

Studio entscheidet unter anderem:

- technische Seitengeometrie;
- sichere Abstände;
- zulässige Layoutkandidaten;
- Content-Fit-Regeln;
- Footerposition;
- Companion Safe Zone;
- World-konforme Darstellung;
- Exportmechanik.

Der Reisende entscheidet unter anderem:

- was ein Ort für seine Reise bedeutet;
- was er erleben möchte;
- welche Geschichte erzählt wird;
- welche Bilder und Erinnerungen wichtig sind;
- welche zugelassene Seitenwirkung passt.

---

## 8. Semantik vor Bequemlichkeit

Bestehende Domain-Felder dürfen niemals für eine andere Bedeutung missbraucht werden.

Wenn ein passendes semantisches Feld nicht existiert, wird kein anderes Feld zweckentfremdet, nur damit die UI etwas speichern kann.

Neue persistierte Konzepte benötigen einen echten Domain-Grund.

> **Lieber eine Funktion später korrekt modellieren als heute semantisch beschädigen.**

`.nls` speichert redaktionelle Bedeutung und Projektzustand, keine freie Layoutgeometrie.

---

## 9. Reise → Ort → Vertiefung

Die semantische Entwicklung von Studio folgt einer natürlichen Linie:

```text
Projekt
  ↓
Reise
  ↓
Destination
  ↓
redaktionelle Vertiefung
  ↓
Travelbook
```

Eine Destination ist kein Synonym für eine Seite. Sie ist das semantische Zentrum eines Ortes.

Interest Pages duplizieren das Ortsprofil nicht. Sie vertiefen es aus einem kuratierten Interesse heraus.

> **Die Destination bleibt das Zentrum. Die Vertiefung folgt dem Interesse der Reise.**

---

## 10. Die vier Destination-Interest-Archetypen

Die kuratierten Vertiefungen sind:

- Fotografie;
- Wandern & Natur;
- Kultur & Geschichte;
- Kulinarik & Lokal.

Diese vier Archetypen beweisen ein wichtiges Produktprinzip: Studio braucht keine unendliche Template-Sammlung, sondern wenige starke redaktionelle Archetypen mit belastbarer Grammar.

Die Archetypen dürfen fachlich unterschiedliche Eingaben und Darstellungen besitzen, bleiben aber Teil derselben Studio- und World-Sprache.

---

## 11. Editorial Worlds sind Sprachen, keine Themes

Eine Editorial World ist eine kuratierte visuelle Sprache.

Sie kann definieren:

- Display- und Body-Typografie;
- Color Language;
- Graphic Language;
- Curated Accents;
- Companion;
- Image / Asset Language;
- semantische Flächen und Signets.

Der Reisende arbeitet innerhalb dieser Sprache. Er gestaltet die Sprache nicht neu.

Das verhindert Beliebigkeit.

### Die weiße Seite

Die physische Seite bleibt weiß bzw. neutral-weiß.

World Expression entsteht gezielt über:

- Fotografie;
- Typografie;
- Akzentfarben;
- Signets;
- kuratierte Flächen;
- Curated Accents;
- Companion.

Eine World färbt nicht einfach die ganze Seite ein.

### Interest Pages

Destination Interest Pages erben die vollständige aktive World Expression – nicht nur deren Typografie.

---

## 12. Finite Visual Vocabulary

Northern Lines benötigt keine freie Asset-Flut.

Visuelle Elemente besitzen semantische Rollen, beispielsweise:

- Tipp;
- Wichtig;
- Fotospot;
- Wissen;
- Souvenir.

> **Das Signet sagt, was es ist. Die Farbe sagt, zu welcher Welt es gehört.**

Wo Signet und ruhige World-Fläche ausreichen, werden keine zusätzlichen Rahmen, Badges oder dekorativen Karten erfunden.

> **Nicht jede freie Fläche braucht ein Gestaltungselement.**

Fotografie bleibt die wichtigste Farbquelle des Travelbooks.

---

## 13. Die drei Destination-Seitenwirkungen

Für Ortsprofile bleiben die etablierten Wirkungen:

- **Weite**;
- **Bild links**;
- **Bild rechts**.

Sie sind redaktionelle Wirkungen, keine frei editierbaren Templates.

Ein Wechsel der Seitenwirkung ist nicht-destruktiv. Er verändert keine redaktionellen Inhalte, keine World Identity, keinen Companion und keinen Footer.

### Weite

Weite ist:

- breit;
- flach;
- ruhig;
- atmosphärisch;
- eine Öffnung des Ortes.

Weite ist kein klassischer Web-Hero und kein Marketingheader.

---

## 14. Hero und Title

> **Hero und Title sind Geschwister, keine Mitbewohner.**

Hero Zone und Title Zone bleiben getrennt.

Ein langer Ortsname darf adaptive Grammar auslösen. Er wird nicht durch aggressive Schriftverkleinerung, Silbentrennung oder das Ausleihen der Hero-Fläche „repariert“.

Die Subline begleitet den Ort und konkurriert nicht mit ihm.

---

## 15. Geschützte Zonen

Verbindlich geschützt sind:

- Hero Zone;
- Title Zone;
- Content Zone;
- Editorial Extension Zones;
- Companion Safe Zone;
- Footer Safe Zone;
- Binding Safe Zone.

> **Kuscheln erlaubt, jeder im eigenen Bett.**

Nähe ist erlaubt. Überlagerung und das Ausleihen geschützten Raums sind es nicht.

---

## 16. Der Companion ist unantastbar

Der Companion ist kein beliebiges Maskottchen und kein normaler Layoutteilnehmer.

Er ist Teil der Editorial World und Reisebegleiter.

Er besitzt definierte:

- Auftrittspunkte;
- Position;
- Größe;
- Pose;
- Spiegelung;
- Schutzfläche.

> **Der Companion nimmt nicht am Layout teil. Das Layout nimmt Rücksicht auf den Companion.**

> **Der Begleiter ist unantastbar – und sein Raum ebenfalls.**

Content Fit bewegt nicht den Companion, um eine Seite zu retten.

---

## 17. Footer und wiederkehrende Identität

Der Footer ist ein stabiler Northern-Lines-Anker.

> **TRAVEL · PHOTOGRAPHY · Signet · MEMORIES**

Footer, Seitenzahl und Companion werden nicht von Seitenwirkungen oder Content-Höhen opportunistisch verschoben.

Der Content respektiert ihre geschützten Bereiche.

---

## 18. Weißraum

Weißraum ist Teil der Northern-Lines-Sprache.

Er erzeugt:

- Ruhe;
- Hierarchie;
- Lesbarkeit;
- Fokus;
- hochwertige Wirkung.

Aber:

> **Weißraum ist intentional, nicht zufällig.**

Auf A5 darf Platz nicht sinnlos verschenkt werden, wenn dadurch redaktioneller Inhalt unnötig verdrängt wird.

---

## 19. Layout Grammar statt Template-Sammlung

Studio wächst nicht zu einer Bibliothek aus Bergen-, Visby-, Geiranger- und Ålesund-Templates.

Stattdessen gilt:

> **Wenige Archetypen + belastbare Layout Grammar.**

Die Grammar besitzt eine endliche Menge erlaubter Kompositionen und reagiert auf reale Inhalte.

Drei Boxen nebeneinander können richtig sein, wenn Inhalte kurz, gleichgewichtig und scanbar sind. Dieselbe Komposition ist falsch für lange Fließtexte.

Die Zahl der Boxen entscheidet nicht. Die redaktionelle Eignung entscheidet.

---

## 20. Content Fit before Composition

Eine der wichtigsten Erkenntnisse nach Build 023 lautet:

> **Content Fit before Composition.**

Studio wählt nicht früh ein Layout und quetscht anschließend Inhalte hinein.

Es prüft die zulässigen Kandidaten gegen:

- semantischen Inhalt;
- geschützte Zonen;
- Typografie;
- verfügbare Fläche;
- zulässige Density.

Erst danach entsteht die aufgelöste Komposition.

Ein Kandidat ist ungültig, wenn er Clipping, willkürliche Typografie-Skalierung oder das Ausleihen von Companion-/Footer-Flächen benötigt.

---

## 21. Content Capacity

Capacity kann intern als:

- `comfortable`;
- `tight`;
- `overflow`

verstanden werden.

Wenn die finite Grammar erschöpft ist, wird Inhalt nicht heimlich entfernt oder verkleinert.

Studio spricht auch im Fehlerfall Travel Language, beispielsweise:

> **Für diese Seitenwirkung wird es etwas eng.**

Langfristig darf Studio passende Alternativen erklären, ohne dem Reisenden die redaktionelle Entscheidung heimlich abzunehmen.

---

## 22. Nicht sammeln, sondern erzählen

Strukturierte semantische Entries bleiben eigenständige Erzählbausteine.

Sie dürfen nicht in eine generische Sammelbox kollabieren, nur weil das Layout dadurch einfacher wird.

> **Nicht sammeln, sondern erzählen.**

Diese Regel schützt Interest Pages besonders vor dem Rückfall in CMS- oder Kartenraster-Logik.

---

## 23. Travel Companion Content

Travel Companion Pages tragen wiederverwendbares Northern-Lines-Wissen.

Kuratiertes Wissen ist Produktinhalt und wird nicht in jedes `.nls`-Projekt dupliziert.

Persönlicher oder konkret reisespezifischer Kontext darf Projektinhalt sein.

> **Curated truth is product content; personal travel context is project content.**

---

## 24. Utility- und Erinnerungsseiten

Mit der Reife von Studio gehören nicht nur Destination- und Interest-Seiten zum Travelbook.

Utility-, Notes-, Orientation- und Memories-Seiten sind Teil des redaktionellen Gesamtbogens, sofern sie dieselben Northern-Lines-Grundsätze respektieren:

- Travel Language;
- World Expression;
- ruhige Hierarchie;
- geschützte Geometrie;
- semantischer Inhalt vor freiem Layout.

Sie sind keine Ausrede für einen zweiten Gestaltungskosmos innerhalb desselben Travelbooks.

---

## 25. Golden Build 040 – A5 ist physisch

DIN A5 ist keine abstrakte Canvas-Metapher.

Golden Build 040 definiert die physische Studio-Seite verbindlich als exact DIN A5.

```text
Studio width            420 u
physical height         595.9459459459 u
Golden composition      420 × 594 u
physical medium         148 × 210 mm
```

Die etablierte Golden Composition bleibt innerhalb dieser physischen Seite visuell maßgeblich.

Die Korrektur auf exaktes A5 ist keine Einladung, Footer, Companion, Title, Hero oder Content neu zu komponieren.

> **Studio entscheidet, was die Seite ist.**

---

## 26. Studio ist die visuelle und geometrische Authority

Eine wesentliche Weiterentwicklung gegenüber frühen Builds ist heute verbindlich:

> **Studio ist die visuelle und geometrische Quelle der Wahrheit für Studio-originierte Seiten.**

Damit ist die frühere Vorstellung superseded, dass Studio lediglich eine ungefähre Editorial Preview besitzt und Northern Lines Publisher dieselbe Seite später mit eigener Layout Grammar final neu interpretiert.

Für Studio-originierte Seiten gilt:

```text
Studio resolved page
      ↓
proof/export
      ↓
optional downstream production infrastructure
```

Downstream-Systeme dürfen validieren, paketieren, preflighten oder produzieren. Sie dürfen die bereits aufgelöste Studio-Seite nicht eigenmächtig neu komponieren.

---

## 27. Northern Lines Publisher bleibt wichtig – mit neuer Grenze

Publisher ist nicht bedeutungslos geworden.

Er bleibt ein eigenständiges Produkt und kann langfristig professionelle Production-/Prepress-Aufgaben, CLI-Infrastruktur, deterministische Reports, Asset-Staging, Hashing, Preflight oder Affinity-nahe Workflows übernehmen.

Aber für Studio-originierte Seiten gilt:

> **Publisher darf Studio nicht überschreiben.**

Eine zweite Layout Engine, die dieselben Inhalte anders interpretiert, würde wieder genau das Problem erzeugen, das wir vermeiden wollen:

```text
Studio ≠ Output
```

Die neue strategische Trennung lautet deshalb eher:

```text
Studio      = Authoring + Composition Authority
Publisher   = optionale Production / Prepress Infrastructure
```

---

## 28. PDF Proof ist visuelle QA

Studio besitzt einen akzeptierten macOS-PDF-Proof-Pfad.

Er reproduziert die bereits aufgelöste Studio-Seite über native WKWebView-PDF-Erzeugung und eine content-erhaltende PageBox-Normalisierung auf exact A5.

Der Proof ist keine zweite Layout Engine.

Er beantwortet die Frage:

> **Ist das, was Studio zeigt, auch als physische Seite genau das, was wir erwarten?**

Der frühere System-Print-/A4-Versuch ist historische Evidenz, nicht aktuelle Produktarchitektur.

---

## 29. Whole-document Proof und Standard PDF

Studio kann nicht nur eine Seite prüfen, sondern ein komplettes Travelbook in kanonischer Publikationsreihenfolge erzeugen.

Der akzeptierte Pfad unterstützt variable Seitenzahlen und wurde mit einem realen 16-seitigen Travelbook in der installierten macOS-App geprüft.

Das ist ein wichtiger Reifeschritt:

> Studio ist nicht mehr nur eine visuelle Redaktion einzelner Seiten. Es versteht das Travelbook als zusammenhängendes physisches Dokument.

---

## 30. PDF/A-2b ist Export, kein Layoutmodus

Studio besitzt einen akzeptierten PDF/A-2b-Exportpfad.

PDF/A wird als begrenzte strukturelle Nachverarbeitung des akzeptierten Standard PDF erzeugt.

Nicht erlaubt sind:

- Re-Rendering;
- Rasterisierung;
- Reflow;
- Skalierung;
- Translation;
- zweite Composition Engine.

Page Count, Reihenfolge, A5 PageBoxes, Content Streams, Image Streams, Font Resources und Layout Geometry bleiben geschützt.

Externe veraPDF-Validierung ist die Engineering-/Release-Authority für ISO-Conformance.

Der reale 16-Seiten-Test hat diese Kette erfolgreich bewiesen.

---

## 31. Proof und Export dürfen Studio nicht verändern

Ein Rendererproblem wird nicht dadurch gelöst, dass Studio passend gemacht wird.

Verboten sind insbesondere:

- fit-to-page;
- scale-to-fit;
- shrink-to-fit;
- nicht-uniforme Skalierung;
- renderer-spezifische Ersatztypografie;
- nachträgliche Re-Komposition.

> **Der Exporter reproduziert Studio; er interpretiert Studio nicht neu.**

---

## 32. macOS first

Die aktive Produkt- und Engineering-Plattform ist macOS.

Windows bleibt möglich, ist aber für die aktuelle Entwicklungsphase deferred.

Es werden keine spekulativen Abstraktionen oder Abhängigkeiten eingeführt, nur um einen späteren Windows-Pfad vorwegzunehmen.

> **Make the proven macOS path boring, deterministic and reliable first.**

---

## 33. Der Knigge-Test

Im Projekt hat sich ein humorvoller, aber nützlicher Prüfstein etabliert:

> **Brauchen wir dafür eine neue Ausgabe des Knigge?**

Wenn Studio etwas technisch vom Nutzer verlangt, das Studio selbst zuverlässig wissen oder darstellen kann, ist das meist ein UX-Fehler.

Beispiel: Der Nutzer gibt `08:00` ein. Er muss nicht jedes Mal „Uhr“ tippen, wenn Studio bereits weiß, dass es sich um eine Zeit handelt.

Der Knigge-Test bedeutet:

> **Lass den Reisenden keine technische oder typografische Arbeit erledigen, die Studio selbst zuverlässig übernehmen kann.**

---

## 34. Build-Disziplin

Kein „wenn wir schon dabei sind“.

Ein Build besitzt einen Scope. Neue Funktionen werden entlang ihrer tatsächlichen Responsibility Chain umgesetzt.

Für persistierte Domain-Funktionen bleibt das bewährte Muster:

```text
Model → Rust → Migration → Command → Inspector → Preview → Tests
```

Rein abgeleitete Layout- oder Workspace-Funktionen benötigen nicht künstlich jede Schicht, müssen aber ihre eigenen Verträge und Regressionen schützen.

Kein allgemeines Refactoring nur deshalb, weil eine Datei groß oder historisch gewachsen ist.

---

## 35. Consistency Gates und Real-World-Test

Tests grün ist notwendig, aber nicht hinreichend.

Studio verwendet spezialisierte Consistency Gates für fachliche und geometrische Verträge.

Der kanonische lokale Gate umfasst:

```bash
pnpm check
pnpm test
pnpm consistency
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
git diff --check
```

Native macOS-Funktionen benötigen zusätzlich echte Runtime-Evidenz.

Automatisierte Gates, installierte App, erzeugtes PDF, physische A5-Prüfung, visuelle Prüfung und externe PDF/A-Conformance sind getrennte Aussagen und dürfen nicht zu einem pauschalen PASS zusammengezogen werden.

---

## 36. Echte Reisen statt künstlicher Demo

Northern Lines Studio wird bevorzugt mit realen Reiseinhalten geprüft.

Echte Orte und echte Travelbooks zeigen Probleme, die künstliche Demo-Daten nicht sichtbar machen.

Bergen, Geiranger, Ålesund, Haugesund, Visby und vollständige Travelbooks sind deshalb nicht nur Beispiele, sondern Produktprüfsteine.

Unterschiedliche Content-Dichten – wenig, normal, Stress – gehören zur Layoutvalidierung.

---

## 37. Kritik ist Teil des Entwicklungsprozesses

Viele heutige Verträge entstanden aus visueller Kritik:

```text
Hero zu dominant
→ Weite

technische Labels
→ Travel Language

Inspector zu voll
→ redaktionelle Hierarchie

Companion überdeckt Content
→ Companion Safe Zone

Subline kollidiert mit Titel
→ Title Zone

Content passt nicht
→ Content Fit before Composition

ungefähre A5-Fläche
→ Golden Build 040 exact A5

PDF unterscheidet sich von Studio
→ Studio-owned geometry + accepted proof path
```

Das ist kein planloses Nachbessern.

Es ist die Methode, mit der aus einem funktionierenden Werkzeug ein Northern-Lines-Produkt geworden ist.

---

## 38. Was niemals passieren soll

Northern Lines Studio darf nicht zu Folgendem werden:

- CMS – alle Felder permanent sichtbar;
- Datenbankeditor – Strukturen dominieren die Sprache;
- DTP light – Nutzer verschieben Kästchen;
- Theme Editor – World Identity wird beliebig;
- Template-Marktplatz – Varianten ersetzen Grammar;
- Entwickleroberfläche – interne IDs erklären die Software;
- Feature-Sammlung – Funktionen werden sichtbar, nur weil sie existieren;
- Renderer-Frontend – Studio wird verbogen, damit ein Exporter funktioniert.

---

## 39. Was Studio stattdessen sein soll

Northern Lines Studio soll sich anfühlen wie:

> **ein ruhiger Schreibtisch für eine bevorstehende Reise.**

Man sieht das Travelbook.

Man sieht den Ort.

Man trifft wenige Entscheidungen.

Man wird begleitet.

Die Technik bleibt im Hintergrund.

Die Reise bleibt im Vordergrund.

---

## 40. Die unverhandelbaren Regeln

### Produkt

1. Travelbook vor Technik.
2. Reisender vor Datenmodell.
3. Wenige starke Möglichkeiten.
4. Keine freie DTP-Logik.
5. Travel Language.
6. Technische Komplexität bleibt intern.
7. Sichtbarkeit ist nicht gleich Datenbestand.
8. Keine semantische Zweckentfremdung.

### Editorial Worlds

9. World ist kuratierte Sprache, kein Theme.
10. Die Seite bleibt weiß / neutral-weiß.
11. Fotografie bleibt primäre Farbquelle.
12. Interest Pages erben vollständige World Expression.
13. Finite Visual Vocabulary statt Asset-Wust.

### Layout

14. Hero und Title bleiben getrennte Zonen.
15. Companion Safe Zone.
16. Footer Safe Zone.
17. Binding Safe Zone.
18. Typografie wird nicht für Capacity geopfert.
19. Content Fit before Composition.
20. Keine Überlagerung geschützter Zonen.
21. Nicht sammeln, sondern erzählen.
22. Golden Build 040 ist die physische A5-Basis.

### Architektur

23. Semantik statt freier Koordinaten in `.nls`.
24. Studio ist Composition Authority für Studio-originierte Seiten.
25. Downstream reproduziert Studio und interpretiert es nicht neu.
26. Publisher darf Studio-originierte Seiten nicht re-komponieren.
27. PDF/A ist Nachverarbeitung, kein Layoutmodus.
28. macOS ist die aktive Plattform.

### Entwicklung

29. Scope einhalten.
30. Keine Regression.
31. Consistency Gates + echte Runtime-Evidenz.
32. Dokumentation ist Teil der Implementierung.
33. Bewiesene Architektur wird nicht ohne neue Evidenz und Entscheidung neu eröffnet.

---

## 41. Leitfragen für jeden zukünftigen Build

### Produkt

- Hilft das dem Reisenden?
- Muss der Nutzer diese technische Information wirklich sehen?
- Spricht die UI Travel Language?
- Wird das Travelbook dadurch wichtiger oder die Software?

### UX

- Gibt es zu viele Entscheidungen gleichzeitig?
- Kann Studio etwas zuverlässig automatisch übernehmen?
- Wirkt der Inspector wie ein Begleiter oder wie ein Formular?
- Bleibt genügend Ruhe?

### Layout

- Funktioniert es auf exact A5?
- Bleiben alle geschützten Zonen unangetastet?
- Funktioniert es mit wenig und viel Content?
- Wird Typografie geopfert?
- Wurde Content Fit vor Composition geprüft?

### Editorial World

- Bleibt die Seite neutral-weiß?
- Erbt die Seite die vollständige World Expression?
- Ist das visuelle Element semantisch begründet?
- Erweitern wir gerade unnötig das visuelle Vokabular?

### Architektur

- Ist die Information semantisch korrekt modelliert?
- Wird ein bestehendes Feld zweckentfremdet?
- Muss das Schema wirklich erweitert werden?
- Ist Studio weiterhin Authority für seine aufgelöste Seite?
- Versucht ein Downstream-System, Studio neu zu interpretieren?

### Entwicklung

- Ist die relevante Responsibility Chain vollständig?
- Sind Regressionen geschützt?
- Ist der Scope eingehalten?
- Sind automatisierte Gates und Runtime-Evidenz sauber getrennt?
- Ist Dokumentation Teil der Lieferung?

---

## 42. Entwicklungsphasen bis Golden Build 040

Die Entwicklung lässt sich rückblickend in vier große Bewegungen lesen:

### I. Studio versteht die Reise

Journey Planning und Destination Entity etablierten Reise und Ort als semantische Grundlage.

### II. Studio lernt Northern Lines zu komponieren

Safe Zones, Companion, Imagery, Editorial Extensions, Editorial Worlds, Interest Pages und adaptive Layout Grammar formten die visuelle Sprache.

### III. Studio lernt mit echten Inhalten umzugehen

Structured Entries, vier Interest-Archetypen, Content Fit before Composition, Travel Companion Content, Utility-/Memory-Seiten und Capacity Protection machten das System belastbar.

### IV. Studio wird ein physisches Travelbook

Golden Build 040, Single-page Proof, Document Proof, Standard PDF und PDF/A-2b verbanden die Studio-Komposition mit einem realen exact-A5-Dokument.

Damit markiert Golden Build 040 einen natürlichen Konsolidierungspunkt:

> **Build 001–040: Studio lernt, ein Northern-Lines-Travelbook zu sein.**

Die nächste Phase ist nicht mehr primär der Beweis, dass Studio diese Idee tragen kann. Sie ist die kontrollierte Reifung zu einem fertigen Produkt.

---

## 43. Die Northern-Lines-Studio-DNA

> **Northern Lines Studio ist kein Programm, mit dem man Seiten baut. Es ist eine Umgebung, in der man eine Reise erzählt.**

> **Der Reisende entscheidet über Bedeutung und Wirkung. Studio übernimmt die technische Komplexität.**

> **Der Inhalt gehört zur Reise und zum Ort. Die Layout Grammar sorgt dafür, dass daraus Northern Lines wird.**

> **Studio entscheidet, was die Seite ist. Der Exporter reproduziert Studio; er interpretiert Studio nicht neu.**

> **Wenige starke Möglichkeiten. Viele persönliche Geschichten.**

> **Intern darf es kompliziert sein. Für den Reisenden muss es sich selbstverständlich anfühlen.**

Northern Lines Studio wird nicht danach beurteilt, wie viele Funktionen es anbietet.

Es wird danach beurteilt, wie selbstverständlich sich daraus eine Reise gestalten lässt.

---

## 44. Schlussgedanke

Im besten Fall verschwindet die Software gedanklich.

Übrig bleiben:

- ein Ort;
- eine Route;
- ein Bild;
- eine Geschichte;
- ein paar Entscheidungen;
- Vorfreude;
- und später ein Rucksack voller Erinnerungen.

Das ist die DNA, die alle kommenden Builds schützen sollen.
