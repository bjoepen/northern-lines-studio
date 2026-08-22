# APPLY-DROPIN · Studio PDF Proof PoC 001A · Color Fidelity + A5 Evidence

## Dry Run

```bash
cd /Volumes/Kioxia/Projekte/northern-lines-studio
rsync -avn \
  ~/Downloads/Northern-Lines-Studio-PDF-Proof-PoC-001A-Color-Fidelity/ \
  /Volumes/Kioxia/Projekte/northern-lines-studio/
```

## Apply

```bash
rsync -av \
  ~/Downloads/Northern-Lines-Studio-PDF-Proof-PoC-001A-Color-Fidelity/ \
  /Volumes/Kioxia/Projekte/northern-lines-studio/
```

## Gates

```bash
cd /Volumes/Kioxia/Projekte/northern-lines-studio
node scripts/check-studio-pdf-proof-poc-001-consistency.mjs
node scripts/check-build-040-a5-geometry-consistency.mjs
pnpm check
pnpm test
pnpm consistency
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
./scripts/install-macos-app.sh
```

## Real-world evidence

Open the Golden reference page, choose `PDF-Proof`, and in the macOS print dialog set:

```text
Paper Size: A5
Scale: 100 %
Fit/Scale to paper: disabled
```

Save as PDF and compare colors and layout against Studio.
