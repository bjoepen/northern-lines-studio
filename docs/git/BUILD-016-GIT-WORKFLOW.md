# Build 016 – Git Workflow

## Branch

```bash
git switch -c feature/journey-opening-foundation
```

## Gates

```bash
pnpm check
pnpm test
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
git diff --check
```

## Installed-App-Validation

```bash
./scripts/install-macos-app.sh
```

Danach beide Finder-Doppelklick-Gates durchführen.

## Commit

```bash
git add .
git commit -m "feat(studio): open nls journeys from Finder"
git push -u origin feature/journey-opening-foundation
```
