# Studio PDF Proof PoC 001

Basis: **Golden Build 040**

## Zweck

Der PoC erzeugt ausschließlich einen visuellen PDF-Proof der aktuell in Studio
aufgelösten Seite. Studio bleibt die einzige Layoutautorität.

## Architektur

`current .a5-page → @media print → window.print() → System-Druckdialog`

Nicht Bestandteil dieses PoC:

- Produktions-PDF oder Prepress
- Publisher-Integration
- Tauri-Rust-Druckcode
- zweiter WebView / iframe
- Playwright, Chromium oder Puppeteer
- PDF.js / pdf-lib
- Layout-Rekonstruktion
- Skalierung des Studio-Inhalts

Die Proof-Seitengröße verwendet die Build-040-Geometrie
`420 × 595.9459459459` Studio/CSS Units. Der PoC bewertet visuelle Identität,
nicht die endgültige physische A5-Serialisierung einer Produktions-PDF.


## Rust-Test aus dem Repo-Root

Im Repo-Root existiert kein Cargo-Workspace-Manifest. Ein nacktes `cargo test`
aus dem Root würde deshalb kein Manifest finden. Der plattformneutrale Root-Aufruf ist:

```bash
cargo test --manifest-path src-tauri/Cargo.toml
```

PoC 001 liefert dafür zusätzlich:

```bash
./scripts/test-rust.sh
```

Beide Varianten testen dasselbe Tauri-Crate, ohne vorher `cd src-tauri` auszuführen.


## PoC 001A · Color Fidelity + A5 Systemdialog Evidence

The first real-world PDF proved two limits of the system-print path:

1. macOS/WebKit placed the Studio proof on the system-selected A4 sheet.
2. quiet/accent text colors were visibly lighter than the Studio preview.

PoC 001A addresses only color preservation in code:

```css
-webkit-print-color-adjust: exact;
print-color-adjust: exact;
```

The physical paper size remains deliberately owned by the system print dialog in this PoC. No native page-size override, second renderer or PDF post-processing is introduced.

### Required evidence run

In the macOS print dialog select:

```text
Paper Size: A5
Scale:      100 %
Fit/Scale to paper: disabled
```

Then save as PDF and compare against the same Studio Golden page.
