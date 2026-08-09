# Northern Lines Studio

**Aktueller Stand:** Build 018 – Companion Layout Foundation  
**Studio:** 0.18.0  
**Projektformat:** `.nls` 0.6.0

Northern Lines Studio ist eine spezialisierte macOS-Anwendung für Travel Publishing.
Es ist kein allgemeines DTP-Programm. Studio begleitet eine Reise redaktionell und
visuell – von der ersten Idee über Orte, Route und Geschichten bis zum späteren
Publishing mit Northern Lines Publisher.

> **Der Reisende öffnet kein Projekt. Er öffnet seine Reise.**

## Produktidee

Northern Lines Studio spricht in **Travel Language**. Technische Strukturen bleiben
im Hintergrund:

- **Neue Reise beginnen** statt Projekt anlegen
- **Ort hinzufügen** statt Destination Page erzeugen
- **Deine Route** statt Manifest-Reihenfolge
- **Deine Geschichte** statt Textblock-Editor
- `.nls` im Finder doppelklicken statt Projektordner auswählen

## Architektur

- **Frontend:** Svelte + TypeScript
- **Desktop Shell:** Tauri 2
- **Backend:** Rust
- **Projektformat:** offenes `.nls`-Package
- **Publishing:** Northern Lines Publisher bleibt eine eigenständige Engine

Studio verwaltet redaktionelle Entscheidungen. Publisher bleibt zuständig für
Schemas, Validierung, Layout Grammar, Content Fit, Render Jobs, Assets und Preflight.

## Aktueller Journey Lifecycle

1. Reise beginnen
2. Editorial World wählen
3. Companion kennenlernen
4. Reiseplanung
5. Orte hinzufügen
6. Route formen
7. Story Components bearbeiten
8. Änderungen sichern
9. Travelbook-Preview prüfen
10. `.nls` direkt aus dem Finder wieder öffnen

## Editorial Worlds

Eine Editorial World bringt eine visuelle und redaktionelle Haltung mit. Die aktuelle
Reference World ist **Fjord**.

Fjord definiert unter anderem:

- ruhige nordische Farb- und Typografiesprache
- kontrollierte Destination-Layouts
- Northern-Lines-Travel-Language-Footer
- Companion-Regeln
- Page Grammars

### Layout Principle

> **Wenige starke Layouts. Viele persönliche Geschichten.**

Für Ortsseiten sind bewusst nur drei Varianten vorbereitet:

- **Weite** – Hero als Banner
- **Bild links**
- **Bild rechts**

Build 018 macht daraus noch keinen DTP-Baukasten.

## Travel Language Footer

Der wiederkehrende Fieldbook-Anker lautet:

**TRAVEL · PHOTOGRAPHY · Signet · MEMORIES**

Die Editorial World bestimmt seine visuelle Expression. Die Seitenzahl bleibt davon
getrennt und dient ausschließlich der Navigation.

## Companion Layout Foundation

Build 018 bringt den Editorial Companion erstmals in die eigentliche Travelbook-Preview.

Für Fjord gilt zunächst bewusst eine feste Regel:

- kein Companion auf Cover, Willkommen und Inhaltsverzeichnis
- erster Auftritt mit **Reiseplanung**
- danach Begleitung auf Reise-, Orts-, Wissens-, Workflow-, Notiz- und Abschlussseiten
- Platz: **unten links**
- Pose: **Standard**
- Spiegelung: **aus**
- Größe: **klein**

Freie Platzierung, Spiegelung und mehrere Posen bleiben bewusst zukünftige redaktionelle
Entscheidungen.

> **Der Companion begleitet die Reise. Er eröffnet sie nicht.**

## `.nls`

`.nls` ist ein offenes Northern-Lines-Studio-Package. Seit Build 016 ist es unter macOS
als Reisedokument registriert. Ein Doppelklick im Finder startet Northern Lines Studio
oder übergibt die Reise an die bereits laufende App.

Build 018 aktualisiert das Format auf **0.6.0**, weil `Reiseplanung` als eigener
semantischer Seitentyp eingeführt wird. Projekte im bisherigen Format 0.5.0 werden beim
Öffnen automatisch ergänzt.

## Entwicklung

```bash
pnpm install
pnpm tauri dev
```

## Validation Gates

Jeder Build muss mindestens diese Gates bestehen:

```bash
pnpm check
pnpm test
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
git diff --check
```

Für macOS-/Finder-Funktionen kommt die Installed-App-Validation hinzu.

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

---

**Northern Lines Studio**  
*Deine Reise. Deine Geschichten. Dein Fieldbook.*
