# Northern Lines Drop-in Standard

## Purpose

A Drop-in updates an existing repository without replacing complete directories in Finder. The official merge mechanism is `rsync` with a dry run before the real copy.

## Package shape

Beginning with Studio Build 006, a Drop-in archive contains:

```text
<Build-DropIn>/
├── APPLY-DROPIN.md
└── payload/
    └── <repository-relative files>
```

Only `payload/` is merged into the repository.

## Standard procedure

From a clean or deliberately understood working tree:

```bash
git status --short
```

Preview the merge:

```bash
rsync -avn --exclude='.DS_Store' /path/to/DropIn/payload/ /path/to/repository/
```

Apply it:

```bash
rsync -av --exclude='.DS_Store' /path/to/DropIn/payload/ /path/to/repository/
```

Then inspect and validate:

```bash
git status --short
git diff --check
```

Run the project-specific quality gates before committing.

## Rule

> Finder may be used to unpack the ZIP, but repository Drop-ins are merged with `rsync`, not Finder folder replacement.
