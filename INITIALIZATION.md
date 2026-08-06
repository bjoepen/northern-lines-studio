# Initialisierung von Build 001

## Werkzeuge installieren

```bash
xcode-select --install
corepack enable
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source "$HOME/.cargo/env"
```

Node.js kann beispielsweise über Homebrew installiert werden:

```bash
brew install node
```

## Repository vorbereiten

```bash
pnpm install
pnpm check
cd src-tauri && cargo test && cd ..
pnpm tauri dev
```

## Beispielprojekt

Im Öffnen-Dialog das komplette Verzeichnis auswählen:

```text
examples/Norway-Sample.nls
```

Nicht die darin enthaltene `project.json` auswählen.

## Release-Build

```bash
pnpm tauri build
```

Build-Produkte werden unter `src-tauri/target/release/bundle/` erzeugt.
