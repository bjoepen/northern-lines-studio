# APPLY-DROPIN · Build 027 – Svelte Check Nullability Fix

**Baseline:** Build 027 – Photography & Place Experience
**Target:** Build 027 – Photography & Place Experience · Svelte Check Nullability Fix
**Project format:** `.nls` 0.12.0 → 0.12.0 (keine Migration)

Dieser Drop-in behebt ausschließlich den `svelte-check`-Fehler `'selectedPage' is possibly 'null'` in der Photography-Capacity-Berechnung. Persistenz, Layout Grammar, Capacity-Schwelle und sichtbares Verhalten bleiben unverändert.

## 1. Branch

```bash
cd ~/Projekte/northern-lines-studio
git status
git switch main
git pull --ff-only
git switch -c fix/027-svelte-check-nullability
```

Nur mit sauberem `git status` fortfahren, sofern lokale Änderungen nicht bewusst gesichert wurden.

## 2. Dry Run

Nach dem Entpacken des Drop-ins unter `~/Downloads`:

```bash
rsync -avn \
  ~/Downloads/Northern-Lines-Studio-Build-027-Svelte-Check-Nullability-Fix-DropIn/ \
  ~/Projekte/northern-lines-studio/
```

## 3. Apply

```bash
rsync -av \
  ~/Downloads/Northern-Lines-Studio-Build-027-Svelte-Check-Nullability-Fix-DropIn/ \
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
```

Der Gate prüft nun zusätzlich, dass die Photography-Capacity-Berechnung einen null-sicheren Authoring-Snapshot verwendet und `selectedPage` nicht innerhalb von `reduce()` dereferenziert.

## 5. Full Gates

```bash
pnpm check
pnpm test
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
git diff --check
```

Für den gemeldeten Fehler ist insbesondere die erwartete Ausgabe von `pnpm check`:

```text
svelte-check found 0 errors and 0 warnings
```

## 6. App bauen & installieren

```bash
cd ~/Projekte/northern-lines-studio
./scripts/install-macos-app.sh
```

Erwartetes Ergebnis:

```text
/Applications/Northern Lines Studio.app
```

## 7. Real-World-Test

1. Bestehende `.nls`-Reise öffnen.
2. Bergen → **Fotografie** öffnen.
3. Fotospots/Licht/Motive bearbeiten.
4. Zwischen Fotografie, Ortsseite und einer weiteren Interest Page wechseln.
5. Prüfen: keine Fehlermeldung, Capacity-Verhalten unverändert.
6. Reise speichern, Studio schließen, neu öffnen und Persistenz prüfen.
7. Optional einen bewusst langen Fotografie-Inhalt testen; der bestehende Capacity-Hinweis muss weiterhin erscheinen.

### GO

`pnpm check` meldet 0 Fehler/0 Warnungen und das Photography-Verhalten ist unverändert.

### STOP

Nicht committen, wenn `selectedPage is possibly null` noch erscheint oder sich Persistenz/Capacity/Layout verändert.

## 8. Commit & Push

```bash
git add .
git commit -m "fix: guard photography capacity calculation"
git push -u origin fix/027-svelte-check-nullability
```
