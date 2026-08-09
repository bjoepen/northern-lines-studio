#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
APP_NAME="Northern Lines Studio.app"
BUILT_APP="$REPO_ROOT/src-tauri/target/release/bundle/macos/$APP_NAME"
INSTALLED_APP="/Applications/$APP_NAME"

cd "$REPO_ROOT"

echo "→ Baue Northern Lines Studio als macOS-App …"
pnpm tauri build --bundles app

if [[ ! -d "$BUILT_APP" ]]; then
  echo "FEHLER: App-Bundle nicht gefunden: $BUILT_APP" >&2
  exit 1
fi

echo "→ Installiere $APP_NAME nach /Applications …"
rm -rf "$INSTALLED_APP"
ditto "$BUILT_APP" "$INSTALLED_APP"

echo "→ Registriere die App bei macOS Launch Services …"
LSREGISTER="/System/Library/Frameworks/CoreServices.framework/Frameworks/LaunchServices.framework/Support/lsregister"
if [[ -x "$LSREGISTER" ]]; then
  "$LSREGISTER" -f "$INSTALLED_APP"
fi

touch "$INSTALLED_APP"

echo
echo "Northern Lines Studio wurde installiert:"
echo "$INSTALLED_APP"
echo
echo "Finder-Test:"
echo "1. Studio vollständig beenden."
echo "2. Eine .nls-Reise im Finder doppelklicken."
echo "3. Erwartung: Northern Lines Studio startet und öffnet genau diese Reise."
