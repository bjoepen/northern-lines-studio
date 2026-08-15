# Build 026 · Validation

## Gates

```bash
pnpm consistency
pnpm check
pnpm test
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
git diff --check
```

## Real-World-Test

1. Open an existing Build-025 / 0.10.0 Travelbook and verify migration to 0.11.0.
2. Open Bergen and add **Fotografie**.
3. Verify the new page appears directly after Bergen in **Deine Route**.
4. Return to Bergen and add **Kultur & Geschichte**.
5. Verify both pages coexist and Stavanger/next route destination remains after Bergen's interest pages.
6. Edit title/introduction on one interest page and save.
7. Switch Fjord ↔ Ostsee and verify typography/Companion/World Expression changes without semantic duplication.
8. Close and reopen the `.nls`; both pages and their authoring remain.
9. Remove one interest page and verify the other remains.
10. Add a new destination after interest pages exist and verify page ordering remains valid.

**GO** when the traveller can deepen one place in several directions without managing page types or layout mechanics.
