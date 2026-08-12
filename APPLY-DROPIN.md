# APPLY-DROPIN · Build 025C White Page Expression Polish

Ausgangsbasis: **Build 025C – Ostsee Expression & Companion Fix**  
Ziel: Die A5-Seitenfläche bleibt in Fjord und Ostsee neutral weiß. Die World Expression bleibt auf Typografie, Akzente, Companion, Signets sowie Editorial-/Extension-Flächen beschränkt.

## 1. Branch

```bash
cd ~/Projekte/northern-lines-studio
git switch main
git pull --ff-only
git switch -c fix/build-025c-white-page-expression-polish
```

## 2. Dry Run

```bash
rsync -avn ~/Downloads/Northern-Lines-Studio-Build-025C-Ostsee-White-Page-Polish-Fix-DropIn/ \
  ~/Projekte/northern-lines-studio/
```

Erwartet werden nur die Dateien dieses Polish Fixes. Es werden keine Dateien gelöscht.

## 3. Apply

```bash
rsync -av ~/Downloads/Northern-Lines-Studio-Build-025C-Ostsee-White-Page-Polish-Fix-DropIn/ \
  ~/Projekte/northern-lines-studio/
```

`APPLY-DROPIN.md` darf anschließend im Repo entfernt werden, falls es durch `rsync` mitkopiert wurde.

## 4. Consistency Gate

```bash
cd ~/Projekte/northern-lines-studio
pnpm consistency
```

Erwartet u. a.:

```text
Editorial World Expression Consistency Gate: PASS
CSS & Grammar Consolidation Consistency Gate: PASS
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

1. Bergen in **Fjord** öffnen: Seitenfläche bleibt neutral weiß.
2. Auf **Ostsee** wechseln: Seitenfläche bleibt ebenfalls neutral weiß.
3. Fischotter bleibt sichtbar und unverändert in seiner Companion-Zone.
4. Ostsee bleibt über Typografie, Baltic/Steel-Akzente und Fog/Sand/Amber-Contentflächen erkennbar.
5. Wissen/Fotospot/Souvenir prüfen: Signets und world-konforme Flächen bleiben erhalten, ohne Rahmen oder zusätzliche Dekoration.
6. **Weite · Bild links · Bild rechts** durchschalten: keine Grammar- oder Safe-Zone-Regression.
7. Zurück zu Fjord wechseln: Inhalt, Bilder, Extensions und Seitenwirkung bleiben unverändert.

**GO:** Beide Worlds besitzen eine weiße Grundseite; die World Expression lebt ausschließlich in gezielten redaktionellen Elementen.

## 7. Commit

```bash
git add -A
git commit -m "fix: keep editorial world page surfaces white"
```
