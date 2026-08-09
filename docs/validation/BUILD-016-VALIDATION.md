# Build 016 – Validation

## Gate A – Code

```bash
pnpm check
pnpm test
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
git diff --check
```

## Gate B – DEV / laufendes Studio

1. `pnpm tauri dev`
2. Eine andere `.nls`-Reise im Finder doppelklicken.
3. Erwartung: Studio empfängt den Open-Request und öffnet die Reise.
4. Story ändern, nicht sichern, dann eine andere `.nls` doppelklicken.
5. Erwartung: Dirty-State-Dialog schützt die Änderung.

> Hinweis: Der DEV-Test validiert den Laufzeit-Open-Event. Er ersetzt nicht Gate C.

## Gate C – installierte macOS-App

```bash
./scripts/install-macos-app.sh
```

Alternativ manuell:

```bash
pnpm tauri build --bundles app
rm -rf "/Applications/Northern Lines Studio.app"
ditto "src-tauri/target/release/bundle/macos/Northern Lines Studio.app"       "/Applications/Northern Lines Studio.app"
```

### C1 – Studio geschlossen
1. `/Applications/Northern Lines Studio.app` vollständig beenden.
2. Eine `.nls`-Reise im Finder doppelklicken.
3. Erwartung: Studio startet.
4. Erwartung: Genau die angeklickte Reise ist geöffnet.

### C2 – Studio läuft
1. Studio geöffnet lassen.
2. Eine zweite `.nls`-Reise im Finder doppelklicken.
3. Erwartung: Die zweite Reise wird in Studio geöffnet.

## Launch-Services-Kontrolle

Nach dem Release-Build kann die Registrierung geprüft werden:

```bash
plutil -p "/Applications/Northern Lines Studio.app/Contents/Info.plist" |   grep -A 20 -E 'CFBundleDocumentTypes|UTExportedTypeDeclarations'
```

## Definition of Done

**PASS nur wenn C1 und C2 erfolgreich sind.**
