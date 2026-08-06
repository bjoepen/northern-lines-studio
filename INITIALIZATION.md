# Build 001 setup

## Open the project

```bash
open Package.swift
```

Xcode creates the executable scheme from the Swift Package. Select the `NorthernLinesStudio` scheme and run it on macOS 14 or newer.

## Open the example project

In the running app, choose **Open Project…** and select:

```text
Examples/Norway-Sample.nls
```

## Validate

```bash
swift test
```

Then complete the manual checklist in:

```text
docs/validation/BUILD-001-VALIDATION.md
```

## Commit

```bash
git add README.md Package.swift Sources Tests Examples docs .gitignore INITIALIZATION.md SHA256SUMS.txt
git commit -m "feat(studio): add Build 001 project reader and A5 preview"
git push -u origin feature/build-001-foundation
```
