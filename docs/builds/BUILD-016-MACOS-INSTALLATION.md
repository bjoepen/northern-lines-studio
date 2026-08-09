# Northern Lines Studio – macOS Installation für Build 016

Build 016 muss als echte installierte App getestet werden.

## 1. Gates

```bash
cd ~/Projekte/northern-lines-studio
pnpm check
pnpm test
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
git diff --check
```

## 2. Release-App bauen und installieren

```bash
cd ~/Projekte/northern-lines-studio
./scripts/install-macos-app.sh
```

Das Script führt aus:

```text
pnpm tauri build --bundles app
→ Northern Lines Studio.app
→ /Applications/Northern Lines Studio.app
→ Launch Services Registrierung
```

## 3. Finder-Validierung

### Studio geschlossen
Doppelklick auf `Norwegen.nls`.

Erwartung:

```text
Finder
  ↓
Norwegen.nls
  ↓
Northern Lines Studio.app
  ↓
Norwegen geöffnet
```

### Studio geöffnet
Doppelklick auf eine zweite `.nls`-Reise.

Erwartung: Studio wechselt kontrolliert auf diese Reise.

## 4. Falls macOS noch eine falsche Zuordnung verwendet

Im Finder:

1. `.nls` auswählen.
2. `⌘I` – Informationen.
3. **Öffnen mit:** Northern Lines Studio.
4. **Alle ändern …**

Danach den Doppelklick erneut testen.
