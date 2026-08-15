# APPLY-DROPIN · Build 027 – Photography Editorial Pairing Polish

**Baseline:** Build 027 – Photography Layout Polish  
**Target:** Build 027 – Photography Editorial Pairing Polish  
**Project format:** `.nls` 0.12.0 → 0.12.0 (keine Migration)

Dieser Mini-Polish entfernt die tabellenartige vertikale Trennlinie zwischen Fotospot und Brennweitenempfehlung. Die semantische Paarung bleibt unverändert und wird ausschließlich durch Ausrichtung, Abstand und Typografie getragen.

## 1. Branch

```bash
cd ~/Projekte/northern-lines-studio
git status
git switch main
git pull --ff-only
git switch -c fix/027-photography-editorial-pairing
```

## 2. Dry Run

```bash
rsync -avn \
  ~/Downloads/Northern-Lines-Studio-Build-027-Photography-No-Table-Divider-Fix-DropIn/ \
  ~/Projekte/northern-lines-studio/
```

## 3. Apply

```bash
rsync -av \
  ~/Downloads/Northern-Lines-Studio-Build-027-Photography-No-Table-Divider-Fix-DropIn/ \
  ~/Projekte/northern-lines-studio/
```

## 4. Consistency Gate

```bash
cd ~/Projekte/northern-lines-studio
pnpm consistency
```

Erwartung unter anderem:

```text
Photography & Place Experience Consistency Gate: PASS
Photography Layout Polish Gate: PASS
Photography Editorial Pairing Polish Gate: PASS
```

## 5. Full Gates

```bash
pnpm check
pnpm test
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
git diff --check
```

## 6. App bauen & installieren

```bash
cd ~/Projekte/northern-lines-studio
./scripts/install-macos-app.sh
```

Erwartetes Ziel:

```text
/Applications/Northern Lines Studio.app
```

## 7. Real-World-Test

Bergen → **Fotografie** öffnen und prüfen:

1. `Bryggen / Vågen` → `18–35 mm`
2. `Fløyen Aussichtspunkt` → `18–50 mm`
3. `Ulriken` → `50–230 mm`
4. Spot und Brennweite bleiben eindeutig als Paar lesbar.
5. Zwischen Ort und Brennweite erscheint **keine vertikale Trennlinie** mehr.
6. Die Komponente wirkt redaktionell, nicht tabellarisch.
7. Fjord ↔ Ostsee bleibt korrekt.

### GO

Paarung eindeutig, keine Tabellenkante, alle Gates grün.

### STOP

Nicht committen, wenn Zuordnung unklar wird, Layout verrutscht oder ein Gate fehlschlägt.

## 8. Commit & Push

```bash
git add .
git commit -m "fix: remove photography spot focal divider"
git push -u origin fix/027-photography-editorial-pairing
```
