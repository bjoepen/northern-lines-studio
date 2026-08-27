# APPLY · Build 046B World Wire-up Hardening

From the repository root on branch `build/046-world-registry-hardening`:

```bash
node scripts/apply-build-046b-world-wireup-hardening.mjs
node scripts/check-build-046b-world-wireup-hardening-consistency.mjs
pnpm check
pnpm test
pnpm consistency
pnpm build
git diff --check
```

Expected source changes after apply:

- `src/App.svelte`
- `package.json`

The apply helper itself is temporary and should not be part of the final Build 046 commit set once the local apply has been committed.

No `.nls` format, migration, Grammar, page type, renderer geometry, PDF path or Production Host behavior is changed.
