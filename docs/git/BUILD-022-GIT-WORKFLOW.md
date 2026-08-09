# Build 022 – Git Workflow

## Branch

```bash
cd ~/Projekte/northern-lines-studio
git switch main
git pull --ff-only
git switch -c feature/destination-imagery-foundation
```

## After applying the Drop-in

```bash
git status
git diff --stat
git diff --check
pnpm consistency
pnpm check
pnpm test
pnpm build
cargo test --manifest-path src-tauri/Cargo.toml
```

## Commit

```bash
git add -A
git commit -m "feat(studio): add destination imagery foundation"
git push -u origin feature/destination-imagery-foundation
```

After review and real-world validation, merge back to `main` according to the normal repository workflow.
