# APPLY-DROPIN · Build 025C Ostsee Warm Expression Polish Fix

Ausgangsbasis: **Build 025C Ostsee White Page Polish Fix**

## 1. Branch

```bash
cd ~/Projekte/northern-lines-studio
git status
git switch -c build/025c-warm-expression-polish
```

## 2. Dry Run

```bash
rsync -avn ~/Downloads/Northern-Lines-Studio-Build-025C-Ostsee-Warm-Expression-Polish-Fix-DropIn/ ./
```

Prüfen: Es werden nur die dokumentierten Build-/Expression-Dateien ergänzt bzw. ersetzt. Keine `.nls`-Migration, keine Löschungen.

## 3. Apply

```bash
rsync -av ~/Downloads/Northern-Lines-Studio-Build-025C-Ostsee-Warm-Expression-Polish-Fix-DropIn/ ./
```

`APPLY-DROPIN.md` kann anschließend im Repo verbleiben oder außerhalb archiviert werden.

## 4. Consistency Gate

```bash
pnpm consistency
```

Erwartung: alle Gates **PASS**, insbesondere:

```text
Editorial World PoC Consistency Gate: PASS
Editorial World Expression Consistency Gate: PASS
CSS & Grammar Consolidation Consistency Gate: PASS
```

## 5. Vollständige Gates

```bash
pnpm check
pnpm test
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
git diff --check
```

## 6. Real-World-Test

1. Bergen in Fjord öffnen und Referenzwirkung prüfen.
2. Auf Ostsee wechseln: **A5-Seite muss echtes Weiß bleiben**.
3. Wissen/Geschichte: warme Backstein-/Sand-Fläche, kein Rahmen.
4. Tipp/Souvenir: dezente Bernstein-/Sand-Fläche, kein Rahmen.
5. Fotospot: etwas kühler, aber weiterhin klar Ostsee.
6. Praktische Infos: warme Sandtönung.
7. Fischotter, Footer und Safe Zones unverändert.
8. Weite, Bild links, Bild rechts testen.
9. Fjord ↔ Ostsee wechseln: Inhalt, Bilder und Extension-Semantik bleiben identisch.

**STOP**, wenn die Seitenfläche wieder world-spezifisch getönt wird oder eine Extension einen Rahmen/dekorative Zusatzlinien erhält.

**GO**, wenn Ostsee ausschließlich über Typografie, Signets, Companion, Akzente und gezielt warme Editorial-Flächen spricht.

## 7. Commit

```bash
git add .
git commit -m "fix: warm Ostsee editorial expression"
```
