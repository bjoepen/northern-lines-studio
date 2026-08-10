# APPLY-DROPIN – Build 024

Upgrade von **Build 023 Final – Weite Editorial Composition Fix** auf **Build 024 – Editorial Extension Zones Foundation**.

## 1. Branch

```bash
cd ~/Projekte/northern-lines-studio
git switch main
git pull --ff-only
git switch -c build/024-editorial-extension-zones
```

## 2. Dry Run

```bash
rsync -avn ~/Downloads/Northern-Lines-Studio-Build-024-Editorial-Extension-Zones-Foundation-DropIn/ ~/Projekte/northern-lines-studio/
```

Prüfe die Dateiliste. Das Drop-in löscht keine Dateien.

## 3. Apply

```bash
rsync -av ~/Downloads/Northern-Lines-Studio-Build-024-Editorial-Extension-Zones-Foundation-DropIn/ ~/Projekte/northern-lines-studio/
```

## 4. Consistency Gate

```bash
cd ~/Projekte/northern-lines-studio
pnpm consistency
```

Erwartet wird zusätzlich:

```text
Editorial Extension Zones Consistency Gate: PASS
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

1. Ein vorhandenes Build-023-`.nls` öffnen. Es wird von 0.9.0 auf 0.10.0 migriert.
2. Bergen ohne Extension prüfen: die bisherige Seite muss unverändert wirken.
3. Unter **Besondere Hinweise** eine Extension **Wissen** anlegen, z. B. Titel `Hanse in Bergen` und einen kurzen Text.
4. Ortsprofil sichern. Die Preview muss genau **ein Signet + world-konforme Fläche + Inhalt** zeigen: kein Rahmen, kein Divider, kein dekorativer Zusatz.
5. Einen **Tipp** ergänzen und prüfen, dass die Fläche ruhiger gewichtet ist als Wissen.
6. Ungesicherte Extension ändern und die Seite wechseln. Erwartet: **Verwerfen · Abbrechen · Speichern**.
7. Projekt schließen/öffnen. Extensions müssen erhalten bleiben.
8. **Weite · Bild links · Bild rechts** prüfen: Hero/Title, Companion und Footer bleiben unverändert und geschützt.

**STOP**, wenn Extensions wie Cards wirken, den Companion verdrängen oder Semantik und World-Farbe vermischen.
