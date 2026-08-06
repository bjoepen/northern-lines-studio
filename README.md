# Northern Lines Studio

**Native Travel Publishing for macOS**

Northern Lines Studio is a specialized visual and editorial workspace for Northern Lines Travel Fieldbooks. It is not a general-purpose DTP application.

## Build 001

Build 001 proves one narrow workflow:

1. open a local `.nls` project package
2. decode and validate `project.json`
3. display the project's page structure
4. select a page
5. show a static A5 portrait preview

The preview is intentionally not editable.

## Architecture

- **SwiftUI** — app shell, navigation, toolbar and inspector
- **AppKit** — A5 canvas drawing and desktop interaction foundation
- **Northern Lines Publisher** — remains an external publishing engine
- **Initial integration boundary** — versioned CLI, not yet invoked in Build 001
- **Project format** — open `.nls` package with a JSON manifest and relative content paths

## Requirements

- macOS 14 or newer
- Xcode 16 or newer
- Swift 6 toolchain

## Open in Xcode

```bash
open Package.swift
```

Run the `NorthernLinesStudio` executable scheme and open:

```text
Examples/Norway-Sample.nls
```

## Test

```bash
swift test
```

Tests require macOS because the executable target uses SwiftUI and AppKit.

## Build 001 boundaries

Not included:

- text or object editing
- drag-and-drop
- selection handles
- zoom controls
- layout variants
- Publisher execution
- PDF export
- preflight

See [`docs/builds/BUILD-001.md`](docs/builds/BUILD-001.md).
