# Build 037 — Git Workflow

```bash
cd ~/Projekte/northern-lines-studio
git checkout -b feat/build-037-contents-notes-curated-accents
```

Apply the Drop-in using `APPLY-DROPIN.md`, then run:

```bash
pnpm consistency
pnpm check
pnpm test
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
git diff --check
./scripts/install-macos-app.sh
```

After visual approval:

```bash
git add .
git commit -m "feat: add contents and notes curated accents"
git push -u origin feat/build-037-contents-notes-curated-accents
```

Create the PR only after the real-world Fjord/Ostsee comparison is visually accepted.
