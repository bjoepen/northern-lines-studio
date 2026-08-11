# Build 025A – Validation

## Technical gates

```bash
pnpm consistency
pnpm check
pnpm test
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
git diff --check
```

`pnpm consistency` now includes **CSS & Grammar Consolidation Consistency Gate**.

## Visual regression – mandatory macOS real-world test

Use the last approved Build 024 project and compare against the Build 024 baseline.

1. Bergen · Weite · image + normal extensions.
2. Stavanger / Geiranger · long place name, with and without image.
3. Bild links and Bild rechts.
4. Two short Editorial Extension Zones.
5. One long + one short extension.
6. Extreme long extensions: the capacity message must appear before a protected zone is violated.
7. Companion and footer remain invariant.
8. Resize Inspector 320–440 px.
9. Open via Finder and via `Reise öffnen`.

### Expected result

No traveller-visible visual or behavioural regression versus approved Build 024.
