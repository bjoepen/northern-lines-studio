# Build 020 – Final Delivery Notes

## Delivery

Authoritative release: **Build 020 – Final** (`0.20.0`, `.nls` 0.8.0).

The finalization preserves the Build-020 domain architecture and applies the approved Northern-Lines-Studio UX corrections: Travel Language, quieter Ortsprofil inspector, visual Seitenwirkung selection, corrected **Weite**, stable footer/companion/page number and removal of the decorative Fjord marker.

## Local static checks performed during packaging

The repository packaging environment can execute the Node-based consistency scripts but does not provide the project's package dependencies or Rust toolchain. The authoritative validation remains the macOS gate sequence in `APPLY-DROPIN.md`.

## Required validation

```bash
pnpm consistency
pnpm check
pnpm test
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
git diff --check
```

Follow with the Bergen Real-World-Test in `docs/validation/BUILD-020-VALIDATION.md`.
