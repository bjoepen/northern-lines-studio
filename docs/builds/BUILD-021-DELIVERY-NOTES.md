# Build 021 – Delivery Notes

## Delivery

Build 021 is delivered in the established Northern Lines Studio release format:

1. **Full Repo** – authoritative complete repository state.
2. **Drop-in** – only files added/changed from validated Build 020 Final, plus `APPLY-DROPIN.md`.

## Upgrade baseline

The Drop-in targets:

**Build 020 – Final · Studio 0.20.0 · `.nls` 0.8.0**

No schema migration is added by Build 021.

## Required local validation

```bash
pnpm consistency
pnpm check
pnpm test
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
git diff --check
```

Then perform the real-world A5 test from `docs/validation/BUILD-021-VALIDATION.md`.

## Release discipline

Do not merge until automated gates and the visual Bergen test are green. The visual acceptance criteria are part of the Definition of Done because Build 021 changes layout resilience, not merely code structure.
