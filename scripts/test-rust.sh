#!/bin/bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cargo test --manifest-path "$REPO_ROOT/src-tauri/Cargo.toml"
