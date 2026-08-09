# Northern Lines Studio

**Aktueller Stand:** Build 019 – Journey Planning Foundation  
**Studio:** 0.19.0  
**Projektformat:** `.nls` 0.7.0

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
- **Deine Route** statt Manifest-Reihenfolge
- **Deine Geschichte** statt Textblock-Editor
- `.nls` im Finder doppelklicken statt Projektordner auswählen

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
2. Editorial World wählen
3. Companion kennenlernen
4. Reiseplanung ausfüllen
5. Orte hinzufügen
6. Route formen
7. Story Components bearbeiten
8. Änderungen sichern
9. Travelbook-Preview prüfen
10. `.nls` direkt aus dem Finder wieder öffnen

## Journey Planning Foundation

Build 019 macht die Reiseplanung erstmals zu strukturierten Reisedaten.

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

## Editorial Worlds

Eine Editorial World bringt eine visuelle und redaktionelle Haltung mit. Die aktuelle
Reference World ist **Fjord**.

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

- **Weite** – Hero als Banner
- **Bild links**
- **Bild rechts**

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

Build 019 aktualisiert das Format auf **0.7.0**. Projekte im bisherigen Format 0.6.0
werden beim Öffnen automatisch migriert. Die neuen Planungsfelder sind optional, damit
bestehende Reisen ihren bisherigen Inhalt unverändert behalten.

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

Neue Journey-Felder müssen durch die vollständige Datenkette geprüft werden:

```text
TypeScript Model
→ Rust Schema
→ .nls Migration
→ Tauri Command
→ Inspector
→ Preview
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

---

**Northern Lines Studio**  
*Deine Reise. Deine Geschichten. Dein Fieldbook.*
