# Background Proof PoC 001 – Implementation Contract

## 1. Oberste Regel

Der bestehende akzeptierte PDF-Proof-Renderer bleibt unverändert.

Der PoC darf keine alternative Interpretation einer Studio-Seite erzeugen.

Es gilt:

Studio resolved page
→ existing proof preparation
→ existing Tauri PDF command
→ existing WKWebView PDF generation
→ existing exact-A5 normalization
→ existing validation

## 2. Zulässige Änderung

Der PoC darf ausschließlich einen zusätzlichen temporären Render-Host bereitstellen.

Konzeptionell:

VISIBLE STUDIO WEBVIEW
        │
        │ gespeicherter projectPath
        ▼
HIDDEN STUDIO WEBVIEW
        │
        ├─ bestehendes .nls laden
        ├─ definierte Seite auswählen
        ├─ bestehende Readiness verwenden
        ├─ bestehenden Proof Mode verwenden
        └─ bestehenden PDF-Proof-Command aufrufen

Das Hidden WebView muss dieselbe Studio-Frontend-Implementierung verwenden.

## 3. Main-Window-Invariante

Während eines Background-Proofs darf die aktive Seite des sichtbaren Studio-Fensters nicht verändert werden.

Insbesondere darf der PoC nicht:

- `selectPageNow()` im Main Window für den Proof verwenden;
- die sichtbare Seite temporär wechseln;
- den Main-DOM in `pdf-proof-rendering` versetzen;
- Preview-Zustand des Main Windows für den Proof manipulieren.

Die ausgewählte Main-Seite muss vor, während und nach dem PoC identisch sein.

## 4. Hidden Host

Der Hidden Host darf dynamisch erzeugt werden.

Er soll:

- nicht sichtbar sein;
- dieselbe Studio-App laden;
- einen eindeutig erkennbaren internen Background-Proof-Modus besitzen;
- nach Abschluss des PoC wieder geschlossen bzw. zerstört werden.

Falls die verwendete Tauri-Version dies unterstützt und es für zuverlässige Ausführung erforderlich ist, soll Background Throttling für diesen Host deaktiviert werden.

Keine weitere Window-Architektur ist Bestandteil dieses PoC.

## 5. Background-Proof-Modus

Die Studio-App darf für den Hidden Host einen eng begrenzten internen Betriebsmodus erhalten.

Dieser Modus dient ausschließlich dazu:

- ein vorhandenes Projekt zu laden;
- eine vorhandene Seite auszuwählen;
- Readiness herzustellen;
- Proof Mode zu aktivieren;
- den bestehenden PDF-Proof aufzurufen.

Editor-spezifische Lifecycle-Funktionen, die im Hidden Host unerwünscht sind, dürfen dort deaktiviert werden.

Dazu gehören insbesondere globale externe File-Open-Reaktionen wie:

- `open-nls`
- `take_pending_open_path`

Der normale Editorbetrieb darf dadurch nicht verändert werden.

## 6. Projektzustand

PoC 001 verwendet ausschließlich einen gespeicherten Projektzustand.
Der bestehende Projektloader ist zu verwenden.

Es wird kein neuer:

- Snapshot-Serializer,
- Export-State-Container,
- Asset-Staging-Contract,
- `.nls`-Exportvertrag

eingeführt.

Ungespeicherte Bearbeitungen sind nicht Bestandteil dieses PoC.

## 7. Rendering

Für die PDF-Erzeugung müssen die bestehenden Mechanismen wiederverwendet werden.

Nicht duplizieren:

- Seitenkomposition
- World Expression
- Layout Grammar
- Proof CSS
- Readiness-Logik
- native WKWebView-PDF-Erzeugung
- A5-Normalisierung
- PDF-Validierung

Wenn eine bestehende Funktion nicht ohne umfangreiche Architekturänderung wiederverwendbar ist, muss der PoC stoppen und dies dokumentieren.

Keine Ersatzimplementierung bauen.

## 8. Proof-CSS

Der bestehende `pdf-proof-rendering`-Zustand bleibt die maßgebliche Capture-Darstellung.
Er darf auf den Hidden Host angewendet werden.

Der Main-DOM darf diesen Zustand während des Background-Proofs nicht erhalten.

## 9. Fehlerverhalten

Bestehende stabile PDF-Proof-Fehlercodes sind nach Möglichkeit unverändert weiterzuverwenden.
Der PoC darf keine Fehler durch Fallback-Rendering verstecken.

Kann der Hidden Host eine Seite nicht korrekt rendern, ist dies ein PoC-Fehler.

## 10. Produktionsgrenze

Keine bestehende Produktionsfunktion darf durch den PoC ersetzt werden.

Der aktuelle:

- Single Page Proof
- Document Proof
- Standard Travelbook PDF
- PDF/A-2b Export

bleibt der maßgebliche Produktionspfad.

Der PoC muss isoliert aufrufbar sein.
