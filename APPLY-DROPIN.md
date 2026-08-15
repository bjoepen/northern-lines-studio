# Northern Lines Studio · Build 028 Hiking & Nature Polish · Drop-in

Ausgangslage: produktives Repository unter `~/Projekte/northern-lines-studio`, entpacktes Drop-in unter `~/Downloads/Northern-Lines-Studio-Build-028-Hiking-Nature-Polish-DropIn`.

## 1 · Branch

```bash
cd ~/Projekte/northern-lines-studio
git switch -c build-028-hiking-nature-polish
```

## 2 · Dry Run

```bash
rsync -avn \
  ~/Downloads/Northern-Lines-Studio-Build-028-Hiking-Nature-Polish-DropIn/ \
  ~/Projekte/northern-lines-studio/
```

Prüfen: Es dürfen nur die Build-028-Polish-Dateien erscheinen. Kein `--delete` verwenden.

## 3 · Apply

```bash
rsync -av \
  ~/Downloads/Northern-Lines-Studio-Build-028-Hiking-Nature-Polish-DropIn/ \
  ~/Projekte/northern-lines-studio/
```

## 4 · Consistency Gate

```bash
cd ~/Projekte/northern-lines-studio
pnpm consistency
```

Erwartet unter anderem:

```text
Hiking & Nature Experience Consistency Gate: PASS
```

Der Gate prüft jetzt zusätzlich:

- Route → Start → Dauer → Schwierigkeit → Naturziel → Streckenhinweis bleibt gekoppelt.
- `hike_highlights` und `hike_guidance` werden routeweise zugeordnet.
- die kompakte Typografie-Stufe ist auf Interest Pages begrenzt.
- Product DNA schließt alle anderen Seitentypen ausdrücklich von dieser Ausnahme aus.
- Companion-/Footer-Schutz bleibt erhalten.

## 5 · Volle Gates

```bash
pnpm check
pnpm test
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
git diff --check
```

Stop bei jedem Fehler. Erwartet für `pnpm check`: 0 errors / 0 warnings.

## 6 · macOS App bauen und installieren

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

Für Entwicklung:

```bash
pnpm tauri dev
```

## 7 · Real-World-Test · Geiranger

Auf **Geiranger → Wandern & Natur** zwei Routen eintragen, jeweils zeilenweise synchron:

### Routen
```text
Fosseråsa → Storsæterfossen
Skagehola → Skageflå → Homlong
```

### Startpunkte
```text
Geiranger Zentrum / Norwegian Fjord Centre
Skagehola, nur per Boot erreichbar
```

### Dauer
```text
ca. 4 h hin und zurück ab Fjord Centre
etwa 3–4 h Wanderzeit plus Bootstransfer
```

### Schwierigkeit
```text
Mittel
Anspruchsvoll
```

### Aussicht & Naturziele
```text
Storsæterfossen, Wasserfall, Wald- und Kulturlandschaft
Skageflå, Geirangerfjord, Blick zu den Sieben Schwestern
```

### Hinweise zur Strecke
```text
Längerer Anstieg; stellenweise Steinstufen; bei Nässe vorsichtig
Sehr steile und teilweise ausgesetzte Abschnitte; Trittsicherheit erforderlich
```

### PASS-Kriterien

- Naturziel und Streckenhinweis stehen sichtbar **bei der jeweiligen Route**.
- Start, Dauer und Schwierigkeit bleiben derselben Route zugeordnet.
- Bei zwei realistischen Touren darf die Interest-Page auf die kompakte Detailtypografie wechseln.
- Titel `Wandern & Natur`, Ortsname `Geiranger` und primäre Hierarchie bleiben unverändert groß.
- Companion bleibt an seiner World-Position und wird nicht verdrängt.
- Footer bleibt an seinem festen Seitenanker und wandert nicht nach unten.
- Kein Inhalt läuft in Companion-/Footer-Safe-Zonen.
- Bei zu viel Inhalt erscheint statt weiterer Verkleinerung: `Diese Seite kann diesen Inhalt nicht mehr ruhig erzählen.`
- Fjord ↔ Ostsee verändert nur die World Expression, nicht die Routendaten.

## 8 · Commit & Push

```bash
cd ~/Projekte/northern-lines-studio
git status
git add .
git commit -m "fix: polish hiking interest layout and capacity"
git push -u origin build-028-hiking-nature-polish
```
