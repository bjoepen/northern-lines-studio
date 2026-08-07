# Build 010.1 Git Workflow

Recommended branch:

```bash
git switch -c fix/build-010-story-authoring-stabilization
```

After applying the drop-in:

```bash
git status
pnpm check
pnpm test
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
git diff --check
```

Recommended commit:

```text
fix(studio): stabilize semantic story authoring
```

Then:

```bash
git add .
git commit -m "fix(studio): stabilize semantic story authoring"
git push -u origin fix/build-010-story-authoring-stabilization
```
