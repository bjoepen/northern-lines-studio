> **Build 031 · Travel Companion Foundation: Licht:** Studio führt wiederverwendbare Travel Companion Pages als dritte Seitengattung ein. Die Seite „Licht“ enthält einen kuratierten, recherchierten Northern-Lines-Kern zu Goldenem Licht, Blauer Stunde, ziviler Dämmerung und bedecktem Himmel. Nur ein kurzer optionaler Reisehinweis wird projektspezifisch authoriert; orts- und datumsabhängige Sonnenzeiten bleiben ausdrücklich außerhalb des statischen Kerns.

> **Build 029 · Interest Page Header & Intro Fix:** Interest Pages nennen das Interest nur noch einmal als blauen Seitenanker. Der Ort ist der Seitentitel; die Einleitung ist direkt im Vertiefungs-Inspector editierbar. `Wandern & Natur` ist der kanonische Anker. Die Änderung gilt für alle Interest-Archetypen und spart vertikalen Seitenraum.

> **Build 028 · Interest Entry Authoring Fix:** Interest Pages werden jetzt über wiederholbare semantische Einträge authoriert: „Fotospot hinzufügen“, „Route hinzufügen“ usw. Erst danach öffnet sich die passende Maske. Studio entscheidet selbst zwischen einer gemeinsamen oder zwei Editorial-Boxen und nutzt kompakte Typografie nur bei echtem Platzdruck. Text-Clipping ist unzulässig; Companion und Footer bleiben harte Anker.

> **Build 028 · Hiking & Nature Polish:** Route, Start, Dauer, Schwierigkeit, Naturziel und Streckenhinweis bleiben jetzt als ein Tourenmodul zusammen. Companion und Footer sind harte Anker. Nur Interest Pages dürfen für dichte Praxisinhalte auf eine definierte kompakte Sekundärtypografie wechseln; alle anderen Seiten sind ausdrücklich ausgeschlossen.

> **Build 026 · World Expression Polish:** Thematische Vertiefungsseiten erben jetzt die vollständige Editorial-World-Expression. Die Seite bleibt weiß; Fjord bzw. Ostsee prägen Typografie, Akzente und redaktionelle Flächen.

# Northern Lines Studio

> **Build 026 · Destination Interest Pages Foundation:** Eine Destination kann jetzt mehrere thematische Vertiefungen erhalten. Studio fragt in Travel Language „Was möchtest du in [Ort] erleben?“ und bietet bewusst nur **Fotografie · Wandern & Natur · Kultur & Geschichte · Kulinarik & Lokal**. Die Zusatzseiten bleiben an den Ort gebunden, übernehmen automatisch die aktive Editorial World und werden direkt nach ihrer Destination in der Reisestruktur geführt.

> **Milestone Build 025C:** Fjord ↔ Ostsee hat bewiesen, dass Editorial Worlds echte Architektur sind: gleiche Semantik und Grammar, aber eigene Typografie, Companion und World Expression auf einer weißen Seitenfläche.

> **Build 025C · Warm Expression Polish:** Die A5-Seite bleibt jetzt auch technisch echtes Weiß. Ostsee zeigt Hanse, Backstein, Bernstein und Sand gezielt über Extension-/Expression-Flächen, Signets und Akzente – ohne Seitenhintergrund, Rahmen oder zusätzliche Dekoration.

> **Build 025C · Ostsee Expression & Companion Fix:** Der Editorial-World-PoC bleibt semantisch und grammatisch unverändert, erhält aber die fehlende visuelle Konsequenz: Der Fischotter wird aus dem öffentlichen Design-Library-Pfad geladen und die Ostsee-Expression nutzt Baltic, Steel, Fog, Sand und Amber deutlich erkennbarer. Keine neue Layoutvariante, kein Theme-Editor, keine Inhaltsduplikation.

> **Build 025B · Ostsee Editorial World PoC:** Northern Lines Studio besitzt erstmals zwei freigegebene Editorial Worlds. Fjord und Ostsee teilen dieselbe adaptive Layout Grammar und dieselben semantischen Signets; Typografie, Palette, Extension Expression und Companion wechseln world-spezifisch. Der Wechsel ist persistent und verändert keine Reiseinhalte. Build 024 wird damit zugleich als Milestone Build dokumentiert.

**Aktueller Stand:** Build 031 – Travel Companion Foundation: Licht

> **Build 025A – Bude ausgekehrt:** Der freigegebene Build-024-Stand bleibt visuell und semantisch unverändert. Das gewachsene CSS wurde nach Verantwortlichkeiten modularisiert und bekannte historische Overrides wurden in autoritative Grammar-Regeln konsolidiert. Diese Phase schafft die saubere technische Basis für Build 025B – Ostsee Editorial World PoC.

> **Build 024 Adaptive Grammar Polish:** Die Seitenwirkung bleibt stabil, aber Title- und Extension-Komposition reagieren nun innerhalb kuratierter Grammar-Zustände auf reale Textlängen. Lange Ortsnamen werden nicht mitten im Wort getrennt; Weite kann intern 50/50, 60/40, 70/30 oder gestapelt komponieren. Editorial Extension Zones reagieren analog ausgeglichen, asymmetrisch oder gestapelt.

**Studio:** 0.32.0-alpha.1
**Projektformat:** `.nls` 0.16.0

Northern Lines Studio ist eine spezialisierte Desktop-Anwendung für Travel Publishing.
Es ist kein allgemeines DTP-Programm. Studio begleitet eine Reise redaktionell und
visuell – von der ersten Idee über Reiseplanung, Orte, Route und Geschichten bis zum
späteren Publishing mit Northern Lines Publisher.

> **Der Reisende öffnet kein Projekt. Er öffnet seine Reise.**

## Produktidee

Northern Lines Studio spricht in **Travel Language**. Technische Mechanismen bleiben
im Hintergrund:

- **Neue Reise beginnen** statt Projekt anlegen
- **Reiseplanung** statt Journey-Metadaten
- **Ort hinzufügen** statt Destination Page erzeugen
- **Was möchtest du in [Ort] erleben?** statt Archetyp oder Unterseite konfigurieren
- **Deine Route** statt Manifest-Reihenfolge
- **Deine Geschichte** statt Textblock-Editor
- `.nls` im Finder doppelklicken statt Projektordner auswählen

## Verbindliche Referenzen

Northern Lines Studio wird durch vier dauerhafte Referenzen geführt:

- `README.md` – aktueller Produkt- und Build-Stand
- `docs/VISION.md` – langfristiges Zielbild
- `docs/ARCHITECTURE.md` – technische Verantwortungsgrenzen
- `docs/PRODUCT-DNA.md` – verbindliche Produkt-, UX-, Travel-Language- und Layoutprinzipien
- `docs/editorial-worlds/EDITORIAL-WORLD-CONTRACT.md` – verbindlicher Vertrag für alle Editorial Worlds
- `docs/editorial-worlds/FJORD.md` / `OSTSEE.md` – World Expressions

Die **Produkt-DNA** ist ab Build 021 keine Retrospektive am Rand, sondern eine dauerhafte Referenz. Neue Builds müssen ihre UX- und Produktentscheidungen dagegen prüfen.

## Architektur

- **Frontend:** Svelte + TypeScript
- **Desktop Shell:** Tauri 2
- **Backend:** Rust
- **Projektformat:** offenes `.nls`-Package
- **Publishing:** Northern Lines Publisher bleibt eigenständige Publishing Engine

Studio verwaltet visuelle und redaktionelle Entscheidungen. Publisher bleibt zuständig
für Schemas, Validierung, Layout Grammar, Content Fit, Render Jobs, Assets und Preflight.

## Aktueller Journey Lifecycle

1. Reise beginnen
2. Reisewelt wählen
3. Reisebegleiter kennenlernen
4. Reiseplanung ausfüllen
5. Orte hinzufügen
6. Route formen
7. Geschichten bearbeiten
8. Änderungen sichern
9. Travelbook-Preview prüfen
10. `.nls` direkt aus dem Finder wieder öffnen

## Journey Planning Foundation

Build 019 machte die Reiseplanung erstmals zu strukturierten Reisedaten.

Der Reisende kann festhalten:

- **Startdatum**
- **Enddatum**
- automatisch abgeleitete **Dauer**
- **Startpunkt**
- **Rückkehr / Ziel**
- **Transport**
- **Route im Überblick**
- **Fokus der Reise**

Studio speichert diese Informationen im Journey-Modell und macht sie unmittelbar auf
der Reiseplanungsseite sichtbar.

> **Der Reisende beschreibt den Rahmen seiner Reise. Studio macht ihn sichtbar.**

Die Dauer ist eine abgeleitete Größe und wird nicht redundant im `.nls` gespeichert.


## Ortsprofil & Seitenwirkung

Build 020 macht den Ort selbst zu einem strukturierten redaktionellen Objekt. Im normalen Studio-Workflow spricht die Oberfläche dabei bewusst **Travel Language**: Der Reisende arbeitet am **Ortsprofil** und wählt die **Seitenwirkung**, während technische Destination-Strukturen im Hintergrund bleiben.

Ein Ortsprofil kann unter anderem enthalten:

- Reiseziel und persönliche Unterzeile
- **Der Ort in Kürze**
- **Was möchtest du erleben?**
- **Reise vor Ort** mit Ankunft, Abfahrt und Zeitzone
- nachgelagerte **Orte & Motive**
- nachgelagerte Hinweise **Für unterwegs**
- eine von drei kuratierten Seitenwirkungen

Die Route referenziert intern weiterhin stabile `destinationId`-Werte. Ein Wechsel der Seitenwirkung ändert keine Inhalte, sondern ausschließlich die semantische Layoutentscheidung.

> **Der Inhalt gehört zum Ort. Das Layout gehört zur Erzählweise.**

### Seitenwirkung

- **Weite** – der Ort öffnet sich über ein ruhiges, flaches Panorama
- **Bild links** – das Bild führt in den Ort
- **Bild rechts** – die Geschichte führt, das Bild begleitet

Es gibt keine freie Positionierung, keine Koordinaten und keinen Layoutdesigner. Footer, Seitenzahl und Reisebegleiter bleiben beim Wechsel stabil. Northern Lines Publisher bleibt die authoritative Publishing Engine; Studio zeigt eine schnelle, glaubwürdige redaktionelle Vorschau.

## Layout Resilience & Content Capacity

Build 021 macht die vorhandenen Ortsseiten belastbarer, ohne neue Produktfunktionen oder neue `.nls`-Felder einzuführen. Die A5-Komposition kennt jetzt geschützte redaktionelle Zonen:

- **15 mm technische Mindest-Bindungszone** links
- geschützte Titelhierarchie
- geschützter Raum für den Fjord-Reisebegleiter
- stabiler Northern-Lines-Footer und Seitenzahl
- 1-, 2- oder 3-spaltige Modulgruppen je nach Kontext

**Weite** bleibt breit, flach und ruhig, nutzt den oberen Seitenraum aber effizienter. Wenn ein Ort mehr Inhalt trägt, darf Studio intern `comfortable`, `tight` oder `overflow` erkennen. Diese Zustände verändern weder Inhalte noch Typografie und werden nicht als technische Sprache in die Reiseoberfläche getragen.

Für Ankunft und Abfahrt tippt der Reisende nur die Uhrzeit, zum Beispiel `08:00`; Studio zeigt daraus automatisch **08:00 Uhr**.

> **Der Begleiter ist unantastbar – und sein Raum ebenfalls.**


## Destination Imagery Foundation

Build 022 gibt Reisezielen erstmals echte Ortsbilder, ohne Studio in eine Bildverwaltung zu verwandeln. Die finalisierte Fjord-Grammar benötigt dafür nur zwei Bildrollen:

- **Weite** – breites Panorama; Richtwert etwa **3:1–4:1**, mindestens **2400 px** breit
- **Bild links / Bild rechts** – gemeinsames hochformatiges Leitbild, Richtwert **2:3 / 1500 × 2250 px**

Studio zeigt neben **Bild auswählen …** eine kleine Hilfe mit der empfohlenen Geometrie. Die Bildhöhe der Preview darf innerhalb der Layout Grammar aus dem vorbereiteten Seitenverhältnis folgen; es gibt weiterhin bewusst **keinen Crop-Editor, keinen Focal Point und keine freie Bildpositionierung**. Gewählte Bilder werden innerhalb des `.nls`-Packages unter `assets/destinations/` abgelegt; sichtbare Dateipfade oder Asset-IDs gehören nicht zur Reisenden-UX.

Für Fjord gilt auf Destination Pages verbindlich eine **weiße / neutral-weiße Grundfläche**. Echte Bilder werden direkt in diese Seite komponiert und nicht auf farbige Medienboxen montiert. Informationsmodule werden ebenfalls nicht automatisch zu Cards; sanft eingefärbte Flächen bleiben gezielte redaktionelle Akzente.

> **Die Fotografie bringt die Atmosphäre. Die Typografie gibt ihr Haltung. Die Editorial World setzt die Akzente.**

Die Binding Safe Area beträgt ab Build 022 **15 mm technische Mindestzone**. Der Papageientaucher bleibt davon unabhängig an seiner bewährten Editorial-World-Position: **Der Begleiter ist unantastbar – und sein Zuhause ebenfalls.**

## Editorial Extension Zones

Build 024 ergänzt Destination Pages um optionale semantische Erweiterungen: **Wissen, Fotospot, Tipp, Souvenir, Wichtig und Geschichte**. Sie erscheinen nur dort, wo ein Ort tatsächlich zusätzliche redaktionelle Bedeutung trägt.

Die visuelle Regel bleibt bewusst reduziert:

> **Das Signet sagt, was es ist. Die Farbe sagt, zu welcher Welt es gehört. Mehr muss die Box nicht erklären.**

Extension Zones sind rahmenlos. Ein gemeinsames semantisches Signet wird durch die aktive Editorial World eingefärbt; die Stärke der world-konformen Fläche übernimmt die Gewichtung. Es gibt keine frei wählbare Asset-Bibliothek und keinen Box-Designer.

> **Der Companion nimmt nicht am Layout teil. Das Layout nimmt Rücksicht auf den Companion.**

Extensions dürfen deshalb weder Hero/Title noch Companion/Footer kolonisieren. Sie werden ausschließlich in einer definierten Layout-Grammar-Zone komponiert.


## Thematische Vertiefungen einer Destination

Build 026 macht aus der Destination ein semantisches Zentrum mit optionalen Zusatzseiten. Die Haupt-Ortsseite bleibt allgemein und ruhig; Vertiefungen folgen dem Interesse der konkreten Reise.

Verbindlich vorbereitet sind genau vier Archetypen:

- **Fotografie**
- **Wandern & Natur**
- **Kultur & Geschichte** – inklusive Museen, Architektur und historischen/antiken Stätten
- **Kulinarik & Lokal**

Mehrere Interessen dürfen zu demselben Ort gehören. Studio spricht dabei nicht von Seitentypen oder Archetypen, sondern fragt beispielsweise:

> **Was möchtest du in Bergen erleben?**

Die neue Seite bleibt mit Bergen verbunden, erscheint direkt bei diesem Ort in **Deine Route** und übernimmt automatisch die aktive Editorial World. Build 026 schafft bewusst nur die Foundation für Struktur, Navigation, Persistenz und gemeinsame World-Sprache; fachspezifische Module folgen später.

> **Die Destination bleibt das Zentrum. Die Vertiefung folgt dem Interesse der Reise.**

## Reisewelten

Eine Reisewelt bringt eine visuelle und redaktionelle Haltung mit. Aktiv verfügbar sind **Fjord** und **Ostsee**. Beide teilen dieselbe semantische und adaptive Layout Grammar; Typografie, Palette, Extension Expression und Companion gehören zur jeweiligen World.

Fjord definiert unter anderem:

- ruhige nordische Farb- und Typografiesprache
- kontrollierte Destination-Layouts
- Northern-Lines-Travel-Language-Footer
- Companion-Regeln
- Page Grammars
- Journey-Planning-Grammar

### Layout Principle

> **Wenige starke Layouts. Viele persönliche Geschichten.**

Für Ortsseiten sind bewusst nur drei Varianten vorbereitet:

- **Weite** – ruhiges, flaches Panorama
- **Bild links** – Bild führt
- **Bild rechts** – Geschichte führt, Bild begleitet

Studio bleibt damit ein Travel-Publishing-System und wird nicht zum freien DTP-Baukasten.

## Travel Language Footer

Der wiederkehrende Fieldbook-Anker lautet:

**TRAVEL · PHOTOGRAPHY · Signet · MEMORIES**

Die Editorial World bestimmt seine visuelle Expression. Die Seitenzahl bleibt davon
getrennt und dient ausschließlich der Navigation.

## Companion Layout

Für Fjord gilt aktuell:

- kein Companion auf Cover, Willkommen und Inhaltsverzeichnis
- erster Auftritt mit **Reiseplanung**
- danach Begleitung auf Reise-, Orts-, Wissens-, Workflow-, Notiz- und Abschlussseiten
- Platz: **unten links**
- Pose: **Standard**
- Spiegelung: **aus**
- Größe: **klein**

> **Der Companion begleitet die Reise. Er eröffnet sie nicht.**

## `.nls`

`.nls` ist ein offenes Northern-Lines-Studio-Package. Seit Build 016 ist es unter macOS
als Reisedokument registriert und lässt sich direkt im Finder öffnen.

Build 028 verwendet **`.nls` 0.13.0**. Build 028 ergänzt den fachlichen Wandern-&-Natur-Archetyp; der Polish verändert das Format nicht. Build-027-Projekte im Format 0.12.0 werden beim Öffnen automatisch migriert. Bestehende Journey-, Destination-, Bild-, Extension- und Interest-Daten bleiben erhalten; Studio erfindet keine Routen oder Interessen. Ältere bereits unterstützte Formate werden weiterhin normalisiert.
Interne Destination-Profile werden aus vorhandenen Reisezielen und Seiten aufgebaut; fehlende
redaktionelle Inhalte werden dabei bewusst nicht erfunden.

## Entwicklung

```bash
pnpm install
pnpm tauri dev
```

## Validation Gates

Jeder Build muss mindestens diese Gates bestehen:

```bash
pnpm consistency
pnpm check
pnpm test
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
git diff --check
```

### Consistency Gate

Neue Journey- und Destination-Felder müssen durch die vollständige Datenkette geprüft werden:

```text
TypeScript Model
→ Rust Schema
→ .nls Migration
→ Tauri Command
→ Inspector
→ Preview
→ Layout Variants (für Destinations)
→ Layout Resilience / Content Capacity
→ Destination Imagery
→ Editorial Extension Zones
→ Tests
```

## macOS-App installieren

```bash
./scripts/install-macos-app.sh
```

Danach liegt die Anwendung unter:

```text
/Applications/Northern Lines Studio.app
```

## Entwicklungsprinzipien

> **Studio wächst mit echten Reisen.**

Neue Layouts, Komponenten und Workflows entstehen aus realen Anforderungen und
bewährten Northern-Lines-Fieldbooks – nicht aus dem Ziel, jede theoretische
Gestaltungsmöglichkeit abzubilden.

## Build-Meilensteine

- **010** Story Authoring Foundation
- **011** Travel Language und Preview-Integration
- **013** Journey Beginning + Companion First Encounter
- **014** Journey Places Foundation
- **015** Journey Route Foundation
- **016** Journey Opening Foundation – `.nls` als echtes macOS-Reisedokument
- **017** Editorial World Layout Foundation
- **018** Companion Layout Foundation + Reiseplanung
- **019** Journey Planning Foundation – strukturierte Reisedaten
- **020** Destination Profile & Layout Variants Foundation – Ortsprofil und Seitenwirkung
- **021** Layout Resilience & Content Capacity Foundation – geschützte A5-Zonen und belastbare Inhaltskomposition
- **022** Destination Imagery Foundation – semantische Bildrollen und `.nls`-Assets
- **023** Destination Composition Refinement – reife Weite/Bild-links/Bild-rechts-Grammatik
- **024** Editorial Extension Zones Foundation – selektive semantische Erweiterungen mit World Expression

---

**Northern Lines Studio**
*Deine Reise. Deine Geschichten. Dein Fieldbook.*

#
## Build 023 – Destination Composition Refinement

> **Final Polish Fix:** In `Weite` sind Panorama und Titelbereich jetzt strukturell getrennt; `REISEZIEL` erhält eine geschützte Ruhezone unter dem Bild. Im Inspector ist die Bildrollen-Angabe nun bewusst ruhiger Meta-Kontext statt Zwischenüberschrift. Persistenz und Bildmodell bleiben unverändert.


Build 023 macht die drei vorhandenen Destination-Seitenwirkungen gestalterisch belastbarer, ohne neue Varianten oder freie DTP-Geometrie einzuführen.

Der finale UX-/Composition-Fix schützt bei **Weite** den Abstand zwischen Panorama und Titelblock, entfernt die dekorative Kopflinie der Portraitvarianten, gibt **Bild rechts** etwas mehr Textluft und reduziert die Hero-Bildbedienung im Inspector auf ruhige kontextuelle Textaktionen (`+ Bild auswählen`, `Bild ersetzen · Entfernen`). Persistenz und Hero-Asset-Modell bleiben unverändert.

- **Weite** bleibt eine atmosphärische Panoramazone auf weißer/neutral-weißer Fjord-Grundfläche.
- **Bild links** wird als bildgeführte Komposition feinjustiert.
- **Bild rechts** wird als textgeführte Komposition neu ausbalanciert; das Bild beginnt bewusst etwas tiefer und begleitet die Geschichte.
- Inhaltsgruppen verwenden automatisch eine zulässige **1-/2-/3-spaltige** Komposition abhängig von Menge und Dichte des Inhalts.
- Sanft eingefärbte Flächen bleiben semantische Akzente und werden nicht zu einem Card-UI-System.
- 15-mm-Bindungszone, Companion, Footer und Seitenzahl bleiben Invarianten.

### Inspector-Ergonomie

Der rechte Inspector lässt sich nun an seiner linken Kante Richtung Canvas vergrößern. Die Arbeitsbreite liegt bei **320–440 px**; auf kleineren Fenstern schützt Studio automatisch ausreichend Canvas-Raum. Die gewählte Breite wird lokal als Workspace-Präferenz gespeichert und gehört ausdrücklich **nicht** zum `.nls`-Projekt.

> **Der Inspector darf wachsen, wenn der Inhalt es verlangt – aber nie so weit, dass das Travelbook seine Rolle als Hauptfläche verliert.**

## Build 022 Final – Open-Flow Regression geschlossen

Der interne Befehl **Reise öffnen …** verwendet wieder den `.nls`-Dokument-/Package-Pfad und damit dieselbe gemeinsame Ladepipeline wie der macOS/Finder-Open-Flow. Finder-Integration, `.nls`-Registrierung und die Destination-Image-Composition bleiben unverändert.

> Build 023 final grammar fix: `Weite` uses one consolidated four-row composition — Hero → protected title-safe zone → Story → Modules. Earlier margin/padding spacing patches are removed.

### Build 023 · Final Zone Separation Fix

The final Build-023 baseline makes protected page zones structural. In **Weite**, the image is contained inside a fixed grammar-owned Hero Zone and can no longer expand into the Title Zone. A separate protected row follows before `REISEZIEL`. This rule is now part of Product DNA and applies generally to images, typography and future Editorial World assets: elements stay inside the semantic zone that owns them unless Layout Grammar explicitly defines an exception.

### Build 023 final composition note
`Weite` now uses strict Hero/Title zone separation plus a compact, grammar-owned
Title-Zone composition: title and introduction sit side by side with one functional
vertical divider. Companion and Footer remain protected invariants.

## License and source availability

Northern Lines Studio is **source available, but not open source**.

The source code is publicly visible to make development transparent. The public repository may be viewed and forked using GitHub's functionality in accordance with the GitHub Terms of Service.

No general license is granted for independent redistribution, relicensing, incorporation into another product, or commercial exploitation.

Northern Lines brand and design materials remain separately reserved.

See [`LICENSE.md`](LICENSE.md) for the complete rights notice.

Copyright © 2026 Northern Lines. All rights reserved.

## Build 024 · Extension Capacity Protection Fix

Editorial Extension Zones may adapt, stack and change width, but protected zones remain hard boundaries. If no allowed composition can keep extensions clear of Companion and Footer, Studio stops the invalid preview composition and says: **„Diese Seite kann diesen Inhalt nicht mehr ruhig erzählen.“** The traveller may try another existing page effect; Studio never rescues the page by shrinking type, clipping copy or moving the Companion.

### Build 025C · White Page Expression Polish

Editorial Worlds färben die Seitenfläche nicht ein. Die A5-Seite bleibt neutral weiß; World Expression entsteht über Typografie, Akzente, Companion, Signets und gezielte Editorial-/Extension-Flächen.

## Build 027 – Photography & Place Experience

Build 027 macht aus der Fotografie-Vertiefung den ersten fachlich ausgebauten Destination-Interest-Archetyp. Die Seite kann Fotospots, Licht & Tageszeit, Motive, fotografische Hinweise, Brennweiten-/Praxisempfehlungen sowie einen optionalen Karten-/Ortsbezug tragen. Die Fotografie bleibt ortsbezogene Reisebegleitung – keine EXIF-, Kamera- oder Produktdatenbank. Die aktive Editorial World, Companion-/Footer-Safe-Zonen und die Travel Language gelten unverändert.

Das `.nls`-Format steigt auf **0.12.0**. Build-026-Projekte in 0.11.0 werden beim Öffnen migriert; bestehende Fotografie-Interest-Pages erhalten die neuen Story Components, ohne dass Studio Inhalte erfindet.

## Build 027 · Photography Layout Polish

Der Photography-Archetyp ordnet Brennweiten nun **direkt dem jeweiligen Fotospot** zu. Die Brennweiten bleiben als eigener semantischer Authoring-Baustein erhalten, werden in der Seitenkomposition aber positionsgleich mit der Fotospot-Liste gekoppelt. Eine separate Brennweiten-Sammelbox entfällt. Fehlt für einen Spot eine Zuordnung, zeigt Studio dezent „Brennweite offen“.

Die dünne Editorial-Linie bleibt erhalten, wird für Photography Interest Pages jedoch auf einen ruhigen Akzent reduziert; zugleich beginnt die Seitenkomposition höher. World Expression, Companion-/Footer-Safe-Zonen, Capacity Protection, Persistenz und `.nls` 0.12.0 bleiben unverändert.


## Build 028 – Hiking & Nature Experience

Build 028 macht **Wandern & Natur** zum zweiten fachlich ausgebauten Destination-Interest-Archetyp. Routen und Touren stehen im Mittelpunkt; Startpunkt, Dauer und Schwierigkeit bleiben in der Seitenkomposition direkt der jeweiligen Route zugeordnet. Aussichtspunkte/Naturziele, Streckenhinweise und ein optionaler Karten-/Ortsbezug ergänzen die Reisebegleitung. Studio bleibt bewusst kein GPX-Manager und kein Outdoor-Navigator.

Die aktive Editorial World, die weiße Grundseite, Companion-/Footer-Safe-Zonen und Capacity Protection gelten unverändert. Das `.nls`-Format steigt auf **0.13.0**. Projekte aus Build 027 / 0.12.0 werden beim Öffnen migriert; bestehende Wandern-&-Natur-Seiten erhalten die neuen Story Components, ohne dass Studio Inhalte erfindet.
### Build 028 · Inspector UX Language Fix

Interest-Einträge folgen nun auch im Inspector der Northern-Lines-UX-Language: Einträge und „+ … hinzufügen“-Aktionen bleiben präsent, aber ruhig; Entfernen ist klar sekundär. Die Begleiter-Statuswerte Platz/Pose/Spiegelung sind auf Labelgröße reduziert, sauber ausgerichtet und nur über Fettschrift hervorgehoben. Keine Änderung am `.nls`-Format.



## Build 029 – Culture & History Experience
Build 029 expands the third Interest Page archetype using the shared structured-entry UX. Culture & History now supports repeatable **Orte / Stationen** with type, editorial meaning, visit guidance, optional time reference and optional place/map reference. Studio chooses the composition automatically and keeps World Expression, Interest-only adaptive density, Companion/Footer safe zones and capacity protection intact. The `.nls` format remains **0.14.0** because the structured entry model already stores extensible semantic fields. Build 029 also changes the entry-editor action from `Abbrechen` to the Travel-Language action `Zurück` and adds a Native UI Consistency gate.

## Build 030 – Culinary & Local Experience
Build 030 completes the fourth approved Destination Interest archetype. **Kulinarik & Lokal** uses the shared structured-entry UX: travellers add repeatable recommendations, describe category, editorial reason, what to try/discover, practical guidance, optional time/price context and optional place/map reference. Studio chooses the composition automatically and preserves World Expression, Interest-only adaptive density, Companion/Footer safe zones and capacity protection. The `.nls` format remains **0.14.0** because the generic structured entry field map already supports these semantic fields without migration.


### Build 030 Polish – Culinary Density & Safe-Zone Correction
The Culinary & Local Interest Page now follows the same bounded capacity grammar as the other Interest archetypes: exactly two fixed typography states (`comfortable` and `tight`), adaptive one-/two-box composition before density reduction, and `overflow` instead of arbitrary type scaling or Companion/Footer intrusion. Textual place references do not reserve map geometry until an actual map is rendered.

### Build 030 – Global Content Fit & Composition Contract
Studio entscheidet Layoutvarianten jetzt nach Content Fit: alle für einen Seitentyp erlaubten Kompositionen werden geprüft, bevor verdichtet oder `overflow` gemeldet wird. Semantisch unterschiedliche Inhalte werden nicht in generische Sammelboxen gepresst. Die globale Regel lautet: **Content Fit entscheidet über die Komposition. Nicht sammeln, sondern erzählen.**

### Build 030 geometric content-fit correction
Capacity Protection no longer treats raw character count as a reason to reject an otherwise valid Interest Page composition. The Geiranger two-route case with the complete Skageflå safety note remains renderable; overflow is reserved for content that no allowed composition can fit inside the protected page geometry.

## Build 032 — Travel Companion Wetter

`Wetter` ist der zweite Seitentyp auf dem freigegebenen Travel Companion Master. Der kuratierte Kern bleibt wiederverwendbar; konkrete Reisehinweise werden optional im Projekt gespeichert. Die Recherchebasis liegt unter `docs/research/BUILD-032-WEATHER-RESEARCH.md`.
