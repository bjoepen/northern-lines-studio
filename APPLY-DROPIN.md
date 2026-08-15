# APPLY-DROPIN · Build 027 – Photography Layout Polish

**Baseline:** Build 027 – Photography & Place Experience + Svelte Check Nullability Fix
**Target:** Build 027 – Photography Layout Polish
**Project format:** `.nls` 0.12.0 → 0.12.0 (keine Migration)

Der Polish koppelt Fotospot und Brennweitenempfehlung direkt in der Seitenkomposition und reduziert den bisher zu großzügigen Kopfraum. Semantik und Persistenz bleiben erhalten.

## 1. Branch

```bash
cd ~/Projekte/northern-lines-studio
git status
git switch main
git pull --ff-only
git switch -c fix/027-photography-layout-polish
```

Nur mit sauberem `git status` fortfahren, sofern lokale Änderungen nicht bewusst gesichert wurden.

## 2. Dry Run

Nach dem Entpacken unter `~/Downloads`:

```bash
rsync -avn \
  ~/Downloads/Northern-Lines-Studio-Build-027-Photography-Layout-Polish-DropIn/ \
  ~/Projekte/northern-lines-studio/
```

Erwartet werden nur die Polish-Dateien; kein `--delete`.

## 3. Apply

```bash
rsync -av \
  ~/Downloads/Northern-Lines-Studio-Build-027-Photography-Layout-Polish-DropIn/ \
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
```

## 5. Full Gates

```bash
pnpm check
pnpm test
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
git diff --check
```

Erwartung für Svelte:

```text
svelte-check found 0 errors and 0 warnings
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

Manuell alternativ:

```bash
pnpm tauri build --bundles app
```

## 7. Real-World-Test

Bergen → **Fotografie** öffnen.

Fotospots:

```text
Bryggen / Vågen
Fløyen Aussichtspunkt
Ulriken
```

Brennweite je Fotospot:

```text
18–35 mm
18–50 mm
50–230 mm
```

Prüfen:

1. `Bryggen / Vågen` trägt direkt `18–35 mm`.
2. `Fløyen Aussichtspunkt` trägt direkt `18–50 mm`.
3. `Ulriken` trägt direkt `50–230 mm`.
4. Eine Brennweitenzeile löschen: der betreffende Spot zeigt nur `Brennweite offen`; Studio erfindet nichts.
5. Keine separate Brennweiten-Sammelbox mehr.
6. Dünne Kopflinie bleibt, verbraucht aber deutlich weniger Höhe.
7. Fjord ↔ Ostsee: Inhalt identisch, World Expression korrekt.
8. Speichern → schließen → neu öffnen → Zuordnung bleibt erhalten.

### GO

Eindeutige Spot/Brennweiten-Paarung, ruhiger kompakter Kopf, alle Gates grün.

### STOP

Nicht committen bei verschobener Zuordnung, abgeschnittenem Inhalt, Companion-/Footer-Konflikt oder Gate-Fehler.

## 8. Commit & Push

```bash
git add .
git commit -m "fix: pair photography spots with focal lengths"
git push -u origin fix/027-photography-layout-polish
```
