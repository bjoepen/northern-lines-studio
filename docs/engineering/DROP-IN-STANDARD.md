# Northern Lines Drop-in Standard

## Purpose

A Drop-in updates an existing repository without replacing complete directories in Finder. The official merge mechanism is `rsync` with a dry run before the real copy.

## Package shape

Beginning with Studio Build 007, the Drop-in root mirrors the repository directly:

```text
<Build-DropIn>/
├── APPLY-DROPIN.md
├── src/
├── src-tauri/
├── docs/
└── <other repository-relative files>
```

There is **no `payload/` wrapper**. The instruction file is excluded from the merge command so it does not become a repository file.

## Standard procedure

From the repository root:

```bash
git status --short
```

Preview the merge:

```bash
rsync -avn \
  --exclude='.DS_Store' \
  --exclude='APPLY-DROPIN.md' \
  /Pfad/zum/Northern-Lines-Studio-Build-XXX-DropIn/ \
  ./
```

Apply it:

```bash
rsync -av \
  --exclude='.DS_Store' \
  --exclude='APPLY-DROPIN.md' \
  /Pfad/zum/Northern-Lines-Studio-Build-XXX-DropIn/ \
  ./
```

A typical macOS repository location may be written generically as:

```bash
cd ~/Projekte/northern-lines-studio
```

No personal user name is stored in documentation.

Then inspect and validate:

```bash
git status --short
git diff --check
```

Run the project-specific quality gates before committing.

## Rule

> Finder may be used to unpack the ZIP, but repository Drop-ins are merged with `rsync`, not Finder folder replacement.
