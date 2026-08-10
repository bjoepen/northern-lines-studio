# APPLY-DROPIN – Build 024 Adaptive Grammar Polish Fix

Upgrade von **Build 024 – Editorial Extension Zones Foundation** auf **Build 024 – Adaptive Grammar Polish Fix**.

## 1. Branch

```bash
cd ~/Projekte/northern-lines-studio
git switch main
git pull --ff-only
git switch -c build/024-adaptive-grammar-polish
```

## 2. Dry Run

```bash
rsync -avn ~/Downloads/Northern-Lines-Studio-Build-024-Adaptive-Grammar-Polish-Fix-DropIn/ ~/Projekte/northern-lines-studio/
```

Prüfe die Dateiliste. Das Drop-in löscht keine Dateien.

## 3. Apply

```bash
rsync -av ~/Downloads/Northern-Lines-Studio-Build-024-Adaptive-Grammar-Polish-Fix-DropIn/ ~/Projekte/northern-lines-studio/
```

## 4. Consistency Gate

```bash
cd ~/Projekte/northern-lines-studio
pnpm consistency
```

Erwartet wird zusätzlich:

```text
Adaptive Layout Grammar Consistency Gate: PASS
```

## 5. Full Gates

```bash
pnpm check
pnpm test
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
git diff --check
```

## 6. Real-World-Test

1. **Bergen / Weite** öffnen. Erwartet: ruhige ausgeglichene Title-Komposition.
2. **Stavanger / Weite** öffnen. Erwartet: Ortsname bleibt vollständig; kein `Stavange / r`. Studio gibt dem Titel automatisch mehr Breite.
3. **Geiranger / Weite** genauso prüfen.
4. Einen längeren Namen wie **Geirangerfjord** prüfen. Erwartet: stärker titelbetonte Komposition; bei noch längeren Namen darf der Introtext unter den Titel wechseln.
5. Zwei kurze Extensions anlegen. Erwartet: ruhige Zweierkomposition.
6. Eine lange **Wissen**-Extension und einen kurzen **Fotospot** anlegen. Erwartet: asymmetrische Verteilung zugunsten des längeren Inhalts.
7. Zwei deutlich längere Extensions anlegen. Erwartet: Studio verlässt den starren 50/50-Zustand und stapelt innerhalb der Grammar.
8. In allen Zuständen prüfen: Companion und Footer bleiben unverändert und werden nicht als zusätzliche Layoutkapazität benutzt.
9. **Bild links** und **Bild rechts** gegenprüfen. Der Polish Fix darf deren bestehende Komposition nicht beschädigen.

**STOP**, wenn ein Ortsname mitten im Wort getrennt wird, die Grammar trotz klar ungleicher Inhalte starr 50/50 bleibt oder Extensions den Companion bedrängen.

## Git-Commit-Vorschlag

```text
fix(build-024): make destination grammar adapt to content
```
