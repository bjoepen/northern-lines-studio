# APPLY-DROPIN · Build 028 – Hiking & Nature Experience

Ausgangsbasis: finaler **Build 027 – Photography Editorial Pairing Polish**.

## 1. Branch anlegen

```bash
cd ~/Projekte/northern-lines-studio
git switch -c build-028-hiking-nature-experience
```

## 2. Dry Run

Passe den Download-Pfad bei Bedarf an.

```bash
rsync -avn ~/Downloads/Northern-Lines-Studio-Build-028-Hiking-Nature-Experience-DropIn/ ~/Projekte/northern-lines-studio/
```

Prüfe die Liste. Es dürfen nur Build-028-Dateien ergänzt oder ersetzt werden. Kein `--delete`.

## 3. Drop-in anwenden

```bash
rsync -av ~/Downloads/Northern-Lines-Studio-Build-028-Hiking-Nature-Experience-DropIn/ ~/Projekte/northern-lines-studio/
```

## 4. Consistency Gate

```bash
cd ~/Projekte/northern-lines-studio
pnpm consistency
```

Erwartet unter anderem:

```text
Hiking & Nature Experience Consistency Gate: PASS
```

## 5. Vollständige Gates

```bash
pnpm check
pnpm test
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
git diff --check
```

**STOP**, sobald ein Gate fehlschlägt. Erst korrigieren, dann weiter.

## 6. macOS-App bauen und installieren

```bash
cd ~/Projekte/northern-lines-studio
./scripts/install-macos-app.sh
```

Ziel:

```text
/Applications/Northern Lines Studio.app
```

Manuell alternativ:

```bash
pnpm tauri build --bundles app
```

## 7. Real-World-Test

1. Bestehende Build-027-Reise öffnen; Migration `.nls` 0.12.0 → 0.13.0 prüfen.
2. Bei Bergen oder einer anderen Destination **Wandern & Natur** öffnen/anlegen.
3. Zwei Routen eintragen, zum Beispiel `Fløyen Rundweg` und `Ulriken – Montana`.
4. Je Route Startpunkt, Dauer und Schwierigkeit zeilengleich ergänzen.
5. Prüfen: Route → Start → Dauer → Schwierigkeit wird als **ein Routeneintrag** gelesen, nicht als Tabelle.
6. Aussicht/Naturziele sowie Streckenhinweis ergänzen.
7. Fjord ↔ Ostsee wechseln: Inhalt bleibt gleich, Expression wechselt.
8. Projekt schließen und erneut öffnen: Persistenz prüfen.
9. Capacity-Stresstest: Companion und Footer müssen geschützt bleiben.

## 8. Commit

```bash
git add .
git commit -m "feat: add hiking and nature experience"
git push
```
