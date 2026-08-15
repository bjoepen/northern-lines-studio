# Build 028 · Inspector UX Language Fix — Drop-in

Ausgangsstand: **Build 028 Interest Entry Authoring Fix**  
Ziel: ruhige Northern-Lines-UX-Language im Interest-Authoring und korrigierte Begleiter-Status-Typografie.

## 1. In das produktive Repo wechseln

```bash
cd ~/Projekte/northern-lines-studio
```

Optionaler Arbeitsbranch:

```bash
git switch -c fix/build-028-inspector-ux-language
```

## 2. Dry Run

```bash
rsync -avn ~/Downloads/Northern-Lines-Studio-Build-028-Inspector-UX-Language-Fix-DropIn/ ~/Projekte/northern-lines-studio/
```

Erwartet werden Änderungen an:

- `src/styles/destination-interests.css`
- `src/styles/base-shell.css`
- `scripts/check-inspector-ux-language-consistency.mjs`
- `docs/PRODUCT-DNA.md`
- `package.json`
- `README.md`

## 3. Apply

```bash
rsync -av ~/Downloads/Northern-Lines-Studio-Build-028-Inspector-UX-Language-Fix-DropIn/ ~/Projekte/northern-lines-studio/
```

## 4. Consistency Gate

```bash
cd ~/Projekte/northern-lines-studio
pnpm consistency
```

Zusätzlich muss erscheinen:

```text
Inspector UX Language Consistency Gate: PASS
```

## 5. Vollständige Gates

```bash
pnpm check
pnpm test
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
git diff --check
```

## 6. macOS-App installieren

```bash
cd ~/Projekte/northern-lines-studio
./scripts/install-macos-app.sh
```

Manuell alternativ:

```bash
pnpm tauri build --bundles app
```

Ziel:

```text
/Applications/Northern Lines Studio.app
```

## 7. Real-World-Test

### Interest Authoring

1. Geiranger → `Wandern & Natur` öffnen.
2. Prüfen, dass vorhandene Routen wie ruhige redaktionelle Einträge wirken.
3. `+ Route hinzufügen` muss klar auffindbar, aber nicht als breite dominante Buttonfläche erscheinen.
4. `Entfernen` muss sichtbar, jedoch deutlich sekundärer sein.
5. Dasselbe auf einer Fotografie-Seite mit `+ Fotospot hinzufügen` prüfen.

### Reisebegleiter

Im Inspector `Reisebegleiter` prüfen:

- `Platz` / **`unten links`**
- `Pose` / **`Standard`**
- `Spiegelung` / **`aus`**

Die Werte müssen dieselbe kleine Schriftgröße wie ihre Labels besitzen, auf derselben Grundlinie sitzen und nur durch **bold** hervorgehoben werden. Sie dürfen nicht wie bereits editierbare Controls wirken.

## 8. Commit

```bash
git status
git add src/styles/destination-interests.css src/styles/base-shell.css scripts/check-inspector-ux-language-consistency.mjs docs/PRODUCT-DNA.md package.json README.md
git commit -m "fix: refine inspector UX language"
git push
```
