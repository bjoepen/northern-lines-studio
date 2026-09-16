# British Isles Editorial World Contract

Status: Build 049A · CONTRACT APPROVED

World ID: `britain`

Editorial name: **British Isles**

Leitidee: **Moor & Stein**

Tagline: **WEATHERED ELEGANCE. TIMELESS PLACES.**

## World Statement

British Isles verbindet wilde Küsten, sanfte Hügel, Heide und Moor, alte Steine, Dörfer, Häfen, Geschichte und wechselndes Licht zu einer ruhigen, wettergeprägten und traditionsbewussten Editorial World.

Die World ist ausdrücklich nicht „Royal Britain“, Pub-Kitsch, Highlands-Themenpark oder eine Sammlung touristischer Klischees. Sie soll England, Schottland, Wales, Irland und die Inselräume tragen können, ohne eine einzelne Region zur visuellen Norm zu erklären.

## Charakter

- natürlich
- authentisch
- ruhig
- wettergeprägt
- traditionsbewusst
- einladend
- zeitlos

## Typography

British Isles ist der erste Acceptance-Proof des in Build 049A geschärften Editorial Typography Contract.

Die World muss auch ohne Companion und ohne Curated Hero als **British Isles · Moor & Stein** erkennbar bleiben.

### Heading

Eine charakteristische, literarisch-editoriale Serifensprache führt Titel, Seitentypen und redaktionelle Hierarchie. Sie soll zeitlos und britisch-editorial wirken, ohne historisierend oder dekorativ zu werden.

### Body

Der Fließtext bleibt ruhig, hervorragend lesbar und buchartig. Seine Schrift darf mit der Heading-Familie verwandt oder bewusst ergänzt sein, muss aber lange A5-Lesestrecken tragen können.

### Accent

Eine zurückhaltende Script-/Handwriting-Rolle ist für kurze Zitate, Notizen und einzelne redaktionelle Akzente zulässig. Sie ist niemals Body Font, ersetzt keine semantische Überschrift und darf Capacity Protection nicht gefährden.

Die konkrete Font-Auswahl ist Teil der World-Expression-Implementierung und muss vor Freigabe auf macOS-Verfügbarkeit, Packaging/Fallback, Lesbarkeit und A5-Kapazität geprüft werden. Das Moodboard definiert die typografische Richtung, nicht bereits einen technischen Fontnamen.

## Color Language

Die Art Direction verwendet folgende Rollen:

- **Heather Green** — Natur und Landschaft; tragende World-Farbe
- **Heather Purple** — Atmosphäre und Heide; zurückhaltender Akzent
- **Slate** — Struktur und Typografie
- **Stone** — ruhige Flächen und Neutralität
- **Heather Gold** — kleine Details und Highlights
- **White** — literal weiße/neutral-weiße A5-Seitenfläche

Endgültige technische Farbwerte werden in der Expression-Phase kalibriert und nicht aus dem Moodboard-Pixelbild abgeleitet.

## Graphic Language

British Isles verwendet die Shared Graphic Language von Northern Lines Studio. Signets behalten ihre Semantik. Boxen bestehen weiterhin aus Signet plus world-konformer Fläche ohne dekorative Rahmen oder Sonderformen.

Texturen wie verwitterter Stein, gewebter Stoff, gestrichenes Holz und Moos sind Art-Direction-Referenzen. Sie begründen keine frei wachsende Textur- oder Asset-Bibliothek und keine vollflächig dekorierten A5-Seiten.

## Motif Language

- Küsten
- Dörfer und Architektur
- Landschaften
- Geschichte und Kultur
- Häfen und gelebte Orte

Die Motive sollen beobachtet und bewohnt wirken, nicht wie Tourismuswerbung.

## Companion

Companion ID: `britain-red-grouse`

Name: **Moorhuhn**

Charakter: neugierig, standfest, heimisch, ruhig präsent.

Die vorhandene Design-Library-Metadatei führt die genaue Artenbezeichnung noch als redaktionellen Validierungspunkt. Vor Production-Aktivierung wird diese Bezeichnung bestätigt. Companion Placement und geschützte Companion-Zone bleiben Teil des shared Companion Layout Contract.

## Shared Layout Grammar

British Isles verwendet unverändert die vorhandene adaptive Layout Grammar:

- `destination-hero-banner` · Weite
- `destination-hero-left` · Bild links
- `destination-hero-right` · Bild rechts
- bestehende 60/40- und 70/30-Kompositionen

World Expression darf Rhythmus und visuelle Gewichtung prägen, aber keine neue Page Language erzeugen.

## Curated Assets

Build 049 führt keine neue Asset Grammar ein. British Isles Curated Assets werden in einem nachgelagerten Build als endliches World-owned Set über die bestehende World Asset Registry eingebunden.

Das globale `travel-preparation`-Asset bleibt world-neutral.

## Non-goals

British Isles führt nicht ein:

- keine neuen Page Types;
- keine neue Destination Grammar;
- keinen World-spezifischen Renderer;
- keine `App.svelte`-Sonderpfade;
- keine neue Capacity-Semantik;
- keine Änderung der Golden-Build-040-Geometrie;
- keine `.nls`-Schemaänderung allein für die World;
- keine frei editierbaren Fonts oder Designoptionen;
- keinen Asset Picker für World-owned imagery.

## Acceptance Criteria

British Isles gilt erst dann als World-Expression-PASS, wenn:

1. die World über generische World-, Layout-, Companion- und native Persistence-Contracts registriert ist;
2. Heading, Body und optional Accent als kuratierte typografische Rollen erkennbar sind;
3. eine Testseite ohne Companion und Curated Hero weiterhin eindeutig als British Isles wahrnehmbar ist;
4. Typography keine Title/Hero-, Companion-, Footer- oder Capacity-Invariante verletzt;
5. World Switch keine Reiseinhalte, IDs, Bildrollen oder Seitenwirkungen verändert;
6. kein `britain`-spezifischer Rendererpfad existiert;
7. die A5-Seitenfläche literal weiß/neutral-weiß bleibt;
8. lokaler Real-World-Test und Packaging in der installierten macOS-App PASS sind.

## Contract Statement

> **British Isles · Moor & Stein is a typographically distinct Editorial World built on the shared Northern Lines page language. Its identity comes from typography, graphic expression, atmosphere, Companion and curated imagery — never from a new renderer or a new grammar.**
