# Studio PDF Proof PoC Validation

## Automated Gates

Run from repository root:

```bash
node scripts/check-studio-pdf-proof-poc-001-consistency.mjs
pnpm check
pnpm test
pnpm consistency
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
```

## Real-World macOS Evidence Required

```bash
./scripts/install-macos-app.sh
```

Then:

```text
open Golden reference page
-> PDF-Proof
-> choose output path
-> PDF exists
-> PDF MediaBox is exact A5
```

Visual checks:

- title position and line breaks;
- body line breaks;
- module and hero/image geometry;
- Companion and footer positions;
- page number;
- safe zones;
- Fjord quiet/accent colors;
- World fonts.

## Known Environment Limits

The Codex macOS shell can compile the macOS adapter and run Rust tests. It cannot prove the installed Tauri app workflow unless `./scripts/install-macos-app.sh` is executed in the real user environment.

The Windows WebView2 adapter is architecturally identified but not executed in this macOS environment.

## Definition of Done Status

The PoC is not merge-ready until the real-world macOS proof produces an exact A5 PDF and the visual checks pass.
