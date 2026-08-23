# Northern Lines Studio
# Background Document Proof – PoC 001

Status: EXPERIMENTAL
Scope: Machbarkeitsnachweis
Target: macOS
Authority: bestehender Golden-Build-040-PDF-Pfad

## 1. Ziel

Dieser PoC beantwortet ausschließlich folgende Frage:

> Kann Northern Lines Studio eine bereits von Studio vollständig aufgelöste
> Seite in einer separaten, nicht sichtbaren WebView-Instanz mit dem bestehenden
> und akzeptierten PDF-Proof-Pfad rendern, ohne die aktuell sichtbare Seite des
> Hauptfensters zu verändern?

Der PoC implementiert keinen neuen PDF-Renderer.
Er untersucht ausschließlich einen alternativen Host für den bereits akzeptierten Renderer.

## 2. Ausgangslage

Der aktuelle Document-Proof-Pfad verwendet das sichtbare Studio-WebView als Render-Host.
Für jede zu exportierende Seite wird derzeit die aktive Seite im Hauptfenster gewechselt.
Dadurch entsteht während eines vollständigen Travelbook-Exports ein sichtbarer Seitenwechsel.

Die Repo-Analyse hat ergeben:

- `create_studio_pdf_proof()` rendert das `WebviewWindow`, aus dem der Tauri-Command aufgerufen wird.
- Die bestehende Proof-CSS arbeitet lokal innerhalb des jeweiligen DOM.
- Die bestehende Readiness-Prüfung arbeitet gegen die aktive Seite des jeweiligen WebViews.
- gespeicherte `.nls`-Projekte können bereits über den bestehenden Projektloader geladen werden.
- der vollständige Export wird bereits blockiert, wenn ungespeicherte Änderungen vorhanden sind.

Daraus ergibt sich die zu prüfende Hypothese:

> Eine zweite versteckte Studio-WebView kann als Background Proof Host dienen,
> ohne einen zweiten Renderer oder ein zweites Layoutsystem einzuführen.

## 3. PoC-Hypothese

Der PoC gilt als technisch grundsätzlich erfolgreich, wenn:

1. ein separates verstecktes Studio-WebView erzeugt werden kann;
2. dieses dasselbe gespeicherte `.nls` laden kann;
3. darin eine definierte Studio-Seite ausgewählt werden kann;
4. die bestehende Readiness-Logik erfolgreich arbeitet;
5. der bestehende Proof Mode aktiviert werden kann;
6. `create_studio_pdf_proof()` aus diesem WebView erfolgreich ein PDF erzeugt;
7. das resultierende PDF dem bestehenden A5-Proof-Vertrag entspricht;
8. das sichtbare Hauptfenster währenddessen seine ausgewählte Seite nicht verändert.

## 4. Referenzseiten

Der PoC umfasst maximal drei vorhandene Referenzseiten:

1. Destination
2. Photography Workshop
3. Notes / Memory

Es werden ausschließlich bereits vorhandene Seiten eines gespeicherten Referenzprojekts verwendet.
Es werden keine neuen Seitentypen oder Layouts für den PoC erstellt.

## 5. Nicht Bestandteil des PoC

Explizit ausgeschlossen sind:

- Umbau des bestehenden Standard-PDF-Exports
- Umbau des bestehenden Document-Proof-Pfads
- Umbau des PDF/A-2b-Pfads
- Änderung von Golden Build 040
- Änderung der Studio Layout Grammar
- Änderung der `.nls`-Struktur
- neuer Snapshot-Contract
- Publisher-Integration
- neuer PDF-Renderer
- Chromium
- Playwright
- Puppeteer
- zweite Layout-Engine
- Rasterisierung
- Änderung der A5-Normalisierung
- Änderung der PDF-Assembly
- vollständiger 16-Seiten-Export
- Windows-Portierung
- Linux-Portierung
- paralleles Bearbeiten während eines Exports
- Produktionsfreigabe des Background Proof

Der PoC darf diese Themen weder implementieren noch vorbereitend refaktorieren.

## 6. Ergebnis

Der PoC endet mit genau einer Bewertung:

PASS

oder

FAIL

oder

INCONCLUSIVE

Ein erfolgreicher PoC ist keine automatische Architekturfreigabe.
Er liefert ausschließlich Evidenz für eine spätere Architekturentscheidung.
