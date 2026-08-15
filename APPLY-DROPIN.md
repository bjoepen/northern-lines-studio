# APPLY-DROPIN · Build 026 – Destination Interest Pages World Expression Polish

**Baseline:** Build 026 – Destination Interest Pages Foundation  
**Target:** Build 026 – Destination Interest Pages World Expression Polish  
**Project format:** `.nls` 0.11.0 → 0.11.0 (keine Migration)

Dieser Drop-in enthält nur neue/geänderte Dateien. `--delete` ist nicht erforderlich.

## 1. Branch

```bash
cd ~/Projekte/northern-lines-studio
git switch main
git pull --ff-only
git switch -c fix/026-interest-world-expression
```

Nur mit sauberem `git status` fortfahren, sofern lokale Änderungen nicht bewusst gesichert wurden.

## 2. Dry Run

Nach dem Entpacken des Drop-ins unter `~/Downloads`:

```bash
rsync -avn \
  ~/Downloads/Northern-Lines-Studio-Build-026-Destination-Interest-World-Expression-Polish-DropIn/ \
  ~/Projekte/northern-lines-studio/
```

Erwartung: Nur die Polish-Dateien werden gelistet. `.git/` bleibt unangetastet.

## 3. Apply

```bash
rsync -av \
  ~/Downloads/Northern-Lines-Studio-Build-026-Destination-Interest-World-Expression-Polish-DropIn/ \
  ~/Projekte/northern-lines-studio/
```

## 4. Consistency Gate

```bash
cd ~/Projekte/northern-lines-studio
pnpm consistency
```

Zusätzlich muss erscheinen:

```text
Destination Interest World Expression Consistency Gate: PASS
```

## 5. Full Gates

```bash
pnpm check
pnpm test
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
git diff --check
```

Alle Gates müssen PASS sein, bevor committed wird.

## 6. App bauen & installieren

Aus dem Repo-Root:

```bash
cd ~/Projekte/northern-lines-studio
./scripts/install-macos-app.sh
```

Erwartetes Ergebnis:

```text
/Applications/Northern Lines Studio.app
```

Für den Real-World-Test immer die frisch installierte App verwenden.

## 7. Real-World-Test

1. Eine bestehende `.nls`-Reise im Format 0.11.0 öffnen.
2. Bei Bergen mindestens eine Vertiefungsseite öffnen, idealerweise **Kultur & Geschichte**.
3. In **Fjord** prüfen: weiße Seite, Fjord-Typografie/-Akzent und kühle, ruhige Vertiefungsfläche.
4. Auf **Ostsee** wechseln.
5. Prüfen: Seitenfläche bleibt weiß; Typografie, Meta-Akzente und die Fläche **Deine Vertiefung** wechseln sichtbar in die Ostsee-Expression.
6. Ostsee-Fläche soll warm Hanse/Backstein/Sand zitieren, ohne Rahmen oder zusätzliche Dekoration.
7. Companion muss World-konform wechseln und seine geschützte Zone behalten.
8. Zurück auf **Fjord** wechseln. Titel, Einleitung, Destination-Zuordnung und Reihenfolge dürfen sich nicht ändern.
9. Studio schließen, Reise erneut öffnen und Persistenz kontrollieren.

### GO

Die Interest Page wirkt eindeutig wie dieselbe Northern-Lines-Seite in einer anderen Editorial World: Semantik bleibt, Expression wechselt.

### STOP

Nicht committen, wenn:

- die Seitenfläche durch eine World eingefärbt wird;
- Interest Pages nur die Typografie, aber nicht Akzente/Editorial-Flächen wechseln;
- der World Switch Inhalt oder Destination-Zuordnung verändert;
- Fjord oder Ostsee hardcodierte Neutralflächen verwenden, die die World Expression brechen;
- Companion, Footer oder Safe Zones verändert werden.

## 8. Commit & Push

```bash
git add .
git commit -m "fix: apply world expression to destination interest pages"
git push -u origin fix/026-interest-world-expression
```
